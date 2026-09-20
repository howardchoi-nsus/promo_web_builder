const { getSql } = require("./_promo-builder-document-store");

const ENVIRONMENTS = new Set(["development", "preview", "production"]);
const SECRET_REF_PATTERN = /^env:DIRECTUS_SECRET_[A-Z0-9_]+$/;

function normalizeConfig(candidate = {}) {
  return {
    baseUrl: String(candidate.baseUrl || "").trim().replace(/\/+$/, ""),
    secretRef: String(candidate.secretRef || "").trim(),
    timeoutMs: Math.min(15_000, Math.max(1_000, Number(candidate.timeoutMs || 5_000))),
    retryCount: Math.min(2, Math.max(0, Number(candidate.retryCount || 0))),
    verifyAuthentication: candidate.verifyAuthentication !== false,
  };
}

function allowedHosts(env = process.env) {
  return new Set(String(env.DIRECTUS_ALLOWED_HOSTS || "").split(",").map((value) => value.trim().toLowerCase()).filter(Boolean));
}

function validateConfig(candidate, env = process.env) {
  const config = normalizeConfig(candidate);
  const errors = [];
  let parsed;
  try {
    parsed = new URL(config.baseUrl);
  } catch {
    errors.push({ code: "INVALID_BASE_URL", field: "baseUrl", message: "올바른 Directus URL이 필요합니다." });
  }
  if (parsed) {
    const hosted = Boolean(env.VERCEL) || ["preview", "production"].includes(String(env.VERCEL_ENV || "").toLowerCase());
    const localHost = ["localhost", "127.0.0.1", "::1"].includes(parsed.hostname.toLowerCase());
    if (parsed.protocol !== "https:" && !(localHost && !hosted)) {
      errors.push({ code: "HTTPS_REQUIRED", field: "baseUrl", message: "호스팅 환경에서는 HTTPS URL만 허용됩니다." });
    }
    if (parsed.username || parsed.password || parsed.search || parsed.hash) {
      errors.push({ code: "UNSAFE_BASE_URL", field: "baseUrl", message: "인증정보, query, fragment가 포함된 URL은 허용되지 않습니다." });
    }
    const hosts = allowedHosts(env);
    if (!localHost && !hosts.has(parsed.hostname.toLowerCase())) {
      errors.push({ code: "HOST_NOT_ALLOWED", field: "baseUrl", message: "DIRECTUS_ALLOWED_HOSTS에 등록된 호스트만 연결할 수 있습니다." });
    }
  }
  if (config.verifyAuthentication && !SECRET_REF_PATTERN.test(config.secretRef)) {
    errors.push({ code: "INVALID_SECRET_REF", field: "secretRef", message: "env:DIRECTUS_SECRET_* 형식의 비밀키 참조가 필요합니다." });
  }
  return { ok: errors.length === 0, errors, config };
}

function toConfig(row) {
  if (!row) return null;
  return {
    id: row.id,
    integrationKey: row.integration_key,
    environment: row.environment,
    version: Number(row.version),
    status: row.status,
    config: normalizeConfig(row.config_json),
    validation: row.validation_json || {},
    activatedAt: row.activated_at,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

async function listConfigs(sql, ownerSubject) {
  const rows = await sql`
    select * from promo_integration_configs
    where integration_key = 'directus' and created_by = ${ownerSubject}
    order by environment, version desc
  `;
  return rows.map(toConfig);
}

async function createDraft(sql, { environment, config, ownerSubject }) {
  if (!ENVIRONMENTS.has(environment)) throw Object.assign(new Error("Invalid integration environment"), { statusCode: 422 });
  const rows = await sql`
    insert into promo_integration_configs (
      integration_key, environment, version, status, config_json, created_by
    ) values (
      'directus', ${environment},
      coalesce((select max(version) + 1 from promo_integration_configs where integration_key = 'directus' and environment = ${environment}), 1),
      'draft', ${JSON.stringify(normalizeConfig(config))}::jsonb, ${ownerSubject}
    ) returning *
  `;
  return toConfig(rows[0]);
}

async function getOwnedConfig(sql, id, ownerSubject) {
  const rows = await sql`
    select * from promo_integration_configs
    where id = ${id}::uuid and integration_key = 'directus' and created_by = ${ownerSubject}
    limit 1
  `;
  return toConfig(rows[0]);
}

async function validateDraft(sql, { id, ownerSubject, env = process.env }) {
  const current = await getOwnedConfig(sql, id, ownerSubject);
  if (!current || current.status !== "draft") return null;
  const validation = { ...validateConfig(current.config, env), validatedAt: new Date().toISOString() };
  const rows = await sql`
    update promo_integration_configs
    set validation_json = ${JSON.stringify(validation)}::jsonb, updated_at = now()
    where id = ${id}::uuid and created_by = ${ownerSubject} and status = 'draft'
    returning *
  `;
  return toConfig(rows[0]);
}

async function activateDraft(sql, { id, ownerSubject }) {
  const current = await getOwnedConfig(sql, id, ownerSubject);
  if (!current) return null;
  if (current.status !== "draft" || current.validation?.ok !== true) {
    throw Object.assign(new Error("검증을 통과한 초안만 활성화할 수 있습니다."), { statusCode: 409, code: "DIRECTUS_CONFIG_NOT_VALIDATED" });
  }
  const rows = await sql`
    select activate_promo_integration_config(${id}::uuid, ${ownerSubject})::text as id
  `;
  return rows[0]?.id ? getOwnedConfig(sql, rows[0].id, ownerSubject) : null;
}

async function suspendConfig(sql, { id, ownerSubject }) {
  const rows = await sql`
    update promo_integration_configs
    set status = 'suspended', updated_at = now()
    where id = ${id}::uuid and created_by = ${ownerSubject} and status = 'active'
    returning *
  `;
  return toConfig(rows[0]);
}

async function listConnectionChecks(sql, ownerSubject, limit = 20) {
  const safeLimit = Math.min(50, Math.max(1, Number(limit || 20)));
  const rows = await sql`
    select connection.*, config.environment, config.version
    from promo_integration_connection_checks connection
    join promo_integration_configs config on config.id = connection.config_id
    where config.created_by = ${ownerSubject}
    order by connection.checked_at desc
    limit ${safeLimit}
  `;
  return rows.map((row) => ({
    id: row.id,
    configId: row.config_id,
    environment: row.environment,
    version: Number(row.version),
    status: row.status,
    healthStatus: row.health_status,
    authVerified: Boolean(row.auth_verified),
    durationMs: Number(row.duration_ms),
    errorCode: row.error_code,
    errorMessage: row.error_message,
    checkedAt: row.checked_at,
  }));
}

async function recordConnectionCheck(sql, input) {
  await sql`
    insert into promo_integration_connection_checks (
      config_id, status, health_status, auth_verified, duration_ms,
      error_code, error_message, checked_by
    ) values (
      ${input.configId}::uuid, ${input.status}, ${input.healthStatus || ""},
      ${Boolean(input.authVerified)}, ${Number(input.durationMs || 0)},
      ${input.errorCode || ""}, ${String(input.errorMessage || "").slice(0, 1000)}, ${input.ownerSubject}
    )
  `;
}

module.exports = {
  ENVIRONMENTS,
  getSql,
  normalizeConfig,
  validateConfig,
  toConfig,
  listConfigs,
  createDraft,
  getOwnedConfig,
  validateDraft,
  activateDraft,
  suspendConfig,
  listConnectionChecks,
  recordConnectionCheck,
};
