<script setup>
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from "vue";
import PromoPageRenderer from "./PromoPageRenderer.vue";
import { withoutFreePosition } from "./editor-utils.mjs";
import { createEditorContext } from "./editor-context.mjs";
import { normalizeLayoutSpec, validateLayoutSpec } from "./layout-utils.mjs";
import { geometryToItemStylePatches, resolveSafeMultiLayoutOperation } from "./multi-layout.mjs";
import { rebaseDocumentSnapshot } from "./revision-rebase.mjs";
import { createAdminTemplateAdapter } from "./platform/adapters/admin-template-adapter.mjs";
import { createAiDocumentAdapter } from "./platform/adapters/ai-document-adapter.mjs";
import { createEditorLibraryAdapter } from "./platform/adapters/editor-library-adapter.mjs";
import { sectionPresetAdapter } from "./platform/adapters/section-preset-adapter.mjs";
import {
  PromoBuilderMessageType,
  createPromoBuilderAdapter,
} from "./platform/adapters/promo-builder-adapter.mjs";
import { createOutputAdapter } from "./platform/adapters/output-adapter.mjs";
import { createEditorStore } from "./platform/editor-core/create-editor-store.mjs";
import { EditorCommandType, editorCommand } from "./platform/editor-core/editor-commands.mjs";
import {
  activeComponentDefinitions,
  activeSectionPresets,
  createBlankSectionInstance,
  createComponentInstanceFromDefinition,
  createSectionInstanceFromPreset,
} from "./platform/editor-core/composition-structure.mjs";
import {
  MAXIMUM_COMPONENT_HEIGHT_PX,
  MINIMUM_COMPONENT_HEIGHT_PX,
  MINIMUM_COMPONENT_WIDTH_PCT,
  defaultComponentHeight,
  usesAutomaticComponentHeight,
} from "./platform/layout-engine/geometry.mjs";
import { resolveSectionPresetLayoutPatch } from "./platform/layout-engine/section-preset-resolver.mjs";
import { sectionPresetSnapshotFromDesignSpec } from "./platform/layout-engine/section-preset-snapshot.mjs";
import PreviewPanel from "./platform/editor-ui/PreviewPanel.vue";
import StructurePanel from "./platform/editor-ui/StructurePanel.vue";
import AiLayoutControls from "./platform/editor-ui/AiLayoutControls.vue";
import SectionCompositionControls from "./platform/editor-ui/SectionCompositionControls.vue";
import AiSectionCompositionPanel from "./platform/editor-ui/AiSectionCompositionPanel.vue";
import ComponentInspectorPopover from "./platform/editor-ui/ComponentInspectorPopover.vue";
import ComponentTransitionControls from "./platform/editor-ui/ComponentTransitionControls.vue";
import { createItemMotionBinding, createSectionMotionBinding, normalizeMotionSpec } from "./platform/editor-core/motion-spec.mjs";
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
const expandedSectionKey = ref("");
const selectedItemKey = ref("");
const selectedItemKeys = ref([]);
const previewPanelRef = ref(null);
const componentInspectorAnchor = ref(null);
const viewport = ref("desktop");
const previewGuideMode = ref("selection");
const outputSaveError = ref("");
const outputSnapshot = ref(null);
const layoutRevision = ref(1);
const layoutId = ref(null);
const layoutIdentity = ref(null);
const layoutChangeNote = ref("");
const layoutSaving = ref(false);
const layoutSaveMessage = ref("");
const sectionPresetLayout = ref(null);
const aiDocumentSnapshot = ref(null);
const aiDocumentId = ref("");
const aiDocumentRevision = ref(0);
const aiDocumentSaving = ref(false);
const aiDocumentSaveMessage = ref("");
const aiDocumentConflict = ref(null);
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
const compositionFadeMode = ref("none");
const compositionKeyVisualTextMode = ref("none");
const compositionKeyVisualText = ref("");
const compositionPlanning = ref(false);
const compositionApplying = ref(false);
const compositionError = ref("");
const compositionResult = ref(null);
const structurePurpose = ref("");
const structurePlanning = ref(false);
const structureApplying = ref(false);
const structureError = ref("");
const structureResult = ref(null);
const motionReplayKey = ref(0);
const componentLibrary = ref([]);
const sectionPresets = ref([]);
const editorLibraryLoading = ref(false);
const structureMessage = ref("");
const editorHistory = ref({ undoCount: 0, redoCount: 0, canUndo: false, canRedo: false });
const editorCore = createEditorStore({
  layout: JSON.parse(JSON.stringify(DEFAULT_DESIGN_SPEC)),
  content: {},
});
const adminTemplateAdapter = createAdminTemplateAdapter();
const aiDocumentAdapter = createAiDocumentAdapter();
const editorLibraryAdapter = createEditorLibraryAdapter();
const promoBuilderAdapter = createPromoBuilderAdapter();
const outputAdapter = createOutputAdapter({ storageKey: SNAPSHOT_STORAGE_KEY });
let applyingExternalSnapshot = false;
let lastExternalSnapshotRevision = 0;
let disconnectPromoBuilder = null;
let compositionRequestSequence = 0;
let aiDocumentPollingCancelled = false;

watch(selectedSectionKey, (nextKey, previousKey) => {
  if (!nextKey) {
    expandedSectionKey.value = "";
    return;
  }
  if (nextKey !== previousKey) expandedSectionKey.value = nextKey;
});

const wizardSource = new URLSearchParams(window.location.search).get("source") || "";
const editorContext = computed(() => createEditorContext(props.mode, wizardSource));
const capabilities = computed(() => editorContext.value.capabilities);
const isAdminLayoutMode = computed(() => editorContext.value.isAdminLayout);
const isSectionPresetMode = computed(() => editorContext.value.isSectionPreset);
const isAiDocumentMode = computed(() => editorContext.value.isAiDocument);
const isWizardLayoutMode = computed(() => editorContext.value.isWizardLayout);
const isCreatePromoWizardMode = computed(() => editorContext.value.isCreatePromo);
const isBuilderWorkspaceMode = computed(() => editorContext.value.isBuilderWorkspace);
const usesEmbeddedEngineShell = computed(() => editorContext.value.capabilities.isEmbedded);
const shellNavItems = window.PromoShell?.navItems || [];

const selectedSection = computed(() => sections.value.find((section) => section.sectionKey === selectedSectionKey.value) || sections.value[0]);
const selectedItem = computed(() => (
  selectedSection.value?.items?.find((item) => item.itemKey === selectedItemKey.value) || null
));
const motionSpec = computed(() => normalizeMotionSpec(
  designSpec.value.motionSpec || aiDocumentSnapshot.value?.motionSpec || {},
));
const selectedSectionMotion = computed(() => motionSpec.value.sections[selectedSection.value?.sectionKey] || {});
const selectedItemMotion = computed(() => motionSpec.value.items[
  selectedSection.value && selectedItem.value ? `${selectedSection.value.sectionKey}.${selectedItem.value.itemKey}` : ""
] || { inherit: true });
const selectedValue = computed({
  get: () => sectionInputs.value?.[selectedSection.value?.sectionKey]?.[selectedItem.value?.itemKey],
  set: (value) => updateSelectedValue(value),
});
const editorSnapshot = computed(() => {
  if (!template.value) return null;
  if (isAiDocumentMode.value && aiDocumentSnapshot.value) {
    return {
      ...aiDocumentSnapshot.value,
      documentRevision: aiDocumentRevision.value,
      content: {
        ...aiDocumentSnapshot.value.content,
        formTemplate: { ...aiDocumentSnapshot.value.content.formTemplate, ...template.value },
        sectionSnapshot: JSON.parse(JSON.stringify(sections.value)),
        sectionInputs: JSON.parse(JSON.stringify(sectionInputs.value)),
        sectionOrder: sections.value.map((section) => section.sectionKey),
      },
      designSpec: JSON.parse(JSON.stringify(designSpec.value)),
      assets: JSON.parse(JSON.stringify(
        aiDocumentSnapshot.value.assets || { contractVersion: 1, items: {}, requests: [] },
      )),
      motionSpec: JSON.parse(JSON.stringify(motionSpec.value)),
    };
  }
  return createSnapshot({
    template: template.value,
    configRevision: configRevision.value,
    sections: sections.value,
    sectionInputs: sectionInputs.value,
    designSpec: designSpec.value,
    motionSpec: motionSpec.value,
  });
});
const rendererSnapshot = computed(() => props.mode === "output" ? outputSnapshot.value : editorSnapshot.value);
const templateIdentityLabel = computed(() => {
  if (!template.value) return "템플릿 없음";
  if (isSectionPresetMode.value) {
    return `${template.value.name} · ${sectionPresetLayout.value?.layoutKey || "layout"} · ${viewport.value}`;
  }
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
  semanticRole: token.semanticRole || "",
  cssProperties: token.cssProperties || [],
})));
const fontColorTokenOptions = computed(() => colorTokenOptions.value.filter((token) => (
  token.cssProperties.includes("color")
)));
const backgroundColorTokenOptions = computed(() => colorTokenOptions.value.filter((token) => (
  token.cssProperties.includes("background-color")
)));
const gradientTokenOptions = computed(() => {
  const grouped = new Map();
  selectedDesignTokenValues.value.filter((token) => (
    token.valueType === "gradient"
    || (token.cssProperties || []).includes("background-image")
  )).forEach((token) => {
    const current = grouped.get(token.tokenKey);
    if (current) {
      current.values.push(token.value);
      current.value = current.values.filter(Boolean).join(", ");
      return;
    }
    grouped.set(token.tokenKey, {
      key: token.tokenKey,
      label: token.label || token.tokenKey,
      value: token.value,
      values: [token.value],
    });
  });
  return [...grouped.values()];
});
const fontSizeTokenOptions = computed(() => selectedDesignTokenValues.value.filter((token) => (
  token.valueType === "length"
  && (token.cssProperties || []).includes("font-size")
)).map((token) => ({
  key: token.tokenKey,
  label: token.label || token.tokenKey,
  value: token.value,
  px: Number.parseFloat(token.value),
  semanticRole: token.semanticRole || "",
  category: token.category || "",
})).filter((token) => Number.isFinite(token.px)));
function tokenOptionsForCssProperty(property) {
  return selectedDesignTokenValues.value.filter((token) => (
    (token.cssProperties || []).includes(property)
  )).map((token) => ({
    key: token.tokenKey,
    label: token.label || token.tokenKey,
    value: token.value,
    number: Number.parseFloat(token.value),
    semanticRole: token.semanticRole || "",
    category: token.category || "",
  }));
}
const fontFamilyTokenOptions = computed(() => tokenOptionsForCssProperty("font-family"));
const fontWeightTokenOptions = computed(() => tokenOptionsForCssProperty("font-weight"));
const lineHeightTokenOptions = computed(() => tokenOptionsForCssProperty("line-height"));
const letterSpacingTokenOptions = computed(() => tokenOptionsForCssProperty("letter-spacing"));
function typographyRoleStem(value) {
  return String(value || "")
    .toLowerCase()
    .replace(/-(?:font-)?(?:size|weight|line-height|letter-spacing)$/u, "")
    .replace(/-(?:size|weight|leading|tracking)$/u, "");
}
function relatedTypographyToken(options, sizeToken) {
  const stem = typographyRoleStem(sizeToken.semanticRole);
  if (stem) {
    const related = options.find((entry) => typographyRoleStem(entry.semanticRole) === stem);
    if (related) return related;
  }
  const titleLike = /title|heading|display|hero|lead/i.test(`${sizeToken.semanticRole} ${sizeToken.label}`);
  if (options === fontWeightTokenOptions.value) {
    const targetWeight = titleLike ? 700 : 400;
    return options
      .filter((entry) => Number.isFinite(Number(entry.number)))
      .sort((a, b) => Math.abs(Number(a.number) - targetWeight) - Math.abs(Number(b.number) - targetWeight))[0]
      || options[0];
  }
  return options.find((entry) => (
    titleLike ? /title|heading|display|hero|lead/i.test(`${entry.semanticRole} ${entry.label}`) : true
  )) || options[0];
}
const textStyleTokenOptions = computed(() => fontSizeTokenOptions.value.map((sizeToken) => {
  const family = fontFamilyTokenOptions.value[0];
  const weight = relatedTypographyToken(fontWeightTokenOptions.value, sizeToken);
  const lineHeight = relatedTypographyToken(lineHeightTokenOptions.value, sizeToken);
  const letterSpacing = relatedTypographyToken(letterSpacingTokenOptions.value, sizeToken);
  return {
    key: sizeToken.key,
    label: sizeToken.label,
    patch: {
      fontSizeToken: sizeToken.key,
      fontSize: undefined,
      ...(family ? { fontFamilyToken: family.key, fontFamily: undefined } : {}),
      ...(weight ? { fontWeightToken: weight.key, fontWeight: undefined } : {}),
      ...(lineHeight ? { lineHeightToken: lineHeight.key, lineHeight: undefined } : {}),
      ...(letterSpacing ? { letterSpacingToken: letterSpacing.key, letterSpacing: undefined } : {}),
    },
  };
}));
const availableComponents = computed(() => activeComponentDefinitions(componentLibrary.value));
const availableSectionPresets = computed(() => activeSectionPresets(sectionPresets.value));

function editorDocumentFromRefs() {
  return {
    layout: designSpec.value,
    content: sectionInputs.value,
    sections: sections.value,
    metadata: {
      surface: editorContext.value.surface,
      layoutRevision: layoutRevision.value,
    },
  };
}

function updateEditorHistory() {
  editorHistory.value = editorCore.getHistoryState();
}

function hydrateEditorCore({ resetHistory = true, dirty = false } = {}) {
  editorCore.replaceDocument(editorDocumentFromRefs(), { resetHistory, dirty });
  updateEditorHistory();
}

function applyEditorCoreResult(result) {
  if (!result?.ok) return false;
  designSpec.value = result.state.document.layout;
  sectionInputs.value = result.state.document.content;
  sections.value = result.state.document.sections;
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
  const selectionChanged = selectedSectionKey.value !== section.sectionKey
    || selectedItemKey.value !== (item?.itemKey || "");
  if (selectionChanged) previewPanelRef.value?.finishTextEdit();
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
  const key = componentKey(section, item);
  const responsive = viewport.value === "mobile"
    ? designSpec.value.responsiveLayouts?.mobile?.visibility?.items?.[key]
    : undefined;
  return (responsive ?? designSpec.value.visibility?.items?.[key]) !== false;
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
  if (viewport.value === "mobile") {
    const targetKey = componentKey(section, item);
    const mobile = designSpec.value.responsiveLayouts?.mobile || {};
    executeEditorCommand(EditorCommandType.LAYOUT_REPLACE, {
      layout: {
        ...designSpec.value,
        responsiveLayouts: {
          ...(designSpec.value.responsiveLayouts || {}),
          mobile: {
            ...mobile,
            visibility: {
              ...(mobile.visibility || {}),
              items: { ...(mobile.visibility?.items || {}), [targetKey]: visible !== false },
            },
          },
        },
      },
    }, { label: "모바일 컴포넌트 노출 변경" });
    if (!visible) selectedItemKeys.value = selectedItemKeys.value.filter((key) => key !== item.itemKey);
    return;
  }
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

function resetSectionComposition() {
  compositionRequestSequence += 1;
  compositionInstruction.value = "";
  compositionFadeMode.value = "none";
  compositionPlanning.value = false;
  compositionApplying.value = false;
  compositionError.value = "";
  compositionResult.value = null;
  structurePurpose.value = "";
  structurePlanning.value = false;
  structureApplying.value = false;
  structureError.value = "";
  structureResult.value = null;
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
  expandedSectionKey.value = section.sectionKey;
  selectedItemKey.value = "";
  selectedItemKeys.value = [];
  multiLayoutSuggestion.value = null;
  multiLayoutError.value = "";
  await nextTick();
  scrollPreviewToSection(section);
}

async function toggleSectionExpansion(section) {
  if (!section) return;
  if (expandedSectionKey.value === section.sectionKey) {
    expandedSectionKey.value = "";
    return;
  }
  if (selectedSectionKey.value !== section.sectionKey) await selectSection(section);
  expandedSectionKey.value = section.sectionKey;
}

function sectionIndexFromDrop(sourceKey, targetKey, position = "before") {
  const sourceIndex = sections.value.findIndex((section) => section.sectionKey === sourceKey);
  const targetIndex = sections.value.findIndex((section) => section.sectionKey === targetKey);
  if (sourceIndex < 0 || targetIndex < 0) return -1;
  const nextKeys = sections.value.map((section) => section.sectionKey);
  nextKeys.splice(sourceIndex, 1);
  let insertionIndex = nextKeys.indexOf(targetKey);
  if (position === "after") insertionIndex += 1;
  nextKeys.splice(Math.max(0, insertionIndex), 0, sourceKey);
  return nextKeys;
}

async function moveSection(sourceKey, targetKey, position = "before") {
  if (!capabilities.value.canComposeStructure || sourceKey === targetKey) return;
  const sectionKeys = sectionIndexFromDrop(sourceKey, targetKey, position);
  if (!Array.isArray(sectionKeys)) return;
  if (!executeEditorCommand(EditorCommandType.SECTION_INSTANCE_REORDER, { sectionKeys }, {
    label: "섹션 순서 변경",
  })) return;
  await nextTick();
  scrollPreviewToSection(sections.value.find((section) => section.sectionKey === sourceKey));
}

function componentTargetIndex(section, sourceItemKey, targetItemKey, position = "before") {
  const keys = (section?.items || []).map((item) => item.itemKey)
    .filter((itemKey) => itemKey !== sourceItemKey);
  if (!targetItemKey) return keys.length;
  let index = keys.indexOf(targetItemKey);
  if (index < 0) return keys.length;
  if (position === "after") index += 1;
  return index;
}

async function moveComponent(sourceSectionKey, itemKey, targetSectionKey, targetItemKey, position = "before") {
  if (!capabilities.value.canComposeStructure) return;
  const sourceSection = sections.value.find((section) => section.sectionKey === sourceSectionKey);
  const targetSection = sections.value.find((section) => section.sectionKey === targetSectionKey);
  const item = sourceSection?.items?.find((candidate) => candidate.itemKey === itemKey);
  if (!sourceSection || !targetSection || !item) return;
  const targetIndex = componentTargetIndex(targetSection, itemKey, targetItemKey, position);
  const type = sourceSectionKey === targetSectionKey
    ? EditorCommandType.COMPONENT_INSTANCE_REORDER
    : EditorCommandType.COMPONENT_INSTANCE_MOVE_SECTION;
  const payload = sourceSectionKey === targetSectionKey
    ? {
        sectionKey: sourceSectionKey,
        itemKeys: (() => {
          const keys = (sourceSection.items || []).map((candidate) => candidate.itemKey)
            .filter((candidateKey) => candidateKey !== itemKey);
          keys.splice(targetIndex, 0, itemKey);
          return keys;
        })(),
      }
    : {
        sourceSectionKey,
        targetSectionKey,
        itemKey,
        targetIndex,
      };
  if (!executeEditorCommand(type, payload, { label: "컴포넌트 이동" })) return;
  const movedSection = sections.value.find((section) => section.sectionKey === targetSectionKey);
  const movedItem = movedSection?.items?.find((candidate) => candidate.itemKey === itemKey);
  if (movedSection) selectItem(movedSection, movedItem || null);
}

async function createBlankSection() {
  if (!capabilities.value.canCreateSections) return;
  const section = createBlankSectionInstance({ index: sections.value.length });
  if (!executeEditorCommand(EditorCommandType.SECTION_INSTANCE_CREATE, {
    section,
    content: createSectionInputs([section])[section.sectionKey],
  }, { label: "빈 섹션 추가" })) return;
  structureMessage.value = "빈 섹션을 추가했습니다.";
  await selectSection(section);
}

async function createSectionFromPreset(presetOrKey) {
  if (!capabilities.value.canCreateSections) return;
  const presetKey = typeof presetOrKey === "string"
    ? presetOrKey
    : presetOrKey?.sectionKey || presetOrKey?.id;
  const preset = availableSectionPresets.value.find((candidate) => (
    candidate.sectionKey === presetKey || candidate.id === presetKey
  ));
  if (!preset) return;
  const section = createSectionInstanceFromPreset(preset, {
    index: sections.value.length,
    preserveKeys: !sections.value.some((candidate) => candidate.sectionKey === preset.sectionKey),
  });
  let layoutPatch = null;
  let presetContent = {};
  let layoutWarning = "";
  try {
    const response = await fetch(`/api/wizard-content-section-layouts?sectionId=${encodeURIComponent(preset.sectionId || preset.id)}`, {
      cache: "no-store",
    });
    const result = await response.json().catch(() => ({}));
    if (!response.ok) throw new Error(result.message || result.error || "Layout Preset을 불러오지 못했습니다.");
    const selectedLayout = (result.layouts || []).find((entry) => entry.isDefault) || null;
    layoutPatch = resolveSectionPresetLayoutPatch(section, selectedLayout);
    presetContent = layoutPatch?.content || {};
    if (selectedLayout) {
      section.selectedLayoutKey = selectedLayout.layoutKey;
      section.layoutPresets = result.layouts || [];
    }
  } catch (layoutError) {
    layoutWarning = `${preset.name} Layout Preset을 불러오지 못해 기존 자동 배치를 사용합니다: ${layoutError.message}`;
  }
  if (!executeEditorCommand(EditorCommandType.SECTION_INSTANCE_CREATE, {
    section,
    content: createSectionInputs([section], {
      [section.sectionKey]: presetContent,
    })[section.sectionKey],
    layoutPatch,
  }, { label: "섹션 Preset 추가" })) return;
  structureMessage.value = layoutWarning || `${preset.name} 섹션을 추가했습니다.`;
  await selectSection(section);
}

async function addComponent(componentOrKey, sectionKey = selectedSection.value?.sectionKey) {
  if (!capabilities.value.canManageComponents || !sectionKey) return;
  const componentKey = typeof componentOrKey === "string"
    ? componentOrKey
    : componentOrKey?.componentKey;
  const component = availableComponents.value.find((candidate) => candidate.componentKey === componentKey);
  const section = sections.value.find((candidate) => candidate.sectionKey === sectionKey);
  if (!component || !section) return;
  const item = createComponentInstanceFromDefinition(component);
  const value = createSectionInputs([{ ...section, items: [item] }])?.[sectionKey]?.[item.itemKey];
  if (!executeEditorCommand(EditorCommandType.COMPONENT_INSTANCE_CREATE, {
    sectionKey,
    item,
    value,
  }, { label: "컴포넌트 추가" })) return;
  const nextSection = sections.value.find((candidate) => candidate.sectionKey === sectionKey);
  selectItem(nextSection, nextSection?.items?.find((candidate) => candidate.itemKey === item.itemKey));
  structureMessage.value = `${component.name} 컴포넌트를 추가했습니다.`;
}

function removeSection(sectionOrKey) {
  if (!capabilities.value.canComposeStructure) return;
  const sectionKey = typeof sectionOrKey === "string" ? sectionOrKey : sectionOrKey?.sectionKey;
  if (!sectionKey) return;
  if (!executeEditorCommand(EditorCommandType.SECTION_INSTANCE_REMOVE, { sectionKey }, {
    label: "섹션 삭제",
  })) return;
  selectedSectionKey.value = sections.value[0]?.sectionKey || "";
  selectedItemKey.value = "";
  selectedItemKeys.value = [];
}

function removeComponent(section, item) {
  if (!capabilities.value.canManageComponents || !section || !item) return;
  if (!executeEditorCommand(EditorCommandType.COMPONENT_INSTANCE_REMOVE, {
    sectionKey: section.sectionKey,
    itemKey: item.itemKey,
  }, { label: "컴포넌트 삭제" })) return;
  selectedItemKey.value = "";
  selectedItemKeys.value = [];
}

function commitMotionSpec(nextMotionSpec, label) {
  executeEditorCommand(EditorCommandType.DOCUMENT_PATCH, {
    sections: sections.value,
    content: sectionInputs.value,
    layout: { ...designSpec.value, motionSpec: normalizeMotionSpec(nextMotionSpec) },
  }, { label });
}

function updateSectionMotion(patch) {
  if (!selectedSection.value) return;
  const key = selectedSection.value.sectionKey;
  const binding = createSectionMotionBinding({ ...(motionSpec.value.sections[key] || {}), ...patch });
  commitMotionSpec({
    ...motionSpec.value,
    sections: { ...motionSpec.value.sections, [key]: binding },
  }, "섹션 트랜지션 변경");
  motionReplayKey.value += 1;
}

function updateItemMotion(patch) {
  if (!selectedSection.value || !selectedItem.value || selectedItem.value.isLocked) return;
  const key = `${selectedSection.value.sectionKey}.${selectedItem.value.itemKey}`;
  const previous = motionSpec.value.items[key] || { inherit: true };
  const binding = patch.inherit === true
    ? { inherit: true }
    : createItemMotionBinding({ ...previous, ...patch });
  commitMotionSpec({
    ...motionSpec.value,
    items: { ...motionSpec.value.items, [key]: binding },
  }, "컴포넌트 트랜지션 변경");
  motionReplayKey.value += 1;
}

function replayMotion() {
  motionReplayKey.value += 1;
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
  multiLayoutSuggestion.value = null;
  multiLayoutError.value = "";
}

function clearMultiSelection() {
  selectedItemKeys.value = selectedItem.value?.itemKey ? [selectedItem.value.itemKey] : [];
  multiLayoutSuggestion.value = null;
  multiLayoutError.value = "";
}

function clearEditorSelection() {
  selectedItemKey.value = "";
  selectedItemKeys.value = [];
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
    currentSection: selectedSection.value,
    instruction: compositionInstruction.value,
    sectionInputs: sectionInputs.value?.[sectionKey] || {},
    currentLayout: currentCompositionLayout(sectionKey),
    generateBackgroundImage: true,
    imageGuidance: compositionInstruction.value.trim(),
    fadeMode: compositionFadeMode.value,
    keyVisualTextMode: compositionKeyVisualTextMode.value,
    keyVisualText: compositionKeyVisualTextMode.value === "explicit"
      ? compositionKeyVisualText.value.trim()
      : "",
    scope: {
      layout: false,
      tokens: false,
      keyVisual: true,
      motion: false,
      preserveContent: true,
    },
  };
}

function structureCandidates() {
  return availableComponents.value.map((component) => ({
    componentKey: component.componentKey,
    componentVersionId: component.activeVersion?.id,
    name: component.name,
    description: component.description || component.activeVersion?.editorSchema?.description || "",
    fieldKind: component.activeVersion?.fieldKind || component.activeVersion?.fields?.[0]?.fieldKind || "text",
    maxInstances: component.activeVersion?.editorSchema?.maxInstances || 3,
  })).filter((candidate) => candidate.componentVersionId);
}

async function requestSectionStructurePlan() {
  if (!selectedSection.value || selectedSection.value.items?.length || structurePurpose.value.trim().length < 3) return;
  structurePlanning.value = true;
  structureError.value = "";
  structureResult.value = null;
  try {
    const payload = {
      sectionKey: selectedSection.value.sectionKey,
      sectionPurpose: structurePurpose.value,
      candidates: structureCandidates(),
      baseDocumentRevision: editorCore.getState().revision,
      idempotencyKey: globalThis.crypto?.randomUUID?.() || `${Date.now()}`,
    };
    const response = await fetch("/api/promo-section-structure-plan", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const result = await response.json().catch(() => ({}));
    if (!response.ok) throw new Error(result.message || result.error || `AI 섹션 구성 요청 오류(${response.status})`);
    if (selectedSection.value?.sectionKey === payload.sectionKey && !selectedSection.value.items?.length) {
      structureResult.value = { ...result, requestPayload: payload };
    }
  } catch (requestError) {
    structureError.value = requestError.message;
  } finally {
    structurePlanning.value = false;
  }
}

async function applySectionStructurePlan() {
  const planned = structureResult.value;
  const section = selectedSection.value;
  if (!planned?.proposal || !section || section.items?.length || structureApplying.value) return;
  structureApplying.value = true;
  structureError.value = "";
  try {
    const response = await fetch("/api/promo-section-structure-validate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...planned.requestPayload,
        proposal: planned.proposal,
        candidateFingerprint: planned.candidateFingerprint,
        currentDocumentRevision: editorCore.getState().revision,
        candidates: structureCandidates(),
      }),
    });
    const result = await response.json().catch(() => ({}));
    if (!response.ok) throw new Error(result.message || result.error || `AI 섹션 구성 검증 오류(${response.status})`);
    const definitions = new Map(availableComponents.value.map((component) => [component.activeVersion?.id, component]));
    const items = result.proposal.componentSelections.flatMap((selection) => {
      const definition = definitions.get(selection.componentVersionId);
      return definition
        ? Array.from({ length: selection.instanceCount }, () => createComponentInstanceFromDefinition(definition))
        : [];
    }).map((item, index) => ({ ...item, sortOrder: index * 10 }));
    if (!items.length) throw new Error("적용할 수 있는 컴포넌트가 없습니다.");
    const nextSection = { ...section, items };
    const nextSections = sections.value.map((candidate) => candidate.sectionKey === section.sectionKey ? nextSection : candidate);
    const nextContent = {
      ...sectionInputs.value,
      [section.sectionKey]: createSectionInputs([nextSection])[section.sectionKey],
    };
    if (!executeEditorCommand(EditorCommandType.DOCUMENT_PATCH, {
      sections: nextSections,
      content: nextContent,
      layout: designSpec.value,
    }, { source: "ai", label: "AI 섹션 구조 구성" })) return;
    structureResult.value = null;
    structureMessage.value = `${items.length}개 컴포넌트를 구성했습니다.`;
    await nextTick();
    const appliedSection = sections.value.find((candidate) => candidate.sectionKey === section.sectionKey);
    selectItem(appliedSection, appliedSection?.items?.[0] || null);
  } catch (applyError) {
    structureError.value = applyError.message;
  } finally {
    structureApplying.value = false;
  }
}

async function requestSectionComposition() {
  if (!selectedSection.value || !sectionAiHasContent(selectedSection.value)
    || compositionInstruction.value.trim().length < 3 || compositionPlanning.value) return;
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
    const nextSectionStyles = { ...(designSpec.value.sectionStyles || {}) };
    if (proposal.backgroundImage?.requested) {
      nextSectionStyles[sectionKey] = {
        ...(nextSectionStyles[sectionKey] || {}),
        backgroundFadeMode: proposal.backgroundImage.fadeMode,
        backgroundFadeSafeArea: proposal.backgroundImage.safeArea,
      };
    }
    executeEditorCommand(EditorCommandType.DOCUMENT_PATCH, {
      content: sectionInputs.value,
      layout: {
        ...designSpec.value,
        sectionStyles: nextSectionStyles,
      },
    }, { source: "ai", label: "AI 섹션 키비주얼 적용" });
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
        {
          keyVisualTextMode: planned.requestPayload?.keyVisualTextMode || "none",
          keyVisualText: planned.requestPayload?.keyVisualText || "",
        },
      );
    }
  } catch (applyError) {
    if (requestSequence === compositionRequestSequence) compositionError.value = applyError.message;
  } finally {
    if (requestSequence === compositionRequestSequence) compositionApplying.value = false;
  }
}

function updateSelectedValue(value) {
  if (!selectedSection.value || !selectedItem.value) return;
  executeEditorCommand(EditorCommandType.CONTENT_VALUE_SET, {
    sectionKey: selectedSection.value.sectionKey,
    itemKey: selectedItem.value.itemKey,
    value,
  }, { label: "콘텐츠 변경" });
}

function ctaLabelInput(value) {
  return Array.from(String(value ?? "")).slice(0, 20).join("");
}

function updateObjectField(key, value) {
  const nextValue = key === "label" && selectedItem.value?.fieldKind === "cta"
    ? ctaLabelInput(value) : value;
  updateSelectedValue({ ...(selectedValue.value || {}), [key]: nextValue });
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
  const nextValue = key === "label" && field?.fieldKind === "cta" ? ctaLabelInput(value) : value;
  updateFieldValue(item, field, { ...(fieldValue(item, field) || {}), [key]: nextValue });
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

async function requestSectionAiAction(
  section, action, targetItemKey = "", targetType = "", targetFieldKey = "",
  imageGuidance = "", imageSafeArea = "", keyVisualOptions = {},
) {
  const resolvedTargetType = targetType || (targetItemKey ? "item" : "section-background");
  if (isAiDocumentMode.value) {
    if (!["generate", "remove-background"].includes(action) || !section || aiDocumentSaving.value) return;
    const removing = action === "remove-background";
    structureMessage.value = removing ? "키비주얼을 삭제하고 있습니다." : "AI 이미지 요청을 준비하고 있습니다.";
    if (editorCore.getState().dirty) {
      const saved = await saveAiDocument();
      if (!saved) {
        structureMessage.value = "먼저 AI 문서 변경 내용을 저장해야 합니다.";
        return;
      }
    }
    const item = targetItemKey
      ? section.items?.find((candidate) => candidate.itemKey === targetItemKey)
      : null;
    const resolvedFieldKey = String(
      targetFieldKey
      || item?.fields?.[0]?.fieldKey
      || item?.sourceItemKey
      || item?.itemKey
      || "",
    );
    const targetInstanceId = item
      ? item.id || item.itemKey
      : section.pageSectionInstanceId || section.sectionKey;
    try {
      const result = await aiDocumentAdapter.applyOperations({
        documentId: aiDocumentId.value,
        baseDocumentRevision: aiDocumentRevision.value,
        operations: [{
          operationId: `asset:${targetInstanceId}:${Date.now()}`,
          type: removing ? "remove-asset" : "request-asset-regeneration",
          targetInstanceId,
          fieldKey: item ? resolvedFieldKey : "",
          valueText: String(imageGuidance || ""),
          visible: true,
          position: 0,
          layoutVariant: "",
          tokenKey: "",
          motionPresetVersionId: "",
          reason: imageGuidance || (removing
            ? "Visual Editor section key visual removal."
            : "Visual Editor AI image generation request."),
        }],
        summary: removing
          ? "Visual Editor에서 섹션 키비주얼을 삭제했습니다."
          : resolvedTargetType === "item"
          ? "Visual Editor에서 컴포넌트 이미지를 생성합니다."
          : "Visual Editor에서 섹션 키비주얼을 생성합니다.",
      });
      aiDocumentRevision.value = Number(result.revision || aiDocumentRevision.value);
      aiDocumentSnapshot.value = {
        ...aiDocumentSnapshot.value,
        ...result.snapshot,
        assets: result.snapshot?.assets || aiDocumentSnapshot.value?.assets,
      };
      if (result.assetWarning) {
        structureMessage.value = result.assetWarning.message
          || "AI 이미지 생성 작업을 시작하지 못했습니다. 다시 시도해 주세요.";
        return;
      }
      if (removing) {
        designSpec.value = normalizeLayoutSpec(result.snapshot?.designSpec || designSpec.value);
        hydrateEditorCore({ resetHistory: false });
        structureMessage.value = "키비주얼을 삭제했습니다.";
      } else {
        structureMessage.value = "AI 이미지 생성 요청을 접수했습니다.";
        refreshAiDocumentAssetsUntilSettled();
      }
    } catch (assetError) {
      structureMessage.value = assetError.message;
    }
    return;
  }
  promoBuilderAdapter.requestSectionAiAction({
    sectionKey: section.sectionKey,
    action,
    targetType: resolvedTargetType,
    targetItemKey,
    targetFieldKey,
    imageGuidance,
    imageSafeArea,
    keyVisualTextMode: keyVisualOptions.keyVisualTextMode || "none",
    keyVisualText: keyVisualOptions.keyVisualText || "",
  });
}

function sectionHasAiBackground(section) {
  return Boolean(designSpec.value?.sectionStyles?.[section.sectionKey]?.backgroundImage);
}

async function requestImageRemoval(field = null) {
  if (!selectedSection.value || !selectedItem.value || selectedItem.value.isLocked) return;
  if (field?.isLocked) return;
  if (!window.confirm(`${field?.name || selectedItem.value.name} 이미지를 삭제할까요?`)) return;
  if (isAiDocumentMode.value) {
    if (editorCore.getState().dirty && !await saveAiDocument()) return;
    const section = selectedSection.value;
    const item = selectedItem.value;
    const targetInstanceId = item.id || item.itemKey;
    try {
      const result = await aiDocumentAdapter.applyOperations({
        documentId: aiDocumentId.value,
        baseDocumentRevision: aiDocumentRevision.value,
        operations: [{
          operationId: `remove-asset:${targetInstanceId}:${Date.now()}`,
          type: "remove-asset",
          targetInstanceId,
          fieldKey: String(
            field?.fieldKey
            || item.fields?.[0]?.fieldKey
            || item.sourceItemKey
            || item.itemKey,
          ),
          valueText: "",
          visible: true,
          position: 0,
          layoutVariant: "",
          tokenKey: "",
          motionPresetVersionId: "",
          reason: "Visual Editor image removal.",
        }],
        summary: "Visual Editor에서 컴포넌트 이미지를 삭제했습니다.",
      });
      aiDocumentRevision.value = Number(result.revision || aiDocumentRevision.value);
      aiDocumentSnapshot.value = result.snapshot;
      sections.value = result.snapshot?.content?.sectionSnapshot || sections.value;
      sectionInputs.value = result.snapshot?.content?.sectionInputs || sectionInputs.value;
      designSpec.value = normalizeLayoutSpec(result.snapshot?.designSpec || designSpec.value);
      hydrateEditorCore({ resetHistory: false });
      structureMessage.value = "이미지를 삭제했습니다.";
    } catch (removeError) {
      structureMessage.value = removeError.message;
    }
    return;
  }
  promoBuilderAdapter.requestImageRemoval({
    sectionKey: selectedSection.value.sectionKey,
    itemKey: selectedItem.value.itemKey,
    fieldKey: field?.fieldKey || null,
  });
}

function updateDesignToken(versionId) {
  if ((!isAdminLayoutMode.value && !isAiDocumentMode.value) || !template.value?.id) return;
  const tokenSet = designTokenSets.value.find((candidate) => candidate.versionId === versionId);
  if (!tokenSet) return;
  previewDesignTokenVersionId.value = tokenSet.versionId;
  template.value = {
    ...template.value,
    designTokenSetVersionId: tokenSet.versionId,
    designTokens: {
      setKey: tokenSet.setKey,
      version: tokenSet.version,
      versionId: tokenSet.versionId,
      values: tokenSet.values || {},
      sourceValues: tokenSet.sourceValues || [],
    },
  };
  if (isAiDocumentMode.value) {
    aiDocumentSaveMessage.value = `${tokenSet.name} v${tokenSet.version} 토큰을 적용했습니다. 저장하면 AI 문서와 Web Output에 반영됩니다.`;
  } else {
    layoutSaveMessage.value = `${tokenSet.name} v${tokenSet.version} 토큰으로 미리보는 중입니다. 템플릿에는 저장되지 않습니다.`;
  }
}

const selectedStyleKey = computed(() => (
  selectedSection.value && selectedItem.value
    ? `${selectedSection.value.sectionKey}.${selectedItem.value.itemKey}`
    : ""
));
const selectedDesktopItemStyle = computed(() => designSpec.value.itemStyles?.[selectedStyleKey.value] || {});
const selectedMobileItemStyle = computed(() => (
  designSpec.value.responsiveLayouts?.mobile?.itemStyles?.[selectedStyleKey.value] || {}
));
const selectedItemStyle = computed(() => (
  viewport.value === "mobile"
    ? { ...selectedDesktopItemStyle.value, ...selectedMobileItemStyle.value }
    : selectedDesktopItemStyle.value
));
const selectedSectionStyle = computed(() => (
  selectedSection.value
    ? designSpec.value.sectionStyles?.[selectedSection.value.sectionKey] || {}
    : {}
));

function updateItemStyle(patch) {
  if (!selectedStyleKey.value || selectedItem.value?.isLocked) return;
  const responsive = viewport.value === "mobile";
  executeEditorCommand(
    responsive ? EditorCommandType.RESPONSIVE_ITEM_STYLE_PATCH : EditorCommandType.ITEM_STYLE_PATCH,
    {
      ...(responsive ? { viewport: "mobile" } : {}),
      styleKey: selectedStyleKey.value,
      patch,
    },
    { label: responsive ? "모바일 컴포넌트 스타일 변경" : "컴포넌트 스타일 변경" },
  );
}

function rawSelectedViewportStyle() {
  return viewport.value === "mobile" ? selectedMobileItemStyle.value : selectedDesktopItemStyle.value;
}

function replaceSelectedViewportStyle(style, label) {
  const responsive = viewport.value === "mobile";
  if (Object.keys(style).length) {
    executeEditorCommand(
      responsive ? EditorCommandType.RESPONSIVE_ITEM_STYLE_REPLACE : EditorCommandType.ITEM_STYLE_REPLACE,
      {
        ...(responsive ? { viewport: "mobile" } : {}),
        styleKey: selectedStyleKey.value,
        style,
      },
      { label },
    );
  } else {
    executeEditorCommand(
      responsive ? EditorCommandType.RESPONSIVE_ITEM_STYLE_REMOVE : EditorCommandType.ITEM_STYLE_REMOVE,
      {
        ...(responsive ? { viewport: "mobile" } : {}),
        styleKey: selectedStyleKey.value,
      },
      { label },
    );
  }
}

function applyRendererStylePatch(styleKey, patch, label) {
  const responsive = viewport.value === "mobile";
  executeEditorCommand(
    responsive ? EditorCommandType.RESPONSIVE_ITEM_STYLE_PATCH : EditorCommandType.ITEM_STYLE_PATCH,
    {
      ...(responsive ? { viewport: "mobile" } : {}),
      styleKey,
      patch,
    },
    { source: "pointer", label },
  );
}

function resetSelectedItemOffset() {
  updateItemStyle({ offsetX: undefined, offsetY: undefined });
}

function enableAutomaticTextSize() {
  if (selectedItem.value?.fieldKind === "image") return;
  updateItemStyle({
    heightMode: "auto",
    heightPx: undefined,
  });
}

function enableFixedTextSize() {
  if (selectedItem.value?.fieldKind === "image") return;
  const renderedHeight = selectedRenderedItemRect()?.height;
  updateItemStyle({
    widthMode: "fixed",
    heightMode: "fixed",
    widthPct: selectedItemStyle.value.widthPct || 32,
    heightPx: Math.min(
      MAXIMUM_COMPONENT_HEIGHT_PX,
      Math.max(
        MINIMUM_COMPONENT_HEIGHT_PX,
        Number(selectedItemStyle.value.heightPx || renderedHeight || defaultComponentHeight(selectedItem.value)),
      ),
    ),
  });
}

function patchSelectedTextStyle(patch) {
  updateItemStyle(patch);
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
  applyRendererStylePatch(key, nextPatch, "컴포넌트 위치·크기 변경");
}

function resetItemStyle() {
  if (!selectedStyleKey.value || selectedItem.value?.isLocked) return;
  const responsive = viewport.value === "mobile";
  executeEditorCommand(
    responsive ? EditorCommandType.RESPONSIVE_ITEM_STYLE_REMOVE : EditorCommandType.ITEM_STYLE_REMOVE,
    {
      ...(responsive ? { viewport: "mobile" } : {}),
      styleKey: selectedStyleKey.value,
    },
    { label: responsive ? "모바일 컴포넌트 스타일 초기화" : "컴포넌트 스타일 초기화" },
  );
}

function restoreAutomaticPosition() {
  if (!selectedStyleKey.value || selectedItem.value?.isLocked) return;
  const nextStyle = withoutFreePosition(rawSelectedViewportStyle());
  delete nextStyle.horizontalAnchor;
  delete nextStyle.verticalAnchor;
  delete nextStyle.offsetX;
  delete nextStyle.offsetY;
  delete nextStyle.textAlign;
  replaceSelectedViewportStyle(nextStyle, "자동 위치 복원");
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

function selectedRenderedItemRect() {
  const stage = previewPanelRef.value?.getStageElement?.();
  if (!stage || !selectedStyleKey.value) return null;
  const element = [...stage.querySelectorAll(".rendered-item[data-style-key]")]
    .find((candidate) => candidate.dataset.styleKey === selectedStyleKey.value);
  return element?.getBoundingClientRect() || null;
}

function setImageResizeMode(mode) {
  if (!selectedStyleKey.value || selectedItem.value?.isLocked || !["locked", "free"].includes(mode)) return;
  const nextStyle = { ...selectedItemStyle.value };
  const renderedRect = selectedRenderedItemRect();
  const renderedRatio = renderedRect?.width > 0 && renderedRect?.height > 0
    ? `${Math.max(1, Math.round(renderedRect.width))}/${Math.max(1, Math.round(renderedRect.height))}`
    : "";
  const nextPatch = {};
  if (mode === "locked" || nextStyle.shape === "circle") {
    nextPatch.aspectRatioLocked = true;
    nextPatch.aspectRatio = nextStyle.shape === "circle"
      ? "1/1"
      : (renderedRatio || nextStyle.aspectRatio || selectedItem.value?.image?.aspectRatio || "1/1");
    nextPatch.heightPx = undefined;
  } else {
    nextPatch.aspectRatioLocked = false;
    nextPatch.heightPx = Math.min(
      MAXIMUM_COMPONENT_HEIGHT_PX,
      Math.max(
        MINIMUM_COMPONENT_HEIGHT_PX,
        Number(renderedRect?.height || nextStyle.heightPx || defaultComponentHeight(selectedItem.value)),
      ),
    );
    if (renderedRatio) nextPatch.aspectRatio = renderedRatio;
  }
  updateItemStyle(nextPatch);
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
    sectionInputs.value = createSectionInputs(sections.value, detailResult.defaultContent || {});
    selectedSectionKey.value = sections.value[0]?.sectionKey || "";
    selectedItemKey.value = sections.value[0]?.items?.[0]?.itemKey || "";
    selectedItemKeys.value = selectedItemKey.value ? [selectedItemKey.value] : [];
    hydrateEditorCore();
  } catch (loadError) {
    error.value = loadError.message;
  } finally {
    loading.value = false;
  }
}

async function loadAiDocument() {
  const documentId = new URLSearchParams(window.location.search).get("builderDocumentId");
  if (!documentId) {
    error.value = "builderDocumentId가 필요합니다.";
    loading.value = false;
    return;
  }
  try {
    const [result, availableTokenSets] = await Promise.all([
      aiDocumentAdapter.load(documentId),
      aiDocumentAdapter.loadDesignTokenSets(),
    ]);
    if (!result.snapshot) throw new Error("AI 프로모션 구성이 아직 준비되지 않았습니다.");
    aiDocumentId.value = documentId;
    aiDocumentRevision.value = Number(result.document?.currentDocumentRevision || result.snapshot.documentRevision || 0);
    aiDocumentSnapshot.value = result.snapshot;
    aiDocumentConflict.value = null;
    designTokenSets.value = availableTokenSets;
    const selectedTokenVersionId = result.snapshot.appearance?.designTokenSetVersionId
      || result.snapshot.content?.formTemplate?.designTokenSetVersionId
      || "";
    const selectedTokenSet = availableTokenSets.find(
      (candidate) => candidate.versionId === selectedTokenVersionId,
    ) || availableTokenSets.find((candidate) => candidate.isDefault) || availableTokenSets[0] || null;
    previewDesignTokenVersionId.value = selectedTokenSet?.versionId || selectedTokenVersionId;
    template.value = {
      ...result.snapshot.content.formTemplate,
      ...(selectedTokenSet ? {
        designTokenSetVersionId: selectedTokenSet.versionId,
        designTokens: {
          setKey: selectedTokenSet.setKey,
          name: selectedTokenSet.name,
          version: selectedTokenSet.version,
          versionId: selectedTokenSet.versionId,
          values: selectedTokenSet.values || {},
          sourceValues: selectedTokenSet.sourceValues || [],
        },
      } : {}),
    };
    configRevision.value = result.snapshot.layoutIdentity?.configRevision || "";
    sections.value = result.snapshot.content.sectionSnapshot || [];
    sectionInputs.value = result.snapshot.content.sectionInputs || {};
    designSpec.value = normalizeLayoutSpec(result.snapshot.designSpec);
    layoutRevision.value = Number(result.snapshot.layoutRevision || 0);
    layoutIdentity.value = result.snapshot.layoutIdentity || null;
    selectedSectionKey.value = sections.value[0]?.sectionKey || "";
    selectedItemKey.value = sections.value[0]?.items?.[0]?.itemKey || "";
    selectedItemKeys.value = selectedItemKey.value ? [selectedItemKey.value] : [];
    hydrateEditorCore();
    refreshAiDocumentAssetsUntilSettled();
  } catch (loadError) {
    error.value = loadError.message;
  } finally {
    loading.value = false;
  }
}

async function refreshAiDocumentAssetsUntilSettled() {
  for (let count = 0; count < 200 && !aiDocumentPollingCancelled; count += 1) {
    const requests = aiDocumentSnapshot.value?.assets?.requests || [];
    if (!requests.some((request) => ["pending", "queued", "processing"].includes(request.status))) return;
    await new Promise((resolve) => setTimeout(resolve, 2000));
    if (aiDocumentPollingCancelled) return;
    try {
      const loaded = await aiDocumentAdapter.load(aiDocumentId.value);
      if (loaded.snapshot?.assets) {
        const loadedSnapshot = loaded.snapshot;
        const nextLayout = JSON.parse(JSON.stringify(designSpec.value));
        const nextContent = JSON.parse(JSON.stringify(sectionInputs.value));
        (loadedSnapshot.assets.requests || []).forEach((request) => {
          if (request.status !== "ready") return;
          const sectionKey = request.pageSectionInstanceId;
          if (request.targetType === "section-key-visual") {
            const backgroundImage = loadedSnapshot.designSpec?.sectionStyles?.[sectionKey]?.backgroundImage;
            if (!backgroundImage) return;
            nextLayout.sectionStyles ||= {};
            nextLayout.sectionStyles[sectionKey] = {
              ...(nextLayout.sectionStyles[sectionKey] || {}),
              backgroundImage,
            };
            return;
          }
          if (request.targetType === "component-field-image" && request.pageComponentInstanceId) {
            const componentValue = loadedSnapshot.content?.sectionInputs
              ?.[sectionKey]?.[request.pageComponentInstanceId];
            if (componentValue === undefined) return;
            nextContent[sectionKey] ||= {};
            nextContent[sectionKey][request.pageComponentInstanceId] = componentValue;
          }
        });
        designSpec.value = nextLayout;
        sectionInputs.value = nextContent;
        aiDocumentSnapshot.value = {
          ...aiDocumentSnapshot.value,
          assets: loadedSnapshot.assets,
        };
        editorCore.replaceDocument(editorDocumentFromRefs(), { resetHistory: false, dirty: false });
        updateEditorHistory();
      }
    } catch {
      return;
    }
  }
}

async function saveAiDocument() {
  if (!isAiDocumentMode.value || !editorSnapshot.value || aiDocumentSaving.value) return false;
  const validation = validateLayoutSpec(designSpec.value);
  if (!validation.ok) {
    aiDocumentSaveMessage.value = `레이아웃 검증 실패: ${validation.errors[0]?.path || "unknown"}`;
    return false;
  }
  aiDocumentSaving.value = true;
  aiDocumentSaveMessage.value = "";
  try {
    const saved = await aiDocumentAdapter.save({
      documentId: aiDocumentId.value,
      baseDocumentRevision: aiDocumentRevision.value,
      snapshot: editorSnapshot.value,
      designTokenSetVersionId: previewDesignTokenVersionId.value,
      changeNote: "Visual Editor에서 AI 프로모션 문서를 저장했습니다.",
    });
    aiDocumentRevision.value = Number(saved.revision);
    aiDocumentSnapshot.value = saved.snapshot;
    aiDocumentConflict.value = null;
    designSpec.value = normalizeLayoutSpec(saved.snapshot.designSpec);
    layoutRevision.value = Number(saved.snapshot.layoutRevision || layoutRevision.value);
    editorCore.replaceDocument(editorDocumentFromRefs(), { resetHistory: false, dirty: false });
    updateEditorHistory();
    aiDocumentSaveMessage.value = `AI 프로모션 문서 revision ${saved.revision} 저장 완료`;
    return true;
  } catch (saveError) {
    if (saveError.code === "DOCUMENT_REVISION_MISMATCH") {
      aiDocumentConflict.value = {
        currentRevision: Number(saveError.currentDocumentRevision || 0),
        conflicts: [],
        busy: false,
      };
      aiDocumentSaveMessage.value = "다른 작업에서 문서가 먼저 저장되었습니다. 현재 변경을 최신 버전에 재적용해 주세요.";
      return false;
    }
    aiDocumentSaveMessage.value = saveError.message;
    return false;
  } finally {
    aiDocumentSaving.value = false;
  }
}

function applyAiDocumentWorkingSnapshot(snapshot, { baseSnapshot, revision, dirty }) {
  const previousSectionKey = selectedSectionKey.value;
  const previousItemKey = selectedItemKey.value;
  aiDocumentRevision.value = Number(revision || snapshot.documentRevision || 0);
  aiDocumentSnapshot.value = baseSnapshot;
  sections.value = snapshot.content?.sectionSnapshot || [];
  sectionInputs.value = snapshot.content?.sectionInputs || {};
  designSpec.value = normalizeLayoutSpec(snapshot.designSpec || designSpec.value);
  layoutRevision.value = Number(snapshot.layoutRevision || layoutRevision.value);
  layoutIdentity.value = snapshot.layoutIdentity || layoutIdentity.value;
  template.value = {
    ...(template.value || {}),
    ...(snapshot.content?.formTemplate || {}),
  };
  const nextSection = sections.value.find((section) => section.sectionKey === previousSectionKey) || sections.value[0] || null;
  const nextItem = nextSection?.items?.find((item) => item.itemKey === previousItemKey) || nextSection?.items?.[0] || null;
  selectedSectionKey.value = nextSection?.sectionKey || "";
  selectedItemKey.value = nextItem?.itemKey || "";
  selectedItemKeys.value = nextItem?.itemKey ? [nextItem.itemKey] : [];
  hydrateEditorCore({ resetHistory: false, dirty });
}

async function rebaseAiDocumentChanges() {
  if (!aiDocumentConflict.value || aiDocumentConflict.value.busy) return;
  aiDocumentConflict.value = { ...aiDocumentConflict.value, busy: true, conflicts: [] };
  try {
    const localSnapshot = JSON.parse(JSON.stringify(editorSnapshot.value));
    const baseSnapshot = JSON.parse(JSON.stringify(aiDocumentSnapshot.value));
    const loaded = await aiDocumentAdapter.load(aiDocumentId.value);
    if (!loaded.snapshot) throw new Error("최신 AI 프로모션 문서를 불러오지 못했습니다.");
    const rebased = rebaseDocumentSnapshot(baseSnapshot, localSnapshot, loaded.snapshot);
    if (rebased.conflicts.length) {
      aiDocumentConflict.value = {
        currentRevision: Number(loaded.document?.currentDocumentRevision || 0),
        conflicts: rebased.conflicts,
        busy: false,
      };
      aiDocumentSaveMessage.value = `동일한 항목이 양쪽에서 변경되어 자동 병합하지 않았습니다. 충돌 ${rebased.conflicts.length}건을 확인해 주세요.`;
      return;
    }
    applyAiDocumentWorkingSnapshot(rebased.snapshot, {
      baseSnapshot: loaded.snapshot,
      revision: loaded.document?.currentDocumentRevision,
      dirty: true,
    });
    aiDocumentConflict.value = null;
    aiDocumentSaveMessage.value = "현재 변경을 최신 문서에 재적용했습니다. 저장 버튼을 다시 눌러 확정해 주세요.";
  } catch (rebaseError) {
    aiDocumentConflict.value = { ...aiDocumentConflict.value, busy: false };
    aiDocumentSaveMessage.value = rebaseError.message;
  }
}

async function reloadLatestAiDocument() {
  if (!aiDocumentConflict.value || aiDocumentConflict.value.busy) return;
  if (editorCore.getState().dirty && !window.confirm("저장되지 않은 현재 편집을 버리고 최신 문서를 불러올까요?")) return;
  aiDocumentConflict.value = { ...aiDocumentConflict.value, busy: true };
  try {
    const loaded = await aiDocumentAdapter.load(aiDocumentId.value);
    if (!loaded.snapshot) throw new Error("최신 AI 프로모션 문서를 불러오지 못했습니다.");
    applyAiDocumentWorkingSnapshot(loaded.snapshot, {
      baseSnapshot: loaded.snapshot,
      revision: loaded.document?.currentDocumentRevision,
      dirty: false,
    });
    aiDocumentConflict.value = null;
    aiDocumentSaveMessage.value = `최신 문서 revision ${aiDocumentRevision.value}을 불러왔습니다.`;
  } catch (reloadError) {
    aiDocumentConflict.value = { ...aiDocumentConflict.value, busy: false };
    aiDocumentSaveMessage.value = reloadError.message;
  }
}

async function openOutput() {
  if (!editorSnapshot.value) return;
  if (isAiDocumentMode.value) {
    const saved = await saveAiDocument();
    if (!saved) return;
    const url = new URL("/prototype/visual-editor.html", window.location.origin);
    url.searchParams.set("mode", "output");
    url.searchParams.set("builderDocumentId", aiDocumentId.value);
    url.searchParams.set("revision", String(aiDocumentRevision.value));
    url.searchParams.set("returnUrl", window.location.href);
    window.open(url, "_blank", "noopener,noreferrer");
    return;
  }
  outputSaveError.value = "";
  const result = outputAdapter.save(editorSnapshot.value);
  if (!result.ok) {
    outputSaveError.value = result.message;
    return;
  }
  outputAdapter.open(window.location.href);
}

function outputReturnTarget() {
  const raw = new URLSearchParams(window.location.search).get("returnUrl");
  if (!raw) return "";
  try {
    const target = new URL(raw, window.location.origin);
    if (target.origin !== window.location.origin) return "";
    if (target.pathname === window.location.pathname && target.searchParams.get("mode") === "output") return "";
    return target.href;
  } catch {
    return "";
  }
}

function returnToLivePreview() {
  if (window.opener && !window.opener.closed) {
    window.opener.focus();
    window.close();
    return;
  }
  const returnUrl = outputReturnTarget();
  window.close();
  window.setTimeout(() => {
    if (document.visibilityState === "hidden") return;
    if (returnUrl) {
      window.location.replace(returnUrl);
      return;
    }
    if (window.history.length > 1) window.history.back();
  }, 120);
}

async function loadSectionPresetLayout() {
  const params = new URLSearchParams(window.location.search);
  const sectionId = params.get("sectionId") || "";
  const layoutKey = params.get("layoutKey") || "";
  if (!sectionId || !layoutKey) {
    error.value = "sectionId와 layoutKey가 필요합니다.";
    loading.value = false;
    return;
  }
  try {
    const [result, availableTokenSets] = await Promise.all([
      sectionPresetAdapter.load(sectionId),
      adminTemplateAdapter.loadDesignTokenSets(),
    ]);
    const selectedLayout = result.layouts.find((entry) => entry.layoutKey === layoutKey);
    if (!selectedLayout) throw new Error("요청한 Layout Preset을 찾을 수 없습니다.");
    const section = { ...result.section, items: result.items || [] };
    const previewTokenSet = availableTokenSets.find((candidate) => candidate.isDefault)
      || availableTokenSets[0]
      || null;
    designTokenSets.value = availableTokenSets;
    previewDesignTokenVersionId.value = previewTokenSet?.versionId || "";
    template.value = {
      id: section.id,
      templateKey: section.sectionKey,
      name: section.name,
      version: section.version || 1,
      status: section.status || "draft",
      designTokens: previewTokenSet ? {
        setKey: previewTokenSet.setKey,
        version: previewTokenSet.version,
        versionId: previewTokenSet.versionId,
        values: previewTokenSet.values || {},
        sourceValues: previewTokenSet.sourceValues || [],
      } : null,
    };
    const layoutPatch = resolveSectionPresetLayoutPatch(section, selectedLayout) || {};
    sections.value = [section];
    sectionInputs.value = createSectionInputs(sections.value, {
      [section.sectionKey]: layoutPatch.content || {},
    });
    designSpec.value = normalizeLayoutSpec({
      ...JSON.parse(JSON.stringify(DEFAULT_DESIGN_SPEC)),
      sectionStyles: layoutPatch.sectionStyles || {},
      itemStyles: layoutPatch.itemStyles || {},
      visibility: layoutPatch.visibility || { items: {}, fields: {} },
      responsiveLayouts: layoutPatch.responsiveLayouts || { mobile: { itemStyles: {}, visibility: { items: {} } } },
    });
    sectionPresetLayout.value = selectedLayout;
    layoutRevision.value = 1;
    selectedSectionKey.value = section.sectionKey;
    selectedItemKey.value = section.items?.[0]?.itemKey || "";
    selectedItemKeys.value = selectedItemKey.value ? [selectedItemKey.value] : [];
    hydrateEditorCore();
  } catch (loadError) {
    error.value = loadError.message;
  } finally {
    loading.value = false;
  }
}

function notifySectionPresetSaved() {
  if (globalThis.parent === globalThis) return;
  globalThis.parent.postMessage({
    type: "promo-section-layout-saved",
    sectionId: sections.value[0]?.id || "",
    layoutId: sectionPresetLayout.value?.id || "",
    layoutKey: sectionPresetLayout.value?.layoutKey || "",
  }, globalThis.location.origin);
}

async function saveSectionPresetLayout() {
  const section = sections.value[0];
  const layout = sectionPresetLayout.value;
  if (!section?.id || !layout?.id || layoutSaving.value) return;
  layoutSaving.value = true;
  layoutSaveMessage.value = "";
  try {
    const snapshot = sectionPresetSnapshotFromDesignSpec(
      section,
      designSpec.value,
      layout.layoutSnapshot,
      sectionInputs.value?.[section.sectionKey] || {},
    );
    const result = await sectionPresetAdapter.update(layout.id, section.id, {
      name: layout.name,
      description: layout.description || "",
      changeNote: layoutChangeNote.value || "공통 Visual Editor에서 Section Layout Preset을 저장했습니다.",
      layoutSnapshot: snapshot,
    });
    sectionPresetLayout.value = result.layout;
    layoutChangeNote.value = "";
    editorCore.replaceDocument(editorDocumentFromRefs(), { resetHistory: false, dirty: false });
    updateEditorHistory();
    layoutSaveMessage.value = `${result.layout.name} Layout Preset을 저장했습니다.`;
    notifySectionPresetSaved();
  } catch (saveError) {
    layoutSaveMessage.value = saveError.validationErrors?.[0]?.message || saveError.message;
  } finally {
    layoutSaving.value = false;
  }
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
    sectionInputs.value = createSectionInputs(sections.value, result.layout?.defaultContent || {});
    designSpec.value = normalizeLayoutSpec(result.layout?.layoutSpec);
    layoutRevision.value = Number(result.layout?.layoutRevision || 1);
    layoutId.value = result.layout?.id || null;
    layoutIdentity.value = result.layoutIdentity || null;
    selectedSectionKey.value = sections.value[0]?.sectionKey || "";
    selectedItemKey.value = sections.value[0]?.items?.[0]?.itemKey || "";
    selectedItemKeys.value = selectedItemKey.value ? [selectedItemKey.value] : [];
    hydrateEditorCore();
  } catch (loadError) {
    error.value = loadError.message;
  } finally {
    loading.value = false;
  }
}

function notifyAdminLayoutSaved(activated = false) {
  if (globalThis.parent === globalThis) return;
  globalThis.parent.postMessage({
    type: "promo-admin-layout-saved",
    templateId: template.value?.id || "",
    layoutRevision: layoutRevision.value,
    activated,
  }, globalThis.location.origin);
}

async function saveAdminLayout() {
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
      defaultContent: sectionInputs.value,
      compositionSnapshot: sections.value,
      changeNote: layoutChangeNote.value || "Admin Layout Editor에서 기본 레이아웃을 저장했습니다.",
    });
    designSpec.value = normalizeLayoutSpec(result.layout.layoutSpec);
    layoutRevision.value = Number(result.layout.layoutRevision || layoutRevision.value + 1);
    layoutId.value = result.layout.id || layoutId.value;
    layoutIdentity.value = result.layoutIdentity || layoutIdentity.value;
    editorCore.replaceDocument(editorDocumentFromRefs(), { resetHistory: false, dirty: false });
    updateEditorHistory();
    layoutChangeNote.value = "";
    layoutSaveMessage.value = `초안 v${template.value.version || 1} · layout r${layoutRevision.value} 저장 완료 · 운영 반영은 왼쪽 템플릿의 활성/비활성 토글에서 지정하세요.`;
    notifyAdminLayoutSaved(false);
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

watch([designSpec, sectionInputs, sections], () => {
  if (!isWizardLayoutMode.value || !externalSnapshotReady.value || applyingExternalSnapshot) return;
  promoBuilderAdapter.notifyChange({
    snapshotRevision: lastExternalSnapshotRevision,
    designSpec: designSpec.value,
    sectionInputs: sectionInputs.value,
    sections: sections.value,
  });
}, { deep: true });

async function loadEditorLibraries() {
  if (!isBuilderWorkspaceMode.value || (!capabilities.value.canManageComponents && !capabilities.value.canCreateSections)) return;
  editorLibraryLoading.value = true;
  try {
    const result = await editorLibraryAdapter.load();
    componentLibrary.value = result.components;
    sectionPresets.value = result.sectionPresets;
  } catch (libraryError) {
    structureMessage.value = libraryError.message;
  } finally {
    editorLibraryLoading.value = false;
  }
}

async function loadOutput() {
  try {
    const builderDocumentId = new URLSearchParams(window.location.search).get("builderDocumentId");
    if (builderDocumentId) {
      loading.value = true;
      const response = await fetch(
        `/api/promo-builder-documents?documentId=${encodeURIComponent(builderDocumentId)}`,
        { credentials: "same-origin", cache: "no-store" },
      );
      const result = await response.json().catch(() => ({}));
      if (!response.ok) {
        throw new Error(result.message || result.error || "Builder 문서를 불러오지 못했습니다.");
      }
      outputSnapshot.value = result.snapshot;
      return;
    }
    outputSnapshot.value = outputAdapter.load();
  } catch (loadError) {
    error.value = loadError.message;
  } finally {
    loading.value = false;
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
  loadEditorLibraries();
  if (props.mode === "output") loadOutput();
  else if (isAiDocumentMode.value) loadAiDocument();
  else if (isSectionPresetMode.value) loadSectionPresetLayout();
  else if (isAdminLayoutMode.value) loadAdminLayout();
  else if (isWizardLayoutMode.value) {
    loading.value = true;
    disconnectPromoBuilder = promoBuilderAdapter.connect(handleParentMessage);
    promoBuilderAdapter.notifyReady();
  } else loadEditor();
});

onBeforeUnmount(() => {
  aiDocumentPollingCancelled = true;
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
      <button type="button" @click="returnToLivePreview">Live Preview로 돌아가기</button>
    </header>
    <div v-if="error" class="system-message system-message--error">{{ error }}</div>
    <PromoPageRenderer
      v-else-if="rendererSnapshot"
      :content="rendererSnapshot.content"
      :design-spec="rendererSnapshot.designSpec"
      :assets="rendererSnapshot.assets"
      :motion-spec="rendererSnapshot.motionSpec"
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
          <strong>{{ isAdminLayoutMode ? "Admin Template Layout" : isSectionPresetMode ? "Section Layout Preset" : isAiDocumentMode ? "AI Promotion Visual Editor" : "Visual Editor" }}</strong>
        </div>
        <div class="shell-page-actions">
        <div class="shell-status" role="status">{{ isSectionPresetMode ? sectionPresetLayout?.name : isAdminLayoutMode ? `Layout revision ${layoutRevision}` : isAiDocumentMode ? `Document revision ${aiDocumentRevision}` : "편집 준비" }}</div>
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
          v{{ template?.version || 1 }} · {{ template?.status || "draft" }} · 초안 저장 후 왼쪽 템플릿 활성/비활성 토글에서 운영 반영을 지정합니다.
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

    <div v-if="loading" class="system-message">{{ isAiDocumentMode ? "AI 프로모션 문서를 불러오는 중입니다." : "기본 Form Template을 불러오는 중입니다." }}</div>
    <div v-else-if="error" class="system-message system-message--error">{{ error }}</div>
    <div v-if="outputSaveError" class="system-message system-message--error" role="alert">{{ outputSaveError }}</div>
    <div v-if="layoutSaveMessage" class="system-message" role="status">{{ layoutSaveMessage }}</div>
    <div v-if="aiDocumentSaveMessage" class="system-message" role="status">{{ aiDocumentSaveMessage }}</div>
    <section v-if="aiDocumentConflict" class="system-message revision-conflict" role="alert">
      <div>
        <strong>새 문서 revision이 감지되었습니다.</strong>
        <span v-if="aiDocumentConflict.currentRevision">최신 revision {{ aiDocumentConflict.currentRevision }}</span>
        <small v-if="aiDocumentConflict.conflicts.length">
          자동 병합 충돌: {{ aiDocumentConflict.conflicts.slice(0, 3).join(", ") }}<template v-if="aiDocumentConflict.conflicts.length > 3"> 외 {{ aiDocumentConflict.conflicts.length - 3 }}건</template>
        </small>
      </div>
      <div class="revision-conflict__actions">
        <button type="button" :disabled="aiDocumentConflict.busy" @click="rebaseAiDocumentChanges">
          {{ aiDocumentConflict.busy ? "처리 중" : "현재 변경을 최신본에 재적용" }}
        </button>
        <button type="button" :disabled="aiDocumentConflict.busy" @click="reloadLatestAiDocument">최신본으로 다시 불러오기</button>
      </div>
    </section>
    <div v-if="structureMessage" class="system-message" role="status">{{ structureMessage }}</div>

    <section
      v-if="!loading && !error"
      class="editor-workspace"
      :class="{
        'is-builder-workspace': isBuilderWorkspaceMode,
        'is-create-promo-wizard': isCreatePromoWizardMode,
        'is-admin-layout-workspace': isAdminLayoutMode,
        'is-section-preset-workspace': isSectionPresetMode,
        'is-ai-document-workspace': isAiDocumentMode,
      }"
    >
      <StructurePanel
        :sections="sections"
        :selected-section="selectedSection"
        :expanded-section-key="expandedSectionKey"
        :selected-item="selectedItem"
        :selected-item-style="selectedItemStyle"
        :color-token-options="colorTokenOptions"
        :font-family-token-options="fontFamilyTokenOptions"
        :font-size-token-options="fontSizeTokenOptions"
        :font-weight-token-options="fontWeightTokenOptions"
        :line-height-token-options="lineHeightTokenOptions"
        :letter-spacing-token-options="letterSpacingTokenOptions"
        :selected-item-key="selectedItemKey"
        :selected-section-style="selectedSectionStyle"
        :capabilities="capabilities"
        :component-library="availableComponents"
        :section-presets="availableSectionPresets"
        :library-loading="editorLibraryLoading"
        :section-content-registered="sectionContentRegistered"
        :section-has-ai-background="sectionHasAiBackground"
        :section-motion="selectedSectionMotion"
        @select-section="selectSection"
        @toggle-section-expansion="toggleSectionExpansion"
        @select-item="selectRendererItem"
        @section-ai-action="(section, action, targetItemKey, targetType, options) => requestSectionAiAction(section, action, targetItemKey, targetType, '', '', '', options)"
        @background-alignment="setSectionBackgroundAlignment"
        @background-fade="setSectionBackgroundFadeMode"
        @update-section-style="updateSectionStyle"
        @reset-section-height="resetSectionHeight"
        @create-blank-section="createBlankSection"
        @create-section-from-preset="createSectionFromPreset"
        @add-component="addComponent"
        @move-section="moveSection"
        @move-component="moveComponent"
        @remove-section="removeSection"
        @remove-component="removeComponent"
        @update-section-motion="updateSectionMotion"
        @replay-motion="replayMotion"
      >
        <template #section-composition="{ section }">
          <AiSectionCompositionPanel
            v-if="capabilities.canManageComponents && section?.sectionKey === selectedSection?.sectionKey && !section.items?.length"
            :purpose="structurePurpose"
            :planning="structurePlanning"
            :applying="structureApplying"
            :error="structureError"
            :proposal="structureResult?.proposal || null"
            :has-candidates="availableComponents.length > 0"
            @update:purpose="structurePurpose = $event"
            @request-plan="requestSectionStructurePlan"
            @apply="applySectionStructurePlan"
            @dismiss="structureResult = null"
          />
          <SectionCompositionControls
            v-else-if="capabilities.canRunSectionAi && section?.sectionKey === selectedSection?.sectionKey"
            :instruction="compositionInstruction"
            :can-generate="sectionAiHasContent(section)"
            :fade-mode="compositionFadeMode"
            :key-visual-text-mode="compositionKeyVisualTextMode"
            :key-visual-text="compositionKeyVisualText"
            :planning="compositionPlanning"
            :applying="compositionApplying"
            :error="compositionError"
            :proposal="compositionResult?.proposal || null"
            @update:instruction="compositionInstruction = $event"
            @update:fade-mode="compositionFadeMode = $event"
            @update:key-visual-text-mode="compositionKeyVisualTextMode = $event"
            @update:key-visual-text="compositionKeyVisualText = $event"
            @request-plan="requestSectionComposition"
            @apply="applySectionComposition"
            @dismiss="compositionResult = null"
          />
        </template>
      </StructurePanel>

      <PreviewPanel
        ref="previewPanelRef"
        :motion-replay-key="motionReplayKey"
        :renderer-snapshot="rendererSnapshot"
        :section-design-runs="sectionDesignRuns"
        :guide-mode="previewGuideMode"
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
        :ai-document-saving="aiDocumentSaving"
        :ai-document-save-message="aiDocumentSaveMessage"
        :editor-snapshot="editorSnapshot"
        :template="template"
        :selected-style-key="selectedStyleKey"
        :selected-item-keys="selectedItemKeys"
        :selected-section="selectedSection"
        :selected-item="selectedItem"
        :selected-item-style="selectedItemStyle"
        :color-token-options="colorTokenOptions"
        :font-color-token-options="fontColorTokenOptions"
        :gradient-token-options="gradientTokenOptions"
        :background-color-token-options="backgroundColorTokenOptions"
        :text-style-token-options="textStyleTokenOptions"
        :font-family-token-options="fontFamilyTokenOptions"
        :font-size-token-options="fontSizeTokenOptions"
        :font-weight-token-options="fontWeightTokenOptions"
        :line-height-token-options="lineHeightTokenOptions"
        :letter-spacing-token-options="letterSpacingTokenOptions"
        @update:guide-mode="previewGuideMode = $event"
        @update:viewport="viewport = $event"
        @update:layout-change-note="layoutChangeNote = $event"
        @request-auto-register="requestAutoRegister"
        @undo="undoEditorCommand"
        @redo="redoEditorCommand"
        @update-design-token="updateDesignToken"
        @save-admin-layout="saveAdminLayout"
        @save-section-preset="saveSectionPresetLayout"
        @save-ai-document="saveAiDocument"
        @open-output="openOutput"
        @clear-selection="clearEditorSelection"
        @select-item="selectRendererItem"
        @update-item-style="updateItemStyle"
        @update-renderer-item-style="updateRendererItemStyle"
        @update-item-content="updateRendererContent"
        @update-section-style="updateSectionStyle"
        @drop-library-component="addComponent"
        @patch-selected-text-style="patchSelectedTextStyle"
        @restore-automatic-position="restoreAutomaticPosition"
        @reset-selected-item-offset="resetSelectedItemOffset"
        @enable-automatic-text-size="enableAutomaticTextSize"
        @enable-fixed-text-size="enableFixedTextSize"
        @selection-rect-change="componentInspectorAnchor = $event"
      />

      <ComponentInspectorPopover
        v-if="selectedItem && componentInspectorAnchor"
        :anchor-rect="componentInspectorAnchor"
        :title="selectedItemKeys.length > 1 ? `${selectedItemKeys.length}개 컴포넌트` : selectedItem.name"
        :subtitle="selectedItemKeys.length > 1 ? '다중 정렬' : selectedItem.fieldKind"
        :locked="selectedItemKeys.length <= 1 && selectedItem.isLocked"
        :anchor-key="selectedStyleKey"
        @close="clearEditorSelection"
      >
        <div class="component-inspector-ai">
          <AiLayoutControls
            v-if="capabilities.canRunMultiLayoutAi && selectedItemKeys.length > 1"
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
        </div>

          <div v-if="selectedItemKeys.length <= 1" class="component-property-list">
            <div class="component-property-content">
              <label
                v-if="!selectedItem.isRequired && !selectedItem.isLocked"
                class="app-switch app-switch--small component-visibility-toggle"
                :title="itemVisible(selectedSection, selectedItem) ? '웹 출력에 노출 중' : '웹 출력에서 숨김'"
              >
                <input
                  class="app-switch__input"
                  type="checkbox"
                  role="switch"
                  :checked="itemVisible(selectedSection, selectedItem)"
                  :aria-label="`${selectedItem.name} 노출`"
                  @change="setItemVisible(selectedSection, selectedItem, $event.target.checked)"
                />
                <span class="app-switch__track" aria-hidden="true"></span>
                <span class="app-switch__label">노출</span>
              </label>
          <div v-if="componentFields(selectedItem).length > 1" class="component-field-property-list">
            <section v-for="field in componentFields(selectedItem)" :key="field.fieldKey" class="component-field-property">
              <header>
                <strong>{{ field.name }}</strong>
                <small>{{ field.fieldKind }} · {{ field.fieldKey }}</small>
                <label
                  v-if="!field.isRequired && !field.isLocked"
                  class="app-switch app-switch--small component-visibility-toggle"
                  :title="fieldVisible(selectedSection, selectedItem, field) ? '웹 출력에 노출 중' : '웹 출력에서 숨김'"
                >
                  <input
                    class="app-switch__input"
                    type="checkbox"
                    role="switch"
                    :checked="fieldVisible(selectedSection, selectedItem, field)"
                    :aria-label="`${field.name} 노출`"
                    @change="setFieldVisible(selectedSection, selectedItem, field, $event.target.checked)"
                  />
                  <span class="app-switch__track" aria-hidden="true"></span>
                  <span class="app-switch__label">노출</span>
                </label>
              </header>
              <template v-if="field.fieldKind === 'cta'">
                <label><span>버튼 텍스트</span><input :disabled="selectedItem.isLocked || field.isLocked" :value="fieldValue(selectedItem, field)?.label" :maxlength="field.editorSchema?.maxLength || 20" @input="updateFieldObject(selectedItem, field, 'label', $event.target.value)" /></label>
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
            <input :disabled="selectedItem.isLocked" :value="selectedValue?.label" :maxlength="selectedItem.editorSchema?.maxLength || 20" @input="updateObjectField('label', $event.target.value)" />
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
                    :max="MAXIMUM_COMPONENT_HEIGHT_PX"
                    step="1"
                    :disabled="selectedItem.isLocked"
                    :value="selectedItemStyle.heightPx || defaultComponentHeight(selectedItem)"
                    @input="updateItemStyle({ heightPx: Number($event.target.value) })"
                  />
                  <input
                    class="dimension-input"
                    type="number"
                    :min="MINIMUM_COMPONENT_HEIGHT_PX"
                    :max="MAXIMUM_COMPONENT_HEIGHT_PX"
                    step="1"
                    :disabled="selectedItem.isLocked"
                    :value="Math.round(selectedItemStyle.heightPx || defaultComponentHeight(selectedItem))"
                    aria-label="이미지 높이 픽셀"
                    @change="updateItemStyle({ heightPx: Math.min(MAXIMUM_COMPONENT_HEIGHT_PX, Math.max(MINIMUM_COMPONENT_HEIGHT_PX, Number($event.target.value) || defaultComponentHeight(selectedItem))) })"
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
              <label class="app-checkbox toggle-field">
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
              <small>영역 크기와 글자 크기는 별도로 변경됩니다. 자동 크기는 실제 텍스트 높이를 사용합니다.</small>
              <div class="image-resize-mode" aria-label="텍스트 영역 크기 모드">
                <span>크기 모드</span>
                <div>
                  <button
                    type="button"
                    :class="{ active: usesAutomaticComponentHeight(selectedItem, selectedItemStyle) }"
                    :disabled="selectedItem.isLocked"
                    @click="enableAutomaticTextSize"
                  >자동</button>
                  <button
                    type="button"
                    :class="{ active: !usesAutomaticComponentHeight(selectedItem, selectedItemStyle) }"
                    :disabled="selectedItem.isLocked"
                    @click="enableFixedTextSize"
                  >고정</button>
                </div>
              </div>
              <label>
                <span>컴포넌트 너비</span>
                <div class="range-field">
                  <input
                    type="range"
                    :min="MINIMUM_COMPONENT_WIDTH_PCT"
                    max="100"
                    step="0.1"
                    :disabled="selectedItem.isLocked"
                    :value="selectedItemStyle.widthPct || 32"
                    @input="updateItemStyle({ widthPct: Number($event.target.value) })"
                  />
                  <input
                    class="dimension-input"
                    type="number"
                    :min="MINIMUM_COMPONENT_WIDTH_PCT"
                    max="100"
                    step="0.1"
                    :disabled="selectedItem.isLocked"
                    :value="Math.round(selectedItemStyle.widthPct || 32)"
                    aria-label="컴포넌트 너비 퍼센트"
                    @change="updateItemStyle({ widthPct: Math.min(100, Math.max(MINIMUM_COMPONENT_WIDTH_PCT, Number($event.target.value) || 32)) })"
                  />
                </div>
              </label>
              <label v-if="!usesAutomaticComponentHeight(selectedItem, selectedItemStyle)">
                <span>컴포넌트 높이</span>
                <div class="range-field">
                  <input
                    type="range"
                    :min="MINIMUM_COMPONENT_HEIGHT_PX"
                    :max="MAXIMUM_COMPONENT_HEIGHT_PX"
                    step="1"
                    :disabled="selectedItem.isLocked"
                    :value="selectedItemStyle.heightPx || defaultComponentHeight(selectedItem)"
                    @input="updateItemStyle({ heightPx: Number($event.target.value) })"
                  />
                  <input
                    class="dimension-input"
                    type="number"
                    :min="MINIMUM_COMPONENT_HEIGHT_PX"
                    :max="MAXIMUM_COMPONENT_HEIGHT_PX"
                    step="1"
                    :disabled="selectedItem.isLocked"
                    :value="Math.round(selectedItemStyle.heightPx || defaultComponentHeight(selectedItem))"
                    aria-label="컴포넌트 높이 픽셀"
                    @change="updateItemStyle({ heightPx: Math.min(MAXIMUM_COMPONENT_HEIGHT_PX, Math.max(MINIMUM_COMPONENT_HEIGHT_PX, Number($event.target.value) || defaultComponentHeight(selectedItem))) })"
                  />
                </div>
              </label>
              <small v-if="!usesAutomaticComponentHeight(selectedItem, selectedItemStyle)">
                고정 영역을 넘는 내용은 미리보기와 출력에서 잘립니다.
              </small>
            </div>
            <div class="position-status">
              <span>위치</span>
              <strong v-if="selectedItemStyle.positionMode === 'free'">
                X {{ Math.round(selectedItemStyle.xPct || 0) }}% · Y {{ Math.round(selectedItemStyle.yPx || 0) }}px
              </strong>
              <strong v-else-if="selectedItemStyle.positionMode === 'anchored'">
                {{ selectedItemStyle.horizontalAnchor || 'center' }} · {{ selectedItemStyle.verticalAnchor || 'middle' }}
              </strong>
              <strong v-else>자동 배치</strong>
            </div>
            <button
              v-if="selectedItemStyle.positionMode === 'free' || selectedItemStyle.positionMode === 'anchored'"
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
        <ComponentTransitionControls
          v-if="selectedItem && selectedItemKeys.length <= 1"
          :binding="selectedItemMotion"
          :disabled="selectedItem.isLocked"
          @update="updateItemMotion"
          @replay="replayMotion"
        />
      </ComponentInspectorPopover>
    </section>
      </div>
    </div>
    <button v-if="!usesEmbeddedEngineShell" class="shell-overlay" type="button" data-shell-overlay aria-label="메뉴 닫기"></button>
  </main>
</template>
