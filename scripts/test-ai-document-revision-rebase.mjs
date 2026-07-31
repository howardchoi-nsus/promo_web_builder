import assert from "node:assert/strict";
import { rebaseDocumentSnapshot } from "../visual-editor/src/revision-rebase.mjs";
import { createAiDocumentAdapter } from "../visual-editor/src/platform/adapters/ai-document-adapter.mjs";

const base = {
  designSpec: { itemStyles: { title: { xPct: 10, color: "red" } } },
  content: { sectionInputs: { hero: { title: "Base" } } },
  assets: { requests: [] },
};

const local = structuredClone(base);
local.designSpec.itemStyles.title.xPct = 30;
const latest = structuredClone(base);
latest.assets.requests = [{ id: "asset-1", status: "ready" }];

const cleanRebase = rebaseDocumentSnapshot(base, local, latest);
assert.deepEqual(cleanRebase.conflicts, []);
assert.equal(cleanRebase.snapshot.designSpec.itemStyles.title.xPct, 30);
assert.deepEqual(cleanRebase.snapshot.assets.requests, [{ id: "asset-1", status: "ready" }]);

const conflictingLatest = structuredClone(base);
conflictingLatest.designSpec.itemStyles.title.xPct = 70;
const conflictingRebase = rebaseDocumentSnapshot(base, local, conflictingLatest);
assert.deepEqual(conflictingRebase.conflicts, ["$.designSpec.itemStyles.title.xPct"]);
assert.equal(conflictingRebase.snapshot.designSpec.itemStyles.title.xPct, 30);

const identicalEditLatest = structuredClone(local);
const identicalRebase = rebaseDocumentSnapshot(base, local, identicalEditLatest);
assert.deepEqual(identicalRebase.conflicts, []);
assert.equal(identicalRebase.snapshot.designSpec.itemStyles.title.xPct, 30);

const conflictAdapter = createAiDocumentAdapter({
  fetchImpl: async () => ({
    ok: false,
    status: 409,
    json: async () => ({
      error: "Builder document revision changed",
      code: "DOCUMENT_REVISION_MISMATCH",
      currentDocumentRevision: 12,
    }),
  }),
});
await assert.rejects(
  () => conflictAdapter.save({ documentId: "doc", baseDocumentRevision: 11, snapshot: {} }),
  (error) => error.code === "DOCUMENT_REVISION_MISMATCH" && error.currentDocumentRevision === 12,
);

console.log("AI document revision rebase tests passed");
