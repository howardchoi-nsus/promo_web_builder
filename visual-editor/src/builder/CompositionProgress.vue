<script setup>
defineProps({
  stage: { type: String, required: true },
  message: { type: String, default: "" },
});
</script>

<template>
  <section class="ai-builder-card ai-composition-progress" role="status" aria-live="polite">
    <span class="ai-spinner" aria-hidden="true" />
    <p class="ai-builder-eyebrow">Composition Engine</p>
    <h1>프로모션 구조를 구성하고 있습니다</h1>
    <p>{{ message || stage }}</p>
  </section>
</template>
