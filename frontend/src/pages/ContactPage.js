import React, { useState } from 'react';
import { Navbar, Footer } from '../components/Layout';

export const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    message: ''
  });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

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
            <h1 style={{ fontFamily: "'Rubik', sans-serif" }}>Contact Us</h1>
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
