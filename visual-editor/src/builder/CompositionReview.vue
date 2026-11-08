<script setup>
import { computed } from "vue";
import CompositionPreviewCanvas from "./CompositionPreviewCanvas.vue";

const props = defineProps({
  snapshot: { type: Object, required: true },
  documentRevision: { type: Number, required: true },
  busy: { type: Boolean, default: false },
  exportEnabled: { type: Boolean, default: false },
  viewport: { type: String, default: "desktop" },
});
const emit = defineEmits([
  "edit-natural-language", "rollback", "open-editor", "open-output", "export-document", "update:viewport",
]);
const previewViewport = computed({
  get: () => props.viewport,
  set: (viewport) => emit("update:viewport", viewport),
});

function selectPreviewViewport(viewport) {
  previewViewport.value = viewport;
}
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
    <CompositionPreviewCanvas :snapshot="snapshot" :viewport="previewViewport" />
  </section>
</template>
