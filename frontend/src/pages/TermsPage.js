import React from 'react';
import { Navbar, Footer } from '../components/Layout';

export const TermsPage = () => (
  <>
    <Navbar />
    <div className="content-page">
      <div className="content-container">
        <h1>Terms of Use</h1>
        
        <section>
          <h2>Agreement to Terms</h2>
          <p>
            By accessing FoeGuard's website and purchasing products, you agree to these Terms of Use. If you disagree with any part, you may not access our service.
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
