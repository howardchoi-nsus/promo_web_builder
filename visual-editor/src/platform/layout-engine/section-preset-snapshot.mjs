function clone(value) {
  return value == null ? value : JSON.parse(JSON.stringify(value));
}

const GEOMETRY_KEYS = Object.freeze([
  "positionMode", "xPct", "yPx", "widthPct", "heightPx", "zIndex",
  "horizontalAnchor", "verticalAnchor", "offsetX", "offsetY",
  "widthMode", "heightMode", "textAlign",
]);

function geometryFromStyle(style = {}, fallback = {}) {
  const merged = { ...fallback, ...style };
  return Object.fromEntries(GEOMETRY_KEYS
    .filter((key) => merged[key] !== undefined)
    .map((key) => [key, clone(merged[key])]));
}

function viewportSnapshot(section, designSpec, viewportName, baseViewport = {}) {
  const responsive = viewportName === "mobile" ? designSpec.responsiveLayouts?.mobile || {} : designSpec;
  const sourceStyles = responsive.itemStyles || {};
  const sourceVisibility = responsive.visibility?.items || {};
  const baseItems = baseViewport.items || {};
  const baseVisibility = baseViewport.visibility?.items || {};
  const items = {};
  const visibility = {};

  (section.items || []).forEach((item) => {
    const itemKey = String(item.itemKey || "");
    if (!itemKey) return;
    const styleKey = `${section.sectionKey}.${itemKey}`;
    items[itemKey] = geometryFromStyle(sourceStyles[styleKey], baseItems[itemKey]);
    const visible = Object.prototype.hasOwnProperty.call(sourceVisibility, styleKey)
      ? sourceVisibility[styleKey] !== false
      : baseVisibility[itemKey] !== false;
    visibility[itemKey] = visible;
  });

  return { items, visibility: { items: visibility } };
}

export function sectionPresetSnapshotFromDesignSpec(section, designSpec = {}, baseSnapshot = {}) {
  const sectionStyle = designSpec.sectionStyles?.[section.sectionKey] || {};
  const baseSectionStyle = baseSnapshot.sectionStyle || {};
  return {
    contractVersion: 1,
    layoutMode: "free",
    sectionStyle: {
      minHeight: Number(sectionStyle.minHeight ?? baseSectionStyle.minHeight ?? 50),
      backgroundColor: String(sectionStyle.backgroundColor || baseSectionStyle.backgroundColor || "#FFFFFF"),
    },
    viewports: {
      desktop: viewportSnapshot(section, designSpec, "desktop", baseSnapshot.viewports?.desktop),
      mobile: viewportSnapshot(section, designSpec, "mobile", baseSnapshot.viewports?.mobile),
    },
  };
}
