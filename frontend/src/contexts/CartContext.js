import React, { useState, createContext, useContext, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { X, ShoppingBag, Minus, Plus } from 'lucide-react';
import { cart as shopifyCart, cartIdStorage, checkout as shopifyCheckout } from '../services/shopify';

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

// -----------------------------------------------------------------------------
// Shopify cart <-> local UI mapping.
//
// The local `cartItems` shape used by the UI is preserved (productId, name,
// price, image, lbs, quantity). We annotate each item with `shopifyLineId`
// once the item has been mirrored to a Shopify Cart line, so subsequent
// quantity updates / removals can target the same line.
// -----------------------------------------------------------------------------

function mapShopifyCartToItems(sc) {
  if (!sc) return [];
  return (sc.lines?.nodes || []).map((line) => {
    const v = line.merchandise || {};
    const unitPrice = parseFloat(v.price?.amount || '0');
    return {
      productId: v.product?.handle || v.product?.id || line.id,
      merchandiseId: v.id,
      name: v.product?.title || v.title || '',
      image: v.image?.url || v.product?.featuredImage?.url || null,
      lbs: 0, // no meaningful lb value at the Shopify line level; UI will show as-is
      quantity: line.quantity,
      unitPrice,
      price: unitPrice * line.quantity,
      shopifyLineId: line.id,
      variantTitle: v.title,
    };
  });
}

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isSubscription, setIsSubscription] = useState(false);
  const [shopifyCartState, setShopifyCartState] = useState(null);
  const [syncing, setSyncing] = useState(false);
  const initedRef = useRef(false);

  // ---- Hydrate cart from Shopify on mount ---------------------------------
  useEffect(() => {
    if (initedRef.current) return;
    initedRef.current = true;
    const existingId = cartIdStorage.get();
    if (!existingId) return;
    (async () => {
      try {
        const sc = await shopifyCart.get(existingId);
        if (sc) {
          setShopifyCartState(sc);
          setCartItems(mapShopifyCartToItems(sc));
        }
      } catch (err) {
        // ignore hydration errors; user can still shop
        console.warn('Shopify cart hydration failed:', err?.message || err);
      }
    })();
  }, []);

  const totalLbs = cartItems.reduce((sum, item) => sum + ((item.lbs || 0) * item.quantity), 0);
  const bulkDiscount = getBulkDiscount(totalLbs);
  const totalDiscount = isSubscription ? bulkDiscount + SUBSCRIPTION_DISCOUNT : bulkDiscount;

  const subtotal = cartItems.reduce((sum, item) => sum + item.price, 0);
  const discountAmount = subtotal * totalDiscount;
  const total = subtotal - discountAmount;

  // ---- Shopify sync helpers ----------------------------------------------
  const applyShopifyCart = useCallback((sc) => {
    setShopifyCartState(sc);
    if (sc) setCartItems(mapShopifyCartToItems(sc));
  }, []);

  const ensureShopifyCart = useCallback(async () => {
    let sc = shopifyCartState;
    if (!sc) sc = await shopifyCart.ensure();
    applyShopifyCart(sc);
    return sc;
  }, [applyShopifyCart, shopifyCartState]);

  // ---- Public API --------------------------------------------------------

  const addToCart = useCallback(async (item) => {
    // Local first (instant UI response)
    setCartItems((prev) => {
      const existingIndex = prev.findIndex(
        (i) => i.productId === item.productId && i.lbs === item.lbs
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

    // Sync to Shopify Cart if the item has a merchandiseId (Shopify variant GID).
    if (!item.merchandiseId) return;
    try {
      setSyncing(true);
      const sc = await ensureShopifyCart();
      const updated = await shopifyCart.addLines(sc.id, [
        { merchandiseId: item.merchandiseId, quantity: 1 },
      ]);
      applyShopifyCart(updated);
    } catch (err) {
      console.error('Shopify addLines failed:', err?.message || err);
    } finally {
      setSyncing(false);
    }
  }, [applyShopifyCart, ensureShopifyCart]);

  const removeFromCart = useCallback(async (index) => {
    const item = cartItems[index];
    setCartItems((prev) => prev.filter((_, i) => i !== index));
    if (item?.shopifyLineId && shopifyCartState?.id) {
      try {
        setSyncing(true);
        const updated = await shopifyCart.removeLines(shopifyCartState.id, [item.shopifyLineId]);
        applyShopifyCart(updated);
      } catch (err) {
        console.error('Shopify removeLines failed:', err?.message || err);
      } finally { setSyncing(false); }
    }
  }, [applyShopifyCart, cartItems, shopifyCartState]);

  const updateQuantity = useCallback(async (index, delta) => {
    const current = cartItems[index];
    if (!current) return;
    const nextQty = current.quantity + delta;

    setCartItems((prev) => {
      const updated = [...prev];
      if (nextQty <= 0) return prev.filter((_, i) => i !== index);
      updated[index].quantity = nextQty;
      updated[index].price = updated[index].unitPrice * nextQty;
      return updated;
    });

    if (current.shopifyLineId && shopifyCartState?.id) {
      try {
        setSyncing(true);
        if (nextQty <= 0) {
          const updated = await shopifyCart.removeLines(shopifyCartState.id, [current.shopifyLineId]);
          applyShopifyCart(updated);
        } else {
          const updated = await shopifyCart.updateLines(shopifyCartState.id, [
            { id: current.shopifyLineId, quantity: nextQty },
          ]);
          applyShopifyCart(updated);
        }
      } catch (err) {
        console.error('Shopify updateLines failed:', err?.message || err);
      } finally { setSyncing(false); }
    }
  }, [applyShopifyCart, cartItems, shopifyCartState]);

  const clearCart = useCallback(async () => {
    setCartItems([]);
    if (shopifyCartState?.id) {
      const lineIds = (shopifyCartState.lines?.nodes || []).map((l) => l.id);
      if (lineIds.length > 0) {
        try {
          const updated = await shopifyCart.removeLines(shopifyCartState.id, lineIds);
          applyShopifyCart(updated);
        } catch (err) {
          console.error('Shopify clear cart failed:', err?.message || err);
        }
      }
    }
  }, [applyShopifyCart, shopifyCartState]);

  const applyDiscount = useCallback(async (code) => {
    const sc = await ensureShopifyCart();
    const updated = await shopifyCart.updateDiscountCodes(sc.id, code ? [code] : []);
    applyShopifyCart(updated);
    return updated;
  }, [applyShopifyCart, ensureShopifyCart]);

  const checkoutViaShopify = useCallback(async () => {
    const sc = await ensureShopifyCart();
    const url = sc?.checkoutUrl || await shopifyCheckout.urlFromCart(sc.id);
    shopifyCheckout.redirect(url);
    return url;
  }, [ensureShopifyCart]);

  const value = {
    cartItems,
    totalLbs,
    bulkDiscount,
    totalDiscount,
    subtotal,
    discountAmount,
    total,
    isSubscription,
    setIsSubscription,
    isCartOpen,
    setIsCartOpen,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    // Shopify surface (safe to ignore in legacy callers):
    shopifyCart: shopifyCartState,
    shopifyCheckoutUrl: shopifyCartState?.checkoutUrl || null,
    checkoutViaShopify,
    applyDiscount,
    syncing,
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};

export const SlideCart = () => {
  const navigate = useNavigate();
  const {
    cartItems, totalLbs, bulkDiscount, totalDiscount, subtotal, discountAmount, total,
    isSubscription, setIsSubscription, isCartOpen, setIsCartOpen,
    removeFromCart, updateQuantity,
    shopifyCheckoutUrl, checkoutViaShopify, syncing,
  } = useCart();

  const lbsToNextTier = totalLbs < 18 ? 18 - totalLbs : totalLbs < 24 ? 24 - totalLbs : totalLbs < 36 ? 36 - totalLbs : 0;
  const nextTierDiscount = totalLbs < 18 ? '5%' : totalLbs < 24 ? '10%' : totalLbs < 36 ? '15%' : null;

  if (!isCartOpen) return null;

  const hasShopifyCart = !!shopifyCheckoutUrl;

  const handleCheckout = async () => {
    setIsCartOpen(false);
    if (hasShopifyCart) {
      try {
        await checkoutViaShopify();
        return;
      } catch (err) {
        console.error('Shopify checkout redirect failed:', err?.message || err);
      }
    }
    // Fall back to internal checkout page for legacy items.
    navigate('/checkout');
  };

  return (
    <>
      <div onClick={() => setIsCartOpen(false)} style={{ position: 'fixed', inset: 0, background: 'transparent', zIndex: 998 }} />

      <div style={{
        position: 'fixed', top: '120px', right: 0, bottom: 0, width: '100%', maxWidth: '400px',
        background: 'white', zIndex: 999, display: 'flex', flexDirection: 'column',
        boxShadow: '-4px 0 24px rgba(0,0,0,0.12)'
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
              <div key={item.shopifyLineId || index} style={{ display: 'flex', gap: '12px', padding: '12px 0', borderBottom: '1px solid #f0f0f0' }}>
                <img src={item.image || DEFAULT_IMAGE} alt="" style={{ width: '60px', height: '60px', borderRadius: '8px', objectFit: 'cover' }} />
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: '600', fontSize: '15px' }}>{item.name}</div>
                  {item.lbs > 0 && <div style={{ fontSize: '13px', color: '#666' }}>{item.lbs} lbs</div>}
                  {item.variantTitle && item.variantTitle !== 'Default Title' && (
                    <div style={{ fontSize: '12px', color: '#888' }}>{item.variantTitle}</div>
                  )}
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

            <button
              onClick={handleCheckout}
              disabled={syncing}
              style={{
                width: '100%', marginTop: '16px', padding: '16px', background: '#c8102e', color: 'white',
                border: 'none', borderRadius: '8px', fontSize: '16px', fontWeight: '600', cursor: 'pointer',
                opacity: syncing ? 0.7 : 1,
              }}
            >
              {syncing ? 'Updating\u2026' : hasShopifyCart ? `Checkout via Shopify \u2022 $${total.toFixed(2)}` : `Checkout \u2022 $${total.toFixed(2)}`}
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
