/**
 * Shopify service layer — single entry point.
 *
 * Usage:
 *   import { products, collections, cart, customers, checkout, catalog } from 'services/shopify';
 *   import { customerTokenStorage, cartIdStorage } from 'services/shopify';
 *
 * All calls hit the FastAPI proxy at `${REACT_APP_BACKEND_URL}/api/shopify/*`;
 * the browser never sees the Shopify Admin token.
 */
import * as products from './products';
import * as collections from './collections';
import * as cart from './cart';
import * as checkout from './checkout';
import pages from './pages';
import catalog from './catalog';
import { shopifyClient, http, SHOPIFY_BASE, customerTokenStorage, cartIdStorage } from './client';

export {
  products, collections, cart, checkout, pages, catalog,
  shopifyClient, http, SHOPIFY_BASE, customerTokenStorage, cartIdStorage,
};

export default { products, collections, cart, checkout, pages, catalog };
