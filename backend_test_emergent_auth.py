"""
Backend API Testing for Emergent Auth (Google OAuth) Customer Authentication
Tests the new emergent_auth.py module endpoints for session lifecycle
"""
import httpx
import json
import os
import asyncio
from pathlib import Path
from datetime import datetime, timezone, timedelta
from pymongo import MongoClient

# Load environment variables to get the backend URL
from dotenv import load_dotenv
load_dotenv(Path(__file__).parent / 'frontend' / '.env')
load_dotenv(Path(__file__).parent / 'backend' / '.env')

BASE_URL = os.environ.get('REACT_APP_BACKEND_URL', 'https://da30d5ae-3baf-416b-ba72-2c46605db4c1.preview.emergentagent.com')
API_BASE = f"{BASE_URL}/api"
MONGO_URL = os.environ.get('MONGO_URL', 'mongodb://localhost:27017')
DB_NAME = os.environ.get('DB_NAME', 'foeguard')

# Test results storage
test_results = []

def log_test(test_name, passed, details=""):
    """Log test result"""
    status = "✅ PASS" if passed else "❌ FAIL"
    result = {
        "test": test_name,
        "status": status,
        "passed": passed,
        "details": details
    }
    test_results.append(result)
    print(f"{status}: {test_name}")
    if details:
        print(f"  Details: {details}")
    return passed

def print_summary():
    """Print test summary"""
    passed = sum(1 for r in test_results if r["passed"])
    total = len(test_results)
    print("\n" + "="*80)
    print(f"TEST SUMMARY: {passed}/{total} PASSED")
    print("="*80)
    for result in test_results:
        print(f"{result['status']}: {result['test']}")
        if result['details'] and not result['passed']:
            print(f"  {result['details']}")
    print("="*80)

async def test_1_invalid_session_id():
    """
    TEST 1: POST /api/auth/session with invalid session_id
    Expect: HTTP 401 or 502 (backend attempts exchange with Emergent, which rejects)
    """
    print("\n" + "="*80)
    print("TEST 1: POST /api/auth/session with invalid session_id")
    print("="*80)
    
    try:
        async with httpx.AsyncClient(timeout=30) as client:
            response = await client.post(
                f"{API_BASE}/auth/session",
                json={"session_id": "invalid_fake_id"}
            )
            
            # Accept 401 or 502 as valid responses (both prove it attempted the exchange)
            if response.status_code in [401, 502]:
                log_test(
                    "POST /api/auth/session with invalid session_id",
                    True,
                    f"Returned HTTP {response.status_code} as expected (Emergent rejected invalid session_id)"
                )
                return True
            else:
                log_test(
                    "POST /api/auth/session with invalid session_id",
                    False,
                    f"Expected HTTP 401 or 502, got {response.status_code}. Response: {response.text[:200]}"
                )
                return False
                
    except Exception as e:
        log_test(
            "POST /api/auth/session with invalid session_id",
            False,
            f"Exception: {str(e)}"
        )
        return False

async def test_2_get_session_no_auth():
    """
    TEST 2: GET /api/auth/session with NO auth (no cookie, no header)
    Expect: HTTP 200 and body {"authenticated": false, "user": null}
    """
    print("\n" + "="*80)
    print("TEST 2: GET /api/auth/session with NO auth")
    print("="*80)
    
    try:
        async with httpx.AsyncClient(timeout=30) as client:
            response = await client.get(f"{API_BASE}/auth/session")
            
            if response.status_code != 200:
                log_test(
                    "GET /api/auth/session (no auth) - status code",
                    False,
                    f"Expected HTTP 200, got {response.status_code}"
                )
                return False
            
            data = response.json()
            
            # Check authenticated field
            if data.get("authenticated") != False:
                log_test(
                    "GET /api/auth/session (no auth) - authenticated field",
                    False,
                    f"Expected authenticated=false, got {data.get('authenticated')}"
                )
                return False
            
            # Check user field
            if data.get("user") is not None:
                log_test(
                    "GET /api/auth/session (no auth) - user field",
                    False,
                    f"Expected user=null, got {data.get('user')}"
                )
                return False
            
            log_test(
                "GET /api/auth/session (no auth)",
                True,
                f"Returned HTTP 200 with {{'authenticated': false, 'user': null}}"
            )
            return True
            
    except Exception as e:
        log_test(
            "GET /api/auth/session (no auth)",
            False,
            f"Exception: {str(e)}"
        )
        return False

async def test_3_seed_and_verify_session():
    """
    TEST 3: Seed a test user + session directly in Mongo, then GET /api/auth/session with Bearer token
    Expect: HTTP 200, body {"authenticated": true, "user": {...}} with matching user data
    """
    print("\n" + "="*80)
    print("TEST 3: Seed test user + session, then verify with Bearer token")
    print("="*80)
    
    # Generate unique test data
    timestamp = int(datetime.now().timestamp() * 1000)
    user_id = f"user_test_{timestamp}"
    email = f"test.user.{timestamp}@example.com"
    name = "Test User"
    session_token = f"test_session_{timestamp}"
    
    mongo_client = None
    
    try:
        # Connect to MongoDB
        mongo_client = MongoClient(MONGO_URL)
        db = mongo_client[DB_NAME]
        users_collection = db.users
        sessions_collection = db.user_sessions
        
        # Insert test user
        user_doc = {
            "user_id": user_id,
            "email": email,
            "name": name,
            "picture": "https://via.placeholder.com/150",
            "role": "customer",
            "created_at": datetime.now(timezone.utc)
        }
        users_collection.insert_one(user_doc)
        print(f"✓ Inserted test user: {user_id} ({email})")
        
        # Insert test session
        session_doc = {
            "session_token": session_token,
            "user_id": user_id,
            "email": email,
            "expires_at": datetime.now(timezone.utc) + timedelta(days=7),
            "created_at": datetime.now(timezone.utc)
        }
        sessions_collection.insert_one(session_doc)
        print(f"✓ Inserted test session: {session_token}")
        
        # Test GET /api/auth/session with Bearer token
        async with httpx.AsyncClient(timeout=30) as client:
            response = await client.get(
                f"{API_BASE}/auth/session",
                headers={"Authorization": f"Bearer {session_token}"}
            )
            
            if response.status_code != 200:
                log_test(
                    "GET /api/auth/session (with Bearer token) - status code",
                    False,
                    f"Expected HTTP 200, got {response.status_code}. Response: {response.text[:200]}"
                )
                return False, user_id, session_token
            
            data = response.json()
            
            # Check authenticated field
            if data.get("authenticated") != True:
                log_test(
                    "GET /api/auth/session (with Bearer token) - authenticated field",
                    False,
                    f"Expected authenticated=true, got {data.get('authenticated')}"
                )
                return False, user_id, session_token
            
            # Check user object exists
            user = data.get("user")
            if not user:
                log_test(
                    "GET /api/auth/session (with Bearer token) - user object",
                    False,
                    "Expected user object, got None"
                )
                return False, user_id, session_token
            
            # Verify user fields
            errors = []
            if user.get("user_id") != user_id:
                errors.append(f"user_id mismatch: expected {user_id}, got {user.get('user_id')}")
            if user.get("email") != email:
                errors.append(f"email mismatch: expected {email}, got {user.get('email')}")
            if user.get("name") != name:
                errors.append(f"name mismatch: expected {name}, got {user.get('name')}")
            
            if errors:
                log_test(
                    "GET /api/auth/session (with Bearer token) - user data verification",
                    False,
                    "; ".join(errors)
                )
                return False, user_id, session_token
            
            log_test(
                "GET /api/auth/session (with Bearer token)",
                True,
                f"Returned HTTP 200 with authenticated=true and matching user data (user_id={user_id}, email={email}, name={name})"
            )
            return True, user_id, session_token
            
    except Exception as e:
        log_test(
            "GET /api/auth/session (with Bearer token)",
            False,
            f"Exception: {str(e)}"
        )
        return False, None, None
    finally:
        if mongo_client:
            mongo_client.close()

async def test_4_logout(session_token):
    """
    TEST 4: POST /api/auth/logout with Bearer token
    Expect: {"ok": true}
    Note: logout reads token from COOKIE (not header) to delete server session,
    so session row may still exist if only header was sent - that's acceptable.
    Key check: endpoint returns 200 {"ok":true} and clears the cookie.
    """
    print("\n" + "="*80)
    print("TEST 4: POST /api/auth/logout with Bearer token")
    print("="*80)
    
    if not session_token:
        log_test(
            "POST /api/auth/logout",
            False,
            "No session_token available from previous test"
        )
        return False
    
    try:
        async with httpx.AsyncClient(timeout=30) as client:
            # Send logout request with Bearer token in header
            response = await client.post(
                f"{API_BASE}/auth/logout",
                headers={"Authorization": f"Bearer {session_token}"}
            )
            
            if response.status_code != 200:
                log_test(
                    "POST /api/auth/logout - status code",
                    False,
                    f"Expected HTTP 200, got {response.status_code}. Response: {response.text[:200]}"
                )
                return False
            
            data = response.json()
            
            # Check ok field
            if data.get("ok") != True:
                log_test(
                    "POST /api/auth/logout - response body",
                    False,
                    f"Expected {{'ok': true}}, got {data}"
                )
                return False
            
            log_test(
                "POST /api/auth/logout",
                True,
                f"Returned HTTP 200 with {{'ok': true}}. Note: session may still exist in DB if only header was sent (cookie-based deletion), but endpoint responded correctly."
            )
            return True
            
    except Exception as e:
        log_test(
            "POST /api/auth/logout",
            False,
            f"Exception: {str(e)}"
        )
        return False

async def test_5_regression_admin_jwt_and_shopify():
    """
    TEST 5: REGRESSION - Confirm admin JWT route and Shopify health still work
    a) POST /api/auth/login with bad credentials -> expect 401 "Invalid credentials"
    b) GET /api/shopify/health -> expect storefront.ok=true
    """
    print("\n" + "="*80)
    print("TEST 5: REGRESSION - Admin JWT login and Shopify health")
    print("="*80)
    
    all_passed = True
    
    # Test 5a: Admin JWT login with bad credentials
    try:
        async with httpx.AsyncClient(timeout=30) as client:
            response = await client.post(
                f"{API_BASE}/auth/login",
                json={"email": "x@y.com", "password": "bad"}
            )
            
            if response.status_code != 401:
                log_test(
                    "POST /api/auth/login (admin JWT) - status code",
                    False,
                    f"Expected HTTP 401 for bad credentials, got {response.status_code}"
                )
                all_passed = False
            else:
                # Check if response contains "Invalid credentials" or similar message
                try:
                    data = response.json()
                    detail = data.get("detail", "")
                    if "invalid" in detail.lower() or "credentials" in detail.lower():
                        log_test(
                            "POST /api/auth/login (admin JWT)",
                            True,
                            f"Returned HTTP 401 with '{detail}' - admin JWT route still works"
                        )
                    else:
                        log_test(
                            "POST /api/auth/login (admin JWT)",
                            True,
                            f"Returned HTTP 401 (expected for bad credentials) - admin JWT route still works"
                        )
                except Exception:
                    log_test(
                        "POST /api/auth/login (admin JWT)",
                        True,
                        "Returned HTTP 401 (expected for bad credentials) - admin JWT route still works"
                    )
                    
    except Exception as e:
        log_test(
            "POST /api/auth/login (admin JWT)",
            False,
            f"Exception: {str(e)}"
        )
        all_passed = False
    
    # Test 5b: Shopify health check
    try:
        async with httpx.AsyncClient(timeout=30) as client:
            response = await client.get(f"{API_BASE}/shopify/health")
            
            if response.status_code != 200:
                log_test(
                    "GET /api/shopify/health - status code",
                    False,
                    f"Expected HTTP 200, got {response.status_code}"
                )
                all_passed = False
            else:
                data = response.json()
                storefront_ok = data.get("storefront", {}).get("ok", False)
                
                if not storefront_ok:
                    log_test(
                        "GET /api/shopify/health - storefront.ok",
                        False,
                        f"Expected storefront.ok=true, got {storefront_ok}"
                    )
                    all_passed = False
                else:
                    log_test(
                        "GET /api/shopify/health",
                        True,
                        f"Returned HTTP 200 with storefront.ok=true - Shopify integration still works"
                    )
                    
    except Exception as e:
        log_test(
            "GET /api/shopify/health",
            False,
            f"Exception: {str(e)}"
        )
        all_passed = False
    
    return all_passed

async def cleanup_test_data(user_id, session_token):
    """Clean up test user and session from MongoDB"""
    print("\n" + "="*80)
    print("CLEANUP: Removing test user and session from MongoDB")
    print("="*80)
    
    if not user_id and not session_token:
        print("⚠ No test data to clean up")
        return
    
    mongo_client = None
    try:
        mongo_client = MongoClient(MONGO_URL)
        db = mongo_client[DB_NAME]
        
        if user_id:
            result = db.users.delete_one({"user_id": user_id})
            if result.deleted_count > 0:
                print(f"✓ Deleted test user: {user_id}")
            else:
                print(f"⚠ Test user not found: {user_id}")
        
        if session_token:
            result = db.user_sessions.delete_one({"session_token": session_token})
            if result.deleted_count > 0:
                print(f"✓ Deleted test session: {session_token}")
            else:
                print(f"⚠ Test session not found: {session_token}")
                
    except Exception as e:
        print(f"❌ Cleanup error: {str(e)}")
    finally:
        if mongo_client:
            mongo_client.close()

async def main():
    """Run all Emergent Auth tests"""
    print("\n" + "="*80)
    print("EMERGENT AUTH (GOOGLE OAUTH) BACKEND TESTING")
    print("="*80)
    print(f"Backend URL: {BASE_URL}")
    print(f"API Base: {API_BASE}")
    print(f"MongoDB: {MONGO_URL}")
    print(f"Database: {DB_NAME}")
    print("="*80)
    
    user_id = None
    session_token = None
    
    try:
        # Run tests in sequence
        await test_1_invalid_session_id()
        await test_2_get_session_no_auth()
        
        # Test 3 returns user_id and session_token for cleanup
        success, user_id, session_token = await test_3_seed_and_verify_session()
        
        # Test 4 uses the session_token from test 3
        await test_4_logout(session_token)
        
        # Test 5 is regression testing
        await test_5_regression_admin_jwt_and_shopify()
        
    finally:
        # Always clean up test data
        await cleanup_test_data(user_id, session_token)
        
        # Print summary
        print_summary()

if __name__ == "__main__":
    asyncio.run(main())
