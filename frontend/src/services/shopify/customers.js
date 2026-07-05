// Uses Shopify's official Customer Authentication (no custom auth system).
import { shopifyClient } from './client';

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
