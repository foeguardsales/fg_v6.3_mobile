import React from 'react';

const StatCard = ({ value, label }) => (
  <div style={{ background: 'white', padding: '24px', borderRadius: '12px', border: '2px solid #E5E7E6' }}>
    <div style={{ fontSize: '32px', fontWeight: '700', color: '#c8102e' }}>{value}</div>
    <div style={{ color: '#666' }}>{label}</div>
  </div>
);

export const StatsCards = ({ orders }) => {
  const stats = {
    total: orders.length,
    pending: orders.filter(o => o.status === 'pending').length,
    confirmed: orders.filter(o => o.status === 'confirmed').length,
    subscriptions: orders.filter(o => o.is_subscription).length
  };

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px', marginBottom: '30px' }}>
      <StatCard value={stats.total} label="Total Orders" />
      <StatCard value={stats.pending} label="Pending" />
      <StatCard value={stats.confirmed} label="Confirmed" />
      <StatCard value={stats.subscriptions} label="Subscriptions" />
    </div>
  );
};