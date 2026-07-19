/**
 * Product metafield renderers (Prompt 2 component mapping)
 *
 *   ingredients          -> <IngredientsSection />
 *   nutritional_analysis -> <NutritionSection />
 *   feeding_guide        -> <FeedingGuide />
 *   product_information  -> <ProductInfo />
 *   comparison_table     -> <ComparisonTable />
 *   benefit_icons        -> <BenefitIcons />
 *
 * IMPORTANT: none of these components render raw HTML from Shopify. If a
 * metafield value contains HTML it is escaped as text so unknown markup is
 * never auto-rendered. Rich text is stored as structured data
 * (JSON / list) per the METAFIELDS.md spec.
 *
 * Every component returns `null` when its metafield is empty. Missing
 * metafields are logged by the normalizer, so consumers don't need to.
 */
import React from 'react';
import { Check } from 'lucide-react';

const containerStyle = {
  fontFamily: "'Barlow Semi Condensed', serif",
  color: '#2C2C2C',
  fontSize: '15px',
  lineHeight: 1.7,
};

// ---------- Ingredients --------------------------------------------------

export const IngredientsSection = ({ value }) => {
  if (!value) return null;
  // value can be a plain string, a list of strings, or a comma-separated string.
  let items = [];
  if (Array.isArray(value)) items = value.filter(Boolean);
  else if (typeof value === 'string') {
    items = value.split(/[,\n\u2022]+/).map((s) => s.trim()).filter(Boolean);
  }
  if (items.length === 0) return null;
  return (
    <ul
      data-testid="ingredients-section"
      style={{ ...containerStyle, margin: 0, padding: 0, listStyle: 'none' }}
    >
      {items.map((it, i) => (
        <li
          key={i}
          style={{
            padding: '6px 0',
            borderBottom: i < items.length - 1 ? '1px solid #F0EBE3' : 'none',
          }}
        >
          {it}
        </li>
      ))}
    </ul>
  );
};

// ---------- Nutritional analysis ----------------------------------------

export const NutritionSection = ({ value }) => {
  if (!value || typeof value !== 'object') return null;
  const entries = Array.isArray(value) ? value : Object.entries(value);
  const normalized = entries.map((e) =>
    Array.isArray(e) ? { label: e[0], value: e[1] } : e
  );
  if (normalized.length === 0) return null;
  return (
    <table
      data-testid="nutrition-section"
      style={{ ...containerStyle, width: '100%', borderCollapse: 'collapse' }}
    >
      <tbody>
        {normalized.map((row, i) => (
          <tr key={i} style={{ borderBottom: '1px solid #F0EBE3' }}>
            <td style={{ padding: '8px 0', fontWeight: 500 }}>{String(row.label)}</td>
            <td style={{ padding: '8px 0', textAlign: 'right', fontWeight: 700, color: '#3B2A1A' }}>
              {String(row.value)}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

// ---------- Feeding guide ----------------------------------------------

export const FeedingGuide = ({ value }) => {
  if (!value) return null;
  // value is JSON { feeding: string, handling: string } or a plain string.
  if (typeof value === 'string') {
    return (
      <p data-testid="feeding-guide" style={containerStyle}>
        {value}
      </p>
    );
  }
  const { feeding, handling } = value || {};
  if (!feeding && !handling) return null;
  return (
    <div data-testid="feeding-guide" style={containerStyle}>
      {feeding && (
        <>
          <h4 style={{ margin: '0 0 6px', fontSize: '14px', fontWeight: 700, color: '#3B2A1A' }}>Feeding</h4>
          <p style={{ margin: '0 0 12px' }}>{feeding}</p>
        </>
      )}
      {handling && (
        <>
          <h4 style={{ margin: '0 0 6px', fontSize: '14px', fontWeight: 700, color: '#3B2A1A' }}>Handling &amp; storage</h4>
          <p style={{ margin: 0 }}>{handling}</p>
        </>
      )}
    </div>
  );
};

// ---------- Product information ----------------------------------------

export const ProductInfo = ({ value }) => {
  if (!value || typeof value !== 'string') return null;
  return (
    <p data-testid="product-info" style={{ ...containerStyle, whiteSpace: 'pre-wrap' }}>
      {value}
    </p>
  );
};

// ---------- Comparison table -------------------------------------------

export const ComparisonTable = ({ value }) => {
  if (!value || typeof value !== 'object') return null;
  // Two supported shapes:
  //   { headers: ['Attribute', 'FoeGuard', 'Kibble', 'Cooked'],
  //     rows:    [['Human-grade', '\u2705', '\u274c', '\u274c'], ...] }
  //   { rows: [{ attribute: '...', foeguard: '\u2705', kibble: '\u274c', ... }, ...] }
  let headers = value.headers;
  let rows = value.rows || [];

  if (rows.length > 0 && !Array.isArray(rows[0])) {
    // dictionary rows \u2192 pivot into headers + array rows
    const keys = Object.keys(rows[0]);
    if (!headers) headers = keys.map((k) => k.charAt(0).toUpperCase() + k.slice(1));
    rows = rows.map((r) => keys.map((k) => r[k]));
  }

  if (!Array.isArray(rows) || rows.length === 0) return null;

  return (
    <table
      data-testid="comparison-table"
      style={{
        ...containerStyle,
        width: '100%',
        borderCollapse: 'collapse',
        border: '1px solid #EDEAE7',
      }}
    >
      {headers && (
        <thead>
          <tr style={{ background: '#F5F1EB' }}>
            {headers.map((h, i) => (
              <th
                key={i}
                style={{
                  padding: '10px 12px',
                  textAlign: i === 0 ? 'left' : 'center',
                  fontWeight: 700,
                  color: '#3B2A1A',
                  fontSize: '13px',
                  borderBottom: '1px solid #EDEAE7',
                }}
              >
                {String(h)}
              </th>
            ))}
          </tr>
        </thead>
      )}
      <tbody>
        {rows.map((row, ri) => (
          <tr key={ri} style={{ borderBottom: ri < rows.length - 1 ? '1px solid #F0EBE3' : 'none' }}>
            {row.map((cell, ci) => (
              <td
                key={ci}
                style={{
                  padding: '10px 12px',
                  textAlign: ci === 0 ? 'left' : 'center',
                  fontWeight: ci === 0 ? 600 : 500,
                }}
              >
                {String(cell)}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
};

// ---------- Benefit icons ----------------------------------------------

export const BenefitIcons = ({ value }) => {
  if (!value) return null;
  // Accepts JSON [{ icon, label }, ...] OR ['Text 1', 'Text 2', ...]
  let items = [];
  if (Array.isArray(value)) {
    items = value.map((v) =>
      typeof v === 'string' ? { label: v } : (v && typeof v === 'object' ? v : null)
    ).filter(Boolean);
  }
  if (items.length === 0) return null;
  return (
    <ul
      data-testid="benefit-icons"
      style={{ ...containerStyle, listStyle: 'none', margin: 0, padding: 0 }}
    >
      {items.map((it, i) => (
        <li
          key={i}
          style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', padding: '4px 0' }}
        >
          <Check size={18} color="#2E7D32" style={{ flexShrink: 0, marginTop: '2px' }} />
          <span>{String(it.label ?? it)}</span>
        </li>
      ))}
    </ul>
  );
};

export default {
  IngredientsSection,
  NutritionSection,
  FeedingGuide,
  ProductInfo,
  ComparisonTable,
  BenefitIcons,
};
