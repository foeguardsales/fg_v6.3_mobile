import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Navbar, Footer } from '../components/Layout';
import { ChevronLeft, ChevronDown, ChevronUp, ChevronRight, PawPrint, Sprout, ChefHat, X, Check, Recycle, MapPin, Heart } from 'lucide-react';
import { CartDrawer } from '../components/CartAndCheckout';

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
          fontFamily: "'Barlow', sans-serif",
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
        <div style={{
          padding: '0 0 22px'
        }}>
          {children}
        </div>
      )}
    </div>
  );
};

// Brand badge trio shown under the product title
const ProductBrandIcons = () => {
  const items = [
    { Icon: PawPrint, label: 'For Dogs of All Stages' },
    { Icon: Sprout, label: 'Made Fresh-to-Order' },
    { Icon: ChefHat, label: 'Human Grade & Organic' }
  ];
  return (
    <div data-testid="product-brand-icons" style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(3, 1fr)',
      gap: '12px',
      margin: '20px 0 28px',
      padding: '16px 0',
      borderTop: '1px solid #E8DDD0',
      borderBottom: '1px solid #E8DDD0'
    }}>
      {items.map(({ Icon, label }, i) => (
        <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: '8px' }}>
          <div style={{
            width: '44px',
            height: '44px',
            border: '2px solid #3B2A1A',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: '#F5F3EF'
          }}>
            <Icon size={22} color="#3B2A1A" strokeWidth={1.8} />
          </div>
          <span style={{
            fontFamily: "'Barlow', sans-serif",
            fontSize: '12px',
            fontWeight: 600,
            color: '#3B2A1A',
            lineHeight: 1.25,
            maxWidth: '110px'
          }}>{label}</span>
        </div>
      ))}
    </div>
  );
};

// Farm to Bowl — 3 swipable/horizontal-scroll cards
const FarmToBowlSection = () => {
  const cards = [
    { title: 'Quality', body: 'Farm-fresh, pasture-raised, and fed organic — the way nature intended. No months-old meat, ever.' },
    { title: 'Service', body: "Have a question, suggestion, or custom recipe in mind? We're always here. info@foeguard.com" },
    { title: 'Delivery', body: 'We deliver Ontario-wide to homes, apartments, condos, and offices. Reach out for any delivery needs.' }
  ];
  return (
    <section data-testid="farm-to-bowl-section" style={{ marginTop: '56px' }}>
      <h2 style={{
        fontFamily: "'Fraunces', Georgia, serif",
        fontSize: 'clamp(26px, 3.2vw, 36px)',
        fontWeight: 600,
        color: '#3B2A1A',
        margin: '0 0 24px',
        textTransform: 'uppercase',
        letterSpacing: '0.04em'
      }}>Farm to Bowl</h2>
      <div className="farm-to-bowl-cards">
        {cards.map((c, i) => (
          <div key={i} data-testid={`f2b-card-${c.title.toLowerCase()}`} style={{
            background: '#F5F3EF',
            border: '1px solid #D8CFB8',
            borderRadius: '8px',
            padding: '28px 24px',
            boxShadow: 'none'
          }}>
            <h3 style={{
              fontFamily: "'Fraunces', Georgia, serif",
              fontSize: '22px',
              fontWeight: 600,
              color: '#C8102E',
              margin: '0 0 12px',
              textTransform: 'none'
            }}>{c.title}</h3>
            <p style={{ fontSize: '15px', color: '#3B2A1A', lineHeight: 1.65, margin: 0 }}>{c.body}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

// Personalize Your Recipe section
const PersonalizeSection = ({ navigate }) => {
  return (
    <section data-testid="personalize-section" style={{
      marginTop: '48px',
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
      gap: '32px',
      alignItems: 'center',
      background: '#E8DFC8',
      borderRadius: '8px',
      padding: '32px',
      border: '1px solid #D8CFB8'
    }}>
      <div style={{
        aspectRatio: '4 / 3',
        borderRadius: '6px',
        overflow: 'hidden',
        background: '#D8CFB8',
        border: '1px dashed #A89B7C',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#6A4F35',
        fontFamily: "'Barlow', sans-serif",
        fontSize: '13px',
        textTransform: 'uppercase',
        letterSpacing: '0.05em'
      }}>
        <img
          src="https://customer-assets.emergentagent.com/job_b68c2142-db90-4d98-9725-e1ffe0396c9b/artifacts/l0xcyf5b_farm.png"
          alt="Personalize your recipe"
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
      </div>
      <div>
        <h2 style={{
          fontFamily: "'Fraunces', Georgia, serif",
          fontSize: 'clamp(26px, 3.2vw, 36px)',
          fontWeight: 600,
          color: '#3B2A1A',
          margin: '0 0 16px',
          textTransform: 'none'
        }}>Personalize Your Recipe</h2>
        <p style={{ fontSize: '16px', color: '#3B2A1A', lineHeight: 1.7, margin: '0 0 20px' }}>
          We craft every recipe by hand, so customization is easy — whether you&apos;re matching a favourite meal or building one from scratch. Perfect for picky eaters, sensitive stomachs, and food allergies.
        </p>
        <button
          onClick={() => navigate('/contact')}
          data-testid="personalize-cta"
          style={{
            padding: '12px 22px',
            background: '#c8102e',
            color: '#FFFFFF',
            border: 'none',
            borderRadius: '999px',
            fontFamily: "'Barlow', sans-serif",
            fontWeight: 700,
            fontSize: '15px',
            cursor: 'pointer',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px'
          }}
        >
          Request a custom recipe <ChevronRight size={16} />
        </button>
      </div>
    </section>
  );
};

// Product FAQ accordion
const ProductFaqSection = () => {
  const faqs = [
    {
      q: 'How do I transition my dog to raw?',
      a: 'Most dogs do best with a short 5–7 day transition. Start with 25% raw / 75% current food on day 1–2, then 50/50 on day 3–4, 75/25 on day 5–6, and full raw by day 7. Some dogs (especially puppies) can switch cold-turkey. Feed at room temperature, watch stool quality, and reach out if anything seems off.'
    },
    {
      q: 'How do I thaw and store FoeGuard meals?',
      a: 'Thaw in the fridge for 24 hours before feeding. Once thawed, meals stay fresh in the fridge for up to 3 days. Refreeze unopened patties only — never refreeze thawed meat. Keep frozen at -18°C until ready.'
    },
    {
      q: 'How long does delivery take?',
      a: 'Orders placed by Sunday night ship Tuesday and arrive within 1–3 business days anywhere in Ontario. Free delivery in the GTA on orders over $100.'
    },
    {
      q: 'Is raw food safe to handle?',
      a: 'Yes — handle raw pet food the same way you would raw meat for your own kitchen. Wash your hands, bowls, and prep surfaces with hot soapy water after feeding. We also follow human-grade USDA-style food safety standards in our kitchen.'
    },
    {
      q: 'How long does a box last?',
      a: 'It depends on your dog&apos;s weight and box size. A 6lb box feeds an average 25lb dog for about 1 week; a 36lb box feeds the same dog for 6 weeks. Use our feeding calculator for an exact estimate.'
    }
  ];
  const [openIdx, setOpenIdx] = useState(0);
  return (
    <section data-testid="product-faq-section" style={{ marginTop: '48px', marginBottom: '32px' }}>
      <h2 style={{
        fontFamily: "'Fraunces', Georgia, serif",
        fontSize: 'clamp(26px, 3.2vw, 36px)',
        fontWeight: 600,
        color: '#3B2A1A',
        margin: '0 0 16px',
        textTransform: 'uppercase',
        letterSpacing: '0.04em'
      }}>Frequently Asked</h2>
      <div style={{
        background: '#F5F3EF',
        border: '1px solid #D8CFB8',
        borderRadius: '8px',
        padding: '8px 24px',
        boxShadow: 'none'
      }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
        {faqs.map((f, i) => {
          const isOpen = openIdx === i;
          return (
            <div key={i} data-testid={`product-faq-${i}`} style={{
              background: 'transparent',
              borderBottom: '1px solid #E8DDD0'
            }}>
              <button
                onClick={() => setOpenIdx(isOpen ? -1 : i)}
                style={{
                  width: '100%',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '18px 0',
                  background: 'transparent',
                  border: 'none',
                  cursor: 'pointer',
                  fontFamily: "'Barlow', sans-serif",
                  fontSize: '15px',
                  fontWeight: 700,
                  color: '#2B2B2B',
                  textAlign: 'left',
                  letterSpacing: '0.02em'
                }}
              >
                <span>{f.q}</span>
                {isOpen ? <ChevronUp size={18} color="#c8102e" /> : <ChevronDown size={18} color="#c8102e" />}
              </button>
              {isOpen && (
                <div style={{ padding: '0 0 22px', fontSize: '14px', color: '#3D3D3D', lineHeight: 1.7 }}>
                  {f.a}
                </div>
              )}
            </div>
          );
        })}
        </div>
      </div>
    </section>
  );
};

export const ProductDetailPage = () => {
  const { productId } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // Initialize from sessionStorage immediately
  const initialBoxSize = parseInt(sessionStorage.getItem('boxSize')) || 6;
  const initialProteins = JSON.parse(sessionStorage.getItem('selectedProteins') || '{}');
  const initialTreats = JSON.parse(sessionStorage.getItem('selectedTreats') || '[]');
  
  const [quantity, setQuantity] = useState(6);
  const [cartOpen, setCartOpen] = useState(false);
  const [boxSize, setBoxSize] = useState(initialBoxSize);
  const [selectedProteins, setSelectedProteins] = useState(initialProteins);
  const [selectedTreats, setSelectedTreats] = useState(initialTreats);
  const [products, setProducts] = useState([]);
  const [orderNotes, setOrderNotes] = useState('');
  const [activeTab, setActiveTab] = useState('description');

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
    
    // Load all products for pricing
    axios.get(`${API}/products`)
      .then(res => setProducts(res.data))
      .catch(err => console.error('Error loading products:', err));
    
    axios.get(`${API}/products/${productId}`)
      .then(res => setProduct(res.data))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
    
    return () => {
      window.removeEventListener('focus', syncFromStorage);
    };
  }, [productId]);

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
    6: 0,
    18: 0.05,
    24: 0.10,
    36: 0.15
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
    // Calculate current total in box
    const currentTotal = Object.values(selectedProteins).reduce((sum, p) => sum + p.qty, 0);
    const spaceLeft = boxSize - currentTotal;
    
    // Don't add if no space
    if (spaceLeft <= 0) return;
    
    // Add product to cart
    const updatedProteins = { ...selectedProteins };
    const currentQty = updatedProteins[product.product_id]?.qty || 0;
    
    // Cap quantity at remaining space
    const addQty = Math.min(quantity, spaceLeft);
    
    updatedProteins[product.product_id] = {
      qty: currentQty + addQty,
      name: product.name
    };
    
    sessionStorage.setItem('selectedProteins', JSON.stringify(updatedProteins));
    sessionStorage.setItem('boxSize', boxSize.toString());

    // Persist order notes
    if (orderNotes) {
      const existing = JSON.parse(sessionStorage.getItem('productNotes') || '{}');
      existing[product.product_id] = orderNotes;
      sessionStorage.setItem('productNotes', JSON.stringify(existing));
    }

    // Navigate back to the menu (per spec)
    navigate('/menu');
  };

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
          <button className="btn-primary" onClick={handleBackToMenu}>
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
      case 'comfort_dinner': return { color: '#A4C0A0', name: 'Comfort Dinner' };
      case 'primal_feast': return { color: '#C8102E', name: 'Primal Feast' };
      case 'royal_paws': return { color: '#5E4B73', name: 'Royal Paws' };
      default: return { color: '#C8102E', name: 'FoeGuard' };
    }
  };

  // Calculate current totals for live price/discount display
  const currentTotal = Object.values(selectedProteins).reduce((sum, p) => sum + p.qty, 0);
  const isBoxFull = currentTotal >= boxSize;
  const sizeDiscount = (DISCOUNT_RATES[boxSize] || 0) * 100;

  const collectionInfo = getCollectionInfo();
  const lineName = collectionInfo.name;
  const lineColor = collectionInfo.color;
  const productImage = proteinImages[product.protein_type] || proteinImages.chicken;

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

      {/* Back button — standard top-left position */}
      <button
        onClick={handleBackToMenu}
        data-testid="product-close-btn"
        className="pd-uber-back"
        aria-label="Back"
      >
        <ChevronLeft size={18} strokeWidth={2.2} /> Back
      </button>

      <div className="pd-uber">
        <div className="pd-shopify">
          {/* Image left */}
          <div className="pd-shopify-media">
            <img src={productImage} alt={product.name} />
          </div>

          {/* Content right */}
          <div className="pd-shopify-content">
            {/* Title */}
            <h1 className="pd-shopify-title">{product.name}</h1>

            {/* Price */}
            <div className="pd-shopify-price-row" data-testid="product-price">
              <span className="pd-shopify-price">${getDiscountedPrice(product).toFixed(2)}</span>
              <span className="pd-shopify-price-unit">/ 6 lb</span>
              {sizeDiscount > 0 && (
                <span className="pd-shopify-price-original">${getBasePrice(product).toFixed(2)}</span>
              )}
            </div>

            {/* Description */}
            <p className="pd-shopify-desc">
              {product.description}
            </p>

            {/* Feature pills — smaller harvest gold (Uber-Eats style) */}
            <div className="pd-shopify-features pd-shopify-features--mini" data-testid="product-badges">
              <span className="pd-shopify-feature">Dogs of all-life stages</span>
              <span className="pd-shopify-feature">Fresh-to-order</span>
              <span className="pd-shopify-feature">Human grade</span>
            </div>

            {/* Quantity selector — Add to box */}
            <div className="pd-shopify-qty-row">
              <div>
                <div className="pd-shopify-mini-label">Add to box</div>
                <div className="pd-shopify-qty-controls">
                  <button
                    onClick={() => quantity > 6 && setQuantity(quantity - 6)}
                    disabled={quantity <= 6}
                    className="pd-shopify-qty-btn"
                    data-testid="qty-decrease"
                  >−</button>
                  <span data-testid="qty-display" className="pd-shopify-qty-display">{quantity} lb</span>
                  <button
                    onClick={() => {
                      const spaceLeft = boxSize - currentTotal;
                      if (quantity + 6 <= spaceLeft) setQuantity(quantity + 6);
                    }}
                    disabled={quantity + 6 > (boxSize - currentTotal)}
                    className="pd-shopify-qty-btn"
                    data-testid="qty-increase"
                  >+</button>
                </div>
              </div>
              <div className="pd-shopify-adds">
                <div className="pd-shopify-mini-label">Adds</div>
                <span data-testid="qty-price-total" className="pd-shopify-adds-total">
                  ${(getDiscountedPrice(product) * (quantity / 6)).toFixed(2)}
                </span>
                {sizeDiscount > 0 && (
                  <div className="pd-shopify-adds-original">
                    ${(getBasePrice(product) * (quantity / 6)).toFixed(2)}
                  </div>
                )}
              </div>
            </div>

            {/* Box Selected: 6lb [Save 5%] Change on menu (BELOW Add to box) */}
            <div className="pd-shopify-boxsize" data-testid="box-size-info">
              <span className="pd-shopify-boxsize-label">Box Selected:</span>
              <span className="pd-shopify-boxsize-value">{boxSize}lb</span>
              {sizeDiscount > 0 && (
                <span className="pd-shopify-boxsize-discount">Save {sizeDiscount}%</span>
              )}
              <button
                onClick={() => navigate('/menu')}
                data-testid="change-box-size"
                className="pd-shopify-change-link"
              >
                Change on menu
              </button>
            </div>

            {/* Checks list (highlights as ✓) */}
            {product.highlights && product.highlights.length > 0 && (
              <ul className="pd-shopify-checks" data-testid="product-checks">
                {product.highlights.map((h, i) => (
                  <li key={i}><Check size={16} strokeWidth={2.5} /> <span>{h}</span></li>
                ))}
              </ul>
            )}

            {/* Collapsibles (Ingredients, Nutrition, Feeding, Product info, Notes) */}
            <div className="pd-shopify-collapsibles" data-testid="product-collapsibles">
              <CollapsibleSection title="Ingredients">
                <p style={{ fontSize: '14px', color: '#3D3D3D', lineHeight: '1.7', margin: 0 }}>
                  {typeof product.ingredients === 'string' ? product.ingredients : (product.ingredients || []).join(', ')}
                </p>
              </CollapsibleSection>
              <CollapsibleSection title="Nutrition Facts">
                <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
                  {product.nutrition_facts && Object.entries(product.nutrition_facts).map(([key, value]) => (
                    <div key={key} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid #E8DDD0' }}>
                      <span style={{ color: '#5A5A5A', fontSize: '13px', textTransform: 'capitalize' }}>{key.replace(/_/g, ' ')}</span>
                      <span style={{ fontWeight: '600', color: '#2B2B2B', fontSize: '13px' }}>{value}</span>
                    </div>
                  ))}
                </div>
              </CollapsibleSection>
              <CollapsibleSection title="Feeding Guide">
                {product.feeding_guide && (
                  <>
                    <p style={{ fontSize: '14px', lineHeight: '1.7', color: '#3D3D3D', margin: '0 0 10px' }}>{product.feeding_guide.feeding}</p>
                    <p style={{ fontSize: '14px', lineHeight: '1.7', color: '#3D3D3D', margin: '0 0 12px' }}>{product.feeding_guide.handling}</p>
                    <p style={{ fontSize: '14px', lineHeight: '1.7', color: '#3D3D3D', margin: 0 }}>
                      For how much to feed, visit our{' '}
                      <a href="/calculator" style={{ color: '#3B2A1A', fontWeight: 700, textDecoration: 'underline' }}>calculator</a>.
                    </p>
                  </>
                )}
              </CollapsibleSection>
              <CollapsibleSection title="Product info">
                <p style={{ fontSize: '14px', lineHeight: '1.7', color: '#3D3D3D', margin: 0, whiteSpace: 'pre-line' }}>
                  {product.product_information}
                </p>
              </CollapsibleSection>
              <CollapsibleSection title="Order Notes">
                <label style={{ display: 'block', fontFamily: "'Barlow', sans-serif", fontSize: '13px', color: '#6A4F35', marginBottom: '6px' }}>
                  Add any special notes for your order (e.g. remove an ingredient, preference).
                </label>
                <textarea
                  className="pd-uber-notes"
                  value={orderNotes}
                  onChange={(e) => setOrderNotes(e.target.value)}
                  rows={4}
                  placeholder="e.g. No bone, extra liver, cut into small pieces…"
                  data-testid="product-notes-input"
                />
              </CollapsibleSection>
            </div>

            {/* 3 horizontal icons row */}
            <div className="pd-shopify-trust" data-testid="product-trust-row">
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

        {/* FAQ section — bottom of product page, one large container (historical) */}
        <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '8px 16px 32px' }}>
          <ProductFaqSection />
        </div>
      </div>

      {/* Floating "Add to your box" pill */}
      <button
        onClick={handleAddToCart}
        disabled={isBoxFull}
        className="pd-uber-add"
        data-testid="product-add-to-box"
      >
        {isBoxFull ? 'Box full' : `Add ${quantity}lb to your box · $${(getDiscountedPrice(product) * (quantity / 6)).toFixed(2)}`}
      </button>

      <Footer />
    </>
  );
};


// ===== Inline Product Detail Modal — same content as page, but rendered as overlay =====
export const ProductDetailModal = ({ productId, onClose }) => {
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  const initialBoxSize = parseInt(sessionStorage.getItem('boxSize')) || 6;
  const initialProteins = JSON.parse(sessionStorage.getItem('selectedProteins') || '{}');

  const [quantity, setQuantity] = useState(6);
  const [boxSize, setBoxSize] = useState(initialBoxSize);
  const [selectedProteins, setSelectedProteins] = useState(initialProteins);
  const [orderNotes, setOrderNotes] = useState('');

  useEffect(() => {
    setLoading(true);
    axios.get(`${API}/products/${productId}`)
      .then(res => setProduct(res.data))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
    // Lock body scroll while open
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = prev; };
  }, [productId]);

  const DISCOUNT_RATES = { 6: 0, 18: 0.05, 24: 0.10, 36: 0.15 };

  const getBasePrice = (prod) => {
    const pricing = prod?.pricing?.find(p => p.size_lb === 6);
    return pricing ? pricing.price : 0;
  };

  const getDiscountedPrice = (prod) => {
    const basePrice = getBasePrice(prod);
    const discount = DISCOUNT_RATES[boxSize] || 0;
    return basePrice * (1 - discount);
  };

  const currentTotal = Object.values(selectedProteins).reduce((sum, p) => sum + p.qty, 0);
  const isBoxFull = currentTotal >= boxSize;
  const sizeDiscount = (DISCOUNT_RATES[boxSize] || 0) * 100;

  const handleAddToCart = () => {
    if (!product) return;
    const spaceLeft = boxSize - currentTotal;
    if (spaceLeft <= 0) return;

    const updatedProteins = { ...selectedProteins };
    const currentQty = updatedProteins[product.product_id]?.qty || 0;
    const addQty = Math.min(quantity, spaceLeft);

    updatedProteins[product.product_id] = {
      qty: currentQty + addQty,
      name: product.name
    };

    sessionStorage.setItem('selectedProteins', JSON.stringify(updatedProteins));
    sessionStorage.setItem('boxSize', boxSize.toString());

    if (orderNotes) {
      const existing = JSON.parse(sessionStorage.getItem('productNotes') || '{}');
      existing[product.product_id] = orderNotes;
      sessionStorage.setItem('productNotes', JSON.stringify(existing));
    }

    onClose();
  };

  return (
    <div className="bb-overlay" data-testid="product-modal-overlay" onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="bb-overlay-panel" role="dialog" aria-modal="true">
        <button
          className="bb-overlay-close"
          onClick={onClose}
          data-testid="product-modal-close"
          aria-label="Close"
        >
          <X size={22} />
        </button>

        {loading || !product ? (
          <div className="product-detail-loading"><p>Loading product...</p></div>
        ) : (
          <div className="pd-uber pd-uber--modal">
            <div className="pd-shopify">
              <div className="pd-shopify-media">
                <img src={proteinImages[product.protein_type] || proteinImages.chicken} alt={product.name} />
              </div>
              <div className="pd-shopify-content">
                <h1 className="pd-shopify-title">{product.name}</h1>
                <div className="pd-shopify-price-row" data-testid="product-price">
                  <span className="pd-shopify-price">${(getDiscountedPrice(product) / 6).toFixed(2)}</span>
                  <span className="pd-shopify-price-unit">/ 1 lb</span>
                  {sizeDiscount > 0 && (
                    <span className="pd-shopify-price-original">${(getBasePrice(product) / 6).toFixed(2)}</span>
                  )}
                </div>
                <p className="pd-shopify-desc">{product.description}</p>

                <div className="pd-shopify-features pd-shopify-features--mini">
                  <span className="pd-shopify-feature">Dogs of all-life stages</span>
                  <span className="pd-shopify-feature">Fresh-to-order</span>
                  <span className="pd-shopify-feature">Human grade</span>
                </div>

                <div className="pd-shopify-qty-row">
                  <div>
                    <div className="pd-shopify-mini-label">Add to box</div>
                    <div className="pd-shopify-qty-controls">
                      <button
                        onClick={() => quantity > 6 && setQuantity(quantity - 6)}
                        disabled={quantity <= 6}
                        className="pd-shopify-qty-btn"
                        data-testid="qty-decrease"
                      >−</button>
                      <span data-testid="qty-display" className="pd-shopify-qty-display">{quantity} lb</span>
                      <button
                        onClick={() => {
                          const spaceLeft = boxSize - currentTotal;
                          if (quantity + 6 <= spaceLeft) setQuantity(quantity + 6);
                        }}
                        disabled={quantity + 6 > (boxSize - currentTotal)}
                        className="pd-shopify-qty-btn"
                        data-testid="qty-increase"
                      >+</button>
                    </div>
                  </div>
                  <div className="pd-shopify-adds">
                    <div className="pd-shopify-mini-label">Adds</div>
                    <span className="pd-shopify-adds-total">
                      ${(getDiscountedPrice(product) * (quantity / 6)).toFixed(2)}
                    </span>
                    {sizeDiscount > 0 && (
                      <div className="pd-shopify-adds-original">
                        ${(getBasePrice(product) * (quantity / 6)).toFixed(2)}
                      </div>
                    )}
                  </div>
                </div>

                <div className="pd-shopify-boxsize">
                  <span className="pd-shopify-boxsize-label">Box Selected:</span>
                  <span className="pd-shopify-boxsize-value">{boxSize}lb</span>
                  {sizeDiscount > 0 && (
                    <span className="pd-shopify-boxsize-discount">Save {sizeDiscount}%</span>
                  )}
                </div>

                {product.highlights && product.highlights.length > 0 && (
                  <ul className="pd-shopify-checks">
                    {product.highlights.map((h, i) => (
                      <li key={i}><Check size={16} strokeWidth={2.5} /> <span>{h}</span></li>
                    ))}
                  </ul>
                )}

                <div className="pd-shopify-collapsibles">
                  <CollapsibleSection title="Ingredients">
                    <p style={{ fontSize: '14px', color: '#3D3D3D', lineHeight: '1.7', margin: 0 }}>
                      {typeof product.ingredients === 'string' ? product.ingredients : (product.ingredients || []).join(', ')}
                    </p>
                  </CollapsibleSection>
                  <CollapsibleSection title="Nutrition Facts">
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
                      {product.nutrition_facts && Object.entries(product.nutrition_facts).map(([key, value]) => (
                        <div key={key} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid #E8DDD0' }}>
                          <span style={{ color: '#5A5A5A', fontSize: '13px', textTransform: 'capitalize' }}>{key.replace(/_/g, ' ')}</span>
                          <span style={{ fontWeight: '600', color: '#2B2B2B', fontSize: '13px' }}>{value}</span>
                        </div>
                      ))}
                    </div>
                  </CollapsibleSection>
                  <CollapsibleSection title="Order Notes">
                    <textarea
                      className="pd-uber-notes"
                      value={orderNotes}
                      onChange={(e) => setOrderNotes(e.target.value)}
                      rows={3}
                      placeholder="e.g. No bone, extra liver…"
                      data-testid="product-notes-input"
                    />
                  </CollapsibleSection>
                </div>

                <button
                  onClick={handleAddToCart}
                  disabled={isBoxFull}
                  className="pd-uber-add pd-uber-add--inline"
                  data-testid="product-add-to-box"
                >
                  {isBoxFull ? 'Box full' : `Add ${quantity}lb to your box · $${(getDiscountedPrice(product) * (quantity / 6)).toFixed(2)}`}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
