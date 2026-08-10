import React, { useState } from 'react';
import { useShopifyAuth } from '../../contexts/ShopifyAuthContext';

/**
 * AuthSection — site-coded email/password sign in + create account.
 * Credentials are submitted to the Shopify HEADLESS customer API via our
 * backend proxy (/api/shopify/customers/*). No redirect to Shopify's hosted page.
 */
const labelStyle = { display: 'block', textAlign: 'left', fontSize: '13px', fontWeight: 600, color: '#2C2C2C', margin: '0 0 6px' };
const inputStyle = {
  width: '100%', padding: '13px 14px', border: '1.5px solid #D8CFB8', borderRadius: '8px',
  fontSize: '15px', background: '#FFFFFF', color: '#2C2C2C', marginBottom: '14px', boxSizing: 'border-box',
};

export const AuthSection = ({ onSuccess }) => {
  const { login, register, recover } = useShopifyAuth();
  const [mode, setMode] = useState('login'); // 'login' | 'register'
  const [form, setForm] = useState({ email: '', password: '', firstName: '', lastName: '' });
  const [error, setError] = useState('');
  const [info, setInfo] = useState('');
  const [busy, setBusy] = useState(false);

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    setError(''); setInfo(''); setBusy(true);
    try {
      if (mode === 'login') {
        await login({ email: form.email.trim(), password: form.password });
      } else {
        await register({
          email: form.email.trim(),
          password: form.password,
          firstName: form.firstName.trim(),
          lastName: form.lastName.trim(),
        });
      }
      if (onSuccess) onSuccess();
    } catch (err) {
      setError(err?.message || 'Something went wrong. Please try again.');
    } finally {
      setBusy(false);
    }
  };

  const onForgot = async () => {
    setError(''); setInfo('');
    if (!form.email.trim()) { setError('Enter your email first, then tap “Forgot password?”'); return; }
    try {
      await recover(form.email.trim());
      setInfo('If that email is registered, a password reset link is on its way.');
    } catch (err) {
      setError(err?.message || 'Could not send the reset email.');
    }
  };

  const isLogin = mode === 'login';

  return (
    <div style={{ maxWidth: '440px', margin: '0 auto', textAlign: 'center' }} data-testid="auth-section">
      <h2 style={{ fontSize: '26px', fontWeight: 700, marginBottom: '8px', color: '#2C2C2C', fontFamily: "'Barlow Semi Condensed', serif" }}>
        {isLogin ? 'Sign in to your account' : 'Create your account'}
      </h2>
      <p style={{ color: '#555', marginBottom: '22px', fontSize: '14px', lineHeight: 1.6 }}>
        {isLogin ? 'Welcome back — sign in to view your orders and plans.' : 'Join FoeGuard to manage orders, plans and deliveries.'}
      </p>

      <form onSubmit={submit}>
        {!isLogin && (
          <div style={{ display: 'flex', gap: '12px' }}>
            <div style={{ flex: 1 }}>
              <label style={labelStyle} htmlFor="auth-firstname">First name</label>
              <input id="auth-firstname" data-testid="auth-firstname" style={inputStyle} type="text" value={form.firstName} onChange={set('firstName')} autoComplete="given-name" />
            </div>
            <div style={{ flex: 1 }}>
              <label style={labelStyle} htmlFor="auth-lastname">Last name</label>
              <input id="auth-lastname" data-testid="auth-lastname" style={inputStyle} type="text" value={form.lastName} onChange={set('lastName')} autoComplete="family-name" />
            </div>
          </div>
        )}

        <label style={labelStyle} htmlFor="auth-email">Email</label>
        <input id="auth-email" data-testid="auth-email" style={inputStyle} type="email" required value={form.email} onChange={set('email')} autoComplete="email" placeholder="you@example.com" />

        <label style={labelStyle} htmlFor="auth-password">Password</label>
        <input id="auth-password" data-testid="auth-password" style={inputStyle} type="password" required value={form.password} onChange={set('password')} autoComplete={isLogin ? 'current-password' : 'new-password'} placeholder={isLogin ? 'Your password' : 'Create a password'} />

        {error && <p data-testid="auth-error" style={{ color: '#c8102e', fontSize: '13px', margin: '0 0 12px', textAlign: 'left' }}>{error}</p>}
        {info && <p data-testid="auth-info" style={{ color: '#2F7A3E', fontSize: '13px', margin: '0 0 12px', textAlign: 'left' }}>{info}</p>}

        <button
          type="submit"
          data-testid="auth-submit-btn"
          disabled={busy}
          style={{
            width: '100%', padding: '15px 24px', background: busy ? '#9b3040' : '#c8102e', color: 'white',
            border: 'none', borderRadius: '8px', fontSize: '16px', fontWeight: 600, cursor: busy ? 'default' : 'pointer',
          }}
        >
          {busy ? 'Please wait…' : (isLogin ? 'Sign in' : 'Create account')}
        </button>
      </form>

      {isLogin && (
        <button type="button" data-testid="auth-forgot-btn" onClick={onForgot}
          style={{ background: 'none', border: 'none', color: '#8A6F4F', fontSize: '13px', marginTop: '14px', cursor: 'pointer', textDecoration: 'underline' }}>
          Forgot password?
        </button>
      )}

      <p style={{ color: '#555', marginTop: '18px', fontSize: '14px' }}>
        {isLogin ? "Don't have an account?" : 'Already have an account?'}{' '}
        <button
          type="button"
          data-testid="auth-toggle-btn"
          onClick={() => { setMode(isLogin ? 'register' : 'login'); setError(''); setInfo(''); }}
          style={{ background: 'none', border: 'none', color: '#c8102e', fontWeight: 700, cursor: 'pointer' }}
        >
          {isLogin ? 'Create one' : 'Sign in'}
        </button>
      </p>
    </div>
  );
};

export default AuthSection;
