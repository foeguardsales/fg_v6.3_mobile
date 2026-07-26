# FoeGuard — Multi-Prompt Roadmap (do ONE prompt at a time)

Preview: https://code-sync-preview-3.preview.emergentagent.com
Constraints (ALL prompts): GitHub-safe (additive where possible, no deleting existing components/files for Shopify work, clean code, NO git ops by me — user uses "Save to Github"). Minimal credits. Do NOT change existing UI/design unless the prompt is explicitly about it. API keys via env placeholders only, never hardcode.

NOTE: env (.env) files were wiped & recreated. Mongo empty (auto-seeds). Stripe/Brevo/Cloudflare/Shopify keys are PLACEHOLDERS (user will add real keys in their own account later).

## PROMPT 1 — CART REFACTOR ✅ DONE (verified by UI testing agent, all 8 checks pass)
- ONE universal cart everywhere (homepage/menu/product/treat/account/all). Shared navbar (ModernNavbar in LandingPage.js, re-exported as Navbar via components/Layout.js) opens it via useCart setIsCartOpen. Render <UniversalCart/> ONCE in App.js. Retire SlideCart (=()=>null).
- Header "CART (n)" count inline. Remove: lb-of-meals, discount-applied, lb-until-next, Subscribe&Save, Promo, Special Instructions, Stock&Save banner, saved-pets box.
- Title -> products directly. No collection label per line.
- Unified line design meals+treats. Treats get integer +/- counter (was text). Meals keep lb counter, show variant label ("1 lb pack") under name, remove duplicate lb sub-line.
- Meal variants = separate lines: ProductDetail writes composite key `${productId}::${variantLabel}` + store productId in value. Grid stays plain productId (grid shows "+" not qty for variant products, so safe). Fix product lookups to use entry.productId||keySplit.
- Delivery date BELOW total; min today+3; NO max (unlimited future); MANDATORY before checkout.
- Checkout -> Shopify: shopifyCart.cartCreate({lines(from shopify_variant_id), attributes:[{key:'Delivery Date',value}]}) -> redirect checkoutUrl. Graceful error (tokens empty now).
- Data model kept: selectedProteins (obj) + selectedTreats (arr) in localStorage; context mirrors via poll + events (foeguard:box-updated / foeguard:cart-changed).
- Added product/treat model field shopify_variant_id (nullable).

## PROMPT 2 — Tracking & Analytics ✅ DONE (Google Tag Manager)
Files: `public/index.html` (GTM-NR3N5DHG container snippet + noscript iframe), `frontend/src/services/analytics/index.js` (thin dataLayer.push router), `frontend/src/components/Analytics.js` (mounted in App.js, fires `page_view` on every SPA route change), `backend/events_service/router.py` (POST /api/events/track).
No env slots needed — GTM is the single source of truth for all pixels/tags (GA4, Meta Pixel, Clarity, etc.). All configuration happens in the GTM UI.
Wired events (pushed to `window.dataLayer`): page_view (SPA route change, first-load skipped to avoid duplicate with GTM's own initial fire), add_to_cart (ProductDetail + TreatDetail), begin_checkout (UniversalCart), purchase (OrderSuccess). Shopify Email named events via trackShopifyEmailEvent → /api/events/track: account_created (RegisterForm + MealPlan saveProfile), quiz_completed + meal_plan_landing (MealPlanPage), order_placed (OrderSuccess). abandoned_cart = Shopify native.
Sitemap: /api/sitemap.xml (seo_service). GSC verification: handled inside GTM (Google Tag → Verification variable) instead of a hardcoded meta tag.

## PROMPT 3 — Shopify Headless ✅ DONE (design-safe fallback added)
App was ALREADY Shopify-wired (services/shopify/* + backend shopify_service/*; ProductDetail/TreatDetail/CollectionPage/MenuPage use catalog; normalizer maps foeguard.* metafields = metaobjects for ingredients/nutrition/feeding). Added DESIGN-SAFE local fallback in services/shopify/catalog.js (additive only): Shopify when configured, else local /api/products & /api/treats (identical shape) so site is fully functional before+after Shopify keys. Collections -> [] / null gracefully. Verified: /product/cd-chicken loads via fallback, full add-to-cart flow works.

## PROMPT 4 — Learn More menu ✅ DONE
Added to Learn More dropdown (LandingPage.js menuItems): 'Build Your Meal Plan' -> /meal-plan, 'Raw Dog Food Calculator' -> /calculator (both existing pages).

## PROMPT 5 — Raw Starter Bundle landing ✅ DONE
New standalone page frontend/src/pages/RawStarterBundlePage.js, route /raw-starter-bundle (NOT in nav). On-brand. Sections: hero(header+subheader+cta), product image + "Raw Starter Bundle includes:" list + cta, how-it-works (3 img+text), benefits, faq, cta band, reviews, final cta. Checkout wired to shopifyCart.cartCreate via BUNDLE.shopifyVariantId placeholder (mockup-safe when empty).

## PROMPT 6 — Production Readiness ✅ DONE (backend verified 16/16)
App was already production-grade for Shopify (proxy-only access, Admin token backend-only, HMAC webhooks). Gaps fixed:
- Caching now ACTIVE (was defined but unused): wired get_or_set into shopify_service/router.py GET /products, /products/{handle}, /collections, /collections/{handle}; added NEW cached /pages + /page/{handle} (BUCKET_PAGES). Metaobjects ride with product metafields (BUCKET_PRODUCTS).
- Webhooks already HMAC-secured + invalidate products/collections/inventory/orders/pages/customers.
- Verified: NO Shopify tokens in frontend; React only hits /api/shopify/* proxy; Admin token server-only; env not exposed.
- Graceful 502 when Shopify unconfigured -> frontend local fallback. Backend stays healthy.
- seed_data.py updated (by testing agent) with shopify_variant_id:null on all products/treats.
ALL 6 PROMPTS COMPLETE.

## CUSTOMER AUTH MIGRATION — Shopify Customer Account API (OAuth/OIDC) ✅ CODE DONE (2026-07, E2E pending real creds)
Goal: Shopify is the SOLE source of truth for CUSTOMER auth. No Mongo/JWT customer login. Admin auth stays on Mongo/JWT (untouched, per user).
Backend: NEW backend/customer_auth_service/ (router.py) — OAuth2 Authorization Code + PKCE via OIDC discovery, confidential client (Basic auth on token endpoint). Own motor client. Server-side sessions in Mongo `customer_sessions`; PKCE/state in `customer_oauth_flows`. Browser gets ONLY httpOnly cookie `fg_customer_session` (secure, samesite=lax). Tokens never reach React.
  Routes (/api/customer-auth): GET /login (302->Shopify authorize), GET /callback (code->tokens, decode id_token, enrich via Customer Account API, create session, 302 back), GET /session ({authenticated,customer}), POST /logout (clear session + Shopify end_session url), GET /orders (Customer Account API, []-graceful).
  Graceful: /login -> 503 when unconfigured; /session -> authenticated:false; /orders -> []. Verified via curl.
Backend server.py: included customer_auth_router; RETIRED /api/auth/register (410 Gone); /api/auth/login + /auth/me KEPT for admin. Profiles endpoint now accepts additive optional `shopify_customer_id` (email stays the key; data preserved).
Frontend: ShopifyAuthContext rewritten -> reads /customer-auth/session (fetch credentials:include), login/register = redirect to /customer-auth/login, logout = POST + redirect to Shopify logout. Writes localStorage flag `foeguard.signedIn` + `foeguard.shopifyUser` cache + dispatches `foeguard:auth-changed`. useAuth keeps same shape. services/api.js authService/orderService reworked (no classic Storefront customer token). AuthForms.js + account/AuthSection.js = "Continue with Shopify" button (no email/password form). MealPlanPage: removed silent Mongo register/login + password field (profile still saved by email; prompts user to sign in on /account). LandingPage nav signed-in dot now reads `foeguard.signedIn`.
ENV (backend/.env, all blank placeholders — user adds real values in their Shopify account/env): SHOPIFY_SHOP_ID, SHOPIFY_CUSTOMER_ACCOUNT_CLIENT_ID, SHOPIFY_CUSTOMER_ACCOUNT_CLIENT_SECRET, SHOPIFY_CUSTOMER_ACCOUNT_API_VERSION, CUSTOMER_AUTH_REDIRECT_URI (blank=auto-derive), CUSTOMER_AUTH_POST_LOGIN_REDIRECT.
PENDING (needs user): real Customer Account API app creds + register callback URL {origin}/api/customer-auth/callback in Shopify. Then run backend+frontend testing agents for true E2E OAuth login/callback/session/logout.
NOTE: classic Storefront customer-token code (services/shopify/customers.js, customerTokenStorage) is now UNUSED but left in place (harmless, GitHub-safe). Can be removed later if desired.
