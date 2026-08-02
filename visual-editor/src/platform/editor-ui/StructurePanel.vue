<script setup>
import { ref } from "vue";
import SectionProperties from "../../SectionProperties.vue";
import ComponentLibraryPanel from "./ComponentLibraryPanel.vue";
import PageTree from "./PageTree.vue";
import SectionPresetPicker from "./SectionPresetPicker.vue";
import SectionTransitionControls from "./SectionTransitionControls.vue";

defineProps({
  sections: { type: Array, default: () => [] },
  selectedSection: { type: Object, default: null },
  expandedSectionKey: { type: String, default: "" },
  selectedItemKey: { type: String, default: "" },
  selectedSectionStyle: { type: Object, default: () => ({}) },
  capabilities: { type: Object, required: true },
  componentLibrary: { type: Array, default: () => [] },
  sectionPresets: { type: Array, default: () => [] },
  libraryLoading: { type: Boolean, default: false },
  sectionContentRegistered: { type: Function, required: true },
  sectionHasAiBackground: { type: Function, required: true },
  sectionMotion: { type: Object, default: () => ({}) },
});

const emit = defineEmits([
  "select-section",
  "toggle-section-expansion",
  "select-item",
  "section-ai-action",
  "background-alignment",
  "background-fade",
  "update-section-style",
  "reset-section-height",
  "create-blank-section",
  "create-section-from-preset",
  "add-component",
  "move-section",
  "move-component",
  "remove-section",
  "remove-component",
  "update-section-motion",
  "replay-motion",
]);

const activeTab = ref("tree");
</script>

<template>
  <aside class="section-rail structure-panel" aria-label="페이지 구조와 컴포넌트">
    <div class="panel-heading">
      <span>STRUCTURE</span>
      <strong>{{ sections.length }}</strong>
    </div>
    <div class="structure-panel__tabs" role="tablist" aria-label="편집 구조 도구">
      <button
        type="button"
        role="tab"
        :aria-selected="activeTab === 'tree'"
        :class="{ active: activeTab === 'tree' }"
        @click="activeTab = 'tree'"
      >페이지 구조</button>
      <button
        type="button"
        role="tab"
        :aria-selected="activeTab === 'library'"
        :class="{ active: activeTab === 'library' }"
        @click="activeTab = 'library'"
      >컴포넌트</button>
    </div>

    <SectionPresetPicker
      v-if="activeTab === 'tree' && capabilities.canCreateSections"
      :presets="sectionPresets"
      :disabled="libraryLoading"
      @create-blank="emit('create-blank-section')"
      @create-from-preset="emit('create-section-from-preset', $event)"
    />

    <div class="section-list structure-panel__body">
      <PageTree
        v-if="activeTab === 'tree'"
        :sections="sections"
        :selected-section="selectedSection"
        :expanded-section-key="expandedSectionKey"
        :selected-item-key="selectedItemKey"
        :can-compose-structure="capabilities.canComposeStructure"
        :section-content-registered="sectionContentRegistered"
        @select-section="emit('select-section', $event)"
        @toggle-section-expansion="emit('toggle-section-expansion', $event)"
        @select-item="(section, item) => emit('select-item', section, item)"
        @move-section="(sourceKey, targetKey, position) => emit('move-section', sourceKey, targetKey, position)"
        @move-component="(sourceSectionKey, itemKey, targetSectionKey, targetItemKey, position) => emit('move-component', sourceSectionKey, itemKey, targetSectionKey, targetItemKey, position)"
        @remove-section="emit('remove-section', $event)"
        @remove-component="(section, item) => emit('remove-component', section, item)"
        @drop-library-component="(componentKey, sectionKey) => emit('add-component', componentKey, sectionKey)"
      >
        <template #section-tools="{ section }">
          <slot name="section-composition" :section="section"></slot>
        </template>
        <template #section-details="{ section }">
          <div class="section-property-accordion">
            <SectionProperties
              :section="section"
              :section-style="selectedSectionStyle"
              :has-ai-background="sectionHasAiBackground(section)"
              @ai-action="(action, targetItemKey, targetType, options) => emit('section-ai-action', section, action, targetItemKey, targetType, options)"
              @background-alignment="emit('background-alignment', $event)"
              @background-fade="emit('background-fade', $event)"
              @update-style="(patch) => emit('update-section-style', section.sectionKey, patch)"
              @reset-height="emit('reset-section-height')"
            />
            <SectionTransitionControls
              v-if="section.sectionKey === selectedSection?.sectionKey"
              :binding="sectionMotion"
              @update="emit('update-section-motion', $event)"
              @replay="emit('replay-motion')"
            />
          </div>
        </template>
      </PageTree>

      <ComponentLibraryPanel
        v-else
        :components="componentLibrary"
        :selected-section="selectedSection"
        :disabled="libraryLoading || !capabilities.canManageComponents"
        @add-component="(component, sectionKey) => emit('add-component', component, sectionKey)"
      />
    </div>
  </aside>
</template>
