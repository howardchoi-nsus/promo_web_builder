const { timingSafeEqual } = require("node:crypto");

function hosted(env = process.env) {
  return Boolean(env.VERCEL)
    || ["preview", "production"].includes(String(env.VERCEL_ENV || env.NODE_ENV || "").toLowerCase());
}

function configuredToken(env = process.env) {
  const token = String(env.PROMPT_RUNTIME_SERVICE_TOKEN || "").trim();
  return token.length >= 32 ? token : "";
}

function localAccessEnabled(env = process.env) {
  return !hosted(env)
    && ["true", "1", "on", "enabled"].includes(
      String(env.PROMPT_RUNTIME_LOCAL_ACCESS_ENABLED || "").trim().toLowerCase(),
    );
}

function suppliedToken(req) {
  const authorization = String(req?.headers?.authorization || "").trim();
  const bearer = /^Bearer\s+(.+)$/i.exec(authorization)?.[1] || "";
  return String(bearer || req?.headers?.["x-promo-prompt-token"] || "").trim();
}

function safeEqual(left, right) {
  const leftBytes = Buffer.from(String(left || ""));
  const rightBytes = Buffer.from(String(right || ""));
  return leftBytes.length === rightBytes.length && timingSafeEqual(leftBytes, rightBytes);
}

function requirePromptRuntimeService(req, { env = process.env } = {}) {
  const rawToken = String(env.PROMPT_RUNTIME_SERVICE_TOKEN || "").trim();
  const expected = configuredToken(env);
  if (!expected) {
    if (!rawToken && localAccessEnabled(env)) {
      return { authenticated: false, localOnly: true, subject: "local:prompt-runtime" };
    }
    throw Object.assign(new Error("Prompt runtime service authentication is not configured"), {
      statusCode: 503,
      code: "PROMPT_RUNTIME_AUTH_NOT_CONFIGURED",
    });
  }
  if (!safeEqual(suppliedToken(req), expected)) {
    throw Object.assign(new Error("A valid prompt runtime service token is required"), {
      statusCode: 403,
      code: "PROMPT_RUNTIME_AUTH_REQUIRED",
    });
  }
  return { authenticated: true, localOnly: false, subject: "service:prompt-runtime" };
}

module.exports = {
  configuredToken,
  localAccessEnabled,
  requirePromptRuntimeService,
  suppliedToken,
};
