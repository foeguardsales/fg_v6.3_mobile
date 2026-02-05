import React, { useState, useEffect, lazy, Suspense } from 'react';
import { useNavigate } from 'react-router-dom';
import { Navbar, Footer } from '../components/Layout';
import { useAuth } from '../lib/useAuth';
import { orderService } from '../services/api';

const AuthSection = lazy(() => import('../components/account/AuthSection').then(m => ({ default: m.AuthSection })));
const OrdersList = lazy(() => import('../components/account/OrdersList').then(m => ({ default: m.OrdersList })));
const SubscriptionManager = lazy(() => import('../components/account/SubscriptionManager').then(m => ({ default: m.SubscriptionManager })));

export const AccountPage = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuth();
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [ordersLoaded, setOrdersLoaded] = useState(false);

  useEffect(() => {
    if (isAuthenticated && !ordersLoaded) {
      orderService.getMyOrders()
        .then(data => { setOrders(data); setOrdersLoaded(true); })
        .catch(err => console.error(err));
    }
  }, [isAuthenticated, ordersLoaded]);

  const handleAuthSuccess = () => {
    window.location.reload();
  };

  const handleLogout = () => {
    logout();
    window.location.reload();
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
