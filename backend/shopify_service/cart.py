"""Cart service — Storefront API (Cart, not deprecated Checkout).

All cart mutations return the FULL updated cart via CartFull fragment, so the
frontend never has to stitch state — one round-trip per action.
"""
from __future__ import annotations

from typing import Any, Dict, List, Optional

from .client import get_storefront
from .queries import CART_FRAGMENT, USER_ERRORS_FRAGMENT


def _return_block() -> str:
    return CART_FRAGMENT + USER_ERRORS_FRAGMENT


async def cart_create(
    lines: Optional[List[Dict[str, Any]]] = None,
    buyer_identity: Optional[Dict[str, Any]] = None,
    attributes: Optional[List[Dict[str, str]]] = None,
    discount_codes: Optional[List[str]] = None,
) -> Dict[str, Any]:
    gql = _return_block() + """
    mutation CartCreate($input: CartInput) {
      cartCreate(input: $input) {
        cart { ...CartFull }
        userErrors { ...CartErr }
      }
    }
    """
    input_: Dict[str, Any] = {}
    if lines:
        input_["lines"] = lines
    if buyer_identity:
        input_["buyerIdentity"] = buyer_identity
    if attributes:
        input_["attributes"] = attributes
    if discount_codes:
        input_["discountCodes"] = discount_codes
    return await get_storefront().query(gql, {"input": input_})


async def cart_get(cart_id: str) -> Optional[Dict[str, Any]]:
    gql = CART_FRAGMENT + """
    query CartGet($id:ID!) { cart(id:$id) { ...CartFull } }
    """
    data = await get_storefront().query(gql, {"id": cart_id})
    return data.get("cart")


async def cart_lines_add(cart_id: str, lines: List[Dict[str, Any]]) -> Dict[str, Any]:
    gql = _return_block() + """
    mutation CartLinesAdd($cartId:ID!, $lines:[CartLineInput!]!) {
      cartLinesAdd(cartId:$cartId, lines:$lines) {
        cart { ...CartFull }
        userErrors { ...CartErr }
      }
    }
    """
    return await get_storefront().query(gql, {"cartId": cart_id, "lines": lines})


async def cart_lines_update(cart_id: str, lines: List[Dict[str, Any]]) -> Dict[str, Any]:
    gql = _return_block() + """
    mutation CartLinesUpdate($cartId:ID!, $lines:[CartLineUpdateInput!]!) {
      cartLinesUpdate(cartId:$cartId, lines:$lines) {
        cart { ...CartFull }
        userErrors { ...CartErr }
      }
    }
    """
    return await get_storefront().query(gql, {"cartId": cart_id, "lines": lines})


async def cart_lines_remove(cart_id: str, line_ids: List[str]) -> Dict[str, Any]:
    gql = _return_block() + """
    mutation CartLinesRemove($cartId:ID!, $lineIds:[ID!]!) {
      cartLinesRemove(cartId:$cartId, lineIds:$lineIds) {
        cart { ...CartFull }
        userErrors { ...CartErr }
      }
    }
    """
    return await get_storefront().query(gql, {"cartId": cart_id, "lineIds": line_ids})


async def cart_buyer_identity_update(cart_id: str, buyer_identity: Dict[str, Any]) -> Dict[str, Any]:
    gql = _return_block() + """
    mutation CartBuyerUpdate($cartId:ID!, $buyerIdentity:CartBuyerIdentityInput!) {
      cartBuyerIdentityUpdate(cartId:$cartId, buyerIdentity:$buyerIdentity) {
        cart { ...CartFull }
        userErrors { ...CartErr }
      }
    }
    """
    return await get_storefront().query(gql, {"cartId": cart_id, "buyerIdentity": buyer_identity})


async def cart_discount_codes_update(cart_id: str, codes: List[str]) -> Dict[str, Any]:
    gql = _return_block() + """
    mutation CartDiscount($cartId:ID!, $codes:[String!]!) {
      cartDiscountCodesUpdate(cartId:$cartId, discountCodes:$codes) {
        cart { ...CartFull }
        userErrors { ...CartErr }
      }
    }
    """
    return await get_storefront().query(gql, {"cartId": cart_id, "codes": codes})


async def cart_attributes_update(cart_id: str, attributes: List[Dict[str, str]]) -> Dict[str, Any]:
    gql = _return_block() + """
    mutation CartAttrs($cartId:ID!, $attributes:[AttributeInput!]!) {
      cartAttributesUpdate(cartId:$cartId, attributes:$attributes) {
        cart { ...CartFull }
        userErrors { ...CartErr }
      }
    }
    """
    return await get_storefront().query(gql, {"cartId": cart_id, "attributes": attributes})
