import React from 'react';
import { Navbar, Footer } from '../components/Layout';

export const AboutPage = () => (
  <>
    <Navbar />
    <div className="content-page">
      <div className="content-container">
        <h1>About FoeGuard</h1>
        
        <section>
          <h2>Our Story</h2>
          <p>
            FoeGuard was born from a simple belief: our pets deserve the same quality food we eat. Based in Ontario, we partner with local farms to source human-grade ingredients, creating biologically appropriate raw meals that honor your pet's carnivorous nature.
          </p>
          <p>
            Every recipe is crafted with care, combining muscle meat, organ meats, ground bone, and fresh vegetables to deliver complete, balanced nutrition. We believe raw feeding isn't a trend—it's a return to what nature intended.
          </p>
        </section>

        <section>
          <h2>Why Raw Feeding?</h2>
          <h3>Biologically Appropriate Nutrition</h3>
          <p>
            Dogs and cats are carnivores. Their digestive systems are designed to process raw meat, bones, and organs—not heavily processed kibble. Raw diets provide enzymes, natural probiotics, and bioavailable nutrients that cooking destroys.
          </p>

          <h3>The Benefits You'll See</h3>
          <ul className="benefits-list">
            <li><strong>Improved Digestion:</strong> Smaller, firmer stools and reduced gas</li>
            <li><strong>Healthier Skin & Coat:</strong> Natural oils create shine and reduce shedding</li>
            <li><strong>More Energy:</strong> Clean protein fuels vitality without fillers</li>
            <li><strong>Stronger Immunity:</strong> Nutrient-dense food supports immune function</li>
            <li><strong>Better Weight Management:</strong> High protein, low carb keeps pets lean</li>
            <li><strong>Cleaner Teeth:</strong> Chewing raw bones naturally cleans teeth</li>
          </ul>

          <h3>Feeding Guidelines</h3>
          <p>
            Feed 2-3.5% of your pet's body weight daily for adult dogs and 3-3.5% for adult cats. Puppies and kittens require more based on age:
          </p>
          <ul className="benefits-list">
            <li><strong>Puppies (2-4 months):</strong> 10-13% of body weight</li>
            <li><strong>Puppies (4-8 months):</strong> 6-10% of body weight</li>
            <li><strong>Puppies (8-12 months):</strong> 3-6% of body weight</li>
            <li><strong>Kittens (2-4 months):</strong> 6-9% of body weight</li>
            <li><strong>Kittens (4-8 months):</strong> 5-8% of body weight</li>
            <li><strong>Kittens (8-12 months):</strong> 2-6% of body weight</li>
          </ul>
          <p>Adjust portions based on activity level, metabolism, and weight goals. Always consult your veterinarian when changing diets.</p>

          <h3>Is Raw Safe?</h3>
          <p>
            When handled properly, raw feeding is safe and vet-recommended. Dogs and cats have highly acidic stomachs designed to handle bacteria that would affect humans. We follow strict food safety protocols, and our meals are frozen immediately to preserve freshness.
          </p>
          <p>
            Always thaw in the refrigerator, wash hands and surfaces after handling, and transition gradually if your pet is new to raw food.
          </p>
        </section>

        <section>
          <h2>Our Commitment</h2>
          <ul className="benefits-list">
            <li>100% human-grade ingredients</li>
            <li>No hormones, antibiotics, or preservatives</li>
            <li>Ontario-sourced whenever possible</li>
            <li>Ethically raised proteins</li>
            <li>Frozen fresh, never freeze-dried or dehydrated</li>
          </ul>
        </section>
      </div>
    </div>
    <Footer />
  </>
);

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
  return (
    <>
      <Navbar />
      <div className="content-page">
        <div className="content-container">
          <h1>New to FoeGuard or Raw Feeding?</h1>
          
          <section>
            <h2>Transitioning is Easier Than You Think</h2>
            <p>
              Whether you're switching from kibble or another raw brand, we guide you every step of the way — so feeding better never feels overwhelming.
            </p>
          </section>

          <section>
            <h2>Why Go Raw?</h2>
            <p>
              Dogs and cats are carnivores. Their digestive systems are designed to process raw meat, bones, and organs — not heavily processed kibble that sits on shelves for months.
            </p>
            <p>
              Raw diets provide enzymes, natural probiotics, and bioavailable nutrients that cooking destroys. Most pet guardians see visible improvements within the first 14 days.
            </p>
          </section>

          <section>
            <h2>How to Transition</h2>
            <p>
              We recommend a gradual transition over 7-10 days:
            </p>
            <ul className="benefits-list">
              <li><strong>Days 1-3:</strong> 25% FoeGuard, 75% current food</li>
              <li><strong>Days 4-6:</strong> 50% FoeGuard, 50% current food</li>
              <li><strong>Days 7-9:</strong> 75% FoeGuard, 25% current food</li>
              <li><strong>Day 10+:</strong> 100% FoeGuard</li>
            </ul>
            <p>
              Some pets with sensitive stomachs may need a slower transition. If you notice loose stools, slow down and give their system time to adjust.
            </p>
          </section>

          <section>
            <h2>The FoeGuard Promise</h2>
            <ul className="benefits-list">
              <li>Free custom meal consultation</li>
              <li>Farm-fresh delivery to your door</li>
              <li>Transition support for new raw feeders</li>
              <li>Free Raw Feeding Guide ($29 value)</li>
              <li>14-Day Happiness Guarantee</li>
            </ul>
          </section>

          <section style={{ textAlign: 'center', marginTop: '48px' }}>
            <button 
              className="btn-primary"
              onClick={() => window.location.href = '/build-box'}
            >
              Build Your Risk-Free Trial Box
            </button>
          </section>
        </div>
      </div>
      <Footer />
    </>
  );
};
