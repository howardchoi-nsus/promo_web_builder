<script setup lang="ts">
defineProps<{ error: { statusCode?: number; statusMessage?: string } }>();
</script>

<template>
  <main class="runtime-error">
    <p>{{ error.statusCode || 500 }}</p>
    <h1>{{ error.statusMessage || '프로모션을 표시할 수 없습니다.' }}</h1>
    <NuxtLink to="/">홈으로 이동</NuxtLink>
  </main>
</template>

<style scoped>
.runtime-error { max-width: 44rem; margin: 15vh auto; padding: 2rem; text-align: center; font-family: system-ui, sans-serif; }
</style>
