# FoeGuard — Changelog

## 2026-06 — Product view: modal cards + inline Shopify-style Add to Cart + container pricing

**Files:** `frontend/src/pages/ProductDetail.js`, `frontend/src/pages/BoxBuilder.js`, `frontend/src/App.css`, `backend/server.py`

- **Meal cards open as a slide-up modal (not a full page).** `ProductCard.goToProduct()` in
  `BoxBuilder.js` now calls `onOpenProduct(product.product_id)` first (opens `ProductDetailModal`,
  same pattern as treats' `onOpenTreat`) and only falls back to `navigate('/product/:id')` when no
  modal opener is provided. Both the card body and the "+" button use this.
- **Add to Cart is now an inline Shopify-style button directly under the Quantity selector**, inside
  `.pd-shopify-content`. Class `.pd-shopify-atc` (solid red, full-width, no price text). It calls the
  real `handleAddToCart()` (which writes `selectedProteins` + fires `foeguard:box-updated`) then
  closes the modal / navigates to `/menu`. The old floating `bb-floating-checkout` bottom bar
  (`pd-cta-wrap` IIFE, which also never actually persisted to the cart) was removed.
- **Top price now reflects the container upcharge.** Price block (~L737-751): per-lb and total add
  `perLbUpcharge` (+$1.00/lb when Container selected). Tier discount is UNCHANGED — still
  `getDiscountedPrice = getBasePrice × (1 − bulkRate)` with bulkRate from total lbs
  ({12:5%, 24:10%, 36:15%}). For pouches the formula is identical to before.
- **Backend lint blockers cleared** in `server.py`: removed duplicate `from seed_data import ...`
  inside `seed_database()`; moved literal route `/profiles/me` ABOVE parameterized `/profiles/{email}`.

**Verified (testing agent iteration_22, 8/8 frontend flows PASS):**
- Menu card body + "+" open the modal, no /product URL nav.
- ATC below qty, text "Add to Cart", no $ on button.
- Dynamic tier per-lb (Pouch): 6lb $6.66 → 12lb $6.33 (5%) → 24lb $6.00 (10%) → 36lb $5.66 (15%).
- Container adds exactly +$1.00/lb on top of the tier price.
- Add to Cart persists `selectedProteins` (`cd-beef::Container - 1 lb`) and closes.

**Note:** User reported "tier pricing gone" — NOT reproducible. Tier discount works and is dynamic.
Likely causes: viewing a Monthly Bundle (fixed price, bulkRate forced 0), or the qty=0 "From" price,
or testing under 12 lb where no discount applies yet.
