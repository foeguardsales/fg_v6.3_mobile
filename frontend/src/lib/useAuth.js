/**
 * useAuth() \u2014 legacy hook shape backed by Shopify Customer Auth.
 *
 * Kept intentionally minimal so all existing consumers (AccountPage,
 * SubscriptionManager, etc.) can call `.login(email, password)`,
 * `.register(name, email, password)`, `.logout()`, `.user`,
 * `.isAuthenticated` without any code changes.
 *
 * Internally this simply proxies to the ShopifyAuthContext, mapping the
 * Shopify customer object onto the legacy `{ id, email, name, role }`
 * shape via `shopifyCustomerToLegacyUser` in services/api.js.
 */
import { useMemo } from 'react';
import { useShopifyAuth } from '../contexts/ShopifyAuthContext';

function toLegacyUser(c) {
  if (!c) return null;
  const fullName = [c.firstName, c.lastName].filter(Boolean).join(' ') || c.displayName || c.email;
  return {
    id: c.id,
    email: c.email,
    name: fullName,
    firstName: c.firstName,
    lastName: c.lastName,
    phone: c.phone,
    role: 'customer',
    shopify: c,
  };
}

export const useAuth = () => {
  const { customer, isAuthenticated, loading, login, register, logout, recover, refresh, updateCustomer } = useShopifyAuth();

  const user = useMemo(() => toLegacyUser(customer), [customer]);

  return {
    user,
    isAuthenticated,
    loading,
    // legacy signatures preserved:
    login: (email, password) => login(email, password),
    register: (name, email, password) => {
      const parts = (name || '').trim().split(/\s+/);
      const firstName = parts.shift() || null;
      const lastName = parts.length ? parts.join(' ') : null;
      return register({ email, password, firstName, lastName });
    },
    logout: () => logout(),
    // new goodies (safe to ignore in old callers):
    recover,
    refresh,
    updateCustomer,
  };
};

export default useAuth;
