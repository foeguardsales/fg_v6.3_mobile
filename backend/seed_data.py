# Base ingredients for each protein
BASE_INGREDIENTS = {
    "chicken": [
        "Ground chicken with bone",
        "Chicken liver",
        "Chicken heart",
        "Organic kale",
        "Organic spinach",
        "Organic carrots",
        "Wild blueberries",
        "Kelp powder",
        "Fish oil (omega-3)"
    ],
    "beef": [
        "Grass-fed ground beef",
        "Beef liver",
        "Beef kidney",
        "Beef heart",
        "Organic broccoli",
        "Organic sweet potato",
        "Pumpkin",
        "Kelp powder",
        "Fish oil (omega-3)"
    ],
    "duck": [
        "Ground duck with bone",
        "Duck liver",
        "Duck heart",
        "Organic chard",
        "Organic celery",
        "Cranberries",
        "Kelp powder",
        "Fish oil (omega-3)"
    ],
    "fish": [
        "Wild-caught salmon",
        "Wild-caught mackerel",
        "Salmon oil",
        "Organic green beans",
        "Organic zucchini",
        "Organic berries",
        "Kelp powder"
    ],
    "goat": [
        "Ground goat meat",
        "Goat liver",
        "Goat heart",
        "Organic kale",
        "Organic carrots",
        "Organic apples",
        "Kelp powder",
        "Fish oil (omega-3)"
    ],
    "lamb": [
        "Ground lamb",
        "Lamb liver",
        "Lamb kidney",
        "Organic spinach",
        "Organic pumpkin",
        "Blueberries",
        "Kelp powder",
        "Fish oil (omega-3)"
    ],
    "rabbit": [
        "Ground rabbit with bone",
        "Rabbit liver",
        "Rabbit heart",
        "Organic kale",
        "Organic carrots",
        "Cranberries",
        "Kelp powder",
        "Fish oil (omega-3)"
    ],
    "turkey": [
        "Ground turkey with bone",
        "Turkey liver",
        "Turkey heart",
        "Organic sweet potato",
        "Organic green beans",
        "Blueberries",
        "Kelp powder",
        "Fish oil (omega-3)"
    ]
}

NUTRITION_FACTS = {
    "chicken": {
        "protein": "18%",
        "fat": "12%",
        "fiber": "2%",
        "moisture": "68%",
        "calories": "150 kcal per 100g"
    },
    "beef": {
        "protein": "20%",
        "fat": "15%",
        "fiber": "2%",
        "moisture": "65%",
        "calories": "180 kcal per 100g"
    },
    "duck": {
        "protein": "19%",
        "fat": "16%",
        "fiber": "2%",
        "moisture": "64%",
        "calories": "190 kcal per 100g"
    },
    "fish": {
        "protein": "22%",
        "fat": "14%",
        "fiber": "1.5%",
        "moisture": "66%",
        "calories": "170 kcal per 100g"
    },
    "goat": {
        "protein": "21%",
        "fat": "13%",
        "fiber": "2%",
        "moisture": "67%",
        "calories": "165 kcal per 100g"
    },
    "lamb": {
        "protein": "20%",
        "fat": "17%",
        "fiber": "2%",
        "moisture": "64%",
        "calories": "195 kcal per 100g"
    },
    "rabbit": {
        "protein": "23%",
        "fat": "11%",
        "fiber": "2%",
        "moisture": "68%",
        "calories": "155 kcal per 100g"
    },
    "turkey": {
        "protein": "19%",
        "fat": "12%",
        "fiber": "2%",
        "moisture": "68%",
        "calories": "150 kcal per 100g"
    }
}

HOW_TO_USE = {
    "comfort_dinner": "Thaw in refrigerator for 24 hours. Serve at room temperature. Feed 2-3% of your dog's body weight daily, divided into two meals. Adjust portions based on activity level and weight goals. Store frozen until ready to use. Once thawed, use within 3-4 days.",
    "primal_feast": "Thaw in refrigerator for 24 hours. Serve at room temperature or slightly warmed. Feed 2-3% of your dog's body weight daily, split into two meals. Monitor your pet's condition and adjust as needed. Keep frozen until use. Refrigerate after thawing and use within 3-4 days."
}

# Standard feeding guides and product info for products
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

COMFORT_DINNER_PRODUCTS = [
    {
        "product_id": "cd-chicken",
        "product_line": "comfort_dinner",
        "protein_type": "chicken",
        "name": "Comfort Chicken",
        "mini_description": "Provides a light meal that supports digestion and everyday vitality for dogs of all life stages.",
        "description": "Farm-fresh chicken, perfect for sensitive stomachs. Our Comfort Dinner line is gently prepared to support digestive health while providing complete, balanced nutrition. Ideal for dogs transitioning to raw or those with food sensitivities.",
        "ingredients": BASE_INGREDIENTS["chicken"],
        "nutrition_facts": NUTRITION_FACTS["chicken"],
        "how_to_use": HOW_TO_USE["comfort_dinner"],
        "feeding_guide": PRODUCT_FEEDING_GUIDE,
        "product_information": PRODUCT_INFORMATION,
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
        "mini_description": "Grass-fed Ontario beef rich in iron and B vitamins, supporting muscle development and sustained energy.",
        "description": "Grass-fed Ontario beef, rich in nutrients. Packed with iron and B vitamins, our beef formula supports muscle development and energy. Sourced from local farms committed to sustainable practices.",
        "ingredients": BASE_INGREDIENTS["beef"],
        "nutrition_facts": NUTRITION_FACTS["beef"],
        "how_to_use": HOW_TO_USE["comfort_dinner"],
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
        "mini_description": "A novel protein rich in iron and selenium, ideal for dogs with common protein sensitivities.",
        "description": "Premium duck, great for food sensitivities. Duck is naturally rich in iron and selenium, supporting immune health. A novel protein option for dogs with common protein allergies.",
        "ingredients": BASE_INGREDIENTS["duck"],
        "nutrition_facts": NUTRITION_FACTS["duck"],
        "how_to_use": HOW_TO_USE["comfort_dinner"],
        "pricing": [
            {"size_lb": 6, "price": 39.97, "price_per_lb": 6.66, "savings_percent": 0},
            {"size_lb": 12, "price": 69.97, "price_per_lb": 5.83, "savings_percent": 12},
            {"size_lb": 18, "price": 113.91, "price_per_lb": 6.33, "savings_percent": 5},
            {"size_lb": 24, "price": 143.88, "price_per_lb": 5.995, "savings_percent": 10}
        ],
        "inventory_status": "available"
    },
    {
        "product_id": "cd-fish",
        "product_line": "comfort_dinner",
        "protein_type": "fish",
        "name": "Comfort Fish",
        "mini_description": "Wild-caught fish rich in omega-3s, supporting healthy skin, coat, and cognitive function.",
        "description": "Wild-caught fish, omega-3 rich. Supports healthy skin, coat, and cognitive function. Sustainably sourced from cold Canadian waters for maximum freshness and nutritional value.",
        "ingredients": BASE_INGREDIENTS["fish"],
        "nutrition_facts": NUTRITION_FACTS["fish"],
        "how_to_use": HOW_TO_USE["comfort_dinner"],
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
        "mini_description": "Lean and highly digestible, excellent for dogs with allergies or weight management needs.",
        "description": "Lean goat protein, novel protein option. Highly digestible and lower in fat than traditional proteins. Excellent for dogs with allergies or weight management needs.",
        "ingredients": BASE_INGREDIENTS["goat"],
        "nutrition_facts": NUTRITION_FACTS["goat"],
        "how_to_use": HOW_TO_USE["comfort_dinner"],
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
        "mini_description": "Grass-fed lamb rich in zinc and B vitamins, supporting immune function and metabolism.",
        "description": "Premium lamb, highly digestible. Rich in zinc and B vitamins, supporting immune function and metabolism. Grass-fed for superior flavor and nutrition.",
        "ingredients": BASE_INGREDIENTS["lamb"],
        "nutrition_facts": NUTRITION_FACTS["lamb"],
        "how_to_use": HOW_TO_USE["comfort_dinner"],
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
        "mini_description": "One of the leanest proteins available, perfect for elimination diets. High in B12 and selenium.",
        "description": "Exotic rabbit protein, hypoallergenic. One of the leanest proteins available, perfect for elimination diets. High in B12 and selenium for optimal health.",
        "ingredients": BASE_INGREDIENTS["rabbit"],
        "nutrition_facts": NUTRITION_FACTS["rabbit"],
        "how_to_use": HOW_TO_USE["comfort_dinner"],
        "pricing": [
            {"size_lb": 6, "price": 86.28, "price_per_lb": 14.38, "savings_percent": 0},
            {"size_lb": 12, "price": 155.30, "price_per_lb": 12.94, "savings_percent": 10},
            {"size_lb": 18, "price": 246.04, "price_per_lb": 13.67, "savings_percent": 5},
            {"size_lb": 24, "price": 310.27, "price_per_lb": 12.93, "savings_percent": 10}
        ],
        "inventory_status": "available"
    },
    {
        "product_id": "cd-turkey",
        "product_line": "comfort_dinner",
        "protein_type": "turkey",
        "name": "Comfort Turkey",
        "mini_description": "High in protein and low in fat, ideal for maintaining healthy weight with calm, sustained energy.",
        "description": "Lean turkey, low-fat option. High in protein and low in fat, ideal for maintaining healthy weight. Rich in tryptophan for calm, balanced energy.",
        "ingredients": BASE_INGREDIENTS["turkey"],
        "nutrition_facts": NUTRITION_FACTS["turkey"],
        "how_to_use": HOW_TO_USE["comfort_dinner"],
        "pricing": [
            {"size_lb": 6, "price": 39.97, "price_per_lb": 6.66, "savings_percent": 0},
            {"size_lb": 12, "price": 69.94, "price_per_lb": 5.83, "savings_percent": 13},
            {"size_lb": 18, "price": 113.91, "price_per_lb": 6.33, "savings_percent": 5},
            {"size_lb": 24, "price": 143.86, "price_per_lb": 5.99, "savings_percent": 10}
        ],
        "inventory_status": "available"
    }
]

PRIMAL_FEAST_PRODUCTS = [
    {
        "product_id": "pf-chicken",
        "product_line": "primal_feast",
        "protein_type": "chicken",
        "name": "Primal Chicken",
        "mini_description": "Species-appropriate raw nutrition with maximum nutrient retention through minimal processing.",
        "description": "Raw chicken feast, species-appropriate nutrition. Our Primal Feast line delivers raw, biologically appropriate meals that mirror what carnivores eat in nature. Maximum nutrient retention through minimal processing.",
        "ingredients": BASE_INGREDIENTS["chicken"],
        "nutrition_facts": NUTRITION_FACTS["chicken"],
        "how_to_use": HOW_TO_USE["primal_feast"],
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
        "mini_description": "Muscle meat, organ meats, and ground bone provide a rich, satisfying flavor dogs instinctively crave.",
        "description": "Raw beef, protein-packed. Muscle meat, organ meats, and ground bone provide complete nutrition. Rich, satisfying flavor dogs instinctively crave.",
        "ingredients": BASE_INGREDIENTS["beef"],
        "nutrition_facts": NUTRITION_FACTS["beef"],
        "how_to_use": HOW_TO_USE["primal_feast"],
        "pricing": [
            {"size_lb": 6, "price": 39.97, "price_per_lb": 6.66, "savings_percent": 0},
            {"size_lb": 12, "price": 69.97, "price_per_lb": 5.83, "savings_percent": 12},
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
        "mini_description": "Natural fatty acids support skin and coat health with wild game nutrition for the domestic dog.",
        "description": "Raw duck, rich flavor. Naturally fatty acids support skin and coat health. Wild game nutrition for the domestic dog.",
        "ingredients": BASE_INGREDIENTS["duck"],
        "nutrition_facts": NUTRITION_FACTS["duck"],
        "how_to_use": HOW_TO_USE["primal_feast"],
        "pricing": [
            {"size_lb": 6, "price": 39.97, "price_per_lb": 6.66, "savings_percent": 0},
            {"size_lb": 12, "price": 69.97, "price_per_lb": 5.83, "savings_percent": 12},
            {"size_lb": 18, "price": 113.91, "price_per_lb": 6.33, "savings_percent": 5},
            {"size_lb": 24, "price": 143.88, "price_per_lb": 5.995, "savings_percent": 10}
        ],
        "inventory_status": "available"
    },
    {
        "product_id": "pf-fish",
        "product_line": "primal_feast",
        "protein_type": "fish",
        "name": "Primal Fish",
        "mini_description": "Cold-water fish provide EPA and DHA for brain and heart health from a clean, sustainable source.",
        "description": "Raw fish, omega-rich. Cold-water fish provide EPA and DHA for brain and heart health. Clean, sustainable protein source.",
        "ingredients": BASE_INGREDIENTS["fish"],
        "nutrition_facts": NUTRITION_FACTS["fish"],
        "how_to_use": HOW_TO_USE["primal_feast"],
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
        "mini_description": "Lean and easily digestible with a unique flavor profile, perfect for sensitive systems.",
        "description": "Raw goat, novel protein. Lean and easily digestible, perfect for sensitive systems. Unique flavor profile for variety.",
        "ingredients": BASE_INGREDIENTS["goat"],
        "nutrition_facts": NUTRITION_FACTS["goat"],
        "how_to_use": HOW_TO_USE["primal_feast"],
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
        "mini_description": "Grass-fed lamb delivers CLA and omega-3s with a rich taste and amino acid profile.",
        "description": "Raw lamb, premium quality. Grass-fed lamb delivers CLA and omega-3s. Rich taste and complete amino acid profile.",
        "ingredients": BASE_INGREDIENTS["lamb"],
        "nutrition_facts": NUTRITION_FACTS["lamb"],
        "how_to_use": HOW_TO_USE["primal_feast"],
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
        "mini_description": "Ultra-lean protein for weight management, naturally hypoallergenic and highly digestible.",
        "description": "Raw rabbit, exotic choice. Ultra-lean protein for weight management. Naturally hypoallergenic and highly digestible.",
        "ingredients": BASE_INGREDIENTS["rabbit"],
        "nutrition_facts": NUTRITION_FACTS["rabbit"],
        "how_to_use": HOW_TO_USE["primal_feast"],
        "pricing": [
            {"size_lb": 6, "price": 86.28, "price_per_lb": 14.38, "savings_percent": 0},
            {"size_lb": 12, "price": 155.30, "price_per_lb": 12.94, "savings_percent": 10},
            {"size_lb": 18, "price": 246.04, "price_per_lb": 13.67, "savings_percent": 5},
            {"size_lb": 24, "price": 310.27, "price_per_lb": 12.93, "savings_percent": 10}
        ],
        "inventory_status": "available"
    },
    {
        "product_id": "pf-turkey",
        "product_line": "primal_feast",
        "protein_type": "turkey",
        "name": "Primal Turkey",
        "mini_description": "Low-fat, high-protein option for active dogs with organ meats and bone for nutrition.",
        "description": "Raw turkey, lean protein. Low-fat, high-protein option for active dogs. Complete with organ meats and bone for balanced nutrition.",
        "ingredients": BASE_INGREDIENTS["turkey"],
        "nutrition_facts": NUTRITION_FACTS["turkey"],
        "how_to_use": HOW_TO_USE["primal_feast"],
        "pricing": [
            {"size_lb": 6, "price": 39.97, "price_per_lb": 6.66, "savings_percent": 0},
            {"size_lb": 12, "price": 69.94, "price_per_lb": 5.83, "savings_percent": 13},
            {"size_lb": 18, "price": 113.91, "price_per_lb": 6.33, "savings_percent": 5},
            {"size_lb": 24, "price": 143.86, "price_per_lb": 5.99, "savings_percent": 10}
        ],
        "inventory_status": "available"
    }
]

# Standard feeding guides for treats
TREAT_FEEDING_GUIDE = {
    "feeding": "Feed as a treat, meal topper, or for enrichment. Always supervise your pet while enjoying treats. Suitable for dogs of all sizes. Start with smaller portions for first-time feeders.",
    "handling": "Keep frozen until ready to use. Thaw in refrigerator before serving (4-6 hours). Once thawed, use within 3-4 days. Always handle with clean hands and clean surfaces."
}

TREAT_PRODUCT_INFO = """Our treats are sourced from trusted family farms and processed in USDA-inspected facilities. Each treat is individually flash-frozen to lock in freshness and nutrients. No artificial preservatives, colors, or flavors added. 

Perfect for:
• Training and rewards
• Dental health and natural chewing
• Mental stimulation and enrichment  
• Supporting jaw strength and clean teeth

Always supervise your pet when feeding treats. Not suitable for puppies under 12 weeks old."""

TREATS = [
    {
        "treat_id": "treat-turkey-feet", 
        "name": "Turkey Feet", 
        "price": 9.99, 
        "quantity_description": "2 Pack", 
        "pet_type": "dog",
        "description": "Whole raw turkey feet naturally rich in glucosamine and chondroitin to support joint health. These natural treats provide hours of chewing satisfaction while promoting dental health through mechanical cleaning action. Perfect for dogs who love to chew and crunch.",
        "ingredients": "100% turkey feet. No additives, preservatives, or artificial ingredients.",
        "feeding_guide": TREAT_FEEDING_GUIDE,
        "product_information": TREAT_PRODUCT_INFO,
        "image": "https://customer-assets.emergentagent.com/job_file-access-17/artifacts/sj79kpoz_turkey_feet.png",
        "images": [
            "https://customer-assets.emergentagent.com/job_file-access-17/artifacts/sj79kpoz_turkey_feet.png",
            "https://customer-assets.emergentagent.com/job_file-access-17/artifacts/bbbktuws_turkey_feet_image_2.png"
        ]
    },
    {
        "treat_id": "treat-duck-heads", 
        "name": "Whole Duck Heads", 
        "price": 9.99, 
        "quantity_description": "5 Pack", 
        "pet_type": "dog",
        "description": "Whole duck heads offer a complete, nutrient-dense chewing experience. Rich in natural fats, protein, and essential nutrients including brain matter which provides omega-3 fatty acids. The crunchy texture helps clean teeth naturally while providing mental enrichment.",
        "ingredients": "100% whole duck heads. No additives, preservatives, or artificial ingredients.",
        "feeding_guide": TREAT_FEEDING_GUIDE,
        "product_information": TREAT_PRODUCT_INFO,
        "image": "https://customer-assets.emergentagent.com/job_file-access-17/artifacts/68isxfvj_whole_duck_head.png",
        "images": [
            "https://customer-assets.emergentagent.com/job_file-access-17/artifacts/68isxfvj_whole_duck_head.png",
            "https://customer-assets.emergentagent.com/job_file-access-17/artifacts/csqdjqs3_Whole_duck_heads_pack.png"
        ]
    },
    {
        "treat_id": "treat-lamb-head-1", 
        "name": "Whole Lamb Head", 
        "price": 12.99, 
        "quantity_description": "1 Pack", 
        "pet_type": "dog",
        "description": "Premium whole lamb head provides the ultimate whole prey feeding experience. Packed with nutrient-dense organs, brain matter, and bone content. This treat offers complete nutrition, mental stimulation, and hours of satisfying chewing. Ideal for medium to large dogs.",
        "ingredients": "100% whole lamb head. No additives, preservatives, or artificial ingredients.",
        "feeding_guide": TREAT_FEEDING_GUIDE,
        "product_information": TREAT_PRODUCT_INFO,
        "image": "https://customer-assets.emergentagent.com/job_file-access-17/artifacts/xt4j406k_Whole_Lamb_Head.png",
        "images": [
            "https://customer-assets.emergentagent.com/job_file-access-17/artifacts/xt4j406k_Whole_Lamb_Head.png"
        ]
    },
    {
        "treat_id": "treat-lamb-head-2", 
        "name": "Whole Lamb Head", 
        "price": 19.99, 
        "quantity_description": "2 Pack", 
        "pet_type": "dog",
        "description": "Premium whole lamb heads (2-pack) provide the ultimate whole prey feeding experience. Packed with nutrient-dense organs, brain matter, and bone content. These treats offer complete nutrition, mental stimulation, and hours of satisfying chewing. Ideal for medium to large dogs or multi-dog households.",
        "ingredients": "100% whole lamb heads. No additives, preservatives, or artificial ingredients.",
        "feeding_guide": TREAT_FEEDING_GUIDE,
        "product_information": TREAT_PRODUCT_INFO,
        "image": "https://customer-assets.emergentagent.com/job_file-access-17/artifacts/xt4j406k_Whole_Lamb_Head.png",
        "images": [
            "https://customer-assets.emergentagent.com/job_file-access-17/artifacts/xt4j406k_Whole_Lamb_Head.png"
        ]
    },
    {
        "treat_id": "treat-beef-rib", 
        "name": "Beef Flat Rib Bones", 
        "price": 9.99, 
        "quantity_description": "1lb", 
        "pet_type": "dog",
        "description": "Meaty beef flat rib bones perfect for recreational chewing. These bones feature tender meat still attached to the rib, providing both nutrition and dental benefits. The flat shape makes them easier to hold and chew. Excellent for aggressive chewers who need a durable, long-lasting option.",
        "ingredients": "100% beef rib bones. No additives, preservatives, or artificial ingredients.",
        "feeding_guide": TREAT_FEEDING_GUIDE,
        "product_information": TREAT_PRODUCT_INFO,
        "image": "https://customer-assets.emergentagent.com/job_file-access-17/artifacts/as9igo6v_beef_rib_bones.png",
        "images": [
            "https://customer-assets.emergentagent.com/job_file-access-17/artifacts/as9igo6v_beef_rib_bones.png",
            "https://customer-assets.emergentagent.com/job_file-access-17/artifacts/nsrwf34s_Beef_rib_bone_pack.png"
        ]
    },
    {
        "treat_id": "treat-chicken-carcass", 
        "name": "Chicken Carcass", 
        "price": 24.99, 
        "quantity_description": "2 Pack", 
        "pet_type": "dog",
        "description": "Whole chicken carcass provides complete whole prey nutrition with bones, cartilage, and remaining meat. Perfect for larger dogs or as a complete meal replacement. Offers hours of enrichment while delivering balanced nutrition from multiple parts of the animal.",
        "ingredients": "100% whole chicken carcass. No additives, preservatives, or artificial ingredients.",
        "feeding_guide": TREAT_FEEDING_GUIDE,
        "product_information": TREAT_PRODUCT_INFO,
        "image": "https://customer-assets.emergentagent.com/job_file-access-17/artifacts/p5wb6yow_chicken_carcass.png",
        "images": [
            "https://customer-assets.emergentagent.com/job_file-access-17/artifacts/p5wb6yow_chicken_carcass.png"
        ]
    },
    {
        "treat_id": "treat-chicken-necks-2lb", 
        "name": "Whole Chicken Necks", 
        "price": 8.99, 
        "quantity_description": "2lb", 
        "pet_type": "dog",
        "description": "Whole chicken necks are a customer favorite! These meaty, bone-in treats are perfect for dogs of all sizes. High in glucosamine and chondroitin for joint support, with the perfect ratio of meat to bone. Easily digestible and great for daily feeding or as a crunchy treat.",
        "ingredients": "100% chicken necks. No additives, preservatives, or artificial ingredients.",
        "feeding_guide": TREAT_FEEDING_GUIDE,
        "product_information": TREAT_PRODUCT_INFO,
        "image": "https://customer-assets.emergentagent.com/job_file-access-17/artifacts/ev805vwe_chicken_necks.png",
        "images": [
            "https://customer-assets.emergentagent.com/job_file-access-17/artifacts/ev805vwe_chicken_necks.png"
        ]
    },
    {
        "treat_id": "treat-chicken-necks-5lb", 
        "name": "Whole Chicken Necks", 
        "price": 19.99, 
        "quantity_description": "5lb", 
        "pet_type": "dog",
        "description": "Bulk pack of whole chicken necks perfect for multi-dog households or frequent feeders. These meaty, bone-in treats are high in glucosamine and chondroitin for joint support. The perfect ratio of meat to bone makes them easily digestible and great for daily feeding or as a crunchy treat.",
        "ingredients": "100% chicken necks. No additives, preservatives, or artificial ingredients.",
        "feeding_guide": TREAT_FEEDING_GUIDE,
        "product_information": TREAT_PRODUCT_INFO,
        "image": "https://customer-assets.emergentagent.com/job_file-access-17/artifacts/ev805vwe_chicken_necks.png",
        "images": [
            "https://customer-assets.emergentagent.com/job_file-access-17/artifacts/ev805vwe_chicken_necks.png"
        ]
    },
    {
        "treat_id": "treat-duck-feet", 
        "name": "Duck Feet", 
        "price": 9.99, 
        "quantity_description": "1lb", 
        "pet_type": "dog",
        "description": "Crunchy duck feet are packed with glucosamine and chondroitin to support joint health. These treats provide satisfying crunch and are naturally rich in collagen for skin and coat health. The perfect size for dogs of all breeds, from small to large.",
        "ingredients": "100% duck feet. No additives, preservatives, or artificial ingredients.",
        "feeding_guide": TREAT_FEEDING_GUIDE,
        "product_information": TREAT_PRODUCT_INFO,
        "image": "https://customer-assets.emergentagent.com/job_file-access-17/artifacts/xnn3vv4v_DuckFeet.png",
        "images": [
            "https://customer-assets.emergentagent.com/job_file-access-17/artifacts/xnn3vv4v_DuckFeet.png"
        ]
    },
    {
        "treat_id": "treat-beef-neck", 
        "name": "Beef Neck Bones", 
        "price": 9.99, 
        "quantity_description": "1 Pack", 
        "pet_type": "dog",
        "description": "Meaty beef neck bones are perfect for powerful chewers. These dense bones feature substantial meat coverage and marrow content. Excellent for dental health, jaw strengthening, and providing hours of satisfying chewing activity. Best suited for medium to large dogs.",
        "ingredients": "100% beef neck bones. No additives, preservatives, or artificial ingredients.",
        "feeding_guide": TREAT_FEEDING_GUIDE,
        "product_information": TREAT_PRODUCT_INFO,
        "image": "https://customer-assets.emergentagent.com/job_file-access-17/artifacts/wmt1d4vz_beef_neck_bones.png",
        "images": [
            "https://customer-assets.emergentagent.com/job_file-access-17/artifacts/wmt1d4vz_beef_neck_bones.png"
        ]
    },
    {
        "treat_id": "treat-chicken-heads", 
        "name": "Whole Chicken Heads", 
        "price": 9.99, 
        "quantity_description": "10 Pack", 
        "pet_type": "dog",
        "description": "Whole chicken heads are a nutrient powerhouse! Rich in brain matter providing omega-3 fatty acids, plus eyes, combs, and bone content for complete nutrition. These treats offer mental enrichment and dental benefits while delivering highly bioavailable nutrients. Perfect for all dog sizes.",
        "ingredients": "100% whole chicken heads. No additives, preservatives, or artificial ingredients.",
        "feeding_guide": TREAT_FEEDING_GUIDE,
        "product_information": TREAT_PRODUCT_INFO,
        "image": "https://customer-assets.emergentagent.com/job_file-access-17/artifacts/p5zyp5xk_chicken%20head.png",
        "images": [
            "https://customer-assets.emergentagent.com/job_file-access-17/artifacts/p5zyp5xk_chicken%20head.png"
        ]
    },
    {
        "treat_id": "treat-beef-marrow", 
        "name": "Beef Marrow Bones", 
        "price": 9.99, 
        "quantity_description": "1 Pack", 
        "pet_type": "dog",
        "description": "Premium beef marrow bones are the gold standard of recreational chewing. These bones are filled with nutrient-rich marrow that dogs absolutely love. The dense bone structure provides long-lasting chewing satisfaction while promoting dental health. Perfect for medium to large dogs who love to chew.",
        "ingredients": "100% beef marrow bones. No additives, preservatives, or artificial ingredients.",
        "feeding_guide": TREAT_FEEDING_GUIDE,
        "product_information": TREAT_PRODUCT_INFO,
        "image": "https://customer-assets.emergentagent.com/job_file-access-17/artifacts/u6yxsxr8_beef_marrow_bone.png",
        "images": [
            "https://customer-assets.emergentagent.com/job_file-access-17/artifacts/u6yxsxr8_beef_marrow_bone.png",
            "https://customer-assets.emergentagent.com/job_file-access-17/artifacts/19lh9gsg_beef_marrow_image_2.png"
        ]
    }
]

# Cat-specific ingredients (smaller portions, taurine-enriched)
CAT_INGREDIENTS = {
    "chicken": [
        "Ground chicken with bone",
        "Chicken liver",
        "Chicken heart",
        "Taurine supplement",
        "Salmon oil (omega-3)",
        "Kelp powder"
    ],
    "beef": [
        "Grass-fed ground beef",
        "Beef liver",
        "Beef heart",
        "Taurine supplement",
        "Fish oil (omega-3)",
        "Kelp powder"
    ],
    "duck": [
        "Ground duck with bone",
        "Duck liver",
        "Duck heart",
        "Taurine supplement",
        "Fish oil (omega-3)",
        "Kelp powder"
    ],
    "turkey": [
        "Ground turkey with bone",
        "Turkey liver",
        "Turkey heart",
        "Taurine supplement",
        "Fish oil (omega-3)",
        "Kelp powder"
    ],
    "fish": [
        "Wild-caught salmon",
        "Wild-caught mackerel",
        "Salmon oil",
        "Taurine supplement",
        "Kelp powder"
    ],
    "goat": [
        "Ground goat meat",
        "Goat liver",
        "Goat heart",
        "Taurine supplement",
        "Fish oil (omega-3)",
        "Kelp powder"
    ],
    "lamb": [
        "Ground lamb",
        "Lamb liver",
        "Lamb heart",
        "Taurine supplement",
        "Fish oil (omega-3)",
        "Kelp powder"
    ],
    "rabbit": [
        "Ground rabbit with bone",
        "Rabbit liver",
        "Rabbit heart",
        "Taurine supplement",
        "Fish oil (omega-3)",
        "Kelp powder"
    ]
}

CAT_NUTRITION_FACTS = {
    "chicken": {"protein": "20%", "fat": "14%", "fiber": "0.5%", "moisture": "70%", "taurine": "0.15%", "calories": "160 kcal per 100g"},
    "beef": {"protein": "22%", "fat": "16%", "fiber": "0.5%", "moisture": "66%", "taurine": "0.15%", "calories": "190 kcal per 100g"},
    "duck": {"protein": "21%", "fat": "18%", "fiber": "0.5%", "moisture": "64%", "taurine": "0.15%", "calories": "200 kcal per 100g"},
    "turkey": {"protein": "21%", "fat": "13%", "fiber": "0.5%", "moisture": "70%", "taurine": "0.15%", "calories": "155 kcal per 100g"},
    "fish": {"protein": "24%", "fat": "15%", "fiber": "0.5%", "moisture": "66%", "taurine": "0.18%", "calories": "175 kcal per 100g"},
    "goat": {"protein": "23%", "fat": "14%", "fiber": "0.5%", "moisture": "68%", "taurine": "0.15%", "calories": "170 kcal per 100g"},
    "lamb": {"protein": "22%", "fat": "18%", "fiber": "0.5%", "moisture": "65%", "taurine": "0.15%", "calories": "200 kcal per 100g"},
    "rabbit": {"protein": "25%", "fat": "12%", "fiber": "0.5%", "moisture": "68%", "taurine": "0.15%", "calories": "160 kcal per 100g"}
}

HOW_TO_USE_CAT = "Thaw in refrigerator for 12-24 hours. Serve at room temperature. Feed 2-4% of your cat's body weight daily, divided into 2-3 meals. Cats prefer smaller, more frequent meals. Store frozen until ready to use. Once thawed, use within 3 days."

ROYAL_PAWS_PRODUCTS = [
    {
        "product_id": "rp-chicken",
        "product_line": "royal_paws",
        "pet_type": "cat",
        "protein_type": "chicken",
        "name": "Royal Chicken",
        "mini_description": "Premium chicken crafted specifically for cats. Rich in taurine and essential amino acids for heart health and vision. Perfect for feline obligate carnivores.",
        "description": "Premium chicken recipe crafted specifically for cats. Rich in taurine and essential amino acids for heart health and vision. Perfect for feline obligate carnivores.",
        "ingredients": CAT_INGREDIENTS["chicken"],
        "nutrition_facts": CAT_NUTRITION_FACTS["chicken"],
        "how_to_use": HOW_TO_USE_CAT,
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
        "mini_description": "Grass-fed beef packed with iron and B vitamins. High-protein formula for active cats. Essential taurine added for optimal feline nutrition.",
        "description": "Grass-fed beef packed with iron and B vitamins. High-protein formula for active cats. Essential taurine added for optimal feline nutrition.",
        "ingredients": CAT_INGREDIENTS["beef"],
        "nutrition_facts": CAT_NUTRITION_FACTS["beef"],
        "how_to_use": HOW_TO_USE_CAT,
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
        "mini_description": "Novel protein perfect for cats with sensitivities. Rich, flavorful duck with natural fatty acids for healthy skin and coat.",
        "description": "Novel protein perfect for cats with sensitivities. Rich, flavorful duck with natural fatty acids for healthy skin and coat.",
        "ingredients": CAT_INGREDIENTS["duck"],
        "nutrition_facts": CAT_NUTRITION_FACTS["duck"],
        "how_to_use": HOW_TO_USE_CAT,
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
        "mini_description": "Lean turkey for weight-conscious cats. Low fat, high protein with essential amino acids. Gentle on sensitive stomachs.",
        "description": "Lean turkey for weight-conscious cats. Low fat, high protein with essential amino acids. Gentle on sensitive stomachs.",
        "ingredients": CAT_INGREDIENTS["turkey"],
        "nutrition_facts": CAT_NUTRITION_FACTS["turkey"],
        "how_to_use": HOW_TO_USE_CAT,
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
        "name": "Royal Fish",
        "mini_description": "Wild-caught fish cats naturally crave. Omega-3 rich for healthy brain function and shiny coat. Natural taurine from fish sources.",
        "description": "Wild-caught fish cats naturally crave. Omega-3 rich for healthy brain function and shiny coat. Natural taurine from fish sources.",
        "ingredients": CAT_INGREDIENTS["fish"],
        "nutrition_facts": CAT_NUTRITION_FACTS["fish"],
        "how_to_use": HOW_TO_USE_CAT,
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
        "mini_description": "Exotic goat protein for cats with allergies. Highly digestible and lean. Perfect for elimination diets and sensitive cats.",
        "description": "Exotic goat protein for cats with allergies. Highly digestible and lean. Perfect for elimination diets and sensitive cats.",
        "ingredients": CAT_INGREDIENTS["goat"],
        "nutrition_facts": CAT_NUTRITION_FACTS["goat"],
        "how_to_use": HOW_TO_USE_CAT,
        "pricing": [
            {"size_lb": 6, "price": 59.94, "price_per_lb": 9.99, "savings_percent": 0},
            {"size_lb": 12, "price": 113.88, "price_per_lb": 9.49, "savings_percent": 5}
        ],
        "inventory_status": "available"
    },
    {
        "product_id": "rp-lamb",
        "product_line": "royal_paws",
        "pet_type": "cat",
        "protein_type": "lamb",
        "name": "Royal Lamb",
        "mini_description": "Premium grass-fed lamb for discerning cats. Rich in zinc and B vitamins. Satisfying flavor even picky eaters love.",
        "description": "Premium grass-fed lamb for discerning cats. Rich in zinc and B vitamins. Satisfying flavor even picky eaters love.",
        "ingredients": CAT_INGREDIENTS["lamb"],
        "nutrition_facts": CAT_NUTRITION_FACTS["lamb"],
        "how_to_use": HOW_TO_USE_CAT,
        "pricing": [
            {"size_lb": 6, "price": 59.94, "price_per_lb": 9.99, "savings_percent": 0},
            {"size_lb": 12, "price": 113.88, "price_per_lb": 9.49, "savings_percent": 5}
        ],
        "inventory_status": "available"
    },
    {
        "product_id": "rp-rabbit",
        "product_line": "royal_paws",
        "pet_type": "cat",
        "protein_type": "rabbit",
        "name": "Royal Rabbit",
        "mini_description": "Ultra-lean rabbit for cats. Naturally hypoallergenic with high protein content. Ideal for cats with multiple food sensitivities.",
        "description": "Ultra-lean rabbit for cats. Naturally hypoallergenic with high protein content. Ideal for cats with multiple food sensitivities.",
        "ingredients": CAT_INGREDIENTS["rabbit"],
        "nutrition_facts": CAT_NUTRITION_FACTS["rabbit"],
        "how_to_use": HOW_TO_USE_CAT,
        "pricing": [
            {"size_lb": 6, "price": 86.28, "price_per_lb": 14.38, "savings_percent": 0},
            {"size_lb": 12, "price": 163.93, "price_per_lb": 13.66, "savings_percent": 5}
        ],
        "inventory_status": "available"
    }
]

# Cat treats feeding guide
CAT_TREAT_FEEDING_GUIDE = {
    "feeding": "Feed as a treat or for enrichment. Always supervise your cat while enjoying treats. Perfect for satisfying natural hunting instincts. Introduce gradually for first-time feeders.",
    "handling": "Keep frozen until ready to use. Thaw in refrigerator before serving (2-4 hours). Once thawed, use within 2-3 days. Always handle with clean hands and clean surfaces."
}

CAT_TREAT_PRODUCT_INFO = """Our cat treats are sourced from trusted family farms and processed in USDA-inspected facilities. Each treat is individually frozen to lock in freshness. No artificial preservatives, colors, or flavors added.

Perfect for:
• Satisfying natural hunting instincts
• Dental health and jaw exercise
• Mental stimulation and enrichment
• High-protein supplemental feeding

Always supervise your cat when feeding treats. Not suitable for kittens under 12 weeks old."""

# Cat treats - 5 specific treats as per requirements
CAT_TREATS = [
    {
        "treat_id": "treat-cat-chicken-heads",
        "name": "Whole Chicken Heads",
        "price": 8.99,
        "quantity_description": "4 Pack",
        "pet_type": "cat",
        "description": "Whole chicken heads perfectly sized for cats. Rich in brain matter providing omega-3 fatty acids and taurine. These treats satisfy your cat's natural hunting instinct while providing complete prey nutrition. The crunchy texture helps clean teeth naturally.",
        "ingredients": "100% whole chicken heads. No additives, preservatives, or artificial ingredients.",
        "feeding_guide": CAT_TREAT_FEEDING_GUIDE,
        "product_information": CAT_TREAT_PRODUCT_INFO,
        "image": "https://customer-assets.emergentagent.com/job_file-access-17/artifacts/p5zyp5xk_chicken%20head.png",
        "images": [
            "https://customer-assets.emergentagent.com/job_file-access-17/artifacts/p5zyp5xk_chicken%20head.png"
        ]
    },
    {
        "treat_id": "treat-cat-chicken-necks",
        "name": "Whole Chicken Necks Pack",
        "price": 6.99,
        "quantity_description": "8oz",
        "pet_type": "cat",
        "description": "Chicken necks sized perfectly for cats. These meaty, bone-in treats are rich in glucosamine for joint support and calcium for bone health. The ideal ratio of meat to bone makes them easily digestible. Perfect for cats who enjoy crunchy, natural treats.",
        "ingredients": "100% chicken necks. No additives, preservatives, or artificial ingredients.",
        "feeding_guide": CAT_TREAT_FEEDING_GUIDE,
        "product_information": CAT_TREAT_PRODUCT_INFO,
        "image": "https://customer-assets.emergentagent.com/job_file-access-17/artifacts/ev805vwe_chicken_necks.png",
        "images": [
            "https://customer-assets.emergentagent.com/job_file-access-17/artifacts/ev805vwe_chicken_necks.png"
        ]
    },
    {
        "treat_id": "treat-cat-chicken-feet",
        "name": "Chicken Feet",
        "price": 5.99,
        "quantity_description": "6 Pack",
        "pet_type": "cat",
        "description": "Crunchy chicken feet provide natural glucosamine and chondroitin for joint support. These cat-sized treats offer satisfying texture and are rich in collagen for skin and coat health. Perfect for cats who love to crunch and chew.",
        "ingredients": "100% chicken feet. No additives, preservatives, or artificial ingredients.",
        "feeding_guide": CAT_TREAT_FEEDING_GUIDE,
        "product_information": CAT_TREAT_PRODUCT_INFO,
        "image": "https://customer-assets.emergentagent.com/job_file-access-17/artifacts/sj79kpoz_turkey_feet.png",
        "images": [
            "https://customer-assets.emergentagent.com/job_file-access-17/artifacts/sj79kpoz_turkey_feet.png"
        ]
    },
    {
        "treat_id": "treat-cat-duck-heads",
        "name": "Whole Duck Heads",
        "price": 10.99,
        "quantity_description": "3 Pack",
        "pet_type": "cat",
        "description": "Whole duck heads sized for cats. Nutrient-dense with brain matter rich in omega-3 fatty acids and taurine. These treats provide mental enrichment and satisfy hunting instincts while delivering complete prey nutrition.",
        "ingredients": "100% whole duck heads. No additives, preservatives, or artificial ingredients.",
        "feeding_guide": CAT_TREAT_FEEDING_GUIDE,
        "product_information": CAT_TREAT_PRODUCT_INFO,
        "image": "https://customer-assets.emergentagent.com/job_file-access-17/artifacts/68isxfvj_whole_duck_head.png",
        "images": [
            "https://customer-assets.emergentagent.com/job_file-access-17/artifacts/68isxfvj_whole_duck_head.png",
            "https://customer-assets.emergentagent.com/job_file-access-17/artifacts/csqdjqs3_Whole_duck_heads_pack.png"
        ]
    },
    {
        "treat_id": "treat-cat-duck-feet",
        "name": "Duck Feet",
        "price": 7.99,
        "quantity_description": "6 Pack",
        "pet_type": "cat",
        "description": "Duck feet perfectly sized for cats. Packed with glucosamine, chondroitin, and natural collagen. These crunchy treats support joint health while providing natural dental benefits. Cats love the satisfying texture and natural flavor.",
        "ingredients": "100% duck feet. No additives, preservatives, or artificial ingredients.",
        "feeding_guide": CAT_TREAT_FEEDING_GUIDE,
        "product_information": CAT_TREAT_PRODUCT_INFO,
        "image": "https://customer-assets.emergentagent.com/job_file-access-17/artifacts/xnn3vv4v_DuckFeet.png",
        "images": [
            "https://customer-assets.emergentagent.com/job_file-access-17/artifacts/xnn3vv4v_DuckFeet.png"
        ]
    }
]

ALL_PRODUCTS = COMFORT_DINNER_PRODUCTS + PRIMAL_FEAST_PRODUCTS + ROYAL_PAWS_PRODUCTS
ALL_TREATS = TREATS + CAT_TREATS