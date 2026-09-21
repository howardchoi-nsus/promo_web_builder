import { assertPublishedPromotion } from "#promo-contracts/publication.mjs";

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig(event);
  const slug = String(getRouterParam(event, "slug") || "").trim().toLowerCase();
  const token = String(getQuery(event).token || "").trim();
  if (!slug || !token) throw createError({ statusCode: 400, statusMessage: "slug and preview token are required" });

  setHeader(event, "Cache-Control", "private, no-store");
  setHeader(event, "Referrer-Policy", "no-referrer");
  setHeader(event, "X-Robots-Tag", "noindex, nofollow");
  try {
    const response = await $fetch<{ publication: unknown }>("/api/promo-publication-preview", {
      baseURL: String(config.promoApiBaseUrl),
      query: { token },
      headers: { accept: "application/json" },
      retry: 0,
      timeout: 5_000,
    });
    const publication = assertPublishedPromotion(response.publication || {});
    if (publication.publication.slug !== slug) {
      throw createError({ statusCode: 404, statusMessage: "Promotion preview not found" });
    }
    return { ok: true, publication };
  } catch (error: any) {
    const statusCode = Number(error?.statusCode || error?.response?.status || 502);
    throw createError({
      statusCode: [401, 404, 410].includes(statusCode) ? statusCode : 502,
      statusMessage: statusCode === 401 ? "Preview token is invalid or expired" : "Promotion preview unavailable",
    });
  }
});
