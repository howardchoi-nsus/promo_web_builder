import assert from "node:assert/strict";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const { assertPublicationReady, normalizeRevalidateSeconds } = require("../api/promo-publications.js");

function candidate({ contractVersion = 3, status = "published", gateState = "passed", revision = 4 } = {}) {
  return {
    contractVersion: 1,
    publication: {
      id: "publication-test",
      documentId: "document-test",
      slug: "quality-gated-promo",
      locale: "ko-KR",
      status,
      publishedRevision: revision,
      publishedAt: "2026-09-20T00:00:00.000Z",
      updatedAt: "2026-09-20T00:00:00.000Z",
    },
    seo: { title: "Quality gated promo" },
    renderer: { key: "default-promo-renderer", version: 1 },
    snapshot: {
      contractVersion,
      documentRevision: revision,
      qualityGate: {
        contractVersion: 1,
        state: gateState,
        documentRevision: revision,
        blockingCount: gateState === "passed" ? 0 : 1,
      },
      content: { sectionSnapshot: [] },
    },
    manifest: {},
    cache: { etag: "snapshot-hash", revalidateSeconds: 300 },
  };
}

assert.equal((await assertPublicationReady(candidate())).publication.status, "published");
await assert.rejects(
  () => assertPublicationReady(candidate({ gateState: "pending" })),
  (error) => error.code === "QUALITY_GATE_REQUIRED",
);
assert.equal((await assertPublicationReady(candidate({ status: "draft", gateState: "pending" }))).publication.status, "draft");
assert.equal((await assertPublicationReady(candidate({ contractVersion: 2, gateState: "pending" }))).publication.status, "published");
assert.equal(normalizeRevalidateSeconds("invalid"), 300);
assert.equal(normalizeRevalidateSeconds(90_000), 86_400);
assert.equal(normalizeRevalidateSeconds(-1), 0);
assert.equal(normalizeRevalidateSeconds(15.9), 15);

console.log("Promo publication policy tests passed.");
