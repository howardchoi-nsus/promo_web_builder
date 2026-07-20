const steps = [
  {
    title: "배경색 선택",
    copy: "프로모션의 기본 배경색을 고르세요. 선택 결과는 미리보기에 즉시 반영됩니다.",
    cards: [],
  },
  {
    title: "CTA 버튼 스타일 선택",
    copy: "버튼 모양, 표현 방식, 색상을 선택하세요. 조합 결과를 미리보기에서 확인할 수 있습니다.",
    cards: [],
  },
  {
    title: "템플릿 및 콘텐츠 등록",
    copy: "관리자에서 생성한 템플릿을 선택하고 프로모션 콘텐츠를 등록하는 단계입니다.",
    cards: [
      ["다음 개발 범위", "템플릿 선택과 템플릿별 콘텐츠 입력 기능은 다음 단계에서 연결합니다."],
    ],
  },
  {
    title: "웹 출력",
    copy: "선택한 스타일, 템플릿, 콘텐츠를 최종 웹 결과물로 출력하는 단계입니다.",
    cards: [
      ["다음 개발 범위", "최종 미리보기와 웹 출력 기능은 템플릿·콘텐츠 등록 단계 이후 연결합니다."],
    ],
  },
];

const BACKGROUND_OPTIONS = [
  { id: "warm-white", name: "웜 화이트", color: "#f7f3ed", textColor: "#1c2330" },
  { id: "sand", name: "샌드", color: "#e7d8bd", textColor: "#1c2330" },
  { id: "coral", name: "코랄", color: "#d94841", textColor: "#ffffff" },
  { id: "royal-blue", name: "로열 블루", color: "#2155cd", textColor: "#ffffff" },
  { id: "forest", name: "포레스트", color: "#174f3a", textColor: "#ffffff" },
  { id: "midnight", name: "미드나이트", color: "#111827", textColor: "#ffffff" },
];

const CTA_SHAPES = [
  { id: "square", name: "각진 버튼" },
  { id: "round", name: "라운드 버튼" },
];

const CTA_VARIANTS = [
  { id: "fill", name: "채움" },
  { id: "ghost", name: "고스트" },
];

const CTA_STYLE_OPTIONS = [
  { id: "square-ghost", name: "각진 버튼 · 고스트", shape: "square", variant: "ghost" },
  { id: "square-fill", name: "각진 버튼 · 채움", shape: "square", variant: "fill" },
  { id: "round-ghost", name: "둥근 버튼 · 고스트", shape: "round", variant: "ghost" },
  { id: "round-fill", name: "둥근 버튼 · 채움", shape: "round", variant: "fill" },
];

const CTA_COLORS = [
  { id: "red", name: "레드", color: "#e23c34" },
  { id: "blue", name: "블루", color: "#3478f6" },
  { id: "green", name: "그린", color: "#18a66a" },
  { id: "orange", name: "오렌지", color: "#f2762e" },
  { id: "black", name: "블랙", color: "#141923" },
];

const storageKeys = {
  selectedDocumentId: "promoPrototype.createPromo.selectedDocumentId.abc",
  wizardContent: "promoPrototype.createPromo.content.v1",
  wizardContentLegacyBackup: "promoPrototype.createPromo.content.legacyBackup.v1",
  wizardRun: "promoPrototype.createPromo.run.v1",
  wizardSessionId: "promoPrototype.createPromo.sessionId.v1",
  appearance: "promoPrototype.createPromo.appearance.v1",
};

const SECTION_INPUT_SCHEMA_VERSION = 2;
const LAYOUT_CACHE_CONTRACT_VERSION = 2;
const WEB_OUTPUT_SNAPSHOT_STORAGE_KEY = "promoVisualEditor.snapshot.v1";
const CONTENT_SUBSTEP_STORAGE_KEY = "promoPrototype.createPromo.contentSubstep.v1";
const CONTENT_SUBSTEPS = ["overview", "template", "layout"];
const {
  normalizeLayoutIdentity,
  sameLayoutIdentity,
  hasLayoutOverrides,
  resolveLayoutCache,
  sameSectionOrder,
  resolveSectionOrderCache,
} = globalThis.CreatePromoLayoutCache || {};

let currentStep = 0;
let contentSubstep = CONTENT_SUBSTEPS.includes(sessionStorage.getItem(CONTENT_SUBSTEP_STORAGE_KEY))
  ? sessionStorage.getItem(CONTENT_SUBSTEP_STORAGE_KEY)
  : "overview";
let designDocuments = [];
let selectedDocumentId = localStorage.getItem(storageKeys.selectedDocumentId) || "";
let conceptsLoading = false;
let conceptsError = "";
let validationErrors = {};
let runState = loadWizardRun();
let runLoading = false;
let runError = "";
let selectedLofiPreviewDraftId = "";
let selectedFinalPreviewDesignId = "";
let runPollingTimer = null;
let workerSettings = [];
let workerSettingsError = "";
// Admin-managed Step 2 content sections (Admin Page "C. Wizard Content
// Sections 관리"). Replaces the previously hardcoded 7-section structure.
// Only the currently active + wizard-visible version of each section is
// fetched here (see api/wizard-content-sections.js, ?scope=public).
let wizardSectionDefinitions = [];
let wizardFormTemplates = [];
let selectedWizardFormTemplate = null;
let wizardSectionDefinitionsLoading = false;
let wizardSectionDefinitionsError = "";
let wizardSectionConfigRevision = "";
let wizardTemplateSwitchTargetId = "";
let expandedTemplateSectionKeys = new Set();
let draggedTemplateSectionKey = "";
let wizardBaseLayout = null;
let wizardResolvedLayout = null;
let wizardLayoutRevision = 1;
let wizardRenderer = { key: "default-promo-renderer", version: 1 };
let wizardLayoutIdentity = null;
let wizardBaseSectionOrder = [];
let pendingAdminLayoutUpdate = null;
let deferredAdminLayoutIdentityKey = "";
let wizardTemplateRefreshPromise = null;
let wizardTemplateRefreshRequestId = 0;
let wizardTemplateRefreshError = "";
let wizardLayoutFrame = null;
let wizardLayoutLogTimer = null;
const wizardSessionId = sessionStorage.getItem(storageKeys.wizardSessionId)
  || (globalThis.crypto?.randomUUID?.() || `create-promo-${Date.now()}-${Math.random().toString(16).slice(2)}`);
sessionStorage.setItem(storageKeys.wizardSessionId, wizardSessionId);

const FALLBACK_LAYOUT = {
  contractVersion: 1,
  specKey: "admin-default",
  theme: {
    backgroundColor: "#f5f7fb",
    backgroundImage: "",
    backgroundImageName: "",
    textColor: "#172033",
    accentColor: "#156b5b",
    fontFamily: "Inter, Pretendard, sans-serif",
  },
  responsive: { contentMaxWidth: 1440, contentMinWidth: 1140, mobileBreakpoint: 720 },
  itemStyles: {},
  sectionStyles: {},
};

const contentState = loadWizardContent();
const appearanceState = loadAppearanceState();

const stepButtons = Array.from(document.querySelectorAll(".step"));
const title = document.getElementById("step-title");
const copy = document.getElementById("step-copy");
const eyebrow = document.getElementById("step-eyebrow");
const placeholders = document.getElementById("step-placeholders");
const status = document.getElementById("step-status");
const shellStatus = document.getElementById("wizard-shell-status");
const prev = document.getElementById("prev-step");
const next = document.getElementById("next-step");

function loadAppearanceState() {
  const fallback = {
    backgroundId: BACKGROUND_OPTIONS[0].id,
    ctaShape: CTA_SHAPES[1].id,
    ctaVariant: CTA_VARIANTS[0].id,
    ctaColorId: CTA_COLORS[0].id,
  };
  try {
    const saved = JSON.parse(localStorage.getItem(storageKeys.appearance) || "null");
    return {
      backgroundId: BACKGROUND_OPTIONS.some((option) => option.id === saved?.backgroundId)
        ? saved.backgroundId : fallback.backgroundId,
      ctaShape: CTA_SHAPES.some((option) => option.id === saved?.ctaShape)
        ? saved.ctaShape : fallback.ctaShape,
      ctaVariant: CTA_VARIANTS.some((option) => option.id === saved?.ctaVariant)
        ? saved.ctaVariant : fallback.ctaVariant,
      ctaColorId: CTA_COLORS.some((option) => option.id === saved?.ctaColorId)
        ? saved.ctaColorId : fallback.ctaColorId,
    };
  } catch {
    return fallback;
  }
}

function saveAppearanceState() {
  localStorage.setItem(storageKeys.appearance, JSON.stringify(appearanceState));
}

function selectedBackground() {
  return BACKGROUND_OPTIONS.find((option) => option.id === appearanceState.backgroundId)
    || BACKGROUND_OPTIONS[0];
}

function selectedCtaColor() {
  return CTA_COLORS.find((option) => option.id === appearanceState.ctaColorId)
    || CTA_COLORS[0];
}

function applyCreatePromoAppearance(layout = FALLBACK_LAYOUT) {
  const background = selectedBackground();
  const ctaColor = selectedCtaColor();
  const source = JSON.parse(JSON.stringify(layout || FALLBACK_LAYOUT));
  return {
    ...source,
    theme: {
      ...(source.theme || {}),
      backgroundColor: background.color,
      backgroundImage: "",
      backgroundImageName: "",
      textColor: background.textColor,
      ctaColor: ctaColor.color,
      ctaShape: appearanceState.ctaShape,
      ctaVariant: appearanceState.ctaVariant,
    },
  };
}

function createAppearancePreview() {
  const background = selectedBackground();
  const ctaColor = selectedCtaColor();
  const preview = document.createElement("section");
  preview.className = "appearance-preview";
  preview.style.setProperty("--preview-background", background.color);
  preview.style.setProperty("--preview-text", background.textColor);
  preview.style.setProperty("--preview-cta", ctaColor.color);

  const label = appendTextElement(preview, "span", "appearance-preview__label", "LIVE PREVIEW");
  label.setAttribute("aria-hidden", "true");
  const content = document.createElement("div");
  content.className = "appearance-preview__content";
  appendTextElement(content, "p", "appearance-preview__eyebrow", "LIMITED PROMOTION");
  appendTextElement(content, "h3", "", "Create your next promotion");
  appendTextElement(content, "p", "appearance-preview__copy", "선택한 배경색과 CTA 스타일을 실시간으로 확인하세요.");

  const cta = document.createElement("button");
  cta.type = "button";
  cta.className = `appearance-preview__cta is-${appearanceState.ctaShape} is-${appearanceState.ctaVariant}`;
  cta.textContent = "Get Started";
  cta.tabIndex = -1;
  content.append(cta);
  preview.append(content);
  return preview;
}

function createChoiceButton({
  group,
  value,
  label,
  selected,
  swatchColor,
  ctaStylePreview = null,
  onSelect,
}) {
  const hasCtaPreview = Boolean(ctaStylePreview);
  const button = document.createElement("button");
  button.type = "button";
  button.className = `appearance-choice${hasCtaPreview ? " appearance-choice--cta-preview" : ""}${selected ? " is-selected" : ""}`;
  button.setAttribute("role", "radio");
  button.setAttribute("aria-checked", String(selected));
  if (hasCtaPreview) button.setAttribute("aria-label", label);
  button.dataset.choiceGroup = group;
  button.dataset.choiceValue = value;
  if (swatchColor) {
    const swatch = document.createElement("span");
    swatch.className = "appearance-choice__swatch";
    swatch.style.backgroundColor = swatchColor;
    swatch.setAttribute("aria-hidden", "true");
    button.append(swatch);
  }
  if (hasCtaPreview) {
    const previewShape = ctaStylePreview.shape;
    const previewVariant = ctaStylePreview.variant;
    const sample = appendTextElement(button, "span", `appearance-choice__cta-sample is-${previewShape} is-${previewVariant}`, "CTA");
    sample.style.setProperty("--choice-cta-color", selectedCtaColor().color);
    sample.setAttribute("aria-hidden", "true");
  } else {
    appendTextElement(button, "strong", "", label);
  }
  const check = appendTextElement(button, "span", "appearance-choice__check", selected ? "✓" : "");
  check.setAttribute("aria-hidden", "true");
  button.addEventListener("click", () => {
    onSelect();
    saveAppearanceState();
    renderStep();
    requestAnimationFrame(() => {
      document.querySelector(`[data-choice-group="${group}"][data-choice-value="${value}"]`)?.focus();
    });
  });
  return button;
}

function createChoiceGroup(titleText, description, buttons) {
  const fieldset = document.createElement("fieldset");
  fieldset.className = "appearance-fieldset";
  const legend = document.createElement("legend");
  legend.textContent = titleText;
  fieldset.append(legend);
  if (description) appendTextElement(fieldset, "p", "appearance-fieldset__description", description);
  const choices = document.createElement("div");
  choices.className = "appearance-choices";
  choices.setAttribute("role", "radiogroup");
  buttons.forEach((button) => choices.append(button));
  fieldset.append(choices);
  return fieldset;
}

function renderBackgroundStep() {
  placeholders.className = "appearance-layout";
  placeholders.innerHTML = "";
  placeholders.append(createAppearancePreview());
  const controls = document.createElement("section");
  controls.className = "appearance-controls";
  controls.append(createChoiceGroup(
    "배경색",
    "어두운 배경을 선택하면 읽기 쉽도록 미리보기 텍스트가 자동으로 밝게 바뀝니다.",
    BACKGROUND_OPTIONS.map((option) => createChoiceButton({
      group: "background",
      value: option.id,
      label: option.name,
      selected: appearanceState.backgroundId === option.id,
      swatchColor: option.color,
      onSelect: () => { appearanceState.backgroundId = option.id; },
    }))
  ));
  placeholders.append(controls);
}

function renderCtaStep() {
  placeholders.className = "appearance-layout";
  placeholders.innerHTML = "";
  placeholders.append(createAppearancePreview());
  const controls = document.createElement("section");
  controls.className = "appearance-controls appearance-controls--cta";
  controls.append(
    createChoiceGroup("버튼 스타일", "버튼 모양과 채움 방식을 하나의 조합으로 선택하세요.", CTA_STYLE_OPTIONS.map((option) => createChoiceButton({
      group: "cta-style",
      value: option.id,
      label: option.name,
      selected: appearanceState.ctaShape === option.shape && appearanceState.ctaVariant === option.variant,
      ctaStylePreview: option,
      onSelect: () => {
        appearanceState.ctaShape = option.shape;
        appearanceState.ctaVariant = option.variant;
      },
    }))),
    createChoiceGroup("버튼 색상", "", CTA_COLORS.map((option) => createChoiceButton({
      group: "cta-color",
      value: option.id,
      label: option.name,
      selected: appearanceState.ctaColorId === option.id,
      swatchColor: option.color,
      onSelect: () => { appearanceState.ctaColorId = option.id; },
    })))
  );
  placeholders.append(controls);
}

function workerSetting(stage) {
  return workerSettings.find((setting) => setting.stage === stage) || null;
}

function workerReady(stage) {
  const setting = workerSetting(stage);
  return Boolean(setting?.isActive && setting?.isConfigured);
}

function workerStatusLabel(stage) {
  const setting = workerSetting(stage);
  if (setting?.isActive && setting?.isConfigured) return "n8n active";
  if (setting?.isConfigured) return "n8n inactive";
  return "n8n not configured";
}

async function loadWorkerSettings() {
  try {
    const result = await fetchJson("/api/promo-generation-worker-settings");
    workerSettings = Array.isArray(result.settings) ? result.settings : [];
    workerSettingsError = "";
  } catch (error) {
    workerSettingsError = error.message || "Worker settings load failed";
  }
  renderStep();
}

function defaultWizardContent() {
  return {
    sectionInputSchemaVersion: SECTION_INPUT_SCHEMA_VERSION,
    promo: {
      title: "",
      template: "AI Auto",
      promotionPurpose: "",
      promotionPurposeOther: "",
      market: "",
      leadText: "",
      ctaLabel: "",
      ctaUrl: "",
      subline: "",
      alphaText: "",
      termsText: "",
    },
    simpleBrief: {
      mainOffer: "",
      targetAction: "",
      audience: "",
      campaignTone: "",
      secondaryMessage: "",
    },
    formTemplate: null,
    templateInputs: {},
    templateSectionOrders: {},
    templateLayouts: {},
    sectionDesignRuns: {},
    // Section 4~10 (Header/Hero/Step Bar/Content CTA/Image Text Row/Title and
    // Description/Footer) used to be hardcoded here. They are now admin-managed
    // (see wizardSectionDefinitions) and this starts empty until
    // loadWizardSectionDefinitions() resolves and calls mergeSectionInputs().
    sectionInputs: {},
  };
}

function migrateLegacySectionInputs(saved = {}) {
  if (!saved || typeof saved !== "object") return {};
  const migrated = JSON.parse(JSON.stringify(saved));
  const assignIfMissing = (target, key, value) => {
    if (target[key] === undefined && value !== undefined) target[key] = value;
  };

  if (migrated.header) {
    assignIfMissing(migrated.header, "logo", migrated.header.logoText);
    assignIfMissing(migrated.header, "badges", migrated.header.badgeText);
  }
  if (migrated.heroBanner) {
    assignIfMissing(migrated.heroBanner, "leadText", migrated.heroBanner.leaderText);
    assignIfMissing(migrated.heroBanner, "button", migrated.heroBanner.cta);
  }
  if (Array.isArray(migrated.stepBar) && migrated.stepBar.length) {
    const firstStep = migrated.stepBar[0] || {};
    migrated.stepBar = {
      title: firstStep.title || "",
      description: firstStep.description || "",
      ctaButton: {
        label: firstStep.ctaLabel || "",
        link: firstStep.link || "",
        target: "_blank",
      },
      legacyItems: migrated.stepBar,
    };
  }
  if (migrated.contentCta) {
    assignIfMissing(migrated.contentCta, "description", migrated.contentCta.longText);
    assignIfMissing(migrated.contentCta, "button", migrated.contentCta.cta);
  }
  if (Array.isArray(migrated.imageTextRow) && migrated.imageTextRow.length) {
    const firstRow = migrated.imageTextRow[0] || {};
    migrated.imageTextRow = {
      image: firstRow.image || { source: "url", value: firstRow.imageUrl || "", alt: firstRow.alt || "" },
      title: firstRow.title || "",
      description: firstRow.description || firstRow.text || "",
      legacyItems: migrated.imageTextRow,
    };
  }
  return migrated;
}

// Builds an empty value for one section item, matching its fieldKind. Locked
// items start pre-filled with the admin's fixed value.
function defaultItemValue(item) {
  if (item.isLocked && item.lockedValue !== null && item.lockedValue !== undefined) {
    return item.lockedValue;
  }
  if (item.fieldKind === "cta") return { label: "", link: "", target: "_blank" };
  if (item.fieldKind === "image") {
    const firstSource = Array.isArray(item.image?.allowedSources) ? item.image.allowedSources[0] : "";
    return { source: firstSource || "url", value: "", description: "", alt: "" };
  }
  return "";
}

function defaultSectionInputsFromDefinitions(definitions) {
  const result = {};
  definitions.forEach((section) => {
    const itemValues = {};
    (section.items || []).forEach((item) => {
      itemValues[item.itemKey] = defaultItemValue(item);
    });
    result[section.sectionKey] = itemValues;
  });
  return result;
}

// Merges saved localStorage values into the shape defined by the currently
// active section/item definitions. Values for sections or items that were
// removed or renamed by an admin are intentionally dropped; new items get
// their default (or locked) value.
function mergeSectionInputs(saved = {}, definitions = wizardSectionDefinitions) {
  const fallback = defaultSectionInputsFromDefinitions(definitions);
  const merged = {};
  Object.keys(fallback).forEach((sectionKey) => {
    const savedSection = (saved && typeof saved === "object" ? saved[sectionKey] : null) || {};
    merged[sectionKey] = { ...fallback[sectionKey] };
    Object.keys(fallback[sectionKey]).forEach((itemKey) => {
      const item = (definitions.find((section) => section.sectionKey === sectionKey)?.items || [])
        .find((candidate) => candidate.itemKey === itemKey);
      if (item?.isLocked) return; // locked items always keep the admin-fixed value
      if (savedSection[itemKey] !== undefined) merged[sectionKey][itemKey] = savedSection[itemKey];
    });
    if (Array.isArray(savedSection.legacyItems)) {
      merged[sectionKey].legacyItems = savedSection.legacyItems;
    }
  });
  return merged;
}

function loadWizardContent() {
  try {
    const saved = JSON.parse(localStorage.getItem(storageKeys.wizardContent) || "null");
    const fallback = defaultWizardContent();
    const needsMigration = saved && Number(saved.sectionInputSchemaVersion || 1) < SECTION_INPUT_SCHEMA_VERSION;
    if (needsMigration && !localStorage.getItem(storageKeys.wizardContentLegacyBackup)) {
      localStorage.setItem(storageKeys.wizardContentLegacyBackup, JSON.stringify(saved));
    }
    return {
      sectionInputSchemaVersion: SECTION_INPUT_SCHEMA_VERSION,
      promo: { ...fallback.promo, ...(saved?.promo || {}) },
      simpleBrief: { ...fallback.simpleBrief, ...(saved?.simpleBrief || {}) },
      formTemplate: saved?.formTemplate || null,
      templateInputs: (saved && typeof saved.templateInputs === "object" && saved.templateInputs) || {},
      templateSectionOrders: (saved && typeof saved.templateSectionOrders === "object" && saved.templateSectionOrders) || {},
      templateLayouts: (saved && typeof saved.templateLayouts === "object" && saved.templateLayouts) || {},
      sectionDesignRuns: (saved && typeof saved.sectionDesignRuns === "object" && saved.sectionDesignRuns) || {},
      // Raw saved value is kept as-is until wizardSectionDefinitions loads;
      // loadWizardSectionDefinitions() then calls mergeSectionInputs() to
      // reconcile it against the current admin configuration.
      sectionInputs: needsMigration
        ? migrateLegacySectionInputs(saved.sectionInputs || {})
        : ((saved && typeof saved.sectionInputs === "object" && saved.sectionInputs) || {}),
    };
  } catch {
    return defaultWizardContent();
  }
}

async function loadWizardSectionDefinitions() {
  wizardSectionDefinitionsLoading = true;
  wizardSectionDefinitionsError = "";
  try {
    const result = await fetchJson("/api/wizard-form-templates-public", { cache: "no-store" });
    wizardFormTemplates = Array.isArray(result.templates) ? result.templates : [];
    if (!wizardFormTemplates.length) throw new Error("활성화된 프로모션 템플릿이 없습니다.");
    const savedId = contentState.formTemplate?.id;
    const target = wizardFormTemplates.find((template) => template.id === savedId)
      || wizardFormTemplates.find((template) => template.isDefault)
      || wizardFormTemplates[0];
    await selectWizardFormTemplate(target.id, { skipConfirmation: true });
  } catch (error) {
    wizardSectionDefinitionsError = error.message || "콘텐츠 섹션 구성을 불러오지 못했습니다.";
  } finally {
    wizardSectionDefinitionsLoading = false;
    renderStep();
  }
}

function layoutIdentityFromTemplateResult(result = {}) {
  const template = result.template || {};
  const renderer = result.renderer || { key: "default-promo-renderer", version: 1 };
  return normalizeLayoutIdentity(result.layoutIdentity || {
    contractVersion: LAYOUT_CACHE_CONTRACT_VERSION,
    templateId: template.id,
    templateKey: template.templateKey,
    templateVersion: template.version,
    layoutId: "",
    layoutRevision: result.layoutRevision,
    configRevision: result.configRevision,
    rendererKey: renderer.key,
    rendererVersion: renderer.version,
  });
}

function layoutIdentityKey(identity) {
  return JSON.stringify(normalizeLayoutIdentity(identity) || {});
}

function layoutIdentityEventSummary(identity) {
  const normalized = normalizeLayoutIdentity(identity);
  if (!normalized) return null;
  const { configRevision, ...summary } = normalized;
  return {
    ...summary,
    configRevisionLength: configRevision.length,
  };
}

function hasTemplateInputValues(value = contentState.sectionInputs) {
  return JSON.stringify(value || {}) !== JSON.stringify(defaultSectionInputsFromDefinitions(wizardSectionDefinitions));
}

async function selectWizardFormTemplate(templateId, options = {}) {
  if (!templateId || (selectedWizardFormTemplate?.id === templateId && !options.force)) return;
  if (!options.fromRefresh) wizardTemplateRefreshRequestId += 1;
  if (!options.skipConfirmation && selectedWizardFormTemplate && hasTemplateInputValues()) {
    if (!window.confirm("템플릿을 변경할까요? 현재 입력값은 기존 템플릿에 보관됩니다.")) {
      renderStep();
      return;
    }
  }
  if (selectedWizardFormTemplate?.templateKey) {
    contentState.templateInputs[selectedWizardFormTemplate.templateKey] = contentState.sectionInputs;
  }
  const result = options.prefetchedResult || await fetchJson(
    `/api/wizard-form-template-public?id=${encodeURIComponent(templateId)}`,
    { cache: "no-store" }
  );
  const nextDefinitions = Array.isArray(result.sections) ? result.sections : [];
  if (!nextDefinitions.length || !nextDefinitions.some((section) => (section.items || []).length)) {
    throw new Error("선택한 템플릿에 Wizard 입력 항목이 없습니다. 관리자에게 템플릿 구성을 요청해 주세요.");
  }
  selectedWizardFormTemplate = result.template;
  const adminSectionOrder = nextDefinitions.map((section) => section.sectionKey);
  const savedSectionOrder = contentState.templateSectionOrders[result.template.templateKey];
  const nextIdentity = layoutIdentityFromTemplateResult(result);
  const sectionOrderResolution = resolveSectionOrderCache({
    savedOrder: savedSectionOrder,
    incomingIdentity: nextIdentity,
    defaultOrder: adminSectionOrder,
  });
  const savedOrder = sectionOrderResolution.resolvedOrder;
  const byKey = new Map(nextDefinitions.map((section) => [section.sectionKey, section]));
  const savedMovable = savedOrder.map((key) => byKey.get(key)).filter(templateSectionCanReorder);
  const movableQueue = [
    ...savedMovable,
    ...nextDefinitions.filter((section) => templateSectionCanReorder(section) && !savedOrder.includes(section.sectionKey)),
  ];
  wizardSectionDefinitions = nextDefinitions.map((section) => (
    templateSectionCanReorder(section) ? movableQueue.shift() : section
  ));
  expandedTemplateSectionKeys = new Set(wizardSectionDefinitions.slice(0, 1).map((section) => section.sectionKey));
  wizardSectionConfigRevision = String(result.configRevision || "");
  wizardLayoutRevision = Number(result.layoutRevision || 1);
  wizardRenderer = result.renderer || { key: "default-promo-renderer", version: 1 };
  wizardLayoutIdentity = nextIdentity;
  wizardBaseSectionOrder = adminSectionOrder;
  wizardBaseLayout = JSON.parse(JSON.stringify(result.defaultLayout || FALLBACK_LAYOUT));
  const savedLayout = contentState.templateLayouts[result.template.templateKey];
  const cacheResolution = resolveLayoutCache({
    savedLayout,
    incomingIdentity: wizardLayoutIdentity,
    defaultLayout: wizardBaseLayout,
  });
  wizardResolvedLayout = cacheResolution.resolvedLayout;
  contentState.formTemplate = {
    ...result.template,
    configRevision: wizardSectionConfigRevision,
    layoutRevision: wizardLayoutRevision,
    renderer: wizardRenderer,
    layoutIdentity: wizardLayoutIdentity,
  };
  contentState.sectionInputs = mergeSectionInputs(
    contentState.templateInputs[result.template.templateKey] || {},
    wizardSectionDefinitions
  );
  contentState.templateInputs[result.template.templateKey] = contentState.sectionInputs;
  contentState.templateLayouts[result.template.templateKey] = {
    contractVersion: LAYOUT_CACHE_CONTRACT_VERSION,
    layoutIdentity: wizardLayoutIdentity,
    layoutRevision: wizardLayoutRevision,
    renderer: wizardRenderer,
    baseLayout: wizardBaseLayout,
    resolvedLayout: wizardResolvedLayout,
  };
  contentState.templateSectionOrders[result.template.templateKey] = {
    contractVersion: LAYOUT_CACHE_CONTRACT_VERSION,
    layoutIdentity: wizardLayoutIdentity,
    baseOrder: [...wizardBaseSectionOrder],
    resolvedOrder: wizardSectionDefinitions.map((section) => section.sectionKey),
  };
  pendingAdminLayoutUpdate = null;
  wizardTemplateRefreshError = "";
  if (!options.fromRefresh) deferredAdminLayoutIdentityKey = "";
  saveWizardContent();
  if (cacheResolution.cacheStatus === "legacy_invalidated") {
    logWizardLayoutEvent("legacy_layout_cache_invalidated", { templateKey: result.template.templateKey });
  } else if (cacheResolution.cacheStatus === "identity_mismatch") {
    logWizardLayoutEvent("layout_identity_mismatch", {
      previousIdentity: layoutIdentityEventSummary(savedLayout?.layoutIdentity),
      nextIdentity: layoutIdentityEventSummary(wizardLayoutIdentity),
    });
  }
  if (sectionOrderResolution.cacheStatus === "legacy_invalidated") {
    logWizardLayoutEvent("legacy_section_order_cache_invalidated", { templateKey: result.template.templateKey });
  } else if (sectionOrderResolution.cacheStatus === "identity_mismatch") {
    logWizardLayoutEvent("admin_section_order_update_applied", {
      applyMode: "identity-reset",
      previousIdentity: layoutIdentityEventSummary(savedSectionOrder?.layoutIdentity),
      nextIdentity: layoutIdentityEventSummary(wizardLayoutIdentity),
    });
  }
  logWizardLayoutEvent("layout_loaded", { sectionCount: wizardSectionDefinitions.length });
}

async function refreshActiveWizardTemplate() {
  if (!selectedWizardFormTemplate || wizardSectionDefinitionsLoading) return false;
  if (wizardTemplateRefreshPromise) return wizardTemplateRefreshPromise;
  const requestId = ++wizardTemplateRefreshRequestId;
  wizardTemplateRefreshPromise = (async () => {
    try {
      const catalogResult = await fetchJson("/api/wizard-form-templates-public", { cache: "no-store" });
      if (requestId !== wizardTemplateRefreshRequestId) return false;
      const activeTemplates = Array.isArray(catalogResult.templates) ? catalogResult.templates : [];
      if (!activeTemplates.length) throw new Error("활성화된 프로모션 템플릿이 없습니다.");
      wizardFormTemplates = activeTemplates;
      const target = activeTemplates.find((template) => template.id === selectedWizardFormTemplate.id)
        || activeTemplates.find((template) => template.templateKey === selectedWizardFormTemplate.templateKey)
        || activeTemplates.find((template) => template.isDefault)
        || activeTemplates[0];
      const detail = await fetchJson(
        `/api/wizard-form-template-public?id=${encodeURIComponent(target.id)}`,
        { cache: "no-store" }
      );
      if (requestId !== wizardTemplateRefreshRequestId) return false;
      const nextIdentity = layoutIdentityFromTemplateResult(detail);
      if (sameLayoutIdentity(wizardLayoutIdentity, nextIdentity)) {
        wizardTemplateRefreshError = "";
        pendingAdminLayoutUpdate = null;
        return false;
      }
      const nextIdentityKey = layoutIdentityKey(nextIdentity);
      if (deferredAdminLayoutIdentityKey === nextIdentityKey) return false;
      const previousIdentity = wizardLayoutIdentity;
      const layoutChanged = hasLayoutOverrides(wizardBaseLayout, wizardResolvedLayout);
      const sectionOrderChanged = !sameSectionOrder(
        wizardBaseSectionOrder,
        wizardSectionDefinitions.map((section) => section.sectionKey)
      );
      const userHasOverrides = layoutChanged || sectionOrderChanged;
      logWizardLayoutEvent("admin_layout_update_detected", {
        previousIdentity: layoutIdentityEventSummary(previousIdentity),
        nextIdentity: layoutIdentityEventSummary(nextIdentity),
        configRevisionChanged: previousIdentity?.configRevision !== nextIdentity?.configRevision,
        userHasOverrides,
        layoutChanged,
        sectionOrderChanged,
      });
      if (!userHasOverrides) {
        await selectWizardFormTemplate(target.id, {
          force: true,
          fromRefresh: true,
          skipConfirmation: true,
          prefetchedResult: detail,
        });
        pendingAdminLayoutUpdate = null;
        wizardTemplateRefreshError = "";
        logWizardLayoutEvent("admin_layout_update_applied", {
          previousIdentity: layoutIdentityEventSummary(previousIdentity),
          nextIdentity: layoutIdentityEventSummary(nextIdentity),
          applyMode: "automatic",
        });
        return true;
      }
      pendingAdminLayoutUpdate = { target, detail, previousIdentity, nextIdentity };
      wizardTemplateRefreshError = "";
      return true;
    } catch (error) {
      wizardTemplateRefreshError = error.message || "관리자 템플릿 변경을 확인하지 못했습니다.";
      return false;
    } finally {
      wizardTemplateRefreshPromise = null;
      if (currentStep === 2) renderStep();
    }
  })();
  return wizardTemplateRefreshPromise;
}

async function applyPendingAdminLayoutUpdate() {
  if (!pendingAdminLayoutUpdate || wizardSectionDefinitionsLoading) return;
  const update = pendingAdminLayoutUpdate;
  wizardSectionDefinitionsLoading = true;
  wizardTemplateSwitchTargetId = update.target.id;
  renderStep();
  try {
    await selectWizardFormTemplate(update.target.id, {
      force: true,
      fromRefresh: true,
      skipConfirmation: true,
      prefetchedResult: update.detail,
    });
    pendingAdminLayoutUpdate = null;
    deferredAdminLayoutIdentityKey = "";
    wizardTemplateRefreshError = "";
    logWizardLayoutEvent("admin_layout_update_applied", {
      previousIdentity: layoutIdentityEventSummary(update.previousIdentity),
      nextIdentity: layoutIdentityEventSummary(update.nextIdentity),
      applyMode: "user-confirmed",
    });
  } catch (error) {
    wizardTemplateRefreshError = error.message || "새 관리자 레이아웃을 적용하지 못했습니다.";
  } finally {
    wizardTemplateSwitchTargetId = "";
    wizardSectionDefinitionsLoading = false;
    renderStep();
  }
}

function deferPendingAdminLayoutUpdate() {
  if (!pendingAdminLayoutUpdate) return;
  deferredAdminLayoutIdentityKey = layoutIdentityKey(pendingAdminLayoutUpdate.nextIdentity);
  logWizardLayoutEvent("admin_layout_update_deferred", {
    previousIdentity: layoutIdentityEventSummary(pendingAdminLayoutUpdate.previousIdentity),
    nextIdentity: layoutIdentityEventSummary(pendingAdminLayoutUpdate.nextIdentity),
  });
  pendingAdminLayoutUpdate = null;
  renderStep();
}

function wizardSectionConfigurationReady() {
  return !wizardSectionDefinitionsLoading
    && !wizardSectionDefinitionsError
    && wizardSectionDefinitions.length > 0;
}

function saveWizardContent() {
  if (selectedWizardFormTemplate?.templateKey) {
    contentState.templateInputs[selectedWizardFormTemplate.templateKey] = contentState.sectionInputs;
    contentState.templateSectionOrders[selectedWizardFormTemplate.templateKey] = {
      contractVersion: LAYOUT_CACHE_CONTRACT_VERSION,
      layoutIdentity: wizardLayoutIdentity,
      baseOrder: [...wizardBaseSectionOrder],
      resolvedOrder: wizardSectionDefinitions.map((section) => section.sectionKey),
    };
    contentState.templateLayouts[selectedWizardFormTemplate.templateKey] = {
      contractVersion: LAYOUT_CACHE_CONTRACT_VERSION,
      layoutIdentity: wizardLayoutIdentity,
      layoutRevision: wizardLayoutRevision,
      renderer: wizardRenderer,
      baseLayout: wizardBaseLayout,
      resolvedLayout: wizardResolvedLayout,
    };
  }
  localStorage.setItem(storageKeys.wizardContent, JSON.stringify(contentState));
}

function wizardLayoutSnapshot() {
  if (!selectedWizardFormTemplate || !wizardResolvedLayout) return null;
  return {
    layoutRevision: wizardLayoutRevision,
    layoutIdentity: wizardLayoutIdentity,
    content: {
      contractVersion: 1,
      formTemplate: { ...contentState.formTemplate },
      sectionSnapshot: wizardSectionDefinitions.map((section) => ({
        ...section,
        items: (section.items || []).map((item) => ({ ...item })),
      })),
      sectionInputs: JSON.parse(JSON.stringify(contentState.sectionInputs)),
      sectionOrder: wizardSectionDefinitions.map((section) => section.sectionKey),
    },
    designSpec: applyCreatePromoAppearance(wizardResolvedLayout),
    assets: { contractVersion: 1, items: {} },
  };
}

function postWizardLayoutSnapshot() {
  const snapshot = wizardLayoutSnapshot();
  if (!snapshot || !wizardLayoutFrame?.contentWindow) return;
  wizardLayoutFrame.contentWindow.postMessage({
    type: "promo-wizard-layout-snapshot",
    snapshot,
  }, window.location.origin);
}

function resetWizardLayout() {
  wizardResolvedLayout = JSON.parse(JSON.stringify(wizardBaseLayout || FALLBACK_LAYOUT));
  const byKey = new Map(wizardSectionDefinitions.map((section) => [section.sectionKey, section]));
  wizardSectionDefinitions = wizardBaseSectionOrder.map((key) => byKey.get(key)).filter(Boolean);
  byKey.forEach((section, key) => {
    if (!wizardBaseSectionOrder.includes(key)) wizardSectionDefinitions.push(section);
  });
  saveWizardContent();
  postWizardLayoutSnapshot();
  logWizardLayoutEvent("admin_layout_reset_with_section_order", { sectionOrderReset: true });
}

function logWizardLayoutEvent(eventName, changeSummary = {}, targetKey = "") {
  const body = {
    clientEventId: `${wizardSessionId}:${eventName}:${Date.now()}:${Math.random().toString(16).slice(2)}`,
    eventName,
    sessionId: wizardSessionId,
    runId: runId() || null,
    formTemplateId: selectedWizardFormTemplate?.id || null,
    templateKey: selectedWizardFormTemplate?.templateKey || "",
    templateVersion: selectedWizardFormTemplate?.version || 1,
    configRevision: wizardSectionConfigRevision,
    layoutRevision: wizardLayoutRevision,
    targetKey,
    changeSummary,
  };
  fetch("/api/wizard-layout-usage-events", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  }).catch(() => {});
}

function autoRegisterPromoOverview() {
  const promo = contentState.promo;
  const brief = contentState.simpleBrief;
  const purpose = promo.promotionPurpose === "기타"
    ? promo.promotionPurposeOther
    : promo.promotionPurpose;
  const summary = [purpose, promo.market, brief.audience, brief.campaignTone]
    .filter((value) => String(value || "").trim())
    .join(" · ");
  let registeredCount = 0;
  let firstTextRegistered = false;

  wizardSectionDefinitions.forEach((section) => {
    (section.items || []).forEach((item) => {
      if (!item.isVisibleInWizard || item.isLocked) return;
      const path = `${section.sectionKey}.${item.itemKey}`;
      const current = valueAtPath(contentState.sectionInputs, path);
      if (item.fieldKind === "text") {
        if (String(current || "").trim()) return;
        const semanticKey = `${item.itemKey} ${item.name} ${item.textType || ""}`.toLowerCase();
        const titleLike = /title|headline|heading|제목|타이틀/.test(semanticKey);
        const nextValue = titleLike || !firstTextRegistered ? promo.title : summary;
        if (!String(nextValue || "").trim()) return;
        setValueAtPath(contentState.sectionInputs, path, nextValue);
        firstTextRegistered = true;
        registeredCount += 1;
        return;
      }
      if (item.fieldKind === "cta") {
        if (String(current?.label || "").trim() || String(current?.link || "").trim()) return;
        setValueAtPath(contentState.sectionInputs, path, {
          label: purpose ? `${purpose} 보기` : "자세히 보기",
          link: "#",
          target: "_self",
        });
        registeredCount += 1;
      }
    });
  });

  saveWizardContent();
  postWizardLayoutSnapshot();
  return registeredCount;
}

window.addEventListener("message", (event) => {
  if (event.origin !== window.location.origin) return;
  if (event.data?.type === "promo-wizard-layout-ready") {
    postWizardLayoutSnapshot();
    return;
  }
  if (event.data?.type === "create-promo-auto-register-request") {
    if (event.data.sectionInputs && typeof event.data.sectionInputs === "object") {
      contentState.sectionInputs = mergeSectionInputs(event.data.sectionInputs);
    }
    const registeredCount = autoRegisterPromoOverview();
    wizardLayoutFrame?.contentWindow?.postMessage({
      type: "create-promo-auto-register-result",
      registeredCount,
    }, window.location.origin);
    return;
  }
  if (event.data?.type !== "promo-wizard-layout-change" || !event.data.designSpec) return;
  const previousTheme = wizardResolvedLayout?.theme || FALLBACK_LAYOUT.theme;
  const incomingLayout = JSON.parse(JSON.stringify(event.data.designSpec));
  wizardResolvedLayout = {
    ...incomingLayout,
    theme: {
      ...(incomingLayout.theme || {}),
      backgroundColor: previousTheme.backgroundColor,
      backgroundImage: previousTheme.backgroundImage || "",
      backgroundImageName: previousTheme.backgroundImageName || "",
      textColor: previousTheme.textColor,
    },
  };
  delete wizardResolvedLayout.theme.ctaColor;
  delete wizardResolvedLayout.theme.ctaShape;
  delete wizardResolvedLayout.theme.ctaVariant;
  if (event.data.sectionInputs && typeof event.data.sectionInputs === "object") {
    contentState.sectionInputs = event.data.sectionInputs;
  }
  saveWizardContent();
  clearTimeout(wizardLayoutLogTimer);
  wizardLayoutLogTimer = setTimeout(() => {
    logWizardLayoutEvent("item_style_changed", {
      itemStyleCount: Object.keys(wizardResolvedLayout?.itemStyles || {}).length,
      sectionStyleCount: Object.keys(wizardResolvedLayout?.sectionStyles || {}).length,
    });
  }, 500);
  postWizardLayoutSnapshot();
});

function templateSectionCanReorder(section) {
  return Boolean(section?.userReorderAllowed && !section?.fixedPosition);
}

function startTemplateSectionDrag(section, event) {
  if (!templateSectionCanReorder(section)) {
    event.preventDefault();
    return;
  }
  draggedTemplateSectionKey = section.sectionKey;
  event.dataTransfer.effectAllowed = "move";
  event.dataTransfer.setData("text/plain", section.sectionKey);
}

function stopTemplateSectionDrag() {
  draggedTemplateSectionKey = "";
  document.querySelectorAll(".wizard-content-accordion.is-drop-target").forEach((section) => {
    section.classList.remove("is-drop-target");
  });
}

function reorderTemplateSection(sourceKey, targetKey) {
  if (!sourceKey || sourceKey === targetKey) return false;
  const movable = wizardSectionDefinitions.filter(templateSectionCanReorder);
  const sourceIndex = movable.findIndex((section) => section.sectionKey === sourceKey);
  const targetIndex = movable.findIndex((section) => section.sectionKey === targetKey);
  if (sourceIndex < 0 || targetIndex < 0) return false;
  const [source] = movable.splice(sourceIndex, 1);
  movable.splice(targetIndex, 0, source);
  const queue = [...movable];
  wizardSectionDefinitions = wizardSectionDefinitions.map((section) => (
    templateSectionCanReorder(section) ? queue.shift() : section
  ));
  saveWizardContent();
  renderStep();
  return true;
}

function dropTemplateSection(targetSection, event) {
  event.preventDefault();
  const sourceKey = draggedTemplateSectionKey;
  stopTemplateSectionDrag();
  if (!templateSectionCanReorder(targetSection)) return;
  reorderTemplateSection(sourceKey, targetSection.sectionKey);
}

function moveTemplateSectionByKeyboard(sectionKey, direction) {
  const movable = wizardSectionDefinitions.filter(templateSectionCanReorder);
  const sourceIndex = movable.findIndex((section) => section.sectionKey === sectionKey);
  const target = movable[sourceIndex + direction];
  if (sourceIndex < 0 || !target) return;
  reorderTemplateSection(sectionKey, target.sectionKey);
}

function loadWizardRun() {
  try {
    const saved = JSON.parse(localStorage.getItem(storageKeys.wizardRun) || "null");
    return saved && typeof saved === "object" ? saved : null;
  } catch {
    return null;
  }
}

function saveWizardRun(state) {
  runState = state || null;
  if (runState) {
    localStorage.setItem(storageKeys.wizardRun, JSON.stringify(runState));
  } else {
    localStorage.removeItem(storageKeys.wizardRun);
  }
}

function mergeQueuedFinalDesign(finalDesign) {
  if (!finalDesign?.finalDesignId || !runState) return;
  const existing = Array.isArray(runState.finalDesigns) ? runState.finalDesigns : [];
  const exists = existing.some((item) => item.finalDesignId === finalDesign.finalDesignId);
  const nextState = {
    ...runState,
    finalDesigns: exists ? existing : [finalDesign, ...existing],
  };
  if (nextState.run) {
    nextState.run = {
      ...nextState.run,
      stage: "final_design",
      status: finalDesign.status === "trigger_failed" ? "final_design_trigger_failed" : "final_design_queued",
    };
  }
  saveWizardRun(nextState);
  selectedFinalPreviewDesignId = finalDesign.finalDesignId;
}

function selectedDocument() {
  return designDocuments.find((doc) => doc.id === selectedDocumentId) || designDocuments[0] || null;
}

function tagsForDocument(doc) {
  return [
    doc?.styleClassification?.primaryGroup,
    ...(Array.isArray(doc?.styleClassification?.styleTags) ? doc.styleClassification.styleTags : []),
    doc?.styleClassification?.layoutModel,
    doc?.styleClassification?.colorMode,
    doc?.styleClassification?.typographyTone,
  ].filter(Boolean);
}

function conceptSummary(doc) {
  return doc?.designConcept?.summary || doc?.styleClassification?.rationale || "Design MD concept summary is not available.";
}

function compactCount(value) {
  const number = Number(value || 0);
  return Number.isFinite(number) ? number.toLocaleString() : "0";
}

function selectDocument(id) {
  selectedDocumentId = id;
  localStorage.setItem(storageKeys.selectedDocumentId, id);
  saveWizardRun(null);
  runError = "";
  currentStep = 2;
  renderStep();
}

function conceptThumbnailUrl(doc) {
  const suppliedUrl = [doc?.thumbnailUrl, doc?.thumbnail_url, doc?.coverImageUrl, doc?.previewImageUrl]
    .find((value) => /^(https?:\/\/|\/|data:image\/|blob:)/i.test(String(value || "")));
  if (suppliedUrl) return suppliedUrl;

  const groupValue = doc?.styleClassification?.primaryGroup;
  const group = typeof groupValue === "string" ? groupValue : groupValue?.slug;
  const images = {
    dense_systematic: "assets/concept-thumbnails/dense-systematic.jpg",
    premium_editorial: "assets/concept-thumbnails/premium-editorial.jpg",
    high_impact_promo: "assets/concept-thumbnails/high-impact-promo.jpg",
    playful_immersive: "assets/concept-thumbnails/playful-immersive.jpg",
    minimal_product: "assets/concept-thumbnails/minimal-product.jpg",
    content_rich_commerce: "assets/concept-thumbnails/content-rich-commerce.jpg",
    unclassified: "assets/concept-thumbnails/unclassified.jpg",
  };
  return images[group] || images.unclassified;
}

function createConceptCard(doc) {
  const selected = doc.id === selectedDocumentId;
  const card = document.createElement("article");
  card.className = `concept-card${selected ? " is-selected" : ""}`;

  const thumbnail = document.createElement("span");
  thumbnail.className = "concept-thumbnail";
  const image = document.createElement("img");
  const fallbackUrl = conceptThumbnailUrl({
    styleClassification: doc?.styleClassification,
  });
  image.src = conceptThumbnailUrl(doc);
  image.alt = `${doc.brandName || doc.slug || "Design MD"} 테마 미리보기`;
  image.loading = "lazy";
  image.addEventListener("error", () => {
    if (image.src !== fallbackUrl) image.src = fallbackUrl;
  }, { once: true });
  thumbnail.append(image);

  const header = document.createElement("span");
  header.className = "concept-card-header";

  const brand = document.createElement("strong");
  brand.textContent = doc.brandName || doc.slug || "Untitled Design MD";

  header.append(brand);

  const summary = document.createElement("span");
  summary.className = "concept-card-summary";
  summary.textContent = conceptSummary(doc);

  const meta = document.createElement("span");
  meta.className = "concept-card-meta";
  meta.textContent = [
    `${compactCount(doc.summary?.tokenCount)} tokens`,
    `${compactCount(doc.summary?.componentPatternCount)} components`,
    `${compactCount(doc.summary?.layoutPatternCount)} layouts`,
  ].join(" · ");

  const tags = document.createElement("span");
  tags.className = "concept-tags";
  tagsForDocument(doc)
    .slice(0, 4)
    .forEach((tag) => {
      const item = document.createElement("em");
      item.textContent = tag;
      tags.append(item);
    });

  const select = document.createElement("button");
  select.className = "concept-select-action";
  select.type = "button";
  select.textContent = selected ? "선택됨 · Content로 이동" : "선택";
  select.addEventListener("click", () => selectDocument(doc.id));

  card.append(thumbnail, header, summary, meta, tags, select);
  return card;
}

function appendTextElement(parent, tagName, className, text) {
  const element = document.createElement(tagName);
  if (className) element.className = className;
  element.textContent = text;
  parent.append(element);
  return element;
}

function fieldValue(group, key) {
  return contentState[group]?.[key] || "";
}

function valueAtPath(source, path) {
  return String(path || "")
    .split(".")
    .filter(Boolean)
    .reduce((value, key) => value?.[key], source);
}

function setValueAtPath(source, path, value) {
  const parts = String(path || "").split(".").filter(Boolean);
  if (!parts.length) return;
  let target = source;
  parts.slice(0, -1).forEach((part) => {
    if (!target[part] || typeof target[part] !== "object") target[part] = {};
    target = target[part];
  });
  target[parts[parts.length - 1]] = value;
}

function setFieldValue(group, key, value) {
  contentState[group][key] = value;
  if (validationErrors[key] && String(value || "").trim()) delete validationErrors[key];
  if (key === "promotionPurpose" && value !== "기타") {
    contentState.promo.promotionPurposeOther = "";
    delete validationErrors.promotionPurposeOther;
  }
  saveWizardContent();
  saveWizardRun(null);
  runError = "";
}

function setSectionValue(path, value) {
  setValueAtPath(contentState.sectionInputs, path, value);
  saveWizardContent();
  saveWizardRun(null);
  runError = "";
  postWizardLayoutSnapshot();
}

function fieldInvalid(key) {
  return Boolean(validationErrors[key]);
}

function createField({ group, key, label, type = "text", placeholder = "입력해 주세요", required = false, options = null, rows = 3 }) {
  const wrapper = document.createElement("label");
  wrapper.className = `content-field${fieldInvalid(key) ? " is-invalid" : ""}`;
  wrapper.dataset.fieldKey = key;

  const caption = document.createElement("span");
  caption.textContent = required ? `${label} *` : label;
  wrapper.append(caption);

  let control;
  if (options) {
    control = document.createElement("select");
    const empty = document.createElement("option");
    empty.value = "";
    empty.disabled = true;
    empty.textContent = "선택해 주세요";
    control.append(empty);
    options.forEach((optionValue) => {
      const option = document.createElement("option");
      option.value = optionValue;
      option.textContent = optionValue;
      control.append(option);
    });
  } else if (type === "textarea") {
    control = document.createElement("textarea");
    control.rows = rows;
    control.placeholder = placeholder;
  } else {
    control = document.createElement("input");
    control.type = type;
    control.placeholder = placeholder;
    control.autocomplete = "off";
  }

  control.value = fieldValue(group, key);
  if (options) {
    control.addEventListener("change", (event) => {
      setFieldValue(group, key, event.target.value);
      if (key === "promotionPurpose") renderStep();
    });
  } else {
    control.addEventListener("input", (event) => setFieldValue(group, key, event.target.value));
  }
  wrapper.append(control);

  if (fieldInvalid(key)) {
    appendTextElement(wrapper, "small", "content-field-error", "입력해 주세요");
  }

  return wrapper;
}

function createSectionField({ path, label, type = "text", placeholder = "입력해 주세요", rows = 3 }) {
  const wrapper = document.createElement("label");
  wrapper.className = "content-field";

  const caption = document.createElement("span");
  caption.textContent = label;
  wrapper.append(caption);

  const control = type === "textarea" ? document.createElement("textarea") : document.createElement("input");
  if (type === "textarea") {
    control.rows = rows;
  } else {
    control.type = type;
    control.autocomplete = "off";
  }
  control.placeholder = placeholder;
  control.value = valueAtPath(contentState.sectionInputs, path) || "";
  control.addEventListener("input", (event) => {
    setSectionValue(path, event.target.value);
  });
  wrapper.append(control);
  return wrapper;
}

function createSectionInputSection(titleText, fields) {
  const section = document.createElement("article");
  section.className = "content-form-section";
  appendTextElement(section, "h3", "", titleText);

  const grid = document.createElement("div");
  grid.className = "content-form-grid";
  fields.forEach((field) => grid.append(createSectionField(field)));
  section.append(grid);
  return section;
}

// One admin-defined section item -> one input control. Dispatches by
// fieldKind since text/image/cta items store different shaped values under
// contentState.sectionInputs[sectionKey][itemKey].
function createDynamicSectionField(sectionKey, item) {
  if (item.isLocked) return createLockedSectionField(sectionKey, item);
  if (item.fieldKind === "cta") return createCtaSectionField(sectionKey, item);
  if (item.fieldKind === "image") return createImageSectionField(sectionKey, item);

  const isMulti = item.textType === "multi";
  return createSectionField({
    path: `${sectionKey}.${item.itemKey}`,
    label: item.isRequired ? `${item.name} *` : item.name,
    type: isMulti ? "textarea" : "text",
    rows: isMulti ? 4 : undefined,
  });
}

function createLockedSectionField(sectionKey, item) {
  const wrapper = document.createElement("div");
  wrapper.className = "content-field";
  appendTextElement(wrapper, "span", "", `${item.name} (관리자 고정값)`);
  const value = valueAtPath(contentState.sectionInputs, `${sectionKey}.${item.itemKey}`);
  const display = document.createElement("div");
  display.className = "locked-field-value";
  display.textContent = item.fieldKind === "text"
    ? (String(value || "") || "-")
    : JSON.stringify(value ?? {}, null, 0);
  wrapper.append(display);
  return wrapper;
}

function createCtaSectionField(sectionKey, item) {
  const wrapper = document.createElement("div");
  wrapper.className = "content-field";
  appendTextElement(wrapper, "span", "", item.isRequired ? `${item.name} *` : item.name);

  const grid = document.createElement("div");
  grid.className = "content-form-grid";
  grid.append(
    createSectionField({ path: `${sectionKey}.${item.itemKey}.label`, label: "버튼 텍스트" }),
    createSectionField({ path: `${sectionKey}.${item.itemKey}.link`, label: "버튼 URL", type: "url", placeholder: "https://..." })
  );
  wrapper.append(grid);
  return wrapper;
}

function createImageSectionField(sectionKey, item) {
  const wrapper = document.createElement("div");
  wrapper.className = "content-field";
  appendTextElement(wrapper, "span", "", item.isRequired ? `${item.name} *` : item.name);

  const sources = Array.isArray(item.image?.allowedSources) && item.image.allowedSources.length
    ? item.image.allowedSources
    : ["url"];
  const sourceLabels = { file: "파일첨부", url: "URL첨부", ai: "AI 생성" };
  const path = `${sectionKey}.${item.itemKey}`;

  if (sources.length > 1) {
    const select = document.createElement("select");
    sources.forEach((source) => {
      const option = document.createElement("option");
      option.value = source;
      option.textContent = sourceLabels[source] || source;
      select.append(option);
    });
    select.value = valueAtPath(contentState.sectionInputs, `${path}.source`) || sources[0];
    select.addEventListener("change", (event) => setSectionValue(`${path}.source`, event.target.value));
    wrapper.append(select);
  } else {
    setValueAtPath(contentState.sectionInputs, `${path}.source`, sources[0]);
  }

  wrapper.append(createSectionField({
    path: `${path}.value`,
    label: sources.includes("ai") ? "이미지 URL 또는 AI 생성 설명" : "이미지 URL",
    type: "text",
    placeholder: item.image?.promptText || "https://... 또는 이미지 설명",
  }));

  if (item.image?.descriptionEnabled) {
    wrapper.append(createSectionField({
      path: `${path}.description`,
      label: "이미지 설명",
      type: "textarea",
      placeholder: "이미지와 함께 표시할 설명을 입력하세요",
    }));
  }

  if (item.image?.altTextRequired) {
    wrapper.append(createSectionField({ path: `${path}.alt`, label: "대체 텍스트 (alt)" }));
  }

  return wrapper;
}

// Every visible, required item across the fixed fields and the admin-managed
// dynamic sections must be filled before Create Promo Step 3 can advance.
function contentErrors() {
  const errors = {};
  if (!wizardSectionConfigurationReady()) errors.sectionConfiguration = true;
  const required = [
    ["title", contentState.promo.title],
    ["promotionPurpose", contentState.promo.promotionPurpose],
    ["market", contentState.promo.market],
    ["audience", contentState.simpleBrief.audience],
    ["campaignTone", contentState.simpleBrief.campaignTone],
  ];
  if (contentState.promo.promotionPurpose === "기타") {
    required.push(["promotionPurposeOther", contentState.promo.promotionPurposeOther]);
  }
  required.forEach(([key, value]) => {
    if (!String(value || "").trim()) errors[key] = true;
  });

  // Template content registration is no longer part of Step 3. Empty dynamic
  // Section/Item values are allowed in Web Output and may be completed by the
  // later AI/generation flow. Keep configuration readiness validation above,
  // but do not block navigation on fields that are no longer editable here.

  return errors;
}

// Coverage checklist rows for the admin-managed sections (used by both the
// Step 3 sidebar and the future Web Output snapshot).
function dynamicCoverageRows() {
  const rows = [];
  wizardSectionDefinitions.forEach((section) => {
    (section.items || []).forEach((item) => {
      if (!item.isRequired) return;
      const value = valueAtPath(contentState.sectionInputs, `${section.sectionKey}.${item.itemKey}`);
      const display = item.fieldKind === "cta"
        ? value?.label
        : item.fieldKind === "image"
          ? value?.value
          : value;
      rows.push([`${section.name} · ${item.name}`, display]);
    });
  });
  return rows;
}

function validateContentStep() {
  validationErrors = contentErrors();
  return !Object.keys(validationErrors).length;
}

function promotionOverviewErrors() {
  const errors = {};
  [
    ["title", contentState.promo.title],
    ["promotionPurpose", contentState.promo.promotionPurpose],
    ["market", contentState.promo.market],
    ["audience", contentState.simpleBrief.audience],
    ["campaignTone", contentState.simpleBrief.campaignTone],
  ].forEach(([key, value]) => {
    if (!String(value || "").trim()) errors[key] = true;
  });
  if (contentState.promo.promotionPurpose === "기타"
    && !String(contentState.promo.promotionPurposeOther || "").trim()) {
    errors.promotionPurposeOther = true;
  }
  return errors;
}

function setContentSubstep(nextSubstep, { validate = true } = {}) {
  if (!CONTENT_SUBSTEPS.includes(nextSubstep)) return false;
  const nextIndex = CONTENT_SUBSTEPS.indexOf(nextSubstep);
  if (validate && nextIndex > 0) {
    const overviewErrors = promotionOverviewErrors();
    if (Object.keys(overviewErrors).length) {
      validationErrors = overviewErrors;
      contentSubstep = "overview";
      sessionStorage.setItem(CONTENT_SUBSTEP_STORAGE_KEY, contentSubstep);
      renderStep();
      return false;
    }
  }
  if (validate && nextIndex > 1 && !wizardSectionConfigurationReady()) {
    validationErrors = { sectionConfiguration: true };
    contentSubstep = "template";
    sessionStorage.setItem(CONTENT_SUBSTEP_STORAGE_KEY, contentSubstep);
    renderStep();
    return false;
  }
  validationErrors = {};
  contentSubstep = nextSubstep;
  sessionStorage.setItem(CONTENT_SUBSTEP_STORAGE_KEY, contentSubstep);
  renderStep();
  if (contentSubstep === "layout") refreshActiveWizardTemplate();
  return true;
}

function createWebOutputSnapshot() {
  const snapshot = wizardLayoutSnapshot();
  if (!snapshot) return null;
  return { ...snapshot, contractVersion: 1, createdAt: new Date().toISOString() };
}

function goToWebOutput() {
  if (pendingAdminLayoutUpdate) {
    wizardTemplateRefreshError = "관리자 레이아웃 변경 사항을 적용하거나 현재 작업 유지를 선택한 후 Web Output을 확인해 주세요.";
    contentSubstep = "layout";
    sessionStorage.setItem(CONTENT_SUBSTEP_STORAGE_KEY, contentSubstep);
    renderStep();
    return false;
  }
  if (!validateContentStep()) {
    contentSubstep = Object.keys(promotionOverviewErrors()).length ? "overview" : "layout";
    sessionStorage.setItem(CONTENT_SUBSTEP_STORAGE_KEY, contentSubstep);
    renderStep();
    return false;
  }
  const snapshot = createWebOutputSnapshot();
  if (!snapshot) {
    wizardTemplateRefreshError = "Web Output Snapshot을 생성할 수 없습니다. 템플릿과 레이아웃을 다시 확인해 주세요.";
    contentSubstep = "layout";
    renderStep();
    return false;
  }
  localStorage.setItem(WEB_OUTPUT_SNAPSHOT_STORAGE_KEY, JSON.stringify(snapshot));
  saveWizardContent();
  currentStep = 3;
  renderStep();
  return true;
}

function autofillContent() {
  const terms = "Players must be aged 18+ to participate. Promotion terms and conditions apply. Please play responsibly.";
  contentState.promo = {
    ...contentState.promo,
    title: "Weekend Welcome Bonus",
    promotionPurpose: "이벤트",
    market: "Global",
    leadText: "Claim a limited-time welcome package",
    ctaLabel: "Join Now",
    ctaUrl: "https://www.ggpoker.com/promotions/",
    subline: "Start strong with boosted rewards and clear next steps.",
    alphaText: "18+ | Terms apply",
    termsText: terms,
  };
  contentState.simpleBrief = {
    mainOffer: "Limited-time welcome bonus for new players",
    targetAction: "Register and claim the offer",
    audience: "신규",
    campaignTone: "긴급함",
    secondaryMessage: "A clear promotional flow from offer discovery to CTA conversion.",
  };
  // Field names below match the admin-managed section item keys (see
  // db/migrations/016_wizard_content_sections.sql seed data), not the old
  // hardcoded logoText/leaderText/ctaLabel style. mergeSectionInputs() drops
  // anything an admin has since renamed or removed, and skips locked items.
  contentState.sectionInputs = mergeSectionInputs({
    header: {
      logo: "GGPoker logo",
      badges: "Welcome Bonus, 18+, Responsible Gaming",
    },
    heroBanner: {
      leadText: "Limited-time welcome package",
      title: "Weekend Welcome Bonus",
      sublineText: "Start strong with boosted rewards and clear next steps.",
      button: { label: "Join Now", link: "https://www.ggpoker.com/promotions/", target: "_blank" },
      alphaText: "18+ | Terms apply",
    },
    stepBar: {
      title: "Register",
      description: "Create or sign in to your GGPoker account, opt in, and claim your reward before the promotion ends.",
      ctaButton: { label: "Join Now", link: "https://www.ggpoker.com/promotions/", target: "_blank" },
    },
    contentCta: {
      title: "Limited-time welcome bonus for new players",
      description: "A clear promotional flow from offer discovery to CTA conversion.",
      image: { source: "url", value: "Dynamic poker table with bonus chips and weekend event energy", alt: "" },
      button: { label: "Join Now", link: "https://www.ggpoker.com/promotions/", target: "_blank" },
    },
    imageTextRow: {
      image: { source: "url", value: "Secure poker platform visual", alt: "" },
      title: "Your safety comes first",
      description: "Play on a trusted platform with clear responsible gaming guidance.",
    },
    titleDescription: {
      title: "Terms and Conditions",
      contents: terms,
    },
    footer: {
      logo: "GGPoker logo",
      licenseBadges: "Visa, Mastercard, 18+, BeGambleAware",
      content: terms,
    },
  });
  wizardSectionDefinitions.forEach((section) => {
    (section.items || []).forEach((item) => {
      if (item.isLocked) return;
      const path = `${section.sectionKey}.${item.itemKey}`;
      const current = valueAtPath(contentState.sectionInputs, path);
      if (item.fieldKind === "cta" && !String(current?.label || "").trim()) {
        setValueAtPath(contentState.sectionInputs, path, { label: item.name, link: "https://example.com/", target: "_blank" });
      } else if (item.fieldKind === "image" && !String(current?.value || "").trim()) {
        const source = item.image?.allowedSources?.[0] || "url";
        setValueAtPath(contentState.sectionInputs, path, { source, value: `${item.name} image`, description: "", alt: item.name });
      } else if (item.fieldKind === "text" && !String(current || "").trim()) {
        setValueAtPath(contentState.sectionInputs, path, `${item.name} sample content`);
      }
    });
  });
  validationErrors = {};
  saveWizardContent();
  saveWizardRun(null);
  runError = "";
  renderStep();
}

function resetContent() {
  const empty = defaultWizardContent();
  contentState.promo = empty.promo;
  contentState.simpleBrief = empty.simpleBrief;
  // defaultWizardContent().sectionInputs is intentionally {} (see comment
  // there); rebuild it from the current admin-managed definitions so locked
  // items keep their fixed values instead of disappearing after a reset.
  contentState.sectionInputs = defaultSectionInputsFromDefinitions(wizardSectionDefinitions);
  contentState.sectionDesignRuns = {};
  validationErrors = {};
  saveWizardContent();
  saveWizardRun(null);
  runError = "";
  renderStep();
}

function sectionAiRun(sectionKey) {
  return contentState.sectionDesignRuns?.[sectionKey] || null;
}

function sectionAiHasContent(sectionKey) {
  const values = [];
  const collect = (input) => {
    if (input === null || input === undefined) return;
    if (typeof input === "string" || typeof input === "number") {
      if (String(input).trim()) values.push(String(input).trim());
    } else if (Array.isArray(input)) input.forEach(collect);
    else if (typeof input === "object") Object.values(input).forEach(collect);
  };
  collect(contentState.sectionInputs?.[sectionKey]);
  return values.some((item) => item.length >= 2);
}

function sectionAiSupportsImage(section) {
  return (section.items || []).some((item) => item.fieldKind === "image" && item.isVisibleInWizard !== false);
}

function saveSectionAiRun(sectionKey, run, sourceInputs) {
  contentState.sectionDesignRuns = contentState.sectionDesignRuns || {};
  contentState.sectionDesignRuns[sectionKey] = {
    ...run,
    sourceInputs: JSON.parse(JSON.stringify(sourceInputs || {})),
  };
  saveWizardContent();
}

function sectionAiIsStale(sectionKey, saved = sectionAiRun(sectionKey)) {
  if (!saved?.sourceInputs) return false;
  return JSON.stringify(saved.sourceInputs) !== JSON.stringify(contentState.sectionInputs?.[sectionKey] || {});
}

async function generateSectionAiDesign(section) {
  const sectionKey = section.sectionKey;
  const sectionInputs = JSON.parse(JSON.stringify(contentState.sectionInputs?.[sectionKey] || {}));
  saveSectionAiRun(sectionKey, { status: "queued" }, sectionInputs);
  renderStep();
  try {
    const created = await fetchJson("/api/promo-section-design-runs", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        promoRunId: runId() || null,
        formTemplateId: selectedWizardFormTemplate?.id,
        sectionKey,
        sectionInputs,
      }),
    });
    saveSectionAiRun(sectionKey, created.run, sectionInputs);
    renderStep();
    if (["ready", "applied"].includes(created.run.status)) return;
    const processed = await fetchJson("/api/promo-section-design-process", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ runId: created.run.id }),
    });
    saveSectionAiRun(sectionKey, processed.run, sectionInputs);
  } catch (error) {
    contentState.sectionDesignRuns[sectionKey] = {
      ...contentState.sectionDesignRuns[sectionKey],
      status: "failed",
      errorMessage: error.message || "섹션 AI 디자인 생성에 실패했습니다.",
    };
    saveWizardContent();
  } finally {
    renderStep();
  }
}

async function applySectionAiDesign(section, saved) {
  if (!saved?.id || !saved.layoutResult?.layoutPatch) return;
  if (sectionAiIsStale(section.sectionKey, saved)) {
    window.alert("섹션 콘텐츠가 생성 시점과 달라졌습니다. AI 디자인을 다시 생성해 주세요.");
    return;
  }
  try {
    const result = await fetchJson("/api/promo-section-design-apply", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        runId: saved.id,
        sectionInputs: contentState.sectionInputs?.[section.sectionKey] || {},
      }),
    });
    const patch = saved.layoutResult.layoutPatch;
    wizardResolvedLayout = wizardResolvedLayout || JSON.parse(JSON.stringify(wizardBaseLayout || FALLBACK_LAYOUT));
    wizardResolvedLayout.sectionStyles = { ...(wizardResolvedLayout.sectionStyles || {}) };
    Object.entries(patch.sectionStyles || {}).forEach(([key, value]) => {
      wizardResolvedLayout.sectionStyles[key] = { ...(wizardResolvedLayout.sectionStyles[key] || {}), ...(value || {}) };
    });
    wizardResolvedLayout.itemStyles = { ...(wizardResolvedLayout.itemStyles || {}) };
    Object.entries(patch.itemStyles || {}).forEach(([key, value]) => {
      wizardResolvedLayout.itemStyles[key] = { ...(wizardResolvedLayout.itemStyles[key] || {}), ...(value || {}) };
    });
    if (saved.imageResult?.itemKey && saved.imageResult?.proxyUrl) {
      const imageItem = (section.items || []).find((item) => item.itemKey === saved.imageResult.itemKey);
      if (imageItem && !imageItem.isLocked) {
        setValueAtPath(contentState.sectionInputs, `${section.sectionKey}.${imageItem.itemKey}`, {
          source: "ai",
          value: saved.imageResult.proxyUrl,
          description: saved.layoutResult?.imageRequest?.prompt || "AI generated section image",
          alt: `${section.name || section.sectionKey} visual`,
        });
      }
    }
    saveSectionAiRun(section.sectionKey, result.run, contentState.sectionInputs?.[section.sectionKey]);
    postWizardLayoutSnapshot();
    renderStep();
  } catch (error) {
    window.alert(error.message || "AI 디자인을 적용하지 못했습니다.");
  }
}

function createSectionAiDesignPanel() {
  const panel = document.createElement("section");
  panel.className = "section-ai-design-panel";
  const heading = document.createElement("div");
  heading.className = "section-ai-design-panel__heading";
  appendTextElement(heading, "span", "eyebrow", "AI Section Design");
  appendTextElement(heading, "strong", "", "등록된 콘텐츠로 섹션 레이아웃과 이미지를 생성합니다.");
  appendTextElement(heading, "small", "", "텍스트와 CTA는 실제 웹 콘텐츠로 유지되며 이미지는 지정된 이미지 항목에만 적용됩니다.");
  panel.append(heading);
  const list = document.createElement("div");
  list.className = "section-ai-design-list";
  const supported = wizardSectionDefinitions.filter(sectionAiSupportsImage);
  if (!supported.length) appendTextElement(list, "p", "section-ai-design-empty", "이미지 항목이 포함된 섹션이 없습니다.");
  supported.forEach((section) => {
    const saved = sectionAiRun(section.sectionKey);
    const stale = sectionAiIsStale(section.sectionKey, saved);
    const processing = ["queued", "analyzing_content", "generating_layout", "validating_layout", "generating_assets", "validating_assets"].includes(saved?.status);
    const card = document.createElement("article");
    card.className = "section-ai-design-card";
    const copy = document.createElement("div");
    appendTextElement(copy, "strong", "", section.name || section.sectionKey);
    appendTextElement(copy, "small", "", stale ? "콘텐츠가 변경되어 재생성이 필요합니다." : saved?.errorMessage || saved?.status || "생성 전");
    if (saved?.imageResult?.proxyUrl) {
      const image = document.createElement("img");
      image.src = saved.imageResult.proxyUrl;
      image.alt = `${section.name || section.sectionKey} AI 미리보기`;
      image.className = "section-ai-design-card__image";
      copy.append(image);
    }
    const actions = document.createElement("div");
    actions.className = "section-ai-design-card__actions";
    const generate = document.createElement("button");
    generate.type = "button";
    generate.className = "secondary-action";
    generate.textContent = processing ? "AI 생성 중" : ["ready", "applied"].includes(saved?.status) ? "재생성" : "AI 디자인 생성";
    generate.disabled = processing || !sectionAiHasContent(section.sectionKey);
    generate.title = generate.disabled && !processing ? "섹션 콘텐츠를 먼저 등록해 주세요." : "";
    generate.addEventListener("click", () => generateSectionAiDesign(section));
    actions.append(generate);
    if (saved?.status === "ready" && !stale) {
      const apply = document.createElement("button");
      apply.type = "button";
      apply.className = "secondary-action is-primary";
      apply.textContent = "레이아웃 및 이미지 적용";
      apply.addEventListener("click", () => applySectionAiDesign(section, saved));
      actions.append(apply);
    }
    card.append(copy, actions);
    list.append(card);
  });
  panel.append(list);
  return panel;
}

function createContentSection(titleText, fields) {
  const section = document.createElement("article");
  section.className = "content-form-section";
  appendTextElement(section, "h3", "", titleText);

  const grid = document.createElement("div");
  grid.className = "content-form-grid";
  fields.forEach((field) => grid.append(createField(field)));
  section.append(grid);
  return section;
}

function renderContentStep() {
  placeholders.className = "content-form-layout create-promo-content-layout";
  placeholders.innerHTML = "";

  const overview = createContentSection("1. 프로모션 개요", [
    { group: "promo", key: "title", label: "프로모션 제목", required: true },
    { group: "promo", key: "promotionPurpose", label: "프로모션 목적", required: true, options: ["할인쿠폰", "경품", "이벤트", "기타"] },
    { group: "promo", key: "promotionPurposeOther", label: "기타 목적", required: contentState.promo.promotionPurpose === "기타" },
    { group: "promo", key: "market", label: "마켓 / 지역", required: true, placeholder: "Global, KR, Ontario..." },
    { group: "simpleBrief", key: "audience", label: "대상 고객", required: true, options: ["신규", "기존고객", "일반고객"] },
    { group: "simpleBrief", key: "campaignTone", label: "캠페인 톤", required: true, options: ["활기찬", "진중함", "럭셔리", "프리미엄", "긴급함", "친근함"] },
  ]);

  if (contentState.promo.promotionPurpose !== "기타") {
    const otherField = overview.querySelector('[data-field-key="promotionPurposeOther"]');
    if (otherField) otherField.hidden = true;
  }

  const templateSection = document.createElement("article");
  templateSection.className = "content-form-section";
  appendTextElement(templateSection, "h3", "", "2. 프로모션 템플릿 선택");
  const templateTiles = document.createElement("div");
  templateTiles.className = "wizard-template-tiles";
  wizardFormTemplates.forEach((template) => {
    const tile = document.createElement("button");
    tile.type = "button";
    tile.className = `wizard-template-tile${selectedWizardFormTemplate?.id === template.id ? " is-selected" : ""}`;
    tile.disabled = wizardSectionDefinitionsLoading;
    tile.setAttribute("aria-pressed", String(selectedWizardFormTemplate?.id === template.id));
    tile.setAttribute("aria-busy", String(wizardTemplateSwitchTargetId === template.id));
    const heading = document.createElement("span");
    appendTextElement(heading, "strong", "", template.name);
    if (template.isDefault) appendTextElement(heading, "em", "wizard-template-default", "기본");
    tile.append(heading);
    appendTextElement(tile, "small", "", template.description || "프로모션 콘텐츠 템플릿");
    appendTextElement(tile, "code", "", `${template.templateKey} · v${template.version}`);
    tile.addEventListener("click", async () => {
      if (wizardSectionDefinitionsLoading || selectedWizardFormTemplate?.id === template.id) return;
      wizardTemplateSwitchTargetId = template.id;
      wizardSectionDefinitionsLoading = true;
      renderStep();
      try {
        await selectWizardFormTemplate(template.id);
        wizardSectionDefinitionsError = "";
      } catch (error) {
        wizardSectionDefinitionsError = error.message || "템플릿을 불러오지 못했습니다.";
      } finally {
        wizardTemplateSwitchTargetId = "";
        wizardSectionDefinitionsLoading = false;
        renderStep();
      }
    });
    templateTiles.append(tile);
  });
  templateSection.append(templateTiles);
  if (wizardSectionDefinitionsLoading) {
    const loadingTemplate = wizardFormTemplates.find((template) => template.id === wizardTemplateSwitchTargetId);
    const templateLoadingStatus = document.createElement("div");
    templateLoadingStatus.className = "wizard-template-loading-status";
    templateLoadingStatus.setAttribute("role", "status");
    templateLoadingStatus.setAttribute("aria-live", "polite");
    const spinner = document.createElement("span");
    spinner.className = "wizard-template-loading-spinner";
    spinner.setAttribute("aria-hidden", "true");
    templateLoadingStatus.append(spinner, document.createTextNode(
      loadingTemplate ? `${loadingTemplate.name} 템플릿을 불러오는 중입니다.` : "템플릿 구성을 불러오는 중입니다."
    ));
    templateSection.append(templateLoadingStatus);
  }

  // Sections 4+ (Header, Hero Banner, Step Bar, Content CTA, Image Text Row,
  // Title and Description, Footer by default) are admin-managed. See
  // Admin Page "C. Wizard Content Sections 관리" / api/wizard-content-sections.js.
  const dynamicSections = [];
  if (wizardSectionDefinitionsLoading && !wizardSectionDefinitions.length) {
    const loading = document.createElement("article");
    loading.className = "placeholder-card";
    appendTextElement(loading, "strong", "", "콘텐츠 섹션 구성을 불러오는 중입니다");
    dynamicSections.push(loading);
  } else if (wizardSectionDefinitionsError) {
    const error = document.createElement("article");
    error.className = "placeholder-card";
    appendTextElement(error, "strong", "", "콘텐츠 섹션 구성을 불러오지 못했습니다");
    appendTextElement(error, "span", "", wizardSectionDefinitionsError);
    const retry = document.createElement("button");
    retry.className = "secondary-action";
    retry.type = "button";
    retry.textContent = "구성 다시 불러오기";
    retry.addEventListener("click", loadWizardSectionDefinitions);
    error.append(retry);
    dynamicSections.push(error);
  } else {
    wizardSectionDefinitions.forEach((section) => {
      const visibleItems = (section.items || []).filter((item) => item.isVisibleInWizard);
      if (!visibleItems.length) return;
      const sectionEl = document.createElement("article");
      sectionEl.className = `content-form-section wizard-content-accordion${draggedTemplateSectionKey === section.sectionKey ? " is-dragging" : ""}`;
      sectionEl.dataset.sectionKey = section.sectionKey;
      sectionEl.addEventListener("dragover", (event) => {
        if (!draggedTemplateSectionKey || !templateSectionCanReorder(section)) return;
        event.preventDefault();
        event.dataTransfer.dropEffect = "move";
        sectionEl.classList.add("is-drop-target");
      });
      sectionEl.addEventListener("dragleave", (event) => {
        if (!sectionEl.contains(event.relatedTarget)) sectionEl.classList.remove("is-drop-target");
      });
      sectionEl.addEventListener("drop", (event) => dropTemplateSection(section, event));
      const sectionHeader = document.createElement("div");
      sectionHeader.className = "wizard-content-accordion-header";
      const dragHandle = document.createElement("span");
      dragHandle.className = `wizard-content-drag-handle${templateSectionCanReorder(section) ? "" : " is-disabled"}`;
      dragHandle.draggable = templateSectionCanReorder(section);
      dragHandle.title = templateSectionCanReorder(section) ? "드래그해서 Section 순서 변경" : "관리자 설정에 따라 순서 변경 불가";
      dragHandle.textContent = templateSectionCanReorder(section) ? "⋮⋮" : "고정";
      if (templateSectionCanReorder(section)) {
        dragHandle.tabIndex = 0;
        dragHandle.setAttribute("role", "button");
        dragHandle.setAttribute("aria-label", `${section.name} 순서 변경. 위아래 방향키를 사용할 수 있습니다.`);
        dragHandle.addEventListener("keydown", (event) => {
          if (event.key !== "ArrowUp" && event.key !== "ArrowDown") return;
          event.preventDefault();
          moveTemplateSectionByKeyboard(section.sectionKey, event.key === "ArrowUp" ? -1 : 1);
        });
      }
      dragHandle.addEventListener("dragstart", (event) => startTemplateSectionDrag(section, event));
      dragHandle.addEventListener("dragend", stopTemplateSectionDrag);
      const sectionName = document.createElement("h3");
      sectionName.textContent = section.name;
      const expanded = expandedTemplateSectionKeys.has(section.sectionKey);
      const toggle = document.createElement("button");
      toggle.type = "button";
      toggle.className = "wizard-content-accordion-toggle";
      toggle.setAttribute("aria-expanded", String(expanded));
      toggle.setAttribute("aria-label", expanded ? `${section.name} 닫기` : `${section.name} 열기`);
      toggle.textContent = expanded ? "▾" : "▸";
      sectionHeader.append(dragHandle, sectionName, toggle);
      const grid = document.createElement("div");
      grid.className = `content-form-grid wizard-content-accordion-body${expanded ? " is-open" : ""}`;
      grid.inert = !expanded;
      grid.setAttribute("aria-hidden", String(!expanded));
      visibleItems.forEach((item) => grid.append(createDynamicSectionField(section.sectionKey, item)));
      toggle.addEventListener("click", () => {
        const isOpen = expandedTemplateSectionKeys.has(section.sectionKey);
        expandedTemplateSectionKeys.clear();
        if (!isOpen) expandedTemplateSectionKeys.add(section.sectionKey);
        document.querySelectorAll(".wizard-content-accordion").forEach((accordion) => {
          const accordionKey = accordion.dataset.sectionKey;
          const accordionOpen = expandedTemplateSectionKeys.has(accordionKey);
          const accordionBody = accordion.querySelector(".wizard-content-accordion-body");
          const accordionToggle = accordion.querySelector(".wizard-content-accordion-toggle");
          const accordionName = accordion.querySelector("h3")?.textContent || "Section";
          accordionBody?.classList.toggle("is-open", accordionOpen);
          if (accordionBody) {
            accordionBody.inert = !accordionOpen;
            accordionBody.setAttribute("aria-hidden", String(!accordionOpen));
          }
          if (accordionToggle) {
            accordionToggle.textContent = accordionOpen ? "▾" : "▸";
            accordionToggle.setAttribute("aria-expanded", String(accordionOpen));
            accordionToggle.setAttribute("aria-label", accordionOpen ? `${accordionName} 닫기` : `${accordionName} 열기`);
          }
        });
      });
      sectionEl.append(sectionHeader, grid);
      dynamicSections.push(sectionEl);
    });
  }
  const dynamicSectionsWrapper = document.createElement("div");
  dynamicSectionsWrapper.className = "wizard-template-content-sections";
  appendTextElement(dynamicSectionsWrapper, "h3", "wizard-template-content-title", "3. 컨텐츠 등록");
  dynamicSectionsWrapper.append(...dynamicSections);

  const coverage = document.createElement("aside");
  coverage.className = "content-coverage-panel";
  appendTextElement(coverage, "span", "eyebrow", "Coverage Checklist");
  const missing = contentErrors();
  appendTextElement(coverage, "strong", "", Object.keys(missing).length ? "Required content missing" : "Required content ready");
  const list = document.createElement("ul");
  [
    ["Title", contentState.promo.title],
    ["Purpose", contentState.promo.promotionPurpose],
    ["Market", contentState.promo.market],
    ["Audience", contentState.simpleBrief.audience],
    ["Tone", contentState.simpleBrief.campaignTone],
    ["Template", selectedWizardFormTemplate?.name],
    ...dynamicCoverageRows(),
  ].forEach(([label, value]) => {
    const item = document.createElement("li");
    item.className = String(value || "").trim() ? "is-ready" : "is-missing";
    item.textContent = label;
    list.append(item);
  });
  coverage.append(list);

  const layoutPanel = document.createElement("section");
  layoutPanel.className = "wizard-layout-panel";
  const layoutHeader = document.createElement("div");
  layoutHeader.className = "wizard-layout-panel__header";
  const layoutHeading = document.createElement("div");
  appendTextElement(layoutHeading, "span", "eyebrow", "Template Layout");
  appendTextElement(layoutHeading, "strong", "", `${selectedWizardFormTemplate?.name || "Template"} · layout r${wizardLayoutRevision}`);
  appendTextElement(layoutHeading, "small", "create-promo-appearance-note", "배경색과 CTA 스타일은 Step 1·2 설정으로 고정됩니다.");
  const layoutActions = document.createElement("div");
  layoutActions.className = "wizard-layout-panel__actions";
  const layoutRefresh = document.createElement("button");
  layoutRefresh.className = "secondary-action";
  layoutRefresh.type = "button";
  layoutRefresh.textContent = wizardTemplateRefreshPromise ? "변경 확인 중" : "관리자 변경 확인";
  layoutRefresh.disabled = Boolean(wizardTemplateRefreshPromise || wizardSectionDefinitionsLoading);
  layoutRefresh.addEventListener("click", refreshActiveWizardTemplate);
  const layoutReset = document.createElement("button");
  layoutReset.className = "secondary-action";
  layoutReset.type = "button";
  layoutReset.textContent = "관리자 기본 레이아웃으로 초기화";
  layoutReset.addEventListener("click", () => {
    if (!window.confirm("현재 레이아웃 변경을 모두 지우고 관리자 기본 레이아웃으로 복원할까요?")) return;
    resetWizardLayout();
  });
  layoutActions.append(layoutRefresh, layoutReset);
  layoutHeader.append(layoutHeading, layoutActions);
  const layoutFrame = document.createElement("iframe");
  layoutFrame.className = "wizard-layout-frame";
  layoutFrame.title = "Create Promo 템플릿 콘텐츠 및 레이아웃 편집기";
  layoutFrame.src = "/prototype/visual-editor.html?mode=wizard-layout&source=create-promo";
  layoutFrame.addEventListener("load", postWizardLayoutSnapshot);
  wizardLayoutFrame = layoutFrame;
  layoutPanel.append(layoutHeader, createSectionAiDesignPanel());
  if (pendingAdminLayoutUpdate) {
    const updateBanner = document.createElement("div");
    updateBanner.className = "admin-layout-update-banner";
    updateBanner.setAttribute("role", "status");
    const updateCopy = document.createElement("div");
    appendTextElement(updateCopy, "strong", "", "관리자 기본 레이아웃이 업데이트되었습니다.");
    appendTextElement(
      updateCopy,
      "span",
      "",
      `${pendingAdminLayoutUpdate.target.name} v${pendingAdminLayoutUpdate.target.version} · layout r${pendingAdminLayoutUpdate.nextIdentity?.layoutRevision || 1}`
    );
    const updateActions = document.createElement("div");
    updateActions.className = "admin-layout-update-banner__actions";
    const applyUpdate = document.createElement("button");
    applyUpdate.className = "secondary-action is-primary";
    applyUpdate.type = "button";
    applyUpdate.textContent = "새 관리자 레이아웃 적용";
    applyUpdate.addEventListener("click", applyPendingAdminLayoutUpdate);
    const keepCurrent = document.createElement("button");
    keepCurrent.className = "secondary-action";
    keepCurrent.type = "button";
    keepCurrent.textContent = "현재 작업 유지";
    keepCurrent.addEventListener("click", deferPendingAdminLayoutUpdate);
    updateActions.append(applyUpdate, keepCurrent);
    updateBanner.append(updateCopy, updateActions);
    layoutPanel.append(updateBanner);
  } else if (wizardTemplateRefreshError) {
    const refreshError = document.createElement("div");
    refreshError.className = "admin-layout-update-banner is-error";
    refreshError.setAttribute("role", "alert");
    appendTextElement(refreshError, "span", "", wizardTemplateRefreshError);
    const retryRefresh = document.createElement("button");
    retryRefresh.className = "secondary-action";
    retryRefresh.type = "button";
    retryRefresh.textContent = "다시 확인";
    retryRefresh.addEventListener("click", refreshActiveWizardTemplate);
    refreshError.append(retryRefresh);
    layoutPanel.append(refreshError);
  }
  layoutPanel.append(layoutFrame);

  const substepNav = document.createElement("nav");
  substepNav.className = "content-substep-nav";
  substepNav.setAttribute("aria-label", "Step 3 세부 단계");
  [
    ["overview", "1", "프로모션 개요 등록"],
    ["template", "2", "프로모션 템플릿 선택"],
    ["layout", "3", "템플릿 레이아웃"],
  ].forEach(([key, number, label]) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = `content-substep${contentSubstep === key ? " is-active" : ""}`;
    button.disabled = (key === "template" && Object.keys(promotionOverviewErrors()).length > 0)
      || (key === "layout" && (!wizardSectionConfigurationReady() || Object.keys(promotionOverviewErrors()).length > 0));
    if (contentSubstep === key) button.setAttribute("aria-current", "step");
    appendTextElement(button, "span", "", number);
    appendTextElement(button, "strong", "", label);
    button.addEventListener("click", () => setContentSubstep(key));
    substepNav.append(button);
  });

  const substepActions = document.createElement("div");
  substepActions.className = "content-substep-actions";
  if (contentSubstep !== "overview") {
    const back = document.createElement("button");
    back.type = "button";
    back.className = "secondary-action";
    back.textContent = "이전";
    back.addEventListener("click", () => setContentSubstep(
      CONTENT_SUBSTEPS[Math.max(0, CONTENT_SUBSTEPS.indexOf(contentSubstep) - 1)],
      { validate: false }
    ));
    substepActions.append(back);
  }
  const forward = document.createElement("button");
  forward.type = "button";
  forward.className = "primary-action";
  forward.textContent = contentSubstep === "layout" ? "Web Output" : "다음";
  forward.addEventListener("click", () => {
    if (contentSubstep === "layout") goToWebOutput();
    else setContentSubstep(CONTENT_SUBSTEPS[CONTENT_SUBSTEPS.indexOf(contentSubstep) + 1]);
  });
  substepActions.append(forward);

  placeholders.append(substepNav);
  if (contentSubstep === "overview") placeholders.append(overview);
  if (contentSubstep === "template") placeholders.append(templateSection);
  if (contentSubstep === "layout") {
    const workspace = document.createElement("div");
    workspace.className = "template-layout-workspace";
    workspace.append(layoutPanel);
    placeholders.append(workspace);
    requestAnimationFrame(postWizardLayoutSnapshot);
  }
  placeholders.append(substepActions);
}

function createStatusPill(text, kind = "") {
  const pill = document.createElement("span");
  pill.className = `status-chip${kind ? ` ${kind}` : ""}`;
  pill.textContent = text || "unknown";
  return pill;
}

function createLofiDraftCard(draft) {
  const card = document.createElement("article");
  card.className = `lofi-draft-card${draft.confirmedAt ? " is-confirmed" : ""}${selectedLofiPreviewDraftId === draft.draftId ? " is-selected" : ""}`;

  const header = document.createElement("div");
  header.className = "lofi-draft-header";
  appendTextElement(header, "strong", "", `LO-FI 시안 #${draft.draftAttempt || "-"}`);
  header.append(createStatusPill(draft.confirmedAt ? "Confirmed" : draft.status, isReadyDraft(draft) ? "ready" : ""));

  const preview = document.createElement("button");
  preview.className = "lofi-thumbnail-button";
  preview.type = "button";
  preview.setAttribute("aria-label", `Preview LO-FI draft ${draft.draftAttempt || ""}`);
  preview.addEventListener("click", () => {
    selectedLofiPreviewDraftId = draft.draftId || "";
    renderStep();
  });

  const thumbnail = document.createElement("div");
  thumbnail.className = "lofi-thumbnail";
  if (draft.draftImageUrl || isReadyDraft(draft)) {
    const image = document.createElement("img");
    image.alt = `LO-FI draft attempt ${draft.draftAttempt || ""}`;
    image.src = draftImageSrc(draft);
    image.loading = "lazy";
    thumbnail.append(image);
  } else {
    appendTextElement(thumbnail, "span", "", isActiveStatus(draft.status) ? "Generating draft..." : "No image yet");
  }
  preview.append(thumbnail);

  const meta = document.createElement("dl");
  meta.className = "lofi-draft-meta";
  [
    ["Created", draft.createdAt ? new Date(draft.createdAt).toLocaleString() : "-"],
    ["Updated", draft.updatedAt ? new Date(draft.updatedAt).toLocaleString() : "-"],
  ].forEach(([label, value]) => {
    const row = document.createElement("div");
    appendTextElement(row, "dt", "", label);
    appendTextElement(row, "dd", "", value);
    meta.append(row);
  });
  if (draft.errorMessage) {
    appendTextElement(card, "p", "lofi-error", draft.errorMessage);
  }

  const actions = document.createElement("div");
  actions.className = "lofi-draft-actions";
  const confirm = document.createElement("button");
  confirm.className = "primary-action";
  confirm.type = "button";
  confirm.textContent = draft.confirmedAt ? "Confirmed Draft" : "이 시안 선택";
  confirm.disabled = runLoading || draft.confirmedAt || !isReadyDraft(draft);
  confirm.addEventListener("click", () => confirmDraft(draft));
  actions.append(confirm);

  card.append(header, preview, meta, actions);
  return card;
}

function createLofiLargePreview(draft, draftList) {
  const panel = document.createElement("section");
  panel.className = "lofi-large-preview";
  appendTextElement(panel, "span", "eyebrow", "LO-FI Preview");
  appendTextElement(panel, "h3", "", draft ? `Draft #${draft.draftAttempt || "-"}` : "No draft selected");

  const frame = document.createElement("div");
  frame.className = "lofi-large-preview-frame";
  if (draftList) frame.append(draftList);

  const media = document.createElement("div");
  media.className = "lofi-large-preview-media";
  if (draft?.draftImageUrl || (draft && isReadyDraft(draft))) {
    const image = document.createElement("img");
    image.alt = `LO-FI draft attempt ${draft.draftAttempt || ""}`;
    image.src = draftImageSrc(draft);
    media.append(image);
  } else {
    appendTextElement(media, "span", "", draft ? "Draft image is not ready yet." : "Create a LO-FI draft, then select a thumbnail.");
  }
  frame.append(media);
  panel.append(frame);
  return panel;
}

function createFinalDesignCard(finalDesign) {
  const card = document.createElement("article");
  card.className = `final-design-card${selectedFinalPreviewDesignId === finalDesign.finalDesignId ? " is-selected" : ""}`;

  const header = document.createElement("div");
  header.className = "lofi-draft-header";
  appendTextElement(header, "strong", "", `Final Design ${finalDesign.createdAt ? new Date(finalDesign.createdAt).toLocaleDateString() : ""}`.trim());
  header.append(createStatusPill(finalDesign.status, isReadyFinalDesign(finalDesign) ? "ready" : ""));

  const preview = document.createElement("button");
  preview.className = "lofi-thumbnail-button";
  preview.type = "button";
  preview.setAttribute("aria-label", `Preview final design ${finalDesign.finalDesignId || ""}`);
  preview.addEventListener("click", () => {
    selectedFinalPreviewDesignId = finalDesign.finalDesignId || "";
    renderStep();
  });

  const thumbnail = document.createElement("div");
  thumbnail.className = "lofi-thumbnail";
  if (finalDesign.finalImageUrl || isReadyFinalDesign(finalDesign)) {
    const image = document.createElement("img");
    image.alt = "Final design preview";
    image.src = finalDesignImageSrc(finalDesign);
    image.loading = "lazy";
    thumbnail.append(image);
  } else {
    appendTextElement(thumbnail, "span", "", isActiveStatus(finalDesign.status) ? "Generating final design..." : "No image yet");
  }
  preview.append(thumbnail);

  const meta = document.createElement("dl");
  meta.className = "lofi-draft-meta";
  [
    ["Created", finalDesign.createdAt ? new Date(finalDesign.createdAt).toLocaleString() : "-"],
    ["Updated", finalDesign.updatedAt ? new Date(finalDesign.updatedAt).toLocaleString() : "-"],
  ].forEach(([label, value]) => {
    const row = document.createElement("div");
    appendTextElement(row, "dt", "", label);
    appendTextElement(row, "dd", "", value);
    meta.append(row);
  });
  if (finalDesign.errorMessage) appendTextElement(card, "p", "lofi-error", finalDesign.errorMessage);

  card.append(header, preview, meta);
  return card;
}

function createFinalLargePreview(finalDesign) {
  const panel = document.createElement("section");
  panel.className = "final-large-preview";
  appendTextElement(panel, "span", "eyebrow", "Final Design Preview");
  appendTextElement(panel, "h3", "", finalDesign ? finalDesign.status || "Final design" : "No final design yet");

  const frame = document.createElement("div");
  frame.className = "final-large-preview-frame";
  if (finalDesign?.finalImageUrl || (finalDesign && isReadyFinalDesign(finalDesign))) {
    const image = document.createElement("img");
    image.alt = "Final design preview";
    image.src = finalDesignImageSrc(finalDesign);
    frame.append(image);
  } else {
    appendTextElement(frame, "span", "", finalDesign ? "Final design image is not ready yet." : "Generate a final design from the confirmed LO-FI draft.");
  }
  panel.append(frame);
  return panel;
}

function renderLofiStep() {
  placeholders.className = "lofi-layout";
  placeholders.innerHTML = "";

  const run = runState?.run || null;
  const drafts = Array.isArray(runState?.drafts) ? [...runState.drafts] : [];
  drafts.sort((a, b) => Number(a.draftAttempt || 0) - Number(b.draftAttempt || 0));
  const confirmed = runState?.confirmedDraft || drafts.find((draft) => draft.confirmedAt) || null;
  const selectedDraft = drafts.find((draft) => draft.draftId === selectedLofiPreviewDraftId)
    || confirmed
    || drafts.find((draft) => isReadyDraft(draft))
    || drafts[0]
    || null;
  selectedLofiPreviewDraftId = selectedDraft?.draftId || "";

  const summary = document.createElement("section");
  summary.className = "lofi-run-summary";
  appendTextElement(summary, "span", "eyebrow", "LO-FI Generation Run");
  appendTextElement(summary, "h3", "", run?.promoTitle || contentState.promo.title || "Untitled promo");
  appendTextElement(summary, "p", "", "새 LO-FI 시안을 생성하면 기존 시안은 유지되고 draft attempt가 하나 더 추가됩니다.");

  const statusRow = document.createElement("div");
  statusRow.className = "lofi-status-row";
  const briefProgress = integratedBriefFailed()
    ? { text: "통합 브리프 · 생성 실패", kind: "error" }
    : generationProgress(
      "통합 브리프",
      runState?.integratedBrief?.status || (run?.stage === "integrated_brief" ? run.status : ""),
      integratedBriefReady() || /integrated_brief_ready/i.test(String(run?.status || ""))
    );
  const lofiProgress = generationProgress(
    "LO-FI 생성",
    drafts.find((draft) => isActiveStatus(draft.status))?.status || (run?.stage === "lofi_draft" ? run.status : ""),
    drafts.some((draft) => isReadyDraft(draft)) || /lofi_draft_(ready|confirmed)/i.test(String(run?.status || ""))
  );
  statusRow.append(createStatusPill(briefProgress.text, briefProgress.kind));
  statusRow.append(createStatusPill(lofiProgress.text, lofiProgress.kind));
  statusRow.append(createStatusPill(`시안 ${drafts.length}개`));
  if (confirmed?.draftAttempt) statusRow.append(createStatusPill(`시안 #${confirmed.draftAttempt} 선택됨`, "ready"));
  summary.append(statusRow);

  const coverage = document.createElement("div");
  coverage.className = "lofi-content-snapshot";
  appendTextElement(coverage, "strong", "", "2단계 Content 적용 기준");
  const snapshotList = document.createElement("ul");
  const snapshotRows = [
    ["Title", contentState.promo.title],
    ["Template", selectedWizardFormTemplate?.name],
    ...dynamicCoverageRows(),
  ];
  snapshotRows.forEach(([label, value]) => {
    const item = document.createElement("li");
    item.textContent = `${label}: ${String(value || "-").slice(0, 110)}`;
    snapshotList.append(item);
  });
  coverage.append(snapshotList);
  summary.append(coverage);

  const actionPanel = document.createElement("section");
  actionPanel.className = "lofi-action-panel";
  const prepare = document.createElement("button");
  prepare.className = "secondary-action";
  prepare.type = "button";
  prepare.textContent = integratedBriefFailed()
    ? "통합 브리프 다시 생성"
    : runId() ? "상태 새로고침" : "생성 준비 시작";
  prepare.disabled = runLoading;
  prepare.addEventListener("click", async () => {
    if (runId()) {
      runLoading = true;
      runError = "";
      renderStep();
      try {
        if (integratedBriefFailed()) await queueIntegratedBrief();
        await refreshRunState();
        syncRunPolling();
      } catch (error) {
        runError = error.message;
      } finally {
        runLoading = false;
        renderStep();
      }
    } else {
      await prepareLofiRun();
    }
  });

  const createDraft = document.createElement("button");
  createDraft.className = "primary-action";
  createDraft.type = "button";
  createDraft.textContent = "새 LO-FI 시안 생성";
  createDraft.disabled = runLoading || !runId() || !integratedBriefReady();
  createDraft.addEventListener("click", createNewLofiDraft);
  actionPanel.append(prepare, createDraft);
  if (integratedBriefFailed()) {
    appendTextElement(
      actionPanel,
      "small",
      "lofi-error",
      integratedBriefErrorMessage() || "통합 브리프 생성에 실패했습니다. 다시 생성해 주세요."
    );
  } else if (!integratedBriefReady()) {
    appendTextElement(actionPanel, "small", "", runId()
      ? "Integrated Brief가 ready가 되면 새 LO-FI 시안을 생성할 수 있습니다."
      : "먼저 생성 준비를 시작해 Integrated Brief를 큐에 넣어 주세요.");
  }
  if (!workerReady("integrated_brief") || !workerReady("lofi_draft")) {
    appendTextElement(actionPanel, "small", "", "관리자 페이지에서 integrated_brief / lofi_draft n8n webhook이 active인지 확인해 주세요. 환경변수로 설정된 경우에는 서버가 그대로 worker를 호출합니다.");
  }
  if (runLoading) appendTextElement(actionPanel, "small", "", "요청 처리 중입니다.");
  if (runError) appendTextElement(actionPanel, "small", "lofi-error", runError);
  summary.append(actionPanel);

  const list = document.createElement("section");
  list.className = "lofi-draft-list";
  if (!drafts.length) {
    const empty = document.createElement("article");
    empty.className = "placeholder-card";
    appendTextElement(empty, "strong", "", "아직 생성된 LO-FI 시안이 없습니다");
    appendTextElement(empty, "span", "", "Integrated Brief가 준비된 뒤 '새 LO-FI 시안 생성'을 눌러 첫 후보를 생성합니다.");
    list.append(empty);
  } else {
    drafts.forEach((draft) => list.append(createLofiDraftCard(draft)));
  }

  const largePreview = createLofiLargePreview(selectedDraft, list);

  placeholders.append(summary, largePreview);
}

function renderFinalStep() {
  placeholders.className = "final-layout";
  placeholders.innerHTML = "";

  const run = runState?.run || null;
  const confirmed = runState?.confirmedDraft || null;
  const finalDesigns = Array.isArray(runState?.finalDesigns) ? [...runState.finalDesigns] : [];
  finalDesigns.sort((a, b) => new Date(a.createdAt || 0) - new Date(b.createdAt || 0));
  const selectedFinalDesign = finalDesigns.find((item) => item.finalDesignId === selectedFinalPreviewDesignId)
    || finalDesigns.find((item) => isReadyFinalDesign(item))
    || finalDesigns[0]
    || null;
  selectedFinalPreviewDesignId = selectedFinalDesign?.finalDesignId || "";

  const summary = document.createElement("section");
  summary.className = "final-run-summary";
  appendTextElement(summary, "span", "eyebrow", "Final Design Generation Run");
  appendTextElement(summary, "h3", "", run?.promoTitle || contentState.promo.title || "Untitled promo");
  appendTextElement(summary, "p", "", "Confirm Draft로 선택한 LO-FI 시안을 기준으로 n8n final_design worker를 호출합니다.");

  const statusRow = document.createElement("div");
  statusRow.className = "lofi-status-row";
  const finalComplete = finalDesigns.some((item) => isReadyFinalDesign(item))
    || /final_design_ready/i.test(String(run?.status || ""));
  const finalInProgress = finalDesigns.some((item) => isActiveStatus(item.status))
    || (run?.stage === "final_design" && isActiveStatus(run.status));
  const finalProgress = finalComplete
    ? { text: "최종 디자인 · 진행 완료", kind: "ready" }
    : finalInProgress
      ? { text: "최종 디자인 · 진행 중", kind: "progress" }
      : { text: "최종 디자인 · 대기 중", kind: "waiting" };
  statusRow.append(createStatusPill(finalProgress.text, finalProgress.kind));
  statusRow.append(createStatusPill(`결과 ${finalDesigns.length}개`));
  if (confirmed?.draftAttempt) statusRow.append(createStatusPill(`LO-FI 시안 #${confirmed.draftAttempt} 선택됨`, "ready"));
  summary.append(statusRow);

  const source = document.createElement("div");
  source.className = "lofi-content-snapshot final-design-source";
  appendTextElement(source, "strong", "", "Final Design Source");
  const sourcePreview = document.createElement("div");
  sourcePreview.className = "final-design-source-preview";
  if (confirmed?.draftId) {
    const sourceImage = document.createElement("img");
    sourceImage.src = draftImageSrc(confirmed);
    sourceImage.alt = `선택된 LO-FI 시안 #${confirmed.draftAttempt || ""}`.trim();
    sourceImage.loading = "lazy";
    sourcePreview.append(sourceImage);
  } else {
    appendTextElement(sourcePreview, "span", "", "Step 3에서 선택된 LO-FI 시안이 없습니다.");
  }
  const sourceList = document.createElement("ul");
  [
    ["Run ID", runId()],
    ["Confirmed Draft ID", confirmed?.draftId],
    ["Promo Title", contentState.promo.title],
    ["CTA", contentState.promo.ctaLabel || contentState.simpleBrief.targetAction],
  ].forEach(([label, value]) => {
    const item = document.createElement("li");
    item.textContent = `${label}: ${String(value || "-").slice(0, 110)}`;
    sourceList.append(item);
  });
  source.append(sourcePreview, sourceList);
  summary.append(source);

  const actionPanel = document.createElement("section");
  actionPanel.className = "lofi-action-panel";
  const refresh = document.createElement("button");
  refresh.className = "secondary-action";
  refresh.type = "button";
  refresh.textContent = "상태 새로고침";
  refresh.disabled = runLoading || !runId();
  refresh.addEventListener("click", async () => {
    runLoading = true;
    runError = "";
    renderStep();
    try {
      await refreshRunState();
      syncRunPolling();
    } catch (error) {
      runError = error.message;
    } finally {
      runLoading = false;
      renderStep();
    }
  });

  const generate = document.createElement("button");
  generate.className = "primary-action";
  generate.type = "button";
  generate.textContent = finalDesigns.length ? "최종 디자인 재생성" : "최종 디자인 생성";
  generate.disabled = runLoading || !runId() || !confirmed?.draftId;
  generate.addEventListener("click", generateFinalDesign);
  actionPanel.append(refresh, generate);
  if (!confirmed?.draftId) appendTextElement(actionPanel, "small", "", "Step 3에서 LO-FI 시안 하나를 Confirm Draft로 선택해야 최종 디자인을 생성할 수 있습니다.");
  if (!workerReady("final_design")) appendTextElement(actionPanel, "small", "", "관리자 페이지에서 final_design n8n webhook이 active인지 확인해 주세요. 환경변수로 설정된 경우에는 서버가 그대로 worker를 호출합니다.");
  if (runLoading) appendTextElement(actionPanel, "small", "", "요청 처리 중입니다.");
  if (runError) appendTextElement(actionPanel, "small", "lofi-error", runError);
  summary.append(actionPanel);

  const largePreview = createFinalLargePreview(selectedFinalDesign);

  const list = document.createElement("section");
  list.className = "final-design-list";
  if (!finalDesigns.length) {
    const empty = document.createElement("article");
    empty.className = "placeholder-card";
    appendTextElement(empty, "strong", "", "아직 생성된 최종 디자인이 없습니다");
    appendTextElement(empty, "span", "", "Confirm Draft가 준비된 뒤 '최종 디자인 생성'을 눌러 n8n final_design worker를 시작합니다.");
    list.append(empty);
  } else {
    finalDesigns.forEach((finalDesign) => list.append(createFinalDesignCard(finalDesign)));
  }

  placeholders.append(summary, largePreview, list);
}

function randomToken(length = 5) {
  const alphabet = "abcdefghijklmnopqrstuvwxyz0123456789";
  const values = new Uint8Array(length);
  if (window.crypto?.getRandomValues) {
    window.crypto.getRandomValues(values);
  } else {
    for (let index = 0; index < length; index += 1) values[index] = Math.floor(Math.random() * 256);
  }
  return Array.from(values, (value) => alphabet[value % alphabet.length]).join("");
}

function createRunKey() {
  const stamp = new Date().toISOString().replace(/[-:TZ.]/g, "").slice(0, 14);
  return `promo-wizard-${stamp}-${randomToken(5)}`;
}

function selectedDesignPayload(doc) {
  return {
    id: doc?.id || "",
    brand: doc?.brandName || "",
    designStyleId: doc?.id || "",
    designStyleName: doc?.designStyleName || doc?.brandName || "",
    slug: doc?.slug || "",
    summary: doc?.summary || {},
    designTokenFileName: doc?.designTokenFileName || "",
    selectedTokens: doc?.designTokensJson || doc?.rawDesignTokens || {},
    designConcept: doc?.designConcept || {},
    styleClassification: doc?.styleClassification || null,
    designPromptContext: doc?.designConcept?.promptContext || "",
    designData: {
      summary: doc?.summary || {},
      normalizedSchema: doc?.normalizedSchema || null,
      extractionStatus: doc?.extractionStatus || doc?.status || "",
      sourceHash: doc?.sourceHash || "",
    },
  };
}

// Builds the sectionConfig.sections metadata the backend brief/prompt builder
// (api/_promo-markdown-builders.js canonicalSectionName/sectionRole) falls
// back to when it isn't provided. Sending real names/descriptions here means
// a brand-new admin-created section gets a proper display name in the
// generated brief instead of falling back to its raw sectionKey.
function wizardSectionConfigSections() {
  return wizardSectionDefinitions.map((section) => ({
    sectionId: section.sectionKey,
    key: section.sectionKey,
    name: section.name,
    role: section.description || undefined,
    visible: true, // fetch already filtered to is_visible_in_wizard = true
    fixedPosition: section.fixedPosition || null,
  }));
}

function templateContentAdapter(sectionInputs) {
  const textValues = [];
  const ctaValues = [];
  wizardSectionDefinitions.forEach((section) => {
    (section.items || []).forEach((item) => {
      const value = valueAtPath(sectionInputs, `${section.sectionKey}.${item.itemKey}`);
      if (item.fieldKind === "cta" && value) ctaValues.push(value);
      if (item.fieldKind === "text" && String(value || "").trim()) textValues.push(String(value).trim());
    });
  });
  return {
    mainOffer: textValues[0] || contentState.promo.title || "",
    secondaryMessage: textValues[1] || "",
    targetAction: ctaValues[0]?.label || "",
    leadText: textValues[0] || "",
    subline: textValues[1] || "",
    ctaLabel: ctaValues[0]?.label || "",
    ctaUrl: ctaValues[0]?.link || "",
  };
}

function buildWizardPayload(runKey) {
  if (!wizardSectionConfigurationReady()) {
    throw new Error("콘텐츠 섹션 구성이 준비되지 않아 생성을 시작할 수 없습니다.");
  }
  const doc = selectedDocument();
  const sectionInputs = mergeSectionInputs(contentState.sectionInputs || {});
  const contentAdapter = templateContentAdapter(sectionInputs);
  const heroButton = sectionInputs.heroBanner?.button || {};
  const contentCtaButton = sectionInputs.contentCta?.button || {};
  const stepBarButton = sectionInputs.stepBar?.ctaButton || {};
  const promo = {
    ...contentState.promo,
    leadText: contentAdapter.leadText || sectionInputs.heroBanner?.leadText || "",
    subline: contentAdapter.subline || sectionInputs.heroBanner?.sublineText || sectionInputs.contentCta?.description || "",
    ctaLabel: contentAdapter.ctaLabel || heroButton.label || contentCtaButton.label || stepBarButton.label || "Learn More",
    ctaUrl: contentAdapter.ctaUrl || heroButton.link || contentCtaButton.link || stepBarButton.link || "#",
    alphaText: contentState.promo.alphaText || sectionInputs.heroBanner?.alphaText,
    termsText: contentState.promo.termsText || sectionInputs.titleDescription?.contents || sectionInputs.footer?.content || "Terms and conditions apply. Please play responsibly.",
  };
  const fillBlank = (path, value) => {
    if (!String(valueAtPath(sectionInputs, path) || "").trim() && String(value || "").trim()) {
      setValueAtPath(sectionInputs, path, value);
    }
  };
  fillBlank("heroBanner.leadText", promo.leadText);
  fillBlank("heroBanner.title", promo.title);
  fillBlank("heroBanner.sublineText", promo.subline);
  fillBlank("heroBanner.button.label", promo.ctaLabel);
  fillBlank("heroBanner.button.link", promo.ctaUrl);
  fillBlank("heroBanner.alphaText", promo.alphaText);
  fillBlank("stepBar.title", contentAdapter.targetAction);
  fillBlank("stepBar.description", contentAdapter.mainOffer);
  fillBlank("stepBar.ctaButton.label", promo.ctaLabel);
  fillBlank("stepBar.ctaButton.link", promo.ctaUrl);
  fillBlank("contentCta.title", contentAdapter.mainOffer || promo.title);
  fillBlank("contentCta.description", contentAdapter.secondaryMessage || promo.subline);
  fillBlank("contentCta.button.label", promo.ctaLabel);
  fillBlank("contentCta.button.link", promo.ctaUrl);
  fillBlank("titleDescription.contents", promo.termsText);
  fillBlank("footer.content", promo.termsText);
  applyCtaUtmParameters(sectionInputs);
  const primaryCtaDefinition = [
    ["heroBanner", "button"],
    ["contentCta", "button"],
    ["stepBar", "ctaButton"],
  ].map(([sectionKey, itemKey]) => wizardSectionDefinitions
    .find((section) => section.sectionKey === sectionKey)?.items
    ?.find((item) => item.itemKey === itemKey && item.fieldKind === "cta"))
    .find(Boolean);
  promo.ctaUrl = appendUtmParameters(promo.ctaUrl, primaryCtaDefinition?.ctaUtm || {});
  const promotionInput = {
    purpose: contentState.promo.promotionPurpose || "",
    purposeOther: contentState.promo.promotionPurposeOther || "",
    targetCustomer: contentState.simpleBrief.audience || "",
    campaignTone: contentState.simpleBrief.campaignTone || "",
  };
  const dynamicSectionKeys = wizardSectionDefinitions.map((section) => section.sectionKey);
  const templateRuntime = {
    templateId: selectedWizardFormTemplate?.id || "",
    templateKey: selectedWizardFormTemplate?.templateKey || "",
    templateName: selectedWizardFormTemplate?.name || "",
    templateVersion: selectedWizardFormTemplate?.version || 1,
    orderedSections: dynamicSectionKeys,
    visibleSections: dynamicSectionKeys,
  };
  return {
    id: runKey,
    generatedAt: new Date().toISOString(),
    selectedDesignStyleId: doc?.id || "",
    md: selectedDesignPayload(doc),
    promo,
    promotionInput,
    marketVisualGuidance: promo.market ? `Use ${promo.market} as market context without inventing visible copy.` : "",
    simpleBrief: {
      ...contentAdapter,
      audience: contentState.simpleBrief.audience,
      campaignTone: contentState.simpleBrief.campaignTone,
    },
    formTemplate: { ...contentState.formTemplate },
    layoutSnapshot: {
      layoutIdentity: wizardLayoutIdentity,
      layoutRevision: wizardLayoutRevision,
      renderer: wizardRenderer,
      baseLayout: JSON.parse(JSON.stringify(wizardBaseLayout || FALLBACK_LAYOUT)),
      resolvedLayout: JSON.parse(JSON.stringify(wizardResolvedLayout || wizardBaseLayout || FALLBACK_LAYOUT)),
    },
    sectionSnapshot: wizardSectionDefinitions.map((section) => ({ ...section, items: (section.items || []).map((item) => ({ ...item })) })),
    sectionInputs,
    sectionConfig: {
      sections: wizardSectionConfigSections(),
      orderedSections: dynamicSectionKeys,
      visibleSections: templateRuntime.visibleSections,
      source: "standalone_wizard",
      revision: wizardSectionConfigRevision,
    },
    template: {
      id: selectedWizardFormTemplate?.id || "",
      key: selectedWizardFormTemplate?.templateKey || "",
      name: selectedWizardFormTemplate?.name || "",
      version: selectedWizardFormTemplate?.version || 1,
      designMode: "ai",
      generationMode: "lofi_draft",
      inputMode: "wizard",
      sectionOrder: templateRuntime.orderedSections,
      visibleSections: templateRuntime.visibleSections,
    },
    inputSnapshot: {
      promo,
      promotionInput,
      simpleBrief: { ...contentAdapter, audience: contentState.simpleBrief.audience, campaignTone: contentState.simpleBrief.campaignTone },
      sectionInputs,
      sectionSnapshot: wizardSectionDefinitions.map((section) => ({ ...section, items: (section.items || []).map((item) => ({ ...item })) })),
      formTemplate: { ...contentState.formTemplate },
      layoutSnapshot: {
        layoutIdentity: wizardLayoutIdentity,
        layoutRevision: wizardLayoutRevision,
        renderer: wizardRenderer,
        baseLayout: JSON.parse(JSON.stringify(wizardBaseLayout || FALLBACK_LAYOUT)),
        resolvedLayout: JSON.parse(JSON.stringify(wizardResolvedLayout || wizardBaseLayout || FALLBACK_LAYOUT)),
      },
      sectionConfig: {
        sections: wizardSectionConfigSections(),
        orderedSections: dynamicSectionKeys,
        visibleSections: templateRuntime.visibleSections,
        source: "standalone_wizard",
        revision: wizardSectionConfigRevision,
      },
      templateRuntime,
      marketVisualGuidance: promo.market ? `Use ${promo.market} as market context without inventing visible copy.` : "",
    },
  };
}

function appendUtmParameters(rawUrl, utm = {}) {
  const value = String(rawUrl || "").trim();
  if (!value) return value;
  if (value.startsWith("#")) return value;
  const entries = Object.entries({
    utm_source: utm.source,
    utm_medium: utm.medium,
    utm_campaign: utm.campaign,
    utm_content: utm.content,
    utm_term: utm.term,
  }).filter(([, entry]) => String(entry || "").trim());
  if (!entries.length) return value;

  try {
    const relative = value.startsWith("/");
    const url = new URL(value, window.location.origin);
    entries.forEach(([key, entry]) => url.searchParams.set(key, String(entry).trim()));
    return relative ? `${url.pathname}${url.search}${url.hash}` : url.toString();
  } catch {
    return value;
  }
}

function applyCtaUtmParameters(sectionInputs) {
  wizardSectionDefinitions.forEach((section) => {
    (section.items || []).forEach((item) => {
      if (item.fieldKind !== "cta") return;
      const value = valueAtPath(sectionInputs, `${section.sectionKey}.${item.itemKey}`);
      if (!value || typeof value !== "object") return;
      value.link = appendUtmParameters(value.link, item.ctaUtm || {});
    });
  });
}

function runId() {
  return runState?.run?.runId || runState?.runId || "";
}

function runStatusText() {
  const run = runState?.run || {};
  return [run.stage, run.status].filter(Boolean).join(" / ") || "not started";
}

function workerTimeout(stage) {
  return Number(workerSetting(stage)?.timeoutMs || 0) || undefined;
}

function integratedBriefReady() {
  const statusValue = String(runState?.integratedBrief?.status || "");
  return ["ready", "completed"].includes(statusValue);
}

function integratedBriefFailed() {
  const briefStatus = String(runState?.integratedBrief?.status || "");
  const runStatus = String(runState?.run?.status || "");
  return /failed/i.test(briefStatus) || /integrated_brief_(?:trigger_)?failed/i.test(runStatus);
}

function integratedBriefErrorMessage() {
  return String(runState?.integratedBrief?.errorMessage || runState?.run?.errorMessage || "").trim();
}

function draftImageSrc(draft) {
  return draft?.draftId ? `/api/promo-generation-lofi-draft-image?draftId=${encodeURIComponent(draft.draftId)}` : "";
}

function finalDesignImageSrc(finalDesign) {
  return finalDesign?.finalDesignId ? `/api/promo-generation-final-design-image?finalDesignId=${encodeURIComponent(finalDesign.finalDesignId)}` : "";
}

function isReadyDraft(draft) {
  return ["ready", "completed"].includes(String(draft?.status || ""));
}

function isReadyFinalDesign(finalDesign) {
  return ["ready", "completed"].includes(String(finalDesign?.status || ""));
}

function isActiveStatus(statusValue) {
  return /queued|generating|running|pending|accepted/i.test(String(statusValue || ""));
}

function generationProgress(label, statusValue, isComplete = false) {
  if (isComplete) return { text: `${label} · 완료`, kind: "ready" };
  if (isActiveStatus(statusValue)) return { text: `${label} · 진행 중`, kind: "progress" };
  return { text: `${label} · 진행 전`, kind: "pending" };
}

async function fetchJson(url, options = {}) {
  const response = await fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
  });
  const payload = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(payload.message || payload.error || payload.workerTrigger?.error || `HTTP ${response.status}`);
  }
  return payload;
}

async function createOrRefreshRun() {
  if (runId()) return runState;
  const runKey = createRunKey();
  const payload = buildWizardPayload(runKey);
  const result = await fetchJson("/api/promo-generation-runs", {
    method: "POST",
    body: JSON.stringify({ runKey, payload }),
  });
  saveWizardRun(result.state || result);
  return runState;
}

async function queueIntegratedBrief() {
  if (!runId() || integratedBriefReady()) return;
  const result = await fetchJson("/api/promo-generation-integrated-brief", {
    method: "POST",
    body: JSON.stringify({
      runId: runId(),
      triggerWorker: true,
      triggerTimeoutMs: workerTimeout("integrated_brief"),
      promptMeta: {
        source: "standalone_wizard",
        contentCoverageRequired: true,
      },
    }),
  });
  if (result.state) saveWizardRun(result.state);
}

async function refreshRunState() {
  if (!runId()) return;
  const result = await fetchJson(`/api/promo-generation-runs?runId=${encodeURIComponent(runId())}`);
  saveWizardRun(result);
}

function syncRunPolling() {
  if (runPollingTimer) {
    window.clearInterval(runPollingTimer);
    runPollingTimer = null;
  }
  const run = runState?.run || {};
  const drafts = Array.isArray(runState?.drafts) ? runState.drafts : [];
  const finalDesigns = Array.isArray(runState?.finalDesigns) ? runState.finalDesigns : [];
  const active = isActiveStatus(run.status)
    || drafts.some((draft) => isActiveStatus(draft.status))
    || finalDesigns.some((finalDesign) => isActiveStatus(finalDesign.status));
  if (!active) return;
  runPollingTimer = window.setInterval(async () => {
    try {
      await refreshRunState();
      renderStep();
      syncRunPolling();
    } catch (error) {
      runError = error.message;
      renderStep();
    }
  }, 5000);
}

async function prepareLofiRun() {
  runLoading = true;
  runError = "";
  renderStep();
  try {
    await createOrRefreshRun();
    await queueIntegratedBrief();
    await refreshRunState().catch(() => false);
    syncRunPolling();
  } catch (error) {
    runError = error.message;
  } finally {
    runLoading = false;
    renderStep();
  }
}

async function createNewLofiDraft() {
  runLoading = true;
  runError = "";
  renderStep();
  try {
    await createOrRefreshRun();
    if (!integratedBriefReady()) {
      await queueIntegratedBrief();
      await refreshRunState().catch(() => false);
      if (!integratedBriefReady()) {
        throw new Error("Integrated Brief is not ready yet. Wait for generation to finish, then create a LO-FI draft.");
      }
    }
    const result = await fetchJson("/api/promo-generation-lofi-drafts", {
      method: "POST",
      body: JSON.stringify({
        runId: runId(),
        triggerWorker: true,
        triggerTimeoutMs: workerTimeout("lofi_draft"),
        promptMeta: {
          source: "standalone_wizard",
          contentSnapshot: {
            promo: contentState.promo,
            formTemplate: contentState.formTemplate,
            sectionInputs: contentState.sectionInputs,
          },
          contentCoverageRequired: true,
        },
      }),
    });
    if (result.state) saveWizardRun(result.state);
    await refreshRunState().catch(() => false);
    syncRunPolling();
  } catch (error) {
    runError = error.message;
  } finally {
    runLoading = false;
    renderStep();
  }
}

async function generateFinalDesign() {
  const confirmed = runState?.confirmedDraft || null;
  if (!confirmed?.draftId) {
    runError = "Final Design 생성 전에 LO-FI 시안 하나를 Confirm Draft로 선택해 주세요.";
    renderStep();
    return;
  }

  runLoading = true;
  runError = "";
  renderStep();
  try {
    const result = await fetchJson("/api/promo-generation-final-designs", {
      method: "POST",
      body: JSON.stringify({
        runId: runId(),
        confirmedDraftId: confirmed.draftId,
        triggerWorker: true,
        triggerTimeoutMs: workerTimeout("final_design"),
        promptMeta: {
          source: "standalone_wizard",
          confirmedDraftId: confirmed.draftId,
          contentCoverageRequired: true,
        },
      }),
    });
    if (result.state) saveWizardRun(result.state);
    else if (result.finalDesign) mergeQueuedFinalDesign(result.finalDesign);
    await refreshRunState().catch(() => false);
    syncRunPolling();
  } catch (error) {
    await refreshRunState().catch(() => false);
    syncRunPolling();
    runError = error.message;
  } finally {
    runLoading = false;
    renderStep();
  }
}

async function confirmDraft(draft) {
  if (!draft?.draftId) return;
  runLoading = true;
  runError = "";
  renderStep();
  try {
    const result = await fetchJson("/api/promo-generation-lofi-draft-confirm", {
      method: "POST",
      body: JSON.stringify({ draftId: draft.draftId }),
    });
    saveWizardRun(result.state || result);
    syncRunPolling();
  } catch (error) {
    runError = error.message;
  } finally {
    runLoading = false;
    renderStep();
  }
}

function renderConceptStep() {
  placeholders.className = "concept-layout";
  placeholders.innerHTML = "";

  if (conceptsLoading) {
    const loading = document.createElement("article");
    loading.className = "placeholder-card";
    appendTextElement(loading, "strong", "", "Loading Design MD");
    appendTextElement(loading, "span", "", "A섹션 디자인 데이터를 불러오는 중입니다.");
    placeholders.append(loading);
    return;
  }

  if (conceptsError) {
    const error = document.createElement("article");
    error.className = "placeholder-card";
    appendTextElement(error, "strong", "", "Design MD load failed");
    appendTextElement(error, "span", "", conceptsError);
    placeholders.append(error);
    return;
  }

  const docs = designDocuments;
  if (!docs.length) {
    const empty = document.createElement("article");
    empty.className = "placeholder-card";
    appendTextElement(empty, "strong", "", "No Design MD");
    appendTextElement(empty, "span", "", "A섹션 데이터를 새로고침해 주세요.");
    placeholders.append(empty);
    return;
  }

  const carousel = document.createElement("section");
  carousel.className = "concept-carousel";
  carousel.setAttribute("aria-label", "Design MD concept carousel");

  const previous = document.createElement("button");
  previous.className = "concept-carousel-control concept-carousel-previous";
  previous.type = "button";
  previous.setAttribute("aria-label", "이전 디자인 콘셉트 보기");
  previous.textContent = "←";

  const list = document.createElement("div");
  list.className = "concept-list";
  list.tabIndex = 0;
  docs.forEach((doc) => list.append(createConceptCard(doc)));

  const next = document.createElement("button");
  next.className = "concept-carousel-control concept-carousel-next";
  next.type = "button";
  next.setAttribute("aria-label", "다음 디자인 콘셉트 보기");
  next.textContent = "→";

  const updateControls = () => {
    const maxScroll = Math.max(0, list.scrollWidth - list.clientWidth);
    previous.disabled = list.scrollLeft <= 2;
    next.disabled = list.scrollLeft >= maxScroll - 2;
  };
  const moveCarousel = (direction) => {
    const card = list.querySelector(".concept-card");
    const gap = Number.parseFloat(getComputedStyle(list).gap) || 12;
    const distance = card ? card.getBoundingClientRect().width + gap : list.clientWidth * 0.8;
    list.scrollBy({ left: direction * distance, behavior: "smooth" });
  };

  previous.addEventListener("click", () => moveCarousel(-1));
  next.addEventListener("click", () => moveCarousel(1));
  list.addEventListener("scroll", updateControls, { passive: true });
  list.addEventListener("keydown", (event) => {
    if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return;
    event.preventDefault();
    moveCarousel(event.key === "ArrowLeft" ? -1 : 1);
  });

  carousel.append(previous, list, next);
  placeholders.append(carousel);
  requestAnimationFrame(() => {
    list.querySelector(".concept-card.is-selected")?.scrollIntoView({ inline: "center", block: "nearest" });
    updateControls();
  });
}

async function loadDesignDocuments(options = {}) {
  conceptsLoading = true;
  conceptsError = "";
  renderStep();
  try {
    const url = options.fresh ? `/api/design-documents?ts=${Date.now()}` : "/api/design-documents";
    const response = await fetch(url);
    const payload = await response.json().catch(() => ({}));
    if (!response.ok) throw new Error(payload.error || `API ${response.status}`);
    designDocuments = Array.isArray(payload.documents) ? payload.documents : [];
    if (!selectedDocumentId || !designDocuments.some((doc) => doc.id === selectedDocumentId)) {
      selectedDocumentId = designDocuments[0]?.id || "";
    }
    if (selectedDocumentId) localStorage.setItem(storageKeys.selectedDocumentId, selectedDocumentId);
  } catch (error) {
    conceptsError = error.message || "A섹션 디자인 데이터를 불러오지 못했습니다.";
  } finally {
    conceptsLoading = false;
    renderStep();
  }
}

function renderWebOutputStep() {
  placeholders.className = "web-output-layout";
  placeholders.innerHTML = "";
  let snapshot = null;
  try {
    snapshot = JSON.parse(localStorage.getItem(WEB_OUTPUT_SNAPSHOT_STORAGE_KEY) || "null");
  } catch {
    snapshot = null;
  }

  const header = document.createElement("section");
  header.className = "web-output-summary";
  appendTextElement(header, "span", "eyebrow", "Web Output Snapshot");
  appendTextElement(header, "h3", "", snapshot?.content?.formTemplate?.name || "Web Output 준비 필요");
  appendTextElement(
    header,
    "p",
    "",
    snapshot
      ? `Template v${snapshot.content?.formTemplate?.version || 1} · layout r${snapshot.layoutRevision || 1} · ${new Date(snapshot.createdAt).toLocaleString()}`
      : "Step 3에서 필수 콘텐츠와 레이아웃을 확인한 후 Web Output을 생성해 주세요."
  );
  const actions = document.createElement("div");
  actions.className = "web-output-actions";
  const edit = document.createElement("button");
  edit.type = "button";
  edit.className = "secondary-action";
  edit.textContent = "Step 3으로 돌아가 수정";
  edit.addEventListener("click", () => {
    currentStep = 2;
    contentSubstep = "layout";
    sessionStorage.setItem(CONTENT_SUBSTEP_STORAGE_KEY, contentSubstep);
    renderStep();
  });
  actions.append(edit);
  header.append(actions);
  placeholders.append(header);

  if (!snapshot) return;
  const frame = document.createElement("iframe");
  frame.className = "web-output-frame";
  frame.title = "Create Promo Web Output 읽기 전용 미리보기";
  frame.src = "/prototype/visual-editor.html?mode=output&source=create-promo";
  placeholders.append(frame);
}

function renderStep() {
  const step = steps[currentStep];
  title.textContent = step.title;
  copy.textContent = step.copy;
  eyebrow.textContent = `Step ${currentStep + 1}`;
  status.textContent = `Step ${currentStep + 1} / ${steps.length}`;
  if (shellStatus) shellStatus.textContent = `Step ${currentStep + 1} / ${steps.length}`;
  prev.disabled = currentStep === 0;
  next.disabled = currentStep === steps.length - 1
    || (currentStep === 2 && !wizardSectionConfigurationReady());
  next.textContent = currentStep === 2 && contentSubstep === "layout" ? "Web Output" : "Next";

  stepButtons.forEach((button, index) => {
    button.classList.toggle("is-active", index === currentStep);
    button.classList.toggle("is-complete", index < currentStep);
  });

  if (currentStep === 0) {
    renderBackgroundStep();
    return;
  }

  if (currentStep === 1) {
    renderCtaStep();
    return;
  }

  if (currentStep === 2) {
    renderContentStep();
    return;
  }

  if (currentStep === 3) {
    renderWebOutputStep();
    return;
  }

  placeholders.className = "placeholder-grid";
  placeholders.innerHTML = "";
  step.cards.forEach(([cardTitle, cardCopy]) => {
    const card = document.createElement("article");
    card.className = "placeholder-card";

    const heading = document.createElement("strong");
    heading.textContent = cardTitle;

    const body = document.createElement("span");
    body.textContent = cardCopy;

    card.append(heading, body);
    placeholders.append(card);
  });
}

stepButtons.forEach((button, index) => {
  button.addEventListener("click", () => {
    if (index === 3) {
      goToWebOutput();
      return;
    }
    currentStep = index;
    renderStep();
    if (currentStep === 2) refreshActiveWizardTemplate();
  });
});

prev.addEventListener("click", () => {
  if (currentStep === 2 && contentSubstep !== "overview") {
    setContentSubstep(CONTENT_SUBSTEPS[CONTENT_SUBSTEPS.indexOf(contentSubstep) - 1], { validate: false });
    return;
  }
  currentStep = Math.max(0, currentStep - 1);
  renderStep();
  if (currentStep === 2) refreshActiveWizardTemplate();
});

next.addEventListener("click", () => {
  if (currentStep === 2) {
    if (contentSubstep === "layout") goToWebOutput();
    else setContentSubstep(CONTENT_SUBSTEPS[CONTENT_SUBSTEPS.indexOf(contentSubstep) + 1]);
    return;
  }
  currentStep = Math.min(steps.length - 1, currentStep + 1);
  renderStep();
  if (currentStep === 2) refreshActiveWizardTemplate();
});

renderStep();
loadDesignDocuments();
loadWorkerSettings();
loadWizardSectionDefinitions();
syncRunPolling();
