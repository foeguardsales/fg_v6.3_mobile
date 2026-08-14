import React, { useState } from 'react';
import {
  Wind, Smile, Salad, Flame, Leaf, Droplet, ShieldCheck,
  Shield, Brain, PawPrint, HeartPulse, Sparkles, Plus, Minus,
} from 'lucide-react';
import { getMetafieldMetaobjects } from '../services/shopify/pageMeta';

/**
 * Renders a Shopify `foeguard_page_builder` metafield (an ordered
 * list.mixed_reference of section metaobjects) into on-brand sections.
 *
 * DESIGN-SAFE: unknown section types fall back to a generic title + rich-text
 * + image renderer, so new sections added in Shopify still appear. If the page
 * has no page_builder content, this renders nothing and the caller keeps its
 * existing fallback markup.
 */

// ---- Shopify rich_text_field (JSON) -> HTML string --------------------
function inlineToHtml(node) {
  if (!node) return '';
  if (typeof node.value === 'string') {
    let t = node.value
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    if (node.bold) t = `<strong>${t}</strong>`;
    if (node.italic) t = `<em>${t}</em>`;
    return t;
  }
  if (node.type === 'link' && node.url) {
    const inner = (node.children || []).map(inlineToHtml).join('');
    return `<a href="${node.url}" target="_blank" rel="noreferrer">${inner}</a>`;
  }
  return (node.children || []).map(inlineToHtml).join('');
}

export function richTextToHtml(raw) {
  if (raw == null) return '';
  let json = raw;
  if (typeof raw === 'string') {
    const t = raw.trim();
    if (!t.startsWith('{') && !t.startsWith('[')) return t ? `<p>${t}</p>` : '';
    try { json = JSON.parse(t); } catch { return `<p>${t}</p>`; }
  }
  const out = [];
  const walk = (node) => {
    if (!node) return;
    switch (node.type) {
      case 'heading': {
        const lvl = Math.min(Math.max(node.level || 3, 2), 4);
        out.push(`<h${lvl}>${(node.children || []).map(inlineToHtml).join('')}</h${lvl}>`);
        break;
      }
      case 'paragraph': {
        let inline = (node.children || []).map(inlineToHtml).join('');
        // Tidy newlines the merchant embedded inside bold labels.
        inline = inline.replace(/<strong>\s*\n+/g, '<strong>').replace(/\n+\s*<\/strong>/g, '</strong>');
        // Start a new paragraph at each newline that begins a bold heading
        // (e.g. "Retail Raw" / "Gently Cooked" / "Kibble"); keep other newlines as <br>.
        const blocks = inline
          .split(/\n+(?=<strong>)/)
          .map((b) => b.replace(/\n+/g, '<br>').replace(/^(?:<br>)+|(?:<br>)+$/g, '').trim())
          .filter(Boolean);
        (blocks.length ? blocks : [inline.replace(/\n+/g, '<br>')]).forEach((b) => out.push(`<p>${b}</p>`));
        break;
      }
      case 'list': {
        const tag = node.listType === 'ordered' ? 'ol' : 'ul';
        const items = (node.children || [])
          .map((li) => `<li>${(li.children || []).map(inlineToHtml).join('')}</li>`).join('');
        out.push(`<${tag}>${items}</${tag}>`);
        break;
      }
      default:
        (node.children || []).forEach(walk);
    }
  };
  if (json && Array.isArray(json.children)) json.children.forEach(walk);
  else if (Array.isArray(json)) json.forEach(walk);
  return out.join('');
}

const RichText = ({ value, className }) => {
  const html = richTextToHtml(value);
  if (!html) return null;
  return <div className={className} dangerouslySetInnerHTML={{ __html: html }} />;
};

// Renders a value that may be rich_text JSON OR a plain multi_line string
// (newlines become paragraphs / list rows). Keeps merchant line breaks.
const MultiText = ({ value, className }) => {
  if (value == null || value === '') return null;
  const str = typeof value === 'string' ? value.trim() : '';
  if (typeof value !== 'string' || str.startsWith('{') || str.startsWith('[')) {
    return <RichText value={value} className={className} />;
  }
  const lines = str.split(/\n+/).map((l) => l.trim()).filter(Boolean);
  if (lines.length === 0) return null;
  return (
    <div className={className}>
      {lines.map((l, i) => {
        const bullet = /^[-•*]\s+/.test(l);
        return bullet
          ? <p key={i} className="spb-bullet">{l.replace(/^[-•*]\s+/, '')}</p>
          : <p key={i}>{l}</p>;
      })}
    </div>
  );
};

// pick first non-empty among candidate field keys
const pick = (s, keys) => {
  for (const k of keys) { if (s[k] != null && s[k] !== '') return s[k]; }
  return null;
};
const imgUrl = (v) => {
  if (!v) return null;
  // Array image field (e.g. list.file_reference like `image_video`) -> first usable URL
  if (Array.isArray(v)) {
    for (const x of v) { const u = imgUrl(x); if (u) return u; }
    return null;
  }
  if (typeof v === 'string') return v;
  return v.url || null;
};

// ---- Section renderers ------------------------------------------------
function Hero({ s }) {
  const title = pick(s, ['page_hero_header', 'header', 'title']);
  const sub = pick(s, ['page_hero_subheading', 'subheading', 'subheader']);
  const img = imgUrl(pick(s, ['page_hero_image', 'image', 'background_image']));
  return (
    <>
      {img && (
        <section className="spb-hero-img" data-testid="pb-hero">
          <img src={img} alt={title || ''} />
        </section>
      )}
      {(title || sub) && (
        <section className="spb-hero-intro" data-testid="pb-hero-intro">
          <div className="spb-hero-intro-inner">
            {title && <h1 className="spb-hero-title">{title}</h1>}
            {sub && <p className="spb-hero-sub">{sub}</p>}
          </div>
        </section>
      )}
    </>
  );
}

function TextBlock({ s, i }) {
  const title = pick(s, ['title', 'header']);
  const body = pick(s, ['body_content', 'body', 'content', 'description']);
  const img = imgUrl(pick(s, ['image_video', 'image', 'media']));
  const reversed = i % 2 === 1;
  return (
    <section className={`spb-text ${img ? 'spb-text--split' : ''} ${reversed ? 'spb-text--rev' : ''}`} data-testid="pb-text">
      <div className="spb-text-body">
        {title && <h2 className="spb-h2">{title}</h2>}
        <RichText value={body} className="spb-rich" />
      </div>
      {img && <div className="spb-text-media"><img src={img} alt={title || ''} loading="lazy" /></div>}
    </section>
  );
}

function CtaBanner({ s }) {
  const title = pick(s, ['cta_title', 'title', 'header']);
  const desc = pick(s, ['cta_description', 'description', 'subheader']);
  const btn = pick(s, ['cta_button', 'button', 'button_text']);
  const label = typeof btn === 'object' ? pick(btn, ['label', 'text', 'title']) : btn;
  const href = typeof btn === 'object' ? pick(btn, ['url', 'link', 'href']) : null;
  return (
    <section className="spb-cta" data-testid="pb-cta">
      {title && <h2 className="spb-cta-title">{title}</h2>}
      {desc && <p className="spb-cta-desc">{desc}</p>}
      {label && <a className="spb-cta-btn" href={href || '/menu'}>{label}</a>}
    </section>
  );
}

// Generic "header + subheader + cards" block (benefits / protein / recipes / reviews)
function CardsBlock({ s }) {
  const header = pick(s, ['about_us_protein_header', 'review_section_header', 'benefits_header', 'header', 'title', 'section_header']);
  const sub = pick(s, ['about_us_protein_subheader', 'review_section_subheader', 'benefits_subheader', 'subheader', 'subheading']);
  // find the first array-of-objects field -> the cards
  const cardsKey = Object.keys(s).find((k) => Array.isArray(s[k]) && s[k].some((x) => x && typeof x === 'object' && x.__type !== 'image'));
  const cards = cardsKey ? s[cardsKey].filter((c) => c && c.__type !== 'image') : [];
  const bodyCandidate = pick(s, ['body_content', 'description']);
  return (
    <section className="spb-cards" data-testid="pb-cards">
      {header && <h2 className="spb-h2 spb-center">{header}</h2>}
      {sub && <p className="spb-sub spb-center">{sub}</p>}
      <RichText value={bodyCandidate} className="spb-rich spb-center" />
      {cards.length > 0 && (
        <div className="spb-card-grid">
          {cards.map((c, idx) => {
            const cImg = imgUrl(pick(c, ['image', 'icon', 'photo', 'image_video', 'card_image', 'abous_us_protein_image', 'recipe_image']));
            const cTitle = pick(c, ['title', 'header', 'name', 'customer_name', 'protein_title', 'abous_us_protein_title', 'recipe_type_title', 'benefit_item', 'feature_name']);
            const cBody = pick(c, ['body_content', 'description', 'text', 'review', 'content', 'body', 'abous_us_protein_description', 'recipe_type_body']);
            return (
              <div className="spb-card" key={idx}>
                {cImg && <img className="spb-card-img" src={cImg} alt={cTitle || ''} loading="lazy" />}
                {cTitle && <h3 className="spb-card-title">{cTitle}</h3>}
                {cBody && (typeof cBody === 'string' && (cBody.startsWith('{') || cBody.startsWith('['))
                  ? <RichText value={cBody} className="spb-card-body" />
                  : (cBody && <p className="spb-card-body">{typeof cBody === 'string' ? cBody : ''}</p>))}
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}

function ImagesBlock({ s }) {
  const imgs = [];
  Object.values(s).forEach((v) => {
    if (Array.isArray(v)) v.forEach((x) => { const u = imgUrl(x); if (u) imgs.push(u); });
    else {
      // Only real image URLs — never the metaobject's __handle / __type strings.
      const u = imgUrl(v);
      if (u && typeof v === 'string' && /^https?:\/\//.test(u)) imgs.push(u);
    }
  });
  if (imgs.length === 0) return null;
  return (
    <section className="spb-images" data-testid="pb-images">
      {imgs.map((u, i) => <img key={i} src={u} alt="" loading="lazy" />)}
    </section>
  );
}

// Find the first field that is a list of metaobjects (cards / items / rows).
function firstObjectListKey(s) {
  return Object.keys(s).find(
    (k) => Array.isArray(s[k]) && s[k].some((x) => x && typeof x === 'object' && x.__type !== 'image')
  );
}

// Benefits — original card+icon grid design, titles filled from Shopify.
const BENEFIT_ICONS = {
  'allergy relief': Wind,
  'better dental health': Smile,
  'supports digestion': Salad,
  'reduces inflammation': Flame,
  'smaller stools': Leaf,
  'naturally hydrates': Droplet,
  'fewer allergies': ShieldCheck,
  'boosts immune system': Shield,
  'boost immune system': Shield,
  'better brain activity': Brain,
  'more meal-time wags': PawPrint,
  'lower vet visits': HeartPulse,
};
const benefitIcon = (label) => BENEFIT_ICONS[String(label || '').trim().toLowerCase()] || Sparkles;

function Benefits({ s }) {
  const header = pick(s, ['benefits_header', 'header', 'title']);
  const sub = pick(s, ['benefits_subheader', 'subheader', 'subheading']);
  const key = firstObjectListKey(s);
  const items = key ? s[key].filter((x) => x && x.__type !== 'image') : [];
  const labels = items
    .map((it) => pick(it, ['benefit_item', 'title', 'label', 'name', 'text']))
    .filter(Boolean);
  if (!header && labels.length === 0) return null;
  return (
    <section className="spb-benefits-section" data-testid="pb-benefits">
      <div className="spb-benefits-inner">
        {(header || sub) && (
          <div className="spb-benefits-head">
            {header && <h2 className="spb-h2 spb-center">{header}</h2>}
            {sub && <p className="spb-sub spb-center">{sub}</p>}
          </div>
        )}
        <div className="benefits-grid">
          {labels.map((label, i) => {
            const Icon = benefitIcon(label);
            return (
              <div key={i} className="spb-benefit-card">
                <div className="spb-benefit-ic"><Icon size={28} strokeWidth={2} /></div>
                <div className="spb-benefit-lbl">{label}</div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

// Render one comparison cell: a check icon for ✓/yes, an ✕ for x/no, else raw text.
function StatusCell({ value }) {
  const t = String(value == null ? '' : value).trim();
  if (/^(✓|✔|✅|yes|true|y)$/i.test(t)) return <span className="check-icon" aria-label="Yes">✓</span>;
  if (/^(x|✕|✗|❌|no|false|n)$/i.test(t)) return <span className="status-text" aria-label="No">✕</span>;
  return <span className="status-text">{t}</span>;
}

// Comparison table — reuses the existing .comparison-table design, filled from
// Shopify so the merchant edits rows/values directly in the page_builder metafield.
function PBComparisonTable({ s }) {
  const header = pick(s, ['header', 'title']);
  const sub = pick(s, ['subheader', 'subheading']);
  const key = firstObjectListKey(s);
  const rows = key ? s[key].filter((x) => x && x.__type !== 'image') : [];
  if (rows.length === 0) return null;
  return (
    <section className="spb-compare ntf-compare" data-testid="pb-comparison-table">
      <div className="spb-compare-inner">
        {header && <h2 className="spb-h2 spb-center">{header}</h2>}
        {sub && <p className="spb-sub spb-center">{sub}</p>}
        <div className="comparison-table-wrapper">
          <table className="comparison-table">
            <thead>
              <tr>
                <th className="feature-col">Feature</th>
                <th className="brand-col foeguard-col"><span className="brand-name">FoeGuard</span></th>
                <th className="brand-col"><span className="brand-name">Retail Raw</span></th>
                <th className="brand-col"><span className="brand-name">Kibble</span></th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r, i) => (
                <tr key={i}>
                  <td className="feature-cell">{pick(r, ['feature_name', 'feature', 'title', 'name'])}</td>
                  <td className="check-cell foeguard-cell"><StatusCell value={pick(r, ['foeguard_status', 'foeguard'])} /></td>
                  <td className="check-cell"><StatusCell value={pick(r, ['retail_raw_status', 'retail_raw', 'retail'])} /></td>
                  <td className="check-cell"><StatusCell value={pick(r, ['kibble_status', 'kibble'])} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}

// Delivery timeline — numbered steps (title + description) from Shopify.
function Timeline({ s }) {
  const header = pick(s, ['timeline_header', 'header', 'title']);
  const key = firstObjectListKey(s);
  const steps = key ? s[key].filter((x) => x && x.__type !== 'image') : [];
  if (!header && steps.length === 0) return null;
  return (
    <section className="spb-timeline" data-testid="pb-timeline">
      <div className="spb-timeline-inner">
        {header && <h2 className="spb-h2 spb-center">{header}</h2>}
        <ol className="spb-timeline-steps">
          {steps.map((st, i) => {
            const t = pick(st, ['timeline_title', 'title', 'header', 'name']);
            const b = pick(st, ['timeline_description', 'description', 'body', 'text']);
            return (
              <li key={i} className="spb-timeline-step">
                <div className="spb-timeline-num">{i + 1}</div>
                <div className="spb-timeline-txt">
                  {t && <h3 className="spb-timeline-title">{t}</h3>}
                  {b && <p className="spb-timeline-desc">{b}</p>}
                </div>
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}

// FAQ — tabbed category groups with accordion Q&A (type
// `frequently_asked_questions_section`). Tabs come from `faq_category_groups`
// (category_title); each tab lists its `faq_category_items` (faq_question /
// faq_answer). Design mirrors the site's card + accordion style.
function FaqTabs({ s }) {
  const header = pick(s, ['faq_header', 'header', 'title']);
  const sub = pick(s, ['faq_subheader', 'subheader', 'subheading']);
  const groups = (Array.isArray(s.faq_category_groups) ? s.faq_category_groups : [])
    .filter((g) => g && g.__type !== 'image');
  const [active, setActive] = useState(0);
  const [openKey, setOpenKey] = useState('0-0');
  if (!header && groups.length === 0) return null;
  const activeIdx = Math.min(active, Math.max(groups.length - 1, 0));
  const activeGroup = groups[activeIdx] || {};
  const items = (Array.isArray(activeGroup.faq_category_items) ? activeGroup.faq_category_items : [])
    .filter((x) => x && x.__type !== 'image');
  return (
    <section className="spb-faq" data-testid="pb-faq">
      <div className="spb-faq-inner">
        {(header || sub) && (
          <div className="spb-faq-head">
            {header && <h1 className="spb-faq-title">{header}</h1>}
            {sub && <p className="spb-faq-sub">{sub}</p>}
          </div>
        )}
        {groups.length > 1 && (
          <div className="spb-faq-tabs" role="tablist">
            {groups.map((g, i) => (
              <button
                key={i}
                type="button"
                data-testid={`faq-tab-${i}`}
                className={`spb-faq-tab ${i === activeIdx ? 'is-active' : ''}`}
                onClick={() => { setActive(i); setOpenKey(`${i}-0`); }}
              >
                {pick(g, ['category_title', 'title', 'header']) || `Category ${i + 1}`}
              </button>
            ))}
          </div>
        )}
        <div className="spb-faq-list">
          {items.map((it, i) => {
            const key = `${activeIdx}-${i}`;
            const q = pick(it, ['faq_question', 'question', 'q', 'title']);
            const a = pick(it, ['faq_answer', 'answer', 'a', 'body', 'body_content']);
            const isOpen = openKey === key;
            if (!q) return null;
            return (
              <div className="spb-faq-item" key={key}>
                <button
                  type="button"
                  data-testid="faq-question-toggle"
                  className="spb-faq-q"
                  onClick={() => setOpenKey(isOpen ? null : key)}
                >
                  <span>{q}</span>
                  {isOpen ? <Minus size={20} /> : <Plus size={20} />}
                </button>
                {isOpen && <RichText value={a} className="spb-faq-a spb-rich" />}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

// Contact details block (type `contact_details_sections`): title + rich text
// (emails / phone). Rendered inside the contact two-column layout OR full width.
function ContactDetails({ s }) {
  const title = pick(s, ['title', 'header']);
  const body = pick(s, ['section_content', 'body_content', 'body', 'content', 'description']);
  if (!title && !body) return null;
  return (
    <section className="spb-contact-details" data-testid="pb-contact-details">
      <div className="spb-contact-details-inner">
        {title && <h2 className="spb-h2">{title}</h2>}
        <RichText value={body} className="spb-rich" />
      </div>
    </section>
  );
}

// Raw feeding guide (type `page_raw_feeding_guide`): a long-form editorial
// page. Renders the ordered blocks the merchant filled in Shopify.
function RawFeedingGuide({ s }) {
  const header = pick(s, ['header', 'title']);
  const sub = pick(s, ['subheader', 'subheading']);
  const fgTitle = pick(s, ['feeding_guide_title']);
  const fgBody = pick(s, ['feeding_guide_body']);
  const images = [];
  (Array.isArray(s.feeding_guide_images) ? s.feeding_guide_images : []).forEach((x) => {
    const u = imgUrl(x); if (u) images.push(u);
  });
  const catBody = pick(s, ['cat_disclaimer_body']);
  const transitionTitle = pick(s, ['transition_title']);
  const transitionBody = pick(s, ['transition_body']);
  const thawTitle = pick(s, ['raw_thawing_storage_title']);
  const thawBody = pick(s, ['raw_thawing_storage_body']);
  const handleTitle = pick(s, ['raw_handling_clean_up_title']);
  const handleBody = pick(s, ['raw_handling_clean_up_body']);
  return (
    <section className="spb-guide" data-testid="pb-feeding-guide">
      <div className="spb-guide-inner">
        {(header || sub) && (
          <div className="spb-guide-head">
            {header && <h1 className="spb-guide-title">{header}</h1>}
            {sub && <p className="spb-guide-sub">{sub}</p>}
          </div>
        )}
        {(fgTitle || fgBody || images.length > 0) && (
          <div className="spb-guide-block">
            {fgTitle && <h2 className="spb-h2">{fgTitle}</h2>}
            <RichText value={fgBody} className="spb-rich" />
            {images.length > 0 && (
              <div className="spb-guide-images">
                {images.map((u, i) => <img key={i} src={u} alt="Feeding guide" loading="lazy" />)}
              </div>
            )}
          </div>
        )}
        {catBody && (
          <div className="spb-guide-note">
            <MultiText value={catBody} className="spb-rich" />
          </div>
        )}
        {(transitionTitle || transitionBody) && (
          <div className="spb-guide-block">
            {transitionTitle && <h2 className="spb-h2">{transitionTitle}</h2>}
            <RichText value={transitionBody} className="spb-rich" />
          </div>
        )}
        {(thawTitle || thawBody) && (
          <div className="spb-guide-block">
            {thawTitle && <h2 className="spb-h2">{thawTitle}</h2>}
            <MultiText value={thawBody} className="spb-rich" />
          </div>
        )}
        {(handleTitle || handleBody) && (
          <div className="spb-guide-block">
            {handleTitle && <h2 className="spb-h2">{handleTitle}</h2>}
            <MultiText value={handleBody} className="spb-rich" />
          </div>
        )}
      </div>
    </section>
  );
}

function renderSection(s, i) {
  const type = s.__type || '';
  if (/frequently_asked_questions|faq/.test(type)) return <FaqTabs key={i} s={s} />;
  if (/contact_details/.test(type)) return <ContactDetails key={i} s={s} />;
  if (/raw_feeding_guide|feeding_guide/.test(type)) return <RawFeedingGuide key={i} s={s} />;
  if (/hero/.test(type)) return <Hero key={i} s={s} />;
  if (/timeline/.test(type)) return <Timeline key={i} s={s} />;
  if (/comparison_table|comparison/.test(type)) return <PBComparisonTable key={i} s={s} />;
  if (/benefits/.test(type)) return <Benefits key={i} s={s} />;
  if (/text_block/.test(type)) return <TextBlock key={i} s={s} i={i} />;
  if (/cta/.test(type)) return <CtaBanner key={i} s={s} />;
  if (/compare_images|images/.test(type)) return <ImagesBlock key={i} s={s} />;
  if (/protein|recipes|reviews|contact|social|details/.test(type)) return <CardsBlock key={i} s={s} />;
  // generic fallback
  return <CardsBlock key={i} s={s} />;
}

export default function ShopifyPageBuilder({ page, className }) {
  const sections = React.useMemo(() => getMetafieldMetaobjects(page, 'page_builder'), [page]);
  if (!sections || sections.length === 0) return null;
  return (
    <div className={`shopify-page-builder ${className || ''}`} data-testid="shopify-page-builder">
      {sections.map((s, i) => renderSection(s, i))}
    </div>
  );
}
