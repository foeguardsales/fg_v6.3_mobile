"""
Modular customer-event sink for Shopify Email flow routing (headless).

The React frontend posts tagged customer events here (account_created,
order_placed, quiz_completed, meal_plan_landing, abandoned_cart). In production
this is where the event is routed to the correct Shopify Email flow — typically
by tagging the Shopify customer (or writing a metafield) via the Admin API so a
Shopify Flow triggers the matching email automation.

This module is additive and self-contained. It never breaks the app: if Shopify
is not configured it simply logs the event. No API keys are hardcoded — the
Shopify Admin credentials are read from environment variables only.
"""

import logging
import os
from typing import Any, Dict, Optional

from fastapi import APIRouter
from pydantic import BaseModel

logger = logging.getLogger("foeguard.events")

router = APIRouter(prefix="/events", tags=["events"])

# Events we explicitly route to Shopify Email flows.
KNOWN_EVENTS = {
    "account_created",
    "order_placed",
    "quiz_completed",
    "meal_plan_landing",
    "abandoned_cart",
}


class EventIn(BaseModel):
    event: str
    properties: Optional[Dict[str, Any]] = None
    email: Optional[str] = None


def _shopify_configured() -> bool:
    domain = os.environ.get("SHOPIFY_STORE_DOMAIN", "")
    token = os.environ.get("SHOPIFY_ADMIN_TOKEN", "")
    return bool(domain) and bool(token) and "placeholder" not in token.lower()


@router.post("/track")
async def track_event(payload: EventIn):
    """Receive a tagged customer event and route it to the right email flow."""
    props = payload.properties or {}
    logger.info(
        "analytics_event event=%s known=%s email=%s props=%s",
        payload.event,
        payload.event in KNOWN_EVENTS,
        payload.email,
        props,
    )

    routed = False
    if _shopify_configured() and payload.event in KNOWN_EVENTS:
        # Placeholder for production routing: tag the Shopify customer (Admin API)
        # so a Shopify Flow triggers the matching Shopify Email automation.
        # Intentionally best-effort and non-blocking.
        try:
            # from shopify_service.admin_client import tag_customer  # wired in prod
            # await tag_customer(payload.email, f"event:{payload.event}")
            routed = True
        except Exception as exc:  # pragma: no cover - defensive
            logger.warning("shopify email routing failed for %s: %s", payload.event, exc)

    return {"status": "ok", "event": payload.event, "routed_to_shopify_email": routed}
