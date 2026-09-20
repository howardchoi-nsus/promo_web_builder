import assert from "node:assert/strict";
import { createRequire } from "node:module";
import { readFile } from "node:fs/promises";

const require = createRequire(import.meta.url);
const { validateConfig } = require("../api/_directus-connection-config-store.js");

const valid = validateConfig({
  baseUrl: "https://cms.example.com",
  secretRef: "env:DIRECTUS_SECRET_CONNECTION",
  verifyAuthentication: true,
}, { DIRECTUS_ALLOWED_HOSTS: "cms.example.com", VERCEL_ENV: "production" });
assert.equal(valid.ok, true);

const blockedHost = validateConfig({
  baseUrl: "https://attacker.example",
  secretRef: "env:DIRECTUS_SECRET_CONNECTION",
}, { DIRECTUS_ALLOWED_HOSTS: "cms.example.com", VERCEL_ENV: "production" });
assert.equal(blockedHost.ok, false);
assert.ok(blockedHost.errors.some((error) => error.code === "HOST_NOT_ALLOWED"));

const unsafeUrl = validateConfig({
  baseUrl: "https://user:password@cms.example.com?token=leak",
  secretRef: "TOKEN",
}, { DIRECTUS_ALLOWED_HOSTS: "cms.example.com", VERCEL_ENV: "production" });
assert.ok(unsafeUrl.errors.some((error) => error.code === "UNSAFE_BASE_URL"));
assert.ok(unsafeUrl.errors.some((error) => error.code === "INVALID_SECRET_REF"));

const endpoint = await readFile(new URL("../api/directus-connection-test.js", import.meta.url), "utf8");
const settings = await readFile(new URL("../admin-app/src/components/DirectusIntegrationSettings.vue", import.meta.url), "utf8");
const adminPage = await readFile(new URL("../prototype/index.html", import.meta.url), "utf8");
assert.match(endpoint, /server\/health/);
assert.match(endpoint, /users\/me\?fields=id/);
assert.match(endpoint, /redirect: "error"/);
assert.doesNotMatch(endpoint, /access_token=/);
assert.match(settings, /Directus 연결 터널/);
assert.match(settings, /DIRECTUS_CONNECTION_TUNNEL_ENABLED=true/);
assert.match(settings, /최근 연결 검사/);
assert.match(adminPage, /adminTab === 'integrations'/);

console.log("Directus connection tunnel tests passed.");
