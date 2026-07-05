/**
 * ShopifyAuthContext
 *
 * The one source of truth for customer authentication using Shopify's
 * official Storefront Customer Auth flow (customerAccessToken). No
 * custom user database, no server-side session cookies.
 *
 * The provider hydrates from the persisted access token on mount and
 * calls `/api/shopify/customers/me`. Consumers use:
 *
 *   const {
 *     customer, isAuthenticated, loading,
 *     login, register, logout, recover, updateCustomer, refresh,
 *   } = useShopifyAuth();
 */
import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { customers, customerTokenStorage } from '../services/shopify';

const ShopifyAuthContext = createContext(null);

export const useShopifyAuth = () => {
  const ctx = useContext(ShopifyAuthContext);
  if (!ctx) throw new Error('useShopifyAuth must be used within <ShopifyAuthProvider>');
  return ctx;
};

export const ShopifyAuthProvider = ({ children }) => {
  const [customer, setCustomer] = useState(null);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    const token = customerTokenStorage.get();
    if (!token) {
      setCustomer(null);
      setLoading(false);
      return null;
    }
    try {
      const me = await customers.me();
      setCustomer(me);
      return me;
    } catch (err) {
      // Token expired / invalid — wipe it.
      if (err?.status === 401) customerTokenStorage.clear();
      setCustomer(null);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { refresh(); }, [refresh]);

  const login = useCallback(async (email, password) => {
    await customers.login({ email, password });
    return refresh();
  }, [refresh]);

  const register = useCallback(async ({ email, password, firstName, lastName, phone, acceptsMarketing }) => {
    await customers.register({ email, password, firstName, lastName, phone, acceptsMarketing });
    // Shopify does not auto-login after createCustomer—log in manually.
    return login(email, password);
  }, [login]);

  const logout = useCallback(async () => {
    await customers.logout();
    setCustomer(null);
  }, []);

  const recover = useCallback(async (email) => {
    return customers.recover(email);
  }, []);

  const updateCustomer = useCallback(async (patch) => {
    const updated = await customers.update(patch);
    setCustomer((prev) => ({ ...(prev || {}), ...(updated || {}) }));
    return updated;
  }, []);

  const value = useMemo(() => ({
    customer,
    isAuthenticated: !!customer,
    loading,
    login,
    register,
    logout,
    recover,
    updateCustomer,
    refresh,
  }), [customer, loading, login, register, logout, recover, updateCustomer, refresh]);

  return (
    <ShopifyAuthContext.Provider value={value}>
      {children}
    </ShopifyAuthContext.Provider>
  );
};

export default ShopifyAuthContext;
