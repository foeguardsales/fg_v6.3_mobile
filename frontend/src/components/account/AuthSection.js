import React, { useState } from 'react';
import { authService } from '../../services/api';

/**
 * AuthSection \u2014 Login / Register / Forgot Password using Shopify's
 * official Storefront Customer Authentication flow. No custom user DB.
 */
export const AuthSection = ({ onSuccess }) => {
  // 'login' | 'register' | 'recover'
  const [mode, setMode] = useState('login');

  const buttonBase = {
    padding: '12px 18px',
    background: 'transparent',
    color: '#c8102e',
    border: '2px solid #c8102e',
    cursor: 'pointer',
    fontWeight: '600',
  };
  const active = { background: '#c8102e', color: 'white' };

  return (
    <div style={{ maxWidth: '500px', margin: '0 auto' }}>
      <div style={{ textAlign: 'center', marginBottom: '30px', display: 'inline-flex', width: '100%', justifyContent: 'center' }}>
        <button
          onClick={() => setMode('login')}
          style={{ ...buttonBase, borderRadius: '8px 0 0 8px', ...(mode === 'login' ? active : {}) }}
        >
          Login
        </button>
        <button
          onClick={() => setMode('register')}
          style={{ ...buttonBase, borderLeft: 'none', borderRight: 'none', ...(mode === 'register' ? active : {}) }}
        >
          Register
        </button>
        <button
          onClick={() => setMode('recover')}
          style={{ ...buttonBase, borderRadius: '0 8px 8px 0', ...(mode === 'recover' ? active : {}) }}
        >
          Forgot?
        </button>
      </div>

      {mode === 'login' && <LoginForm onSuccess={onSuccess} onForgot={() => setMode('recover')} />}
      {mode === 'register' && <RegisterForm onSuccess={onSuccess} />}
      {mode === 'recover' && <RecoverForm onDone={() => setMode('login')} />}
    </div>
  );
};

const errorFromShopify = (err) => {
  if (!err) return 'Something went wrong. Please try again.';
  if (err.userErrors && err.userErrors[0]?.message) return err.userErrors[0].message;
  return err.message || 'Something went wrong. Please try again.';
};

const LoginForm = ({ onSuccess, onForgot }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setBusy(true);
    try {
      await authService.login(email, password);
      onSuccess();
    } catch (err) {
      setError(errorFromShopify(err) || 'Invalid credentials');
    } finally {
      setBusy(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="auth-form">
      <h2>Login</h2>
      <div className="form-group">
        <label>Email</label>
        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
      </div>
      <div className="form-group">
        <label>Password</label>
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
      </div>
      {error && <div style={{ color: '#C33', marginBottom: '16px' }}>{error}</div>}
      <button type="submit" className="btn-primary" disabled={busy}>{busy ? 'Signing in\u2026' : 'Login'}</button>
      <div style={{ marginTop: '14px', textAlign: 'center' }}>
        <button
          type="button"
          onClick={onForgot}
          style={{ background: 'none', border: 'none', color: '#c8102e', fontWeight: 600, cursor: 'pointer', padding: 0 }}
        >
          Forgot your password?
        </button>
      </div>
    </form>
  );
};

const RegisterForm = ({ onSuccess }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setBusy(true);
    try {
      await authService.register(name, email, password);
      onSuccess();
    } catch (err) {
      setError(errorFromShopify(err) || 'Registration failed');
    } finally {
      setBusy(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="auth-form">
      <h2>Create Account</h2>
      <div className="form-group">
        <label>Full Name</label>
        <input type="text" value={name} onChange={(e) => setName(e.target.value)} required />
      </div>
      <div className="form-group">
        <label>Email</label>
        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
      </div>
      <div className="form-group">
        <label>Password</label>
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={6} />
      </div>
      {error && <div style={{ color: '#C33', marginBottom: '16px' }}>{error}</div>}
      <button type="submit" className="btn-primary" disabled={busy}>{busy ? 'Creating\u2026' : 'Create Account'}</button>
    </form>
  );
};

const RecoverForm = ({ onDone }) => {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setBusy(true);
    try {
      await authService.recover(email);
      setSent(true);
    } catch (err) {
      setError(errorFromShopify(err) || 'Unable to send recovery email');
    } finally {
      setBusy(false);
    }
  };

  if (sent) {
    return (
      <div className="auth-form">
        <h2>Check your email</h2>
        <p style={{ color: '#555', marginBottom: '20px' }}>
          If an account exists for <strong>{email}</strong>, you\u2019ll receive password reset instructions shortly.
        </p>
        <button type="button" className="btn-primary" onClick={onDone}>Back to Login</button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="auth-form">
      <h2>Reset your password</h2>
      <p style={{ color: '#555', marginBottom: '20px', fontSize: '14px' }}>
        Enter your account email and we\u2019ll send you a Shopify password reset link.
      </p>
      <div className="form-group">
        <label>Email</label>
        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
      </div>
      {error && <div style={{ color: '#C33', marginBottom: '16px' }}>{error}</div>}
      <button type="submit" className="btn-primary" disabled={busy}>{busy ? 'Sending\u2026' : 'Send reset link'}</button>
    </form>
  );
};
