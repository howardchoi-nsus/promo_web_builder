const { timingSafeEqual } = require("node:crypto");

const MAX_PAYLOAD_BYTES = 160_000;
const LIVE_TIMEOUT_MS = 285_000;

function text(value) {
  return String(value || "").trim();
}

function isHosted(env = process.env) {
  return Boolean(env.VERCEL)
    || ["preview", "production"].includes(text(env.VERCEL_ENV || env.NODE_ENV).toLowerCase());
}

function validWebhookUrl(value, env = process.env) {
  try {
    const url = new URL(text(value));
    if (url.protocol === "https:") return url.toString();
    if (!isHosted(env) && url.protocol === "http:" && ["localhost", "127.0.0.1"].includes(url.hostname)) {
      return url.toString();
    }
  } catch {
    // Invalid URLs are reported as an unconfigured workflow.
  }
  return "";
}

function secureValue(value) {
  const normalized = text(value);
  return normalized.length >= 32 ? normalized : "";
}

function safeEqual(left, right) {
  const leftBytes = Buffer.from(String(left || ""));
  const rightBytes = Buffer.from(String(right || ""));
  return leftBytes.length === rightBytes.length && timingSafeEqual(leftBytes, rightBytes);
}

function generationConfig(env = process.env) {
  const webhookUrl = validWebhookUrl(env.N8N_PROMO_WEBHOOK_URL, env);
  const webhookToken = secureValue(env.PROMO_PAGE_GENERATION_WEBHOOK_TOKEN);
  const consoleToken = secureValue(env.PROMO_PAGE_TEST_CONSOLE_TOKEN);
  return {
    webhookUrl,
    webhookToken,
    consoleToken,
    workflowConfigured: Boolean(webhookUrl && webhookToken),
    accessConfigured: Boolean(consoleToken),
    liveConfigured: Boolean(webhookUrl && webhookToken && consoleToken),
  };
}

function generationReadiness(env = process.env) {
  const config = generationConfig(env);
  const workflowState = config.workflowConfigured ? "configured" : "missing";
  const downstreamState = config.workflowConfigured ? "unverified" : "blocked";
  return {
    state: config.liveConfigured ? "configured" : "fixture_only",
    liveConfigured: config.liveConfigured,
    verification: "configured_only",
    checks: [
      {
        key: "access",
        label: "실제 테스트 접근",
        state: config.accessConfigured ? "configured" : "missing",
        message: config.accessConfigured
          ? "보호된 실행 키가 설정되어 있습니다."
          : "실제 AI 실행은 아직 잠겨 있습니다.",
        code: config.accessConfigured ? "ACCESS_CONFIGURED" : "QUALITY_TEST_ACCESS_NOT_CONFIGURED",
      },
      {
        key: "workflow",
        label: "생성 워크플로",
        state: workflowState,
        message: config.workflowConfigured
          ? "고정된 생성 서버와 서버 토큰이 연결되어 있습니다."
          : "n8n 생성 워크플로 연결이 필요합니다.",
        code: config.workflowConfigured ? "WORKFLOW_CONFIGURED" : "N8N_WORKFLOW_NOT_DEPLOYED",
      },
      {
        key: "browser_quality",
        label: "Desktop · Mobile 품질 검사",
        state: downstreamState,
        message: config.workflowConfigured
          ? "첫 실제 실행에서 내부 브라우저 검사를 확인합니다."
          : "생성 워크플로가 연결된 뒤 확인할 수 있습니다.",
        code: config.workflowConfigured ? "BROWSER_GATE_UNVERIFIED" : "BROWSER_GATE_BLOCKED",
      },
      {
        key: "artifact",
        label: "검증 결과 저장",
        state: downstreamState,
        message: config.workflowConfigured
          ? "첫 실제 실행에서 서명 결과 저장을 확인합니다."
          : "생성 워크플로가 연결된 뒤 확인할 수 있습니다.",
        code: config.workflowConfigured ? "ARTIFACT_STORE_UNVERIFIED" : "ARTIFACT_STORE_BLOCKED",
      },
    ],
  };
}

function requestHeader(req, name) {
  const target = String(name || "").toLowerCase();
  const headers = req?.headers || {};
  return text(headers[target] ?? headers[name]);
}

function assertSameOrigin(req) {
  const origin = requestHeader(req, "origin");
  if (!origin) return;
  const host = requestHeader(req, "x-forwarded-host") || requestHeader(req, "host");
  if (!host) return;
  const protocol = requestHeader(req, "x-forwarded-proto") || (host.startsWith("localhost") ? "http" : "https");
  let supplied;
  try {
    supplied = new URL(origin);
  } catch {
    supplied = null;
  }
  if (!supplied || supplied.origin !== `${protocol}://${host}`) {
    throw Object.assign(new Error("Quality test requests must come from the same site"), {
      statusCode: 403,
      code: "QUALITY_TEST_ORIGIN_REQUIRED",
    });
  }
}

function requireConsoleAccess(req, { env = process.env } = {}) {
  assertSameOrigin(req);
  const expected = generationConfig(env).consoleToken;
  if (!expected) {
    throw Object.assign(new Error("Live quality test access is not configured"), {
      statusCode: 503,
      code: "QUALITY_TEST_ACCESS_NOT_CONFIGURED",
    });
  }
  const supplied = requestHeader(req, "x-promo-quality-test-token");
  if (!safeEqual(supplied, expected)) {
    throw Object.assign(new Error("A valid quality test access key is required"), {
      statusCode: 403,
      code: "QUALITY_TEST_ACCESS_REQUIRED",
    });
  }
  return { authenticated: true, subject: "quality-test-console" };
}

async function parseUpstreamBody(response) {
  const contentType = text(response?.headers?.get?.("content-type"));
  if (contentType.includes("application/json")) return response.json();
  const raw = await response.text();
  return raw ? { message: raw.slice(0, 1_000) } : {};
}

async function forwardPromoPageGeneration(payload, {
  env = process.env,
  fetchImpl = globalThis.fetch,
  timeoutMs = LIVE_TIMEOUT_MS,
} = {}) {
  const config = generationConfig(env);
  if (!config.workflowConfigured) {
    throw Object.assign(new Error("The promo page generation workflow is not configured"), {
      statusCode: 503,
      code: "N8N_WORKFLOW_NOT_DEPLOYED",
    });
  }
  if (typeof fetchImpl !== "function") {
    throw Object.assign(new Error("Server fetch is unavailable"), {
      statusCode: 503,
      code: "GENERATION_TRANSPORT_UNAVAILABLE",
    });
  }
  const body = JSON.stringify(payload || {});
  if (Buffer.byteLength(body, "utf8") > MAX_PAYLOAD_BYTES) {
    throw Object.assign(new Error("The generation request is too large"), {
      statusCode: 413,
      code: "GENERATION_PAYLOAD_TOO_LARGE",
    });
  }

  let response;
  try {
    response = await fetchImpl(config.webhookUrl, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        "x-promo-generation-token": config.webhookToken,
      },
      body,
      signal: AbortSignal.timeout(Math.max(1_000, Number(timeoutMs || LIVE_TIMEOUT_MS))),
    });
  } catch (error) {
    throw Object.assign(new Error(error?.name === "TimeoutError"
      ? "The generation workflow timed out"
      : "The generation workflow could not be reached"), {
      statusCode: 502,
      code: error?.name === "TimeoutError" ? "GENERATION_WORKFLOW_TIMEOUT" : "GENERATION_WORKFLOW_UNAVAILABLE",
    });
  }
  return {
    ok: Boolean(response.ok),
    status: Number(response.status || 502),
    body: await parseUpstreamBody(response),
  };
}

module.exports = {
  LIVE_TIMEOUT_MS,
  assertSameOrigin,
  forwardPromoPageGeneration,
  generationConfig,
  generationReadiness,
  requireConsoleAccess,
};
