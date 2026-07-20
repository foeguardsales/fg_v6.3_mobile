"""Admin-only tools for the Shopify integration.

Currently exposes one endpoint:

* ``POST /api/shopify/admin/register-webhooks``

which uses the Admin GraphQL API to (idempotently) create the seven
webhook subscriptions the cache/invalidation layer expects. Also
allows GET-listing of currently-registered webhooks for auditing.

The endpoints are gated by a shared header ``X-Foeguard-Admin-Key``
that must match the ``ADMIN_TOOLS_KEY`` env var (fail-closed if that
env var is missing).  Users of Emergent's preview environment can set
it in ``/app/backend/.env``.
"""

from __future__ import annotations

import logging
import os
from typing import Optional

from fastapi import APIRouter, Header, HTTPException, Query

from .client import ShopifyError, get_admin

logger = logging.getLogger("shopify.admin")

admin_router = APIRouter(prefix="/shopify/admin", tags=["shopify-admin"])


# ---------- config -------------------------------------------------------

WEBHOOK_TOPICS = [
    # (Shopify topic constant, path slug the webhook receiver listens on)
    ("PRODUCTS_UPDATE", "products-update"),
    ("PRODUCTS_DELETE", "products-delete"),
    ("COLLECTIONS_UPDATE", "collections-update"),
    ("INVENTORY_LEVELS_UPDATE", "inventory-update"),
    ("CUSTOMERS_UPDATE", "customers-update"),
    ("CUSTOMERS_CREATE", "customers-create"),
    ("ORDERS_CREATE", "orders-create"),
]


def _admin_key() -> Optional[str]:
    return os.environ.get("ADMIN_TOOLS_KEY")


def _require_admin(x_foeguard_admin_key: Optional[str]) -> None:
    key = _admin_key()
    if not key:
        raise HTTPException(
            status_code=500,
            detail="ADMIN_TOOLS_KEY is not configured on the server.",
        )
    if not x_foeguard_admin_key or x_foeguard_admin_key != key:
        raise HTTPException(status_code=401, detail="Invalid admin key")


# ---------- GraphQL ------------------------------------------------------

_WEBHOOK_SUBSCRIPTIONS_QUERY = """
query WebhookSubscriptions {
  webhookSubscriptions(first: 100) {
    nodes {
      id
      topic
      createdAt
      updatedAt
      endpoint {
        __typename
        ... on WebhookHttpEndpoint { callbackUrl }
      }
    }
  }
}
"""

_WEBHOOK_CREATE_MUTATION = """
mutation WebhookCreate($topic: WebhookSubscriptionTopic!, $callbackUrl: URL!) {
  webhookSubscriptionCreate(
    topic: $topic,
    webhookSubscription: {
      callbackUrl: $callbackUrl,
      format: JSON
    }
  ) {
    webhookSubscription {
      id
      topic
      endpoint { __typename ... on WebhookHttpEndpoint { callbackUrl } }
    }
    userErrors { field message }
  }
}
"""

_WEBHOOK_DELETE_MUTATION = """
mutation WebhookDelete($id: ID!) {
  webhookSubscriptionDelete(id: $id) {
    deletedWebhookSubscriptionId
    userErrors { field message }
  }
}
"""


# ---------- helpers ------------------------------------------------------

def _resolve_base_url(explicit: Optional[str]) -> str:
    """Pick the public base URL that Shopify should POST to.

    Priority:
    1. ?base_url= query param (if provided)
    2. ``PUBLIC_BASE_URL`` env var
    3. ``REACT_APP_BACKEND_URL`` env var  (matches what the frontend uses)
    """
    if explicit:
        return explicit.rstrip("/")
    for env_key in ("PUBLIC_BASE_URL", "REACT_APP_BACKEND_URL"):
        val = os.environ.get(env_key)
        if val:
            return val.rstrip("/")
    raise HTTPException(
        status_code=400,
        detail=(
            "Could not determine public base URL. Pass ?base_url=... "
            "or set PUBLIC_BASE_URL / REACT_APP_BACKEND_URL."
        ),
    )


async def _list_webhooks() -> list[dict]:
    try:
        data = await get_admin().query(_WEBHOOK_SUBSCRIPTIONS_QUERY)
    except ShopifyError as e:
        raise HTTPException(status_code=502, detail=str(e)) from e
    return (data.get("webhookSubscriptions") or {}).get("nodes", [])


# ---------- routes -------------------------------------------------------

@admin_router.get("/webhooks")
async def list_webhooks(
    x_foeguard_admin_key: Optional[str] = Header(None, alias="X-Foeguard-Admin-Key"),
):
    """List every webhook currently registered on this Shopify store."""
    _require_admin(x_foeguard_admin_key)
    subs = await _list_webhooks()
    return {"count": len(subs), "subscriptions": subs}


@admin_router.post("/register-webhooks")
async def register_webhooks(
    base_url: Optional[str] = Query(
        None, description="Public base URL Shopify will POST to. Defaults to REACT_APP_BACKEND_URL."
    ),
    x_foeguard_admin_key: Optional[str] = Header(None, alias="X-Foeguard-Admin-Key"),
):
    """Idempotently create every webhook subscription the backend expects.

    Safe to re-run: existing subscriptions with the SAME topic + callback
    URL are left alone; duplicates are skipped (Shopify itself refuses
    duplicates). New topics get created.
    """
    _require_admin(x_foeguard_admin_key)
    root = _resolve_base_url(base_url)

    existing = await _list_webhooks()
    existing_pairs = {
        (s.get("topic"), (s.get("endpoint") or {}).get("callbackUrl")): s.get("id")
        for s in existing
    }

    created = []
    skipped = []
    errors = []
    for topic, slug in WEBHOOK_TOPICS:
        callback = f"{root}/api/webhooks/shopify/{slug}"
        if (topic, callback) in existing_pairs:
            skipped.append({"topic": topic, "callbackUrl": callback})
            continue
        try:
            data = await get_admin().query(
                _WEBHOOK_CREATE_MUTATION,
                {"topic": topic, "callbackUrl": callback},
            )
        except ShopifyError as e:
            errors.append({"topic": topic, "error": str(e)})
            continue
        node = data.get("webhookSubscriptionCreate") or {}
        errs = node.get("userErrors") or []
        if errs:
            # Shopify returns a friendly error when the exact URL+topic
            # already exists — surface that as a skip rather than an error.
            message = errs[0].get("message", "")
            if "already been taken" in message.lower():
                skipped.append({"topic": topic, "callbackUrl": callback, "reason": message})
            elif "cannot create a webhook subscription" in message.lower():
                errors.append({
                    "topic": topic,
                    "userErrors": errs,
                    "hint": (
                        "Your Shopify custom app is missing scopes to subscribe to this topic. "
                        "In Shopify admin -> Settings -> Apps and sales channels -> Develop apps -> "
                        "<your app> -> Configuration -> Admin API integration, add: "
                        "write_webhooks, read_products, read_customers, read_orders, "
                        "read_inventory. Reinstall/reissue the Admin token and re-run this endpoint."
                    ),
                })
            else:
                errors.append({"topic": topic, "userErrors": errs})
            continue
        created.append(node.get("webhookSubscription"))

    return {
        "root": root,
        "created": created,
        "skipped": skipped,
        "errors": errors,
        "note": (
            "Shopify signs every webhook with the SAME secret the Admin "
            "app was created with (Settings -> Notifications -> Webhooks "
            "-> Signing secret). Copy that value into SHOPIFY_WEBHOOK_SECRET."
        ),
    }


@admin_router.post("/deregister-webhooks")
async def deregister_webhooks(
    x_foeguard_admin_key: Optional[str] = Header(None, alias="X-Foeguard-Admin-Key"),
):
    """Delete every webhook currently subscribed. Useful when rotating URLs."""
    _require_admin(x_foeguard_admin_key)
    existing = await _list_webhooks()
    deleted = []
    errors = []
    for sub in existing:
        try:
            data = await get_admin().query(
                _WEBHOOK_DELETE_MUTATION, {"id": sub["id"]}
            )
        except ShopifyError as e:
            errors.append({"id": sub["id"], "error": str(e)})
            continue
        node = data.get("webhookSubscriptionDelete") or {}
        if node.get("userErrors"):
            errors.append({"id": sub["id"], "userErrors": node["userErrors"]})
        else:
            deleted.append(sub["id"])
    return {"deleted": deleted, "errors": errors}
