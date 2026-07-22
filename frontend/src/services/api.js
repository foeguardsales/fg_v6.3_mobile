import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

// ---------------------------------------------------------------------------
// authService / orderService — backed by Shopify's Customer Account API
// (OAuth/OIDC). Authentication is a redirect to Shopify's hosted login; the
// backend holds the tokens in a server-side session (httpOnly cookie). There
// is NO custom user DB and NO legacy Mongo /api/auth/* usage for customers.
// ---------------------------------------------------------------------------

const USER_CACHE = 'foeguard.shopifyUser';

export const authService = {
  // Both sign-in and sign-up happen on Shopify's hosted page.
  login: () => { window.location.href = `${API}/customer-auth/login`; },
  register: () => { window.location.href = `${API}/customer-auth/login`; },
  recover: () => { window.location.href = `${API}/customer-auth/login`; },

  logout: async () => {
    let logoutUrl = null;
    try {
      const { data } = await axios.post(`${API}/customer-auth/logout`, {}, { withCredentials: true });
      logoutUrl = data?.logout_url || null;
    } catch (_) { /* ignore */ }
    try { localStorage.removeItem(USER_CACHE); localStorage.removeItem('foeguard.signedIn'); } catch (_) {}
    if (logoutUrl) window.location.href = logoutUrl;
  },

  refresh: async () => {
    const { data } = await axios.get(`${API}/customer-auth/session`, { withCredentials: true });
    return data?.authenticated ? { user: data.customer } : { user: null };
  },

  getUser: () => {
    try {
      const raw = localStorage.getItem(USER_CACHE);
      return raw ? JSON.parse(raw) : null;
    } catch (_) { return null; }
  },

  isAuthenticated: () => {
    try { return !!localStorage.getItem('foeguard.signedIn'); } catch (_) { return false; }
  },
};

// ---------- orders --------------------------------------------------------

function priceToNumber(p) {
  if (!p) return 0;
  if (typeof p === 'number') return p;
  if (typeof p === 'string') return parseFloat(p) || 0;
  return parseFloat(p.amount || '0') || 0;
}

function shopifyOrderToLegacyOrder(o) {
  if (!o) return null;
  const items = (o.lineItems?.nodes || []).map((li) => ({
    product_name: li.title,
    quantity: li.quantity,
    quantity_lb: li.quantity,
  }));
  return {
    order_id: o.name || o.id,
    order_number: o.name,
    order_name: o.name,
    created_at: o.processedAt,
    status: 'confirmed',
    total: priceToNumber(o.totalPrice),
    currency: o.totalPrice?.currencyCode || 'CAD',
    proteins: items,
    line_items: items,
    is_subscription: false,
    subscription_status: null,
  };
}

export const orderService = {
  getMyOrders: async () => {
    try {
      const { data } = await axios.get(`${API}/customer-auth/orders`, { withCredentials: true });
      return (data?.orders || []).map(shopifyOrderToLegacyOrder);
    } catch (_) {
      return [];
    }
  },

  manageSubscription: async () => {
    throw new Error('Subscription management is available from your Shopify account. Please contact support.');
  },
};

// ---------- admin (unchanged legacy Mongo/JWT path) -----------------------

export const adminService = {
  getAllOrders: async () => {
    const token = localStorage.getItem('token') || localStorage.getItem('authToken');
    const { data } = await axios.get(`${API}/admin/orders`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return data;
  },
  updateOrderStatus: async (orderId, status) => {
    const token = localStorage.getItem('token') || localStorage.getItem('authToken');
    await axios.post(
      `${API}/admin/orders/${orderId}/status`,
      { status },
      { headers: { Authorization: `Bearer ${token}` } },
    );
  },
};
