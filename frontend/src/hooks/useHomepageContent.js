import { useState, useEffect } from 'react';
import { metaobjects } from '../services/shopify';

/**
 * Fetches every homepage section listed on the Shopify metaobject
 * `homepage_outline/homepage_outline` in one parallel batch and returns
 * a keyed object so LandingPage sections can `useHomepageContent()` and
 * override their hardcoded copy without changing structure or CSS.
 *
 * Returned shape:
 * {
 *   ready: boolean,                    // true once fetch has settled
 *   announcement: { text }             // announcement bar
 *   hero: { title, subtitle, cta, image_url, review_text, guarantee_html }
 *   identity: { title, paragraph }     // "From Soil to Serving"
 *   whyFg: { title, subtitle, comparison_images: [] }
 *   ourStory: { title, body }
 *   footerCta: { title, body, button }
 * }
 *
 * Any missing metaobject / field falls through as `null` so callers
 * default to their hardcoded copy — completely design-safe.
 */
export function useHomepageContent() {
  const [state, setState] = useState({ ready: false });

  useEffect(() => {
    let alive = true;

    Promise.all([
      metaobjects.getMetaobject('foeguard_home_announcement_bar', 'free-delivery-in-the-halton-region').catch(() => null),
      metaobjects.getMetaobject('homepage_hero', 'the-freshest-meal-your-dog-has-ever-eaten').catch(() => null),
      metaobjects.getMetaobject('home_identity_belief_section', 'home_our_belief_section_1').catch(() => null),
      metaobjects.getMetaobject('homepage_why_fg', 'home_whyfg_section').catch(() => null),
      metaobjects.getMetaobject('home_ourstory_section', 'home_ourstory_section').catch(() => null),
      metaobjects.getMetaobject('home_footer_cta', 'home_footer_cta_1').catch(() => null),
    ]).then(([announcement, hero, identity, whyFg, ourStory, footerCta]) => {
      if (!alive) return;

      // Rich-text (Shopify's TipTap-like JSON). Cheap flatten to plain text
      // works for the small snippets we display; falls back to raw string
      // when it isn't JSON.
      const flattenRich = (v) => {
        if (!v) return null;
        if (typeof v === 'string' && !v.trim().startsWith('{')) return v;
        try {
          const j = typeof v === 'string' ? JSON.parse(v) : v;
          const parts = [];
          const walk = (n) => {
            if (!n) return;
            if (n.text) parts.push(n.text);
            (n.children || []).forEach(walk);
          };
          walk(j);
          return parts.join(' ').trim() || null;
        } catch { return typeof v === 'string' ? v : null; }
      };

      // Media image → URL string. list.file_reference returns an array;
      // single file_reference returns one object.
      const imgUrl = (v) => {
        if (!v) return null;
        if (Array.isArray(v)) return v[0]?.url || null;
        return v.url || null;
      };

      setState({
        ready: true,
        announcement: announcement?.fields ? {
          text: announcement.fields.announcement_bar || null,
        } : null,
        hero: hero?.fields ? {
          title: hero.fields.hero_title_heading || null,
          subtitle: hero.fields.hero_subheading || null,
          cta: hero.fields.cta_button || null,
          image_url: imgUrl(hero.fields.hero_image_banner),
          review_text: hero.fields['5_stars_review'] || null,
          guarantee_text: flattenRich(hero.fields.guarantee_text),
        } : null,
        identity: identity?.fields ? {
          title: identity.fields.identity_section_header || null,
          paragraph: identity.fields.text_pararaph || identity.fields.text_paragraph || null,
        } : null,
        whyFg: whyFg?.fields ? {
          title: whyFg.fields.why_fg_header || null,
          subtitle: whyFg.fields.why_fg_subheader || null,
          comparison_images: (whyFg.fields.why_fg_comparison_images || [])
            .map((m) => m?.url).filter(Boolean),
        } : null,
        ourStory: ourStory?.fields ? {
          title: ourStory.fields.our_story_title || null,
          body: ourStory.fields.our_story_body || null,
        } : null,
        footerCta: footerCta?.fields ? {
          title: footerCta.fields.footer_cta_title || null,
          body: footerCta.fields.footer_cta_body || null,
          button: footerCta.fields.footer_cta_button_title || null,
        } : null,
      });
    });

    return () => { alive = false; };
  }, []);

  return state;
}

export default useHomepageContent;
