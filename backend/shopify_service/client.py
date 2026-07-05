"""Low-level Shopify GraphQL clients.

Two clients are exposed:

- ``StorefrontClient``: uses the public Storefront API (safe to expose
  through the FastAPI backend to the browser). Auth via
  ``X-Shopify-Storefront-Access-Token``.
- ``AdminClient``: uses the Admin GraphQL API. Server-only. Auth via
  ``X-Shopify-Access-Token``.

Both clients use ``httpx.AsyncClient`` and share the same tiny GraphQL
request helper. Any GraphQL ``errors`` array or ``userErrors`` array in
the response is bubbled up as ``ShopifyError`` so route handlers can
return a clean 4xx/5xx.
"""

from __future__ import annotations

import os
import logging
from typing import Any, Dict, Optional

import httpx

logger = logging.getLogger("shopify")


class ShopifyError(Exception):
    """Raised when Shopify responds with GraphQL errors or non-2xx."""

    def __init__(self, message: str, status_code: int = 502, payload: Any = None):
        super().__init__(message)
        self.status_code = status_code
        self.payload = payload


def _env(name: str, required: bool = True, default: str = "") -> str:
    val = os.environ.get(name, default)
    if required and not val:
        raise RuntimeError(f"Missing required env var: {name}")
    return val


class _BaseGraphQLClient:
    def __init__(self, endpoint: str, headers: Dict[str, str], timeout: float = 20.0):
        self.endpoint = endpoint
        self.headers = {
            "Content-Type": "application/json",
            "Accept": "application/json",
            **headers,
        }
        self.timeout = timeout

    async def execute(
        self,
        query: str,
        variables: Optional[Dict[str, Any]] = None,
        *,
        extra_headers: Optional[Dict[str, str]] = None,
    ) -> Dict[str, Any]:
        headers = self.headers
        if extra_headers:
            headers = {**headers, **extra_headers}
        payload = {"query": query, "variables": variables or {}}
        async with httpx.AsyncClient(timeout=self.timeout) as client:
            try:
                resp = await client.post(self.endpoint, json=payload, headers=headers)
            except httpx.HTTPError as exc:
                logger.exception("Shopify transport error")
                raise ShopifyError(f"Shopify transport error: {exc}", 502) from exc

        if resp.status_code >= 400:
            # Special-case auth so we can surface a clear message.
            if resp.status_code in (401, 403):
                raise ShopifyError(
                    f"Shopify auth failed ({resp.status_code}). Check tokens/scopes.",
                    resp.status_code,
                    _safe_json(resp),
                )
            raise ShopifyError(
                f"Shopify HTTP {resp.status_code}", resp.status_code, _safe_json(resp)
            )

        data = resp.json()
        if data.get("errors"):
            raise ShopifyError("Shopify GraphQL errors", 400, data["errors"])
        return data.get("data", {})


class StorefrontClient(_BaseGraphQLClient):
    """Public/read Storefront API client (safe for backend-proxied browser calls)."""

    def __init__(self):
        domain = _env("SHOPIFY_STORE_DOMAIN")
        token = _env("SHOPIFY_STOREFRONT_TOKEN")
        version = _env("SHOPIFY_API_VERSION", default="2025-07", required=False) or "2025-07"
        endpoint = f"https://{domain}/api/{version}/graphql.json"
        headers = {"X-Shopify-Storefront-Access-Token": token}
        super().__init__(endpoint, headers)
        self.domain = domain
        self.version = version


class AdminClient(_BaseGraphQLClient):
    """Admin API client. NEVER expose this client's token to the browser."""

    def __init__(self):
        domain = _env("SHOPIFY_STORE_DOMAIN")
        token = _env("SHOPIFY_ADMIN_TOKEN")
        version = _env("SHOPIFY_API_VERSION", default="2025-07", required=False) or "2025-07"
        endpoint = f"https://{domain}/admin/api/{version}/graphql.json"
        headers = {"X-Shopify-Access-Token": token}
        super().__init__(endpoint, headers)
        self.domain = domain
        self.version = version


def _safe_json(resp: httpx.Response) -> Any:
    try:
        return resp.json()
    except Exception:  # noqa: BLE001
        return {"text": resp.text[:500]}


# Cached singletons ----------------------------------------------------------

_storefront: Optional[StorefrontClient] = None
_admin: Optional[AdminClient] = None


def get_storefront() -> StorefrontClient:
    global _storefront
    if _storefront is None:
        _storefront = StorefrontClient()
    return _storefront


def get_admin() -> AdminClient:
    global _admin
    if _admin is None:
        _admin = AdminClient()
    return _admin
