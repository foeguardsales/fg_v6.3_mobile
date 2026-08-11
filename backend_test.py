"""
Backend API Testing for Shopify Catalog/Metaobject Endpoints
Tests the 2-level metaobject-reference expansion in queries.py
"""
import httpx
import json
import os
from pathlib import Path

# Load environment variables to get the backend URL
from dotenv import load_dotenv
load_dotenv(Path(__file__).parent / 'frontend' / '.env')

BASE_URL = os.environ.get('REACT_APP_BACKEND_URL', 'https://foeguard-dev-site.preview.emergentagent.com')
API_BASE = f"{BASE_URL}/api"

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

async def test_shopify_health():
    """Test 1: GET /api/shopify/health -> storefront.ok == true AND admin.ok == true"""
    print("\n[TEST 1] Testing /api/shopify/health...")
    try:
        async with httpx.AsyncClient(timeout=30.0) as client:
            response = await client.get(f"{API_BASE}/shopify/health")
            
            if response.status_code != 200:
                return log_test(
                    "Shopify Health Check",
                    False,
                    f"Expected 200, got {response.status_code}: {response.text}"
                )
            
            data = response.json()
            storefront_ok = data.get("storefront", {}).get("ok", False)
            admin_ok = data.get("admin", {}).get("ok", False)
            
            if not storefront_ok:
                storefront_err = data.get("storefront", {}).get("error", "Unknown error")
                return log_test(
                    "Shopify Health Check",
                    False,
                    f"Storefront API not OK: {storefront_err}"
                )
            
            if not admin_ok:
                admin_err = data.get("admin", {}).get("error", "Unknown error")
                return log_test(
                    "Shopify Health Check",
                    False,
                    f"Admin API not OK: {admin_err}"
                )
            
            return log_test(
                "Shopify Health Check",
                True,
                f"Both APIs healthy. Store: {data.get('store_domain')}"
            )
    except Exception as e:
        return log_test("Shopify Health Check", False, f"Exception: {str(e)}")

async def test_products_list():
    """Test 2: GET /api/shopify/products?first=5 -> each product has metafields array"""
    print("\n[TEST 2] Testing /api/shopify/products?first=5...")
    try:
        async with httpx.AsyncClient(timeout=30.0) as client:
            response = await client.get(f"{API_BASE}/shopify/products?first=5")
            
            if response.status_code != 200:
                return log_test(
                    "Products List with Metafields",
                    False,
                    f"Expected 200, got {response.status_code}: {response.text}"
                )
            
            data = response.json()
            nodes = data.get("nodes", [])
            
            if len(nodes) == 0:
                return log_test(
                    "Products List with Metafields",
                    False,
                    "No products returned"
                )
            
            # Check each product has metafields array
            all_have_metafields = True
            for i, product in enumerate(nodes):
                if "metafields" not in product:
                    all_have_metafields = False
                    return log_test(
                        "Products List with Metafields",
                        False,
                        f"Product {i} ({product.get('handle', 'unknown')}) missing metafields array"
                    )
            
            return log_test(
                "Products List with Metafields",
                True,
                f"All {len(nodes)} products have metafields array"
            )
    except Exception as e:
        return log_test("Products List with Metafields", False, f"Exception: {str(e)}")

async def test_product_metafield_expansion():
    """Test 3: GET /api/shopify/products/comfortdinner-chicken-raw-dog-food -> verify 2-level expansion"""
    print("\n[TEST 3] Testing /api/shopify/products/comfortdinner-chicken-raw-dog-food...")
    try:
        async with httpx.AsyncClient(timeout=30.0) as client:
            response = await client.get(f"{API_BASE}/shopify/products/comfortdinner-chicken-raw-dog-food")
            
            if response.status_code != 200:
                return log_test(
                    "Product Metafield 2-Level Expansion",
                    False,
                    f"Expected 200, got {response.status_code}: {response.text}"
                )
            
            product = response.json()
            metafields = product.get("metafields", [])
            
            if not metafields:
                return log_test(
                    "Product Metafield 2-Level Expansion",
                    False,
                    "Product has no metafields"
                )
            
            # Check for product_ingredients_nutrition
            ingredients_nutrition = None
            for mf in metafields:
                if mf.get("key") == "product_ingredients_nutrition":
                    ingredients_nutrition = mf
                    break
            
            if not ingredients_nutrition:
                return log_test(
                    "Product Metafield 2-Level Expansion",
                    False,
                    "Missing metafield: product_ingredients_nutrition"
                )
            
            # Check reference.fields contains recipe_ingredients and recipe_nutrition
            reference = ingredients_nutrition.get("reference", {})
            fields = reference.get("fields", [])
            field_keys = [f.get("key") for f in fields]
            
            if "recipe_ingredients" not in field_keys:
                return log_test(
                    "Product Metafield 2-Level Expansion",
                    False,
                    "product_ingredients_nutrition missing recipe_ingredients field"
                )
            
            if "recipe_nutrition" not in field_keys:
                return log_test(
                    "Product Metafield 2-Level Expansion",
                    False,
                    "product_ingredients_nutrition missing recipe_nutrition field"
                )
            
            # Check for product_page_icons_section with 2-level expansion
            icons_section = None
            for mf in metafields:
                if mf.get("key") == "product_page_icons_section":
                    icons_section = mf
                    break
            
            if not icons_section:
                return log_test(
                    "Product Metafield 2-Level Expansion",
                    False,
                    "Missing metafield: product_page_icons_section"
                )
            
            # Check reference has product_page_icon_section field with references.nodes
            reference = icons_section.get("reference", {})
            fields = reference.get("fields", [])
            
            icon_section_field = None
            for f in fields:
                if f.get("key") == "product_page_icon_section":
                    icon_section_field = f
                    break
            
            if not icon_section_field:
                return log_test(
                    "Product Metafield 2-Level Expansion",
                    False,
                    "product_page_icons_section missing product_page_icon_section field"
                )
            
            # Check for nested references.nodes (2-level expansion)
            nested_refs = icon_section_field.get("references", {})
            nested_nodes = nested_refs.get("nodes", [])
            
            if not nested_nodes:
                return log_test(
                    "Product Metafield 2-Level Expansion",
                    False,
                    "product_page_icon_section has no nested references.nodes (2-level expansion failed)"
                )
            
            # Check nested metaobjects have badge_title field
            has_badge_title = False
            for node in nested_nodes:
                node_fields = node.get("fields", [])
                for f in node_fields:
                    if f.get("key") == "badge_title":
                        has_badge_title = True
                        break
                if has_badge_title:
                    break
            
            if not has_badge_title:
                return log_test(
                    "Product Metafield 2-Level Expansion",
                    False,
                    "Nested metaobjects missing badge_title field"
                )
            
            # Check for product_mini_menu_descriptions
            mini_menu = None
            for mf in metafields:
                if mf.get("key") == "product_mini_menu_descriptions":
                    mini_menu = mf
                    break
            
            if not mini_menu:
                return log_test(
                    "Product Metafield 2-Level Expansion",
                    False,
                    "Missing metafield: product_mini_menu_descriptions"
                )
            
            # Check reference contains product_description
            reference = mini_menu.get("reference", {})
            fields = reference.get("fields", [])
            field_keys = [f.get("key") for f in fields]
            
            if "product_description" not in field_keys:
                return log_test(
                    "Product Metafield 2-Level Expansion",
                    False,
                    "product_mini_menu_descriptions missing product_description field"
                )
            
            return log_test(
                "Product Metafield 2-Level Expansion",
                True,
                f"All required metafields present with 2-level expansion. Found {len(nested_nodes)} nested badge metaobjects."
            )
    except Exception as e:
        return log_test("Product Metafield 2-Level Expansion", False, f"Exception: {str(e)}")

async def test_collections_list():
    """Test 4: GET /api/shopify/collections?first=50 -> includes specific handles"""
    print("\n[TEST 4] Testing /api/shopify/collections?first=50...")
    try:
        async with httpx.AsyncClient(timeout=30.0) as client:
            response = await client.get(f"{API_BASE}/shopify/collections?first=50")
            
            if response.status_code != 200:
                return log_test(
                    "Collections List",
                    False,
                    f"Expected 200, got {response.status_code}: {response.text}"
                )
            
            data = response.json()
            nodes = data.get("nodes", [])
            
            if len(nodes) == 0:
                return log_test(
                    "Collections List",
                    False,
                    "No collections returned"
                )
            
            # Check for required handles
            handles = [c.get("handle") for c in nodes]
            required_handles = [
                "build-your-meal-plan",
                "raw-dog-food-menu",
                "raw-cat-food-menu"
            ]
            
            missing_handles = []
            for handle in required_handles:
                if handle not in handles:
                    missing_handles.append(handle)
            
            if missing_handles:
                return log_test(
                    "Collections List",
                    False,
                    f"Missing required handles: {', '.join(missing_handles)}"
                )
            
            # Check each collection has image and descriptionHtml
            for handle in required_handles:
                collection = next((c for c in nodes if c.get("handle") == handle), None)
                if collection:
                    if "image" not in collection:
                        return log_test(
                            "Collections List",
                            False,
                            f"Collection {handle} missing image field"
                        )
                    if "descriptionHtml" not in collection:
                        return log_test(
                            "Collections List",
                            False,
                            f"Collection {handle} missing descriptionHtml field"
                        )
            
            return log_test(
                "Collections List",
                True,
                f"All required collections present with image and descriptionHtml. Total: {len(nodes)}"
            )
    except Exception as e:
        return log_test("Collections List", False, f"Exception: {str(e)}")

async def test_collection_by_handle():
    """Test 5: GET /api/shopify/collections/raw-dog-food-menu -> returns collection with image and descriptionHtml"""
    print("\n[TEST 5] Testing /api/shopify/collections/raw-dog-food-menu...")
    try:
        async with httpx.AsyncClient(timeout=30.0) as client:
            response = await client.get(f"{API_BASE}/shopify/collections/raw-dog-food-menu")
            
            if response.status_code != 200:
                return log_test(
                    "Collection by Handle",
                    False,
                    f"Expected 200, got {response.status_code}: {response.text}"
                )
            
            collection = response.json()
            
            if "image" not in collection:
                return log_test(
                    "Collection by Handle",
                    False,
                    "Collection missing image field"
                )
            
            if "descriptionHtml" not in collection:
                return log_test(
                    "Collection by Handle",
                    False,
                    "Collection missing descriptionHtml field"
                )
            
            return log_test(
                "Collection by Handle",
                True,
                f"Collection '{collection.get('title')}' has image and descriptionHtml"
            )
    except Exception as e:
        return log_test("Collection by Handle", False, f"Exception: {str(e)}")

async def test_metaobject_by_handle():
    """Test 6: GET /api/shopify/metaobject/homepage_hero/the-freshest-meal-your-dog-has-ever-eaten -> returns fields"""
    print("\n[TEST 6] Testing /api/shopify/metaobject/homepage_hero/the-freshest-meal-your-dog-has-ever-eaten...")
    try:
        async with httpx.AsyncClient(timeout=30.0) as client:
            response = await client.get(
                f"{API_BASE}/shopify/metaobject/homepage_hero/the-freshest-meal-your-dog-has-ever-eaten"
            )
            
            if response.status_code != 200:
                return log_test(
                    "Metaobject by Handle",
                    False,
                    f"Expected 200, got {response.status_code}: {response.text}"
                )
            
            metaobject = response.json()
            
            if "fields" not in metaobject:
                return log_test(
                    "Metaobject by Handle",
                    False,
                    "Metaobject missing fields array"
                )
            
            fields = metaobject.get("fields", [])
            if len(fields) == 0:
                return log_test(
                    "Metaobject by Handle",
                    False,
                    "Metaobject has empty fields array"
                )
            
            return log_test(
                "Metaobject by Handle",
                True,
                f"Metaobject has {len(fields)} fields"
            )
    except Exception as e:
        return log_test("Metaobject by Handle", False, f"Exception: {str(e)}")

async def test_pages_list():
    """Test 7: GET /api/shopify/pages -> returns list of pages (empty body is OK)"""
    print("\n[TEST 7] Testing /api/shopify/pages...")
    try:
        async with httpx.AsyncClient(timeout=30.0) as client:
            response = await client.get(f"{API_BASE}/shopify/pages")
            
            if response.status_code != 200:
                return log_test(
                    "Pages List",
                    False,
                    f"Expected 200, got {response.status_code}: {response.text}"
                )
            
            data = response.json()
            nodes = data.get("nodes", [])
            
            # Empty list is OK, but should have the structure
            if "nodes" not in data:
                return log_test(
                    "Pages List",
                    False,
                    "Response missing 'nodes' field"
                )
            
            return log_test(
                "Pages List",
                True,
                f"Pages endpoint working. Returned {len(nodes)} pages (empty body is expected and OK)"
            )
    except Exception as e:
        return log_test("Pages List", False, f"Exception: {str(e)}")

async def main():
    """Run all tests"""
    print("="*80)
    print("SHOPIFY CATALOG/METAOBJECT BACKEND ENDPOINT TESTING")
    print("Testing 2-level metaobject-reference expansion in queries.py")
    print(f"Base URL: {BASE_URL}")
    print("="*80)
    
    # Run all tests
    await test_shopify_health()
    await test_products_list()
    await test_product_metafield_expansion()
    await test_collections_list()
    await test_collection_by_handle()
    await test_metaobject_by_handle()
    await test_pages_list()
    
    # Print summary
    print_summary()
    
    # Return exit code
    passed = sum(1 for r in test_results if r["passed"])
    total = len(test_results)
    return 0 if passed == total else 1

if __name__ == "__main__":
    import asyncio
    exit_code = asyncio.run(main())
    exit(exit_code)
