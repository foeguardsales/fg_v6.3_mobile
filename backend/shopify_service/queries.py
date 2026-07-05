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
