# FoeGuard — CONTENT_MAP

Exhaustive page-by-page map of every rendered section and its **exact
Shopify source**. This document is the single source of truth for what
data must exist in Shopify for the storefront to render correctly.

Legend for the *Source* column:

| Tag | Meaning |
|-----|---------|
| **Native** | Native Shopify object field (Product.title, Collection.image, Order.processedAt, Customer.defaultAddress, Shop.name, etc.) |
| **Metafield** — `<owner>.<namespace>.<key>` | Custom metafield on Product / Collection / Shop / Page / Customer |
| **Metaobject** — `<type>` | Reusable content block (Shopify Online Store 2.0 metaobject). See `METAOBJECTS.md` |
| **Nav** — `<handle>` | Shopify **Navigation → Menu** (`shop.menu(handle: "...")`) |
| **Blog** — `<blog handle>` | Native Shopify **Blog** + **Article** objects |
| **Static** | Legal / branding copy that is unlikely to change; stored as a Shopify **Page** metafield or **Shop.metafield** for a single source of truth |
| **Client-only** | UI state, derived, or from browser (never sourced from Shopify) |

All product / collection lookups happen against the **Storefront GraphQL
API** through the backend proxy at `/api/shopify/*`. No native field is
ever hardcoded per-page.

---

## 1. `/` — Landing (`pages/LandingPage.js`)

| # | Section | Source |
|---|---------|--------|
| 1 | Top announcement bar | **Shop.metafield** — `foeguard.announcement` (metaobject ref → `announcement_bar`) |
| 2 | Navbar (logo, menu, cart, account icon) | **Nav** — `main-menu`; logo via **Shop.brand.logo** |
| 3 | Full-bleed hero (image, headline, sub-headline, CTA) | **Metaobject** — `hero_slide` referenced from **Shop.metafield** `foeguard.home_hero` |
| 4 | Trust marquee (award logos / press) | **Metaobject** — `trust_marquee` (list of `press_logo`) referenced from **Shop.metafield** `foeguard.trust_marquee` |
| 5 | “Shop Farm Fresh” collection cards (Comfort Dinner / Royal Paws / Meaty Bones / Bundles) | **Native** — first N **Collections** whose `metafield foeguard.show_on_home = true`. Card image = `Collection.image`, title = `Collection.title`, CTA link = `/collection/{handle}` |
| 6 | Why FoeGuard? side-by-side (image + benefit copy) | **Metaobject** — `why_block` (image, heading, body, bullets, cta_url) referenced from **Shop.metafield** `foeguard.home_why` (list) |
| 7 | “Benefits in 2 weeks” 3-up grid (icon + title + copy) | **Metaobject** — `feature_card` referenced from **Shop.metafield** `foeguard.home_benefits_2week` (list) |
| 8 | Reviews horizontal feed | **Metaobject** — `review` referenced from **Shop.metafield** `foeguard.home_reviews` (list). Optionally hydrated by Shopify **Product Reviews** app if installed. |
| 9 | 8+ Protein Options grid | **Metaobject** — `protein_card` referenced from **Shop.metafield** `foeguard.proteins` (list) |
| 10 | About Us / Our Story teaser | **Page** — `pages/about` → first paragraph of `body_html` **or** dedicated **Shop.metafield** `foeguard.home_story` |
| 11 | FAQ accordion | **Metaobject** — `faq_item` referenced from **Shop.metafield** `foeguard.home_faq` (list) |
| 12 | Final CTA (“Ready to make the switch?”) | **Metaobject** — `cta_banner` referenced from **Shop.metafield** `foeguard.home_final_cta` |
| 13 | Footer (brand / shop / help / company + social) | **Nav** — `footer-shop`, `footer-help`, `footer-company`; brand column via **Shop.brand.shortDescription**; social via **Shop.metafield** `foeguard.social_links` (metaobject list) |

---

## 2. `/menu` (+ `/menu/comfort-dinner`, `/menu/primal-feast`, `/menu/treats`) — (`pages/BoxBuilder.js`)

| # | Section | Source |
|---|---------|--------|
| 1 | Selection breadcrumb (“SELECTION: Raw Food Menu / EDIT”) | Client-only (session state) |
| 2 | Immersive hero background image (per active tab) | **Metafield** — `collection.foeguard.hero_image` on each of the collections `comfort-dinner`, `primal-feast`, `meaty-bone-treats`, `royal-paws` |
| 3 | Category tab bar (Raw Dog Food / Raw Dog Treats / Raw Cat Food / Raw Cat Treats) | **Metaobject** — `menu_tab` referenced from **Shop.metafield** `foeguard.menu_tabs` (list, ordered) |
| 4 | Feeding Calculator link (on hero) | **Nav** — `main-menu` item with handle `calculator`, OR static route |
| 5 | Product grid — Comfort Dinner | **Native** — `Collection.products` for `comfort-dinner` |
| 6 | Product grid — Royal Paws (cat) | **Native** — `Collection.products` for `royal-paws-cat-food` |
| 7 | Product grid — Primal Feast | **Native** — `Collection.products` for `primal-feast` (or fallback to product_line inference) |
| 8 | Meaty Bone Treats section | **Native** — `Collection.products` for `meaty-bone-treats` |
| 9 | Monthly Bundles row | **Native** — `Collection.products` for `monthly-bundles` |
| 10 | Per-card “Add / +qty” control | Product **Native** (`availableForSale`, `variants`) + **Metafield** `product.foeguard.no_variants` (bool) to force stepper vs open-product-page |
| 11 | Stock-up-&-save discount tiers guide | **Metaobject** — `discount_tier` referenced from **Shop.metafield** `foeguard.bulk_tiers` (list) |
| 12 | Bottom “View Cart” floating bar | Client-only (cart state) |

---

## 3. `/product/:productId` — (`pages/ProductDetail.js`)

`productId` **is the Shopify product handle.** Lookup: `product(handle:$handle)`.

| # | Section | Source |
|---|---------|--------|
| 1 | Back button | Client-only |
| 2 | Product image (main + optional gallery) | **Native** — `Product.featuredImage`, `Product.images` |
| 3 | Collection sub-title above product name | **Native** — first `Product.collections.nodes[0].title` (e.g. “Comfort Dinner”) |
| 4 | Product title | **Native** — `Product.title` |
| 5 | Price / “From $X/lb” | **Native** — `Product.priceRange`, `Product.variants[].price` |
| 6 | Short description | **Native** — `Product.description` (plain) |
| 7 | **Features list** (checkmark bullets) — *this is the section to restore* | **Metafield** — `product.foeguard.feature_list` (type: `metaobject_reference` → `product_feature_list`) **OR** simple `product.foeguard.highlights` (list.single_line_text) as a fallback |
| 8 | Variant selection (dot-style radios) | **Native** — `Product.options`, `Product.variants[].selectedOptions`, `Product.variants[].availableForSale` |
| 9 | Quantity stepper | Client-only |
| 10 | Trust badges (delivery, freshness, etc.) | **Metaobject** — `trust_badge` referenced from **Shop.metafield** `foeguard.pdp_trust_badges` (list) — shared across PDPs |
| 11 | Collapsible → Ingredients | **Metafield** — `product.foeguard.ingredients` (multi_line_text OR list.single_line_text) |
| 12 | Collapsible → Nutritional Analysis | **Metafield** — `product.foeguard.nutrition_facts` (JSON) |
| 13 | Collapsible → Product Information | **Metafield** — `product.foeguard.product_information` (multi_line_text) |
| 14 | Collapsible → Feeding Guide | **Metafield** — `product.foeguard.feeding_guide` (JSON: `{feeding, handling}`) |
| 15 | “Farm to Bowl” timeline module | **Metaobject** — `timeline_step` referenced from **Shop.metafield** `foeguard.farm_to_bowl` (list) — shared across PDPs |
| 16 | “Personalize your meal plan” CTA panel | **Metaobject** — `cta_banner` referenced from **Shop.metafield** `foeguard.pdp_personalize_cta` |
| 17 | Product FAQ | **Metafield** — `product.foeguard.faq` (list of `metaobject_reference` → `faq_item`) with fallback to **Shop.metafield** `foeguard.pdp_default_faq` |
| 18 | Floating Add/Update to Cart bar | Client-only |

---

## 4. `/treat/:treatId` — (`pages/TreatDetail.js`)

Identical structure to Product Detail, minus the Farm-to-Bowl / Personalize CTA modules. Additional treat-only fields:

| # | Section | Source |
|---|---------|--------|
| 7a | Benefits bullets (checkmarks) | **Metafield** — `product.foeguard.benefits` (list.single_line_text) OR `product.foeguard.feature_list` metaobject ref |
| 7b | Quantity description (e.g. “about 3–4 pcs per pack”) | **Metafield** — `product.foeguard.quantity_description` (single_line_text) |

Otherwise: same native + metafield mapping as PDP.

---

## 5. `/about` — (`pages/AboutPage.js`)

Single Shopify **Page** with rich sections addressed via metafields on the Page object.

Shopify **Page** handle: `about`.

| # | Section | Source |
|---|---------|--------|
| 1 | Hero image + tagline | **Metafield** — `page.foeguard.hero` (metaobject_reference → `page_hero`) |
| 2 | Our Story (body copy + inline images) | **Native** — `Page.body` (rich text) |
| 3 | Team images grid | **Metafield** — `page.foeguard.team_images` (list.file_reference) |
| 4 | “See the FoeGuard Difference” text block | **Metafield** — `page.foeguard.difference` (metaobject_reference → `text_block`) |
| 5 | “Nature Nurtured by Science” | **Metafield** — `page.foeguard.science` (metaobject_reference → `text_block`) |
| 6 | Our 8 Proteins grid | **Shop.metafield** — `foeguard.proteins` (shared with Landing) |
| 7 | Final CTA “More than just healthy food plans” | **Metafield** — `page.foeguard.cta` (metaobject_reference → `cta_banner`) |

---

## 6. `/new-to-raw` — (`pages/NewToRawPage.js`)

Shopify **Page** handle: `new-to-raw`.

| # | Section | Source |
|---|---------|--------|
| 1 | Hero — Why Raw? | **Metafield** — `page.foeguard.hero` |
| 2 | Intro paragraph | **Native** — `Page.body` (first block) |
| 3 | Benefits grid (12 icon + label) | **Shop.metafield** — `foeguard.benefits_grid` (list → `feature_card`) |
| 4 | Comparison chart (FoeGuard vs Kibble / Cooked / Freeze-Dried) | **Metaobject** — `comparison_row` referenced from `foeguard.raw_comparison` (list, ordered) |
| 5 | “Find What Really Works” | **Metafield** — `page.foeguard.works_block` (metaobject_reference → `text_block`) |
| 6 | Final CTA | **Metafield** — `page.foeguard.cta` |

---

## 7. `/delivery` — (`pages/DeliveryPage.js`)

Shopify **Page** handle: `delivery`.

| # | Section | Source |
|---|---------|--------|
| 1 | Hero | **Metafield** — `page.foeguard.hero` |
| 2 | How it ships | **Metafield** — `page.foeguard.how_it_ships` (metaobject_reference → `text_block`) |
| 3 | The Facts (grid of small stats) | **Metafield** — `page.foeguard.facts` (list → `feature_card`) |
| 4 | Delivery zones (postal codes + rates) | **Metafield** — `page.foeguard.zones` (list → `delivery_zone` metaobject) |
| 5 | Storage tips | **Metafield** — `page.foeguard.storage_tips` (metaobject_reference → `text_block`) |
| 6 | Final CTA | **Metafield** — `page.foeguard.cta` |

---

## 8. `/faq` — (`pages/FaqPage.js`)

Shopify **Page** handle: `faq`.

| # | Section | Source |
|---|---------|--------|
| 1 | Hero (headline + search) | **Metafield** — `page.foeguard.hero` |
| 2 | FAQ categories (Delivery, Feeding, Storage, Subscription…) | **Metafield** — `page.foeguard.faq_groups` (list → `faq_group` metaobject; each contains a title + list of `faq_item`) |

---

## 9. `/contact` — (`pages/ContactPage.js`)

| # | Section | Source |
|---|---------|--------|
| 1 | Header copy | **Page** — `pages/contact` (native `Page.title` + `Page.body`) |
| 2 | Contact email / phone / hours | **Shop.metafield** — `foeguard.contact_details` (metaobject_reference → `contact_details`) |
| 3 | Contact form | Client-only (posts to backend / email) |
| 4 | Success screen | Client-only |

---

## 10. `/policies`, `/terms` — (`pages/PoliciesPage.js`, `pages/TermsPage.js`)

| # | Section | Source |
|---|---------|--------|
| — | Body copy | **Native** — Shopify **Shop.policies** (`refundPolicy`, `privacyPolicy`, `shippingPolicy`, `termsOfService`, `subscriptionPolicy`) via Storefront `shop.privacyPolicy.body` etc. |

---

## 11. `/blog` and `/blog/:blogId` — (`pages/BlogPage.js`)

| # | Section | Source |
|---|---------|--------|
| 1 | Blog hero image | **Blog** — default `Blog.image` (or `Blog.metafield foeguard.hero_image`) |
| 2 | Article grid | **Blog** — `Blog.articles` (`Article.title`, `Article.image`, `Article.excerpt`, `Article.publishedAt`, `Article.authorV2`) |
| 3 | Article detail | **Blog** — `Article.contentHtml`, `Article.image`, `Article.tags`, `Article.publishedAt`, `Article.authorV2` |
| 4 | Article SEO | **Blog** — `Article.seo { title description }` (native) |

---

## 12. `/calculator`, `/meal-plan` — (`pages/CalculatorPage.js`, `pages/MealPlanPage.js`)

| # | Section | Source |
|---|---------|--------|
| 1 | Feeding calculator inputs (breed, weight, age, activity) | Client-only |
| 2 | Recommendation output (“~1.2 lb/day → Comfort Dinner Beef 12 lb every 10 days”) | Client math against **Product.priceRange** + **Metafield** `product.foeguard.feeding_guide` |
| 3 | Recommendation product cards | **Native** — `Product` list |
| 4 | Bundle-builder page — CTA copy | **Shop.metafield** — `foeguard.mealplan_intro` (metaobject_reference → `text_block`) |

---

## 13. `/account` — (`pages/AccountPage.js`)

| # | Section | Source |
|---|---------|--------|
| 1 | Auth (login / register / recover) | **Native Shopify Customer Auth** — `customerAccessTokenCreate`, `customerCreate`, `customerRecover` |
| 2 | Welcome / user name | **Native** — `Customer.firstName`, `Customer.lastName`, `Customer.displayName` |
| 3 | Pet profile card | **Customer.metafield** — `foeguard.pet_profile` (metaobject_reference → `pet_profile`) |
| 4 | Saved addresses | **Native** — `Customer.defaultAddress`, `Customer.addresses` |
| 5 | Order history cards | **Native** — `Customer.orders` → `Order.orderNumber`, `processedAt`, `totalPrice`, `financialStatus`, `fulfillmentStatus`, `lineItems`, `shippingAddress`, `statusUrl` |
| 6 | “Order Now” CTA | Static route link |

---

## 14. `/checkout` — (`pages/CheckoutPage.js`)

> The custom `/checkout` page is a **legacy in-app checkout** and is being phased out in favor of Shopify’s hosted checkout (`cart.checkoutUrl`). All new sessions should redirect to Shopify checkout. Do not treat this page as a first-class Shopify content surface.

---

## 15. Order confirmation, admin, admin login, order-choice funnel

Internal application surfaces — not exposed to Shopify content editing.

---

## 16. Global fragments (shared across every page)

| Fragment | Source |
|----------|--------|
| Announcement bar | **Shop.metafield** `foeguard.announcement` (→ `announcement_bar`) |
| Main navigation | **Nav** — `main-menu` |
| Footer columns | **Nav** — `footer-shop`, `footer-help`, `footer-company` |
| Brand column copy (footer) | **Shop.brand.shortDescription** + **Shop.metafield** `foeguard.footer_brand_blurb` |
| Social links | **Shop.metafield** `foeguard.social_links` (list → `social_link` metaobject) |
| Site-wide SEO defaults | **Shop.name**, **Shop.description**, **Shop.brand.logo** (used by `SeoHead`) |
| Site-wide favicon / OG default | **Shop.brand.squareLogo** |

---

## Feature-list restoration note (per user request)

The features/highlights list on the Product Detail page (Section #7
above) is already wired in code — it renders when
`product.foeguard.highlights` is a non-empty list. The user has asked
for it to be sourced from a **metaobject reference** instead of a raw
list so the same feature list can be reused across products. Recommended
shape:

- Metaobject **`product_feature_list`** with a single field
  `bullets: list.single_line_text` (see `METAOBJECTS.md`).
- Product metafield **`product.foeguard.feature_list`** of type
  `metaobject_reference` pointing to a `product_feature_list` entry.
- When both `foeguard.feature_list` and `foeguard.highlights` are set,
  the metaobject wins.
