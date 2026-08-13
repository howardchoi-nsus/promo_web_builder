<script setup>
import AiExecutionIndicator from "./AiExecutionIndicator.vue";

defineProps({
  stage: { type: String, required: true },
  message: { type: String, default: "" },
  execution: { type: Object, default: null },
});
</script>

<template>
  <section class="ai-builder-card ai-composition-progress" role="status" aria-live="polite">
    <p class="ai-builder-eyebrow">Composition Engine</p>
    <h1>프로모션 구조를 구성하고 있습니다</h1>
    <AiExecutionIndicator :message="message || 'AI가 요청을 수행하고 있습니다.'" :execution="execution" />
  </section>
</template>
