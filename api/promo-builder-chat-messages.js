const { parseBody } = require("./_wizard-form-templates-store");
const { resolveBuilderOwner } = require("./_promo-builder-auth");
const { getSql } = require("./_promo-builder-document-store");
const { requireBuilderFlag } = require("./_promo-builder-flags");
const { normalizeActions } = require("./_promo-builder-chat-workspace-contract");
const store = require("./_promo-builder-chat-workspace-store");

function createHandler(deps = {}) {
  const use = {
    parseBody, resolveBuilderOwner, getSql, requireBuilderFlag, normalizeActions,
    fetchSession: store.fetchSession, saveMessage: store.saveMessage, ...deps,
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
      const message = body.message && typeof body.message === "object" ? body.message : {};
      if (!sessionId || !message.id || !["user", "assistant", "system"].includes(message.role)) {
        return res.status(400).json({ error: "sessionId and a valid message are required" });
      }
      const sql = use.getSql();
      const workspace = await use.fetchSession(sql, { sessionId, ownerSubject: owner.ownerSubject });
      if (!workspace) return res.status(404).json({ error: "Chat session not found" });
      const actions = use.normalizeActions(message.actions || [], workspace.session.stage);
      const saved = await use.saveMessage(sql, {
        sessionId, ownerSubject: owner.ownerSubject, message, actions,
      });
      if (!saved) return res.status(404).json({ error: "Chat session not found" });
      return res.status(201).json({ ok: true, message: saved });
    } catch (error) {
      return res.status(error.statusCode || 500).json({ error: error.message, code: error.code || null, details: error.details });
    }
  };
}

module.exports = createHandler();
module.exports.createHandler = createHandler;
