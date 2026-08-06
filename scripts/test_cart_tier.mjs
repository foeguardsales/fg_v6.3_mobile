/**
 * Unit test for cart-tier math (meals + bundles).
 * Run with:  node --experimental-vm-modules /app/scripts/test_cart_tier.mjs
 * or (simpler):  cd /app/frontend && npx babel-node /app/scripts/test_cart_tier.mjs
 *
 * This file uses plain ESM so it can be executed by node's --input-type=module.
 */
import {
  isMonthlyBundle,
  bundleWeightLbs,
  bundleUnitsFromQty,
  tierLbsForEntry,
  computeTierLbs,
  activeProductTierLbs,
} from '../frontend/src/utils/cartTier.js';

let fails = 0;
function assert(name, cond, actual, expected) {
  if (cond) {
    console.log(`  ✅  ${name}`);
  } else {
    console.log(`  ❌  ${name}  (actual=${JSON.stringify(actual)} expected=${JSON.stringify(expected)})`);
    fails++;
  }
}

const bundleGiant = {
  product_id: 'monthly-bundle-giant',
  handle: 'monthly-bundle-giant',
  name: 'Monthly Bundle Giant Breed - 60 lb',
  product_line: 'monthly_bundle',
  bundle_weight_lbs: 60,
  is_bundle: true,
};
const bundleMedium = {
  product_id: 'monthly-bundle-medium',
  handle: 'monthly-bundle-medium',
  name: 'Monthly Bundle Medium Breed - 32 lb',
  product_line: 'monthly_bundles',   // catalog normaliser variant (plural)
  bundle_weight_lbs: 32,
};
const mealChicken = {
  product_id: 'chicken-6lb',
  handle: 'chicken-6lb',
  name: 'Comfort Dinner Chicken',
  product_line: 'comfort_dinner',
};

console.log('\n--- isMonthlyBundle ---');
assert('giant bundle → true', isMonthlyBundle(bundleGiant) === true, isMonthlyBundle(bundleGiant), true);
assert('medium bundle (plural product_line) → true', isMonthlyBundle(bundleMedium) === true, isMonthlyBundle(bundleMedium), true);
assert('meal → false', isMonthlyBundle(mealChicken) === false, isMonthlyBundle(mealChicken), false);
assert('null product → false', isMonthlyBundle(null) === false, isMonthlyBundle(null), false);
assert('handle-only detection', isMonthlyBundle({ handle: 'monthly-bundle-small' }) === true, true, true);

console.log('\n--- bundleWeightLbs ---');
assert('field wins (giant=60)', bundleWeightLbs(bundleGiant) === 60, bundleWeightLbs(bundleGiant), 60);
assert('parse from title ("- 32 lb")', bundleWeightLbs({ name: 'Something - 32 lb' }) === 32, 32, 32);
assert('no info → 0', bundleWeightLbs({ name: 'no digits' }) === 0, 0, 0);

console.log('\n--- bundleUnitsFromQty ---');
assert('qty 6 → 1 unit', bundleUnitsFromQty(6) === 1, bundleUnitsFromQty(6), 1);
assert('qty 12 → 2 units', bundleUnitsFromQty(12) === 2, bundleUnitsFromQty(12), 2);
assert('qty 0 → 1 unit (min)', bundleUnitsFromQty(0) === 1, bundleUnitsFromQty(0), 1);
assert('qty undefined → 1', bundleUnitsFromQty(undefined) === 1, bundleUnitsFromQty(undefined), 1);

console.log('\n--- tierLbsForEntry ---');
assert('meal 6 lb → 6', tierLbsForEntry({ qty: 6 }, mealChicken) === 6, 6, 6);
assert('meal 12 lb → 12', tierLbsForEntry({ qty: 12 }, mealChicken) === 12, 12, 12);
assert('1 giant bundle (qty=6) → 60 lb', tierLbsForEntry({ qty: 6 }, bundleGiant) === 60, 60, 60);
assert('2 medium bundles (qty=12) → 64 lb', tierLbsForEntry({ qty: 12 }, bundleMedium) === 64, 64, 64);
assert('bundle w/ unknown weight → falls back to qty', tierLbsForEntry({ qty: 6 }, { handle: 'monthly-bundle-mystery', product_line: 'monthly_bundle', name: 'no digits' }) === 6, 6, 6);

console.log('\n--- computeTierLbs (the spec example) ---');
const cart_64bundle_1meal = {
  'monthly-bundle-giant::size': { qty: 6, productId: 'monthly-bundle-giant', petType: 'dog' },     // 60 lb
  'monthly-bundle-toy::size':   { qty: 6, productId: 'monthly-bundle-toy', petType: 'dog' },       // 10 lb
  'chicken-6lb::6lb':           { qty: 6, productId: 'chicken-6lb', petType: 'dog' },              // 6 lb meal
};
const catalog = [
  bundleGiant,
  { handle: 'monthly-bundle-toy', product_id: 'monthly-bundle-toy', name: 'Monthly Bundle Toy Breed - 10 lb', product_line: 'monthly_bundle', bundle_weight_lbs: 10 },
  mealChicken,
];
const dogTier = computeTierLbs({ selectedProteins: cart_64bundle_1meal, products: catalog, pet: 'dog' });
assert('60 + 10 + 6 = 76 lb tier total', dogTier === 76, dogTier, 76);

// User's exact spec example: 64 lb of bundles + 1 x 6-lb meal → meal in 70lb+ tier (15%)
const cart_spec = {
  'monthly-bundle-giant::size': { qty: 6, productId: 'monthly-bundle-giant', petType: 'dog' }, // 60
  'monthly-bundle-toy::size':   { qty: 6, productId: 'monthly-bundle-toy', petType: 'dog' },   //  10 (nearest to 64)
  'chicken-6lb::6lb':           { qty: 6, productId: 'chicken-6lb', petType: 'dog' },          //   6
};
const specTier = computeTierLbs({ selectedProteins: cart_spec, products: catalog, pet: 'dog' });
assert('spec-ish: 76 lb → crosses the 36lb (15%) tier', specTier >= 36, specTier, '≥36');

// Cats are a separate bucket — dog bundles shouldn't count toward cat tier
const cartMixed = {
  'monthly-bundle-giant::size': { qty: 6, productId: 'monthly-bundle-giant', petType: 'dog' }, // 60 dog
  'catfood-6lb::6lb':           { qty: 6, productId: 'catfood-6lb', petType: 'cat' },          //  6 cat
};
const catalog2 = [bundleGiant, { handle: 'catfood-6lb', product_id: 'catfood-6lb', product_line: 'royal_paws', name: 'Royal Paws' }];
const catTier = computeTierLbs({ selectedProteins: cartMixed, products: catalog2, pet: 'cat' });
assert('cat tier isolated: 6 lb only', catTier === 6, catTier, 6);
const dogTier2 = computeTierLbs({ selectedProteins: cartMixed, products: catalog2, pet: 'dog' });
assert('dog tier: giant bundle contributes 60', dogTier2 === 60, dogTier2, 60);

// excludeKey (ProductDetail case) — "other lbs" should NOT include the active line
const other = computeTierLbs({
  selectedProteins: cart_64bundle_1meal,
  products: catalog,
  pet: 'dog',
  excludeKey: 'chicken-6lb::6lb',
});
assert('excludeKey drops the active line', other === 70, other, 70);

console.log('\n--- activeProductTierLbs ---');
assert('active meal @ 6 lb → 6', activeProductTierLbs(mealChicken, 6) === 6, 6, 6);
assert('active giant bundle @ qty=6 → 60', activeProductTierLbs(bundleGiant, 6) === 60, 60, 60);
assert('active giant bundle @ qty=12 → 120', activeProductTierLbs(bundleGiant, 12) === 120, 120, 120);

console.log('\n' + (fails === 0 ? '🎉  ALL TESTS PASSED' : `❌  ${fails} TEST(S) FAILED`));
process.exit(fails);
