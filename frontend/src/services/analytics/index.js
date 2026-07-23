// FoeGuard — GTM-only analytics layer.
//
// All third-party pixels (GA4, Meta Pixel, Microsoft Clarity, TikTok, etc.)
// are now loaded and configured through the Google Tag Manager container
// (GTM-NR3N5DHG), which is embedded once in `public/index.html`. This file
// no longer touches any provider directly — it just pushes structured
// events onto `window.dataLayer` so GTM can route them to whichever tags
// the merchant has enabled in the GTM UI.
//
// Public API kept stable so page/context callers don't break:
//   trackPageView(path)
//   trackAddToCart({ name, value, items, quantity })
//   trackCheckoutInitiated({ value, items, num_items })
//   trackOrderCompleted({ order_id, value, items })
//   trackShopifyEmailEvent(event, properties)

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

// Ensure the dataLayer exists even if this module is imported before the
// GTM snippet has run (it shouldn't, but this is cheap insurance).
if (typeof window !== 'undefined') {
  window.dataLayer = window.dataLayer || [];
}

const push = (payload) => {
  if (typeof window === 'undefined') return;
  try {
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push(payload);
  } catch (_) { /* never let analytics break the page */ }
};

/* ----------------------------- init (no-op) ------------------------------ */
// Kept for API compatibility with the old provider-loading version.
// GTM auto-loads from the <script> in index.html, so nothing to do here.
export function initAnalytics() { /* no-op — GTM handles all providers */ }

/* ------------------------------ page views ------------------------------- */
// GTM's default `gtm.js` load event fires ONE initial container-load, and
// most GA4 tags are configured with "Initialization - All Pages" so they
// already send the FIRST page view themselves. We therefore skip the very
// first `trackPageView` call and only push on real SPA route changes.
let firstPageViewSkipped = false;

export function trackPageView(path) {
  if (!firstPageViewSkipped) {
    firstPageViewSkipped = true;
    return;
  }
  push({
    event: 'page_view',
    page_path: path,
    page_location: typeof window !== 'undefined' ? window.location.href : '',
    page_title: typeof document !== 'undefined' ? document.title : '',
  });
}

/* ------------------------------ ecommerce -------------------------------- */
export function trackAddToCart({ name, value = 0, items = [], quantity = 1 } = {}) {
  push({
    event: 'add_to_cart',
    ecommerce: { currency: 'USD', value, items },
    item_name: name,
    quantity,
  });
}

export function trackCheckoutInitiated({ value = 0, items = [], num_items = 0 } = {}) {
  push({
    event: 'begin_checkout',
    ecommerce: { currency: 'USD', value, items },
    num_items,
  });
}

export function trackOrderCompleted({ order_id, value = 0, items = [] } = {}) {
  push({
    event: 'purchase',
    ecommerce: { transaction_id: order_id, currency: 'USD', value, items },
  });
}

/* ---------------------- Shopify customer lifecycle ----------------------- */
/**
 * Named customer events mirrored into GTM AND posted to the backend event
 * sink (which tags the Shopify customer for Shopify Email flows).
 * event ∈ account_created | order_placed | quiz_completed | meal_plan_landing | abandoned_cart
 */
export function trackShopifyEmailEvent(event, properties = {}) {
  try {
    fetch(`${API}/events/track`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ event, properties }),
      keepalive: true,
    }).catch(() => {});
  } catch (_) { /* ignore */ }
  push({ event, ...properties });
}
