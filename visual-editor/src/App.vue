<script setup>
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from "vue";
import PromoPageRenderer from "./PromoPageRenderer.vue";
import { withoutFreePosition } from "./editor-utils.mjs";
import { createEditorContext } from "./editor-context.mjs";
import { normalizeLayoutSpec, validateLayoutSpec } from "./layout-utils.mjs";
import { geometryToItemStylePatches, resolveSafeMultiLayoutOperation } from "./multi-layout.mjs";
import { createAdminTemplateAdapter } from "./platform/adapters/admin-template-adapter.mjs";
import {
  PromoBuilderMessageType,
  createPromoBuilderAdapter,
} from "./platform/adapters/promo-builder-adapter.mjs";
import { createOutputAdapter } from "./platform/adapters/output-adapter.mjs";
import { createEditorStore } from "./platform/editor-core/create-editor-store.mjs";
import { EditorCommandType, editorCommand } from "./platform/editor-core/editor-commands.mjs";
import {
  MINIMUM_COMPONENT_HEIGHT_PX,
  MINIMUM_COMPONENT_WIDTH_PCT,
} from "./platform/layout-engine/geometry.mjs";
import PreviewPanel from "./platform/editor-ui/PreviewPanel.vue";
import SectionPanel from "./platform/editor-ui/SectionPanel.vue";
import AiLayoutControls from "./platform/editor-ui/AiLayoutControls.vue";
import SectionCompositionControls from "./platform/editor-ui/SectionCompositionControls.vue";
import PropertyPanel from "./platform/editor-ui/PropertyPanel.vue";
import {
  DEFAULT_DESIGN_SPEC,
  SNAPSHOT_STORAGE_KEY,
  createSectionInputs,
  createSnapshot,
} from "./contracts";

const props = defineProps({
  mode: { type: String, default: "editor" },
});

const loading = ref(props.mode !== "output");
const error = ref("");
const templates = ref([]);
const template = ref(null);
const configRevision = ref("");
const sections = ref([]);
const sectionInputs = ref({});
const designSpec = ref(JSON.parse(JSON.stringify(DEFAULT_DESIGN_SPEC)));
const selectedSectionKey = ref("");
const selectedItemKey = ref("");
const selectedItemKeys = ref([]);
const expandedComponentKey = ref("");
const previewPanelRef = ref(null);
const viewport = ref("desktop");
const guidesVisible = ref(true);
const outputSaveError = ref("");
const outputSnapshot = ref(null);
const layoutRevision = ref(1);
const layoutId = ref(null);
const layoutIdentity = ref(null);
const layoutChangeNote = ref("");
const layoutSaving = ref(false);
const layoutSaveMessage = ref("");
const designTokenSets = ref([]);
const previewDesignTokenVersionId = ref("");
const externalSnapshotReady = ref(false);
const autoRegisterPending = ref(false);
const autoRegisterMessage = ref("");
const sectionDesignRuns = ref({});
const multiLayoutPlanning = ref(false);
const multiLayoutError = ref("");
const multiLayoutSuggestion = ref(null);
const multiLayoutUndoStack = ref([]);
const multiLayoutRevision = ref(0);
const compositionInstruction = ref("");
const compositionGenerateBackground = ref(false);
const compositionImageGuidance = ref("");
const compositionFadeMode = ref("none");
const compositionPlanning = ref(false);
const compositionApplying = ref(false);
const compositionError = ref("");
const compositionResult = ref(null);
const editorHistory = ref({ undoCount: 0, redoCount: 0, canUndo: false, canRedo: false });
const editorCore = createEditorStore({
  layout: JSON.parse(JSON.stringify(DEFAULT_DESIGN_SPEC)),
  content: {},
});
const adminTemplateAdapter = createAdminTemplateAdapter();
const promoBuilderAdapter = createPromoBuilderAdapter();
const outputAdapter = createOutputAdapter({ storageKey: SNAPSHOT_STORAGE_KEY });
let applyingExternalSnapshot = false;
let lastExternalSnapshotRevision = 0;
let disconnectPromoBuilder = null;
let compositionRequestSequence = 0;

const wizardSource = new URLSearchParams(window.location.search).get("source") || "";
const editorContext = computed(() => createEditorContext(props.mode, wizardSource));
const capabilities = computed(() => editorContext.value.capabilities);
const isAdminLayoutMode = computed(() => editorContext.value.isAdminLayout);
const isWizardLayoutMode = computed(() => editorContext.value.isWizardLayout);
const isCreatePromoWizardMode = computed(() => editorContext.value.isCreatePromo);
const isBuilderWorkspaceMode = computed(() => editorContext.value.isBuilderWorkspace);
const usesEmbeddedEngineShell = computed(() => editorContext.value.capabilities.isEmbedded);
const shellNavItems = window.PromoShell?.navItems || [];

const selectedSection = computed(() => sections.value.find((section) => section.sectionKey === selectedSectionKey.value) || sections.value[0]);
const selectedItem = computed(() => (
  selectedSection.value?.items?.find((item) => item.itemKey === selectedItemKey.value) || null
));
const selectedValue = computed({
  get: () => sectionInputs.value?.[selectedSection.value?.sectionKey]?.[selectedItem.value?.itemKey],
  set: (value) => updateSelectedValue(value),
});
const editorSnapshot = computed(() => template.value ? createSnapshot({
  template: template.value,
  configRevision: configRevision.value,
  sections: sections.value,
  sectionInputs: sectionInputs.value,
  designSpec: designSpec.value,
}) : null);
const rendererSnapshot = computed(() => props.mode === "output" ? outputSnapshot.value : editorSnapshot.value);
const templateIdentityLabel = computed(() => {
  if (!template.value) return "템플릿 없음";
  const status = isAdminLayoutMode.value ? (template.value.status || "draft") : "active";
  const shortId = String(template.value.id || "").slice(0, 8);
  return `${template.value.templateKey} · v${template.value.version || 1} · ${status} · layout r${layoutRevision.value}${shortId ? ` · ${shortId}` : ""}`;
});
const selectedDesignTokenValues = computed(() => (
  Array.isArray(template.value?.designTokens?.sourceValues)
    ? template.value.designTokens.sourceValues
    : []
));
const colorTokenOptions = computed(() => selectedDesignTokenValues.value.filter((token) => (
  token.valueType === "color"
  || (token.cssProperties || []).some((property) => ["color", "background-color"].includes(property))
)).map((token) => ({
  key: token.tokenKey,
  label: token.label || token.tokenKey,
  value: token.value,
})));
const fontSizeTokenOptions = computed(() => selectedDesignTokenValues.value.filter((token) => (
  token.valueType === "length"
  && (token.cssProperties || []).includes("font-size")
)).map((token) => ({
  key: token.tokenKey,
  label: token.label || token.tokenKey,
  value: token.value,
  px: Number.parseFloat(token.value),
})).filter((token) => Number.isFinite(token.px)));

function editorDocumentFromRefs() {
  return {
    layout: designSpec.value,
    content: sectionInputs.value,
    metadata: {
      surface: editorContext.value.surface,
      layoutRevision: layoutRevision.value,
    },
  };
}

function updateEditorHistory() {
  editorHistory.value = editorCore.getHistoryState();
}

function hydrateEditorCore({ resetHistory = true } = {}) {
  editorCore.replaceDocument(editorDocumentFromRefs(), { resetHistory });
  updateEditorHistory();
}

function applyEditorCoreResult(result) {
  if (!result?.ok) return false;
  designSpec.value = result.state.document.layout;
  sectionInputs.value = result.state.document.content;
  editorHistory.value = result.history || editorCore.getHistoryState();
  return true;
}

function executeEditorCommand(type, payload, { source = "ui", label = type } = {}) {
  return applyEditorCoreResult(editorCore.execute(editorCommand(type, payload, { source, label })));
}

function undoEditorCommand() {
  applyEditorCoreResult(editorCore.undo());
}

function redoEditorCommand() {
  applyEditorCoreResult(editorCore.redo());
}

function selectItem(section, item, { preserveMulti = false } = {}) {
  if (!section) return;
  const sectionChanged = selectedSectionKey.value && selectedSectionKey.value !== section.sectionKey;
  selectedSectionKey.value = section.sectionKey;
  selectedItemKey.value = item?.itemKey || "";
  if (!preserveMulti || sectionChanged) selectedItemKeys.value = item?.itemKey ? [item.itemKey] : [];
}

function componentKey(section, item) {
  return section && item ? `${section.sectionKey}.${item.itemKey}` : "";
}

function itemVisible(section, item) {
  if (item?.isRequired || item?.isLocked) return true;
  return designSpec.value.visibility?.items?.[componentKey(section, item)] !== false;
}

function fieldVisibilityKey(section, item, field) {
  return `${componentKey(section, item)}.${field.fieldKey}`;
}

function fieldVisible(section, item, field) {
  if (field?.isRequired || field?.isLocked) return true;
  return designSpec.value.visibility?.fields?.[fieldVisibilityKey(section, item, field)] !== false;
}

function setItemVisible(section, item, visible) {
  if (!section || !item || item.isRequired || item.isLocked) return;
  executeEditorCommand(EditorCommandType.VISIBILITY_SET, {
    targetType: "item",
    targetKey: componentKey(section, item),
    visible,
  }, { label: "컴포넌트 노출 변경" });
  if (!visible) selectedItemKeys.value = selectedItemKeys.value.filter((key) => key !== item.itemKey);
}

function setFieldVisible(section, item, field, visible) {
  if (!section || !item || !field || field.isRequired || field.isLocked) return;
  executeEditorCommand(EditorCommandType.VISIBILITY_SET, {
    targetType: "field",
    targetKey: fieldVisibilityKey(section, item, field),
    visible,
  }, { label: "컴포넌트 필드 노출 변경" });
}

function applyColorToken(tokenKey) {
  const token = colorTokenOptions.value.find((candidate) => candidate.key === tokenKey);
  updateItemStyle({
    colorToken: token?.key,
    color: undefined,
  });
}

function applyFontSizeToken(tokenKey) {
  const token = fontSizeTokenOptions.value.find((candidate) => candidate.key === tokenKey);
  updateItemStyle({
    fontSizeToken: token?.key,
    fontSize: token?.px,
  });
}

function resetSectionComposition() {
  compositionRequestSequence += 1;
  compositionInstruction.value = "";
  compositionGenerateBackground.value = false;
  compositionImageGuidance.value = "";
  compositionFadeMode.value = "none";
  compositionPlanning.value = false;
  compositionApplying.value = false;
  compositionError.value = "";
  compositionResult.value = null;
}

async function selectRendererItem(section, item, selection = {}) {
  if (selectedSectionKey.value && selectedSectionKey.value !== section.sectionKey) {
    resetSectionComposition();
  }
  if (selection.additive && !item?.isLocked && selectedSectionKey.value === section.sectionKey) {
    const keys = new Set(selectedItemKeys.value);
    if (keys.has(item.itemKey)) keys.delete(item.itemKey);
    else keys.add(item.itemKey);
    selectedItemKeys.value = [...keys];
    selectItem(section, item, { preserveMulti: true });
  } else {
    selectItem(section, item);
  }
  expandedComponentKey.value = componentKey(section, item);
  await nextTick();
}

function scrollPreviewToSection(section) {
  if (!section) return;
  previewPanelRef.value?.scrollToSection(section.sectionKey);
}

async function selectSection(section) {
  if (!section) return;
  const sectionChanged = selectedSectionKey.value && selectedSectionKey.value !== section.sectionKey;
  if (sectionChanged) resetSectionComposition();
  selectedSectionKey.value = section.sectionKey;
  selectedItemKey.value = "";
  selectedItemKeys.value = [];
  expandedComponentKey.value = "";
  multiLayoutSuggestion.value = null;
  multiLayoutError.value = "";
  await nextTick();
  scrollPreviewToSection(section);
}

function multiItemSelected(item) {
  return Boolean(item?.itemKey && selectedItemKeys.value.includes(item.itemKey));
}

function toggleMultiItem(section, item) {
  if (!section || !item || item.isLocked) return;
  if (selectedSectionKey.value !== section.sectionKey) selectedItemKeys.value = [];
  const keys = new Set(selectedItemKeys.value);
  if (keys.has(item.itemKey)) keys.delete(item.itemKey);
  else keys.add(item.itemKey);
  selectedItemKeys.value = [...keys];
  selectItem(section, item, { preserveMulti: true });
  expandedComponentKey.value = componentKey(section, item);
  multiLayoutSuggestion.value = null;
  multiLayoutError.value = "";
}

function clearMultiSelection() {
  selectedItemKeys.value = selectedItem.value?.itemKey ? [selectedItem.value.itemKey] : [];
  multiLayoutSuggestion.value = null;
  multiLayoutError.value = "";
}

function layoutOperationLabel(operation) {
  return ({
    "align-left": "왼쪽 정렬",
    "align-center": "가운데 정렬",
    "align-right": "오른쪽 정렬",
    "align-top": "위쪽 정렬",
    "align-middle": "세로 중앙 정렬",
    "align-bottom": "아래쪽 정렬",
    "distribute-horizontal": "가로 균등 배치",
    "distribute-vertical": "세로 균등 배치",
    "equal-width": "동일 너비",
    "equal-height": "동일 높이",
    "set-gap": "지정 간격 적용",
    "group-stack-horizontal": "가로 스택",
    "group-stack-vertical": "세로 스택",
  })[operation] || operation;
}

function captureMultiLayoutGeometry(section) {
  const previewStage = previewPanelRef.value?.getStageElement();
  if (!section || !previewStage) throw new Error("미리보기 영역을 찾지 못했습니다.");
  const sectionElement = previewStage.querySelector(`[data-section-key="${CSS.escape(section.sectionKey)}"]`);
  const canvas = sectionElement?.querySelector(".rendered-items");
  if (!canvas) throw new Error("선택한 섹션의 레이아웃 영역을 찾지 못했습니다.");
  const canvasRect = canvas.getBoundingClientRect();
  if (!canvasRect.width || !canvasRect.height) throw new Error("레이아웃 영역 크기를 계산하지 못했습니다.");
  const itemElements = [...canvas.querySelectorAll("[data-style-key]")];
  const geometry = selectedItemKeys.value.map((itemKey) => {
    const styleKey = `${section.sectionKey}.${itemKey}`;
    const element = itemElements.find((candidate) => candidate.dataset.styleKey === styleKey);
    if (!element) throw new Error(`${itemKey} 컴포넌트 위치를 찾지 못했습니다.`);
    const rect = element.getBoundingClientRect();
    return {
      itemKey,
      xPct: ((rect.left - canvasRect.left) / canvasRect.width) * 100,
      yPx: rect.top - canvasRect.top,
      widthPct: (rect.width / canvasRect.width) * 100,
      heightPx: Math.max(1, rect.height),
    };
  });
  return { geometry, canvasWidthPx: canvasRect.width, canvasHeightPx: canvasRect.height };
}

async function requestMultiLayoutSuggestion() {
  if (!selectedSection.value || selectedItemKeys.value.length < 2 || multiLayoutPlanning.value) return;
  multiLayoutPlanning.value = true;
  multiLayoutError.value = "";
  multiLayoutSuggestion.value = null;
  try {
    const captured = captureMultiLayoutGeometry(selectedSection.value);
    const response = await fetch("/api/promo-multi-component-layout-plan", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        formTemplateId: template.value?.id,
        sectionKey: selectedSection.value.sectionKey,
        selectedItemKeys: selectedItemKeys.value,
        geometry: captured.geometry,
        sectionInputs: sectionInputs.value?.[selectedSection.value.sectionKey] || {},
      }),
    });
    const result = await response.json().catch(() => ({}));
    if (!response.ok) throw new Error(result.message || result.error || `AI 정렬 요청 오류(${response.status})`);
    const resolved = resolveSafeMultiLayoutOperation(captured.geometry, result.suggestion, captured);
    multiLayoutSuggestion.value = {
      ...resolved.plan,
      requestedOperation: result.suggestion.operation,
      adjusted: resolved.adjusted,
      adjustmentReason: resolved.adjustmentReason,
      sectionKey: selectedSection.value.sectionKey,
      before: captured.geometry,
      after: resolved.geometry,
    };
  } catch (planningError) {
    multiLayoutError.value = planningError.message;
  } finally {
    multiLayoutPlanning.value = false;
  }
}

function applyMultiLayoutSuggestion() {
  const suggestion = multiLayoutSuggestion.value;
  if (!suggestion || suggestion.sectionKey !== selectedSection.value?.sectionKey) return;
  const patches = geometryToItemStylePatches(suggestion.after);
  const nextItemStyles = { ...(designSpec.value.itemStyles || {}) };
  Object.entries(patches).forEach(([itemKey, patch]) => {
    const key = `${suggestion.sectionKey}.${itemKey}`;
    nextItemStyles[key] = { ...(nextItemStyles[key] || {}), ...patch };
  });
  multiLayoutUndoStack.value = [
    ...multiLayoutUndoStack.value.slice(-19),
    { revision: multiLayoutRevision.value, label: layoutOperationLabel(suggestion.operation) },
  ];
  executeEditorCommand(EditorCommandType.LAYOUT_REPLACE, {
    layout: { ...designSpec.value, itemStyles: nextItemStyles },
  }, { source: "ai", label: layoutOperationLabel(suggestion.operation) });
  multiLayoutRevision.value += 1;
  multiLayoutSuggestion.value = null;
  multiLayoutError.value = "";
}

function undoMultiLayout() {
  const previous = multiLayoutUndoStack.value.at(-1);
  if (!previous) return;
  undoEditorCommand();
  multiLayoutRevision.value = previous.revision;
  multiLayoutUndoStack.value = multiLayoutUndoStack.value.slice(0, -1);
  multiLayoutSuggestion.value = null;
  multiLayoutError.value = "";
}

function currentCompositionLayout(sectionKey) {
  return {
    sectionStyle: designSpec.value.sectionStyles?.[sectionKey] || {},
    itemStyles: Object.fromEntries(Object.entries(designSpec.value.itemStyles || {}).filter(([key]) => (
      key === sectionKey || key.startsWith(`${sectionKey}.`)
    ))),
  };
}

function compositionRequestPayload() {
  const sectionKey = selectedSection.value?.sectionKey;
  return {
    formTemplateId: template.value?.id,
    designTokenSetVersionId: template.value?.designTokens?.versionId || "",
    sectionKey,
    instruction: compositionInstruction.value,
    sectionInputs: sectionInputs.value?.[sectionKey] || {},
    currentLayout: currentCompositionLayout(sectionKey),
    generateBackgroundImage: compositionGenerateBackground.value,
    imageGuidance: compositionImageGuidance.value,
    fadeMode: compositionFadeMode.value,
  };
}

async function requestSectionComposition() {
  if (!selectedSection.value || compositionInstruction.value.trim().length < 3 || compositionPlanning.value) return;
  compositionPlanning.value = true;
  compositionError.value = "";
  compositionResult.value = null;
  const requestSequence = ++compositionRequestSequence;
  try {
    const requestPayload = compositionRequestPayload();
    const response = await fetch("/api/promo-section-composition-plan", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(requestPayload),
    });
    const result = await response.json().catch(() => ({}));
    if (!response.ok) throw new Error(result.message || result.error || `AI 섹션 구성 요청 오류(${response.status})`);
    if (requestSequence === compositionRequestSequence
      && selectedSectionKey.value === requestPayload.sectionKey) {
      compositionResult.value = { ...result, requestPayload };
    }
  } catch (planningError) {
    if (requestSequence === compositionRequestSequence) compositionError.value = planningError.message;
  } finally {
    if (requestSequence === compositionRequestSequence) compositionPlanning.value = false;
  }
}

async function applySectionComposition() {
  const planned = compositionResult.value;
  if (!planned?.rawPlan || !selectedSection.value || compositionApplying.value) return;
  compositionApplying.value = true;
  compositionError.value = "";
  const requestSequence = compositionRequestSequence;
  const plannedSectionKey = planned.requestPayload?.sectionKey;
  try {
    const response = await fetch("/api/promo-section-composition-validate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...planned.requestPayload,
        sectionInputs: sectionInputs.value?.[planned.requestPayload.sectionKey] || {},
        currentLayout: currentCompositionLayout(planned.requestPayload.sectionKey),
        fingerprint: planned.fingerprint,
        inputFingerprint: planned.inputFingerprint,
        layoutFingerprint: planned.layoutFingerprint,
        rawPlan: planned.rawPlan,
      }),
    });
    const result = await response.json().catch(() => ({}));
    if (!response.ok) throw new Error(result.message || result.error || `AI 섹션 구성 검증 오류(${response.status})`);
    if (requestSequence !== compositionRequestSequence || selectedSectionKey.value !== plannedSectionKey) return;
    const proposal = result.proposal;
    const sectionKey = selectedSection.value.sectionKey;
    const nextItemStyles = { ...(designSpec.value.itemStyles || {}) };
    Object.entries(proposal.layoutPatch?.itemStyles || {}).forEach(([styleKey, patch]) => {
      nextItemStyles[styleKey] = { ...(nextItemStyles[styleKey] || {}), ...patch };
    });
    const nextSectionStyles = { ...(designSpec.value.sectionStyles || {}) };
    Object.entries(proposal.layoutPatch?.sectionStyles || {}).forEach(([styleKey, patch]) => {
      nextSectionStyles[styleKey] = { ...(nextSectionStyles[styleKey] || {}), ...patch };
    });
    if (proposal.backgroundImage?.requested) {
      nextSectionStyles[sectionKey] = {
        ...(nextSectionStyles[sectionKey] || {}),
        backgroundFadeMode: proposal.backgroundImage.fadeMode,
        backgroundFadeSafeArea: proposal.backgroundImage.safeArea,
      };
    }
    executeEditorCommand(EditorCommandType.DOCUMENT_PATCH, {
      content: {
        ...sectionInputs.value,
        [sectionKey]: proposal.content,
      },
      layout: {
        ...designSpec.value,
        itemStyles: nextItemStyles,
        sectionStyles: nextSectionStyles,
      },
    }, { source: "ai", label: "AI 섹션 구성 적용" });
    compositionResult.value = null;
    await nextTick();
    if (proposal.backgroundImage?.requested) {
      requestSectionAiAction(
        selectedSection.value,
        "generate",
        "",
        "section-background",
        "",
        proposal.backgroundImage.guidance,
        proposal.backgroundImage.safeArea,
      );
    }
  } catch (applyError) {
    if (requestSequence === compositionRequestSequence) compositionError.value = applyError.message;
  } finally {
    if (requestSequence === compositionRequestSequence) compositionApplying.value = false;
  }
}

function toggleComponent(section, item) {
  const key = componentKey(section, item);
  selectItem(section, item, { preserveMulti: selectedItemKeys.value.includes(item.itemKey) });
  expandedComponentKey.value = expandedComponentKey.value === key ? "" : key;
}

function updateSelectedValue(value) {
  if (!selectedSection.value || !selectedItem.value) return;
  executeEditorCommand(EditorCommandType.CONTENT_VALUE_SET, {
    sectionKey: selectedSection.value.sectionKey,
    itemKey: selectedItem.value.itemKey,
    value,
  }, { label: "콘텐츠 변경" });
}

function updateObjectField(key, value) {
  updateSelectedValue({ ...(selectedValue.value || {}), [key]: value });
}

function componentFields(item) {
  const fields = Array.isArray(item?.fields) ? item.fields : [];
  return fields.length ? fields : [item];
}

function fieldValue(item, field) {
  const componentValue = sectionInputs.value?.[selectedSection.value?.sectionKey]?.[item?.itemKey];
  if (componentFields(item).length <= 1) return componentValue;
  return componentValue?.fields?.[field.fieldKey];
}

function updateFieldValue(item, field, value) {
  if (!selectedSection.value || !item || !field || item.isLocked || field.isLocked) return;
  if (componentFields(item).length <= 1) {
    updateSelectedValue(value);
    return;
  }
  const sectionKey = selectedSection.value.sectionKey;
  const componentValue = sectionInputs.value?.[sectionKey]?.[item.itemKey] || {};
  executeEditorCommand(EditorCommandType.CONTENT_VALUE_SET, {
    sectionKey,
    itemKey: item.itemKey,
    value: {
      ...componentValue,
      fields: {
        ...(componentValue.fields || {}),
        [field.fieldKey]: value,
      },
    },
  }, { label: `${field.name || field.fieldKey} 콘텐츠 변경` });
}

function updateFieldObject(item, field, key, value) {
  updateFieldValue(item, field, { ...(fieldValue(item, field) || {}), [key]: value });
}

function updateRendererContent(section, item, value, field = null) {
  selectItem(section, item);
  if (field) {
    if (field.fieldKind !== "text" || field.isLocked) return;
    updateFieldValue(item, field, value);
    return;
  }
  if (item.fieldKind !== "text" || item.isLocked) return;
  updateSelectedValue(value);
}

function itemContentRegistered(section, item) {
  const value = sectionInputs.value?.[section.sectionKey]?.[item.itemKey];
  if (componentFields(item).length > 1) {
    const fields = componentFields(item);
    const requiredFields = fields.filter((field) => field.isRequired || field.isLocked);
    const candidates = requiredFields.length ? requiredFields : fields;
    const matches = candidates.map((field) => {
        const fieldContent = value?.fields?.[field.fieldKey];
        if (field.fieldKind === "cta") return Boolean(String(fieldContent?.label || "").trim() && String(fieldContent?.link || "").trim());
        if (field.fieldKind === "image") return Boolean(String(fieldContent?.value || "").trim());
        return Boolean(String(fieldContent || "").trim());
      });
    return requiredFields.length ? matches.every(Boolean) : matches.some(Boolean);
  }
  if (item.fieldKind === "cta") {
    return Boolean(String(value?.label || "").trim() && String(value?.link || "").trim());
  }
  if (item.fieldKind === "image") return Boolean(String(value?.value || "").trim());
  return Boolean(String(value || "").trim());
}

function sectionContentRegistered(section) {
  const items = section.items || [];
  const requiredItems = items.filter((item) => item.isRequired || item.isLocked);
  if (requiredItems.length) return requiredItems.every((item) => itemContentRegistered(section, item));
  return items.some((item) => itemContentRegistered(section, item));
}

function requestAutoRegister() {
  if (!isCreatePromoWizardMode.value || autoRegisterPending.value) return;
  autoRegisterPending.value = true;
  autoRegisterMessage.value = "";
  promoBuilderAdapter.requestAutoRegister(sectionInputs.value);
}

function sectionAiRun(section) {
  return sectionDesignRuns.value?.[section.sectionKey] || null;
}

function sectionAiIsStale(section) {
  const saved = sectionAiRun(section);
  if (!saved?.sourceInputs) return false;
  return JSON.stringify(saved.sourceInputs) !== JSON.stringify(sectionInputs.value?.[section.sectionKey] || {});
}

function sectionAiIsProcessing(section) {
  return ["queued", "analyzing_content", "generating_layout", "validating_layout", "generating_assets", "validating_assets", "applying"]
    .includes(sectionAiRun(section)?.status);
}

function sectionAiHasContent(section) {
  const inputs = sectionInputs.value?.[section.sectionKey] || {};
  return (section.items || []).some((item) => {
    if (item.isVisibleInWizard === false) return false;
    const value = inputs[item.itemKey];
    if (componentFields(item).length > 1) {
      return componentFields(item).some((field) => {
        if (field.fieldKind === "image") return false;
        const fieldContent = value?.fields?.[field.fieldKey];
        const candidate = field.fieldKind === "cta" ? fieldContent?.label : fieldContent;
        return String(candidate || "").trim().length >= 2;
      });
    }
    if (item.fieldKind === "image") return false;
    const content = item.fieldKind === "cta" ? value?.label : value;
    return String(content || "").trim().length >= 2;
  });
}

function sectionAiPrimaryAction(section) {
  const run = sectionAiRun(section);
  const matchesBackground = run?.constraintsSnapshot?.imageTarget?.type === "section-background";
  if (sectionAiIsProcessing(section)) return { action: "generate", label: "AI 생성 중", disabled: true };
  if (matchesBackground && run?.status === "ready" && !sectionAiIsStale(section)) return { action: "generate", label: "AI 적용 중", disabled: true };
  if (matchesBackground && run?.status === "applied") return { action: "generate", label: "AI 재생성", disabled: !sectionAiHasContent(section) };
  return { action: "generate", label: "AI 디자인", disabled: !sectionAiHasContent(section) };
}

function sectionAiAllowedItemKeys(section) {
  return Array.isArray(section?.aiDesign?.imageTargetItemKeys)
    ? section.aiDesign.imageTargetItemKeys
    : [];
}

function sectionAiItemAllowed(section, item, field = null) {
  const definition = field || item;
  return Boolean(
    section?.aiDesign?.enabled !== false
      && definition?.fieldKind === "image"
      && item?.isVisibleInWizard !== false
      && !item?.isLocked
      && !definition?.isLocked
      && definition?.image?.allowedSources?.includes("ai")
      && sectionAiAllowedItemKeys(section).includes(item.itemKey)
  );
}

function sectionAiRunTargetItemKey(section) {
  const target = sectionAiRun(section)?.constraintsSnapshot?.imageTarget;
  return target?.type === "item" ? target.itemKey : "";
}

function sectionAiItemAction(section, item, field = null) {
  const run = sectionAiRun(section);
  const target = run?.constraintsSnapshot?.imageTarget;
  const matchesItem = sectionAiRunTargetItemKey(section) === item?.itemKey
    && (!field || target?.fieldKey === field.fieldKey);
  if (sectionAiIsProcessing(section)) return { action: "generate", label: "AI 이미지 생성 중", disabled: true };
  if (matchesItem && run?.status === "ready" && !sectionAiIsStale(section)) {
    return { action: "generate", label: "AI 이미지 적용 중", disabled: true };
  }
  if (matchesItem && run?.status === "applied") {
    return { action: "generate", label: "AI 이미지 재생성", disabled: !sectionAiHasContent(section) };
  }
  return { action: "generate", label: "AI 이미지 생성", disabled: !sectionAiHasContent(section) };
}

function requestSectionAiAction(
  section, action, targetItemKey = "", targetType = "", targetFieldKey = "",
  imageGuidance = "", imageSafeArea = "",
) {
  const resolvedTargetType = targetType || (targetItemKey ? "item" : "section-background");
  promoBuilderAdapter.requestSectionAiAction({
    sectionKey: section.sectionKey,
    action,
    targetType: resolvedTargetType,
    targetItemKey,
    targetFieldKey,
    imageGuidance,
    imageSafeArea,
  });
}

function sectionHasAiBackground(section) {
  return Boolean(designSpec.value?.sectionStyles?.[section.sectionKey]?.backgroundImage);
}

function requestImageRemoval(field = null) {
  if (!selectedSection.value || !selectedItem.value || selectedItem.value.isLocked) return;
  if (field?.isLocked) return;
  if (!window.confirm(`${field?.name || selectedItem.value.name} 이미지를 삭제할까요?`)) return;
  promoBuilderAdapter.requestImageRemoval({
    sectionKey: selectedSection.value.sectionKey,
    itemKey: selectedItem.value.itemKey,
    fieldKey: field?.fieldKey || null,
  });
}

function updateDesignToken(versionId) {
  if (!isAdminLayoutMode.value || !template.value?.id) return;
  const tokenSet = designTokenSets.value.find((candidate) => candidate.versionId === versionId);
  if (!tokenSet) return;
  previewDesignTokenVersionId.value = tokenSet.versionId;
  template.value = {
    ...template.value,
    designTokens: {
      setKey: tokenSet.setKey,
      version: tokenSet.version,
      versionId: tokenSet.versionId,
      values: tokenSet.values || {},
      sourceValues: tokenSet.sourceValues || [],
    },
  };
  layoutSaveMessage.value = `${tokenSet.name} v${tokenSet.version} 토큰으로 미리보는 중입니다. 템플릿에는 저장되지 않습니다.`;
}

const selectedStyleKey = computed(() => (
  selectedSection.value && selectedItem.value
    ? `${selectedSection.value.sectionKey}.${selectedItem.value.itemKey}`
    : ""
));
const selectedItemStyle = computed(() => designSpec.value.itemStyles?.[selectedStyleKey.value] || {});
const selectedColorTokenOption = computed(() => colorTokenOptions.value.find(
  (token) => token.key === selectedItemStyle.value.colorToken
) || null);
const selectedFontSizeTokenOption = computed(() => fontSizeTokenOptions.value.find(
  (token) => token.key === selectedItemStyle.value.fontSizeToken
) || null);
const selectedSectionStyle = computed(() => (
  selectedSection.value
    ? designSpec.value.sectionStyles?.[selectedSection.value.sectionKey] || {}
    : {}
));

function updateItemStyle(patch) {
  if (!selectedStyleKey.value || selectedItem.value?.isLocked) return;
  executeEditorCommand(EditorCommandType.ITEM_STYLE_PATCH, {
    styleKey: selectedStyleKey.value,
    patch,
  }, { label: "컴포넌트 스타일 변경" });
}

function updateRendererItemStyle(section, item, patch) {
  if (!section || !item || item.isLocked) return;
  const key = `${section.sectionKey}.${item.itemKey}`;
  const nextPatch = { ...patch };
  if (nextPatch.fontSize !== undefined) {
    const requestedSize = Number(nextPatch.fontSize);
    const closestToken = fontSizeTokenOptions.value.reduce((closest, token) => (
      !closest || Math.abs(token.px - requestedSize) < Math.abs(closest.px - requestedSize)
        ? token
        : closest
    ), null);
    if (closestToken) {
      nextPatch.fontSize = closestToken.px;
      nextPatch.fontSizeToken = closestToken.key;
    } else {
      delete nextPatch.fontSize;
    }
  }
  executeEditorCommand(EditorCommandType.ITEM_STYLE_PATCH, {
    styleKey: key,
    patch: nextPatch,
  }, { source: "pointer", label: "컴포넌트 위치·크기 변경" });
}

function resetItemStyle() {
  if (!selectedStyleKey.value || selectedItem.value?.isLocked) return;
  executeEditorCommand(EditorCommandType.ITEM_STYLE_REMOVE, {
    styleKey: selectedStyleKey.value,
  }, { label: "컴포넌트 스타일 초기화" });
}

function restoreAutomaticPosition() {
  if (!selectedStyleKey.value || selectedItem.value?.isLocked) return;
  const nextStyle = withoutFreePosition(designSpec.value.itemStyles?.[selectedStyleKey.value]);
  if (Object.keys(nextStyle).length) {
    executeEditorCommand(EditorCommandType.ITEM_STYLE_REPLACE, {
      styleKey: selectedStyleKey.value,
      style: nextStyle,
    }, { label: "자동 위치 복원" });
  } else {
    executeEditorCommand(EditorCommandType.ITEM_STYLE_REMOVE, {
      styleKey: selectedStyleKey.value,
    }, { label: "자동 위치 복원" });
  }
}

function updateSectionStyle(sectionKey, patch) {
  if (!sectionKey) return;
  executeEditorCommand(EditorCommandType.SECTION_STYLE_PATCH, {
    sectionKey,
    patch,
  }, { label: "섹션 스타일 변경" });
}

function setSectionBackgroundAlignment(alignment) {
  if (!selectedSection.value || !["left", "center", "right"].includes(alignment)) return;
  updateSectionStyle(selectedSection.value.sectionKey, {
    backgroundPosition: `${alignment} center`,
  });
}

function setSectionBackgroundFadeMode(mode) {
  if (!selectedSection.value || !["none", "left", "right", "both"].includes(mode)) return;
  updateSectionStyle(selectedSection.value.sectionKey, {
    backgroundFadeMode: mode,
    backgroundFadeStrength: selectedSectionStyle.value.backgroundFadeStrength || "medium",
  });
}

function setImageShape(shape) {
  if (!["square", "rounded", "circle"].includes(shape)) return;
  updateItemStyle(shape === "circle"
    ? { shape, aspectRatio: "1/1", aspectRatioLocked: true, heightPx: undefined }
    : { shape });
}

function setImageResizeMode(mode) {
  if (!selectedStyleKey.value || selectedItem.value?.isLocked || !["locked", "free"].includes(mode)) return;
  const nextStyle = { ...selectedItemStyle.value };
  if (mode === "locked" || nextStyle.shape === "circle") {
    nextStyle.aspectRatioLocked = true;
    nextStyle.aspectRatio = nextStyle.shape === "circle"
      ? "1/1"
      : (nextStyle.aspectRatio || selectedItem.value?.image?.aspectRatio || "1/1");
    delete nextStyle.heightPx;
  } else {
    nextStyle.aspectRatioLocked = false;
    nextStyle.heightPx = Number(nextStyle.heightPx || 240);
  }
  executeEditorCommand(EditorCommandType.ITEM_STYLE_REPLACE, {
    styleKey: selectedStyleKey.value,
    style: nextStyle,
  }, { label: "이미지 크기 조절 방식 변경" });
}

function resetSectionHeight() {
  if (!selectedSection.value) return;
  const sectionKey = selectedSection.value.sectionKey;
  const nextSectionStyle = { ...(designSpec.value.sectionStyles?.[sectionKey] || {}) };
  delete nextSectionStyle.minHeight;
  if (Object.keys(nextSectionStyle).length) {
    executeEditorCommand(EditorCommandType.SECTION_STYLE_REPLACE, {
      sectionKey,
      style: nextSectionStyle,
    }, { label: "섹션 높이 초기화" });
  } else {
    executeEditorCommand(EditorCommandType.SECTION_STYLE_REMOVE, {
      sectionKey,
    }, { label: "섹션 높이 초기화" });
  }
}

async function loadEditor() {
  try {
    const listResponse = await fetch("/api/wizard-form-templates-public");
    const listResult = await listResponse.json();
    if (!listResponse.ok) throw new Error(listResult.message || listResult.error || "템플릿 목록을 불러오지 못했습니다.");
    templates.value = listResult.templates || [];
    const defaultTemplate = templates.value.find((candidate) => candidate.isDefault);
    if (!defaultTemplate) throw new Error("활성화된 기본 Form Template이 없습니다.");

    const detailResponse = await fetch(`/api/wizard-form-template-public?id=${encodeURIComponent(defaultTemplate.id)}`);
    const detailResult = await detailResponse.json();
    if (!detailResponse.ok) throw new Error(detailResult.message || detailResult.error || "템플릿 구성을 불러오지 못했습니다.");
    template.value = {
      ...detailResult.template,
      designTokens: detailResult.designTokens || null,
    };
    configRevision.value = detailResult.configRevision || "";
    sections.value = detailResult.sections || [];
    sectionInputs.value = createSectionInputs(sections.value);
    selectedSectionKey.value = sections.value[0]?.sectionKey || "";
    selectedItemKey.value = sections.value[0]?.items?.[0]?.itemKey || "";
    selectedItemKeys.value = selectedItemKey.value ? [selectedItemKey.value] : [];
    expandedComponentKey.value = componentKey(sections.value[0], sections.value[0]?.items?.[0]);
    hydrateEditorCore();
  } catch (loadError) {
    error.value = loadError.message;
  } finally {
    loading.value = false;
  }
}

function openOutput() {
  if (!editorSnapshot.value) return;
  outputSaveError.value = "";
  const result = outputAdapter.save(editorSnapshot.value);
  if (!result.ok) {
    outputSaveError.value = result.message;
    return;
  }
  outputAdapter.open();
}

async function loadAdminLayout() {
  const templateId = new URLSearchParams(window.location.search).get("templateId");
  if (!templateId) {
    error.value = "templateId가 필요합니다.";
    loading.value = false;
    return;
  }
  try {
    const [result, availableTokenSets] = await Promise.all([
      adminTemplateAdapter.loadLayout(templateId),
      adminTemplateAdapter.loadDesignTokenSets(),
    ]);
    designTokenSets.value = availableTokenSets;
    template.value = result.template;
    const previewTokenSet = availableTokenSets.find((candidate) => candidate.isDefault)
      || availableTokenSets[0]
      || null;
    if (previewTokenSet) {
      previewDesignTokenVersionId.value = previewTokenSet.versionId;
      template.value = {
        ...template.value,
        designTokens: {
          setKey: previewTokenSet.setKey,
          version: previewTokenSet.version,
          versionId: previewTokenSet.versionId,
          values: previewTokenSet.values || {},
          sourceValues: previewTokenSet.sourceValues || [],
        },
      };
    }
    sections.value = result.sections || [];
    sectionInputs.value = createSectionInputs(sections.value);
    designSpec.value = normalizeLayoutSpec(result.layout?.layoutSpec);
    layoutRevision.value = Number(result.layout?.layoutRevision || 1);
    layoutId.value = result.layout?.id || null;
    layoutIdentity.value = result.layoutIdentity || null;
    selectedSectionKey.value = sections.value[0]?.sectionKey || "";
    selectedItemKey.value = sections.value[0]?.items?.[0]?.itemKey || "";
    selectedItemKeys.value = selectedItemKey.value ? [selectedItemKey.value] : [];
    expandedComponentKey.value = componentKey(sections.value[0], sections.value[0]?.items?.[0]);
    hydrateEditorCore();
  } catch (loadError) {
    error.value = loadError.message;
  } finally {
    loading.value = false;
  }
}

async function saveAdminLayout({ activate = false } = {}) {
  if (!template.value?.id || layoutSaving.value) return;
  layoutSaveMessage.value = "";
  const validation = validateLayoutSpec(designSpec.value);
  if (!validation.ok) {
    layoutSaveMessage.value = `레이아웃 검증 실패: ${validation.errors[0]?.path || "unknown"}`;
    return;
  }
  layoutSaving.value = true;
  try {
    const result = await adminTemplateAdapter.saveLayout({
      templateId: template.value.id,
      expectedRevision: layoutRevision.value,
      rendererKey: "default-promo-renderer",
      rendererVersion: 1,
      layoutSpec: validation.spec,
      changeNote: layoutChangeNote.value || "Admin Layout Editor에서 기본 레이아웃을 저장했습니다.",
    });
    designSpec.value = normalizeLayoutSpec(result.layout.layoutSpec);
    layoutRevision.value = Number(result.layout.layoutRevision || layoutRevision.value + 1);
    layoutId.value = result.layout.id || layoutId.value;
    layoutIdentity.value = result.layoutIdentity || layoutIdentity.value;
    editorCore.replaceDocument(editorDocumentFromRefs(), { resetHistory: false, dirty: false });
    updateEditorHistory();
    layoutChangeNote.value = "";
    if (!activate) {
      layoutSaveMessage.value = `초안 v${template.value.version || 1} · layout r${layoutRevision.value} 저장 완료 · 프로모션 빌더 반영을 위해 템플릿을 활성화하세요.`;
      return;
    }

    const activateResult = await adminTemplateAdapter.activateTemplate({
      id: template.value.id,
      changeNote: "Admin Layout Editor에서 기본 레이아웃 저장 후 활성화했습니다.",
    });
    if (Number(activateResult.layoutIdentity?.layoutRevision || 0) !== layoutRevision.value) {
      throw new Error("활성화 결과의 Layout revision이 방금 저장한 초안과 일치하지 않습니다.");
    }
    template.value = { ...template.value, ...(activateResult.template || {}), status: "active" };
    layoutIdentity.value = activateResult.layoutIdentity || layoutIdentity.value;
    layoutSaveMessage.value = `활성 v${template.value.version || 1} · layout r${layoutRevision.value} 반영 완료 · 신규 프로모션 빌더에서 사용됩니다.`;
  } catch (saveError) {
    layoutSaveMessage.value = saveError.message;
  } finally {
    layoutSaving.value = false;
  }
}

async function applyExternalSnapshot(snapshot) {
  if (!snapshot?.content) return;
  const incomingSnapshotRevision = Number(snapshot.snapshotRevision || 0);
  if (incomingSnapshotRevision && incomingSnapshotRevision < lastExternalSnapshotRevision) return;
  if (incomingSnapshotRevision) lastExternalSnapshotRevision = incomingSnapshotRevision;
  const previousSectionKey = selectedSection.value?.sectionKey || selectedSectionKey.value;
  const previousItemKey = selectedItem.value?.itemKey || selectedItemKey.value;
  const previousExpandedComponentKey = expandedComponentKey.value;
  applyingExternalSnapshot = true;
  const resetEditorHistory = !externalSnapshotReady.value;
  template.value = snapshot.content.formTemplate || null;
  configRevision.value = snapshot.content.formTemplate?.configRevision || "";
  sections.value = snapshot.content.sectionSnapshot || [];
  sectionInputs.value = snapshot.content.sectionInputs || {};
  sectionDesignRuns.value = snapshot.content.sectionDesignRuns || {};
  designSpec.value = normalizeLayoutSpec(snapshot.designSpec);
  layoutRevision.value = Number(snapshot.layoutRevision || 1);
  layoutIdentity.value = snapshot.layoutIdentity || null;
  const nextSelectedSection = sections.value.find((section) => section.sectionKey === previousSectionKey)
    || sections.value[0];
  selectedSectionKey.value = nextSelectedSection?.sectionKey || "";
  selectedItemKey.value = nextSelectedSection?.items?.some((item) => item.itemKey === previousItemKey)
    ? previousItemKey
    : nextSelectedSection?.items?.[0]?.itemKey || "";
  selectedItemKeys.value = selectedItemKey.value ? [selectedItemKey.value] : [];
  multiLayoutSuggestion.value = null;
  const selectedComponentKey = componentKey(
    nextSelectedSection,
    nextSelectedSection?.items?.find((item) => item.itemKey === selectedItemKey.value),
  );
  expandedComponentKey.value = sections.value.some((section) => (
    (section.items || []).some((item) => componentKey(section, item) === previousExpandedComponentKey)
  ))
    ? previousExpandedComponentKey
    : selectedComponentKey;
  externalSnapshotReady.value = true;
  hydrateEditorCore({ resetHistory: resetEditorHistory });
  loading.value = false;
  error.value = "";
  await nextTick();
  applyingExternalSnapshot = false;
}

function handleParentMessage(message) {
  if (!isWizardLayoutMode.value) return;
  if (message?.type === PromoBuilderMessageType.AUTO_REGISTER_RESULT) {
    autoRegisterPending.value = false;
    const count = Number(message.registeredCount || 0);
    autoRegisterMessage.value = count
      ? `${count}개 항목을 자동 등록했습니다.`
      : "자동 등록할 빈 항목이 없습니다.";
    return;
  }
  if (message?.type === PromoBuilderMessageType.SNAPSHOT) {
    applyExternalSnapshot(message.snapshot);
  }
}

watch([designSpec, sectionInputs], () => {
  if (!isWizardLayoutMode.value || !externalSnapshotReady.value || applyingExternalSnapshot) return;
  promoBuilderAdapter.notifyChange({
    snapshotRevision: lastExternalSnapshotRevision,
    designSpec: designSpec.value,
    sectionInputs: sectionInputs.value,
  });
}, { deep: true });

function loadOutput() {
  try {
    outputSnapshot.value = outputAdapter.load();
  } catch (loadError) {
    error.value = loadError.message;
  }
}

onMounted(() => {
  if (usesEmbeddedEngineShell.value) {
    document.documentElement.classList.add("layout-editor-document");
    document.body.classList.add("layout-editor-document");
  }
  if (isCreatePromoWizardMode.value) {
    document.documentElement.classList.add("create-promo-editor-document");
    document.body.classList.add("create-promo-editor-document");
  }
  window.PromoShell?.init(document);
  if (props.mode === "output") loadOutput();
  else if (isAdminLayoutMode.value) loadAdminLayout();
  else if (isWizardLayoutMode.value) {
    loading.value = true;
    disconnectPromoBuilder = promoBuilderAdapter.connect(handleParentMessage);
    promoBuilderAdapter.notifyReady();
  } else loadEditor();
});

onBeforeUnmount(() => {
  disconnectPromoBuilder?.();
  disconnectPromoBuilder = null;
  document.documentElement.classList.remove("layout-editor-document");
  document.body.classList.remove("layout-editor-document");
  document.documentElement.classList.remove("create-promo-editor-document");
  document.body.classList.remove("create-promo-editor-document");
});
</script>

<template>
  <div v-if="mode === 'output'" class="output-shell">
    <header class="output-toolbar">
      <div>
        <span>WEB OUTPUT</span>
        <strong>{{ rendererSnapshot?.content?.formTemplate?.name || "Visual Editor" }}</strong>
      </div>
      <a href="/prototype/visual-editor.html">Visual Editor로 돌아가기</a>
    </header>
    <div v-if="error" class="system-message system-message--error">{{ error }}</div>
    <PromoPageRenderer
      v-else-if="rendererSnapshot"
      :content="rendererSnapshot.content"
      :design-spec="rendererSnapshot.designSpec"
      :assets="rendererSnapshot.assets"
    />
  </div>

  <main
    v-else
    class="editor-shell"
    :class="{
      'shell-frame': !usesEmbeddedEngineShell,
      'editor-shell--embedded': usesEmbeddedEngineShell,
    }"
    :data-shell-frame="!usesEmbeddedEngineShell ? '' : null"
  >
    <aside v-if="!usesEmbeddedEngineShell" class="shell-sidebar" id="visual-editor-global-navigation" data-shell-sidebar aria-label="전역 내비게이션">
      <button class="shell-sidebar__close" type="button" data-shell-sidebar-close aria-label="메뉴 닫기">닫기</button>
      <div class="shell-sidebar__brand">
        <span class="shell-sidebar__brand-mark" aria-hidden="true"><i data-lucide="panels-top-left"></i></span>
        <span class="shell-sidebar__brand-copy"><strong>PROMO WEB<br />BUILDER</strong><span>Workspace</span></span>
      </div>
      <div class="shell-sidebar__mode" role="group" aria-label="사이드바 표시 방식">
        <button type="button" data-shell-sidebar-mode="min" aria-label="사이드바 최소화" title="최소"><i data-lucide="panel-left-close" aria-hidden="true"></i><span>최소</span></button>
        <button type="button" data-shell-sidebar-mode="max" aria-label="사이드바 최대화" title="최대"><i data-lucide="panel-left-open" aria-hidden="true"></i><span>최대</span></button>
      </div>
      <nav class="shell-nav shell-nav--vertical" aria-label="프로토타입 내비게이션">
        <a
          v-for="item in shellNavItems"
          :key="item.key"
          :href="item.href"
          :class="{ active: item.key === 'visual-editor' }"
          :aria-current="item.key === 'visual-editor' ? 'page' : null"
          :aria-label="item.label"
          :title="item.label"
        ><i :data-lucide="item.icon" aria-hidden="true"></i><span data-shell-nav-label>{{ item.label }}</span></a>
      </nav>
      <div class="shell-sidebar__footer">
        <button class="shell-theme-toggle" type="button" data-shell-theme-toggle>
          <i data-lucide="sun-moon" aria-hidden="true"></i>
          <strong data-shell-theme-label>Light</strong>
        </button>
      </div>
    </aside>

    <div :class="!usesEmbeddedEngineShell ? 'shell-main' : 'editor-embedded-main'">
      <header v-if="!usesEmbeddedEngineShell" class="shell-utility-bar editor-shell-header">
        <div class="shell-page-identity">
          <button class="shell-menu-toggle" type="button" data-shell-menu-toggle aria-controls="visual-editor-global-navigation" aria-expanded="false" aria-label="메뉴 열기">메뉴</button>
          <strong>{{ isAdminLayoutMode ? "Admin Template Layout" : "Visual Editor" }}</strong>
        </div>
        <div class="shell-page-actions">
        <div class="shell-status" role="status">{{ isAdminLayoutMode ? `Layout revision ${layoutRevision}` : "편집 준비" }}</div>
        </div>
      </header>

      <div
        class="editor-content"
        :class="{
          'shell-content': !usesEmbeddedEngineShell,
          'editor-content--embedded': usesEmbeddedEngineShell,
        }"
      >

    <header v-if="!isBuilderWorkspaceMode" class="editor-header editor-toolbar">
      <div>
        <span>{{ isAdminLayoutMode ? "ADMIN TEMPLATE LAYOUT" : isWizardLayoutMode ? "WIZARD LAYOUT" : "VISUAL EDITOR" }}</span>
        <h2>{{ template?.name || "Default Renderer" }}</h2>
        <small v-if="isAdminLayoutMode" class="editor-mode-note">
          v{{ template?.version || 1 }} · {{ template?.status || "draft" }} · Draft 저장 후 템플릿을 활성화해야 Create Promo에 반영됩니다.
        </small>
      </div>
      <div class="editor-global-actions">
        <nav v-if="isAdminLayoutMode" aria-label="Visual Editor navigation">
          <input v-model="layoutChangeNote" type="text" placeholder="변경 사유" aria-label="레이아웃 변경 사유" />
          <button type="button" :disabled="!editorSnapshot || layoutSaving" @click="saveAdminLayout">
            {{ layoutSaving ? "저장 중" : "기본 레이아웃 저장" }}
          </button>
        </nav>
      </div>
    </header>

    <div v-if="loading" class="system-message">기본 Form Template을 불러오는 중입니다.</div>
    <div v-else-if="error" class="system-message system-message--error">{{ error }}</div>
    <div v-if="outputSaveError" class="system-message system-message--error" role="alert">{{ outputSaveError }}</div>
    <div v-if="layoutSaveMessage" class="system-message" role="status">{{ layoutSaveMessage }}</div>

    <section
      v-if="!loading && !error"
      class="editor-workspace"
      :class="{
        'is-builder-workspace': isBuilderWorkspaceMode,
        'is-create-promo-wizard': isCreatePromoWizardMode,
        'is-admin-layout-workspace': isAdminLayoutMode,
      }"
    >
      <SectionPanel
        :sections="sections"
        :selected-section="selectedSection"
        :selected-section-style="selectedSectionStyle"
        :capabilities="capabilities"
        :section-content-registered="sectionContentRegistered"
        :section-ai-primary-action="sectionAiPrimaryAction"
        :section-has-ai-background="sectionHasAiBackground"
        :section-ai-is-processing="sectionAiIsProcessing"
        @select-section="selectSection"
        @section-ai-action="(section, action, targetItemKey, targetType) => requestSectionAiAction(section, action, targetItemKey, targetType)"
        @background-alignment="setSectionBackgroundAlignment"
        @background-fade="setSectionBackgroundFadeMode"
        @update-section-style="updateSectionStyle"
        @reset-section-height="resetSectionHeight"
      >
        <template #section-composition>
          <SectionCompositionControls
            v-if="capabilities.canRunSectionAi"
            :instruction="compositionInstruction"
            :generate-background-image="compositionGenerateBackground"
            :image-guidance="compositionImageGuidance"
            :fade-mode="compositionFadeMode"
            :planning="compositionPlanning"
            :applying="compositionApplying"
            :error="compositionError"
            :proposal="compositionResult?.proposal || null"
            @update:instruction="compositionInstruction = $event"
            @update:generate-background-image="compositionGenerateBackground = $event"
            @update:image-guidance="compositionImageGuidance = $event"
            @update:fade-mode="compositionFadeMode = $event"
            @request-plan="requestSectionComposition"
            @apply="applySectionComposition"
            @dismiss="compositionResult = null"
          />
        </template>
      </SectionPanel>

      <PreviewPanel
        ref="previewPanelRef"
        :renderer-snapshot="rendererSnapshot"
        :section-design-runs="sectionDesignRuns"
        :guides-visible="guidesVisible"
        :viewport="viewport"
        :template-identity-label="templateIdentityLabel"
        :capabilities="capabilities"
        :auto-register-pending="autoRegisterPending"
        :auto-register-message="autoRegisterMessage"
        :editor-history="editorHistory"
        :design-spec="designSpec"
        :design-token-sets="designTokenSets"
        :selected-design-token-version-id="previewDesignTokenVersionId"
        :layout-change-note="layoutChangeNote"
        :layout-saving="layoutSaving"
        :editor-snapshot="editorSnapshot"
        :template="template"
        :selected-style-key="selectedStyleKey"
        :selected-item-keys="selectedItemKeys"
        :selected-section="selectedSection"
        @update:guides-visible="guidesVisible = $event"
        @update:viewport="viewport = $event"
        @update:layout-change-note="layoutChangeNote = $event"
        @request-auto-register="requestAutoRegister"
        @undo="undoEditorCommand"
        @redo="redoEditorCommand"
        @update-design-token="updateDesignToken"
        @save-admin-layout="(activate) => saveAdminLayout({ activate })"
        @open-output="openOutput"
        @select-item="selectRendererItem"
        @update-item-style="updateItemStyle"
        @update-renderer-item-style="updateRendererItemStyle"
        @update-item-content="updateRendererContent"
        @update-section-style="updateSectionStyle"
      />

      <PropertyPanel :selected-section="selectedSection">
        <template #ai-controls>
          <AiLayoutControls
            v-if="capabilities.canRunMultiLayoutAi"
            :selected-count="selectedItemKeys.length"
            :revision="multiLayoutRevision"
            :planning="multiLayoutPlanning"
            :error="multiLayoutError"
            :suggestion="multiLayoutSuggestion"
            :undo-count="multiLayoutUndoStack.length"
            :operation-label="layoutOperationLabel"
            @clear-selection="clearMultiSelection"
            @request-suggestion="requestMultiLayoutSuggestion"
            @undo="undoMultiLayout"
            @apply-suggestion="applyMultiLayoutSuggestion"
            @dismiss-suggestion="multiLayoutSuggestion = null"
          />
        </template>

          <div class="component-property-list">
            <section
              v-for="item in selectedSection.items || []"
              :key="item.itemKey"
              class="component-property-accordion"
              :class="{ open: expandedComponentKey === componentKey(selectedSection, item) }"
            >
              <div class="component-property-header">
                <label v-if="capabilities.canRunMultiLayoutAi" class="component-multi-select" :title="item.isLocked ? '잠긴 컴포넌트는 다중 정렬할 수 없습니다.' : '다중 정렬 대상 선택'">
                  <input
                    type="checkbox"
                    :checked="multiItemSelected(item)"
                    :disabled="item.isLocked"
                    :aria-label="`${item.name} 다중 정렬 대상 선택`"
                    @change="toggleMultiItem(selectedSection, item)"
                  />
                </label>
                <button
                  type="button"
                  class="component-property-trigger"
                  :aria-expanded="expandedComponentKey === componentKey(selectedSection, item)"
                  @click="toggleComponent(selectedSection, item)"
                >
                  <span>{{ item.name }}</span>
                  <small>{{ item.fieldKind }}</small>
                  <i aria-hidden="true"></i>
                </button>
                <label
                  v-if="!item.isRequired && !item.isLocked"
                  class="component-visibility-toggle"
                  :title="itemVisible(selectedSection, item) ? '웹 출력에 노출 중' : '웹 출력에서 숨김'"
                  @click.stop
                >
                  <input
                    type="checkbox"
                    :checked="itemVisible(selectedSection, item)"
                    :aria-label="`${item.name} 노출`"
                    @change="setItemVisible(selectedSection, item, $event.target.checked)"
                  />
                  <i aria-hidden="true"></i>
                  <span>노출</span>
                </label>
              </div>
              <div class="component-property-body">
                <div>
                  <div
                    v-if="selectedItem && selectedItem.itemKey === item.itemKey"
                    class="component-property-content"
                  >
          <div v-if="componentFields(selectedItem).length > 1" class="component-field-property-list">
            <section v-for="field in componentFields(selectedItem)" :key="field.fieldKey" class="component-field-property">
              <header>
                <strong>{{ field.name }}</strong>
                <small>{{ field.fieldKind }} · {{ field.fieldKey }}</small>
                <label
                  v-if="!field.isRequired && !field.isLocked"
                  class="component-visibility-toggle"
                  :title="fieldVisible(selectedSection, selectedItem, field) ? '웹 출력에 노출 중' : '웹 출력에서 숨김'"
                >
                  <input
                    type="checkbox"
                    :checked="fieldVisible(selectedSection, selectedItem, field)"
                    :aria-label="`${field.name} 노출`"
                    @change="setFieldVisible(selectedSection, selectedItem, field, $event.target.checked)"
                  />
                  <i aria-hidden="true"></i>
                  <span>노출</span>
                </label>
              </header>
              <template v-if="field.fieldKind === 'cta'">
                <label><span>버튼 텍스트</span><input :disabled="selectedItem.isLocked || field.isLocked" :value="fieldValue(selectedItem, field)?.label" @input="updateFieldObject(selectedItem, field, 'label', $event.target.value)" /></label>
                <label><span>버튼 URL</span><input :disabled="selectedItem.isLocked || field.isLocked" type="url" :value="fieldValue(selectedItem, field)?.link" @input="updateFieldObject(selectedItem, field, 'link', $event.target.value)" /></label>
              </template>
              <template v-else-if="field.fieldKind === 'image'">
                <button
                  v-if="capabilities.canRunComponentImageAi && sectionAiItemAllowed(selectedSection, selectedItem, field)"
                  type="button"
                  class="section-ai-action item-ai-generation-action"
                  :disabled="sectionAiItemAction(selectedSection, selectedItem, field).disabled"
                  @click="requestSectionAiAction(selectedSection, 'generate', selectedItem.itemKey, 'item', field.fieldKey)"
                >{{ sectionAiItemAction(selectedSection, selectedItem, field).label }}</button>
                <label><span>이미지 입력 방식</span><select :disabled="selectedItem.isLocked || field.isLocked" :value="fieldValue(selectedItem, field)?.source" @change="updateFieldObject(selectedItem, field, 'source', $event.target.value)"><option v-for="source in field.image?.allowedSources || ['url']" :key="source" :value="source">{{ source }}</option></select></label>
                <label><span>URL 또는 이미지 설명</span><textarea :disabled="selectedItem.isLocked || field.isLocked" rows="4" :value="fieldValue(selectedItem, field)?.value" @input="updateFieldObject(selectedItem, field, 'value', $event.target.value)"></textarea></label>
                <label v-if="field.image?.altTextRequired"><span>대체 텍스트</span><input :disabled="selectedItem.isLocked || field.isLocked" :value="fieldValue(selectedItem, field)?.alt" @input="updateFieldObject(selectedItem, field, 'alt', $event.target.value)" /></label>
                <button
                  v-if="!selectedItem.isLocked && !field.isLocked && fieldValue(selectedItem, field)?.value"
                  type="button"
                  class="image-remove-action"
                  @click="requestImageRemoval(field)"
                >이미지 삭제</button>
              </template>
              <label v-else>
                <span>{{ field.textType === 'multi' ? '설명 텍스트' : '텍스트' }}</span>
                <textarea :disabled="selectedItem.isLocked || field.isLocked" :rows="field.textType === 'multi' ? 8 : 3" :value="fieldValue(selectedItem, field)" @input="updateFieldValue(selectedItem, field, $event.target.value)" placeholder="Enter 키로 줄바꿈할 수 있습니다."></textarea>
              </label>
            </section>
          </div>

          <label v-if="componentFields(selectedItem).length <= 1 && selectedItem.fieldKind === 'cta'">
            <span>버튼 텍스트</span>
            <input :disabled="selectedItem.isLocked" :value="selectedValue?.label" @input="updateObjectField('label', $event.target.value)" />
          </label>
          <label v-if="componentFields(selectedItem).length <= 1 && selectedItem.fieldKind === 'cta'">
            <span>버튼 URL</span>
            <input :disabled="selectedItem.isLocked" type="url" :value="selectedValue?.link" @input="updateObjectField('link', $event.target.value)" />
          </label>

          <template v-else-if="componentFields(selectedItem).length <= 1 && selectedItem.fieldKind === 'image'">
            <button
              v-if="capabilities.canRunComponentImageAi && sectionAiItemAllowed(selectedSection, selectedItem)"
              type="button"
              class="section-ai-action item-ai-generation-action"
              :disabled="sectionAiItemAction(selectedSection, selectedItem).disabled"
              :title="sectionAiItemAction(selectedSection, selectedItem).disabled && !sectionAiIsProcessing(selectedSection) ? '섹션 콘텐츠를 먼저 등록해 주세요.' : ''"
              @click="requestSectionAiAction(selectedSection, sectionAiItemAction(selectedSection, selectedItem).action, selectedItem.itemKey)"
            >{{ sectionAiItemAction(selectedSection, selectedItem).label }}</button>
            <label>
              <span>이미지 입력 방식</span>
              <select :disabled="selectedItem.isLocked" :value="selectedValue?.source" @change="updateObjectField('source', $event.target.value)">
                <option v-for="source in selectedItem.image?.allowedSources || ['url']" :key="source" :value="source">{{ source }}</option>
              </select>
            </label>
            <label>
              <span>URL 또는 이미지 설명</span>
              <textarea :disabled="selectedItem.isLocked" rows="4" :value="selectedValue?.value" @input="updateObjectField('value', $event.target.value)"></textarea>
            </label>
            <label v-if="selectedItem.image?.descriptionEnabled">
              <span>설명</span>
              <textarea :disabled="selectedItem.isLocked" rows="3" :value="selectedValue?.description" @input="updateObjectField('description', $event.target.value)"></textarea>
            </label>
            <label v-if="selectedItem.image?.altTextRequired">
              <span>대체 텍스트</span>
              <input :disabled="selectedItem.isLocked" :value="selectedValue?.alt" @input="updateObjectField('alt', $event.target.value)" />
            </label>
            <button
              v-if="!selectedItem.isLocked && selectedValue?.value"
              type="button"
              class="image-remove-action"
              @click="requestImageRemoval"
            >이미지 삭제</button>
          </template>

          <label v-else-if="componentFields(selectedItem).length <= 1">
            <span>{{ selectedItem.textType === 'multi' ? '설명 텍스트' : '텍스트' }}</span>
            <textarea
              v-model="selectedValue"
              :disabled="selectedItem.isLocked"
              :rows="selectedItem.textType === 'multi' ? 8 : 3"
              placeholder="Enter 키로 줄바꿈할 수 있습니다."
            ></textarea>
          </label>

          <dl class="item-meta">
            <div><dt>Item key</dt><dd>{{ selectedItem.itemKey }}</dd></div>
            <div><dt>필수</dt><dd>{{ selectedItem.isRequired ? "Y" : "N" }}</dd></div>
            <div><dt>고정</dt><dd>{{ selectedItem.isLocked ? "Y" : "N" }}</dd></div>
          </dl>

          <section class="design-controls">
            <div class="design-controls__heading">
              <strong>DESIGN</strong>
              <button type="button" :disabled="selectedItem.isLocked" @click="resetItemStyle">초기화</button>
            </div>
            <div v-if="selectedItem.fieldKind === 'image'" class="image-frame-controls">
              <div class="image-resize-mode">
                <span>크기 조절 방식</span>
                <div role="group" aria-label="이미지 크기 조절 방식">
                  <button
                    type="button"
                    :class="{ active: selectedItemStyle.aspectRatioLocked !== false }"
                    :disabled="selectedItem.isLocked"
                    @click="setImageResizeMode('locked')"
                  >비율 유지</button>
                  <button
                    type="button"
                    :class="{ active: selectedItemStyle.aspectRatioLocked === false }"
                    :disabled="selectedItem.isLocked || selectedItemStyle.shape === 'circle'"
                    @click="setImageResizeMode('free')"
                  >자유 조절</button>
                </div>
                <small v-if="selectedItemStyle.shape === 'circle'">원형 이미지는 1:1 비율로 고정됩니다.</small>
              </div>
              <label>
                <span>이미지 너비</span>
                <div class="range-field">
                  <input
                    type="range"
                    :min="MINIMUM_COMPONENT_WIDTH_PCT"
                    max="100"
                    step="0.01"
                    :disabled="selectedItem.isLocked"
                    :value="selectedItemStyle.widthPct || 32"
                    @input="updateItemStyle({ widthPct: Number($event.target.value) })"
                  />
                  <input
                    class="dimension-input"
                    type="number"
                    :min="MINIMUM_COMPONENT_WIDTH_PCT"
                    max="100"
                    step="0.01"
                    :disabled="selectedItem.isLocked"
                    :value="Number((selectedItemStyle.widthPct || 32).toFixed(2))"
                    aria-label="이미지 너비 퍼센트"
                    @change="updateItemStyle({ widthPct: Math.min(100, Math.max(MINIMUM_COMPONENT_WIDTH_PCT, Number($event.target.value) || 32)) })"
                  />
                </div>
              </label>
              <label v-if="selectedItemStyle.shape !== 'circle' && selectedItemStyle.aspectRatioLocked === false">
                <span>이미지 높이</span>
                <div class="range-field">
                  <input
                    type="range"
                    :min="MINIMUM_COMPONENT_HEIGHT_PX"
                    max="900"
                    step="1"
                    :disabled="selectedItem.isLocked"
                    :value="selectedItemStyle.heightPx || 240"
                    @input="updateItemStyle({ heightPx: Number($event.target.value) })"
                  />
                  <input
                    class="dimension-input"
                    type="number"
                    :min="MINIMUM_COMPONENT_HEIGHT_PX"
                    max="900"
                    step="1"
                    :disabled="selectedItem.isLocked"
                    :value="Math.round(selectedItemStyle.heightPx || 240)"
                    aria-label="이미지 높이 픽셀"
                    @change="updateItemStyle({ heightPx: Math.min(900, Math.max(MINIMUM_COMPONENT_HEIGHT_PX, Number($event.target.value) || 240)) })"
                  />
                </div>
              </label>
              <label>
                <span>이미지 맞춤</span>
                <select
                  :disabled="selectedItem.isLocked"
                  :value="selectedItemStyle.imageFit || 'contain'"
                  @change="updateItemStyle({ imageFit: $event.target.value })"
                >
                  <option value="contain">전체 표시</option>
                  <option value="cover">영역 채우기</option>
                </select>
              </label>
              <label>
                <span>이미지 초점</span>
                <select
                  :disabled="selectedItem.isLocked"
                  :value="selectedItemStyle.imagePosition || 'center center'"
                  @change="updateItemStyle({ imagePosition: $event.target.value })"
                >
                  <option value="left top">왼쪽 위</option>
                  <option value="center top">중앙 위</option>
                  <option value="right top">오른쪽 위</option>
                  <option value="left center">왼쪽 중앙</option>
                  <option value="center center">중앙</option>
                  <option value="right center">오른쪽 중앙</option>
                  <option value="left bottom">왼쪽 아래</option>
                  <option value="center bottom">중앙 아래</option>
                  <option value="right bottom">오른쪽 아래</option>
                </select>
              </label>
              <label>
                <span>이미지 형태</span>
                <select
                  :disabled="selectedItem.isLocked"
                  :value="selectedItemStyle.shape || 'square'"
                  @change="setImageShape($event.target.value)"
                >
                  <option value="square">사각형</option>
                  <option value="rounded">둥근 사각형</option>
                  <option value="circle">원형</option>
                </select>
              </label>
              <label class="toggle-field">
                <input
                  type="checkbox"
                  :disabled="selectedItem.isLocked"
                  :checked="selectedItemStyle.decorative === true"
                  @change="updateItemStyle({ decorative: $event.target.checked })"
                />
                <span>장식 이미지</span>
              </label>
              <label v-if="selectedItemStyle.decorative !== true">
                <span>이미지 설명</span>
                <input
                  type="text"
                  maxlength="240"
                  :disabled="selectedItem.isLocked"
                  :value="selectedItemStyle.accessibleLabel || selectedValue?.alt || selectedItem.name"
                  @input="updateItemStyle({ accessibleLabel: $event.target.value })"
                />
              </label>
            </div>
            <div v-else class="component-frame-controls">
              <strong>컴포넌트 영역 크기</strong>
              <small>프리뷰의 모서리와 변을 드래그하면 영역과 글자 크기가 함께 변경됩니다.</small>
              <label>
                <span>컴포넌트 너비</span>
                <div class="range-field">
                  <input
                    type="range"
                    min="0.01"
                    max="100"
                    step="0.1"
                    :disabled="selectedItem.isLocked"
                    :value="selectedItemStyle.widthPct || 32"
                    @input="updateItemStyle({ widthPct: Number($event.target.value) })"
                  />
                  <input
                    class="dimension-input"
                    type="number"
                    min="0.01"
                    max="100"
                    step="0.1"
                    :disabled="selectedItem.isLocked"
                    :value="Math.round(selectedItemStyle.widthPct || 32)"
                    aria-label="컴포넌트 너비 퍼센트"
                    @change="updateItemStyle({ widthPct: Math.min(100, Math.max(0.01, Number($event.target.value) || 32)) })"
                  />
                </div>
              </label>
              <label>
                <span>컴포넌트 높이</span>
                <div class="range-field">
                  <input
                    type="range"
                    min="1"
                    max="900"
                    step="1"
                    :disabled="selectedItem.isLocked"
                    :value="selectedItemStyle.heightPx || 120"
                    @input="updateItemStyle({ heightPx: Number($event.target.value) })"
                  />
                  <input
                    class="dimension-input"
                    type="number"
                    min="1"
                    max="900"
                    step="1"
                    :disabled="selectedItem.isLocked"
                    :value="Math.round(selectedItemStyle.heightPx || 120)"
                    aria-label="컴포넌트 높이 픽셀"
                    @change="updateItemStyle({ heightPx: Math.min(900, Math.max(1, Number($event.target.value) || 120)) })"
                  />
                </div>
              </label>
            </div>
            <template v-if="selectedItem.fieldKind !== 'image'">
              <label>
                <span>글자 색상</span>
                <select
                  :disabled="selectedItem.isLocked"
                  :value="selectedItemStyle.colorToken || ''"
                  @change="applyColorToken($event.target.value)"
                >
                  <option value="">디자인 토큰 기본값</option>
                  <option v-for="token in colorTokenOptions" :key="token.key" :value="token.key">
                    {{ token.label }} · {{ token.value }}
                  </option>
                </select>
                <div v-if="selectedColorTokenOption" class="token-value-preview token-value-preview--color">
                  <i :style="{ backgroundColor: selectedColorTokenOption.value }" aria-hidden="true"></i>
                  <span>{{ selectedColorTokenOption.label }}</span>
                  <code>{{ selectedColorTokenOption.value }}</code>
                </div>
                <details v-if="colorTokenOptions.length" class="token-option-menu">
                  <summary>실제 색상 보기</summary>
                  <div class="token-option-list token-option-list--color">
                    <div
                      v-for="token in colorTokenOptions"
                      :key="token.key"
                      :class="{ active: token.key === selectedItemStyle.colorToken }"
                    >
                      <i :style="{ backgroundColor: token.value }" aria-hidden="true"></i>
                      <span>{{ token.label }}</span>
                      <code>{{ token.value }}</code>
                    </div>
                  </div>
                </details>
              </label>
              <label>
                <span>폰트 크기</span>
                <select
                  :disabled="selectedItem.isLocked"
                  :value="selectedItemStyle.fontSizeToken || ''"
                  @change="applyFontSizeToken($event.target.value)"
                >
                  <option value="">디자인 토큰 기본값</option>
                  <option v-for="token in fontSizeTokenOptions" :key="token.key" :value="token.key">
                    {{ token.label }} · {{ token.value }}
                  </option>
                </select>
                <div v-if="selectedFontSizeTokenOption" class="token-value-preview token-value-preview--font">
                  <span :style="{ fontSize: selectedFontSizeTokenOption.value }">가나다 Aa</span>
                  <code>{{ selectedFontSizeTokenOption.label }} · {{ selectedFontSizeTokenOption.value }}</code>
                </div>
                <details v-if="fontSizeTokenOptions.length" class="token-option-menu">
                  <summary>실제 크기 보기</summary>
                  <div class="token-option-list token-option-list--font">
                    <div
                      v-for="token in fontSizeTokenOptions"
                      :key="token.key"
                      :class="{ active: token.key === selectedItemStyle.fontSizeToken }"
                    >
                      <span :style="{ fontSize: token.value }">가나다 Aa</span>
                      <code>{{ token.label }} · {{ token.value }}</code>
                    </div>
                  </div>
                </details>
              </label>
              <label>
                <span>폰트 굵기</span>
                <select
                  :disabled="selectedItem.isLocked"
                  :value="selectedItemStyle.fontWeight || 400"
                  @change="updateItemStyle({ fontWeight: Number($event.target.value) })"
                >
                  <option :value="400">Regular</option>
                  <option :value="500">Medium</option>
                  <option :value="700">Bold</option>
                  <option :value="800">Extra Bold</option>
                </select>
              </label>
            </template>
            <div class="position-status">
              <span>위치</span>
              <strong v-if="selectedItemStyle.positionMode === 'free'">
                X {{ Math.round(selectedItemStyle.xPct || 0) }}% · Y {{ Math.round(selectedItemStyle.yPx || 0) }}px
              </strong>
              <strong v-else>자동 배치</strong>
            </div>
            <button
              v-if="selectedItemStyle.positionMode === 'free'"
              class="secondary-control"
              type="button"
              :disabled="selectedItem.isLocked"
              @click="restoreAutomaticPosition"
            >
              자동 배치로 복원
            </button>
          </section>
                  </div>
                </div>
              </div>
            </section>
            <span v-if="!selectedSection.items?.length" class="component-property-empty">등록된 컴포넌트 없음</span>
          </div>
      </PropertyPanel>
    </section>
      </div>
    </div>
    <button v-if="!usesEmbeddedEngineShell" class="shell-overlay" type="button" data-shell-overlay aria-label="메뉴 닫기"></button>
  </main>
</template>
