<script setup>
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from "vue";
import PromoPageRenderer from "../PromoPageRenderer.vue";

const props = defineProps({
  snapshot: { type: Object, required: true },
  documentRevision: { type: Number, required: true },
  busy: { type: Boolean, default: false },
  exportEnabled: { type: Boolean, default: false },
});
const emit = defineEmits(["edit-natural-language", "rollback", "open-editor", "open-output", "export-document"]);
const previewViewport = ref("desktop");
const previewStage = ref(null);
const previewCanvas = ref(null);
const previewScale = ref(1);
const previewHeight = ref(720);
let previewObserver = null;
let previewFrame = 0;

const previewWidth = computed(() => previewViewport.value === "mobile" ? 390 : 1280);
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

function selectPreviewViewport(viewport) {
  previewViewport.value = viewport;
  nextTick(syncPreviewFrame);
}

onMounted(() => {
  previewObserver = typeof ResizeObserver === "undefined" ? null : new ResizeObserver(syncPreviewFrame);
  if (previewStage.value) previewObserver?.observe(previewStage.value);
  if (previewCanvas.value) previewObserver?.observe(previewCanvas.value);
  syncPreviewFrame();
});

watch(() => props.snapshot, () => nextTick(syncPreviewFrame), { deep: true });

onBeforeUnmount(() => {
  previewObserver?.disconnect();
  if (previewFrame) cancelAnimationFrame(previewFrame);
});
</script>

<template>
  <section class="ai-builder-result">
    <header class="ai-builder-result__toolbar">
      <div>
        <p class="ai-builder-eyebrow">실제 웹페이지 미리보기</p>
        <strong>현재 디자인 · Revision {{ documentRevision }}</strong>
        <span class="ai-builder-readonly-badge">발행 결과와 동일한 렌더러</span>
      </div>
      <div class="ai-builder-actions">
        <div class="ai-builder-preview-viewport" role="group" aria-label="미리보기 화면 크기">
          <button type="button" :aria-pressed="previewViewport === 'desktop'" @click="selectPreviewViewport('desktop')">데스크톱</button>
          <button type="button" :aria-pressed="previewViewport === 'mobile'" @click="selectPreviewViewport('mobile')">모바일</button>
        </div>
        <button type="button" class="ai-builder-secondary" @click="emit('rollback')">이전 버전</button>
        <button type="button" class="ai-builder-secondary" @click="emit('edit-natural-language')">채팅으로 수정</button>
        <button type="button" class="ai-builder-primary" @click="emit('open-editor')">직접 편집</button>
        <button type="button" class="ai-builder-primary" @click="emit('open-output')">새 창에서 확인</button>
        <button v-if="exportEnabled" type="button" class="ai-builder-primary" @click="emit('export-document')">HTML 다운로드</button>
      </div>
    </header>
    <p class="ai-builder-preview-note">이 화면은 실제 발행에 사용하는 데이터와 렌더러로 표시됩니다. 데스크톱과 모바일을 전환해 확인하세요.</p>
    <div ref="previewStage" class="ai-builder-preview ai-builder-preview-stage" :data-viewport="previewViewport">
      <div class="ai-builder-preview-shell" :style="previewShellStyle">
        <div ref="previewCanvas" class="ai-builder-preview-canvas" :style="previewCanvasStyle">
          <PromoPageRenderer
            :content="snapshot.content"
            :design-spec="snapshot.designSpec"
            :assets="snapshot.assets"
            :motion-spec="snapshot.motionSpec"
            :editable="false"
            :show-guides="false"
            :viewport-override="previewViewport"
          />
        </div>
      </div>
    </div>
  </section>
</template>
