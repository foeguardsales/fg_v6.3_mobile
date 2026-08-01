import { useEffect, useState } from 'react';
import { metaobjects } from '../services/shopify';

/**
 * Fetches the Shopify `homepage_outline` metaobject and returns an ordered
 * list of section descriptors + a lookup helper so LandingPage can:
 *
 *   1. Hide sections the merchant has removed from the outline
 *      (fail-open: if the outline hook returns `null`, EVERY section stays
 *      visible so the site never blanks out)
 *   2. Re-order sections without a code push (merchant drags them in Shopify)
 *
 * Returned shape:
 *   { ready, sections: [{ type, handle, index }], isEnabled(type|handle) }
 */
export function useHomepageOutline() {
  const [state, setState] = useState({
    ready: false,
    sections: [],
    isEnabled: () => true, // fail-open until fetched
  });

  useEffect(() => {
    let alive = true;
    metaobjects
      .getMetaobject('homepage_outline', 'homepage_outline')
      .then((obj) => {
        if (!alive) return;
        const raw = obj?.fields?.homepage_outline;
        const sections = Array.isArray(raw)
          ? raw
              .filter((r) => r && r.type && r.handle)
              .map((r, i) => ({ type: r.type, handle: r.handle, index: i }))
          : [];
        const enabledTypes = new Set(sections.map((s) => s.type));
        const enabledHandles = new Set(sections.map((s) => s.handle));
        setState({
          ready: true,
          sections,
          // Fail-open when the outline is missing / empty
          isEnabled: (key) => {
            if (sections.length === 0) return true;
            return enabledTypes.has(key) || enabledHandles.has(key);
          },
        });
      })
      .catch(() => {
        if (!alive) return;
        setState({ ready: true, sections: [], isEnabled: () => true });
      });
    return () => { alive = false; };
  }, []);

  return state;
}

export default useHomepageOutline;
