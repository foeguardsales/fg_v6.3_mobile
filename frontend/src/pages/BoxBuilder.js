import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useSearchParams, useLocation } from 'react-router-dom';
import { Navbar, Footer } from '../components/Layout';
import { CartDrawer, TreatsSection, CheckoutForm, OrderSuccess, CatTreatsSection } from '../components/CartAndCheckout';
import { Calculator, Wheat, PawPrint, X } from 'lucide-react';
import { ProductDetailModal } from './ProductDetail';
import { FeedingCalculator } from '../components/FeedingCalculator';

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
  const [viewMode, setViewMode] = useState('food'); // 'food' | 'treats'

  // Mini top-sheet (legacy, no longer used)
  const [topSheetOpen, setTopSheetOpen] = useState(false);
  const [topSheetSeen, setTopSheetSeen] = useState(false);

  // Funnel overlay — full-screen choice picker shown on first menu landing
  // Stays as a re-openable selector via Edit button after dismissal
  const initialSelection = sessionStorage.getItem('foeguard_selection') || null;
  const [funnelOpen, setFunnelOpen] = useState(!initialSelection);
  const [selectionId, setSelectionId] = useState(initialSelection || 'shop-raw');

  // Inline product modal state — replaces /product/:id navigation
  const [activeProductId, setActiveProductId] = useState(null);

  // Inline calculator modal state — replaces /calculator navigation
  const [calcOpen, setCalcOpen] = useState(false);
  
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

  // Auto-skip the funnel if user previously made a selection (within session)
  useEffect(() => {
    const sel = sessionStorage.getItem('foeguard_selection');
    if (sel) {
      setFunnelOpen(false);
      setSelectionId(sel);
    } else {
      setFunnelOpen(true);
    }
  }, []);

  // Listen for global "open cart" event (from header cart icon)
  useEffect(() => {
    const open = () => setCartOpen(true);
    window.addEventListener('foeguard:open-cart', open);
    return () => window.removeEventListener('foeguard:open-cart', open);
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
    { id: 'menu', label: 'Raw Food Menu', path: '/menu', active: true },
    { id: 'meal-plan', label: 'Build Your Meal Plan', path: '/meal-plan', active: false },
    { id: 'calculator', label: 'Feeding Calculator', path: '/calculator', active: false }
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

  // Cheapest per-lb price for chicken at a given box size (for box-size selector subtext)
  const getCheapestChickenPerLbForBox = (sizeLb) => {
    if (!products || products.length === 0) return null;
    const chicken = products.filter(p => p.protein_type === 'chicken');
    let cheapest = Infinity;
    chicken.forEach(p => {
      // pricing is stored per 6lb size base; the discounted price for this box size = base * (1 - discountRate)
      const tier = p.pricing?.find(t => t.size_lb === 6) || p.pricing?.[0];
      if (!tier) return;
      const base = tier.price;
      const discount = DISCOUNT_RATES[sizeLb] || 0;
      const discounted = base * (1 - discount);
      const perLb = discounted / 6;
      if (perLb < cheapest) cheapest = perLb;
    });
    return cheapest === Infinity ? null : cheapest;
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
    // Close auto-opened top-sheet on first interaction
    if (topSheetOpen) {
      setTopSheetOpen(false);
      sessionStorage.setItem('foeguard_menu_topsheet_seen', '1');
    }
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

  // Box size — show only on food view
  const showBoxSize = viewMode === 'food';

  return (
    <>
      <Navbar />

      {/* Selection breadcrumb — visible after funnel is dismissed */}
      {!funnelOpen && (
        <SelectionBreadcrumb
          label={
            selectionId === 'meal-plan' ? 'Build a Meal Plan'
            : selectionId === 'calculator' ? 'Feeding Calculator'
            : 'Raw Food Menu'
          }
          onEdit={() => setFunnelOpen(true)}
        />
      )}

      <div className="box-builder box-builder--narrow">
        {/* Funnel overlay: full-screen choice picker hovering above the menu */}
        <MenuFunnel
          open={funnelOpen}
          dismissable={!!sessionStorage.getItem('foeguard_selection')}
          selectedId={selectionId}
          onClose={() => setFunnelOpen(false)}
          onShopRaw={() => {
            sessionStorage.setItem('foeguard_selection', 'shop-raw');
            setSelectionId('shop-raw');
            setFunnelOpen(false);
          }}
          onMealPlan={() => {
            sessionStorage.setItem('foeguard_selection', 'meal-plan');
            setSelectionId('meal-plan');
            setFunnelOpen(false);
            navigate('/meal-plan');
          }}
          onCalculator={() => {
            // Calculator opens as modal over /menu — underlying selection stays Raw Food Menu
            sessionStorage.setItem('foeguard_selection', 'shop-raw');
            setSelectionId('shop-raw');
            setFunnelOpen(false);
            setCalcOpen(true);
          }}
        />

        {/* Category Tabs: Raw Dog Food | Raw Dog Treats | Raw Cat Food | Raw Cat Treats — text only, no pill */}
        <div className="menu-category-text" data-testid="menu-category-tabs">
          {bannerCards.map((card) => (
            <button
              key={card.id}
              onClick={() => handleCategoryClick(card)}
              data-testid={`category-${card.id}`}
              className={`menu-category-text-btn ${card.active ? 'is-active' : ''}`}
            >
              {card.title}
            </button>
          ))}
        </div>

        {/* Main Content - Dog or Cat */}
        <>
          {showBoxSize && (
          <>
          {/* Box size — label + clean equal-style buttons with size + from-price */}
          <div className="bb-box-size-wrap bb-box-size-wrap--stacked" data-testid="box-size-wrap">
            <span className="bb-box-size-label">Select Box Size:</span>
            <div className="box-size-slider box-size-slider--mustard box-size-slider--clean" data-testid="box-size-selector">
              {BOX_OPTIONS.map(box => {
                const fromPerLb = getCheapestChickenPerLbForBox(box.size);
                return (
                  <button
                    key={box.size}
                    onClick={() => handleBoxSizeChange(box.size)}
                    data-testid={`box-size-${box.size}lb`}
                    className={`box-size-chip ${boxSize === box.size ? 'is-active' : ''}`}
                  >
                    <span className="box-size-chip-size">{box.label}</span>
                    {fromPerLb != null && (
                      <span className="box-size-chip-from">from ${fromPerLb.toFixed(2)}/lb</span>
                    )}
                  </button>
                );
              })}
            </div>
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
                hideHeader={false}
                showCategoryDescriptions={true}
              />
            ) : petType === 'dog' ? (
              <>
                {/* Comfort Dinner Collection - DOG */}
                <div className="product-collection menu-collection">
                  <div className="menu-collection-header menu-collection-header--banner" data-testid="collection-header-comfort">
                    <div
                      className="menu-collection-banner menu-collection-banner--overlay"
                      style={{ backgroundImage: `url(${COLLECTION_IMAGES.comfort_dinner})` }}
                    >
                      <div className="menu-collection-banner-text">
                        <h3 className="menu-collection-title">Comfort Dinner</h3>
                        <p className="menu-collection-desc">Complete raw nutrition for dogs of all-life stages.</p>
                      </div>
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
                        onOpenProduct={(pid) => setActiveProductId(pid)}
                      />
                    ))}
                  </div>
                </div>

                {/* Primal Feast Collection - DOG */}
                <div className="product-collection menu-collection">
                  <div className="menu-collection-header menu-collection-header--banner" data-testid="collection-header-primal">
                    <div
                      className="menu-collection-banner menu-collection-banner--overlay"
                      style={{ backgroundImage: `url(${COLLECTION_IMAGES.primal_feast})` }}
                    >
                      <div className="menu-collection-banner-text">
                        <h3 className="menu-collection-title">Primal Feast</h3>
                        <p className="menu-collection-desc">Whole prey raw meals made with 80% meat, 10% bone and 10% organ.</p>
                      </div>
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
                        onOpenProduct={(pid) => setActiveProductId(pid)}
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
                  <div className="menu-collection-header menu-collection-header--banner" data-testid="collection-header-royal">
                    <div
                      className="menu-collection-banner menu-collection-banner--overlay"
                      style={{ backgroundImage: `url(${COLLECTION_IMAGES.royal_paws})` }}
                    >
                      <div className="menu-collection-banner-text">
                        <h3 className="menu-collection-title">Royal Paws Dinner</h3>
                        <p className="menu-collection-desc">Complete raw nutrition for cats of all life stages.</p>
                      </div>
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
                        onOpenProduct={(pid) => setActiveProductId(pid)}
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

      {/* Floating bottom checkout — centered, large, sticky on scroll */}
      <button
        onClick={() => setCartOpen(true)}
        data-testid="cart-button"
        className="bb-floating-checkout"
      >
        Checkout →
      </button>

      {/* Inline Product Modal — replaces /product/:id navigation */}
      {activeProductId && (
        <ProductDetailModal
          productId={activeProductId}
          onClose={() => setActiveProductId(null)}
        />
      )}

      {/* Inline Calculator Modal */}
      {calcOpen && (
        <div className="bb-overlay" data-testid="calculator-overlay">
          <div className="bb-overlay-panel" role="dialog" aria-modal="true">
            <button
              className="bb-overlay-close"
              onClick={() => setCalcOpen(false)}
              data-testid="calc-overlay-close"
              aria-label="Close"
            >
              <X size={22} />
            </button>
            <FeedingCalculator
              embedded
              onComplete={() => setCalcOpen(false)}
            />
          </div>
        </div>
      )}

      <Footer />
    </>
  );
};

// Product Card Component
const ProductCard = ({ product, selectedQty, onUpdate, canAdd, getDiscountedPrice, getBasePrice, boxSize, navigate, petType, onOpenProduct }) => {
  const basePrice = getBasePrice(product);
  const discountedPrice = getDiscountedPrice(basePrice);
  const hasDiscount = boxSize > 6;
  // Per-lb prices (pricing stored as 6lb base price)
  const basePerLb = basePrice / 6;
  const discountedPerLb = discountedPrice / 6;
  
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
    if (onOpenProduct) {
      onOpenProduct(product.product_id);
      return;
    }
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
    >
      {/* Stacked content */}
      <div className="product-card-content">
        <h4 className="product-card-title">{product.name}</h4>
        <p className="product-card-desc">
          {product.mini_description || product.description.split('.')[0]}
        </p>
        <div className="product-card-meta">
          <div className="product-card-price">
            {hasDiscount ? (
              <>
                <span className="price-original">${basePerLb.toFixed(2)}</span>
                <span className="price-discounted">${discountedPerLb.toFixed(2)}</span>
              </>
            ) : (
              <span className="price-regular">${basePerLb.toFixed(2)}</span>
            )}
            <span className="price-unit">/ 1lb</span>
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

      {/* Image — on RIGHT side (desktop), on TOP (mobile via CSS order) */}
      <div className="product-card-media">
        <img src={productImage} alt={product.name} />
        {/* + or qty pill — overlays bottom-right of image */}
        {selectedQty === 0 ? (
          <button
            className="product-card-plus"
            onClick={stopAndAdd}
            disabled={!canAdd}
            data-testid={`add-${product.product_id}`}
            aria-label="Add to box"
          >
            +
          </button>
        ) : (
          <div className="product-card-qty-pill" onClick={(e) => e.stopPropagation()}>
            <button
              className="qty-btn-mini"
              onClick={stopAndDecrease}
              data-testid={`decrease-${product.product_id}`}
              aria-label="Decrease"
            >
              −
            </button>
            <span className="qty-display-mini" data-testid={`qty-${product.product_id}`}>
              {selectedQty}lb
            </span>
            <button
              className="qty-btn-mini"
              onClick={stopAndIncrease}
              disabled={!canAdd}
              data-testid={`increase-${product.product_id}`}
              aria-label="Increase"
            >
              +
            </button>
          </div>
        )}
      </div>
    </div>
  );
};


// ===== Menu Funnel Overlay — hovers above /menu on first landing =====
const MenuFunnel = ({ open, onShopRaw, onMealPlan, onCalculator, onClose, dismissable = true, selectedId = null }) => {
  const options = [
    {
      id: 'shop-raw',
      label: 'Raw Food Menu',
      sub: 'Browse every meal & treat. Build your own box.',
      image: 'https://customer-assets.emergentagent.com/job_c26be434-5664-4617-995c-8c836934bef5/artifacts/a5bhlhqi_5.png',
      onClick: onShopRaw
    },
    {
      id: 'meal-plan',
      label: 'Build a Meal Plan',
      sub: 'Personalized plan based on your dog\u2019s profile.',
      image: 'https://customer-assets.emergentagent.com/job_c26be434-5664-4617-995c-8c836934bef5/artifacts/wtts10dz_4.png',
      onClick: onMealPlan
    },
    {
      id: 'calculator',
      label: 'Feeding Calculator',
      sub: 'Get a portion recommendation in seconds.',
      image: 'https://customer-assets.emergentagent.com/job_c26be434-5664-4617-995c-8c836934bef5/artifacts/u0taocl0_6.png',
      onClick: onCalculator
    }
  ];

  if (!open) return null;

  return (
    <div className="menu-funnel-overlay" data-testid="menu-funnel-overlay">
      <div className="menu-funnel-overlay-inner">
        {dismissable && (
          <button
            className="menu-funnel-overlay-close"
            onClick={onClose}
            aria-label="Close"
            data-testid="menu-funnel-close"
          >
            <X size={22} />
          </button>
        )}
        <h1 className="menu-funnel-title">How would you like to order?</h1>
        <p className="menu-funnel-sub">
          Choose the path that works best for you and your pet — browse the full menu, build a custom meal plan, or get a fast portion recommendation.
        </p>
        <div className="menu-funnel-grid">
          {options.map(opt => (
            <button
              key={opt.id}
              className={`menu-funnel-card ${selectedId === opt.id ? 'is-selected' : ''}`}
              onClick={opt.onClick}
              data-testid={`funnel-${opt.id}`}
              style={{ backgroundImage: `url(${opt.image})` }}
            >
              <div className="menu-funnel-card-overlay" />
              <div className="menu-funnel-card-text">
                <h3 className="menu-funnel-card-title">{opt.label}</h3>
                <p className="menu-funnel-card-sub">{opt.sub}</p>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

// ===== Selection breadcrumb — sticky pill under navbar showing current choice + Edit =====
export const SelectionBreadcrumb = ({ label, onEdit }) => {
  return (
    <div className="selection-breadcrumb" data-testid="selection-breadcrumb">
      <div className="selection-breadcrumb-inner">
        <span className="selection-breadcrumb-label">
          <span className="selection-breadcrumb-prefix">Selection:</span>
          <span className="selection-breadcrumb-title">{label}</span>
        </span>
        <button
          className="selection-breadcrumb-edit"
          onClick={onEdit}
          data-testid="selection-breadcrumb-edit"
        >
          Edit
        </button>
      </div>
    </div>
  );
};
