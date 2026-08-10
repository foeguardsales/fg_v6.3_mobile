/**
 * ShopifyAuthContext
 *
 * Single source of truth for customer authentication. Customers sign in and
 * sign up on OUR OWN site-coded form (email + password); those credentials are
 * submitted to the Shopify HEADLESS Storefront customer API through our backend
 * proxy at /api/shopify/customers/*. The opaque Storefront customerAccessToken
 * is stored client-side (localStorage via customerTokenStorage). There is NO
 * redirect to Shopify's hosted login page and NO Mongo/JWT customer login.
 *
 *   const { customer, isAuthenticated, loading, login, register, logout, recover, refresh } = useShopifyAuth();
 */
import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import * as customerService from '../services/shopify/customers';

const SIGNED_IN_FLAG = 'foeguard.signedIn';
const USER_CACHE = 'foeguard.shopifyUser';

const ShopifyAuthContext = createContext(null);

export const useShopifyAuth = () => {
  const ctx = useContext(ShopifyAuthContext);
  if (!ctx) throw new Error('useShopifyAuth must be used within <ShopifyAuthProvider>');
  return ctx;
};

function persist(customer) {
  try {
    if (customer) {
      localStorage.setItem(SIGNED_IN_FLAG, '1');
      localStorage.setItem(USER_CACHE, JSON.stringify(customer));
    } else {
      localStorage.removeItem(SIGNED_IN_FLAG);
      localStorage.removeItem(USER_CACHE);
    }
  } catch (_) { /* ignore */ }
  try { window.dispatchEvent(new Event('foeguard:auth-changed')); } catch (_) { /* ignore */ }
}

export const ShopifyAuthProvider = ({ children }) => {
  const [customer, setCustomer] = useState(null);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    try {
      const c = await customerService.me();
      setCustomer(c);
      persist(c);
      return c;
    } catch (_) {
      setCustomer(null);
      persist(null);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { refresh(); }, [refresh]);

  // Email/password sign-in against the Shopify headless customer API.
  const login = useCallback(async (creds) => {
    const { customer: c } = await customerService.login(creds);
    setCustomer(c);
    persist(c);
    return c;
  }, []);

  // Create account (then auto sign-in) against the Shopify headless customer API.
  const register = useCallback(async (data) => {
    const { customer: c } = await customerService.register(data);
    setCustomer(c);
    persist(c);
    return c;
  }, []);

  const logout = useCallback(async () => {
    try { await customerService.logout(); } catch (_) { /* ignore */ }
    setCustomer(null);
    persist(null);
  }, []);

  const recover = useCallback(async (email) => customerService.recover(email), []);

  const updateCustomer = useCallback(async (patch) => {
    const c = await customerService.updateProfile(patch);
    if (c) { setCustomer(c); persist(c); }
    return c;
  }, []);

  const value = useMemo(() => ({
    customer,
    isAuthenticated: !!customer,
    loading,
    login,
    register,
    logout,
    recover,
    refresh,
    updateCustomer,
  }), [customer, loading, login, register, logout, recover, refresh, updateCustomer]);

  return (
    <ShopifyAuthContext.Provider value={value}>
      {children}
    </ShopifyAuthContext.Provider>
  );
};

export default ShopifyAuthContext;
