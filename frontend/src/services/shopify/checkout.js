/**
 * Checkout service — thin wrapper. In modern Shopify (Cart API) the
 * hosted checkout URL is a field on the cart itself, so this either
 * reads `cart.checkoutUrl` or asks the backend for it.
 */
import http, { cartIdStorage } from './client';

export async function urlFromCart(cartId) {
  const id = cartId || cartIdStorage.get();
  if (!id) throw new Error('No cart id');
  const { data } = await http.post('/checkout/from-cart', { cartId: id });
  return data.checkoutUrl;
}

export function redirect(url) {
  if (!url) throw new Error('No checkout url');
  if (typeof window !== 'undefined') window.location.href = url;
}

const checkout = { urlFromCart, redirect };
export default checkout;
