import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Navbar, Footer } from '../components/Layout';
import { Check, Leaf, Award, ShieldCheck, Truck, Sparkles, Heart, Bone, Zap, Shield, Droplets } from 'lucide-react';

export const LandingPage = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [emailSubmitted, setEmailSubmitted] = useState(false);

  const handleEmailSubmit = (e) => {
    e.preventDefault();
    // TODO: Connect to email service
    setEmailSubmitted(true);
  };
  
  return (
    <>
      <Navbar />
      <div className="landing-page">
        
        {/* ===== SECTION 1 — HERO ===== */}
        <section className="hero-section" data-testid="hero-section">
          <div className="hero-content">
            <h1 className="hero-title">
              See a Happier, Healthier Pet<br />
              <span className="hero-accent">In Just 14 Days</span>
            </h1>
            <p className="hero-subtitle">
              Farm-fresh raw meals designed for carnivores — delivered directly to your door.
            </p>
            <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '14px', marginBottom: '28px' }}>
              Takes less than 60 seconds to build your pet's box.
            </p>
            <button 
              className="btn-hero" 
              onClick={() => navigate('/build-box')}
              data-testid="hero-build-box-btn"
            >
              Build Your Box
            </button>
            <div className="hero-trust-strip">
              <span><Check size={16} /> Farm Raised</span>
              <span><Check size={16} /> Human Grade, Whole Foods</span>
              <span><Check size={16} /> Organic Ingredients - No Grains, Fillers or Preservatives</span>
            </div>
          </div>
        </section>

        {/* ===== SECTION 1.5 — WHY GUARDIANS SWITCH ===== */}
        <section className="why-switch-section">
          <div className="section-container">
            <h2 className="section-title-sm">Why Guardians Switch to FoeGuard</h2>
            <div className="why-switch-grid">
              <div className="why-switch-item">
                <div className="why-switch-icon">
                  <Leaf size={40} />
                </div>
                <p>Owned Farms</p>
              </div>
              <div className="why-switch-item">
                <div className="why-switch-icon">
                  <Award size={40} />
                </div>
                <p>Human-Grade Ingredients</p>
              </div>
              <div className="why-switch-item">
                <div className="why-switch-icon">
                  <ShieldCheck size={40} />
                </div>
                <p>No Fillers or Synthetic Additives</p>
              </div>
            </div>
          </div>
        </section>

        {/* ===== SECTION 2 — THE PROBLEM ===== */}
        <section className="problem-section">
          <div className="section-container">
            <h2 className="section-title">Feeding Real Food Shouldn't Feel Complicated.</h2>
            <div className="problem-content">
              <p>
                Most pet food is built for shelf life — not biology. It's processed, overcooked, and designed to sit on a warehouse shelf for months – or even years.
              </p>
              <p className="problem-emphasis">
                That doesn't sound like something built for carnivores.
              </p>
              <p>
                Whether you're new to raw or already feeding it, we make it simple to feed your dogs and cats — build, thaw, feed.
              </p>
            </div>
          </div>
        </section>

        {/* ===== SECTION 3 — OUR STANDARDS ===== */}
        <section className="standard-section">
          <div className="section-container">
            <h2 className="section-title-white">Our Standards</h2>
            <div className="standard-grid">
              <div className="standard-card">
                <h3>Real Food for Carnivores</h3>
                <p>Human-grade, organic, biologically appropriate whole-food ingredients.</p>
              </div>
              <div className="standard-card">
                <h3>Raised as Nature Intended</h3>
                <p>Ethically sourced from local Canadian farms — including farms we directly own and oversee.</p>
              </div>
              <div className="standard-card">
                <h3>For Guardians Who Care</h3>
                <p>For those who treat their pets like family. No hidden fillers. Just honest nutrition you can trust.</p>
              </div>
            </div>
          </div>
        </section>

        {/* ===== SECTION 4 — HOW IT WORKS ===== */}
        <section className="how-it-works-section">
          <div className="section-container">
            <h2 className="section-title">How It Works</h2>
            <div className="steps-grid">
              <div className="step-card">
                <div className="step-image-container">
                  <div className="step-image-placeholder"></div>
                  <div className="step-number-overlay">1</div>
                </div>
                <h3>Build Your Box</h3>
                <p>Pick your size. Mix & match from 8 premium proteins in 6lb increments.</p>
              </div>
              <div className="step-card">
                <div className="step-image-container">
                  <div className="step-image-placeholder"></div>
                  <div className="step-number-overlay">2</div>
                </div>
                <h3>We Prepare Fresh</h3>
                <p>Each order is prepared in a government-regulated facility. Never sitting on shelves.</p>
              </div>
              <div className="step-card">
                <div className="step-image-container">
                  <div className="step-image-placeholder"></div>
                  <div className="step-number-overlay">3</div>
                </div>
                <h3>Thaw & Serve</h3>
                <p>Flash-frozen and delivered. Just thaw and feed.</p>
              </div>
            </div>
            <p className="steps-subtext">
              No contracts. Adjust, pause, or cancel anytime. Subscribe only if you want extra savings.
            </p>
          </div>
        </section>

        {/* ===== SECTION 5 — BENEFITS OF FEEDING RAW ===== */}
        <section className="benefits-section">
          <div className="section-container">
            <h2 className="section-title">Real Food. Real Results.</h2>
            <div className="benefits-grid">
              <div className="benefit-card">
                <div className="benefit-icon">
                  <Sparkles size={28} />
                </div>
                <h3>Better Digestion</h3>
                <p>Noticeably smaller stools from better nutrient absorption.</p>
              </div>
              <div className="benefit-card">
                <div className="benefit-icon">
                  <Heart size={28} />
                </div>
                <h3>Healthier Skin & Coat</h3>
                <p>Reduced itchiness and a shinier coat from real nutrition.</p>
              </div>
              <div className="benefit-card">
                <div className="benefit-icon">
                  <Bone size={28} />
                </div>
                <h3>Cleaner Teeth</h3>
                <p>Nature's toothbrush – raw bones naturally clean teeth.</p>
              </div>
              <div className="benefit-card">
                <div className="benefit-icon">
                  <Zap size={28} />
                </div>
                <h3>Steady Energy</h3>
                <p>Real food provides sustained vitality without crashes.</p>
              </div>
              <div className="benefit-card">
                <div className="benefit-icon">
                  <Shield size={28} />
                </div>
                <h3>Fewer Sensitivities</h3>
                <p>Reduced food sensitivities from ingredients they're meant to eat.</p>
              </div>
              <div className="benefit-card">
                <div className="benefit-icon">
                  <Droplets size={28} />
                </div>
                <h3>Safer Digestion</h3>
                <p>Proper moisture and nutrient absorption supports gut health.</p>
              </div>
            </div>
            
            {/* AAFCO Logo with compliance text */}
            <div className="aafco-section">
              <div className="aafco-logo-placeholder">
                <p>[ AAFCO Logo ]</p>
              </div>
              <p className="aafco-text">
                Formulated to meet the nutritional levels established by AAFCO Dog and Cat Food Nutrient Profiles for all life stages.
              </p>
            </div>
          </div>
        </section>

        {/* ===== SECTION 6 — FROM FARM TO BOWL ===== */}
        <section className="farm-section">
          <div className="section-container">
            <h2 className="section-title">From Farm to Bowl</h2>
            <div className="farm-content" style={{ textAlign: 'center' }}>
              <p style={{ maxWidth: '750px', margin: '0 auto 20px' }}>
                What began as a mission to support local pet guardians became a commitment to Ontario dogs and cats. No middlemen. No unknown sources. Full control from start to finish — for ultimate consistency, traceability, and safety.
              </p>
              <p className="farm-emphasis">
                If it's not good enough for our own table, it's not good enough for your pet's bowl.
              </p>
            </div>
            
            {/* 8 Protein Grid */}
            <div className="protein-grid">
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

            {/* Farm Banner Placeholder */}
            <div className="farm-banner-placeholder">
              <p>[ Farm Sourcing Image Banner ]</p>
            </div>

            {/* Testimonials */}
            <div className="testimonials-section">
              <h3>What FoeGuardians Are Saying</h3>
              <div className="testimonials-grid">
                <div className="testimonial-card">
                  <div className="testimonial-image-placeholder"></div>
                  <p className="testimonial-text">[ Testimonial 1 ]</p>
                  <span className="testimonial-author">— Pet Guardian Name</span>
                </div>
                <div className="testimonial-card">
                  <div className="testimonial-image-placeholder"></div>
                  <p className="testimonial-text">[ Testimonial 2 ]</p>
                  <span className="testimonial-author">— Pet Guardian Name</span>
                </div>
                <div className="testimonial-card">
                  <div className="testimonial-image-placeholder"></div>
                  <p className="testimonial-text">[ Testimonial 3 ]</p>
                  <span className="testimonial-author">— Pet Guardian Name</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ===== SECTION 7 — NEW TO RAW ===== */}
        <section className="new-to-raw-section">
          <div className="section-container">
            <h2 className="section-title">New to FoeGuard or Raw Feeding?</h2>
            <p className="new-to-raw-subtitle">Transitioning is easier than you think.</p>
            <p className="new-to-raw-text">
              Whether you're switching from kibble or another raw brand, we guide you every step of the way — so feeding better never feels overwhelming.
            </p>
            <button 
              className="btn-primary" 
              onClick={() => navigate('/new-to-raw')}
              data-testid="trial-box-btn"
            >
              Visit New to Raw
            </button>
          </div>
        </section>

        {/* ===== SECTION 8 — COMMUNITY ===== */}
        <section className="community-section">
          <div className="section-container">
            <h2 className="section-title">Trusted by FoeGuardians Across Ontario.</h2>
            <p className="community-subtitle">Real dogs. Real cats. Real guardians choosing better.</p>
            
            {/* Customer Photo Grid - 12 images */}
            <div className="customer-photo-grid">
              <div className="customer-photo-placeholder"></div>
              <div className="customer-photo-placeholder"></div>
              <div className="customer-photo-placeholder"></div>
              <div className="customer-photo-placeholder"></div>
              <div className="customer-photo-placeholder"></div>
              <div className="customer-photo-placeholder"></div>
              <div className="customer-photo-placeholder"></div>
              <div className="customer-photo-placeholder"></div>
              <div className="customer-photo-placeholder"></div>
              <div className="customer-photo-placeholder"></div>
              <div className="customer-photo-placeholder"></div>
              <div className="customer-photo-placeholder"></div>
            </div>
          </div>
        </section>

        {/* ===== SECTION 9 — FINAL CTA ===== */}
        <section className="final-cta-section">
          <div className="section-container">
            <h2 className="section-title-white">Give Your Pet the Food They Were Biologically Designed to Eat.</h2>
            
            <div className="promise-box">
              <h3>The FoeGuard Promise:</h3>
              <ul className="promise-list">
                <li><Check size={18} /> Free custom meal consultation</li>
                <li><Check size={18} /> Farm-fresh delivery to your door</li>
                <li><Check size={18} /> Transition support for new raw feeders</li>
                <li><Check size={18} /> Free Raw Feeding Guide ($29 value)</li>
                <li><Check size={18} /> 14-Day Happiness Guarantee</li>
              </ul>
            </div>

            <button 
              className="btn-hero" 
              onClick={() => navigate('/build-box')}
              data-testid="final-cta-btn"
            >
              Build Your Box
            </button>

            {!emailSubmitted ? (
              <form onSubmit={handleEmailSubmit} className="email-signup">
                <input 
                  type="email" 
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                <button type="submit" className="btn-link-white">
                  Join the FoeGuard Pack
                </button>
              </form>
            ) : (
              <p className="email-success">Welcome to the pack! Check your inbox.</p>
            )}
          </div>
        </section>

      </div>
      <Footer />
    </>
  );
};
