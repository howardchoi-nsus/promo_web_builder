<script setup>
import { computed, onBeforeUnmount, onMounted, ref } from "vue";

const props = defineProps({
  anchorRect: { type: Object, default: null },
  title: { type: String, default: "컴포넌트 속성" },
  subtitle: { type: String, default: "" },
  locked: { type: Boolean, default: false },
});

const emit = defineEmits(["close"]);
const popoverRef = ref(null);
const POPOVER_WIDTH = 360;
const VIEWPORT_MARGIN = 12;
const ANCHOR_GAP = 12;

const popoverStyle = computed(() => {
  const anchor = props.anchorRect;
  if (!anchor) return { visibility: "hidden" };

  const viewportWidth = window.innerWidth;
  const viewportHeight = window.innerHeight;
  const popoverWidth = Math.min(POPOVER_WIDTH, viewportWidth - (VIEWPORT_MARGIN * 2));
  const availableRight = viewportWidth - anchor.right - VIEWPORT_MARGIN;
  const preferredLeft = availableRight >= popoverWidth + ANCHOR_GAP
    ? anchor.right + ANCHOR_GAP
    : anchor.left - popoverWidth - ANCHOR_GAP;
  const left = Math.min(
    viewportWidth - popoverWidth - VIEWPORT_MARGIN,
    Math.max(VIEWPORT_MARGIN, preferredLeft),
  );
  const top = Math.min(
    viewportHeight - 160,
    Math.max(VIEWPORT_MARGIN, anchor.top),
  );

  return {
    left: `${left}px`,
    top: `${top}px`,
    maxHeight: `${Math.max(148, viewportHeight - top - VIEWPORT_MARGIN)}px`,
  };
});

function handleKeydown(event) {
  if (event.key !== "Escape" || event.defaultPrevented) return;
  event.preventDefault();
  emit("close");
}

onMounted(() => document.addEventListener("keydown", handleKeydown));
onBeforeUnmount(() => document.removeEventListener("keydown", handleKeydown));
</script>

<template>
  <aside
    ref="popoverRef"
    class="component-inspector-popover"
    :style="popoverStyle"
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
      <button type="button" aria-label="컴포넌트 속성 닫기" @click="emit('close')">×</button>
    </header>
    <div class="component-inspector-popover__body">
      <slot></slot>
    </div>
  </aside>
</template>
