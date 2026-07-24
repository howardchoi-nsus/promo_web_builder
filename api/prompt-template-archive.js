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
    const changeNote = String(body.changeNote || body.change_note || "Prompt archived.").trim();
    if (!id) return res.status(400).json({ error: "id is required" });

    const sql = getSql();
    await ensureDefaultPromptTemplates(sql);
    const rows = await sql`
      select id::text, type, body, status, version, provider, model, model_options
      from prompt_templates
      where id = ${id}::uuid
      limit 1
    `;
    if (!rows.length) return res.status(404).json({ error: "Prompt template not found" });

    const current = rows[0];
    if (current.status === "active") {
      return res.status(409).json({ error: "Active prompt templates cannot be archived" });
    }
    if (current.status === "archived") {
      return res.status(409).json({ error: "Prompt template is already archived" });
    }

    const [updatedRows] = await sql.transaction([
      sql`
        update prompt_templates
        set
          status = 'archived',
          archived_at = now(),
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
          provider,
          model,
          temperature,
          max_tokens,
          response_format,
          model_options,
          change_note,
          archived_at,
          created_at,
          updated_at
      `,
      sql`
        insert into prompt_template_histories (
          prompt_template_id,
          prompt_type,
          previous_body,
          new_body,
          previous_version,
          new_version,
          previous_status,
          new_status,
          change_note,
          previous_provider,
          new_provider,
          previous_model,
          new_model,
          previous_model_options,
          new_model_options
        )
        values (
          ${id}::uuid,
          ${current.type},
          ${current.body || ""},
          ${current.body || ""},
          ${Number(current.version || 1)},
          ${Number(current.version || 1)},
          ${current.status || ""},
          'archived',
          ${changeNote},
          ${current.provider || ""},
          ${current.provider || ""},
          ${current.model || ""},
          ${current.model || ""},
          ${JSON.stringify(current.model_options || {})}::jsonb,
          ${JSON.stringify(current.model_options || {})}::jsonb
        )
      `,
    ]);

    return res.status(200).json({ ok: true, prompt: toPromptTemplate(updatedRows[0]) });
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      error: "Prompt archive failed",
      message: error.message,
    });
  }
};
