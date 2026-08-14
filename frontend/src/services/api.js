import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

// ---------------------------------------------------------------------------
// authService / orderService — backed by Emergent Auth (Google OAuth).
// Sign-in/sign-up redirect to Emergent's hosted Google login; the backend
// holds a 7-day session in an httpOnly cookie. No Shopify hosted login.
// ---------------------------------------------------------------------------

const USER_CACHE = 'foeguard.shopifyUser';

// REMINDER: DO NOT HARDCODE THE URL, OR ADD ANY FALLBACKS OR REDIRECT URLS, THIS BREAKS THE AUTH
const goToEmergentLogin = () => {
  const redirectUrl = window.location.origin + '/account';
  window.location.href = `https://auth.emergentagent.com/?redirect=${encodeURIComponent(redirectUrl)}`;
};

export const authService = {
  // Both sign-in and sign-up happen on Emergent's hosted Google page.
  login: () => { goToEmergentLogin(); },
  register: () => { goToEmergentLogin(); },
  recover: () => { goToEmergentLogin(); },

  logout: async () => {
    try {
      await axios.post(`${API}/auth/logout`, {}, { withCredentials: true });
    } catch (_) { /* ignore */ }
    try { localStorage.removeItem(USER_CACHE); localStorage.removeItem('foeguard.signedIn'); } catch (_) { /* ignore */ }
  },

  refresh: async () => {
    const { data } = await axios.get(`${API}/auth/session`, { withCredentials: true });
    return data?.authenticated ? { user: data.user } : { user: null };
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
