<script setup>
import SectionProperties from "../../SectionProperties.vue";

defineProps({
  sections: { type: Array, default: () => [] },
  selectedSection: { type: Object, default: null },
  selectedSectionStyle: { type: Object, default: () => ({}) },
  sectionContentRegistered: { type: Function, required: true },
  sectionHasAiBackground: { type: Function, required: true },
});

const emit = defineEmits([
  "select-section",
  "section-ai-action",
  "background-alignment",
  "background-fade",
  "update-section-style",
  "reset-section-height",
]);
</script>

<template>
  <aside class="section-rail" aria-label="콘텐츠 섹션">
    <div class="panel-heading">
      <span>SECTIONS</span>
      <strong>{{ sections.length }}</strong>
    </div>
    <div class="section-list">
      <section
        v-for="section in sections"
        :key="section.sectionKey"
        class="section-nav-item"
        :class="{ active: section.sectionKey === selectedSection?.sectionKey }"
      >
        <button
          type="button"
          class="section-trigger"
          :class="{ active: section.sectionKey === selectedSection?.sectionKey }"
          :aria-expanded="section.sectionKey === selectedSection?.sectionKey"
          :aria-controls="`section-properties-${section.sectionKey}`"
          @click="emit('select-section', section)"
        >
          <span>{{ section.name }}</span>
          <svg
            class="section-registration-icon"
            :class="sectionContentRegistered(section) ? 'is-complete' : 'is-incomplete'"
            viewBox="0 0 20 20"
            role="img"
            :aria-label="sectionContentRegistered(section) ? `${section.name} 콘텐츠 등록 완료` : `${section.name} 콘텐츠 등록 필요`"
          >
            <circle cx="10" cy="10" r="9"></circle>
            <path v-if="sectionContentRegistered(section)" d="M5.8 10.2 8.6 13l5.8-6"></path>
            <path v-else d="M10 5.5v6M10 14.5v.1"></path>
          </svg>
        </button>
        <div
          v-if="section.sectionKey === selectedSection?.sectionKey"
          :id="`section-properties-${section.sectionKey}`"
          class="section-property-accordion"
        >
          <slot name="section-composition" :section="section"></slot>
          <SectionProperties
            :section="section"
            :section-style="selectedSectionStyle"
            :has-ai-background="sectionHasAiBackground(section)"
            @ai-action="(action, targetItemKey, targetType, options) => emit('section-ai-action', section, action, targetItemKey, targetType, options)"
            @background-alignment="(value) => emit('background-alignment', value)"
            @background-fade="(value) => emit('background-fade', value)"
            @update-style="(patch) => emit('update-section-style', section.sectionKey, patch)"
            @reset-height="emit('reset-section-height')"
          />
        </div>
      </section>
    </div>
  </aside>
</template>
