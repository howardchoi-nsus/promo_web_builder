const { resolveAdminOwner } = require("./_promo-admin-auth");
const { parseBody } = require("./_wizard-form-templates-store");
const {
  createReference, getSql, listHistories, listReferences, updateReference,
} = require("./_layout-reference-store");

module.exports = async function handler(req, res) {
  try {
    res.setHeader("Cache-Control", "private, no-store");
    const owner = resolveAdminOwner(req, res);
    const sql = getSql();
    if (req.method === "GET") {
      const includeArchived = String(req.query?.includeArchived || "true") !== "false";
      const [references, histories] = await Promise.all([
        listReferences(sql, { includeArchived }),
        listHistories(sql, req.query?.historyLimit),
      ]);
      return res.status(200).json({ ok: true, references, histories });
    }
    const body = parseBody(req.body);
    if (req.method === "POST") {
      const reference = await createReference(sql, body, owner.actorSubject);
      return res.status(201).json({ ok: true, reference });
    }
    if (req.method === "PATCH") {
      const id = String(body.id || "").trim();
      if (!id) return res.status(400).json({ error: "id is required", code: "LAYOUT_REFERENCE_ID_REQUIRED" });
      const reference = await updateReference(sql, id, body, owner.actorSubject);
      if (!reference) return res.status(404).json({ error: "Layout reference not found", code: "LAYOUT_REFERENCE_NOT_FOUND" });
      return res.status(200).json({ ok: true, reference });
    }
    res.setHeader("Allow", "GET, POST, PATCH");
    return res.status(405).json({ error: "Method not allowed" });
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      error: error.message,
      code: error.code || "LAYOUT_REFERENCE_API_FAILED",
    });
  }
};
