<script setup>
const props = defineProps({
  modelValue: { type: Object, required: true },
  busy: { type: Boolean, default: false },
});
const emit = defineEmits(["update:modelValue", "confirm", "back"]);
const fields = [
  ["title", "프로모션 제목"],
  ["leadText", "리드 텍스트"],
  ["ctaLabel", "CTA Label"],
  ["promotionPurpose", "프로모션 목적"],
  ["market", "마켓 / 지역"],
  ["audience", "대상 고객"],
  ["campaignTone", "캠페인 톤"],
  ["mainOffer", "핵심 혜택"],
];

function updateField(key, value) {
  emit("update:modelValue", { ...props.modelValue, [key]: value });
}
</script>

<template>
  <section class="ai-builder-card">
    <p class="ai-builder-eyebrow">Overview Review</p>
    <h1>AI 분석 결과를 확인하세요</h1>
    <p>틀린 내용이나 미확정 항목을 수정한 뒤 프로모션 구성을 시작할 수 있습니다.</p>
    <div class="ai-overview-grid">
      <label v-for="[key, label] in fields" :key="key" class="ai-builder-field">
        <span>{{ label }}</span>
        <textarea
          v-if="key === 'mainOffer'"
          rows="3"
          :value="modelValue[key] || ''"
          @input="updateField(key, $event.target.value)"
        />
        <input
          v-else
          type="text"
          :maxlength="key === 'ctaLabel' ? 20 : undefined"
          :value="modelValue[key] || ''"
          @input="updateField(key, $event.target.value)"
        />
      </label>
    </div>
    <div class="ai-builder-actions">
      <button type="button" class="ai-builder-secondary" @click="emit('back')">다시 입력</button>
      <button type="button" class="ai-builder-primary" :disabled="busy" @click="emit('confirm')">
        {{ busy ? "구성 준비 중…" : "AI로 프로모션 생성하기" }}
      </button>
    </div>
  </section>
</template>
