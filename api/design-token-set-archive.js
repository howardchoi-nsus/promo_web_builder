const { getSql, parseBody, fetchTokenSetUsage } = require("./_design-token-store");

module.exports = async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method not allowed" });
  }
  try {
    const body = parseBody(req.body);
    const tokenSetId = String(body.tokenSetId || "").trim();
    if (!tokenSetId) return res.status(400).json({ error: "tokenSetId is required" });
    const sql = getSql();
    const setRows = await sql`
      select id::text, status, is_default
      from promo_design_token_sets
      where id = ${tokenSetId}::uuid
      limit 1
    `;
    if (!setRows.length) return res.status(404).json({ error: "Design token set not found" });
    if (setRows[0].status !== "inactive") {
      return res.status(409).json({
        error: "Deactivate the design token set before deleting it",
        code: "TOKEN_SET_DEACTIVATION_REQUIRED",
      });
    }
    if (setRows[0].is_default) {
      return res.status(409).json({ error: "Default design token set cannot be deleted" });
    }
    const usage = await fetchTokenSetUsage(sql, tokenSetId);
    if (usage.templates.length) {
      return res.status(409).json({ error: "Design token set is in use", usage });
    }
    const rows = await sql`
      with updated as (
        update promo_design_token_sets
        set status = 'archived', updated_at = now()
        where id = ${tokenSetId}::uuid and status = 'inactive'
        returning *
      ), archived_drafts as (
        update promo_design_token_set_versions version
        set status = 'archived', updated_at = now()
        from updated
        where version.token_set_id = updated.id and version.status = 'draft'
      ), history as (
        insert into promo_design_token_histories (
          token_set_id, action, previous_status, new_status, change_note, snapshot
        )
        select id, 'set_archived', 'inactive', 'archived',
          ${String(body.changeNote || "Design token set deleted from the active catalog.")},
          jsonb_build_object('setKey', set_key, 'name', name)
        from updated
      )
      select id::text from updated
    `;
    if (!rows.length) return res.status(409).json({ error: "Design token set status changed before deletion" });
    return res.status(200).json({
      ok: true,
      archived: true,
      preservedUsage: usage,
    });
  } catch (error) {
    return res.status(error.statusCode || 500).json({ error: "Design token archive failed", message: error.message });
  }
};
