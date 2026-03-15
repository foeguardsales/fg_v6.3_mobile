import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Navbar, Footer } from '../components/Layout';
import { Check, ChevronLeft, ChevronRight, Home, CheckCircle, Scale, Beef, X, Beaker, HelpCircle, Tag } from 'lucide-react';

export const LandingPage = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [emailSubmitted, setEmailSubmitted] = useState('');
  const photoScrollRef = useRef(null);

  const handleEmailSubmit = (e) => {
    e.preventDefault();
    // TODO: Connect to email service
    setEmailSubmitted(true);
  };

  const scrollPhotos = (direction) => {
    if (photoScrollRef.current) {
      const scrollAmount = 300;
      photoScrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };
  
  return (
    <>
      <Navbar />
      <div className="landing-page">
        
        {/* ===== BANNER — HERO ===== */}
        <section className="hero-section" data-testid="hero-section" style={{
          position: 'relative',
          minHeight: '380px',
          display: 'flex',
          alignItems: 'center',
          background: 'linear-gradient(135deg, rgba(139, 69, 19, 0.85) 0%, rgba(115, 40, 39, 0.75) 100%)',
          overflow: 'hidden'
        }}>
          {/* Background Image Placeholder */}
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: '#8B4513',
            zIndex: 0
          }}>
            {/* Farm image will go here as background-image */}
            <div style={{
              width: '100%',
              height: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'rgba(255,255,255,0.3)',
              fontSize: '18px',
              fontWeight: '600'
            }}>
              FARM IMAGE BACKGROUND
            </div>
          </div>
          
          {/* Dark Overlay for text readability */}
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'linear-gradient(90deg, rgba(0,0,0,0.6) 0%, rgba(0,0,0,0.3) 50%, rgba(0,0,0,0.1) 100%)',
            zIndex: 1
          }}></div>

          {/* Text Content - Left Aligned */}
          <div className="hero-content" style={{
            position: 'relative',
            zIndex: 2,
            maxWidth: '1200px',
            margin: '0 auto',
            padding: '50px 40px',
            textAlign: 'left',
            width: '100%'
          }}>
            <div style={{ maxWidth: '550px' }}>
              <h1 className="hero-title" style={{ 
                fontFamily: "'CS Gordon', serif",
                fontSize: '44px',
                lineHeight: '1.1',
                marginBottom: '16px',
                color: '#FFFFFF',
                textShadow: '2px 2px 8px rgba(0,0,0,0.3)'
              }}>
                Feed the Way<br />
                <span className="hero-accent" style={{ color: '#E8DDD0' }}>Nature Intended</span>
              </h1>
              <p className="hero-subtitle" style={{ 
                marginBottom: '24px',
                fontSize: '17px',
                lineHeight: '1.6',
                color: '#FFFFFF',
                textShadow: '1px 1px 4px rgba(0,0,0,0.5)'
              }}>
                Human-grade, organic raw dog food delivery. Farm-to-bowl in just 3 days.
              </p>
              <button 
                className="btn-hero" 
                onClick={() => navigate('/build-box')}
                data-testid="hero-build-box-btn"
                style={{
                  borderRadius: '8px',
                  padding: '14px 36px',
                  fontSize: '16px',
                  fontWeight: '600',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
                  transition: 'transform 0.2s',
                  cursor: 'pointer'
                }}
              >
                Create Your Plan
              </button>
            </div>
          </div>
        </section>

        {/* ===== SECTION — FROM OUR FARM TO YOUR BOWL ===== */}
        <section className="problem-section">
          <div className="section-container">
            <h2 className="section-title" style={{ textTransform: 'none' }}>From our farm to your bowl</h2>
            <div className="problem-content" style={{ maxWidth: '900px', margin: '0 auto' }}>
              <p style={{ fontSize: '17px', marginBottom: '0', lineHeight: '1.7' }}>
                At FoeGuard, our passion for pets and heritage in farming help us understand the food chain from soil-to-serving. Thats why we created FoeGuard - a farm-to-bowl service that delivers fresh raw meals that are balanced for your dog's anatomy to digest easily, maximize nutrient absorption, and support noticeable results. Our recipes use the same ingredients we use for our own family, with the same quality and care - but made for your dog!
              </p>
            </div>
          </div>
        </section>

        {/* ===== CUSTOMER REVIEWS & PHOTOS ===== */}
        <section className="community-section" style={{ background: '#F8F6F4' }}>
          <div className="section-container">
            {/* Testimonials - 3 Short Quotes */}
            <div className="testimonials-grid" style={{ marginBottom: '48px' }}>
              <div className="testimonial-card" style={{ textAlign: 'center' }}>
                <p className="testimonial-text" style={{ fontSize: '16px', fontStyle: 'italic', marginBottom: '12px' }}>
                  "If you show your dog's professionally FG may be your secret weapon"
                </p>
                <span className="testimonial-author" style={{ fontWeight: '600', color: '#8B4513' }}>Muhammad S. (Dog Breeder)</span>
              </div>
              <div className="testimonial-card" style={{ textAlign: 'center' }}>
                <p className="testimonial-text" style={{ fontSize: '16px', fontStyle: 'italic', marginBottom: '12px' }}>
                  "Ever since switching to their raw food her allergies have disappeared"
                </p>
                <span className="testimonial-author" style={{ fontWeight: '600', color: '#8B4513' }}>Prianth P.</span>
              </div>
              <div className="testimonial-card" style={{ textAlign: 'center' }}>
                <p className="testimonial-text" style={{ fontSize: '16px', fontStyle: 'italic', marginBottom: '12px' }}>
                  "Milans sensitive tummy was causing us constant worry until we switched to FoeGuard."
                </p>
                <span className="testimonial-author" style={{ fontWeight: '600', color: '#8B4513' }}>Oliver H.</span>
              </div>
            </div>

            {/* Swipeable Customer Photo Grid - 12 photos */}
            <div style={{ position: 'relative' }}>
              <button
                onClick={() => scrollPhotos('left')}
                style={{
                  position: 'absolute',
                  left: '-20px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'white',
                  border: '2px solid #E8DDD0',
                  borderRadius: '50%',
                  width: '40px',
                  height: '40px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  zIndex: 10,
                  boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                }}
              >
                <ChevronLeft size={20} />
              </button>
              
              <div 
                ref={photoScrollRef}
                style={{
                  display: 'flex',
                  gap: '16px',
                  overflowX: 'auto',
                  scrollBehavior: 'smooth',
                  paddingBottom: '16px',
                  scrollbarWidth: 'none',
                  msOverflowStyle: 'none'
                }}
                className="photo-scroll-container"
              >
                {[...Array(12)].map((_, i) => (
                  <div 
                    key={i}
                    className="customer-photo-placeholder"
                    style={{
                      minWidth: '250px',
                      height: '250px',
                      borderRadius: '12px',
                      background: '#E8DDD0'
                    }}
                  ></div>
                ))}
              </div>

              <button
                onClick={() => scrollPhotos('right')}
                style={{
                  position: 'absolute',
                  right: '-20px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'white',
                  border: '2px solid #E8DDD0',
                  borderRadius: '50%',
                  width: '40px',
                  height: '40px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  zIndex: 10,
                  boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                }}
              >
                <ChevronRight size={20} />
              </button>
            </div>

            <p style={{ textAlign: 'center', marginTop: '24px', fontSize: '15px', color: '#666' }}>
              93% of owners surveyed reported positive changes in digestion, coat, and/or energy.
            </p>
          </div>
        </section>

        {/* ===== SECTION — BETTER FOOD ===== */}
        <section className="standard-section">
          <div className="section-container">
            <h2 className="section-title" style={{ textTransform: 'none', color: 'white' }}>Real food for dogs, raised right in Ontario</h2>
            <p style={{ fontSize: '17px', marginBottom: '48px', textAlign: 'center', color: 'rgba(255,255,255,0.9)' }}>
              Skip the fillers, preservatives, and retail markups. By delivering directly from the farm, we can invest in better ingredients and ethical sourcing - quality you wont find in a store.
            </p>
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(2, 1fr)', 
              gap: '48px',
              maxWidth: '800px',
              margin: '0 auto 48px'
            }}>
              <div style={{ textAlign: 'center' }}>
                <div style={{ 
                  width: '80px', 
                  height: '80px', 
                  margin: '0 auto 20px', 
                  border: '2px solid rgba(255,255,255,0.3)',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <Home size={40} style={{ color: 'white' }} />
                </div>
                <h3 style={{ fontSize: '18px', marginBottom: '12px', color: 'white' }}>FoeGuard Farms</h3>
                <p style={{ fontSize: '15px', color: 'rgba(255,255,255,0.85)', lineHeight: '1.6' }}>Raised right on natural feed, open pastures, and small-batch harvests.</p>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ 
                  width: '80px', 
                  height: '80px', 
                  margin: '0 auto 20px', 
                  border: '2px solid rgba(255,255,255,0.3)',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <CheckCircle size={40} style={{ color: 'white' }} />
                </div>
                <h3 style={{ fontSize: '18px', marginBottom: '12px', color: 'white' }}>Human-Grade and Organic</h3>
                <p style={{ fontSize: '15px', color: 'rgba(255,255,255,0.85)', lineHeight: '1.6' }}>Made with the highest quality and safety standards in Canada.</p>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ 
                  width: '80px', 
                  height: '80px', 
                  margin: '0 auto 20px', 
                  border: '2px solid rgba(255,255,255,0.3)',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <Scale size={40} style={{ color: 'white' }} />
                </div>
                <h3 style={{ fontSize: '18px', marginBottom: '12px', color: 'white' }}>Complete and Balanced</h3>
                <p style={{ fontSize: '15px', color: 'rgba(255,255,255,0.85)', lineHeight: '1.6' }}>Dog-approved recipes formulated to exceed AAFCO standards.</p>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ 
                  width: '80px', 
                  height: '80px', 
                  margin: '0 auto 20px', 
                  border: '2px solid rgba(255,255,255,0.3)',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <Beef size={40} style={{ color: 'white' }} />
                </div>
                <h3 style={{ fontSize: '18px', marginBottom: '12px', color: 'white' }}>Always Farm Fresh</h3>
                <p style={{ fontSize: '15px', color: 'rgba(255,255,255,0.85)', lineHeight: '1.6' }}>For better flavour and nutrition. Choose from 8+ proteins.</p>
              </div>
            </div>

            <div style={{ textAlign: 'center' }}>
              <button 
                className="btn-hero" 
                onClick={() => navigate('/build-box')}
                style={{ 
                  background: 'white',
                  color: '#8B4513',
                  border: 'none',
                  padding: '14px 32px',
                  fontSize: '16px',
                  fontWeight: '600',
                  borderRadius: '8px',
                  cursor: 'pointer'
                }}
              >
                Build Your Plan
              </button>
            </div>
          </div>
        </section>

        {/* ===== SECTION — 8 PROTEINS ===== */}
        <section className="proteins-section" style={{ background: '#F8F6F4', padding: '80px 20px' }}>
          <div className="section-container">
            <div style={{ 
              display: 'flex',
              flexWrap: 'wrap',
              gap: '24px',
              maxWidth: '1200px',
              margin: '0 auto',
              justifyContent: 'center'
            }}>
              {[...Array(8)].map((_, i) => (
                <div 
                  key={i}
                  style={{
                    width: 'calc((100% - 96px) / 5)',
                    aspectRatio: '1',
                    background: '#E8DDD0',
                    borderRadius: '12px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  <span style={{ color: '#8B4513', fontSize: '14px' }}>Protein {i + 1}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ===== SECTION — REDEFINE PET FOOD ===== */}
        <section className="problem-section" style={{ background: 'white', padding: '60px 20px' }}>
          <div className="section-container">
            <h2 className="section-title" style={{ textTransform: 'none' }}>What you won't find in the bowl</h2>
            <p style={{ textAlign: 'center', fontSize: '17px', marginBottom: '40px', color: '#666', maxWidth: '700px', margin: '0 auto 40px' }}>
              We put value where it matters most - towards your dog. It's time to get rid of:
            </p>
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(3, 1fr)', 
              gap: '24px',
              maxWidth: '1100px',
              margin: '0 auto'
            }}>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px', padding: '24px 16px', background: '#F8F6F4', borderRadius: '8px', textAlign: 'center' }}>
                <Beaker size={32} style={{ color: '#8B4513', flexShrink: 0 }} />
                <div>
                  <h3 style={{ fontSize: '16px', marginBottom: '8px', fontWeight: '600', color: '#8B4513' }}>Processed Ingredients</h3>
                  <p style={{ fontSize: '14px', color: '#666', margin: 0, lineHeight: '1.5' }}>Made for longer shelf life, not for dogs.</p>
                </div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px', padding: '24px 16px', background: '#F8F6F4', borderRadius: '8px', textAlign: 'center' }}>
                <X size={32} style={{ color: '#8B4513', flexShrink: 0 }} />
                <div>
                  <h3 style={{ fontSize: '16px', marginBottom: '8px', fontWeight: '600', color: '#8B4513' }}>Low-Quality Fillers</h3>
                  <p style={{ fontSize: '14px', color: '#666', margin: 0, lineHeight: '1.5' }}>No grain, scraps, GMOs, antibiotics or hormones.</p>
                </div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px', padding: '24px 16px', background: '#F8F6F4', borderRadius: '8px', textAlign: 'center' }}>
                <Tag size={32} style={{ color: '#8B4513', flexShrink: 0 }} />
                <div>
                  <h3 style={{ fontSize: '16px', marginBottom: '8px', fontWeight: '600', color: '#8B4513' }}>Misleading Labels</h3>
                  <p style={{ fontSize: '14px', color: '#666', margin: 0, lineHeight: '1.5' }}>That meet minimum guidelines, not carnivores.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ===== SECTION — HOW IT WORKS ===== */}
        <section className="how-it-works-section">
          <div className="section-container">
            <h2 className="section-title" style={{ textTransform: 'none' }}>How it works</h2>
            <p style={{ textAlign: 'center', fontSize: '18px', marginBottom: '48px', color: '#666' }}>
              Feeding raw is simpler than you think.
            </p>
            
            <div className="steps-grid">
              <div className="step-card">
                <div className="step-image-container">
                  <div className="step-image-placeholder"></div>
                  <div className="step-number-overlay">1</div>
                </div>
                <h3>Choose Your Pet Food</h3>
                <p style={{ fontSize: '15px', color: '#666' }}>
                  Create your dog's meal plan or build your own box.
                </p>
              </div>
              <div className="step-card">
                <div className="step-image-container">
                  <div className="step-image-placeholder"></div>
                  <div className="step-number-overlay">2</div>
                </div>
                <h3>We Prepare Fresh and Deliver</h3>
                <p style={{ fontSize: '15px', color: '#666' }}>
                  Flash frozen for safe travel from a certified, human-grade facility.
                </p>
              </div>
              <div className="step-card">
                <div className="step-image-container">
                  <div className="step-image-placeholder"></div>
                  <div className="step-number-overlay">3</div>
                </div>
                <h3>Feed with Confidence</h3>
                <p style={{ fontSize: '15px', color: '#666' }}>
                  Delivered to your door in just 3–5 business days. Just thaw and feed.
                </p>
              </div>
            </div>
            
            <p style={{ textAlign: 'center', marginTop: '32px', fontSize: '15px', color: '#666', fontStyle: 'italic' }}>
              Subscribe to save and never run out.
            </p>
            
            <div style={{ textAlign: 'center', marginTop: '32px', display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
              <button 
                className="btn-primary" 
                onClick={() => navigate('/build-box')}
                style={{ borderRadius: '8px' }}
              >
                Build Your Plan
              </button>
              <button 
                className="btn-secondary" 
                onClick={() => navigate('/build-box')}
                style={{ borderRadius: '8px' }}
              >
                Order Menu
              </button>
            </div>
          </div>
        </section>

        {/* ===== SECTION — BENEFITS ===== */}
        <section className="problem-section" style={{ background: '#F8F6F4' }}>
          <div className="section-container">
            <h2 className="section-title" style={{ textTransform: 'none', marginBottom: '40px' }}>Benefits you can see, and they can feel.</h2>
            
            <div style={{ display: 'flex', gap: '48px', maxWidth: '1100px', margin: '0 auto', alignItems: 'center', flexWrap: 'wrap' }}>
              <div style={{ flex: '1', minWidth: '300px' }}>
                <p style={{ fontSize: '17px', marginBottom: '0', lineHeight: '1.7' }}>
                  <strong style={{ color: '#8B4513', fontSize: '18px' }}>Good health is priceless.</strong> Feed a species-appropriate raw diet that supports long-term health and lasting nutrition. You may notice a shinier coat, more energy, cleaner teeth, fewer sensitivities, and even more excitement at mealtime. With fewer unnecessary vet visits, both you and your dog can feel the difference. Do not just take our word for it. See what happy dog parents and veterinary professionals have to say, or see the difference for yourself.
                </p>
              </div>
              <div style={{ 
                flex: '0 0 400px', 
                height: '350px', 
                background: '#E8DDD0', 
                borderRadius: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#8B4513',
                fontSize: '14px'
              }}>
                Image Placeholder
              </div>
            </div>

            {/* Recent Reviews with Images */}
            <div style={{ marginTop: '60px' }}>
              <h3 style={{ textAlign: 'center', fontSize: '24px', marginBottom: '32px', textTransform: 'none' }}>Recent reviews</h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px', maxWidth: '1000px', margin: '0 auto' }}>
                <div style={{ 
                  background: 'white', 
                  padding: '24px', 
                  borderRadius: '12px', 
                  boxShadow: '0 2px 8px rgba(0,0,0,0.08)' 
                }}>
                  <div style={{ 
                    width: '100%', 
                    height: '200px', 
                    background: '#E8DDD0', 
                    borderRadius: '8px', 
                    marginBottom: '16px' 
                  }}></div>
                  <p style={{ fontSize: '15px', fontStyle: 'italic', marginBottom: '12px', lineHeight: '1.6' }}>
                    "Indigo is known to be pickier ... but had zero issue with this food and enjoyed every meal. Oliver also thoroughly enjoyed the food and his stools were perfect (...something that we have issues with)"
                  </p>
                  <p style={{ fontSize: '14px', fontWeight: '600', color: '#8B4513', margin: 0 }}>@canadian.farm.dogs</p>
                </div>
                <div style={{ 
                  background: 'white', 
                  padding: '24px', 
                  borderRadius: '12px', 
                  boxShadow: '0 2px 8px rgba(0,0,0,0.08)' 
                }}>
                  <div style={{ 
                    width: '100%', 
                    height: '200px', 
                    background: '#E8DDD0', 
                    borderRadius: '8px', 
                    marginBottom: '16px' 
                  }}></div>
                  <p style={{ fontSize: '15px', fontStyle: 'italic', marginBottom: '12px', lineHeight: '1.6' }}>
                    "Zeus is VERY impressed 😍❤️. Love the dinners because they're already a balanced meal making it easy ... he devours and makes sure he licks every little bit left in his bowl!"
                  </p>
                  <p style={{ fontSize: '14px', fontWeight: '600', color: '#8B4513', margin: 0 }}>@zeus.thedobie_</p>
                </div>
                <div style={{ 
                  background: 'white', 
                  padding: '24px', 
                  borderRadius: '12px', 
                  boxShadow: '0 2px 8px rgba(0,0,0,0.08)' 
                }}>
                  <div style={{ 
                    width: '100%', 
                    height: '200px', 
                    background: '#E8DDD0', 
                    borderRadius: '8px', 
                    marginBottom: '16px' 
                  }}></div>
                  <p style={{ fontSize: '15px', fontStyle: 'italic', marginBottom: '12px', lineHeight: '1.6' }}>
                    "I've been waiting to be woken up in the middle of the night for her to go washroom, but her stool has been consistent and perfect since I began introducing the raw food."
                  </p>
                  <p style={{ fontSize: '14px', fontWeight: '600', color: '#8B4513', margin: 0 }}>@fuji.pai02</p>
                </div>
              </div>
            </div>

            {/* Insights from Veterinarians */}
            <div style={{ marginTop: '60px' }}>
              <h3 style={{ textAlign: 'center', fontSize: '24px', marginBottom: '32px', textTransform: 'none' }}>Insights from veterinarians</h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px', maxWidth: '1000px', margin: '0 auto' }}>
                <div style={{ 
                  background: 'white', 
                  padding: '32px', 
                  borderRadius: '12px', 
                  boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                  textAlign: 'center'
                }}>
                  <p style={{ fontSize: '16px', fontStyle: 'italic', marginBottom: '16px', lineHeight: '1.6', color: '#333' }}>
                    "When I began to suggest the feeding of raw meat I found animals becoming more healthy [against diseases] even without other treatment."
                  </p>
                  <p style={{ fontSize: '14px', fontWeight: '600', color: '#8B4513', margin: 0 }}>Dr. Richard Pitcairn, Veterinarian & author of Complete Guide to Natural Health for Dogs & Cats</p>
                </div>
                <div style={{ 
                  background: 'white', 
                  padding: '32px', 
                  borderRadius: '12px', 
                  boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                  textAlign: 'center'
                }}>
                  <p style={{ fontSize: '16px', fontStyle: 'italic', marginBottom: '16px', lineHeight: '1.6', color: '#333' }}>
                    "My nutritional goals for my patients: to make the diet as species-appropriate as possible, which is low-carb, high-moisture and unprocessed."
                  </p>
                  <p style={{ fontSize: '14px', fontWeight: '600', color: '#8B4513', margin: 0 }}>Dr. Karen Becker, Veterinarian & author of The Forever Dog</p>
                </div>
                <div style={{ 
                  background: 'white', 
                  padding: '32px', 
                  borderRadius: '12px', 
                  boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                  textAlign: 'center'
                }}>
                  <p style={{ fontSize: '16px', fontStyle: 'italic', marginBottom: '16px', lineHeight: '1.6', color: '#333' }}>
                    "Our dogs' disease problems are increasing on a par with their increasing consumption of processed and cooked foods"
                  </p>
                  <p style={{ fontSize: '14px', fontWeight: '600', color: '#8B4513', margin: 0 }}>Dr. Ian Billinghurst, Veterinarian & author of Give Your Dog a Bone</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ===== SECTION — COMPLETE PLANS ===== */}
        <section className="new-to-raw-section">
          <div className="section-container">
            <h2 className="section-title" style={{ textTransform: 'none', marginBottom: '40px' }}>Start to see a healthier, more energetic dog within days.</h2>
            
            <div style={{ display: 'flex', gap: '48px', maxWidth: '1100px', margin: '0 auto', alignItems: 'center', flexWrap: 'wrap' }}>
              <div style={{ 
                flex: '0 0 400px', 
                height: '450px', 
                background: '#E8DDD0', 
                borderRadius: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#8B4513',
                fontSize: '14px'
              }}>
                Image Placeholder
              </div>
              
              <div style={{ 
                flex: '1', 
                minWidth: '300px',
                background: 'white',
                padding: '32px',
                borderRadius: '16px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.08)'
              }}>
                <p style={{ fontSize: '16px', fontWeight: '600', marginBottom: '16px', textAlign: 'center' }}>
                  All FoeGuard plans include:
                </p>
                
                <div style={{ display: 'flex', justifyContent: 'center' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <Check size={20} style={{ color: '#8B4513', flexShrink: 0 }} />
                      <p style={{ fontSize: '16px', margin: 0, textAlign: 'left' }}>Free 1-on-1 consultation</p>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <Check size={20} style={{ color: '#8B4513', flexShrink: 0 }} />
                      <p style={{ fontSize: '16px', margin: 0, textAlign: 'left' }}>Personalized, portioned meals</p>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <Check size={20} style={{ color: '#8B4513', flexShrink: 0 }} />
                      <p style={{ fontSize: '16px', margin: 0, textAlign: 'left' }}>Free complete raw feeding guide</p>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <Check size={20} style={{ color: '#8B4513', flexShrink: 0 }} />
                      <p style={{ fontSize: '16px', margin: 0, textAlign: 'left' }}>Eco-friendly packaging</p>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <Check size={20} style={{ color: '#8B4513', flexShrink: 0 }} />
                      <p style={{ fontSize: '16px', margin: 0, textAlign: 'left' }}>Subscribe and save</p>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <Check size={20} style={{ color: '#8B4513', flexShrink: 0 }} />
                      <p style={{ fontSize: '16px', margin: 0, textAlign: 'left' }}>FoeGuard delivery</p>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <Check size={20} style={{ color: '#8B4513', flexShrink: 0 }} />
                      <p style={{ fontSize: '16px', margin: 0, textAlign: 'left' }}>Lifetime support</p>
                    </div>
                  </div>
                </div>

                <p style={{ fontSize: '16px', fontWeight: '600', marginTop: '24px', marginBottom: '0', color: '#8B4513', textAlign: 'center' }}>
                  14-Day Happiness Guarantee: If your dog does not love their meal, we will switch any leftovers for a different protein at no extra cost.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ===== SECTION — OUR STORY ===== */}
        <section className="about-section" style={{ background: 'white', padding: '80px 20px' }}>
          <div className="section-container" style={{ maxWidth: '900px', margin: '0 auto' }}>
            <h2 className="section-title" style={{ textTransform: 'none', marginBottom: '32px', color: '#2B2B2B' }}>Our story ... is your story?</h2>
            <p style={{ fontSize: '17px', marginBottom: '20px', lineHeight: '1.7', color: '#333' }}>
              Overwhelmed by the health challenges caused by processed foods, our family turned to our farm to grow real, wholesome ingredients. The transformation was life-changing: more energy, better digestion, clearer minds, and even glowing skin.
            </p>
            <p style={{ fontSize: '17px', marginBottom: '0', lineHeight: '1.7', color: '#333' }}>
              Inspired by these results, we decided to feed our dogs the same way—natural, fresh, and just like family. The change was incredible! Their energy soared, their coats shone, and their health improved, proving one simple truth—they're carnivores. What started as a personal journey soon became a mission to help others. We began preparing meals for friends and neighbours, and that passion grew into profession - FoeGuard was born!
            </p>
          </div>
        </section>

        {/* ===== FINAL CTA ===== */}
        <section className="final-cta-section">
          <div className="section-container">
            <h2 className="section-title-white" style={{ fontSize: '36px', marginBottom: '24px', textTransform: 'none' }}>
              Ready to see your dog thrive?
            </h2>
            
            <p style={{ fontSize: '17px', color: 'rgba(255,255,255,0.9)', marginBottom: '20px' }}>
              Farm-fresh raw pet food, raised in Ontario and delivered to your door.
            </p>
            
            <p style={{ fontSize: '18px', color: 'rgba(255,255,255,0.95)', marginBottom: '40px', fontWeight: '600' }}>
              Get 40% off your first 2 weeks.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px', maxWidth: '400px', margin: '0 auto' }}>
              <button 
                className="btn-hero" 
                onClick={() => navigate('/build-box')}
                data-testid="final-cta-btn"
                style={{ width: '100%', borderRadius: '8px' }}
              >
                Create Your Plan
              </button>
              
              <p style={{ fontSize: '15px', color: 'rgba(255,255,255,0.85)', margin: '8px 0' }}>
                Or order direct from the Menu
              </p>
              
              <button 
                className="btn-secondary" 
                onClick={() => navigate('/build-box')}
                style={{ 
                  width: '100%',
                  background: 'transparent',
                  border: '2px solid rgba(255,255,255,0.7)',
                  color: 'white',
                  borderRadius: '8px'
                }}
              >
                Order Menu
              </button>
            </div>
          </div>
        </section>

      </div>
      <Footer />
    </>
  );
};
