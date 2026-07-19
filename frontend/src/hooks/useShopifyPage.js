/**
 * useShopifyPage(handle) — loads a Shopify Page by handle and returns
 * `{ page, loading, error }`. Returns `page === null` when the merchant
 * hasn't created the page yet, letting each React screen keep its
 * hardcoded fallback content visible.
 */
import { useEffect, useState } from 'react';
import pages from '../services/shopify/pages';

// Session-level cache so pages don't refetch when the user navigates back.
const _cache = new Map();

export function useShopifyPage(handle) {
  const [state, setState] = useState({
    page: _cache.get(handle) || null,
    loading: !_cache.has(handle),
    error: null,
  });

  useEffect(() => {
    if (!handle) { setState({ page: null, loading: false, error: null }); return () => {}; }
    if (_cache.has(handle)) {
      setState({ page: _cache.get(handle), loading: false, error: null });
      return () => {};
    }
    let cancelled = false;
    setState((s) => ({ ...s, loading: true }));
    pages.getByHandle(handle)
      .then((p) => {
        _cache.set(handle, p);
        if (!cancelled) setState({ page: p, loading: false, error: null });
      })
      .catch((err) => {
        if (!cancelled) setState({ page: null, loading: false, error: err });
      });
    return () => { cancelled = true; };
  }, [handle]);

  return state;
}

export default useShopifyPage;
