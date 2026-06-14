import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useSearchParams, useLocation } from 'react-router-dom';
import { Navbar, Footer } from '../components/Layout';
import { CartDrawer, TreatsSection, CheckoutForm, OrderSuccess, CatTreatsSection } from '../components/CartAndCheckout';
import { Calculator, Wheat, PawPrint } from 'lucide-react';

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
  const [subscriptionPlan, setSubscriptionPlan] = useState(null); // null or 'every_N_weeks'
  const [subOpen, setSubOpen] = useState(false); // collapsible toggle

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
                fontSize: '14px',
                fontWeight: 700,
                color: tab.active ? '#C8102E' : '#6A4F35',
                background: 'none',
                border: 'none',
                padding: '12px 18px 14px',
                cursor: tab.active ? 'default' : 'pointer',
                position: 'relative',
                whiteSpace: 'nowrap',
                letterSpacing: '0.08em',
                textTransform: 'uppercase'
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
                  background: '#C8102E',
                  borderRadius: '2px'
                }} />
              )}
            </button>
          ))}
        </div>

        {/* Category Tabs: Dog Food | Dog Treats | Cat Food | Cat Treats — text only, no pills */}
        <div className="menu-category-tabs" data-testid="menu-category-tabs" style={{
          display: 'flex',
          gap: '6px',
          padding: '0 0 14px',
          marginBottom: '32px',
          borderBottom: '1px solid #D8CFB8',
          overflowX: 'auto',
          flexWrap: 'nowrap'
        }}>
          {bannerCards.map((card) => (
            <button
              key={card.id}
              onClick={() => handleCategoryClick(card)}
              data-testid={`category-${card.id}`}
              style={{
                fontFamily: "'Barlow', sans-serif",
                fontSize: card.active ? '14px' : '13px',
                fontWeight: card.active ? 800 : 600,
                color: card.active ? '#3B2A1A' : '#8A7156',
                background: 'transparent',
                border: 'none',
                padding: '8px 16px 12px',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                position: 'relative',
                whiteSpace: 'nowrap'
              }}
            >
              {card.title}
              {card.active && (
                <span style={{
                  position: 'absolute',
                  bottom: '-1px',
                  left: '16px',
                  right: '16px',
                  height: '3px',
                  background: '#c8102e',
                  borderRadius: '2px'
                }} />
              )}
            </button>
          ))}
        </div>

        {/* Main Content - Dog or Cat */}
        <>
          {/* Compact header bar: Title + Subscribe pill + Checkout — seamless */}
          <div className="bb-header-row" data-testid="bb-header" style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            marginBottom: viewMode === 'food' ? '20px' : '30px',
            flexWrap: 'wrap'
          }}>
            <h1 className="bb-header-title" style={{
              fontFamily: "'Fraunces', Georgia, serif",
              fontSize: 'clamp(22px, 2.6vw, 30px)',
              fontWeight: '600',
              margin: 0,
              color: '#3B2A1A',
              textTransform: 'uppercase',
              letterSpacing: '0.04em',
              flex: '1 1 auto',
              minWidth: 0
            }}>
              {viewMode === 'treats'
                ? (petType === 'cat' ? 'RAW CAT TREATS' : 'RAW DOG TREATS')
                : (petType === 'cat' ? 'BUILD YOUR CAT BOX' : 'BUILD YOUR BOX')}
            </h1>
            <button 
              className="btn-cart-floating"
              onClick={() => setCartOpen(true)}
              data-testid="cart-button"
            >
              Checkout
              {isBoxComplete && viewMode === 'food' && (
                <span className="cart-complete-badge">✓</span>
              )}
              <span style={{ marginLeft: '6px', fontSize: '16px' }}>→</span>
            </button>
          </div>

          {viewMode === 'food' && (
          <>
          {/* Box Size Selector — no container, no heading, maximised tiles */}
          <div className="box-size-selector-bare" data-testid="box-size-selector">
            <div className="box-size-tabs">
              {BOX_OPTIONS.map(box => (
                <button
                  key={box.size}
                  className={`box-size-tab ${boxSize === box.size ? 'active' : ''}`}
                  onClick={() => handleBoxSizeChange(box.size)}
                  data-testid={`box-size-${box.size}lb`}
                >
                  {box.discount > 0 && (
                    <span className="box-discount-badge">{box.discount}% OFF</span>
                  )}
                  <span className="box-size-label">{box.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Subscribe & Save — checkbox, clean line above, no container */}
          <div data-testid="subscription-section" className="bb-subscribe-bare">
            <label className="bb-subscribe-row bb-subscribe-row--clickable">
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '12px' }}>
                <input
                  type="checkbox"
                  checked={!!subscriptionPlan}
                  onChange={() => {
                    if (subscriptionPlan) {
                      setSubscriptionPlan(null);
                      setSubOpen(false);
                    } else {
                      setSubscriptionPlan('every_2_weeks');
                      setSubOpen(true);
                    }
                  }}
                  data-testid="subscription-toggle"
                  className="bb-subscribe-checkbox"
                />
                <span className="bb-subscribe-label">Subscribe & Save 5%</span>
              </span>
            </label>

            {subscriptionPlan && subOpen && (
              <div data-testid="subscription-details" className="bb-subscribe-detail">
                <label className="bb-subscribe-detail-label">Deliver every</label>
                <select
                  value={subscriptionPlan}
                  onChange={(e) => setSubscriptionPlan(e.target.value)}
                  data-testid="subscription-weeks-select"
                  className="bb-subscribe-select"
                >
                  {[1, 2, 3, 4, 5, 6].map(n => (
                    <option key={n} value={`every_${n}_weeks`}>
                      {n === 1 ? 'Every week' : `Every ${n} weeks`}
                    </option>
                  ))}
                </select>
                <div className="bb-subscribe-perks">
                  {[
                    'Free delivery on every order',
                    '5% off — stacks on box-size discount',
                    'Pause, skip, or cancel anytime'
                  ].map((perk, i) => (
                    <div key={i} className="bb-subscribe-perk">
                      <span className="bb-subscribe-tick">✓</span>
                      <span>{perk}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Selected quantity — sleek, thin line with farm + bowl icons */}
          <div className="bb-progress-line" data-testid="box-progress-line">
            <span className="bb-progress-icon" aria-hidden="true">
              <Wheat size={18} strokeWidth={1.8} />
            </span>
            <div className="bb-progress-track">
              <div 
                className="bb-progress-fill" 
                style={{ width: `${Math.min(100, (getTotalSelectedLbs() / boxSize) * 100)}%` }}
              />
            </div>
            <span className="bb-progress-label" data-testid="box-progress-text">
              {getTotalSelectedLbs()}lb/{boxSize}lb
            </span>
            <span className="bb-progress-icon" aria-hidden="true">
              <PawPrint size={18} strokeWidth={1.8} />
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
                hideHeader={true}
              />
            ) : petType === 'dog' ? (
              <>
                {/* Comfort Dinner Collection - DOG */}
                <div className="product-collection menu-collection">
                  <div className="menu-collection-header" data-testid="collection-header-comfort">
                    <h3 className="menu-collection-title">COMFORT DINNER</h3>
                    <p className="menu-collection-desc">Complete raw nutrition for dogs of all-life stages.</p>
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
                <div className="product-collection menu-collection">
                  <div className="menu-collection-header" data-testid="collection-header-primal">
                    <h3 className="menu-collection-title">PRIMAL FEAST</h3>
                    <p className="menu-collection-desc">Whole prey raw meals made with 80% meat, 10% bone and 10% organ.</p>
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
                  showCategoryDescriptions={true}
                />
              </>
            ) : (
              <>
                {/* Royal Paws Collection - CAT */}
                <div className="product-collection menu-collection">
                  <div className="menu-collection-header" data-testid="collection-header-royal">
                    <h3 className="menu-collection-title">ROYAL PAWS DINNER</h3>
                    <p className="menu-collection-desc">Complete raw nutrition for cats of all life stages.</p>
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
                  showCategoryDescriptions={true}
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
      case 'comfort_dinner': return '#A4C0A0';
      case 'primal_feast': return '#C8102E';
      case 'royal_paws': return '#5E4B73';
      default: return '#C8102E';
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

  const goToProduct = () => {
    const root = document.getElementById('root');
    const scrollPos = root ? root.scrollTop : window.scrollY;
    sessionStorage.setItem('menuScrollPosition', scrollPos.toString());
    navigate(`/product/${product.product_id}`);
  };

  const stopAndDecrease = (e) => {
    e.stopPropagation();
    onUpdate(product.product_id, product.name, Math.max(0, selectedQty - 6));
  };
  const stopAndIncrease = (e) => {
    e.stopPropagation();
    if (canAdd) onUpdate(product.product_id, product.name, selectedQty + 6);
  };
  const stopAndAdd = (e) => {
    e.stopPropagation();
    if (canAdd) onUpdate(product.product_id, product.name, 6);
  };

  return (
    <div 
      className={`product-card-row ${isSelected ? 'is-selected' : ''}`}
      data-testid={`product-${product.product_id}`}
      onClick={goToProduct}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => { if (e.key === 'Enter') goToProduct(); }}
      style={{ cursor: 'pointer' }}
    >
      {/* Left: image */}
      <div className="product-card-media product-card-media--clean">
        <img src={productImage} alt={product.name} />
      </div>

      {/* Middle: text content */}
      <div className="product-card-content">
        <h4 className="product-card-title">{product.name}</h4>
        <p className="product-card-desc">
          {product.mini_description || product.description.split('.')[0]}
        </p>
        <div className="product-card-meta">
          <div className="product-card-price">
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
          <button
            className="product-card-more"
            onClick={(e) => { e.stopPropagation(); goToProduct(); }}
            data-testid={`learn-more-${product.product_id}`}
          >
            See more
          </button>
        </div>
      </div>

      {/* Right: qty counter — same color for ALL menu items (seamless cream → khaki when added) */}
      <div className="product-card-rightcol">
        <div 
          className="product-card-qty product-card-qty--menu" 
          data-active={selectedQty > 0 ? 'true' : 'false'}
        >
          <button
            className="qty-btn-mini"
            onClick={stopAndDecrease}
            disabled={selectedQty === 0}
            data-testid={`decrease-${product.product_id}`}
            aria-label="Decrease"
          >
            −
          </button>
          <span 
            className="qty-display-mini" 
            data-testid={`qty-${product.product_id}`}
          >
            {selectedQty > 0 ? `${selectedQty}lb` : '0'}
          </span>
          <button
            className="qty-btn-mini"
            onClick={selectedQty === 0 ? stopAndAdd : stopAndIncrease}
            disabled={!canAdd && selectedQty > 0}
            data-testid={`increase-${product.product_id}`}
            aria-label="Increase"
          >
            +
          </button>
        </div>
      </div>
    </div>
  );
};
