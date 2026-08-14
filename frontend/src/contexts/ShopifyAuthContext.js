/**
 * Auth context (Emergent Google Auth).
 *
 * Customer authentication is handled entirely by Emergent Auth (Google OAuth).
 * There is NO email/password form and NO Shopify hosted login. `login`,
 * `register` and `recover` all redirect the browser to Emergent's hosted
 * Google sign-in; on return the session_id in the URL fragment is exchanged
 * by <AuthCallback> which calls processSession(). The backend stores a
 * 7-day session in an httpOnly cookie.
 *
 *   const { customer, isAuthenticated, loading, login, logout, refresh, processSession } = useShopifyAuth();
 *
 * Note: the hook/provider names are kept (useShopifyAuth / ShopifyAuthProvider)
 * so existing consumers keep working, but the backend is now Emergent Auth.
 */
import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import axios from 'axios';

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;
const USER_CACHE = 'foeguard.shopifyUser';
const SIGNED_IN_FLAG = 'foeguard.signedIn';

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

// REMINDER: DO NOT HARDCODE THE URL, OR ADD ANY FALLBACKS OR REDIRECT URLS, THIS BREAKS THE AUTH
function goToEmergentLogin() {
  const redirectUrl = window.location.origin + '/account';
  window.location.href = `https://auth.emergentagent.com/?redirect=${encodeURIComponent(redirectUrl)}`;
}

export const ShopifyAuthProvider = ({ children }) => {
  const [customer, setCustomer] = useState(null);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    try {
      const { data } = await axios.get(`${API}/auth/session`, { withCredentials: true });
      const c = data?.authenticated ? data.user : null;
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

  useEffect(() => {
    // If we're returning from the OAuth callback, let <AuthCallback> exchange
    // the session_id first (avoids a race that would 401 the /session check).
    if (window.location.hash?.includes('session_id=')) {
      setLoading(false);
      return;
    }
    refresh();
  }, [refresh]);

  // Exchange the one-time session_id (from the URL fragment) for a session.
  const processSession = useCallback(async (sessionId) => {
    const { data } = await axios.post(
      `${API}/auth/session`,
      { session_id: sessionId },
      { withCredentials: true },
    );
    const c = data?.user || null;
    setCustomer(c);
    persist(c);
    setLoading(false);
    return c;
  }, []);

  // login / register / recover all go through Emergent Google auth.
  const login = useCallback(() => { goToEmergentLogin(); }, []);
  const register = useCallback(() => { goToEmergentLogin(); }, []);
  const recover = useCallback(() => { goToEmergentLogin(); }, []);

  const logout = useCallback(async () => {
    try { await axios.post(`${API}/auth/logout`, {}, { withCredentials: true }); } catch (_) { /* ignore */ }
    setCustomer(null);
    persist(null);
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
    processSession,
  }), [customer, loading, login, register, logout, recover, refresh, processSession]);

  return (
    <ShopifyAuthContext.Provider value={value}>
      {children}
    </ShopifyAuthContext.Provider>
  );
};

export default ShopifyAuthContext;
