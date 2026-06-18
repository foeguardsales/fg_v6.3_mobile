import React, { useState, useEffect, useRef, useCallback } from 'react';
import axios from 'axios';
import { useStripe, useElements, CardNumberElement, CardExpiryElement, CardCvcElement, PaymentRequestButtonElement } from '@stripe/react-stripe-js';
import { useNavigate } from 'react-router-dom';
import { Trash2, Edit2 } from 'lucide-react';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

// Discount rates by box size
const DISCOUNT_RATES = {
  12: 0,
  18: 0.05,
  24: 0.10,
  30: 0.15
};

// Subscription discount rate
const SUBSCRIPTION_DISCOUNT = 0.05; // 5% off

// Cart Drawer Component (slide-in from right)
export const CartDrawer = ({ isOpen, onClose, boxSize, selectedProteins, selectedTreats, products, onProceed, getDiscountedPrice, getBasePrice, onRemoveProtein, onRemoveTreat, onAdjustProtein, subscriptionPlan, onSubscriptionChange, basket = [], onRemoveBox }) => {
  const [promoCode, setPromoCode] = useState('');
  const [promoDiscount, setPromoDiscount] = useState(0);
  const [specialInstructions, setSpecialInstructions] = useState('');
  const [promoError, setPromoError] = useState('');
  const [savedPets, setSavedPets] = useState([]);
  const navigate = useNavigate();

  // Load saved pets from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('foeguard_saved_pets');
    if (saved) {
      setSavedPets(JSON.parse(saved));
    }
  }, [isOpen]);

  const clearSavedPets = () => {
    localStorage.removeItem('foeguard_saved_pets');
    sessionStorage.removeItem('foeguard_calculator_pets');
    sessionStorage.removeItem('foeguard_calculator_recommendation');
    setSavedPets([]);
  };

  const applyPromo = async () => {
    try {
      const response = await axios.post(`${API}/validate-promo`, {
        code: promoCode,
        order_total: total
      });
      setPromoDiscount(response.data.discount_amount);
      setPromoError('');
    } catch (error) {
      setPromoError(error.response?.data?.detail || 'Invalid promo code');
      setPromoDiscount(0);
    }
  };
  // Price one box (its proteins at the box's own discount)
  const boxSubtotal = (box) => {
    let t = 0;
    const d = box.discount || 0;
    Object.entries(box.proteins || {}).forEach(([productId, data]) => {
      if (data.qty > 0) {
        const product = products.find(p => p.product_id === productId);
        if (product) {
          const basePrice = getBasePrice ? getBasePrice(product) : product.pricing.find(p => p.size_lb === 6)?.price || 0;
          t += basePrice * (1 - d) * (data.qty / 6);
        }
      }
    });
    return t;
  };
  const boxLbs = (box) => Object.values(box.proteins || {}).reduce((s, d) => s + (d.qty || 0), 0);

  const calculateSubtotal = () => {
    let total = 0;
    basket.forEach(box => { total += boxSubtotal(box); });
    selectedTreats.forEach(treat => { total += treat.price * (treat.quantity || 1); });
    return total;
  };

  const subtotal = calculateSubtotal();
  const subscriptionDiscount = subscriptionPlan ? subtotal * SUBSCRIPTION_DISCOUNT : 0;
  const discountedSubtotal = subtotal - subscriptionDiscount;
  const tax = discountedSubtotal * 0.13;
  const total = discountedSubtotal + tax;
  const basketLbs = basket.reduce((s, b) => s + boxLbs(b), 0);
  const hasTreats = selectedTreats.length > 0;
  const canCheckout = basket.length > 0 || hasTreats;
  const discount = DISCOUNT_RATES[boxSize] || 0;

  return (
    <>
      <div className={`cart-drawer-overlay ${isOpen ? 'open' : ''}`} onClick={onClose} />
      <div className={`cart-drawer ${isOpen ? 'open' : ''}`} data-testid="cart-drawer">
        <div className="cart-drawer-header">
          <h3 style={{ fontSize: '24px', color: '#c8102e', margin: 0 }}>Your Box</h3>
          <button onClick={onClose} className="cart-close-btn">×</button>
        </div>
        
        <div className="cart-drawer-content">
          {/* Saved Pets Info */}
          {savedPets.length > 0 && (
            <div style={{
              background: '#F5F9F5',
              border: '1px solid #C8E6C9',
              borderRadius: '12px',
              padding: '16px',
              marginBottom: '20px'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                <h4 style={{ margin: 0, fontSize: '14px', color: '#2E7D32', fontWeight: '600' }}>
                  Saved Pet Info
                </h4>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button 
                    onClick={() => navigate('/calculator')}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: '#666',
                      cursor: 'pointer',
                      padding: '4px'
                    }}
                    title="Edit"
                  >
                    <Edit2 size={14} />
                  </button>
                  <button 
                    onClick={clearSavedPets}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: '#666',
                      cursor: 'pointer',
                      padding: '4px'
                    }}
                    title="Remove"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
              {savedPets.map((pet, idx) => (
                <div key={idx} style={{ fontSize: '13px', color: '#555', marginBottom: '4px' }}>
                  <strong>{pet.name}</strong> • {pet.weight} lbs • {pet.activity} activity
                </div>
              ))}
            </div>
          )}

          <div className="cart-box-info">
            <span className="cart-box-size">{basket.length} {basket.length === 1 ? 'Box' : 'Boxes'}</span>
            {basketLbs > 0 && (
              <span className="cart-box-progress">({basketLbs}lb total)</span>
            )}
          </div>

          {/* Subscription Badge */}
          {subscriptionPlan && (
            <div style={{
              background: 'linear-gradient(135deg, #E8F5E9 0%, #C8E6C9 100%)',
              borderRadius: '12px',
              padding: '12px 16px',
              marginBottom: '16px',
              border: '2px solid #5F7C5A',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}>
              <div>
                <div style={{ 
                  fontSize: '14px', 
                  fontWeight: '700', 
                  color: '#2E7D32',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}>
                  <span style={{ fontSize: '16px' }}>✓</span>
                  Subscription: {(() => {
                    const m = typeof subscriptionPlan === 'string' && subscriptionPlan.match(/every_(\d+)_weeks/);
                    if (m) {
                      const n = parseInt(m[1], 10);
                      return n === 1 ? 'Every week' : `Every ${n} weeks`;
                    }
                    return subscriptionPlan === 'biweekly' ? 'Every 2 weeks' : 'Monthly';
                  })()}
                </div>
                <div style={{ fontSize: '12px', color: '#5F7C5A', marginTop: '2px' }}>
                  5% discount applied • Free delivery
                </div>
              </div>
              {onSubscriptionChange && (
                <button
                  onClick={() => onSubscriptionChange(null)}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: '#666',
                    fontSize: '18px',
                    cursor: 'pointer',
                    padding: '4px'
                  }}
                  title="Remove subscription"
                >
                  ×
                </button>
              )}
            </div>
          )}
          
          {basket.length === 0 && selectedTreats.length === 0 && (
            <div style={{ textAlign: 'center', padding: '28px 0', color: '#8A7156', fontSize: '14px' }}>
              Your basket is empty. Build a box on the menu and tap &quot;Add to Basket&quot;.
            </div>
          )}

          {basket.map((box, bi) => (
            <div key={box.id} data-testid={`cart-box-${bi}`} style={{ borderBottom: '1px solid #E8DDD0', paddingBottom: '12px', marginBottom: '12px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                <div style={{ fontWeight: 700, color: '#3B2A1A', fontFamily: "'Barlow Semi Condensed', sans-serif", display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span>Box {bi + 1} · {box.boxSize}lb</span>
                  {box.discount > 0 && (
                    <span className="cart-discount-badge">Save {Math.round(box.discount * 100)}%</span>
                  )}
                </div>
                {onRemoveBox && (
                  <button
                    onClick={() => onRemoveBox(box.id)}
                    title="Remove box"
                    data-testid={`cart-remove-box-${bi}`}
                    style={{ background: 'none', border: 'none', color: '#A41E34', cursor: 'pointer', fontSize: '20px', lineHeight: 1, padding: '4px 8px' }}
                  >
                    ×
                  </button>
                )}
              </div>
              {Object.entries(box.proteins || {}).map(([pid, data]) => {
                if (!data.qty) return null;
                const product = products.find(p => p.product_id === pid);
                const basePrice = product ? (getBasePrice ? getBasePrice(product) : product.pricing.find(p => p.size_lb === 6)?.price || 0) : 0;
                const lineTotal = basePrice * (1 - (box.discount || 0)) * (data.qty / 6);
                return (
                  <div key={pid} className="cart-item" style={{ display: 'flex', justifyContent: 'space-between', padding: '5px 0', fontSize: '14px' }}>
                    <span style={{ color: '#3B2A1A' }}>{data.name} · {data.qty}lb</span>
                    <span style={{ color: '#6A4F35' }}>${lineTotal.toFixed(2)}</span>
                  </div>
                );
              })}
            </div>
          ))}
          
          {selectedTreats.map(treat => (
            <div key={treat.treat_id} className="cart-item" data-testid={`cart-treat-${treat.treat_id}`} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span>{treat.name} (x{treat.quantity || 1})</span>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <span>${(treat.price * (treat.quantity || 1)).toFixed(2)}</span>
                {onRemoveTreat && (
                  <button
                    onClick={() => onRemoveTreat(treat.treat_id)}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: '#A41E34',
                      cursor: 'pointer',
                      fontSize: '18px',
                      padding: '4px 8px',
                      lineHeight: 1
                    }}
                    title="Remove"
                  >
                    ×
                  </button>
                )}
              </div>
            </div>
          ))}
          
          <div className="cart-divider" />
          
          <div className="cart-item">
            <span>Subtotal</span>
            <span data-testid="cart-subtotal">${subtotal.toFixed(2)}</span>
          </div>
          {subscriptionPlan && subscriptionDiscount > 0 && (
            <div className="cart-item" style={{ color: '#2E7D32' }}>
              <span>Subscription Discount (5%)</span>
              <span>-${subscriptionDiscount.toFixed(2)}</span>
            </div>
          )}
          {promoDiscount > 0 && (
            <div className="cart-item" style={{ color: '#228B22' }}>
              <span>Promo Discount</span>
              <span>-${promoDiscount.toFixed(2)}</span>
            </div>
          )}
          <div className="cart-item">
            <span>Tax (13%)</span>
            <span data-testid="cart-tax">${tax.toFixed(2)}</span>
          </div>
          <div className="cart-total">
            <span>Total</span>
            <span data-testid="cart-total">${(total - promoDiscount).toFixed(2)}</span>
          </div>
          
          {/* Promo Code Section */}
          <div style={{ marginTop: '16px', padding: '16px 0', borderTop: '1px solid #E8DDD0' }}>
            <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', marginBottom: '8px' }}>Promo Code</label>
            <div style={{ display: 'flex', gap: '8px' }}>
              <input
                type="text"
                value={promoCode}
                onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
                placeholder="Enter code"
                style={{
                  flex: 1,
                  padding: '10px 12px',
                  border: '2px solid #D8CFB8',
                  borderRadius: '8px',
                  fontSize: '14px'
                }}
              />
              <button
                type="button"
                onClick={applyPromo}
                style={{
                  padding: '10px 16px',
                  background: '#A41E34',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '14px',
                  fontWeight: '600',
                  cursor: 'pointer'
                }}
              >
                Apply
              </button>
            </div>
            {promoError && <p style={{ color: '#D32F2F', fontSize: '12px', marginTop: '4px' }}>{promoError}</p>}
          </div>

          {/* Special Instructions */}
          <div style={{ marginTop: '16px' }}>
            <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', marginBottom: '8px' }}>Special Instructions</label>
            <textarea
              value={specialInstructions}
              onChange={(e) => setSpecialInstructions(e.target.value)}
              placeholder="Any special requests?"
              rows={2}
              style={{
                width: '100%',
                padding: '10px 12px',
                border: '2px solid #D8CFB8',
                borderRadius: '8px',
                fontSize: '14px',
                fontFamily: 'inherit',
                resize: 'vertical'
              }}
            />
          </div>

          {/* Subscribe & Save — bottom of cart, seamless */}
          {onSubscriptionChange && (
            <label
              data-testid="cart-subscribe-save"
              style={{
                marginTop: '20px',
                display: 'flex',
                alignItems: 'flex-start',
                gap: '12px',
                padding: '14px 16px',
                background: '#E8DFC8',
                border: '1px solid #D8CFB8',
                borderRadius: '12px',
                cursor: 'pointer'
              }}
            >
              <input
                type="checkbox"
                checked={!!subscriptionPlan}
                onChange={(e) => onSubscriptionChange(e.target.checked ? 'every_2_weeks' : null)}
                data-testid="cart-subscribe-checkbox"
                style={{ marginTop: '2px', accentColor: '#3B2A1A', width: '18px', height: '18px' }}
              />
              <div style={{ flex: 1 }}>
                <div style={{ fontFamily: "'Barlow Semi Condensed', sans-serif", fontSize: '14px', fontWeight: 700, color: '#3B2A1A' }}>
                  Save extra ${(subtotal * SUBSCRIPTION_DISCOUNT).toFixed(2)} — subscribe &amp; save 5%
                </div>
                <div style={{ fontFamily: "'Barlow Semi Condensed', sans-serif", fontSize: '12px', color: '#6A4F35', marginTop: '2px' }}>
                  Free delivery. Pause, skip, or cancel anytime.
                </div>
              </div>
            </label>
          )}
        </div>
        
        <div className="cart-drawer-footer">
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <button
              type="button"
              onClick={onClose}
              data-testid="cart-add-items"
              style={{
                background: 'transparent',
                border: '1.5px solid #3B2A1A',
                color: '#3B2A1A',
                padding: '12px 18px',
                borderRadius: '999px',
                fontFamily: "'Barlow Semi Condensed', sans-serif",
                fontSize: '13px',
                fontWeight: 700,
                cursor: 'pointer',
                letterSpacing: '0.02em'
              }}
            >
              + Add items
            </button>
            <button
              className="btn-primary"
              onClick={onProceed}
              disabled={!canCheckout}
              data-testid="cart-proceed-checkout"
              style={{
                background: canCheckout ? '#3B2A1A' : '#A89B7C',
                color: '#F5F3EF',
                padding: '14px 22px',
                border: 'none',
                borderRadius: '999px',
                fontFamily: "'Barlow Semi Condensed', sans-serif",
                fontSize: '15px',
                fontWeight: 700,
                cursor: canCheckout ? 'pointer' : 'not-allowed',
                letterSpacing: 0,
                textTransform: 'none'
              }}
            >
              {canCheckout ? 'Go to checkout' : 'Add a box to your basket'}
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export const CartPopup = CartDrawer;

export const TreatsSection = ({ selectedTreats, onToggleTreat, petType = 'dog', navigate, hideHeader = false, showCategoryDescriptions = false, onOpenTreat = null }) => {
  const [treats, setTreats] = useState([]);

  useEffect(() => {
    const loadTreats = async () => {
      try {
        const { data } = await axios.get(`${API}/treats`);
        const filteredTreats = data.filter(t => t.pet_type === petType);
        setTreats(filteredTreats);
      } catch (error) {
        console.error('Failed to load treats:', error);
      }
    };
    loadTreats();
  }, [petType]);

  if (treats.length === 0) return null;

  const isDog = petType !== 'cat';

  // Categorize each treat by name → "Heads and Feet" if name contains head/feet/foot, else "Meaty Treats"
  const isHeadsAndFeet = (name) => /head|feet|foot/i.test(name);
  const meatyTreats = treats.filter(t => !isHeadsAndFeet(t.name));
  const headsAndFeet = treats.filter(t => isHeadsAndFeet(t.name));

  const subCategories = [
    {
      key: 'meaty',
      title: 'Meaty Treats',
      desc: isDog
        ? 'Slow-chew bones and chunks rich in marrow, cartilage and muscle — built to satisfy and support dental health.'
        : 'Bite-sized whole-muscle treats designed for natural prey instinct and dental support.',
      items: meatyTreats
    },
    {
      key: 'heads',
      title: 'Heads and Feet',
      desc: isDog
        ? 'Whole-prey heads and feet — rich in cartilage, glucosamine and natural enrichment for serious chewers.'
        : 'Tiny heads and feet for natural chewing, cartilage and mental enrichment.',
      items: headsAndFeet
    }
  ].filter(sc => sc.items.length > 0);

  const renderTreatCard = (treat) => {
    const selectedTreat = selectedTreats.find(t => t.treat_id === treat.treat_id);
    const quantity = selectedTreat ? selectedTreat.quantity : 0;
    const goToTreat = () => {
      if (onOpenTreat) { onOpenTreat(treat.treat_id); return; }
      if (!navigate) return;
      const root = document.getElementById('root');
      const scrollPos = root ? root.scrollTop : window.scrollY;
      sessionStorage.setItem('menuScrollPosition', scrollPos.toString());
      navigate(`/treat/${treat.treat_id}`);
    };
    const clickable = !!(navigate || onOpenTreat);
    return (
      <div
        key={treat.treat_id}
        className={`product-card-row ${quantity > 0 ? 'is-selected' : ''}`}
        data-testid={`treat-${treat.treat_id}`}
        onClick={clickable ? goToTreat : undefined}
        role={clickable ? 'button' : undefined}
        tabIndex={clickable ? 0 : undefined}
      >
        {/* Stacked content — content first so image ends up on the right on desktop */}
        <div className="product-card-content">
          <h4 className="product-card-title">{treat.name}</h4>
          <p className="product-card-desc">{treat.quantity_description}</p>
          <div className="product-card-meta">
            <div className="product-card-price">
              <span className="price-regular">${treat.price.toFixed(2)}</span>
            </div>
            {clickable && (
              <button
                className="product-card-more"
                onClick={(e) => { e.stopPropagation(); goToTreat(); }}
                data-testid={`learn-more-treat-${treat.treat_id}`}
              >
                See more
              </button>
            )}
          </div>
        </div>

        {/* Image — on the right (desktop), on top (mobile) */}
        <div className="product-card-media">
          {treat.images && treat.images.length > 0 ? (
            <img
              src={treat.images[0]}
              alt={treat.name}
              onError={(e) => { e.target.style.opacity = '0.4'; }}
            />
          ) : (
            <div style={{ width: '100%', height: '100%', background: '#E8DFC8' }} />
          )}

          {/* + / qty pill — bottom right of image */}
          {quantity === 0 ? (
            <button
              className="product-card-plus"
              onClick={(e) => { e.stopPropagation(); onToggleTreat(treat, 1); }}
              data-testid={`add-treat-${treat.treat_id}`}
              aria-label="Add to box"
            >
              +
            </button>
          ) : (
            <div className="product-card-qty-pill" onClick={(e) => e.stopPropagation()}>
              <button
                className="qty-btn-mini"
                onClick={(e) => { e.stopPropagation(); onToggleTreat(treat, quantity - 1); }}
                aria-label="Decrease"
              >
                −
              </button>
              <span className="qty-display-mini">{quantity}</span>
              <button
                className="qty-btn-mini"
                onClick={(e) => { e.stopPropagation(); onToggleTreat(treat, quantity + 1); }}
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

  // Banner images — same style as meal collections (image + overlay text)
  const TREATS_BANNER = {
    dog: 'https://customer-assets.emergentagent.com/job_c26be434-5664-4617-995c-8c836934bef5/artifacts/1olxgtz6_3.png',
    cat: 'https://customer-assets.emergentagent.com/job_c26be434-5664-4617-995c-8c836934bef5/artifacts/7fyd6l6l_4.png'
  };
  const SUBCAT_BANNER = {
    meaty: 'https://customer-assets.emergentagent.com/job_c26be434-5664-4617-995c-8c836934bef5/artifacts/wtts10dz_4.png',
    heads: 'https://customer-assets.emergentagent.com/job_c26be434-5664-4617-995c-8c836934bef5/artifacts/u0taocl0_6.png'
  };

  return (
    <div className="treats-section menu-collection">
      {/* Outer page title — hidden on dedicated treats tab (caller provides one) */}
      {!hideHeader && (
        <div className="menu-collection-header menu-collection-header--banner" data-testid="collection-header-treats">
          <div
            className="menu-collection-banner menu-collection-banner--overlay"
            style={{ backgroundImage: `url(${TREATS_BANNER[isDog ? 'dog' : 'cat']})` }}
          >
            <div className="menu-collection-banner-text">
              <h3 className="menu-collection-title">Raw {isDog ? 'Dog' : 'Cat'} Treats</h3>
              <p className="menu-collection-desc">
                {isDog
                  ? 'Enriching raw treats that support dental health, mental stimulation, and natural chewing.'
                  : "Natural whole-prey treats designed to support your cat's instinct to hunt and chew."}
              </p>
            </div>
          </div>
        </div>
      )}

      {subCategories.map(sc => (
        <div key={sc.key} className="treats-subcategory" style={{ marginTop: '28px' }}>
          <div className="menu-collection-header treats-subcat-header" data-testid={`treats-subcat-${sc.key}`}>
            <h4 className="menu-collection-title treats-subcat-title">{sc.title}</h4>
            {showCategoryDescriptions && (
              <p className="menu-collection-desc treats-subcat-desc">{sc.desc}</p>
            )}
          </div>
          <div className="product-grid">
            {sc.items.map(renderTreatCard)}
          </div>
        </div>
      ))}
    </div>
  );
};

// Address Autocomplete Component with Google Places
const AddressAutocomplete = ({ value, onChange, onSelect }) => {
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [loading, setLoading] = useState(false);
  const debounceRef = useRef(null);

  const fetchSuggestions = useCallback(async (input) => {
    if (!input || input.length < 3) {
      setSuggestions([]);
      return;
    }

    setLoading(true);
    try {
      const { data } = await axios.post(`${API}/places/autocomplete`, { input });
      setSuggestions(data.predictions || []);
      setShowSuggestions(true);
    } catch (error) {
      console.error('Failed to fetch address suggestions:', error);
      setSuggestions([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const handleInputChange = (e) => {
    const newValue = e.target.value;
    onChange(newValue);
    
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => fetchSuggestions(newValue), 300);
  };

  const handleSelectSuggestion = async (suggestion) => {
    onChange(suggestion.description);
    setShowSuggestions(false);
    
    try {
      const { data } = await axios.get(`${API}/places/details`, {
        params: { placeId: suggestion.place_id }
      });
      onSelect(data);
    } catch (error) {
      onSelect({ address: suggestion.description });
    }
  };

  return (
    <div className="address-autocomplete">
      <input
        type="text"
        value={value}
        onChange={handleInputChange}
        onFocus={() => suggestions.length > 0 && setShowSuggestions(true)}
        onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
        placeholder="Start typing your street address..."
        data-testid="address-street-autocomplete"
      />
      {loading && <div className="address-loading">Searching...</div>}
      {showSuggestions && suggestions.length > 0 && (
        <div className="address-suggestions">
          {suggestions.map((suggestion, idx) => (
            <button
              key={idx}
              type="button"
              className="address-suggestion"
              onClick={() => handleSelectSuggestion(suggestion)}
            >
              <div className="suggestion-main">{suggestion.main_text}</div>
              <div className="suggestion-secondary">{suggestion.secondary_text}</div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

// Delivery Date Selector Component
const DeliveryDateSelector = ({ value, onChange }) => {
  const getMinDate = () => {
    const date = new Date();
    date.setDate(date.getDate() + 3);
    return date.toISOString().split('T')[0];
  };

  const getMaxDate = () => {
    const date = new Date();
    date.setDate(date.getDate() + 30);
    return date.toISOString().split('T')[0];
  };

  const formatDateDisplay = (dateStr) => {
    if (!dateStr) return '';
    const date = new Date(dateStr + 'T00:00:00');
    return date.toLocaleDateString('en-US', { 
      weekday: 'long', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  return (
    <div className="delivery-date-selector">
      <input
        type="date"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        min={getMinDate()}
        max={getMaxDate()}
        data-testid="delivery-date"
      />
      {value && (
        <p className="delivery-date-display">
          Delivery: <strong>{formatDateDisplay(value)}</strong>
        </p>
      )}
    </div>
  );
};

// Stripe Element Styles
const stripeElementStyle = {
  base: {
    fontSize: '16px',
    color: '#2C2C2C',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    '::placeholder': { color: '#999' },
  },
  invalid: {
    color: '#C33',
  },
};

export const CheckoutForm = ({ boxSize, selectedProteins, selectedTreats, products, onSuccess, subscriptionPlan: initialSubscriptionPlan, basket = [] }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [paymentRequest, setPaymentRequest] = useState(null);
  const [canMakePayment, setCanMakePayment] = useState(false);
  
  // Customer Info
  const [customerName, setCustomerName] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  
  // Address Fields (separate)
  const [streetAddress, setStreetAddress] = useState('');
  const [unit, setUnit] = useState('');
  const [city, setCity] = useState('');
  const [province, setProvince] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [country, setCountry] = useState('Canada');
  
  // Other fields
  const [deliveryDate, setDeliveryDate] = useState('');
  // Use subscription plan from cart if provided, otherwise allow toggling
  const [isSubscription, setIsSubscription] = useState(!!initialSubscriptionPlan);
  const [subscriptionFrequency, setSubscriptionFrequency] = useState(initialSubscriptionPlan || 'monthly');
  const [orderNotes, setOrderNotes] = useState('');

  // Per-item subscription pre-selection — defaults to ALL items when subscription toggled
  const allItemIds = [
    ...Object.entries(selectedProteins).filter(([, d]) => d.qty > 0).map(([id]) => `p:${id}`),
    ...selectedTreats.map(t => `t:${t.treat_id}`)
  ];
  const [subscriptionItems, setSubscriptionItems] = useState(allItemIds);
  const toggleSubItem = (id) => {
    setSubscriptionItems(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  };

  const discount = DISCOUNT_RATES[boxSize] || 0;

  // Setup Payment Request Button for Apple Pay / Google Pay
  useEffect(() => {
    if (!stripe) return;

    const subtotal = calculateSubtotal();
    const tax = subtotal * 0.13;
    const total = subtotal + tax;

    const pr = stripe.paymentRequest({
      country: 'CA',
      currency: 'cad',
      total: {
        label: 'FoeGuard Order',
        amount: Math.round(total * 100),
      },
      requestPayerName: true,
      requestPayerEmail: true,
      requestPayerPhone: true,
      requestShipping: true,
      shippingOptions: [
        {
          id: 'standard',
          label: 'Standard Delivery',
          detail: 'Delivered within 3-5 days',
          amount: 0,
        },
      ],
    });

    pr.canMakePayment().then((result) => {
      if (result) {
        setPaymentRequest(pr);
        setCanMakePayment(true);
      }
    });

    pr.on('paymentmethod', async (ev) => {
      try {
        const subtotal = calculateSubtotal();
        const tax = subtotal * 0.13;
        const total = subtotal + tax;

        // Create payment intent
        const { data } = await axios.post(`${API}/create-payment-intent`, {
          amount: Math.round(total * 100),
          customer_email: ev.payerEmail,
        });

        // Confirm payment
        const { error: confirmError } = await stripe.confirmCardPayment(
          data.client_secret,
          { payment_method: ev.paymentMethod.id },
          { handleActions: false }
        );

        if (confirmError) {
          ev.complete('fail');
          setError(confirmError.message);
        } else {
          ev.complete('success');
          
          // Save order
          await axios.post(`${API}/confirm-order`, {
            payment_intent_id: data.payment_intent_id,
            customer_name: ev.payerName,
            customer_email: ev.payerEmail,
            customer_phone: ev.payerPhone,
            shipping_address: ev.shippingAddress,
            box_size: boxSize,
            selected_proteins: selectedProteins,
            selected_treats: selectedTreats,
            delivery_date: deliveryDate,
            is_subscription: isSubscription,
            subscription_frequency: subscriptionFrequency,
          });
          
          onSuccess();
        }
      } catch (error) {
        ev.complete('fail');
        setError(error.message);
      }
    });
  }, [stripe, boxSize, selectedProteins, selectedTreats, deliveryDate, isSubscription, subscriptionFrequency]);

  // Handle address selection from Google Places
  const handleAddressSelect = (details) => {
    if (details.street) setStreetAddress(details.street);
    if (details.city) setCity(details.city);
    if (details.state) setProvince(details.state);
    if (details.zipCode) setPostalCode(details.zipCode);
    if (details.country) setCountry(details.country);
  };

  const calculateSubtotal = () => {
    let total = 0;
    basket.forEach(box => {
      const d = box.discount || 0;
      Object.entries(box.proteins || {}).forEach(([productId, data]) => {
        if (data.qty > 0) {
          const product = products.find(p => p.product_id === productId);
          if (product) {
            const basePrice = product.pricing.find(p => p.size_lb === 6)?.price || 0;
            total += basePrice * (1 - d) * (data.qty / 6);
          }
        }
      });
    });
    selectedTreats.forEach(treat => { total += treat.price * (treat.quantity || 1); });
    return total;
  };
  const basketLbs = basket.reduce((s, b) => s + Object.values(b.proteins || {}).reduce((a, d) => a + (d.qty || 0), 0), 0);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!stripe || !elements) return;
    
    // Validate required fields
    if (!deliveryDate) {
      setError('Please select a delivery date');
      return;
    }
    if (!streetAddress || !city || !province || !postalCode) {
      setError('Please fill in all address fields');
      return;
    }
    
    setLoading(true);
    setError(null);

    try {
      const subtotal = calculateSubtotal();
      const tax = subtotal * 0.13;
      let total = subtotal + tax;
      
      // Apply 5% subscription discount
      if (isSubscription) {
        total = total * (1 - SUBSCRIPTION_DISCOUNT);
      }

      const fullAddress = `${streetAddress}${unit ? ', ' + unit : ''}, ${city}, ${province} ${postalCode}, ${country}`;

      const proteinsArray = basket.flatMap(box =>
        Object.entries(box.proteins || {})
          .filter(([_, data]) => data.qty > 0)
          .map(([productId, data]) => {
            const product = products.find(p => p.product_id === productId);
            const basePrice = product?.pricing.find(p => p.size_lb === 6)?.price || 0;
            const d = box.discount || 0;
            return {
              product_id: productId,
              product_name: data.name,
              protein_type: product?.protein_type,
              quantity_lb: data.qty,
              price: basePrice * (1 - d) * (data.qty / 6)
            };
          })
      );

      const checkoutData = {
        customer_email: customerEmail,
        customer_name: customerName,
        customer_phone: customerPhone,
        shipping_address: fullAddress,
        address_details: {
          street: streetAddress,
          unit,
          city,
          province,
          postal_code: postalCode,
          country
        },
        delivery_date: deliveryDate,
        box_size_lb: basketLbs || boxSize,
        proteins: proteinsArray,
        treats: selectedTreats.map(t => ({ treat_id: t.treat_id, name: t.name, quantity: t.quantity || 1, price: t.price })),
        subtotal, 
        tax, 
        total,
        box_discount: 0,
        is_subscription: isSubscription,
        subscription_frequency: isSubscription ? subscriptionFrequency : null,
        order_notes: orderNotes
      };

      const { data } = await axios.post(`${API}/create-payment-intent`, checkoutData);
      
      const cardNumberElement = elements.getElement(CardNumberElement);
      
      const { error: stripeError, paymentIntent } = await stripe.confirmCardPayment(data.clientSecret, {
        payment_method: { 
          card: cardNumberElement, 
          billing_details: { 
            name: customerName, 
            email: customerEmail,
            phone: customerPhone,
            address: {
              line1: streetAddress,
              line2: unit,
              city: city,
              state: province,
              postal_code: postalCode,
              country: country === 'Canada' ? 'CA' : 'US'
            }
          } 
        }
      });

      if (stripeError) {
        setError(stripeError.message);
        setLoading(false);
        return;
      }

      if (paymentIntent.status === 'succeeded') {
        await axios.post(`${API}/confirm-order`, { payment_intent_id: paymentIntent.id });
        onSuccess();
      }
    } catch (err) {
      setError(err.response?.data?.detail || 'Payment failed. Please try again.');
      setLoading(false);
    }
  };

  const subtotal = calculateSubtotal();
  const tax = subtotal * 0.13;
  let total = subtotal + tax;
  if (isSubscription) total = total * (1 - SUBSCRIPTION_DISCOUNT);

  // Canadian Provinces
  const provinces = [
    'Alberta', 'British Columbia', 'Manitoba', 'New Brunswick', 
    'Newfoundland and Labrador', 'Nova Scotia', 'Ontario', 
    'Prince Edward Island', 'Quebec', 'Saskatchewan',
    'Northwest Territories', 'Nunavut', 'Yukon'
  ];

  return (
    <form onSubmit={handleSubmit} className="checkout-form" data-testid="checkout-form">
      <div style={{ textAlign: 'center', marginBottom: '32px' }}>
        <h2 style={{ fontSize: '32px', marginBottom: '8px' }}>Checkout</h2>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', fontSize: '13px', color: '#888' }}>
          <span>Secure payment powered by</span>
          <span style={{ fontWeight: '700', color: '#635BFF', fontSize: '15px', letterSpacing: '-0.5px' }}>Stripe</span>
        </div>
      </div>
      
      {/* Order Summary */}
      <div className="checkout-summary">
        <h3>Order Summary</h3>
        {basket.map((box, bi) => {
          let boxTotal = 0;
          const d = box.discount || 0;
          Object.entries(box.proteins || {}).forEach(([pid, data]) => {
            const product = products.find(p => p.product_id === pid);
            const bp = product?.pricing.find(p => p.size_lb === 6)?.price || 0;
            boxTotal += bp * (1 - d) * (data.qty / 6);
          });
          return (
            <div key={box.id} className="checkout-summary-row">
              <span>Box {bi + 1} · {box.boxSize}lb {d > 0 && `(Save ${Math.round(d * 100)}%)`}</span>
              <span>${boxTotal.toFixed(2)}</span>
            </div>
          );
        })}
        {selectedTreats.length > 0 && (
          <div className="checkout-summary-row">
            <span>Treats ({selectedTreats.reduce((s, t) => s + (t.quantity || 1), 0)})</span>
            <span>${selectedTreats.reduce((s, t) => s + t.price * (t.quantity || 1), 0).toFixed(2)}</span>
          </div>
        )}
        <div className="checkout-summary-row">
          <span>Tax (13%)</span>
          <span>${tax.toFixed(2)}</span>
        </div>
        {isSubscription && (
          <div className="checkout-summary-row discount">
            <span>Subscription Discount (5%)</span>
            <span>-${((subtotal + tax) * SUBSCRIPTION_DISCOUNT).toFixed(2)}</span>
          </div>
        )}
        <div className="checkout-summary-total">
          <span>Total</span>
          <span>${total.toFixed(2)}</span>
        </div>
      </div>

      {/* Contact Info */}
      <div className="checkout-section">
        <h3>Contact Information</h3>
        <div className="form-group">
          <label>Full Name *</label>
          <input 
            type="text" 
            value={customerName} 
            onChange={(e) => setCustomerName(e.target.value)} 
            required 
            placeholder="John Smith"
            data-testid="customer-name" 
          />
        </div>
        <div className="form-row">
          <div className="form-group">
            <label>Email *</label>
            <input 
              type="email" 
              value={customerEmail} 
              onChange={(e) => setCustomerEmail(e.target.value)} 
              required 
              placeholder="john@example.com"
              data-testid="customer-email" 
            />
          </div>
          <div className="form-group">
            <label>Phone</label>
            <input 
              type="tel" 
              value={customerPhone} 
              onChange={(e) => setCustomerPhone(e.target.value)} 
              placeholder="+1 (555) 000-0000"
              data-testid="customer-phone" 
            />
          </div>
        </div>
      </div>

      {/* Shipping Address - Complete Fields */}
      <div className="checkout-section">
        <h3>Delivery Address</h3>
        <div className="form-group">
          <label>Street Address *</label>
          <AddressAutocomplete 
            value={streetAddress}
            onChange={setStreetAddress}
            onSelect={handleAddressSelect}
          />
        </div>
        <div className="form-group">
          <label>Apt, Suite, Unit (Optional)</label>
          <input 
            type="text" 
            value={unit} 
            onChange={(e) => setUnit(e.target.value)} 
            placeholder="Apt 4B"
            data-testid="address-unit" 
          />
        </div>
        <div className="form-row">
          <div className="form-group">
            <label>City *</label>
            <input 
              type="text" 
              value={city} 
              onChange={(e) => setCity(e.target.value)} 
              required 
              placeholder="Toronto"
              data-testid="address-city" 
            />
          </div>
          <div className="form-group">
            <label>Province *</label>
            <select 
              value={province} 
              onChange={(e) => setProvince(e.target.value)} 
              required
              data-testid="address-province"
            >
              <option value="">Select Province</option>
              {provinces.map(p => (
                <option key={p} value={p}>{p}</option>
              ))}
            </select>
          </div>
        </div>
        <div className="form-row">
          <div className="form-group">
            <label>Postal Code *</label>
            <input 
              type="text" 
              value={postalCode} 
              onChange={(e) => setPostalCode(e.target.value.toUpperCase())} 
              required 
              placeholder="M5V 1A1"
              maxLength={7}
              data-testid="address-postal" 
            />
          </div>
          <div className="form-group">
            <label>Country *</label>
            <select 
              value={country} 
              onChange={(e) => setCountry(e.target.value)} 
              required
              data-testid="address-country"
            >
              <option value="Canada">Canada</option>
              <option value="United States">United States</option>
            </select>
          </div>
        </div>
      </div>

      {/* Delivery Date */}
      <div className="checkout-section">
        <h3>Delivery Date</h3>
        <p className="checkout-note">Select your preferred delivery date (minimum 3 days from order date)</p>
        <div className="form-group">
          <DeliveryDateSelector 
            value={deliveryDate}
            onChange={setDeliveryDate}
          />
        </div>
      </div>

      {/* Subscription Option */}
      <div className="subscription-option">
        <label className="subscription-label">
          <input 
            type="checkbox" 
            checked={isSubscription}
            onChange={(e) => setIsSubscription(e.target.checked)}
            className="subscription-checkbox"
            data-testid="subscription-toggle"
          />
          <div className="subscription-info" style={{ marginLeft: '12px' }}>
            <strong>Subscribe & Save 5%</strong>
            <p style={{ marginTop: '4px' }}>Get recurring deliveries with free shipping. Pause or cancel anytime.</p>
          </div>
        </label>
        
        {isSubscription && (
          <div className="subscription-frequency" style={{ marginTop: '16px', paddingLeft: '40px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', fontSize: '14px' }}>
              Delivery Frequency:
            </label>
            <div style={{ display: 'flex', gap: '12px' }}>
              <label className={`frequency-option ${subscriptionFrequency === 'biweekly' ? 'active' : ''}`} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <input
                  type="radio"
                  name="frequency"
                  value="biweekly"
                  checked={subscriptionFrequency === 'biweekly'}
                  onChange={(e) => setSubscriptionFrequency(e.target.value)}
                />
                <span>Biweekly</span>
              </label>
              <label className={`frequency-option ${subscriptionFrequency === 'monthly' ? 'active' : ''}`} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <input
                  type="radio"
                  name="frequency"
                  value="monthly"
                  checked={subscriptionFrequency === 'monthly'}
                  onChange={(e) => setSubscriptionFrequency(e.target.value)}
                />
                <span>Monthly</span>
              </label>
            </div>

            {/* Per-item subscription pre-select */}
            {(Object.values(selectedProteins).some(d => d.qty > 0) || selectedTreats.length > 0) && (
              <div data-testid="subscription-items" style={{ marginTop: '16px' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', fontSize: '14px' }}>
                  Subscribe to these items:
                </label>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  {Object.entries(selectedProteins).filter(([, d]) => d.qty > 0).map(([pid, d]) => (
                    <label key={pid} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', color: '#3B2A1A' }}>
                      <input
                        type="checkbox"
                        checked={subscriptionItems.includes(`p:${pid}`)}
                        onChange={() => toggleSubItem(`p:${pid}`)}
                        data-testid={`sub-item-${pid}`}
                      />
                      <span>{d.name} <span style={{ color: '#6A4F35' }}>· {d.qty}lb</span></span>
                    </label>
                  ))}
                  {selectedTreats.map(t => (
                    <label key={t.treat_id} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', color: '#3B2A1A' }}>
                      <input
                        type="checkbox"
                        checked={subscriptionItems.includes(`t:${t.treat_id}`)}
                        onChange={() => toggleSubItem(`t:${t.treat_id}`)}
                        data-testid={`sub-item-${t.treat_id}`}
                      />
                      <span>{t.name} <span style={{ color: '#6A4F35' }}>· x{t.quantity || 1}</span></span>
                    </label>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Order/Delivery Notes */}
      <div className="checkout-section">
        <h3>Delivery</h3>
        <p className="checkout-note">Any special requests for your order or delivery?</p>
        <div className="form-group">
          <textarea
            value={orderNotes}
            onChange={(e) => setOrderNotes(e.target.value)}
            placeholder="e.g., Leave at back door, ring doorbell, remove certain ingredients..."
            rows={3}
            style={{
              width: '100%',
              padding: '14px 16px',
              border: '2px solid #D8CFB8',
              borderRadius: '12px',
              fontSize: '16px',
              fontFamily: 'inherit',
              resize: 'vertical'
            }}
            data-testid="order-notes"
          />
        </div>
      </div>

      {/* Payment - Separate Card Fields */}
      <div className="checkout-section" style={{ borderBottom: 'none' }}>
        <h3>Payment Details</h3>
        
        {/* Apple Pay / Google Pay Button */}
        {canMakePayment && paymentRequest && (
          <div style={{ marginBottom: '24px' }}>
            <PaymentRequestButtonElement
              options={{ paymentRequest }}
              style={{
                paymentRequestButton: {
                  type: 'default',
                  theme: 'dark',
                  height: '48px',
                },
              }}
            />
            <div style={{ 
              textAlign: 'center', 
              margin: '16px 0', 
              color: '#666', 
              fontSize: '14px',
              position: 'relative',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '12px'
            }}>
              <div style={{ flex: 1, height: '1px', background: '#E8DDD0' }} />
              <span>or pay with card</span>
              <div style={{ flex: 1, height: '1px', background: '#E8DDD0' }} />
            </div>
          </div>
        )}
        
        <div className="form-group">
          <label>Card Number *</label>
          <div className="stripe-element-wrapper">
            <CardNumberElement options={{ style: stripeElementStyle }} />
          </div>
        </div>
        <div className="form-row">
          <div className="form-group">
            <label>Expiry Date *</label>
            <div className="stripe-element-wrapper">
              <CardExpiryElement options={{ style: stripeElementStyle }} />
            </div>
          </div>
          <div className="form-group">
            <label>CVC *</label>
            <div className="stripe-element-wrapper">
              <CardCvcElement options={{ style: stripeElementStyle }} />
            </div>
          </div>
        </div>
        <p className="checkout-note" style={{ marginTop: '8px', fontSize: '12px', color: '#666' }}>
          🔒 Your payment info is secure and encrypted
        </p>
      </div>

      {error && (
        <div className="checkout-error" data-testid="payment-error">
          {error}
        </div>
      )}
      
      <button 
        type="submit" 
        className="btn-primary checkout-submit" 
        disabled={!stripe || loading} 
        data-testid="submit-payment"
      >
        {loading ? 'Processing...' : `Pay $${total.toFixed(2)}`}
      </button>
    </form>
  );
};

export const OrderSuccess = () => {
  const navigate = useNavigate();
  return (
    <div className="order-success" data-testid="order-success">
      <div className="success-icon">✓</div>
      <h1 style={{ fontSize: '36px', color: '#556B2F', marginBottom: '16px' }}>Order Confirmed!</h1>
      <p style={{ fontSize: '18px', color: '#666', marginBottom: '30px' }}>
        Thank you for your order. You&apos;ll receive a confirmation email shortly.
      </p>
      <button 
        className="btn-primary" 
        onClick={() => navigate('/')} 
        style={{ maxWidth: '300px', margin: '0 auto' }} 
        data-testid="back-to-home"
      >
        Back to Home
      </button>
    </div>
  );
};
