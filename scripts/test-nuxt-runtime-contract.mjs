import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const read = (path) => readFile(new URL(`../${path}`, import.meta.url), "utf8");
const [config, page, endpoint, migration, flags] = await Promise.all([
  read("apps/promo-runtime-nuxt/nuxt.config.ts"),
  read("apps/promo-runtime-nuxt/app/pages/promotions/[slug].vue"),
  read("apps/promo-runtime-nuxt/server/api/promotions/[slug].get.ts"),
  read("db/migrations/069_promo_publication_runtime.sql"),
  read("api/_promo-builder-flags.js"),
]);

assert.match(config, /routeRules/);
assert.match(config, /NUXT_SSR_ENABLED/);
assert.match(config, /promoApiBaseUrl/);
assert.match(page, /PromoReadonlyRenderer/);
assert.match(page, /useSeoMeta/);
assert.match(endpoint, /assertPublishedPromotion/);
assert.match(endpoint, /Cache-Control/);
assert.match(endpoint, /statusCode === 410/);
assert.match(migration, /foreign key \(document_id, document_revision\)/);
assert.match(migration, /unique \(locale, slug\)/);
assert.match(flags, /NUXT_RUNTIME_ENABLED/);
assert.match(flags, /NUXT_SSR_ENABLED/);

console.log("Nuxt runtime contract tests passed.");
