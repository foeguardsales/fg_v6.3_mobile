import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronDown, ChevronUp, MessageCircle } from 'lucide-react';
import { ModernNavbar, ModernFooter, COLORS, liftedButtonStyle, liftedButtonHover } from './LandingPage';
import { SlideCart } from '../contexts/CartContext';

const FAQ_CATEGORIES = [
  {
    title: 'Getting Started',
    items: [
      {
        q: 'What exactly is raw dog food?',
        a: 'Raw dog food is a biologically appropriate diet made from fresh, unprocessed muscle meat, organs, bone and whole-food ingredients — the way dogs are designed to eat. FoeGuard meals are prepared in an Ontario-regulated human-grade kitchen and flash-frozen to lock in nutrition.'
      },
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
        q: 'How to introduce raw to your pet?',
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
      },
      {
        q: 'Can puppies eat raw dog food?',
        a: 'Not only can your puppies eat raw, but they thrive on it! Raw food is great for puppies, adults & seniors. However, puppies require certain nutrients to enable healthy growth as well as specially grounded recipes to ensure they are easily digested. We carry a variety of puppy recipes for every protein to ensure your mini FoeGuardian gets the right nutrition.'
      },
      {
        q: 'Should I feed my dog raw or kibble?',
        a: 'In most circumstances, since dogs, cats and ferrets are all carnivores, they thrive on raw diets. The ingredients used in kibble contain high salt content, processed additives and lack the whole proteins that a properly balanced raw food provides.'
      },
      {
        q: 'Where does your meat come from?',
        a: 'All of our meats are sourced directly from our own farm and hand-picked local partners around Ontario to ensure recipes are high quality, consistent and fully customizable.'
      }
    ]
  },
  {
    title: 'Feeding Guide',
    items: [
      {
        q: 'Feeding guide for dogs and puppies',
        a: (
          <>
            <p style={{ margin: '0 0 12px' }}>Remember that every FoeGuardian is unique and may require different recommendations depending on exercise, age &amp; health. Regularly weigh your pets and adjust their food based on their weight.</p>
            <p style={{ margin: '0 0 12px' }}>Start at the minimum recommendations. Add or remove portions as needed.</p>
            <p style={{ margin: '0 0 12px' }}>As a general rule of thumb, if you can feel their ribs without added pressure they are <strong>underweight</strong>. If you cannot feel their ribs with added pressure they are likely <strong>overweight</strong>.</p>
            <p style={{ margin: '0 0 6px', fontWeight: 600 }}>Here is a simple guide to get you started — percentages are based off of total body weight:</p>
            <ul style={{ margin: '0 0 12px 20px', padding: 0 }}>
              <li>Adult Dogs (1 year or over) — 2–3.5%</li>
              <li>Puppies (2–4 months) — 10–13%</li>
              <li>Puppies (4–8 months) — 6–10%</li>
              <li>Puppies (8–12 months) — 3–6%</li>
            </ul>
            <p style={{ margin: 0 }}>For a personalized portion in seconds, try our <a href="/calculator" style={{ color: COLORS.red, fontWeight: 700, textDecoration: 'underline' }}>feeding calculator</a>.</p>
          </>
        )
      },
      {
        q: 'How often should you feed raw?',
        a: 'We recommend feeding raw 6 days per week with 1 day being a \u2018reset\u2019 day where your FoeGuard should receive a treat or meal replacement instead of a meal.'
      },
      {
        q: 'Can I mix raw with kibble?',
        a: 'We don\u2019t recommend doing so, as your pets digest raw very differently than kibble. If you do decide to mix, please try to feed 2 separate meals at different times of the day.'
      }
    ]
  },
  {
    title: 'Ordering & Subscriptions',
    items: [
      {
        q: 'Can I pause, skip or cancel my subscription?',
        a: 'Yes — fully flexible. Manage delivery dates, swap proteins or cancel anytime from your account. No hidden fees, no commitments.'
      },
      {
        q: 'Do you offer a custom meal plan?',
        a: 'Yes! Take our quick Meal Plan quiz and we\u2019ll match your dog\u2019s breed, weight, activity and sensitivities to the right recipes and feeding amounts.'
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
        q: 'Where do you deliver?',
        a: 'In the Greater Toronto Area and beyond (minimum order restrictions or an additional delivery fee may be required). Free delivery on orders over $100 (within a 30 km radius).'
      },
      {
        q: 'How is the food delivered?',
        a: 'Every order is flash-frozen straight out of our regulated human-grade kitchen and personally delivered to your door, so meals stay solid and fresh from our freezer to yours. No third-party couriers.'
      },
      {
        q: 'How long does the food last?',
        a: 'Up to 12 months in the freezer from purchase date. Once thawed in the fridge, use within 3–4 days.'
      },
      {
        q: 'What if my order arrives partially thawed?',
        a: 'If meals are still cold to the touch, they are safe to refreeze immediately. If anything looks off, email info@foeguard.com within 48 hours and we\u2019ll make it right.'
      },
      {
        q: 'How do I defrost, store and handle raw meat?',
        a: (
          <>
            <p style={{ margin: '0 0 10px' }}><strong>Defrost:</strong> Overnight in the fridge or in room-temperature water until raw meat is fully defrosted.</p>
            <p style={{ margin: '0 0 10px' }}><strong>Store:</strong> Our raw recipes should be stored in the freezer and can be kept in the fridge up to 4 days after defrosting. Colours of our recipes may change slightly, however that is due to oxidization and will not have any negative effects on your FoeGuard.</p>
            <p style={{ margin: 0 }}><strong>Handle:</strong> Always wash your hands with warm soapy water prior to and after handling any raw meat.</p>
          </>
        )
      },
      {
        q: 'Where are you located and do you deliver?',
        a: 'Our dispatch facility is located in Acton, ON and we provide raw pet food delivery throughout the GTA. Please contact us at 905-466-7787 or sales@foeguard.com for any inquiries.'
      }
    ]
  },
  {
    title: 'Health & Nutrition',
    items: [
      {
        q: 'Are FoeGuard meals complete and balanced?',
        a: 'Comfort Dinner recipes are complete and balanced (AAFCO). Primal Feast uses an 80/10/10 ratio designed for rotational feeding or topping.'
      },
      {
        q: 'What if my dog has allergies?',
        a: 'Use our Meal Plan quiz to flag allergens — we\u2019ll surface novel-protein options like Duck or Rabbit and skip any recipes containing your dog\u2019s triggers.'
      },
      {
        q: 'Do I need to add supplementation to your food?',
        a: 'At FoeGuard we believe in creating accessibility for all pet owners. This is why we offer a variety of dinners that are already nutritionally balanced so our FoeGuardians don\u2019t have to worry about supplementation or day-to-day feeding. We also provide full personalization and protein-based Primal Feast meals where customers can add their own supplementation.'
      },
      {
        q: 'Does raw feeding affect my dog\u2019s allergies or digestive issues?',
        a: 'Unlike kibble, raw offers all-natural ingredients which diminish many allergic reactions that pets normally have to preservatives, additives and other by-products that can negatively affect your FoeGuardian.'
      },
      {
        q: 'Why is my pet drinking less water on raw?',
        a: 'Due to the high salt content in kibble, pets drink drastically more water after eating dry pet food in comparison to FoeGuard raw, which acts as a natural moisturizer and replenishes your pet for better health.'
      },
      {
        q: 'Why is my pet eating less on raw?',
        a: 'With raw feeding you will notice that your FoeGuard is eating less and that their stool is much smaller than before. Unlike kibble, there are no additives in our recipes, enabling all of the nutrients to be absorbed by your pet. This also prevents your pet from overeating and maintains a diet that is naturally healthy to them.'
      },
      {
        q: 'What benefits does raw feeding have?',
        a: (
          <>
            <p style={{ margin: '0 0 12px' }}>Most pet parents see noticeable changes within the first 30 days — a glossier coat, cleaner teeth, brighter eyes, smaller stools, steadier energy, better digestion, and fewer flare-ups for dogs with allergies or sensitivities.</p>
            <p style={{ margin: 0 }}>For the full breakdown of how raw feeding supports longevity, vitality and well-being, read our <a href="/new-to-raw" style={{ color: COLORS.red, fontWeight: 700, textDecoration: 'underline' }}>Why Raw?</a> page.</p>
          </>
        )
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
        fontFamily: "'Barlow Semi Condensed', sans-serif"
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
          background: COLORS.cream,
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
              fontSize: 'clamp(40px, 5vw, 56px)',
              fontWeight: 800,
              color: COLORS.charcoal,
              lineHeight: 1.15,
              marginBottom: '0',
              fontFamily: "'Barlow Semi Condensed', sans-serif"
            }}>
              Everything you need to know,<br />
              <span style={{ color: COLORS.red }}>before you switch to FoeGuard Raw.</span>
            </h1>
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
                  fontFamily: "'Barlow Semi Condensed', sans-serif"
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
              background: COLORS.khaki,
              color: COLORS.charcoal,
              padding: '48px 32px',
              borderRadius: '20px',
              textAlign: 'center',
              boxShadow: '6px 6px 0px rgba(0,0,0,0.12)',
              border: `1px solid ${COLORS.khakiDark}`
            }}>
              <MessageCircle size={36} color={COLORS.red} style={{ marginBottom: '12px' }} />
              <h3 style={{
                fontSize: '24px',
                fontWeight: 700,
                marginBottom: '8px',
                color: COLORS.charcoal,
                fontFamily: "'Barlow Semi Condensed', sans-serif"
              }}>Still have questions?</h3>
              <p style={{
                fontSize: '15px',
                color: COLORS.charcoal,
                opacity: 0.85,
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
