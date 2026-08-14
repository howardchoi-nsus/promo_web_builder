const { randomUUID } = require("node:crypto");
const { OVERVIEW_FIELDS } = require("./_promo-overview-contract");
const { normalizeCtaLabel } = require("./_promo-content-policy");
const { styleSlotTargetProperty } = require("./_promo-style-slot-contract");
const { resolveSectionLayoutPreset } = require("./_section-layout-preset-resolver");

const OPERATION_TYPES = Object.freeze([
  "update-field",
  "set-visibility",
  "move-section",
  "move-component",
  "change-layout-variant",
  "change-token-binding",
  "change-motion-preset",
  "request-asset-regeneration",
  "remove-asset",
  "add-section",
  "remove-section",
  "replace-section",
  "add-collection-item",
  "remove-collection-item",
  "move-collection-item",
]);

function unique(values) {
  return Array.from(new Set(values.filter(Boolean)));
}

function usesComponentImageTarget(section, item) {
  const policy = section?.aiDesign || {};
  const itemKey = item?.sourceItemKey || item?.itemKey || "";
  return policy.enabled !== false
    && policy.imageTarget === "item"
    && Array.isArray(policy.imageTargetItemKeys)
    && policy.imageTargetItemKeys.includes(itemKey);
}

function usesSectionKeyVisualTarget(section) {
  const policy = section?.aiDesign || {};
  return policy.enabled !== false
    && policy.imageTarget !== "item"
    && policy.allowSectionBackground !== false;
}

function pageCompositionSchema(candidates) {
  const templates = candidates.templates || [];
  const sectionIds = unique(templates.flatMap((template) => template.sections.map((section) => section.sectionId)));
  const componentIds = unique(templates.flatMap((template) => (
    template.sections.flatMap((section) => section.components.map((component) => component.componentInstanceId))
  )));
  const fieldKeys = unique(templates.flatMap((template) => template.sections.flatMap((section) => (
    section.components.flatMap((component) => component.fields.map((field) => field.fieldKey))
  ))));
  const layoutVariants = unique([
    "default",
    ...templates.flatMap((template) => (
      template.sections.flatMap((section) => section.allowedLayoutVariants || [])
    )),
  ]);
  const motionKeys = unique(["none", ...(candidates.motionPresets || []).map((item) => item.presetKey)]);
  const tokenVersionIds = unique((candidates.tokenSets || []).map((item) => item.tokenSetVersionId));
  return {
    type: "object",
    additionalProperties: false,
    required: ["templateId", "designTokenSetVersionId", "sections", "warnings", "summary"],
    properties: {
      templateId: { type: "string", enum: templates.map((item) => item.templateId) },
      designTokenSetVersionId: {
        type: "string",
        enum: tokenVersionIds.length ? tokenVersionIds : [""],
      },
      sections: {
        type: "array",
        minItems: 1,
        maxItems: 30,
        items: {
          type: "object",
          additionalProperties: false,
          required: [
            "sectionId", "visible", "sortOrder", "layoutVariant",
            "motionPresetKey", "components",
          ],
          properties: {
            sectionId: { type: "string", enum: sectionIds },
            visible: { type: "boolean" },
            sortOrder: { type: "integer", minimum: 0, maximum: 10000 },
            layoutVariant: { type: "string", enum: layoutVariants },
            motionPresetKey: { type: "string", enum: motionKeys },
            components: {
              type: "array",
              maxItems: 60,
              items: {
                type: "object",
                additionalProperties: false,
                required: ["componentInstanceId", "visible", "contentBindings"],
                properties: {
                  componentInstanceId: { type: "string", enum: componentIds },
                  visible: { type: "boolean" },
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
      warnings: {
        type: "array",
        maxItems: 30,
        items: { type: "string", maxLength: 300 },
      },
      summary: { type: "string", maxLength: 1000 },
    },
  };
}

function validatePageCompositionProposal(result, candidates) {
  const template = candidates.templates.find((item) => item.templateId === result?.templateId);
  if (!template) throw Object.assign(new Error("Planner selected an unavailable template"), { code: "INVALID_TEMPLATE" });
  const tokenSet = (candidates.tokenSets || []).find(
    (item) => item.tokenSetVersionId === result.designTokenSetVersionId,
  ) || null;
  if ((candidates.tokenSets || []).length && !tokenSet) {
    throw Object.assign(new Error("Planner selected an unavailable design token set"), { code: "INVALID_TOKEN_SET" });
  }
  const allowedSections = new Map(template.sections.map((section) => [section.sectionId, section]));
  const sectionCounts = new Map();
  const sections = [];
  const warnings = Array.isArray(result.warnings)
    ? result.warnings.map(String).slice(0, 30)
    : [];
  for (const planned of Array.isArray(result.sections) ? result.sections : []) {
    const section = allowedSections.get(planned.sectionId);
    if (!section) {
      throw Object.assign(
        new Error("Planner returned a section that is not available in the selected template"),
        { code: "SECTION_NOT_IN_TEMPLATE", retryable: true },
      );
    }
    const currentSectionCount = Number(sectionCounts.get(planned.sectionId) || 0);
    const policy = section.compositionPolicy || {};
    const maxInstances = section.fixedPosition || policy.duplicatePolicy !== "limited"
      ? 1
      : Math.max(1, Math.min(20, Number(policy.maxInstances || 1)));
    if (currentSectionCount >= maxInstances) {
      warnings.push(`Section instance limit was applied: ${planned.sectionId} (max ${maxInstances})`);
      continue;
    }
    sectionCounts.set(planned.sectionId, currentSectionCount + 1);
    const allowedComponents = new Map(
      section.components.map((component) => [component.componentInstanceId, component]),
    );
    const seenComponents = new Set();
    const components = [];
    for (const plannedComponent of Array.isArray(planned.components) ? planned.components : []) {
      const component = allowedComponents.get(plannedComponent.componentInstanceId);
      if (!component) {
        throw Object.assign(
          new Error("Planner returned a component that is not available in its section"),
          { code: "COMPONENT_NOT_IN_SECTION", retryable: true },
        );
      }
      if (seenComponents.has(plannedComponent.componentInstanceId)) {
        warnings.push(`Duplicate component was removed: ${plannedComponent.componentInstanceId}`);
        continue;
      }
      seenComponents.add(plannedComponent.componentInstanceId);
      const fieldsByKey = new Map(component.fields.map((field) => [field.fieldKey, field]));
      const allowedFields = new Set(fieldsByKey.keys());
      const seenFields = new Set();
      const contentBindings = [];
      for (const binding of plannedComponent.contentBindings || []) {
        if (policy.contentLocked || policy.aiEditable === false) {
          const warning = `AI content binding was ignored by section policy: ${section.sectionKey}`;
          if (!warnings.includes(warning)) warnings.push(warning);
          continue;
        }
        const targetField = fieldsByKey.get(binding.fieldKey);
        if (!allowedFields.has(binding.fieldKey)
          || !OVERVIEW_FIELDS.includes(binding.sourceOverviewPath)
          || (targetField?.fieldKind === "cta" && binding.sourceOverviewPath !== "ctaLabel")
          || (targetField?.fieldKind !== "cta" && binding.sourceOverviewPath === "ctaLabel")) {
          throw Object.assign(new Error("Planner returned an invalid content binding"), { code: "INVALID_CONTENT_BINDING" });
        }
        if (seenFields.has(binding.fieldKey)) {
          warnings.push(`Duplicate content binding was removed: ${plannedComponent.componentInstanceId}.${binding.fieldKey}`);
          continue;
        }
        seenFields.add(binding.fieldKey);
        contentBindings.push({
          fieldKey: binding.fieldKey,
          sourceOverviewPath: binding.sourceOverviewPath,
        });
      }
      if (component.isRequired && plannedComponent.visible === false) {
        throw Object.assign(new Error("Required component cannot be hidden"), { code: "REQUIRED_COMPONENT_HIDDEN" });
      }
      components.push({
        component,
        visible: plannedComponent.visible !== false,
        contentBindings,
      });
    }
    section.components.filter((component) => component.isRequired).forEach((component) => {
      if (!seenComponents.has(component.componentInstanceId)) {
        throw Object.assign(new Error("Required component is missing"), { code: "REQUIRED_COMPONENT_MISSING" });
      }
    });
    if (section.fixedPosition && planned.visible === false) {
      throw Object.assign(new Error("Fixed-position section cannot be hidden"), { code: "FIXED_SECTION_HIDDEN" });
    }
    if (!(section.allowedLayoutVariants || ["default"]).includes(planned.layoutVariant)) {
      throw Object.assign(new Error("Section layout variant is not allowed"), { code: "INVALID_LAYOUT_VARIANT" });
    }
    const motion = (candidates.motionPresets || []).find(
      (item) => item.presetKey === planned.motionPresetKey,
    ) || null;
    if (planned.motionPresetKey !== "none" && !motion) {
      throw Object.assign(new Error("Motion preset is not allowed"), { code: "INVALID_MOTION_PRESET" });
    }
    sections.push({
      section,
      visible: planned.visible !== false,
      sortOrder: Number(planned.sortOrder || section.sortOrder || 0),
      layoutVariant: planned.layoutVariant,
      motion,
      components,
    });
  }
  template.sections.filter((section) => section.resolvedRequired).forEach((section) => {
    if (!sectionCounts.has(section.sectionId)) {
      throw Object.assign(new Error(`Required section is missing: ${section.sectionKey}`), { code: "REQUIRED_SECTION_MISSING" });
    }
  });
  if (!sections.length) throw Object.assign(new Error("Composition requires at least one section"), { code: "SECTION_REQUIRED" });
  return {
    template,
    tokenSet,
    sections: sections.sort((left, right) => left.sortOrder - right.sortOrder),
    warnings: warnings.slice(0, 30),
    summary: String(result.summary || "").trim().slice(0, 1000),
  };
}

function defaultValue(field) {
  if (field.isLocked) return field.lockedValue ?? field.defaultValue ?? "";
  if (field.fieldKind === "cta") return { label: "", link: "", target: "_self" };
  if (field.fieldKind === "image") {
    return { source: field.image?.allowedSources?.[0] || "url", value: "", description: "", alt: "" };
  }
  return field.defaultValue || "";
}

function boundValue(field, binding, overview) {
  if (!binding) return defaultValue(field);
  const value = overview[binding.sourceOverviewPath];
  if (field.fieldKind === "cta") {
    return { label: normalizeCtaLabel(value, { allowEmpty: false }), link: "", target: "_self" };
  }
  return String(value || "");
}

function firstAvailableToken(tokenValues, candidates) {
  return candidates.find((tokenKey) => tokenValues[tokenKey]) || "";
}

const DESIGN_TOKEN_ROLE_CANDIDATES = Object.freeze({
  background: ["--promo-bg", "--app-bg", "--promo-surface", "--app-surface"],
  surface: ["--promo-surface", "--app-surface", "--promo-bg", "--app-bg"],
  text: ["--promo-text", "--app-ink", "--app-text"],
  muted: ["--promo-muted", "--app-muted", "--app-ink-soft", "--app-ink"],
  accent: ["--promo-accent", "--app-accent"],
  onAccent: ["--app-on-accent", "--promo-text", "--app-ink"],
  radius: ["--promo-radius", "--app-radius"],
  shadow: ["--promo-shadow", "--app-shadow"],
  font: ["--promo-font", "--app-font-body", "--app-font-family", "--app-font-heading"],
});

const REQUIRED_DESIGN_TOKEN_ROLE_CANDIDATES = Object.freeze({
  surface: ["--promo-surface", "--app-surface"],
  text: ["--promo-text", "--app-ink", "--app-text"],
  muted: ["--promo-muted", "--app-muted", "--app-ink-soft"],
  accent: ["--promo-accent", "--app-accent"],
  radius: ["--promo-radius", "--app-radius"],
  shadow: ["--promo-shadow", "--app-shadow"],
});

function missingRequiredDesignTokenRoles(tokenValues = {}) {
  return Object.entries(REQUIRED_DESIGN_TOKEN_ROLE_CANDIDATES)
    .filter(([, candidates]) => !firstAvailableToken(tokenValues, candidates))
    .map(([role]) => role);
}

function resolveDesignTokenBindings(tokenValues = {}, selectableTokens = []) {
  const semanticTokens = new Map();
  (selectableTokens || []).forEach((token) => {
    const tokenKey = String(token?.tokenKey || "").trim();
    const semanticRole = String(token?.semanticRole || "").trim().toLowerCase();
    if (tokenValues[tokenKey] && semanticRole && !semanticTokens.has(semanticRole)) {
      semanticTokens.set(semanticRole, tokenKey);
    }
  });
  const semanticAliases = {
    background: ["page-background", "background-color"],
    surface: ["surface-color"],
    text: ["text-color"],
    muted: ["muted-color"],
    accent: ["accent-color"],
    onAccent: ["on-accent-color"],
    radius: ["radius"],
    shadow: ["shadow"],
    font: ["font-family", "body-font"],
  };
  return Object.fromEntries(Object.entries(DESIGN_TOKEN_ROLE_CANDIDATES).map(([role, candidates]) => {
    const semanticToken = (semanticAliases[role] || []).map((alias) => semanticTokens.get(alias)).find(Boolean);
    return [role, semanticToken || firstAvailableToken(tokenValues, candidates)];
  }));
}

function styleSlotTokenStyle(styleSlots = [], bindings = {}) {
  const bindingByRole = {
    "surface-color": bindings.surface,
    "background-color": bindings.background,
    "text-color": bindings.text,
    "muted-color": bindings.muted,
    "accent-color": bindings.accent,
    "on-accent-color": bindings.onAccent,
    radius: bindings.radius,
    shadow: bindings.shadow,
    "font-family": bindings.font,
  };
  return Object.fromEntries((styleSlots || []).flatMap((slot) => {
    const role = String(slot?.semanticRole || "").trim().toLowerCase();
    const property = styleSlotTargetProperty(slot);
    const tokenKey = bindingByRole[role];
    return property && tokenKey ? [[property, tokenKey]] : [];
  }));
}

function defaultItemTokenStyle(item, tokenValues = {}, bindings = resolveDesignTokenBindings(tokenValues)) {
  const fields = Array.isArray(item?.fields) && item.fields.length ? item.fields : [item];
  const identity = fields.map((field) => [
    field?.fieldKey,
    field?.itemKey,
    field?.name,
    field?.textType,
    field?.fieldKind,
  ].filter(Boolean).join(" ")).join(" ").toLowerCase();
  const isCta = fields.some((field) => field?.fieldKind === "cta");
  const isLead = /\b(lead|eyebrow|kicker|overline)\b/.test(identity);
  const isSubtitle = /\b(subtitle|subline|description|body|remark|copy)\b/.test(identity);
  const isTitle = !isLead && !isSubtitle && /\b(title|headline|heading)\b/.test(identity);
  const colorToken = firstAvailableToken(tokenValues, isLead
    ? ["--app-accent", "--app-ink"]
    : isCta
      ? ["--app-on-accent", "--app-ink"]
      : isSubtitle
        ? ["--app-ink-soft", "--app-ink"]
        : ["--app-ink", "--app-text"]);
  const fontSizeToken = firstAvailableToken(tokenValues, isTitle
    ? ["--promo-font-size-main-title", "--promo-title-size", "--app-font-size-heading"]
    : isLead
      ? ["--promo-font-size-lead-title", "--app-font-size-heading"]
      : isSubtitle
        ? ["--promo-font-size-subtitle", "--app-font-size-body"]
        : ["--app-font-size-body"]);
  const fontWeightToken = firstAvailableToken(tokenValues, isTitle
    ? ["--app-font-weight-title", "--app-font-weight-heading", "--app-font-weight-strong"]
    : isLead
      ? ["--app-font-weight-heading", "--app-font-weight-strong"]
      : isCta
        ? ["--app-font-weight-strong", "--app-font-weight-label"]
        : ["--app-font-weight-label"]);
  return {
    ...(bindings.font ? { fontFamilyToken: bindings.font } : {}),
    ...(colorToken ? { colorToken } : {}),
    ...(fontSizeToken ? { fontSizeToken } : {}),
    ...(fontWeightToken ? { fontWeightToken } : {}),
    ...styleSlotTokenStyle(item?.styleSlots, bindings),
  };
}

function buildDefaultItemStyles(sections, tokenValues = {}, selectableTokens = []) {
  const bindings = resolveDesignTokenBindings(tokenValues, selectableTokens);
  return Object.fromEntries((sections || []).flatMap((section) => (
    (section.items || []).flatMap((item) => {
      const itemKey = `${section.sectionKey}.${item.itemKey}`;
      const itemStyle = defaultItemTokenStyle(item, tokenValues, bindings);
      const fieldStyles = (item.fields || []).map((field) => [
        `${itemKey}.${field.fieldKey}`,
        {
          ...defaultItemTokenStyle(field, tokenValues, bindings),
          ...styleSlotTokenStyle(field.styleSlots, bindings),
        },
      ]);
      return [[itemKey, itemStyle], ...fieldStyles];
    })
  )).filter(([, style]) => Object.keys(style).length));
}

function normalizePageComposition({
  validated,
  overview,
  documentId,
  documentRevision = 0,
  proposalId,
  overviewFingerprint,
  candidateFingerprint,
  promptExecutionSnapshot = {},
}) {
  const sectionSnapshot = [];
  const sectionInputs = {};
  const sectionOrder = [];
  const provenance = {};
  const itemVisibility = {};
  const fieldVisibility = {};
  const sectionStyles = {};
  const presetItemStyles = {};
  const mobileItemStyles = {};
  const mobileItemVisibility = {};
  const motionSections = {};
  const motionItems = {};
  const assetRequests = [];

  validated.sections.forEach((plannedSection) => {
    const pageSectionInstanceId = `sec_${randomUUID().replace(/-/g, "")}`;
    const section = plannedSection.section;
    const items = [];
    sectionInputs[pageSectionInstanceId] = {};
    sectionOrder.push(pageSectionInstanceId);
    if (plannedSection.motion) {
      motionSections[pageSectionInstanceId] = {
        presetVersionId: plannedSection.motion.presetVersionId,
        className: plannedSection.motion.config.className || "",
        durationToken: plannedSection.motion.config.durationToken || "0ms",
        easingToken: plannedSection.motion.config.easingToken || "linear",
        delayToken: plannedSection.motion.config.delayToken || "0ms",
      };
    }
    plannedSection.components.forEach((plannedComponent) => {
      const source = plannedComponent.component;
      const pageComponentInstanceId = `cmp_${randomUUID().replace(/-/g, "")}`;
      const sectionPolicy = section.compositionPolicy || {};
      const fields = source.fields.map((field) => sectionPolicy.contentLocked ? {
        ...field,
        isLocked: true,
        lockedValue: field.lockedValue ?? field.defaultValue ?? "",
      } : { ...field });
      const definition = {
        ...source.definition,
        id: pageComponentInstanceId,
        itemKey: pageComponentInstanceId,
        sourceDefinitionInstanceId: source.componentInstanceId,
        sourceItemKey: source.itemKey,
        componentVersionId: source.componentVersionId,
        fields,
      };
      items.push(definition);
      itemVisibility[`${pageSectionInstanceId}.${pageComponentInstanceId}`] = plannedComponent.visible;
      const values = {};
      fields.forEach((field) => {
        const binding = plannedComponent.contentBindings.find((item) => item.fieldKey === field.fieldKey);
        values[field.fieldKey] = boundValue(field, binding, overview);
        fieldVisibility[`${pageSectionInstanceId}.${pageComponentInstanceId}.${field.fieldKey}`] = true;
        if (binding) {
          provenance[`${pageSectionInstanceId}.${pageComponentInstanceId}.${field.fieldKey}`] = {
            source: "ai-generated",
            sourceOverviewPath: binding.sourceOverviewPath,
            confirmationRequired: false,
          };
        }
        if (usesComponentImageTarget(section, definition)
          && field.fieldKind === "image" && field.image?.allowedSources?.includes("ai")) {
          assetRequests.push({
            assetRequestId: randomUUID(),
            targetType: "component-field-image",
            pageSectionInstanceId,
            pageComponentInstanceId,
            fieldKey: field.fieldKey,
            assetRole: source.instanceConfig?.assetRole || (section.sectionRole === "hero" ? "hero-key-visual" : "component-image"),
            guidance: source.instanceConfig?.assetPromptText || "",
            aspectRatio: section.sectionRole === "hero"
              ? (section.aiDesign?.imageAspectRatio || "4:3")
              : (field.image?.aspectRatio || "1:1"),
            status: "pending",
          });
        }
      });
      sectionInputs[pageSectionInstanceId][pageComponentInstanceId] = fields.length > 1
        ? { fields: values }
        : values[fields[0]?.fieldKey];
    });
    const selectedLayoutPreset = (section.layoutPresets || []).find(
      (preset) => preset.layoutKey === plannedSection.layoutVariant,
    ) || null;
    const resolvedPreset = resolveSectionLayoutPreset(
      pageSectionInstanceId,
      items,
      selectedLayoutPreset,
    );
    Object.entries(resolvedPreset?.content || {}).forEach(([componentInstanceId, presetValue]) => {
      const item = items.find((candidate) => (candidate.id || candidate.itemKey) === componentInstanceId);
      if (!item) return;
      const fields = Array.isArray(item.fields) ? item.fields : [];
      if (fields.length > 1 && presetValue?.fields && typeof presetValue.fields === "object") {
        const current = sectionInputs[pageSectionInstanceId][componentInstanceId] || { fields: {} };
        const nextFields = { ...(current.fields || {}) };
        fields.forEach((field) => {
          const provenanceKey = `${pageSectionInstanceId}.${componentInstanceId}.${field.fieldKey}`;
          if (!provenance[provenanceKey] && Object.prototype.hasOwnProperty.call(presetValue.fields, field.fieldKey)) {
            nextFields[field.fieldKey] = JSON.parse(JSON.stringify(presetValue.fields[field.fieldKey]));
          }
        });
        sectionInputs[pageSectionInstanceId][componentInstanceId] = { ...current, fields: nextFields };
        return;
      }
      const fieldKey = fields[0]?.fieldKey;
      const provenanceKey = `${pageSectionInstanceId}.${componentInstanceId}.${fieldKey || ""}`;
      if (!provenance[provenanceKey]) {
        sectionInputs[pageSectionInstanceId][componentInstanceId] = JSON.parse(JSON.stringify(presetValue));
      }
    });
    sectionStyles[pageSectionInstanceId] = resolvedPreset?.sectionStyle || {
      layoutVariant: plannedSection.layoutVariant,
    };
    Object.assign(presetItemStyles, resolvedPreset?.itemStyles || {});
    Object.assign(itemVisibility, resolvedPreset?.visibilityItems || {});
    Object.assign(mobileItemStyles, resolvedPreset?.responsiveLayouts?.mobile?.itemStyles || {});
    Object.assign(
      mobileItemVisibility,
      resolvedPreset?.responsiveLayouts?.mobile?.visibility?.items || {},
    );
    if (usesSectionKeyVisualTarget(section)) {
      assetRequests.push({
        assetRequestId: randomUUID(),
        targetType: "section-key-visual",
        pageSectionInstanceId,
        status: "pending",
      });
    }
    sectionSnapshot.push({
      id: pageSectionInstanceId,
      sectionKey: pageSectionInstanceId,
      pageSectionInstanceId,
      sourceSectionId: section.sectionId,
      sourceSectionVersion: section.version,
      sourceSectionKey: section.sectionKey,
      name: section.name,
      description: section.description,
      sectionRole: section.sectionRole,
      compositionPolicy: section.compositionPolicy,
      fixedPosition: section.fixedPosition,
      isRequired: section.isRequired,
      isVisibleInWizard: plannedSection.visible,
      sortOrder: plannedSection.sortOrder,
      aiDesign: section.aiDesign,
      layoutPresets: section.layoutPresets || [],
      selectedLayoutKey: resolvedPreset?.layoutKey || plannedSection.layoutVariant,
      items,
    });
  });

  const tokenValues = validated.tokenSet?.runtimeValues || {};
  const defaultItemStyles = buildDefaultItemStyles(sectionSnapshot, tokenValues);
  return {
    contractVersion: 2,
    documentRevision,
    layoutRevision: 0,
    layoutIdentity: {
      contractVersion: 2,
      templateId: validated.template.templateId,
      templateKey: validated.template.templateKey,
      templateVersion: validated.template.templateVersion,
      layoutId: "",
      layoutRevision: 0,
      configRevision: candidateFingerprint,
      rendererKey: "default-promo-renderer",
      rendererVersion: 1,
    },
    compositionMeta: {
      compositionId: randomUUID(),
      documentId,
      mode: "library-based",
      overviewFingerprint,
      candidateFingerprint,
      proposalId,
      sourceTemplateId: validated.template.templateId,
      sourceTemplateVersion: validated.template.templateVersion,
      promptTemplateVersionId: String(promptExecutionSnapshot.promptId || ""),
      model: String(promptExecutionSnapshot.model || ""),
      reasoningSummary: validated.summary,
    },
    appearance: {
      designTokenSetVersionId: validated.tokenSet?.tokenSetVersionId || "",
      motionEnabled: Object.keys(motionSections).length > 0,
    },
    content: {
      contractVersion: 2,
      formTemplate: {
        id: validated.template.templateId,
        templateKey: validated.template.templateKey,
        version: validated.template.templateVersion,
        designTokenSetVersionId: validated.tokenSet?.tokenSetVersionId || "",
        designTokens: { values: tokenValues },
      },
      sectionSnapshot,
      sectionInputs,
      sectionOrder,
    },
    provenance,
    designSpec: {
      contractVersion: 2,
      specKey: "ai-composition",
      theme: {
        backgroundColor: tokenValues["--app-bg"] || tokenValues["--app-surface"] || "#f5f7fb",
        textColor: tokenValues["--app-ink"] || tokenValues["--app-text"] || "#172033",
        accentColor: tokenValues["--app-accent"] || "#156b5b",
        ctaColor: tokenValues["--app-cta-background"] || tokenValues["--app-accent"] || "#156b5b",
        ctaShape: "round",
        ctaVariant: "fill",
        fontFamily: tokenValues["--app-font-body"]
          || tokenValues["--app-font-family"]
          || "Inter, Pretendard, sans-serif",
      },
      responsive: { contentMaxWidth: 1280, contentMinWidth: 1140, mobileBreakpoint: 720 },
      itemStyles: Object.fromEntries(Array.from(new Set([
        ...Object.keys(defaultItemStyles),
        ...Object.keys(presetItemStyles),
      ])).map((styleKey) => [
        styleKey,
        {
          ...(defaultItemStyles[styleKey] || {}),
          ...(presetItemStyles[styleKey] || {}),
        },
      ])),
      sectionStyles,
      visibility: { items: itemVisibility, fields: fieldVisibility },
      responsiveLayouts: {
        mobile: {
          itemStyles: mobileItemStyles,
          visibility: { items: mobileItemVisibility },
        },
      },
    },
    motionSpec: { sections: motionSections, items: motionItems },
    assets: { contractVersion: 1, items: {}, requests: assetRequests },
    validation: { ok: true, errors: [], warnings: validated.warnings },
  };
}

module.exports = {
  OPERATION_TYPES,
  pageCompositionSchema,
  validatePageCompositionProposal,
  normalizePageComposition,
  buildDefaultItemStyles,
  resolveDesignTokenBindings,
  missingRequiredDesignTokenRoles,
};
