import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Navbar, Footer } from '../components/Layout';
import { ChevronLeft, X } from 'lucide-react';
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
          fontFamily: "'Barlow', sans-serif",
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
  const [orderNotes, setOrderNotes] = useState('');
  const [activeTab, setActiveTab] = useState('description');
  
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

  // Listen for global "open cart" event (header cart icon)
  useEffect(() => {
    const open = () => setCartOpen(true);
    window.addEventListener('foeguard:open-cart', open);
    return () => window.removeEventListener('foeguard:open-cart', open);
  }, []);

  const handleBackToMenu = () => {
    navigate('/menu');
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
    
    sessionStorage.setItem('selectedTreats', JSON.stringify(updatedTreats));
    sessionStorage.setItem('boxSize', boxSize.toString());

    if (orderNotes) {
      const existing = JSON.parse(sessionStorage.getItem('treatNotes') || '{}');
      existing[treat.treat_id] = orderNotes;
      sessionStorage.setItem('treatNotes', JSON.stringify(existing));
    }

    // Per spec: back to menu after add
    navigate('/menu');
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
          <button onClick={handleBackToMenu} style={{ marginTop: '20px', padding: '12px 24px', background: '#c8102e', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer' }}>
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
        onProceed={() => navigate('/menu')}
        getDiscountedPrice={getDiscountedPrice}
        getBasePrice={getBasePrice}
        onAdjustProtein={(productId, productName, newQty) => {
          setSelectedProteins(prev => {
            const updated = { ...prev, [productId]: { qty: newQty, name: productName } };
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

      {/* Small X close — top right */}
      <button
        onClick={handleBackToMenu}
        data-testid="treat-close-btn"
        className="pd-uber-close"
        aria-label="Close"
      >
        <X size={18} strokeWidth={2.2} />
      </button>

      <div className="pd-uber">
        <div className="pd-shopify">
          {/* Image left */}
          <div className="pd-shopify-media">
            {currentImage ? (
              <img src={currentImage} alt={treat.name} />
            ) : (
              <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#E8DFC8', color: '#6A4F35' }}>
                <span>Image coming soon</span>
              </div>
            )}
          </div>

          {/* Content right */}
          <div className="pd-shopify-content">
            <h1 className="pd-shopify-title">{treat.name}</h1>

            {/* Price */}
            <div className="pd-shopify-price-row" data-testid="treat-price">
              <span className="pd-shopify-price">${(treat.price * quantity).toFixed(2)}</span>
              {quantity > 1 && (
                <span className="pd-shopify-price-unit">(${treat.price.toFixed(2)} ea)</span>
              )}
            </div>

            <p className="pd-shopify-desc">
              {treat.description || treat.quantity_description}
            </p>

            {/* Feature pills */}
            <div className="pd-shopify-features">
              <span className="pd-shopify-feature">Natural single-ingredient</span>
              <span className="pd-shopify-feature">Dental support</span>
              <span className="pd-shopify-feature">Mental enrichment</span>
            </div>

            {/* Qty selector */}
            <div className="pd-shopify-qty-row">
              <div>
                <div className="pd-shopify-mini-label">Quantity</div>
                <div className="pd-shopify-qty-controls">
                  <button
                    onClick={() => quantity > 1 && setQuantity(quantity - 1)}
                    disabled={quantity <= 1}
                    className="pd-shopify-qty-btn"
                    aria-label="Decrease"
                  >−</button>
                  <span data-testid="treat-qty" className="pd-shopify-qty-display">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="pd-shopify-qty-btn"
                    aria-label="Increase"
                  >+</button>
                </div>
              </div>
              <button
                onClick={() => navigate('/menu')}
                className="pd-shopify-change-link"
              >
                Back to menu
              </button>
            </div>
          </div>
        </div>

        <div className="pd-uber-body">
          {/* Tabs */}
          <div className="detail-tabs" data-testid="detail-tabs">
            <button
              className={`detail-tab ${activeTab === 'description' ? 'is-active' : ''}`}
              onClick={() => setActiveTab('description')}
              data-testid="tab-description"
            >Details</button>
            <button
              className={`detail-tab ${activeTab === 'notes' ? 'is-active' : ''}`}
              onClick={() => setActiveTab('notes')}
              data-testid="tab-notes"
            >Notes</button>
          </div>

          {activeTab === 'description' && (
            <div data-testid="tab-pane-description">
              <div style={{ display: 'flex', flexDirection: 'column', gap: 0, marginTop: '4px' }}>
                {treat.ingredients && (
                  <CollapsibleSection title="Ingredients">
                    <p style={{ fontSize: '14px', color: '#3D3D3D', lineHeight: '1.7', margin: 0 }}>
                      {typeof treat.ingredients === 'string' ? treat.ingredients : (treat.ingredients || []).join(', ')}
                    </p>
                  </CollapsibleSection>
                )}
                {treat.benefits && treat.benefits.length > 0 && (
                  <CollapsibleSection title="Benefits">
                    <ul style={{ margin: 0, paddingLeft: '20px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                      {treat.benefits.map((b, i) => (
                        <li key={i} style={{ fontSize: '14px', color: '#3D3D3D', lineHeight: '1.6' }}>{b}</li>
                      ))}
                    </ul>
                  </CollapsibleSection>
                )}
                <CollapsibleSection title="Feeding guide">
                  <h4 style={{ fontSize: '13px', fontWeight: 700, color: '#3B2A1A', margin: '0 0 8px', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Instructions</h4>
                  <p style={{ fontSize: '14px', lineHeight: '1.7', color: '#3D3D3D', margin: '0 0 10px' }}>
                    {treat.feeding_guide?.feeding || 'Feed as a treat or meal topper. Always supervise your pet.'}
                  </p>
                  <p style={{ fontSize: '14px', lineHeight: '1.7', color: '#3D3D3D', margin: '0 0 12px' }}>
                    {treat.feeding_guide?.handling || 'Keep frozen until ready. Thaw in fridge. Use within 3 days of thawing.'}
                  </p>
                  <p style={{ fontSize: '14px', lineHeight: '1.7', color: '#3D3D3D', margin: 0 }}>
                    For how much to feed, visit our{' '}
                    <a href="/calculator" style={{ color: '#3B2A1A', fontWeight: 700, textDecoration: 'underline' }}>calculator</a>.
                  </p>
                </CollapsibleSection>
                <CollapsibleSection title="Product info">
                  <p style={{ fontSize: '14px', lineHeight: '1.7', color: '#3D3D3D', margin: 0, whiteSpace: 'pre-line' }}>
                    {treat.product_information || `${treat.name} is a natural, single-ingredient treat perfect for dogs of all sizes.`}
                  </p>
                </CollapsibleSection>
              </div>
            </div>
          )}

          {activeTab === 'notes' && (
            <div data-testid="tab-pane-notes" style={{ marginTop: '8px' }}>
              <label style={{ display: 'block', fontFamily: "'Barlow', sans-serif", fontSize: '13px', color: '#6A4F35', marginBottom: '6px' }}>
                Add any special notes for your order.
              </label>
              <textarea
                className="pd-uber-notes"
                value={orderNotes}
                onChange={(e) => setOrderNotes(e.target.value)}
                rows={5}
                placeholder="e.g. cut into smaller pieces, no additives…"
                data-testid="treat-notes-input"
              />
            </div>
          )}
        </div>
      </div>

      {/* Floating "Add to your box" pill */}
      <button
        onClick={handleAddToCart}
        className="pd-uber-add"
        data-testid="treat-add-to-box"
      >
        Add to your box
      </button>

      <Footer />
    </>
  );
};
