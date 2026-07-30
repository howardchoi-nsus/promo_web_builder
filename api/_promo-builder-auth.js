const { createHash, createHmac, randomBytes, timingSafeEqual } = require("node:crypto");

const COOKIE_NAME = "promo_builder_session";
const SESSION_MAX_AGE_SECONDS = 60 * 60 * 24 * 7;

function secret() {
  const configured = String(process.env.PROMO_BUILDER_SESSION_SECRET || "").trim();
  if (configured.length >= 32) return configured;
  const hosted = Boolean(process.env.VERCEL)
    || ["production", "preview"].includes(String(process.env.VERCEL_ENV || "").toLowerCase());
  if (hosted) {
    const error = new Error("PROMO_BUILDER_SESSION_SECRET must be at least 32 characters");
    error.statusCode = 503;
    error.code = "BUILDER_SESSION_SECRET_REQUIRED";
    throw error;
  }
  return "local-promo-builder-session-secret-only";
}

function parseCookies(header = "") {
  return Object.fromEntries(String(header || "").split(";").map((part) => {
    const index = part.indexOf("=");
    if (index < 0) return ["", ""];
    return [
      decodeURIComponent(part.slice(0, index).trim()),
      decodeURIComponent(part.slice(index + 1).trim()),
    ];
  }).filter(([key]) => key));
}

function sign(value) {
  return createHmac("sha256", secret()).update(value).digest("base64url");
}

function createSessionToken(now = Date.now()) {
  const sessionId = randomBytes(32).toString("base64url");
  const expiresAt = now + SESSION_MAX_AGE_SECONDS * 1000;
  const payload = `v1.${sessionId}.${expiresAt}`;
  return { token: `${payload}.${sign(payload)}`, sessionId, expiresAt };
}

function verifySessionToken(token, now = Date.now()) {
  const parts = String(token || "").split(".");
  if (parts.length !== 4 || parts[0] !== "v1") return null;
  const payload = parts.slice(0, 3).join(".");
  const expected = Buffer.from(sign(payload));
  const supplied = Buffer.from(parts[3]);
  if (expected.length !== supplied.length || !timingSafeEqual(expected, supplied)) return null;
  const expiresAt = Number(parts[2]);
  if (!Number.isFinite(expiresAt) || expiresAt <= now) return null;
  return { sessionId: parts[1], expiresAt };
}

function ownerSubjectForSession(sessionId) {
  return `anon:${createHash("sha256").update(`${sessionId}:${secret()}`).digest("hex")}`;
}

function cookieValue(token) {
  const secure = Boolean(process.env.VERCEL)
    || ["production", "preview"].includes(String(process.env.VERCEL_ENV || "").toLowerCase());
  return [
    `${COOKIE_NAME}=${encodeURIComponent(token)}`,
    "Path=/",
    `Max-Age=${SESSION_MAX_AGE_SECONDS}`,
    "HttpOnly",
    "SameSite=Lax",
    ...(secure ? ["Secure"] : []),
  ].join("; ");
}

function resolveBuilderOwner(req, res, { issue = false } = {}) {
  const cookies = parseCookies(req?.headers?.cookie || "");
  let session = verifySessionToken(cookies[COOKIE_NAME]);
  let issued = false;
  if (!session && issue) {
    const created = createSessionToken();
    session = { sessionId: created.sessionId, expiresAt: created.expiresAt };
    res.setHeader("Set-Cookie", cookieValue(created.token));
    issued = true;
  }
  if (!session) {
    const error = new Error("A valid Builder session is required");
    error.statusCode = 401;
    error.code = "BUILDER_SESSION_REQUIRED";
    throw error;
  }
  return {
    ownerSubject: ownerSubjectForSession(session.sessionId),
    authenticated: false,
    expiresAt: new Date(session.expiresAt).toISOString(),
    issued,
  };
}

module.exports = {
  COOKIE_NAME,
  createSessionToken,
  verifySessionToken,
  ownerSubjectForSession,
  resolveBuilderOwner,
};
