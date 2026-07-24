const {
  ensureDefaultPromptTemplates,
  getSql,
  parseBody,
  toPromptTemplate,
  validatePromptTemplateContract,
} = require("./_prompt-template-store");
const { validateStageModelConfig } = require("./_prompt-execution-snapshot");

module.exports = async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const body = parseBody(req.body);
    const id = String(body.id || req.query.id || "").trim();
    const changeNote = String(body.changeNote || body.change_note || "Prompt contracts validated.").trim();
    if (!id) return res.status(400).json({ error: "id is required" });

    const sql = getSql();
    await ensureDefaultPromptTemplates(sql);
    const rows = await sql`
      select *
      from prompt_templates
      where id = ${id}::uuid
      limit 1
    `;
    if (!rows.length) return res.status(404).json({ error: "Prompt template not found" });
    const current = rows[0];
    if (current.status !== "draft") {
      return res.status(409).json({
        error: "Only draft prompt templates can be validated",
        code: "PROMPT_DRAFT_REQUIRED",
      });
    }

    validatePromptTemplateContract(current.type, {
      body: current.body,
      requiredVariables: current.required_variables,
      optionalVariables: current.optional_variables,
    });
    validateStageModelConfig(current.type, {
      provider: current.provider,
      model: current.model,
      responseFormat: current.response_format,
      modelOptions: current.model_options,
    });

    const updatedRows = await sql`
      with updated as (
        update prompt_templates
        set
          status = 'validated',
          validated_at = now(),
          change_note = ${changeNote},
          updated_at = now()
        where id = ${id}::uuid
          and status = 'draft'
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
          'draft',
          'validated',
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
      return res.status(409).json({
        error: "Prompt draft status changed before validation completed",
        code: "PROMPT_DRAFT_REQUIRED",
      });
    }

    return res.status(200).json({ ok: true, prompt: toPromptTemplate(updatedRows[0]) });
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      error: "Prompt validation failed",
      message: error.message,
      code: error.code,
    });
  }
};
