import React from 'react';
import { Navbar, Footer } from '../components/Layout';
import { useShopifyPage } from '../hooks/useShopifyPage';
import ShopifyPageBuilder from '../components/ShopifyPageBuilder';
import { SeoHead } from '../components/SeoHead';

/**
 * Raw Pet Food Delivery page — fully driven by the Shopify `foeguard.page_builder`
 * metafield. Only the sections defined in Shopify render (hero, timeline, body);
 * everything else was removed per spec.
 */
export const DeliveryPage = ({ handle = 'fg-raw-dog-food-delivery', title = 'Raw Pet Food Delivery' }) => {
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

export default DeliveryPage;
