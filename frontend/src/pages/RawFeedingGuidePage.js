import React from 'react';
import { Navbar, Footer } from '../components/Layout';
import { useShopifyPage } from '../hooks/useShopifyPage';
import ShopifyPageBuilder from '../components/ShopifyPageBuilder';
import { SeoHead } from '../components/SeoHead';

/**
 * Raw Pet Food Feeding Guide — fully driven by the Shopify
 * `foeguard.page_builder` metafield (section type `page_raw_feeding_guide`).
 */
export const RawFeedingGuidePage = () => {
  const { page } = useShopifyPage('raw-feeding-guide');
  return (
    <>
      <SeoHead endpoint="/api/shopify/page/raw-feeding-guide" fallback={{ title: 'Raw Feeding Guide | FoeGuard' }} />
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

export default RawFeedingGuidePage;
