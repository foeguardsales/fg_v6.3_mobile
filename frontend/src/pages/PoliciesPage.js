import React from 'react';
import { Navbar, Footer } from '../components/Layout';

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
            Due to the perishable nature of our products, we cannot accept returns. However, if you're unsatisfied with your order, contact us within 7 days of delivery for a refund or replacement.
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
