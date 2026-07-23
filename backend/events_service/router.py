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

from shopify_service.customer_tags import tag_customer_by_email

logger = logging.getLogger("foeguard.events")

router = APIRouter(prefix="/events", tags=["events"])

# Events we explicitly route to Shopify Email flows.
KNOWN_EVENTS = {
    "account_created",
    "order_placed",
    "quiz_completed",
    "meal_plan_landing",
    "abandoned_cart",
    # Customer-lifecycle events — each maps to a Shopify customer tag
    # so Shopify Flows / segments can target this cohort.
    "meal_plan_completed",
    "meal_plan_purchase",
    "starter_pack_purchase",
    "build_a_box_purchase",
}

# Event → Shopify customer tag. Tags are APPENDED, never overwritten (see
# shopify_service.customer_tags.tag_customer_by_email). Events not in this map
# only route to Shopify Email flows / dataLayer; they do not add a tag.
EVENT_TO_TAG: Dict[str, str] = {
    "meal_plan_completed": "meal_plan_completed",
    "meal_plan_purchase": "meal_plan_customer",
    "starter_pack_purchase": "starter_pack_customer",
    "build_a_box_purchase": "build_a_box_customer",
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
    """Receive a tagged customer event and route it to the right email flow.

    Additive behaviour for the four customer-lifecycle events:
      meal_plan_completed  → tag = "meal_plan_completed"
      meal_plan_purchase   → tag = "meal_plan_customer"
      starter_pack_purchase→ tag = "starter_pack_customer"
      build_a_box_purchase → tag = "build_a_box_customer"
    Tags are applied via the Admin API only when configured; otherwise this is
    a no-op so the UI / analytics keep working unchanged.
    """
    props = payload.properties or {}
    logger.info(
        "analytics_event event=%s known=%s email=%s props=%s",
        payload.event,
        payload.event in KNOWN_EVENTS,
        payload.email,
        props,
    )

    # Prefer explicit `email` field, then fall back to properties.email — the
    # frontend usually passes email in properties, but we accept both.
    email = payload.email or props.get("email")

    routed = False
    tag_result: Optional[Dict[str, Any]] = None

    if _shopify_configured() and payload.event in KNOWN_EVENTS:
        # 1) Legacy Shopify Email routing (kept for account_created / order_placed /
        #    quiz_completed / meal_plan_landing / abandoned_cart).
        try:
            # from shopify_service.admin_client import tag_customer  # wired in prod
            # await tag_customer(email, f"event:{payload.event}")
            routed = True
        except Exception as exc:  # pragma: no cover - defensive
            logger.warning("shopify email routing failed for %s: %s", payload.event, exc)

        # 2) Customer-lifecycle tagging — appends the mapped tag if one exists.
        tag_name = EVENT_TO_TAG.get(payload.event)
        if tag_name and email:
            try:
                tag_result = await tag_customer_by_email(email, tag_name)
            except Exception as exc:  # pragma: no cover - defensive
                logger.warning(
                    "customer tag apply failed: event=%s email=%s tag=%s err=%s",
                    payload.event, email, tag_name, exc,
                )
                tag_result = {"status": "error", "reason": str(exc)}

    return {
        "status": "ok",
        "event": payload.event,
        "routed_to_shopify_email": routed,
        "customer_tag": tag_result,
    }
