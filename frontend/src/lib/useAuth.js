/**
 * useAuth() — legacy hook shape backed by the Shopify Customer Account API.
 *
 * Keeps the same `{ user, isAuthenticated, loading, login, register, logout }`
 * surface existing consumers expect. `login`/`register` now trigger a redirect
 * to Shopify's hosted sign-in (OAuth/OIDC); there is no email/password path.
 */
import { useMemo } from 'react';
import { useShopifyAuth } from '../contexts/ShopifyAuthContext';

function toLegacyUser(c) {
  if (!c) return null;
  const fullName = [c.firstName, c.lastName].filter(Boolean).join(' ') || c.name || c.email;
  return {
    id: c.id,
    shopify_customer_id: c.shopify_customer_id || c.id,
    email: c.email,
    name: fullName,
    firstName: c.firstName,
    lastName: c.lastName,
    role: 'customer',
    shopify: c,
  };
}

export const useAuth = () => {
  const { customer, isAuthenticated, loading, login, register, logout, recover, refresh } = useShopifyAuth();

  const user = useMemo(() => toLegacyUser(customer), [customer]);

  return {
    user,
    isAuthenticated,
    loading,
    login: () => login(),
    register: () => register(),
    logout: () => logout(),
    recover,
    refresh,
  };
};

export default useAuth;
