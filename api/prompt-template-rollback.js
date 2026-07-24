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
    const changeNote = String(body.changeNote || body.change_note || "Rolled back to a previous prompt version.").trim();
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
    const target = rows[0];
    if (!["inactive", "archived"].includes(target.status)) {
      return res.status(409).json({
        error: "Only inactive or archived prompt versions can be restored",
        code: "PROMPT_ROLLBACK_TARGET_INVALID",
      });
    }

    validatePromptTemplateContract(target.type, {
      body: target.body,
      requiredVariables: target.required_variables,
      optionalVariables: target.optional_variables,
    });
    validateStageModelConfig(target.type, {
      provider: target.provider,
      model: target.model,
      responseFormat: target.response_format,
    });

    const updatedRows = await sql`
      with deactivated as (
        update prompt_templates
        set status = 'inactive', updated_at = now()
        where type = ${target.type}
          and status = 'active'
          and id <> ${id}::uuid
        returning *
      ),
      deactivated_history as (
        insert into prompt_template_histories (
          prompt_template_id, prompt_type, previous_body, new_body,
          previous_version, new_version, previous_status, new_status, change_note,
          previous_provider, new_provider, previous_model, new_model,
          previous_model_options, new_model_options
        )
        select
          deactivated.id, deactivated.type, deactivated.body, deactivated.body,
          deactivated.version, deactivated.version,
          'active', 'inactive', ${`Rolled back to prompt ${id}.`},
          deactivated.provider, deactivated.provider,
          deactivated.model, deactivated.model,
          deactivated.model_options, deactivated.model_options
        from deactivated
        returning id
      ),
      activated as (
        update prompt_templates
        set
          status = 'active',
          archived_at = null,
          validated_at = coalesce(validated_at, now()),
          change_note = ${changeNote},
          updated_at = now()
        where id = ${id}::uuid
          and status = ${target.status}
          and not exists (
            select 1
            from prompt_templates active_prompt
            where active_prompt.type = ${target.type}
              and active_prompt.status = 'active'
              and active_prompt.id <> ${id}::uuid
              and active_prompt.id not in (select id from deactivated)
          )
        returning *
      ),
      activated_history as (
        insert into prompt_template_histories (
          prompt_template_id, prompt_type, previous_body, new_body,
          previous_version, new_version, previous_status, new_status, change_note,
          previous_provider, new_provider, previous_model, new_model,
          previous_model_options, new_model_options
        )
        select
          activated.id, activated.type, activated.body, activated.body,
          activated.version, activated.version,
          ${target.status || ""}, 'active', ${changeNote},
          activated.provider, activated.provider,
          activated.model, activated.model,
          activated.model_options, activated.model_options
        from activated
        returning id
      )
      select
        activated.id::text,
        activated.type,
        activated.name,
        activated.body,
        activated.status,
        activated.version,
        activated.lineage_id::text,
        activated.source_prompt_template_id::text,
        activated.validated_at,
        activated.required_variables,
        activated.optional_variables,
        activated.provider,
        activated.model,
        activated.temperature,
        activated.max_tokens,
        activated.response_format,
        activated.model_options,
        activated.change_note,
        activated.archived_at,
        activated.created_at,
        activated.updated_at
      from activated
    `;
    if (!updatedRows.length) {
      return res.status(409).json({
        error: "Prompt status changed before rollback completed",
        code: "PROMPT_ROLLBACK_TARGET_INVALID",
      });
    }
    return res.status(200).json({
      ok: true,
      prompt: toPromptTemplate(updatedRows[0]),
    });
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      error: "Prompt rollback failed",
      message: error.message,
      code: error.code,
    });
  }
};
