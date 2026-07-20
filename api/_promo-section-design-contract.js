const crypto = require("node:crypto");

const LAYOUT_VARIANTS = Object.freeze(["split-left", "split-right", "centered-hero"]);
const SECTION_STYLE_KEYS = new Set([
  "minHeight",
  "backgroundImage",
  "backgroundSize",
  "backgroundPosition",
  "backgroundRepeat",
]);
const ITEM_STYLE_KEYS = new Set(["fontSize", "fontWeight", "textAlign", "positionMode", "xPct", "yPx"]);

function stableValue(value) {
  if (Array.isArray(value)) return value.map(stableValue);
  if (!value || typeof value !== "object") return value;
  return Object.fromEntries(Object.keys(value).sort().map((key) => [key, stableValue(value[key])]));
}

function inputHash(value) {
  return crypto.createHash("sha256").update(JSON.stringify(stableValue(value))).digest("hex");
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
  const imageItem = visibleItems.find((item) => item.fieldKind === "image" && !item.isLocked);
  const lockedItems = visibleItems.filter((item) => item.isLocked).map((item) => item.itemKey);
  const currentHeight = layout.sectionStyles?.[section.sectionKey]?.minHeight;
  return {
    allowedLayoutVariants: [...LAYOUT_VARIANTS],
    imageTargetItemKeys: imageItem ? [imageItem.itemKey] : [],
    imageTarget: imageItem
      ? { type: "item", sectionKey: section.sectionKey, itemKey: imageItem.itemKey }
      : { type: "section-background", sectionKey: section.sectionKey },
    contentLocks: lockedItems,
    layoutLocks: currentHeight ? ["minHeight"] : [],
    imageAspectRatio: "16:9",
  };
}

function analyzableSectionContent(section, sectionInputs) {
  const result = {};
  (section.items || []).forEach((item) => {
    if (item.isVisibleInWizard === false || item.fieldKind === "image") return;
    const value = sectionInputs?.[item.itemKey];
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
        itemKey: constraints.imageTargetItemKeys?.[0] || null,
        prompt: String(result.imagePrompt).trim(),
        aspectRatio: constraints.imageAspectRatio || "16:9",
        safeArea: result.layoutVariant === "split-left" ? "right-copy" : "left-copy",
      }
      : null,
    rationale: String(result.rationale || "").trim(),
  };
}

function validatePatch(section, generated, constraints) {
  const errors = [];
  const sectionKey = section.sectionKey;
  const itemKeys = new Set((section.items || []).map((item) => `${sectionKey}.${item.itemKey}`));
  Object.entries(generated.layoutPatch?.sectionStyles || {}).forEach(([key, style]) => {
    if (key !== sectionKey) errors.push(`Unknown section: ${key}`);
    Object.keys(style || {}).forEach((property) => {
      if (!SECTION_STYLE_KEYS.has(property)) errors.push(`Unsupported section style: ${property}`);
      if ((constraints.layoutLocks || []).includes(property)) errors.push(`Locked layout property: ${property}`);
    });
  });
  Object.entries(generated.layoutPatch?.itemStyles || {}).forEach(([key, style]) => {
    if (!itemKeys.has(key)) errors.push(`Unknown item: ${key}`);
    Object.keys(style || {}).forEach((property) => {
      if (!ITEM_STYLE_KEYS.has(property)) errors.push(`Unsupported item style: ${property}`);
    });
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
    } else if (target.type === "section-background" && (constraints.imageTargetItemKeys || []).length) {
      errors.push("Section background is not the selected image target");
    }
  }
  return { ok: errors.length === 0, errors };
}

module.exports = {
  LAYOUT_VARIANTS,
  inputHash,
  textContent,
  hasAnalyzableContent,
  analyzableSectionContent,
  defaultConstraints,
  layoutPatchFromResult,
  validatePatch,
};
