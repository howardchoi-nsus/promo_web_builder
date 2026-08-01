import { DEFAULT_DESIGN_SPEC } from "./contracts.js";

function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

function mergeRecord(base = {}, override = {}) {
  const result = { ...base };
  Object.entries(override || {}).forEach(([key, value]) => {
    if (value === undefined) return;
    if (value && typeof value === "object" && !Array.isArray(value)
      && result[key] && typeof result[key] === "object" && !Array.isArray(result[key])) {
      result[key] = mergeRecord(result[key], value);
    } else {
      result[key] = clone(value);
    }
  });
  return result;
}

export function normalizeLayoutSpec(value = {}) {
  return mergeLayoutSpec(DEFAULT_DESIGN_SPEC, value);
}

export function mergeLayoutSpec(base = DEFAULT_DESIGN_SPEC, override = {}) {
  const merged = mergeRecord(clone(base || DEFAULT_DESIGN_SPEC), override || {});
  merged.contractVersion = Number(merged.contractVersion || 1);
  merged.specKey = String(merged.specKey || "default");
  merged.theme = merged.theme || {};
  delete merged.theme.backgroundImage;
  delete merged.theme.backgroundImageName;
  merged.responsive = merged.responsive || {};
  merged.itemStyles = merged.itemStyles || {};
  merged.sectionStyles = merged.sectionStyles || {};
  merged.visibility = {
    items: merged.visibility?.items || {},
    fields: merged.visibility?.fields || {},
  };
  merged.responsiveLayouts = merged.responsiveLayouts
    && typeof merged.responsiveLayouts === "object"
    && !Array.isArray(merged.responsiveLayouts)
    ? merged.responsiveLayouts
    : {};
  return merged;
}

export function validateLayoutSpec(value = {}) {
  const spec = normalizeLayoutSpec(value);
  const errors = [];
  if (value?.responsiveLayouts !== undefined
    && (!value.responsiveLayouts
      || typeof value.responsiveLayouts !== "object"
      || Array.isArray(value.responsiveLayouts))) {
    errors.push({ path: "responsiveLayouts", message: "Responsive layouts must be an object." });
  }
  const allowedBackgroundSizes = new Set(["contain", "cover", "100% auto"]);
  const allowedBackgroundFitModes = new Set(["contain", "cover", "width-fill"]);
  const allowedBackgroundPositions = new Set(["left center", "center center", "right center"]);
  const allowedFadeModes = new Set(["none", "left", "right", "both"]);
  const allowedFadeStrengths = new Set(["soft", "medium", "strong"]);
  const allowedImageFits = new Set(["contain", "cover"]);
  const allowedImagePositions = new Set([
    "left top", "center top", "right top",
    "left center", "center center", "right center",
    "left bottom", "center bottom", "right bottom",
  ]);
  const allowedShapes = new Set(["square", "rounded", "circle"]);
  const allowedPositionModes = new Set(["free", "anchored"]);
  const allowedHorizontalAnchors = new Set(["left", "center", "right"]);
  const allowedVerticalAnchors = new Set(["top", "middle", "bottom"]);
  const allowedWidthModes = new Set(["fit-content", "fixed", "fill"]);
  const allowedHeightModes = new Set(["auto", "fixed"]);
  const allowedTextAlignments = new Set(["left", "center", "right"]);
  const managedTokenProperties = [
    "colorToken", "fontFamilyToken", "fontSizeToken", "fontWeightToken",
    "lineHeightToken", "letterSpacingToken", "maxWidthToken", "textStyleToken",
    "textGradientToken", "textBackgroundToken",
  ];
  const allowedLineStyleProperties = new Set([
    "color", "colorToken", "fontFamily", "fontFamilyToken", "fontSize", "fontSizeToken",
    "fontWeight", "fontWeightToken", "fontStyle", "textDecoration", "textStyleToken",
    "textGradientToken", "textBackground", "textBackgroundToken", "lineHeight",
    "lineHeightToken", "letterSpacing", "letterSpacingToken", "listType", "listIndent",
  ]);
  function validateLineStyles(lineStyles, path) {
    if (lineStyles === undefined) return;
    if (!lineStyles || typeof lineStyles !== "object" || Array.isArray(lineStyles)) {
      errors.push({ path, message: "Line styles must be an object." });
      return;
    }
    Object.entries(lineStyles).forEach(([scopeKey, scope]) => {
      if (!scope || typeof scope !== "object" || Array.isArray(scope)) {
        errors.push({ path: `${path}.${scopeKey}`, message: "Line style scope must be an object." });
        return;
      }
      Object.entries(scope).forEach(([lineIndex, lineStyle]) => {
        const linePath = `${path}.${scopeKey}.${lineIndex}`;
        if (!/^\d+$/u.test(lineIndex) || Number(lineIndex) > 999) {
          errors.push({ path: linePath, message: "Line index must be between 0 and 999." });
        }
        if (!lineStyle || typeof lineStyle !== "object" || Array.isArray(lineStyle)) {
          errors.push({ path: linePath, message: "Line style must be an object." });
          return;
        }
        Object.keys(lineStyle).forEach((property) => {
          if (!allowedLineStyleProperties.has(property)) {
            errors.push({ path: `${linePath}.${property}`, message: "Unsupported line style property." });
          }
        });
        managedTokenProperties.forEach((property) => {
          if (lineStyle[property] !== undefined && lineStyle[property] !== null
            && !/^--(?:promo|app)-[a-z0-9-]+$/.test(String(lineStyle[property]))) {
            errors.push({ path: `${linePath}.${property}`, message: "Managed design token key is required." });
          }
        });
        if (lineStyle.listType !== undefined && lineStyle.listType !== null
          && !["bullet", "number"].includes(lineStyle.listType)) {
          errors.push({ path: `${linePath}.listType`, message: "Unsupported text list type." });
        }
        const indent = Number(lineStyle.listIndent);
        if (lineStyle.listIndent !== undefined
          && (!Number.isInteger(indent) || indent < 0 || indent > 6)) {
          errors.push({ path: `${linePath}.listIndent`, message: "List indent must be an integer between 0 and 6." });
        }
      });
    });
  }
  function validateTextLayoutStyle(style, path) {
    for (const tokenProperty of managedTokenProperties) {
      if (style?.[tokenProperty] !== undefined
        && !/^--(?:promo|app)-[a-z0-9-]+$/.test(String(style[tokenProperty]))) {
        errors.push({ path: `${path}.${tokenProperty}`, message: "Managed design token key is required." });
      }
    }
    if (style?.positionMode !== undefined && !allowedPositionModes.has(style.positionMode)) {
      errors.push({ path: `${path}.positionMode`, message: "Unsupported component position mode." });
    }
    if (style?.horizontalAnchor !== undefined && !allowedHorizontalAnchors.has(style.horizontalAnchor)) {
      errors.push({ path: `${path}.horizontalAnchor`, message: "Unsupported horizontal anchor." });
    }
    if (style?.verticalAnchor !== undefined && !allowedVerticalAnchors.has(style.verticalAnchor)) {
      errors.push({ path: `${path}.verticalAnchor`, message: "Unsupported vertical anchor." });
    }
    if (style?.widthMode !== undefined && !allowedWidthModes.has(style.widthMode)) {
      errors.push({ path: `${path}.widthMode`, message: "Unsupported component width mode." });
    }
    if (style?.heightMode !== undefined && !allowedHeightModes.has(style.heightMode)) {
      errors.push({ path: `${path}.heightMode`, message: "Unsupported component height mode." });
    }
    if (style?.textAlign !== undefined && !allowedTextAlignments.has(style.textAlign)) {
      errors.push({ path: `${path}.textAlign`, message: "Unsupported text alignment." });
    }
    if (style?.fontStyle !== undefined && style.fontStyle !== "italic") {
      errors.push({ path: `${path}.fontStyle`, message: "Unsupported font style." });
    }
    if (style?.textDecoration !== undefined && style.textDecoration !== "underline") {
      errors.push({ path: `${path}.textDecoration`, message: "Unsupported text decoration." });
    }
    if (style?.listType !== undefined && !["bullet", "number"].includes(style.listType)) {
      errors.push({ path: `${path}.listType`, message: "Unsupported text list type." });
    }
    const listIndent = Number(style?.listIndent);
    if (style?.listIndent !== undefined
      && (!Number.isInteger(listIndent) || listIndent < 0 || listIndent > 6)) {
      errors.push({ path: `${path}.listIndent`, message: "List indent must be an integer between 0 and 6." });
    }
    validateLineStyles(style?.lineStyles, `${path}.lineStyles`);
    for (const offsetProperty of ["offsetX", "offsetY"]) {
      const offset = Number(style?.[offsetProperty]);
      if (style?.[offsetProperty] !== undefined
        && (!Number.isFinite(offset) || offset < -1200 || offset > 1200)) {
        errors.push({ path: `${path}.${offsetProperty}`, message: "Anchor offset must be between -1200 and 1200." });
      }
    }
  }
  for (const [targetType, values] of Object.entries(spec.visibility || {})) {
    if (!["items", "fields"].includes(targetType) || !values || typeof values !== "object") {
      errors.push({ path: `visibility.${targetType}`, message: "Unsupported visibility target." });
      continue;
    }
    Object.entries(values).forEach(([key, visible]) => {
      if (typeof visible !== "boolean") {
        errors.push({ path: `visibility.${targetType}.${key}`, message: "Visibility must be boolean." });
      }
    });
  }
  Object.entries(spec.sectionStyles).forEach(([key, style]) => {
    const height = Number(style?.minHeight);
    if (style?.minHeight !== undefined && (!Number.isFinite(height) || height < 50 || height > 1200)) {
      errors.push({ path: `sectionStyles.${key}.minHeight`, message: "Section height must be between 50 and 1200." });
    }
    if (style?.backgroundSize !== undefined && !allowedBackgroundSizes.has(style.backgroundSize)) {
      errors.push({ path: `sectionStyles.${key}.backgroundSize`, message: "Unsupported section background size." });
    }
    if (style?.backgroundFitMode !== undefined && !allowedBackgroundFitModes.has(style.backgroundFitMode)) {
      errors.push({ path: `sectionStyles.${key}.backgroundFitMode`, message: "Unsupported section background fit mode." });
    }
    if (style?.backgroundPosition !== undefined && !allowedBackgroundPositions.has(style.backgroundPosition)) {
      errors.push({ path: `sectionStyles.${key}.backgroundPosition`, message: "Unsupported section background position." });
    }
    if (style?.backgroundFadeMode !== undefined && !allowedFadeModes.has(style.backgroundFadeMode)) {
      errors.push({ path: `sectionStyles.${key}.backgroundFadeMode`, message: "Unsupported section background fade mode." });
    }
    if (style?.backgroundFadeStrength !== undefined && !allowedFadeStrengths.has(style.backgroundFadeStrength)) {
      errors.push({ path: `sectionStyles.${key}.backgroundFadeStrength`, message: "Unsupported section background fade strength." });
    }
    for (const colorKey of ["backgroundColor", "backgroundFadeColor"]) {
      if (style?.[colorKey] !== undefined && !/^#[0-9a-f]{6}$/i.test(String(style[colorKey]))) {
        errors.push({ path: `sectionStyles.${key}.${colorKey}`, message: "Section colors must use six-digit hex values." });
      }
    }
  });
  Object.entries(spec.itemStyles).forEach(([key, style]) => {
    const x = Number(style?.xPct);
    const y = Number(style?.yPx);
    const size = Number(style?.fontSize);
    validateTextLayoutStyle(style, `itemStyles.${key}`);
    if (style?.xPct !== undefined && (!Number.isFinite(x) || x < 0 || x > 100)) {
      errors.push({ path: `itemStyles.${key}.xPct`, message: "xPct must be between 0 and 100." });
    }
    if (style?.yPx !== undefined && (!Number.isFinite(y) || y < 0 || y > 1200)) {
      errors.push({ path: `itemStyles.${key}.yPx`, message: "yPx must be between 0 and 1200." });
    }
    if (style?.fontSize !== undefined && (!Number.isFinite(size) || size < 0 || size > 80)) {
      errors.push({ path: `itemStyles.${key}.fontSize`, message: "fontSize must be between 0 and 80." });
    }
    const width = Number(style?.widthPct);
    const height = Number(style?.heightPx);
    if (style?.widthPct !== undefined && (!Number.isFinite(width) || width < 0.01 || width > 100)) {
      errors.push({ path: `itemStyles.${key}.widthPct`, message: "Component width must be between 0.01 and 100 percent." });
    }
    if (style?.heightPx !== undefined && (!Number.isFinite(height) || height < 1 || height > 900)) {
      errors.push({ path: `itemStyles.${key}.heightPx`, message: "Component height must be between 1 and 900." });
    }
    if (style?.imageFit !== undefined && !allowedImageFits.has(style.imageFit)) {
      errors.push({ path: `itemStyles.${key}.imageFit`, message: "Unsupported image fit." });
    }
    if (style?.imagePosition !== undefined && !allowedImagePositions.has(style.imagePosition)) {
      errors.push({ path: `itemStyles.${key}.imagePosition`, message: "Unsupported image position." });
    }
    if (style?.shape !== undefined && !allowedShapes.has(style.shape)) {
      errors.push({ path: `itemStyles.${key}.shape`, message: "Unsupported image shape." });
    }
    if (style?.aspectRatio !== undefined && !/^\d+(?:\.\d+)?\s*[:/]\s*\d+(?:\.\d+)?$/.test(String(style.aspectRatio))) {
      errors.push({ path: `itemStyles.${key}.aspectRatio`, message: "Unsupported image aspect ratio." });
    }
    if (style?.accessibleLabel !== undefined && String(style.accessibleLabel).length > 240) {
      errors.push({ path: `itemStyles.${key}.accessibleLabel`, message: "Image accessibility label is too long." });
    }
    if (style?.aspectRatioLocked !== undefined && typeof style.aspectRatioLocked !== "boolean") {
      errors.push({ path: `itemStyles.${key}.aspectRatioLocked`, message: "Image aspect-ratio lock must be boolean." });
    }
    if (style?.decorative !== undefined && typeof style.decorative !== "boolean") {
      errors.push({ path: `itemStyles.${key}.decorative`, message: "Image decorative state must be boolean." });
    }
  });
  const mobile = spec.responsiveLayouts?.mobile;
  if (mobile !== undefined && (!mobile || typeof mobile !== "object" || Array.isArray(mobile))) {
    errors.push({ path: "responsiveLayouts.mobile", message: "Mobile responsive layout must be an object." });
  } else if (mobile) {
    if (mobile.itemStyles !== undefined
      && (!mobile.itemStyles || typeof mobile.itemStyles !== "object" || Array.isArray(mobile.itemStyles))) {
      errors.push({ path: "responsiveLayouts.mobile.itemStyles", message: "Mobile item styles must be an object." });
    } else {
      Object.entries(mobile.itemStyles || {}).forEach(([key, style]) => {
        const x = Number(style?.xPct);
        const y = Number(style?.yPx);
        const width = Number(style?.widthPct);
        const height = Number(style?.heightPx);
        const zIndex = Number(style?.zIndex);
        validateTextLayoutStyle(style, `responsiveLayouts.mobile.itemStyles.${key}`);
        if (style?.xPct !== undefined && (!Number.isFinite(x) || x < 0 || x > 100)) {
          errors.push({ path: `responsiveLayouts.mobile.itemStyles.${key}.xPct`, message: "Mobile xPct must be between 0 and 100." });
        }
        if (style?.yPx !== undefined && (!Number.isFinite(y) || y < 0 || y > 1200)) {
          errors.push({ path: `responsiveLayouts.mobile.itemStyles.${key}.yPx`, message: "Mobile yPx must be between 0 and 1200." });
        }
        if (style?.widthPct !== undefined && (!Number.isFinite(width) || width < 0.01 || width > 100)) {
          errors.push({ path: `responsiveLayouts.mobile.itemStyles.${key}.widthPct`, message: "Mobile widthPct must be between 0.01 and 100." });
        }
        if (style?.heightPx !== undefined && (!Number.isFinite(height) || height < 1 || height > 900)) {
          errors.push({ path: `responsiveLayouts.mobile.itemStyles.${key}.heightPx`, message: "Mobile heightPx must be between 1 and 900." });
        }
        if (style?.zIndex !== undefined && (!Number.isInteger(zIndex) || zIndex < 0 || zIndex > 100)) {
          errors.push({ path: `responsiveLayouts.mobile.itemStyles.${key}.zIndex`, message: "Mobile zIndex must be an integer between 0 and 100." });
        }
        if (Number.isFinite(x) && Number.isFinite(width) && x + width > 100) {
          errors.push({ path: `responsiveLayouts.mobile.itemStyles.${key}`, message: "Mobile item cannot overflow the section width." });
        }
      });
    }
    const mobileVisibility = mobile.visibility?.items;
    if (mobileVisibility !== undefined
      && (!mobileVisibility || typeof mobileVisibility !== "object" || Array.isArray(mobileVisibility))) {
      errors.push({ path: "responsiveLayouts.mobile.visibility.items", message: "Mobile visibility must be an object." });
    } else {
      Object.entries(mobileVisibility || {}).forEach(([key, visible]) => {
        if (typeof visible !== "boolean") {
          errors.push({ path: `responsiveLayouts.mobile.visibility.items.${key}`, message: "Mobile visibility must be boolean." });
        }
      });
    }
  }
  return { ok: errors.length === 0, errors, spec };
}

export function createLayoutSnapshot({ baseLayout, userLayout, layoutRevision = 1, renderer = {} }) {
  const resolvedLayout = mergeLayoutSpec(baseLayout, userLayout);
  return {
    contractVersion: resolvedLayout.contractVersion,
    layoutRevision: Number(layoutRevision || 1),
    renderer: {
      key: renderer.key || "default-promo-renderer",
      version: Number(renderer.version || 1),
    },
    baseLayout: clone(baseLayout || DEFAULT_DESIGN_SPEC),
    userLayout: clone(userLayout || {}),
    resolvedLayout,
  };
}
