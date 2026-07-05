# FoeGuard — SITE_STRUCTURE

Exact rendering order of every section on every page, plus the React
component hierarchy that renders it. Use this alongside
`CONTENT_MAP.md`.

All routes live under `frontend/src/App.js`; shared chrome components
live under `frontend/src/components/`.

---

## Global chrome (rendered on every route unless noted)

```
<HelmetProvider>
 └ <ShopifyAuthProvider>
    └ <CartProvider>
       └ <BrowserRouter>
          ├ <SeoHead endpoint="..." />         ← per-route
          ├ <Navbar />                          ← <Layout.Navbar>
          │  ├ AnnouncementBar
          │  ├ Logo (shop.brand.logo)
          │  ├ PrimaryNavItems (Nav: main-menu)
          │  └ IconRow (cart, account)
          ├ <Routes>...</Routes>                ← page bodies
          ├ <SlideCart />                       ← slide-in cart drawer
          └ <Footer />                          ← <Layout.Footer>
             ├ BrandColumn (shop.brand.*)
             ├ ShopColumn (Nav: footer-shop)
             ├ HelpColumn (Nav: footer-help)
             ├ CompanyColumn (Nav: footer-company)
             └ SocialLinks (metaobject list)
```

---

## 1. `/` — LandingPage.js

Render order:

```
<LandingPage>
 1  <ModernNavbar />                        // includes AnnouncementBar
 2  <SlideCart />
 3  <SeoHead endpoint="/api/seo/site/home" />

    <main>
 4    <HeroFullBleed />                     // metaobject: hero_slide
 5    <TrustMarquee />                      // metaobject list: press_logo
 6    <ShopFarmFreshCards />                // 4 collection cards
 7    <WhyFoeGuardRaw />                    // metaobject list: why_block
 8    <BenefitsIn2Weeks />                  // metaobject list: feature_card
 9    <ReviewsCarousel />                   // metaobject list: review
10    <ProteinOptionsGrid />                // metaobject list: protein_card
11    <AboutTeaser />                       // page: about (first paragraph)
12    <FaqAccordion />                      // metaobject list: faq_item
13    <FinalCta />                          // metaobject: cta_banner
    </main>

14  <Footer />
```

---

## 2. `/menu`, `/menu/comfort-dinner`, `/menu/primal-feast`, `/menu/treats` — BoxBuilder.js

```
<BoxBuilder>
 1  <Navbar />
 2  <SlideCart />
 3  <SeoHead endpoint="/api/seo/collection/<active>" />

    <SelectionBreadcrumb />                 // client-only (session state)
 4  <MenuCategoryHero>
      <HeroBackgroundImage />               // collection metafield: hero_image
      <MenuCategoryTabs />                  // metaobject list: menu_tab
      <FeedingCalculatorLink />
    </MenuCategoryHero>

    {activeTab === 'dog-food' && (
      <>
 5      <ProductGrid collection="comfort-dinner" />
 6      <ProductGrid collection="primal-feast" />        // if exists
 7      <BulkDiscountTiers />                            // metaobject list: discount_tier
 8      <ProductGrid collection="monthly-bundles" />
      </>
    )}

    {activeTab === 'dog-treats' && (
 9    <TreatsSection collection="meaty-bone-treats" />
    )}

    {activeTab === 'cat-food' && (
10    <ProductGrid collection="royal-paws-cat-food" />
    )}

    {activeTab === 'cat-treats' && (
11    <CatTreatsSection collection="cat-treats" />
    )}

12  <ProductDetailModal />                  // opened on-demand
13  <TreatDetailModal />                    // opened on-demand
14  <FeedingCalculator />                   // opened on-demand
15  <FloatingCartBar />                     // client-only
16  <Footer />
</BoxBuilder>
```

---

## 3. `/product/:productId` — ProductDetail.js  (`ProductDetailPage`)

```
<ProductDetailPage>
 1  <SeoHead endpoint="/api/seo/product/<handle>" />
 2  <Navbar />
 3  <SlideCart />

    <main data-testid="pdp">
 4    <BackButton />                        // client-only

      <div className="pd-shopify-layout">
 5      <ProductGallery />                  // Product.images + featuredImage

        <aside className="pd-shopify-right">
 6        <CollectionSubtitle />            // Product.collections[0].title
 7        <ProductTitle />                  // Product.title
 8        <PriceBlock />                    // Product.priceRange
 9        <ShortDescription />              // Product.description
10        <FeatureList />                   // metafield: foeguard.feature_list (metaobject_reference) OR foeguard.highlights (list)
11        <VariantSelector />               // Product.options + variants
12        <QuantityStepper />               // client-only
13        <TrustBadgesRow />                // shop metaobject: pdp_trust_badges
        </aside>
      </div>

14    <Collapsibles>
        <CollapsibleSection title="Ingredients" defaultOpen />
                                              // metafield: foeguard.ingredients
        <CollapsibleSection title="Nutritional Analysis" />
                                              // metafield: foeguard.nutrition_facts (JSON)
        <CollapsibleSection title="Product Information" />
                                              // metafield: foeguard.product_information
        <CollapsibleSection title="Feeding Guide" />
                                              // metafield: foeguard.feeding_guide (JSON)
        <NotesBlockAlwaysOpen />              // client-only static
      </Collapsibles>

15    <FarmToBowlTimeline />                // shop metafield: farm_to_bowl (list → timeline_step)
16    <PersonalizeCTA />                    // shop metafield: pdp_personalize_cta (metaobject_reference)
17    <ProductFaq />                        // product.foeguard.faq or shop.pdp_default_faq

18    <FloatingAddToCartBar />              // client-only
    </main>

19  <Footer />
</ProductDetailPage>
```

An `embedded` prop hides `Navbar`, `Footer`, `BackButton`, and
`SeoHead` when the same component is rendered inside
`<ProductDetailModal />` on the menu page.

---

## 4. `/treat/:treatId` — TreatDetail.js  (`TreatDetailPage`)

Same skeleton as PDP, minus sections 15–17. Renders `benefits` and
`quantity_description` metafields immediately below the short
description.

---

## 5. `/about` — AboutPage.js

```
<AboutPage>
 1  <SeoHead endpoint="/api/seo/page/about" />
 2  <Navbar />

    <main>
 3    <AboutHero />                     // page.foeguard.hero (metaobject)
 4    <OurStory />                      // Page.body
 5    <TeamImagesGrid />                // page.foeguard.team_images (list.file_reference)
 6    <FoeGuardDifference />            // page.foeguard.difference (metaobject text_block)
 7    <NatureNurturedByScience />       // page.foeguard.science (metaobject text_block)
 8    <Our8ProteinsGrid />              // shop.foeguard.proteins (shared)
 9    <FinalCta />                      // page.foeguard.cta (metaobject cta_banner)
    </main>

10  <Footer />
</AboutPage>
```

---

## 6. `/new-to-raw` — NewToRawPage.js

```
<NewToRawPage>
 1  <SeoHead endpoint="/api/seo/page/new-to-raw" />
 2  <Navbar />
 3    <Hero />                          // page.foeguard.hero
 4    <IntroParagraph />                // Page.body (first block)
 5    <BenefitsGrid12 />                // shop.foeguard.benefits_grid (list → feature_card)
 6    <ComparisonChart />               // shop.foeguard.raw_comparison (list → comparison_row)
 7    <FindWhatWorks />                 // page.foeguard.works_block (metaobject text_block)
 8    <FinalCta />                      // page.foeguard.cta
 9  <Footer />
</NewToRawPage>
```

---

## 7. `/delivery` — DeliveryPage.js

```
<DeliveryPage>
 1 <SeoHead endpoint="/api/seo/page/delivery" />
 2 <Navbar />
 3 <Hero />                             // page.foeguard.hero
 4 <HowItShips />                       // page.foeguard.how_it_ships
 5 <TheFactsGrid />                     // page.foeguard.facts (list → feature_card)
 6 <DeliveryZones />                    // page.foeguard.zones (list → delivery_zone)
 7 <StorageTips />                      // page.foeguard.storage_tips
 8 <FinalCta />                         // page.foeguard.cta
 9 <Footer />
</DeliveryPage>
```

---

## 8. `/faq` — FaqPage.js

```
<FaqPage>
 1 <SeoHead endpoint="/api/seo/page/faq" />
 2 <Navbar />
 3 <Hero />                             // page.foeguard.hero
 4 <FaqGroups>
     <FaqGroup />                       // metaobject: faq_group (contains faq_items)
     ...
   </FaqGroups>
 5 <Footer />
</FaqPage>
```

---

## 9. `/contact` — ContactPage.js

```
<ContactPage>
 1 <SeoHead endpoint="/api/seo/page/contact" />
 2 <Navbar />
 3 <Header />                           // Page.title + Page.body
 4 <ContactDetails />                   // shop.foeguard.contact_details
 5 <ContactForm />                      // client-only
 6 <SuccessScreen />                    // client-only
 7 <Footer />
</ContactPage>
```

---

## 10. `/policies`, `/terms` — PoliciesPage.js, TermsPage.js

```
<PoliciesPage> / <TermsPage>
 1 <Navbar />
 2 <SeoHead endpoint="/api/seo/page/<handle>" />
 3 <Sections>
     // native Shopify shop.privacyPolicy.body,
     //             shop.refundPolicy.body,
     //             shop.shippingPolicy.body,
     //             shop.termsOfService.body,
     //             shop.subscriptionPolicy.body
   </Sections>
 4 <Footer />
</PoliciesPage>
```

---

## 11. `/blog`, `/blog/:blogId` — BlogPage.js

```
<BlogListPage>
 1 <SeoHead endpoint="/api/seo/page/blog" />
 2 <Navbar />
 3 <BlogHero />                         // Blog.image / metafield
 4 <ArticleGrid />                      // Blog.articles
 5 <Footer />
</BlogListPage>

<BlogDetailPage>
 1 <SeoHead endpoint="/api/seo/article/<blog>/<article>" />
 2 <Navbar />
 3 <ArticleHeader />                    // Article.title, Article.image, Article.publishedAt, Article.authorV2
 4 <ArticleBody />                      // Article.contentHtml
 5 <ArticleTags />                      // Article.tags
 6 <Footer />
</BlogDetailPage>
```

---

## 12. `/calculator`, `/meal-plan` — CalculatorPage.js, MealPlanPage.js

```
<CalculatorPage>
 1 <Navbar /> + <SeoHead />
 2 <IntroBlock />                       // shop.foeguard.mealplan_intro (metaobject text_block)
 3 <FeedingCalculator />                // client-only inputs
 4 <RecommendedProducts />              // dynamic query result
 5 <Footer />
</CalculatorPage>
```

---

## 13. `/account` — AccountPage.js

```
<AccountPage>
 1 <Navbar /> + <SeoHead />

   if (!isAuthenticated)
 2   <AuthSection>
       <LoginForm />                    // customerAccessTokenCreate
       <RegisterForm />                 // customerCreate + auto-login
       <RecoverForm />                  // customerRecover
     </AuthSection>

   if (isAuthenticated)
 3   <WelcomeHeader />                  // Customer.firstName / lastName
 4   <ProfileSection />                 // customer.foeguard.pet_profile
 5   <AddressesSection />               // Customer.defaultAddress + Customer.addresses
 6   <OrdersList>
       <OrderCard />                    // Customer.orders → Order fields
       ...
     </OrdersList>
 7   <OrderNowCta />

 8 <Footer />
</AccountPage>
```

---

## 14. `/checkout` — CheckoutPage.js  (LEGACY — use Shopify hosted checkout instead)

```
<CheckoutPage>
 1 <Header />
 2 <OrderSummary />                     // client cart
 3 <DeliveryInfoForm />                 // client
 4 <PaymentForm />                      // Stripe Elements (legacy)
 5 <SubmitButton />
</CheckoutPage>
```

> New sessions should use `useCart().checkoutViaShopify()` which
> redirects to `cart.checkoutUrl` (Shopify hosted checkout).

---

## 15. `/admin`, `/admin/login` — internal, out of scope for Shopify content

---

## Cross-page component hierarchy summary

```
components/
├ Layout.js                (Navbar, Footer)
├ CartAndCheckout.js       (CartDrawer, TreatsSection, CatTreatsSection, CheckoutForm, OrderSuccess)
├ BoxComponents.js         (BoxCard, MonthlyBundleCard)
├ ProductSelector.js       (VariantRadios, SizeSelector)
├ FeedingCalculator.js     (modal)
├ OrderHistory.js          (legacy)
├ SeoHead.js               (react-helmet-async wrapper)
├ AuthForms.js             (legacy - superseded by account/AuthSection)
├ account/
│  ├ AuthSection.js        (login / register / recover)
│  ├ OrdersList.js         (professional order cards)
│  └ SubscriptionManager.js
├ admin/                   (internal)
└ ui/                      (design-system primitives)

contexts/
├ ShopifyAuthContext.js    (Shopify customerAccessToken flow)
└ CartContext.js           (Shopify Cart API sync + <SlideCart>)

services/
├ api.js                   (authService, orderService — Shopify-backed)
└ shopify/
   ├ client.js              (axios to /api/shopify/*)
   ├ products.js
   ├ collections.js
   ├ cart.js
   ├ customers.js
   ├ checkout.js
   ├ catalog.js             (legacy-compatible facade)
   └ normalizer.js          (Shopify → legacy UI shape)

lib/
└ useAuth.js               (thin proxy to ShopifyAuthContext)
```
