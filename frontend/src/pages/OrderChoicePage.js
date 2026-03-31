import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Navbar, Footer } from '../components/Layout';

export const OrderChoicePage = () => {
  const navigate = useNavigate();

  return (
    <>
      <Navbar />
      <div style={{
        minHeight: 'calc(100vh - 160px)',
        background: 'linear-gradient(180deg, #F5F3EF 0%, #fff 100%)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '60px 20px'
      }}>
        <h1 style={{
          fontFamily: "'Rubik', sans-serif",
          fontSize: 'clamp(28px, 5vw, 42px)',
          fontWeight: '600',
          color: '#2B2B2B',
          marginBottom: '16px',
          textAlign: 'center'
        }}>
          How would you like to order?
        </h1>
        <p style={{
          fontFamily: "'Rubik', sans-serif",
          fontSize: '18px',
          color: '#666',
          marginBottom: '48px',
          textAlign: 'center',
          maxWidth: '500px'
        }}>
          Choose the option that works best for you and your pet.
        </p>

        <div style={{
          display: 'flex',
          gap: '24px',
          flexWrap: 'wrap',
          justifyContent: 'center',
          maxWidth: '900px'
        }}>
          {/* Create Meal Plan Option - Cinematic Image Card */}
          <div 
            onClick={() => navigate('/meal-plan')}
            style={{
              position: 'relative',
              width: '380px',
              height: '320px',
              borderRadius: '20px',
              overflow: 'hidden',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              boxShadow: '0 8px 32px rgba(0,0,0,0.15)'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-8px)';
              e.currentTarget.style.boxShadow = '0 16px 48px rgba(0,0,0,0.25)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 8px 32px rgba(0,0,0,0.15)';
            }}
          >
            {/* Background Image */}
            <img 
              src="https://customer-assets.emergentagent.com/job_c26be434-5664-4617-995c-8c836934bef5/artifacts/a5bhlhqi_5.png"
              alt="Meal Plan"
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                position: 'absolute',
                inset: 0
              }}
            />
            {/* Dark Overlay with Text */}
            <div style={{
              position: 'absolute',
              inset: 0,
              background: 'linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.4) 50%, rgba(0,0,0,0.2) 100%)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'flex-end',
              padding: '32px'
            }}>
              <h2 style={{
                fontFamily: "'Rubik', sans-serif",
                fontSize: '28px',
                fontWeight: '700',
                color: '#fff',
                marginBottom: '8px',
                textShadow: '0 2px 8px rgba(0,0,0,0.5)'
              }}>
                Create Meal Plan
              </h2>
              <p style={{
                fontFamily: "'Rubik', sans-serif",
                fontSize: '14px',
                color: 'rgba(255,255,255,0.9)',
                lineHeight: '1.5',
                marginBottom: '16px'
              }}>
                Personalized portions based on your dog's needs
              </p>
              <div style={{
                background: '#fff',
                color: '#8B4513',
                padding: '12px 24px',
                borderRadius: '8px',
                fontFamily: "'Rubik', sans-serif",
                fontWeight: '600',
                fontSize: '15px',
                textAlign: 'center',
                width: 'fit-content'
              }}>
                Get Started
              </div>
            </div>
          </div>

          {/* Build Your Box Option - Cinematic Image Card */}
          <div 
            onClick={() => navigate('/build-box')}
            style={{
              position: 'relative',
              width: '380px',
              height: '320px',
              borderRadius: '20px',
              overflow: 'hidden',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              boxShadow: '0 8px 32px rgba(0,0,0,0.15)'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-8px)';
              e.currentTarget.style.boxShadow = '0 16px 48px rgba(0,0,0,0.25)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 8px 32px rgba(0,0,0,0.15)';
            }}
          >
            {/* Background Image */}
            <img 
              src="https://customer-assets.emergentagent.com/job_c26be434-5664-4617-995c-8c836934bef5/artifacts/1olxgtz6_3.png"
              alt="Build Your Box"
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                position: 'absolute',
                inset: 0
              }}
            />
            {/* Dark Overlay with Text */}
            <div style={{
              position: 'absolute',
              inset: 0,
              background: 'linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.4) 50%, rgba(0,0,0,0.2) 100%)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'flex-end',
              padding: '32px'
            }}>
              <h2 style={{
                fontFamily: "'Rubik', sans-serif",
                fontSize: '28px',
                fontWeight: '700',
                color: '#fff',
                marginBottom: '8px',
                textShadow: '0 2px 8px rgba(0,0,0,0.5)'
              }}>
                Build Your Box
              </h2>
              <p style={{
                fontFamily: "'Rubik', sans-serif",
                fontSize: '14px',
                color: 'rgba(255,255,255,0.9)',
                lineHeight: '1.5',
                marginBottom: '16px'
              }}>
                Choose your own proteins and treats
              </p>
              <div style={{
                background: '#fff',
                color: '#8B4513',
                padding: '12px 24px',
                borderRadius: '8px',
                fontFamily: "'Rubik', sans-serif",
                fontWeight: '600',
                fontSize: '15px',
                textAlign: 'center',
                width: 'fit-content'
              }}>
                Start Building
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};
