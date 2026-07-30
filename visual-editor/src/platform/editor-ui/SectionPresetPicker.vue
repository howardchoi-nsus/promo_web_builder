<script setup>
import { ref } from "vue";

defineProps({
  presets: { type: Array, default: () => [] },
  disabled: { type: Boolean, default: false },
});

const emit = defineEmits(["create-blank", "create-from-preset"]);
const selectedPresetKey = ref("");
</script>

<template>
  <div class="section-preset-picker">
    <button type="button" :disabled="disabled" @click="emit('create-blank')">+ 빈 섹션</button>
    <label>
      <span>Section Preset</span>
      <select v-model="selectedPresetKey" :disabled="disabled || !presets.length">
        <option value="">선택해 주세요</option>
        <option v-for="preset in presets" :key="preset.id || preset.sectionKey" :value="preset.sectionKey">
          {{ preset.name }} · {{ preset.sectionRole || "content" }}
        </option>
      </select>
    </label>
    <button
      type="button"
      :disabled="disabled || !selectedPresetKey"
      @click="emit('create-from-preset', presets.find((preset) => preset.sectionKey === selectedPresetKey))"
    >Preset 추가</button>
  </div>
</template>
