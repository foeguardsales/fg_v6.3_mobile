"""Shared GraphQL fragments / queries.

Centralised so every service uses the same shape → no duplicate response
processing across pages, and future field additions happen in ONE place.
"""

# --- Fragments -------------------------------------------------------------

PRODUCT_CARD_FRAGMENT = """
fragment ProductCard on Product {
  id
  handle
  title
  descriptionHtml
  productType
  vendor
  tags
  availableForSale
  featuredImage { url altText width height }
  priceRange {
    minVariantPrice { amount currencyCode }
    maxVariantPrice { amount currencyCode }
  }
  compareAtPriceRange {
    minVariantPrice { amount currencyCode }
    maxVariantPrice { amount currencyCode }
  }
  options { id name values }
  metafields(identifiers: [
    {namespace: "foeguard", key: "product_ingredients_nutrition"},
    {namespace: "foeguard", key: "product_information"},
    {namespace: "foeguard", key: "product_mini_menu_descriptions"},
    {namespace: "foeguard", key: "product_page_icons_section"},
    {namespace: "foeguard", key: "product_type"},
    {namespace: "foeguard", key: "product_meal_plan_scores"},
    {namespace: "foeguard", key: "product_meal_feature_section"},
    {namespace: "foeguard", key: "product_faqs"},
    {namespace: "foeguard", key: "bundle_weight_lbs"}
  ]) {
    namespace
    key
    value
    type
    reference {
      ...MetaobjectExpanded
      ... on MediaImage { image { url altText width height } }
    }
    references(first: 25) {
      nodes {
        ...MetaobjectExpanded
        ... on MediaImage { image { url altText width height } }
      }
    }
  }
}

# Expand a metaobject one level deep, and any references INSIDE its fields a
# further level (needed e.g. for product_page_icons_section -> badge list).
fragment MetaobjectExpanded on Metaobject {
  id
  type
  handle
  fields {
    key
    value
    type
    reference {
      ... on Metaobject { id type handle fields { key value type } }
      ... on MediaImage { image { url altText width height } }
    }
    references(first: 15) {
      nodes {
        ... on Metaobject { id type handle fields { key value type } }
        ... on MediaImage { image { url altText width height } }
      }
    }
  }
}
"""

PRODUCT_FULL_FRAGMENT = PRODUCT_CARD_FRAGMENT + """
fragment ProductFull on Product {
  ...ProductCard
  images(first: 12) { nodes { url altText width height } }
  variants(first: 100) {
    nodes {
      id
      title
      sku
      availableForSale
      currentlyNotInStock
      requiresShipping
      selectedOptions { name value }
      image { url altText width height }
      price { amount currencyCode }
      compareAtPrice { amount currencyCode }
    }
  }
  seo { title description }
}
"""

COLLECTION_CARD_FRAGMENT = """
fragment CollectionCard on Collection {
  id
  handle
  title
  descriptionHtml
  image { url altText width height }
}
"""

CART_FRAGMENT = """
fragment CartFull on Cart {
  id
  checkoutUrl
  totalQuantity
  createdAt
  updatedAt
  buyerIdentity {
    email
    phone
    countryCode
    customer { id email firstName lastName }
  }
  cost {
    subtotalAmount { amount currencyCode }
    totalAmount { amount currencyCode }
    totalTaxAmount { amount currencyCode }
    totalDutyAmount { amount currencyCode }
  }
  discountCodes { code applicable }
  attributes { key value }
  lines(first: 100) {
    nodes {
      id
      quantity
      attributes { key value }
      cost {
        totalAmount { amount currencyCode }
        amountPerQuantity { amount currencyCode }
      }
      merchandise {
        ... on ProductVariant {
          id
          title
          sku
          availableForSale
          selectedOptions { name value }
          image { url altText }
          price { amount currencyCode }
          product { id handle title featuredImage { url altText } vendor productType }
        }
      }
    }
  }
}
"""

CUSTOMER_FRAGMENT = """
fragment CustomerFull on Customer {
  id
  firstName
  lastName
  email
  phone
  displayName
  acceptsMarketing
  createdAt
  defaultAddress {
    id
    address1
    address2
    city
    provinceCode
    countryCode
    zip
    phone
  }
  addresses(first: 20) {
    nodes {
      id
      address1
      address2
      city
      provinceCode
      countryCode
      zip
      phone
    }
  }
  orders(first: 20, sortKey: PROCESSED_AT, reverse: true) {
    nodes {
      id
      orderNumber
      processedAt
      financialStatus
      fulfillmentStatus
      currentTotalPrice { amount currencyCode }
      lineItems(first: 20) { nodes { title quantity } }
    }
  }
}
"""

USER_ERRORS_FRAGMENT = """
fragment UserErr on CustomerUserError { code field message }
fragment CartErr on CartUserError { code field message }
"""

# --- Full queries used by seo_service (kept here so all GraphQL lives together) --

STOREFRONT_SHOP_QUERY = """
query StorefrontShop {
  shop {
    name
    description
    primaryDomain { host url }
    brand {
      slogan
      shortDescription
      logo { image { url altText width height } }
      squareLogo { image { url altText width height } }
    }
  }
}
"""

PRODUCT_BY_HANDLE_QUERY = PRODUCT_FULL_FRAGMENT + """
query ProductByHandle($handle: String!) {
  product(handle: $handle) { ...ProductFull }
}
"""

PRODUCTS_LIST_QUERY = PRODUCT_CARD_FRAGMENT + """
query ProductsList($first: Int = 50, $after: String) {
  products(first: $first, after: $after) {
    pageInfo { hasNextPage endCursor }
    nodes { ...ProductCard updatedAt }
  }
}
"""

COLLECTIONS_LIST_QUERY = COLLECTION_CARD_FRAGMENT + """
query CollectionsList($first: Int = 50, $after: String) {
  collections(first: $first, after: $after) {
    pageInfo { hasNextPage endCursor }
    nodes { ...CollectionCard updatedAt }
  }
}
"""

COLLECTION_BY_HANDLE_QUERY = COLLECTION_CARD_FRAGMENT + PRODUCT_CARD_FRAGMENT + """
query CollectionByHandle($handle: String!, $first: Int = 24, $after: String) {
  collection(handle: $handle) {
    ...CollectionCard
    updatedAt
    seo { title description }
    products(first: $first, after: $after) {
      pageInfo { hasNextPage endCursor }
      nodes { ...ProductCard updatedAt }
    }
  }
}
"""
