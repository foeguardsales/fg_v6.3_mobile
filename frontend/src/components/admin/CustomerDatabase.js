import React, { useState, useEffect } from 'react';
import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

export const CustomerDatabase = () => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [customerOrders, setCustomerOrders] = useState([]);
  const [newCustomer, setNewCustomer] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    notes: ''
  });

  useEffect(() => {
    loadCustomers();
  }, []);

  const loadCustomers = async () => {
    try {
      const token = localStorage.getItem('authToken');
      const { data } = await axios.get(`${API}/admin/customers`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setCustomers(data);
    } catch (error) {
      console.error('Failed to load customers:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadCustomerOrders = async (email) => {
    try {
      const token = localStorage.getItem('authToken');
      const { data } = await axios.get(`${API}/admin/customers/${email}/orders`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setCustomerOrders(data);
    } catch (error) {
      console.error('Failed to load customer orders:', error);
    }
  };

  const handleAddCustomer = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('authToken');
      await axios.post(`${API}/admin/customers`, newCustomer, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setNewCustomer({ name: '', email: '', phone: '', address: '', notes: '' });
      setShowAddForm(false);
      loadCustomers();
      alert('Customer added successfully');
    } catch (error) {
      alert('Failed to add customer: ' + (error.response?.data?.detail || error.message));
    }
  };

  const handleViewOrders = (customer) => {
    setSelectedCustomer(customer);
    loadCustomerOrders(customer.email);
  };

  if (loading) return <div style={{ padding: '20px', textAlign: 'center' }}>Loading customers...</div>;

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h2 style={{ fontSize: '24px', color: '#2B2B2B', margin: 0 }}>Customer Database</h2>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          style={{
            padding: '10px 20px',
            background: '#8B4513',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            fontWeight: '600'
          }}
        >
          {showAddForm ? 'Cancel' : '+ Add Customer'}
        </button>
      </div>

      {showAddForm && (
        <div style={{
          background: '#F8F6F4',
          padding: '24px',
          borderRadius: '12px',
          marginBottom: '24px'
        }}>
          <h3 style={{ marginBottom: '20px', fontSize: '18px' }}>Add New Customer</h3>
          <form onSubmit={handleAddCustomer}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '6px', fontWeight: '600', fontSize: '14px' }}>
                  Name *
                </label>
                <input
                  type="text"
                  required
                  value={newCustomer.name}
                  onChange={(e) => setNewCustomer({...newCustomer, name: e.target.value})}
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    border: '2px solid #D9C8B3',
                    borderRadius: '8px',
                    fontSize: '15px'
                  }}
                />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '6px', fontWeight: '600', fontSize: '14px' }}>
                  Email *
                </label>
                <input
                  type="email"
                  required
                  value={newCustomer.email}
                  onChange={(e) => setNewCustomer({...newCustomer, email: e.target.value})}
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    border: '2px solid #D9C8B3',
                    borderRadius: '8px',
                    fontSize: '15px'
                  }}
                />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '6px', fontWeight: '600', fontSize: '14px' }}>
                  Phone
                </label>
                <input
                  type="tel"
                  value={newCustomer.phone}
                  onChange={(e) => setNewCustomer({...newCustomer, phone: e.target.value})}
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    border: '2px solid #D9C8B3',
                    borderRadius: '8px',
                    fontSize: '15px'
                  }}
                />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '6px', fontWeight: '600', fontSize: '14px' }}>
                  Address
                </label>
                <input
                  type="text"
                  value={newCustomer.address}
                  onChange={(e) => setNewCustomer({...newCustomer, address: e.target.value})}
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    border: '2px solid #D9C8B3',
                    borderRadius: '8px',
                    fontSize: '15px'
                  }}
                />
              </div>
            </div>
            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', marginBottom: '6px', fontWeight: '600', fontSize: '14px' }}>
                Notes
              </label>
              <textarea
                value={newCustomer.notes}
                onChange={(e) => setNewCustomer({...newCustomer, notes: e.target.value})}
                rows={3}
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  border: '2px solid #D9C8B3',
                  borderRadius: '8px',
                  fontSize: '15px',
                  fontFamily: 'inherit',
                  resize: 'vertical'
                }}
              />
            </div>
            <button
              type="submit"
              style={{
                padding: '10px 24px',
                background: '#8B4513',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                fontWeight: '600'
              }}
            >
              Add Customer
            </button>
          </form>
        </div>
      )}

      {/* Customer List Table */}
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '2px solid #E8DDD0' }}>
              <th style={{ padding: '12px', textAlign: 'left', fontWeight: '600', color: '#666' }}>Name</th>
              <th style={{ padding: '12px', textAlign: 'left', fontWeight: '600', color: '#666' }}>Email</th>
              <th style={{ padding: '12px', textAlign: 'left', fontWeight: '600', color: '#666' }}>Phone</th>
              <th style={{ padding: '12px', textAlign: 'center', fontWeight: '600', color: '#666' }}>Total Orders</th>
              <th style={{ padding: '12px', textAlign: 'right', fontWeight: '600', color: '#666' }}>Total Spent</th>
              <th style={{ padding: '12px', textAlign: 'center', fontWeight: '600', color: '#666' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {customers.length === 0 ? (
              <tr>
                <td colSpan={6} style={{ padding: '40px', textAlign: 'center', color: '#999' }}>
                  No customers yet
                </td>
              </tr>
            ) : (
              customers.map(customer => (
                <tr key={customer.customer_id || customer.email} style={{ borderBottom: '1px solid #F0F0F0' }}>
                  <td style={{ padding: '12px' }}>{customer.name}</td>
                  <td style={{ padding: '12px', color: '#666', fontSize: '14px' }}>{customer.email}</td>
                  <td style={{ padding: '12px', color: '#666', fontSize: '14px' }}>{customer.phone || '-'}</td>
                  <td style={{ padding: '12px', textAlign: 'center', fontWeight: '600' }}>{customer.total_orders}</td>
                  <td style={{ padding: '12px', textAlign: 'right', fontWeight: '600', color: '#8B4513' }}>
                    ${customer.total_spent.toFixed(2)}
                  </td>
                  <td style={{ padding: '12px', textAlign: 'center' }}>
                    <button
                      onClick={() => handleViewOrders(customer)}
                      style={{
                        padding: '6px 12px',
                        background: '#556B2F',
                        color: 'white',
                        border: 'none',
                        borderRadius: '6px',
                        cursor: 'pointer',
                        fontSize: '13px'
                      }}
                    >
                      View Orders
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Order History Modal */}
      {selectedCustomer && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0,0,0,0.6)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          padding: '20px'
        }} onClick={() => setSelectedCustomer(null)}>
          <div style={{
            background: 'white',
            borderRadius: '12px',
            padding: '30px',
            maxWidth: '800px',
            width: '100%',
            maxHeight: '80vh',
            overflowY: 'auto'
          }} onClick={(e) => e.stopPropagation()}>
            <h3 style={{ marginBottom: '20px', fontSize: '20px' }}>
              Order History - {selectedCustomer.name}
            </h3>
            {customerOrders.length === 0 ? (
              <p style={{ color: '#999', textAlign: 'center', padding: '20px' }}>No orders found</p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {customerOrders.map(order => (
                  <div key={order.order_id} style={{
                    padding: '16px',
                    border: '1px solid #E8DDD0',
                    borderRadius: '8px'
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                      <div>
                        <strong>Order #{order.order_id.slice(0, 8)}</strong>
                        <p style={{ color: '#666', fontSize: '14px', margin: '4px 0' }}>
                          {new Date(order.created_at).toLocaleDateString()}
                        </p>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <div style={{ fontSize: '18px', fontWeight: '600', color: '#8B4513' }}>
                          ${order.total.toFixed(2)}
                        </div>
                        <div style={{
                          display: 'inline-block',
                          padding: '4px 12px',
                          background: order.status === 'confirmed' ? '#E8F5E9' : '#FFF9E6',
                          color: order.status === 'confirmed' ? '#2E7D32' : '#F57C00',
                          borderRadius: '12px',
                          fontSize: '12px',
                          fontWeight: '600',
                          marginTop: '4px'
                        }}>
                          {order.status}
                        </div>
                      </div>
                    </div>
                    <div style={{ fontSize: '14px', color: '#666' }}>
                      {order.box_size_lb}lb Box - {order.proteins.length} proteins
                    </div>
                  </div>
                ))}
              </div>
            )}
            <button
              onClick={() => setSelectedCustomer(null)}
              style={{
                marginTop: '20px',
                padding: '10px 20px',
                background: '#8B4513',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                fontWeight: '600',
                width: '100%'
              }}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
