"""
=============================================================================
FOEGUARD PRODUCT DATABASE - MASTER DATA FILE
=============================================================================

This file contains ALL product and treat data for the FoeGuard website.
It is the SINGLE SOURCE OF TRUTH for all product information.

HOW IT WORKS:
- On every server startup, the database is automatically seeded/updated
  with the data from this file (see server.py seed_database function)
- The seeding uses replace_one() which FULLY REPLACES each document,
  ensuring the database always matches this file exactly
- Any changes to product descriptions, ingredients, nutrition facts, 
  pricing, etc. should be made HERE, not directly in the database

TO UPDATE PRODUCTS:
1. Edit the product data in this file
2. Commit to GitHub and deploy to Emergent
3. The server will automatically update the database on startup

PRODUCT STRUCTURE:
- COMFORT_DINNER_PRODUCTS: Complete & balanced meals (70/10/10/8/2 ratio)
- PRIMAL_FEAST_PRODUCTS: 80/10/10 base meals (not complete & balanced)
- ROYAL_PAWS_PRODUCTS: Cat food (95% meat, complete & balanced)
- TREATS: Dog treats (bones, feet, heads, etc.)
- CAT_TREATS: Cat-specific treats

=============================================================================
"""

# Product Information shared across all products
PRODUCT_INFO = "This product is processed and packaged in a government-regulated facility to ensure human-grade quality standards. It's freshly made, then flash-frozen to preserve all nutrients. Best consumed by pets within 12 months from the purchase date.\nSince our products are 100% natural, slight variations from the pictured product may occur."

FEEDING_GUIDE = {
    "handling": "After handling raw meat and poultry, wash your hands, utensils, and surfaces with hot, soapy water to prevent cross-contamination. Keep raw foods separate from other items.",
    "feeding": "Thaw in the fridge or in cold water. Once defrosted, keep refrigerated and use within 3-4 days. Some change in meat colour due to oxidation is normal and safe. Do not thaw in the microwave. Not for human consumption.",
    "note": "See our feeding calculator to see how much to feed your pet."
}

# Comfort Dinner Products - Complete & Balanced
COMFORT_DINNER_PRODUCTS = [
    {
        "product_id": "cd-chicken",
        "product_line": "comfort_dinner",
        "protein_type": "chicken",
        "name": "Comfort Chicken",
        "mini_description": "Mild, familiar, and easy-to-digest chicken meal for daily feeding and steady nutrition.",
        "description": "Comfort Dinner Chicken provides a light, complete and balanced meal that supports digestion and everyday vitality for dogs of all life stages. Its familiar profile makes it an ideal choice for consistent feeding, smooth dietary rotation, and a mild introduction to raw.",
        "highlights": ["Ethically raised, free-range Canadian chicken (drug-free, omega-3 fed)", "All-natural ingredients (non-GMO, no additives, preservatives, or fillers)", "Certified human-grade (no by-products, trims, or old meat)", "Prepared fresh and flash-frozen for safe delivery"],
        "ingredients": "Free-range chicken muscle meat, chicken bone, and chicken organ with alfalfa, broccoli, carrots, celery, apples, kelp, turmeric, flax seeds, Atlantic herring fish oil, prebiotics/probiotics, copper proteinate, DL-methionine, glucosamine sulfate, L-lysine, L. acidophilus, manganese, zinc proteinate, methionine, MSM, omega-3, omega-6, omega-9, selenium, vitamin and mineral complex, vitamin E, vitamin C, yeast culture, and enzymes.",
        "recipe_breakdown": "70% muscle meat, 10% bone, 10% organ, 8% fruits & veggies, 2% supplements",
        "nutrition_facts": {"protein_min": "16.8%", "fat_min": "14.8%", "moisture_max": "65.4%", "fiber_max": "0.2%", "calcium_min": "1.15%", "phosphorus_min": "0.65%", "ash": "4%"},
        "feeding_guide": FEEDING_GUIDE,
        "product_information": PRODUCT_INFO,
        "pricing": [
            {"size_lb": 6, "price": 26.99, "price_per_lb": 4.50, "savings_percent": 0},
            {"size_lb": 12, "price": 48.60, "price_per_lb": 4.05, "savings_percent": 10},
            {"size_lb": 18, "price": 73.17, "price_per_lb": 4.07, "savings_percent": 5},
            {"size_lb": 24, "price": 97.20, "price_per_lb": 4.05, "savings_percent": 10}
        ],
        "inventory_status": "available"
    },
    {
        "product_id": "cd-beef",
        "product_line": "comfort_dinner",
        "protein_type": "beef",
        "name": "Comfort Beef",
        "mini_description": "Hearty, protein-rich beef for active dogs or those needing consistent energy.",
        "description": "Comfort Dinner Beef provides a hearty, nourishing, complete and balanced meal that supports strength, energy, and digestive comfort in dogs of all life stages. Its steady fuel profile makes it ideal for active dogs and well suited for daily feeding or balanced rotation.",
        "highlights": ["Ethically raised, pasture-raised Canadian beef (drug-free, grass-fed)", "All-natural ingredients (non-GMO, no additives, preservatives, or fillers)", "Certified human-grade (no by-products, trims, or old meat)", "Prepared fresh and flash-frozen for safe delivery"],
        "ingredients": "Pasture-raised beef muscle meat, beef bone, and beef organ with alfalfa, broccoli, carrots, celery, apples, kelp, turmeric, flax seeds, Atlantic herring fish oil, prebiotics/probiotics, copper proteinate, DL-methionine, glucosamine sulfate, L-lysine, L. acidophilus, manganese, zinc proteinate, methionine, MSM, omega-3, omega-6, omega-9, selenium, vitamin and mineral complex, vitamin E, vitamin C, yeast culture, and enzymes.",
        "recipe_breakdown": "70% muscle meat, 10% bone, 10% organ, 8% fruits & veggies, 2% supplements",
        "nutrition_facts": {"protein_min": "16.5%", "fat_min": "7.5%", "moisture_max": "73.4%", "fiber_max": "0.22%", "calcium_min": "0.22%", "phosphorus_min": "0.17%", "ash": "3.5%"},
        "feeding_guide": FEEDING_GUIDE,
        "product_information": PRODUCT_INFO,
        "pricing": [
            {"size_lb": 6, "price": 39.97, "price_per_lb": 6.66, "savings_percent": 0},
            {"size_lb": 12, "price": 69.97, "price_per_lb": 5.83, "savings_percent": 12},
            {"size_lb": 18, "price": 113.91, "price_per_lb": 6.33, "savings_percent": 5},
            {"size_lb": 24, "price": 143.88, "price_per_lb": 5.995, "savings_percent": 10}
        ],
        "inventory_status": "available"
    },
    {
        "product_id": "cd-duck",
        "product_line": "comfort_dinner",
        "protein_type": "duck",
        "name": "Comfort Duck",
        "mini_description": "Novel protein with skin & coat benefits; perfect for dietary rotation.",
        "description": "Comfort Dinner Duck provides a novel, complete and balanced meal designed to support digestive comfort and variety for dogs of all life stages. Its unique profile makes it a useful option for dogs needing skin or coat support and dietary diversity.",
        "highlights": ["Ethically raised, free-range Canadian duck (drug-free, omega-3 fed)", "All-natural ingredients (non-GMO, no additives, preservatives, or fillers)", "Certified human-grade (no by-products, trims, or old meat)", "Prepared fresh and flash-frozen for safe delivery"],
        "ingredients": "Free-range duck muscle meat, duck bone, and duck organ with alfalfa, broccoli, carrots, celery, apples, kelp, turmeric, flax seeds, Atlantic herring fish oil, prebiotics/probiotics, copper proteinate, DL-methionine, glucosamine sulfate, L-lysine, L. acidophilus, manganese, zinc proteinate, methionine, MSM, omega-3, omega-6 omega-9, selenium, vitamin and mineral complex, vitamin E, vitamin C, yeast culture, and enzymes.",
        "recipe_breakdown": "70% muscle meat, 10% bone, 10% organ, 8% fruits & veggies, 2% supplements",
        "nutrition_facts": {"protein_min": "12.09%", "fat_min": "13.15%", "moisture_max": "70.2%", "fiber_max": "1.87%", "calcium_min": "0.6%", "phosphorus_min": "0.3%", "ash": "3.09%"},
        "feeding_guide": FEEDING_GUIDE,
        "product_information": PRODUCT_INFO,
        "pricing": [
            {"size_lb": 6, "price": 39.97, "price_per_lb": 6.66, "savings_percent": 0},
            {"size_lb": 12, "price": 69.97, "price_per_lb": 5.83, "savings_percent": 12},
            {"size_lb": 18, "price": 113.91, "price_per_lb": 6.33, "savings_percent": 5},
            {"size_lb": 24, "price": 143.88, "price_per_lb": 5.995, "savings_percent": 10}
        ],
        "inventory_status": "available"
    },
    {
        "product_id": "cd-turkey",
        "product_line": "comfort_dinner",
        "protein_type": "turkey",
        "name": "Comfort Turkey",
        "mini_description": "Gentle turkey meal supporting sensitive digestion and steady energy.",
        "description": "Comfort Dinner Turkey provides a gentle, complete and balanced meal designed to support steady energy and easy digestion in dogs of all life stages. Its mild profile makes it a reliable everyday option, especially for dogs that benefit from consistency or digestive support.",
        "highlights": ["Ethically raised, free-range Canadian turkey (drug-free, omega-3 fed)", "All-natural ingredients (non-GMO, no additives, preservatives, or fillers)", "Certified human-grade (no by-products, trims, or old meat)", "Prepared fresh and flash-frozen for safe delivery"],
        "ingredients": "Free-range turkey muscle meat, turkey bone, and turkey organ with alfalfa, broccoli, carrots, celery, apples, kelp, turmeric, flax seeds, Atlantic herring fish oil, prebiotics/probiotics, copper proteinate, DL-methionine, glucosamine sulfate, L-lysine, L. acidophilus, manganese, zinc proteinate, methionine, MSM, omega-3, omega-6 omega-9, selenium, vitamin and mineral complex, vitamin E, vitamin C, yeast culture, and enzymes.",
        "recipe_breakdown": "70% muscle meat, 10% bone, 10% organ, 8% fruits & veggies, 2% supplements",
        "nutrition_facts": {"protein_min": "16.2%", "fat_min": "12.8%", "moisture_max": "70.8%", "fiber_max": "0.7%", "calcium_min": "0.92%", "phosphorus_min": "0.8%", "ash": "3%"},
        "feeding_guide": FEEDING_GUIDE,
        "product_information": PRODUCT_INFO,
        "pricing": [
            {"size_lb": 6, "price": 39.97, "price_per_lb": 6.66, "savings_percent": 0},
            {"size_lb": 12, "price": 69.94, "price_per_lb": 5.83, "savings_percent": 13},
            {"size_lb": 18, "price": 113.91, "price_per_lb": 6.33, "savings_percent": 5},
            {"size_lb": 24, "price": 143.86, "price_per_lb": 5.99, "savings_percent": 10}
        ],
        "inventory_status": "available"
    },
    {
        "product_id": "cd-fish",
        "product_line": "comfort_dinner",
        "protein_type": "fish",
        "name": "Comfort Salmon",
        "mini_description": "Omega-rich fish for skin, coat, and overall vitality.",
        "description": "Comfort Dinner Salmon provides a flavourful, omega-rich, complete and balanced meal that supports digestion, skin, and coat health in dogs of all life stages.",
        "highlights": ["Ethically raised, wild-caught Canadian salmon (drug-free)", "All-natural ingredients (non-GMO, no additives, preservatives, or fillers)", "Certified human-grade (no by-products, trims, or old meat)", "Prepared fresh and flash-frozen for safe delivery"],
        "ingredients": "Wild-caught fish muscle meat, fish bone, and fish organ with alfalfa, broccoli, carrots, celery, apples, kelp, turmeric, flax seeds, Atlantic herring fish oil, prebiotics/probiotics, copper proteinate, DL-methionine, glucosamine sulfate, L-lysine, L. acidophilus, manganese, zinc proteinate, methionine, MSM, omega-3, omega-6, omega-9, selenium, vitamin and mineral complex, vitamin E, vitamin C, yeast culture, and enzymes.",
        "recipe_breakdown": "70% muscle meat, 10% bone, 10% organ, 8% fruits & veggies, 2% supplements",
        "nutrition_facts": {"protein_min": "11%", "fat_min": "12%", "moisture_max": "66%", "fiber_max": "0.46%", "calcium_min": "0.8%", "phosphorus_min": "0.38%", "ash": "2.68%"},
        "feeding_guide": FEEDING_GUIDE,
        "product_information": PRODUCT_INFO,
        "pricing": [
            {"size_lb": 6, "price": 44.95, "price_per_lb": 7.49, "savings_percent": 0},
            {"size_lb": 12, "price": 80.95, "price_per_lb": 6.75, "savings_percent": 10},
            {"size_lb": 18, "price": 128.27, "price_per_lb": 7.13, "savings_percent": 5},
            {"size_lb": 24, "price": 161.46, "price_per_lb": 6.73, "savings_percent": 10}
        ],
        "inventory_status": "available"
    },
    {
        "product_id": "cd-goat",
        "product_line": "comfort_dinner",
        "protein_type": "goat",
        "name": "Comfort Goat",
        "mini_description": "Lean, digestible protein for dogs with sensitive stomachs or food variety needs.",
        "description": "Comfort Dinner Goat provides a lean, digestible, complete and balanced meal designed to support gentle digestion and steady energy in dogs of all life stages.",
        "highlights": ["Ethically raised, pasture-raised Canadian goat (drug-free, grass-fed)", "All-natural ingredients (non-GMO, no additives, preservatives, or fillers)", "Certified human-grade (no by-products, trims, or old meat)", "Prepared fresh and flash-frozen for safe delivery"],
        "ingredients": "Pasture-raised goat muscle meat, goat bone, and goat organ with alfalfa, broccoli, carrots, celery, apples, kelp, turmeric, flax seeds, Atlantic herring fish oil, prebiotics/probiotics, copper proteinate, DL-methionine, glucosamine sulfate, L-lysine, L. acidophilus, manganese, zinc proteinate, methionine, MSM, omega-3, omega-6, omega-9, selenium, vitamin and mineral complex, vitamin E, vitamin C, yeast culture, and enzymes.",
        "recipe_breakdown": "70% muscle meat, 10% bone, 10% organ, 8% fruits & veggies, 2% supplements",
        "nutrition_facts": {"protein_min": "16.6%", "fat_min": "7.6%", "moisture_max": "73.3%", "fiber_max": "1.67%", "calcium_min": "0.7%", "phosphorus_min": "0.26%", "ash": "0.1%"},
        "feeding_guide": FEEDING_GUIDE,
        "product_information": PRODUCT_INFO,
        "pricing": [
            {"size_lb": 6, "price": 59.94, "price_per_lb": 9.99, "savings_percent": 0},
            {"size_lb": 12, "price": 107.88, "price_per_lb": 8.99, "savings_percent": 10},
            {"size_lb": 18, "price": 170.89, "price_per_lb": 9.49, "savings_percent": 5},
            {"size_lb": 24, "price": 215.78, "price_per_lb": 8.99, "savings_percent": 10}
        ],
        "inventory_status": "available"
    },
    {
        "product_id": "cd-lamb",
        "product_line": "comfort_dinner",
        "protein_type": "lamb",
        "name": "Comfort Lamb",
        "mini_description": "Rich, flavorful protein supporting strength and coat health.",
        "description": "Comfort Dinner Lamb provides a rich yet gentle, complete and balanced meal for dogs of all life stages.",
        "highlights": ["Ethically raised, pasture-raised Canadian lamb (drug-free, grass-fed)", "All-natural ingredients (non-GMO, no additives, preservatives, or fillers)", "Certified human-grade (no by-products, trims, or old meat)", "Prepared fresh and flash-frozen for safe delivery"],
        "ingredients": "Pasture-raised lamb muscle meat, lamb bone, and lamb organ with alfalfa, broccoli, carrots, celery, apples, kelp, turmeric, flax seeds, Atlantic herring fish oil, prebiotics/probiotics, copper proteinate, DL-methionine, glucosamine sulfate, L-lysine, L. acidophilus, manganese, zinc proteinate, methionine, MSM, omega-3, omega-6, omega-9, selenium, vitamin and mineral complex, vitamin E, vitamin C, yeast culture, and enzymes.",
        "recipe_breakdown": "70% muscle meat, 10% bone, 10% organ, 8% fruits & veggies, 2% supplements",
        "nutrition_facts": {"protein_min": "14.9%", "fat_min": "14.6%", "moisture_max": "72.82%", "fiber_max": "1.78%", "calcium_min": "0.67%", "phosphorus_min": "0.39%", "ash": "1.9%"},
        "feeding_guide": FEEDING_GUIDE,
        "product_information": PRODUCT_INFO,
        "pricing": [
            {"size_lb": 6, "price": 59.94, "price_per_lb": 9.99, "savings_percent": 0},
            {"size_lb": 12, "price": 107.88, "price_per_lb": 8.99, "savings_percent": 10},
            {"size_lb": 18, "price": 170.89, "price_per_lb": 9.49, "savings_percent": 5},
            {"size_lb": 24, "price": 215.78, "price_per_lb": 8.99, "savings_percent": 10}
        ],
        "inventory_status": "available"
    },
    {
        "product_id": "cd-rabbit",
        "product_line": "comfort_dinner",
        "protein_type": "rabbit",
        "name": "Comfort Rabbit",
        "mini_description": "Ultra-lean, simple protein for digestive comfort and variety.",
        "description": "Comfort Dinner Rabbit provides an ultra-lean, complete and balanced meal designed to support digestive ease and dietary simplicity for dogs of all life stages.",
        "highlights": ["Ethically raised, cage-free Canadian rabbit (drug-free, grass-fed)", "All-natural ingredients (non-GMO, no additives, preservatives, or fillers)", "Certified human-grade (no by-products, trims, or old meat)", "Prepared fresh and flash-frozen for safe delivery"],
        "ingredients": "Cage-free rabbit muscle meat, rabbit bone, and rabbit organ with alfalfa, broccoli, carrots, celery, apples, kelp, turmeric, flax seeds, Atlantic herring fish oil, prebiotics/probiotics, copper proteinate, DL-methionine, glucosamine sulfate, L-lysine, L. acidophilus, manganese, zinc proteinate, methionine, MSM, omega-3, omega-6, omega-9, selenium, vitamin and mineral complex, vitamin E, vitamin C, yeast culture, and enzymes.",
        "recipe_breakdown": "70% muscle meat, 10% bone, 10% organ, 8% fruits & veggies, 2% supplements",
        "nutrition_facts": {"protein_min": "15.5%", "fat_min": "7.4%", "moisture_max": "73.5%", "fiber_max": "0.67%", "calcium_min": "0.1%", "phosphorus_min": "0.4%", "ash": "2.68%"},
        "feeding_guide": FEEDING_GUIDE,
        "product_information": PRODUCT_INFO,
        "pricing": [
            {"size_lb": 6, "price": 86.28, "price_per_lb": 14.38, "savings_percent": 0},
            {"size_lb": 12, "price": 155.30, "price_per_lb": 12.94, "savings_percent": 10},
            {"size_lb": 18, "price": 246.04, "price_per_lb": 13.67, "savings_percent": 5},
            {"size_lb": 24, "price": 310.27, "price_per_lb": 12.93, "savings_percent": 10}
        ],
        "inventory_status": "available"
    }
]

# Primal Feast Products - 80/10/10 Base (Not Complete & Balanced)
PRIMAL_FEAST_PRODUCTS = [
    {
        "product_id": "pf-chicken",
        "product_line": "primal_feast",
        "protein_type": "chicken",
        "name": "Primal Chicken",
        "mini_description": "Lean chicken protein for easy digestion and versatile feeding.",
        "description": "Primal Feast Chicken offers lean, highly digestible protein in a classic 80/10/10 ratio — ideal as a foundational base for raw feeders who prefer to customize their pet's meals or rotate proteins. Made with single-source chicken, it's a simple and versatile option many pets love.\n\nPrimal Feast meals are designed as a base ingredient and are not complete & balanced for everyday feeding. Pet parents may add their own toppers or supplements to meet individual needs.",
        "highlights": ["Ethically raised, free-range Canadian chicken (drug-free, omega-3 fed)", "All-natural ingredients (non-GMO, no additives, preservatives, or fillers)", "Certified human-grade (no by-products, trims, or old meat)", "Prepared fresh and flash-frozen for safe delivery"],
        "ingredients": "80% Free-range chicken muscle meat, 10% chicken bone, 10% chicken organ.",
        "recipe_breakdown": "80% muscle meat, 10% bone, 10% organ",
        "nutrition_facts": {"protein_min": "18%", "fat_min": "16%", "moisture_max": "65%", "fiber_max": "0.1%", "calcium_min": "1.1%", "phosphorus_min": "0.8%", "ash": "3.7%"},
        "feeding_guide": FEEDING_GUIDE,
        "product_information": PRODUCT_INFO,
        "pricing": [
            {"size_lb": 6, "price": 26.99, "price_per_lb": 4.50, "savings_percent": 0},
            {"size_lb": 12, "price": 48.60, "price_per_lb": 4.05, "savings_percent": 10},
            {"size_lb": 18, "price": 73.17, "price_per_lb": 4.07, "savings_percent": 5},
            {"size_lb": 24, "price": 97.20, "price_per_lb": 4.05, "savings_percent": 10}
        ],
        "inventory_status": "available"
    },
    {
        "product_id": "pf-beef",
        "product_line": "primal_feast",
        "protein_type": "beef",
        "name": "Primal Beef",
        "mini_description": "Rich beef protein to fuel active dogs and rotational meals.",
        "description": "Primal Feast Beef delivers rich, calorie-dense nutrition in a classic 80/10/10 ratio — often chosen by active dogs or those who thrive on heartier, energizing proteins.\n\nDesigned as a foundational base for raw feeders who prefer to customize, rotate proteins, or add their own toppers. Not a complete & balanced diet for everyday feeding.",
        "highlights": ["Ethically raised, pasture-raised Canadian beef (drug-free, grass-fed)", "All-natural ingredients (non-GMO, no additives, preservatives, or fillers)", "Certified human-grade (no by-products, trims, or old meat)", "Prepared fresh and flash-frozen for safe delivery"],
        "ingredients": "80% Pasture-raised beef muscle meat, 10% beef bone, 10% beef organ.",
        "recipe_breakdown": "80% muscle meat, 10% bone, 10% organ",
        "nutrition_facts": {"protein_min": "19.8%", "fat_min": "9.36%", "moisture_max": "68%", "fiber_max": "0.1%", "calcium_min": "0.12%", "phosphorus_min": "0.19%", "ash": "1%"},
        "feeding_guide": FEEDING_GUIDE,
        "product_information": PRODUCT_INFO,
        "pricing": [
            {"size_lb": 6, "price": 39.97, "price_per_lb": 6.66, "savings_percent": 0},
            {"size_lb": 12, "price": 71.94, "price_per_lb": 5.995, "savings_percent": 10},
            {"size_lb": 18, "price": 113.91, "price_per_lb": 6.33, "savings_percent": 5},
            {"size_lb": 24, "price": 143.88, "price_per_lb": 5.995, "savings_percent": 10}
        ],
        "inventory_status": "available"
    },
    {
        "product_id": "pf-duck",
        "product_line": "primal_feast",
        "protein_type": "duck",
        "name": "Primal Duck",
        "mini_description": "Flavorful duck protein supporting skin and coat health.",
        "description": "Primal Feast Duck offers a nourishing protein in a classic 80/10/10 ratio — a popular choice for pets needing extra energy, skin and coat support, or as a novel alternative to common meats.\n\nCrafted as a rotational base for raw feeders looking to personalize meals. Not complete & balanced for everyday feeding.",
        "highlights": ["Ethically raised, free-range Canadian duck (drug-free, omega-3 fed)", "All-natural ingredients (non-GMO, no additives, preservatives, or fillers)", "Certified human-grade (no by-products, trims, or old meat)", "Prepared fresh and flash-frozen for safe delivery"],
        "ingredients": "80% Free-range duck muscle meat, 10% duck bone, 10% duck organ.",
        "recipe_breakdown": "80% muscle meat, 10% bone, 10% organ",
        "nutrition_facts": {"protein_min": "12.01%", "fat_min": "11.6%", "moisture_max": "71.82%", "fiber_max": "0.87%", "calcium_min": "1.2%", "phosphorus_min": "0.6%", "ash": "1.9%"},
        "feeding_guide": FEEDING_GUIDE,
        "product_information": PRODUCT_INFO,
        "pricing": [
            {"size_lb": 6, "price": 39.97, "price_per_lb": 6.66, "savings_percent": 0},
            {"size_lb": 12, "price": 71.94, "price_per_lb": 5.995, "savings_percent": 10},
            {"size_lb": 18, "price": 113.91, "price_per_lb": 6.33, "savings_percent": 5},
            {"size_lb": 24, "price": 143.88, "price_per_lb": 5.995, "savings_percent": 10}
        ],
        "inventory_status": "available"
    },
    {
        "product_id": "pf-turkey",
        "product_line": "primal_feast",
        "protein_type": "turkey",
        "name": "Primal Turkey",
        "mini_description": "Gentle turkey protein for sensitive dogs or rotation.",
        "description": "Primal Feast Turkey provides lean, easily digestible protein in a classic 80/10/10 ratio — ideal for dogs who do well on lighter proteins or as part of a varied raw rotation.\n\nUsed as a foundational base for customized feeding. Not complete & balanced for everyday feeding.",
        "highlights": ["Ethically raised, free-range Canadian turkey (drug-free, omega-3 fed)", "All-natural ingredients (non-GMO, no additives, preservatives, or fillers)", "Certified human-grade (no by-products, trims, or old meat)", "Prepared fresh and flash-frozen for safe delivery"],
        "ingredients": "80% Free-range turkey muscle meat, 10% turkey bone, 10% turkey organ.",
        "recipe_breakdown": "80% muscle meat, 10% bone, 10% organ",
        "nutrition_facts": {"protein_min": "12%", "fat_min": "11.6%", "moisture_max": "71.82%", "fiber_max": "0.87%", "calcium_min": "1.2%", "phosphorus_min": "0.86%", "ash": "1.9%"},
        "feeding_guide": FEEDING_GUIDE,
        "product_information": PRODUCT_INFO,
        "pricing": [
            {"size_lb": 6, "price": 39.97, "price_per_lb": 6.66, "savings_percent": 0},
            {"size_lb": 12, "price": 69.94, "price_per_lb": 5.83, "savings_percent": 13},
            {"size_lb": 18, "price": 113.91, "price_per_lb": 6.33, "savings_percent": 5},
            {"size_lb": 24, "price": 143.86, "price_per_lb": 5.99, "savings_percent": 10}
        ],
        "inventory_status": "available"
    },
    {
        "product_id": "pf-fish",
        "product_line": "primal_feast",
        "protein_type": "fish",
        "name": "Primal Salmon",
        "mini_description": "Omega-rich salmon protein for vitality and coat shine.",
        "description": "Primal Feast Salmon delivers omega-rich nutrition in an 80/10/10 ratio — supporting skin, coat, and overall vitality.\n\nDesigned as a foundational base for raw feeders who prefer to control balance through rotation or added ingredients. Not a complete & balanced diet for everyday feeding.",
        "highlights": ["Ethically raised, wild-caught Canadian salmon (drug-free)", "All-natural ingredients (non-GMO, no additives, preservatives, or fillers)", "Certified human-grade (no by-products, trims, or old meat)", "Prepared fresh and flash-frozen for safe delivery"],
        "ingredients": "80% Wild-caught salmon muscle meat, 10% salmon bone, 10% salmon organ.",
        "recipe_breakdown": "80% muscle meat, 10% bone, 10% organ",
        "nutrition_facts": {"protein_min": "12.01%", "fat_min": "11.6%", "moisture_max": "71.82%", "fiber_max": "0.87%", "calcium_min": "1.2%", "phosphorus_min": "0.6%", "ash": "1.9%"},
        "feeding_guide": FEEDING_GUIDE,
        "product_information": PRODUCT_INFO,
        "pricing": [
            {"size_lb": 6, "price": 44.95, "price_per_lb": 7.49, "savings_percent": 0},
            {"size_lb": 12, "price": 80.95, "price_per_lb": 6.75, "savings_percent": 10},
            {"size_lb": 18, "price": 128.27, "price_per_lb": 7.13, "savings_percent": 5},
            {"size_lb": 24, "price": 161.46, "price_per_lb": 6.73, "savings_percent": 10}
        ],
        "inventory_status": "available"
    },
    {
        "product_id": "pf-goat",
        "product_line": "primal_feast",
        "protein_type": "goat",
        "name": "Primal Goat",
        "mini_description": "Lean, hypoallergenic goat protein for sensitive dogs.",
        "description": "Primal Feast Goat provides a hypoallergenic, lean protein in a classic 80/10/10 ratio — often chosen for pets with sensitivities.\n\nUsed as a foundational base for personalized feeding. Not complete & balanced for everyday feeding.",
        "highlights": ["Ethically raised, pasture-raised Canadian goat (drug-free, grass-fed)", "All-natural ingredients (non-GMO, no additives, preservatives, or fillers)", "Certified human-grade (no by-products, trims, or old meat)", "Prepared fresh and flash-frozen for safe delivery"],
        "ingredients": "80% Pasture-raised goat muscle meat, 10% goat bone, 10% goat organ.",
        "recipe_breakdown": "80% muscle meat, 10% bone, 10% organ",
        "nutrition_facts": {"protein_min": "17.9%", "fat_min": "9.6%", "moisture_max": "69.82%", "fiber_max": "1.1%", "calcium_min": "1.3%", "phosphorus_min": "0.8%", "ash": "0.7%"},
        "feeding_guide": FEEDING_GUIDE,
        "product_information": PRODUCT_INFO,
        "pricing": [
            {"size_lb": 6, "price": 59.94, "price_per_lb": 9.99, "savings_percent": 0},
            {"size_lb": 12, "price": 107.88, "price_per_lb": 8.99, "savings_percent": 10},
            {"size_lb": 18, "price": 170.89, "price_per_lb": 9.49, "savings_percent": 5},
            {"size_lb": 24, "price": 215.78, "price_per_lb": 8.99, "savings_percent": 10}
        ],
        "inventory_status": "available"
    },
    {
        "product_id": "pf-lamb",
        "product_line": "primal_feast",
        "protein_type": "lamb",
        "name": "Primal Lamb",
        "mini_description": "Savoury lamb protein for energy and variety.",
        "description": "Primal Feast Lamb provides a rich red meat protein in a classic 80/10/10 ratio — commonly selected for pets with sensitivities or active pets needing calorie-dense meals.\n\nUsed as a foundational base for raw feeders who rotate proteins or add custom ingredients. Not complete & balanced for everyday feeding.",
        "highlights": ["Ethically raised, pasture-raised Canadian lamb (drug-free, grass-fed)", "All-natural ingredients (non-GMO, no additives, preservatives, or fillers)", "Certified human-grade (no by-products, trims, or old meat)", "Prepared fresh and flash-frozen for safe delivery"],
        "ingredients": "80% Pasture-raised lamb muscle meat, 10% lamb bone, 10% lamb organ.",
        "recipe_breakdown": "80% muscle meat, 10% bone, 10% organ",
        "nutrition_facts": {"protein_min": "17%", "fat_min": "8.1%", "moisture_max": "74.32%", "fiber_max": "0.7%", "calcium_min": "1%", "phosphorus_min": "0.7%", "ash": "0.9%"},
        "feeding_guide": FEEDING_GUIDE,
        "product_information": PRODUCT_INFO,
        "pricing": [
            {"size_lb": 6, "price": 59.94, "price_per_lb": 9.99, "savings_percent": 0},
            {"size_lb": 12, "price": 107.88, "price_per_lb": 8.99, "savings_percent": 10},
            {"size_lb": 18, "price": 170.89, "price_per_lb": 9.49, "savings_percent": 5},
            {"size_lb": 24, "price": 215.78, "price_per_lb": 8.99, "savings_percent": 10}
        ],
        "inventory_status": "available"
    },
    {
        "product_id": "pf-rabbit",
        "product_line": "primal_feast",
        "protein_type": "rabbit",
        "name": "Primal Rabbit",
        "mini_description": "Ultra-lean rabbit protein for digestive ease and rotation.",
        "description": "Primal Feast Rabbit delivers a naturally lean, novel protein in a classic 80/10/10 ratio — often selected for sensitive pets or rotational feeding.\n\nUsed as a foundational base for raw feeders who prefer full control over ingredients. Not complete & balanced for everyday feeding.",
        "highlights": ["Ethically raised, cage-free Canadian rabbit (drug-free, grass-fed)", "All-natural ingredients (non-GMO, no additives, preservatives, or fillers)", "Certified human-grade (no by-products, trims, or old meat)", "Prepared fresh and flash-frozen for safe delivery"],
        "ingredients": "80% Cage-free rabbit muscle meat, 10% rabbit bone, 10% rabbit organ.",
        "recipe_breakdown": "80% muscle meat, 10% bone, 10% organ",
        "nutrition_facts": {"protein_min": "10.5%", "fat_min": "18.9%", "moisture_max": "66.8%", "fiber_max": "0.9%", "calcium_min": "1.6%", "phosphorus_min": "0.6%", "ash": "2.2%"},
        "feeding_guide": FEEDING_GUIDE,
        "product_information": PRODUCT_INFO,
        "pricing": [
            {"size_lb": 6, "price": 86.28, "price_per_lb": 14.38, "savings_percent": 0},
            {"size_lb": 12, "price": 155.30, "price_per_lb": 12.94, "savings_percent": 10},
            {"size_lb": 18, "price": 246.04, "price_per_lb": 13.67, "savings_percent": 5},
            {"size_lb": 24, "price": 310.27, "price_per_lb": 12.93, "savings_percent": 10}
        ],
        "inventory_status": "available"
    }
]

# Royal Paws Products - Cat Food (95% meat, Complete & Balanced)
ROYAL_PAWS_PRODUCTS = [
    {
        "product_id": "rp-chicken",
        "product_line": "royal_paws",
        "pet_type": "cat",
        "protein_type": "chicken",
        "name": "Royal Chicken",
        "mini_description": "Tender chicken for digestible, everyday feline nutrition.",
        "description": "Royal Paws Chicken Dinner provides a lean, highly digestible complete and balanced meal with your cat's required 95% raw protein content. Its reliable flavour and nutrition make it an ideal everyday choice, especially for felines needing weight management.",
        "highlights": ["Ethically raised, free-range Canadian chicken (drug-free, omega-3 fed)", "All-natural ingredients (non-GMO, no additives, preservatives, or fillers)", "Certified human-grade (no by-products, trims, or old meat)", "Prepared fresh and flash-frozen for safe delivery"],
        "ingredients": "95% meat, 3% fruits & veggies, 2% supplements. Free-range chicken muscle meat, chicken heart, and chicken liver with carrots, kelp, flax seeds, fish oil, and brewers yeast.",
        "recipe_breakdown": "95% meat, organs & bone, 3% fruits & veggies, 2% supplements",
        "nutrition_notes": "Complete & balanced to meet AAFCO and NRC recommended nutrient profiles for cats of all life stages. For optimal health, taurine supplements are recommended, as well as oils like fish, salmon, hemp, or krill oil for Omega-3, -6, and -9 fatty acids.",
        "feeding_guide": FEEDING_GUIDE,
        "product_information": PRODUCT_INFO,
        "pricing": [
            {"size_lb": 6, "price": 26.99, "price_per_lb": 4.50, "savings_percent": 0},
            {"size_lb": 12, "price": 51.28, "price_per_lb": 4.27, "savings_percent": 5}
        ],
        "inventory_status": "available"
    },
    {
        "product_id": "rp-beef",
        "product_line": "royal_paws",
        "pet_type": "cat",
        "protein_type": "beef",
        "name": "Royal Beef",
        "mini_description": "Hearty beef protein for active or growing cats.",
        "description": "Royal Paws Beef Dinner provides a rich, protein-dense complete and balanced meal with your cat's required 95% raw protein content. Its hearty flavour and energy support make it ideal for active cats or those needing added strength and condition.",
        "highlights": ["Ethically raised, pasture-raised Canadian beef (drug-free, grass-fed)", "All-natural ingredients (non-GMO, no additives, preservatives, or fillers)", "Certified human-grade (no by-products, trims, or old meat)", "Prepared fresh and flash-frozen for safe delivery"],
        "ingredients": "95% meat, 3% fruits & veggies, 2% supplements. Pasture-raised beef muscle meat, beef heart, and beef liver with carrots, kelp, flax seeds, fish oil, and brewers yeast.",
        "recipe_breakdown": "95% meat, organs & bone, 3% fruits & veggies, 2% supplements",
        "nutrition_notes": "Complete & balanced to meet AAFCO and NRC recommended nutrient profiles for cats of all life stages. Taurine and Omega-rich oils are recommended.",
        "feeding_guide": FEEDING_GUIDE,
        "product_information": PRODUCT_INFO,
        "pricing": [
            {"size_lb": 6, "price": 39.97, "price_per_lb": 6.66, "savings_percent": 0},
            {"size_lb": 12, "price": 75.94, "price_per_lb": 6.33, "savings_percent": 5}
        ],
        "inventory_status": "available"
    },
    {
        "product_id": "rp-duck",
        "product_line": "royal_paws",
        "pet_type": "cat",
        "protein_type": "duck",
        "name": "Royal Duck",
        "mini_description": "Rich duck protein for sensitive or picky cats.",
        "description": "Royal Paws Duck Dinner provides a flavourful, easily digestible complete and balanced meal with your cat's required 95% raw protein content. Its novel profile makes it a strong everyday option for cats with sensitivities or picky appetites.",
        "highlights": ["Ethically raised, free-range Canadian duck (drug-free, omega-3 fed)", "All-natural ingredients (non-GMO, no additives, preservatives, or fillers)", "Certified human-grade (no by-products, trims, or old meat)", "Prepared fresh and flash-frozen for safe delivery"],
        "ingredients": "95% meat, 3% fruits & veggies, 2% supplements. Free-range duck muscle meat, duck heart, and duck liver with carrots, kelp, flax seeds, fish oil, and brewers yeast.",
        "recipe_breakdown": "95% meat, organs & bone, 3% fruits & veggies, 2% supplements",
        "nutrition_notes": "Complete & balanced to meet AAFCO and NRC recommended nutrient profiles for cats of all life stages. Taurine and Omega-rich oils are recommended.",
        "feeding_guide": FEEDING_GUIDE,
        "product_information": PRODUCT_INFO,
        "pricing": [
            {"size_lb": 6, "price": 39.97, "price_per_lb": 6.66, "savings_percent": 0},
            {"size_lb": 12, "price": 75.94, "price_per_lb": 6.33, "savings_percent": 5}
        ],
        "inventory_status": "available"
    },
    {
        "product_id": "rp-turkey",
        "product_line": "royal_paws",
        "pet_type": "cat",
        "protein_type": "turkey",
        "name": "Royal Turkey",
        "mini_description": "Lean turkey protein for gentle digestion and rotation.",
        "description": "Royal Paws Turkey Dinner provides a lean, gentle complete and balanced meal with your cat's required 95% raw protein content. Its clean nutrition makes it well suited for daily feeding, allergy reduction, food sensitivities, and weight-conscious felines.",
        "highlights": ["Ethically raised, free-range Canadian turkey (drug-free, omega-3 fed)", "All-natural ingredients (non-GMO, no additives, preservatives, or fillers)", "Certified human-grade (no by-products, trims, or old meat)", "Prepared fresh and flash-frozen for safe delivery"],
        "ingredients": "95% meat, 3% fruits & veggies, 2% supplements. Free-range turkey muscle meat, turkey heart, and turkey liver with carrots, kelp, flax seeds, fish oil, and brewers yeast.",
        "recipe_breakdown": "95% meat, organs & bone, 3% fruits & veggies, 2% supplements",
        "nutrition_notes": "Complete & balanced to meet AAFCO and NRC recommended nutrient profiles for cats of all life stages. Taurine and Omega-rich oils are recommended.",
        "feeding_guide": FEEDING_GUIDE,
        "product_information": PRODUCT_INFO,
        "pricing": [
            {"size_lb": 6, "price": 39.97, "price_per_lb": 6.66, "savings_percent": 0},
            {"size_lb": 12, "price": 75.94, "price_per_lb": 6.33, "savings_percent": 5}
        ],
        "inventory_status": "available"
    },
    {
        "product_id": "rp-fish",
        "product_line": "royal_paws",
        "pet_type": "cat",
        "protein_type": "fish",
        "name": "Royal Salmon",
        "mini_description": "Omega-rich salmon for skin, coat, and vitality.",
        "description": "Royal Paws Salmon Dinner provides an omega-rich, flavourful complete and balanced meal with your cat's required 95% raw protein content. Its natural fatty acids support skin, coat, and overall vitality making it a great rotational dinner.",
        "highlights": ["Ethically raised, wild-caught Canadian salmon (drug-free)", "All-natural ingredients (non-GMO, no additives, preservatives, or fillers)", "Certified human-grade (no by-products, trims, or old meat)", "Prepared fresh and flash-frozen for safe delivery"],
        "ingredients": "95% meat, 3% fruits & veggies, 2% supplements. Wild-caught salmon muscle meat, fish heart, and fish liver with carrots, kelp, flax seeds, fish oil, and brewers yeast.",
        "recipe_breakdown": "95% meat, organs & bone, 3% fruits & veggies, 2% supplements",
        "nutrition_notes": "Complete & balanced to meet AAFCO and NRC recommended nutrient profiles for cats of all life stages. Taurine and Omega-rich oils are recommended.",
        "feeding_guide": FEEDING_GUIDE,
        "product_information": PRODUCT_INFO,
        "pricing": [
            {"size_lb": 6, "price": 44.95, "price_per_lb": 7.49, "savings_percent": 0},
            {"size_lb": 12, "price": 85.41, "price_per_lb": 7.12, "savings_percent": 5}
        ],
        "inventory_status": "available"
    },
    {
        "product_id": "rp-goat",
        "product_line": "royal_paws",
        "pet_type": "cat",
        "protein_type": "goat",
        "name": "Royal Goat",
        "mini_description": "Light, digestible goat protein for sensitive cats.",
        "description": "Royal Paws Goat Dinner provides a light, highly digestible complete and balanced meal with your cat's required 95% raw protein content. Its novel protein profile makes it suitable for rotational feeding and sensitive cats.",
        "highlights": ["Ethically raised, pasture-raised Canadian goat (drug-free, grass-fed)", "All-natural ingredients (non-GMO, no additives, preservatives, or fillers)", "Certified human-grade (no by-products, trims, or old meat)", "Prepared fresh and flash-frozen for safe delivery"],
        "ingredients": "95% meat, 3% fruits & veggies, 2% supplements. Pasture-raised goat muscle meat, goat heart, and goat liver with carrots, kelp, flax seeds, fish oil, and brewers yeast.",
        "recipe_breakdown": "95% meat, organs & bone, 3% fruits & veggies, 2% supplements",
        "nutrition_notes": "Complete & balanced to meet AAFCO and NRC recommended nutrient profiles for cats of all life stages. Taurine and Omega-rich oils are recommended.",
        "feeding_guide": FEEDING_GUIDE,
        "product_information": PRODUCT_INFO,
        "pricing": [
            {"size_lb": 6, "price": 59.94, "price_per_lb": 9.99, "savings_percent": 0},
            {"size_lb": 12, "price": 113.89, "price_per_lb": 9.49, "savings_percent": 5}
        ],
        "inventory_status": "available"
    },
    {
        "product_id": "rp-lamb",
        "product_line": "royal_paws",
        "pet_type": "cat",
        "protein_type": "lamb",
        "name": "Royal Lamb",
        "mini_description": "Savory lamb protein for energy and coat support.",
        "description": "Royal Paws Lamb Dinner provides a savoury, calorie-dense complete and balanced meal with your cat's required 95% raw protein content. Its rich profile makes it ideal for cats needing a rotational meal that provides extra energy, allergy relief, and weight support.",
        "highlights": ["Ethically raised, pasture-raised Canadian lamb (drug-free, grass-fed)", "All-natural ingredients (non-GMO, no additives, preservatives, or fillers)", "Certified human-grade (no by-products, trims, or old meat)", "Prepared fresh and flash-frozen for safe delivery"],
        "ingredients": "95% meat, 3% fruits & veggies, 2% supplements. Pasture-raised lamb muscle meat, lamb heart, and lamb liver with carrots, kelp, flax seeds, fish oil, and brewers yeast.",
        "recipe_breakdown": "95% meat, organs & bone, 3% fruits & veggies, 2% supplements",
        "nutrition_notes": "Complete & balanced to meet AAFCO and NRC recommended nutrient profiles for cats of all life stages. Taurine and Omega-rich oils are recommended.",
        "feeding_guide": FEEDING_GUIDE,
        "product_information": PRODUCT_INFO,
        "pricing": [
            {"size_lb": 6, "price": 59.94, "price_per_lb": 9.99, "savings_percent": 0},
            {"size_lb": 12, "price": 113.89, "price_per_lb": 9.49, "savings_percent": 5}
        ],
        "inventory_status": "available"
    },
    {
        "product_id": "rp-rabbit",
        "product_line": "royal_paws",
        "pet_type": "cat",
        "protein_type": "rabbit",
        "name": "Royal Rabbit",
        "mini_description": "Lean rabbit protein for food-sensitive or rotational feeding.",
        "description": "Royal Paws Rabbit Dinner provides an ultra-lean complete and balanced meal with your cat's required 95% raw protein content. Its novel protein source makes it ideal for cats with food sensitivities, allergies, or weight management.",
        "highlights": ["Ethically raised, cage-free Canadian rabbit (drug-free, grass-fed)", "All-natural ingredients (non-GMO, no additives, preservatives, or fillers)", "Certified human-grade (no by-products, trims, or old meat)", "Prepared fresh and flash-frozen for safe delivery"],
        "ingredients": "95% meat, 3% fruits & veggies, 2% supplements. Cage-free rabbit muscle meat, rabbit heart, and rabbit liver with carrots, kelp, flax seeds, fish oil, and brewers yeast.",
        "recipe_breakdown": "95% meat, organs & bone, 3% fruits & veggies, 2% supplements",
        "nutrition_notes": "Complete & balanced to meet AAFCO and NRC recommended nutrient profiles for cats of all life stages. Taurine and Omega-rich oils are recommended.",
        "feeding_guide": FEEDING_GUIDE,
        "product_information": PRODUCT_INFO,
        "pricing": [
            {"size_lb": 6, "price": 86.28, "price_per_lb": 14.38, "savings_percent": 0},
            {"size_lb": 12, "price": 163.93, "price_per_lb": 13.66, "savings_percent": 5}
        ],
        "inventory_status": "available"
    }
]

# Dog Treats
TREATS = [
    {
        "treat_id": "treat-turkey-feet",
        "name": "Turkey Feet",
        "pet_type": "dog",
        "price": 10.99,
        "quantity_description": "6 Pack",
        "description": "Free-range Turkey Feet are protein-rich, low-fat, and packed with skin, tendons, bones, muscle, ligaments, and claws. Supports teeth, joints, and digestion.\n• Supervise your dog when feeding any bone treats.\n• Suitable for dogs, cats & puppies\n• Can be fed 3 times per week\n• 100% natural, human-grade",
        "ingredients": "100% turkey feet. No additives, preservatives, or artificial ingredients.",
        "feeding_guide": FEEDING_GUIDE,
        "product_information": PRODUCT_INFO,
        "images": ["https://customer-assets.emergentagent.com/job_site-upload-4/artifacts/b87cuxlx_turkey_feet.png", "https://customer-assets.emergentagent.com/job_site-upload-4/artifacts/j1thh9jz_turkey_feet_image_2.png"]
    },
    {
        "treat_id": "treat-duck-heads",
        "name": "Whole Duck Heads",
        "pet_type": "dog",
        "price": 12.99,
        "quantity_description": "3 Pack",
        "description": "Free-range Canadian Duck Heads provide a natural, nutrient-rich chew. Packed with protein, collagen, and essential vitamins for skin, coat, bones, joints, and gut health. Supports dental health and mental stimulation.\n• Supervise your dog when feeding any bone treats.\n• Suitable for adult dogs, cats, puppies & kittens\n• Can be fed 3 times per week",
        "ingredients": "100% duck heads. No additives, preservatives, or artificial ingredients.",
        "feeding_guide": FEEDING_GUIDE,
        "product_information": PRODUCT_INFO,
        "images": ["https://customer-assets.emergentagent.com/job_site-upload-4/artifacts/k29spzfm_whole_duck_head.png", "https://customer-assets.emergentagent.com/job_site-upload-4/artifacts/p30yi720_Whole_duck_heads_pack.png"]
    },
    {
        "treat_id": "treat-lamb-head-1",
        "name": "Whole Lamb Head",
        "pet_type": "dog",
        "price": 14.99,
        "quantity_description": "1 Pack",
        "description": "Grass-fed Canadian Lamb Heads are a tasty, stimulating natural dog treat. Excellent source of protein and minerals. Perfect as chew or meal replacement.\n• Supervise your dog when feeding any bone treats.\n• For dogs & puppies 12 weeks and older\n• Can be fed 2–3 times per week",
        "ingredients": "100% lamb head. No additives, preservatives, or artificial ingredients.",
        "feeding_guide": FEEDING_GUIDE,
        "product_information": PRODUCT_INFO,
        "images": ["https://customer-assets.emergentagent.com/job_site-upload-4/artifacts/pz4h3l5n_Whole_Lamb_Head.png", "https://customer-assets.emergentagent.com/job_site-upload-4/artifacts/pz4h3l5n_Whole_Lamb_Head.png"]
    },
    {
        "treat_id": "treat-lamb-head-2",
        "name": "Whole Lamb Head",
        "pet_type": "dog",
        "price": 27.99,
        "quantity_description": "2 Pack",
        "description": "Grass-fed Canadian Lamb Heads are a tasty, stimulating natural dog treat. Excellent source of protein and minerals. Perfect as chew or meal replacement.\n• Supervise your dog when feeding any bone treats.\n• For dogs & puppies 12 weeks and older\n• Can be fed 2–3 times per week",
        "ingredients": "100% lamb head. No additives, preservatives, or artificial ingredients.",
        "feeding_guide": FEEDING_GUIDE,
        "product_information": PRODUCT_INFO,
        "images": ["https://customer-assets.emergentagent.com/job_site-upload-4/artifacts/pz4h3l5n_Whole_Lamb_Head.png", "https://customer-assets.emergentagent.com/job_site-upload-4/artifacts/pz4h3l5n_Whole_Lamb_Head.png"]
    },
    {
        "treat_id": "treat-beef-rib",
        "name": "Beef Flat Rib Bones",
        "pet_type": "dog",
        "price": 11.99,
        "quantity_description": "2-3 Ribs",
        "description": "Pasture-raised beef flat ribs are meaty chews perfect for dental hygiene, mental stimulation, or meal replacement.\n• Supervise your dog when feeding any bone treats.\n• Suitable for dogs & puppies\n• Can be fed 2–3 times per week",
        "ingredients": "100% beef rib bones. No additives, preservatives, or artificial ingredients.",
        "feeding_guide": FEEDING_GUIDE,
        "product_information": PRODUCT_INFO,
        "images": ["https://customer-assets.emergentagent.com/job_site-upload-4/artifacts/8rjroort_beef_rib_bones.png", "https://customer-assets.emergentagent.com/job_site-upload-4/artifacts/5x1gimfh_Beef_rib_bone_pack.png"]
    },
    {
        "treat_id": "treat-chicken-carcass",
        "name": "Chicken Carcass",
        "pet_type": "dog",
        "price": 24.99,
        "quantity_description": "2 Pack (4-5 lb each)",
        "description": "This pair of raw Chicken Carcasses averages around 4–5 lb each, giving you great value and top-notch quality for a natural dog treat.\nContains Omega-3-rich, farm-fresh, free-range Canadian chicken carcass with organ meat. A natural source of calcium, while organs provide essential vitamins & minerals.\n• Supervise your pet when feeding any bone treats.\n• Suitable for dogs of all life stages and adult cats\n• Can be fed 3 times per week",
        "ingredients": "100% chicken carcass with organ meat. No additives, preservatives, or artificial ingredients.",
        "feeding_guide": FEEDING_GUIDE,
        "product_information": PRODUCT_INFO,
        "images": ["https://customer-assets.emergentagent.com/job_site-upload-4/artifacts/g30fkeau_chicken_carcass.png", "https://customer-assets.emergentagent.com/job_site-upload-4/artifacts/g30fkeau_chicken_carcass.png"]
    },
    {
        "treat_id": "treat-chicken-necks-2lb",
        "name": "Whole Chicken Necks",
        "pet_type": "dog",
        "price": 11.99,
        "quantity_description": "2 lb Pack",
        "description": "Free-range Canadian Chicken Necks are a tasty raw chew for treats, toppers, mental stimulation, or meal replacement. High in protein and easily digestible.\n• Supervise your dog when feeding any bone treats.\n• Suitable for adult dogs, cats, puppies & kittens\n• Can be fed 3 times per week",
        "ingredients": "100% chicken necks. No additives, preservatives, or artificial ingredients.",
        "feeding_guide": FEEDING_GUIDE,
        "product_information": PRODUCT_INFO,
        "images": ["https://customer-assets.emergentagent.com/job_site-upload-4/artifacts/l5aevbnx_chicken_necks.png", "https://customer-assets.emergentagent.com/job_site-upload-4/artifacts/l5aevbnx_chicken_necks.png"]
    },
    {
        "treat_id": "treat-chicken-necks-5lb",
        "name": "Whole Chicken Necks",
        "pet_type": "dog",
        "price": 24.99,
        "quantity_description": "5 lb Pack",
        "description": "Free-range Canadian Chicken Necks are a tasty raw chew for treats, toppers, mental stimulation, or meal replacement. High in protein and easily digestible.\n• Supervise your dog when feeding any bone treats.\n• Suitable for adult dogs, cats, puppies & kittens\n• Can be fed 3 times per week",
        "ingredients": "100% chicken necks. No additives, preservatives, or artificial ingredients.",
        "feeding_guide": FEEDING_GUIDE,
        "product_information": PRODUCT_INFO,
        "images": ["https://customer-assets.emergentagent.com/job_site-upload-4/artifacts/l5aevbnx_chicken_necks.png", "https://customer-assets.emergentagent.com/job_site-upload-4/artifacts/l5aevbnx_chicken_necks.png"]
    },
    {
        "treat_id": "treat-duck-feet",
        "name": "Duck Feet",
        "pet_type": "dog",
        "price": 9.99,
        "quantity_description": "6 Pack",
        "description": "Free-range Canadian Duck Feet provide a crunchy Omega-3 snack. Natural glucosamine and chondroitin support joint and muscle health. Protein-packed with no fillers.\n• Supervise your dog when feeding any bone treats.\n• Suitable for adult dogs, adult cats & puppies\n• Can be fed 3 times per week",
        "ingredients": "100% duck feet. No additives, preservatives, or artificial ingredients.",
        "feeding_guide": FEEDING_GUIDE,
        "product_information": PRODUCT_INFO,
        "images": ["https://customer-assets.emergentagent.com/job_site-upload-4/artifacts/9tv7a0mh_DuckFeet.png", "https://customer-assets.emergentagent.com/job_site-upload-4/artifacts/9tv7a0mh_DuckFeet.png"]
    },
    {
        "treat_id": "treat-beef-neck",
        "name": "Beef Neck Bones",
        "pet_type": "dog",
        "price": 13.99,
        "quantity_description": "2-3 Bones",
        "description": "Pasture-raised Canadian Beef Neck Bones are packed with protein and essential fatty acids. Helps keep teeth plaque-free.\n• Supervise your dog when feeding any bone treats.\n• Suitable for dogs, puppies, cats & kittens\n• Can be fed 3 times per week",
        "ingredients": "100% beef neck bones. No additives, preservatives, or artificial ingredients.",
        "feeding_guide": FEEDING_GUIDE,
        "product_information": PRODUCT_INFO,
        "images": ["https://customer-assets.emergentagent.com/job_site-upload-4/artifacts/9z16u3bs_beef_neck_bones.png", "https://customer-assets.emergentagent.com/job_site-upload-4/artifacts/9z16u3bs_beef_neck_bones.png"]
    },
    {
        "treat_id": "treat-chicken-heads",
        "name": "Whole Chicken Heads",
        "pet_type": "dog",
        "price": 8.99,
        "quantity_description": "4 Pack",
        "description": "Free-range Canadian raw Whole Chicken Heads make a meaty & crunchy snack. Packed with vitamins, minerals, and collagen for healthy skin, coat, bones, joints, and digestive health. Supports dental health.\n• Supervise your pet when feeding any bone treats.\n• Suitable for dogs, puppies, cats & kittens\n• Can be fed 3 times per week",
        "ingredients": "100% chicken heads. No additives, preservatives, or artificial ingredients.",
        "feeding_guide": FEEDING_GUIDE,
        "product_information": PRODUCT_INFO,
        "images": ["https://customer-assets.emergentagent.com/job_site-upload-4/artifacts/j9h9vmdh_chicken%20head.png", "https://customer-assets.emergentagent.com/job_site-upload-4/artifacts/j9h9vmdh_chicken%20head.png"]
    },
    {
        "treat_id": "treat-beef-marrow",
        "name": "Beef Marrow Bones",
        "pet_type": "dog",
        "price": 12.99,
        "quantity_description": "2-3 Bones",
        "description": "Pasture-raised Beef Bone Marrow is a natural dog chew. Important source of calcium, helps clean teeth, and provides relaxation.\n• Supervise your dog when feeding any bone treats.\n• Suitable for dogs & puppies\n• Can be fed 3 times per week",
        "ingredients": "100% beef marrow bones. No additives, preservatives, or artificial ingredients.",
        "feeding_guide": FEEDING_GUIDE,
        "product_information": PRODUCT_INFO,
        "images": ["https://customer-assets.emergentagent.com/job_site-upload-4/artifacts/qr11w1lx_beef_marrow_bone.png", "https://customer-assets.emergentagent.com/job_site-upload-4/artifacts/xzj3om55_beef_marrow_image_2.png"]
    }
]

# Cat Treats
CAT_TREATS = [
    {
        "treat_id": "treat-cat-chicken-heads",
        "name": "Whole Chicken Heads",
        "pet_type": "cat",
        "price": 8.99,
        "quantity_description": "4 Pack",
        "description": "Free-range Canadian raw Whole Chicken Heads make a meaty & crunchy snack. Packed with vitamins, minerals, and collagen for healthy skin, coat, bones, joints, and digestive health. Supports dental health.\n• Supervise your pet when feeding any bone treats.\n• Suitable for dogs, puppies, cats & kittens\n• Can be fed 3 times per week",
        "ingredients": "100% chicken heads. No additives, preservatives, or artificial ingredients.",
        "feeding_guide": FEEDING_GUIDE,
        "product_information": PRODUCT_INFO,
        "images": ["https://customer-assets.emergentagent.com/job_site-upload-4/artifacts/j9h9vmdh_chicken%20head.png", "https://customer-assets.emergentagent.com/job_site-upload-4/artifacts/j9h9vmdh_chicken%20head.png"]
    },
    {
        "treat_id": "treat-cat-chicken-necks",
        "name": "Whole Chicken Necks Pack",
        "pet_type": "cat",
        "price": 6.99,
        "quantity_description": "8 oz",
        "description": "Free-range Canadian Chicken Necks are a tasty raw chew for treats, toppers, mental stimulation, or meal replacement. High in protein and easily digestible.\n• Supervise your dog when feeding any bone treats.\n• Suitable for adult dogs, cats, puppies & kittens\n• Can be fed 3 times per week",
        "ingredients": "100% chicken necks. No additives, preservatives, or artificial ingredients.",
        "feeding_guide": FEEDING_GUIDE,
        "product_information": PRODUCT_INFO,
        "images": ["https://customer-assets.emergentagent.com/job_site-upload-4/artifacts/l5aevbnx_chicken_necks.png", "https://customer-assets.emergentagent.com/job_site-upload-4/artifacts/l5aevbnx_chicken_necks.png"]
    },
    {
        "treat_id": "treat-cat-chicken-feet",
        "name": "Chicken Feet",
        "pet_type": "cat",
        "price": 5.99,
        "quantity_description": "6 Pack",
        "description": "Ontario fresh, free-range Chicken Feet are crunchy treats with natural proteins, calcium, phosphorus, and amino acids. Great as a treat, meal replacement, or topper.\n• Supervise your dog when feeding any bone treats.\n• Suitable for dogs, cats, puppies & kittens\n• Can be fed 3 times per week",
        "ingredients": "100% chicken feet. No additives, preservatives, or artificial ingredients.",
        "feeding_guide": FEEDING_GUIDE,
        "product_information": PRODUCT_INFO,
        "images": ["https://customer-assets.emergentagent.com/job_site-upload-4/artifacts/g30fkeau_chicken_carcass.png"]
    },
    {
        "treat_id": "treat-cat-duck-heads",
        "name": "Whole Duck Heads",
        "pet_type": "cat",
        "price": 10.99,
        "quantity_description": "3 Pack",
        "description": "Free-range Canadian Duck Heads provide a natural, nutrient-rich chew. Packed with protein, collagen, and essential vitamins for skin, coat, bones, joints, and gut health. Supports dental health and mental stimulation.\n• Supervise your dog when feeding any bone treats.\n• Suitable for adult dogs, cats, puppies & kittens\n• Can be fed 3 times per week",
        "ingredients": "100% duck heads. No additives, preservatives, or artificial ingredients.",
        "feeding_guide": FEEDING_GUIDE,
        "product_information": PRODUCT_INFO,
        "images": ["https://customer-assets.emergentagent.com/job_site-upload-4/artifacts/k29spzfm_whole_duck_head.png", "https://customer-assets.emergentagent.com/job_site-upload-4/artifacts/p30yi720_Whole_duck_heads_pack.png"]
    },
    {
        "treat_id": "treat-cat-duck-feet",
        "name": "Duck Feet",
        "pet_type": "cat",
        "price": 7.99,
        "quantity_description": "6 Pack",
        "description": "Free-range Canadian Duck Feet provide a crunchy Omega-3 snack. Natural glucosamine and chondroitin support joint and muscle health. Protein-packed with no fillers.\n• Supervise your dog when feeding any bone treats.\n• Suitable for adult dogs, adult cats & puppies\n• Can be fed 3 times per week",
        "ingredients": "100% duck feet. No additives, preservatives, or artificial ingredients.",
        "feeding_guide": FEEDING_GUIDE,
        "product_information": PRODUCT_INFO,
        "images": ["https://customer-assets.emergentagent.com/job_site-upload-4/artifacts/9tv7a0mh_DuckFeet.png", "https://customer-assets.emergentagent.com/job_site-upload-4/artifacts/9tv7a0mh_DuckFeet.png"]
    }
]

# Combined lists for export
ALL_PRODUCTS = COMFORT_DINNER_PRODUCTS + PRIMAL_FEAST_PRODUCTS + ROYAL_PAWS_PRODUCTS
ALL_TREATS = TREATS + CAT_TREATS
