"""Shopify integration layer.

Exposes two FastAPI routers:

* ``shopify_router`` -> ``/api/shopify/*`` (Storefront + Admin proxy)
* ``webhooks_router`` -> ``/api/webhooks/shopify/*`` (signed webhooks)

The frontend must only talk to ``shopify_router``. Shopify itself POSTs
to ``webhooks_router`` (HMAC-verified) whenever data changes so the
proxy cache can auto-invalidate.
"""

from .router import shopify_router
from .webhooks import webhooks_router
from .admin_tools import admin_router as shopify_admin_router
from .cache import get_cache

__all__ = ["shopify_router", "webhooks_router", "shopify_admin_router", "get_cache"]
