<script setup lang="ts">
import PromoReadonlyRenderer from "#promo-renderer/PromoReadonlyRenderer.vue";

type PublicationResponse = {
  ok: boolean;
  publication: {
    publication: { slug: string; locale: string; publishedRevision: number };
    seo: { title?: string; description?: string; imageUrl?: string; canonicalUrl?: string; noIndex?: boolean };
    snapshot: Record<string, unknown>;
  };
};

const route = useRoute();
const config = useRuntimeConfig();
const slug = computed(() => String(route.params.slug || ""));
const locale = computed(() => String(route.query.locale || config.public.defaultLocale || "ko-KR"));
const { data, error } = await useFetch<PublicationResponse>(() => `/api/promotions/${encodeURIComponent(slug.value)}`, {
  query: computed(() => ({ locale: locale.value })),
  key: `promotion:${slug.value}:${locale.value}`,
});

if (error.value) {
  throw createError({
    statusCode: error.value.statusCode || 404,
    statusMessage: error.value.statusMessage || "Published promotion not found",
  });
}

const published = computed(() => data.value?.publication);
useSeoMeta({
  title: () => published.value?.seo?.title || slug.value,
  description: () => published.value?.seo?.description || "",
  ogTitle: () => published.value?.seo?.title || slug.value,
  ogDescription: () => published.value?.seo?.description || "",
  ogImage: () => published.value?.seo?.imageUrl || "",
  robots: () => published.value?.seo?.noIndex ? "noindex,nofollow" : "index,follow",
});
useHead(() => ({
  htmlAttrs: { lang: published.value?.publication.locale || locale.value },
  link: published.value?.seo?.canonicalUrl
    ? [{ rel: "canonical", href: published.value.seo.canonicalUrl }]
    : [],
}));
</script>

<template>
  <main v-if="published" class="promotion-runtime" :data-publication-slug="published.publication.slug" :data-document-revision="published.publication.publishedRevision">
    <PromoReadonlyRenderer :snapshot="published.snapshot" />
  </main>
</template>

<style scoped>
.promotion-runtime { min-height: 100vh; }
</style>
