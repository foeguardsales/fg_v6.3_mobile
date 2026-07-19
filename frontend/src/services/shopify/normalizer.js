/**
 * Shopify -> legacy UI model normalizers.
 *
 * The FoeGuard React app was built around a local Mongo product/treat
 * schema. This module converts Shopify Storefront products/collections
 * into the exact same shape the pages already consume, so no UI code
 * has to change. All values are DERIVED from Shopify data or read from
 * `foeguard.*` metafields — nothing hardcoded per product.
 *
 * Metafield conventions (all optional; unset -> inferred / omitted):
 *   foeguard.product_line          single_line_text  ("comfort_dinner" | "royal_paws" | "primal_feast" | "monthly_bundles" | "meaty_bone_treats")
 *   foeguard.protein_type          single_line_text  ("chicken" | "beef" | ...)
 *   foeguard.highlights            list.single_line_text  (JSON string list)
 *   foeguard.ingredients           multi_line_text OR list  (string or list)
 *   foeguard.nutrition_facts       json  ({key: value, ...})
 *   foeguard.feeding_guide         json  ({feeding, handling})
 *   foeguard.product_information   multi_line_text
 *   foeguard.mini_description      single_line_text
 *   foeguard.benefits              list.single_line_text  (for treats)
 *   foeguard.quantity_description  single_line_text        (for treats)
 *   foeguard.no_variants           boolean                 (force treat-style stepper)
 */

// ---------- metafield helpers -----------------------------------------

const PROTEIN_TAGS = new Set([
  'chicken', 'beef', 'duck', 'lamb', 'fish', 'salmon', 'turkey', 'goat',
  'rabbit', 'pork', 'venison', 'bison',
]);

function indexMetafields(mfList) {
  const out = {};
  (mfList || []).forEach((m) => {
    if (m && m.key) out[m.key] = m;
  });
  return out;
}

/**
 * Log a warning when a metafield we expect the merchant to set on this
 * product is missing. Never throws \u2014 the UI degrades gracefully.
 *
 * `expected` is the canonical list from Prompt 2:
 *   ingredients, nutritional_analysis, feeding_guide, product_information,
 *   comparison_table, benefit_icons.
 */
const EXPECTED_PRODUCT_METAFIELDS = [
  'ingredients',
  'nutritional_analysis',
  'feeding_guide',
  'product_information',
  'comparison_table',
  'benefit_icons',
];

function logMissingMetafields(handle, mfIndex) {
  if (typeof console === 'undefined' || !console.warn) return;
  const missing = EXPECTED_PRODUCT_METAFIELDS.filter((k) => !mfIndex[k] || mfIndex[k].value === null);
  if (missing.length > 0) {
    console.warn(
      `[shopify] product "${handle}" is missing metafields:`,
      missing.map((k) => `foeguard.${k}`).join(', ')
    );
  }
}

function mfString(mf, key, fallback = null) {
  const m = mf[key];
  if (!m || m.value === null || m.value === undefined) return fallback;
  return m.value;
}

function mfJson(mf, key, fallback = null) {
  const raw = mfString(mf, key);
  if (!raw) return fallback;
  try { return JSON.parse(raw); } catch { return fallback; }
}

function mfList(mf, key, fallback = []) {
  const raw = mfString(mf, key);
  if (!raw) return fallback;
  try {
    const v = JSON.parse(raw);
    if (Array.isArray(v)) return v;
    return fallback;
  } catch { return fallback; }
}

function mfBool(mf, key, fallback = false) {
  const raw = mfString(mf, key);
  if (raw === null || raw === undefined) return fallback;
  return raw === 'true' || raw === true || raw === '1' || raw === 1;
}

// ---------- inference -------------------------------------------------

export function inferProductLine(p) {
  const handle = (p.handle || '').toLowerCase();
  const type = (p.productType || '').toLowerCase();
  const title = (p.title || '').toLowerCase();
  const tags = (p.tags || []).map((t) => String(t).toLowerCase());

  // Explicit tag: pl:xxx
  const plTag = tags.find((t) => t.startsWith('pl:'));
  if (plTag) return plTag.slice(3);

  if (handle.startsWith('monthly-bundle') || title.includes('monthly bundle')) {
    return 'monthly_bundles';
  }
  if (
    handle.startsWith('comfort-') ||
    handle.startsWith('comfortdinner-') ||
    title.includes('comfort dinner')
  ) {
    return 'comfort_dinner';
  }
  if (
    handle.startsWith('rp-') ||
    handle.startsWith('royal-paws') ||
    title.includes('royal paws')
  ) {
    return 'royal_paws';
  }
  if (
    handle.startsWith('primal-') ||
    title.includes('primal feast')
  ) {
    return 'primal_feast';
  }
  if (
    type.includes('treat') ||
    handle.includes('-treat') ||
    title.includes('treat') ||
    handle.includes('bone')
  ) {
    return 'meaty_bone_treats';
  }
  // Fallback: if productType has "Raw Dog Food" and none of the above matched
  if (type.includes('raw dog food')) return 'comfort_dinner';
  return 'meaty_bone_treats';
}

export function inferProteinType(p) {
  const tags = (p.tags || []).map((t) => String(t).toLowerCase());
  for (const t of tags) {
    if (PROTEIN_TAGS.has(t)) return t;
  }
  const proteinTag = tags.find((t) => t.startsWith('protein:'));
  if (proteinTag) return proteinTag.slice(8);
  const haystack = `${p.handle || ''} ${p.title || ''}`.toLowerCase();
  for (const p_ of PROTEIN_TAGS) {
    if (haystack.includes(p_)) return p_;
  }
  return 'chicken';
}

export function inferPetType(p, productLine) {
  const tags = (p.tags || []).map((t) => String(t).toLowerCase());
  if (tags.includes('cat') || tags.includes('pet:cat') || tags.some((t) => t === 'cats')) return 'cat';
  if (tags.includes('dog') || tags.includes('pet:dog') || tags.some((t) => t === 'dogs')) return 'dog';
  const petTag = tags.find((t) => t.startsWith('pet:'));
  if (petTag) return petTag.slice(4);
  if (productLine === 'royal_paws') return 'cat';
  const haystack = `${p.handle || ''} ${p.title || ''}`.toLowerCase();
  if (/\bcat\b|royal ?paws/.test(haystack)) return 'cat';
  return 'dog';
}

// ---------- pricing ---------------------------------------------------

// Parse a Size option value like "6 lb", "12 lb", "18 lbs", "1-Pack" ...
function parseSizeLb(value) {
  if (!value) return null;
  const v = String(value).toLowerCase().trim();
  // e.g. "6 lb", "12 lb", "18 lbs", "24 lb"
  const m = v.match(/^(\d+(?:\.\d+)?)\s*lbs?\b/);
  if (m) return parseFloat(m[1]);
  return null;
}

function pickPricingFromVariants(variants) {
  const sizeMap = new Map(); // sizeLb -> cheapest price
  variants.forEach((v) => {
    const sizeOpt = (v.selectedOptions || []).find(
      (o) => (o.name || '').toLowerCase() === 'size'
    );
    const size = sizeOpt ? parseSizeLb(sizeOpt.value) : null;
    if (size === null) return;
    const price = parseFloat(v.price?.amount || '0');
    if (!sizeMap.has(size) || sizeMap.get(size).price > price) {
      sizeMap.set(size, {
        size_lb: size,
        price,
        variant_id: v.id,
        variant_title: v.title,
      });
    }
  });
  const sorted = Array.from(sizeMap.values()).sort((a, b) => a.size_lb - b.size_lb);
  return sorted;
}

// ---------- description helpers --------------------------------------

export function stripHtml(html) {
  if (!html) return '';
  if (typeof document !== 'undefined') {
    const el = document.createElement('div');
    el.innerHTML = html;
    return el.textContent || el.innerText || '';
  }
  return html.replace(/<[^>]*>/g, '');
}

// ---------- normalize product ----------------------------------------

export function normalizeShopifyProduct(sp) {
  if (!sp) return null;
  const mf = indexMetafields(sp.metafields);
  logMissingMetafields(sp.handle, mf);

  const product_line = mfString(mf, 'product_line') || inferProductLine(sp);
  const protein_type = mfString(mf, 'protein_type') || inferProteinType(sp);
  const pet_type = mfString(mf, 'pet_type') || inferPetType(sp, product_line);

  const variants = (sp.variants?.nodes || []).map((v) => ({
    id: v.id,
    title: v.title,
    sku: v.sku,
    availableForSale: v.availableForSale,
    price: parseFloat(v.price?.amount || '0'),
    currency: v.price?.currencyCode || 'CAD',
    compareAtPrice: v.compareAtPrice ? parseFloat(v.compareAtPrice.amount) : null,
    selectedOptions: v.selectedOptions || [],
    image: v.image?.url || null,
  }));

  const pricingFromVariants = pickPricingFromVariants(sp.variants?.nodes || []);
  const minPrice = parseFloat(sp.priceRange?.minVariantPrice?.amount || variants[0]?.price || 0);
  const pricing = pricingFromVariants.length > 0
    ? pricingFromVariants
    : [{ size_lb: 6, price: minPrice, variant_id: variants[0]?.id, variant_title: variants[0]?.title }];

  const images = (sp.images?.nodes || []).map((i) => i.url).filter(Boolean);
  const featured = sp.featuredImage?.url || images[0] || null;

  // Description: prefer plain `description` field from Shopify, fall back to stripped HTML
  const plainDescription = sp.description || stripHtml(sp.descriptionHtml);

  // Determine no_variants (used by menu to switch between + stepper and product page open)
  let inferredNoVariants = false;
  if (variants.length <= 1) inferredNoVariants = true;
  const sizeOption = (sp.options || []).find(
    (o) => (o.name || '').toLowerCase() === 'size'
  );
  const distinctSizes = sizeOption ? sizeOption.values.filter((v) => parseSizeLb(v) !== null).length : 0;
  if (distinctSizes <= 1) inferredNoVariants = inferredNoVariants || product_line === 'meaty_bone_treats';
  const no_variants = mf.no_variants ? mfBool(mf, 'no_variants', inferredNoVariants) : inferredNoVariants;

  return {
    // legacy identifiers
    product_id: sp.handle, // use handle as stable id in the UI
    handle: sp.handle,
    shopify_id: sp.id,

    // core fields the UI reads
    name: sp.title,
    description: plainDescription,
    descriptionHtml: sp.descriptionHtml,
    mini_description: mfString(mf, 'mini_description') || plainDescription.split('.').filter(Boolean)[0] || '',
    product_line,
    protein_type,
    pet_type,
    category: sp.productType || product_line,
    tags: sp.tags || [],
    pricing,
    variants,
    default_variant_id: variants[0]?.id || null,
    price: minPrice,
    currency: sp.priceRange?.minVariantPrice?.currencyCode || 'CAD',

    // media
    image: featured,
    images,

    // inventory
    availableForSale: !!sp.availableForSale,

    // rich content (from metafields; may be null / empty)
    highlights: mfList(mf, 'highlights', []),
    // benefit_icons — list of { icon, label } pairs for the checkmark bullets
    benefit_icons: mfJson(mf, 'benefit_icons', null) || mfList(mf, 'benefit_icons', null),
    ingredients: mfString(mf, 'ingredients') || mfList(mf, 'ingredients', []),
    // nutritional_analysis is the new canonical key; nutrition_facts is the legacy fallback.
    nutritional_analysis: mfJson(mf, 'nutritional_analysis', null) || mfJson(mf, 'nutrition_facts', {}),
    // Alias kept for older UI components that still reference nutrition_facts
    nutrition_facts: mfJson(mf, 'nutritional_analysis', null) || mfJson(mf, 'nutrition_facts', {}),
    feeding_guide: mfJson(mf, 'feeding_guide', null),
    product_information: mfString(mf, 'product_information') || plainDescription,
    // comparison_table — JSON: { headers: [...], rows: [ [attr, us, kibble, ...], ... ] }
    // or {"rows": [{"attribute":"...","foeguard":"...","kibble":"..."}]}
    comparison_table: mfJson(mf, 'comparison_table', null),

    // menu behavior
    no_variants,
  };
}

// ---------- normalize treat ------------------------------------------
// Treat schema (legacy):
// { treat_id, name, description, price, image, images[], category,
//   benefits[], ingredients, product_information, feeding_guide,
//   quantity_description }

export function normalizeShopifyTreat(sp) {
  if (!sp) return null;
  const p = normalizeShopifyProduct(sp);
  const mf = indexMetafields(sp.metafields);

  return {
    treat_id: p.handle,
    handle: p.handle,
    shopify_id: p.shopify_id,
    name: p.name,
    description: p.description,
    descriptionHtml: p.descriptionHtml,
    mini_description: p.mini_description,
    price: p.price,
    currency: p.currency,
    image: p.image,
    images: p.images,
    category: p.category,
    tags: p.tags,
    protein_type: p.protein_type,
    pet_type: p.pet_type,
    variants: p.variants,
    default_variant_id: p.default_variant_id,
    availableForSale: p.availableForSale,
    benefits: mfList(mf, 'benefits', p.highlights || []),
    ingredients: p.ingredients,
    product_information: p.product_information,
    feeding_guide: p.feeding_guide,
    quantity_description: mfString(mf, 'quantity_description') || p.mini_description,
    highlights: p.highlights,
    no_variants: true,
  };
}

// ---------- normalize collection -------------------------------------

export function normalizeShopifyCollection(sc) {
  if (!sc) return null;
  return {
    collection_id: sc.handle,
    handle: sc.handle,
    shopify_id: sc.id,
    name: sc.title,
    title: sc.title,
    description: sc.description || stripHtml(sc.descriptionHtml),
    descriptionHtml: sc.descriptionHtml,
    image: sc.image?.url || null,
    products: (sc.products?.nodes || []).map(normalizeShopifyProduct),
  };
}

export default {
  normalizeShopifyProduct,
  normalizeShopifyTreat,
  normalizeShopifyCollection,
  inferProductLine,
  inferProteinType,
};
