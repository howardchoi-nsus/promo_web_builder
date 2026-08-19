const {
  STEPS: steps,
  CONTENT_SUBSTEPS,
  resolveInitialStep,
  stepIndex,
  previousStep,
  nextStep,
} = globalThis.PromoCreateFlow || {};

const storageKeys = {
  wizardContent: "promoPrototype.createPromo.content.v1",
  wizardContentLegacyBackup: "promoPrototype.createPromo.content.legacyBackup.v1",
  wizardSessionId: "promoPrototype.createPromo.sessionId.v1",
};

const SECTION_INPUT_SCHEMA_VERSION = 4;
const LAYOUT_CACHE_CONTRACT_VERSION = 2;
const {
  appendTextElement,
  valueAtPath,
  setValueAtPath,
  fetchJson,
} = globalThis.PromoWizardCore || {};
const {
  listPublicTemplates,
  loadPublicTemplate,
  resolveTemplate,
} = globalThis.PromoWizardTemplateService || {};
const {
  createDefaultWizardContent,
  migrateLegacySectionInputs,
  defaultSectionInputsFromDefinitions,
  mergeSectionInputs,
} = globalThis.PromoWizardContent || {};
const {
  syncFromLegacy: syncPromotionOverviewFromLegacy,
  applyToLegacy: applyPromotionOverviewToLegacy,
  fingerprint: promotionOverviewFingerprint,
  requestFingerprint: promotionOverviewRequestFingerprint,
} = globalThis.PromoPromotionOverview || {};
const {
  loadWizardContent: loadWizardContentFromStorage,
  persistWizardContent,
  createLayoutSnapshot,
} = globalThis.PromoWizardStorage || {};
const {
  clone: cloneEditorValue,
  shouldAcceptRevision,
  createBridgeSnapshot,
  normalizeEditorChange,
} = globalThis.PromoEditorSnapshotContract || {};
const WEB_OUTPUT_SNAPSHOT_STORAGE_KEY = "promoVisualEditor.snapshot.v1";
const CONTENT_SUBSTEP_STORAGE_KEY = "promoPrototype.createPromo.contentSubstep.v1";
const CURRENT_STEP_STORAGE_KEY = "promoPrototype.createPromo.currentStep.v3";
const LEGACY_CURRENT_STEP_STORAGE_KEY = "promoPrototype.createPromo.currentStep.v2";
const {
  normalizeLayoutIdentity,
  sameLayoutIdentity,
  hasLayoutOverrides,
  resolveLayoutCache,
  sameSectionOrder,
  resolveSectionOrderCache,
} = globalThis.CreatePromoLayoutCache || {};

let contentSubstep = CONTENT_SUBSTEPS.includes(sessionStorage.getItem(CONTENT_SUBSTEP_STORAGE_KEY))
  ? sessionStorage.getItem(CONTENT_SUBSTEP_STORAGE_KEY)
  : "overview";
const storedCurrentStep = sessionStorage.getItem(CURRENT_STEP_STORAGE_KEY);
const legacyCurrentStep = sessionStorage.getItem(LEGACY_CURRENT_STEP_STORAGE_KEY);
let currentStep = resolveInitialStep(storedCurrentStep, contentSubstep, legacyCurrentStep);
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
let wizardDesignTokens = null;
let wizardDesignTokenSets = [];
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
const wizardEditorBridge = globalThis.PromoEditorBridge?.createEditorBridge({
  getFrame: () => wizardLayoutFrame,
});
let wizardLayoutLogTimer = null;
let wizardSnapshotRevision = 0;
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
contentState.promotionOverview = syncPromotionOverviewFromLegacy(contentState);
let overviewInputMode = contentState.promotionOverview.inputMode || "structured";
let overviewNaturalLanguage = contentState.promotionOverview.rawNaturalLanguage || "";
let overviewAnalysis = contentState.promotionOverviewDraft?.requestFingerprint
  === promotionOverviewRequestFingerprint(overviewNaturalLanguage)
  ? contentState.promotionOverviewDraft : null;
let overviewAnalysisLoading = false;
let overviewAnalysisError = "";
let overviewAnalysisRequestId = 0;
let templateRecommendationState = contentState.templateRecommendation?.overviewFingerprint
  ? contentState.templateRecommendation : null;
let templateRecommendationLoading = false;
let templateRecommendationError = "";
let templateRecommendationRequestId = 0;
let templateCompositionProposal = contentState.templateCompositionProposal?.requestId
  ? contentState.templateCompositionProposal : null;
let templateCompositionLoading = false;
let templateCompositionError = "";
let templateCompositionRequestId = 0;

function selectedDesignTokenSet() {
  return wizardDesignTokenSets.find((tokenSet) => (
    tokenSet.versionId === contentState.designTokenSetVersionId
  )) || null;
}

function designTokenValue(tokenSet, keys, fallback) {
  for (const key of keys) {
    const value = String(tokenSet?.values?.[key] || "").trim();
    if (value) return value;
  }
  return fallback;
}

function toWizardDesignTokens(tokenSet) {
  if (!tokenSet) return null;
  return {
    setKey: tokenSet.setKey,
    name: tokenSet.name,
    version: tokenSet.version,
    versionId: tokenSet.versionId,
    values: tokenSet.values || {},
    sourceValues: tokenSet.sourceValues || [],
  };
}

const stepButtons = Array.from(document.querySelectorAll(".step"));
const placeholders = document.getElementById("step-placeholders");
const status = document.getElementById("step-status");
const shellStatus = document.getElementById("wizard-shell-status");
const prev = document.getElementById("prev-step");
const next = document.getElementById("next-step");

function applyCreatePromoAppearance(layout = FALLBACK_LAYOUT) {
  return JSON.parse(JSON.stringify(layout || FALLBACK_LAYOUT));
}

function createAppearanceControls() {
  const controls = document.createElement("section");
  controls.className = "appearance-controls layout-design-token-controls";
  appendTextElement(controls, "h3", "", "디자인 토큰");
  appendTextElement(
    controls,
    "p",
    "appearance-fieldset__description",
    "선택한 디자인 토큰의 색상, 글꼴, 간격과 컴포넌트 스타일이 이후 단계와 웹 출력에 적용됩니다."
  );
  const choices = document.createElement("div");
  choices.className = "appearance-choices";
  choices.setAttribute("role", "radiogroup");
  wizardDesignTokenSets.forEach((tokenSet) => {
    const selected = tokenSet.versionId === contentState.designTokenSetVersionId;
    const button = document.createElement("button");
    button.type = "button";
    button.className = `appearance-choice${selected ? " is-selected" : ""}`;
    button.setAttribute("role", "radio");
    button.setAttribute("aria-checked", String(selected));
    const swatch = document.createElement("span");
    swatch.className = "appearance-choice__swatch";
    swatch.style.backgroundColor = designTokenValue(
      tokenSet,
      ["--promo-accent", "--app-accent"],
      "#2563eb"
    );
    button.append(swatch);
    appendTextElement(button, "strong", "", tokenSet.name || tokenSet.setKey);
    appendTextElement(button, "small", "", `v${tokenSet.version || 1}`);
    button.addEventListener("click", () => {
      contentState.designTokenSetVersionId = tokenSet.versionId;
      wizardDesignTokens = toWizardDesignTokens(tokenSet);
      if (contentState.formTemplate) contentState.formTemplate.designTokens = wizardDesignTokens;
      saveWizardContent();
      renderStep();
    });
    choices.append(button);
  });
  controls.append(choices);
  if (!wizardDesignTokenSets.length) {
    appendTextElement(
      controls,
      "p",
      "error-copy",
      "활성화된 디자인 토큰이 없습니다. 설정에서 디자인 토큰을 먼저 활성화해 주세요."
    );
  }
  return controls;
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
    objectKeys: [
      "promotionOverview", "promotionOverviewDraft", "templateRecommendation", "templateCompositionProposal",
      "templateInputs", "templateDefaultContents",
      "templateSectionOrders", "templateSectionDefinitions", "templateLayouts", "sectionDesignRuns",
    ],
  });
}

async function loadWizardSectionDefinitions() {
  wizardSectionDefinitionsLoading = true;
  wizardSectionDefinitionsError = "";
  try {
    const [templatesResult, tokenResult] = await Promise.all([
      listPublicTemplates(),
      fetchJson("/api/design-token-sets?scope=public"),
    ]);
    wizardFormTemplates = templatesResult;
    wizardDesignTokenSets = Array.isArray(tokenResult?.tokenSets) ? tokenResult.tokenSets : [];
    if (!wizardDesignTokenSets.some((tokenSet) => (
      tokenSet.versionId === contentState.designTokenSetVersionId
    ))) {
      contentState.designTokenSetVersionId = (
        wizardDesignTokenSets.find((tokenSet) => tokenSet.isDefault)
        || wizardDesignTokenSets[0]
      )?.versionId || "";
    }
    if (!wizardFormTemplates.length) throw new Error("활성화된 프로모션 템플릿이 없습니다.");
    const target = resolveTemplate(wizardFormTemplates, contentState.formTemplate);
    if (!target) throw new Error("선택할 수 있는 활성 프로모션 템플릿이 없습니다.");
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
  const result = options.prefetchedResult || await loadPublicTemplate(templateId);
  const nextDefinitions = Array.isArray(result.sections) ? result.sections : [];
  if (!nextDefinitions.length || !nextDefinitions.some((section) => (section.items || []).length)) {
    throw new Error("선택한 템플릿에 Wizard 입력 항목이 없습니다. 관리자에게 템플릿 구성을 요청해 주세요.");
  }
  selectedWizardFormTemplate = result.template;
  const adminSectionOrder = nextDefinitions.map((section) => section.sectionKey);
  const savedSectionOrder = contentState.templateSectionOrders[result.template.templateKey];
  const nextIdentity = layoutIdentityFromTemplateResult(result);
  const savedDefinitions = contentState.templateSectionDefinitions?.[result.template.templateKey];
  const effectiveDefinitions = (
    savedDefinitions
    && layoutIdentityKey(savedDefinitions.layoutIdentity) === layoutIdentityKey(nextIdentity)
    && Array.isArray(savedDefinitions.sections)
    && savedDefinitions.sections.length
  ) ? savedDefinitions.sections : nextDefinitions;
  const sectionOrderResolution = resolveSectionOrderCache({
    savedOrder: savedSectionOrder,
    incomingIdentity: nextIdentity,
    defaultOrder: adminSectionOrder,
  });
  const savedOrder = sectionOrderResolution.resolvedOrder;
  const byKey = new Map(effectiveDefinitions.map((section) => [section.sectionKey, section]));
  const savedMovable = savedOrder.map((key) => byKey.get(key)).filter(templateSectionCanReorder);
  const movableQueue = [
    ...savedMovable,
    ...effectiveDefinitions.filter((section) => templateSectionCanReorder(section) && !savedOrder.includes(section.sectionKey)),
  ];
  wizardSectionDefinitions = effectiveDefinitions.map((section) => (
    templateSectionCanReorder(section) ? movableQueue.shift() : section
  ));
  expandedTemplateSectionKeys = new Set(wizardSectionDefinitions.slice(0, 1).map((section) => section.sectionKey));
  wizardSectionConfigRevision = String(result.configRevision || "");
  wizardLayoutRevision = Number(result.layoutRevision || 1);
  wizardRenderer = result.renderer || { key: "default-promo-renderer", version: 1 };
  wizardDesignTokens = toWizardDesignTokens(selectedDesignTokenSet());
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
    designTokens: wizardDesignTokens,
    configRevision: wizardSectionConfigRevision,
    layoutRevision: wizardLayoutRevision,
    renderer: wizardRenderer,
    layoutIdentity: wizardLayoutIdentity,
  };
  contentState.sectionInputs = mergeSectionInputs(
    contentState.templateInputs[result.template.templateKey] || {},
    wizardSectionDefinitions,
    result.defaultContent || {},
    contentState.templateDefaultContents[result.template.templateKey] || {}
  );
  contentState.templateDefaultContents[result.template.templateKey] = result.defaultContent || {};
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
      const activeTemplates = await listPublicTemplates();
      if (requestId !== wizardTemplateRefreshRequestId) return false;
      if (!activeTemplates.length) throw new Error("활성화된 프로모션 템플릿이 없습니다.");
      wizardFormTemplates = activeTemplates;
      const target = resolveTemplate(activeTemplates, selectedWizardFormTemplate);
      if (!target) throw new Error("선택할 수 있는 활성 프로모션 템플릿이 없습니다.");
      const detail = await loadPublicTemplate(target.id);
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
      if (currentStep === "layout") renderStep();
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
  contentState.promotionOverview = syncPromotionOverviewFromLegacy(contentState);
  contentState.promotionOverview.inputMode = overviewInputMode;
  contentState.promotionOverview.rawNaturalLanguage = overviewNaturalLanguage;
  contentState.templateSectionDefinitions ||= {};
  if (selectedWizardFormTemplate?.templateKey) {
    contentState.templateInputs[selectedWizardFormTemplate.templateKey] = contentState.sectionInputs;
    contentState.templateSectionOrders[selectedWizardFormTemplate.templateKey] = {
      contractVersion: LAYOUT_CACHE_CONTRACT_VERSION,
      layoutIdentity: wizardLayoutIdentity,
      baseOrder: [...wizardBaseSectionOrder],
      resolvedOrder: wizardSectionDefinitions.map((section) => section.sectionKey),
    };
    contentState.templateSectionDefinitions[selectedWizardFormTemplate.templateKey] = {
      contractVersion: LAYOUT_CACHE_CONTRACT_VERSION,
      layoutIdentity: wizardLayoutIdentity,
      sections: JSON.parse(JSON.stringify(wizardSectionDefinitions)),
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
  const snapshot = createLayoutSnapshot({
    layoutRevision: wizardLayoutRevision,
    layoutIdentity: wizardLayoutIdentity,
    formTemplate: contentState.formTemplate,
    sections: wizardSectionDefinitions,
    sectionInputs: contentState.sectionInputs,
    sectionDesignRuns: contentState.sectionDesignRuns,
    designSpec: applyCreatePromoAppearance(wizardResolvedLayout),
  });
  return createBridgeSnapshot(snapshot, wizardSnapshotRevision);
}

function postWizardLayoutSnapshot() {
  wizardSnapshotRevision += 1;
  const snapshot = wizardLayoutSnapshot();
  wizardEditorBridge?.postSnapshot(snapshot);
}

function resetWizardLayout() {
  wizardResolvedLayout = cloneEditorValue(wizardBaseLayout || FALLBACK_LAYOUT);
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
  if (!wizardEditorBridge?.isTrustedEvent(event)) return;
  if (event.data?.type === "promo-wizard-layout-ready") {
    postWizardLayoutSnapshot();
    return;
  }
  if (event.data?.type === "create-promo-auto-register-request") {
    if (event.data.sectionInputs && typeof event.data.sectionInputs === "object") {
      contentState.sectionInputs = mergeSectionInputs(event.data.sectionInputs);
    }
    const registeredCount = autoRegisterPromoOverview();
    wizardEditorBridge.post({
      type: "create-promo-auto-register-result",
      registeredCount,
    });
    return;
  }
  if (event.data?.type === "create-promo-section-ai-action") {
    const section = wizardSectionDefinitions.find((item) => item.sectionKey === event.data.sectionKey);
    if (!section) return;
    const saved = sectionAiRun(section.sectionKey);
    const targetType = event.data.targetType === "item" ? "item" : "section-background";
    const targetItemKey = String(event.data.targetItemKey || "").trim();
    const targetFieldKey = String(event.data.targetFieldKey || "").trim();
    const imageGuidance = String(event.data.imageGuidance || "").trim();
    const imageSafeArea = String(event.data.imageSafeArea || "").trim();
    const keyVisualTextMode = event.data.keyVisualTextMode === "explicit" ? "explicit" : "none";
    const keyVisualText = String(event.data.keyVisualText || "").replace(/\s+/g, " ").trim();
    if (event.data.action === "generate-layout") generateSectionAiLayout(section);
    else if (event.data.action === "generate") {
      generateSectionAiDesign(
        section, targetType, targetItemKey, targetFieldKey, imageGuidance, imageSafeArea,
        keyVisualTextMode, keyVisualText,
      );
    }
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
    const section = wizardSectionDefinitions.find((item) => item.sectionKey === event.data.sectionKey);
    const item = section?.items?.find((candidate) => candidate.itemKey === event.data.itemKey);
    const field = String(event.data.fieldKey || "").trim()
      ? (item?.fields || []).find((candidate) => candidate.fieldKey === event.data.fieldKey)
      : null;
    const imageDefinition = field || item;
    if (!section || !item || imageDefinition?.fieldKind !== "image" || item.isLocked || field?.isLocked) return;
    const valuePath = field
      ? `${section.sectionKey}.${item.itemKey}.fields.${field.fieldKey}`
      : `${section.sectionKey}.${item.itemKey}`;
    setSectionValue(valuePath, {
      source: imageDefinition.image?.allowedSources?.[0] || "url",
      value: "",
      description: "",
      alt: "",
    });
    if (contentState.sectionDesignRuns) delete contentState.sectionDesignRuns[section.sectionKey];
    saveWizardContent();
    postWizardLayoutSnapshot();
    return;
  }
  if (event.data?.type !== "promo-wizard-layout-change" || !event.data.designSpec) return;
  const change = normalizeEditorChange(event.data);
  if (!change || !shouldAcceptRevision(change.snapshotRevision, wizardSnapshotRevision)) return;
  const previousTheme = wizardResolvedLayout?.theme || FALLBACK_LAYOUT.theme;
  const incomingLayout = change.designSpec;
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
  if (change.sectionInputs) {
    contentState.sectionInputs = change.sectionInputs;
  }
  if (change.sectionSnapshot) {
    wizardSectionDefinitions = change.sectionSnapshot;
    if (change.sectionOrder?.length) {
      const bySectionKey = new Map(wizardSectionDefinitions.map((section) => [section.sectionKey, section]));
      wizardSectionDefinitions = [
        ...change.sectionOrder.map((sectionKey) => bySectionKey.get(sectionKey)).filter(Boolean),
        ...wizardSectionDefinitions.filter((section) => !change.sectionOrder.includes(section.sectionKey)),
      ];
    }
    contentState.sectionInputs = mergeSectionInputs(
      contentState.sectionInputs,
      wizardSectionDefinitions,
      {},
      {},
    );
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
  contentState.promotionOverview.inputMode = overviewInputMode;
  contentState.promotionOverview.rawNaturalLanguage = overviewNaturalLanguage;
  syncPromotionOverviewFromLegacy(contentState);
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
    ["leadText", contentState.promo.leadText],
    ["promotionPurpose", contentState.promo.promotionPurpose],
    ["market", contentState.promo.market],
    ["audience", contentState.simpleBrief.audience],
    ["campaignTone", contentState.simpleBrief.campaignTone],
    ["mainOffer", contentState.simpleBrief.mainOffer],
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
    ["leadText", contentState.promo.leadText],
    ["promotionPurpose", contentState.promo.promotionPurpose],
    ["market", contentState.promo.market],
    ["audience", contentState.simpleBrief.audience],
    ["campaignTone", contentState.simpleBrief.campaignTone],
    ["mainOffer", contentState.simpleBrief.mainOffer],
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

function openWebOutputWindow() {
  return window.open("/prototype/visual-output.html", "_blank", "noopener");
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
    currentStep = contentSubstep === "overview" ? "overview" : "layout";
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
  currentStep = "output";
  renderStep();
  openWebOutputWindow();
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

function resolvedSectionBackgroundColor(sectionKey) {
  const sectionColor = String(
    wizardResolvedLayout?.sectionStyles?.[sectionKey]?.backgroundColor || ""
  ).trim();
  if (/^#[0-9a-f]{6}$/i.test(sectionColor)) return sectionColor.toLowerCase();
  const themeColor = String(
    wizardResolvedLayout?.theme?.backgroundColor || FALLBACK_LAYOUT.theme.backgroundColor
  ).trim();
  return /^#[0-9a-f]{6}$/i.test(themeColor)
    ? themeColor.toLowerCase()
    : FALLBACK_LAYOUT.theme.backgroundColor;
}

function sectionAiIsStale(sectionKey, saved = sectionAiRun(sectionKey)) {
  if (!saved?.sourceInputs) return false;
  const contentChanged = JSON.stringify(saved.sourceInputs) !== JSON.stringify(contentState.sectionInputs?.[sectionKey] || {});
  const generatedBackgroundColor = String(saved.inputSnapshot?.design?.backgroundColor || "").toLowerCase();
  const currentBackgroundColor = resolvedSectionBackgroundColor(sectionKey);
  return contentChanged || Boolean(generatedBackgroundColor && generatedBackgroundColor !== currentBackgroundColor);
}

function sectionAiIsProcessing(saved) {
  return ["queued", "analyzing_content", "generating_layout", "validating_layout", "generating_assets", "validating_assets", "applying"].includes(saved?.status);
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
  if (!window.confirm(`${section.name || section.sectionKey}의 AI 키비주얼을 삭제할까요?`)) return;
  wizardResolvedLayout = wizardResolvedLayout || JSON.parse(JSON.stringify(wizardBaseLayout || FALLBACK_LAYOUT));
  wizardResolvedLayout.sectionStyles = { ...(wizardResolvedLayout.sectionStyles || {}) };
  const current = { ...(wizardResolvedLayout.sectionStyles[section.sectionKey] || {}) };
  [
    "backgroundImage", "backgroundSize", "backgroundPosition", "backgroundRepeat",
    "backgroundFadeSafeArea", "backgroundFitMode", "backgroundAllowedFitModes", "backgroundFadeStops",
  ].forEach((key) => delete current[key]);
  if (Object.keys(current).length) wizardResolvedLayout.sectionStyles[section.sectionKey] = current;
  else delete wizardResolvedLayout.sectionStyles[section.sectionKey];
  clearLegacySectionAiImages(section);
  if (contentState.sectionDesignRuns) delete contentState.sectionDesignRuns[section.sectionKey];
  saveWizardContent();
  postWizardLayoutSnapshot();
}

function createSectionAiGenerationRequestId() {
  return globalThis.crypto?.randomUUID?.()
    || `section-ai-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

const sectionAiDesignInFlight = new Map();

function waitForSectionAiAsset(delayMs) {
  return new Promise((resolve) => {
    window.setTimeout(resolve, Math.max(250, Number(delayMs || 0)));
  });
}

function sectionAiAssetErrorMessage(asset = {}, error = null) {
  const payload = error?.payload || {};
  const provider = payload.provider || {};
  const providerName = provider.name || asset.request?.promptConfig?.provider || "";
  const model = provider.model || asset.request?.promptConfig?.model || "";
  const code = payload.code || error?.code || asset.errorCode || "";
  const message = error?.message || asset.errorMessage || "섹션 이미지 생성에 실패했습니다.";
  const context = [code, [providerName, model].filter(Boolean).join("/")].filter(Boolean).join(", ");
  return context ? `${message} (${context})` : message;
}

async function generateSectionAiDesign(...args) {
  const sectionKey = String(args[0]?.sectionKey || "").trim();
  if (!sectionKey) return Promise.resolve();
  const activeRequest = sectionAiDesignInFlight.get(sectionKey);
  if (activeRequest) return activeRequest;
  const request = runSectionAiDesign(...args)
    .finally(() => {
      if (sectionAiDesignInFlight.get(sectionKey) === request) {
        sectionAiDesignInFlight.delete(sectionKey);
      }
    });
  sectionAiDesignInFlight.set(sectionKey, request);
  return request;
}

async function runSectionAiDesign(
  section, targetType = "section-background", targetItemKey = "", targetFieldKey = "",
  imageGuidance = "", imageSafeArea = "",
  keyVisualTextMode = "none", keyVisualText = "",
) {
  const sectionKey = section.sectionKey;
  const requestedTargetType = targetType === "item" ? "item" : "section-background";
  const sectionInputs = JSON.parse(JSON.stringify(contentState.sectionInputs?.[sectionKey] || {}));
  const previous = sectionAiRun(sectionKey);
  const previousTargetType = previous?.constraintsSnapshot?.imageTarget?.type || "";
  const previousTargetItemKey = previous?.constraintsSnapshot?.imageTarget?.type === "item"
    ? previous.constraintsSnapshot.imageTarget.itemKey
    : "";
  const previousTargetFieldKey = previous?.constraintsSnapshot?.imageTarget?.type === "item"
    ? previous.constraintsSnapshot.imageTarget.fieldKey || ""
    : "";
  const requestedKeyVisualTextPolicy = requestedTargetType === "section-background"
    ? {
      mode: keyVisualTextMode === "explicit" ? "explicit" : "none",
      text: keyVisualTextMode === "explicit"
        ? String(keyVisualText || "").replace(/\s+/g, " ").trim()
        : "",
    }
    : { mode: "none", text: "" };
  const previousKeyVisualTextPolicy = previous?.inputSnapshot?.design?.keyVisualTextPolicy
    || { mode: "none", text: "" };
  const keyVisualPolicyMatchesPrevious = (
    previousKeyVisualTextPolicy.mode === requestedKeyVisualTextPolicy.mode
    && String(previousKeyVisualTextPolicy.text || "") === requestedKeyVisualTextPolicy.text
  );
  const processAssetJobs = async (run) => {
    const deadline = Date.now() + (9 * 60 * 1000);
    let latestRun = run;
    while (Date.now() < deadline) {
      const listed = await fetchJson(`/api/promo-section-design-assets?runId=${encodeURIComponent(run.id)}`);
      const assets = listed.assets || [];
      if (!assets.length) throw new Error("생성할 이미지 작업을 찾을 수 없습니다.");
      if (assets.every((asset) => asset.status === "ready")) {
        if (latestRun?.status !== "ready") {
          const latest = await fetchJson(`/api/promo-section-design-runs?runId=${encodeURIComponent(run.id)}`);
          latestRun = latest.run || latestRun;
        }
        return latestRun;
      }

      for (const listedAsset of assets) {
        if (
          listedAsset.status === "ready"
          || (listedAsset.status === "processing" && !listedAsset.canRetry)
        ) continue;
        let asset = listedAsset;
        if (asset.status === "failed" || (asset.status === "processing" && asset.canRetry)) {
          if (!asset.canRetry) {
            throw new Error(sectionAiAssetErrorMessage(asset));
          }
          if (asset.retryAfterMs > 0) {
            await waitForSectionAiAsset(Math.min(asset.retryAfterMs, 5000));
            continue;
          }
          const queued = await fetchJson("/api/promo-section-design-asset-retry", {
            method: "POST", headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ jobId: asset.id }),
          });
          asset = { ...asset, ...(queued.asset || {}), status: "queued" };
          latestRun = queued.run || latestRun;
        }
        if (asset.status !== "queued") continue;
        try {
          const processedAsset = await fetchJson("/api/promo-section-design-asset-process", {
            method: "POST", headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ jobId: asset.id }),
          });
          latestRun = processedAsset.run || latestRun;
        } catch (error) {
          if (!error.retryable) {
            throw new Error(sectionAiAssetErrorMessage(asset, error));
          }
          await waitForSectionAiAsset(Math.min(error.retryAfterMs || 1500, 5000));
        }
        saveSectionAiRun(sectionKey, latestRun, sectionInputs);
        postWizardLayoutSnapshot();
      }
      await waitForSectionAiAsset(1500);
    }
    throw new Error("섹션 이미지 생성 상태 확인 시간이 초과되었습니다. 다시 시도해 주세요.");
  };
  const canRetryPlannedAssets = previous?.id && previous?.effectivePatch
    && previous?.status === "failed" && !sectionAiIsStale(sectionKey, previous)
    && !String(imageGuidance || "").trim()
    && keyVisualPolicyMatchesPrevious
    && previousTargetType === requestedTargetType
    && (requestedTargetType !== "item" || (
      previousTargetItemKey === String(targetItemKey || "").trim()
      && previousTargetFieldKey === String(targetFieldKey || "").trim()
    ));
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
    && !String(imageGuidance || "").trim()
    && keyVisualPolicyMatchesPrevious
    && previousTargetType === requestedTargetType
    && previousTargetItemKey === String(targetItemKey || "").trim()
    && previousTargetFieldKey === String(targetFieldKey || "").trim();
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
        ? {
          type: "item", sectionKey, itemKey: String(targetItemKey || "").trim(),
          fieldKey: String(targetFieldKey || "").trim() || undefined,
        }
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
        designTokenSetVersionId: contentState.designTokenSetVersionId,
        sectionKey,
        sectionInputs,
        targetType: requestedTargetType,
        targetItemKey: String(targetItemKey || "").trim() || null,
        targetFieldKey: String(targetFieldKey || "").trim() || null,
        requestMode: "assets",
        imageGuidance: String(imageGuidance || "").trim().slice(0, 1800),
        safeArea: String(imageSafeArea || "").trim(),
        keyVisualTextMode: requestedKeyVisualTextPolicy.mode,
        keyVisualText: requestedKeyVisualTextPolicy.text,
        backgroundColor: resolvedSectionBackgroundColor(sectionKey),
        fadeMode: requestedTargetType === "section-background"
          ? (wizardResolvedLayout?.sectionStyles?.[sectionKey]?.backgroundFadeMode || "none")
          : "none",
        targetGeometry: {
          width: Number(wizardResolvedLayout?.responsive?.contentMaxWidth || 1280),
          height: Number(wizardResolvedLayout?.sectionStyles?.[sectionKey]?.minHeight || 520),
          viewport: "desktop",
        },
        renderOverrides: requestedTargetType === "section-background" ? {
          fitMode: wizardResolvedLayout?.sectionStyles?.[sectionKey]?.backgroundFitMode || "",
          position: wizardResolvedLayout?.sectionStyles?.[sectionKey]?.backgroundPosition || "",
          fadeMode: wizardResolvedLayout?.sectionStyles?.[sectionKey]?.backgroundFadeMode || "none",
          fadeStrength: wizardResolvedLayout?.sectionStyles?.[sectionKey]?.backgroundFadeStrength || "medium",
        } : {},
        generationRequestId: createSectionAiGenerationRequestId(),
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
  if (!saved?.id || (saved.requestMode !== "assets" && !saved.layoutResult?.layoutPatch)) return;
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
        designTokenSetVersionId: contentState.designTokenSetVersionId,
        sectionInputs: contentState.sectionInputs?.[section.sectionKey] || {},
        backgroundColor: resolvedSectionBackgroundColor(section.sectionKey),
      }),
    });
    const appliedRun = result.run;
    if (appliedRun?.requestMode !== "assets" && !appliedRun?.layoutResult?.layoutPatch) {
      throw new Error("서버가 검증된 섹션 레이아웃을 반환하지 않았습니다.");
    }
    const patch = appliedRun.layoutResult?.layoutPatch || { sectionStyles: {}, itemStyles: {} };
    wizardResolvedLayout = wizardResolvedLayout || JSON.parse(JSON.stringify(wizardBaseLayout || FALLBACK_LAYOUT));
    wizardResolvedLayout.sectionStyles = { ...(wizardResolvedLayout.sectionStyles || {}) };
    Object.entries(patch.sectionStyles || {}).forEach(([key, value]) => {
      const safePatch = { ...(value || {}) };
      delete safePatch.backgroundColor;
      wizardResolvedLayout.sectionStyles[key] = {
        ...(wizardResolvedLayout.sectionStyles[key] || {}),
        ...safePatch,
      };
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
        const targetFieldKey = appliedImage.targetFieldKey
          || appliedRun.effectivePatch?.assetRequests?.[0]?.targetFieldKey
          || appliedRun.constraintsSnapshot?.imageTarget?.fieldKey
          || "";
        const targetField = targetFieldKey
          ? (section.items?.find((item) => item.itemKey === imageTarget.itemKey)?.fields || [])
            .find((field) => field.fieldKey === targetFieldKey)
          : null;
        const resolvedTargetItem = section.items?.find((item) => item.itemKey === imageTarget.itemKey);
        const imageDefinition = targetField || targetItem;
        if (!resolvedTargetItem || resolvedTargetItem.isLocked || imageDefinition?.fieldKind !== "image"
          || !imageDefinition.image?.allowedSources?.includes("ai")) {
          throw new Error("관리자 정책에서 선택한 AI 이미지 Item을 현재 섹션에 적용할 수 없습니다.");
        }
        const valuePath = targetField
          ? `${section.sectionKey}.${resolvedTargetItem.itemKey}.fields.${targetField.fieldKey}`
          : `${section.sectionKey}.${resolvedTargetItem.itemKey}`;
        setValueAtPath(contentState.sectionInputs, valuePath, {
          source: "ai",
          value: appliedImage.proxyUrl,
          description: appliedImage.prompt || appliedRun.layoutResult?.imageRequest?.prompt || "",
          alt: imageDefinition.name || section.name || "AI generated promotion image",
        });
        const targetStyleKey = targetField
          ? `${section.sectionKey}.${resolvedTargetItem.itemKey}.${targetField.fieldKey}`
          : `${section.sectionKey}.${resolvedTargetItem.itemKey}`;
        const currentItemStyle = { ...(wizardResolvedLayout.itemStyles?.[targetStyleKey] || {}) };
        wizardResolvedLayout.itemStyles[targetStyleKey] = {
          widthPct: currentItemStyle.widthPct || 32,
          aspectRatio: currentItemStyle.aspectRatio || imageDefinition.image?.aspectRatio || appliedRun.constraintsSnapshot?.imageAspectRatio || "1/1",
          aspectRatioLocked: currentItemStyle.aspectRatioLocked !== false,
          imageFit: currentItemStyle.imageFit || "contain",
          imagePosition: currentItemStyle.imagePosition || "center center",
          shape: currentItemStyle.shape || "square",
          decorative: currentItemStyle.decorative === true,
          accessibleLabel: currentItemStyle.accessibleLabel || imageDefinition.name || section.name || "Promotion image",
          ...currentItemStyle,
        };
        const currentSectionStyle = { ...(wizardResolvedLayout.sectionStyles[section.sectionKey] || {}) };
        if (String(currentSectionStyle.backgroundImage || "").startsWith("/api/promo-section-design-image?")) {
          [
            "backgroundImage", "backgroundSize", "backgroundPosition", "backgroundRepeat",
            "backgroundFadeSafeArea", "backgroundFitMode", "backgroundAllowedFitModes", "backgroundFadeStops",
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
        const renderPolicy = appliedImage.renderPolicy
          || appliedRun.effectivePatch?.assetRequests?.[0]?.effectiveRenderPolicy
          || {};
        const backgroundFitMode = ["cover", "contain", "width-fill"].includes(renderPolicy.fitMode)
          ? renderPolicy.fitMode
          : "cover";
        wizardResolvedLayout.sectionStyles[section.sectionKey] = {
          ...currentSectionStyle,
          backgroundImage: appliedImage.proxyUrl,
          backgroundFitMode,
          backgroundAllowedFitModes: Array.isArray(renderPolicy.allowedFitModes)
            ? renderPolicy.allowedFitModes
            : ["cover", "contain", "width-fill"],
          backgroundSize: renderPolicy.backgroundSize
            || (backgroundFitMode === "width-fill" ? "100% auto" : backgroundFitMode),
          backgroundPosition: renderPolicy.position || "center center",
          backgroundRepeat: renderPolicy.repeat || "no-repeat",
          backgroundFadeSafeArea: safeArea,
          backgroundFadeMode: ["none", "left", "right", "both"].includes(renderPolicy.fadeMode)
            ? renderPolicy.fadeMode
            : ["none", "left", "right", "both"].includes(currentSectionStyle.backgroundFadeMode)
            ? currentSectionStyle.backgroundFadeMode
            : backgroundFadeMode,
          backgroundFadeStrength: renderPolicy.fadeStrength || currentSectionStyle.backgroundFadeStrength || "medium",
          backgroundFadeStops: renderPolicy.fadeStops || currentSectionStyle.backgroundFadeStops || {},
          backgroundFadeColor: resolvedSectionBackgroundColor(section.sectionKey),
        };
      }
    }
    // Persist the local draft before acknowledging either layout or asset apply.
    saveWizardContent();
    const completed = await fetchJson("/api/promo-section-design-apply-complete", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ runId: appliedRun.id, success: true }),
    });
    const completedRun = completed.run || appliedRun;
    saveSectionAiRun(section.sectionKey, completedRun, contentState.sectionInputs?.[section.sectionKey]);
    postWizardLayoutSnapshot();
  } catch (error) {
    if (saved?.id) {
      await fetchJson("/api/promo-section-design-apply-complete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ runId: saved.id, success: false, errorMessage: error.message }),
      }).catch(() => null);
    }
    saveSectionAiRun(section.sectionKey, {
      ...saved,
      status: "failed",
      errorMessage: error.message || "AI 디자인을 적용하지 못했습니다.",
    }, contentState.sectionInputs?.[section.sectionKey]);
    postWizardLayoutSnapshot();
    window.alert(error.message || "AI 디자인을 적용하지 못했습니다.");
  }
}

async function generateSectionAiLayout(section) {
  const sectionKey = section.sectionKey;
  const sectionInputs = JSON.parse(JSON.stringify(contentState.sectionInputs?.[sectionKey] || {}));
  saveSectionAiRun(sectionKey, {
    status: "queued",
    requestMode: "layout-style",
  }, sectionInputs);
  postWizardLayoutSnapshot();
  try {
    const created = await fetchJson("/api/promo-section-design-runs", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        promoRunId: null,
        formTemplateId: selectedWizardFormTemplate?.id,
        designTokenSetVersionId: contentState.designTokenSetVersionId,
        sectionKey,
        sectionInputs,
        requestMode: "layout-style",
        backgroundColor: resolvedSectionBackgroundColor(sectionKey),
      }),
    });
    saveSectionAiRun(sectionKey, created.run, sectionInputs);
    const planned = created.run.status === "ready"
      ? created
      : await fetchJson("/api/promo-section-design-plan-process", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ runId: created.run.id }),
      });
    saveSectionAiRun(sectionKey, planned.run, sectionInputs);
    if (planned.run?.status === "ready") await applySectionAiDesign(section, planned.run);
  } catch (error) {
    saveSectionAiRun(sectionKey, {
      ...sectionAiRun(sectionKey),
      status: "failed",
      errorMessage: error.message || "AI 레이아웃 제안에 실패했습니다.",
    }, sectionInputs);
  } finally {
    postWizardLayoutSnapshot();
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

function setOverviewInputMode(mode) {
  overviewInputMode = mode === "natural-language" ? "natural-language" : "structured";
  contentState.promotionOverview.inputMode = overviewInputMode;
  contentState.promotionOverview.rawNaturalLanguage = overviewNaturalLanguage;
  saveWizardContent();
  renderStep();
}

function overviewAnalysisFieldRows(overview = {}) {
  return [
    ["title", "프로모션 제목", overview.title],
    ["leadText", "리드 텍스트", overview.leadText],
    ["promotionPurpose", "프로모션 목적", overview.promotionPurpose === "기타"
      ? overview.promotionPurposeOther : overview.promotionPurpose],
    ["market", "마켓 / 지역", overview.market],
    ["audience", "대상 고객", overview.audience],
    ["campaignTone", "캠페인 톤", overview.campaignTone],
    ["mainOffer", "핵심 혜택", overview.mainOffer],
  ];
}

function overviewDecisionForField(field) {
  return overviewAnalysis?.fieldDecisions?.find((decision) => decision.field === field) || null;
}

function overviewDecisionLabel(decision) {
  return {
    provided: "사용자 입력",
    generated: "AI 생성",
    inferred: "AI 추론",
    "needs-confirmation": "확인 필요",
  }[decision?.origin] || "";
}

async function analyzeNaturalLanguageOverview() {
  const instruction = String(overviewNaturalLanguage || "").trim();
  if (instruction.length < 10) {
    overviewAnalysisError = "자연어 설명을 10자 이상 입력해 주세요.";
    overviewAnalysis = null;
    renderStep();
    return;
  }
  const requestId = ++overviewAnalysisRequestId;
  overviewAnalysisLoading = true;
  overviewAnalysisError = "";
  overviewAnalysis = null;
  contentState.promotionOverviewDraft = {};
  saveWizardContent();
  renderStep();
  try {
    const result = await fetchJson("/api/promo-overview-parse", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        naturalLanguage: instruction,
        generationMode: "new-draft",
        locale: navigator.language || "",
        market: contentState.promo.market || "",
        productCatalog: [],
      }),
    });
    if (requestId !== overviewAnalysisRequestId
      || result.requestFingerprint !== promotionOverviewRequestFingerprint(overviewNaturalLanguage)) return;
    overviewAnalysis = result;
    contentState.promotionOverviewDraft = result;
    saveWizardContent();
  } catch (error) {
    if (requestId !== overviewAnalysisRequestId) return;
    overviewAnalysisError = error.message || "프로모션 개요를 분석하지 못했습니다.";
  } finally {
    if (requestId === overviewAnalysisRequestId) {
      overviewAnalysisLoading = false;
      renderStep();
    }
  }
}

function applyOverviewAnalysis() {
  if (!overviewAnalysis?.overview) return;
  if (overviewAnalysis.requestFingerprint
    !== promotionOverviewRequestFingerprint(overviewNaturalLanguage)) {
    overviewAnalysisError = "입력 내용이 변경되었습니다. AI 개요를 다시 생성해 주세요.";
    overviewAnalysis = null;
    contentState.promotionOverviewDraft = {};
    saveWizardContent();
    renderStep();
    return;
  }
  const approved = {
    ...overviewAnalysis.overview,
    inputMode: "natural-language",
    rawNaturalLanguage: overviewNaturalLanguage,
  };
  contentState.promotionOverview = applyPromotionOverviewToLegacy(contentState, approved);
  overviewInputMode = "natural-language";
  validationErrors = {};
  overviewAnalysis = {
    ...overviewAnalysis,
    appliedFingerprint: promotionOverviewFingerprint(contentState.promotionOverview),
  };
  contentState.promotionOverviewDraft = overviewAnalysis;
  validationErrors = promotionOverviewErrors();
  if (Object.keys(validationErrors).length) {
    overviewInputMode = "structured";
    contentState.promotionOverview.inputMode = overviewInputMode;
    saveWizardContent();
    renderStep();
    return;
  }
  templateRecommendationState = null;
  templateCompositionProposal = null;
  contentState.templateRecommendation = null;
  contentState.templateCompositionProposal = null;
  currentStep = "template";
  contentSubstep = "template";
  sessionStorage.setItem(CONTENT_SUBSTEP_STORAGE_KEY, contentSubstep);
  saveWizardContent();
  renderStep();
}

function currentOverviewFingerprint() {
  return promotionOverviewFingerprint(syncPromotionOverviewFromLegacy(contentState));
}

function templateRecommendationsAreStale() {
  return Boolean(
    templateRecommendationState?.overviewFingerprint
    && templateRecommendationState.overviewFingerprint !== currentOverviewFingerprint()
  );
}

async function loadTemplateRecommendations({ force = false } = {}) {
  const overviewFingerprint = currentOverviewFingerprint();
  if (!force && templateRecommendationState?.overviewFingerprint === overviewFingerprint) return;
  const requestId = ++templateRecommendationRequestId;
  templateRecommendationLoading = true;
  templateRecommendationError = "";
  if (currentStep === "template") renderStep();
  try {
    const result = await fetchJson("/api/promo-template-recommendations", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        overview: syncPromotionOverviewFromLegacy(contentState),
        overviewFingerprint,
        limit: 3,
      }),
    });
    if (requestId !== templateRecommendationRequestId
      || result.overviewFingerprint !== currentOverviewFingerprint()) return;
    templateRecommendationState = {
      overviewFingerprint: result.overviewFingerprint,
      recommendations: Array.isArray(result.recommendations) ? result.recommendations : [],
      fallbackTemplateId: result.fallbackTemplateId || "",
      source: result.source || "rule-base",
      warnings: Array.isArray(result.warnings) ? result.warnings : [],
      createdAt: new Date().toISOString(),
    };
    contentState.templateRecommendation = templateRecommendationState;
    saveWizardContent();
  } catch (error) {
    if (requestId !== templateRecommendationRequestId) return;
    templateRecommendationError = error.message || "템플릿 추천을 불러오지 못했습니다.";
  } finally {
    if (requestId === templateRecommendationRequestId) {
      templateRecommendationLoading = false;
      if (currentStep === "template") renderStep();
    }
  }
}

function createTemplateRecommendationSummary() {
  const summary = document.createElement("section");
  summary.className = "template-recommendation-summary";
  const header = document.createElement("div");
  header.className = "template-recommendation-summary__header";
  const copy = document.createElement("div");
  appendTextElement(copy, "strong", "", "추천 템플릿");
  appendTextElement(copy, "small", "", "확정된 프로모션 개요를 기준으로 활성 템플릿을 비교합니다.");
  const refresh = document.createElement("button");
  refresh.type = "button";
  refresh.className = "secondary-action";
  refresh.disabled = templateRecommendationLoading;
  refresh.textContent = templateRecommendationLoading ? "추천 중..." : "다시 추천";
  refresh.addEventListener("click", () => loadTemplateRecommendations({ force: true }));
  header.append(copy, refresh);
  summary.append(header);

  if (templateRecommendationsAreStale()) {
    appendTextElement(
      summary,
      "p",
      "template-recommendation-warning",
      "프로모션 개요가 변경되어 이전 추천을 적용할 수 없습니다. 다시 추천해 주세요."
    );
    return summary;
  }
  if (templateRecommendationError) {
    appendTextElement(summary, "p", "template-recommendation-warning", templateRecommendationError);
    appendTextElement(summary, "small", "", "아래 전체 템플릿 목록에서 직접 선택할 수 있습니다.");
    return summary;
  }
  if (templateRecommendationLoading && !templateRecommendationState) {
    appendTextElement(summary, "p", "", "추천 후보를 분석하고 있습니다.");
    return summary;
  }
  templateRecommendationState?.warnings?.forEach((warning) => {
    appendTextElement(summary, "p", "template-recommendation-warning", warning);
  });
  if (!templateRecommendationState?.recommendations?.length && !templateRecommendationLoading) {
    appendTextElement(summary, "p", "", "추천 결과가 없습니다. 아래 전체 템플릿에서 직접 선택해 주세요.");
  }
  return summary;
}

function templateCompositionIsStale() {
  return Boolean(
    templateCompositionProposal?.overviewFingerprint
    && templateCompositionProposal.overviewFingerprint !== currentOverviewFingerprint()
  );
}

function templateCompositionRequiresReview(proposal = {}) {
  return Boolean(
    (Array.isArray(proposal.missingInputs) && proposal.missingInputs.length)
    || (Array.isArray(proposal.warnings) && proposal.warnings.length)
  );
}

async function generateTemplateCompositionProposal() {
  const overviewFingerprint = currentOverviewFingerprint();
  const requestId = globalThis.crypto?.randomUUID?.()
    || `template-composition-${Date.now()}-${Math.random().toString(16).slice(2)}`;
  const localRequestId = ++templateCompositionRequestId;
  templateCompositionLoading = true;
  templateCompositionError = "";
  renderStep();
  try {
    const candidateTemplateIds = (templateRecommendationsAreStale()
      ? [] : (templateRecommendationState?.recommendations || []))
      .map((item) => item.templateId);
    const result = await fetchJson("/api/promo-template-composition-plan", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        requestId,
        overview: syncPromotionOverviewFromLegacy(contentState),
        overviewFingerprint,
        candidateTemplateIds,
      }),
    });
    if (localRequestId !== templateCompositionRequestId
      || result.proposal?.overviewFingerprint !== currentOverviewFingerprint()) return;
    templateCompositionProposal = result.proposal;
    contentState.templateCompositionProposal = templateCompositionProposal;
    saveWizardContent();
    if (!templateCompositionRequiresReview(templateCompositionProposal)) {
      await applyTemplateCompositionProposal({ autoAdvance: true });
    }
  } catch (error) {
    if (localRequestId !== templateCompositionRequestId) return;
    templateCompositionError = error.message || "AI 구성 초안을 생성하지 못했습니다.";
  } finally {
    if (localRequestId === templateCompositionRequestId) {
      templateCompositionLoading = false;
      if (currentStep === "template") renderStep();
    }
  }
}

function overviewValueForComposition(path) {
  return String(path || "").split(".").reduce(
    (value, key) => value?.[key],
    syncPromotionOverviewFromLegacy(contentState)
  );
}

async function applyTemplateCompositionProposal({ autoAdvance = false } = {}) {
  const proposal = templateCompositionProposal;
  if (!proposal || templateCompositionIsStale()) {
    templateCompositionError = "프로모션 개요가 변경되었습니다. AI 구성 초안을 다시 생성해 주세요.";
    renderStep();
    return;
  }
  templateCompositionLoading = true;
  templateCompositionError = "";
  renderStep();
  try {
    await selectWizardFormTemplate(proposal.templateId, { skipConfirmation: true });
    const sectionsById = new Map(wizardSectionDefinitions.map((section) => [section.sectionId, section]));
    const plannedSections = proposal.sections.map((planned) => sectionsById.get(planned.sectionId)).filter(Boolean);
    if (plannedSections.length !== proposal.sections.length) {
      throw new Error("구성 초안의 섹션 버전이 현재 활성 템플릿과 일치하지 않습니다.");
    }
    wizardSectionDefinitions = plannedSections;
    proposal.sections.forEach((planned) => {
      const section = sectionsById.get(planned.sectionId);
      const itemsByKey = new Map((section?.items || []).map((item) => [item.itemKey, item]));
      planned.contentMappings.forEach((mapping) => {
        if (String(mapping.sourceOverviewPath || "").startsWith("primaryAction.")) return;
        const item = itemsByKey.get(mapping.itemKey);
        if (!item || item.isLocked) return;
        const value = overviewValueForComposition(mapping.sourceOverviewPath);
        if (!String(value || "").trim()) return;
        const path = `${section.sectionKey}.${item.itemKey}`;
        const current = valueAtPath(contentState.sectionInputs, path);
        if (item.fieldKind === "cta") {
          setValueAtPath(contentState.sectionInputs, path, {
            ...(current && typeof current === "object" ? current : {}),
            label: current?.label || value,
            link: current?.link || "",
            target: current?.target || "_self",
          });
        } else if (item.fieldKind === "text") {
          setValueAtPath(contentState.sectionInputs, path, value);
        }
      });
    });
    templateCompositionProposal = {
      ...proposal,
      status: "applied",
      appliedAt: new Date().toISOString(),
      autoApplied: autoAdvance,
    };
    contentState.templateCompositionProposal = templateCompositionProposal;
    if (autoAdvance) {
      currentStep = "layout";
      contentSubstep = "layout";
      sessionStorage.setItem(CONTENT_SUBSTEP_STORAGE_KEY, contentSubstep);
    }
    saveWizardContent();
  } catch (error) {
    templateCompositionError = error.message || "AI 구성 초안을 적용하지 못했습니다.";
  } finally {
    templateCompositionLoading = false;
    renderStep();
  }
}

function createTemplateCompositionPanel() {
  const panel = document.createElement("section");
  panel.className = "template-composition-panel";
  const header = document.createElement("div");
  header.className = "template-composition-panel__header";
  const copy = document.createElement("div");
  appendTextElement(copy, "strong", "", "AI 구성 초안");
  appendTextElement(copy, "small", "", "관리자 템플릿은 변경하지 않고 현재 프로모션 세션에만 섹션 구성과 콘텐츠 매핑을 제안합니다.");
  const generate = document.createElement("button");
  generate.type = "button";
  generate.className = "secondary-action";
  generate.disabled = templateCompositionLoading;
  generate.textContent = templateCompositionLoading ? "구성 중..." : "AI로 구성하고 다음";
  generate.addEventListener("click", generateTemplateCompositionProposal);
  header.append(copy, generate);
  panel.append(header);

  if (templateCompositionError) {
    appendTextElement(panel, "p", "template-recommendation-warning", templateCompositionError);
  }
  if (templateCompositionIsStale()) {
    appendTextElement(
      panel,
      "p",
      "template-recommendation-warning",
      "Overview 변경으로 기존 구성 초안이 오래된 상태입니다. 새 초안을 생성해 주세요."
    );
    return panel;
  }
  if (!templateCompositionProposal) return panel;
  appendTextElement(panel, "p", "", templateCompositionProposal.summary || "AI 구성 초안이 준비되었습니다.");
  appendTextElement(
    panel,
    "strong",
    "template-composition-template",
    `${templateCompositionProposal.templateName} · 섹션 ${templateCompositionProposal.sections?.length || 0}개`
  );
  const list = document.createElement("ol");
  list.className = "template-composition-sections";
  templateCompositionProposal.sections?.forEach((section) => {
    const item = document.createElement("li");
    item.textContent = `${section.sectionName || section.sectionKey} · 콘텐츠 매핑 ${section.contentMappings?.length || 0}개`;
    list.append(item);
  });
  panel.append(list);
  templateCompositionProposal.warnings?.forEach((warning) => {
    appendTextElement(panel, "p", "template-recommendation-warning", warning);
  });
  templateCompositionProposal.missingInputs?.forEach((input) => {
    appendTextElement(panel, "p", "template-recommendation-warning", `추가 확인 필요: ${input}`);
  });
  if (templateCompositionRequiresReview(templateCompositionProposal)
    && templateCompositionProposal.status !== "applied") {
    appendTextElement(
      panel,
      "p",
      "template-recommendation-warning",
      "확인 항목이 있어 자동 적용하지 않았습니다. 내용을 검토한 뒤 직접 적용해 주세요."
    );
  }
  if (templateCompositionProposal.status !== "applied") {
    const apply = document.createElement("button");
    apply.type = "button";
    apply.className = "primary-action";
    apply.textContent = "이 구성 초안 적용";
    apply.disabled = templateCompositionLoading;
    apply.addEventListener("click", applyTemplateCompositionProposal);
    panel.append(apply);
  } else {
    appendTextElement(panel, "p", "template-composition-applied", "현재 프로모션에 구성 초안을 적용했습니다.");
  }
  return panel;
}

function createOverviewInputPanel(structuredForm) {
  const panel = document.createElement("section");
  panel.className = "overview-mode";

  const tabs = document.createElement("div");
  tabs.className = "overview-mode__tabs";
  tabs.setAttribute("role", "tablist");
  [
    ["structured", "정형 입력"],
    ["natural-language", "자연어 입력"],
  ].forEach(([mode, label]) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = `overview-mode__tab${overviewInputMode === mode ? " is-active" : ""}`;
    button.setAttribute("role", "tab");
    button.setAttribute("aria-selected", String(overviewInputMode === mode));
    button.textContent = label;
    button.addEventListener("click", () => setOverviewInputMode(mode));
    tabs.append(button);
  });
  panel.append(tabs);

  if (overviewInputMode === "structured") {
    panel.append(structuredForm);
    return panel;
  }

  const nlpPanel = document.createElement("article");
  nlpPanel.className = "content-form-section overview-nlp-panel";
  appendTextElement(nlpPanel, "h3", "", "프로모션 내용 입력");
  appendTextElement(
    nlpPanel,
    "p",
    "overview-nlp-panel__description",
    "정리되지 않은 짧은 아이디어만 입력해도 AI가 제목, 목적, 대상, 분위기와 핵심 혜택을 포함한 새 개요 초안을 만듭니다. 결과는 확인 후 적용됩니다."
  );
  const input = document.createElement("textarea");
  input.className = "overview-nlp-input";
  input.rows = 8;
  input.maxLength = 4000;
  input.placeholder = "예: 여름에 신규 고객이 관심을 가질 만한 충전 이벤트를 만들고 싶어요.";
  input.value = overviewNaturalLanguage;
  input.addEventListener("input", () => {
    overviewNaturalLanguage = input.value;
    overviewAnalysisRequestId += 1;
    overviewAnalysisLoading = false;
    contentState.promotionOverview.rawNaturalLanguage = overviewNaturalLanguage;
    overviewAnalysis = null;
    contentState.promotionOverviewDraft = {};
    overviewAnalysisError = "";
    saveWizardContent();
  });
  nlpPanel.append(input);

  const actions = document.createElement("div");
  actions.className = "overview-nlp-actions";
  const analyze = document.createElement("button");
  analyze.type = "button";
  analyze.className = "secondary-action is-primary";
  analyze.disabled = overviewAnalysisLoading;
  analyze.textContent = overviewAnalysisLoading ? "분석 중..." : "AI로 개요 분석";
  analyze.addEventListener("click", analyzeNaturalLanguageOverview);
  actions.append(analyze);
  nlpPanel.append(actions);

  if (overviewAnalysisError) {
    appendTextElement(nlpPanel, "p", "overview-analysis-error", overviewAnalysisError);
  }
  if (overviewAnalysis) {
    const result = document.createElement("section");
    result.className = "overview-analysis";
    appendTextElement(result, "h4", "", "분석 결과");
    appendTextElement(result, "p", "", overviewAnalysis.summary || "입력 내용을 구조화했습니다.");
    appendTextElement(
      result,
      "span",
      "overview-analysis__confidence",
      `신뢰도 ${Math.round((Number(overviewAnalysis.confidence) || 0) * 100)}%`
    );
    const grid = document.createElement("dl");
    grid.className = "overview-analysis-grid";
    overviewAnalysisFieldRows(overviewAnalysis.overview).forEach(([field, label, value]) => {
      appendTextElement(grid, "dt", "", label);
      const fieldValue = document.createElement("dd");
      appendTextElement(fieldValue, "span", "overview-analysis__value", value || "입력 필요");
      const decision = overviewDecisionForField(field);
      if (decision) {
        appendTextElement(
          fieldValue,
          "span",
          `overview-analysis__origin overview-analysis__origin--${decision.origin}`,
          overviewDecisionLabel(decision)
        );
        if (decision.reason) {
          appendTextElement(fieldValue, "small", "overview-analysis__reason", decision.reason);
        }
      }
      grid.append(fieldValue);
    });
    result.append(grid);
    if (overviewAnalysis.assumptions?.length) {
      appendTextElement(
        result,
        "p",
        "overview-analysis-warning",
        `AI 가정: ${overviewAnalysis.assumptions.join(" · ")}`
      );
    }
    if (overviewAnalysis.missingCriticalInputs?.length) {
      appendTextElement(
        result,
        "p",
        "overview-analysis-warning",
        `적용 후 확인할 필수 항목: ${overviewAnalysis.missingCriticalInputs.join(", ")}`
      );
    }
    overviewAnalysis.warnings?.forEach((warning) => {
      appendTextElement(result, "p", "overview-analysis-warning", warning);
    });
    const apply = document.createElement("button");
    apply.type = "button";
    apply.className = "primary-action";
    apply.textContent = "분석 결과 적용";
    apply.addEventListener("click", applyOverviewAnalysis);
    result.append(apply);
    nlpPanel.append(result);
  }

  panel.append(nlpPanel);
  return panel;
}

function renderContentStep() {
  placeholders.className = "content-form-layout create-promo-content-layout";
  placeholders.innerHTML = "";

  const overview = createContentSection("1. 프로모션 개요", [
    { group: "promo", key: "title", label: "프로모션 제목", required: true },
    { group: "promo", key: "leadText", label: "리드 텍스트", required: true },
    { group: "promo", key: "promotionPurpose", label: "프로모션 목적", required: true, options: ["할인쿠폰", "경품", "이벤트", "기타"] },
    { group: "promo", key: "promotionPurposeOther", label: "기타 목적", required: contentState.promo.promotionPurpose === "기타" },
    { group: "promo", key: "market", label: "마켓 / 지역", required: true, placeholder: "Global, KR, Ontario..." },
    { group: "simpleBrief", key: "audience", label: "대상 고객", required: true, options: ["신규", "기존고객", "일반고객"] },
    { group: "simpleBrief", key: "campaignTone", label: "캠페인 톤", required: true, options: ["활기찬", "진중함", "럭셔리", "프리미엄", "긴급함", "친근함"] },
    { group: "simpleBrief", key: "mainOffer", label: "핵심 혜택", type: "textarea", required: true },
  ]);

  if (contentState.promo.promotionPurpose !== "기타") {
    const otherField = overview.querySelector('[data-field-key="promotionPurposeOther"]');
    if (otherField) otherField.hidden = true;
  }

  const templateSection = document.createElement("article");
  templateSection.className = "content-form-section";
  appendTextElement(templateSection, "h3", "", "2. 프로모션 템플릿 선택");
  templateSection.append(createTemplateRecommendationSummary());
  templateSection.append(createTemplateCompositionPanel());
  const templateTiles = document.createElement("div");
  templateTiles.className = "wizard-template-tiles";
  const activeRecommendations = templateRecommendationsAreStale()
    ? [] : (templateRecommendationState?.recommendations || []);
  const recommendationById = new Map(activeRecommendations.map((item, index) => [
    item.templateId, { ...item, rank: index + 1 },
  ]));
  wizardFormTemplates.forEach((template) => {
    const recommendation = recommendationById.get(template.id);
    const tile = document.createElement("button");
    tile.type = "button";
    tile.className = `wizard-template-tile${selectedWizardFormTemplate?.id === template.id ? " is-selected" : ""}${recommendation ? " is-recommended" : ""}`;
    tile.disabled = wizardSectionDefinitionsLoading;
    tile.setAttribute("aria-pressed", String(selectedWizardFormTemplate?.id === template.id));
    tile.setAttribute("aria-busy", String(wizardTemplateSwitchTargetId === template.id));
    const heading = document.createElement("span");
    appendTextElement(heading, "strong", "", template.name);
    if (template.isDefault) appendTextElement(heading, "em", "wizard-template-default", "기본");
    if (recommendation) {
      appendTextElement(
        heading,
        "em",
        "wizard-template-recommended",
        `추천 ${recommendation.rank} · ${recommendation.score}점`
      );
    }
    tile.append(heading);
    appendTextElement(tile, "small", "", template.description || "프로모션 콘텐츠 템플릿");
    if (recommendation) {
      appendTextElement(tile, "small", "wizard-template-reason", recommendation.reasons?.join(" · ") || "추천 템플릿");
      recommendation.warnings?.forEach((warning) => {
        appendTextElement(tile, "small", "wizard-template-warning", warning);
      });
    }
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
  const designTokenControls = createAppearanceControls();
  const layoutHeader = document.createElement("div");
  layoutHeader.className = "wizard-layout-panel__header";
  const layoutHeading = document.createElement("div");
  appendTextElement(layoutHeading, "span", "eyebrow", "현재 프로모션 레이아웃 편집");
  appendTextElement(layoutHeading, "strong", "", `${selectedWizardFormTemplate?.name || "Template"} · layout r${wizardLayoutRevision}`);
  appendTextElement(layoutHeading, "small", "create-promo-appearance-note", "색상, 글꼴과 컴포넌트 스타일은 Step 1에서 선택한 디자인 토큰을 기준으로 적용됩니다.");
  appendTextElement(layoutHeading, "small", "create-promo-save-scope", "저장 범위: 현재 프로모션 · 관리자 기본 레이아웃에는 영향을 주지 않습니다.");
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
  layoutFrame.title = "현재 프로모션 콘텐츠 및 레이아웃 편집기";
  layoutFrame.setAttribute("scrolling", "no");
  layoutFrame.src = "/prototype/visual-editor.html?mode=wizard-layout&source=create-promo";
  layoutFrame.addEventListener("load", postWizardLayoutSnapshot);
  wizardLayoutFrame = layoutFrame;
  layoutPanel.append(designTokenControls, layoutHeader);
  if (templateCompositionProposal?.status === "applied"
    && templateCompositionProposal?.autoApplied) {
    const compositionBanner = document.createElement("div");
    compositionBanner.className = "admin-layout-update-banner";
    compositionBanner.setAttribute("role", "status");
    appendTextElement(
      compositionBanner,
      "span",
      "",
      `${templateCompositionProposal.templateName || "추천 템플릿"}과 AI 섹션 구성을 적용했습니다.`
    );
    layoutPanel.append(compositionBanner);
  }
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

  if (currentStep === "overview") placeholders.append(createOverviewInputPanel(overview));
  if (currentStep === "template") placeholders.append(templateSection);
  if (currentStep === "layout") {
    const workspace = document.createElement("div");
    workspace.className = "template-layout-workspace";
    workspace.append(layoutPanel);
    placeholders.append(workspace);
    requestAnimationFrame(postWizardLayoutSnapshot);
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
      : "Step 4에서 필수 콘텐츠와 레이아웃을 확인한 후 Web Output을 생성해 주세요."
  );
  const actions = document.createElement("div");
  actions.className = "web-output-actions";
  const openOutput = document.createElement("button");
  openOutput.type = "button";
  openOutput.className = "primary-action";
  openOutput.textContent = "Web Output 새 창 열기";
  openOutput.addEventListener("click", openWebOutputWindow);
  const fallbackLink = document.createElement("a");
  fallbackLink.className = "secondary-action";
  fallbackLink.href = "/prototype/visual-output.html";
  fallbackLink.textContent = "현재 탭에서 열기";
  const edit = document.createElement("button");
  edit.type = "button";
  edit.className = "secondary-action";
  edit.textContent = "Step 4로 돌아가 수정";
  edit.addEventListener("click", () => {
    currentStep = "layout";
    contentSubstep = "layout";
    sessionStorage.setItem(CONTENT_SUBSTEP_STORAGE_KEY, contentSubstep);
    renderStep();
  });
  actions.append(openOutput, fallbackLink, edit);
  header.append(actions);
  placeholders.append(header);

  if (!snapshot) return;
}

function renderStep() {
  sessionStorage.setItem(CURRENT_STEP_STORAGE_KEY, currentStep);
  const currentIndex = stepIndex(currentStep);
  const step = steps[currentIndex];
  status.textContent = `Step ${currentIndex + 1} / ${steps.length}`;
  if (shellStatus) shellStatus.textContent = `Step ${currentIndex + 1} / ${steps.length}`;
  prev.disabled = currentStep === "overview";
  next.disabled = currentStep === "output"
    || (currentStep === "layout" && (!selectedDesignTokenSet() || !wizardSectionConfigurationReady()));
  next.textContent = currentStep === "layout" ? "Web Output" : "Next";

  stepButtons.forEach((button, index) => {
    button.classList.toggle("is-active", index === currentIndex);
    button.classList.toggle("is-complete", index < currentIndex);
  });

  if (currentStep === "overview") {
    contentSubstep = "overview";
    renderContentStep();
    return;
  }

  if (currentStep === "template") {
    contentSubstep = "template";
    renderContentStep();
    if (!templateRecommendationState && !templateRecommendationLoading && !templateRecommendationError) {
      queueMicrotask(() => loadTemplateRecommendations());
    }
    return;
  }

  if (currentStep === "layout") {
    contentSubstep = "layout";
    renderContentStep();
    return;
  }

  if (currentStep === "output") {
    renderWebOutputStep();
    return;
  }

}

stepButtons.forEach((button, index) => {
  button.addEventListener("click", () => {
    const targetStep = button.dataset.step;
    const targetIndex = stepIndex(targetStep);
    if (targetIndex >= stepIndex("template") && Object.keys(promotionOverviewErrors()).length) {
      validationErrors = promotionOverviewErrors();
      currentStep = "overview";
      renderStep();
      return;
    }
    if (targetIndex >= stepIndex("layout") && !wizardSectionConfigurationReady()) {
      validationErrors = { sectionConfiguration: true };
      currentStep = "template";
      renderStep();
      return;
    }
    if (targetStep === "output") {
      goToWebOutput();
      return;
    }
    currentStep = targetStep;
    renderStep();
    if (currentStep === "layout") refreshActiveWizardTemplate();
  });
});

prev.addEventListener("click", () => {
  currentStep = previousStep(currentStep);
  renderStep();
  if (currentStep === "layout") refreshActiveWizardTemplate();
});

next.addEventListener("click", () => {
  if (currentStep === "overview" && Object.keys(promotionOverviewErrors()).length) {
    validationErrors = promotionOverviewErrors();
    renderStep();
    return;
  }
  if (currentStep === "template" && !wizardSectionConfigurationReady()) {
    validationErrors = { sectionConfiguration: true };
    renderStep();
    return;
  }
  if (currentStep === "layout") {
    goToWebOutput();
    return;
  }
  currentStep = nextStep(currentStep);
  renderStep();
  if (currentStep === "layout") refreshActiveWizardTemplate();
});

renderStep();
loadWizardSectionDefinitions();
