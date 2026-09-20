const { parseBody } = require("./_wizard-form-templates-store");
const { resolveBuilderOwner } = require("./_promo-builder-auth");
const { requireBuilderFlag } = require("./_promo-builder-flags");
const {
  getSql, getOwnedConfig, validateConfig, recordConnectionCheck,
} = require("./_directus-connection-config-store");

function secretFromRef(secretRef, env = process.env) {
  const name = String(secretRef || "").replace(/^env:/, "");
  if (!/^DIRECTUS_SECRET_[A-Z0-9_]+$/.test(name)) return "";
  return String(env[name] || "");
}

async function fetchDirectus(url, { token, timeoutMs }) {
  const response = await fetch(url, {
    headers: { accept: "application/json", ...(token ? { authorization: `Bearer ${token}` } : {}) },
    redirect: "error",
    signal: AbortSignal.timeout(timeoutMs),
  });
  if (!response.ok) throw Object.assign(new Error(`Directus responded with ${response.status}`), { code: `DIRECTUS_HTTP_${response.status}` });
  const text = await response.text();
  if (text.length > 256_000) throw Object.assign(new Error("Directus response is too large"), { code: "DIRECTUS_RESPONSE_TOO_LARGE" });
  return text ? JSON.parse(text) : {};
}

async function fetchDirectusWithRetry(url, options) {
  let lastError;
  for (let attempt = 0; attempt <= options.retryCount; attempt += 1) {
    try {
      return await fetchDirectus(url, options);
    } catch (error) {
      lastError = error;
      if (attempt < options.retryCount) await new Promise((resolve) => setTimeout(resolve, Math.min(500, 100 * (2 ** attempt))));
    }
  }
  throw lastError;
}

module.exports = async function handler(req, res) {
  const startedAt = Date.now();
  let configId = "";
  let ownerSubject = "";
  let sql;
  try {
    requireBuilderFlag("directusIntegration");
    requireBuilderFlag("directusConnectionTunnel");
    if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });
    const owner = resolveBuilderOwner(req, res, { issue: true });
    ownerSubject = owner.ownerSubject;
    const body = parseBody(req.body);
    configId = String(body.id || "").trim();
    sql = getSql();
    const stored = await getOwnedConfig(sql, configId, ownerSubject);
    if (!stored) return res.status(404).json({ error: "Directus config not found" });
    const validation = validateConfig(stored.config);
    if (!validation.ok) return res.status(422).json({ error: "Directus config validation failed", validation });
    const token = secretFromRef(validation.config.secretRef);
    if (validation.config.verifyAuthentication && !token) {
      throw Object.assign(new Error("설정된 secretRef에 해당하는 서버 비밀키가 없습니다."), { code: "DIRECTUS_SECRET_NOT_CONFIGURED" });
    }
    const requestOptions = { token, timeoutMs: validation.config.timeoutMs, retryCount: validation.config.retryCount };
    const health = await fetchDirectusWithRetry(`${validation.config.baseUrl}/server/health`, requestOptions);
    if (!["ok", "warn"].includes(String(health.status || "").toLowerCase())) {
      throw Object.assign(new Error(`Directus health is ${health.status || "unknown"}`), { code: "DIRECTUS_UNHEALTHY" });
    }
    let authVerified = false;
    if (validation.config.verifyAuthentication) {
      await fetchDirectusWithRetry(`${validation.config.baseUrl}/users/me?fields=id`, requestOptions);
      authVerified = true;
    }
    const result = { status: "passed", healthStatus: String(health.status || "unknown"), authVerified, durationMs: Date.now() - startedAt };
    await recordConnectionCheck(sql, { configId, ownerSubject, ...result });
    return res.status(200).json({ ok: true, result });
  } catch (error) {
    const result = {
      status: "failed",
      durationMs: Date.now() - startedAt,
      errorCode: error.code || error.name || "DIRECTUS_CONNECTION_FAILED",
      errorMessage: error.message || "Directus connection failed",
    };
    if (sql && configId && ownerSubject) await recordConnectionCheck(sql, { configId, ownerSubject, ...result }).catch(() => {});
    return res.status(error.statusCode || 502).json({ error: result.errorMessage, code: result.errorCode, result });
  }
};

module.exports.fetchDirectus = fetchDirectus;
module.exports.fetchDirectusWithRetry = fetchDirectusWithRetry;
module.exports.secretFromRef = secretFromRef;
