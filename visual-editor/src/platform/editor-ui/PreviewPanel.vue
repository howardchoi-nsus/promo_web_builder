<script setup>
import { ref } from "vue";
import PromoPageRenderer from "../../PromoPageRenderer.vue";
import EditorPreviewControls from "./EditorPreviewControls.vue";

defineProps({
  rendererSnapshot: { type: Object, default: null },
  sectionDesignRuns: { type: Object, default: () => ({}) },
  guidesVisible: { type: Boolean, default: true },
  viewport: { type: String, default: "desktop" },
  templateIdentityLabel: { type: String, default: "" },
  capabilities: { type: Object, required: true },
  autoRegisterPending: { type: Boolean, default: false },
  autoRegisterMessage: { type: String, default: "" },
  editorHistory: { type: Object, required: true },
  designTokenSets: { type: Array, default: () => [] },
  selectedDesignTokenVersionId: { type: String, default: "" },
  designTokenSaving: { type: Boolean, default: false },
  layoutChangeNote: { type: String, default: "" },
  layoutSaving: { type: Boolean, default: false },
  editorSnapshot: { type: Object, default: null },
  template: { type: Object, default: null },
  selectedStyleKey: { type: String, default: "" },
  selectedItemKeys: { type: Array, default: () => [] },
  selectedSection: { type: Object, default: null },
});

const emit = defineEmits([
  "update:guides-visible",
  "update:viewport",
  "update:layout-change-note",
  "request-auto-register",
  "undo",
  "redo",
  "update-design-token",
  "save-admin-layout",
  "open-output",
  "select-item",
  "update-item-style",
  "update-renderer-item-style",
  "update-item-content",
  "update-section-style",
]);

const previewStageRef = ref(null);

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

defineExpose({ getStageElement, scrollToSection });
</script>

<template>
  <section class="preview-panel">
    <div class="preview-toolbar">
      <div class="preview-title-group">
        <strong>Live Preview</strong>
        <small>{{ templateIdentityLabel }}</small>
        <button
          v-if="capabilities.canEditPromoContent"
          class="auto-register-action"
          type="button"
          :disabled="autoRegisterPending"
          @click="emit('request-auto-register')"
        >
          {{ autoRegisterPending ? "등록 중" : "자동등록" }}
        </button>
        <small v-if="capabilities.canEditPromoContent" class="preview-edit-hint">미리보기 요소를 선택해 내용을 입력하세요.</small>
        <small v-if="autoRegisterMessage" class="auto-register-message" role="status">{{ autoRegisterMessage }}</small>
      </div>
      <EditorPreviewControls
        :guides-visible="guidesVisible"
        :viewport="viewport"
        :can-undo="editorHistory.canUndo"
        :can-redo="editorHistory.canRedo"
        @update:guides-visible="(value) => emit('update:guides-visible', value)"
        @update:viewport="(value) => emit('update:viewport', value)"
        @undo="emit('undo')"
        @redo="emit('redo')"
      >
        <template #tokens>
          <fieldset v-if="capabilities.canEditTemplateDefaults" class="global-token-menu">
            <legend>디자인 토큰</legend>
            <select
              class="global-token-select"
              :value="selectedDesignTokenVersionId"
              :disabled="designTokenSaving || template?.status !== 'draft' || !designTokenSets.length"
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
          <div v-if="capabilities.canSaveTemplateLayout" class="admin-layout-actions">
            <input
              :value="layoutChangeNote"
              type="text"
              placeholder="변경 사유"
              aria-label="레이아웃 변경 사유"
              @input="emit('update:layout-change-note', $event.target.value)"
            />
            <button
              type="button"
              :disabled="!editorSnapshot || layoutSaving || designTokenSaving || template?.status !== 'draft'"
              @click="emit('save-admin-layout', false)"
            >{{ layoutSaving ? "저장 중" : "초안 저장" }}</button>
            <button
              type="button"
              class="is-primary"
              :disabled="!editorSnapshot || layoutSaving || designTokenSaving || template?.status !== 'draft'"
              @click="emit('save-admin-layout', true)"
            >저장 후 활성화</button>
          </div>
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
        :selected-item-keys="selectedItemKeys.map((itemKey) => `${selectedSection?.sectionKey}.${itemKey}`)"
        @select-item="(...args) => emit('select-item', ...args)"
        @update-item-style="(...args) => emit('update-item-style', ...args)"
        @update-renderer-item-style="(...args) => emit('update-renderer-item-style', ...args)"
        @update-item-content="(...args) => emit('update-item-content', ...args)"
        @update-section-style="(...args) => emit('update-section-style', ...args)"
      />
    </div>
  </section>
</template>
