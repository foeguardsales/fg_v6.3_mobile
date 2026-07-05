# FoeGuard — SHOPIFY_QUERIES

Per-page Storefront GraphQL blueprint. For each page:

- **Objects** — which Storefront root queries are executed
- **Native fields** — the native Shopify fields required
- **Metafields** — the custom metafields required (see `METAFIELDS.md`)
- **Metaobject refs** — the metaobjects to hydrate (see `METAOBJECTS.md`)
- **Relationships** — the GraphQL edges that must be traversed

Every metafield is fetched via the `metafields(identifiers: [{namespace,
key}, …])` syntax on the parent object. Every metaobject is hydrated
by following the `reference` (or `references.nodes`) field on the
returning `Metafield`. All queries execute against Storefront API
version `2025-07` through the FastAPI proxy under `/api/shopify/*`.

---

## 0. Site-wide (executed once per SPA session, cached)

```graphql
query Site {
  shop {
    name
    description
    primaryDomain { host url }
    brand {
      slogan
      shortDescription
      logo { image { url altText } }
      squareLogo { image { url altText } }
    }
    paymentSettings { currencyCode countryCode }
    refundPolicy      { title body url }
    privacyPolicy     { title body url }
    shippingPolicy    { title body url }
    termsOfService    { title body url }
    subscriptionPolicy{ title body url }

    metafields(identifiers: [
      { namespace: "foeguard", key: "announcement"          },
      { namespace: "foeguard", key: "home_hero"             },
      { namespace: "foeguard", key: "trust_marquee"         },
      { namespace: "foeguard", key: "home_why"              },
      { namespace: "foeguard", key: "home_benefits_2week"   },
      { namespace: "foeguard", key: "home_reviews"          },
      { namespace: "foeguard", key: "proteins"              },
      { namespace: "foeguard", key: "home_story"            },
      { namespace: "foeguard", key: "home_faq"              },
      { namespace: "foeguard", key: "home_final_cta"        },
      { namespace: "foeguard", key: "menu_tabs"             },
      { namespace: "foeguard", key: "bulk_tiers"            },
      { namespace: "foeguard", key: "pdp_trust_badges"      },
      { namespace: "foeguard", key: "farm_to_bowl"          },
      { namespace: "foeguard", key: "pdp_personalize_cta"   },
      { namespace: "foeguard", key: "pdp_default_faq"       },
      { namespace: "foeguard", key: "benefits_grid"         },
      { namespace: "foeguard", key: "raw_comparison"        },
      { namespace: "foeguard", key: "mealplan_intro"        },
      { namespace: "foeguard", key: "contact_details"       },
      { namespace: "foeguard", key: "social_links"          },
      { namespace: "foeguard", key: "footer_brand_blurb"    }
    ]) { namespace key type value reference { ...on Metaobject { id handle type fields { key value reference { ...on MediaImage { image { url altText width height } } } } } } references(first: 50) { nodes { ...on Metaobject { id handle type fields { key value reference { ...on MediaImage { image { url } } } } } } } }
  }

  mainMenu:  menu(handle: "main-menu")        { items { title url resourceId type } }
  footerShop:menu(handle: "footer-shop")      { items { title url } }
  footerHelp:menu(handle: "footer-help")      { items { title url } }
  footerCo:  menu(handle: "footer-company")   { items { title url } }
}
```

**Relationships followed:** `Shop → metafields → references → Metaobject.fields → reference (image / other Metaobject)`.

---

## 1. `/` — Landing

**Objects queried:**
- `shop` (see Site query, cached)
- `collections(first: N, query: "metafield.foeguard.show_on_home:true")`
- `page(handle: "about")` (for the story teaser fallback)

**Native fields:**
- `Collection.handle`, `title`, `image { url altText }`, `metafield foeguard.show_on_home`, `metafield foeguard.home_order`
- `Page.body` (first paragraph, for optional story teaser)

**Metafields consumed:**
- Shop → `foeguard.announcement`, `home_hero`, `trust_marquee`,
  `home_why`, `home_benefits_2week`, `home_reviews`, `proteins`,
  `home_story`, `home_faq`, `home_final_cta`, `social_links`,
  `footer_brand_blurb`
- Collection → `foeguard.show_on_home`, `foeguard.home_order`

**Metaobjects hydrated:**
- `foeguard_hero_slide`, `foeguard_press_logo`, `foeguard_why_block`,
  `foeguard_feature_card`, `foeguard_review`, `foeguard_protein_card`,
  `foeguard_text_block`, `foeguard_faq_item`, `foeguard_cta_banner`,
  `foeguard_announcement_bar`, `foeguard_social_link`

**Relationships:** `Shop.metafields → metaobject references → fields (image, sub-metaobjects)`.

---

## 2. `/menu`, `/menu/comfort-dinner`, `/menu/primal-feast`, `/menu/treats`

**Objects queried:**
- `products(first: 250)` — the full active catalog (paginated). Draft & archived products are never returned by Storefront.
- `collection(handle: <hero collection>)` for each active tab, to read its `hero_image` metafield and `image`.
- `shop.metafield foeguard.menu_tabs` and `foeguard.bulk_tiers` (from Site query).

**Native fields (per Product):**
- `id`, `handle`, `title`, `description`, `descriptionHtml`,
  `productType`, `vendor`, `tags`, `availableForSale`,
  `onlineStoreUrl`, `updatedAt`, `publishedAt`, `seo { title description }`,
  `priceRange { minVariantPrice{amount currencyCode} maxVariantPrice{...} }`,
  `featuredImage { url altText width height }`,
  `images(first: 10) { nodes { url altText width height } }`,
  `options { id name values }`,
  `variants(first: 100) { nodes { id title sku availableForSale price{amount currencyCode} compareAtPrice{amount currencyCode} selectedOptions{name value} image{url altText} } }`

**Metafields consumed (per Product):**
- `foeguard.feature_list`, `highlights`, `ingredients`,
  `nutrition_facts`, `product_information`, `feeding_guide`, `faq`,
  `mini_description`, `product_line`, `protein_type`, `pet_type`,
  `no_variants`, `benefits`, `quantity_description`

**Metafields consumed (per active Collection):**
- `foeguard.hero_image`, `hero_headline`, `hero_sub`

**Metaobjects hydrated:**
- `foeguard_menu_tab` (Shop.menu_tabs)
- `foeguard_discount_tier` (Shop.bulk_tiers)
- `foeguard_product_feature_list` (per Product feature_list)

**Relationships:** `Collection → metafields → image` and `Product → metafields → metaobject_reference → fields`.

---

## 3. `/product/:handle`

**Objects queried:**
- `product(handle: $handle)`
- `shop` (Site query)

**Native fields:**
- All of the Product native fields listed under `/menu` above, PLUS:
- `Product.collections(first: 3) { nodes { handle title } }` — for the collection sub-title above the product name.

**Metafields consumed:**
- Product → `foeguard.feature_list`, `highlights`, `ingredients`,
  `nutrition_facts`, `product_information`, `feeding_guide`, `faq`,
  `mini_description`, `product_line`, `protein_type`, `pet_type`,
  `no_variants`
- Shop → `foeguard.pdp_trust_badges`, `farm_to_bowl`,
  `pdp_personalize_cta`, `pdp_default_faq`

**Metaobjects hydrated:**
- `foeguard_product_feature_list` (per-product features list)
- `foeguard_trust_badge` (shared, Shop.pdp_trust_badges)
- `foeguard_timeline_step` (shared, Shop.farm_to_bowl)
- `foeguard_cta_banner` (shared, Shop.pdp_personalize_cta)
- `foeguard_faq_item` (product’s foeguard.faq OR Shop.pdp_default_faq)

**Relationships:**

```
Product
  ├ collections(first: 3)
  ├ metafields[foeguard.feature_list]     → Metaobject(product_feature_list)
  ├ metafields[foeguard.faq]              → [Metaobject(faq_item)]
  └ variants → selectedOptions

Shop (cached)
  ├ metafields[foeguard.pdp_trust_badges] → [Metaobject(trust_badge)]
  ├ metafields[foeguard.farm_to_bowl]     → [Metaobject(timeline_step)]
  ├ metafields[foeguard.pdp_personalize_cta] → Metaobject(cta_banner)
  └ metafields[foeguard.pdp_default_faq]  → [Metaobject(faq_item)]
```

---

## 4. `/treat/:handle`

Same Product query as above. Additional metafields specific to treats:

- `foeguard.benefits` (list.single_line_text)
- `foeguard.quantity_description` (single_line_text)

The `foeguard.feature_list` metaobject is preferred; `foeguard.benefits`
is used as a fallback.

---

## 5. `/about`

**Objects queried:**
- `page(handle: "about")`
- `shop.metafield foeguard.proteins` (Site query, cached)

**Native fields:**
- `Page.title`, `Page.handle`, `Page.body`, `Page.seo { title description }`, `Page.updatedAt`

**Metafields consumed (Page):**
- `foeguard.hero`, `difference`, `science`, `team_images`, `cta`

**Metaobjects hydrated:**
- `foeguard_page_hero`, `foeguard_text_block`, `foeguard_protein_card`, `foeguard_cta_banner`

**Relationships:** `Page → metafields → metaobject / file_reference`.

---

## 6. `/new-to-raw`

**Objects queried:**
- `page(handle: "new-to-raw")`
- Site query for `foeguard.benefits_grid`, `raw_comparison`

**Native fields:**
- `Page.title`, `Page.body`, `Page.seo`, `Page.updatedAt`

**Metafields consumed (Page):**
- `foeguard.hero`, `works_block`, `cta`

**Metaobjects hydrated:**
- `foeguard_page_hero`, `foeguard_feature_card` (grid),
  `foeguard_comparison_row`, `foeguard_text_block`, `foeguard_cta_banner`

---

## 7. `/delivery`

**Objects queried:**
- `page(handle: "delivery")`

**Native fields:**
- `Page.title`, `Page.body`, `Page.seo`, `Page.updatedAt`

**Metafields consumed (Page):**
- `foeguard.hero`, `how_it_ships`, `facts`, `zones`, `storage_tips`, `cta`

**Metaobjects hydrated:**
- `foeguard_page_hero`, `foeguard_text_block`, `foeguard_feature_card`,
  `foeguard_delivery_zone`, `foeguard_cta_banner`

---

## 8. `/faq`

**Objects queried:**
- `page(handle: "faq")`

**Native fields:**
- `Page.title`, `Page.body`, `Page.seo`

**Metafields consumed (Page):**
- `foeguard.hero`, `foeguard.faq_groups`

**Metaobjects hydrated:**
- `foeguard_page_hero`, `foeguard_faq_group`, `foeguard_faq_item`

**Relationships:**

```
Page("faq").metafields[foeguard.faq_groups] → [Metaobject(faq_group).items → Metaobject(faq_item)]
```

---

## 9. `/contact`

**Objects queried:**
- `page(handle: "contact")`
- Site query for `foeguard.contact_details`

**Native fields:**
- `Page.title`, `Page.body`, `Page.seo`

**Metaobjects hydrated:**
- `foeguard_contact_details`

---

## 10. `/policies`, `/terms`

**Objects queried:**
- Site query only (no additional page load)

**Native fields:**
- `Shop.refundPolicy.body`, `Shop.privacyPolicy.body`,
  `Shop.shippingPolicy.body`, `Shop.termsOfService.body`,
  `Shop.subscriptionPolicy.body` (plus their `title` and `url` for canonical linking)

**Metafields / Metaobjects:** none

---

## 11. `/blog`, `/blog/:articleHandle`

**Objects queried:**
- `blog(handle: "news")` (or the store’s default blog handle)
- `blog.articles(first: 24, sortKey: PUBLISHED_AT, reverse: true)` for the list
- `blog.articleByHandle(handle: $slug)` for detail

**Native fields (Blog):**
- `Blog.handle`, `Blog.title`, `Blog.image { url altText }`, `Blog.seo`

**Native fields (Article):**
- `Article.id`, `handle`, `title`, `excerpt`, `contentHtml`,
  `publishedAt`, `image { url altText }`, `tags`,
  `authorV2 { name bio email }`, `seo { title description }`,
  `blog { handle title }`

**Metafields consumed (Blog):**
- `foeguard.hero_image` (optional)

**Metaobjects hydrated:** none required for MVP.

**Relationships:** `Blog → articles → authorV2`.

---

## 12. `/calculator`, `/meal-plan`

**Objects queried:**
- Site query for `foeguard.mealplan_intro`
- On-demand `product(handle: ...)` calls for recommended products.

**Native fields:** `Product.priceRange`, `Product.variants`, `Product.featuredImage`.

**Metafields consumed:** `product.foeguard.feeding_guide` (JSON).

**Metaobjects hydrated:** `foeguard_text_block`.

---

## 13. `/account`

**Objects queried:**
- `customer(customerAccessToken: $token)`

**Native fields:**
- `Customer.id`, `firstName`, `lastName`, `displayName`, `email`,
  `phone`, `acceptsMarketing`, `numberOfOrders`, `createdAt`, `updatedAt`
- `Customer.defaultAddress { …address fields… }`
- `Customer.addresses(first: 20) { nodes { …address fields… } }`
- `Customer.orders(first: 50, sortKey: PROCESSED_AT, reverse: true) { nodes { id orderNumber name processedAt financialStatus fulfillmentStatus statusUrl totalPrice{amount currencyCode} subtotalPrice{...} totalShippingPrice{...} totalTax{...} shippingAddress{...} lineItems(first:50){ nodes { title quantity variant { id title price{amount currencyCode} image{url} product{handle title} } } } } }`

**Metafields consumed:**
- `customer.foeguard.pet_profile` (metaobject_reference)

**Metaobjects hydrated:**
- `foeguard_pet_profile`

**Relationships:**

```
Customer
  ├ defaultAddress
  ├ addresses.nodes
  ├ orders.nodes → lineItems.nodes → variant → product
  └ metafields[foeguard.pet_profile] → Metaobject(pet_profile)
```

---

## 14. Cart (client-managed, mutated per action)

**Mutations:** `cartCreate`, `cartLinesAdd`, `cartLinesUpdate`,
`cartLinesRemove`, `cartBuyerIdentityUpdate`, `cartDiscountCodesUpdate`.

**Read query:** `cart(id: $cartId)`

**Native fields:**
- `Cart.id`, `checkoutUrl`, `createdAt`, `updatedAt`, `totalQuantity`,
  `cost { subtotalAmount totalAmount totalTaxAmount totalDutyAmount }`,
  `buyerIdentity { email phone countryCode customer { id email } }`,
  `lines(first: 100) { nodes { id quantity cost{...} merchandise{...} attributes{key value} } }`,
  `attributes { key value }`, `discountCodes { code applicable }`

**Checkout:** redirect the customer to `Cart.checkoutUrl` (Shopify’s
hosted checkout). No custom checkout query is needed.

---

## 15. SEO endpoints (server-side, `seo_service/router.py`)

All SEO responses are built from the Shopify queries above; no separate
authoring surface. Data lineage is:

```
GET /api/seo/site/home              ← Shop native + brand + site metafields
GET /api/seo/site/organization      ← Shop native + brand
GET /api/seo/product/{handle}       ← Product native + Product.seo + featuredImage + variants
GET /api/seo/collection/{handle}    ← Collection native + Collection.seo + first N products
GET /api/sitemap.xml                ← all published products + collections + static routes
GET /api/robots.txt                 ← Shop.primaryDomain
```

---

## GraphQL relationship summary

```
Shop
├ brand.{logo, squareLogo, slogan, shortDescription}
├ primaryDomain.{host, url}
├ policies.{refund, privacy, shipping, terms, subscription}
├ menus (main-menu, footer-shop, footer-help, footer-company)
└ metafields[foeguard.*] → metaobject refs → fields

Collection
├ title, handle, image, description, updatedAt, seo
├ products.nodes → Product…
└ metafields[foeguard.hero_image, show_on_home, home_order, hero_*]

Product
├ native (title, description, seo, images, options, variants, tags…)
├ collections(first: 3)
├ variants.nodes.selectedOptions
└ metafields[foeguard.feature_list → product_feature_list,
              foeguard.faq → [faq_item],
              foeguard.highlights, ingredients, nutrition_facts,
              product_information, feeding_guide, benefits,
              quantity_description, product_line, protein_type,
              pet_type, no_variants, mini_description]

Blog → Article (native only)

Page
├ body, seo
└ metafields[foeguard.hero, cta, difference, science, team_images,
              works_block, how_it_ships, facts, zones, storage_tips,
              faq_groups]

Customer
├ native (addresses, orders, defaultAddress)
└ metafields[foeguard.pet_profile → Metaobject(pet_profile)]

Cart / Order — native only.
```

---

## Rules the frontend enforces

1. Storefront-only for browser calls; Admin API is server-only
   (via `/api/shopify/*` in FastAPI). Admin token never reaches the
   frontend bundle.
2. Every metafield MUST have Storefront read access enabled on its
   definition, else it returns null and the section falls back to its
   native or hidden state.
3. When both a metafield override and native field exist, the metafield
   wins for SEO (title/description) and for structured content; native
   otherwise.
4. Metaobjects are always accessed through a metafield reference —
   never queried directly by type from the storefront.
5. Pagination is capped at 250 items per page; the frontend
   auto-paginates products up to 20 pages (2 000 items) hard cap.
6. All content is cached client-side for 60 seconds (Shopify products)
   and server-side for 5 minutes (SEO payloads).
