import React, { useState, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Navbar, Footer } from '../components/Layout';
import { Check, ChevronLeft, ChevronRight, Home, CheckCircle, Scale, Beef, X, Package, HelpCircle, Tag } from 'lucide-react';

export const LandingPage = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [emailSubmitted, setEmailSubmitted] = useState('');
  const photoScrollRef = useRef(null);
  const reviewsScrollRef = useRef(null);
  const proteinScrollRef = useRef(null);
  const [sliderPos, setSliderPos] = useState(50);
  const sliderRef = useRef(null);
  const isDragging = useRef(false);

  const handleSliderMove = useCallback((clientX) => {
    if (!sliderRef.current) return;
    const rect = sliderRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const pct = Math.max(0, Math.min(100, (x / rect.width) * 100));
    setSliderPos(pct);
  }, []);

  const onPointerDown = useCallback((e) => {
    isDragging.current = true;
    handleSliderMove(e.clientX);
    e.preventDefault();
  }, [handleSliderMove]);

  const onPointerMove = useCallback((e) => {
    if (!isDragging.current) return;
    handleSliderMove(e.clientX);
  }, [handleSliderMove]);

  const onPointerUp = useCallback(() => {
    isDragging.current = false;
  }, []);

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

  const scrollReviews = (direction) => {
    if (reviewsScrollRef.current) {
      const scrollAmount = 300;
      reviewsScrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  const scrollProteins = (direction) => {
    if (proteinScrollRef.current) {
      const scrollAmount = 350;
      proteinScrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  const proteins = [
    {
      name: 'Chicken',
      description: 'Lean protein that supports muscle development and provides essential amino acids for overall health.',
      image: 'https://customer-assets.emergentagent.com/job_b68c2142-db90-4d98-9725-e1ffe0396c9b/artifacts/dksu613b_chicken.png'
    },
    {
      name: 'Beef',
      description: 'Rich in iron and zinc, beef supports energy levels, immune function, and healthy blood cells.',
      image: 'https://customer-assets.emergentagent.com/job_b68c2142-db90-4d98-9725-e1ffe0396c9b/artifacts/262n9jvl_beef.png'
    },
    {
      name: 'Turkey',
      description: 'Low-fat protein packed with nutrients that promote lean muscle mass and digestive health.',
      image: 'https://customer-assets.emergentagent.com/job_b68c2142-db90-4d98-9725-e1ffe0396c9b/artifacts/j6yxejew_turkey.png'
    },
    {
      name: 'Duck',
      description: 'Nutrient-dense protein with omega fatty acids that support skin, coat, and joint health.',
      image: 'https://customer-assets.emergentagent.com/job_b68c2142-db90-4d98-9725-e1ffe0396c9b/artifacts/s3okrgsw_duck.png'
    },
    {
      name: 'Salmon',
      description: 'Omega-3 rich fish that promotes brain function, reduces inflammation, and supports a shiny coat.',
      image: 'https://customer-assets.emergentagent.com/job_b68c2142-db90-4d98-9725-e1ffe0396c9b/artifacts/l6i3vb5d_salmon.png'
    },
    {
      name: 'Lamb',
      description: 'Easily digestible protein with B vitamins that support energy metabolism and muscle health.',
      image: 'https://customer-assets.emergentagent.com/job_b68c2142-db90-4d98-9725-e1ffe0396c9b/artifacts/pgajdkxv_lamb.png'
    },
    {
      name: 'Goat',
      description: 'Novel protein that is gentle on sensitive stomachs and provides essential nutrients for overall wellness.',
      image: 'https://customer-assets.emergentagent.com/job_b68c2142-db90-4d98-9725-e1ffe0396c9b/artifacts/0u52lnr0_goat.png'
    },
    {
      name: 'Rabbit',
      description: 'Hypoallergenic lean protein ideal for dogs with food sensitivities, supporting digestion and vitality.',
      image: 'https://customer-assets.emergentagent.com/job_b68c2142-db90-4d98-9725-e1ffe0396c9b/artifacts/ptl7se73_rabbit.png'
    }
  ];
  
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
          {/* Background Image */}
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 0
          }}>
            <img 
              src="https://customer-assets.emergentagent.com/job_site-upload-4/artifacts/q9no77mv_site%20banner%20images_fg26%27.png"
              alt="Happy dog on farm path"
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                objectPosition: 'center 30%'
              }}
            />
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
                fontFamily: "'Rubik', sans-serif",
                fontWeight: '600',
                fontSize: '34px',
                lineHeight: '1.1',
                marginBottom: '16px',
                color: '#FFFFFF',
                textShadow: '2px 2px 8px rgba(0,0,0,0.3)'
              }}>
                Feed the Way<br />
                <span className="hero-accent" style={{ color: '#E8DDD0' }}>Nature Intended</span>
              </h1>
              <p className="hero-subtitle" style={{ 
                fontFamily: "'Rubik', sans-serif",
                fontWeight: '400',
                marginBottom: '24px',
                fontSize: '16px',
                lineHeight: '1.6',
                color: '#FFFFFF',
                textShadow: '1px 1px 4px rgba(0,0,0,0.5)'
              }}>
                Ontario's farm-fresh raw dog food — delivered to your door in just 3 days.
              </p>
              <button 
                className="btn-hero" 
                onClick={() => navigate('/build-box')}
                data-testid="hero-build-box-btn"
                style={{
                  borderRadius: '8px',
                  padding: '14px 42px',
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
            <h2 className="section-title" style={{ textTransform: 'none', fontWeight: '600' }}>From our farm to your bowl.</h2>
            <div className="problem-content" style={{ maxWidth: '900px', margin: '0 auto' }}>
              <p style={{ fontFamily: "'Rubik', sans-serif", fontWeight: '400', fontSize: '17px', marginBottom: '0', lineHeight: '1.7' }}>
                Good food starts before the bowl, with how ingredients are raised, handled, and prepared. As an Ontario family-run farm, we make fresh raw meals so your dog gets food that supports a healthier, more vibrant life — made with the same care you would expect at your own table.
              </p>
              <p style={{ fontFamily: "'Rubik', sans-serif", fontWeight: '400', fontSize: '17px', marginTop: '20px', marginBottom: '0', lineHeight: '1.7' }}>
                We make raw feeding simple, exciting, and tailored to what your dog needs.
              </p>
            </div>
          </div>
        </section>

        {/* ===== CUSTOMER REVIEWS & PHOTOS ===== */}
        <section className="community-section" style={{ background: '#F8F6F4' }}>
          <div className="section-container">
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
                {[
                  'https://customer-assets.emergentagent.com/job_b68c2142-db90-4d98-9725-e1ffe0396c9b/artifacts/skuox6lk_customer%20image%201.jpg',
                  'https://customer-assets.emergentagent.com/job_b68c2142-db90-4d98-9725-e1ffe0396c9b/artifacts/i8unoyzf_customer%20image%202.jpg',
                  'https://customer-assets.emergentagent.com/job_b68c2142-db90-4d98-9725-e1ffe0396c9b/artifacts/0chc5rd7_customer%20image%203.jpg',
                  'https://customer-assets.emergentagent.com/job_b68c2142-db90-4d98-9725-e1ffe0396c9b/artifacts/ztqi7osh_customer%20image%204.jpg',
                  'https://customer-assets.emergentagent.com/job_b68c2142-db90-4d98-9725-e1ffe0396c9b/artifacts/mdrqjiyi_customer%20image%205.jpg',
                  'https://customer-assets.emergentagent.com/job_b68c2142-db90-4d98-9725-e1ffe0396c9b/artifacts/fd4zxuc8_customer%20image%206.jpg',
                  'https://customer-assets.emergentagent.com/job_b68c2142-db90-4d98-9725-e1ffe0396c9b/artifacts/bntscfuc_customer%20image%207.jpg',
                  'https://customer-assets.emergentagent.com/job_b68c2142-db90-4d98-9725-e1ffe0396c9b/artifacts/uci3qgmq_customer%20image%208.jpg',
                  'https://customer-assets.emergentagent.com/job_b68c2142-db90-4d98-9725-e1ffe0396c9b/artifacts/aphigyw1_customer%20image%209.jpg',
                  'https://customer-assets.emergentagent.com/job_b68c2142-db90-4d98-9725-e1ffe0396c9b/artifacts/2kgbxhaf_customer%20image%2010.jpg',
                  'https://customer-assets.emergentagent.com/job_b68c2142-db90-4d98-9725-e1ffe0396c9b/artifacts/pk34xhh5_customer%20image%2011.jpg',
                  'https://customer-assets.emergentagent.com/job_b68c2142-db90-4d98-9725-e1ffe0396c9b/artifacts/nsfx800g_customer%20image%2012.jpg'
                ].map((url, i) => (
                  <div 
                    key={i}
                    style={{
                      minWidth: '250px',
                      height: '250px',
                      borderRadius: '12px',
                      background: '#E8DDD0',
                      overflow: 'hidden',
                      flexShrink: 0
                    }}
                  >
                    <img src={url} alt={`Customer photo ${i + 1}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </div>
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
            <h2 className="section-title" style={{ textTransform: 'none', color: 'white', fontWeight: '600' }}>Real food for dogs, raised right in Ontario.</h2>
            <p style={{ fontSize: '17px', marginBottom: '48px', textAlign: 'center', color: 'rgba(255,255,255,0.9)' }}>
              Skip the fillers, preservatives, and retail markups. By delivering directly from our farm, we invest in better ingredients and ethical sourcing — quality you won't find in store.
            </p>

            {/* Before/After Slider Comparison */}
            <div style={{ maxWidth: '350px', margin: '0 auto 48px', textAlign: 'center' }}>
              <div
                ref={sliderRef}
                data-testid="food-comparison-slider"
                onPointerDown={onPointerDown}
                onPointerMove={onPointerMove}
                onPointerUp={onPointerUp}
                onPointerLeave={onPointerUp}
                style={{
                  position: 'relative',
                  width: '100%',
                  aspectRatio: '1 / 1',
                  borderRadius: '50%',
                  overflow: 'hidden',
                  cursor: 'ew-resize',
                  userSelect: 'none',
                  touchAction: 'none',
                  boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
                  background: '#732827',
                  border: '4px solid #732827'
                }}
              >
                {/* Competition meat (full background) */}
                <img
                  src="https://customer-assets.emergentagent.com/job_b68c2142-db90-4d98-9725-e1ffe0396c9b/artifacts/jtirzx2v_competition_meat.png"
                  alt="Competition processed dog food"
                  draggable={false}
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    transform: 'scale(1.15)'
                  }}
                />
                {/* FoeGuard meat (clipped by slider) */}
                <div style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%',
                  clipPath: `inset(0 ${100 - sliderPos}% 0 0)`
                }}>
                  <img
                    src="https://customer-assets.emergentagent.com/job_b68c2142-db90-4d98-9725-e1ffe0396c9b/artifacts/krlzk3m3_fg_meat.png"
                    alt="FoeGuard fresh raw dog food"
                    draggable={false}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      transform: 'scale(1.15)'
                    }}
                  />
                </div>
                {/* Slider handle */}
                <div style={{
                  position: 'absolute',
                  top: 0,
                  left: `${sliderPos}%`,
                  transform: 'translateX(-50%)',
                  width: '3px',
                  height: '100%',
                  background: 'white',
                  boxShadow: '0 0 8px rgba(0,0,0,0.4)',
                  zIndex: 2
                }}>
                  <div style={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: '40px',
                    height: '40px',
                    background: 'white',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.3)',
                    fontSize: '16px',
                    color: '#666',
                    fontWeight: '700'
                  }}>
                    <ChevronLeft size={14} style={{ marginRight: '-4px' }} />
                    <ChevronRight size={14} style={{ marginLeft: '-4px' }} />
                  </div>
                </div>
              </div>
              <p style={{ fontSize: '14px', color: 'rgba(255,255,255,0.7)', marginTop: '16px' }}>Drag to compare</p>
            </div>

            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(2, 1fr)', 
              gap: '48px',
              maxWidth: '800px',
              margin: '0 auto 48px'
            }}>
              <div style={{ textAlign: 'center' }}>
                <div style={{ 
                  width: '56px', 
                  height: '56px', 
                  margin: '0 auto 20px', 
                  border: '2px solid rgba(255,255,255,0.3)',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <Beef size={28} style={{ color: 'white' }} />
                </div>
                <h3 style={{ fontFamily: "'Rubik', sans-serif", fontWeight: '600', fontSize: '18px', marginBottom: '12px', color: 'white' }}>Organic Raw Food</h3>
                <p style={{ fontFamily: "'Rubik', sans-serif", fontWeight: '400', fontSize: '15px', color: 'rgba(255,255,255,0.85)', lineHeight: '1.6' }}>Nutrient-rich meat and vegetables, raised without GMOs, antibiotics, or hormones.</p>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ 
                  width: '56px', 
                  height: '56px', 
                  margin: '0 auto 20px', 
                  border: '2px solid rgba(255,255,255,0.3)',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <CheckCircle size={28} style={{ color: 'white' }} />
                </div>
                <h3 style={{ fontFamily: "'Rubik', sans-serif", fontWeight: '600', fontSize: '18px', marginBottom: '12px', color: 'white' }}>Human-Grade Safety</h3>
                <p style={{ fontFamily: "'Rubik', sans-serif", fontWeight: '400', fontSize: '15px', color: 'rgba(255,255,255,0.85)', lineHeight: '1.6' }}>Made to the highest food quality and safety standards in Canada.</p>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ 
                  width: '56px', 
                  height: '56px', 
                  margin: '0 auto 20px', 
                  border: '2px solid rgba(255,255,255,0.3)',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <Scale size={28} style={{ color: 'white' }} />
                </div>
                <h3 style={{ fontFamily: "'Rubik', sans-serif", fontWeight: '600', fontSize: '18px', marginBottom: '12px', color: 'white' }}>Nutritionist-Approved</h3>
                <p style={{ fontFamily: "'Rubik', sans-serif", fontWeight: '400', fontSize: '15px', color: 'rgba(255,255,255,0.85)', lineHeight: '1.6' }}>Complete and balanced whole food recipes that exceed AAFCO standards.</p>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ 
                  width: '56px', 
                  height: '56px', 
                  margin: '0 auto 20px', 
                  border: '2px solid rgba(255,255,255,0.3)',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <Home size={28} style={{ color: 'white' }} />
                </div>
                <h3 style={{ fontFamily: "'Rubik', sans-serif", fontWeight: '600', fontSize: '18px', marginBottom: '12px', color: 'white' }}>FoeGuard Farms</h3>
                <p style={{ fontFamily: "'Rubik', sans-serif", fontWeight: '400', fontSize: '15px', color: 'rgba(255,255,255,0.85)', lineHeight: '1.6' }}>Humanely raised on organic feed, open pastures, and small-batch harvests.</p>
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
                Build Meal Plan
              </button>
              <p style={{ fontSize: '14px', color: 'rgba(255,255,255,0.85)', margin: '12px 0 0' }}>
                or <span style={{ cursor: 'pointer', textDecoration: 'underline' }} onClick={() => navigate('/build-box')}>Build Your Box</span>
              </p>
            </div>
          </div>
        </section>

        {/* ===== SECTION — 8 PROTEINS ===== */}
        <section className="proteins-section" style={{ background: '#F8F6F4', padding: '80px 20px' }}>
          <div className="section-container">
            <h2 className="section-title" style={{ textAlign: 'center', marginBottom: '16px', textTransform: 'none', fontWeight: '600' }}>Choose your pets favourites</h2>
            <p style={{ textAlign: 'center', fontSize: '17px', marginBottom: '48px', color: '#666', maxWidth: '900px', margin: '0 auto 48px' }}>
              Introduce your dog to their own raw food cuisine. We offer a variety of protein options and blends to suit their unique dietary needs and the flavours they love.
            </p>
            
            {/* Proteins Carousel */}
            <div style={{ position: 'relative', maxWidth: '1200px', margin: '0 auto' }}>
              <button
                onClick={() => scrollProteins('left')}
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
                ref={proteinScrollRef}
                style={{
                  display: 'flex',
                  gap: '24px',
                  overflowX: 'auto',
                  scrollBehavior: 'smooth',
                  paddingBottom: '16px',
                  scrollbarWidth: 'none',
                  msOverflowStyle: 'none'
                }}
                className="protein-scroll-container"
              >
                {proteins.map((protein, i) => (
                  <div 
                    key={i}
                    style={{
                      minWidth: '280px',
                      background: 'white',
                      borderRadius: '12px',
                      padding: '20px',
                      boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                      border: '1px solid #E8DDD0',
                      textAlign: 'center'
                    }}
                  >
                    <div style={{
                      width: '100%',
                      height: '180px',
                      background: '#E8DDD0',
                      borderRadius: '8px',
                      marginBottom: '16px',
                      overflow: 'hidden',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#8B4513',
                      fontSize: '14px'
                    }}>
                      {protein.image ? (
                        <img src={protein.image} alt={protein.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      ) : (
                        `${protein.name} Image`
                      )}
                    </div>
                    <h3 style={{ 
                      fontSize: '20px', 
                      fontWeight: '600', 
                      marginBottom: '12px',
                      color: '#8B4513'
                    }}>
                      {protein.name}
                    </h3>
                    <p style={{ 
                      fontSize: '15px', 
                      color: '#666',
                      lineHeight: '1.6',
                      margin: 0
                    }}>
                      {protein.description}
                    </p>
                  </div>
                ))}
              </div>

              <button
                onClick={() => scrollProteins('right')}
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
          </div>
        </section>

        {/* ===== SECTION — REDEFINE PET FOOD ===== */}
        <section className="problem-section" style={{ background: 'white', padding: '60px 20px' }}>
          <div className="section-container">
            <h2 className="section-title" style={{ textTransform: 'none', fontWeight: '600' }}>What you won't find in the bowl</h2>
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
                <Package size={32} style={{ color: '#8B4513', flexShrink: 0 }} />
                <div>
                  <h3 style={{ fontSize: '16px', marginBottom: '8px', fontWeight: '600', color: '#8B4513' }}>Processed Ingredients</h3>
                  <p style={{ fontSize: '14px', color: '#666', margin: 0, lineHeight: '1.5' }}>Made for longer shelf life, not for a dog's anatomy.</p>
                </div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px', padding: '24px 16px', background: '#F8F6F4', borderRadius: '8px', textAlign: 'center' }}>
                <X size={32} style={{ color: '#8B4513', flexShrink: 0 }} />
                <div>
                  <h3 style={{ fontSize: '16px', marginBottom: '8px', fontWeight: '600', color: '#8B4513' }}>Low-Quality Fillers</h3>
                  <p style={{ fontSize: '14px', color: '#666', margin: 0, lineHeight: '1.5' }}>Without grain, byproducts or months-old meat.</p>
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
            <h2 className="section-title" style={{ textTransform: 'none', fontWeight: '600' }}>How it works</h2>
            <p style={{ textAlign: 'center', fontSize: '18px', marginBottom: '48px', color: '#666' }}>
              Feeding raw is simpler than you think.
            </p>
            
            <div className="steps-grid">
              <div className="step-card">
                <div className="step-image-container">
                  <img src="https://customer-assets.emergentagent.com/job_b68c2142-db90-4d98-9725-e1ffe0396c9b/artifacts/o4ctb4hs_step%201.png" alt="Choose your plan" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '12px' }} />
                  <div className="step-number-overlay">1</div>
                </div>
                <h3>Choose Your<br />Plan</h3>
                <p style={{ fontSize: '15px', color: '#666' }}>
                  Create a personalized meal plan or build your own box.
                </p>
              </div>
              <div className="step-card">
                <div className="step-image-container">
                  <img src="https://customer-assets.emergentagent.com/job_b68c2142-db90-4d98-9725-e1ffe0396c9b/artifacts/ms6gxgag_step%202.png" alt="Receive your delivery" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '12px' }} />
                  <div className="step-number-overlay">2</div>
                </div>
                <h3>Receive Your Delivery</h3>
                <p style={{ fontSize: '15px', color: '#666' }}>
                  Meals arrive safely frozen for freshness, ready for storage and portioning.
                </p>
              </div>
              <div className="step-card">
                <div className="step-image-container">
                  <img src="https://customer-assets.emergentagent.com/job_b68c2142-db90-4d98-9725-e1ffe0396c9b/artifacts/wov418dt_step%203.png" alt="Feed with confidence" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '12px' }} />
                  <div className="step-number-overlay">3</div>
                </div>
                <h3>Feed with Confidence</h3>
                <p style={{ fontSize: '15px', color: '#666' }}>
                  Just thaw, serve, and watch your dog thrive.
                </p>
              </div>
            </div>
            
            <p style={{ textAlign: 'center', marginTop: '32px', fontSize: '15px', color: '#666', fontStyle: 'italic' }}>
              Subscribe to save and never run out.
            </p>
            
            <div style={{ textAlign: 'center', marginTop: '32px', display: 'flex', gap: '8px', justifyContent: 'center', flexWrap: 'wrap', alignItems: 'center' }}>
              <button 
                className="btn-primary" 
                onClick={() => navigate('/build-box')}
                style={{ borderRadius: '8px', padding: '14px 32px', fontSize: '16px' }}
              >
                Build Meal Plan
              </button>
              <span style={{ fontSize: '14px', color: '#666' }}>or</span>
              <span style={{ fontSize: '14px', color: '#666', cursor: 'pointer', textDecoration: 'underline' }} onClick={() => navigate('/build-box')}>
                Build Your Box
              </span>
            </div>
          </div>
        </section>

        {/* ===== SECTION — OUR STORY ===== */}
        <section className="about-section" style={{ background: '#F8F6F4', padding: '80px 20px' }}>
          <div className="section-container" style={{ maxWidth: '900px', margin: '0 auto' }}>
            <h2 className="section-title" style={{ textTransform: 'none', marginBottom: '32px', color: '#2B2B2B', fontWeight: '600' }}>Our story is your story.</h2>
            <p style={{ fontSize: '17px', marginBottom: '20px', lineHeight: '1.7', color: '#333' }}>
              Like many pet parents, we trusted the labels and fed what the stores recommended. But when our own family started struggling with health issues linked to processed food, we turned to our farm and began growing real, wholesome ingredients ourselves — and the difference changed everything for us.
            </p>
            <p style={{ fontSize: '17px', marginBottom: '20px', lineHeight: '1.7', color: '#333' }}>
              So we asked a simple question: why should our dogs eat any differently?
            </p>
            <p style={{ fontSize: '17px', marginBottom: '20px', lineHeight: '1.7', color: '#333' }}>
              We started feeding them the same way — fresh, natural, raised with care. The results confirmed what we already believed. Dogs are carnivores, and they thrive when they eat like it.
            </p>
            <p style={{ fontSize: '17px', marginBottom: '0', lineHeight: '1.7', color: '#333' }}>
              What began as meals for our own dogs, then friends and neighbours, has grown over the past 10 years into FoeGuard. Along the way, we've worked closely with canine nutritionists, biologists, and behaviourists to make sure every recipe meets one standard: if it's not good enough for our table, it's not going in your dog's bowl.
            </p>
          </div>
        </section>

        {/* ===== SECTION — BENEFITS ===== */}
        <section className="problem-section" style={{ background: 'white' }}>
          <div className="section-container">
            <h2 className="section-title" style={{ textTransform: 'none', marginBottom: '24px', fontWeight: '600' }}>Benefits you can see, and they can feel.</h2>
            
            <div style={{ maxWidth: '900px', margin: '0 auto 48px' }}>
              <img 
                src="https://customer-assets.emergentagent.com/job_b68c2142-db90-4d98-9725-e1ffe0396c9b/artifacts/fleo929y_benefits.png"
                alt="Dog with benefits labeled - Fresh Breath, Less Allergies, Better Digestion, More Energy, Healthy Weight"
                style={{ width: '100%', borderRadius: '16px', display: 'block' }}
              />
            </div>

            {/* Scrollable Reviews Carousel */}
            <div style={{ position: 'relative', maxWidth: '1000px', margin: '0 auto' }}>
              <button
                onClick={() => scrollReviews('left')}
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
                ref={reviewsScrollRef}
                style={{
                  display: 'flex',
                  gap: '24px',
                  overflowX: 'auto',
                  scrollBehavior: 'smooth',
                  paddingBottom: '16px',
                  scrollbarWidth: 'none',
                  msOverflowStyle: 'none'
                }}
                className="reviews-scroll-container"
              >
                <div style={{ 
                  background: 'white', 
                  padding: '24px',
                  minWidth: '320px',
                  borderRadius: '12px', 
                  boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                  border: '1px solid #E8DDD0'
                }}>
                  <div style={{ 
                    width: '100%', 
                    height: '200px', 
                    background: '#E8DDD0', 
                    borderRadius: '8px', 
                    marginBottom: '16px',
                    overflow: 'hidden'
                  }}><img src="https://customer-assets.emergentagent.com/job_b68c2142-db90-4d98-9725-e1ffe0396c9b/artifacts/tigvcdhx_canadianfarmdogs_review.jpg" alt="Canadian Farm Dogs review" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /></div>
                  <p style={{ fontSize: '15px', fontStyle: 'normal', marginBottom: '12px', lineHeight: '1.6' }}>
                    "Indigo is known to be pickier ... but had zero issue with this food and enjoyed every meal. Oliver also thoroughly enjoyed the food and his stools were perfect (...something that we have issues with)"
                  </p>
                  <p style={{ fontSize: '14px', fontWeight: '600', color: '#8B4513', margin: 0 }}>@canadian.farm.dogs</p>
                </div>
                <div style={{ 
                  background: 'white', 
                  padding: '24px',
                  minWidth: '320px',
                  borderRadius: '12px', 
                  boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                  border: '1px solid #E8DDD0'
                }}>
                  <div style={{ 
                    width: '100%', 
                    height: '200px', 
                    background: '#E8DDD0', 
                    borderRadius: '8px', 
                    marginBottom: '16px',
                    overflow: 'hidden'
                  }}><img src="https://customer-assets.emergentagent.com/job_b68c2142-db90-4d98-9725-e1ffe0396c9b/artifacts/u1n2212w_zeus_review.jpg" alt="Zeus review" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /></div>
                  <p style={{ fontSize: '15px', fontStyle: 'normal', marginBottom: '12px', lineHeight: '1.6' }}>
                    "Zeus is VERY impressed. Love the dinners because they're already a balanced meal making it easy ... he devours and makes sure he licks every little bit left in his bowl!"
                  </p>
                  <p style={{ fontSize: '14px', fontWeight: '600', color: '#8B4513', margin: 0 }}>@zeus.thedobie_</p>
                </div>
                <div style={{ 
                  background: 'white', 
                  padding: '24px',
                  minWidth: '320px',
                  borderRadius: '12px', 
                  boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                  border: '1px solid #E8DDD0'
                }}>
                  <div style={{ 
                    width: '100%', 
                    height: '200px', 
                    background: '#E8DDD0', 
                    borderRadius: '8px', 
                    marginBottom: '16px',
                    overflow: 'hidden'
                  }}><img src="https://customer-assets.emergentagent.com/job_b68c2142-db90-4d98-9725-e1ffe0396c9b/artifacts/t7k8yiyo_fuji_review.jpg" alt="Fuji review" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /></div>
                  <p style={{ fontSize: '15px', fontStyle: 'normal', marginBottom: '12px', lineHeight: '1.6' }}>
                    "I've been waiting to be woken up in the middle of the night for her to go washroom, but her stool has been consistent and perfect since I began introducing the raw food."
                  </p>
                  <p style={{ fontSize: '14px', fontWeight: '600', color: '#8B4513', margin: 0 }}>@fuji.pai02</p>
                </div>
                <div style={{ 
                  background: 'white', 
                  padding: '24px',
                  minWidth: '320px',
                  borderRadius: '12px', 
                  boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                  border: '1px solid #E8DDD0'
                }}>
                  <div style={{ 
                    width: '100%', 
                    height: '200px', 
                    background: '#E8DDD0', 
                    borderRadius: '8px', 
                    marginBottom: '16px',
                    overflow: 'hidden'
                  }}><img src="https://customer-assets.emergentagent.com/job_b68c2142-db90-4d98-9725-e1ffe0396c9b/artifacts/oogtcds4_Bane_review%20.jpg" alt="Bane review" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /></div>
                  <p style={{ fontSize: '15px', fontStyle: 'normal', marginBottom: '12px', lineHeight: '1.6' }}>
                    "If you show your dog's professionally FG may be your secret weapon"
                  </p>
                  <p style={{ fontSize: '14px', fontWeight: '600', color: '#8B4513', margin: 0 }}>@bane.thebully</p>
                </div>
                <div style={{ 
                  background: 'white', 
                  padding: '24px',
                  minWidth: '320px',
                  borderRadius: '12px', 
                  boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                  border: '1px solid #E8DDD0'
                }}>
                  <div style={{ 
                    width: '100%', 
                    height: '200px', 
                    background: '#E8DDD0', 
                    borderRadius: '8px', 
                    marginBottom: '16px',
                    overflow: 'hidden'
                  }}><img src="https://customer-assets.emergentagent.com/job_b68c2142-db90-4d98-9725-e1ffe0396c9b/artifacts/q6am4khg_tyson_review.jpg" alt="Tyson review" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /></div>
                  <p style={{ fontSize: '15px', fontStyle: 'normal', marginBottom: '12px', lineHeight: '1.6' }}>
                    "Ever since switching to their raw food her allergies have disappeared"
                  </p>
                  <p style={{ fontSize: '14px', fontWeight: '600', color: '#8B4513', margin: 0 }}>@tyson.blacklabb</p>
                </div>
                <div style={{ 
                  background: 'white', 
                  padding: '24px',
                  minWidth: '320px',
                  borderRadius: '12px', 
                  boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                  border: '1px solid #E8DDD0'
                }}>
                  <div style={{ 
                    width: '100%', 
                    height: '200px', 
                    background: '#E8DDD0', 
                    borderRadius: '8px', 
                    marginBottom: '16px',
                    overflow: 'hidden'
                  }}><img src="https://customer-assets.emergentagent.com/job_b68c2142-db90-4d98-9725-e1ffe0396c9b/artifacts/k1ijugp9_leo_review.jpg" alt="Leo review" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /></div>
                  <p style={{ fontSize: '15px', fontStyle: 'normal', marginBottom: '12px', lineHeight: '1.6' }}>
                    "Milans sensitive tummy was causing us constant worry until we switched to FoeGuard."
                  </p>
                  <p style={{ fontSize: '14px', fontWeight: '600', color: '#8B4513', margin: 0 }}>@leo.thegsd</p>
                </div>
              </div>

              <button
                onClick={() => scrollReviews('right')}
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
          </div>
        </section>

        {/* ===== SECTION — VET INSIGHTS ===== */}
        <section className="problem-section" style={{ background: '#F8F6F4' }}>
          <div className="section-container">
            <div style={{ marginTop: '0' }}>
              <h3 style={{ textAlign: 'center', fontSize: '24px', marginBottom: '32px', textTransform: 'none' }}>Insights from veterinarians</h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px', maxWidth: '1000px', margin: '0 auto' }}>
                <div style={{ 
                  background: 'white', 
                  padding: '32px', 
                  borderRadius: '12px', 
                  boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                  textAlign: 'center'
                }}>
                  <p style={{ fontSize: '16px', fontStyle: 'normal', marginBottom: '16px', lineHeight: '1.6', color: '#333' }}>
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
                  <p style={{ fontSize: '16px', fontStyle: 'normal', marginBottom: '16px', lineHeight: '1.6', color: '#333' }}>
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
                  <p style={{ fontSize: '16px', fontStyle: 'normal', marginBottom: '16px', lineHeight: '1.6', color: '#333' }}>
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
            <h2 className="section-title" style={{ textTransform: 'none', marginBottom: '40px', fontWeight: '600' }}>Start to see a healthier, more energetic dog within days.</h2>
            
            <div style={{ display: 'flex', gap: '48px', maxWidth: '1100px', margin: '0 auto', alignItems: 'center', flexWrap: 'wrap' }}>
              <div style={{ 
                flex: '0 0 400px', 
                height: '450px', 
                borderRadius: '12px',
                overflow: 'hidden'
              }}>
                <img src="https://customer-assets.emergentagent.com/job_b68c2142-db90-4d98-9725-e1ffe0396c9b/artifacts/jec541v5_product%20bowl.png" alt="FoeGuard raw food bowl with fresh ingredients" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
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

        {/* ===== FINAL CTA ===== */}
        <section className="final-cta-section">
          <div className="section-container">
            <h2 className="section-title-white" style={{ fontSize: '36px', marginBottom: '24px', textTransform: 'none', fontWeight: '600' }}>
              Ready to see your dog thrive?
            </h2>
            
            <p style={{ fontSize: '17px', color: 'rgba(255,255,255,0.9)', marginBottom: '20px' }}>
              Farm-fresh raw pet food, raised in Ontario and delivered to your door.
            </p>
            
            <p style={{ fontSize: '18px', color: 'rgba(255,255,255,0.95)', marginBottom: '40px', fontWeight: '600' }}>
              Get 40% off your first 2 weeks.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', maxWidth: '400px', margin: '0 auto' }}>
              <button 
                className="btn-hero" 
                onClick={() => navigate('/build-box')}
                data-testid="final-cta-btn"
                style={{ width: '100%', borderRadius: '8px', padding: '14px 32px', fontSize: '16px' }}
              >
                Create Meal Plan
              </button>
              
              <div style={{ fontSize: '14px', color: 'rgba(255,255,255,0.85)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span>or</span>
                <span 
                  onClick={() => navigate('/build-box')}
                  style={{ cursor: 'pointer', textDecoration: 'underline' }}
                >
                  Build Your Box
                </span>
              </div>
            </div>
          </div>
        </section>

      </div>
      <Footer />
    </>
  );
};
