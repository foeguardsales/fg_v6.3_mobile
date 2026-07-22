/**
 * ShopifyAuthContext
 *
 * The single source of truth for customer authentication, backed by Shopify's
 * new Customer Account API (OAuth 2.0 / OIDC). Authentication happens through a
 * redirect to Shopify's hosted login; the backend keeps the OAuth tokens in a
 * server-side session and exposes only an httpOnly cookie. The browser never
 * sees a Shopify token and there is NO Mongo/JWT customer login.
 *
 *   const { customer, isAuthenticated, loading, login, register, logout, refresh } = useShopifyAuth();
 */
import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;
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
      const res = await fetch(`${API}/customer-auth/session`, { credentials: 'include' });
      const data = await res.json();
      const c = data?.authenticated ? data.customer : null;
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

  // Redirect to Shopify hosted sign-in / sign-up.
  const login = useCallback(() => {
    window.location.href = `${API}/customer-auth/login`;
  }, []);

  // Shopify's hosted flow handles both sign-in and account creation.
  const register = useCallback(() => {
    window.location.href = `${API}/customer-auth/login`;
  }, []);

  const logout = useCallback(async () => {
    let logoutUrl = null;
    try {
      const res = await fetch(`${API}/customer-auth/logout`, { method: 'POST', credentials: 'include' });
      const data = await res.json();
      logoutUrl = data?.logout_url || null;
    } catch (_) { /* ignore */ }
    setCustomer(null);
    persist(null);
    if (logoutUrl) window.location.href = logoutUrl;
  }, []);

  const value = useMemo(() => ({
    customer,
    isAuthenticated: !!customer,
    loading,
    login,
    register,
    logout,
    recover: login, // password recovery is handled on Shopify's hosted page
    refresh,
    updateCustomer: async () => customer, // profile edits happen on Shopify account page
  }), [customer, loading, login, register, logout, refresh]);

  return (
    <ShopifyAuthContext.Provider value={value}>
      {children}
    </ShopifyAuthContext.Provider>
  );
};

export default ShopifyAuthContext;
