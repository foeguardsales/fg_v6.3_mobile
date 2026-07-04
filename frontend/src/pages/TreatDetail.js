import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Navbar, Footer } from '../components/Layout';
import { ChevronLeft, ChevronDown, ChevronUp, X, Check, Recycle, MapPin, Heart } from 'lucide-react';
import { CartDrawer } from '../components/CartAndCheckout';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:8001';
const API = `${BACKEND_URL}/api`;

// Shared collapsible — identical design to the meal product detail
const CollapsibleSection = ({ title, children, defaultOpen = false }) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div style={{
      background: 'transparent',
      borderRadius: 0,
      borderBottom: '1px solid #E8DDD0',
      overflow: 'hidden'
    }}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        style={{
          width: '100%',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '18px 0',
          background: 'transparent',
          border: 'none',
          cursor: 'pointer',
          fontFamily: "'Barlow Semi Condensed', serif",
          fontSize: '15px',
          fontWeight: '700',
          color: '#2B2B2B',
          letterSpacing: '0.04em',
          textTransform: 'uppercase'
        }}
      >
        <span>{title}</span>
        {isOpen ? <ChevronUp size={18} color="#c8102e" /> : <ChevronDown size={18} color="#c8102e" />}
      </button>
      {isOpen && (
        <div style={{ padding: '0 0 22px' }}>
          {children}
        </div>
      )}
    </div>
  );
};

export const TreatDetailPage = ({ treatId: propTreatId = null, embedded = false, onClose = null }) => {
  const params = useParams();
  const treatId = propTreatId || params.treatId;
  const navigate = useNavigate();
  const [treat, setTreat] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [cartOpen, setCartOpen] = useState(false);
  const [orderNotes, setOrderNotes] = useState('');

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

    const syncFromStorage = () => {
      const savedBoxSize = parseInt(sessionStorage.getItem('boxSize'));
      const savedProteins = JSON.parse(sessionStorage.getItem('selectedProteins') || '{}');
      const savedTreats = JSON.parse(sessionStorage.getItem('selectedTreats') || '[]');

      if (savedBoxSize && savedBoxSize !== boxSize) setBoxSize(savedBoxSize);
      setSelectedProteins(savedProteins);
      setSelectedTreats(savedTreats);
    };

    syncFromStorage();
    window.addEventListener('focus', syncFromStorage);

    const fetchTreat = async () => {
      try {
        const response = await axios.get(`${API}/treats`);
        const foundTreat = response.data.find(t => t.treat_id === treatId);
        setTreat(foundTreat);
      } catch (error) {
        console.error('Error fetching treat:', error);
      } finally {
        setLoading(false);
      }
    };

    axios.get(`${API}/products`)
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
    if (embedded && onClose) {
      onClose();
      return;
    }
    navigate('/menu');
  };

  // Discount rates by box size (used only for product pricing in the cart drawer)
  const DISCOUNT_RATES = { 6: 0, 18: 0.05, 24: 0.10, 36: 0.15 };

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

    if (embedded && onClose) {
      onClose();
    } else {
      navigate('/menu');
    }
  };

  if (loading) {
    if (embedded) {
      return (
        <div className="product-detail-loading">
          <div className="loading-spinner"></div>
          <p>Loading...</p>
        </div>
      );
    }
    return (
      <>
        <Navbar />
        <div style={{ padding: '60px 20px', textAlign: 'center' }}>Loading...</div>
        <Footer />
      </>
    );
  }

  if (!treat) {
    if (embedded) {
      return (
        <div style={{ padding: '60px 20px', textAlign: 'center' }}>
          <h2>Treat not found</h2>
        </div>
      );
    }
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

  // Split the description: plain paragraph vs. bullet lines (• or -).
  // Bullet lines become the checkmark feature list (same as meal product pages).
  const rawDesc = treat.description || treat.quantity_description || '';
  const descLines = rawDesc.split('\n');
  const descParagraph = descLines
    .filter(l => !/^\s*[•\-]/.test(l))
    .join(' ')
    .trim();
  const descFeatures = descLines
    .filter(l => /^\s*[•\-]/.test(l))
    .map(l => l.replace(/^\s*[•\-]\s*/, '').trim())
    .filter(Boolean);
  const featureList = (treat.benefits && treat.benefits.length) ? treat.benefits : descFeatures;

  return (
    <>
      {!embedded && (
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
            onRemoveTreat={(tid) => {
              setSelectedTreats(prev => {
                const updated = prev.filter(t => t.treat_id !== tid);
                sessionStorage.setItem('selectedTreats', JSON.stringify(updated));
                return updated;
              });
            }}
          />

          {/* Back button — standard top-left position (dedicated page only) */}
          <button
            onClick={handleBackToMenu}
            data-testid="treat-close-btn"
            className="pd-uber-back"
            aria-label="Back"
          >
            <ChevronLeft size={18} strokeWidth={2.2} /> Back
          </button>
        </>
      )}

      <div className="pd-uber">
        <div className="pd-shopify">
          {/* Image left */}
          <div className="pd-shopify-media">
            {currentImage ? (
              <img src={currentImage} alt={treat.name} />
            ) : (
              <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#E8DFC8', color: '#3B2A1A', fontSize: '13px' }}>
                Image coming soon
              </div>
            )}
          </div>

          {/* Content right */}
          <div className="pd-shopify-content">
            <h1 className="pd-shopify-title">{treat.name}</h1>

            {/* Quantity + Price (replaces the old top price) */}
            <div className="pd-shopify-qty-row" data-testid="treat-price">
              <div>
                <div className="pd-shopify-mini-label">Quantity</div>
                <div className="pd-shopify-qty-controls">
                  <button
                    onClick={() => quantity > 1 && setQuantity(quantity - 1)}
                    disabled={quantity <= 1}
                    className="pd-shopify-qty-btn"
                    data-testid="treat-qty-decrease"
                    aria-label="Decrease"
                  >−</button>
                  <span data-testid="treat-qty" className="pd-shopify-qty-display">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="pd-shopify-qty-btn"
                    data-testid="treat-qty-increase"
                    aria-label="Increase"
                  >+</button>
                </div>
              </div>
              <div className="pd-shopify-adds">
                <div className="pd-shopify-mini-label">Price</div>
                <span className="pd-shopify-adds-total">${(treat.price * quantity).toFixed(2)}</span>
              </div>
            </div>

            {/* Description — paragraph only (bullets moved to the checks list) */}
            <p className="pd-shopify-desc">
              {descParagraph || treat.quantity_description}
            </p>

            {/* Feature pills */}
            <div className="pd-shopify-features pd-shopify-features--mini" data-testid="treat-badges">
              <span className="pd-shopify-feature">Single-ingredient</span>
              <span className="pd-shopify-feature">Dental support</span>
              <span className="pd-shopify-feature">Enrichment</span>
            </div>

            {/* Bullet features rendered as checks (same as meals) */}
            {featureList && featureList.length > 0 && (
              <ul className="pd-shopify-checks" data-testid="treat-checks">
                {featureList.map((b, i) => (
                  <li key={i}><Check size={16} strokeWidth={2.5} /> <span>{b}</span></li>
                ))}
              </ul>
            )}

            {/* 3 horizontal icons row */}
            <div className="pd-shopify-trust" data-testid="treat-trust-row">
              <div className="pd-shopify-trust-item">
                <Recycle size={26} strokeWidth={1.8} />
                <span>100% Recyclable</span>
              </div>
              <div className="pd-shopify-trust-item">
                <Heart size={26} strokeWidth={1.8} />
                <span>Humanely Raised</span>
              </div>
              <div className="pd-shopify-trust-item">
                <MapPin size={26} strokeWidth={1.8} />
                <span>Made in Canada</span>
              </div>
            </div>
          </div>
        </div>

        {/* Full-width collapsibles — image stays stationary above until these are reached */}
        <div className="pd-shopify-full">
          <div className="pd-shopify-collapsibles" data-testid="treat-collapsibles">
            {treat.ingredients && (
              <CollapsibleSection title="Ingredients" defaultOpen>
                <p style={{ fontSize: '14px', color: '#3B2A1A', lineHeight: '1.7', margin: 0 }}>
                  {typeof treat.ingredients === 'string' ? treat.ingredients : (treat.ingredients || []).join(', ')}
                </p>
              </CollapsibleSection>
            )}
            <CollapsibleSection title="Product Information">
              <p style={{ fontSize: '14px', lineHeight: '1.7', color: '#3B2A1A', margin: 0, whiteSpace: 'pre-line' }}>
                {treat.product_information || `${treat.name} is a natural, single-ingredient treat perfect for dogs of all sizes.`}
              </p>
            </CollapsibleSection>
            <CollapsibleSection title="Feeding Guide">
              <p style={{ fontSize: '14px', lineHeight: '1.7', color: '#3B2A1A', margin: '0 0 10px' }}>
                {treat.feeding_guide?.feeding || 'Feed as a treat or meal topper. Always supervise your pet.'}
              </p>
              <p style={{ fontSize: '14px', lineHeight: '1.7', color: '#3B2A1A', margin: 0 }}>
                {treat.feeding_guide?.handling || 'Keep frozen until ready. Thaw in fridge. Use within 3 days of thawing.'}
              </p>
            </CollapsibleSection>
            <CollapsibleSection title="Notes">
              <label style={{ display: 'block', fontFamily: "'Barlow Semi Condensed', serif", fontSize: '13px', color: '#3B2A1A', marginBottom: '6px' }}>
                Add any special notes for your order.
              </label>
              <textarea
                className="pd-uber-notes"
                value={orderNotes}
                onChange={(e) => setOrderNotes(e.target.value)}
                rows={4}
                placeholder="e.g. cut into smaller pieces, no additives…"
                data-testid="treat-notes-input"
              />
            </CollapsibleSection>
          </div>
        </div>
      </div>

      {/* Sticky full-width "Add to your box" button */}
      <button
        onClick={handleAddToCart}
        className={`pd-uber-add ${embedded ? 'pd-uber-add--inline' : ''}`}
        data-testid="treat-add-to-box"
      >
        Add {quantity} to Basket · ${(treat.price * quantity).toFixed(2)}
      </button>

      {!embedded && <Footer />}
    </>
  );
};

// ===== Inline Treat Detail Modal — same overlay as the meal product modal =====
export const TreatDetailModal = ({ treatId, onClose }) => {
  const [dragY, setDragY] = useState(0);
  const [dragging, setDragging] = useState(false);
  const startY = useRef(null);

  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = prev; };
  }, []);

  const onTouchStart = (e) => { startY.current = e.touches[0].clientY; setDragging(true); };
  const onTouchMove = (e) => {
    if (startY.current == null) return;
    const dy = e.touches[0].clientY - startY.current;
    if (dy > 0) setDragY(dy);
  };
  const onTouchEnd = () => {
    setDragging(false);
    if (dragY > 90) { onClose(); return; }
    setDragY(0);
    startY.current = null;
  };

  return (
    <div
      className="bb-overlay bb-overlay--sheet"
      data-testid="treat-modal-overlay"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div
        className="bb-overlay-panel bb-overlay-panel--product"
        role="dialog"
        aria-modal="true"
        style={{ transform: dragY ? `translateY(${dragY}px)` : undefined, transition: dragging ? 'none' : 'transform 0.25s ease' }}
      >
        <div
          className="bb-sheet-grab"
          onTouchStart={onTouchStart}
          onTouchMove={onTouchMove}
          onTouchEnd={onTouchEnd}
          aria-hidden="true"
        >
          <span />
        </div>
        <button
          className="bb-overlay-close"
          onClick={onClose}
          data-testid="treat-modal-close"
          aria-label="Close"
        >
          <X size={22} />
        </button>
        <div className="bb-overlay-scroll">
          <TreatDetailPage treatId={treatId} embedded onClose={onClose} />
        </div>
      </div>
    </div>
  );
};
