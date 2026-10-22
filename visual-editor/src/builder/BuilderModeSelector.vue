<script setup>
defineProps({
  aiEnabled: { type: Boolean, default: true },
});
const emit = defineEmits(["select"]);
</script>

<template>
  <section class="ai-mode-selector" aria-labelledby="builder-mode-title">
    <p class="ai-builder-eyebrow">Promotion Builder</p>
    <h1 id="builder-mode-title">프로모션 제작 방식을 선택하세요</h1>
    <p>콘텐츠 구조부터 빠르게 잡거나, 템플릿과 AI를 활용해 프로모션을 완성할 수 있습니다.</p>
    <div class="ai-mode-grid">
      <button type="button" @click="emit('select', 'wireframe')">
        <strong>와이어프레임 모드</strong>
        <span>트리에서 콘텐츠와 순서를 편집하며 화면 구조를 실시간으로 확인합니다.</span>
      </button>
      <button type="button" @click="emit('select', 'template')">
        <strong>템플릿 모드</strong>
        <span>현재 프로모션 빌더의 단계별 편집 흐름을 사용합니다.</span>
      </button>
      <button type="button" :disabled="!aiEnabled" @click="emit('select', 'ai')">
        <strong>AI 모드</strong>
        <span>{{ aiEnabled ? "간단한 설명을 분석해 섹션·컴포넌트·디자인을 구성합니다." : "현재 비활성화되어 있습니다." }}</span>
      </button>
    </div>
  </section>
</template>
