import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Navbar, Footer } from '../components/Layout';
import { ChevronLeft, ChevronDown, ChevronUp, X, Check, Recycle, MapPin, Heart } from 'lucide-react';
import { catalog as shopifyCatalog } from '../services/shopify';
import { trackAddToCart, trackViewItem } from '../services/analytics';
import { SeoHead } from '../components/SeoHead';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:8001';
const API = `${BACKEND_URL}/api`;

// Shopify variant placeholders (visual only — wired to the Storefront API later)
const VARIANT_OPTIONS_TREAT = ['1 pack', '3 pack', '5 pack'];

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
          padding: '9px 0',
          background: 'transparent',
          border: 'none',
          cursor: 'pointer',
          fontFamily: "'Barlow Semi Condensed', serif",
          fontSize: '15px',
          fontWeight: '700',
          color: '#2C2C2C',
          letterSpacing: '0.02em',
          textTransform: 'none'
        }}
      >
        <span>{title}</span>
        {isOpen ? <ChevronUp size={18} color="#c8102e" /> : <ChevronDown size={18} color="#c8102e" />}
      </button>
      {isOpen && (
        <div style={{ padding: '0 0 14px', color: '#2C2C2C' }}>
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
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  // Preload quantity + variant from the cart snapshot so the customer can edit
  // their previous selection when they re-open the treat page.
  const initialTreatsPreload = JSON.parse(localStorage.getItem('selectedTreats') || '[]');
  const existingTreat = initialTreatsPreload.find(t => t.treat_id === treatId);
  const [quantity, setQuantity] = useState(existingTreat && existingTreat.quantity > 0 ? existingTreat.quantity : 1);
  const [orderNotes, setOrderNotes] = useState('');
  const [selectedVariant, setSelectedVariant] = useState(
    existingTreat && typeof existingTreat.variant === 'number' ? existingTreat.variant : 0
  );

  // Initialize from sessionStorage immediately
  const initialBoxSize = parseInt(sessionStorage.getItem('boxSize')) || 18;
  const initialProteins = JSON.parse(localStorage.getItem('selectedProteins') || '{}');
  const initialTreats = JSON.parse(localStorage.getItem('selectedTreats') || '[]');

  const [boxSize, setBoxSize] = useState(initialBoxSize);
  const [selectedProteins, setSelectedProteins] = useState(initialProteins);
  const [selectedTreats, setSelectedTreats] = useState(initialTreats);
  const [products, setProducts] = useState([]);

  useEffect(() => {
    if (!embedded) {
      const root = document.getElementById('root');
      if (root) root.scrollTop = 0;
    }

    const syncFromStorage = () => {
      const savedBoxSize = parseInt(sessionStorage.getItem('boxSize'));
      const savedProteins = JSON.parse(localStorage.getItem('selectedProteins') || '{}');
      const savedTreats = JSON.parse(localStorage.getItem('selectedTreats') || '[]');

      if (savedBoxSize && savedBoxSize !== boxSize) setBoxSize(savedBoxSize);
      setSelectedProteins(savedProteins);
      setSelectedTreats(savedTreats);
    };

    syncFromStorage();
    window.addEventListener('focus', syncFromStorage);

    const fetchTreat = async () => {
      try {
        setSelectedImageIndex(0); // reset gallery to first Shopify image on treat change
        const foundTreat = await shopifyCatalog.getTreatByHandle(treatId);
        setTreat(foundTreat);
      } catch (error) {
        console.error('Error fetching treat:', error);
      } finally {
        setLoading(false);
      }
    };

    shopifyCatalog.getAllProducts()
      .then(all => setProducts(all))
      .catch(err => console.error('Error loading products:', err));

    fetchTreat();

    return () => {
      window.removeEventListener('focus', syncFromStorage);
    };
  }, [treatId]);

  // Fire GA4-compatible `view_item` into dataLayer once per treat load so GTM
  // can route it to whichever analytics tag the merchant has configured.
  useEffect(() => {
    if (!treat) return;
    trackViewItem({
      item_id: treat.treat_id,
      item_name: treat.name,
      variant: treat.pack_size || treat.variant || null,
      price: Number(treat.price) || 0,
      quantity: 1,
      currency: 'USD',
    });
  }, [treat]);

  // (Cart is now a single universal drawer opened via CartContext — no local listener.)

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
      updatedTreats[existingIndex].variant = selectedVariant;
      updatedTreats[existingIndex].variantLabel = VARIANT_OPTIONS_TREAT[selectedVariant];
    } else {
      updatedTreats.push({
        treat_id: treat.treat_id,
        name: treat.name,
        price: treat.price,
        quantity: quantity,
        variant: selectedVariant,
        variantLabel: VARIANT_OPTIONS_TREAT[selectedVariant],
      });
    }

    localStorage.setItem('selectedTreats', JSON.stringify(updatedTreats));
    sessionStorage.setItem('boxSize', boxSize.toString());
    window.dispatchEvent(new Event('foeguard:box-updated'));
    trackAddToCart({ name: treat.name, value: Number(((treat.price || 0) * quantity).toFixed(2)), quantity, items: [{ item_id: treat.treat_id, item_name: treat.name, quantity }] });

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
  // Features as a checklist — same priority as meal product pages: Shopify
  // feature_checks first, then benefits, then bullet lines parsed from the copy.
  const featureList = (treat.feature_checks && treat.feature_checks.length)
    ? treat.feature_checks
    : ((treat.benefits && treat.benefits.length) ? treat.benefits : descFeatures);

  return (
    <>
      {!embedded && treatId && (
        <SeoHead endpoint={`/api/seo/product/${encodeURIComponent(treatId)}`} />
      )}
      {!embedded && (
        <>
          <Navbar />

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
          {/* Image gallery — square main image + Shopify thumbnails (same as product pages). */}
          <div className="pd-gallery">
            <div className="pd-shopify-media">
              {currentImage ? (
                <img src={currentImage} alt={treat.name} />
              ) : (
                <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#E8DFC8', color: '#2C2C2C', fontSize: '13px' }}>
                  Image coming soon
                </div>
              )}
            </div>
            {images.length > 1 && (
              <div className="pd-gallery-thumbs" data-testid="treat-gallery-thumbs">
                {images.map((src, i) => (
                  <button
                    key={`${src}-${i}`}
                    type="button"
                    className={`pd-gallery-thumb ${i === selectedImageIndex ? 'is-active' : ''}`}
                    onClick={() => setSelectedImageIndex(i)}
                    data-testid={`treat-thumb-${i}`}
                    aria-label={`View image ${i + 1}`}
                  >
                    <img src={src} alt={`${treat.name} ${i + 1}`} loading="lazy" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Content right */}
          <div className="pd-shopify-content">
            <h1 className="pd-shopify-title">{treat.name}</h1>

            {/* Price */}
            <div className="pd-shopify-price-row" data-testid="treat-price">
              <span className="pd-shopify-price" data-testid="treat-price-total">${treat.price.toFixed(2)}</span>
            </div>

            {/* Short description — paragraph only (bullets moved to the checks list) */}
            <p className="pd-shopify-desc">
              {descParagraph || treat.quantity_description}
            </p>

            {/* Feature section — bullet features as checks */}
            {featureList && featureList.length > 0 && (
              <ul className="pd-shopify-checks" data-testid="treat-checks">
                {featureList.map((b, i) => (
                  <li key={i}><Check size={16} strokeWidth={2.5} /> <span>{b}</span></li>
                ))}
              </ul>
            )}

            {/* Variant selection — dot-style radios (placeholder, will bind to Shopify) */}
            <div className="pd-variant-group" data-testid="treat-variants">
              <div className="pd-variant-label">Pack Size</div>
              <div className="pd-radio-list">
                {VARIANT_OPTIONS_TREAT.map((opt, i) => (
                  <button
                    type="button"
                    key={opt}
                    className={`pd-radio-row ${selectedVariant === i ? 'is-selected' : ''}`}
                    onClick={() => setSelectedVariant(i)}
                    data-testid={`treat-variant-${i}`}
                  >
                    <span className="pd-radio-circle" aria-hidden="true" />
                    <span className="pd-radio-text">{opt}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Quantity */}
            <div className="pd-shopify-qty-row">
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
            </div>

            {/* Trust badges — below quantity */}
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
                <p style={{ fontSize: '14px', color: '#2C2C2C', lineHeight: '1.7', margin: 0 }}>
                  {typeof treat.ingredients === 'string' ? treat.ingredients : (treat.ingredients || []).join(', ')}
                </p>
              </CollapsibleSection>
            )}
            <CollapsibleSection title="Product Information">
              {treat.product_information ? (
                <p style={{ fontSize: '14px', lineHeight: '1.7', color: '#2C2C2C', margin: 0, whiteSpace: 'pre-line' }}>
                  {treat.product_information}
                </p>
              ) : treat.descriptionHtml ? (
                <div
                  data-testid="treat-info-html"
                  style={{ fontSize: '14px', lineHeight: '1.7', color: '#2C2C2C' }}
                  dangerouslySetInnerHTML={{ __html: treat.descriptionHtml }}
                />
              ) : (
                <p style={{ fontSize: '14px', lineHeight: '1.7', color: '#2C2C2C', margin: 0 }}>
                  {`${treat.name} is a natural, single-ingredient treat perfect for dogs of all sizes.`}
                </p>
              )}
            </CollapsibleSection>
            <CollapsibleSection title="Feeding Guide">
              <p style={{ fontSize: '14px', lineHeight: '1.7', color: '#2C2C2C', margin: '0 0 10px' }}>
                {treat.feeding_guide?.feeding || 'Feed as a treat or meal topper. Always supervise your pet.'}
              </p>
              <p style={{ fontSize: '14px', lineHeight: '1.7', color: '#2C2C2C', margin: 0 }}>
                {treat.feeding_guide?.handling || 'Keep frozen until ready. Thaw in fridge. Use within 3 days of thawing.'}
              </p>
            </CollapsibleSection>
            <div className="pd-notes-static" style={{ borderBottom: '1px solid #E8DDD0', padding: '18px 0 22px' }}>
              <div style={{ fontFamily: "'Barlow Semi Condensed', serif", fontSize: '15px', fontWeight: 700, color: '#2C2C2C', letterSpacing: '0.02em', marginBottom: '10px' }}>Notes</div>
              <label style={{ display: 'block', fontFamily: "'Barlow Semi Condensed', serif", fontSize: '13px', color: '#2C2C2C', marginBottom: '6px' }}>
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
            </div>
          </div>
        </div>
      </div>

      {/* Floating Add/Update Cart — stationary bottom bar (same format as menu) */}
      <button
        onClick={handleAddToCart}
        className={`bb-floating-checkout ${embedded ? 'bb-floating-checkout--inline' : ''}`}
        data-testid="treat-add-to-box"
      >
        <span className="bb-floating-action">{selectedTreats.some(t => t.treat_id === treat.treat_id) ? 'Update Cart' : 'Add to Cart'}</span>
        <span className="bb-floating-sep">•</span>
        <span className="bb-floating-total">${(treat.price * quantity).toFixed(2)}</span>
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
    const prevBody = document.body.style.overflow;
    const root = document.getElementById('root');
    const prevRoot = root ? root.style.overflow : '';
    document.body.style.overflow = 'hidden';
    if (root) root.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prevBody;
      if (root) root.style.overflow = prevRoot;
    };
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
