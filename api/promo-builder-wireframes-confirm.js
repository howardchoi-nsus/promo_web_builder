const { parseBody } = require("./_wizard-form-templates-store");
const { resolveBuilderOwner } = require("./_promo-builder-auth");
const { getSql } = require("./_promo-builder-document-store");
const { requireBuilderFlag } = require("./_promo-builder-flags");
const store = require("./_promo-builder-chat-workspace-store");

function createHandler(deps = {}) {
  const use = {
    parseBody, resolveBuilderOwner, getSql, requireBuilderFlag,
    confirmWireframeRevision: store.confirmWireframeRevision, ...deps,
  };
  return async function handler(req, res) {
    if (req.method !== "POST") {
      res.setHeader("Allow", "POST");
      return res.status(405).json({ error: "Method not allowed" });
    }
    try {
      use.requireBuilderFlag("chatWorkspaceV1");
      res.setHeader("Cache-Control", "no-store");
      const owner = use.resolveBuilderOwner(req, res);
      const body = use.parseBody(req.body);
      const sessionId = String(body.sessionId || "").trim();
      const revision = Number(body.revision || 0);
      const structureFingerprint = String(body.structureFingerprint || "").trim();
      if (!sessionId || !revision || !structureFingerprint) {
        return res.status(400).json({ error: "sessionId, revision and structureFingerprint are required" });
      }
      const wireframe = await use.confirmWireframeRevision(use.getSql(), {
        sessionId, ownerSubject: owner.ownerSubject, revision, structureFingerprint,
      });
      if (!wireframe) return res.status(409).json({ error: "Wireframe revision is stale", code: "WIREFRAME_REVISION_STALE" });
      return res.status(200).json({ ok: true, wireframe });
    } catch (error) {
      return res.status(error.statusCode || 500).json({ error: error.message, code: error.code || null, details: error.details });
    }
  };
}

module.exports = createHandler();
module.exports.createHandler = createHandler;
