import React, { useState, useEffect, useRef, useCallback } from 'react';
import axios from 'axios';
import { useStripe, useElements, CardNumberElement, CardExpiryElement, CardCvcElement } from '@stripe/react-stripe-js';
import { useNavigate } from 'react-router-dom';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

// Discount rates by box size
const DISCOUNT_RATES = {
  12: 0,
  18: 0.05,
  24: 0.10,
  30: 0.15
};

// Cart Drawer Component (slide-in from right)
export const CartDrawer = ({ isOpen, onClose, boxSize, selectedProteins, selectedTreats, products, onProceed, getDiscountedPrice, getBasePrice }) => {
  const [promoCode, setPromoCode] = useState('');
  const [promoDiscount, setPromoDiscount] = useState(0);
  const [specialInstructions, setSpecialInstructions] = useState('');
  const [promoError, setPromoError] = useState('');

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
  const calculateSubtotal = () => {
    let total = 0;
    const discount = DISCOUNT_RATES[boxSize] || 0;
    
    Object.entries(selectedProteins).forEach(([productId, data]) => {
      if (data.qty > 0) {
        const product = products.find(p => p.product_id === productId);
        if (product) {
          const basePrice = getBasePrice ? getBasePrice(product) : product.pricing.find(p => p.size_lb === 6)?.price || 0;
          const pricePerSixLb = basePrice * (1 - discount);
          const quantity = data.qty / 6;
          total += pricePerSixLb * quantity;
        }
      }
    });
    selectedTreats.forEach(treat => { total += treat.price; });
    return total;
  };

  const subtotal = calculateSubtotal();
  const tax = subtotal * 0.13;
  const total = subtotal + tax;
  const getTotalProteins = () => Object.values(selectedProteins).reduce((sum, data) => sum + data.qty, 0);
  const isBoxComplete = getTotalProteins() === boxSize;
  const discount = DISCOUNT_RATES[boxSize] || 0;

  return (
    <>
      <div className={`cart-drawer-overlay ${isOpen ? 'open' : ''}`} onClick={onClose} />
      <div className={`cart-drawer ${isOpen ? 'open' : ''}`} data-testid="cart-drawer">
        <div className="cart-drawer-header">
          <h3 style={{ fontSize: '24px', color: '#8B4513', margin: 0 }}>Your Box</h3>
          <button onClick={onClose} className="cart-close-btn">×</button>
        </div>
        
        <div className="cart-drawer-content">
          <div className="cart-box-info">
            <span className="cart-box-size">{boxSize}lb Box</span>
            <span className="cart-box-progress">({getTotalProteins()}lb selected)</span>
            {discount > 0 && (
              <span className="cart-discount-badge">{discount * 100}% off</span>
            )}
          </div>
          
          {Object.entries(selectedProteins).map(([productId, data]) => {
            if (data.qty === 0) return null;
            const product = products.find(p => p.product_id === productId);
            if (!product) return null;
            const basePrice = getBasePrice ? getBasePrice(product) : product.pricing.find(p => p.size_lb === 6)?.price || 0;
            const pricePerSixLb = basePrice * (1 - discount);
            const quantity = data.qty / 6;
            const itemTotal = pricePerSixLb * quantity;
            
            return (
              <div key={productId} className="cart-item" data-testid={`cart-item-${productId}`}>
                <span>{data.name} ({data.qty}lb)</span>
                <span>${itemTotal.toFixed(2)}</span>
              </div>
            );
          })}
          
          {selectedTreats.map(treat => (
            <div key={treat.treat_id} className="cart-item" data-testid={`cart-treat-${treat.treat_id}`}>
              <span>{treat.name}</span>
              <span>${treat.price.toFixed(2)}</span>
            </div>
          ))}
          
          <div className="cart-divider" />
          
          <div className="cart-item">
            <span>Subtotal</span>
            <span data-testid="cart-subtotal">${subtotal.toFixed(2)}</span>
          </div>
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
                  border: '2px solid #D9C8B3',
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
                border: '2px solid #D9C8B3',
                borderRadius: '8px',
                fontSize: '14px',
                fontFamily: 'inherit',
                resize: 'vertical'
              }}
            />
          </div>
        </div>
        
        <div className="cart-drawer-footer">
          <button 
            className="btn-primary"
            onClick={onProceed}
            disabled={!isBoxComplete}
            data-testid="cart-proceed-checkout"
          >
            {isBoxComplete ? 'Proceed to Checkout' : `Add ${boxSize - getTotalProteins()}lb more`}
          </button>
        </div>
      </div>
    </>
  );
};

export const CartPopup = CartDrawer;

export const TreatsSection = ({ selectedTreats, onToggleTreat, petType = 'dog', navigate }) => {
  const [treats, setTreats] = useState([]);

  useEffect(() => {
    const loadTreats = async () => {
      try {
        const { data } = await axios.get(`${API}/treats`);
        // Filter treats by pet type
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
  const treatColor = isDog ? '#8B6914' : '#6B5B73';

  return (
    <div className="treats-section">
      {/* Treats Banner */}
      <div style={{
        position: 'relative',
        height: '220px',
        borderRadius: '20px',
        overflow: 'hidden',
        marginBottom: '28px',
        marginTop: '40px',
        background: `linear-gradient(135deg, ${treatColor} 0%, ${treatColor}dd 100%)`
      }}>
        <div style={{
          position: 'absolute',
          inset: 0,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          padding: '32px 40px'
        }}>
          <span style={{
            display: 'inline-block',
            background: treatColor,
            color: '#fff',
            fontSize: '11px',
            fontWeight: '600',
            padding: '4px 12px',
            borderRadius: '20px',
            marginBottom: '12px',
            width: 'fit-content',
            textTransform: 'uppercase',
            letterSpacing: '0.5px',
            border: '1px solid rgba(255,255,255,0.3)'
          }}>Optional Add-On</span>
          <h3 style={{
            fontFamily: 'Fraunces, Georgia, serif',
            fontSize: '32px',
            fontWeight: '600',
            color: '#FFFFFF',
            margin: '0 0 12px 0'
          }}>Raw {isDog ? 'Dog' : 'Cat'} Treats</h3>
          <p style={{
            color: 'rgba(255,255,255,0.95)',
            fontSize: '15px',
            margin: '0 0 12px 0',
            maxWidth: '450px',
            lineHeight: '1.6'
          }}>{isDog 
            ? 'Whole prey raw treats that support dental health, mental stimulation, and natural chewing.'
            : 'Natural whole prey treats designed to support your cat\'s instinct to hunt and chew.'
          }</p>
          <p style={{
            color: 'rgba(255,255,255,0.85)',
            fontSize: '13px',
            margin: 0,
            maxWidth: '450px',
            lineHeight: '1.5'
          }}><strong>For:</strong> {isDog ? 'Dogs' : 'Cats'} of all life stages. Ideal for treats, enrichment, or dental support.</p>
        </div>
      </div>

      <div className="treats-grid">
        {treats.map(treat => (
          <div 
            key={treat.treat_id} 
            className={`treat-item ${selectedTreats.some(t => t.treat_id === treat.treat_id) ? 'selected' : ''}`}
            data-testid={`treat-${treat.treat_id}`}
            style={{ position: 'relative', paddingRight: '110px' }}
          >
            <div 
              className="treat-clickable"
              onClick={() => onToggleTreat(treat)}
              style={{ cursor: 'pointer' }}
            >
              <div className="treat-info">
                <h4 style={{ fontSize: '16px', marginBottom: '4px', fontWeight: '600' }}>{treat.name}</h4>
                <p style={{ color: '#666', fontSize: '13px', margin: '0 0 8px 0' }}>{treat.quantity_description}</p>
                <span style={{ fontSize: '18px', fontWeight: '700', color: '#8B4513', display: 'block' }}>${treat.price.toFixed(2)}</span>
              </div>
              <div style={{ 
                position: 'absolute',
                right: '16px',
                top: '50%',
                transform: 'translateY(-50%)',
                display: 'flex', 
                flexDirection: 'column', 
                alignItems: 'center', 
                gap: '10px',
                width: '85px'
              }}>
                <div className={`treat-checkbox ${selectedTreats.some(t => t.treat_id === treat.treat_id) ? 'checked' : ''}`}>
                  {selectedTreats.some(t => t.treat_id === treat.treat_id) && '✓'}
                </div>
                {navigate && (
                  <button 
                    className="btn-learn-more-treat"
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/treat/${treat.treat_id}`);
                    }}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: treatColor,
                      fontSize: '13px',
                      fontWeight: '600',
                      cursor: 'pointer',
                      padding: '0',
                      textDecoration: 'underline',
                      textUnderlineOffset: '3px',
                      whiteSpace: 'nowrap'
                    }}
                  >
                    Learn More
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
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
    date.setDate(date.getDate() + 2);
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

export const CheckoutForm = ({ boxSize, selectedProteins, selectedTreats, products, onSuccess }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
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
  const [isSubscription, setIsSubscription] = useState(false);
  const [subscriptionFrequency, setSubscriptionFrequency] = useState('monthly');
  const [orderNotes, setOrderNotes] = useState('');
  const [specialInstructions, setSpecialInstructions] = useState('');
  const [promoCode, setPromoCode] = useState('');
  const [promoDiscount, setPromoDiscount] = useState(0);

  const discount = DISCOUNT_RATES[boxSize] || 0;

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
    Object.entries(selectedProteins).forEach(([productId, data]) => {
      if (data.qty > 0) {
        const product = products.find(p => p.product_id === productId);
        if (product) {
          const basePrice = product.pricing.find(p => p.size_lb === 6)?.price || 0;
          const pricePerSixLb = basePrice * (1 - discount);
          const quantity = data.qty / 6;
          total += pricePerSixLb * quantity;
        }
      }
    });
    selectedTreats.forEach(treat => { total += treat.price; });
    return total;
  };

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
      
      if (isSubscription) {
        total = total * 0.9;
      }

      const fullAddress = `${streetAddress}${unit ? ', ' + unit : ''}, ${city}, ${province} ${postalCode}, ${country}`;

      const proteinsArray = Object.entries(selectedProteins)
        .filter(([_, data]) => data.qty > 0)
        .map(([productId, data]) => {
          const product = products.find(p => p.product_id === productId);
          const basePrice = product.pricing.find(p => p.size_lb === 6)?.price || 0;
          const pricePerSixLb = basePrice * (1 - discount);
          const quantity = data.qty / 6;
          return {
            product_id: productId,
            product_name: data.name,
            protein_type: product.protein_type,
            quantity_lb: data.qty,
            price: pricePerSixLb * quantity
          };
        });

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
        box_size_lb: boxSize,
        proteins: proteinsArray,
        treats: selectedTreats.map(t => ({ treat_id: t.treat_id, name: t.name, quantity: 1, price: t.price })),
        subtotal, 
        tax, 
        total,
        box_discount: discount * 100,
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
  if (isSubscription) total = total * 0.9;

  // Canadian Provinces
  const provinces = [
    'Alberta', 'British Columbia', 'Manitoba', 'New Brunswick', 
    'Newfoundland and Labrador', 'Nova Scotia', 'Ontario', 
    'Prince Edward Island', 'Quebec', 'Saskatchewan',
    'Northwest Territories', 'Nunavut', 'Yukon'
  ];

  return (
    <form onSubmit={handleSubmit} className="checkout-form" data-testid="checkout-form">
      <h2 style={{ fontSize: '32px', marginBottom: '30px', textAlign: 'center' }}>Checkout</h2>
      
      {/* Order Summary */}
      <div className="checkout-summary">
        <h3>Order Summary</h3>
        <div className="checkout-summary-row">
          <span>{boxSize}lb Box {discount > 0 && `(${discount * 100}% off)`}</span>
          <span>${subtotal.toFixed(2)}</span>
        </div>
        <div className="checkout-summary-row">
          <span>Tax (13%)</span>
          <span>${tax.toFixed(2)}</span>
        </div>
        {isSubscription && (
          <div className="checkout-summary-row discount">
            <span>Subscription Discount (10%)</span>
            <span>-${((subtotal + tax) * 0.1).toFixed(2)}</span>
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
        <p className="checkout-note">Select your preferred delivery date (minimum 2 business days after today)</p>
        <div className="form-group">
          <DeliveryDateSelector 
            value={deliveryDate}
            onChange={setDeliveryDate}
          />
        </div>
      </div>

      {/* Payment - Separate Card Fields */}
      <div className="checkout-section">
        <h3>Payment Details</h3>
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
            <strong>Subscribe & Save 10%</strong>
            <p style={{ marginTop: '4px' }}>Get recurring deliveries. Pause or cancel anytime.</p>
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
          </div>
        )}
      </div>

      {/* Order/Delivery Notes */}
      <div className="checkout-section" style={{ borderBottom: 'none' }}>
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
              border: '2px solid #D9C8B3',
              borderRadius: '12px',
              fontSize: '16px',
              fontFamily: 'inherit',
              resize: 'vertical'
            }}
            data-testid="order-notes"
          />
        </div>
      </div>

      {/* Special Instructions */}
      <div className="checkout-section" style={{ borderBottom: '1px solid #E8DDD0', paddingBottom: '24px' }}>
        <h3>Special Instructions</h3>
        <div className="form-group">
          <textarea
            value={specialInstructions}
            onChange={(e) => setSpecialInstructions(e.target.value)}
            placeholder="Any additional notes or requests..."
            rows={2}
            style={{
              width: '100%',
              padding: '14px 16px',
              border: '2px solid #D9C8B3',
              borderRadius: '12px',
              fontSize: '16px',
              fontFamily: 'inherit',
              resize: 'vertical'
            }}
          />
        </div>
      </div>

      {/* Promo Code */}
      <div className="checkout-section" style={{ borderBottom: 'none' }}>
        <h3>Promo Code</h3>
        <div style={{ display: 'flex', gap: '12px' }}>
          <input
            type="text"
            value={promoCode}
            onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
            placeholder="Enter promo code"
            style={{
              flex: 1,
              padding: '14px 16px',
              border: '2px solid #D9C8B3',
              borderRadius: '12px',
              fontSize: '16px',
              fontFamily: 'inherit'
            }}
          />
          <button
            type="button"
            onClick={() => {/* TODO: Validate promo code */}}
            style={{
              padding: '14px 24px',
              background: '#A41E34',
              color: '#fff',
              border: 'none',
              borderRadius: '12px',
              fontSize: '16px',
              fontWeight: '600',
              cursor: 'pointer'
            }}
          >
            Apply
          </button>
        </div>
        {promoDiscount > 0 && (
          <p style={{ marginTop: '8px', color: '#228B22', fontSize: '14px', fontWeight: '600' }}>
            Promo applied! ${promoDiscount.toFixed(2)} discount
          </p>
        )}
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
        Thank you for your order. You'll receive a confirmation email shortly.
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
