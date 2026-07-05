/**
 * Shared axios client for the Shopify service layer.
 *
 * IMPORTANT ARCHITECTURE RULE:
 *   React -> FastAPI -> Shopify.
 *
 * The frontend NEVER talks to Shopify directly. It only calls the FastAPI
 * proxy under `${REACT_APP_BACKEND_URL}/api/shopify/*`. The Admin API token
 * lives on the server. Do not import that token here.
 */
import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
if (!BACKEND_URL) {
  // eslint-disable-next-line no-console
  console.warn('[shopify] REACT_APP_BACKEND_URL is not set');
}

export const SHOPIFY_BASE = `${BACKEND_URL}/api/shopify`;

const shopifyHttp = axios.create({
  baseURL: SHOPIFY_BASE,
  headers: { 'Content-Type': 'application/json' },
  timeout: 25000,
});

// Attach the Shopify customer access token (if the app stored one) so
// authenticated Storefront calls like `/customers/me` work.
shopifyHttp.interceptors.request.use((config) => {
  try {
    const token = typeof window !== 'undefined'
      ? window.localStorage.getItem('foeguard.shopifyCustomerToken')
      : null;
    if (token) {
      config.headers = config.headers || {};
      config.headers['X-Shopify-Customer-Token'] = token;
    }
  } catch (_) { /* localStorage unavailable */ }
  return config;
});

// Normalize errors so callers get `{ status, message, userErrors }`.
shopifyHttp.interceptors.response.use(
  (r) => r,
  (err) => {
    const status = err?.response?.status || 0;
    const data = err?.response?.data || {};
    const detail = data.detail || data;
    const userErrors = detail?.userErrors || [];
    const message = (Array.isArray(userErrors) && userErrors[0]?.message)
      || detail?.message
      || err.message
      || 'Shopify request failed';
    return Promise.reject({ status, message, userErrors, raw: data });
  }
);

export default shopifyHttp;

// Small helpers for callers that want to persist / clear the customer token.
export const customerTokenStorage = {
  get: () => {
    try { return window.localStorage.getItem('foeguard.shopifyCustomerToken'); }
    catch (_) { return null; }
  },
  set: (token) => {
    try { window.localStorage.setItem('foeguard.shopifyCustomerToken', token); }
    catch (_) { /* ignore */ }
  },
  clear: () => {
    try { window.localStorage.removeItem('foeguard.shopifyCustomerToken'); }
    catch (_) { /* ignore */ }
  },
};

// Cart id persistence helpers used by `cart.js`.
export const cartIdStorage = {
  get: () => {
    try { return window.localStorage.getItem('foeguard.shopifyCartId'); }
    catch (_) { return null; }
  },
  set: (id) => {
    try { window.localStorage.setItem('foeguard.shopifyCartId', id); }
    catch (_) { /* ignore */ }
  },
  clear: () => {
    try { window.localStorage.removeItem('foeguard.shopifyCartId'); }
    catch (_) { /* ignore */ }
  },
};
