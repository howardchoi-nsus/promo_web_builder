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
      draftLayout: null,
      requestRevision: 0,
      selectedLayoutId: "",
    };
  },
  computed: {
    editable() {
      return this.section?.status === "draft";
    },
    selectedLayout() {
      if (this.selectedLayoutId === "__new__") return this.draftLayout;
      return this.layouts.find((layout) => layout.id === this.selectedLayoutId) || null;
    },
  },
  watch: {
    "section.id": {
      immediate: true,
      handler() {
        this.selectedLayoutId = "";
        this.draftLayout = null;
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
      this.draftLayout = {
        id: "__new__",
        sectionId: this.section.id,
        layoutKey: "저장 시 자동 생성",
        name: "",
        description: "",
        isDefault: this.layouts.length === 0,
        layoutSnapshot: createInitialSectionLayout(this.items),
      };
      this.selectedLayoutId = "__new__";
    },
    selectLayout(layout) {
      this.selectedLayoutId = this.selectedLayoutId === layout.id ? "" : layout.id;
      this.draftLayout = null;
      this.error = "";
    },
    async handleLayoutSaved(layout) {
      this.layouts = this.layouts.map((entry) => entry.id === layout.id ? layout : entry);
      this.selectedLayoutId = layout.id;
    },
    async handleLayoutCreated({ layout, allowAi }) {
      this.error = "";
      try {
        await this.load();
        this.selectedLayoutId = layout.id;
        this.draftLayout = null;
        if (allowAi) await this.setAiLayoutAllowed(layout, true);
      } catch (error) {
        this.error = error.message;
      }
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
        </div>
      </div>
      <div v-if="!layouts.length" class="empty-state compact">등록된 Layout Preset이 없습니다. 기존 자동 배치가 계속 사용됩니다.</div>
    </div>
    <section-layout-live-preview-editor
      v-if="selectedLayout"
      :section="section"
      :items="items"
      :layout="selectedLayout"
      :create-mode="selectedLayoutId === '__new__'"
      :ai-allowed="selectedLayoutId !== '__new__' && aiAllows(selectedLayout)"
      @saved="handleLayoutSaved"
      @created="handleLayoutCreated"
      @set-default="setDefault(selectedLayout)"
      @toggle-ai="toggleAiLayout(selectedLayout)"
      @delete="remove(selectedLayout)"
      @close="selectedLayoutId = ''; draftLayout = null"
    />
  </section>
</template>

<style scoped>
.section-layout-manager { margin-top: 24px; padding-top: 20px; border-top: 1px solid var(--app-border, #303744); }
.section-layout-row { display: flex; justify-content: space-between; gap: 16px; align-items: center; }
@media (max-width: 800px) {
  .section-layout-row { align-items: flex-start; flex-direction: column; }
}
</style>
