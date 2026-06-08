import React from 'react';

export const OrdersList = ({ orders, onManage }) => {
  if (!orders || orders.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: '60px 20px' }}>
        <h3 style={{ fontSize: '24px', marginBottom: '16px' }}>No orders yet</h3>
        <p style={{ color: '#666', marginBottom: '30px' }}>Start by building your first box!</p>
        <button className="btn-primary" onClick={() => window.location.href = '/build-box'}>Build Your Box</button>
      </div>
    );
  }

  const renderProteins = (proteins) => {
    if (!proteins || proteins.length === 0) return null;
    return proteins.map((p, i) => (
      <p key={`protein-${i}`} style={{ fontSize: '14px', color: '#555' }}>• {p.product_name} ({p.quantity_lb}lb)</p>
    ));
  };

  const renderOrderCard = (order) => {
    const statusColor = order.status === 'confirmed' ? '#2E7D32' : '#E65100';
    const statusBg = order.status === 'confirmed' ? '#E8F5E9' : '#FFF3E0';
    const subStatusBg = order.subscription_status === 'active' ? '#E8F5E9' : '#FFE0B2';
    const subStatusColor = order.subscription_status === 'active' ? '#2E7D32' : '#E65100';
    
    return (
      <div 
        key={order.order_id} 
        style={{ background: 'white', border: '2px solid #E5E7E6', borderRadius: '12px', padding: '24px', marginBottom: '16px' }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
          <div>
            <strong style={{ fontSize: '18px' }}>Order #{order.order_id.slice(0, 8)}</strong>
            <p style={{ color: '#666', margin: '4px 0' }}>{new Date(order.created_at).toLocaleDateString()}</p>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '20px', fontWeight: '700', color: '#c8102e' }}>${order.total.toFixed(2)}</div>
            <span style={{ display: 'inline-block', padding: '4px 12px', borderRadius: '12px', fontSize: '12px', fontWeight: '600', background: statusBg, color: statusColor }}>
              {order.status}
            </span>
          </div>
        </div>
        <div style={{ paddingTop: '16px', borderTop: '1px solid #E5E7E6' }}>
          <p style={{ color: '#666', marginBottom: '8px' }}>{order.box_size_lb}lb Box</p>
          {renderProteins(order.proteins)}
        </div>
        {order.is_subscription && (
          <div style={{ marginTop: '16px', paddingTop: '16px', borderTop: '1px solid #E5E7E6' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
              <span style={{ fontSize: '14px', fontWeight: '600' }}>Subscription:</span>
              <span style={{ padding: '2px 8px', borderRadius: '8px', fontSize: '12px', background: subStatusBg, color: subStatusColor }}>
                {order.subscription_status}
              </span>
            </div>
            <button className="btn-secondary" style={{ padding: '8px 16px', fontSize: '14px' }} onClick={() => onManage(order)}>
              Manage Subscription
            </button>
          </div>
        )}
      </div>
    );
  };

  return (
    <div style={{ marginTop: '30px' }}>
      <h3 style={{ fontSize: '24px', marginBottom: '20px' }}>Order History</h3>
      {orders.map(renderOrderCard)}
    </div>
  );
};
