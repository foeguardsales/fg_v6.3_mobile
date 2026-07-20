import { shopifyClient } from './client';

export function cartCreate({ lines, buyerIdentity, attributes, discountCodes } = {}) {
  return shopifyClient.post('/cart', { lines, buyerIdentity, attributes, discountCodes });
}

export function cartGet(cartId) {
  return shopifyClient.get(`/cart/${encodeURIComponent(cartId)}`);
}

export function cartLinesAdd(cartId, lines) {
  return shopifyClient.post('/cart/lines/add', { cartId, lines });
}

export function cartLinesUpdate(cartId, lines) {
  return shopifyClient.post('/cart/lines/update', { cartId, lines });
}

export function cartLinesRemove(cartId, lineIds) {
  return shopifyClient.post('/cart/lines/remove', { cartId, lineIds });
}

export function cartBuyerUpdate(cartId, buyerIdentity) {
  return shopifyClient.post('/cart/buyer', { cartId, buyerIdentity });
}

export function cartDiscountCodesUpdate(cartId, codes) {
  return shopifyClient.post('/cart/discount', { cartId, codes });
}

export function cartAttributesUpdate(cartId, attributes) {
  return shopifyClient.post('/cart/attributes', { cartId, attributes });
}
