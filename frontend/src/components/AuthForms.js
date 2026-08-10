import React, { useState } from 'react';
import { useShopifyAuth } from '../contexts/ShopifyAuthContext';

// Site-coded email/password forms wired to the Shopify HEADLESS customer API
// (via /api/shopify/customers/*). No redirect to Shopify's hosted login page.

const inputStyle = {
  width: '100%', padding: '12px 14px', border: '1.5px solid #D8CFB8', borderRadius: '8px',
  fontSize: '15px', marginBottom: '12px', boxSizing: 'border-box', background: '#fff', color: '#2C2C2C',
};

const AuthCard = ({ heading, register: isRegister, cta, onSuccess }) => {
  const { login, register } = useShopifyAuth();
  const [form, setForm] = useState({ email: '', password: '', firstName: '', lastName: '' });
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    setError(''); setBusy(true);
    try {
      if (isRegister) {
        await register({ email: form.email.trim(), password: form.password, firstName: form.firstName.trim(), lastName: form.lastName.trim() });
      } else {
        await login({ email: form.email.trim(), password: form.password });
      }
      if (onSuccess) onSuccess();
    } catch (err) {
      setError(err?.message || 'Something went wrong. Please try again.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="auth-form" data-testid={isRegister ? 'register-form' : 'login-form'}>
      <h2>{heading}</h2>
      <form onSubmit={submit}>
        {isRegister && (
          <>
            <input style={inputStyle} type="text" placeholder="First name" value={form.firstName} onChange={set('firstName')} autoComplete="given-name" />
            <input style={inputStyle} type="text" placeholder="Last name" value={form.lastName} onChange={set('lastName')} autoComplete="family-name" />
          </>
        )}
        <input style={inputStyle} type="email" required placeholder="Email" value={form.email} onChange={set('email')} autoComplete="email" />
        <input style={inputStyle} type="password" required placeholder="Password" value={form.password} onChange={set('password')} autoComplete={isRegister ? 'new-password' : 'current-password'} />
        {error && <p style={{ color: '#c8102e', fontSize: '13px', margin: '0 0 10px' }}>{error}</p>}
        <button type="submit" className="btn-primary" data-testid="auth-submit-btn" disabled={busy} style={{ width: '100%' }}>
          {busy ? 'Please wait…' : cta}
        </button>
      </form>
    </div>
  );
};

export const LoginForm = ({ onSuccess }) => (
  <AuthCard heading="Sign in" cta="Sign in" onSuccess={onSuccess} />
);

export const RegisterForm = ({ onSuccess }) => (
  <AuthCard heading="Create your account" register cta="Create account" onSuccess={onSuccess} />
);
