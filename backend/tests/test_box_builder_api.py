"""
Backend API tests for FoeGuard Box Builder features
Tests: Products, Treats, Places Autocomplete, Checkout with subscription
"""
import pytest
import requests
import os
from datetime import datetime, timedelta

BASE_URL = os.environ.get('REACT_APP_BACKEND_URL', '').rstrip('/')

class TestProductsAPI:
    """Test product-related endpoints"""
    
    def test_get_products_returns_16_products(self):
        """Verify all 16 products (8 Comfort Dinner + 8 Primal Feast) are returned"""
        response = requests.get(f"{BASE_URL}/api/products")
        assert response.status_code == 200
        
        products = response.json()
        assert len(products) == 16
        
        # Verify product structure
        for product in products:
            assert "product_id" in product
            assert "product_line" in product
            assert "protein_type" in product
            assert "pricing" in product
            assert len(product["pricing"]) > 0
    
    def test_products_have_6lb_pricing(self):
        """Verify all products have 6lb pricing tier for box builder"""
        response = requests.get(f"{BASE_URL}/api/products")
        assert response.status_code == 200
        
        products = response.json()
        for product in products:
            pricing_sizes = [p["size_lb"] for p in product["pricing"]]
            assert 6 in pricing_sizes, f"Product {product['product_id']} missing 6lb pricing"
    
    def test_comfort_dinner_products(self):
        """Verify Comfort Dinner product line"""
        response = requests.get(f"{BASE_URL}/api/products")
        assert response.status_code == 200
        
        products = response.json()
        comfort_dinner = [p for p in products if p["product_line"] == "comfort_dinner"]
        assert len(comfort_dinner) == 8
        
        protein_types = [p["protein_type"] for p in comfort_dinner]
        expected_proteins = ["chicken", "beef", "duck", "fish", "goat", "lamb", "rabbit", "turkey"]
        for protein in expected_proteins:
            assert protein in protein_types
    
    def test_primal_feast_products(self):
        """Verify Primal Feast product line"""
        response = requests.get(f"{BASE_URL}/api/products")
        assert response.status_code == 200
        
        products = response.json()
        primal_feast = [p for p in products if p["product_line"] == "primal_feast"]
        assert len(primal_feast) == 8
    
    def test_get_single_product(self):
        """Test getting a single product by ID"""
        response = requests.get(f"{BASE_URL}/api/products/cd-chicken")
        assert response.status_code == 200
        
        product = response.json()
        assert product["product_id"] == "cd-chicken"
        assert product["product_line"] == "comfort_dinner"
        assert product["protein_type"] == "chicken"
    
    def test_get_nonexistent_product(self):
        """Test 404 for non-existent product"""
        response = requests.get(f"{BASE_URL}/api/products/nonexistent")
        assert response.status_code == 404


class TestTreatsAPI:
    """Test treats endpoint"""
    
    def test_get_treats_returns_13_treats(self):
        """Verify all 13 treats are returned"""
        response = requests.get(f"{BASE_URL}/api/treats")
        assert response.status_code == 200
        
        treats = response.json()
        assert len(treats) == 13
    
    def test_treats_have_required_fields(self):
        """Verify treat structure"""
        response = requests.get(f"{BASE_URL}/api/treats")
        assert response.status_code == 200
        
        treats = response.json()
        for treat in treats:
            assert "treat_id" in treat
            assert "name" in treat
            assert "price" in treat
            assert "quantity_description" in treat
            assert isinstance(treat["price"], (int, float))


class TestPlacesAutocompleteAPI:
    """Test Google Places autocomplete endpoint"""
    
    def test_places_autocomplete_returns_predictions(self):
        """Verify autocomplete returns predictions with API key configured"""
        response = requests.post(
            f"{BASE_URL}/api/places/autocomplete",
            json={"input": "123 Queen Street Toronto"}
        )
        assert response.status_code == 200
        
        data = response.json()
        assert "predictions" in data
        assert isinstance(data["predictions"], list)
        # With API key configured, should return actual predictions
        if len(data["predictions"]) > 0:
            pred = data["predictions"][0]
            assert "place_id" in pred
            assert "description" in pred
            assert "main_text" in pred
    
    def test_places_autocomplete_short_input(self):
        """Verify autocomplete returns empty for short input"""
        response = requests.post(
            f"{BASE_URL}/api/places/autocomplete",
            json={"input": "ab"}
        )
        assert response.status_code == 200
        
        data = response.json()
        assert data["predictions"] == []
    
    def test_places_autocomplete_empty_input(self):
        """Verify autocomplete handles empty input"""
        response = requests.post(
            f"{BASE_URL}/api/places/autocomplete",
            json={"input": ""}
        )
        assert response.status_code == 200
        
        data = response.json()
        assert data["predictions"] == []
    
    def test_places_details_without_api_key(self):
        """Verify places details returns empty without API key"""
        response = requests.get(
            f"{BASE_URL}/api/places/details",
            params={"placeId": "test_place_id"}
        )
        assert response.status_code == 200
        
        data = response.json()
        assert "address" in data


class TestStripeAPI:
    """Test Stripe-related endpoints"""
    
    def test_get_stripe_public_key(self):
        """Verify Stripe public key endpoint"""
        response = requests.get(f"{BASE_URL}/api/stripe-public-key")
        assert response.status_code == 200
        
        data = response.json()
        assert "publicKey" in data
        assert data["publicKey"].startswith("pk_test_")


class TestCheckoutAPI:
    """Test checkout and payment endpoints"""
    
    def test_create_payment_intent_basic(self):
        """Test creating a basic payment intent"""
        checkout_data = {
            "customer_email": "test@example.com",
            "customer_name": "Test User",
            "box_size_lb": 12,
            "proteins": [
                {
                    "product_id": "cd-chicken",
                    "product_name": "Comfort Dinner Chicken",
                    "protein_type": "chicken",
                    "quantity_lb": 12,
                    "price": 53.98
                }
            ],
            "treats": [],
            "subtotal": 53.98,
            "tax": 7.02,
            "total": 61.00,
            "is_subscription": False
        }
        
        response = requests.post(
            f"{BASE_URL}/api/create-payment-intent",
            json=checkout_data
        )
        assert response.status_code == 200
        
        data = response.json()
        assert "clientSecret" in data
        assert data["clientSecret"].startswith("pi_")
    
    def test_create_payment_intent_with_subscription(self):
        """Test creating payment intent with subscription (10% discount)"""
        checkout_data = {
            "customer_email": "test@example.com",
            "customer_name": "Test User",
            "box_size_lb": 18,
            "proteins": [
                {
                    "product_id": "cd-chicken",
                    "product_name": "Comfort Dinner Chicken",
                    "protein_type": "chicken",
                    "quantity_lb": 18,
                    "price": 76.95
                }
            ],
            "treats": [],
            "subtotal": 76.95,
            "tax": 10.00,
            "total": 86.95,
            "is_subscription": True
        }
        
        response = requests.post(
            f"{BASE_URL}/api/create-payment-intent",
            json=checkout_data
        )
        assert response.status_code == 200
        
        data = response.json()
        assert "clientSecret" in data
    
    def test_create_payment_intent_with_treats(self):
        """Test creating payment intent with treats"""
        checkout_data = {
            "customer_email": "test@example.com",
            "customer_name": "Test User",
            "box_size_lb": 12,
            "proteins": [
                {
                    "product_id": "cd-beef",
                    "product_name": "Comfort Dinner Beef",
                    "protein_type": "beef",
                    "quantity_lb": 12,
                    "price": 79.94
                }
            ],
            "treats": [
                {
                    "treat_id": "treat-chicken-feet",
                    "name": "Chicken Feet",
                    "quantity": 1,
                    "price": 5.99
                }
            ],
            "subtotal": 85.93,
            "tax": 11.17,
            "total": 97.10,
            "is_subscription": False
        }
        
        response = requests.post(
            f"{BASE_URL}/api/create-payment-intent",
            json=checkout_data
        )
        assert response.status_code == 200
        
        data = response.json()
        assert "clientSecret" in data


class TestAuthAPI:
    """Test authentication endpoints"""
    
    def test_register_new_user(self):
        """Test user registration"""
        import uuid
        unique_email = f"test_{uuid.uuid4().hex[:8]}@example.com"
        
        response = requests.post(
            f"{BASE_URL}/api/auth/register",
            json={
                "email": unique_email,
                "password": "testpass123",
                "name": "Test User"
            }
        )
        assert response.status_code == 200
        
        data = response.json()
        assert "token" in data
        assert "user" in data
        assert data["user"]["email"] == unique_email
    
    def test_register_missing_fields(self):
        """Test registration with missing fields"""
        response = requests.post(
            f"{BASE_URL}/api/auth/register",
            json={"email": "test@example.com"}
        )
        assert response.status_code == 400
    
    def test_login_invalid_credentials(self):
        """Test login with invalid credentials"""
        response = requests.post(
            f"{BASE_URL}/api/auth/login",
            json={
                "email": "nonexistent@example.com",
                "password": "wrongpass"
            }
        )
        assert response.status_code == 401


class TestAPIRoot:
    """Test API root endpoint"""
    
    def test_api_root(self):
        """Test API root returns message"""
        response = requests.get(f"{BASE_URL}/api/")
        assert response.status_code == 200
        
        data = response.json()
        assert "message" in data
        assert data["message"] == "FoeGuard API"


if __name__ == "__main__":
    pytest.main([__file__, "-v"])
