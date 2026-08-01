export const DESIGN_CANVAS_WIDTH = 1280;
export const DEFAULT_COMPONENT_WIDTH_PCT = 32;
export const DEFAULT_TEXT_COMPONENT_HEIGHT = 86;
export const DEFAULT_CTA_COMPONENT_HEIGHT = 64;
export const DEFAULT_IMAGE_COMPONENT_HEIGHT = 250;
export const DEFAULT_FONT_SIZE = 18;
export const MINIMUM_COMPONENT_WIDTH_PCT = 4;
export const MINIMUM_COMPONENT_HEIGHT_PX = 24;
export const MAXIMUM_COMPONENT_HEIGHT_PX = 900;
export const MAXIMUM_SECTION_HEIGHT_PX = 1200;

export function clampNumber(value, min, max, fallback) {
  const number = Number(value);
  return Number.isFinite(number) ? Math.min(max, Math.max(min, number)) : fallback;
}

export function roundedGeometryValue(value) {
  return Math.round(Number(value) * 100) / 100;
}

export function resolveSectionHeight(configuredHeight, automaticHeight) {
  const configured = Number(configuredHeight);
  if (Number.isFinite(configured) && configured > 0) {
    return clampNumber(configured, 50, MAXIMUM_SECTION_HEIGHT_PX, 50);
  }
  return clampNumber(automaticHeight, 50, MAXIMUM_SECTION_HEIGHT_PX, 50);
}

export function defaultComponentHeight(item = {}) {
  const fields = Array.isArray(item.fields) ? item.fields : [];
  if (fields.length > 1) {
    return fields.reduce((height, field) => height + defaultComponentHeight(field), 24);
  }
  if (item.fieldKind === "image") return DEFAULT_IMAGE_COMPONENT_HEIGHT;
  if (item.fieldKind === "cta") return DEFAULT_CTA_COMPONENT_HEIGHT;
  return DEFAULT_TEXT_COMPONENT_HEIGHT;
}

export function usesAutomaticComponentHeight(item = {}, style = {}) {
  if (item.fieldKind === "image") return false;
  if (style.heightMode === "auto") return true;
  return item.fieldKind === "text" && style.heightMode !== "fixed";
}

export function normalizeComponentGeometry({
  item = {},
  style = {},
  canvasWidth,
  fallbackX = 0,
  fallbackY = 0,
} = {}) {
  const resolvedCanvasWidth = Math.max(1, Number(canvasWidth) || DESIGN_CANVAS_WIDTH);
  const widthPct = clampNumber(
    style.widthPct,
    MINIMUM_COMPONENT_WIDTH_PCT,
    100,
    DEFAULT_COMPONENT_WIDTH_PCT,
  );
  const height = clampNumber(
    style.heightPx,
    MINIMUM_COMPONENT_HEIGHT_PX,
    MAXIMUM_COMPONENT_HEIGHT_PX,
    defaultComponentHeight(item),
  );
  return {
    x: (clampNumber(style.xPct, 0, 100, fallbackX) / 100) * resolvedCanvasWidth,
    y: clampNumber(style.yPx, 0, 1200, fallbackY),
    width: (widthPct / 100) * resolvedCanvasWidth,
    height,
    widthPct,
    fontSize: clampNumber(style.fontSize, 0, 80, DEFAULT_FONT_SIZE),
  };
}

export function geometryToLayoutStyle(geometry, canvasWidth, {
  includeHeight = true,
  includeFontSize = true,
} = {}) {
  const resolvedCanvasWidth = Math.max(1, Number(canvasWidth) || DESIGN_CANVAS_WIDTH);
  return {
    positionMode: "free",
    xPct: roundedGeometryValue((geometry.x / resolvedCanvasWidth) * 100),
    yPx: roundedGeometryValue(geometry.y),
    widthPct: roundedGeometryValue((geometry.width / resolvedCanvasWidth) * 100),
    ...(includeHeight ? { heightPx: roundedGeometryValue(geometry.height) } : {}),
    ...(includeFontSize ? { fontSize: roundedGeometryValue(geometry.fontSize) } : {}),
  };
}
