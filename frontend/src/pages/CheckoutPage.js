import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Navbar, Footer } from '../components/Layout';
import { useCart } from './MenuPage';
import { ChevronLeft, Check, ShoppingBag, CreditCard, Truck } from 'lucide-react';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:8001';
const API = `${BACKEND_URL}/api`;

export const CheckoutPage = () => {
  const navigate = useNavigate();
  const stripe = useStripe();
  const elements = useElements();
  
  const {
    cartItems, totalLbs, totalDiscount, subtotal, discountAmount, total,
    isSubscription, clearCart
  } = useCart();

  const [step, setStep] = useState(1); // 1: Info, 2: Payment, 3: Confirm
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [orderComplete, setOrderComplete] = useState(false);
  const [orderId, setOrderId] = useState(null);

  // Customer info
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [province, setProvince] = useState('');
  const [deliveryDate, setDeliveryDate] = useState('');
  const [notes, setNotes] = useState('');

  // Redirect if cart is empty
  useEffect(() => {
    if (cartItems.length === 0 && !orderComplete) {
      navigate('/menu');
    }
  }, [cartItems, navigate, orderComplete]);

  const handleSubmitOrder = async () => {
    if (!stripe || !elements) return;

    setLoading(true);
    setError('');

    try {
      // Create payment intent
      const paymentRes = await axios.post(`${API}/create-payment-intent`, {
        amount: Math.round(total * 100),
        currency: 'cad'
      });

      const { clientSecret } = paymentRes.data;

      // Confirm payment
      const { error: stripeError, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: elements.getElement(CardElement),
          billing_details: {
            name,
            email,
            phone,
            address: {
              line1: address,
              city,
              state: province,
              postal_code: postalCode,
              country: 'CA'
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
        // Create order
        const orderRes = await axios.post(`${API}/orders`, {
          customer_name: name,
          customer_email: email,
          customer_phone: phone,
          shipping_address: `${address}, ${city}, ${province} ${postalCode}`,
          delivery_date: deliveryDate,
          items: cartItems.map(item => ({
            product_id: item.productId,
            name: item.name,
            quantity: item.quantity,
            lbs: item.lbs,
            price: item.price
          })),
          subtotal,
          discount: discountAmount,
          discount_percent: Math.round(totalDiscount * 100),
          tax: total * 0.13,
          total: total * 1.13,
          is_subscription: isSubscription,
          notes,
          payment_intent_id: paymentIntent.id
        });

        setOrderId(orderRes.data.order_id);
        setOrderComplete(true);
        clearCart();
      }
    } catch (err) {
      setError(err.response?.data?.detail || 'Payment failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Order complete screen
  if (orderComplete) {
    return (
      <>
        <Navbar />
        <div style={{ minHeight: '100vh', background: '#F5F3EF', padding: '40px 20px' }}>
          <div style={{ maxWidth: '500px', margin: '0 auto', textAlign: 'center' }}>
            <div style={{
              width: '80px', height: '80px', borderRadius: '50%', background: '#E8F5E9',
              display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px'
            }}>
              <Check size={40} color="#2E7D32" />
            </div>
            <h1 style={{ fontSize: '28px', fontWeight: '700', marginBottom: '12px' }}>Order Confirmed!</h1>
            <p style={{ color: '#666', marginBottom: '24px' }}>
              Thank you for your order. We'll send you a confirmation email shortly.
            </p>
            {orderId && (
              <p style={{ fontSize: '14px', color: '#999', marginBottom: '32px' }}>
                Order ID: {orderId}
              </p>
            )}
            <button onClick={() => navigate('/menu')} style={{
              padding: '14px 32px', background: '#8B4513', color: 'white',
              border: 'none', borderRadius: '8px', fontSize: '16px', fontWeight: '600', cursor: 'pointer'
            }}>
              Continue Shopping
            </button>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  const tax = total * 0.13;
  const grandTotal = total + tax;

  return (
    <>
      <Navbar />
      <div style={{ minHeight: '100vh', background: '#F5F3EF' }}>
        {/* Header */}
        <div style={{ background: 'white', padding: '16px 20px', borderBottom: '1px solid #eee', display: 'flex', alignItems: 'center', gap: '12px' }}>
          <button onClick={() => navigate('/menu')} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
            <ChevronLeft size={24} />
          </button>
          <h1 style={{ fontSize: '20px', fontWeight: '600', margin: 0 }}>Checkout</h1>
        </div>

        <div style={{ maxWidth: '600px', margin: '0 auto', padding: '20px' }}>
          {/* Order Summary */}
          <div style={{ background: 'white', borderRadius: '12px', padding: '20px', marginBottom: '16px' }}>
            <h2 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <ShoppingBag size={20} /> Order Summary
            </h2>
            {cartItems.map((item, idx) => (
              <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: idx < cartItems.length - 1 ? '1px solid #f0f0f0' : 'none' }}>
                <div>
                  <div style={{ fontWeight: '500' }}>{item.name}</div>
                  <div style={{ fontSize: '13px', color: '#666' }}>{item.lbs} lbs × {item.quantity}</div>
                </div>
                <div style={{ fontWeight: '600' }}>${item.price.toFixed(2)}</div>
              </div>
            ))}
            <div style={{ borderTop: '1px solid #eee', marginTop: '12px', paddingTop: '12px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                <span>Subtotal ({totalLbs} lbs)</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              {totalDiscount > 0 && (
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px', color: '#2E7D32' }}>
                  <span>Discount ({Math.round(totalDiscount * 100)}%)</span>
                  <span>-${discountAmount.toFixed(2)}</span>
                </div>
              )}
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                <span>Tax (13%)</span>
                <span>${tax.toFixed(2)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: '700', fontSize: '18px', marginTop: '8px', paddingTop: '8px', borderTop: '1px solid #eee' }}>
                <span>Total</span>
                <span>${grandTotal.toFixed(2)}</span>
              </div>
            </div>
            {isSubscription && (
              <div style={{ marginTop: '12px', padding: '10px', background: '#E8F5E9', borderRadius: '8px', fontSize: '13px', color: '#2E7D32' }}>
                ✓ Subscription active – 5% off every order!
              </div>
            )}
          </div>

          {/* Delivery Info */}
          <div style={{ background: 'white', borderRadius: '12px', padding: '20px', marginBottom: '16px' }}>
            <h2 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Truck size={20} /> Delivery Info
            </h2>
            <div style={{ display: 'grid', gap: '12px' }}>
              <input type="text" placeholder="Full Name" value={name} onChange={(e) => setName(e.target.value)}
                style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #ddd', fontSize: '15px', boxSizing: 'border-box' }} />
              <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)}
                style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #ddd', fontSize: '15px', boxSizing: 'border-box' }} />
              <input type="tel" placeholder="Phone" value={phone} onChange={(e) => setPhone(e.target.value)}
                style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #ddd', fontSize: '15px', boxSizing: 'border-box' }} />
              <input type="text" placeholder="Street Address" value={address} onChange={(e) => setAddress(e.target.value)}
                style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #ddd', fontSize: '15px', boxSizing: 'border-box' }} />
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <input type="text" placeholder="City" value={city} onChange={(e) => setCity(e.target.value)}
                  style={{ padding: '12px', borderRadius: '8px', border: '1px solid #ddd', fontSize: '15px' }} />
                <input type="text" placeholder="Postal Code" value={postalCode} onChange={(e) => setPostalCode(e.target.value)}
                  style={{ padding: '12px', borderRadius: '8px', border: '1px solid #ddd', fontSize: '15px' }} />
              </div>
              <select value={province} onChange={(e) => setProvince(e.target.value)}
                style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #ddd', fontSize: '15px', background: 'white' }}>
                <option value="">Select Province</option>
                <option value="ON">Ontario</option>
                <option value="BC">British Columbia</option>
                <option value="AB">Alberta</option>
                <option value="QC">Quebec</option>
                <option value="MB">Manitoba</option>
                <option value="SK">Saskatchewan</option>
                <option value="NS">Nova Scotia</option>
                <option value="NB">New Brunswick</option>
                <option value="NL">Newfoundland</option>
                <option value="PE">PEI</option>
              </select>
              <input type="date" placeholder="Delivery Date" value={deliveryDate} onChange={(e) => setDeliveryDate(e.target.value)}
                min={new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]}
                style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #ddd', fontSize: '15px', boxSizing: 'border-box' }} />
              <textarea placeholder="Delivery notes (optional)" value={notes} onChange={(e) => setNotes(e.target.value)}
                style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #ddd', fontSize: '15px', minHeight: '80px', resize: 'vertical', boxSizing: 'border-box' }} />
            </div>
          </div>

          {/* Payment */}
          <div style={{ background: 'white', borderRadius: '12px', padding: '20px', marginBottom: '16px' }}>
            <h2 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <CreditCard size={20} /> Payment
            </h2>
            <div style={{ padding: '12px', border: '1px solid #ddd', borderRadius: '8px' }}>
              <CardElement options={{
                style: {
                  base: { fontSize: '16px', color: '#424770', '::placeholder': { color: '#aab7c4' } },
                  invalid: { color: '#9e2146' }
                }
              }} />
            </div>
          </div>

          {error && (
            <div style={{ background: '#FFEBEE', color: '#C62828', padding: '12px', borderRadius: '8px', marginBottom: '16px', fontSize: '14px' }}>
              {error}
            </div>
          )}

          {/* Submit Button */}
          <button
            onClick={handleSubmitOrder}
            disabled={loading || !name || !email || !address || !city || !province || !postalCode}
            style={{
              width: '100%', padding: '16px', background: loading ? '#ccc' : '#8B4513', color: 'white',
              border: 'none', borderRadius: '8px', fontSize: '16px', fontWeight: '600',
              cursor: loading ? 'not-allowed' : 'pointer'
            }}
          >
            {loading ? 'Processing...' : `Pay $${grandTotal.toFixed(2)}`}
          </button>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default CheckoutPage;
