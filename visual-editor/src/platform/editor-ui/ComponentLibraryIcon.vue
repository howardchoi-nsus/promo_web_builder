<script setup>
defineProps({
  iconKey: { type: String, default: "component-generic" },
});
</script>

<template>
  <svg class="component-library-icon" viewBox="0 0 24 24" aria-hidden="true">
    <template v-if="iconKey === 'heading'">
      <path d="M5 5v14M19 5v14M5 12h14" />
    </template>
    <template v-else-if="iconKey === 'text'">
      <path d="M5 7h14M5 12h11M5 17h14" />
    </template>
    <template v-else-if="iconKey === 'image'">
      <rect x="4" y="5" width="16" height="14" rx="2" />
      <circle cx="9" cy="10" r="1.5" />
      <path d="m6 17 4-4 3 3 2-2 3 3" />
    </template>
    <template v-else-if="iconKey === 'button'">
      <rect x="3" y="7" width="18" height="10" rx="3" />
      <path d="M9 12h6M13 10l2 2-2 2" />
    </template>
    <template v-else-if="iconKey === 'logo'">
      <circle cx="12" cy="12" r="7" />
      <path d="m9 15 3-7 3 7M10 13h4" />
    </template>
    <template v-else-if="iconKey === 'badge'">
      <path d="m12 3 2.2 2.1 3-.2.2 3L20 10.5 18.5 13l.4 3-3 .5L14 19l-2-1.5L10 19l-1.9-2.5-3-.5.4-3L4 10.5 6.6 8l.2-3 3 .2L12 3Z" />
    </template>
    <template v-else-if="iconKey === 'divider'">
      <path d="M3 12h18M6 9l-3 3 3 3M18 9l3 3-3 3" />
    </template>
    <template v-else-if="iconKey === 'spacer'">
      <path d="M5 4h14M5 20h14M12 5v14M9 8l3-3 3 3M9 16l3 3 3-3" />
    </template>
    <template v-else-if="iconKey === 'layout'">
      <rect x="4" y="4" width="16" height="16" rx="2" />
      <path d="M4 9h16M10 9v11" />
    </template>
    <template v-else>
      <rect x="5" y="5" width="14" height="14" rx="2" />
      <path d="M9 9h6v6H9z" />
    </template>
  </svg>
</template>
