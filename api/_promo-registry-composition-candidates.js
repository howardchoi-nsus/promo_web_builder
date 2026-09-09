const { stableStringify, fingerprint } = require("./_promo-composition-fingerprint");
const {
  fetchItemsForSections,
  normalizeAiDesign,
  normalizeCompositionPolicy,
  toSection,
} = require("./_wizard-content-sections-store");
const { fetchLayoutsForSections } = require("./_wizard-content-section-layouts-store");
const {
  fetchTokenSets,
  fetchTokenVersion,
  toRuntimeTokenMap,
} = require("./_design-token-store");
const { fetchShellVersion } = require("./_promo-composition-shells-store");
const {
  enrichCandidatesWithResourcePolicy,
  resolveContentResourceReferences,
} = require("./_promo-resource-policy");
const { resolveAllowedLayoutPresets } = require("./_promo-layout-preset-policy");
const { evaluateLayoutFit } = require("./_promo-layout-fit");

const MAX_SECTION_SCAN = 500;
const DEFAULT_SECTION_LIMIT = 40;
const DEFAULT_DESIGN_REFERENCE_LIMIT = 3;

function normalizeStringList(value, limit = 100) {
  return Array.from(new Set((Array.isArray(value) ? value : [])
    .map((item) => String(item || "").trim().toLowerCase())
    .filter(Boolean)))
    .sort()
    .slice(0, limit);
}

function designReferenceTerms(overview = {}) {
  const toneTerms = {
    "활기찬": ["bold", "vibrant", "energetic", "playful"],
    "진중함": ["minimal", "structured", "editorial", "professional"],
    "럭셔리": ["luxury", "premium", "editorial", "dramatic"],
    "프리미엄": ["premium", "refined", "luxury", "minimal"],
    "긴급함": ["bold", "contrast", "conversion", "energetic"],
    "친근함": ["friendly", "warm", "rounded", "playful"],
  };
  return normalizeStringList([
    ...(toneTerms[String(overview.campaignTone || "").trim()] || []),
    overview.promotionPurpose,
    overview.promotionPurposeOther,
  ]);
}

function compactDesignReference(row) {
  return {
    designDocumentId: String(row.id || ""),
    referenceName: String(row.design_style_name || row.brand_name || "Design reference").slice(0, 160),
    slug: String(row.slug || "").slice(0, 120),
    sourceHash: String(row.source_hash || ""),
    styleClassification: row.style_classification_json || {},
    designConceptSummary: String(row.design_concept_summary || "").slice(0, 1200),
    promptContext: String(row.design_prompt_context || "").slice(0, 2500),
  };
}

function rankDesignReferences(rows = [], overview = {}, preferredId = "", limit = DEFAULT_DESIGN_REFERENCE_LIMIT) {
  const normalizedPreferredId = String(preferredId || "").trim().toLowerCase();
  const terms = designReferenceTerms(overview);
  return rows.map((row, index) => {
    const searchable = JSON.stringify([
      row.design_style_name, row.brand_name, row.slug, row.style_classification_json,
      row.design_concept_summary, row.design_prompt_context,
    ]).toLowerCase();
    const exact = normalizedPreferredId && String(row.id || "").toLowerCase() === normalizedPreferredId;
    const score = (exact ? 10000 : 0) + terms.reduce(
      (sum, term) => sum + (searchable.includes(term) ? 20 : 0),
      0,
    ) - index * 0.001;
    return { row, exact, score };
  }).filter((entry) => !normalizedPreferredId || entry.exact)
    .sort((left, right) => right.score - left.score)
    .slice(0, Math.max(1, Math.min(5, Number(limit) || DEFAULT_DESIGN_REFERENCE_LIMIT)))
    .map((entry) => compactDesignReference(entry.row));
}

async function fetchDesignReferenceCandidates(sql, { overview = {}, preferredId = "", limit } = {}) {
  const rows = await sql`
    select d.id::text, coalesce(nullif(d.design_style_name, ''), b.name) as design_style_name,
      b.name as brand_name, b.slug, d.source_hash, d.style_classification_json,
      d.design_concept_summary, d.design_prompt_context, d.updated_at
    from design_documents d
    join brands b on b.id = d.brand_id
    where coalesce(d.status, '') <> 'archived'
      and d.archived_at is null
      and d.extraction_status = 'ready'
    order by d.updated_at desc, d.id
    limit 120
  `;
  return rankDesignReferences(rows, overview, preferredId, limit);
}

function componentCapabilities(component) {
  const values = new Set([
    component.componentKey,
    component.fieldKind,
    component.textType,
  ].map((value) => String(value || "").trim().toLowerCase()).filter(Boolean));
  Object.entries(component.capabilities || {}).forEach(([key, value]) => {
    if (value === true || (typeof value === "string" && value.trim()) || (Array.isArray(value) && value.length)) {
      values.add(String(key).trim().toLowerCase());
    }
  });
  (component.fields || []).forEach((field) => {
    [field.fieldKind, field.textType].forEach((value) => {
      if (value) values.add(String(value).trim().toLowerCase());
    });
  });
  return [...values].sort();
}

function componentCollection(component) {
  const source = component.instanceConfig?.collection || component.capabilities?.collection;
  if (!source || source.enabled !== true) {
    return { enabled: false, minItems: 1, maxItems: 1, layout: "stack", desktopColumns: 1, mobileColumns: 1 };
  }
  const minItems = Math.max(1, Math.min(20, Number(source.minItems || 1)));
  const maxItems = Math.max(minItems, Math.min(20, Number(source.maxItems || minItems)));
  return {
    enabled: true,
    minItems,
    maxItems,
    layout: source.layout === "grid" ? "grid" : "stack",
    desktopColumns: Math.max(1, Math.min(maxItems, Number(source.desktopColumns || maxItems))),
    mobileColumns: Math.max(1, Math.min(maxItems, Number(source.mobileColumns || 1))),
    gapPct: Math.max(0, Math.min(10, Number(source.gapPct || 2))),
    gapPx: Math.max(0, Math.min(120, Number(source.gapPx || 16))),
  };
}

function evaluateSectionCandidate({ section, components, layouts, layoutPolicy, criteria, shellConfig }) {
  const reasons = [];
  const policy = normalizeCompositionPolicy(section.compositionPolicy, section);
  const aiDesign = normalizeAiDesign(section.aiDesign);
  const sharedIds = new Set(normalizeStringList(shellConfig.sharedSectionVersionIds));
  const allowedRoles = normalizeStringList(shellConfig.allowedSectionRoles);
  const market = String(criteria.market || "").trim().toLowerCase();
  const purpose = String(criteria.promotionPurpose || "").trim().toLowerCase();
  const allowedMarkets = normalizeStringList(policy.allowedMarkets);
  const allowedPurposes = normalizeStringList(policy.allowedPromotionPurposes);
  const requiredRoles = normalizeStringList(shellConfig.requiredSectionRoles);
  const resolvedRequired = Boolean(section.fixedPosition || section.isRequired
    || policy.selectionPolicy === "required"
    || (policy.selectionPolicy === "required-by-market" && (!allowedMarkets.length || allowedMarkets.includes(market)))
    || (policy.selectionPolicy === "required-by-purpose" && (!allowedPurposes.length || allowedPurposes.includes(purpose)))
    || requiredRoles.includes(String(section.sectionRole).toLowerCase()));

  if (section.compositionScope === "shared" && !sharedIds.has(String(section.id).toLowerCase())) {
    reasons.push("SHARED_SECTION_NOT_REFERENCED");
  }
  if (allowedRoles.length && !allowedRoles.includes(String(section.sectionRole).toLowerCase())) {
    reasons.push("SECTION_ROLE_NOT_ALLOWED");
  }
  if (allowedMarkets.length && (!market || !allowedMarkets.includes(market))) {
    reasons.push("MARKET_NOT_ALLOWED");
  }
  if (allowedPurposes.length && (!purpose || !allowedPurposes.includes(purpose))) {
    reasons.push("PURPOSE_NOT_ALLOWED");
  }
  // AI Design controls generated styling/assets. It must not remove an otherwise
  // required static, legal, header, or footer Section from the page.
  if (!aiDesign.enabled && !resolvedRequired) reasons.push("AI_DESIGN_DISABLED");
  if (!components.length) reasons.push("ACTIVE_COMPONENT_REQUIRED");
  if (!layouts.length) reasons.push(
    layoutPolicy?.savedLayoutCount ? "AI_LAYOUT_PRESET_REQUIRED" : "LAYOUT_PRESET_REQUIRED",
  );

  const availableCapabilities = new Set(components.flatMap(componentCapabilities));
  const matchedCapabilities = criteria.capabilities.filter((item) => availableCapabilities.has(item));
  const missingCapabilities = criteria.capabilities.filter((item) => !availableCapabilities.has(item));
  if (criteria.capabilities.length && !matchedCapabilities.length && !resolvedRequired) {
    reasons.push("CAPABILITY_NOT_AVAILABLE");
  }
  let rankScore = resolvedRequired ? 1000 : 0;
  if (requiredRoles.includes(String(section.sectionRole).toLowerCase())) rankScore += 500;
  if (allowedMarkets.length && allowedMarkets.includes(market)) rankScore += 100;
  if (allowedPurposes.length && allowedPurposes.includes(purpose)) rankScore += 100;
  rankScore += matchedCapabilities.length * 20;
  rankScore += Math.max(0, 50 - Math.max(0, Number(section.sortOrder || 0)));

  return {
    eligible: reasons.length === 0,
    reasons,
    missingCapabilities,
    matchedCapabilities,
    availableCapabilities: [...availableCapabilities].sort(),
    policy,
    aiDesign,
    resolvedRequired,
    rankScore,
  };
}

function rankCandidates(candidates, limit = DEFAULT_SECTION_LIMIT) {
  const sorted = [...candidates].sort((left, right) => (
    right.rankScore - left.rankScore
    || Number(left.sortOrder || 0) - Number(right.sortOrder || 0)
    || String(left.sectionKey).localeCompare(String(right.sectionKey))
    || String(left.sectionVersionId).localeCompare(String(right.sectionVersionId))
  ));
  const required = sorted.filter((candidate) => candidate.resolvedRequired);
  const optional = sorted.filter((candidate) => !candidate.resolvedRequired);
  const normalizedLimit = Math.max(1, Math.min(100, Number(limit) || DEFAULT_SECTION_LIMIT));
  return [...required, ...optional.slice(0, Math.max(0, normalizedLimit - required.length))];
}

function requiredSectionError(section, reasons) {
  const codeByReason = {
    SHARED_SECTION_NOT_REFERENCED: "REQUIRED_SHARED_SECTION_NOT_REFERENCED",
    SECTION_ROLE_NOT_ALLOWED: "REQUIRED_SECTION_ROLE_NOT_ALLOWED",
    ACTIVE_COMPONENT_REQUIRED: "REQUIRED_SECTION_COMPONENT_MISSING",
    LAYOUT_PRESET_REQUIRED: "REQUIRED_SECTION_LAYOUT_MISSING",
    AI_LAYOUT_PRESET_REQUIRED: "REQUIRED_SECTION_LAYOUT_MISSING",
  };
  const primaryReason = reasons.find((reason) => codeByReason[reason]) || reasons[0];
  return Object.assign(
    new Error(`Required Section is not eligible: ${section.sectionKey} (${reasons.join(", ")})`),
    {
      code: codeByReason[primaryReason] || "REQUIRED_SECTION_INELIGIBLE",
      statusCode: 422,
      sectionKey: section.sectionKey,
      sectionVersionId: section.id,
      reasonCodes: reasons,
    },
  );
}

async function fetchTokenCandidates(sql, shellConfig) {
  const allowedIds = new Set(normalizeStringList(shellConfig.allowedTokenSetVersionIds));
  const rows = await fetchTokenSets(sql, { activeOnly: true });
  const candidates = [];
  for (const row of rows.slice(0, 24)) {
    if (!row.versionId || (allowedIds.size && !allowedIds.has(String(row.versionId).toLowerCase()))) continue;
    const version = await fetchTokenVersion(sql, row.versionId);
    if (!version) continue;
    candidates.push({
      tokenSetId: row.id,
      tokenSetVersionId: row.versionId,
      setKey: row.setKey,
      name: row.name,
      isDefault: Boolean(row.isDefault),
      runtimeValues: toRuntimeTokenMap(version.values),
      selectableTokens: version.values.filter((value) => value.aiSelectable).map((value) => ({
        tokenKey: value.tokenKey,
        category: value.category,
        semanticRole: value.semanticRole,
        values: [value.value, value.valueLight, value.valueDark].filter(Boolean),
      })),
    });
  }
  return candidates.sort((left, right) => (
    Number(right.tokenSetVersionId === shellConfig.defaultTokenSetVersionId)
    - Number(left.tokenSetVersionId === shellConfig.defaultTokenSetVersionId)
    || Number(right.isDefault) - Number(left.isDefault)
    || String(left.setKey).localeCompare(String(right.setKey))
  ));
}

async function fetchMotionCandidates(sql, shellConfig) {
  const allowedIds = new Set(normalizeStringList(shellConfig.allowedMotionPresetVersionIds));
  const rows = await sql`
    select preset.preset_key, preset.name, version.id::text as version_id,
      version.version, version.config_json
    from promo_motion_presets preset
    join promo_motion_preset_versions version
      on version.preset_id = preset.id and version.status = 'active'
    where preset.status = 'active'
    order by preset.preset_key
  `;
  return rows.filter((row) => !allowedIds.size || allowedIds.has(String(row.version_id).toLowerCase()))
    .map((row) => ({
      presetKey: row.preset_key,
      name: row.name,
      presetVersionId: row.version_id,
      version: Number(row.version),
      config: row.config_json || {},
    }));
}

async function fetchRegistryCompositionCandidates(sql, {
  shellVersionId,
  overview = {},
  capabilities = [],
  recentLayoutSelections = {},
  sectionLimit = DEFAULT_SECTION_LIMIT,
  designReferenceId = "",
} = {}) {
  const shell = await fetchShellVersion(sql, shellVersionId);
  if (!shell || shell.status !== "active" || shell.shellStatus !== "active") {
    const error = new Error("Active composition shell version not found");
    error.statusCode = 422;
    error.code = "COMPOSITION_SHELL_NOT_ACTIVE";
    throw error;
  }
  const shellConfig = shell.config || {};
  const criteria = {
    market: String(overview.market || "").trim(),
    locale: String(overview.locale || overview.language || "").trim(),
    promotionPurpose: String(overview.promotionPurpose || "").trim(),
    capabilities: normalizeStringList(capabilities),
    designReferenceId: String(designReferenceId || "").trim(),
  };
  const allowedLocales = normalizeStringList(shellConfig.allowedLocales);
  if (allowedLocales.length && !allowedLocales.includes(criteria.locale.toLowerCase())) {
    const error = new Error("Requested locale is not allowed by the composition shell");
    error.statusCode = 422;
    error.code = "COMPOSITION_LOCALE_NOT_ALLOWED";
    throw error;
  }

  const sectionRows = await sql`
    select id::text, section_key, name, description, is_required, order_change_allowed,
      fixed_position, sort_order, is_visible_in_wizard, status, version,
      change_note, ai_design, composition_scope, section_role, composition_policy,
      archived_at, created_at, updated_at
    from wizard_content_sections
    where status = 'active' and is_visible_in_wizard = true
      and composition_scope in ('registry', 'shared')
    order by sort_order, section_key, version desc
    limit ${MAX_SECTION_SCAN}
  `;

  const sectionIds = sectionRows.map((row) => row.id);
  const [itemsBySection, layoutsBySection] = await Promise.all([
    fetchItemsForSections(sql, sectionIds),
    fetchLayoutsForSections(sql, sectionIds),
  ]);
  const eligible = [];
  const excluded = [];
  for (const row of sectionRows) {
    const section = toSection(row);
    const components = (itemsBySection.get(section.id) || [])
      .filter((item) => item.isVisibleInWizard && item.componentVersionStatus === "active");
    const savedLayouts = layoutsBySection.get(section.id) || [];
    const layoutPolicy = resolveAllowedLayoutPresets(section, savedLayouts);
    const layouts = layoutPolicy.layoutPresets;
    const layoutFit = evaluateLayoutFit({
      layouts,
      overview,
      sectionRole: section.sectionRole,
      defaultLayoutKey: layoutPolicy.defaultLayoutKey,
      recentLayoutKeys: recentLayoutSelections[section.sectionKey]
        || recentLayoutSelections[section.id]
        || [],
    });
    const evaluation = evaluateSectionCandidate({
      section, components, layouts, layoutPolicy, criteria, shellConfig,
    });
    if (!evaluation.eligible) {
      excluded.push({
        sectionVersionId: section.id,
        sectionKey: section.sectionKey,
        reasonCodes: evaluation.reasons,
        missingCapabilities: evaluation.missingCapabilities,
      });
      if (evaluation.resolvedRequired) throw requiredSectionError(section, evaluation.reasons);
      continue;
    }
    eligible.push({
      sectionVersionId: section.id,
      sectionKey: section.sectionKey,
      name: section.name,
      description: section.description,
      version: section.version,
      compositionScope: section.compositionScope,
      sectionRole: section.sectionRole,
      sortOrder: section.sortOrder,
      fixedPosition: section.fixedPosition,
      resolvedRequired: evaluation.resolvedRequired,
      rankScore: evaluation.rankScore,
      availableCapabilities: evaluation.availableCapabilities,
      matchedCapabilities: evaluation.matchedCapabilities,
      compositionPolicy: evaluation.policy,
      aiDesign: evaluation.aiDesign,
      defaultLayoutKey: layoutPolicy.defaultLayoutKey,
      allowedLayoutKeys: layoutPolicy.allowedLayoutKeys,
      layoutSelectionLocked: layoutPolicy.layoutSelectionLocked,
      layoutFit,
      layoutPresets: layouts,
      components: components.map((component) => ({
        componentInstanceId: component.id,
        componentKey: component.componentKey,
        componentVersionId: component.componentVersionId,
        componentVersion: component.componentVersion,
        itemKey: component.itemKey,
        name: component.name,
        description: component.description,
        fieldKind: component.fieldKind,
        textType: component.textType,
        defaultValue: component.defaultValue,
        image: component.image,
        ctaUtm: component.ctaUtm,
        editorSchema: component.editorSchema || {},
        capabilitiesConfig: component.capabilities || {},
        instanceConfig: component.instanceConfig || {},
        collection: componentCollection(component),
        lockedValue: component.lockedValue,
        isRequired: component.isRequired,
        isLocked: component.isLocked,
        capabilities: componentCapabilities(component),
        styleSlots: component.styleSlots || [],
        fields: component.fields || [],
      })),
    });
  }

  const [tokenSets, motionPresets, resourceResolution, designReferences] = await Promise.all([
    fetchTokenCandidates(sql, shellConfig),
    fetchMotionCandidates(sql, shellConfig),
    resolveContentResourceReferences(sql, { criteria }),
    fetchDesignReferenceCandidates(sql, {
      overview,
      preferredId: criteria.designReferenceId,
      limit: shellConfig.maxDesignReferences || DEFAULT_DESIGN_REFERENCE_LIMIT,
    }),
  ]);
  const enriched = enrichCandidatesWithResourcePolicy({
    sections: eligible,
    resources: resourceResolution.references,
  });
  const sections = rankCandidates(enriched.sections, Math.min(
    Number(shellConfig.maxCandidateSections || sectionLimit),
    Number(sectionLimit || DEFAULT_SECTION_LIMIT),
  ));
  const resources = resourceResolution.references;
  const resourceIssues = [...resourceResolution.issues, ...enriched.issues];
  const policyFingerprint = fingerprint({
    shellVersionId: shell.id,
    config: shellConfig,
    sectionPolicies: sections.map((section) => ({
      sectionVersionId: section.sectionVersionId,
      policy: section.compositionPolicy,
      aiDesign: section.aiDesign,
      allowedLayoutKeys: section.allowedLayoutKeys,
      defaultLayoutKey: section.defaultLayoutKey,
      layoutSelectionLocked: section.layoutSelectionLocked,
    })),
  });
  const resourceFingerprint = resourceResolution.resourceFingerprint;
  const snapshot = {
    contractVersion: 3,
    shell: {
      shellVersionId: shell.id,
      shellKey: shell.shellKey,
      version: shell.version,
    },
    criteria,
    selectionContext: { recentLayoutSelections },
    sections,
    requiredSectionVersionIds: sections
      .filter((section) => section.resolvedRequired)
      .map((section) => section.sectionVersionId),
    requiredSectionCount: sections.filter((section) => section.resolvedRequired).length,
    tokenSets,
    motionPresets,
    resources,
    resourceIssues,
    designReferences,
    excluded: excluded.sort((left, right) => String(left.sectionKey).localeCompare(String(right.sectionKey))),
    policyFingerprint,
    resourceFingerprint,
  };
  return { ...snapshot, candidateFingerprint: fingerprint(snapshot) };
}

function plannerRegistryCandidateSnapshot(candidates) {
  return {
    contractVersion: 3,
    shell: candidates.shell,
    criteria: candidates.criteria,
    sections: (candidates.sections || []).map((section) => ({
      sectionVersionId: section.sectionVersionId,
      sectionKey: section.sectionKey,
      name: section.name,
      description: section.description,
      sectionRole: section.sectionRole,
      resolvedRequired: section.resolvedRequired,
      compositionPolicy: section.compositionPolicy,
      defaultLayoutKey: section.defaultLayoutKey,
      allowedLayoutKeys: section.allowedLayoutKeys,
      layoutSelectionLocked: section.layoutSelectionLocked,
      recommendedLayoutKey: section.layoutFit?.recommendedLayoutKey || section.defaultLayoutKey,
      fitRecommendedLayoutKey: section.layoutFit?.fitRecommendedLayoutKey || section.defaultLayoutKey,
      recentLayoutKeys: section.layoutFit?.recentLayoutKeys || [],
      repeatAvoided: section.layoutFit?.repeatAvoided === true,
      layoutPresets: (section.layoutPresets || []).map((layout) => ({
        layoutKey: layout.layoutKey,
        name: layout.name,
        description: layout.description,
        isDefault: layout.isDefault,
        selectionMetadata: layout.selectionMetadata || {},
        fitScore: Number(section.layoutFit?.scores?.find((entry) => entry.layoutKey === layout.layoutKey)?.score || 0),
        fitReasons: section.layoutFit?.scores?.find((entry) => entry.layoutKey === layout.layoutKey)?.reasons || [],
      })),
      components: (section.components || []).map((component) => ({
        componentInstanceId: component.componentInstanceId,
        componentVersionId: component.componentVersionId,
        componentKey: component.componentKey,
        itemKey: component.itemKey,
        name: component.name,
        description: component.description,
        isRequired: component.isRequired,
        isLocked: component.isLocked,
        capabilities: component.capabilities,
        collection: component.collection,
        fields: (component.fields || []).map((field) => ({
          fieldKey: field.fieldKey,
          name: field.name,
          fieldKind: field.fieldKind,
          textType: field.textType,
          isRequired: field.isRequired,
          isLocked: field.isLocked,
        })),
      })),
      resourceReferences: section.resourceReferences || [],
    })),
    requiredSectionVersionIds: candidates.requiredSectionVersionIds || [],
    requiredSectionCount: Number(candidates.requiredSectionCount || 0),
    tokenSets: (candidates.tokenSets || []).map((token) => ({
      tokenSetVersionId: token.tokenSetVersionId,
      setKey: token.setKey,
      name: token.name,
      isDefault: token.isDefault,
      selectableTokens: token.selectableTokens,
    })),
    motionPresets: candidates.motionPresets || [],
    designReferences: candidates.designReferences || [],
    resources: candidates.resources || [],
    candidateFingerprint: candidates.candidateFingerprint,
    policyFingerprint: candidates.policyFingerprint,
    resourceFingerprint: candidates.resourceFingerprint,
  };
}

module.exports = {
  DEFAULT_SECTION_LIMIT,
  stableStringify,
  fingerprint,
  normalizeStringList,
  componentCapabilities,
  resolveAllowedLayoutPresets,
  evaluateSectionCandidate,
  rankCandidates,
  designReferenceTerms,
  rankDesignReferences,
  fetchDesignReferenceCandidates,
  requiredSectionError,
  fetchRegistryCompositionCandidates,
  plannerRegistryCandidateSnapshot,
};
