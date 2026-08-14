<script setup>
import PromoPageRenderer from "../PromoPageRenderer.vue";

defineProps({
  snapshot: { type: Object, required: true },
  documentRevision: { type: Number, required: true },
  busy: { type: Boolean, default: false },
  exportEnabled: { type: Boolean, default: false },
});
const emit = defineEmits(["edit-natural-language", "rollback", "open-editor", "open-output", "export-document"]);
</script>

<template>
  <section class="ai-builder-result">
    <header class="ai-builder-result__toolbar">
      <div>
        <p class="ai-builder-eyebrow">AI 생성 결과 미리보기</p>
        <strong>Revision {{ documentRevision }}</strong>
        <span class="ai-builder-readonly-badge">읽기 전용 미리보기</span>
      </div>
      <div class="ai-builder-actions">
        <button type="button" class="ai-builder-secondary" @click="emit('rollback')">이전 버전</button>
        <button type="button" class="ai-builder-secondary" @click="emit('edit-natural-language')">자연어로 수정</button>
        <button type="button" class="ai-builder-primary" @click="emit('open-editor')">Visual Editor에서 편집</button>
        <button type="button" class="ai-builder-primary" @click="emit('open-output')">Web Output</button>
        <button v-if="exportEnabled" type="button" class="ai-builder-primary" @click="emit('export-document')">HTML 다운로드</button>
      </div>
    </header>
    <div class="ai-builder-preview">
      <PromoPageRenderer
        :content="snapshot.content"
        :design-spec="snapshot.designSpec"
        :assets="snapshot.assets"
        :motion-spec="snapshot.motionSpec"
        :editable="false"
        :show-guides="false"
      />
    </div>
  </section>
</template>
