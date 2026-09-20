<script setup>
import { computed, nextTick, onMounted, ref, watch } from "vue";

const props = defineProps({
  modelValue: { type: String, default: "desktop" },
  mode: { type: String, default: "component" },
  selectedNodeKey: { type: String, default: "" },
  title: { type: String, default: "Live Preview" },
});

const emit = defineEmits(["update:modelValue", "select-node"]);
const previewRoot = ref(null);
const viewportWidth = computed(() => ({ desktop: "100%", tablet: "760px", mobile: "390px" }[props.modelValue] || "100%"));

function selectionPayload(target) {
  const node = target?.closest?.("[data-render-path],[data-item-key],[data-section-key]");
  if (!node) return null;
  return {
    path: node.dataset.renderPath || "",
    fieldKey: node.dataset.fieldKey || "",
    itemKey: node.dataset.itemKey || "",
    sectionKey: node.dataset.sectionKey || "",
  };
}

function handlePreviewClick(event) {
  const payload = selectionPayload(event.target);
  if (payload) emit("select-node", payload);
}

async function syncSelectionHighlight() {
  await nextTick();
  const elements = previewRoot.value?.querySelectorAll?.("[data-render-path],[data-item-key],[data-section-key]") || [];
  elements.forEach((element) => {
    const matches = props.selectedNodeKey && [
      element.dataset.renderPath,
      element.dataset.fieldKey,
      element.dataset.itemKey,
      element.dataset.sectionKey,
    ].includes(props.selectedNodeKey);
    element.classList.toggle("is-live-preview-selected", Boolean(matches));
  });
}

watch(() => [props.selectedNodeKey, props.modelValue], syncSelectionHighlight);
onMounted(syncSelectionHighlight);
</script>

<template>
  <section class="live-preview-host" :data-preview-mode="mode">
    <header>
      <strong>{{ title }}</strong>
      <div class="live-preview-host__viewports" role="group" aria-label="미리보기 화면 크기">
        <button
          v-for="name in ['desktop','tablet','mobile']"
          :key="name"
          type="button"
          :class="{ active: modelValue === name }"
          :aria-pressed="modelValue === name"
          @click="emit('update:modelValue', name)"
        >{{ name }}</button>
      </div>
    </header>
    <div class="live-preview-host__stage">
      <div
        ref="previewRoot"
        class="live-preview-host__viewport"
        :style="{ width: viewportWidth }"
        @click="handlePreviewClick"
      >
        <slot :viewport="modelValue" />
      </div>
    </div>
  </section>
</template>

<style scoped>
.live-preview-host{display:grid;min-width:0;align-content:start;gap:10px;padding:10px;border:1px solid var(--line);background:var(--panel);overflow:auto}
.live-preview-host>header{display:flex;align-items:center;justify-content:space-between;gap:10px}
.live-preview-host__viewports{display:flex;align-items:center;gap:6px;flex-wrap:wrap}
.live-preview-host__viewports button{padding:5px 8px;border:1px solid var(--line);background:var(--surface-2);color:var(--ink);cursor:pointer}
.live-preview-host__viewports button.active{background:var(--accent-soft);color:var(--accent)}
.live-preview-host__stage{min-width:0;overflow:auto}
.live-preview-host__viewport{max-width:100%;min-height:160px;margin:auto;padding:16px;border:1px dashed var(--line);background:#fff;color:#111;transition:width .2s}
.live-preview-host__viewport :deep(.is-live-preview-selected){outline:2px solid var(--accent,#2563eb)!important;outline-offset:2px}
.live-preview-host__viewport :deep(img){max-width:100%;height:auto}
</style>
