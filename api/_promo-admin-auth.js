const { createHmac, randomBytes, timingSafeEqual } = require("node:crypto");
const { resolveBuilderOwner } = require("./_promo-builder-auth");

const ADMIN_COOKIE_NAME = "promo_admin_session";
const ADMIN_SESSION_MAX_AGE_SECONDS = 60 * 60 * 8;

function hosted(env = process.env) {
  return Boolean(env.VERCEL)
    || ["preview", "production"].includes(String(env.VERCEL_ENV || env.NODE_ENV || "").toLowerCase());
}

function adminSecret(env = process.env) {
  const value = String(env.PROMO_ADMIN_SESSION_SECRET || "").trim();
  return value.length >= 32 ? value : "";
}

function adminAccessKey(env = process.env) {
  const value = String(env.PROMO_ADMIN_ACCESS_KEY || "").trim();
  return value.length >= 24 ? value : "";
}

function temporaryAdminAccessKey(env = process.env) {
  const value = String(env.PROMO_ADMIN_TEMP_ACCESS_KEY || "").trim();
  const expiresAt = Date.parse(String(env.PROMO_ADMIN_TEMP_ACCESS_KEY_EXPIRES_AT || ""));
  return value && Number.isFinite(expiresAt) ? { value, expiresAt } : null;
}

function parseCookies(header = "") {
  return Object.fromEntries(String(header).split(";").map((part) => {
    const index = part.indexOf("=");
    if (index < 0) return ["", ""];
    return [decodeURIComponent(part.slice(0, index).trim()), decodeURIComponent(part.slice(index + 1).trim())];
  }).filter(([key]) => key));
}

function sign(payload, env) {
  const secret = adminSecret(env);
  if (!secret) return "";
  return createHmac("sha256", secret).update(payload).digest("base64url");
}

function createAdminSessionToken({
  subject,
  roles = ["admin"],
  now = Date.now(),
  ttlSeconds = ADMIN_SESSION_MAX_AGE_SECONDS,
}, env = process.env) {
  if (!adminSecret(env)) throw Object.assign(new Error("PROMO_ADMIN_SESSION_SECRET must be at least 32 characters"), {
    statusCode: 503,
    code: "ADMIN_SESSION_SECRET_REQUIRED",
  });
  const claims = {
    purpose: "session",
    subject: String(subject || "").trim(),
    roles: Array.from(new Set(roles.map((role) => String(role).trim()).filter(Boolean))),
    expiresAt: now + Math.min(86_400, Math.max(1, Number(ttlSeconds || 3600))) * 1000,
  };
  if (!claims.subject) throw new TypeError("Admin subject is required");
  const payload = Buffer.from(JSON.stringify(claims)).toString("base64url");
  return `v1.${payload}.${sign(`v1.${payload}`, env)}`;
}

function createAdminRemoteLoginToken({
  subject,
  now = Date.now(),
  ttlSeconds = 15 * 60,
}, env = process.env) {
  if (!adminSecret(env)) throw Object.assign(new Error("PROMO_ADMIN_SESSION_SECRET must be at least 32 characters"), {
    statusCode: 503,
    code: "ADMIN_SESSION_SECRET_REQUIRED",
  });
  const claims = {
    purpose: "remote-login",
    subject: String(subject || "").trim(),
    nonce: randomBytes(16).toString("base64url"),
    expiresAt: now + Math.min(30 * 60, Math.max(60, Number(ttlSeconds || 900))) * 1000,
  };
  if (!claims.subject) throw new TypeError("Admin subject is required");
  const payload = Buffer.from(JSON.stringify(claims)).toString("base64url");
  return `v1.${payload}.${sign(`v1.${payload}`, env)}`;
}

function constantTimeStringEqual(value, expectedValue) {
  if (!expectedValue) return false;
  const expected = Buffer.from(String(expectedValue));
  const supplied = Buffer.from(String(value || "").trim());
  return expected.length === supplied.length && timingSafeEqual(expected, supplied);
}

function authenticateAdminAccessKey(value, env = process.env, { now = Date.now() } = {}) {
  if (constantTimeStringEqual(value, adminAccessKey(env))) return { method: "permanent" };
  const temporary = temporaryAdminAccessKey(env);
  if (temporary && temporary.expiresAt > now && constantTimeStringEqual(value, temporary.value)) {
    return { method: "temporary", expiresAt: temporary.expiresAt };
  }
  return null;
}

function verifyAdminAccessKey(value, env = process.env, options = {}) {
  return Boolean(authenticateAdminAccessKey(value, env, options));
}

function adminCookieValue(token, { env = process.env, maxAgeSeconds = ADMIN_SESSION_MAX_AGE_SECONDS } = {}) {
  return [
    `${ADMIN_COOKIE_NAME}=${encodeURIComponent(token)}`,
    "Path=/",
    `Max-Age=${Math.max(0, Number(maxAgeSeconds) || 0)}`,
    "HttpOnly",
    "SameSite=Strict",
    ...(hosted(env) ? ["Secure"] : []),
  ].join("; ");
}

function clearAdminCookie(env = process.env) {
  return adminCookieValue("", { env, maxAgeSeconds: 0 });
}

function verifiedClaims(token, { now = Date.now(), env = process.env } = {}) {
  if (!adminSecret(env)) return null;
  const parts = String(token || "").split(".");
  if (parts.length !== 3 || parts[0] !== "v1") return null;
  const expected = Buffer.from(sign(`${parts[0]}.${parts[1]}`, env));
  const supplied = Buffer.from(parts[2]);
  if (expected.length !== supplied.length || !timingSafeEqual(expected, supplied)) return null;
  let claims;
  try {
    claims = JSON.parse(Buffer.from(parts[1], "base64url").toString("utf8"));
  } catch {
    return null;
  }
  if (!claims?.subject) return null;
  if (!Number.isFinite(Number(claims.expiresAt)) || Number(claims.expiresAt) <= now) return null;
  return claims;
}

function verifyAdminSessionToken(token, options = {}) {
  const claims = verifiedClaims(token, options);
  if (!claims || claims.purpose !== "session" || !Array.isArray(claims.roles) || !claims.roles.includes("admin")) return null;
  return { subject: String(claims.subject), roles: claims.roles, expiresAt: Number(claims.expiresAt) };
}

function verifyAdminRemoteLoginToken(token, options = {}) {
  const claims = verifiedClaims(token, options);
  if (!claims || claims.purpose !== "remote-login" || !claims.nonce) return null;
  return { subject: String(claims.subject), expiresAt: Number(claims.expiresAt) };
}

function resolveAdminOwner(req, res, { env = process.env } = {}) {
  const token = parseCookies(req?.headers?.cookie || "")[ADMIN_COOKIE_NAME];
  const admin = verifyAdminSessionToken(token, { env });
  if (admin) {
    return {
      ownerSubject: `admin:${admin.subject}`,
      actorSubject: admin.subject,
      authenticated: true,
      roles: admin.roles,
      expiresAt: new Date(admin.expiresAt).toISOString(),
    };
  }
  const localAccess = !hosted(env)
    && !["false", "0", "off", "disabled"].includes(String(env.PROMO_ADMIN_LOCAL_ACCESS_ENABLED || "true").toLowerCase());
  if (localAccess) {
    const local = resolveBuilderOwner(req, res, { issue: true });
    return { ...local, actorSubject: local.ownerSubject, roles: ["local-admin"], localOnly: true };
  }
  throw Object.assign(new Error("An authenticated administrator session is required"), {
    statusCode: 403,
    code: adminSecret(env) ? "ADMIN_SESSION_REQUIRED" : "ADMIN_AUTH_NOT_CONFIGURED",
  });
}

module.exports = {
  ADMIN_COOKIE_NAME,
  ADMIN_SESSION_MAX_AGE_SECONDS,
  adminAccessKey,
  adminCookieValue,
  adminSecret,
  authenticateAdminAccessKey,
  clearAdminCookie,
  createAdminRemoteLoginToken,
  createAdminSessionToken,
  resolveAdminOwner,
  temporaryAdminAccessKey,
  verifyAdminAccessKey,
  verifyAdminRemoteLoginToken,
  verifyAdminSessionToken,
};
