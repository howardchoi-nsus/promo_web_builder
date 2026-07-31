<script setup>
defineProps({
  purpose: { type: String, default: "" },
  planning: { type: Boolean, default: false },
  applying: { type: Boolean, default: false },
  error: { type: String, default: "" },
  proposal: { type: Object, default: null },
  hasCandidates: { type: Boolean, default: false },
});
const emit = defineEmits(["update:purpose", "request-plan", "apply", "dismiss"]);
</script>

<template>
  <section class="section-composition-panel ai-section-structure-panel">
    <header><div><strong>AI 컴포넌트 구성</strong><small>활성 컴포넌트 라이브러리 안에서만 조합합니다.</small></div></header>
    <p>이 섹션에는 컴포넌트가 없습니다. 목적과 필요한 내용을 입력해 주세요.</p>
    <label>
      <span>섹션 목적</span>
      <textarea :value="purpose" rows="4" maxlength="1200" placeholder="예: 핵심 혜택 3개와 참여 버튼이 있는 섹션" @input="emit('update:purpose', $event.target.value)"></textarea>
    </label>
    <p v-if="error" class="section-composition-error" role="alert">{{ error }}</p>
    <button type="button" class="section-composition-request" :disabled="!hasCandidates || planning || applying || purpose.trim().length < 3" @click="emit('request-plan')">
      {{ planning ? "구성 제안 생성 중…" : "AI 구성 제안" }}
    </button>
    <small v-if="!hasCandidates">먼저 활성 컴포넌트를 등록해 주세요.</small>
    <div v-if="proposal" class="section-composition-preview">
      <strong>적용 전 확인</strong>
      <p>{{ proposal.rationale }}</p>
      <ol>
        <li v-for="selection in proposal.componentSelections" :key="selection.componentVersionId">
          {{ selection.name }}<span v-if="selection.instanceCount > 1"> × {{ selection.instanceCount }}</span>
        </li>
      </ol>
      <div class="section-composition-actions">
        <button type="button" :disabled="applying" @click="emit('dismiss')">취소</button>
        <button type="button" :disabled="applying" @click="emit('apply')">{{ applying ? "검증 및 적용 중…" : "구성 적용" }}</button>
      </div>
    </div>
  </section>
</template>
