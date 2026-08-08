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
import { listProducts, getProduct } from './products';
import { listCollections as apiListCollections, getCollection } from './collections';
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

/* -------------------------------------------------------------------------
 * DESIGN-SAFE FALLBACK (Prompt 3)
 * When the Shopify Storefront is not yet configured (or returns an error /
 * empty set), transparently fall back to the local backend catalog which
 * returns data in the SAME shape the pages already consume. This guarantees
 * the site stays fully functional both BEFORE and AFTER Shopify is connected,
 * and never alters any page design — it only swaps the data source.
 * ----------------------------------------------------------------------- */
const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const LOCAL_API = `${BACKEND_URL}/api`;

// Once a Shopify call fails for a non-404 reason we assume it's unconfigured
// for this session and skip straight to local data (keeps the UI snappy).
let _shopifyDown = false;
const _local = { meals: null, treats: null };

function _noteShopifyFailure(where, err) {
  if (err?.status === 404) return; // genuine not-found — not a config problem
  if (!_shopifyDown) {
    console.info(`[catalog] Shopify unavailable at ${where} — using local catalog fallback.`);
  }
  _shopifyDown = true;
}

async function _getLocalJSON(path) {
  const res = await fetch(`${LOCAL_API}${path}`);
  if (!res.ok) {
    const e = new Error(`HTTP ${res.status}`);
    e.status = res.status;
    throw e;
  }
  return res.json();
}

async function _localMeals() {
  if (_local.meals) return _local.meals;
  try {
    const data = await _getLocalJSON('/products');
    _local.meals = Array.isArray(data) ? data : [];
  } catch (_) { _local.meals = []; }
  return _local.meals;
}

async function _localTreats() {
  if (_local.treats) return _local.treats;
  try {
    const data = await _getLocalJSON('/treats');
    _local.treats = Array.isArray(data) ? data : [];
  } catch (_) { _local.treats = []; }
  return _local.treats;
}

async function _fetchAllRaw() {
  // Paginate through Storefront products (Storefront only returns
  // active + published products; draft/archived never appear).
  const all = [];
  let after = null;
  // hard cap so we can't loop forever
  for (let i = 0; i < 20; i += 1) {
    // eslint-disable-next-line no-await-in-loop
    const page = await listProducts({ first: 100, after });
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
  if (!_shopifyDown) {
    try {
      await _ensureAllLoaded();
      if (_cache.allProducts && _cache.allProducts.length) return _cache.allProducts;
    } catch (err) { _noteShopifyFailure('getAllProducts', err); }
  }
  return _localMeals();
}

export async function getAllTreats() {
  if (!_shopifyDown) {
    try {
      await _ensureAllLoaded();
      if (_cache.allTreats && _cache.allTreats.length) return _cache.allTreats;
    } catch (err) { _noteShopifyFailure('getAllTreats', err); }
  }
  return _localTreats();
}

export async function getProductByHandle(handle) {
  if (!handle) return null;
  if (!_shopifyDown) {
    // Prefer cache from all-products preload (fresh, includes metafields)
    if (_cache.byHandle.has(handle)) {
      return normalizeShopifyProduct(_cache.byHandle.get(handle));
    }
    try {
      const raw = await getProduct(handle);
      _cache.byHandle.set(handle, raw);
      return normalizeShopifyProduct(raw);
    } catch (err) {
      // 404 = handle isn't a Shopify handle. Not a hard error — many product
      // pages are linked using the legacy Mongo product_id (e.g. `cd-chicken`)
      // and we need to fall through to the local catalog to render them.
      if (err?.status !== 404) {
        _noteShopifyFailure('getProductByHandle', err);
      }
    }
  }
  // Local fallback (same shape as normalized Shopify product). Tries the
  // Mongo /products/{id} endpoint first, then the preloaded all-products list.
  let local = null;
  try {
    local = await _getLocalJSON(`/products/${handle}`);
  } catch (_) {
    const meals = await _localMeals();
    local = meals.find((m) => m.product_id === handle || m.handle === handle) || null;
  }
  // GLOBAL Shopify bridge: many product pages are opened with a legacy Mongo id
  // (e.g. `cd-chicken`) which 404s on Shopify. Resolve the live Shopify twin by
  // product_line + protein_type so EVERY product (not just monthly bundles)
  // shows Shopify-managed content (ingredients, reviews, scores, etc.).
  if (local && !_shopifyDown && local.product_line && local.product_line !== 'monthly_bundles') {
    try {
      const all = await getAllProducts();
      const twin = (all || []).find((sp) =>
        sp.product_line === local.product_line &&
        sp.protein_type === local.protein_type);
      if (twin && twin.handle) {
        // Upgrade to the FULL query (variants/images) for the twin handle.
        try {
          const rawFull = await getProduct(twin.handle);
          _cache.byHandle.set(twin.handle, rawFull);
          return normalizeShopifyProduct(rawFull);
        } catch (_) { return twin; }
      }
    } catch (_) { /* keep local */ }
  }
  return local;
}

export async function getTreatByHandle(handle) {
  if (!handle) return null;
  if (!_shopifyDown) {
    if (_cache.byHandle.has(handle)) {
      return normalizeShopifyTreat(_cache.byHandle.get(handle));
    }
    try {
      const raw = await getProduct(handle);
      _cache.byHandle.set(handle, raw);
      return normalizeShopifyTreat(raw);
    } catch (err) {
      // 404 = handle isn't a Shopify treat handle. Fall through to Mongo so
      // legacy `/treat/:treat_id` URLs still work.
      if (err?.status !== 404) {
        _noteShopifyFailure('getTreatByHandle', err);
      }
    }
  }
  const treats = await _localTreats();
  return treats.find((t) => t.treat_id === handle || t.handle === handle) || null;
}

export async function listCollections() {
  if (_cache.collections) return _cache.collections;
  if (!_shopifyDown) {
    try {
      const page = await apiListCollections({ first: 100 });
      _cache.collections = (page.nodes || []).map((c) => normalizeShopifyCollection({ ...c, products: { nodes: [] } }));
      return _cache.collections;
    } catch (err) { _noteShopifyFailure('listCollections', err); }
  }
  // No local collections catalog — return empty so callers render gracefully.
  return [];
}

export async function getCollectionByHandle(handle) {
  if (!handle) return null;
  if (_cache.collectionByHandle.has(handle)) return _cache.collectionByHandle.get(handle);
  if (!_shopifyDown) {
    try {
      const raw = await getCollection(handle, { productsFirst: 100 });
      const norm = normalizeShopifyCollection(raw);
      _cache.collectionByHandle.set(handle, norm);
      return norm;
    } catch (err) {
      if (err?.status === 404) return null;
      _noteShopifyFailure('getCollectionByHandle', err);
    }
  }
  // Design-safe: unknown collection when Shopify is unavailable -> null (page handles it).
  return null;
}

// Utility for callers that need to force a refresh (admin, etc.)
export function invalidateCache() {
  _cache.allProducts = null;
  _cache.allTreats = null;
  _cache.byHandle.clear();
  _cache.collections = null;
  _cache.collectionByHandle.clear();
  _cache.fetchedAllAt = 0;
  _local.meals = null;
  _local.treats = null;
  _shopifyDown = false;
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
