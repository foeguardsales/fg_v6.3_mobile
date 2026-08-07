/**
 * Cart tier math — shared between BoxBuilder (menu grid) and ProductDetail
 * (per-product page) so the meals-vs-bundles rules can never drift apart.
 *
 * Rules (per merchant spec):
 *   1. Bundles are FIXED-PRICE. Never multiply their price by the tier rate.
 *   2. Bundle WEIGHT still counts toward the discount-tier threshold.
 *   3. Weight-based discount applies only to individual-meal products.
 *   4. Total cart weight = Σ meal-lbs + Σ (bundle_units × bundle_weight_lbs)
 *      where bundle_units = max(1, round(qty / 6)) because bundles are
 *      unit-count items but the shared `selectedProteins.qty` field is in
 *      6-lb increments.
 *
 * ---------------------------------------------------------------------------
 * Bundle weight source (in priority order):
 *   1. product.bundle_weight_lbs                       ← preferred
 *   2. Regex parse `- N lb` from product.name / title  ← graceful fallback
 *      (Every FoeGuard monthly bundle title follows the "Monthly Bundle
 *      <Size> Breed - <N> lb" convention, so this works TODAY before the
 *      merchant publishes the `foeguard.bundle_weight_lbs` metafield.)
 * ---------------------------------------------------------------------------
 */

export const BUNDLE_LINE = 'monthly_bundle';

export function isMonthlyBundle(product) {
  if (!product) return false;
  // Match both 'monthly_bundle' (BoxBuilder collection synth) and
  // 'monthly_bundles' (Shopify catalog normaliser default).
  const pl = String(product.product_line || '').toLowerCase();
  if (pl === 'monthly_bundle' || pl === 'monthly_bundles') return true;
  if (product.is_bundle === true) return true;
  const handle = String(product.handle || product.product_id || '').toLowerCase();
  return handle.startsWith('monthly-bundle');
}

/**
 * Resolve a bundle's declared weight in lbs. Returns 0 when unknown so callers
 * can decide whether to fall back to the raw cart qty.
 */
export function bundleWeightLbs(product) {
  if (!product) return 0;
  const declared = Number(product.bundle_weight_lbs);
  if (Number.isFinite(declared) && declared > 0) return declared;
  const parsed = parseWeightFromTitle(product.name || product.title || '');
  return parsed > 0 ? parsed : 0;
}

function parseWeightFromTitle(title) {
  const m = String(title).match(/-\s*(\d+(?:\.\d+)?)\s*lb/i);
  return m ? parseFloat(m[1]) : 0;
}

/**
 * How many bundle "units" the shopper has for this cart line. Bundles are
 * added through the same +6-lb stepper that meals use, so we normalise back
 * to whole boxes here (min 1).
 */
export function bundleUnitsFromQty(qty) {
  const n = Math.max(1, Math.round((Number(qty) || 6) / 6));
  return n;
}

/**
 * Lbs this cart entry contributes to the discount-tier threshold.
 * - Meals   → raw qty (already in lbs)
 * - Bundles → 0 (Monthly Bundles do NOT contribute to discount weight)
 * - Treats  → not stored here (never contribute)
 */
export function tierLbsForEntry(entry, product) {
  const qty = Number(entry?.qty) || 0;
  if (isMonthlyBundle(product)) return 0; // bundles never count toward the discount tier
  return qty;
}

/**
 * Sum every entry's tier-lbs for the given pet bucket.
 *
 * @param {object}   opts
 * @param {object}   opts.selectedProteins   the shared localStorage map
 * @param {Array}    opts.products           the full catalog (meals + bundles)
 * @param {string}   opts.pet                'dog' | 'cat'
 * @param {string=}  opts.excludeKey         cart key to skip (used by ProductDetail
 *                                           so it can add "other lbs + this product's own")
 * @returns {number} lbs to feed into `getTierFromLbs(lbs, RATES)`
 */
export function computeTierLbs({ selectedProteins, products, pet, excludeKey = null }) {
  if (!selectedProteins) return 0;
  let total = 0;
  for (const [key, entry] of Object.entries(selectedProteins)) {
    if (!entry) continue;
    if (excludeKey && key === excludeKey) continue;
    if ((entry.petType || 'dog') !== pet) continue;
    const productId = entry.productId || String(key).split('::')[0];
    const product = (products || []).find(
      (p) => p.product_id === productId || p.handle === productId
    );
    total += tierLbsForEntry(entry, product);
  }
  return total;
}

/**
 * Tier-lbs contribution for a product the shopper is CURRENTLY editing on
 * ProductDetail (which isn't committed to `selectedProteins` yet).
 * Same rules as `tierLbsForEntry`, but uses the live `quantity` state.
 */
export function activeProductTierLbs(product, quantity) {
  return tierLbsForEntry({ qty: quantity }, product);
}
