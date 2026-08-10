"""Customers — uses Shopify's official Customer Authentication flow.

No custom auth. We call the Storefront mutations Shopify exposes:
  - customerCreate                   → sign up
  - customerAccessTokenCreate        → login (returns access token)
  - customerAccessTokenRenew         → refresh
  - customerAccessTokenDelete        → logout
  - customerRecover                  → forgot password
  - customerResetByUrl / customerActivateByUrl → email link flows
  - customer (query)                 → whoami
  - customerUpdate                   → profile edits

The returned `customerAccessToken` (opaque string + expiresAt) is what the
frontend stores and passes back through the backend proxy on subsequent calls.
"""
from __future__ import annotations

from typing import Any, Dict, Optional

from .client import get_storefront
from .queries import CUSTOMER_FRAGMENT, CUSTOMER_USER_ERRORS_FRAGMENT

_ERR = CUSTOMER_USER_ERRORS_FRAGMENT


async def customer_create(email: str, password: str, first_name: Optional[str] = None,
                          last_name: Optional[str] = None, accepts_marketing: bool = False) -> Dict[str, Any]:
    gql = _ERR + """
    mutation CustomerCreate($input: CustomerCreateInput!) {
      customerCreate(input: $input) {
        customer { id email firstName lastName }
        customerUserErrors { ...UserErr }
      }
    }
    """
    return await get_storefront().query(gql, {
        "input": {
            "email": email,
            "password": password,
            "firstName": first_name,
            "lastName": last_name,
            "acceptsMarketing": accepts_marketing,
        }
    })


async def customer_access_token_create(email: str, password: str) -> Dict[str, Any]:
    gql = _ERR + """
    mutation TokenCreate($input:CustomerAccessTokenCreateInput!) {
      customerAccessTokenCreate(input:$input) {
        customerAccessToken { accessToken expiresAt }
        customerUserErrors { ...UserErr }
      }
    }
    """
    return await get_storefront().query(gql, {"input": {"email": email, "password": password}})


async def customer_access_token_renew(access_token: str) -> Dict[str, Any]:
    gql = """
    mutation TokenRenew($token:String!) {
      customerAccessTokenRenew(customerAccessToken:$token) {
        customerAccessToken { accessToken expiresAt }
        userErrors { field message }
      }
    }
    """
    return await get_storefront().query(gql, {"token": access_token})


async def customer_access_token_delete(access_token: str) -> Dict[str, Any]:
    gql = """
    mutation TokenDelete($token:String!) {
      customerAccessTokenDelete(customerAccessToken:$token) {
        deletedAccessToken
        deletedCustomerAccessTokenId
        userErrors { field message }
      }
    }
    """
    return await get_storefront().query(gql, {"token": access_token})


async def customer_recover(email: str) -> Dict[str, Any]:
    gql = _ERR + """
    mutation Recover($email:String!) {
      customerRecover(email:$email) { customerUserErrors { ...UserErr } }
    }
    """
    return await get_storefront().query(gql, {"email": email})


async def customer_reset_by_url(reset_url: str, password: str) -> Dict[str, Any]:
    gql = _ERR + """
    mutation ResetByUrl($resetUrl:URL!, $password:String!) {
      customerResetByUrl(resetUrl:$resetUrl, password:$password) {
        customer { id email }
        customerAccessToken { accessToken expiresAt }
        customerUserErrors { ...UserErr }
      }
    }
    """
    return await get_storefront().query(gql, {"resetUrl": reset_url, "password": password})


async def customer_get(access_token: str) -> Optional[Dict[str, Any]]:
    gql = CUSTOMER_FRAGMENT + """
    query Me($token:String!) {
      customer(customerAccessToken:$token) { ...CustomerFull }
    }
    """
    data = await get_storefront().query(gql, {"token": access_token})
    return data.get("customer")


async def customer_update(access_token: str, patch: Dict[str, Any]) -> Dict[str, Any]:
    gql = _ERR + CUSTOMER_FRAGMENT + """
    mutation CustomerUpdate($token:String!, $customer:CustomerUpdateInput!) {
      customerUpdate(customerAccessToken:$token, customer:$customer) {
        customer { ...CustomerFull }
        customerAccessToken { accessToken expiresAt }
        customerUserErrors { ...UserErr }
      }
    }
    """
    return await get_storefront().query(gql, {"token": access_token, "customer": patch})
