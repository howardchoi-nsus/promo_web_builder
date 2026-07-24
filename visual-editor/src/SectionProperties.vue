<script setup>
defineProps({
  section: { type: Object, required: true },
  sectionStyle: { type: Object, default: () => ({}) },
  canRunSectionAi: { type: Boolean, default: false },
  primaryAction: { type: Object, default: () => ({ action: "generate", label: "AI 배경 이미지 생성", disabled: false }) },
  hasAiBackground: { type: Boolean, default: false },
  aiProcessing: { type: Boolean, default: false },
});

defineEmits([
  "ai-action",
  "background-alignment",
  "background-fade",
  "update-style",
  "reset-height",
]);
</script>

<template>
  <section class="section-properties" aria-label="섹션 속성">
    <div class="section-properties__heading">
      <strong>섹션 속성</strong>
      <small>{{ section.name }}</small>
    </div>
    <div v-if="canRunSectionAi" class="section-ai-actions">
      <button
        v-if="section.aiDesign?.enabled !== false"
        type="button"
        class="section-ai-action"
        :disabled="primaryAction.disabled"
        @click="$emit('ai-action', 'generate-layout', '', 'layout')"
      >AI 레이아웃 제안</button>
      <button
        v-if="section.aiDesign?.enabled !== false && section.aiDesign?.allowSectionBackground !== false"
        type="button"
        class="section-ai-action"
        :disabled="primaryAction.disabled"
        :title="primaryAction.disabled && !aiProcessing ? '섹션 콘텐츠를 먼저 등록해 주세요.' : ''"
        @click="$emit('ai-action', primaryAction.action, '', 'section-background')"
      >{{ primaryAction.label }}</button>
      <button
        v-if="hasAiBackground"
        type="button"
        class="section-ai-remove"
        @click="$emit('ai-action', 'remove-background')"
      >배경 삭제</button>
    </div>
    <div v-if="hasAiBackground" class="section-background-alignment">
      <span>배경 이미지 정렬</span>
      <div role="group" aria-label="배경 이미지 가로 정렬">
        <button
          v-for="option in [
            { value: 'left', label: '왼쪽' },
            { value: 'center', label: '중앙' },
            { value: 'right', label: '오른쪽' },
          ]"
          :key="option.value"
          type="button"
          :class="{ active: (sectionStyle.backgroundPosition || 'center center') === `${option.value} center` }"
          @click="$emit('background-alignment', option.value)"
        >
          {{ option.label }}
        </button>
      </div>
    </div>
    <div v-if="hasAiBackground || section.aiDesign?.enabled !== false" class="section-background-fade">
      <label>
        <span>배경 이미지 페이드</span>
        <select
          :value="sectionStyle.backgroundFadeMode || 'none'"
          @change="$emit('background-fade', $event.target.value)"
        >
          <option value="none">페이드 없음</option>
          <option value="left">왼쪽 페이드</option>
          <option value="right">오른쪽 페이드</option>
          <option value="both">양끝 페이드</option>
        </select>
      </label>
      <label v-if="(sectionStyle.backgroundFadeMode || 'none') !== 'none'">
        <span>페이드 강도</span>
        <select
          :value="sectionStyle.backgroundFadeStrength || 'medium'"
          @change="$emit('update-style', { backgroundFadeStrength: $event.target.value })"
        >
          <option value="soft">약하게</option>
          <option value="medium">보통</option>
          <option value="strong">강하게</option>
        </select>
      </label>
    </div>
    <div class="section-size-control">
      <div>
        <span>섹션 높이</span>
        <strong>{{ sectionStyle.minHeight ? `${Math.round(sectionStyle.minHeight)}px` : "자동" }}</strong>
      </div>
      <button
        type="button"
        :disabled="!sectionStyle.minHeight"
        @click="$emit('reset-height')"
      >
        높이 초기화
      </button>
    </div>
  </section>
</template>
