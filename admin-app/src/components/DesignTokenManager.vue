<script>
import { designTokenService } from "../services/design-token-service.mjs";

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
      selectedSetId: "",
      selectedVersionId: "",
      detail: null,
      usage: { templates: [], aiRuns: { total: 0, active: 0 } },
      histories: [],
      editorValues: [],
      metadata: { name: "", description: "", changeNote: "" },
      createForm: { name: "", description: "" },
      showCreate: false,
      showClone: false,
      cloneForm: { name: "", description: "" },
      csvText: "",
      csvSourceName: "",
      importErrors: [],
      validationErrors: [],
      templates: [],
      selectedTemplateId: "",
      compareVersionId: "",
      compareDetail: null,
      previewViewport: "desktop",
      originalValuesJson: "[]",
    };
  },
  computed: {
    selectedSet() {
      return this.tokenSets.find((item) => item.id === this.selectedSetId) || null;
    },
    selectedVersion() {
      return this.selectedSet?.versions?.find((item) => item.id === this.selectedVersionId) || null;
    },
    isDraft() {
      return this.detail?.status === "draft";
    },
    groupedValues() {
      const groups = new Map();
      this.editorValues.forEach((item) => {
        const category = item.category || "general";
        if (!groups.has(category)) groups.set(category, []);
        groups.get(category).push(item);
      });
      return [...groups.entries()].map(([category, values]) => ({ category, values }));
    },
    previewStyle() {
      const tokens = Object.fromEntries(this.editorValues
        .filter((item) => /^--promo-[a-z0-9-]+$/.test(item.tokenKey) && item.value)
        .map((item) => [item.tokenKey, item.value]));
      return {
        "--promo-bg": "var(--promo-surface, var(--app-surface))",
        "--promo-ink": "var(--promo-text, var(--app-ink))",
        "--promo-cta": "var(--promo-accent)",
        "--promo-cta-bg": "var(--promo-accent)",
        "--promo-cta-ink": "var(--app-on-accent)",
        "--promo-cta-radius": "var(--promo-radius)",
        "--promo-width": "1280px",
        ...tokens,
      };
    },
    comparisonStyle() {
      const values = this.compareDetail?.values || [];
      const tokens = Object.fromEntries(values
        .filter((item) => /^--promo-[a-z0-9-]+$/.test(item.tokenKey) && item.value)
        .map((item) => [item.tokenKey, item.value]));
      return { ...this.previewStyle, ...tokens };
    },
    comparisonRows() {
      if (!this.compareDetail) return [];
      const previous = new Map(this.compareDetail.values.map((item) => [item.tokenKey, item.value]));
      return this.editorValues
        .map((item) => ({ tokenKey: item.tokenKey, current: item.value, previous: previous.get(item.tokenKey) || "" }))
        .filter((item) => item.current !== item.previous);
    },
    isDirty() {
      return this.isDraft && JSON.stringify(this.tokenPayload()) !== this.originalValuesJson;
    },
    draftTemplates() {
      return this.templates.filter((template) => template.status === "draft");
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
    notify(key) {
      this.$emit("status", this.t(key));
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
        await this.selectSet(this.selectedSetId);
        this.$emit("token-sets-changed");
      } catch (error) {
        this.error = error.message;
      } finally {
        this.loading = false;
      }
    },
    async selectSet(setId) {
      if (setId !== this.selectedSetId && this.isDirty
        && !globalThis.confirm(this.t("admin.designToken.unsavedConfirm"))) return;
      this.selectedSetId = setId;
      const set = this.selectedSet;
      this.metadata = {
        name: set?.name || "",
        description: set?.description || "",
        changeNote: "",
      };
      const versionId = set?.draftVersion?.id || set?.activeVersion?.id || set?.versions?.[0]?.id || "";
      if (versionId) await this.selectVersion(versionId);
      else this.clearDetail();
    },
    clearDetail() {
      this.selectedVersionId = "";
      this.detail = null;
      this.editorValues = this.definitions.map((definition) => ({ ...definition, value: "", metadata: {} }));
      this.usage = { templates: [], aiRuns: { total: 0, active: 0 } };
      this.histories = [];
      this.validationErrors = [];
      this.originalValuesJson = "[]";
    },
    async selectVersion(versionId) {
      if (versionId !== this.selectedVersionId && this.isDirty
        && !globalThis.confirm(this.t("admin.designToken.unsavedConfirm"))) return;
      this.selectedVersionId = versionId;
      this.error = "";
      try {
        const result = await designTokenService.detail(versionId);
        this.detail = result.tokenSet;
        this.usage = result.usage || { templates: [], aiRuns: { total: 0, active: 0 } };
        this.histories = result.histories || [];
        const valueByKey = new Map((this.detail.values || []).map((value) => [value.tokenKey, value]));
        this.editorValues = this.definitions.map((definition) => ({
          ...definition,
          ...(valueByKey.get(definition.tokenKey) || {}),
          value: valueByKey.get(definition.tokenKey)?.value || "",
          metadata: valueByKey.get(definition.tokenKey)?.metadata || {},
        }));
        this.originalValuesJson = JSON.stringify(this.tokenPayload());
        this.compareVersionId = "";
        this.compareDetail = null;
        this.validationErrors = [];
      } catch (error) {
        this.error = error.message;
      }
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
    async createDraft(sourceVersionId = this.selectedSet?.activeVersion?.id || "") {
      const result = await this.run(() => designTokenService.createDraft({
        tokenSetId: this.selectedSetId,
        sourceVersionId,
      }));
      await this.reload(this.selectedSetId);
      await this.selectVersion(result.tokenSet.id);
      this.notify("admin.designToken.draftCreated");
    },
    tokenPayload() {
      return this.editorValues.map((item) => ({
        tokenKey: item.tokenKey,
        value: item.value,
        metadata: item.metadata || {},
      }));
    },
    async saveDraft() {
      const result = await this.run(() => designTokenService.saveVersion({
        versionId: this.selectedVersionId,
        tokens: this.tokenPayload(),
        changeNote: this.metadata.changeNote,
      }));
      await this.selectVersion(result.tokenSet.id);
      this.notify("admin.designToken.draftSaved");
    },
    async validateVersion() {
      this.validationErrors = [];
      try {
        await this.run(() => designTokenService.validate({ versionId: this.selectedVersionId }));
        this.notify("admin.designToken.validated");
      } catch (error) {
        this.validationErrors = error.details?.errors || [];
      }
    },
    async activateVersion() {
      this.validationErrors = [];
      try {
        await this.run(() => designTokenService.activate({
          versionId: this.selectedVersionId,
          changeNote: this.metadata.changeNote,
        }));
        await this.reload(this.selectedSetId);
        this.notify("admin.designToken.activated");
      } catch (error) {
        this.validationErrors = error.details?.errors || [];
      }
    },
    async importCsv(dryRun) {
      this.importErrors = [];
      try {
        const result = await this.run(() => designTokenService.importCsv({
          tokenSetId: this.selectedSetId,
          csvText: this.csvText,
          sourceName: this.csvSourceName,
          dryRun,
        }));
        this.importErrors = result.errors || [];
        if (!dryRun) {
          await this.reload(this.selectedSetId);
          this.notify("admin.designToken.imported");
        } else {
          this.notify("admin.designToken.importValidated");
        }
      } catch (error) {
        this.importErrors = error.details?.errors || [];
      }
    },
    async archiveSet() {
      await this.run(() => designTokenService.archive({ tokenSetId: this.selectedSetId }));
      await this.reload("");
      this.notify("admin.designToken.archived");
    },
    async loadComparison() {
      this.compareDetail = this.compareVersionId
        ? (await designTokenService.detail(this.compareVersionId)).tokenSet
        : null;
    },
    async applyToTemplate() {
      if (!this.selectedTemplateId || this.detail?.status !== "active") return;
      await this.run(() => designTokenService.applyToTemplate({
        id: this.selectedTemplateId,
        designTokenSetVersionId: this.selectedVersionId,
        changeNote: "Design token version applied from Design Token Management.",
      }));
      await this.reload(this.selectedSetId);
      this.notify("admin.designToken.templateApplied");
    },
    preventUnsavedExit(event) {
      if (!this.isDirty) return;
      event.preventDefault();
      event.returnValue = "";
    },
    fieldType(item) {
      return item.valueType === "color" ? "color" : "text";
    },
    historyLabel(action) {
      const key = String(action || "").replace(/_([a-z])/g, (_, letter) => letter.toUpperCase());
      return this.t(`admin.designToken.history.${key}`);
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
          <small>{{ t("admin.designToken.versionCount", { count: set.versions.length }) }}</small>
        </button>
        <div v-if="!loading && !tokenSets.length" class="empty-state">{{ t("admin.designToken.emptySets") }}</div>
      </aside>

      <main class="design-token-column design-token-editor">
        <template v-if="selectedSet">
          <details open class="design-token-section">
            <summary>{{ t("admin.designToken.settings") }}</summary>
            <label class="field"><span>{{ t("admin.designToken.name") }}</span><input v-model="metadata.name"></label>
            <label class="field"><span>{{ t("admin.designToken.description") }}</span><textarea v-model="metadata.description" rows="2"></textarea></label>
            <label class="field"><span>{{ t("admin.designToken.changeNote") }}</span><input v-model="metadata.changeNote"></label>
            <div class="design-token-actions">
              <button class="tiny-button" type="button" :disabled="saving" @click="saveMetadata">{{ t("common.action.save") }}</button>
              <button class="tiny-button" type="button" :disabled="saving || !selectedVersionId" @click="showClone = !showClone">{{ t("common.action.duplicate") }}</button>
              <button class="tiny-button danger" type="button" :disabled="saving || usage.templates.length || usage.aiRuns.active" @click="archiveSet">{{ t("common.action.archive") }}</button>
            </div>
            <form v-if="showClone" class="design-token-clone" @submit.prevent="cloneSet">
              <label class="field"><span>{{ t("admin.designToken.cloneName") }}</span><input v-model.trim="cloneForm.name" required></label>
              <label class="field"><span>{{ t("admin.designToken.description") }}</span><input v-model.trim="cloneForm.description"></label>
              <button class="tiny-button primary" type="submit" :disabled="saving">{{ t("common.action.duplicate") }}</button>
            </form>
          </details>

          <div class="design-token-version-bar">
            <label class="field compact-field">
              <span>{{ t("admin.designToken.version") }}</span>
              <select v-model="selectedVersionId" @change="selectVersion(selectedVersionId)">
                <option v-for="version in selectedSet.versions" :key="version.id" :value="version.id">
                  v{{ version.version }} · {{ t(`common.state.${version.status}`) }}
                </option>
              </select>
            </label>
            <button v-if="!selectedSet.draftVersion && selectedVersion?.status !== 'inactive'" class="tiny-button primary" type="button" :disabled="saving" @click="createDraft()">
              {{ t("admin.designToken.createDraft") }}
            </button>
            <button
              v-if="!selectedSet.draftVersion && selectedVersion?.status === 'inactive'"
              class="tiny-button"
              type="button"
              :disabled="saving"
              @click="createDraft(selectedVersionId)"
            >{{ t("common.action.rollback") }}</button>
          </div>

          <template v-if="detail">
            <div v-for="group in groupedValues" :key="group.category" class="design-token-section">
              <h3>{{ group.category }}</h3>
              <label v-for="item in group.values" :key="item.tokenKey" class="design-token-value">
                <span>
                  <code>{{ item.tokenKey }}</code>
                  <small>{{ item.semanticRole }}</small>
                  <small>
                    <b v-if="item.required">{{ t("common.state.required") }}</b>
                    <b v-if="item.aiSelectable">{{ t("admin.designToken.aiSelectable") }}</b>
                  </small>
                </span>
                <span class="design-token-value-control">
                  <input
                    v-if="fieldType(item) === 'color'"
                    v-model="item.value"
                    type="color"
                    :disabled="!isDraft || !item.editable"
                  >
                  <input v-model="item.value" type="text" :disabled="!isDraft || !item.editable">
                </span>
              </label>
            </div>
            <div class="design-token-actions sticky-actions">
              <button class="tiny-button" type="button" :disabled="saving || !isDraft" @click="saveDraft">{{ t("common.action.save") }}</button>
              <button class="tiny-button" type="button" :disabled="saving || !isDraft" @click="validateVersion">{{ t("admin.designToken.validate") }}</button>
              <button class="tiny-button primary" type="button" :disabled="saving || !isDraft" @click="activateVersion">{{ t("common.action.activate") }}</button>
            </div>
          </template>

          <details class="design-token-section">
            <summary>{{ t("admin.designToken.csvImport") }}</summary>
            <label class="field"><span>{{ t("admin.designToken.sourceName") }}</span><input v-model="csvSourceName"></label>
            <label class="field"><span>{{ t("admin.designToken.csv") }}</span><textarea v-model="csvText" rows="8"></textarea></label>
            <div class="design-token-actions">
              <button class="tiny-button" type="button" :disabled="saving || !csvText" @click="importCsv(true)">{{ t("admin.designToken.dryRun") }}</button>
              <button class="tiny-button primary" type="button" :disabled="saving || !csvText" @click="importCsv(false)">{{ t("admin.designToken.import") }}</button>
            </div>
          </details>

          <details class="design-token-section">
            <summary>{{ t("admin.designToken.compare") }}</summary>
            <label class="field compact-field">
              <span>{{ t("admin.designToken.compareWith") }}</span>
              <select v-model="compareVersionId" @change="loadComparison">
                <option value="">{{ t("admin.designToken.selectVersion") }}</option>
                <option v-for="version in selectedSet.versions.filter(item => item.id !== selectedVersionId)" :key="version.id" :value="version.id">
                  v{{ version.version }} · {{ t(`common.state.${version.status}`) }}
                </option>
              </select>
            </label>
            <div v-for="row in comparisonRows" :key="row.tokenKey" class="design-token-diff">
              <code>{{ row.tokenKey }}</code>
              <span>{{ row.previous }}</span>
              <span>→</span>
              <strong>{{ row.current }}</strong>
            </div>
            <div v-if="compareDetail && !comparisonRows.length" class="empty-state">{{ t("admin.designToken.noDifferences") }}</div>
          </details>

          <div v-if="validationErrors.length || importErrors.length" class="outline-item danger-state">
            <strong>{{ t("admin.designToken.validationErrors") }}</strong>
            <span v-for="issue in [...validationErrors, ...importErrors]" :key="`${issue.tokenKey}-${issue.message}`">
              {{ issue.tokenKey }}: {{ issue.message }}
            </span>
          </div>
        </template>
      </main>

      <aside class="design-token-column design-token-inspector">
        <template v-if="selectedSet">
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
                    <small>{{ t("admin.designToken.previewEyebrow") }}</small>
                    <h4 class="rendered-text rendered-text--title design-token-preview-title">{{ t("admin.designToken.previewTitle") }}</h4>
                    <p>{{ t("admin.designToken.previewBody") }}</p>
                    <a class="rendered-cta">{{ t("admin.designToken.previewButton") }}</a>
                  </div>
                </section>
              </div>
            </div>
            <div v-if="compareDetail" class="design-token-preview-stage" :class="`is-${previewViewport}`">
              <div class="promo-renderer" :style="comparisonStyle">
                <section class="rendered-section">
                  <div class="rendered-section__inner">
                    <small>{{ t("admin.designToken.comparePreview") }}</small>
                    <h4 class="rendered-text rendered-text--title design-token-preview-title">{{ t("admin.designToken.previewTitle") }}</h4>
                    <p>{{ t("admin.designToken.previewBody") }}</p>
                    <a class="rendered-cta">{{ t("admin.designToken.previewButton") }}</a>
                  </div>
                </section>
              </div>
            </div>
          </section>
          <section class="design-token-section">
            <h3>{{ t("admin.designToken.usage") }}</h3>
            <p>{{ t("admin.designToken.templateUsage", { count: usage.templates.length }) }}</p>
            <p>{{ t("admin.designToken.aiRunUsage", { count: usage.aiRuns.total }) }}</p>
            <div v-for="template in usage.templates" :key="template.id" class="design-token-usage">
              <strong>{{ template.name }}</strong>
              <small>v{{ template.version }} · {{ t(`common.state.${template.status}`) }}</small>
            </div>
            <small>{{ t("admin.designToken.templateGuidance") }}</small>
            <label class="field compact-field">
              <span>{{ t("admin.designToken.applyTemplate") }}</span>
              <select v-model="selectedTemplateId">
                <option value="">{{ t("admin.designToken.selectTemplate") }}</option>
                <option v-for="template in draftTemplates" :key="template.id" :value="template.id">{{ template.name }} · v{{ template.version }}</option>
              </select>
            </label>
            <button class="tiny-button primary" type="button" :disabled="saving || detail?.status !== 'active' || !selectedTemplateId" @click="applyToTemplate">
              {{ t("admin.designToken.applyToDraft") }}
            </button>
          </section>
          <section class="design-token-section">
            <h3>{{ t("admin.designToken.history") }}</h3>
            <div v-for="history in histories" :key="history.id" class="design-token-history">
              <strong>{{ historyLabel(history.action) }}</strong>
              <span>{{ history.changeNote }}</span>
              <small>{{ history.createdAt }}</small>
            </div>
            <div v-if="!histories.length" class="empty-state">{{ t("admin.designToken.emptyHistory") }}</div>
          </section>
        </template>
      </aside>
    </div>
  </section>
</template>

<style scoped>
.design-token-manager { display: grid; gap: var(--app-space-4); min-height: 0; }
.design-token-toolbar, .design-token-actions, .design-token-version-bar { display: flex; align-items: center; justify-content: space-between; gap: var(--app-space-3); }
.design-token-toolbar p { margin: var(--app-space-1) 0 0; color: var(--app-sub); }
.design-token-create { display: grid; grid-template-columns: minmax(12rem, 1fr) minmax(18rem, 2fr) auto; gap: var(--app-space-3); align-items: end; }
.design-token-grid { display: grid; grid-template-columns: minmax(13rem, 0.75fr) minmax(25rem, 1.7fr) minmax(17rem, 1fr); gap: var(--app-panel-gap); min-height: 40rem; }
.design-token-column { min-width: 0; overflow: auto; border: var(--app-border-width) solid var(--app-line); border-radius: var(--app-radius); padding: var(--app-space-3); background: var(--app-panel); }
.design-token-list { display: flex; flex-direction: column; align-items: stretch; gap: var(--app-space-2); }
.design-token-set { display: grid; gap: var(--app-space-1); padding: var(--app-space-3); text-align: left; border: var(--app-border-width) solid var(--app-line); border-radius: var(--app-radius-small); background: transparent; color: var(--app-ink); }
.design-token-set.active { border-color: var(--app-accent); background: var(--app-accent-soft); }
.design-token-set small, .design-token-value small { color: var(--app-muted); }
.design-token-editor, .design-token-inspector { display: flex; flex-direction: column; gap: var(--app-space-3); }
.design-token-section { display: grid; gap: var(--app-space-2); padding: var(--app-space-3); border: var(--app-border-width) solid var(--app-line); border-radius: var(--app-radius-small); }
.design-token-section h3, .design-token-section summary { margin: 0; font-weight: var(--app-font-weight-strong); }
.design-token-value { display: grid; grid-template-columns: minmax(12rem, 1fr) minmax(10rem, 1fr); gap: var(--app-space-3); align-items: center; }
.design-token-value > span:first-child { display: grid; gap: var(--app-space-1); }
.design-token-value-control { display: grid; grid-template-columns: auto 1fr; gap: var(--app-space-2); }
.design-token-value-control input[type="color"] { width: 2.75rem; padding: 0; }
.sticky-actions { position: sticky; bottom: 0; z-index: 2; background: var(--app-panel); }
.design-token-preview-stage { width: 100%; overflow: auto; }
.design-token-preview-stage.is-mobile .promo-renderer { width: min(23.4375rem, 100%); margin-inline: auto; }
.design-token-preview-title { margin-block: var(--app-space-2); color: var(--promo-text); }
.design-token-diff { display: grid; grid-template-columns: minmax(10rem, 1fr) 1fr auto 1fr; gap: var(--app-space-2); align-items: center; }
.design-token-usage, .design-token-history { display: grid; gap: var(--app-space-1); padding-block: var(--app-space-2); border-bottom: var(--app-border-width) solid var(--app-line); }
@media (max-width: 1023px) {
  .design-token-grid { grid-template-columns: 1fr; }
  .design-token-column { max-height: none; }
  .design-token-create { grid-template-columns: 1fr; }
}
</style>
