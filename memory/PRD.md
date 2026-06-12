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
