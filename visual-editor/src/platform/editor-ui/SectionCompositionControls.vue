<script setup>
defineProps({
  instruction: { type: String, default: "" },
  fadeMode: { type: String, default: "none" },
  keyVisualTextMode: { type: String, default: "none" },
  keyVisualText: { type: String, default: "" },
  planning: { type: Boolean, default: false },
  applying: { type: Boolean, default: false },
  error: { type: String, default: "" },
  proposal: { type: Object, default: null },
});

const emit = defineEmits([
  "update:instruction",
  "update:fade-mode", "update:key-visual-text-mode", "update:key-visual-text",
  "request-plan", "apply", "dismiss",
]);
</script>

<template>
  <section class="section-composition-panel">
    <header>
      <div>
        <strong>AI 도우미</strong>
        <small>현재 레이아웃과 컴포넌트를 유지한 채 섹션 키비주얼을 만듭니다.</small>
      </div>
    </header>
    <details class="section-composition-assistant">
      <summary>AI 키비주얼 만들기</summary>
      <label>
        <span>디자인 요청 사항</span>
        <textarea
          :value="instruction"
          rows="4"
          maxlength="4000"
          placeholder="예: 여름 프로모션 분위기의 밝고 역동적인 키비주얼을 만들어줘."
          @input="emit('update:instruction', $event.target.value)"
        ></textarea>
      </label>
      <label>
        <span>키비주얼 텍스트</span>
        <select
          :value="keyVisualTextMode"
          @change="emit('update:key-visual-text-mode', $event.target.value)"
        >
          <option value="none">텍스트 없음</option>
          <option value="explicit">승인 문구 사용</option>
        </select>
      </label>
      <label v-if="keyVisualTextMode === 'explicit'">
        <span>승인 문구</span>
        <input
          :value="keyVisualText"
          type="text"
          maxlength="40"
          placeholder="예: SUMMER DROP"
          @input="emit('update:key-visual-text', $event.target.value)"
        />
        <small>메인 타이틀·리드·설명·CTA와 다른 문구만 사용할 수 있습니다.</small>
      </label>
      <label>
        <span>페이드</span>
        <select :value="fadeMode" @change="emit('update:fade-mode', $event.target.value)">
          <option value="none">없음</option>
          <option value="left">왼쪽</option>
          <option value="right">오른쪽</option>
          <option value="both">양끝</option>
        </select>
      </label>
      <p v-if="error" class="section-composition-error" role="alert">{{ error }}</p>
      <button
        type="button"
        class="section-composition-request"
        :disabled="planning || applying || instruction.trim().length < 3 || (keyVisualTextMode === 'explicit' && !keyVisualText.trim())"
        @click="emit('request-plan')"
      >{{ planning ? "키비주얼 제안 생성 중…" : "키비주얼 제안" }}</button>

      <div v-if="proposal" class="section-composition-preview">
        <strong>적용 전 확인</strong>
        <p>{{ proposal.rationale }}</p>
        <dl>
          <div><dt>레이아웃·문구</dt><dd>유지</dd></div>
          <div><dt>키비주얼 생성</dt><dd>{{ proposal.backgroundImage?.requested ? "포함" : "없음" }}</dd></div>
        </dl>
        <p v-for="missing in proposal.missingInputs || []" :key="`${missing.field}.${missing.reason}`" class="section-composition-warning">
          {{ missing.field }}: {{ missing.reason }}
        </p>
        <div class="section-composition-actions">
          <button type="button" :disabled="applying" @click="emit('dismiss')">취소</button>
          <button type="button" :disabled="applying" @click="emit('apply')">
            {{ applying ? "검증 및 적용 중…" : "키비주얼 적용" }}
          </button>
        </div>
      </div>
    </details>
  </section>
</template>
