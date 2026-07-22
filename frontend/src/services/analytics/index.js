// FoeGuard — modular, env-gated analytics layer.
// Every provider is independent and becomes a NO-OP when its env var is absent,
// so nothing loads or fires until the keys are added in the connected account.
// No keys are hardcoded here — env vars only.

const GA4_ID = process.env.REACT_APP_GA4_MEASUREMENT_ID;
const META_PIXEL_ID = process.env.REACT_APP_META_PIXEL_ID;
const CLARITY_ID = process.env.REACT_APP_CLARITY_PROJECT_ID;
const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

let initialized = false;

/* ----------------------------- provider loaders ---------------------------- */
function loadGA4() {
  if (!GA4_ID || window.gtag) return;
  const s = document.createElement('script');
  s.async = true;
  s.src = `https://www.googletagmanager.com/gtag/js?id=${GA4_ID}`;
  document.head.appendChild(s);
  window.dataLayer = window.dataLayer || [];
  window.gtag = function gtag() { window.dataLayer.push(arguments); };
  window.gtag('js', new Date());
  // We fire page_view manually on route change (SPA), so disable the auto one.
  window.gtag('config', GA4_ID, { send_page_view: false });
}

function loadMetaPixel() {
  if (!META_PIXEL_ID || window.fbq) return;
  /* Standard Meta Pixel bootstrap */
  !(function (f, b, e, v, n, t, s) {
    if (f.fbq) return;
    n = f.fbq = function () { n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments); };
    if (!f._fbq) f._fbq = n;
    n.push = n; n.loaded = !0; n.version = '2.0'; n.queue = [];
    t = b.createElement(e); t.async = !0; t.src = v;
    s = b.getElementsByTagName(e)[0]; s.parentNode.insertBefore(t, s);
  })(window, document, 'script', 'https://connect.facebook.net/en_US/fbevents.js');
  window.fbq('init', META_PIXEL_ID);
}

function loadClarity() {
  if (!CLARITY_ID || window.clarity) return;
  /* Standard Microsoft Clarity bootstrap */
  (function (c, l, a, r, i, t, y) {
    c[a] = c[a] || function () { (c[a].q = c[a].q || []).push(arguments); };
    t = l.createElement(r); t.async = 1; t.src = 'https://www.clarity.ms/tag/' + i;
    y = l.getElementsByTagName(r)[0]; y.parentNode.insertBefore(t, y);
  })(window, document, 'clarity', 'script', CLARITY_ID);
}

/** Inject whichever providers are configured. Idempotent + safe to call anytime. */
export function initAnalytics() {
  if (initialized) return;
  initialized = true;
  try { loadGA4(); } catch (_) { /* ignore */ }
  try { loadMetaPixel(); } catch (_) { /* ignore */ }
  try { loadClarity(); } catch (_) { /* ignore */ }
}

/* ------------------------------ event helpers ------------------------------ */
const ga = (name, params) => { if (window.gtag && GA4_ID) window.gtag('event', name, params || {}); };
const fb = (name, params) => { if (window.fbq && META_PIXEL_ID) window.fbq('track', name, params || {}); };

export function trackPageView(path) {
  ga('page_view', { page_path: path, page_location: window.location.href, page_title: document.title });
  fb('PageView');
}

export function trackAddToCart({ name, value = 0, items = [], quantity = 1 } = {}) {
  ga('add_to_cart', { currency: 'USD', value, items });
  fb('AddToCart', { currency: 'USD', value, content_name: name, contents: items, num_items: quantity });
}

export function trackCheckoutInitiated({ value = 0, items = [], num_items = 0 } = {}) {
  ga('begin_checkout', { currency: 'USD', value, items });
  fb('InitiateCheckout', { currency: 'USD', value, num_items });
}

export function trackOrderCompleted({ order_id, value = 0, items = [] } = {}) {
  ga('purchase', { transaction_id: order_id, currency: 'USD', value, items });
  fb('Purchase', { currency: 'USD', value, content_ids: items.map((i) => i.item_id || i.id).filter(Boolean) });
}

/**
 * Named customer events routed to Shopify Email flows (headless).
 * Sends to the backend event sink (which tags the Shopify customer when configured)
 * and also mirrors the event into GA4 as a custom event. Never throws.
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
  ga(event, properties);
}
