import pymongo
import os
from dotenv import load_dotenv

load_dotenv()

client = pymongo.MongoClient(os.getenv('MONGO_URL'))
db = client[os.getenv('DB_NAME')]

# Standard sections
PRODUCT_INFO = """This product is processed and packaged in a government-regulated facility to ensure human-grade quality standards. It's freshly made, then flash-frozen to preserve all nutrients. Best consumed by pets within 12 months from the purchase date.

Since our products are 100% natural, slight variations from the pictured product may occur."""

FEEDING_GUIDE = """**Handling Instructions:** After handling raw meat and poultry, wash your hands, utensils, and surfaces with hot, soapy water to prevent cross-contamination. Keep raw foods separate from other items.

**Feeding Instructions:** Thaw in the fridge or in cold water. Once defrosted, keep refrigerated and use within 3-4 days. Some change in meat colour due to oxidation is normal and safe. Do not thaw in the microwave. Not for human consumption.

See our [feeding calculator](/calculator) to see how much to feed your pet."""

# ==================== PRIMAL FEAST PRODUCTS ====================
primal_feast = {
    "Primal Feast Chicken": {
        "description": "Primal Feast Chicken offers lean, highly digestible protein in a classic 80/10/10 ratio — ideal as a foundational base for raw feeders who prefer to customize their pet's meals or rotate proteins. Made with single-source chicken, it's a simple and versatile option many pets love.\n\nPrimal Feast meals are designed as a base ingredient and are not complete & balanced for everyday feeding. Pet parents may add their own toppers or supplements to meet individual needs.",
        "highlights": ["Ethically raised, free-range Canadian chicken (drug-free, omega-3 fed)", "All-natural ingredients (non-GMO, no additives, preservatives, or fillers)", "Certified human-grade (no by-products, trims, or old meat)", "Prepared fresh and flash-frozen for safe delivery"],
        "ingredients": "80% Free-range chicken muscle meat, 10% chicken bone, 10% chicken organ.",
        "recipe_breakdown": "80% muscle meat, 10% bone, 10% organ",
        "nutrition": {"protein_min": "18%", "fat_min": "16%", "moisture_max": "65%", "fiber_max": "0.1%", "calcium_min": "1.1%", "phosphorus_min": "0.8%", "ash": "3.7%"},
        "short_description": "Lean chicken protein for easy digestion and versatile feeding."
    },
    "Primal Feast Beef": {
        "description": "Primal Feast Beef delivers rich, calorie-dense nutrition in a classic 80/10/10 ratio — often chosen by active dogs or those who thrive on heartier, energizing proteins.\n\nDesigned as a foundational base for raw feeders who prefer to customize, rotate proteins, or add their own toppers. Not a complete & balanced diet for everyday feeding.",
        "highlights": ["Ethically raised, pasture-raised Canadian beef (drug-free, grass-fed)", "All-natural ingredients (non-GMO, no additives, preservatives, or fillers)", "Certified human-grade (no by-products, trims, or old meat)", "Prepared fresh and flash-frozen for safe delivery"],
        "ingredients": "80% Pasture-raised beef muscle meat, 10% beef bone, 10% beef organ.",
        "recipe_breakdown": "80% muscle meat, 10% bone, 10% organ",
        "nutrition": {"protein_min": "19.8%", "fat_min": "9.36%", "moisture_max": "68%", "fiber_max": "0.1%", "calcium_min": "0.12%", "phosphorus_min": "0.19%", "ash": "1%"},
        "short_description": "Rich beef protein to fuel active dogs and rotational meals."
    },
    "Primal Feast Duck": {
        "description": "Primal Feast Duck offers a nourishing protein in a classic 80/10/10 ratio — a popular choice for pets needing extra energy, skin and coat support, or as a novel alternative to common meats.\n\nCrafted as a rotational base for raw feeders looking to personalize meals. Not complete & balanced for everyday feeding.",
        "highlights": ["Ethically raised, free-range Canadian duck (drug-free, omega-3 fed)", "All-natural ingredients (non-GMO, no additives, preservatives, or fillers)", "Certified human-grade (no by-products, trims, or old meat)", "Prepared fresh and flash-frozen for safe delivery"],
        "ingredients": "80% Free-range duck muscle meat, 10% duck bone, 10% duck organ.",
        "recipe_breakdown": "80% muscle meat, 10% bone, 10% organ",
        "nutrition": {"protein_min": "12.01%", "fat_min": "11.6%", "moisture_max": "71.82%", "fiber_max": "0.87%", "calcium_min": "1.2%", "phosphorus_min": "0.6%", "ash": "1.9%"},
        "short_description": "Flavorful duck protein supporting skin and coat health."
    },
    "Primal Feast Turkey": {
        "description": "Primal Feast Turkey provides lean, easily digestible protein in a classic 80/10/10 ratio — ideal for dogs who do well on lighter proteins or as part of a varied raw rotation.\n\nUsed as a foundational base for customized feeding. Not complete & balanced for everyday feeding.",
        "highlights": ["Ethically raised, free-range Canadian turkey (drug-free, omega-3 fed)", "All-natural ingredients (non-GMO, no additives, preservatives, or fillers)", "Certified human-grade (no by-products, trims, or old meat)", "Prepared fresh and flash-frozen for safe delivery"],
        "ingredients": "80% Free-range turkey muscle meat, 10% turkey bone, 10% turkey organ.",
        "recipe_breakdown": "80% muscle meat, 10% bone, 10% organ",
        "nutrition": {"protein_min": "12%", "fat_min": "11.6%", "moisture_max": "71.82%", "fiber_max": "0.87%", "calcium_min": "1.2%", "phosphorus_min": "0.86%", "ash": "1.9%"},
        "short_description": "Gentle turkey protein for sensitive dogs or rotation."
    },
    "Primal Feast Fish": {
        "description": "Primal Feast Salmon delivers omega-rich nutrition in an 80/10/10 ratio — supporting skin, coat, and overall vitality.\n\nDesigned as a foundational base for raw feeders who prefer to control balance through rotation or added ingredients. Not a complete & balanced diet for everyday feeding.",
        "highlights": ["Ethically raised, wild-caught Canadian salmon (drug-free)", "All-natural ingredients (non-GMO, no additives, preservatives, or fillers)", "Certified human-grade (no by-products, trims, or old meat)", "Prepared fresh and flash-frozen for safe delivery"],
        "ingredients": "80% Wild-caught salmon muscle meat, 10% salmon bone, 10% salmon organ.",
        "recipe_breakdown": "80% muscle meat, 10% bone, 10% organ",
        "nutrition": {"protein_min": "12.01%", "fat_min": "11.6%", "moisture_max": "71.82%", "fiber_max": "0.87%", "calcium_min": "1.2%", "phosphorus_min": "0.6%", "ash": "1.9%"},
        "short_description": "Omega-rich salmon protein for vitality and coat shine."
    },
    "Primal Feast Lamb": {
        "description": "Primal Feast Lamb provides a rich red meat protein in a classic 80/10/10 ratio — commonly selected for pets with sensitivities or active pets needing calorie-dense meals.\n\nUsed as a foundational base for raw feeders who rotate proteins or add custom ingredients. Not complete & balanced for everyday feeding.",
        "highlights": ["Ethically raised, pasture-raised Canadian lamb (drug-free, grass-fed)", "All-natural ingredients (non-GMO, no additives, preservatives, or fillers)", "Certified human-grade (no by-products, trims, or old meat)", "Prepared fresh and flash-frozen for safe delivery"],
        "ingredients": "80% Pasture-raised lamb muscle meat, 10% lamb bone, 10% lamb organ.",
        "recipe_breakdown": "80% muscle meat, 10% bone, 10% organ",
        "nutrition": {"protein_min": "17%", "fat_min": "8.1%", "moisture_max": "74.32%", "fiber_max": "0.7%", "calcium_min": "1%", "phosphorus_min": "0.7%", "ash": "0.9%"},
        "short_description": "Savoury lamb protein for energy and variety."
    },
    "Primal Feast Goat": {
        "description": "Primal Feast Goat provides a hypoallergenic, lean protein in a classic 80/10/10 ratio — often chosen for pets with sensitivities.\n\nUsed as a foundational base for personalized feeding. Not complete & balanced for everyday feeding.",
        "highlights": ["Ethically raised, pasture-raised Canadian goat (drug-free, grass-fed)", "All-natural ingredients (non-GMO, no additives, preservatives, or fillers)", "Certified human-grade (no by-products, trims, or old meat)", "Prepared fresh and flash-frozen for safe delivery"],
        "ingredients": "80% Pasture-raised goat muscle meat, 10% goat bone, 10% goat organ.",
        "recipe_breakdown": "80% muscle meat, 10% bone, 10% organ",
        "nutrition": {"protein_min": "17.9%", "fat_min": "9.6%", "moisture_max": "69.82%", "fiber_max": "1.1%", "calcium_min": "1.3%", "phosphorus_min": "0.8%", "ash": "0.7%"},
        "short_description": "Lean, hypoallergenic goat protein for sensitive dogs."
    },
    "Primal Feast Rabbit": {
        "description": "Primal Feast Rabbit delivers a naturally lean, novel protein in a classic 80/10/10 ratio — often selected for sensitive pets or rotational feeding.\n\nUsed as a foundational base for raw feeders who prefer full control over ingredients. Not complete & balanced for everyday feeding.",
        "highlights": ["Ethically raised, cage-free Canadian rabbit (drug-free, grass-fed)", "All-natural ingredients (non-GMO, no additives, preservatives, or fillers)", "Certified human-grade (no by-products, trims, or old meat)", "Prepared fresh and flash-frozen for safe delivery"],
        "ingredients": "80% Cage-free rabbit muscle meat, 10% rabbit bone, 10% rabbit organ.",
        "recipe_breakdown": "80% muscle meat, 10% bone, 10% organ",
        "nutrition": {"protein_min": "10.5%", "fat_min": "18.9%", "moisture_max": "66.8%", "fiber_max": "0.9%", "calcium_min": "1.6%", "phosphorus_min": "0.6%", "ash": "2.2%"},
        "short_description": "Ultra-lean rabbit protein for digestive ease and rotation."
    }
}

# Update Primal Feast products
print("\n" + "="*80)
print("UPDATING PRIMAL FEAST PRODUCTS (80/10/10 - NOT Complete & Balanced)")
print("="*80)
for name, data in primal_feast.items():
    result = db.products.update_one(
        {"name": name},
        {"$set": {
            "description": data["description"],
            "highlights": data["highlights"],
            "ingredients": data["ingredients"],
            "recipe_breakdown": data["recipe_breakdown"],
            "nutrition": data["nutrition"],
            "product_info": PRODUCT_INFO,
            "feeding_guide": FEEDING_GUIDE,
            "short_description": data["short_description"],
            "pet_type": "dog",
            "is_complete_balanced": False
        }}
    )
    if result.modified_count > 0:
        print(f"✓ Updated: {name}")
    else:
        print(f"⚠ Not found or no changes: {name}")

print(f"\n✅ Processed {len(primal_feast)} Primal Feast products")
print("\nNext: Run part 3 for Royal Paws (cat) products")
