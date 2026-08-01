const crypto = require("node:crypto");

const LAYOUT_VARIANTS = Object.freeze(["split-left", "split-right", "centered-hero"]);
const SECTION_STYLE_KEYS = new Set([
  "minHeight",
  "backgroundImage",
  "backgroundSize",
  "backgroundFitMode",
  "backgroundAllowedFitModes",
  "backgroundPosition",
  "backgroundRepeat",
  "backgroundFadeMode",
  "backgroundFadeStrength",
  "backgroundFadeStops",
]);
const ITEM_STYLE_KEYS = new Set([
  "color", "fontSize", "fontWeight", "textAlign", "positionMode", "xPct", "yPx", "zIndex",
  "colorToken", "fontFamilyToken", "fontSizeToken", "fontWeightToken", "lineHeightToken",
  "letterSpacingToken", "textStyleToken", "textGradientToken", "textBackgroundToken", "listType", "listIndent",
  "widthPct", "heightPx", "aspectRatio", "aspectRatioLocked", "imageFit", "imagePosition",
  "shape", "borderRadiusToken", "decorative", "accessibleLabel",
]);

function stableValue(value) {
  if (Array.isArray(value)) return value.map(stableValue);
  if (!value || typeof value !== "object") return value;
  return Object.fromEntries(Object.keys(value).sort().map((key) => [key, stableValue(value[key])]));
}

function inputHash(value) {
  return crypto.createHash("sha256").update(JSON.stringify(stableValue(value))).digest("hex");
}

function normalizeBackgroundColor(value, fallback = "#f5f7fb") {
  const color = String(value || "").trim().toLowerCase();
  return /^#[0-9a-f]{6}$/.test(color) ? color : fallback;
}

function textContent(value) {
  if (value === null || value === undefined) return [];
  if (typeof value === "string" || typeof value === "number") return [String(value).trim()].filter(Boolean);
  if (Array.isArray(value)) return value.flatMap(textContent);
  if (typeof value === "object") return Object.values(value).flatMap(textContent);
  return [];
}

function hasAnalyzableContent(sectionInputs) {
  return textContent(sectionInputs).some((value) => value.length >= 2);
}

function defaultConstraints(section, layout = {}) {
  const visibleItems = (section.items || []).filter((item) => item.isVisibleInWizard !== false);
  const lockedItems = visibleItems.filter((item) => item.isLocked).map((item) => item.itemKey);
  const imageItemKeys = new Set(visibleItems
    .filter((item) => (
      (item.fieldKind === "image" && item.image?.allowedSources?.includes("ai"))
      || (item.fields || []).some((field) => field.fieldKind === "image" && field.image?.allowedSources?.includes("ai"))
    ))
    .map((item) => item.itemKey));
  const policy = section.aiDesign && typeof section.aiDesign === "object" ? section.aiDesign : {};
  const allowedLayoutVariants = [...new Set(
    (Array.isArray(policy.allowedLayoutVariants) ? policy.allowedLayoutVariants : LAYOUT_VARIANTS)
      .filter((item) => LAYOUT_VARIANTS.includes(item))
  )];
  const imageTargetItemKeys = [...new Set(
    (Array.isArray(policy.imageTargetItemKeys) ? policy.imageTargetItemKeys : [])
      .filter((item) => imageItemKeys.has(item))
  )];
  const useItemTarget = policy.imageTarget === "item";
  const allowSectionBackground = policy.allowSectionBackground !== false;
  const currentHeight = layout.sectionStyles?.[section.sectionKey]?.minHeight;
  return {
    enabled: policy.enabled !== false,
    allowedLayoutVariants,
    allowSectionBackground,
    imageTargetItemKeys,
    imageTarget: useItemTarget
      ? (imageTargetItemKeys.length
        ? { type: "item", sectionKey: section.sectionKey, itemKey: imageTargetItemKeys[0] }
        : null)
      : { type: "section-background", sectionKey: section.sectionKey },
    contentLocks: lockedItems,
    layoutLocks: currentHeight ? ["minHeight"] : [],
    imageAspectRatio: String(policy.imageAspectRatio || "16:9"),
  };
}

function resolveImageTarget(constraints, sectionKey, targetItemKey = "", targetType = "") {
  const requestedType = String(targetType || "").trim();
  const requestedItemKey = String(targetItemKey || "").trim();
  if (requestedType === "section-background") {
    if (constraints?.allowSectionBackground === false) return { ok: false, constraints };
    return {
      ok: true,
      constraints: {
        ...constraints,
        imageTarget: { type: "section-background", sectionKey },
      },
    };
  }
  if (requestedType && requestedType !== "item") return { ok: false, constraints };
  if (requestedItemKey) {
    if (!(constraints?.imageTargetItemKeys || []).includes(requestedItemKey)) {
      return { ok: false, constraints };
    }
    return {
      ok: true,
      constraints: {
        ...constraints,
        imageTarget: { type: "item", sectionKey, itemKey: requestedItemKey },
      },
    };
  }
  if (!constraints?.imageTarget) {
    return { ok: false, constraints };
  }
  return { ok: true, constraints };
}

function analyzableSectionContent(section, sectionInputs) {
  const result = {};
  (section.items || []).forEach((item) => {
    if (item.isVisibleInWizard === false) return;
    const value = sectionInputs?.[item.itemKey];
    if (Array.isArray(item.fields) && item.fields.length > 1) {
      const fieldValues = value?.fields || {};
      const collected = {};
      item.fields.forEach((field) => {
        if (field.fieldKind === "image") return;
        const fieldValue = fieldValues[field.fieldKey];
        if (field.fieldKind === "cta") {
          const label = String(fieldValue?.label || "").trim();
          if (label) collected[field.fieldKey] = { label };
        } else {
          const text = String(fieldValue || "").trim();
          if (text) collected[field.fieldKey] = text;
        }
      });
      if (Object.keys(collected).length) result[item.itemKey] = { fields: collected };
      return;
    }
    if (item.fieldKind === "image") return;
    if (item.fieldKind === "cta") {
      const label = String(value?.label || "").trim();
      if (label) result[item.itemKey] = { label };
      return;
    }
    if (item.fieldKind === "text") {
      const text = String(value || "").trim();
      if (text) result[item.itemKey] = text;
    }
  });
  return result;
}

function clamp(number, min, max) {
  return Math.min(max, Math.max(min, Number(number)));
}

function safeAreaForVariant(layoutVariant) {
  if (layoutVariant === "split-left") return "right-copy";
  if (layoutVariant === "split-right") return "left-copy";
  return "center-copy";
}

function layoutPatchFromResult(section, result, constraints) {
  const sectionKey = section.sectionKey;
  const allowedVariants = new Set(constraints.allowedLayoutVariants || []);
  if (!allowedVariants.has(result.layoutVariant)) {
    const error = new Error("AI returned a layout variant that is not allowed");
    error.code = "NO_ALLOWED_LAYOUT_VARIANT";
    throw error;
  }
  const sectionStyle = {};
  if (!(constraints.layoutLocks || []).includes("minHeight")) {
    sectionStyle.minHeight = Math.round(clamp(result.minHeight || 420, 240, 900));
  }
  const itemStyles = {};
  (section.items || []).forEach((item, index) => {
    const key = `${sectionKey}.${item.itemKey}`;
    if (item.fieldKind === "image") {
      itemStyles[key] = {
        positionMode: "flow",
        xPct: result.layoutVariant === "split-left" ? 0 : result.layoutVariant === "split-right" ? 58 : 10,
        yPx: 0,
        widthPct: 32,
        aspectRatio: String(item.image?.aspectRatio || constraints.imageAspectRatio || "1/1"),
        aspectRatioLocked: true,
        imageFit: "contain",
        imagePosition: "center center",
        shape: "square",
        decorative: false,
        accessibleLabel: item.name || "Promotion image",
      };
    } else if (item.fieldKind === "text" || item.fieldKind === "cta") {
      itemStyles[key] = {
        textAlign: result.layoutVariant === "centered-hero" ? "center" : "left",
        positionMode: "flow",
        xPct: result.layoutVariant === "split-left" ? 48 : result.layoutVariant === "split-right" ? 0 : 10,
        yPx: index * 12,
      };
    }
  });
  return {
    layoutVariant: result.layoutVariant,
    layoutPatch: {
      sectionStyles: { [sectionKey]: sectionStyle },
      itemStyles,
    },
    imageRequest: result.imagePrompt
      ? {
        target: constraints.imageTarget || (constraints.imageTargetItemKeys?.[0]
          ? { type: "item", sectionKey, itemKey: constraints.imageTargetItemKeys[0] }
          : { type: "section-background", sectionKey }),
        itemKey: constraints.imageTarget?.type === "item" ? constraints.imageTarget.itemKey : null,
        prompt: String(result.imagePrompt).trim(),
        aspectRatio: constraints.imageAspectRatio || "16:9",
        safeArea: safeAreaForVariant(result.layoutVariant),
      }
      : null,
    rationale: String(result.rationale || "").trim(),
  };
}

function validatePatch(section, generated, constraints) {
  const errors = [];
  const sectionKey = section.sectionKey;
  const itemKeys = new Set((section.items || []).map((item) => `${sectionKey}.${item.itemKey}`));
  const itemByKey = new Map((section.items || []).map((item) => [`${sectionKey}.${item.itemKey}`, item]));
  Object.entries(generated.layoutPatch?.sectionStyles || {}).forEach(([key, style]) => {
    if (key !== sectionKey) errors.push(`Unknown section: ${key}`);
    Object.keys(style || {}).forEach((property) => {
      if (!SECTION_STYLE_KEYS.has(property)) errors.push(`Unsupported section style: ${property}`);
      if ((constraints.layoutLocks || []).includes(property)) errors.push(`Locked layout property: ${property}`);
    });
    if (style?.backgroundSize !== undefined && !["contain", "cover", "100% auto"].includes(style.backgroundSize)) {
      errors.push(`Unsupported section background size: ${style.backgroundSize}`);
    }
    if (style?.backgroundFitMode !== undefined
      && !["contain", "cover", "width-fill"].includes(style.backgroundFitMode)) {
      errors.push(`Unsupported section background fit mode: ${style.backgroundFitMode}`);
    }
    if (style?.backgroundPosition !== undefined
      && !["left center", "center center", "right center"].includes(style.backgroundPosition)) {
      errors.push(`Unsupported section background position: ${style.backgroundPosition}`);
    }
    if (style?.backgroundFadeMode !== undefined
      && !["none", "left", "right", "both"].includes(style.backgroundFadeMode)) {
      errors.push(`Unsupported section fade mode: ${style.backgroundFadeMode}`);
    }
    if (style?.backgroundFadeStrength !== undefined
      && !["soft", "medium", "strong"].includes(style.backgroundFadeStrength)) {
      errors.push(`Unsupported section fade strength: ${style.backgroundFadeStrength}`);
    }
  });
  Object.entries(generated.layoutPatch?.itemStyles || {}).forEach(([key, style]) => {
    if (!itemKeys.has(key)) errors.push(`Unknown item: ${key}`);
    // Section-AI patches use the same free-resize limits as the editor and
    // persisted template layouts; badges and compact decorative images are valid.
    const minimumWidthPct = 0.01;
    const minimumHeightPx = 1;
    Object.keys(style || {}).forEach((property) => {
      if (!ITEM_STYLE_KEYS.has(property)) errors.push(`Unsupported item style: ${property}`);
    });
    if (style?.widthPct !== undefined
      && (!Number.isFinite(Number(style.widthPct)) || Number(style.widthPct) < minimumWidthPct || Number(style.widthPct) > 100)) {
      errors.push(`Unsupported image width: ${style.widthPct}`);
    }
    if (style?.heightPx !== undefined
      && (!Number.isFinite(Number(style.heightPx)) || Number(style.heightPx) < minimumHeightPx || Number(style.heightPx) > 900)) {
      errors.push(`Unsupported image height: ${style.heightPx}`);
    }
    if (style?.listIndent !== undefined
      && (!Number.isInteger(Number(style.listIndent)) || Number(style.listIndent) < 0 || Number(style.listIndent) > 6)) {
      errors.push(`Unsupported list indent: ${style.listIndent}`);
    }
    if (style?.imageFit !== undefined && !["contain", "cover"].includes(style.imageFit)) {
      errors.push(`Unsupported image fit: ${style.imageFit}`);
    }
    if (style?.shape !== undefined && !["square", "rounded", "circle"].includes(style.shape)) {
      errors.push(`Unsupported image shape: ${style.shape}`);
    }
    if (style?.imagePosition !== undefined && ![
      "left top", "center top", "right top", "left center", "center center", "right center",
      "left bottom", "center bottom", "right bottom",
    ].includes(style.imagePosition)) {
      errors.push(`Unsupported image position: ${style.imagePosition}`);
    }
    if (style?.aspectRatio !== undefined && !/^\d+(?:\.\d+)?\s*[:/]\s*\d+(?:\.\d+)?$/.test(String(style.aspectRatio))) {
      errors.push(`Unsupported image aspect ratio: ${style.aspectRatio}`);
    }
    if (style?.aspectRatioLocked !== undefined && typeof style.aspectRatioLocked !== "boolean") {
      errors.push(`Unsupported image aspect-ratio lock: ${style.aspectRatioLocked}`);
    }
    if (style?.decorative !== undefined && typeof style.decorative !== "boolean") {
      errors.push(`Unsupported image decorative state: ${style.decorative}`);
    }
    if (style?.accessibleLabel !== undefined && String(style.accessibleLabel).length > 240) {
      errors.push("Image accessibility label is too long");
    }
  });
  if (generated.imageRequest) {
    const target = generated.imageRequest.target || (generated.imageRequest.itemKey
      ? { type: "item", sectionKey, itemKey: generated.imageRequest.itemKey }
      : null);
    if (!target || !["item", "section-background"].includes(target.type)) {
      errors.push("Unsupported image target type");
    } else if (target.sectionKey !== sectionKey) {
      errors.push(`Unsupported image target section: ${target.sectionKey}`);
    } else if (target.type === "item" && !(constraints.imageTargetItemKeys || []).includes(target.itemKey)) {
      errors.push(`Unsupported image target: ${target.itemKey}`);
    } else if (target.type === "section-background" && constraints.allowSectionBackground === false) {
      errors.push("Section background is not the selected image target");
    }
  }
  return { ok: errors.length === 0, errors };
}

function validateDesignPlan(section, plan, constraints, tokenSet) {
  const errors = [];
  const itemByKey = new Map((section.items || []).map((item) => [item.itemKey, item]));
  const allowedRegions = new Set(["brand", "copy-primary", "copy-secondary", "center", "media-primary", "media-secondary", "trust"]);
  const tokenByKey = new Map((tokenSet?.values || []).map((token) => [token.tokenKey, token]));
  if (!(constraints.allowedLayoutVariants || []).includes(plan?.layoutVariant)) errors.push("Layout variant is not allowed");
  const seenItems = new Set();
  (plan?.itemPlacements || []).forEach((placement) => {
    const item = itemByKey.get(placement.itemKey);
    if (!item) errors.push(`Unknown component instance: ${placement.itemKey}`);
    if (seenItems.has(placement.itemKey)) errors.push(`Duplicate component placement: ${placement.itemKey}`);
    seenItems.add(placement.itemKey);
    if (!allowedRegions.has(placement.region)) errors.push(`Unsupported layout region: ${placement.region}`);
    const componentRegions = item?.capabilities?.layoutRegions;
    if (Array.isArray(componentRegions) && componentRegions.length && !componentRegions.includes(placement.region)) {
      errors.push(`Component ${placement.itemKey} does not allow region ${placement.region}`);
    }
  });
  (section.items || []).filter((item) => item.isVisibleInWizard !== false).forEach((item) => {
    if (!seenItems.has(item.itemKey)) errors.push(`Visible component is not placed: ${item.itemKey}`);
  });
  (plan?.slotSelections || []).forEach((selection) => {
    const item = itemByKey.get(selection.itemKey);
    const slot = (item?.styleSlots || []).find((candidate) => candidate.slotKey === selection.slotKey);
    const token = tokenByKey.get(selection.tokenKey);
    if (!slot || slot.aiSelectable !== true) errors.push(`Style slot is not AI-selectable: ${selection.itemKey}.${selection.slotKey}`);
    if (!token || token.aiSelectable !== true) errors.push(`Token is not AI-selectable: ${selection.tokenKey}`);
    if (slot && token && slot.semanticRole !== token.semanticRole) errors.push(`Token semantic role mismatch: ${selection.tokenKey}`);
  });
  (plan?.assetRequests || []).forEach((asset) => {
    if (asset.targetType === "item") {
      const item = itemByKey.get(asset.itemKey);
      if (!item || item.fieldKind !== "image" || item.capabilities?.aiImage !== true) errors.push(`Item image generation is not allowed: ${asset.itemKey}`);
      if (constraints.imageTarget?.type !== "item"
        || constraints.imageTarget.itemKey !== asset.itemKey
        || !(constraints.imageTargetItemKeys || []).includes(asset.itemKey)) {
        errors.push(`Item image target is outside the section policy: ${asset.itemKey}`);
      }
    } else if (asset.targetType !== "section-background") errors.push(`Unsupported asset target: ${asset.targetType}`);
    else if (constraints.allowSectionBackground === false) errors.push("Section background generation is outside the section policy");
  });
  return { ok: errors.length === 0, errors };
}

function layoutPatchFromDesignPlan(section, plan, tokenSet) {
  const sectionKey = section.sectionKey;
  const tokenByKey = new Map((tokenSet?.values || []).map((token) => [token.tokenKey, token]));
  const coordinates = {
    brand: { xPct: 4, yPx: 12 }, "copy-primary": { xPct: 5, yPx: 80 },
    "copy-secondary": { xPct: 52, yPx: 80 }, center: { xPct: 18, yPx: 80 },
    "media-primary": { xPct: 55, yPx: 36 }, "media-secondary": { xPct: 5, yPx: 260 },
    trust: { xPct: 5, yPx: 430 },
  };
  const itemStyles = {};
  (plan.itemPlacements || []).forEach((placement) => {
    const key = `${sectionKey}.${placement.itemKey}`;
    const item = (section.items || []).find((candidate) => candidate.itemKey === placement.itemKey);
    itemStyles[key] = {
      positionMode: "free", ...(coordinates[placement.region] || coordinates.center),
      textAlign: placement.region === "center" ? "center" : "left",
    };
    if (item?.fieldKind === "image") {
      Object.assign(itemStyles[key], {
        widthPct: 32,
        aspectRatio: String(item.image?.aspectRatio || "1/1"),
        aspectRatioLocked: true,
        imageFit: "contain",
        imagePosition: "center center",
        shape: "square",
        decorative: false,
        accessibleLabel: item.name || "Promotion image",
      });
      delete itemStyles[key].textAlign;
    }
  });
  (plan.slotSelections || []).forEach((selection) => {
    const token = tokenByKey.get(selection.tokenKey);
    const key = `${sectionKey}.${selection.itemKey}`;
    if (!token || !itemStyles[key]) return;
    if (["accent-color", "text-color", "muted-color"].includes(token.semanticRole)) itemStyles[key].color = token.value;
    if (token.semanticRole === "title-size") {
      const size = Number.parseFloat(token.value);
      if (Number.isFinite(size)) itemStyles[key].fontSize = clamp(size, 0, 80);
    }
  });
  return {
    layoutVariant: plan.layoutVariant,
    layoutPatch: { sectionStyles: { [sectionKey]: { minHeight: 520 } }, itemStyles },
    tokenBindings: (plan.slotSelections || []).map((selection) => ({ ...selection })),
    imageRequests: (plan.assetRequests || []).map((request) => ({
      target: { type: request.targetType, sectionKey, itemKey: request.itemKey || null },
      prompt: request.prompt,
      safeArea: request.safeArea,
      aspectRatio: request.targetType === "item"
        ? String((section.items || []).find((item) => item.itemKey === request.itemKey)?.image?.aspectRatio || "1:1")
        : "16:9",
    })),
    rationale: String(plan.rationale || ""),
  };
}

module.exports = {
  LAYOUT_VARIANTS,
  inputHash,
  normalizeBackgroundColor,
  textContent,
  hasAnalyzableContent,
  analyzableSectionContent,
  defaultConstraints,
  resolveImageTarget,
  safeAreaForVariant,
  layoutPatchFromResult,
  validatePatch,
  validateDesignPlan,
  layoutPatchFromDesignPlan,
};
