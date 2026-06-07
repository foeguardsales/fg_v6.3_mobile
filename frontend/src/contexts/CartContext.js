import React, { useState, createContext, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { X, ShoppingBag, Minus, Plus } from 'lucide-react';

const CartContext = createContext();
export const useCart = () => useContext(CartContext);

// Discount tiers
const BULK_DISCOUNTS = { 6: 0, 12: 0.05, 24: 0.10 };
const SUBSCRIPTION_DISCOUNT = 0.05;

const getBulkDiscount = (totalLbs) => {
  if (totalLbs >= 24) return BULK_DISCOUNTS[24];
  if (totalLbs >= 12) return BULK_DISCOUNTS[12];
  return BULK_DISCOUNTS[6];
};

const DEFAULT_IMAGE = 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&h=400&fit=crop';

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isSubscription, setIsSubscription] = useState(false);

  const totalLbs = cartItems.reduce((sum, item) => sum + (item.lbs * item.quantity), 0);
  const bulkDiscount = getBulkDiscount(totalLbs);
  const totalDiscount = isSubscription ? bulkDiscount + SUBSCRIPTION_DISCOUNT : bulkDiscount;

  const subtotal = cartItems.reduce((sum, item) => sum + item.price, 0);
  const discountAmount = subtotal * totalDiscount;
  const total = subtotal - discountAmount;

  const addToCart = (item) => {
    setCartItems(prev => {
      const existingIndex = prev.findIndex(
        i => i.productId === item.productId && i.lbs === item.lbs
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

  const removeFromCart = (index) => setCartItems(prev => prev.filter((_, i) => i !== index));

  const updateQuantity = (index, delta) => {
    setCartItems(prev => {
      const updated = [...prev];
      updated[index].quantity += delta;
      if (updated[index].quantity <= 0) return prev.filter((_, i) => i !== index);
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
      <div onClick={() => setIsCartOpen(false)} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', zIndex: 998 }} />

      <div style={{
        position: 'fixed', top: 0, right: 0, bottom: 0, width: '100%', maxWidth: '400px',
        background: 'white', zIndex: 999, display: 'flex', flexDirection: 'column'
      }}>
        <div style={{ padding: '16px 20px', borderBottom: '1px solid #eee', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <h2 style={{ fontSize: '18px', fontWeight: '600', margin: 0 }}>Your Order</h2>
          <button onClick={() => setIsCartOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
            <X size={24} />
          </button>
        </div>

        {lbsToNextTier > 0 && cartItems.length > 0 && (
          <div style={{ padding: '12px 20px', background: '#FFF8E1', fontSize: '14px', color: '#E65100' }}>
            Add {lbsToNextTier} more lbs to save {nextTierDiscount}!
          </div>
        )}

        <div style={{ flex: 1, overflow: 'auto', padding: '16px 20px' }}>
          {cartItems.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px 0', color: '#999' }}>
              <ShoppingBag size={40} strokeWidth={1.5} style={{ marginBottom: '12px' }} />
              <p>Your cart is empty</p>
            </div>
          ) : (
            cartItems.map((item, index) => (
              <div key={index} style={{ display: 'flex', gap: '12px', padding: '12px 0', borderBottom: '1px solid #f0f0f0' }}>
                <img src={item.image || DEFAULT_IMAGE} alt="" style={{ width: '60px', height: '60px', borderRadius: '8px', objectFit: 'cover' }} />
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: '600', fontSize: '15px' }}>{item.name}</div>
                  <div style={{ fontSize: '13px', color: '#666' }}>{item.lbs} lbs</div>
                  <div style={{ fontWeight: '600', color: '#c8102e', marginTop: '4px' }}>${item.price.toFixed(2)}</div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <button onClick={() => updateQuantity(index, -1)} style={{ width: '28px', height: '28px', borderRadius: '50%', border: '1px solid #ddd', background: 'white', cursor: 'pointer' }}>
                    <Minus size={14} />
                  </button>
                  <span style={{ minWidth: '20px', textAlign: 'center' }}>{item.quantity}</span>
                  <button onClick={() => updateQuantity(index, 1)} style={{ width: '28px', height: '28px', borderRadius: '50%', border: '1px solid #ddd', background: 'white', cursor: 'pointer' }}>
                    <Plus size={14} />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {cartItems.length > 0 && (
          <div style={{ padding: '16px 20px', borderTop: '1px solid #eee', background: isSubscription ? '#E8F5E9' : '#f9f9f9' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }}>
              <input type="checkbox" checked={isSubscription} onChange={(e) => setIsSubscription(e.target.checked)} style={{ width: '18px', height: '18px' }} />
              <div>
                <div style={{ fontWeight: '600', fontSize: '14px' }}>Subscribe & Save 5%</div>
                <div style={{ fontSize: '12px', color: '#666' }}>Never run out! Pause anytime.</div>
              </div>
            </label>
          </div>
        )}

        {cartItems.length > 0 && (
          <div style={{ padding: '16px 20px', borderTop: '1px solid #eee' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '14px' }}>
              <span>Subtotal ({totalLbs} lbs)</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>
            {totalDiscount > 0 && (
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '14px', color: '#2E7D32' }}>
                <span>Discount ({Math.round(totalDiscount * 100)}%)</span>
                <span>-${discountAmount.toFixed(2)}</span>
              </div>
            )}
            <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: '700', fontSize: '18px', marginTop: '12px', paddingTop: '12px', borderTop: '1px solid #eee' }}>
              <span>Total</span>
              <span>${total.toFixed(2)}</span>
            </div>

            <button onClick={() => { setIsCartOpen(false); navigate('/checkout'); }} style={{
              width: '100%', marginTop: '16px', padding: '16px', background: '#c8102e', color: 'white',
              border: 'none', borderRadius: '8px', fontSize: '16px', fontWeight: '600', cursor: 'pointer'
            }}>
              Checkout • ${total.toFixed(2)}
            </button>
            <button onClick={() => setIsCartOpen(false)} style={{
              width: '100%', marginTop: '8px', padding: '12px', background: 'none', color: '#c8102e',
              border: 'none', fontSize: '14px', cursor: 'pointer'
            }}>
              + Add more items
            </button>
          </div>
        )}
      </div>
    </>
  );
};
