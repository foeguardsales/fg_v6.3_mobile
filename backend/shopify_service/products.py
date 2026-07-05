"""Product service — Storefront API."""
from __future__ import annotations

from typing import Any, Dict, List, Optional

from .client import get_storefront
from .queries import PRODUCT_CARD_FRAGMENT, PRODUCT_FULL_FRAGMENT


async def list_products(
    first: int = 24,
    after: Optional[str] = None,
    query: Optional[str] = None,
    sort_key: str = "BEST_SELLING",
    reverse: bool = False,
) -> Dict[str, Any]:
    """Paginated product list. `sort_key` values: TITLE, PRICE, BEST_SELLING, CREATED_AT, UPDATED_AT, RELEVANCE, ID."""
    gql = PRODUCT_CARD_FRAGMENT + """
    query ListProducts($first:Int!, $after:String, $query:String, $sortKey:ProductSortKeys, $reverse:Boolean) {
      products(first:$first, after:$after, query:$query, sortKey:$sortKey, reverse:$reverse) {
        nodes { ...ProductCard }
        pageInfo { hasNextPage endCursor }
      }
    }
    """
    data = await get_storefront().query(gql, {
        "first": first,
        "after": after,
        "query": query,
        "sortKey": sort_key,
        "reverse": reverse,
    })
    p = data.get("products") or {}
    return {
        "products": p.get("nodes", []),
        "page_info": p.get("pageInfo", {"hasNextPage": False, "endCursor": None}),
    }


async def get_product_by_handle(handle: str) -> Optional[Dict[str, Any]]:
    gql = PRODUCT_FULL_FRAGMENT + """
    query ProductByHandle($handle:String!) {
      product(handle:$handle) { ...ProductFull }
    }
    """
    data = await get_storefront().query(gql, {"handle": handle})
    return data.get("product")


async def get_product_by_id(product_id: str) -> Optional[Dict[str, Any]]:
    gql = PRODUCT_FULL_FRAGMENT + """
    query ProductById($id:ID!) {
      product(id:$id) { ...ProductFull }
    }
    """
    data = await get_storefront().query(gql, {"id": product_id})
    return data.get("product")


async def get_variant_by_id(variant_id: str) -> Optional[Dict[str, Any]]:
    gql = """
    query VariantById($id:ID!) {
      node(id:$id) {
        ... on ProductVariant {
          id title sku availableForSale quantityAvailable
          selectedOptions { name value }
          price { amount currencyCode }
          compareAtPrice { amount currencyCode }
          image { url altText }
          product { id handle title featuredImage { url altText } }
        }
      }
    }
    """
    data = await get_storefront().query(gql, {"id": variant_id})
    return data.get("node")


async def search_products(term: str, first: int = 24) -> List[Dict[str, Any]]:
    result = await list_products(first=first, query=term, sort_key="RELEVANCE")
    return result["products"]
