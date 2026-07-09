const { getSql } = require("./_prompt-template-store");

const WORKER_STAGES = {
  integrated_brief: {
    label: "Integrated Brief",
    envName: "N8N_INTEGRATED_BRIEF_WORKER_URL",
  },
  lofi_draft: {
    label: "LO-FI Draft",
    envName: "N8N_LOFI_DRAFT_WORKER_URL",
  },
  final_design: {
    label: "Final Design",
    envName: "N8N_FINAL_DESIGN_WORKER_URL",
  },
  promo_ui_design: {
    label: "Promo UI Design",
    envName: "N8N_PROMO_UI_DESIGN_WEBHOOK_URL",
  },
};

async function ensureWorkerWebhookSettings(sql) {
  await sql`create extension if not exists pgcrypto`;

  await sql`
    create table if not exists worker_webhook_settings (
      id uuid primary key default gen_random_uuid(),
      stage text not null unique,
      webhook_url text not null default '',
      is_active boolean not null default false,
      timeout_ms integer,
      description text not null default '',
      change_note text not null default '',
      metadata jsonb not null default '{}'::jsonb,
      created_at timestamptz not null default now(),
      updated_at timestamptz not null default now()
    )
  `;

  await sql`
    create table if not exists worker_webhook_setting_histories (
      id uuid primary key default gen_random_uuid(),
      setting_id uuid references worker_webhook_settings (id) on delete set null,
      stage text not null,
      previous_webhook_url text not null default '',
      new_webhook_url text not null default '',
      previous_is_active boolean not null default false,
      new_is_active boolean not null default false,
      previous_timeout_ms integer,
      new_timeout_ms integer,
      previous_description text not null default '',
      new_description text not null default '',
      change_note text not null default '',
      changed_at timestamptz not null default now()
    )
  `;

  for (const stage of Object.keys(WORKER_STAGES)) {
    await sql`
      insert into worker_webhook_settings (stage, description, metadata)
      values (
        ${stage},
        ${WORKER_STAGES[stage].label},
        ${JSON.stringify({ envName: WORKER_STAGES[stage].envName })}::jsonb
      )
      on conflict (stage) do nothing
    `;
  }
}

function maskWebhookUrl(value) {
  const text = String(value || "").trim();
  if (!text) return "";
  try {
    const url = new URL(text);
    const parts = url.pathname.split("/").filter(Boolean);
    const last = parts.pop() || "";
    const maskedLast = last.length <= 6
      ? "****"
      : `${last.slice(0, 2)}****${last.slice(-4)}`;
    url.pathname = `/${[...parts, maskedLast].join("/")}`;
    url.search = "";
    url.hash = "";
    return url.toString();
  } catch {
    return text.length <= 10 ? "****" : `${text.slice(0, 6)}****${text.slice(-4)}`;
  }
}

function validateWebhookUrl(value) {
  const text = String(value || "").trim();
  if (!text) return { ok: true, url: "" };
  try {
    const parsed = new URL(text);
    if (parsed.protocol !== "http:" && parsed.protocol !== "https:") {
      return { ok: false, error: "Webhook URL must use http or https" };
    }
    if (isProductionRuntime() && !workerHostAllowed(parsed.hostname)) {
      return { ok: false, error: "Webhook URL host is not allowed" };
    }
    return { ok: true, url: parsed.toString() };
  } catch (error) {
    return { ok: false, error: `Webhook URL is invalid: ${error.message}` };
  }
}

function isProductionRuntime() {
  return process.env.VERCEL_ENV === "production" || process.env.NODE_ENV === "production";
}

function workerHostAllowed(hostname) {
  const allowlist = String(process.env.N8N_WORKER_WEBHOOK_ALLOWLIST || process.env.N8N_PROMO_UI_DESIGN_WEBHOOK_ALLOWLIST || "")
    .split(",")
    .map((item) => item.trim().toLowerCase())
    .filter(Boolean);
  if (!allowlist.length) return false;
  const host = String(hostname || "").toLowerCase();
  return allowlist.some((allowedHost) => host === allowedHost || host.endsWith(`.${allowedHost}`));
}

function toWorkerWebhookSetting(row, options = {}) {
  const webhookUrl = row.webhook_url || "";
  const envName = WORKER_STAGES[row.stage]?.envName || row.metadata?.envName || "";
  return {
    id: row.id,
    stage: row.stage,
    label: WORKER_STAGES[row.stage]?.label || row.stage,
    envName,
    webhookUrl: options.includeSecret ? webhookUrl : "",
    maskedWebhookUrl: maskWebhookUrl(webhookUrl),
    isConfigured: Boolean(webhookUrl),
    isActive: Boolean(row.is_active),
    timeoutMs: row.timeout_ms === null || row.timeout_ms === undefined ? null : Number(row.timeout_ms),
    description: row.description || "",
    changeNote: row.change_note || "",
    createdAt: row.created_at || null,
    updatedAt: row.updated_at || null,
  };
}

function normalizeTimeoutMs(value) {
  if (value === null || value === undefined || value === "") return null;
  const number = Number(value);
  if (!Number.isFinite(number)) return null;
  return Math.max(500, Math.min(Math.round(number), 30000));
}

module.exports = {
  WORKER_STAGES,
  ensureWorkerWebhookSettings,
  getSql,
  maskWebhookUrl,
  normalizeTimeoutMs,
  toWorkerWebhookSetting,
  validateWebhookUrl,
  workerHostAllowed,
};
