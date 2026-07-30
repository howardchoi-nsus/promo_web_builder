const { parseBody } = require("./_wizard-form-templates-store");
const { resolveBuilderOwner } = require("./_promo-builder-auth");
const {
  getSql,
  fetchDocument,
  createDocumentRevision,
} = require("./_promo-builder-document-store");

module.exports = async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method not allowed" });
  }
  try {
    res.setHeader("Cache-Control", "no-store");
    const owner = resolveBuilderOwner(req, res);
    const body = parseBody(req.body);
    const documentId = String(body.documentId || "").trim();
    const baseDocumentRevision = Number(body.baseDocumentRevision || 0);
    const targetRevision = Number(body.targetRevision || 0);
    if (!documentId || !targetRevision || !String(body.idempotencyKey || "").trim()) {
      return res.status(400).json({
        error: "documentId, targetRevision and idempotencyKey are required",
      });
    }
    const sql = getSql();
    const document = await fetchDocument(sql, documentId, owner.ownerSubject, { includeSnapshot: false });
    if (!document) return res.status(404).json({ error: "Builder document not found" });
    if (document.document.currentDocumentRevision !== baseDocumentRevision) {
      return res.status(409).json({
        error: "Builder document revision changed",
        code: "DOCUMENT_REVISION_MISMATCH",
      });
    }
    const rows = await sql`
      select snapshot_json
      from promo_builder_document_versions
      where document_id = ${documentId}::uuid
        and revision = ${targetRevision}
      limit 1
    `;
    if (!rows.length) return res.status(404).json({ error: "Target revision not found" });
    const rolledBack = await createDocumentRevision(sql, {
      documentId,
      ownerSubject: owner.ownerSubject,
      baseDocumentRevision,
      snapshot: rows[0].snapshot_json,
      source: "rollback",
      changeNote: `Rolled back from revision ${baseDocumentRevision} to ${targetRevision}.`,
    });
    return res.status(200).json({
      ok: true,
      documentId,
      revision: rolledBack.revision,
      sourceRevision: targetRevision,
      snapshot: rolledBack.snapshot,
    });
  } catch (error) {
    const status = /access denied/i.test(error.message) ? 403
      : /revision conflict/i.test(error.message) ? 409
        : error.statusCode || 500;
    return res.status(status).json({
      error: "Composition rollback failed",
      code: error.code || null,
      message: error.message,
    });
  }
};
