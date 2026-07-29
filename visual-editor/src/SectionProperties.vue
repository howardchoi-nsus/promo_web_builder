<script setup>
import { computed, ref } from "vue";

const props = defineProps({
  section: { type: Object, required: true },
  sectionStyle: { type: Object, default: () => ({}) },
  canRunSectionAi: { type: Boolean, default: false },
  primaryAction: { type: Object, default: () => ({ action: "generate", label: "AI 키비주얼 생성", disabled: false }) },
  hasAiBackground: { type: Boolean, default: false },
  aiProcessing: { type: Boolean, default: false },
});

const emit = defineEmits([
  "ai-action",
  "background-alignment",
  "background-fade",
  "update-style",
  "reset-height",
]);

const keyVisualTextMode = ref("none");
const keyVisualText = ref("");
const keyVisualTextInvalid = computed(() => (
  keyVisualTextMode.value === "explicit" && !keyVisualText.value.trim()
));

function requestKeyVisual() {
  if (props.primaryAction.disabled || keyVisualTextInvalid.value) return;
  emit("ai-action", props.primaryAction.action, "", "section-background", {
    keyVisualTextMode: keyVisualTextMode.value,
    keyVisualText: keyVisualTextMode.value === "explicit" ? keyVisualText.value.trim() : "",
  });
}
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
        :disabled="primaryAction.disabled || keyVisualTextInvalid"
        :title="primaryAction.disabled && !aiProcessing ? '섹션 콘텐츠를 먼저 등록해 주세요.' : keyVisualTextInvalid ? '키비주얼 문구를 입력해 주세요.' : ''"
        @click="requestKeyVisual"
      >{{ primaryAction.label }}</button>
      <button
        v-if="hasAiBackground"
        type="button"
        class="section-ai-remove"
        @click="$emit('ai-action', 'remove-background')"
      >키비주얼 삭제</button>
    </div>
    <div
      v-if="section.aiDesign?.enabled !== false && section.aiDesign?.allowSectionBackground !== false"
      class="key-visual-text-policy"
    >
      <label>
        <span>키비주얼 텍스트</span>
        <select v-model="keyVisualTextMode">
          <option value="none">텍스트 없음</option>
          <option value="explicit">승인 문구 사용</option>
        </select>
      </label>
      <label v-if="keyVisualTextMode === 'explicit'">
        <span>승인 문구</span>
        <input
          v-model="keyVisualText"
          type="text"
          maxlength="40"
          placeholder="예: SUMMER DROP"
        />
      </label>
      <small>메인 타이틀·리드·설명·CTA는 이미지에 포함되지 않습니다. 승인 문구는 최대 4단어입니다.</small>
    </div>
    <div v-if="hasAiBackground" class="section-background-fit">
      <label>
        <span>키비주얼 채우기</span>
        <select
          :value="sectionStyle.backgroundFitMode || (sectionStyle.backgroundSize === '100% auto' ? 'width-fill' : sectionStyle.backgroundSize) || 'cover'"
          @change="$emit('update-style', {
            backgroundFitMode: $event.target.value,
            backgroundSize: $event.target.value === 'width-fill' ? '100% auto' : $event.target.value,
          })"
        >
          <option
            v-for="mode in (sectionStyle.backgroundAllowedFitModes || ['cover', 'contain', 'width-fill'])"
            :key="mode"
            :value="mode"
          >{{ mode }}</option>
        </select>
      </label>
    </div>
    <div v-if="hasAiBackground" class="section-background-alignment">
      <span>키비주얼 정렬</span>
      <div role="group" aria-label="키비주얼 가로 정렬">
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
        <span>키비주얼 페이드</span>
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
