import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { initAnalytics, trackPageView } from '../services/analytics';

// Analytics is now a pure event router: it fires a `page_view` on every
// SPA route change so GTM can forward it to whichever tags the merchant
// has configured (GA4, Meta Pixel, Clarity, etc.). GTM itself is loaded
// once from `public/index.html`. Renders no visible UI.
export const Analytics = () => {
  const location = useLocation();

  useEffect(() => { initAnalytics(); }, []);

  useEffect(() => {
    trackPageView(location.pathname + location.search);
  }, [location.pathname, location.search]);

  return null;
};

export default Analytics;
