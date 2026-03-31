import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Navbar, Footer } from '../components/Layout';

export const MealPlanPage = () => {
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
          Create Your Meal Plan
        </h1>
        <p style={{
          fontFamily: "'Rubik', sans-serif",
          fontSize: '18px',
          color: '#666',
          marginBottom: '32px',
          textAlign: 'center',
          maxWidth: '500px'
        }}>
          Coming soon! We're working on a personalized meal planning experience for you.
        </p>
        <button 
          onClick={() => navigate('/order')}
          style={{
            background: '#8B4513',
            color: 'white',
            padding: '14px 32px',
            borderRadius: '8px',
            border: 'none',
            fontFamily: "'Rubik', sans-serif",
            fontWeight: '600',
            fontSize: '16px',
            cursor: 'pointer'
          }}
        >
          Go Back
        </button>
      </div>
      <Footer />
    </>
  );
};
