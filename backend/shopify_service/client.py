"""Low-level Shopify GraphQL clients.

StorefrontClient  → public storefront data (products, collections, cart, customer
                    auth). Uses the Storefront Access Token.
AdminClient       → privileged server-side ops (inventory, orders, metafields).
                    Uses the Admin Access Token. NEVER expose this to the browser.

Both are thin async wrappers around httpx with:
  * automatic retry on 429 / 5xx (respects Retry-After)
  * uniform error surface (raises ShopifyError with a nice message)
  * a single query() method — no duplication in the per-resource services
"""
from __future__ import annotations

import asyncio
import logging
import os
from functools import lru_cache
from typing import Any, Dict, Optional

import httpx

log = logging.getLogger("shopify")


class ShopifyError(RuntimeError):
    """Raised for any Shopify GraphQL / transport failure."""

    def __init__(self, message: str, *, status: int | None = None, errors: Any = None):
        super().__init__(message)
        self.status = status
        self.errors = errors


class _BaseGQLClient:
    endpoint_suffix: str  # e.g. "/api/{ver}/graphql.json"  or  "/admin/api/{ver}/graphql.json"
    token_header: str      # e.g. "X-Shopify-Storefront-Access-Token" or "X-Shopify-Access-Token"

    def __init__(self, store_domain: str, token: str, api_version: str):
        if not store_domain or not token:
            raise ShopifyError(f"{self.__class__.__name__} missing store_domain or token")
        self.store_domain = store_domain.strip()
        self.token = token.strip()
        self.api_version = api_version.strip()
        self._url = f"https://{self.store_domain}{self.endpoint_suffix.format(ver=self.api_version)}"

    async def query(
        self,
        query: str,
        variables: Optional[Dict[str, Any]] = None,
        *,
        operation_name: Optional[str] = None,
        max_retries: int = 3,
    ) -> Dict[str, Any]:
        """Execute a GraphQL query. Returns the `data` block; raises ShopifyError on failure."""
        payload: Dict[str, Any] = {"query": query, "variables": variables or {}}
        if operation_name:
            payload["operationName"] = operation_name
        headers = {
            "Content-Type": "application/json",
            "Accept": "application/json",
            self.token_header: self.token,
        }
        backoff = 1.0
        last_err: Optional[Exception] = None
        async with httpx.AsyncClient(timeout=20) as http:
            for attempt in range(1, max_retries + 1):
                try:
                    r = await http.post(self._url, json=payload, headers=headers)
                    if r.status_code == 429 or 500 <= r.status_code < 600:
                        retry_after = float(r.headers.get("Retry-After", backoff))
                        log.warning("Shopify %s -> %s, retry in %.1fs (attempt %d)", self._url, r.status_code, retry_after, attempt)
                        await asyncio.sleep(retry_after)
                        backoff *= 2
                        continue
                    body = r.json()
                    if r.status_code >= 400:
                        raise ShopifyError(
                            f"Shopify HTTP {r.status_code}: {body}",
                            status=r.status_code,
                            errors=body,
                        )
                    if body.get("errors"):
                        raise ShopifyError("Shopify GraphQL errors", errors=body["errors"])
                    return body.get("data") or {}
                except (httpx.TransportError, httpx.TimeoutException) as e:
                    last_err = e
                    log.warning("Shopify transport error on attempt %d: %s", attempt, e)
                    await asyncio.sleep(backoff)
                    backoff *= 2
        raise ShopifyError(f"Shopify request failed after {max_retries} retries: {last_err}")


class StorefrontClient(_BaseGQLClient):
    """Public storefront GraphQL — safe surface for products, collections, cart, customer auth."""

    endpoint_suffix = "/api/{ver}/graphql.json"
    token_header = "X-Shopify-Storefront-Access-Token"


class AdminClient(_BaseGQLClient):
    """Admin GraphQL — inventory, metafields, orders, discounts. SERVER-ONLY."""

    endpoint_suffix = "/admin/api/{ver}/graphql.json"
    token_header = "X-Shopify-Access-Token"


@lru_cache(maxsize=1)
def get_storefront() -> StorefrontClient:
    return StorefrontClient(
        store_domain=os.environ.get("SHOPIFY_STORE_DOMAIN", ""),
        token=os.environ.get("SHOPIFY_STOREFRONT_TOKEN", ""),
        api_version=os.environ.get("SHOPIFY_API_VERSION", "2025-07"),
    )


@lru_cache(maxsize=1)
def get_admin() -> AdminClient:
    return AdminClient(
        store_domain=os.environ.get("SHOPIFY_STORE_DOMAIN", ""),
        token=os.environ.get("SHOPIFY_ADMIN_TOKEN", ""),
        api_version=os.environ.get("SHOPIFY_API_VERSION", "2025-07"),
    )
