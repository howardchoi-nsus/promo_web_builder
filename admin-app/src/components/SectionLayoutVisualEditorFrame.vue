<script setup>
import { computed, nextTick, onBeforeUnmount, onMounted, ref } from "vue";
import { sectionLayoutPresetService } from "../services/section-layout-preset-service.mjs";

const props = defineProps({
  section: { type: Object, required: true },
  layout: { type: Object, required: true },
});
const emit = defineEmits(["saved", "close"]);
const dialog = ref(null);
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

function requestClose() {
  if (dialog.value?.open) dialog.value.close();
  else emit("close");
}

function handleBackdropClick(event) {
  if (event.target === dialog.value) requestClose();
}

function handleDialogClose() {
  globalThis.document.body.classList.remove("section-layout-preview-open");
  emit("close");
}

onMounted(async () => {
  globalThis.addEventListener("message", handleMessage);
  globalThis.document.body.classList.add("section-layout-preview-open");
  await nextTick();
  if (dialog.value && !dialog.value.open) dialog.value.showModal();
});

onBeforeUnmount(() => {
  globalThis.removeEventListener("message", handleMessage);
  if (dialog.value?.open) dialog.value.close();
  globalThis.document.body.classList.remove("section-layout-preview-open");
});
</script>

<template>
  <dialog
    ref="dialog"
    class="section-layout-visual-editor-modal"
    aria-labelledby="section-layout-visual-editor-title"
    aria-describedby="section-layout-visual-editor-description"
    @click="handleBackdropClick"
    @cancel.prevent="requestClose"
    @close="handleDialogClose"
  >
    <section class="section-layout-visual-editor">
      <header>
        <div>
          <strong id="section-layout-visual-editor-title">{{ layout.name }} · Visual Editor</strong>
          <small id="section-layout-visual-editor-description">{{ layout.layoutKey }} · 실제 텍스트·이미지·CTA 렌더링 기준</small>
        </div>
        <button class="tiny-button" type="button" aria-label="Live Preview 모달 닫기" @click="requestClose">닫기</button>
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
          활성·비활성 섹션은 읽기 전용입니다. 초안을 만든 후 레이아웃을 편집하세요.
        </div>
      </div>
    </section>
  </dialog>
</template>

<style scoped>
:global(body.section-layout-preview-open) { overflow: hidden; }
.section-layout-visual-editor-modal { width: min(96vw, 1600px); height: min(94vh, 1100px); max-width: none; max-height: none; margin: auto; padding: 0; overflow: hidden; border: 1px solid var(--app-line); border-radius: 12px; background: var(--app-panel); color: var(--app-ink); box-shadow: var(--app-shadow); }
.section-layout-visual-editor-modal::backdrop { background: rgb(8 12 20 / 72%); backdrop-filter: blur(3px); }
.section-layout-visual-editor { display: grid; grid-template-rows: auto minmax(0, 1fr); gap: 0; width: 100%; height: 100%; min-height: 0; }
.section-layout-visual-editor > header { display: flex; align-items: center; justify-content: space-between; gap: 12px; padding: 14px 16px; border-bottom: 1px solid var(--app-line); background: var(--app-panel); }
.section-layout-visual-editor > header > div { display: grid; gap: 3px; }
.section-layout-visual-editor small { color: var(--app-sub); }
.section-layout-visual-editor__frame-wrap { position: relative; min-width: 0; min-height: 0; overflow: hidden; background: var(--app-bg); }
.section-layout-visual-editor__frame { display: block; width: 100%; height: 100%; border: 0; }
.section-layout-visual-editor__frame.is-readonly { pointer-events: none; }
.section-layout-visual-editor__loading { position: absolute; inset: 0; display: grid; place-content: center; background: var(--app-panel); color: var(--app-sub); }
.section-layout-visual-editor__readonly { position: absolute; z-index: 3; inset: 12px 12px auto; padding: 10px 14px; border: 1px solid var(--app-line-strong); border-radius: 8px; background: var(--app-panel); color: var(--app-sub); text-align: center; box-shadow: var(--app-shadow); }
@media (max-width: 800px) {
  .section-layout-visual-editor-modal { width: 100vw; height: 100dvh; border: 0; border-radius: 0; }
  .section-layout-visual-editor > header { padding: 10px 12px; }
}
</style>
