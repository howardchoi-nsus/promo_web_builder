const { timingSafeEqual } = require("node:crypto");

function safeEqual(left, right) {
  const leftBytes = Buffer.from(String(left || ""));
  const rightBytes = Buffer.from(String(right || ""));
  return leftBytes.length === rightBytes.length && timingSafeEqual(leftBytes, rightBytes);
}

function isHosted(env = process.env) {
  return Boolean(env.VERCEL)
    || ["preview", "production"].includes(String(env.VERCEL_ENV || env.NODE_ENV || "").toLowerCase());
}

function suppliedToken(req) {
  const authorization = String(req?.headers?.authorization || "").trim();
  return /^Bearer\s+(.+)$/i.exec(authorization)?.[1]
    || String(req?.headers?.["x-promo-service-token"] || "").trim();
}

function requirePromoServiceV3(req, { env = process.env } = {}) {
  const expected = String(env.PROMO_SERVICE_V3_TOKEN || "").trim();
  if (expected.length < 32) {
    if (!isHosted(env) && ["1", "true", "on", "enabled"].includes(String(env.PROMO_SERVICE_V3_LOCAL_ACCESS_ENABLED || "").toLowerCase())) {
      return { subject: "local:promo-service-v3", authenticated: false, localOnly: true };
    }
    throw Object.assign(new Error("Promo service V3 authentication is not configured"), {
      statusCode: 503,
      code: "PROMO_SERVICE_V3_AUTH_NOT_CONFIGURED",
    });
  }
  if (!safeEqual(suppliedToken(req), expected)) {
    throw Object.assign(new Error("A valid Promo service V3 token is required"), {
      statusCode: 403,
      code: "PROMO_SERVICE_V3_AUTH_REQUIRED",
    });
  }
  return { subject: "service:promo-service-v3", authenticated: true, localOnly: false };
}

module.exports = { requirePromoServiceV3, suppliedToken };
