<script setup>
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from "vue";
import PromoPageRenderer from "../PromoPageRenderer.vue";

const props = defineProps({
  snapshot: { type: Object, required: true },
  viewport: { type: String, default: "desktop" },
});

const previewStage = ref(null);
const previewCanvas = ref(null);
const previewScale = ref(1);
const previewHeight = ref(720);
let previewObserver = null;
let previewFrame = 0;

const previewWidth = computed(() => props.viewport === "mobile" ? 390 : 1280);
const previewShellStyle = computed(() => ({
  width: `${Math.max(1, previewWidth.value * previewScale.value)}px`,
  height: `${Math.max(1, previewHeight.value * previewScale.value)}px`,
}));
const previewCanvasStyle = computed(() => ({
  width: `${previewWidth.value}px`,
  transform: `scale(${previewScale.value})`,
}));

function syncPreviewFrame() {
  if (previewFrame) cancelAnimationFrame(previewFrame);
  previewFrame = requestAnimationFrame(() => {
    previewFrame = 0;
    const availableWidth = Math.max(280, Number(previewStage.value?.clientWidth || previewWidth.value) - 32);
    previewScale.value = Math.min(1, availableWidth / previewWidth.value);
    previewHeight.value = Math.max(480, Number(previewCanvas.value?.scrollHeight || 720));
  });
}

onMounted(() => {
  previewObserver = typeof ResizeObserver === "undefined" ? null : new ResizeObserver(syncPreviewFrame);
  if (previewStage.value) previewObserver?.observe(previewStage.value);
  if (previewCanvas.value) previewObserver?.observe(previewCanvas.value);
  syncPreviewFrame();
});

watch(() => [props.snapshot, props.viewport], () => nextTick(syncPreviewFrame), { deep: true });

onBeforeUnmount(() => {
  previewObserver?.disconnect();
  if (previewFrame) cancelAnimationFrame(previewFrame);
});
</script>

<template>
  <div ref="previewStage" class="ai-builder-preview ai-builder-preview-stage" :data-viewport="viewport">
    <div class="ai-builder-preview-shell" :style="previewShellStyle">
      <div ref="previewCanvas" class="ai-builder-preview-canvas" :style="previewCanvasStyle">
        <PromoPageRenderer
          :content="snapshot.content"
          :design-spec="snapshot.designSpec"
          :assets="snapshot.assets"
          :motion-spec="snapshot.motionSpec"
          :editable="false"
          :show-guides="false"
          :viewport-override="viewport"
        />
      </div>
    </div>
  </div>
</template>
