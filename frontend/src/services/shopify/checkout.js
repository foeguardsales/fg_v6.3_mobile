import { shopifyClient } from './client';

export function getCheckoutUrl(cartId) {
  return shopifyClient.get(`/checkout/${encodeURIComponent(cartId)}`);
}

export function associateCheckoutCustomer(cartId, customerAccessToken) {
  return shopifyClient.post('/checkout/associate', { cartId, customerAccessToken });
}
