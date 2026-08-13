<script setup>
import { computed, nextTick, onBeforeUnmount, onMounted, ref } from "vue";
import { resolveContextualInspectorPlacement } from "./contextual-inspector-placement.mjs";

const props = defineProps({
  anchorRect: { type: Object, default: null },
  title: { type: String, default: "컴포넌트 속성" },
  subtitle: { type: String, default: "" },
  locked: { type: Boolean, default: false },
  anchorKey: { type: String, default: "" },
});

const emit = defineEmits(["close"]);
const popoverRef = ref(null);
const viewportRevision = ref(0);
let previousFocus = null;

const placement = computed(() => {
  viewportRevision.value;
  return resolveContextualInspectorPlacement({
    anchorRect: props.anchorRect,
    viewportRect: { width: window.innerWidth, height: window.innerHeight },
    popoverRect: {
      width: popoverRef.value?.offsetWidth || 360,
      height: popoverRef.value?.offsetHeight || 480,
    },
  });
});

const popoverStyle = computed(() => {
  const value = placement.value;
  if (value.visibility === "hidden") return { visibility: "hidden" };
  return Object.fromEntries(
    Object.entries(value)
      .filter(([key]) => key !== "placement")
      .map(([key, item]) => [key, typeof item === "number" ? `${item}px` : item]),
  );
});

function restoreAnchorFocus() {
  nextTick(() => {
    const escapedKey = props.anchorKey && typeof CSS !== "undefined" && CSS.escape ? CSS.escape(props.anchorKey) : "";
    const anchor = escapedKey ? document.querySelector(`[data-style-key="${escapedKey}"]`) : null;
    const target = anchor || previousFocus;
    if (target instanceof HTMLElement) target.focus({ preventScroll: true });
  });
}

function close() {
  emit("close");
  restoreAnchorFocus();
}

function handleKeydown(event) {
  if (event.key !== "Escape" || event.defaultPrevented) return;
  const editingTarget = event.target?.closest?.('[contenteditable="true"], input, textarea, select');
  if (editingTarget && !popoverRef.value?.contains(editingTarget)) return;
  event.preventDefault();
  close();
}

function handlePointerdown(event) {
  if (popoverRef.value?.contains(event.target)
    || event.target?.closest?.("[data-style-key], .text-editor-controls, .preview-stage, .page-tree")) return;
  close();
}

function handleViewportChange() {
  viewportRevision.value += 1;
}

onMounted(() => {
  previousFocus = document.activeElement;
  document.addEventListener("keydown", handleKeydown);
  document.addEventListener("pointerdown", handlePointerdown);
  window.addEventListener("resize", handleViewportChange, { passive: true });
  nextTick(handleViewportChange);
});
onBeforeUnmount(() => {
  document.removeEventListener("keydown", handleKeydown);
  document.removeEventListener("pointerdown", handlePointerdown);
  window.removeEventListener("resize", handleViewportChange);
});
</script>

<template>
  <aside
    ref="popoverRef"
    class="component-inspector-popover"
    :style="popoverStyle"
    :data-placement="placement.placement"
    role="dialog"
    aria-modal="false"
    aria-labelledby="component-inspector-title"
  >
    <header class="component-inspector-popover__header">
      <div>
        <span>COMPONENT</span>
        <strong id="component-inspector-title">{{ title }}</strong>
        <small v-if="subtitle">{{ subtitle }}</small>
      </div>
      <span v-if="locked" class="component-inspector-popover__locked">고정</span>
      <button type="button" aria-label="컴포넌트 속성 닫기" @click="close">×</button>
    </header>
    <div class="component-inspector-popover__body">
      <slot></slot>
    </div>
  </aside>
</template>
