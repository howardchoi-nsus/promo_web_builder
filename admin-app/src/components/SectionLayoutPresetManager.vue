<script>
import {
  createInitialSectionLayout,
  sectionLayoutPresetService,
} from "../services/section-layout-preset-service.mjs";
import SectionLayoutVisualEditorFrame from "./SectionLayoutVisualEditorFrame.vue";

export default {
  name: "SectionLayoutPresetManager",
  components: { SectionLayoutVisualEditorFrame },
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
      newPresetEditor: null,
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
        this.newPresetEditor = null;
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
    startNewPreset() {
      if (!this.editable || this.saving) return;
      this.error = "";
      this.newPresetEditor = {
        name: "",
        description: "",
        isDefault: this.layouts.length === 0,
        allowAi: this.section?.aiDesign?.enabled !== false,
      };
      this.selectedLayoutId = "";
    },
    async createPreset() {
      if (!this.editable || this.saving || !this.newPresetEditor) return;
      const name = String(this.newPresetEditor.name || "").trim();
      if (!name) {
        this.error = "Layout Preset 이름을 입력해 주세요.";
        return;
      }
      this.saving = true;
      this.error = "";
      let createdLayout = null;
      let allowAi = false;
      try {
        const result = await sectionLayoutPresetService.create({
          sectionId: this.section.id,
          name,
          description: this.newPresetEditor.description || "",
          isDefault: this.newPresetEditor.isDefault,
          changeNote: "공통 Visual Editor 편집을 위한 Layout Preset 생성.",
          layoutSnapshot: createInitialSectionLayout(this.items),
        });
        allowAi = this.newPresetEditor.allowAi;
        createdLayout = result.layout;
        await this.load();
        this.selectedLayoutId = result.layout.id;
        this.newPresetEditor = null;
      } catch (error) {
        this.error = error.validationErrors?.[0]?.message || error.message;
      } finally {
        this.saving = false;
      }
      if (createdLayout && allowAi) await this.setAiLayoutAllowed(createdLayout, true);
    },
    selectLayout(layout) {
      this.selectedLayoutId = this.selectedLayoutId === layout.id ? "" : layout.id;
      this.newPresetEditor = null;
      this.error = "";
    },
    async handleVisualEditorSaved() {
      await this.load();
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
        if (this.selectedLayoutId === layout.id) this.selectedLayoutId = "";
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
      return this.setAiLayoutAllowed(layout, !this.aiAllows(layout));
    },
    async setAiLayoutAllowed(layout, allowed) {
      if (!this.editable || this.saving) return;
      const savedLayoutKeys = new Set(this.layouts.map((entry) => entry.layoutKey));
      const current = new Set(
        (this.section.aiDesign?.allowedLayoutVariants || [])
          .filter((layoutKey) => savedLayoutKeys.has(layoutKey)),
      );
      if (allowed) current.add(layout.layoutKey);
      else current.delete(layout.layoutKey);
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
        <small>Live Preview에서 Desktop/Mobile 배치를 완성한 뒤 Preset으로 저장합니다.</small>
      </div>
      <div class="action-row">
        <button class="tiny-button" type="button" :disabled="loading" @click="load">새로고침</button>
        <button class="tiny-button primary" type="button" :disabled="!editable || saving" @click="startNewPreset">+ 새 Layout 만들기</button>
      </div>
    </div>

    <div v-if="!editable" class="empty-state compact">활성·비활성 버전의 Layout은 읽기 전용입니다. 초안을 만든 후 편집하세요.</div>
    <div v-if="error" class="field-error">{{ error }}</div>
    <div v-if="loading" class="empty-state compact">Layout Preset을 불러오는 중...</div>
    <div v-else class="history-list">
      <div v-for="layout in layouts" :key="layout.id" class="history-item section-layout-row">
        <div>
          <strong>
            {{ layout.name }}
            <em v-if="layout.isDefault" class="status-active">기본</em>
            <em v-if="aiAllows(layout)" class="status-active">AI 허용</em>
          </strong>
          <span>{{ layout.layoutKey }} · {{ layout.description || '설명 없음' }}</span>
        </div>
        <div class="action-row align-right">
          <button class="tiny-button" type="button" :class="{ primary: selectedLayoutId === layout.id }" @click="selectLayout(layout)">{{ selectedLayoutId === layout.id ? 'Preview 닫기' : (editable ? 'Live Preview 편집' : 'Live Preview 보기') }}</button>
          <button class="tiny-button" type="button" :disabled="!editable || saving || layout.isDefault" @click="setDefault(layout)">기본 지정</button>
          <button class="tiny-button" type="button" :disabled="!editable || saving" @click="toggleAiLayout(layout)">{{ aiAllows(layout) ? 'AI 허용 해제' : 'AI 사용 허용' }}</button>
          <button class="tiny-button danger" type="button" :disabled="!editable || saving || aiAllows(layout)" @click="remove(layout)">삭제</button>
        </div>
      </div>
      <div v-if="!layouts.length" class="empty-state compact">등록된 Layout Preset이 없습니다. 기존 자동 배치가 계속 사용됩니다.</div>
    </div>
    <form v-if="newPresetEditor" class="new-layout-preset-form" @submit.prevent="createPreset">
      <label><span>Preset 이름</span><input v-model="newPresetEditor.name" required /></label>
      <label><span>설명</span><input v-model="newPresetEditor.description" /></label>
      <label class="inline-check"><input v-model="newPresetEditor.isDefault" type="checkbox" :disabled="!layouts.length" /><span>기본 Preset</span></label>
      <label class="inline-check"><input v-model="newPresetEditor.allowAi" type="checkbox" :disabled="section.aiDesign?.enabled === false" /><span>AI 사용 허용</span></label>
      <div class="action-row">
        <button class="tiny-button" type="button" @click="newPresetEditor = null">취소</button>
        <button class="tiny-button primary" type="submit" :disabled="saving">{{ saving ? '생성 중…' : 'Preset 만들고 Visual Editor 열기' }}</button>
      </div>
    </form>
    <section-layout-visual-editor-frame
      v-if="selectedLayout"
      :section="section"
      :layout="selectedLayout"
      @saved="handleVisualEditorSaved"
      @close="selectedLayoutId = ''"
    />
  </section>
</template>

<style scoped>
.section-layout-manager { margin-top: 24px; padding-top: 20px; border-top: 1px solid var(--app-border, #303744); }
.section-layout-row { display: flex; justify-content: space-between; gap: 16px; align-items: center; }
.new-layout-preset-form { display: grid; grid-template-columns: minmax(160px, .7fr) minmax(220px, 1fr) auto auto auto; gap: 10px; align-items: end; margin-top: 12px; padding: 12px; border: 1px solid var(--app-line); border-radius: 8px; background: var(--app-surface); }
.new-layout-preset-form label { display: grid; gap: 5px; color: var(--app-sub); font-size: 11px; font-weight: 750; }
.new-layout-preset-form input { min-height: 32px; border: 1px solid var(--app-line); border-radius: 5px; background: var(--app-panel); color: var(--app-ink); }
.new-layout-preset-form .inline-check { display: inline-flex; align-items: center; padding-bottom: 7px; white-space: nowrap; }
.new-layout-preset-form .inline-check input { min-height: auto; }
@media (max-width: 800px) {
  .section-layout-row { align-items: flex-start; flex-direction: column; }
  .new-layout-preset-form { grid-template-columns: 1fr; }
}
</style>
