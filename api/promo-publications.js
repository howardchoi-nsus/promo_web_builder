const { parseBody } = require("./_wizard-form-templates-store");
const { resolveBuilderOwner } = require("./_promo-builder-auth");
const { requireBuilderFlag } = require("./_promo-builder-flags");
const {
  getSql,
  listPublications,
  savePublication,
  updatePublicationStatus,
} = require("./_promo-publication-store");

const SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const LOCALE_PATTERN = /^[a-z]{2,3}(?:-[A-Z]{2})?$/;
const STATUSES = new Set(["draft", "published", "unpublished", "archived"]);

module.exports = async function handler(req, res) {
  try {
    requireBuilderFlag("nuxtRuntime");
    res.setHeader("Cache-Control", "no-store");
    const owner = resolveBuilderOwner(req, res);
    const sql = getSql();
    if (req.method === "GET") {
      return res.status(200).json({ ok: true, publications: await listPublications(sql, owner.ownerSubject) });
    }
    const body = parseBody(req.body);
    if (req.method === "POST") {
      const slug = String(body.slug || "").trim().toLowerCase();
      const locale = String(body.locale || "ko-KR").trim();
      const status = STATUSES.has(body.status) ? body.status : "draft";
      const documentId = String(body.documentId || "").trim();
      const documentRevision = Number(body.documentRevision || 0);
      if (!documentId || !Number.isInteger(documentRevision) || documentRevision < 1) {
        return res.status(400).json({ error: "documentId and documentRevision are required" });
      }
      if (!SLUG_PATTERN.test(slug) || !LOCALE_PATTERN.test(locale)) {
        return res.status(422).json({ error: "slug or locale format is invalid" });
      }
      const publication = await savePublication(sql, {
        documentId,
        documentRevision,
        slug,
        locale,
        status,
        seo: body.seo && typeof body.seo === "object" ? body.seo : {},
        manifest: body.manifest && typeof body.manifest === "object" ? body.manifest : {},
        revalidateSeconds: Math.min(86400, Math.max(0, Number(body.revalidateSeconds ?? 300))),
        ownerSubject: owner.ownerSubject,
      });
      if (!publication) return res.status(404).json({ error: "Builder document revision not found" });
      return res.status(201).json({ ok: true, publication });
    }
    if (req.method === "PATCH") {
      const id = String(body.id || "").trim();
      const status = String(body.status || "").trim();
      if (!id || !STATUSES.has(status)) return res.status(400).json({ error: "id and valid status are required" });
      const publication = await updatePublicationStatus(sql, { id, status, ownerSubject: owner.ownerSubject });
      if (!publication) return res.status(404).json({ error: "Publication not found" });
      return res.status(200).json({ ok: true, publication });
    }
    return res.status(405).json({ error: "Method not allowed" });
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      error: error.message || "Publication operation failed",
      code: error.code || "PUBLICATION_OPERATION_FAILED",
    });
  }
};
