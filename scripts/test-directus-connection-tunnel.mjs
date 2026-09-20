import assert from "node:assert/strict";
import { createRequire } from "node:module";
import { readFile } from "node:fs/promises";

const require = createRequire(import.meta.url);
const { validateConfig } = require("../api/_directus-connection-config-store.js");
const connectionHandler = require("../api/directus-connection-test.js");
const configHandler = require("../api/directus-integration-config.js");

function responseCapture() {
  return {
    statusCode: 200,
    body: null,
    headers: {},
    status(code) { this.statusCode = code; return this; },
    json(body) { this.body = body; return this; },
    setHeader(name, value) { this.headers[name] = value; },
  };
}

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
const migration = await readFile(new URL("../db/migrations/070_directus_connection_tunnel.sql", import.meta.url), "utf8");
assert.match(endpoint, /server\/health/);
assert.match(endpoint, /users\/me\?fields=id/);
assert.match(endpoint, /redirect: "error"/);
assert.doesNotMatch(endpoint, /access_token=/);
assert.match(settings, /Directus 연결 터널/);
assert.match(settings, /DIRECTUS_CONNECTION_TUNNEL_ENABLED=true/);
assert.match(settings, /최근 연결 검사/);
assert.match(adminPage, /adminTab === 'integrations'/);
assert.match(migration, /must pass a connection check before activation/);

const previousIntegrationFlag = process.env.DIRECTUS_INTEGRATION_ENABLED;
const previousTunnelFlag = process.env.DIRECTUS_CONNECTION_TUNNEL_ENABLED;
const previousConfigFlag = process.env.DIRECTUS_CONFIG_MANAGEMENT_ENABLED;
try {
  process.env.DIRECTUS_INTEGRATION_ENABLED = "false";
  process.env.DIRECTUS_CONNECTION_TUNNEL_ENABLED = "false";
  const blockedConnection = responseCapture();
  await connectionHandler({ method: "POST", headers: {}, body: {} }, blockedConnection);
  assert.equal(blockedConnection.statusCode, 404);
  assert.equal(blockedConnection.body.code, "BUILDER_FEATURE_DISABLED");

  process.env.DIRECTUS_CONFIG_MANAGEMENT_ENABLED = "false";
  const blockedConfig = responseCapture();
  await configHandler({ method: "GET", headers: {} }, blockedConfig);
  assert.equal(blockedConfig.statusCode, 404);
  assert.equal(blockedConfig.body.code, "BUILDER_FEATURE_DISABLED");
} finally {
  if (previousIntegrationFlag === undefined) delete process.env.DIRECTUS_INTEGRATION_ENABLED;
  else process.env.DIRECTUS_INTEGRATION_ENABLED = previousIntegrationFlag;
  if (previousTunnelFlag === undefined) delete process.env.DIRECTUS_CONNECTION_TUNNEL_ENABLED;
  else process.env.DIRECTUS_CONNECTION_TUNNEL_ENABLED = previousTunnelFlag;
  if (previousConfigFlag === undefined) delete process.env.DIRECTUS_CONFIG_MANAGEMENT_ENABLED;
  else process.env.DIRECTUS_CONFIG_MANAGEMENT_ENABLED = previousConfigFlag;
}

console.log("Directus connection tunnel tests passed.");
