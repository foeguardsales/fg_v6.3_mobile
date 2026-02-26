import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export const Navbar = () => {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  
  return (
    <nav className="navbar">
      <div className="navbar-inner" style={{ maxWidth: '1200px', margin: '0 auto', padding: '16px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <img 
          src="https://customer-assets.emergentagent.com/job_b173aa98-8700-42d1-aca5-6a3b8220c855/artifacts/0fo0kwz0_fglogo.png" 
          alt="FoeGuard" 
          style={{ height: '56px', cursor: 'pointer' }}
          onClick={() => navigate('/')}
          data-testid="nav-logo"
        />
        {/* Desktop Nav */}
        <div className="nav-desktop" style={{ display: 'flex', gap: '32px', alignItems: 'center' }}>
          <button onClick={() => navigate('/build-box')} className="nav-link" data-testid="nav-order">Order</button>
          <button onClick={() => navigate('/about')} className="nav-link" data-testid="nav-about">About Us</button>
          <button onClick={() => navigate('/blog')} className="nav-link" data-testid="nav-blog">Blog</button>
          <button onClick={() => navigate('/new-to-raw')} className="nav-link" data-testid="nav-new-to-raw">New to FG</button>
          <button onClick={() => navigate('/calculator')} className="nav-link" data-testid="nav-calculator">Calculator</button>
          <button onClick={() => navigate('/contact')} className="nav-link" data-testid="nav-contact">Contact Us</button>
          <button onClick={() => navigate('/account')} className="nav-link" data-testid="nav-account">Account</button>
        </div>
        {/* Mobile Menu Button */}
        <button 
          className="nav-mobile-btn"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
          data-testid="nav-mobile-toggle"
        >
          {menuOpen ? '✕' : '☰'}
        </button>
      </div>
      {/* Mobile Menu */}
      {menuOpen && (
        <div className="nav-mobile-menu" data-testid="nav-mobile-menu">
          <button onClick={() => { navigate('/build-box'); setMenuOpen(false); }} className="nav-mobile-link">Order</button>
          <button onClick={() => { navigate('/about'); setMenuOpen(false); }} className="nav-mobile-link">About Us</button>
          <button onClick={() => { navigate('/blog'); setMenuOpen(false); }} className="nav-mobile-link">Blog</button>
          <button onClick={() => { navigate('/new-to-raw'); setMenuOpen(false); }} className="nav-mobile-link">New to FG</button>
          <button onClick={() => { navigate('/calculator'); setMenuOpen(false); }} className="nav-mobile-link">Calculator</button>
          <button onClick={() => { navigate('/contact'); setMenuOpen(false); }} className="nav-mobile-link">Contact Us</button>
          <button onClick={() => { navigate('/account'); setMenuOpen(false); }} className="nav-mobile-link">Account</button>
        </div>
      )}
    </nav>
  );
};

export const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-section">
          <h4>Explore</h4>
          <ul>
            <li><a href="/about">About Us</a></li>
            <li><a href="/new-to-raw">New to FoeGuard?</a></li>
            <li><a href="/calculator">Feeding Calculator</a></li>
          </ul>
        </div>
        <div className="footer-section">
          <h4>My Account</h4>
          <ul>
            <li><a href="/account">Account Dashboard</a></li>
            <li><a href="/account">Order History</a></li>
            <li><a href="/account">Manage Subscription</a></li>
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
          <p style={{ margin: '0 0 12px 0', lineHeight: '1.6' }}>
            <strong>Partnerships & Collaborations</strong><br />
            <a href="mailto:sales@foeguard.com" style={{ color: '#FDFCFA' }}>sales@foeguard.com</a>
          </p>
          <p style={{ margin: '0 0 12px 0', lineHeight: '1.6' }}>
            <strong>General Inquiries</strong><br />
            <a href="mailto:info@foeguard.com" style={{ color: '#FDFCFA' }}>info@foeguard.com</a>
          </p>
          <p style={{ margin: 0, lineHeight: '1.6' }}>
            <strong>Call Us</strong><br />
            <a href="tel:9054667787" style={{ color: '#FDFCFA' }}>905-466-7787</a>
          </p>
        </div>
      </div>
      <div className="footer-bottom">
        <p>&copy; 2026 FoeGuard. All rights reserved.</p>
      </div>
    </footer>
  );
};