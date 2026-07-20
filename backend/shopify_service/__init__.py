"""Shopify integration package.

All Shopify calls (Storefront + Admin) go through this package. The FastAPI
router in `router.py` is the ONLY surface the React frontend can reach; the
frontend never talks to Shopify directly. This keeps tokens on the server and
gives us a single point for caching, logging, webhooks, SEO and AI features.

Public services:
  - products      → shopify_service.products
  - collections   → shopify_service.collections
  - cart          → shopify_service.cart
  - customers     → shopify_service.customers (Shopify Customer Auth)
  - checkout      → shopify_service.checkout

Extra infrastructure exposed for `server.py` to mount:
  - cache            → shopify_service.cache (async TTL cache)
  - webhooks_router  → shopify_service.webhooks (HMAC-verified /api/webhooks/shopify/*)
  - shopify_admin_router → shopify_service.admin_tools (webhook self-register)
"""

from .client import StorefrontClient, AdminClient, get_storefront, get_admin  # noqa: F401
from .webhooks import webhooks_router  # noqa: F401
from .admin_tools import admin_router as shopify_admin_router  # noqa: F401
from .cache import get_cache  # noqa: F401

__all__ = [
    "StorefrontClient",
    "AdminClient",
    "get_storefront",
    "get_admin",
    "webhooks_router",
    "shopify_admin_router",
    "get_cache",
]
