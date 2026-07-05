"""FastAPI router that surfaces Shopify functionality at ``/api/shopify/*``.

All routes here are the ONLY way the frontend touches Shopify. The
Admin token is used server-side only (never returned to the browser).
Customer auth uses Shopify's official Storefront ``customerAccessToken``
flow; tokens are handed back to the frontend which stores them.
"""

from __future__ import annotations

import logging
from typing import Optional, List

from fastapi import APIRouter, HTTPException, Query, Path, Header

from . import queries as Q
from .client import (
    ShopifyError,
    get_storefront,
    get_admin,
)
from .schemas import (
    CartCreateBody,
    CartLinesAddBody,
    CartLinesUpdateBody,
    CartLinesRemoveBody,
    CartBuyerIdentityBody,
    CartDiscountCodesBody,
    CustomerRegisterBody,
    CustomerLoginBody,
    CustomerAccessTokenBody,
    CustomerRecoverBody,
    CustomerUpdateBody,
    CheckoutFromCartBody,
    HealthResponse,
    HealthStatus,
)

logger = logging.getLogger("shopify.router")

shopify_router = APIRouter(prefix="/shopify", tags=["shopify"])


# ---------- helpers --------------------------------------------------------

def _raise_user_errors(payload: dict, key: str) -> dict:
    """Look at a mutation payload; raise 400 if it contains userErrors."""
    node = payload.get(key) or {}
    errs = node.get("userErrors") or node.get("customerUserErrors") or []
    if errs:
        raise HTTPException(status_code=400, detail={"userErrors": errs})
    return node


def _handle_shopify_error(exc: ShopifyError) -> HTTPException:
    return HTTPException(
        status_code=exc.status_code if 400 <= exc.status_code < 600 else 502,
        detail={"message": str(exc), "shopify": exc.payload},
    )


# ---------- health --------------------------------------------------------

@shopify_router.get("/health", response_model=HealthResponse)
async def health():
    """Verifies both Storefront + Admin tokens by making a tiny query with each."""
    storefront_status = HealthStatus(ok=False)
    admin_status = HealthStatus(ok=False)
    domain: Optional[str] = None
    api_version: Optional[str] = None

    # Storefront check: fetch shop name via ``shop { name }``
    try:
        sf = get_storefront()
        domain = sf.domain
        api_version = sf.version
        data = await sf.execute("{ shop { name primaryDomain { host } } }")
        storefront_status = HealthStatus(ok=True, shop=data.get("shop"))
    except ShopifyError as e:
        storefront_status = HealthStatus(ok=False, detail=str(e))
    except Exception as e:  # noqa: BLE001
        storefront_status = HealthStatus(ok=False, detail=f"config: {e}")

    # Admin check
    try:
        adm = get_admin()
        domain = domain or adm.domain
        api_version = api_version or adm.version
        data = await adm.execute(Q.ADMIN_SHOP_QUERY)
        admin_status = HealthStatus(ok=True, shop=data.get("shop"))
    except ShopifyError as e:
        admin_status = HealthStatus(ok=False, detail=str(e))
    except Exception as e:  # noqa: BLE001
        admin_status = HealthStatus(ok=False, detail=f"config: {e}")

    return HealthResponse(
        storefront=storefront_status,
        admin=admin_status,
        domain=domain,
        apiVersion=api_version,
    )


# ---------- products ------------------------------------------------------

@shopify_router.get("/products")
async def list_products(
    first: int = Query(20, ge=1, le=100),
    after: Optional[str] = Query(None),
    query: Optional[str] = Query(None, description="Shopify product search query"),
):
    try:
        data = await get_storefront().execute(
            Q.PRODUCTS_LIST_QUERY,
            {"first": first, "after": after, "query": query},
        )
        return data.get("products", {"nodes": [], "pageInfo": {}})
    except ShopifyError as e:
        raise _handle_shopify_error(e) from e


@shopify_router.get("/products/{handle}")
async def get_product(handle: str = Path(..., min_length=1)):
    try:
        data = await get_storefront().execute(
            Q.PRODUCT_BY_HANDLE_QUERY, {"handle": handle}
        )
        product = data.get("product")
        if not product:
            raise HTTPException(status_code=404, detail="Product not found")
        return product
    except ShopifyError as e:
        raise _handle_shopify_error(e) from e


# ---------- collections ---------------------------------------------------

@shopify_router.get("/collections")
async def list_collections(
    first: int = Query(20, ge=1, le=100),
    after: Optional[str] = Query(None),
):
    try:
        data = await get_storefront().execute(
            Q.COLLECTIONS_LIST_QUERY, {"first": first, "after": after}
        )
        return data.get("collections", {"nodes": [], "pageInfo": {}})
    except ShopifyError as e:
        raise _handle_shopify_error(e) from e


@shopify_router.get("/collections/{handle}")
async def get_collection(
    handle: str = Path(..., min_length=1),
    first: int = Query(24, ge=1, le=100),
    after: Optional[str] = Query(None),
):
    try:
        data = await get_storefront().execute(
            Q.COLLECTION_BY_HANDLE_QUERY,
            {"handle": handle, "first": first, "after": after},
        )
        col = data.get("collection")
        if not col:
            raise HTTPException(status_code=404, detail="Collection not found")
        return col
    except ShopifyError as e:
        raise _handle_shopify_error(e) from e


# ---------- cart ----------------------------------------------------------

@shopify_router.post("/cart")
async def create_cart(body: Optional[CartCreateBody] = None):
    try:
        input_ = body.model_dump(exclude_none=True) if body else None
        data = await get_storefront().execute(
            Q.CART_CREATE_MUTATION, {"input": input_}
        )
        node = _raise_user_errors(data, "cartCreate")
        return node.get("cart")
    except ShopifyError as e:
        raise _handle_shopify_error(e) from e


@shopify_router.get("/cart/{cart_id:path}")
async def get_cart(cart_id: str):
    try:
        data = await get_storefront().execute(Q.CART_QUERY, {"id": cart_id})
        cart = data.get("cart")
        if not cart:
            raise HTTPException(status_code=404, detail="Cart not found")
        return cart
    except ShopifyError as e:
        raise _handle_shopify_error(e) from e


@shopify_router.post("/cart/{cart_id:path}/lines/add")
async def cart_lines_add(cart_id: str, body: CartLinesAddBody):
    try:
        data = await get_storefront().execute(
            Q.CART_LINES_ADD_MUTATION,
            {"cartId": cart_id, "lines": [l.model_dump(exclude_none=True) for l in body.lines]},
        )
        node = _raise_user_errors(data, "cartLinesAdd")
        return node.get("cart")
    except ShopifyError as e:
        raise _handle_shopify_error(e) from e


@shopify_router.post("/cart/{cart_id:path}/lines/update")
async def cart_lines_update(cart_id: str, body: CartLinesUpdateBody):
    try:
        data = await get_storefront().execute(
            Q.CART_LINES_UPDATE_MUTATION,
            {"cartId": cart_id, "lines": [l.model_dump(exclude_none=True) for l in body.lines]},
        )
        node = _raise_user_errors(data, "cartLinesUpdate")
        return node.get("cart")
    except ShopifyError as e:
        raise _handle_shopify_error(e) from e


@shopify_router.post("/cart/{cart_id:path}/lines/remove")
async def cart_lines_remove(cart_id: str, body: CartLinesRemoveBody):
    try:
        data = await get_storefront().execute(
            Q.CART_LINES_REMOVE_MUTATION,
            {"cartId": cart_id, "lineIds": body.lineIds},
        )
        node = _raise_user_errors(data, "cartLinesRemove")
        return node.get("cart")
    except ShopifyError as e:
        raise _handle_shopify_error(e) from e


@shopify_router.post("/cart/{cart_id:path}/buyer-identity")
async def cart_buyer_identity_update(cart_id: str, body: CartBuyerIdentityBody):
    try:
        data = await get_storefront().execute(
            Q.CART_BUYER_IDENTITY_UPDATE_MUTATION,
            {"cartId": cart_id, "buyerIdentity": body.buyerIdentity},
        )
        node = _raise_user_errors(data, "cartBuyerIdentityUpdate")
        return node.get("cart")
    except ShopifyError as e:
        raise _handle_shopify_error(e) from e


@shopify_router.post("/cart/{cart_id:path}/discount-codes")
async def cart_discount_codes_update(cart_id: str, body: CartDiscountCodesBody):
    try:
        data = await get_storefront().execute(
            Q.CART_DISCOUNT_CODES_UPDATE_MUTATION,
            {"cartId": cart_id, "discountCodes": body.discountCodes},
        )
        node = _raise_user_errors(data, "cartDiscountCodesUpdate")
        return node.get("cart")
    except ShopifyError as e:
        raise _handle_shopify_error(e) from e


# ---------- customers -----------------------------------------------------

@shopify_router.post("/customers/register")
async def customer_register(body: CustomerRegisterBody):
    try:
        create_input = body.model_dump(exclude_none=True)
        # Shopify's CustomerCreateInput does not accept `acceptsMarketing`
        # at the top-level of registration in newer API versions; strip it
        # defensively.
        create_input.pop("acceptsMarketing", None)
        data = await get_storefront().execute(
            Q.CUSTOMER_CREATE_MUTATION, {"input": create_input}
        )
        node = _raise_user_errors(data, "customerCreate")
        return node.get("customer")
    except ShopifyError as e:
        raise _handle_shopify_error(e) from e


@shopify_router.post("/customers/login")
async def customer_login(body: CustomerLoginBody):
    try:
        data = await get_storefront().execute(
            Q.CUSTOMER_ACCESS_TOKEN_CREATE_MUTATION,
            {"input": {"email": body.email, "password": body.password}},
        )
        node = data.get("customerAccessTokenCreate") or {}
        errs = node.get("customerUserErrors") or []
        if errs or not node.get("customerAccessToken"):
            raise HTTPException(
                status_code=401,
                detail={"userErrors": errs or [{"message": "Invalid credentials"}]},
            )
        return node["customerAccessToken"]
    except ShopifyError as e:
        raise _handle_shopify_error(e) from e


@shopify_router.post("/customers/logout")
async def customer_logout(body: CustomerAccessTokenBody):
    try:
        data = await get_storefront().execute(
            Q.CUSTOMER_ACCESS_TOKEN_DELETE_MUTATION,
            {"customerAccessToken": body.customerAccessToken},
        )
        node = data.get("customerAccessTokenDelete") or {}
        errs = node.get("userErrors") or []
        if errs:
            raise HTTPException(status_code=400, detail={"userErrors": errs})
        return {"deletedAccessToken": node.get("deletedAccessToken")}
    except ShopifyError as e:
        raise _handle_shopify_error(e) from e


@shopify_router.get("/customers/me")
async def customer_me(
    x_shopify_customer_token: Optional[str] = Header(None, alias="X-Shopify-Customer-Token"),
    authorization: Optional[str] = Header(None),
):
    token = x_shopify_customer_token
    if not token and authorization and authorization.lower().startswith("bearer "):
        token = authorization.split(" ", 1)[1].strip()
    if not token:
        raise HTTPException(status_code=401, detail="Missing customer access token")
    try:
        data = await get_storefront().execute(
            Q.CUSTOMER_QUERY, {"customerAccessToken": token}
        )
        cust = data.get("customer")
        if not cust:
            raise HTTPException(status_code=401, detail="Invalid or expired token")
        return cust
    except ShopifyError as e:
        raise _handle_shopify_error(e) from e


@shopify_router.post("/customers/recover")
async def customer_recover(body: CustomerRecoverBody):
    try:
        data = await get_storefront().execute(
            Q.CUSTOMER_RECOVER_MUTATION, {"email": body.email}
        )
        node = data.get("customerRecover") or {}
        errs = node.get("customerUserErrors") or []
        # Shopify intentionally returns success even for unknown emails to
        # prevent enumeration; only bubble true validation errors.
        if errs:
            raise HTTPException(status_code=400, detail={"userErrors": errs})
        return {"ok": True}
    except ShopifyError as e:
        raise _handle_shopify_error(e) from e


@shopify_router.post("/customers/update")
async def customer_update(body: CustomerUpdateBody):
    try:
        data = await get_storefront().execute(
            Q.CUSTOMER_UPDATE_MUTATION,
            {
                "customerAccessToken": body.customerAccessToken,
                "customer": body.customer,
            },
        )
        node = _raise_user_errors(data, "customerUpdate")
        return node.get("customer")
    except ShopifyError as e:
        raise _handle_shopify_error(e) from e


# ---------- checkout ------------------------------------------------------

@shopify_router.post("/checkout/from-cart")
async def checkout_from_cart(body: CheckoutFromCartBody):
    """Return the hosted Shopify checkout URL for a given cart.

    In modern Shopify (Cart API), the ``checkoutUrl`` is a first-class
    field on the cart. We simply fetch the cart and return it. The
    frontend redirects the user to that URL.
    """
    try:
        data = await get_storefront().execute(Q.CART_QUERY, {"id": body.cartId})
        cart = data.get("cart")
        if not cart:
            raise HTTPException(status_code=404, detail="Cart not found")
        checkout_url = cart.get("checkoutUrl")
        if not checkout_url:
            raise HTTPException(status_code=422, detail="Cart has no checkoutUrl (empty?)")
        return {"checkoutUrl": checkout_url, "cartId": cart.get("id")}
    except ShopifyError as e:
        raise _handle_shopify_error(e) from e
