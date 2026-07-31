function clone(value) {
  return value == null ? value : JSON.parse(JSON.stringify(value));
}

function generatedSuffix() {
  if (globalThis.crypto?.randomUUID) return globalThis.crypto.randomUUID().replace(/-/g, "");
  return `${Date.now().toString(16)}${Math.random().toString(16).slice(2)}`.replace(/[^a-f0-9]/g, "");
}

export function createSectionKey() {
  return `sec_${generatedSuffix()}`;
}

export function createItemKey(componentKey = "component") {
  const base = String(componentKey || "component")
    .replace(/[^a-zA-Z0-9_]/g, "_")
    .replace(/^[^a-zA-Z]+/, "")
    .slice(0, 48) || "component";
  return `${base}_${generatedSuffix().slice(0, 8)}`;
}

export function createBlankSectionInstance({
  name = "새 섹션",
  sectionRole = "content",
  index = 0,
} = {}) {
  const sectionKey = createSectionKey();
  return {
    id: null,
    instanceId: sectionKey,
    sectionId: null,
    sourceSectionId: null,
    sectionKey,
    name: String(name || "새 섹션").trim() || "새 섹션",
    description: "",
    isRequired: false,
    orderChangeAllowed: true,
    userReorderAllowed: true,
    fixedPosition: null,
    sortOrder: Number(index) * 10,
    isVisibleInWizard: true,
    status: "draft",
    version: 1,
    sectionRole: String(sectionRole || "content"),
    compositionScope: "document",
    compositionPolicy: {
      selectionPolicy: "optional",
      maxInstances: 1,
      contentEditableByAi: true,
      contentLocked: false,
      layoutLocked: false,
      repeatable: false,
      markets: [],
      promotionTypes: [],
    },
    aiDesign: {
      enabled: false,
      allowedLayoutVariants: ["split-left", "split-right", "centered-hero"],
      allowSectionBackground: true,
      imageTarget: "section-background",
      imageTargetItemKeys: [],
      imageAspectRatio: "16:9",
      backgroundPromptText: "",
    },
    items: [],
  };
}

export function createSectionInstanceFromPreset(preset, { index = 0, preserveKeys = false } = {}) {
  if (!preset?.sectionKey) throw new TypeError("Section preset is required");
  const section = clone(preset);
  const sectionKey = preserveKeys ? String(preset.sectionKey) : createSectionKey();
  return {
    ...section,
    id: null,
    instanceId: sectionKey,
    sectionId: null,
    sourceSectionId: String(preset.sectionId || preset.id || ""),
    sourceSectionKey: String(preset.sectionKey || ""),
    sectionKey,
    sortOrder: Number(index) * 10,
    status: "draft",
    compositionScope: "document",
    fixedPosition: preset.fixedPosition || null,
    userReorderAllowed: preset.fixedPosition ? false : preset.userReorderAllowed !== false,
    items: (preset.items || []).map((item) => ({
      ...clone(item),
      id: null,
      sectionId: null,
      sourceItemId: String(item.id || ""),
      sourceItemKey: String(item.itemKey || ""),
      itemKey: preserveKeys
        ? String(item.itemKey)
        : createItemKey(item.componentKey || item.itemKey || "component"),
    })),
  };
}

function imageDefinition(policy = {}) {
  return {
    allowedSources: Array.isArray(policy.allowedSources) ? policy.allowedSources : ["url"],
    promptText: String(policy.promptText || ""),
    descriptionEnabled: policy.descriptionEnabled === true,
    altTextRequired: policy.altTextRequired === true,
    aspectRatio: String(policy.aspectRatio || ""),
    maxSizeKb: policy.maxSizeKb == null ? null : Number(policy.maxSizeKb),
  };
}

function ctaDefinition(policy = {}) {
  return {
    source: String(policy.source || ""),
    medium: String(policy.medium || ""),
    campaign: String(policy.campaign || ""),
    content: String(policy.content || ""),
    term: String(policy.term || ""),
  };
}

function componentField(field = {}) {
  return {
    id: null,
    sourceFieldId: String(field.id || ""),
    fieldKey: String(field.fieldKey || `fld_${generatedSuffix()}`),
    name: String(field.name || "Field"),
    description: String(field.description || field.editorSchema?.description || ""),
    fieldKind: String(field.fieldKind || "text"),
    textType: field.textType || null,
    sortOrder: Number(field.sortOrder || 0),
    isRequired: field.isRequired === true,
    isLocked: field.isLocked === true,
    defaultValue: clone(field.defaultValue),
    editorSchema: clone(field.editorSchema || {}),
    capabilities: clone(field.capabilities || {}),
    styleSlots: clone(field.styleSlots || []),
    image: field.fieldKind === "image" ? imageDefinition(field.imagePolicy || field.image) : null,
    ctaUtm: field.fieldKind === "cta" ? ctaDefinition(field.ctaPolicy || field.ctaUtm) : null,
  };
}

export function createComponentInstanceFromDefinition(component) {
  const version = component?.activeVersion;
  if (!component?.componentKey || !version?.id) {
    throw new TypeError("An active component definition is required");
  }
  const fields = Array.isArray(version.fields) ? version.fields.map(componentField) : [];
  return {
    id: null,
    sectionId: null,
    componentId: String(component.id || ""),
    componentKey: String(component.componentKey),
    componentVersionId: String(version.id),
    componentVersion: Number(version.version || 1),
    itemKey: createItemKey(component.componentKey),
    name: String(component.name || component.componentKey),
    description: String(component.description || version.editorSchema?.description || ""),
    isVisibleInWizard: true,
    isRequired: false,
    userReorderAllowed: true,
    sortOrder: 0,
    fieldKind: String(version.fieldKind || fields[0]?.fieldKind || "text"),
    textType: version.textType || fields[0]?.textType || null,
    image: version.fieldKind === "image" ? imageDefinition(version.imagePolicy) : null,
    ctaUtm: version.fieldKind === "cta" ? ctaDefinition(version.ctaPolicy) : null,
    editorSchema: clone(version.editorSchema || {}),
    defaultValue: clone(version.defaultValue),
    capabilities: clone(version.capabilities || {}),
    styleSlots: clone(version.styleSlots || []),
    instanceConfig: {},
    isLocked: false,
    lockedValue: null,
    fields,
  };
}

export function activeComponentDefinitions(components = []) {
  return (Array.isArray(components) ? components : [])
    .filter((component) => component?.status !== "archived" && component?.activeVersion?.status === "active")
    .map((component) => clone(component));
}

export function activeSectionPresets(sections = []) {
  return (Array.isArray(sections) ? sections : [])
    .filter((section) => section?.status === "active" && section?.isVisibleInWizard !== false)
    .map((section) => clone(section));
}
