import assert from "node:assert/strict";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const {
  ADMIN_COOKIE_NAME,
  adminCookieValue,
  clearAdminCookie,
  createAdminSessionToken,
  resolveAdminOwner,
  verifyAdminAccessKey,
  verifyAdminSessionToken,
} = require("../api/_promo-admin-auth.js");
const { createHandler } = require("../api/promo-admin-session.js");

const env = {
  NODE_ENV: "production",
  PROMO_ADMIN_SESSION_SECRET: "0123456789abcdef0123456789abcdef",
  PROMO_ADMIN_ACCESS_KEY: "admin-access-key-0123456789abcdef",
};
const now = Date.now();
const token = createAdminSessionToken({ subject: "developer@example.com", now }, env);
assert.equal(verifyAdminSessionToken(token, { now: now + 1_000, env }).subject, "developer@example.com");
assert.equal(verifyAdminSessionToken(`${token}tampered`, { now: now + 1_000, env }), null);
assert.equal(resolveAdminOwner({ headers: { cookie: `${ADMIN_COOKIE_NAME}=${token}` } }, {}, { env }).authenticated, true);
assert.equal(verifyAdminAccessKey(env.PROMO_ADMIN_ACCESS_KEY, env), true);
assert.equal(verifyAdminAccessKey("wrong-access-key", env), false);
assert.match(adminCookieValue(token, { env }), /HttpOnly/);
assert.match(adminCookieValue(token, { env }), /SameSite=Strict/);
assert.match(adminCookieValue(token, { env }), /Secure/);
assert.match(clearAdminCookie(env), /Max-Age=0/);
assert.throws(
  () => resolveAdminOwner({ headers: {} }, {}, { env }),
  (error) => error.code === "ADMIN_SESSION_REQUIRED" && error.statusCode === 403,
);
assert.throws(
  () => resolveAdminOwner({ headers: {} }, {}, { env: { NODE_ENV: "production" } }),
  (error) => error.code === "ADMIN_AUTH_NOT_CONFIGURED",
);

function response() {
  return {
    statusCode: 200,
    headers: {},
    body: null,
    setHeader(name, value) { this.headers[String(name).toLowerCase()] = value; },
    status(code) { this.statusCode = code; return this; },
    json(value) { this.body = value; return this; },
  };
}

const handler = createHandler({ env });
const denied = response();
await handler({
  method: "POST",
  headers: { host: "example.com", origin: "https://example.com" },
  body: { accessKey: "wrong-access-key" },
}, denied);
assert.equal(denied.statusCode, 401);
assert.equal(denied.body.code, "ADMIN_ACCESS_DENIED");

const signedIn = response();
await handler({
  method: "POST",
  headers: { host: "example.com", origin: "https://example.com" },
  body: { accessKey: env.PROMO_ADMIN_ACCESS_KEY },
}, signedIn);
assert.equal(signedIn.statusCode, 200);
assert.equal(signedIn.body.authenticated, true);
assert.match(signedIn.headers["set-cookie"], new RegExp(`^${ADMIN_COOKIE_NAME}=`));

const sessionCookie = signedIn.headers["set-cookie"].split(";")[0];
const checked = response();
await handler({ method: "GET", headers: { cookie: sessionCookie } }, checked);
assert.equal(checked.statusCode, 200);
assert.equal(checked.body.authenticated, true);

const crossOrigin = response();
await handler({
  method: "POST",
  headers: { host: "example.com", origin: "https://attacker.example" },
  body: { accessKey: env.PROMO_ADMIN_ACCESS_KEY },
}, crossOrigin);
assert.equal(crossOrigin.statusCode, 403);
assert.equal(crossOrigin.body.code, "ADMIN_SESSION_ORIGIN_INVALID");

const signedOut = response();
await handler({
  method: "DELETE",
  headers: { host: "example.com", origin: "https://example.com" },
}, signedOut);
assert.equal(signedOut.statusCode, 200);
assert.match(signedOut.headers["set-cookie"], /Max-Age=0/);

console.log("Promo admin authentication boundary tests passed.");
