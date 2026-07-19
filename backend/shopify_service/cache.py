"""In-memory TTL cache for Shopify Storefront responses.

The Shopify Storefront API is rate-limited and adds latency on every
frontend page load. We cache GET-style GraphQL results for a short TTL
(default 5 minutes) and let Shopify webhooks invalidate specific
buckets whenever a resource changes (see :mod:`shopify_service.webhooks`).

Design notes
------------
* **Async-safe.** All read/write access goes through an ``asyncio.Lock``
  so concurrent request bursts hit Shopify at most once per key.
* **Bucketed keys.** Keys are grouped by resource (``products``,
  ``collections``, ``pages``, ``metaobjects``) so webhook handlers can
  purge everything in one bucket at once.
* **Deterministic keys.** Callers build keys with :func:`make_key` from
  the resource name + any variables that affect the response.
* **No cross-process replication.** In-memory only — sufficient for the
  headless proxy layer. For multi-instance deployments, wrap this
  module with Redis in a future iteration.
"""

from __future__ import annotations

import asyncio
import time
import logging
import os
from dataclasses import dataclass, field
from typing import Any, Awaitable, Callable, Dict, Optional, Set, Tuple

logger = logging.getLogger("shopify.cache")

# ---------- config ---------------------------------------------------------

DEFAULT_TTL = int(os.environ.get("SHOPIFY_CACHE_TTL", "300"))  # 5 minutes


@dataclass
class _Entry:
    value: Any
    expires_at: float
    bucket: str


@dataclass
class _Stats:
    hits: int = 0
    misses: int = 0
    invalidations: int = 0
    buckets_purged: Dict[str, int] = field(default_factory=dict)


class ShopifyCache:
    """Tiny process-local TTL cache with bucketed invalidation."""

    def __init__(self, default_ttl: int = DEFAULT_TTL):
        self.default_ttl = default_ttl
        self._store: Dict[str, _Entry] = {}
        self._by_bucket: Dict[str, Set[str]] = {}
        self._lock = asyncio.Lock()
        self.stats = _Stats()

    # ---- read/write ------------------------------------------------------

    async def get(self, key: str) -> Optional[Any]:
        async with self._lock:
            entry = self._store.get(key)
            if not entry:
                self.stats.misses += 1
                return None
            if entry.expires_at < time.time():
                # Expired — drop it and count as miss.
                self._drop_key_locked(key)
                self.stats.misses += 1
                return None
            self.stats.hits += 1
            return entry.value

    async def set(
        self,
        key: str,
        value: Any,
        *,
        bucket: str,
        ttl: Optional[int] = None,
    ) -> None:
        expires_at = time.time() + (ttl if ttl is not None else self.default_ttl)
        async with self._lock:
            # If replacing an existing key that lived in a different bucket,
            # remove the old bucket membership first.
            existing = self._store.get(key)
            if existing and existing.bucket != bucket:
                self._by_bucket.get(existing.bucket, set()).discard(key)
            self._store[key] = _Entry(value=value, expires_at=expires_at, bucket=bucket)
            self._by_bucket.setdefault(bucket, set()).add(key)

    async def get_or_set(
        self,
        key: str,
        loader: Callable[[], Awaitable[Any]],
        *,
        bucket: str,
        ttl: Optional[int] = None,
    ) -> Any:
        """Return cached value if fresh, else run ``loader`` and cache result."""
        cached = await self.get(key)
        if cached is not None:
            return cached
        value = await loader()
        # Never cache falsey-but-none results; storing empty lists/dicts is fine.
        if value is not None:
            await self.set(key, value, bucket=bucket, ttl=ttl)
        return value

    # ---- invalidation ---------------------------------------------------

    async def invalidate_key(self, key: str) -> bool:
        async with self._lock:
            if key in self._store:
                self._drop_key_locked(key)
                self.stats.invalidations += 1
                return True
            return False

    async def invalidate_bucket(self, bucket: str) -> int:
        async with self._lock:
            keys = list(self._by_bucket.get(bucket, ()))
            for k in keys:
                self._store.pop(k, None)
            self._by_bucket[bucket] = set()
            self.stats.buckets_purged[bucket] = self.stats.buckets_purged.get(bucket, 0) + len(keys)
            if keys:
                logger.info("cache: purged bucket=%s keys=%d", bucket, len(keys))
            return len(keys)

    async def invalidate_all(self) -> int:
        async with self._lock:
            n = len(self._store)
            self._store.clear()
            self._by_bucket.clear()
            self.stats.invalidations += n
            return n

    def _drop_key_locked(self, key: str) -> None:
        entry = self._store.pop(key, None)
        if entry:
            self._by_bucket.get(entry.bucket, set()).discard(key)

    # ---- introspection --------------------------------------------------

    def snapshot(self) -> Dict[str, Any]:
        return {
            "size": len(self._store),
            "buckets": {b: len(k) for b, k in self._by_bucket.items()},
            "hits": self.stats.hits,
            "misses": self.stats.misses,
            "invalidations": self.stats.invalidations,
            "buckets_purged": dict(self.stats.buckets_purged),
            "default_ttl": self.default_ttl,
        }


# ---------- module singleton ----------------------------------------------

_cache: Optional[ShopifyCache] = None


def get_cache() -> ShopifyCache:
    global _cache
    if _cache is None:
        _cache = ShopifyCache()
    return _cache


# ---------- key helpers ---------------------------------------------------

# Bucket names used by webhook handlers to purge on Shopify events.
BUCKET_PRODUCTS = "products"
BUCKET_COLLECTIONS = "collections"
BUCKET_PAGES = "pages"
BUCKET_METAOBJECTS = "metaobjects"


def make_key(resource: str, **params: Any) -> str:
    """Build a deterministic cache key from a resource name + args."""
    parts = [resource]
    for k in sorted(params.keys()):
        v = params[k]
        if v is None or v == "":
            continue
        parts.append(f"{k}={v}")
    return "|".join(parts)
