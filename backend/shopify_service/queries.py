"""Shopify GraphQL query & mutation strings.

Grouped by domain. Fields chosen to keep responses small; extend as the
frontend needs more data. Some fields (e.g. ``totalInventory``,
``quantityAvailable``) require extra Storefront scopes and are
commented out until those scopes are granted.
"""

# ---------- Fragments -------------------------------------------------------

MONEY_FRAGMENT = """
fragment MoneyFields on MoneyV2 {
  amount
  currencyCode
}
"""

IMAGE_FRAGMENT = """
fragment ImageFields on Image {
  id
  url
  altText
  width
  height
}
"""

PRODUCT_FRAGMENT = (
    MONEY_FRAGMENT
    + IMAGE_FRAGMENT
    + """
fragment ProductFields on Product {
  id
  handle
  title
  description
  descriptionHtml
  productType
  vendor
  tags
  availableForSale
  onlineStoreUrl
  updatedAt
  publishedAt
  seo { title description }
  # totalInventory  # requires unauthenticated_read_product_inventory scope
  priceRange {
    minVariantPrice { ...MoneyFields }
    maxVariantPrice { ...MoneyFields }
  }
  featuredImage { ...ImageFields }
  images(first: 10) { nodes { ...ImageFields } }
  options { id name values }
  variants(first: 100) {
    nodes {
      id
      title
      sku
      availableForSale
      # quantityAvailable  # requires unauthenticated_read_product_inventory scope
      price { ...MoneyFields }
      compareAtPrice { ...MoneyFields }
      selectedOptions { name value }
      image { ...ImageFields }
    }
  }
  metafields(identifiers: [
    {namespace: "foeguard", key: "product_line"},
    {namespace: "foeguard", key: "protein_type"},
    {namespace: "foeguard", key: "highlights"},
    {namespace: "foeguard", key: "ingredients"},
    {namespace: "foeguard", key: "nutrition_facts"},
    {namespace: "foeguard", key: "feeding_guide"},
    {namespace: "foeguard", key: "product_information"},
    {namespace: "foeguard", key: "mini_description"},
    {namespace: "foeguard", key: "benefits"},
    {namespace: "foeguard", key: "quantity_description"},
    {namespace: "foeguard", key: "no_variants"}
  ]) {
    namespace
    key
    type
    value
  }
}
"""
)

CART_FRAGMENT = (
    MONEY_FRAGMENT
    + IMAGE_FRAGMENT
    + """
fragment CartFields on Cart {
  id
  checkoutUrl
  createdAt
  updatedAt
  totalQuantity
  cost {
    subtotalAmount { ...MoneyFields }
    totalAmount { ...MoneyFields }
    totalTaxAmount { ...MoneyFields }
    totalDutyAmount { ...MoneyFields }
  }
  buyerIdentity {
    email
    phone
    countryCode
    customer { id email }
  }
  lines(first: 100) {
    nodes {
      id
      quantity
      cost {
        subtotalAmount { ...MoneyFields }
        totalAmount { ...MoneyFields }
      }
      merchandise {
        ... on ProductVariant {
          id
          title
          sku
          availableForSale
          price { ...MoneyFields }
          image { ...ImageFields }
          product {
            id
            handle
            title
            featuredImage { ...ImageFields }
          }
          selectedOptions { name value }
        }
      }
      attributes { key value }
    }
  }
  attributes { key value }
  discountCodes { code applicable }
}
"""
)

CUSTOMER_FRAGMENT = """
fragment CustomerFields on Customer {
  id
  firstName
  lastName
  displayName
  email
  phone
  acceptsMarketing
  createdAt
  updatedAt
  numberOfOrders
  defaultAddress {
    id
    firstName
    lastName
    address1
    address2
    city
    province
    provinceCode
    country
    countryCodeV2
    zip
    phone
  }
  addresses(first: 20) {
    nodes {
      id
      firstName
      lastName
      address1
      address2
      city
      province
      provinceCode
      country
      countryCodeV2
      zip
      phone
    }
  }
  orders(first: 50, sortKey: PROCESSED_AT, reverse: true) {
    nodes {
      id
      orderNumber
      name
      processedAt
      financialStatus
      fulfillmentStatus
      statusUrl
      currentTotalPrice { amount currencyCode }
      totalPrice { amount currencyCode }
      subtotalPrice { amount currencyCode }
      totalShippingPrice { amount currencyCode }
      totalTax { amount currencyCode }
      shippingAddress {
        firstName lastName address1 address2 city province zip country phone
      }
      lineItems(first: 50) {
        nodes {
          title
          quantity
          variant {
            id
            title
            price { amount currencyCode }
            image { url altText }
            product { id handle title }
          }
        }
      }
    }
  }
}
"""

USER_ERROR_FRAGMENT = """
fragment UserErrorFields on CustomerUserError {
  code
  field
  message
}
"""

# ---------- Products & collections -----------------------------------------

PRODUCTS_LIST_QUERY = (
    PRODUCT_FRAGMENT
    + """
query Products($first: Int = 20, $after: String, $query: String) {
  products(first: $first, after: $after, query: $query) {
    pageInfo { hasNextPage endCursor }
    nodes { ...ProductFields }
  }
}
"""
)

PRODUCT_BY_HANDLE_QUERY = (
    PRODUCT_FRAGMENT
    + """
query ProductByHandle($handle: String!) {
  product(handle: $handle) { ...ProductFields }
}
"""
)

COLLECTIONS_LIST_QUERY = (
    IMAGE_FRAGMENT
    + """
query Collections($first: Int = 20, $after: String) {
  collections(first: $first, after: $after) {
    pageInfo { hasNextPage endCursor }
    nodes {
      id
      handle
      title
      description
      onlineStoreUrl
      updatedAt
      seo { title description }
      image { ...ImageFields }
    }
  }
}
"""
)

COLLECTION_BY_HANDLE_QUERY = (
    PRODUCT_FRAGMENT
    + """
query CollectionByHandle($handle: String!, $first: Int = 24, $after: String) {
  collection(handle: $handle) {
    id
    handle
    title
    description
    descriptionHtml
    onlineStoreUrl
    updatedAt
    seo { title description }
    image { url altText width height }
    products(first: $first, after: $after) {
      pageInfo { hasNextPage endCursor }
      nodes { ...ProductFields }
    }
  }
}
"""
)

# ---------- Cart -----------------------------------------------------------

CART_CREATE_MUTATION = (
    CART_FRAGMENT
    + """
mutation CartCreate($input: CartInput) {
  cartCreate(input: $input) {
    cart { ...CartFields }
    userErrors { code field message }
  }
}
"""
)

CART_QUERY = (
    CART_FRAGMENT
    + """
query CartById($id: ID!) {
  cart(id: $id) { ...CartFields }
}
"""
)

CART_LINES_ADD_MUTATION = (
    CART_FRAGMENT
    + """
mutation CartLinesAdd($cartId: ID!, $lines: [CartLineInput!]!) {
  cartLinesAdd(cartId: $cartId, lines: $lines) {
    cart { ...CartFields }
    userErrors { code field message }
  }
}
"""
)

CART_LINES_UPDATE_MUTATION = (
    CART_FRAGMENT
    + """
mutation CartLinesUpdate($cartId: ID!, $lines: [CartLineUpdateInput!]!) {
  cartLinesUpdate(cartId: $cartId, lines: $lines) {
    cart { ...CartFields }
    userErrors { code field message }
  }
}
"""
)

CART_LINES_REMOVE_MUTATION = (
    CART_FRAGMENT
    + """
mutation CartLinesRemove($cartId: ID!, $lineIds: [ID!]!) {
  cartLinesRemove(cartId: $cartId, lineIds: $lineIds) {
    cart { ...CartFields }
    userErrors { code field message }
  }
}
"""
)

CART_BUYER_IDENTITY_UPDATE_MUTATION = (
    CART_FRAGMENT
    + """
mutation CartBuyerIdentityUpdate($cartId: ID!, $buyerIdentity: CartBuyerIdentityInput!) {
  cartBuyerIdentityUpdate(cartId: $cartId, buyerIdentity: $buyerIdentity) {
    cart { ...CartFields }
    userErrors { code field message }
  }
}
"""
)

CART_DISCOUNT_CODES_UPDATE_MUTATION = (
    CART_FRAGMENT
    + """
mutation CartDiscountCodesUpdate($cartId: ID!, $discountCodes: [String!]) {
  cartDiscountCodesUpdate(cartId: $cartId, discountCodes: $discountCodes) {
    cart { ...CartFields }
    userErrors { code field message }
  }
}
"""
)

# ---------- Customer auth (Shopify official Storefront flow) --------------

CUSTOMER_ACCESS_TOKEN_CREATE_MUTATION = (
    USER_ERROR_FRAGMENT
    + """
mutation CustomerAccessTokenCreate($input: CustomerAccessTokenCreateInput!) {
  customerAccessTokenCreate(input: $input) {
    customerAccessToken { accessToken expiresAt }
    customerUserErrors { ...UserErrorFields }
  }
}
"""
)

CUSTOMER_ACCESS_TOKEN_DELETE_MUTATION = """
mutation CustomerAccessTokenDelete($customerAccessToken: String!) {
  customerAccessTokenDelete(customerAccessToken: $customerAccessToken) {
    deletedAccessToken
    deletedCustomerAccessTokenId
    userErrors { field message }
  }
}
"""

CUSTOMER_CREATE_MUTATION = (
    USER_ERROR_FRAGMENT
    + """
mutation CustomerCreate($input: CustomerCreateInput!) {
  customerCreate(input: $input) {
    customer { id email firstName lastName }
    customerUserErrors { ...UserErrorFields }
  }
}
"""
)

CUSTOMER_QUERY = (
    CUSTOMER_FRAGMENT
    + """
query CustomerByToken($customerAccessToken: String!) {
  customer(customerAccessToken: $customerAccessToken) { ...CustomerFields }
}
"""
)

CUSTOMER_RECOVER_MUTATION = (
    USER_ERROR_FRAGMENT
    + """
mutation CustomerRecover($email: String!) {
  customerRecover(email: $email) {
    customerUserErrors { ...UserErrorFields }
  }
}
"""
)

CUSTOMER_UPDATE_MUTATION = (
    USER_ERROR_FRAGMENT
    + CUSTOMER_FRAGMENT
    + """
mutation CustomerUpdate($customerAccessToken: String!, $customer: CustomerUpdateInput!) {
  customerUpdate(customerAccessToken: $customerAccessToken, customer: $customer) {
    customer { ...CustomerFields }
    customerUserErrors { ...UserErrorFields }
  }
}
"""
)

# ---------- Admin (server-only) -------------------------------------------

# Used by /health to confirm the Admin token is valid & report the shop.
ADMIN_SHOP_QUERY = """
query Shop {
  shop {
    id
    name
    email
    myshopifyDomain
    primaryDomain { host url }
    plan { displayName partnerDevelopment shopifyPlus }
    currencyCode
  }
}
"""

# ---------- Storefront Shop (for SEO / organization schema) ---------------

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
      colors { primary { background foreground } secondary { background foreground } }
    }
  }
}
"""
