<script>
import { templateLayoutService } from "../services/template-layout-service.mjs";
import VisualEditorDialogHost from "./VisualEditorDialogHost.vue";

export default {
  name: "TemplateLayoutManager",
  components: { VisualEditorDialogHost },
  props: {
    template: { type: Object, required: true },
    statusLabel: { type: Function, required: true },
    translate: { type: Function, required: true },
  },
  emits: ["layout-saved"],
  data() {
    return {
      layoutRevision: null,
      loading: false,
      error: "",
      requestRevision: 0,
      frameRevision: 0,
      editorOpen: false,
    };
  },
  computed: {
    headingId() {
      return `template-layout-manager-${String(this.template?.id || "none").replace(/[^a-zA-Z0-9_-]/g, "-")}`;
    },
    editable() {
      return this.template?.status === "draft";
    },
    editorUrl() {
      if (!this.template?.id) return "";
      const url = new URL(templateLayoutService.editorUrl(this.template.id));
      url.searchParams.set("embedded", "1");
      url.searchParams.set("frameRevision", String(this.frameRevision));
      return url.toString();
    },
  },
  watch: {
    "template.id": {
      immediate: true,
      handler() {
        this.editorOpen = false;
        this.loadLayout();
      },
    },
  },
  beforeUnmount() {
    this.requestRevision += 1;
  },
  methods: {
    async loadLayout() {
      const requestRevision = ++this.requestRevision;
      this.layoutRevision = null;
      this.error = "";
      if (!this.template?.id) {
        this.loading = false;
        return;
      }
      this.loading = true;
      try {
        const result = await templateLayoutService.requestLayout(this.template.id);
        if (requestRevision !== this.requestRevision) return;
        this.layoutRevision = Number(result.layout?.layoutRevision || 1);
      } catch (error) {
        if (requestRevision !== this.requestRevision) return;
        this.error = error.message;
      } finally {
        if (requestRevision === this.requestRevision) this.loading = false;
      }
    },
    openEditor() {
      this.frameRevision += 1;
      this.editorOpen = true;
    },
    closeEditor() {
      this.editorOpen = false;
    },
    handleEditorMessage(message) {
      if (message.type !== "promo-admin-layout-saved" || message.templateId !== this.template?.id) return;
      this.layoutRevision = Number(message.layoutRevision || this.layoutRevision || 1);
      this.$emit("layout-saved", message);
    },
  },
};
</script>

<template>
  <section class="template-layout-manager" :aria-labelledby="headingId">
    <div class="template-layout-manager__header">
      <div>
        <span class="template-layout-settings-eyebrow">{{ translate("admin.templateLayout.eyebrow") }}</span>
        <h3 :id="headingId">{{ template.name }} · 템플릿 기본 레이아웃</h3>
        <small>
          v{{ template.version }} · {{ statusLabel(template.status) }}
          <template v-if="layoutRevision"> · {{ translate("admin.templateLayout.revision") }} r{{ layoutRevision }}</template>
        </small>
        <small>저장 범위: 선택한 템플릿의 기본 레이아웃</small>
      </div>
      <button class="tiny-button" type="button" aria-haspopup="dialog" :disabled="loading || !editorUrl" @click="openEditor">
        {{ editable ? "템플릿 기본 레이아웃 편집" : "템플릿 기본 레이아웃 보기" }}
      </button>
    </div>

    <div v-if="error" class="outline-item danger-state" role="alert">
      <strong>템플릿 기본 레이아웃 오류</strong>
      <span>{{ error }}</span>
    </div>

    <visual-editor-dialog-host
      v-if="editorOpen"
      :title="`${template.name} · 템플릿 기본 레이아웃 편집기`"
      :description="`v${template.version} · layout r${layoutRevision || 1}`"
      :editor-url="editorUrl"
      :iframe-title="`${template.name} 템플릿 기본 레이아웃 편집기`"
      save-target-label="선택한 템플릿의 기본 레이아웃"
      :read-only="!editable"
      read-only-message="읽기 전용 템플릿입니다. 왼쪽 템플릿 설정에서 수정하여 초안을 만든 뒤 편집하세요."
      @editor-message="handleEditorMessage"
      @close="closeEditor"
    />
  </section>
</template>

<style scoped>
.template-layout-manager { min-width: 0; display: grid; gap: 12px; }
.template-layout-manager__header { display: flex; justify-content: space-between; align-items: center; gap: 16px; }
.template-layout-manager__header > div { min-width: 0; display: grid; gap: 3px; }
.template-layout-manager__header h3 { margin: 0; }
.template-layout-manager__header small { color: var(--app-sub, #667085); }
@media (max-width: 900px) {
  .template-layout-manager__header { align-items: flex-start; flex-direction: column; }
}
</style>
