import React, { useState, useEffect, createContext, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { Navbar, Footer } from '../components/Layout';
import { ChevronRight, Plus, Minus, X, Check, ShoppingBag, Calculator, ClipboardList } from 'lucide-react';
import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:8001';
const API = `${BACKEND_URL}/api`;

// Cart Context for global state
const CartContext = createContext();

export const useCart = () => useContext(CartContext);

// Discount tiers - stacks with subscription
const BULK_DISCOUNTS = {
  6: 0,      // 0% at 6lbs
  12: 0.05,  // 5% at 12lbs
  24: 0.10   // 10% at 24lbs+
};

const SUBSCRIPTION_DISCOUNT = 0.05; // 5% subscription discount

// Get bulk discount based on total weight
const getBulkDiscount = (totalLbs) => {
  if (totalLbs >= 24) return BULK_DISCOUNTS[24];
  if (totalLbs >= 12) return BULK_DISCOUNTS[12];
  return BULK_DISCOUNTS[6];
};

// Cart Provider Component
export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isSubscription, setIsSubscription] = useState(false);

  const totalLbs = cartItems.reduce((sum, item) => sum + item.lbs, 0);
  const bulkDiscount = getBulkDiscount(totalLbs);
  const totalDiscount = isSubscription ? bulkDiscount + SUBSCRIPTION_DISCOUNT : bulkDiscount;
  
  const subtotal = cartItems.reduce((sum, item) => sum + item.price, 0);
  const discountAmount = subtotal * totalDiscount;
  const total = subtotal - discountAmount;

  const addToCart = (item) => {
    setCartItems(prev => {
      // Check if same product + protein + size exists
      const existingIndex = prev.findIndex(
        i => i.productId === item.productId && i.protein === item.protein && i.lbs === item.lbs
      );
      if (existingIndex >= 0) {
        const updated = [...prev];
        updated[existingIndex].quantity += 1;
        updated[existingIndex].price = updated[existingIndex].unitPrice * updated[existingIndex].quantity;
        return updated;
      }
      return [...prev, { ...item, quantity: 1, unitPrice: item.price }];
    });
    setIsCartOpen(true);
  };

  const removeFromCart = (index) => {
    setCartItems(prev => prev.filter((_, i) => i !== index));
  };

  const updateQuantity = (index, delta) => {
    setCartItems(prev => {
      const updated = [...prev];
      updated[index].quantity += delta;
      if (updated[index].quantity <= 0) {
        return prev.filter((_, i) => i !== index);
      }
      updated[index].price = updated[index].unitPrice * updated[index].quantity;
      return updated;
    });
  };

  const clearCart = () => setCartItems([]);

  return (
    <CartContext.Provider value={{
      cartItems, totalLbs, bulkDiscount, totalDiscount, subtotal, discountAmount, total,
      isSubscription, setIsSubscription, isCartOpen, setIsCartOpen,
      addToCart, removeFromCart, updateQuantity, clearCart
    }}>
      {children}
    </CartContext.Provider>
  );
};

// Slide-in Cart Component
export const SlideCart = () => {
  const navigate = useNavigate();
  const {
    cartItems, totalLbs, bulkDiscount, totalDiscount, subtotal, discountAmount, total,
    isSubscription, setIsSubscription, isCartOpen, setIsCartOpen,
    removeFromCart, updateQuantity
  } = useCart();

  const lbsToNextTier = totalLbs < 12 ? 12 - totalLbs : totalLbs < 24 ? 24 - totalLbs : 0;
  const nextTierDiscount = totalLbs < 12 ? '5%' : totalLbs < 24 ? '10%' : null;

  if (!isCartOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div 
        onClick={() => setIsCartOpen(false)}
        style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0,0,0,0.4)',
          zIndex: 998
        }}
      />
      
      {/* Cart Panel */}
      <div style={{
        position: 'fixed',
        top: 0,
        right: 0,
        bottom: 0,
        width: '100%',
        maxWidth: '420px',
        background: 'white',
        zIndex: 999,
        display: 'flex',
        flexDirection: 'column',
        boxShadow: '-4px 0 20px rgba(0,0,0,0.15)'
      }}>
        {/* Header */}
        <div style={{
          padding: '20px 24px',
          borderBottom: '1px solid #E8E4DC',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <div>
            <h2 style={{ fontSize: '20px', fontWeight: '600', margin: 0 }}>Your Order</h2>
            <p style={{ fontSize: '14px', color: '#666', margin: '4px 0 0' }}>{totalLbs} lbs total</p>
          </div>
          <button
            onClick={() => setIsCartOpen(false)}
            style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '8px' }}
          >
            <X size={24} color="#666" />
          </button>
        </div>

        {/* Bulk Discount Progress */}
        {lbsToNextTier > 0 && (
          <div style={{
            padding: '16px 24px',
            background: '#FFF8E1',
            borderBottom: '1px solid #FFE082'
          }}>
            <p style={{ fontSize: '14px', color: '#F57C00', margin: 0, fontWeight: '500' }}>
              Add {lbsToNextTier} more lbs to save {nextTierDiscount} on your whole order!
            </p>
            <div style={{
              marginTop: '10px',
              height: '6px',
              background: '#FFE0B2',
              borderRadius: '3px',
              overflow: 'hidden'
            }}>
              <div style={{
                height: '100%',
                width: `${(totalLbs / (totalLbs < 12 ? 12 : 24)) * 100}%`,
                background: '#FF9800',
                borderRadius: '3px',
                transition: 'width 0.3s'
              }} />
            </div>
          </div>
        )}

        {/* Cart Items */}
        <div style={{ flex: 1, overflow: 'auto', padding: '16px 24px' }}>
          {cartItems.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px 0', color: '#666' }}>
              <ShoppingBag size={48} strokeWidth={1.5} style={{ marginBottom: '16px', opacity: 0.4 }} />
              <p>Your cart is empty</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {cartItems.map((item, index) => (
                <div key={index} style={{
                  display: 'flex',
                  gap: '12px',
                  padding: '12px',
                  background: '#F8F6F3',
                  borderRadius: '12px'
                }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: '600', fontSize: '15px', marginBottom: '4px' }}>
                      {item.name}
                    </div>
                    <div style={{ fontSize: '13px', color: '#666' }}>
                      {item.protein} • {item.lbs} lbs
                    </div>
                    <div style={{ fontSize: '14px', fontWeight: '600', color: '#8B4513', marginTop: '8px' }}>
                      ${item.price.toFixed(2)}
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <button
                      onClick={() => updateQuantity(index, -1)}
                      style={{
                        width: '28px', height: '28px', borderRadius: '6px',
                        border: '1px solid #E8E4DC', background: 'white',
                        cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center'
                      }}
                    >
                      <Minus size={14} />
                    </button>
                    <span style={{ minWidth: '20px', textAlign: 'center', fontWeight: '500' }}>
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => updateQuantity(index, 1)}
                      style={{
                        width: '28px', height: '28px', borderRadius: '6px',
                        border: '1px solid #E8E4DC', background: 'white',
                        cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center'
                      }}
                    >
                      <Plus size={14} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Subscribe Upsell */}
        {cartItems.length > 0 && (
          <div style={{
            padding: '16px 24px',
            borderTop: '1px solid #E8E4DC',
            background: isSubscription ? '#E8F5E9' : '#F8F6F3'
          }}>
            <label style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              cursor: 'pointer'
            }}>
              <input
                type="checkbox"
                checked={isSubscription}
                onChange={(e) => setIsSubscription(e.target.checked)}
                style={{ width: '20px', height: '20px', accentColor: '#5F7C5A' }}
              />
              <div>
                <div style={{ fontWeight: '600', fontSize: '14px', color: isSubscription ? '#2E7D32' : '#2B2B2B' }}>
                  Subscribe & Save 5%
                </div>
                <div style={{ fontSize: '12px', color: '#666' }}>
                  Never run out! Free delivery + pause anytime.
                </div>
              </div>
            </label>
          </div>
        )}

        {/* Totals */}
        {cartItems.length > 0 && (
          <div style={{ padding: '16px 24px', borderTop: '1px solid #E8E4DC' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
              <span style={{ color: '#666' }}>Subtotal</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>
            {totalDiscount > 0 && (
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', color: '#2E7D32' }}>
                <span>
                  Discount ({Math.round(totalDiscount * 100)}%{isSubscription && bulkDiscount > 0 ? ' stacked' : ''})
                </span>
                <span>-${discountAmount.toFixed(2)}</span>
              </div>
            )}
            <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: '700', fontSize: '18px', marginTop: '12px', paddingTop: '12px', borderTop: '1px solid #E8E4DC' }}>
              <span>Total</span>
              <span>${total.toFixed(2)}</span>
            </div>
          </div>
        )}

        {/* Checkout Button */}
        <div style={{ padding: '16px 24px', borderTop: '1px solid #E8E4DC' }}>
          <button
            onClick={() => {
              setIsCartOpen(false);
              navigate('/checkout');
            }}
            disabled={cartItems.length === 0}
            style={{
              width: '100%',
              padding: '16px',
              background: cartItems.length > 0 ? '#8B4513' : '#CCC',
              color: 'white',
              border: 'none',
              borderRadius: '10px',
              fontSize: '16px',
              fontWeight: '600',
              cursor: cartItems.length > 0 ? 'pointer' : 'not-allowed'
            }}
          >
            Checkout • ${total.toFixed(2)}
          </button>
          <button
            onClick={() => setIsCartOpen(false)}
            style={{
              width: '100%',
              marginTop: '10px',
              padding: '12px',
              background: 'none',
              color: '#8B4513',
              border: 'none',
              fontSize: '14px',
              fontWeight: '500',
              cursor: 'pointer'
            }}
          >
            + Add more items
          </button>
        </div>
      </div>
    </>
  );
};

// Sticky Order Progress Bar
const OrderProgressBar = () => {
  const { totalLbs, bulkDiscount, isCartOpen, setIsCartOpen, total } = useCart();
  
  const lbsToNextTier = totalLbs < 12 ? 12 - totalLbs : totalLbs < 24 ? 24 - totalLbs : 0;
  const nextTierDiscount = totalLbs < 12 ? '5%' : totalLbs < 24 ? '10%' : null;
  const progress = totalLbs >= 24 ? 100 : totalLbs < 12 ? (totalLbs / 12) * 100 : ((totalLbs - 12) / 12) * 100 + 50;

  if (totalLbs === 0) return null;

  return (
    <div style={{
      position: 'fixed',
      bottom: 0,
      left: 0,
      right: 0,
      background: 'white',
      borderTop: '1px solid #E8E4DC',
      padding: '12px 20px',
      zIndex: 100,
      boxShadow: '0 -2px 10px rgba(0,0,0,0.08)'
    }}>
      <div style={{ maxWidth: '600px', margin: '0 auto' }}>
        {/* Progress info */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
          <div>
            <span style={{ fontWeight: '600' }}>{totalLbs} lbs</span>
            {bulkDiscount > 0 && (
              <span style={{ color: '#2E7D32', fontWeight: '600', marginLeft: '8px' }}>
                {Math.round(bulkDiscount * 100)}% off!
              </span>
            )}
          </div>
          {lbsToNextTier > 0 && (
            <span style={{ fontSize: '13px', color: '#F57C00' }}>
              +{lbsToNextTier} lbs for {nextTierDiscount} off
            </span>
          )}
        </div>
        
        {/* Progress bar */}
        <div style={{
          height: '6px',
          background: '#E8E4DC',
          borderRadius: '3px',
          marginBottom: '12px',
          position: 'relative'
        }}>
          <div style={{
            height: '100%',
            width: `${Math.min(progress, 100)}%`,
            background: bulkDiscount >= 0.10 ? '#2E7D32' : bulkDiscount >= 0.05 ? '#FF9800' : '#8B4513',
            borderRadius: '3px',
            transition: 'width 0.3s'
          }} />
          {/* Tier markers */}
          <div style={{ position: 'absolute', left: '50%', top: '-4px', transform: 'translateX(-50%)', width: '2px', height: '14px', background: '#999' }} />
        </div>
        
        {/* Review button */}
        <button
          onClick={() => setIsCartOpen(true)}
          style={{
            width: '100%',
            padding: '14px',
            background: '#8B4513',
            color: 'white',
            border: 'none',
            borderRadius: '10px',
            fontSize: '15px',
            fontWeight: '600',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px'
          }}
        >
          <ShoppingBag size={18} />
          Review Order • ${total.toFixed(2)}
        </button>
      </div>
    </div>
  );
};

// Menu Page Component
export const MenuPage = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { totalLbs } = useCart();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get(`${API}/products`);
        setProducts(response.data);
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  // Get lowest price per lb for each product line
  const getLowestPrice = (productLine) => {
    const lineProducts = products.filter(p => p.product_line === productLine);
    if (lineProducts.length === 0) return null;
    
    let lowestPrice = Infinity;
    lineProducts.forEach(p => {
      if (p.pricing && p.pricing.length > 0) {
        const lowest = Math.min(...p.pricing.map(pr => pr.price_per_lb));
        if (lowest < lowestPrice) lowestPrice = lowest;
      }
    });
    return lowestPrice === Infinity ? null : lowestPrice;
  };

  const comfortPrice = getLowestPrice('comfort_dinner');
  const primalPrice = getLowestPrice('primal_feast');

  const menuItems = [
    {
      id: 'comfort_dinner',
      name: 'Comfort Dinner',
      description: 'Complete & balanced meals. 70/10/10/8/2 ratio with fruits, veggies & supplements.',
      price: comfortPrice,
      image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&h=300&fit=crop',
      link: '/menu/comfort-dinner'
    },
    {
      id: 'primal_feast',
      name: 'Primal Feast',
      description: '80/10/10 raw meals. Pure meat, bone & organ for the raw purist.',
      price: primalPrice,
      image: 'https://images.unsplash.com/photo-1432139555190-58524dae6a55?w=400&h=300&fit=crop',
      link: '/menu/primal-feast'
    },
    {
      id: 'calculator',
      name: 'Feeding Calculator',
      description: 'Find out exactly how much to feed your dog based on weight & activity.',
      icon: Calculator,
      link: '/calculator'
    },
    {
      id: 'meal_plan',
      name: 'Meal Plan Creator',
      description: 'Create a personalized profile and get custom recommendations.',
      icon: ClipboardList,
      link: '/meal-plan'
    }
  ];

  return (
    <>
      <Navbar />
      <div style={{ 
        minHeight: '100vh', 
        background: '#F5F3EF', 
        paddingBottom: totalLbs > 0 ? '140px' : '40px'
      }}>
        {/* Hero */}
        <div style={{
          background: 'linear-gradient(135deg, #8B4513 0%, #6B3410 100%)',
          padding: '60px 20px',
          textAlign: 'center',
          color: 'white'
        }}>
          <h1 style={{ fontSize: '36px', fontWeight: '700', marginBottom: '12px', fontFamily: "'Rubik', sans-serif" }}>
            Our Menu
          </h1>
          <p style={{ fontSize: '16px', opacity: 0.9, maxWidth: '400px', margin: '0 auto' }}>
            Farm-to-bowl raw meals in 6lb increments. The more you add, the more you save.
          </p>
          
          {/* Discount Ladder Info */}
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            gap: '20px',
            marginTop: '24px',
            flexWrap: 'wrap'
          }}>
            {[
              { lbs: '6 lbs', discount: 'Base' },
              { lbs: '12 lbs', discount: '5% off' },
              { lbs: '24 lbs', discount: '10% off' }
            ].map((tier, i) => (
              <div key={i} style={{
                background: 'rgba(255,255,255,0.15)',
                padding: '8px 16px',
                borderRadius: '20px',
                fontSize: '13px'
              }}>
                <strong>{tier.lbs}</strong> → {tier.discount}
              </div>
            ))}
          </div>
        </div>

        {/* Menu Items */}
        <div style={{ maxWidth: '600px', margin: '0 auto', padding: '24px 20px' }}>
          {loading ? (
            <div style={{ textAlign: 'center', padding: '60px 0', color: '#666' }}>Loading menu...</div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {menuItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => navigate(item.link)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '16px',
                    padding: '16px',
                    background: 'white',
                    border: 'none',
                    borderRadius: '16px',
                    cursor: 'pointer',
                    textAlign: 'left',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
                    transition: 'transform 0.2s, box-shadow 0.2s'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-2px)';
                    e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,0,0,0.1)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.06)';
                  }}
                >
                  {/* Image or Icon */}
                  {item.image ? (
                    <img
                      src={item.image}
                      alt={item.name}
                      style={{
                        width: '80px',
                        height: '80px',
                        borderRadius: '12px',
                        objectFit: 'cover'
                      }}
                    />
                  ) : (
                    <div style={{
                      width: '80px',
                      height: '80px',
                      borderRadius: '12px',
                      background: '#F5F3EF',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      {item.icon && <item.icon size={32} color="#8B4513" />}
                    </div>
                  )}
                  
                  {/* Content */}
                  <div style={{ flex: 1 }}>
                    <div style={{ 
                      fontWeight: '600', 
                      fontSize: '18px', 
                      color: '#2B2B2B',
                      marginBottom: '4px'
                    }}>
                      {item.name}
                    </div>
                    <div style={{ 
                      fontSize: '13px', 
                      color: '#666',
                      lineHeight: '1.4'
                    }}>
                      {item.description}
                    </div>
                    {item.price && (
                      <div style={{
                        marginTop: '8px',
                        fontSize: '14px',
                        fontWeight: '600',
                        color: '#8B4513'
                      }}>
                        from ${item.price.toFixed(2)}/lb
                      </div>
                    )}
                  </div>
                  
                  <ChevronRight size={24} color="#CCC" />
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
      
      <OrderProgressBar />
      <SlideCart />
      <Footer />
    </>
  );
};

// Product Line Page (Comfort Dinner or Primal Feast)
export const ProductLinePage = ({ productLine }) => {
  const navigate = useNavigate();
  const { addToCart, totalLbs, setIsCartOpen } = useCart();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedProtein, setSelectedProtein] = useState(null);
  const [selectedSize, setSelectedSize] = useState(6);

  const lineId = productLine === 'comfort-dinner' ? 'comfort_dinner' : 'primal_feast';
  const lineName = productLine === 'comfort-dinner' ? 'Comfort Dinner' : 'Primal Feast';
  const lineDescription = productLine === 'comfort-dinner' 
    ? 'Complete & balanced meals with the perfect 70/10/10/8/2 ratio.'
    : 'Pure 80/10/10 raw meals for the raw feeding purist.';

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get(`${API}/products?line=${lineId}`);
        const lineProducts = response.data.filter(p => p.product_line === lineId);
        setProducts(lineProducts);
        if (lineProducts.length > 0) {
          setSelectedProtein(lineProducts[0]);
        }
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [lineId]);

  const handleAddToCart = () => {
    if (!selectedProtein) return;
    
    const pricing = selectedProtein.pricing.find(p => p.size_lb === selectedSize);
    if (!pricing) return;

    addToCart({
      productId: selectedProtein.product_id,
      name: lineName,
      protein: selectedProtein.name,
      lbs: selectedSize,
      price: pricing.price,
      pricePerLb: pricing.price_per_lb
    });
  };

  const selectedPricing = selectedProtein?.pricing?.find(p => p.size_lb === selectedSize);

  return (
    <>
      <Navbar />
      <div style={{ 
        minHeight: '100vh', 
        background: '#F5F3EF',
        paddingBottom: totalLbs > 0 ? '140px' : '40px'
      }}>
        {/* Header */}
        <div style={{
          background: 'linear-gradient(135deg, #8B4513 0%, #6B3410 100%)',
          padding: '24px 20px',
          color: 'white'
        }}>
          <button
            onClick={() => navigate('/menu')}
            style={{
              background: 'rgba(255,255,255,0.2)',
              border: 'none',
              color: 'white',
              padding: '8px 16px',
              borderRadius: '20px',
              cursor: 'pointer',
              fontSize: '14px',
              marginBottom: '16px'
            }}
          >
            ← Back to Menu
          </button>
          <h1 style={{ fontSize: '28px', fontWeight: '700', marginBottom: '8px' }}>{lineName}</h1>
          <p style={{ fontSize: '14px', opacity: 0.9 }}>{lineDescription}</p>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '60px 0', color: '#666' }}>Loading...</div>
        ) : (
          <div style={{ maxWidth: '600px', margin: '0 auto', padding: '24px 20px' }}>
            {/* Protein Selector */}
            <div style={{ marginBottom: '24px' }}>
              <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', marginBottom: '12px', color: '#2B2B2B' }}>
                Choose your protein
              </label>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px' }}>
                {products.map((product) => {
                  const lowestPrice = Math.min(...product.pricing.map(p => p.price_per_lb));
                  const isSelected = selectedProtein?.product_id === product.product_id;
                  
                  return (
                    <button
                      key={product.product_id}
                      onClick={() => setSelectedProtein(product)}
                      style={{
                        padding: '14px 12px',
                        background: isSelected ? '#FDF8F3' : 'white',
                        border: isSelected ? '2px solid #8B4513' : '2px solid #E8E4DC',
                        borderRadius: '12px',
                        cursor: 'pointer',
                        textAlign: 'left',
                        transition: 'all 0.2s'
                      }}
                    >
                      <div style={{ fontWeight: '600', fontSize: '15px', color: '#2B2B2B' }}>
                        {product.name}
                      </div>
                      <div style={{ fontSize: '12px', color: '#666', marginTop: '2px' }}>
                        from ${lowestPrice.toFixed(2)}/lb
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Selected Product Details */}
            {selectedProtein && (
              <div style={{ background: 'white', borderRadius: '16px', padding: '24px', marginBottom: '24px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
                <h3 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '8px' }}>
                  {selectedProtein.name}
                </h3>
                <p style={{ fontSize: '14px', color: '#666', lineHeight: '1.5', marginBottom: '16px' }}>
                  {selectedProtein.mini_description}
                </p>
                
                {/* Size Toggle */}
                <div style={{ marginBottom: '20px' }}>
                  <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', marginBottom: '10px', color: '#2B2B2B' }}>
                    Select size
                  </label>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px' }}>
                    {[6, 12, 18, 24].map((size) => {
                      const pricing = selectedProtein.pricing.find(p => p.size_lb === size);
                      if (!pricing) return null;
                      
                      const isSelected = selectedSize === size;
                      const discount = getBulkDiscount(size + totalLbs);
                      
                      return (
                        <button
                          key={size}
                          onClick={() => setSelectedSize(size)}
                          style={{
                            padding: '12px 8px',
                            background: isSelected ? '#8B4513' : 'white',
                            color: isSelected ? 'white' : '#2B2B2B',
                            border: isSelected ? '2px solid #8B4513' : '2px solid #E8E4DC',
                            borderRadius: '10px',
                            cursor: 'pointer',
                            textAlign: 'center'
                          }}
                        >
                          <div style={{ fontWeight: '600', fontSize: '16px' }}>{size} lbs</div>
                          <div style={{ fontSize: '11px', opacity: 0.8 }}>
                            ${pricing.price_per_lb.toFixed(2)}/lb
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Add to Cart Button */}
                {selectedPricing && (
                  <button
                    onClick={handleAddToCart}
                    style={{
                      width: '100%',
                      padding: '16px',
                      background: '#8B4513',
                      color: 'white',
                      border: 'none',
                      borderRadius: '10px',
                      fontSize: '16px',
                      fontWeight: '600',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '8px'
                    }}
                  >
                    <Plus size={20} />
                    Add {selectedSize} lbs • ${selectedPricing.price.toFixed(2)}
                  </button>
                )}
              </div>
            )}

            {/* Product Details Accordion */}
            {selectedProtein && (
              <div style={{ background: 'white', borderRadius: '16px', overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
                <details style={{ borderBottom: '1px solid #E8E4DC' }}>
                  <summary style={{ padding: '16px 20px', cursor: 'pointer', fontWeight: '600', fontSize: '15px' }}>
                    Ingredients
                  </summary>
                  <div style={{ padding: '0 20px 16px', fontSize: '14px', color: '#666', lineHeight: '1.6' }}>
                    {selectedProtein.ingredients}
                  </div>
                </details>
                <details style={{ borderBottom: '1px solid #E8E4DC' }}>
                  <summary style={{ padding: '16px 20px', cursor: 'pointer', fontWeight: '600', fontSize: '15px' }}>
                    Nutrition Facts
                  </summary>
                  <div style={{ padding: '0 20px 16px', fontSize: '14px', color: '#666' }}>
                    {selectedProtein.nutrition_facts && Object.entries(selectedProtein.nutrition_facts).map(([key, value]) => (
                      <div key={key} style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px solid #F0F0F0' }}>
                        <span style={{ textTransform: 'capitalize' }}>{key.replace(/_/g, ' ')}</span>
                        <span style={{ fontWeight: '500' }}>{value}</span>
                      </div>
                    ))}
                  </div>
                </details>
                <details>
                  <summary style={{ padding: '16px 20px', cursor: 'pointer', fontWeight: '600', fontSize: '15px' }}>
                    Why This Protein?
                  </summary>
                  <div style={{ padding: '0 20px 16px', fontSize: '14px', color: '#666', lineHeight: '1.6' }}>
                    {selectedProtein.description}
                  </div>
                </details>
              </div>
            )}
          </div>
        )}
      </div>

      <OrderProgressBar />
      <SlideCart />
      <Footer />
    </>
  );
};

export default MenuPage;
