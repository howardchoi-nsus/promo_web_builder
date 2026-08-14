const STYLE_SLOT_TARGET_PROPERTIES = Object.freeze([
  "colorToken",
  "backgroundColorToken",
  "borderRadiusToken",
  "boxShadowToken",
  "fontFamilyToken",
  "fontSizeToken",
  "fontWeightToken",
  "lineHeightToken",
  "letterSpacingToken",
  "maxWidthToken",
  "textStyleToken",
  "textGradientToken",
  "textBackgroundToken",
]);

const STYLE_SLOT_TARGET_PROPERTY_SET = new Set(STYLE_SLOT_TARGET_PROPERTIES);

function legacyTargetProperty(semanticRole, slotKey = "") {
  const role = String(semanticRole || "").trim().toLowerCase();
  const key = String(slotKey || "").trim().toLowerCase();
  if (role === "accent-color" && /color$/.test(key) && !/background/.test(key)) {
    return "colorToken";
  }
  return ({
    "surface-color": "backgroundColorToken",
    "background-color": "backgroundColorToken",
    "text-color": "colorToken",
    "muted-color": "colorToken",
    "accent-color": "backgroundColorToken",
    "on-accent-color": "colorToken",
    radius: "borderRadiusToken",
    shadow: "boxShadowToken",
    "font-family": "fontFamilyToken",
  })[role] || "";
}

function normalizeStyleSlot(slot = {}, { strictTargetProperty = false } = {}) {
  const source = slot && typeof slot === "object" && !Array.isArray(slot) ? slot : {};
  const slotKey = String(source.slotKey || "").trim();
  const semanticRole = String(source.semanticRole || "").trim().toLowerCase();
  const requestedTargetProperty = String(source.targetProperty || "").trim();
  if (requestedTargetProperty && !STYLE_SLOT_TARGET_PROPERTY_SET.has(requestedTargetProperty)) {
    const error = new Error(`Unsupported style slot targetProperty: ${requestedTargetProperty}`);
    error.statusCode = 400;
    error.code = "INVALID_STYLE_SLOT_TARGET_PROPERTY";
    throw error;
  }
  if (strictTargetProperty && !requestedTargetProperty) {
    const error = new Error(`Style slot ${slotKey || "(unknown)"} requires targetProperty`);
    error.statusCode = 400;
    error.code = "STYLE_SLOT_TARGET_PROPERTY_REQUIRED";
    throw error;
  }
  return {
    ...source,
    slotKey,
    semanticRole,
    ...(requestedTargetProperty ? { targetProperty: requestedTargetProperty } : {}),
    aiSelectable: source.aiSelectable !== false,
  };
}

function styleSlotTargetProperty(slot = {}) {
  const source = slot && typeof slot === "object" && !Array.isArray(slot) ? slot : {};
  const requested = String(source.targetProperty || "").trim();
  return STYLE_SLOT_TARGET_PROPERTY_SET.has(requested)
    ? requested
    : legacyTargetProperty(source.semanticRole, source.slotKey);
}

module.exports = {
  STYLE_SLOT_TARGET_PROPERTIES,
  STYLE_SLOT_TARGET_PROPERTY_SET,
  legacyTargetProperty,
  normalizeStyleSlot,
  styleSlotTargetProperty,
};
