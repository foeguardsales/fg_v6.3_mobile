/**
 * CollectionPage — dynamic Shopify collection page at /collection/:handle.
 *
 * Fetches the Storefront collection by handle (title, description,
 * descriptionHtml, image, seo, and paginated products) and renders it
 * with the site’s existing look-and-feel: full-bleed hero + a responsive
 * product grid where every card links to the corresponding PDP.
 *
 * All product data comes from Shopify — nothing hardcoded.
 */
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Navbar, Footer } from '../components/Layout';
import { SeoHead } from '../components/SeoHead';
import { catalog as shopifyCatalog } from '../services/shopify';

export const CollectionPage = () => {
  const { handle } = useParams();
  const navigate = useNavigate();
  const [collection, setCollection] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    shopifyCatalog.getCollectionByHandle(handle)
      .then((c) => { if (!cancelled) { setCollection(c); setLoading(false); } })
      .catch((err) => { if (!cancelled) { setError(err); setLoading(false); } });
    return () => { cancelled = true; };
  }, [handle]);

  if (loading) {
    return (
      <>
        <Navbar />
        <div style={{ padding: '80px 20px', textAlign: 'center' }}>Loading collection…</div>
        <Footer />
      </>
    );
  }

  if (!collection) {
    return (
      <>
        <Navbar />
        <div style={{ padding: '80px 20px', textAlign: 'center' }}>
          <h1 style={{ fontFamily: "'Barlow Semi Condensed', serif", fontSize: '28px', color: '#3B2A1A' }}>Collection not found</h1>
          <button onClick={() => navigate('/menu')} className="btn-primary" style={{ marginTop: '24px', padding: '12px 24px' }}>Browse Menu</button>
        </div>
        <Footer />
      </>
    );
  }

  const products = collection.products || [];

  return (
    <>
      <SeoHead endpoint={`/api/seo/collection/${encodeURIComponent(handle)}`} />
      <Navbar />

      {/* Hero */}
      <section
        data-testid="collection-hero"
        style={{
          background: collection.image ? `linear-gradient(rgba(59,42,26,0.55), rgba(59,42,26,0.55)), url("${collection.image}") center/cover no-repeat` : '#3B2A1A',
          color: '#FFF',
          padding: '80px 20px',
          textAlign: 'center',
        }}
      >
        <h1 style={{ fontFamily: "'Barlow Semi Condensed', serif", fontSize: 'clamp(32px, 5vw, 56px)', fontWeight: 700, margin: 0 }}>
          {collection.title}
        </h1>
        {collection.description && (
          <p style={{ fontSize: '17px', maxWidth: '640px', margin: '18px auto 0', lineHeight: 1.6, color: '#EDE6DA' }}>
            {collection.description}
          </p>
        )}
      </section>

      {/* Product grid */}
      <section style={{ maxWidth: '1200px', margin: '0 auto', padding: '48px 20px' }}>
        {products.length === 0 ? (
          <div style={{ textAlign: 'center', color: '#666' }}>No products in this collection yet.</div>
        ) : (
          <div
            data-testid="collection-product-grid"
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
              gap: '20px',
            }}
          >
            {products.map((p) => {
              const isTreat = p.product_line === 'meaty_bone_treats';
              const to = isTreat ? `/treat/${p.handle}` : `/product/${p.handle}`;
              return (
                <Link
                  key={p.handle}
                  to={to}
                  data-testid={`collection-card-${p.handle}`}
                  style={{
                    background: '#FFF',
                    border: '1px solid #EDEAE7',
                    borderRadius: '14px',
                    overflow: 'hidden',
                    textDecoration: 'none',
                    color: '#3B2A1A',
                    display: 'flex',
                    flexDirection: 'column',
                  }}
                >
                  <div style={{ aspectRatio: '1 / 1', background: '#F5F1EB', overflow: 'hidden' }}>
                    {p.image && (
                      <img
                        src={p.image}
                        alt={p.name}
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      />
                    )}
                  </div>
                  <div style={{ padding: '14px 16px' }}>
                    <div style={{ fontWeight: 700, fontSize: '15px', marginBottom: '4px' }}>{p.name}</div>
                    <div style={{ fontSize: '14px', color: '#c8102e', fontWeight: 600 }}>
                      ${Number(p.price || 0).toFixed(2)} <span style={{ color: '#888', fontWeight: 500 }}>{p.currency || 'CAD'}</span>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </section>

      <Footer />
    </>
  );
};

export default CollectionPage;
