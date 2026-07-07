const {
  ensureDefaultPromptTemplates,
  getSql,
  normalizeVariables,
  parseBody,
  toPromptTemplate,
} = require("./_prompt-template-store");

module.exports = async function handler(req, res) {
  try {
    if (req.method === "GET") return await getPrompt(req, res);
    if (req.method === "PATCH") return await updatePrompt(req, res);

    res.setHeader("Allow", "GET, PATCH");
    return res.status(405).json({ error: "Method not allowed" });
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      error: "Prompt template API failed",
      message: error.message,
    });
  }
};

async function getPrompt(req, res) {
  const id = String(req.query.id || "").trim();
  if (!id) return res.status(400).json({ error: "id is required" });

  const sql = getSql();
  await ensureDefaultPromptTemplates(sql);
  const rows = await sql`
    select
      id::text,
      type,
      name,
      body,
      status,
      version,
      required_variables,
      optional_variables,
      change_note,
      archived_at,
      created_at,
      updated_at
    from prompt_templates
    where id = ${id}::uuid
    limit 1
  `;
  if (!rows.length) return res.status(404).json({ error: "Prompt template not found" });

  const historyRows = await sql`
    select
      id::text,
      previous_version,
      new_version,
      previous_status,
      new_status,
      change_note,
      changed_at
    from prompt_template_histories
    where prompt_template_id = ${id}::uuid
    order by changed_at desc
    limit 20
  `;

  return res.status(200).json({
    ok: true,
    prompt: toPromptTemplate(rows[0]),
    histories: historyRows.map((row) => ({
      id: row.id,
      previousVersion: Number(row.previous_version || 0),
      newVersion: Number(row.new_version || 0),
      previousStatus: row.previous_status || "",
      newStatus: row.new_status || "",
      changeNote: row.change_note || "",
      changedAt: row.changed_at || null,
    })),
  });
}

async function updatePrompt(req, res) {
  const body = parseBody(req.body);
  const id = String(body.id || req.query.id || "").trim();
  if (!id) return res.status(400).json({ error: "id is required" });

  const nextBody = String(body.body || "");
  const nextName = String(body.name || "").trim();
  const changeNote = String(body.changeNote || body.change_note || "Prompt updated.").trim();
  const requiredVariables = normalizeVariables(body.requiredVariables || body.required_variables);
  const optionalVariables = normalizeVariables(body.optionalVariables || body.optional_variables);

  if (!nextBody.trim()) return res.status(400).json({ error: "body is required" });
  if (!nextName) return res.status(400).json({ error: "name is required" });

  const sql = getSql();
  await ensureDefaultPromptTemplates(sql);
  const rows = await sql`
    select
      id::text,
      type,
      name,
      body,
      status,
      version,
      required_variables,
      optional_variables,
      change_note,
      archived_at,
      created_at,
      updated_at
    from prompt_templates
    where id = ${id}::uuid
    limit 1
  `;
  if (!rows.length) return res.status(404).json({ error: "Prompt template not found" });

  const current = rows[0];
  if (current.status === "archived") {
    return res.status(409).json({ error: "Archived prompt templates cannot be updated" });
  }

  const nextVersion = Number(current.version || 1) + 1;
  const updatedRows = await sql`
    update prompt_templates
    set
      name = ${nextName},
      body = ${nextBody},
      version = ${nextVersion},
      required_variables = ${JSON.stringify(requiredVariables)}::jsonb,
      optional_variables = ${JSON.stringify(optionalVariables)}::jsonb,
      change_note = ${changeNote},
      updated_at = now()
    where id = ${id}::uuid
    returning
      id::text,
      type,
      name,
      body,
      status,
      version,
      required_variables,
      optional_variables,
      change_note,
      archived_at,
      created_at,
      updated_at
  `;

  await sql`
    insert into prompt_template_histories (
      prompt_template_id,
      prompt_type,
      previous_body,
      new_body,
      previous_version,
      new_version,
      previous_status,
      new_status,
      change_note
    )
    values (
      ${id}::uuid,
      ${current.type},
      ${current.body || ""},
      ${nextBody},
      ${Number(current.version || 1)},
      ${nextVersion},
      ${current.status || ""},
      ${current.status || ""},
      ${changeNote}
    )
  `;

  return res.status(200).json({
    ok: true,
    prompt: toPromptTemplate(updatedRows[0]),
  });
}
