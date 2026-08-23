const { resolveBuilderOwner } = require("./_promo-builder-auth");
const { requireBuilderFlag } = require("./_promo-builder-flags");
const { requireBuilderRollout } = require("./_promo-builder-rollout");
const { getSql, fetchDocument } = require("./_promo-builder-document-store");
const {
  publicExportSnapshot,
  dependencyManifest,
  htmlExport,
  frameworkSource,
} = require("./_promo-builder-export-adapters");
const { assertPassedQualityGate } = require("./_promo-quality-gate");

const FORMATS = new Set(["html", "manifest", "snapshot", "vue", "react"]);

module.exports = async function handler(req, res) {
  if (req.method !== "GET") {
    res.setHeader("Allow", "GET");
    return res.status(405).json({ error: "Method not allowed" });
  }
  try {
    requireBuilderFlag("export");
    const owner = resolveBuilderOwner(req, res);
    requireBuilderRollout(owner.ownerSubject);
    const documentId = String(req.query?.documentId || "").trim();
    const format = String(req.query?.format || "html").trim().toLowerCase();
    if (!documentId) return res.status(400).json({ error: "documentId is required" });
    if (!FORMATS.has(format)) return res.status(400).json({ error: "Unsupported export format" });
    const result = await fetchDocument(getSql(), documentId, owner.ownerSubject);
    if (!result?.snapshot) return res.status(404).json({ error: "Builder document snapshot not found" });
    const revision = Number(result.document.currentDocumentRevision || 0);
    const requestedRevision = Number(req.query?.revision || revision);
    if (requestedRevision !== revision) {
      return res.status(409).json({
        error: "Builder document revision changed",
        code: "DOCUMENT_REVISION_MISMATCH",
        currentDocumentRevision: revision,
      });
    }
    assertPassedQualityGate(result.snapshot, revision);
    const options = { documentId, revision, title: result.document.title || "Promotion" };
    res.setHeader("Cache-Control", "private, no-store");
    res.setHeader("X-Content-Type-Options", "nosniff");
    if (format === "manifest") return res.status(200).json(dependencyManifest(result.snapshot, options));
    if (format === "snapshot") return res.status(200).json(publicExportSnapshot(result.snapshot));
    const body = format === "html" ? htmlExport(result.snapshot, options) : frameworkSource(result.snapshot, format, options);
    const extension = format === "react" ? "jsx" : format === "vue" ? "vue" : "html";
    res.setHeader("Content-Type", format === "html" ? "text/html; charset=utf-8" : "text/plain; charset=utf-8");
    if (String(req.query?.download || "") === "1") {
      res.setHeader("Content-Disposition", `attachment; filename="promotion-r${revision}.${extension}"`);
    }
    return res.status(200).send(body);
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      error: "Builder document export failed",
      code: error.code || null,
      message: error.message,
    });
  }
};
