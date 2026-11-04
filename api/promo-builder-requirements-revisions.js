const { parseBody } = require("./_wizard-form-templates-store");
const { resolveBuilderOwner } = require("./_promo-builder-auth");
const { getSql } = require("./_promo-builder-document-store");
const { requireBuilderFlag } = require("./_promo-builder-flags");
const store = require("./_promo-builder-chat-workspace-store");

function createHandler(deps = {}) {
  const use = {
    parseBody, resolveBuilderOwner, getSql, requireBuilderFlag,
    saveRequirementsRevision: store.saveRequirementsRevision, ...deps,
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
      const requirements = body.requirements && typeof body.requirements === "object" ? body.requirements : null;
      if (!sessionId || !requirements) return res.status(400).json({ error: "sessionId and requirements are required" });
      const saved = await use.saveRequirementsRevision(use.getSql(), {
        sessionId,
        ownerSubject: owner.ownerSubject,
        documentRevision: Math.max(0, Number(body.documentRevision || 0)),
        requirements,
        fingerprint: String(body.fingerprint || "").trim(),
      });
      if (!saved) return res.status(404).json({ error: "Chat session not found" });
      return res.status(201).json({ ok: true, requirements: saved });
    } catch (error) {
      return res.status(error.statusCode || 500).json({ error: error.message, code: error.code || null, details: error.details });
    }
  };
}

module.exports = createHandler();
module.exports.createHandler = createHandler;
