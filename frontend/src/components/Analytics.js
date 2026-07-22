import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { initAnalytics, trackPageView } from '../services/analytics';

const GSC_VERIFICATION = process.env.REACT_APP_GSC_VERIFICATION;

// Non-intrusive analytics mount point:
//  - boots any configured providers (GA4 / Meta Pixel / Clarity)
//  - fires a SPA page_view on every route change
//  - adds the Google Search Console ownership meta tag when configured
// Renders no visible UI.
export const Analytics = () => {
  const location = useLocation();

  useEffect(() => { initAnalytics(); }, []);

  useEffect(() => {
    trackPageView(location.pathname + location.search);
  }, [location.pathname, location.search]);

  if (!GSC_VERIFICATION) return null;
  return (
    <Helmet>
      <meta name="google-site-verification" content={GSC_VERIFICATION} />
    </Helmet>
  );
};

export default Analytics;
