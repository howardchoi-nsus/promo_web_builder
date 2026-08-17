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
    <ol class="registry-proposal-list" aria-label="생성될 페이지의 섹션 순서">
      <li v-for="(section, index) in preview.sections" :key="`${section.sectionKey}:${section.layoutKey}`">
        <span class="registry-proposal-sequence" aria-hidden="true">
          {{ String(section.sequence || index + 1).padStart(2, "0") }}
        </span>
        <article class="registry-proposal-section">
          <header class="registry-proposal-section__header">
            <div>
              <h2>{{ section.sectionKey }}</h2>
              <p>{{ section.sectionRole }} · {{ section.layoutKey }}</p>
            </div>
            <div class="registry-proposal-badges">
              <span v-if="section.required" class="registry-proposal-badge registry-proposal-badge--required">항상 포함</span>
              <span v-if="section.fixedPosition" class="registry-proposal-badge">
                {{ section.fixedPosition === "top" ? "상단 고정" : "하단 고정" }}
              </span>
              <span v-if="section.repeat > 1" class="registry-proposal-badge">{{ section.repeat }}개 반복</span>
            </div>
          </header>
          <div class="registry-proposal-components">
            <strong>포함 컴포넌트</strong>
            <ul>
              <li v-for="(componentKey, componentIndex) in section.componentKeys" :key="`${componentKey}:${componentIndex}`">
                <span>{{ componentKey }}</span>
                <small v-if="section.componentRepeats?.[componentKey] > 1">
                  × {{ section.componentRepeats[componentKey] }}
                </small>
              </li>
            </ul>
          </div>
          <small v-if="section.resourceKeys.length" class="registry-proposal-resources">
            리소스: {{ section.resourceKeys.join(" · ") }}
          </small>
        </article>
      </li>
    </ol>
    <div v-if="preview.resources.length" class="registry-resource-list">
      <strong>고정 공통 리소스</strong>
      <span v-for="resource in preview.resources" :key="resource.resourceKey">
        {{ resource.resourceKey }} v{{ resource.version }} ({{ resource.locale }})
      </span>
    </div>
    <div class="ai-builder-actions registry-proposal-actions">
      <button type="button" class="ai-builder-secondary" :disabled="busy" @click="emit('back')">요청 수정</button>
      <button type="button" class="ai-builder-primary" :disabled="busy" @click="emit('apply')">
        {{ busy ? "적용 중…" : "이 구성 적용" }}
      </button>
    </div>
  </section>
</template>
