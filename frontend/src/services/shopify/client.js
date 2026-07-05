// Central Shopify HTTP client. ALL Shopify calls in the React app go through
// FastAPI at /api/shopify/*. Frontend NEVER holds Storefront/Admin tokens.

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || '';
const BASE = `${BACKEND_URL}/api/shopify`;

async function shopifyFetch(path, { method = 'GET', body, signal } = {}) {
  const opts = {
    method,
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    signal,
  };
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

export default shopifyClient;
