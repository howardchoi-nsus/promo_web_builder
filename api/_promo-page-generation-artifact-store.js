const { createHash, createHmac, timingSafeEqual } = require("node:crypto");
const { neon } = require("@neondatabase/serverless");
const { getDatabaseUrl } = require("./_db");

const DEFAULT_TTL_SECONDS = 24 * 60 * 60;
const MIN_TTL_SECONDS = 5 * 60;
const MAX_TTL_SECONDS = 7 * 24 * 60 * 60;

function fail(code, message, statusCode = 400) {
  throw Object.assign(new Error(message), { code, statusCode });
}

function getSql() {
  const databaseUrl = getDatabaseUrl();
  if (!databaseUrl) fail("DATABASE_NOT_CONFIGURED", "DATABASE_URL is not configured", 500);
  return neon(databaseUrl);
}

function signingSecret(env = process.env) {
  const value = String(env.PROMO_PAGE_ARTIFACT_SIGNING_SECRET || "").trim();
  if (value.length < 32) {
    fail(
      "PROMO_PAGE_ARTIFACT_SIGNING_SECRET_NOT_CONFIGURED",
      "PROMO_PAGE_ARTIFACT_SIGNING_SECRET must contain at least 32 characters",
      503,
    );
  }
  return value;
}

function normalizeArtifactKey(value) {
  const key = String(value || "").trim();
  if (!/^[A-Za-z0-9][A-Za-z0-9_-]{0,127}$/.test(key)) {
    fail("PROMO_PAGE_ARTIFACT_KEY_INVALID", "Artifact id must be 1-128 URL-safe characters");
  }
  return key;
}

function normalizeTtlSeconds(value) {
  const parsed = Number(value || DEFAULT_TTL_SECONDS);
  if (!Number.isFinite(parsed)) return DEFAULT_TTL_SECONDS;
  return Math.min(MAX_TTL_SECONDS, Math.max(MIN_TTL_SECONDS, Math.trunc(parsed)));
}

function safeJson(value, maxBytes, label) {
  const normalized = value && typeof value === "object" && !Array.isArray(value) ? value : {};
  const serialized = JSON.stringify(normalized);
  if (Buffer.byteLength(serialized, "utf8") > maxBytes) {
    fail("PROMO_PAGE_ARTIFACT_METADATA_TOO_LARGE", `${label} exceeds its storage limit`, 422);
  }
  return normalized;
}

function normalizePromptMeta(value) {
  const input = value && typeof value === "object" && !Array.isArray(value) ? value : {};
  const allowedKeys = new Set([
    "id",
    "type",
    "name",
    "version",
    "renderedPromptHash",
    "variableHash",
    "promptLayerSources",
  ]);
  const unexpected = Object.keys(input).filter((key) => !allowedKeys.has(key));
  if (unexpected.length) {
    fail(
      "PROMO_PAGE_ARTIFACT_PROMPT_META_INVALID",
      `promptMeta contains unsupported fields: ${unexpected.join(", ")}`,
      422,
    );
  }
  const id = String(input.id || "").trim();
  const type = String(input.type || "").trim();
  const name = String(input.name || "").trim();
  const version = Number(input.version);
  const renderedPromptHash = String(input.renderedPromptHash || "").trim().toLowerCase();
  const variableHash = String(input.variableHash || "").trim().toLowerCase();
  if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(id)
    || type !== "promo_page_generation" || !name || name.length > 256
    || !Number.isInteger(version) || version < 1
    || !/^[0-9a-f]{64}$/.test(renderedPromptHash)
    || !/^[0-9a-f]{64}$/.test(variableHash)) {
    fail(
      "PROMO_PAGE_ARTIFACT_PROMPT_META_INVALID",
      "promptMeta must identify a versioned promo_page_generation prompt and its SHA-256 hashes",
      422,
    );
  }
  const rawSources = Array.isArray(input.promptLayerSources) ? input.promptLayerSources : [];
  if (rawSources.length > 32) {
    fail("PROMO_PAGE_ARTIFACT_PROMPT_META_INVALID", "promptMeta contains too many prompt layer sources", 422);
  }
  const promptLayerSources = rawSources.map((source) => {
    const item = source && typeof source === "object" && !Array.isArray(source) ? source : {};
    const sourceKeys = Object.keys(item).sort();
    if (JSON.stringify(sourceKeys) !== JSON.stringify(["key", "renderedHash", "source"])) {
      fail("PROMO_PAGE_ARTIFACT_PROMPT_META_INVALID", "Prompt layer source metadata has an invalid shape", 422);
    }
    const key = String(item.key || "").trim();
    const origin = String(item.source || "").trim();
    const renderedHash = String(item.renderedHash || "").trim().toLowerCase();
    if (!key || key.length > 128 || !origin || origin.length > 128 || !/^[0-9a-f]{64}$/.test(renderedHash)) {
      fail("PROMO_PAGE_ARTIFACT_PROMPT_META_INVALID", "Prompt layer source metadata is invalid", 422);
    }
    return { key, source: origin, renderedHash };
  });
  return {
    id,
    type,
    name,
    version,
    renderedPromptHash,
    variableHash,
    promptLayerSources,
  };
}

function escapeHtml(value) {
  return String(value || "").replace(/[&<>"']/g, (character) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;",
  })[character]);
}

function buildPageHtml({ result, documentLanguage, title }) {
  const language = String(documentLanguage || "en").trim().toLowerCase();
  const safeLanguage = /^[a-z]{2,3}(?:-[a-z0-9]{2,8})*$/.test(language) ? language : "en";
  return [
    "<!doctype html>",
    `<html lang="${safeLanguage}">`,
    "<head>",
    '<meta charset="utf-8">',
    '<meta name="viewport" content="width=device-width, initial-scale=1">',
    `<title>${escapeHtml(title || "Promo Page")}</title>`,
    `<style>${result.css}</style>`,
    "</head>",
    `<body>${result.html}</body>`,
    "</html>",
  ].join("");
}

function contentHash(pageHtml) {
  return createHash("sha256").update(String(pageHtml || ""), "utf8").digest("hex");
}

function tokenPayload({ artifactKey, hash, expiresAt }) {
  return `${artifactKey}\n${hash}\n${new Date(expiresAt).toISOString()}`;
}

function createViewToken(fields, env = process.env) {
  return createHmac("sha256", signingSecret(env))
    .update(tokenPayload(fields), "utf8")
    .digest("base64url");
}

function verifyViewToken(token, fields, env = process.env) {
  const supplied = Buffer.from(String(token || ""));
  const expected = Buffer.from(createViewToken(fields, env));
  return supplied.length === expected.length && timingSafeEqual(supplied, expected);
}

async function saveArtifact(sql, artifact) {
  const rows = await sql`
    insert into public.promo_page_generation_artifacts as existing (
      artifact_key,
      content_hash,
      page_html,
      prompt_meta,
      quality_snapshot,
      expires_at,
      updated_at
    ) values (
      ${artifact.artifactKey},
      ${artifact.hash},
      ${artifact.pageHtml},
      ${JSON.stringify(artifact.promptMeta)}::jsonb,
      ${JSON.stringify(artifact.qualitySnapshot)}::jsonb,
      ${artifact.expiresAt.toISOString()}::timestamptz,
      now()
    )
    on conflict (artifact_key) do update set
      content_hash = case when existing.expires_at <= now() then excluded.content_hash else existing.content_hash end,
      page_html = case when existing.expires_at <= now() then excluded.page_html else existing.page_html end,
      prompt_meta = case when existing.expires_at <= now() then excluded.prompt_meta else existing.prompt_meta end,
      quality_snapshot = case when existing.expires_at <= now() then excluded.quality_snapshot else existing.quality_snapshot end,
      expires_at = case when existing.expires_at <= now() then excluded.expires_at else existing.expires_at end,
      updated_at = case when existing.expires_at <= now() then now() else existing.updated_at end
    where existing.expires_at <= now()
      or existing.content_hash = excluded.content_hash
    returning artifact_key, content_hash, expires_at, created_at, updated_at
  `;
  return rows[0] || null;
}

async function deleteExpiredArtifacts(sql) {
  return sql`
    with expired as (
      select artifact_key
      from public.promo_page_generation_artifacts
      where expires_at <= now()
      order by expires_at asc
      limit 100
    )
    delete from public.promo_page_generation_artifacts artifact
    using expired
    where artifact.artifact_key = expired.artifact_key
  `;
}

async function findArtifact(sql, artifactKey) {
  const rows = await sql`
    select artifact_key, content_hash, page_html, expires_at
    from public.promo_page_generation_artifacts
    where artifact_key = ${artifactKey}
      and expires_at > now()
    limit 1
  `;
  return rows[0] || null;
}

module.exports = {
  DEFAULT_TTL_SECONDS,
  MAX_TTL_SECONDS,
  MIN_TTL_SECONDS,
  buildPageHtml,
  contentHash,
  createViewToken,
  deleteExpiredArtifacts,
  findArtifact,
  getSql,
  normalizeArtifactKey,
  normalizePromptMeta,
  normalizeTtlSeconds,
  safeJson,
  saveArtifact,
  signingSecret,
  verifyViewToken,
};
