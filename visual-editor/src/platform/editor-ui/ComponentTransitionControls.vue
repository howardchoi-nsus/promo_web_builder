<script setup>
import { MOTION_PRESETS } from "../editor-core/motion-spec.mjs";
defineProps({ binding: { type: Object, default: () => ({ inherit: true }) }, disabled: { type: Boolean, default: false } });
const emit = defineEmits(["update", "replay"]);
</script>
<template>
  <details class="transition-controls" open>
    <summary>트랜지션</summary>
    <label><span>Preset</span><select :disabled="disabled" :value="binding.inherit !== false ? 'inherit' : (binding.presetVersionId || '')" @change="emit('update', $event.target.value === 'inherit' ? { inherit: true } : { inherit: false, presetVersionId: $event.target.value })"><option value="inherit">섹션 설정 상속</option><option v-for="preset in MOTION_PRESETS" :key="preset.key" :value="preset.presetVersionId">{{ preset.label }}</option></select></label>
    <template v-if="binding.inherit === false && binding.presetVersionId">
      <label><span>Duration</span><select :disabled="disabled" :value="binding.durationToken || '360ms'" @change="emit('update', { durationToken: $event.target.value })"><option value="180ms">빠르게</option><option value="360ms">기본</option><option value="600ms">느리게</option></select></label>
      <label><span>Delay</span><select :disabled="disabled" :value="binding.delayToken || '0ms'" @change="emit('update', { delayToken: $event.target.value })"><option value="0ms">없음</option><option value="100ms">짧게</option><option value="240ms">보통</option></select></label>
      <label><span>재생 순서</span><input :disabled="disabled" type="number" min="0" max="99" :value="binding.motionOrder || 0" @change="emit('update', { motionOrder: Number($event.target.value) })" /></label>
      <button type="button" @click="emit('replay')"><i class="fa-solid fa-play" aria-hidden="true"></i> 다시 보기</button>
    </template>
  </details>
</template>
