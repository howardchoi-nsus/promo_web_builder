import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { createRequire } from "node:module";
import { fileURLToPath, pathToFileURL } from "node:url";

const require = createRequire(import.meta.url);
const { Client } = require("@neondatabase/serverless");

export const MIGRATION_URL = new URL("../db/migrations/075_web_output_prompt_quality_pack.sql", import.meta.url);
export const EXPECTED_MIGRATION_SHA256 = "b6430c7083fa55c628c6d073e9b24d0d1e123b8d750d98ed9edd38ccda89e460";
export const QUALITY_PROMPTS = Object.freeze([
  ["promo_overview_parser", "Promotion Overview Parser — Web Output Quality"],
  ["promo_page_composer", "AI Promotion Page Composer — Web Output Quality"],
  ["promo_composition_editor", "AI Promotion Composition Editor — Web Output Quality"],
  ["promo_page_generation", "Promo Page Generation — Responsive Text-first Quality"],
]);

const REQUIRED_LIFECYCLE_INDEXES = Object.freeze([
  "prompt_templates_lineage_version_uidx",
  "prompt_templates_one_active_per_type_uidx",
  "prompt_templates_one_candidate_per_lineage_uidx",
]);

const REQUIRED_COLUMNS = Object.freeze({
  prompt_templates: [
    "id", "type", "name", "body", "status", "version", "lineage_id",
    "source_prompt_template_id", "validated_at", "required_variables",
    "optional_variables", "provider", "model", "temperature", "max_tokens",
    "response_format", "model_options", "change_note", "archived_at",
    "created_at", "updated_at",
  ],
  prompt_template_histories: [
    "id", "prompt_template_id", "prompt_type", "previous_body", "new_body",
    "previous_version", "new_version", "previous_status", "new_status",
    "change_note", "previous_provider", "new_provider", "previous_model",
    "new_model", "previous_model_options", "new_model_options", "changed_at",
  ],
});

const PRODUCTION_URL_KEYS = Object.freeze([
  "DATABASE_URL",
  "NEON_DATABASE_URL",
  "POSTGRES_URL",
  "POSTGRES_URL_NON_POOLING",
]);

export function sha256(value) {
  return createHash("sha256").update(value).digest("hex");
}

export function migrationPlan() {
  const sql = readFileSync(MIGRATION_URL, "utf8");
  const migrationSha256 = sha256(sql);
  if (migrationSha256 !== EXPECTED_MIGRATION_SHA256) {
    throw new Error(
      `Migration 075 checksum mismatch. Expected ${EXPECTED_MIGRATION_SHA256}, received ${migrationSha256}. Review the SQL and update the rollout contract intentionally.`,
    );
  }
  const body = stripOuterTransaction(sql);
  for (const [type, name] of QUALITY_PROMPTS) {
    if (!body.includes(`'${type}'`) || !body.includes(`'${name}'`)) {
      throw new Error(`Migration 075 is missing the quality candidate contract for ${type}`);
    }
  }
  const pagePromptMatch = sql.match(/when 'promo_page_generation' then \$page_prompt\$([\s\S]*?)\$page_prompt\$/);
  if (!pagePromptMatch?.[1]) throw new Error("Migration 075 page-generation prompt body could not be extracted");
  const qualityInstructions = Object.fromEntries(QUALITY_PROMPTS.map(([type]) => [
    type,
    extractQualityInstructions(sql, type),
  ]));
  const repairPromptMatch = sql.match(/'contractV3', E'((?:''|\\.|[^'])*)'/);
  if (!repairPromptMatch?.[1]) throw new Error("Migration 075 Contract V3 repair prompt could not be extracted");
  return {
    sql,
    body,
    migrationSha256,
    migrationFile: fileURLToPath(MIGRATION_URL),
    contract: {
      pagePromptBody: pagePromptMatch[1],
      qualityInstructions,
      composerRepairPrompt: decodePostgresEscapeString(repairPromptMatch[1]),
    },
  };
}

function extractQualityInstructions(sql, type) {
  const startToken = `when '${type}' then jsonb_build_array(`;
  const start = sql.indexOf(startToken);
  if (start < 0) throw new Error(`Migration 075 quality instructions are missing for ${type}`);
  const contentStart = start + startToken.length;
  const nextWhen = sql.indexOf("\n      )\n      when '", contentStart);
  const endCase = sql.indexOf("\n      )\n    end as quality_instructions", contentStart);
  const end = nextWhen >= 0 ? nextWhen : endCase;
  if (end < 0) throw new Error(`Migration 075 quality instruction boundary is invalid for ${type}`);
  const instructions = [];
  const pattern = /'((?:''|[^'])*)'/g;
  for (const match of sql.slice(contentStart, end).matchAll(pattern)) {
    instructions.push(match[1].replace(/''/g, "'"));
  }
  if (!instructions.length) throw new Error(`Migration 075 quality instructions are empty for ${type}`);
  return instructions;
}

function decodePostgresEscapeString(value) {
  return String(value || "")
    .replace(/''/g, "'")
    .replace(/\\n/g, "\n")
    .replace(/\\r/g, "\r")
    .replace(/\\t/g, "\t")
    .replace(/\\\\/g, "\\");
}

export function stripOuterTransaction(sql) {
  const source = String(sql || "").trim();
  const begin = source.match(/^begin\s*;/i);
  const commit = source.match(/commit\s*;\s*$/i);
  if (!begin || !commit || commit.index <= begin[0].length) {
    throw new Error("Migration 075 must have one explicit outer BEGIN/COMMIT wrapper");
  }
  const body = source.slice(begin[0].length, commit.index).trim();
  if (/\bbegin\s*;/i.test(body) || /\bcommit\s*;/i.test(body)) {
    throw new Error("Migration 075 contains a nested transaction wrapper");
  }
  if (!/^--[\s\S]*?\bwith\s+ranked_source\s+as\s*\(/i.test(body) || !body.endsWith(";")) {
    throw new Error("Migration 075 body does not match the reviewed single-statement shape");
  }
  return body;
}

export function parseArgs(argv = []) {
  const allowed = new Set([
    "--check",
    "--apply",
    "--backup-confirmed",
  ]);
  const values = {};
  for (const arg of argv) {
    if (allowed.has(arg)) {
      values[arg.slice(2)] = true;
      continue;
    }
    const match = arg.match(/^--(target|confirm-target)=(.+)$/);
    if (match) {
      values[match[1]] = match[2].trim();
      continue;
    }
    throw new Error(`Unknown argument: ${arg}`);
  }
  if (values.check && values.apply) throw new Error("Choose either --check or --apply, not both");
  const mode = values.apply ? "apply" : values.check ? "check" : "plan";
  if (mode !== "plan" && values.target !== "preview") {
    throw new Error(`${mode} mode requires --target=preview`);
  }
  return {
    mode,
    target: values.target || "",
    confirmTarget: values["confirm-target"] || "",
    backupConfirmed: Boolean(values["backup-confirmed"]),
  };
}

function normalizedTargetIdentity(value) {
  const parsed = new URL(String(value || "").trim());
  if (!new Set(["postgres:", "postgresql:"]).has(parsed.protocol)) {
    throw new Error("PREVIEW_DATABASE_URL must use the postgres or postgresql protocol");
  }
  const port = parsed.port || "5432";
  // Neon exposes pooled and direct connection hostnames for the same branch.
  // Treat them as the same target so a pooled Preview URL cannot be approved
  // while an unpooled Production fallback points at that exact database.
  const hostname = parsed.hostname.toLowerCase().replace(/-pooler(?=\.)/, "");
  const database = decodeURIComponent(parsed.pathname.replace(/^\/+/, ""));
  if (!parsed.hostname || !database) throw new Error("PREVIEW_DATABASE_URL is missing a host or database name");
  return `${hostname}:${port}/${database}`;
}

export function targetFingerprint(value) {
  return sha256(normalizedTargetIdentity(value)).slice(0, 12);
}

export function resolvePreviewTarget(env = process.env) {
  if (String(env.VERCEL_ENV || "").trim().toLowerCase() === "production") {
    throw new Error("Migration 075 rollout is disabled when VERCEL_ENV=production");
  }
  const databaseUrl = String(env.PREVIEW_DATABASE_URL || "").trim();
  if (!databaseUrl) {
    throw new Error("PREVIEW_DATABASE_URL is required; production database fallbacks are intentionally disabled");
  }
  const identity = normalizedTargetIdentity(databaseUrl);
  for (const key of PRODUCTION_URL_KEYS) {
    const other = String(env[key] || "").trim();
    if (other && normalizedTargetIdentity(other) === identity) {
      throw new Error(`PREVIEW_DATABASE_URL resolves to the same database target as ${key}`);
    }
  }
  return { databaseUrl, fingerprint: sha256(identity).slice(0, 12) };
}

export function assertApprovedPreviewTarget(target, args, env = process.env) {
  const approved = String(env.PROMPT_QUALITY_PREVIEW_FINGERPRINT || "").trim().toLowerCase();
  if (!/^[0-9a-f]{12}$/.test(approved)) {
    throw new Error("Apply requires a separately approved PROMPT_QUALITY_PREVIEW_FINGERPRINT");
  }
  if (approved !== target.fingerprint || args.confirmTarget !== target.fingerprint) {
    throw new Error("Preview target approval does not match the connected database");
  }
}

function urlRedactionParts(value) {
  const parts = [String(value || "").trim()].filter(Boolean);
  try {
    const parsed = new URL(String(value || "").trim());
    parts.push(
      decodeURIComponent(parsed.username || ""),
      decodeURIComponent(parsed.password || ""),
      parsed.hostname,
      decodeURIComponent(parsed.pathname.replace(/^\/+/, "")),
    );
  } catch {
    // The complete invalid value is still redacted by the first entry.
  }
  return parts.filter((part) => part.length >= 3);
}

export function databaseRedactionSecrets(env = process.env) {
  return ["PREVIEW_DATABASE_URL", ...PRODUCTION_URL_KEYS]
    .flatMap((key) => urlRedactionParts(env[key]));
}

export function redactSecrets(value, secrets = []) {
  let redacted = String(value || "");
  for (const secret of secrets.filter(Boolean).sort((a, b) => String(b).length - String(a).length)) {
    redacted = redacted.split(String(secret)).join("[REDACTED_DB_TARGET]");
  }
  return redacted.replace(/postgres(?:ql)?:\/\/[^\s'"`]+/gi, "[REDACTED_DB_TARGET]");
}

function candidateKey(row) {
  return `${row.type}:${row.name}`;
}

function compactCandidate(row) {
  return {
    id: row.id,
    type: row.type,
    name: row.name,
    status: row.status,
    version: Number(row.version),
    sourcePromptTemplateId: row.source_prompt_template_id,
    historyCount: Number(row.history_count),
  };
}

function activeSnapshot(rows) {
  return rows.map((row) => ({
    type: row.type,
    id: row.id,
    version: Number(row.version),
  }));
}

function assertEqualSnapshot(before, after, label) {
  if (JSON.stringify(before) !== JSON.stringify(after)) {
    throw new Error(`${label} changed while applying Migration 075`);
  }
}

async function readSchemaColumns(client) {
  const result = await client.query(`
    select table_name, column_name
    from information_schema.columns
    where table_schema = 'public'
      and table_name = any($1::text[])
    order by table_name, ordinal_position
  `, [Object.keys(REQUIRED_COLUMNS)]);
  const actual = new Map();
  for (const row of result.rows) {
    if (!actual.has(row.table_name)) actual.set(row.table_name, new Set());
    actual.get(row.table_name).add(row.column_name);
  }
  const missing = [];
  for (const [table, columns] of Object.entries(REQUIRED_COLUMNS)) {
    for (const column of columns) {
      if (!actual.get(table)?.has(column)) missing.push(`${table}.${column}`);
    }
  }
  if (missing.length) throw new Error(`Migration 075 schema preflight failed; missing: ${missing.join(", ")}`);
}

async function assertLifecycleSchema(client) {
  const indexes = await client.query(`
    select indexname
    from pg_indexes
    where schemaname = 'public'
      and tablename = 'prompt_templates'
      and indexname = any($1::text[])
  `, [REQUIRED_LIFECYCLE_INDEXES]);
  const found = new Set(indexes.rows.map((row) => row.indexname));
  const missing = REQUIRED_LIFECYCLE_INDEXES.filter((name) => !found.has(name));
  if (missing.length) throw new Error(`Prompt lifecycle indexes are missing: ${missing.join(", ")}`);

  const statusConstraint = await client.query(`
    select pg_get_constraintdef(constraint_row.oid) as definition
    from pg_constraint constraint_row
    join pg_class table_row on table_row.oid = constraint_row.conrelid
    join pg_namespace schema_row on schema_row.oid = table_row.relnamespace
    where schema_row.nspname = 'public'
      and table_row.relname = 'prompt_templates'
      and constraint_row.conname = 'prompt_templates_status_chk'
    limit 1
  `);
  const definition = String(statusConstraint.rows[0]?.definition || "").toLowerCase();
  if (!definition.includes("validated") || !definition.includes("active") || !definition.includes("archived")) {
    throw new Error("Prompt lifecycle status constraint is missing validated/active/archived states");
  }
}

async function readSources(client) {
  const result = await client.query(`
    with ranked as (
      select
        id::text,
        type,
        status,
        version,
        row_number() over (
          partition by type
          order by case status
            when 'active' then 0
            when 'validated' then 1
            when 'draft' then 2
            when 'inactive' then 3
            else 4
          end, version desc
        ) as source_rank
      from public.prompt_templates
      where type = any($1::text[])
        and status <> 'archived'
    )
    select id, type, status, version
    from ranked
    where source_rank = 1
    order by type
  `, [QUALITY_PROMPTS.map(([type]) => type)]);
  const found = new Set(result.rows.map((row) => row.type));
  const missing = QUALITY_PROMPTS.map(([type]) => type).filter((type) => !found.has(type));
  if (missing.length) throw new Error(`Migration 075 source prompts are missing: ${missing.join(", ")}`);
  return result.rows;
}

async function readActives(client, { lock = false } = {}) {
  const result = await client.query(`
    select type, id::text, version
    from public.prompt_templates
    where type = any($1::text[])
      and status = 'active'
    order by type
    ${lock ? "for update" : ""}
  `, [QUALITY_PROMPTS.map(([type]) => type)]);
  return activeSnapshot(result.rows);
}

async function readCandidates(client) {
  const result = await client.query(`
    with expected(type, name) as (
      values
        ('promo_overview_parser', 'Promotion Overview Parser — Web Output Quality'),
        ('promo_page_composer', 'AI Promotion Page Composer — Web Output Quality'),
        ('promo_composition_editor', 'AI Promotion Composition Editor — Web Output Quality'),
        ('promo_page_generation', 'Promo Page Generation — Responsive Text-first Quality')
    )
    select
      candidate.id::text,
      candidate.type,
      candidate.name,
      candidate.status,
      candidate.version,
      candidate.source_prompt_template_id::text,
      candidate.model_options,
      candidate.body,
      source.body as source_body,
      source.status as source_status,
      source.model_options as source_model_options,
      (candidate.provider = source.provider) as provider_matches,
      (candidate.model = source.model) as model_matches,
      (candidate.temperature is not distinct from source.temperature) as temperature_matches,
      (candidate.max_tokens is not distinct from source.max_tokens) as max_tokens_match,
      (candidate.response_format = source.response_format) as response_format_matches,
      (candidate.required_variables = source.required_variables) as required_variables_match,
      (candidate.optional_variables = source.optional_variables) as optional_variables_match,
      (select count(*)::integer
        from public.prompt_template_histories history
        where history.prompt_template_id = candidate.id) as history_count,
      (select count(*)::integer
        from public.prompt_template_histories history
        where history.prompt_template_id = candidate.id
          and history.change_note = 'Migration 075: Web Output prompt quality pack candidate.') as migration_history_count,
      coalesce((select bool_or(
          history.previous_body = source.body
          and history.new_body = candidate.body
          and history.previous_version = source.version
          and history.new_version = candidate.version
          and history.previous_status = source.status
          and history.new_status = 'draft'
          and history.previous_provider = source.provider
          and history.new_provider = candidate.provider
          and history.previous_model = source.model
          and history.new_model = candidate.model
          and history.previous_model_options = source.model_options
          and history.new_model_options = candidate.model_options
        )
        from public.prompt_template_histories history
        where history.prompt_template_id = candidate.id
          and history.change_note = 'Migration 075: Web Output prompt quality pack candidate.'), false) as migration_history_matches
    from expected
    join public.prompt_templates candidate
      on candidate.type = expected.type
      and candidate.name = expected.name
      and candidate.lineage_id = md5(expected.type || E'\\x1f' || expected.name)::uuid
    join public.prompt_templates source
      on source.id = candidate.source_prompt_template_id
    order by candidate.type
  `);
  return result.rows;
}

function stableJson(value) {
  if (Array.isArray(value)) return `[${value.map(stableJson).join(",")}]`;
  if (value && typeof value === "object") {
    return `{${Object.keys(value).sort().map((key) => `${JSON.stringify(key)}:${stableJson(value[key])}`).join(",")}}`;
  }
  return JSON.stringify(value);
}

function withoutKeys(value, keys) {
  return Object.fromEntries(Object.entries(value && typeof value === "object" ? value : {})
    .filter(([key]) => !keys.includes(key)));
}

function assertCandidateOptions(row, contract) {
  const candidateOptions = row.model_options && typeof row.model_options === "object" ? row.model_options : {};
  const sourceOptions = row.source_model_options && typeof row.source_model_options === "object" ? row.source_model_options : {};
  if (stableJson(withoutKeys(candidateOptions, ["promptLayers"])) !== stableJson(withoutKeys(sourceOptions, ["promptLayers"]))) {
    throw new Error(`Candidate ${row.type} changed model options outside promptLayers`);
  }
  const candidateLayers = candidateOptions.promptLayers && typeof candidateOptions.promptLayers === "object"
    ? candidateOptions.promptLayers
    : {};
  const sourceLayers = sourceOptions.promptLayers && typeof sourceOptions.promptLayers === "object"
    ? sourceOptions.promptLayers
    : {};
  if (Number(candidateLayers.schemaVersion) !== 2) {
    throw new Error(`Candidate ${row.type} is missing promptLayers.schemaVersion 2`);
  }
  const expectedInstructions = [
    ...(Array.isArray(sourceLayers.postInstructions) ? sourceLayers.postInstructions : []),
    ...contract.qualityInstructions[row.type],
  ];
  if (stableJson(candidateLayers.postInstructions) !== stableJson(expectedInstructions)) {
    throw new Error(`Candidate ${row.type} quality instructions do not match Migration 075`);
  }
  const layerKeysToIgnore = row.type === "promo_page_composer"
    ? ["schemaVersion", "postInstructions", "repairPrompts"]
    : ["schemaVersion", "postInstructions"];
  if (stableJson(withoutKeys(candidateLayers, layerKeysToIgnore)) !== stableJson(withoutKeys(sourceLayers, layerKeysToIgnore))) {
    throw new Error(`Candidate ${row.type} did not preserve its source prompt layers`);
  }
  if (row.type === "promo_page_composer") {
    const candidateRepair = candidateLayers.repairPrompts && typeof candidateLayers.repairPrompts === "object"
      ? candidateLayers.repairPrompts
      : {};
    const sourceRepair = sourceLayers.repairPrompts && typeof sourceLayers.repairPrompts === "object"
      ? sourceLayers.repairPrompts
      : {};
    if (candidateRepair.contractV3 !== contract.composerRepairPrompt
      || stableJson(withoutKeys(candidateRepair, ["contractV3"])) !== stableJson(withoutKeys(sourceRepair, ["contractV3"]))) {
      throw new Error("Composer candidate Contract V3 repair prompt does not match Migration 075");
    }
  }
}

export function validateCandidateTransition(beforeRows, afterRows, contract = migrationPlan().contract) {
  if (![0, QUALITY_PROMPTS.length].includes(beforeRows.length)) {
    throw new Error(`Migration 075 found a partial candidate set (${beforeRows.length}/${QUALITY_PROMPTS.length}); inspect it before applying`);
  }
  if (afterRows.length !== QUALITY_PROMPTS.length) {
    throw new Error(`Migration 075 postcheck expected ${QUALITY_PROMPTS.length} candidates, found ${afterRows.length}`);
  }
  const expected = new Set(QUALITY_PROMPTS.map(([type, name]) => `${type}:${name}`));
  for (const row of afterRows) {
    if (!expected.has(candidateKey(row))) throw new Error(`Unexpected Migration 075 candidate: ${candidateKey(row)}`);
    if (!["draft", "validated"].includes(row.status)) {
      throw new Error(`Candidate ${row.type} must be draft or validated, not ${row.status}`);
    }
    if (!row.provider_matches || !row.model_matches || !row.temperature_matches || !row.max_tokens_match
      || !row.response_format_matches || !row.required_variables_match || !row.optional_variables_match) {
      throw new Error(`Candidate ${row.type} does not preserve its source model and variable contract`);
    }
    if (Number(row.history_count) < 1) throw new Error(`Candidate ${row.type} is missing its audit history`);
    if (Number(row.migration_history_count) !== 1 || !row.migration_history_matches) {
      throw new Error(`Candidate ${row.type} has an invalid Migration 075 history snapshot`);
    }
    if (row.type === "promo_page_generation") {
      if (row.body !== contract.pagePromptBody) throw new Error("Page-generation candidate body does not match Migration 075");
    } else if (row.body !== row.source_body) {
      throw new Error(`Candidate ${row.type} unexpectedly changed its source prompt body`);
    }
    assertCandidateOptions(row, contract);
  }
  if (!beforeRows.length) {
    for (const row of afterRows) {
      if (row.status !== "draft" || Number(row.history_count) !== 1) {
        throw new Error(`New candidate ${row.type} must start as a draft with one history row`);
      }
    }
    return;
  }
  const beforeByKey = new Map(beforeRows.map((row) => [candidateKey(row), compactCandidate(row)]));
  const afterByKey = new Map(afterRows.map((row) => [candidateKey(row), compactCandidate(row)]));
  assertEqualSnapshot(
    Array.from(beforeByKey.entries()),
    Array.from(afterByKey.entries()),
    "Existing Migration 075 candidates",
  );
}

async function preflight(client, contract, { lockActives = false } = {}) {
  await readSchemaColumns(client);
  await assertLifecycleSchema(client);
  const sources = await readSources(client);
  const actives = await readActives(client, { lock: lockActives });
  const expectedTypes = QUALITY_PROMPTS.map(([type]) => type).sort();
  const activeTypes = actives.map((row) => row.type).sort();
  if (stableJson(activeTypes) !== stableJson(expectedTypes)) {
    const missing = expectedTypes.filter((type) => !activeTypes.includes(type));
    throw new Error(`Migration 075 requires one Active source for every prompt type; missing: ${missing.join(", ")}`);
  }
  const activeByType = new Map(actives.map((row) => [row.type, row.id]));
  for (const source of sources) {
    if (activeByType.get(source.type) !== source.id) {
      throw new Error(`Migration 075 source selection for ${source.type} is not its Active prompt`);
    }
  }
  const candidates = await readCandidates(client);
  if (![0, QUALITY_PROMPTS.length].includes(candidates.length)) {
    throw new Error(`Migration 075 found a partial candidate set (${candidates.length}/${QUALITY_PROMPTS.length}); inspect it before applying`);
  }
  for (const candidate of candidates) {
    if (activeByType.get(candidate.type) !== candidate.source_prompt_template_id) {
      throw new Error(`Candidate ${candidate.type} is not based on the current Active prompt`);
    }
  }
  if (candidates.length) validateCandidateTransition(candidates, candidates, contract);
  return { sources, actives, candidates };
}

async function connect(databaseUrl) {
  const client = new Client({ connectionString: databaseUrl, connectionTimeoutMillis: 10_000 });
  try {
    await client.connect();
    return client;
  } catch (error) {
    try { await client.end(); } catch { /* preserve the connection error */ }
    throw error;
  }
}

function publicReport(mode, target, state, migrationSha256) {
  return {
    ok: true,
    mode,
    target: "preview",
    targetFingerprint: target.fingerprint,
    migration: "075_web_output_prompt_quality_pack.sql",
    migrationSha256,
    sources: state.sources.map((row) => ({
      type: row.type,
      id: row.id,
      status: row.status,
      version: Number(row.version),
    })),
    activePrompts: state.actives,
    candidates: state.candidates.map(compactCandidate),
    ...(mode === "check" ? {
      next: "Verify this fingerprint out of band, set PROMPT_QUALITY_PREVIEW_FINGERPRINT to the approved value, create a backup/restore point, then run apply with the same --confirm-target value.",
    } : {}),
  };
}

async function checkPreview(target, plan) {
  const client = await connect(target.databaseUrl);
  try {
    await client.query("begin read only");
    const state = await preflight(client, plan.contract);
    await client.query("rollback");
    return publicReport("check", target, state, plan.migrationSha256);
  } catch (error) {
    try { await client.query("rollback"); } catch { /* preserve the original error */ }
    throw error;
  } finally {
    await client.end();
  }
}

async function applyPreview(target, plan) {
  const client = await connect(target.databaseUrl);
  try {
    await client.query("begin isolation level serializable");
    await client.query("set local lock_timeout = '10s'");
    await client.query("set local statement_timeout = '60s'");
    await client.query("select pg_advisory_xact_lock(hashtext($1))", ["migration:075_web_output_prompt_quality_pack"]);
    const before = await preflight(client, plan.contract, { lockActives: true });
    await client.query(plan.body);
    const after = await preflight(client, plan.contract, { lockActives: true });
    validateCandidateTransition(before.candidates, after.candidates, plan.contract);
    assertEqualSnapshot(before.actives, after.actives, "Active prompt snapshot");
    await client.query("commit");
    return publicReport("apply", target, after, plan.migrationSha256);
  } catch (error) {
    try { await client.query("rollback"); } catch { /* preserve the original error */ }
    throw error;
  } finally {
    await client.end();
  }
}

export async function run(argv = process.argv.slice(2), env = process.env) {
  const args = parseArgs(argv);
  const plan = migrationPlan();
  if (args.mode === "plan") {
    return {
      ok: true,
      mode: "plan",
      networkAccess: false,
      migration: "075_web_output_prompt_quality_pack.sql",
      migrationSha256: plan.migrationSha256,
      promptTypes: QUALITY_PROMPTS.map(([type]) => type),
      next: "Inject PREVIEW_DATABASE_URL, then run --check --target=preview. Apply additionally requires an independently approved PROMPT_QUALITY_PREVIEW_FINGERPRINT and a backup/restore point.",
    };
  }

  const target = resolvePreviewTarget(env);
  if (args.mode === "check") return checkPreview(target, plan);
  if (!args.backupConfirmed) {
    throw new Error("Apply requires --backup-confirmed after creating a Preview DB backup or restore point");
  }
  assertApprovedPreviewTarget(target, args, env);
  return applyPreview(target, plan);
}

const isMain = process.argv[1]
  && import.meta.url === pathToFileURL(process.argv[1]).href;

if (isMain) {
  run().then((report) => {
    process.stdout.write(`${JSON.stringify(report, null, 2)}\n`);
  }).catch((error) => {
    process.stderr.write(`${redactSecrets(error?.message || error, databaseRedactionSecrets(process.env))}\n`);
    process.exitCode = 1;
  });
}
