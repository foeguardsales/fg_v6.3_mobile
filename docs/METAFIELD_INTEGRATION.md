# Making Any Page Metafield-Driven

FoeGuard's marketing pages start with hardcoded copy + images so the site
looks polished even when Shopify metafields are empty. When the merchant
assigns a metafield to a page, the frontend automatically picks it up on
the next request (respecting webhook-driven cache invalidation).

## The one-line pattern

For **structured metafields** (hero images, section images, JSON blobs,
metaobject lists), pull them from `useShopifyPage(handle)` and read them
via helpers in `services/shopify/pageMeta.js`.

```jsx
import { useShopifyPage } from '../hooks/useShopifyPage';
import { getMetafieldImage, getMetafieldImageList, getMetafieldMetaobjects } from '../services/shopify/pageMeta';

export const AboutPage = () => {
  const { page } = useShopifyPage('about-us');

  // Single image
  const hero = getMetafieldImage(page, 'hero') || FALLBACK_HERO_URL;

  // Ordered list of images (e.g. team_images)
  const teamImages = getMetafieldImageList(page, 'team_images');

  // Complex metaobjects (e.g. faq_groups, works_block)
  const faqGroups = getMetafieldMetaobjects(page, 'faq_groups');

  return <img src={hero} />;
};
```

## For a single `<img>` tag, use the drop-in component

```jsx
import ShopifyImage from '../components/ShopifyImage';

<ShopifyImage
  handle="delivery"
  metafieldKey="hero"
  fallback="/hardcoded-hero.jpg"
  alt="Delivery hero"
  style={{ borderRadius: 8 }}
/>
```

## Supported metafield keys per page

Declared server-side in `backend/shopify_service/queries.py > PAGE_METAFIELD_IDS`:

| Key            | Type                         | Purpose                            |
|----------------|------------------------------|------------------------------------|
| `hero`         | file_reference (MediaImage)  | Page hero image                    |
| `cta`          | json                         | Bottom-of-page call-to-action copy |
| `difference`   | multi_line_text              | "See the FoeGuard Difference" copy |
| `science`      | multi_line_text              | "Nature Nurtured by Science" copy  |
| `team_images`  | list.file_reference          | Ordered farm/team gallery          |
| `works_block`  | list.metaobject_reference    | "How it works" step tiles          |
| `how_it_ships` | list.metaobject_reference    | Shipping process steps             |
| `facts`        | list.metaobject_reference    | Numbered fact cards                |
| `zones`        | list.metaobject_reference    | Delivery zones                     |
| `storage_tips` | list.metaobject_reference    | Storage tips list                  |
| `faq_groups`   | list.metaobject_reference    | FAQ accordion sections             |

Add new keys by:
1. Declaring them in Shopify (Settings → Custom data → Pages).
2. Adding the `{ namespace: "foeguard", key: "<new_key>" }` entry to
   `PAGE_METAFIELD_IDS` in `queries.py`.
3. Reading them in the React page with `getMetafield*(page, "<new_key>")`.

## Automatic updates

Cache invalidation is automatic:

* Merchant edits a page in Shopify → Shopify sends `pages/update` webhook
  → backend HMAC-verifies and purges `BUCKET_PAGES` → next React fetch
  pulls the fresh metafield.
* Cache TTL fallback: **5 minutes** (`SHOPIFY_CACHE_TTL` in `.env`).
* Frontend session cache: cleared on page refresh (`useShopifyPage`
  keeps a per-tab `Map`).

## Product metafields

Product-level metafields (ingredients / nutritional_analysis /
feeding_guide / product_information / comparison_table / benefit_icons)
are already wired via `components/ProductMetafields.js`. Add new keys
to `queries.py > PRODUCT_FRAGMENT` and the frontend normalizer at
`services/shopify/normalizer.js`.
