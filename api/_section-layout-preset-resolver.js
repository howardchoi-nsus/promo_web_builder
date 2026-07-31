function clone(value) {
  return value == null ? value : JSON.parse(JSON.stringify(value));
}

function componentSourceKey(component) {
  return String(component?.sourceItemKey || component?.itemKey || "");
}

function componentInstanceKey(component) {
  return String(component?.id || component?.itemKey || "");
}

function resolveViewport(sectionInstanceKey, components, viewport = {}) {
  const bySourceKey = new Map(
    (components || []).map((component) => [componentSourceKey(component), component]),
  );
  const itemStyles = {};
  const visibilityItems = {};
  Object.entries(viewport.items || {}).forEach(([sourceItemKey, geometry]) => {
    const component = bySourceKey.get(sourceItemKey);
    const instanceKey = componentInstanceKey(component);
    if (!instanceKey) return;
    itemStyles[`${sectionInstanceKey}.${instanceKey}`] = clone(geometry);
  });
  Object.entries(viewport.visibility?.items || {}).forEach(([sourceItemKey, visible]) => {
    const component = bySourceKey.get(sourceItemKey);
    const instanceKey = componentInstanceKey(component);
    if (!instanceKey || component?.isRequired || component?.isLocked) return;
    visibilityItems[`${sectionInstanceKey}.${instanceKey}`] = visible !== false;
  });
  return { itemStyles, visibilityItems };
}

function resolveSectionLayoutPreset(sectionInstanceKey, components, preset) {
  const snapshot = preset?.layoutSnapshot || preset?.layout_snapshot;
  if (!snapshot || snapshot.contractVersion !== 1 || snapshot.layoutMode !== "free") return null;
  const desktop = resolveViewport(sectionInstanceKey, components, snapshot.viewports?.desktop);
  const mobile = resolveViewport(sectionInstanceKey, components, snapshot.viewports?.mobile);
  return {
    layoutKey: String(preset.layoutKey || preset.layout_key || ""),
    sectionStyle: {
      ...(clone(snapshot.sectionStyle) || {}),
      layoutVariant: String(preset.layoutKey || preset.layout_key || ""),
    },
    itemStyles: desktop.itemStyles,
    visibilityItems: desktop.visibilityItems,
    responsiveLayouts: {
      mobile: {
        itemStyles: mobile.itemStyles,
        visibility: { items: mobile.visibilityItems },
      },
    },
  };
}

module.exports = {
  resolveSectionLayoutPreset,
};

