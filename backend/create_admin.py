import asyncio
from motor.motor_asyncio import AsyncIOMotorClient
from passlib.context import CryptContext
import os
from dotenv import load_dotenv

load_dotenv()

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

async def create_admin():
    client = AsyncIOMotorClient(os.environ.get("MONGO_URL", "mongodb://localhost:27017"))
    db = client[os.environ.get("DB_NAME", "test_database")]
    
    admin_email = "Sales@foeguard.com"
    admin_password = "AAZA534BCD1!"
    
    # Check if admin already exists
    existing = await db.users.find_one({"email": admin_email})
    if existing:
        print(f"Admin user {admin_email} already exists")
        return
    
    # Hash password
    hashed_password = pwd_context.hash(admin_password)
    
    # Create admin user
    admin_user = {
        "user_id": "admin_001",
        "email": admin_email,
        "password": hashed_password,
        "name": "FoeGuard Admin",
        "role": "admin",
        "created_at": "2024-01-01T00:00:00"
    }
    
    await db.users.insert_one(admin_user)
    print(f"✅ Admin user created: {admin_email}")
    print(f"   Password: {admin_password}")
    
    client.close()

if __name__ == "__main__":
    asyncio.run(create_admin())
