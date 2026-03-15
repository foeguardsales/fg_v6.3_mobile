import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Navbar, Footer } from '../components/Layout';

export const NewToRawPage = () => {
  const navigate = useNavigate();

  return (
    <>
      <Navbar />
      <div className="new-to-fg-page">
        {/* SECTION 1 — Hero */}
        <section className="ntf-hero">
          <div className="ntf-hero-content">
            <h1 style={{ textTransform: 'none', fontFamily: "'CS Gordon', serif" }}>New to FG</h1>
            <p className="ntf-hero-subtitle" style={{ fontWeight: '600', fontSize: '18px', marginBottom: '16px' }}>
              No complicated prep. No added supplements required for complete dinners.
            </p>
          </div>
        </section>

        {/* SECTION 2 — Feel confident */}
        <section className="ntf-section ntf-easy" style={{ background: '#F5F3EF' }}>
          <div className="ntf-container">
            <h2 style={{ textAlign: 'center', textTransform: 'none' }}>Feel confident about switching to FoeGuard raw</h2>
            <p style={{ fontSize: '17px', marginBottom: '16px', textAlign: 'center', fontWeight: '600' }}>
              Dogs are biologically designed to thrive on raw food nutrition. Their powerful stomach acid, sharp teeth, and short digestive systems allow them to efficiently digest raw meat, organs, and bone.
            </p>
            <p style={{ fontSize: '17px', marginBottom: '0', textAlign: 'center' }}>
              FoeGuard was built to feed dogs the way nature intended. We use fresh, organic, whole-prey, human-grade ingredients that are made for your dog's anatomy to digest easily, maximize nutrient absorption, and support noticeable results.
            </p>
          </div>
        </section>

        {/* SECTION 3 — How FoeGuard compares */}
        <section className="ntf-section ntf-safe" style={{ background: 'white' }}>
          <div className="ntf-container">
            <h2 style={{ textTransform: 'none' }}>How FoeGuard compares</h2>
            
            <div style={{ marginBottom: '32px' }}>
              <h3 style={{ fontSize: '20px', marginBottom: '12px', fontWeight: '600' }}>Retail Raw</h3>
              <p style={{ fontSize: '17px', lineHeight: '1.7' }}>
                Retail raw food brands can offer a healthier alternative for pet owners, but they often lack transparent sourcing and clarity around what cuts of meat are being used or how the ingredients are raised. Livestock raised on antibiotics, hormones, or GMO feeds can have an immediate effect on your dog, while months-old, lower-quality cuts can become more problematic over time.
              </p>
            </div>

            <div style={{ marginBottom: '32px' }}>
              <h3 style={{ fontSize: '20px', marginBottom: '12px', fontWeight: '600' }}>Gently Cooked</h3>
              <p style={{ fontSize: '17px', lineHeight: '1.7' }}>
                Gently cooked food is another option that can be better than kibble when balanced and prepared correctly, but it is not as nutritionally intact as raw in its natural form. The cooking process can reduce nutrient availability and change the integrity of the final product. Dogs are not humans — you do not need to taste-test their food to know what they are anatomically designed to eat.
              </p>
            </div>

            <div style={{ marginBottom: '32px' }}>
              <h3 style={{ fontSize: '20px', marginBottom: '12px', fontWeight: '600' }}>Kibble</h3>
              <p style={{ fontSize: '17px', lineHeight: '1.7' }}>
                Kibble is extremely processed, regardless of what ingredients are used or how fancy the packaging looks. It is cooked at high temperatures, which can destroy essential nutrients and make it harder for pets to digest. Minimal pet food regulations also allow for lower-quality meat, vague sourcing, and highly processed ingredients hidden behind marketing terms such as "natural," protein "meals," and "made with meat," even when only a small percentage is actually required to meet AAFCO standards.
              </p>
            </div>

            {/* Comparison Table - Moved here */}
            <div className="comparison-table-wrapper" style={{ marginTop: '48px', border: '2px solid #E8DDD0', borderRadius: '12px', padding: '24px' }}>
              <table className="comparison-table">
                <thead>
                  <tr>
                    <th className="feature-col"></th>
                    <th className="brand-col foeguard-col">
                      <span className="brand-name">FoeGuard</span>
                    </th>
                    <th className="brand-col">
                      <span className="brand-name">Retail Raw</span>
                    </th>
                    <th className="brand-col">
                      <span className="brand-name">Kibble</span>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="feature-cell">Human-Grade Ingredients</td>
                    <td className="check-cell foeguard-cell"><span className="check-icon">✓</span></td>
                    <td className="check-cell"><span className="x-icon">✗</span></td>
                    <td className="check-cell"><span className="x-icon">✗</span></td>
                  </tr>
                  <tr>
                    <td className="feature-cell">Organic & Non-GMO</td>
                    <td className="check-cell foeguard-cell"><span className="check-icon">✓</span></td>
                    <td className="check-cell"><span className="x-icon">✗</span></td>
                    <td className="check-cell"><span className="x-icon">✗</span></td>
                  </tr>
                  <tr>
                    <td className="feature-cell">Farm Fresh</td>
                    <td className="check-cell foeguard-cell"><span className="check-icon">✓</span></td>
                    <td className="check-cell"><span className="x-icon">✗</span></td>
                    <td className="check-cell"><span className="x-icon">✗</span></td>
                  </tr>
                  <tr>
                    <td className="feature-cell">Transparent Sourcing</td>
                    <td className="check-cell foeguard-cell"><span className="check-icon">✓</span></td>
                    <td className="check-cell"><span className="x-icon">✗</span></td>
                    <td className="check-cell"><span className="x-icon">✗</span></td>
                  </tr>
                  <tr>
                    <td className="feature-cell">Ethically Raised in Small Batches</td>
                    <td className="check-cell foeguard-cell"><span className="check-icon">✓</span></td>
                    <td className="check-cell"><span className="x-icon">✗</span></td>
                    <td className="check-cell"><span className="x-icon">✗</span></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* SECTION 4 — Discover what really works */}
        <section className="ntf-section ntf-problem" style={{ background: '#F5F3EF' }}>
          <div className="ntf-container">
            <h2 style={{ textTransform: 'none' }}>Discover what really works for your dog</h2>
            <p style={{ fontSize: '17px', marginBottom: '16px' }}>
              Get a clearer understanding of your dog's health and the flavours they truly enjoy.
            </p>
            <p style={{ fontSize: '17px', marginBottom: '16px' }}>
              Many guardians feel frustrated by unclear labels and inconsistent sourcing.
            </p>
            <p style={{ fontSize: '17px' }}>
              While we cannot promise instant answers, switching to properly sourced, biologically appropriate food often removes one of the biggest unknowns when something is making your dog uncomfortable — their diet.
            </p>
          </div>
        </section>

        {/* SECTION 5 — Transition Guide */}
        <section className="ntf-section ntf-transition" style={{ background: 'white' }}>
          <div className="ntf-container">
            <h2 style={{ textTransform: 'none' }}>How do I transition my pet?</h2>
            <p style={{ fontSize: '17px', marginBottom: '16px' }}>
              Because our meals are nutrient-dense and minimally processed, a thoughtful transition helps avoid digestive upset.
            </p>
            <p style={{ fontSize: '17px', marginBottom: '32px' }}>We recommend the following approaches:</p>

            {/* Option 1 */}
            <div className="transition-option">
              <h3>Option 1: 10-Day Gradual Transition</h3>
              <p className="option-subtitle">
                Best for kibble-fed pets, sensitive stomachs, puppies, seniors, or cautious guardians.
              </p>
              <div className="transition-schedule">
                <div className="schedule-row">
                  <span className="day">Day 1</span>
                  <span className="ratio">10% FoeGuard / 90% current food</span>
                </div>
                <div className="schedule-row">
                  <span className="day">Day 2</span>
                  <span className="ratio">20% FoeGuard / 80% current food</span>
                </div>
                <div className="schedule-row highlight">
                  <span className="day">...</span>
                  <span className="ratio">Continue increasing FoeGuard by 10% daily</span>
                </div>
                <div className="schedule-row">
                  <span className="day">Day 10</span>
                  <span className="ratio">100% FoeGuard — fully transitioned!</span>
                </div>
              </div>
              <div className="transition-tips">
                <p><span className="tip-check">✓</span> Feed slightly smaller portions during transition</p>
                <p><span className="tip-check">✓</span> Monitor stool consistency</p>
                <p><span className="tip-check">✓</span> Avoid introducing new treats during this period</p>
              </div>
              <p className="method-note">This method is the safest and most predictable.</p>
            </div>

            {/* Option 2 */}
            <div className="transition-option optional-method">
              <h3>Optional: Structured Fast + Switch</h3>
              <p className="option-subtitle warning">
                Only recommended for healthy adult dogs already eating raw or lightly processed diets.
              </p>
              <ol className="numbered-list">
                <li>Feed their regular meal in the morning.</li>
                <li>Allow a 24-hour digestive reset (water is fine).</li>
                <li>Introduce FoeGuard at the next evening meal.</li>
              </ol>
              <div className="important-note">
                <strong>Important:</strong>
                <ul>
                  <li>Start with a slightly smaller portion than usual.</li>
                  <li>We generally do not recommend fasting for kibble-fed dogs unless guided.</li>
                  <li>Feed one or two meals per day.</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 6 — Is Raw Safe? (Moved here after transition) */}
        <section className="ntf-section" style={{ background: '#F5F3EF' }}>
          <div className="ntf-container">
            <h2 style={{ textTransform: 'none' }}>Is raw food safe for my dog?</h2>
            <p style={{ fontSize: '17px', marginBottom: '24px' }}>
              When handled properly — yes.
            </p>
            <p style={{ fontSize: '17px', marginBottom: '16px' }}>
              Dogs and cats are biologically designed to digest raw meat, bone, and organ. The key is quality, formulation, and proper storage.
            </p>
            <p className="ntf-emphasis" style={{ fontSize: '17px', marginBottom: '16px', fontWeight: '600' }}>
              At FoeGuard, every meal is:
            </p>
            <ul className="ntf-list" style={{ fontSize: '17px', marginBottom: '24px' }}>
              <li>Professionally balanced</li>
              <li>Prepared in a government-inspected facility</li>
              <li>Flash frozen immediately</li>
              <li>Handled with the same standards you would use for your own food</li>
            </ul>
            <p style={{ fontSize: '17px' }}>
              Raw feeding isn't extreme.<br />
              It's simply a return to biological design.
            </p>
          </div>
        </section>

        {/* SECTION 7 — If They Won't Eat */}
        <section className="ntf-section ntf-wont-eat" style={{ background: 'white' }}>
          <div className="ntf-container">
            <h2 style={{ textTransform: 'none' }}>What if my dog or cat won't eat raw?</h2>
            <p style={{ fontSize: '17px', marginBottom: '16px' }}>
              Transitioning to raw is often <strong>behavioural</strong> — not nutritional.
            </p>
            <p style={{ fontSize: '17px', marginBottom: '16px' }}>
              Many pets are accustomed to processed foods engineered for taste intensity, flavour enhancers, and frequent treats. Real food can feel unfamiliar at first.
            </p>
            <p style={{ fontSize: '17px', fontWeight: '600', marginBottom: '24px' }}>
              Consistency and structure usually solve it.
            </p>
            <p style={{ fontSize: '17px', marginBottom: '16px' }}>To encourage success:</p>
            <ul className="ntf-list" style={{ fontSize: '17px', marginBottom: '24px' }}>
              <li>Feed at consistent times</li>
              <li>Avoid free-feeding</li>
              <li>Limit treats during transition</li>
              <li>Ensure your dog is exercised before mealtime</li>
              <li>Remove the bowl after 15–20 minutes if uneaten</li>
            </ul>
            <p style={{ fontSize: '17px', marginBottom: '16px' }}>
              Structure builds appetite. If they skip a meal, store the food in the fridge and offer it again at the next scheduled feeding.
            </p>
            <p className="conclusion-text" style={{ fontSize: '17px' }}>
              With patience and consistency, most pets adapt quickly — and thrive.
            </p>
          </div>
        </section>

        {/* FINAL CTA */}
        <section className="ntf-section ntf-final-cta" style={{ background: '#F5F3EF' }}>
          <div className="ntf-container">
            <h2 style={{ textTransform: 'none', textAlign: 'center' }}>Ready to make your dog's meal plan?</h2>
            <p style={{ fontSize: '17px', marginBottom: '32px', textAlign: 'center' }}>
              Let us create your plan or build your own box.
            </p>
            <div className="ntf-cta" style={{ textAlign: 'center', display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
              <button 
                className="btn-primary"
                onClick={() => navigate('/build-box')}
                style={{ borderRadius: '8px' }}
              >
                Create Your Plan
              </button>
              <button 
                className="btn-secondary"
                onClick={() => navigate('/build-box')}
                style={{ borderRadius: '8px' }}
              >
                Order Menu
              </button>
            </div>
          </div>
        </section>
      </div>
      <Footer />
    </>
  );
};
