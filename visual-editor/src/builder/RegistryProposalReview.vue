<script setup>
import { computed } from "vue";

const props = defineProps({
  proposal: { type: Object, required: true },
  busy: { type: Boolean, default: false },
});
const emit = defineEmits(["apply", "back"]);
const preview = computed(() => props.proposal?.snapshot?.preview || { sections: [], resources: [] });
</script>

<template>
  <section class="ai-builder-card registry-proposal-review">
    <p class="ai-builder-eyebrow">Composition Review</p>
    <h1>AI 섹션 구성을 확인해 주세요</h1>
    <p>승인된 Registry, 레이아웃, 디자인 토큰 및 공통 리소스 버전만 사용합니다.</p>
    <div class="registry-proposal-grid">
      <article v-for="section in preview.sections" :key="`${section.sectionKey}:${section.layoutKey}`">
        <strong>{{ section.sectionKey }}</strong>
        <span>{{ section.sectionRole }} · {{ section.layoutKey }}</span>
        <span v-if="section.repeat > 1">{{ section.repeat }}개 반복</span>
        <small>{{ section.componentKeys.join(" · ") }}</small>
        <small v-if="section.resourceKeys.length">리소스: {{ section.resourceKeys.join(" · ") }}</small>
      </article>
    </div>
    <div v-if="preview.resources.length" class="registry-resource-list">
      <strong>고정 공통 리소스</strong>
      <span v-for="resource in preview.resources" :key="resource.resourceKey">
        {{ resource.resourceKey }} v{{ resource.version }} ({{ resource.locale }})
      </span>
    </div>
    <div class="ai-builder-actions">
      <button type="button" class="ai-builder-secondary" :disabled="busy" @click="emit('back')">요청 수정</button>
      <button type="button" class="ai-builder-primary" :disabled="busy" @click="emit('apply')">
        {{ busy ? "적용 중…" : "이 구성 적용" }}
      </button>
    </div>
  </section>
</template>
