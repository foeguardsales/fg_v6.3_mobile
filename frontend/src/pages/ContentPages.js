import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Navbar, Footer } from '../components/Layout';

export const AboutPage = () => {
  const navigate = useNavigate();
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
            <h1>Welcome to FoeGuard.</h1>
            <p className="about-hero-statement" style={{ fontSize: '17px', marginBottom: '24px' }}>
              FoeGuard began with a simple conviction:
            </p>
            <p className="highlight-text" style={{ fontSize: '17px', fontWeight: '600' }}>
              If we wouldn't serve it at our own table, we won't put it in our pets' bowls.
            </p>
          </div>
        </section>

        {/* Farm Image Section */}
        <section className="about-farm-image">
          <div className="farm-image-placeholder">
            <span>Farm Image</span>
          </div>
        </section>

        {/* Roots Section */}
        <section className="about-section about-roots">
          <div className="about-container">
            <p className="about-lead-text" style={{ fontSize: '17px' }}>
              With roots in Ontario farming and meat processing, we understand the food chain from soil to serving. Sourcing, handling, and ingredient integrity aren't marketing points to us — they're standards.
            </p>
          </div>
        </section>

        {/* Three Images Section */}
        <section className="about-three-images">
          <div className="about-container">
            <div className="three-images-grid">
              <div className="image-card">
                <div className="image-placeholder">
                  <span>Our Environment</span>
                </div>
              </div>
              <div className="image-card">
                <div className="image-placeholder">
                  <span>Preparation</span>
                </div>
              </div>
              <div className="image-card">
                <div className="image-placeholder">
                  <span>Storage</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* The Difference Section */}
        <section className="about-section about-story">
          <div className="about-container">
            <p style={{ fontSize: '17px', marginBottom: '16px' }}>
              When we began feeding our own dogs fresh, responsibly raised, species-appropriate food, the difference was undeniable.
            </p>
            <p style={{ fontSize: '17px', marginBottom: '24px' }}>
              Stronger digestion.<br />
              Healthier coats.<br />
              Steady energy.<br />
              Real vitality.
            </p>
            <p style={{ fontSize: '17px', marginBottom: '24px', fontWeight: '600' }}>
              It confirmed what nature already designed:
            </p>
            <p style={{ fontSize: '17px', marginBottom: '32px' }}>
              Carnivores thrive on properly raised, minimally processed meat — not heavily manufactured alternatives with unclear origins.
            </p>
            <p style={{ fontSize: '17px', marginBottom: '16px', fontWeight: '600' }}>
              What started as a personal standard became something bigger.
            </p>
            <p style={{ fontSize: '17px', marginBottom: '16px' }}>
              Friends and neighbours began asking for the same meals we were preparing on our farm. Word spread. Demand grew.
            </p>
            <p className="story-conclusion" style={{ fontSize: '17px' }}>
              FoeGuard was born from that demand — and from a commitment to raise the standard of what pet food should be.
            </p>
          </div>
        </section>

        {/* Team Image */}
        <section className="about-team-image">
          <div className="team-image-placeholder">
            <span>Our Team / Dogs Eating FoeGuard</span>
          </div>
        </section>

        {/* From Our Farm Section */}
        <section className="about-section about-farm-bowl">
          <div className="about-container">
            <h2>From Our Farm to Your Bowl</h2>
            <div className="farm-statements">
              <p className="statement-bold" style={{ fontSize: '17px' }}>We are not a distributor.</p>
              <p className="statement-bold" style={{ fontSize: '17px' }}>We are not a white-label brand.</p>
            </div>
            <p style={{ fontSize: '17px', marginBottom: '24px' }}>
              We work directly with trusted Ontario farms — including our own — to source ethically raised, human-grade meats.
            </p>
            <p className="sub-heading" style={{ fontSize: '17px', marginBottom: '16px' }}>Every meal is:</p>
            <ul className="about-list" style={{ fontSize: '17px', lineHeight: '1.8' }}>
              <li>Prepared in a government-inspected facility</li>
              <li>Professionally formulated for complete, balanced nutrition</li>
              <li>Free from antibiotics, hormones, fillers, and preservatives</li>
              <li>Flash frozen at peak freshness</li>
            </ul>
            <p className="farm-conclusion" style={{ fontSize: '17px', marginTop: '24px' }}>
              We oversee every step — from sourcing to preparation to delivery — so you never have to question what's in your pet's bowl.
            </p>
          </div>
        </section>

        {/* Why We Do This Section */}
        <section className="about-section about-why">
          <div className="about-container">
            <h2>Why We Do This</h2>
            <p style={{ fontSize: '17px', marginBottom: '16px' }}>
              Too many guardians feel overwhelmed by unclear labels, inconsistent sourcing, and highly processed options.
            </p>
            <p style={{ fontSize: '17px', marginBottom: '16px', fontWeight: '600' }}>
              Feeding your carnivore shouldn't feel confusing.
            </p>
            <p className="why-emphasis" style={{ fontSize: '17px', marginBottom: '24px' }}>
              It should feel natural. Transparent. Grounded.
            </p>
            <p style={{ fontSize: '17px' }}>
              Raw feeding isn't extreme — it's simply a return to biological design.
            </p>
          </div>
        </section>

        {/* Our Standard Section */}
        <section className="about-section about-team-text">
          <div className="about-container">
            <h2>Our Standard</h2>
            <p style={{ fontSize: '17px', marginBottom: '16px' }}>
              Behind FoeGuard is a network of Ontario farmers, nutrition professionals, and animal specialists committed to one principle:
            </p>
            <p style={{ fontSize: '17px', fontWeight: '600', marginBottom: '24px' }}>
              Uncompromised care.
            </p>
            <p style={{ fontSize: '17px' }}>
              Every recipe is refined, tested, and fed to real dogs and cats — including our own — before it ever reaches yours.
            </p>
          </div>
        </section>

        {/* Mission Section */}
        <section className="about-section about-mission">
          <div className="about-container">
            <h2>Our Mission</h2>
            <p style={{ fontSize: '17px', marginBottom: '16px' }}>
              To provide responsible guardians with a transparent, trustworthy source for farm-fresh, biologically appropriate pet food.
            </p>
            <p style={{ fontSize: '17px', marginBottom: '24px' }}>
              To raise the standard of what pet food should be — real, accountable, and properly sourced.
            </p>
            <p className="mission-callout" style={{ fontSize: '17px', fontWeight: '600', marginBottom: '40px' }}>
              If you believe pets deserve real food, you're already part of the mission.
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
                  <button type="submit" className="btn-primary" disabled={loading}>
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

export const PoliciesPage = () => (
  <>
    <Navbar />
    <div className="content-page">
      <div className="content-container">
        <h1>Policies</h1>
        
        <section>
          <h2>Shipping Policy</h2>
          <p>
            We ship frozen orders within Ontario via insulated packaging with dry ice. Orders placed by Wednesday ship the following Monday. Delivery takes 1-2 business days.
          </p>
          <p>Shipping is calculated at checkout based on your location and order size.</p>
        </section>

        <section>
          <h2>Return & Refund Policy</h2>
          <p>
            Due to the perishable nature of our products, we cannot accept returns. However, if you're unsatisfied with your order, contact us within 7 days of delivery for a refund or replacement.
          </p>
          <p>
            For damaged or incorrect orders, please email photos to hello@foeguard.com within 48 hours of delivery.
          </p>
        </section>

        <section>
          <h2>Storage & Handling</h2>
          <p>
            Keep frozen until ready to use. Thaw in refrigerator for 24 hours before serving. Once thawed, use within 3-4 days. Never refreeze thawed food.
          </p>
          <p>
            Wash hands, bowls, and surfaces after handling raw food. Keep raw food separate from human food.
          </p>
        </section>

        <section>
          <h2>Privacy Policy</h2>
          <p>
            We collect only the information necessary to process orders and communicate with customers. We never sell your data. View our full privacy policy at hello@foeguard.com.
          </p>
        </section>
      </div>
    </div>
    <Footer />
  </>
);

export const TermsPage = () => (
  <>
    <Navbar />
    <div className="content-page">
      <div className="content-container">
        <h1>Terms of Use</h1>
        
        <section>
          <h2>Agreement to Terms</h2>
          <p>
            By accessing FoeGuard's website and purchasing products, you agree to these Terms of Use. If you disagree with any part, you may not access our service.
          </p>
        </section>

        <section>
          <h2>Use of Service</h2>
          <p>
            Our products are intended for pet consumption only. You must be 18 years or older to purchase. You agree to provide accurate information when placing orders.
          </p>
        </section>

        <section>
          <h2>Product Information</h2>
          <p>
            We strive for accuracy in product descriptions, pricing, and availability. However, we reserve the right to correct errors and update information without notice.
          </p>
        </section>

        <section>
          <h2>Payment</h2>
          <p>
            We accept major credit cards via Stripe. Payment is processed at the time of order. Prices are in Canadian dollars and include applicable taxes.
          </p>
        </section>

        <section>
          <h2>Limitation of Liability</h2>
          <p>
            FoeGuard is not liable for any health issues arising from feeding our products. Consult your veterinarian before making dietary changes. We recommend gradual transitions to raw food.
          </p>
        </section>

        <section>
          <h2>Changes to Terms</h2>
          <p>
            We may update these terms at any time. Continued use of our service after changes constitutes acceptance of new terms.
          </p>
        </section>

        <section>
          <h2>Contact</h2>
          <p>
            Questions about these terms? Contact us at hello@foeguard.com.
          </p>
        </section>
      </div>
    </div>
    <Footer />
  </>
);

export const ContactPage = () => {
  const [formData, setFormData] = React.useState({
    name: '',
    phone: '',
    email: '',
    message: ''
  });
  const [submitted, setSubmitted] = React.useState(false);
  const [loading, setLoading] = React.useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    // Simulate form submission
    setTimeout(() => {
      setSubmitted(true);
      setLoading(false);
    }, 1000);
  };

  return (
    <>
      <Navbar />
      <div className="contact-page">
        <div className="contact-container">
          <div className="contact-form-section">
            <h1>Contact Us</h1>
            <p className="contact-intro">
              We love getting inquiries about new products, recommendations and custom recipes. 
              Feel free to reach out through the form below or directly at our contact information.
            </p>

            {submitted ? (
              <div className="contact-success">
                <div className="success-icon">✓</div>
                <h2>Message Sent!</h2>
                <p>Thank you for reaching out. We'll get back to you within 24-48 hours.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="contact-form">
                <div className="form-group">
                  <label>Your Name *</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    placeholder="John Smith"
                    required
                  />
                </div>
                
                <div className="form-row">
                  <div className="form-group">
                    <label>Phone Number</label>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({...formData, phone: e.target.value})}
                      placeholder="+1 (555) 000-0000"
                    />
                  </div>
                  <div className="form-group">
                    <label>Email Address *</label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      placeholder="john@example.com"
                      required
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label>Your Message *</label>
                  <textarea
                    value={formData.message}
                    onChange={(e) => setFormData({...formData, message: e.target.value})}
                    placeholder="How can we help you?"
                    rows={5}
                    required
                  />
                </div>

                <button type="submit" className="btn-primary" disabled={loading}>
                  {loading ? 'Sending...' : 'Send Message'}
                </button>
              </form>
            )}
          </div>

          <div className="contact-info-section">
            <div className="contact-card">
              <h3>Get in Touch</h3>
              
              <div className="contact-item">
                <span className="contact-label">Partnerships & Collaborations</span>
                <a href="mailto:sales@foeguard.com">sales@foeguard.com</a>
              </div>
              
              <div className="contact-item">
                <span className="contact-label">General Inquiries</span>
                <a href="mailto:info@foeguard.com">info@foeguard.com</a>
              </div>
              
              <div className="contact-item">
                <span className="contact-label">Call Us</span>
                <a href="tel:905-466-7787">905-466-7787</a>
              </div>
            </div>

            <div className="contact-card">
              <h3>Hours of Operation</h3>
              <div className="hours-list">
                <div className="hours-row">
                  <span>Monday - Friday</span>
                  <span>9am - 10pm</span>
                </div>
                <div className="hours-row">
                  <span>Saturday</span>
                  <span>9am - 6pm</span>
                </div>
                <div className="hours-row">
                  <span>Sunday</span>
                  <span>Closed</span>
                </div>
              </div>
            </div>

            <div className="contact-card">
              <h3>Corporate Office</h3>
              <p className="address">
                405 The West Mall<br />
                Etobicoke, M9C 5J1, ON<br />
                Canada
              </p>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export const NewToRawPage = () => {
  const navigate = useNavigate();

  return (
    <>
      <Navbar />
      <div className="new-to-fg-page">
        {/* SECTION 1 — Emotional Entry */}
        <section className="ntf-hero">
          <div className="ntf-hero-content">
            <h1>New to FoeGuard?</h1>
            <p className="ntf-hero-subtitle">
              Switching your pet's food doesn't have to feel complicated.
            </p>
            <p className="ntf-hero-text">
              Whether you're new to raw feeding or simply new to us, we make the transition simple, structured, and fully supported.
            </p>
            <p className="ntf-hero-text" style={{ fontWeight: '600', marginTop: '20px' }}>
              You don't have to figure this out alone.
            </p>
          </div>
        </section>

        {/* SECTION 2 — Keep It Simple */}
        <section className="ntf-section ntf-easy" style={{ background: '#F5F3EF' }}>
          <div className="ntf-container">
            <h2 style={{ textAlign: 'center' }}>Feeding Raw Is Easier Than You Think</h2>
            <div className="easy-steps">
              <div className="easy-step">
                <span className="step-number">1</span>
                <p style={{ fontSize: '17px' }}>Store meals in your freezer</p>
              </div>
              <div className="easy-step">
                <span className="step-number">2</span>
                <p style={{ fontSize: '17px' }}>Thaw in the refrigerator</p>
              </div>
              <div className="easy-step">
                <span className="step-number">3</span>
                <p style={{ fontSize: '17px' }}>Serve and watch them thrive</p>
              </div>
            </div>
            <p style={{ fontSize: '17px', textAlign: 'center', marginTop: '32px' }}>
              No complicated prep. No added supplements for complete dinners. <strong>Just real food.</strong>
            </p>
          </div>
        </section>

        {/* SECTION 3 — Why FoeGuard Is Different */}
        <section className="ntf-section ntf-safe" style={{ background: 'white' }}>
          <div className="ntf-container">
            <h2>Why Guardians Feel Confident Switching to FoeGuard</h2>
            <ul className="ntf-list" style={{ fontSize: '17px', lineHeight: '1.8' }}>
              <li>Human-grade ingredients prepared in a government-inspected facility</li>
              <li>Naturally raised meats — no fillers, antibiotics, hormones, or preservatives</li>
              <li>Ethically sourced from our own farms and trusted Canadian partners</li>
              <li>Professionally formulated for complete, balanced nutrition</li>
              <li>Delivered directly across Ontario by our FoeGuard team</li>
            </ul>
          </div>
        </section>

        {/* SECTION 4 — Is Raw Safe? */}
        <section className="ntf-section" style={{ background: '#F5F3EF' }}>
          <div className="ntf-container">
            <h2>Is Raw Safe?</h2>
            <p style={{ fontSize: '17px', marginBottom: '24px' }}>
              When handled properly — yes.
            </p>
            <p style={{ fontSize: '17px', marginBottom: '16px' }}>
              Dogs and cats are biologically designed to digest raw meat, bone, and organ. The key is quality, formulation, and proper storage.
            </p>
            <p className="ntf-emphasis" style={{ fontSize: '17px', marginBottom: '16px' }}>
              At FoeGuard, every meal is:
            </p>
            <ul className="ntf-list" style={{ fontSize: '17px', marginBottom: '24px' }}>
              <li>Professionally balanced</li>
              <li>Prepared in a government-inspected facility</li>
              <li>Flash frozen immediately</li>
              <li>Handled with the same standards you would use for your own food</li>
            </ul>
            <p style={{ fontSize: '17px' }}>
              Raw feeding isn't extreme.<br />
              It's simply a return to biological design.
            </p>
          </div>
        </section>

        {/* SECTION 5 — When Diet Is the Missing Piece */}
        <section className="ntf-section ntf-problem" style={{ background: 'white' }}>
          <div className="ntf-container">
            <h2>When Diet Is the Missing Piece</h2>
            <p style={{ fontSize: '17px', marginBottom: '16px' }}>
              Many guardians feel frustrated by unclear labels and inconsistent sourcing.
            </p>
            <p style={{ fontSize: '17px' }}>
              While we can't promise instant answers, switching to properly sourced, biologically appropriate food often removes one of the biggest unknowns — their diet.
            </p>
          </div>
        </section>

        {/* SECTION 6 — Transition Guide */}
        <section className="ntf-section ntf-transition" style={{ background: '#F5F3EF' }}>
          <div className="ntf-container">
            <h2>How Do I Transition My Pet?</h2>
            <p style={{ fontSize: '17px', marginBottom: '16px' }}>
              Because our meals are nutrient-dense and minimally processed, a thoughtful transition helps avoid digestive upset.
            </p>
            <p style={{ fontSize: '17px', marginBottom: '32px' }}>We recommend the following approaches:</p>

            {/* Option 1 */}
            <div className="transition-option">
              <h3>Option 1: 10-Day Gradual Transition</h3>
              <p className="option-subtitle">
                Best for kibble-fed pets, sensitive stomachs, puppies, seniors, or cautious guardians.
              </p>
              <div className="transition-schedule">
                <div className="schedule-row">
                  <span className="day">Day 1</span>
                  <span className="ratio">10% FoeGuard / 90% current food</span>
                </div>
                <div className="schedule-row">
                  <span className="day">Day 2</span>
                  <span className="ratio">20% FoeGuard / 80% current food</span>
                </div>
                <div className="schedule-row highlight">
                  <span className="day">...</span>
                  <span className="ratio">Continue increasing FoeGuard by 10% daily</span>
                </div>
                <div className="schedule-row">
                  <span className="day">Day 10</span>
                  <span className="ratio">100% FoeGuard — fully transitioned!</span>
                </div>
              </div>
              <div className="transition-tips">
                <p><span className="tip-check">✓</span> Feed slightly smaller portions during transition</p>
                <p><span className="tip-check">✓</span> Monitor stool consistency</p>
                <p><span className="tip-check">✓</span> Avoid introducing new treats during this period</p>
              </div>
              <p className="method-note">This method is the safest and most predictable.</p>
            </div>

            {/* Option 2 */}
            <div className="transition-option optional-method">
              <h3>Optional: Structured Fast + Switch</h3>
              <p className="option-subtitle warning">
                Only recommended for healthy adult dogs already eating raw or lightly processed diets.
              </p>
              <ol className="numbered-list">
                <li>Feed their regular meal in the morning.</li>
                <li>Allow a 24-hour digestive reset (water is fine).</li>
                <li>Introduce FoeGuard at the next evening meal.</li>
              </ol>
              <div className="important-note">
                <strong>Important:</strong>
                <ul>
                  <li>Start with a slightly smaller portion than usual.</li>
                  <li>We generally do not recommend fasting for kibble-fed dogs unless guided.</li>
                  <li>Feed one or two meals per day.</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 7 — If They Won't Eat */}
        <section className="ntf-section ntf-wont-eat" style={{ background: 'white' }}>
          <div className="ntf-container">
            <h2>What If My Dog or Cat Won't Eat Raw?</h2>
            <p style={{ fontSize: '17px', marginBottom: '16px' }}>
              Transitioning to raw is often <strong>behavioural</strong> — not nutritional.
            </p>
            <p style={{ fontSize: '17px', marginBottom: '16px' }}>
              Many pets are accustomed to processed foods engineered for taste intensity, flavour enhancers, and frequent treats. Real food can feel unfamiliar at first.
            </p>
            <p style={{ fontSize: '17px', fontWeight: '600', marginBottom: '24px' }}>
              Consistency and structure usually solve it.
            </p>
            <p style={{ fontSize: '17px', marginBottom: '16px' }}>To encourage success:</p>
            <ul className="ntf-list" style={{ fontSize: '17px', marginBottom: '24px' }}>
              <li>Feed at consistent times</li>
              <li>Avoid free-feeding</li>
              <li>Limit treats during transition</li>
              <li>Ensure your dog is exercised before mealtime</li>
              <li>Remove the bowl after 15–20 minutes if uneaten</li>
            </ul>
            <p style={{ fontSize: '17px', marginBottom: '16px' }}>
              Structure builds appetite. If they skip a meal, store the food in the fridge and offer it again at the next scheduled feeding.
            </p>
            <p className="conclusion-text" style={{ fontSize: '17px' }}>
              With patience and consistency, most pets adapt quickly — and thrive.
            </p>
          </div>
        </section>

        {/* SECTION 8 — How Much to Feed */}
        <section className="ntf-section ntf-amount" style={{ background: '#F5F3EF' }}>
          <div className="ntf-container">
            <h2>How Much Should I Feed?</h2>
            <p style={{ fontSize: '17px', marginBottom: '16px' }}>As a general guideline:</p>
            <ul className="ntf-list" style={{ fontSize: '17px', marginBottom: '24px' }}>
              <li><strong>Adult dogs:</strong> 2–3% of body weight daily</li>
              <li><strong>Adult cats:</strong> 2.5–3.5% daily</li>
              <li><strong>Puppies & kittens:</strong> require more depending on age</li>
            </ul>
            <p style={{ fontSize: '17px', marginBottom: '16px' }}>
              Body condition matters more than strict percentages — adjust as needed based on activity level, metabolism, and goals.
            </p>
            <p style={{ fontSize: '17px' }}>
              If you're unsure, check out our <a href="/calculator" className="ntf-link">Feeding Calculator</a> or contact us directly, we're happy to guide you.
            </p>
          </div>
        </section>

        {/* SECTION 9 — Comparison Table (Simplified) */}
        <section className="ntf-section ntf-compare" style={{ background: 'white' }}>
          <div className="ntf-container">
            <h2>Compare Us to Others</h2>
            <div className="comparison-table-wrapper">
              <table className="comparison-table">
                <thead>
                  <tr>
                    <th className="feature-col"></th>
                    <th className="brand-col foeguard-col">
                      <span className="brand-name">FoeGuard</span>
                    </th>
                    <th className="brand-col">
                      <span className="brand-name">Retail Raw</span>
                    </th>
                    <th className="brand-col">
                      <span className="brand-name">Kibble</span>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="feature-cell">Human-Grade Ingredients</td>
                    <td className="check-cell foeguard-cell"><span className="check-icon">✓</span></td>
                    <td className="check-cell"><span className="x-icon">✗</span></td>
                    <td className="check-cell"><span className="x-icon">✗</span></td>
                  </tr>
                  <tr>
                    <td className="feature-cell">Organic & Non-GMO</td>
                    <td className="check-cell foeguard-cell"><span className="check-icon">✓</span></td>
                    <td className="check-cell"><span className="x-icon">✗</span></td>
                    <td className="check-cell"><span className="x-icon">✗</span></td>
                  </tr>
                  <tr>
                    <td className="feature-cell">Farm Fresh</td>
                    <td className="check-cell foeguard-cell"><span className="check-icon">✓</span></td>
                    <td className="check-cell"><span className="x-icon">✗</span></td>
                    <td className="check-cell"><span className="x-icon">✗</span></td>
                  </tr>
                  <tr>
                    <td className="feature-cell">Transparent Sourcing</td>
                    <td className="check-cell foeguard-cell"><span className="check-icon">✓</span></td>
                    <td className="check-cell"><span className="x-icon">✗</span></td>
                    <td className="check-cell"><span className="x-icon">✗</span></td>
                  </tr>
                  <tr>
                    <td className="feature-cell">Ethically Raised in Small Batches</td>
                    <td className="check-cell foeguard-cell"><span className="check-icon">✓</span></td>
                    <td className="check-cell"><span className="x-icon">✗</span></td>
                    <td className="check-cell"><span className="x-icon">✗</span></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* FINAL CTA */}
        <section className="ntf-section ntf-start" style={{ background: '#F5F3EF' }}>
          <div className="ntf-container">
            <h2>Ready to Start Simple?</h2>
            <p style={{ fontSize: '17px', marginBottom: '32px', textAlign: 'center' }}>
              Build your first box and see how your pet responds.
            </p>
            <p style={{ fontSize: '17px', fontWeight: '600', marginBottom: '32px', textAlign: 'center' }}>
              Structured. Balanced. Farm-raised.
            </p>
            <div className="ntf-cta">
              <button 
                className="btn-primary"
                onClick={() => navigate('/build-box')}
              >
                Build Your Box
              </button>
            </div>
          </div>
        </section>
      </div>
      <Footer />
    </>
  );
};
