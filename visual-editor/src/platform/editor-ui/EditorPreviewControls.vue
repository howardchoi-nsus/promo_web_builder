<script setup>
defineProps({
  canUndo: { type: Boolean, default: false },
  canRedo: { type: Boolean, default: false },
  guidesVisible: { type: Boolean, default: true },
  viewport: { type: String, default: "desktop" },
});

const emit = defineEmits([
  "undo",
  "redo",
  "update:guidesVisible",
  "update:viewport",
]);
</script>

<template>
  <div class="preview-controls">
    <div class="editor-history-actions" aria-label="편집 기록">
      <button type="button" class="secondary-control" :disabled="!canUndo" @click="emit('undo')">실행 취소</button>
      <button type="button" class="secondary-control" :disabled="!canRedo" @click="emit('redo')">다시 실행</button>
    </div>
    <slot name="tokens" />
    <slot name="host-actions" />
    <label class="app-switch app-switch--small guide-toggle">
      <input
        class="app-switch__input"
        :checked="guidesVisible"
        type="checkbox"
        role="switch"
        aria-label="미리보기 가이드 표시"
        @change="emit('update:guidesVisible', $event.target.checked)"
      />
      <span class="app-switch__track" aria-hidden="true"></span>
      <span class="app-switch__label">Guides {{ guidesVisible ? "ON" : "OFF" }}</span>
    </label>
    <div class="viewport-control" aria-label="Preview viewport">
      <button type="button" :class="{ active: viewport === 'desktop' }" @click="emit('update:viewport', 'desktop')">Desktop</button>
      <button type="button" :class="{ active: viewport === 'mobile' }" @click="emit('update:viewport', 'mobile')">Mobile</button>
    </div>
  </div>
</template>
