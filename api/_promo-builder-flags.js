const FLAG_NAMES = Object.freeze({
  aiMode: "PROMO_BUILDER_AI_MODE_ENABLED",
  proposal: "PROMO_PAGE_COMPOSITION_PROPOSAL_ENABLED",
  apply: "PROMO_PAGE_COMPOSITION_APPLY_ENABLED",
  motion: "PROMO_PAGE_COMPOSITION_MOTION_ENABLED",
  naturalLanguageEdit: "PROMO_PAGE_COMPOSITION_NL_EDIT_ENABLED",
  libraryMode: "PROMO_PAGE_COMPOSITION_LIBRARY_MODE_ENABLED",
  compositionV3: "AI_COMPOSITION_MODE_V3",
  export: "PROMO_BUILDER_EXPORT_ENABLED",
});

const FLAG_DEFAULTS = Object.freeze({ compositionV3: false });

function enabled(value, fallback = true) {
  if (value === undefined || value === null || value === "") return fallback;
  return !["false", "0", "off", "disabled"].includes(String(value).trim().toLowerCase());
}

function builderFlags(env = process.env) {
  return Object.fromEntries(Object.entries(FLAG_NAMES).map(([key, envName]) => [
    key,
    enabled(env[envName], FLAG_DEFAULTS[key] ?? true),
  ]));
}

function requireBuilderFlag(name, env = process.env) {
  const flags = builderFlags(env);
  if (!flags[name]) {
    const error = new Error(`Builder feature is disabled: ${name}`);
    error.statusCode = 404;
    error.code = "BUILDER_FEATURE_DISABLED";
    throw error;
  }
  return true;
}

module.exports = {
  FLAG_NAMES,
  enabled,
  builderFlags,
  requireBuilderFlag,
};
