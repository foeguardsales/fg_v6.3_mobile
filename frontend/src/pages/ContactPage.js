import React, { useState } from 'react';
import { Navbar, Footer } from '../components/Layout';
import { useShopifyPage } from '../hooks/useShopifyPage';
import { getMetafieldMetaobjects } from '../services/shopify/pageMeta';
import { richTextToHtml } from '../components/ShopifyPageBuilder';
import { SeoHead } from '../components/SeoHead';

export const ContactPage = () => {
  const { page: contactPage } = useShopifyPage('contact');
  const [formData, setFormData] = useState({ name: '', phone: '', email: '', message: '' });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const sections = getMetafieldMetaobjects(contactPage, 'page_builder') || [];
  const hero = sections.find((s) => /hero/.test(s.__type || ''));
  const details = sections.find((s) => /contact_details/.test(s.__type || ''));

  const heroTitle = hero ? (hero.page_hero_header || hero.header || hero.title) : 'Contact Us';
  const heroSub = hero ? (hero.page_hero_subheading || hero.subheading || hero.subheader) : null;
  const heroImg = hero ? (hero.page_hero_image || hero.image) : null;
  const detailsTitle = details ? (details.title || details.header || 'Get in Touch') : 'Get in Touch';
  const detailsHtml = details ? richTextToHtml(details.section_content || details.body_content || '') : '';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => { setSubmitted(true); setLoading(false); }, 1000);
  };

  return (
    <>
      <SeoHead endpoint="/api/shopify/page/contact" fallback={{ title: 'Contact | FoeGuard' }} />
      <Navbar />

      {/* Hero image (page_builder) */}
      {heroImg && (
        <section className="spb-hero-img" data-testid="contact-hero-img">
          <img src={typeof heroImg === 'string' ? heroImg : heroImg.url} alt={heroTitle || ''} />
        </section>
      )}

      <div className="contact-page">
        <div className="contact-container">
          <div className="contact-form-section">
            <h1 style={{ fontFamily: "'Barlow Semi Condensed', serif" }}>{heroTitle || 'Contact Us'}</h1>
            <p className="contact-intro">
              {heroSub || 'We love getting inquiries about new products, recommendations and custom recipes. Feel free to reach out through the form below or directly at our contact information.'}
            </p>

            {submitted ? (
              <div className="contact-success">
                <div className="success-icon">✓</div>
                <h2>Message Sent!</h2>
                <p>Thank you for reaching out. We&apos;ll get back to you within 24-48 hours.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="contact-form">
                <div className="form-group">
                  <label>Your Name *</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
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
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="+1 (555) 000-0000"
                    />
                  </div>
                  <div className="form-group">
                    <label>Email Address *</label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="john@example.com"
                      required
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label>Your Message *</label>
                  <textarea
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
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
            <div className="contact-card" data-testid="contact-details">
              <h3>{detailsTitle}</h3>
              {detailsHtml
                ? <div className="spb-rich" dangerouslySetInnerHTML={{ __html: detailsHtml }} />
                : (
                  <>
                    <div className="contact-item">
                      <span className="contact-label">Partnerships &amp; Collaborations</span>
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
                  </>
                )}
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default ContactPage;
