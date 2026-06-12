import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useSearchParams, useLocation } from 'react-router-dom';
import { Navbar, Footer } from '../components/Layout';
import { CartDrawer, TreatsSection, CheckoutForm, OrderSuccess, CatTreatsSection } from '../components/CartAndCheckout';
import { Calculator } from 'lucide-react';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

// Discount rates by box size - DOG
const DOG_DISCOUNT_RATES = {
  6: 0,
  18: 0.05,
  24: 0.10,
  36: 0.15
};

// Discount rates by box size - CAT
const CAT_DISCOUNT_RATES = {
  6: 0,
  12: 0.05
};

// Box size options - DOG
const DOG_BOX_OPTIONS = [
  { size: 6, label: '6 lb', discount: 0 },
  { size: 18, label: '18 lb', discount: 5 },
  { size: 24, label: '24 lb', discount: 10 },
  { size: 36, label: '36 lb', discount: 15 }
];

// Box size options - CAT
const CAT_BOX_OPTIONS = [
  { size: 6, label: '6 lb', discount: 0 },
  { size: 12, label: '12 lb', discount: 5 }
];

// Collection banner images
const COLLECTION_IMAGES = {
  dog: 'https://customer-assets.emergentagent.com/job_c26be434-5664-4617-995c-8c836934bef5/artifacts/1olxgtz6_3.png',
  cat: 'https://customer-assets.emergentagent.com/job_c26be434-5664-4617-995c-8c836934bef5/artifacts/7fyd6l6l_4.png',
  comfort_dinner: 'https://customer-assets.emergentagent.com/job_c26be434-5664-4617-995c-8c836934bef5/artifacts/a5bhlhqi_5.png',
  primal_feast: 'https://customer-assets.emergentagent.com/job_c26be434-5664-4617-995c-8c836934bef5/artifacts/wtts10dz_4.png',
  royal_paws: 'https://customer-assets.emergentagent.com/job_c26be434-5664-4617-995c-8c836934bef5/artifacts/u0taocl0_6.png'
};

export const BoxBuilder = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const location = useLocation();
  const [petType, setPetType] = useState('dog'); // 'dog' or 'cat'
  const [viewMode, setViewMode] = useState('food'); // 'food' or 'treats'
  
  // Load from sessionStorage on mount
  const initialBoxSize = parseInt(sessionStorage.getItem('boxSize')) || 6;
  const initialProteins = JSON.parse(sessionStorage.getItem('selectedProteins') || '{}');
  const initialTreats = JSON.parse(sessionStorage.getItem('selectedTreats') || '[]');
  
  const [boxSize, setBoxSize] = useState(initialBoxSize);
  const [products, setProducts] = useState([]);
  const [treats, setTreats] = useState([]);
  const [selectedProteins, setSelectedProteins] = useState(initialProteins);
  const [selectedTreats, setSelectedTreats] = useState(initialTreats);
  const [orderComplete, setOrderComplete] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [showCheckout, setShowCheckout] = useState(false);
  const [loading, setLoading] = useState(true);
  const [subscriptionPlan, setSubscriptionPlan] = useState(null); // null, 'biweekly', 'monthly'

  // Get current discount rates and box options based on pet type
  const DISCOUNT_RATES = petType === 'cat' ? CAT_DISCOUNT_RATES : DOG_DISCOUNT_RATES;
  const BOX_OPTIONS = petType === 'cat' ? CAT_BOX_OPTIONS : DOG_BOX_OPTIONS;

  // Check URL parameters on mount to restore state after refresh
  useEffect(() => {
    const step = searchParams.get('step');
    if (step === 'checkout') {
      setShowCheckout(true);
    } else if (step === 'success') {
      setOrderComplete(true);
    }
  }, []);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const [productsRes, treatsRes] = await Promise.all([
          axios.get(`${API}/products?pet_type=${petType}`),
          axios.get(`${API}/treats?pet_type=${petType}`)
        ]);
        setProducts(productsRes.data);
        setTreats(treatsRes.data);
      } catch (error) {
        console.error('Failed to load data:', error);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [petType]);

  // Restore scroll position after loading completes
  useEffect(() => {
    if (!loading && products.length > 0) {
      const savedPosition = sessionStorage.getItem('menuScrollPosition');
      if (savedPosition) {
        const scrollTo = parseInt(savedPosition, 10);
        const root = document.getElementById('root');
        // Use requestAnimationFrame to ensure DOM is painted
        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            if (root) {
              root.scrollTop = scrollTo;
            }
            window.scrollTo(0, scrollTo);
            document.documentElement.scrollTop = scrollTo;
            sessionStorage.removeItem('menuScrollPosition');
          });
        });
      }
      
      // Sync all cart state from sessionStorage when returning to menu
      const savedBoxSize = parseInt(sessionStorage.getItem('boxSize'));
      const savedProteins = JSON.parse(sessionStorage.getItem('selectedProteins') || '{}');
      const savedTreats = JSON.parse(sessionStorage.getItem('selectedTreats') || '[]');
      
      if (savedBoxSize && savedBoxSize !== boxSize) {
        setBoxSize(savedBoxSize);
      }
      
      // Update selectedProteins if different
      const currentProteinsStr = JSON.stringify(selectedProteins);
      const savedProteinsStr = JSON.stringify(savedProteins);
      if (currentProteinsStr !== savedProteinsStr) {
        setSelectedProteins(savedProteins);
      }
      
      // Update selectedTreats if different
      const currentTreatsStr = JSON.stringify(selectedTreats);
      const savedTreatsStr = JSON.stringify(savedTreats);
      if (currentTreatsStr !== savedTreatsStr) {
        setSelectedTreats(savedTreats);
      }
      
      // Check if there's a product to add from product detail page
      const addToBox = sessionStorage.getItem('addToBox');
      if (addToBox) {
        const productData = JSON.parse(addToBox);
        setSelectedProteins(prev => ({
          ...prev,
          [productData.product_id]: {
            name: productData.name,
            qty: productData.qty
          }
        }));
        sessionStorage.removeItem('addToBox');
      }
      
      // Check if there's a treat to add from treat detail page
      const addTreatToBox = sessionStorage.getItem('addTreatToBox');
      if (addTreatToBox) {
        const treatData = JSON.parse(addTreatToBox);
        setSelectedTreats(prev => {
          const existing = prev.find(t => t.treat_id === treatData.treat_id);
          if (existing) {
            return prev.map(t => t.treat_id === treatData.treat_id 
              ? { ...t, quantity: (t.quantity || 1) + treatData.quantity }
              : t
            );
          } else {
            return [...prev, { 
              treat_id: treatData.treat_id, 
              name: treatData.name, 
              price: treatData.price, 
              quantity: treatData.quantity 
            }];
          }
        });
        sessionStorage.removeItem('addTreatToBox');
      }
    }
  }, [loading, products.length]);

  // Reset selections when pet type changes
  const handlePetTypeChange = (newPetType) => {
    setPetType(newPetType);
    setSelectedProteins({});
    setSelectedTreats([]);
    // Set default box size for new pet type
    setBoxSize(newPetType === 'cat' ? 6 : 6);
  };

  const bannerCards = [
    { id: 'dog-food', title: 'Raw Dog Food', petType: 'dog', viewMode: 'food', active: petType === 'dog' && viewMode === 'food' },
    { id: 'dog-treats', title: 'Raw Dog Treats', petType: 'dog', viewMode: 'treats', active: petType === 'dog' && viewMode === 'treats' },
    { id: 'cat-food', title: 'Raw Cat Food', petType: 'cat', viewMode: 'food', active: petType === 'cat' && viewMode === 'food' },
    { id: 'cat-treats', title: 'Raw Cat Treats', petType: 'cat', viewMode: 'treats', active: petType === 'cat' && viewMode === 'treats' }
  ];

  const handleCategoryClick = (card) => {
    if (card.petType !== petType) {
      setSelectedProteins({});
      setSelectedTreats([]);
    }
    setPetType(card.petType);
    setViewMode(card.viewMode);
  };

  const topNavTabs = [
    { id: 'menu', label: 'Menu', path: '/menu', active: true },
    { id: 'meal-plan', label: 'Meal Plan', path: '/meal-plan', active: false },
    { id: 'calculator', label: 'Calculator', path: '/calculator', active: false }
  ];

  // Calculate price for 6lb based on box size discount
  const getDiscountedPrice = (basePrice) => {
    const discount = DISCOUNT_RATES[boxSize] || 0;
    return basePrice * (1 - discount);
  };

  // Get base 6lb price for a product
  const getBasePrice = (product) => {
    const tier = product.pricing.find(p => p.size_lb === 6) || product.pricing[0];
    return tier.price;
  };

  // Calculate total lbs selected
  const getTotalSelectedLbs = () => {
    return Object.values(selectedProteins).reduce((sum, data) => sum + data.qty, 0);
  };

  // Handle box size change - reset selections if they exceed new size
  const handleBoxSizeChange = (newSize) => {
    const currentTotal = getTotalSelectedLbs();
    if (currentTotal > newSize) {
      // Reset selections if they exceed new box size
      setSelectedProteins({});
    }
    setBoxSize(newSize);
    sessionStorage.setItem('boxSize', newSize.toString());
  };

  const handleUpdateProtein = (productId, productName, quantity) => {
    setSelectedProteins(prev => {
      const updated = { 
        ...prev, 
        [productId]: { qty: quantity, name: productName }
      };
      sessionStorage.setItem('selectedProteins', JSON.stringify(updated));
      return updated;
    });
  };

  const handleToggleTreat = (treat, newQuantity) => {
    if (newQuantity === undefined) {
      // Old toggle behavior for backwards compatibility
      setSelectedTreats(prev => 
        prev.some(t => t.treat_id === treat.treat_id)
          ? prev.filter(t => t.treat_id !== treat.treat_id)
          : [...prev, { ...treat, quantity: 1 }]
      );
    } else if (newQuantity === 0) {
      // Remove treat
      setSelectedTreats(prev => prev.filter(t => t.treat_id !== treat.treat_id));
    } else {
      // Update quantity
      setSelectedTreats(prev => {
        const existing = prev.find(t => t.treat_id === treat.treat_id);
        if (existing) {
          return prev.map(t => t.treat_id === treat.treat_id ? { ...t, quantity: newQuantity } : t);
        } else {
          return [...prev, { ...treat, quantity: newQuantity }];
        }
      });
    }
  };

  const canAdd = (productId) => {
    const currentQty = selectedProteins[productId]?.qty || 0;
    const totalSelected = getTotalSelectedLbs();
    return totalSelected + 6 <= boxSize && currentQty + 6 <= boxSize;
  };

  const isBoxComplete = getTotalSelectedLbs() === boxSize;

  if (orderComplete) {
    return (
      <>
        <Navbar />
        <OrderSuccess />
        <Footer />
      </>
    );
  }

  if (showCheckout) {
    return (
      <>
        <Navbar />
        <div className="box-builder">
          <button 
            className="btn-secondary" 
            onClick={() => {
              setShowCheckout(false);
              setSearchParams({});
            }}
            style={{ marginBottom: '20px', width: 'auto', padding: '12px 24px' }}
          >
            ← Back to Menu
          </button>
          <CheckoutForm 
            boxSize={boxSize}
            selectedProteins={selectedProteins}
            selectedTreats={selectedTreats}
            products={products}
            subscriptionPlan={subscriptionPlan}
            onSuccess={() => {
              setOrderComplete(true);
              setSearchParams({ step: 'success' });
            }}
          />
        </div>
        <Footer />
      </>
    );
  }

  const comfortDinnerProducts = products.filter(p => p.product_line === 'comfort_dinner');
  const primalFeastProducts = products.filter(p => p.product_line === 'primal_feast');
  const royalPawsProducts = products.filter(p => p.product_line === 'royal_paws');

  return (
    <>
      <Navbar />
      <div className="box-builder">
        {/* Top Nav Tabs: Menu | Meal Plan | Calculator */}
        <div className="menu-top-nav" data-testid="menu-top-nav" style={{
          display: 'flex',
          gap: '4px',
          padding: '0 4px 16px',
          borderBottom: '1px solid #E8DDD0',
          marginBottom: '24px',
          overflowX: 'auto'
        }}>
          {topNavTabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => !tab.active && navigate(tab.path)}
              data-testid={`top-nav-${tab.id}`}
              style={{
                fontFamily: "'Barlow', sans-serif",
                fontSize: '17px',
                fontWeight: 700,
                color: tab.active ? '#c8102e' : '#5A5A5A',
                background: 'none',
                border: 'none',
                padding: '12px 18px 14px',
                cursor: tab.active ? 'default' : 'pointer',
                position: 'relative',
                whiteSpace: 'nowrap',
                letterSpacing: '0.01em',
                textTransform: 'none'
              }}
            >
              {tab.label}
              {tab.active && (
                <span style={{
                  position: 'absolute',
                  bottom: '-1px',
                  left: '18px',
                  right: '18px',
                  height: '3px',
                  background: '#c8102e',
                  borderRadius: '2px'
                }} />
              )}
            </button>
          ))}
        </div>

        {/* Category Tabs: Dog Food | Dog Treats | Cat Food | Cat Treats */}
        <div className="menu-category-tabs" data-testid="menu-category-tabs" style={{
          display: 'flex',
          gap: '12px',
          padding: '4px',
          marginBottom: '28px',
          flexWrap: 'wrap'
        }}>
          {bannerCards.map((card) => (
            <button
              key={card.id}
              onClick={() => handleCategoryClick(card)}
              data-testid={`category-${card.id}`}
              style={{
                fontFamily: "'Barlow', sans-serif",
                fontSize: '15px',
                fontWeight: 700,
                color: card.active ? '#FFFFFF' : '#c8102e',
                background: card.active ? '#c8102e' : 'transparent',
                border: `2px solid ${card.active ? '#c8102e' : '#D8CFB8'}`,
                padding: '10px 22px',
                borderRadius: '999px',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                letterSpacing: '0.01em',
                textTransform: 'none',
                boxShadow: card.active ? '0 4px 12px rgba(200,16,46,0.18)' : 'none'
              }}
            >
              {card.title}
            </button>
          ))}
        </div>

        {/* Main Content - Dog or Cat */}
        <>
          {/* Header with cart button (always visible) */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
            <div>
              <h1 style={{ fontFamily: "'Barlow', sans-serif", fontSize: '32px', fontWeight: '800', marginBottom: '8px', color: '#2B2B2B', textTransform: 'none' }}>
                {viewMode === 'treats'
                  ? (petType === 'cat' ? 'Raw Cat Treats' : 'Raw Dog Treats')
                  : (petType === 'cat' ? 'Build your cat box' : 'Build your box')}
              </h1>
              <p style={{ fontFamily: "'Barlow', sans-serif", fontWeight: '400', color: '#666' }}>
                {viewMode === 'treats'
                  ? 'Shop our farm-fresh raw treats à la carte'
                  : (petType === 'cat'
                    ? 'Select your box size, then choose your cat proteins'
                    : 'Select your box size, then choose your proteins')}
              </p>
            </div>
            <button 
              className="btn-cart-floating"
              onClick={() => setCartOpen(true)}
              data-testid="cart-button"
            >
              {viewMode === 'food' ? (
                <>Checkout {getTotalSelectedLbs()}/{boxSize}lb</>
              ) : (
                <>View Cart</>
              )}
              {isBoxComplete && viewMode === 'food' && (
                <span className="cart-complete-badge">✓</span>
              )}
              <span style={{ marginLeft: '8px', fontSize: '18px' }}>→</span>
            </button>
          </div>

          {viewMode === 'food' && (
          <>
          {/* Box Size Selector - Inline */}
          <div className="box-size-selector-inline" data-testid="box-size-selector">
            <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '16px', color: '#c8102e' }}>
              Select Box Size
            </h3>
            <div className="box-size-tabs">
              {BOX_OPTIONS.map(box => (
                <button
                  key={box.size}
                  className={`box-size-tab ${boxSize === box.size ? 'active' : ''}`}
                  onClick={() => handleBoxSizeChange(box.size)}
                  data-testid={`box-size-${box.size}lb`}
                >
                  <span className="box-size-label">{box.label}</span>
                  {box.discount > 0 && (
                    <span className="box-discount-badge">Save {box.discount}%</span>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Subscription Selector */}
          <div style={{
            background: 'linear-gradient(135deg, #FDF8F3 0%, #F5F1EB 100%)',
            borderRadius: '16px',
            padding: '24px',
            marginBottom: '20px',
            border: '2px solid #E8DDD0'
          }}>
            <div style={{ display: 'flex', gap: '24px', alignItems: 'flex-start' }}>
              {/* Left: Subscription Options */}
              <div style={{ flex: 1 }}>
                <h3 style={{ fontSize: '18px', fontWeight: '700', marginBottom: '4px', color: '#2B2B2B' }}>
                  Subscribe & Save
                </h3>
                <p style={{ fontSize: '13px', color: '#666', marginBottom: '16px' }}>
                  Get automatic deliveries and exclusive perks
                </p>
                
                <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                  {/* Biweekly */}
                  <button
                    onClick={() => setSubscriptionPlan('biweekly')}
                    style={{
                      flex: '1 1 160px',
                      padding: '16px 20px',
                      borderRadius: '12px',
                      border: subscriptionPlan === 'biweekly' ? '3px solid #2F4538' : '2px solid #E8DDD0',
                      background: subscriptionPlan === 'biweekly' ? '#E8F5E9' : 'white',
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                      boxShadow: subscriptionPlan === 'biweekly' ? '0 4px 12px rgba(95, 124, 90, 0.2)' : 'none'
                    }}
                  >
                    <div style={{ fontSize: '16px', fontWeight: '700', color: subscriptionPlan === 'biweekly' ? '#2F4538' : '#2B2B2B', marginBottom: '4px' }}>
                      Every 2 Weeks
                    </div>
                    <div style={{ fontSize: '12px', color: '#666' }}>Most Popular</div>
                  </button>

                  {/* Monthly */}
                  <button
                    onClick={() => setSubscriptionPlan('monthly')}
                    style={{
                      flex: '1 1 160px',
                      padding: '16px 20px',
                      borderRadius: '12px',
                      border: subscriptionPlan === 'monthly' ? '3px solid #2F4538' : '2px solid #E8DDD0',
                      background: subscriptionPlan === 'monthly' ? '#E8F5E9' : 'white',
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                      boxShadow: subscriptionPlan === 'monthly' ? '0 4px 12px rgba(95, 124, 90, 0.2)' : 'none'
                    }}
                  >
                    <div style={{ fontSize: '16px', fontWeight: '700', color: subscriptionPlan === 'monthly' ? '#2F4538' : '#2B2B2B', marginBottom: '4px' }}>
                      Monthly
                    </div>
                    <div style={{ fontSize: '12px', color: '#666' }}>Flexible</div>
                  </button>

                  {/* No Subscription */}
                  <button
                    onClick={() => setSubscriptionPlan(null)}
                    style={{
                      padding: '8px 16px',
                      borderRadius: '8px',
                      border: 'none',
                      background: 'transparent',
                      cursor: 'pointer',
                      fontSize: '13px',
                      color: subscriptionPlan === null ? '#c8102e' : '#999',
                      textDecoration: subscriptionPlan === null ? 'underline' : 'none',
                      fontWeight: subscriptionPlan === null ? '600' : '400'
                    }}
                  >
                    One-time purchase
                  </button>
                </div>
              </div>

              {/* Right: Benefits */}
              <div style={{
                background: 'white',
                borderRadius: '12px',
                padding: '16px 20px',
                minWidth: '220px',
                border: '1px solid #E8DDD0'
              }}>
                <div style={{ fontSize: '14px', fontWeight: '600', marginBottom: '12px', color: '#2B2B2B' }}>
                  Subscriber Perks:
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ color: '#2F4538', fontSize: '16px' }}>✓</span>
                    <span style={{ fontSize: '13px', color: '#2B2B2B' }}>Free Delivery</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ color: '#2F4538', fontSize: '16px' }}>✓</span>
                    <span style={{ fontSize: '13px', color: '#2B2B2B', fontWeight: '600' }}>5% Off Every Order</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ color: '#2F4538', fontSize: '16px' }}>✓</span>
                    <span style={{ fontSize: '13px', color: '#2B2B2B' }}>Pause or Cancel anytime</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="box-progress-bar">
            <div 
              className="box-progress-fill" 
              style={{ width: `${(getTotalSelectedLbs() / boxSize) * 100}%` }}
            />
            <span 
              className="box-progress-text"
              style={{ 
                color: (getTotalSelectedLbs() / boxSize) >= 0.5 ? '#FDFCFA' : 'var(--charcoal)',
                textShadow: (getTotalSelectedLbs() / boxSize) >= 0.5 ? '0 1px 2px rgba(0, 0, 0, 0.3)' : '0 1px 2px rgba(255, 255, 255, 0.8)'
              }}
            >
              {getTotalSelectedLbs()}lb / {boxSize}lb selected
            </span>
          </div>
          </>
          )}

            {loading ? (
              <div style={{ padding: '60px', textAlign: 'center' }}>Loading products...</div>
            ) : viewMode === 'treats' ? (
              <TreatsSection 
                selectedTreats={selectedTreats}
                onToggleTreat={handleToggleTreat}
                petType={petType}
                navigate={navigate}
              />
            ) : petType === 'dog' ? (
              <>
                {/* Comfort Dinner Collection - DOG */}
                <div className="product-collection">
                  {/* Collection Banner */}
                  <div style={{
                    position: 'relative',
                    height: '280px',
                    borderRadius: '20px',
                    overflow: 'hidden',
                    marginBottom: '28px'
                  }}>
                    <img 
                      src={COLLECTION_IMAGES.comfort_dinner}
                      alt="Comfort Dinner Collection"
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                    <div style={{
                      position: 'absolute',
                      inset: 0,
                      background: 'linear-gradient(to right, rgba(95, 124, 90, 0.95) 0%, rgba(95, 124, 90, 0.7) 50%, rgba(95, 124, 90, 0.3) 100%)',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'center',
                      padding: '32px 40px'
                    }}>
                      <h3 style={{
                        fontFamily: "'Barlow', sans-serif",
                        fontSize: '36px',
                        fontWeight: '800',
                        color: '#FFFFFF',
                        margin: '0 0 12px 0',
                        textTransform: 'uppercase',
                        letterSpacing: '0.05em'
                      }}>Comfort Dinner</h3>
                      <p style={{
                        fontFamily: "'Barlow', sans-serif",
                        fontWeight: '400',
                        color: 'rgba(255,255,255,0.95)',
                        fontSize: '15px',
                        margin: '0 0 16px 0',
                        maxWidth: '600px',
                        lineHeight: '1.6'
                      }}>Complete and balanced raw dinners made to AAFCO standards using 70% meat, 10% bone, 10% organ, 8% fruits & vegetables, 2% supplements.</p>
                      <p style={{
                        color: 'rgba(255,255,255,0.85)',
                        fontSize: '13px',
                        margin: 0,
                        maxWidth: '600px',
                        lineHeight: '1.5'
                      }}><strong>For:</strong> Ready to serve for dogs of all-life stages, no extra supplements needed.</p>
                    </div>
                  </div>
                  
                  <div className="product-grid">
                    {comfortDinnerProducts.map(product => (
                      <ProductCard 
                        key={product.product_id}
                        product={product}
                        selectedQty={selectedProteins[product.product_id]?.qty || 0}
                        onUpdate={handleUpdateProtein}
                        canAdd={canAdd(product.product_id)}
                        getDiscountedPrice={getDiscountedPrice}
                        getBasePrice={getBasePrice}
                        boxSize={boxSize}
                        navigate={navigate}
                        petType={petType}
                      />
                    ))}
                  </div>
                </div>

                {/* Primal Feast Collection - DOG */}
                <div className="product-collection">
                  {/* Collection Banner */}
                  <div style={{
                    position: 'relative',
                    height: '280px',
                    borderRadius: '20px',
                    overflow: 'hidden',
                    marginBottom: '28px'
                  }}>
                    <img 
                      src={COLLECTION_IMAGES.primal_feast}
                      alt="Primal Feast Collection"
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                    <div style={{
                      position: 'absolute',
                      inset: 0,
                      background: 'linear-gradient(to right, rgba(115, 40, 39, 0.95) 0%, rgba(115, 40, 39, 0.7) 50%, rgba(115, 40, 39, 0.3) 100%)',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'center',
                      padding: '32px 40px'
                    }}>
                      <h3 style={{
                        fontFamily: "'Barlow', sans-serif",
                        fontSize: '36px',
                        fontWeight: '800',
                        color: '#FFFFFF',
                        margin: '0 0 12px 0',
                        textTransform: 'uppercase',
                        letterSpacing: '0.05em'
                      }}>Primal Feast</h3>
                      <p style={{
                        fontFamily: "'Barlow', sans-serif",
                        fontWeight: '400',
                        color: 'rgba(255,255,255,0.95)',
                        fontSize: '15px',
                        margin: '0 0 16px 0',
                        maxWidth: '600px',
                        lineHeight: '1.6'
                      }}>Farm-fresh whole prey raw food made with 80% meat, 10% bone, 10% organ (Prey Model Raw ratio) designed for customizable feeding.</p>
                      <p style={{
                        color: 'rgba(255,255,255,0.85)',
                        fontSize: '13px',
                        margin: 0,
                        maxWidth: '600px',
                        lineHeight: '1.5'
                      }}><strong>For:</strong> DIY raw feeding, rotation, toppers, or supplementation. Not complete on its own.</p>
                    </div>
                  </div>

                  <div className="product-grid">
                    {primalFeastProducts.map(product => (
                      <ProductCard 
                        key={product.product_id}
                        product={product}
                        selectedQty={selectedProteins[product.product_id]?.qty || 0}
                        onUpdate={handleUpdateProtein}
                        canAdd={canAdd(product.product_id)}
                        getDiscountedPrice={getDiscountedPrice}
                        getBasePrice={getBasePrice}
                        boxSize={boxSize}
                        navigate={navigate}
                        petType={petType}
                      />
                    ))}
                  </div>
                </div>

                {/* Treats Section - DOG */}
                <TreatsSection 
                  selectedTreats={selectedTreats}
                  onToggleTreat={handleToggleTreat}
                  petType="dog"
                  navigate={navigate}
                />
              </>
            ) : (
              <>
                {/* Royal Paws Collection - CAT */}
                <div className="product-collection">
                  {/* Collection Banner */}
                  <div style={{
                    position: 'relative',
                    height: '280px',
                    borderRadius: '20px',
                    overflow: 'hidden',
                    marginBottom: '28px'
                  }}>
                    <img 
                      src={COLLECTION_IMAGES.royal_paws}
                      alt="Royal Paws Collection"
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                    <div style={{
                      position: 'absolute',
                      inset: 0,
                      background: 'linear-gradient(to right, rgba(94, 75, 115, 0.95) 0%, rgba(94, 75, 115, 0.7) 50%, rgba(94, 75, 115, 0.3) 100%)',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'center',
                      padding: '32px 40px'
                    }}>
                      <h3 style={{
                        fontFamily: "'Barlow', sans-serif",
                        fontSize: '36px',
                        fontWeight: '800',
                        color: '#FFFFFF',
                        margin: '0 0 12px 0',
                        textTransform: 'uppercase',
                        letterSpacing: '0.05em'
                      }}>Royal Paws Dinner</h3>
                      <p style={{
                        fontFamily: "'Barlow', sans-serif",
                        fontWeight: '400',
                        color: 'rgba(255,255,255,0.95)',
                        fontSize: '15px',
                        margin: '0 0 16px 0',
                        maxWidth: '600px',
                        lineHeight: '1.6'
                      }}>Complete and balanced raw meals crafted for your cat&apos;s carnivorous biology using 95% meat, organs &amp; bone, 3% fruits &amp; vegetables, 2% supplements.</p>
                      <p style={{
                        color: 'rgba(255,255,255,0.85)',
                        fontSize: '13px',
                        margin: 0,
                        maxWidth: '600px',
                        lineHeight: '1.5'
                      }}><strong>For:</strong> Daily feeding for cats of all life stages. Supports lean muscle, digestion & coat health. Additional supplements welcome.</p>
                    </div>
                  </div>
                  
                  <div className="product-grid">
                    {royalPawsProducts.map(product => (
                      <ProductCard 
                        key={product.product_id}
                        product={product}
                        selectedQty={selectedProteins[product.product_id]?.qty || 0}
                        onUpdate={handleUpdateProtein}
                        canAdd={canAdd(product.product_id)}
                        getDiscountedPrice={getDiscountedPrice}
                        getBasePrice={getBasePrice}
                        boxSize={boxSize}
                        navigate={navigate}
                        petType={petType}
                      />
                    ))}
                  </div>
                </div>

                {/* Treats Section - CAT */}
                <TreatsSection 
                  selectedTreats={selectedTreats}
                  onToggleTreat={handleToggleTreat}
                  petType="cat"
                  navigate={navigate}
                />
              </>
            )}

            {/* Cart Drawer */}
            <CartDrawer 
              isOpen={cartOpen}
              onClose={() => setCartOpen(false)}
              boxSize={boxSize}
              selectedProteins={selectedProteins}
              selectedTreats={selectedTreats}
              products={products}
              onProceed={() => { 
                setCartOpen(false); 
                setShowCheckout(true);
                setSearchParams({ step: 'checkout' });
              }}
              getDiscountedPrice={getDiscountedPrice}
              getBasePrice={getBasePrice}
              subscriptionPlan={subscriptionPlan}
              onSubscriptionChange={setSubscriptionPlan}
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
        </>
      </div>
      <Footer />
    </>
  );
};

// Product Card Component
const ProductCard = ({ product, selectedQty, onUpdate, canAdd, getDiscountedPrice, getBasePrice, boxSize, navigate, petType }) => {
  const basePrice = getBasePrice(product);
  const discountedPrice = getDiscountedPrice(basePrice);
  const hasDiscount = boxSize > 6;
  
  // Product image URL - use the uploaded comfort dinner image for all products
  const productImage = 'https://customer-assets.emergentagent.com/job_site-upload-4/artifacts/ktno4gsu_2024%20site%20pics.jpg';
  
  // Get collection color based on product line
  const getCollectionColor = () => {
    switch(product.product_line) {
      case 'comfort_dinner': return '#2F4538';
      case 'primal_feast': return '#9D0D23';
      case 'royal_paws': return '#5e4b73';
      default: return '#c8102e';
    }
  };
  
  const getCollectionLabel = () => {
    switch(product.product_line) {
      case 'comfort_dinner': return 'Complete & Balanced';
      case 'primal_feast': return '80/10/10 Base';
      case 'royal_paws': return 'Complete & Balanced';
      default: return '';
    }
  };

  const collectionColor = getCollectionColor();
  const isSelected = selectedQty > 0;
  
  return (
    <div 
      className="product-card" 
      data-testid={`product-${product.product_id}`}
      style={{
        border: isSelected ? '3px solid #c8102e' : '3px solid transparent',
        boxShadow: isSelected ? '0 4px 20px rgba(164, 30, 52, 0.25)' : undefined,
        transition: 'all 0.2s ease'
      }}
    >
      {/* Product Image */}
      <div style={{
        width: '100%',
        height: '180px',
        borderRadius: '12px',
        overflow: 'hidden',
        marginBottom: '16px',
        background: '#f5f5f5'
      }}>
        <img 
          src={productImage}
          alt={product.name}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover'
          }}
        />
      </div>
      
      <h4 style={{ 
        fontSize: '18px', 
        margin: '0 0 8px 0', 
        textTransform: 'none',
        fontWeight: '600'
      }}>
        {product.name}
      </h4>
      <p style={{ 
        fontSize: '13px', 
        color: '#666', 
        lineHeight: '1.4', 
        marginBottom: '16px'
      }}>
        {product.mini_description || product.description.split('.')[0]}
      </p>
      
      {/* Price Display */}
      <div className="product-price-display">
        {hasDiscount ? (
          <>
            <span className="price-original">${basePrice.toFixed(2)}</span>
            <span className="price-discounted">${discountedPrice.toFixed(2)}</span>
          </>
        ) : (
          <span className="price-regular">${basePrice.toFixed(2)}</span>
        )}
        <span className="price-unit">/ 6lb</span>
      </div>
      
      {/* Quantity Controls */}
      <div className="quantity-controls">
        <button 
          className="qty-btn"
          onClick={() => onUpdate(product.product_id, product.name, Math.max(0, selectedQty - 6))}
          disabled={selectedQty === 0}
          data-testid={`decrease-${product.product_id}`}
        >
          −
        </button>
        <div className="qty-display" data-testid={`qty-${product.product_id}`}>
          {selectedQty}lb
        </div>
        <button 
          className="qty-btn"
          onClick={() => onUpdate(product.product_id, product.name, selectedQty + 6)}
          disabled={!canAdd}
          data-testid={`increase-${product.product_id}`}
        >
          +
        </button>
      </div>
      
      <button 
        className="btn-learn-more"
        onClick={() => {
          const root = document.getElementById('root');
          const scrollPos = root ? root.scrollTop : window.scrollY;
          sessionStorage.setItem('menuScrollPosition', scrollPos.toString());
          navigate(`/product/${product.product_id}`);
        }}
        data-testid={`learn-more-${product.product_id}`}
      >
        See more
      </button>
    </div>
  );
};
