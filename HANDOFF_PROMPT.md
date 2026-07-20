# FoeGuard — Site handoff for a fresh Emergent chat

Paste the block below as your first message when you open a new Emergent chat
that pulls this repo. It tells the agent everything it needs to boot the site,
reconnect to Shopify, and continue development without re-exploring from scratch.

---

## Paste into new Emergent chat

> **Context handoff — do not start coding until this checklist is complete.**
>
> This is the FoeGuard raw-dog-food storefront. Stack: React (CRA) + FastAPI +
> MongoDB + Shopify Headless. Read the paragraphs below in order, then run the
> boot checklist.
>
> ### Architecture
> - Frontend at `/app/frontend`, port 3000, served by supervisor.
> - Backend at `/app/backend`, FastAPI on `0.0.0.0:8001` under supervisor. All
>   API routes are prefixed with `/api` for Kubernetes ingress. Do not change
>   the port or prefix.
> - Mongo runs locally on the container. Connection via `MONGO_URL` from
>   `/app/backend/.env` (do not hardcode).
> - Shopify integration lives in **backend** `/app/backend/shopify_service/`
>   and **frontend** `/app/frontend/src/services/shopify/`.
> - Architecture rule: `React → FastAPI → Shopify`. The React app never calls
>   Shopify directly. Frontend hits `${REACT_APP_BACKEND_URL}/api/shopify/*`,
>   FastAPI holds both Shopify tokens and forwards to Storefront + Admin
>   GraphQL APIs. Never expose `SHOPIFY_ADMIN_TOKEN` to the browser.
> - Customer auth uses **Shopify's official Customer Authentication** flow
>   (`customerAccessTokenCreate` etc). Do not build a custom auth system.
>
> ### Env files (they are gitignored — you must recreate them on this host)
> Copy the two `.env.example` files and fill in real values:
>
> `/app/backend/.env`  ← copy from `/app/backend/.env.example`. Must contain:
> ```
> MONGO_URL="mongodb://localhost:27017"
> DB_NAME="foeguard"
> CORS_ORIGINS="*"
> JWT_SECRET="<any long random string>"
> SHOPIFY_STORE_DOMAIN="foeguard.myshopify.com"
> SHOPIFY_STOREFRONT_TOKEN="<Storefront API access token>"
> SHOPIFY_ADMIN_TOKEN="<Admin API access token, starts with shpat_>"
> SHOPIFY_API_VERSION="2025-07"
> CLOUDFLARE_ACCOUNT_ID="dummy1234567890abcdef1234567890ab"  # placeholder ok
> STRIPE_SECRET_KEY="sk_test_placeholder"                    # placeholder ok
> STRIPE_PUBLIC_KEY="pk_test_placeholder"                    # placeholder ok
> STRIPE_WEBHOOK_SECRET="whsec_placeholder"                  # placeholder ok
> BREVO_API_KEY="brevo_placeholder"                          # placeholder ok
> CLOUDFLARE_R2_ACCESS_KEY="r2_key_placeholder"              # placeholder ok
> CLOUDFLARE_R2_SECRET_KEY="r2_secret_placeholder"           # placeholder ok
> CLOUDFLARE_R2_BUCKET_NAME="foeguard-assets"                # placeholder ok
> CLOUDFLARE_R2_PUBLIC_URL="https://pub-placeholder.r2.dev"  # placeholder ok
> GOOGLE_PLACES_API_KEY=""
> ```
>
> `/app/frontend/.env` ← copy from `/app/frontend/.env.example`. Must contain:
> ```
> REACT_APP_BACKEND_URL=<the preview URL that Emergent shows for this env>
> WDS_SOCKET_PORT=443
> ```
> Do NOT put Shopify tokens in the frontend `.env`. Ever.
>
> ### Where to get the Shopify tokens
> Shopify admin → **Settings → Apps and sales channels → Develop apps** →
> open the FoeGuard headless app → **API credentials** tab:
> - `SHOPIFY_STOREFRONT_TOKEN` = "Storefront API access token" (hex string).
> - `SHOPIFY_ADMIN_TOKEN` = "Admin API access token" (starts with `shpat_`).
> - `SHOPIFY_API_VERSION` = latest stable (currently `2025-07`).
> - `SHOPIFY_STORE_DOMAIN` = the `*.myshopify.com` domain (not the custom one).
>
> ### Boot checklist (run in order)
> 1. Confirm both `.env` files exist and have the four Shopify values filled in.
> 2. Restart services: `sudo supervisorctl restart backend frontend`.
> 3. Wait 5 s, then `curl -s http://localhost:8001/api/shopify/health`. It MUST
>    return `"storefront": {"ok": true}` AND `"admin": {"ok": true}`. If either
>    is false, do not proceed — debug the token / scope first.
> 4. Spot-check products: `curl -s "http://localhost:8001/api/shopify/products?first=3"`
>    should return real product handles from the Shopify store.
> 5. Open the preview URL in the browser and confirm the /menu page renders.
>
> ### Files you'll touch most often
> - Shopify service surface: `/app/backend/shopify_service/router.py`
> - Shopify GraphQL fragments: `/app/backend/shopify_service/queries.py`
> - Frontend Shopify client: `/app/frontend/src/services/shopify/*.js`
>   (single import: `import { products, collections, cart, customers, checkout } from 'services/shopify'`)
> - Menu page: `/app/frontend/src/pages/BoxBuilder.js`
> - Product page: `/app/frontend/src/pages/ProductDetail.js`
> - Treat page: `/app/frontend/src/pages/TreatDetail.js`
> - Cart / checkout UI: `/app/frontend/src/components/CartAndCheckout.js`
> - Global styles: `/app/frontend/src/App.css`
>
> ### Rules the previous agent worked under (please keep)
> 1. React never calls Shopify directly — always through FastAPI at `/api/shopify/*`.
> 2. Admin API is server-only. Never import `SHOPIFY_ADMIN_TOKEN` into any file
>    under `/app/frontend`.
> 3. Do not modify the two `.env` files' variable names or the supervisor ports.
> 4. Use `search_replace` for edits to existing files, `bulk_file_writer` for
>    creating new files.
> 5. Use Shopify's official Customer Auth (Storefront GraphQL mutations); do
>    NOT build a custom auth system.
> 6. When adding new Shopify fields to the storefront query fragments, remember
>    that some fields require extra scopes on the Shopify Custom App:
>      - `totalInventory` / `quantityAvailable` need `unauthenticated_read_product_inventory`.
>      - Customer address writes need `unauthenticated_write_customers`.
>    Currently only the default read scopes are enabled.
> 7. Colour token used site-wide for body text: `#2C2C2C` (charcoal).
>
> ### What is already done
> - Menu / product-page layout polish and Shopify-style thin accordions.
> - Selection breadcrumb slimmed on mobile (11px, centered, edge-to-edge).
> - Menu interaction rules: cards with variants show only `+` (open product
>   page); cards flagged `no_variants: true` get an inline `[-] qty [+]` stepper.
> - Full Shopify integration layer wired end-to-end (backend + frontend service
>   modules). See `/api/shopify/health` for a live token status check.
>
> ### What is NOT done yet
> - The menu/product/treat pages still read from the local MongoDB seed data,
>   not from Shopify. The switch-over is the next task — wait for the human's
>   next prompt before making it.
>
> Confirm you have completed the boot checklist and can hit `/api/shopify/health`
> with both `ok: true` before starting any development work.

---

That's it — paste everything from *Context handoff* down to *before starting
any development work* into the new chat.
