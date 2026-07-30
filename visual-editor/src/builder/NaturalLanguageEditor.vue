<script setup>
import { ref } from "vue";

defineProps({
  busy: { type: Boolean, default: false },
});
const emit = defineEmits(["submit", "cancel"]);
const value = ref("");
</script>

<template>
  <form class="ai-builder-card ai-operation-form" @submit.prevent="emit('submit', value)">
    <p class="ai-builder-eyebrow">Natural-language Edit</p>
    <h2>어떤 부분을 수정할까요?</h2>
    <textarea v-model="value" rows="4" maxlength="3000" placeholder="예: 혜택 섹션을 위로 이동하고 제목을 더 짧게 바꿔줘." />
    <div class="ai-builder-actions">
      <button type="button" class="ai-builder-secondary" @click="emit('cancel')">취소</button>
      <button type="submit" class="ai-builder-primary" :disabled="busy || !value.trim()">수정 제안</button>
    </div>
  </form>
</template>
