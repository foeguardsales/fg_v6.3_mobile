import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Navbar, Footer } from '../components/Layout';
import { ClipboardList, Package } from 'lucide-react';

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
          gap: '32px',
          flexWrap: 'wrap',
          justifyContent: 'center',
          maxWidth: '900px'
        }}>
          {/* Create Meal Plan Option */}
          <div 
            onClick={() => navigate('/meal-plan')}
            style={{
              background: 'white',
              borderRadius: '20px',
              padding: '48px 40px',
              width: '340px',
              boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              border: '2px solid transparent',
              textAlign: 'center'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-8px)';
              e.currentTarget.style.boxShadow = '0 12px 40px rgba(0,0,0,0.15)';
              e.currentTarget.style.borderColor = '#8B4513';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 4px 20px rgba(0,0,0,0.08)';
              e.currentTarget.style.borderColor = 'transparent';
            }}
          >
            <div style={{
              width: '100px',
              height: '100px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #D9C8B3 0%, #B8A89A 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 24px'
            }}>
              <ClipboardList size={48} color="#fff" />
            </div>
            <h2 style={{
              fontFamily: "'Rubik', sans-serif",
              fontSize: '24px',
              fontWeight: '600',
              color: '#2B2B2B',
              marginBottom: '12px'
            }}>
              Create Meal Plan
            </h2>
            <p style={{
              fontFamily: "'Rubik', sans-serif",
              fontSize: '15px',
              color: '#666',
              lineHeight: '1.6',
              marginBottom: '24px'
            }}>
              Tell us about your dog and we'll create a personalized feeding plan with the right portions and proteins.
            </p>
            <div style={{
              background: '#8B4513',
              color: 'white',
              padding: '14px 32px',
              borderRadius: '8px',
              fontFamily: "'Rubik', sans-serif",
              fontWeight: '600',
              fontSize: '16px'
            }}>
              Get Started
            </div>
          </div>

          {/* Build Your Box Option */}
          <div 
            onClick={() => navigate('/build-box')}
            style={{
              background: 'white',
              borderRadius: '20px',
              padding: '48px 40px',
              width: '340px',
              boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              border: '2px solid transparent',
              textAlign: 'center'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-8px)';
              e.currentTarget.style.boxShadow = '0 12px 40px rgba(0,0,0,0.15)';
              e.currentTarget.style.borderColor = '#8B4513';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 4px 20px rgba(0,0,0,0.08)';
              e.currentTarget.style.borderColor = 'transparent';
            }}
          >
            <div style={{
              width: '100px',
              height: '100px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #8B4513 0%, #A0522D 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 24px'
            }}>
              <Package size={48} color="#fff" />
            </div>
            <h2 style={{
              fontFamily: "'Rubik', sans-serif",
              fontSize: '24px',
              fontWeight: '600',
              color: '#2B2B2B',
              marginBottom: '12px'
            }}>
              Build Your Box
            </h2>
            <p style={{
              fontFamily: "'Rubik', sans-serif",
              fontSize: '15px',
              color: '#666',
              lineHeight: '1.6',
              marginBottom: '24px'
            }}>
              Browse our full menu and customize your own box with the proteins and treats your pet loves.
            </p>
            <div style={{
              background: '#8B4513',
              color: 'white',
              padding: '14px 32px',
              borderRadius: '8px',
              fontFamily: "'Rubik', sans-serif",
              fontWeight: '600',
              fontSize: '16px'
            }}>
              Start Building
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};
