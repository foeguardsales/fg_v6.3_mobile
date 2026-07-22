import React from 'react';

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

/**
 * AuthSection — Shopify Customer Account API (OAuth/OIDC) entry point.
 * A single "Continue with Shopify" action handles sign-in AND sign-up via
 * Shopify's hosted, secure login. No local user DB, no password form.
 */
export const AuthSection = () => {
  const goToShopifyLogin = () => { window.location.href = `${API}/customer-auth/login`; };

  return (
    <div style={{ maxWidth: '460px', margin: '0 auto', textAlign: 'center' }} data-testid="auth-section">
      <h2 style={{ fontSize: '26px', fontWeight: 700, marginBottom: '12px', color: '#2C2C2C', fontFamily: "'Barlow Semi Condensed', serif" }}>
        Sign in to your account
      </h2>
      <p style={{ color: '#555', marginBottom: '28px', fontSize: '15px', lineHeight: 1.6 }}>
        FoeGuard uses secure Shopify accounts. Sign in or create an account in a
        few seconds — we&apos;ll bring you right back when you&apos;re done.
      </p>
      <button
        type="button"
        onClick={goToShopifyLogin}
        data-testid="continue-with-shopify-btn"
        style={{
          width: '100%',
          padding: '16px 24px',
          background: '#c8102e',
          color: 'white',
          border: 'none',
          borderRadius: '8px',
          fontSize: '16px',
          fontWeight: 600,
          cursor: 'pointer',
        }}
      >
        Continue with Shopify
      </button>
      <p style={{ color: '#888', marginTop: '18px', fontSize: '13px' }}>
        Password resets and account details are managed securely by Shopify.
      </p>
    </div>
  );
};

export default AuthSection;
