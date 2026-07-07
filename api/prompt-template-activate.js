const {
  ensureDefaultPromptTemplates,
  getSql,
  parseBody,
  toPromptTemplate,
} = require("./_prompt-template-store");

module.exports = async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const body = parseBody(req.body);
    const id = String(body.id || req.query.id || "").trim();
    const changeNote = String(body.changeNote || body.change_note || "Prompt activated.").trim();
    if (!id) return res.status(400).json({ error: "id is required" });

    const sql = getSql();
    await ensureDefaultPromptTemplates(sql);
    const rows = await sql`
      select id::text, type, body, status, version
      from prompt_templates
      where id = ${id}::uuid
      limit 1
    `;
    if (!rows.length) return res.status(404).json({ error: "Prompt template not found" });
    const target = rows[0];
    if (target.status === "archived") {
      return res.status(409).json({ error: "Archived prompt templates cannot be activated" });
    }

    const oldActiveRows = await sql`
      select id::text, type, body, status, version
      from prompt_templates
      where type = ${target.type}
        and status = 'active'
        and id <> ${id}::uuid
    `;

    for (const oldActive of oldActiveRows) {
      await sql`
        update prompt_templates
        set status = 'inactive', updated_at = now()
        where id = ${oldActive.id}::uuid
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
          ${oldActive.id}::uuid,
          ${oldActive.type},
          ${oldActive.body || ""},
          ${oldActive.body || ""},
          ${Number(oldActive.version || 1)},
          ${Number(oldActive.version || 1)},
          ${oldActive.status || ""},
          'inactive',
          ${`Superseded by prompt ${id}.`}
        )
      `;
    }

    const updatedRows = await sql`
      update prompt_templates
      set status = 'active', change_note = ${changeNote}, updated_at = now()
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
        ${target.type},
        ${target.body || ""},
        ${target.body || ""},
        ${Number(target.version || 1)},
        ${Number(target.version || 1)},
        ${target.status || ""},
        'active',
        ${changeNote}
      )
    `;

    return res.status(200).json({ ok: true, prompt: toPromptTemplate(updatedRows[0]) });
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      error: "Prompt activation failed",
      message: error.message,
    });
  }
};
