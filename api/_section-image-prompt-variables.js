const DEFAULT_BACKGROUND_COLOR = "#000000";

function promptVariable(value) {
  if (value === null || value === undefined) return "";
  return typeof value === "string" ? value : JSON.stringify(value);
}

function normalizedHexColor(value) {
  const color = String(value || "").trim();
  return /^#[0-9a-f]{6}$/i.test(color) ? color : "";
}

function brandPaletteFromTokenValues(tokenValues = {}, theme = {}) {
  const values = Array.isArray(tokenValues)
    ? Object.fromEntries(tokenValues.map((token) => [
      String(token?.tokenKey || ""),
      token?.value || token?.tokenValue || "",
    ]).filter(([key]) => key))
    : tokenValues && typeof tokenValues === "object"
      ? tokenValues
      : {};
  const candidates = [
    ["Background", values["--app-bg"] || theme.backgroundColor],
    ["Surface", values["--app-surface"]],
    ["Text", values["--app-ink"] || values["--app-text"] || theme.textColor],
    ["Accent", values["--app-accent"] || theme.accentColor],
    ["CTA", values["--app-cta-background"] || theme.ctaColor],
  ];
  return candidates
    .map(([label, value]) => [label, normalizedHexColor(value)])
    .filter(([, value]) => value)
    .map(([label, value]) => `${label} ${value}`)
    .join("\n");
}

function buildSectionImagePromptVariables({
  promptType,
  section = {},
  component = null,
  field = null,
  sectionContent = {},
  designSpec = {},
  designTokenValues = {},
  request = {},
  backgroundColor = "",
  fadeMode = "",
  aspectRatio = "",
  brandPalette = "",
} = {}) {
  const isComponent = promptType === "component_image";
  const sectionName = section.name || section.sourceSectionKey || section.sectionKey || "Promotion section";
  const adminGuidance = isComponent
    ? [field?.image?.promptText, request.guidance].filter(Boolean).join("\n")
    : [section.aiDesign?.backgroundPromptText, request.guidance].filter(Boolean).join("\n");
  if (isComponent) {
    return {
      sectionName,
      componentName: component?.name || component?.sourceItemKey || component?.itemKey || "Visual",
      fieldName: field?.name || field?.fieldKey || "Visual",
      contentJson: JSON.stringify(sectionContent || {}),
      adminGuidance,
    };
  }
  const theme = designSpec?.theme || {};
  return {
    sectionName,
    contentJson: JSON.stringify(sectionContent || {}),
    backgroundColor: normalizedHexColor(backgroundColor)
      || normalizedHexColor(designSpec?.sectionStyles?.[section.sectionKey]?.backgroundColor)
      || normalizedHexColor(theme.backgroundColor)
      || DEFAULT_BACKGROUND_COLOR,
    fadeMode: String(fadeMode || "none"),
    adminGuidance,
    brandPalette: promptVariable(
      brandPalette || brandPaletteFromTokenValues(designTokenValues, theme),
    ),
    aspectRatio: String(aspectRatio || section.aiDesign?.imageAspectRatio || "16:9"),
  };
}

module.exports = {
  DEFAULT_BACKGROUND_COLOR,
  promptVariable,
  brandPaletteFromTokenValues,
  buildSectionImagePromptVariables,
};
