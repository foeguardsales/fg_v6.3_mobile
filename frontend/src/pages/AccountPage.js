import React, { useState, useEffect, lazy, Suspense } from 'react';
import { useNavigate } from 'react-router-dom';
import { Navbar, Footer } from '../components/Layout';
import { useAuth } from '../lib/useAuth';
import { orderService } from '../services/api';
import { Dog, Edit2, ChevronRight, Plus } from 'lucide-react';
import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:8001';
const API = `${BACKEND_URL}/api`;

const AuthSection = lazy(() => import('../components/account/AuthSection').then(m => ({ default: m.AuthSection })));
const OrdersList = lazy(() => import('../components/account/OrdersList').then(m => ({ default: m.OrdersList })));
const SubscriptionManager = lazy(() => import('../components/account/SubscriptionManager').then(m => ({ default: m.SubscriptionManager })));

// Profile Section Component
const ProfileSection = ({ profile, onEdit }) => {
  if (!profile) {
    return (
      <div style={{
        background: 'linear-gradient(135deg, #F8F6F3 0%, #F5F1EB 100%)',
        borderRadius: '16px',
        padding: '32px',
        marginBottom: '32px',
        border: '2px solid #E8E4DC'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <h3 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '8px', color: '#2B2B2B' }}>
              My Pet Profile
            </h3>
            <p style={{ color: '#666', fontSize: '14px' }}>
              Create a profile for your dogs to get personalized recommendations
            </p>
          </div>
          <a
            href="/meal-plan"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              background: '#8B4513',
              color: 'white',
              padding: '12px 20px',
              borderRadius: '8px',
              textDecoration: 'none',
              fontSize: '14px',
              fontWeight: '600'
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
      background: 'white',
      borderRadius: '16px',
      padding: '24px',
      marginBottom: '32px',
      boxShadow: '0 2px 12px rgba(0,0,0,0.06)'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
        <h3 style={{ fontSize: '20px', fontWeight: '600', margin: 0, color: '#2B2B2B' }}>
          My Pet Profile
        </h3>
        <button
          onClick={onEdit}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            background: 'none',
            border: '2px solid #8B4513',
            color: '#8B4513',
            padding: '8px 16px',
            borderRadius: '8px',
            fontSize: '14px',
            fontWeight: '600',
            cursor: 'pointer'
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
              display: 'flex',
              alignItems: 'center',
              gap: '16px',
              padding: '16px',
              background: '#F8F6F3',
              borderRadius: '12px'
            }}
          >
            <div style={{
              width: '48px',
              height: '48px',
              borderRadius: '50%',
              background: '#8B4513',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white'
            }}>
              <Dog size={24} />
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: '600', fontSize: '16px', marginBottom: '4px' }}>
                {dog.name}
              </div>
              <div style={{ fontSize: '13px', color: '#666' }}>
                {dog.breed} • {dog.weight_lbs} lbs • {dog.lifestyle?.replace('_', ' ')}
              </div>
            </div>
            {dog.health_issues && dog.health_issues.length > 0 && dog.health_issues[0] !== 'none' && (
              <div style={{
                background: '#FFF3E0',
                color: '#E65100',
                fontSize: '12px',
                fontWeight: '500',
                padding: '4px 10px',
                borderRadius: '12px'
              }}>
                {dog.health_issues.length} health note{dog.health_issues.length > 1 ? 's' : ''}
              </div>
            )}
          </div>
        ))}
      </div>

      {profile.needs_consultation && (
        <div style={{
          marginTop: '16px',
          padding: '12px 16px',
          background: '#FFF3E0',
          borderRadius: '8px',
          fontSize: '13px',
          color: '#E65100'
        }}>
          <strong>Note:</strong> A nutrition specialist will contact you about your pets' dietary needs.
        </div>
      )}
    </div>
  );
};

export const AccountPage = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuth();
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [ordersLoaded, setOrdersLoaded] = useState(false);
  const [profile, setProfile] = useState(null);
  const [profileLoading, setProfileLoading] = useState(true);

  useEffect(() => {
    if (isAuthenticated && !ordersLoaded) {
      orderService.getMyOrders()
        .then(data => { setOrders(data); setOrdersLoaded(true); })
        .catch(err => console.error(err));
    }
  }, [isAuthenticated, ordersLoaded]);

  // Load user profile
  useEffect(() => {
    const loadProfile = async () => {
      if (isAuthenticated && user?.email) {
        try {
          const response = await axios.get(`${API}/profiles/${encodeURIComponent(user.email)}`);
          setProfile(response.data);
        } catch (err) {
          // Profile not found is okay
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

  const handleAuthSuccess = () => {
    window.location.reload();
  };

  const handleLogout = () => {
    logout();
    window.location.reload();
  };

  const handleEditProfile = () => {
    // Navigate to meal plan page with edit mode
    navigate('/meal-plan');
  };

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
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
            <div>
              <h1 style={{ marginBottom: '8px' }}>My Account</h1>
              <p style={{ color: '#666' }}>Welcome back, {user?.name}!</p>
            </div>
            <button className="btn-secondary" onClick={handleLogout}>Logout</button>
          </div>
          
          {user?.role === 'admin' && (
            <button className="btn-primary" onClick={() => navigate('/admin')} style={{ marginBottom: '20px' }}>
              Admin Dashboard
            </button>
          )}

          {/* Pet Profile Section */}
          {!profileLoading && (
            <ProfileSection profile={profile} onEdit={handleEditProfile} />
          )}
          
          {/* Quick Actions */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '16px',
            marginBottom: '32px'
          }}>
            <a
              href="/build-box"
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '20px',
                background: '#8B4513',
                color: 'white',
                borderRadius: '12px',
                textDecoration: 'none',
                fontWeight: '600'
              }}
            >
              Build a Box <ChevronRight size={20} />
            </a>
            <a
              href="/calculator"
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '20px',
                background: '#2F4538',
                color: 'white',
                borderRadius: '12px',
                textDecoration: 'none',
                fontWeight: '600'
              }}
            >
              Feeding Calculator <ChevronRight size={20} />
            </a>
          </div>
          
          <Suspense fallback={<div>Loading orders...</div>}>
            <OrdersList orders={orders} onManage={(order) => setSelectedOrder(order)} />
          </Suspense>
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
