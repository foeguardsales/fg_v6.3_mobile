# FoeGuard — METAOBJECTS

Reusable content blocks that should exist as Shopify **Metaobjects**.
A metaobject makes sense only when the same shape is reused across
pages / products, or when authors need to manage a bounded list of
structured entries (features, protein cards, reviews, timeline steps,
etc.). Anything that Shopify already models natively (Product, Order,
Customer, Blog, Article, Page, Collection, Navigation, Menu, Shop
Policies, Shop Brand) is intentionally **NOT** a metaobject.

All metaobject **types** use the `foeguard_` prefix so they are easy to
find in Shopify admin. All fields use snake_case keys.

For each metaobject below:
- **Type** = the Shopify metaobject type handle
- **Fields** = the field definitions (name : type)
- **Used on** = which pages/sections consume it
- **Referenced by** = which metafield(s) hold references to it
- **Access** = whether Storefront read is required (yes for every one
  listed here)

---

## 1. `foeguard_hero_slide`

Main landing / marketing hero.

**Fields**

| Field | Type |
|---|---|
| `headline` | `single_line_text` |
| `sub_headline` | `multi_line_text` |
| `image` | `file_reference` (image) |
| `mobile_image` | `file_reference` (image, optional) |
| `cta_label` | `single_line_text` |
| `cta_url` | `url` |
| `overlay_dark` | `boolean` |

**Used on:** `/` (Landing hero)
**Referenced by:** `Shop.metafield foeguard.home_hero`

---

## 2. `foeguard_press_logo`

Single logo in the trust marquee.

**Fields**

| Field | Type |
|---|---|
| `name` | `single_line_text` |
| `logo` | `file_reference` (image, SVG or PNG on dark) |
| `link` | `url` (optional) |

**Used on:** `/`
**Referenced by:** `Shop.metafield foeguard.trust_marquee`

---

## 3. `foeguard_why_block`

Side-by-side image + text block.

**Fields**

| Field | Type |
|---|---|
| `heading` | `single_line_text` |
| `body` | `rich_text` |
| `bullets` | `list.single_line_text` (optional) |
| `image` | `file_reference` (image) |
| `image_side` | `single_line_text` — `left` \| `right` |
| `cta_label` | `single_line_text` (optional) |
| `cta_url` | `url` (optional) |

**Used on:** `/` (“Why FoeGuard?”)
**Referenced by:** `Shop.metafield foeguard.home_why`

---

## 4. `foeguard_feature_card`

Small icon + title + body card. Reusable across many grids.

**Fields**

| Field | Type |
|---|---|
| `icon` | `single_line_text` — lucide icon name **or** file_reference to an SVG |
| `title` | `single_line_text` |
| `body` | `multi_line_text` |

**Used on:**
- `/` → “Benefits in 2 weeks” (`foeguard.home_benefits_2week`)
- `/new-to-raw` → 12 benefits grid (`foeguard.benefits_grid`)
- `/delivery` → The Facts (`foeguard.facts`)

---

## 5. `foeguard_review`

One customer review.

**Fields**

| Field | Type |
|---|---|
| `author_name` | `single_line_text` |
| `body` | `multi_line_text` |
| `rating` | `number_integer` (1–5) |
| `avatar` | `file_reference` (image, optional) |
| `pet_name` | `single_line_text` (optional) |
| `product` | `product_reference` (optional — links the review to a specific product) |

**Used on:** `/` (Reviews carousel), optionally embedded on PDP.
**Referenced by:** `Shop.metafield foeguard.home_reviews`

---

## 6. `foeguard_protein_card`

A protein option grid tile.

**Fields**

| Field | Type |
|---|---|
| `name` | `single_line_text` |
| `image` | `file_reference` (image) |
| `body` | `multi_line_text` |
| `key_benefits` | `list.single_line_text` |
| `link_collection` | `collection_reference` (optional — links to the protein’s collection) |

**Used on:** `/` and `/about`
**Referenced by:** `Shop.metafield foeguard.proteins`

---

## 7. `foeguard_faq_item`

Question / answer pair.

**Fields**

| Field | Type |
|---|---|
| `question` | `single_line_text` |
| `answer` | `rich_text` |

**Used on:**
- Landing FAQ accordion (`foeguard.home_faq`)
- Product FAQ (`product.foeguard.faq` + shop.pdp_default_faq)
- `/faq` (referenced through `foeguard_faq_group`)

---

## 8. `foeguard_faq_group`

A named group of FAQ items (e.g. “Delivery”, “Feeding”).

**Fields**

| Field | Type |
|---|---|
| `title` | `single_line_text` |
| `items` | `list.metaobject_reference` → `foeguard_faq_item` |

**Used on:** `/faq` (only). `Page.metafield foeguard.faq_groups`.

---

## 9. `foeguard_cta_banner`

Final-CTA banner with background and button.

**Fields**

| Field | Type |
|---|---|
| `heading` | `single_line_text` |
| `sub_heading` | `multi_line_text` (optional) |
| `background_image` | `file_reference` (image, optional) |
| `background_color` | `color` (optional) |
| `cta_label` | `single_line_text` |
| `cta_url` | `url` |

**Used on:**
- `/` (final CTA)
- `/about`, `/new-to-raw`, `/delivery` (final CTAs)
- PDP “Personalize your meal plan”

---

## 10. `foeguard_menu_tab`

One tab of the immersive menu category bar.

**Fields**

| Field | Type |
|---|---|
| `label` | `single_line_text` — e.g. “Raw Dog Food” |
| `route` | `single_line_text` — e.g. `/menu`, `/menu/treats` |
| `collection` | `collection_reference` (optional, drives the product grid) |
| `pet_type` | `single_line_text` — `dog` \| `cat` |
| `order` | `number_integer` |

**Used on:** `/menu` (all sub-routes).
**Referenced by:** `Shop.metafield foeguard.menu_tabs`

---

## 11. `foeguard_discount_tier`

Bulk / stock-up-&-save tier.

**Fields**

| Field | Type |
|---|---|
| `min_lbs` | `number_decimal` |
| `percent_off` | `number_decimal` |
| `label` | `single_line_text` |

**Used on:** `/menu` (Bulk Discount Tiers strip).
**Referenced by:** `Shop.metafield foeguard.bulk_tiers`

---

## 12. `foeguard_trust_badge`

Small trust badge (delivery / freshness / vet-approved icons row).

**Fields**

| Field | Type |
|---|---|
| `label` | `single_line_text` |
| `icon` | `single_line_text` — lucide icon name OR file_reference SVG |
| `sub_label` | `single_line_text` (optional) |

**Used on:** every PDP / treat page.
**Referenced by:** `Shop.metafield foeguard.pdp_trust_badges`

---

## 13. `foeguard_timeline_step`

One step in the “Farm to Bowl” PDP timeline.

**Fields**

| Field | Type |
|---|---|
| `title` | `single_line_text` |
| `body` | `multi_line_text` |
| `image` | `file_reference` (image) |
| `order` | `number_integer` |

**Used on:** every PDP.
**Referenced by:** `Shop.metafield foeguard.farm_to_bowl`

---

## 14. `foeguard_product_feature_list`

Reusable list of checkmark bullets shown on the PDP.

**Fields**

| Field | Type |
|---|---|
| `name` | `single_line_text` — admin-only label (e.g. “Comfort Dinner Feature Set”) |
| `bullets` | `list.single_line_text` |
| `icon` | `single_line_text` — default `check` |

**Used on:** every PDP / treat page.
**Referenced by:** `product.foeguard.feature_list` (per product).

> This is the metaobject the user asked about. Different products can
> point to the same `product_feature_list` (avoiding duplicate copy).

---

## 15. `foeguard_page_hero`

Hero used at the top of marketing pages (`/about`, `/new-to-raw`,
`/delivery`, `/faq`, `/contact`).

**Fields**

| Field | Type |
|---|---|
| `headline` | `single_line_text` |
| `sub_headline` | `multi_line_text` (optional) |
| `image` | `file_reference` (image) |
| `mobile_image` | `file_reference` (image, optional) |
| `cta_label` | `single_line_text` (optional) |
| `cta_url` | `url` (optional) |

**Used on:** `/about`, `/new-to-raw`, `/delivery`, `/faq`, `/contact`.
**Referenced by:** `page.foeguard.hero` on each Shopify Page.

---

## 16. `foeguard_text_block`

Generic heading + rich body block, used for one-off marketing sections.

**Fields**

| Field | Type |
|---|---|
| `heading` | `single_line_text` |
| `body` | `rich_text` |
| `image` | `file_reference` (image, optional) |
| `align` | `single_line_text` — `left` \| `center` \| `right` |

**Used on:**
- `/about` → `foeguard.difference`, `foeguard.science`
- `/new-to-raw` → `foeguard.works_block`
- `/delivery` → `foeguard.how_it_ships`, `foeguard.storage_tips`
- `/calculator`, `/meal-plan` → `foeguard.mealplan_intro`
- Landing story teaser (`foeguard.home_story`)

---

## 17. `foeguard_delivery_zone`

One zone in the delivery table.

**Fields**

| Field | Type |
|---|---|
| `name` | `single_line_text` — e.g. “Greater Toronto Area” |
| `postal_prefixes` | `list.single_line_text` — e.g. `["M", "L4", "L5"]` |
| `rate` | `single_line_text` — e.g. “Free over $99” |
| `eta` | `single_line_text` — e.g. “1–2 business days” |

**Used on:** `/delivery`.
**Referenced by:** `page.foeguard.zones`

---

## 18. `foeguard_comparison_row`

One row of the FoeGuard-vs-others chart.

**Fields**

| Field | Type |
|---|---|
| `attribute` | `single_line_text` — row label, e.g. “Human-Grade” |
| `foeguard` | `single_line_text` — e.g. `✅` |
| `kibble` | `single_line_text` — e.g. `❌` |
| `cooked` | `single_line_text` |
| `freeze_dried` | `single_line_text` |
| `order` | `number_integer` |

**Used on:** `/new-to-raw` (comparison chart).
**Referenced by:** `Shop.metafield foeguard.raw_comparison`

---

## 19. `foeguard_contact_details`

**Fields**

| Field | Type |
|---|---|
| `email` | `single_line_text` |
| `phone` | `single_line_text` |
| `hours` | `multi_line_text` |
| `address` | `multi_line_text` (optional) |

**Used on:** `/contact`.
**Referenced by:** `Shop.metafield foeguard.contact_details`

---

## 20. `foeguard_social_link`

**Fields**

| Field | Type |
|---|---|
| `platform` | `single_line_text` — `instagram` \| `tiktok` \| `facebook` \| `youtube` \| `x` |
| `url` | `url` |

**Used on:** Footer (every route).
**Referenced by:** `Shop.metafield foeguard.social_links`

---

## 21. `foeguard_announcement_bar`

**Fields**

| Field | Type |
|---|---|
| `message` | `single_line_text` |
| `link_label` | `single_line_text` (optional) |
| `link_url` | `url` (optional) |
| `background_color` | `color` (optional) |
| `text_color` | `color` (optional) |

**Used on:** every route (top-of-page announcement).
**Referenced by:** `Shop.metafield foeguard.announcement`

---

## 22. `foeguard_pet_profile` (Customer-owned)

Per-customer pet card.

**Fields**

| Field | Type |
|---|---|
| `pet_name` | `single_line_text` |
| `species` | `single_line_text` — `dog` \| `cat` |
| `breed` | `single_line_text` |
| `weight_lb` | `number_decimal` |
| `age_years` | `number_decimal` |
| `activity_level` | `single_line_text` — `low` \| `medium` \| `high` |
| `allergies` | `list.single_line_text` |
| `photo` | `file_reference` (image, optional) |

**Used on:** `/account` (Pet Profile card).
**Referenced by:** `customer.foeguard.pet_profile`

---

## Explicit non-metaobjects (already native)

Do NOT create metaobjects for these — use the native Shopify object:

| Concept | Native object to use |
|---|---|
| Product | `Product` |
| Variant | `ProductVariant` |
| Collection | `Collection` |
| Product image / video | `Product.images` / `Product.media` |
| Blog post | `Article` |
| Blog | `Blog` |
| Static marketing page copy | `Page` |
| Cart | `Cart` |
| Order | `Order` |
| Customer | `Customer` |
| Address | `MailingAddress` |
| Logo, colors, favicon, slogan | `Shop.brand` |
| Currency, primary domain | `Shop.currencyCode`, `Shop.primaryDomain` |
| Policies (refund, privacy, shipping, terms, subscription) | `Shop.refundPolicy`, `Shop.privacyPolicy`, `Shop.shippingPolicy`, `Shop.termsOfService`, `Shop.subscriptionPolicy` |
| Navigation menus | Shopify **Navigation → Menu** (`shop.menu(handle:…)`) |
| SEO title / description | `Product.seo`, `Collection.seo`, `Article.seo`, `Page.seo` |
