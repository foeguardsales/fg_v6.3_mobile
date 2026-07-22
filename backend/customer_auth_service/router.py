"""
Shopify Customer Account API — OAuth 2.0 / OIDC (Authorization Code + PKCE).

Shopify is the SOLE source of truth for customer authentication. There is NO
Mongo/JWT customer login here. Customer OAuth tokens NEVER reach the browser:
the backend keeps them in a server-side session (Mongo) and hands the browser
only an opaque, httpOnly session cookie.

Endpoints (all under /api/customer-auth):
  GET  /login     -> 302 to Shopify authorize (sets PKCE/state cookies)
  GET  /callback  -> exchanges code for tokens, creates session, 302 to app
  GET  /session   -> { authenticated, customer }
  POST /logout    -> clears session, returns Shopify logout url
  GET  /orders    -> customer's orders via Customer Account API ([] if unset)

Configuration (backend/.env, env-driven only — never hardcode secrets):
  SHOPIFY_SHOP_ID                          numeric shop id
  SHOPIFY_CUSTOMER_ACCOUNT_CLIENT_ID       Customer Account API client id
  SHOPIFY_CUSTOMER_ACCOUNT_CLIENT_SECRET   client secret (confidential client)
  SHOPIFY_CUSTOMER_ACCOUNT_API_VERSION     e.g. 2025-07
  CUSTOMER_AUTH_REDIRECT_URI               registered callback (optional; else derived)
  CUSTOMER_AUTH_POST_LOGIN_REDIRECT        where to send the user after login (optional)
"""
import os
import base64
import hashlib
import secrets
import logging
from datetime import datetime, timezone, timedelta
from urllib.parse import urlencode, urljoin

import httpx
import jwt
from fastapi import APIRouter, Request, Response, HTTPException
from fastapi.responses import RedirectResponse, JSONResponse
from motor.motor_asyncio import AsyncIOMotorClient

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/customer-auth", tags=["customer-auth"])

# --- Mongo (own client, mirrors the pattern used by other service modules) ---
_mongo = AsyncIOMotorClient(os.environ["MONGO_URL"])
_db = _mongo[os.environ["DB_NAME"]]
sessions = _db.customer_sessions
oauth_flows = _db.customer_oauth_flows

SESSION_COOKIE = "fg_customer_session"
SCOPES = "openid email customer-account-api:full"


# --------------------------------------------------------------------------- #
# Config helpers
# --------------------------------------------------------------------------- #
def _cfg():
    return {
        "shop_id": os.environ.get("SHOPIFY_SHOP_ID", "").strip(),
        "client_id": os.environ.get("SHOPIFY_CUSTOMER_ACCOUNT_CLIENT_ID", "").strip(),
        "client_secret": os.environ.get("SHOPIFY_CUSTOMER_ACCOUNT_CLIENT_SECRET", "").strip(),
        "api_version": os.environ.get("SHOPIFY_CUSTOMER_ACCOUNT_API_VERSION", "2025-07").strip(),
        "redirect_uri": os.environ.get("CUSTOMER_AUTH_REDIRECT_URI", "").strip(),
        "post_login": os.environ.get("CUSTOMER_AUTH_POST_LOGIN_REDIRECT", "").strip(),
    }


def _is_configured(cfg) -> bool:
    return bool(cfg["shop_id"] and cfg["client_id"] and cfg["client_secret"])


def _base_url(cfg) -> str:
    return f"https://shopify.com/authentication/{cfg['shop_id']}"


def _origin(request: Request) -> str:
    # Prefer the public origin the browser used (honour proxy headers).
    proto = request.headers.get("x-forwarded-proto", request.url.scheme)
    host = request.headers.get("x-forwarded-host") or request.headers.get("host")
    return f"{proto}://{host}"


def _redirect_uri(cfg, request: Request) -> str:
    if cfg["redirect_uri"]:
        return cfg["redirect_uri"]
    return f"{_origin(request)}/api/customer-auth/callback"


def _post_login_uri(cfg, request: Request) -> str:
    if cfg["post_login"]:
        return cfg["post_login"]
    return f"{_origin(request)}/account"


_discovery_cache = {}


async def _discover(cfg):
    """Fetch (and cache) the OIDC discovery document for this shop."""
    key = cfg["shop_id"]
    if key in _discovery_cache:
        return _discovery_cache[key]
    url = f"{_base_url(cfg)}/.well-known/openid-configuration"
    async with httpx.AsyncClient(timeout=15) as client:
        r = await client.get(url)
        r.raise_for_status()
        doc = r.json()
    _discovery_cache[key] = doc
    return doc


def _pkce_pair():
    verifier = base64.urlsafe_b64encode(secrets.token_bytes(48)).decode().rstrip("=")
    challenge = base64.urlsafe_b64encode(
        hashlib.sha256(verifier.encode()).digest()
    ).decode().rstrip("=")
    return verifier, challenge


def _cookie_kwargs(max_age):
    return dict(httponly=True, secure=True, samesite="lax", max_age=max_age, path="/")


# --------------------------------------------------------------------------- #
# Routes
# --------------------------------------------------------------------------- #
@router.get("/login")
async def login(request: Request):
    cfg = _cfg()
    if not _is_configured(cfg):
        raise HTTPException(
            status_code=503,
            detail="Shopify Customer Account API is not configured. Set SHOPIFY_SHOP_ID, "
                   "SHOPIFY_CUSTOMER_ACCOUNT_CLIENT_ID and SHOPIFY_CUSTOMER_ACCOUNT_CLIENT_SECRET.",
        )
    try:
        disc = await _discover(cfg)
    except Exception as e:
        logger.error(f"OIDC discovery failed: {e}")
        raise HTTPException(status_code=502, detail="Unable to reach Shopify authentication server.")

    state = secrets.token_urlsafe(24)
    nonce = secrets.token_urlsafe(24)
    verifier, challenge = _pkce_pair()
    redirect_uri = _redirect_uri(cfg, request)

    await oauth_flows.insert_one({
        "state": state,
        "nonce": nonce,
        "code_verifier": verifier,
        "redirect_uri": redirect_uri,
        "post_login": _post_login_uri(cfg, request),
        "created_at": datetime.now(timezone.utc),
        "expires_at": datetime.now(timezone.utc) + timedelta(minutes=15),
    })

    params = {
        "response_type": "code",
        "client_id": cfg["client_id"],
        "scope": SCOPES,
        "redirect_uri": redirect_uri,
        "state": state,
        "nonce": nonce,
        "code_challenge": challenge,
        "code_challenge_method": "S256",
    }
    authorize_url = f"{disc['authorization_endpoint']}?{urlencode(params)}"
    return RedirectResponse(authorize_url, status_code=302)


@router.get("/callback")
async def callback(request: Request, code: str = None, state: str = None, error: str = None):
    cfg = _cfg()
    fallback = _post_login_uri(cfg, request)
    if error:
        return RedirectResponse(f"{fallback}?auth_error={error}", status_code=302)
    if not code or not state:
        return RedirectResponse(f"{fallback}?auth_error=missing_code", status_code=302)

    flow = await oauth_flows.find_one({"state": state})
    if not flow:
        return RedirectResponse(f"{fallback}?auth_error=invalid_state", status_code=302)
    await oauth_flows.delete_one({"state": state})

    try:
        disc = await _discover(cfg)
        basic = base64.b64encode(f"{cfg['client_id']}:{cfg['client_secret']}".encode()).decode()
        data = {
            "grant_type": "authorization_code",
            "client_id": cfg["client_id"],
            "redirect_uri": flow["redirect_uri"],
            "code": code,
            "code_verifier": flow["code_verifier"],
        }
        async with httpx.AsyncClient(timeout=20) as client:
            r = await client.post(
                disc["token_endpoint"],
                data=data,
                headers={
                    "Authorization": f"Basic {basic}",
                    "Content-Type": "application/x-www-form-urlencoded",
                    "User-Agent": "FoeGuard-Headless",
                },
            )
        if r.status_code != 200:
            logger.error(f"Token exchange failed {r.status_code}: {r.text}")
            return RedirectResponse(f"{flow['post_login']}?auth_error=token_exchange", status_code=302)
        tokens = r.json()
    except Exception as e:
        logger.error(f"Token exchange error: {e}")
        return RedirectResponse(f"{flow['post_login']}?auth_error=token_exchange", status_code=302)

    access_token = tokens.get("access_token")
    id_token = tokens.get("id_token")
    refresh_token = tokens.get("refresh_token")
    expires_in = int(tokens.get("expires_in", 3600))

    claims = {}
    if id_token:
        try:
            claims = jwt.decode(id_token, options={"verify_signature": False, "verify_aud": False})
        except Exception as e:
            logger.warning(f"id_token decode failed: {e}")

    customer_id = claims.get("sub") or ""
    email = claims.get("email") or ""
    first_name = claims.get("given_name") or ""
    last_name = claims.get("family_name") or ""

    # Enrich name/email via Customer Account API (best-effort).
    profile = await _fetch_customer(cfg, access_token)
    if profile:
        customer_id = profile.get("id") or customer_id
        email = (profile.get("emailAddress") or {}).get("emailAddress") or email
        first_name = profile.get("firstName") or first_name
        last_name = profile.get("lastName") or last_name

    session_id = secrets.token_urlsafe(32)
    await sessions.insert_one({
        "session_id": session_id,
        "shopify_customer_id": customer_id,
        "email": email,
        "first_name": first_name,
        "last_name": last_name,
        "access_token": access_token,
        "refresh_token": refresh_token,
        "id_token": id_token,
        "created_at": datetime.now(timezone.utc),
        "expires_at": datetime.now(timezone.utc) + timedelta(days=30),
        "token_expires_at": datetime.now(timezone.utc) + timedelta(seconds=expires_in),
    })

    resp = RedirectResponse(flow["post_login"], status_code=302)
    resp.set_cookie(SESSION_COOKIE, session_id, **_cookie_kwargs(60 * 60 * 24 * 30))
    return resp


@router.get("/session")
async def session(request: Request):
    sid = request.cookies.get(SESSION_COOKIE)
    if not sid:
        return {"authenticated": False, "customer": None}
    doc = await sessions.find_one({"session_id": sid})
    if not doc:
        return {"authenticated": False, "customer": None}
    if doc.get("expires_at") and doc["expires_at"].replace(tzinfo=timezone.utc) < datetime.now(timezone.utc):
        await sessions.delete_one({"session_id": sid})
        return {"authenticated": False, "customer": None}

    name = " ".join([p for p in [doc.get("first_name"), doc.get("last_name")] if p]) or doc.get("email")
    return {
        "authenticated": True,
        "customer": {
            "id": doc.get("shopify_customer_id"),
            "shopify_customer_id": doc.get("shopify_customer_id"),
            "email": doc.get("email"),
            "firstName": doc.get("first_name"),
            "lastName": doc.get("last_name"),
            "name": name,
        },
    }


@router.post("/logout")
async def logout(request: Request):
    cfg = _cfg()
    sid = request.cookies.get(SESSION_COOKIE)
    logout_url = None
    id_token = None
    if sid:
        doc = await sessions.find_one({"session_id": sid})
        if doc:
            id_token = doc.get("id_token")
        await sessions.delete_one({"session_id": sid})

    if _is_configured(cfg):
        try:
            disc = await _discover(cfg)
            end = disc.get("end_session_endpoint") or f"{_base_url(cfg)}/logout"
            params = {"post_logout_redirect_uri": _post_login_uri(cfg, request)}
            if id_token:
                params["id_token_hint"] = id_token
            logout_url = f"{end}?{urlencode(params)}"
        except Exception:
            logout_url = None

    resp = JSONResponse({"ok": True, "logout_url": logout_url})
    resp.delete_cookie(SESSION_COOKIE, path="/")
    return resp


@router.get("/orders")
async def orders(request: Request):
    cfg = _cfg()
    sid = request.cookies.get(SESSION_COOKIE)
    if not sid:
        return {"orders": []}
    doc = await sessions.find_one({"session_id": sid})
    if not doc or not _is_configured(cfg):
        return {"orders": []}
    query = """
    query { customer { orders(first: 25, reverse: true) { nodes {
      id name processedAt
      totalPrice { amount currencyCode }
      lineItems(first: 50) { nodes { title quantity } }
    } } } }
    """
    result = await _graphql(cfg, doc.get("access_token"), query)
    nodes = (((result or {}).get("data") or {}).get("customer") or {}).get("orders", {}).get("nodes", [])
    return {"orders": nodes}


# --------------------------------------------------------------------------- #
# Customer Account API helpers
# --------------------------------------------------------------------------- #
async def _graphql(cfg, access_token, query):
    if not access_token:
        return None
    url = f"https://shopify.com/{cfg['shop_id']}/account/customer/api/{cfg['api_version']}/graphql"
    try:
        async with httpx.AsyncClient(timeout=20) as client:
            r = await client.post(
                url,
                json={"query": query},
                headers={
                    "Authorization": access_token,
                    "Content-Type": "application/json",
                    "User-Agent": "FoeGuard-Headless",
                },
            )
        if r.status_code != 200:
            logger.warning(f"Customer Account API {r.status_code}: {r.text[:200]}")
            return None
        return r.json()
    except Exception as e:
        logger.warning(f"Customer Account API error: {e}")
        return None


async def _fetch_customer(cfg, access_token):
    query = "query { customer { id firstName lastName emailAddress { emailAddress } } }"
    result = await _graphql(cfg, access_token, query)
    if not result:
        return None
    return ((result.get("data") or {}).get("customer")) or None
