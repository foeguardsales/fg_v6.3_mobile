"""
Shopify customer tagging — MODULAR, additive, safe.

Adds tags to a Shopify customer via the Admin GraphQL API without ever
overwriting existing tags. If Shopify Admin is not configured (empty/placeholder
token), all operations become no-ops and log a hint. This lets the rest of the
app (analytics, meal-plan flow, etc.) call `tag_customer_by_email(...)` unconditionally.

Public API:
    await tag_customer_by_email(email: str, tag: str) -> dict
        Idempotently appends `tag` to the customer's tag list, keyed by email.
        Returns {"status": "ok"|"skipped"|"error", ...}
"""
from __future__ import annotations

import logging
import os
from typing import Any, Dict, List, Optional

from .client import get_admin

logger = logging.getLogger("foeguard.customer_tags")


def _admin_configured() -> bool:
    """True only if a real (non-placeholder) Admin token is present."""
    domain = os.environ.get("SHOPIFY_STORE_DOMAIN", "")
    token = os.environ.get("SHOPIFY_ADMIN_TOKEN", "")
    if not domain or not token:
        return False
    if "placeholder" in token.lower():
        return False
    return True


async def _find_customer_by_email(email: str) -> Optional[Dict[str, Any]]:
    """Return {"id": "gid://shopify/Customer/...", "tags": [...]} or None."""
    # Shopify Admin GraphQL: customers query with email filter.
    gql = """
    query FindCustomerByEmail($q: String!) {
      customers(first: 1, query: $q) {
        edges { node { id email tags } }
      }
    }
    """
    admin = get_admin()
    data = await admin.query(gql, {"q": f"email:{email}"})
    edges = ((data or {}).get("customers") or {}).get("edges") or []
    if not edges:
        return None
    node = edges[0].get("node") or {}
    return {"id": node.get("id"), "tags": list(node.get("tags") or [])}


async def tag_customer_by_email(email: str, tag: str) -> Dict[str, Any]:
    """Append `tag` to the customer's tag list (never overwrites).

    Behaviour:
        - No email or no tag → status "skipped" (silent)
        - Shopify Admin not configured → status "skipped" (logs a hint)
        - Customer not found → status "skipped" (customer will be tagged when
          they eventually sign up; a future webhook or reconciliation job can
          replay this)
        - Customer already has the tag → status "ok" (no-op, no API call needed)
        - Otherwise → tagsAdd mutation, status "ok"
    """
    if not email or not tag:
        return {"status": "skipped", "reason": "missing email or tag"}

    if not _admin_configured():
        logger.info(
            "tag_customer skipped (admin not configured): email=%s tag=%s", email, tag
        )
        return {"status": "skipped", "reason": "shopify admin not configured"}

    try:
        found = await _find_customer_by_email(email)
    except Exception as exc:
        logger.warning("tag_customer lookup failed: email=%s err=%s", email, exc)
        return {"status": "error", "reason": f"lookup failed: {exc}"}

    if not found or not found.get("id"):
        logger.info(
            "tag_customer skipped (no customer for email): email=%s tag=%s", email, tag
        )
        return {"status": "skipped", "reason": "customer not found"}

    current: List[str] = [t.strip() for t in (found.get("tags") or []) if t]
    if tag in current:
        return {"status": "ok", "note": "tag already present", "customer_id": found["id"]}

    # tagsAdd is idempotent server-side but we still check locally to avoid
    # unnecessary Admin API traffic.
    gql = """
    mutation TagsAdd($id: ID!, $tags: [String!]!) {
      tagsAdd(id: $id, tags: $tags) {
        userErrors { field message }
        node { ... on Customer { id tags } }
      }
    }
    """
    admin = get_admin()
    try:
        data = await admin.query(gql, {"id": found["id"], "tags": [tag]})
    except Exception as exc:
        logger.warning("tag_customer mutation failed: email=%s err=%s", email, exc)
        return {"status": "error", "reason": f"mutation failed: {exc}"}

    errors = ((data or {}).get("tagsAdd") or {}).get("userErrors") or []
    if errors:
        logger.warning("tag_customer userErrors: email=%s errs=%s", email, errors)
        return {"status": "error", "userErrors": errors}

    node = ((data or {}).get("tagsAdd") or {}).get("node") or {}
    return {
        "status": "ok",
        "customer_id": node.get("id"),
        "tags": list(node.get("tags") or []),
    }
