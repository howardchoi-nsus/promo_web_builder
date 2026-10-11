import assert from "node:assert/strict";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const { runtimePublicConfig } = require("../api/_promo-runtime-public-config.js");

assert.deepEqual(runtimePublicConfig({}), {
  publicUrl: "", configured: false, reason: "not_configured",
});
assert.equal(runtimePublicConfig({ PROMO_RUNTIME_PUBLIC_URL: "https://runtime.example/" }).publicUrl, "https://runtime.example");
assert.equal(runtimePublicConfig({ PROMO_RUNTIME_PUBLIC_URL: "http://localhost:3001" }).configured, true);
assert.equal(runtimePublicConfig({
  PROMO_RUNTIME_PUBLIC_URL: "http://localhost:3001",
  NODE_ENV: "production",
}).reason, "https_required");
assert.equal(runtimePublicConfig({ PROMO_RUNTIME_PUBLIC_URL: "https://user:pass@runtime.example" }).reason, "unsafe_url");
assert.equal(runtimePublicConfig({ PROMO_RUNTIME_PUBLIC_URL: "https://runtime.example/base" }).reason, "origin_required");

console.log("Promo runtime public config tests passed.");
