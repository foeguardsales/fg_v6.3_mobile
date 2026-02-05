import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import axios from 'axios';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import './App.css';

import { LandingPage } from './pages/LandingPage';
import { BoxBuilder } from './pages/BoxBuilder';
import { ProductDetailPage } from './pages/ProductDetail';
import { AboutPage, PoliciesPage, TermsPage, ContactPage } from './pages/ContentPages';
import { CalculatorPage } from './pages/CalculatorPage';
import { AccountPage } from './pages/AccountPage';
import { AdminPage } from './pages/AdminPage';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

let stripePromise = null;

function App() {
  const [stripeReady, setStripeReady] = useState(false);

  useEffect(() => {
    const initStripe = async () => {
      try {
        const { data } = await axios.get(`${API}/stripe-public-key`);
        stripePromise = loadStripe(data.publicKey);
        setStripeReady(true);
      } catch (error) {
        console.error('Failed to load Stripe:', error);
      }
    };
    initStripe();
  }, []);

  if (!stripeReady) {
    return <div style={{ padding: '40px', textAlign: 'center' }}>Loading...</div>;
  }

  return (
    <Elements stripe={stripePromise}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/build-box" element={<BoxBuilder />} />
          <Route path="/product/:productId" element={<ProductDetailPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/policies" element={<PoliciesPage />} />
          <Route path="/terms" element={<TermsPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/calculator" element={<CalculatorPage />} />
          <Route path="/account" element={<AccountPage />} />
          <Route path="/admin" element={<AdminPage />} />
        </Routes>
      </BrowserRouter>
    </Elements>
  );
}

export default App;
