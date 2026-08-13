import { useEffect, useState } from 'react';
import pages from '../services/shopify/pages';
import { getMetafieldMetaobjects } from '../services/shopify/pageMeta';

/**
 * Drives the Raw Starter Bundle landing page from the Shopify page
 * `raw-starter-bundle` -> `foeguard.page_builder` -> section metaobject
 * `raw_starter_bundle` (handle `page_raw_starter_bundle`).
 *
 * The backend page query expands nested metaobjects deeply enough that the
 * benefits items, how-it-works cards, testimonial cards and FAQ Q&A all arrive
 * flattened in one request. Every field falls back to null/[] so the page keeps
 * its hardcoded copy until the merchant populates Shopify.
 */
export function useRawStarterBundleContent() {
  const [state, setState] = useState({ ready: false });

  useEffect(() => {
    let alive = true;
    (async () => {
      let page = null;
      try { page = await pages.getByHandle('raw-starter-bundle'); } catch { page = null; }
      if (!alive) return;

      const sections = getMetafieldMetaobjects(page, 'page_builder') || [];
      const s = sections.find((x) => /raw_starter_bundle/.test(x.__type || '')) || sections[0];
      if (!s) { setState({ ready: true }); return; }

      const list = (v) => (Array.isArray(v) ? v.filter((x) => x && x.__type !== 'image') : []);

      // benefits
      const b = s.benefits || {};
      const benefits = {
        header: b.benefits_header || null,
        subheader: b.benefits_subheader || null,
        items: list(b.benefits_item).map((it) => ({
          title: it.benefit_list_title || it.title || null,
          text: it.benefit_list_description || it.description || null,
        })).filter((it) => it.title || it.text),
      };

      // how it works
      const h = s.how_it_works || {};
      const howItWorks = list(h.how_it_works_card).map((c, i) => ({
        title: c.how_it_works_title || c.title || `Step ${i + 1}`,
        text: c.how_it_works_body || c.body || null,
        image: c.how_it_works_image || c.image || null,
      })).filter((c) => c.title || c.text || c.image);

      // testimonials
      const t = s.testimonials || {};
      const testimonials = list(t.review_section_customer_cards).map((c) => ({
        name: c.customer_name || null,
        pet: c.customer_pet || null,
        text: c.customer_review_text || c.review || null,
        rating: parseInt(c.rating || '5', 10),
        image: c.customer_photo || null,
      })).filter((c) => c.text);

      // faq (flatten all groups)
      const fq = s.faq || {};
      const faq = [];
      list(fq.faq_category_groups).forEach((g) => {
        list(g.faq_category_items).forEach((q) => {
          const question = q.faq_question || q.question;
          const answer = _richToPlain(q.faq_answer || q.answer);
          if (question && answer) faq.push({ q: question, a: answer });
        });
      });

      // bottom cta
      const bc = s.bottom_cta || {};
      const bottomCta = (bc.footer_cta_title || bc.footer_cta_body || bc.footer_cta_button_title)
        ? {
            title: bc.footer_cta_title || null,
            body: bc.footer_cta_body || null,
            button: bc.footer_cta_button_title || null,
          }
        : null;

      setState({
        ready: true,
        heroTitle: s.hero_title || null,
        heroSubtitle: s.hero_subtitle || null,
        heroImage: _url(s.hero_image),
        productImage: _url(s.product_image),
        ctaText: s.cta_text || null,
        includes: _parseWhatsIncluded(s.what_s_included),
        howItWorks,
        benefits: (benefits.header || benefits.items.length) ? benefits : null,
        testimonials,
        faq,
        bottomCta,
      });
    })();
    return () => { alive = false; };
  }, []);

  return state;
}

function _url(v) {
  if (!v) return null;
  if (typeof v === 'string') return v;
  return v.url || null;
}

function _tryJson(v) { try { return JSON.parse(v); } catch { return null; } }

function _parseWhatsIncluded(rich) {
  if (!rich) return [];
  const json = typeof rich === 'string' ? _tryJson(rich) : rich;
  if (!json) return [];
  const items = [];
  const collectText = (node) => {
    if (!node) return '';
    if (typeof node === 'string') return node;
    if (node.type === 'text') return node.value || '';
    return (node.children || []).map(collectText).join('');
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
