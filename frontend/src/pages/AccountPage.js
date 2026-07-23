import React, { useState, useEffect, lazy, Suspense } from 'react';
import { useNavigate } from 'react-router-dom';
import { Navbar, Footer } from '../components/Layout';
import { useAuth } from '../lib/useAuth';
import { orderService } from '../services/api';
import { Dog, Edit2, ChevronRight, Plus, BookOpen } from 'lucide-react';
import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:8001';
const API = `${BACKEND_URL}/api`;

const AuthSection = lazy(() => import('../components/account/AuthSection').then(m => ({ default: m.AuthSection })));
const OrdersList = lazy(() => import('../components/account/OrdersList').then(m => ({ default: m.OrdersList })));
const SubscriptionManager = lazy(() => import('../components/account/SubscriptionManager').then(m => ({ default: m.SubscriptionManager })));

// ---------------------------------------------------------------------------
// Saved Plans section — Prompt 5.
// Cards for each dog in the profile: "<Name>'s Plan" (quiz results) + optional
// "<Name>'s Feeding Guide" (calculator done).  Clicking a plan card jumps to
// /menu?plan=<index> which highlights that pet's recommended proteins.
// ---------------------------------------------------------------------------
const SavedPlansSection = ({ profile, navigate }) => {
  const dogs = profile?.dogs || [];

  // Feeding-guide entries live in localStorage under 'foeguard_saved_pets'
  // (written by FeedingCalculator.js when a logged-in user hits Save).
  let feedingGuides = [];
  try {
    feedingGuides = JSON.parse(localStorage.getItem('foeguard_saved_pets') || '[]');
    if (!Array.isArray(feedingGuides)) feedingGuides = [];
  } catch (_) { feedingGuides = []; }

  const hasPlans = dogs.length > 0 || feedingGuides.length > 0;

  return (
    <div data-testid="saved-plans-section" style={{
      background: 'white',
      borderRadius: '16px',
      padding: '24px',
      marginBottom: '32px',
      boxShadow: '0 2px 12px rgba(0,0,0,0.06)'
    }}>
      <h3 style={{ fontSize: '20px', fontWeight: 700, margin: '0 0 16px', color: '#2C2C2C', fontFamily: "'Barlow Semi Condensed', serif" }}>
        Saved Plans and Feeding Guides
      </h3>

      {!hasPlans ? (
        <div data-testid="saved-plans-empty" style={{
          padding: '20px',
          background: '#F8F6F3',
          borderRadius: '10px',
          fontSize: '14px',
          color: '#2C2C2C',
          lineHeight: 1.5,
          display: 'flex',
          flexDirection: 'column',
          gap: '12px',
          alignItems: 'flex-start'
        }}>
          <span>
            You don&apos;t have any saved plans yet. Create a meal plan or complete
            our calculator and your recommendations will appear here.
          </span>
          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            <button
              onClick={() => navigate('/meal-plan')}
              style={{
                background: '#c8102e', color: 'white', border: 'none',
                padding: '10px 16px', borderRadius: '8px', fontWeight: 600,
                fontSize: '13px', cursor: 'pointer'
              }}
            >Create Meal Plan</button>
            <button
              onClick={() => navigate('/calculator')}
              style={{
                background: 'transparent', color: '#c8102e',
                border: '1.5px solid #c8102e', padding: '9px 16px',
                borderRadius: '8px', fontWeight: 600, fontSize: '13px',
                cursor: 'pointer'
              }}
            >Feeding Calculator</button>
          </div>
        </div>
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
          gap: '12px'
        }}>
          {dogs.map((dog, index) => (
            <button
              key={dog.dog_id || `plan-${index}`}
              data-testid={`saved-plan-card-${index}`}
              onClick={() => {
                // Skip the menu funnel — user arrived via a saved plan.
                sessionStorage.setItem('foeguard_selection', 'shop-raw');
                navigate(`/menu?plan=${index}`);
              }}
              style={{
                display: 'flex', alignItems: 'center', gap: '10px',
                padding: '14px 16px', background: '#F8F6F3',
                border: '1px solid #E8E4DC', borderRadius: '12px',
                textAlign: 'left', cursor: 'pointer', fontFamily: 'inherit'
              }}
            >
              <span style={{
                width: 36, height: 36, borderRadius: '50%',
                background: '#c8102e', color: 'white', display: 'inline-flex',
                alignItems: 'center', justifyContent: 'center', flexShrink: 0
              }}>
                <Dog size={18} />
              </span>
              <span style={{ flex: 1, minWidth: 0 }}>
                <span style={{ display: 'block', fontWeight: 700, fontSize: '15px', color: '#2C2C2C', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {dog.name}&apos;s Plan
                </span>
                <span style={{ display: 'block', fontSize: '12px', color: '#2C2C2C', opacity: 0.65 }}>
                  Tap to view on menu
                </span>
              </span>
              <ChevronRight size={16} color="#c8102e" />
            </button>
          ))}
          {feedingGuides.map((g, i) => (
            <button
              key={`guide-${i}`}
              data-testid={`saved-guide-card-${i}`}
              onClick={() => navigate('/calculator')}
              style={{
                display: 'flex', alignItems: 'center', gap: '10px',
                padding: '14px 16px', background: '#F8F6F3',
                border: '1px solid #E8E4DC', borderRadius: '12px',
                textAlign: 'left', cursor: 'pointer', fontFamily: 'inherit'
              }}
            >
              <span style={{
                width: 36, height: 36, borderRadius: '50%',
                background: '#2F4538', color: 'white', display: 'inline-flex',
                alignItems: 'center', justifyContent: 'center', flexShrink: 0
              }}>
                <BookOpen size={18} />
              </span>
              <span style={{ flex: 1, minWidth: 0 }}>
                <span style={{ display: 'block', fontWeight: 700, fontSize: '15px', color: '#2C2C2C' }}>
                  {g.name || 'Feeding'}&apos;s Feeding Guide
                </span>
                <span style={{ display: 'block', fontSize: '12px', color: '#2C2C2C', opacity: 0.65 }}>
                  Tap to review
                </span>
              </span>
              <ChevronRight size={16} color="#2F4538" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

// ---------------------------------------------------------------------------
// Pet Profile summary card
// ---------------------------------------------------------------------------
const ProfileSection = ({ profile, onEdit }) => {
  if (!profile) {
    return (
      <div style={{
        background: 'linear-gradient(135deg, #F8F6F3 0%, #F5F1EB 100%)',
        borderRadius: '16px', padding: '32px', marginBottom: '32px',
        border: '2px solid #E8E4DC'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px', flexWrap: 'wrap' }}>
          <div>
            <h3 style={{ fontSize: '20px', fontWeight: 700, marginBottom: '8px', color: '#2C2C2C' }}>
              My Pet Profile
            </h3>
            <p style={{ color: '#2C2C2C', fontSize: '14px', opacity: 0.75 }}>
              Create a profile for your dogs to get personalized recommendations
            </p>
          </div>
          <a
            href="/meal-plan"
            style={{
              display: 'inline-flex', alignItems: 'center', gap: '8px',
              background: '#c8102e', color: 'white',
              padding: '12px 20px', borderRadius: '8px',
              textDecoration: 'none', fontSize: '14px', fontWeight: 600
            }}
          >
            <Plus size={18} /> Create Profile
          </a>
        </div>
      </div>
    );
  }

  return (
    <div style={{
      background: 'white', borderRadius: '16px', padding: '24px',
      marginBottom: '32px', boxShadow: '0 2px 12px rgba(0,0,0,0.06)'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
        <h3 style={{ fontSize: '20px', fontWeight: 700, margin: 0, color: '#2C2C2C' }}>
          My Pet Profile
        </h3>
        <button
          onClick={onEdit}
          style={{
            display: 'flex', alignItems: 'center', gap: '6px',
            background: 'none', border: '2px solid #c8102e', color: '#c8102e',
            padding: '8px 16px', borderRadius: '8px', fontSize: '14px',
            fontWeight: 600, cursor: 'pointer'
          }}
        >
          <Edit2 size={16} /> Edit
        </button>
      </div>

      <div style={{ display: 'grid', gap: '12px' }}>
        {profile.dogs.map((dog, index) => (
          <div
            key={dog.dog_id || index}
            style={{
              display: 'flex', alignItems: 'center', gap: '16px',
              padding: '16px', background: '#F8F6F3', borderRadius: '12px'
            }}
          >
            <div style={{
              width: 48, height: 48, borderRadius: '50%',
              background: '#c8102e', display: 'flex', alignItems: 'center',
              justifyContent: 'center', color: 'white', flexShrink: 0
            }}>
              <Dog size={24} />
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontWeight: 600, fontSize: '16px', marginBottom: '4px', color: '#2C2C2C' }}>
                {dog.name}
              </div>
              <div style={{ fontSize: '13px', color: '#2C2C2C', opacity: 0.7 }}>
                {dog.breed} • {dog.weight_lbs} lbs • {dog.lifestyle?.replace('_', ' ')}
              </div>
            </div>
            {dog.health_issues && dog.health_issues.length > 0 && dog.health_issues[0] !== 'none' && (
              <div style={{
                background: '#FFF3E0', color: '#E65100', fontSize: '12px',
                fontWeight: 500, padding: '4px 10px', borderRadius: '12px',
                flexShrink: 0
              }}>
                {dog.health_issues.length} health note{dog.health_issues.length > 1 ? 's' : ''}
              </div>
            )}
          </div>
        ))}
      </div>

      {profile.needs_consultation && (
        <div style={{
          marginTop: '16px', padding: '12px 16px', background: '#FFF3E0',
          borderRadius: '8px', fontSize: '13px', color: '#E65100'
        }}>
          <strong>Note:</strong> A nutrition specialist will contact you about your pets&apos; dietary needs.
        </div>
      )}
    </div>
  );
};

// ---------------------------------------------------------------------------
// Horizontal tab strip — never wraps, scrolls on mobile, right-edge fade.
// ---------------------------------------------------------------------------
const TABS = [
  { id: 'overview',      label: 'Overview'      },
  { id: 'saved_plans',   label: 'Saved Plans'   },
  { id: 'orders',        label: 'Orders'        },
  { id: 'subscriptions', label: 'Subscriptions' },
];

const AccountTabs = ({ active, onChange }) => (
  <div className="account-tabs-wrap" data-testid="account-tabs-wrap">
    <div className="account-tabs" role="tablist">
      {TABS.map(t => (
        <button
          key={t.id}
          role="tab"
          aria-selected={active === t.id}
          data-testid={`account-tab-${t.id}`}
          className={`account-tab ${active === t.id ? 'is-active' : ''}`}
          onClick={() => onChange(t.id)}
        >
          {t.label}
        </button>
      ))}
    </div>
  </div>
);

// ---------------------------------------------------------------------------
export const AccountPage = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuth();
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [ordersLoaded, setOrdersLoaded] = useState(false);
  const [profile, setProfile] = useState(null);
  const [profileLoading, setProfileLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    if (isAuthenticated && !ordersLoaded) {
      orderService.getMyOrders()
        .then(data => { setOrders(data); setOrdersLoaded(true); })
        .catch(err => console.error(err));
    }
  }, [isAuthenticated, ordersLoaded]);

  useEffect(() => {
    const loadProfile = async () => {
      if (isAuthenticated && user?.email) {
        try {
          const response = await axios.get(`${API}/profiles/${encodeURIComponent(user.email)}`);
          setProfile(response.data);
        } catch (err) {
          console.log('No profile found');
        } finally {
          setProfileLoading(false);
        }
      } else {
        setProfileLoading(false);
      }
    };
    loadProfile();
  }, [isAuthenticated, user]);

  const handleAuthSuccess = () => window.location.reload();
  const handleLogout = () => { logout(); window.location.reload(); };
  const handleEditProfile = () => navigate('/meal-plan');

  if (!isAuthenticated) {
    return (
      <>
        <Navbar />
        <div className="content-page">
          <Suspense fallback={<div style={{ padding: '60px', textAlign: 'center' }}>Loading...</div>}>
            <AuthSection onSuccess={handleAuthSuccess} />
          </Suspense>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="content-page">
        <div className="content-container" style={{ maxWidth: '900px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', gap: '12px' }}>
            <div>
              <h1 style={{ marginBottom: '8px' }}>My Account</h1>
              <p style={{ color: '#2C2C2C', opacity: 0.75 }}>Welcome back, {user?.name}!</p>
            </div>
            <button className="btn-secondary" onClick={handleLogout}>Logout</button>
          </div>

          {user?.role === 'admin' && (
            <button className="btn-primary" onClick={() => navigate('/admin')} style={{ marginBottom: '20px' }}>
              Admin Dashboard
            </button>
          )}

          <AccountTabs active={activeTab} onChange={setActiveTab} />

          {activeTab === 'overview' && (
            <div data-testid="tab-panel-overview">
              {!profileLoading && (
                <ProfileSection profile={profile} onEdit={handleEditProfile} />
              )}
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                gap: '16px', marginBottom: '32px'
              }}>
                <a href="/build-box" style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  padding: '20px', background: '#c8102e', color: 'white',
                  borderRadius: '12px', textDecoration: 'none', fontWeight: 600
                }}>
                  Build a Box <ChevronRight size={20} />
                </a>
                <a href="/calculator" style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  padding: '20px', background: '#2F4538', color: 'white',
                  borderRadius: '12px', textDecoration: 'none', fontWeight: 600
                }}>
                  Feeding Calculator <ChevronRight size={20} />
                </a>
              </div>
            </div>
          )}

          {activeTab === 'saved_plans' && (
            <div data-testid="tab-panel-saved_plans">
              <SavedPlansSection profile={profile} navigate={navigate} />
            </div>
          )}

          {activeTab === 'orders' && (
            <div data-testid="tab-panel-orders">
              <Suspense fallback={<div>Loading orders...</div>}>
                <OrdersList orders={orders} onManage={(order) => setSelectedOrder(order)} />
              </Suspense>
            </div>
          )}

          {activeTab === 'subscriptions' && (
            <div data-testid="tab-panel-subscriptions" style={{
              background: 'white', borderRadius: '16px', padding: '24px',
              boxShadow: '0 2px 12px rgba(0,0,0,0.06)'
            }}>
              <h3 style={{ fontSize: '20px', fontWeight: 700, margin: '0 0 12px', color: '#2C2C2C' }}>
                Your Subscriptions
              </h3>
              <p style={{ fontSize: '14px', color: '#2C2C2C', opacity: 0.75, margin: 0 }}>
                Manage active subscriptions from the Orders tab — tap &quot;Manage&quot; on any subscription order.
              </p>
            </div>
          )}
        </div>
      </div>
      {selectedOrder && (
        <Suspense fallback={null}>
          <SubscriptionManager
            order={selectedOrder}
            onClose={() => setSelectedOrder(null)}
            onUpdate={() => { setOrdersLoaded(false); setSelectedOrder(null); }}
          />
        </Suspense>
      )}
      <Footer />
    </>
  );
};
