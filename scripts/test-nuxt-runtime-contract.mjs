import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const read = (path) => readFile(new URL(`../${path}`, import.meta.url), "utf8");
const [config, page, endpoint, previewPage, previewEndpoint, revalidateEndpoint, migration, flags] = await Promise.all([
  read("apps/promo-runtime-nuxt/nuxt.config.ts"),
  read("apps/promo-runtime-nuxt/app/pages/promotions/[slug].vue"),
  read("apps/promo-runtime-nuxt/server/api/promotions/[slug].get.ts"),
  read("apps/promo-runtime-nuxt/app/pages/preview/promotions/[slug].vue"),
  read("apps/promo-runtime-nuxt/server/api/preview-promotions/[slug].get.ts"),
  read("apps/promo-runtime-nuxt/server/api/revalidate-promotion.post.ts"),
  read("db/migrations/069_promo_publication_runtime.sql"),
  read("api/_promo-builder-flags.js"),
]);

assert.match(config, /routeRules/);
assert.match(config, /NUXT_SSR_ENABLED/);
assert.match(config, /promoApiBaseUrl/);
assert.match(config, /revalidateSecret/);
assert.match(page, /PromoReadonlyRenderer/);
assert.match(page, /useSeoMeta/);
assert.match(endpoint, /assertPublishedPromotion/);
assert.match(endpoint, /Cache-Control/);
assert.match(endpoint, /statusCode === 410/);
assert.match(previewPage, /noindex,nofollow/);
assert.match(previewPage, /data-preview="true"/);
assert.match(previewEndpoint, /Cache-Control/);
assert.match(previewEndpoint, /no-store/);
assert.match(revalidateEndpoint, /timingSafeEqual/);
assert.match(revalidateEndpoint, /cache:nitro\/routes/);
assert.match(migration, /foreign key \(document_id, document_revision\)/);
assert.match(migration, /unique \(locale, slug\)/);
assert.match(flags, /NUXT_RUNTIME_ENABLED/);
assert.match(flags, /NUXT_SSR_ENABLED/);

console.log("Nuxt runtime contract tests passed.");
