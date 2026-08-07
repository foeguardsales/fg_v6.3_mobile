import { useEffect, useState } from 'react';
import { collections } from '../services/shopify';

// Strip HTML -> plain text (collection descriptions are short rich text).
function toText(html) {
  if (!html) return null;
  const t = String(html).replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
  return t || null;
}

/**
 * useCollectionCards(handles) — loads the given Shopify collections in one
 * batch and returns a map keyed by handle:
 *   { [handle]: { title, image, description } }
 *
 * DESIGN-SAFE: any collection that 404s / errors is simply omitted, so the
 * caller keeps its hardcoded fallback for that card. Returns {} until loaded.
 */
export function useCollectionCards(handles) {
  const [map, setMap] = useState({});
  const key = (handles || []).join('|');

  useEffect(() => {
    let alive = true;
    if (!handles || handles.length === 0) return () => {};
    Promise.all(
      handles.map((h) =>
        collections
          .getCollection(h, { productsFirst: 1 })
          .then((res) => {
            const c = (res && (res.collection || res)) || null;
            if (!c) return null;
            return {
              handle: h,
              title: c.title || null,
              image: c.image?.url || null,
              description: toText(c.descriptionHtml),
            };
          })
          .catch(() => null)
      )
    ).then((rows) => {
      if (!alive) return;
      const next = {};
      rows.forEach((r) => { if (r) next[r.handle] = r; });
      setMap(next);
    });
    return () => { alive = false; };
  }, [key]);

  return map;
}

export default useCollectionCards;
