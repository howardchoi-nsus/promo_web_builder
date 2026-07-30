const { randomUUID } = require("node:crypto");
const { parseBody } = require("./_wizard-form-templates-store");
const { resolveBuilderOwner } = require("./_promo-builder-auth");
const {
  getSql,
  createDocument,
  fetchDocument,
} = require("./_promo-builder-document-store");

module.exports = async function handler(req, res) {
  try {
    res.setHeader("Cache-Control", "no-store");
    if (req.method === "POST") {
      const owner = resolveBuilderOwner(req, res);
      const body = parseBody(req.body);
      const mode = body.mode === "template" ? "template" : "ai";
      const idempotencyKey = String(body.idempotencyKey || "").trim() || randomUUID();
      const document = await createDocument(getSql(), {
        ownerSubject: owner.ownerSubject,
        mode,
        idempotencyKey,
      });
      return res.status(201).json({ ok: true, document });
    }
    if (req.method === "GET") {
      const owner = resolveBuilderOwner(req, res);
      const documentId = String(req.query.documentId || "").trim();
      if (!documentId) return res.status(400).json({ error: "documentId is required" });
      const result = await fetchDocument(getSql(), documentId, owner.ownerSubject);
      if (!result) return res.status(404).json({ error: "Builder document not found" });
      return res.status(200).json({ ok: true, ...result });
    }
    res.setHeader("Allow", "GET, POST");
    return res.status(405).json({ error: "Method not allowed" });
  } catch (error) {
    const status = /access denied/i.test(error.message) ? 403
      : /revision conflict/i.test(error.message) ? 409
        : error.statusCode || 500;
    return res.status(status).json({
      error: "Builder document API failed",
      code: error.code || null,
      message: error.message,
    });
  }
};
