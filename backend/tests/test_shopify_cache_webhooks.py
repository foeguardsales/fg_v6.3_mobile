"""Backend regression tests for FoeGuard Shopify integration.

Covers:
- Prompt 4: cache introspection, cache hit path, HMAC-verified webhooks (all 7),
  cache invalidation via signed webhook.
- Prompt 3 regression: SEO endpoints (product/collection/page/organization,
  sitemap.xml, robots.txt).
- Prompt 5 regression: customer login + /customers/me + /shopify/health.
"""
import base64
import hashlib
import hmac
import json
import os

import pytest
import requests

BASE_URL = os.environ.get("REACT_APP_BACKEND_URL", "https://merge-fix-shopify.preview.emergentagent.com").rstrip("/")
# Fallback: read from frontend/.env if needed
if "REACT_APP_BACKEND_URL" not in os.environ:
    try:
        with open("/app/frontend/.env") as f:
            for line in f:
                if line.startswith("REACT_APP_BACKEND_URL="):
                    BASE_URL = line.split("=", 1)[1].strip().rstrip("/")
    except Exception:
        pass

SECRET = "foeguard_dev_webhook_shared_secret_change_me"

TEST_EMAIL = "tester+1783282038@foeguard.dev"
TEST_PASSWORD = "TestPass1234!"


def _sign(body: bytes) -> str:
    d = hmac.new(SECRET.encode(), body, hashlib.sha256).digest()
    return base64.b64encode(d).decode()


@pytest.fixture(scope="module")
def s():
    sess = requests.Session()
    sess.headers.update({"Content-Type": "application/json"})
    return sess


# --------------------------- CACHE ---------------------------
class TestCache:
    def test_cache_snapshot_shape(self, s):
        r = s.get(f"{BASE_URL}/api/webhooks/shopify/_cache", timeout=15)
        assert r.status_code == 200
        d = r.json()
        for k in ["size", "buckets", "hits", "misses", "invalidations", "default_ttl"]:
            assert k in d, f"missing key {k}"

    def test_cache_hit_products(self, s):
        # purge to normalize state
        s.post(f"{BASE_URL}/api/webhooks/shopify/_cache/purge", timeout=15)
        snap0 = s.get(f"{BASE_URL}/api/webhooks/shopify/_cache", timeout=15).json()
        r1 = s.get(f"{BASE_URL}/api/shopify/products?first=3", timeout=30)
        assert r1.status_code == 200, r1.text
        r2 = s.get(f"{BASE_URL}/api/shopify/products?first=3", timeout=30)
        assert r2.status_code == 200
        assert r1.json() == r2.json(), "cached payload should be identical"
        snap = s.get(f"{BASE_URL}/api/webhooks/shopify/_cache", timeout=15).json()
        assert snap["hits"] >= snap0["hits"] + 1, f"expected hit increment, got {snap}"
        assert snap["size"] >= 1

    def test_cache_hit_collections(self, s):
        s.post(f"{BASE_URL}/api/webhooks/shopify/_cache/purge", timeout=15)
        r1 = s.get(f"{BASE_URL}/api/shopify/collections?first=3", timeout=30)
        assert r1.status_code == 200, r1.text
        r2 = s.get(f"{BASE_URL}/api/shopify/collections?first=3", timeout=30)
        assert r2.status_code == 200
        snap = s.get(f"{BASE_URL}/api/webhooks/shopify/_cache", timeout=15).json()
        assert snap["hits"] >= 1


# --------------------------- WEBHOOK AUTH ---------------------------
class TestWebhookAuth:
    def test_missing_hmac_returns_401(self, s):
        r = requests.post(
            f"{BASE_URL}/api/webhooks/shopify/products-update",
            data=b'{"id":1}',
            headers={"Content-Type": "application/json"},
            timeout=15,
        )
        assert r.status_code == 401

    def test_bad_hmac_returns_401(self, s):
        r = requests.post(
            f"{BASE_URL}/api/webhooks/shopify/products-update",
            data=b'{"id":1}',
            headers={"Content-Type": "application/json", "X-Shopify-Hmac-Sha256": "notvalid"},
            timeout=15,
        )
        assert r.status_code == 401

    def test_valid_hmac_returns_200(self, s):
        body = b'{"id":123,"handle":"chicken-neck-pet-treat"}'
        r = requests.post(
            f"{BASE_URL}/api/webhooks/shopify/products-update",
            data=body,
            headers={
                "Content-Type": "application/json",
                "X-Shopify-Hmac-Sha256": _sign(body),
                "X-Shopify-Topic": "products/update",
            },
            timeout=15,
        )
        assert r.status_code == 200, r.text
        d = r.json()
        assert d.get("ok") is True
        assert "purged" in d


# --------------------------- WEBHOOK INVALIDATION ---------------------------
class TestWebhookInvalidation:
    def test_products_update_purges_products_and_collections(self, s):
        # Prime cache
        s.get(f"{BASE_URL}/api/shopify/products?first=3", timeout=30)
        s.get(f"{BASE_URL}/api/shopify/collections?first=3", timeout=30)
        before = s.get(f"{BASE_URL}/api/webhooks/shopify/_cache", timeout=15).json()
        assert before["size"] >= 1

        body = b'{"id":1,"handle":"x"}'
        r = requests.post(
            f"{BASE_URL}/api/webhooks/shopify/products-update",
            data=body,
            headers={"Content-Type": "application/json", "X-Shopify-Hmac-Sha256": _sign(body)},
            timeout=15,
        )
        assert r.status_code == 200
        after = s.get(f"{BASE_URL}/api/webhooks/shopify/_cache", timeout=15).json()
        assert after["buckets"].get("products", 0) == 0
        assert after["buckets"].get("collections", 0) == 0


# --------------------------- ALL 7 WEBHOOK ENDPOINTS ---------------------------
@pytest.mark.parametrize("slug,body", [
    ("products-update", {"id": 1, "handle": "x"}),
    ("products-delete", {"id": 1}),
    ("collections-update", {"id": 1, "handle": "c"}),
    ("inventory-update", {"inventory_item_id": 1, "available": 5}),
    ("customers-update", {"id": 1, "email": "a@b.com"}),
    ("customers-create", {"id": 1, "email": "a@b.com"}),
    ("orders-create", {"id": 1, "line_items": []}),
    ("pages-update", {"id": 1, "handle": "p"}),
])
def test_webhook_endpoint_valid_hmac(slug, body):
    raw = json.dumps(body).encode()
    r = requests.post(
        f"{BASE_URL}/api/webhooks/shopify/{slug}",
        data=raw,
        headers={"Content-Type": "application/json", "X-Shopify-Hmac-Sha256": _sign(raw)},
        timeout=15,
    )
    assert r.status_code == 200, f"{slug}: {r.status_code} {r.text}"
    d = r.json()
    assert d.get("ok") is True


def test_cache_purge_endpoint():
    r = requests.post(f"{BASE_URL}/api/webhooks/shopify/_cache/purge", timeout=15)
    assert r.status_code == 200
    assert r.json().get("ok") is True


# --------------------------- SEO REGRESSION (PROMPT 3) ---------------------------
class TestSEO:
    def test_seo_organization(self, s):
        r = s.get(f"{BASE_URL}/api/seo/organization", timeout=15)
        assert r.status_code == 200
        # JSON-LD payload
        assert isinstance(r.json(), dict)

    def test_seo_product(self, s):
        r = s.get(f"{BASE_URL}/api/seo/product/chicken-neck-pet-treat", timeout=30)
        assert r.status_code in (200, 404), r.text

    def test_seo_collection(self, s):
        # need any handle; try to fetch one
        cr = s.get(f"{BASE_URL}/api/shopify/collections?first=1", timeout=30)
        assert cr.status_code == 200
        edges = cr.json().get("collections", {}).get("edges") or cr.json().get("edges") or []
        if not edges:
            pytest.skip("no collections available")
        handle = edges[0]["node"]["handle"]
        r = s.get(f"{BASE_URL}/api/seo/collection/{handle}", timeout=30)
        assert r.status_code == 200

    def test_sitemap(self, s):
        r = s.get(f"{BASE_URL}/api/sitemap.xml", timeout=30)
        assert r.status_code == 200
        assert "xml" in r.headers.get("content-type", "").lower() or r.text.strip().startswith("<?xml")

    def test_robots(self, s):
        r = s.get(f"{BASE_URL}/api/robots.txt", timeout=15)
        assert r.status_code == 200
        assert "User-agent" in r.text or "user-agent" in r.text.lower()


# --------------------------- CUSTOMERS (PROMPT 5) ---------------------------
class TestCustomers:
    def test_shopify_health(self, s):
        r = s.get(f"{BASE_URL}/api/shopify/health", timeout=30)
        assert r.status_code == 200, r.text
        d = r.json()
        assert d.get("storefront", {}).get("ok") is True, d
        assert d.get("admin", {}).get("ok") is True, d

    def test_customer_login_returns_structured(self, s):
        r = s.post(
            f"{BASE_URL}/api/shopify/customers/login",
            json={"email": TEST_EMAIL, "password": TEST_PASSWORD},
            timeout=30,
        )
        # Must not 500; either 200/400/401 with structured body
        assert r.status_code != 500, r.text
        assert r.status_code in (200, 400, 401, 422), r.text
        # Body must be JSON
        r.json()

    def test_customer_me_with_stored_token(self, s):
        # Attempt login; if we got token, hit /me
        lr = s.post(
            f"{BASE_URL}/api/shopify/customers/login",
            json={"email": TEST_EMAIL, "password": TEST_PASSWORD},
            timeout=30,
        )
        if lr.status_code != 200:
            pytest.skip(f"login not successful ({lr.status_code}) -- expected if password expired")
        body = lr.json()
        token = body.get("token") or body.get("accessToken") or (body.get("customerAccessToken") or {}).get("accessToken")
        if not token:
            pytest.skip("no token in login response")
        r = s.get(
            f"{BASE_URL}/api/shopify/customers/me",
            headers={"X-Shopify-Customer-Token": token},
            timeout=30,
        )
        assert r.status_code == 200, r.text
