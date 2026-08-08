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
  'product_ingredients_nutrition',
  'product_information',
  'product_mini_menu_descriptions',
  'product_page_icons_section',
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
  // Reference-type metafields carry a gid in `value` (e.g.
  // "gid://shopify/Metaobject/123"). Never leak that as display text — the
  // caller should read the expanded `reference`/`references` instead.
  if (typeof m.type === 'string' && m.type.includes('reference')) return fallback;
  return m.value;
}

/**
 * Flatten Shopify `rich_text_field` JSON (TipTap-like structure) into a
 * plain-text string, preserving paragraph breaks so it reads naturally
 * inside a `white-space: pre-wrap` block. Design-safe: any non-JSON /
 * unexpected input is returned (or ignored) without throwing.
 */
function richTextToPlain(raw) {
  if (raw == null) return null;
  if (typeof raw !== 'string') return null;
  const trimmed = raw.trim();
  if (!trimmed.startsWith('{') && !trimmed.startsWith('[')) return trimmed || null;
  let json;
  try { json = JSON.parse(trimmed); } catch { return trimmed || null; }

  const blocks = [];
  const inline = (node) => {
    if (!node) return '';
    if (typeof node.value === 'string') return node.value;
    return (node.children || []).map(inline).join('');
  };
  const walk = (node) => {
    if (!node) return;
    const t = node.type;
    if (t === 'paragraph' || t === 'heading') {
      const txt = (node.children || []).map(inline).join('').trim();
      if (txt) blocks.push(txt);
      return;
    }
    if (t === 'list') {
      (node.children || []).forEach((li) => {
        const txt = (li.children || []).map(inline).join('').trim();
        if (txt) blocks.push(`\u2022 ${txt}`);
      });
      return;
    }
    (node.children || []).forEach(walk);
  };
  walk(json);
  const out = blocks.join('\n\n').trim();
  return out || null;
}

/**
 * Extract the display value of a metaobject-reference metafield.
 * `product_information` in this store points to a `product_info` metaobject
 * whose own `product_information` field holds the rich text. We dig into the
 * expanded reference, flatten the first rich-text / text field we find, and
 * fall back to the given default.
 */
function mfReferenceText(mf, key, fallback = null) {
  const m = mf[key];
  if (!m) return fallback;
  const ref = m.reference;
  if (ref && Array.isArray(ref.fields)) {
    // prefer a field matching the key, else the first non-empty field
    const same = ref.fields.find((f) => f.key === key && f.value);
    const first = same || ref.fields.find((f) => f.value);
    if (first) {
      const flat = richTextToPlain(first.value);
      if (flat) return flat;
    }
  }
  // Not a reference (plain rich text or string) — flatten `value` directly.
  if (m.value && !(typeof m.type === 'string' && m.type.includes('reference'))) {
    const flat = richTextToPlain(m.value);
    if (flat) return flat;
  }
  return fallback;
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

// ---------- expanded metaobject-reference helpers ---------------------
// The product fragment expands each foeguard.* metafield's referenced
// metaobject (one level) plus references INSIDE those fields (a second
// level, e.g. the badge list). These helpers read that shape safely.

/** Referenced metaobject's fields, keyed by field key (each value = full field obj). */
function refFields(mf, key) {
  const m = mf[key];
  if (!m || !m.reference || !Array.isArray(m.reference.fields)) return null;
  const out = {};
  for (const f of m.reference.fields) out[f.key] = f;
  return out;
}

/** Scalar `.value` of a single field inside a referenced metaobject. */
function refFieldValue(mf, key, fieldKey, fallback = null) {
  const fields = refFields(mf, key);
  if (!fields || !fields[fieldKey]) return fallback;
  const v = fields[fieldKey].value;
  return v == null || v === '' ? fallback : v;
}

/**
 * A metafield whose referenced metaobject holds a list.metaobject_reference
 * field (2 levels). Returns an array of plain {fieldKey: value} objects for
 * each nested metaobject. Used for product_page_icons_section -> badges.
 */
function nestedRefList(mf, key, listFieldKey) {
  const fields = refFields(mf, key);
  if (!fields || !fields[listFieldKey]) return [];
  const nodes = (fields[listFieldKey].references && fields[listFieldKey].references.nodes) || [];
  return nodes.map((n) => {
    const o = {};
    (n.fields || []).forEach((f) => { o[f.key] = f.value; });
    return o;
  });
}

/** Direct list.metaobject_reference metafield -> array of {fieldKey: value}. */
function refListObjects(mf, key) {
  const m = mf[key];
  if (!m) return [];
  const nodes = (m.references && m.references.nodes) || [];
  return nodes.map((n) => {
    const o = {};
    (n.fields || []).forEach((f) => { o[f.key] = f.value; });
    return o;
  });
}

/**
 * Parse a free-text "Guaranteed Analysis" block into [{label, value}] rows
 * for <NutritionSection>. Lines without a "Label: value" shape (e.g. the
 * heading) are skipped. Returns null when nothing parses.
 */
function parseNutritionText(text) {
  if (!text || typeof text !== 'string') return null;
  const rows = [];
  text.split(/\n+/).forEach((line) => {
    const l = line.trim();
    if (!l) return;
    const idx = l.indexOf(':');
    if (idx > 0 && idx < l.length - 1) {
      const label = l.slice(0, idx).trim();
      const value = l.slice(idx + 1).trim();
      if (label && value) rows.push({ label, value });
    }
  });
  return rows.length ? rows : null;
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
    mini_description: refFieldValue(mf, 'product_mini_menu_descriptions', 'product_description')
      || mfString(mf, 'mini_description')
      || plainDescription.split('.').filter(Boolean)[0] || '',
    product_line,
    protein_type,
    pet_type,
    // product_type metaobject list -> display pills e.g. ["Complete & Balanced","Meal"]
    product_types: refListObjects(mf, 'product_type').map((o) => o.product_type_title).filter(Boolean),
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

    // rich content (from Shopify metaobjects; may be null / empty)
    highlights: mfList(mf, 'highlights', []),
    // benefit_icons — list of { icon, label } pairs for the checkmark bullets
    benefit_icons: mfJson(mf, 'benefit_icons', null) || mfList(mf, 'benefit_icons', null),
    // page icon badges (product_page_icons_section -> badge titles) drive the
    // 3-icon trust row (icons/layout stay hardcoded, labels come from Shopify).
    page_icon_badges: nestedRefList(mf, 'product_page_icons_section', 'product_page_icon_section')
      .map((b) => b.badge_title || b.title).filter(Boolean),
    // Ingredients: recipe_ingredients free text from the recipe metaobject.
    ingredients: refFieldValue(mf, 'product_ingredients_nutrition', 'recipe_ingredients')
      || mfString(mf, 'ingredients') || mfList(mf, 'ingredients', []),
    ingredients_title: refFieldValue(mf, 'product_ingredients_nutrition', 'recipe_breakdown'),
    // Nutritional analysis: parse the "Guaranteed Analysis" free text into rows.
    nutritional_analysis: parseNutritionText(refFieldValue(mf, 'product_ingredients_nutrition', 'recipe_nutrition'))
      || mfJson(mf, 'nutritional_analysis', null) || mfJson(mf, 'nutrition_facts', null),
    // Alias kept for older UI components that still reference nutrition_facts
    nutrition_facts: parseNutritionText(refFieldValue(mf, 'product_ingredients_nutrition', 'recipe_nutrition'))
      || mfJson(mf, 'nutritional_analysis', null) || mfJson(mf, 'nutrition_facts', null),
    // Per-product feeding guide is NOT stored in Shopify (only a global feeding
    // guide page exists) — product_information already covers handling/feeding.
    feeding_guide: mfJson(mf, 'feeding_guide', null),
    product_information: mfReferenceText(mf, 'product_information', plainDescription),
    // Meal-plan health/weight/activity/age scores (comfort dinners only).
    meal_plan_scores: (function () {
      const raw = refFieldValue(mf, 'product_meal_plan_scores', 'product_score_json');
      if (!raw) return null;
      try { return typeof raw === 'string' ? JSON.parse(raw) : raw; } catch { return null; }
    })(),
    // Bundle weight (lbs) — only meaningful for `product_line: 'monthly_bundle'`.
    // Priority: (1) merchant metafield  (2) parse "- N lb" from the title.
    // Kept on every product (0 for non-bundles) so downstream code doesn't
    // have to null-check.
    bundle_weight_lbs: (function () {
      const raw = mfString(mf, 'bundle_weight_lbs');
      const n = raw != null ? parseFloat(raw) : NaN;
      if (Number.isFinite(n) && n > 0) return n;
      const m = String(sp.title || '').match(/-\s*(\d+(?:\.\d+)?)\s*lb/i);
      return m ? parseFloat(m[1]) : 0;
    })(),
    // comparison_table — JSON: { headers: [...], rows: [ [attr, us, kibble, ...], ... ] }
    // or {"rows": [{"attribute":"...","foeguard":"...","kibble":"..."}]}
    comparison_table: mfJson(mf, 'comparison_table', null),

    // Live customer reviews (product_customer_reviews -> section -> cards).
    // Shape: { header, subheader, cards:[{name, text, photo}] } or null.
    customer_reviews: (function () {
      const m = mf['product_customer_reviews'];
      const section = m && m.references && Array.isArray(m.references.nodes) ? m.references.nodes[0] : null;
      if (!section || !Array.isArray(section.fields)) return null;
      const sf = {}; section.fields.forEach((f) => { if (f && f.key) sf[f.key] = f; });
      const header = (sf.review_section_header && sf.review_section_header.value) || null;
      const subheader = (sf.review_section_subheader && sf.review_section_subheader.value) || null;
      const cardsField = sf.review_section_customer_cards;
      const nodes = (cardsField && cardsField.references && cardsField.references.nodes) || [];
      const cards = nodes.map((n) => {
        const o = {}; (n.fields || []).forEach((f) => { if (f && f.key) o[f.key] = f; });
        let photo = null;
        const pf = o.customer_photo;
        if (pf) {
          if (pf.reference && pf.reference.image && pf.reference.image.url) photo = pf.reference.image.url;
          else if (typeof pf.value === 'string' && pf.value.startsWith('http')) photo = pf.value;
        }
        return {
          name: (o.customer_name && o.customer_name.value) || null,
          text: (o.customer_review_text && o.customer_review_text.value) || null,
          photo,
        };
      }).filter((c) => c.text || c.name);
      return cards.length ? { header, subheader, cards } : null;
    })(),

    // Optional product FAQ list (product_faqs). Merchant may leave empty ->
    // null so the page keeps its hardcoded fallback FAQ. Supports either a
    // section metaobject with a faq items list, or a direct items list.
    faqs: (function () {
      const m = mf['product_faqs'];
      if (!m) return null;
      let itemNodes = [];
      const section = m.references && Array.isArray(m.references.nodes) ? m.references.nodes : null;
      if (m.reference && Array.isArray(m.reference.fields)) {
        // single section metaobject -> find its item list field
        const listField = m.reference.fields.find((f) => f.references && Array.isArray(f.references.nodes));
        if (listField) itemNodes = listField.references.nodes;
      } else if (section && section.length) {
        // list of items OR a single section whose field holds the items
        if (section[0] && Array.isArray(section[0].fields) &&
            section[0].fields.some((f) => f.references && Array.isArray(f.references.nodes))) {
          const listField = section[0].fields.find((f) => f.references && Array.isArray(f.references.nodes));
          itemNodes = (listField && listField.references.nodes) || [];
        } else {
          itemNodes = section;
        }
      }
      const items = (itemNodes || []).map((n) => {
        const o = {}; (n.fields || []).forEach((f) => { if (f && f.key) o[f.key] = f.value; });
        const q = o.question || o.faq_question || o.q || o.title || null;
        const a = o.answer || o.faq_answer || o.a || o.body || o.body_content || null;
        return q ? { q, a: a ? richTextToPlain(a) || a : '' } : null;
      }).filter(Boolean);
      return items.length ? items : null;
    })(),

    // Optional "meal feature" marketing section (product_meal_feature_section).
    // Passed through as flat {header, subheader, body, image} when present.
    meal_feature_section: (function () {
      const m = mf['product_meal_feature_section'];
      const ref = m && m.reference;
      if (!ref || !Array.isArray(ref.fields)) return null;
      const o = {};
      ref.fields.forEach((f) => {
        if (!f || !f.key) return;
        if (f.reference && f.reference.image && f.reference.image.url) o[f.key] = f.reference.image.url;
        else o[f.key] = f.value;
      });
      const header = o.header || o.title || o.meal_feature_header || null;
      const body = o.body_content || o.body || o.description || o.meal_feature_body || null;
      const image = Object.entries(o).find(([k, v]) => /image|photo/i.test(k) && typeof v === 'string' && v.startsWith('http'));
      return (header || body) ? {
        header,
        subheader: o.subheader || o.subheading || null,
        body: body ? (richTextToPlain(body) || body) : null,
        image: image ? image[1] : null,
      } : null;
    })(),

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
