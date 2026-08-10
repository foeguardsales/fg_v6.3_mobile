// Custom (site-coded) customer auth → Shopify HEADLESS Storefront customer API,
// proxied by our FastAPI backend at /api/shopify/customers/*.
// The user signs in / signs up on OUR OWN form; only the opaque Storefront
// customerAccessToken is stored in localStorage (via customerTokenStorage).
// There is NO redirect to Shopify's hosted login page.
import { shopifyClient, customerTokenStorage } from './client';

function firstUserError(errs) {
  if (Array.isArray(errs) && errs.length) return errs[0]?.message || 'Something went wrong.';
  return null;
}

// -------- raw (backend-shape) calls ---------------------------------------
export function apiCustomerCreate({ email, password, firstName, lastName, acceptsMarketing = false }) {
  return shopifyClient.post('/customers/create', { email, password, firstName, lastName, acceptsMarketing });
}
export function apiCustomerLogin({ email, password }) {
  return shopifyClient.post('/customers/login', { email, password });
}
export function apiCustomerLogout(accessToken) {
  return shopifyClient.post('/customers/logout', { accessToken });
}
export function apiCustomerRecover(email) {
  return shopifyClient.post('/customers/recover', { email });
}
export function apiCustomerMe(accessToken) {
  return shopifyClient.post('/customers/me', { accessToken });
}
export function apiCustomerUpdate(accessToken, patch) {
  return shopifyClient.post('/customers/update', { accessToken, patch });
}

// -------- friendly wrappers used by ShopifyAuthContext --------------------

/**
 * Sign in with email + password. Backend returns the raw GraphQL payload:
 *   { customerAccessTokenCreate: { customerAccessToken: { accessToken, expiresAt }, customerUserErrors } }
 * On success we persist the token and hydrate the customer via me().
 */
export async function login({ email, password }) {
  const data = await apiCustomerLogin({ email, password });
  const payload = data?.customerAccessTokenCreate || {};
  const err = firstUserError(payload.customerUserErrors);
  if (err) { const e = new Error(err); e.code = 'INVALID_CREDENTIALS'; throw e; }
  const token = payload?.customerAccessToken?.accessToken;
  if (!token) throw new Error('Incorrect email or password.');
  customerTokenStorage.set(token);
  const customer = await me();
  return { token, customer };
}

/**
 * Create an account, then auto sign-in so the user gets a live session token.
 * Backend returns { customerCreate: { customer, customerUserErrors } }.
 */
export async function register({ email, password, firstName, lastName, acceptsMarketing = false }) {
  const data = await apiCustomerCreate({ email, password, firstName, lastName, acceptsMarketing });
  const payload = data?.customerCreate || {};
  const err = firstUserError(payload.customerUserErrors);
  if (err) { const e = new Error(err); e.code = 'CREATE_FAILED'; throw e; }
  return login({ email, password });
}

/** Whoami — returns the customer object or null (clears a dead token). */
export async function me() {
  const token = customerTokenStorage.get();
  if (!token) return null;
  try {
    const customer = await apiCustomerMe(token);
    return customer || null;
  } catch (err) {
    if (err?.status === 401) customerTokenStorage.clear();
    return null;
  }
}

export async function logout() {
  const token = customerTokenStorage.get();
  if (token) { try { await apiCustomerLogout(token); } catch (_) { /* best-effort */ } }
  customerTokenStorage.clear();
  return { ok: true };
}

export async function recover(email) {
  const data = await apiCustomerRecover(email);
  const err = firstUserError(data?.customerRecover?.customerUserErrors);
  if (err) throw new Error(err);
  return { ok: true };
}

export async function updateProfile(patch) {
  const token = customerTokenStorage.get();
  if (!token) { const e = new Error('Not authenticated'); e.status = 401; throw e; }
  const data = await apiCustomerUpdate(token, patch);
  const err = firstUserError(data?.customerUpdate?.customerUserErrors);
  if (err) throw new Error(err);
  return data?.customerUpdate?.customer || null;
}

export const tokenStorage = customerTokenStorage;

const customers = { login, register, me, logout, recover, updateProfile, tokenStorage };
export default customers;
