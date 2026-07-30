<script setup>
import { computed, ref } from "vue";

const props = defineProps({
  components: { type: Array, default: () => [] },
  selectedSection: { type: Object, default: null },
  disabled: { type: Boolean, default: false },
});

const emit = defineEmits(["add-component"]);
const query = ref("");

const filteredComponents = computed(() => {
  const keyword = query.value.trim().toLowerCase();
  if (!keyword) return props.components;
  return props.components.filter((component) => [
    component.name,
    component.componentKey,
    component.description,
    component.activeVersion?.fieldKind,
  ].some((value) => String(value || "").toLowerCase().includes(keyword)));
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
    <div class="component-library-panel__list">
      <article
        v-for="component in filteredComponents"
        :key="component.id || component.componentKey"
        class="component-library-card"
        :draggable="!disabled"
        @dragstart="startDrag(component, $event)"
      >
        <div>
          <strong>{{ component.name }}</strong>
          <small>{{ component.componentKey }} · {{ component.activeVersion?.fieldKind || "multi-field" }}</small>
        </div>
        <button
          type="button"
          :disabled="disabled || !selectedSection"
          :aria-label="`${component.name} 컴포넌트 추가`"
          @click="emit('add-component', component, selectedSection?.sectionKey)"
        >추가</button>
      </article>
      <span v-if="!filteredComponents.length" class="component-library-panel__empty">
        사용할 수 있는 활성 컴포넌트가 없습니다.
      </span>
    </div>
  </div>
</template>
