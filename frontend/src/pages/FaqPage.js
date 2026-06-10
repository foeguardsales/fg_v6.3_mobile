import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronDown, ChevronUp, MessageCircle } from 'lucide-react';
import { ModernNavbar, ModernFooter, COLORS, liftedButtonStyle, liftedButtonHover } from './LandingPage';
import { SlideCart } from '../contexts/CartContext';

const FAQ_CATEGORIES = [
  {
    title: 'Raw Feeding Basics',
    items: [
      {
        q: 'Is raw food safe for my dog?',
        a: (
          <>
            <p style={{ margin: '0 0 12px' }}><strong>When handled properly — yes.</strong></p>
            <p style={{ margin: '0 0 12px' }}>Dogs and cats are biologically designed to digest raw meat, bone, and organ. The key is quality, formulation, and proper storage.</p>
            <p style={{ margin: '0 0 8px', fontWeight: 600 }}>At FoeGuard, every meal is:</p>
            <ul style={{ margin: '0 0 12px 20px', padding: 0 }}>
              <li>Professionally balanced</li>
              <li>Prepared in a government-inspected facility</li>
              <li>Flash frozen immediately</li>
              <li>Handled with the same standards you would use for your own food</li>
            </ul>
            <p style={{ margin: 0 }}>Raw feeding isn&apos;t extreme — it&apos;s simply a return to biological design.</p>
          </>
        )
      },
      {
        q: 'How do I transition my pet?',
        a: (
          <>
            <p style={{ margin: '0 0 12px' }}>Because our meals are nutrient-dense and minimally processed, a thoughtful transition helps avoid digestive upset. We recommend the following approaches:</p>
            <p style={{ margin: '0 0 6px', fontWeight: 700 }}>Option 1: 10-Day Gradual Transition</p>
            <p style={{ margin: '0 0 12px', fontStyle: 'italic' }}>Best for kibble-fed pets, sensitive stomachs, puppies, seniors, or cautious guardians.</p>
            <ul style={{ margin: '0 0 12px 20px', padding: 0 }}>
              <li>Day 1: 10% FoeGuard / 90% current food</li>
              <li>Day 2: 20% FoeGuard / 80% current food</li>
              <li>Continue increasing FoeGuard by 10% daily</li>
              <li>Day 10: 100% FoeGuard — fully transitioned!</li>
            </ul>
            <p style={{ margin: '0 0 6px', fontWeight: 600 }}>Tips during transition:</p>
            <ul style={{ margin: '0 0 16px 20px', padding: 0 }}>
              <li>Feed slightly smaller portions</li>
              <li>Monitor stool consistency</li>
              <li>Avoid introducing new treats</li>
            </ul>
            <p style={{ margin: '0 0 6px', fontWeight: 700 }}>Optional: Structured Fast + Switch</p>
            <p style={{ margin: '0 0 12px', fontStyle: 'italic' }}>Only recommended for healthy adult dogs already eating raw or lightly processed diets. Feed the regular morning meal, allow a 24-hour digestive reset (water is fine), then introduce FoeGuard at the next evening meal with a slightly smaller portion.</p>
            <p style={{ margin: 0 }}>Our team is one message away if you need help.</p>
          </>
        )
      },
      {
        q: 'What if my dog or cat won\u2019t eat raw?',
        a: (
          <>
            <p style={{ margin: '0 0 12px' }}>Transitioning to raw is often <strong>behavioural</strong> — not nutritional. Many pets are accustomed to processed foods engineered for taste intensity, flavour enhancers, and frequent treats. Real food can feel unfamiliar at first.</p>
            <p style={{ margin: '0 0 12px', fontWeight: 600 }}>Consistency and structure usually solve it.</p>
            <p style={{ margin: '0 0 6px' }}>To encourage success:</p>
            <ul style={{ margin: '0 0 12px 20px', padding: 0 }}>
              <li>Feed at consistent times</li>
              <li>Avoid free-feeding</li>
              <li>Limit treats during transition</li>
              <li>Ensure your dog is exercised before mealtime</li>
              <li>Remove the bowl after 15–20 minutes if uneaten</li>
            </ul>
            <p style={{ margin: 0 }}>Structure builds appetite. If they skip a meal, store the food in the fridge and offer it again at the next scheduled feeding. With patience and consistency, most pets adapt quickly — and thrive.</p>
          </>
        )
      }
    ]
  },
  {
    title: 'Quick Answers',
    items: [
      {
        q: 'Is raw food safe for my dog?',
        a: 'Yes! Our raw food is made in an Ontario Regulated Human Food Kitchen with the same safety standards as human food. We use only human-grade, ethically sourced ingredients.'
      },
      {
        q: 'How do I transition my dog to raw?',
        a: 'We recommend a gradual transition over 7-10 days, mixing increasing amounts of raw food with their current diet. Our team is always here to help guide you through the process.'
      },
      {
        q: 'How is the food shipped?',
        a: 'All orders are shipped frozen in insulated packaging with dry ice to ensure freshness. We deliver directly to your door across Ontario.'
      },
      {
        q: 'Can I pause or cancel my subscription?',
        a: 'Absolutely! Your meal plan is completely customizable. Pause, skip, change, or cancel anytime with no commitments or hidden fees.'
      }
    ]
  },
  {
    title: 'Getting Started',
    items: [
      {
        q: 'What exactly is raw dog food?',
        a: 'Raw dog food is a biologically appropriate diet made from fresh, unprocessed muscle meat, organs, bone and whole-food ingredients — the way dogs are designed to eat. FoeGuard meals are prepared in an Ontario-regulated human-grade kitchen and flash-frozen to lock in nutrition.'
      },
      {
        q: 'Is raw food safe for my dog?',
        a: 'Yes. Our facility follows the same handling standards used for human food. Every recipe is screened for pathogens, and meats are sourced from drug-free, ethically raised Canadian farms.'
      },
      {
        q: 'How do I transition my dog onto FoeGuard?',
        a: 'We recommend a gradual 7–10 day transition. Start at 25% raw and 75% current food, then increase the raw portion every couple of days. Our team is always one message away if you need help.'
      },
      {
        q: 'Can puppies and senior dogs eat raw?',
        a: 'Absolutely. Our Comfort Dinner line is complete & balanced for all life stages (AAFCO). For puppies, simply feed slightly more per kg of body weight using our calculator.'
      }
    ]
  },
  {
    title: 'Ordering & Subscriptions',
    items: [
      {
        q: 'How does the 6lb pack system work?',
        a: 'Every recipe is sold in 6lb increments. Order 12lb to unlock a 5% bulk discount, or 24lb for 10% off. Stack a subscription for an additional 5% off — automatically applied at checkout.'
      },
      {
        q: 'Can I pause, skip or cancel my subscription?',
        a: 'Yes — fully flexible. Manage delivery dates, swap proteins or cancel anytime from your account. No hidden fees, no commitments.'
      },
      {
        q: 'Do you offer a custom meal plan?',
        a: 'Yes! Take our quick Meal Plan quiz and we’ll match your dog’s breed, weight, activity and sensitivities to the right recipes and feeding amounts.'
      },
      {
        q: 'What payment methods do you accept?',
        a: 'All major credit cards via Stripe. Apple Pay and Google Pay coming soon.'
      }
    ]
  },
  {
    title: 'Delivery & Storage',
    items: [
      {
        q: 'Where do you ship?',
        a: 'Across Ontario, Canada. Free shipping on orders over $149.'
      },
      {
        q: 'How is the food shipped?',
        a: 'Frozen, in insulated boxes with dry ice. Boxes are designed to keep meals frozen for up to 48 hours in transit.'
      },
      {
        q: 'How long does the food last?',
        a: 'Up to 12 months in the freezer from purchase date. Once thawed in the fridge, use within 3–4 days.'
      },
      {
        q: 'What if my order arrives partially thawed?',
        a: 'If meals are still cold to the touch, they are safe to refreeze immediately. If anything looks off, email hello@foeguard.com within 48 hours and we’ll make it right.'
      }
    ]
  },
  {
    title: 'Health & Nutrition',
    items: [
      {
        q: 'Are FoeGuard meals complete and balanced?',
        a: 'Comfort Dinner recipes are complete and balanced (AAFCO). Primal Feast uses an 80/10/10 ratio designed for rotational feeding or topping. Always check the label.'
      },
      {
        q: 'What if my dog has allergies?',
        a: 'Use our Meal Plan quiz to flag allergens — we’ll surface novel-protein options like Duck, Rabbit or Venison and skip any recipes containing your dog’s triggers.'
      },
      {
        q: 'Will raw food make my dog’s coat shinier?',
        a: 'Most customers see noticeable coat improvement within 30 days thanks to whole-food omega-3s and bioavailable nutrients.'
      }
    ]
  }
];

const AccordionItem = ({ q, a, isOpen, onToggle }) => (
  <div
    style={{
      borderBottom: `1px solid ${COLORS.khaki}`,
      padding: '0'
    }}
  >
    <button
      onClick={onToggle}
      data-testid="faq-question-toggle"
      style={{
        width: '100%',
        background: 'transparent',
        border: 'none',
        padding: '20px 0',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: '16px',
        cursor: 'pointer',
        textAlign: 'left'
      }}
    >
      <span style={{
        fontSize: '17px',
        fontWeight: 600,
        color: COLORS.charcoal,
        fontFamily: "'Barlow', sans-serif"
      }}>{q}</span>
      {isOpen
        ? <ChevronUp size={22} color={COLORS.red} />
        : <ChevronDown size={22} color={COLORS.charcoal} />}
    </button>
    {isOpen && (
      <div style={{
        padding: '0 0 22px 0',
        fontSize: '15px',
        lineHeight: 1.7,
        color: COLORS.charcoal,
        opacity: 0.85,
        maxWidth: '760px'
      }}>
        {a}
      </div>
    )}
  </div>
);

export const FaqPage = () => {
  const navigate = useNavigate();
  const [openKey, setOpenKey] = useState('0-0');

  return (
    <>
      <ModernNavbar />
      <SlideCart />
      <main style={{ background: COLORS.cream, minHeight: '80vh' }}>
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
            }}>FAQ</span>
            <h1 style={{
              fontSize: 'clamp(32px, 5vw, 52px)',
              fontWeight: 800,
              color: COLORS.charcoal,
              lineHeight: 1.15,
              marginBottom: '16px',
              fontFamily: "'Barlow', sans-serif"
            }}>
              Everything you need to know,<br />
              <span style={{ color: COLORS.red }}>before you switch to raw.</span>
            </h1>
            <p style={{
              fontSize: '17px',
              color: COLORS.charcoal,
              opacity: 0.8,
              maxWidth: '560px',
              margin: '0 auto',
              lineHeight: 1.6
            }}>
              Honest answers from real farmers, nutritionists and dog parents — no marketing fluff.
            </p>
          </div>
        </section>

        {/* FAQ Content */}
        <section style={{ padding: '40px 20px 80px' }}>
          <div style={{ maxWidth: '900px', margin: '0 auto' }}>
            {FAQ_CATEGORIES.map((cat, catIdx) => (
              <div key={cat.title} data-testid={`faq-category-${catIdx}`} style={{ marginBottom: '48px' }}>
                <h2 style={{
                  fontSize: '13px',
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  letterSpacing: '0.12em',
                  color: COLORS.red,
                  marginBottom: '8px',
                  fontFamily: "'Barlow', sans-serif"
                }}>{cat.title}</h2>
                <div style={{
                  background: COLORS.white,
                  borderRadius: '16px',
                  padding: '8px 28px',
                  border: `1px solid ${COLORS.khaki}`,
                  boxShadow: '4px 4px 0px rgba(0,0,0,0.06)'
                }}>
                  {cat.items.map((it, i) => {
                    const key = `${catIdx}-${i}`;
                    return (
                      <AccordionItem
                        key={key}
                        q={it.q}
                        a={it.a}
                        isOpen={openKey === key}
                        onToggle={() => setOpenKey(openKey === key ? null : key)}
                      />
                    );
                  })}
                </div>
              </div>
            ))}

            {/* CTA — still have questions */}
            <div style={{
              marginTop: '60px',
              background: COLORS.forestGreen,
              color: COLORS.cream,
              padding: '48px 32px',
              borderRadius: '20px',
              textAlign: 'center',
              boxShadow: '6px 6px 0px rgba(0,0,0,0.18)'
            }}>
              <MessageCircle size={36} color={COLORS.cream} style={{ marginBottom: '12px' }} />
              <h3 style={{
                fontSize: '24px',
                fontWeight: 800,
                marginBottom: '8px',
                fontFamily: "'Barlow', sans-serif"
              }}>Still have questions?</h3>
              <p style={{
                fontSize: '15px',
                opacity: 0.9,
                marginBottom: '24px',
                maxWidth: '480px',
                marginLeft: 'auto',
                marginRight: 'auto'
              }}>
                Our team of dog-loving humans answers within a few hours, every day of the week.
              </p>
              <button
                data-testid="faq-contact-cta"
                onClick={() => navigate('/contact')}
                style={liftedButtonStyle}
                onMouseEnter={(e) => liftedButtonHover(e, true)}
                onMouseLeave={(e) => liftedButtonHover(e, false)}
              >
                Talk to the FoeGuard team
              </button>
            </div>
          </div>
        </section>
      </main>
      <ModernFooter />
    </>
  );
};

export default FaqPage;
