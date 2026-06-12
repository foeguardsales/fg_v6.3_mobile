import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import axios from 'axios';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import './App.css';

import { LandingPage } from './pages/LandingPage';
import { BoxBuilder } from './pages/BoxBuilder';
import { OrderChoicePage } from './pages/OrderChoicePage';
import { MealPlanPage } from './pages/MealPlanPage';
import { MenuPage } from './pages/MenuPage';
import { CartProvider, SlideCart } from './contexts/CartContext';
import { ProductDetailPage } from './pages/ProductDetail';
import { TreatDetailPage } from './pages/TreatDetail';
import { AboutPage } from './pages/AboutPage';
import { PoliciesPage } from './pages/PoliciesPage';
import { TermsPage } from './pages/TermsPage';
import { ContactPage } from './pages/ContactPage';
import { NewToRawPage } from './pages/NewToRawPage';
import { CalculatorPage } from './pages/CalculatorPage';
import { AccountPage } from './pages/AccountPage';
import { AdminPage } from './pages/AdminPage';
import { AdminLogin } from './pages/AdminLogin';
import { AdminDashboard } from './pages/AdminDashboard';
import { BlogListPage, BlogDetailPage } from './pages/BlogPage';
import { CheckoutPage } from './pages/CheckoutPage';
import { FaqPage } from './pages/FaqPage';
import { DeliveryPage } from './pages/DeliveryPage';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

let stripePromise = null;

// Scroll to top on route change (except when returning to build-box with saved position)
const ScrollToTop = () => {
  const { pathname } = useLocation();
  
  useEffect(() => {
    // Skip scroll-to-top for build-box if there's a saved scroll position
    if (pathname === '/build-box' && sessionStorage.getItem('menuScrollPosition')) {
      return;
    }
    
    const root = document.getElementById('root');
    if (root) root.scrollTop = 0;
    window.scrollTo(0, 0);
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
  }, [pathname]);
  
  return null;
};

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
      <CartProvider>
        <BrowserRouter>
          <ScrollToTop />
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/order" element={<OrderChoicePage />} />
            <Route path="/menu" element={<BoxBuilder />} />
            <Route path="/menu/comfort-dinner" element={<BoxBuilder />} />
            <Route path="/menu/primal-feast" element={<BoxBuilder />} />
            <Route path="/menu/treats" element={<BoxBuilder />} />
            <Route path="/checkout" element={<CheckoutPage />} />
            <Route path="/meal-plan" element={<MealPlanPage />} />
            <Route path="/build-box" element={<BoxBuilder />} />
            <Route path="/product/:productId" element={<ProductDetailPage />} />
            <Route path="/treat/:treatId" element={<TreatDetailPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/policies" element={<PoliciesPage />} />
            <Route path="/terms" element={<TermsPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/new-to-raw" element={<NewToRawPage />} />
            <Route path="/calculator" element={<CalculatorPage />} />
            <Route path="/account" element={<AccountPage />} />
            <Route path="/blog" element={<BlogListPage />} />
            <Route path="/blog/:blogId" element={<BlogDetailPage />} />
            <Route path="/faq" element={<FaqPage />} />
            <Route path="/delivery" element={<DeliveryPage />} />
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/admin" element={<AdminDashboard />} />
          </Routes>
        </BrowserRouter>
      </CartProvider>
    </Elements>
  );
}

export default App;
