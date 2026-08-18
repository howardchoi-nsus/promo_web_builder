<script setup>
import { computed } from "vue";

const props = defineProps({
  message: { type: String, required: true },
  emphasis: { type: String, default: "" },
  execution: { type: Object, default: null },
});

const iconText = computed(() => ({ openai: "OA", google: "G", anthropic: "A" }[props.execution?.providerIconKey] || "AI"));
const messageParts = computed(() => {
  const emphasis = String(props.emphasis || "");
  const index = emphasis ? props.message.indexOf(emphasis) : -1;
  if (index < 0) return { before: props.message, emphasis: "", after: "" };
  return {
    before: props.message.slice(0, index),
    emphasis,
    after: props.message.slice(index + emphasis.length),
  };
});
</script>

<template>
  <div class="ai-execution-indicator" role="status" aria-live="polite" aria-atomic="true">
    <strong class="ai-execution-indicator__message">
      <span>{{ messageParts.before }}</span><span
        v-if="messageParts.emphasis"
        class="ai-execution-indicator__emphasis"
      >{{ messageParts.emphasis }}</span><span>{{ messageParts.after }}</span>
    </strong>
    <slot name="visual" />
    <span v-if="execution" class="ai-execution-indicator__model">
      <span class="ai-execution-indicator__icon" :data-provider="execution.providerIconKey" aria-hidden="true">{{ iconText }}</span>
      <span>
        <small>수행 중인 LLM</small>
        <b>{{ execution.providerLabel }} · {{ execution.modelLabel }}</b>
      </span>
    </span>
    <span v-else class="ai-execution-indicator__model ai-execution-indicator__model--pending">
      <span class="ai-execution-indicator__icon" aria-hidden="true">AI</span>
      <span><small>수행 중인 LLM</small><b>모델 정보를 확인하고 있습니다</b></span>
    </span>
  </div>
</template>
