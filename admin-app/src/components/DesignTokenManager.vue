<script>
import { createPromoTokenRuntimeStyle } from "../../../shared/promo-token-runtime.mjs";
import { designTokenService } from "../services/design-token-service.mjs";

const MAX_CSV_SIZE = 2 * 1024 * 1024;

function csvCell(value) {
  const text = String(value ?? "");
  return /[",\r\n]/.test(text) ? `"${text.replaceAll('"', '""')}"` : text;
}

export default {
  name: "DesignTokenManager",
  props: {
    translate: { type: Function, required: true },
  },
  emits: ["status", "token-sets-changed"],
  data() {
    return {
      loading: false,
      saving: false,
      error: "",
      tokenSets: [],
      definitions: [],
      templates: [],
      selectedSetId: "",
      selectedVersionId: "",
      detail: null,
      editorValues: [],
      originalValues: {},
      metadata: { name: "", description: "", changeNote: "" },
      createForm: { name: "", description: "" },
      cloneForm: { name: "", description: "" },
      showCreate: false,
      showSettings: false,
      showClone: false,
      searchTerm: "",
      categoryFilter: "",
      changedOnly: false,
      selectedTemplateIds: [],
      csvSourceName: "",
      importErrors: [],
      validationErrors: [],
      previewViewport: "desktop",
      usage: { templates: [], aiRuns: { total: 0, active: 0 } },
      histories: [],
    };
  },
  computed: {
    selectedSet() {
      return this.tokenSets.find((item) => item.id === this.selectedSetId) || null;
    },
    activeVersionId() {
      return this.selectedSet?.activeVersion?.id || "";
    },
    workingVersionId() {
      return this.detail?.status === "draft" ? this.detail.id : "";
    },
    categories() {
      return [...new Set(this.editorValues.map((item) => item.category || "general"))].sort();
    },
    filteredValues() {
      const query = this.searchTerm.trim().toLowerCase();
      return this.editorValues.filter((item) => {
        if (this.categoryFilter && item.category !== this.categoryFilter) return false;
        if (this.changedOnly && !this.isTokenChanged(item)) return false;
        return !query || [item.tokenKey, item.semanticRole, item.category]
          .some((value) => String(value || "").toLowerCase().includes(query));
      });
    },
    isDirty() {
      return this.editorValues.some((item) => this.isTokenChanged(item));
    },
    activeTemplates() {
      return this.templates.filter((template) => template.status === "active");
    },
    previewStyle() {
      return {
        ...createPromoTokenRuntimeStyle(this.tokenPayload(), {
          background: "var(--app-surface)",
          text: "var(--app-ink)",
          muted: "var(--app-muted)",
          accent: "var(--app-accent)",
          radius: "var(--app-radius-small)",
        }),
        "--promo-width": "1280px",
      };
    },
  },
  mounted() {
    globalThis.addEventListener("beforeunload", this.preventUnsavedExit);
    this.reload();
  },
  beforeUnmount() {
    globalThis.removeEventListener("beforeunload", this.preventUnsavedExit);
  },
  methods: {
    t(key, params) {
      return this.translate(key, params);
    },
    notify(key, params) {
      this.$emit("status", this.t(key, params));
    },
    async run(action) {
      this.saving = true;
      this.error = "";
      try {
        return await action();
      } catch (error) {
        this.error = error.message;
        throw error;
      } finally {
        this.saving = false;
      }
    },
    async reload(preferredSetId = this.selectedSetId) {
      this.loading = true;
      this.error = "";
      try {
        const [setsResult, catalogResult, templatesResult] = await Promise.all([
          designTokenService.list(),
          designTokenService.catalog(),
          designTokenService.listTemplates(),
        ]);
        this.tokenSets = setsResult.tokenSets || [];
        this.definitions = catalogResult.definitions || [];
        this.templates = templatesResult.templates || [];
        this.selectedSetId = this.tokenSets.some((set) => set.id === preferredSetId)
          ? preferredSetId
          : (this.tokenSets[0]?.id || "");
        await this.selectSet(this.selectedSetId, true);
        this.$emit("token-sets-changed");
      } catch (error) {
        this.error = error.message;
      } finally {
        this.loading = false;
      }
    },
    async selectSet(setId, force = false) {
      if (!force && setId !== this.selectedSetId && this.isDirty
        && !globalThis.confirm(this.t("admin.designToken.unsavedConfirm"))) return;
      this.selectedSetId = setId;
      const set = this.selectedSet;
      this.metadata = {
        name: set?.name || "",
        description: set?.description || "",
        changeNote: "",
      };
      this.selectedTemplateIds = [];
      const versionId = set?.draftVersion?.id || set?.activeVersion?.id || set?.versions?.[0]?.id || "";
      if (versionId) await this.selectVersion(versionId);
      else this.clearDetail();
    },
    clearDetail() {
      this.selectedVersionId = "";
      this.detail = null;
      this.editorValues = this.definitions.map((definition) => ({ ...definition, value: "", metadata: {} }));
      this.originalValues = Object.fromEntries(this.editorValues.map((item) => [item.tokenKey, item.value]));
      this.usage = { templates: [], aiRuns: { total: 0, active: 0 } };
      this.histories = [];
    },
    async selectVersion(versionId) {
      this.selectedVersionId = versionId;
      const result = await designTokenService.detail(versionId);
      this.detail = result.tokenSet;
      this.usage = result.usage || { templates: [], aiRuns: { total: 0, active: 0 } };
      this.histories = result.histories || [];
      const values = new Map((this.detail.values || []).map((item) => [item.tokenKey, item]));
      this.editorValues = this.definitions.map((definition) => ({
        ...definition,
        ...(values.get(definition.tokenKey) || {}),
        value: values.get(definition.tokenKey)?.value || "",
        metadata: values.get(definition.tokenKey)?.metadata || {},
      }));
      this.originalValues = Object.fromEntries(this.editorValues.map((item) => [item.tokenKey, item.value]));
      this.importErrors = [];
      this.validationErrors = [];
    },
    tokenPayload() {
      return this.editorValues.map((item) => ({
        tokenKey: item.tokenKey,
        value: item.value,
        metadata: item.metadata || {},
      }));
    },
    isTokenChanged(item) {
      return String(item.value || "") !== String(this.originalValues[item.tokenKey] || "");
    },
    restoreToken(item) {
      item.value = this.originalValues[item.tokenKey] || "";
    },
    restoreAll() {
      this.editorValues.forEach(this.restoreToken);
    },
    fieldType(item) {
      return item.valueType === "color" ? "color" : "text";
    },
    hasTemplateDraft(template) {
      return this.templates.some((candidate) => (
        candidate.templateKey === template.templateKey && candidate.status === "draft"
      ));
    },
    async publish(templateIds) {
      this.validationErrors = [];
      try {
        const result = await this.run(() => designTokenService.publish({
          tokenSetId: this.selectedSetId,
          sourceVersionId: this.activeVersionId,
          workingVersionId: this.workingVersionId,
          tokens: this.tokenPayload(),
          templateIds,
          sourceName: this.csvSourceName,
          changeNote: this.metadata.changeNote,
        }));
        await this.reload(this.selectedSetId);
        this.notify(templateIds.length
          ? "admin.designToken.saveApplySuccess"
          : "admin.designToken.saveSuccess", { count: result.templates?.length || 0 });
      } catch (error) {
        this.validationErrors = error.details?.errors || [];
      }
    },
    save() {
      return this.publish([]);
    },
    saveAndApply() {
      if (!this.selectedTemplateIds.length) {
        this.error = this.t("admin.designToken.selectTemplateRequired");
        return;
      }
      return this.publish(this.selectedTemplateIds);
    },
    async onCsvFile(event) {
      this.importErrors = [];
      const file = event.target.files?.[0];
      event.target.value = "";
      if (!file) return;
      if (!/\.csv$/i.test(file.name) && file.type !== "text/csv") {
        this.error = this.t("admin.designToken.csvTypeError");
        return;
      }
      if (file.size > MAX_CSV_SIZE) {
        this.error = this.t("admin.designToken.csvSizeError");
        return;
      }
      this.csvSourceName = file.name;
      try {
        const csvText = (await file.text()).replace(/^\uFEFF/, "");
        const result = await this.run(() => designTokenService.importCsv({
          tokenSetId: this.selectedSetId,
          csvText,
          sourceName: file.name,
          dryRun: true,
        }));
        const imported = new Map((result.tokens || []).map((item) => [item.tokenKey, item]));
        this.editorValues.forEach((item) => {
          if (imported.has(item.tokenKey)) {
            item.value = imported.get(item.tokenKey).value;
            item.metadata = imported.get(item.tokenKey).metadata || {};
          }
        });
        this.notify("admin.designToken.importValidated");
      } catch (error) {
        this.importErrors = error.details?.errors || [];
      }
    },
    exportCsv() {
      const lines = [
        ["token", "value", "label", "category"],
        ...this.editorValues.map((item) => [
          item.tokenKey, item.value, item.semanticRole || "", item.category || "",
        ]),
      ].map((row) => row.map(csvCell).join(","));
      const blob = new Blob([`\uFEFF${lines.join("\r\n")}`], { type: "text/csv;charset=utf-8" });
      const url = URL.createObjectURL(blob);
      const anchor = document.createElement("a");
      anchor.href = url;
      anchor.download = `${this.selectedSet?.setKey || "promo-design-tokens"}.csv`;
      anchor.click();
      URL.revokeObjectURL(url);
    },
    async createSet() {
      const result = await this.run(() => designTokenService.createSet(this.createForm));
      this.showCreate = false;
      this.createForm = { name: "", description: "" };
      await this.reload(result.tokenSet.id);
      this.notify("admin.designToken.created");
    },
    async saveMetadata() {
      await this.run(() => designTokenService.updateMetadata({
        tokenSetId: this.selectedSetId,
        ...this.metadata,
      }));
      await this.reload(this.selectedSetId);
      this.notify("admin.designToken.metadataSaved");
    },
    async cloneSet() {
      const result = await this.run(() => designTokenService.cloneSet({
        sourceVersionId: this.selectedVersionId,
        ...this.cloneForm,
      }));
      this.showClone = false;
      this.cloneForm = { name: "", description: "" };
      await this.reload(result.tokenSet.tokenSetId);
      this.notify("admin.designToken.cloned");
    },
    async archiveSet() {
      await this.run(() => designTokenService.archive({ tokenSetId: this.selectedSetId }));
      await this.reload("");
      this.notify("admin.designToken.archived");
    },
    preventUnsavedExit(event) {
      if (!this.isDirty) return;
      event.preventDefault();
      event.returnValue = "";
    },
  },
};
</script>

<template>
  <section class="design-token-manager">
    <div class="design-token-toolbar">
      <div>
        <h2>{{ t("admin.designToken.title") }}</h2>
        <p>{{ t("admin.designToken.scopeNotice") }}</p>
      </div>
      <div class="design-token-actions">
        <button class="tiny-button" type="button" :disabled="loading" @click="reload()">{{ t("common.action.refresh") }}</button>
        <button class="tiny-button primary" type="button" @click="showCreate = !showCreate">{{ t("admin.designToken.addSet") }}</button>
      </div>
    </div>

    <div v-if="error" class="outline-item danger-state">{{ error }}</div>
    <form v-if="showCreate" class="design-token-create" @submit.prevent="createSet">
      <label class="field"><span>{{ t("admin.designToken.name") }}</span><input v-model.trim="createForm.name" required></label>
      <label class="field"><span>{{ t("admin.designToken.description") }}</span><input v-model.trim="createForm.description"></label>
      <button class="tiny-button primary" type="submit" :disabled="saving">{{ t("common.action.create") }}</button>
    </form>

    <div class="design-token-grid">
      <aside class="design-token-column design-token-list">
        <strong>{{ t("admin.designToken.setList") }}</strong>
        <button
          v-for="set in tokenSets"
          :key="set.id"
          class="design-token-set"
          :class="{ active: selectedSetId === set.id }"
          type="button"
          @click="selectSet(set.id)"
        >
          <span>{{ set.name }}</span>
          <small>{{ set.setKey }}</small>
          <small>v{{ set.draftVersion?.version || set.activeVersion?.version || set.version }}</small>
        </button>
        <div v-if="!loading && !tokenSets.length" class="empty-state">{{ t("admin.designToken.emptySets") }}</div>
      </aside>

      <main class="design-token-column design-token-editor">
        <template v-if="selectedSet && detail">
          <div class="design-token-table-toolbar">
            <input v-model.trim="searchTerm" type="search" :placeholder="t('admin.designToken.search')">
            <select v-model="categoryFilter">
              <option value="">{{ t("admin.designToken.allCategories") }}</option>
              <option v-for="category in categories" :key="category" :value="category">{{ category }}</option>
            </select>
            <label class="design-token-check"><input v-model="changedOnly" type="checkbox"> {{ t("admin.designToken.changedOnly") }}</label>
            <button class="tiny-button" type="button" :disabled="!isDirty" @click="restoreAll">{{ t("common.action.reset") }}</button>
          </div>

          <div class="design-token-table-wrap">
            <table class="design-token-table">
              <thead><tr>
                <th>{{ t("admin.designToken.category") }}</th>
                <th>{{ t("admin.designToken.token") }}</th>
                <th>{{ t("admin.designToken.type") }}</th>
                <th>{{ t("admin.designToken.value") }}</th>
                <th>{{ t("admin.designToken.status") }}</th>
              </tr></thead>
              <tbody>
                <tr v-for="item in filteredValues" :key="item.tokenKey" class="design-token-value" :class="{ changed: isTokenChanged(item) }">
                  <td>{{ item.category }}</td>
                  <td><code>{{ item.tokenKey }}</code><small>{{ item.semanticRole }}</small></td>
                  <td>{{ item.valueType }}</td>
                  <td>
                    <span class="design-token-value-control">
                      <input v-if="fieldType(item) === 'color'" v-model="item.value" type="color" :disabled="!item.editable">
                      <input v-model="item.value" type="text" :disabled="!item.editable">
                    </span>
                  </td>
                  <td>
                    <span>{{ t(isTokenChanged(item) ? "admin.designToken.changed" : "admin.designToken.normal") }}</span>
                    <button v-if="isTokenChanged(item)" class="text-button" type="button" @click="restoreToken(item)">{{ t("common.action.reset") }}</button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <div v-if="validationErrors.length || importErrors.length" class="design-token-errors">
            <strong>{{ t("admin.designToken.validationErrors") }}</strong>
            <span v-for="item in [...validationErrors, ...importErrors]" :key="`${item.tokenKey}-${item.message}`">{{ item.tokenKey }}: {{ item.message }}</span>
          </div>

          <div class="design-token-actions sticky-actions">
            <label class="tiny-button file-button">
              {{ t("admin.designToken.csvImport") }}
              <input type="file" accept=".csv,text/csv" @change="onCsvFile">
            </label>
            <button class="tiny-button" type="button" @click="exportCsv">{{ t("admin.designToken.csvExport") }}</button>
            <span v-if="csvSourceName" class="source-name">{{ csvSourceName }}</span>
            <button class="tiny-button" type="button" :disabled="saving || !isDirty" @click="save">{{ t("common.action.save") }}</button>
            <button class="tiny-button primary" type="button" :disabled="saving || !selectedTemplateIds.length" @click="saveAndApply">{{ t("admin.designToken.saveAndApply") }}</button>
          </div>
        </template>
      </main>

      <aside class="design-token-column design-token-inspector">
        <template v-if="selectedSet && detail">
          <section class="design-token-section">
            <h3>{{ t("admin.designToken.preview") }}</h3>
            <div class="design-token-actions">
              <button class="tiny-button" :class="{ primary: previewViewport === 'desktop' }" type="button" @click="previewViewport = 'desktop'">{{ t("admin.designToken.desktop") }}</button>
              <button class="tiny-button" :class="{ primary: previewViewport === 'mobile' }" type="button" @click="previewViewport = 'mobile'">{{ t("admin.designToken.mobile") }}</button>
            </div>
            <div class="design-token-preview-stage" :class="`is-${previewViewport}`">
              <div class="promo-renderer" :style="previewStyle">
                <section class="rendered-section">
                  <div class="rendered-section__inner">
                    <small class="rendered-empty">{{ t("admin.designToken.previewEyebrow") }}</small>
                    <h4 class="rendered-text rendered-text--title">{{ t("admin.designToken.previewTitle") }}</h4>
                    <p>{{ t("admin.designToken.previewBody") }}</p>
                    <a class="rendered-cta">{{ t("admin.designToken.previewButton") }}</a>
                  </div>
                </section>
              </div>
            </div>
          </section>

          <section class="design-token-section">
            <h3>{{ t("admin.designToken.applyTemplates") }}</h3>
            <label v-for="template in activeTemplates" :key="template.id" class="template-choice" :class="{ disabled: hasTemplateDraft(template) }">
              <input v-model="selectedTemplateIds" type="checkbox" :value="template.id" :disabled="hasTemplateDraft(template)">
              <span>{{ template.name }} <small>v{{ template.version }}</small></span>
              <small v-if="hasTemplateDraft(template)">{{ t("admin.designToken.templateDraftConflict") }}</small>
            </label>
          </section>

          <details class="design-token-section">
            <summary>{{ t("admin.designToken.settings") }}</summary>
            <label class="field"><span>{{ t("admin.designToken.name") }}</span><input v-model="metadata.name"></label>
            <label class="field"><span>{{ t("admin.designToken.description") }}</span><textarea v-model="metadata.description" rows="2"></textarea></label>
            <label class="field"><span>{{ t("admin.designToken.changeNote") }}</span><input v-model="metadata.changeNote"></label>
            <div class="design-token-actions">
              <button class="tiny-button" type="button" :disabled="saving" @click="saveMetadata">{{ t("common.action.save") }}</button>
              <button class="tiny-button" type="button" @click="showClone = !showClone">{{ t("common.action.duplicate") }}</button>
              <button class="tiny-button danger" type="button" :disabled="saving || usage.templates.length || usage.aiRuns.active" @click="archiveSet">{{ t("common.action.archive") }}</button>
            </div>
            <form v-if="showClone" class="design-token-clone" @submit.prevent="cloneSet">
              <label class="field"><span>{{ t("admin.designToken.cloneName") }}</span><input v-model.trim="cloneForm.name" required></label>
              <label class="field"><span>{{ t("admin.designToken.description") }}</span><input v-model.trim="cloneForm.description"></label>
              <button class="tiny-button primary" type="submit" :disabled="saving">{{ t("common.action.duplicate") }}</button>
            </form>
          </details>
        </template>
      </aside>
    </div>
  </section>
</template>

<style scoped>
.design-token-manager { display: grid; gap: var(--app-space-4); min-height: 0; }
.design-token-toolbar, .design-token-actions { display: flex; align-items: center; justify-content: space-between; gap: var(--app-space-3); flex-wrap: wrap; }
.design-token-toolbar p { margin: var(--app-space-1) 0 0; color: var(--app-sub); }
.design-token-create { display: grid; grid-template-columns: minmax(12rem, 1fr) minmax(18rem, 2fr) auto; gap: var(--app-space-3); align-items: end; }
.design-token-grid { display: grid; grid-template-columns: minmax(13rem, .65fr) minmax(34rem, 2fr) minmax(19rem, .9fr); gap: var(--app-panel-gap); min-height: 42rem; }
.design-token-column { min-width: 0; overflow: auto; border: var(--app-border-width) solid var(--app-line); border-radius: var(--app-radius); padding: var(--app-space-3); background: var(--app-panel); }
.design-token-list, .design-token-editor, .design-token-inspector { display: flex; flex-direction: column; gap: var(--app-space-3); }
.design-token-set { display: grid; gap: var(--app-space-1); padding: var(--app-space-3); text-align: left; border: var(--app-border-width) solid var(--app-line); border-radius: var(--app-radius-small); background: transparent; color: var(--app-ink); }
.design-token-set.active { border-color: var(--app-accent); background: var(--app-accent-soft); }
.design-token-set small, .design-token-value small { display: block; color: var(--app-muted); }
.design-token-table-toolbar { display: grid; grid-template-columns: minmax(12rem, 1fr) minmax(10rem, auto) auto auto; gap: var(--app-space-2); align-items: center; }
.design-token-check { display: inline-flex; gap: var(--app-space-2); align-items: center; white-space: nowrap; }
.design-token-table-wrap { overflow: auto; border: var(--app-border-width) solid var(--app-line); border-radius: var(--app-radius-small); }
.design-token-table { width: 100%; border-collapse: collapse; }
.design-token-table th, .design-token-table td { padding: var(--app-space-2); border-bottom: var(--app-border-width) solid var(--app-line); text-align: left; vertical-align: middle; }
.design-token-table th { position: sticky; top: 0; z-index: 1; background: var(--app-panel-subtle, var(--app-panel)); }
.design-token-value.changed { background: var(--app-warning-soft, var(--app-accent-soft)); }
.design-token-value-control { display: grid; grid-template-columns: auto minmax(9rem, 1fr); gap: var(--app-space-2); }
.design-token-value-control input[type="color"] { width: 2.75rem; padding: 0; }
.text-button { margin-left: var(--app-space-1); border: 0; background: transparent; color: var(--app-accent); text-decoration: underline; }
.sticky-actions { position: sticky; z-index: 2; bottom: 0; padding: var(--app-space-2); background: var(--app-panel); border-top: var(--app-border-width) solid var(--app-line); }
.file-button { position: relative; overflow: hidden; cursor: pointer; }
.file-button input { position: absolute; inline-size: 1px; block-size: 1px; opacity: 0; }
.source-name { color: var(--app-muted); font-size: var(--app-font-size-small); }
.design-token-errors { display: grid; gap: var(--app-space-1); color: var(--app-danger); }
.design-token-section { display: grid; gap: var(--app-space-2); padding: var(--app-space-3); border: var(--app-border-width) solid var(--app-line); border-radius: var(--app-radius-small); }
.design-token-section h3, .design-token-section summary { margin: 0; font-weight: var(--app-font-weight-strong); }
.design-token-preview-stage { width: 100%; overflow: auto; }
.design-token-preview-stage.is-mobile .promo-renderer { width: min(23.4375rem, 100%); margin-inline: auto; }
.promo-renderer { min-height: 20rem; }
.rendered-section__inner { padding: var(--app-space-4); }
.rendered-text--title { margin-block: var(--app-space-2); font-size: var(--promo-title-size); color: var(--promo-ink); }
.template-choice { display: grid; grid-template-columns: auto 1fr; gap: var(--app-space-2); align-items: start; }
.template-choice > small { grid-column: 2; color: var(--app-warning-ink, var(--app-muted)); }
.template-choice.disabled { opacity: .64; }
@media (max-width: 1023px) {
  .design-token-grid, .design-token-create, .design-token-table-toolbar { grid-template-columns: 1fr; }
  .design-token-column { max-height: none; }
}
</style>
