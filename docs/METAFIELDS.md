# FoeGuard — METAFIELDS

Exhaustive list of every **custom metafield** required by the storefront.
Native Shopify fields (Product.title, Product.description, Product.seo,
Collection.image, Customer.defaultAddress, Shop.brand.logo, etc.) are
**not** listed here — see `SHOPIFY_QUERIES.md` for the full native +
metafield picture per page.

Conventions:

- All namespaces use `foeguard`.
- Use **Metaobject reference** where the same shape is reused across
  products / pages (avoids duplicate content). See `METAOBJECTS.md` for
  the referenced types.
- Keys are snake_case.
- “`Access`” column shows what Storefront API scope the field is exposed
  under. All fields below must have **Storefront access enabled**
  (“Read”) on the metafield definition or they will be invisible to the
  headless frontend.

---

## Product metafields (Owner: **Product**)

| Namespace.Key | Type | Purpose | Access |
|---|---|---|---|
| `foeguard.feature_list` | `metaobject_reference` → `product_feature_list` | The checkmark feature bullets shown high on the PDP right column. Reusable across similar products (e.g. all Comfort Dinners can share “Human-Grade Beef Feature List”). | Storefront read |
| `foeguard.highlights` | `list.single_line_text` | Fallback feature-list bullets when a `feature_list` metaobject isn’t assigned. If both are set, `feature_list` wins. | Storefront read |
| `foeguard.ingredients` | `multi_line_text` **or** `list.single_line_text` | Body of the “Ingredients” collapsible. | Storefront read |
| `foeguard.nutrition_facts` | `json` | Nutritional analysis as `{ "Crude Protein": "14%", "Crude Fat": "9%", ... }`. Keys are labels, values are strings. | Storefront read |
| `foeguard.product_information` | `multi_line_text` | Body of the “Product Information” collapsible. | Storefront read |
| `foeguard.feeding_guide` | `json` | `{ "feeding": "2–4% of body weight per day…", "handling": "Thaw 24h in fridge…" }`. Consumed as two paragraphs. | Storefront read |
| `foeguard.faq` | `list.metaobject_reference` → `faq_item` | Per-product FAQ list on the PDP. Falls back to `Shop.metafield foeguard.pdp_default_faq`. | Storefront read |
| `foeguard.mini_description` | `single_line_text` | Short one-liner used in menu cards / meta descriptions when SEO description is missing. | Storefront read |
| `foeguard.product_line` | `single_line_text` | One of `comfort_dinner | royal_paws | primal_feast | monthly_bundles | meaty_bone_treats`. Optional override; when absent the frontend infers from `productType` + handle + tags. | Storefront read |
| `foeguard.protein_type` | `single_line_text` | `chicken | beef | duck | …`. Optional override; inferred from tags otherwise. | Storefront read |
| `foeguard.pet_type` | `single_line_text` | `dog | cat`. Optional override; inferred from tags / product_line otherwise. | Storefront read |
| `foeguard.no_variants` | `boolean` | Forces the menu card to show the inline quick-add `[-] qty [+]` stepper instead of opening the PDP on `+`. | Storefront read |
| `foeguard.benefits` | `list.single_line_text` | Treat-only: the checkmark bullets on `/treat/:handle`. | Storefront read |
| `foeguard.quantity_description` | `single_line_text` | Treat-only: e.g. “~3–4 pieces per pack” shown above variant selector. | Storefront read |

---

## Collection metafields (Owner: **Collection**)

| Namespace.Key | Type | Purpose | Access |
|---|---|---|---|
| `foeguard.hero_image` | `file_reference` | Full-bleed hero background image used on `/menu/<handle>` tab when this collection is active. | Storefront read |
| `foeguard.hero_headline` | `single_line_text` | Optional overlay headline on the collection hero. | Storefront read |
| `foeguard.hero_sub` | `single_line_text` | Optional overlay sub-headline. | Storefront read |
| `foeguard.show_on_home` | `boolean` | If true, the collection appears in the “Shop Farm Fresh” row on `/`. | Storefront read |
| `foeguard.home_order` | `number_integer` | Sort order of the collection card on `/` (ascending). Ignored when `show_on_home` is false. | Storefront read |

---

## Page metafields (Owner: **Page**)

(All Shopify Pages that back the marketing routes.)

| Namespace.Key | Type | Purpose | Applies to page handles |
|---|---|---|---|
| `foeguard.hero` | `metaobject_reference` → `page_hero` | Hero image + headline + sub + CTA. | `about`, `new-to-raw`, `delivery`, `faq`, `contact` |
| `foeguard.cta` | `metaobject_reference` → `cta_banner` | Final CTA at the bottom of the page. | `about`, `new-to-raw`, `delivery` |
| `foeguard.difference` | `metaobject_reference` → `text_block` | “See the FoeGuard Difference” block. | `about` |
| `foeguard.science` | `metaobject_reference` → `text_block` | “Nature Nurtured by Science” block. | `about` |
| `foeguard.team_images` | `list.file_reference` | Grid of team / kitchen photos. | `about` |
| `foeguard.works_block` | `metaobject_reference` → `text_block` | “Find What Really Works” block. | `new-to-raw` |
| `foeguard.how_it_ships` | `metaobject_reference` → `text_block` | “How it ships” body copy. | `delivery` |
| `foeguard.facts` | `list.metaobject_reference` → `feature_card` | “The Facts” small stat grid. | `delivery` |
| `foeguard.zones` | `list.metaobject_reference` → `delivery_zone` | Delivery zone table (postal ranges + rates). | `delivery` |
| `foeguard.storage_tips` | `metaobject_reference` → `text_block` | Storage tips section. | `delivery` |
| `foeguard.faq_groups` | `list.metaobject_reference` → `faq_group` | The full FAQ tree. | `faq` |

---

## Shop metafields (Owner: **Shop**)

Global / cross-page content lives here. All keys under namespace `foeguard`.

| Namespace.Key | Type | Purpose |
|---|---|---|
| `foeguard.announcement` | `metaobject_reference` → `announcement_bar` | Global top-of-page announcement bar. Empty → no bar. |
| `foeguard.home_hero` | `metaobject_reference` → `hero_slide` | Landing hero (image + copy + CTA). |
| `foeguard.trust_marquee` | `list.metaobject_reference` → `press_logo` | Award / press logos below the landing hero. |
| `foeguard.home_why` | `list.metaobject_reference` → `why_block` | “Why FoeGuard?” side-by-side blocks. |
| `foeguard.home_benefits_2week` | `list.metaobject_reference` → `feature_card` | “Start to see benefits in just 2 weeks” grid. |
| `foeguard.home_reviews` | `list.metaobject_reference` → `review` | Reviews carousel on the home page. |
| `foeguard.proteins` | `list.metaobject_reference` → `protein_card` | 8+ Protein Options grid — shared by `/` and `/about`. |
| `foeguard.home_story` | `metaobject_reference` → `text_block` | About / Our Story teaser on the landing page. |
| `foeguard.home_faq` | `list.metaobject_reference` → `faq_item` | FAQ accordion on the landing page. |
| `foeguard.home_final_cta` | `metaobject_reference` → `cta_banner` | Final CTA on the landing page. |
| `foeguard.menu_tabs` | `list.metaobject_reference` → `menu_tab` | Ordered menu category tabs used on `/menu`. |
| `foeguard.bulk_tiers` | `list.metaobject_reference` → `discount_tier` | Stock-up-&-save bulk discount tiers strip on `/menu`. |
| `foeguard.pdp_trust_badges` | `list.metaobject_reference` → `trust_badge` | Trust badges row shared by every PDP / treat page. |
| `foeguard.farm_to_bowl` | `list.metaobject_reference` → `timeline_step` | “Farm to Bowl” timeline shared by every PDP. |
| `foeguard.pdp_personalize_cta` | `metaobject_reference` → `cta_banner` | “Personalize your meal plan” panel on the PDP. |
| `foeguard.pdp_default_faq` | `list.metaobject_reference` → `faq_item` | Default PDP FAQ when a product hasn’t set its own. |
| `foeguard.benefits_grid` | `list.metaobject_reference` → `feature_card` | 12-icon benefits grid on `/new-to-raw`. |
| `foeguard.raw_comparison` | `list.metaobject_reference` → `comparison_row` | Comparison chart on `/new-to-raw`. |
| `foeguard.mealplan_intro` | `metaobject_reference` → `text_block` | Intro block on `/calculator` and `/meal-plan`. |
| `foeguard.contact_details` | `metaobject_reference` → `contact_details` | Email / phone / hours block on `/contact`. |
| `foeguard.social_links` | `list.metaobject_reference` → `social_link` | Global social links (footer + everywhere). |
| `foeguard.footer_brand_blurb` | `multi_line_text` | Footer brand column blurb under the logo. |

---

## Customer metafields (Owner: **Customer**)

| Namespace.Key | Type | Purpose | Access |
|---|---|---|---|
| `foeguard.pet_profile` | `metaobject_reference` → `pet_profile` | The pet card shown on `/account` (breed, weight, age, activity, allergies). | Storefront read — requires `unauthenticated_read_customers` on Storefront token, plus the customer’s own access token to fetch. |

> Writing to Customer metafields requires the Storefront app scope
> `unauthenticated_write_customers`; when that scope isn’t enabled the
> account page will render the pet profile as read-only.

---

## Blog & Article metafields

None required for MVP — Article native fields (`title`, `contentHtml`,
`image`, `excerpt`, `publishedAt`, `authorV2`, `tags`, `seo`) fully
cover the current design. Add:

| Owner | Namespace.Key | Type | Purpose |
|---|---|---|---|
| Blog | `foeguard.hero_image` | `file_reference` | Optional custom hero image for the blog index (falls back to `Blog.image`). |

---

## Anti-patterns explicitly **not** included

The following would be duplicates of native Shopify fields — do NOT
create them:

- `foeguard.title`, `foeguard.description`, `foeguard.seo_title`,
  `foeguard.seo_description`, `foeguard.image`, `foeguard.price`,
  `foeguard.brand`, `foeguard.url`, `foeguard.tags`, `foeguard.vendor`.
- Any per-product address or shipping info — use Shopify’s built-in
  fulfillment settings.
- Any per-customer order fields — use native `Order.*`.
