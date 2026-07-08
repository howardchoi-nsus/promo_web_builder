const WORKER_URL_ENV = {
  integrated_brief: "N8N_INTEGRATED_BRIEF_WORKER_URL",
  lofi_draft: "N8N_LOFI_DRAFT_WORKER_URL",
  final_design: "N8N_FINAL_DESIGN_WORKER_URL",
};

const DEFAULT_TRIGGER_ACK_TIMEOUT_MS = 2000;
const MIN_TRIGGER_ACK_TIMEOUT_MS = 500;
const MAX_TRIGGER_ACK_TIMEOUT_MS = 5000;

function shouldTriggerWorker(body) {
  return body.triggerWorker === true
    || body.trigger_worker === true
    || String(body.triggerWorker || body.trigger_worker || "").toLowerCase() === "true";
}

function buildWorkerPayload({ run, stage, taskId = "", extra = {} }) {
  return {
    runId: run.id,
    runKey: run.run_key,
    stage,
    taskId,
    ...extra,
  };
}

function resolveWorkerUrl(stage, overrideUrl = "") {
  const envUrl = String(process.env[WORKER_URL_ENV[stage]] || "").trim();
  const bodyUrl = String(overrideUrl || "").trim();
  const selectedUrl = envUrl || bodyUrl;
  if (!selectedUrl) {
    return {
      ok: false,
      error: "Worker URL is not configured",
      envName: WORKER_URL_ENV[stage] || "",
    };
  }

  try {
    const parsed = new URL(selectedUrl);
    if (parsed.protocol !== "http:" && parsed.protocol !== "https:") {
      return {
        ok: false,
        error: "Worker URL must use http or https",
        envName: WORKER_URL_ENV[stage] || "",
      };
    }
    if (!envUrl && bodyUrl && isProductionRuntime() && !workerHostAllowed(parsed.hostname)) {
      return {
        ok: false,
        error: "Worker URL host is not allowed",
        envName: WORKER_URL_ENV[stage] || "",
      };
    }
    return { ok: true, url: parsed.toString(), envName: WORKER_URL_ENV[stage] || "" };
  } catch (error) {
    return {
      ok: false,
      error: `Worker URL is invalid: ${error.message}`,
      envName: WORKER_URL_ENV[stage] || "",
    };
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

function triggerAckTimeoutMs(value) {
  const envValue = Number(process.env.N8N_WORKER_TRIGGER_ACK_TIMEOUT_MS || 0);
  const requestedValue = Number(value || 0);
  const selected = requestedValue || envValue || DEFAULT_TRIGGER_ACK_TIMEOUT_MS;
  if (!Number.isFinite(selected)) return DEFAULT_TRIGGER_ACK_TIMEOUT_MS;
  return Math.max(MIN_TRIGGER_ACK_TIMEOUT_MS, Math.min(selected, MAX_TRIGGER_ACK_TIMEOUT_MS));
}

async function triggerWorker({ stage, payload, workerUrl = "", timeoutMs = null }) {
  const resolved = resolveWorkerUrl(stage, workerUrl);
  if (!resolved.ok) {
    return {
      ok: false,
      stage,
      error: resolved.error,
      envName: resolved.envName,
    };
  }

  const ackTimeoutMs = triggerAckTimeoutMs(timeoutMs);
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), ackTimeoutMs);
  try {
    const response = await fetch(resolved.url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      signal: controller.signal,
    });
    const contentType = response.headers.get("content-type") || "";
    const responseBody = contentType.includes("application/json")
      ? await response.json().catch(() => ({}))
      : { text: await response.text().catch(() => "") };
    return {
      ok: response.ok,
      stage,
      status: response.status,
      payload,
      response: responseBody,
      ackTimeoutMs,
      urlConfigured: true,
    };
  } catch (error) {
    return {
      ok: false,
      stage,
      error: error.name === "AbortError"
        ? `Worker trigger acknowledgement timed out after ${ackTimeoutMs}ms`
        : error.message,
      payload,
      ackTimeoutMs,
      urlConfigured: true,
    };
  } finally {
    clearTimeout(timeout);
  }
}

module.exports = {
  buildWorkerPayload,
  shouldTriggerWorker,
  triggerWorker,
  triggerAckTimeoutMs,
};
