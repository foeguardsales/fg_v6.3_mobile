# FoeGuard — Multi-Prompt Roadmap (do ONE prompt at a time)

Preview: https://338a1880-4c48-4a88-b1cd-c47597f47b55.preview.emergentagent.com
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

## PROMPT 2 — Tracking & Analytics ✅ DONE (env-gated, additive)
Files: frontend/src/services/analytics/index.js, frontend/src/components/Analytics.js (mounted in App.js), backend/events_service/router.py (POST /api/events/track, included in server.py).
Env placeholders (frontend/.env, all blank = OFF): REACT_APP_GA4_MEASUREMENT_ID, REACT_APP_META_PIXEL_ID, REACT_APP_CLARITY_PROJECT_ID, REACT_APP_GSC_VERIFICATION.
Wired events: page_view (route change), add_to_cart (ProductDetail + TreatDetail), begin_checkout/InitiateCheckout (UniversalCart), purchase (OrderSuccess). Shopify-Email named events via trackShopifyEmailEvent -> /api/events/track: account_created (RegisterForm + MealPlan saveProfile), quiz_completed + account_created (MealPlanPage), meal_plan_landing (MealPlanPage mount), order_placed (OrderSuccess). abandoned_cart = Shopify native.
Sitemap already exists at /api/sitemap.xml (seo_service). GSC verify via meta tag when env set. User submits sitemap in GSC manually.

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
