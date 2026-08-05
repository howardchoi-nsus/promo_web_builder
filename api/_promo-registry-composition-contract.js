const { OVERVIEW_FIELDS } = require("./_promo-overview-contract");

function unique(values) {
  return Array.from(new Set(values.filter(Boolean)));
}

function fail(code, message, retryable = true) {
  throw Object.assign(new Error(message), { code, retryable });
}

function registryCompositionSchema(candidates) {
  const sections = candidates.sections || [];
  const sectionIds = sections.map((section) => section.sectionVersionId);
  const componentIds = unique(sections.flatMap((section) => (
    section.components.map((component) => component.componentInstanceId)
  )));
  const fieldKeys = unique(sections.flatMap((section) => section.components.flatMap((component) => (
    (component.fields || []).map((field) => field.fieldKey)
  ))));
  const layoutKeys = unique(sections.flatMap((section) => (
    (section.layoutPresets || []).map((layout) => layout.layoutKey)
  )));
  const motionIds = unique((candidates.motionPresets || []).map((motion) => motion.presetVersionId));
  const tokenIds = unique((candidates.tokenSets || []).map((token) => token.tokenSetVersionId));
  return {
    type: "object",
    additionalProperties: false,
    required: ["contractVersion", "shellVersionId", "designTokenSetVersionId", "sections", "warnings", "summary"],
    properties: {
      contractVersion: { type: "integer", enum: [3] },
      shellVersionId: { type: "string", enum: [candidates.shell?.shellVersionId || ""] },
      designTokenSetVersionId: { type: "string", enum: tokenIds.length ? tokenIds : [""] },
      sections: {
        type: "array",
        minItems: 1,
        maxItems: 30,
        items: {
          type: "object",
          additionalProperties: false,
          required: ["sectionVersionId", "visible", "sortOrder", "layoutKey", "motionPresetVersionId", "repeat", "components"],
          properties: {
            sectionVersionId: { type: "string", enum: sectionIds },
            visible: { type: "boolean" },
            sortOrder: { type: "integer", minimum: 0, maximum: 10000 },
            layoutKey: { type: "string", enum: layoutKeys.length ? layoutKeys : [""] },
            motionPresetVersionId: { type: "string", enum: ["", ...motionIds] },
            repeat: { type: "integer", minimum: 1, maximum: 20 },
            components: {
              type: "array",
              maxItems: 60,
              items: {
                type: "object",
                additionalProperties: false,
                required: ["componentInstanceId", "visible", "repeat", "contentBindings"],
                properties: {
                  componentInstanceId: { type: "string", enum: componentIds },
                  visible: { type: "boolean" },
                  repeat: { type: "integer", minimum: 1, maximum: 20 },
                  contentBindings: {
                    type: "array",
                    maxItems: 30,
                    items: {
                      type: "object",
                      additionalProperties: false,
                      required: ["fieldKey", "sourceOverviewPath"],
                      properties: {
                        fieldKey: { type: "string", enum: fieldKeys },
                        sourceOverviewPath: { type: "string", enum: OVERVIEW_FIELDS },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
      warnings: { type: "array", maxItems: 30, items: { type: "string", maxLength: 300 } },
      summary: { type: "string", maxLength: 1000 },
    },
  };
}

function validateRegistryCompositionProposal(result, candidates) {
  if (Number(result?.contractVersion) !== 3) fail("CONTRACT_VERSION_MISMATCH", "Registry composition requires Contract v3");
  if (result.shellVersionId !== candidates.shell?.shellVersionId) fail("SHELL_VERSION_NOT_ALLOWED", "Planner selected an unavailable Shell version");
  const tokenSet = (candidates.tokenSets || []).find(
    (token) => token.tokenSetVersionId === result.designTokenSetVersionId,
  ) || null;
  if ((candidates.tokenSets || []).length && !tokenSet) fail("INVALID_TOKEN_SET", "Planner selected an unavailable design token set");

  const allowedSections = new Map((candidates.sections || []).map((section) => [section.sectionVersionId, section]));
  const seenSections = new Set();
  const plannedSections = [];
  const warnings = Array.isArray(result.warnings) ? result.warnings.map(String).slice(0, 30) : [];
  let expandedSectionCount = 0;
  for (const planned of Array.isArray(result.sections) ? result.sections : []) {
    const section = allowedSections.get(planned.sectionVersionId);
    if (!section) fail("SECTION_NOT_IN_REGISTRY", "Planner selected a Section version outside the Registry candidate snapshot");
    if (seenSections.has(planned.sectionVersionId)) fail("DUPLICATE_SECTION_SELECTION", "Use repeat instead of duplicate Section selections");
    seenSections.add(planned.sectionVersionId);
    const policy = section.compositionPolicy || {};
    const maxInstances = policy.duplicatePolicy === "limited"
      ? Math.max(1, Math.min(20, Number(policy.maxInstances || 1))) : 1;
    const repeat = Math.max(1, Number(planned.repeat || 1));
    if (!Number.isInteger(repeat) || repeat > maxInstances) {
      fail("SECTION_REPEAT_LIMIT_EXCEEDED", `Section repeat exceeds policy: ${section.sectionKey} (max ${maxInstances})`);
    }
    expandedSectionCount += repeat;
    if (expandedSectionCount > 30) fail("SECTION_INSTANCE_LIMIT_EXCEEDED", "Composition exceeds the maximum expanded Section count");
    if (section.resolvedRequired && planned.visible === false) fail("REQUIRED_SECTION_HIDDEN", "Required Section cannot be hidden");
    const layout = (section.layoutPresets || []).find((item) => item.layoutKey === planned.layoutKey);
    if (!layout) fail("LAYOUT_NOT_IN_SECTION", "Planner selected a Layout outside its Section");
    const motion = planned.motionPresetVersionId
      ? (candidates.motionPresets || []).find((item) => item.presetVersionId === planned.motionPresetVersionId)
      : null;
    if (planned.motionPresetVersionId && !motion) fail("INVALID_MOTION_PRESET", "Planner selected an unavailable Motion version");

    const allowedComponents = new Map(section.components.map((item) => [item.componentInstanceId, item]));
    const seenComponents = new Set();
    const components = [];
    for (const plannedComponent of Array.isArray(planned.components) ? planned.components : []) {
      const component = allowedComponents.get(plannedComponent.componentInstanceId);
      if (!component) fail("COMPONENT_NOT_IN_SECTION", "Planner selected a Component outside its Section");
      if (seenComponents.has(plannedComponent.componentInstanceId)) fail("DUPLICATE_COMPONENT_SELECTION", "Planner duplicated a Component selection");
      seenComponents.add(plannedComponent.componentInstanceId);
      if (component.isRequired && plannedComponent.visible === false) fail("REQUIRED_COMPONENT_HIDDEN", "Required Component cannot be hidden");
      const collection = component.collection || { enabled: false, minItems: 1, maxItems: 1 };
      const repeat = Math.max(1, Number(plannedComponent.repeat || 1));
      if (!Number.isInteger(repeat)
        || repeat < Number(collection.minItems || 1)
        || repeat > Number(collection.maxItems || 1)
        || (!collection.enabled && repeat !== 1)) {
        fail("COMPONENT_COLLECTION_LIMIT_EXCEEDED", `Component collection limit exceeded: ${component.itemKey}`);
      }
      const allowedFields = new Set((component.fields || []).map((field) => field.fieldKey));
      const seenFields = new Set();
      const contentBindings = [];
      for (const binding of plannedComponent.contentBindings || []) {
        if (policy.contentLocked || policy.aiEditable === false || component.isLocked) {
          const warning = `AI content binding was ignored by policy: ${section.sectionKey}.${component.itemKey}`;
          if (!warnings.includes(warning)) warnings.push(warning);
          continue;
        }
        if (!allowedFields.has(binding.fieldKey) || !OVERVIEW_FIELDS.includes(binding.sourceOverviewPath)) {
          fail("INVALID_CONTENT_BINDING", "Planner returned an invalid content binding", false);
        }
        if (seenFields.has(binding.fieldKey)) fail("DUPLICATE_CONTENT_BINDING", "Planner duplicated a content field binding");
        seenFields.add(binding.fieldKey);
        contentBindings.push({ fieldKey: binding.fieldKey, sourceOverviewPath: binding.sourceOverviewPath });
      }
      components.push({
        componentInstanceId: component.componentInstanceId,
        componentVersionId: component.componentVersionId,
        itemKey: component.itemKey,
        visible: plannedComponent.visible !== false,
        repeat,
        collection,
        contentBindings,
      });
    }
    section.components.filter((component) => component.isRequired).forEach((component) => {
      if (!seenComponents.has(component.componentInstanceId)) fail("REQUIRED_COMPONENT_MISSING", "Required Component is missing");
    });
    plannedSections.push({
      sectionVersionId: section.sectionVersionId,
      sectionKey: section.sectionKey,
      sectionRole: section.sectionRole,
      visible: planned.visible !== false,
      sortOrder: Number(planned.sortOrder || section.sortOrder || 0),
      layoutKey: planned.layoutKey,
      motionPresetVersionId: motion?.presetVersionId || "",
      repeat,
      components,
      resourceReferences: section.resourceReferences || [],
    });
  }
  (candidates.sections || []).filter((section) => section.resolvedRequired).forEach((section) => {
    if (!seenSections.has(section.sectionVersionId)) fail("REQUIRED_SECTION_MISSING", `Required Section is missing: ${section.sectionKey}`);
  });
  if (!plannedSections.length) fail("SECTION_REQUIRED", "Registry composition requires at least one Section");
  return {
    contractVersion: 3,
    shell: candidates.shell,
    tokenSet,
    sections: plannedSections.sort((left, right) => left.sortOrder - right.sortOrder || left.sectionKey.localeCompare(right.sectionKey)),
    resources: candidates.resources || [],
    warnings: warnings.slice(0, 30),
    summary: String(result.summary || "").trim().slice(0, 1000),
  };
}

function normalizeRegistryCompositionProposal({
  validated,
  documentId,
  documentRevision,
  proposalId,
  overviewFingerprint,
  candidateFingerprint,
  policyFingerprint,
  resourceFingerprint,
  promptExecutionSnapshot = {},
}) {
  return {
    contractVersion: 3,
    snapshotType: "registry-composition-proposal",
    documentRevision: Number(documentRevision || 0),
    compositionMeta: {
      documentId,
      proposalId,
      mode: "ai-composition",
      shellVersionId: validated.shell.shellVersionId,
      overviewFingerprint,
      candidateFingerprint,
      policyFingerprint,
      resourceFingerprint,
      promptTemplateVersionId: String(promptExecutionSnapshot.promptId || ""),
      model: String(promptExecutionSnapshot.model || ""),
      reasoningSummary: validated.summary,
    },
    compositionSpec: {
      shellVersionId: validated.shell.shellVersionId,
      designTokenSetVersionId: validated.tokenSet?.tokenSetVersionId || "",
      sections: validated.sections,
      resourceReferences: validated.resources,
    },
    preview: {
      sections: validated.sections.map((section) => ({
        sectionKey: section.sectionKey,
        sectionRole: section.sectionRole,
        repeat: section.repeat,
        layoutKey: section.layoutKey,
        componentKeys: section.components.map((component) => component.itemKey),
        componentRepeats: Object.fromEntries(section.components.map((component) => [
          component.itemKey, component.repeat,
        ])),
        resourceKeys: section.resourceReferences.map((resource) => resource.resourceKey),
      })),
      resources: validated.resources.map((resource) => ({
        resourceKey: resource.resourceKey,
        resourceType: resource.resourceType,
        version: resource.version,
        locale: resource.locale,
        required: resource.required,
      })),
    },
    validation: { ok: true, errors: [], warnings: validated.warnings },
  };
}

module.exports = {
  registryCompositionSchema,
  validateRegistryCompositionProposal,
  normalizeRegistryCompositionProposal,
};
