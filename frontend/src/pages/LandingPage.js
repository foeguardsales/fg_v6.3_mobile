import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Navbar, Footer } from '../components/Layout';

export const LandingPage = () => {
  const navigate = useNavigate();
  
  return (
    <>
      <Navbar />
      <div className="landing-page">
        <section className="hero-section" data-testid="hero-section">
          <div className="hero-content">
            <h1 className="hero-title">
              Premium Raw Food<br />
              <span className="hero-accent">Made Fresh for Your Best Friend</span>
            </h1>
            <p className="hero-subtitle">
              Farm-fresh, human-grade ingredients delivered to your door.<br />
              Feed what nature intended.
            </p>
            <button 
              className="btn-hero" 
              onClick={() => navigate('/build-box')}
              data-testid="hero-build-box-btn"
            >
              Build Your Box
            </button>
            <p className="hero-note">✓ Vet-recommended  ✓ Grain-free  ✓ Ontario sourced</p>
          </div>
        </section>

        <section className="benefits-section">
          <div className="benefits-container">
            <h2 className="section-title">Why Choose Raw?</h2>
            <div className="benefits-grid">
              <div className="benefit-card">
                <div className="benefit-icon">🥩</div>
                <h3>Biologically Appropriate</h3>
                <p>Raw food mimics what carnivores eat in nature—muscle meat, organs, and bone for complete nutrition.</p>
              </div>
              <div className="benefit-card">
                <div className="benefit-icon">✨</div>
                <h3>Shinier Coat & Skin</h3>
                <p>Natural enzymes and omega-3s support healthy skin, reduce shedding, and create a lustrous coat.</p>
              </div>
              <div className="benefit-card">
                <div className="benefit-icon">⚡</div>
                <h3>More Energy</h3>
                <p>Easily digestible protein and nutrients mean more vitality and stamina for your active companion.</p>
              </div>
              <div className="benefit-card">
                <div className="benefit-icon">🦴</div>
                <h3>Better Digestion</h3>
                <p>Raw diets promote healthy gut bacteria, firmer stools, and reduced bloating or stomach upset.</p>
              </div>
            </div>
          </div>
        </section>

        <section className="how-it-works">
          <div className="how-it-works-container">
            <h2 className="section-title">How It Works</h2>
            <div className="steps-grid">
              <div className="step-card">
                <div className="step-number">1</div>
                <h3>Choose Box Size</h3>
                <p>Select from 12lb, 18lb, 24lb, or 30lb boxes with increasing savings</p>
              </div>
              <div className="step-card">
                <div className="step-number">2</div>
                <h3>Select Proteins</h3>
                <p>Mix & match from 8 premium proteins in 6lb increments</p>
              </div>
              <div className="step-card">
                <div className="step-number">3</div>
                <h3>Add Treats</h3>
                <p>Optional raw treats like marrow bones and chicken feet</p>
              </div>
              <div className="step-card">
                <div className="step-number">4</div>
                <h3>Delivered Fresh</h3>
                <p>Frozen delivery right to your door, ready to thaw and serve</p>
              </div>
            </div>
            <div style={{ textAlign: 'center', marginTop: '40px' }}>
              <button 
                className="btn-secondary-large" 
                onClick={() => navigate('/build-box')}
                data-testid="how-it-works-cta"
              >
                Get Started
              </button>
            </div>
          </div>
        </section>

        <section className="cta-section">
          <div className="cta-content">
            <h2>Ready to Transform Your Dog's Health?</h2>
            <p>Join hundreds of Ontario pet parents feeding raw.</p>
            <button 
              className="btn-hero" 
              onClick={() => navigate('/build-box')}
              data-testid="final-cta-btn"
            >
              Build Your First Box
            </button>
          </div>
        </section>
      </div>
      <Footer />
    </>
  );
};