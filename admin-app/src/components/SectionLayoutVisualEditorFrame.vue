<script setup>
import { computed, onBeforeUnmount, onMounted, ref } from "vue";
import { sectionLayoutPresetService } from "../services/section-layout-preset-service.mjs";

const props = defineProps({
  section: { type: Object, required: true },
  layout: { type: Object, required: true },
});
const emit = defineEmits(["saved", "close"]);
const frame = ref(null);
const frameLoading = ref(true);

const editorUrl = computed(() => {
  const url = new URL(sectionLayoutPresetService.editorUrl(props.section.id, props.layout.layoutKey));
  url.searchParams.set("embedded", "1");
  return url.toString();
});

function handleMessage(event) {
  if (event.origin !== globalThis.location.origin || event.source !== frame.value?.contentWindow) return;
  const message = event.data || {};
  if (message.type !== "promo-section-layout-saved") return;
  if (message.sectionId !== props.section.id || message.layoutId !== props.layout.id) return;
  emit("saved", message);
}

onMounted(() => globalThis.addEventListener("message", handleMessage));
onBeforeUnmount(() => globalThis.removeEventListener("message", handleMessage));
</script>

<template>
  <section class="section-layout-visual-editor">
    <header>
      <div>
        <strong>{{ layout.name }} · Visual Editor</strong>
        <small>{{ layout.layoutKey }} · 실제 텍스트·이미지·CTA 렌더링 기준</small>
      </div>
      <button class="tiny-button" type="button" @click="emit('close')">닫기</button>
    </header>
    <div class="section-layout-visual-editor__frame-wrap" :aria-busy="frameLoading ? 'true' : 'false'">
      <iframe
        ref="frame"
        class="section-layout-visual-editor__frame"
        :class="{ 'is-readonly': section.status !== 'draft' }"
        :src="editorUrl"
        :title="`${section.name} ${layout.name} Layout Preset Visual Editor`"
        @load="frameLoading = false"
      ></iframe>
      <div v-if="frameLoading" class="section-layout-visual-editor__loading" role="status">공통 Visual Editor를 불러오는 중입니다.</div>
      <div v-else-if="section.status !== 'draft'" class="section-layout-visual-editor__readonly">
        활성·비활성 Section은 읽기 전용입니다. 초안을 만든 후 Layout을 편집하세요.
      </div>
    </div>
  </section>
</template>

<style scoped>
.section-layout-visual-editor { display: grid; gap: 10px; margin-top: 14px; }
.section-layout-visual-editor > header { display: flex; align-items: center; justify-content: space-between; gap: 12px; }
.section-layout-visual-editor > header > div { display: grid; gap: 3px; }
.section-layout-visual-editor small { color: var(--app-sub); }
.section-layout-visual-editor__frame-wrap { position: relative; min-width: 0; height: clamp(720px, calc(100vh - 220px), 1040px); overflow: hidden; border: 1px solid var(--app-line); border-radius: 8px; background: var(--app-bg); }
.section-layout-visual-editor__frame { display: block; width: 100%; height: 100%; border: 0; }
.section-layout-visual-editor__frame.is-readonly { pointer-events: none; }
.section-layout-visual-editor__loading { position: absolute; inset: 0; display: grid; place-content: center; background: var(--app-panel); color: var(--app-sub); }
.section-layout-visual-editor__readonly { position: absolute; z-index: 3; inset: 12px 12px auto; padding: 10px 14px; border: 1px solid var(--app-line-strong); border-radius: 8px; background: var(--app-panel); color: var(--app-sub); text-align: center; box-shadow: var(--app-shadow); }
</style>
