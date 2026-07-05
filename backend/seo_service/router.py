"""FastAPI router that generates SEO output entirely from Shopify data.

Exposes under `/api`:
  GET  /api/seo/home
  GET  /api/seo/product/{handle}
  GET  /api/seo/collection/{handle}
  GET  /api/seo/organization
  GET  /api/sitemap.xml     (Content-Type: application/xml)
  GET  /api/robots.txt      (Content-Type: text/plain)

The frontend calls the JSON endpoints on route change and injects the
tags via react-helmet-async so crawlers that render JavaScript (Google,
Bing) receive fully-populated `<head>` metadata. `sitemap.xml` and
`robots.txt` are true server responses that any crawler can consume
without JS.
"""

from __future__ import annotations

import asyncio
import logging
import os
import re
import time
from typing import Any, Dict, List, Optional
from urllib.parse import quote
from xml.sax.saxutils import escape as xml_escape

from fastapi import APIRouter, HTTPException, Path
from fastapi.responses import Response

from shopify_service import queries as Q
from shopify_service.client import ShopifyError, get_storefront

logger = logging.getLogger("seo")

seo_router = APIRouter(tags=["seo"])


# ---------------------------------------------------------------------------
# Config helpers
# ---------------------------------------------------------------------------

def _site_base_url(shop_info: Optional[Dict[str, Any]] = None) -> str:
    """Absolute URL used for canonicals / sitemap / og:url.

    Priority:
      1. `SEO_BASE_URL` env var (set in production)
      2. Shopify shop.primaryDomain.url (canonical brand domain)
      3. Fallback to https://<SHOPIFY_STORE_DOMAIN>
    """
    env = os.environ.get("SEO_BASE_URL")
    if env:
        return env.rstrip("/")
    if shop_info and shop_info.get("primaryDomain", {}).get("url"):
        return shop_info["primaryDomain"]["url"].rstrip("/")
    domain = os.environ.get("SHOPIFY_STORE_DOMAIN", "")
    if domain:
        return f"https://{domain}"
    return ""


def _strip_html(html: Optional[str]) -> str:
    if not html:
        return ""
    text = re.sub(r"<[^>]+>", " ", html)
    text = re.sub(r"\s+", " ", text).strip()
    return text


def _clip(text: str, limit: int) -> str:
    text = (text or "").strip()
    if len(text) <= limit:
        return text
    trimmed = text[: limit - 1].rsplit(" ", 1)[0]
    return trimmed.rstrip(",.;:") + "\u2026"


# ---------------------------------------------------------------------------
# Cache (Shopify data changes slowly; refresh every 5 minutes)
# ---------------------------------------------------------------------------

_CACHE: Dict[str, Any] = {}
_CACHE_TTL = 300.0  # 5 minutes


async def _cached(key: str, loader):
    now = time.time()
    hit = _CACHE.get(key)
    if hit and (now - hit["at"] < _CACHE_TTL):
        return hit["value"]
    try:
        value = await loader()
        _CACHE[key] = {"value": value, "at": now}
        return value
    except Exception:  # noqa: BLE001
        if hit:
            return hit["value"]  # graceful fallback to stale cache
        raise


# ---------------------------------------------------------------------------
# Shopify fetchers
# ---------------------------------------------------------------------------

async def _fetch_shop() -> Dict[str, Any]:
    async def loader():
        data = await get_storefront().execute(Q.STOREFRONT_SHOP_QUERY)
        return data.get("shop", {}) or {}
    return await _cached("shop", loader)


async def _fetch_product(handle: str) -> Optional[Dict[str, Any]]:
    key = f"product:{handle}"

    async def loader():
        data = await get_storefront().execute(
            Q.PRODUCT_BY_HANDLE_QUERY, {"handle": handle}
        )
        return data.get("product")
    return await _cached(key, loader)


async def _fetch_collection(handle: str) -> Optional[Dict[str, Any]]:
    key = f"collection:{handle}"

    async def loader():
        data = await get_storefront().execute(
            Q.COLLECTION_BY_HANDLE_QUERY, {"handle": handle, "first": 4}
        )
        return data.get("collection")
    return await _cached(key, loader)


async def _fetch_all_products() -> List[Dict[str, Any]]:
    async def loader():
        out: List[Dict[str, Any]] = []
        after: Optional[str] = None
        for _ in range(20):  # hard cap so we can't runaway
            data = await get_storefront().execute(
                Q.PRODUCTS_LIST_QUERY, {"first": 100, "after": after, "query": None}
            )
            page = data.get("products", {})
            out.extend(page.get("nodes", []))
            info = page.get("pageInfo", {}) or {}
            if not info.get("hasNextPage"):
                break
            after = info.get("endCursor")
            if not after:
                break
        return out
    return await _cached("all_products", loader)


async def _fetch_all_collections() -> List[Dict[str, Any]]:
    async def loader():
        data = await get_storefront().execute(
            Q.COLLECTIONS_LIST_QUERY, {"first": 100, "after": None}
        )
        return (data.get("collections", {}) or {}).get("nodes", []) or []
    return await _cached("all_collections", loader)


# ---------------------------------------------------------------------------
# SEO payload builders
# ---------------------------------------------------------------------------

def _build_org_jsonld(shop: Dict[str, Any], base_url: str) -> Dict[str, Any]:
    logo = None
    brand = shop.get("brand") or {}
    logo_field = brand.get("logo") or brand.get("squareLogo") or {}
    if logo_field and logo_field.get("image", {}).get("url"):
        logo = logo_field["image"]["url"]
    org = {
        "@context": "https://schema.org",
        "@type": "Organization",
        "name": shop.get("name") or "FoeGuard",
        "url": base_url or "",
        "description": _clip(brand.get("shortDescription") or shop.get("description") or "", 300),
    }
    if brand.get("slogan"):
        org["slogan"] = brand["slogan"]
    if logo:
        org["logo"] = logo
    return org


def _build_breadcrumbs(base_url: str, crumbs: List[Dict[str, str]]) -> Dict[str, Any]:
    return {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        "itemListElement": [
            {
                "@type": "ListItem",
                "position": i + 1,
                "name": c["name"],
                "item": f"{base_url}{c['path']}" if not c["path"].startswith("http") else c["path"],
            }
            for i, c in enumerate(crumbs)
        ],
    }


def _availability_uri(product: Dict[str, Any]) -> str:
    return (
        "https://schema.org/InStock"
        if product.get("availableForSale")
        else "https://schema.org/OutOfStock"
    )


def _product_jsonld(product: Dict[str, Any], base_url: str) -> Dict[str, Any]:
    handle = product.get("handle")
    canonical = f"{base_url}/product/{handle}"
    images = [i.get("url") for i in (product.get("images", {}).get("nodes") or []) if i.get("url")]
    featured = (product.get("featuredImage") or {}).get("url")
    if featured and featured not in images:
        images.insert(0, featured)
    price_range = product.get("priceRange") or {}
    min_price = (price_range.get("minVariantPrice") or {}).get("amount")
    max_price = (price_range.get("maxVariantPrice") or {}).get("amount")
    currency = ((price_range.get("minVariantPrice") or {}).get("currencyCode")) or "CAD"

    offers: Any
    variants = (product.get("variants", {}).get("nodes") or [])
    if len(variants) > 1 and min_price != max_price:
        offers = {
            "@type": "AggregateOffer",
            "priceCurrency": currency,
            "lowPrice": str(min_price or "0"),
            "highPrice": str(max_price or min_price or "0"),
            "offerCount": len(variants),
            "availability": _availability_uri(product),
            "url": canonical,
        }
    else:
        v = variants[0] if variants else {}
        offers = {
            "@type": "Offer",
            "priceCurrency": currency,
            "price": str((v.get("price") or {}).get("amount") or min_price or "0"),
            "availability": _availability_uri(product),
            "url": canonical,
            "itemCondition": "https://schema.org/NewCondition",
        }
        if v.get("sku"):
            offers["sku"] = v.get("sku")

    ld: Dict[str, Any] = {
        "@context": "https://schema.org",
        "@type": "Product",
        "name": product.get("title") or "",
        "description": _clip(_strip_html(product.get("description") or product.get("descriptionHtml")), 500),
        "image": images[:6],
        "url": canonical,
        "sku": (variants[0].get("sku") if variants else None) or handle,
        "brand": {
            "@type": "Brand",
            "name": product.get("vendor") or "FoeGuard",
        },
        "offers": offers,
    }
    if product.get("productType"):
        ld["category"] = product["productType"]
    return ld


def _og_image_from_product(product: Dict[str, Any]) -> Optional[str]:
    f = (product.get("featuredImage") or {}).get("url")
    if f:
        return f
    images = product.get("images", {}).get("nodes") or []
    if images:
        return images[0].get("url")
    return None


# ---------------------------------------------------------------------------
# Endpoints — JSON payloads
# ---------------------------------------------------------------------------

@seo_router.get("/seo/site/home")
async def seo_home():
    try:
        shop = await _fetch_shop()
    except ShopifyError as e:
        raise HTTPException(status_code=502, detail=str(e)) from e
    base_url = _site_base_url(shop)
    name = shop.get("name") or "FoeGuard"
    desc = shop.get("description") or (shop.get("brand", {}) or {}).get("shortDescription") or ""
    logo = ((shop.get("brand", {}) or {}).get("logo", {}) or {}).get("image", {}).get("url")

    return {
        "title": _clip(name, 60),
        "description": _clip(desc, 160),
        "canonical": base_url or "/",
        "og": {
            "type": "website",
            "title": _clip(name, 60),
            "description": _clip(desc, 160),
            "url": base_url or "/",
            "image": logo,
            "site_name": name,
        },
        "twitter": {
            "card": "summary_large_image",
            "title": _clip(name, 60),
            "description": _clip(desc, 160),
            "image": logo,
        },
        "jsonLd": [_build_org_jsonld(shop, base_url)],
    }


@seo_router.get("/seo/site/organization")
async def seo_organization():
    try:
        shop = await _fetch_shop()
    except ShopifyError as e:
        raise HTTPException(status_code=502, detail=str(e)) from e
    base_url = _site_base_url(shop)
    return {"jsonLd": [_build_org_jsonld(shop, base_url)]}


@seo_router.get("/seo/product/{handle}")
async def seo_product(handle: str = Path(..., min_length=1)):
    try:
        product = await _fetch_product(handle)
        shop = await _fetch_shop()
    except ShopifyError as e:
        raise HTTPException(status_code=502, detail=str(e)) from e
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")

    base_url = _site_base_url(shop)
    canonical = f"{base_url}/product/{quote(handle, safe='')}"

    seo = product.get("seo") or {}
    default_title = product.get("title") or ""
    default_desc = _strip_html(product.get("description") or product.get("descriptionHtml") or "")

    title = _clip(seo.get("title") or default_title, 60)
    description = _clip(seo.get("description") or default_desc, 160)

    site_name = shop.get("name") or "FoeGuard"
    full_title = f"{title} | {site_name}" if title and site_name and site_name not in title else title

    og_img = _og_image_from_product(product)

    breadcrumbs = _build_breadcrumbs(base_url, [
        {"name": "Home", "path": "/"},
        {"name": "Menu", "path": "/menu"},
        {"name": product.get("title") or handle, "path": f"/product/{handle}"},
    ])

    return {
        "title": _clip(full_title, 70),
        "description": description,
        "canonical": canonical,
        "og": {
            "type": "product",
            "title": full_title,
            "description": description,
            "url": canonical,
            "image": og_img,
            "site_name": site_name,
        },
        "twitter": {
            "card": "summary_large_image",
            "title": full_title,
            "description": description,
            "image": og_img,
        },
        "jsonLd": [
            _product_jsonld(product, base_url),
            breadcrumbs,
            _build_org_jsonld(shop, base_url),
        ],
    }


@seo_router.get("/seo/collection/{handle}")
async def seo_collection(handle: str = Path(..., min_length=1)):
    try:
        collection = await _fetch_collection(handle)
        shop = await _fetch_shop()
    except ShopifyError as e:
        raise HTTPException(status_code=502, detail=str(e)) from e
    if not collection:
        raise HTTPException(status_code=404, detail="Collection not found")

    base_url = _site_base_url(shop)
    canonical = f"{base_url}/collection/{quote(handle, safe='')}"
    seo = collection.get("seo") or {}
    default_title = collection.get("title") or ""
    default_desc = _strip_html(collection.get("description") or collection.get("descriptionHtml") or "")

    title = _clip(seo.get("title") or default_title, 60)
    description = _clip(seo.get("description") or default_desc, 160)
    site_name = shop.get("name") or "FoeGuard"
    full_title = f"{title} | {site_name}" if title and site_name and site_name not in title else title

    og_img = (collection.get("image") or {}).get("url")

    breadcrumbs = _build_breadcrumbs(base_url, [
        {"name": "Home", "path": "/"},
        {"name": "Collections", "path": "/menu"},
        {"name": collection.get("title") or handle, "path": f"/collection/{handle}"},
    ])

    # CollectionPage JSON-LD with a brief ItemList of the first products.
    products = collection.get("products", {}).get("nodes") or []
    item_list = [
        {
            "@type": "ListItem",
            "position": idx + 1,
            "url": f"{base_url}/product/{p['handle']}",
            "name": p.get("title"),
        }
        for idx, p in enumerate(products[:20])
        if p.get("handle")
    ]
    collection_ld = {
        "@context": "https://schema.org",
        "@type": "CollectionPage",
        "name": collection.get("title") or "",
        "description": description,
        "url": canonical,
        "mainEntity": {
            "@type": "ItemList",
            "itemListElement": item_list,
            "numberOfItems": len(item_list),
        },
    }

    return {
        "title": _clip(full_title, 70),
        "description": description,
        "canonical": canonical,
        "og": {
            "type": "website",
            "title": full_title,
            "description": description,
            "url": canonical,
            "image": og_img,
            "site_name": site_name,
        },
        "twitter": {
            "card": "summary_large_image",
            "title": full_title,
            "description": description,
            "image": og_img,
        },
        "jsonLd": [collection_ld, breadcrumbs, _build_org_jsonld(shop, base_url)],
    }


# ---------------------------------------------------------------------------
# sitemap.xml  &  robots.txt
# ---------------------------------------------------------------------------

# Static routes that should appear in the sitemap alongside dynamic Shopify
# content. Priority + change frequency are conservative defaults.
_STATIC_ROUTES = [
    ("/", 1.0, "daily"),
    ("/menu", 0.9, "daily"),
    ("/about", 0.6, "monthly"),
    ("/contact", 0.5, "monthly"),
    ("/faq", 0.5, "monthly"),
    ("/delivery", 0.5, "monthly"),
    ("/policies", 0.4, "yearly"),
    ("/terms", 0.4, "yearly"),
    ("/blog", 0.6, "weekly"),
    ("/new-to-raw", 0.6, "monthly"),
    ("/calculator", 0.5, "monthly"),
]


def _iso(dt: Optional[str]) -> Optional[str]:
    if not dt:
        return None
    return dt  # Shopify already returns ISO 8601 timestamps


def _sitemap_url(loc: str, lastmod: Optional[str] = None, changefreq: Optional[str] = None, priority: Optional[float] = None) -> str:
    parts = [f"<loc>{xml_escape(loc)}</loc>"]
    if lastmod:
        parts.append(f"<lastmod>{xml_escape(lastmod)}</lastmod>")
    if changefreq:
        parts.append(f"<changefreq>{changefreq}</changefreq>")
    if priority is not None:
        parts.append(f"<priority>{priority:.1f}</priority>")
    return "<url>" + "".join(parts) + "</url>"


@seo_router.get("/sitemap.xml")
async def sitemap_xml():
    try:
        shop, products, collections = await asyncio.gather(
            _fetch_shop(), _fetch_all_products(), _fetch_all_collections()
        )
    except ShopifyError as e:
        raise HTTPException(status_code=502, detail=str(e)) from e

    base = _site_base_url(shop)
    urls: List[str] = []

    for path, prio, freq in _STATIC_ROUTES:
        urls.append(_sitemap_url(f"{base}{path}", changefreq=freq, priority=prio))

    for c in collections:
        handle = c.get("handle")
        if not handle:
            continue
        urls.append(_sitemap_url(
            f"{base}/collection/{handle}",
            lastmod=_iso(c.get("updatedAt")),
            changefreq="weekly",
            priority=0.7,
        ))

    for p in products:
        handle = p.get("handle")
        if not handle:
            continue
        # Only publish products that are actually purchasable
        if p.get("availableForSale") is False:
            # Still include in sitemap but with slightly lower priority — Google
            # de-ranks OOS pages naturally via schema availability, but they
            # remain indexable.
            prio = 0.5
        else:
            prio = 0.8
        urls.append(_sitemap_url(
            f"{base}/product/{handle}",
            lastmod=_iso(p.get("updatedAt") or p.get("publishedAt")),
            changefreq="weekly",
            priority=prio,
        ))

    xml = (
        "<?xml version=\"1.0\" encoding=\"UTF-8\"?>"
        "<urlset xmlns=\"http://www.sitemaps.org/schemas/sitemap/0.9\">"
        + "".join(urls)
        + "</urlset>"
    )
    return Response(
        content=xml,
        media_type="application/xml",
        headers={"Cache-Control": "public, max-age=300"},
    )


@seo_router.get("/robots.txt")
async def robots_txt():
    try:
        shop = await _fetch_shop()
    except ShopifyError:
        shop = {}
    base = _site_base_url(shop)
    lines = [
        "User-agent: *",
        "Allow: /",
        "Disallow: /admin",
        "Disallow: /admin/",
        "Disallow: /account/",
        "Disallow: /checkout",
        "Disallow: /api/",
        "",
        f"Sitemap: {base}/api/sitemap.xml",
        "",
    ]
    return Response(
        content="\n".join(lines),
        media_type="text/plain",
        headers={"Cache-Control": "public, max-age=3600"},
    )
