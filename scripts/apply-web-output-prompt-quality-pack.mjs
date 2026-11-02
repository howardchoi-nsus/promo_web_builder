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
  return {
    sql,
    body,
    migrationSha256,
    migrationFile: fileURLToPath(MIGRATION_URL),
  };
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

export function redactSecrets(value, secrets = []) {
  let redacted = String(value || "");
  for (const secret of secrets.filter(Boolean)) {
    redacted = redacted.split(String(secret)).join("[REDACTED_DB_URL]");
  }
  return redacted.replace(/postgres(?:ql)?:\/\/[^\s'"`]+/gi, "[REDACTED_DB_URL]");
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

async function readActives(client) {
  const result = await client.query(`
    select type, id::text, version
    from public.prompt_templates
    where type = any($1::text[])
      and status = 'active'
    order by type
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
      (candidate.provider = source.provider) as provider_matches,
      (candidate.model = source.model) as model_matches,
      (candidate.required_variables = source.required_variables) as required_variables_match,
      (candidate.optional_variables = source.optional_variables) as optional_variables_match,
      (select count(*)::integer
        from public.prompt_template_histories history
        where history.prompt_template_id = candidate.id) as history_count
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

export function validateCandidateTransition(beforeRows, afterRows) {
  if (![0, QUALITY_PROMPTS.length].includes(beforeRows.length)) {
    throw new Error(`Migration 075 found a partial candidate set (${beforeRows.length}/${QUALITY_PROMPTS.length}); inspect it before applying`);
  }
  if (afterRows.length !== QUALITY_PROMPTS.length) {
    throw new Error(`Migration 075 postcheck expected ${QUALITY_PROMPTS.length} candidates, found ${afterRows.length}`);
  }
  const expected = new Set(QUALITY_PROMPTS.map(([type, name]) => `${type}:${name}`));
  for (const row of afterRows) {
    if (!expected.has(candidateKey(row))) throw new Error(`Unexpected Migration 075 candidate: ${candidateKey(row)}`);
    if (!row.provider_matches || !row.model_matches || !row.required_variables_match || !row.optional_variables_match) {
      throw new Error(`Candidate ${row.type} does not preserve its source model and variable contract`);
    }
    if (Number(row.history_count) < 1) throw new Error(`Candidate ${row.type} is missing its audit history`);
  }
  const composer = afterRows.find((row) => row.type === "promo_page_composer");
  const composerOptions = JSON.stringify(composer?.model_options || {});
  if (!composerOptions.includes("CONTRACT_V3_CONTENT_ITEMS") || !composerOptions.includes("repairPrompts")) {
    throw new Error("Composer candidate is missing the Contract V3 quality or repair layer");
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

async function preflight(client) {
  await readSchemaColumns(client);
  const sources = await readSources(client);
  const actives = await readActives(client);
  const candidates = await readCandidates(client);
  if (![0, QUALITY_PROMPTS.length].includes(candidates.length)) {
    throw new Error(`Migration 075 found a partial candidate set (${candidates.length}/${QUALITY_PROMPTS.length}); inspect it before applying`);
  }
  return { sources, actives, candidates };
}

async function connect(databaseUrl) {
  const client = new Client({ connectionString: databaseUrl });
  await client.connect();
  return client;
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
  };
}

async function checkPreview(target, migrationSha256) {
  const client = await connect(target.databaseUrl);
  try {
    await client.query("begin read only");
    const state = await preflight(client);
    await client.query("rollback");
    return publicReport("check", target, state, migrationSha256);
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
    const before = await preflight(client);
    await client.query(plan.body);
    const after = await preflight(client);
    validateCandidateTransition(before.candidates, after.candidates);
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
      next: "Inject PREVIEW_DATABASE_URL, create a Preview DB backup/branch, then run with --check --target=preview.",
    };
  }

  const target = resolvePreviewTarget(env);
  if (args.mode === "check") return checkPreview(target, plan.migrationSha256);
  if (!args.backupConfirmed) {
    throw new Error("Apply requires --backup-confirmed after creating a Preview DB backup or restore point");
  }
  if (args.confirmTarget !== target.fingerprint) {
    throw new Error(`Apply requires --confirm-target=${target.fingerprint}`);
  }
  return applyPreview(target, plan);
}

const isMain = process.argv[1]
  && import.meta.url === pathToFileURL(process.argv[1]).href;

if (isMain) {
  run().then((report) => {
    process.stdout.write(`${JSON.stringify(report, null, 2)}\n`);
  }).catch((error) => {
    const previewUrl = String(process.env.PREVIEW_DATABASE_URL || "").trim();
    process.stderr.write(`${redactSecrets(error?.message || error, [previewUrl])}\n`);
    process.exitCode = 1;
  });
}
