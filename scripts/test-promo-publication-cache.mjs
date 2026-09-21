import assert from "node:assert/strict";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const { invalidatePublicationCache, revalidationConfig } = require("../api/_promo-publication-cache.js");

assert.deepEqual(revalidationConfig({}), { enabled: false, reason: "not_configured" });
assert.equal(revalidationConfig({ NUXT_REVALIDATE_URL: "https://runtime.example/api/revalidate-promotion" }).reason, "incomplete_config");
assert.equal(revalidationConfig({
  NUXT_REVALIDATE_URL: "http://runtime.example/api/revalidate-promotion",
  NUXT_REVALIDATE_SECRET: "secret",
}).reason, "https_required");
assert.equal(revalidationConfig({
  NUXT_REVALIDATE_URL: "http://127.0.0.1:3001/api/revalidate-promotion",
  NUXT_REVALIDATE_SECRET: "secret",
}).enabled, true);
assert.equal(revalidationConfig({
  NUXT_REVALIDATE_URL: "http://127.0.0.1:3001/api/revalidate-promotion",
  NUXT_REVALIDATE_SECRET: "secret",
  NODE_ENV: "production",
}).reason, "https_required");

let request;
const completed = await invalidatePublicationCache({
  slug: "Autumn-Promo",
  locale: "ko-KR",
  reason: "publication_published",
}, {
  env: {
    NUXT_REVALIDATE_URL: "https://runtime.example/api/revalidate-promotion",
    NUXT_REVALIDATE_SECRET: "shared-secret",
  },
  fetchImpl: async (url, options) => {
    request = { url, options };
    return new Response(JSON.stringify({ ok: true }), { status: 200 });
  },
});
assert.deepEqual(completed, { status: "completed" });
assert.equal(request.url, "https://runtime.example/api/revalidate-promotion");
assert.equal(request.options.redirect, "error");
assert.equal(request.options.headers["x-promo-revalidate-secret"], "shared-secret");
assert.deepEqual(JSON.parse(request.options.body), {
  slug: "autumn-promo",
  locale: "ko-KR",
  reason: "publication_published",
});

assert.deepEqual(await invalidatePublicationCache({ slug: "promo" }, {
  env: {
    NUXT_REVALIDATE_URL: "https://runtime.example/api/revalidate-promotion",
    NUXT_REVALIDATE_SECRET: "secret",
  },
  fetchImpl: async () => new Response("", { status: 401 }),
}), { status: "failed", reason: "http_401" });
assert.deepEqual(await invalidatePublicationCache({ slug: "promo" }, {
  env: { NUXT_REVALIDATE_URL: "https://runtime.example/api/revalidate-promotion" },
}), { status: "failed", reason: "incomplete_config" });

console.log("Promo publication cache tests passed.");
