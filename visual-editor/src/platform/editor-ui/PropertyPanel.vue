<script setup>
defineProps({
  selectedSection: { type: Object, default: null },
});
</script>

<template>
  <aside class="property-panel">
    <div class="panel-heading">
      <span>COMPONENTS</span>
      <strong>{{ selectedSection?.name || "섹션 선택" }}</strong>
    </div>
    <div v-if="selectedSection" class="property-form">
      <slot name="ai-controls"></slot>
      <slot></slot>
    </div>
  </aside>
</template>
