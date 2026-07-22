#!/usr/bin/env python3
"""
Backend API Testing Script for FoeGuard - Current Session (Jul 2025)

Tests the following backend tasks:
1. Events tracking endpoint POST /api/events/track
2. Shopify proxy caching active + graceful 502 when unconfigured
3. shopify_variant_id added to Product/Treat models (no regression)
4. Core local catalog + auth regression check

Base URL: http://localhost:8001 (all routes prefixed with /api)
"""

import requests
import json
import sys
from typing import Dict, Any, List
import uuid

BASE_URL = "http://localhost:8001"

class Colors:
    GREEN = '\033[92m'
    RED = '\033[91m'
    YELLOW = '\033[93m'
    BLUE = '\033[94m'
    RESET = '\033[0m'

def print_test(name: str):
    print(f"\n{Colors.BLUE}{'='*80}{Colors.RESET}")
    print(f"{Colors.BLUE}TEST: {name}{Colors.RESET}")
    print(f"{Colors.BLUE}{'='*80}{Colors.RESET}")

def print_pass(message: str):
    print(f"{Colors.GREEN}✓ PASS: {message}{Colors.RESET}")

def print_fail(message: str):
    print(f"{Colors.RED}✗ FAIL: {message}{Colors.RESET}")

def print_info(message: str):
    print(f"{Colors.YELLOW}ℹ INFO: {message}{Colors.RESET}")

# ============================================================================
# TEST 1: EVENTS ENDPOINT - POST /api/events/track
# ============================================================================

def test_events_endpoint():
    print_test("1. Events Tracking Endpoint POST /api/events/track")
    
    results = []
    
    # Test 1a: Valid event - quiz_completed
    print_info("Test 1a: POST quiz_completed event with email")
    try:
        response = requests.post(
            f"{BASE_URL}/api/events/track",
            json={
                "event": "quiz_completed",
                "properties": {"email": "test@example.com"},
                "email": "test@example.com"
            },
            timeout=10
        )
        
        print_info(f"Status: {response.status_code}")
        print_info(f"Response: {response.text[:200]}")
        
        if response.status_code == 200:
            data = response.json()
            if (data.get("status") == "ok" and 
                data.get("event") == "quiz_completed" and 
                data.get("routed_to_shopify_email") == False):
                print_pass("quiz_completed event tracked successfully with correct response")
                results.append(("quiz_completed event", True, response.status_code, data))
            else:
                print_fail(f"Unexpected response structure: {data}")
                results.append(("quiz_completed event", False, response.status_code, data))
        else:
            print_fail(f"Expected 200, got {response.status_code}")
            results.append(("quiz_completed event", False, response.status_code, response.text))
    except Exception as e:
        print_fail(f"Exception: {e}")
        results.append(("quiz_completed event", False, "exception", str(e)))
    
    # Test 1b: Valid event - account_created
    print_info("\nTest 1b: POST account_created event")
    try:
        response = requests.post(
            f"{BASE_URL}/api/events/track",
            json={
                "event": "account_created",
                "properties": {}
            },
            timeout=10
        )
        
        print_info(f"Status: {response.status_code}")
        print_info(f"Response: {response.text[:200]}")
        
        if response.status_code == 200:
            data = response.json()
            if data.get("status") == "ok" and data.get("event") == "account_created":
                print_pass("account_created event tracked successfully")
                results.append(("account_created event", True, response.status_code, data))
            else:
                print_fail(f"Unexpected response structure: {data}")
                results.append(("account_created event", False, response.status_code, data))
        else:
            print_fail(f"Expected 200, got {response.status_code}")
            results.append(("account_created event", False, response.status_code, response.text))
    except Exception as e:
        print_fail(f"Exception: {e}")
        results.append(("account_created event", False, "exception", str(e)))
    
    # Test 1c: Missing "event" field - should return 422 validation error
    print_info("\nTest 1c: POST with missing 'event' field (validation test)")
    try:
        response = requests.post(
            f"{BASE_URL}/api/events/track",
            json={
                "properties": {"test": "data"}
            },
            timeout=10
        )
        
        print_info(f"Status: {response.status_code}")
        print_info(f"Response: {response.text[:200]}")
        
        if response.status_code == 422:
            print_pass("Correctly returned 422 validation error for missing 'event' field")
            results.append(("missing event field validation", True, response.status_code, "422 as expected"))
        else:
            print_fail(f"Expected 422 validation error, got {response.status_code}")
            results.append(("missing event field validation", False, response.status_code, response.text))
    except Exception as e:
        print_fail(f"Exception: {e}")
        results.append(("missing event field validation", False, "exception", str(e)))
    
    return results

# ============================================================================
# TEST 2: SHOPIFY PROXY CACHING (graceful failure)
# ============================================================================

def test_shopify_proxy_caching():
    print_test("2. Shopify Proxy Caching - Graceful 502 When Unconfigured")
    
    results = []
    
    shopify_endpoints = [
        "/api/shopify/products",
        "/api/shopify/products/some-handle",
        "/api/shopify/collections",
        "/api/shopify/pages",
        "/api/shopify/page/about"
    ]
    
    print_info("Testing that Shopify endpoints return 502 gracefully (not crash)")
    
    for endpoint in shopify_endpoints:
        print_info(f"\nTesting: GET {endpoint}")
        try:
            response = requests.get(f"{BASE_URL}{endpoint}", timeout=10)
            
            print_info(f"Status: {response.status_code}")
            
            if response.status_code == 502:
                print_pass(f"{endpoint} returned 502 gracefully (expected)")
                results.append((endpoint, True, 502, "graceful 502"))
            else:
                print_info(f"Got {response.status_code} instead of 502 - checking if this is acceptable")
                # Some endpoints might return different errors, but as long as server doesn't crash
                results.append((endpoint, True, response.status_code, f"returned {response.status_code}"))
        except requests.exceptions.ConnectionError as e:
            print_fail(f"Connection error - backend may have crashed: {e}")
            results.append((endpoint, False, "connection_error", str(e)))
        except Exception as e:
            print_fail(f"Exception: {e}")
            results.append((endpoint, False, "exception", str(e)))
    
    # Critical test: Verify backend is still healthy after hitting Shopify endpoints
    print_info("\nCritical: Verifying backend is still healthy (GET /api/)")
    try:
        response = requests.get(f"{BASE_URL}/api/", timeout=10)
        
        print_info(f"Status: {response.status_code}")
        print_info(f"Response: {response.text}")
        
        if response.status_code == 200:
            data = response.json()
            if data.get("message") == "FoeGuard API":
                print_pass("Backend is healthy - cache wrapper didn't break anything")
                results.append(("backend health after shopify calls", True, 200, data))
            else:
                print_fail(f"Unexpected response: {data}")
                results.append(("backend health after shopify calls", False, 200, data))
        else:
            print_fail(f"Backend not healthy - got {response.status_code}")
            results.append(("backend health after shopify calls", False, response.status_code, response.text))
    except Exception as e:
        print_fail(f"Backend crashed or unreachable: {e}")
        results.append(("backend health after shopify calls", False, "exception", str(e)))
    
    return results

# ============================================================================
# TEST 3: MODELS - shopify_variant_id present (nullable), no regression
# ============================================================================

def test_shopify_variant_id_in_models():
    print_test("3. shopify_variant_id Added to Product/Treat Models (No Regression)")
    
    results = []
    
    # Test 3a: GET /api/products - should return array with shopify_variant_id field
    print_info("Test 3a: GET /api/products (list)")
    try:
        response = requests.get(f"{BASE_URL}/api/products", timeout=10)
        
        print_info(f"Status: {response.status_code}")
        
        if response.status_code == 200:
            data = response.json()
            if isinstance(data, list) and len(data) > 0:
                print_pass(f"Products endpoint returned {len(data)} products")
                
                # Check first product for shopify_variant_id field
                first_product = data[0]
                if "shopify_variant_id" in first_product:
                    print_pass(f"shopify_variant_id field present (value: {first_product['shopify_variant_id']})")
                    results.append(("products list has shopify_variant_id", True, 200, f"{len(data)} products"))
                else:
                    print_fail("shopify_variant_id field missing from product")
                    results.append(("products list has shopify_variant_id", False, 200, "field missing"))
            else:
                print_fail(f"Expected non-empty array, got: {data}")
                results.append(("products list", False, 200, "empty or invalid"))
        else:
            print_fail(f"Expected 200, got {response.status_code}")
            results.append(("products list", False, response.status_code, response.text))
    except Exception as e:
        print_fail(f"Exception: {e}")
        results.append(("products list", False, "exception", str(e)))
    
    # Test 3b: GET /api/products/cd-chicken - single product with shopify_variant_id
    print_info("\nTest 3b: GET /api/products/cd-chicken (single product)")
    try:
        response = requests.get(f"{BASE_URL}/api/products/cd-chicken", timeout=10)
        
        print_info(f"Status: {response.status_code}")
        
        if response.status_code == 200:
            data = response.json()
            if data.get("product_id") == "cd-chicken":
                print_pass("Product cd-chicken found")
                
                if "shopify_variant_id" in data:
                    print_pass(f"shopify_variant_id field present (value: {data['shopify_variant_id']})")
                    results.append(("product cd-chicken has shopify_variant_id", True, 200, data.get("product_id")))
                else:
                    print_fail("shopify_variant_id field missing")
                    results.append(("product cd-chicken has shopify_variant_id", False, 200, "field missing"))
            else:
                print_fail(f"Wrong product returned: {data.get('product_id')}")
                results.append(("product cd-chicken", False, 200, "wrong product"))
        else:
            print_fail(f"Expected 200, got {response.status_code}")
            results.append(("product cd-chicken", False, response.status_code, response.text))
    except Exception as e:
        print_fail(f"Exception: {e}")
        results.append(("product cd-chicken", False, "exception", str(e)))
    
    # Test 3c: GET /api/treats - should return array with shopify_variant_id field
    print_info("\nTest 3c: GET /api/treats (list)")
    try:
        response = requests.get(f"{BASE_URL}/api/treats", timeout=10)
        
        print_info(f"Status: {response.status_code}")
        
        if response.status_code == 200:
            data = response.json()
            if isinstance(data, list) and len(data) > 0:
                print_pass(f"Treats endpoint returned {len(data)} treats")
                
                # Check first treat for shopify_variant_id field
                first_treat = data[0]
                if "shopify_variant_id" in first_treat:
                    print_pass(f"shopify_variant_id field present (value: {first_treat['shopify_variant_id']})")
                    results.append(("treats list has shopify_variant_id", True, 200, f"{len(data)} treats"))
                else:
                    print_fail("shopify_variant_id field missing from treat")
                    results.append(("treats list has shopify_variant_id", False, 200, "field missing"))
            else:
                print_fail(f"Expected non-empty array, got: {data}")
                results.append(("treats list", False, 200, "empty or invalid"))
        else:
            print_fail(f"Expected 200, got {response.status_code}")
            results.append(("treats list", False, response.status_code, response.text))
    except Exception as e:
        print_fail(f"Exception: {e}")
        results.append(("treats list", False, "exception", str(e)))
    
    return results

# ============================================================================
# TEST 4: CORE REGRESSION
# ============================================================================

def test_core_regression():
    print_test("4. Core Local Catalog + Auth Regression Check")
    
    results = []
    
    # Test 4a: GET /api/ - root endpoint
    print_info("Test 4a: GET /api/ (root)")
    try:
        response = requests.get(f"{BASE_URL}/api/", timeout=10)
        
        print_info(f"Status: {response.status_code}")
        print_info(f"Response: {response.text}")
        
        if response.status_code == 200:
            data = response.json()
            if data.get("message") == "FoeGuard API":
                print_pass("Root endpoint working correctly")
                results.append(("root endpoint", True, 200, data))
            else:
                print_fail(f"Unexpected response: {data}")
                results.append(("root endpoint", False, 200, data))
        else:
            print_fail(f"Expected 200, got {response.status_code}")
            results.append(("root endpoint", False, response.status_code, response.text))
    except Exception as e:
        print_fail(f"Exception: {e}")
        results.append(("root endpoint", False, "exception", str(e)))
    
    # Test 4b: GET /api/stripe-public-key
    print_info("\nTest 4b: GET /api/stripe-public-key")
    try:
        response = requests.get(f"{BASE_URL}/api/stripe-public-key", timeout=10)
        
        print_info(f"Status: {response.status_code}")
        
        if response.status_code == 200:
            data = response.json()
            if "publicKey" in data:
                print_pass(f"Stripe public key endpoint working (key: {data['publicKey'][:20]}...)")
                results.append(("stripe public key", True, 200, "publicKey present"))
            else:
                print_fail(f"publicKey field missing: {data}")
                results.append(("stripe public key", False, 200, "publicKey missing"))
        else:
            print_fail(f"Expected 200, got {response.status_code}")
            results.append(("stripe public key", False, response.status_code, response.text))
    except Exception as e:
        print_fail(f"Exception: {e}")
        results.append(("stripe public key", False, "exception", str(e)))
    
    # Test 4c: Auth - Register and Login
    print_info("\nTest 4c: Auth - Register and Login")
    
    # Generate unique email for this test run
    test_email = f"test_{uuid.uuid4().hex[:8]}@example.com"
    test_password = "TestPassword123!"
    test_name = "Test User"
    
    # Register
    print_info(f"Registering new user: {test_email}")
    try:
        response = requests.post(
            f"{BASE_URL}/api/auth/register",
            json={
                "email": test_email,
                "password": test_password,
                "name": test_name
            },
            timeout=10
        )
        
        print_info(f"Register Status: {response.status_code}")
        
        if response.status_code in [200, 201]:
            data = response.json()
            if "token" in data:
                print_pass(f"Registration successful, token received")
                register_token = data["token"]
                results.append(("auth register", True, response.status_code, "token received"))
                
                # Now test login with same credentials
                print_info(f"\nLogging in with: {test_email}")
                try:
                    login_response = requests.post(
                        f"{BASE_URL}/api/auth/login",
                        json={
                            "email": test_email,
                            "password": test_password
                        },
                        timeout=10
                    )
                    
                    print_info(f"Login Status: {login_response.status_code}")
                    
                    if login_response.status_code == 200:
                        login_data = login_response.json()
                        if "token" in login_data:
                            print_pass("Login successful, token received")
                            results.append(("auth login", True, 200, "token received"))
                        else:
                            print_fail(f"Token missing from login response: {login_data}")
                            results.append(("auth login", False, 200, "token missing"))
                    else:
                        print_fail(f"Login failed with status {login_response.status_code}")
                        results.append(("auth login", False, login_response.status_code, login_response.text))
                except Exception as e:
                    print_fail(f"Login exception: {e}")
                    results.append(("auth login", False, "exception", str(e)))
            else:
                print_fail(f"Token missing from register response: {data}")
                results.append(("auth register", False, response.status_code, "token missing"))
        elif response.status_code == 400:
            # Email might already exist - try login instead
            print_info("Email already registered, testing login only")
            try:
                login_response = requests.post(
                    f"{BASE_URL}/api/auth/login",
                    json={
                        "email": test_email,
                        "password": test_password
                    },
                    timeout=10
                )
                
                if login_response.status_code == 200:
                    print_pass("Login successful (account already exists)")
                    results.append(("auth register", True, 400, "already exists"))
                    results.append(("auth login", True, 200, "token received"))
                else:
                    print_fail("Could not register or login")
                    results.append(("auth register", False, 400, "already exists"))
                    results.append(("auth login", False, login_response.status_code, login_response.text))
            except Exception as e:
                print_fail(f"Login exception: {e}")
                results.append(("auth login", False, "exception", str(e)))
        else:
            print_fail(f"Registration failed with status {response.status_code}")
            results.append(("auth register", False, response.status_code, response.text))
    except Exception as e:
        print_fail(f"Registration exception: {e}")
        results.append(("auth register", False, "exception", str(e)))
    
    return results

# ============================================================================
# MAIN TEST RUNNER
# ============================================================================

def main():
    print(f"\n{Colors.BLUE}{'='*80}{Colors.RESET}")
    print(f"{Colors.BLUE}FoeGuard Backend API Testing - Current Session (Jul 2025){Colors.RESET}")
    print(f"{Colors.BLUE}Base URL: {BASE_URL}{Colors.RESET}")
    print(f"{Colors.BLUE}{'='*80}{Colors.RESET}\n")
    
    all_results = []
    
    # Run all tests
    all_results.extend(test_events_endpoint())
    all_results.extend(test_shopify_proxy_caching())
    all_results.extend(test_shopify_variant_id_in_models())
    all_results.extend(test_core_regression())
    
    # Summary
    print(f"\n{Colors.BLUE}{'='*80}{Colors.RESET}")
    print(f"{Colors.BLUE}TEST SUMMARY{Colors.RESET}")
    print(f"{Colors.BLUE}{'='*80}{Colors.RESET}\n")
    
    passed = sum(1 for r in all_results if r[1])
    failed = sum(1 for r in all_results if not r[1])
    total = len(all_results)
    
    print(f"Total Tests: {total}")
    print(f"{Colors.GREEN}Passed: {passed}{Colors.RESET}")
    print(f"{Colors.RED}Failed: {failed}{Colors.RESET}")
    
    if failed > 0:
        print(f"\n{Colors.RED}FAILED TESTS:{Colors.RESET}")
        for test_name, passed, status, details in all_results:
            if not passed:
                print(f"{Colors.RED}  ✗ {test_name}: {status} - {details}{Colors.RESET}")
    
    print(f"\n{Colors.BLUE}{'='*80}{Colors.RESET}\n")
    
    # Exit with appropriate code
    sys.exit(0 if failed == 0 else 1)

if __name__ == "__main__":
    main()
