import React from 'react';

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

// Customer authentication is handled entirely by Shopify's Customer Account
// API (OAuth/OIDC). "Sign in" and "Create account" both redirect to Shopify's
// hosted, secure login page — there is no local email/password form.
const goToShopifyLogin = () => { window.location.href = `${API}/customer-auth/login`; };

const ShopifyAuthCard = ({ heading, cta, onSuccess }) => (
  <div className="auth-form" data-testid="shopify-auth-card">
    <h2>{heading}</h2>
    <p style={{ color: '#555', marginBottom: '20px', fontSize: '14px', lineHeight: 1.5 }}>
      We use secure Shopify accounts. You&apos;ll be redirected to sign in or create
      your account, then brought right back.
    </p>
    <button
      type="button"
      className="btn-primary"
      data-testid="continue-with-shopify-btn"
      onClick={() => { goToShopifyLogin(); if (onSuccess) onSuccess(); }}
      style={{ width: '100%' }}
    >
      {cta}
    </button>
  </div>
);

export const LoginForm = ({ onSuccess }) => (
  <ShopifyAuthCard heading="Sign in" cta="Continue with Shopify" onSuccess={onSuccess} />
);

export const RegisterForm = ({ onSuccess }) => (
  <ShopifyAuthCard heading="Create your account" cta="Continue with Shopify" onSuccess={onSuccess} />
);
