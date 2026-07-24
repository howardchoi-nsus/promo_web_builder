<script setup>
defineProps({
  selectedCount: { type: Number, default: 0 },
  revision: { type: Number, default: 0 },
  planning: { type: Boolean, default: false },
  error: { type: String, default: "" },
  suggestion: { type: Object, default: null },
  undoCount: { type: Number, default: 0 },
  operationLabel: { type: Function, required: true },
});

const emit = defineEmits([
  "clear-selection",
  "request-suggestion",
  "undo",
  "apply-suggestion",
  "dismiss-suggestion",
]);

function afterGeometry(suggestion, itemKey) {
  return suggestion?.after?.find((item) => item.itemKey === itemKey) || {};
}
</script>

<template>
  <section class="multi-layout-panel">
    <div class="multi-layout-panel__heading">
      <div>
        <strong>AI 다중 정렬</strong>
        <small>{{ selectedCount }}개 컴포넌트 선택 · revision {{ revision }}</small>
      </div>
      <button type="button" :disabled="selectedCount <= 1" @click="emit('clear-selection')">선택 초기화</button>
    </div>
    <p>아래 체크박스 또는 Ctrl/Cmd+미리보기 클릭으로 같은 섹션의 컴포넌트를 2개 이상 선택하세요.</p>
    <div class="multi-layout-panel__actions">
      <button
        type="button"
        class="section-ai-action"
        :disabled="selectedCount < 2 || planning"
        @click="emit('request-suggestion')"
      >{{ planning ? "AI 제안 생성 중" : "AI 정렬 제안" }}</button>
      <button type="button" :disabled="!undoCount" @click="emit('undo')">마지막 적용 취소</button>
    </div>
    <p v-if="error" class="multi-layout-error" role="alert">{{ error }}</p>
    <div v-if="suggestion" class="multi-layout-preview">
      <strong>{{ operationLabel(suggestion.operation) }}</strong>
      <span>{{ suggestion.rationale }}</span>
      <span v-if="suggestion.adjusted" class="multi-layout-adjustment">{{ suggestion.adjustmentReason }}</span>
      <small v-if="suggestion.gapToken">간격: {{ suggestion.gapToken }}</small>
      <div class="multi-layout-preview__comparison">
        <div v-for="before in suggestion.before" :key="before.itemKey">
          <b>{{ before.itemKey }}</b>
          <span>전 X {{ Math.round(before.xPct) }}% · Y {{ Math.round(before.yPx) }}px</span>
          <span>후 X {{ Math.round(afterGeometry(suggestion, before.itemKey).xPct || 0) }}% · Y {{ Math.round(afterGeometry(suggestion, before.itemKey).yPx || 0) }}px</span>
        </div>
      </div>
      <div class="multi-layout-panel__actions">
        <button type="button" class="section-ai-action" @click="emit('apply-suggestion')">제안 적용</button>
        <button type="button" @click="emit('dismiss-suggestion')">취소</button>
      </div>
    </div>
  </section>
</template>
