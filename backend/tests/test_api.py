"""
FoeGuard API Tests
Tests for products, treats, auth, and checkout endpoints
"""
import pytest
import requests
import os
import uuid

BASE_URL = os.environ.get('REACT_APP_BACKEND_URL', '').rstrip('/')

class TestHealthAndProducts:
    """Test health check and product endpoints"""
    
    def test_api_root(self):
        """Test API root endpoint returns message"""
        response = requests.get(f"{BASE_URL}/api/")
        assert response.status_code == 200
        data = response.json()
        assert "message" in data
        assert data["message"] == "FoeGuard API"
    
    def test_get_products(self):
        """Test products endpoint returns list of products"""
        response = requests.get(f"{BASE_URL}/api/products")
        assert response.status_code == 200
        data = response.json()
        assert isinstance(data, list)
        assert len(data) > 0
        
        # Verify product structure
        product = data[0]
        assert "product_id" in product
        assert "name" in product
        assert "protein_type" in product
        assert "product_line" in product
        assert "pricing" in product
        assert isinstance(product["pricing"], list)
    
    def test_products_have_comfort_dinner_line(self):
        """Test that Comfort Dinner products exist"""
        response = requests.get(f"{BASE_URL}/api/products")
        assert response.status_code == 200
        data = response.json()
        
        comfort_dinner = [p for p in data if p["product_line"] == "comfort_dinner"]
        assert len(comfort_dinner) > 0, "No Comfort Dinner products found"
    
    def test_products_have_primal_feast_line(self):
        """Test that Primal Feast products exist"""
        response = requests.get(f"{BASE_URL}/api/products")
        assert response.status_code == 200
        data = response.json()
        
        primal_feast = [p for p in data if p["product_line"] == "primal_feast"]
        assert len(primal_feast) > 0, "No Primal Feast products found"
    
    def test_get_single_product(self):
        """Test getting a single product by ID"""
        response = requests.get(f"{BASE_URL}/api/products/cd-chicken")
        assert response.status_code == 200
        data = response.json()
        assert data["product_id"] == "cd-chicken"
        assert data["name"] == "Comfort Dinner Chicken"
    
    def test_get_nonexistent_product(self):
        """Test 404 for nonexistent product"""
        response = requests.get(f"{BASE_URL}/api/products/nonexistent-product")
        assert response.status_code == 404


class TestTreats:
    """Test treats endpoint"""
    
    def test_get_treats(self):
        """Test treats endpoint returns list of treats"""
        response = requests.get(f"{BASE_URL}/api/treats")
        assert response.status_code == 200
        data = response.json()
        assert isinstance(data, list)
        assert len(data) > 0
        
        # Verify treat structure
        treat = data[0]
        assert "treat_id" in treat
        assert "name" in treat
        assert "price" in treat
        assert "quantity_description" in treat


class TestStripe:
    """Test Stripe configuration endpoint"""
    
    def test_get_stripe_public_key(self):
        """Test Stripe public key endpoint"""
        response = requests.get(f"{BASE_URL}/api/stripe-public-key")
        assert response.status_code == 200
        data = response.json()
        assert "publicKey" in data
        assert data["publicKey"].startswith("pk_")


class TestAuth:
    """Test authentication endpoints"""
    
    def test_register_new_user(self):
        """Test user registration"""
        unique_email = f"test_{uuid.uuid4().hex[:8]}@test.com"
        response = requests.post(f"{BASE_URL}/api/auth/register", json={
            "email": unique_email,
            "password": "testpass123",
            "name": "Test User"
        })
        assert response.status_code == 200
        data = response.json()
        assert "token" in data
        assert "user" in data
        assert data["user"]["email"] == unique_email
    
    def test_register_missing_fields(self):
        """Test registration with missing fields"""
        response = requests.post(f"{BASE_URL}/api/auth/register", json={
            "email": "test@test.com"
        })
        assert response.status_code == 400
    
    def test_login_invalid_credentials(self):
        """Test login with invalid credentials"""
        response = requests.post(f"{BASE_URL}/api/auth/login", json={
            "email": "nonexistent@test.com",
            "password": "wrongpass"
        })
        assert response.status_code == 401
    
    def test_login_and_get_me(self):
        """Test login and get current user"""
        # First register a user
        unique_email = f"test_{uuid.uuid4().hex[:8]}@test.com"
        register_response = requests.post(f"{BASE_URL}/api/auth/register", json={
            "email": unique_email,
            "password": "testpass123",
            "name": "Test User"
        })
        assert register_response.status_code == 200
        token = register_response.json()["token"]
        
        # Then get current user
        me_response = requests.get(f"{BASE_URL}/api/auth/me", headers={
            "Authorization": f"Bearer {token}"
        })
        assert me_response.status_code == 200
        data = me_response.json()
        assert data["email"] == unique_email
    
    def test_get_me_without_token(self):
        """Test get me without token returns 403"""
        response = requests.get(f"{BASE_URL}/api/auth/me")
        assert response.status_code == 403


class TestOrders:
    """Test order endpoints"""
    
    def test_get_my_orders_without_auth(self):
        """Test getting orders without auth returns 403"""
        response = requests.get(f"{BASE_URL}/api/orders/my-orders")
        assert response.status_code == 403
    
    def test_get_my_orders_with_auth(self):
        """Test getting orders with auth"""
        # Register and get token
        unique_email = f"test_{uuid.uuid4().hex[:8]}@test.com"
        register_response = requests.post(f"{BASE_URL}/api/auth/register", json={
            "email": unique_email,
            "password": "testpass123",
            "name": "Test User"
        })
        token = register_response.json()["token"]
        
        # Get orders
        response = requests.get(f"{BASE_URL}/api/orders/my-orders", headers={
            "Authorization": f"Bearer {token}"
        })
        assert response.status_code == 200
        data = response.json()
        assert isinstance(data, list)


class TestAdminEndpoints:
    """Test admin endpoints"""
    
    def test_admin_orders_without_auth(self):
        """Test admin orders without auth returns 403"""
        response = requests.get(f"{BASE_URL}/api/admin/orders")
        assert response.status_code == 403
    
    def test_admin_orders_with_non_admin(self):
        """Test admin orders with non-admin user returns 403"""
        # Register regular user
        unique_email = f"test_{uuid.uuid4().hex[:8]}@test.com"
        register_response = requests.post(f"{BASE_URL}/api/auth/register", json={
            "email": unique_email,
            "password": "testpass123",
            "name": "Test User"
        })
        token = register_response.json()["token"]
        
        # Try to access admin endpoint
        response = requests.get(f"{BASE_URL}/api/admin/orders", headers={
            "Authorization": f"Bearer {token}"
        })
        assert response.status_code == 403


if __name__ == "__main__":
    pytest.main([__file__, "-v"])
