import React, { useState, useEffect, lazy, Suspense } from 'react';
import { Navbar, Footer } from '../components/Layout';
import { adminService } from '../services/api';

const OrdersTable = lazy(() => import('../components/admin/OrdersTable').then(m => ({ default: m.OrdersTable })));
const StatsCards = lazy(() => import('../components/admin/StatsCards').then(m => ({ default: m.StatsCards })));

export const AdminPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    adminService.getAllOrders()
      .then(data => setOrders(data))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const handleUpdateStatus = async (orderId, status) => {
    try {
      await adminService.updateOrderStatus(orderId, status);
      const updated = await adminService.getAllOrders();
      setOrders(updated);
    } catch (err) {
      alert('Failed to update order');
    }
  };

  const filteredOrders = orders.filter(o => filter === 'all' || o.status === filter);

  if (loading) return <div style={{ padding: '60px', textAlign: 'center' }}>Loading...</div>;

  return (
    <>
      <Navbar />
      <div className="content-page">
        <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
          <h1 style={{ fontSize: '36px', marginBottom: '30px' }}>Admin Dashboard</h1>

          <Suspense fallback={<div>Loading stats...</div>}>
            <StatsCards orders={orders} />
          </Suspense>

          <div style={{ marginBottom: '20px', display: 'flex', gap: '12px' }}>
            {['all', 'pending', 'confirmed'].map(f => (
              <button key={f} onClick={() => setFilter(f)}
                style={{ padding: '10px 20px', background: filter === f ? '#c8102e' : 'white', 
                  color: filter === f ? 'white' : '#3B2A1A', border: '2px solid #c8102e', 
                  borderRadius: '8px', cursor: 'pointer', fontWeight: '600', textTransform: 'capitalize' }}>
                {f}
              </button>
            ))}
          </div>

          <Suspense fallback={<div>Loading orders...</div>}>
            <OrdersTable orders={filteredOrders} onUpdateStatus={handleUpdateStatus} />
          </Suspense>
        </div>
      </div>
      <Footer />
    </>
  );
};