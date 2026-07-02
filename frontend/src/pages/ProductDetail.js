import React, { useState, useEffect, useRef } from 'react';
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
          fontFamily: "'Lora', serif",
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
            fontFamily: "'Lora', serif",
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
        fontFamily: "'Lora', 'Helvetica Neue', Helvetica, Arial, sans-serif",
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
              fontFamily: "'Lora', 'Helvetica Neue', Helvetica, Arial, sans-serif",
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
        color: '#3B2A1A',
        fontFamily: "'Lora', serif",
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
          fontFamily: "'Lora', 'Helvetica Neue', Helvetica, Arial, sans-serif",
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
            fontFamily: "'Lora', serif",
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
      q: 'How much raw should I feed?',
      a: (
        <>
          Adults feed roughly 2–3.5% of body weight per day; puppies feed more (up to 10–13% at 2–4 months, scaling down with age). Use our <a href="/calculator" style={{ color: '#C8102E', fontWeight: 700, textDecoration: 'underline' }}>feeding calculator</a> for a personalized portion in seconds.
        </>
      )
    },
    {
      q: 'How to transition my dog or cat to raw?',
      a: "We recommend a 7–10 day gradual transition, mixing increasing amounts of FoeGuard with your pet's current food until they're on 100% raw. Feed slightly smaller portions during the switch, watch stool consistency, and skip introducing new treats. Our team is one message away if you need help."
    },
    {
      q: 'Can puppies/seniors eat raw food?',
      a: "Absolutely — both thrive on it. Our Comfort Dinner line is complete & balanced for all life stages (AAFCO). Puppies need more food per kg of body weight and specially ground recipes for easy digestion — we carry puppy-friendly options across every protein."
    },
    {
      q: 'Are your meals complete and balanced?',
      a: "Yes. Our Comfort Dinner recipes are complete and balanced to AAFCO standards — no supplementation needed. Primal Feast follows a traditional 80/10/10 raw ratio and is designed for rotational feeding or topping where you can add your own supplementation."
    },
    {
      q: 'Where do your ingredients come from?',
      a: "All of our meats are sourced directly from our own farm in Acton, ON and a small group of hand-picked Ontario partners we know personally. Every recipe is prepared in our government-regulated, human-grade kitchen — high quality, consistent and fully traceable."
    }
  ];
  const [openIdx, setOpenIdx] = useState(0);
  return (
    <section data-testid="product-faq-section" style={{ marginTop: '28px', marginBottom: '8px' }}>
      <h2 style={{
        fontFamily: "'Lora', 'Helvetica Neue', Helvetica, Arial, sans-serif",
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
                  fontFamily: "'Lora', serif",
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
                <div style={{ padding: '0 0 22px', fontSize: '14px', color: '#3B2A1A', lineHeight: 1.7 }}>
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

export const ProductDetailPage = ({ productId: propProductId = null, embedded = false, onClose = null }) => {
  const params = useParams();
  const productId = propProductId || params.productId;
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // Initialize from sessionStorage immediately
  const initialBoxSize = parseInt(sessionStorage.getItem('boxSize')) || 6;
  const initialProteins = JSON.parse(sessionStorage.getItem('selectedProteins') || '{}');
  const initialTreats = JSON.parse(sessionStorage.getItem('selectedTreats') || '[]');
  
  // Slider starts at whatever is already in the box for this product (connected to the menu)
  const [quantity, setQuantity] = useState(() => {
    const existing = initialProteins[productId]?.qty;
    return existing && existing > 0 ? existing : 6;
  });
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

  // Keep the size slider connected to the menu — once the product/id is known,
  // start it at whatever quantity is already in the in-progress box.
  useEffect(() => {
    const saved = JSON.parse(sessionStorage.getItem('selectedProteins') || '{}');
    const existing = saved[productId]?.qty;
    if (existing && existing > 0) setQuantity(existing);
  }, [productId, product]);

  const handleBackToMenu = () => {
    // Persist edits to a meal that's already in the basket when leaving (per spec).
    const existing = JSON.parse(sessionStorage.getItem('selectedProteins') || '{}');
    if (existing[productId]?.qty > 0 && product) {
      existing[productId] = { qty: quantity, name: product.name, petType: existing[productId].petType || productPet };
      sessionStorage.setItem('selectedProteins', JSON.stringify(existing));
    }
    if (embedded && onClose) {
      onClose();
      return;
    }
    navigate('/menu');
  };
  
  // Unified bulk discount tiers — applies to TOTAL meal lbs WITHIN THIS PET BUCKET.
  // Dog and cat baskets have SEPARATE discount tiers.
  const DISCOUNT_RATES = { 0: 0, 12: 0.05, 24: 0.10, 36: 0.15 };
  const getTierFromLbs = (lbs, rates) => {
    const sizes = Object.keys(rates).map(Number).sort((a, b) => a - b);
    let chosen = { size: sizes[0], rate: rates[sizes[0]] };
    sizes.forEach(s => { if (lbs >= s) chosen = { size: s, rate: rates[s] }; });
    return chosen;
  };
  // Determine this product's pet bucket from product_line; primal_feast can live in either basket
  // → use the last menu view stored in sessionStorage as a fallback.
  const productPet = (() => {
    if (!product) return 'dog';
    if (product.product_line === 'comfort_dinner') return 'dog';
    if (product.product_line === 'royal_paws') return 'cat';
    return sessionStorage.getItem('foeguard_menu_pet') || 'dog';
  })();
  // Effective lbs for THIS product's tier = other meals in the SAME pet bucket + this product's chosen qty
  const otherLbs = Object.entries(selectedProteins || {})
    .filter(([pid, d]) => pid !== productId && (d.petType || 'dog') === productPet)
    .reduce((s, [, d]) => s + (d.qty || 0), 0);
  const bulkRate = getTierFromLbs(otherLbs + quantity, DISCOUNT_RATES).rate;

  const getBasePrice = (prod) => {
    const pricing = prod.pricing.find(p => p.size_lb === 6);
    return pricing ? pricing.price : 0;
  };

  const getDiscountedPrice = (prod) => getBasePrice(prod) * (1 - bulkRate);
  
  const handleAddToCart = () => {
    // Connected to the menu — SET this product's box quantity to the slider value
    // (the slider already reflects what's in the box, so we don't stack on top).
    const updatedProteins = { ...selectedProteins };

    updatedProteins[product.product_id] = {
      qty: quantity,
      name: product.name,
      petType: productPet
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
          <p>Loading product...</p>
        </div>
      );
    }
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
  const sizeDiscount = bulkRate * 100;

  const collectionInfo = getCollectionInfo();
  const lineName = collectionInfo.name;
  const lineColor = collectionInfo.color;
  const productImage = proteinImages[product.protein_type] || proteinImages.chicken;

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
            onRemoveTreat={(treatId) => {
              setSelectedTreats(prev => {
                const updated = prev.filter(t => t.treat_id !== treatId);
                sessionStorage.setItem('selectedTreats', JSON.stringify(updated));
                return updated;
              });
            }}
          />

          {/* Back button — standard top-left position (only when on a dedicated page, not modal) */}
          <button
            onClick={handleBackToMenu}
            data-testid="product-close-btn"
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
            <img src={productImage} alt={product.name} />
          </div>

          {/* Content right */}
          <div className="pd-shopify-content">
            {/* Collection sub-title (e.g. Comfort Dinner) above the product name */}
            {lineName && lineName !== 'FoeGuard' && (
              <div className="pd-shopify-collection" data-testid="product-collection-label">{lineName}</div>
            )}
            {/* Title */}
            <h1 className="pd-shopify-title">{product.name}</h1>

            {/* Size + Price (replaces the old top per-lb price; follows the menu qty) */}
            <div className="pd-shopify-qty-row" data-testid="product-price">
              <div>
                <div className="pd-shopify-mini-label">Size</div>
                <div className="pd-shopify-qty-controls">
                  <button
                    onClick={() => quantity > 6 && setQuantity(quantity - 6)}
                    disabled={quantity <= 6}
                    className="pd-shopify-qty-btn"
                    data-testid="qty-decrease"
                  >−</button>
                  <span data-testid="qty-display" className="pd-shopify-qty-display">{quantity} lb</span>
                  <button
                    onClick={() => setQuantity(quantity + 6)}
                    className="pd-shopify-qty-btn"
                    data-testid="qty-increase"
                  >+</button>
                </div>
              </div>
              <div className="pd-shopify-adds">
                <div className="pd-shopify-mini-label">Price</div>
                <span data-testid="qty-price-total" className="pd-shopify-adds-total">
                  ${(getDiscountedPrice(product) * (quantity / 6)).toFixed(2)}
                </span>
                <span className="pd-shopify-adds-perlb" data-testid="qty-price-perlb">
                  (${(getDiscountedPrice(product) / 6).toFixed(2)}/lb)
                </span>
              </div>
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

            {/* Checks list (highlights as ✓) */}
            {product.highlights && product.highlights.length > 0 && (
              <ul className="pd-shopify-checks" data-testid="product-checks">
                {product.highlights.map((h, i) => (
                  <li key={i}><Check size={16} strokeWidth={2.5} /> <span>{h}</span></li>
                ))}
              </ul>
            )}

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

        {/* Full-width collapsibles — image stays stationary above until these are reached */}
        <div className="pd-shopify-full">
          <div className="pd-shopify-collapsibles" data-testid="product-collapsibles">
            <CollapsibleSection title="Ingredients" defaultOpen>
              <p style={{ fontSize: '14px', color: '#3B2A1A', lineHeight: '1.7', margin: 0 }}>
                {typeof product.ingredients === 'string' ? product.ingredients : (product.ingredients || []).join(', ')}
              </p>
            </CollapsibleSection>
            <CollapsibleSection title="Nutritional Analysis">
              <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
                {product.nutrition_facts && Object.entries(product.nutrition_facts).map(([key, value]) => (
                  <div key={key} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid #E8DDD0' }}>
                    <span style={{ color: '#5A5A5A', fontSize: '13px', textTransform: 'capitalize' }}>{key.replace(/_/g, ' ')}</span>
                    <span style={{ fontWeight: '600', color: '#2B2B2B', fontSize: '13px' }}>{value}</span>
                  </div>
                ))}
              </div>
            </CollapsibleSection>
            <CollapsibleSection title="Product Information">
              <p style={{ fontSize: '14px', lineHeight: '1.7', color: '#3B2A1A', margin: 0, whiteSpace: 'pre-line' }}>
                {product.product_information}
              </p>
            </CollapsibleSection>
            <CollapsibleSection title="Feeding Guide">
              {product.feeding_guide && (
                <>
                  <p style={{ fontSize: '14px', lineHeight: '1.7', color: '#3B2A1A', margin: '0 0 10px' }}>{product.feeding_guide.feeding}</p>
                  <p style={{ fontSize: '14px', lineHeight: '1.7', color: '#3B2A1A', margin: '0 0 12px' }}>{product.feeding_guide.handling}</p>
                  <p style={{ fontSize: '14px', lineHeight: '1.7', color: '#3B2A1A', margin: 0 }}>
                    For how much to feed, visit our{' '}
                    <a href="/calculator" style={{ color: '#3B2A1A', fontWeight: 700, textDecoration: 'underline' }}>calculator</a>.
                  </p>
                </>
              )}
            </CollapsibleSection>
            <CollapsibleSection title="Notes">
              <label style={{ display: 'block', fontFamily: "'Lora', serif", fontSize: '13px', color: '#3B2A1A', marginBottom: '6px' }}>
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
        </div>

        {/* FAQ section — bottom of product page, one large container (historical) */}
        <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '8px 16px 8px' }}>
          <ProductFaqSection />
        </div>
      </div>

      {/* Floating "Add to your box" pill — no upper cap */}
      <button
        onClick={handleAddToCart}
        className={`pd-uber-add ${embedded ? 'pd-uber-add--inline' : ''}`}
        data-testid="product-add-to-box"
      >
        {`Add ${quantity}lb to Basket · $${(getDiscountedPrice(product) * (quantity / 6)).toFixed(2)}`}
      </button>

      {!embedded && <Footer />}
    </>
  );
};



// ===== Inline Product Detail Modal — renders the full ProductDetailPage inside an overlay =====
export const ProductDetailModal = ({ productId, onClose }) => {
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
      data-testid="product-modal-overlay"
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
          data-testid="product-modal-close"
          aria-label="Close"
        >
          <X size={22} />
        </button>
        <div className="bb-overlay-scroll">
          <ProductDetailPage productId={productId} embedded onClose={onClose} />
        </div>
      </div>
    </div>
  );
};

