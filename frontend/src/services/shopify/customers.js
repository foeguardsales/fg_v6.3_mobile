/**
 * Customers service — Shopify's official Storefront Customer Auth flow.
 * We never build a custom auth system; tokens are Shopify
 * `customerAccessToken` values.
 */
import http, { customerTokenStorage } from './client';

export async function register({ email, password, firstName, lastName, phone, acceptsMarketing }) {
  const { data } = await http.post('/customers/register', {
    email, password, firstName, lastName, phone, acceptsMarketing,
  });
  return data;
}

export async function login({ email, password }) {
  const { data } = await http.post('/customers/login', { email, password });
  // data = { accessToken, expiresAt }
  if (data?.accessToken) customerTokenStorage.set(data.accessToken);
  return data;
}

export async function logout() {
  const token = customerTokenStorage.get();
  if (!token) return { ok: true };
  try {
    await http.post('/customers/logout', { customerAccessToken: token });
  } finally {
    customerTokenStorage.clear();
  }
  return { ok: true };
}

export async function me() {
  const { data } = await http.get('/customers/me');
  return data;
}

export async function recover(email) {
  const { data } = await http.post('/customers/recover', { email });
  return data;
}

export async function update(customer) {
  const token = customerTokenStorage.get();
  if (!token) throw new Error('Not logged in');
  const { data } = await http.post('/customers/update', {
    customerAccessToken: token,
    customer,
  });
  return data;
}

export const tokenStorage = customerTokenStorage;

const customers = { register, login, logout, me, recover, update, tokenStorage };
export default customers;
