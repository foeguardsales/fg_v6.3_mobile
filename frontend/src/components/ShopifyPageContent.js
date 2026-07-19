/**
 * <ShopifyPageContent handle="..." />
 *
 * Fetches a Shopify Page by handle and renders its rich `body` HTML as a
 * merchant-managed content block. Renders nothing when the page doesn’t
 * exist yet, so the surrounding hardcoded design/layout keeps working
 * during the content migration.
 *
 * Usage — drop one line into any marketing page after the hero:
 *   <ShopifyPageContent handle="faqs-raw-dog-food" />
 *
 * The component intentionally does NOT render the page.title (each page
 * already has its own themed hero heading). It renders the body inside a
 * `.shopify-page-body` wrapper that inherits typography from App.css.
 */
import React from 'react';
import { useShopifyPage } from '../hooks/useShopifyPage';

export const ShopifyPageContent = ({
  handle,
  showTitle = false,
  className = '',
  containerClassName = '',
  testId = 'shopify-page-body',
}) => {
  const { page, loading } = useShopifyPage(handle);
  if (loading) return null;
  if (!page || !page.body) return null;
  return (
    <section
      className={`shopify-page-section ${containerClassName}`}
      data-testid={testId}
      style={{ padding: '48px 20px', maxWidth: '860px', margin: '0 auto' }}
    >
      {showTitle && page.title && (
        <h2
          style={{
            fontFamily: "'Barlow Semi Condensed', serif",
            fontSize: 'clamp(28px, 4vw, 40px)',
            fontWeight: 700,
            color: '#3B2A1A',
            marginBottom: '20px',
            textAlign: 'center',
          }}
        >
          {page.title}
        </h2>
      )}
      <div
        className={`shopify-page-body ${className}`}
        style={{
          fontSize: '17px',
          lineHeight: 1.75,
          color: '#2C2C2C',
        }}
        dangerouslySetInnerHTML={{ __html: page.body }}
      />
    </section>
  );
};

export default ShopifyPageContent;
