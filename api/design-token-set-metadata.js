const { getSql, parseBody, fetchManagedTokenSets } = require("./_design-token-store");

module.exports = async function handler(req, res) {
  if (req.method !== "PATCH") {
    res.setHeader("Allow", "PATCH");
    return res.status(405).json({ error: "Method not allowed" });
  }
  try {
    const body = parseBody(req.body);
    const tokenSetId = String(body.tokenSetId || "").trim();
    const name = String(body.name || "").trim();
    if (!tokenSetId || !name) return res.status(400).json({ error: "tokenSetId and name are required" });
    const sql = getSql();
    const rows = await sql`
      with previous as (
        select * from promo_design_token_sets where id = ${tokenSetId}::uuid for update
      ), updated as (
        update promo_design_token_sets token_set
        set name = ${name}, description = ${String(body.description || "")}, updated_at = now()
        from previous
        where token_set.id = previous.id and previous.status <> 'archived'
        returning token_set.*
      ), history as (
        insert into promo_design_token_histories (
          token_set_id, action, previous_status, new_status, change_note, snapshot
        )
        select id, 'set_updated', status, status,
          ${String(body.changeNote || "Design token set metadata updated.")},
          jsonb_build_object('name', name, 'description', description)
        from updated
      )
      select id::text from updated
    `;
    if (!rows.length) return res.status(404).json({ error: "Active design token set not found" });
    const sets = await fetchManagedTokenSets(sql);
    return res.status(200).json({ ok: true, tokenSet: sets.find((set) => set.id === tokenSetId) || null });
  } catch (error) {
    return res.status(error.statusCode || 500).json({ error: "Design token metadata update failed", message: error.message });
  }
};
