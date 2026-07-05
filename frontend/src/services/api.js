import axios from 'axios';
import { customers, customerTokenStorage } from './shopify';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

// ---------------------------------------------------------------------------
// Shopify-backed authService & orderService.
// These keep the SAME public shape the existing AuthSection / AccountPage /
// OrdersList / SubscriptionManager components already consume, but every
// call is routed through Shopify's Storefront Customer Auth flow. No custom
// user DB, no legacy Mongo /api/auth/* usage.
// ---------------------------------------------------------------------------

const USER_STORAGE_KEY = 'foeguard.shopifyUser';

function shopifyCustomerToLegacyUser(c) {
  if (!c) return null;
  const fullName = [c.firstName, c.lastName].filter(Boolean).join(' ') || c.displayName || c.email;
  return {
    // preserved shape used by AccountPage / SubscriptionManager
    id: c.id,
    email: c.email,
    name: fullName,
    firstName: c.firstName,
    lastName: c.lastName,
    phone: c.phone,
    role: 'customer',
    shopify: c, // raw for consumers that want richer data
  };
}

function persistUser(user) {
  try {
    if (user) localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user));
    else localStorage.removeItem(USER_STORAGE_KEY);
  } catch (_) { /* ignore */ }
}

async function _refreshAndCache() {
  try {
    const me = await customers.me();
    const user = shopifyCustomerToLegacyUser(me);
    persistUser(user);
    return { token: customerTokenStorage.get(), user, shopifyCustomer: me };
  } catch (err) {
    customerTokenStorage.clear();
    persistUser(null);
    throw err;
  }
}

export const authService = {
  login: async (email, password) => {
    // Shopify returns { accessToken, expiresAt }; token is persisted by the
    // customers.login helper. Follow up with /customers/me to populate user.
    await customers.login({ email, password });
    return _refreshAndCache();
  },

  register: async (name, email, password) => {
    // Split "First Last" -> firstName/lastName; single-word names go to firstName.
    const parts = (name || '').trim().split(/\s+/);
    const firstName = parts.shift() || null;
    const lastName = parts.length ? parts.join(' ') : null;
    await customers.register({ email, password, firstName, lastName });
    // Shopify's customerCreate does NOT return an access token; log in.
    await customers.login({ email, password });
    return _refreshAndCache();
  },

  recover: async (email) => customers.recover(email),

  logout: async () => {
    try { await customers.logout(); } catch (_) { /* best-effort */ }
    customerTokenStorage.clear();
    persistUser(null);
  },

  refresh: _refreshAndCache,

  getUser: () => {
    try {
      const raw = localStorage.getItem(USER_STORAGE_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch (_) { return null; }
  },

  getToken: () => customerTokenStorage.get(),
  isAuthenticated: () => !!customerTokenStorage.get(),
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
  const total = priceToNumber(o.totalPrice || o.currentTotalPrice);
  const status = (o.financialStatus || '').toLowerCase() || 'confirmed';
  const items = (o.lineItems?.nodes || []).map((li) => ({
    product_id: li.variant?.product?.handle || li.title,
    product_name: li.title,
    quantity_lb: li.quantity, // legacy field name; we surface qty here
    quantity: li.quantity,
    price: priceToNumber(li.variant?.price),
    image: li.variant?.image?.url || null,
    handle: li.variant?.product?.handle,
  }));
  return {
    order_id: (o.orderNumber && String(o.orderNumber)) || o.id,
    order_number: o.orderNumber,
    order_name: o.name,
    created_at: o.processedAt,
    status,
    fulfillment_status: (o.fulfillmentStatus || '').toLowerCase() || null,
    total,
    subtotal: priceToNumber(o.subtotalPrice),
    shipping: priceToNumber(o.totalShippingPrice),
    tax: priceToNumber(o.totalTax),
    currency: (o.totalPrice?.currencyCode) || 'CAD',
    status_url: o.statusUrl || null,
    shipping_address: o.shippingAddress || null,
    box_size_lb: items.reduce((s, i) => s + (i.quantity || 0), 0), // approximate
    proteins: items,
    line_items: items,
    is_subscription: false, // Shopify Storefront doesn't expose sub info
    subscription_status: null,
  };
}

export const orderService = {
  getMyOrders: async () => {
    const me = await customers.me();
    return (me?.orders?.nodes || []).map(shopifyOrderToLegacyOrder);
  },

  // The Storefront API doesn't expose subscription controls; keep the
  // interface so existing UI compiles but no-op the calls gracefully.
  manageSubscription: async () => {
    throw new Error('Subscription management is not available via Shopify Storefront. Please contact support.');
  },
};

// ---------- admin (unchanged legacy path) ---------------------------------

export const adminService = {
  getAllOrders: async () => {
    const token = localStorage.getItem('token');
    const { data } = await axios.get(`${API}/admin/orders`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return data;
  },
  updateOrderStatus: async (orderId, status) => {
    const token = localStorage.getItem('token');
    await axios.post(
      `${API}/admin/orders/${orderId}/status`,
      { status },
      { headers: { Authorization: `Bearer ${token}` } },
    );
  },
};
