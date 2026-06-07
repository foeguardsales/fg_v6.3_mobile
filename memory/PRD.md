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
- ✅ Desktop hero **tri-image** finalized: unified container, 3 px charcoal border, 8 px lifted shadow, NO internal gap, all images square (left = right-stack height)
- ✅ Replaced broken external **FoeGuard logo** URL (403) with an inline SVG wordmark + shield/paw icon (no external dependency)
- ✅ New **`/faq` page** — 4 categories (Getting Started, Ordering & Subscriptions, Delivery & Storage, Health & Nutrition), 15 accordion items, "Talk to the team" CTA
- ✅ New **`/delivery` page** — hero, 4 numbered process steps, Facts grid, Ontario delivery-zone cards, storage tips section, dual CTAs
- ✅ Extracted **Cart context** to `/app/frontend/src/contexts/CartContext.js`
- ✅ Aliased legacy `Navbar`/`Footer` → `ModernNavbar`/`ModernFooter` so every page (15+ routes) now uses the consistent modern UI
- ✅ Full regression tested via testing_agent_v3_fork — 100% pass (iteration_5 + iteration_6)

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
