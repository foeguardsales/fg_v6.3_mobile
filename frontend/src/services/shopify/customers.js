// Uses Shopify's official Customer Authentication (no custom auth system).
import { shopifyClient, customerTokenStorage } from './client';

// -------- raw (backend-shape) calls ---------------------------------------

export function customerCreate({ email, password, firstName, lastName, acceptsMarketing = false }) {
  return shopifyClient.post('/customers/create', { email, password, firstName, lastName, acceptsMarketing });
}

export function customerLogin({ email, password }) {
  return shopifyClient.post('/customers/login', { email, password });
}

export function customerTokenRenew(accessToken) {
  return shopifyClient.post('/customers/token/renew', { accessToken });
}

export function customerLogout(accessToken) {
  return shopifyClient.post('/customers/logout', { accessToken });
}

export function customerRecover(email) {
  return shopifyClient.post('/customers/recover', { email });
}

export function customerReset({ resetUrl, password }) {
  return shopifyClient.post('/customers/reset', { resetUrl, password });
}

export function customerMe(accessToken) {
  return shopifyClient.post('/customers/me', { accessToken });
}

export function customerUpdate(accessToken, patch) {
  return shopifyClient.post('/customers/update', { accessToken, patch });
}

// -------- friendly wrappers used by ShopifyAuthContext / api.js -----------

/**
 * Log in: POST /customers/login → { accessToken, expiresAt }
 * Persists the access token in localStorage so subsequent authed calls work.
 */
export async function login({ email, password }) {
  const data = await customerLogin({ email, password });
  const token = data?.accessToken || data?.customerAccessToken?.accessToken || null;
  if (token) customerTokenStorage.set(token);
  return data;
}

/**
 * Register (Shopify calls it customerCreate). Does NOT auto-login; callers
 * follow up with login() if they need a session.
 */
export async function register({ email, password, firstName, lastName, acceptsMarketing = false }) {
  return customerCreate({ email, password, firstName, lastName, acceptsMarketing });
}

export async function logout() {
  const token = customerTokenStorage.get();
  if (!token) return { ok: true };
  try {
    await customerLogout(token);
  } catch (_) {
    /* best-effort — always clear local token */
  } finally {
    customerTokenStorage.clear();
  }
  return { ok: true };
}

export async function me() {
  const token = customerTokenStorage.get();
  if (!token) {
    const err = new Error('Not authenticated');
    err.status = 401;
    throw err;
  }
  try {
    return await customerMe(token);
  } catch (err) {
    if (err?.status === 401) customerTokenStorage.clear();
    throw err;
  }
}

export async function recover(email) {
  return customerRecover(email);
}

export async function update(patch) {
  const token = customerTokenStorage.get();
  if (!token) {
    const err = new Error('Not authenticated');
    err.status = 401;
    throw err;
  }
  return customerUpdate(token, patch);
}

export const tokenStorage = customerTokenStorage;

const customers = {
  // raw
  customerCreate, customerLogin, customerTokenRenew, customerLogout,
  customerRecover, customerReset, customerMe, customerUpdate,
  // friendly
  login, register, logout, me, recover, update,
  tokenStorage,
};
export default customers;
