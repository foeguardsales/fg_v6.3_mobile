"""
Backend API Testing for Shopify Catalog/Metaobject Endpoints
Tests the 3-level metaobject-reference expansion in METAOBJECT_BY_HANDLE_QUERY
Specifically tests FAQ and How It Works sections with deep nested references
"""
import httpx
import json
import os
from pathlib import Path

# Load environment variables to get the backend URL
from dotenv import load_dotenv
load_dotenv(Path(__file__).parent / 'frontend' / '.env')

BASE_URL = os.environ.get('REACT_APP_BACKEND_URL', 'https://git-fresh-site.preview.emergentagent.com')
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

async def test_faq_section_3level_expansion():
    """Test 8: GET /api/shopify/metaobject/frequently_asked_questions_section/home_faq_section
    -> verify 3-level expansion: faq_category_groups -> faq_category_items with faq_question/faq_answer"""
    print("\n[TEST 8] Testing /api/shopify/metaobject/frequently_asked_questions_section/home_faq_section...")
    try:
        async with httpx.AsyncClient(timeout=30.0) as client:
            response = await client.get(
                f"{API_BASE}/shopify/metaobject/frequently_asked_questions_section/home_faq_section"
            )
            
            if response.status_code != 200:
                return log_test(
                    "FAQ Section 3-Level Expansion",
                    False,
                    f"Expected 200, got {response.status_code}: {response.text}"
                )
            
            metaobject = response.json()
            fields = metaobject.get("fields", [])
            
            if not fields:
                return log_test(
                    "FAQ Section 3-Level Expansion",
                    False,
                    "Metaobject has no fields"
                )
            
            # Find faq_category_groups field
            faq_category_groups_field = None
            for field in fields:
                if field.get("key") == "faq_category_groups":
                    faq_category_groups_field = field
                    break
            
            if not faq_category_groups_field:
                return log_test(
                    "FAQ Section 3-Level Expansion",
                    False,
                    "Missing field: faq_category_groups"
                )
            
            # Check references.nodes (level 1: category groups)
            references = faq_category_groups_field.get("references", {})
            category_groups = references.get("nodes", [])
            
            if not category_groups:
                return log_test(
                    "FAQ Section 3-Level Expansion",
                    False,
                    "faq_category_groups has no references.nodes (category groups)"
                )
            
            # Check first category group has faq_category_items field (level 2)
            first_group = category_groups[0]
            group_fields = first_group.get("fields", [])
            
            faq_category_items_field = None
            for field in group_fields:
                if field.get("key") == "faq_category_items":
                    faq_category_items_field = field
                    break
            
            if not faq_category_items_field:
                return log_test(
                    "FAQ Section 3-Level Expansion",
                    False,
                    "Category group missing field: faq_category_items"
                )
            
            # Check faq_category_items has references.nodes (level 3: individual Q&A items)
            items_references = faq_category_items_field.get("references", {})
            qa_items = items_references.get("nodes", [])
            
            if not qa_items:
                return log_test(
                    "FAQ Section 3-Level Expansion",
                    False,
                    "faq_category_items has no references.nodes (Q&A items) - 3rd level expansion FAILED"
                )
            
            # Check first Q&A item has faq_question and faq_answer fields
            first_qa = qa_items[0]
            qa_fields = first_qa.get("fields", [])
            qa_field_keys = [f.get("key") for f in qa_fields]
            
            if "faq_question" not in qa_field_keys:
                return log_test(
                    "FAQ Section 3-Level Expansion",
                    False,
                    "Q&A item missing field: faq_question"
                )
            
            if "faq_answer" not in qa_field_keys:
                return log_test(
                    "FAQ Section 3-Level Expansion",
                    False,
                    "Q&A item missing field: faq_answer"
                )
            
            # Get sample question text
            faq_question_field = next((f for f in qa_fields if f.get("key") == "faq_question"), None)
            sample_question = faq_question_field.get("value", "N/A") if faq_question_field else "N/A"
            
            return log_test(
                "FAQ Section 3-Level Expansion",
                True,
                f"3-level expansion SUCCESS. Found {len(category_groups)} category groups, "
                f"{len(qa_items)} Q&A items in first group. Sample question: '{sample_question[:50]}...'"
            )
    except Exception as e:
        return log_test("FAQ Section 3-Level Expansion", False, f"Exception: {str(e)}")

async def test_how_it_works_section():
    """Test 9: GET /api/shopify/metaobject/home_how_it_works_section/home_howitworks_sections_1
    -> verify how_it_works_card with at least 3 cards having how_it_works_title and how_it_works_body"""
    print("\n[TEST 9] Testing /api/shopify/metaobject/home_how_it_works_section/home_howitworks_sections_1...")
    try:
        async with httpx.AsyncClient(timeout=30.0) as client:
            response = await client.get(
                f"{API_BASE}/shopify/metaobject/home_how_it_works_section/home_howitworks_sections_1"
            )
            
            if response.status_code != 200:
                return log_test(
                    "How It Works Section",
                    False,
                    f"Expected 200, got {response.status_code}: {response.text}"
                )
            
            metaobject = response.json()
            fields = metaobject.get("fields", [])
            
            if not fields:
                return log_test(
                    "How It Works Section",
                    False,
                    "Metaobject has no fields"
                )
            
            # Find how_it_works_card field
            how_it_works_card_field = None
            for field in fields:
                if field.get("key") == "how_it_works_card":
                    how_it_works_card_field = field
                    break
            
            if not how_it_works_card_field:
                return log_test(
                    "How It Works Section",
                    False,
                    "Missing field: how_it_works_card"
                )
            
            # Check references.nodes (cards)
            references = how_it_works_card_field.get("references", {})
            cards = references.get("nodes", [])
            
            if len(cards) < 3:
                return log_test(
                    "How It Works Section",
                    False,
                    f"Expected at least 3 cards, got {len(cards)}"
                )
            
            # Check each card has how_it_works_title and how_it_works_body
            for i, card in enumerate(cards):
                card_fields = card.get("fields", [])
                card_field_keys = [f.get("key") for f in card_fields]
                
                if "how_it_works_title" not in card_field_keys:
                    return log_test(
                        "How It Works Section",
                        False,
                        f"Card {i} missing field: how_it_works_title"
                    )
                
                if "how_it_works_body" not in card_field_keys:
                    return log_test(
                        "How It Works Section",
                        False,
                        f"Card {i} missing field: how_it_works_body"
                    )
            
            # Get sample title from first card
            first_card_fields = cards[0].get("fields", [])
            title_field = next((f for f in first_card_fields if f.get("key") == "how_it_works_title"), None)
            sample_title = title_field.get("value", "N/A") if title_field else "N/A"
            
            return log_test(
                "How It Works Section",
                True,
                f"Found {len(cards)} cards, all with how_it_works_title and how_it_works_body. "
                f"Sample title: '{sample_title}'"
            )
    except Exception as e:
        return log_test("How It Works Section", False, f"Exception: {str(e)}")

async def test_regression_products():
    """Test 10: Regression - GET /api/shopify/products?first=3 -> returns products array"""
    print("\n[TEST 10] Regression - Testing /api/shopify/products?first=3...")
    try:
        async with httpx.AsyncClient(timeout=30.0) as client:
            response = await client.get(f"{API_BASE}/shopify/products?first=3")
            
            if response.status_code != 200:
                return log_test(
                    "Regression: Products",
                    False,
                    f"Expected 200, got {response.status_code}: {response.text}"
                )
            
            data = response.json()
            products = data.get("products", [])
            
            if len(products) < 1:
                return log_test(
                    "Regression: Products",
                    False,
                    "No products returned"
                )
            
            return log_test(
                "Regression: Products",
                True,
                f"Returned {len(products)} products"
            )
    except Exception as e:
        return log_test("Regression: Products", False, f"Exception: {str(e)}")

async def test_regression_pages():
    """Test 11: Regression - GET /api/shopify/pages?first=5 -> returns nodes"""
    print("\n[TEST 11] Regression - Testing /api/shopify/pages?first=5...")
    try:
        async with httpx.AsyncClient(timeout=30.0) as client:
            response = await client.get(f"{API_BASE}/shopify/pages?first=5")
            
            if response.status_code != 200:
                return log_test(
                    "Regression: Pages",
                    False,
                    f"Expected 200, got {response.status_code}: {response.text}"
                )
            
            data = response.json()
            
            if "nodes" not in data:
                return log_test(
                    "Regression: Pages",
                    False,
                    "Response missing 'nodes' field"
                )
            
            return log_test(
                "Regression: Pages",
                True,
                f"Returned {len(data.get('nodes', []))} pages"
            )
    except Exception as e:
        return log_test("Regression: Pages", False, f"Exception: {str(e)}")

async def test_regression_hero_metaobject():
    """Test 12: Regression - GET /api/shopify/metaobject/homepage_hero/the-freshest-meal-your-dog-has-ever-eaten
    -> returns hero fields including cta_button"""
    print("\n[TEST 12] Regression - Testing homepage_hero metaobject...")
    try:
        async with httpx.AsyncClient(timeout=30.0) as client:
            response = await client.get(
                f"{API_BASE}/shopify/metaobject/homepage_hero/the-freshest-meal-your-dog-has-ever-eaten"
            )
            
            if response.status_code != 200:
                return log_test(
                    "Regression: Hero Metaobject",
                    False,
                    f"Expected 200, got {response.status_code}: {response.text}"
                )
            
            metaobject = response.json()
            fields = metaobject.get("fields", [])
            
            if not fields:
                return log_test(
                    "Regression: Hero Metaobject",
                    False,
                    "Metaobject has no fields"
                )
            
            # Check for cta_button field
            field_keys = [f.get("key") for f in fields]
            if "cta_button" not in field_keys:
                return log_test(
                    "Regression: Hero Metaobject",
                    False,
                    "Missing field: cta_button"
                )
            
            return log_test(
                "Regression: Hero Metaobject",
                True,
                f"Hero metaobject has {len(fields)} fields including cta_button"
            )
    except Exception as e:
        return log_test("Regression: Hero Metaobject", False, f"Exception: {str(e)}")

async def test_regression_collection_with_products():
    """Test 13: Regression - GET /api/shopify/collections/raw-dog-food -> returns collection with products"""
    print("\n[TEST 13] Regression - Testing /api/shopify/collections/raw-dog-food...")
    try:
        async with httpx.AsyncClient(timeout=30.0) as client:
            response = await client.get(f"{API_BASE}/shopify/collections/raw-dog-food")
            
            if response.status_code != 200:
                return log_test(
                    "Regression: Collection with Products",
                    False,
                    f"Expected 200, got {response.status_code}: {response.text}"
                )
            
            collection = response.json()
            
            if "products" not in collection:
                return log_test(
                    "Regression: Collection with Products",
                    False,
                    "Collection missing 'products' field"
                )
            
            products = collection.get("products", {})
            nodes = products.get("nodes", [])
            
            return log_test(
                "Regression: Collection with Products",
                True,
                f"Collection '{collection.get('title')}' has {len(nodes)} products"
            )
    except Exception as e:
        return log_test("Regression: Collection with Products", False, f"Exception: {str(e)}")

async def main():
    """Run all tests"""
    print("="*80)
    print("SHOPIFY CATALOG/METAOBJECT BACKEND ENDPOINT TESTING")
    print("Testing 3-level metaobject-reference expansion for FAQ and How It Works")
    print(f"Base URL: {BASE_URL}")
    print("="*80)
    
    # Core tests - health check
    await test_shopify_health()
    
    # NEW TESTS - 3-level expansion for FAQ and How It Works
    await test_faq_section_3level_expansion()
    await test_how_it_works_section()
    
    # REGRESSION TESTS - ensure existing endpoints still work
    await test_regression_products()
    await test_regression_pages()
    await test_regression_hero_metaobject()
    await test_regression_collection_with_products()
    
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
