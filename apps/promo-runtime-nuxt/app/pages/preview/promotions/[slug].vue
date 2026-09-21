<script setup lang="ts">
import PromoReadonlyRenderer from "#promo-renderer/PromoReadonlyRenderer.vue";

type PreviewResponse = {
  publication: {
    publication: { slug: string; locale: string; publishedRevision: number };
    snapshot: Record<string, unknown>;
  };
};

const route = useRoute();
const slug = computed(() => String(route.params.slug || ""));
const token = computed(() => String(route.query.token || ""));
const { data, error } = await useFetch<PreviewResponse>(() => `/api/preview-promotions/${encodeURIComponent(slug.value)}`, {
  query: computed(() => ({ token: token.value })),
  key: `promotion-preview:${slug.value}:${token.value}`,
});
if (error.value) {
  throw createError({ statusCode: error.value.statusCode || 404, statusMessage: error.value.statusMessage || "Promotion preview unavailable" });
}
const preview = computed(() => data.value?.publication);
useSeoMeta({ robots: "noindex,nofollow" });
useHead({ meta: [{ name: "referrer", content: "no-referrer" }] });
</script>

<template>
  <main v-if="preview" class="promotion-runtime" :data-publication-slug="preview.publication.slug" :data-document-revision="preview.publication.publishedRevision" data-preview="true">
    <PromoReadonlyRenderer :snapshot="preview.snapshot" />
  </main>
</template>

<style scoped>
.promotion-runtime { min-height: 100vh; }
</style>
