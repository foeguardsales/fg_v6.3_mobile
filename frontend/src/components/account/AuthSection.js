import React from 'react';
import { useShopifyAuth } from '../../contexts/ShopifyAuthContext';

/**
 * AuthSection — Emergent (Google) sign in / create account.
 * Both sign-in and account creation happen via Emergent's hosted Google auth.
 * There is NO email/password form and NO Shopify hosted login.
 */
export const AuthSection = () => {
  const { login } = useShopifyAuth();

  return (
    <div style={{ maxWidth: '440px', margin: '0 auto', textAlign: 'center' }} data-testid="auth-section">
      <h2 style={{ fontSize: '26px', fontWeight: 700, marginBottom: '8px', color: '#2C2C2C', fontFamily: "'Barlow Semi Condensed', serif" }}>
        Sign in to your account
      </h2>
      <p style={{ color: '#555', marginBottom: '26px', fontSize: '14px', lineHeight: 1.6 }}>
        Sign in or create your FoeGuard account to manage orders, plans and deliveries.
      </p>

      <button
        type="button"
        data-testid="google-signin-btn"
        onClick={() => login()}
        style={{
          width: '100%', padding: '14px 20px', background: '#FFFFFF', color: '#2C2C2C',
          border: '1.5px solid #D8CFB8', borderRadius: '10px', fontSize: '16px', fontWeight: 600,
          cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px',
          boxShadow: '2px 2px 0px rgba(0,0,0,0.04)',
        }}
      >
        <svg width="20" height="20" viewBox="0 0 48 48" aria-hidden="true">
          <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" />
          <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z" />
          <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z" />
          <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" />
        </svg>
        Continue with Google
      </button>

      <p style={{ color: '#8A6F4F', marginTop: '18px', fontSize: '12.5px', lineHeight: 1.6 }}>
        {"By continuing you agree to FoeGuard's Terms and acknowledge our Privacy Policy."}
      </p>
    </div>
  );
};

export default AuthSection;
