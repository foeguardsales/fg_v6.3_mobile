"""Shopify Admin webhook receivers.

Shopify sends signed HTTPS POSTs whenever the merchant changes data.
We use these to auto-invalidate the Shopify response cache so the
headless React frontend never serves stale product / inventory /
customer / order data.

Security
--------
Every incoming request is verified via HMAC-SHA256 against
``SHOPIFY_WEBHOOK_SECRET`` (a shared secret configured in the Shopify
admin when the webhook is registered). Requests without a valid
signature return 401 without touching the cache.

Registered topics (POST to ``/api/webhooks/shopify/{slug}``)::

    products/update         -> purge BUCKET_PRODUCTS + BUCKET_COLLECTIONS
    products/delete         -> purge BUCKET_PRODUCTS + BUCKET_COLLECTIONS
    inventory_levels/update -> purge BUCKET_PRODUCTS (availability changed)
    customers/update        -> no cache to purge; logged for audit
    customers/create        -> no cache to purge; logged for audit
    orders/create           -> purge BUCKET_PRODUCTS (inventory implicitly changed)

Register endpoints in Shopify admin under
``Settings -> Notifications -> Webhooks`` OR programmatically via the
Admin API. Point each topic at ``{PUBLIC_BASE_URL}/api/webhooks/shopify/<slug>``.
"""

from __future__ import annotations

import base64
import hashlib
import hmac
import json
import logging
import os
from typing import Optional

from fastapi import APIRouter, Header, HTTPException, Request

from .cache import (
    get_cache,
    BUCKET_PRODUCTS,
    BUCKET_COLLECTIONS,
    BUCKET_PAGES,
    BUCKET_METAOBJECTS,
)

logger = logging.getLogger("shopify.webhooks")

webhooks_router = APIRouter(prefix="/webhooks/shopify", tags=["shopify-webhooks"])


# ---------- HMAC verification --------------------------------------------

def _webhook_secret() -> Optional[str]:
    """Read the shared secret used to sign incoming webhook payloads."""
    return os.environ.get("SHOPIFY_WEBHOOK_SECRET")


def _verify_hmac(raw_body: bytes, header_hmac: Optional[str]) -> bool:
    secret = _webhook_secret()
    if not secret:
        # No secret configured => refuse everything. Fail-closed on purpose.
        logger.error("SHOPIFY_WEBHOOK_SECRET not configured; rejecting webhook")
        return False
    if not header_hmac:
        return False
    digest = hmac.new(secret.encode("utf-8"), raw_body, hashlib.sha256).digest()
    expected = base64.b64encode(digest).decode("utf-8")
    return hmac.compare_digest(expected, header_hmac)


async def _read_and_verify(
    request: Request,
    x_shopify_hmac_sha256: Optional[str],
) -> dict:
    raw = await request.body()
    if not _verify_hmac(raw, x_shopify_hmac_sha256):
        # Log the domain header for auditability but never echo the payload.
        shop = request.headers.get("X-Shopify-Shop-Domain")
        topic = request.headers.get("X-Shopify-Topic")
        logger.warning(
            "webhook rejected (bad hmac) shop=%s topic=%s", shop, topic
        )
        raise HTTPException(status_code=401, detail="Invalid HMAC signature")
    try:
        return json.loads(raw.decode("utf-8")) if raw else {}
    except json.JSONDecodeError:
        raise HTTPException(status_code=400, detail="Malformed JSON payload")


# ---------- routes -------------------------------------------------------

@webhooks_router.post("/products-update")
async def products_update(
    request: Request,
    x_shopify_hmac_sha256: Optional[str] = Header(None, alias="X-Shopify-Hmac-Sha256"),
    x_shopify_topic: Optional[str] = Header(None, alias="X-Shopify-Topic"),
    x_shopify_shop_domain: Optional[str] = Header(None, alias="X-Shopify-Shop-Domain"),
):
    payload = await _read_and_verify(request, x_shopify_hmac_sha256)
    handle = (payload or {}).get("handle")
    logger.info(
        "webhook products/update shop=%s topic=%s handle=%s",
        x_shopify_shop_domain, x_shopify_topic, handle,
    )
    cache = get_cache()
    # A product change affects collection queries too (title / price / images).
    purged_p = await cache.invalidate_bucket(BUCKET_PRODUCTS)
    purged_c = await cache.invalidate_bucket(BUCKET_COLLECTIONS)
    return {"ok": True, "purged": {"products": purged_p, "collections": purged_c}}


@webhooks_router.post("/products-delete")
async def products_delete(
    request: Request,
    x_shopify_hmac_sha256: Optional[str] = Header(None, alias="X-Shopify-Hmac-Sha256"),
    x_shopify_topic: Optional[str] = Header(None, alias="X-Shopify-Topic"),
    x_shopify_shop_domain: Optional[str] = Header(None, alias="X-Shopify-Shop-Domain"),
):
    payload = await _read_and_verify(request, x_shopify_hmac_sha256)
    logger.info(
        "webhook products/delete shop=%s topic=%s id=%s",
        x_shopify_shop_domain, x_shopify_topic, (payload or {}).get("id"),
    )
    cache = get_cache()
    purged_p = await cache.invalidate_bucket(BUCKET_PRODUCTS)
    purged_c = await cache.invalidate_bucket(BUCKET_COLLECTIONS)
    return {"ok": True, "purged": {"products": purged_p, "collections": purged_c}}


@webhooks_router.post("/collections-update")
async def collections_update(
    request: Request,
    x_shopify_hmac_sha256: Optional[str] = Header(None, alias="X-Shopify-Hmac-Sha256"),
    x_shopify_topic: Optional[str] = Header(None, alias="X-Shopify-Topic"),
    x_shopify_shop_domain: Optional[str] = Header(None, alias="X-Shopify-Shop-Domain"),
):
    payload = await _read_and_verify(request, x_shopify_hmac_sha256)
    logger.info(
        "webhook collections/update shop=%s topic=%s handle=%s",
        x_shopify_shop_domain, x_shopify_topic, (payload or {}).get("handle"),
    )
    purged = await get_cache().invalidate_bucket(BUCKET_COLLECTIONS)
    return {"ok": True, "purged": {"collections": purged}}


@webhooks_router.post("/inventory-update")
async def inventory_update(
    request: Request,
    x_shopify_hmac_sha256: Optional[str] = Header(None, alias="X-Shopify-Hmac-Sha256"),
    x_shopify_topic: Optional[str] = Header(None, alias="X-Shopify-Topic"),
    x_shopify_shop_domain: Optional[str] = Header(None, alias="X-Shopify-Shop-Domain"),
):
    await _read_and_verify(request, x_shopify_hmac_sha256)
    logger.info(
        "webhook inventory_levels/update shop=%s topic=%s",
        x_shopify_shop_domain, x_shopify_topic,
    )
    # availableForSale can flip on any product; safest to clear both buckets.
    cache = get_cache()
    purged_p = await cache.invalidate_bucket(BUCKET_PRODUCTS)
    purged_c = await cache.invalidate_bucket(BUCKET_COLLECTIONS)
    return {"ok": True, "purged": {"products": purged_p, "collections": purged_c}}


@webhooks_router.post("/customers-update")
async def customers_update(
    request: Request,
    x_shopify_hmac_sha256: Optional[str] = Header(None, alias="X-Shopify-Hmac-Sha256"),
    x_shopify_topic: Optional[str] = Header(None, alias="X-Shopify-Topic"),
    x_shopify_shop_domain: Optional[str] = Header(None, alias="X-Shopify-Shop-Domain"),
):
    payload = await _read_and_verify(request, x_shopify_hmac_sha256)
    # We do not cache /customers/me responses (they are token-bound), so
    # there is nothing to purge here — just record the event for audit.
    logger.info(
        "webhook customers/update shop=%s topic=%s email=%s",
        x_shopify_shop_domain, x_shopify_topic, (payload or {}).get("email"),
    )
    return {"ok": True, "purged": {}}


@webhooks_router.post("/customers-create")
async def customers_create(
    request: Request,
    x_shopify_hmac_sha256: Optional[str] = Header(None, alias="X-Shopify-Hmac-Sha256"),
    x_shopify_topic: Optional[str] = Header(None, alias="X-Shopify-Topic"),
    x_shopify_shop_domain: Optional[str] = Header(None, alias="X-Shopify-Shop-Domain"),
):
    payload = await _read_and_verify(request, x_shopify_hmac_sha256)
    logger.info(
        "webhook customers/create shop=%s topic=%s email=%s",
        x_shopify_shop_domain, x_shopify_topic, (payload or {}).get("email"),
    )
    return {"ok": True, "purged": {}}


@webhooks_router.post("/orders-create")
async def orders_create(
    request: Request,
    x_shopify_hmac_sha256: Optional[str] = Header(None, alias="X-Shopify-Hmac-Sha256"),
    x_shopify_topic: Optional[str] = Header(None, alias="X-Shopify-Topic"),
    x_shopify_shop_domain: Optional[str] = Header(None, alias="X-Shopify-Shop-Domain"),
):
    payload = await _read_and_verify(request, x_shopify_hmac_sha256)
    logger.info(
        "webhook orders/create shop=%s topic=%s order_id=%s",
        x_shopify_shop_domain, x_shopify_topic, (payload or {}).get("id"),
    )
    # A new order decrements inventory server-side; purge product buckets so
    # the next request re-fetches fresh availability.
    cache = get_cache()
    purged_p = await cache.invalidate_bucket(BUCKET_PRODUCTS)
    purged_c = await cache.invalidate_bucket(BUCKET_COLLECTIONS)
    return {"ok": True, "purged": {"products": purged_p, "collections": purged_c}}


@webhooks_router.post("/pages-update")
async def pages_update(
    request: Request,
    x_shopify_hmac_sha256: Optional[str] = Header(None, alias="X-Shopify-Hmac-Sha256"),
    x_shopify_topic: Optional[str] = Header(None, alias="X-Shopify-Topic"),
    x_shopify_shop_domain: Optional[str] = Header(None, alias="X-Shopify-Shop-Domain"),
):
    await _read_and_verify(request, x_shopify_hmac_sha256)
    logger.info(
        "webhook pages/update shop=%s topic=%s",
        x_shopify_shop_domain, x_shopify_topic,
    )
    purged = await get_cache().invalidate_bucket(BUCKET_PAGES)
    return {"ok": True, "purged": {"pages": purged}}


# ---------- diagnostics --------------------------------------------------

@webhooks_router.get("/_cache")
async def cache_snapshot():
    """Read-only introspection into the current cache state.

    Never exposes cached VALUES — only sizes / hit rate / bucket counts.
    """
    return get_cache().snapshot()


@webhooks_router.post("/_cache/purge")
async def cache_purge_all():
    """Manual, unauthenticated purge — safe because it only wipes cache,
    it never reads private data. Handy for merchant support."""
    purged = await get_cache().invalidate_all()
    return {"ok": True, "purged": purged}
