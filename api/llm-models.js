const { resolveAdminOwner } = require("./_promo-admin-auth");
const { parseBody } = require("./_prompt-template-store");
const {
  createModel,
  getSql,
  listModels,
  updateModel,
} = require("./_llm-model-registry-store");

module.exports = async function handler(req, res) {
  try {
    res.setHeader("Cache-Control", "no-store");
    const owner = resolveAdminOwner(req, res);
    const sql = getSql();
    if (req.method === "GET") {
      return res.status(200).json({ ok: true, models: await listModels(sql) });
    }
    const body = parseBody(req.body);
    if (req.method === "POST") {
      const model = await createModel(sql, body, owner.ownerSubject);
      return res.status(201).json({ ok: true, model });
    }
    if (req.method === "PATCH") {
      const id = String(body.id || "").trim();
      if (!id) return res.status(400).json({ error: "id is required", code: "LLM_MODEL_ID_REQUIRED" });
      const model = await updateModel(sql, id, body, owner.ownerSubject);
      if (!model) return res.status(404).json({ error: "LLM model not found", code: "LLM_MODEL_NOT_FOUND" });
      return res.status(200).json({ ok: true, model });
    }
    res.setHeader("Allow", "GET, POST, PATCH");
    return res.status(405).json({ error: "Method not allowed" });
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      error: error.message,
      code: error.code || "LLM_MODEL_REGISTRY_FAILED",
    });
  }
};
