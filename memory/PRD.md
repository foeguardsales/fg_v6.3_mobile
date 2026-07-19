# FoeGuard — PRD

## Original Problem Statement
FoeGuard is a raw dog & cat food e-commerce site for Ontario, CA. The user iterates copy/layout/typography page-by-page. Shopify is now the source of truth for products, collections, pages, SEO, and customer authentication (Shopify Headless).

## Stack
- Frontend: React (CRA) — Barlow Bold (headings) + **Rubik Regular** (body/subtext)
- Backend: FastAPI → Shopify Storefront + Admin GraphQL (Admin token stays server-side)
- Cache: FastAPI in-memory TTL cache (`shopify_service.cache`) with Shopify-webhook-driven invalidation
- Legacy MongoDB still present but bypassed for catalog/customers

## What's Implemented (Feb 2026)

### 2026-02 (b) — Auto-updating metafield pipeline + webhook self-register
- **`useShopifyPage(handle)`** now paired with `services/shopify/pageMeta.js` helpers (`getMetafieldImage`, `getMetafieldImageList`, `getMetafieldMetaobjects`) so any React page can pull merchant-managed content in one line, keeping hardcoded fallbacks until the metafield is populated.
- **`<ShopifyImage handle="..." metafieldKey="..." fallback="..." />`** drop-in component: swap any hardcoded `<img>` and it auto-pulls the correct MediaImage from Shopify once the merchant assigns it.
- **AboutPage** now consumes `foeguard.hero` + `foeguard.team_images` from the Shopify `about-us` page. Zero visual regression today — farm photos serve as fallback.
- **`POST /api/shopify/admin/register-webhooks`** — gated by `X-Foeguard-Admin-Key` header (see `.env`). Idempotently registers all 7 needed webhooks in the Shopify store via the Admin GraphQL API. Returns a clear `hint` when the Admin token lacks the required scopes.
- **`GET  /api/shopify/admin/webhooks`** — read-only list of every subscription currently on the store.
- **`POST /api/shopify/admin/deregister-webhooks`** — bulk delete (used when rotating URLs).
- **Docs**: `/app/docs/METAFIELD_INTEGRATION.md` explains the one-line pattern for adding new metafield-driven content to any page.

### 2026-02 — Shopify Headless completion (Prompts 2 / 3 / 4 / 5)
- **Prompt 2 (Metafields)** — Product page now consumes safe metafield renderers (`/app/frontend/src/components/ProductMetafields.js`) instead of inlined JSX. `IngredientsSection`, `NutritionSection`, `FeedingGuide`, `ProductInfo`, `ComparisonTable`, `BenefitIcons` never auto-render raw HTML; missing metafields are logged via `logMissingMetafields()` (per spec).
- **Prompt 3 (Headless SEO)** — Server-generated JSON-LD (Product, Organization, Breadcrumb), OG + Twitter tags, canonical URLs, `/api/sitemap.xml` and `/api/robots.txt` all sourced from Shopify (no hardcoded SEO values).
- **Prompt 4 (Caching + Webhooks)** —
  - `/api/shopify/products`, `/products/{handle}`, `/collections`, `/collections/{handle}`, `/pages`, `/page/{handle}` are cached (5-min TTL, `SHOPIFY_CACHE_TTL` env override).
  - Async-safe TTL cache with bucketed keys (products / collections / pages / metaobjects).
  - New HMAC-verified webhook endpoints at `/api/webhooks/shopify/*`:
    - `products-update`, `products-delete`, `collections-update`, `inventory-update`, `customers-update`, `customers-create`, `orders-create`, `pages-update`
    - Diagnostics: `GET /_cache` (read-only snapshot), `POST /_cache/purge` (dev nuke)
  - Signature: `X-Shopify-Hmac-Sha256`, verified via `hmac.compare_digest` against `SHOPIFY_WEBHOOK_SECRET`. Fail-closed if secret missing.
  - Verified via testing agent: 23/23 backend tests pass, frontend product page renders without errors, cache hit reduces response 354ms → 94ms.
- **Prompt 5 (Customer System)** — Shopify Customer Authentication (login / register / recover / update / me / logout) proxied via `/api/shopify/customers/*`. All customers created via the site appear directly in the Shopify admin.

### Jun 2026 — Iteration 19: Shopify Headless UI prep (Menu / Product / Treat / Cart redesign)

**Iteration 19b — user corrections (applied):**
- **Menu cards**: product **descriptions RESTORED** (were wrongly removed). Title, description and price now render in the SAME font (Barlow Semi Condensed) at the SAME size (15px mobile / 16px desktop) so they look equal; "From" label now brown `#3B2A1A` (was khaki).
- **Category strip** (`.menu-category-text--on-hero`): thinner padding (`2px 12px 3px`, esp. top), lighter overlay `rgba(59,42,26,0.5)`; hero margin-bottom reduced to 6px so menu sits tight under it.
- **Personalize section REMOVED** from product + treat pages (was not requested).
- **Packaging (meals) / Pack Size (treats)** kept, now rendered as **dot-style radios** (`pd-radio-row`), not oval pills.
- **Trust badges** (100% Recyclable / Humanely Raised / Made in Canada) moved to **below the Quantity stepper**.
- **CTA button**: wording unified to **"Add to Cart" / "Update Cart"** and reverted to the **stationary bottom-anchored floating bar** (same format as menu, `bb-floating-checkout` / `--inline` in modal) showing `• $Total`.

**Iteration 19a (initial):** menu "From $X/lb" pricing (base÷6×0.85), View Cart floating button, cart discount messaging (no progress bars), variant/personalization placeholders — pricing/discount engine untouched.



### 2025-07 — Menu/product batch #2 (verified by testing agent, 5/5 PASS)
- **CRITICAL sheet-anchor fixed**: mobile product sheet no longer flies off-screen. Locked `#root`
  (real scroller) overflow while modal open + `overscroll-behavior:contain` + `.bb-overlay--sheet`
  `overflow:hidden`. Panel stays at 44px top before/after scrolling. (meal + treat sheets)
- **Removed Add-to-Cart button from product sheets**; the +/- ("Add") now live-syncs the box to the
  shared menu selection (sessionStorage + `foeguard:box-updated` event → BoxBuilder re-reads). Menu
  and product page are now in UNISON both directions. Menu floating Add-to-Cart is the only commit.
- **Product card price**: `$X.XX/lb` when qty 0; total + `($X.XX/lb)` once qty>=6.
- **Sheet**: qty starts at 0 (unison); per-lb when 0; "Size" label → "Add".
- **Spacing**: trust-icons mb 24→10; notes→FAQ + end gaps reduced; category tabs padding/margin
  reduced; mobile menu edge-to-edge (box-builder 0 side padding, hero full-bleed radius 0) —
  measured 0px/390px full-bleed on 390 viewport.
- **DEFERRED to Shopify**: "Add to Cart → cart badge top-left + stay on page + reset menu"
  (committed-cart behavior). Recommended to build with Shopify Cart API (source of truth) to avoid
  throwaway local-cart work.


- **SelectionBreadcrumb** padding reduced (10px 20px → 5px 16px); `.box-builder` mobile top padding 10px→2px (tighter gap to category tabs).
- **Mobile menu**: `.product-grid` row-gap 0 (continuous list, "part of the page"); immersive category hero full-bleed on mobile (`border-radius:0`), rounded (14px) + capped 440px banner on desktop.
- **CRITICAL — product bottom-sheet (ProductDetail + TreatDetail modals)**:
  - Closing a sheet now returns user to their PREVIOUS menu scroll position — fixed by guarding `root.scrollTop=0` with `if(!embedded)` (was resetting the menu behind the modal to top).
  - Drag-to-dismiss now bound ONLY to the top grab bar (`data-testid=sheet-drag-handle`, full-width so grabbing the tab or anywhere along the top works); content scrolls freely (removed the scrollTop-gated whole-panel drag).
  - Add-to-cart pinned reliably: `.bb-floating-checkout--inline` sticky bottom:8px + `translateZ(0)`; `.bb-floating-checkout` (fixed) got `translateZ(0)/will-change` to fix iOS momentum-scroll "stuck" repaint.
- **Collapsible tab titles** → Title Case (removed `textTransform:uppercase` in CollapsibleSection, both files).
- **Order Notes** → static/always-open block (removed collapse toggle), same design/placement.
- **FAQ spacing** reduced (ProductFaqSection marginTop 28→8, marginBottom 8→0; product-page FAQ wrapper padding trimmed).
- NOTE (needs user confirm): mobile "menu options overlaying the image" was implemented as the full-bleed hero image with the collection TITLE/DESCRIPTION overlay + gradient (matching the reference screenshot) — the category TABS were NOT moved on top of the image.


- **Env restore** — Recreated missing `/app/backend/.env` (MONGO_URL, DB_NAME=test_database, JWT, + placeholder Stripe/Brevo/Cloudflare keys) and `/app/frontend/.env` (REACT_APP_BACKEND_URL → current preview endpoint). Backend now boots, reseeds 24 products / 17 treats. Stripe left inert (migrating to Shopify Headless).
- **Hero desktop padding** — `App.css` `@media (min-width:1024px){ .hero-section--foeguard .hero-text{ left:72px!important; width:60% } }` + `min-width:1600px → left:120px; width:55%`. Overrides inline `left:24px` used on mobile/tablet (those unchanged). VERIFIED by testing agent (desktop 120px, mobile 24px).
- **"Shop Now" funnel X-close** — LandingPage `goShopNow` passes `navigate('/menu',{state:{from:'home'}})`; BoxBuilder `MenuFunnel onClose` returns to `/` when `location.state?.from==='home'` (else stays on menu). `onShopRaw` clears the from-home state so re-opening funnel via Edit + close keeps user on menu. VERIFIED by testing agent (both flows pass, no regressions).
- **PENDING / next up** — Shopify Headless (Storefront API) integration: awaiting user's store domain + Storefront API access token + chosen scope (keep custom UI + Shopify checkout recommended).

### 2026-02-23 — Menu mobile redesign + cart copy refresh
- **Mobile menu**: switched to 1-product-per-row vertical grid (app-style list); content (Title → Price → Description → See More) on the left, image on the right
- **Product cards**: '+' add button now CENTERED over the image's white background; qty pill also centered when item is selected
- **Pricing display**: every card shows the 6lb pack price with per-lb in parens, e.g. `$32.94 ($5.49/lb)` — strike-through 6lb original price still shown when bulk discount applies
- **Font hierarchy**: price / `/lb` / description / "See more" unified at 13px mobile / 14px desktop, all brown `#3B2A1A`–`#6A4F35`
- **SEO H1**: added category-aware heading below the tabs
  - Raw Dog Food → "Complete Raw Dog Food Nutrition for All-Life Stages"
  - Raw Dog Treats → "Enriching Raw Dog Treats"
  - Raw Cat Food → "Complete Raw Cat Food Nutrition for All-Life Stages"
  - Raw Cat Treats → "Enriching Raw Cat Treats"
- **Floating cart button**: removed the "Add X lb more for Y% off" incentive nudge container; button now reads `$Total · Add Xlb to Cart` (lowercase "to Cart", brown bg unchanged)
- **Cart drawer**: "Your Basket" → **Your Cart** (brown `#3B2A1A`, not red); "No items in basket" → "No items in cart"; product names bold, prices semi-bold; total / promo / cart-line dividers switched to brown
- **Schema markup + anchor wrapping**: SKIPPED — user is moving to Shopify Headless and will handle SEO/structured data there

### Marketing pages
- **/** Landing — hero (solid khaki `#D8CFB8`), Shop Farm Fresh (cream + khaki pills), Why FoeGuard Raw (clean rows w/ khaki dividers + small image), Family Tradition story, Customers Notice Benefits (locked 3×2 on desktop), reviews, footer
- **/about** — About Us hero / Our Story / 3-image farm grid / See the FoeGuard Difference / Nature Nurtured by Science / **Our Ingredients** (8 protein cards) / smaller signup CTA
- **/new-to-raw** — Hero + image-left intro + 12-tile benefits + comparison chart + image-left "Find What Really Works" + CTA
- **/faq** — Categorized accordion + khaki "Still have questions?" CTA + `info@foeguard.com`

### Shop / Menu (Feb 2026 redesign — Papa John's-style)
- **/menu** (also `/menu/*`) now uses **BoxBuilder** with:
  - **Top nav tabs**: Menu | Meal Plan | Calculator (red underline on active)
  - **Category tabs** (pill style, brand red): Raw Dog Food | Raw Dog Treats | Raw Cat Food | Raw Cat Treats
  - **Box sizes (NEW)**: 6lb (no discount) / 18lb (5%) / 24lb (10%) / 36lb (15%)
  - **Subscription** (Every 2 Weeks / Monthly) — extra 5% **stacked** on top of box discount
  - **Treats-only view** when on Dog Treats / Cat Treats tab (no box builder)
- **/product/:id** restructured:
  - Desktop **side-by-side**: image left, description/qty/CTA right
  - **3 brand icons** under title: For Dogs of All Stages, Made Fresh-to-Order, Human Grade & Organic
  - Collapsible sections (Ingredients & Nutrition / Feeding Guide / Product Info)
  - **Farm to Bowl** 3-card row: Quality, Service, Delivery
  - **Personalize Your Recipe** section with image + custom recipe CTA
  - **Product FAQ** accordion (Transition to Raw first, + 4 more)

### UX fixes
- **Cart drawer header overlap fixed** — both `SlideCart` (from CartContext) and `.cart-drawer` (CartAndCheckout) now positioned at `top: 120px` so the navbar stays visible above the cart panel

### Global polish
- Headers unified at `clamp(30px, 3.6vw, 40px)`; hero h1s at `clamp(40px, 5vw, 56px)`
- Khaki standardized to `#D8CFB8` site-wide
- Body font swapped to **Rubik Regular** (Public Sans removed in CSS), headings keep Barlow Bold
- Global `h1 { text-transform: uppercase }` rule removed — all titles render Title Case

### Feb 2026 — Iteration 12: Fraunces + Logo swap + Header re-red
- **Font swap** — Fraunces 600 replaces Playfair Display for h1/h2/h3 globally (loaded from Google Fonts); Barlow 400/600 remains everywhere else
- **New FoeGuard logo** — `7j9zxw13_FoeGuard%20Official%20Logo_2026.png` replaces old `fglogo.png`
- **Navbar back to Barn Red `#C8102E`** — Forest Green moved exclusively to the menu drawer + footer
- **Menu drawer** — Forest Green `#2F4538` background; all links Cream uppercase Barlow with 0.08em letter-spacing + 1px Cream/18% dividers
- **Unified counter colors** — All menu items (meals + treats) start Cream `#F5F3EF` with 1px Khaki border → switch to Khaki `#D8CFB8` bg when added (`data-active='true'`). NO collection-color in the menu counter.
- **SEE MORE relocated** — Now in the content column's meta row, under the price; out of the right-column with the counter
- **Treats grouped by subcategory** — `Meaty Treats` (non-head/feet) and `Heads and Feet` (head/feet/foot regex). Subcategory descriptions render only when `showCategoryDescriptions=true` (used on main /menu, hidden on dedicated /menu/dog-treats + /menu/cat-treats tabs)
- **Treats cards re-skinned** — Now use the same `product-card-row` class as meals (image left, Fraunces title, price + SEE MORE meta row, counter right)
- **Progress icons** — `Tractor` → `Wheat` (left), `CircleDot` → `PawPrint` (right)
- **Collection pill colors** — Comfort `#A4C0A0` (lighter sage), Primal `#C8102E`, Royal `#5E4B73` (back to purple)
- **Forest Green benefits section** — `Here's what you can expect…` paragraph + benefit-card titles/descs now Cream/Straw on the dark green bg (was unreadable dark-on-dark)

- **Palette swap** — Cream `#F5F3EF` body, Aged Wood `#3B2A1A` text, Forest Green `#2F4538` nav + footer, Barn Red `#C8102E` CTAs, Khaki `#D8CFB8` borders, Straw `#E8DFC8` section accents, Harvest Gold `#C9A84C` (badges only)
- **Typography** — Playfair Display 600 for h1/h2/h3 globally (loaded from Google Fonts); Barlow for body / buttons / labels; Rubik retired
- **Navbar** — Forest Green background, Cream menu/account/cart icons, Aged Wood announcement bar, Barn Red cart badge
- **Footer** — Now Forest Green (was deep red) via `COLORS.redDark = #2F4538`
- **Collection pill colors aligned** — Comfort Dinner = Sage `#7A9A7A`, Primal Feast = Barn Red `#C8102E`, Royal Paws = Harvest Gold `#C9A84C`
- **Product page hero pill** — Reduced from 100px pill → 6px squarish badge; smaller padding (6×14)
- **Desktop product hero** — Wrapper widened 800→1280px; image col 1.1fr min-height 560px so content reads up on the right (Shopify-style)
- **Removed subscribe pill** beside Checkout — only the lower Subscribe & Save section remains
- **Subscribe & Save** — ON/OFF button → checkbox (Barn Red accent), label uppercase, same dropdown + perks preserved
- **Progress icons** — `Wheat` → `Tractor`, `Soup` → `CircleDot` (top-down bowl)
- **ALL CAPS** — Top nav tabs, category tabs, collection headers
- **Unified meal/treat card** — Both render image left, name (Playfair) + desc + price (Barn Red) middle, qty counter `− 0 +` (Straw bg → collection-color bg when qty>0) + uppercase `SEE MORE` (no underline) right
- **Click-anywhere-to-open** — Entire product card row is clickable; qty buttons stop propagation
- **Secondary sections** — Farm-to-Bowl, Personalize, FAQ all migrated to Playfair headings + Cream/Straw cards (no pure white surfaces, no large shadows)
- **Floating checkout** — 8px radius, no shadow, uppercase Barlow

- **Repetitive treat header fixed** — TreatsSection now accepts `hideHeader` prop; on the Dog/Cat Treats tab the outer page provides the title so the inner header is hidden
- **Mobile menu layout** — `.product-grid` is now single-column below 900px (image left, content middle, plus on bottom-right of image)
- **Desktop product card** — Plus / qty controls moved to a dedicated right-column (`.product-card-controls`) so they no longer overlap the image; image+content row is thinner on desktop
- **Color palette** — Menu background unified at `#F5F3EF` (.box-builder & product page), overlay tint switched to `#F0ECE6` (Personalize, hover, etc.)
- **Checkout button** — Smaller, squarish (border-radius 8/10px), uppercase, no `lbs/box` counter — just "Checkout →"; mirrored on ProductDetail floating button
- **Save % pills** — Replaced bottom "Save 5%" pill with a small `% OFF` rectangular card lifted above the weight on each box-size tile (centered, sleek)
- **Box-size selector** — Removed the cream container + "Select Box Size" h3; tiles maximise across margins; inactive tiles are unbold, active tile is red-filled + bolded
- **Subscribe & Save** — No container; thin top-line divider; squarish ON/OFF button (not pill); detail panel sits flush below
- **Header consolidation** — Title + Subscribe pill + Checkout button combined into one seamless top row (`.bb-header-row`)
- **Sleek progress counter** — Replaced bulky pill with a thin line: `<Wheat>` icon · 3px track · `0lb/6lb` · `<Soup>` icon
- **Product page** — Specs (Ingredients / Nutrition / Feeding / Product Info) moved INSIDE the white hero container under Key Highlights, keeping the line-divider design. FAQ wrapped in its own clean white container with `0 4px 16px rgba(43,43,43,.06)` shadow
- **Scroll-to-top** — MealPlanPage top padding reduced 60px → 24px; step-change scrollIntoView replaced with `root.scrollTop = 0`; App `ScrollToTop` now also preserves scroll for `/menu` (not just `/build-box`) when `menuScrollPosition` is set
- **Build fix** — Visual-edits babel plugin: defensive null-guard on `importPath.parentPath.parentPath.traverse`
- **Env restore** — Recreated `/app/backend/.env` and `/app/frontend/.env` (Stripe / Brevo / Cloudflare keys are placeholders — real credentials need user input before production)


## Architecture Notes
- `/menu` → renders `BoxBuilder` (was MenuPage). Old `MenuPage`/`ProductLinePage`/`TreatsPage` retained in source but no longer routed except MenuPage import.
- BoxBuilder has `petType` (dog/cat) × `viewMode` (food/treats) — drives 4-tab layout
- ProductDetail uses CSS grid `repeat(auto-fit, minmax(340px, 1fr))` for responsive side-by-side
- Cart drawer pushed below 120px navbar (announcement bar 36px + main nav ~80px = ~116px)

## Backlog
- **P0** — Real images for the two `/new-to-raw` placeholders + Personalize section
- **P1** — Treats sub-categorization (Meaty Bones / Head and Feet) currently single TreatsSection grouping
- **P1** — Shopify integration (replaces Stripe / current checkout)
- **P2** — Unify the 2 cart systems (SlideCart via CartContext vs CartDrawer via BoxBuilder local state)
- **P2** — Real .env keys (Cloudflare R2, Brevo, JWT)
- **P2** — Wire `/about` email signup to Brevo


### Feb 2026 — Iteration 17: Menu funnel + Inline product modal + Calculator overlay + Typography refresh
- **Global fonts swapped** — Headers/subheaders/accents → **Barlow SemiBold** (600) via `--font-heading`; body text → **Lucida Grande** via `--font-body`. Fraunces removed as default heading family (still allowed inline where explicitly set).
- **Announcement bar** — switched from Aged Wood `#3B2A1A` to Khaki `#D8CFB8` (charcoal text)
- **Landing hero redesign** — Replaced the tri-image hero with a **single large banner image** (text still on the left). Bottom of hero now fades khaki → charcoal seamlessly into the Trust Marquee, which is now full **dark brown** (charcoal `#3B2A1A`) instead of forest green
- **Shop Farm Fresh cards** — Removed solid khaki backgrounds; cards now use cream bg + 1px khaki border (lighter, cleaner look)
- **Menu Funnel (NEW)** — `/menu` opens with a large 3-option funnel (Raw Food Menu / Build a Meal Plan / Feeding Calculator) shown as full-width image cards with text overlays (vertical stack on mobile). Dismissed automatically once user picks an option per session via `sessionStorage.foeguard_menu_funnel_seen`. Replaces the old small "image-bg tabs" strip
- **Collection headers — banner overlay** — Comfort Dinner / Primal Feast / Royal Paws / Raw Treats / Meaty Treats / Heads and Feet now all render with the banner image as the background and title + description **overlaid** with a left-to-right fade gradient
- **Treats refactored** — TreatsSection cards now mirror the meal `ProductCard` exactly (content left, image right, qty pill bottom-right of image). Treat headers (main + sub-categories) use the same banner-overlay design as meal collections
- **Box-size selector** — Removed the harvest-gold "Save N%" pill. New layout: 4 equal-ish tiles (6lb narrower at 0.7fr; 18/24/36 wider at 1fr each) using a horizontal grid on mobile (no longer 2x2 vertical). Each tile shows the centered size (Barlow SemiBold) and a smaller "from $X.XX/lb" line below (chicken cheapest per-lb at that box size)
- **Per-1lb pricing** — Product cards display `$X.XX / 1lb` (computed as basePrice/6) instead of the per-6lb base price
- **Inline Product Modal** — Clicking a product card on /menu now opens an overlay modal that renders the **full ProductDetailPage** content (image left stationary, scrollable content right, FAQs, Farm-to-Bowl, Personalize, all original tabs/collapsibles). ProductDetailPage gained an `embedded` prop + `onClose` callback so the same component drives both `/product/:id` and the modal
- **Inline Calculator** — Clicking the Feeding Calculator option (from funnel or menu) now opens an overlay modal with the rewritten `FeedingCalculator`:
  - "Pet 1" → "Pet" (only "Pet N" when multiple pets exist)
  - "Life Stage" → "Pet type"
  - Vertical/straight stacked input cards
  - Single **Save** button (no more "Continue to Box Builder")
  - localStorage when authenticated (persistent across sessions) / sessionStorage when logged out (per-session)
  - Multi-pet support (array)
- **/menu desktop width** — bumped from 980px → **1100px** for better breathing room while still narrower than 1200
- **Gold discount badge text** — `#3B2A1A` → `#D8CFB8` (khaki) for readability on the harvest gold background — though now hidden by the new box-size layout
- **Removed "Full Menu" tab** (was added briefly then removed per user feedback) — category tabs revert to Raw Dog Food | Raw Dog Treats | Raw Cat Food | Raw Cat Treats

## Changelog
- **2026-02-16 (Eve) — Iteration 3 UI polish (image-card top nav, image-right cards, standardized back)**
  - **Removed hero image** from /menu entirely
  - **Top nav** redesigned as 3 LARGE image-background cards (Raw Food Menu / Build Your Meal Plan / Feeding Calculator) — shaded gradient overlay for legibility, gold 2px inset border on active, LEFT-aligned, min-height 120px desktop / 92px mobile
  - **Category tabs** + **box-size selector** → all LEFT-aligned (no center)
  - **Box-size buttons** → bordered (white bg, 1px #D8CFB8, radius 6px); active = shaded #EFE6CC + brown border (no underline); harvest-gold SAVE X% inline tab preserved
  - **Menu top spacing** — `.box-builder` padding 28-40px top; collection header padding-bottom 18px for breathing room before product grid
  - **Product cards** — image now on RIGHT (desktop, 130x130 column), content LEFT; mobile keeps image on TOP. + button (38×38 white circle with brown border, hover-invert) moved INSIDE `.product-card-media` with consistent 10px padding from bottom-right corner
  - **'See more'** → inline RIGHT of price (flex space-between) on both viewports — slimmer vertical card
  - **Standardized Back button** (`.pd-uber-back`) — fixed top:130/140px left:22/32px white pill — replaces X close on Product/Treat/Meal-Plan/Calculator pages. All four data-testids preserved
  - **Meal-Plan + Calculator** pages get more top padding (60px) so content isn't cramped near navbar
  - **Product detail**:
    - Feature pills reverted to `Dogs of all-life stages`, `Fresh-to-order`, `Human grade`
    - 'Box Selected: 6lb CHANGE ON MENU' — brackets removed
    - 'Add to box' qty controls AND 'Adds' total now on SAME ROW, both 16px/36px height for visual parity
    - 'Notes' → **'Order Notes'** collapsible (renamed)
    - Trust icon row (Recycle / Heart / MapPin) — removed top + bottom border lines
  - **Floating checkout** → small rounded PILL (border-radius 999px, padding 10-12px, font 13-14px) matching qty pill aesthetic
  - **Fonts** — reverted from 'Lora' back to 'Barlow' (sans) / 'Fraunces' (serif headings)
  - **Testing**: iteration_16 → **18/18 PASS** (one MINOR numeric note on floating pill being 1-2px larger than spec on desktop — purely cosmetic, pill shape verified)

- **2026-02-16 (PM) — Iteration 2 UI polish (square containers, harvest gold discount tab, slim cards)**
  - **Home page** — All major container borderRadius reduced from 16/20px → **8px** (hero tri-image, Shop Collections cards, Why FoeGuard image, review-card, review-photo-card)
  - **Menu page top nav** — Removed mustard background entirely; tabs now use clean cream-khaki active shade (#EFE6CC) + bottom underline. Slimmer mobile padding, max-width matches menu content
  - **Box-size selector** — Removed all container backgrounds; clean text-only buttons ('6 lb', '18 lb', etc.). Active = bold + dark underline (transparent bg). Discount rendered as small harvest-gold (#C9A84C) **inline 'SAVE X%' tab** beside the size (10px uppercase)
  - **% off → Save X%** — Global text replacement across cart discount badge, OrderSummary, product detail, account subscription manager
  - **Menu cards reverted** — Mobile = **2-per-row VERTICAL** (image top, content below, + button OVERLAYS bottom-right of image via `top:-38px`); Desktop = **2-per-row HORIZONTAL** (image LEFT ~110px square, content RIGHT, + at bottom-right of content)
  - **Product detail page** — Restructured right column to: Title → Price → Description → smaller harvest-gold UPPERCASE feature pills → Add to box (qty selector) → 'Box Selected: 6lb [SAVE X%] CHANGE ON MENU' (NO brackets around lb) → highlights as ✓ checks with mustard checks → collapsibles (Ingredients, Nutrition, Feeding, Product info, **Notes at BOTTOM**) → 3-icon trust row (100% Recyclable, Humanely Raised, Made in Canada) → `ProductFaqSection` at the very bottom in one large container. **Removed** Details/Notes tabs entirely. Image left now uses `position: sticky; top: 140px` for desktop scroll
  - **Treat detail page** — Same Shopify restructure (smaller harvest-gold pills, benefit checks when data present, collapsibles with Notes at bottom, trust icon row). No FAQ section on treats by design
  - **Testing**: iteration_15 → 14/15 PASS. One MINOR ('benefit checks' on /treat/<id> only renders when `treat.benefits` data exists — intentional). `retest_needed: false`

- **2026-02-16 — Menu + Product/Treat UI overhaul (mustard brand restore)**
  - **Top nav (lifted mustard #C9A84C container)** — tabs renamed `Raw Food Menu | Build Your Meal Plan | Feeding Calculator`; light-khaki text on inactive, cream + underline on active (`.menu-top-nav-mustard`)
  - **Category tabs** — removed pill bg; selected = larger (16px) + bold + 2px gold underline (`#C9A84C`); inactive plain text in `.menu-category-text-btn`
  - **Box-size selector** — added `Select Box Size:` label; new `.box-size-slider--mustard` with mustard-gold pill (#F0E1B5 inactive, #C9A84C active), border-radius 6px (slightly square), uniform min-width 110px desktop
  - **Section headers** — Title Case across: `Comfort Dinner`, `Primal Feast`, `Royal Paws Dinner`, `Raw Dog Treats`, `Raw Cat Treats`, `Meaty Treats`, `Heads and Feet`
  - **Top checkout button REMOVED** — replaced with single `.bb-floating-checkout` (fixed bottom-center, 8px radius, large 16-17px CHECKOUT → uppercase)
  - **Menu product cards reverted to UberEats horizontal** — `.product-card-row` is now `grid-template-columns: 108px 1fr` (140px desktop). Mobile 1-col grid, desktop 2-col grid
  - **Product detail page restructured to Shopify-style** — `.pd-shopify` 2-col grid (image left sticky, content right). Order: Title → Price → Description → 3 gold-mustard square feature pills (`#F0E1B5` bg, 4px radius) → `Box Selected: (X)lb CHANGE ON MENU` text-only (no cream container) → Quantity selector + Adds total. Tabs (Details | Notes) + collapsibles below
  - **Treat detail mirrors Shopify layout** — image left + content right + Title → Price → Description → square gold pills → qty + Back to menu link
  - **'Change on menu' / X close / Add now navigate to `/menu`** instead of `/build-box`
  - **Treats-only checkout enabled** — `canCheckout = isBoxComplete || (!hasProteins && hasTreats)` in CartAndCheckout.js. Users can now check out treats without filling a protein box
  - **Env restore** — Recreated `/app/backend/.env` (Stripe/Brevo/Cloudflare placeholders) and `/app/frontend/.env` (REACT_APP_BACKEND_URL)
  - **Testing**: iteration_14 — 15/16 PASS on first run; both flagged issues (treats-only checkout, MEATY TREATS uppercase) fixed and verified

- **2026-02-15 — Uber Eats UI/UX overhaul (revised after user feedback)**
  - Mobile-first 2-column product grid; product cards transparent (NOT khaki) with bottom border
  - "+" add button anchored to **bottom-right of card content** (NOT on image); transforms to brown qty pill when item is added
  - Box-size slider: khaki chips, **only selected** size is the brown pill; "Choose your box" label added above
  - Category nav switched to text buttons; **only the active item** becomes a brown pill
  - Removed the floating bottom "View basket" pill — header `Checkout` button retained (sharp, no shadow blur)
  - Header cart badge bound to `sessionStorage` (proteins + treats) with Harvest-Gold styling
  - Announcement bar now Aged Wood (`#3B2A1A`) with sentence-case copy
  - Sentence case across the page; menu section headers (`COMFORT DINNER`) remain ALL CAPS
  - Product detail (Uber-Eats): full-width hero, small 34px X close top-right, swipable badges, "Your box size" banner + "Change on menu" link (no size circles), live discount-aware price preview, Details/Notes tabs, floating "Add Xlb to your box · $Y" pill that returns to `/menu` after add
  - Treat detail mirrors the same pattern
  - Cart drawer: `+ Add items` button + primary CTA renamed `Go to checkout`; bottom "Save extra $X — subscribe & save 5%" section
  - Checkout: per-item subscription pre-select (rendered when subscription is enabled)
  - MealPlan + FeedingCalculator: small 34px X close top-right replaces the giant "Back" buttons
  - Restored `/app/backend/.env` and `/app/frontend/.env` (services were down at session start)


### Jun 2026 — Iteration 13: Continuation typography + menu/calculator polish
- **Fonts** — All remaining hardcoded `'Barlow'` / `'Rubik'` literals (CSS + inline JS) swapped to **Barlow Semi Condensed**; paragraph/body text remains **Lucida Grande** (global `p,li,...` rule). Two-font system now fully consistent.
- **Treats** — Dedicated "Raw Dog Treats" / "Raw Cat Treats" tab now shows the SINGLE title banner (was missing); subcategories (Meaty Treats / Heads and Feet) remain plain text, no images.
- **Calculator close** — `FeedingCalculator` (non-embedded /calculator page) now uses the same top-right circular **X (`page-close-x`)** as the Meal Plan page → navigates to `/menu` (replaced the old top-left "← Back"). Consistent close affordance across pages + modals.
- **Calculator mobile** — Tightened `@media (max-width:759px)` compact spacing (card gap 8px, input padding 9px, smaller heading/label margins) for a denser mobile form.
- **Menu category tabs** — Reduced VERTICAL spacing (box-builder top padding 28→10px mobile / 40→18px desktop; `.menu-category-text` padding/margin trimmed; button vertical padding reduced). Horizontal spacing left as-is.
- **Calc selection** — Verified: choosing "Feeding Calculator" from the funnel keeps the persistent Selection = "Raw Food Menu" (calc opens as modal over /menu).
- Recreated lost `backend/.env` + `frontend/.env` (mocked third-party keys per existing setup) after container restart; backend reseeds 24 products / 17 treats on startup.

### Jun 2026 — Iteration 14: Product/treat container redesign + unified bottom CTAs
- **Detail header** — Product & treat detail (modal + page) now use a single-column layout with the image INLINE beside the title/price at the TOP (`.pd-head` / `.pd-head-media` / `.pd-head-info`), replacing the old image-in-its-own-column block.
- **"Size" label** — Meal product quantity selector label changed from "Add to box" → "Size".
- **Sticky full-width Add button** — `.pd-uber-add` is now a large bottom bar: edge-to-edge fixed on the dedicated page; in the modal (`--inline`) it's `position: sticky` and spans the FULL modal panel width (calc(100% + padding) with negative margins), staying pinned at the bottom while scrolling.
- **Menu checkout button** — `.bb-floating-checkout` redesigned to match: full-width edge-to-edge bar on mobile, menu-width (max 1232px) centered bar on desktop.
- **Treats == meals** — Treats now open in a MODAL (`TreatDetailModal`) identical to the meal product modal (was a separate `/treat/:id` page). `TreatDetailPage` gained `embedded`/`onClose` props; its collapsibles (Ingredients / Feeding Guide / Product Info / Order Notes) now use the SAME borderless chevron design as meals. `TreatsSection` accepts `onOpenTreat`; BoxBuilder renders `TreatDetailModal` via `activeTreatId`.
- Design is now unified across ALL menu items (meals + treats).

### Jun 2026 — Iteration 18: Removed box builder → seamless single-basket menu
- **No more "boxes"** — `/menu` accumulates meals in one `selectedProteins` basket; floating button opens the cart (lb counter + incentive nudge above it). Cart shows individual meal lines (stepper + remove) + treats.
- **Discount tiers (dog)** changed to 12-23=5% / 24-35=10% / 36+=15% (derived live from total meal lbs). Cat unchanged (12=5%). Box-size selector replaced by a small **Stock Up & Save** collapsible guide.
- **Product detail** — top per-lb price removed; **Size + Price** moved under the title (inits from menu qty, saves edits on back). Collapsibles moved **full-width** below the sticky image, reordered: Ingredients / Nutritional Analysis / Product Information / Feeding Guide / Notes. Titles semibold, prices lighter. "Add Xlb to Basket" (no "box").
- **Treats** — bullet (•/-) description lines parsed into the checkmark feature list.
- **Feeding Calculator / Meal Plan** — removed khaki/white nested containers → transparent bg + thin brown (#3B2A1A) borders (seamless); calculator single "Pet" title removed; meal-plan container-within-container flattened.
