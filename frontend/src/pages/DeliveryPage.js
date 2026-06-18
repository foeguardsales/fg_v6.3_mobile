import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Truck, Snowflake, Clock, MapPin, Package, ShieldCheck } from 'lucide-react';
import { ModernNavbar, ModernFooter, COLORS, liftedButtonStyle, liftedButtonHover } from './LandingPage';
import { SlideCart } from '../contexts/CartContext';

const StepCard = ({ idx, icon: Icon, title, body }) => (
  <div
    style={{
      background: COLORS.white,
      borderRadius: '18px',
      padding: '28px 24px',
      border: `2px solid ${COLORS.charcoal}`,
      boxShadow: '6px 6px 0px rgba(0,0,0,0.2)',
      position: 'relative'
    }}
  >
    <div style={{
      position: 'absolute',
      top: '-16px',
      left: '20px',
      background: COLORS.red,
      color: COLORS.white,
      width: '36px',
      height: '36px',
      borderRadius: '50%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontWeight: 800,
      fontSize: '15px',
      border: `2px solid ${COLORS.charcoal}`
    }}>{idx}</div>
    <Icon size={32} color={COLORS.red} style={{ marginBottom: '14px' }} />
    <h3 style={{
      fontSize: '18px',
      fontWeight: 700,
      color: COLORS.charcoal,
      marginBottom: '8px',
      fontFamily: "'Barlow Semi Condensed', sans-serif"
    }}>{title}</h3>
    <p style={{
      fontSize: '14px',
      lineHeight: 1.6,
      color: COLORS.charcoal,
      opacity: 0.8,
      margin: 0
    }}>{body}</p>
  </div>
);

const FactRow = ({ label, value }) => (
  <div style={{
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    padding: '18px 0',
    borderBottom: `1px solid ${COLORS.khaki}`,
    gap: '24px'
  }}>
    <span style={{ fontSize: '14px', fontWeight: 700, color: COLORS.charcoal, opacity: 0.7, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
      {label}
    </span>
    <span style={{ fontSize: '15px', color: COLORS.charcoal, textAlign: 'right', fontWeight: 500, maxWidth: '60%' }}>
      {value}
    </span>
  </div>
);

export const DeliveryPage = () => {
  const navigate = useNavigate();

  return (
    <>
      <ModernNavbar />
      <SlideCart />
      <main style={{ background: COLORS.cream }}>
        {/* Hero */}
        <section style={{
          background: `linear-gradient(135deg, ${COLORS.cream} 0%, ${COLORS.softBg} 100%)`,
          padding: '60px 20px 40px',
          textAlign: 'center'
        }}>
          <div style={{ maxWidth: '780px', margin: '0 auto' }}>
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
            }}>Delivery Information</span>
            <h1 style={{
              fontSize: 'clamp(32px, 5vw, 52px)',
              fontWeight: 800,
              color: COLORS.charcoal,
              lineHeight: 1.15,
              marginBottom: '16px',
              fontFamily: "'Barlow Semi Condensed', sans-serif"
            }}>
              From our kitchen,<br />
              <span style={{ color: COLORS.red }}>to your dog’s bowl.</span>
            </h1>
            <p style={{
              fontSize: '17px',
              color: COLORS.charcoal,
              opacity: 0.8,
              maxWidth: '560px',
              margin: '0 auto 28px',
              lineHeight: 1.6
            }}>
              Flash-frozen, dry-ice packed and delivered across Ontario. Here’s exactly how we get FoeGuard to you safely.
            </p>
            <button
              data-testid="delivery-shop-cta"
              onClick={() => navigate('/menu')}
              style={liftedButtonStyle}
              onMouseEnter={(e) => liftedButtonHover(e, true)}
              onMouseLeave={(e) => liftedButtonHover(e, false)}
            >
              Shop Raw Food
            </button>
          </div>
        </section>

        {/* How it ships */}
        <section style={{ padding: '60px 20px', maxWidth: '1200px', margin: '0 auto' }}>
          <h2 style={{
            fontSize: 'clamp(26px, 4vw, 36px)',
            fontWeight: 800,
            color: COLORS.charcoal,
            marginBottom: '40px',
            textAlign: 'center',
            fontFamily: "'Barlow Semi Condensed', sans-serif"
          }}>
            How your <span style={{ color: COLORS.red }}>FoeGuard order</span> arrives
          </h2>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
            gap: '32px'
          }}>
            <StepCard idx={1} icon={Package} title="Made fresh" body="Every order is prepared in our Ontario-regulated kitchen, then flash-frozen the same day to lock in nutrients." />
            <StepCard idx={2} icon={Snowflake} title="Dry-ice packed" body="Meals ship in insulated boxes with dry ice — they stay frozen for up to 48 hours in transit." />
            <StepCard idx={3} icon={Truck} title="Door-to-door" body="We partner with refrigerated couriers across Ontario, delivering Tuesday through Friday." />
            <StepCard idx={4} icon={ShieldCheck} title="Freshness promise" body="If anything looks off when you open the box, message us within 48 hours — full refund, no questions." />
          </div>
        </section>

        {/* The Facts */}
        <section style={{
          background: COLORS.white,
          padding: '60px 20px',
          borderTop: `1px solid ${COLORS.khaki}`,
          borderBottom: `1px solid ${COLORS.khaki}`
        }}>
          <div style={{
            maxWidth: '900px',
            margin: '0 auto',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '60px',
            alignItems: 'start'
          }}>
            <div>
              <h3 style={{
                fontSize: '13px',
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '0.12em',
                color: COLORS.red,
                marginBottom: '8px'
              }}>The facts</h3>
              <h2 style={{
                fontSize: '32px',
                fontWeight: 800,
                color: COLORS.charcoal,
                marginBottom: '20px',
                fontFamily: "'Barlow Semi Condensed', sans-serif",
                lineHeight: 1.15
              }}>
                Shipping at a glance
              </h2>
              <p style={{
                fontSize: '15px',
                color: COLORS.charcoal,
                opacity: 0.8,
                lineHeight: 1.7
              }}>
                We currently deliver across Ontario only. Free shipping kicks in automatically over $149 — no codes needed.
              </p>
            </div>
            <div>
              <FactRow label="Coverage area" value="All of Ontario, Canada" />
              <FactRow label="Free shipping" value="Orders over $149" />
              <FactRow label="Flat shipping" value="$14.99 on orders under $149" />
              <FactRow label="Delivery days" value="Tuesday – Friday" />
              <FactRow label="Order cut-off" value="Monday 11:59 pm EST" />
              <FactRow label="Transit time" value="1–2 business days" />
            </div>
          </div>
        </section>

        {/* Delivery zones */}
        <section style={{ padding: '60px 20px', maxWidth: '1100px', margin: '0 auto' }}>
          <h2 style={{
            fontSize: 'clamp(24px, 4vw, 32px)',
            fontWeight: 800,
            color: COLORS.charcoal,
            marginBottom: '24px',
            fontFamily: "'Barlow Semi Condensed', sans-serif",
            textAlign: 'center'
          }}>
            Delivery zones across Ontario
          </h2>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: '20px'
          }}>
            {[
              { zone: 'GTA + Hamilton', days: 'Tue + Thu', color: COLORS.red },
              { zone: 'Ottawa + East', days: 'Wed + Fri', color: COLORS.forestGreen },
              { zone: 'Kitchener / Waterloo', days: 'Tue + Fri', color: COLORS.red },
              { zone: 'London + Southwest', days: 'Thu', color: COLORS.forestGreen },
              { zone: 'Barrie / Muskoka', days: 'Wed', color: COLORS.red },
              { zone: 'Northern Ontario', days: 'Custom — contact us', color: COLORS.charcoal }
            ].map((z, i) => (
              <div key={i} style={{
                background: COLORS.white,
                borderRadius: '14px',
                padding: '22px',
                border: `1px solid ${COLORS.khaki}`,
                boxShadow: '4px 4px 0px rgba(0,0,0,0.08)'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                  <MapPin size={18} color={z.color} />
                  <span style={{ fontWeight: 700, color: COLORS.charcoal, fontSize: '15px' }}>{z.zone}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: COLORS.charcoal, opacity: 0.7, fontSize: '14px' }}>
                  <Clock size={14} /> {z.days}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Storage tips */}
        <section style={{
          background: COLORS.softBg,
          padding: '60px 20px'
        }}>
          <div style={{ maxWidth: '900px', margin: '0 auto' }}>
            <h2 style={{
              fontSize: 'clamp(24px, 4vw, 32px)',
              fontWeight: 800,
              color: COLORS.charcoal,
              marginBottom: '24px',
              fontFamily: "'Barlow Semi Condensed', sans-serif",
              textAlign: 'center'
            }}>
              How to <span style={{ color: COLORS.red }}>store + thaw</span> your meals
            </h2>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
              gap: '24px'
            }}>
              {[
                { t: 'Freezer', d: 'Pop your delivery straight into the freezer. FoeGuard meals stay fresh up to 12 months from the purchase date.' },
                { t: 'Thawing', d: 'Move 1–2 days’ worth into the fridge to thaw 12–24 hours before feeding. Never thaw in the microwave or in warm water.' },
                { t: 'Once thawed', d: 'Use within 3–4 days. Keep refrigerated and tightly sealed between meals. Do not refreeze raw thawed food.' }
              ].map((c, i) => (
                <div key={i} style={{
                  background: COLORS.white,
                  borderRadius: '14px',
                  padding: '24px',
                  boxShadow: '4px 4px 0px rgba(0,0,0,0.08)'
                }}>
                  <h4 style={{
                    fontSize: '16px',
                    fontWeight: 700,
                    color: COLORS.red,
                    marginBottom: '8px',
                    letterSpacing: '0.04em',
                    textTransform: 'uppercase'
                  }}>{c.t}</h4>
                  <p style={{ fontSize: '14px', color: COLORS.charcoal, opacity: 0.85, lineHeight: 1.6, margin: 0 }}>{c.d}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section style={{ padding: '60px 20px', textAlign: 'center' }}>
          <h3 style={{
            fontSize: '26px',
            fontWeight: 800,
            color: COLORS.charcoal,
            marginBottom: '12px',
            fontFamily: "'Barlow Semi Condensed', sans-serif"
          }}>
            Ready to give your dog real food?
          </h3>
          <p style={{ color: COLORS.charcoal, opacity: 0.7, marginBottom: '24px' }}>
            Build your meal plan in under 2 minutes and we’ll handle the rest.
          </p>
          <button
            data-testid="delivery-meal-plan-cta"
            onClick={() => navigate('/meal-plan')}
            style={liftedButtonStyle}
            onMouseEnter={(e) => liftedButtonHover(e, true)}
            onMouseLeave={(e) => liftedButtonHover(e, false)}
          >
            Start my meal plan
          </button>
        </section>
      </main>
      <ModernFooter />
    </>
  );
};

export default DeliveryPage;
