import React, { useState } from 'react';
import { Navbar, Footer } from '../components/Layout';

const PROTEINS = [
  {
    label: 'Chicken',
    url: 'https://customer-assets.emergentagent.com/job_b68c2142-db90-4d98-9725-e1ffe0396c9b/artifacts/dksu613b_chicken.png',
    desc: 'A lean, easy-to-digest everyday protein — gentle on most dogs and rich in highly absorbable amino acids for muscle and energy.'
  },
  {
    label: 'Beef',
    url: 'https://customer-assets.emergentagent.com/job_b68c2142-db90-4d98-9725-e1ffe0396c9b/artifacts/262n9jvl_beef.png',
    desc: 'Hearty, iron-rich red meat loaded with B12 and zinc — builds strong muscle and supports steady energy in active dogs.'
  },
  {
    label: 'Turkey',
    url: 'https://customer-assets.emergentagent.com/job_b68c2142-db90-4d98-9725-e1ffe0396c9b/artifacts/j6yxejew_turkey.png',
    desc: 'A naturally lean white meat that\u2019s easy on sensitive stomachs while delivering plenty of protein, selenium and B vitamins.'
  },
  {
    label: 'Duck',
    url: 'https://customer-assets.emergentagent.com/job_b68c2142-db90-4d98-9725-e1ffe0396c9b/artifacts/s3okrgsw_duck.png',
    desc: 'A novel, omega-rich protein perfect for dogs with chicken sensitivities — supports skin, coat and joint health.'
  },
  {
    label: 'Goat',
    url: 'https://customer-assets.emergentagent.com/job_b68c2142-db90-4d98-9725-e1ffe0396c9b/artifacts/0u52lnr0_goat.png',
    desc: 'A clean, low-fat novel protein that\u2019s naturally hypoallergenic and easy to digest \u2014 ideal for itchy or sensitive pups.'
  },
  {
    label: 'Salmon',
    url: 'https://customer-assets.emergentagent.com/job_b68c2142-db90-4d98-9725-e1ffe0396c9b/artifacts/l6i3vb5d_salmon.png',
    desc: 'Wild-caught omega-3 powerhouse \u2014 boosts brain function, joint mobility and gives that signature glossy, healthy coat.'
  },
  {
    label: 'Lamb',
    url: 'https://customer-assets.emergentagent.com/job_b68c2142-db90-4d98-9725-e1ffe0396c9b/artifacts/pgajdkxv_lamb.png',
    desc: 'A rich, flavour-packed red meat full of iron and zinc \u2014 a satisfying choice for picky eaters and active breeds.'
  },
  {
    label: 'Rabbit',
    url: 'https://customer-assets.emergentagent.com/job_b68c2142-db90-4d98-9725-e1ffe0396c9b/artifacts/ptl7se73_rabbit.png',
    desc: 'Ultra-lean and hypoallergenic \u2014 the gold standard novel protein for allergy-prone dogs and elimination diets.'
  }
];

export const AboutPage = () => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubscribe = async (e) => {
    e.preventDefault();
    if (!email) return;
    setLoading(true);
    setTimeout(() => {
      setSubscribed(true);
      setLoading(false);
    }, 800);
  };

  const titleStyle = {
    textTransform: 'none',
    fontFamily: "'Lora', serif",
    letterSpacing: '-0.4px'
  };

  return (
    <>
      <Navbar />
      <div className="about-page">
        {/* Hero Section */}
        <section className="about-hero">
          <div className="about-hero-content">
            <h1 style={titleStyle}>About Us</h1>
            <p style={{ fontSize: '18px', color: '#D8CFB8', marginTop: '20px' }}>
              From Our Family to Yours
            </p>
          </div>
        </section>

        {/* OUR STORY */}
        <section className="about-section about-story" data-testid="about-our-story">
          <div className="about-container">
            <div className="about-story-hero-image" data-testid="about-story-hero-image">
              <img
                src="https://customer-assets.emergentagent.com/job_b68c2142-db90-4d98-9725-e1ffe0396c9b/artifacts/kalssi9a_farm_image1.jpg"
                alt="FoeGuard family farm"
              />
            </div>
            <h2 style={titleStyle}>Our Story</h2>
            <p style={{ fontSize: '17px', marginBottom: '20px', lineHeight: '1.75' }}>
              It started on our small farm in Acton, ON — and honestly, it started because of one dog.
            </p>
            <p style={{ fontSize: '17px', marginBottom: '20px', lineHeight: '1.75' }}>
              Negus, our breeding German Shepherd male, kept having health issues we couldn&apos;t get ahead of. When we went looking for raw food made with fresh, whole ingredients raised to our standards, we came up empty. So we made it ourselves. The difference was hard to ignore — we switched all of our dogs over, and before long neighbours were asking for meals. Then their friends did too.
            </p>
            <p style={{ fontSize: '17px', marginBottom: '20px', lineHeight: '1.75' }}>
              As third-generation farmers and award-winning German Shepherd breeders, we turned that passion into a profession — building recipes with other breeders, nutritionists, and pet parents who cared just as much as we did.
            </p>
            <p style={{ fontSize: '17px', marginBottom: '0', lineHeight: '1.75', fontWeight: 600 }}>
              FoeGuard was created for the community, by the community.
            </p>
          </div>
        </section>

        {/* Team Images */}
        <section className="about-team-images-grid">
          <div className="team-grid">
            <div className="team-image-card" style={{ overflow: 'hidden' }}><img src="https://customer-assets.emergentagent.com/job_b68c2142-db90-4d98-9725-e1ffe0396c9b/artifacts/kalssi9a_farm_image1.jpg" alt="Goats grazing on pasture" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /></div>
            <div className="team-image-card" style={{ overflow: 'hidden' }}><img src="https://customer-assets.emergentagent.com/job_b68c2142-db90-4d98-9725-e1ffe0396c9b/artifacts/jbtl1zq1_farm_image2.png" alt="FoeGuard produce storage facility" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /></div>
            <div className="team-image-card" style={{ overflow: 'hidden' }}><img src="https://customer-assets.emergentagent.com/job_b68c2142-db90-4d98-9725-e1ffe0396c9b/artifacts/rsur7vju_farm_image3.jpg" alt="Free-range chickens on farm" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /></div>
          </div>
          <div className="team-carousel">
            <div className="team-carousel-track">
              <div className="team-image-card" style={{ overflow: 'hidden' }}><img src="https://customer-assets.emergentagent.com/job_b68c2142-db90-4d98-9725-e1ffe0396c9b/artifacts/kalssi9a_farm_image1.jpg" alt="Goats grazing on pasture" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /></div>
              <div className="team-image-card" style={{ overflow: 'hidden' }}><img src="https://customer-assets.emergentagent.com/job_b68c2142-db90-4d98-9725-e1ffe0396c9b/artifacts/jbtl1zq1_farm_image2.png" alt="FoeGuard produce storage facility" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /></div>
              <div className="team-image-card" style={{ overflow: 'hidden' }}><img src="https://customer-assets.emergentagent.com/job_b68c2142-db90-4d98-9725-e1ffe0396c9b/artifacts/rsur7vju_farm_image3.jpg" alt="Free-range chickens on farm" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /></div>
            </div>
          </div>
        </section>

        {/* See the FoeGuard Difference */}
        <section className="about-section about-team-text" data-testid="about-difference">
          <div className="about-container">
            <h2 style={titleStyle}>See the FoeGuard Difference</h2>
            <p style={{ fontSize: '17px', marginBottom: '16px', lineHeight: '1.75' }}>
              Skip the fillers, preservatives, and retail markups — get a clear understanding of your pet&apos;s health and what flavours they actually love.
            </p>
            <p style={{ fontSize: '17px', marginBottom: '16px', lineHeight: '1.75' }}>
              Our farm-to-bowl delivery gives pet parents a variety of simple, affordable options to feed a clean, transparent diet — so you can support your pet&apos;s cravings and local Canadian farms, all at retail cost.
            </p>
            <p style={{ fontSize: '17px', marginBottom: '0', lineHeight: '1.75' }}>
              Unlike most manufacturers, we handle every step in-house to ensure a consistent delivery service that provides you with better quality, convenience, and personalized service.
            </p>
          </div>
        </section>

        {/* Nature Nurtured by Science */}
        <section className="about-section about-science" data-testid="about-science">
          <div className="about-container">
            <h2 style={titleStyle}>Nature Nurtured by Science</h2>
            <p style={{ fontSize: '17px', marginBottom: '0', lineHeight: '1.75' }}>
              Our complete and balanced meals are biologically appropriate raw food (BARF), NRC-backed recipes crafted to exceed industry standards (AAFCO) with fresh meat, fruits, veggies, superfoods and supplementation. Since we make everything in-house using fresh ingredients we&apos;re able to personalize orders exactly how you want them.
            </p>
          </div>
        </section>

        {/* OUR 8 PROTEINS */}
        <section className="about-section about-proteins" data-testid="about-proteins">
          <div className="about-container">
            <h2 style={{ ...titleStyle, fontFamily: "'Barlow', sans-serif", fontWeight: 700, textAlign: 'left', marginBottom: '12px' }}>Our Ingredients</h2>
            <p style={{ fontSize: '17px', textAlign: 'left', marginBottom: '40px', lineHeight: '1.7', opacity: 0.85 }}>
              Eight farm-fresh proteins, each with its own flavour and nutritional benefits — so you can pick the perfect match for your dog.
            </p>

            <div className="about-proteins-grid">
              {PROTEINS.map((p) => (
                <div
                  key={p.label}
                  className="about-protein-card"
                  data-testid={`about-protein-${p.label.toLowerCase()}`}
                >
                  <div className="about-protein-img-wrap">
                    <img src={p.url} alt={p.label} />
                  </div>
                  <h3 className="about-protein-label">{p.label}</h3>
                  <p className="about-protein-desc">{p.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* More than just healthy food plans */}
        <section className="about-section about-mission">
          <div className="about-container">
            <h2 style={{ ...titleStyle, textAlign: 'center', fontSize: 'clamp(30px, 3.6vw, 40px)' }}>
              More Than Just Healthy Food Plans
            </h2>
            <p style={{ fontSize: '15px', marginBottom: '14px', textAlign: 'center', lineHeight: '1.65' }}>
              We want to raise the standard of what pet food should be by giving pet parents a trusted source for information, collaboration, and farm-fresh pet food.
            </p>
            <p className="mission-callout" style={{ fontSize: '15px', fontWeight: '600', marginBottom: '32px', textAlign: 'center' }}>
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
                    data-testid="about-signup-email"
                  />
                  <button type="submit" className="btn-primary" disabled={loading} style={{ borderRadius: '8px' }} data-testid="about-signup-submit">
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
