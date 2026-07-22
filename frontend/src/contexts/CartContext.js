import React, { useState, useEffect, useCallback, createContext, useContext, useRef } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { cart as shopifyCart, checkout as shopifyCheckout } from '../services/shopify';
import { trackCheckoutInitiated } from '../services/analytics';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const CartContext = createContext();
export const useCart = () => useContext(CartContext);

// Meal packaging variant labels (index-based, matches ProductDetail VARIANT_OPTIONS)
const MEAL_VARIANT_LABELS = ['1 lb', '1.5 lb'];

// localStorage keys — SAME keys the menu/product pages already read/write, so the
// cart is a single shared source of truth across every page.
const LS_PROTEINS = 'selectedProteins';
const LS_TREATS = 'selectedTreats';
const LS_DELIVERY = 'foeguard_delivery_date';

const readProteins = () => {
  try { return JSON.parse(localStorage.getItem(LS_PROTEINS) || '{}') || {}; } catch (_) { return {}; }
};
const readTreats = () => {
  try { const t = JSON.parse(localStorage.getItem(LS_TREATS) || '[]'); return Array.isArray(t) ? t : []; } catch (_) { return []; }
};

// Strip the composite variant suffix so we can always resolve the real product_id
// (meal lines added from the product page use `${productId}::${variantLabel}`).
const baseProductId = (key, entry) => (entry && entry.productId) ? entry.productId : String(key).split('::')[0];

const notifyCartChanged = () => {
  try {
    window.dispatchEvent(new Event('foeguard:box-updated'));
    window.dispatchEvent(new Event('foeguard:cart-changed'));
  } catch (_) { /* ignore */ }
};

export const CartProvider = ({ children }) => {
  const [proteins, setProteins] = useState(readProteins);
  const [treats, setTreats] = useState(readTreats);
  const [products, setProducts] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [deliveryDate, setDeliveryDateState] = useState(() => {
    try { return localStorage.getItem(LS_DELIVERY) || ''; } catch (_) { return ''; }
  });

  // Load the product catalog once (for cart-line pricing + shopify variant lookup).
  useEffect(() => {
    let cancelled = false;
    axios.get(`${API}/products`)
      .then(res => { if (!cancelled) setProducts(Array.isArray(res.data) ? res.data : []); })
      .catch(() => { /* browsing still works without pricing */ });
    return () => { cancelled = true; };
  }, []);

  // Keep the context mirror of localStorage in sync with any page that mutates
  // the basket directly (menu grid, product/treat pages). Poll + event based —
  // matches the existing app pattern.
  useEffect(() => {
    const resync = () => {
      const p = readProteins();
      const t = readTreats();
      setProteins(prev => (JSON.stringify(prev) !== JSON.stringify(p) ? p : prev));
      setTreats(prev => (JSON.stringify(prev) !== JSON.stringify(t) ? t : prev));
    };
    resync();
    const id = setInterval(resync, 700);
    window.addEventListener('foeguard:box-updated', resync);
    window.addEventListener('foeguard:cart-changed', resync);
    window.addEventListener('storage', resync);
    window.addEventListener('focus', resync);
    return () => {
      clearInterval(id);
      window.removeEventListener('foeguard:box-updated', resync);
      window.removeEventListener('foeguard:cart-changed', resync);
      window.removeEventListener('storage', resync);
      window.removeEventListener('focus', resync);
    };
  }, []);

  const persistProteins = useCallback((next) => {
    try { localStorage.setItem(LS_PROTEINS, JSON.stringify(next)); } catch (_) { /* ignore */ }
    setProteins(next);
    notifyCartChanged();
  }, []);

  const persistTreats = useCallback((next) => {
    try { localStorage.setItem(LS_TREATS, JSON.stringify(next)); } catch (_) { /* ignore */ }
    setTreats(next);
    notifyCartChanged();
  }, []);

  const setDeliveryDate = useCallback((date) => {
    setDeliveryDateState(date);
    try { localStorage.setItem(LS_DELIVERY, date || ''); } catch (_) { /* ignore */ }
  }, []);

  // ----- Meal (protein) mutators — key can be plain productId OR composite -----
  const adjustProtein = useCallback((key, newQtyLb) => {
    const current = readProteins();
    const next = { ...current };
    if (newQtyLb <= 0) {
      delete next[key];
    } else if (next[key]) {
      next[key] = { ...next[key], qty: newQtyLb };
    }
    persistProteins(next);
  }, [persistProteins]);

  const removeProtein = useCallback((key) => {
    const current = readProteins();
    const next = { ...current };
    delete next[key];
    persistProteins(next);
  }, [persistProteins]);

  // ----- Treat mutators (quantity = integer packs) -----
  const setTreatQty = useCallback((treatId, newQty) => {
    const current = readTreats();
    let next;
    if (newQty <= 0) {
      next = current.filter(t => t.treat_id !== treatId);
    } else {
      next = current.map(t => (t.treat_id === treatId ? { ...t, quantity: newQty } : t));
    }
    persistTreats(next);
  }, [persistTreats]);

  const removeTreat = useCallback((treatId) => {
    const next = readTreats().filter(t => t.treat_id !== treatId);
    persistTreats(next);
  }, [persistTreats]);

  const clearCart = useCallback(() => {
    persistProteins({});
    persistTreats([]);
  }, [persistProteins, persistTreats]);

  // ----- Derived values -----
  const proteinEntries = Object.entries(proteins || {}).filter(([, d]) => (d?.qty || 0) > 0);
  const totalLbs = proteinEntries.reduce((s, [, d]) => s + (d.qty || 0), 0);

  const perLbForProduct = useCallback((productId) => {
    const product = products.find(p => p.product_id === productId);
    if (!product || !Array.isArray(product.pricing)) return 0;
    const base = (product.pricing.find(p => p.size_lb === 6) || product.pricing[0])?.price || 0;
    return base / 6;
  }, [products]);

  const mealsSubtotal = proteinEntries.reduce((s, [key, d]) => {
    return s + perLbForProduct(baseProductId(key, d)) * (d.qty || 0);
  }, 0);
  const treatsSubtotal = (treats || []).reduce((s, t) => s + (t.price || 0) * (t.quantity || 1), 0);
  const subtotal = mealsSubtotal + treatsSubtotal;

  // Each meal line = 1 item; each treat pack quantity counts as items.
  const itemCount = proteinEntries.length + (treats || []).reduce((s, t) => s + (t.quantity || 1), 0);

  // Backward-compat: expose a flat cartItems array for legacy consumers (navbar badge, /checkout page).
  const cartItems = [
    ...proteinEntries.map(([key, d]) => ({
      key,
      productId: baseProductId(key, d),
      name: d.name,
      lbs: d.qty,
      quantity: 1,
      price: perLbForProduct(baseProductId(key, d)) * (d.qty || 0),
    })),
    ...(treats || []).map(t => ({
      key: `treat:${t.treat_id}`,
      treatId: t.treat_id,
      name: t.name,
      quantity: t.quantity || 1,
      price: (t.price || 0) * (t.quantity || 1),
    })),
  ];

  const value = {
    // new API
    proteins, treats, products, proteinEntries,
    deliveryDate, setDeliveryDate,
    isCartOpen, setIsCartOpen,
    adjustProtein, removeProtein, setTreatQty, removeTreat, clearCart,
    itemCount, totalLbs, subtotal, perLbForProduct, baseProductId,
    MEAL_VARIANT_LABELS,
    // backward-compat (do not remove — used by legacy pages)
    cartItems, total: subtotal, totalDiscount: 0, discountAmount: 0,
    isSubscription: false, setIsSubscription: () => {},
    addToCart: () => {}, removeFromCart: () => {}, updateQuantity: () => {},
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

// Delivery date: earliest = today + 3 days, no upper bound (unlimited future). Mandatory.
const DeliveryDatePicker = ({ value, onChange }) => {
  const min = (() => {
    const d = new Date();
    d.setDate(d.getDate() + 3);
    return d.toISOString().split('T')[0];
  })();
  const pretty = (s) => {
    if (!s) return '';
    const d = new Date(s + 'T00:00:00');
    return d.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });
  };
  return (
    <div className="delivery-date-selector" data-testid="cart-delivery-section" style={{ marginTop: '16px' }}>
      <label style={{ display: 'block', fontSize: '14px', fontWeight: 600, marginBottom: '8px', color: '#2C2C2C' }}>
        Delivery date <span style={{ color: '#A41E34' }}>*</span>
      </label>
      <input
        type="date"
        value={value}
        min={min}
        onChange={(e) => onChange(e.target.value)}
        data-testid="cart-delivery-date"
        style={{ width: '100%', padding: '10px 12px', border: '2px solid #D8CFB8', borderRadius: '8px', fontSize: '14px', fontFamily: 'inherit' }}
      />
      {value ? (
        <p className="delivery-date-display" style={{ margin: '8px 0 0', fontSize: '13px', color: '#2E7D32' }}>
          Delivery: <strong>{pretty(value)}</strong>
        </p>
      ) : (
        <p style={{ margin: '8px 0 0', fontSize: '12px', color: '#8A7156' }}>
          Earliest delivery is 3 days out (order prep time). Choose any date from there.
        </p>
      )}
    </div>
  );
};

// The single, universal cart drawer — rendered ONCE at app level and opened from
// every page's header cart icon. Reads the shared basket from CartContext.
export const UniversalCart = () => {
  const navigate = useNavigate();
  const {
    proteinEntries, treats, products,
    deliveryDate, setDeliveryDate,
    isCartOpen, setIsCartOpen,
    adjustProtein, removeProtein, setTreatQty, removeTreat,
    itemCount, subtotal, perLbForProduct, baseProductId, MEAL_VARIANT_LABELS: variantLabels,
  } = useCart();

  const drawerRef = useRef(null);
  const [checkoutErr, setCheckoutErr] = useState('');
  const [checkingOut, setCheckingOut] = useState(false);

  // Close on outside click (delayed bind so the opening click is ignored).
  useEffect(() => {
    if (!isCartOpen) return undefined;
    const handleDown = (e) => {
      if (drawerRef.current && !drawerRef.current.contains(e.target)) setIsCartOpen(false);
    };
    const t = setTimeout(() => {
      document.addEventListener('mousedown', handleDown);
      document.addEventListener('touchstart', handleDown);
    }, 0);
    return () => {
      clearTimeout(t);
      document.removeEventListener('mousedown', handleDown);
      document.removeEventListener('touchstart', handleDown);
    };
  }, [isCartOpen, setIsCartOpen]);

  const hasItems = proteinEntries.length > 0 || (treats && treats.length > 0);
  const canCheckout = hasItems && !!deliveryDate && !checkingOut;

  const mealVariantLabel = (d) => {
    if (typeof d.variantLabel === 'string' && d.variantLabel) return `${d.variantLabel} pack`;
    if (typeof d.variant === 'number' && variantLabels[d.variant]) return `${variantLabels[d.variant]} pack`;
    return null;
  };

  const handleCheckout = async () => {
    if (!deliveryDate) { setCheckoutErr('Please select a delivery date to continue.'); return; }
    setCheckoutErr('');
    setCheckingOut(true);
    trackCheckoutInitiated({ value: Number(subtotal.toFixed(2)), num_items: itemCount });
    try {
      const lines = [];
      proteinEntries.forEach(([key, d]) => {
        const product = products.find(p => p.product_id === baseProductId(key, d));
        const variantId = product?.shopify_variant_id;
        if (variantId) {
          lines.push({
            merchandiseId: variantId,
            quantity: Math.max(1, Math.round((d.qty || 6) / 6)),
            attributes: [{ key: 'Weight', value: `${d.qty} lb` }],
          });
        }
      });
      (treats || []).forEach((t) => {
        if (t.shopify_variant_id) {
          lines.push({ merchandiseId: t.shopify_variant_id, quantity: t.quantity || 1 });
        }
      });

      // Delivery date travels to Shopify as a cart attribute -> shows on the order.
      const attributes = [{ key: 'Delivery Date', value: deliveryDate }];

      const res = await shopifyCart.cartCreate({ lines, attributes });
      let url = res?.checkoutUrl || res?.cart?.checkoutUrl;
      const cartId = res?.id || res?.cart?.id;
      if (!url && cartId) {
        const co = await shopifyCheckout.getCheckoutUrl(cartId);
        url = co?.checkoutUrl;
      }
      if (url) {
        window.location.href = url;
        return;
      }
      setCheckoutErr('Unable to start checkout right now. Please try again.');
    } catch (err) {
      console.error('Shopify checkout failed:', err);
      setCheckoutErr('Unable to start checkout right now. Please try again.');
    } finally {
      setCheckingOut(false);
    }
  };

  return (
    <>
      <div className={`cart-drawer-overlay ${isCartOpen ? 'open' : ''}`} onClick={() => setIsCartOpen(false)} />
      <div className={`cart-drawer ${isCartOpen ? 'open' : ''}`} data-testid="cart-drawer" ref={drawerRef}>
        <div className="cart-drawer-header">
          <h3 style={{ fontSize: '22px', color: '#2C2C2C', margin: 0, fontWeight: 700 }} data-testid="cart-title">
            CART ({itemCount})
          </h3>
          <button onClick={() => setIsCartOpen(false)} className="cart-close-btn" aria-label="Close cart">×</button>
        </div>

        <div className="cart-drawer-content">
          {!hasItems && (
            <div style={{ textAlign: 'center', padding: '28px 0', color: '#8A7156', fontSize: '14px' }}>
              No items in cart. Add meals or treats from the menu.
            </div>
          )}

          {/* Meals */}
          {proteinEntries.map(([key, d]) => {
            const variantLabel = mealVariantLabel(d);
            const linePrice = perLbForProduct(baseProductId(key, d)) * (d.qty || 0);
            return (
              <div key={key} className="cart-item cart-line" data-testid={`cart-protein-${key}`}>
                <div className="cart-line-info">
                  <span className="cart-line-name">{d.name}</span>
                  {variantLabel && (
                    <span className="cart-line-sub" data-testid={`cart-variant-${key}`}>{variantLabel}</span>
                  )}
                </div>
                <div className="cart-line-right">
                  <div className="cart-qty-mini">
                    <button
                      onClick={() => (d.qty > 6 ? adjustProtein(key, d.qty - 6) : removeProtein(key))}
                      data-testid={`cart-dec-${key}`}
                      aria-label="Decrease"
                    >−</button>
                    <span>{d.qty}lb</span>
                    <button
                      onClick={() => adjustProtein(key, d.qty + 6)}
                      data-testid={`cart-inc-${key}`}
                      aria-label="Increase"
                    >+</button>
                  </div>
                  <span className="cart-line-price">${linePrice.toFixed(2)}</span>
                  <button onClick={() => removeProtein(key)} title="Remove" data-testid={`cart-remove-protein-${key}`} className="cart-line-remove">×</button>
                </div>
              </div>
            );
          })}

          {/* Treats — identical layout to meals */}
          {(treats || []).map((t) => {
            const qty = t.quantity || 1;
            const packLabel = (typeof t.variantLabel === 'string' && t.variantLabel) ? t.variantLabel : null;
            return (
              <div key={t.treat_id} className="cart-item cart-line" data-testid={`cart-treat-${t.treat_id}`}>
                <div className="cart-line-info">
                  <span className="cart-line-name">{t.name}</span>
                  {packLabel && <span className="cart-line-sub">{packLabel}</span>}
                </div>
                <div className="cart-line-right">
                  <div className="cart-qty-mini">
                    <button
                      onClick={() => (qty > 1 ? setTreatQty(t.treat_id, qty - 1) : removeTreat(t.treat_id))}
                      data-testid={`cart-treat-dec-${t.treat_id}`}
                      aria-label="Decrease"
                    >−</button>
                    <span>{qty}</span>
                    <button
                      onClick={() => setTreatQty(t.treat_id, qty + 1)}
                      data-testid={`cart-treat-inc-${t.treat_id}`}
                      aria-label="Increase"
                    >+</button>
                  </div>
                  <span className="cart-line-price">${((t.price || 0) * qty).toFixed(2)}</span>
                  <button onClick={() => removeTreat(t.treat_id)} title="Remove" data-testid={`cart-remove-treat-${t.treat_id}`} className="cart-line-remove">×</button>
                </div>
              </div>
            );
          })}

          {hasItems && (
            <>
              <div className="cart-item" style={{ marginTop: '8px' }}>
                <span>Subtotal</span>
                <span data-testid="cart-subtotal">${subtotal.toFixed(2)}</span>
              </div>
              <div className="cart-total">
                <span>Total</span>
                <span data-testid="cart-total">${subtotal.toFixed(2)}</span>
              </div>
              <p style={{ margin: '6px 0 0', fontSize: '12px', color: '#8A7156' }}>
                Taxes &amp; delivery calculated at checkout.
              </p>

              {/* Delivery date — below the total, mandatory */}
              <DeliveryDatePicker value={deliveryDate} onChange={setDeliveryDate} />
            </>
          )}
        </div>

        <div className="cart-drawer-footer">
          {checkoutErr && (
            <p style={{ color: '#D32F2F', fontSize: '13px', margin: '0 0 10px' }} data-testid="cart-checkout-error">{checkoutErr}</p>
          )}
          {hasItems && !deliveryDate && (
            <p style={{ color: '#8A7156', fontSize: '12px', margin: '0 0 10px' }} data-testid="cart-delivery-hint">
              Select a delivery date to proceed to checkout.
            </p>
          )}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <button
              type="button"
              onClick={() => { setIsCartOpen(false); navigate('/menu'); }}
              data-testid="cart-add-items"
              style={{ background: 'transparent', border: '1.5px solid #2C2C2C', color: '#2C2C2C', padding: '12px 18px', borderRadius: '6px', fontFamily: "'Barlow Semi Condensed', serif", fontSize: '13px', fontWeight: 700, cursor: 'pointer', letterSpacing: '0.02em' }}
            >
              + Add items
            </button>
            <button
              className="btn-primary"
              onClick={handleCheckout}
              disabled={!canCheckout}
              data-testid="cart-proceed-checkout"
              style={{ background: canCheckout ? '#2C2C2C' : '#A89B7C', color: '#F5F3EF', padding: '14px 22px', border: 'none', borderRadius: '6px', fontFamily: "'Barlow Semi Condensed', serif", fontSize: '15px', fontWeight: 700, cursor: canCheckout ? 'pointer' : 'not-allowed', letterSpacing: 0, textTransform: 'none' }}
            >
              {checkingOut ? 'Starting checkout…' : (hasItems ? 'Go to checkout' : 'No items in cart')}
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

// Deprecated — the universal cart is now rendered once globally (App.js).
// Kept as a no-op so any leftover <SlideCart /> renders never produce a duplicate.
export const SlideCart = () => null;
