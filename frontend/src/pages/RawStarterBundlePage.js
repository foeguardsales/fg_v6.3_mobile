import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Check, Star, ChevronDown, Truck, Snowflake, Heart } from 'lucide-react';
import { useRawStarterBundleContent } from '../hooks/useRawStarterBundleContent';

/* -------------------------------------------------------------------------
 * STANDALONE Raw Starter Bundle landing page (Prompt 5).
 * NOT linked in the site nav — a focused destination for social ads / CTAs.
 * All content (hero, images, includes, benefits, FAQ, CTA) is now driven by
 * the Shopify metaobject `raw_starter_bundle / page_raw_starter_bundle` via
 * useRawStarterBundleContent(). Every field falls back to the hardcoded copy
 * below when the merchant hasn't populated it yet — design stays untouched.
 * ----------------------------------------------------------------------- */

const C = {
  red: '#C8102E',
  redDark: '#9D0D23',
  cream: '#F5F3EF',
  straw: '#E8DFC8',
  khaki: '#D8CFB8',
  almond: '#EEE4CE',
  charcoal: '#2C2C2C',
  forest: '#2F4538',
  sage: '#7A9A7A',
  gold: '#C9A84C',
};

// ---- Hardcoded fallbacks (used ONLY when Shopify metaobject fields are empty) ----
const BUNDLE = {
  title: 'Raw Starter Bundle',
  handle: 'raw-starter-bundle',
  image: 'https://images.unsplash.com/photo-1745252798506-29500efc5b39?crop=entropy&cs=srgb&fm=jpg&q=85&w=1200',
  includes: [
    '4 lbs of farm-fresh raw meals across our best-selling proteins',
    'A free bag of single-ingredient training treats',
    'Personalised feeding & transition guide for your dog',
    'Reusable insulated delivery box + ice packs',
    'Free delivery in the Halton Region',
  ],
};

const IMAGES = {
  hero: 'https://images.unsplash.com/photo-1745252798506-29500efc5b39?crop=entropy&cs=srgb&fm=jpg&q=85&w=1600',
  product: 'https://images.pexels.com/photos/30070533/pexels-photo-30070533.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=900&w=1200',
  step1: 'https://images.unsplash.com/photo-1695023267262-7f4ab64152b2?crop=entropy&cs=srgb&fm=jpg&q=85&w=900',
  step2: 'https://images.unsplash.com/photo-1745252798506-29500efc5b39?crop=entropy&cs=srgb&fm=jpg&q=85&w=900',
  step3: 'https://images.unsplash.com/photo-1530281700549-e82e7bf110d6?crop=entropy&cs=srgb&fm=jpg&q=85&w=900',
  benefits: 'https://images.unsplash.com/photo-1632498301446-5f78baad40d0?crop=entropy&cs=srgb&fm=jpg&q=85&w=1200',
};

const HOW_IT_WORKS = [
  { img: IMAGES.step1, title: '1. We build your box', text: 'Your Starter Bundle arrives portioned and ready — a curated mix of our farm-fresh raw proteins, matched to everyday feeding.' },
  { img: IMAGES.step2, title: '2. Thaw & serve', text: 'Thaw a pack in the fridge overnight, then scoop into the bowl. No prep, no cooking, no mess — just real food.' },
  { img: IMAGES.step3, title: '3. Watch them thrive', text: 'Shinier coats, cleaner teeth, better digestion and more energy — the raw difference shows up fast.' },
];

const BENEFITS = [
  { icon: Heart, title: 'Human-grade & 100% natural', text: 'No fillers, by-products, additives or preservatives — ever.' },
  { icon: Snowflake, title: 'Fresh, then flash-frozen', text: 'Prepared fresh on our Ontario farm and flash-frozen to lock in nutrients.' },
  { icon: Truck, title: 'Delivered to your door', text: 'Free local delivery in an insulated, reusable box with ice packs.' },
  { icon: Check, title: 'Risk-free to try', text: 'A happy dog or your money back — guaranteed.' },
];

const FAQS = [
  { q: 'What exactly is in the Raw Starter Bundle?', a: 'A curated 4 lb mix of our best-selling farm-fresh raw proteins, a free bag of training treats, a personalised feeding guide, and a reusable insulated delivery box.' },
  { q: 'Is raw food safe for my dog?', a: 'Yes. Every meal is made from certified human-grade ingredients in a government-regulated facility, then flash-frozen for safe delivery. We include a full handling and transition guide.' },
  { q: 'How do I transition my dog to raw?', a: 'Your bundle includes a step-by-step transition guide. Most dogs switch over 5–7 days; we walk you through it.' },
  { q: 'When and where do you deliver?', a: 'We currently offer free delivery across the Halton Region. You choose a delivery date at checkout (minimum 3 days out so everything arrives fresh).' },
  { q: 'What if my dog doesn’t like it?', a: 'You’re covered by our happy-dog guarantee — if it’s not a fit, we’ll make it right.' },
];

const REVIEWS = [
  { name: 'Sarah M.', pet: 'with Luna', text: 'Luna went crazy for it from day one. Her coat is noticeably shinier after just three weeks. The starter box made switching so easy.' },
  { name: 'James T.', pet: 'with Cooper', text: 'I was nervous about raw feeding but the guide walked me through everything. Cooper’s digestion has never been better.' },
  { name: 'Priya K.', pet: 'with Bella', text: 'The delivery box is gorgeous and everything arrived frozen solid. Bella now sits by her bowl waiting. Worth every penny.' },
];

const FaqItem = ({ q, a }) => {
  const [open, setOpen] = useState(false);
  return (
    <div style={{ borderBottom: `1px solid ${C.khaki}` }}>
      <button
        onClick={() => setOpen((o) => !o)}
        style={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '16px', padding: '20px 4px', background: 'transparent', border: 'none', cursor: 'pointer', textAlign: 'left' }}
      >
        <span style={{ fontFamily: 'var(--font-heading)', fontSize: '18px', color: C.charcoal, fontWeight: 600 }}>{q}</span>
        <ChevronDown size={22} color={C.red} style={{ transform: open ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s', flexShrink: 0 }} />
      </button>
      {open && <p style={{ margin: '0 4px 22px', color: '#5a5a5a', fontSize: '15px', lineHeight: 1.7 }}>{a}</p>}
    </div>
  );
};

const CtaButton = ({ children, testid, variant = 'primary', onClick, busy }) => (
  <button
    onClick={onClick}
    disabled={busy}
    data-testid={testid}
    style={{
      display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '10px',
      background: variant === 'primary' ? C.red : 'transparent',
      color: variant === 'primary' ? C.cream : C.charcoal,
      border: variant === 'primary' ? 'none' : `2px solid ${C.charcoal}`,
      padding: '16px 40px', borderRadius: '8px',
      fontFamily: 'var(--font-heading)', fontSize: '17px', fontWeight: 700, letterSpacing: '0.01em',
      cursor: busy ? 'wait' : 'pointer', boxShadow: variant === 'primary' ? '0 6px 18px rgba(200,16,46,0.28)' : 'none',
    }}
  >
    {busy ? 'One moment…' : children}
  </button>
);

export const RawStarterBundlePage = () => {
  const navigate = useNavigate();
  const [notice, setNotice] = useState('');
  const [busy, setBusy] = useState(false);
  const content = useRawStarterBundleContent();

  useEffect(() => {
    document.title = 'Raw Starter Bundle — FoeGuard';
  }, []);

  // CTA — kick users into the SHARED meal-plan questionnaire; the ?source flag
  // tells MealPlanPage to render the "Your Recommended Starter Pack" outcome
  // (fixed 12lb, top 3 proteins, protein dropdowns only) instead of the
  // regular "Your Recommended Box" outcome. Same funnel, different result page.
  const handleBuy = () => {
    setNotice('');
    setBusy(true);
    navigate('/meal-plan?source=starter-pack');
  };

  // ------ Resolved copy (Shopify metaobject → hardcoded fallback) ------
  const heroTitle    = content.heroTitle    || 'Give your dog the freshest meal they’ve ever eaten.';
  const heroSubtitle = content.heroSubtitle || 'The Raw Starter Bundle is the easiest way to try 100% organic, human-grade raw food — portioned, delivered, and ready to serve.';
  const heroImage    = content.heroImage    || IMAGES.hero;
  const productImage = content.productImage || BUNDLE.image;
  const ctaText      = content.ctaText      || 'Build Your Starter Bundle';
  const includes     = (content.includes && content.includes.length) ? content.includes : BUNDLE.includes;
  const howItWorks   = (content.howItWorks && content.howItWorks.length) ? content.howItWorks : HOW_IT_WORKS;
  const benefits     = content.benefits;
  const benefitsHeader    = benefits?.header    || 'Why dogs (and their humans) love it';
  const benefitsSubheader = benefits?.subheader || null;
  const benefitItems      = (benefits?.items && benefits.items.length)
    ? benefits.items.map((b, i) => ({
        icon: BENEFITS[i % BENEFITS.length].icon,
        title: b.title || BENEFITS[i % BENEFITS.length].title,
        text: b.text || BENEFITS[i % BENEFITS.length].text,
      }))
    : BENEFITS;
  const testimonials = (content.testimonials && content.testimonials.length)
    ? content.testimonials
    : REVIEWS.map((r) => ({ ...r, rating: 5 }));
  const faq          = (content.faq && content.faq.length) ? content.faq : FAQS;
  const bottomCta    = content.bottomCta;
  const bottomCtaTitle  = bottomCta?.title  || 'Ready to make the switch?';
  const bottomCtaBody   = bottomCta?.body   || 'Try the Raw Starter Bundle risk-free today.';
  const bottomCtaButton = bottomCta?.button || ctaText;

  const maxW = { maxWidth: '1120px', margin: '0 auto', padding: '0 24px' };
  const bundleTitle = BUNDLE.title;

  return (
    <div style={{ background: C.cream, color: C.charcoal, fontFamily: 'var(--font-body)', minHeight: '100vh' }} data-testid="raw-starter-bundle-page">
      {/* slim brand bar (no nav — focused ad landing) */}
      <div style={{ background: C.red, textAlign: 'center', padding: '14px 0' }}>
        <span style={{ fontFamily: 'var(--font-heading)', color: C.cream, fontWeight: 800, letterSpacing: '0.18em', fontSize: '18px' }}>FOEGUARD</span>
      </div>

      {/* 1–3. HEADER + SUBHEADER + CTA (hero) */}
      <section style={{ position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, backgroundImage: `url(${heroImage})`, backgroundSize: 'cover', backgroundPosition: 'center' }} />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(90deg, rgba(20,15,12,0.82) 0%, rgba(20,15,12,0.55) 55%, rgba(20,15,12,0.25) 100%)' }} />
        <div style={{ ...maxW, position: 'relative', padding: '96px 24px' }}>
          <div style={{ maxWidth: '600px' }}>
            <span style={{ display: 'inline-block', background: C.gold, color: C.charcoal, fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: '13px', letterSpacing: '0.08em', padding: '6px 14px', borderRadius: '20px', marginBottom: '22px' }}>
              LIMITED-TIME STARTER OFFER
            </span>
            <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '52px', lineHeight: 1.05, color: C.cream, margin: '0 0 18px', fontWeight: 800 }}>
              {heroTitle}
            </h1>
            <p style={{ fontSize: '20px', lineHeight: 1.5, color: 'rgba(245,243,239,0.92)', margin: '0 0 30px', whiteSpace: 'pre-line' }}>
              {heroSubtitle}
            </p>
            <div style={{ display: 'flex', alignItems: 'center', gap: '20px', flexWrap: 'wrap' }}>
              <CtaButton testid="hero-cta" onClick={handleBuy} busy={busy}>{ctaText}</CtaButton>
            </div>
            <p style={{ color: 'rgba(245,243,239,0.8)', fontSize: '14px', marginTop: '16px' }}>★★★★★ Loved by hundreds of Ontario dogs • Free local delivery</p>
          </div>
        </div>
      </section>

      {/* 4–6. PRODUCT IMAGE + INCLUDES LIST + CTA */}
      <section style={{ ...maxW, padding: '80px 24px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '56px', alignItems: 'center' }} className="rsb-two-col">
          <div>
            <img src={productImage} alt={bundleTitle} style={{ width: '100%', borderRadius: '16px', objectFit: 'cover', aspectRatio: '4/3', boxShadow: '0 16px 40px rgba(0,0,0,0.12)' }} />
          </div>
          <div>
            <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '34px', margin: '0 0 20px', fontWeight: 800 }}>{bundleTitle}</h2>
            <p style={{ fontFamily: 'var(--font-heading)', fontSize: '18px', fontWeight: 700, margin: '0 0 14px' }}>Raw Starter Bundle includes:</p>
            <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 30px' }} data-testid="bundle-includes">
              {includes.map((item) => (
                <li key={item} style={{ display: 'flex', gap: '12px', alignItems: 'flex-start', padding: '9px 0', fontSize: '16px', lineHeight: 1.5 }}>
                  <span style={{ flexShrink: 0, width: '24px', height: '24px', borderRadius: '50%', background: C.sage, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', marginTop: '1px' }}>
                    <Check size={15} color={C.cream} />
                  </span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            <CtaButton testid="includes-cta" onClick={handleBuy} busy={busy}>{ctaText}</CtaButton>
            {notice && <p style={{ marginTop: '16px', color: C.redDark, fontSize: '14px' }} data-testid="rsb-notice">{notice}</p>}
          </div>
        </div>
      </section>

      {/* 7. HOW IT WORKS — 3 images with text */}
      <section style={{ background: C.almond, padding: '80px 0' }}>
        <div style={maxW}>
          <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '36px', textAlign: 'center', margin: '0 0 48px', fontWeight: 800 }}>How it works</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '32px' }} className="rsb-three-col">
            {howItWorks.slice(0, 3).map((s, i) => (
              <div key={s.title || i} style={{ textAlign: 'center' }}>
                <img src={s.image || HOW_IT_WORKS[i % HOW_IT_WORKS.length].img} alt={s.title || `Step ${i + 1}`} style={{ width: '100%', height: '220px', objectFit: 'cover', borderRadius: '14px', marginBottom: '20px', boxShadow: '0 10px 26px rgba(0,0,0,0.1)' }} />
                <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '21px', margin: '0 0 10px', fontWeight: 700 }}>{s.title || HOW_IT_WORKS[i % HOW_IT_WORKS.length].title}</h3>
                <p style={{ color: '#5a5a5a', fontSize: '15px', lineHeight: 1.7, margin: 0 }}>{s.text || HOW_IT_WORKS[i % HOW_IT_WORKS.length].text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 8. BENEFITS */}
      <section style={{ ...maxW, padding: '80px 24px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '56px', alignItems: 'center' }} className="rsb-two-col">
          <div>
            <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '36px', margin: '0 0 12px', fontWeight: 800 }}>{benefitsHeader}</h2>
            {benefitsSubheader && (
              <p style={{ color: '#5a5a5a', fontSize: '16px', lineHeight: 1.6, margin: '0 0 24px' }}>{benefitsSubheader}</p>
            )}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '26px' }} className="rsb-two-col">
              {benefitItems.slice(0, 6).map((b, i) => {
                const Icon = b.icon || BENEFITS[i % BENEFITS.length].icon;
                return (
                  <div key={b.title || i}>
                    <div style={{ width: '46px', height: '46px', borderRadius: '12px', background: C.straw, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '14px' }}>
                      <Icon size={24} color={C.red} />
                    </div>
                    <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '18px', margin: '0 0 6px', fontWeight: 700 }}>{b.title}</h3>
                    <p style={{ color: '#5a5a5a', fontSize: '14px', lineHeight: 1.6, margin: 0 }}>{b.text}</p>
                  </div>
                );
              })}
            </div>
          </div>
          <img src={IMAGES.benefits} alt="Happy dog and owner" style={{ width: '100%', borderRadius: '16px', objectFit: 'cover', aspectRatio: '4/5', boxShadow: '0 16px 40px rgba(0,0,0,0.12)' }} />
        </div>
      </section>

      {/* 9. FAQ */}
      <section style={{ background: C.straw, padding: '80px 0' }}>
        <div style={{ maxWidth: '760px', margin: '0 auto', padding: '0 24px' }}>
          <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '36px', textAlign: 'center', margin: '0 0 40px', fontWeight: 800 }}>Questions, answered</h2>
          <div>
            {faq.map((f) => <FaqItem key={f.q} q={f.q} a={f.a} />)}
          </div>
        </div>
      </section>

      {/* 10. CTA band */}
      <section style={{ background: C.forest, padding: '64px 0', textAlign: 'center' }}>
        <div style={maxW}>
          <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '34px', color: C.cream, margin: '0 0 12px', fontWeight: 800 }}>{bottomCtaTitle}</h2>
          <p style={{ color: 'rgba(245,243,239,0.85)', fontSize: '18px', margin: '0 0 28px' }}>{bottomCtaBody}</p>
          <CtaButton testid="band-cta" onClick={handleBuy} busy={busy}>{bottomCtaButton}</CtaButton>
        </div>
      </section>

      {/* 11. REVIEWS */}
      <section style={{ ...maxW, padding: '80px 24px' }}>
        <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '36px', textAlign: 'center', margin: '0 0 48px', fontWeight: 800 }}>What pet parents are saying</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '28px' }} className="rsb-three-col">
          {testimonials.slice(0, 3).map((r, i) => {
            const stars = Math.max(1, Math.min(5, Number(r.rating) || 5));
            return (
              <div key={(r.name || 'r') + i} style={{ background: '#fff', borderRadius: '14px', padding: '28px', boxShadow: '0 8px 24px rgba(0,0,0,0.06)' }}>
                <div style={{ display: 'flex', gap: '3px', marginBottom: '14px' }}>
                  {Array.from({ length: stars }).map((_, s) => <Star key={s} size={18} fill={C.gold} color={C.gold} />)}
                </div>
                <p style={{ fontSize: '15px', lineHeight: 1.7, color: C.charcoal, margin: '0 0 18px' }}>“{r.text}”</p>
                {(r.name || r.pet) && (
                  <p style={{ fontFamily: 'var(--font-heading)', fontWeight: 700, margin: 0 }}>
                    {r.name}
                    {r.pet && <span style={{ color: '#999', fontWeight: 400 }}> {r.pet.startsWith('with') ? r.pet : `with ${r.pet}`}</span>}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* 12. FINAL CTA */}
      <section style={{ background: C.red, padding: '72px 0', textAlign: 'center' }}>
        <div style={maxW}>
          <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '38px', color: C.cream, margin: '0 0 14px', fontWeight: 800 }}>The freshest meal your dog has ever eaten.</h2>
          <p style={{ color: 'rgba(245,243,239,0.9)', fontSize: '18px', margin: '0 0 30px' }}>A happy dog or your money back — guaranteed.</p>
          <button
            onClick={handleBuy}
            disabled={busy}
            data-testid="final-cta"
            style={{ background: C.cream, color: C.red, border: 'none', padding: '18px 48px', borderRadius: '8px', fontFamily: 'var(--font-heading)', fontSize: '18px', fontWeight: 800, cursor: busy ? 'wait' : 'pointer', boxShadow: '0 8px 22px rgba(0,0,0,0.2)' }}
          >
            {busy ? 'One moment…' : ctaText}
          </button>
          {notice && <p style={{ marginTop: '18px', color: C.cream, fontSize: '14px' }}>{notice}</p>}
        </div>
      </section>

      {/* responsive: stack columns on small screens */}
      <style>{`
        @media (max-width: 860px) {
          .rsb-two-col { grid-template-columns: 1fr !important; }
          .rsb-three-col { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
};

export default RawStarterBundlePage;
