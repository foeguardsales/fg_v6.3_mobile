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
"""

from .client import StorefrontClient, AdminClient, get_storefront, get_admin  # noqa: F401
