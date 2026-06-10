# FoeGuard — PRD

## Original Problem Statement
FoeGuard is a raw dog food e-commerce site for Ontario, CA. The user is iterating on copy, layout, and typography page-by-page. Shopify will eventually replace the in-app checkout/Stripe flow (do NOT integrate Stripe further).

## Stack
- Frontend: React (CRA) — Barlow Bold (headings) + Public Sans Medium (subheaders/body)
- Backend: FastAPI + MongoDB (currently mocked .env values)

## What's Implemented (Feb 2026)
- Landing: hero, reviews panel (alternating photo/review), CTA, footer
- Menu / Box Builder / Cart / Checkout (legacy — to be replaced by Shopify)
- **/new-to-raw** — hero, intro paragraph block (with LEFT image placeholder), 12-tile benefits grid, comparison chart (FoeGuard vs Retail Raw vs Kibble), "Find What Really Works" section (with LEFT image placeholder), CTA
- **/faq** — categorized accordion, "Still have questions?" khaki CTA, info@foeguard.com
- **/about** — `About Us` hero ("From Our Family to Yours"), `Our Story`, farm imagery, `See the FoeGuard Difference`, `Nature Nurtured by Science`, **Our 8 Proteins** (Chicken, Beef, Turkey, Duck, Goat, Salmon, Lamb, Rabbit) with mini-descriptions, smaller-font signup CTA
- Global typography: Barlow Bold headings / Public Sans Medium subs
- Global color palette: red `#C8102E`, deep red `#6F0A1B`, khaki `#c2b6a3`
- Removed global `h1 { text-transform: uppercase }` rule — page titles now render Title Case
- Email standardized: `info@foeguard.com` everywhere

## Backlog
- **P0 — Image swap:** replace the two `Image Placeholder` blocks on `/new-to-raw` with real assets once provided
- **P1 — Shopify integration:** rip out Stripe/checkout and connect Shopify
- **P2 — Real .env keys:** Cloudflare R2, Brevo, JWT secret currently placeholders
- **P2 — Footer email signup wiring:** `/about` signup currently `setTimeout` simulation; wire to Brevo when keys land

## Architecture Notes
- All `<p>`, `<li>`, `<blockquote>`, `.subtext` forced to Public Sans via `!important` in `App.css`
- Headings use Barlow via `var(--font-heading)`
- `.ntr-split` CSS handles the responsive image-left / text-right layout on `/new-to-raw`
- `.about-proteins-grid` + `.about-protein-card` styles drive the 8-protein grid
