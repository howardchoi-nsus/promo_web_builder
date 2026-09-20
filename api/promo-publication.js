const { findPublicationBySlug, getSql } = require("./_promo-publication-store");
const { requireBuilderFlag } = require("./_promo-builder-flags");

module.exports = async function handler(req, res) {
  try {
    requireBuilderFlag("nuxtRuntime");
    if (req.method !== "GET") return res.status(405).json({ error: "Method not allowed" });
    const slug = String(req.query.slug || "").trim().toLowerCase();
    const locale = String(req.query.locale || "ko-KR").trim();
    if (!slug) return res.status(400).json({ error: "slug is required" });
    const sql = getSql();
    const publication = await findPublicationBySlug(sql, { slug, locale });
    if (!publication) {
      const inactive = await findPublicationBySlug(sql, { slug, locale, publishedOnly: false });
      if (inactive) return res.status(410).json({ error: "Promotion is no longer published", code: "PROMOTION_GONE" });
      return res.status(404).json({ error: "Published promotion not found" });
    }
    const { assertPublishedPromotion } = await import("../packages/promo-contracts/src/publication.mjs");
    const value = assertPublishedPromotion(publication);
    const etag = `\"${value.cache.etag}\"`;
    res.setHeader("ETag", etag);
    res.setHeader("Cache-Control", `public, s-maxage=${value.cache.revalidateSeconds}, stale-while-revalidate=60`);
    if (String(req.headers["if-none-match"] || "") === etag) return res.status(304).end();
    return res.status(200).json({ ok: true, publication: value });
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      error: error.message || "Failed to load promotion",
      code: error.code || "PROMOTION_READ_FAILED",
      validation: error.validation,
    });
  }
};
