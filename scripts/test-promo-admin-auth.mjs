import assert from "node:assert/strict";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const {
  ADMIN_COOKIE_NAME, createAdminSessionToken, resolveAdminOwner, verifyAdminSessionToken,
} = require("../api/_promo-admin-auth.js");

const env = {
  NODE_ENV: "production",
  PROMO_ADMIN_SESSION_SECRET: "0123456789abcdef0123456789abcdef",
};
const now = Date.now();
const token = createAdminSessionToken({ subject: "developer@example.com", now }, env);
assert.equal(verifyAdminSessionToken(token, { now: now + 1_000, env }).subject, "developer@example.com");
assert.equal(verifyAdminSessionToken(`${token}tampered`, { now: now + 1_000, env }), null);
assert.equal(resolveAdminOwner({ headers: { cookie: `${ADMIN_COOKIE_NAME}=${token}` } }, {}, { env }).authenticated, true);
assert.throws(
  () => resolveAdminOwner({ headers: {} }, {}, { env }),
  (error) => error.code === "ADMIN_SESSION_REQUIRED" && error.statusCode === 403,
);
assert.throws(
  () => resolveAdminOwner({ headers: {} }, {}, { env: { NODE_ENV: "production" } }),
  (error) => error.code === "ADMIN_AUTH_NOT_CONFIGURED",
);

console.log("Promo admin authentication boundary tests passed.");
