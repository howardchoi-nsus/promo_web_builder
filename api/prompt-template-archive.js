const {
  ensureDefaultPromptTemplates,
  getSql,
  parseBody,
  toPromptTemplate,
} = require("./_prompt-template-store");
const { resolveAdminOwner } = require("./_promo-admin-auth");

module.exports = async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    resolveAdminOwner(req, res);
    res.setHeader("Cache-Control", "private, no-store");
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

    const updatedRows = await sql`
      with updated as (
        update prompt_templates
        set
          status = 'archived',
          archived_at = now(),
          change_note = ${changeNote},
          updated_at = now()
        where id = ${id}::uuid
          and status = ${current.status}
        returning *
      ),
      history as (
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
        select
          updated.id,
          updated.type,
          updated.body,
          updated.body,
          updated.version,
          updated.version,
          ${current.status || ""},
          'archived',
          ${changeNote},
          updated.provider,
          updated.provider,
          updated.model,
          updated.model,
          updated.model_options,
          updated.model_options
        from updated
        returning id
      )
      select
        updated.id::text,
        updated.type,
        updated.name,
        updated.body,
        updated.status,
        updated.version,
        updated.lineage_id::text,
        updated.source_prompt_template_id::text,
        updated.validated_at,
        updated.required_variables,
        updated.optional_variables,
        updated.provider,
        updated.model,
        updated.temperature,
        updated.max_tokens,
        updated.response_format,
        updated.model_options,
        updated.change_note,
        updated.archived_at,
        updated.created_at,
        updated.updated_at
      from updated
    `;
    if (!updatedRows.length) {
      return res.status(409).json({ error: "Prompt status changed before archive completed" });
    }

    return res.status(200).json({ ok: true, prompt: toPromptTemplate(updatedRows[0]) });
  } catch (error) {
    res.setHeader("Cache-Control", "private, no-store");
    return res.status(error.statusCode || 500).json({
      error: "Prompt archive failed",
      message: error.message,
      code: error.code,
    });
  }
};
