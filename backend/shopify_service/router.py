"""FastAPI router — the ONLY surface the React app sees.

Mounted at /api/shopify by server.py. Every endpoint returns clean JSON; the
frontend never needs to know a GraphQL query exists.
"""
from __future__ import annotations

import os
from typing import Any, Dict, List, Optional

from fastapi import APIRouter, HTTPException, Query
from pydantic import BaseModel, Field

from . import cart as cart_service
from . import checkout as checkout_service
from . import collections as collection_service
from . import customers as customer_service
from . import products as product_service
from .cache import (
    get_cache,
    make_key,
    BUCKET_PRODUCTS,
    BUCKET_COLLECTIONS,
    BUCKET_PAGES,
    BUCKET_METAOBJECTS,
)
from .client import ShopifyError, get_admin, get_storefront

router = APIRouter(prefix="/api/shopify", tags=["shopify"])


# -------------------------- Helpers ---------------------------------------

def _handle(coro):
    """Uniform try/except → HTTPException."""
    async def runner():
        try:
            return await coro
        except ShopifyError as e:
            raise HTTPException(status_code=e.status or 502, detail={"message": str(e), "errors": e.errors})
    return runner()


# -------------------------- Health / debug --------------------------------

@router.get("/health")
async def shopify_health():
    """Ping both APIs — returns which tokens work. Handy while wiring env vars."""
    storefront_ok = False
    admin_ok = False
    storefront_err: Optional[str] = None
    admin_err: Optional[str] = None
    try:
        await get_storefront().query("{ shop { name primaryDomain { url } } }")
        storefront_ok = True
    except Exception as e:  # noqa: BLE001
        storefront_err = str(e)
    try:
        await get_admin().query("{ shop { name myshopifyDomain } }")
        admin_ok = True
    except Exception as e:  # noqa: BLE001
        admin_err = str(e)
    return {
        "store_domain": os.environ.get("SHOPIFY_STORE_DOMAIN"),
        "api_version": os.environ.get("SHOPIFY_API_VERSION"),
        "storefront": {"ok": storefront_ok, "error": storefront_err},
        "admin": {"ok": admin_ok, "error": admin_err},
    }


# -------------------------- Products --------------------------------------

@router.get("/products")
async def list_products(
    first: int = Query(24, ge=1, le=250),
    after: Optional[str] = None,
    q: Optional[str] = None,
    sort_key: str = Query("BEST_SELLING"),
    reverse: bool = False,
):
    cache = get_cache()
    key = make_key("products.list", first=first, after=after, q=q, sort_key=sort_key, reverse=reverse)
    return await cache.get_or_set(
        key,
        lambda: _handle(product_service.list_products(
            first=first, after=after, query=q, sort_key=sort_key, reverse=reverse
        )),
        bucket=BUCKET_PRODUCTS,
    )


@router.get("/products/{handle}")
async def get_product(handle: str):
    cache = get_cache()
    key = make_key("products.handle", handle=handle)
    p = await cache.get_or_set(
        key,
        lambda: _handle(product_service.get_product_by_handle(handle)),
        bucket=BUCKET_PRODUCTS,
    )
    if not p:
        raise HTTPException(status_code=404, detail="Product not found")
    return p


@router.get("/variants/{variant_id:path}")
async def get_variant(variant_id: str):
    v = await _handle(product_service.get_variant_by_id(variant_id))
    if not v:
        raise HTTPException(status_code=404, detail="Variant not found")
    return v


# -------------------------- Collections -----------------------------------

@router.get("/collections")
async def list_collections(first: int = Query(20, ge=1, le=250), after: Optional[str] = None):
    cache = get_cache()
    key = make_key("collections.list", first=first, after=after)
    return await cache.get_or_set(
        key,
        lambda: _handle(collection_service.list_collections(first=first, after=after)),
        bucket=BUCKET_COLLECTIONS,
    )


@router.get("/collections/{handle}")
async def get_collection(handle: str, products_first: int = 50, products_after: Optional[str] = None):
    cache = get_cache()
    key = make_key("collections.handle", handle=handle, products_first=products_first, products_after=products_after)
    c = await cache.get_or_set(
        key,
        lambda: _handle(collection_service.get_collection_by_handle(
            handle, products_first=products_first, products_after=products_after
        )),
        bucket=BUCKET_COLLECTIONS,
    )
    if not c:
        raise HTTPException(status_code=404, detail="Collection not found")
    return c


# -------------------------- Pages (Shopify content) -----------------------

_PAGES_QUERY = """
query Pages($first: Int!, $after: String) {
  pages(first: $first, after: $after) {
    nodes { id title handle bodySummary body }
    pageInfo { hasNextPage endCursor }
  }
}
"""

_PAGE_QUERY = """
query Page($handle: String!) {
  page(handle: $handle) {
    id title handle body
    metafield(namespace: "foeguard", key: "page_builder") {
      key
      type
      references(first: 40) {
        nodes {
          __typename
          ... on Metaobject {
            id
            type
            handle
            fields {
              key
              value
              type
              reference {
                ... on MediaImage { image { url altText width height } }
                ... on Metaobject {
                  id type handle
                  fields {
                    key value type
                    reference { ... on MediaImage { image { url altText } } }
                  }
                }
              }
              references(first: 25) {
                nodes {
                  ... on MediaImage { image { url altText } }
                  ... on Metaobject {
                    id type handle
                    fields {
                      key value type
                      reference { ... on MediaImage { image { url altText } } }
                    }
                  }
                }
              }
            }
          }
          ... on MediaImage { image { url altText } }
        }
      }
    }
  }
}
"""


async def _fetch_pages(first: int, after: Optional[str]):
    data = await get_storefront().query(_PAGES_QUERY, {"first": first, "after": after})
    return (data or {}).get("pages", {"nodes": [], "pageInfo": {}})


async def _fetch_page(handle: str):
    data = await get_storefront().query(_PAGE_QUERY, {"handle": handle})
    page = (data or {}).get("page")
    if not page:
        return page
    # Normalise the page_builder metafield into a `metafields` array so the
    # frontend pageMeta helpers (indexPageMetafields / getMetafieldMetaobjects)
    # can read ordered sections uniformly. Empty / missing -> [].
    mf = page.pop("metafield", None)
    page["metafields"] = [{**mf, "namespace": "foeguard"}] if mf else []
    return page


@router.get("/pages")
async def list_pages(first: int = Query(50, ge=1, le=250), after: Optional[str] = None):
    cache = get_cache()
    key = make_key("pages.list", first=first, after=after)
    return await cache.get_or_set(
        key,
        lambda: _handle(_fetch_pages(first, after)),
        bucket=BUCKET_PAGES,
    )


@router.get("/page/{handle}")
async def get_page(handle: str):
    cache = get_cache()
    key = make_key("pages.handle", handle=handle)
    p = await cache.get_or_set(
        key,
        lambda: _handle(_fetch_page(handle)),
        bucket=BUCKET_PAGES,
    )
    if not p:
        raise HTTPException(status_code=404, detail="Page not found")
    return p


# -------------------------- Metaobjects -----------------------------------
# Storefront-only reads. Metaobject values often carry references to other
# metaobjects / MediaImages / Products, so we recursively expand up to two
# levels which is enough for our brand-badges → home_outline → sections
# tree. Fields whose value looks like JSON are auto-parsed so the frontend
# does not have to.

METAOBJECT_BY_HANDLE_QUERY = """
query MetaobjectByHandle($type: String!, $handle: String!) {
  metaobject(handle: { type: $type, handle: $handle }) {
    id
    handle
    type
    fields {
      key
      value
      type
      reference {
        __typename
        ... on MediaImage { image { url altText width height } }
        ... on Metaobject {
          id handle type
          fields { key value type }
        }
        ... on Product { id handle title }
        ... on Collection { id handle title }
        ... on Page { id handle title }
      }
      references(first: 30) {
        nodes {
          __typename
          ... on MediaImage { image { url altText width height } }
          ... on Metaobject {
            id handle type
            fields {
              key value type
              reference {
                __typename
                ... on MediaImage { image { url altText width height } }
              }
            }
          }
          ... on Product { id handle title }
          ... on Collection { id handle title }
          ... on Page { id handle title }
        }
      }
    }
  }
}
"""

METAOBJECTS_BY_TYPE_QUERY = """
query MetaobjectsByType($type: String!, $first: Int = 50, $after: String) {
  metaobjects(type: $type, first: $first, after: $after) {
    pageInfo { hasNextPage endCursor }
    nodes {
      id
      handle
      type
      fields {
        key
        value
        type
        reference {
          __typename
          ... on MediaImage { image { url altText width height } }
          ... on Metaobject { id handle type fields { key value type } }
          ... on Product { id handle title }
          ... on Collection { id handle title }
          ... on Page { id handle title }
        }
        references(first: 30) {
          nodes {
            __typename
            ... on MediaImage { image { url altText width height } }
            ... on Metaobject { id handle type fields { key value type } }
            ... on Product { id handle title }
            ... on Collection { id handle title }
            ... on Page { id handle title }
          }
        }
      }
    }
  }
}
"""


@router.get("/metaobject/{type}/{handle}")
async def get_metaobject(type: str, handle: str):
    """Fetch a single metaobject entry (Storefront API, publishable)."""
    cache = get_cache()
    key = make_key("metaobjects.entry", type=type, handle=handle)

    async def loader():
        data = await get_storefront().query(
            METAOBJECT_BY_HANDLE_QUERY,
            {"type": type, "handle": handle},
        )
        return data.get("metaobject")

    obj = await cache.get_or_set(key, loader, bucket=BUCKET_METAOBJECTS)
    if not obj:
        raise HTTPException(status_code=404, detail="Metaobject not found")
    return obj


@router.get("/metaobjects/{type}")
async def list_metaobjects(
    type: str,
    first: int = Query(50, ge=1, le=100),
    after: Optional[str] = None,
):
    """List every published metaobject entry of a given type."""
    cache = get_cache()
    key = make_key("metaobjects.list", type=type, first=first, after=after)

    async def loader():
        data = await get_storefront().query(
            METAOBJECTS_BY_TYPE_QUERY,
            {"type": type, "first": first, "after": after},
        )
        return data.get("metaobjects", {"nodes": [], "pageInfo": {}})

    return await cache.get_or_set(key, loader, bucket=BUCKET_METAOBJECTS)


# -------------------------- Cart ------------------------------------------

class CartLineInput(BaseModel):
    merchandiseId: str
    quantity: int = Field(ge=1)
    attributes: Optional[List[Dict[str, str]]] = None
    sellingPlanId: Optional[str] = None


class CartLineUpdateInput(BaseModel):
    id: str
    quantity: Optional[int] = Field(default=None, ge=0)
    merchandiseId: Optional[str] = None
    attributes: Optional[List[Dict[str, str]]] = None


class CartCreateBody(BaseModel):
    lines: Optional[List[CartLineInput]] = None
    buyerIdentity: Optional[Dict[str, Any]] = None
    attributes: Optional[List[Dict[str, str]]] = None
    discountCodes: Optional[List[str]] = None


@router.post("/cart")
async def create_cart(body: CartCreateBody):
    return await _handle(cart_service.cart_create(
        lines=[line.dict(exclude_none=True) for line in body.lines] if body.lines else None,
        buyer_identity=body.buyerIdentity,
        attributes=body.attributes,
        discount_codes=body.discountCodes,
    ))


@router.get("/cart/{cart_id:path}")
async def get_cart(cart_id: str):
    c = await _handle(cart_service.cart_get(cart_id))
    if not c:
        raise HTTPException(status_code=404, detail="Cart not found")
    return c


class CartLinesBody(BaseModel):
    cartId: str
    lines: List[CartLineInput]


@router.post("/cart/lines/add")
async def add_cart_lines(body: CartLinesBody):
    return await _handle(cart_service.cart_lines_add(body.cartId, [l.dict(exclude_none=True) for l in body.lines]))


class CartLinesUpdateBody(BaseModel):
    cartId: str
    lines: List[CartLineUpdateInput]


@router.post("/cart/lines/update")
async def update_cart_lines(body: CartLinesUpdateBody):
    return await _handle(cart_service.cart_lines_update(body.cartId, [l.dict(exclude_none=True) for l in body.lines]))


class CartLinesRemoveBody(BaseModel):
    cartId: str
    lineIds: List[str]


@router.post("/cart/lines/remove")
async def remove_cart_lines(body: CartLinesRemoveBody):
    return await _handle(cart_service.cart_lines_remove(body.cartId, body.lineIds))


class CartBuyerBody(BaseModel):
    cartId: str
    buyerIdentity: Dict[str, Any]


@router.post("/cart/buyer")
async def update_cart_buyer(body: CartBuyerBody):
    return await _handle(cart_service.cart_buyer_identity_update(body.cartId, body.buyerIdentity))


class CartDiscountBody(BaseModel):
    cartId: str
    codes: List[str]


@router.post("/cart/discount")
async def update_cart_discount(body: CartDiscountBody):
    return await _handle(cart_service.cart_discount_codes_update(body.cartId, body.codes))


class CartAttrsBody(BaseModel):
    cartId: str
    attributes: List[Dict[str, str]]


@router.post("/cart/attributes")
async def update_cart_attributes(body: CartAttrsBody):
    return await _handle(cart_service.cart_attributes_update(body.cartId, body.attributes))


# -------------------------- Checkout --------------------------------------

@router.get("/checkout/{cart_id:path}")
async def get_checkout_url(cart_id: str):
    url = await _handle(checkout_service.get_checkout_url(cart_id))
    if not url:
        raise HTTPException(status_code=404, detail="Cart or checkoutUrl not found")
    return {"checkoutUrl": url}


class CheckoutAssociateBody(BaseModel):
    cartId: str
    customerAccessToken: str


@router.post("/checkout/associate")
async def associate_checkout_customer(body: CheckoutAssociateBody):
    return await _handle(checkout_service.associate_customer_with_cart(body.cartId, body.customerAccessToken))


# -------------------------- Customers (Shopify Auth) ----------------------

class CustomerCreateBody(BaseModel):
    email: str
    password: str
    firstName: Optional[str] = None
    lastName: Optional[str] = None
    acceptsMarketing: bool = False


@router.post("/customers/create")
async def customer_create(body: CustomerCreateBody):
    return await _handle(customer_service.customer_create(
        email=body.email,
        password=body.password,
        first_name=body.firstName,
        last_name=body.lastName,
        accepts_marketing=body.acceptsMarketing,
    ))


class CustomerLoginBody(BaseModel):
    email: str
    password: str


@router.post("/customers/login")
async def customer_login(body: CustomerLoginBody):
    return await _handle(customer_service.customer_access_token_create(body.email, body.password))


class TokenBody(BaseModel):
    accessToken: str


@router.post("/customers/token/renew")
async def customer_token_renew(body: TokenBody):
    return await _handle(customer_service.customer_access_token_renew(body.accessToken))


@router.post("/customers/logout")
async def customer_logout(body: TokenBody):
    return await _handle(customer_service.customer_access_token_delete(body.accessToken))


class RecoverBody(BaseModel):
    email: str


@router.post("/customers/recover")
async def customer_recover(body: RecoverBody):
    return await _handle(customer_service.customer_recover(body.email))


class ResetBody(BaseModel):
    resetUrl: str
    password: str


@router.post("/customers/reset")
async def customer_reset(body: ResetBody):
    return await _handle(customer_service.customer_reset_by_url(body.resetUrl, body.password))


@router.post("/customers/me")
async def customer_me(body: TokenBody):
    me = await _handle(customer_service.customer_get(body.accessToken))
    if not me:
        raise HTTPException(status_code=401, detail="Invalid or expired customer token")
    return me


class CustomerUpdateBody(BaseModel):
    accessToken: str
    patch: Dict[str, Any]


@router.post("/customers/update")
async def customer_update(body: CustomerUpdateBody):
    return await _handle(customer_service.customer_update(body.accessToken, body.patch))
