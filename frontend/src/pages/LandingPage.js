import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Menu, X, ShoppingBag, User, ChevronRight, ChevronDown, Star, Plus, Minus, Sprout, Leaf, ChefHat, Award } from 'lucide-react';
import { useCart, SlideCart } from '../contexts/CartContext';

// FoeGuard Brand Colors — Farm Palette
const COLORS = {
  red: '#C8102E',          // Barn Red — CTAs, logo, nav accent
  redOverlay: '#9D0D23',
  redDark: '#2F4538',      // Footer uses Forest now (was deep red)
  cream: '#F5F3EF',
  softBg: '#E8DFC8',       // Straw
  khaki: '#D8CFB8',
  khakiDark: '#A89B7C',
  charcoal: '#3B2A1A',     // Unified charcoal text colour site-wide (replaces brown brown)
  forestGreen: '#2F4538',
  lightGreen: '#7A9A7A',   // Sage / Light green for Comfort
  harvestGold: '#C9A84C',  // Accent only — badges
  agedWood: '#3B2A1A',
  white: '#F5F3EF'         // No pure white surfaces
};

// Lifted Button Style (compact site-wide standard)
// Lifted Button Style (like Oma's - bordered with shadow on one side)
// Unified across the site — all CTAs use this exact format (Shop Now, Learn More, More About Us, etc.)
const liftedButtonStyle = {
  background: COLORS.red,
  color: COLORS.white,
  border: 'none',
  padding: '12px 28px',
  borderRadius: '8px',
  fontSize: '14px',
  fontWeight: '600',
  letterSpacing: '0.04em',
  textTransform: 'uppercase',
  fontFamily: "'Barlow', sans-serif",
  cursor: 'pointer',
  boxShadow: '4px 4px 0px rgba(0,0,0,0.2)',
  transition: 'all 0.2s ease',
  position: 'relative',
  lineHeight: 1.15,
  display: 'inline-block'
};

const liftedButtonHover = (e, isHover) => {
  if (isHover) {
    e.currentTarget.style.transform = 'translate(-2px, -2px)';
    e.currentTarget.style.boxShadow = '5px 5px 0px rgba(0,0,0,0.22)';
  } else {
    e.currentTarget.style.transform = 'translate(0, 0)';
    e.currentTarget.style.boxShadow = '3px 3px 0px rgba(0,0,0,0.18)';
  }
};

// Outline Lifted Button (compact)
const outlineButtonStyle = {
  background: 'transparent',
  color: COLORS.red,
  border: `1.5px solid ${COLORS.red}`,
  padding: '9px 20px',
  borderRadius: '8px',
  fontSize: '13px',
  fontWeight: '600',
  cursor: 'pointer',
  boxShadow: '3px 3px 0px rgba(200,16,46,0.25)',
  transition: 'all 0.2s ease',
  lineHeight: 1.2
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
      src="https://customer-assets.emergentagent.com/job_build-box-redesign/artifacts/7j9zxw13_FoeGuard%20Official%20Logo_2026.png"
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

  // Reflect FoeGuard menu cart counts (BoxBuilder uses sessionStorage)
  const [menuCount, setMenuCount] = useState(0);
  useEffect(() => {
    const computeMenuCount = () => {
      try {
        const proteins = JSON.parse(sessionStorage.getItem('selectedProteins') || '{}');
        const treats = JSON.parse(sessionStorage.getItem('selectedTreats') || '[]');
        const proteinUnits = Object.values(proteins).filter(p => p && p.qty > 0).length;
        const treatUnits = (treats || []).reduce((s, t) => s + (t.quantity || 1), 0);
        setMenuCount(proteinUnits + treatUnits);
      } catch {
        setMenuCount(0);
      }
    };
    computeMenuCount();
    const id = setInterval(computeMenuCount, 800);
    window.addEventListener('focus', computeMenuCount);
    window.addEventListener('storage', computeMenuCount);
    return () => {
      clearInterval(id);
      window.removeEventListener('focus', computeMenuCount);
      window.removeEventListener('storage', computeMenuCount);
    };
  }, []);
  const totalCount = (cartItems?.length || 0) + menuCount;

  const menuItems = [
    { label: 'Shop Now', path: '/menu' },
    { label: 'Why Raw', path: '/new-to-raw' },
    { label: 'About Us', path: '/about' },
    {
      label: 'Learn More',
      isDropdown: true,
      items: [
        { label: 'FAQ', path: '/faq' },
        { label: 'Delivery Information', path: '/delivery' },
        { label: 'Blog', path: '/blog' },
        { label: 'Dog Food Calculator', path: '/calculator' }
      ]
    },
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
        {/* Top announcement bar — Khaki */}
        <div style={{
          background: COLORS.khaki,
          color: COLORS.charcoal,
          textAlign: 'center',
          padding: '8px 16px',
          fontSize: '13px',
          fontFamily: "'Barlow', sans-serif",
          fontWeight: '500',
          letterSpacing: '0.02em',
          textTransform: 'none'
        }}>
          Free delivery in the GTA over $100
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
              <Menu size={26} color={COLORS.cream} />
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
              <User size={22} color={COLORS.cream} />
            </button>
            <button
              onClick={() => {
                // If on menu/product page, open cart drawer via custom event. Otherwise navigate to /menu.
                const isMenu = window.location.pathname.startsWith('/menu') || window.location.pathname.startsWith('/build-box') || window.location.pathname.startsWith('/product/') || window.location.pathname.startsWith('/treat/');
                if (isMenu) {
                  window.dispatchEvent(new CustomEvent('foeguard:open-cart'));
                } else {
                  setIsCartOpen(true);
                }
              }}
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
              <ShoppingBag size={22} color={COLORS.cream} />
              {totalCount > 0 && (
                <span className="nav-cart-badge" data-testid="nav-cart-badge">
                  {totalCount}
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
            background: COLORS.forestGreen,
            color: COLORS.cream,
            zIndex: 1002,
            padding: '20px',
            overflowY: 'auto'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
              <FoeGuardLogo size="small" />
              <button onClick={() => setMenuOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                <X size={24} color={COLORS.cream} />
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
                          borderBottom: `1px solid rgba(245,243,239,0.18)`,
                          cursor: 'pointer',
                          fontSize: '14px',
                          fontWeight: '700',
                          letterSpacing: '0.08em',
                          textTransform: 'uppercase',
                          fontFamily: "'Barlow', sans-serif",
                          color: COLORS.cream
                        }}
                      >
                        {item.label}
                        <ChevronDown 
                          size={20} 
                          color={COLORS.cream}
                          style={{ transform: resourcesOpen ? 'rotate(180deg)' : 'rotate(0)', transition: 'transform 0.2s' }}
                        />
                      </button>
                      {resourcesOpen && (
                        <div style={{ paddingLeft: '16px', background: 'rgba(0,0,0,0.15)' }}>
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
                                borderBottom: `1px solid rgba(245,243,239,0.12)`,
                                cursor: 'pointer',
                                fontSize: '13px',
                                fontWeight: '500',
                                letterSpacing: '0.06em',
                                textTransform: 'uppercase',
                                fontFamily: "'Barlow', sans-serif",
                                color: COLORS.cream
                              }}
                            >
                              {subItem.label}
                              <ChevronRight size={18} color={COLORS.cream} />
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
                        borderBottom: `1px solid rgba(245,243,239,0.18)`,
                        cursor: 'pointer',
                        fontSize: '14px',
                        fontWeight: '700',
                        letterSpacing: '0.08em',
                        textTransform: 'uppercase',
                        fontFamily: "'Barlow', sans-serif",
                        color: COLORS.cream
                      }}
                    >
                      {item.label}
                      <ChevronRight size={20} color={COLORS.cream} />
                    </button>
                  )}
                </div>
              ))}
            </div>

            <div style={{ marginTop: '32px', paddingTop: '24px' }}>
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
                  fontSize: '13px',
                  fontWeight: '600',
                  letterSpacing: '0.06em',
                  textTransform: 'uppercase',
                  fontFamily: "'Barlow', sans-serif",
                  color: COLORS.cream
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

// Trust Badge Marquee — uses the warm brown so the hero's bottom-fade merges seamlessly
const TrustMarquee = () => {
  const badges = ['Farm Fresh', '100% Canadian', 'Family-Run', 'Organic', 'Human Grade'];
  
  return (
    <div style={{
      background: '#3B2A1A',
      color: COLORS.cream,
      overflow: 'hidden',
      padding: '14px 0',
      marginTop: '0'
    }}>
      <div className="trust-marquee-track" style={{
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

  const footerLinkStyle = {
    display: 'block',
    background: 'none',
    border: 'none',
    padding: 0,
    color: COLORS.cream,
    fontSize: '14px',
    marginBottom: '8px',
    cursor: 'pointer',
    opacity: 0.85,
    textAlign: 'left',
    fontFamily: "'Barlow', sans-serif"
  };

  const footerHeadingStyle = {
    fontSize: '14px',
    fontWeight: '700',
    marginBottom: '14px',
    color: COLORS.cream,
    letterSpacing: '0.04em',
    textTransform: 'uppercase',
    fontFamily: "'Barlow', sans-serif"
  };

  return (
    <footer style={{ background: COLORS.redDark, color: COLORS.cream }}>
      {/* Main footer content */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
        gap: '28px',
        padding: '32px 20px 24px',
        maxWidth: '1200px',
        margin: '0 auto'
      }}>
        {/* Brand column */}
        <div>
          <div style={{ marginBottom: '12px' }}>
            <FoeGuardLogo size="default" />
          </div>
          <p style={{ fontSize: '13px', lineHeight: '1.6', color: COLORS.cream, opacity: 0.85, marginBottom: '20px', fontFamily: "'Barlow', sans-serif" }}>
            FoeGuard Raw Pet Food &mdash; Feeding All Carnivores.
          </p>
          <div style={{ display: 'flex', gap: '10px' }}>
            {['Instagram', 'Facebook'].map(social => (
              <a key={social} href="#" style={{
                width: '36px',
                height: '36px',
                borderRadius: '50%',
                background: COLORS.cream,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: COLORS.redDark,
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
          <h4 style={footerHeadingStyle}>Shop</h4>
          {[
            { label: 'Raw Dog Food', to: '/menu' },
            { label: 'Meaty Treats', to: '/menu/treats' },
            { label: 'Build Meal Plan', to: '/meal-plan' },
            { label: 'Dog Food Calculator', to: '/calculator' }
          ].map(item => (
            <button key={item.label} onClick={() => navigate(item.to)} style={footerLinkStyle}>
              {item.label}
            </button>
          ))}
        </div>

        {/* Help column */}
        <div>
          <h4 style={footerHeadingStyle}>Help</h4>
          {[
            { label: 'Contact Us', to: '/contact' },
            { label: 'FAQs', to: '/faq' },
            { label: 'Delivery Information', to: '/delivery' },
            { label: 'Returns', to: '/policies' }
          ].map(item => (
            <button key={item.label} onClick={() => navigate(item.to)} style={footerLinkStyle}>
              {item.label}
            </button>
          ))}
        </div>

        {/* Company column */}
        <div>
          <h4 style={footerHeadingStyle}>Company</h4>
          {[
            { label: 'About Us', to: '/about' },
            { label: 'Why Raw?', to: '/new-to-raw' },
            { label: 'Blog', to: '/blog' },
            { label: 'Privacy Policy', to: '/policies' },
            { label: 'Terms of Service', to: '/terms' }
          ].map(item => (
            <button key={item.label} onClick={() => navigate(item.to)} style={footerLinkStyle}>
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {/* Bottom bar */}
      <div style={{
        borderTop: `1px solid rgba(255,255,255,0.15)`,
        padding: '12px 20px',
        textAlign: 'center',
        fontSize: '12px',
        color: COLORS.cream,
        opacity: 0.75
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

  // Routes "Shop Now" to whichever choice the user last picked in the funnel.
  // - selection = 'meal-plan' → /meal-plan
  // - selection = 'shop-raw'  → /menu (raw food menu)
  // - no selection            → /menu (which will open the funnel on landing)
  const goShopNow = () => {
    const sel = sessionStorage.getItem('foeguard_selection');
    if (sel === 'meal-plan') navigate('/meal-plan');
    else navigate('/menu');
  };

  const faqs = [
    {
      q: "How much raw should I feed?",
      a: (
        <>
          Adults feed roughly 2–3.5% of body weight per day; puppies feed more (up to 10–13% at 2–4 months, scaling down with age). Use our <a href="/calculator" style={{ color: COLORS.red, fontWeight: 700, textDecoration: 'underline' }}>feeding calculator</a> for a personalized portion in seconds.
        </>
      )
    },
    {
      q: "How to transition my dog or cat to raw?",
      a: "We recommend a 7–10 day gradual transition, mixing increasing amounts of FoeGuard with your pet's current food until they're on 100% raw. Feed slightly smaller portions during the switch, watch stool consistency, and skip introducing new treats. Our team is one message away if you need help."
    },
    {
      q: "Can puppies/seniors eat raw food?",
      a: "Absolutely — both thrive on it. Our Comfort Dinner line is complete & balanced for all life stages (AAFCO). Puppies need more food per kg of body weight and specially ground recipes for easy digestion — we carry puppy-friendly options across every protein."
    },
    {
      q: "Are your meals complete and balanced?",
      a: "Yes. Our Comfort Dinner recipes are complete and balanced to AAFCO standards — no supplementation needed. Primal Feast follows a traditional 80/10/10 raw ratio and is designed for rotational feeding or topping where you can add your own supplementation."
    },
    {
      q: "Where do your ingredients come from?",
      a: "All of our meats are sourced directly from our own farm in Acton, ON and a small group of hand-picked Ontario partners we know personally. Every recipe is prepared in our government-regulated, human-grade kitchen — high quality, consistent and fully traceable."
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
        {/* HERO SECTION — full-bleed background image with left text overlay + bottom fade to dark */}
        <section
          className="hero-section"
          style={{
            position: 'relative',
            overflow: 'hidden',
            background: `#3B2A1A url('https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=2200&h=1400&fit=crop') center/cover no-repeat`,
            minHeight: 'clamp(540px, 140vw, 640px)',
            display: 'flex',
            alignItems: 'center',
            marginTop: '-120px'
          }}
        >
          {/* Left fade overlay — makes text readable on the image (warm brown tones) */}
          <div
            aria-hidden="true"
            style={{
              position: 'absolute',
              inset: 0,
              background: `linear-gradient(90deg, rgba(59,42,26,0.62) 0%, rgba(59,42,26,0.38) 35%, rgba(59,42,26,0.08) 60%, rgba(59,42,26,0) 80%)`,
              pointerEvents: 'none'
            }}
          />
          {/* Bottom fade — fully transparent at top so no visible seam, fades to brown at the bottom merging into TrustMarquee */}
          <div
            aria-hidden="true"
            style={{
              position: 'absolute',
              left: 0,
              right: 0,
              bottom: 0,
              height: '40%',
              background: `linear-gradient(180deg, rgba(59,42,26,0) 0%, rgba(59,42,26,0.6) 60%, #3B2A1A 100%)`,
              pointerEvents: 'none'
            }}
          />

          {/* Content */}
          <div style={{
            position: 'relative',
            zIndex: 1,
            maxWidth: '1200px',
            margin: '0 auto',
            padding: 'clamp(140px, 16vw, 180px) 24px clamp(24px, 3vw, 44px)',
            width: '100%'
          }}>
            <div className="hero-text" style={{ maxWidth: '620px' }}>
              <h1 style={{
                fontSize: 'clamp(32px, 5vw, 48px)',
                fontWeight: 600,
                color: COLORS.cream,
                lineHeight: '1.15',
                marginBottom: '14px',
                fontFamily: "'Lora', serif",
                letterSpacing: '-0.3px',
                textShadow: '0 3px 14px rgba(0,0,0,0.35)',
                maxWidth: '580px'
              }}>
                The freshest meal your dog has ever eaten &mdash; made just for them.
              </h1>

              <p style={{
                fontSize: 'clamp(15px, 1.7vw, 17px)',
                color: COLORS.cream,
                opacity: 0.94,
                maxWidth: '520px',
                margin: '0 0 20px',
                lineHeight: '1.55',
                fontWeight: 400,
                fontFamily: "'Barlow', sans-serif",
                textShadow: '0 1px 6px rgba(0,0,0,0.45)'
              }}>
                We grow it, make it fresh to your order and deliver it ourselves &mdash; 100% organic, human grade ingredients from our Ontario farm to your dog&apos;s bowl.
              </p>

              <button
                onClick={goShopNow}
                data-testid="hero-shop-now"
                style={{
                  ...liftedButtonStyle,
                  background: COLORS.forestGreen,
                  color: COLORS.cream
                }}
                onMouseEnter={(e) => liftedButtonHover(e, true)}
                onMouseLeave={(e) => liftedButtonHover(e, false)}
              >
                Shop Now
              </button>
              <p
                data-testid="hero-guarantee"
                style={{
                  fontSize: '13px',
                  color: COLORS.cream,
                  opacity: 0.92,
                  margin: '12px 0 0',
                  lineHeight: 1.5,
                  fontFamily: "'Barlow', sans-serif",
                  textShadow: '0 1px 6px rgba(0,0,0,0.45)',
                  maxWidth: '460px'
                }}
              >
                A happy dog or your money back &mdash; guaranteed.{' '}
                <a
                  href="/faq#happy-dog-guarantee"
                  data-testid="hero-guarantee-terms"
                  onClick={(e) => { e.preventDefault(); navigate('/faq#happy-dog-guarantee'); }}
                  style={{
                    color: COLORS.cream,
                    opacity: 0.85,
                    textDecoration: 'underline',
                    fontSize: '12px',
                    marginLeft: '4px',
                    fontFamily: "'Barlow', sans-serif"
                  }}
                >
                  See terms.
                </a>
              </p>
            </div>
          </div>
        </section>

        {/* TRUST MARQUEE */}
        <TrustMarquee />

        {/* COLLECTION CARDS - "Shop Farm Fresh" */}
        <section style={{
          background: COLORS.cream,
          padding: '18px 20px 36px'
        }}>
          <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
            <h2 style={{
              fontSize: 'clamp(30px, 3.6vw, 40px)',
              fontWeight: '700',
              textAlign: 'center',
              marginBottom: '20px',
              color: COLORS.charcoal,
              fontFamily: "'Lora', serif"
            }}>
              Shop farm fresh
            </h2>

            <div className="shop-farm-fresh-grid">
              {[
                {
                  title: 'Build your meal plan',
                  desc: 'Take our simple quiz to receive your customized raw feeding plan in seconds.',
                  image: 'https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=600&h=400&fit=crop&auto=format',
                  path: '/meal-plan',
                  selection: 'meal-plan',
                  cta: 'Get Started'
                },
                {
                  title: 'Raw Dog Food menu',
                  desc: 'Fresh food that is easy to portion and serve, ensuring balanced, nutritious meals every day.',
                  image: 'https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=600&h=400&fit=crop&auto=format',
                  path: '/menu',
                  selection: 'shop-raw',
                  cta: 'Order Now'
                },
                {
                  title: 'Raw Cat Food menu',
                  desc: 'Complete raw meals crafted for cats &mdash; high-protein, taurine-rich and made fresh from our farm.',
                  image: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=600&h=400&fit=crop&auto=format',
                  path: '/menu',
                  selection: 'shop-raw',
                  petType: 'cat',
                  cta: 'Order Now'
                }
              ].map((card, i) => (
                <button
                  key={i}
                  onClick={() => {
                    if (card.selection) sessionStorage.setItem('foeguard_selection', card.selection);
                    if (card.petType) sessionStorage.setItem('foeguard_pet_type', card.petType);
                    else sessionStorage.removeItem('foeguard_pet_type');
                    navigate(card.path);
                  }}
                  className="shop-farm-fresh-card"
                  style={{
                    background: COLORS.cream,
                    border: `1px solid ${COLORS.khaki}`,
                    borderRadius: '8px',
                    overflow: 'hidden',
                    cursor: 'pointer',
                    textAlign: 'left',
                    boxShadow: 'none'
                  }}
                >
                  <div className="shop-farm-fresh-img" style={{
                    height: '200px',
                    background: `url(${card.image}) center top / cover no-repeat`
                  }} />
                  <div className="shop-farm-fresh-body" style={{ padding: '24px' }}>
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
          background: COLORS.white,
          padding: '28px 20px 36px'
        }}>
          <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
            {/* Headline */}
            <div style={{ textAlign: 'center', marginBottom: '20px', maxWidth: '820px', marginLeft: 'auto', marginRight: 'auto' }}>
              <h2 style={{
                fontSize: 'clamp(30px, 3.6vw, 40px)',
                fontWeight: 600,
                color: COLORS.charcoal,
                lineHeight: 1.2,
                marginBottom: '14px',
                fontFamily: "'Lora', serif"
              }}>
                From our Acton farm to your dog&apos;s bowl.
              </h2>
              <p style={{
                fontSize: 'clamp(15px, 1.7vw, 17px)',
                fontWeight: 400,
                color: COLORS.charcoal,
                lineHeight: 1.6,
                margin: 0,
                fontFamily: "'Barlow', sans-serif"
              }}>
                We raise and grow almost all of our ingredients. Every meal is made fresh weekly in our human-grade kitchen. No retail markups, no vague labels, no low-quality meat. Just real, complete meals you and your dog can both feel good about.
              </p>
            </div>

            {/* Image + Benefits grid */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'minmax(0, 0.7fr) minmax(0, 1.3fr)',
              gap: '40px',
              alignItems: 'center'
            }} className="why-fg-grid">
              {/* Image side — sized to roughly match benefit text block */}
              <div style={{
                position: 'relative',
                borderRadius: '8px',
                overflow: 'hidden',
                maxHeight: '360px',
                maxWidth: '360px',
                width: '100%',
                margin: '0 auto'
              }}>
                <img
                  src="https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=600&h=600&fit=crop"
                  alt="Happy dog"
                  style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                />
              </div>

              {/* 4 Benefits — clean rows, hairline dividers, no pill background */}
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                {[
                  { Icon: Sprout, title: 'Farm Fresh', desc: 'Locally sourced and hand-crafted in small batches every week.' },
                  { Icon: Leaf, title: '100% Organic', desc: 'Raised on open pastures, clean feed and without hormones, fillers or additives.' },
                  { Icon: ChefHat, title: 'Human Grade', desc: 'Real food meals prepared in our Ontario regulated human food kitchen.' },
                  { Icon: Award, title: 'Complete Nutrition', desc: 'Biologically appropriate (BARF) and made to AAFCO standards. No balancing or supplements needed.' }
                ].map((item, i, arr) => {
                  const Icon = item.Icon;
                  const isLast = i === arr.length - 1;
                  return (
                    <div key={i} style={{
                      display: 'flex',
                      gap: '18px',
                      padding: '20px 4px',
                      alignItems: 'flex-start',
                      borderBottom: isLast ? 'none' : `1px solid ${COLORS.khaki}`
                    }}>
                      <div style={{
                        width: '44px',
                        height: '44px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0
                      }}>
                        <Icon size={28} color={COLORS.red} strokeWidth={2} />
                      </div>
                      <div>
                        <h4 style={{
                          fontSize: '17px',
                          fontWeight: 800,
                          color: COLORS.charcoal,
                          margin: '0 0 4px',
                          fontFamily: "'Lora', serif"
                        }}>
                          {item.title}
                        </h4>
                        <p style={{
                          fontSize: '14px',
                          color: COLORS.charcoal,
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
          padding: '28px 20px 36px',
          color: COLORS.cream
        }}>
          <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
            <div style={{ textAlign: 'center', maxWidth: '720px', margin: '0 auto 20px' }}>
              <h2 style={{
                fontSize: 'clamp(30px, 3.6vw, 40px)',
                fontWeight: 600,
                marginBottom: '12px',
                fontFamily: "'Lora', serif",
                lineHeight: 1.2,
                color: COLORS.white
              }}>
                Customers Start to See Benefits in Just 2 Weeks
              </h2>
              <p style={{
                fontSize: 'clamp(15px, 1.8vw, 17px)',
                opacity: 1,
                margin: 0,
                fontWeight: 400,
                lineHeight: 1.6,
                color: COLORS.softBg
              }}>
                Here&apos;s what you can expect from real food nutrition:
              </p>
            </div>

            <div className="benefits-2week-grid" style={{
              display: 'grid',
              gap: '14px',
              marginBottom: '20px'
            }}>
              {[
                { title: 'Improved Digestibility', desc: 'Less gas, less bloat, more comfort.' },
                { title: 'Healthier Skin & Coat', desc: 'Real nutrients absorbed from the inside out.' },
                { title: 'More Stable Energy', desc: 'No crashes from fillers or artificial ingredients.' },
                { title: 'Muscle Condition Improves', desc: 'Without overfeeding or additional toppers.' },
                { title: 'Smaller, Firm Stools', desc: 'A sign your dog is actually absorbing what they eat.' },
                { title: 'Stronger, Cleaner Teeth', desc: 'Less chewing residue and plaque buildup over time.' }
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
                      fontWeight: '700',
                      marginBottom: '4px',
                      fontFamily: "'Barlow', sans-serif",
                      lineHeight: 1.3,
                      color: COLORS.cream,
                      letterSpacing: '0.02em'
                    }}>{benefit.title}</div>
                    <div style={{
                      fontSize: '13px',
                      opacity: 0.9,
                      lineHeight: 1.5,
                      color: COLORS.softBg
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

        {/* REVIEWS SECTION — uniform card horizontal feed (uma's pride style) */}
        <section style={{
          background: COLORS.cream,
          padding: '28px 0 36px',
          position: 'relative',
          overflow: 'hidden'
        }}>
          <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 20px' }}>
            <h2 style={{
              fontSize: 'clamp(30px, 3.6vw, 40px)',
              fontWeight: '700',
              textAlign: 'center',
              marginBottom: '8px',
              color: COLORS.charcoal,
              fontFamily: "'Lora', serif"
            }}>
              Hear from Happy FoeGuardians
            </h2>
            <p style={{ textAlign: 'center', color: COLORS.charcoal, marginBottom: '18px', maxWidth: '720px', marginLeft: 'auto', marginRight: 'auto', lineHeight: 1.55, fontSize: '16px', fontFamily: "'Barlow', sans-serif" }}>
              Real food shows real results.
            </p>
          </div>

          {/* Horizontal scroll feed — uniform slim cards, alternating review / full photo */}
          <div
            className="review-feed"
            data-testid="review-feed"
            style={{
              display: 'flex',
              gap: '18px',
              overflowX: 'auto',
              scrollSnapType: 'x mandatory',
              padding: '12px max(20px, calc((100vw - 1200px) / 2 + 20px)) 32px',
              WebkitOverflowScrolling: 'touch',
              justifyContent: 'flex-start'
            }}
          >
            {(() => {
              // Interleave review cards with photo-only cards.
              // 6 reviews + 6 extra photos (indexes 6..11) = 12 uniform slim cards
              const CARD_W = 'clamp(220px, 72vw, 260px)';
              const tiles = [];
              let extraPhotoIdx = reviews.length; // start at 6
              reviews.forEach((r, i) => {
                // Review card
                tiles.push(
                  <article
                    key={`review-${i}`}
                    className="review-card"
                    style={{
                      flex: '0 0 auto',
                      width: CARD_W,
                      scrollSnapAlign: 'center',
                      background: COLORS.white,
                      borderRadius: '8px',
                      border: `1px solid ${COLORS.khaki}`,
                      boxShadow: '4px 4px 0px rgba(0,0,0,0.08)',
                      overflow: 'hidden',
                      display: 'flex',
                      flexDirection: 'column'
                    }}
                  >
                    <div style={{
                      width: '100%',
                      aspectRatio: '1 / 1',
                      backgroundImage: `url(${r.img})`,
                      backgroundSize: 'cover',
                      backgroundPosition: 'center'
                    }} />
                    <div style={{
                      padding: '14px 16px 16px',
                      flex: 1,
                      display: 'flex',
                      flexDirection: 'column'
                    }}>
                      <div style={{ display: 'flex', gap: '2px', marginBottom: '8px' }}>
                        {[1,2,3,4,5].map(s => <Star key={s} size={13} fill={COLORS.red} color={COLORS.red} />)}
                      </div>
                      <p style={{
                        fontSize: '13px',
                        color: COLORS.charcoal,
                        lineHeight: '1.55',
                        marginBottom: '10px',
                        fontStyle: 'italic',
                        flex: 1
                      }}>
                        {`"${r.text}"`}
                      </p>
                      <p style={{
                        fontSize: '12px',
                        fontWeight: '700',
                        color: COLORS.red,
                        margin: 0,
                        fontFamily: "'Lora', serif"
                      }}>
                        — {r.name}
                      </p>
                    </div>
                  </article>
                );
                // Full-photo card (no review text) — alternates after each review
                if (extraPhotoIdx < 12) {
                  tiles.push(
                    <div
                      key={`photo-${extraPhotoIdx}`}
                      className="review-photo-card"
                      style={{
                        flex: '0 0 auto',
                        width: CARD_W,
                        scrollSnapAlign: 'center',
                        borderRadius: '8px',
                        border: `1px solid ${COLORS.khaki}`,
                        boxShadow: '4px 4px 0px rgba(0,0,0,0.08)',
                        overflow: 'hidden',
                        backgroundImage: `url(${CUSTOMER_IMG(extraPhotoIdx)})`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        backgroundColor: COLORS.softBg
                      }}
                    />
                  );
                  extraPhotoIdx++;
                }
              });
              return tiles;
            })()}
          </div>
        </section>

        {/* PROTEIN OPTIONS — 8+ Meat Options */}
        <section style={{
          background: COLORS.white,
          padding: '28px 20px 36px'
        }}>
          <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
            <div style={{ textAlign: 'center', maxWidth: '720px', margin: '0 auto 20px' }}>
              <h2 style={{
                fontSize: 'clamp(30px, 3.6vw, 40px)',
                fontWeight: 600,
                color: COLORS.charcoal,
                lineHeight: 1.2,
                marginBottom: '12px',
                fontFamily: "'Lora', serif"
              }}>
                Pick your dog&apos;s favourites from 8 proteins
              </h2>
              <p style={{
                fontSize: 'clamp(15px, 1.7vw, 17px)',
                color: COLORS.charcoal,
                lineHeight: 1.6,
                margin: 0,
                fontWeight: 400,
                fontFamily: "'Barlow', sans-serif"
              }}>
                Every protein is raised on our farm &mdash; each with its own flavour, benefits and nutritional profile.
              </p>
            </div>

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(2, 1fr)',
              gap: '24px 16px',
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
                    alignItems: 'stretch',
                    gap: '10px',
                    textAlign: 'left'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.opacity = '0.92';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.opacity = '1';
                  }}
                >
                  <div style={{
                    width: '100%',
                    aspectRatio: '4 / 3',
                    borderRadius: '12px',
                    overflow: 'hidden',
                    background: 'transparent',
                    transition: 'opacity 0.2s ease'
                  }}>
                    <img
                      src={p.url}
                      alt={p.label}
                      style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                    />
                  </div>
                  <span style={{
                    fontSize: '16px',
                    fontWeight: 700,
                    color: COLORS.charcoal,
                    fontFamily: "'Barlow', sans-serif",
                    textAlign: 'left'
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
            minHeight: '420px'
          }}>
            {/* Image side with overlay */}
            <div style={{
              background: `linear-gradient(135deg, ${COLORS.redOverlay}dd 0%, ${COLORS.red}cc 100%), url(https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=800&h=600&fit=crop) center/cover`,
              minHeight: '320px'
            }} />

            {/* Content side */}
            <div style={{
              padding: '28px 24px 32px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center'
            }}>
              <h2 style={{
                fontSize: 'clamp(30px, 3.6vw, 40px)',
                fontWeight: 600,
                color: COLORS.charcoal,
                marginBottom: '14px',
                fontFamily: "'Lora', serif",
                lineHeight: 1.2
              }}>
                Where real food became a family tradition
              </h2>
              <p style={{
                fontSize: '16px',
                color: COLORS.charcoal,
                lineHeight: '1.65',
                marginBottom: '14px',
                fontFamily: "'Barlow', sans-serif"
              }}>
                FoeGuard started because of one dog. When we couldn&apos;t find raw food made to our standards as third-generation farmers, we made it ourselves. Before long our neighbours were asking for meals &mdash; then their friends were too.
              </p>
              <p style={{
                fontSize: '16px',
                color: COLORS.charcoal,
                lineHeight: '1.65',
                marginBottom: '20px',
                fontFamily: "'Barlow', sans-serif"
              }}>
                What started on our small farm in Acton grew into something bigger &mdash; built by the community, for the community. If you&apos;re here reading this, your story might not be so different.
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
          padding: '28px 20px 36px'
        }}>
          <div style={{ maxWidth: '800px', margin: '0 auto' }}>
            <h2 style={{
              fontSize: 'clamp(30px, 3.6vw, 40px)',
              fontWeight: '700',
              textAlign: 'center',
              marginBottom: '20px',
              color: COLORS.charcoal,
              fontFamily: "'Lora', serif"
            }}>
              Frequently Asked Questions
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

        {/* SECTION 9 — READY TO MAKE THE SWITCH? (final CTA) */}
        <section style={{
          background: COLORS.redOverlay,
          padding: '32px 20px 36px',
          textAlign: 'center',
          color: COLORS.cream
        }}>
          <div style={{ maxWidth: '760px', margin: '0 auto' }}>
            <h2 style={{
              fontSize: 'clamp(30px, 3.6vw, 40px)',
              fontWeight: 600,
              marginBottom: '12px',
              color: COLORS.cream,
              fontFamily: "'Lora', serif",
              lineHeight: 1.2
            }}>
              Your dog&apos;s healthiest days start now.
            </h2>
            <p style={{
              fontSize: 'clamp(16px, 1.8vw, 19px)',
              marginBottom: '20px',
              opacity: 0.95,
              color: COLORS.cream,
              lineHeight: 1.55,
              fontFamily: "'Barlow', sans-serif"
            }}>
              Farm-fresh, made to order raw meals &mdash; raised right here in Ontario.
            </p>
            <button
              data-testid="final-cta-shop-now"
              onClick={goShopNow}
              style={{
                ...liftedButtonStyle,
                background: COLORS.forestGreen,
                color: COLORS.cream
              }}
              onMouseEnter={(e) => liftedButtonHover(e, true)}
              onMouseLeave={(e) => liftedButtonHover(e, false)}
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
