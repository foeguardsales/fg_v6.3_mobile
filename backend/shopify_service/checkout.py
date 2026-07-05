"""Checkout — with the Cart API, the checkout URL is a property of the cart.

Shopify has deprecated the legacy Checkout API; the modern flow is:
  1. Create/mutate a Cart via cart_service.
  2. Read `cart.checkoutUrl`.
  3. Redirect the buyer there — Shopify's hosted checkout handles payments,
     shipping, taxes and post-purchase.

This module gives a couple of thin helpers so the router surface stays clean.
"""
from __future__ import annotations

from typing import Any, Dict, Optional

from . import cart as cart_service


async def get_checkout_url(cart_id: str) -> Optional[str]:
    cart = await cart_service.cart_get(cart_id)
    return (cart or {}).get("checkoutUrl")


async def associate_customer_with_cart(cart_id: str, customer_access_token: str) -> Dict[str, Any]:
    """Attach a logged-in customer to a cart so the checkout is pre-filled."""
    return await cart_service.cart_buyer_identity_update(
        cart_id,
        {"customerAccessToken": customer_access_token},
    )
