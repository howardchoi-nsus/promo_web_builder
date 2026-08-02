<script>
import { templateLayoutService } from "../services/template-layout-service.mjs";

export default {
  name: "TemplateLayoutManager",
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
      frameLoading: true,
      error: "",
      requestRevision: 0,
      frameRevision: 0,
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
        this.frameLoading = true;
        this.loadLayout();
      },
    },
  },
  mounted() {
    globalThis.addEventListener("message", this.handleEditorMessage);
  },
  beforeUnmount() {
    this.requestRevision += 1;
    globalThis.removeEventListener("message", this.handleEditorMessage);
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
    reloadEditor() {
      this.frameLoading = true;
      this.frameRevision += 1;
      this.loadLayout();
    },
    handleFrameLoad() {
      this.frameLoading = false;
    },
    handleEditorMessage(event) {
      if (event.origin !== globalThis.location.origin) return;
      if (event.source !== this.$refs.editorFrame?.contentWindow) return;
      const message = event.data || {};
      if (message.type !== "promo-admin-layout-saved" || message.templateId !== this.template?.id) return;
      this.layoutRevision = Number(message.layoutRevision || this.layoutRevision || 1);
      this.$emit("layout-saved", message);
    },
  },
};
</script>

<template>
  <section class="template-live-preview" :aria-labelledby="headingId">
    <div class="template-live-preview__header">
      <div>
        <span class="template-layout-settings-eyebrow">{{ translate("admin.templateLayout.eyebrow") }}</span>
        <h3 :id="headingId">{{ template.name }} Live Preview</h3>
        <small>
          v{{ template.version }} · {{ statusLabel(template.status) }}
          <template v-if="layoutRevision"> · {{ translate("admin.templateLayout.revision") }} r{{ layoutRevision }}</template>
        </small>
      </div>
      <button class="tiny-button" type="button" :disabled="loading" @click="reloadEditor">새로고침</button>
    </div>

    <div v-if="error" class="outline-item danger-state" role="alert">
      <strong>Live Preview 오류</strong>
      <span>{{ error }}</span>
    </div>

    <div class="template-live-preview__frame-wrap" :aria-busy="frameLoading ? 'true' : 'false'">
      <iframe
        v-if="editorUrl"
        ref="editorFrame"
        :key="editorUrl"
        class="template-live-preview__frame"
        :class="{ 'is-readonly': !editable }"
        :src="editorUrl"
        :title="`${template.name} 템플릿 Live Preview 편집기`"
        @load="handleFrameLoad"
      ></iframe>
      <div v-if="frameLoading" class="template-live-preview__loading" role="status">Live Preview를 불러오는 중입니다.</div>
      <div v-if="!editable && !frameLoading" class="template-live-preview__readonly">
        <strong>읽기 전용 템플릿입니다.</strong>
        <span>왼쪽 템플릿 설정에서 수정하여 초안을 만든 뒤 섹션과 컴포넌트를 편집하세요.</span>
      </div>
    </div>
  </section>
</template>

<style scoped>
.template-live-preview {
  min-width: 0;
  display: grid;
  gap: 12px;
}
.template-live-preview__header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 16px;
}
.template-live-preview__header > div {
  min-width: 0;
  display: grid;
  gap: 3px;
}
.template-live-preview__header h3 {
  margin: 0;
}
.template-live-preview__header small {
  color: var(--app-sub, #667085);
}
.template-live-preview__frame-wrap {
  position: relative;
  min-width: 0;
  height: clamp(720px, calc(100vh - 270px), 1040px);
  border: 1px solid var(--app-line, #d8dde7);
  border-radius: 10px;
  overflow: hidden;
  background: var(--app-bg, #f5f7fb);
}
.template-live-preview__frame {
  width: 100%;
  height: 100%;
  border: 0;
  display: block;
}
.template-live-preview__frame.is-readonly {
  pointer-events: none;
}
.template-live-preview__loading,
.template-live-preview__readonly {
  position: absolute;
  inset: 0;
  display: grid;
  place-content: center;
  justify-items: center;
  gap: 6px;
  padding: 24px;
  text-align: center;
  background: color-mix(in srgb, var(--app-panel, #fff) 88%, transparent);
  color: var(--app-sub, #667085);
  z-index: 3;
}
.template-live-preview__readonly strong {
  color: var(--app-ink, #101828);
}
.template-live-preview__readonly {
  inset: 12px 12px auto;
  display: flex;
  place-content: initial;
  justify-items: initial;
  justify-content: center;
  flex-wrap: wrap;
  border: 1px solid var(--app-line-strong, #b7bfcc);
  border-radius: 8px;
  padding: 10px 14px;
  background: var(--app-panel, #fff);
  box-shadow: 0 8px 24px rgba(16, 24, 40, 0.12);
}
.template-live-preview__readonly span {
  max-width: 440px;
  line-height: 1.5;
}
@media (max-width: 900px) {
  .template-live-preview__header {
    align-items: flex-start;
    flex-direction: column;
  }
  .template-live-preview__frame-wrap {
    height: 760px;
  }
}
</style>
