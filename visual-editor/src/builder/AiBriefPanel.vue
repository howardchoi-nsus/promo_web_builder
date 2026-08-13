<script setup>
import AiExecutionIndicator from "./AiExecutionIndicator.vue";

defineProps({
  modelValue: { type: String, default: "" },
  busy: { type: Boolean, default: false },
  execution: { type: Object, default: null },
});
const emit = defineEmits(["update:modelValue", "analyze"]);
</script>

<template>
  <section class="ai-builder-card">
    <p class="ai-builder-eyebrow">AI Brief</p>
    <h1>어떤 프로모션을 만들까요?</h1>
    <p>제목이나 조건이 완성되지 않아도 됩니다. 대상, 혜택, 시즌 또는 원하는 분위기를 간단히 설명하세요.</p>
    <label class="ai-builder-field">
      <span>프로모션 설명</span>
      <textarea
        :value="modelValue"
        rows="8"
        maxlength="5000"
        placeholder="예: 여름 시즌 신규 고객을 위한 충전 이벤트를 만들고 싶어요."
        @input="emit('update:modelValue', $event.target.value)"
      />
    </label>
    <button
      class="ai-builder-primary"
      type="button"
      :disabled="busy || !modelValue.trim()"
      @click="emit('analyze')"
    >
      {{ busy ? "개요 분석 중…" : "AI 개요 분석" }}
    </button>
    <AiExecutionIndicator v-if="busy" message="프로모션 개요를 분석하고 있습니다." :execution="execution" />
  </section>
</template>
