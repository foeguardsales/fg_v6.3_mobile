/**
 * Shopify Page metafield helpers.
 *
 * Every marketing page (About, FAQ, Delivery, Landing, etc.) is now
 * hydrated by ``useShopifyPage(handle)`` which fetches the Shopify page
 * PLUS all its ``foeguard.*`` metafields. The keys we care about are
 * declared in /app/backend/shopify_service/queries.py > PAGE_METAFIELD_IDS.
 *
 * The merchant may leave a metafield empty; in that case the page
 * should keep its hardcoded fallback (image / text) so the site never
 * looks broken during content migration. This helper returns:
 *
 *   - a URL string if the metafield references a MediaImage
 *   - a parsed object/array if the metafield type is `json` /
 *     `list.metaobject_reference`
 *   - a plain string otherwise
 *   - `null` if the metafield is missing / empty
 *
 * Consumers should always provide a fallback, e.g.:
 *   const heroUrl = getMetafieldImage(page, 'hero') || FALLBACK_URL;
 */

// -------- indexers --------------------------------------------------

export function indexPageMetafields(page) {
  const out = {};
  if (!page || !Array.isArray(page.metafields)) return out;
  page.metafields.forEach((m) => {
    if (m && m.key) out[m.key] = m;
  });
  return out;
}

// -------- readers ---------------------------------------------------

/** Return a raw string value (or null). */
export function getMetafieldString(page, key) {
  const idx = indexPageMetafields(page);
  const m = idx[key];
  if (!m) return null;
  if (m.value === null || m.value === undefined || m.value === '') return null;
  return String(m.value);
}

/** Return a parsed JSON value (or null). Silently handles non-JSON. */
export function getMetafieldJson(page, key) {
  const raw = getMetafieldString(page, key);
  if (!raw) return null;
  try { return JSON.parse(raw); } catch { return null; }
}

/**
 * Return the URL of a MediaImage referenced by this metafield.
 *   - For `file_reference` type -> use `reference.image.url`
 *   - For scalar value pointing at a URL -> use that
 * Returns null when nothing usable is set.
 */
export function getMetafieldImage(page, key) {
  const idx = indexPageMetafields(page);
  const m = idx[key];
  if (!m) return null;
  // MediaImage reference (most common for hero / section images)
  if (m.reference && m.reference.image && m.reference.image.url) {
    return m.reference.image.url;
  }
  // Metaobject with an image field
  if (m.reference && Array.isArray(m.reference.fields)) {
    const imageField = m.reference.fields.find((f) => /image|photo|url/i.test(f.key));
    if (imageField && imageField.value) {
      try {
        const parsed = JSON.parse(imageField.value);
        if (parsed && typeof parsed === 'object' && parsed.url) return parsed.url;
      } catch { /* fall through */ }
      if (typeof imageField.value === 'string' && imageField.value.startsWith('http')) {
        return imageField.value;
      }
    }
  }
  // Value itself is a URL
  if (typeof m.value === 'string' && m.value.startsWith('http')) return m.value;
  return null;
}

/**
 * Return an ORDERED list of MediaImage URLs referenced by this metafield
 * (for `list.file_reference` fields like ``team_images``).
 * Empty array when nothing usable is set.
 */
export function getMetafieldImageList(page, key) {
  const idx = indexPageMetafields(page);
  const m = idx[key];
  if (!m || !m.references || !Array.isArray(m.references.nodes)) return [];
  const urls = [];
  m.references.nodes.forEach((n) => {
    if (n && n.image && n.image.url) urls.push(n.image.url);
    else if (n && Array.isArray(n.fields)) {
      const f = n.fields.find((x) => /image|photo|url/i.test(x.key));
      if (f && f.value) {
        try {
          const parsed = JSON.parse(f.value);
          if (parsed && parsed.url) { urls.push(parsed.url); return; }
        } catch { /* ignore */ }
        if (f.value.startsWith('http')) urls.push(f.value);
      }
    }
  });
  return urls;
}

/**
 * Return a list of metaobjects (for `list.metaobject_reference` fields
 * like `faq_groups`, `works_block`, `how_it_ships`, `facts`, `zones`).
 * Each item comes back as a flat `{ key: value }` object so components
 * can render it without knowing GraphQL shape.
 */
export function getMetafieldMetaobjects(page, key) {
  const idx = indexPageMetafields(page);
  const m = idx[key];
  if (!m || !m.references || !Array.isArray(m.references.nodes)) return [];
  return m.references.nodes.map((n) => flattenMetaobjectNode(n)).filter(Boolean);
}

/** MediaImage node OR a metaobject field's image reference -> url (or null). */
function nodeImageUrl(node) {
  if (!node) return null;
  if (node.image && node.image.url) return node.image.url;
  return null;
}

/**
 * Flatten a metaobject node into a plain `{ __type, __handle, key: value }`
 * object. Resolves (2 levels deep):
 *   - MediaImage references  -> url string
 *   - nested metaobject refs -> flattened object
 *   - nested reference lists  -> array of flattened objects / urls
 *   - JSON string values      -> parsed
 */
export function flattenMetaobjectNode(n) {
  if (!n || !Array.isArray(n.fields)) {
    // A bare MediaImage node (mixed_reference lists can contain images)
    const url = nodeImageUrl(n);
    return url ? { __type: 'image', url } : null;
  }
  const obj = { __handle: n.handle, __type: n.type };
  n.fields.forEach((f) => {
    if (!f || !f.key) return;
    // 1) Single reference (image or nested metaobject)
    if (f.reference) {
      const url = nodeImageUrl(f.reference);
      if (url) { obj[f.key] = url; return; }
      if (Array.isArray(f.reference.fields)) { obj[f.key] = flattenMetaobjectNode(f.reference); return; }
    }
    // 2) Reference list (nested metaobjects or image list)
    if (f.references && Array.isArray(f.references.nodes)) {
      obj[f.key] = f.references.nodes.map((x) => {
        const url = nodeImageUrl(x);
        if (url) return { __type: 'image', url };
        return flattenMetaobjectNode(x);
      }).filter(Boolean);
      return;
    }
    // 3) Scalar value (auto-parse JSON)
    if (f.value && (f.value.startsWith('{') || f.value.startsWith('['))) {
      try { obj[f.key] = JSON.parse(f.value); return; } catch { /* fall through */ }
    }
    obj[f.key] = f.value;
  });
  return obj;
}

export default {
  indexPageMetafields,
  getMetafieldString,
  getMetafieldJson,
  getMetafieldImage,
  getMetafieldImageList,
  getMetafieldMetaobjects,
};
