import { shopifyClient } from './client';

export function listProducts({ first = 24, after, q, sortKey = 'BEST_SELLING', reverse = false } = {}) {
  const params = new URLSearchParams();
  params.set('first', first);
  if (after) params.set('after', after);
  if (q) params.set('q', q);
  if (sortKey) params.set('sort_key', sortKey);
  if (reverse) params.set('reverse', 'true');
  return shopifyClient.get(`/products?${params.toString()}`);
}

export function getProduct(handle) {
  return shopifyClient.get(`/products/${encodeURIComponent(handle)}`);
}

export function getVariant(variantId) {
  // variantId is a Shopify gid://... — URL-encode fully
  return shopifyClient.get(`/variants/${encodeURIComponent(variantId)}`);
}

export function searchProducts(term, first = 24) {
  return listProducts({ first, q: term, sortKey: 'RELEVANCE' });
}
