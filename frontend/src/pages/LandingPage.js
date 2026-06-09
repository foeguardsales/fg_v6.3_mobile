import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Menu, X, ShoppingBag, User, ChevronRight, ChevronDown, Star, Plus, Minus, Sprout, Leaf, ChefHat, Award } from 'lucide-react';
import { useCart, SlideCart } from '../contexts/CartContext';

// FoeGuard Brand Colors
const COLORS = {
  red: '#c8102e',
  redOverlay: '#9D0D23',
  cream: '#f5f3ef',
  softBg: '#E5D9C2',
  khaki: '#C9BE9F',
  khakiDark: '#A89B7C',
  charcoal: '#2C2C2C',
  forestGreen: '#2F4538',
  lightGreen: '#00934f',
  white: '#ffffff'
};

// Lifted Button Style (like Oma's - bordered with shadow on one side)
const liftedButtonStyle = {
  background: COLORS.red,
  color: COLORS.white,
  border: 'none',
  padding: '16px 36px',
  borderRadius: '8px',
  fontSize: '15px',
  fontWeight: '600',
  cursor: 'pointer',
  boxShadow: '4px 4px 0px rgba(0,0,0,0.2)',
  transition: 'all 0.2s ease',
  position: 'relative'
};

const liftedButtonHover = (e, isHover) => {
  if (isHover) {
    e.currentTarget.style.transform = 'translate(-2px, -2px)';
    e.currentTarget.style.boxShadow = '6px 6px 0px rgba(0,0,0,0.25)';
  } else {
    e.currentTarget.style.transform = 'translate(0, 0)';
    e.currentTarget.style.boxShadow = '4px 4px 0px rgba(0,0,0,0.2)';
  }
};

// Outline Lifted Button
const outlineButtonStyle = {
  background: 'transparent',
  color: COLORS.red,
  border: `2px solid ${COLORS.red}`,
  padding: '14px 32px',
  borderRadius: '8px',
  fontSize: '15px',
  fontWeight: '600',
  cursor: 'pointer',
  boxShadow: '3px 3px 0px rgba(200,16,46,0.3)',
  transition: 'all 0.2s ease'
};

// FoeGuard Logo Component — round red badge (no ring)
const FoeGuardLogo = ({ size = 'default' }) => {
  const sizes = {
    small: 56,
    default: 72,
    large: 100
  };
  const dim = sizes[size];

  return (
    <img
      src="https://customer-assets.emergentagent.com/job_b173aa98-8700-42d1-aca5-6a3b8220c855/artifacts/0fo0kwz0_fglogo.png"
      alt="FoeGuard"
      style={{
        width: dim,
        height: dim,
        objectFit: 'contain',
        display: 'block'
      }}
    />
  );
};

// Modern Navbar with centered logo
const ModernNavbar = () => {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [resourcesOpen, setResourcesOpen] = useState(false);
  const { cartItems, setIsCartOpen } = useCart();

  const menuItems = [
    { label: 'Shop Now', path: '/menu' },
    { label: 'Why Raw', path: '/new-to-raw' },
    { label: 'About Us', path: '/about' },
    { 
      label: 'Resources', 
      isDropdown: true,
      items: [
        { label: 'FAQ', path: '/faq' },
        { label: 'Delivery Information', path: '/delivery' },
        { label: 'Blog', path: '/blog' }
      ]
    },
    { label: 'Dog Food Calculator', path: '/calculator' },
    { label: 'Contact Us', path: '/contact' }
  ];

  return (
    <>
      <nav style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 1000,
        background: COLORS.red
      }}>
        {/* Top announcement bar */}
        <div style={{
          background: COLORS.redOverlay,
          color: COLORS.white,
          textAlign: 'center',
          padding: '8px 16px',
          fontSize: '13px',
          fontWeight: '500',
          letterSpacing: '0.02em'
        }}>
          Free Delivery in the GTA Over $100
        </div>
        
        {/* Main navbar — 3-col grid so center logo stays centered on every viewport */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr auto 1fr',
          alignItems: 'center',
          padding: '8px 20px',
          maxWidth: '1400px',
          margin: '0 auto',
          gap: '12px'
        }}>
          {/* Left - Menu button */}
          <div style={{ justifySelf: 'start' }}>
            <button
              onClick={() => setMenuOpen(true)}
              aria-label="Open menu"
              data-testid="nav-menu-open"
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                padding: '8px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}
            >
              <Menu size={26} color={COLORS.white} />
            </button>
          </div>

          {/* Center - Logo Image (true center via grid) */}
          <button
            onClick={() => navigate('/')}
            aria-label="FoeGuard home"
            data-testid="nav-logo"
            style={{
              justifySelf: 'center',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: '0',
              display: 'flex',
              alignItems: 'center'
            }}
          >
            <FoeGuardLogo size="default" />
          </button>

          {/* Right - Cart & Profile */}
          <div style={{ justifySelf: 'end', display: 'flex', alignItems: 'center', gap: '4px' }}>
            <button
              onClick={() => navigate('/account')}
              aria-label="Account"
              data-testid="nav-account"
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                padding: '8px'
              }}
            >
              <User size={22} color={COLORS.white} />
            </button>
            <button
              onClick={() => setIsCartOpen(true)}
              aria-label="Open cart"
              data-testid="nav-cart"
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                padding: '8px',
                position: 'relative'
              }}
            >
              <ShoppingBag size={22} color={COLORS.white} />
              {cartItems.length > 0 && (
                <span style={{
                  position: 'absolute',
                  top: '2px',
                  right: '2px',
                  background: COLORS.white,
                  color: COLORS.red,
                  fontSize: '10px',
                  fontWeight: '700',
                  width: '16px',
                  height: '16px',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  {cartItems.length}
                </span>
              )}
            </button>
          </div>
        </div>
      </nav>

      {/* Spacer to clear the fixed navbar — keeps all pages content below the bar */}
      <div aria-hidden="true" style={{ height: '120px', flexShrink: 0 }} />

      {/* Mobile Menu Overlay */}
      {menuOpen && (
        <>
          <div
            onClick={() => setMenuOpen(false)}
            style={{
              position: 'fixed',
              inset: 0,
              background: 'rgba(0,0,0,0.5)',
              zIndex: 1001
            }}
          />
          <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            bottom: 0,
            width: '300px',
            background: COLORS.cream,
            zIndex: 1002,
            padding: '20px',
            overflowY: 'auto'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
              <FoeGuardLogo size="small" />
              <button onClick={() => setMenuOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                <X size={24} color={COLORS.charcoal} />
              </button>
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
              {menuItems.map((item, idx) => (
                <div key={idx}>
                  {item.isDropdown ? (
                    <>
                      <button
                        onClick={() => setResourcesOpen(!resourcesOpen)}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          width: '100%',
                          padding: '16px 0',
                          background: 'none',
                          border: 'none',
                          borderBottom: `1px solid ${COLORS.khaki}`,
                          cursor: 'pointer',
                          fontSize: '16px',
                          fontWeight: '500',
                          color: COLORS.charcoal
                        }}
                      >
                        {item.label}
                        <ChevronDown 
                          size={20} 
                          color={COLORS.khaki}
                          style={{ transform: resourcesOpen ? 'rotate(180deg)' : 'rotate(0)', transition: 'transform 0.2s' }}
                        />
                      </button>
                      {resourcesOpen && (
                        <div style={{ paddingLeft: '16px', background: COLORS.softBg }}>
                          {item.items.map((subItem, subIdx) => (
                            <button
                              key={subIdx}
                              onClick={() => { navigate(subItem.path); setMenuOpen(false); }}
                              style={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                width: '100%',
                                padding: '14px 0',
                                background: 'none',
                                border: 'none',
                                borderBottom: `1px solid ${COLORS.khaki}`,
                                cursor: 'pointer',
                                fontSize: '15px',
                                fontWeight: '400',
                                color: COLORS.charcoal
                              }}
                            >
                              {subItem.label}
                              <ChevronRight size={18} color={COLORS.khaki} />
                            </button>
                          ))}
                        </div>
                      )}
                    </>
                  ) : (
                    <button
                      onClick={() => { navigate(item.path); setMenuOpen(false); }}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        width: '100%',
                        padding: '16px 0',
                        background: 'none',
                        border: 'none',
                        borderBottom: `1px solid ${COLORS.khaki}`,
                        cursor: 'pointer',
                        fontSize: '16px',
                        fontWeight: '500',
                        color: COLORS.charcoal
                      }}
                    >
                      {item.label}
                      <ChevronRight size={20} color={COLORS.khaki} />
                    </button>
                  )}
                </div>
              ))}
            </div>

            <div style={{ marginTop: '32px', paddingTop: '24px', borderTop: `1px solid ${COLORS.khaki}` }}>
              <button
                onClick={() => { navigate('/account'); setMenuOpen(false); }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '12px 0',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  fontSize: '15px',
                  color: COLORS.charcoal
                }}
              >
                <User size={20} /> Login / Create Account
              </button>
            </div>
          </div>
        </>
      )}
    </>
  );
};

// Trust Badge Marquee
const TrustMarquee = () => {
  const badges = ['Farm Fresh', '100% Canadian', 'Family Owned', 'Organic', 'Human Grade'];
  
  return (
    <div style={{
      background: COLORS.forestGreen,
      color: COLORS.cream,
      overflow: 'hidden',
      padding: '6px 0',
      marginTop: '0'
    }}>
      <div style={{
        display: 'flex',
        animation: 'marquee 12s linear infinite',
        whiteSpace: 'nowrap'
      }}>
        {[...badges, ...badges, ...badges, ...badges, ...badges, ...badges].map((badge, i) => (
          <span key={i} style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '10px',
            marginRight: '32px',
            fontSize: '13px',
            fontWeight: '600',
            textTransform: 'uppercase',
            letterSpacing: '0.08em'
          }}>
            <span style={{ color: COLORS.white, opacity: 0.85 }}>✦</span>
            {badge}
          </span>
        ))}
      </div>
      <style>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
      `}</style>
    </div>
  );
};

// Modern Footer
const ModernFooter = () => {
  const navigate = useNavigate();
  
  return (
    <footer style={{ background: COLORS.khaki, color: COLORS.charcoal }}>
      {/* Main footer content */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
        gap: '32px',
        padding: '48px 20px 40px',
        maxWidth: '1200px',
        margin: '0 auto'
      }}>
        {/* Brand column */}
        <div>
          <div style={{ marginBottom: '12px' }}>
            <FoeGuardLogo size="default" />
          </div>
          <p style={{ fontSize: '13px', lineHeight: '1.6', color: COLORS.charcoal, opacity: 0.85, marginBottom: '20px' }}>
            Ontario&apos;s #1 farm-fresh raw dog food delivery. Real, fresh, complete nutrition for your best friend.
          </p>
          <div style={{ display: 'flex', gap: '10px' }}>
            {['Instagram', 'Facebook'].map(social => (
              <a key={social} href="#" style={{
                width: '36px',
                height: '36px',
                borderRadius: '50%',
                background: COLORS.red,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: COLORS.white,
                fontSize: '12px',
                fontWeight: 700,
                textDecoration: 'none'
              }}>
                {social[0]}
              </a>
            ))}
          </div>
        </div>

        {/* Shop column */}
        <div>
          <h4 style={{ fontSize: '14px', fontWeight: '800', marginBottom: '14px', color: COLORS.charcoal, letterSpacing: '0.04em', textTransform: 'uppercase' }}>Shop</h4>
          {[
            { label: 'Raw Dog Food', to: '/menu' },
            { label: 'Meaty Treats', to: '/menu/treats' },
            { label: 'Build Meal Plan', to: '/meal-plan' },
            { label: 'Dog Food Calculator', to: '/calculator' }
          ].map(item => (
            <button
              key={item.label}
              onClick={() => navigate(item.to)}
              style={{
                display: 'block',
                background: 'none',
                border: 'none',
                padding: 0,
                color: COLORS.charcoal,
                fontSize: '14px',
                marginBottom: '8px',
                cursor: 'pointer',
                opacity: 0.85,
                textAlign: 'left',
                fontFamily: "'Rubik', sans-serif"
              }}
            >
              {item.label}
            </button>
          ))}
        </div>

        {/* Help column */}
        <div>
          <h4 style={{ fontSize: '14px', fontWeight: '800', marginBottom: '14px', color: COLORS.charcoal, letterSpacing: '0.04em', textTransform: 'uppercase' }}>Help</h4>
          {[
            { label: 'Contact Us', to: '/contact' },
            { label: 'FAQs', to: '/faq' },
            { label: 'Delivery Information', to: '/delivery' },
            { label: 'Returns', to: '/policies' }
          ].map(item => (
            <button
              key={item.label}
              onClick={() => navigate(item.to)}
              style={{
                display: 'block',
                background: 'none',
                border: 'none',
                padding: 0,
                color: COLORS.charcoal,
                fontSize: '14px',
                marginBottom: '8px',
                cursor: 'pointer',
                opacity: 0.85,
                textAlign: 'left',
                fontFamily: "'Rubik', sans-serif"
              }}
            >
              {item.label}
            </button>
          ))}
        </div>

        {/* Company column */}
        <div>
          <h4 style={{ fontSize: '14px', fontWeight: '800', marginBottom: '14px', color: COLORS.charcoal, letterSpacing: '0.04em', textTransform: 'uppercase' }}>Company</h4>
          {[
            { label: 'About Us', to: '/about' },
            { label: 'Why Raw?', to: '/new-to-raw' },
            { label: 'Blog', to: '/blog' },
            { label: 'Privacy Policy', to: '/policies' },
            { label: 'Terms of Service', to: '/terms' }
          ].map(item => (
            <button
              key={item.label}
              onClick={() => navigate(item.to)}
              style={{
                display: 'block',
                background: 'none',
                border: 'none',
                padding: 0,
                color: COLORS.charcoal,
                fontSize: '14px',
                marginBottom: '8px',
                cursor: 'pointer',
                opacity: 0.85,
                textAlign: 'left',
                fontFamily: "'Rubik', sans-serif"
              }}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {/* Bottom bar */}
      <div style={{
        borderTop: `1px solid ${COLORS.khakiDark}`,
        padding: '18px 20px',
        textAlign: 'center',
        fontSize: '12px',
        color: COLORS.charcoal,
        opacity: 0.7
      }}>
        © {new Date().getFullYear()} FoeGuard. All rights reserved. Made with care in Ontario.
      </div>
    </footer>
  );
};

// Landing Page Component
export const LandingPage = () => {
  const navigate = useNavigate();
  const [activeFaq, setActiveFaq] = useState(null);

  const faqs = [
    {
      q: "Is raw food safe for my dog?",
      a: "Yes! Our raw food is made in an Ontario Regulated Human Food Kitchen with the same safety standards as human food. We use only human-grade, ethically sourced ingredients."
    },
    {
      q: "How do I transition my dog to raw?",
      a: "We recommend a gradual transition over 7-10 days, mixing increasing amounts of raw food with their current diet. Our team is always here to help guide you through the process."
    },
    {
      q: "How is the food shipped?",
      a: "All orders are shipped frozen in insulated packaging with dry ice to ensure freshness. We deliver directly to your door across Ontario."
    },
    {
      q: "Can I pause or cancel my subscription?",
      a: "Absolutely! Your meal plan is completely customizable. Pause, skip, change, or cancel anytime with no commitments or hidden fees."
    }
  ];

  // Customer photos from old site — used for both review thumbs + background collage
  const CUSTOMER_IMG = (i) => {
    const urls = [
      'https://customer-assets.emergentagent.com/job_b68c2142-db90-4d98-9725-e1ffe0396c9b/artifacts/skuox6lk_customer%20image%201.jpg',
      'https://customer-assets.emergentagent.com/job_b68c2142-db90-4d98-9725-e1ffe0396c9b/artifacts/i8unoyzf_customer%20image%202.jpg',
      'https://customer-assets.emergentagent.com/job_b68c2142-db90-4d98-9725-e1ffe0396c9b/artifacts/0chc5rd7_customer%20image%203.jpg',
      'https://customer-assets.emergentagent.com/job_b68c2142-db90-4d98-9725-e1ffe0396c9b/artifacts/ztqi7osh_customer%20image%204.jpg',
      'https://customer-assets.emergentagent.com/job_b68c2142-db90-4d98-9725-e1ffe0396c9b/artifacts/mdrqjiyi_customer%20image%205.jpg',
      'https://customer-assets.emergentagent.com/job_b68c2142-db90-4d98-9725-e1ffe0396c9b/artifacts/fd4zxuc8_customer%20image%206.jpg',
      'https://customer-assets.emergentagent.com/job_b68c2142-db90-4d98-9725-e1ffe0396c9b/artifacts/bntscfuc_customer%20image%207.jpg',
      'https://customer-assets.emergentagent.com/job_b68c2142-db90-4d98-9725-e1ffe0396c9b/artifacts/uci3qgmq_customer%20image%208.jpg',
      'https://customer-assets.emergentagent.com/job_b68c2142-db90-4d98-9725-e1ffe0396c9b/artifacts/aphigyw1_customer%20image%209.jpg',
      'https://customer-assets.emergentagent.com/job_b68c2142-db90-4d98-9725-e1ffe0396c9b/artifacts/2kgbxhaf_customer%20image%2010.jpg',
      'https://customer-assets.emergentagent.com/job_b68c2142-db90-4d98-9725-e1ffe0396c9b/artifacts/pk34xhh5_customer%20image%2011.jpg',
      'https://customer-assets.emergentagent.com/job_b68c2142-db90-4d98-9725-e1ffe0396c9b/artifacts/nsfx800g_customer%20image%2012.jpg'
    ];
    return urls[i % urls.length];
  };

  const reviews = [
    { name: 'Sarah M.', text: "Her digestion improved within weeks. I'll never go back to kibble.", rating: 5, img: CUSTOMER_IMG(0) },
    { name: 'Daniel R.', text: 'Finally a raw brand I trust.', rating: 5, img: CUSTOMER_IMG(1) },
    { name: 'Melissa T.', text: 'Energy, coat, stools — everything changed.', rating: 5, img: CUSTOMER_IMG(2) },
    { name: 'Jennifer L.', text: "My dog's coat is so much shinier now. Worth every penny!", rating: 5, img: CUSTOMER_IMG(3) },
    { name: 'Michael K.', text: "Switching to FoeGuard was the best decision for our pup's health.", rating: 5, img: CUSTOMER_IMG(4) },
    { name: 'Amanda R.', text: "I love knowing exactly what my dog is eating. Real ingredients!", rating: 5, img: CUSTOMER_IMG(5) }
  ];

  return (
    <>
      <ModernNavbar />
      <SlideCart />
      
      <main>
        {/* HERO SECTION */}
        <section style={{
          background: `linear-gradient(135deg, ${COLORS.cream} 0%, ${COLORS.softBg} 100%)`,
          padding: '32px 20px 32px',
          position: 'relative',
          overflow: 'hidden'
        }}>
          {/* Bottom gradient mask blending into next section */}
          <div aria-hidden="true" style={{
            position: 'absolute',
            left: 0,
            right: 0,
            bottom: 0,
            height: '40px',
            background: `linear-gradient(180deg, rgba(245,243,239,0) 0%, ${COLORS.cream} 100%)`,
            pointerEvents: 'none'
          }} />
          <div style={{ maxWidth: '1200px', margin: '0 auto', position: 'relative', zIndex: 1 }}>
            {/* Tri-Image Layout - Unified container, no gaps, no border, no shadow, scroll fade-in */}
            <div
              className="hero-tri-image hero-fade-in"
              style={{
                display: 'grid',
                gridTemplateColumns: '2fr 1fr',
                gap: '0px',
                aspectRatio: '3 / 2',
                maxWidth: '720px',
                margin: '0 auto 40px',
                borderRadius: '20px',
                overflow: 'hidden'
              }}
            >
              {/* Large image on left — square (matches full container height) */}
              <div style={{ overflow: 'hidden', position: 'relative' }}>
                <img
                  src="https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=800&h=800&fit=crop"
                  alt="Happy dog"
                  style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                />
              </div>
              {/* Two square images stacked on right — no gap */}
              <div style={{ display: 'grid', gridTemplateRows: '1fr 1fr', gap: '0px' }}>
                <div style={{ overflow: 'hidden' }}>
                  <img
                    src="https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&h=400&fit=crop"
                    alt="Raw food"
                    style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                  />
                </div>
                <div style={{ overflow: 'hidden' }}>
                  <img
                    src="https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=400&h=400&fit=crop"
                    alt="Dogs playing"
                    style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                  />
                </div>
              </div>
            </div>

            {/* Hero Text */}
            <div style={{ textAlign: 'center' }}>
              <h1 style={{
                fontSize: 'clamp(24px, 4.2vw, 42px)',
                fontWeight: '800',
                color: COLORS.charcoal,
                lineHeight: '1.15',
                marginBottom: '18px',
                fontFamily: "'Rubik', sans-serif",
                letterSpacing: '-0.01em'
              }}>
                Ontario&apos;s #1 Farm Fresh<br />
                <span style={{ color: COLORS.red }}>Raw Dog Food</span>
              </h1>

              <p style={{
                fontSize: 'clamp(14px, 1.6vw, 16px)',
                color: COLORS.charcoal,
                opacity: 0.82,
                maxWidth: '600px',
                margin: '0 auto 26px',
                lineHeight: '1.6',
                fontWeight: 400
              }}>
                Restore your dog&apos;s digestion, energy and comfort from the inside out with fresh, complete raw pet nutrition.
              </p>

              {/* Shop Now Button - Lifted Style */}
              <button
                onClick={() => navigate('/menu')}
                style={liftedButtonStyle}
                onMouseEnter={(e) => liftedButtonHover(e, true)}
                onMouseLeave={(e) => liftedButtonHover(e, false)}
              >
                Shop Now
              </button>

              {/* Reviews - No pill, under Shop Now */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                marginTop: '20px'
              }}>
                <div style={{ display: 'flex', gap: '2px' }}>
                  {[1,2,3,4,5].map(i => <Star key={i} size={16} fill={COLORS.red} color={COLORS.red} />)}
                </div>
                <span style={{ fontSize: '14px', fontWeight: '500', color: COLORS.charcoal }}>
                  Hundreds of 5-Star Reviews
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* TRUST MARQUEE */}
        <TrustMarquee />

        {/* COLLECTION CARDS - "Shop Farm Fresh" */}
        <section style={{
          background: COLORS.white,
          padding: '40px 20px 60px'
        }}>
          <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
            <h2 style={{
              fontSize: 'clamp(22px, 2.6vw, 28px)',
              fontWeight: '700',
              textAlign: 'center',
              marginBottom: '32px',
              color: COLORS.charcoal,
              fontFamily: "'Rubik', sans-serif"
            }}>
              Shop <span style={{ color: COLORS.red }}>Farm Fresh</span>
            </h2>

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: '24px'
            }}>
              {[
                {
                  title: 'Build Your Meal Plan',
                  desc: 'Take our simple quiz to receive your customized raw feeding plan in seconds.',
                  image: 'https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=400&h=300&fit=crop',
                  path: '/meal-plan',
                  cta: 'Get Started'
                },
                {
                  title: 'Raw Dog Food',
                  desc: 'Fresh food that is easy to portion and serve, ensuring balanced, nutritious meals every day.',
                  image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&h=300&fit=crop',
                  path: '/menu',
                  cta: 'Order Now'
                },
                {
                  title: 'Meaty Treats',
                  desc: 'Raw treats add a nutritional boost to any diet. Perfect as rewards or training tools.',
                  image: 'https://images.unsplash.com/photo-1568640347023-a616a30bc3bd?w=400&h=300&fit=crop',
                  path: '/menu/treats',
                  cta: 'Shop Now'
                }
              ].map((card, i) => (
                <button
                  key={i}
                  onClick={() => navigate(card.path)}
                  style={{
                    background: COLORS.cream,
                    border: 'none',
                    borderRadius: '16px',
                    overflow: 'hidden',
                    cursor: 'pointer',
                    textAlign: 'left',
                    transition: 'all 0.3s ease',
                    boxShadow: '0 4px 16px rgba(0,0,0,0.06)'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-6px)';
                    e.currentTarget.style.boxShadow = '0 12px 32px rgba(0,0,0,0.12)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,0,0,0.06)';
                  }}
                >
                  <div style={{
                    height: '200px',
                    background: `url(${card.image}) center/cover`
                  }} />
                  <div style={{ padding: '24px' }}>
                    <h3 style={{
                      fontSize: '20px',
                      fontWeight: '700',
                      color: COLORS.charcoal,
                      marginBottom: '8px'
                    }}>
                      {card.title}
                    </h3>
                    <p style={{
                      fontSize: '14px',
                      color: COLORS.charcoal,
                      opacity: 0.7,
                      lineHeight: '1.5',
                      marginBottom: '16px'
                    }}>
                      {card.desc}
                    </p>
                    <span style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '6px',
                      color: COLORS.red,
                      fontWeight: '600',
                      fontSize: '14px'
                    }}>
                      {card.cta} <ChevronRight size={18} />
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* WHY FOEGUARD RAW? */}
        <section style={{
          background: COLORS.softBg,
          padding: '60px 20px'
        }}>
          <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
            {/* Headline */}
            <div style={{ textAlign: 'center', marginBottom: '40px', maxWidth: '820px', marginLeft: 'auto', marginRight: 'auto' }}>
              <h2 style={{
                fontSize: 'clamp(22px, 2.6vw, 28px)',
                fontWeight: '700',
                color: COLORS.charcoal,
                lineHeight: 1.25,
                marginBottom: '16px',
                fontFamily: "'Rubik', sans-serif"
              }}>
                Why <span style={{ color: COLORS.red }}>FoeGuard</span> Raw?
              </h2>
              <p style={{
                fontSize: 'clamp(15px, 1.8vw, 17px)',
                fontWeight: 400,
                color: COLORS.charcoal,
                opacity: 0.85,
                lineHeight: 1.6,
                margin: 0,
                fontFamily: "'Rubik', sans-serif"
              }}>
                By delivering directly to you, we&apos;re able to invest more into quality portions, real ingredients and meals that are <span style={{ color: COLORS.red, fontWeight: 600 }}>100% made in Canada</span>. Something you and your best friend can both feel good about.
              </p>
            </div>

            {/* Image + Benefits grid */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
              gap: '48px',
              alignItems: 'center'
            }}>
              {/* Image side — no border, no shadow */}
              <div style={{
                position: 'relative',
                borderRadius: '20px',
                overflow: 'hidden'
              }}>
                <img
                  src="https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=600&h=600&fit=crop"
                  alt="Happy dog"
                  style={{ width: '100%', display: 'block' }}
                />
              </div>

              {/* 4 Benefit cards */}
              <div style={{ display: 'grid', gap: '16px' }}>
                {[
                  { Icon: Sprout, title: 'Farm Fresh', desc: 'Locally sourced and hand-crafted in small batches every week.' },
                  { Icon: Leaf, title: '100% Organic', desc: 'Raised on open pastures, clean feed and without hormones, fillers or additives.' },
                  { Icon: ChefHat, title: 'Human Grade', desc: 'Whole proteins prepared in our Ontario regulated human food kitchen.' },
                  { Icon: Award, title: 'Complete Nutrition', desc: 'Made to AAFCO standards. No balancing or supplements needed.' }
                ].map((item, i) => {
                  const Icon = item.Icon;
                  return (
                    <div key={i} style={{
                      display: 'flex',
                      gap: '18px',
                      padding: '20px',
                      background: COLORS.white,
                      borderRadius: '14px',
                      border: `1px solid ${COLORS.khaki}`,
                      alignItems: 'flex-start'
                    }}>
                      <div style={{
                        width: '52px',
                        height: '52px',
                        borderRadius: '12px',
                        background: COLORS.red,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0
                      }}>
                        <Icon size={26} color={COLORS.white} strokeWidth={2} />
                      </div>
                      <div>
                        <h4 style={{
                          fontSize: '17px',
                          fontWeight: 800,
                          color: COLORS.charcoal,
                          margin: '0 0 6px',
                          fontFamily: "'Rubik', sans-serif"
                        }}>
                          {item.title}
                        </h4>
                        <p style={{
                          fontSize: '14px',
                          color: COLORS.charcoal,
                          opacity: 0.78,
                          margin: 0,
                          lineHeight: 1.55
                        }}>
                          {item.desc}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </section>

        {/* BENEFITS SECTION */}
        <section style={{
          background: COLORS.forestGreen,
          padding: '60px 20px',
          color: COLORS.cream
        }}>
          <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
            <div style={{ textAlign: 'center', maxWidth: '720px', margin: '0 auto 36px' }}>
              <h2 style={{
                fontSize: 'clamp(22px, 2.6vw, 28px)',
                fontWeight: '700',
                marginBottom: '12px',
                fontFamily: "'Rubik', sans-serif",
                lineHeight: 1.25,
                color: COLORS.white
              }}>
                Customers Notice Benefits in Just 2 Weeks
              </h2>
              <p style={{
                fontSize: 'clamp(15px, 1.8vw, 17px)',
                opacity: 0.92,
                margin: 0,
                fontWeight: 400,
                lineHeight: 1.6
              }}>
                Here&apos;s what you can expect:
              </p>
            </div>

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
              gap: '14px',
              marginBottom: '36px'
            }}>
              {[
                { title: 'Improved Digestibility', desc: 'Less gas, less bloat, more comfort.' },
                { title: 'Healthier Skin & Coat', desc: 'From real nutrient absorption that\u2019s long lasting.' },
                { title: 'More Stable Energy', desc: 'No peaks and crashes from filler and synthetic inputs.' },
                { title: 'Muscle Condition Improves', desc: 'Without overfeeding or additional toppers.' },
                { title: 'Smaller, Firm Stools', desc: 'A direct sign of higher ingredient bioavailability.' },
                { title: 'Stronger, Cleaner Teeth', desc: 'Less chewing residue and plaque.' }
              ].map((benefit, i) => (
                <div key={i} style={{
                  background: 'rgba(255,255,255,0.08)',
                  border: `1px solid rgba(255,255,255,0.12)`,
                  padding: '18px 18px',
                  borderRadius: '12px',
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '12px',
                  textAlign: 'left'
                }}>
                  <div style={{
                    width: '24px',
                    height: '24px',
                    borderRadius: '50%',
                    background: COLORS.lightGreen,
                    color: COLORS.forestGreen,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                    fontSize: '14px',
                    fontWeight: '700',
                    marginTop: '2px'
                  }}>✓</div>
                  <div>
                    <div style={{
                      fontSize: '15px',
                      fontWeight: '600',
                      marginBottom: '4px',
                      fontFamily: "'Rubik', sans-serif",
                      lineHeight: 1.3
                    }}>{benefit.title}</div>
                    <div style={{
                      fontSize: '13px',
                      opacity: 0.85,
                      lineHeight: 1.5
                    }}>{benefit.desc}</div>
                  </div>
                </div>
              ))}
            </div>

            <div style={{ textAlign: 'center' }}>
              <button
                data-testid="benefits-learn-more"
                onClick={() => navigate('/new-to-raw')}
                style={{
                  ...liftedButtonStyle,
                  background: COLORS.lightGreen,
                  color: COLORS.white
                }}
                onMouseEnter={(e) => liftedButtonHover(e, true)}
                onMouseLeave={(e) => liftedButtonHover(e, false)}
              >
                Learn More
              </button>
            </div>
          </div>
        </section>

        {/* REVIEWS SECTION — vertical-card horizontal feed */}
        <section style={{
          background: COLORS.cream,
          padding: '60px 0',
          position: 'relative',
          overflow: 'hidden'
        }}>
          <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 20px' }}>
            <h2 style={{
              fontSize: 'clamp(22px, 2.6vw, 28px)',
              fontWeight: '700',
              textAlign: 'center',
              marginBottom: '12px',
              color: COLORS.charcoal,
              fontFamily: "'Rubik', sans-serif"
            }}>
              Hear from Happy <span style={{ color: COLORS.red }}>FoeGuardians</span>
            </h2>
            <p style={{ textAlign: 'center', color: COLORS.charcoal, opacity: 0.75, marginBottom: '32px' }}>
              Real reviews from real pet parents
            </p>
          </div>

          {/* Horizontal scroll feed */}
          <div
            className="review-feed"
            data-testid="review-feed"
            style={{
              display: 'flex',
              gap: '18px',
              overflowX: 'auto',
              scrollSnapType: 'x mandatory',
              padding: '12px 20px 28px',
              WebkitOverflowScrolling: 'touch'
            }}
          >
            {/* Build a feed: review card, then a photo card, alternating */}
            {(() => {
              const tiles = [];
              reviews.forEach((r, i) => {
                // Review card
                tiles.push(
                  <article key={`r-${i}`} style={{
                    flex: '0 0 280px',
                    scrollSnapAlign: 'start',
                    background: COLORS.white,
                    borderRadius: '18px',
                    border: `1px solid ${COLORS.khaki}`,
                    boxShadow: '4px 4px 0px rgba(0,0,0,0.08)',
                    overflow: 'hidden',
                    display: 'flex',
                    flexDirection: 'column'
                  }}>
                    <div style={{
                      width: '100%',
                      aspectRatio: '4 / 5',
                      backgroundImage: `url(${r.img})`,
                      backgroundSize: 'cover',
                      backgroundPosition: 'center'
                    }} />
                    <div style={{ padding: '18px 18px 20px' }}>
                      <div style={{ display: 'flex', gap: '2px', marginBottom: '10px' }}>
                        {[1,2,3,4,5].map(s => <Star key={s} size={14} fill={COLORS.red} color={COLORS.red} />)}
                      </div>
                      <p style={{
                        fontSize: '14px',
                        color: COLORS.charcoal,
                        lineHeight: '1.55',
                        marginBottom: '12px',
                        fontStyle: 'italic',
                        minHeight: '60px'
                      }}>
                        {`"${r.text}"`}
                      </p>
                      <p style={{
                        fontSize: '13px',
                        fontWeight: '700',
                        color: COLORS.red,
                        margin: 0,
                        fontFamily: "'Rubik', sans-serif"
                      }}>
                        — {r.name}
                      </p>
                    </div>
                  </article>
                );
                // Every other review, insert a pure customer photo tile (offset to use later images 6-11)
                tiles.push(
                  <div key={`p-${i}`} style={{
                    flex: '0 0 220px',
                    scrollSnapAlign: 'start',
                    borderRadius: '18px',
                    overflow: 'hidden',
                    border: `1px solid ${COLORS.khaki}`,
                    boxShadow: '4px 4px 0px rgba(0,0,0,0.08)',
                    backgroundImage: `url(${CUSTOMER_IMG(i + 6)})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center'
                  }} />
                );
              });
              return tiles;
            })()}
          </div>
        </section>

        {/* PROTEIN OPTIONS — 8+ Meat Options */}
        <section style={{
          background: COLORS.white,
          padding: '60px 20px'
        }}>
          <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
            <div style={{ textAlign: 'center', maxWidth: '720px', margin: '0 auto 36px' }}>
              <h2 style={{
                fontSize: 'clamp(22px, 2.6vw, 28px)',
                fontWeight: '700',
                color: COLORS.charcoal,
                lineHeight: 1.25,
                marginBottom: '12px',
                fontFamily: "'Rubik', sans-serif"
              }}>
                Pick Your Dog&apos;s Favourites From <span style={{ color: COLORS.red }}>8+ Delicious Meat Options</span>
              </h2>
              <p style={{
                fontSize: 'clamp(15px, 1.8vw, 17px)',
                color: COLORS.charcoal,
                opacity: 0.82,
                lineHeight: 1.6,
                margin: 0,
                fontWeight: 400,
                fontFamily: "'Rubik', sans-serif"
              }}>
                Each meal has its own unique flavour and nutritional value.
              </p>
            </div>

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(2, 1fr)',
              gap: '20px 12px',
              justifyItems: 'center',
              maxWidth: '900px',
              margin: '0 auto'
            }} className="protein-grid">
              {[
                { label: 'Chicken', url: 'https://customer-assets.emergentagent.com/job_b68c2142-db90-4d98-9725-e1ffe0396c9b/artifacts/dksu613b_chicken.png' },
                { label: 'Beef', url: 'https://customer-assets.emergentagent.com/job_b68c2142-db90-4d98-9725-e1ffe0396c9b/artifacts/262n9jvl_beef.png' },
                { label: 'Turkey', url: 'https://customer-assets.emergentagent.com/job_b68c2142-db90-4d98-9725-e1ffe0396c9b/artifacts/j6yxejew_turkey.png' },
                { label: 'Duck', url: 'https://customer-assets.emergentagent.com/job_b68c2142-db90-4d98-9725-e1ffe0396c9b/artifacts/s3okrgsw_duck.png' },
                { label: 'Goat', url: 'https://customer-assets.emergentagent.com/job_b68c2142-db90-4d98-9725-e1ffe0396c9b/artifacts/0u52lnr0_goat.png' },
                { label: 'Salmon', url: 'https://customer-assets.emergentagent.com/job_b68c2142-db90-4d98-9725-e1ffe0396c9b/artifacts/l6i3vb5d_salmon.png' },
                { label: 'Lamb', url: 'https://customer-assets.emergentagent.com/job_b68c2142-db90-4d98-9725-e1ffe0396c9b/artifacts/pgajdkxv_lamb.png' },
                { label: 'Rabbit', url: 'https://customer-assets.emergentagent.com/job_b68c2142-db90-4d98-9725-e1ffe0396c9b/artifacts/ptl7se73_rabbit.png' }
              ].map((p) => (
                <button
                  key={p.label}
                  onClick={() => navigate('/menu')}
                  data-testid={`protein-${p.label.toLowerCase()}`}
                  style={{
                    background: 'none',
                    border: 'none',
                    padding: 0,
                    cursor: 'pointer',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '10px'
                  }}
                  onMouseEnter={(e) => {
                    const el = e.currentTarget.querySelector('div');
                    if (el) el.style.transform = 'translateY(-3px)';
                  }}
                  onMouseLeave={(e) => {
                    const el = e.currentTarget.querySelector('div');
                    if (el) el.style.transform = 'translateY(0)';
                  }}
                >
                  <div style={{
                    width: '120px',
                    height: '120px',
                    borderRadius: '50%',
                    background: COLORS.softBg,
                    border: `3px solid ${COLORS.khaki}`,
                    overflow: 'hidden',
                    transition: 'transform 0.2s ease',
                    boxShadow: '3px 3px 0px rgba(0,0,0,0.08)'
                  }}>
                    <img
                      src={p.url}
                      alt={p.label}
                      style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                    />
                  </div>
                  <span style={{
                    fontSize: '15px',
                    fontWeight: 700,
                    color: COLORS.charcoal,
                    fontFamily: "'Rubik', sans-serif"
                  }}>{p.label}</span>
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* ABOUT US / OUR STORY */}
        <section style={{
          background: COLORS.softBg,
          position: 'relative',
          overflow: 'hidden'
        }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            minHeight: '500px'
          }}>
            {/* Image side with overlay */}
            <div style={{
              background: `linear-gradient(135deg, ${COLORS.redOverlay}dd 0%, ${COLORS.red}cc 100%), url(https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=800&h=600&fit=crop) center/cover`,
              minHeight: '400px'
            }} />

            {/* Content side */}
            <div style={{
              padding: '60px 40px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center'
            }}>
              <h2 style={{
                fontSize: 'clamp(22px, 2.8vw, 30px)',
                fontWeight: '700',
                color: COLORS.charcoal,
                marginBottom: '8px',
                fontFamily: "'Rubik', sans-serif"
              }}>
                From Soil to Serving
              </h2>
              <p style={{
                fontSize: '17px',
                color: COLORS.red,
                fontWeight: '600',
                marginBottom: '20px'
              }}>
                Raw Feeding Is A Family Tradition
              </p>
              <p style={{
                fontSize: '16px',
                color: COLORS.charcoal,
                lineHeight: '1.8',
                marginBottom: '20px'
              }}>
                FoeGuard is a family-run business committed to providing pet parents with the same fresh, natural ingredients we expect at our own table. As third-generation Canadian farmers and award-winning German Shepherd breeders with a PhD in biology, we have personally overcome health issues with our own dogs and seen first-hand the benefits of biologically appropriate raw food.
              </p>
              <p style={{
                fontSize: '16px',
                color: COLORS.charcoal,
                lineHeight: '1.8',
                marginBottom: '32px'
              }}>
                What started as helping our neighbours and friends feed their dogs better quickly became a realization — Ontario pet parents deserved better access to trusted, transparent pet nutrition. FoeGuard was created for the community, by the community. Our passion became profession.
              </p>
              <button
                onClick={() => navigate('/about')}
                style={{
                  ...liftedButtonStyle,
                  alignSelf: 'flex-start',
                  background: COLORS.charcoal
                }}
                onMouseEnter={(e) => liftedButtonHover(e, true)}
                onMouseLeave={(e) => liftedButtonHover(e, false)}
              >
                More About Us
              </button>
            </div>
          </div>
        </section>

        {/* FAQ SECTION */}
        <section style={{
          background: COLORS.white,
          padding: '60px 20px'
        }}>
          <div style={{ maxWidth: '800px', margin: '0 auto' }}>
            <h2 style={{
              fontSize: 'clamp(22px, 2.6vw, 28px)',
              fontWeight: '700',
              textAlign: 'center',
              marginBottom: '36px',
              color: COLORS.charcoal,
              fontFamily: "'Rubik', sans-serif"
            }}>
              Frequently Asked <span style={{ color: COLORS.red }}>Questions</span>
            </h2>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {faqs.map((faq, i) => (
                <div key={i} style={{
                  background: COLORS.cream,
                  borderRadius: '12px',
                  overflow: 'hidden',
                  boxShadow: '2px 2px 0px rgba(0,0,0,0.03)'
                }}>
                  <button
                    onClick={() => setActiveFaq(activeFaq === i ? null : i)}
                    style={{
                      width: '100%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '20px 24px',
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      textAlign: 'left'
                    }}
                  >
                    <span style={{ fontSize: '16px', fontWeight: '600', color: COLORS.charcoal }}>
                      {faq.q}
                    </span>
                    <ChevronDown
                      size={20}
                      color={COLORS.charcoal}
                      style={{
                        transform: activeFaq === i ? 'rotate(180deg)' : 'rotate(0)',
                        transition: 'transform 0.3s'
                      }}
                    />
                  </button>
                  {activeFaq === i && (
                    <div style={{
                      padding: '0 24px 20px',
                      fontSize: '15px',
                      color: COLORS.charcoal,
                      opacity: 0.8,
                      lineHeight: '1.6'
                    }}>
                      {faq.a}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FINAL CTA */}
        <section style={{
          background: `linear-gradient(135deg, ${COLORS.red} 0%, ${COLORS.redOverlay} 100%)`,
          padding: '80px 20px',
          textAlign: 'center',
          color: COLORS.cream
        }}>
          <div style={{ maxWidth: '760px', margin: '0 auto' }}>
            <h2 style={{
              fontSize: 'clamp(26px, 3.6vw, 36px)',
              fontWeight: '700',
              marginBottom: '16px',
              color: COLORS.cream,
              fontFamily: "'Rubik', sans-serif"
            }}>
              See the FoeGuard Difference
            </h2>
            <p style={{
              fontSize: 'clamp(16px, 1.8vw, 19px)',
              marginBottom: '32px',
              opacity: 0.95,
              color: COLORS.cream,
              lineHeight: 1.55
            }}>
              Discover the meals that work for your dog, not against them.
            </p>

            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '12px',
              maxWidth: '620px',
              margin: '0 auto 40px'
            }}>
              {[
                'Build your box or your own meal plan. Pause, change or cancel anytime.',
                'Watch your dog thrive as digestion, weight, energy and allergies start to improve.',
                'We deliver straight to your door. Subscribe to save and never run out of food.'
              ].map((line, i) => (
                <div key={i} style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '12px',
                  textAlign: 'left'
                }}>
                  <span style={{
                    flexShrink: 0,
                    width: '22px',
                    height: '22px',
                    borderRadius: '50%',
                    background: COLORS.cream,
                    color: COLORS.red,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '13px',
                    fontWeight: 800,
                    marginTop: '2px'
                  }}>✓</span>
                  <p style={{
                    fontSize: '15px',
                    lineHeight: 1.6,
                    margin: 0,
                    color: COLORS.cream,
                    opacity: 0.95,
                    fontFamily: "'Rubik', sans-serif"
                  }}>
                    {line}
                  </p>
                </div>
              ))}
            </div>

            <button
              onClick={() => navigate('/menu')}
              style={{
                background: COLORS.white,
                color: COLORS.red,
                border: 'none',
                padding: '18px 48px',
                borderRadius: '8px',
                fontSize: '17px',
                fontWeight: '700',
                cursor: 'pointer',
                boxShadow: '4px 4px 0px rgba(0,0,0,0.2)',
                fontFamily: "'Rubik', sans-serif"
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translate(-2px, -2px)';
                e.currentTarget.style.boxShadow = '6px 6px 0px rgba(0,0,0,0.25)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translate(0, 0)';
                e.currentTarget.style.boxShadow = '4px 4px 0px rgba(0,0,0,0.2)';
              }}
            >
              Shop Now
            </button>
          </div>
        </section>
      </main>

      <ModernFooter />
    </>
  );
};

// Re-export shared layout for FAQ/Delivery/etc. pages
export { ModernNavbar, ModernFooter, FoeGuardLogo, COLORS, liftedButtonStyle, liftedButtonHover };

export default LandingPage;
