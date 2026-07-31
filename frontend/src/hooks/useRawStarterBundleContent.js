import { useEffect, useState } from 'react';
import { metaobjects } from '../services/shopify';

/**
 * Fetches the Shopify metaobject that drives the Raw Starter Bundle landing
 * page (type `raw_starter_bundle`, handle `page_raw_starter_bundle`) and
 * resolves its second-level references (benefits items, how-it-works steps,
 * FAQ groups, testimonials).
 *
 * Every field returned falls back to `null` / `[]` when the merchant has not
 * populated it yet, so the page renders with its hardcoded copy and remains
 * 100% design-safe. As soon as Shopify has real content, this hook takes over.
 *
 * Returned shape:
 * {
 *   ready: boolean,
 *   heroTitle, heroSubtitle, heroImage, productImage, ctaText,
 *   includes: [{ text, bold }],       // parsed from rich_text_field
 *   howItWorks: [{ title, text, image }],
 *   benefits:   { header, subheader, items: [{ title, text, image }] },
 *   testimonials: [{ name, pet, text, rating }],
 *   faq:        [{ q, a }],
 *   bottomCta:  { title, body, button },
 * }
 */
export function useRawStarterBundleContent() {
  const [state, setState] = useState({ ready: false });

  useEffect(() => {
    let alive = true;
    (async () => {
      const root = await metaobjects.getMetaobject(
        'raw_starter_bundle',
        'page_raw_starter_bundle'
      );
      if (!alive) return;
      if (!root) { setState({ ready: true }); return; }

      const f = root.fields || {};
      const includes = _parseWhatsIncluded(f.what_s_included);

      // Second-level metaobject refs — normaliser gives us the nested `fields`
      // with only scalar values (no further ref resolution). That's fine: for
      // benefits_item / testimonials_list we do a second parallel fetch by
      // handle so we get the actual entries.
      const [benefits, howItWorks, faq, testimonials, bottomCta] = await Promise.all([
        _resolveBenefits(f.benefits),
        _resolveHowItWorks(f.how_it_works),
        _resolveFaq(f.faq),
        _resolveTestimonials(f.testimonials),
        _resolveBottomCta(f.bottom_cta),
      ]);
      if (!alive) return;

      setState({
        ready: true,
        heroTitle: f.hero_title || null,
        heroSubtitle: f.hero_subtitle || null,
        heroImage: f.hero_image?.url || null,
        productImage: f.product_image?.url || null,
        ctaText: f.cta_text || null,
        includes,
        howItWorks,
        benefits,
        testimonials,
        faq,
        bottomCta,
      });
    })();
    return () => { alive = false; };
  }, []);

  return state;
}

// ---------------------------------------------------------------------------
// what_s_included is a rich_text_field. We only need the top-level
// unordered-list items so we walk the JSON tree looking for list-item nodes.
// ---------------------------------------------------------------------------
function _parseWhatsIncluded(rich) {
  if (!rich) return [];
  const json = typeof rich === 'string' ? _tryJson(rich) : rich;
  if (!json) return [];
  const items = [];
  const collectText = (node) => {
    if (!node) return '';
    if (typeof node === 'string') return node;
    if (node.type === 'text') return node.value || '';
    const kids = node.children || [];
    return kids.map(collectText).join('');
  };
  const walk = (node) => {
    if (!node) return;
    if (node.type === 'list-item') {
      const text = collectText(node).replace(/\s+/g, ' ').trim();
      if (text) items.push(text);
      return;
    }
    (node.children || []).forEach(walk);
  };
  walk(json);
  return items;
}

function _tryJson(v) {
  try { return JSON.parse(v); } catch { return null; }
}

// ---------------------------------------------------------------------------
// Second-level ref resolution helpers. All are best-effort; any failure
// returns null/[] so the page falls back to its hardcoded copy.
// ---------------------------------------------------------------------------
async function _resolveMeta(entry) {
  // The catalog normaliser already gives us `entry.fields`; but the child
  // metaobject-reference lists inside are still raw GID arrays / strings.
  // For each GID we need the (type, handle) pair — we can only get it by
  // re-fetching. Storefront doesn't expose "get by id", so we rely on the
  // catalog reference itself (`entry.handle`, `entry.type`).
  if (!entry || !entry.handle || !entry.type) return null;
  return metaobjects.getMetaobject(entry.type, entry.handle);
}

async function _resolveBenefits(ref) {
  const root = await _resolveMeta(ref);
  if (!root) return null;
  const f = root.fields || {};
  const gids = _asArray(f.benefits_item);
  const items = await _fetchByGids(gids, 'home_raw_benefits_item');
  return {
    header: f.benefits_header || null,
    subheader: f.benefits_subheader || null,
    items: items.map((it) => ({
      title: it.fields?.benefit_title || it.fields?.title || null,
      text: it.fields?.benefit_description || it.fields?.description || null,
      image: it.fields?.benefit_image?.url || null,
    })).filter((it) => it.title || it.text),
  };
}

async function _resolveHowItWorks(ref) {
  const root = await _resolveMeta(ref);
  if (!root) return [];
  const f = root.fields || {};
  const gids = _asArray(f.how_it_works_item || f.steps);
  const items = await _fetchByGids(gids, 'how_it_works_item');
  return items.map((it, i) => ({
    title: it.fields?.step_title || it.fields?.title || `Step ${i + 1}`,
    text: it.fields?.step_description || it.fields?.description || null,
    image: it.fields?.step_image?.url || it.fields?.image?.url || null,
  })).filter((it) => it.title || it.text || it.image);
}

async function _resolveFaq(ref) {
  const root = await _resolveMeta(ref);
  if (!root) return [];
  const f = root.fields || {};
  // faq_category_groups → list of groups → each has questions
  const groupGids = _asArray(f.faq_category_groups);
  const groups = await _fetchByGids(groupGids, 'faq_category_group');
  const flat = [];
  for (const g of groups) {
    const qGids = _asArray(g.fields?.faq_questions || g.fields?.questions);
    // Questions typically live in a metaobject of type frequently_asked_question
    const qs = await _fetchByGids(qGids, 'frequently_asked_question');
    for (const q of qs) {
      flat.push({
        q: q.fields?.question || null,
        a: _richToPlain(q.fields?.answer),
      });
    }
  }
  return flat.filter((x) => x.q && x.a);
}

async function _resolveTestimonials(ref) {
  const root = await _resolveMeta(ref);
  if (!root) return [];
  const f = root.fields || {};
  const gids = _asArray(f.testimonials || f.testimonial_items);
  const items = await _fetchByGids(gids, 'testimonial');
  return items.map((it) => ({
    name: it.fields?.name || it.fields?.author || null,
    pet: it.fields?.pet_name || it.fields?.pet || null,
    text: it.fields?.review || it.fields?.body || it.fields?.text || null,
    rating: parseInt(it.fields?.rating || '5', 10),
  })).filter((it) => it.text);
}

async function _resolveBottomCta(ref) {
  const root = await _resolveMeta(ref);
  if (!root) return null;
  const f = root.fields || {};
  return {
    title: f.footer_cta_title || null,
    body: f.footer_cta_body || null,
    button: f.footer_cta_button_title || null,
  };
}

// ---------------------------------------------------------------------------
// The Storefront normaliser returns list.metaobject_reference values as an
// array of shallow entries `{ handle, type, fields }`. When those aren't
// pre-expanded (e.g. deeply nested), the raw value is a stringified JSON
// list of GIDs. Storefront's Metaobject query only supports (type, handle)
// lookups, so we can only resolve the pre-expanded variant. For the raw-GID
// variant we return whatever the catalog gave us and move on.
// ---------------------------------------------------------------------------
function _asArray(v) {
  if (!v) return [];
  if (Array.isArray(v)) return v;
  if (typeof v === 'string') {
    const j = _tryJson(v);
    return Array.isArray(j) ? j : [];
  }
  return [];
}

async function _fetchByGids(items, _hintType) {
  // If the normaliser already gave us metaobject subtrees, use them directly.
  const resolved = [];
  for (const it of items) {
    if (it && typeof it === 'object' && it.fields) {
      resolved.push(it);
    }
    // Raw string GIDs cannot be resolved via Storefront API (no getById).
    // Callers gracefully skip these; page falls back to hardcoded copy.
  }
  return resolved;
}

function _richToPlain(v) {
  if (!v) return null;
  if (typeof v === 'string' && !v.trim().startsWith('{')) return v;
  const j = typeof v === 'string' ? _tryJson(v) : v;
  if (!j) return typeof v === 'string' ? v : null;
  const parts = [];
  const walk = (n) => {
    if (!n) return;
    if (typeof n === 'string') { parts.push(n); return; }
    if (n.type === 'text' && n.value) parts.push(n.value);
    (n.children || []).forEach(walk);
  };
  walk(j);
  return parts.join(' ').replace(/\s+/g, ' ').trim() || null;
}

export default useRawStarterBundleContent;
