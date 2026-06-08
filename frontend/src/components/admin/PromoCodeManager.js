import React, { useState, useEffect } from 'react';
import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

export const PromoCodeManager = () => {
  const [promos, setPromos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingPromo, setEditingPromo] = useState(null);
  const [formData, setFormData] = useState({
    code: '',
    discount_type: 'percentage',
    discount_value: 0,
    min_order_value: null,
    max_uses: null,
    start_date: '',
    end_date: '',
    is_active: true,
    description: ''
  });

  useEffect(() => {
    loadPromos();
  }, []);

  const loadPromos = async () => {
    try {
      const token = localStorage.getItem('authToken');
      const { data } = await axios.get(`${API}/admin/promos`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setPromos(data);
    } catch (error) {
      console.error('Failed to load promos:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('authToken');
      
      const submitData = {
        ...formData,
        code: formData.code.toUpperCase(),
        discount_value: parseFloat(formData.discount_value),
        min_order_value: formData.min_order_value ? parseFloat(formData.min_order_value) : null,
        max_uses: formData.max_uses ? parseInt(formData.max_uses) : null
      };
      
      if (editingPromo) {
        await axios.put(`${API}/admin/promos/${editingPromo.code}`, submitData, {
          headers: { Authorization: `Bearer ${token}` }
        });
        alert('Promo code updated successfully');
      } else {
        await axios.post(`${API}/admin/promos`, submitData, {
          headers: { Authorization: `Bearer ${token}` }
        });
        alert('Promo code created successfully');
      }
      
      resetForm();
      loadPromos();
    } catch (error) {
      alert('Failed to save promo: ' + (error.response?.data?.detail || error.message));
    }
  };

  const handleDelete = async (code) => {
    if (!window.confirm(`Are you sure you want to delete promo code ${code}?`)) return;
    
    try {
      const token = localStorage.getItem('authToken');
      await axios.delete(`${API}/admin/promos/${code}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert('Promo code deleted successfully');
      loadPromos();
    } catch (error) {
      alert('Failed to delete promo: ' + (error.response?.data?.detail || error.message));
    }
  };

  const handleEdit = (promo) => {
    setEditingPromo(promo);
    setFormData({
      code: promo.code,
      discount_type: promo.discount_type,
      discount_value: promo.discount_value,
      min_order_value: promo.min_order_value || '',
      max_uses: promo.max_uses || '',
      start_date: promo.start_date ? new Date(promo.start_date).toISOString().split('T')[0] : '',
      end_date: promo.end_date ? new Date(promo.end_date).toISOString().split('T')[0] : '',
      is_active: promo.is_active,
      description: promo.description || ''
    });
    setShowForm(true);
  };

  const resetForm = () => {
    setFormData({
      code: '',
      discount_type: 'percentage',
      discount_value: 0,
      min_order_value: null,
      max_uses: null,
      start_date: '',
      end_date: '',
      is_active: true,
      description: ''
    });
    setEditingPromo(null);
    setShowForm(false);
  };

  if (loading) return <div style={{ padding: '20px', textAlign: 'center' }}>Loading promo codes...</div>;

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h2 style={{ fontSize: '24px', color: '#2B2B2B', margin: 0 }}>Promo Code Manager</h2>
        <button
          onClick={() => setShowForm(!showForm)}
          style={{
            padding: '10px 20px',
            background: '#c8102e',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            fontWeight: '600'
          }}
        >
          {showForm ? 'Cancel' : '+ New Promo Code'}
        </button>
      </div>

      {showForm && (
        <div style={{
          background: '#F8F6F4',
          padding: '24px',
          borderRadius: '12px',
          marginBottom: '24px'
        }}>
          <h3 style={{ marginBottom: '20px', fontSize: '18px' }}>
            {editingPromo ? 'Edit Promo Code' : 'Create New Promo Code'}
          </h3>
          <form onSubmit={handleSubmit}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '6px', fontWeight: '600', fontSize: '14px' }}>
                  Code *
                </label>
                <input
                  type="text"
                  required
                  value={formData.code}
                  onChange={(e) => setFormData({...formData, code: e.target.value.toUpperCase()})}
                  disabled={!!editingPromo}
                  placeholder="SAVE20"
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    border: '2px solid #D9C8B3',
                    borderRadius: '8px',
                    fontSize: '15px',
                    textTransform: 'uppercase'
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '6px', fontWeight: '600', fontSize: '14px' }}>
                  Discount Type *
                </label>
                <select
                  required
                  value={formData.discount_type}
                  onChange={(e) => setFormData({...formData, discount_type: e.target.value})}
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    border: '2px solid #D9C8B3',
                    borderRadius: '8px',
                    fontSize: '15px'
                  }}
                >
                  <option value="percentage">Percentage (%)</option>
                  <option value="fixed">Fixed Amount ($)</option>
                </select>
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '6px', fontWeight: '600', fontSize: '14px' }}>
                  Discount Value *
                </label>
                <input
                  type="number"
                  required
                  min="0"
                  step="0.01"
                  value={formData.discount_value}
                  onChange={(e) => setFormData({...formData, discount_value: e.target.value})}
                  placeholder={formData.discount_type === 'percentage' ? '20' : '10.00'}
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
                  Minimum Order Value ($)
                </label>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData.min_order_value}
                  onChange={(e) => setFormData({...formData, min_order_value: e.target.value})}
                  placeholder="50.00"
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
                  Maximum Uses
                </label>
                <input
                  type="number"
                  min="1"
                  value={formData.max_uses}
                  onChange={(e) => setFormData({...formData, max_uses: e.target.value})}
                  placeholder="100"
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
                  Start Date
                </label>
                <input
                  type="date"
                  value={formData.start_date}
                  onChange={(e) => setFormData({...formData, start_date: e.target.value})}
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
                  End Date
                </label>
                <input
                  type="date"
                  value={formData.end_date}
                  onChange={(e) => setFormData({...formData, end_date: e.target.value})}
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
                Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                rows={2}
                placeholder="Internal note about this promo"
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

            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={formData.is_active}
                  onChange={(e) => setFormData({...formData, is_active: e.target.checked})}
                  style={{ width: '18px', height: '18px' }}
                />
                <span style={{ fontWeight: '600' }}>Active</span>
              </label>
            </div>

            <div style={{ display: 'flex', gap: '12px' }}>
              <button
                type="submit"
                style={{
                  padding: '10px 24px',
                  background: '#c8102e',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontWeight: '600'
                }}
              >
                {editingPromo ? 'Update Promo' : 'Create Promo'}
              </button>
              {editingPromo && (
                <button
                  type="button"
                  onClick={resetForm}
                  style={{
                    padding: '10px 24px',
                    background: '#999',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    fontWeight: '600'
                  }}
                >
                  Cancel Edit
                </button>
              )}
            </div>
          </form>
        </div>
      )}

      {/* Promo List */}
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '2px solid #E8DDD0' }}>
              <th style={{ padding: '12px', textAlign: 'left', fontWeight: '600', color: '#666' }}>Code</th>
              <th style={{ padding: '12px', textAlign: 'left', fontWeight: '600', color: '#666' }}>Discount</th>
              <th style={{ padding: '12px', textAlign: 'center', fontWeight: '600', color: '#666' }}>Min Order</th>
              <th style={{ padding: '12px', textAlign: 'center', fontWeight: '600', color: '#666' }}>Uses</th>
              <th style={{ padding: '12px', textAlign: 'center', fontWeight: '600', color: '#666' }}>Valid Until</th>
              <th style={{ padding: '12px', textAlign: 'center', fontWeight: '600', color: '#666' }}>Status</th>
              <th style={{ padding: '12px', textAlign: 'center', fontWeight: '600', color: '#666' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {promos.length === 0 ? (
              <tr>
                <td colSpan={7} style={{ padding: '40px', textAlign: 'center', color: '#999' }}>
                  No promo codes yet
                </td>
              </tr>
            ) : (
              promos.map(promo => (
                <tr key={promo.code} style={{ borderBottom: '1px solid #F0F0F0' }}>
                  <td style={{ padding: '12px', fontWeight: '600', fontFamily: 'monospace' }}>{promo.code}</td>
                  <td style={{ padding: '12px' }}>
                    {promo.discount_type === 'percentage' 
                      ? `${promo.discount_value}%` 
                      : `$${promo.discount_value.toFixed(2)}`}
                  </td>
                  <td style={{ padding: '12px', textAlign: 'center' }}>
                    {promo.min_order_value ? `$${promo.min_order_value.toFixed(2)}` : '-'}
                  </td>
                  <td style={{ padding: '12px', textAlign: 'center' }}>
                    {promo.current_uses || 0}
                    {promo.max_uses ? ` / ${promo.max_uses}` : ''}
                  </td>
                  <td style={{ padding: '12px', textAlign: 'center', fontSize: '14px' }}>
                    {promo.end_date ? new Date(promo.end_date).toLocaleDateString() : 'No expiry'}
                  </td>
                  <td style={{ padding: '12px', textAlign: 'center' }}>
                    <span style={{
                      display: 'inline-block',
                      padding: '4px 12px',
                      background: promo.is_active ? '#E8F5E9' : '#FFEBEE',
                      color: promo.is_active ? '#2E7D32' : '#C62828',
                      borderRadius: '12px',
                      fontSize: '12px',
                      fontWeight: '600'
                    }}>
                      {promo.is_active ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td style={{ padding: '12px', textAlign: 'center' }}>
                    <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
                      <button
                        onClick={() => handleEdit(promo)}
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
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(promo.code)}
                        style={{
                          padding: '6px 12px',
                          background: '#C33',
                          color: 'white',
                          border: 'none',
                          borderRadius: '6px',
                          cursor: 'pointer',
                          fontSize: '13px'
                        }}
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};