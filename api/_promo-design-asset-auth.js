const crypto = require("node:crypto");

const MAX_SIGNATURE_AGE_MS = 10 * 60 * 1000;

function assetWriteSecret() {
  const value = String(process.env.PROMO_DESIGN_ASSET_WRITE_TOKEN || "").trim();
  return value.length >= 32 ? value : "";
}

function createAssetWriteAuth(runKey, now = Date.now()) {
  const secret = assetWriteSecret();
  if (!secret) return null;
  const timestamp = String(Math.trunc(now));
  return {
    timestamp,
    signature: sign(runKey, timestamp, secret),
  };
}

function verifyAssetWriteRequest(req, body, now = Date.now()) {
  const secret = assetWriteSecret();
  if (!secret) {
    return {
      ok: false,
      status: 503,
      error: "Promo design asset write authentication is not configured",
      code: "ASSET_WRITE_AUTH_NOT_CONFIGURED",
    };
  }

  const bearer = bearerToken(req?.headers?.authorization);
  if (bearer && safeEqual(bearer, secret)) return { ok: true, mode: "bearer" };

  const runKey = String(body?.runKey || body?.id || body?.payload?.id || "").trim();
  const auth = body?.assetWriteAuth
    || body?.asset_write_auth
    || body?.payload?.assetWriteAuth
    || body?.payload?.sectionConfig?.assetWriteAuth
    || null;
  const timestamp = String(auth?.timestamp || "").trim();
  const signature = String(auth?.signature || "").trim();
  const timestampMs = Number(timestamp);

  if (
    !runKey
    || !timestamp
    || !signature
    || !Number.isFinite(timestampMs)
    || Math.abs(now - timestampMs) > MAX_SIGNATURE_AGE_MS
  ) {
    return {
      ok: false,
      status: 401,
      error: "Missing or expired promo design asset write credentials",
      code: "ASSET_WRITE_AUTH_REQUIRED",
    };
  }

  const expected = sign(runKey, timestamp, secret);
  if (!safeEqual(signature, expected)) {
    return {
      ok: false,
      status: 401,
      error: "Invalid promo design asset write credentials",
      code: "ASSET_WRITE_AUTH_INVALID",
    };
  }

  return { ok: true, mode: "signed-run" };
}

function stripAssetWriteAuth(payload) {
  if (!payload || typeof payload !== "object" || Array.isArray(payload)) return payload || {};
  const sanitized = { ...payload };
  delete sanitized.assetWriteAuth;
  delete sanitized.asset_write_auth;
  if (sanitized.sectionConfig && typeof sanitized.sectionConfig === "object" && !Array.isArray(sanitized.sectionConfig)) {
    sanitized.sectionConfig = { ...sanitized.sectionConfig };
    delete sanitized.sectionConfig.assetWriteAuth;
    delete sanitized.sectionConfig.asset_write_auth;
  }
  return sanitized;
}

function sign(runKey, timestamp, secret) {
  return crypto
    .createHmac("sha256", secret)
    .update(`${String(runKey || "").trim()}\n${timestamp}`)
    .digest("hex");
}

function bearerToken(value) {
  const match = /^Bearer\s+(.+)$/i.exec(String(value || "").trim());
  return match ? match[1].trim() : "";
}

function safeEqual(left, right) {
  const leftBytes = Buffer.from(String(left || ""));
  const rightBytes = Buffer.from(String(right || ""));
  return leftBytes.length === rightBytes.length && crypto.timingSafeEqual(leftBytes, rightBytes);
}

module.exports = {
  MAX_SIGNATURE_AGE_MS,
  createAssetWriteAuth,
  stripAssetWriteAuth,
  verifyAssetWriteRequest,
};
