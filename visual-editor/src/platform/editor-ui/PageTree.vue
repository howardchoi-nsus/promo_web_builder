<script setup>
import { ref } from "vue";

const props = defineProps({
  sections: { type: Array, default: () => [] },
  selectedSection: { type: Object, default: null },
  selectedItemKey: { type: String, default: "" },
  canComposeStructure: { type: Boolean, default: false },
  sectionContentRegistered: { type: Function, required: true },
});

const emit = defineEmits([
  "select-section",
  "select-item",
  "move-section",
  "move-component",
  "remove-section",
  "remove-component",
  "drop-library-component",
]);

const sectionDrop = ref({ key: "", position: "" });
const componentDrop = ref({ sectionKey: "", itemKey: "", position: "" });

function movableSection(section) {
  return props.canComposeStructure && !section.fixedPosition && section.userReorderAllowed !== false;
}

function movableComponent(item) {
  return props.canComposeStructure && !item.isLocked && item.userReorderAllowed !== false;
}

function setDragData(event, type, payload) {
  event.dataTransfer.effectAllowed = "move";
  event.dataTransfer.setData(type, JSON.stringify(payload));
  event.dataTransfer.setData("text/plain", JSON.stringify({ type, ...payload }));
}

function readDragData(event, type) {
  const raw = event.dataTransfer.getData(type);
  if (!raw) return null;
  try { return JSON.parse(raw); } catch { return null; }
}

function startSectionDrag(section, event) {
  if (!movableSection(section)) return event.preventDefault();
  setDragData(event, "application/x-promo-section", { sectionKey: section.sectionKey });
}

function dragOverSection(section, event) {
  if (!props.canComposeStructure) return;
  const types = [...(event.dataTransfer?.types || [])];
  if (!types.some((type) => [
    "application/x-promo-section",
    "application/x-promo-component-instance",
    "application/x-promo-component-definition",
  ].includes(type))) return;
  event.preventDefault();
  const bounds = event.currentTarget.getBoundingClientRect();
  sectionDrop.value = {
    key: section.sectionKey,
    position: event.clientY < bounds.top + bounds.height / 2 ? "before" : "after",
  };
}

function dropOnSection(section, event) {
  event.preventDefault();
  const sourceSection = readDragData(event, "application/x-promo-section");
  const sourceComponent = readDragData(event, "application/x-promo-component-instance");
  const libraryComponent = readDragData(event, "application/x-promo-component-definition");
  if (sourceSection && sourceSection.sectionKey !== section.sectionKey) {
    emit("move-section", sourceSection.sectionKey, section.sectionKey, sectionDrop.value.position || "before");
  } else if (sourceComponent && sourceComponent.sectionKey !== section.sectionKey) {
    emit("move-component", sourceComponent.sectionKey, sourceComponent.itemKey, section.sectionKey, null, "after");
  } else if (libraryComponent?.componentKey) {
    emit("drop-library-component", libraryComponent.componentKey, section.sectionKey);
  }
  sectionDrop.value = { key: "", position: "" };
}

function startComponentDrag(section, item, event) {
  if (!movableComponent(item)) return event.preventDefault();
  setDragData(event, "application/x-promo-component-instance", {
    sectionKey: section.sectionKey,
    itemKey: item.itemKey,
  });
}

function dragOverComponent(section, item, event) {
  if (!props.canComposeStructure) return;
  const types = [...(event.dataTransfer?.types || [])];
  if (!types.includes("application/x-promo-component-instance")) return;
  event.preventDefault();
  event.stopPropagation();
  const bounds = event.currentTarget.getBoundingClientRect();
  componentDrop.value = {
    sectionKey: section.sectionKey,
    itemKey: item.itemKey,
    position: event.clientY < bounds.top + bounds.height / 2 ? "before" : "after",
  };
}

function dropOnComponent(section, item, event) {
  event.preventDefault();
  event.stopPropagation();
  const source = readDragData(event, "application/x-promo-component-instance");
  if (source && (source.sectionKey !== section.sectionKey || source.itemKey !== item.itemKey)) {
    emit(
      "move-component",
      source.sectionKey,
      source.itemKey,
      section.sectionKey,
      item.itemKey,
      componentDrop.value.position || "before",
    );
  }
  componentDrop.value = { sectionKey: "", itemKey: "", position: "" };
}
</script>

<template>
  <div class="page-tree" role="tree" aria-label="페이지 구조">
    <div class="page-tree__root" role="treeitem" aria-level="1" aria-expanded="true">
      <strong>Page</strong>
      <small>{{ sections.length }}개 섹션</small>
    </div>
    <div role="group">
      <section
        v-for="(section, sectionIndex) in sections"
        :key="section.sectionKey"
        class="page-tree__section"
        :class="{
          active: section.sectionKey === selectedSection?.sectionKey,
          'drop-before': sectionDrop.key === section.sectionKey && sectionDrop.position === 'before',
          'drop-after': sectionDrop.key === section.sectionKey && sectionDrop.position === 'after',
        }"
        role="treeitem"
        aria-level="2"
        :aria-expanded="section.sectionKey === selectedSection?.sectionKey"
        :draggable="movableSection(section)"
        @dragstart="startSectionDrag(section, $event)"
        @dragover="dragOverSection(section, $event)"
        @dragleave="sectionDrop = { key: '', position: '' }"
        @drop="dropOnSection(section, $event)"
      >
        <div class="page-tree__row">
          <button
            type="button"
            class="page-tree__handle"
            :disabled="!movableSection(section)"
            :aria-label="`${section.name} 섹션 드래그`"
            title="드래그해서 섹션 순서 변경"
          >⋮⋮</button>
          <button
            type="button"
            class="page-tree__select"
            @click="emit('select-section', section)"
          >
            <span>{{ section.name }}</span>
            <small>{{ section.sectionRole || "content" }}</small>
          </button>
          <span
            class="page-tree__status"
            :class="sectionContentRegistered(section) ? 'is-complete' : 'is-incomplete'"
            :aria-label="sectionContentRegistered(section) ? '콘텐츠 등록 완료' : '콘텐츠 등록 필요'"
          ></span>
          <div v-if="canComposeStructure" class="page-tree__actions">
            <button
              type="button"
              :disabled="!movableSection(section) || sectionIndex === 0"
              :aria-label="`${section.name} 섹션 위로 이동`"
              @click="emit('move-section', section.sectionKey, sections[sectionIndex - 1]?.sectionKey, 'before')"
            >↑</button>
            <button
              type="button"
              :disabled="!movableSection(section) || sectionIndex === sections.length - 1"
              :aria-label="`${section.name} 섹션 아래로 이동`"
              @click="emit('move-section', section.sectionKey, sections[sectionIndex + 1]?.sectionKey, 'after')"
            >↓</button>
            <button
              type="button"
              :disabled="section.isRequired || Boolean(section.fixedPosition)"
              :aria-label="`${section.name} 섹션 삭제`"
              @click="emit('remove-section', section)"
            >×</button>
          </div>
        </div>

        <div v-if="section.sectionKey === selectedSection?.sectionKey" role="group">
          <div
            v-for="(item, itemIndex) in section.items || []"
            :key="item.itemKey"
            class="page-tree__component"
            :class="{
              active: item.itemKey === selectedItemKey,
              'drop-before': componentDrop.sectionKey === section.sectionKey
                && componentDrop.itemKey === item.itemKey && componentDrop.position === 'before',
              'drop-after': componentDrop.sectionKey === section.sectionKey
                && componentDrop.itemKey === item.itemKey && componentDrop.position === 'after',
            }"
            role="treeitem"
            aria-level="3"
            :draggable="movableComponent(item)"
            @dragstart="startComponentDrag(section, item, $event)"
            @dragover="dragOverComponent(section, item, $event)"
            @drop="dropOnComponent(section, item, $event)"
          >
            <button
              type="button"
              class="page-tree__handle"
              :disabled="!movableComponent(item)"
              :aria-label="`${item.name} 컴포넌트 드래그`"
            >⋮⋮</button>
            <button
              type="button"
              class="page-tree__select"
              @click="emit('select-item', section, item)"
            >
              <span>{{ item.name }}</span>
              <small>{{ item.fieldKind }}</small>
            </button>
            <div v-if="canComposeStructure" class="page-tree__actions">
              <button
                type="button"
                :disabled="!movableComponent(item) || itemIndex === 0"
                :aria-label="`${item.name} 컴포넌트 위로 이동`"
                @click="emit('move-component', section.sectionKey, item.itemKey, section.sectionKey, section.items[itemIndex - 1]?.itemKey, 'before')"
              >↑</button>
              <button
                type="button"
                :disabled="!movableComponent(item) || itemIndex === section.items.length - 1"
                :aria-label="`${item.name} 컴포넌트 아래로 이동`"
                @click="emit('move-component', section.sectionKey, item.itemKey, section.sectionKey, section.items[itemIndex + 1]?.itemKey, 'after')"
              >↓</button>
              <button
                type="button"
                :disabled="item.isRequired || item.isLocked"
                :aria-label="`${item.name} 컴포넌트 삭제`"
                @click="emit('remove-component', section, item)"
              >×</button>
            </div>
            <div v-if="(item.fields || []).length" class="page-tree__fields" role="group">
              <button
                v-for="field in item.fields"
                :key="field.fieldKey"
                type="button"
                role="treeitem"
                aria-level="4"
                disabled
              >{{ field.name }}</button>
            </div>
          </div>
          <span v-if="!section.items?.length" class="page-tree__empty">컴포넌트를 추가해 주세요.</span>
          <slot name="section-details" :section="section"></slot>
        </div>
      </section>
    </div>
  </div>
</template>
