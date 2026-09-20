import { assertPublishedPromotion } from "#promo-contracts/publication.mjs";

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig(event);
  const slug = String(getRouterParam(event, "slug") || "").trim().toLowerCase();
  const locale = String(getQuery(event).locale || config.public.defaultLocale || "ko-KR");
  if (!slug) throw createError({ statusCode: 400, statusMessage: "slug is required" });

  try {
    const response = await $fetch<{ publication: unknown }>("/api/promo-publication", {
      baseURL: String(config.promoApiBaseUrl),
      query: { slug, locale },
      headers: { accept: "application/json" },
      retry: 1,
      timeout: 5_000,
    });
    const publication = assertPublishedPromotion(response.publication || {});
    setHeader(event, "ETag", `\"${publication.cache.etag}\"`);
    setHeader(event, "Cache-Control", `public, s-maxage=${publication.cache.revalidateSeconds}, stale-while-revalidate=60`);
    return { ok: true, publication };
  } catch (error: any) {
    const statusCode = Number(error?.statusCode || error?.response?.status || 502);
    throw createError({
      statusCode: [404, 410].includes(statusCode) ? statusCode : 502,
      statusMessage: statusCode === 404
        ? "Published promotion not found"
        : statusCode === 410
          ? "Promotion is no longer published"
          : "Promotion source unavailable",
    });
  }
});
