/**
 * Shopify service layer — single entry point.
 *
 * Usage:
 *   import { products, collections, cart, customers, checkout } from 'services/shopify';
 *
 * All calls hit the FastAPI proxy at `${REACT_APP_BACKEND_URL}/api/shopify/*`;
 * the browser never sees the Shopify Admin token.
 */
import products from './products';
import collections from './collections';
import cart from './cart';
import customers from './customers';
import checkout from './checkout';
import catalog from './catalog';
import http, { SHOPIFY_BASE, customerTokenStorage, cartIdStorage } from './client';

export { products, collections, cart, customers, checkout, catalog };
export { http, SHOPIFY_BASE, customerTokenStorage, cartIdStorage };

export default { products, collections, cart, customers, checkout, catalog };
