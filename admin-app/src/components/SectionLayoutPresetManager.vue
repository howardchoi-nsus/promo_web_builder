<script>
import {
  createInitialSectionLayout,
  sectionLayoutPresetService,
} from "../services/section-layout-preset-service.mjs";
import SectionLayoutLivePreviewEditor from "./SectionLayoutLivePreviewEditor.vue";

export default {
  name: "SectionLayoutPresetManager",
  components: { SectionLayoutLivePreviewEditor },
  props: {
    section: { type: Object, required: true },
    items: { type: Array, default: () => [] },
  },
  emits: ["section-updated"],
  data() {
    return {
      loading: false,
      saving: false,
      error: "",
      layouts: [],
      showCreate: false,
      createForm: { name: "", description: "" },
      requestRevision: 0,
      selectedLayoutId: "",
    };
  },
  computed: {
    editable() {
      return this.section?.status === "draft";
    },
    selectedLayout() {
      return this.layouts.find((layout) => layout.id === this.selectedLayoutId) || null;
    },
  },
  watch: {
    "section.id": {
      immediate: true,
      handler() {
        this.selectedLayoutId = "";
        this.load();
      },
    },
  },
  beforeUnmount() {
    this.requestRevision += 1;
  },
  methods: {
    async load() {
      const revision = ++this.requestRevision;
      this.loading = true;
      this.error = "";
      try {
        const result = await sectionLayoutPresetService.list(this.section.id);
        if (revision === this.requestRevision) {
          this.layouts = result.layouts || [];
          if (this.selectedLayoutId && !this.layouts.some((layout) => layout.id === this.selectedLayoutId)) {
            this.selectedLayoutId = "";
          }
        }
      } catch (error) {
        if (revision === this.requestRevision) this.error = error.message;
      } finally {
        if (revision === this.requestRevision) this.loading = false;
      }
    },
    async createPreset() {
      const name = this.createForm.name.trim();
      if (!name || !this.editable || this.saving) return;
      this.saving = true;
      this.error = "";
      try {
        const result = await sectionLayoutPresetService.create({
          sectionId: this.section.id,
          name,
          description: this.createForm.description.trim(),
          isDefault: this.layouts.length === 0,
          layoutSnapshot: createInitialSectionLayout(this.items),
          changeNote: "Admin에서 Layout Preset 생성.",
        });
        this.createForm = { name: "", description: "" };
        this.showCreate = false;
        await this.load();
        this.selectedLayoutId = result.layout.id;
      } catch (error) {
        this.error = error.validationErrors?.[0]?.message || error.message;
      } finally {
        this.saving = false;
      }
    },
    selectLayout(layout) {
      this.selectedLayoutId = this.selectedLayoutId === layout.id ? "" : layout.id;
      this.error = "";
    },
    async handleLayoutSaved(layout) {
      this.layouts = this.layouts.map((entry) => entry.id === layout.id ? layout : entry);
      this.selectedLayoutId = layout.id;
    },
    async setDefault(layout) {
      if (!this.editable || layout.isDefault || this.saving) return;
      this.saving = true;
      this.error = "";
      try {
        await sectionLayoutPresetService.setDefault(layout.id, this.section.id);
        await this.load();
      } catch (error) {
        this.error = error.message;
      } finally {
        this.saving = false;
      }
    },
    async remove(layout) {
      if (!this.editable || this.saving) return;
      if (this.aiAllows(layout)) {
        this.error = "AI 허용을 먼저 해제한 뒤 Layout Preset을 삭제하세요.";
        return;
      }
      if (!globalThis.confirm(`"${layout.name}" Layout Preset을 삭제할까요?`)) return;
      this.saving = true;
      this.error = "";
      try {
        await sectionLayoutPresetService.remove(layout.id, this.section.id);
        await this.load();
      } catch (error) {
        this.error = error.message;
      } finally {
        this.saving = false;
      }
    },
    aiAllows(layout) {
      return (this.section.aiDesign?.allowedLayoutVariants || []).includes(layout.layoutKey);
    },
    async toggleAiLayout(layout) {
      if (!this.editable || this.saving) return;
      const savedLayoutKeys = new Set(this.layouts.map((entry) => entry.layoutKey));
      const current = new Set(
        (this.section.aiDesign?.allowedLayoutVariants || [])
          .filter((layoutKey) => savedLayoutKeys.has(layoutKey)),
      );
      if (current.has(layout.layoutKey)) current.delete(layout.layoutKey);
      else current.add(layout.layoutKey);
      this.saving = true;
      this.error = "";
      try {
        await sectionLayoutPresetService.updateAiLayoutVariants(this.section, [...current]);
        this.$emit("section-updated");
      } catch (error) {
        this.error = error.message;
      } finally {
        this.saving = false;
      }
    },
  },
};
</script>

<template>
  <section class="section-layout-manager">
    <div class="subsection-title">
      <div>
        <h3>Layout Preset</h3>
        <small>섹션을 추가할 때 적용할 Desktop/Mobile 배치를 미리 설정합니다.</small>
      </div>
      <div class="action-row">
        <button class="tiny-button" type="button" :disabled="loading" @click="load">새로고침</button>
        <button class="tiny-button primary" type="button" :disabled="!editable || saving" @click="showCreate = !showCreate">+ Preset</button>
      </div>
    </div>

    <div v-if="!editable" class="empty-state compact">활성·비활성 버전의 Layout은 읽기 전용입니다. 초안을 만든 후 편집하세요.</div>
    <div v-if="error" class="field-error">{{ error }}</div>
    <div v-if="showCreate && editable" class="section-layout-create">
      <label class="field compact-field"><span>이름</span><input v-model="createForm.name" type="text" placeholder="예: Standard Header" /></label>
      <label class="field compact-field"><span>설명</span><input v-model="createForm.description" type="text" placeholder="사용 목적" /></label>
      <button class="tiny-button primary" type="button" :disabled="!createForm.name.trim() || saving" @click="createPreset">생성 후 Live Preview</button>
    </div>

    <div v-if="loading" class="empty-state compact">Layout Preset을 불러오는 중...</div>
    <div v-else class="history-list">
      <div v-for="layout in layouts" :key="layout.id" class="history-item section-layout-row">
        <div>
          <strong>{{ layout.name }} <em v-if="layout.isDefault" class="status-active">기본</em></strong>
          <span>{{ layout.layoutKey }} · {{ layout.description || '설명 없음' }}</span>
        </div>
        <div class="action-row align-right">
          <button class="tiny-button" type="button" :class="{ primary: selectedLayoutId === layout.id }" @click="selectLayout(layout)">{{ selectedLayoutId === layout.id ? 'Preview 닫기' : (editable ? 'Live Preview 편집' : 'Live Preview 보기') }}</button>
          <button class="tiny-button" type="button" :disabled="!editable || layout.isDefault || saving" @click="setDefault(layout)">기본값</button>
          <button class="tiny-button" type="button" :disabled="!editable || saving" @click="toggleAiLayout(layout)">{{ aiAllows(layout) ? 'AI 허용됨' : 'AI 허용' }}</button>
          <button class="tiny-button danger" type="button" :disabled="!editable || saving || aiAllows(layout)" @click="remove(layout)">삭제</button>
        </div>
      </div>
      <div v-if="!layouts.length" class="empty-state compact">등록된 Layout Preset이 없습니다. 기존 자동 배치가 계속 사용됩니다.</div>
    </div>
    <section-layout-live-preview-editor
      v-if="selectedLayout"
      :section="section"
      :items="items"
      :layout="selectedLayout"
      @saved="handleLayoutSaved"
      @close="selectedLayoutId = ''"
    />
  </section>
</template>

<style scoped>
.section-layout-manager { margin-top: 24px; padding-top: 20px; border-top: 1px solid var(--app-border, #303744); }
.section-layout-create { display: grid; grid-template-columns: minmax(160px, .7fr) minmax(220px, 1fr) auto; gap: 10px; align-items: end; margin: 12px 0; }
.section-layout-row { display: flex; justify-content: space-between; gap: 16px; align-items: center; }
@media (max-width: 800px) {
  .section-layout-create { grid-template-columns: 1fr; }
  .section-layout-row { align-items: flex-start; flex-direction: column; }
}
</style>
