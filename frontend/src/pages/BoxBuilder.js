import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useNavigate, useSearchParams, useLocation } from 'react-router-dom';
import { Navbar, Footer } from '../components/Layout';
import { TreatsSection, CheckoutForm, OrderSuccess, CatTreatsSection } from '../components/CartAndCheckout';
import { Calculator, Wheat, PawPrint, X, ChevronDown, ChevronUp, Tag } from 'lucide-react';
import { ProductDetailModal } from './ProductDetail';
import { TreatDetailModal } from './TreatDetail';
import { FeedingCalculator } from '../components/FeedingCalculator';
import { useCart } from '../contexts/CartContext';
import { metaobjects, collections as shopifyCollections, catalog as shopifyCatalog } from '../services/shopify';
import { computeTierLbs, isMonthlyBundle } from '../utils/cartTier';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

// Bulk discount tiers keyed by the TOTAL lbs of meals in the basket
// One unified tier scheme across all pet types — dog + cat meals are pooled.
const DOG_DISCOUNT_RATES = {
  0: 0,
  12: 0.05,
  24: 0.10,
  36: 0.15
};

// CAT now uses the same 3-tier scheme as DOG (mix-and-match allowed)
const CAT_DISCOUNT_RATES = {
  0: 0,
  12: 0.05,
  24: 0.10,
  36: 0.15
};

// Stock-up-&-save guide rows (informational only — not a selection) - DOG
const DOG_TIER_GUIDE = [
  { size: 12, discount: 5 },
  { size: 24, discount: 10 },
  { size: 36, discount: 15 }
];

// CAT guide rows now mirror DOG (same 3 tiers)
const CAT_TIER_GUIDE = [
  { size: 12, discount: 5 },
  { size: 24, discount: 10 },
  { size: 36, discount: 15 }
];

// Determine the discount tier from the ACTUAL total lbs of meals in the basket.
const getTierFromLbs = (lbs, rates) => {
  const sizes = Object.keys(rates).map(Number).sort((a, b) => a - b);
  let chosen = { size: sizes[0], rate: rates[sizes[0]] };
  sizes.forEach(s => { if (lbs >= s) chosen = { size: s, rate: rates[s] }; });
  return chosen;
};

// Next tier above the current lbs — drives the "add N lb more for X% off" nudge
const getNextTier = (lbs, rates) => {
  const sizes = Object.keys(rates).map(Number).sort((a, b) => a - b);
  for (let i = 0; i < sizes.length; i++) {
    const s = sizes[i];
    if (lbs < s && rates[s] > 0) return { size: s, rate: rates[s] };
  }
  return null;
};

// Collection banner images
const COLLECTION_IMAGES = {
  dog: 'https://customer-assets.emergentagent.com/job_c26be434-5664-4617-995c-8c836934bef5/artifacts/1olxgtz6_3.png',
  cat: 'https://customer-assets.emergentagent.com/job_c26be434-5664-4617-995c-8c836934bef5/artifacts/7fyd6l6l_4.png',
  comfort_dinner: 'https://customer-assets.emergentagent.com/job_c26be434-5664-4617-995c-8c836934bef5/artifacts/a5bhlhqi_5.png',
  primal_feast: 'https://customer-assets.emergentagent.com/job_c26be434-5664-4617-995c-8c836934bef5/artifacts/wtts10dz_4.png',
  royal_paws: 'https://customer-assets.emergentagent.com/job_c26be434-5664-4617-995c-8c836934bef5/artifacts/u0taocl0_6.png'
};

// Single static menu hero (never changes while browsing) + the sticky
// on-page section tabs that smooth-scroll to Meals / Treats / Monthly Bundles.
const MENU_HERO = {
  title: 'Raw Food Menu',
  desc: 'Browse fresh meals, treats and bundles for dogs and cats.',
  image: COLLECTION_IMAGES.dog,
};

const SECTION_TABS = [
  { id: 'meals', label: 'Dog Meals' },
  { id: 'treats', label: 'Treats' },
  { id: 'bundles', label: 'Monthly Bundles' },
  { id: 'cat-meals', label: 'Cat Meals' },
];

export const BoxBuilder = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const location = useLocation();
  const [petType, setPetType] = useState('dog'); // 'dog' or 'cat'

  // Prompt 5: highlight recommended proteins for a specific dog (from a
  // Plan Bar state — reads all saved pet plans (dogs[]) from localStorage.
  // - petSnap: full snapshot { dogs: [...] } or null
  // - currentPetIdx: which dog is currently highlighted (URL ?plan=N)
  // The plan bar renders only when petSnap.dogs has at least one entry.
  const planIndex = searchParams.get('plan');   // '0', '1', ...
  const [petSnap, setPetSnap] = useState(null);
  const [recommendedProteins, setRecommendedProteins] = useState(null); // Set of protein_type strings
  useEffect(() => {
    let snap = null;
    try {
      snap = JSON.parse(
        localStorage.getItem('foeguard_pet_profile') ||
        sessionStorage.getItem('foeguard_pet_profile') ||
        'null'
      );
    } catch (_) { snap = null; }
    setPetSnap(snap && Array.isArray(snap.dogs) && snap.dogs.length ? snap : null);
    if (planIndex === null) { setRecommendedProteins(null); return; }
    const idx = parseInt(planIndex, 10) || 0;
    const dog = snap?.dogs?.[idx];
    const top = dog?.recommendations?.top_proteins || [];
    // Map algorithm protein names → product protein_type keys used on the menu.
    const proteinMap = {
      'Beef': 'beef', 'Chicken': 'chicken', 'Duck': 'duck',
      'Wild-Caught Fish': 'fish', 'Goat': 'goat', 'Lamb': 'lamb',
      'Rabbit': 'rabbit', 'Turkey': 'turkey',
    };
    const set = new Set(top.map(t => proteinMap[t.protein]).filter(Boolean));
    setRecommendedProteins(set.size ? set : null);
  }, [planIndex]);
  // Current pet from dropdown (defaults to 0 if a snap exists but no ?plan param)
  const currentPetIdx = (() => {
    if (!petSnap) return null;
    if (planIndex === null) return null; // menu default = blank, no bar unless plan explicitly loaded
    const n = parseInt(planIndex, 10);
    return Number.isFinite(n) && n >= 0 && n < petSnap.dogs.length ? n : 0;
  })();

  // Mini top-sheet (legacy, no longer used)
  const [topSheetOpen, setTopSheetOpen] = useState(false);
  const [topSheetSeen, setTopSheetSeen] = useState(false);

  // Funnel overlay — the pre-menu "How would you like to order?" page.
  // Shown ONLY when a navigation explicitly requests it via location.state.funnel === true
  // (e.g. the hero "Shop Now"). Every other /menu entry (browse CTAs, product back, etc.)
  // lands on the menu content, and the browser Back button returns to the funnel entry.
  const initialSelection = sessionStorage.getItem('foeguard_selection') || null;
  const [funnelOpen, setFunnelOpen] = useState(location.state?.funnel === true);
  const [selectionId, setSelectionId] = useState(initialSelection || 'shop-raw');

  // Inline product modal state — replaces /product/:id navigation
  const [activeProductId, setActiveProductId] = useState(null);

  // Inline treat modal state — replaces /treat/:id navigation
  const [activeTreatId, setActiveTreatId] = useState(null);

  // No more "boxes" — selectedProteins IS the running basket of meals and the
  // bulk discount is derived live from the total lbs of meals selected.
  // Cart open state lives in the shared CartContext (single universal cart).
  const { setIsCartOpen } = useCart();
  const openBasket = () => setIsCartOpen(true);

  // Inline calculator modal state — replaces /calculator navigation
  const [calcOpen, setCalcOpen] = useState(false);
  
  // Load from sessionStorage on mount
  const initialBoxSize = 36;
  const initialProteins = JSON.parse(localStorage.getItem('selectedProteins') || '{}');
  const initialTreats = JSON.parse(localStorage.getItem('selectedTreats') || '[]');
  
  const [boxSize, setBoxSize] = useState(initialBoxSize);
  const [products, setProducts] = useState([]);
  const [treats, setTreats] = useState([]);
  const [selectedProteins, setSelectedProteins] = useState(initialProteins);
  const [selectedTreats, setSelectedTreats] = useState(initialTreats);
  const [orderComplete, setOrderComplete] = useState(false);
  const [showCheckout, setShowCheckout] = useState(false);
  const [loading, setLoading] = useState(true);
  const [subscriptionPlan, setSubscriptionPlan] = useState(null); // null or 'every_N_weeks'
  const [subOpen, setSubOpen] = useState(false); // collapsible toggle

  // Prompt 2 — AUTO TIER SHIFT: whenever total lbs crosses a discount-tier
  // boundary (6 / 12 / 24 / 36), snap boxSize to the correct tier so pricing
  // + progress bar reflect real-time. Works both directions (scale up + down).
  const currentTotalLbs = Object.values(selectedProteins || {}).reduce((s, d) => s + (Number(d?.qty) || 0), 0);
  useEffect(() => {
    if (currentTotalLbs <= 0) return;                    // don't shift on empty box
    const correctTier =
      currentTotalLbs > 24 ? 36 :
      currentTotalLbs > 12 ? 24 :
      currentTotalLbs > 6  ? 12 : 6;
    if (correctTier !== boxSize) setBoxSize(correctTier);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentTotalLbs]);

  // Restore menu scroll position on mount + save on scroll (both window + #root, since App may use either)
  useEffect(() => {
    const getScroller = () => document.getElementById('root') || document.scrollingElement || document.documentElement;
    const savedY = parseInt(sessionStorage.getItem('menu_scroll_y') || '0', 10);
    if (savedY > 0) {
      const restore = () => {
        const el = getScroller();
        if (el) el.scrollTop = savedY;
        window.scrollTo({ top: savedY, left: 0, behavior: 'auto' });
      };
      setTimeout(restore, 0);
      setTimeout(restore, 150);
      setTimeout(restore, 400);
    }
    const onScroll = () => {
      const el = getScroller();
      const y = (el && el.scrollTop) || window.scrollY || window.pageYOffset || 0;
      sessionStorage.setItem('menu_scroll_y', String(y));
    };
    const root = document.getElementById('root');
    if (root) root.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      if (root) root.removeEventListener('scroll', onScroll);
      window.removeEventListener('scroll', onScroll);
    };
  }, []);

  // Restore scroll position when the product/treat modal closes (so user returns to where they left off)
  useEffect(() => {
    if (activeProductId === null && activeTreatId === null) {
      const savedY = parseInt(sessionStorage.getItem('menu_scroll_y') || '0', 10);
      if (savedY > 0) {
        const restore = () => {
          const el = document.getElementById('root') || document.scrollingElement || document.documentElement;
          if (el) el.scrollTop = savedY;
          window.scrollTo({ top: savedY, left: 0, behavior: 'auto' });
        };
        setTimeout(restore, 0);
        setTimeout(restore, 50);
        setTimeout(restore, 200);
      }
    }
  }, [activeProductId, activeTreatId]);

  // Get current discount rates and tier guide based on pet type
  const DISCOUNT_RATES = petType === 'cat' ? CAT_DISCOUNT_RATES : DOG_DISCOUNT_RATES;
  const TIER_GUIDE = petType === 'cat' ? CAT_TIER_GUIDE : DOG_TIER_GUIDE;

  // Check URL parameters on mount to restore state after refresh
  useEffect(() => {
    const step = searchParams.get('step');
    if (step === 'checkout') {
      setShowCheckout(true);
    } else if (step === 'success') {
      setOrderComplete(true);
    }
  }, []);

  // Sync funnel visibility from the current history entry so Back / Forward / swipe
  // gestures return the user to exactly the page (funnel vs. menu content) they were on.
  useEffect(() => {
    const sel = sessionStorage.getItem('foeguard_selection');
    const cameFromPlan = searchParams.get('plan') !== null || searchParams.get('multi') !== null;
    if (cameFromPlan && !sel) sessionStorage.setItem('foeguard_selection', 'shop-raw');
    setFunnelOpen(location.state?.funnel === true);
    const current = sessionStorage.getItem('foeguard_selection');
    if (current) setSelectionId(current);
  }, [location.key]);

  // Live unison: when the product sheet edits the box, re-read it so the menu stays in sync.
  useEffect(() => {
    const sync = () => {
      setSelectedProteins(JSON.parse(localStorage.getItem('selectedProteins') || '{}'));
      setSelectedTreats(JSON.parse(localStorage.getItem('selectedTreats') || '[]'));
    };
    window.addEventListener('foeguard:box-updated', sync);
    return () => window.removeEventListener('foeguard:box-updated', sync);
  }, []);


  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        // Menu grid loads MEALS straight from Shopify so cards use Shopify
        // handles + CDN images directly (no local Mongo twin lookup). Monthly
        // bundles are rendered from their dedicated collection below, so we
        // exclude them here to avoid double-rendering. Treats keep their own
        // section/component. getAllProducts() transparently falls back to the
        // local catalog if Shopify is ever unavailable.
        const [allMeals, treatsRes] = await Promise.all([
          shopifyCatalog.getAllProducts(),
          axios.get(`${API}/treats`).catch(() => ({ data: [] }))
        ]);
        setProducts((allMeals || []).filter(p => !isMonthlyBundle(p)));
        setTreats(treatsRes.data);
      } catch (error) {
        console.error('Failed to load data:', error);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []); // load once — products/treats don't change with pet type anymore

  // --------- Shopify-driven content (mini descriptions, collections, bundles) --
  // Merchants edit these in Shopify admin; frontend re-fetches on mount and
  // falls back to hardcoded copy when a metaobject/collection is missing.
  const [menuDescMap, setMenuDescMap] = useState({});         // handle → { title, description }
  const [shopifyCollectionsMap, setShopifyCollectionsMap] = useState({}); // handle → { title, description, image_url }
  const [bundleProducts, setBundleProducts] = useState([]);   // normalised Shopify products for Monthly Bundles

  useEffect(() => {
    let alive = true;

    // 1. Menu-page mini descriptions — one container metaobject referencing every product's mini description.
    metaobjects.getMetaobject('page_menu_mini_descriptions', 'page-menu-mini-descriptions')
      .then((mo) => {
        if (!alive || !mo) return;
        const list = mo.fields?.all_mini_menu_descriptions || [];
        const map = {};
        for (const entry of (Array.isArray(list) ? list : [list])) {
          if (!entry || !entry.handle) continue;
          map[entry.handle] = {
            title: entry.fields?.product_title || null,
            description: entry.fields?.product_description || null,
          };
        }
        setMenuDescMap(map);
      });

    // 2. Category hero (image / title / description) sourced from Shopify collections.
    const collectionHandles = [
      'raw-dog-food', 'raw-dog-treats',
      'raw-cat-food', 'raw-cat-treats',
      'monthly-bundles-raw-dog-food',
    ];
    Promise.all(collectionHandles.map((h) =>
      shopifyCollections.getCollection(h, { productsFirst: 30 }).catch(() => null)
    )).then((results) => {
      if (!alive) return;
      const map = {};
      const bundles = [];
      results.forEach((c, i) => {
        const handle = collectionHandles[i];
        if (!c) return;
        // Shopify Storefront `description` sometimes returns wrapped HTML fragments
        // (`<p>...</p>`). Strip tags so the hero renders as plain text.
        const rawDesc = c.description || c.descriptionHtml || '';
        const cleanDesc = String(rawDesc).replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim();
        map[handle] = {
          title: c.title,
          description: cleanDesc || null,
          image_url: c.image?.url || null,
        };
        // Extract Monthly Bundle products and normalise to the shape ProductCardRow expects.
        if (handle === 'monthly-bundles-raw-dog-food') {
          const nodes = (c.products?.nodes) || [];
          for (const p of nodes) {
            const priceAmount = parseFloat(p.priceRange?.minVariantPrice?.amount || '0');
            // Derive bundle_weight_lbs from the title (e.g. "Monthly Bundle Giant Breed - 60 lb").
            // When the merchant publishes a `foeguard.bundle_weight_lbs` metafield later,
            // it will come through the shared normaliser instead of this local synthesiser.
            const titleWeightMatch = String(p.title || '').match(/-\s*(\d+(?:\.\d+)?)\s*lb/i);
            const bundleWeightLbs = titleWeightMatch ? parseFloat(titleWeightMatch[1]) : 0;
            bundles.push({
              product_id: p.handle,               // reuse handle as internal id
              handle: p.handle,
              product_line: 'monthly_bundle',     // marker used by discount code / cart if needed
              protein_type: null,
              name: p.title,
              mini_description: null,             // filled in from menu_descriptions below
              description: p.description || '',
              highlights: [],
              // Cards expect a pricing array [{size_lb, price}]. Monthly bundles are flat-price
              // per-lb-equivalent — we synthesise a single entry so getBasePrice() finds one.
              pricing: [{ size_lb: 6, price: priceAmount, base_price: priceAmount }],
              inventory_status: 'in_stock',
              image_url: p.featuredImage?.url || null,
              shopify_variant_id: p.variants?.nodes?.[0]?.id || null,
              // Bundles never expose a per-lb qty stepper on the menu grid — clicking
              // "+" opens the product page so the shopper picks a size / configures it.
              has_variants: true,
              is_bundle: true,
              // Fixed weight of this bundle (contributes to the meal-tier threshold
              // in the cart, but the bundle itself keeps its flat price).
              bundle_weight_lbs: bundleWeightLbs,
            });
          }
        }
      });
      setShopifyCollectionsMap(map);
      setBundleProducts(bundles);
    });

    return () => { alive = false; };
  }, []);

  // Derive the Shopify metaobject handle for a Mongo product so we can pull
  // its Shopify-managed title/description. Pattern:
  //   product_line=comfort_dinner, protein_type=chicken → "comfort-dinner-chicken"
  const deriveShopifyHandle = (p) => {
    if (!p) return null;
    if (p.handle) return p.handle;
    const line = (p.product_line || '').replace(/_/g, '-');
    const protein = (p.protein_type || '').replace(/_/g, '-');
    if (!line) return null;
    return protein ? `${line}-${protein}` : line;
  };

  // Return a product decorated with Shopify-managed name/description when available.
  // Card rendering keeps its exact JSX + CSS; we just swap the two text fields.
  const withMenuCopy = (p) => {
    if (!p) return p;
    const handle = deriveShopifyHandle(p);
    const swap = handle && menuDescMap[handle];
    if (!swap) return p;
    return {
      ...p,
      name: swap.title || p.name,
      mini_description: swap.description || p.mini_description,
    };
  };

  // Restore scroll position after loading completes
  useEffect(() => {
    if (!loading && products.length > 0) {
      const savedPosition = sessionStorage.getItem('menuScrollPosition');
      if (savedPosition) {
        const scrollTo = parseInt(savedPosition, 10);
        const root = document.getElementById('root');
        // Use requestAnimationFrame to ensure DOM is painted
        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            if (root) {
              root.scrollTop = scrollTo;
            }
            window.scrollTo(0, scrollTo);
            document.documentElement.scrollTop = scrollTo;
            sessionStorage.removeItem('menuScrollPosition');
          });
        });
      }
      
      // Sync all cart state from sessionStorage when returning to menu
      const savedBoxSize = parseInt(sessionStorage.getItem('boxSize'));
      const savedProteins = JSON.parse(localStorage.getItem('selectedProteins') || '{}');
      const savedTreats = JSON.parse(localStorage.getItem('selectedTreats') || '[]');
      
      // Only restore a saved box size when the basket actually has meals — an empty
      // menu must always start on the default 36 lb tier (lowest per-lb price shown first).
      if (savedBoxSize && savedBoxSize !== boxSize && Object.keys(savedProteins).length > 0) {
        setBoxSize(savedBoxSize);
      }
      
      // Update selectedProteins if different
      const currentProteinsStr = JSON.stringify(selectedProteins);
      const savedProteinsStr = JSON.stringify(savedProteins);
      if (currentProteinsStr !== savedProteinsStr) {
        setSelectedProteins(savedProteins);
      }
      
      // Update selectedTreats if different
      const currentTreatsStr = JSON.stringify(selectedTreats);
      const savedTreatsStr = JSON.stringify(savedTreats);
      if (currentTreatsStr !== savedTreatsStr) {
        setSelectedTreats(savedTreats);
      }
      
      // Check if there's a product to add from product detail page
      const addToBox = sessionStorage.getItem('addToBox');
      if (addToBox) {
        const productData = JSON.parse(addToBox);
        setSelectedProteins(prev => ({
          ...prev,
          [productData.product_id]: {
            name: productData.name,
            qty: productData.qty
          }
        }));
        sessionStorage.removeItem('addToBox');
      }
      
      // Check if there's a treat to add from treat detail page
      const addTreatToBox = sessionStorage.getItem('addTreatToBox');
      if (addTreatToBox) {
        const treatData = JSON.parse(addTreatToBox);
        setSelectedTreats(prev => {
          const existing = prev.find(t => t.treat_id === treatData.treat_id);
          if (existing) {
            return prev.map(t => t.treat_id === treatData.treat_id 
              ? { ...t, quantity: (t.quantity || 1) + treatData.quantity }
              : t
            );
          } else {
            return [...prev, { 
              treat_id: treatData.treat_id, 
              name: treatData.name, 
              price: treatData.price, 
              quantity: treatData.quantity 
            }];
          }
        });
        sessionStorage.removeItem('addTreatToBox');
      }
    }
  }, [loading, products.length]);

  // Reset selections when pet type changes
  const handlePetTypeChange = (newPetType) => {
    setPetType(newPetType);
    // Remember the current menu pet view so ProductDetail can attribute primal_feast properly
    sessionStorage.setItem('foeguard_menu_pet', newPetType);
    // Cart persists across pet types — discount tiers apply to combined meal lbs.
    // Default box size (36 lb — the lowest per-lb tier so shoppers see the best price first)
    setBoxSize(36);
  };

  // Smooth-scroll to an on-page section (Meals / Treats / Monthly Bundles).
  // Scrolls the #root scroller; CSS scroll-margin-top offsets the sticky tabs.
  const scrollToSection = (id) => {
    const el = document.getElementById(`menu-section-${id}`);
    if (el && el.scrollIntoView) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const topNavTabs = [
    { id: 'menu', label: 'Raw Food Menu', path: '/menu', active: true },
    { id: 'meal-plan', label: 'Build Your Meal Plan', path: '/meal-plan', active: false },
    { id: 'calculator', label: 'Feeding Calculator', path: '/calculator', active: false }
  ];

  // Determine a product's pet bucket for discount-tier accounting.
  // comfort_dinner → dog only; royal_paws → cat only; primal_feast can live in either basket
  // (we tag it with the user's active view at the time it's added).
  const productPetBucket = (product, fallback = petType) => {
    if (!product) return fallback;
    if (product.product_line === 'comfort_dinner') return 'dog';
    if (product.product_line === 'royal_paws') return 'cat';
    return fallback;
  };

  // Calculate price for 6lb based on the discount tier reached by total lbs IN THIS PET BUCKET.
  // Bundles are FIXED-PRICE (Monthly Bundles collection) — their weight still
  // contributes to the tier threshold but the tier RATE is never applied to
  // their price. Non-bundle meals get the standard `basePrice * (1 - rate)`.
  const getDiscountedPrice = (basePriceOrProduct, pet = petType) => {
    // Legacy call sites pass just a number; new call sites pass the full
    // product so we can bypass the discount for bundles. Support both.
    let basePrice;
    let product = null;
    if (typeof basePriceOrProduct === 'number') {
      basePrice = basePriceOrProduct;
    } else if (basePriceOrProduct && typeof basePriceOrProduct === 'object') {
      product = basePriceOrProduct;
      basePrice = getBasePrice(product);
    } else {
      basePrice = 0;
    }
    if (isMonthlyBundle(product)) return basePrice; // bundles never get a rate
    const { rate } = getTierFromLbs(getTotalSelectedLbsForPet(pet), DISCOUNT_RATES);
    return basePrice * (1 - rate);
  };

  // Get base 6lb price for a product
  const getBasePrice = (product) => {
    const tier = product.pricing.find(p => p.size_lb === 6) || product.pricing[0];
    return tier.price;
  };

  // Total lbs selected — overall (used for cart-level UI only)
  const getTotalSelectedLbs = () => {
    return Object.values(selectedProteins).reduce((sum, data) => sum + (data.qty || 0), 0);
  };

  // Per-pet-bucket EFFECTIVE tier lbs = meals (raw qty) + bundles (units × weight).
  // Uses the shared utility so ProductDetail computes the same number.
  const getTotalSelectedLbsForPet = (pet) => {
    // `products` here comes from Mongo local + Shopify meals; augment with the
    // Shopify bundles so bundle entries can look up their bundle_weight_lbs.
    const catalog = [...(products || []), ...(bundleProducts || [])];
    return computeTierLbs({ selectedProteins, products: catalog, pet });
  };

  // Auto-upgrade the displayed box size to the tier reached by the CURRENT view's lbs.
  // On an EMPTY basket we leave boxSize at its 36 lb default so shoppers see the lowest
  // per-lb price first (do NOT snap down to the 0/base tier).
  useEffect(() => {
    const lbs = getTotalSelectedLbsForPet(petType);
    if (lbs <= 0) return;
    const tier = getTierFromLbs(lbs, DISCOUNT_RATES);
    if (tier.size !== boxSize) {
      setBoxSize(tier.size);
      sessionStorage.setItem('boxSize', tier.size.toString());
    }
  }, [selectedProteins, petType]);

  // ---- Prompt 9: slide-up milestone celebration above the sticky cart ----
  // Fires once per discount tier per cart session, only when MEAL lbs INCREASE
  // into a new tier, 2s after the last cart action. Never on removals; never
  // re-fires a tier already celebrated this session (even after dropping below).
  const [milestone, setMilestone] = useState(null);
  const prevMealLbsRef = useRef(0);
  const celebratedTiersRef = useRef(null);
  if (celebratedTiersRef.current === null) {
    try {
      celebratedTiersRef.current = new Set(JSON.parse(sessionStorage.getItem('fg_celebrated_tiers') || '[]'));
    } catch { celebratedTiersRef.current = new Set(); }
  }
  useEffect(() => {
    const mealLbs = getTotalSelectedLbsForPet('dog') + getTotalSelectedLbsForPet('cat');
    const prev = prevMealLbsRef.current;
    prevMealLbsRef.current = mealLbs;
    if (mealLbs <= prev) return; // only on increases (never on removals)
    const tier = getTierFromLbs(mealLbs, DOG_DISCOUNT_RATES); // dog==cat rates
    if (!tier || tier.rate <= 0) return;
    if (celebratedTiersRef.current.has(tier.size)) return; // once per tier per session

    const showTimer = setTimeout(() => {
      celebratedTiersRef.current.add(tier.size);
      try { sessionStorage.setItem('fg_celebrated_tiers', JSON.stringify([...celebratedTiersRef.current])); } catch { /* ignore */ }
      const next = getNextTier(mealLbs, DOG_DISCOUNT_RATES);
      const packs = next ? Math.max(1, Math.ceil((next.size - mealLbs) / 6)) : 0;
      setMilestone({
        pct: Math.round(tier.rate * 100),
        nextPct: next ? Math.round(next.rate * 100) : null,
        packs,
      });
    }, 2000); // wait 2s after last cart action
    return () => clearTimeout(showTimer);
  }, [selectedProteins]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (!milestone) return;
    const t = setTimeout(() => setMilestone(null), 5000); // auto-dismiss
    return () => clearTimeout(t);
  }, [milestone]);

  const handleUpdateProtein = (productId, productName, quantity) => {
    setSelectedProteins(prev => {
      const next = { ...prev };
      if (quantity <= 0) {
        delete next[productId];
      } else {
        const existing = prev[productId] || {};
        // Find the product in the loaded catalog (meals + bundles) so we can
        // lock the pet bucket from product_line.
        const fullProduct = [...products, ...bundleProducts].find(pp => pp.product_id === productId);
        const pet = productPetBucket(fullProduct, existing.petType || petType);
        next[productId] = { qty: quantity, name: productName, petType: pet };
      }
      localStorage.setItem('selectedProteins', JSON.stringify(next));
      return next;
    });
  };

  const handleToggleTreat = (treat, newQuantity) => {
    if (newQuantity === undefined) {
      // Old toggle behavior for backwards compatibility
      setSelectedTreats(prev => 
        prev.some(t => t.treat_id === treat.treat_id)
          ? prev.filter(t => t.treat_id !== treat.treat_id)
          : [...prev, { ...treat, quantity: 1 }]
      );
    } else if (newQuantity === 0) {
      // Remove treat
      setSelectedTreats(prev => prev.filter(t => t.treat_id !== treat.treat_id));
    } else {
      // Update quantity
      setSelectedTreats(prev => {
        const existing = prev.find(t => t.treat_id === treat.treat_id);
        if (existing) {
          return prev.map(t => t.treat_id === treat.treat_id ? { ...t, quantity: newQuantity } : t);
        } else {
          return [...prev, { ...treat, quantity: newQuantity }];
        }
      });
    }
  };

  const canAdd = () => {
    // Unlimited — the chosen box size only sets the discount tier/minimum,
    // customers can keep adding as many products as they like.
    return true;
  };


  if (orderComplete) {
    return (
      <>
        <Navbar />
        <OrderSuccess />
        <Footer />
      </>
    );
  }

  if (showCheckout) {
    return (
      <>
        <Navbar />
        <div className="box-builder">
          <button 
            className="btn-secondary" 
            onClick={() => {
              setShowCheckout(false);
              setSearchParams({});
            }}
            style={{ marginBottom: '20px', width: 'auto', padding: '12px 24px' }}
          >
            ← Back to Menu
          </button>
          <CheckoutForm 
            boxSize={boxSize}
            selectedProteins={selectedProteins}
            selectedTreats={selectedTreats}
            products={products}
            subscriptionPlan={subscriptionPlan}
            onSuccess={() => {
              setOrderComplete(true);
              setSelectedProteins({});
              localStorage.setItem('selectedProteins', JSON.stringify({}));
              setSelectedTreats([]);
              localStorage.setItem('selectedTreats', JSON.stringify([]));
              setSearchParams({ step: 'success' });
            }}
          />
        </div>
        <Footer />
      </>
    );
  }

  const comfortDinnerProducts = products.filter(p => p.product_line === 'comfort_dinner').map(withMenuCopy);
  const primalFeastProducts = products.filter(p => p.product_line === 'primal_feast').map(withMenuCopy);
  const royalPawsProducts = products.filter(p => p.product_line === 'royal_paws').map(withMenuCopy);
  const monthlyBundleProducts = bundleProducts.map(withMenuCopy);

  return (
    <>
      <Navbar />

      <div className="box-builder box-builder--narrow">
        {/* Funnel overlay: full-screen choice picker hovering above the menu */}
        <MenuFunnel
          open={funnelOpen}
          dismissable={true}
          selectedId={selectionId}
          onCalculator={() => {
            sessionStorage.setItem('foeguard_selection', 'shop-raw');
            setSelectionId('shop-raw');
            setFunnelOpen(false);
            setCalcOpen(true);
          }}
          onClose={() => {
            // Universal Back: return to the exact previous page the user came from
            // (the funnel is closed by going back one history entry, not by hardcoding home).
            if (window.history.length > 1) navigate(-1);
            else navigate('/');
          }}
          onShopRaw={() => {
            sessionStorage.setItem('foeguard_selection', 'shop-raw');
            setSelectionId('shop-raw');
            setFunnelOpen(false);
            // Push a menu-content history entry so the browser Back button / swipe
            // returns the user to the pre-menu funnel instead of leaving the menu.
            navigate(location.pathname + location.search, { state: { funnel: false } });
          }}
          onMealPlan={() => {
            sessionStorage.setItem('foeguard_selection', 'meal-plan');
            // Navigate FIRST (leave funnel open so no flash of menu content behind)
            navigate('/meal-plan');
          }}
        />

        {/* Single STATIC hero — never changes while browsing. */}
        <div className="menu-collection-hero" data-testid="menu-collection-hero">
          <div
            className="menu-collection-hero-img"
            style={{ backgroundImage: `url(${MENU_HERO.image})` }}
          >
            <div className="menu-collection-hero-overlay" aria-hidden="true" />
            <div className="menu-collection-hero-text">
              <h2 className="menu-collection-hero-title">{MENU_HERO.title}</h2>
              <p className="menu-collection-hero-desc">{MENU_HERO.desc}</p>
            </div>
          </div>
        </div>

        {/* Sticky category tabs — smooth-scroll to on-page sections (no page swap). */}
        <div className="menu-category-text" data-testid="menu-category-tabs">
          {SECTION_TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => scrollToSection(tab.id)}
              data-testid={`category-${tab.id}`}
              className="menu-category-text-btn"
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Main Content — single page: Meals / Treats / Monthly Bundles / Cat Meals */}
        <>
            {loading ? (
              <div style={{ padding: '60px', textAlign: 'center' }}>Loading products...</div>
            ) : (
              <>
                {/* ===================== MEALS ===================== */}
                <section id="menu-section-meals" style={{ scrollMarginTop: '70px' }}>
                  {/* Comfort Dinner */}
                  <div className="product-collection menu-collection">
                    <div className="menu-collection-header menu-collection-header--banner" data-testid="collection-header-comfort">
                      <div className="menu-collection-banner menu-collection-banner--overlay" style={{ backgroundImage: `url(${COLLECTION_IMAGES.comfort_dinner})` }}>
                        <div className="menu-collection-banner-text">
                          <h3 className="menu-collection-title">Comfort Dinner</h3>
                          <p className="menu-collection-desc">Complete raw food for dogs of all-life stages.</p>
                        </div>
                      </div>
                    </div>
                    <div className="product-grid">
                      {comfortDinnerProducts.map(product => (
                        <ProductCard key={product.product_id} product={product} selectedQty={selectedProteins[product.product_id]?.qty || 0} onUpdate={handleUpdateProtein} canAdd={canAdd(product.product_id)} getDiscountedPrice={getDiscountedPrice} getBasePrice={getBasePrice} boxSize={boxSize} navigate={navigate} petType="dog" onOpenProduct={(pid) => setActiveProductId(pid)} isRecommended={false} />
                      ))}
                    </div>
                  </div>

                  {/* Primal Feast */}
                  <div className="product-collection menu-collection">
                    <div className="menu-collection-header menu-collection-header--banner" data-testid="collection-header-primal">
                      <div className="menu-collection-banner menu-collection-banner--overlay" style={{ backgroundImage: `url(${COLLECTION_IMAGES.primal_feast})` }}>
                        <div className="menu-collection-banner-text">
                          <h3 className="menu-collection-title">Primal Feast</h3>
                          <p className="menu-collection-desc">Whole prey raw pet food made with 80% meat, 10% bone and 10% organ.</p>
                        </div>
                      </div>
                    </div>
                    <div className="product-grid">
                      {primalFeastProducts.map(product => (
                        <ProductCard key={product.product_id} product={product} selectedQty={selectedProteins[product.product_id]?.qty || 0} onUpdate={handleUpdateProtein} canAdd={canAdd(product.product_id)} getDiscountedPrice={getDiscountedPrice} getBasePrice={getBasePrice} boxSize={boxSize} navigate={navigate} petType="dog" onOpenProduct={(pid) => setActiveProductId(pid)} isRecommended={false} />
                      ))}
                    </div>
                  </div>

                  {/* Royal Paws moved to its own "Cat Meals" section below. */}
                </section>

                {/* ===================== TREATS ===================== */}
                <section id="menu-section-treats" style={{ scrollMarginTop: '70px' }}>
                  <TreatsSection selectedTreats={selectedTreats} onToggleTreat={handleToggleTreat} petType="dog" navigate={navigate} showCategoryDescriptions={true} onOpenTreat={(tid) => setActiveTreatId(tid)} />
                </section>

                {/* ===================== MONTHLY BUNDLES ===================== */}
                <section id="menu-section-bundles" style={{ scrollMarginTop: '70px' }}>
                  {monthlyBundleProducts.length > 0 && (
                    <div className="product-collection menu-collection">
                      <div className="menu-collection-header menu-collection-header--banner" data-testid="collection-header-bundles">
                        <div className="menu-collection-banner menu-collection-banner--overlay" style={{ backgroundImage: `url(${shopifyCollectionsMap['monthly-bundles-raw-dog-food']?.image_url || COLLECTION_IMAGES.primal_feast})` }}>
                          <div className="menu-collection-banner-text">
                            <h3 className="menu-collection-title">{shopifyCollectionsMap['monthly-bundles-raw-dog-food']?.title || 'Monthly Bundles'}</h3>
                            <p className="menu-collection-desc">{shopifyCollectionsMap['monthly-bundles-raw-dog-food']?.description || 'One box per month — every meal your dog needs, delivered.'}</p>
                          </div>
                        </div>
                      </div>
                      <div className="product-grid">
                        {monthlyBundleProducts.map(product => (
                          <ProductCard key={product.product_id} product={product} selectedQty={selectedProteins[product.product_id]?.qty || 0} onUpdate={handleUpdateProtein} canAdd={canAdd(product.product_id)} getDiscountedPrice={getDiscountedPrice} getBasePrice={getBasePrice} boxSize={boxSize} navigate={navigate} petType="dog" onOpenProduct={(pid) => setActiveProductId(pid)} isRecommended={false} />
                        ))}
                      </div>
                    </div>
                  )}
                </section>

                {/* ===================== CAT MEALS ===================== */}
                <section id="menu-section-cat-meals" style={{ scrollMarginTop: '70px' }}>
                  <div className="product-collection menu-collection">
                    <div className="menu-collection-header menu-collection-header--banner" data-testid="collection-header-royal">
                      <div className="menu-collection-banner menu-collection-banner--overlay" style={{ backgroundImage: `url(${COLLECTION_IMAGES.royal_paws})` }}>
                        <div className="menu-collection-banner-text">
                          <h3 className="menu-collection-title">Royal Paws Dinner</h3>
                          <p className="menu-collection-desc">Complete raw food for cats of all-life stages.</p>
                        </div>
                      </div>
                    </div>
                    <div className="product-grid">
                      {royalPawsProducts.map(product => (
                        <ProductCard key={product.product_id} product={product} selectedQty={selectedProteins[product.product_id]?.qty || 0} onUpdate={handleUpdateProtein} canAdd={canAdd(product.product_id)} getDiscountedPrice={getDiscountedPrice} getBasePrice={getBasePrice} boxSize={boxSize} navigate={navigate} petType="cat" onOpenProduct={(pid) => setActiveProductId(pid)} isRecommended={false} />
                      ))}
                    </div>
                  </div>
                </section>
              </>
            )}
        </>
      </div>

      {/* Prompt 9 — slide-up milestone celebration above the sticky cart (no centered popup) */}
      {milestone && (
        <div
          className="fg-milestone-toast"
          data-testid="milestone-toast"
          role="status"
          aria-live="polite"
        >
          <span className="fg-milestone-title" data-testid="milestone-title">
            🎉 {milestone.pct}% OFF unlocked!
          </span>
          {milestone.nextPct != null && (
            <span className="fg-milestone-sub" data-testid="milestone-sub">
              Add {milestone.packs} more pack{milestone.packs === 1 ? '' : 's'} to unlock {milestone.nextPct}% OFF.
            </span>
          )}
        </div>
      )}

      {/* Sticky cart button — "Your Box (x lb) • $subtotal".
          x lb = MEAL weight only (treats & bundles excluded). Subtotal = all items. */}
      {(() => {
        // Meal weight only — bundles now return 0 tier-lbs, treats aren't in selectedProteins.
        const mealLbs = getTotalSelectedLbsForPet('dog') + getTotalSelectedLbsForPet('cat');
        const catalog = [...(products || []), ...(bundleProducts || [])];
        // Subtotal: meals get their per-pet bulk discount; bundles stay flat; treats flat.
        const proteinsTotal = Object.entries(selectedProteins || {}).reduce((s, [pid, d]) => {
          if (!d) return s;
          const bpid = d.productId || String(pid).split('::')[0];
          const product = catalog.find(p => p.product_id === bpid || p.handle === bpid);
          if (!product) return s;
          // Monthly bundles are FLAT-priced prepaid packs — qty is a UNIT count,
          // so the line is (flat price × units). NEVER divide by 6 (that produced
          // the wrong "$10" total). Meals keep their per-lb bulk-discount math.
          if (isMonthlyBundle(product)) {
            return s + getBasePrice(product) * (d.qty || 0);
          }
          const per6 = getDiscountedPrice(product, d.petType || 'dog');
          return s + (per6 / 6) * (d.qty || 0);
        }, 0);
        const treatsTotal = (selectedTreats || []).reduce((s, t) => s + (t.price || 0) * (t.quantity || 1), 0);
        const subtotal = proteinsTotal + treatsTotal;
        return (
          <button
            onClick={openBasket}
            data-testid="cart-button"
            className="bb-floating-checkout"
          >
            <span className="bb-floating-action" data-testid="cart-button-label">
              Your Box{mealLbs > 0 ? ` (${mealLbs} lb)` : ''}
            </span>
            <span className="bb-floating-sep">•</span>
            <span className="bb-floating-total">${subtotal.toFixed(2)}</span>
          </button>
        );
      })()}

      {/* Inline Product Modal — replaces /product/:id navigation */}
      {activeProductId && (
        <ProductDetailModal
          productId={activeProductId}
          onClose={() => {
            setActiveProductId(null);
            // Re-sync quantity changes made inside the modal back to the menu
            setSelectedProteins(JSON.parse(localStorage.getItem('selectedProteins') || '{}'));
          }}
        />
      )}

      {/* Inline Treat Modal — same overlay/design as meals */}
      {activeTreatId && (
        <TreatDetailModal
          treatId={activeTreatId}
          onClose={() => {
            setActiveTreatId(null);
            setSelectedTreats(JSON.parse(localStorage.getItem('selectedTreats') || '[]'));
          }}
        />
      )}

      {/* Inline Calculator Modal */}
      {calcOpen && (
        <div className="bb-overlay" data-testid="calculator-overlay">
          <div className="bb-overlay-panel" role="dialog" aria-modal="true">
            <button
              className="bb-overlay-close"
              onClick={() => setCalcOpen(false)}
              data-testid="calc-overlay-close"
              aria-label="Close"
            >
              <X size={22} />
            </button>
            <FeedingCalculator
              embedded
              onComplete={() => setCalcOpen(false)}
            />
          </div>
        </div>
      )}

      <Footer />
    </>
  );
};

// Product Card Component
const ProductCard = ({ product, selectedQty, onUpdate, canAdd, getDiscountedPrice, getBasePrice, boxSize, navigate, petType, onOpenProduct, isRecommended = false }) => {
  const basePrice = getBasePrice(product);
  const RATES = petType === 'cat' ? CAT_DISCOUNT_RATES : DOG_DISCOUNT_RATES;
  // Prompt 4: cards ALWAYS display the lowest ("From") per-lb price — the 36 lb+
  // tier. Browsing never changes the card price by discount tier; the actual
  // discounted totals are shown in the sticky cart button + checkout only.
  const basePerLb = basePrice / 6;
  const maxRate = RATES[36] || RATES['36'] || 0;
  const lowestPerLb = basePerLb * (1 - maxRate);

  // Every menu product now adds directly (no packaging modal on the menu).
  // Tapping the card body still opens the detail modal for full info.

  // Product image — use the real Shopify featured image for this product
  // (falls back to the collection placeholder only if Shopify has none).
  const productImage = product.image || product.image_url
    || 'https://customer-assets.emergentagent.com/job_site-upload-4/artifacts/ktno4gsu_2024%20site%20pics.jpg';
  
  // Get collection color based on product line
  const getCollectionColor = () => {
    switch(product.product_line) {
      case 'comfort_dinner': return '#A4C0A0';
      case 'primal_feast': return '#C8102E';
      case 'royal_paws': return '#5E4B73';
      default: return '#C8102E';
    }
  };
  
  const getCollectionLabel = () => {
    switch(product.product_line) {
      case 'comfort_dinner': return 'Complete & Balanced';
      case 'primal_feast': return '80/10/10 Base';
      case 'royal_paws': return 'Complete & Balanced';
      default: return '';
    }
  };

  const collectionColor = getCollectionColor();
  const isSelected = selectedQty > 0;
  // Monthly bundles are prepaid packs -> qty is a UNIT count (1, 2 …), stepping
  // by 1 with a plain number. Everything else steps in 6 lb.
  const isBundle = product.is_bundle === true || isMonthlyBundle(product);
  const step = isBundle ? 1 : 6;

  const goToProduct = () => {
    if (onOpenProduct) {
      onOpenProduct(product.product_id);
      return;
    }
    const root = document.getElementById('root');
    const scrollPos = root ? root.scrollTop : window.scrollY;
    sessionStorage.setItem('menuScrollPosition', scrollPos.toString());
    navigate(`/product/${product.product_id}`);
  };

  const stopAndDecrease = (e) => {
    e.stopPropagation();
    onUpdate(product.product_id, product.name, Math.max(0, selectedQty - step));
  };
  const stopAndIncrease = (e) => {
    e.stopPropagation();
    if (canAdd) onUpdate(product.product_id, product.name, selectedQty + step);
  };
  const stopAndAdd = (e) => {
    e.stopPropagation();
    if (canAdd) onUpdate(product.product_id, product.name, step);
  };

  return (
    <div 
      className={`product-card-row ${isSelected ? 'is-selected' : ''} ${isRecommended ? 'is-recommended' : ''}`}
      data-testid={`product-${product.product_id}`}
      data-recommended={isRecommended ? 'true' : 'false'}
      style={isRecommended ? { position: 'relative' } : undefined}
      onClick={goToProduct}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => { if (e.key === 'Enter') goToProduct(); }}
    >
      {/* Image — on RIGHT side (desktop), on TOP (mobile via CSS order) */}
      <div className="product-card-media">
        <img src={productImage} alt={product.name} />
        {/* Every product adds DIRECTLY from the menu: "+" adds to the box, then a
            −/qty stepper appears. Tapping the card body still opens the detail
            modal (ingredients / nutrition). No separate build-a-box step. */}
        {selectedQty === 0 ? (
          <button
            className="product-card-plus"
            onClick={stopAndAdd}
            disabled={!canAdd}
            data-testid={`add-${product.product_id}`}
            aria-label="Add to cart"
          >
            +
          </button>
        ) : (
          <div className="product-card-qty-pill" onClick={(e) => e.stopPropagation()}>
            <button
              className="qty-btn-mini"
              onClick={stopAndDecrease}
              data-testid={`decrease-${product.product_id}`}
              aria-label="Decrease"
            >
              −
            </button>
            <span className="qty-display-mini" data-testid={`qty-${product.product_id}`}>
              {selectedQty}{!isBundle && <span className="qty-lb-unit">lb</span>}
            </span>
            <button
              className="qty-btn-mini"
              onClick={stopAndIncrease}
              disabled={!canAdd}
              data-testid={`increase-${product.product_id}`}
              aria-label="Increase"
            >
              +
            </button>
          </div>
        )}
      </div>

      {/* Stacked content: Title → Description → Price (tap card to open detail) */}
      <div className="product-card-content">
        <h4 className="product-card-title">{product.name}</h4>

        <p className="product-card-desc">
          {product.mini_description || product.description.split('.')[0]}
        </p>

        <div className="product-card-price">
          {product.is_bundle ? (
            // Monthly Bundles are flat-priced (not per-lb). Show Shopify's total price.
            <span className="price-regular" data-testid={`bundle-price-${product.product_id}`}>${(product.pricing?.[0]?.price || 0).toFixed(2)}</span>
          ) : (
            // Prompt 4: always "From $X.XX/lb" (lowest 36 lb+ tier price). Never
            // changes with the discount tier while browsing.
            <>
              <span className="price-regular" data-testid={`price-${product.product_id}`}>From ${lowestPerLb.toFixed(2)}</span>
              <span className="price-unit">/lb</span>
            </>
          )}
        </div>
      </div>
    </div>
  );
};


// ===== Menu Funnel Overlay — hovers above /menu on first landing =====
const MenuFunnel = ({ open, onShopRaw, onClose, onCalculator, dismissable = true, selectedId = null }) => {
  const options = [
    {
      id: 'shop-raw',
      label: 'Browse Menu',
      sub: 'Most Popular',
      image: 'https://customer-assets.emergentagent.com/job_c26be434-5664-4617-995c-8c836934bef5/artifacts/a5bhlhqi_5.png',
      onClick: onShopRaw
    },
    {
      id: 'meal-plan',
      label: 'Meal Recommendations',
      sub: '2-minute personalized meal plan',
      image: 'https://customer-assets.emergentagent.com/job_c26be434-5664-4617-995c-8c836934bef5/artifacts/wtts10dz_4.png',
      onClick: onCalculator
    }
  ];

  if (!open) return null;

  return (
    <div className="menu-funnel-overlay" data-testid="menu-funnel-overlay">
      <div className="menu-funnel-overlay-inner">
        <button
          className="menu-funnel-overlay-close"
          onClick={onClose}
          aria-label="Close"
          data-testid="menu-funnel-close"
        >
          <X size={22} />
        </button>
        <h1 className="menu-funnel-title">How would you like to order?</h1>
        <p className="menu-funnel-sub">
          Choose the path that works best for you and your pet — browse our full menu or build a custom meal plan.
        </p>
        <div className="menu-funnel-grid menu-funnel-grid--two">
          {options.map(opt => (
            <button
              key={opt.id}
              className={`menu-funnel-card-row ${selectedId === opt.id ? 'is-selected' : ''}`}
              onClick={opt.onClick}
              data-testid={`funnel-${opt.id}`}
            >
              <div className="menu-funnel-card-row-media">
                <img src={opt.image} alt={opt.label} />
              </div>
              <div className="menu-funnel-card-row-content">
                <h3 className="menu-funnel-card-row-title">{opt.label}</h3>
                <p className="menu-funnel-card-row-sub">{opt.sub}</p>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

// ===== Selection breadcrumb — sticky pill under navbar showing current choice + Edit =====
export const SelectionBreadcrumb = ({ label, onEdit }) => {
  return (
    <div className="selection-breadcrumb" data-testid="selection-breadcrumb">
      <div className="selection-breadcrumb-inner">
        <span className="selection-breadcrumb-label">
          <span className="selection-breadcrumb-prefix">Selection:</span>
          <span className="selection-breadcrumb-title">{label}</span>
        </span>
        <button
          className="selection-breadcrumb-edit"
          onClick={onEdit}
          data-testid="selection-breadcrumb-edit"
        >
          Edit
        </button>
      </div>
    </div>
  );
};


// ===== Stock Up & Save — compact collapsible discount guide (replaces box selector) =====
const StockUpSave = ({ guide = [], currentLbs = 0 }) => {
  const [open, setOpen] = useState(false);
  const maxOff = guide.length ? guide[guide.length - 1].discount : 0;
  return (
    <div className={`stock-up ${open ? 'is-open' : ''}`} data-testid="stock-up-save">
      <button
        type="button"
        className="stock-up-toggle"
        onClick={() => setOpen(o => !o)}
        data-testid="stock-up-toggle"
        aria-expanded={open}
      >
        <span className="stock-up-toggle-left">
          <Tag size={16} strokeWidth={2} />
          <span className="stock-up-toggle-title">Stock Up &amp; Save</span>
          <span className="stock-up-toggle-meta">up to {maxOff}% off</span>
        </span>
        {open ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
      </button>
      {open && (
        <div className="stock-up-body" data-testid="stock-up-body">
          <p className="stock-up-intro">
            Add more meals to your basket and the whole order is discounted automatically — no codes, no commitment.
          </p>
          <div className="stock-up-tiers">
            {guide.map(tier => {
              const reached = currentLbs >= tier.size;
              return (
                <div
                  key={tier.size}
                  className={`stock-up-tier ${reached ? 'is-reached' : ''}`}
                  data-testid={`stock-up-tier-${tier.size}`}
                >
                  <span className="stock-up-tier-size">{tier.size}lb+</span>
                  <span className="stock-up-tier-off">{tier.discount}% off</span>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};


// ===== Plan Bar (Prompt 1) =====
// Slim single-line strip that appears between the category tabs and the
// "CHOOSE YOUR BOX SIZE" heading once the user has loaded a saved pet plan.
//
// Format: 🐾 [Pet Name ▾]  ·  Recommended feeding: X lb/month
//
// - Pet-name is ALWAYS a dropdown (even for a single pet — the menu opens
//   with a "Manage plans" shortcut but no other pets to switch to).
// - Feeding amount is hidden if the pet has no calculator/box-parameter data.
// - Mobile: 14px Barlow 400, single line, no wrap; dropdown min tap 44px.
const PlanBar = ({ petSnap, currentPetIdx, onSwitch, onManage }) => {
  const [open, setOpen] = useState(false);
  const wrapRef = React.useRef(null);
  useEffect(() => {
    if (!open) return undefined;
    const onDoc = (e) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener('mousedown', onDoc);
    return () => document.removeEventListener('mousedown', onDoc);
  }, [open]);

  // Empty state → no bar. Default menu is clean-slate.
  if (!petSnap || !Array.isArray(petSnap.dogs) || petSnap.dogs.length === 0) return null;
  if (currentPetIdx === null || currentPetIdx === undefined) return null;
  const dog = petSnap.dogs[currentPetIdx];
  if (!dog) return null;

  // Feeding-per-month is derived from the calculator's weekly estimate.
  // If neither weekly_lbs_estimate nor box_parameters exist, hide the amount.
  const weekly = dog?.box_parameters?.weekly_lbs_estimate;
  const monthlyLbs = (typeof weekly === 'number' && weekly > 0)
    ? Math.round(weekly * 4.33 * 10) / 10 : null;

  return (
    <div className="plan-bar" data-testid="plan-bar" ref={wrapRef}>
      <div className="plan-bar-inner">
        <span className="plan-bar-paw" aria-hidden="true">🐾</span>
        <div className="plan-bar-picker">
          <button
            type="button"
            className="plan-bar-picker-btn"
            data-testid="plan-bar-picker"
            aria-haspopup="listbox"
            aria-expanded={open ? 'true' : 'false'}
            onClick={() => setOpen(v => !v)}
          >
            <span className="plan-bar-pet-name">{dog.name}</span>
            <span className="plan-bar-caret" aria-hidden="true">▾</span>
          </button>
          {open && (
            <ul className="plan-bar-menu" role="listbox" data-testid="plan-bar-menu">
              {petSnap.dogs.map((d, i) => (
                <li key={d.dog_id || `pet-${i}`}>
                  <button
                    type="button"
                    role="option"
                    aria-selected={i === currentPetIdx}
                    data-testid={`plan-bar-option-${i}`}
                    className={`plan-bar-menu-item ${i === currentPetIdx ? 'is-active' : ''}`}
                    onClick={() => { setOpen(false); if (i !== currentPetIdx) onSwitch(i); }}
                  >{d.name}</button>
                </li>
              ))}
              <li className="plan-bar-menu-sep" aria-hidden="true" />
              <li>
                <button
                  type="button"
                  className="plan-bar-menu-manage"
                  data-testid="plan-bar-manage"
                  onClick={() => { setOpen(false); onManage && onManage(); }}
                >Manage plans in profile →</button>
              </li>
            </ul>
          )}
        </div>
        {monthlyLbs !== null && (
          <>
            <span className="plan-bar-sep" aria-hidden="true">·</span>
            <span className="plan-bar-feeding" data-testid="plan-bar-feeding">
              Recommended feeding: {monthlyLbs} lb/month
            </span>
          </>
        )}
      </div>
    </div>
  );
};

// ===== Box-size pills — quick selector for pre-set box sizes (6 / 12 / 24 / 36+ lb) =====
// Small "Choose your box size" heading + white pills with warm-gold selected state.
// The 6lb tier still shows its % OFF badge above; discount rates come from DISCOUNT_RATES.
const BOX_PILL_OPTIONS = [
  { size: 6,  label: '6 lb'   },
  { size: 12, label: '12 lb'  },
  { size: 24, label: '24 lb'  },
  { size: 36, label: '36 lb+' },
];
const BoxSizePills = ({ boxSize, onChange, rates = DOG_DISCOUNT_RATES }) => (
  <div className="box-pills-wrap" data-testid="box-size-pills">
    <h3 className="box-pills-heading">Choose your box size</h3>
    <div className="box-pills-grid">
      {BOX_PILL_OPTIONS.map((opt) => {
        const rate = rates[opt.size] || 0;
        const off = Math.round(rate * 100);
        const isSelected = boxSize === opt.size;
        return (
          <button
            key={opt.size}
            type="button"
            data-testid={`box-pill-${opt.size}`}
            data-selected={isSelected ? 'true' : 'false'}
            className={`box-pill ${isSelected ? 'is-selected' : ''}`}
            onClick={() => onChange && onChange(opt.size)}
            aria-pressed={isSelected}
          >
            {off > 0 && (
              <span className="box-pill-badge">{off}% OFF</span>
            )}
            <span className="box-pill-label">{opt.label}</span>
          </button>
        );
      })}
    </div>
  </div>
);

// ===== Weight progress strip — thin fill bar flush against the top of the floating cart button =====
// Uses .weight-progress-bar (CSS position: fixed; sits directly on top of .bb-floating-checkout).
// - Track = thin #E8E4DC line, fill = solid #C8102E (Barn Red)
// - Progress caps at 100% but visual continues to reflect over-target (past 36lb tier stays locked at 15%)
// - Counter text sits ABOVE the bar as a single slim line (no box container) — mobile === desktop
const WeightProgressBar = () => null;

