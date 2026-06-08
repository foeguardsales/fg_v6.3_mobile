import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Menu, X, ShoppingBag, User, ChevronRight, ChevronDown, Star, Plus, Minus, Sprout, Leaf, ChefHat, Award } from 'lucide-react';
import { useCart, SlideCart } from '../contexts/CartContext';

// FoeGuard Brand Colors
const COLORS = {
  red: '#c8102e',
  redOverlay: '#9D0D23',
  cream: '#f5f3ef',
  softBg: '#f0ece6',
  khaki: '#D8CFB8',
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
        background: COLORS.red,
        borderBottom: `3px solid ${COLORS.khakiDark}`
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
          Free shipping on all orders over $149
        </div>
        
        {/* Main navbar — 3-col grid so center logo stays centered on every viewport */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr auto 1fr',
          alignItems: 'center',
          padding: '2px 20px',
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
      <div aria-hidden="true" style={{ height: '108px', flexShrink: 0 }} />

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
      background: COLORS.lightGreen,
      color: COLORS.white,
      overflow: 'hidden',
      padding: '8px 0',
      marginTop: '-1px'
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
    <footer style={{ background: COLORS.charcoal, color: COLORS.cream }}>
      {/* Main footer content */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
        gap: '40px',
        padding: '60px 20px',
        maxWidth: '1200px',
        margin: '0 auto'
      }}>
        {/* Brand column */}
        <div>
          <div style={{ marginBottom: '16px' }}>
            <FoeGuardLogo size="default" />
          </div>
          <p style={{ fontSize: '14px', lineHeight: '1.7', color: COLORS.khaki, marginBottom: '24px' }}>
            Ontario&apos;s #1 farm-to-bowl raw dog food delivery. Real, fresh, complete nutrition for your best friend.
          </p>
          <div style={{ display: 'flex', gap: '12px' }}>
            {['Instagram', 'Facebook'].map(social => (
              <a key={social} href="#" style={{
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                background: COLORS.forestGreen,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: COLORS.cream,
                fontSize: '12px',
                textDecoration: 'none'
              }}>
                {social[0]}
              </a>
            ))}
          </div>
        </div>

        {/* Shop column */}
        <div>
          <h4 style={{ fontSize: '16px', fontWeight: '700', marginBottom: '20px', color: COLORS.white }}>Shop</h4>
          {['Raw Dog Food', 'Meaty Treats', 'Build Meal Plan', 'Dog Food Calculator'].map(item => (
            <a key={item} href="#" style={{
              display: 'block',
              color: COLORS.khaki,
              fontSize: '14px',
              marginBottom: '12px',
              textDecoration: 'none'
            }}>
              {item}
            </a>
          ))}
        </div>

        {/* Help column */}
        <div>
          <h4 style={{ fontSize: '16px', fontWeight: '700', marginBottom: '20px', color: COLORS.white }}>Help</h4>
          {['Contact Us', 'FAQs', 'Delivery Information', 'Returns'].map(item => (
            <a key={item} href="#" style={{
              display: 'block',
              color: COLORS.khaki,
              fontSize: '14px',
              marginBottom: '12px',
              textDecoration: 'none'
            }}>
              {item}
            </a>
          ))}
        </div>

        {/* Company column */}
        <div>
          <h4 style={{ fontSize: '16px', fontWeight: '700', marginBottom: '20px', color: COLORS.white }}>Company</h4>
          {['About Us', 'Why Raw?', 'Blog', 'Privacy Policy', 'Terms of Service'].map(item => (
            <a key={item} href="#" style={{
              display: 'block',
              color: COLORS.khaki,
              fontSize: '14px',
              marginBottom: '12px',
              textDecoration: 'none'
            }}>
              {item}
            </a>
          ))}
        </div>
      </div>

      {/* Bottom bar */}
      <div style={{
        borderTop: `1px solid ${COLORS.forestGreen}`,
        padding: '20px',
        textAlign: 'center',
        fontSize: '13px',
        color: COLORS.khaki
      }}>
        © 2025 FoeGuard. All rights reserved. Made with ❤️ in Ontario, Canada.
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

  const reviews = [
    { name: "Sarah M.", text: "No more stomach issues, and his coat looks amazing. Definitely worth the switch!", rating: 5 },
    { name: "Michael T.", text: "My dog has been on FoeGuard for 6 months and the difference in energy is incredible!", rating: 5 },
    { name: "Jennifer K.", text: "Finally found a raw food I can trust. The quality is obvious and my pup loves it.", rating: 5 },
    { name: "David R.", text: "The convenience of delivery plus the health benefits - it's a no-brainer.", rating: 5 }
  ];

  return (
    <>
      <ModernNavbar />
      <SlideCart />
      
      <main>
        {/* HERO SECTION */}
        <section style={{
          background: `linear-gradient(135deg, ${COLORS.cream} 0%, ${COLORS.softBg} 100%)`,
          padding: '40px 20px 80px',
          position: 'relative',
          overflow: 'hidden'
        }}>
          {/* Bottom gradient mask blending into next section */}
          <div aria-hidden="true" style={{
            position: 'absolute',
            left: 0,
            right: 0,
            bottom: 0,
            height: '120px',
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
                Restore your dog&apos;s digestion, energy and comfort from the inside out with freshly made, real raw pet nutrition.
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
          padding: '80px 20px'
        }}>
          <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
            <h2 style={{
              fontSize: '36px',
              fontWeight: '700',
              textAlign: 'center',
              marginBottom: '48px',
              color: COLORS.charcoal
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
          padding: '80px 20px'
        }}>
          <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
            {/* Headline */}
            <div style={{ textAlign: 'center', marginBottom: '48px', maxWidth: '820px', marginLeft: 'auto', marginRight: 'auto' }}>
              <h2 style={{
                fontSize: 'clamp(22px, 2.6vw, 28px)',
                fontWeight: 400,
                color: COLORS.charcoal,
                lineHeight: 1.5,
                marginBottom: '0',
                fontFamily: "'Rubik', sans-serif",
                letterSpacing: '0'
              }}>
                By delivering directly to you, we&apos;re able to invest more into better, fresher and ethically raised ingredients. Something <span style={{ color: COLORS.red, fontWeight: 600 }}>you and your best friend</span> can both feel good about.
              </h2>
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
                  { Icon: Leaf, title: '100% Organic', desc: 'Raised without additives, preservatives, fillers, antibiotics or hormones.' },
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
          background: COLORS.lightGreen,
          padding: '80px 20px',
          color: COLORS.white
        }}>
          <div style={{ maxWidth: '1000px', margin: '0 auto', textAlign: 'center' }}>
            <h2 style={{ fontSize: 'clamp(26px, 3.6vw, 36px)', fontWeight: '700', marginBottom: '16px', fontFamily: "'Rubik', sans-serif" }}>
              Customers Often See Benefits in Just <span style={{ color: COLORS.cream }}>2 Weeks</span>
            </h2>
            <p style={{ fontSize: '17px', opacity: 0.95, marginBottom: '48px', fontWeight: 400 }}>
              Help your dog live their best life by changing how they feel, look and act on a day-to-day basis.
            </p>

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '20px'
            }}>
              {[
                { icon: '💪', title: 'Improved Digestion', desc: 'Easier on the stomach' },
                { icon: '✨', title: 'Shinier Coat', desc: 'Healthier skin & fur' },
                { icon: '⚡', title: 'More Energy', desc: 'Active & playful' },
                { icon: '🏃', title: 'Healthy Weight', desc: 'Lean muscle mass' }
              ].map((benefit, i) => (
                <div key={i} style={{
                  background: 'rgba(255,255,255,0.15)',
                  padding: '28px 20px',
                  borderRadius: '16px'
                }}>
                  <div style={{ fontSize: '36px', marginBottom: '12px' }}>{benefit.icon}</div>
                  <h4 style={{ fontSize: '17px', fontWeight: '700', marginBottom: '6px' }}>{benefit.title}</h4>
                  <p style={{ fontSize: '14px', opacity: 0.85, margin: 0 }}>{benefit.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* REVIEWS SECTION */}
        <section style={{
          background: COLORS.cream,
          padding: '80px 20px'
        }}>
          <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
            <h2 style={{
              fontSize: '36px',
              fontWeight: '700',
              textAlign: 'center',
              marginBottom: '16px',
              color: COLORS.charcoal
            }}>
              Hear from Happy <span style={{ color: COLORS.red }}>FoeGuardians</span>
            </h2>
            <p style={{ textAlign: 'center', color: COLORS.charcoal, opacity: 0.7, marginBottom: '48px' }}>
              Real reviews from real pet parents
            </p>

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: '20px'
            }}>
              {reviews.map((review, i) => (
                <div key={i} style={{
                  background: COLORS.white,
                  padding: '28px',
                  borderRadius: '16px',
                  boxShadow: '4px 4px 0px rgba(0,0,0,0.05)'
                }}>
                  <div style={{ display: 'flex', gap: '4px', marginBottom: '14px' }}>
                    {[1,2,3,4,5].map(s => <Star key={s} size={16} fill={COLORS.red} color={COLORS.red} />)}
                  </div>
                  <p style={{
                    fontSize: '15px',
                    color: COLORS.charcoal,
                    lineHeight: '1.6',
                    marginBottom: '18px',
                    fontStyle: 'italic'
                  }}>
                    {`"${review.text}"`}
                  </p>
                  <p style={{
                    fontSize: '14px',
                    fontWeight: '600',
                    color: COLORS.charcoal,
                    margin: 0
                  }}>
                    — {review.name}
                  </p>
                </div>
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
                fontSize: '32px',
                fontWeight: '700',
                color: COLORS.charcoal,
                marginBottom: '8px'
              }}>
                From Soil to Serving
              </h2>
              <p style={{
                fontSize: '20px',
                color: COLORS.red,
                fontWeight: '600',
                marginBottom: '24px'
              }}>
                Raw Feeding Is A Family Tradition
              </p>
              <p style={{
                fontSize: '16px',
                color: COLORS.charcoal,
                lineHeight: '1.8',
                marginBottom: '24px'
              }}>
                FoeGuard is a family-run business committed to providing pet parents with the same fresh, natural ingredients we expect at our own table. As third generation Canadian Farmers and award-winning German Shepherd breeders with a PhD in biology, we have seen the benefits of biologically appropriate raw food first-hand.
              </p>
              <p style={{
                fontSize: '16px',
                color: COLORS.charcoal,
                lineHeight: '1.8',
                marginBottom: '32px'
              }}>
                What began as helping our neighbours and friends with their dogs meals became a realization that Ontario pet parents needed better access to trusted, transparent pet nutrition. Our passion became profession, FoeGuard was born!
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
          padding: '80px 20px'
        }}>
          <div style={{ maxWidth: '800px', margin: '0 auto' }}>
            <h2 style={{
              fontSize: '36px',
              fontWeight: '700',
              textAlign: 'center',
              marginBottom: '48px',
              color: COLORS.charcoal
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
          color: COLORS.white
        }}>
          <div style={{ maxWidth: '700px', margin: '0 auto' }}>
            <h2 style={{ fontSize: '36px', fontWeight: '700', marginBottom: '16px' }}>
              See the FoeGuard Difference
            </h2>
            <p style={{ fontSize: '20px', marginBottom: '32px', opacity: 0.95 }}>
              Discover the meals that work for your dog, not against them.
            </p>

            <div style={{
              display: 'flex',
              flexWrap: 'wrap',
              justifyContent: 'center',
              gap: '12px',
              marginBottom: '40px'
            }}>
              {[
                'Build your box or meal plan',
                'Pause, change or cancel anytime',
                'Watch your dog thrive',
                'Delivered to your door'
              ].map((item, i) => (
                <span key={i} style={{
                  background: 'rgba(255,255,255,0.2)',
                  padding: '10px 18px',
                  borderRadius: '8px',
                  fontSize: '14px',
                  fontWeight: '500'
                }}>
                  ✓ {item}
                </span>
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
                boxShadow: '4px 4px 0px rgba(0,0,0,0.2)'
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
