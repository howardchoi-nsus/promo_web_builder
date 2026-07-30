const {
  getSql,
  parseBody,
  fetchManagedTokenSets,
} = require("./_design-token-store");

const ACTIONS = new Set(["activate", "deactivate", "set-default"]);

module.exports = async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method not allowed" });
  }
  try {
    const body = parseBody(req.body);
    const tokenSetId = String(body.tokenSetId || "").trim();
    const action = String(body.action || "").trim();
    if (!tokenSetId || !ACTIONS.has(action)) {
      return res.status(400).json({ error: "tokenSetId and a valid action are required" });
    }
    const sql = getSql();
    const currentRows = await sql`
      select id::text, set_key, name, status, is_default
      from promo_design_token_sets
      where id = ${tokenSetId}::uuid
      for update
    `;
    const current = currentRows[0];
    if (!current || current.status === "archived") {
      return res.status(404).json({ error: "Design token set not found" });
    }

    let nextStatus = current.status;
    let historyAction = "";
    if (action === "deactivate") {
      if (current.status !== "active") {
        return res.status(409).json({ error: "Only active design token sets can be deactivated" });
      }
      if (current.is_default) {
        return res.status(409).json({
          error: "Default design token set cannot be deactivated",
          code: "DEFAULT_TOKEN_SET_DEACTIVATION_BLOCKED",
        });
      }
      nextStatus = "inactive";
      historyAction = "set_deactivated";
      await sql`
        update promo_design_token_sets
        set status = 'inactive', updated_at = now()
        where id = ${tokenSetId}::uuid and status = 'active'
      `;
    } else if (action === "activate") {
      if (current.status !== "inactive") {
        return res.status(409).json({ error: "Only inactive design token sets can be activated" });
      }
      nextStatus = "active";
      historyAction = "set_activated";
      await sql`
        update promo_design_token_sets
        set status = 'active', updated_at = now()
        where id = ${tokenSetId}::uuid and status = 'inactive'
      `;
    } else {
      if (current.status !== "active") {
        return res.status(409).json({ error: "Only active design token sets can be the default" });
      }
      historyAction = "set_default";
      await sql`
        update promo_design_token_sets
        set is_default = (id = ${tokenSetId}::uuid), updated_at = now()
        where is_default = true or id = ${tokenSetId}::uuid
      `;
    }

    await sql`
      insert into promo_design_token_histories (
        token_set_id, action, previous_status, new_status, change_note, snapshot
      ) values (
        ${tokenSetId}::uuid,
        ${historyAction},
        ${current.status},
        ${nextStatus},
        ${String(body.changeNote || `Design token set ${action}.`)},
        ${JSON.stringify({
          setKey: current.set_key,
          name: current.name,
          action,
        })}::jsonb
      )
    `;
    const sets = await fetchManagedTokenSets(sql);
    return res.status(200).json({
      ok: true,
      tokenSet: sets.find((set) => set.id === tokenSetId) || null,
    });
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      error: "Design token set status update failed",
      message: error.message,
    });
  }
};
