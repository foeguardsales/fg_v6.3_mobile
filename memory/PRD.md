# FoeGuard - Raw Pet Food Website

## Original Problem Statement
Build a website for "FoeGuard," a raw dog/cat food company. Original brief: landing page, About Us, New to Raw, Blog, Product Detail pages, Treat Detail pages, and a Box Builder.
Mid-project pivot: replace the Build-a-Box model with a **Tim-Hortons-style restaurant menu** built on 6 lb increments with bulk discount tiers (5% @ 12 lb, 10% @ 24 lb) that stack on top of a 5% subscription discount.
Latest direction: redesign the **Landing Page in the Oma's Pride aesthetic** using FoeGuard brand colors.

## Core Requirements
1. Tim-Hortons style menu (6/12/18/24 lb), restaurant-style ordering UX
2. Stackable bulk + subscription discounts
3. Slide-out cart drawer + dedicated checkout
4. Multi-step Meal Plan / Dog Profile builder
5. Oma's Pride-inspired Landing Page using FoeGuard colors
6. New Resources dropdown content: FAQ, Delivery Information, Blog

## Brand Palette
- Red `#c8102e`, Overlay Red `#9D0D23`
- Cream `#f5f3ef`, Soft Bg `#f0ece6`, Khaki `#D8CFB8`
- Charcoal `#2C2C2C`, Forest Green `#2F4538`, Light Green `#00934f`

## Tech Stack
- **Frontend**: React 19, React Router, inline-styled components
- **Backend**: FastAPI (Python)
- **Database**: MongoDB
- **Process Management**: Supervisor

## Key DB Schema
- **products**: `{ product_id, product_line, protein_type, name, mini_description, description, highlights, ingredients, recipe_breakdown, nutrition_facts, pricing[], inventory_status, feeding_guide, product_information }`
- **treats**: `{ treat_id, name, price, quantity_description, pet_type, description, feeding_guide, product_information }`
- **users**: `{ id, dog profile (breed/sex/neutered/lifestyle/weight/condition/allergies), subscription state }`

## Architecture Decisions
- `/app/frontend/src/contexts/CartContext.js` — single source of truth for cart state (CartProvider, useCart, SlideCart). Extracted to break a circular import.
- `/app/frontend/src/components/Layout.js` — thin re-export aliasing the new `ModernNavbar` / `ModernFooter` from `LandingPage.js` as the legacy `Navbar` / `Footer`, so every page across the app uses the consistent modern UI without touching dozens of files.
- `FoeGuardLogo` is an inline SVG wordmark (`Foe` charcoal + `Guard` red + red shield-with-paw icon) — no external image dependency.

## What's Been Implemented
### Completed (previous sessions)
- Full UI overhaul of homepage, navbar, About, New to Raw, Blog
- Carousels for reviews and proteins
- Product database with 24 products + 18 treats fully populated
- Box Builder + Meal Plan v1

### Completed (Feb 2026 fork session)
- Restaurant-style **MenuPage** with 6 lb base + 12/24 lb bulk tiers
- Stackable subscription (5%) + bulk discounts in Cart
- Brand-new **CheckoutPage** with clean lifted button design
- Redesigned **MealPlanPage** as a multi-step Dog Profile builder
- `POST /api/users/profile` endpoint + storage of dog profiles
- **Landing Page** Oma's-Pride redesign using FoeGuard colors

### Completed (Jun 2026 fork session — current)
- ✅ Desktop hero **tri-image** finalized: NO border, NO lifted shadow, all images square (left = right-stack height), no internal gap
- ✅ FoeGuard **round red logo** restored in navbar (72 px, no ring)
- ✅ New **`/faq` page** — 4 categories, 15 accordion items, "Talk to the team" CTA
- ✅ New **`/delivery` page** — hero, 4 process steps, Facts grid, Ontario zones, storage tips
- ✅ Extracted **Cart context** to `/contexts/CartContext.js`
- ✅ Aliased legacy `Navbar`/`Footer` → `ModernNavbar`/`ModernFooter` so all 15+ routes share the modern UI
- ✅ **Header**: thin red `#c8102e` bar + darker red `#9D0D23` free-shipping bar, **logo enlarged** to 72 px, **truly centered on mobile** via 3-column grid, white icons, header border removed, 8 px vertical padding for cart icon
- ✅ **Hero h1** "Ontario's #1 Farm Fresh / Raw Dog Food" — clamp 24-42 px, **2 lines on mobile**, subtitle ends with **"fresh, complete raw pet nutrition"**
- ✅ **"Why FoeGuard Raw?"** section: actual h2 header restored above the subtext paragraph + 4 new benefit cards (Farm Fresh / 100% Organic / Human Grade / Complete Nutrition) using Lucide icons (Sprout/Leaf/ChefHat/Award), image without border/shadow
- ✅ **All section h2s aligned** at `clamp(22px, 2.6vw, 28px)` — Shop Farm Fresh, Why FoeGuard Raw, From Soil to Serving, Reviews, FAQ, Benefits
- ✅ **Trust marquee** back to **dark forest green** (`#2F4538`), tighter (6 px padding), 12 s loop
- ✅ **Benefits section** also returned to **dark forest green** with bright-green `2 Weeks` accent
- ✅ **Page hero backgrounds** (`.about-hero`, `.hero-section`, `.ntf-hero`) flipped from brand red → **overlay red** `#9D0D23`
- ✅ **Almond / softBg darkened** from `#f0ece6` → `#E5D9C2` (organic farm feel); **khaki darkened** from `#D8CFB8` → `#C9BE9F`
- ✅ **Random line at /menu fixed** by removing orphan `borderBottom` from last item in each section (Primal Feast, Raw Treats, Meal Plan Creator) + TreatsPage last row
- ✅ **Rubik webfont** (300-900) loaded in `index.html`

## Prioritized Backlog
### P0
- _none currently — waiting on user_

### P1
- Receive and implement **next batch of copy edits** from user (user said "Do these then I'll send you the further copyright edits")
- Deeply link **Dog Profile → Checkout** so returning users skip data re-entry

### P2
- Replace native date / province inputs on CheckoutPage with styled shadcn components
- Extract `ModernNavbar` / `ModernFooter` out of `LandingPage.js` into their own files (`/components/ModernNavbar.js`, `/components/ModernFooter.js`) to keep page files small and Layout.js cleanly importing from `/components`
- Real product photography to replace Unsplash placeholders
