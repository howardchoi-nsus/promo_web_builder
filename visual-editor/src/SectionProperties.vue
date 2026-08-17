<script setup>
defineProps({
  section: { type: Object, required: true },
  sectionStyle: { type: Object, default: () => ({}) },
  hasAiBackground: { type: Boolean, default: false },
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
    <div v-if="hasAiBackground" class="section-ai-actions">
      <button
        type="button"
        class="section-ai-remove"
        @click="$emit('ai-action', 'remove-background')"
      >키비주얼 삭제</button>
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
    <div v-if="hasAiBackground" class="section-background-fade">
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
      <label>
        <span>높이 (px)</span>
        <input
          type="number"
          min="50"
          max="24000"
          step="1"
          :value="sectionStyle.minHeight || ''"
          placeholder="자동"
          @change="$emit('update-style', {
            minHeight: $event.target.value === ''
              ? undefined
              : Math.min(24000, Math.max(50, Number($event.target.value) || 50)),
          })"
        />
      </label>
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
