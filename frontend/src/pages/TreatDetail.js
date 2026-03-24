import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Navbar, Footer } from '../components/Layout';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:8001';

const CollapsibleSection = ({ title, children, defaultOpen = false }) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div style={{
      border: '1px solid #E8DDD0',
      borderRadius: '12px',
      overflow: 'hidden',
      background: '#fff'
    }}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        style={{
          width: '100%',
          padding: '20px 24px',
          background: 'transparent',
          border: 'none',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          cursor: 'pointer',
          fontFamily: "'Rubik', sans-serif",
          fontSize: '18px',
          fontWeight: '600',
          color: '#2B2B2B',
          textAlign: 'left'
        }}
      >
        {title}
        <span style={{
          fontSize: '24px',
          transition: 'transform 0.3s ease',
          transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)'
        }}>▼</span>
      </button>
      {isOpen && (
        <div style={{ padding: '0 24px 24px 24px' }}>
          {children}
        </div>
      )}
    </div>
  );
};

export const TreatDetailPage = () => {
  const { treatId } = useParams();
  const navigate = useNavigate();
  const [treat, setTreat] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    window.scrollTo(0, 0);
    document.documentElement.scrollTop = 0;
    const fetchTreat = async () => {
      try {
        const response = await axios.get(`${BACKEND_URL}/api/treats`);
        const foundTreat = response.data.find(t => t.treat_id === treatId);
        setTreat(foundTreat);
      } catch (error) {
        console.error('Error fetching treat:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchTreat();
  }, [treatId]);

  if (loading) {
    return (
      <>
        <Navbar />
        <div style={{ padding: '60px 20px', textAlign: 'center' }}>Loading...</div>
        <Footer />
      </>
    );
  }

  if (!treat) {
    return (
      <>
        <Navbar />
        <div style={{ padding: '60px 20px', textAlign: 'center' }}>
          <h2>Treat not found</h2>
          <button onClick={() => navigate('/build-box')} style={{ marginTop: '20px', padding: '12px 24px', background: '#A41E34', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer' }}>
            Back to Menu
          </button>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="product-detail-page" style={{ background: '#FDFCFA', minHeight: '100vh', paddingTop: '80px' }}>
        <div className="product-detail-container" style={{ maxWidth: '1200px', margin: '0 auto', padding: '40px 20px' }}>
          <button
            onClick={() => navigate('/build-box')}
            style={{
              background: 'transparent',
              border: '2px solid #A41E34',
              color: '#A41E34',
              padding: '10px 20px',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '15px',
              fontWeight: '600',
              marginBottom: '24px',
              transition: 'all 0.2s ease'
            }}
            onMouseEnter={(e) => {
              e.target.style.background = '#A41E34';
              e.target.style.color = '#fff';
            }}
            onMouseLeave={(e) => {
              e.target.style.background = 'transparent';
              e.target.style.color = '#A41E34';
            }}
          >
            ← Back to Menu
          </button>

          <div className="product-detail-content" style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '40px',
            marginBottom: '60px'
          }}>
            <div className="product-hero-image" style={{
              background: '#F5F1EB',
              borderRadius: '16px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              minHeight: '400px',
              padding: '40px'
            }}>
              {treat.image_url ? (
                <img src={treat.image_url} alt={treat.name} style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }} />
              ) : (
                <div style={{ textAlign: 'center', color: '#999' }}>
                  <div style={{ fontSize: '80px', marginBottom: '16px' }}>🦴</div>
                  <p style={{ fontSize: '18px', color: '#999' }}>Image coming soon</p>
                </div>
              )}
            </div>

            <div className="product-hero-info" style={{ padding: '32px' }}>
              <h1 style={{
                fontFamily: "'CS Gordon', serif",
                fontSize: '36px',
                color: '#2B2B2B',
                margin: '0 0 20px 0',
                lineHeight: '1.2'
              }}>{treat.name}</h1>
              
              <div style={{ marginBottom: '24px' }}>
                <span style={{ fontSize: '32px', fontWeight: '700', color: '#A41E34' }}>${treat.price.toFixed(2)}</span>
                <p style={{ fontSize: '15px', color: '#666', margin: '8px 0 0 0' }}>{treat.quantity_description}</p>
              </div>

              {treat.description && (
                <div style={{ marginTop: '20px' }}>
                  <p style={{
                    fontSize: '15px',
                    lineHeight: '1.7',
                    color: '#3D3D3D',
                    whiteSpace: 'pre-line'
                  }}>{treat.description}</p>
                </div>
              )}
            </div>
          </div>

          <div className="product-details-sections" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {treat.feeding_guide && (
              <CollapsibleSection title="Feeding Guide" defaultOpen={true}>
                <div className="feeding-guide">
                  <div style={{ marginBottom: '20px' }}>
                    <h4 style={{ fontSize: '15px', fontWeight: '700', color: '#2B2B2B', margin: '0 0 8px 0' }}>Feeding Instructions</h4>
                    <p style={{ fontSize: '15px', lineHeight: '1.7', color: '#3D3D3D', margin: 0 }}>{treat.feeding_guide.feeding}</p>
                  </div>
                  <div style={{ marginBottom: '20px' }}>
                    <h4 style={{ fontSize: '15px', fontWeight: '700', color: '#2B2B2B', margin: '0 0 8px 0' }}>Handling Instructions</h4>
                    <p style={{ fontSize: '15px', lineHeight: '1.7', color: '#3D3D3D', margin: 0 }}>{treat.feeding_guide.handling}</p>
                  </div>
                  {treat.feeding_guide.note && (
                    <div style={{ background: '#FAF8F5', padding: '16px', borderRadius: '12px' }}>
                      <p style={{ fontSize: '14px', color: '#3D3D3D', margin: 0 }}>
                        <a href="/calculator" style={{ color: '#A41E34', textDecoration: 'underline', fontWeight: '600' }}>See our feeding calculator</a> to see how much to feed your pet.
                      </p>
                    </div>
                  )}
                </div>
              </CollapsibleSection>
            )}

            {treat.product_information && (
              <CollapsibleSection title="Product Information">
                <p style={{ fontSize: '15px', lineHeight: '1.7', color: '#3D3D3D', margin: 0, whiteSpace: 'pre-line' }}>
                  {treat.product_information}
                </p>
              </CollapsibleSection>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};
