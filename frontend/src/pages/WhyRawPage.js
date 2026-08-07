import React from 'react';
import { Navbar, Footer } from '../components/Layout';
import { useShopifyPage } from '../hooks/useShopifyPage';
import ShopifyPageBuilder from '../components/ShopifyPageBuilder';
import { SeoHead } from '../components/SeoHead';

/**
 * Generic "Why Raw" marketing page — fully driven by the Shopify
 * `foeguard_page_builder` metafield on the given page handle.
 */
export const WhyRawPage = ({ handle = 'why-foeguard-raw-dog-food', title = 'Why Raw?' }) => {
  const { page } = useShopifyPage(handle);
  return (
    <>
      <SeoHead endpoint={`/api/shopify/page/${handle}`} fallback={{ title: `${title} | FoeGuard` }} />
      <Navbar />
      {page ? (
        <ShopifyPageBuilder page={page} />
      ) : (
        <div style={{ minHeight: '40vh', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#8A7156' }}>
          Loading…
        </div>
      )}
      <Footer />
    </>
  );
};

export default WhyRawPage;
