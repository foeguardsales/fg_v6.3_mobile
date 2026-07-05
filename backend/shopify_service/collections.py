"""Collection service — Storefront API."""
from __future__ import annotations

from typing import Any, Dict, Optional

from .client import get_storefront
from .queries import COLLECTION_CARD_FRAGMENT, PRODUCT_CARD_FRAGMENT


async def list_collections(first: int = 20, after: Optional[str] = None) -> Dict[str, Any]:
    gql = COLLECTION_CARD_FRAGMENT + """
    query ListCollections($first:Int!, $after:String) {
      collections(first:$first, after:$after) {
        nodes { ...CollectionCard }
        pageInfo { hasNextPage endCursor }
      }
    }
    """
    data = await get_storefront().query(gql, {"first": first, "after": after})
    c = data.get("collections") or {}
    return {
        "collections": c.get("nodes", []),
        "page_info": c.get("pageInfo", {"hasNextPage": False, "endCursor": None}),
    }


async def get_collection_by_handle(
    handle: str,
    products_first: int = 50,
    products_after: Optional[str] = None,
) -> Optional[Dict[str, Any]]:
    gql = COLLECTION_CARD_FRAGMENT + PRODUCT_CARD_FRAGMENT + """
    query CollectionByHandle($handle:String!, $first:Int!, $after:String) {
      collection(handle:$handle) {
        ...CollectionCard
        products(first:$first, after:$after) {
          nodes { ...ProductCard }
          pageInfo { hasNextPage endCursor }
        }
      }
    }
    """
    data = await get_storefront().query(gql, {
        "handle": handle,
        "first": products_first,
        "after": products_after,
    })
    return data.get("collection")
