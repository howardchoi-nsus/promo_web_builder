const ALLOWED_DOMAINS = new Set(["components", "designTokens"]);
const ALLOWED_ENVIRONMENTS = new Set(["development", "preview", "production"]);

function evaluateCutoverReadiness(input = {}) {
  const gates = [
    { key: "active_config", passed: Boolean(input.activeConfigId), detail: input.activeConfigId || "missing" },
    { key: "connection_check", passed: input.connectionCheckStatus === "passed", detail: input.connectionCheckStatus || "missing" },
    { key: "migration_batch", passed: input.migrationBatchStatus === "passed", detail: input.migrationBatchStatus || "missing" },
    { key: "schema_version", passed: Boolean(input.schemaVersion) && input.schemaVersion === input.batchSchemaVersion, detail: input.batchSchemaVersion || "missing" },
    { key: "blocking_diffs", passed: Number(input.blockingDiffCount || 0) === 0, detail: Number(input.blockingDiffCount || 0) },
    { key: "fallback_verified", passed: input.fallbackVerified === true, detail: Boolean(input.fallbackVerified) },
    { key: "cache_verified", passed: input.cacheVerified === true, detail: Boolean(input.cacheVerified) },
    { key: "approval", passed: Boolean(input.approvedBy), detail: input.approvedBy || "missing" },
  ];
  return { ready: gates.every((gate) => gate.passed), gates };
}

async function loadCutoverReadiness(sql, { environment, domain }) {
  if (!ALLOWED_ENVIRONMENTS.has(environment) || !ALLOWED_DOMAINS.has(domain)) {
    throw Object.assign(new Error("Invalid Directus cutover environment or domain"), { statusCode: 422, code: "DIRECTUS_CUTOVER_SCOPE_INVALID" });
  }
  const configs = await sql`
    select config.id::text, config.validation_json,
      connection.status as connection_status
    from promo_integration_configs config
    left join lateral (
      select status from promo_integration_connection_checks
      where config_id = config.id order by checked_at desc limit 1
    ) connection on true
    where config.integration_key = 'directus'
      and config.environment = ${environment}
      and config.status = 'active'
    limit 1
  `;
  const batches = await sql`
    select id::text, status, schema_version, counts_json
    from promo_directus_migration_batches
    where source_environment = ${environment}
      and target_environment = ${environment}
      and selected_domains ? ${domain}
    order by completed_at desc nulls last, started_at desc
    limit 1
  `;
  const snapshots = await sql`
    select schema_version, gate_evidence, approved_by
    from promo_directus_cutover_snapshots
    where environment = ${environment} and domain = ${domain}
      and status in ('draft', 'approved')
    order by created_at desc limit 1
  `;
  const blocking = await sql`
    select count(*)::integer as count from promo_directus_shadow_diffs
    where domain = ${domain} and severity = 'blocking'
      and observed_at >= coalesce((
        select completed_at from promo_directus_migration_batches
        where id = ${batches[0]?.id || null}::uuid
      ), '-infinity'::timestamptz)
  `;
  const evidence = snapshots[0]?.gate_evidence || {};
  const input = {
    activeConfigId: configs[0]?.id || "",
    connectionCheckStatus: configs[0]?.connection_status || "",
    migrationBatchStatus: batches[0]?.status || "",
    batchSchemaVersion: batches[0]?.schema_version || "",
    schemaVersion: snapshots[0]?.schema_version || "",
    blockingDiffCount: Number(blocking[0]?.count || 0),
    fallbackVerified: evidence.fallbackVerified === true,
    cacheVerified: evidence.cacheVerified === true,
    approvedBy: snapshots[0]?.approved_by || "",
  };
  return { environment, domain, ...input, ...evaluateCutoverReadiness(input) };
}

module.exports = { ALLOWED_DOMAINS, ALLOWED_ENVIRONMENTS, evaluateCutoverReadiness, loadCutoverReadiness };
