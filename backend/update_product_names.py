"""
Update product names to new naming convention.
Keeps product_id unique per collection (cd-chicken, pf-chicken, rp-chicken).
"""
import asyncio
import os
from motor.motor_asyncio import AsyncIOMotorClient
from dotenv import load_dotenv
from pathlib import Path

load_dotenv(Path(__file__).parent / '.env')

PROTEIN_NAME_MAP = {
    'chicken': 'Free-Range Chicken',
    'beef': 'Pasture-Raised Beef',
    'turkey': 'Free-Range Turkey',
    'duck': 'Free-Range Duck',
    'lamb': 'Pasture-Raised Lamb',
    'goat': 'Pasture-Raised Goat',
    'rabbit': 'Cage-Free Rabbit',
    'fish': 'Wild-Caught Salmon',
}

async def main():
    client = AsyncIOMotorClient(os.environ['MONGO_URL'])
    db = client[os.environ['DB_NAME']]

    updated = 0
    async for product in db.products.find({}):
        protein = product.get('protein_type')
        if protein in PROTEIN_NAME_MAP:
            new_name = PROTEIN_NAME_MAP[protein]
            if product.get('name') != new_name:
                await db.products.update_one(
                    {'product_id': product['product_id']},
                    {'$set': {'name': new_name}}
                )
                print(f"  {product['product_id']}: {product.get('name')} -> {new_name}")
                updated += 1

    print(f"\nDone. Updated {updated} products.")
    client.close()

if __name__ == '__main__':
    asyncio.run(main())
