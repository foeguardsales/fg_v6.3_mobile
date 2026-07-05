/**
 * <SeoHead /> — fetches server-generated SEO from the backend and injects
 * <title>, meta description, canonical, Open Graph, Twitter card and
 * JSON-LD scripts via react-helmet-async.
 *
 * All SEO values are sourced from Shopify (via /api/seo/*); nothing is
 * hardcoded per page. Consumers just declare which SEO endpoint to hit:
 *
 *   <SeoHead endpoint="/api/seo/site/home" />
 *   <SeoHead endpoint={`/api/seo/product/${handle}`} />
 *   <SeoHead endpoint={`/api/seo/collection/${handle}`} />
 *
 * The fetched payload also drives the canonical URL and image tags.
 */
import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

// Tiny in-memory cache to avoid re-fetching the same payload on quick
// re-renders / back-forward nav within the SPA session.
const _seoCache = new Map();
const SEO_TTL_MS = 5 * 60 * 1000;

async function fetchSeo(endpoint) {
  const key = endpoint;
  const hit = _seoCache.get(key);
  const now = Date.now();
  if (hit && (now - hit.at) < SEO_TTL_MS) return hit.value;
  try {
    const { data } = await axios.get(`${BACKEND_URL}${endpoint}`);
    _seoCache.set(key, { value: data, at: now });
    return data;
  } catch (err) {
    // Keep silent — SEO is a progressive enhancement, not a page-critical
    // dependency. Fall back to whatever fallback the caller provided.
    return null;
  }
}

export const SeoHead = ({ endpoint, fallback = {} }) => {
  const [seo, setSeo] = useState(null);

  useEffect(() => {
    let cancelled = false;
    if (!endpoint) { setSeo(null); return () => {}; }
    fetchSeo(endpoint).then((data) => {
      if (!cancelled) setSeo(data);
    });
    return () => { cancelled = true; };
  }, [endpoint]);

  // Merge fetched payload over fallback (fallback provides sane values while
  // the fetch is in flight and for offline / error cases).
  const data = seo || fallback || {};
  const title = data.title || fallback.title || '';
  const description = data.description || fallback.description || '';
  const canonical = data.canonical || fallback.canonical || (typeof window !== 'undefined' ? window.location.href : '');
  const og = data.og || {};
  const tw = data.twitter || {};
  const jsonLd = Array.isArray(data.jsonLd) ? data.jsonLd : [];

  return (
    <Helmet>
      {title && <title>{title}</title>}
      {description && <meta name="description" content={description} />}
      {canonical && <link rel="canonical" href={canonical} />}

      {/* Open Graph */}
      {og.type && <meta property="og:type" content={og.type} />}
      {(og.title || title) && <meta property="og:title" content={og.title || title} />}
      {(og.description || description) && <meta property="og:description" content={og.description || description} />}
      {(og.url || canonical) && <meta property="og:url" content={og.url || canonical} />}
      {og.image && <meta property="og:image" content={og.image} />}
      {og.site_name && <meta property="og:site_name" content={og.site_name} />}

      {/* Twitter card */}
      <meta name="twitter:card" content={tw.card || 'summary_large_image'} />
      {(tw.title || og.title || title) && <meta name="twitter:title" content={tw.title || og.title || title} />}
      {(tw.description || og.description || description) && (
        <meta name="twitter:description" content={tw.description || og.description || description} />
      )}
      {(tw.image || og.image) && <meta name="twitter:image" content={tw.image || og.image} />}

      {/* JSON-LD structured data */}
      {jsonLd.map((ld, i) => (
        <script key={i} type="application/ld+json">
          {JSON.stringify(ld)}
        </script>
      ))}
    </Helmet>
  );
};

export default SeoHead;
