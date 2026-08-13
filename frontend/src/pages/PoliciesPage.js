import React from 'react';
import { Navbar, Footer } from '../components/Layout';
import { ShopifyPageContent } from '../components/ShopifyPageContent';
import { useShopifyPage } from '../hooks/useShopifyPage';
import { SeoHead } from '../components/SeoHead';

/**
 * Generic legal / policy page rendered directly from a Shopify page
 * description (no metafield). Used for Privacy Policy and Returns & Refunds.
 */
export const PoliciesPage = ({ handle = 'privacy-policy', title = 'Privacy Policy' }) => {
  const { page, loading } = useShopifyPage(handle);
  return (
    <>
      <SeoHead endpoint={`/api/shopify/page/${handle}`} fallback={{ title: `${title} | FoeGuard` }} />
      <Navbar />
      <div className="content-page">
        <div className="content-container">
          <h1>{page?.title || title}</h1>
          {loading ? (
            <p style={{ color: '#8A7156' }}>Loading…</p>
          ) : (
            <ShopifyPageContent handle={handle} testId={`policy-${handle}`} />
          )}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default PoliciesPage;
