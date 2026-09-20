function clone(value) {
  return value == null ? value : JSON.parse(JSON.stringify(value));
}

function defaultFieldValue(field = {}) {
  if (field.fieldKind === "image") return { source: "url", value: "", alt: field.name || "미리보기 이미지" };
  if (field.fieldKind === "cta") return { label: field.defaultValue || field.name || "자세히 보기", link: "#", target: "_self" };
  return field.defaultValue || (field.textType === "title" ? "프로모션 제목 미리보기" : `${field.name || "텍스트"} 미리보기`);
}

function defaultItemValue(item = {}) {
  const fields = Array.isArray(item.fields) && item.fields.length ? item.fields : [item];
  if (fields.length === 1) return defaultFieldValue(fields[0]);
  return { fields: Object.fromEntries(fields.map((field) => [field.fieldKey, defaultFieldValue(field)])) };
}

export function normalizeSectionLayoutSnapshot(layoutSnapshot = {}, items = []) {
  const source = clone(layoutSnapshot) || {};
  const itemKeys = items.map((item) => String(item.itemKey || "")).filter(Boolean);
  const normalizeViewport = (name) => ({
    items: Object.fromEntries(itemKeys.map((itemKey) => [itemKey, {
      positionMode: "free",
      xPct: name === "mobile" ? 5 : 4,
      yPx: 16,
      widthPct: name === "mobile" ? 90 : 44,
      heightPx: 52,
      zIndex: 1,
      ...(source.viewports?.[name]?.items?.[itemKey] || {}),
    }])),
    visibility: { items: Object.fromEntries(itemKeys.map((itemKey) => [
      itemKey,
      source.viewports?.[name]?.visibility?.items?.[itemKey] !== false,
    ])) },
  });
  return {
    contractVersion: 1,
    layoutMode: "free",
    sectionStyle: { minHeight: 320, backgroundColor: "#ffffff", ...(source.sectionStyle || {}) },
    content: Object.fromEntries(items.map((item) => [
      item.itemKey,
      Object.prototype.hasOwnProperty.call(source.content || {}, item.itemKey)
        ? source.content[item.itemKey]
        : defaultItemValue(item),
    ])),
    viewports: {
      desktop: normalizeViewport("desktop"),
      mobile: normalizeViewport("mobile"),
    },
  };
}

export function sectionLayoutTree(section = {}, items = []) {
  return [
    { path: "root", depth: 0, tag: "section", kind: "section", label: section.name || section.sectionKey || "Section" },
    ...items.map((item, index) => ({
      path: `root.children.${index}`,
      depth: 1,
      tag: "article",
      kind: "component",
      itemKey: item.itemKey,
      label: item.name || item.itemKey,
      node: item,
    })),
  ];
}

export function updateSectionLayoutGeometry(snapshot, viewport, itemKey, patch) {
  const next = clone(snapshot);
  const targetViewport = viewport === "mobile" ? "mobile" : "desktop";
  const current = next.viewports?.[targetViewport]?.items?.[itemKey];
  if (!current) return next;
  next.viewports[targetViewport].items[itemKey] = { ...current, ...clone(patch) };
  return next;
}

export function updateSectionLayoutVisibility(snapshot, viewport, itemKey, visible) {
  const next = clone(snapshot);
  const targetViewport = viewport === "mobile" ? "mobile" : "desktop";
  next.viewports[targetViewport].visibility.items[itemKey] = visible !== false;
  return next;
}

export function createSectionLayoutPreviewSnapshot(section = {}, items = [], layoutSnapshot = {}) {
  const normalized = normalizeSectionLayoutSnapshot(layoutSnapshot, items);
  const sectionKey = section.sectionKey || "preview-section";
  const desktopStyles = Object.fromEntries(items.map((item) => [
    `${sectionKey}.${item.itemKey}`,
    clone(normalized.viewports.desktop.items[item.itemKey]),
  ]));
  const mobileStyles = Object.fromEntries(items.map((item) => [
    `${sectionKey}.${item.itemKey}`,
    clone(normalized.viewports.mobile.items[item.itemKey]),
  ]));
  const desktopVisibility = Object.fromEntries(items.map((item) => [
    `${sectionKey}.${item.itemKey}`,
    normalized.viewports.desktop.visibility.items[item.itemKey] !== false,
  ]));
  const mobileVisibility = Object.fromEntries(items.map((item) => [
    `${sectionKey}.${item.itemKey}`,
    normalized.viewports.mobile.visibility.items[item.itemKey] !== false,
  ]));
  return {
    contractVersion: 3,
    content: {
      contractVersion: 3,
      formTemplate: { id: "section-preview", designTokens: { values: {} } },
      runtimeTheme: { sourceType: "admin-preview", designTokens: { values: {} } },
      sectionSnapshot: [{ ...clone(section), sectionKey, items: clone(items) }],
      sectionInputs: { [sectionKey]: clone(normalized.content) },
      sectionOrder: [sectionKey],
      resourceReferences: [],
    },
    designSpec: {
      contractVersion: 1,
      theme: { backgroundColor: "#f5f7fb", textColor: "#172033", accentColor: "#156b5b", ctaColor: "#156b5b", ctaVariant: "fill", fontFamily: "Inter, Pretendard, sans-serif" },
      responsive: { contentMaxWidth: 1280, contentMinWidth: 0, mobileBreakpoint: 720 },
      sectionStyles: { [sectionKey]: clone(normalized.sectionStyle) },
      itemStyles: desktopStyles,
      visibility: { items: desktopVisibility, fields: {} },
      responsiveLayouts: { mobile: { itemStyles: mobileStyles, visibility: { items: mobileVisibility } } },
    },
    assets: { contractVersion: 1, items: {} },
    motionSpec: { contractVersion: 2, sections: {}, items: {} },
  };
}
