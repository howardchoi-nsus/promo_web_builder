<script setup>
import { nextTick, onBeforeUnmount, onMounted, ref } from "vue";

const props = defineProps({
  title: { type: String, required: true },
  description: { type: String, default: "" },
  editorUrl: { type: String, required: true },
  iframeTitle: { type: String, required: true },
  saveTargetLabel: { type: String, required: true },
  readOnly: { type: Boolean, default: false },
  readOnlyMessage: { type: String, default: "읽기 전용 상태입니다." },
});
const emit = defineEmits(["close", "editor-message"]);
const dialog = ref(null);
const frame = ref(null);
const frameLoading = ref(true);
const dirty = ref(false);
let previousFocus = null;

function handleMessage(event) {
  if (event.origin !== globalThis.location.origin || event.source !== frame.value?.contentWindow) return;
  const message = event.data || {};
  if (message.type === "promo-visual-editor-dirty-state") dirty.value = Boolean(message.dirty);
  if (["promo-section-layout-saved", "promo-admin-layout-saved", "promo-ai-document-saved"].includes(message.type)) {
    dirty.value = false;
  }
  emit("editor-message", message);
}

function requestClose() {
  if (dirty.value && !globalThis.confirm("저장하지 않은 변경사항이 있습니다. 편집기를 닫을까요?")) return;
  if (dialog.value?.open) dialog.value.close();
  else emit("close");
}

function handleBackdropClick(event) {
  if (event.target === dialog.value) requestClose();
}

function handleDialogClose() {
  globalThis.document.body.classList.remove("visual-editor-dialog-open");
  emit("close");
  nextTick(() => previousFocus?.focus?.());
}

onMounted(async () => {
  previousFocus = globalThis.document.activeElement;
  globalThis.addEventListener("message", handleMessage);
  globalThis.document.body.classList.add("visual-editor-dialog-open");
  await nextTick();
  if (dialog.value && !dialog.value.open) dialog.value.showModal();
});

onBeforeUnmount(() => {
  globalThis.removeEventListener("message", handleMessage);
  if (dialog.value?.open) dialog.value.close();
  globalThis.document.body.classList.remove("visual-editor-dialog-open");
});
</script>

<template>
  <dialog
    ref="dialog"
    class="visual-editor-dialog-host"
    aria-labelledby="visual-editor-dialog-title"
    aria-describedby="visual-editor-dialog-description"
    @click="handleBackdropClick"
    @cancel.prevent="requestClose"
    @close="handleDialogClose"
  >
    <section class="visual-editor-dialog-host__surface">
      <header>
        <div>
          <strong id="visual-editor-dialog-title">{{ title }}</strong>
          <small id="visual-editor-dialog-description">{{ description }}</small>
          <span class="visual-editor-dialog-host__save-target">저장 대상: {{ saveTargetLabel }}</span>
        </div>
        <button class="tiny-button" type="button" aria-label="Visual Editor 모달 닫기" @click="requestClose">닫기</button>
      </header>
      <div class="visual-editor-dialog-host__frame-wrap" :aria-busy="frameLoading ? 'true' : 'false'">
        <iframe
          ref="frame"
          class="visual-editor-dialog-host__frame"
          :class="{ 'is-readonly': readOnly }"
          :src="editorUrl"
          :title="iframeTitle"
          @load="frameLoading = false"
        ></iframe>
        <div v-if="frameLoading" class="visual-editor-dialog-host__loading" role="status">공통 Visual Editor를 불러오는 중입니다.</div>
        <div v-else-if="readOnly" class="visual-editor-dialog-host__readonly">{{ readOnlyMessage }}</div>
      </div>
    </section>
  </dialog>
</template>

<style scoped>
:global(body.visual-editor-dialog-open) { overflow: hidden; }
.visual-editor-dialog-host { width: min(96vw, 1600px); height: min(94vh, 1100px); max-width: none; max-height: none; margin: auto; padding: 0; overflow: hidden; border: 1px solid var(--app-line); border-radius: 12px; background: var(--app-panel); color: var(--app-ink); box-shadow: var(--app-shadow); }
.visual-editor-dialog-host::backdrop { background: rgb(8 12 20 / 72%); backdrop-filter: blur(3px); }
.visual-editor-dialog-host__surface { display: grid; grid-template-rows: auto minmax(0, 1fr); width: 100%; height: 100%; min-height: 0; }
.visual-editor-dialog-host__surface > header { display: flex; align-items: center; justify-content: space-between; gap: 12px; padding: 12px 16px; border-bottom: 1px solid var(--app-line); background: var(--app-panel); }
.visual-editor-dialog-host__surface > header > div { display: grid; gap: 3px; }
.visual-editor-dialog-host__surface small { color: var(--app-sub); }
.visual-editor-dialog-host__save-target { width: fit-content; padding: 2px 7px; border: 1px solid var(--app-line); border-radius: 999px; color: var(--app-sub); font-size: var(--app-font-size-small); }
.visual-editor-dialog-host__frame-wrap { position: relative; min-width: 0; min-height: 0; overflow: hidden; background: var(--app-bg); }
.visual-editor-dialog-host__frame { display: block; width: 100%; height: 100%; border: 0; }
.visual-editor-dialog-host__frame.is-readonly { pointer-events: none; }
.visual-editor-dialog-host__loading { position: absolute; inset: 0; display: grid; place-content: center; background: var(--app-panel); color: var(--app-sub); }
.visual-editor-dialog-host__readonly { position: absolute; z-index: 3; inset: 12px 12px auto; padding: 10px 14px; border: 1px solid var(--app-line-strong); border-radius: 8px; background: var(--app-panel); color: var(--app-sub); text-align: center; box-shadow: var(--app-shadow); }
@media (max-width: 800px) {
  .visual-editor-dialog-host { width: 100vw; height: 100dvh; border: 0; border-radius: 0; }
  .visual-editor-dialog-host__surface > header { padding: 10px 12px; }
}
</style>
