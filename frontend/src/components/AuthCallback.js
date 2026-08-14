import React, { useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useShopifyAuth } from '../contexts/ShopifyAuthContext';

/**
 * AuthCallback — one-time exchange of the Emergent session_id.
 *
 * Emergent redirects back to <origin>/account#session_id=XXX. This component
 * reads the fragment, POSTs it to the backend (which sets the httpOnly session
 * cookie), then replaces the URL to a clean /account.
 *
 * Uses a useRef guard (not state) so the exchange runs exactly once, even under
 * React StrictMode's double-invoke.
 */
const AuthCallback = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { processSession } = useShopifyAuth();
  const hasProcessed = useRef(false);

  useEffect(() => {
    if (hasProcessed.current) return;
    hasProcessed.current = true;

    const hash = location.hash || '';
    const match = hash.match(/session_id=([^&]+)/);
    const sessionId = match ? decodeURIComponent(match[1]) : null;

    const run = async () => {
      if (sessionId) {
        try {
          await processSession(sessionId);
        } catch (_) { /* fall through to /account which will show login */ }
      }
      // Clear the fragment and land on the account page.
      navigate('/account', { replace: true });
    };
    run();
  }, [location.hash, processSession, navigate]);

  return (
    <div style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#2C2C2C' }}>
      <p style={{ fontSize: '16px' }}>Signing you in…</p>
    </div>
  );
};

export default AuthCallback;
