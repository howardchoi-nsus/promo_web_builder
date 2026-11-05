const { parseBody } = require("./_wizard-form-templates-store");
const { resolveBuilderOwner } = require("./_promo-builder-auth");
const { getSql } = require("./_promo-builder-document-store");
const { requireBuilderFlag } = require("./_promo-builder-flags");
const store = require("./_promo-builder-chat-workspace-store");

function createHandler(deps = {}) {
  const use = {
    parseBody, resolveBuilderOwner, getSql, requireBuilderFlag,
    createOrLoadSession: store.createOrLoadSession,
    fetchSession: store.fetchSession,
    listSessions: store.listSessions,
    ...deps,
  };
  return async function handler(req, res) {
    try {
      use.requireBuilderFlag("chatWorkspaceV1");
      res.setHeader("Cache-Control", "no-store");
      const owner = use.resolveBuilderOwner(req, res);
      const sql = use.getSql();
      if (req.method === "POST") {
        const body = use.parseBody(req.body);
        const documentId = String(body.documentId || "").trim();
        if (!documentId) return res.status(400).json({ error: "documentId is required" });
        const session = await use.createOrLoadSession(sql, {
          documentId,
          requestId: String(body.requestId || "").trim(),
          ownerSubject: owner.ownerSubject,
        });
        if (!session) return res.status(404).json({ error: "Builder document not found" });
        const workspace = await use.fetchSession(sql, { sessionId: session.id, ownerSubject: owner.ownerSubject });
        return res.status(201).json({ ok: true, ...workspace });
      }
      if (req.method === "GET") {
        const sessionId = String(req.query?.sessionId || "").trim();
        if (!sessionId) {
          const sessions = await use.listSessions(sql, {
            ownerSubject: owner.ownerSubject,
            limit: req.query?.limit,
          });
          return res.status(200).json({ ok: true, sessions });
        }
        const workspace = await use.fetchSession(sql, { sessionId, ownerSubject: owner.ownerSubject });
        if (!workspace) return res.status(404).json({ error: "Chat session not found" });
        return res.status(200).json({ ok: true, ...workspace });
      }
      res.setHeader("Allow", "GET, POST");
      return res.status(405).json({ error: "Method not allowed" });
    } catch (error) {
      return res.status(error.statusCode || 500).json({ error: error.message, code: error.code || null, details: error.details });
    }
  };
}

module.exports = createHandler();
module.exports.createHandler = createHandler;
