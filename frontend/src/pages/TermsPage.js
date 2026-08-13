import React from 'react';
import { Navbar, Footer } from '../components/Layout';
import { ShopifyPageContent } from '../components/ShopifyPageContent';
import { useShopifyPage } from '../hooks/useShopifyPage';
import { SeoHead } from '../components/SeoHead';

/**
 * Terms of Service — rendered directly from the Shopify page description
 * (handle `terms-of-service`). No metafield, single source of truth.
 */
export const TermsPage = () => {
  const { page, loading } = useShopifyPage('terms-of-service');
  return (
    <>
      <SeoHead endpoint="/api/shopify/page/terms-of-service" fallback={{ title: 'Terms of Service | FoeGuard' }} />
      <Navbar />
      <div className="content-page">
        <div className="content-container">
          <h1>{page?.title || 'Terms of Service'}</h1>
          {loading ? (
            <p style={{ color: '#8A7156' }}>Loading…</p>
          ) : (
            <ShopifyPageContent handle="terms-of-service" testId="terms-body" />
          )}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default TermsPage;
