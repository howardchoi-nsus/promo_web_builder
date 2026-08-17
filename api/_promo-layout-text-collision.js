const DEFAULT_TEXT_GAP_PX = 20;
const COMPOSITE_FIELD_GAP_PX = 14;
const MAXIMUM_SECTION_HEIGHT_PX = 24000;

function clone(value) {
  return value == null ? value : JSON.parse(JSON.stringify(value));
}

function componentValues(item, value) {
  const fields = Array.isArray(item?.fields) && item.fields.length ? item.fields : [item];
  if (fields.length === 1) {
    const field = fields[0];
    const source = value?.fields && field.fieldKey ? value.fields[field.fieldKey] : value;
    return [{ field, value: source }];
  }
  return fields.map((field) => ({ field, value: value?.fields?.[field.fieldKey] }));
}

function stringLines(value, fallback) {
  const source = value === null || value === undefined || value === "" ? fallback : value;
  if (Array.isArray(source)) return source.flatMap((entry) => stringLines(entry, ""));
  if (source && typeof source === "object") return Object.values(source).flatMap((entry) => stringLines(entry, ""));
  return String(source ?? "").split(/\r?\n/);
}

function tokenPixels(value) {
  const matches = String(value || "").match(/-?\d+(?:\.\d+)?px/gi) || [];
  const values = matches.map((entry) => Number.parseFloat(entry)).filter((entry) => Number.isFinite(entry) && entry > 0);
  return values.length ? Math.max(...values) : undefined;
}

function isTitle(item = {}) {
  return item.textType === "title" || item.textType === "headline"
    || /(?:title|headline|heading)/i.test(String(item.itemKey || item.fieldKey || item.name || ""));
}

function fontSizeFor(item, style, tokenValues, mobile) {
  const configured = Number(style?.fontSize);
  if (Number.isFinite(configured) && configured > 0) return configured;
  const tokenSize = tokenPixels(tokenValues?.[style?.fontSizeToken]);
  if (tokenSize) return tokenSize;
  return isTitle(item) ? (mobile ? 40 : 64) : (mobile ? 18 : 22);
}

function lineHeightFor(style = {}) {
  const configured = Number(style.lineHeight);
  return Number.isFinite(configured) && configured >= 0.8 && configured <= 3 ? configured : 1.45;
}

function aspectRatioValue(value, fallback = 1) {
  if (Number.isFinite(Number(value)) && Number(value) > 0) return Number(value);
  const match = String(value || "").match(/^\s*(\d+(?:\.\d+)?)\s*[/:]\s*(\d+(?:\.\d+)?)\s*$/u);
  if (!match || Number(match[2]) <= 0) return fallback;
  return Number(match[1]) / Number(match[2]);
}

function estimatedLineCount(lines, widthPx, fontSize) {
  return lines.reduce((count, line) => {
    const estimatedWidth = Array.from(String(line)).reduce((width, character) => {
      if (/\s/u.test(character)) return width + (fontSize * 0.35);
      return width + (fontSize * (/^[\x00-\x7f]$/u.test(character) ? 0.62 : 1));
    }, 0);
    return count + Math.max(1, Math.ceil(estimatedWidth / Math.max(1, widthPx)));
  }, 0);
}

function estimatedItemHeight({ sectionKey, item, value, style, allStyles, tokenValues, viewportWidth, mobile }) {
  const widthPct = Math.min(100, Math.max(0.01, Number(style.widthPct) || (isTitle(item) ? 72 : 60)));
  const widthPx = (widthPct / 100) * viewportWidth;
  const values = componentValues(item, value);
  if (!values.length) return 0;
  const contentHeight = values.reduce((height, entry) => {
    const scopedFieldStyle = allStyles[`${sectionKey}.${item.itemKey}.${entry.field.fieldKey}`] || {};
    const fieldStyle = {
      ...style,
      ...scopedFieldStyle,
    };
    if (entry.field.fieldKind === "image") {
      const fieldWidthPct = Math.min(100, Math.max(0.01, Number(scopedFieldStyle.widthPct) || 100));
      const imageWidth = widthPx * (fieldWidthPct / 100);
      const ratio = aspectRatioValue(fieldStyle.aspectRatio || entry.field.image?.aspectRatio, 1);
      return height + Math.ceil(imageWidth / ratio);
    }
    if (entry.field.fieldKind === "cta") {
      const buttonHeight = tokenPixels(
        tokenValues?.[fieldStyle.heightToken]
        || tokenValues?.["--promo-button-height"]
        || tokenValues?.["--app-button-height"],
      ) || 44;
      return height + Math.max(44, Math.ceil(buttonHeight));
    }
    if (entry.field.fieldKind !== "text") return height;
    const fontSize = fontSizeFor(entry.field, fieldStyle, tokenValues, mobile);
    const lines = stringLines(entry.value, entry.field.name || entry.field.fieldKey || item.name || item.itemKey);
    return height + Math.ceil(
      estimatedLineCount(lines, widthPx, fontSize) * fontSize * lineHeightFor(fieldStyle),
    );
  }, 0);
  return Math.max(32, contentHeight + Math.max(0, values.length - 1) * COMPOSITE_FIELD_GAP_PX);
}

function adjustViewport({
  section,
  sectionInputs,
  baseStyles,
  viewportStyles,
  visibility,
  tokenValues,
  viewportWidth,
  mobile,
  gapPx,
}) {
  const sectionKey = section.sectionKey;
  const effectiveStyles = Object.fromEntries(Object.keys(baseStyles).map((key) => [key, {
    ...(baseStyles[key] || {}),
    ...(viewportStyles[key] || {}),
  }]));
  Object.entries(viewportStyles).forEach(([key, style]) => {
    if (!effectiveStyles[key]) effectiveStyles[key] = clone(style);
  });
  const candidates = (section.items || []).flatMap((item, order) => {
    const key = `${sectionKey}.${item.itemKey}`;
    const style = effectiveStyles[key];
    const composite = Array.isArray(item.fields) && item.fields.length > 1;
    if ((item.fieldKind !== "text" && !composite) || !style || style.positionMode !== "free"
      || style.heightMode === "fixed" || visibility?.[key] === false) return [];
    const widthPct = Math.min(100, Math.max(0.01, Number(style.widthPct) || (isTitle(item) ? 72 : 60)));
    const requestedLeft = Number(style.xPct) || 0;
    const height = estimatedItemHeight({
      sectionKey,
      item,
      value: sectionInputs?.[sectionKey]?.[item.itemKey],
      style,
      allStyles: effectiveStyles,
      tokenValues,
      viewportWidth,
      mobile,
    });
    if (!height) return [];
    return [{
      key,
      item,
      order,
      style,
      requestedTop: Math.max(0, Number(style.yPx) || 0),
      left: Math.min(Math.max(0, 100 - widthPct), Math.max(0, requestedLeft)),
      widthPct,
      height,
    }];
  }).sort((left, right) => left.requestedTop - right.requestedTop || left.order - right.order);

  const patches = {};
  const placed = [];
  const diagnostics = [];
  candidates.forEach((candidate) => {
    let top = candidate.requestedTop;
    for (let attempt = 0; attempt <= placed.length; attempt += 1) {
      const overlaps = placed.filter((previous) => {
        const horizontal = candidate.left < previous.left + previous.widthPct
          && candidate.left + candidate.widthPct > previous.left;
        const vertical = top < previous.top + previous.height && top + candidate.height > previous.top;
        return horizontal && vertical;
      });
      if (!overlaps.length) break;
      top = Math.max(...overlaps.map((previous) => previous.top + previous.height)) + gapPx;
    }
    patches[candidate.key] = {
      ...(viewportStyles[candidate.key] || {}),
      heightMode: "auto",
      yPx: Math.round(top),
    };
    delete patches[candidate.key].heightPx;
    if (Math.abs(top - candidate.requestedTop) >= 0.5) {
      diagnostics.push({
        code: "TEXT_LAYOUT_OVERLAP_ADJUSTED",
        level: "warning",
        path: `${mobile ? "responsiveLayouts.mobile." : ""}itemStyles.${candidate.key}.yPx`,
        message: `${candidate.item.name || candidate.item.itemKey} text position was adjusted to avoid overlap.`,
        fromY: candidate.requestedTop,
        toY: Math.round(top),
      });
    }
    placed.push({ ...candidate, top });
  });
  return {
    patches,
    diagnostics,
    bottom: placed.reduce((bottom, entry) => Math.max(bottom, entry.top + entry.height), 0),
  };
}

function avoidTextComponentOverlaps({
  sections = [],
  sectionInputs = {},
  itemStyles = {},
  mobileItemStyles = {},
  sectionStyles = {},
  itemVisibility = {},
  mobileItemVisibility = {},
  tokenValues = {},
  desktopWidth = 1280,
  mobileWidth = 720,
  gapPx = DEFAULT_TEXT_GAP_PX,
} = {}) {
  const nextItemStyles = clone(itemStyles) || {};
  const nextMobileItemStyles = clone(mobileItemStyles) || {};
  const nextSectionStyles = clone(sectionStyles) || {};
  const diagnostics = [];
  sections.forEach((section) => {
    const desktop = adjustViewport({
      section, sectionInputs, baseStyles: nextItemStyles, viewportStyles: nextItemStyles,
      visibility: itemVisibility, tokenValues, viewportWidth: desktopWidth, mobile: false, gapPx,
    });
    Object.assign(nextItemStyles, desktop.patches);
    const mobile = adjustViewport({
      section, sectionInputs, baseStyles: nextItemStyles, viewportStyles: nextMobileItemStyles,
      visibility: { ...itemVisibility, ...mobileItemVisibility }, tokenValues,
      viewportWidth: mobileWidth, mobile: true, gapPx,
    });
    Object.assign(nextMobileItemStyles, mobile.patches);
    const contentBottom = Math.max(desktop.bottom, mobile.bottom);
    const requiredHeight = contentBottom > 0
      ? Math.min(MAXIMUM_SECTION_HEIGHT_PX, Math.max(50, Math.ceil(contentBottom + 40)))
      : 0;
    if (requiredHeight > Number(nextSectionStyles[section.sectionKey]?.minHeight || 0)) {
      nextSectionStyles[section.sectionKey] = {
        ...(nextSectionStyles[section.sectionKey] || {}),
        minHeight: requiredHeight,
      };
    }
    diagnostics.push(...desktop.diagnostics, ...mobile.diagnostics);
  });
  return {
    itemStyles: nextItemStyles,
    mobileItemStyles: nextMobileItemStyles,
    sectionStyles: nextSectionStyles,
    diagnostics,
  };
}

module.exports = {
  avoidTextComponentOverlaps,
  estimatedItemHeight,
};
