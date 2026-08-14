import React, { useState } from 'react';
import { useShopifyAuth } from '../../contexts/ShopifyAuthContext';

/**
 * AuthSection — customer sign in / create account.
 *
 * Primary path: email + password form wired to our backend
 * (/api/auth/signin, /api/auth/signup, /api/auth/recover), which creates /
 * authenticates a REAL Shopify customer via the Storefront Customer API — so
 * accounts live on the custom site while data is still saved in Shopify.
 *
 * Secondary path: "Continue with Google" (Emergent hosted OAuth).
 */

const COLORS = { text: '#2C2C2C', khaki: '#D8CFB8', red: '#c8102e', muted: '#8A6F4F' };

const inputStyle = {
  width: '100%', padding: '12px 14px', border: `1.5px solid ${COLORS.khaki}`,
  borderRadius: '8px', fontSize: '15px', marginBottom: '12px',
  boxSizing: 'border-box', background: '#fff', color: COLORS.text,
  fontFamily: 'inherit',
};

export const AuthSection = ({ onSuccess }) => {
  const { login, register, recover, loginWithGoogle } = useShopifyAuth();
  const [mode, setMode] = useState('signin'); // 'signin' | 'signup' | 'recover'
  const [form, setForm] = useState({ email: '', password: '', firstName: '', lastName: '' });
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [busy, setBusy] = useState(false);

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));
  const switchMode = (m) => { setMode(m); setError(''); setNotice(''); };

  const submit = async (e) => {
    e.preventDefault();
    setError(''); setNotice(''); setBusy(true);
    try {
      if (mode === 'recover') {
        await recover(form.email.trim());
        setNotice('If an account exists for that email, a reset link is on its way.');
      } else if (mode === 'signup') {
        await register({
          email: form.email.trim(), password: form.password,
          firstName: form.firstName.trim(), lastName: form.lastName.trim(),
        });
        if (onSuccess) onSuccess();
      } else {
        await login({ email: form.email.trim(), password: form.password });
        if (onSuccess) onSuccess();
      }
    } catch (err) {
      setError(err?.message || 'Something went wrong. Please try again.');
    } finally {
      setBusy(false);
    }
  };

  const heading =
    mode === 'signup' ? 'Create your account'
    : mode === 'recover' ? 'Reset your password'
    : 'Sign in to your account';

  const cta =
    mode === 'signup' ? 'Create account'
    : mode === 'recover' ? 'Send reset link'
    : 'Sign in';

  return (
    <div style={{ maxWidth: '440px', margin: '0 auto' }} data-testid="auth-section">
      {/* Toggle tabs (hidden in recover mode) */}
      {mode !== 'recover' && (
        <div style={{
          display: 'flex', gap: '6px', background: '#F1EDE6', padding: '5px',
          borderRadius: '10px', marginBottom: '22px',
        }} data-testid="auth-mode-tabs">
          {[['signin', 'Sign In'], ['signup', 'Create Account']].map(([id, label]) => (
            <button
              key={id}
              type="button"
              data-testid={`auth-tab-${id}`}
              onClick={() => switchMode(id)}
              style={{
                flex: 1, padding: '10px 0', border: 'none', cursor: 'pointer',
                borderRadius: '7px', fontSize: '14px', fontWeight: 700,
                fontFamily: 'inherit',
                background: mode === id ? '#fff' : 'transparent',
                color: mode === id ? COLORS.text : COLORS.muted,
                boxShadow: mode === id ? '0 1px 4px rgba(0,0,0,0.08)' : 'none',
              }}
            >
              {label}
            </button>
          ))}
        </div>
      )}

      <h2 style={{
        fontSize: '24px', fontWeight: 700, marginBottom: '6px', color: COLORS.text,
        fontFamily: "'Barlow Semi Condensed', serif", textAlign: 'center',
      }}>
        {heading}
      </h2>
      <p style={{ color: '#555', marginBottom: '22px', fontSize: '13.5px', lineHeight: 1.6, textAlign: 'center' }}>
        {mode === 'recover'
          ? "Enter your email and we'll send you a link to reset your password."
          : 'Manage your orders, meal plans and deliveries.'}
      </p>

      <form onSubmit={submit} data-testid={`auth-form-${mode}`}>
        {mode === 'signup' && (
          <div style={{ display: 'flex', gap: '10px' }}>
            <input style={inputStyle} type="text" placeholder="First name" value={form.firstName}
              onChange={set('firstName')} autoComplete="given-name" data-testid="auth-first-name" />
            <input style={inputStyle} type="text" placeholder="Last name" value={form.lastName}
              onChange={set('lastName')} autoComplete="family-name" data-testid="auth-last-name" />
          </div>
        )}
        <input style={inputStyle} type="email" required placeholder="Email" value={form.email}
          onChange={set('email')} autoComplete="email" data-testid="auth-email" />
        {mode !== 'recover' && (
          <input style={inputStyle} type="password" required placeholder="Password" value={form.password}
            onChange={set('password')} autoComplete={mode === 'signup' ? 'new-password' : 'current-password'}
            data-testid="auth-password" />
        )}

        {error && <p style={{ color: COLORS.red, fontSize: '13px', margin: '0 0 10px' }} data-testid="auth-error">{error}</p>}
        {notice && <p style={{ color: '#2F4538', fontSize: '13px', margin: '0 0 10px' }} data-testid="auth-notice">{notice}</p>}

        <button
          type="submit"
          data-testid="auth-submit-btn"
          disabled={busy}
          style={{
            width: '100%', padding: '13px 20px', background: COLORS.red, color: '#fff',
            border: 'none', borderRadius: '10px', fontSize: '15px', fontWeight: 700,
            cursor: busy ? 'default' : 'pointer', opacity: busy ? 0.7 : 1, fontFamily: 'inherit',
          }}
        >
          {busy ? 'Please wait…' : cta}
        </button>
      </form>

      {/* Forgot password / back links */}
      {mode === 'signin' && (
        <p style={{ textAlign: 'center', marginTop: '14px', fontSize: '13px' }}>
          <button type="button" onClick={() => switchMode('recover')} data-testid="auth-forgot-link"
            style={{ background: 'none', border: 'none', color: COLORS.muted, cursor: 'pointer', textDecoration: 'underline', fontFamily: 'inherit', fontSize: '13px' }}>
            Forgot your password?
          </button>
        </p>
      )}
      {mode === 'recover' && (
        <p style={{ textAlign: 'center', marginTop: '14px', fontSize: '13px' }}>
          <button type="button" onClick={() => switchMode('signin')} data-testid="auth-back-link"
            style={{ background: 'none', border: 'none', color: COLORS.muted, cursor: 'pointer', textDecoration: 'underline', fontFamily: 'inherit', fontSize: '13px' }}>
            ← Back to sign in
          </button>
        </p>
      )}

      {/* Divider */}
      {mode !== 'recover' && (
        <>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', margin: '22px 0 18px' }}>
            <span style={{ flex: 1, height: '1px', background: COLORS.khaki }} />
            <span style={{ fontSize: '12px', color: COLORS.muted, fontWeight: 600 }}>OR</span>
            <span style={{ flex: 1, height: '1px', background: COLORS.khaki }} />
          </div>

          <button
            type="button"
            data-testid="google-signin-btn"
            onClick={() => loginWithGoogle()}
            style={{
              width: '100%', padding: '13px 20px', background: '#FFFFFF', color: COLORS.text,
              border: `1.5px solid ${COLORS.khaki}`, borderRadius: '10px', fontSize: '15px', fontWeight: 600,
              cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px',
              fontFamily: 'inherit',
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
        </>
      )}

      <p style={{ color: COLORS.muted, marginTop: '18px', fontSize: '12px', lineHeight: 1.6, textAlign: 'center' }}>
        {"By continuing you agree to FoeGuard's Terms and acknowledge our Privacy Policy."}
      </p>
    </div>
  );
};

export default AuthSection;
