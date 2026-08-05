<script setup>
defineProps({
  proposal: { type: Object, required: true },
  busy: { type: Boolean, default: false },
});
const emit = defineEmits(["apply", "cancel"]);
</script>

<template>
  <section class="ai-builder-card operation-proposal-review">
    <p class="ai-builder-eyebrow">Natural Language Change Review</p>
    <h1>자연어 수정 내용을 확인해 주세요</h1>
    <p>{{ proposal.summary || "요청한 변경을 문서에 적용합니다." }}</p>
    <ol class="operation-proposal-list">
      <li v-for="operation in proposal.operations" :key="operation.operationId">
        <strong>{{ operation.type }}</strong>
        <span>{{ operation.reason || operation.targetInstanceId || operation.sourceVersionId }}</span>
      </li>
    </ol>
    <p v-for="warning in proposal.warnings || []" :key="warning" class="operation-proposal-warning">
      {{ warning }}
    </p>
    <div class="ai-builder-actions">
      <button type="button" class="ai-builder-secondary" :disabled="busy" @click="emit('cancel')">취소</button>
      <button type="button" class="ai-builder-primary" :disabled="busy" @click="emit('apply')">
        {{ busy ? "적용 중…" : "변경 적용" }}
      </button>
    </div>
  </section>
</template>
