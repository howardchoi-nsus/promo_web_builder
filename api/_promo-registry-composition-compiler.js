const { createHash } = require("node:crypto");
const { normalizeCtaLabel } = require("./_promo-content-policy");
const { resolveSectionLayoutPreset } = require("./_section-layout-preset-resolver");
const {
  buildDefaultItemStyles,
  missingRequiredDesignTokenRoles,
  resolveDesignTokenBindings,
} = require("./_promo-page-composition-contract");
const { fetchPinnedResourceVersions } = require("./_promo-content-resources-store");
const { validateLayoutSpec } = require("./_wizard-form-template-layout-store");
const { avoidTextComponentOverlaps } = require("./_promo-layout-text-collision");

function clone(value) {
  return value == null ? value : JSON.parse(JSON.stringify(value));
}

function usesComponentImageTarget(section, item) {
  const policy = section?.aiDesign || {};
  // Repeated collection items receive generated source keys such as `card#2`.
  // AI target policy is authored against the original Registry item key, so
  // use the collection source key when it is available.
  const itemKey = item?.collection?.sourceItemKey || item?.sourceItemKey || item?.itemKey || "";
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

function compilerError(code, message, statusCode = 409) {
  return Object.assign(new Error(message), { code, statusCode });
}

function digest(value) {
  return createHash("sha256").update(String(value)).digest("hex");
}

function stableId(prefix, ...parts) {
  return `${prefix}_${digest(parts.join(":")).slice(0, 32)}`;
}

function stableUuid(...parts) {
  const value = digest(parts.join(":"));
  return `${value.slice(0, 8)}-${value.slice(8, 12)}-4${value.slice(13, 16)}-a${value.slice(17, 20)}-${value.slice(20, 32)}`;
}

function fieldDefault(field) {
  if (field.isLocked) return clone(field.lockedValue ?? field.defaultValue ?? "");
  if (field.fieldKind === "cta") {
    return clone(field.defaultValue) || { label: "", link: "", target: "_self" };
  }
  if (field.fieldKind === "image") {
    return clone(field.defaultValue) || {
      source: field.image?.allowedSources?.[0] || "url", value: "", description: "", alt: "",
    };
  }
  return clone(field.defaultValue ?? "");
}

function componentFields(component, contentLocked) {
  const source = Array.isArray(component.fields) && component.fields.length
    ? component.fields : [{
      ...component,
      fieldKey: component.itemKey,
    }];
  return source.map((field) => contentLocked ? {
    ...clone(field), isLocked: true, lockedValue: clone(field.lockedValue ?? field.defaultValue ?? ""),
  } : clone(field));
}

function componentValue(fields) {
  const values = Object.fromEntries(fields.map((field) => [field.fieldKey, fieldDefault(field)]));
  return fields.length > 1 ? { fields: values } : values[fields[0]?.fieldKey];
}

function setFieldValue(current, fields, fieldKey, value) {
  if (fields.length > 1) {
    const source = current && typeof current === "object" && !Array.isArray(current) ? current : {};
    return { ...source, fields: { ...(source.fields || {}), [fieldKey]: clone(value) } };
  }
  return clone(value);
}

function applyPresetValue(current, fields, value) {
  if (fields.length <= 1) return clone(value);
  if (!value || typeof value !== "object" || Array.isArray(value)) return current;
  const presetFields = value.fields && typeof value.fields === "object" ? value.fields : value;
  const allowedKeys = new Set(fields.map((field) => field.fieldKey));
  const mergedFields = { ...(current?.fields || {}) };
  Object.entries(presetFields).forEach(([fieldKey, fieldValue]) => {
    if (allowedKeys.has(fieldKey)) mergedFields[fieldKey] = clone(fieldValue);
  });
  return { ...(current || {}), fields: mergedFields };
}

function overviewValue(field, value) {
  if (field.fieldKind === "cta") return { label: normalizeCtaLabel(value, { allowEmpty: false }), link: "", target: "_self" };
  return String(value || "");
}

function resourceFieldValue(content, component, field, fieldCount) {
  const componentContent = content?.components?.[component.itemKey]
    ?? content?.components?.[component.componentKey];
  if (componentContent?.fields && Object.prototype.hasOwnProperty.call(componentContent.fields, field.fieldKey)) {
    return componentContent.fields[field.fieldKey];
  }
  if (componentContent && typeof componentContent === "object"
    && Object.prototype.hasOwnProperty.call(componentContent, field.fieldKey)) {
    return componentContent[field.fieldKey];
  }
  if (content?.fields && Object.prototype.hasOwnProperty.call(content.fields, field.fieldKey)) {
    return content.fields[field.fieldKey];
  }
  if (content && Object.prototype.hasOwnProperty.call(content, field.fieldKey)) return content[field.fieldKey];
  if (fieldCount !== 1) return undefined;
  if (componentContent !== undefined) return componentContent;
  if (field.fieldKind === "cta" && content?.cta !== undefined) return content.cta;
  if (field.fieldKind === "image" && content?.image !== undefined) return content.image;
  return content?.content ?? content?.text ?? content?.markdown;
}

function motionConfig(preset) {
  if (!preset) return null;
  return {
    presetVersionId: preset.presetVersionId,
    className: preset.config?.className || "",
    ...(preset.config?.durationToken ? { durationToken: preset.config.durationToken } : {}),
    ...(preset.config?.easingToken ? { easingToken: preset.config.easingToken } : {}),
    ...(preset.config?.delayToken ? { delayToken: preset.config.delayToken } : {}),
  };
}

function applyCollectionGeometry(targetStyles, sectionId, entries, collection, { mobile = false } = {}) {
  if (!collection?.enabled || entries.length < 2) return;
  const baseKey = `${sectionId}.${entries[0].componentId}`;
  const base = targetStyles[baseKey];
  if (!base) return;
  const columns = Math.max(1, Math.min(
    entries.length,
    Number(mobile ? collection.mobileColumns : collection.desktopColumns) || 1,
  ));
  const gapPct = Number(collection.gapPct || 2);
  const gapPx = Number(collection.gapPx || 16);
  const width = Number(base.widthPct || 100);
  const itemWidth = Math.max(0.01, (width - gapPct * (columns - 1)) / columns);
  const height = Number(base.heightPx || 1);
  entries.forEach((entry, index) => {
    const column = index % columns;
    const row = Math.floor(index / columns);
    targetStyles[`${sectionId}.${entry.componentId}`] = {
      ...clone(base),
      xPct: Number(base.xPct || 0) + column * (itemWidth + gapPct),
      yPx: Number(base.yPx || 0) + row * (height + gapPx),
      widthPct: itemWidth,
    };
  });
}

async function compileRegistryComposition({
  sql,
  proposalSnapshot,
  candidates,
  overview = {},
  documentId,
  proposalId,
  documentRevision = 0,
  fetchPinnedResources = fetchPinnedResourceVersions,
}) {
  if (Number(proposalSnapshot?.contractVersion) !== 3
    || proposalSnapshot?.snapshotType !== "registry-composition-proposal") {
    throw compilerError("INVALID_V3_PROPOSAL_SNAPSHOT", "Contract v3 proposal snapshot is invalid", 422);
  }
  const spec = proposalSnapshot.compositionSpec || {};
  if (spec.shellVersionId !== candidates.shell?.shellVersionId) {
    throw compilerError("SHELL_VERSION_MISMATCH", "Composition Shell changed before compilation");
  }
  const plannedSectionVersionIds = new Set(
    (spec.sections || []).map((section) => String(section.sectionVersionId || "")),
  );
  const missingRequiredSections = (candidates.sections || []).filter(
    (section) => section.resolvedRequired && !plannedSectionVersionIds.has(section.sectionVersionId),
  );
  if (missingRequiredSections.length) {
    throw compilerError(
      "REQUIRED_SECTION_MISSING",
      `Required Section is missing before compilation: ${missingRequiredSections.map((section) => section.sectionKey).join(", ")}`,
      422,
    );
  }
  const references = Array.isArray(spec.resourceReferences) ? spec.resourceReferences : [];
  const resourcesById = await fetchPinnedResources(sql, references);
  const sectionsById = new Map((candidates.sections || []).map((section) => [section.sectionVersionId, section]));
  const tokenSet = (candidates.tokenSets || []).find(
    (candidate) => candidate.tokenSetVersionId === spec.designTokenSetVersionId,
  ) || null;
  if (spec.designTokenSetVersionId && !tokenSet) {
    throw compilerError("TOKEN_SET_VERSION_MISMATCH", "Design Token Set changed before compilation");
  }
  const tokenValues = tokenSet?.runtimeValues || {};
  const tokenBindings = resolveDesignTokenBindings(tokenValues, tokenSet?.selectableTokens || []);
  const missingTokenRoles = missingRequiredDesignTokenRoles(tokenValues);
  if (missingTokenRoles.length) {
    const error = compilerError(
      "REQUIRED_DESIGN_TOKEN_MISSING",
      `Design Token Set is missing required semantic roles: ${missingTokenRoles.join(", ")}`,
      422,
    );
    error.missingTokenRoles = missingTokenRoles;
    throw error;
  }

  const sectionSnapshot = [];
  const sectionInputs = {};
  const sectionOrder = [];
  const provenance = {};
  const sectionStyles = {};
  const presetItemStyles = {};
  const mobileItemStyles = {};
  const itemVisibility = {};
  const fieldVisibility = {};
  const mobileItemVisibility = {};
  const motionSections = {};
  const assetRequests = [];
  const expectedAssets = [];
  const layoutDiagnostics = [];

  for (const planned of spec.sections || []) {
    const section = sectionsById.get(planned.sectionVersionId);
    if (!section) throw compilerError("SECTION_VERSION_MISMATCH", `Section version is no longer available: ${planned.sectionVersionId}`);
    const componentsById = new Map((section.components || []).map((item) => [item.componentInstanceId, item]));
    const layout = (section.layoutPresets || []).find((item) => item.layoutKey === planned.layoutKey);
    if (!layout) throw compilerError("LAYOUT_VERSION_MISMATCH", `Section Layout is no longer available: ${planned.layoutKey}`);
    const preset = planned.motionPresetVersionId
      ? (candidates.motionPresets || []).find((item) => item.presetVersionId === planned.motionPresetVersionId)
      : null;
    if (planned.motionPresetVersionId && !preset) {
      throw compilerError("MOTION_VERSION_MISMATCH", "Motion Preset changed before compilation");
    }
    for (let repeatIndex = 0; repeatIndex < Number(planned.repeat || 1); repeatIndex += 1) {
      const sectionId = stableId("sec", proposalId, planned.sectionVersionId, repeatIndex);
      const items = [];
      sectionInputs[sectionId] = {};
      sectionOrder.push(sectionId);
      if (preset) motionSections[sectionId] = motionConfig(preset);

      const compiledComponents = [];
      for (const selected of planned.components || []) {
        const component = componentsById.get(selected.componentInstanceId);
        if (!component) throw compilerError("COMPONENT_VERSION_MISMATCH", `Component is no longer available: ${selected.componentInstanceId}`);
        for (let componentIndex = 0; componentIndex < Number(selected.repeat || 1); componentIndex += 1) {
          const componentId = stableId(
            "cmp", proposalId, planned.sectionVersionId, repeatIndex, selected.componentInstanceId, componentIndex,
          );
          const fields = componentFields(component, Boolean(section.compositionPolicy?.contentLocked));
          const definition = {
            id: componentId,
            itemKey: componentId,
            sourceDefinitionInstanceId: component.componentInstanceId,
            sourceItemKey: componentIndex === 0 ? component.itemKey : `${component.itemKey}#${componentIndex + 1}`,
            componentVersionId: component.componentVersionId,
            componentKey: component.componentKey,
            name: Number(selected.repeat || 1) > 1 ? `${component.name} ${componentIndex + 1}` : component.name,
            description: component.description || "",
            fieldKind: component.fieldKind,
            textType: component.textType || null,
            image: clone(component.image),
            ctaUtm: clone(component.ctaUtm),
            editorSchema: clone(component.editorSchema || {}),
            capabilities: clone(component.capabilitiesConfig || {}),
            styleSlots: clone(component.styleSlots || []),
            instanceConfig: clone(component.instanceConfig || {}),
            defaultValue: clone(component.defaultValue),
            isRequired: Boolean(component.isRequired && componentIndex === 0),
            isLocked: Boolean(component.isLocked || section.compositionPolicy?.contentLocked),
            lockedValue: clone(component.lockedValue),
            collection: {
              ...clone(component.collection || { enabled: false, minItems: 1, maxItems: 1 }),
              collectionKey: component.componentInstanceId,
              sourceItemKey: component.itemKey,
              required: Boolean(component.isRequired),
              index: componentIndex,
            },
            fields,
          };
          items.push(definition);
          compiledComponents.push({ selected, component, item: definition, componentId, componentIndex });
          sectionInputs[sectionId][componentId] = componentValue(fields);
          itemVisibility[`${sectionId}.${componentId}`] = selected.visible !== false;
          fields.forEach((field) => {
            fieldVisibility[`${sectionId}.${componentId}.${field.fieldKey}`] = true;
          });
        }
      }

      const resolvedLayout = resolveSectionLayoutPreset(sectionId, items, layout);
      layoutDiagnostics.push(...(resolvedLayout?.diagnostics || []).map((entry) => ({
        ...entry,
        sectionKey: section.sectionKey,
        layoutKey: layout.layoutKey,
      })));
      Object.entries(resolvedLayout?.content || {}).forEach(([componentId, value]) => {
        const item = items.find((candidate) => candidate.id === componentId);
        if (!item) return;
        sectionInputs[sectionId][componentId] = applyPresetValue(
          sectionInputs[sectionId][componentId], item.fields, value,
        );
      });

      for (const selected of planned.components || []) {
        const entries = compiledComponents.filter((entry) => entry.selected === selected);
        const first = entries[0];
        if (!first) continue;
        entries.slice(1).forEach((entry) => {
          sectionInputs[sectionId][entry.componentId] = clone(sectionInputs[sectionId][first.componentId]);
        });
      }

      for (const entry of compiledComponents) {
        const { selected, component, componentId, item } = entry;
        for (const binding of selected.contentBindings || []) {
          const field = item.fields.find((candidate) => candidate.fieldKey === binding.fieldKey);
          if (!field || field.isLocked) continue;
          sectionInputs[sectionId][componentId] = setFieldValue(
            sectionInputs[sectionId][componentId], item.fields, field.fieldKey,
            overviewValue(field, overview[binding.sourceOverviewPath]),
          );
          provenance[`${sectionId}.${componentId}.${field.fieldKey}`] = {
            source: "overview-binding", sourceOverviewPath: binding.sourceOverviewPath, confirmationRequired: false,
          };
        }
        for (const reference of planned.resourceReferences || []) {
          const resource = resourcesById.get(reference.resourceVersionId);
          if (!resource) continue;
          for (const field of item.fields) {
            const value = resourceFieldValue(resource.content || {}, component, field, item.fields.length);
            if (value === undefined) continue;
            sectionInputs[sectionId][componentId] = setFieldValue(
              sectionInputs[sectionId][componentId], item.fields, field.fieldKey, value,
            );
            if (field.isLocked) field.lockedValue = clone(value);
            if (item.fields.length === 1 && item.isLocked) item.lockedValue = clone(value);
            provenance[`${sectionId}.${componentId}.${field.fieldKey}`] = {
              source: "content-resource",
              resourceKey: reference.resourceKey,
              resourceVersionId: reference.resourceVersionId,
              contentHash: reference.contentHash,
            };
          }
        }
        item.fields.forEach((field) => {
          if (usesComponentImageTarget(section, item)
            && field.fieldKind === "image" && !field.isLocked && field.image?.allowedSources?.includes("ai")) {
            const assetRequest = {
              assetRequestId: stableUuid(proposalId, sectionId, componentId, field.fieldKey),
              targetType: "component-field-image", pageSectionInstanceId: sectionId,
              pageComponentInstanceId: componentId,
              fieldKey: field.fieldKey,
              assetRole: item.instanceConfig?.assetRole || (section.sectionRole === "hero" ? "hero-key-visual" : "component-image"),
              guidance: item.instanceConfig?.assetPromptText || "",
              aspectRatio: section.sectionRole === "hero"
                ? (section.aiDesign?.imageAspectRatio || "4:3")
                : (field.image?.aspectRatio || "1:1"),
              status: "pending",
            };
            assetRequests.push(assetRequest);
            expectedAssets.push({
              assetRequestId: assetRequest.assetRequestId,
              targetType: assetRequest.targetType,
              pageSectionInstanceId: assetRequest.pageSectionInstanceId,
              pageComponentInstanceId: assetRequest.pageComponentInstanceId,
              fieldKey: assetRequest.fieldKey,
              required: true,
            });
          }
        });
      }

      const resolvedSectionStyle = clone(resolvedLayout?.sectionStyle || { layoutVariant: planned.layoutKey });
      delete resolvedSectionStyle.backgroundColor;
      delete resolvedSectionStyle.backgroundFadeColor;
      resolvedSectionStyle.backgroundColorToken = ["hero", "key-visual"].includes(section.sectionRole)
        ? tokenBindings.background
        : tokenBindings.surface;
      if (resolvedSectionStyle.backgroundFadeMode && resolvedSectionStyle.backgroundFadeMode !== "none") {
        resolvedSectionStyle.backgroundFadeColorToken = resolvedSectionStyle.backgroundColorToken;
      }
      sectionStyles[sectionId] = resolvedSectionStyle;
      Object.assign(presetItemStyles, resolvedLayout?.itemStyles || {});
      Object.assign(itemVisibility, resolvedLayout?.visibilityItems || {});
      Object.assign(mobileItemStyles, resolvedLayout?.responsiveLayouts?.mobile?.itemStyles || {});
      Object.assign(mobileItemVisibility, resolvedLayout?.responsiveLayouts?.mobile?.visibility?.items || {});
      for (const selected of planned.components || []) {
        const entries = compiledComponents.filter((entry) => entry.selected === selected);
        const collection = entries[0]?.component?.collection;
        applyCollectionGeometry(presetItemStyles, sectionId, entries, collection);
        applyCollectionGeometry(mobileItemStyles, sectionId, entries, collection, { mobile: true });
      }
      if (usesSectionKeyVisualTarget(section)) {
        const assetRequest = {
          assetRequestId: stableUuid(proposalId, sectionId, "section-key-visual"),
          targetType: "section-key-visual", pageSectionInstanceId: sectionId, status: "pending",
        };
        assetRequests.push(assetRequest);
        expectedAssets.push({
          assetRequestId: assetRequest.assetRequestId,
          targetType: assetRequest.targetType,
          pageSectionInstanceId: assetRequest.pageSectionInstanceId,
          required: true,
        });
      }
      sectionSnapshot.push({
        id: sectionId,
        sectionKey: sectionId,
        pageSectionInstanceId: sectionId,
        sourceSectionId: section.sectionVersionId,
        sourceSectionVersion: section.version,
        sourceSectionKey: section.sectionKey,
        name: section.name,
        description: section.description || "",
        sectionRole: section.sectionRole,
        compositionPolicy: clone(section.compositionPolicy || {}),
        fixedPosition: section.fixedPosition || null,
        isRequired: Boolean(section.resolvedRequired),
        isVisibleInWizard: planned.visible !== false,
        sortOrder: Number(planned.sortOrder || 0) + repeatIndex,
        aiDesign: clone(section.aiDesign || {}),
        defaultLayoutKey: section.defaultLayoutKey || null,
        allowedLayoutKeys: clone(section.allowedLayoutKeys || []),
        layoutSelectionLocked: Boolean(section.layoutSelectionLocked),
        layoutPresets: clone(section.layoutPresets || []),
        selectedLayoutKey: resolvedLayout?.layoutKey || planned.layoutKey,
        resourceReferences: clone(planned.resourceReferences || []),
        items,
      });
    }
  }

  const defaultItemStyles = buildDefaultItemStyles(
    sectionSnapshot,
    tokenValues,
    tokenSet?.selectableTokens || [],
  );
  const itemStyleKeys = new Set([...Object.keys(defaultItemStyles), ...Object.keys(presetItemStyles)]);
  const mergedItemStyles = Object.fromEntries([...itemStyleKeys].map((key) => [key, {
    ...(defaultItemStyles[key] || {}), ...(presetItemStyles[key] || {}),
  }]));
  const collisionSafeLayout = avoidTextComponentOverlaps({
    sections: sectionSnapshot,
    sectionInputs,
    itemStyles: mergedItemStyles,
    mobileItemStyles,
    sectionStyles,
    itemVisibility,
    mobileItemVisibility,
    tokenValues,
  });
  layoutDiagnostics.push(...collisionSafeLayout.diagnostics);
  const designSpec = {
    contractVersion: 1,
    specKey: "ai-registry-composition",
    theme: {
      backgroundColorToken: tokenBindings.background,
      surfaceColorToken: tokenBindings.surface,
      textColorToken: tokenBindings.text,
      accentColorToken: tokenBindings.accent,
      ctaColorToken: tokenBindings.accent,
      radiusToken: tokenBindings.radius,
      shadowToken: tokenBindings.shadow,
      fontFamilyToken: tokenBindings.font,
    },
    responsive: { contentMaxWidth: 1280, contentMinWidth: 1140, mobileBreakpoint: 720 },
    itemStyles: collisionSafeLayout.itemStyles,
    sectionStyles: collisionSafeLayout.sectionStyles,
    visibility: { items: itemVisibility, fields: fieldVisibility },
    responsiveLayouts: { mobile: { itemStyles: collisionSafeLayout.mobileItemStyles, visibility: { items: mobileItemVisibility } } },
  };
  const layoutValidation = validateLayoutSpec(designSpec, sectionSnapshot);
  if (layoutValidation.errors.length) {
    throw Object.assign(new Error("Compiled Contract v3 layout is invalid"), {
      code: "COMPILED_LAYOUT_INVALID", statusCode: 422, errors: layoutValidation.errors,
    });
  }
  const shell = candidates.shell || {};
  return {
    contractVersion: 3,
    documentRevision: Number(documentRevision || 0),
    layoutRevision: 0,
    layoutIdentity: {
      contractVersion: 3,
      templateId: shell.fallbackTemplateId || "",
      templateKey: `shell:${shell.shellKey || "registry"}`,
      templateVersion: Number(shell.fallbackTemplateVersion || 1),
      layoutId: "", layoutRevision: 0,
      configRevision: candidates.candidateFingerprint,
      rendererKey: "default-promo-renderer", rendererVersion: 1,
    },
    compositionMeta: {
      compositionId: stableUuid(proposalId, "composition"),
      documentId, proposalId, mode: "ai-composition",
      shellVersionId: shell.shellVersionId,
      compositionCriteria: clone(candidates.criteria || {}),
      overviewFingerprint: proposalSnapshot.compositionMeta?.overviewFingerprint || "",
      candidateFingerprint: candidates.candidateFingerprint,
      policyFingerprint: candidates.policyFingerprint,
      resourceFingerprint: candidates.resourceFingerprint,
      sourceTemplateId: shell.fallbackTemplateId || null,
      sourceTemplateVersion: Number(shell.fallbackTemplateVersion || 1),
      promptTemplateVersionId: proposalSnapshot.compositionMeta?.promptTemplateVersionId || "",
      model: proposalSnapshot.compositionMeta?.model || "",
      reasoningSummary: proposalSnapshot.compositionMeta?.reasoningSummary || "",
    },
    appearance: {
      designTokenSetVersionId: tokenSet?.tokenSetVersionId || "",
      motionEnabled: Object.keys(motionSections).length > 0,
    },
    content: {
      contractVersion: 3,
      formTemplate: {
        id: shell.fallbackTemplateId || "",
        templateKey: `shell:${shell.shellKey || "registry"}`,
        version: Number(shell.fallbackTemplateVersion || 1),
        designTokenSetVersionId: tokenSet?.tokenSetVersionId || "",
        designTokens: { values: tokenValues },
      },
      sectionSnapshot, sectionInputs, sectionOrder,
      resourceReferences: clone(references),
    },
    provenance,
    designSpec,
    motionSpec: { sections: motionSections, items: {} },
    assets: { contractVersion: 1, items: {}, expected: expectedAssets, requests: assetRequests },
    validation: {
      ok: true, errors: [],
      warnings: [
        ...(proposalSnapshot.validation?.warnings || []),
        ...(layoutValidation.warnings || []),
        ...layoutDiagnostics,
      ],
    },
  };
}

module.exports = {
  compileRegistryComposition,
  stableId,
  stableUuid,
  resourceFieldValue,
};
