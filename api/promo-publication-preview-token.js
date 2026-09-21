const { parseBody } = require("./_wizard-form-templates-store");
const { resolveBuilderOwner } = require("./_promo-builder-auth");
const { requireBuilderFlag } = require("./_promo-builder-flags");
const { createPreviewToken } = require("./_promo-preview-token");
const { findOwnedPublicationById, getSql } = require("./_promo-publication-store");

module.exports = async function handler(req, res) {
  try {
    requireBuilderFlag("nuxtRuntime");
    res.setHeader("Cache-Control", "private, no-store");
    if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });
    const owner = resolveBuilderOwner(req, res);
    const id = String(parseBody(req.body).id || "").trim();
    if (!id) return res.status(400).json({ error: "Publication id is required" });
    const publication = await findOwnedPublicationById(getSql(), { id, ownerSubject: owner.ownerSubject });
    if (!publication) return res.status(404).json({ error: "Publication not found" });
    const preview = createPreviewToken({
      publicationId: publication.publication.id,
      revision: publication.publication.publishedRevision,
    });
    return res.status(201).json({
      ok: true,
      preview: {
        token: preview.token,
        expiresAt: new Date(preview.expiresAt).toISOString(),
        slug: publication.publication.slug,
        locale: publication.publication.locale,
        revision: publication.publication.publishedRevision,
      },
    });
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      error: error.message || "Failed to create preview token",
      code: error.code || "PREVIEW_TOKEN_CREATE_FAILED",
    });
  }
};
