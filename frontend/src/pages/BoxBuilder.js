import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Navbar, Footer } from '../components/Layout';
import { CartDrawer, TreatsSection, CheckoutForm, OrderSuccess, CatTreatsSection } from '../components/CartAndCheckout';

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
  const [petType, setPetType] = useState('dog'); // 'dog' or 'cat'
  const [boxSize, setBoxSize] = useState(18); // Default to 18lb for dog
  const [products, setProducts] = useState([]);
  const [treats, setTreats] = useState([]);
  const [selectedProteins, setSelectedProteins] = useState({});
  const [selectedTreats, setSelectedTreats] = useState([]);
  const [orderComplete, setOrderComplete] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [showCheckout, setShowCheckout] = useState(false);
  const [loading, setLoading] = useState(true);

  // Get current discount rates and box options based on pet type
  const DISCOUNT_RATES = petType === 'cat' ? CAT_DISCOUNT_RATES : DOG_DISCOUNT_RATES;
  const BOX_OPTIONS = petType === 'cat' ? CAT_BOX_OPTIONS : DOG_BOX_OPTIONS;

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

  // Reset selections when pet type changes
  const handlePetTypeChange = (newPetType) => {
    setPetType(newPetType);
    setSelectedProteins({});
    setSelectedTreats([]);
    // Set default box size for new pet type
    setBoxSize(newPetType === 'cat' ? 6 : 18);
  };

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
  };

  const handleUpdateProtein = (productId, productName, quantity) => {
    setSelectedProteins(prev => ({ 
      ...prev, 
      [productId]: { qty: quantity, name: productName }
    }));
  };

  const handleToggleTreat = (treat) => {
    setSelectedTreats(prev => 
      prev.some(t => t.treat_id === treat.treat_id)
        ? prev.filter(t => t.treat_id !== treat.treat_id)
        : [...prev, treat]
    );
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
            onClick={() => setShowCheckout(false)}
            style={{ marginBottom: '20px', width: 'auto', padding: '12px 24px' }}
          >
            ← Back to Menu
          </button>
          <CheckoutForm 
            boxSize={boxSize}
            selectedProteins={selectedProteins}
            selectedTreats={selectedTreats}
            products={products}
            onSuccess={() => setOrderComplete(true)}
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
        {/* Pet Type Selector - Dog vs Cat */}
        <div className="pet-selector" style={{ marginBottom: '40px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', maxWidth: '900px', margin: '0 auto' }}>
            <button 
              className={`pet-selector-btn ${petType === 'dog' ? 'active' : ''}`}
              onClick={() => handlePetTypeChange('dog')}
              data-testid="pet-selector-dog"
              style={{
                position: 'relative',
                height: '280px',
                borderRadius: '20px',
                overflow: 'hidden',
                border: petType === 'dog' ? '4px solid #A41E34' : '4px solid transparent',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                padding: 0,
                background: 'none'
              }}
            >
              <img 
                src={COLLECTION_IMAGES.dog} 
                alt="Raw Dog Food"
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
              <div style={{
                position: 'absolute',
                inset: 0,
                background: 'linear-gradient(to top, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.2) 50%, rgba(0,0,0,0) 100%)',
                display: 'flex',
                alignItems: 'flex-end',
                justifyContent: 'center',
                padding: '30px'
              }}>
                <span style={{
                  fontFamily: 'Crimson Pro, Georgia, serif',
                  fontSize: '32px',
                  fontWeight: '700',
                  color: '#FFFFFF',
                  textShadow: '0 2px 8px rgba(0,0,0,0.3)'
                }}>Raw Dog Food</span>
              </div>
              {petType === 'dog' && (
                <div style={{
                  position: 'absolute',
                  top: '16px',
                  right: '16px',
                  background: '#A41E34',
                  color: '#FFFFFF',
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '18px',
                  fontWeight: '700'
                }}>✓</div>
              )}
            </button>

            <button 
              className={`pet-selector-btn ${petType === 'cat' ? 'active' : ''}`}
              onClick={() => handlePetTypeChange('cat')}
              data-testid="pet-selector-cat"
              style={{
                position: 'relative',
                height: '280px',
                borderRadius: '20px',
                overflow: 'hidden',
                border: petType === 'cat' ? '4px solid #A41E34' : '4px solid transparent',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                padding: 0,
                background: 'none'
              }}
            >
              <img 
                src={COLLECTION_IMAGES.cat} 
                alt="Raw Cat Food"
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
              <div style={{
                position: 'absolute',
                inset: 0,
                background: 'linear-gradient(to top, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.2) 50%, rgba(0,0,0,0) 100%)',
                display: 'flex',
                alignItems: 'flex-end',
                justifyContent: 'center',
                padding: '30px'
              }}>
                <span style={{
                  fontFamily: 'Crimson Pro, Georgia, serif',
                  fontSize: '32px',
                  fontWeight: '700',
                  color: '#FFFFFF',
                  textShadow: '0 2px 8px rgba(0,0,0,0.3)'
                }}>Raw Cat Food</span>
              </div>
              {petType === 'cat' && (
                <div style={{
                  position: 'absolute',
                  top: '16px',
                  right: '16px',
                  background: '#A41E34',
                  color: '#FFFFFF',
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '18px',
                  fontWeight: '700'
                }}>✓</div>
              )}
            </button>
          </div>
        </div>

        {/* Main Content - Dog or Cat */}
        <>
          {/* Header with cart button */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
            <div>
              <h1 style={{ fontFamily: 'Crimson Pro, Georgia, serif', fontSize: '36px', marginBottom: '8px', color: '#2B2B2B' }}>
                {petType === 'cat' ? 'Build Your Cat Box' : 'Build Your Box'}
              </h1>
              <p style={{ color: '#666' }}>
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
              🛒 {getTotalSelectedLbs()}/{boxSize}lb
              {isBoxComplete && (
                <span className="cart-complete-badge">✓</span>
              )}
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
            <span className="box-progress-text">
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
                      <span style={{
                        display: 'inline-block',
                        background: '#5F7C5A',
                        color: '#fff',
                        fontSize: '11px',
                        fontWeight: '600',
                        padding: '4px 12px',
                        borderRadius: '20px',
                        marginBottom: '12px',
                        width: 'fit-content',
                        textTransform: 'uppercase',
                        letterSpacing: '0.5px'
                      }}>Complete & Balanced</span>
                      <h3 style={{
                        fontFamily: 'Fraunces, Georgia, serif',
                        fontSize: '36px',
                        fontWeight: '600',
                        color: '#FFFFFF',
                        margin: '0 0 12px 0'
                      }}>Comfort Dinner</h3>
                      <p style={{
                        color: 'rgba(255,255,255,0.95)',
                        fontSize: '15px',
                        margin: '0 0 16px 0',
                        maxWidth: '420px',
                        lineHeight: '1.6'
                      }}>Complete and balanced raw dinners made from ethically raised, human-grade meat.</p>
                      <p style={{
                        color: 'rgba(255,255,255,0.85)',
                        fontSize: '13px',
                        margin: '0 0 8px 0',
                        maxWidth: '420px',
                        lineHeight: '1.5'
                      }}><strong>Recipe:</strong> 70% meat, 10% bone, 10% organ, 8% fruits & vegetables, 2% supplements</p>
                      <p style={{
                        color: 'rgba(255,255,255,0.85)',
                        fontSize: '13px',
                        margin: 0,
                        maxWidth: '420px',
                        lineHeight: '1.5'
                      }}><strong>For:</strong> Daily feeding for dogs of all life stages. Ready to serve, no additions required.</p>
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
                      <span style={{
                        display: 'inline-block',
                        background: '#732827',
                        color: '#fff',
                        fontSize: '11px',
                        fontWeight: '600',
                        padding: '4px 12px',
                        borderRadius: '20px',
                        marginBottom: '12px',
                        width: 'fit-content',
                        textTransform: 'uppercase',
                        letterSpacing: '0.5px'
                      }}>80/10/10 Base</span>
                      <h3 style={{
                        fontFamily: 'Fraunces, Georgia, serif',
                        fontSize: '36px',
                        fontWeight: '600',
                        color: '#FFFFFF',
                        margin: '0 0 12px 0'
                      }}>Primal Feast</h3>
                      <p style={{
                        color: 'rgba(255,255,255,0.95)',
                        fontSize: '15px',
                        margin: '0 0 16px 0',
                        maxWidth: '420px',
                        lineHeight: '1.6'
                      }}>Farm-fresh whole prey raw food designed for customizable feeding.</p>
                      <p style={{
                        color: 'rgba(255,255,255,0.85)',
                        fontSize: '13px',
                        margin: '0 0 8px 0',
                        maxWidth: '420px',
                        lineHeight: '1.5'
                      }}><strong>Recipe:</strong> 80% meat, 10% bone, 10% organ (Prey Model Raw ratio)</p>
                      <p style={{
                        color: 'rgba(255,255,255,0.85)',
                        fontSize: '13px',
                        margin: 0,
                        maxWidth: '420px',
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
                      <span style={{
                        display: 'inline-block',
                        background: '#5e4b73',
                        color: '#fff',
                        fontSize: '11px',
                        fontWeight: '600',
                        padding: '4px 12px',
                        borderRadius: '20px',
                        marginBottom: '12px',
                        width: 'fit-content',
                        textTransform: 'uppercase',
                        letterSpacing: '0.5px'
                      }}>Complete & Balanced</span>
                      <h3 style={{
                        fontFamily: 'Fraunces, Georgia, serif',
                        fontSize: '36px',
                        fontWeight: '600',
                        color: '#FFFFFF',
                        margin: '0 0 12px 0'
                      }}>Royal Paws Dinner</h3>
                      <p style={{
                        color: 'rgba(255,255,255,0.95)',
                        fontSize: '15px',
                        margin: '0 0 16px 0',
                        maxWidth: '420px',
                        lineHeight: '1.6'
                      }}>Complete and balanced raw meals crafted for your cat's carnivorous biology.</p>
                      <p style={{
                        color: 'rgba(255,255,255,0.85)',
                        fontSize: '13px',
                        margin: '0 0 8px 0',
                        maxWidth: '420px',
                        lineHeight: '1.5'
                      }}><strong>Recipe:</strong> 95% meat, organs & bone, 3% fruits & vegetables, 2% supplements</p>
                      <p style={{
                        color: 'rgba(255,255,255,0.85)',
                        fontSize: '13px',
                        margin: 0,
                        maxWidth: '420px',
                        lineHeight: '1.5'
                      }}><strong>For:</strong> Daily feeding for cats of all life stages. Supports lean muscle, digestion & coat health.</p>
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
              onProceed={() => { setCartOpen(false); setShowCheckout(true); }}
              getDiscountedPrice={getDiscountedPrice}
              getBasePrice={getBasePrice}
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
        fontSize: '20px', 
        margin: '0 0 8px 0', 
        textTransform: 'capitalize',
        color: isSelected ? '#FDFCFA' : '#2B2B2B',
        transition: 'color 0.3s ease'
      }}>
        {product.protein_type}
      </h4>
      <p style={{ 
        fontSize: '13px', 
        color: isSelected ? 'rgba(253, 252, 250, 0.9)' : '#666', 
        lineHeight: '1.4', 
        marginBottom: '16px',
        transition: 'color 0.3s ease'
      }}>
        {product.mini_description || product.description.split('.')[0]}
      </p>
      
      {/* Price Display */}
      <div className="product-price-display" style={{ 
        color: isSelected ? '#FDFCFA' : 'inherit',
        transition: 'color 0.3s ease'
      }}>
        {hasDiscount ? (
          <>
            <span className="price-original" style={{ color: isSelected ? 'rgba(253, 252, 250, 0.7)' : 'inherit' }}>${basePrice.toFixed(2)}</span>
            <span className="price-discounted" style={{ color: isSelected ? '#FDFCFA' : 'inherit' }}>${discountedPrice.toFixed(2)}</span>
          </>
        ) : (
          <span className="price-regular" style={{ color: isSelected ? '#FDFCFA' : 'inherit' }}>${basePrice.toFixed(2)}</span>
        )}
        <span className="price-unit" style={{ color: isSelected ? 'rgba(253, 252, 250, 0.8)' : 'inherit' }}>/ 6lb</span>
      </div>
      
      {/* Quantity Controls */}
      <div className="quantity-controls">
        <button 
          className="qty-btn"
          onClick={() => onUpdate(product.product_id, product.name, Math.max(0, selectedQty - 6))}
          disabled={selectedQty === 0}
          data-testid={`decrease-${product.product_id}`}
          style={{ color: isSelected ? '#FDFCFA' : 'inherit' }}
        >
          −
        </button>
        <div className="qty-display" data-testid={`qty-${product.product_id}`} style={{ 
          color: isSelected ? '#FDFCFA' : 'inherit',
          transition: 'color 0.3s ease'
        }}>
          {selectedQty}lb
        </div>
        <button 
          className="qty-btn"
          onClick={() => onUpdate(product.product_id, product.name, selectedQty + 6)}
          disabled={!canAdd}
          data-testid={`increase-${product.product_id}`}
          style={{ color: isSelected ? '#FDFCFA' : 'inherit' }}
        >
          +
        </button>
      </div>
      
      <button 
        className="btn-learn-more"
        style={{ color: isSelected ? '#FDFCFA' : 'inherit', transition: 'color 0.3s ease' }}
        onClick={() => navigate(`/product/${product.product_id}`)}
        data-testid={`learn-more-${product.product_id}`}
      >
        Learn More
      </button>
    </div>
  );
};
