const { getSql, parseBody, fetchTokenVersion } = require("./_design-token-store");

module.exports = async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method not allowed" });
  }
  try {
    const body = parseBody(req.body);
    const tokenSetId = String(body.tokenSetId || "").trim();
    const sourceVersionId = String(body.sourceVersionId || "").trim();
    if (!tokenSetId) return res.status(400).json({ error: "tokenSetId is required" });
    const sql = getSql();
    const rows = await sql`
      select create_promo_design_token_draft(
        ${tokenSetId}::uuid,
        ${sourceVersionId || null}::uuid,
        null,
        '',
        '',
        ${String(body.changeNote || (sourceVersionId ? "Rollback draft created." : "Design token draft created."))},
        ${sourceVersionId ? "rollback_draft_created" : "draft_created"}
      )::text as id
    `;
    return res.status(201).json({ ok: true, tokenSet: await fetchTokenVersion(sql, rows[0].id) });
  } catch (error) {
    const conflict = /draft already exists/i.test(error.message);
    return res.status(conflict ? 409 : (error.statusCode || 500)).json({
      error: conflict ? "A draft already exists" : "Design token draft creation failed",
      message: error.message,
    });
  }
};
