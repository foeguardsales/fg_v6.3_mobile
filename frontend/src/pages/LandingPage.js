import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Navbar, Footer } from '../components/Layout';
import { Check, Leaf, Award, ShieldCheck, ChevronLeft, ChevronRight } from 'lucide-react';

export const LandingPage = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [emailSubmitted, setEmailSubmitted] = useState('');
  const photoScrollRef = useRef(null);

  const handleEmailSubmit = (e) => {
    e.preventDefault();
    // TODO: Connect to email service
    setEmailSubmitted(true);
  };

  const scrollPhotos = (direction) => {
    if (photoScrollRef.current) {
      const scrollAmount = 300;
      photoScrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };
  
  return (
    <>
      <Navbar />
      <div className="landing-page">
        
        {/* ===== SECTION 1 — HERO ===== */}
        <section className="hero-section" data-testid="hero-section">
          <div className="hero-content">
            <h1 className="hero-title">
              Feed the Way Carnivores<br />
              <span className="hero-accent">Were Designed to Eat.</span>
            </h1>
            <p className="hero-subtitle">
              Farm-raised, human-grade raw meals delivered across Ontario.
            </p>
            <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '14px', marginBottom: '28px' }}>
              Delivered to your door in as little as 3 days.
            </p>
            <button 
              className="btn-hero" 
              onClick={() => navigate('/build-box')}
              data-testid="hero-build-box-btn"
            >
              Build Your Box
            </button>
            <div className="hero-trust-strip">
              <span><Check size={16} /> Farm Raised in Ontario</span>
              <span><Check size={16} /> Human-Grade Whole Ingredients</span>
              <span><Check size={16} /> No Fillers. No Grains. No Preservatives.</span>
            </div>
          </div>
        </section>

        {/* ===== SECTION 2 — SOCIAL PROOF (MOVED UP) ===== */}
        <section className="community-section" style={{ background: '#F8F6F4' }}>
          <div className="section-container">
            <h2 className="section-title">Trusted by FoeGuardians Across Ontario</h2>
            
            {/* Testimonials - 3 Short Quotes */}
            <div className="testimonials-grid" style={{ marginBottom: '48px' }}>
              <div className="testimonial-card" style={{ textAlign: 'center' }}>
                <p className="testimonial-text" style={{ fontSize: '16px', fontStyle: 'italic', marginBottom: '12px' }}>
                  "Her digestion improved within weeks. I'll never go back to kibble."
                </p>
                <span className="testimonial-author" style={{ fontWeight: '600', color: '#8B4513' }}>— Sarah M.</span>
              </div>
              <div className="testimonial-card" style={{ textAlign: 'center' }}>
                <p className="testimonial-text" style={{ fontSize: '16px', fontStyle: 'italic', marginBottom: '12px' }}>
                  "Finally a raw brand I trust."
                </p>
                <span className="testimonial-author" style={{ fontWeight: '600', color: '#8B4513' }}>— Daniel R.</span>
              </div>
              <div className="testimonial-card" style={{ textAlign: 'center' }}>
                <p className="testimonial-text" style={{ fontSize: '16px', fontStyle: 'italic', marginBottom: '12px' }}>
                  "Energy, coat, stools — everything changed."
                </p>
                <span className="testimonial-author" style={{ fontWeight: '600', color: '#8B4513' }}>— Melissa T.</span>
              </div>
            </div>

            {/* Swipeable Customer Photo Grid - 12 photos */}
            <div style={{ position: 'relative' }}>
              <button
                onClick={() => scrollPhotos('left')}
                style={{
                  position: 'absolute',
                  left: '-20px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'white',
                  border: '2px solid #E8DDD0',
                  borderRadius: '50%',
                  width: '40px',
                  height: '40px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  zIndex: 10,
                  boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                }}
              >
                <ChevronLeft size={20} />
              </button>
              
              <div 
                ref={photoScrollRef}
                style={{
                  display: 'flex',
                  gap: '16px',
                  overflowX: 'auto',
                  scrollBehavior: 'smooth',
                  paddingBottom: '16px',
                  scrollbarWidth: 'none',
                  msOverflowStyle: 'none'
                }}
                className="photo-scroll-container"
              >
                {[...Array(12)].map((_, i) => (
                  <div 
                    key={i}
                    className="customer-photo-placeholder"
                    style={{
                      minWidth: '250px',
                      height: '250px',
                      borderRadius: '12px',
                      background: '#E8DDD0'
                    }}
                  ></div>
                ))}
              </div>

              <button
                onClick={() => scrollPhotos('right')}
                style={{
                  position: 'absolute',
                  right: '-20px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'white',
                  border: '2px solid #E8DDD0',
                  borderRadius: '50%',
                  width: '40px',
                  height: '40px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  zIndex: 10,
                  boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                }}
              >
                <ChevronRight size={20} />
              </button>
            </div>

            <p style={{ textAlign: 'center', marginTop: '24px', fontSize: '15px', color: '#666' }}>
              Real dogs. Real cats. Real guardians choosing better.
            </p>
          </div>
        </section>

        {/* ===== SECTION 3 — THE BELIEF SHIFT ===== */}
        <section className="problem-section">
          <div className="section-container">
            <h2 className="section-title">Feeding Real Food Should Feel Simple.</h2>
            <div className="problem-content">
              <p style={{ fontSize: '17px', marginBottom: '16px' }}>
                Many traditional pet foods are designed for convenience and long shelf life.
              </p>
              <p style={{ fontSize: '17px', marginBottom: '16px' }}>
                We focus on freshness, sourcing, and biological alignment — the way carnivores were designed to eat.
              </p>
              <p>
                Whether you're new to raw or already feeding it, we make it simple:
              </p>
              <p className="build-thaw-feed">
                Build. Thaw. Feed.
              </p>
            </div>
          </div>
        </section>

        {/* ===== SECTION 4 — OUR STANDARD (3 Pillars) ===== */}
        <section className="standard-section">
          <div className="section-container">
            <div className="standard-grid">
              <div className="standard-card">
                <h3>Real Food for Pets</h3>
                <p>Human-grade, whole-food ingredients formulated for biological needs.</p>
              </div>
              <div className="standard-card">
                <h3>Raised as Nature Intended</h3>
                <p>Ethically sourced from trusted Ontario farms — including our own.</p>
              </div>
              <div className="standard-card">
                <h3>Uncompromised Care</h3>
                <p>Government-inspected facility. Professionally formulated. Flash frozen at peak freshness.</p>
              </div>
            </div>
            
            <p style={{ textAlign: 'center', marginTop: '40px', fontSize: '17px', color: '#E8DDD0' }}>
              No vague labels. No marketing hype. No shortcuts.
            </p>
          </div>
        </section>

        {/* ===== SECTION 5 — HOW IT WORKS (Condensed) ===== */}
        <section className="how-it-works-section">
          <div className="section-container">
            <div className="steps-grid">
              <div className="step-card">
                <div className="step-image-container">
                  <div className="step-image-placeholder"></div>
                  <div className="step-number-overlay">1</div>
                </div>
                <h3>Choose Their Favourites</h3>
              </div>
              <div className="step-card">
                <div className="step-image-container">
                  <div className="step-image-placeholder"></div>
                  <div className="step-number-overlay">2</div>
                </div>
                <h3>We Prepare Fresh & Flash Freeze</h3>
              </div>
              <div className="step-card">
                <div className="step-image-container">
                  <div className="step-image-placeholder"></div>
                  <div className="step-number-overlay">3</div>
                </div>
                <h3>Delivered to Your Door</h3>
              </div>
            </div>
            <p style={{ textAlign: 'center', marginTop: '32px', fontSize: '16px', color: '#666' }}>
              No contracts. Pause anytime.
            </p>
            <p style={{ textAlign: 'center', marginTop: '12px', fontSize: '16px', fontWeight: '600', color: '#8B4513' }}>
              Delivered in as little as 3 days.
            </p>
            <div style={{ textAlign: 'center', marginTop: '32px' }}>
              <button 
                className="btn-primary" 
                onClick={() => navigate('/build-box')}
              >
                Build Your Box
              </button>
            </div>
          </div>
        </section>

        {/* ===== SECTION 6 — FROM FARM TO BOWL (Authority) ===== */}
        <section className="farm-section">
          <div className="section-container">
            {/* Farm Banner at Top */}
            <div className="farm-banner-placeholder" style={{ marginBottom: '40px' }}>
              <p>[ Farm Sourcing Image Banner ]</p>
            </div>

            <h2 className="section-title">From Farm to Bowl</h2>
            <div style={{ textAlign: 'center', maxWidth: '800px', margin: '0 auto 48px' }}>
              <p style={{ fontSize: '17px', marginBottom: '20px', fontWeight: '600' }}>
                If it's not good enough for our own table, it's not good enough for your pet's bowl.
              </p>
              <p style={{ fontSize: '17px', marginBottom: '16px' }}>
                We source directly from trusted Ontario farms — including our own — and deliver straight to your door.
              </p>
              <p style={{ fontSize: '17px', marginBottom: '16px' }}>
                By working direct-to-consumer, we remove unnecessary retail layers. That allows us to focus our investment on responsibly raised, human-grade ingredients while keeping pricing aligned with traditional in-store options.
              </p>
              <p style={{ fontSize: '17px' }}>
                It's a simpler, more transparent way to feed raw.
              </p>
            </div>
            
            {/* 8 Protein Grid */}
            <div className="protein-grid" style={{ marginBottom: '48px' }}>
              <div className="protein-item">
                <div className="protein-image-placeholder"></div>
                <span>Chicken</span>
              </div>
              <div className="protein-item">
                <div className="protein-image-placeholder"></div>
                <span>Beef</span>
              </div>
              <div className="protein-item">
                <div className="protein-image-placeholder"></div>
                <span>Duck</span>
              </div>
              <div className="protein-item">
                <div className="protein-image-placeholder"></div>
                <span>Fish</span>
              </div>
              <div className="protein-item">
                <div className="protein-image-placeholder"></div>
                <span>Lamb</span>
              </div>
              <div className="protein-item">
                <div className="protein-image-placeholder"></div>
                <span>Turkey</span>
              </div>
              <div className="protein-item">
                <div className="protein-image-placeholder"></div>
                <span>Goat</span>
              </div>
              <div className="protein-item">
                <div className="protein-image-placeholder"></div>
                <span>Rabbit</span>
              </div>
            </div>

            {/* Short Professional Credibility Strip */}
            <div style={{ 
              display: 'flex', 
              justifyContent: 'center', 
              gap: '48px', 
              flexWrap: 'wrap',
              padding: '32px',
              background: '#F8F6F4',
              borderRadius: '12px'
            }}>
              <div style={{ textAlign: 'center' }}>
                <p style={{ fontSize: '15px', fontWeight: '600', color: '#8B4513' }}>
                  Formulated with nutrition professionals
                </p>
              </div>
              <div style={{ textAlign: 'center' }}>
                <p style={{ fontSize: '15px', fontWeight: '600', color: '#8B4513' }}>
                  AAFCO compliant
                </p>
              </div>
              <div style={{ textAlign: 'center' }}>
                <p style={{ fontSize: '15px', fontWeight: '600', color: '#8B4513' }}>
                  Government-inspected facility
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ===== SECTION 7 — BENEFITS (Clean Checkmark List) ===== */}
        <section className="benefits-section">
          <div className="section-container">
            <h2 className="section-title">Benefits You Can See, and They Can Feel.</h2>
            <div style={{ 
              maxWidth: '700px', 
              margin: '0 auto',
              background: 'white',
              padding: '40px',
              borderRadius: '16px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.08)'
            }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <div style={{ display: 'flex', alignItems: 'start', gap: '12px' }}>
                  <span style={{ color: '#8B4513', fontSize: '20px', marginTop: '2px' }}>✔</span>
                  <p style={{ fontSize: '17px', margin: 0 }}>Smaller stools from improved nutrient absorption</p>
                </div>
                <div style={{ display: 'flex', alignItems: 'start', gap: '12px' }}>
                  <span style={{ color: '#8B4513', fontSize: '20px', marginTop: '2px' }}>✔</span>
                  <p style={{ fontSize: '17px', margin: 0 }}>Healthier skin & coat</p>
                </div>
                <div style={{ display: 'flex', alignItems: 'start', gap: '12px' }}>
                  <span style={{ color: '#8B4513', fontSize: '20px', marginTop: '2px' }}>✔</span>
                  <p style={{ fontSize: '17px', margin: 0 }}>Cleaner teeth through natural chewing</p>
                </div>
                <div style={{ display: 'flex', alignItems: 'start', gap: '12px' }}>
                  <span style={{ color: '#8B4513', fontSize: '20px', marginTop: '2px' }}>✔</span>
                  <p style={{ fontSize: '17px', margin: 0 }}>Steady energy & vitality</p>
                </div>
                <div style={{ display: 'flex', alignItems: 'start', gap: '12px' }}>
                  <span style={{ color: '#8B4513', fontSize: '20px', marginTop: '2px' }}>✔</span>
                  <p style={{ fontSize: '17px', margin: 0 }}>Fewer unnecessary fillers and irritants</p>
                </div>
              </div>
            </div>
            
            <div style={{ textAlign: 'center', marginTop: '48px' }}>
              <button 
                className="btn-secondary" 
                onClick={() => navigate('/new-to-raw')}
                style={{ padding: '14px 32px' }}
              >
                Learn More About Raw Nutrition →
              </button>
            </div>
          </div>
        </section>

        {/* ===== SECTION 8 — NEW TO RAW? ===== */}
        <section className="new-to-raw-section">
          <div className="section-container">
            <h2 className="section-title">New to FoeGuard Raw</h2>
            <p style={{ fontSize: '17px', marginBottom: '32px', textAlign: 'center' }}>
              Switching doesn't have to feel overwhelming. We guide you every step of the way.
            </p>
            
            <div style={{ 
              display: 'flex', 
              flexDirection: 'column',
              alignItems: 'center',
              gap: '16px', 
              marginBottom: '40px'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <Check size={24} style={{ color: '#8B4513' }} />
                <p style={{ fontWeight: '600', fontSize: '17px' }}>Free custom consultation</p>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <Check size={24} style={{ color: '#8B4513' }} />
                <p style={{ fontWeight: '600', fontSize: '17px' }}>Transition guide included</p>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <Check size={24} style={{ color: '#8B4513' }} />
                <p style={{ fontWeight: '600', fontSize: '17px' }}>14-Day Happiness Guarantee</p>
              </div>
            </div>
            
            <div style={{ textAlign: 'center', marginTop: '32px' }}>
              <button 
                className="btn-secondary" 
                onClick={() => navigate('/new-to-raw')}
                style={{ 
                  padding: '10px 24px',
                  borderRadius: '24px',
                  fontSize: '15px',
                  fontWeight: '600'
                }}
              >
                New to FG
              </button>
            </div>
          </div>
        </section>

        {/* ===== SECTION 9 — FINAL CTA (STRONG & CLEAN) ===== */}
        <section className="final-cta-section">
          <div className="section-container">
            <h2 className="section-title-white" style={{ fontSize: '36px', marginBottom: '24px' }}>
              See the FoeGuard Difference
            </h2>
            
            <p style={{ fontSize: '17px', color: 'rgba(255,255,255,0.9)', marginBottom: '40px' }}>
              Farm-raised, professionally formulated raw meals for pet parents who care about exactly what goes in the bowl.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '24px', maxWidth: '500px', margin: '0 auto' }}>
              <button 
                className="btn-hero" 
                onClick={() => navigate('/build-box')}
                data-testid="final-cta-btn"
                style={{ width: '100%', maxWidth: '400px' }}
              >
                Build Your Box
              </button>

              <div style={{ width: '100%', maxWidth: '400px', textAlign: 'center' }}>
                <p style={{ fontSize: '14px', color: 'rgba(255,255,255,0.8)', marginBottom: '12px', lineHeight: '1.5' }}>
                  Get our Raw Feeding Guide for Free (and lots more) by Joining the FoeGuard Pack. See you on the other side!
                </p>
                {!emailSubmitted ? (
                  <form onSubmit={handleEmailSubmit} style={{ width: '100%' }}>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <input 
                        type="email" 
                        placeholder="Enter your email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        style={{
                          flex: 1,
                          padding: '14px 20px',
                          borderRadius: '8px',
                          border: '2px solid rgba(255,255,255,0.3)',
                          background: 'rgba(255,255,255,0.1)',
                          color: 'white',
                          fontSize: '16px'
                        }}
                      />
                      <button 
                        type="submit" 
                        style={{
                          padding: '14px 24px',
                          background: 'white',
                          color: '#8B4513',
                          border: 'none',
                          borderRadius: '8px',
                          fontWeight: '600',
                          cursor: 'pointer',
                          fontSize: '16px',
                          whiteSpace: 'nowrap'
                        }}
                      >
                        Join Pack
                      </button>
                    </div>
                  </form>
                ) : (
                  <p style={{ color: 'white', fontSize: '16px', padding: '14px', background: 'rgba(255,255,255,0.1)', borderRadius: '8px' }}>
                    Welcome to the pack! Check your inbox.
                  </p>
                )}
              </div>
            </div>
          </div>
        </section>

      </div>
      <Footer />
    </>
  );
};
