import React from 'react';

const OrderRow = ({ order, onUpdate }) => (
  <tr style={{ borderBottom: '1px solid #E5E7E6' }}>
    <td style={{ padding: '16px', fontFamily: 'monospace', fontSize: '14px' }}>{order.order_id.slice(0, 8)}</td>
    <td style={{ padding: '16px' }}>
      <div style={{ fontWeight: '600' }}>{order.customer_name}</div>
      <div style={{ fontSize: '14px', color: '#666' }}>{order.customer_email}</div>
    </td>
    <td style={{ padding: '16px', fontSize: '14px' }}>{new Date(order.created_at).toLocaleDateString()}</td>
    <td style={{ padding: '16px' }}>{order.box_size_lb}lb</td>
    <td style={{ padding: '16px', fontWeight: '700', color: '#8B4513' }}>${order.total.toFixed(2)}</td>
    <td style={{ padding: '16px' }}>
      {order.is_subscription ? (
        <span style={{ padding: '4px 8px', borderRadius: '8px', fontSize: '12px', fontWeight: '600', background: '#E8F5E9', color: '#2E7D32' }}>Sub</span>
      ) : (
        <span style={{ fontSize: '14px', color: '#666' }}>Once</span>
      )}
    </td>
    <td style={{ padding: '16px' }}>
      <select value={order.status} onChange={(e) => onUpdate(order.order_id, e.target.value)}
        style={{ padding: '6px 12px', borderRadius: '6px', border: '2px solid #E5E7E6', fontSize: '14px', fontWeight: '600',
          background: order.status === 'confirmed' ? '#E8F5E9' : '#FFF3E0',
          color: order.status === 'confirmed' ? '#2E7D32' : '#E65100' }}>
        <option value="pending">Pending</option>
        <option value="confirmed">Confirmed</option>
        <option value="shipped">Shipped</option>
        <option value="delivered">Delivered</option>
      </select>
    </td>
  </tr>
);

export const OrdersTable = ({ orders, onUpdateStatus }) => (
  <div style={{ background: 'white', borderRadius: '12px', overflow: 'hidden', border: '2px solid #E5E7E6' }}>
    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
      <thead>
        <tr style={{ background: '#F8F7F5', borderBottom: '2px solid #E5E7E6' }}>
          <th style={{ padding: '16px', textAlign: 'left', fontWeight: '700' }}>Order ID</th>
          <th style={{ padding: '16px', textAlign: 'left', fontWeight: '700' }}>Customer</th>
          <th style={{ padding: '16px', textAlign: 'left', fontWeight: '700' }}>Date</th>
          <th style={{ padding: '16px', textAlign: 'left', fontWeight: '700' }}>Box</th>
          <th style={{ padding: '16px', textAlign: 'left', fontWeight: '700' }}>Total</th>
          <th style={{ padding: '16px', textAlign: 'left', fontWeight: '700' }}>Type</th>
          <th style={{ padding: '16px', textAlign: 'left', fontWeight: '700' }}>Status</th>
        </tr>
      </thead>
      <tbody>
        {orders.map(order => <OrderRow key={order.order_id} order={order} onUpdate={onUpdateStatus} />)}
      </tbody>
    </table>
  </div>
);