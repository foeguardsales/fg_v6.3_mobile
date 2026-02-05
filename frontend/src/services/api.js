import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

export const authService = {
  login: async (email, password) => {
    const { data } = await axios.post(`${API}/auth/login`, { email, password });
    localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify(data.user));
    return data;
  },

  register: async (name, email, password) => {
    const { data } = await axios.post(`${API}/auth/register`, { name, email, password });
    localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify(data.user));
    return data;
  },

  logout: () => {
    localStorage.clear();
  },

  getUser: () => {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  },

  getToken: () => localStorage.getItem('token'),

  isAuthenticated: () => !!localStorage.getItem('token')
};

export const orderService = {
  getMyOrders: async () => {
    const token = authService.getToken();
    const { data } = await axios.get(`${API}/orders/my-orders`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return data;
  },

  manageSubscription: async (orderId, action) => {
    const token = authService.getToken();
    const { data } = await axios.post(
      `${API}/subscriptions/${action}`,
      { order_id: orderId },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return data;
  }
};

export const adminService = {
  getAllOrders: async () => {
    const token = authService.getToken();
    const { data } = await axios.get(`${API}/admin/orders`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return data;
  },

  updateOrderStatus: async (orderId, status) => {
    const token = authService.getToken();
    await axios.post(
      `${API}/admin/orders/${orderId}/status`,
      { status },
      { headers: { Authorization: `Bearer ${token}` } }
    );
  }
};