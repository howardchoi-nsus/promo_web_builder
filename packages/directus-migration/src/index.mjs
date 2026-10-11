import { createHash, randomUUID } from "node:crypto";

export const SUPPORTED_DOMAINS = Object.freeze(["components", "designTokens"]);

function object(value) {
  return value && typeof value === "object" && !Array.isArray(value) ? value : {};
}

export function stableValue(value) {
  if (Array.isArray(value)) return value.map(stableValue);
  if (!value || typeof value !== "object") return value;
  return Object.fromEntries(Object.keys(value).sort().map((key) => [key, stableValue(value[key])]));
}

export function stableJson(value) {
  return JSON.stringify(stableValue(value));
}

export function contentHash(value) {
  return createHash("sha256").update(stableJson(value)).digest("hex");
}

export function selectedDomains(value = SUPPORTED_DOMAINS) {
  const requested = Array.from(new Set((Array.isArray(value) ? value : String(value).split(","))
    .map((domain) => String(domain).trim()).filter(Boolean)));
  const unsupported = requested.filter((domain) => !SUPPORTED_DOMAINS.includes(domain));
  if (!requested.length || unsupported.length) {
    const error = new TypeError(`Unsupported Directus migration domains: ${unsupported.join(", ") || "none"}`);
    error.code = "DIRECTUS_MIGRATION_DOMAIN_INVALID";
    throw error;
  }
  return requested;
}

function normalizedRecord(record) {
  const source = object(record);
  const id = String(source.id || source.sourceId || "").trim();
  if (!id) throw new TypeError("Migration record id is required");
  const sourceRevision = Number(source.sourceRevision ?? source.revision ?? 0);
  const payload = stableValue(object(source.payload || source.data || source));
  return {
    id,
    sourceRevision: Number.isFinite(sourceRevision) ? sourceRevision : 0,
    sourceUpdatedAt: String(source.sourceUpdatedAt || source.updatedAt || ""),
    payload,
    contentHash: String(source.contentHash || contentHash(payload)),
  };
}

function domainRecords(snapshot, domain) {
  return Array.isArray(snapshot?.domains?.[domain]) ? snapshot.domains[domain].map(normalizedRecord) : [];
}

export function buildInventory(snapshot, domains = SUPPORTED_DOMAINS) {
  return Object.fromEntries(selectedDomains(domains).map((domain) => {
    const records = domainRecords(snapshot, domain).sort((a, b) => a.id.localeCompare(b.id));
    const duplicateIds = records.map((record) => record.id)
      .filter((id, index, ids) => ids.indexOf(id) !== index);
    return [domain, {
      count: records.length,
      duplicateIds: Array.from(new Set(duplicateIds)),
      identityHash: contentHash(records.map((record) => record.id)),
      payloadHash: contentHash(records.map(({ id, sourceRevision, contentHash: hash }) => ({ id, sourceRevision, contentHash: hash }))),
    }];
  }));
}

export function planMigration(sourceSnapshot, targetSnapshot = {}, domains = SUPPORTED_DOMAINS) {
  const plan = {};
  for (const domain of selectedDomains(domains)) {
    const source = domainRecords(sourceSnapshot, domain);
    const target = new Map(domainRecords(targetSnapshot, domain).map((record) => [record.id, record]));
    const upserts = [];
    const skips = [];
    const conflicts = [];
    for (const record of source) {
      const existing = target.get(record.id);
      if (!existing) upserts.push({ action: "create", ...record });
      else if (existing.sourceRevision > record.sourceRevision) conflicts.push({ id: record.id, reason: "target_revision_newer" });
      else if (existing.sourceRevision === record.sourceRevision && existing.contentHash === record.contentHash) skips.push({ id: record.id, reason: "unchanged" });
      else upserts.push({ action: "update", before: existing, ...record });
      target.delete(record.id);
    }
    plan[domain] = {
      upserts,
      skips,
      conflicts,
      deletions: Array.from(target.values()).map((record) => ({ id: record.id, target: record, reason: "missing_from_source" })),
    };
  }
  return plan;
}

export function reconcileSnapshots(sourceSnapshot, targetSnapshot, domains = SUPPORTED_DOMAINS) {
  const plan = planMigration(sourceSnapshot, targetSnapshot, domains);
  return Object.fromEntries(Object.entries(plan).map(([domain, value]) => [domain, {
    ok: value.upserts.length === 0 && value.conflicts.length === 0 && value.deletions.length === 0,
    missingOrChanged: value.upserts.map(({ id, action }) => ({ id, action })),
    conflicts: value.conflicts,
    unexpectedTargetRecords: value.deletions.map(({ id }) => ({ id })),
  }]));
}

export function createBatchMetadata({
  migrationId = "directus-reference-data-v1",
  domains = SUPPORTED_DOMAINS,
  sourceCommit = "",
  sourceEnvironment,
  targetEnvironment,
  schemaVersion,
  now = new Date().toISOString(),
  batchId = randomUUID(),
} = {}) {
  if (!sourceCommit || !sourceEnvironment || !targetEnvironment || !schemaVersion) {
    throw new TypeError("sourceCommit, sourceEnvironment, targetEnvironment, and schemaVersion are required");
  }
  if (sourceEnvironment !== targetEnvironment) {
    const error = new Error("Cross-environment Directus migration is not allowed");
    error.code = "DIRECTUS_MIGRATION_ENVIRONMENT_MISMATCH";
    throw error;
  }
  return {
    contractVersion: 1,
    migrationId,
    batchId,
    selectedDomains: selectedDomains(domains),
    sourceCommit,
    sourceEnvironment,
    targetEnvironment,
    schemaVersion,
    startedAt: now,
    status: "planned",
  };
}

export function buildRollbackPlan(migrationPlan, batchId) {
  const steps = [];
  for (const [domain, plan] of Object.entries(object(migrationPlan)).reverse()) {
    for (const record of [...(plan.upserts || [])].reverse()) {
      steps.push(record.action === "create"
        ? { domain, action: "delete_created", id: record.id, batchId }
        : { domain, action: "restore_before", id: record.id, before: record.before, batchId });
    }
    for (const deletion of [...(plan.deletions || [])].reverse()) {
      steps.push({ domain, action: "restore_deleted", id: deletion.id, target: deletion.target, batchId });
    }
  }
  return { contractVersion: 1, batchId, steps };
}
