<script>
import { templateLayoutService } from "../services/template-layout-service.mjs";

export default {
  name: "TemplateLayoutManager",
  props: {
    template: { type: Object, required: true },
    statusLabel: { type: Function, required: true },
    translate: { type: Function, required: true },
  },
  data() {
    return { layoutRevision: null, loading: false, error: "", requestRevision: 0 };
  },
  computed: {
    headingId() {
      return `template-layout-manager-${String(this.template?.id || "none").replace(/[^a-zA-Z0-9_-]/g, "-")}`;
    },
  },
  watch: {
    "template.id": {
      immediate: true,
      handler() {
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
      if (!this.template?.id || this.template.status !== "draft") return;
      globalThis.open(templateLayoutService.editorUrl(this.template.id), "_blank", "noopener");
    },
  },
};
</script>

<template>
  <section class="template-layout-settings" :aria-labelledby="headingId">
    <div class="template-layout-settings-copy">
      <span class="template-layout-settings-eyebrow">{{ translate("admin.templateLayout.eyebrow") }}</span>
      <h3 :id="headingId">{{ translate("admin.templateLayout.title") }}</h3>
      <p>{{ translate("admin.templateLayout.description") }}</p>
      <span class="template-layout-settings-state" :class="'status-' + template.status">
        v{{ template.version }} · {{ statusLabel(template.status) }}<template v-if="layoutRevision"> · {{ translate("admin.templateLayout.revision") }} r{{ layoutRevision }}</template>
      </span>
      <small v-if="loading">{{ translate("admin.templateLayout.loading") }}</small>
      <small v-else-if="error" class="field-error">{{ error }}</small>
    </div>
    <div class="template-layout-settings-actions">
      <button
        class="tiny-button primary template-layout-settings-button"
        type="button"
        :disabled="template.status !== 'draft'"
        @click="openEditor"
      >{{ translate("admin.templateLayout.openEditor") }}</button>
      <small v-if="template.status !== 'draft'">{{ translate("admin.templateLayout.readOnlyHelp") }}</small>
      <small v-else>{{ translate("admin.templateLayout.draftHelp") }}</small>
    </div>
  </section>
</template>
