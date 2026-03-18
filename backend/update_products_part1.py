import pymongo
import os
from dotenv import load_dotenv

load_dotenv()

client = pymongo.MongoClient(os.getenv('MONGO_URL'))
db = client[os.getenv('DB_NAME')]

# Standard sections for all products
PRODUCT_INFO = """This product is processed and packaged in a government-regulated facility to ensure human-grade quality standards. It's freshly made, then flash-frozen to preserve all nutrients. Best consumed by pets within 12 months from the purchase date.

Since our products are 100% natural, slight variations from the pictured product may occur."""

FEEDING_GUIDE = """**Handling Instructions:** After handling raw meat and poultry, wash your hands, utensils, and surfaces with hot, soapy water to prevent cross-contamination. Keep raw foods separate from other items.

**Feeding Instructions:** Thaw in the fridge or in cold water. Once defrosted, keep refrigerated and use within 3-4 days. Some change in meat colour due to oxidation is normal and safe. Do not thaw in the microwave. Not for human consumption.

See our [feeding calculator](/calculator) to see how much to feed your pet."""

# ==================== COMFORT DINNER PRODUCTS ====================
comfort_dinners = {
    "Comfort Dinner Chicken": {
        "description": "Comfort Dinner Chicken provides a light, complete and balanced meal that supports digestion and everyday vitality for dogs of all life stages. Its familiar profile makes it an ideal choice for consistent feeding, smooth dietary rotation and a mild introduction to raw.",
        "highlights": ["Ethically raised, free-range Canadian chicken (drug-free, omega-3 fed)", "All-natural ingredients (non-GMO, no additives, preservatives, or fillers)", "Certified human-grade (no by-products, trims, or old meat)", "Prepared fresh and flash-frozen for safe delivery"],
        "ingredients": "Free-range chicken muscle meat, chicken bone, and chicken organ with alfalfa, broccoli, carrots, celery, apples, kelp, turmeric, flax seeds, Atlantic herring fish oil, prebiotics/probiotics, copper proteinate, DL-methionine, glucosamine sulfate, L-lysine, L. acidophilus, manganese, zinc proteinate, methionine, MSM, omega-3, omega-6, omega-9, selenium, vitamin and mineral complex, vitamin E, vitamin C, yeast culture, and enzymes.",
        "recipe_breakdown": "70% muscle meat, 10% bone, 10% organ, 8% fruits & veggies, 2% supplements",
        "nutrition": {"protein_min": "16.8%", "fat_min": "14.8%", "moisture_max": "65.4%", "fiber_max": "0.2%", "calcium_min": "1.15%", "phosphorus_min": "0.65%", "ash": "4%"},
        "short_description": "Mild, familiar, and easy-to-digest chicken meal for daily feeding and steady nutrition."
    },
    "Comfort Dinner Beef": {
        "description": "Comfort Dinner Beef provides a hearty, nourishing, complete and balanced meal that supports strength, energy, and digestive comfort in dogs of all life stages. Its steady fuel profile makes it ideal for active dogs and well suited for daily feeding or balanced rotation.",
        "highlights": ["Ethically raised, pasture-raised Canadian beef (drug-free, grass-fed)", "All-natural ingredients (non-GMO, no additives, preservatives, or fillers)", "Certified human-grade (no by-products, trims, or old meat)", "Prepared fresh and flash-frozen for safe delivery"],
        "ingredients": "Pasture-raised beef muscle meat, beef bone, and beef organ with alfalfa, broccoli, carrots, celery, apples, kelp, turmeric, flax seeds, Atlantic herring fish oil, prebiotics/probiotics, copper proteinate, DL-methionine, glucosamine sulfate, L-lysine, L. acidophilus, manganese, zinc proteinate, methionine, MSM, omega-3, omega-6, omega-9, selenium, vitamin and mineral complex, vitamin E, vitamin C, yeast culture, and enzymes.",
        "recipe_breakdown": "70% muscle meat, 10% bone, 10% organ, 8% fruits & veggies, 2% supplements",
        "nutrition": {"protein_min": "16.5%", "fat_min": "7.5%", "moisture_max": "73.4%", "fiber_max": "0.22%", "calcium_min": "0.22%", "phosphorus_min": "0.17%", "ash": "3.5%"},
        "short_description": "Hearty, protein-rich beef for active dogs or those needing consistent energy."
    },
    "Comfort Dinner Duck": {
        "description": "Comfort Dinner Duck provides a novel, complete and balanced meal designed to support digestive comfort and variety for dogs of all life stages. Its unique profile makes it a useful option for dogs needing skin or coat support and dietary diversity.",
        "highlights": ["Ethically raised, free-range Canadian duck (drug-free, omega-3 fed)", "All-natural ingredients (non-GMO, no additives, preservatives, or fillers)", "Certified human-grade (no by-products, trims, or old meat)", "Prepared fresh and flash-frozen for safe delivery"],
        "ingredients": "Free-range duck muscle meat, duck bone, and duck organ with alfalfa, broccoli, carrots, celery, apples, kelp, turmeric, flax seeds, Atlantic herring fish oil, prebiotics/probiotics, copper proteinate, DL-methionine, glucosamine sulfate, L-lysine, L. acidophilus, manganese, zinc proteinate, methionine, MSM, omega-3, omega-6 omega-9, selenium, vitamin and mineral complex, vitamin E, vitamin C, yeast culture, and enzymes.",
        "recipe_breakdown": "70% muscle meat, 10% bone, 10% organ, 8% fruits & veggies, 2% supplements",
        "nutrition": {"protein_min": "12.09%", "fat_min": "13.15%", "moisture_max": "70.2%", "fiber_max": "1.87%", "calcium_min": "0.6%", "phosphorus_min": "0.3%", "ash": "3.09%"},
        "short_description": "Novel protein with skin & coat benefits; perfect for dietary rotation."
    },
    "Comfort Dinner Turkey": {
        "description": "Comfort Dinner Turkey provides a gentle, complete and balanced meal designed to support steady energy and easy digestion in dogs of all life stages. Its mild profile makes it a reliable everyday option, especially for dogs that benefit from consistency or digestive support.",
        "highlights": ["Ethically raised, free-range Canadian turkey (drug-free, omega-3 fed)", "All-natural ingredients (non-GMO, no additives, preservatives, or fillers)", "Certified human-grade (no by-products, trims, or old meat)", "Prepared fresh and flash-frozen for safe delivery"],
        "ingredients": "Free-range turkey muscle meat, turkey bone, and turkey organ with alfalfa, broccoli, carrots, celery, apples, kelp, turmeric, flax seeds, Atlantic herring fish oil, prebiotics/probiotics, copper proteinate, DL-methionine, glucosamine sulfate, L-lysine, L. acidophilus, manganese, zinc proteinate, methionine, MSM, omega-3, omega-6 omega-9, selenium, vitamin and mineral complex, vitamin E, vitamin C, yeast culture, and enzymes.",
        "recipe_breakdown": "70% muscle meat, 10% bone, 10% organ, 8% fruits & veggies, 2% supplements",
        "nutrition": {"protein_min": "16.2%", "fat_min": "12.8%", "moisture_max": "70.8%", "fiber_max": "0.7%", "calcium_min": "0.92%", "phosphorus_min": "0.8%", "ash": "3%"},
        "short_description": "Gentle turkey meal supporting sensitive digestion and steady energy."
    },
    "Comfort Dinner Fish": {
        "description": "Comfort Dinner Salmon provides a flavourful, omega-rich, complete and balanced meal that supports digestion, skin, and coat health in dogs of all life stages. Ideal for dogs needing gentle nourishment with added functional benefits.",
        "highlights": ["Ethically raised, wild-caught Canadian salmon (drug-free)", "All-natural ingredients (non-GMO, no additives, preservatives, or fillers)", "Certified human-grade (no by-products, trims, or old meat)", "Prepared fresh and flash-frozen for safe delivery"],
        "ingredients": "Wild-caught fish muscle meat, fish bone, and fish organ with alfalfa, broccoli, carrots, celery, apples, kelp, turmeric, flax seeds, Atlantic herring fish oil, prebiotics/probiotics, copper proteinate, DL-methionine, glucosamine sulfate, L-lysine, L. acidophilus, manganese, zinc proteinate, methionine, MSM, omega-3, omega-6, omega-9, selenium, vitamin and mineral complex, vitamin E, vitamin C, yeast culture, and enzymes.",
        "recipe_breakdown": "70% muscle meat, 10% bone, 10% organ, 8% fruits & veggies, 2% supplements",
        "nutrition": {"protein_min": "11%", "fat_min": "12%", "moisture_max": "66%", "fiber_max": "0.46%", "calcium_min": "0.8%", "phosphorus_min": "0.38%", "ash": "2.68%"},
        "short_description": "Omega-rich fish for skin, coat, and overall vitality."
    },
    "Comfort Dinner Goat": {
        "description": "Comfort Dinner Goat provides a lean, digestible, complete and balanced meal designed to support gentle digestion and steady energy in dogs of all life stages. Its clean, simple profile makes it a great option for sensitive dogs or thoughtful dietary rotation.",
        "highlights": ["Ethically raised, pasture-raised Canadian goat (drug-free, grass-fed)", "All-natural ingredients (non-GMO, no additives, preservatives, or fillers)", "Certified human-grade (no by-products, trims, or old meat)", "Prepared fresh and flash-frozen for safe delivery"],
        "ingredients": "Pasture-raised goat muscle meat, goat bone, and goat organ with alfalfa, broccoli, carrots, celery, apples, kelp, turmeric, flax seeds, Atlantic herring fish oil, prebiotics/probiotics, copper proteinate, DL-methionine, glucosamine sulfate, L-lysine, L. acidophilus, manganese, zinc proteinate, methionine, MSM, omega-3, omega-6, omega-9, selenium, vitamin and mineral complex, vitamin E, vitamin C, yeast culture, and enzymes.",
        "recipe_breakdown": "70% muscle meat, 10% bone, 10% organ, 8% fruits & veggies, 2% supplements",
        "nutrition": {"protein_min": "16.6%", "fat_min": "7.6%", "moisture_max": "73.3%", "fiber_max": "1.67%", "calcium_min": "0.7%", "phosphorus_min": "0.26%", "ash": "0.1%"},
        "short_description": "Lean, digestible protein for dogs with sensitive stomachs or food variety needs."
    },
    "Comfort Dinner Lamb": {
        "description": "Comfort Dinner Lamb provides a rich yet gentle, complete and balanced meal for dogs of all life stages. Its steady energy profile supports digestion while offering a satisfying alternative for rotational feeding.",
        "highlights": ["Ethically raised, pasture-raised Canadian lamb (drug-free, grass-fed)", "All-natural ingredients (non-GMO, no additives, preservatives, or fillers)", "Certified human-grade (no by-products, trims, or old meat)", "Prepared fresh and flash-frozen for safe delivery"],
        "ingredients": "Pasture-raised lamb muscle meat, lamb bone, and lamb organ with alfalfa, broccoli, carrots, celery, apples, kelp, turmeric, flax seeds, Atlantic herring fish oil, prebiotics/probiotics, copper proteinate, DL-methionine, glucosamine sulfate, L-lysine, L. acidophilus, manganese, zinc proteinate, methionine, MSM, omega-3, omega-6, omega-9, selenium, vitamin and mineral complex, vitamin E, vitamin C, yeast culture, and enzymes.",
        "recipe_breakdown": "70% muscle meat, 10% bone, 10% organ, 8% fruits & veggies, 2% supplements",
        "nutrition": {"protein_min": "14.9%", "fat_min": "14.6%", "moisture_max": "72.82%", "fiber_max": "1.78%", "calcium_min": "0.67%", "phosphorus_min": "0.39%", "ash": "1.9%"},
        "short_description": "Rich, flavorful protein supporting strength and coat health."
    },
    "Comfort Dinner Rabbit": {
        "description": "Comfort Dinner Rabbit provides an ultra-lean, complete and balanced meal designed to support digestive ease and dietary simplicity for dogs of all life stages. Its novel profile makes it well suited for sensitive dogs, allergy relief and rotational feeding.",
        "highlights": ["Ethically raised, cage-free Canadian rabbit (drug-free, grass-fed)", "All-natural ingredients (non-GMO, no additives, preservatives, or fillers)", "Certified human-grade (no by-products, trims, or old meat)", "Prepared fresh and flash-frozen for safe delivery"],
        "ingredients": "Cage-free rabbit muscle meat, rabbit bone, and rabbit organ with alfalfa, broccoli, carrots, celery, apples, kelp, turmeric, flax seeds, Atlantic herring fish oil, prebiotics/probiotics, copper proteinate, DL-methionine, glucosamine sulfate, L-lysine, L. acidophilus, manganese, zinc proteinate, methionine, MSM, omega-3, omega-6, omega-9, selenium, vitamin and mineral complex, vitamin E, vitamin C, yeast culture, and enzymes.",
        "recipe_breakdown": "70% muscle meat, 10% bone, 10% organ, 8% fruits & veggies, 2% supplements",
        "nutrition": {"protein_min": "15.5%", "fat_min": "7.4%", "moisture_max": "73.5%", "fiber_max": "0.67%", "calcium_min": "0.1%", "phosphorus_min": "0.4%", "ash": "2.68%"},
        "short_description": "Ultra-lean, simple protein for digestive comfort and variety."
    }
}

# Update Comfort Dinner products
print("\n" + "="*80)
print("UPDATING COMFORT DINNER PRODUCTS (Complete & Balanced)")
print("="*80)
for name, data in comfort_dinners.items():
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
            "is_complete_balanced": True
        }}
    )
    if result.modified_count > 0:
        print(f"✓ Updated: {name}")
    else:
        print(f"⚠ Not found or no changes: {name}")

print(f"\n✅ Processed {len(comfort_dinners)} Comfort Dinner products")

print("\n" + "="*80)
print("DATABASE UPDATE COMPLETE!")
print("="*80)
print("\n✓ All product descriptions updated")
print("✓ All ingredients corrected")
print("✓ All nutritional information added")
print("✓ Product info sections added")
print("✓ Feeding guides with calculator link added")
print("\nNext: Run part 2 for Primal Feast products")
