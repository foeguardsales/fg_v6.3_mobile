from fastapi import FastAPI, APIRouter, HTTPException, Depends
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from typing import List, Optional
import uuid
from datetime import datetime, timezone, timedelta
import stripe
import jwt
import bcrypt
import sib_api_v3_sdk
from sib_api_v3_sdk.rest import ApiException

from models import Product, Treat, Order, CheckoutRequest
from seed_data import ALL_PRODUCTS, TREATS

# Logging setup - must be before any logger usage
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# Stripe configuration
stripe.api_key = os.environ['STRIPE_SECRET_KEY']
STRIPE_PUBLIC_KEY = os.environ['STRIPE_PUBLIC_KEY']

# JWT configuration
JWT_SECRET = os.environ['JWT_SECRET']
JWT_ALGORITHM = "HS256"

# Brevo configuration
brevo_config = sib_api_v3_sdk.Configuration()
brevo_config.api_key['api-key'] = os.environ['BREVO_API_KEY']

# Security
security = HTTPBearer()

app = FastAPI()
api_router = APIRouter(prefix="/api")

# Seed database on startup
@app.on_event("startup")
async def seed_database():
    existing = await db.products.find_one({})
    if not existing:
        logger.info("Seeding products...")
        await db.products.insert_many(ALL_PRODUCTS)
        await db.treats.insert_many(TREATS)
        logger.info("Database seeded successfully")

# Auth helpers
def hash_password(password: str) -> str:
    return bcrypt.hashpw(password.encode(), bcrypt.gensalt()).decode()

def verify_password(password: str, hashed: str) -> bool:
    return bcrypt.checkpw(password.encode(), hashed.encode())

def create_token(user_id: str, email: str, role: str = "customer") -> str:
    payload = {
        "user_id": user_id,
        "email": email,
        "role": role,
        "exp": datetime.now(timezone.utc) + timedelta(days=30)
    }
    return jwt.encode(payload, JWT_SECRET, algorithm=JWT_ALGORITHM)

async def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)):
    try:
        token = credentials.credentials
        payload = jwt.decode(token, JWT_SECRET, algorithms=[JWT_ALGORITHM])
        user = await db.users.find_one({"email": payload["email"]}, {"_id": 0, "password": 0})
        if not user:
            raise HTTPException(status_code=401, detail="User not found")
        return user
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token expired")
    except Exception:
        raise HTTPException(status_code=401, detail="Invalid token")

# Brevo email helper
def send_order_confirmation(email: str, name: str, order_id: str, total: float):
    try:
        api_instance = sib_api_v3_sdk.TransactionalEmailsApi(sib_api_v3_sdk.ApiClient(brevo_config))
        send_smtp_email = sib_api_v3_sdk.SendSmtpEmail(
            to=[{"email": email, "name": name}],
            sender={"name": "FoeGuard", "email": "hello@foeguard.com"},
            subject=f"Order Confirmation - {order_id}",
            html_content=f"<h1>Thank you for your order!</h1><p>Hi {name},</p><p>Your order {order_id} has been confirmed.</p><p>Total: ${total:.2f}</p><p>We'll send you shipping updates soon.</p><p>- The FoeGuard Team</p>"
        )
        api_instance.send_transac_email(send_smtp_email)
    except ApiException as e:
        logger.error(f"Brevo email failed: {e}")

# Auth routes
@api_router.post("/auth/register")
async def register(data: dict):
    email = data.get("email")
    password = data.get("password")
    name = data.get("name")
    
    if not email or not password or not name:
        raise HTTPException(status_code=400, detail="Missing fields")
    
    existing = await db.users.find_one({"email": email})
    if existing:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    user_doc = {
        "user_id": str(uuid.uuid4()),
        "email": email,
        "password": hash_password(password),
        "name": name,
        "role": "customer",
        "created_at": datetime.now(timezone.utc).isoformat()
    }
    
    await db.users.insert_one(user_doc)
    token = create_token(user_doc["user_id"], email, "customer")
    
    return {"token": token, "user": {"email": email, "name": name, "role": "customer"}}

@api_router.post("/auth/login")
async def login(data: dict):
    email = data.get("email")
    password = data.get("password")
    
    user = await db.users.find_one({"email": email})
    if not user or not verify_password(password, user["password"]):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    
    token = create_token(user["user_id"], email, user.get("role", "customer"))
    return {"token": token, "user": {"email": email, "name": user.get("name"), "role": user.get("role", "customer")}}

@api_router.get("/auth/me")
async def get_me(current_user = Depends(get_current_user)):
    return current_user

# Product routes
@api_router.get("/")
async def root():
    return {"message": "FoeGuard API"}

@api_router.get("/products", response_model=List[Product])
async def get_products():
    products = await db.products.find({}, {"_id": 0}).to_list(100)
    return products

@api_router.get("/products/{product_id}", response_model=Product)
async def get_product(product_id: str):
    product = await db.products.find_one({"product_id": product_id}, {"_id": 0})
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    return product

@api_router.get("/treats", response_model=List[Treat])
async def get_treats():
    treats = await db.treats.find({}, {"_id": 0}).to_list(100)
    return treats

@api_router.get("/stripe-public-key")
async def get_stripe_key():
    return {"publicKey": STRIPE_PUBLIC_KEY}

# Checkout with subscription support
@api_router.post("/create-payment-intent")
async def create_payment_intent(checkout_data: CheckoutRequest):
    try:
        is_subscription = checkout_data.is_subscription if hasattr(checkout_data, 'is_subscription') else False
        
        if is_subscription:
            # Apply 10% discount for subscription
            discounted_total = checkout_data.total * 0.9
        else:
            discounted_total = checkout_data.total
        
        intent = stripe.PaymentIntent.create(
            amount=int(discounted_total * 100),
            currency="cad",
            metadata={
                "customer_email": checkout_data.customer_email,
                "customer_name": checkout_data.customer_name,
                "box_size_lb": checkout_data.box_size_lb,
                "is_subscription": str(is_subscription)
            }
        )
        
        order_doc = {
            "order_id": str(uuid.uuid4()),
            "customer_email": checkout_data.customer_email,
            "customer_name": checkout_data.customer_name,
            "box_size_lb": checkout_data.box_size_lb,
            "proteins": [p.model_dump() for p in checkout_data.proteins],
            "treats": [t.model_dump() for t in checkout_data.treats],
            "subtotal": checkout_data.subtotal,
            "tax": checkout_data.tax,
            "total": discounted_total,
            "is_subscription": is_subscription,
            "subscription_status": "active" if is_subscription else None,
            "stripe_payment_id": intent.id,
            "status": "pending",
            "created_at": datetime.now(timezone.utc).isoformat()
        }
        
        await db.orders.insert_one(order_doc)
        return {"clientSecret": intent.client_secret}
        
    except Exception as e:
        logger.error(f"Payment intent creation failed: {str(e)}")
        raise HTTPException(status_code=400, detail=str(e))

@api_router.post("/confirm-order")
async def confirm_order(data: dict):
    try:
        payment_intent_id = data.get("payment_intent_id")
        result = await db.orders.update_one(
            {"stripe_payment_id": payment_intent_id},
            {"$set": {"status": "confirmed"}}
        )
        
        if result.modified_count == 0:
            raise HTTPException(status_code=404, detail="Order not found")
        
        order = await db.orders.find_one({"stripe_payment_id": payment_intent_id}, {"_id": 0})
        
        # Send confirmation email
        send_order_confirmation(
            order["customer_email"],
            order["customer_name"],
            order["order_id"],
            order["total"]
        )
        
        return {"success": True, "order": order}
        
    except Exception as e:
        logger.error(f"Order confirmation failed: {str(e)}")
        raise HTTPException(status_code=400, detail=str(e))

# Order history
@api_router.get("/orders/my-orders")
async def get_my_orders(current_user = Depends(get_current_user)):
    orders = await db.orders.find(
        {"customer_email": current_user["email"]},
        {"_id": 0}
    ).sort("created_at", -1).to_list(100)
    return orders

# Subscription management
@api_router.post("/subscriptions/pause")
async def pause_subscription(data: dict, current_user = Depends(get_current_user)):
    order_id = data.get("order_id")
    result = await db.orders.update_one(
        {"order_id": order_id, "customer_email": current_user["email"], "is_subscription": True},
        {"$set": {"subscription_status": "paused"}}
    )
    if result.modified_count == 0:
        raise HTTPException(status_code=404, detail="Subscription not found")
    return {"success": True}

@api_router.post("/subscriptions/resume")
async def resume_subscription(data: dict, current_user = Depends(get_current_user)):
    order_id = data.get("order_id")
    result = await db.orders.update_one(
        {"order_id": order_id, "customer_email": current_user["email"], "is_subscription": True},
        {"$set": {"subscription_status": "active"}}
    )
    if result.modified_count == 0:
        raise HTTPException(status_code=404, detail="Subscription not found")
    return {"success": True}

@api_router.post("/subscriptions/cancel")
async def cancel_subscription(data: dict, current_user = Depends(get_current_user)):
    order_id = data.get("order_id")
    result = await db.orders.update_one(
        {"order_id": order_id, "customer_email": current_user["email"], "is_subscription": True},
        {"$set": {"subscription_status": "cancelled"}}
    )
    if result.modified_count == 0:
        raise HTTPException(status_code=404, detail="Subscription not found")
    return {"success": True}

# Admin routes
@api_router.get("/admin/orders")
async def get_all_orders(current_user = Depends(get_current_user)):
    if current_user.get("role") != "admin":
        raise HTTPException(status_code=403, detail="Admin access required")
    
    orders = await db.orders.find({}, {"_id": 0}).sort("created_at", -1).to_list(1000)
    return orders

@api_router.post("/admin/orders/{order_id}/status")
async def update_order_status(order_id: str, data: dict, current_user = Depends(get_current_user)):
    if current_user.get("role") != "admin":
        raise HTTPException(status_code=403, detail="Admin access required")
    
    status = data.get("status")
    result = await db.orders.update_one(
        {"order_id": order_id},
        {"$set": {"status": status}}
    )
    if result.modified_count == 0:
        raise HTTPException(status_code=404, detail="Order not found")
    return {"success": True}

# Google Places API routes (gracefully handle missing API key)
GOOGLE_PLACES_API_KEY = os.environ.get('GOOGLE_PLACES_API_KEY', '')

@api_router.post("/places/autocomplete")
async def places_autocomplete(data: dict):
    """Get address suggestions from Google Places API."""
    input_text = data.get("input", "")
    
    if not input_text or len(input_text) < 3:
        return {"predictions": []}
    
    if not GOOGLE_PLACES_API_KEY:
        # Return empty - allows manual address entry
        logger.warning("Google Places API key not configured")
        return {"predictions": []}
    
    try:
        import httpx
        async with httpx.AsyncClient() as client:
            response = await client.post(
                "https://places.googleapis.com/v1/places:autocomplete",
                headers={
                    "Content-Type": "application/json",
                    "X-Goog-Api-Key": GOOGLE_PLACES_API_KEY,
                },
                json={
                    "input": input_text,
                    "languageCode": "en",
                    "regionCode": "CA",  # Canada
                    "includedPrimaryTypes": ["locality", "postal_code", "street_address"],
                }
            )
            
            if response.status_code != 200:
                logger.error(f"Google Places API error: {response.status_code}")
                return {"predictions": []}
            
            data = response.json()
            predictions = []
            for suggestion in data.get("suggestions", []):
                pred = suggestion.get("placePrediction", {})
                predictions.append({
                    "place_id": pred.get("placeId"),
                    "description": pred.get("text", {}).get("text", ""),
                    "main_text": pred.get("structuredFormat", {}).get("mainText", {}).get("text", ""),
                    "secondary_text": pred.get("structuredFormat", {}).get("secondaryText", {}).get("text", ""),
                })
            
            return {"predictions": predictions}
    except Exception as e:
        logger.error(f"Places autocomplete error: {e}")
        return {"predictions": []}

@api_router.get("/places/details")
async def places_details(placeId: str):
    """Get detailed address information for a place."""
    if not GOOGLE_PLACES_API_KEY or not placeId:
        return {"address": ""}
    
    try:
        import httpx
        async with httpx.AsyncClient() as client:
            response = await client.get(
                f"https://places.googleapis.com/v1/places/{placeId}",
                headers={
                    "X-Goog-Api-Key": GOOGLE_PLACES_API_KEY,
                },
                params={
                    "fields": "addressComponents,formattedAddress",
                }
            )
            
            if response.status_code != 200:
                return {"address": ""}
            
            data = response.json()
            
            # Parse address components
            street = ""
            city = ""
            state = ""
            zipCode = ""
            country = ""
            
            for component in data.get("addressComponents", []):
                types = component.get("types", [])
                text = component.get("longText", "")
                
                if "street_number" in types:
                    street = text + " " + street
                elif "route" in types:
                    street += text
                elif "locality" in types:
                    city = text
                elif "administrative_area_level_1" in types:
                    state = text
                elif "postal_code" in types:
                    zipCode = text
                elif "country" in types:
                    country = text
            
            return {
                "address": data.get("formattedAddress", ""),
                "street": street.strip(),
                "city": city,
                "state": state,
                "zipCode": zipCode,
                "country": country
            }
    except Exception as e:
        logger.error(f"Places details error: {e}")
        return {"address": ""}

app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
