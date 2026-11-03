const assert = require("node:assert/strict");
const {
  createPromptExecutionSnapshot,
  createValidatedPromptExecutionSnapshot,
} = require("../api/_prompt-execution-snapshot");
const { PROMPT_TYPES } = require("../api/_prompt-template-store");

const candidateId = "10000000-0000-4000-8000-000000000075";
const lineageId = "20000000-0000-4000-8000-000000000075";
const sourceId = "30000000-0000-4000-8000-000000000075";
const type = "promo_page_generation";
const requiredVariables = PROMPT_TYPES[type].requiredVariables;
const variables = Object.fromEntries(requiredVariables.map((key) => [key, `${key}-value`]));
const body = requiredVariables.map((key) => `${key}={{${key}}}`).join("\n");

function promptRow(overrides = {}) {
  return {
    id: candidateId,
    type,
    name: "Promo Page Generation — Responsive Text-first Quality",
    body,
    status: "validated",
    version: 1,
    lineage_id: lineageId,
    source_prompt_template_id: sourceId,
    validated_at: "2026-11-02T00:00:00.000Z",
    required_variables: requiredVariables,
    optional_variables: [],
    provider: "openai",
    model: "gpt-4.1-mini",
    temperature: 0.1,
    max_tokens: 8000,
    response_format: "json_object",
    model_options: {},
    change_note: "validated for evaluation",
    archived_at: null,
    created_at: "2026-11-02T00:00:00.000Z",
    updated_at: "2026-11-02T00:00:00.000Z",
    ...overrides,
  };
}

function activeModelRow() {
  return {
    id: "40000000-0000-4000-8000-000000000075",
    provider: "openai",
    model_id: "gpt-4.1-mini",
    display_name: "GPT-4.1 Mini",
    description: "Registered text model",
    modality: "text",
    status: "active",
    is_recommended: false,
    is_legacy: true,
    default_temperature: 0.1,
    default_max_tokens: 8000,
    default_response_format: "json_object",
    supported_image_sizes: [],
    model_options: {},
    change_note: "",
    created_at: null,
    updated_at: null,
  };
}

function fakeSql(row, { registryActive = true } = {}) {
  const queries = [];
  const sql = async (strings, ...values) => {
    const query = strings.join("?");
    queries.push({ query, values });
    if (query.includes("from llm_models")) return registryActive ? [activeModelRow()] : [];
    if (query.includes("from prompt_templates")) return row ? [row] : [];
    return [];
  };
  sql.queries = queries;
  return sql;
}

async function main() {
  const candidateSql = fakeSql(promptRow());
  const candidate = await createValidatedPromptExecutionSnapshot(
    candidateSql,
    candidateId,
    variables,
    { expectedType: type },
  );
  assert.deepEqual(candidate.promptSelection, {
    mode: "validated-candidate",
    status: "validated",
    id: candidateId,
    type,
    version: 1,
    lineageId,
    sourcePromptTemplateId: sourceId,
    validatedAt: "2026-11-02T00:00:00.000Z",
  });
  assert.equal(candidate.promptConfig.promptId, candidateId);
  assert.match(candidate.promptConfig.renderedPromptHash, /^[0-9a-f]{64}$/);
  assert.ok(requiredVariables.every((key) => candidate.promptConfig.renderedPrompt.includes(`${key}-value`)));

  const activeSql = fakeSql(promptRow({ status: "active", validated_at: null }));
  const active = await createPromptExecutionSnapshot(activeSql, type, variables);
  assert.equal(active.promptConfig.renderedPrompt, candidate.promptConfig.renderedPrompt);
  assert.equal(active.promptConfig.renderedPromptHash, candidate.promptConfig.renderedPromptHash);
  assert.equal(Object.prototype.hasOwnProperty.call(active, "promptSelection"), false);
  assert.ok(activeSql.queries.some(({ query }) => query.includes("status = 'active'")));

  const invalidIdSql = fakeSql(promptRow());
  await assert.rejects(
    createValidatedPromptExecutionSnapshot(invalidIdSql, "not-a-uuid", variables),
    (error) => error.statusCode === 400 && error.code === "PROMPT_ID_INVALID",
  );
  assert.equal(invalidIdSql.queries.length, 0);

  await assert.rejects(
    createValidatedPromptExecutionSnapshot(fakeSql(null), candidateId, variables),
    (error) => error.statusCode === 404 && error.code === "PROMPT_TEMPLATE_NOT_FOUND",
  );

  for (const status of ["draft", "inactive", "active", "archived"]) {
    const sql = fakeSql(promptRow({ status, validated_at: status === "draft" ? null : "2026-11-02T00:00:00.000Z" }));
    await assert.rejects(
      createValidatedPromptExecutionSnapshot(sql, candidateId, variables),
      (error) => error.statusCode === 409 && error.code === "PROMPT_VALIDATION_REQUIRED",
    );
    assert.equal(sql.queries.some(({ query }) => query.includes("from llm_models")), false);
  }

  const missingValidatedAtSql = fakeSql(promptRow({ validated_at: null }));
  await assert.rejects(
    createValidatedPromptExecutionSnapshot(missingValidatedAtSql, candidateId, variables),
    (error) => error.code === "PROMPT_VALIDATION_REQUIRED",
  );
  assert.equal(missingValidatedAtSql.queries.some(({ query }) => query.includes("from llm_models")), false);

  const mismatchSql = fakeSql(promptRow());
  await assert.rejects(
    createValidatedPromptExecutionSnapshot(mismatchSql, candidateId, variables, { expectedType: "promo_page_composer" }),
    (error) => error.statusCode === 409 && error.code === "PROMPT_TYPE_MISMATCH",
  );
  assert.equal(mismatchSql.queries.some(({ query }) => query.includes("from llm_models")), false);

  await assert.rejects(
    createValidatedPromptExecutionSnapshot(fakeSql(promptRow()), candidateId, { ...variables, brand: "" }),
    /Required promo_page_generation prompt variables are missing: brand/,
  );
  await assert.rejects(
    createValidatedPromptExecutionSnapshot(fakeSql(promptRow(), { registryActive: false }), candidateId, variables),
    (error) => error.statusCode === 422 && error.code === "LLM_MODEL_NOT_ACTIVE",
  );

  console.log("Validated prompt candidate execution snapshot tests passed.");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
