// Single import surface for anything Shopify.
// Usage:  import { products, cart, customers } from 'services/shopify';

export * as products from './products';
export * as collections from './collections';
export * as cart from './cart';
export * as customers from './customers';
export * as checkout from './checkout';
export { shopifyClient } from './client';
