const { createHash } = require("node:crypto");
const {
  fetchTemplates,
  fetchTemplateSections,
} = require("./_wizard-form-templates-store");
const {
  fetchItemsForSection,
  normalizeAiDesign,
  normalizeCompositionPolicy,
} = require("./_wizard-content-sections-store");
const { fetchLayoutsForSection } = require("./_wizard-content-section-layouts-store");
const {
  fetchTokenSets,
  fetchTokenVersion,
  toRuntimeTokenMap,
} = require("./_design-token-store");
const { resolveAllowedLayoutPresets } = require("./_promo-layout-preset-policy");

function stableStringify(value) {
  if (Array.isArray(value)) return `[${value.map(stableStringify).join(",")}]`;
  if (value && typeof value === "object") {
    return `{${Object.keys(value).sort().map((key) => (
      `${JSON.stringify(key)}:${stableStringify(value[key])}`
    )).join(",")}}`;
  }
  return JSON.stringify(value);
}

function fingerprint(value) {
  return createHash("sha256").update(stableStringify(value)).digest("hex");
}

function policyRequiresSection(section, overview, selectedOptionalSectionIds) {
  const policy = normalizeCompositionPolicy(section.compositionPolicy, section);
  if (section.fixedPosition || section.isRequired || policy.selectionPolicy === "required") return true;
  if (selectedOptionalSectionIds.includes(section.sectionId)) return true;
  if (policy.selectionPolicy === "required-by-market") {
    return policy.allowedMarkets.length === 0
      || policy.allowedMarkets.includes(String(overview.market || ""));
  }
  if (policy.selectionPolicy === "required-by-purpose") {
    return policy.allowedPromotionPurposes.length === 0
      || policy.allowedPromotionPurposes.includes(String(overview.promotionPurpose || ""));
  }
  return false;
}

async function fetchPageCompositionCandidates(sql, {
  overview = {},
  selectedOptionalSectionIds = [],
  templateLimit = 5,
} = {}) {
  const selectedIds = Array.from(new Set(
    selectedOptionalSectionIds.map((id) => String(id || "").trim()).filter(Boolean),
  ));
  const templates = (await fetchTemplates(sql, { activeOnly: true })).slice(0, templateLimit);
  const candidateTemplates = [];
  for (const template of templates) {
    const memberships = (await fetchTemplateSections(sql, template.id))
      .filter((section) => section.sectionId && section.sectionStatus === "active" && section.isVisible);
    const sections = [];
    for (const membership of memberships) {
      const items = (await fetchItemsForSection(sql, membership.sectionId))
        .filter((item) => item.isVisibleInWizard && item.componentVersionId);
      if (!items.length) continue;
      const policy = normalizeCompositionPolicy(
        membership.compositionPolicy,
        membership,
      );
      const aiDesign = normalizeAiDesign(membership.aiDesign);
      const layoutPresets = await fetchLayoutsForSection(sql, membership.sectionId);
      const layoutPolicy = resolveAllowedLayoutPresets({
        aiDesign,
        compositionPolicy: policy,
      }, layoutPresets, { fallbackToDefault: true });
      const defaultLayoutKey = layoutPolicy.defaultLayoutKey || "";
      const selectableLayoutVariants = layoutPresets.length
        ? layoutPolicy.allowedLayoutKeys
        : (policy.allowedLayoutVariants.length ? policy.allowedLayoutVariants : ["default"]);
      const allowedLayoutVariants = policy.layoutLocked
        ? [defaultLayoutKey || selectableLayoutVariants[0] || "default"]
        : selectableLayoutVariants;
      sections.push({
        sectionId: membership.sectionId,
        sectionKey: membership.sectionKey,
        name: membership.sectionName,
        description: membership.sectionDescription,
        version: membership.sectionVersion,
        sortOrder: membership.sortOrder,
        fixedPosition: membership.fixedPosition,
        isRequired: membership.isRequired,
        compositionScope: membership.compositionScope || "template",
        sectionRole: membership.sectionRole || "content",
        compositionPolicy: policy,
        aiDesign,
        layoutSelectionLocked: policy.layoutLocked,
        resolvedRequired: policyRequiresSection(
          { ...membership, compositionPolicy: policy },
          overview,
          selectedIds,
        ),
        allowedLayoutVariants,
        defaultLayoutKey: defaultLayoutKey || null,
        layoutPresets,
        components: items.map((item) => ({
          componentInstanceId: item.id,
          itemKey: item.itemKey,
          name: item.name,
          description: item.description,
          componentVersionId: item.componentVersionId,
          fieldKind: item.fieldKind,
          textType: item.textType,
          isRequired: item.isRequired,
          isLocked: item.isLocked,
          lockedValue: item.lockedValue,
          styleSlots: item.styleSlots || [],
          fields: (item.fields?.length ? item.fields : [{
            fieldKey: item.itemKey,
            name: item.name,
            description: item.description,
            fieldKind: item.fieldKind,
            textType: item.textType,
            isRequired: item.isRequired,
            isLocked: item.isLocked,
            defaultValue: item.defaultValue,
            styleSlots: item.styleSlots || [],
          }]).map((field) => ({
            fieldKey: field.fieldKey,
            name: field.name,
            description: field.description,
            fieldKind: field.fieldKind,
            textType: field.textType,
            isRequired: field.isRequired,
            isLocked: field.isLocked,
            defaultValue: field.defaultValue,
            styleSlots: field.styleSlots || [],
            image: field.image || null,
          })),
          definition: item,
        })),
      });
    }
    if (sections.length) {
      candidateTemplates.push({
        templateId: template.id,
        templateKey: template.templateKey,
        templateVersion: template.version,
        name: template.name,
        description: template.description,
        sections,
      });
    }
  }

  const tokenSetRows = await fetchTokenSets(sql, { activeOnly: true });
  const tokenSets = [];
  for (const row of tokenSetRows.slice(0, 12)) {
    if (!row.versionId) continue;
    const version = await fetchTokenVersion(sql, row.versionId);
    if (!version) continue;
    tokenSets.push({
      tokenSetId: row.id,
      tokenSetVersionId: row.versionId,
      setKey: row.setKey,
      name: row.name,
      isDefault: row.isDefault,
      runtimeValues: toRuntimeTokenMap(version.values),
      selectableTokens: version.values
        .filter((value) => value.aiSelectable)
        .map((value) => ({
          tokenKey: value.tokenKey,
          category: value.category,
          semanticRole: value.semanticRole,
          values: [value.value, value.valueLight, value.valueDark].filter(Boolean),
        })),
    });
  }

  const motionRows = await sql`
    select preset.preset_key, preset.name, version.id::text as version_id,
      version.version, version.config_json
    from promo_motion_presets preset
    join promo_motion_preset_versions version
      on version.preset_id = preset.id and version.status = 'active'
    where preset.status = 'active'
    order by preset.preset_key
  `;
  const motionPresets = motionRows.map((row) => ({
    presetKey: row.preset_key,
    name: row.name,
    presetVersionId: row.version_id,
    version: Number(row.version),
    config: row.config_json || {},
  }));

  const snapshot = {
    templates: candidateTemplates,
    tokenSets,
    motionPresets,
  };
  return {
    ...snapshot,
    candidateFingerprint: fingerprint(snapshot),
  };
}

function plannerCandidateSnapshot(candidates) {
  return {
    ...candidates,
    templates: (candidates.templates || []).map((template) => ({
      ...template,
      sections: (template.sections || []).map((section) => ({
        ...section,
        layoutPresets: (section.layoutPresets || []).map((layout) => ({
          layoutKey: layout.layoutKey,
          name: layout.name,
          description: layout.description,
          isDefault: layout.isDefault,
          supportedViewports: ["desktop", "mobile"],
        })),
      })),
    })),
  };
}

module.exports = {
  fingerprint,
  policyRequiresSection,
  fetchPageCompositionCandidates,
  plannerCandidateSnapshot,
};
