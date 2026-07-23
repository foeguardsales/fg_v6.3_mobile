import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useSearchParams, useLocation } from 'react-router-dom';
import { Navbar, Footer } from '../components/Layout';
import { TreatsSection, CheckoutForm, OrderSuccess, CatTreatsSection } from '../components/CartAndCheckout';
import { Calculator, Wheat, PawPrint, X, ChevronDown, ChevronUp, Tag } from 'lucide-react';
import { ProductDetailModal } from './ProductDetail';
import { TreatDetailModal } from './TreatDetail';
import { FeedingCalculator } from '../components/FeedingCalculator';
import { useCart } from '../contexts/CartContext';

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

// Immersive category hero — shown below the category tabs, above Stock Up & Save.
// PLACEHOLDER images + copy for now; these will be pulled from the Shopify Storefront API (collection image + description).
const CATEGORY_HERO = {
  'dog-food': {
    title: 'Raw Dog Food',
    desc: 'Complete, farm-fresh raw nutrition for dogs of all life stages — human-grade meat, organs and bone, portioned and ready to serve.',
    image: COLLECTION_IMAGES.dog
  },
  'dog-treats': {
    title: 'Raw Dog Treats',
    desc: 'Natural, single-ingredient treats that support dental health, enrichment and training — a wholesome reward your dog will love.',
    image: COLLECTION_IMAGES.dog
  },
  'cat-food': {
    title: 'Raw Cat Food',
    desc: 'Species-appropriate raw meals crafted for obligate carnivores — high-protein, moisture-rich nutrition for cats of all life stages.',
    image: COLLECTION_IMAGES.cat
  },
  'cat-treats': {
    title: 'Raw Cat Treats',
    desc: 'Simple, natural treats cats crave — pure protein rewards for enrichment, bonding and everyday spoiling.',
    image: COLLECTION_IMAGES.cat
  }
};

export const BoxBuilder = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const location = useLocation();
  const [petType, setPetType] = useState('dog'); // 'dog' or 'cat'
  const [viewMode, setViewMode] = useState('food'); // 'food' | 'treats'

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

  // Funnel overlay — full-screen choice picker shown on first menu landing
  // Stays as a re-openable selector via Edit button after dismissal
  const initialSelection = sessionStorage.getItem('foeguard_selection') || null;
  const [funnelOpen, setFunnelOpen] = useState(!initialSelection);
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
  const initialBoxSize = parseInt(sessionStorage.getItem('boxSize')) || 6;
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

  // Auto-skip the funnel if user previously made a selection (within session)
  // OR if they arrived from a saved plan / multi-pet quiz result (?plan=|?multi=).
  useEffect(() => {
    const sel = sessionStorage.getItem('foeguard_selection');
    const cameFromPlan = searchParams.get('plan') !== null || searchParams.get('multi') !== null;
    if (sel || cameFromPlan) {
      if (!sel && cameFromPlan) sessionStorage.setItem('foeguard_selection', 'shop-raw');
      setFunnelOpen(false);
      setSelectionId(sel || 'shop-raw');
    } else {
      setFunnelOpen(true);
    }
     
  }, []);

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
        // Fetch ALL products (both pet types) so the cart can look up cross-pet items.
        // Display filtering by product_line happens client-side below.
        const [productsRes, treatsRes] = await Promise.all([
          axios.get(`${API}/products`),
          axios.get(`${API}/treats`)
        ]);
        setProducts(productsRes.data);
        setTreats(treatsRes.data);
      } catch (error) {
        console.error('Failed to load data:', error);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []); // load once — products/treats don't change with pet type anymore

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
      
      if (savedBoxSize && savedBoxSize !== boxSize) {
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
    // Set default box size for new pet type
    setBoxSize(newPetType === 'cat' ? 6 : 6);
  };

  const bannerCards = [
    { id: 'dog-food', title: 'Raw Dog Food', petType: 'dog', viewMode: 'food', active: petType === 'dog' && viewMode === 'food' },
    { id: 'dog-treats', title: 'Raw Dog Treats', petType: 'dog', viewMode: 'treats', active: petType === 'dog' && viewMode === 'treats' },
    { id: 'cat-food', title: 'Raw Cat Food', petType: 'cat', viewMode: 'food', active: petType === 'cat' && viewMode === 'food' },
    { id: 'cat-treats', title: 'Raw Cat Treats', petType: 'cat', viewMode: 'treats', active: petType === 'cat' && viewMode === 'treats' }
  ];

  const handleCategoryClick = (card) => {
    // Cart persists across pet types — no clearing on category switch
    setPetType(card.petType);
    setViewMode(card.viewMode);
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
  // pet defaults to the active view (petType). Dog basket and cat basket have SEPARATE tiers.
  const getDiscountedPrice = (basePrice, pet = petType) => {
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

  // Per-pet-bucket lbs total (drives the per-pet discount tier).
  // Legacy entries with no petType are assumed to be 'dog'.
  const getTotalSelectedLbsForPet = (pet) => {
    return Object.values(selectedProteins)
      .filter(d => (d.petType || 'dog') === pet)
      .reduce((sum, data) => sum + (data.qty || 0), 0);
  };

  // Auto-upgrade the displayed box size to the tier reached by the CURRENT view's lbs
  useEffect(() => {
    const tier = getTierFromLbs(getTotalSelectedLbsForPet(petType), DISCOUNT_RATES);
    if (tier.size !== boxSize) {
      setBoxSize(tier.size);
      sessionStorage.setItem('boxSize', tier.size.toString());
    }
  }, [selectedProteins, petType]);

  const handleUpdateProtein = (productId, productName, quantity) => {
    setSelectedProteins(prev => {
      const next = { ...prev };
      if (quantity <= 0) {
        delete next[productId];
      } else {
        const existing = prev[productId] || {};
        // Find the product in the loaded catalog so we can lock pet bucket from product_line
        const fullProduct = products.find(pp => pp.product_id === productId);
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

  const comfortDinnerProducts = products.filter(p => p.product_line === 'comfort_dinner');
  const primalFeastProducts = products.filter(p => p.product_line === 'primal_feast');
  const royalPawsProducts = products.filter(p => p.product_line === 'royal_paws');

  // Box size — show only on food view
  const showBoxSize = viewMode === 'food';

  return (
    <>
      <Navbar />

      {/* Selection breadcrumb — visible after funnel is dismissed */}
      {!funnelOpen && (
        <SelectionBreadcrumb
          label={
            selectionId === 'meal-plan' ? 'Build a Meal Plan'
            : selectionId === 'calculator' ? 'Feeding Calculator'
            : 'Raw Food Menu'
          }
          onEdit={() => setFunnelOpen(true)}
        />
      )}

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
            // If the user reached the funnel by clicking "Shop Now" on the home page,
            // closing (X) should return them to where they started — the home page.
            if (location.state?.from === 'home') {
              navigate('/');
              return;
            }
            if (!sessionStorage.getItem('foeguard_selection')) {
              sessionStorage.setItem('foeguard_selection', 'shop-raw');
              setSelectionId('shop-raw');
            }
            setFunnelOpen(false);
          }}
          onShopRaw={() => {
            sessionStorage.setItem('foeguard_selection', 'shop-raw');
            setSelectionId('shop-raw');
            // Clear the "from home" origin so re-opening the funnel later (via Edit)
            // and closing it keeps the user on the menu rather than bouncing home.
            if (location.state?.from === 'home') {
              navigate(location.pathname, { replace: true, state: {} });
            }
            setFunnelOpen(false);
          }}
          onMealPlan={() => {
            sessionStorage.setItem('foeguard_selection', 'meal-plan');
            // Navigate FIRST (leave funnel open so no flash of menu content behind)
            navigate('/meal-plan');
          }}
        />

        {/* Category Tabs: Raw Dog Food | Raw Dog Treats | Raw Cat Food | Raw Cat Treats
            (Feeding Calculator removed here — it is offered on the funnel/selector page instead) */}
        {/* Immersive category hero with the menu-selection tabs OVERLAID on the image
            (cinematic — image sits under the selection, less wasted vertical space on mobile) */}
        {(() => {
          const hero = CATEGORY_HERO[`${petType}-${viewMode}`];
          const tabs = (
            <div className="menu-category-tabs-wrap menu-category-tabs-wrap--on-hero">
              <div className="menu-category-text menu-category-text--on-hero" data-testid="menu-category-tabs">
                {bannerCards.map((card) => (
                  <button
                    key={card.id}
                    onClick={() => handleCategoryClick(card)}
                    data-testid={`category-${card.id}`}
                    className={`menu-category-text-btn ${card.active ? 'is-active' : ''}`}
                  >
                    {card.title}
                  </button>
                ))}
              </div>
            </div>
          );
          if (!hero) {
            return <div className="menu-category-text" data-testid="menu-category-tabs">{tabs.props.children.props.children}</div>;
          }
          return (
            <div className="menu-collection-hero" data-testid="menu-collection-hero">
              <div
                className="menu-collection-hero-img"
                style={{ backgroundImage: `url(${hero.image})` }}
              >
                <div className="menu-collection-hero-overlay" aria-hidden="true" />
                {tabs}
                <div className="menu-collection-hero-text">
                  <h2 className="menu-collection-hero-title">{hero.title}</h2>
                  <p className="menu-collection-hero-desc">{hero.desc}</p>
                </div>
              </div>
            </div>
          );
        })()}

        {/* Main Content - Dog or Cat */}
        <>
            {/* Prompt 1 — Plan Bar: single slim line with pet dropdown + optional feeding amount.
                Sits between category tabs and CHOOSE YOUR BOX SIZE. Only renders when a
                saved plan exists AND has been loaded (?plan=N in the URL). */}
            <PlanBar
              petSnap={petSnap}
              currentPetIdx={currentPetIdx}
              onSwitch={(idx) => {
                // Instant switch — update URL param, planIndex effect re-runs, highlights refresh.
                const next = new URLSearchParams(searchParams);
                next.set('plan', String(idx));
                setSearchParams(next, { replace: true });
              }}
              onManage={() => navigate('/account')}
            />

            {showBoxSize && (
              <BoxSizePills
                boxSize={boxSize}
                rates={DISCOUNT_RATES}
                onChange={(sz) => {
                  setBoxSize(sz);
                  sessionStorage.setItem('boxSize', sz.toString());
                }}
              />
            )}

            {loading ? (
              <div style={{ padding: '60px', textAlign: 'center' }}>Loading products...</div>
            ) : viewMode === 'treats' ? (
              <TreatsSection 
                selectedTreats={selectedTreats}
                onToggleTreat={handleToggleTreat}
                petType={petType}
                navigate={navigate}
                hideHeader={false}
                showCategoryDescriptions={true}
                onOpenTreat={(tid) => setActiveTreatId(tid)}
              />
            ) : petType === 'dog' ? (
              <>
                {/* Comfort Dinner Collection - DOG */}
                <div className="product-collection menu-collection">
                  <div className="menu-collection-header menu-collection-header--banner" data-testid="collection-header-comfort">
                    <div
                      className="menu-collection-banner menu-collection-banner--overlay"
                      style={{ backgroundImage: `url(${COLLECTION_IMAGES.comfort_dinner})` }}
                    >
                      <div className="menu-collection-banner-text">
                        <h3 className="menu-collection-title">Comfort Dinner</h3>
                        <p className="menu-collection-desc">Complete raw food for dogs of all-life stages.</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="product-grid">
                    {comfortDinnerProducts.map(product => (
                      <ProductCard 
                        key={product.product_id}
                        product={product}
                        selectedQty={selectedProteins[product.product_id]?.qty || 0}
                        onUpdate={handleUpdateProtein}
                        canAdd={canAdd(product.product_id)}
                        getDiscountedPrice={getDiscountedPrice}
                        getBasePrice={getBasePrice}
                        boxSize={boxSize}
                        navigate={navigate}
                        petType={petType}
                        onOpenProduct={(pid) => setActiveProductId(pid)}
                        isRecommended={!!recommendedProteins && recommendedProteins.has((product.protein_type || "").toLowerCase())}
                      />
                    ))}
                  </div>
                </div>

                {/* Primal Feast Collection - DOG */}
                <div className="product-collection menu-collection">
                  <div className="menu-collection-header menu-collection-header--banner" data-testid="collection-header-primal">
                    <div
                      className="menu-collection-banner menu-collection-banner--overlay"
                      style={{ backgroundImage: `url(${COLLECTION_IMAGES.primal_feast})` }}
                    >
                      <div className="menu-collection-banner-text">
                        <h3 className="menu-collection-title">Primal Feast</h3>
                        <p className="menu-collection-desc">Whole prey raw pet food made with 80% meat, 10% bone and 10% organ.</p>
                      </div>
                    </div>
                  </div>

                  <div className="product-grid">
                    {primalFeastProducts.map(product => (
                      <ProductCard 
                        key={product.product_id}
                        product={product}
                        selectedQty={selectedProteins[product.product_id]?.qty || 0}
                        onUpdate={handleUpdateProtein}
                        canAdd={canAdd(product.product_id)}
                        getDiscountedPrice={getDiscountedPrice}
                        getBasePrice={getBasePrice}
                        boxSize={boxSize}
                        navigate={navigate}
                        petType={petType}
                        onOpenProduct={(pid) => setActiveProductId(pid)}
                        isRecommended={!!recommendedProteins && recommendedProteins.has((product.protein_type || "").toLowerCase())}
                      />
                    ))}
                  </div>
                </div>

                {/* Treats Section - DOG */}
                <TreatsSection 
                  selectedTreats={selectedTreats}
                  onToggleTreat={handleToggleTreat}
                  petType="dog"
                  navigate={navigate}
                  showCategoryDescriptions={true}
                  onOpenTreat={(tid) => setActiveTreatId(tid)}
                />
              </>
            ) : (
              <>
                {/* Royal Paws Collection - CAT */}
                <div className="product-collection menu-collection">
                  <div className="menu-collection-header menu-collection-header--banner" data-testid="collection-header-royal">
                    <div
                      className="menu-collection-banner menu-collection-banner--overlay"
                      style={{ backgroundImage: `url(${COLLECTION_IMAGES.royal_paws})` }}
                    >
                      <div className="menu-collection-banner-text">
                        <h3 className="menu-collection-title">Royal Paws Dinner</h3>
                        <p className="menu-collection-desc">Complete raw food for cats of all-life stages.</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="product-grid">
                    {royalPawsProducts.map(product => (
                      <ProductCard 
                        key={product.product_id}
                        product={product}
                        selectedQty={selectedProteins[product.product_id]?.qty || 0}
                        onUpdate={handleUpdateProtein}
                        canAdd={canAdd(product.product_id)}
                        getDiscountedPrice={getDiscountedPrice}
                        getBasePrice={getBasePrice}
                        boxSize={boxSize}
                        navigate={navigate}
                        petType={petType}
                        onOpenProduct={(pid) => setActiveProductId(pid)}
                        isRecommended={!!recommendedProteins && recommendedProteins.has((product.protein_type || "").toLowerCase())}
                      />
                    ))}
                  </div>
                </div>

                {/* Primal Feast Collection - CAT (same line as dog, 80/10/10 base) */}
                <div className="product-collection menu-collection">
                  <div className="menu-collection-header menu-collection-header--banner" data-testid="collection-header-primal-cat">
                    <div
                      className="menu-collection-banner menu-collection-banner--overlay"
                      style={{ backgroundImage: `url(${COLLECTION_IMAGES.primal_feast})` }}
                    >
                      <div className="menu-collection-banner-text">
                        <h3 className="menu-collection-title">Primal Feast</h3>
                        <p className="menu-collection-desc">Whole prey raw pet food made with 80% meat, 10% bone and 10% organ.</p>
                      </div>
                    </div>
                  </div>

                  <div className="product-grid">
                    {primalFeastProducts.map(product => (
                      <ProductCard 
                        key={product.product_id}
                        product={product}
                        selectedQty={selectedProteins[product.product_id]?.qty || 0}
                        onUpdate={handleUpdateProtein}
                        canAdd={canAdd(product.product_id)}
                        getDiscountedPrice={getDiscountedPrice}
                        getBasePrice={getBasePrice}
                        boxSize={boxSize}
                        navigate={navigate}
                        petType={petType}
                        onOpenProduct={(pid) => setActiveProductId(pid)}
                        isRecommended={!!recommendedProteins && recommendedProteins.has((product.protein_type || "").toLowerCase())}
                      />
                    ))}
                  </div>
                </div>

                {/* Treats Section - CAT */}
                <TreatsSection 
                  selectedTreats={selectedTreats}
                  onToggleTreat={handleToggleTreat}
                  petType="cat"
                  navigate={navigate}
                  showCategoryDescriptions={true}
                  onOpenTreat={(tid) => setActiveTreatId(tid)}
                />
              </>
            )}
        </>
      </div>

      {/* Floating bottom button — opens the cart. Shows running $total and "Add Xlb to Cart". */}
      {(() => {
        const lbs = getTotalSelectedLbs();
        // Compute meal subtotal (with bulk discount) + treats subtotal — matches the cart math
        const proteinFull = Object.entries(selectedProteins || {}).reduce((s, [pid, d]) => {
          const bpid = (d && d.productId) || String(pid).split('::')[0];
          const product = products.find(p => p.product_id === bpid);
          if (!product) return s;
          const base = getBasePrice ? getBasePrice(product) : (product.pricing.find(pp => pp.size_lb === 6)?.price || 0);
          return s + (base / 6) * (d.qty || 0);
        }, 0);
        const { rate } = getTierFromLbs(lbs, DISCOUNT_RATES);
        const proteinDiscounted = proteinFull * (1 - rate);
        const treatsTotal = (selectedTreats || []).reduce((s, t) => s + (t.price || 0) * (t.quantity || 1), 0);
        const runningTotal = proteinDiscounted + treatsTotal;
        const hasItems = lbs > 0 || (selectedTreats && selectedTreats.length > 0);
        return (
          <>
            {showBoxSize && (
              <WeightProgressBar currentLbs={lbs} targetLbs={boxSize} />
            )}
            <button
              onClick={openBasket}
              data-testid="cart-button"
              className="bb-floating-checkout"
            >
              <span className="bb-floating-action">View Cart</span>
              <span className="bb-floating-sep">•</span>
              <span className="bb-floating-total">${runningTotal.toFixed(2)}</span>
            </button>
          </>
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
  const discountedPrice = getDiscountedPrice(basePrice);
  const hasDiscount = discountedPrice < basePrice - 0.001;
  // Pricing is stored as the 6lb base price. Show /1lb by default; once a quantity
  // is selected, show the full price for that amount.
  const basePerLb = basePrice / 6;
  const lowestPerLb = basePerLb * 0.85; // lowest possible /lb — max 15% bulk discount
  const discountedPerLb = discountedPrice / 6;
  const displayQty = selectedQty > 0 ? selectedQty : 1;
  const showPrice = discountedPerLb * displayQty;
  const showOriginal = basePerLb * displayQty;

  // Products with variants (packaging/size options) are configured on the Product Page,
  // not on the menu. Menu just shows a "+" that opens the detail view. Products flagged
  // `no_variants: true` fall back to the classic inline +/qty stepper.
  const hasVariants = product.no_variants !== true;
  
  // Product image URL - use the uploaded comfort dinner image for all products
  const productImage = 'https://customer-assets.emergentagent.com/job_site-upload-4/artifacts/ktno4gsu_2024%20site%20pics.jpg';
  
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
    onUpdate(product.product_id, product.name, Math.max(0, selectedQty - 6));
  };
  const stopAndIncrease = (e) => {
    e.stopPropagation();
    if (canAdd) onUpdate(product.product_id, product.name, selectedQty + 6);
  };
  const stopAndAdd = (e) => {
    e.stopPropagation();
    if (canAdd) onUpdate(product.product_id, product.name, 6);
  };

  // Display the price for the currently selected qty (default 6lb pack when none selected).
  // The per-lb price reflects the CURRENT bulk-discount tier across ALL selected meals,
  // so adding a new product is automatically discounted if the cart already hit a tier.
  const effectiveLbs = selectedQty > 0 ? selectedQty : 6;
  const lineTotal = discountedPerLb * effectiveLbs;
  const perLbDisplay = discountedPerLb;

  return (
    <div 
      className={`product-card-row ${(!hasVariants && isSelected) ? 'is-selected' : ''} ${isRecommended ? 'is-recommended' : ''}`}
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
        {/* + button (variants) OR + / qty stepper (no variants). Variant products
            never show a stepper on the menu — clicking "+" opens the product page
            where packaging + quantity are chosen. */}
        {hasVariants ? (
          <button
            className="product-card-plus"
            onClick={(e) => { e.stopPropagation(); goToProduct(); }}
            data-testid={`add-${product.product_id}`}
            aria-label="Configure and add to cart"
          >
            +
          </button>
        ) : selectedQty === 0 ? (
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
              {selectedQty}<span className="qty-lb-unit">lb</span>
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
          {(!hasVariants && selectedQty > 0) ? (
            <>
              <span className="price-regular">${lineTotal.toFixed(2)}</span>
              <span className="price-unit">(${perLbDisplay.toFixed(2)}/lb)</span>
            </>
          ) : (
            <>
              <span className="price-from">From</span>
              <span className="price-regular">${lowestPerLb.toFixed(2)}</span>
              <span className="price-unit">/lb</span>
            </>
          )}
        </div>
      </div>
    </div>
  );
};


// ===== Menu Funnel Overlay — hovers above /menu on first landing =====
const MenuFunnel = ({ open, onShopRaw, onMealPlan, onClose, onCalculator, dismissable = true, selectedId = null }) => {
  const options = [
    {
      id: 'shop-raw',
      label: 'Raw Food Menu',
      sub: 'Browse every meal & treat. Build your own box.',
      image: 'https://customer-assets.emergentagent.com/job_c26be434-5664-4617-995c-8c836934bef5/artifacts/a5bhlhqi_5.png',
      onClick: onShopRaw
    },
    {
      id: 'meal-plan',
      label: 'Build a Meal Plan',
      sub: 'Personalized plan based on your dog\u2019s profile.',
      image: 'https://customer-assets.emergentagent.com/job_c26be434-5664-4617-995c-8c836934bef5/artifacts/wtts10dz_4.png',
      onClick: onMealPlan
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
        {onCalculator && (
          <button
            type="button"
            className="menu-funnel-calc-link"
            onClick={onCalculator}
            data-testid="funnel-calculator-link"
          >
            Feeding Calculator
          </button>
        )}
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
const WeightProgressBar = ({ currentLbs = 0, targetLbs = 6 }) => {
  if (!currentLbs || currentLbs <= 0) return null;
  const pct = Math.min(100, Math.round((currentLbs / Math.max(1, targetLbs)) * 100));
  return (
    <div className="weight-progress-bar" data-testid="weight-progress-bar" role="status" aria-live="polite">
      <div className="weight-progress-label">
        <span className="weight-progress-current">{currentLbs} lb</span>
        <span className="weight-progress-sep">/</span>
        <span className="weight-progress-target">{targetLbs} lb</span>
      </div>
      <div className="weight-progress-track">
        <div className="weight-progress-fill" style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
};
