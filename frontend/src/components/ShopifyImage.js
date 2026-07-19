/**
 * <ShopifyImage />
 *
 * Renders an <img> whose source is pulled from a Shopify Page
 * metafield. Falls back to a hardcoded `src` prop while the merchant
 * hasn't populated the metafield yet.
 *
 *   <ShopifyImage
 *     handle="about-us"
 *     metafieldKey="hero"
 *     fallback="/hardcoded-hero.jpg"
 *     alt="About FoeGuard"
 *     style={{ borderRadius: 8 }}
 *   />
 *
 * As soon as the merchant assigns a MediaImage to
 * ``foeguard.hero`` on the Shopify page, this component swaps to it
 * automatically on the next fetch (cache respects the same TTL /
 * webhook invalidation as everything else).
 */
import React from 'react';
import { useShopifyPage } from '../hooks/useShopifyPage';
import { getMetafieldImage, getMetafieldImageList } from '../services/shopify/pageMeta';

export const ShopifyImage = ({
  handle,
  metafieldKey,
  fallback,
  alt = '',
  index = 0,
  list = false,
  ...imgProps
}) => {
  const { page } = useShopifyPage(handle);
  let src = null;
  if (page) {
    if (list) {
      const urls = getMetafieldImageList(page, metafieldKey);
      src = urls[index] || null;
    } else {
      src = getMetafieldImage(page, metafieldKey);
    }
  }
  const finalSrc = src || fallback;
  if (!finalSrc) return null;
  return <img src={finalSrc} alt={alt} {...imgProps} />;
};

export default ShopifyImage;
