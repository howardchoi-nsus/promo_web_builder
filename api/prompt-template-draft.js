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
    const changeNote = String(body.changeNote || body.change_note || "New prompt draft created.").trim();
    if (!id) return res.status(400).json({ error: "id is required" });

    const sql = getSql();
    await ensureDefaultPromptTemplates(sql);
    const sourceRows = await sql`
      select id::text, lineage_id::text, status
      from prompt_templates
      where id = ${id}::uuid
      limit 1
    `;
    if (!sourceRows.length) return res.status(404).json({ error: "Prompt template not found" });
    if (sourceRows[0].status === "draft") {
      return res.status(409).json({
        error: "The selected prompt is already a draft",
        code: "PROMPT_ALREADY_DRAFT",
        promptId: sourceRows[0].id,
      });
    }

    const candidateRows = await sql`
      select id::text, status
      from prompt_templates
      where lineage_id = ${sourceRows[0].lineage_id}::uuid
        and status in ('draft', 'validated')
      limit 1
    `;
    if (candidateRows.length) {
      return res.status(409).json({
        error: "A draft or validated candidate already exists for this prompt",
        code: "PROMPT_CANDIDATE_EXISTS",
        promptId: candidateRows[0].id,
        status: candidateRows[0].status,
      });
    }

    const createdRows = await sql`
      with source as (
        select *
        from prompt_templates
        where id = ${id}::uuid
      ),
      next_version as (
        select coalesce(max(version), 0) + 1 as value
        from prompt_templates
        where lineage_id = (select lineage_id from source)
      ),
      inserted as (
        insert into prompt_templates (
          type,
          name,
          body,
          status,
          version,
          lineage_id,
          source_prompt_template_id,
          required_variables,
          optional_variables,
          provider,
          model,
          temperature,
          max_tokens,
          response_format,
          model_options,
          change_note
        )
        select
          source.type,
          source.name,
          source.body,
          'draft',
          next_version.value,
          source.lineage_id,
          source.id,
          source.required_variables,
          source.optional_variables,
          source.provider,
          source.model,
          source.temperature,
          source.max_tokens,
          source.response_format,
          source.model_options,
          ${changeNote}
        from source
        cross join next_version
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
          inserted.id,
          inserted.type,
          source.body,
          inserted.body,
          source.version,
          inserted.version,
          source.status,
          inserted.status,
          ${changeNote},
          source.provider,
          inserted.provider,
          source.model,
          inserted.model,
          source.model_options,
          inserted.model_options
        from inserted
        cross join source
        returning id
      )
      select
        inserted.id::text,
        inserted.type,
        inserted.name,
        inserted.body,
        inserted.status,
        inserted.version,
        inserted.lineage_id::text,
        inserted.source_prompt_template_id::text,
        inserted.validated_at,
        inserted.required_variables,
        inserted.optional_variables,
        inserted.provider,
        inserted.model,
        inserted.temperature,
        inserted.max_tokens,
        inserted.response_format,
        inserted.model_options,
        inserted.change_note,
        inserted.archived_at,
        inserted.created_at,
        inserted.updated_at
      from inserted
    `;

    return res.status(201).json({ ok: true, prompt: toPromptTemplate(createdRows[0]) });
  } catch (error) {
    const conflict = error.code === "23505";
    return res.status(conflict ? 409 : (error.statusCode || 500)).json({
      error: conflict ? "A prompt draft was created concurrently" : "Prompt draft creation failed",
      message: error.message,
      code: conflict ? "PROMPT_CANDIDATE_EXISTS" : error.code,
    });
  }
};
