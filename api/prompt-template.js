const {
  ensureDefaultPromptTemplates,
  getSql,
  mergePromptTemplatePatch,
  normalizeModelOptions,
  normalizeNumber,
  parseBody,
  promptVariableContract,
  toPromptTemplate,
  validatePromptTemplateContract,
} = require("./_prompt-template-store");

// Only draft rows are mutable. A version is assigned when the draft row is
// created and never changes afterwards.
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
      lineage_id::text,
      source_prompt_template_id::text,
      validated_at,
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
      previous_provider,
      new_provider,
      previous_model,
      new_model,
      previous_model_options,
      new_model_options,
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
      previousProvider: row.previous_provider || "",
      newProvider: row.new_provider || "",
      previousModel: row.previous_model || "",
      newModel: row.new_model || "",
      previousModelOptions: row.previous_model_options || {},
      newModelOptions: row.new_model_options || {},
      changeNote: row.change_note || "",
      changedAt: row.changed_at || null,
    })),
  });
}

async function updatePrompt(req, res) {
  const body = parseBody(req.body);
  const id = String(body.id || req.query.id || "").trim();
  if (!id) return res.status(400).json({ error: "id is required" });

  const changeNote = String(body.changeNote || body.change_note || "Prompt updated.").trim();
  const hasProvider = Object.prototype.hasOwnProperty.call(body, "provider");
  const hasModel = Object.prototype.hasOwnProperty.call(body, "model");
  const hasTemperature = Object.prototype.hasOwnProperty.call(body, "temperature");
  const hasMaxTokens = Object.prototype.hasOwnProperty.call(body, "maxTokens")
    || Object.prototype.hasOwnProperty.call(body, "max_tokens");
  const hasResponseFormat = Object.prototype.hasOwnProperty.call(body, "responseFormat")
    || Object.prototype.hasOwnProperty.call(body, "response_format");
  const hasModelOptions = Object.prototype.hasOwnProperty.call(body, "modelOptions")
    || Object.prototype.hasOwnProperty.call(body, "model_options");

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
      lineage_id::text,
      source_prompt_template_id::text,
      validated_at,
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
    from prompt_templates
    where id = ${id}::uuid
    limit 1
  `;
  if (!rows.length) return res.status(404).json({ error: "Prompt template not found" });

  const current = rows[0];
  if (current.status !== "draft") {
    return res.status(409).json({
      error: "Only draft prompt templates can be updated",
      code: "PROMPT_DRAFT_REQUIRED",
    });
  }
  const {
    body: nextBody,
    name: nextName,
  } = mergePromptTemplatePatch(current, body);
  const {
    requiredVariables,
    optionalVariables,
  } = promptVariableContract(current.type);
  if (!nextBody.trim()) return res.status(400).json({ error: "body is required" });
  if (!nextName) return res.status(400).json({ error: "name is required" });

  const provider = hasProvider ? String(body.provider || "").trim() : current.provider || "";
  const model = hasModel ? String(body.model || "").trim() : current.model || "";
  const temperature = hasTemperature ? normalizeNumber(body.temperature) : current.temperature;
  const maxTokens = hasMaxTokens ? normalizeNumber(body.maxTokens ?? body.max_tokens) : current.max_tokens;
  const responseFormat = hasResponseFormat
    ? String(body.responseFormat || body.response_format || "").trim()
    : current.response_format || "";
  const modelOptions = hasModelOptions
    ? normalizeModelOptions(body.modelOptions || body.model_options)
    : current.model_options || {};
  for (const duplicateKey of [
    "provider", "model", "temperature", "maxTokens", "max_tokens",
    "responseFormat", "response_format",
  ]) {
    delete modelOptions[duplicateKey];
  }
  validatePromptTemplateContract(current.type, {
    body: nextBody,
    requiredVariables,
    optionalVariables,
  });
  // Updating the prompt and appending its audit history must succeed or fail
  // together. A partial write would make production behavior impossible to
  // trace back to the Admin Page change that caused it.
  const updatedRows = await sql`
    with updated as (
      update prompt_templates
      set
        name = ${nextName},
        body = ${nextBody},
        required_variables = ${JSON.stringify(requiredVariables)}::jsonb,
        optional_variables = ${JSON.stringify(optionalVariables)}::jsonb,
        provider = ${provider},
        model = ${model},
        temperature = ${temperature},
        max_tokens = ${maxTokens},
        response_format = ${responseFormat},
        model_options = ${JSON.stringify(modelOptions)}::jsonb,
        change_note = ${changeNote},
        validated_at = null,
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
        ${current.body || ""},
        updated.body,
        updated.version,
        updated.version,
        'draft',
        'draft',
        ${changeNote},
        ${current.provider || ""},
        updated.provider,
        ${current.model || ""},
        updated.model,
        ${JSON.stringify(current.model_options || {})}::jsonb,
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
      error: "Prompt draft status changed before the update completed",
      code: "PROMPT_DRAFT_REQUIRED",
    });
  }

  return res.status(200).json({
    ok: true,
    prompt: toPromptTemplate(updatedRows[0]),
  });
}
