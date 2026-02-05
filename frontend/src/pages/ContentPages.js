import React from 'react';
import { Navbar, Footer } from '../components/Layout';

export const AboutPage = () => (
  <>
    <Navbar />
    <div className="content-page">
      <div className="content-container">
        <h1>About FoeGuard</h1>
        
        <section>
          <h2>Our Story</h2>
          <p>
            FoeGuard was born from a simple belief: our pets deserve the same quality food we eat. Based in Ontario, we partner with local farms to source human-grade ingredients, creating biologically appropriate raw meals that honor your pet's carnivorous nature.
          </p>
          <p>
            Every recipe is crafted with care, combining muscle meat, organ meats, ground bone, and fresh vegetables to deliver complete, balanced nutrition. We believe raw feeding isn’t a trend—it’s a return to what nature intended.
          </p>
        </section>

        <section>
          <h2>Why Raw Feeding?</h2>
          <h3>Biologically Appropriate Nutrition</h3>
          <p>
            Dogs and cats are carnivores. Their digestive systems are designed to process raw meat, bones, and organs—not heavily processed kibble. Raw diets provide enzymes, natural probiotics, and bioavailable nutrients that cooking destroys.
          </p>

          <h3>The Benefits You’ll See</h3>
          <ul className="benefits-list">
            <li><strong>Improved Digestion:</strong> Smaller, firmer stools and reduced gas</li>
            <li><strong>Healthier Skin & Coat:</strong> Natural oils create shine and reduce shedding</li>
            <li><strong>More Energy:</strong> Clean protein fuels vitality without fillers</li>
            <li><strong>Stronger Immunity:</strong> Nutrient-dense food supports immune function</li>
            <li><strong>Better Weight Management:</strong> High protein, low carb keeps pets lean</li>
            <li><strong>Cleaner Teeth:</strong> Chewing raw bones naturally cleans teeth</li>
          </ul>

          <h3>Feeding Guidelines</h3>
          <p>
            Feed 2-3.5% of your pet's body weight daily for adult dogs and 3-3.5% for adult cats. Puppies and kittens require more based on age:
          </p>
          <ul className="benefits-list">
            <li><strong>Puppies (2-4 months):</strong> 10-13% of body weight</li>
            <li><strong>Puppies (4-8 months):</strong> 6-10% of body weight</li>
            <li><strong>Puppies (8-12 months):</strong> 3-6% of body weight</li>
            <li><strong>Kittens (2-4 months):</strong> 6-9% of body weight</li>
            <li><strong>Kittens (4-8 months):</strong> 5-8% of body weight</li>
            <li><strong>Kittens (8-12 months):</strong> 2-6% of body weight</li>
          </ul>
          <p>Adjust portions based on activity level, metabolism, and weight goals. Always consult your veterinarian when changing diets.</p>

          <h3>Is Raw Safe?</h3>
          <p>
            When handled properly, raw feeding is safe and vet-recommended. Dogs and cats have highly acidic stomachs designed to handle bacteria that would affect humans. We follow strict food safety protocols, and our meals are frozen immediately to preserve freshness.
          </p>
          <p>
            Always thaw in the refrigerator, wash hands and surfaces after handling, and transition gradually if your pet is new to raw food.
          </p>
        </section>

        <section>
          <h2>Our Commitment</h2>
          <ul className="benefits-list">
            <li>100% human-grade ingredients</li>
            <li>No hormones, antibiotics, or preservatives</li>
            <li>Ontario-sourced whenever possible</li>
            <li>Ethically raised proteins</li>
            <li>Frozen fresh, never freeze-dried or dehydrated</li>
          </ul>
        </section>
      </div>
    </div>
    <Footer />
  </>
);

export const PoliciesPage = () => (
  <>
    <Navbar />
    <div className="content-page">
      <div className="content-container">
        <h1>Policies</h1>
        
        <section>
          <h2>Shipping Policy</h2>
          <p>
            We ship frozen orders within Ontario via insulated packaging with dry ice. Orders placed by Wednesday ship the following Monday. Delivery takes 1-2 business days.
          </p>
          <p>Shipping is calculated at checkout based on your location and order size.</p>
        </section>

        <section>
          <h2>Return & Refund Policy</h2>
          <p>
            Due to the perishable nature of our products, we cannot accept returns. However, if you’re unsatisfied with your order, contact us within 7 days of delivery for a refund or replacement.
          </p>
          <p>
            For damaged or incorrect orders, please email photos to hello@foeguard.com within 48 hours of delivery.
          </p>
        </section>

        <section>
          <h2>Storage & Handling</h2>
          <p>
            Keep frozen until ready to use. Thaw in refrigerator for 24 hours before serving. Once thawed, use within 3-4 days. Never refreeze thawed food.
          </p>
          <p>
            Wash hands, bowls, and surfaces after handling raw food. Keep raw food separate from human food.
          </p>
        </section>

        <section>
          <h2>Privacy Policy</h2>
          <p>
            We collect only the information necessary to process orders and communicate with customers. We never sell your data. View our full privacy policy at hello@foeguard.com.
          </p>
        </section>
      </div>
    </div>
    <Footer />
  </>
);

export const TermsPage = () => (
  <>
    <Navbar />
    <div className="content-page">
      <div className="content-container">
        <h1>Terms of Use</h1>
        
        <section>
          <h2>Agreement to Terms</h2>
          <p>
            By accessing FoeGuard’s website and purchasing products, you agree to these Terms of Use. If you disagree with any part, you may not access our service.
          </p>
        </section>

        <section>
          <h2>Use of Service</h2>
          <p>
            Our products are intended for pet consumption only. You must be 18 years or older to purchase. You agree to provide accurate information when placing orders.
          </p>
        </section>

        <section>
          <h2>Product Information</h2>
          <p>
            We strive for accuracy in product descriptions, pricing, and availability. However, we reserve the right to correct errors and update information without notice.
          </p>
        </section>

        <section>
          <h2>Payment</h2>
          <p>
            We accept major credit cards via Stripe. Payment is processed at the time of order. Prices are in Canadian dollars and include applicable taxes.
          </p>
        </section>

        <section>
          <h2>Limitation of Liability</h2>
          <p>
            FoeGuard is not liable for any health issues arising from feeding our products. Consult your veterinarian before making dietary changes. We recommend gradual transitions to raw food.
          </p>
        </section>

        <section>
          <h2>Changes to Terms</h2>
          <p>
            We may update these terms at any time. Continued use of our service after changes constitutes acceptance of new terms.
          </p>
        </section>

        <section>
          <h2>Contact</h2>
          <p>
            Questions about these terms? Contact us at hello@foeguard.com.
          </p>
        </section>
      </div>
    </div>
    <Footer />
  </>
);