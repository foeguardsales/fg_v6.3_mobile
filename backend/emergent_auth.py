"""
Customer authentication — unified session (Emergent Google + email/password).

Both sign-in methods produce the SAME server-side session (a 7-day token stored
in Mongo `user_sessions` + an httpOnly `session_token` cookie), so the account
and Manage Subscription pages work regardless of how the user signed in.

  - Google:         POST /api/auth/session   (exchange Emergent session_id)
  - Email/password: POST /api/auth/signup, POST /api/auth/signin, POST /api/auth/recover
  - Shared:         GET  /api/auth/session, POST /api/auth/logout

Email/password create/authenticate a REAL Shopify customer via the Storefront
Customer API (shopify_service.customers). Google users are best-effort linked to
a Shopify customer record too. Admin auth (Mongo/JWT via /api/auth/login) is untouched.
"""
import os
import uuid
import secrets
import logging
from datetime import datetime, timezone, timedelta

import httpx
from fastapi import APIRouter, Request, Response, HTTPException, Header
from motor.motor_asyncio import AsyncIOMotorClient

from shopify_service import customers as shopify_customers

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/auth", tags=["customer-auth"])

_client = AsyncIOMotorClient(os.environ["MONGO_URL"])
_db = _client[os.environ["DB_NAME"]]
users = _db.users
sessions = _db.user_sessions

EMERGENT_SESSION_URL = "https://demobackend.emergentagent.com/auth/v1/env/oauth/session-data"
COOKIE = "session_token"
SESSION_DAYS = 7


def _cookie_kwargs(max_age):
    return dict(httponly=True, secure=True, samesite="none", path="/", max_age=max_age)


def _split_name(name):
    parts = (name or "").strip().split()
    if not parts:
        return "", ""
    if len(parts) == 1:
        return parts[0], ""
    return parts[0], " ".join(parts[1:])


def _public_user(u):
    if not u:
        return None
    first, last = _split_name(u.get("name"))
    return {
        "user_id": u.get("user_id"),
        "email": u.get("email"),
        "name": u.get("name"),
        "firstName": u.get("firstName") or first,
        "lastName": u.get("lastName") or last,
        "picture": u.get("picture"),
        "role": u.get("role", "customer"),
        "auth_method": u.get("auth_method"),
        "shopify_customer_id": u.get("shopify_customer_id"),
    }


async def _save_session(response, *, email, name=None, picture=None, first=None, last=None,
                        shopify_customer_id=None, shopify_access_token=None,
                        session_token=None, auth_method="google"):
    """Upsert the Mongo user, create a session + cookie, return the public user."""
    now = datetime.now(timezone.utc)
    if (not first and not last) and name:
        first, last = _split_name(name)
    display_name = name or (f"{first or ''} {last or ''}".strip()) or email

    set_fields = {
        "name": display_name,
        "picture": picture,
        "firstName": first,
        "lastName": last,
        "auth_method": auth_method,
        "updated_at": now,
    }
    if shopify_customer_id:
        set_fields["shopify_customer_id"] = shopify_customer_id
    if shopify_access_token:
        set_fields["shopify_access_token"] = shopify_access_token
    set_fields = {k: v for k, v in set_fields.items() if v is not None}

    existing = await users.find_one({"email": email}, {"_id": 0})
    if existing:
        user_id = existing["user_id"]
        await users.update_one({"user_id": user_id}, {"$set": set_fields})
    else:
        user_id = f"user_{uuid.uuid4().hex[:12]}"
        doc = {"user_id": user_id, "email": email, "role": "customer", "created_at": now}
        doc.update(set_fields)
        await users.insert_one(doc)

    token = session_token or secrets.token_urlsafe(32)
    expires_at = now + timedelta(days=SESSION_DAYS)
    await sessions.update_one(
        {"session_token": token},
        {"$set": {
            "session_token": token,
            "user_id": user_id,
            "email": email,
            "expires_at": expires_at,
            "created_at": now,
            "auth_method": auth_method,
        }},
        upsert=True,
    )
    response.set_cookie(COOKIE, token, **_cookie_kwargs(SESSION_DAYS * 24 * 3600))
    user_doc = await users.find_one({"user_id": user_id}, {"_id": 0})
    return _public_user(user_doc)


async def _link_shopify_for_google(email, first, last):
    """Best-effort: create a Shopify customer so Google users have a linked record.
    If the email already exists (TAKEN) or write is unavailable, we simply link by
    email — Google sign-in must never fail because of this."""
    try:
        rnd = secrets.token_urlsafe(18) + "Aa1!"
        res = await shopify_customers.customer_create(email, rnd, first, last)
        cust = ((res or {}).get("customerCreate") or {}).get("customer")
        if cust:
            return cust.get("id")
    except Exception as e:
        logger.info(f"Google->Shopify link skipped for {email}: {e}")
    return None


# ---------------------------------------------------------------------------
# Google (Emergent) sign in
# ---------------------------------------------------------------------------
@router.post("/session")
async def create_session(request: Request, response: Response, x_session_id: str = Header(None)):
    session_id = x_session_id
    if not session_id:
        try:
            body = await request.json()
            session_id = (body or {}).get("session_id")
        except Exception:
            session_id = None
    if not session_id:
        raise HTTPException(status_code=400, detail="Missing session_id")

    try:
        async with httpx.AsyncClient(timeout=20) as c:
            r = await c.get(EMERGENT_SESSION_URL, headers={"X-Session-ID": session_id})
    except Exception as e:
        logger.error(f"Emergent session-data request failed: {e}")
        raise HTTPException(status_code=502, detail="Auth provider unreachable")

    if r.status_code != 200:
        raise HTTPException(status_code=401, detail="Invalid or expired session")

    data = r.json()
    email = data.get("email")
    name = data.get("name")
    picture = data.get("picture")
    emergent_token = data.get("session_token")
    if not email or not emergent_token:
        raise HTTPException(status_code=401, detail="Invalid session data")

    first, last = _split_name(name)
    existing = await users.find_one({"email": email}, {"_id": 0})
    shopify_id = existing.get("shopify_customer_id") if existing else None
    if not shopify_id:
        shopify_id = await _link_shopify_for_google(email, first, last)

    user = await _save_session(
        response, email=email, name=name, picture=picture, first=first, last=last,
        shopify_customer_id=shopify_id, session_token=emergent_token, auth_method="google",
    )
    return {"authenticated": True, "user": user}


# ---------------------------------------------------------------------------
# Email / password (Shopify Storefront customer API)
# ---------------------------------------------------------------------------
@router.post("/signup")
async def signup(request: Request, response: Response):
    body = await request.json()
    email = (body or {}).get("email", "").strip()
    password = (body or {}).get("password", "")
    first = (body or {}).get("firstName") or None
    last = (body or {}).get("lastName") or None
    if not email or not password:
        raise HTTPException(status_code=400, detail="Email and password are required")

    res = await shopify_customers.customer_create(email, password, first, last)
    cc = (res or {}).get("customerCreate") or {}
    cust = cc.get("customer")
    errs = cc.get("customerUserErrors") or []
    if not cust:
        msg = errs[0].get("message") if errs else "Could not create account"
        raise HTTPException(status_code=400, detail=msg)

    access_token = None
    try:
        tok_res = await shopify_customers.customer_access_token_create(email, password)
        access_token = (((tok_res or {}).get("customerAccessTokenCreate") or {})
                        .get("customerAccessToken") or {}).get("accessToken")
    except Exception:
        access_token = None

    name = (f"{first or ''} {last or ''}".strip()) or email
    user = await _save_session(
        response, email=email, name=name, first=first, last=last,
        shopify_customer_id=cust.get("id"), shopify_access_token=access_token,
        auth_method="password",
    )
    return {"authenticated": True, "user": user}


@router.post("/signin")
async def signin(request: Request, response: Response):
    body = await request.json()
    email = (body or {}).get("email", "").strip()
    password = (body or {}).get("password", "")
    if not email or not password:
        raise HTTPException(status_code=400, detail="Email and password are required")

    tok_res = await shopify_customers.customer_access_token_create(email, password)
    cc = (tok_res or {}).get("customerAccessTokenCreate") or {}
    access_token = (cc.get("customerAccessToken") or {}).get("accessToken")
    if not access_token:
        errs = cc.get("customerUserErrors") or []
        msg = errs[0].get("message") if errs else "Invalid email or password"
        raise HTTPException(status_code=401, detail=msg)

    cust = {}
    try:
        cust = await shopify_customers.customer_get(access_token) or {}
    except Exception:
        cust = {}
    first = cust.get("firstName")
    last = cust.get("lastName")
    name = (f"{first or ''} {last or ''}".strip()) or email
    user = await _save_session(
        response, email=email, name=name, first=first, last=last,
        shopify_customer_id=cust.get("id"), shopify_access_token=access_token,
        auth_method="password",
    )
    return {"authenticated": True, "user": user}


@router.post("/recover")
async def recover(request: Request):
    body = await request.json()
    email = (body or {}).get("email", "").strip()
    if not email:
        raise HTTPException(status_code=400, detail="Email is required")
    try:
        await shopify_customers.customer_recover(email)
    except Exception as e:
        logger.info(f"customer_recover failed for {email}: {e}")
    # Always return ok (don't leak which emails exist).
    return {"ok": True}


# ---------------------------------------------------------------------------
# Shared: session check + logout
# ---------------------------------------------------------------------------
async def _resolve_user(request: Request):
    token = request.cookies.get(COOKIE)
    if not token:
        auth = request.headers.get("Authorization", "")
        if auth.startswith("Bearer "):
            token = auth[7:]
    if not token:
        return None
    sess = await sessions.find_one({"session_token": token}, {"_id": 0})
    if not sess:
        return None
    expires_at = sess.get("expires_at")
    if isinstance(expires_at, str):
        expires_at = datetime.fromisoformat(expires_at)
    if expires_at and expires_at.tzinfo is None:
        expires_at = expires_at.replace(tzinfo=timezone.utc)
    if not expires_at or expires_at < datetime.now(timezone.utc):
        return None
    return await users.find_one({"user_id": sess["user_id"]}, {"_id": 0})


@router.get("/session")
async def get_session(request: Request):
    user = await _resolve_user(request)
    if not user:
        return {"authenticated": False, "user": None}
    return {"authenticated": True, "user": _public_user(user)}


@router.post("/logout")
async def logout(request: Request, response: Response):
    token = request.cookies.get(COOKIE)
    if not token:
        auth = request.headers.get("Authorization", "")
        if auth.startswith("Bearer "):
            token = auth[7:]
    if token:
        await sessions.delete_one({"session_token": token})
    response.delete_cookie(COOKIE, path="/")
    return {"ok": True}
