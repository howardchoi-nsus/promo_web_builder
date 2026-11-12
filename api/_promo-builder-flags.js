const FLAG_NAMES = Object.freeze({
  pageSchemaV1: "PAGE_SCHEMA_GENERATION_ENABLED",
  pageSchemaMedia: "PAGE_SCHEMA_MEDIA_PREPARATION_ENABLED",
  hallmarkDesign: "HALLMARK_DESIGN_ENABLED",
  aiMode: "PROMO_BUILDER_AI_MODE_ENABLED",
  proposal: "PROMO_PAGE_COMPOSITION_PROPOSAL_ENABLED",
  apply: "PROMO_PAGE_COMPOSITION_APPLY_ENABLED",
  motion: "PROMO_PAGE_COMPOSITION_MOTION_ENABLED",
  naturalLanguageEdit: "PROMO_PAGE_COMPOSITION_NL_EDIT_ENABLED",
  libraryMode: "PROMO_PAGE_COMPOSITION_LIBRARY_MODE_ENABLED",
  compositionV3: "AI_COMPOSITION_MODE_V3",
  templateLayoutManagement: "TEMPLATE_LAYOUT_MANAGEMENT_ENABLED",
  export: "PROMO_BUILDER_EXPORT_ENABLED",
  adminDomConfigWorkbench: "ADMIN_DOM_CONFIG_WORKBENCH_ENABLED",
  adminLegacyVisualConfigEditor: "ADMIN_LEGACY_VISUAL_CONFIG_EDITOR_ENABLED",
  nuxtRuntime: "NUXT_RUNTIME_ENABLED",
  nuxtSsr: "NUXT_SSR_ENABLED",
  directusConfigManagement: "DIRECTUS_CONFIG_MANAGEMENT_ENABLED",
  directusIntegration: "DIRECTUS_INTEGRATION_ENABLED",
  directusConnectionTunnel: "DIRECTUS_CONNECTION_TUNNEL_ENABLED",
  directusMigration: "DIRECTUS_MIGRATION_ENABLED",
  directusShadowRead: "DIRECTUS_SHADOW_READ_ENABLED",
  directusRuntimeRead: "DIRECTUS_RUNTIME_READ_ENABLED",
  directusRuntimeWrite: "DIRECTUS_RUNTIME_WRITE_ENABLED",
  serviceContractV3: "PROMO_SERVICE_CONTRACT_V3_ENABLED",
  chatWorkspaceV1: "PROMO_BUILDER_CHAT_WORKSPACE_V1_ENABLED",
  progressivePreviewReveal: "PROGRESSIVE_PREVIEW_REVEAL_V1_ENABLED",
  referenceComponentPublishing: "REFERENCE_COMPONENT_PUBLISHING_V1_ENABLED",
});

// New AI pages use recursive PageSchema generation. Explicit false is the
// rollback switch; existing documents retain their own renderer.
const FLAG_DEFAULTS = Object.freeze({
  pageSchemaV1: true,
  pageSchemaMedia: true,
  hallmarkDesign: true,
  compositionV3: true,
  // Keep existing installations operational until Preview/Production explicitly
  // disable authoring. This flag controls management writes, never legacy reads.
  templateLayoutManagement: true,
  adminDomConfigWorkbench: true,
  adminLegacyVisualConfigEditor: false,
  nuxtRuntime: true,
  nuxtSsr: true,
  directusConfigManagement: true,
  directusIntegration: false,
  directusConnectionTunnel: false,
  directusMigration: false,
  directusShadowRead: false,
  directusRuntimeRead: false,
  directusRuntimeWrite: false,
  // V3 is opt-in until its DB migration and Preview contract tests are complete.
  serviceContractV3: false,
  // Requires migration 077. Enable only after the target database is migrated.
  chatWorkspaceV1: false,
  // Progressive reveal is presentation-only and safe to enable by default.
  progressivePreviewReveal: true,
  // Requires migration 081. Enable only after the target database is migrated.
  referenceComponentPublishing: false,
});

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
