"""Server-generated SEO for the FoeGuard headless storefront.

All SEO values are derived from Shopify (Storefront API):
  - product.seo.title / seo.description (falls back to product.title /
    Shopify SEO defaults if the merchant hasn't set them)
  - product.title, description, images, priceRange, availability, vendor
  - collection.seo.*
  - shop.name / description / brand.logo / primaryDomain

Nothing is hardcoded per-page — change the SEO in Shopify Admin, refresh
the cache, and the site's `<title>`, meta description, Open Graph tags,
Twitter card, product JSON-LD, breadcrumb JSON-LD, sitemap.xml, and
robots.txt all update automatically.
"""

from .router import seo_router

__all__ = ["seo_router"]
