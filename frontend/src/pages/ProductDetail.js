import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Navbar, Footer } from '../components/Layout';
import { ChevronLeft, ChevronDown, ChevronUp } from 'lucide-react';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

// Protein type to image mapping (placeholder - will be replaced with actual images)
const proteinImages = {
  chicken: 'https://images.unsplash.com/photo-1587593810167-a84920ea0781?w=600&h=400&fit=crop',
  beef: 'https://images.unsplash.com/photo-1588347818036-558601350947?w=600&h=400&fit=crop',
  duck: 'https://images.unsplash.com/photo-1606728035253-49e8a23146de?w=600&h=400&fit=crop',
  fish: 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=600&h=400&fit=crop',
  lamb: 'https://images.unsplash.com/photo-1603048297172-c92544798d5a?w=600&h=400&fit=crop',
  turkey: 'https://images.unsplash.com/photo-1574672280600-4accfa5b6f98?w=600&h=400&fit=crop',
  venison: 'https://images.unsplash.com/photo-1608039755401-742074f0548d?w=600&h=400&fit=crop',
  bison: 'https://images.unsplash.com/photo-1551028150-64b9f398f678?w=600&h=400&fit=crop'
};

const CollapsibleSection = ({ title, children, defaultOpen = false }) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  
  return (
    <div className="collapsible-section">
      <button 
        className="collapsible-header"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span>{title}</span>
        {isOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
      </button>
      {isOpen && (
        <div className="collapsible-content">
          {children}
        </div>
      )}
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

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="product-detail-loading">
          <div className="loading-spinner"></div>
          <p>Loading product...</p>
        </div>
        <Footer />
      </>
    );
  }

  if (!product) {
    return (
      <>
        <Navbar />
        <div className="product-detail-not-found">
          <h2>Product not found</h2>
          <button className="btn-primary" onClick={() => navigate('/build-box')}>
            Back to Menu
          </button>
        </div>
        <Footer />
      </>
    );
  }

  const lineName = product.product_line === 'comfort_dinner' ? 'Comfort Dinner' : 'Primal Feast';
  const productImage = proteinImages[product.protein_type] || proteinImages.chicken;

  return (
    <>
      <Navbar />
      <div className="product-detail-page">
        <div className="product-detail-wrapper">
          {/* Back Button */}
          <button className="product-back-btn" onClick={() => navigate('/build-box')}>
            <ChevronLeft size={20} />
            <span>Back to Menu</span>
          </button>

          {/* Product Hero */}
          <div className="product-hero">
            <div className="product-image-container">
              <img 
                src={productImage} 
                alt={product.name}
                className="product-hero-image"
              />
              <span className="product-line-tag">{lineName}</span>
            </div>
            
            <div className="product-hero-info">
              <h1 className="product-title">{product.name}</h1>
              <p className="product-protein-type">{product.protein_type}</p>
              <p className="product-description">{product.description}</p>
            </div>
          </div>

          {/* Collapsible Sections */}
          <div className="product-details-sections">
            <CollapsibleSection title="Ingredients" defaultOpen={true}>
              <ul className="ingredients-grid">
                {product.ingredients.map((ing, i) => (
                  <li key={i}>{ing}</li>
                ))}
              </ul>
            </CollapsibleSection>

            <CollapsibleSection title="Nutrition Facts">
              <div className="nutrition-grid-detail">
                {Object.entries(product.nutrition_facts).map(([key, value]) => (
                  <div key={key} className="nutrition-row">
                    <span className="nutrition-key">{key.charAt(0).toUpperCase() + key.slice(1).replace(/_/g, ' ')}</span>
                    <span className="nutrition-val">{value}</span>
                  </div>
                ))}
              </div>
            </CollapsibleSection>

            <CollapsibleSection title="Feeding Guide">
              <div className="feeding-guide">
                <p>{product.how_to_use}</p>
                <div className="feeding-tips">
                  <h4>Tips</h4>
                  <ul>
                    <li>Thaw in refrigerator for 24 hours before serving</li>
                    <li>Serve at room temperature for best palatability</li>
                    <li>Store unused portion in refrigerator for up to 3 days</li>
                  </ul>
                </div>
              </div>
            </CollapsibleSection>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};
