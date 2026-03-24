import os
from pymongo import MongoClient

MONGO_URL = os.environ.get('MONGO_URL', 'mongodb://localhost:27017/')
client = MongoClient(MONGO_URL)
db = client['foeguard']
treats_collection = db['treats']

# Standard feeding guide for all treats
STANDARD_FEEDING_GUIDE = {
    "feeding": "Feed as a treat, meal topper, or for enrichment. Always supervise your pet while enjoying treats. Suitable for dogs of all sizes. Start with smaller portions for first-time feeders.",
    "handling": "Keep frozen until ready to use. Thaw in refrigerator before serving (4-6 hours). Once thawed, use within 3-4 days. Always handle with clean hands and clean surfaces."
}

CAT_FEEDING_GUIDE = {
    "feeding": "Feed as a treat or for enrichment. Always supervise your cat while enjoying treats. Perfect for satisfying natural hunting instincts. Introduce gradually for first-time feeders.",
    "handling": "Keep frozen until ready to use. Thaw in refrigerator before serving (2-4 hours). Once thawed, use within 2-3 days. Always handle with clean hands and clean surfaces."
}

STANDARD_PRODUCT_INFO = """Our treats are sourced from trusted family farms and processed in USDA-inspected facilities. Each treat is individually flash-frozen to lock in freshness and nutrients. No artificial preservatives, colors, or flavors added. 

Perfect for:
• Training and rewards
• Dental health and natural chewing
• Mental stimulation and enrichment  
• Supporting jaw strength and clean teeth

Always supervise your pet when feeding treats. Not suitable for puppies under 12 weeks old."""

CAT_PRODUCT_INFO = """Our cat treats are sourced from trusted family farms and processed in USDA-inspected facilities. Each treat is individually frozen to lock in freshness. No artificial preservatives, colors, or flavors added.

Perfect for:
• Satisfying natural hunting instincts
• Dental health and jaw exercise
• Mental stimulation and enrichment
• High-protein supplemental feeding

Always supervise your cat when feeding treats. Not suitable for kittens under 12 weeks old."""

# Detailed treat information by treat_id
TREAT_DETAILS = {
    # Dog treats
    "treat-turkey-feet": {
        "description": "Whole raw turkey feet naturally rich in glucosamine and chondroitin to support joint health. These natural treats provide hours of chewing satisfaction while promoting dental health through mechanical cleaning action. Perfect for dogs who love to chew and crunch.",
        "ingredients": "100% turkey feet. No additives, preservatives, or artificial ingredients.",
        "benefits": [
            "Natural source of glucosamine for joint support",
            "Promotes dental health through natural chewing",
            "High in protein and low in fat",
            "Satisfies natural chewing instinct",
            "Helps reduce plaque and tartar buildup"
        ]
    },
    "treat-duck-heads": {
        "description": "Whole duck heads offer a complete, nutrient-dense chewing experience. Rich in natural fats, protein, and essential nutrients including brain matter which provides omega-3 fatty acids. The crunchy texture helps clean teeth naturally while providing mental enrichment.",
        "ingredients": "100% whole duck heads. No additives, preservatives, or artificial ingredients.",
        "benefits": [
            "Complete whole prey nutrition",
            "Rich in omega-3 fatty acids from brain matter",
            "Excellent for dental health",
            "High-value enrichment activity",
            "Natural source of glucosamine and chondroitin"
        ]
    },
    "treat-lamb-head-1": {
        "description": "Premium whole lamb head provides the ultimate whole prey feeding experience. Packed with nutrient-dense organs, brain matter, and bone content. This treat offers complete nutrition, mental stimulation, and hours of satisfying chewing. Ideal for medium to large dogs.",
        "ingredients": "100% whole lamb head. No additives, preservatives, or artificial ingredients.",
        "benefits": [
            "Ultimate whole prey nutrition",
            "Rich in omega-3 and essential nutrients",
            "Excellent for dental health and jaw strength",
            "Long-lasting enrichment activity",
            "High protein content with natural fats"
        ]
    },
    "treat-lamb-head-2": {
        "description": "Premium whole lamb heads (2-pack) provide the ultimate whole prey feeding experience. Packed with nutrient-dense organs, brain matter, and bone content. These treats offer complete nutrition, mental stimulation, and hours of satisfying chewing. Ideal for medium to large dogs or multi-dog households.",
        "ingredients": "100% whole lamb heads. No additives, preservatives, or artificial ingredients.",
        "benefits": [
            "Ultimate whole prey nutrition",
            "Rich in omega-3 and essential nutrients",
            "Excellent for dental health and jaw strength",
            "Long-lasting enrichment activity",
            "High protein content with natural fats"
        ]
    },
    "treat-beef-rib": {
        "description": "Meaty beef flat rib bones perfect for recreational chewing. These bones feature tender meat still attached to the rib, providing both nutrition and dental benefits. The flat shape makes them easier to hold and chew. Excellent for aggressive chewers who need a durable, long-lasting option.",
        "ingredients": "100% beef rib bones. No additives, preservatives, or artificial ingredients.",
        "benefits": [
            "Long-lasting recreational bone",
            "Natural dental cleaning action",
            "Rich in protein and natural marrow",
            "Satisfies strong chewing instinct",
            "Promotes healthy teeth and gums"
        ]
    },
    "treat-chicken-carcass": {
        "description": "Whole chicken carcass provides complete whole prey nutrition with bones, cartilage, and remaining meat. Perfect for larger dogs or as a complete meal replacement. Offers hours of enrichment while delivering balanced nutrition from multiple parts of the animal.",
        "ingredients": "100% whole chicken carcass. No additives, preservatives, or artificial ingredients.",
        "benefits": [
            "Complete balanced nutrition",
            "Whole prey feeding experience",
            "Natural source of calcium from bones",
            "Extended mental stimulation",
            "Can serve as complete meal for medium dogs"
        ]
    },
    "treat-chicken-necks-2lb": {
        "description": "Whole chicken necks are a customer favorite! These meaty, bone-in treats are perfect for dogs of all sizes. High in glucosamine and chondroitin for joint support, with the perfect ratio of meat to bone. Easily digestible and great for daily feeding or as a crunchy treat.",
        "ingredients": "100% chicken necks. No additives, preservatives, or artificial ingredients.",
        "benefits": [
            "Natural source of glucosamine for joints",
            "Perfect meat-to-bone ratio",
            "Suitable for dogs of all sizes",
            "Easily digestible",
            "Promotes dental health naturally"
        ]
    },
    "treat-chicken-necks-5lb": {
        "description": "Bulk pack of whole chicken necks perfect for multi-dog households or frequent feeders. These meaty, bone-in treats are high in glucosamine and chondroitin for joint support. The perfect ratio of meat to bone makes them easily digestible and great for daily feeding or as a crunchy treat.",
        "ingredients": "100% chicken necks. No additives, preservatives, or artificial ingredients.",
        "benefits": [
            "Natural source of glucosamine for joints",
            "Perfect meat-to-bone ratio",
            "Suitable for dogs of all sizes",
            "Easily digestible",
            "Promotes dental health naturally"
        ]
    },
    "treat-duck-feet": {
        "description": "Crunchy duck feet are packed with glucosamine and chondroitin to support joint health. These treats provide satisfying crunch and are naturally rich in collagen for skin and coat health. The perfect size for dogs of all breeds, from small to large.",
        "ingredients": "100% duck feet. No additives, preservatives, or artificial ingredients.",
        "benefits": [
            "High in glucosamine and chondroitin",
            "Rich in natural collagen",
            "Supports joint, skin, and coat health",
            "Satisfying crunchy texture",
            "Suitable for all dog sizes"
        ]
    },
    "treat-beef-neck": {
        "description": "Meaty beef neck bones are perfect for powerful chewers. These dense bones feature substantial meat coverage and marrow content. Excellent for dental health, jaw strengthening, and providing hours of satisfying chewing activity. Best suited for medium to large dogs.",
        "ingredients": "100% beef neck bones. No additives, preservatives, or artificial ingredients.",
        "benefits": [
            "Long-lasting recreational bone",
            "Rich in natural marrow and nutrients",
            "Excellent for dental health",
            "Strengthens jaw muscles",
            "Perfect for aggressive chewers"
        ]
    },
    "treat-chicken-heads": {
        "description": "Whole chicken heads are a nutrient powerhouse! Rich in brain matter providing omega-3 fatty acids, plus eyes, combs, and bone content for complete nutrition. These treats offer mental enrichment and dental benefits while delivering highly bioavailable nutrients. Perfect for all dog sizes.",
        "ingredients": "100% whole chicken heads. No additives, preservatives, or artificial ingredients.",
        "benefits": [
            "Rich in omega-3 from brain matter",
            "Complete whole prey nutrition",
            "Excellent for dental health",
            "High-value mental enrichment",
            "Suitable for dogs of all sizes"
        ]
    },
    "treat-beef-marrow": {
        "description": "Premium beef marrow bones are the gold standard of recreational chewing. These bones are filled with nutrient-rich marrow that dogs absolutely love. The dense bone structure provides long-lasting chewing satisfaction while promoting dental health. Perfect for medium to large dogs who love to chew.",
        "ingredients": "100% beef marrow bones. No additives, preservatives, or artificial ingredients.",
        "benefits": [
            "Rich in nutrient-dense marrow",
            "Long-lasting recreational bone",
            "Excellent for dental health",
            "Provides healthy fats and nutrients",
            "Satisfies strong chewing instinct"
        ]
    },
    
    # Cat treats
    "treat-cat-chicken-heads": {
        "description": "Whole chicken heads perfectly sized for cats. Rich in brain matter providing omega-3 fatty acids and taurine. These treats satisfy your cat's natural hunting instinct while providing complete prey nutrition. The crunchy texture helps clean teeth naturally.",
        "ingredients": "100% whole chicken heads. No additives, preservatives, or artificial ingredients.",
        "benefits": [
            "Rich in omega-3 and taurine",
            "Satisfies natural hunting instinct",
            "Complete whole prey nutrition",
            "Natural dental cleaning",
            "High-protein supplemental feeding"
        ]
    },
    "treat-cat-chicken-necks": {
        "description": "Chicken necks sized perfectly for cats. These meaty, bone-in treats are rich in glucosamine for joint support and calcium for bone health. The ideal ratio of meat to bone makes them easily digestible. Perfect for cats who enjoy crunchy, natural treats.",
        "ingredients": "100% chicken necks. No additives, preservatives, or artificial ingredients.",
        "benefits": [
            "Natural source of glucosamine",
            "Perfect meat-to-bone ratio for cats",
            "Rich in calcium and phosphorus",
            "Satisfies natural chewing instinct",
            "Promotes dental health"
        ]
    },
    "treat-cat-chicken-feet": {
        "description": "Crunchy chicken feet provide natural glucosamine and chondroitin for joint support. These cat-sized treats offer satisfying texture and are rich in collagen for skin and coat health. Perfect for cats who love to crunch and chew.",
        "ingredients": "100% chicken feet. No additives, preservatives, or artificial ingredients.",
        "benefits": [
            "High in glucosamine and chondroitin",
            "Rich in natural collagen",
            "Supports joint and coat health",
            "Satisfying crunchy texture",
            "Natural dental benefits"
        ]
    },
    "treat-cat-duck-heads": {
        "description": "Whole duck heads sized for cats. Nutrient-dense with brain matter rich in omega-3 fatty acids and taurine. These treats provide mental enrichment and satisfy hunting instincts while delivering complete prey nutrition.",
        "ingredients": "100% whole duck heads. No additives, preservatives, or artificial ingredients.",
        "benefits": [
            "Rich in omega-3 and taurine",
            "Complete whole prey nutrition",
            "Mental enrichment activity",
            "Natural dental cleaning",
            "Satisfies hunting instinct"
        ]
    },
    "treat-cat-duck-feet": {
        "description": "Duck feet perfectly sized for cats. Packed with glucosamine, chondroitin, and natural collagen. These crunchy treats support joint health while providing natural dental benefits. Cats love the satisfying texture and natural flavor.",
        "ingredients": "100% duck feet. No additives, preservatives, or artificial ingredients.",
        "benefits": [
            "High in glucosamine and chondroitin",
            "Rich in natural collagen",
            "Supports joint, skin, and coat health",
            "Natural dental cleaning",
            "Satisfying crunchy texture"
        ]
    }
}

def update_all_treats():
    """Update all treats with detailed information"""
    
    print("Starting treats update...")
    
    # Get all treats
    all_treats = list(treats_collection.find({}))
    print(f"Found {len(all_treats)} treats to update")
    
    updated_count = 0
    for treat in all_treats:
        treat_id = treat['treat_id']
        pet_type = treat.get('pet_type', 'dog')
        
        # Get specific details if available, otherwise use generic
        details = TREAT_DETAILS.get(treat_id, {})
        
        # Use specific description or create a generic one
        description = details.get('description', f"{treat['name']} - A premium raw treat for your pet. {treat.get('quantity_description', '')}.")
        
        # Use specific ingredients or create generic
        ingredients = details.get('ingredients', f"100% {treat['name'].lower()}. No additives, preservatives, or artificial ingredients.")
        
        # Use specific benefits or None
        benefits = details.get('benefits', None)
        
        # Choose feeding guide based on pet type
        feeding_guide = CAT_FEEDING_GUIDE if pet_type == 'cat' else STANDARD_FEEDING_GUIDE
        
        # Choose product info based on pet type
        product_information = CAT_PRODUCT_INFO if pet_type == 'cat' else STANDARD_PRODUCT_INFO
        
        # Update the treat
        update_data = {
            "description": description,
            "ingredients": ingredients,
            "feeding_guide": feeding_guide,
            "product_information": product_information
        }
        
        if benefits:
            update_data["benefits"] = benefits
        
        result = treats_collection.update_one(
            {"treat_id": treat_id},
            {"$set": update_data}
        )
        
        if result.modified_count > 0:
            updated_count += 1
            print(f"✓ Updated {treat_id}: {treat['name']}")
    
    print(f"\n✅ Successfully updated {updated_count} treats!")
    print("All treats now have: description, ingredients, feeding_guide, product_information, and benefits (where applicable)")

if __name__ == "__main__":
    update_all_treats()
