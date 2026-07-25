const {
  getSql, parseBody, createTokenSetKey, fetchTokenVersion,
} = require("./_design-token-store");

module.exports = async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method not allowed" });
  }
  try {
    const body = parseBody(req.body);
    const sourceVersionId = String(body.sourceVersionId || "").trim();
    const name = String(body.name || "").trim();
    if (!sourceVersionId || !name) return res.status(400).json({ error: "sourceVersionId and name are required" });
    const sql = getSql();
    const rows = await sql`
      select clone_promo_design_token_set(
        ${sourceVersionId}::uuid,
        ${createTokenSetKey(name)},
        ${name},
        ${String(body.description || "")},
        ${String(body.changeNote || "Design token set cloned.")}
      )::text as id
    `;
    return res.status(201).json({ ok: true, tokenSet: await fetchTokenVersion(sql, rows[0].id) });
  } catch (error) {
    const conflict = error.code === "23505";
    return res.status(conflict ? 409 : (error.statusCode || 500)).json({
      error: conflict ? "Design token set already exists" : "Design token set clone failed",
      message: error.message,
    });
  }
};
