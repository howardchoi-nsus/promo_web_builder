const steps = [
  {
    title: "배경색 선택",
    copy: "프로모션의 기본 배경색을 고르세요. 선택 결과는 미리보기에 즉시 반영됩니다.",
  },
  {
    title: "CTA 버튼 스타일 선택",
    copy: "버튼 모양, 표현 방식, 색상을 선택하세요. 조합 결과를 미리보기에서 확인할 수 있습니다.",
  },
  {
    title: "템플릿 및 콘텐츠 등록",
    copy: "관리자에서 생성한 템플릿을 선택하고 프로모션 콘텐츠를 등록하는 단계입니다.",
  },
  {
    title: "웹 출력",
    copy: "선택한 스타일, 템플릿, 콘텐츠를 최종 웹 결과물로 출력하는 단계입니다.",
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
  wizardContent: "promoPrototype.createPromo.content.v1",
  wizardContentLegacyBackup: "promoPrototype.createPromo.content.legacyBackup.v1",
  wizardSessionId: "promoPrototype.createPromo.sessionId.v1",
  appearance: "promoPrototype.createPromo.appearance.v1",
};

const SECTION_INPUT_SCHEMA_VERSION = 2;
const LAYOUT_CACHE_CONTRACT_VERSION = 2;
const { appendTextElement, valueAtPath, setValueAtPath, fetchJson } = globalThis.PromoWizardCore || {};
const {
  createDefaultWizardContent,
  migrateLegacySectionInputs,
  defaultSectionInputsFromDefinitions,
  mergeSectionInputs,
} = globalThis.PromoWizardContent || {};
const {
  loadWizardContent: loadWizardContentFromStorage,
  persistWizardContent,
  createLayoutSnapshot,
} = globalThis.PromoWizardStorage || {};
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
let validationErrors = {};
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
    textColor: "#172033",
    accentColor: "#156b5b",
    fontFamily: "Inter, Pretendard, sans-serif",
  },
  responsive: { contentMaxWidth: 1280, contentMinWidth: 1140, mobileBreakpoint: 720 },
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

function defaultWizardContent() {
  return createDefaultWizardContent({ includeSectionDesignRuns: true });
}

function loadWizardContent() {
  return loadWizardContentFromStorage({
    storage: localStorage,
    storageKey: storageKeys.wizardContent,
    backupKey: storageKeys.wizardContentLegacyBackup,
    schemaVersion: SECTION_INPUT_SCHEMA_VERSION,
    createDefault: defaultWizardContent,
    migrateSectionInputs: migrateLegacySectionInputs,
    objectKeys: ["templateInputs", "templateSectionOrders", "templateLayouts", "sectionDesignRuns"],
  });
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
  persistWizardContent(localStorage, storageKeys.wizardContent, contentState);
}

function wizardLayoutSnapshot() {
  if (!selectedWizardFormTemplate || !wizardResolvedLayout) return null;
  return createLayoutSnapshot({
    layoutRevision: wizardLayoutRevision,
    layoutIdentity: wizardLayoutIdentity,
    formTemplate: contentState.formTemplate,
    sections: wizardSectionDefinitions,
    sectionInputs: contentState.sectionInputs,
    sectionDesignRuns: contentState.sectionDesignRuns,
    designSpec: applyCreatePromoAppearance(wizardResolvedLayout),
  });
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
    runId: null,
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
  if (event.data?.type === "create-promo-section-ai-action") {
    if (event.source !== wizardLayoutFrame?.contentWindow) return;
    const section = wizardSectionDefinitions.find((item) => item.sectionKey === event.data.sectionKey);
    if (!section) return;
    const saved = sectionAiRun(section.sectionKey);
    const targetType = event.data.targetType === "item" ? "item" : "section-background";
    const targetItemKey = String(event.data.targetItemKey || "").trim();
    if (event.data.action === "generate") generateSectionAiDesign(section, targetType, targetItemKey);
    else if (event.data.action === "apply" && saved) {
      const savedTargetType = saved.constraintsSnapshot?.imageTarget?.type || "";
      const savedTargetItemKey = saved.constraintsSnapshot?.imageTarget?.type === "item"
        ? saved.constraintsSnapshot.imageTarget.itemKey
        : "";
      if (savedTargetType !== targetType || (targetType === "item" && savedTargetItemKey !== targetItemKey)) {
        window.alert("선택한 이미지 대상의 AI 생성 결과가 아닙니다. 다시 생성해 주세요.");
        return;
      }
      applySectionAiDesign(section, saved);
    }
    else if (event.data.action === "remove-background") removeSectionAiBackground(section);
    return;
  }
  if (event.data?.type === "create-promo-remove-image") {
    if (event.source !== wizardLayoutFrame?.contentWindow) return;
    const section = wizardSectionDefinitions.find((item) => item.sectionKey === event.data.sectionKey);
    const item = section?.items?.find((candidate) => candidate.itemKey === event.data.itemKey);
    if (!section || !item || item.fieldKind !== "image" || item.isLocked) return;
    setSectionValue(`${section.sectionKey}.${item.itemKey}`, {
      source: item.image?.allowedSources?.[0] || "url",
      value: "",
      description: "",
      alt: "",
    });
    postWizardLayoutSnapshot();
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

function fieldValue(group, key) {
  return contentState[group]?.[key] || "";
}

function setFieldValue(group, key, value) {
  contentState[group][key] = value;
  if (validationErrors[key] && String(value || "").trim()) delete validationErrors[key];
  if (key === "promotionPurpose" && value !== "기타") {
    contentState.promo.promotionPurposeOther = "";
    delete validationErrors.promotionPurposeOther;
  }
  saveWizardContent();
}

function setSectionValue(path, value) {
  setValueAtPath(contentState.sectionInputs, path, value);
  saveWizardContent();
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

function createDynamicSectionField(sectionKey, item) {
  if (item.isLocked) return createLockedSectionField(sectionKey, item);
  if (item.fieldKind === "cta") return createCtaSectionField(sectionKey, item);
  if (item.fieldKind === "image") return createImageSectionField(sectionKey, item);

  return createSectionField({
    path: `${sectionKey}.${item.itemKey}`,
    label: item.isRequired ? `${item.name} *` : item.name,
    type: "textarea",
    rows: item.textType === "multi" ? 4 : 3,
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

  const currentImage = valueAtPath(contentState.sectionInputs, path);
  if (String(currentImage?.value || "").trim()) {
    const remove = document.createElement("button");
    remove.type = "button";
    remove.className = "secondary-action image-content-remove";
    remove.textContent = "이미지 삭제";
    remove.addEventListener("click", () => {
      if (!window.confirm(`${item.name} 이미지를 삭제할까요?`)) return;
      setSectionValue(path, {
        source: sources[0] || "url",
        value: "",
        description: "",
        alt: "",
      });
      renderStep();
    });
    wrapper.append(remove);
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

function sectionAiRun(sectionKey) {
  return contentState.sectionDesignRuns?.[sectionKey] || null;
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
  const contentChanged = JSON.stringify(saved.sourceInputs) !== JSON.stringify(contentState.sectionInputs?.[sectionKey] || {});
  const generatedBackgroundColor = String(saved.inputSnapshot?.design?.backgroundColor || "").toLowerCase();
  const currentBackgroundColor = String(wizardResolvedLayout?.theme?.backgroundColor || FALLBACK_LAYOUT.theme.backgroundColor).toLowerCase();
  return contentChanged || Boolean(generatedBackgroundColor && generatedBackgroundColor !== currentBackgroundColor);
}

function sectionAiIsProcessing(saved) {
  return ["queued", "analyzing_content", "generating_layout", "validating_layout", "generating_assets", "validating_assets"].includes(saved?.status);
}

function isLegacySectionAiImage(value) {
  const currentUrl = String(value?.value || "").trim();
  return value?.source === "ai" || currentUrl.startsWith("/api/promo-section-design-image?");
}

function clearLegacySectionAiImages(section) {
  const configuredItemTargets = new Set(section.aiDesign?.imageTargetItemKeys || []);
  (section.items || []).forEach((item) => {
    if (item.fieldKind !== "image" || item.isLocked) return;
    if (configuredItemTargets.has(item.itemKey)) return;
    const path = `${section.sectionKey}.${item.itemKey}`;
    const current = valueAtPath(contentState.sectionInputs, path);
    if (!isLegacySectionAiImage(current)) return;
    setValueAtPath(contentState.sectionInputs, path, {
      ...current,
      source: item.image?.allowedSources?.[0] || "url",
      value: "",
      description: "",
      alt: "",
    });
  });
}

function sectionAiHasAppliedBackground(section) {
  const style = wizardResolvedLayout?.sectionStyles?.[section.sectionKey] || {};
  if (String(style.backgroundImage || "").trim()) return true;
  return (section.items || []).some((item) => (
    item.fieldKind === "image"
      && isLegacySectionAiImage(valueAtPath(contentState.sectionInputs, `${section.sectionKey}.${item.itemKey}`))
  ));
}

function removeSectionAiBackground(section) {
  if (!window.confirm(`${section.name || section.sectionKey}의 AI 배경 이미지를 삭제할까요?`)) return;
  wizardResolvedLayout = wizardResolvedLayout || JSON.parse(JSON.stringify(wizardBaseLayout || FALLBACK_LAYOUT));
  wizardResolvedLayout.sectionStyles = { ...(wizardResolvedLayout.sectionStyles || {}) };
  const current = { ...(wizardResolvedLayout.sectionStyles[section.sectionKey] || {}) };
  [
    "backgroundImage", "backgroundSize", "backgroundPosition", "backgroundRepeat",
    "backgroundFadeSafeArea",
  ].forEach((key) => delete current[key]);
  if (Object.keys(current).length) wizardResolvedLayout.sectionStyles[section.sectionKey] = current;
  else delete wizardResolvedLayout.sectionStyles[section.sectionKey];
  clearLegacySectionAiImages(section);
  saveWizardContent();
  postWizardLayoutSnapshot();
}

async function generateSectionAiDesign(section, targetType = "section-background", targetItemKey = "") {
  const sectionKey = section.sectionKey;
  const requestedTargetType = targetType === "item" ? "item" : "section-background";
  const sectionInputs = JSON.parse(JSON.stringify(contentState.sectionInputs?.[sectionKey] || {}));
  const previous = sectionAiRun(sectionKey);
  const previousTargetType = previous?.constraintsSnapshot?.imageTarget?.type || "";
  const previousTargetItemKey = previous?.constraintsSnapshot?.imageTarget?.type === "item"
    ? previous.constraintsSnapshot.imageTarget.itemKey
    : "";
  const processAssetJobs = async (run) => {
    const listed = await fetchJson(`/api/promo-section-design-assets?runId=${encodeURIComponent(run.id)}`);
    let latestRun = run;
    for (const asset of (listed.assets || []).filter((item) => ["queued", "failed"].includes(item.status))) {
      const processedAsset = await fetchJson("/api/promo-section-design-asset-process", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ jobId: asset.id }),
      });
      latestRun = processedAsset.run || latestRun;
      saveSectionAiRun(sectionKey, latestRun, sectionInputs);
      postWizardLayoutSnapshot();
    }
    return latestRun;
  };
  const canRetryPlannedAssets = previous?.id && previous?.effectivePatch
    && previous?.status === "failed" && !sectionAiIsStale(sectionKey, previous)
    && previousTargetType === requestedTargetType
    && (requestedTargetType !== "item" || previousTargetItemKey === String(targetItemKey || "").trim());
  if (canRetryPlannedAssets) {
    postWizardLayoutSnapshot();
    try {
      const retried = await processAssetJobs(previous);
      saveSectionAiRun(sectionKey, retried, sectionInputs);
      if (retried.status === "ready") await applySectionAiDesign(section, retried);
    } catch (error) {
      contentState.sectionDesignRuns[sectionKey] = { ...previous, status: "failed", errorMessage: error.message || "섹션 이미지 재생성에 실패했습니다." };
      saveWizardContent();
    } finally { postWizardLayoutSnapshot(); }
    return;
  }
  const canRetryImage = previous?.status === "failed"
    && previous.layoutResult?.imageRequest
    && !sectionAiIsStale(sectionKey, previous)
    && previousTargetType === requestedTargetType
    && previousTargetItemKey === String(targetItemKey || "").trim();
  if (canRetryImage) {
    postWizardLayoutSnapshot();
    try {
      const retried = await fetchJson("/api/promo-section-design-image-process", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ runId: previous.id }),
      });
      saveSectionAiRun(sectionKey, retried.run, sectionInputs);
      if (retried.run?.status === "ready") await applySectionAiDesign(section, retried.run);
    } catch (error) {
      contentState.sectionDesignRuns[sectionKey] = {
        ...contentState.sectionDesignRuns[sectionKey],
        status: "failed",
        errorMessage: error.message || "섹션 이미지 재생성에 실패했습니다.",
      };
      saveWizardContent();
    } finally {
      postWizardLayoutSnapshot();
    }
    return;
  }
  saveSectionAiRun(sectionKey, {
    status: "queued",
    constraintsSnapshot: {
      imageTarget: requestedTargetType === "item"
        ? { type: "item", sectionKey, itemKey: String(targetItemKey || "").trim() }
        : { type: "section-background", sectionKey },
    },
  }, sectionInputs);
  postWizardLayoutSnapshot();
  try {
    const created = await fetchJson("/api/promo-section-design-runs", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        promoRunId: null,
        formTemplateId: selectedWizardFormTemplate?.id,
        sectionKey,
        sectionInputs,
        targetType: requestedTargetType,
        targetItemKey: String(targetItemKey || "").trim() || null,
        requestMode: "full",
        backgroundColor: wizardResolvedLayout?.theme?.backgroundColor || FALLBACK_LAYOUT.theme.backgroundColor,
      }),
    });
    saveSectionAiRun(sectionKey, created.run, sectionInputs);
    postWizardLayoutSnapshot();
    if (created.run.status === "ready") {
      await applySectionAiDesign(section, created.run);
      return;
    }
    if (created.run.status === "applied") return;
    const processed = created.run.status === "generating_assets"
      ? created
      : await fetchJson("/api/promo-section-design-plan-process", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ runId: created.run.id }),
      });
    let completedRun = processed.run;
    saveSectionAiRun(sectionKey, completedRun, sectionInputs);
    if (processed.run.status === "generating_assets") {
      completedRun = await processAssetJobs(processed.run);
      saveSectionAiRun(sectionKey, completedRun, sectionInputs);
    }
    if (completedRun?.status === "ready") await applySectionAiDesign(section, completedRun);
  } catch (error) {
    contentState.sectionDesignRuns[sectionKey] = {
      ...contentState.sectionDesignRuns[sectionKey],
      status: "failed",
      errorMessage: error.message || "섹션 AI 디자인 생성에 실패했습니다.",
    };
    saveWizardContent();
  } finally {
    postWizardLayoutSnapshot();
  }
}

async function applySectionAiDesign(section, saved) {
  if (!saved?.id || !saved.layoutResult?.layoutPatch) return;
  if (sectionAiIsStale(section.sectionKey, saved)) {
    window.alert("섹션 콘텐츠가 생성 시점과 달라졌습니다. AI 디자인을 다시 생성해 주세요.");
    return;
  }
  try {
    saveSectionAiRun(section.sectionKey, { ...saved, status: "applying" }, contentState.sectionInputs?.[section.sectionKey]);
    postWizardLayoutSnapshot();
    const result = await fetchJson("/api/promo-section-design-apply", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        runId: saved.id,
        sectionInputs: contentState.sectionInputs?.[section.sectionKey] || {},
        backgroundColor: wizardResolvedLayout?.theme?.backgroundColor || FALLBACK_LAYOUT.theme.backgroundColor,
      }),
    });
    const appliedRun = result.run;
    if (!appliedRun?.layoutResult?.layoutPatch) throw new Error("서버가 검증된 섹션 레이아웃을 반환하지 않았습니다.");
    const patch = appliedRun.layoutResult.layoutPatch;
    wizardResolvedLayout = wizardResolvedLayout || JSON.parse(JSON.stringify(wizardBaseLayout || FALLBACK_LAYOUT));
    wizardResolvedLayout.sectionStyles = { ...(wizardResolvedLayout.sectionStyles || {}) };
    Object.entries(patch.sectionStyles || {}).forEach(([key, value]) => {
      wizardResolvedLayout.sectionStyles[key] = { ...(wizardResolvedLayout.sectionStyles[key] || {}), ...(value || {}) };
    });
    wizardResolvedLayout.itemStyles = { ...(wizardResolvedLayout.itemStyles || {}) };
    Object.entries(patch.itemStyles || {}).forEach(([key, value]) => {
      wizardResolvedLayout.itemStyles[key] = { ...(wizardResolvedLayout.itemStyles[key] || {}), ...(value || {}) };
    });
    const appliedImages = Array.isArray(appliedRun.imageResult?.assets)
      ? appliedRun.imageResult.assets
      : (appliedRun.imageResult?.proxyUrl ? [appliedRun.imageResult] : []);
    for (const appliedImage of appliedImages) {
      const imageTarget = appliedImage.target || appliedRun.layoutResult?.imageRequest?.target;
      if (imageTarget?.type === "item" && imageTarget.itemKey) {
        const targetItem = section.items?.find((item) => item.itemKey === imageTarget.itemKey && item.fieldKind === "image");
        if (!targetItem || targetItem.isLocked || !targetItem.image?.allowedSources?.includes("ai")) {
          throw new Error("관리자 정책에서 선택한 AI 이미지 Item을 현재 섹션에 적용할 수 없습니다.");
        }
        setValueAtPath(contentState.sectionInputs, `${section.sectionKey}.${targetItem.itemKey}`, {
          source: "ai",
          value: appliedImage.proxyUrl,
          description: appliedImage.prompt || appliedRun.layoutResult?.imageRequest?.prompt || "",
          alt: targetItem.name || section.name || "AI generated promotion image",
        });
        const targetStyleKey = `${section.sectionKey}.${targetItem.itemKey}`;
        const currentItemStyle = { ...(wizardResolvedLayout.itemStyles?.[targetStyleKey] || {}) };
        wizardResolvedLayout.itemStyles[targetStyleKey] = {
          widthPct: currentItemStyle.widthPct || 32,
          aspectRatio: currentItemStyle.aspectRatio || targetItem.image?.aspectRatio || appliedRun.constraintsSnapshot?.imageAspectRatio || "1/1",
          aspectRatioLocked: currentItemStyle.aspectRatioLocked !== false,
          imageFit: currentItemStyle.imageFit || "contain",
          imagePosition: currentItemStyle.imagePosition || "center center",
          shape: currentItemStyle.shape || "square",
          decorative: currentItemStyle.decorative === true,
          accessibleLabel: currentItemStyle.accessibleLabel || targetItem.name || section.name || "Promotion image",
          ...currentItemStyle,
        };
        const currentSectionStyle = { ...(wizardResolvedLayout.sectionStyles[section.sectionKey] || {}) };
        if (String(currentSectionStyle.backgroundImage || "").startsWith("/api/promo-section-design-image?")) {
          [
            "backgroundImage", "backgroundSize", "backgroundPosition", "backgroundRepeat",
            "backgroundFadeSafeArea",
          ]
            .forEach((key) => delete currentSectionStyle[key]);
          wizardResolvedLayout.sectionStyles[section.sectionKey] = currentSectionStyle;
        }
      } else {
        clearLegacySectionAiImages(section);
        const layoutVariant = appliedRun.layoutResult?.layoutVariant;
        const safeArea = layoutVariant === "split-left"
          ? "right-copy"
          : layoutVariant === "split-right"
            ? "left-copy"
            : layoutVariant === "centered-hero"
              ? "center-copy"
              : appliedImage.safeArea || appliedRun.layoutResult?.imageRequest?.safeArea || "left-copy";
        const backgroundFadeMode = safeArea === "right-copy"
          ? "right"
          : safeArea === "center-copy" ? "both" : "left";
        const currentSectionStyle = wizardResolvedLayout.sectionStyles[section.sectionKey] || {};
        wizardResolvedLayout.sectionStyles[section.sectionKey] = {
          ...currentSectionStyle,
          backgroundImage: appliedImage.proxyUrl,
          backgroundSize: "contain",
          backgroundPosition: "center center",
          backgroundRepeat: "no-repeat",
          backgroundFadeSafeArea: safeArea,
          backgroundFadeMode: ["none", "left", "right", "both"].includes(currentSectionStyle.backgroundFadeMode)
            ? currentSectionStyle.backgroundFadeMode
            : backgroundFadeMode,
          backgroundFadeStrength: currentSectionStyle.backgroundFadeStrength || "medium",
          backgroundFadeColor: appliedImage.backgroundColor
            || currentSectionStyle.backgroundColor
            || wizardResolvedLayout?.theme?.backgroundColor
            || FALLBACK_LAYOUT.theme.backgroundColor,
        };
      }
    }
    saveSectionAiRun(section.sectionKey, appliedRun, contentState.sectionInputs?.[section.sectionKey]);
    postWizardLayoutSnapshot();
  } catch (error) {
    saveSectionAiRun(section.sectionKey, {
      ...saved,
      status: "failed",
      errorMessage: error.message || "AI 디자인을 적용하지 못했습니다.",
    }, contentState.sectionInputs?.[section.sectionKey]);
    postWizardLayoutSnapshot();
    window.alert(error.message || "AI 디자인을 적용하지 못했습니다.");
  }
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
  layoutPanel.append(layoutHeader);
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
  forward.disabled = contentSubstep === "template" && !wizardSectionConfigurationReady();
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
loadWizardSectionDefinitions();
