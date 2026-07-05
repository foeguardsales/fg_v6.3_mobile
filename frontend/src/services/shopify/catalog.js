/**
 * Catalog service — legacy-compatible product/treat/collection fetchers
 * backed by the Shopify Storefront proxy.
 *
 * These functions return data in the SAME SHAPE the pages already
 * consume, so replacing the old Mongo `/api/products` and `/api/treats`
 * calls is a one-line swap on each page.
 *
 *   getAllProducts()      → meal products (dinners + monthly bundles)
 *   getAllTreats()        → treat products (meaty_bone_treats)
 *   getProductByHandle()  → single product (any type)
 *   getTreatByHandle()    → single treat
 *   listCollections()     → all Shopify collections
 *   getCollectionByHandle()
 *
 * A tiny in-memory cache prevents duplicate network calls when several
 * pages mount at once.
 */
import shopify from './index';
import {
  normalizeShopifyProduct,
  normalizeShopifyTreat,
  normalizeShopifyCollection,
} from './normalizer';

const TREAT_LINE = 'meaty_bone_treats';

const _cache = {
  allProducts: null,      // normalized (meals only)
  allTreats: null,        // normalized (treats only)
  byHandle: new Map(),    // handle -> raw shopify node
  collections: null,
  collectionByHandle: new Map(),
  fetchedAllAt: 0,
};

const STALE_MS = 60 * 1000; // 60s

async function _fetchAllRaw() {
  // Paginate through Storefront products (Storefront only returns
  // active + published products; draft/archived never appear).
  const all = [];
  let after = null;
  // hard cap so we can't loop forever
  for (let i = 0; i < 20; i += 1) {
    // eslint-disable-next-line no-await-in-loop
    const page = await shopify.products.list({ first: 100, after });
    (page.nodes || []).forEach((n) => all.push(n));
    const hasNext = page?.pageInfo?.hasNextPage;
    after = page?.pageInfo?.endCursor;
    if (!hasNext || !after) break;
  }
  return all;
}

async function _ensureAllLoaded() {
  const now = Date.now();
  if (_cache.allProducts && (now - _cache.fetchedAllAt) < STALE_MS) return;
  const raw = await _fetchAllRaw();
  raw.forEach((n) => _cache.byHandle.set(n.handle, n));

  const meals = [];
  const treats = [];
  raw.forEach((n) => {
    const p = normalizeShopifyProduct(n);
    if (p.product_line === TREAT_LINE) {
      treats.push(normalizeShopifyTreat(n));
    } else {
      meals.push(p);
    }
  });
  _cache.allProducts = meals;
  _cache.allTreats = treats;
  _cache.fetchedAllAt = now;
}

export async function getAllProducts() {
  await _ensureAllLoaded();
  return _cache.allProducts;
}

export async function getAllTreats() {
  await _ensureAllLoaded();
  return _cache.allTreats;
}

export async function getProductByHandle(handle) {
  if (!handle) return null;
  // Prefer cache from all-products preload (fresh, includes metafields)
  if (_cache.byHandle.has(handle)) {
    return normalizeShopifyProduct(_cache.byHandle.get(handle));
  }
  try {
    const raw = await shopify.products.getByHandle(handle);
    _cache.byHandle.set(handle, raw);
    return normalizeShopifyProduct(raw);
  } catch (err) {
    if (err?.status === 404) return null;
    throw err;
  }
}

export async function getTreatByHandle(handle) {
  if (!handle) return null;
  if (_cache.byHandle.has(handle)) {
    return normalizeShopifyTreat(_cache.byHandle.get(handle));
  }
  try {
    const raw = await shopify.products.getByHandle(handle);
    _cache.byHandle.set(handle, raw);
    return normalizeShopifyTreat(raw);
  } catch (err) {
    if (err?.status === 404) return null;
    throw err;
  }
}

export async function listCollections() {
  if (_cache.collections) return _cache.collections;
  const page = await shopify.collections.list({ first: 100 });
  _cache.collections = (page.nodes || []).map((c) => normalizeShopifyCollection({ ...c, products: { nodes: [] } }));
  return _cache.collections;
}

export async function getCollectionByHandle(handle) {
  if (!handle) return null;
  if (_cache.collectionByHandle.has(handle)) return _cache.collectionByHandle.get(handle);
  try {
    const raw = await shopify.collections.getByHandle(handle, { first: 100 });
    const norm = normalizeShopifyCollection(raw);
    _cache.collectionByHandle.set(handle, norm);
    return norm;
  } catch (err) {
    if (err?.status === 404) return null;
    throw err;
  }
}

// Utility for callers that need to force a refresh (admin, etc.)
export function invalidateCache() {
  _cache.allProducts = null;
  _cache.allTreats = null;
  _cache.byHandle.clear();
  _cache.collections = null;
  _cache.collectionByHandle.clear();
  _cache.fetchedAllAt = 0;
}

const catalog = {
  getAllProducts,
  getAllTreats,
  getProductByHandle,
  getTreatByHandle,
  listCollections,
  getCollectionByHandle,
  invalidateCache,
};
export default catalog;
