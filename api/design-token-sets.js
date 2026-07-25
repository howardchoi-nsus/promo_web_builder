const {
  getSql, parseBody, createTokenSetKey, fetchTokenSets, fetchManagedTokenSets,
} = require("./_design-token-store");

module.exports = async function handler(req, res) {
  try {
    if (req.method === "GET") {
      const sql = getSql();
      if (String(req.query.scope || "") === "public") {
        return res.status(200).json({ ok: true, tokenSets: await fetchTokenSets(sql, { activeOnly: true }) });
      }
      return res.status(200).json({
        ok: true,
        tokenSets: await fetchManagedTokenSets(sql, { includeArchived: String(req.query.includeArchived || "") === "true" }),
      });
    }
    if (req.method !== "POST") { res.setHeader("Allow", "GET, POST"); return res.status(405).json({ error: "Method not allowed" }); }
    const body = parseBody(req.body);
    const name = String(body.name || "").trim();
    if (!name) return res.status(400).json({ error: "name is required" });
    const setKey = createTokenSetKey(name);
    const changeNote = String(body.changeNote || "Design token set created.");
    const rows = await getSql()`
      with created as (
        insert into promo_design_token_sets (set_key, name, description)
        values (${setKey}, ${name}, ${String(body.description || "")})
        returning *
      ), history as (
        insert into promo_design_token_histories (
          token_set_id, action, new_status, change_note, snapshot
        )
        select id, 'set_created', status, ${changeNote},
          jsonb_build_object('setKey', set_key, 'name', name, 'description', description)
        from created
      )
      select id::text, set_key, name, description, status from created
    `;
    return res.status(201).json({
      ok: true,
      tokenSet: {
        id: rows[0].id,
        setKey: rows[0].set_key,
        name: rows[0].name,
        description: rows[0].description || "",
        status: rows[0].status,
      },
    });
  } catch (error) {
    const conflict = error.code === "23505";
    return res.status(conflict ? 409 : (error.statusCode || 500)).json({ error: conflict ? "Design token set already exists" : "Design token sets API failed", message: error.message });
  }
};
