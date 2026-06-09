import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Navbar, Footer } from '../components/Layout';
import { CustomerDatabase } from '../components/admin/CustomerDatabase';
import { BlogManager } from '../components/admin/BlogManager';
import { SEOManager } from '../components/admin/SEOManager';
import { PromoCodeManager } from '../components/admin/PromoCodeManager';
import { OrdersTable } from '../components/admin/OrdersTable';
import { StatsCards } from '../components/admin/StatsCards';
import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

export const AdminDashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    // Check if user is authenticated as admin
    const token = localStorage.getItem('authToken');
    const userRole = localStorage.getItem('userRole');
    
    if (!token || userRole !== 'admin') {
      navigate('/admin/login');
      return;
    }

    loadOrders();
  }, [navigate]);

  const loadOrders = async () => {
    try {
      const token = localStorage.getItem('authToken');
      const { data } = await axios.get(`${API}/admin/orders`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setOrders(data);
    } catch (error) {
      console.error('Failed to load orders:', error);
      if (error.response?.status === 401 || error.response?.status === 403) {
        navigate('/admin/login');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (orderId, status) => {
    try {
      const token = localStorage.getItem('authToken');
      await axios.put(`${API}/admin/orders/${orderId}/status`, 
        { status },
        { headers: { Authorization: `Bearer ${token}` }}
      );
      loadOrders();
    } catch (err) {
      alert('Failed to update order');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userRole');
    navigate('/admin/login');
  };

  const filteredOrders = orders.filter(o => filter === 'all' || o.status === filter);

  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: '📊' },
    { id: 'customers', label: 'Customers', icon: '👥' },
    { id: 'blogs', label: 'Blogs', icon: '📝' },
    { id: 'seo', label: 'SEO', icon: '🔍' },
    { id: 'promos', label: 'Promo Codes', icon: '🎫' }
  ];

  if (loading) return <div style={{ padding: '60px', textAlign: 'center' }}>Loading...</div>;

  return (
    <>
      <Navbar />
      <div className="content-page" style={{ background: '#F8F6F4', minHeight: '100vh' }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '40px 20px' }}>
          {/* Header */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
            <h1 style={{ fontSize: '36px', fontFamily: "'Oswald', sans-serif", color: '#2B2B2B' }}>
              Admin Dashboard
            </h1>
            <button
              onClick={handleLogout}
              style={{
                padding: '10px 20px',
                background: '#A41E34',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                fontWeight: '600'
              }}
            >
              Logout
            </button>
          </div>

          {/* Tabs */}
          <div style={{ 
            display: 'flex', 
            gap: '10px', 
            marginBottom: '30px',
            borderBottom: '2px solid #E8DDD0',
            overflowX: 'auto'
          }}>
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                style={{
                  padding: '12px 24px',
                  background: activeTab === tab.id ? '#c8102e' : 'transparent',
                  color: activeTab === tab.id ? 'white' : '#666',
                  border: 'none',
                  borderRadius: '8px 8px 0 0',
                  cursor: 'pointer',
                  fontWeight: '600',
                  fontSize: '15px',
                  transition: 'all 0.2s',
                  whiteSpace: 'nowrap'
                }}
              >
                <span style={{ marginRight: '8px' }}>{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div style={{ background: 'white', borderRadius: '12px', padding: '30px', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
            {activeTab === 'dashboard' && (
              <>
                <StatsCards orders={orders} />
                
                <div style={{ marginTop: '30px', marginBottom: '20px', display: 'flex', gap: '12px' }}>
                  {['all', 'pending', 'confirmed'].map(f => (
                    <button 
                      key={f} 
                      onClick={() => setFilter(f)}
                      style={{ 
                        padding: '10px 20px', 
                        background: filter === f ? '#c8102e' : 'white', 
                        color: filter === f ? 'white' : '#2C2C2C', 
                        border: '2px solid #c8102e', 
                        borderRadius: '8px', 
                        cursor: 'pointer', 
                        fontWeight: '600', 
                        textTransform: 'capitalize' 
                      }}
                    >
                      {f}
                    </button>
                  ))}
                </div>

                <OrdersTable orders={filteredOrders} onUpdateStatus={handleUpdateStatus} />
              </>
            )}
            
            {activeTab === 'customers' && <CustomerDatabase />}
            {activeTab === 'blogs' && <BlogManager />}
            {activeTab === 'seo' && <SEOManager />}
            {activeTab === 'promos' && <PromoCodeManager />}
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};
