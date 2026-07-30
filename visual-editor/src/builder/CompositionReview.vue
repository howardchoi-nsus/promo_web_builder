<script setup>
import PromoPageRenderer from "../PromoPageRenderer.vue";

defineProps({
  snapshot: { type: Object, required: true },
  documentRevision: { type: Number, required: true },
  busy: { type: Boolean, default: false },
});
const emit = defineEmits(["edit-natural-language", "rollback", "open-output"]);
</script>

<template>
  <section class="ai-builder-result">
    <header class="ai-builder-result__toolbar">
      <div>
        <p class="ai-builder-eyebrow">Render Ready</p>
        <strong>Revision {{ documentRevision }}</strong>
      </div>
      <div class="ai-builder-actions">
        <button type="button" class="ai-builder-secondary" @click="emit('rollback')">이전 버전</button>
        <button type="button" class="ai-builder-secondary" @click="emit('edit-natural-language')">자연어로 수정</button>
        <button type="button" class="ai-builder-primary" @click="emit('open-output')">Web Output</button>
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
