import os
from pymongo import MongoClient

MONGO_URL = os.environ.get('MONGO_URL', 'mongodb://localhost:27017/')
client = MongoClient(MONGO_URL)
db = client['test_database']
products_collection = db['products']

# Original product descriptions and ingredients
NEW_PRODUCT_DATA = {
    "cd-chicken": {
        "description": "Our chicken recipe combines farm-raised poultry with wholesome vegetables for a nutritionally complete meal. Carefully balanced to provide optimal protein, healthy fats, and essential nutrients your dog needs for daily vitality.",
        "ingredients": ["Chicken (ground with bone)", "Chicken organs (liver, heart)", "Leafy greens (kale, spinach)", "Root vegetables (carrots)", "Berries", "Sea kelp", "Omega-3 fish oil"]
    },
    "cd-beef": {
        "description": "Hearty grass-fed beef provides rich protein and essential minerals. This recipe features locally-sourced beef combined with nutritious vegetables, creating a wholesome meal that supports strong muscles and sustained energy throughout the day.",
        "ingredients": ["Grass-fed beef (ground)", "Beef organs (liver, kidney, heart)", "Green vegetables (broccoli)", "Orange vegetables (sweet potato)", "Pumpkin", "Sea kelp", "Omega-3 fish oil"]
    },
    "cd-duck": {
        "description": "Duck offers a unique protein source ideal for pets with common food sensitivities. Rich in minerals and featuring a distinctive flavor profile, this recipe provides complete nutrition while supporting immune system health.",
        "ingredients": ["Duck (ground with bone)", "Duck organs (liver, heart)", "Green vegetables (chard, celery)", "Cranberries", "Sea kelp", "Omega-3 fish oil"]
    },
    "cd-fish": {
        "description": "Wild-caught fish delivers abundant omega-3 fatty acids essential for healthy skin and a lustrous coat. This ocean-inspired recipe supports cognitive function while providing easily digestible protein for optimal health.",
        "ingredients": ["Wild fish (ground with bone)", "Fish organs", "Marine vegetables (kelp)", "Green vegetables (spinach)", "Blueberries", "Omega-3 fish oil"]
    },
    "cd-goat": {
        "description": "Lean goat meat offers exceptional digestibility and serves as an excellent alternative protein. Lower in fat than traditional proteins, this recipe is perfect for weight management while delivering complete, balanced nutrition.",
        "ingredients": ["Goat (ground with bone)", "Goat organs (liver, heart)", "Mixed vegetables (kale, carrots)", "Berries", "Sea kelp", "Omega-3 fish oil"]
    },
    "cd-lamb": {
        "description": "Premium lamb provides rich flavor and dense nutrition packed with zinc and B-vitamins. Sourced from pasture-raised animals, this recipe supports metabolic health and immune function for active dogs.",
        "ingredients": ["Lamb (ground with bone)", "Lamb organs (liver, heart, kidney)", "Green vegetables (spinach, kale)", "Root vegetables", "Sea kelp", "Omega-3 fish oil"]
    },
    "cd-rabbit": {
        "description": "Rabbit offers ultra-lean protein ideal for sensitive digestion. This novel protein source provides complete nutrition while being gentle on the stomach, making it perfect for dogs with dietary restrictions.",
        "ingredients": ["Rabbit (ground with bone)", "Rabbit organs (liver, heart)", "Leafy greens", "Root vegetables", "Berries", "Sea kelp", "Omega-3 fish oil"]
    },
    "cd-turkey": {
        "description": "Turkey delivers lean protein with a mild flavor that dogs love. This recipe combines farm-raised turkey with nutritious vegetables, providing balanced nutrition that supports overall health and vitality.",
        "ingredients": ["Turkey (ground with bone)", "Turkey organs (liver, heart)", "Mixed vegetables (carrots, kale)", "Berries", "Sea kelp", "Omega-3 fish oil"]
    },
    "pf-chicken": {
        "description": "Our Primal Feast chicken recipe adheres to ancestral feeding principles with 80% meat, 10% bone, and 10% organ content. This biologically appropriate formula mimics natural prey, delivering complete nutrition through whole food ingredients.",
        "ingredients": ["Chicken meat and bone (80%)", "Chicken organs (10% - liver, heart, kidney)", "Whole egg", "Minimal vegetables", "Sea kelp"]
    },
    "pf-beef": {
        "description": "Primal Feast beef follows the 80/10/10 ratio for optimal canine nutrition. Featuring grass-fed beef with appropriate bone and organ content, this recipe provides the complete nutrition dogs evolved to eat.",
        "ingredients": ["Grass-fed beef and bone (80%)", "Beef organs (10% - liver, kidney, heart)", "Whole egg", "Minimal vegetables", "Sea kelp"]
    },
    "pf-duck": {
        "description": "Duck-based Primal Feast offers ancestral nutrition with proper meat-to-bone-to-organ ratios. This biologically appropriate recipe delivers complete nutrition through whole prey modeling for optimal canine health.",
        "ingredients": ["Duck meat and bone (80%)", "Duck organs (10% - liver, heart)", "Whole egg", "Minimal vegetables", "Sea kelp"]
    },
    "pf-fish": {
        "description": "Ocean-sourced Primal Feast provides omega-rich nutrition following ancestral feeding principles. The 80/10/10 ratio ensures your dog receives complete nutrition as nature intended.",
        "ingredients": ["Wild fish and bone (80%)", "Fish organs (10%)", "Whole egg", "Sea kelp", "Minimal vegetables"]
    },
    "pf-goat": {
        "description": "Lean goat in Primal Feast formula offers ancestral nutrition with appropriate meat, bone, and organ ratios. This biologically appropriate recipe supports natural feeding principles.",
        "ingredients": ["Goat meat and bone (80%)", "Goat organs (10% - liver, heart)", "Whole egg", "Minimal vegetables", "Sea kelp"]
    },
    "pf-lamb": {
        "description": "Lamb-based Primal Feast delivers rich nutrition through proper ancestral ratios. Following the 80/10/10 principle, this recipe provides complete nutrition your dog's body recognizes.",
        "ingredients": ["Lamb meat and bone (80%)", "Lamb organs (10% - liver, kidney, heart)", "Whole egg", "Minimal vegetables", "Sea kelp"]
    },
    "pf-rabbit": {
        "description": "Rabbit Primal Feast offers novel protein with ancestral ratios for complete nutrition. This biologically appropriate formula follows whole prey principles for optimal health.",
        "ingredients": ["Rabbit meat and bone (80%)", "Rabbit organs (10% - liver, heart)", "Whole egg", "Minimal vegetables", "Sea kelp"]
    },
    "pf-turkey": {
        "description": "Turkey Primal Feast combines lean poultry with proper bone and organ content. Following the 80/10/10 ratio, this recipe delivers complete ancestral nutrition.",
        "ingredients": ["Turkey meat and bone (80%)", "Turkey organs (10% - liver, heart)", "Whole egg", "Minimal vegetables", "Sea kelp"]
    },
    "rp-chicken": {
        "description": "Royal Paws chicken is specially formulated for feline nutrition with appropriate taurine levels. This complete cat food provides all essential nutrients cats require for optimal health.",
        "ingredients": ["Chicken meat and bone", "Chicken organs (liver, heart)", "Taurine supplement", "Vitamin E", "Minimal vegetables"]
    },
    "rp-beef": {
        "description": "Royal Paws beef offers rich protein tailored for feline dietary needs. Enhanced with taurine and essential nutrients, this recipe supports your cat's carnivorous nature.",
        "ingredients": ["Beef meat and bone", "Beef organs (liver, kidney, heart)", "Taurine supplement", "Vitamin E", "Minimal vegetables"]
    },
    "rp-duck": {
        "description": "Royal Paws duck provides novel protein with complete feline nutrition. Ideal for cats with sensitivities, this recipe delivers all essential nutrients including taurine.",
        "ingredients": ["Duck meat and bone", "Duck organs (liver, heart)", "Taurine supplement", "Vitamin E", "Minimal vegetables"]
    },
    "rp-turkey": {
        "description": "Royal Paws turkey offers lean protein perfect for feline health. This complete cat food includes all necessary nutrients for maintaining optimal vitality.",
        "ingredients": ["Turkey meat and bone", "Turkey organs (liver, heart)", "Taurine supplement", "Vitamin E", "Minimal vegetables"]
    },
    "rp-fish": {
        "description": "Royal Paws fish delivers omega-rich nutrition specifically for cats. Complete with taurine and marine nutrients, this recipe supports healthy skin, coat, and overall wellbeing.",
        "ingredients": ["Wild fish and bone", "Fish organs", "Taurine supplement", "Vitamin E", "Sea kelp"]
    },
    "rp-goat": {
        "description": "Royal Paws goat offers alternative protein for sensitive cats. Enhanced with taurine and essential nutrients, this recipe provides complete feline nutrition.",
        "ingredients": ["Goat meat and bone", "Goat organs (liver, heart)", "Taurine supplement", "Vitamin E", "Minimal vegetables"]
    },
    "rp-lamb": {
        "description": "Royal Paws lamb provides rich nutrition for feline health. Complete with taurine and essential nutrients, this recipe supports your cat's natural dietary needs.",
        "ingredients": ["Lamb meat and bone", "Lamb organs (liver, heart, kidney)", "Taurine supplement", "Vitamin E", "Minimal vegetables"]
    },
    "rp-rabbit": {
        "description": "Royal Paws rabbit offers novel protein ideal for sensitive cats. This complete cat food includes all necessary nutrients including taurine for optimal feline health.",
        "ingredients": ["Rabbit meat and bone", "Rabbit organs (liver, heart)", "Taurine supplement", "Vitamin E", "Minimal vegetables"]
    }
}

def update_all_products():
    """Update all products with new descriptions and ingredients"""
    
    print("Updating product descriptions and ingredients...")
    
    updated_count = 0
    for product_id, data in NEW_PRODUCT_DATA.items():
        result = products_collection.update_one(
            {"product_id": product_id},
            {"$set": {
                "description": data["description"],
                "ingredients": data["ingredients"]
            }}
        )
        
        if result.modified_count > 0:
            updated_count += 1
            print(f"✓ Updated {product_id}")
    
    print(f"\n✅ Successfully updated {updated_count} products!")

if __name__ == "__main__":
    update_all_products()
