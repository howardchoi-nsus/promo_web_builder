const { usageToken } = require("../shared/token-usage-policy.mjs");
const CARD_ROLE_PATTERN = /benefit|offer|reward|step|trust|proof|metric|feature|faq|card|content/i;
const CENTERED_ROLE_PATTERN = /hero|key-visual|offer|conversion|cta/i;

function clone(value) {
  return value == null ? value : JSON.parse(JSON.stringify(value));
}

function normalizedRole(section = {}) {
  return [section.sectionRole, section.sectionKey, section.name]
    .map((value) => String(value || "").trim())
    .filter(Boolean)
    .join(" ");
}

function isCollectionItem(item = {}) {
  return Boolean(item.collection?.enabled || item.collection?.collectionKey);
}

function referenceTerms(layoutSpec = {}) {
  return [
    layoutSpec.layoutFamily,
    ...(layoutSpec.primitives || []),
    layoutSpec.desktopStrategy,
    layoutSpec.mobileStrategy,
    layoutSpec.imageStrategy,
    layoutSpec.ctaStrategy,
    ...(layoutSpec.reusableConstraints || []),
  ].map((value) => String(value || "").toLowerCase()).join(" ");
}

function desktopColumns(role, items, layoutSpec = {}) {
  const count = Math.max(1, items.length);
  const reference = referenceTerms(layoutSpec);
  if (/header|navigation/i.test(role)) return Math.min(2, count);
  if (/hero|key-visual/i.test(role)) return 1;
  if (/four[- ]?column|4[- ]?column/.test(reference)) return Math.min(4, count);
  if (/three[- ]?column|3[- ]?column/.test(reference)) return Math.min(3, count);
  if (/split|two[- ]?column|2[- ]?column/.test(reference)) return Math.min(2, count);
  if (/metric/i.test(role)) return Math.min(4, count);
  if (items.some(isCollectionItem) || CARD_ROLE_PATTERN.test(role)) return Math.min(3, count);
  return 1;
}

function sectionMinimumHeight(role) {
  if (/header|navigation/i.test(role)) return 96;
  if (/hero|key-visual/i.test(role)) return 560;
  if (/terms|legal|footer/i.test(role)) return 220;
  return 320;
}

function itemContainsTitle(item = {}) {
  return [item, ...(item.fields || [])].some((field) => (
    /title|headline|heading/i.test(`${field?.textType || ""} ${field?.fieldKey || ""}`)
  ));
}

function isStandaloneCta(item = {}) {
  return item.fieldKind === "cta" && (!Array.isArray(item.fields) || item.fields.length <= 1);
}

function flowItemStyle({ item, currentStyle = {}, role, tokenBindings = {}, index = 0, centered = false }) {
  const style = clone(currentStyle) || {};
  ["xPct", "yPx", "yPct", "heightPx", "offsetX", "offsetY", "horizontalAnchor", "verticalAnchor"]
    .forEach((key) => delete style[key]);
  const centerContent = centered || CENTERED_ROLE_PATTERN.test(role);
  const card = CARD_ROLE_PATTERN.test(role) && !/hero|key-visual/i.test(role);
  return {
    ...style,
    positionMode: "flow",
    widthMode: isStandaloneCta(item) ? "fit-content" : "fill",
    heightMode: "auto",
    widthPct: 100,
    ...(centerContent ? { textAlign: "center", justifySelf: "center" } : {}),
    ...(/header|navigation/i.test(role) ? {
      justifySelf: index === 0 ? "start" : "end",
      alignSelf: "center",
    } : {}),
    ...(itemContainsTitle(item) && centerContent ? { maxWidthPct: 82 } : {}),
    ...(card ? {
      paddingPx: 24,
      backgroundColorToken: tokenBindings.surface,
      borderRadiusToken: tokenBindings.radius,
      boxShadowToken: tokenBindings.shadow,
    } : {}),
  };
}

function applyFlowLayoutRecipe({
  section,
  items = [],
  sectionStyle = {},
  desktopItemStyles = {},
  mobileItemStyles = {},
  tokenBindings = {},
  referenceLayoutSpec = {},
  usagePolicy = null, tokenValues = {},
} = {}) {
  const role = normalizedRole(section);
  const reference = referenceTerms(referenceLayoutSpec);
  const columns = desktopColumns(role, items, referenceLayoutSpec);
  const centered = CENTERED_ROLE_PATTERN.test(role) || /centered|center aligned/.test(reference);
  const spacious = /spacious|editorial|cinematic|luxury|premium/.test(reference);
  const compact = /compact|dense|utility/.test(reference);
  const sectionKey = String(section?.sectionKey || section?.id || "");
  const nextDesktop = { ...desktopItemStyles };
  const nextMobile = { ...mobileItemStyles };
  items.forEach((item, index) => {
    const key = `${sectionKey}.${item.id || item.itemKey}`;
    nextDesktop[key] = flowItemStyle({
      item,
      currentStyle: nextDesktop[key],
      role,
      tokenBindings,
      index,
      centered,
    });
    nextMobile[key] = flowItemStyle({
      item,
      currentStyle: { ...nextDesktop[key], ...(nextMobile[key] || {}) },
      role,
      tokenBindings,
      index,
      centered,
    });
  });
  const registeredPx = key => {
    const token = usageToken(usagePolicy,key,tokenValues);
    const value = tokenValues[token];
    return /^\d+(?:\.\d+)?px$/.test(value || '') ? Number.parseFloat(value) : undefined;
  };
  if (usagePolicy) for (const item of items) {
    const key = `${sectionKey}.${item.itemKey}`;
    for (const styles of [nextDesktop,nextMobile]) if (styles[key]) {
      delete styles[key].paddingPx;
      const padding = registeredPx('card.padding');
      if (padding !== undefined && CARD_ROLE_PATTERN.test(role)) styles[key].paddingPx = padding;
    }
  }
  return {
    recipe: {
      contractVersion: 1,
      recipeKey: /hero|key-visual/i.test(role)
        ? "cinematic-hero"
        : columns > 1 ? "responsive-card-grid" : "editorial-stack",
      source: "system-quality-recipe",
      referenceFamily: String(referenceLayoutSpec.layoutFamily || "").slice(0, 120),
      referenceDerived: Boolean(reference.trim()),
    },
    sectionStyle: {
      ...sectionStyle,
      layoutMode: "flow",
      layoutColumns: columns,
      mobileLayoutColumns: 1,
      layoutGapPx: compact ? 16 : spacious ? 32 : (/hero|key-visual/i.test(role) ? 20 : 24),
      mobileLayoutGapPx: 18,
      layoutPaddingBlockPx: compact ? 32 : spacious ? 72 : (/hero|key-visual/i.test(role) ? 72 : 48),
      mobileLayoutPaddingBlockPx: 32,
      ...(usagePolicy ? {
        layoutGapPx: registeredPx('layout.gap'), mobileLayoutGapPx: registeredPx('layout.gap'),
        layoutPaddingBlockPx: registeredPx('layout.padding'), mobileLayoutPaddingBlockPx: registeredPx('layout.padding'),
      } : {}),
      contentAlignment: centered ? "center" : "stretch",
      minHeight: Math.max(
        Number(sectionStyle?.minHeight || 0),
        sectionMinimumHeight(role),
      ),
    },
    desktopItemStyles: nextDesktop,
    mobileItemStyles: nextMobile,
  };
}

module.exports = {
  applyFlowLayoutRecipe,
  desktopColumns,
  normalizedRole,
};
