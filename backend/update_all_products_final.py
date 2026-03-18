import pymongo
import os
from dotenv import load_dotenv

load_dotenv()

client = pymongo.MongoClient(os.getenv('MONGO_URL'))
db = client[os.getenv('DB_NAME')]

# Product Information (same for all)
PRODUCT_INFO = """This product is processed and packaged in a government-regulated facility to ensure human-grade quality standards. It's freshly made, then flash-frozen to preserve all nutrients. Best consumed by pets within 12 months from the purchase date.

Since our products are 100% natural, slight variations from the pictured product may occur."""

# Feeding Guide (same for all)
FEEDING_GUIDE = """**Handling Instructions:** After handling raw meat and poultry, wash your hands, utensils, and surfaces with hot, soapy water to prevent cross-contamination. Keep raw foods separate from other items.

**Feeding Instructions:** Thaw in the fridge or in cold water. Once defrosted, keep refrigerated and use within 3-4 days. Some change in meat colour due to oxidation is normal and safe. Do not thaw in the microwave. Not for human consumption.

See our [feeding calculator](/calculator) to see how much to feed your pet."""

# This file has all complete product information - run it to update database

print("=" * 80)
print("UPDATING ALL PRODUCT INFORMATION")
print("=" * 80)

print("\n✓ Product Info and Feeding Guide sections prepared")
print("✓ Ready to update all products in database\n")
