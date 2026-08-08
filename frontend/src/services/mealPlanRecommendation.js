// ============================================================================
// FoeGuard Meal Plan Recommendation Algorithm
// ----------------------------------------------------------------------------
// Two data sources (kept as pure, exported constants so they can be swapped
// for Shopify metafield data later without touching the algorithm itself):
//   1. MEAL_PLAN_CONFIG   — algorithm weights + human-readable option maps
//   2. PROTEIN_SCORES     — 1-5 score per protein per category (5 = best match)
//
// Final score = health_avg * 0.40  +  age * 0.30  +  weight * 0.15  +  activity * 0.15
// Multiple health conditions are AVERAGED before weighting.
// Nothing is hard-coded downstream — recommendations are calculated dynamically
// from these objects, so tweaking a score here updates every user's plan.
// ============================================================================

// ---------------------------------------------------------------------------
// 1. MEAL PLAN CONFIGURATION
// ---------------------------------------------------------------------------
export const MEAL_PLAN_CONFIG = {
  weights: {
    health: 0.40,
    age: 0.30,
    weight: 0.15,
    activity: 0.15,
  },
  // Categories used by the algorithm (canonical keys)
  health_conditions: [
    'Allergies', 'Diabetes', 'Constipation', 'Diarrhea', 'Itchy Skin',
    'Dry Coat', 'Weight Management', 'Joint Issues', 'Digestive Sensitivity',
    'Pancreatitis', 'Picky Eater', 'None',
  ],
  weight_goals:   ['Underweight', 'Healthy', 'Overweight'],
  activity_levels: ['Low', 'Normal', 'High'],
  age_groups:     ['Puppy', 'Adult', 'Senior'],
};

/**
 * Merge Shopify-driven overrides into the algorithm weights. Called by
 * MealPlanPage after `useMealPlanConfig()` resolves. Only accepts numeric
 * values on the four known keys and ignores anything else, so a malformed
 * metaobject can never blank out the weights.
 */
export const setAlgorithmWeights = (partial) => {
  if (!partial || typeof partial !== 'object') return;
  const next = { ...MEAL_PLAN_CONFIG.weights };
  for (const k of ['health', 'age', 'weight', 'activity']) {
    const v = partial[k];
    if (typeof v === 'number' && isFinite(v) && v >= 0) next[k] = v;
  }
  MEAL_PLAN_CONFIG.weights = next;
};

// ---------------------------------------------------------------------------
// 2. PROTEIN SCORES  (1–5, 5 = best match)
// ---------------------------------------------------------------------------
export const PROTEIN_SCORES = {
  Beef: {
    health: { Allergies: 2, Diabetes: 3, Constipation: 3, Diarrhea: 3, 'Itchy Skin': 3, 'Dry Coat': 3, 'Weight Management': 2, 'Joint Issues': 4, 'Digestive Sensitivity': 3, Pancreatitis: 1, 'Picky Eater': 5, None: 5 },
    weight:   { Underweight: 5, Healthy: 4, Overweight: 2 },
    activity: { Low: 3, Normal: 4, High: 5 },
    age:      { Puppy: 4, Adult: 5, Senior: 3 },
  },
  Chicken: {
    health: { Allergies: 2, Diabetes: 4, Constipation: 4, Diarrhea: 4, 'Itchy Skin': 3, 'Dry Coat': 3, 'Weight Management': 4, 'Joint Issues': 3, 'Digestive Sensitivity': 4, Pancreatitis: 3, 'Picky Eater': 5, None: 4 },
    weight:   { Underweight: 3, Healthy: 5, Overweight: 5 },
    activity: { Low: 4, Normal: 5, High: 4 },
    age:      { Puppy: 5, Adult: 5, Senior: 4 },
  },
  Duck: {
    health: { Allergies: 4, Diabetes: 2, Constipation: 3, Diarrhea: 4, 'Itchy Skin': 4, 'Dry Coat': 4, 'Weight Management': 2, 'Joint Issues': 3, 'Digestive Sensitivity': 4, Pancreatitis: 1, 'Picky Eater': 5, None: 4 },
    weight:   { Underweight: 5, Healthy: 3, Overweight: 2 },
    activity: { Low: 2, Normal: 3, High: 4 },
    age:      { Puppy: 3, Adult: 4, Senior: 3 },
  },
  'Wild-Caught Fish': {
    health: { Allergies: 4, Diabetes: 5, Constipation: 4, Diarrhea: 4, 'Itchy Skin': 5, 'Dry Coat': 5, 'Weight Management': 5, 'Joint Issues': 5, 'Digestive Sensitivity': 4, Pancreatitis: 3, 'Picky Eater': 4, None: 5 },
    weight:   { Underweight: 3, Healthy: 5, Overweight: 5 },
    activity: { Low: 4, Normal: 5, High: 4 },
    age:      { Puppy: 5, Adult: 5, Senior: 5 },
  },
  Goat: {
    health: { Allergies: 5, Diabetes: 4, Constipation: 4, Diarrhea: 5, 'Itchy Skin': 4, 'Dry Coat': 4, 'Weight Management': 4, 'Joint Issues': 4, 'Digestive Sensitivity': 5, Pancreatitis: 3, 'Picky Eater': 4, None: 5 },
    weight:   { Underweight: 3, Healthy: 5, Overweight: 4 },
    activity: { Low: 4, Normal: 5, High: 3 },
    age:      { Puppy: 3, Adult: 5, Senior: 5 },
  },
  Lamb: {
    health: { Allergies: 4, Diabetes: 3, Constipation: 3, Diarrhea: 4, 'Itchy Skin': 4, 'Dry Coat': 4, 'Weight Management': 2, 'Joint Issues': 4, 'Digestive Sensitivity': 4, Pancreatitis: 1, 'Picky Eater': 5, None: 4 },
    weight:   { Underweight: 5, Healthy: 4, Overweight: 2 },
    activity: { Low: 2, Normal: 4, High: 5 },
    age:      { Puppy: 3, Adult: 5, Senior: 3 },
  },
  Rabbit: {
    health: { Allergies: 5, Diabetes: 5, Constipation: 5, Diarrhea: 5, 'Itchy Skin': 4, 'Dry Coat': 4, 'Weight Management': 5, 'Joint Issues': 4, 'Digestive Sensitivity': 5, Pancreatitis: 4, 'Picky Eater': 4, None: 5 },
    weight:   { Underweight: 2, Healthy: 5, Overweight: 5 },
    activity: { Low: 5, Normal: 5, High: 3 },
    age:      { Puppy: 4, Adult: 5, Senior: 5 },
  },
  Turkey: {
    health: { Allergies: 3, Diabetes: 5, Constipation: 5, Diarrhea: 5, 'Itchy Skin': 4, 'Dry Coat': 4, 'Weight Management': 5, 'Joint Issues': 4, 'Digestive Sensitivity': 5, Pancreatitis: 3, 'Picky Eater': 4, None: 5 },
    weight:   { Underweight: 2, Healthy: 5, Overweight: 5 },
    activity: { Low: 5, Normal: 5, High: 3 },
    age:      { Puppy: 4, Adult: 5, Senior: 5 },
  },
};

// ---------------------------------------------------------------------------
// 2b. SHOPIFY-SOURCED SCORES
// ---------------------------------------------------------------------------
// The merchant maintains the real per-product scores in the Shopify metaobject
// `meal_plan_score` (field `product_score_json`), referenced by each Complete &
// Balanced dinner via the `foeguard.product_meal_plan_scores` metafield. The
// JSON shape is:
//   { product:"Chicken",
//     health_scores:{allergies,diabetes,constipation,diarrhea,itchy_skin,
//                    dry_coat,weight_management,joint_issues,
//                    digestive_sensitivity,pancreatitis,picky_eater,none},
//     weight_scores:{underweight,healthy_weight,overweight},
//     activity_scores:{low,normal,high},
//     age_scores:{puppy,adult,senior} }
// We convert those snake_case keys to the algorithm's canonical keys and
// OVERRIDE the hardcoded PROTEIN_SCORES so every user's plan is driven by the
// live metaobject data. Anything missing falls back to 1 at scoring time.

const SHOPIFY_HEALTH_KEY_MAP = {
  allergies: 'Allergies', diabetes: 'Diabetes', constipation: 'Constipation',
  diarrhea: 'Diarrhea', itchy_skin: 'Itchy Skin', dry_coat: 'Dry Coat',
  weight_management: 'Weight Management', joint_issues: 'Joint Issues',
  digestive_sensitivity: 'Digestive Sensitivity', pancreatitis: 'Pancreatitis',
  picky_eater: 'Picky Eater', none: 'None',
};
const SHOPIFY_WEIGHT_KEY_MAP = { underweight: 'Underweight', healthy_weight: 'Healthy', overweight: 'Overweight' };
const SHOPIFY_ACTIVITY_KEY_MAP = { low: 'Low', normal: 'Normal', high: 'High' };
const SHOPIFY_AGE_KEY_MAP = { puppy: 'Puppy', adult: 'Adult', senior: 'Senior' };

// Normalise the metaobject `product` label to a canonical PROTEIN_SCORES key.
const normalizeProteinName = (name) => {
  if (!name || typeof name !== 'string') return null;
  const t = name.trim().toLowerCase();
  if (/fish/.test(t)) return 'Wild-Caught Fish';
  const known = { beef: 'Beef', chicken: 'Chicken', duck: 'Duck', goat: 'Goat', lamb: 'Lamb', rabbit: 'Rabbit', turkey: 'Turkey' };
  return known[t] || name.trim();
};

const remap = (obj, keyMap) => {
  const out = {};
  if (obj && typeof obj === 'object') {
    Object.entries(obj).forEach(([k, v]) => {
      const canon = keyMap[String(k).toLowerCase()];
      if (canon && typeof v === 'number') out[canon] = v;
    });
  }
  return out;
};

/** Convert a parsed product_score_json into the internal PROTEIN_SCORES shape. */
export const shopifyScoreToInternal = (j) => ({
  health: remap(j.health_scores, SHOPIFY_HEALTH_KEY_MAP),
  weight: remap(j.weight_scores, SHOPIFY_WEIGHT_KEY_MAP),
  activity: remap(j.activity_scores, SHOPIFY_ACTIVITY_KEY_MAP),
  age: remap(j.age_scores, SHOPIFY_AGE_KEY_MAP),
});

// Pull the raw product_score_json string out of a RAW Shopify product node
// (as returned by GET /api/shopify/products). Returns null if absent.
const extractScoreJson = (product) => {
  const mfs = (product && product.metafields) || [];
  const mf = mfs.find((m) => m && m.key === 'product_meal_plan_scores');
  if (!mf) return null;
  let raw = null;
  const ref = mf.reference;
  if (ref && Array.isArray(ref.fields)) {
    const f = ref.fields.find((x) => x && x.key === 'product_score_json');
    if (f && f.value) raw = f.value;
  }
  if (!raw && typeof mf.value === 'string' && mf.value.trim().startsWith('{')) raw = mf.value;
  if (!raw) return null;
  try { return typeof raw === 'string' ? JSON.parse(raw) : raw; } catch { return null; }
};

let _shopifyScoresApplied = false;
export const shopifyScoresApplied = () => _shopifyScoresApplied;

/**
 * Override PROTEIN_SCORES from a list of RAW Shopify products (each with a
 * `metafields` array). Only products carrying `product_meal_plan_scores` are
 * used — these are the Complete & Balanced dinners. Returns the number of
 * proteins whose scores were sourced from Shopify. Safe to call repeatedly.
 */
export const setProteinScoresFromShopify = (rawProducts) => {
  if (!Array.isArray(rawProducts)) return 0;
  let count = 0;
  rawProducts.forEach((p) => {
    const j = extractScoreJson(p);
    if (!j) return;
    const name = normalizeProteinName(j.product);
    if (!name) return;
    const internal = shopifyScoreToInternal(j);
    // Only apply if it actually carried health data (avoid blanking a protein).
    if (internal.health && Object.keys(internal.health).length) {
      PROTEIN_SCORES[name] = internal;
      count += 1;
    }
  });
  if (count > 0) _shopifyScoresApplied = true;
  return count;
};
// (Kept in one place so the survey UI can evolve without breaking the algorithm.)
// ---------------------------------------------------------------------------

// Survey health-issue ids  →  algorithm health-condition keys.
// Ids that are NOT scored (e.g. cancer / kidney_disease / seizures) go through
// the consultation flow instead and are ignored here.
export const HEALTH_ID_TO_KEY = {
  allergies: 'Allergies',
  diabetes: 'Diabetes',
  constipation: 'Constipation',
  diarrhea: 'Diarrhea',
  itchy_skin: 'Itchy Skin',
  dry_coat: 'Dry Coat',
  obesity: 'Weight Management',
  joint_issues: 'Joint Issues',
  digestive_issues: 'Digestive Sensitivity',
  pancreatitis: 'Pancreatitis',
  picky_eater: 'Picky Eater',
  none: 'None',
};

export const BODY_CONDITION_TO_KEY = {
  underweight: 'Underweight',
  fit: 'Healthy',
  overweight: 'Overweight',
};

export const LIFESTYLE_TO_KEY = {
  lower_energy: 'Low',
  active: 'Normal',
  high_energy: 'High',
};

/**
 * Convert an ISO/YYYY-MM-DD birthday to an age group.
 *   Puppy  < 1 yr
 *   Adult  1 – 7 yrs
 *   Senior > 7 yrs
 * Defaults to 'Adult' if birthday is missing/invalid.
 */
export const birthdayToAgeGroup = (birthday) => {
  if (!birthday) return 'Adult';
  const born = new Date(birthday);
  if (isNaN(born.getTime())) return 'Adult';
  const now = new Date();
  const ageYears = (now - born) / (365.25 * 24 * 60 * 60 * 1000);
  if (ageYears < 1) return 'Puppy';
  if (ageYears <= 7) return 'Adult';
  return 'Senior';
};

// ---------------------------------------------------------------------------
// Core scoring — pure function
// ---------------------------------------------------------------------------

/**
 * Compute a per-protein score for a single dog profile.
 *
 * @param {object} profile
 * @param {string[]} profile.healthConditions  Canonical keys (e.g. 'Allergies'). Empty → uses 'None'.
 * @param {string}  profile.weightGoal         'Underweight' | 'Healthy' | 'Overweight'
 * @param {string}  profile.activityLevel      'Low' | 'Normal' | 'High'
 * @param {string}  profile.ageGroup           'Puppy' | 'Adult' | 'Senior'
 * @returns {Array<{protein:string, score:number, breakdown:object}>} sorted desc
 */
export const calculateProteinScores = (profile) => {
  const { weights } = MEAL_PLAN_CONFIG;
  const conditions = (profile.healthConditions && profile.healthConditions.length)
    ? profile.healthConditions
    : ['None'];

  const results = Object.entries(PROTEIN_SCORES).map(([protein, scores]) => {
    // Health = average across all selected conditions.
    // Per user spec: if a product LACKS a score for a condition, treat it as 1.
    const health = scores.health || {};
    const healthValues = conditions
      .map((c) => (typeof health[c] === 'number' ? health[c] : 1));
    const healthAvg = healthValues.length
      ? healthValues.reduce((a, b) => a + b, 0) / healthValues.length
      : 1;

    const ageVal      = (scores.age && typeof scores.age[profile.ageGroup] === 'number') ? scores.age[profile.ageGroup] : 1;
    const weightVal   = (scores.weight && typeof scores.weight[profile.weightGoal] === 'number') ? scores.weight[profile.weightGoal] : 1;
    const activityVal = (scores.activity && typeof scores.activity[profile.activityLevel] === 'number') ? scores.activity[profile.activityLevel] : 1;

    const final =
      healthAvg   * weights.health +
      ageVal      * weights.age +
      weightVal   * weights.weight +
      activityVal * weights.activity;

    return {
      protein,
      score: Number(final.toFixed(3)),
      breakdown: {
        healthAvg:   Number(healthAvg.toFixed(2)),
        age:         ageVal,
        weight:      weightVal,
        activity:    activityVal,
      },
    };
  });

  return results.sort((a, b) => b.score - a.score);
};

/**
 * Convenience wrapper: take the raw survey answers directly off the dog object
 * used in MealPlanPage and produce a ranked recommendation list.
 *
 * @param {object} dog  raw dog object from MealPlanPage state
 * @param {number} topN number of recommendations to return (default 3)
 */
export const getRecommendationsForDog = (dog, topN = 3) => {
  const healthConditions = (dog.health_issues || [])
    .map((id) => HEALTH_ID_TO_KEY[id])
    .filter(Boolean); // drop unmapped ids (consultation issues)

  const profile = {
    healthConditions,
    weightGoal:    BODY_CONDITION_TO_KEY[dog.body_condition] || 'Healthy',
    activityLevel: LIFESTYLE_TO_KEY[dog.lifestyle]           || 'Normal',
    ageGroup:      birthdayToAgeGroup(dog.birthday),
  };

  const ranked = calculateProteinScores(profile);
  return {
    profile,
    all: ranked,
    top: ranked.slice(0, topN),
  };
};
