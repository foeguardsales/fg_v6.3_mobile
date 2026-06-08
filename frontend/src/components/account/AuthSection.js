import React, { useState } from 'react';
import { authService } from '../../services/api';

export const AuthSection = ({ onSuccess }) => {
  const [showLogin, setShowLogin] = useState(true);

  return (
    <div style={{ maxWidth: '500px', margin: '0 auto' }}>
      <div style={{ textAlign: 'center', marginBottom: '30px' }}>
        <button onClick={() => setShowLogin(true)} 
          style={{ padding: '12px 24px', background: showLogin ? '#c8102e' : 'transparent', 
            color: showLogin ? 'white' : '#c8102e', border: '2px solid #c8102e', 
            borderRadius: '8px 0 0 8px', cursor: 'pointer', fontWeight: '600' }}>
          Login
        </button>
        <button onClick={() => setShowLogin(false)}
          style={{ padding: '12px 24px', background: !showLogin ? '#c8102e' : 'transparent',
            color: !showLogin ? 'white' : '#c8102e', border: '2px solid #c8102e',
            borderRadius: '0 8px 8px 0', cursor: 'pointer', fontWeight: '600' }}>
          Register
        </button>
      </div>
      {showLogin ? <LoginForm onSuccess={onSuccess} /> : <RegisterForm onSuccess={onSuccess} />}
    </div>
  );
};

const LoginForm = ({ onSuccess }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await authService.login(email, password);
      onSuccess();
    } catch (err) {
      setError('Invalid credentials');
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
      <button type="submit" className="btn-primary">Login</button>
    </form>
  );
};

const RegisterForm = ({ onSuccess }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await authService.register(name, email, password);
      onSuccess();
    } catch (err) {
      setError(err.response?.data?.detail || 'Registration failed');
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
      <button type="submit" className="btn-primary">Create Account</button>
    </form>
  );
};