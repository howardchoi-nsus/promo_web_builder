<script setup>
import { computed, ref } from "vue";
import TokenUsageReport from "./TokenUsageReport.vue";
import CompositionPreviewCanvas from "./CompositionPreviewCanvas.vue";

const props = defineProps({
  snapshot: { type: Object, required: true },
  controlsTarget: { type: String, default: "" },
  documentRevision: { type: Number, required: true },
  busy: { type: Boolean, default: false },
  exportEnabled: { type: Boolean, default: false },
  viewport: { type: String, default: "desktop" },
  qualityGate: { type: Object, default: null },
});
const emit = defineEmits([
  "edit-natural-language", "rollback", "open-editor", "open-output", "export-document", "update:viewport",
  "check-quality",
]);
const previewCanvasRef = ref(null);
const previewViewport = computed({
  get: () => props.viewport,
  set: (viewport) => emit("update:viewport", viewport),
});

function selectPreviewViewport(viewport) {
  previewViewport.value = viewport;
}

const viewportLabel = computed(() => props.snapshot.content?.pageSchema ? "Desktop · Tablet · Mobile" : "Desktop · Mobile");
const qualityState = computed(() => props.qualityGate?.state || "pending");
const qualityPassed = computed(() => (
  qualityState.value === "passed"
  && Number(props.qualityGate?.documentRevision || 0) === Number(props.documentRevision || 0)
  && Number(props.qualityGate?.blockingCount || 0) === 0
));
const qualityLabel = computed(() => {
  if (qualityState.value === "checking") return `${viewportLabel.value} 품질 검사 중`;
  if (qualityPassed.value) {
    const warnings = Number(props.qualityGate?.warningCount || 0);
    return warnings ? `품질 검사 통과 · 경고 ${warnings}건` : "품질 검사 통과";
  }
  if (qualityState.value === "failed") {
    return props.qualityGate?.message || `품질 검사 차단 · ${Number(props.qualityGate?.blockingCount || 0)}건`;
  }
  return `출력 전에 ${viewportLabel.value} 품질 검사가 필요합니다.`;
});

function inspectQualityAcrossViewports() {
  return previewCanvasRef.value?.inspectQualityAcrossViewports?.();
}

function buildAutoRepairSnapshot(snapshot, result) {
  return previewCanvasRef.value?.buildAutoRepairSnapshot?.(snapshot, result);
}

defineExpose({ buildAutoRepairSnapshot, inspectQualityAcrossViewports });
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
          <button v-if="snapshot.content?.pageSchema" type="button" :aria-pressed="previewViewport === 'tablet'" @click="selectPreviewViewport('tablet')">태블릿</button>
          <button type="button" :aria-pressed="previewViewport === 'mobile'" @click="selectPreviewViewport('mobile')">모바일</button>
        </div>
        <Teleport :to="controlsTarget || 'body'" :disabled="!controlsTarget">
          <div class="ai-builder-actions" aria-label="디자인 작업">
        <button type="button" class="ai-builder-secondary" @click="emit('rollback')">이전 버전</button>
        <button type="button" class="ai-builder-secondary" @click="emit('edit-natural-language')">채팅으로 수정</button>
        <button type="button" class="ai-builder-primary" @click="emit('open-editor')">직접 편집</button>
        <button type="button" class="ai-builder-primary" :disabled="busy || !qualityPassed" @click="emit('open-output')">새 창에서 확인</button>
        <button v-if="exportEnabled" type="button" class="ai-builder-primary" :disabled="busy || !qualityPassed" @click="emit('export-document')">HTML 다운로드</button>
          </div>
        </Teleport>
      </div>
    </header>
    <p class="ai-builder-preview-note">이 화면은 실제 발행에 사용하는 데이터와 렌더러로 표시됩니다. 데스크톱과 모바일을 전환해 확인하세요.</p>
    <div class="ai-builder-quality-gate" :class="`is-${qualityState}`" role="status" aria-live="polite">
      <span aria-hidden="true"></span>
      <strong>{{ qualityLabel }}</strong>
      <Teleport :to="controlsTarget || 'body'" :disabled="!controlsTarget">
      <button
        v-if="!qualityPassed && qualityState !== 'checking'"
        type="button"
        class="ai-builder-secondary"
        :disabled="busy"
        @click="emit('check-quality')"
      >다시 검사</button>
      </Teleport>
    </div>
    <TokenUsageReport :snapshot="snapshot" />
    <CompositionPreviewCanvas ref="previewCanvasRef" :snapshot="snapshot" :viewport="previewViewport" />
  </section>
</template>
