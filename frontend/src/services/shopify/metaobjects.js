// Shopify Metaobject client for the headless frontend.
//
// Backend already caches responses (webhook-invalidated), so we can call
// these liberally from React hooks without hammering Shopify.
//
// Every helper is DESIGN-SAFE by contract: it either returns clean data
// or returns `null` / `[]` so callers can fall back to hardcoded content
// without a broken UI.

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api/shopify`;

/**
 * Fetch a single metaobject entry by (type, handle).
 * Returns a normalised { id, handle, type, fields: { [key]: <value> } }
 * where <value> is:
 *   - a plain string for scalar fields
 *   - a JSON-parsed value for `json` fields
 *   - a MediaImage URL for `file_reference` → MediaImage
 *   - a Metaobject subtree for `metaobject_reference`
 *   - an array of any of the above for `list.*` fields
 *
 * Returns `null` on 404 / network error.
 */
export async function getMetaobject(type, handle) {
  try {
    const r = await fetch(`${API}/metaobject/${encodeURIComponent(type)}/${encodeURIComponent(handle)}`);
    if (!r.ok) return null;
    return _normaliseEntry(await r.json());
  } catch (_) { return null; }
}

/**
 * List every metaobject entry of a given type (published only).
 * Returns `[]` on 404 / error.
 */
export async function listMetaobjects(type, { first = 50 } = {}) {
  try {
    const r = await fetch(`${API}/metaobjects/${encodeURIComponent(type)}?first=${first}`);
    if (!r.ok) return [];
    const data = await r.json();
    return (data.nodes || []).map(_normaliseEntry);
  } catch (_) { return []; }
}

// -------- private normaliser ----------------------------------------------

function _normaliseEntry(node) {
  if (!node) return null;
  const fields = {};
  for (const f of (node.fields || [])) {
    fields[f.key] = _normaliseField(f);
  }
  return { id: node.id, handle: node.handle, type: node.type, fields };
}

function _normaliseField(f) {
  const type = f.type || '';
  const value = f.value;
  const refs = (f.references && f.references.nodes) || null;
  const ref = f.reference || null;

  // list.file_reference / list.metaobject_reference / list.product_reference / etc.
  if (type.startsWith('list.') && refs) {
    return refs.map(_normaliseRef);
  }
  if (refs && refs.length) {
    return refs.map(_normaliseRef);
  }
  if (ref) return _normaliseRef(ref);

  // Scalars
  if (type === 'json' || type === 'json_string') {
    try { return JSON.parse(value); } catch { return value; }
  }
  if (type === 'boolean') return value === 'true';
  if (type === 'number_integer') return parseInt(value, 10);
  if (type === 'number_decimal') return parseFloat(value);
  return value; // string / url / colour / date / etc.
}

function _normaliseRef(ref) {
  if (!ref) return null;
  switch (ref.__typename) {
    case 'MediaImage': {
      const img = ref.image;
      return img ? { url: img.url, alt: img.altText, width: img.width, height: img.height } : null;
    }
    case 'Metaobject': {
      const nested = {};
      for (const f of (ref.fields || [])) {
        nested[f.key] = _normaliseField(f);
      }
      return { handle: ref.handle, type: ref.type, fields: nested };
    }
    case 'Product':
    case 'Collection':
    case 'Page':
      return { id: ref.id, handle: ref.handle, title: ref.title, __type: ref.__typename };
    default:
      return ref;
  }
}
