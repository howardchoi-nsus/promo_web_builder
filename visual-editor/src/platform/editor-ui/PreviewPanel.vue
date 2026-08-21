<script setup>
import { nextTick, onBeforeUnmount, onMounted, ref, watch } from "vue";
import PromoPageRenderer from "../../PromoPageRenderer.vue";
import EditorPreviewControls from "./EditorPreviewControls.vue";

const props = defineProps({
  rendererSnapshot: { type: Object, default: null },
  sectionDesignRuns: { type: Object, default: () => ({}) },
  guideMode: { type: String, default: "selection" },
  viewport: { type: String, default: "desktop" },
  templateIdentityLabel: { type: String, default: "" },
  capabilities: { type: Object, required: true },
  editorContext: { type: Object, required: true },
  autoRegisterPending: { type: Boolean, default: false },
  autoRegisterMessage: { type: String, default: "" },
  editorHistory: { type: Object, required: true },
  designTokenSets: { type: Array, default: () => [] },
  selectedDesignTokenVersionId: { type: String, default: "" },
  layoutChangeNote: { type: String, default: "" },
  layoutSaving: { type: Boolean, default: false },
  aiDocumentSaving: { type: Boolean, default: false },
  aiDocumentSaveMessage: { type: String, default: "" },
  editorSnapshot: { type: Object, default: null },
  template: { type: Object, default: null },
  selectedStyleKey: { type: String, default: "" },
  selectedInspectorKey: { type: String, default: "" },
  selectedFieldStyleKey: { type: String, default: "" },
  selectedItemKeys: { type: Array, default: () => [] },
  selectedSection: { type: Object, default: null },
  selectedItem: { type: Object, default: null },
  selectedItemStyle: { type: Object, default: () => ({}) },
  motionReplayKey: { type: Number, default: 0 },
  colorTokenOptions: { type: Array, default: () => [] },
  fontColorTokenOptions: { type: Array, default: () => [] },
  gradientTokenOptions: { type: Array, default: () => [] },
  backgroundColorTokenOptions: { type: Array, default: () => [] },
  textStyleTokenOptions: { type: Array, default: () => [] },
  fontFamilyTokenOptions: { type: Array, default: () => [] },
  fontSizeTokenOptions: { type: Array, default: () => [] },
  fontWeightTokenOptions: { type: Array, default: () => [] },
  lineHeightTokenOptions: { type: Array, default: () => [] },
  letterSpacingTokenOptions: { type: Array, default: () => [] },
});

const emit = defineEmits([
  "update:guide-mode",
  "update:viewport",
  "update:layout-change-note",
  "request-auto-register",
  "undo",
  "redo",
  "update-design-token",
  "save-admin-layout",
  "save-section-preset",
  "save-ai-document",
  "open-output",
  "clear-selection",
  "select-item",
  "open-item-inspector",
  "open-field-inspector",
  "update-item-style",
  "update-renderer-item-style",
  "update-renderer-field-style",
  "update-item-content",
  "update-section-style",
  "drop-library-component",
  "patch-selected-text-style",
  "restore-automatic-position",
  "reset-selected-item-offset",
  "enable-automatic-text-size",
  "enable-fixed-text-size",
  "selection-rect-change",
  "text-line-selection-change",
  "layout-collision-reflow",
]);

const previewStageRef = ref(null);
const rendererRef = ref(null);
const collisionMessage = ref("");
let selectionFrame = 0;
let stageResizeObserver = null;

function updateSelectionRect() {
  cancelAnimationFrame(selectionFrame);
  selectionFrame = requestAnimationFrame(() => {
    const stage = previewStageRef.value;
    if (!stage || !props.selectedInspectorKey) {
      emit("selection-rect-change", null);
      return;
    }
    const escapedKey = CSS.escape(props.selectedInspectorKey);
    const target = stage.querySelector(
      `[data-field-style-key="${escapedKey}"], [data-style-key="${escapedKey}"]`,
    );
    if (!target) {
      emit("selection-rect-change", null);
      return;
    }
    const rect = target.getBoundingClientRect();
    emit("selection-rect-change", {
      top: rect.top,
      right: rect.right,
      bottom: rect.bottom,
      left: rect.left,
      width: rect.width,
      height: rect.height,
    });
  });
}

watch(() => props.selectedInspectorKey, () => {
  emit("text-line-selection-change", null);
  nextTick(updateSelectionRect);
});

watch(() => [props.viewport, props.rendererSnapshot, props.selectedItemStyle], () => {
  nextTick(updateSelectionRect);
}, { deep: true });

onMounted(() => {
  previewStageRef.value?.addEventListener("scroll", updateSelectionRect, { passive: true });
  window.addEventListener("resize", updateSelectionRect, { passive: true });
  if (typeof ResizeObserver === "function" && previewStageRef.value) {
    stageResizeObserver = new ResizeObserver(updateSelectionRect);
    stageResizeObserver.observe(previewStageRef.value);
  }
  updateSelectionRect();
});

onBeforeUnmount(() => {
  cancelAnimationFrame(selectionFrame);
  previewStageRef.value?.removeEventListener("scroll", updateSelectionRect);
  window.removeEventListener("resize", updateSelectionRect);
  stageResizeObserver?.disconnect();
});

function updateSelectedTextLines(section, item, selection) {
  if (`${section?.sectionKey}.${item?.itemKey}` !== props.selectedStyleKey) return;
  emit("text-line-selection-change", selection?.indexes?.length ? selection : null);
}

function clearPreviewSelection(event) {
  if (event.target instanceof Element && event.target.closest(".rendered-item, .item-resize-handle, .section-resize-handle")) return;
  previewStageRef.value?.querySelector('[contenteditable="true"]')?.blur();
  emit("text-line-selection-change", null);
  emit("clear-selection");
}

function scrollToSection(sectionKey, behavior = "smooth") {
  if (!sectionKey || !previewStageRef.value) return false;
  const target = previewStageRef.value.querySelector(`[data-section-key="${CSS.escape(sectionKey)}"]`);
  if (!target) return false;
  const stageRect = previewStageRef.value.getBoundingClientRect();
  const targetRect = target.getBoundingClientRect();
  previewStageRef.value.scrollTo({
    top: Math.max(0, previewStageRef.value.scrollTop + targetRect.top - stageRect.top),
    behavior,
  });
  return true;
}

function getStageElement() {
  return previewStageRef.value;
}

function finishTextEdit() {
  previewStageRef.value?.querySelector('[contenteditable="true"]')?.blur();
}

async function inspectCollisions(apply = false) {
  collisionMessage.value = apply ? "겹침을 보정하고 있습니다." : "레이아웃 품질을 확인하고 있습니다.";
  await nextTick();
  await document.fonts?.ready;
  const images = [...(previewStageRef.value?.querySelectorAll("img") || [])];
  await Promise.all(images.map((image) => image.decode?.().catch(() => undefined)));
  const result = apply
    ? (rendererRef.value?.inspectLayoutCollisions?.() || { count: 0 })
    : (rendererRef.value?.inspectLayoutQuality?.() || { count: 0 });
  if (!result.count) {
    collisionMessage.value = apply
      ? "보정할 컴포넌트 겹침이 없습니다."
      : "레이아웃 품질 문제가 없습니다.";
    return result;
  }
  if (apply) {
    collisionMessage.value = `${result.count}개 컴포넌트의 겹침을 보정했습니다. 저장하면 반영됩니다.`;
    emit("layout-collision-reflow", result);
  } else {
    collisionMessage.value = [
      `품질 문제 ${result.count}건`,
      `겹침 ${result.collisionCount || 0}`,
      `잘림 ${result.clippedItemCount || 0}`,
      `내용 넘침 ${result.overflowItemCount || 0}`,
      `미완성 이미지 ${result.placeholderAssetCount || 0}`,
      `과도한 공백 ${result.deadSpaceSectionCount || 0}`,
    ].join(" · ");
  }
  return result;
}

function libraryComponentKey(event) {
  const raw = event.dataTransfer?.getData("application/x-promo-component-definition");
  if (!raw) return "";
  try {
    return String(JSON.parse(raw)?.componentKey || "");
  } catch {
    return String(raw || "");
  }
}

function handlePreviewDragOver(event) {
  if (![...(event.dataTransfer?.types || [])].includes("application/x-promo-component-definition")) return;
  event.preventDefault();
  event.dataTransfer.dropEffect = "copy";
}

function handlePreviewDrop(event) {
  const componentKey = libraryComponentKey(event);
  if (!componentKey) return;
  event.preventDefault();
  const sectionElement = event.target instanceof Element
    ? event.target.closest("[data-section-key]")
    : null;
  const sectionKey = sectionElement?.getAttribute("data-section-key")
    || props.selectedSection?.sectionKey
    || "";
  if (sectionKey) emit("drop-library-component", componentKey, sectionKey);
}

defineExpose({ finishTextEdit, getStageElement, inspectCollisions, scrollToSection, updateSelectionRect });
</script>

<template>
  <section class="preview-panel">
    <div class="preview-toolbar">
      <div class="preview-title-group">
        <strong>{{ editorContext.canvasTitle || "Live Preview" }}</strong>
        <small>{{ templateIdentityLabel }}</small>
        <small class="preview-save-target">저장 대상: {{ editorContext.saveTargetLabel }}</small>
        <small v-if="editorContext.readOnly" class="preview-readonly-state">읽기 전용</small>
        <button
          v-if="capabilities.canAutoRegister"
          class="auto-register-action"
          type="button"
          :disabled="autoRegisterPending"
          @click="emit('request-auto-register')"
        >
          {{ autoRegisterPending ? "등록 중" : "자동등록" }}
        </button>
        <small v-if="capabilities.canEditPromoContent" class="preview-edit-hint">미리보기 요소를 선택해 내용을 입력하세요.</small>
        <small v-if="autoRegisterMessage" class="auto-register-message" role="status">{{ autoRegisterMessage }}</small>
        <div v-if="editorContext.isAiDocument && capabilities.canMutate" class="collision-actions">
          <button type="button" @click="inspectCollisions(false)">품질 확인</button>
          <button type="button" class="is-primary" @click="inspectCollisions(true)">겹침 보정</button>
          <small v-if="collisionMessage" role="status">{{ collisionMessage }}</small>
        </div>
      </div>
      <EditorPreviewControls
        :guide-mode="guideMode"
        :viewport="viewport"
        @update:guide-mode="(value) => emit('update:guide-mode', value)"
        @update:viewport="(value) => emit('update:viewport', value)"
      >
        <template #tokens>
          <fieldset v-if="capabilities.canEditDesignTokens" class="global-token-menu">
            <legend>미리보기 디자인 토큰</legend>
            <select
              class="global-token-select"
              :value="selectedDesignTokenVersionId"
              :disabled="!designTokenSets.length"
              aria-label="템플릿 디자인 토큰"
              @change="emit('update-design-token', $event.target.value)"
            >
              <option value="" disabled>디자인 토큰을 선택하세요</option>
              <option
                v-for="tokenSet in designTokenSets"
                :key="tokenSet.versionId"
                :value="tokenSet.versionId"
              >
                {{ tokenSet.name }} · v{{ tokenSet.version }}{{ tokenSet.sourceValues?.[0]?.activeTheme ? ` · ${tokenSet.sourceValues[0].activeTheme === "dark" ? "Dark" : "Light"}` : "" }}{{ tokenSet.isDefault ? " · 기본" : "" }}
              </option>
            </select>
          </fieldset>
        </template>
        <template #host-actions>
          <div v-if="editorContext.isAdminLayout" class="admin-layout-actions">
            <input
              :value="layoutChangeNote"
              type="text"
              placeholder="변경 사유"
              aria-label="레이아웃 변경 사유"
              @input="emit('update:layout-change-note', $event.target.value)"
            />
            <button
              type="button"
              :disabled="!capabilities.canSaveTemplateLayout || !editorSnapshot || layoutSaving || template?.status !== 'draft'"
              @click="emit('save-admin-layout')"
            >{{ layoutSaving ? "저장 중" : "초안 저장" }}</button>
          </div>
          <div v-if="editorContext.isSectionPreset" class="admin-layout-actions">
            <input
              :value="layoutChangeNote"
              type="text"
              placeholder="변경 사유"
              aria-label="Layout Preset 변경 사유"
              @input="emit('update:layout-change-note', $event.target.value)"
            />
            <button
              type="button"
              class="is-primary"
              :disabled="!capabilities.canSaveSectionPreset || !editorSnapshot || layoutSaving || template?.status !== 'draft'"
              @click="emit('save-section-preset')"
            >{{ layoutSaving ? "저장 중" : "Preset 저장" }}</button>
          </div>
          <button
            v-if="capabilities.canSaveAiDocument"
            type="button"
            class="is-primary"
            :disabled="!editorSnapshot || aiDocumentSaving"
            @click="emit('save-ai-document')"
          >{{ aiDocumentSaving ? "저장 중" : "AI 문서 저장" }}</button>
          <button
            v-if="capabilities.canOpenWebOutput"
            type="button"
            class="web-output-action"
            :disabled="!editorSnapshot"
            @click="emit('open-output')"
          >Web Output</button>
        </template>
      </EditorPreviewControls>
    </div>
    <div
      ref="previewStageRef"
      class="preview-stage"
      :class="`preview-stage--${viewport}`"
      @click="clearPreviewSelection"
      @dragover="handlePreviewDragOver"
      @drop="handlePreviewDrop"
    >
      <PromoPageRenderer
        ref="rendererRef"
        v-if="rendererSnapshot"
        :key="motionReplayKey"
        :content="rendererSnapshot.content"
        :design-spec="rendererSnapshot.designSpec"
        :assets="rendererSnapshot.assets"
        :motion-spec="rendererSnapshot.motionSpec"
        :section-design-runs="sectionDesignRuns"
        :viewport-override="viewport"
        :editable="capabilities.canMutate"
        :show-guides="guideMode !== 'normal'"
        :outline-mode="guideMode === 'outline'"
        :selected-item-key="selectedStyleKey"
        :selected-item-keys="selectedItemKeys.map((itemKey) => `${selectedSection?.sectionKey}.${itemKey}`)"
        :selected-field-key="selectedFieldStyleKey"
        @select-item="(...args) => emit('select-item', ...args)"
        @open-item-inspector="(...args) => emit('open-item-inspector', ...args)"
        @open-field-inspector="(...args) => emit('open-field-inspector', ...args)"
        @update-item-style="(...args) => emit('update-item-style', ...args)"
        @update-renderer-item-style="(...args) => emit('update-renderer-item-style', ...args)"
        @update-renderer-field-style="(...args) => emit('update-renderer-field-style', ...args)"
        @update-item-content="(...args) => emit('update-item-content', ...args)"
        @select-text-lines="updateSelectedTextLines"
        @update-section-style="(...args) => emit('update-section-style', ...args)"
      />
    </div>
  </section>
</template>
