import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Menu, X, ShoppingBag, User, ChevronRight, ChevronDown, Star, Plus, Minus } from 'lucide-react';
import { useCart, SlideCart } from './MenuPage';

// FoeGuard Brand Colors
const COLORS = {
  red: '#c8102e',
  redOverlay: '#9D0D23',
  cream: '#f5f3ef',
  softBg: '#f0ece6',
  khaki: '#D8CFB8',
  charcoal: '#2C2C2C',
  forestGreen: '#2F4538',
  lightGreen: '#00934f',
  white: '#ffffff'
};

// Modern Navbar with centered logo
const ModernNavbar = () => {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const { cartItems, setIsCartOpen } = useCart();

  return (
    <>
      <nav style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 1000,
        background: COLORS.cream,
        borderBottom: `1px solid ${COLORS.khaki}`
      }}>
        {/* Top announcement bar */}
        <div style={{
          background: COLORS.red,
          color: COLORS.white,
          textAlign: 'center',
          padding: '8px 16px',
          fontSize: '13px',
          fontWeight: '500'
        }}>
          Free shipping on all orders over $149
        </div>
        
        {/* Main navbar */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '12px 20px',
          maxWidth: '1400px',
          margin: '0 auto'
        }}>
          {/* Left - Menu button */}
          <button
            onClick={() => setMenuOpen(true)}
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
            <Menu size={24} color={COLORS.charcoal} />
          </button>

          {/* Center - Logo */}
          <button
            onClick={() => navigate('/')}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: '0'
            }}
          >
            <h1 style={{
              fontSize: '28px',
              fontWeight: '800',
              color: COLORS.red,
              margin: 0,
              fontFamily: "'Rubik', sans-serif",
              letterSpacing: '-0.5px'
            }}>
              FoeGuard
            </h1>
          </button>

          {/* Right - Cart & Profile */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <button
              onClick={() => navigate('/account')}
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                padding: '8px'
              }}
            >
              <User size={22} color={COLORS.charcoal} />
            </button>
            <button
              onClick={() => setIsCartOpen(true)}
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                padding: '8px',
                position: 'relative'
              }}
            >
              <ShoppingBag size={22} color={COLORS.charcoal} />
              {cartItems.length > 0 && (
                <span style={{
                  position: 'absolute',
                  top: '2px',
                  right: '2px',
                  background: COLORS.red,
                  color: COLORS.white,
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
              <h2 style={{ fontSize: '24px', fontWeight: '700', color: COLORS.red, margin: 0 }}>FoeGuard</h2>
              <button onClick={() => setMenuOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                <X size={24} color={COLORS.charcoal} />
              </button>
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {[
                { label: 'Shop Menu', path: '/menu' },
                { label: 'Build Meal Plan', path: '/meal-plan' },
                { label: 'Feeding Calculator', path: '/calculator' },
                { label: 'Why Raw?', path: '/new-to-raw' },
                { label: 'About Us', path: '/about' },
                { label: 'Contact', path: '/contact' }
              ].map(item => (
                <button
                  key={item.path}
                  onClick={() => { navigate(item.path); setMenuOpen(false); }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
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
      padding: '14px 0'
    }}>
      <div style={{
        display: 'flex',
        animation: 'marquee 20s linear infinite',
        whiteSpace: 'nowrap'
      }}>
        {[...badges, ...badges, ...badges, ...badges].map((badge, i) => (
          <span key={i} style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '12px',
            marginRight: '48px',
            fontSize: '14px',
            fontWeight: '600',
            textTransform: 'uppercase',
            letterSpacing: '1px'
          }}>
            <span style={{ color: COLORS.lightGreen }}>✦</span>
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
          <h3 style={{ fontSize: '28px', fontWeight: '800', color: COLORS.red, marginBottom: '16px' }}>FoeGuard</h3>
          <p style={{ fontSize: '14px', lineHeight: '1.7', color: COLORS.khaki, marginBottom: '24px' }}>
            Ontario's #1 farm-to-bowl raw dog food delivery. Real, fresh, complete nutrition for your best friend.
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
          {['Raw Dog Food', 'Meaty Treats', 'Build Meal Plan', 'Feeding Calculator'].map(item => (
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
          {['Contact Us', 'FAQs', 'Shipping Info', 'Returns'].map(item => (
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
      
      <main style={{ paddingTop: '100px' }}>
        {/* HERO SECTION */}
        <section style={{
          background: `linear-gradient(135deg, ${COLORS.cream} 0%, ${COLORS.softBg} 100%)`,
          padding: '60px 20px 80px',
          position: 'relative',
          overflow: 'hidden'
        }}>
          <div style={{ maxWidth: '1200px', margin: '0 auto', textAlign: 'center' }}>
            {/* Rating badge */}
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              background: COLORS.white,
              padding: '8px 16px',
              borderRadius: '50px',
              marginBottom: '24px',
              boxShadow: '0 2px 12px rgba(0,0,0,0.08)'
            }}>
              <div style={{ display: 'flex', gap: '2px' }}>
                {[1,2,3,4,5].map(i => <Star key={i} size={14} fill={COLORS.red} color={COLORS.red} />)}
              </div>
              <span style={{ fontSize: '13px', fontWeight: '600', color: COLORS.charcoal }}>
                Thousands of 5-Star Reviews
              </span>
            </div>

            <h1 style={{
              fontSize: 'clamp(32px, 6vw, 56px)',
              fontWeight: '800',
              color: COLORS.charcoal,
              lineHeight: '1.1',
              marginBottom: '20px',
              fontFamily: "'Rubik', sans-serif"
            }}>
              Ontario's #1 Farm-to-Bowl<br />
              <span style={{ color: COLORS.red }}>Raw Dog Food Delivery</span>
            </h1>

            <p style={{
              fontSize: '18px',
              color: COLORS.charcoal,
              opacity: 0.8,
              maxWidth: '600px',
              margin: '0 auto 32px',
              lineHeight: '1.6'
            }}>
              Restore your dog's digestion, energy and comfort from the inside out with real, fresh, complete raw nutrition.
            </p>

            <button
              onClick={() => navigate('/menu')}
              style={{
                background: COLORS.red,
                color: COLORS.white,
                border: 'none',
                padding: '18px 48px',
                borderRadius: '50px',
                fontSize: '16px',
                fontWeight: '700',
                cursor: 'pointer',
                boxShadow: '0 4px 20px rgba(200, 16, 46, 0.3)',
                transition: 'all 0.3s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 6px 24px rgba(200, 16, 46, 0.4)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 4px 20px rgba(200, 16, 46, 0.3)';
              }}
            >
              Shop Now
            </button>
          </div>
        </section>

        {/* TRUST MARQUEE */}
        <TrustMarquee />

        {/* COLLECTION CARDS - "Our Menu" */}
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
              Meet Our <span style={{ color: COLORS.red }}>Delicious</span> Lineup
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
                  color: COLORS.forestGreen
                },
                {
                  title: 'Raw Dog Food',
                  desc: 'Fresh food that\'s easy to portion and serve, ensuring balanced, nutritious meals every day.',
                  image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&h=300&fit=crop',
                  path: '/menu',
                  color: COLORS.red
                },
                {
                  title: 'Meaty Treats',
                  desc: 'Freeze-dried treats add a nutritional boost to any diet. Perfect as rewards or training tools.',
                  image: 'https://images.unsplash.com/photo-1568640347023-a616a30bc3bd?w=400&h=300&fit=crop',
                  path: '/menu/treats',
                  color: COLORS.lightGreen
                }
              ].map((card, i) => (
                <button
                  key={i}
                  onClick={() => navigate(card.path)}
                  style={{
                    background: COLORS.cream,
                    border: 'none',
                    borderRadius: '20px',
                    overflow: 'hidden',
                    cursor: 'pointer',
                    textAlign: 'left',
                    transition: 'all 0.3s ease',
                    boxShadow: '0 4px 20px rgba(0,0,0,0.06)'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-8px)';
                    e.currentTarget.style.boxShadow = '0 12px 40px rgba(0,0,0,0.12)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 4px 20px rgba(0,0,0,0.06)';
                  }}
                >
                  <div style={{
                    height: '200px',
                    background: `url(${card.image}) center/cover`,
                    position: 'relative'
                  }}>
                    <div style={{
                      position: 'absolute',
                      bottom: '16px',
                      left: '16px',
                      background: card.color,
                      color: COLORS.white,
                      padding: '6px 14px',
                      borderRadius: '20px',
                      fontSize: '12px',
                      fontWeight: '600'
                    }}>
                      {i === 0 ? 'Quiz' : i === 1 ? 'Shop' : 'Treats'}
                    </div>
                  </div>
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
                      Get Started <ChevronRight size={18} />
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
          <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
              gap: '60px',
              alignItems: 'center'
            }}>
              {/* Image side */}
              <div style={{
                position: 'relative',
                borderRadius: '24px',
                overflow: 'hidden',
                boxShadow: '0 20px 60px rgba(0,0,0,0.1)'
              }}>
                <img
                  src="https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=600&h=500&fit=crop"
                  alt="Happy dog"
                  style={{ width: '100%', display: 'block' }}
                />
                <div style={{
                  position: 'absolute',
                  bottom: '24px',
                  left: '24px',
                  right: '24px',
                  background: 'rgba(255,255,255,0.95)',
                  padding: '20px',
                  borderRadius: '16px',
                  backdropFilter: 'blur(10px)'
                }}>
                  <p style={{ fontSize: '14px', color: COLORS.charcoal, margin: 0 }}>
                    <strong style={{ color: COLORS.red }}>Made in our Ontario Regulated Human Food Kitchen</strong><br />
                    Ethically Raised & Hand-Crafted in Small Batches
                  </p>
                </div>
              </div>

              {/* Content side */}
              <div>
                <h2 style={{
                  fontSize: '36px',
                  fontWeight: '700',
                  color: COLORS.charcoal,
                  marginBottom: '24px'
                }}>
                  Why <span style={{ color: COLORS.red }}>FoeGuard</span> Raw?
                </h2>

                <div style={{ display: 'grid', gap: '20px' }}>
                  {[
                    { icon: '🌿', title: 'Organic, Human-Grade Ingredients', desc: 'Only the finest ingredients you\'d eat yourself' },
                    { icon: '✓', title: 'Exceeds AAFCO Standards', desc: 'Complete nutrition backed by science' },
                    { icon: '🇨🇦', title: '100% Canadian Sourced', desc: 'Supporting local farmers and suppliers' },
                    { icon: '🏠', title: 'Family Owned & Operated', desc: 'Third generation farmers who truly care' }
                  ].map((item, i) => (
                    <div key={i} style={{
                      display: 'flex',
                      gap: '16px',
                      padding: '20px',
                      background: COLORS.white,
                      borderRadius: '16px',
                      boxShadow: '0 2px 12px rgba(0,0,0,0.04)'
                    }}>
                      <div style={{
                        width: '48px',
                        height: '48px',
                        borderRadius: '12px',
                        background: COLORS.cream,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '24px',
                        flexShrink: 0
                      }}>
                        {item.icon}
                      </div>
                      <div>
                        <h4 style={{ fontSize: '16px', fontWeight: '700', color: COLORS.charcoal, margin: '0 0 4px' }}>
                          {item.title}
                        </h4>
                        <p style={{ fontSize: '14px', color: COLORS.charcoal, opacity: 0.7, margin: 0 }}>
                          {item.desc}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                <button
                  onClick={() => navigate('/new-to-raw')}
                  style={{
                    marginTop: '24px',
                    background: 'none',
                    border: `2px solid ${COLORS.red}`,
                    color: COLORS.red,
                    padding: '14px 28px',
                    borderRadius: '50px',
                    fontSize: '14px',
                    fontWeight: '600',
                    cursor: 'pointer'
                  }}
                >
                  Learn More
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* BENEFITS SECTION */}
        <section style={{
          background: COLORS.forestGreen,
          padding: '80px 20px',
          color: COLORS.cream
        }}>
          <div style={{ maxWidth: '1000px', margin: '0 auto', textAlign: 'center' }}>
            <h2 style={{ fontSize: '36px', fontWeight: '700', marginBottom: '16px' }}>
              Customers Often See Benefits in Just <span style={{ color: COLORS.lightGreen }}>2 Weeks</span>
            </h2>
            <p style={{ fontSize: '18px', opacity: 0.9, marginBottom: '48px' }}>
              Help your dog live their best life by changing how they feel, look and act on a day-to-day basis.
            </p>

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '24px'
            }}>
              {[
                { icon: '💪', title: 'Improved Digestion', desc: 'Easier on the stomach' },
                { icon: '✨', title: 'Shinier Coat', desc: 'Healthier skin & fur' },
                { icon: '⚡', title: 'More Energy', desc: 'Active & playful' },
                { icon: '🏃', title: 'Healthy Weight', desc: 'Lean muscle mass' }
              ].map((benefit, i) => (
                <div key={i} style={{
                  background: 'rgba(255,255,255,0.1)',
                  padding: '32px 24px',
                  borderRadius: '20px',
                  backdropFilter: 'blur(10px)'
                }}>
                  <div style={{ fontSize: '40px', marginBottom: '16px' }}>{benefit.icon}</div>
                  <h4 style={{ fontSize: '18px', fontWeight: '700', marginBottom: '8px' }}>{benefit.title}</h4>
                  <p style={{ fontSize: '14px', opacity: 0.8, margin: 0 }}>{benefit.desc}</p>
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
              gap: '24px'
            }}>
              {reviews.map((review, i) => (
                <div key={i} style={{
                  background: COLORS.white,
                  padding: '32px',
                  borderRadius: '20px',
                  boxShadow: '0 4px 20px rgba(0,0,0,0.06)'
                }}>
                  <div style={{ display: 'flex', gap: '4px', marginBottom: '16px' }}>
                    {[1,2,3,4,5].map(s => <Star key={s} size={18} fill={COLORS.red} color={COLORS.red} />)}
                  </div>
                  <p style={{
                    fontSize: '16px',
                    color: COLORS.charcoal,
                    lineHeight: '1.6',
                    marginBottom: '20px',
                    fontStyle: 'italic'
                  }}>
                    "{review.text}"
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
                FoeGuard is a family-run business committed to providing pet parents with the same fresh, natural ingredients we expect at our own table. As third generation Canadian Farmers and award-winning German Shepherd breeders with a PhD in biology, we've seen the benefits of biologically appropriate raw food first-hand.
              </p>
              <p style={{
                fontSize: '16px',
                color: COLORS.charcoal,
                lineHeight: '1.8',
                marginBottom: '32px'
              }}>
                What began as helping our neighbours and friends with their dogs' meals became a realization that Ontario pet parents needed better access to trusted, transparent pet nutrition. Our passion became profession, FoeGuard was born!
              </p>
              <button
                onClick={() => navigate('/about')}
                style={{
                  alignSelf: 'flex-start',
                  background: COLORS.charcoal,
                  color: COLORS.white,
                  border: 'none',
                  padding: '14px 28px',
                  borderRadius: '50px',
                  fontSize: '14px',
                  fontWeight: '600',
                  cursor: 'pointer'
                }}
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
                  borderRadius: '16px',
                  overflow: 'hidden'
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
              gap: '16px',
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
                  padding: '10px 20px',
                  borderRadius: '50px',
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
                borderRadius: '50px',
                fontSize: '18px',
                fontWeight: '700',
                cursor: 'pointer',
                boxShadow: '0 4px 20px rgba(0,0,0,0.2)'
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

export default LandingPage;
