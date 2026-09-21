import assert from "node:assert/strict";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const { createPreviewToken, previewSecret, verifyPreviewToken } = require("../api/_promo-preview-token.js");
const env = { PROMO_PREVIEW_TOKEN_SECRET: "0123456789abcdef0123456789abcdef" };
const now = Date.parse("2026-09-21T00:00:00.000Z");
const created = createPreviewToken({ publicationId: "publication-1", revision: 7, now, ttlSeconds: 300 }, env);

assert.deepEqual(verifyPreviewToken(created.token, { now: now + 1_000, env }), {
  publicationId: "publication-1",
  revision: 7,
  expiresAt: now + 300_000,
});
assert.equal(verifyPreviewToken(`${created.token}tampered`, { now: now + 1_000, env }), null);
assert.equal(verifyPreviewToken(created.token, { now: now + 300_001, env }), null);
assert.throws(
  () => previewSecret({ NODE_ENV: "production", PROMO_PREVIEW_TOKEN_SECRET: "short" }),
  (error) => error.code === "PROMO_PREVIEW_TOKEN_SECRET_REQUIRED",
);

console.log("Promo preview token tests passed.");
