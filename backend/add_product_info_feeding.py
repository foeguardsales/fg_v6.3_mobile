import os
from pymongo import MongoClient

MONGO_URL = os.environ.get('MONGO_URL', 'mongodb://localhost:27017/')
client = MongoClient(MONGO_URL)
db = client['test_database']
products_collection = db['products']

PRODUCT_FEEDING_GUIDE = {
    "feeding": "Feed as a complete meal or mix with your dog's current food to transition. Always supervise your pet during feeding. Start with smaller portions for first-time raw feeders and gradually increase over 7-10 days.",
    "handling": "Keep frozen until ready to use. Thaw in refrigerator for 12-24 hours before serving. Once thawed, use within 3-4 days. Always handle with clean hands and clean surfaces. Store at 0°F (-18°C) or below."
}

CAT_PRODUCT_FEEDING_GUIDE = {
    "feeding": "Feed as a complete meal for your cat. Always supervise your cat during feeding. Introduce gradually for cats new to raw feeding over 5-7 days, mixing with current food.",
    "handling": "Keep frozen until ready to use. Thaw in refrigerator for 8-12 hours before serving. Once thawed, use within 2-3 days. Always handle with clean hands and clean surfaces. Store at 0°F (-18°C) or below."
}

PRODUCT_INFORMATION = """Our raw pet food is sourced from trusted family farms across Ontario and processed in USDA-inspected facilities. Each recipe is carefully formulated to provide complete and balanced nutrition following AAFCO guidelines.

What makes our food special:
• Flash-frozen to lock in freshness and nutrients
• No artificial preservatives, colors, or flavors
• Human-grade ingredients
• Made in small batches for quality control
• Third-party tested for safety

Perfect for:
• Dogs and cats of all life stages
• Pets with food sensitivities
• Supporting optimal health and vitality
• Improving coat, skin, and digestion
• Boosting energy and immune function

Always consult your veterinarian before changing your pet's diet, especially for puppies, kittens, pregnant/nursing animals, or pets with health conditions."""

def update_all_products():
    """Add feeding_guide and product_information to all products"""
    
    print("Starting products update...")
    
    # Get all products
    all_products = list(products_collection.find({}))
    print(f"Found {len(all_products)} products to update")
    
    updated_count = 0
    for product in all_products:
        product_id = product['product_id']
        
        # Determine if it's a cat product
        is_cat = 'cat' in product.get('product_line', '').lower() or 'cat' in product.get('name', '').lower()
        
        # Choose appropriate feeding guide
        feeding_guide = CAT_PRODUCT_FEEDING_GUIDE if is_cat else PRODUCT_FEEDING_GUIDE
        
        # Update the product
        result = products_collection.update_one(
            {"product_id": product_id},
            {"$set": {
                "feeding_guide": feeding_guide,
                "product_information": PRODUCT_INFORMATION
            }}
        )
        
        if result.modified_count > 0:
            updated_count += 1
            print(f"✓ Updated {product_id}: {product['name']}")
    
    print(f"\n✅ Successfully updated {updated_count} products!")
    print("All products now have: feeding_guide and product_information")

if __name__ == "__main__":
    update_all_products()
