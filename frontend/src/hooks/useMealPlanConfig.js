import { useEffect, useState } from 'react';
import { metaobjects } from '../services/shopify';

/**
 * Fetches the Shopify `meal_plan_config/foeguard_mealplan_config` metaobject
 * and returns a normalised, UI-ready shape for MealPlanPage + the recommendation
 * algorithm. Every field falls back to `null` / `[]` when the merchant hasn't
 * populated it yet, so callers should always use `??` fallbacks to their
 * hardcoded defaults — design + UX stay identical while Shopify is empty.
 *
 * Returned shape:
 * {
 *   ready: boolean,
 *   title: string | null,
 *   algorithmWeights: { health, age, weight, activity } | null,
 *   healthConditions: [{ id, label }],   // ids match the existing UI ids where possible
 *   activityLevels:   [{ id, label, desc }],
 *   weightGoals:      [{ id, label, desc }],
 *   proteins:         [{ id, label }],
 * }
 */

// Reverse maps from the recommendation service — canonical name → UI id used
// throughout MealPlanPage state (`dog.health_issues[]`, `dog.body_condition`,
// `dog.lifestyle`). These IDs MUST stay stable so the algorithm keeps working.
const HEALTH_NAME_TO_ID = {
  Allergies: 'allergies',
  Diabetes: 'diabetes',
  Constipation: 'constipation',
  Diarrhea: 'diarrhea',
  'Itchy Skin': 'itchy_skin',
  'Dry Coat': 'dry_coat',
  'Weight Management': 'obesity',
  Obesity: 'obesity',
  'Joint Issues': 'joint_issues',
  'Digestive Sensitivity': 'digestive_issues',
  'Digestive Issues': 'digestive_issues',
  Pancreatitis: 'pancreatitis',
  'Picky Eater': 'picky_eater',
  None: 'none',
};

const WEIGHT_GOAL_NAME_TO_ID = {
  Underweight: 'underweight',
  Fit: 'fit',
  Healthy: 'fit',
  Overweight: 'overweight',
};

const ACTIVITY_NAME_TO_ID = {
  'Lower Energy': 'lower_energy',
  Low: 'lower_energy',
  Active: 'active',
  Normal: 'active',
  'High Energy': 'high_energy',
  High: 'high_energy',
};

function slugify(s) {
  return String(s || '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '_')
    .replace(/^_|_$/g, '');
}

// Flatten Shopify rich_text_field JSON down to a single plain-text string.
function flattenRich(v) {
  if (!v) return null;
  if (typeof v === 'string' && !v.trim().startsWith('{')) return v;
  let json = v;
  if (typeof v === 'string') {
    try { json = JSON.parse(v); } catch { return v; }
  }
  const parts = [];
  const walk = (n) => {
    if (!n) return;
    if (typeof n === 'string') { parts.push(n); return; }
    if (n.value) parts.push(n.value);
    (n.children || []).forEach(walk);
  };
  walk(json);
  return parts.join(' ').replace(/\s+/g, ' ').trim() || null;
}

export function useMealPlanConfig() {
  const [state, setState] = useState({
    ready: false,
    title: null,
    algorithmWeights: null,
    healthConditions: [],
    activityLevels: [],
    weightGoals: [],
    proteins: [],
  });

  useEffect(() => {
    let alive = true;
    metaobjects
      .getMetaobject('meal_plan_config', 'foeguard_mealplan_config')
      .then((obj) => {
        if (!alive) return;
        if (!obj) { setState((s) => ({ ...s, ready: true })); return; }
        const f = obj.fields || {};

        // algorithm_weights: metaobject_reference → nested { algorithm_weights: json }
        let weights = null;
        const wRef = f.algorithm_weights;
        if (wRef && wRef.fields) {
          weights = wRef.fields.algorithm_weights || null;
        }

        const healthConditions = (f.health_conditions || []).map((n) => {
          const name = n?.fields?.health_condition_name || null;
          if (!name) return null;
          return {
            id: HEALTH_NAME_TO_ID[name] || slugify(name),
            label: name,
          };
        }).filter(Boolean);

        const activityLevels = (f.activity_levels || []).map((n) => {
          const name = n?.fields?.activity_level_name || null;
          if (!name) return null;
          return {
            id: ACTIVITY_NAME_TO_ID[name] || slugify(name),
            label: name,
            desc: flattenRich(n?.fields?.activity_level_description),
          };
        }).filter(Boolean);

        const weightGoals = (f.weight_goals || []).map((n) => {
          const name = n?.fields?.weight_goal_name || null;
          if (!name) return null;
          return {
            id: WEIGHT_GOAL_NAME_TO_ID[name] || slugify(name),
            label: name,
            desc: flattenRich(n?.fields?.weight_goal_description),
          };
        }).filter(Boolean);

        const proteins = (f.protein_options || []).map((n) => {
          const name = n?.fields?.protein_name || null;
          if (!name) return null;
          return { id: slugify(name), label: name };
        }).filter(Boolean);

        setState({
          ready: true,
          title: f.title || null,
          algorithmWeights: weights,
          healthConditions,
          activityLevels,
          weightGoals,
          proteins,
        });
      })
      .catch(() => {
        if (!alive) return;
        setState((s) => ({ ...s, ready: true }));
      });

    return () => { alive = false; };
  }, []);

  return state;
}

export default useMealPlanConfig;
