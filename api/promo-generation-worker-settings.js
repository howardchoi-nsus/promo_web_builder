const {
  WORKER_STAGES,
  ensureWorkerWebhookSettings,
  getSql,
  normalizeTimeoutMs,
  toWorkerWebhookSetting,
  validateWebhookUrl,
} = require("./_worker-webhook-settings-store");

module.exports = async function handler(req, res) {
  try {
    if (req.method === "GET") return await getSettings(req, res);
    if (req.method === "POST") return await saveSetting(req, res);

    res.setHeader("Allow", "GET, POST");
    return res.status(405).json({ error: "Method not allowed" });
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      error: "Worker webhook settings API failed",
      message: error.message,
    });
  }
};

async function getSettings(req, res) {
  const sql = getSql();
  await ensureWorkerWebhookSettings(sql);
  const rows = await sql`
    select
      id::text,
      stage,
      webhook_url,
      is_active,
      timeout_ms,
      description,
      change_note,
      metadata,
      created_at,
      updated_at
    from worker_webhook_settings
    order by case stage
      when 'integrated_brief' then 1
      when 'lofi_draft' then 2
      when 'final_design' then 3
      when 'promo_ui_design' then 4
      else 99
    end
  `;
  return res.status(200).json({
    ok: true,
    settings: rows.map((row) => toWorkerWebhookSetting(row)),
  });
}

async function saveSetting(req, res) {
  const body = parseBody(req.body);
  const stage = String(body.stage || "").trim();
  if (!WORKER_STAGES[stage]) return res.status(400).json({ error: "Unsupported worker stage" });

  const preserveExistingWebhook = body.preserveExistingWebhook === true
    || body.preserve_existing_webhook === true
    || String(body.preserveExistingWebhook ?? body.preserve_existing_webhook ?? "").toLowerCase() === "true";
  const webhookUrlInput = String(body.webhookUrl ?? body.webhook_url ?? "").trim();
  const isActive = body.isActive === true
    || body.is_active === true
    || String(body.isActive ?? body.is_active ?? "").toLowerCase() === "true";
  const timeoutMs = normalizeTimeoutMs(body.timeoutMs ?? body.timeout_ms);
  const description = String(body.description || "").trim();
  const changeNote = String(body.changeNote || body.change_note || "Worker webhook setting updated.").trim();

  const sql = getSql();
  await ensureWorkerWebhookSettings(sql);
  const currentRows = await sql`
    select
      id::text,
      stage,
      webhook_url,
      is_active,
      timeout_ms,
      description,
      change_note,
      metadata,
      created_at,
      updated_at
    from worker_webhook_settings
    where stage = ${stage}
    limit 1
  `;
  const current = currentRows[0] || {};
  const nextWebhookUrl = preserveExistingWebhook && !webhookUrlInput
    ? String(current.webhook_url || "").trim()
    : webhookUrlInput;
  const validation = validateWebhookUrl(nextWebhookUrl);
  if (!validation.ok) return res.status(400).json({ error: validation.error });

  const updatedRows = await sql`
    insert into worker_webhook_settings (
      stage,
      webhook_url,
      is_active,
      timeout_ms,
      description,
      change_note,
      metadata,
      updated_at
    )
    values (
      ${stage},
      ${validation.url},
      ${isActive},
      ${timeoutMs},
      ${description},
      ${changeNote},
      ${JSON.stringify({ envName: WORKER_STAGES[stage].envName })}::jsonb,
      now()
    )
    on conflict (stage) do update
    set
      webhook_url = excluded.webhook_url,
      is_active = excluded.is_active,
      timeout_ms = excluded.timeout_ms,
      description = excluded.description,
      change_note = excluded.change_note,
      metadata = excluded.metadata,
      updated_at = now()
    returning
      id::text,
      stage,
      webhook_url,
      is_active,
      timeout_ms,
      description,
      change_note,
      metadata,
      created_at,
      updated_at
  `;

  await sql`
    insert into worker_webhook_setting_histories (
      setting_id,
      stage,
      previous_webhook_url,
      new_webhook_url,
      previous_is_active,
      new_is_active,
      previous_timeout_ms,
      new_timeout_ms,
      previous_description,
      new_description,
      change_note
    )
    values (
      ${updatedRows[0].id}::uuid,
      ${stage},
      ${current.webhook_url || ""},
      ${validation.url},
      ${Boolean(current.is_active)},
      ${isActive},
      ${current.timeout_ms ?? null},
      ${timeoutMs},
      ${current.description || ""},
      ${description},
      ${changeNote}
    )
  `;

  return res.status(200).json({
    ok: true,
    setting: toWorkerWebhookSetting(updatedRows[0]),
  });
}

function parseBody(body) {
  if (!body) return {};
  if (typeof body === "string") {
    try {
      return JSON.parse(body);
    } catch {
      return {};
    }
  }
  if (typeof body === "object" && !Array.isArray(body)) return body;
  return {};
}
