import React, { useState } from 'react';
import { orderService } from '../../services/api';

const BOX_SIZES = [
  { size: 12, label: '12 lb', price: 'Base price' },
  { size: 18, label: '18 lb', price: '5% off' },
  { size: 24, label: '24 lb', price: '10% off' },
  { size: 30, label: '30 lb', price: '15% off' }
];

export const SubscriptionManager = ({ order, onClose, onUpdate }) => {
  const [loading, setLoading] = useState(false);
  const [showSwap, setShowSwap] = useState(false);
  const [newBoxSize, setNewBoxSize] = useState(order.box_size_lb);

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

  const handleSwapSize = async () => {
    if (newBoxSize === order.box_size_lb) {
      alert('Please select a different box size');
      return;
    }
    setLoading(true);
    try {
      await orderService.manageSubscription(order.order_id, 'swap', { new_box_size: newBoxSize });
      onUpdate();
      onClose();
    } catch (err) {
      alert('Failed to update box size');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="cart-drawer-overlay open" onClick={onClose}>
      <div className="subscription-modal" onClick={e => e.stopPropagation()}>
        <div className="subscription-modal-header">
          <h3>Manage Subscription</h3>
          <button className="cart-close-btn" onClick={onClose}>&times;</button>
        </div>
        
        <div className="subscription-modal-content">
          <div className="subscription-status-badge" data-status={order.subscription_status}>
            {order.subscription_status === 'active' && '● Active'}
            {order.subscription_status === 'paused' && '● Paused'}
            {order.subscription_status === 'cancelled' && '● Cancelled'}
          </div>
          
          <div className="subscription-info-row">
            <span>Current Box Size</span>
            <strong>{order.box_size_lb} lb</strong>
          </div>
          
          <div className="subscription-info-row">
            <span>Frequency</span>
            <strong>{order.subscription_frequency === 'biweekly' ? 'Every 2 Weeks' : 'Monthly'}</strong>
          </div>

          {!showSwap ? (
            <div className="subscription-actions">
              {order.subscription_status === 'active' && (
                <>
                  <button 
                    className="btn-secondary" 
                    onClick={() => setShowSwap(true)} 
                    disabled={loading}
                    style={{ width: '100%' }}
                  >
                    Change Box Size
                  </button>
                  <button 
                    className="btn-secondary" 
                    onClick={() => handleAction('pause')} 
                    disabled={loading}
                    style={{ width: '100%' }}
                  >
                    Pause Subscription
                  </button>
                </>
              )}
              {order.subscription_status === 'paused' && (
                <button 
                  className="btn-primary" 
                  onClick={() => handleAction('resume')} 
                  disabled={loading}
                  style={{ width: '100%' }}
                >
                  Resume Subscription
                </button>
              )}
              <button 
                className="subscription-cancel-btn"
                onClick={() => handleAction('cancel')} 
                disabled={loading || order.subscription_status === 'cancelled'}
              >
                Cancel Subscription
              </button>
            </div>
          ) : (
            <div className="subscription-swap">
              <h4 style={{ marginBottom: '16px', color: '#A41E34' }}>Select New Box Size</h4>
              <div className="swap-options">
                {BOX_SIZES.map(box => (
                  <label 
                    key={box.size}
                    className={`swap-option ${newBoxSize === box.size ? 'selected' : ''} ${box.size === order.box_size_lb ? 'current' : ''}`}
                  >
                    <input
                      type="radio"
                      name="boxSize"
                      value={box.size}
                      checked={newBoxSize === box.size}
                      onChange={() => setNewBoxSize(box.size)}
                    />
                    <span className="swap-size">{box.label}</span>
                    <span className="swap-discount">{box.price}</span>
                    {box.size === order.box_size_lb && <span className="current-badge">Current</span>}
                  </label>
                ))}
              </div>
              <div style={{ display: 'flex', gap: '12px', marginTop: '20px' }}>
                <button 
                  className="btn-secondary" 
                  onClick={() => setShowSwap(false)}
                  style={{ flex: 1 }}
                >
                  Back
                </button>
                <button 
                  className="btn-primary" 
                  onClick={handleSwapSize}
                  disabled={loading || newBoxSize === order.box_size_lb}
                  style={{ flex: 1 }}
                >
                  {loading ? 'Updating...' : 'Confirm Change'}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
