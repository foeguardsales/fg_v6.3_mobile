# FoeGuard — Multi-Prompt Roadmap (do ONE prompt at a time)

Preview: https://338a1880-4c48-4a88-b1cd-c47597f47b55.preview.emergentagent.com
Constraints (ALL prompts): GitHub-safe (additive where possible, no deleting existing components/files for Shopify work, clean code, NO git ops by me — user uses "Save to Github"). Minimal credits. Do NOT change existing UI/design unless the prompt is explicitly about it. API keys via env placeholders only, never hardcode.

NOTE: env (.env) files were wiped & recreated. Mongo empty (auto-seeds). Stripe/Brevo/Cloudflare/Shopify keys are PLACEHOLDERS (user will add real keys in their own account later).

## PROMPT 1 — CART REFACTOR (IN PROGRESS)
- ONE universal cart everywhere (homepage/menu/product/treat/account/all). Shared navbar (ModernNavbar in LandingPage.js, re-exported as Navbar via components/Layout.js) opens it via useCart setIsCartOpen. Render <UniversalCart/> ONCE in App.js. Retire SlideCart (=()=>null).
- Header "CART (n)" count inline. Remove: lb-of-meals, discount-applied, lb-until-next, Subscribe&Save, Promo, Special Instructions, Stock&Save banner, saved-pets box.
- Title -> products directly. No collection label per line.
- Unified line design meals+treats. Treats get integer +/- counter (was text). Meals keep lb counter, show variant label ("1 lb pack") under name, remove duplicate lb sub-line.
- Meal variants = separate lines: ProductDetail writes composite key `${productId}::${variantLabel}` + store productId in value. Grid stays plain productId (grid shows "+" not qty for variant products, so safe). Fix product lookups to use entry.productId||keySplit.
- Delivery date BELOW total; min today+3; NO max (unlimited future); MANDATORY before checkout.
- Checkout -> Shopify: shopifyCart.cartCreate({lines(from shopify_variant_id), attributes:[{key:'Delivery Date',value}]}) -> redirect checkoutUrl. Graceful error (tokens empty now).
- Data model kept: selectedProteins (obj) + selectedTreats (arr) in localStorage; context mirrors via poll + events (foeguard:box-updated / foeguard:cart-changed).
- Added product/treat model field shopify_variant_id (nullable).

## PROMPT 2 — Tracking & Analytics (modular, non-intrusive, env placeholders only)
- Shopify Email (NOT Klaviyo): tag/route events: account_created, order_placed, quiz_completed, meal_plan_landing (SEPARATE from meal-plan-from-menu), abandoned_cart. Use headless custom event tagging if supported else native customer events.
- GA4: page_view, add_to_cart, checkout initiated, order completed.
- Meta Pixel: same ecommerce events as GA4.
- Microsoft Clarity: global session recording/heatmaps.
- Google Search Console: verify ownership + submit sitemap.xml.
- All keys via env vars only.

## PROMPT 3 — Shopify Headless (DESIGN-SAFE, additive/modular)
- Shopify = data source for products, collections, pages ONLY.
- PRESERVE EVERYTHING (meal plan steps/pages, delivery steps, contact, calculator, icons, badges, AI design). Only swap TEXT where a matching Shopify metaobject/page exists; else leave untouched.
- Products: replace data only (title/price/images/variants/inventory/description). No layout change.
- Collections: title/image/description from Shopify. No redesign.
- Pages: text from Shopify Pages API only where matching page exists.
- Metaobjects: ingredients/feeding guide/nutrition text only; keep design/icons/layout.
- Additive modular service files alongside existing code. Codebase functional before+after. Env placeholders.

## PROMPT 4 — Menu "Learn More" additions
Under "Learn More" nav dropdown add links to EXISTING pages:
- Build Your Meal Plan (/meal-plan)
- Raw Dog Food Calculator (/calculator)
(Currently Learn More has: FAQ /faq, Delivery Information /delivery, Raw Feeding Guide /raw-feeding-guide)

## PROMPT 5 — Raw Starter Bundle Landing Page (STANDALONE, not in site/menu)
Separate page (own route, not linked in nav) for ads/social CTAs. Mockup wired for easy Shopify API addition later.
Sections in order: header, subheader, cta, product image, list container ("Raw Starter Bundle includes:"), cta button, how-it-works (3 images w/ text), benefits section, faq section, cta, reviews, final cta.

## PROMPT 6 — Production Readiness (no UI/design change)
- Remove duplicate Shopify API calls; reusable/modular services.
- Env vars correct, never exposed to frontend; Admin API token NEVER in React. React = UI only, never hits Shopify directly.
- Improve error handling/logging.
- FastAPI caching active for products/collections/pages/metaobjects.
- Auto-invalidate cache via Shopify webhooks: product update, inventory update, customer update, order create. Secure webhook endpoints.
- Preserve UI exactly.
