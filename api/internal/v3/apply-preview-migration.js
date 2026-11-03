const { readFileSync } = require("node:fs");
const { join } = require("node:path");
const { Client } = require("@neondatabase/serverless");
const { requireBuilderFlag } = require("../../_promo-builder-flags");
const { requirePromoServiceV3 } = require("../../_promo-service-v3-auth");

const MIGRATION_PATH = join(__dirname, "../../../db/migrations/070_promo_service_contract_v3_foundation.sql");
const CONFIRMATION = "APPLY_PROMO_SERVICE_CONTRACT_V3_PREVIEW";

function targetIdentity(value) {
  const parsed = new URL(String(value || "").trim());
  const hostname = parsed.hostname.toLowerCase().replace(/-pooler(?=\.)/, "");
  const database = decodeURIComponent(parsed.pathname.replace(/^\/+/, ""));
  if (!["postgres:", "postgresql:"].includes(parsed.protocol) || !hostname || !database) {
    throw new Error("PREVIEW_DATABASE_URL is invalid");
  }
  return `${hostname}:${parsed.port || "5432"}/${database}`;
}

function migrationBody() {
  const source = readFileSync(MIGRATION_PATH, "utf8").trim();
  const begin = source.match(/^begin\s*;/i);
  const commit = source.match(/commit\s*;\s*$/i);
  if (!begin || !commit || commit.index <= begin[0].length) {
    throw new Error("Migration 070 transaction wrapper is invalid");
  }
  return source.slice(begin[0].length, commit.index).trim();
}

async function verify(client) {
  const result = await client.query(`
    select to_regclass('user_service.promo_requests') as promo_requests,
           to_regclass('llm_runtime.generation_jobs') as generation_jobs,
           to_regclass('cms.promotion_approvals') as promotion_approvals,
           to_regclass('web_output.publication_snapshots') as publication_snapshots
  `);
  const row = result.rows[0] || {};
  return Object.values(row).every(Boolean);
}

module.exports = async function handler(req, res) {
  let client;
  try {
    requireBuilderFlag("serviceContractV3");
    requirePromoServiceV3(req);
    if (req.method !== "POST") {
      return res.status(405).json({ error: "Method not allowed", code: "METHOD_NOT_ALLOWED" });
    }
    if (String(process.env.VERCEL_ENV || "").toLowerCase() !== "preview") {
      return res.status(403).json({ error: "Preview environment required", code: "PREVIEW_ENV_REQUIRED" });
    }
    if (req.body?.confirmation !== CONFIRMATION) {
      return res.status(400).json({ error: "Migration confirmation is required", code: "MIGRATION_CONFIRMATION_REQUIRED" });
    }

    const previewUrl = String(process.env.PREVIEW_DATABASE_URL || "").trim();
    if (!previewUrl) throw new Error("PREVIEW_DATABASE_URL is required");
    const productionUrl = String(process.env.DATABASE_URL || "").trim();
    if (productionUrl && targetIdentity(previewUrl) === targetIdentity(productionUrl)) {
      return res.status(409).json({ error: "Preview DB matches the default database target", code: "PREVIEW_DB_NOT_ISOLATED" });
    }

    client = new Client({ connectionString: previewUrl, connectionTimeoutMillis: 10_000 });
    await client.connect();
    await client.query("begin isolation level serializable");
    await client.query("set local lock_timeout = '10s'");
    await client.query("set local statement_timeout = '60s'");
    await client.query("select pg_advisory_xact_lock(hashtext($1))", ["migration:070_promo_service_contract_v3_foundation"]);
    await client.query(migrationBody());
    if (!(await verify(client))) throw new Error("Migration verification failed");
    await client.query("commit");
    return res.status(200).json({ ok: true, migration: "070_promo_service_contract_v3_foundation", verified: true });
  } catch (error) {
    if (client) {
      try { await client.query("rollback"); } catch { /* keep the original failure */ }
    }
    return res.status(error.statusCode || 500).json({ error: error.message, code: error.code || "PREVIEW_MIGRATION_FAILED" });
  } finally {
    if (client) await client.end().catch(() => null);
  }
};
