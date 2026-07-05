import { shopifyClient } from './client';

export function listCollections({ first = 20, after } = {}) {
  const params = new URLSearchParams();
  params.set('first', first);
  if (after) params.set('after', after);
  return shopifyClient.get(`/collections?${params.toString()}`);
}

export function getCollection(handle, { productsFirst = 50, productsAfter } = {}) {
  const params = new URLSearchParams();
  params.set('products_first', productsFirst);
  if (productsAfter) params.set('products_after', productsAfter);
  return shopifyClient.get(`/collections/${encodeURIComponent(handle)}?${params.toString()}`);
}
