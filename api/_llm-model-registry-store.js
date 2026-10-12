const { getSql } = require("./_prompt-template-store");

const PROVIDERS = new Set(["openai", "google"]);
const MODALITIES = new Set(["text", "image"]);
const STATUSES = new Set(["draft", "active", "inactive"]);
const RESPONSE_FORMATS = new Set(["text", "json_object", "image"]);

const DEFAULT_MODELS = [
  ["openai", "gpt-6.1-sol", "GPT-6.1 Sol", "text", true, false, null, 24000, "json_object", { reasoning: { effort: "medium" } }, []],
  ["openai", "gpt-6-astra", "GPT-6 Astra", "text", false, false, null, 32000, "json_object", { reasoning: { effort: "high" } }, []],
  ["openai", "gpt-6-luna", "GPT-6 Luna", "text", false, false, null, 12000, "json_object", { reasoning: { effort: "low" } }, []],
  ["openai", "gpt-4.1-mini", "GPT-4.1 Mini", "text", false, true, 0.1, 12000, "json_object", {}, []],
  ["openai", "gpt-4o-mini", "GPT-4o Mini", "text", false, true, 0.1, 12000, "json_object", {}, []],
  ["openai", "gpt-image-2.5-sunburst", "GPT Image 2.5 Sunburst", "image", true, false, null, null, "image", { quality: "high", size: "1024x1536", outputFormat: "png", background: "opaque" }, []],
  ["openai", "gpt-image-2.5-flare", "GPT Image 2.5 Flare", "image", false, false, null, null, "image", { quality: "high", size: "1024x1536", outputFormat: "png", background: "opaque" }, []],
  ["openai", "gpt-image-2", "GPT Image 2", "image", false, false, null, null, "image", { quality: "high", size: "1024x1536", outputFormat: "png", background: "opaque" }, []],
  ["openai", "gpt-image-1.5", "GPT Image 1.5", "image", false, true, null, null, "image", { quality: "high", size: "1024x1536", outputFormat: "png", background: "opaque" }, []],
  ["openai", "gpt-image-1", "GPT Image 1", "image", false, true, null, null, "image", { quality: "high", size: "1024x1536", outputFormat: "png", background: "opaque" }, []],
  ["google", "gemini-nano-banana-2.1", "Nano Banana 2.1", "image", true, false, null, null, "image", { imageSize: "2K" }, ["1K", "2K", "4K"]],
  ["google", "gemini-3.1-flash-lite-image", "Nano Banana 2 Lite", "image", false, false, null, null, "image", { imageSize: "1K" }, ["1K"]],
  ["google", "gemini-3.1-flash-image", "Nano Banana 2", "image", false, true, null, null, "image", { imageSize: "2K" }, ["1K", "2K", "4K"]],
  ["google", "gemini-3-pro-image", "Nano Banana Pro", "image", false, false, null, null, "image", { imageSize: "2K" }, ["1K", "2K", "4K"]],
  ["google", "gemini-2.5-flash-image", "Gemini 2.5 Flash Image", "image", false, true, null, null, "image", { imageSize: "1K" }, ["1K"]],
];

function fail(message, statusCode = 400, code = "LLM_MODEL_INVALID") {
  throw Object.assign(new Error(message), { statusCode, code });
}

function normalizeJsonObject(value, fieldName) {
  if (value === null || value === undefined || value === "") return {};
  if (typeof value === "string") {
    try {
      const parsed = JSON.parse(value);
      if (parsed && typeof parsed === "object" && !Array.isArray(parsed)) return parsed;
    } catch {}
    fail(`${fieldName} must be a JSON object`);
  }
  if (typeof value === "object" && !Array.isArray(value)) return value;
  fail(`${fieldName} must be a JSON object`);
}

function normalizeModelInput(input = {}, { partial = false } = {}) {
  const normalized = {};
  const assign = (key, value) => { if (!partial || Object.prototype.hasOwnProperty.call(input, key)) normalized[key] = value; };
  const provider = String(input.provider || "").trim().toLowerCase();
  const modelId = String(input.modelId || input.model_id || "").trim();
  const displayName = String(input.displayName || input.display_name || "").trim();
  const modality = String(input.modality || "").trim().toLowerCase();
  const status = String(input.status || "draft").trim().toLowerCase();
  const responseFormat = String(input.defaultResponseFormat || input.default_response_format || (modality === "image" ? "image" : "text")).trim();
  if (!partial || Object.prototype.hasOwnProperty.call(input, "provider")) {
    if (!PROVIDERS.has(provider)) fail("provider must be openai or google");
    assign("provider", provider);
  }
  if (!partial || Object.prototype.hasOwnProperty.call(input, "modelId") || Object.prototype.hasOwnProperty.call(input, "model_id")) {
    if (!modelId || modelId.length > 160) fail("modelId is required and must be 160 characters or fewer");
    assign("modelId", modelId);
  }
  if (!partial || Object.prototype.hasOwnProperty.call(input, "displayName") || Object.prototype.hasOwnProperty.call(input, "display_name")) {
    if (!displayName || displayName.length > 160) fail("displayName is required and must be 160 characters or fewer");
    assign("displayName", displayName);
  }
  if (!partial || Object.prototype.hasOwnProperty.call(input, "modality")) {
    if (!MODALITIES.has(modality)) fail("modality must be text or image");
    assign("modality", modality);
  }
  if (!partial || Object.prototype.hasOwnProperty.call(input, "status")) {
    if (!STATUSES.has(status)) fail("status must be draft, active, or inactive");
    assign("status", status);
  }
  if (!partial || Object.prototype.hasOwnProperty.call(input, "defaultResponseFormat") || Object.prototype.hasOwnProperty.call(input, "default_response_format")) {
    if (!RESPONSE_FORMATS.has(responseFormat)) fail("defaultResponseFormat must be text, json_object, or image");
    assign("defaultResponseFormat", responseFormat);
  }
  if (!partial || Object.prototype.hasOwnProperty.call(input, "description")) assign("description", String(input.description || "").trim());
  if (!partial || Object.prototype.hasOwnProperty.call(input, "isRecommended")) assign("isRecommended", Boolean(input.isRecommended));
  if (!partial || Object.prototype.hasOwnProperty.call(input, "isLegacy")) assign("isLegacy", Boolean(input.isLegacy));
  if (!partial || Object.prototype.hasOwnProperty.call(input, "defaultTemperature")) {
    const temperature = input.defaultTemperature === "" || input.defaultTemperature === null || input.defaultTemperature === undefined ? null : Number(input.defaultTemperature);
    if (temperature !== null && (!Number.isFinite(temperature) || temperature < 0 || temperature > 2)) fail("defaultTemperature must be between 0 and 2");
    assign("defaultTemperature", temperature);
  }
  if (!partial || Object.prototype.hasOwnProperty.call(input, "defaultMaxTokens")) {
    const maxTokens = input.defaultMaxTokens === "" || input.defaultMaxTokens === null || input.defaultMaxTokens === undefined ? null : Number(input.defaultMaxTokens);
    if (maxTokens !== null && (!Number.isInteger(maxTokens) || maxTokens < 1)) fail("defaultMaxTokens must be a positive integer");
    assign("defaultMaxTokens", maxTokens);
  }
  if (!partial || Object.prototype.hasOwnProperty.call(input, "supportedImageSizes")) {
    const sizes = Array.isArray(input.supportedImageSizes) ? input.supportedImageSizes : String(input.supportedImageSizes || "").split(",");
    assign("supportedImageSizes", [...new Set(sizes.map((item) => String(item).trim()).filter(Boolean))]);
  }
  if (!partial || Object.prototype.hasOwnProperty.call(input, "modelOptions")) assign("modelOptions", normalizeJsonObject(input.modelOptions, "modelOptions"));
  if (!partial || Object.prototype.hasOwnProperty.call(input, "changeNote")) assign("changeNote", String(input.changeNote || "").trim());
  return normalized;
}

function toModel(row) {
  return {
    id: row.id,
    provider: row.provider,
    modelId: row.model_id,
    displayName: row.display_name,
    description: row.description || "",
    modality: row.modality,
    status: row.status,
    isRecommended: Boolean(row.is_recommended),
    isLegacy: Boolean(row.is_legacy),
    defaultTemperature: row.default_temperature === null || row.default_temperature === undefined ? null : Number(row.default_temperature),
    defaultMaxTokens: row.default_max_tokens === null || row.default_max_tokens === undefined ? null : Number(row.default_max_tokens),
    defaultResponseFormat: row.default_response_format || "text",
    supportedImageSizes: Array.isArray(row.supported_image_sizes) ? row.supported_image_sizes : [],
    modelOptions: row.model_options || {},
    changeNote: row.change_note || "",
    usage: {
      total: Number(row.usage_total || 0),
      active: Number(row.usage_active || 0),
    },
    createdAt: row.created_at || null,
    updatedAt: row.updated_at || null,
  };
}

async function ensureLlmModelRegistry(sql) {
  await sql`create extension if not exists pgcrypto`;
  await sql`
    create table if not exists llm_models (
      id uuid primary key default gen_random_uuid(), provider text not null,
      model_id text not null, display_name text not null, description text not null default '',
      modality text not null, status text not null default 'draft', is_recommended boolean not null default false,
      is_legacy boolean not null default false, default_temperature numeric, default_max_tokens integer,
      default_response_format text not null default 'text', supported_image_sizes jsonb not null default '[]'::jsonb,
      model_options jsonb not null default '{}'::jsonb, change_note text not null default '',
      created_by text not null default 'system', updated_by text not null default 'system',
      created_at timestamptz not null default now(), updated_at timestamptz not null default now(),
      unique (provider, model_id)
    )
  `;
  await sql`
    create table if not exists llm_model_histories (
      id uuid primary key default gen_random_uuid(), llm_model_id uuid references llm_models(id) on delete set null,
      provider text not null, model_id text not null, previous_status text, new_status text not null,
      snapshot jsonb not null default '{}'::jsonb, change_note text not null default '',
      changed_by text not null, changed_at timestamptz not null default now()
    )
  `;
  for (const row of DEFAULT_MODELS) {
    const [provider, modelId, displayName, modality, isRecommended, isLegacy, temperature, maxTokens, responseFormat, options, sizes] = row;
    const seededRows = await sql`
      insert into llm_models (
        provider, model_id, display_name, modality, status, is_recommended, is_legacy,
        default_temperature, default_max_tokens, default_response_format, model_options,
        supported_image_sizes, created_by, updated_by
      ) values (
        ${provider}, ${modelId}, ${displayName}, ${modality}, 'active', ${isRecommended}, ${isLegacy},
        ${temperature}, ${maxTokens}, ${responseFormat}, ${JSON.stringify(options)}::jsonb,
        ${JSON.stringify(sizes)}::jsonb, 'system:catalog', 'system:catalog'
      ) on conflict (provider, model_id) do nothing
      returning *
    `;
    if (seededRows[0]) await appendHistory(sql, seededRows[0], null, "system:catalog");
  }
  await syncPromptModelsToRegistry(sql);
  await ensureRegistryHistories(sql);
}

async function ensureRegistryHistories(sql) {
  await sql`
    insert into llm_model_histories (
      llm_model_id, provider, model_id, previous_status, new_status,
      snapshot, change_note, changed_by
    )
    select
      model.id, model.provider, model.model_id, null, model.status,
      jsonb_build_object(
        'provider', model.provider,
        'modelId', model.model_id,
        'displayName', model.display_name,
        'description', model.description,
        'modality', model.modality,
        'status', model.status,
        'isRecommended', model.is_recommended,
        'isLegacy', model.is_legacy,
        'defaultTemperature', model.default_temperature,
        'defaultMaxTokens', model.default_max_tokens,
        'defaultResponseFormat', model.default_response_format,
        'supportedImageSizes', model.supported_image_sizes,
        'modelOptions', model.model_options
      ),
      coalesce(nullif(model.change_note, ''), '기존 LLM Registry 모델 이력 초기화'),
      model.updated_by
    from llm_models model
    where not exists (
      select 1 from llm_model_histories history where history.llm_model_id = model.id
    )
  `;
}

async function syncPromptModelsToRegistry(sql) {
  await sql`
    with prompt_models as (
      select distinct on (lower(trim(provider)), trim(model))
        lower(trim(provider)) as provider,
        trim(model) as model_id,
        temperature,
        max_tokens,
        response_format,
        type,
        status
      from prompt_templates
      where lower(trim(provider)) in ('openai', 'google')
        and trim(model) <> ''
      order by
        lower(trim(provider)), trim(model),
        case status when 'active' then 0 when 'validated' then 1 when 'draft' then 2 else 3 end,
        updated_at desc
    ), inserted as (
      insert into llm_models (
        provider, model_id, display_name, description, modality, status,
        is_recommended, is_legacy, default_temperature, default_max_tokens,
        default_response_format, supported_image_sizes, model_options,
        change_note, created_by, updated_by
      )
      select
        prompt.provider,
        prompt.model_id,
        prompt.model_id,
        '기존 프롬프트 설정에서 자동 등록된 모델',
        case
          when prompt.model_id ilike 'gpt-image-%'
            or prompt.model_id ilike '%-image%'
            or prompt.type in ('image_execution', 'lofi_draft', 'final_design', 'final_design_v2', 'section_background_image', 'component_image')
          then 'image'
          else 'text'
        end,
        'active', false, false,
        prompt.temperature,
        prompt.max_tokens,
        coalesce(nullif(prompt.response_format, ''), case when prompt.model_id ilike '%image%' then 'image' else 'text' end),
        case when prompt.provider = 'google' and prompt.model_id ilike '%image%' then '["1K","2K","4K"]'::jsonb else '[]'::jsonb end,
        '{}'::jsonb,
        '프롬프트에서 사용 중인 모델 자동 등록',
        'system:prompt-sync',
        'system:prompt-sync'
      from prompt_models prompt
      on conflict (provider, model_id) do nothing
      returning *
    )
    insert into llm_model_histories (
      llm_model_id, provider, model_id, previous_status, new_status,
      snapshot, change_note, changed_by
    )
    select
      inserted.id, inserted.provider, inserted.model_id, null, inserted.status,
      jsonb_build_object(
        'provider', inserted.provider,
        'modelId', inserted.model_id,
        'displayName', inserted.display_name,
        'modality', inserted.modality,
        'status', inserted.status,
        'source', 'prompt_templates'
      ),
      inserted.change_note,
      'system:prompt-sync'
    from inserted
  `;
}

async function listModels(sql) {
  await ensureLlmModelRegistry(sql);
  const rows = await sql`
    select model.*,
      count(prompt.id)::int as usage_total,
      count(prompt.id) filter (where prompt.status in ('active', 'validated', 'draft'))::int as usage_active
    from llm_models model
    left join prompt_templates prompt on prompt.provider = model.provider and prompt.model = model.model_id
    group by model.id
    order by case model.status when 'active' then 0 when 'draft' then 1 else 2 end,
      model.provider, model.modality, model.is_recommended desc, model.display_name
  `;
  return rows.map(toModel);
}

async function listModelHistories(sql, limit = 200) {
  await ensureLlmModelRegistry(sql);
  const safeLimit = Math.max(1, Math.min(Number(limit) || 200, 500));
  const rows = await sql`
    select
      id::text,
      llm_model_id::text,
      provider,
      model_id,
      previous_status,
      new_status,
      snapshot,
      change_note,
      changed_by,
      changed_at
    from llm_model_histories
    order by changed_at desc
    limit ${safeLimit}
  `;
  return rows.map((row) => ({
    id: row.id,
    llmModelId: row.llm_model_id,
    provider: row.provider,
    modelId: row.model_id,
    previousStatus: row.previous_status || "",
    newStatus: row.new_status || "",
    snapshot: row.snapshot || {},
    changeNote: row.change_note || "",
    changedBy: row.changed_by || "",
    changedAt: row.changed_at || null,
  }));
}

async function createModel(sql, input, actor) {
  await ensureLlmModelRegistry(sql);
  const value = normalizeModelInput(input);
  const rows = await sql`
    insert into llm_models (
      provider, model_id, display_name, description, modality, status, is_recommended, is_legacy,
      default_temperature, default_max_tokens, default_response_format, supported_image_sizes,
      model_options, change_note, created_by, updated_by
    ) values (
      ${value.provider}, ${value.modelId}, ${value.displayName}, ${value.description}, ${value.modality},
      ${value.status}, ${value.isRecommended}, ${value.isLegacy}, ${value.defaultTemperature},
      ${value.defaultMaxTokens}, ${value.defaultResponseFormat}, ${JSON.stringify(value.supportedImageSizes)}::jsonb,
      ${JSON.stringify(value.modelOptions)}::jsonb, ${value.changeNote}, ${actor}, ${actor}
    ) returning *
  `.catch((error) => {
    if (error.code === "23505") fail("같은 Provider와 모델 ID가 이미 등록되어 있습니다.", 409, "LLM_MODEL_DUPLICATE");
    throw error;
  });
  await appendHistory(sql, rows[0], null, actor);
  return toModel(rows[0]);
}

async function updateModel(sql, id, input, actor) {
  await ensureLlmModelRegistry(sql);
  const currentRows = await sql`select * from llm_models where id = ${id}::uuid limit 1`;
  if (!currentRows.length) return null;
  const current = currentRows[0];
  const value = normalizeModelInput(input, { partial: true });
  const nextStatus = value.status ?? current.status;
  if (nextStatus === "inactive" && current.status !== "inactive") {
    const usageRows = await sql`
      select count(*)::int as count from prompt_templates
      where provider = ${current.provider} and model = ${current.model_id}
        and status in ('active', 'validated', 'draft')
    `;
    if (Number(usageRows[0]?.count || 0) > 0) fail("사용 중인 프롬프트가 있어 모델을 중지할 수 없습니다.", 409, "LLM_MODEL_IN_USE");
  }
  const next = {
    displayName: value.displayName ?? current.display_name,
    description: value.description ?? current.description,
    modality: value.modality ?? current.modality,
    status: nextStatus,
    isRecommended: value.isRecommended ?? current.is_recommended,
    isLegacy: value.isLegacy ?? current.is_legacy,
    defaultTemperature: Object.prototype.hasOwnProperty.call(value, "defaultTemperature") ? value.defaultTemperature : current.default_temperature,
    defaultMaxTokens: Object.prototype.hasOwnProperty.call(value, "defaultMaxTokens") ? value.defaultMaxTokens : current.default_max_tokens,
    defaultResponseFormat: value.defaultResponseFormat ?? current.default_response_format,
    supportedImageSizes: value.supportedImageSizes ?? current.supported_image_sizes,
    modelOptions: value.modelOptions ?? current.model_options,
    changeNote: value.changeNote ?? current.change_note,
  };
  if (next.status === "active" && next.isRecommended) {
    await sql`
      update llm_models set is_recommended = false, updated_at = now(), updated_by = ${actor}
      where provider = ${current.provider} and modality = ${next.modality} and id <> ${id}::uuid
    `;
  }
  const rows = await sql`
    update llm_models set
      display_name = ${next.displayName}, description = ${next.description}, modality = ${next.modality},
      status = ${next.status}, is_recommended = ${next.isRecommended}, is_legacy = ${next.isLegacy},
      default_temperature = ${next.defaultTemperature}, default_max_tokens = ${next.defaultMaxTokens},
      default_response_format = ${next.defaultResponseFormat},
      supported_image_sizes = ${JSON.stringify(next.supportedImageSizes)}::jsonb,
      model_options = ${JSON.stringify(next.modelOptions)}::jsonb, change_note = ${next.changeNote},
      updated_by = ${actor}, updated_at = now()
    where id = ${id}::uuid returning *
  `;
  await appendHistory(sql, rows[0], current.status, actor);
  return toModel(rows[0]);
}

async function appendHistory(sql, row, previousStatus, actor) {
  await sql`
    insert into llm_model_histories (
      llm_model_id, provider, model_id, previous_status, new_status, snapshot, change_note, changed_by
    ) values (
      ${row.id}::uuid, ${row.provider}, ${row.model_id}, ${previousStatus}, ${row.status},
      ${JSON.stringify(toModel(row))}::jsonb, ${row.change_note || ""}, ${actor}
    )
  `;
}

module.exports = {
  DEFAULT_MODELS,
  createModel,
  ensureRegistryHistories,
  ensureLlmModelRegistry,
  getSql,
  listModelHistories,
  listModels,
  normalizeModelInput,
  syncPromptModelsToRegistry,
  toModel,
  updateModel,
};
