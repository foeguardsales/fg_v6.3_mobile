import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Navbar, Footer } from '../components/Layout';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const IngredientsList = ({ items }) => (
  <ul className="ingredients-list">
    {items.map((ing, i) => <li key={i}>{ing}</li>)}
  </ul>
);

const NutritionGrid = ({ facts }) => {
  const entries = Object.entries(facts);
  return (
    <div className="nutrition-grid">
      {entries.map(([k, v], i) => (
        <div key={k} className="nutrition-item" style={k === 'calories' ? {gridColumn: '1 / -1'} : {}}>
          <span className="nutrition-label">{k.charAt(0).toUpperCase() + k.slice(1)}</span>
          <span className="nutrition-value">{v}</span>
        </div>
      ))}
    </div>
  );
};

const PricingCards = ({ tiers }) => {
  const sizes = tiers.filter(t => t.size_lb >= 12);
  return (
    <div className="pricing-grid">
      {sizes.map(t => (
        <div key={t.size_lb} className="price-card">
          <div className="price-size">{t.size_lb}lb</div>
          <div className="price-amount">${t.price.toFixed(2)}</div>
          <div className="price-per-lb">${t.price_per_lb.toFixed(2)}/lb</div>
          {t.savings_percent > 0 && <span className="savings-badge">Save {t.savings_percent}%</span>}
        </div>
      ))}
    </div>
  );
};

export const ProductDetailPage = () => {
  const { productId } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get(`${API}/products/${productId}`)
      .then(res => setProduct(res.data))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, [productId]);

  if (loading) return <div style={{ padding: '60px', textAlign: 'center' }}>Loading...</div>;
  if (!product) return <div style={{ padding: '60px', textAlign: 'center' }}>Product not found</div>;

  const lineName = product.product_line === 'comfort_dinner' ? 'Comfort Dinner' : 'Primal Feast';

  return (
    <>
      <Navbar />
      <div className="product-detail-page">
        <div className="product-detail-container">
          <button className="back-link" onClick={() => navigate('/build-box')}>
            ← Back to Box Builder
          </button>
          
          <div className="product-detail-hero">
            <h1 className="product-detail-title">{product.name}</h1>
            <div className="product-line-badge-large">{lineName}</div>
          </div>

          <div className="product-detail-grid">
            <div className="product-detail-left">
              <h3>Ingredients</h3>
              <IngredientsList items={product.ingredients} />
            </div>

            <div className="product-detail-center">
              <div className="bowl-visual">
                <div className="bowl-icon">🍖</div>
                <p className="bowl-label">{product.protein_type}</p>
              </div>
            </div>

            <div className="product-detail-right">
              <h3>About This Recipe</h3>
              <p className="product-description">{product.description}</p>
              
              <div className="nutrition-section">
                <h3>Nutrition Facts</h3>
                <NutritionGrid facts={product.nutrition_facts} />
              </div>

              <div className="how-to-use-section">
                <h3>How to Use</h3>
                <p>{product.how_to_use}</p>
              </div>
            </div>
          </div>

          <div className="pricing-section">
            <h3>Available Sizes</h3>
            <PricingCards tiers={product.pricing} />
          </div>

          <div style={{ textAlign: 'center', marginTop: '40px' }}>
            <button 
              className="btn-primary" 
              style={{ maxWidth: '400px', padding: '16px 48px' }}
              onClick={() => navigate('/build-box')}
            >
              Add to Your Box
            </button>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};
