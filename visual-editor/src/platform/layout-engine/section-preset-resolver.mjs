function clone(value) {
  return value == null ? value : JSON.parse(JSON.stringify(value));
}

function viewportPatch(section, preset, viewportName) {
  const viewport = preset?.layoutSnapshot?.viewports?.[viewportName] || {};
  const bySourceKey = new Map((section.items || []).map((item) => [
    String(item.sourceItemKey || item.itemKey),
    item,
  ]));
  const itemStyles = {};
  const visibilityItems = {};
  Object.entries(viewport.items || {}).forEach(([sourceItemKey, geometry]) => {
    const item = bySourceKey.get(sourceItemKey);
    if (!item?.itemKey) return;
    itemStyles[`${section.sectionKey}.${item.itemKey}`] = clone(geometry);
  });
  Object.entries(viewport.visibility?.items || {}).forEach(([sourceItemKey, visible]) => {
    const item = bySourceKey.get(sourceItemKey);
    if (!item?.itemKey || item.isRequired || item.isLocked) return;
    visibilityItems[`${section.sectionKey}.${item.itemKey}`] = visible !== false;
  });
  return { itemStyles, visibilityItems };
}

export function resolveSectionPresetLayoutPatch(section, preset) {
  const snapshot = preset?.layoutSnapshot;
  if (!snapshot || snapshot.contractVersion !== 1 || snapshot.layoutMode !== "free") return null;
  const desktop = viewportPatch(section, preset, "desktop");
  const mobile = viewportPatch(section, preset, "mobile");
  return {
    sectionStyles: {
      [section.sectionKey]: {
        ...(clone(snapshot.sectionStyle) || {}),
        layoutVariant: preset.layoutKey,
      },
    },
    itemStyles: desktop.itemStyles,
    visibility: { items: desktop.visibilityItems },
    responsiveLayouts: {
      mobile: {
        itemStyles: mobile.itemStyles,
        visibility: { items: mobile.visibilityItems },
      },
    },
  };
}

