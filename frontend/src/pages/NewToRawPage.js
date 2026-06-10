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

export const NewToRawPage = () => {
  const navigate = useNavigate();

  return (
    <>
      <ModernNavbar />
      <SlideCart />

      <main style={{ background: COLORS.cream }}>
        {/* HERO — Why Raw? */}
        <section style={{
          background: `linear-gradient(135deg, ${COLORS.cream} 0%, ${COLORS.softBg} 100%)`,
          padding: '60px 20px 50px',
          textAlign: 'center'
        }}>
          <div style={{ maxWidth: '880px', margin: '0 auto' }}>
            <span style={{
              display: 'inline-block',
              padding: '6px 14px',
              borderRadius: '999px',
              background: COLORS.red,
              color: COLORS.white,
              fontSize: '12px',
              fontWeight: 700,
              letterSpacing: '0.08em',
              marginBottom: '20px'
            }}>NEW TO RAW</span>
            <h1 style={{
              fontSize: 'clamp(34px, 5.2vw, 56px)',
              fontWeight: 700,
              color: COLORS.charcoal,
              lineHeight: 1.05,
              marginBottom: '20px',
              fontFamily: "'Barlow', sans-serif",
              textTransform: 'uppercase',
              letterSpacing: '-0.5px'
            }}>
              Why <span style={{ color: COLORS.red }}>Raw?</span>
            </h1>
            <p style={{
              fontSize: 'clamp(16px, 1.7vw, 19px)',
              color: COLORS.charcoal,
              opacity: 0.85,
              maxWidth: '760px',
              margin: '0 auto',
              lineHeight: 1.65
            }}>
              Dogs are designed by nature to break down real meat and bones — yet in recent times, we&apos;ve been feeding our carnivores processed foods made with questionable ingredients, low-quality meats, and unknown sourcing.
            </p>
          </div>
        </section>

        {/* INTRO PARAGRAPH SECTION */}
        <section style={{ background: COLORS.white, padding: '64px 20px' }}>
          <div style={{ maxWidth: '820px', margin: '0 auto' }}>
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
        </section>

        {/* BENEFITS GRID — 12 icons */}
        <section style={{ background: COLORS.cream, padding: '64px 20px' }}>
          <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
            <div style={{ textAlign: 'center', maxWidth: '760px', margin: '0 auto 44px' }}>
              <h2 style={{
                fontSize: 'clamp(26px, 3.8vw, 38px)',
                fontWeight: 700,
                color: COLORS.charcoal,
                lineHeight: 1.15,
                marginBottom: '14px',
                fontFamily: "'Barlow', sans-serif",
                textTransform: 'uppercase',
                letterSpacing: '-0.4px'
              }}>
                Benefits You Can See <span style={{ color: COLORS.red }}>and They Can Feel</span>
              </h2>
              <p style={{ fontSize: '17px', color: COLORS.charcoal, opacity: 0.8, lineHeight: 1.6, margin: 0 }}>
                A complete, farm-fresh diet can provide life-changing health benefits.
              </p>
            </div>

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '16px'
            }}>
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
                    fontFamily: "'Barlow', sans-serif"
                  }}>
                    {label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* HOW FOEGUARD COMPARES — chart FIRST, then descriptions */}
        <section style={{ background: COLORS.cream, padding: '64px 20px' }}>
          <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
            <div style={{ textAlign: 'center', maxWidth: '760px', margin: '0 auto 36px' }}>
              <h2 style={{
                fontSize: 'clamp(26px, 3.8vw, 38px)',
                fontWeight: 700,
                color: COLORS.charcoal,
                lineHeight: 1.15,
                marginBottom: '14px',
                fontFamily: "'Barlow', sans-serif",
                textTransform: 'uppercase',
                letterSpacing: '-0.4px'
              }}>
                How FoeGuard Raw <span style={{ color: COLORS.red }}>Compares</span>
              </h2>
              <p style={{ fontSize: '17px', color: COLORS.charcoal, opacity: 0.85, lineHeight: 1.6, margin: 0 }}>
                By sourcing from local farms and delivering directly from our kitchen, we can invest in better ingredients and environmental care — quality you won&apos;t find in store.
              </p>
            </div>

            {/* Comparison Chart */}
            <div className="comparison-table-wrapper" style={{
              background: COLORS.white,
              border: `1px solid ${COLORS.khaki}`,
              borderRadius: '16px',
              padding: '24px',
              boxShadow: '4px 4px 0px rgba(0,0,0,0.06)',
              marginBottom: '48px',
              overflowX: 'auto'
            }}>
              <table className="comparison-table" style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead style={{ background: COLORS.softBg }}>
                  <tr>
                    <th className="feature-col" style={{ padding: '14px', textAlign: 'left' }}></th>
                    <th className="brand-col foeguard-col" style={{ padding: '14px', color: COLORS.red, fontFamily: "'Barlow', sans-serif", textTransform: 'uppercase' }}>
                      FoeGuard
                    </th>
                    <th className="brand-col" style={{ padding: '14px', color: COLORS.charcoal, fontFamily: "'Barlow', sans-serif", textTransform: 'uppercase' }}>
                      Retail Raw
                    </th>
                    <th className="brand-col" style={{ padding: '14px', color: COLORS.charcoal, fontFamily: "'Barlow', sans-serif", textTransform: 'uppercase' }}>
                      Gently Cooked
                    </th>
                    <th className="brand-col" style={{ padding: '14px', color: COLORS.charcoal, fontFamily: "'Barlow', sans-serif", textTransform: 'uppercase' }}>
                      Kibble
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    ['Human-Grade Ingredients',           true, false, false, false],
                    ['Organic & Non-GMO',                 true, false, false, false],
                    ['Farm Fresh',                        true, false, false, false],
                    ['Transparent Sourcing',              true, false, false, false],
                    ['Ethically Raised in Small Batches', true, false, false, false],
                    ['Minimally Processed',               true, true,  false, false]
                  ].map(([feature, fg, retail, cooked, kibble]) => (
                    <tr key={feature} style={{ borderTop: `1px solid ${COLORS.khaki}` }}>
                      <td className="feature-cell" style={{ padding: '14px', fontWeight: 500 }}>{feature}</td>
                      <td className="check-cell foeguard-cell" style={{ padding: '14px', textAlign: 'center', color: COLORS.red, fontSize: '20px', fontWeight: 700 }}>{fg ? '✓' : '✗'}</td>
                      <td className="check-cell" style={{ padding: '14px', textAlign: 'center', color: retail ? COLORS.red : '#bbb', fontSize: '20px', fontWeight: 700 }}>{retail ? '✓' : '✗'}</td>
                      <td className="check-cell" style={{ padding: '14px', textAlign: 'center', color: cooked ? COLORS.red : '#bbb', fontSize: '20px', fontWeight: 700 }}>{cooked ? '✓' : '✗'}</td>
                      <td className="check-cell" style={{ padding: '14px', textAlign: 'center', color: kibble ? COLORS.red : '#bbb', fontSize: '20px', fontWeight: 700 }}>{kibble ? '✓' : '✗'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Descriptions of the three (after chart) */}
            <div style={{ display: 'grid', gap: '24px' }}>
              <div style={{
                background: COLORS.white,
                border: `1px solid ${COLORS.khaki}`,
                borderRadius: '14px',
                padding: '24px 26px'
              }}>
                <h3 style={{
                  fontSize: '20px',
                  fontWeight: 700,
                  marginBottom: '10px',
                  color: COLORS.charcoal,
                  fontFamily: "'Barlow', sans-serif",
                  textTransform: 'uppercase',
                  letterSpacing: '-0.2px'
                }}>
                  Retail Raw
                </h3>
                <p style={{ fontSize: '16px', lineHeight: 1.7, color: COLORS.charcoal, margin: 0 }}>
                  Retail raw food brands can offer a healthier alternative for pet owners, but they often lack transparent sourcing and clarity around what cuts of meat are being used or how the ingredients are raised. Livestock raised on antibiotics, hormones, or GMO feeds can have an immediate effect on your dog, while months-old, lower-quality cuts can become more problematic over time.
                </p>
              </div>

              <div style={{
                background: COLORS.white,
                border: `1px solid ${COLORS.khaki}`,
                borderRadius: '14px',
                padding: '24px 26px'
              }}>
                <h3 style={{
                  fontSize: '20px',
                  fontWeight: 700,
                  marginBottom: '10px',
                  color: COLORS.charcoal,
                  fontFamily: "'Barlow', sans-serif",
                  textTransform: 'uppercase',
                  letterSpacing: '-0.2px'
                }}>
                  Gently Cooked
                </h3>
                <p style={{ fontSize: '16px', lineHeight: 1.7, color: COLORS.charcoal, margin: 0 }}>
                  Gently cooked food is another option that can be better than kibble when balanced and prepared correctly, but it is not as nutritionally intact as raw in its natural form. The cooking process can reduce nutrient availability and change the integrity of the final product. Dogs are not humans — you do not need to taste-test their food to know what they are anatomically designed to eat.
                </p>
              </div>

              <div style={{
                background: COLORS.white,
                border: `1px solid ${COLORS.khaki}`,
                borderRadius: '14px',
                padding: '24px 26px'
              }}>
                <h3 style={{
                  fontSize: '20px',
                  fontWeight: 700,
                  marginBottom: '10px',
                  color: COLORS.charcoal,
                  fontFamily: "'Barlow', sans-serif",
                  textTransform: 'uppercase',
                  letterSpacing: '-0.2px'
                }}>
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
        <section style={{ background: COLORS.white, padding: '64px 20px' }}>
          <div style={{ maxWidth: '820px', margin: '0 auto' }}>
            <h2 style={{
              fontSize: 'clamp(26px, 3.8vw, 38px)',
              fontWeight: 700,
              color: COLORS.charcoal,
              lineHeight: 1.15,
              marginBottom: '20px',
              fontFamily: "'Barlow', sans-serif",
              textTransform: 'uppercase',
              letterSpacing: '-0.4px',
              textAlign: 'center'
            }}>
              Find What Really Works for Your Dog, <span style={{ color: COLORS.red }}>Not Against Them</span>
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
        </section>

        {/* FINAL CTA — single Shop Now button */}
        <section style={{
          background: `linear-gradient(135deg, ${COLORS.red} 0%, ${COLORS.redOverlay} 100%)`,
          color: COLORS.white,
          padding: '70px 20px',
          textAlign: 'center'
        }}>
          <div style={{ maxWidth: '820px', margin: '0 auto' }}>
            <h2 style={{
              fontSize: 'clamp(28px, 4vw, 42px)',
              fontWeight: 700,
              color: COLORS.white,
              lineHeight: 1.1,
              marginBottom: '14px',
              fontFamily: "'Barlow', sans-serif",
              textTransform: 'uppercase',
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
