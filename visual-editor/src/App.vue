<script setup>
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from "vue";
import PromoPageRenderer from "./PromoPageRenderer.vue";
import { persistSnapshot, withoutFreePosition } from "./editor-utils.mjs";
import { normalizeLayoutSpec, validateLayoutSpec } from "./layout-utils.mjs";
import {
  DESIGN_COLOR_TOKENS,
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
const expandedComponentKey = ref("");
const previewStageRef = ref(null);
const viewport = ref("desktop");
const guidesVisible = ref(true);
const outputSaveError = ref("");
const outputSnapshot = ref(null);
const layoutRevision = ref(1);
const layoutId = ref(null);
const layoutChangeNote = ref("");
const layoutSaving = ref(false);
const layoutSaveMessage = ref("");
const externalSnapshotReady = ref(false);
const autoRegisterPending = ref(false);
const autoRegisterMessage = ref("");
const sectionDesignRuns = ref({});
let applyingExternalSnapshot = false;

const isAdminLayoutMode = computed(() => props.mode === "admin-layout");
const isWizardLayoutMode = computed(() => props.mode === "wizard-layout");
const wizardSource = new URLSearchParams(window.location.search).get("source") || "";
const isCreatePromoWizardMode = computed(() => isWizardLayoutMode.value && wizardSource === "create-promo");
const shellNavItems = window.PromoShell?.navItems || [];

const selectedSection = computed(() => sections.value.find((section) => section.sectionKey === selectedSectionKey.value) || sections.value[0]);
const selectedItem = computed(() => selectedSection.value?.items?.find((item) => item.itemKey === selectedItemKey.value) || selectedSection.value?.items?.[0]);
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

function selectItem(section, item) {
  if (!section) return;
  selectedSectionKey.value = section.sectionKey;
  selectedItemKey.value = item?.itemKey || "";
}

function componentKey(section, item) {
  return section && item ? `${section.sectionKey}.${item.itemKey}` : "";
}

function scrollPreviewToSection(section) {
  if (!section || !previewStageRef.value) return;
  const target = previewStageRef.value.querySelector(`[data-section-key="${CSS.escape(section.sectionKey)}"]`);
  if (!target) return;
  const stageRect = previewStageRef.value.getBoundingClientRect();
  const targetRect = target.getBoundingClientRect();
  previewStageRef.value.scrollTo({
    top: Math.max(0, previewStageRef.value.scrollTop + targetRect.top - stageRect.top),
    behavior: "smooth",
  });
}

async function selectSection(section) {
  if (!section) return;
  const item = section.items?.[0] || null;
  selectItem(section, item);
  expandedComponentKey.value = componentKey(section, item);
  await nextTick();
  scrollPreviewToSection(section);
}

function toggleComponent(section, item) {
  const key = componentKey(section, item);
  selectItem(section, item);
  expandedComponentKey.value = expandedComponentKey.value === key ? "" : key;
}

function updateSelectedValue(value) {
  if (!selectedSection.value || !selectedItem.value) return;
  sectionInputs.value = {
    ...sectionInputs.value,
    [selectedSection.value.sectionKey]: {
      ...sectionInputs.value[selectedSection.value.sectionKey],
      [selectedItem.value.itemKey]: value,
    },
  };
}

function updateObjectField(key, value) {
  updateSelectedValue({ ...(selectedValue.value || {}), [key]: value });
}

function updateRendererContent(section, item, value) {
  selectItem(section, item);
  if (item.fieldKind !== "text" || item.isLocked) return;
  updateSelectedValue(value);
}

function itemContentRegistered(section, item) {
  const value = sectionInputs.value?.[section.sectionKey]?.[item.itemKey];
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
  window.parent.postMessage({
    type: "create-promo-auto-register-request",
    sectionInputs: JSON.parse(JSON.stringify(sectionInputs.value)),
  }, window.location.origin);
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
    if (item.isVisibleInWizard === false || item.fieldKind === "image") return false;
    const value = inputs[item.itemKey];
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

function sectionAiItemAllowed(section, item) {
  return Boolean(
    section?.aiDesign?.enabled !== false
      && item?.fieldKind === "image"
      && item?.isVisibleInWizard !== false
      && !item?.isLocked
      && item?.image?.allowedSources?.includes("ai")
      && sectionAiAllowedItemKeys(section).includes(item.itemKey)
  );
}

function sectionAiRunTargetItemKey(section) {
  const target = sectionAiRun(section)?.constraintsSnapshot?.imageTarget;
  return target?.type === "item" ? target.itemKey : "";
}

function sectionAiItemAction(section, item) {
  const run = sectionAiRun(section);
  const matchesItem = sectionAiRunTargetItemKey(section) === item?.itemKey;
  if (sectionAiIsProcessing(section)) return { action: "generate", label: "AI 이미지 생성 중", disabled: true };
  if (matchesItem && run?.status === "ready" && !sectionAiIsStale(section)) {
    return { action: "generate", label: "AI 이미지 적용 중", disabled: true };
  }
  if (matchesItem && run?.status === "applied") {
    return { action: "generate", label: "AI 이미지 재생성", disabled: !sectionAiHasContent(section) };
  }
  return { action: "generate", label: "AI 이미지 생성", disabled: !sectionAiHasContent(section) };
}

function requestSectionAiAction(section, action, targetItemKey = "", targetType = "") {
  const resolvedTargetType = targetType || (targetItemKey ? "item" : "section-background");
  window.parent.postMessage({
    type: "create-promo-section-ai-action",
    sectionKey: section.sectionKey,
    action,
    targetType: resolvedTargetType,
    targetItemKey: String(targetItemKey || "").trim() || null,
  }, window.location.origin);
}

function sectionHasAiBackground(section) {
  return Boolean(designSpec.value?.sectionStyles?.[section.sectionKey]?.backgroundImage);
}

function requestImageRemoval() {
  if (!selectedSection.value || !selectedItem.value || selectedItem.value.isLocked) return;
  if (!window.confirm(`${selectedItem.value.name} 이미지를 삭제할까요?`)) return;
  window.parent.postMessage({
    type: "create-promo-remove-image",
    sectionKey: selectedSection.value.sectionKey,
    itemKey: selectedItem.value.itemKey,
  }, window.location.origin);
}

function updateBackgroundToken(token) {
  designSpec.value = {
    ...designSpec.value,
    theme: {
      ...designSpec.value.theme,
      backgroundColor: token.value,
      backgroundToken: token.key,
      textColor: token.textColor,
    },
  };
}

const selectedStyleKey = computed(() => (
  selectedSection.value && selectedItem.value
    ? `${selectedSection.value.sectionKey}.${selectedItem.value.itemKey}`
    : ""
));
const selectedItemStyle = computed(() => designSpec.value.itemStyles?.[selectedStyleKey.value] || {});
const selectedSectionStyle = computed(() => (
  selectedSection.value
    ? designSpec.value.sectionStyles?.[selectedSection.value.sectionKey] || {}
    : {}
));

function updateItemStyle(patch) {
  if (!selectedStyleKey.value || selectedItem.value?.isLocked) return;
  designSpec.value = {
    ...designSpec.value,
    itemStyles: {
      ...(designSpec.value.itemStyles || {}),
      [selectedStyleKey.value]: {
        ...selectedItemStyle.value,
        ...patch,
      },
    },
  };
}

function updateRendererItemStyle(section, item, patch) {
  if (!section || !item || item.isLocked) return;
  const key = `${section.sectionKey}.${item.itemKey}`;
  designSpec.value = {
    ...designSpec.value,
    itemStyles: {
      ...(designSpec.value.itemStyles || {}),
      [key]: {
        ...(designSpec.value.itemStyles?.[key] || {}),
        ...patch,
      },
    },
  };
}

function resetItemStyle() {
  if (!selectedStyleKey.value || selectedItem.value?.isLocked) return;
  const nextStyles = { ...(designSpec.value.itemStyles || {}) };
  delete nextStyles[selectedStyleKey.value];
  designSpec.value = { ...designSpec.value, itemStyles: nextStyles };
}

function restoreAutomaticPosition() {
  if (!selectedStyleKey.value || selectedItem.value?.isLocked) return;
  const nextStyles = { ...(designSpec.value.itemStyles || {}) };
  const nextStyle = withoutFreePosition(nextStyles[selectedStyleKey.value]);
  if (Object.keys(nextStyle).length) nextStyles[selectedStyleKey.value] = nextStyle;
  else delete nextStyles[selectedStyleKey.value];
  designSpec.value = { ...designSpec.value, itemStyles: nextStyles };
}

function updateSectionStyle(sectionKey, patch) {
  if (!sectionKey) return;
  designSpec.value = {
    ...designSpec.value,
    sectionStyles: {
      ...(designSpec.value.sectionStyles || {}),
      [sectionKey]: {
        ...(designSpec.value.sectionStyles?.[sectionKey] || {}),
        ...patch,
      },
    },
  };
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
  const nextStyles = { ...(designSpec.value.itemStyles || {}) };
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
  nextStyles[selectedStyleKey.value] = nextStyle;
  designSpec.value = { ...designSpec.value, itemStyles: nextStyles };
}

function resetSectionHeight() {
  if (!selectedSection.value) return;
  const nextStyles = { ...(designSpec.value.sectionStyles || {}) };
  const nextSectionStyle = { ...(nextStyles[selectedSection.value.sectionKey] || {}) };
  delete nextSectionStyle.minHeight;
  if (Object.keys(nextSectionStyle).length) nextStyles[selectedSection.value.sectionKey] = nextSectionStyle;
  else delete nextStyles[selectedSection.value.sectionKey];
  designSpec.value = { ...designSpec.value, sectionStyles: nextStyles };
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
    template.value = detailResult.template;
    configRevision.value = detailResult.configRevision || "";
    sections.value = detailResult.sections || [];
    sectionInputs.value = createSectionInputs(sections.value);
    selectedSectionKey.value = sections.value[0]?.sectionKey || "";
    selectedItemKey.value = sections.value[0]?.items?.[0]?.itemKey || "";
    expandedComponentKey.value = componentKey(sections.value[0], sections.value[0]?.items?.[0]);
  } catch (loadError) {
    error.value = loadError.message;
  } finally {
    loading.value = false;
  }
}

function openOutput() {
  if (!editorSnapshot.value) return;
  outputSaveError.value = "";
  const result = persistSnapshot(localStorage, SNAPSHOT_STORAGE_KEY, editorSnapshot.value);
  if (!result.ok) {
    outputSaveError.value = result.message;
    return;
  }
  window.open("/prototype/visual-output.html", "_blank", "noopener");
}

async function loadAdminLayout() {
  const templateId = new URLSearchParams(window.location.search).get("templateId");
  if (!templateId) {
    error.value = "templateId가 필요합니다.";
    loading.value = false;
    return;
  }
  try {
    const response = await fetch(`/api/wizard-form-template-layout?templateId=${encodeURIComponent(templateId)}`);
    const result = await response.json();
    if (!response.ok) throw new Error(result.message || result.error || "기본 레이아웃을 불러오지 못했습니다.");
    template.value = result.template;
    sections.value = result.sections || [];
    sectionInputs.value = createSectionInputs(sections.value);
    designSpec.value = normalizeLayoutSpec(result.layout?.layoutSpec);
    layoutRevision.value = Number(result.layout?.layoutRevision || 1);
    layoutId.value = result.layout?.id || null;
    selectedSectionKey.value = sections.value[0]?.sectionKey || "";
    selectedItemKey.value = sections.value[0]?.items?.[0]?.itemKey || "";
    expandedComponentKey.value = componentKey(sections.value[0], sections.value[0]?.items?.[0]);
  } catch (loadError) {
    error.value = loadError.message;
  } finally {
    loading.value = false;
  }
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
    const response = await fetch("/api/wizard-form-template-layout", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        templateId: template.value.id,
        expectedRevision: layoutRevision.value,
        rendererKey: "default-promo-renderer",
        rendererVersion: 1,
        layoutSpec: validation.spec,
        changeNote: layoutChangeNote.value || "Admin Layout Editor에서 기본 레이아웃을 저장했습니다.",
      }),
    });
    const result = await response.json().catch(() => ({}));
    if (!response.ok) throw new Error(result.message || result.error || `레이아웃 저장 오류(${response.status})`);
    designSpec.value = normalizeLayoutSpec(result.layout.layoutSpec);
    layoutRevision.value = Number(result.layout.layoutRevision || layoutRevision.value + 1);
    layoutId.value = result.layout.id || layoutId.value;
    layoutChangeNote.value = "";
    layoutSaveMessage.value = `기본 레이아웃을 Draft에 저장했습니다. revision ${layoutRevision.value} · Create Promo 반영을 위해 관리자 페이지에서 템플릿을 활성화하세요.`;
  } catch (saveError) {
    layoutSaveMessage.value = saveError.message;
  } finally {
    layoutSaving.value = false;
  }
}

async function applyExternalSnapshot(snapshot) {
  if (!snapshot?.content) return;
  const previousSectionKey = selectedSection.value?.sectionKey || selectedSectionKey.value;
  const previousItemKey = selectedItem.value?.itemKey || selectedItemKey.value;
  const previousExpandedComponentKey = expandedComponentKey.value;
  applyingExternalSnapshot = true;
  template.value = snapshot.content.formTemplate || null;
  configRevision.value = snapshot.content.formTemplate?.configRevision || "";
  sections.value = snapshot.content.sectionSnapshot || [];
  sectionInputs.value = snapshot.content.sectionInputs || {};
  sectionDesignRuns.value = snapshot.content.sectionDesignRuns || {};
  designSpec.value = normalizeLayoutSpec(snapshot.designSpec);
  layoutRevision.value = Number(snapshot.layoutRevision || 1);
  const nextSelectedSection = sections.value.find((section) => section.sectionKey === previousSectionKey)
    || sections.value[0];
  selectedSectionKey.value = nextSelectedSection?.sectionKey || "";
  selectedItemKey.value = nextSelectedSection?.items?.some((item) => item.itemKey === previousItemKey)
    ? previousItemKey
    : nextSelectedSection?.items?.[0]?.itemKey || "";
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
  loading.value = false;
  error.value = "";
  await nextTick();
  applyingExternalSnapshot = false;
}

function handleParentMessage(event) {
  if (!isWizardLayoutMode.value || event.origin !== window.location.origin) return;
  if (event.data?.type === "create-promo-auto-register-result") {
    autoRegisterPending.value = false;
    const count = Number(event.data.registeredCount || 0);
    autoRegisterMessage.value = count
      ? `${count}개 항목을 자동 등록했습니다.`
      : "자동 등록할 빈 항목이 없습니다.";
    return;
  }
  if (event.data?.type === "promo-wizard-layout-snapshot") {
    applyExternalSnapshot(event.data.snapshot);
  }
}

watch([designSpec, sectionInputs], () => {
  if (!isWizardLayoutMode.value || !externalSnapshotReady.value || applyingExternalSnapshot) return;
  window.parent.postMessage({
    type: "promo-wizard-layout-change",
    designSpec: JSON.parse(JSON.stringify(designSpec.value)),
    sectionInputs: JSON.parse(JSON.stringify(sectionInputs.value)),
  }, window.location.origin);
}, { deep: true });

function loadOutput() {
  try {
    const stored = localStorage.getItem(SNAPSHOT_STORAGE_KEY);
    if (!stored) throw new Error("Visual Editor에서 확정한 Snapshot이 없습니다.");
    outputSnapshot.value = JSON.parse(stored);
  } catch (loadError) {
    error.value = loadError.message;
  }
}

onMounted(() => {
  if (isCreatePromoWizardMode.value) {
    document.documentElement.classList.add("create-promo-editor-document");
    document.body.classList.add("create-promo-editor-document");
  }
  window.PromoShell?.init(document);
  if (props.mode === "output") loadOutput();
  else if (isAdminLayoutMode.value) loadAdminLayout();
  else if (isWizardLayoutMode.value) {
    loading.value = true;
    window.addEventListener("message", handleParentMessage);
    window.parent.postMessage({ type: "promo-wizard-layout-ready" }, window.location.origin);
  } else loadEditor();
});

onBeforeUnmount(() => {
  window.removeEventListener("message", handleParentMessage);
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
      'shell-frame': !isWizardLayoutMode,
      'editor-shell--embedded': isCreatePromoWizardMode,
    }"
    :data-shell-frame="!isWizardLayoutMode ? '' : null"
  >
    <aside v-if="!isWizardLayoutMode" class="shell-sidebar" id="visual-editor-global-navigation" data-shell-sidebar aria-label="전역 내비게이션">
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

    <div :class="!isWizardLayoutMode ? 'shell-main' : 'editor-embedded-main'">
      <header v-if="!isWizardLayoutMode" class="shell-utility-bar editor-shell-header">
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
          'shell-content': !isWizardLayoutMode,
          'editor-content--embedded': isCreatePromoWizardMode,
        }"
      >

    <header v-if="!isCreatePromoWizardMode" class="editor-header editor-toolbar">
      <div>
        <span>{{ isAdminLayoutMode ? "ADMIN TEMPLATE LAYOUT" : isWizardLayoutMode ? "WIZARD LAYOUT" : "VISUAL EDITOR" }}</span>
        <h2>{{ template?.name || "Default Renderer" }}</h2>
        <small v-if="isAdminLayoutMode" class="editor-mode-note">
          v{{ template?.version || 1 }} · {{ template?.status || "draft" }} · Draft 저장 후 템플릿을 활성화해야 Create Promo에 반영됩니다.
        </small>
      </div>
      <div class="editor-global-actions">
        <fieldset v-if="!isCreatePromoWizardMode" class="global-token-menu">
          <legend>페이지 배경</legend>
          <div class="global-token-swatches">
            <button
              v-for="token in DESIGN_COLOR_TOKENS"
              :key="token.key"
              type="button"
              :class="{ active: designSpec.theme.backgroundColor === token.value }"
              :title="`${token.name} ${token.value}`"
              :aria-label="`${token.name} ${token.value}`"
              @click="updateBackgroundToken(token)"
            >
              <i :style="{ backgroundColor: token.value }"></i>
            </button>
          </div>
        </fieldset>
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
      :class="{ 'is-create-promo-wizard': isCreatePromoWizardMode }"
    >
      <aside class="section-rail" aria-label="콘텐츠 섹션">
        <div class="panel-heading">
          <span>SECTIONS</span>
          <strong>{{ sections.length }}</strong>
        </div>
        <div class="section-list">
          <button
            v-for="section in sections"
            :key="section.sectionKey"
            type="button"
            class="section-trigger"
            :class="{ active: section.sectionKey === selectedSection?.sectionKey }"
            @click="selectSection(section)"
          >
            <span>{{ section.name }}</span>
            <svg
              class="section-registration-icon"
              :class="sectionContentRegistered(section) ? 'is-complete' : 'is-incomplete'"
              viewBox="0 0 20 20"
              role="img"
              :aria-label="sectionContentRegistered(section) ? `${section.name} 콘텐츠 등록 완료` : `${section.name} 콘텐츠 등록 필요`"
            >
              <circle cx="10" cy="10" r="9"></circle>
              <path v-if="sectionContentRegistered(section)" d="M5.8 10.2 8.6 13l5.8-6"></path>
              <path v-else d="M10 5.5v6M10 14.5v.1"></path>
            </svg>
          </button>
        </div>
      </aside>

      <section class="preview-panel">
        <div class="preview-toolbar">
          <div class="preview-title-group">
            <strong>Live Preview</strong>
            <small>{{ template.templateKey }} · v{{ template.version }}</small>
            <button
              v-if="isCreatePromoWizardMode"
              class="auto-register-action"
              type="button"
              :disabled="autoRegisterPending"
              @click="requestAutoRegister"
            >
              {{ autoRegisterPending ? "등록 중" : "자동등록" }}
            </button>
            <small v-if="isCreatePromoWizardMode" class="preview-edit-hint">미리보기 요소를 선택해 내용을 입력하세요.</small>
            <small v-if="autoRegisterMessage" class="auto-register-message" role="status">{{ autoRegisterMessage }}</small>
          </div>
          <div class="preview-controls">
            <button
              v-if="!isAdminLayoutMode"
              type="button"
              class="web-output-action"
              :disabled="!editorSnapshot"
              @click="openOutput"
            >Web Output</button>
            <label class="guide-toggle">
              <input v-model="guidesVisible" type="checkbox" />
              <span>Guides</span>
              <strong>{{ guidesVisible ? "ON" : "OFF" }}</strong>
            </label>
            <div class="viewport-control" aria-label="Preview viewport">
              <button type="button" :class="{ active: viewport === 'desktop' }" @click="viewport = 'desktop'">Desktop</button>
              <button type="button" :class="{ active: viewport === 'mobile' }" @click="viewport = 'mobile'">Mobile</button>
            </div>
          </div>
        </div>
        <div ref="previewStageRef" class="preview-stage" :class="`preview-stage--${viewport}`">
          <PromoPageRenderer
            v-if="rendererSnapshot"
            :content="rendererSnapshot.content"
            :design-spec="rendererSnapshot.designSpec"
            :assets="rendererSnapshot.assets"
            :section-design-runs="sectionDesignRuns"
            editable
            :show-guides="guidesVisible"
            :selected-item-key="selectedStyleKey"
            @select-item="selectItem"
            @update-item-style="updateItemStyle"
            @update-renderer-item-style="updateRendererItemStyle"
            @update-item-content="updateRendererContent"
            @update-section-style="updateSectionStyle"
          />
        </div>
      </section>

      <aside class="property-panel">
        <div class="panel-heading">
          <span>CONTENT</span>
          <strong>{{ selectedSection?.name || "섹션 선택" }}</strong>
        </div>

        <div v-if="selectedSection" class="property-form">
          <section class="section-properties">
            <div class="section-properties__heading">
              <strong>섹션 속성</strong>
              <small>{{ selectedSection.name }}</small>
            </div>
            <div v-if="isCreatePromoWizardMode" class="section-ai-actions">
              <button
                v-if="selectedSection.aiDesign?.enabled !== false && selectedSection.aiDesign?.allowSectionBackground !== false"
                type="button"
                class="section-ai-action"
                :disabled="sectionAiPrimaryAction(selectedSection).disabled"
                :title="sectionAiPrimaryAction(selectedSection).disabled && !sectionAiIsProcessing(selectedSection) ? '섹션 콘텐츠를 먼저 등록해 주세요.' : ''"
                @click="requestSectionAiAction(selectedSection, sectionAiPrimaryAction(selectedSection).action, '', 'section-background')"
              >{{ sectionAiPrimaryAction(selectedSection).label }}</button>
              <button
                v-if="sectionHasAiBackground(selectedSection)"
                type="button"
                class="section-ai-remove"
                @click="requestSectionAiAction(selectedSection, 'remove-background')"
              >배경 삭제</button>
            </div>
            <div v-if="sectionHasAiBackground(selectedSection)" class="section-background-alignment">
              <span>배경 이미지 정렬</span>
              <div role="group" aria-label="배경 이미지 가로 정렬">
                <button
                  v-for="option in [
                    { value: 'left', label: '왼쪽' },
                    { value: 'center', label: '중앙' },
                    { value: 'right', label: '오른쪽' },
                  ]"
                  :key="option.value"
                  type="button"
                  :class="{ active: (selectedSectionStyle.backgroundPosition || 'center center') === `${option.value} center` }"
                  @click="setSectionBackgroundAlignment(option.value)"
                >
                  {{ option.label }}
                </button>
              </div>
            </div>
            <div v-if="sectionHasAiBackground(selectedSection) || selectedSection.aiDesign?.enabled !== false" class="section-background-fade">
              <label>
                <span>배경 이미지 페이드</span>
                <select
                  :value="selectedSectionStyle.backgroundFadeMode || 'none'"
                  @change="setSectionBackgroundFadeMode($event.target.value)"
                >
                  <option value="none">페이드 없음</option>
                  <option value="left">왼쪽 페이드</option>
                  <option value="right">오른쪽 페이드</option>
                  <option value="both">양끝 페이드</option>
                </select>
              </label>
              <label v-if="(selectedSectionStyle.backgroundFadeMode || 'none') !== 'none'">
                <span>페이드 강도</span>
                <select
                  :value="selectedSectionStyle.backgroundFadeStrength || 'medium'"
                  @change="updateSectionStyle(selectedSection.sectionKey, { backgroundFadeStrength: $event.target.value })"
                >
                  <option value="soft">약하게</option>
                  <option value="medium">보통</option>
                  <option value="strong">강하게</option>
                </select>
              </label>
            </div>
            <div class="section-size-control">
              <div>
                <span>섹션 높이</span>
                <strong>{{ selectedSectionStyle.minHeight ? `${Math.round(selectedSectionStyle.minHeight)}px` : "자동" }}</strong>
              </div>
              <button
                type="button"
                :disabled="!selectedSectionStyle.minHeight"
                @click="resetSectionHeight"
              >
                높이 초기화
              </button>
            </div>
          </section>

          <div class="component-property-list">
            <section
              v-for="item in selectedSection.items || []"
              :key="item.itemKey"
              class="component-property-accordion"
              :class="{ open: expandedComponentKey === componentKey(selectedSection, item) }"
            >
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
              <div class="component-property-body">
                <div>
                  <div
                    v-if="selectedItem && selectedItem.itemKey === item.itemKey"
                    class="component-property-content"
                  >
          <label v-if="selectedItem.fieldKind === 'cta'">
            <span>버튼 텍스트</span>
            <input :disabled="selectedItem.isLocked" :value="selectedValue?.label" @input="updateObjectField('label', $event.target.value)" />
          </label>
          <label v-if="selectedItem.fieldKind === 'cta'">
            <span>버튼 URL</span>
            <input :disabled="selectedItem.isLocked" type="url" :value="selectedValue?.link" @input="updateObjectField('link', $event.target.value)" />
          </label>

          <template v-else-if="selectedItem.fieldKind === 'image'">
            <button
              v-if="isCreatePromoWizardMode && sectionAiItemAllowed(selectedSection, selectedItem)"
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

          <label v-else>
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
                    min="10"
                    max="100"
                    step="1"
                    :disabled="selectedItem.isLocked"
                    :value="selectedItemStyle.widthPct || 32"
                    @input="updateItemStyle({ widthPct: Number($event.target.value) })"
                  />
                  <input
                    class="dimension-input"
                    type="number"
                    min="10"
                    max="100"
                    step="1"
                    :disabled="selectedItem.isLocked"
                    :value="Math.round(selectedItemStyle.widthPct || 32)"
                    aria-label="이미지 너비 퍼센트"
                    @change="updateItemStyle({ widthPct: Math.min(100, Math.max(10, Number($event.target.value) || 32)) })"
                  />
                </div>
              </label>
              <label v-if="selectedItemStyle.shape !== 'circle' && selectedItemStyle.aspectRatioLocked === false">
                <span>이미지 높이</span>
                <div class="range-field">
                  <input
                    type="range"
                    min="80"
                    max="900"
                    step="10"
                    :disabled="selectedItem.isLocked"
                    :value="selectedItemStyle.heightPx || 240"
                    @input="updateItemStyle({ heightPx: Number($event.target.value) })"
                  />
                  <input
                    class="dimension-input"
                    type="number"
                    min="80"
                    max="900"
                    step="10"
                    :disabled="selectedItem.isLocked"
                    :value="Math.round(selectedItemStyle.heightPx || 240)"
                    aria-label="이미지 높이 픽셀"
                    @change="updateItemStyle({ heightPx: Math.min(900, Math.max(80, Number($event.target.value) || 240)) })"
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
            <template v-if="selectedItem.fieldKind !== 'image'">
              <label>
                <span>글자 색상</span>
                <input
                  type="color"
                  :disabled="selectedItem.isLocked"
                  :value="selectedItemStyle.color || '#172033'"
                  @input="updateItemStyle({ color: $event.target.value })"
                />
              </label>
              <label>
                <span>폰트 크기</span>
                <div class="range-field">
                  <input
                    type="range"
                    min="10"
                    max="80"
                    step="1"
                    :disabled="selectedItem.isLocked"
                    :value="selectedItemStyle.fontSize || 18"
                    @input="updateItemStyle({ fontSize: Number($event.target.value) })"
                  />
                  <output>{{ selectedItemStyle.fontSize || 18 }}px</output>
                </div>
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
              <label>
                <span>정렬</span>
                <select
                  :disabled="selectedItem.isLocked"
                  :value="selectedItemStyle.textAlign || 'left'"
                  @change="updateItemStyle({ textAlign: $event.target.value })"
                >
                  <option value="left">왼쪽</option>
                  <option value="center">가운데</option>
                  <option value="right">오른쪽</option>
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
        </div>
      </aside>
    </section>
      </div>
    </div>
    <button v-if="!isWizardLayoutMode" class="shell-overlay" type="button" data-shell-overlay aria-label="메뉴 닫기"></button>
  </main>
</template>
