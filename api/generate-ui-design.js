import { createRequire } from "node:module";
import crypto from "node:crypto";

const require = createRequire(import.meta.url);
const {
  ensureWorkerWebhookSettings,
  getSql,
} = require("./_worker-webhook-settings-store");
const {
  createAssetWriteAuth,
} = require("./_promo-design-asset-auth");

export const config = {
  maxDuration: 300,
};

// Legacy UI-design generation proxy. Newer multi-stage generation uses worker
// stage APIs, but this route remains for the builder's direct Promo UI Design flow.
export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method not allowed" });
  }

  const webhookResolution = await resolveWebhookUrl(req.headers["x-n8n-webhook-url"]);
  if (!webhookResolution.ok) {
    return res.status(400).json({
      error: webhookResolution.error,
      message: webhookResolution.message,
    });
  }

  try {
    const requestBody = parseRequestBody(req.body);
    requestBody.id = String(requestBody.id || crypto.randomUUID()).trim();
    const assetWriteAuth = createAssetWriteAuth(requestBody.id);
    if (!assetWriteAuth) {
      return res.status(503).json({
        error: "Promo design asset write authentication is not configured",
        code: "ASSET_WRITE_AUTH_NOT_CONFIGURED",
      });
    }
    requestBody.sectionConfig = {
      ...(requestBody.sectionConfig && typeof requestBody.sectionConfig === "object"
        ? requestBody.sectionConfig
        : {}),
      assetWriteAuth,
    };
    const proto = req.headers["x-forwarded-proto"] || "https";
    const host = req.headers["x-forwarded-host"] || req.headers.host;
    const promptUrl = String(requestBody.promptUrl || "").trim();
    const isPublicPromptUrl = /^https?:\/\//i.test(promptUrl)
      && !/^https?:\/\/(localhost|127\.0\.0\.1|\[::1\])/i.test(promptUrl);

    // n8n runs outside the browser, so localhost prompt URLs from local/prototype
    // payloads are replaced with this deployment's public prompt endpoint.
    if ((!promptUrl || !isPublicPromptUrl) && host) {
      requestBody.promptUrl = `${proto}://${host}/api/prompts/promo-ui-design-image-generation`;
    }

    const response = await fetch(webhookResolution.url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestBody),
    });

    const contentType = response.headers.get("content-type") || "";
    const responseBody = contentType.includes("application/json") ? await response.json() : { text: await response.text() };
    return res.status(response.status).json(responseBody);
  } catch (error) {
    return res.status(502).json({
      error: "n8n UI design request failed",
      message: error.message,
    });
  }
}

function parseRequestBody(body) {
  if (!body) return {};
  if (typeof body === "string") {
    try {
      return JSON.parse(body);
    } catch {
      return {};
    }
  }
  if (typeof body === "object" && !Array.isArray(body)) return { ...body };
  return {};
}

async function resolveWebhookUrl(headerValue) {
  const configured = await loadConfiguredPromoUiWebhookUrl();
  const envUrl = configured.url || String(process.env.N8N_PROMO_UI_DESIGN_WEBHOOK_URL || "").trim();
  const headerUrl = String(headerValue || "").trim();
  // Admin Page settings are the operational source of truth; the request header is
  // retained only as a local/dev fallback for older builder flows.
  const selectedUrl = envUrl || headerUrl;
  if (!selectedUrl) {
    return {
      ok: false,
      error: "Missing n8n UI design webhook URL",
      message: "Set Promo UI Design Webhook in Admin Page or configure N8N_PROMO_UI_DESIGN_WEBHOOK_URL.",
    };
  }

  const parsed = parseWebhookUrl(selectedUrl);
  if (!parsed) {
    return {
      ok: false,
      error: "Invalid n8n UI design webhook URL",
      message: "Webhook URL must be a valid http or https URL.",
    };
  }

  // 운영 배포에서는 임의 헤더 URL이 SSRF 경로가 될 수 있어 환경변수나 allowlist로만 허용한다.
  const fromHeader = !envUrl && Boolean(headerUrl);
  if (fromHeader && isProductionRuntime() && !webhookHostAllowed(parsed.hostname)) {
    return {
      ok: false,
      error: "n8n UI design webhook URL is not allowed",
      message: "Use Admin Page settings, N8N_PROMO_UI_DESIGN_WEBHOOK_URL, or add the webhook host to N8N_PROMO_UI_DESIGN_WEBHOOK_ALLOWLIST.",
    };
  }

  return { ok: true, url: parsed.toString(), source: configured.url ? "settings" : envUrl ? "env" : "request" };
}

async function loadConfiguredPromoUiWebhookUrl() {
  try {
    const sql = getSql();
    await ensureWorkerWebhookSettings(sql);
    const rows = await sql`
      select webhook_url
      from worker_webhook_settings
      where stage = 'promo_ui_design'
        and is_active = true
        and webhook_url <> ''
      limit 1
    `;
    return { url: String(rows[0]?.webhook_url || "").trim() };
  } catch {
    return { url: "" };
  }
}

function parseWebhookUrl(value) {
  try {
    const url = new URL(value);
    if (url.protocol !== "http:" && url.protocol !== "https:") return null;
    return url;
  } catch {
    return null;
  }
}

function isProductionRuntime() {
  return process.env.VERCEL_ENV === "production" || process.env.NODE_ENV === "production";
}

function webhookHostAllowed(hostname) {
  const allowlist = String(process.env.N8N_PROMO_UI_DESIGN_WEBHOOK_ALLOWLIST || "")
    .split(",")
    .map((item) => item.trim().toLowerCase())
    .filter(Boolean);
  if (!allowlist.length) return false;
  const host = String(hostname || "").toLowerCase();
  return allowlist.some((allowedHost) => host === allowedHost || host.endsWith(`.${allowedHost}`));
}
