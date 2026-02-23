import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Navbar, Footer } from '../components/Layout';
import { Check, Leaf, Award, ShieldCheck, Truck, Heart, Users } from 'lucide-react';

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
              See a happier, healthier pet<br />
              <span className="hero-accent">in just 14 days</span>
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
              <span><Check size={16} /> Organic Ingredients - no Grains, Fillers or Preservatives</span>
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
                  {/* Placeholder for icon/image */}
                  <Leaf size={40} />
                </div>
                <p>Owned farms</p>
              </div>
              <div className="why-switch-item">
                <div className="why-switch-icon">
                  <Award size={40} />
                </div>
                <p>Human-grade ingredients</p>
              </div>
              <div className="why-switch-item">
                <div className="why-switch-icon">
                  <ShieldCheck size={40} />
                </div>
                <p>No fillers or synthetic additives</p>
              </div>
            </div>
          </div>
        </section>

        {/* ===== SECTION 2 — THE PROBLEM ===== */}
        <section className="problem-section">
          <div className="section-container">
            <h2 className="section-title">Feeding real food shouldn't feel complicated.</h2>
            <div className="problem-content">
              <p>
                Most pet food is built for shelf life — not biology.
              </p>
              <p>
                It's processed, overcooked, and designed to sit on a warehouse shelf for months – or even years.
              </p>
              <p className="problem-highlight">
                That doesn't sound like something built for carnivores.
              </p>
              <p>
                Whether you're new to raw or already feeding it, we make it simple to feed your whole fur-family — build, thaw, feed.
              </p>
            </div>
          </div>
        </section>

        {/* ===== SECTION 3 — OUR STANDARD ===== */}
        <section className="standard-section">
          <div className="section-container">
            <div className="standard-grid">
              <div className="standard-card">
                <h3>Real Food for Pets</h3>
                <p>Human-grade, organic, biologically appropriate whole-food ingredients.</p>
              </div>
              <div className="standard-card">
                <h3>Raised as Nature Intended</h3>
                <p>Ethically sourced from local Canadian farms — including farms we directly own and oversee.</p>
              </div>
              <div className="standard-card">
                <h3>For Guardians Who Refuse to Compromise</h3>
                <p>Clear ingredients. No vague labels. No marketing hype.</p>
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
                <div className="step-number">1</div>
                <h3>Choose Their Favourites</h3>
                <p>Mix and match from a variety of raw meals and natural treats.</p>
              </div>
              <div className="step-card">
                <div className="step-number">2</div>
                <h3>We Prepare Fresh</h3>
                <p>Using strict food-handling standards and complete personalization</p>
              </div>
              <div className="step-card">
                <div className="step-number">3</div>
                <h3>Delivered to Your Door</h3>
                <p>Flash-frozen for peak safety and easy storage. Just thaw and feed</p>
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
            <div className="benefits-list">
              <div className="benefit-item">
                <Check size={20} className="benefit-check" />
                <span>Noticeably smaller stools from better nutrient absorption</span>
              </div>
              <div className="benefit-item">
                <Check size={20} className="benefit-check" />
                <span>Reduced itchiness from healthier skin & coat</span>
              </div>
              <div className="benefit-item">
                <Check size={20} className="benefit-check" />
                <span>Cleaner teeth from natures toothbrush – bones!</span>
              </div>
              <div className="benefit-item">
                <Check size={20} className="benefit-check" />
                <span>Steady energy & vitality provided by real food</span>
              </div>
              <div className="benefit-item">
                <Check size={20} className="benefit-check" />
                <span>Reduced food sensitivities from ingredients they are meant to eat.</span>
              </div>
              <div className="benefit-item">
                <Check size={20} className="benefit-check" />
                <span>Supports safer digestion through proper moisture and nutrient absorption</span>
              </div>
            </div>
            
            <div className="aafco-box">
              <h3>AAFCO Compliant</h3>
              <p>Formulated to meet recognized nutritional standards and developed with professional nutritionists.</p>
              <button className="btn-link" onClick={() => navigate('/about')}>
                Learn More About Raw Nutrition →
              </button>
            </div>
          </div>
        </section>

        {/* ===== SECTION 6 — FROM FARM TO BOWL ===== */}
        <section className="farm-section">
          <div className="section-container">
            <h2 className="section-title">From Farm to Bowl</h2>
            <p className="farm-intro">
              No middlemen. No unknown sources. Full control from start to finish - for ultimate consistency, traceability, and safety.
            </p>
            <p className="farm-story">
              What began as a mission to support local pet guardians became a commitment to Ontario dogs and cats.
            </p>
            <p className="farm-quote">
              If it's not good enough for our own table, it's not good enough for your pet's bowl.
            </p>
            
            {/* 8 Protein Grid */}
            <div className="protein-grid">
              <div className="protein-item">
                <div className="protein-image-placeholder">
                  {/* Image placeholder */}
                </div>
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
              onClick={() => navigate('/build-box')}
              data-testid="trial-box-btn"
            >
              Build Your Risk-Free Trial Box
            </button>
          </div>
        </section>

        {/* ===== SECTION 8 — COMMUNITY ===== */}
        <section className="community-section">
          <div className="section-container">
            <h2 className="section-title">Trusted by FoeGuardians Across Ontario.</h2>
            <p className="community-subtitle">Real dogs. Real cats. Real guardians choosing better.</p>
            
            {/* Customer Photo Grid Placeholder */}
            <div className="customer-photo-grid">
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
