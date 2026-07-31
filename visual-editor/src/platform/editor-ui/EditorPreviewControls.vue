<script setup>
defineProps({
  guideMode: { type: String, default: "selection" },
  viewport: { type: String, default: "desktop" },
});

const emit = defineEmits([
  "update:guideMode",
  "update:viewport",
]);
</script>

<template>
  <div class="preview-controls">
    <slot name="tokens" />
    <slot name="host-actions" />
    <div class="guide-mode-control" role="group" aria-label="미리보기 표시 모드">
      <button
        v-for="mode in [
          { key: 'normal', label: 'Normal' },
          { key: 'selection', label: 'Selection' },
          { key: 'outline', label: 'Outline' },
        ]"
        :key="mode.key"
        type="button"
        :class="{ active: guideMode === mode.key }"
        :aria-pressed="guideMode === mode.key"
        @click="emit('update:guideMode', mode.key)"
      >{{ mode.label }}</button>
    </div>
    <div class="viewport-control" aria-label="Preview viewport">
      <button type="button" :class="{ active: viewport === 'desktop' }" @click="emit('update:viewport', 'desktop')">Desktop</button>
      <button type="button" :class="{ active: viewport === 'mobile' }" @click="emit('update:viewport', 'mobile')">Mobile</button>
    </div>
  </div>
</template>
