const { createHmac, timingSafeEqual } = require("node:crypto");

const DEFAULT_TTL_SECONDS = 15 * 60;

function previewSecret(env = process.env) {
  const configured = String(env.PROMO_PREVIEW_TOKEN_SECRET || "").trim();
  if (configured.length >= 32) return configured;
  const hosted = Boolean(env.VERCEL)
    || ["production", "preview"].includes(String(env.VERCEL_ENV || env.NODE_ENV || "").toLowerCase());
  if (hosted) {
    const error = new Error("PROMO_PREVIEW_TOKEN_SECRET must be at least 32 characters");
    error.statusCode = 503;
    error.code = "PROMO_PREVIEW_TOKEN_SECRET_REQUIRED";
    throw error;
  }
  return "local-promo-preview-token-secret-only";
}

function signature(payload, env) {
  return createHmac("sha256", previewSecret(env)).update(payload).digest("base64url");
}

function createPreviewToken({ publicationId, revision, now = Date.now(), ttlSeconds = DEFAULT_TTL_SECONDS }, env) {
  const expiresAt = now + Math.min(3_600, Math.max(60, Number(ttlSeconds || DEFAULT_TTL_SECONDS))) * 1_000;
  const payload = `v1.${publicationId}.${Number(revision)}.${expiresAt}`;
  return { token: `${payload}.${signature(payload, env)}`, expiresAt };
}

function verifyPreviewToken(token, { now = Date.now(), env = process.env } = {}) {
  const parts = String(token || "").split(".");
  if (parts.length !== 5 || parts[0] !== "v1") return null;
  const payload = parts.slice(0, 4).join(".");
  const expected = Buffer.from(signature(payload, env));
  const supplied = Buffer.from(parts[4]);
  if (expected.length !== supplied.length || !timingSafeEqual(expected, supplied)) return null;
  const revision = Number(parts[2]);
  const expiresAt = Number(parts[3]);
  if (!parts[1] || !Number.isInteger(revision) || revision < 1 || !Number.isFinite(expiresAt) || expiresAt <= now) return null;
  return { publicationId: parts[1], revision, expiresAt };
}

module.exports = {
  DEFAULT_TTL_SECONDS,
  createPreviewToken,
  previewSecret,
  verifyPreviewToken,
};
