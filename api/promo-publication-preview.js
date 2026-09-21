const { requireBuilderFlag } = require("./_promo-builder-flags");
const { verifyPreviewToken } = require("./_promo-preview-token");
const { findPublicationById, getSql } = require("./_promo-publication-store");

module.exports = async function handler(req, res) {
  try {
    requireBuilderFlag("nuxtRuntime");
    res.setHeader("Cache-Control", "private, no-store");
    res.setHeader("Referrer-Policy", "no-referrer");
    res.setHeader("X-Robots-Tag", "noindex, nofollow");
    if (req.method !== "GET") return res.status(405).json({ error: "Method not allowed" });
    const verified = verifyPreviewToken(String(req.query.token || ""));
    if (!verified) return res.status(401).json({ error: "Preview token is invalid or expired", code: "INVALID_PREVIEW_TOKEN" });
    const publication = await findPublicationById(getSql(), verified.publicationId);
    if (!publication || publication.publication.publishedRevision !== verified.revision) {
      return res.status(410).json({ error: "Preview revision is no longer available", code: "PREVIEW_REVISION_GONE" });
    }
    const { assertPublishedPromotion } = await import("../packages/promo-contracts/src/publication.mjs");
    return res.status(200).json({ ok: true, publication: assertPublishedPromotion(publication) });
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      error: error.message || "Failed to load promotion preview",
      code: error.code || "PROMOTION_PREVIEW_FAILED",
      validation: error.validation,
    });
  }
};
