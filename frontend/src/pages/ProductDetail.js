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
    <div style={{
      background: '#FFFFFF',
      borderRadius: '20px',
      overflow: 'hidden',
      border: '1px solid #E8DDD0'
    }}>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        style={{
          width: '100%',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '20px 24px',
          background: isOpen ? '#FAF8F5' : 'transparent',
          border: 'none',
          cursor: 'pointer',
          fontFamily: 'Crimson Pro, Georgia, serif',
          fontSize: '20px',
          fontWeight: '600',
          color: '#2B2B2B',
          transition: 'background 0.2s ease'
        }}
      >
        <span>{title}</span>
        {isOpen ? <ChevronUp size={20} color="#A41E34" /> : <ChevronDown size={20} color="#A41E34" />}
      </button>
      {isOpen && (
        <div style={{
          padding: '0 24px 24px',
          borderTop: '1px solid #E8DDD0',
          paddingTop: '20px'
        }}>
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

  // Get collection color and name based on product line
  const getCollectionInfo = () => {
    switch(product.product_line) {
      case 'comfort_dinner': return { color: '#5F7C5A', name: 'Comfort Dinner' };
      case 'primal_feast': return { color: '#732827', name: 'Primal Feast' };
      case 'royal_paws': return { color: '#5e4b73', name: 'Royal Paws' };
      default: return { color: '#88302F', name: 'FoeGuard' };
    }
  };

  const collectionInfo = getCollectionInfo();
  const lineName = collectionInfo.name;
  const lineColor = collectionInfo.color;
  const productImage = proteinImages[product.protein_type] || proteinImages.chicken;

  return (
    <>
      <Navbar />
      <div className="product-detail-page" style={{ background: '#F2F4F3', minHeight: '100vh', padding: '0 0 80px' }}>
        <div className="product-detail-wrapper" style={{ maxWidth: '800px', margin: '0 auto', padding: '32px 24px' }}>
          {/* Back Button */}
          <button className="product-back-btn" onClick={() => navigate('/build-box')} style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            background: 'none',
            border: 'none',
            color: lineColor,
            fontFamily: 'Source Sans 3, sans-serif',
            fontSize: '15px',
            fontWeight: '600',
            cursor: 'pointer',
            padding: '12px 0',
            marginBottom: '24px'
          }}>
            <ChevronLeft size={20} />
            <span>Back to Menu</span>
          </button>

          {/* Product Hero */}
          <div className="product-hero" style={{
            background: '#FFFFFF',
            borderRadius: '20px',
            overflow: 'hidden',
            boxShadow: '0 4px 16px rgba(43, 43, 43, 0.08)',
            marginBottom: '24px'
          }}>
            <div className="product-image-container" style={{ position: 'relative', width: '100%', height: '320px', overflow: 'hidden' }}>
              <img 
                src={productImage} 
                alt={product.name}
                className="product-hero-image"
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
              <span className="product-line-tag" style={{
                position: 'absolute',
                top: '20px',
                left: '20px',
                background: lineColor,
                color: '#FFFFFF',
                padding: '8px 20px',
                borderRadius: '100px',
                fontFamily: 'Source Sans 3, sans-serif',
                fontSize: '13px',
                fontWeight: '700',
                textTransform: 'uppercase',
                letterSpacing: '0.05em'
              }}>{lineName}</span>
            </div>
            
            <div className="product-hero-info" style={{ padding: '32px' }}>
              <h1 style={{
                fontFamily: 'Crimson Pro, Georgia, serif',
                fontSize: '36px',
                color: '#2B2B2B',
                margin: '0 0 8px 0',
                lineHeight: '1.2'
              }}>{product.name}</h1>
              <p style={{
                fontSize: '15px',
                color: '#A41E34',
                fontWeight: '600',
                textTransform: 'capitalize',
                margin: '0 0 20px 0'
              }}>{product.protein_type}</p>
              <p style={{
                fontSize: '17px',
                lineHeight: '1.7',
                color: '#3D3D3D',
                margin: '0 0 20px 0',
                whiteSpace: 'pre-line'
              }}>{product.description}</p>
              
              {product.highlights && product.highlights.length > 0 && (
                <div style={{ marginTop: '20px' }}>
                  <h3 style={{ fontSize: '16px', fontWeight: '700', color: '#2B2B2B', margin: '0 0 12px 0' }}>Key Highlights</h3>
                  <ul style={{ margin: 0, paddingLeft: '20px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {product.highlights.map((highlight, i) => (
                      <li key={i} style={{ fontSize: '15px', color: '#3D3D3D', lineHeight: '1.6' }}>{highlight}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>

          {/* Collapsible Sections */}
          <div className="product-details-sections" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <CollapsibleSection title="Ingredients" defaultOpen={true}>
              <ul className="ingredients-grid" style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(2, 1fr)',
                gap: '8px 24px',
                listStyle: 'none',
                padding: 0,
                margin: 0
              }}>
                {product.ingredients.map((ing, i) => (
                  <li key={i} style={{
                    fontSize: '15px',
                    color: '#2B2B2B',
                    padding: '8px 0',
                    borderBottom: '1px solid #E8DDD0'
                  }}>{ing}</li>
                ))}
              </ul>
            </CollapsibleSection>

            <CollapsibleSection title="Nutrition Facts">
              <div className="nutrition-grid-detail" style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
                {Object.entries(product.nutrition_facts).map(([key, value]) => (
                  <div key={key} className="nutrition-row" style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    padding: '12px 0',
                    borderBottom: '1px solid #E8DDD0'
                  }}>
                    <span style={{ color: '#5A5A5A', fontSize: '15px' }}>{key.charAt(0).toUpperCase() + key.slice(1).replace(/_/g, ' ')}</span>
                    <span style={{ fontWeight: '600', color: '#2B2B2B', fontSize: '15px' }}>{value}</span>
                  </div>
                ))}
              </div>
            </CollapsibleSection>

            <CollapsibleSection title="Feeding Guide">
              <div className="feeding-guide">
                <p style={{ fontSize: '15px', lineHeight: '1.7', color: '#3D3D3D', margin: '0 0 20px 0' }}>{product.how_to_use}</p>
                <div style={{ background: '#FAF8F5', padding: '20px', borderRadius: '12px' }}>
                  <h4 style={{
                    fontFamily: 'Source Sans 3, sans-serif',
                    fontSize: '14px',
                    fontWeight: '700',
                    color: '#A41E34',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                    margin: '0 0 12px 0'
                  }}>Tips</h4>
                  <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                    <li style={{ fontSize: '14px', color: '#3D3D3D', padding: '6px 0', paddingLeft: '20px', position: 'relative' }}>
                      <span style={{ position: 'absolute', left: 0, color: '#A41E34' }}>•</span>
                      Thaw in refrigerator for 24 hours before serving
                    </li>
                    <li style={{ fontSize: '14px', color: '#3D3D3D', padding: '6px 0', paddingLeft: '20px', position: 'relative' }}>
                      <span style={{ position: 'absolute', left: 0, color: '#A41E34' }}>•</span>
                      Serve at room temperature for best palatability
                    </li>
                    <li style={{ fontSize: '14px', color: '#3D3D3D', padding: '6px 0', paddingLeft: '20px', position: 'relative' }}>
                      <span style={{ position: 'absolute', left: 0, color: '#A41E34' }}>•</span>
                      Store unused portion in refrigerator for up to 3 days
                    </li>
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
