"""Shopify integration layer.

Exposes a FastAPI router (`shopify_router`) that surfaces Storefront +
Admin functionality under `/api/shopify/*`. The frontend must talk only
to this router; the Admin token must never leave the backend.
"""

from .router import shopify_router

__all__ = ["shopify_router"]
