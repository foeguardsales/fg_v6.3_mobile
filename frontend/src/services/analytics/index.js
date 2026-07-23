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
export function trackViewItem({ item_id, item_name, variant, price = 0, quantity = 1, currency = 'USD' } = {}) {
  push({
    event: 'view_item',
    ecommerce: {
      currency,
      value: Number(price) * Number(quantity || 1),
      items: [
        {
          item_id,
          item_name,
          item_variant: variant,
          price: Number(price) || 0,
          quantity: Number(quantity) || 1,
        },
      ],
    },
  });
}

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

/* --------------------- Customer lifecycle events + tags -------------------
 * Four Shopify customer tags are applied via the backend `/events/track`:
 *   meal_plan_completed  → after quiz finishes         (tag: meal_plan_completed)
 *   meal_plan_purchase   → after purchase, source=mp   (tag: meal_plan_customer)
 *   starter_pack_purchase→ after purchase, source=sp   (tag: starter_pack_customer)
 *   build_a_box_purchase → after purchase, source=bab  (tag: build_a_box_customer)
 *
 * Each helper also pushes a matching dataLayer event so GTM can route to any
 * enabled tag/pixel. These are ADDITIONAL events — they do NOT duplicate the
 * standard ecommerce events (view_item, add_to_cart, begin_checkout, purchase),
 * which continue to be pushed by trackAddToCart / trackCheckoutInitiated /
 * trackOrderCompleted above.
 *
 * All helpers are safe when `email` is unknown (they still push the dataLayer
 * event; the Shopify tag step becomes a no-op — see backend router).
 * ------------------------------------------------------------------------ */

// Internal — POST to backend event sink so the Admin API can apply the tag.
function _postCustomerEvent(event, email, properties) {
  try {
    fetch(`${API}/events/track`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ event, email, properties: properties || {} }),
      keepalive: true,
    }).catch(() => {});
  } catch (_) { /* ignore */ }
}

/** Fires when the shopper completes the Meal Plan questionnaire successfully. */
export function trackMealPlanCompleted({ email, dog_name, dog_weight_lbs, source = 'regular' } = {}) {
  const props = { dog_name, dog_weight_lbs, source };
  _postCustomerEvent('meal_plan_completed', email, props);
  push({ event: 'meal_plan_completed', ...props });
}

/** Fires on order-complete when the order came from the Meal Plan outcome flow. */
export function trackMealPlanPurchase({ email, order_id, value = 0, items = [] } = {}) {
  const props = { order_id, value, items };
  _postCustomerEvent('meal_plan_purchase', email, props);
  push({ event: 'meal_plan_purchase', ecommerce: { transaction_id: order_id, currency: 'USD', value, items } });
}

/** Fires on order-complete when the order came from the Starter Pack outcome flow. */
export function trackStarterPackPurchase({ email, order_id, value = 0, items = [] } = {}) {
  const props = { order_id, value, items };
  _postCustomerEvent('starter_pack_purchase', email, props);
  push({ event: 'starter_pack_purchase', ecommerce: { transaction_id: order_id, currency: 'USD', value, items } });
}

/** Fires on order-complete for a custom Build-a-Box (default / non-outcome) order. */
export function trackBuildABoxPurchase({ email, order_id, value = 0, items = [] } = {}) {
  const props = { order_id, value, items };
  _postCustomerEvent('build_a_box_purchase', email, props);
  push({ event: 'build_a_box_purchase', ecommerce: { transaction_id: order_id, currency: 'USD', value, items } });
}
