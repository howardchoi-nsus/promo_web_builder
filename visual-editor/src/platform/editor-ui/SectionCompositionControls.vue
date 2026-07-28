<script setup>
defineProps({
  instruction: { type: String, default: "" },
  generateBackgroundImage: { type: Boolean, default: false },
  imageGuidance: { type: String, default: "" },
  fadeMode: { type: String, default: "none" },
  planning: { type: Boolean, default: false },
  applying: { type: Boolean, default: false },
  error: { type: String, default: "" },
  proposal: { type: Object, default: null },
});

const emit = defineEmits([
  "update:instruction", "update:generate-background-image", "update:image-guidance",
  "update:fade-mode", "request-plan", "apply", "dismiss",
]);
</script>

<template>
  <section class="section-composition-panel">
    <header>
      <div>
        <strong>AI 섹션 구성</strong>
        <small>현재 섹션의 기존 컴포넌트만 사용합니다.</small>
      </div>
    </header>
    <label>
      <span>구성 요청</span>
      <textarea
        :value="instruction"
        rows="4"
        maxlength="4000"
        placeholder="예: 100% 이벤트 타이틀과 안내 문구, 참여 버튼을 강조해서 구성해줘."
        @input="emit('update:instruction', $event.target.value)"
      ></textarea>
    </label>
    <label class="app-checkbox toggle-field">
      <input
        type="checkbox"
        :checked="generateBackgroundImage"
        @change="emit('update:generate-background-image', $event.target.checked)"
      />
      <span>섹션 배경 이미지도 생성</span>
    </label>
    <template v-if="generateBackgroundImage">
      <label>
        <span>배경 이미지 추가 지침</span>
        <textarea
          :value="imageGuidance"
          rows="2"
          maxlength="1200"
          @input="emit('update:image-guidance', $event.target.value)"
        ></textarea>
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
    </template>
    <p v-if="error" class="section-composition-error" role="alert">{{ error }}</p>
    <button
      type="button"
      class="section-composition-request"
      :disabled="planning || applying || instruction.trim().length < 3"
      @click="emit('request-plan')"
    >{{ planning ? "구성 제안 생성 중…" : "구성 제안" }}</button>

    <div v-if="proposal" class="section-composition-preview">
      <strong>적용 전 확인</strong>
      <p>{{ proposal.rationale }}</p>
      <dl>
        <div><dt>콘텐츠 변경</dt><dd>{{ proposal.contentChanges?.length || 0 }}개</dd></div>
        <div><dt>토큰 적용</dt><dd>{{ proposal.tokenBindings?.length || 0 }}개</dd></div>
        <div><dt>배경 생성</dt><dd>{{ proposal.backgroundImage?.requested ? "포함" : "없음" }}</dd></div>
      </dl>
      <ul v-if="proposal.contentChanges?.length">
        <li v-for="change in proposal.contentChanges" :key="`${change.itemKey}.${change.fieldKey || ''}`">
          <strong>{{ change.name }}</strong>
          <span>{{ typeof change.after === "object" ? change.after?.label : change.after }}</span>
        </li>
      </ul>
      <p v-for="missing in proposal.missingInputs || []" :key="`${missing.field}.${missing.reason}`" class="section-composition-warning">
        {{ missing.field }}: {{ missing.reason }}
      </p>
      <div class="section-composition-actions">
        <button type="button" :disabled="applying" @click="emit('dismiss')">취소</button>
        <button type="button" :disabled="applying" @click="emit('apply')">
          {{ applying ? "검증 및 적용 중…" : "적용" }}
        </button>
      </div>
    </div>
  </section>
</template>
