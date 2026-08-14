const { createHash, randomUUID } = require("node:crypto");
const { resolveSectionLayoutPreset } = require("./_section-layout-preset-resolver");
const { OPERATION_TYPES } = require("./_promo-page-composition-contract");
const { resolveAllowedLayoutPresets } = require("./_promo-layout-preset-policy");

function collectTargets(snapshot) {
  const sections = new Map();
  const components = new Map();
  const fields = new Map();
  (snapshot?.content?.sectionSnapshot || []).forEach((section) => {
    sections.set(section.pageSectionInstanceId || section.sectionKey, section);
    (section.items || []).forEach((item) => {
      const componentId = item.id || item.itemKey;
      components.set(componentId, { section, item });
      const itemFields = Array.isArray(item.fields) && item.fields.length
        ? item.fields
        : [{ ...item, fieldKey: item.sourceItemKey || item.itemKey }];
      itemFields.forEach((field) => fields.set(`${componentId}.${field.fieldKey}`, {
        section,
        item,
        field,
      }));
    });
  });
  return { sections, components, fields };
}

function compositionOperationSchema(snapshot, motionPresets = [], registryCandidates = null) {
  const targets = collectTargets(snapshot);
  const targetIds = [
    ...targets.sections.keys(),
    ...targets.components.keys(),
  ];
  const fieldKeys = Array.from(new Set(
    [...targets.fields.values()].map(({ field }) => field.fieldKey),
  ));
  const tokenKeys = Object.keys(snapshot?.content?.formTemplate?.designTokens?.values || {});
  const motionPresetVersionIds = ["", ...motionPresets.map((preset) => preset.presetVersionId)];
  const sectionVersionIds = (registryCandidates?.sections || []).map((section) => section.sectionVersionId);
  return {
    type: "object",
    additionalProperties: false,
    required: ["operations", "summary", "warnings"],
    properties: {
      operations: {
        type: "array",
        maxItems: 30,
        items: {
          type: "object",
          additionalProperties: false,
          required: [
            "operationId", "type", "targetInstanceId", "fieldKey", "valueText",
            "visible", "position", "layoutVariant", "tokenKey",
            "motionPresetVersionId", "sourceVersionId", "reason",
          ],
          properties: {
            operationId: { type: "string", maxLength: 100 },
            type: { type: "string", enum: OPERATION_TYPES },
            targetInstanceId: { type: "string", enum: ["", ...targetIds] },
            fieldKey: { type: "string", enum: fieldKeys.length ? ["", ...fieldKeys] : [""] },
            valueText: { type: "string", maxLength: 3000 },
            visible: { type: "boolean" },
            position: { type: "integer", minimum: 0, maximum: 100 },
            layoutVariant: { type: "string", maxLength: 100 },
            tokenKey: { type: "string", enum: tokenKeys.length ? ["", ...tokenKeys] : [""] },
            motionPresetVersionId: { type: "string", enum: motionPresetVersionIds },
            sourceVersionId: { type: "string", enum: sectionVersionIds.length ? ["", ...sectionVersionIds] : [""] },
            reason: { type: "string", maxLength: 500 },
          },
        },
      },
      summary: { type: "string", maxLength: 1000 },
      warnings: {
        type: "array",
        maxItems: 20,
        items: { type: "string", maxLength: 300 },
      },
    },
  };
}

function validateCompositionOperations(result, snapshot, motionPresets = [], registryCandidates = null) {
  const targets = collectTargets(snapshot);
  const motionIds = new Set(motionPresets.map((preset) => preset.presetVersionId));
  const tokenKeys = new Set(Object.keys(snapshot?.content?.formTemplate?.designTokens?.values || {}));
  const seen = new Set();
  const registrySections = new Map((registryCandidates?.sections || []).map((section) => [section.sectionVersionId, section]));
  const operations = (Array.isArray(result?.operations) ? result.operations : []).map((candidate) => {
    const type = String(candidate.type || "");
    const targetInstanceId = String(candidate.targetInstanceId || "");
    const operationId = String(candidate.operationId || "").trim() || randomUUID();
    if (!OPERATION_TYPES.includes(type) || seen.has(operationId)) {
      throw Object.assign(new Error("Invalid or duplicate composition operation"), { code: "INVALID_OPERATION" });
    }
    seen.add(operationId);
    const section = targets.sections.get(targetInstanceId);
    const component = targets.components.get(targetInstanceId);
    const isSectionAddition = type === "add-section";
    if (!isSectionAddition && !section && !component) {
      throw Object.assign(new Error("Operation target is not available"), { code: "INVALID_OPERATION_TARGET" });
    }
    if (isSectionAddition && (!candidate.sourceVersionId || !registrySections.has(candidate.sourceVersionId))) {
      throw Object.assign(new Error("Registry Section version is unavailable"), { code: "INVALID_SOURCE_SECTION" });
    }
    if (type === "replace-section") {
      const replacement = registrySections.get(candidate.sourceVersionId);
      if (!section || !replacement) {
        throw Object.assign(new Error("Replacement Section version is unavailable"), { code: "INVALID_SOURCE_SECTION" });
      }
      if ((section.isRequired || section.fixedPosition)
        && (replacement.sectionRole !== section.sectionRole || replacement.fixedPosition !== section.fixedPosition)) {
        throw Object.assign(new Error("Required Section replacement must preserve its role and fixed position"), { code: "INVALID_SECTION_REPLACEMENT" });
      }
    }
    if (type === "remove-section" && (section?.isRequired || section?.fixedPosition || section?.isLocked)) {
      throw Object.assign(new Error("Required or fixed Section cannot be removed"), { code: "LOCKED_SECTION_REMOVE" });
    }
    if (["add-collection-item", "remove-collection-item", "move-collection-item"].includes(type)) {
      const collection = component?.item?.collection;
      if (!component || !collection?.enabled) {
        throw Object.assign(new Error("Operation target is not a Collection item"), { code: "INVALID_COLLECTION_TARGET" });
      }
      const collectionItems = (component.section.items || []).filter((item) => (
        item.collection?.collectionKey === collection.collectionKey
      ));
      if (type === "add-collection-item" && collectionItems.length >= Number(collection.maxItems || 1)) {
        throw Object.assign(new Error("Collection reached its maximum item count"), { code: "COLLECTION_MAX_ITEMS" });
      }
      if (type === "remove-collection-item"
        && (collectionItems.length <= Number(collection.minItems || 1) || component.item.isRequired)) {
        throw Object.assign(new Error("Collection reached its minimum item count"), { code: "COLLECTION_MIN_ITEMS" });
      }
    }
    if (type === "update-field") {
      const fieldTarget = targets.fields.get(`${targetInstanceId}.${candidate.fieldKey}`);
      if (!fieldTarget || fieldTarget.field.isLocked || fieldTarget.item.isLocked) {
        throw Object.assign(new Error("Field is unavailable or locked"), { code: "LOCKED_FIELD" });
      }
    }
    if ((type === "request-asset-regeneration" || type === "remove-asset") && component) {
      const fieldTarget = targets.fields.get(`${targetInstanceId}.${candidate.fieldKey}`);
      if (!fieldTarget || fieldTarget.field.fieldKind !== "image"
        || fieldTarget.field.isLocked || fieldTarget.item.isLocked) {
        throw Object.assign(new Error("Image field is unavailable or locked"), { code: "LOCKED_FIELD" });
      }
    }
    if (type === "set-visibility") {
      const target = section || component?.item;
      if (target.isRequired || target.isLocked || target.fixedPosition) {
        throw Object.assign(new Error("Required or fixed target visibility cannot change"), { code: "LOCKED_VISIBILITY" });
      }
    }
    if (type === "move-section" && section?.fixedPosition) {
      throw Object.assign(new Error("Fixed section cannot move"), { code: "FIXED_SECTION_MOVE" });
    }
    if (type === "move-component" && component?.item?.userReorderAllowed === false) {
      throw Object.assign(new Error("Component order is locked"), { code: "LOCKED_COMPONENT_ORDER" });
    }
    if (type === "change-layout-variant") {
      const presetKeys = new Set((section?.layoutPresets || []).map((layout) => layout.layoutKey));
      const layoutPolicy = section ? resolveAllowedLayoutPresets(
        section,
        section.layoutPresets || [],
      ) : { allowedLayoutKeys: [] };
      const allowed = presetKeys.size
        ? (section?.allowedLayoutKeys?.length ? section.allowedLayoutKeys : layoutPolicy.allowedLayoutKeys)
        : section?.compositionPolicy?.allowedLayoutVariants || [];
      if (!section || (presetKeys.size
        ? !allowed.includes(candidate.layoutVariant)
        : (allowed.length && !allowed.includes(candidate.layoutVariant)))) {
        throw Object.assign(new Error("Layout variant is not allowed"), { code: "INVALID_LAYOUT_VARIANT" });
      }
    }
    if (type === "change-token-binding" && !tokenKeys.has(candidate.tokenKey)) {
      throw Object.assign(new Error("Token binding is not available"), { code: "INVALID_TOKEN_BINDING" });
    }
    if (type === "change-motion-preset"
      && candidate.motionPresetVersionId
      && !motionIds.has(candidate.motionPresetVersionId)) {
      throw Object.assign(new Error("Motion preset is not available"), { code: "INVALID_MOTION_PRESET" });
    }
    return {
      operationId,
      type,
      targetInstanceId,
      fieldKey: String(candidate.fieldKey || ""),
      valueText: String(candidate.valueText || "").slice(0, 3000),
      visible: Boolean(candidate.visible),
      position: Math.max(0, Math.min(100, Number(candidate.position || 0))),
      layoutVariant: String(candidate.layoutVariant || ""),
      tokenKey: String(candidate.tokenKey || ""),
      motionPresetVersionId: String(candidate.motionPresetVersionId || ""),
      sourceVersionId: String(candidate.sourceVersionId || ""),
      reason: String(candidate.reason || "").slice(0, 500),
      source: "ai",
    };
  });
  return {
    operations,
    summary: String(result?.summary || "").slice(0, 1000),
    warnings: Array.isArray(result?.warnings) ? result.warnings.map(String).slice(0, 20) : [],
  };
}

function deterministicComponentId(operation) {
  return `cmp_${createHash("sha256")
    .update(`${operation.operationId}:${operation.targetInstanceId}:collection-item`)
    .digest("hex").slice(0, 32)}`;
}

function reflowCollection(next, section, collectionKey) {
  const sectionKey = section.pageSectionInstanceId || section.sectionKey;
  const entries = (section.items || []).filter((item) => item.collection?.collectionKey === collectionKey);
  if (!entries.length) return;
  entries.forEach((item, index) => {
    item.collection.index = index;
    item.isRequired = Boolean(item.collection.required && index === 0);
  });
  const collection = entries[0].collection;
  function reflow(styles, mobile) {
    const base = styles?.[`${sectionKey}.${entries[0].id || entries[0].itemKey}`];
    if (!base) return;
    const columns = Math.max(1, Math.min(entries.length, Number(
      mobile ? collection.mobileColumns : collection.desktopColumns,
    ) || 1));
    const gapPct = Number(collection.gapPct || 2);
    const gapPx = Number(collection.gapPx || 16);
    const width = Number(base.widthPct || 100);
    const itemWidth = Math.max(0.01, (width - gapPct * (columns - 1)) / columns);
    const height = Number(base.heightPx || 1);
    entries.forEach((item, index) => {
      const itemKey = item.id || item.itemKey;
      styles[`${sectionKey}.${itemKey}`] = {
        ...base,
        xPct: Number(base.xPct || 0) + (index % columns) * (itemWidth + gapPct),
        yPx: Number(base.yPx || 0) + Math.floor(index / columns) * (height + gapPx),
        widthPct: itemWidth,
      };
    });
  }
  reflow(next.designSpec.itemStyles, false);
  reflow(next.designSpec.responsiveLayouts?.mobile?.itemStyles, true);
}

function removeSectionInstance(next, sectionKey) {
  next.content.sectionSnapshot = (next.content.sectionSnapshot || []).filter((section) => (
    (section.pageSectionInstanceId || section.sectionKey) !== sectionKey
  ));
  const orderIndex = (next.content.sectionOrder || []).indexOf(sectionKey);
  if (orderIndex >= 0) next.content.sectionOrder.splice(orderIndex, 1);
  delete next.content.sectionInputs?.[sectionKey];
  delete next.designSpec.sectionStyles?.[sectionKey];
  delete next.motionSpec?.sections?.[sectionKey];
  for (const record of [
    next.designSpec.itemStyles,
    next.designSpec.visibility?.items,
    next.designSpec.visibility?.fields,
    next.designSpec.responsiveLayouts?.mobile?.itemStyles,
    next.designSpec.responsiveLayouts?.mobile?.visibility?.items,
    next.provenance,
  ]) {
    Object.keys(record || {}).forEach((key) => {
      if (key.startsWith(`${sectionKey}.`)) delete record[key];
    });
  }
  next.assets.requests = (next.assets.requests || []).filter(
    (request) => request.pageSectionInstanceId !== sectionKey,
  );
}

function addSectionInstance(next, payload, position) {
  if (!payload?.section?.sectionKey) return;
  const sectionKey = payload.section.sectionKey;
  const index = Math.max(0, Math.min(Number(position || 0), next.content.sectionOrder.length));
  next.content.sectionOrder ||= [];
  next.content.sectionSnapshot ||= [];
  next.content.sectionInputs ||= {};
  next.designSpec.sectionStyles ||= {};
  next.designSpec.itemStyles ||= {};
  next.designSpec.visibility ||= { items: {}, fields: {} };
  next.designSpec.visibility.items ||= {};
  next.designSpec.visibility.fields ||= {};
  next.designSpec.responsiveLayouts ||= {};
  next.designSpec.responsiveLayouts.mobile ||= { itemStyles: {}, visibility: { items: {} } };
  next.designSpec.responsiveLayouts.mobile.itemStyles ||= {};
  next.designSpec.responsiveLayouts.mobile.visibility ||= { items: {} };
  next.designSpec.responsiveLayouts.mobile.visibility.items ||= {};
  next.motionSpec ||= { sections: {}, items: {} };
  next.motionSpec.sections ||= {};
  next.provenance ||= {};
  next.assets ||= { contractVersion: 1, items: {}, requests: [] };
  next.assets.requests ||= [];
  next.content.sectionOrder.splice(index, 0, sectionKey);
  next.content.sectionSnapshot.splice(index, 0, payload.section);
  next.content.sectionInputs[sectionKey] = payload.content || {};
  next.designSpec.sectionStyles[sectionKey] = payload.sectionStyle || {};
  Object.assign(next.designSpec.itemStyles, payload.itemStyles || {});
  Object.assign(next.designSpec.visibility.items, payload.visibilityItems || {});
  Object.assign(next.designSpec.visibility.fields, payload.visibilityFields || {});
  Object.assign(next.designSpec.responsiveLayouts.mobile.itemStyles, payload.mobileItemStyles || {});
  Object.assign(next.designSpec.responsiveLayouts.mobile.visibility.items, payload.mobileVisibilityItems || {});
  if (payload.motion) next.motionSpec.sections[sectionKey] = payload.motion;
  Object.assign(next.provenance, payload.provenance || {});
  next.assets.requests.push(...(payload.assetRequests || []));
}

function applyCompositionOperations(snapshot, operations) {
  const next = JSON.parse(JSON.stringify(snapshot));
  const targets = collectTargets(next);
  const sectionOrder = next.content.sectionOrder;
  for (const operation of operations) {
    const section = targets.sections.get(operation.targetInstanceId);
    const component = targets.components.get(operation.targetInstanceId);
    if (operation.type === "update-field") {
      const { section: ownerSection, item } = targets.fields.get(
        `${operation.targetInstanceId}.${operation.fieldKey}`,
      );
      const sectionKey = ownerSection.pageSectionInstanceId || ownerSection.sectionKey;
      const itemKey = item.id || item.itemKey;
      const current = next.content.sectionInputs[sectionKey][itemKey];
      const fields = Array.isArray(item.fields) ? item.fields : [];
      if (fields.length > 1) {
        next.content.sectionInputs[sectionKey][itemKey] = {
          ...(current || {}),
          fields: { ...(current?.fields || {}), [operation.fieldKey]: operation.valueText },
        };
      } else {
        next.content.sectionInputs[sectionKey][itemKey] = operation.valueText;
      }
    } else if (operation.type === "set-visibility") {
      if (section) {
        section.isVisibleInWizard = operation.visible;
      } else {
        const sectionKey = component.section.pageSectionInstanceId || component.section.sectionKey;
        next.designSpec.visibility.items[`${sectionKey}.${operation.targetInstanceId}`] = operation.visible;
      }
    } else if (operation.type === "move-section") {
      const from = sectionOrder.indexOf(operation.targetInstanceId);
      if (from >= 0) {
        sectionOrder.splice(from, 1);
        sectionOrder.splice(Math.min(operation.position, sectionOrder.length), 0, operation.targetInstanceId);
      }
    } else if (operation.type === "add-section") {
      addSectionInstance(next, operation.sectionPayload, operation.position);
    } else if (operation.type === "remove-section") {
      removeSectionInstance(next, operation.targetInstanceId);
    } else if (operation.type === "replace-section") {
      const position = sectionOrder.indexOf(operation.targetInstanceId);
      removeSectionInstance(next, operation.targetInstanceId);
      addSectionInstance(next, operation.sectionPayload, position < 0 ? operation.position : position);
    } else if (operation.type === "move-component") {
      const list = component.section.items;
      const from = list.findIndex((item) => (item.id || item.itemKey) === operation.targetInstanceId);
      if (from >= 0) {
        const [moved] = list.splice(from, 1);
        list.splice(Math.min(operation.position, list.length), 0, moved);
      }
    } else if (operation.type === "add-collection-item") {
      const sectionKey = component.section.pageSectionInstanceId || component.section.sectionKey;
      const sourceKey = component.item.id || component.item.itemKey;
      const componentId = deterministicComponentId(operation);
      const collectionItems = component.section.items.filter((item) => (
        item.collection?.collectionKey === component.item.collection.collectionKey
      ));
      const cloned = JSON.parse(JSON.stringify(component.item));
      cloned.id = componentId;
      cloned.itemKey = componentId;
      cloned.sourceItemKey = `${cloned.collection.sourceItemKey}#${collectionItems.length + 1}`;
      cloned.name = `${String(cloned.name || "Collection item").replace(/\s+\d+$/, "")} ${collectionItems.length + 1}`;
      cloned.isRequired = false;
      cloned.collection.index = collectionItems.length;
      const insertIndex = component.section.items.lastIndexOf(collectionItems.at(-1)) + 1;
      component.section.items.splice(insertIndex, 0, cloned);
      next.content.sectionInputs[sectionKey][componentId] = JSON.parse(JSON.stringify(
        next.content.sectionInputs[sectionKey][sourceKey],
      ));
      next.designSpec.visibility.items[`${sectionKey}.${componentId}`] = true;
      (cloned.fields || []).forEach((field) => {
        next.designSpec.visibility.fields[`${sectionKey}.${componentId}.${field.fieldKey}`] = true;
      });
      reflowCollection(next, component.section, cloned.collection.collectionKey);
    } else if (operation.type === "remove-collection-item") {
      const sectionKey = component.section.pageSectionInstanceId || component.section.sectionKey;
      const componentKey = component.item.id || component.item.itemKey;
      const collectionKey = component.item.collection.collectionKey;
      component.section.items = component.section.items.filter((item) => (item.id || item.itemKey) !== componentKey);
      delete next.content.sectionInputs[sectionKey][componentKey];
      delete next.designSpec.itemStyles[`${sectionKey}.${componentKey}`];
      delete next.designSpec.visibility.items[`${sectionKey}.${componentKey}`];
      Object.keys(next.designSpec.visibility.fields || {}).forEach((key) => {
        if (key.startsWith(`${sectionKey}.${componentKey}.`)) delete next.designSpec.visibility.fields[key];
      });
      delete next.designSpec.responsiveLayouts?.mobile?.itemStyles?.[`${sectionKey}.${componentKey}`];
      reflowCollection(next, component.section, collectionKey);
    } else if (operation.type === "move-collection-item") {
      const collectionKey = component.item.collection.collectionKey;
      const collectionItems = component.section.items.filter((item) => item.collection?.collectionKey === collectionKey);
      const from = collectionItems.findIndex((item) => (item.id || item.itemKey) === operation.targetInstanceId);
      if (from >= 0) {
        const [moved] = collectionItems.splice(from, 1);
        collectionItems.splice(Math.min(operation.position, collectionItems.length), 0, moved);
        let cursor = 0;
        component.section.items = component.section.items.map((item) => (
          item.collection?.collectionKey === collectionKey ? collectionItems[cursor++] : item
        ));
        reflowCollection(next, component.section, collectionKey);
      }
    } else if (operation.type === "change-layout-variant") {
      const preset = (section.layoutPresets || []).find(
        (layout) => layout.layoutKey === operation.layoutVariant,
      );
      const resolved = resolveSectionLayoutPreset(
        operation.targetInstanceId,
        section.items,
        preset,
      );
      Object.keys(next.designSpec.itemStyles || {}).forEach((styleKey) => {
        if (styleKey.startsWith(`${operation.targetInstanceId}.`)) {
          const style = { ...(next.designSpec.itemStyles[styleKey] || {}) };
          ["positionMode", "xPct", "yPx", "widthPct", "heightPx", "zIndex"].forEach(
            (property) => delete style[property],
          );
          next.designSpec.itemStyles[styleKey] = style;
        }
      });
      Object.keys(next.designSpec.visibility?.items || {}).forEach((styleKey) => {
        if (styleKey.startsWith(`${operation.targetInstanceId}.`)) {
          delete next.designSpec.visibility.items[styleKey];
        }
      });
      next.designSpec.sectionStyles[operation.targetInstanceId] = {
        ...(next.designSpec.sectionStyles[operation.targetInstanceId] || {}),
        ...(resolved?.sectionStyle || { layoutVariant: operation.layoutVariant }),
      };
      Object.assign(next.designSpec.itemStyles, resolved?.itemStyles || {});
      Object.assign(next.designSpec.visibility.items, resolved?.visibilityItems || {});
      next.designSpec.responsiveLayouts ||= {};
      next.designSpec.responsiveLayouts.mobile ||= { itemStyles: {}, visibility: { items: {} } };
      next.designSpec.responsiveLayouts.mobile.itemStyles ||= {};
      next.designSpec.responsiveLayouts.mobile.visibility ||= { items: {} };
      next.designSpec.responsiveLayouts.mobile.visibility.items ||= {};
      Object.keys(next.designSpec.responsiveLayouts.mobile.itemStyles).forEach((styleKey) => {
        if (styleKey.startsWith(`${operation.targetInstanceId}.`)) {
          delete next.designSpec.responsiveLayouts.mobile.itemStyles[styleKey];
        }
      });
      Object.keys(next.designSpec.responsiveLayouts.mobile.visibility.items).forEach((styleKey) => {
        if (styleKey.startsWith(`${operation.targetInstanceId}.`)) {
          delete next.designSpec.responsiveLayouts.mobile.visibility.items[styleKey];
        }
      });
      Object.assign(
        next.designSpec.responsiveLayouts.mobile.itemStyles,
        resolved?.responsiveLayouts?.mobile?.itemStyles || {},
      );
      Object.assign(
        next.designSpec.responsiveLayouts.mobile.visibility.items,
        resolved?.responsiveLayouts?.mobile?.visibility?.items || {},
      );
      section.selectedLayoutKey = resolved?.layoutKey || operation.layoutVariant;
    } else if (operation.type === "change-token-binding") {
      next.designSpec.itemStyles[operation.targetInstanceId] = {
        ...(next.designSpec.itemStyles[operation.targetInstanceId] || {}),
        tokenBindings: {
          ...(next.designSpec.itemStyles[operation.targetInstanceId]?.tokenBindings || {}),
          primary: operation.tokenKey,
        },
      };
    } else if (operation.type === "change-motion-preset") {
      const targetMap = section ? next.motionSpec.sections : next.motionSpec.items;
      if (operation.motionPresetVersionId) {
        targetMap[operation.targetInstanceId] = {
          presetVersionId: operation.motionPresetVersionId,
          durationToken: "var(--app-transition-duration-normal)",
          easingToken: "var(--app-ease)",
          delayToken: "var(--app-transition-delay)",
        };
      } else {
        delete targetMap[operation.targetInstanceId];
      }
    } else if (operation.type === "request-asset-regeneration") {
      const request = {
        assetRequestId: randomUUID(),
        targetType: section ? "section-key-visual" : "component-field-image",
        pageSectionInstanceId: section
          ? operation.targetInstanceId
          : component.section.pageSectionInstanceId || component.section.sectionKey,
        ...(component ? {
          pageComponentInstanceId: operation.targetInstanceId,
          fieldKey: operation.fieldKey,
        } : {}),
        guidance: operation.valueText || "",
        status: "pending",
      };
      next.assets.requests = [
        ...(next.assets.requests || []).filter((item) => (
          item.targetType !== request.targetType
          || item.pageSectionInstanceId !== request.pageSectionInstanceId
          || item.pageComponentInstanceId !== request.pageComponentInstanceId
          || item.fieldKey !== request.fieldKey
        )),
        request,
      ];
    } else if (operation.type === "remove-asset") {
      if (section) {
        const sectionKey = section.pageSectionInstanceId || section.sectionKey;
        if (next.designSpec.sectionStyles?.[sectionKey]) {
          delete next.designSpec.sectionStyles[sectionKey].backgroundImage;
        }
        next.assets.requests = (next.assets.requests || []).filter((request) => !(
          request.targetType === "section-key-visual"
          && request.pageSectionInstanceId === sectionKey
        ));
      } else if (component) {
        const sectionKey = component.section.pageSectionInstanceId || component.section.sectionKey;
        const componentKey = component.item.id || component.item.itemKey;
        const current = next.content.sectionInputs?.[sectionKey]?.[componentKey];
        if (Array.isArray(component.item.fields) && component.item.fields.length > 1) {
          next.content.sectionInputs[sectionKey][componentKey] = {
            ...(current || {}),
            fields: {
              ...(current?.fields || {}),
              [operation.fieldKey]: { source: "url", value: "", description: "", alt: "" },
            },
          };
        } else {
          next.content.sectionInputs[sectionKey][componentKey] = {
            source: "url", value: "", description: "", alt: "",
          };
        }
        next.assets.requests = (next.assets.requests || []).filter((request) => !(
          request.targetType === "component-field-image"
          && request.pageSectionInstanceId === sectionKey
          && request.pageComponentInstanceId === componentKey
          && request.fieldKey === operation.fieldKey
        ));
      }
    }
  }
  if (operations.some((operation) => !["update-field", "set-visibility", "remove-asset", "request-asset-regeneration"].includes(operation.type))) {
    next.layoutRevision = Number(next.layoutRevision || 0) + 1;
  }
  return next;
}

module.exports = {
  collectTargets,
  compositionOperationSchema,
  validateCompositionOperations,
  applyCompositionOperations,
};
