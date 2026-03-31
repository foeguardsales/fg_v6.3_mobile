import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Navbar, Footer } from '../components/Layout';
import { ChevronLeft } from 'lucide-react';
import { CartDrawer } from '../components/CartAndCheckout';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:8001';

const CollapsibleSection = ({ title, children, defaultOpen = false }) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div style={{
      border: '1px solid #E8DDD0',
      borderRadius: '12px',
      overflow: 'hidden',
      background: '#fff'
    }}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        style={{
          width: '100%',
          padding: '20px 24px',
          background: 'transparent',
          border: 'none',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          cursor: 'pointer',
          fontFamily: "'Rubik', sans-serif",
          fontSize: '18px',
          fontWeight: '600',
          color: '#2B2B2B',
          textAlign: 'left'
        }}
      >
        {title}
        <span style={{
          fontSize: '24px',
          transition: 'transform 0.3s ease',
          transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)'
        }}>▼</span>
      </button>
      {isOpen && (
        <div style={{ padding: '0 24px 24px 24px' }}>
          {children}
        </div>
      )}
    </div>
  );
};

export const TreatDetailPage = () => {
  const { treatId } = useParams();
  const navigate = useNavigate();
  const [treat, setTreat] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [cartOpen, setCartOpen] = useState(false);
  
  // Initialize from sessionStorage immediately
  const initialBoxSize = parseInt(sessionStorage.getItem('boxSize')) || 18;
  const initialProteins = JSON.parse(sessionStorage.getItem('selectedProteins') || '{}');
  const initialTreats = JSON.parse(sessionStorage.getItem('selectedTreats') || '[]');
  
  const [boxSize, setBoxSize] = useState(initialBoxSize);
  const [selectedProteins, setSelectedProteins] = useState(initialProteins);
  const [selectedTreats, setSelectedTreats] = useState(initialTreats);
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const root = document.getElementById('root');
    if (root) root.scrollTop = 0;
    
    // Sync with sessionStorage whenever the page becomes visible
    const syncFromStorage = () => {
      const savedBoxSize = parseInt(sessionStorage.getItem('boxSize'));
      const savedProteins = JSON.parse(sessionStorage.getItem('selectedProteins') || '{}');
      const savedTreats = JSON.parse(sessionStorage.getItem('selectedTreats') || '[]');
      
      if (savedBoxSize && savedBoxSize !== boxSize) setBoxSize(savedBoxSize);
      setSelectedProteins(savedProteins);
      setSelectedTreats(savedTreats);
    };
    
    // Sync on mount and when window regains focus
    syncFromStorage();
    window.addEventListener('focus', syncFromStorage);
    
    const fetchTreat = async () => {
      try {
        const response = await axios.get(`${BACKEND_URL}/api/treats`);
        const foundTreat = response.data.find(t => t.treat_id === treatId);
        setTreat(foundTreat);
      } catch (error) {
        console.error('Error fetching treat:', error);
      } finally {
        setLoading(false);
      }
    };
    
    // Load all products for pricing
    axios.get(`${BACKEND_URL}/api/products`)
      .then(res => setProducts(res.data))
      .catch(err => console.error('Error loading products:', err));
    
    fetchTreat();
    
    return () => {
      window.removeEventListener('focus', syncFromStorage);
    };
  }, [treatId]);

  const handleBackToMenu = () => {
    navigate('/build-box');
  };
  
  // Discount rates by box size
  const DISCOUNT_RATES = {
    12: 0,
    18: 0.05,
    24: 0.10,
    30: 0.15
  };
  
  const getBasePrice = (prod) => {
    const pricing = prod.pricing.find(p => p.size_lb === 6);
    return pricing ? pricing.price : 0;
  };
  
  const getDiscountedPrice = (prod) => {
    const basePrice = getBasePrice(prod);
    const discount = DISCOUNT_RATES[boxSize] || 0;
    return basePrice * (1 - discount);
  };
  
  const handleAddToCart = () => {
    // Add treat to cart
    const updatedTreats = [...selectedTreats];
    const existingIndex = updatedTreats.findIndex(t => t.treat_id === treat.treat_id);
    
    if (existingIndex >= 0) {
      updatedTreats[existingIndex].quantity = quantity;
    } else {
      updatedTreats.push({
        treat_id: treat.treat_id,
        name: treat.name,
        price: treat.price,
        quantity: quantity
      });
    }
    
    setSelectedTreats(updatedTreats);
    sessionStorage.setItem('selectedTreats', JSON.stringify(updatedTreats));
    sessionStorage.setItem('boxSize', boxSize.toString());
    
    // Open cart drawer
    setCartOpen(true);
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <div style={{ padding: '60px 20px', textAlign: 'center' }}>Loading...</div>
        <Footer />
      </>
    );
  }

  if (!treat) {
    return (
      <>
        <Navbar />
        <div style={{ padding: '60px 20px', textAlign: 'center' }}>
          <h2>Treat not found</h2>
          <button onClick={handleBackToMenu} style={{ marginTop: '20px', padding: '12px 24px', background: '#A41E34', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer' }}>
            Back to Menu
          </button>
        </div>
        <Footer />
      </>
    );
  }

  const images = treat.images || (treat.image ? [treat.image] : []);
  const currentImage = images[selectedImageIndex] || treat.image;

  return (
    <>
      <Navbar />
      <CartDrawer
        isOpen={cartOpen}
        onClose={() => setCartOpen(false)}
        boxSize={boxSize}
        selectedProteins={selectedProteins}
        selectedTreats={selectedTreats}
        products={products}
        onProceed={() => navigate('/build-box')}
        getDiscountedPrice={getDiscountedPrice}
        getBasePrice={getBasePrice}
        onAdjustProtein={(productId, productName, newQty) => {
          setSelectedProteins(prev => {
            const updated = { 
              ...prev, 
              [productId]: { qty: newQty, name: productName }
            };
            sessionStorage.setItem('selectedProteins', JSON.stringify(updated));
            return updated;
          });
        }}
        onRemoveProtein={(productId) => {
          setSelectedProteins(prev => {
            const updated = { ...prev };
            delete updated[productId];
            sessionStorage.setItem('selectedProteins', JSON.stringify(updated));
            return updated;
          });
        }}
        onRemoveTreat={(treatId) => {
          setSelectedTreats(prev => {
            const updated = prev.filter(t => t.treat_id !== treatId);
            sessionStorage.setItem('selectedTreats', JSON.stringify(updated));
            return updated;
          });
        }}
      />
      
      {/* Floating Cart Button */}
      <button
        onClick={() => setCartOpen(true)}
        style={{
          position: 'fixed',
          bottom: '24px',
          right: '24px',
          background: '#88302F',
          color: '#fff',
          border: 'none',
          borderRadius: '50px',
          padding: '16px 24px',
          fontSize: '16px',
          fontWeight: '600',
          cursor: 'pointer',
          boxShadow: '0 4px 12px rgba(136, 48, 47, 0.3)',
          zIndex: 999,
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          transition: 'all 0.2s'
        }}
        onMouseEnter={(e) => {
          e.target.style.background = '#732827';
          e.target.style.transform = 'translateY(-2px)';
          e.target.style.boxShadow = '0 6px 16px rgba(136, 48, 47, 0.4)';
        }}
        onMouseLeave={(e) => {
          e.target.style.background = '#88302F';
          e.target.style.transform = 'translateY(0)';
          e.target.style.boxShadow = '0 4px 12px rgba(136, 48, 47, 0.3)';
        }}
      >
        <span style={{ fontSize: '20px' }}>🛒</span>
        <span>
          {Object.values(selectedProteins).reduce((sum, p) => sum + p.qty, 0)}/{boxSize}lb
        </span>
        <span style={{ fontSize: '18px' }}>→</span>
      </button>
      
      <div className="product-detail-page" style={{ background: '#FDFCFA', minHeight: '100vh', paddingTop: '80px' }}>
        <div className="product-detail-container" style={{ maxWidth: '1200px', margin: '0 auto', padding: '40px 20px' }}>
          <button
            onClick={handleBackToMenu}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              background: 'none',
              border: 'none',
              color: '#A41E34',
              fontFamily: "'Rubik', sans-serif",
              fontSize: '15px',
              fontWeight: '600',
              cursor: 'pointer',
              padding: '12px 0',
              marginBottom: '24px'
            }}
          >
            <ChevronLeft size={20} />
            <span>Back to Menu</span>
          </button>

          <div className="product-detail-content" style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '40px',
            marginBottom: '80px'
          }}>
            <div style={{ marginBottom: '20px' }}>
              {/* Main Image */}
              <div className="product-hero-image" style={{
                background: '#fff',
                borderRadius: '16px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                aspectRatio: '1/1',
                padding: '0',
                marginBottom: images.length > 1 ? '20px' : '0',
                overflow: 'hidden'
              }}>
                {currentImage ? (
                  <img src={currentImage} alt={treat.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : (
                  <div style={{ textAlign: 'center', color: '#999' }}>
                    <div style={{ fontSize: '80px', marginBottom: '16px' }}>🦴</div>
                    <p style={{ fontSize: '18px', color: '#999' }}>Image coming soon</p>
                  </div>
                )}
              </div>
              
              {/* Image Thumbnails */}
              {images.length > 1 && (
                <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
                  {images.map((img, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImageIndex(index)}
                      style={{
                        width: '80px',
                        height: '80px',
                        borderRadius: '8px',
                        overflow: 'hidden',
                        border: selectedImageIndex === index ? '3px solid #A41E34' : '2px solid #E8DDD0',
                        padding: '4px',
                        background: '#F5F1EB',
                        cursor: 'pointer',
                        transition: 'border-color 0.2s'
                      }}
                    >
                      <img src={img} alt={`${treat.name} ${index + 1}`} style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '4px' }} />
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="product-hero-info" style={{ padding: '32px' }}>
              <h1 style={{
                fontFamily: "'Rubik', sans-serif",
                fontSize: '36px',
                color: '#2B2B2B',
                margin: '0 0 20px 0',
                lineHeight: '1.2'
              }}>{treat.name}</h1>
              
              <div style={{ marginBottom: '24px' }}>
                <span style={{ fontSize: '32px', fontWeight: '600', color: '#A41E34' }}>${treat.price.toFixed(2)}</span>
                <p style={{ fontSize: '15px', color: '#666', margin: '8px 0 0 0' }}>{treat.quantity_description}</p>
              </div>

              {treat.description && (
                <div style={{ marginTop: '20px' }}>
                  <p style={{
                    fontSize: '15px',
                    lineHeight: '1.7',
                    color: '#3D3D3D',
                    whiteSpace: 'pre-line'
                  }}>{treat.description}</p>
                </div>
              )}

              {/* Quantity Selector and Add to Cart */}
              <div style={{ 
                marginTop: '32px',
                display: 'flex',
                flexDirection: 'column',
                gap: '16px'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: '15px', fontWeight: '600', color: '#2B2B2B' }}>Quantity</span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <button
                      onClick={() => quantity > 1 && setQuantity(quantity - 1)}
                      style={{
                        width: '36px',
                        height: '36px',
                        borderRadius: '50%',
                        border: '2px solid #88302F',
                        background: '#fff',
                        color: '#88302F',
                        fontSize: '20px',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}
                    >
                      −
                    </button>
                    <span style={{ 
                      minWidth: '40px', 
                      textAlign: 'center', 
                      fontSize: '20px', 
                      fontWeight: '600',
                      color: '#2B2B2B'
                    }}>
                      {quantity}
                    </span>
                    <button
                      onClick={() => setQuantity(quantity + 1)}
                      style={{
                        width: '36px',
                        height: '36px',
                        borderRadius: '50%',
                        border: '2px solid #88302F',
                        background: '#fff',
                        color: '#88302F',
                        fontSize: '20px',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}
                    >
                      +
                    </button>
                  </div>
                </div>
                <button
                  onClick={handleAddToCart}
                  style={{
                    width: '100%',
                    padding: '14px 24px',
                    background: '#88302F',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '8px',
                    fontSize: '16px',
                    fontWeight: '600',
                    cursor: 'pointer',
                    transition: 'background 0.2s'
                  }}
                  onMouseEnter={(e) => e.target.style.background = '#732827'}
                  onMouseLeave={(e) => e.target.style.background = '#88302F'}
                >
                  Add to Box
                </button>
              </div>
            </div>
          </div>

          {/* Collapsible Sections */}
          <div className="product-details-sections" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {treat.ingredients && (
              <CollapsibleSection title="Ingredients" defaultOpen={true}>
                <p style={{ fontSize: '15px', color: '#3D3D3D', lineHeight: '1.7', margin: 0 }}>
                  {typeof treat.ingredients === 'string' ? treat.ingredients : (treat.ingredients || []).join(', ')}
                </p>
              </CollapsibleSection>
            )}

            {treat.benefits && treat.benefits.length > 0 && (
              <CollapsibleSection title="Benefits">
                <ul style={{ margin: 0, paddingLeft: '20px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {treat.benefits.map((benefit, i) => (
                    <li key={i} style={{ fontSize: '15px', color: '#3D3D3D', lineHeight: '1.6' }}>{benefit}</li>
                  ))}
                </ul>
              </CollapsibleSection>
            )}

            <CollapsibleSection title="Feeding Guide">
              <div className="feeding-guide">
                <div style={{ marginBottom: '20px' }}>
                  <h4 style={{ fontSize: '15px', fontWeight: '600', color: '#2B2B2B', margin: '0 0 8px 0' }}>Feeding Instructions</h4>
                  <p style={{ fontSize: '15px', lineHeight: '1.7', color: '#3D3D3D', margin: 0 }}>
                    {treat.feeding_guide?.feeding || 'Feed as a treat or meal topper. Always supervise your pet while enjoying treats.'}
                  </p>
                </div>
                <div style={{ marginBottom: '20px' }}>
                  <h4 style={{ fontSize: '15px', fontWeight: '600', color: '#2B2B2B', margin: '0 0 8px 0' }}>Handling Instructions</h4>
                  <p style={{ fontSize: '15px', lineHeight: '1.7', color: '#3D3D3D', margin: 0 }}>
                    {treat.feeding_guide?.handling || 'Keep frozen until ready to use. Thaw in refrigerator before serving. Use within 3 days of thawing.'}
                  </p>
                </div>
                <div style={{ background: '#FAF8F5', padding: '16px', borderRadius: '12px' }}>
                  <p style={{ fontSize: '14px', color: '#3D3D3D', margin: 0 }}>
                    <a href="/calculator" style={{ color: '#A41E34', textDecoration: 'underline', fontWeight: '600' }}>See our feeding calculator</a> to see how much to feed your pet.
                  </p>
                </div>
              </div>
            </CollapsibleSection>

            <CollapsibleSection title="Product Information">
              <p style={{ fontSize: '15px', lineHeight: '1.7', color: '#3D3D3D', margin: 0, whiteSpace: 'pre-line' }}>
                {treat.product_information || `${treat.name} is a natural, single-ingredient treat perfect for dogs of all sizes. Rich in nutrients and highly palatable, these treats are ideal for training, enrichment, or as a special reward. Always supervise your pet when feeding treats.`}
              </p>
            </CollapsibleSection>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};
