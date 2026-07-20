import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Wind, Smile, Salad, Flame, Leaf, Droplet,
  ShieldCheck, Shield, Brain, PawPrint, HeartPulse, Sparkles
} from 'lucide-react';
import { ModernNavbar, ModernFooter, COLORS, liftedButtonStyle, liftedButtonHover } from './LandingPage';
import { SlideCart } from '../contexts/CartContext';

const BENEFITS = [
  { icon: Wind,         label: 'Allergy Relief' },
  { icon: Smile,        label: 'Better Dental Health' },
  { icon: Salad,        label: 'Supports Digestion' },
  { icon: Flame,        label: 'Reduces Inflammation' },
  { icon: Leaf,         label: 'Smaller Stools' },
  { icon: Droplet,      label: 'Naturally Hydrates' },
  { icon: ShieldCheck,  label: 'Fewer Allergies' },
  { icon: Shield,       label: 'Boosts Immune System' },
  { icon: Brain,        label: 'Better Brain Activity' },
  { icon: PawPrint,     label: 'More Meal-Time Wags' },
  { icon: HeartPulse,   label: 'Lower Vet Visits' },
  { icon: Sparkles,     label: '& So Much More!' }
];

const headingStyle = {
  fontFamily: "'Barlow Semi Condensed', serif",
  fontWeight: 700,
  color: COLORS.charcoal,
  letterSpacing: '-0.4px',
  lineHeight: 1.15
};

export const NewToRawPage = () => {
  const navigate = useNavigate();

  return (
    <>
      <ModernNavbar />
      <SlideCart />

      <main style={{ background: COLORS.cream }}>
        {/* HERO — Why Raw? */}
        <section style={{
          background: COLORS.cream,
          padding: '20px 24px 40px',
          textAlign: 'center'
        }}>
          <div style={{ maxWidth: '880px', margin: '0 auto' }}>
            <h1 style={{
              ...headingStyle,
              fontSize: 'clamp(40px, 5vw, 56px)',
              lineHeight: 1.05,
              marginBottom: '20px'
            }}>
              Why <span style={{ color: COLORS.red }}>Raw?</span>
            </h1>
            <p style={{
              fontSize: '17px',
              color: COLORS.charcoal,
              opacity: 0.85,
              maxWidth: '760px',
              margin: '0 auto',
              lineHeight: 1.75
            }}>
              Dogs are designed by nature to break down real meat and bones — yet in recent times, we&apos;ve been feeding our carnivores processed foods made with questionable ingredients, low-quality meats, and unknown sourcing.
            </p>
          </div>
        </section>

        {/* INTRO PARAGRAPH SECTION */}
        <section style={{ background: COLORS.white, padding: '60px 24px' }}>
          <div style={{
            maxWidth: '1100px',
            margin: '0 auto',
            display: 'grid',
            gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1.2fr)',
            gap: '48px',
            alignItems: 'center'
          }} className="ntr-split">
            {/* Image placeholder — left */}
            <div
              data-testid="ntr-intro-image-placeholder"
              style={{
                width: '100%',
                maxWidth: '320px',
                aspectRatio: '1 / 1',
                margin: '0 auto',
                borderRadius: '18px',
                background: `repeating-linear-gradient(45deg, ${COLORS.softBg} 0 14px, ${COLORS.cream} 14px 28px)`,
                border: `2px dashed ${COLORS.khakiDark || '#a89a83'}`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: COLORS.charcoal,
                opacity: 0.55,
                fontFamily: "'Barlow', sans-serif",
                fontSize: '14px',
                fontWeight: 600,
                letterSpacing: '0.5px',
                textTransform: 'uppercase'
              }}
            >
              Image Placeholder
            </div>

            {/* Text — right */}
            <div>
              <p style={{ fontSize: '17px', lineHeight: 1.75, color: COLORS.charcoal, marginBottom: '20px' }}>
                For decades, doctors have told us to eat fresh, local, minimally processed foods — so why should our pets be any different?
              </p>
              <p style={{ fontSize: '17px', lineHeight: 1.75, color: COLORS.charcoal, marginBottom: '20px' }}>
                At <strong>FoeGuard</strong>, we believe dogs deserve food that&apos;s fresh, locally sourced, and aligned with nature. Everything a biologically appropriate, nutrient-dense raw diet needs to support longevity, vitality, and true well-being.
              </p>
              <p style={{ fontSize: '17px', lineHeight: 1.75, color: COLORS.charcoal, margin: 0 }}>
                You can see it in the details: a glossier coat, cleaner teeth, brighter eyes, and energy that feels youthful again. Real food doesn&apos;t just nourish — it deepens the bond we share with our pets.
              </p>
            </div>
          </div>
        </section>

        {/* BENEFITS GRID — 12 icons (4 per row on desktop) */}
        <section style={{ background: COLORS.cream, padding: '60px 24px' }}>
          <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
            <div style={{ textAlign: 'center', maxWidth: '760px', margin: '0 auto 44px' }}>
              <h2 style={{
                ...headingStyle,
                fontSize: 'clamp(30px, 3.6vw, 40px)',
                marginBottom: '14px'
              }}>
                Benefits you can see and they can feel
              </h2>
              <p style={{ fontSize: '17px', color: COLORS.charcoal, opacity: 0.8, lineHeight: 1.6, margin: 0 }}>
                A complete, farm-fresh diet can provide life-changing health benefits.
              </p>
            </div>

            <div className="benefits-grid">
              {BENEFITS.map(({ icon: Icon, label }) => (
                <div
                  key={label}
                  style={{
                    background: COLORS.white,
                    border: `1px solid ${COLORS.khaki}`,
                    borderRadius: '16px',
                    padding: '24px 20px',
                    textAlign: 'center',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '12px',
                    boxShadow: '4px 4px 0px rgba(0,0,0,0.06)'
                  }}
                >
                  <div style={{
                    width: '56px',
                    height: '56px',
                    borderRadius: '50%',
                    background: `${COLORS.red}1A`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: COLORS.red
                  }}>
                    <Icon size={28} strokeWidth={2} />
                  </div>
                  <div style={{
                    fontSize: '15px',
                    fontWeight: 700,
                    color: COLORS.charcoal,
                    lineHeight: 1.3,
                    fontFamily: "'Barlow Semi Condensed', serif"
                  }}>
                    {label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* HOW FOEGUARD COMPARES — chart FIRST, then descriptions */}
        <section style={{ background: COLORS.white, padding: '60px 24px' }}>
          <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
            <div style={{ textAlign: 'center', maxWidth: '760px', margin: '0 auto 36px' }}>
              <h2 style={{
                ...headingStyle,
                fontSize: 'clamp(30px, 3.6vw, 40px)',
                marginBottom: '14px'
              }}>
                How FoeGuard Raw compares
              </h2>
              <p style={{ fontSize: '17px', color: COLORS.charcoal, opacity: 0.85, lineHeight: 1.6, margin: 0 }}>
                By sourcing from local farms and delivering directly from our kitchen, we can invest in better ingredients and environmental care — quality you won&apos;t find in store.
              </p>
            </div>

            {/* Comparison Chart — bare table, no card wrapper */}
            <table style={{ width: '100%', borderCollapse: 'collapse', tableLayout: 'fixed', marginBottom: '48px' }}>
              <thead style={{ background: COLORS.softBg }}>
                <tr>
                  <th style={{ padding: '10px 8px', textAlign: 'left', width: '40%' }}></th>
                  <th style={{ padding: '10px 4px', color: COLORS.red, fontFamily: "'Barlow Semi Condensed', serif", fontSize: '14px' }}>
                    FoeGuard
                  </th>
                  <th style={{ padding: '10px 4px', color: COLORS.charcoal, fontFamily: "'Barlow Semi Condensed', serif", fontSize: '14px' }}>
                    Retail Raw
                  </th>
                  <th style={{ padding: '10px 4px', color: COLORS.charcoal, fontFamily: "'Barlow Semi Condensed', serif", fontSize: '14px' }}>
                    Kibble
                  </th>
                </tr>
              </thead>
              <tbody>
                {[
                  ['Human-Grade Ingredients',           true, '?',   '?'],
                  ['Organic & Non-GMO',                 true, false, false],
                  ['Farm Fresh',                        true, false, false],
                  ['Transparent Sourcing',              true, false, false],
                  ['Ethically Raised in Small Batches', true, false, false]
                ].map(([feature, fg, retail, kibble]) => {
                  const cellMark = (v) => v === true ? '✓' : v === false ? '✗' : v;
                  const cellColor = (v) => v === true ? COLORS.red : COLORS.charcoal;
                  return (
                    <tr key={feature} style={{ borderTop: `1px solid ${COLORS.khaki}` }}>
                      <td style={{ padding: '12px 8px', fontWeight: 500, fontSize: '14px', lineHeight: 1.3 }}>{feature}</td>
                      <td style={{ padding: '12px 4px', textAlign: 'center', color: COLORS.red, fontSize: '18px', fontWeight: 700 }}>{cellMark(fg)}</td>
                      <td style={{ padding: '12px 4px', textAlign: 'center', color: cellColor(retail), fontSize: '18px', fontWeight: 700 }}>{cellMark(retail)}</td>
                      <td style={{ padding: '12px 4px', textAlign: 'center', color: cellColor(kibble), fontSize: '18px', fontWeight: 700 }}>{cellMark(kibble)}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>

            {/* Descriptions of the three (after chart) */}
            <div style={{ display: 'grid', gap: '24px' }}>
              <div style={{
                background: COLORS.cream,
                border: `1px solid ${COLORS.khaki}`,
                borderRadius: '14px',
                padding: '24px 26px'
              }}>
                <h3 style={{ ...headingStyle, fontSize: '20px', marginBottom: '10px' }}>
                  Retail Raw
                </h3>
                <p style={{ fontSize: '16px', lineHeight: 1.7, color: COLORS.charcoal, margin: 0 }}>
                  Retail raw food brands can offer a healthier alternative for pet owners, but they often lack transparent sourcing and clarity around what cuts of meat are being used or how the ingredients are raised. Livestock raised on antibiotics, hormones, or GMO feeds can have an immediate effect on your dog, while months-old, lower-quality cuts can become more problematic over time.
                </p>
              </div>

              <div style={{
                background: COLORS.cream,
                border: `1px solid ${COLORS.khaki}`,
                borderRadius: '14px',
                padding: '24px 26px'
              }}>
                <h3 style={{ ...headingStyle, fontSize: '20px', marginBottom: '10px' }}>
                  Gently Cooked
                </h3>
                <p style={{ fontSize: '16px', lineHeight: 1.7, color: COLORS.charcoal, margin: 0 }}>
                  Gently cooked food is another option that can be better than kibble when balanced and prepared correctly, but it is not as nutritionally intact as raw in its natural form. The cooking process can reduce nutrient availability and change the integrity of the final product. Dogs are not humans — you do not need to taste-test their food to know what they are anatomically designed to eat.
                </p>
              </div>

              <div style={{
                background: COLORS.cream,
                border: `1px solid ${COLORS.khaki}`,
                borderRadius: '14px',
                padding: '24px 26px'
              }}>
                <h3 style={{ ...headingStyle, fontSize: '20px', marginBottom: '10px' }}>
                  Kibble
                </h3>
                <p style={{ fontSize: '16px', lineHeight: 1.7, color: COLORS.charcoal, margin: 0 }}>
                  Kibble is extremely processed, regardless of what ingredients are used or how fancy the packaging looks. It is cooked at high temperatures, which can destroy essential nutrients and make it harder for pets to digest. Minimal pet food regulations also allow for lower-quality meat, vague sourcing, and highly processed ingredients hidden behind marketing terms such as &ldquo;natural,&rdquo; protein &ldquo;meals,&rdquo; and &ldquo;made with meat,&rdquo; even when only a small percentage is actually required to meet AAFCO standards.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* FIND WHAT REALLY WORKS — moved to end (above CTA) */}
        <section style={{ background: COLORS.cream, padding: '60px 24px' }}>
          <div style={{
            maxWidth: '1100px',
            margin: '0 auto',
            display: 'grid',
            gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1.2fr)',
            gap: '48px',
            alignItems: 'center'
          }} className="ntr-split">
            {/* Image placeholder — left */}
            <div
              data-testid="ntr-works-image-placeholder"
              style={{
                width: '100%',
                maxWidth: '320px',
                aspectRatio: '1 / 1',
                margin: '0 auto',
                borderRadius: '18px',
                background: `repeating-linear-gradient(45deg, ${COLORS.softBg} 0 14px, ${COLORS.cream} 14px 28px)`,
                border: `2px dashed ${COLORS.khakiDark || '#a89a83'}`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: COLORS.charcoal,
                opacity: 0.55,
                fontFamily: "'Barlow', sans-serif",
                fontSize: '14px',
                fontWeight: 600,
                letterSpacing: '0.5px',
                textTransform: 'uppercase'
              }}
            >
              Image Placeholder
            </div>

            {/* Text — right */}
            <div>
              <h2 style={{
                ...headingStyle,
                fontSize: 'clamp(30px, 3.6vw, 40px)',
                marginBottom: '20px'
              }}>
                Find what really works for your dog, not against them
              </h2>
              <p style={{ fontSize: '17px', lineHeight: 1.75, color: COLORS.charcoal, marginBottom: '16px' }}>
                From constant itching to problems with digestion, it&apos;s hard to tell what&apos;s causing your dog discomfort. Could it be their food, the environment, or something at home?
              </p>
              <p style={{ fontSize: '17px', lineHeight: 1.75, color: COLORS.charcoal, marginBottom: '16px' }}>
                Many pet parents feel frustrated by the lack of quality and transparency in traditional pet food. Switching to a clean, biologically appropriate diet can help remove one of the biggest unknowns — their food.
              </p>
              <p style={{ fontSize: '17px', lineHeight: 1.75, color: COLORS.charcoal, margin: 0 }}>
                Feeding naturally raised raw meals is a simple way to observe how your pet responds to different proteins while giving them fresh, nutrient-dense food designed for easier digestion and long-term health. We make feeding better feel simple, clear, and stress-free.
              </p>
            </div>
          </div>
        </section>

        {/* FINAL CTA — single Shop Now button */}
        <section className="section-cta-final cta-final-48" style={{
          background: '#9D0D23',
          color: COLORS.white,
          padding: '70px 24px',
          textAlign: 'center'
        }}>
          <div style={{ maxWidth: '820px', margin: '0 auto' }}>
            <h2 style={{
              fontFamily: "'Barlow Semi Condensed', serif",
              fontSize: 'clamp(30px, 3.6vw, 40px)',
              fontWeight: 700,
              color: COLORS.white,
              lineHeight: 1.1,
              marginBottom: '14px',
              letterSpacing: '-0.4px'
            }}>
              Ready to make the switch?
            </h2>
            <p style={{
              fontSize: '17px',
              color: COLORS.white,
              opacity: 0.92,
              marginBottom: '32px',
              maxWidth: '560px',
              marginLeft: 'auto',
              marginRight: 'auto'
            }}>
              Real food, fresh from Ontario farms, delivered straight to your door.
            </p>
            <button
              data-testid="newtoraw-shop-now"
              onClick={() => navigate('/menu')}
              style={liftedButtonStyle}
              onMouseEnter={(e) => liftedButtonHover(e, true)}
              onMouseLeave={(e) => liftedButtonHover(e, false)}
            >
              Shop Now
            </button>
          </div>
        </section>
      </main>

      <ModernFooter />
    </>
  );
};

export default NewToRawPage;
