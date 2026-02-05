import React, { useState } from 'react';
import { orderService } from '../../services/api';

export const SubscriptionManager = ({ order, onClose, onUpdate }) => {
  const [loading, setLoading] = useState(false);

  const handleAction = async (action) => {
    setLoading(true);
    try {
      await orderService.manageSubscription(order.order_id, action);
      onUpdate();
      onClose();
    } catch (err) {
      alert('Failed to update subscription');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="cart-overlay" onClick={onClose}>
      <div className="cart-popup" onClick={e => e.stopPropagation()}>
        <h3 style={{ marginBottom: '20px' }}>Manage Subscription</h3>
        <p style={{ marginBottom: '20px', color: '#666' }}>Status: <strong>{order.subscription_status}</strong></p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {order.subscription_status === 'active' && (
            <button className="btn-secondary" onClick={() => handleAction('pause')} disabled={loading}>Pause</button>
          )}
          {order.subscription_status === 'paused' && (
            <button className="btn-primary" onClick={() => handleAction('resume')} disabled={loading}>Resume</button>
          )}
          <button style={{ padding: '12px', background: 'transparent', border: '2px solid #C33', color: '#C33', borderRadius: '8px', cursor: 'pointer', fontWeight: '600' }}
            onClick={() => handleAction('cancel')} disabled={loading}>Cancel</button>
        </div>
      </div>
    </div>
  );
};