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
            <h1 style={{ textTransform: 'none', fontFamily: "'Rubik', sans-serif" }}>Why FoeGuard?</h1>
            <p style={{ fontSize: '18px', color: '#D9C8B3', marginTop: '20px' }}>
              Feed your dog the diet they were always meant to eat - without stressing over labels or what's right for them.
            </p>
          </div>
        </section>

        {/* Introduction Section */}
        <section className="about-section about-story">
          <div className="about-container">
            <p style={{ fontSize: '17px', marginBottom: '20px', lineHeight: '1.7' }}>
              Dogs are designed by nature to break down real meat and bones - yet in recent times, we've been feeding our carnivores processed foods made with vague ingredients, questionable meats, and unethical sourcing.
            </p>
            <p style={{ fontSize: '17px', marginBottom: '20px', lineHeight: '1.7' }}>
              For decades, doctors have told us to eat fresh, local, minimally processed foods, so why should our pets be any different?
            </p>
            <p style={{ fontSize: '17px', marginBottom: '20px', lineHeight: '1.7' }}>
              At FoeGuard, we believe dogs deserve food that's fresh, locally sourced, and aligned with nature. Everything a biologically-appropriate raw diet needs to support longevity, vitality, and true well-being.
            </p>
            <p style={{ fontSize: '17px', marginBottom: '0', lineHeight: '1.7' }}>
              You can see it in the details: a glossier coat, cleaner teeth, brighter eyes, and energy that feels youthful again. Real food doesn't just nourish—it deepens the bond we share with our pets.
            </p>
          </div>
        </section>

        {/* Farm Image Section */}
        <section className="about-farm-image">
          <div style={{ width: '100%', overflow: 'hidden', borderRadius: '12px' }}>
            <img src="https://customer-assets.emergentagent.com/job_b68c2142-db90-4d98-9725-e1ffe0396c9b/artifacts/l0xcyf5b_farm.png" alt="FoeGuard farm with cows grazing" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
          </div>
        </section>

        {/* From Our Family to Yours */}
        <section className="about-section about-why">
          <div className="about-container">
            <h2 style={{ textTransform: 'none' }}>From Our Family to Yours</h2>
            <p style={{ fontSize: '17px', marginBottom: '16px' }}>
              We are your direct and local connection to farm fresh raw pet food raised without the use of any antibiotics, hormones or any animals by-products in our feed ... we offer naturally raised meats from our farm to your bowl. Every FoeGuard product is made fresh using the same ingredients we use to feed our own family - with the same quality and finish, but made for your pets. If it's not good enough for our family then it's not good enough for yours!
            </p>
            <p style={{ fontSize: '17px', marginBottom: '16px' }}>
              Since we are small run operation, unlike big pet food manufacturers we rely on our community of FoeGuardians for support.
            </p>
            <p style={{ fontSize: '17px', fontWeight: '600' }}>
              All of our ingredients are humanely raised at our farm and local partnered farms in Ontario.
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
        <section className="about-section about-team-text">
          <div className="about-container">
            <h2 style={{ textTransform: 'none' }}>See the FoeGuard Difference</h2>
            <p style={{ fontSize: '17px', marginBottom: '16px' }}>
              Get a crystal-clear understanding of your pet's health and what flavours they actually love.
            </p>
            <p style={{ fontSize: '17px', marginBottom: '16px' }}>
              We give pet parents a variety of stress-free, affordable options to feed the way nature intended—so you can support your pet's cravings and local Canadian farms, all at retail cost.
            </p>
            <p style={{ fontSize: '17px', marginBottom: '0' }}>
              Unlike most manufacturers, we handle every step in-house to ensure a consistent delivery service that provides you with unmatched quality, convenience, and personal service.
            </p>
          </div>
        </section>

        {/* Nature Nurtured by Science - NEW SECTION */}
        <section className="about-section about-science">
          <div className="about-container">
            <h2 style={{ textTransform: 'none' }}>Nature Nurtured by Science</h2>
            <p style={{ fontSize: '17px', marginBottom: '16px' }}>
              Our complete and balanced raw dog food meals are nutritionist approved and biologically appropriate raw food (BARF) recipes crafted to exceed industry standards (AAFCO) with fresh meat, fruits, veggies, superfoods and supplementation. We have fresh dinners for dogs and puppies.
            </p>
            <p style={{ fontSize: '17px', marginBottom: '16px' }}>
              With decades of farming, meat processing, and nutrition expertise as a PHD in biology, we have worked with canine nutritionists, animal behaviourists and pet owners like yourself to develop the FoeGuard products you see today.
            </p>
            <p style={{ fontSize: '17px', marginBottom: '0' }}>
              Feel free to customize any of our recipes or let us create a special meal tailored to your dog or homemade dish. We feed all carnivores!
            </p>
          </div>
        </section>

        {/* Meet Team FG - NEW SECTION */}
        <section className="about-section about-team-fg">
          <div className="about-container">
            <h2 style={{ textTransform: 'none' }}>Meet Team FG</h2>
            <p style={{ fontSize: '17px', marginBottom: '16px' }}>
              At FoeGuard, we don't just focus on what's in the bowl—we bring expertise and care to every step of the process.
            </p>
            <p style={{ fontSize: '17px', marginBottom: '16px' }}>
              Our team includes a diverse range of professionals, from local Ontario farmers and nutritional experts like our on-site biologist, to pet specialists such as a canine behaviourist, dedicated drivers and partnered breeders.
            </p>
            <p style={{ fontSize: '17px', marginBottom: '0' }}>
              Every FoeGuard product meets rigorous human-grade safety standards and is crafted for species-appropriate dog nutrition. Our recipes are thoroughly tested and tried by dozens of dogs and cats to ensure consistent, premium quality, so you can trust that your pet is getting the very best every time.
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
