<script setup>
import { computed, ref } from "vue";
import {
  COMPONENT_LIBRARY_CATEGORIES,
  componentLibrarySearchText,
  resolveComponentLibraryPresentation,
} from "../editor-core/component-library.mjs";
import ComponentLibraryIcon from "./ComponentLibraryIcon.vue";

const props = defineProps({
  components: { type: Array, default: () => [] },
  selectedSection: { type: Object, default: null },
  disabled: { type: Boolean, default: false },
});

const emit = defineEmits(["add-component"]);
const query = ref("");
const activeCategory = ref("");

const filteredComponents = computed(() => {
  const keyword = query.value.trim().toLowerCase();
  return props.components
    .map((component) => ({
      ...component,
      resolvedLibraryPresentation: resolveComponentLibraryPresentation(component),
    }))
    .filter((component) => !activeCategory.value
      || component.resolvedLibraryPresentation.category === activeCategory.value)
    .filter((component) => !keyword || componentLibrarySearchText(component).includes(keyword))
    .sort((left, right) => (
      left.resolvedLibraryPresentation.displayOrder - right.resolvedLibraryPresentation.displayOrder
      || String(left.name || "").localeCompare(String(right.name || ""), "ko")
    ));
});

function startDrag(component, event) {
  if (props.disabled || !component?.componentKey) return event.preventDefault();
  event.dataTransfer.effectAllowed = "copy";
  event.dataTransfer.setData(
    "application/x-promo-component-definition",
    JSON.stringify({ componentKey: component.componentKey }),
  );
  event.dataTransfer.setData("text/plain", component.componentKey);
}
</script>

<template>
  <div class="component-library-panel">
    <label class="component-library-panel__search">
      <span>컴포넌트 검색</span>
      <input v-model="query" type="search" placeholder="이름, Key, 종류 검색" />
    </label>
    <p>
      컴포넌트를 Live Preview의 섹션으로 드래그하거나 추가 버튼을 사용하세요.
    </p>
    <div class="component-library-panel__categories" role="group" aria-label="컴포넌트 카테고리">
      <button type="button" :class="{ active: !activeCategory }" @click="activeCategory = ''">전체</button>
      <button
        v-for="category in COMPONENT_LIBRARY_CATEGORIES"
        :key="category.key"
        type="button"
        :class="{ active: activeCategory === category.key }"
        @click="activeCategory = category.key"
      >{{ category.label }}</button>
    </div>
    <div class="component-library-panel__grid">
      <article
        v-for="component in filteredComponents"
        :key="component.id || component.componentKey"
        class="component-library-card"
        :draggable="!disabled"
        :title="component.description || `${component.name} 컴포넌트`"
        @dragstart="startDrag(component, $event)"
      >
        <div class="component-library-card__identity">
          <span class="component-library-card__icon">
            <ComponentLibraryIcon :icon-key="component.resolvedLibraryPresentation.iconKey" />
          </span>
          <strong>{{ component.name }}</strong>
          <small>{{ component.activeVersion?.fieldKind || "multi-field" }}</small>
        </div>
        <button
          type="button"
          :disabled="disabled || !selectedSection"
          :aria-label="`${component.name} 컴포넌트 추가`"
          @click="emit('add-component', component, selectedSection?.sectionKey)"
        >+ 추가</button>
      </article>
      <span v-if="!filteredComponents.length" class="component-library-panel__empty">
        검색 조건에 맞는 활성 컴포넌트가 없습니다.
      </span>
    </div>
  </div>
</template>
