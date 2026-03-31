import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export const Navbar = () => {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  
  const handleNavigate = (path) => {
    navigate(path);
    window.scrollTo(0, 0);
  };
  
  return (
    <nav className="navbar">
      <div className="navbar-inner" style={{ maxWidth: '1200px', margin: '0 auto', padding: '16px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <img 
          src="https://customer-assets.emergentagent.com/job_b173aa98-8700-42d1-aca5-6a3b8220c855/artifacts/0fo0kwz0_fglogo.png" 
          alt="FoeGuard" 
          style={{ height: '56px', cursor: 'pointer' }}
          onClick={() => handleNavigate('/')}
          data-testid="nav-logo"
        />
        {/* Desktop Nav */}
        <div className="nav-desktop" style={{ display: 'flex', gap: '32px', alignItems: 'center' }}>
          <button onClick={() => handleNavigate('/about')} className="nav-link" data-testid="nav-about">Why FoeGuard</button>
          <button onClick={() => handleNavigate('/new-to-raw')} className="nav-link" data-testid="nav-new-to-raw">New to FG</button>
          <button onClick={() => handleNavigate('/blog')} className="nav-link" data-testid="nav-blog">Blog</button>
          <button onClick={() => handleNavigate('/contact')} className="nav-link" data-testid="nav-contact">Contact Us</button>
          <button onClick={() => handleNavigate('/account')} className="nav-link" data-testid="nav-account">Account</button>
          <button 
            onClick={() => handleNavigate('/order')} 
            className="nav-order-btn" 
            data-testid="nav-order"
            style={{
              background: 'linear-gradient(135deg, #FDFCFA 0%, #E8DDD0 100%)',
              color: '#8B1A2E',
              padding: '8px 40px',
              borderRadius: '12px',
              border: '2px solid #E8DDD0',
              fontWeight: '700',
              fontSize: '15px',
              cursor: 'pointer',
              boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
              transition: 'transform 0.2s, box-shadow 0.2s',
              fontFamily: "'Rubik', sans-serif"
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 6px 16px rgba(0,0,0,0.25)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
            }}
          >
            Order
          </button>
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
          <button onClick={() => { handleNavigate('/order'); setMenuOpen(false); }} className="nav-mobile-link">Order</button>
          <button onClick={() => { handleNavigate('/about'); setMenuOpen(false); }} className="nav-mobile-link">Why FoeGuard</button>
          <button onClick={() => { handleNavigate('/new-to-raw'); setMenuOpen(false); }} className="nav-mobile-link">New to FG</button>
          <button onClick={() => { handleNavigate('/blog'); setMenuOpen(false); }} className="nav-mobile-link">Blog</button>
          <button onClick={() => { handleNavigate('/contact'); setMenuOpen(false); }} className="nav-mobile-link">Contact Us</button>
          <button onClick={() => { handleNavigate('/account'); setMenuOpen(false); }} className="nav-mobile-link">Account</button>
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
            <li><a href="/about">Why FoeGuard</a></li>
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