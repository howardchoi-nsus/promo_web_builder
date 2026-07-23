const { getSql, parseBody, fetchTokenSets } = require("./_design-token-store");

module.exports = async function handler(req, res) {
  try {
    if (req.method === "GET") return res.status(200).json({ ok: true, tokenSets: await fetchTokenSets(getSql(), { activeOnly: String(req.query.scope || "") === "public" }) });
    if (req.method !== "POST") { res.setHeader("Allow", "GET, POST"); return res.status(405).json({ error: "Method not allowed" }); }
    const body = parseBody(req.body);
    const setKey = String(body.setKey || "").trim();
    const name = String(body.name || "").trim();
    if (!/^[a-z][a-z0-9-]*$/.test(setKey)) return res.status(400).json({ error: "setKey must use lowercase letters, numbers and hyphens" });
    if (!name) return res.status(400).json({ error: "name is required" });
    const rows = await getSql()`
      insert into promo_design_token_sets (set_key, name, description)
      values (${setKey}, ${name}, ${String(body.description || "")}) returning id::text
    `;
    return res.status(201).json({ ok: true, id: rows[0].id });
  } catch (error) {
    const conflict = error.code === "23505";
    return res.status(conflict ? 409 : (error.statusCode || 500)).json({ error: conflict ? "setKey already exists" : "Design token sets API failed", message: error.message });
  }
};
