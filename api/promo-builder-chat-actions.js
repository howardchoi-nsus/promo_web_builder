const { parseBody } = require("./_wizard-form-templates-store");
const { resolveBuilderOwner } = require("./_promo-builder-auth");
const { getSql } = require("./_promo-builder-document-store");
const { requireBuilderFlag } = require("./_promo-builder-flags");
const { assertActionTransition } = require("./_promo-builder-chat-workspace-contract");
const store = require("./_promo-builder-chat-workspace-store");

function createHandler(deps = {}) {
  const use = {
    parseBody, resolveBuilderOwner, getSql, requireBuilderFlag, assertActionTransition,
    fetchSession: store.fetchSession, fetchAction: store.fetchAction, executeAction: store.executeAction,
    fetchConfirmedWireframe: store.fetchConfirmedWireframe, fetchCompletedDocument:store.fetchCompletedDocument, ...deps,
  };
  return async function handler(req, res) {
    if (req.method !== "POST") {
      res.setHeader("Allow", "POST");
      return res.status(405).json({ error: "Method not allowed" });
    }
    const handlerVersion='completed-resume-v2';
    res.setHeader('X-Promo-Chat-Actions-Version',handlerVersion);
    if(process.env.VERCEL_GIT_COMMIT_SHA)res.setHeader('X-Promo-Build-Sha',process.env.VERCEL_GIT_COMMIT_SHA);
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
      const existing = await use.fetchAction(sql,{sessionId,actionId,actionKey,ownerSubject:owner.ownerSubject});
      if(!existing)return res.status(409).json({error:'승인 버튼 정보가 최신 대화와 일치하지 않습니다.',code:'CHAT_ACTION_STALE',handlerVersion});
      if(existing?.status==='executed')return res.status(200).json({ok:true,action:existing,replayed:true,stage:workspace.session.stage});
      if(actionKey==='approve_wireframe'&&workspace.session.stage==='completed'&&existing&&['proposed','expired'].includes(existing.status)){
        const completed=await use.fetchCompletedDocument(sql,{sessionId,ownerSubject:owner.ownerSubject});
        if(!completed)return res.status(409).json({error:'완료된 디자인 문서를 찾지 못했습니다.',code:'COMPLETED_DOCUMENT_NOT_FOUND',handlerVersion});
        // This is a read-only recovery, not approval of a stale/proposed action.
        return res.status(200).json({ok:true,action:existing,replayed:true,resumeOnly:true,stage:'completed',...completed,handlerVersion});
      }
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
      return res.status(200).json({ ok: true, ...executed, stage: executed.stage || transition.to });
    } catch (error) {
      return res.status(error.statusCode || 500).json({ error: error.message, code: error.code || null, details: error.details, handlerVersion });
    }
  };
}

module.exports = createHandler();
module.exports.createHandler = createHandler;
