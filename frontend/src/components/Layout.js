import React from 'react';
import { useNavigate } from 'react-router-dom';

export const Navbar = () => {
  const navigate = useNavigate();
  return (
    <nav className="navbar">
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <img 
          src="https://customer-assets.emergentagent.com/job_b173aa98-8700-42d1-aca5-6a3b8220c855/artifacts/0fo0kwz0_fglogo.png" 
          alt="FoeGuard" 
          style={{ height: '60px', cursor: 'pointer' }}
          onClick={() => navigate('/')}
        />
        <div style={{ display: 'flex', gap: '32px', alignItems: 'center' }}>
          <button onClick={() => navigate('/build-box')} className="nav-link">Order</button>
          <button onClick={() => navigate('/about')} className="nav-link">About Us</button>
          <button onClick={() => navigate('/calculator')} className="nav-link">Feeding Calculator</button>
          <button onClick={() => navigate('/account')} className="nav-link">Account</button>
        </div>
      </div>
    </nav>
  );
};

export const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-section">
          <h4>About</h4>
          <ul>
            <li><a href="/about">About Us & Why Raw</a></li>
          </ul>
        </div>
        <div className="footer-section">
          <h4>Legal</h4>
          <ul>
            <li><a href="/policies">Policies</a></li>
            <li><a href="/terms">Terms of Use</a></li>
          </ul>
        </div>
        <div className="footer-section">
          <h4>Contact</h4>
          <p>Ontario, Canada</p>
          <p>hello@foeguard.com</p>
        </div>
      </div>
      <div className="footer-bottom">
        <p>&copy; 2026 FoeGuard. All rights reserved.</p>
      </div>
    </footer>
  );
};