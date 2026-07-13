const {
  ensureDefaultPromptTemplates,
  getSql,
  normalizeVariables,
  normalizeModelOptions,
  normalizeNumber,
  parseBody,
  toPromptTemplate,
} = require("./_prompt-template-store");
const { validateStageModelConfig } = require("./_prompt-execution-snapshot");

// Prompt edits are versioned in place instead of creating a new row per save.
// Activation/archiving APIs decide which row is live; this endpoint preserves
// the review trail for copy/model changes made from the Admin Page.
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

  const nextBody = String(body.body || "");
  const nextName = String(body.name || "").trim();
  const changeNote = String(body.changeNote || body.change_note || "Prompt updated.").trim();
  const requiredVariables = normalizeVariables(body.requiredVariables || body.required_variables);
  const optionalVariables = normalizeVariables(body.optionalVariables || body.optional_variables);
  const hasProvider = Object.prototype.hasOwnProperty.call(body, "provider");
  const hasModel = Object.prototype.hasOwnProperty.call(body, "model");
  const hasTemperature = Object.prototype.hasOwnProperty.call(body, "temperature");
  const hasMaxTokens = Object.prototype.hasOwnProperty.call(body, "maxTokens")
    || Object.prototype.hasOwnProperty.call(body, "max_tokens");
  const hasResponseFormat = Object.prototype.hasOwnProperty.call(body, "responseFormat")
    || Object.prototype.hasOwnProperty.call(body, "response_format");
  const hasModelOptions = Object.prototype.hasOwnProperty.call(body, "modelOptions")
    || Object.prototype.hasOwnProperty.call(body, "model_options");

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
  if (current.status === "archived") {
    return res.status(409).json({ error: "Archived prompt templates cannot be updated" });
  }

  // Every save increments the visible version even when status stays the same,
  // so reviewers can compare Admin Page history with actual prompt executions.
  const nextVersion = Number(current.version || 1) + 1;
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
  if (current.status === "active" && ["integrated_brief", "lofi_draft", "final_design"].includes(current.type)) {
    validateStageModelConfig(current.type, { provider, model, responseFormat });
  }
  const updatedRows = await sql`
    update prompt_templates
    set
      name = ${nextName},
      body = ${nextBody},
      version = ${nextVersion},
      required_variables = ${JSON.stringify(requiredVariables)}::jsonb,
      optional_variables = ${JSON.stringify(optionalVariables)}::jsonb,
      provider = ${provider},
      model = ${model},
      temperature = ${temperature},
      max_tokens = ${maxTokens},
      response_format = ${responseFormat},
      model_options = ${JSON.stringify(modelOptions)}::jsonb,
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
  `;

  // Store full previous/new bodies in history because prompt wording changes are
  // often the root cause when downstream image generation behavior shifts.
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
      ${nextBody},
      ${Number(current.version || 1)},
      ${nextVersion},
      ${current.status || ""},
      ${current.status || ""},
      ${changeNote},
      ${current.provider || ""},
      ${provider},
      ${current.model || ""},
      ${model},
      ${JSON.stringify(current.model_options || {})}::jsonb,
      ${JSON.stringify(modelOptions)}::jsonb
    )
  `;

  return res.status(200).json({
    ok: true,
    prompt: toPromptTemplate(updatedRows[0]),
  });
}
