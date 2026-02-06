import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Navbar, Footer } from '../components/Layout';
import { CartDrawer, TreatsSection, CheckoutForm, OrderSuccess } from '../components/CartAndCheckout';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

// Discount rates by box size
const DISCOUNT_RATES = {
  12: 0,
  18: 0.05,
  24: 0.10,
  30: 0.15
};

// Box size options with base prices (before discount)
const BOX_OPTIONS = [
  { size: 12, label: '12 lb', discount: 0 },
  { size: 18, label: '18 lb', discount: 5 },
  { size: 24, label: '24 lb', discount: 10 },
  { size: 30, label: '30 lb', discount: 15 }
];

// Collection banner images
const COLLECTION_IMAGES = {
  dog: 'https://customer-assets.emergentagent.com/job_c26be434-5664-4617-995c-8c836934bef5/artifacts/1olxgtz6_3.png',
  cat: 'https://customer-assets.emergentagent.com/job_c26be434-5664-4617-995c-8c836934bef5/artifacts/7fyd6l6l_4.png',
  comfort_dinner: 'https://customer-assets.emergentagent.com/job_c26be434-5664-4617-995c-8c836934bef5/artifacts/a5bhlhqi_5.png',
  primal_feast: 'https://customer-assets.emergentagent.com/job_c26be434-5664-4617-995c-8c836934bef5/artifacts/wtts10dz_4.png'
};

export const BoxBuilder = () => {
  const navigate = useNavigate();
  const [petType, setPetType] = useState('dog'); // 'dog' or 'cat'
  const [boxSize, setBoxSize] = useState(18); // Default to 18lb
  const [products, setProducts] = useState([]);
  const [selectedProteins, setSelectedProteins] = useState({});
  const [selectedTreats, setSelectedTreats] = useState([]);
  const [orderComplete, setOrderComplete] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [showCheckout, setShowCheckout] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const { data } = await axios.get(`${API}/products`);
        setProducts(data);
      } catch (error) {
        console.error('Failed to load data:', error);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

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

  return (
    <>
      <Navbar />
      <div className="box-builder">
        {/* Header with cart button */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
          <div>
            <h1 style={{ fontSize: '36px', marginBottom: '8px', color: '#2C2C2C' }}>Build Your Box</h1>
            <p style={{ color: '#666' }}>Select your box size, then choose your proteins</p>
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
          <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '16px', color: '#8B4513' }}>
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
        ) : (
          <>
            {/* Comfort Dinner Collection */}
            <div className="product-collection">
              <div className="collection-header">
                <div className="collection-icon">🍽️</div>
                <div className="collection-info">
                  <h3 className="collection-title">Comfort Dinner</h3>
                  <p className="collection-description">
                    Gently prepared meals perfect for sensitive stomachs. Complete, balanced nutrition.
                  </p>
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
                  />
                ))}
              </div>
            </div>

            {/* Primal Feast Collection */}
            <div className="product-collection">
              <div className="collection-header">
                <div className="collection-icon">🥩</div>
                <div className="collection-info">
                  <h3 className="collection-title">Primal Feast</h3>
                  <p className="collection-description">
                    Raw, biologically appropriate meals. Maximum nutrient retention.
                  </p>
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
                  />
                ))}
              </div>
            </div>

            {/* Treats Section */}
            <TreatsSection 
              selectedTreats={selectedTreats}
              onToggleTreat={handleToggleTreat}
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
      </div>
      <Footer />
    </>
  );
};

// Product Card Component
const ProductCard = ({ product, selectedQty, onUpdate, canAdd, getDiscountedPrice, getBasePrice, boxSize, navigate }) => {
  const basePrice = getBasePrice(product);
  const discountedPrice = getDiscountedPrice(basePrice);
  const hasDiscount = boxSize > 12;
  
  return (
    <div className="product-card" data-testid={`product-${product.product_id}`}>
      <h4 style={{ fontSize: '20px', margin: '8px 0', textTransform: 'capitalize' }}>
        {product.protein_type}
      </h4>
      <p style={{ fontSize: '13px', color: '#666', lineHeight: '1.4', marginBottom: '16px' }}>
        {product.description.split('.')[0]}
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
        onClick={() => navigate(`/product/${product.product_id}`)}
        data-testid={`learn-more-${product.product_id}`}
      >
        Learn More
      </button>
    </div>
  );
};
