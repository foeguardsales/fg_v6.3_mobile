// Central Shopify HTTP client. ALL Shopify calls in the React app go through
// FastAPI at /api/shopify/*. Frontend NEVER holds Storefront/Admin tokens.

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || '';
const BASE = `${BACKEND_URL}/api/shopify`;

// -------- localStorage helpers (customer token + cart id) -----------------

const CUSTOMER_TOKEN_KEY = 'foeguard.shopifyCustomerToken';
const CART_ID_KEY = 'foeguard.shopifyCartId';

export const customerTokenStorage = {
  get: () => {
    try { return typeof window !== 'undefined' ? window.localStorage.getItem(CUSTOMER_TOKEN_KEY) : null; }
    catch (_) { return null; }
  },
  set: (token) => {
    try { if (typeof window !== 'undefined') window.localStorage.setItem(CUSTOMER_TOKEN_KEY, token); }
    catch (_) { /* ignore */ }
  },
  clear: () => {
    try { if (typeof window !== 'undefined') window.localStorage.removeItem(CUSTOMER_TOKEN_KEY); }
    catch (_) { /* ignore */ }
  },
};

export const cartIdStorage = {
  get: () => {
    try { return typeof window !== 'undefined' ? window.localStorage.getItem(CART_ID_KEY) : null; }
    catch (_) { return null; }
  },
  set: (id) => {
    try { if (typeof window !== 'undefined') window.localStorage.setItem(CART_ID_KEY, id); }
    catch (_) { /* ignore */ }
  },
  clear: () => {
    try { if (typeof window !== 'undefined') window.localStorage.removeItem(CART_ID_KEY); }
    catch (_) { /* ignore */ }
  },
};

// -------- fetch wrapper ---------------------------------------------------

async function shopifyFetch(path, { method = 'GET', body, signal, headers: extraHeaders } = {}) {
  const headers = { 'Content-Type': 'application/json', Accept: 'application/json', ...(extraHeaders || {}) };
  // Attach customer token if available (backend routes that need it read the header OR body)
  try {
    const token = customerTokenStorage.get();
    if (token && !headers['X-Shopify-Customer-Token']) {
      headers['X-Shopify-Customer-Token'] = token;
    }
  } catch (_) { /* ignore */ }

  const opts = { method, headers, signal };
  if (body !== undefined) opts.body = JSON.stringify(body);
  const r = await fetch(`${BASE}${path}`, opts);
  const text = await r.text();
  let data = null;
  try { data = text ? JSON.parse(text) : null; } catch (_) { /* keep null */ }
  if (!r.ok) {
    const err = new Error(data?.detail?.message || data?.detail || r.statusText || 'Shopify request failed');
    err.status = r.status;
    err.body = data;
    throw err;
  }
  return data;
}

export const shopifyClient = {
  get:  (path, opts) => shopifyFetch(path, { ...opts, method: 'GET' }),
  post: (path, body, opts) => shopifyFetch(path, { ...opts, method: 'POST', body }),
};

// Axios-like adapter kept for modules that still call `http.get(path, {params})`
// or `http.post(path, body)`. Returns `{ data }` to mimic axios.
export const http = {
  get: async (path, { params, ...opts } = {}) => {
    let url = path;
    if (params && typeof params === 'object') {
      const qs = new URLSearchParams();
      Object.entries(params).forEach(([k, v]) => {
        if (v !== undefined && v !== null && v !== '') qs.set(k, v);
      });
      const s = qs.toString();
      if (s) url += (url.includes('?') ? '&' : '?') + s;
    }
    const data = await shopifyClient.get(url, opts);
    return { data };
  },
  post: async (path, body, opts) => {
    const data = await shopifyClient.post(path, body, opts);
    return { data };
  },
};

export const SHOPIFY_BASE = BASE;
export default shopifyClient;
