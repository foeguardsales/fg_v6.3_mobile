import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useNavigate, useSearchParams, useLocation } from 'react-router-dom';
import { Navbar, Footer } from '../components/Layout';
import { CartDrawer, TreatsSection, CheckoutForm, OrderSuccess, CatTreatsSection } from '../components/CartAndCheckout';
import { Calculator, ClipboardList, ChevronLeft, ChevronRight } from 'lucide-react';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

// Discount rates by box size - DOG
const DOG_DISCOUNT_RATES = {
  12: 0,
  18: 0.05,
  24: 0.10,
  30: 0.15
};

// Discount rates by box size - CAT
const CAT_DISCOUNT_RATES = {
  6: 0,
  12: 0.05
};

// Box size options - DOG
const DOG_BOX_OPTIONS = [
  { size: 12, label: '12 lb', discount: 0 },
  { size: 18, label: '18 lb', discount: 5 },
  { size: 24, label: '24 lb', discount: 10 },
  { size: 30, label: '30 lb', discount: 15 }
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
  
  // Load from sessionStorage on mount
  const initialBoxSize = parseInt(sessionStorage.getItem('boxSize')) || 18;
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
  const carouselRef = useRef(null);

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
    setBoxSize(newPetType === 'cat' ? 6 : 18);
  };

  const scrollCarousel = (direction) => {
    const container = carouselRef.current;
    if (!container) return;
    
    const cardWidth = container.offsetWidth * 0.7;
    const scrollAmount = direction === 'left' ? -cardWidth : cardWidth;
    
    container.scrollBy({
      left: scrollAmount,
      behavior: 'smooth'
    });
  };

  const bannerCards = [
    {
      id: 'meal-plan',
      title: 'Create Meal Plan',
      icon: <ClipboardList size={48} />,
      gradient: 'linear-gradient(135deg, #D9C8B3 0%, #B8A89A 100%)',
      onClick: () => navigate('/build-box')
    },
    {
      id: 'dog',
      title: 'Raw Dog Food',
      image: COLLECTION_IMAGES.dog,
      selected: petType === 'dog',
      onClick: () => handlePetTypeChange('dog')
    },
    {
      id: 'cat',
      title: 'Raw Cat Food',
      image: COLLECTION_IMAGES.cat,
      selected: petType === 'cat',
      onClick: () => handlePetTypeChange('cat')
    },
    {
      id: 'calculator',
      title: 'Feeding Calculator',
      icon: <Calculator size={48} />,
      gradient: 'linear-gradient(135deg, #8B4513 0%, #A0522D 100%)',
      onClick: () => navigate('/calculator')
    }
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
        {/* Banner Carousel Selector */}
        <div style={{ marginBottom: '50px', position: 'relative' }}>
          {/* Navigation Arrows */}
          <button
            onClick={() => scrollCarousel('left')}
            style={{
              position: 'absolute',
              left: '10px',
              top: '50%',
              transform: 'translateY(-50%)',
              zIndex: 10,
              background: 'rgba(255,255,255,0.95)',
              border: '2px solid #E8DDD0',
              borderRadius: '50%',
              width: '48px',
              height: '48px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
              transition: 'all 0.2s'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'white';
              e.currentTarget.style.transform = 'translateY(-50%) scale(1.1)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'rgba(255,255,255,0.95)';
              e.currentTarget.style.transform = 'translateY(-50%) scale(1)';
            }}
          >
            <ChevronLeft size={24} style={{ color: '#8B4513' }} />
          </button>

          <button
            onClick={() => scrollCarousel('right')}
            style={{
              position: 'absolute',
              right: '10px',
              top: '50%',
              transform: 'translateY(-50%)',
              zIndex: 10,
              background: 'rgba(255,255,255,0.95)',
              border: '2px solid #E8DDD0',
              borderRadius: '50%',
              width: '48px',
              height: '48px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
              transition: 'all 0.2s'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'white';
              e.currentTarget.style.transform = 'translateY(-50%) scale(1.1)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'rgba(255,255,255,0.95)';
              e.currentTarget.style.transform = 'translateY(-50%) scale(1)';
            }}
          >
            <ChevronRight size={24} style={{ color: '#8B4513' }} />
          </button>

          {/* Carousel Container */}
          <div
            ref={carouselRef}
            style={{
              display: 'flex',
              gap: '20px',
              overflowX: 'auto',
              scrollBehavior: 'smooth',
              scrollbarWidth: 'none',
              msOverflowStyle: 'none',
              padding: '10px 20px',
              WebkitOverflowScrolling: 'touch'
            }}
            className="banner-carousel"
          >
            {bannerCards.map((card) => (
              <div
                key={card.id}
                onClick={card.onClick}
                style={{
                  position: 'relative',
                  minWidth: '45%',
                  maxWidth: '45%',
                  height: '280px',
                  borderRadius: '20px',
                  overflow: 'hidden',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  flexShrink: 0,
                  border: card.selected ? '4px solid #A41E34' : '4px solid transparent',
                  boxShadow: '0 8px 24px rgba(0,0,0,0.12)'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-8px)';
                  e.currentTarget.style.boxShadow = '0 12px 32px rgba(0,0,0,0.18)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.12)';
                }}
              >
                {/* Background - Image or Gradient */}
                {card.image ? (
                  <img 
                    src={card.image} 
                    alt={card.title}
                    style={{ 
                      width: '100%', 
                      height: '100%', 
                      objectFit: 'cover',
                      position: 'absolute',
                      inset: 0
                    }}
                  />
                ) : (
                  <div style={{
                    position: 'absolute',
                    inset: 0,
                    background: card.gradient
                  }} />
                )}

                {/* Overlay */}
                <div style={{
                  position: 'absolute',
                  inset: 0,
                  background: card.image 
                    ? 'linear-gradient(to top, rgba(0,0,0,0.75) 0%, rgba(0,0,0,0.3) 50%, rgba(0,0,0,0.1) 100%)'
                    : 'linear-gradient(135deg, rgba(0,0,0,0.4) 0%, rgba(0,0,0,0.2) 100%)',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: '40px',
                  gap: '16px'
                }}>
                  {card.icon && (
                    <div style={{ color: '#FDFCFA' }}>
                      {card.icon}
                    </div>
                  )}
                  <span style={{
                    fontFamily: "'Rubik', sans-serif",
                    fontSize: '32px',
                    fontWeight: '800',
                    color: '#FDFCFA',
                    textShadow: '0 3px 12px rgba(0,0,0,0.4)',
                    textAlign: 'center',
                    letterSpacing: '0.02em',
                    lineHeight: '1.2'
                  }}>
                    {card.title}
                  </span>
                </div>

                {/* Selected Indicator */}
                {card.selected && (
                  <div style={{
                    position: 'absolute',
                    top: '20px',
                    right: '20px',
                    background: '#A41E34',
                    color: '#FFFFFF',
                    width: '48px',
                    height: '48px',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '24px',
                    fontWeight: '700',
                    boxShadow: '0 4px 12px rgba(164, 30, 52, 0.4)'
                  }}>
                    ✓
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Main Content - Dog or Cat */}
        <>
          {/* Header with cart button */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
            <div>
              <h1 style={{ fontFamily: "'Rubik', sans-serif", fontSize: '32px', fontWeight: '800', marginBottom: '8px', color: '#2B2B2B', textTransform: 'none' }}>
                {petType === 'cat' ? 'Build your cat box' : 'Build your box'}
              </h1>
              <p style={{ fontFamily: "'Rubik', sans-serif", fontWeight: '400', color: '#666' }}>
                {petType === 'cat' 
                  ? 'Select your box size, then choose your cat proteins' 
                  : 'Select your box size, then choose your proteins'}
              </p>
            </div>
            <button 
              className="btn-cart-floating"
              onClick={() => setCartOpen(true)}
              data-testid="cart-button"
            >
              Checkout {getTotalSelectedLbs()}/{boxSize}lb
              {isBoxComplete && (
                <span className="cart-complete-badge">✓</span>
              )}
              <span style={{ marginLeft: '8px', fontSize: '18px' }}>→</span>
            </button>
          </div>

          {/* Box Size Selector - Inline */}
          <div className="box-size-selector-inline" data-testid="box-size-selector">
            <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '16px', color: '#A41E34' }}>
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

            {loading ? (
              <div style={{ padding: '60px', textAlign: 'center' }}>Loading products...</div>
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
                        fontFamily: "'Rubik', sans-serif",
                        fontSize: '36px',
                        fontWeight: '800',
                        color: '#FFFFFF',
                        margin: '0 0 12px 0',
                        textTransform: 'uppercase',
                        letterSpacing: '0.05em'
                      }}>Comfort Dinner</h3>
                      <p style={{
                        fontFamily: "'Rubik', sans-serif",
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
                        fontFamily: "'Rubik', sans-serif",
                        fontSize: '36px',
                        fontWeight: '800',
                        color: '#FFFFFF',
                        margin: '0 0 12px 0',
                        textTransform: 'uppercase',
                        letterSpacing: '0.05em'
                      }}>Primal Feast</h3>
                      <p style={{
                        fontFamily: "'Rubik', sans-serif",
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
                        fontFamily: "'Rubik', sans-serif",
                        fontSize: '36px',
                        fontWeight: '800',
                        color: '#FFFFFF',
                        margin: '0 0 12px 0',
                        textTransform: 'uppercase',
                        letterSpacing: '0.05em'
                      }}>Royal Paws Dinner</h3>
                      <p style={{
                        fontFamily: "'Rubik', sans-serif",
                        fontWeight: '400',
                        color: 'rgba(255,255,255,0.95)',
                        fontSize: '15px',
                        margin: '0 0 16px 0',
                        maxWidth: '600px',
                        lineHeight: '1.6'
                      }}>Complete and balanced raw meals crafted for your cat's carnivorous biology using 95% meat, organs & bone, 3% fruits & vegetables, 2% supplements.</p>
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
  const hasDiscount = boxSize > 12;
  
  // Get collection color based on product line
  const getCollectionColor = () => {
    switch(product.product_line) {
      case 'comfort_dinner': return '#5F7C5A';
      case 'primal_feast': return '#732827';
      case 'royal_paws': return '#5e4b73';
      default: return '#88302F';
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
    <div className="product-card" data-testid={`product-${product.product_id}`}>
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
