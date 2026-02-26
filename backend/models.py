from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Union
from datetime import datetime

class PromoCode(BaseModel):
    code: str
    discount_type: str = "percentage"  # or "fixed"
    discount_value: float
    min_order_value: Optional[float] = None
    max_uses: Optional[int] = None
    current_uses: int = 0
    start_date: Optional[datetime] = None
    end_date: Optional[datetime] = None
    is_active: bool = True
    description: Optional[str] = None

class Customer(BaseModel):
    customer_id: str
    name: str
    email: str
    phone: Optional[str] = None
    address: Optional[str] = None
    total_orders: int = 0
    total_spent: float = 0.0
    created_at: str
    notes: Optional[str] = None

class Blog(BaseModel):
    blog_id: str
    title: str
    content: str
    excerpt: Optional[str] = None
    image_url: Optional[str] = None
    author: str = "FoeGuard"
    meta_title: Optional[str] = None
    meta_description: Optional[str] = None
    meta_keywords: Optional[str] = None
    published: bool = True
    created_at: str
    updated_at: Optional[str] = None

class SEOSettings(BaseModel):
    page_name: str
    page_title: str
    meta_description: str
    meta_keywords: Optional[str] = None
    og_image: Optional[str] = None

class PricingTier(BaseModel):
    size_lb: int
    price: float
    price_per_lb: float
    savings_percent: float

class Product(BaseModel):
    product_id: str
    product_line: str
    protein_type: str
    name: str
    description: str
    mini_description: Optional[str] = None
    highlights: Optional[List[str]] = None
    ingredients: Union[List[str], str]
    recipe_breakdown: Optional[str] = None
    nutrition_facts: Dict[str, str]
    nutrition_notes: Optional[str] = None
    how_to_use: Optional[str] = None
    product_information: Optional[str] = None
    feeding_guide: Optional[Dict[str, str]] = None
    pricing: List[PricingTier]
    inventory_status: str = "available"
    image_url: Optional[str] = None

class Treat(BaseModel):
    treat_id: str
    name: str
    price: float
    quantity_description: str
    description: Optional[str] = None
    product_information: Optional[str] = None
    feeding_guide: Optional[Dict[str, str]] = None
    image_url: Optional[str] = None
    pet_type: Optional[str] = "dog"  # 'dog' or 'cat'

class BoxItem(BaseModel):
    product_id: str
    product_name: str
    protein_type: str
    quantity_lb: int
    price: float

class TreatItem(BaseModel):
    treat_id: str
    name: str
    quantity: int
    price: float

class Order(BaseModel):
    order_id: str
    customer_email: str
    customer_name: str
    box_size_lb: int
    proteins: List[BoxItem]
    treats: List[TreatItem]
    subtotal: float
    tax: float
    total: float
    stripe_payment_id: Optional[str] = None
    status: str = "pending"
    created_at: str

class CheckoutRequest(BaseModel):
    customer_email: str
    customer_name: str
    box_size_lb: int
    proteins: List[BoxItem]
    treats: List[TreatItem]
    subtotal: float
    tax: float
    total: float
    is_subscription: bool = False