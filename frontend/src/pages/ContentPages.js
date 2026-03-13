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
            <h1 style={{ textTransform: 'none' }}>Why FoeGuard?</h1>
            <p style={{ fontSize: '18px', color: 'rgba(255,255,255,0.9)', marginTop: '20px' }}>
              No fancy packaging, retail mark-ups, or empty marketing. Just what your dog was meant to eat — since forever.
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
            <h2 style={{ textTransform: 'none' }}>Just because it's edible for your dog doesn't mean it's healthy for them.</h2>
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
            <h2 style={{ textTransform: 'none' }}>The FoeGuard Difference</h2>
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
            <h2 style={{ textTransform: 'none' }}>When we say farm-to-bowl, we mean it.</h2>
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
        {/* SECTION 1 — Hero */}
        <section className="ntf-hero">
          <div className="ntf-hero-content">
            <h1 style={{ textTransform: 'none' }}>New to FG</h1>
            <p className="ntf-hero-subtitle" style={{ fontWeight: '600', fontSize: '18px', marginBottom: '16px' }}>
              No complicated prep. No added supplements required for complete dinners.
            </p>
          </div>
        </section>

        {/* SECTION 2 — Feel confident */}
        <section className="ntf-section ntf-easy" style={{ background: '#F5F3EF' }}>
          <div className="ntf-container">
            <h2 style={{ textAlign: 'center', textTransform: 'none' }}>Feel confident about switching to FoeGuard Raw.</h2>
            <p style={{ fontSize: '17px', marginBottom: '16px', textAlign: 'center', fontWeight: '600' }}>
              Dogs are biologically designed to thrive on raw food nutrition. Their powerful stomach acid, sharp teeth, and short digestive systems allow them to efficiently digest raw meat, organs, and bone.
            </p>
            <p style={{ fontSize: '17px', marginBottom: '0', textAlign: 'center' }}>
              FoeGuard was built to feed dogs the way nature intended. We use fresh, organic, whole-prey, human-grade ingredients that are made for your dog's anatomy to digest easily, maximize nutrient absorption, and support noticeable results.
            </p>
          </div>
        </section>

        {/* SECTION 3 — How FoeGuard compares */}
        <section className="ntf-section ntf-safe" style={{ background: 'white' }}>
          <div className="ntf-container">
            <h2 style={{ textTransform: 'none' }}>How FoeGuard compares</h2>
            
            <div style={{ marginBottom: '32px' }}>
              <h3 style={{ fontSize: '20px', marginBottom: '12px', fontWeight: '600' }}>Retail Raw</h3>
              <p style={{ fontSize: '17px', lineHeight: '1.7' }}>
                Retail raw food brands can offer a healthier alternative for pet owners, but they often lack transparent sourcing and clarity around what cuts of meat are being used or how the ingredients are raised. Livestock raised on antibiotics, hormones, or GMO feeds can have an immediate effect on your dog, while months-old, lower-quality cuts can become more problematic over time.
              </p>
            </div>

            <div style={{ marginBottom: '32px' }}>
              <h3 style={{ fontSize: '20px', marginBottom: '12px', fontWeight: '600' }}>Gently Cooked</h3>
              <p style={{ fontSize: '17px', lineHeight: '1.7' }}>
                Gently cooked food is another option that can be better than kibble when balanced and prepared correctly, but it is not as nutritionally intact as raw in its natural form. The cooking process can reduce nutrient availability and change the integrity of the final product. Dogs are not humans — you do not need to taste-test their food to know what they are anatomically designed to eat.
              </p>
            </div>

            <div style={{ marginBottom: '0' }}>
              <h3 style={{ fontSize: '20px', marginBottom: '12px', fontWeight: '600' }}>Kibble</h3>
              <p style={{ fontSize: '17px', lineHeight: '1.7' }}>
                Kibble is extremely processed, regardless of what ingredients are used or how fancy the packaging looks. It is cooked at high temperatures, which can destroy essential nutrients and make it harder for pets to digest. Minimal pet food regulations also allow for lower-quality meat, vague sourcing, and highly processed ingredients hidden behind marketing terms such as "natural," protein "meals," and "made with meat," even when only a small percentage is actually required to meet AAFCO standards.
              </p>
            </div>
          </div>
        </section>

        {/* SECTION 4 — Discover what really works */}
        <section className="ntf-section ntf-problem" style={{ background: '#F5F3EF' }}>
          <div className="ntf-container">
            <h2 style={{ textTransform: 'none' }}>Discover what really works for your dog</h2>
            <p style={{ fontSize: '17px', marginBottom: '16px' }}>
              Get a clearer understanding of your dog's health and the flavours they truly enjoy.
            </p>
            <p style={{ fontSize: '17px', marginBottom: '16px' }}>
              Many guardians feel frustrated by unclear labels and inconsistent sourcing.
            </p>
            <p style={{ fontSize: '17px' }}>
              While we cannot promise instant answers, switching to properly sourced, biologically appropriate food often removes one of the biggest unknowns when something is making your dog uncomfortable — their diet.
            </p>
          </div>
        </section>

        {/* SECTION 5 — Is Raw Safe? */}
        <section className="ntf-section" style={{ background: 'white' }}>
          <div className="ntf-container">
            <h2 style={{ textTransform: 'none' }}>Is Raw food safe for my dog?</h2>
            <p style={{ fontSize: '17px', marginBottom: '24px' }}>
              When handled properly — yes.
            </p>
            <p style={{ fontSize: '17px', marginBottom: '16px' }}>
              Dogs and cats are biologically designed to digest raw meat, bone, and organ. The key is quality, formulation, and proper storage.
            </p>
            <p className="ntf-emphasis" style={{ fontSize: '17px', marginBottom: '16px', fontWeight: '600' }}>
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

        {/* SECTION 6 — Transition Guide */}
        <section className="ntf-section ntf-transition" style={{ background: '#F5F3EF' }}>
          <div className="ntf-container">
            <h2 style={{ textTransform: 'none' }}>How Do I Transition My Pet?</h2>
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
            <h2 style={{ textTransform: 'none' }}>What If My Dog or Cat Won't Eat Raw?</h2>
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

        {/* SECTION 8 — Comparison Table */}
        <section className="ntf-section ntf-compare" style={{ background: '#F5F3EF' }}>
          <div className="ntf-container">
            <h2 style={{ textTransform: 'none' }}>Compare us to others</h2>
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

        {/* SECTION 9 — Ready to start simple */}
        <section className="ntf-section ntf-start" style={{ background: 'white' }}>
          <div className="ntf-container">
            <h2 style={{ textTransform: 'none' }}>Ready to start simple?</h2>
            <p style={{ fontSize: '17px', marginBottom: '32px', textAlign: 'center' }}>
              Build your first box and see how your pet responds.
            </p>
            <div className="ntf-cta" style={{ textAlign: 'center' }}>
              <button 
                className="btn-primary"
                onClick={() => navigate('/build-box')}
                style={{ borderRadius: '8px' }}
              >
                Build Your Box
              </button>
            </div>
          </div>
        </section>

        {/* FINAL CTA */}
        <section className="ntf-section ntf-final-cta" style={{ background: '#F5F3EF' }}>
          <div className="ntf-container">
            <h2 style={{ textTransform: 'none' }}>Ready to make your dog's meal plan?</h2>
            <div className="ntf-cta" style={{ textAlign: 'center', marginTop: '32px' }}>
              <button 
                className="btn-primary"
                onClick={() => navigate('/build-box')}
                style={{ borderRadius: '8px' }}
              >
                Create Your Plan
              </button>
            </div>
          </div>
        </section>
      </div>
      <Footer />
    </>
  );
};
