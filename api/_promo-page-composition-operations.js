const { randomUUID } = require("node:crypto");
const { OPERATION_TYPES } = require("./_promo-page-composition-contract");

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

function compositionOperationSchema(snapshot, motionPresets = []) {
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
            "motionPresetVersionId", "reason",
          ],
          properties: {
            operationId: { type: "string", maxLength: 100 },
            type: { type: "string", enum: OPERATION_TYPES },
            targetInstanceId: { type: "string", enum: targetIds },
            fieldKey: { type: "string", enum: fieldKeys.length ? ["", ...fieldKeys] : [""] },
            valueText: { type: "string", maxLength: 3000 },
            visible: { type: "boolean" },
            position: { type: "integer", minimum: 0, maximum: 100 },
            layoutVariant: { type: "string", maxLength: 100 },
            tokenKey: { type: "string", enum: tokenKeys.length ? ["", ...tokenKeys] : [""] },
            motionPresetVersionId: { type: "string", enum: motionPresetVersionIds },
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

function validateCompositionOperations(result, snapshot, motionPresets = []) {
  const targets = collectTargets(snapshot);
  const motionIds = new Set(motionPresets.map((preset) => preset.presetVersionId));
  const tokenKeys = new Set(Object.keys(snapshot?.content?.formTemplate?.designTokens?.values || {}));
  const seen = new Set();
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
    if (!section && !component) {
      throw Object.assign(new Error("Operation target is not available"), { code: "INVALID_OPERATION_TARGET" });
    }
    if (type === "update-field") {
      const fieldTarget = targets.fields.get(`${targetInstanceId}.${candidate.fieldKey}`);
      if (!fieldTarget || fieldTarget.field.isLocked || fieldTarget.item.isLocked) {
        throw Object.assign(new Error("Field is unavailable or locked"), { code: "LOCKED_FIELD" });
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
      const allowed = section?.compositionPolicy?.allowedLayoutVariants || [];
      if (!section || (allowed.length && !allowed.includes(candidate.layoutVariant))) {
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
    } else if (operation.type === "move-component") {
      const list = component.section.items;
      const from = list.findIndex((item) => (item.id || item.itemKey) === operation.targetInstanceId);
      if (from >= 0) {
        const [moved] = list.splice(from, 1);
        list.splice(Math.min(operation.position, list.length), 0, moved);
      }
    } else if (operation.type === "change-layout-variant") {
      next.designSpec.sectionStyles[operation.targetInstanceId] = {
        ...(next.designSpec.sectionStyles[operation.targetInstanceId] || {}),
        layoutVariant: operation.layoutVariant,
      };
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
          durationToken: "var(--app-motion-duration, 360ms)",
          easingToken: "var(--app-motion-easing, ease-out)",
          delayToken: "0ms",
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
    }
  }
  return next;
}

module.exports = {
  collectTargets,
  compositionOperationSchema,
  validateCompositionOperations,
  applyCompositionOperations,
};
