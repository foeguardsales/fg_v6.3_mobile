# FoeGuard — PRD

## Original Problem Statement
FoeGuard is a raw dog & cat food e-commerce site for Ontario, CA. The user iterates copy/layout/typography page-by-page. Shopify will eventually replace in-app checkout/Stripe (do NOT add Stripe).

## Stack
- Frontend: React (CRA) — Barlow Bold (headings) + **Rubik Regular** (body/subtext)
- Backend: FastAPI + MongoDB (currently mocked .env values)

## What's Implemented (Feb 2026)

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

### Feb 2026 — Farm Palette refresh + Meal/Treat card unification (Iteration 11)
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
- **P1** — TreatDetail.js page mirror the new ProductDetail layout (brand icons / Farm to Bowl / Personalize / FAQ)
- **P1** — Shopify integration (replaces Stripe / current checkout)
- **P2** — Unify the 2 cart systems (SlideCart via CartContext vs CartDrawer via BoxBuilder local state)
- **P2** — Real .env keys (Cloudflare R2, Brevo, JWT)
- **P2** — Wire `/about` email signup to Brevo
