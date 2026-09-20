import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import {
  assertPublishedPromotion,
  normalizePublishedPromotion,
  supportsRenderer,
  validatePublishedPromotion,
} from "../packages/promo-contracts/src/index.mjs";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const schema = JSON.parse(fs.readFileSync(path.join(root, "contracts/published-promotion-v1.schema.json"), "utf8"));
assert.equal(schema.properties.contractVersion.const, 1);
assert.equal(schema.additionalProperties, false);

const candidate = {
  contractVersion: 1,
  publication: {
    id: "pub-1",
    documentId: "doc-1",
    slug: "summer-sale",
    locale: "ko-KR",
    status: "published",
    publishedRevision: 12,
    publishedAt: "2026-09-17T00:00:00.000Z",
    updatedAt: "2026-09-17T00:00:00.000Z",
  },
  seo: { title: "Summer sale", description: "Promotion", noIndex: false },
  renderer: { key: "default-promo-renderer", version: 1 },
  snapshot: {
    contractVersion: 3,
    content: { contractVersion: 3, sectionSnapshot: [], sectionInputs: {}, sectionOrder: [] },
  },
  manifest: { snapshotHash: "sha256:abc" },
  cache: { etag: "sha256:abc", revalidateSeconds: 300 },
};

const normalized = normalizePublishedPromotion(candidate);
assert.equal(normalized.publication.slug, "summer-sale");
assert.equal(normalized.publication.publishedAt, "2026-09-17T00:00:00.000Z");
assert.equal(normalized.cache.revalidateSeconds, 300);
assert.equal(supportsRenderer(normalized.renderer), true);
assert.equal(validatePublishedPromotion(candidate).ok, true);
assert.deepEqual(assertPublishedPromotion(candidate), normalized);

const invalid = validatePublishedPromotion({
  ...candidate,
  publication: { ...candidate.publication, slug: "Bad Slug", publishedRevision: 0 },
  renderer: { key: "unknown", version: 1 },
});
assert.equal(invalid.ok, false);
assert.deepEqual(invalid.errors.map((error) => error.code), [
  "INVALID_PUBLICATION_SLUG",
  "PUBLISHED_REVISION_REQUIRED",
  "UNSUPPORTED_RENDERER",
]);

assert.throws(
  () => assertPublishedPromotion({ ...candidate, snapshot: {} }),
  (error) => error.code === "INVALID_PUBLISHED_PROMOTION" && error.validation.errors.length >= 2,
);

console.log("PublishedPromotion v1 contract tests passed");
