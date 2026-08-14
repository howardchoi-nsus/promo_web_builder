function uniqueStrings(values = []) {
  return [...new Set((Array.isArray(values) ? values : [])
    .map((value) => String(value || "").trim())
    .filter(Boolean))];
}

function resolveAllowedLayoutPresets(section = {}, savedLayouts = [], {
  fallbackToDefault = false,
} = {}) {
  const layouts = Array.isArray(savedLayouts) ? savedLayouts.filter(Boolean) : [];
  const layoutsByKey = new Map(layouts.map((layout) => [String(layout.layoutKey || "").trim(), layout]));
  const defaultLayout = layouts.find((layout) => layout.isDefault) || null;
  const defaultLayoutKey = String(defaultLayout?.layoutKey || "").trim();
  const configuredKeys = uniqueStrings(section.aiDesign?.allowedLayoutVariants)
    .filter((layoutKey) => layoutsByKey.has(layoutKey));
  const layoutSelectionLocked = section.compositionPolicy?.layoutLocked === true;

  let allowedLayoutKeys = configuredKeys;
  if (layoutSelectionLocked) {
    allowedLayoutKeys = defaultLayoutKey ? [defaultLayoutKey] : [];
  } else if (!allowedLayoutKeys.length && fallbackToDefault && defaultLayoutKey) {
    allowedLayoutKeys = [defaultLayoutKey];
  }

  const allowedKeySet = new Set(allowedLayoutKeys);
  return {
    savedLayoutCount: layouts.length,
    defaultLayoutKey: defaultLayoutKey || null,
    allowedLayoutKeys,
    layoutSelectionLocked,
    layoutPresets: layouts.filter((layout) => allowedKeySet.has(layout.layoutKey)),
  };
}

module.exports = {
  resolveAllowedLayoutPresets,
  uniqueStrings,
};
