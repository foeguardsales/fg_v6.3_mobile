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

COMFORT_DINNER_PRODUCTS = [
    {
        "product_id": "cd-chicken",
        "product_line": "comfort_dinner",
        "protein_type": "chicken",
        "name": "Comfort Dinner Chicken",
        "description": "A light meal that supports digestion and everyday vitality for dogs of all life stages.",
        "ingredients": BASE_INGREDIENTS["chicken"],
        "nutrition_facts": NUTRITION_FACTS["chicken"],
        "how_to_use": HOW_TO_USE["comfort_dinner"],
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
        "name": "Comfort Dinner Beef",
        "description": "Grass-fed Ontario beef rich in iron and B vitamins, supporting muscle development and sustained energy.",
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
        "name": "Comfort Dinner Duck",
        "description": "A novel protein rich in iron and selenium, ideal for dogs with common protein sensitivities.",
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
        "name": "Comfort Dinner Fish",
        "description": "Wild-caught fish rich in omega-3s, supporting healthy skin, coat, and cognitive function.",
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
        "name": "Comfort Dinner Goat",
        "description": "Lean and highly digestible, excellent for dogs with allergies or weight management needs.",
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
        "name": "Comfort Dinner Lamb",
        "description": "Grass-fed lamb rich in zinc and B vitamins, supporting immune function and metabolism.",
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
        "name": "Comfort Dinner Rabbit",
        "description": "One of the leanest proteins available, perfect for elimination diets. High in B12 and selenium.",
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
        "name": "Comfort Dinner Turkey",
        "description": "High in protein and low in fat, ideal for maintaining healthy weight with calm, sustained energy.",
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
        "name": "Primal Feast Chicken",
        "description": "Species-appropriate raw nutrition with maximum nutrient retention through minimal processing.",
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
        "name": "Primal Feast Beef",
        "description": "Muscle meat, organ meats, and ground bone provide a rich, satisfying flavor dogs instinctively crave.",
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
        "name": "Primal Feast Duck",
        "description": "Natural fatty acids support skin and coat health with wild game nutrition for the domestic dog.",
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
        "name": "Primal Feast Fish",
        "description": "Cold-water fish providing EPA and DHA for brain and heart health from a clean, sustainable source.",
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
        "name": "Primal Feast Goat",
        "description": "Lean and easily digestible with a unique flavor profile, perfect for sensitive systems.",
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
        "name": "Primal Feast Lamb",
        "description": "Grass-fed lamb delivering CLA and omega-3s with a rich taste and amino acid profile.",
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
        "name": "Primal Feast Rabbit",
        "description": "Ultra-lean protein for weight management, naturally hypoallergenic and highly digestible.",
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
        "name": "Primal Feast Turkey",
        "description": "Low-fat, high-protein option for active dogs with organ meats and bone for natural nutrition.",
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

TREATS = [
    {"treat_id": "treat-chicken-carcass", "name": "Chicken Carcass", "price": 24.99, "quantity_description": "2 Pack", "pet_type": "dog"},
    {"treat_id": "treat-chicken-heads", "name": "Whole Chicken Heads", "price": 9.99, "quantity_description": "10 Pack", "pet_type": "dog"},
    {"treat_id": "treat-chicken-necks-2lb", "name": "Whole Chicken Necks", "price": 8.99, "quantity_description": "2lb", "pet_type": "dog"},
    {"treat_id": "treat-chicken-necks-5lb", "name": "Whole Chicken Necks", "price": 19.99, "quantity_description": "5lb", "pet_type": "dog"},
    {"treat_id": "treat-chicken-feet", "name": "Chicken Feet", "price": 5.99, "quantity_description": "1lb", "pet_type": "dog"},
    {"treat_id": "treat-duck-feet", "name": "Duck Feet", "price": 9.99, "quantity_description": "1lb", "pet_type": "dog"},
    {"treat_id": "treat-turkey-feet", "name": "Turkey Feet", "price": 9.99, "quantity_description": "2 Pack", "pet_type": "dog"},
    {"treat_id": "treat-duck-heads", "name": "Whole Duck Heads", "price": 9.99, "quantity_description": "5 Pack", "pet_type": "dog"},
    {"treat_id": "treat-lamb-head-1", "name": "Whole Lamb Head", "price": 12.99, "quantity_description": "1 Pack", "pet_type": "dog"},
    {"treat_id": "treat-lamb-head-2", "name": "Whole Lamb Head", "price": 19.99, "quantity_description": "2 Pack", "pet_type": "dog"},
    {"treat_id": "treat-beef-marrow", "name": "Beef Marrow Bones", "price": 9.99, "quantity_description": "1 Pack", "pet_type": "dog"},
    {"treat_id": "treat-beef-neck", "name": "Beef Neck Bones", "price": 9.99, "quantity_description": "1 Pack", "pet_type": "dog"},
    {"treat_id": "treat-beef-rib", "name": "Beef Flat Rib Bones", "price": 9.99, "quantity_description": "1lb", "pet_type": "dog"}
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
        "name": "Royal Paws Chicken",
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
        "name": "Royal Paws Beef",
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
        "name": "Royal Paws Duck",
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
        "name": "Royal Paws Turkey",
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
        "name": "Royal Paws Fish",
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
        "name": "Royal Paws Goat",
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
        "name": "Royal Paws Lamb",
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
        "name": "Royal Paws Rabbit",
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

# Cat treats
CAT_TREATS = [
    {"treat_id": "cat-treat-chicken-heads", "name": "Whole Chicken Heads", "price": 8.99, "quantity_description": "4 Pack", "pet_type": "cat"},
    {"treat_id": "cat-treat-chicken-necks", "name": "Whole Chicken Necks Pack", "price": 6.99, "quantity_description": "8oz", "pet_type": "cat"},
    {"treat_id": "cat-treat-chicken-feet", "name": "Chicken Feet", "price": 5.99, "quantity_description": "6 Pack", "pet_type": "cat"},
    {"treat_id": "cat-treat-duck-heads", "name": "Whole Duck Heads", "price": 10.99, "quantity_description": "3 Pack", "pet_type": "cat"},
    {"treat_id": "cat-treat-duck-feet", "name": "Duck Feet", "price": 7.99, "quantity_description": "6 Pack", "pet_type": "cat"}
]

ALL_PRODUCTS = COMFORT_DINNER_PRODUCTS + PRIMAL_FEAST_PRODUCTS + ROYAL_PAWS_PRODUCTS
ALL_TREATS = TREATS + CAT_TREATS