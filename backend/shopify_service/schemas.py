"""Pydantic request/response models for the Shopify router.

Kept small and permissive on the response side (Shopify JSON is passed
through as-is inside ``data``) but strict on inputs so the frontend gets
good 4xx errors.
"""

from __future__ import annotations

from typing import Any, Dict, List, Optional
from pydantic import BaseModel, EmailStr, Field


# ---------- Shared ---------------------------------------------------------

class ShopifyResponse(BaseModel):
    """Envelope for pass-through Shopify data."""
    data: Any


class HealthStatus(BaseModel):
    ok: bool
    detail: Optional[str] = None
    shop: Optional[Dict[str, Any]] = None


class HealthResponse(BaseModel):
    storefront: HealthStatus
    admin: HealthStatus
    domain: Optional[str] = None
    apiVersion: Optional[str] = None


# ---------- Cart -----------------------------------------------------------

class CartLineInput(BaseModel):
    merchandiseId: str = Field(..., description="ProductVariant GID")
    quantity: int = Field(1, ge=1)
    attributes: Optional[List[Dict[str, str]]] = None
    sellingPlanId: Optional[str] = None


class CartLineUpdateInput(BaseModel):
    id: str
    quantity: int = Field(..., ge=0)
    merchandiseId: Optional[str] = None
    attributes: Optional[List[Dict[str, str]]] = None


class CartCreateBody(BaseModel):
    lines: Optional[List[CartLineInput]] = None
    buyerIdentity: Optional[Dict[str, Any]] = None
    discountCodes: Optional[List[str]] = None
    attributes: Optional[List[Dict[str, str]]] = None
    note: Optional[str] = None


class CartLinesAddBody(BaseModel):
    lines: List[CartLineInput]


class CartLinesUpdateBody(BaseModel):
    lines: List[CartLineUpdateInput]


class CartLinesRemoveBody(BaseModel):
    lineIds: List[str]


class CartBuyerIdentityBody(BaseModel):
    buyerIdentity: Dict[str, Any]


class CartDiscountCodesBody(BaseModel):
    discountCodes: List[str]


# ---------- Customers ------------------------------------------------------

class CustomerRegisterBody(BaseModel):
    email: EmailStr
    password: str = Field(..., min_length=5)
    firstName: Optional[str] = None
    lastName: Optional[str] = None
    phone: Optional[str] = None
    acceptsMarketing: Optional[bool] = False


class CustomerLoginBody(BaseModel):
    email: EmailStr
    password: str


class CustomerAccessTokenBody(BaseModel):
    customerAccessToken: str


class CustomerRecoverBody(BaseModel):
    email: EmailStr


class CustomerUpdateBody(BaseModel):
    customerAccessToken: str
    customer: Dict[str, Any]


# ---------- Checkout -------------------------------------------------------

class CheckoutFromCartBody(BaseModel):
    cartId: str
