import React, { useState } from 'react';
import { Navbar, Footer } from '../components/Layout';

export const AboutPage = () => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubscribe = async (e) => {
    e.preventDefault();
    if (!email) return;
    setLoading(true);
    // Simulate subscription
    setTimeout(() => {
      setSubscribed(true);
      setLoading(false);
    }, 800);
  };

  return (
    <>
      <Navbar />
      <div className="about-page">
        {/* Hero Section */}
        <section className="about-hero">
          <div className="about-hero-content">
            <h1 style={{ textTransform: 'none', fontFamily: "'CS Gordon', serif" }}>Why FoeGuard</h1>
            <p style={{ fontSize: '18px', color: 'rgba(255,255,255,0.9)', marginTop: '20px' }}>
              Happy, healthy, dogs start here.
            </p>
          </div>
        </section>

        {/* Introduction Section */}
        <section className="about-section about-story">
          <div className="about-container">
            <p style={{ fontSize: '17px', marginBottom: '20px', lineHeight: '1.7' }}>
              Dogs are built to thrive on raw food. Their strong stomach acid, sharp teeth, and short digestive systems are designed to break down meat, organs, and bone with ease.
            </p>
            <p style={{ fontSize: '17px', marginBottom: '20px', lineHeight: '1.7' }}>
              But much of today's pet food is made for convenience and shelf life — not for your dog's biology. It follows a very different standard than the food we eat, from ingredient quality to how it is processed.
            </p>
            <p style={{ fontSize: '17px', marginBottom: '0', lineHeight: '1.7' }}>
              At FoeGuard, we believe your dogs deserve better. That is why we make fresh, organic, human-grade raw meals that are locally sourced and aligned with nature.
            </p>
          </div>
        </section>

        {/* Farm Image Section */}
        <section className="about-farm-image">
          <div className="farm-image-placeholder">
            <span>Farm Image</span>
          </div>
        </section>

        {/* From our family to yours */}
        <section className="about-section about-why">
          <div className="about-container">
            <h2 style={{ textTransform: 'none' }}>From our family to yours</h2>
            <p style={{ fontSize: '17px', marginBottom: '16px' }}>
              We are a family-run farm dedicated to raising animals as nature intended.
            </p>
            <p style={{ fontSize: '17px', marginBottom: '16px' }}>
              With roots in Ontario farming and meat processing, we understand the food chain from farm to bowl. What started as a personal standard became something bigger when friends and neighbours began asking for the same meals we were preparing on our farm. We quickly realized that pet parents in Ontario wanted better access to healthy, transparent raw dog food.
            </p>
            <p style={{ fontSize: '17px', fontWeight: '600' }}>
              That is why we started FoeGuard: to help raise the standard of what pet food should be.
            </p>
          </div>
        </section>

        {/* Team Images */}
        <section className="about-team-images-grid">
          <div className="team-grid">
            <div className="team-image-card"><span>Image 1</span></div>
            <div className="team-image-card"><span>Image 2</span></div>
            <div className="team-image-card"><span>Image 3</span></div>
          </div>
          <div className="team-carousel">
            <div className="team-carousel-track">
              <div className="team-image-card"><span>Image 1</span></div>
              <div className="team-image-card"><span>Image 2</span></div>
              <div className="team-image-card"><span>Image 3</span></div>
            </div>
          </div>
        </section>

        {/* When we say farm-to-bowl */}
        <section className="about-section about-team-text">
          <div className="about-container">
            <h2 style={{ textTransform: 'none' }}>See the FoeGuard Difference</h2>
            <p style={{ fontSize: '17px', marginBottom: '16px' }}>
              We raise our own human-grade ingredients in small batches. Each recipe is biologically appropriate and backed by science with support from a PhD biologist and a canine nutritionist. Every product is refined, tested, and fed to our own dogs before it ever reaches yours.
            </p>
            <p className="sub-heading" style={{ fontSize: '17px', marginBottom: '16px', fontWeight: '600' }}>Every FoeGuard meal is:</p>
            <ul className="about-list" style={{ fontSize: '17px', lineHeight: '1.8' }}>
              <li>Prepared in a government-inspected facility</li>
              <li>Professionally formulated for complete, balanced nutrition that exceeds industry standards (AAFCO)</li>
              <li>Free from antibiotics, hormones, fillers, and preservatives</li>
              <li>Made to order and flash frozen at peak freshness</li>
            </ul>
            <p style={{ fontSize: '17px', marginTop: '24px' }}>
              We do the preparation for you, so you never have to question what is in your dog's bowl.
            </p>
          </div>
        </section>

        {/* More than just healthy food plans */}
        <section className="about-section about-mission">
          <div className="about-container">
            <h2 style={{ textTransform: 'none', textAlign: 'center' }}>More than just healthy food plans</h2>
            <p style={{ fontSize: '17px', marginBottom: '16px', textAlign: 'center' }}>
              We want to raise the standard of what pet food should be by giving pet parents a trusted source for information, collaboration, and farm-fresh pet food.
            </p>
            <p className="mission-callout" style={{ fontSize: '17px', fontWeight: '600', marginBottom: '40px', textAlign: 'center' }}>
              If you believe pets deserve real food, you are already part of the mission!
            </p>

            {/* Email Signup */}
            <div className="about-signup">
              {subscribed ? (
                <div className="signup-success">
                  <div className="success-check">✓</div>
                  <p>Welcome to the FoeGuard Pack!</p>
                </div>
              ) : (
                <form onSubmit={handleSubscribe} className="signup-form">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    required
                  />
                  <button type="submit" className="btn-primary" disabled={loading} style={{ borderRadius: '8px' }}>
                    {loading ? 'Joining...' : 'Join the FoeGuard Pack'}
                  </button>
                </form>
              )}
            </div>
          </div>
        </section>
      </div>
      <Footer />
    </>
  );
};
