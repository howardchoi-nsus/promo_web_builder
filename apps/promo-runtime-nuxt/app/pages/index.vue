<script setup lang="ts">
useSeoMeta({ title: "Promo Runtime" });
</script>

<template>
  <main class="runtime-index">
    <h1>Promo Runtime</h1>
    <p>발행된 프로모션은 <code>/promotions/:slug</code>에서 SSR로 제공됩니다.</p>
  </main>
</template>

<style scoped>
.runtime-index { max-width: 52rem; margin: 10vh auto; padding: 2rem; font: 16px/1.6 system-ui, sans-serif; }
</style>
