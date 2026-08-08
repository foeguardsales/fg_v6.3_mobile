import { useState, useEffect } from 'react';

// Pulls the live home review cards from the Shopify `home_customer_reviews_section`
// metaobject (handle `home_reviews_section`). Each card resolves to
// { name, text, rating, img } — same shape the homepage review feed already uses,
// so the existing card design is untouched. Falls back to [] on any error.
const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

export function useHomeReviews() {
  const [state, setState] = useState({ header: null, subheader: null, cards: [] });

  useEffect(() => {
    let alive = true;
    fetch(`${API}/shopify/metaobject/home_customer_reviews_section/home_reviews_section`)
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => {
        if (!alive || !d || !Array.isArray(d.fields)) return;
        const byKey = {};
        d.fields.forEach((f) => { if (f && f.key) byKey[f.key] = f; });
        const header = (byKey.review_section_header && byKey.review_section_header.value) || null;
        const subheader = (byKey.review_section_subheader && byKey.review_section_subheader.value) || null;
        const nodes = (byKey.review_section_customer_cards
          && byKey.review_section_customer_cards.references
          && byKey.review_section_customer_cards.references.nodes) || [];
        const cards = nodes.map((n) => {
          const o = {};
          (n.fields || []).forEach((f) => { if (f && f.key) o[f.key] = f; });
          const photoField = o.customer_photo || {};
          const img = (photoField.reference && photoField.reference.image && photoField.reference.image.url)
            || (typeof photoField.value === 'string' && photoField.value.startsWith('http') ? photoField.value : null);
          const text = ((o.customer_review_text && o.customer_review_text.value) || '')
            .replace(/^[\s"\u201C\u201D]+|[\s"\u201C\u201D]+$/g, '');
          return {
            name: (o.customer_name && o.customer_name.value) || '',
            text,
            rating: 5,
            img,
          };
        }).filter((c) => c.text || c.name);
        if (alive && cards.length) setState({ header, subheader, cards });
      })
      .catch(() => { /* keep fallback */ });
    return () => { alive = false; };
  }, []);

  return state;
}

export default useHomeReviews;
