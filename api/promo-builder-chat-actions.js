const { parseBody } = require("./_wizard-form-templates-store");
const { resolveBuilderOwner } = require("./_promo-builder-auth");
const { getSql } = require("./_promo-builder-document-store");
const { requireBuilderFlag } = require("./_promo-builder-flags");
const { assertActionTransition } = require("./_promo-builder-chat-workspace-contract");
const store = require("./_promo-builder-chat-workspace-store");

function createHandler(deps = {}) {
  const use = {
    parseBody, resolveBuilderOwner, getSql, requireBuilderFlag, assertActionTransition,
    fetchSession: store.fetchSession, executeAction: store.executeAction,
    fetchConfirmedWireframe: store.fetchConfirmedWireframe, ...deps,
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
      const actionId = String(body.actionId || "").trim();
      const actionKey = String(body.actionKey || "").trim();
      const idempotencyKey = String(body.idempotencyKey || "").trim();
      if (!sessionId || !actionId || !actionKey || !idempotencyKey) {
        return res.status(400).json({ error: "sessionId, actionId, actionKey and idempotencyKey are required" });
      }
      const sql = use.getSql();
      const workspace = await use.fetchSession(sql, { sessionId, ownerSubject: owner.ownerSubject });
      if (!workspace) return res.status(404).json({ error: "Chat session not found" });
      const transition = use.assertActionTransition(actionKey, workspace.session.stage);
      if (actionKey === "approve_wireframe") {
        const confirmed = await use.fetchConfirmedWireframe(sql, {
          sessionId,
          ownerSubject: owner.ownerSubject,
          revision: workspace.session.confirmedWireframeRevision,
        });
        if (!confirmed) return res.status(409).json({ error: "Wireframe confirmation is required", code: "WIREFRAME_CONFIRMATION_REQUIRED" });
      }
      const executed = await use.executeAction(sql, {
        sessionId, actionId, actionKey, ownerSubject: owner.ownerSubject, idempotencyKey,
        nextStage: transition.to,
      });
      if (!executed) return res.status(409).json({ error: "Action is stale or unavailable", code: "CHAT_ACTION_STALE" });
      return res.status(200).json({ ok: true, ...executed, stage: transition.to });
    } catch (error) {
      return res.status(error.statusCode || 500).json({ error: error.message, code: error.code || null, details: error.details });
    }
  };
}

module.exports = createHandler();
module.exports.createHandler = createHandler;
