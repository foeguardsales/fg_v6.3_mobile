/** Shopify Pages service — About, FAQ, Delivery, all static content. */
import { shopifyClient } from './client';

export async function list({ first = 50, after = null } = {}) {
  const qs = new URLSearchParams();
  qs.set('first', first);
  if (after) qs.set('after', after);
  return shopifyClient.get(`/pages?${qs.toString()}`);
}

export async function getByHandle(handle) {
  if (!handle) return null;
  try {
    return await shopifyClient.get(`/page/${encodeURIComponent(handle)}`);
  } catch (err) {
    if (err?.status === 404) return null;
    throw err;
  }
}

const pages = { list, getByHandle };
export default pages;
