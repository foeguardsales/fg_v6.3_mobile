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
            <h1 style={{ textTransform: 'none', fontFamily: "'CS Gordon', serif" }}>Why FoeGuard?</h1>
            <p style={{ fontSize: '18px', color: 'rgba(255,255,255,0.9)', marginTop: '20px' }}>
              No fancy packaging, retail markups, or empty marketing. Just what your dog was meant to eat — since forever.
            </p>
          </div>
        </section>

        {/* Farm Image Section */}
        <section className="about-farm-image">
          <div className="farm-image-placeholder">
            <span>Farm Image</span>
          </div>
        </section>

        {/* Just because it's edible */}
        <section className="about-section about-story">
          <div className="about-container">
            <h2 style={{ textTransform: 'none' }}>Just because it's edible for your dog doesn't mean it's healthy for them</h2>
            <p style={{ fontSize: '17px', marginBottom: '24px', fontWeight: '600' }}>
              We have become accustomed to commercial dog food that is "backed by science," but what do the results really show?
            </p>
            <p style={{ fontSize: '17px', marginBottom: '16px' }}>
              In recent years, pet parents have been faced with more health issues related to aging, digestion, allergies, and urinary health than ever before. Not only can this lower your dog's quality of life, but it can also create an unclear future filled with unexpected vet bills and prescription diets.
            </p>
          </div>
        </section>

        {/* The FoeGuard Difference */}
        <section className="about-section about-farm-bowl">
          <div className="about-container">
            <h2 style={{ textTransform: 'none' }}>The FoeGuard difference</h2>
            <p style={{ fontSize: '17px', marginBottom: '16px' }}>
              For years, our own health practitioners have told us to eat as much fresh, locally sourced food as possible while reducing processed foods wherever we can. We believe the same logic applies to our beloved pets.
            </p>
            <p style={{ fontSize: '17px', marginBottom: '0' }}>
              For dogs to live long, healthy, and happy lives, they need food that is fresh, locally sourced, and as close to what nature intended as possible through a biologically appropriate raw food diet.
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

        {/* From our family to yours */}
        <section className="about-section about-why">
          <div className="about-container">
            <h2 style={{ textTransform: 'none' }}>From our family to yours</h2>
            <p style={{ fontSize: '17px', marginBottom: '16px' }}>
              We are a family-run farm dedicated to raising livestock as nature intended.
            </p>
            <p style={{ fontSize: '17px', marginBottom: '16px' }}>
              With roots in Ontario farming and meat processing, we understand the food chain from soil to serving. That is why every FoeGuard product is made fresh using the same ingredients we use to feed our own family — with the same quality and care, but made for your pets.
            </p>
            <p style={{ fontSize: '17px', marginBottom: '16px' }}>
              What started as a personal standard became something bigger when friends and neighbours began asking for the same meals we were preparing on our farm. We quickly realized that pet parents across Ontario need better access to healthy, transparent raw dog food.
            </p>
            <p style={{ fontSize: '17px', fontWeight: '600' }}>
              That is why we created FoeGuard: to raise the standard of what pet food should be.
            </p>
          </div>
        </section>

        {/* When we say farm-to-bowl */}
        <section className="about-section about-team-text">
          <div className="about-container">
            <h2 style={{ textTransform: 'none' }}>When we say farm-to-bowl, we mean it</h2>
            <p style={{ fontSize: '17px', marginBottom: '16px' }}>
              We source our own ethically raised, human-grade meats. Each recipe is biologically appropriate and backed by science with support from a PhD biologist and a canine nutritionist. Every product is refined, tested, and fed to our own dogs before it ever reaches yours.
            </p>
            <p className="sub-heading" style={{ fontSize: '17px', marginBottom: '16px', fontWeight: '600' }}>Every meal is:</p>
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
              We want to raise the standard of what pet food should be by giving pet parents a trusted source for information, collaboration, and personalized farm-fresh pet food.
            </p>
            <p className="mission-callout" style={{ fontSize: '17px', fontWeight: '600', marginBottom: '40px', textAlign: 'center' }}>
              If you believe pets deserve real food, you are already part of the mission.
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
