#!/usr/bin/env python3
"""
Backend API Testing Script for FoeGuard - Shopify Integration Verification

Tests the following Shopify backend endpoints after wiring Customer Account API config
and connecting Raw Starter Bundle metaobject:

1. GET /api/shopify/health → storefront.ok: true AND admin.ok: true
2. GET /api/shopify/products?first=3 → products array with handle and title
3. GET /api/shopify/metaobject/raw_starter_bundle/page_raw_starter_bundle → 200 with fields
4. GET /api/shopify/metaobject/homepage_hero/the-freshest-meal-your-dog-has-ever-eaten → 200 with fields
5. GET /api/shopify/metaobject/home_identity_belief_section/home_our_belief_section_1 → 200 with fields
6. GET /api/shopify/metaobject/foeguard_home_announcement_bar/free-delivery-in-the-halton-region → 200 with fields
7. GET /api/shopify/metaobject/homepage_why_fg/home_whyfg_section → 200 with fields
8. GET /api/shopify/metaobject/home_ourstory_section/home_ourstory_section → 200 with fields
9. GET /api/shopify/metaobject/home_footer_cta/home_footer_cta_1 → 200 with fields
10. GET /api/customer-auth/session → 200 with authenticated: false
11. GET /api/customer-auth/login → 503 (expected - no client secret)
12. POST /api/customer-auth/logout → 200 with ok: true

Base URL: from REACT_APP_BACKEND_URL (public ingress, not localhost)
"""

import requests
import json
import sys
from typing import Dict, Any, List, Tuple

# Read backend URL from frontend/.env
BASE_URL = None
try:
    with open('/app/frontend/.env', 'r') as f:
        for line in f:
            if line.startswith('REACT_APP_BACKEND_URL='):
                BASE_URL = line.split('=', 1)[1].strip()
                break
except Exception as e:
    print(f"ERROR: Could not read REACT_APP_BACKEND_URL from /app/frontend/.env: {e}")
    sys.exit(1)

if not BASE_URL:
    print("ERROR: REACT_APP_BACKEND_URL not found in /app/frontend/.env")
    sys.exit(1)

print(f"Using BASE_URL: {BASE_URL}")

class Colors:
    GREEN = '\033[92m'
    RED = '\033[91m'
    YELLOW = '\033[93m'
    BLUE = '\033[94m'
    CYAN = '\033[96m'
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

def print_detail(message: str):
    print(f"{Colors.CYAN}  {message}{Colors.RESET}")

# ============================================================================
# TEST 1: Shopify Health Check
# ============================================================================

def test_shopify_health() -> List[Tuple[str, bool, Any, str]]:
    print_test("1. GET /api/shopify/health - Both Shopify tokens must be live")
    
    results = []
    
    try:
        response = requests.get(f"{BASE_URL}/api/shopify/health", timeout=15)
        
        print_info(f"Status: {response.status_code}")
        
        if response.status_code == 200:
            data = response.json()
            print_detail(f"Response: {json.dumps(data, indent=2)}")
            
            storefront_ok = data.get("storefront", {}).get("ok", False)
            admin_ok = data.get("admin", {}).get("ok", False)
            
            if storefront_ok and admin_ok:
                print_pass("Both storefront.ok and admin.ok are TRUE - Shopify tokens are live")
                results.append(("shopify health - storefront", True, 200, "ok: true"))
                results.append(("shopify health - admin", True, 200, "ok: true"))
            else:
                if not storefront_ok:
                    print_fail(f"storefront.ok is FALSE - error: {data.get('storefront', {}).get('error')}")
                    results.append(("shopify health - storefront", False, 200, data.get('storefront', {}).get('error')))
                else:
                    print_pass("storefront.ok is TRUE")
                    results.append(("shopify health - storefront", True, 200, "ok: true"))
                
                if not admin_ok:
                    print_fail(f"admin.ok is FALSE - error: {data.get('admin', {}).get('error')}")
                    results.append(("shopify health - admin", False, 200, data.get('admin', {}).get('error')))
                else:
                    print_pass("admin.ok is TRUE")
                    results.append(("shopify health - admin", True, 200, "ok: true"))
        else:
            print_fail(f"Expected 200, got {response.status_code}")
            print_detail(f"Response: {response.text[:500]}")
            results.append(("shopify health", False, response.status_code, response.text[:200]))
    except Exception as e:
        print_fail(f"Exception: {e}")
        results.append(("shopify health", False, "exception", str(e)))
    
    return results

# ============================================================================
# TEST 2: Shopify Products
# ============================================================================

def test_shopify_products() -> List[Tuple[str, bool, Any, str]]:
    print_test("2. GET /api/shopify/products?first=3 - Must return products array")
    
    results = []
    
    try:
        response = requests.get(f"{BASE_URL}/api/shopify/products?first=3", timeout=15)
        
        print_info(f"Status: {response.status_code}")
        
        if response.status_code == 200:
            data = response.json()
            
            products = data.get("products", [])
            
            if isinstance(products, list) and len(products) >= 1:
                print_pass(f"Products array returned with {len(products)} items")
                
                # Check first product has handle and title
                first_product = products[0]
                has_handle = "handle" in first_product
                has_title = "title" in first_product
                
                if has_handle and has_title:
                    print_pass(f"First product has 'handle' and 'title' fields")
                    print_detail(f"Sample: handle='{first_product.get('handle')}', title='{first_product.get('title')}'")
                    results.append(("shopify products", True, 200, f"{len(products)} products with handle+title"))
                else:
                    print_fail(f"First product missing required fields - handle: {has_handle}, title: {has_title}")
                    results.append(("shopify products", False, 200, "missing handle or title"))
            else:
                print_fail(f"Expected non-empty products array, got: {type(products)} with {len(products) if isinstance(products, list) else 'N/A'} items")
                results.append(("shopify products", False, 200, "empty or invalid products array"))
        else:
            print_fail(f"Expected 200, got {response.status_code}")
            print_detail(f"Response: {response.text[:500]}")
            results.append(("shopify products", False, response.status_code, response.text[:200]))
    except Exception as e:
        print_fail(f"Exception: {e}")
        results.append(("shopify products", False, "exception", str(e)))
    
    return results

# ============================================================================
# TEST 3-9: Metaobject Endpoints
# ============================================================================

def test_metaobject(
    test_num: int,
    type_name: str,
    handle: str,
    required_fields: List[str],
    description: str
) -> List[Tuple[str, bool, Any, str]]:
    print_test(f"{test_num}. GET /api/shopify/metaobject/{type_name}/{handle}")
    print_info(f"Description: {description}")
    
    results = []
    
    try:
        response = requests.get(f"{BASE_URL}/api/shopify/metaobject/{type_name}/{handle}", timeout=15)
        
        print_info(f"Status: {response.status_code}")
        
        if response.status_code == 200:
            data = response.json()
            
            # Check if fields array exists
            fields = data.get("fields", [])
            
            if not isinstance(fields, list):
                print_fail(f"'fields' is not an array: {type(fields)}")
                results.append((f"metaobject {type_name}/{handle}", False, 200, "fields not an array"))
                return results
            
            print_pass(f"Metaobject returned with {len(fields)} fields")
            
            # Extract field keys
            field_keys = [f.get("key") for f in fields if isinstance(f, dict)]
            print_detail(f"Available field keys: {', '.join(field_keys)}")
            
            # Check for required fields
            missing_fields = []
            found_fields = []
            
            for req_field in required_fields:
                if req_field in field_keys:
                    found_fields.append(req_field)
                else:
                    missing_fields.append(req_field)
            
            if not missing_fields:
                print_pass(f"All required fields present: {', '.join(required_fields)}")
                results.append((f"metaobject {type_name}/{handle}", True, 200, f"all {len(required_fields)} required fields present"))
            else:
                print_fail(f"Missing required fields: {', '.join(missing_fields)}")
                print_info(f"Found fields: {', '.join(found_fields)}")
                results.append((f"metaobject {type_name}/{handle}", False, 200, f"missing: {', '.join(missing_fields)}"))
        else:
            print_fail(f"Expected 200, got {response.status_code}")
            print_detail(f"Response: {response.text[:500]}")
            results.append((f"metaobject {type_name}/{handle}", False, response.status_code, response.text[:200]))
    except Exception as e:
        print_fail(f"Exception: {e}")
        results.append((f"metaobject {type_name}/{handle}", False, "exception", str(e)))
    
    return results

# ============================================================================
# TEST 10: Customer Auth Session
# ============================================================================

def test_customer_auth_session() -> List[Tuple[str, bool, Any, str]]:
    print_test("10. GET /api/customer-auth/session - Must return authenticated: false (no cookie)")
    
    results = []
    
    try:
        response = requests.get(f"{BASE_URL}/api/customer-auth/session", timeout=15)
        
        print_info(f"Status: {response.status_code}")
        
        if response.status_code == 200:
            data = response.json()
            print_detail(f"Response: {json.dumps(data, indent=2)}")
            
            authenticated = data.get("authenticated")
            customer = data.get("customer")
            
            if authenticated == False and customer is None:
                print_pass("Correctly returns authenticated: false and customer: null (no session cookie)")
                results.append(("customer-auth session", True, 200, "authenticated: false, customer: null"))
            else:
                print_fail(f"Unexpected response - authenticated: {authenticated}, customer: {customer}")
                results.append(("customer-auth session", False, 200, f"authenticated: {authenticated}"))
        else:
            print_fail(f"Expected 200, got {response.status_code}")
            print_detail(f"Response: {response.text[:500]}")
            results.append(("customer-auth session", False, response.status_code, response.text[:200]))
    except Exception as e:
        print_fail(f"Exception: {e}")
        results.append(("customer-auth session", False, "exception", str(e)))
    
    return results

# ============================================================================
# TEST 11: Customer Auth Login (Expected 503)
# ============================================================================

def test_customer_auth_login() -> List[Tuple[str, bool, Any, str]]:
    print_test("11. GET /api/customer-auth/login - Must return 503 (no client secret configured)")
    print_info("This is EXPECTED behavior - merchant has not yet provided Client Secret")
    
    results = []
    
    try:
        # Use allow_redirects=False to prevent following redirects
        response = requests.get(f"{BASE_URL}/api/customer-auth/login", timeout=15, allow_redirects=False)
        
        print_info(f"Status: {response.status_code}")
        
        if response.status_code == 503:
            # Try to parse JSON response
            try:
                data = response.json()
                detail = data.get("detail", "")
                print_detail(f"Response: {json.dumps(data, indent=2)}")
                
                if "Customer Account API is not configured" in detail or "not configured" in detail.lower():
                    print_pass("Correctly returns 503 with 'not configured' message (expected - no client secret)")
                    results.append(("customer-auth login", True, 503, "not configured (expected)"))
                else:
                    print_pass(f"Returns 503 as expected, detail: {detail}")
                    results.append(("customer-auth login", True, 503, "503 as expected"))
            except Exception:
                print_pass("Returns 503 as expected (could not parse JSON)")
                results.append(("customer-auth login", True, 503, "503 as expected"))
        else:
            print_fail(f"Expected 503, got {response.status_code}")
            print_detail(f"Response: {response.text[:500]}")
            results.append(("customer-auth login", False, response.status_code, response.text[:200]))
    except Exception as e:
        print_fail(f"Exception: {e}")
        results.append(("customer-auth login", False, "exception", str(e)))
    
    return results

# ============================================================================
# TEST 12: Customer Auth Logout
# ============================================================================

def test_customer_auth_logout() -> List[Tuple[str, bool, Any, str]]:
    print_test("12. POST /api/customer-auth/logout - Must return 200 with ok: true")
    
    results = []
    
    try:
        response = requests.post(f"{BASE_URL}/api/customer-auth/logout", timeout=15)
        
        print_info(f"Status: {response.status_code}")
        
        if response.status_code == 200:
            data = response.json()
            print_detail(f"Response: {json.dumps(data, indent=2)}")
            
            ok = data.get("ok")
            
            if ok == True:
                print_pass("Correctly returns ok: true")
                results.append(("customer-auth logout", True, 200, "ok: true"))
            else:
                print_fail(f"Expected ok: true, got ok: {ok}")
                results.append(("customer-auth logout", False, 200, f"ok: {ok}"))
        else:
            print_fail(f"Expected 200, got {response.status_code}")
            print_detail(f"Response: {response.text[:500]}")
            results.append(("customer-auth logout", False, response.status_code, response.text[:200]))
    except Exception as e:
        print_fail(f"Exception: {e}")
        results.append(("customer-auth logout", False, "exception", str(e)))
    
    return results

# ============================================================================
# MAIN TEST RUNNER
# ============================================================================

def main():
    print(f"\n{Colors.BLUE}{'='*80}{Colors.RESET}")
    print(f"{Colors.BLUE}FoeGuard Backend - Shopify Integration Verification{Colors.RESET}")
    print(f"{Colors.BLUE}Base URL: {BASE_URL}{Colors.RESET}")
    print(f"{Colors.BLUE}{'='*80}{Colors.RESET}\n")
    
    all_results = []
    
    # Test 1: Shopify Health
    all_results.extend(test_shopify_health())
    
    # Test 2: Shopify Products
    all_results.extend(test_shopify_products())
    
    # Test 3: Raw Starter Bundle metaobject
    all_results.extend(test_metaobject(
        3,
        "raw_starter_bundle",
        "page_raw_starter_bundle",
        ["hero_title", "hero_subtitle", "hero_image", "product_image", "cta_text", 
         "what_s_included", "benefits", "bottom_cta"],
        "Raw Starter Bundle page metaobject"
    ))
    
    # Test 4: Homepage Hero metaobject
    all_results.extend(test_metaobject(
        4,
        "homepage_hero",
        "the-freshest-meal-your-dog-has-ever-eaten",
        ["hero_title_heading", "hero_subheading", "cta_button", "hero_image_banner"],
        "Homepage hero section metaobject"
    ))
    
    # Test 5: Home Identity Belief Section metaobject
    all_results.extend(test_metaobject(
        5,
        "home_identity_belief_section",
        "home_our_belief_section_1",
        ["identity_section_header"],  # Also check for text_pararaph or text_paragraph
        "Home identity/belief section metaobject"
    ))
    
    # Test 6: Announcement Bar metaobject
    all_results.extend(test_metaobject(
        6,
        "foeguard_home_announcement_bar",
        "free-delivery-in-the-halton-region",
        ["announcement_bar"],
        "Announcement bar metaobject"
    ))
    
    # Test 7: Homepage Why FG metaobject
    all_results.extend(test_metaobject(
        7,
        "homepage_why_fg",
        "home_whyfg_section",
        ["why_fg_header", "why_fg_subheader", "why_fg_comparison_images"],
        "Homepage Why FoeGuard section metaobject"
    ))
    
    # Test 8: Home Our Story Section metaobject
    all_results.extend(test_metaobject(
        8,
        "home_ourstory_section",
        "home_ourstory_section",
        ["our_story_title", "our_story_body"],
        "Home our story section metaobject"
    ))
    
    # Test 9: Home Footer CTA metaobject
    all_results.extend(test_metaobject(
        9,
        "home_footer_cta",
        "home_footer_cta_1",
        ["footer_cta_title", "footer_cta_body", "footer_cta_button_title"],
        "Home footer CTA metaobject"
    ))
    
    # Test 10: Customer Auth Session
    all_results.extend(test_customer_auth_session())
    
    # Test 11: Customer Auth Login (expected 503)
    all_results.extend(test_customer_auth_login())
    
    # Test 12: Customer Auth Logout
    all_results.extend(test_customer_auth_logout())
    
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
        for test_name, passed_flag, status, details in all_results:
            if not passed_flag:
                print(f"{Colors.RED}  ✗ {test_name}: {status} - {details}{Colors.RESET}")
    
    print(f"\n{Colors.BLUE}{'='*80}{Colors.RESET}\n")
    
    # Exit with appropriate code
    return 0 if failed == 0 else 1

if __name__ == "__main__":
    exit_code = main()
    sys.exit(exit_code)
