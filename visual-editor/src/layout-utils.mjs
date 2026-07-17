import { DEFAULT_DESIGN_SPEC } from "./contracts.js";

function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

function mergeRecord(base = {}, override = {}) {
  const result = { ...base };
  Object.entries(override || {}).forEach(([key, value]) => {
    if (value === undefined) return;
    if (value && typeof value === "object" && !Array.isArray(value)
      && result[key] && typeof result[key] === "object" && !Array.isArray(result[key])) {
      result[key] = mergeRecord(result[key], value);
    } else {
      result[key] = clone(value);
    }
  });
  return result;
}

export function normalizeLayoutSpec(value = {}) {
  return mergeLayoutSpec(DEFAULT_DESIGN_SPEC, value);
}

export function mergeLayoutSpec(base = DEFAULT_DESIGN_SPEC, override = {}) {
  const merged = mergeRecord(clone(base || DEFAULT_DESIGN_SPEC), override || {});
  merged.contractVersion = Number(merged.contractVersion || 1);
  merged.specKey = String(merged.specKey || "default");
  merged.theme = merged.theme || {};
  merged.responsive = merged.responsive || {};
  merged.itemStyles = merged.itemStyles || {};
  merged.sectionStyles = merged.sectionStyles || {};
  return merged;
}

export function validateLayoutSpec(value = {}) {
  const spec = normalizeLayoutSpec(value);
  const errors = [];
  const allowedAlign = new Set(["left", "center", "right"]);
  Object.entries(spec.sectionStyles).forEach(([key, style]) => {
    const height = Number(style?.minHeight);
    if (style?.minHeight !== undefined && (!Number.isFinite(height) || height < 50 || height > 1200)) {
      errors.push({ path: `sectionStyles.${key}.minHeight`, message: "Section height must be between 50 and 1200." });
    }
  });
  Object.entries(spec.itemStyles).forEach(([key, style]) => {
    const x = Number(style?.xPct);
    const y = Number(style?.yPx);
    const size = Number(style?.fontSize);
    if (style?.xPct !== undefined && (!Number.isFinite(x) || x < 0 || x > 100)) {
      errors.push({ path: `itemStyles.${key}.xPct`, message: "xPct must be between 0 and 100." });
    }
    if (style?.yPx !== undefined && (!Number.isFinite(y) || y < 0 || y > 1200)) {
      errors.push({ path: `itemStyles.${key}.yPx`, message: "yPx must be between 0 and 1200." });
    }
    if (style?.fontSize !== undefined && (!Number.isFinite(size) || size < 10 || size > 80)) {
      errors.push({ path: `itemStyles.${key}.fontSize`, message: "fontSize must be between 10 and 80." });
    }
    if (style?.textAlign !== undefined && !allowedAlign.has(style.textAlign)) {
      errors.push({ path: `itemStyles.${key}.textAlign`, message: "Unsupported text alignment." });
    }
  });
  return { ok: errors.length === 0, errors, spec };
}

export function createLayoutSnapshot({ baseLayout, userLayout, layoutRevision = 1, renderer = {} }) {
  const resolvedLayout = mergeLayoutSpec(baseLayout, userLayout);
  return {
    contractVersion: resolvedLayout.contractVersion,
    layoutRevision: Number(layoutRevision || 1),
    renderer: {
      key: renderer.key || "default-promo-renderer",
      version: Number(renderer.version || 1),
    },
    baseLayout: clone(baseLayout || DEFAULT_DESIGN_SPEC),
    userLayout: clone(userLayout || {}),
    resolvedLayout,
  };
}
