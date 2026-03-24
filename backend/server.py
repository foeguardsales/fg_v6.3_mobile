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
from seed_data import ALL_PRODUCTS, ALL_TREATS, ROYAL_PAWS_PRODUCTS, CAT_TREATS

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
    # Always update products to ensure latest data (names, descriptions, etc.)
    logger.info("Updating products with latest data...")
    
    # Use bulk operations to update or insert
    from seed_data import ALL_PRODUCTS, ALL_TREATS
    
    for product in ALL_PRODUCTS:
        await db.products.update_one(
            {"product_id": product["product_id"]},
            {"$set": product},
            upsert=True
        )
    
    # Get valid treat IDs from seed data
    valid_treat_ids = [t["treat_id"] for t in ALL_TREATS]
    
    # Remove treats that are no longer in the seed data
    await db.treats.delete_many({"treat_id": {"$nin": valid_treat_ids}})
    
    for treat in ALL_TREATS:
        await db.treats.update_one(
            {"treat_id": treat["treat_id"]},
            {"$set": treat},
            upsert=True
        )
    
    logger.info("Database updated successfully")

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

@api_router.get("/products")
async def get_products(pet_type: str = None):
    query = {}
    if pet_type == "dog":
        query = {"product_line": {"$in": ["comfort_dinner", "primal_feast"]}}
    elif pet_type == "cat":
        query = {"product_line": "royal_paws"}
    products = await db.products.find(query, {"_id": 0}).to_list(100)
    return products

@api_router.get("/products/{product_id}")
async def get_product(product_id: str):
    product = await db.products.find_one({"product_id": product_id}, {"_id": 0})
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    return product

@api_router.get("/treats")
async def get_treats(pet_type: str = None):
    query = {}
    if pet_type == "dog":
        query = {"$or": [{"pet_type": {"$exists": False}}, {"pet_type": "dog"}]}
    elif pet_type == "cat":
        query = {"pet_type": "cat"}
    treats = await db.treats.find(query, {"_id": 0}).to_list(100)
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
            "subscription_frequency": getattr(checkout_data, 'subscription_frequency', 'monthly') if is_subscription else None,
            "order_notes": getattr(checkout_data, 'order_notes', ''),
            "stripe_payment_id": intent.id,
            "status": "pending",
            "created_at": datetime.now(timezone.utc).isoformat()
        }
        
        await db.orders.insert_one(order_doc)
        return {"clientSecret": intent.client_secret}
        
    except Exception as e:
        logger.error(f"Payment intent creation failed: {str(e)}")
        raise HTTPException(status_code=400, detail=str(e))

@api_router.post("/validate-promo")
async def validate_promo(data: dict):
    """Validate promo code and return discount info"""
    code = data.get("code", "").upper()
    order_total = data.get("order_total", 0)
    
    promo = await db.promo_codes.find_one({"code": code, "is_active": True})
    
    if not promo:
        raise HTTPException(status_code=404, detail="Invalid promo code")
    
    # Check expiry
    if promo.get("end_date") and datetime.now() > promo["end_date"]:
        raise HTTPException(status_code=400, detail="Promo code expired")
    
    # Check usage limit
    if promo.get("max_uses") and promo.get("current_uses", 0) >= promo["max_uses"]:
        raise HTTPException(status_code=400, detail="Promo code usage limit reached")
    
    # Check min order value
    if promo.get("min_order_value") and order_total < promo["min_order_value"]:
        raise HTTPException(status_code=400, detail=f"Minimum order value ${promo['min_order_value']} required")
    
    # Calculate discount
    discount_value = promo["discount_value"]
    if promo["discount_type"] == "percentage":
        discount_amount = order_total * (discount_value / 100)
    else:
        discount_amount = discount_value
    
    return {
        "valid": True,
        "discount_amount": discount_amount,
        "discount_type": promo["discount_type"],
        "code": code
    }

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

@api_router.post("/subscriptions/swap")
async def swap_subscription(data: dict, current_user = Depends(get_current_user)):
    """Change box size for a subscription"""
    order_id = data.get("order_id")
    new_box_size = data.get("new_box_size")
    
    if not order_id or not new_box_size:
        raise HTTPException(status_code=400, detail="Missing order_id or new_box_size")
    
    if new_box_size not in [12, 18, 24, 30]:
        raise HTTPException(status_code=400, detail="Invalid box size")
    
    result = await db.orders.update_one(
        {"order_id": order_id, "customer_email": current_user["email"], "is_subscription": True},
        {"$set": {"box_size_lb": new_box_size}}
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

# ============================================================================
# ADMIN ENDPOINTS
# ============================================================================

# Admin authentication middleware
async def get_admin_user(credentials: HTTPAuthorizationCredentials = Depends(security)):
    user = await get_current_user(credentials)
    if user.get("role") != "admin":
        raise HTTPException(status_code=403, detail="Admin access required")
    return user

# Cloudflare R2 Setup
import boto3
from botocore.client import Config

r2_client = boto3.client(
    's3',
    endpoint_url=f"https://{os.environ['CLOUDFLARE_ACCOUNT_ID']}.r2.cloudflarestorage.com",
    aws_access_key_id=os.environ['CLOUDFLARE_R2_ACCESS_KEY'],
    aws_secret_access_key=os.environ['CLOUDFLARE_R2_SECRET_KEY'],
    config=Config(signature_version='s3v4'),
    region_name='auto'
)

BUCKET_NAME = os.environ.get('CLOUDFLARE_R2_BUCKET_NAME', 'foeguard-assets')
PUBLIC_URL = os.environ.get('CLOUDFLARE_R2_PUBLIC_URL', f"https://pub-{os.environ['CLOUDFLARE_ACCOUNT_ID']}.r2.dev")

# Image Upload
@api_router.post("/admin/upload-image")
async def upload_image(file_data: dict, admin: dict = Depends(get_admin_user)):
    """Upload image to Cloudflare R2"""
    try:
        import base64
        import mimetypes
        
        # Extract base64 data
        content = file_data.get('content')
        filename = file_data.get('filename', f"upload_{uuid.uuid4().hex}.jpg")
        
        # Decode base64
        if ',' in content:
            content = content.split(',')[1]
        file_bytes = base64.b64decode(content)
        
        # Determine content type
        content_type = mimetypes.guess_type(filename)[0] or 'image/jpeg'
        
        # Upload to R2
        key = f"uploads/{datetime.now().strftime('%Y/%m')}/{filename}"
        r2_client.put_object(
            Bucket=BUCKET_NAME,
            Key=key,
            Body=file_bytes,
            ContentType=content_type
        )
        
        url = f"{PUBLIC_URL}/{key}"
        return {"url": url, "key": key}
    except Exception as e:
        logger.error(f"Image upload error: {e}")
        raise HTTPException(status_code=500, detail=str(e))

# Customer Management
@api_router.get("/admin/customers")
async def get_customers(admin: dict = Depends(get_admin_user)):
    """Get all customers with order stats"""
    try:
        # Get all unique customers from orders
        pipeline = [
            {
                "$group": {
                    "_id": "$customer_email",
                    "name": {"$first": "$customer_name"},
                    "email": {"$first": "$customer_email"},
                    "phone": {"$first": "$customer_phone"},
                    "total_orders": {"$sum": 1},
                    "total_spent": {"$sum": "$total"},
                    "last_order": {"$max": "$created_at"}
                }
            },
            {"$sort": {"last_order": -1}}
        ]
        
        customers = []
        async for doc in db.orders.aggregate(pipeline):
            customers.append({
                "customer_id": doc["_id"],
                "name": doc.get("name", ""),
                "email": doc["_id"],
                "phone": doc.get("phone", ""),
                "total_orders": doc["total_orders"],
                "total_spent": doc["total_spent"],
                "last_order": doc["last_order"]
            })
        
        return customers
    except Exception as e:
        logger.error(f"Get customers error: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@api_router.post("/admin/customers")
async def create_customer(customer_data: dict, admin: dict = Depends(get_admin_user)):
    """Add a new customer manually"""
    try:
        customer = {
            "customer_id": str(uuid.uuid4()),
            "name": customer_data.get("name"),
            "email": customer_data.get("email"),
            "phone": customer_data.get("phone", ""),
            "address": customer_data.get("address", ""),
            "notes": customer_data.get("notes", ""),
            "created_at": datetime.now(timezone.utc).isoformat()
        }
        
        await db.customers.insert_one(customer)
        return {"message": "Customer created", "customer_id": customer["customer_id"]}
    except Exception as e:
        logger.error(f"Create customer error: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@api_router.get("/admin/customers/{email}/orders")
async def get_customer_orders(email: str, admin: dict = Depends(get_admin_user)):
    """Get order history for a specific customer"""
    try:
        orders = []
        async for order in db.orders.find({"customer_email": email}, {"_id": 0}).sort("created_at", -1):
            orders.append(order)
        return orders
    except Exception as e:
        logger.error(f"Get customer orders error: {e}")
        raise HTTPException(status_code=500, detail=str(e))

# Blog Management
@api_router.get("/blogs")
async def get_blogs(published_only: bool = True):
    """Get all blogs (public endpoint)"""
    try:
        query = {"published": True} if published_only else {}
        blogs = []
        async for blog in db.blogs.find(query, {"_id": 0}).sort("created_at", -1):
            blogs.append(blog)
        return blogs
    except Exception as e:
        logger.error(f"Get blogs error: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@api_router.get("/blogs/{blog_id}")
async def get_blog(blog_id: str):
    """Get single blog by ID (public endpoint)"""
    try:
        blog = await db.blogs.find_one({"blog_id": blog_id}, {"_id": 0})
        if not blog:
            raise HTTPException(status_code=404, detail="Blog not found")
        return blog
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Get blog error: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@api_router.post("/admin/blogs")
async def create_blog(blog_data: dict, admin: dict = Depends(get_admin_user)):
    """Create new blog post"""
    try:
        blog = {
            "blog_id": str(uuid.uuid4()),
            "title": blog_data.get("title"),
            "content": blog_data.get("content"),
            "excerpt": blog_data.get("excerpt", ""),
            "image_url": blog_data.get("image_url", ""),
            "author": blog_data.get("author", "FoeGuard"),
            "meta_title": blog_data.get("meta_title", blog_data.get("title")),
            "meta_description": blog_data.get("meta_description", blog_data.get("excerpt", "")),
            "meta_keywords": blog_data.get("meta_keywords", ""),
            "published": blog_data.get("published", True),
            "created_at": datetime.now(timezone.utc).isoformat(),
            "updated_at": datetime.now(timezone.utc).isoformat()
        }
        
        await db.blogs.insert_one(blog)
        return {"message": "Blog created", "blog_id": blog["blog_id"]}
    except Exception as e:
        logger.error(f"Create blog error: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@api_router.put("/admin/blogs/{blog_id}")
async def update_blog(blog_id: str, blog_data: dict, admin: dict = Depends(get_admin_user)):
    """Update existing blog post"""
    try:
        update_data = {
            **blog_data,
            "updated_at": datetime.now(timezone.utc).isoformat()
        }
        
        result = await db.blogs.update_one(
            {"blog_id": blog_id},
            {"$set": update_data}
        )
        
        if result.matched_count == 0:
            raise HTTPException(status_code=404, detail="Blog not found")
        
        return {"message": "Blog updated"}
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Update blog error: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@api_router.delete("/admin/blogs/{blog_id}")
async def delete_blog(blog_id: str, admin: dict = Depends(get_admin_user)):
    """Delete blog post"""
    try:
        result = await db.blogs.delete_one({"blog_id": blog_id})
        if result.deleted_count == 0:
            raise HTTPException(status_code=404, detail="Blog not found")
        return {"message": "Blog deleted"}
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Delete blog error: {e}")
        raise HTTPException(status_code=500, detail=str(e))

# SEO Management
@api_router.get("/seo")
async def get_all_seo():
    """Get SEO settings for all pages (public endpoint)"""
    try:
        seo_settings = []
        async for seo in db.seo_settings.find({}, {"_id": 0}):
            seo_settings.append(seo)
        return seo_settings
    except Exception as e:
        logger.error(f"Get SEO error: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@api_router.get("/seo/{page_name}")
async def get_page_seo(page_name: str):
    """Get SEO settings for specific page (public endpoint)"""
    try:
        seo = await db.seo_settings.find_one({"page_name": page_name}, {"_id": 0})
        if not seo:
            # Return defaults
            return {
                "page_name": page_name,
                "page_title": "FoeGuard - Premium Raw Pet Food",
                "meta_description": "High-quality raw pet food delivered to your door",
                "meta_keywords": "",
                "og_image": ""
            }
        return seo
    except Exception as e:
        logger.error(f"Get page SEO error: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@api_router.put("/admin/seo/{page_name}")
async def update_seo(page_name: str, seo_data: dict, admin: dict = Depends(get_admin_user)):
    """Update SEO settings for a page"""
    try:
        seo = {
            "page_name": page_name,
            "page_title": seo_data.get("page_title"),
            "meta_description": seo_data.get("meta_description"),
            "meta_keywords": seo_data.get("meta_keywords", ""),
            "og_image": seo_data.get("og_image", "")
        }
        
        await db.seo_settings.update_one(
            {"page_name": page_name},
            {"$set": seo},
            upsert=True
        )
        
        return {"message": "SEO settings updated"}
    except Exception as e:
        logger.error(f"Update SEO error: {e}")
        raise HTTPException(status_code=500, detail=str(e))

# Promo Code Management
@api_router.get("/admin/promos")
async def get_all_promos(admin: dict = Depends(get_admin_user)):
    """Get all promo codes"""
    try:
        promos = []
        async for promo in db.promo_codes.find({}, {"_id": 0}):
            promos.append(promo)
        return promos
    except Exception as e:
        logger.error(f"Get promos error: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@api_router.post("/admin/promos")
async def create_promo(promo_data: dict, admin: dict = Depends(get_admin_user)):
    """Create new promo code"""
    try:
        # Check if code already exists
        existing = await db.promo_codes.find_one({"code": promo_data.get("code")})
        if existing:
            raise HTTPException(status_code=400, detail="Promo code already exists")
        
        promo = {
            "code": promo_data.get("code").upper(),
            "discount_type": promo_data.get("discount_type", "percentage"),
            "discount_value": promo_data.get("discount_value"),
            "min_order_value": promo_data.get("min_order_value"),
            "max_uses": promo_data.get("max_uses"),
            "current_uses": 0,
            "start_date": promo_data.get("start_date"),
            "end_date": promo_data.get("end_date"),
            "is_active": promo_data.get("is_active", True),
            "description": promo_data.get("description", "")
        }
        
        await db.promo_codes.insert_one(promo)
        return {"message": "Promo code created", "code": promo["code"]}
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Create promo error: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@api_router.put("/admin/promos/{code}")
async def update_promo(code: str, promo_data: dict, admin: dict = Depends(get_admin_user)):
    """Update promo code"""
    try:
        result = await db.promo_codes.update_one(
            {"code": code},
            {"$set": promo_data}
        )
        
        if result.matched_count == 0:
            raise HTTPException(status_code=404, detail="Promo code not found")
        
        return {"message": "Promo code updated"}
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Update promo error: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@api_router.delete("/admin/promos/{code}")
async def delete_promo(code: str, admin: dict = Depends(get_admin_user)):
    """Delete promo code"""
    try:
        result = await db.promo_codes.delete_one({"code": code})
        if result.deleted_count == 0:
            raise HTTPException(status_code=404, detail="Promo code not found")
        return {"message": "Promo code deleted"}
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Delete promo error: {e}")
        raise HTTPException(status_code=500, detail=str(e))

# ============================================================================
# END ADMIN ENDPOINTS
# ============================================================================

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
