<script setup>
import { MOTION_PRESETS } from "../editor-core/motion-spec.mjs";
defineProps({ binding: { type: Object, default: () => ({}) } });
const emit = defineEmits(["update", "replay"]);
</script>
<template>
  <details class="transition-controls">
    <summary>트랜지션</summary>
    <label><span>Preset</span><select :value="binding.presetVersionId || ''" @change="emit('update', { presetVersionId: $event.target.value })"><option v-for="preset in MOTION_PRESETS" :key="preset.key" :value="preset.presetVersionId">{{ preset.label }}</option></select></label>
    <template v-if="binding.presetVersionId">
      <label><span>Trigger</span><select :value="binding.trigger || 'viewport-enter'" @change="emit('update', { trigger: $event.target.value })"><option value="viewport-enter">화면 진입</option><option value="load">페이지 로드</option></select></label>
      <label><span>Duration</span><select :value="binding.durationToken || '360ms'" @change="emit('update', { durationToken: $event.target.value })"><option value="180ms">빠르게</option><option value="360ms">기본</option><option value="600ms">느리게</option></select></label>
      <label><span>Delay</span><select :value="binding.delayToken || '0ms'" @change="emit('update', { delayToken: $event.target.value })"><option value="0ms">없음</option><option value="100ms">짧게</option><option value="240ms">보통</option></select></label>
      <label><span>Children</span><select :value="binding.childrenMode || 'together'" @change="emit('update', { childrenMode: $event.target.value })"><option value="together">동시</option><option value="stagger">순차</option></select></label>
      <label v-if="binding.childrenMode === 'stagger'"><span>Stagger</span><select :value="binding.staggerToken || '60ms'" @change="emit('update', { staggerToken: $event.target.value })"><option value="60ms">60ms</option><option value="100ms">100ms</option><option value="160ms">160ms</option></select></label>
      <button type="button" @click="emit('replay')"><i class="fa-solid fa-play" aria-hidden="true"></i> 다시 보기</button>
    </template>
  </details>
</template>
