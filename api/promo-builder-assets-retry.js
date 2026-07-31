const { parseBody } = require("./_wizard-form-templates-store");
const { resolveBuilderOwner } = require("./_promo-builder-auth");
const {
  getSql,
  fetchDocument,
} = require("./_promo-builder-document-store");
const {
  enqueueAndScheduleBuilderAssetJobs,
} = require("./_promo-builder-assets");

function selectRetryAssetRequests(snapshot, requestedIds = []) {
  const source = snapshot?.assets?.requests || [];
  const ids = new Set(
    (Array.isArray(requestedIds) ? requestedIds : [])
      .map((id) => String(id || "").trim())
      .filter(Boolean),
  );
  const selected = source.filter((request) => (
    (!ids.size || ids.has(String(request.assetRequestId)))
    && ["pending", "failed"].includes(String(request.status || "pending"))
  ));
  return {
    ...snapshot,
    assets: {
      ...(snapshot?.assets || {}),
      requests: selected.map((request) => ({ ...request, status: "pending" })),
    },
  };
}

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
    const documentRevision = Number(body.documentRevision || 0);
    const assetRequestIds = Array.from(new Set(
      (Array.isArray(body.assetRequestIds) ? body.assetRequestIds : [])
        .map((id) => String(id || "").trim())
        .filter(Boolean),
    )).slice(0, 100);
    if (!documentId || !Number.isInteger(documentRevision) || documentRevision < 1) {
      return res.status(400).json({ error: "documentId and documentRevision are required" });
    }
    const sql = getSql();
    const loaded = await fetchDocument(sql, documentId, owner.ownerSubject);
    if (!loaded?.snapshot) return res.status(404).json({ error: "Builder document not found" });
    if (loaded.document.currentDocumentRevision !== documentRevision) {
      return res.status(409).json({
        error: "Builder document revision changed",
        code: "DOCUMENT_REVISION_MISMATCH",
      });
    }
    const retrySnapshot = selectRetryAssetRequests(loaded.snapshot, assetRequestIds);
    const retryRequests = retrySnapshot.assets.requests;
    if (!retryRequests.length) {
      return res.status(422).json({
        error: "No retryable asset requests were found",
        code: "ASSET_RETRY_TARGET_REQUIRED",
      });
    }
    if (assetRequestIds.length) {
      const selectedIds = new Set(retryRequests.map((request) => String(request.assetRequestId)));
      const missing = assetRequestIds.filter((id) => !selectedIds.has(id));
      if (missing.length) {
        return res.status(422).json({
          error: "One or more asset requests are not retryable",
          code: "ASSET_RETRY_TARGET_INVALID",
          assetRequestIds: missing,
        });
      }
    }
    const { assetJobs, assetWarning } = await enqueueAndScheduleBuilderAssetJobs(sql, {
      documentId,
      documentRevision,
      snapshot: retrySnapshot,
    });
    return res.status(assetWarning ? 409 : 202).json({
      ok: !assetWarning,
      documentId,
      documentRevision,
      assetJobs,
      assetWarning,
    });
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      error: "Builder asset retry failed",
      code: error.code || null,
      message: error.message,
    });
  }
};

module.exports.selectRetryAssetRequests = selectRetryAssetRequests;
