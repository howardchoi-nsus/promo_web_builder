import assert from "node:assert/strict";
import {
  isCompositionContractV2,
  normalizeCompositionContractV2,
  upgradeLegacySnapshot,
} from "../visual-editor/src/shared/composition/composition-contract-v2.mjs";

const legacy = {
  layoutRevision: 7,
  content: {
    formTemplate: { id: "template-1", templateKey: "default", version: 1 },
    sectionSnapshot: [{ sectionKey: "hero", items: [] }],
    sectionInputs: { hero: {} },
    sectionOrder: ["hero"],
  },
  designSpec: { sectionStyles: {}, itemStyles: {}, visibility: { items: {}, fields: {} } },
  assets: { contractVersion: 1, items: {} },
};

const upgraded = upgradeLegacySnapshot(legacy, {
  documentId: "document-1",
  documentRevision: 3,
});
assert.equal(isCompositionContractV2(upgraded), true);
assert.equal(upgraded.contractVersion, 2);
assert.equal(upgraded.documentRevision, 3);
assert.equal(upgraded.layoutRevision, 7);
assert.equal(upgraded.compositionMeta.documentId, "document-1");
assert.deepEqual(upgraded.assets.requests, []);

const normalized = normalizeCompositionContractV2(upgraded);
assert.notEqual(normalized, upgraded);
assert.equal(normalized.validation.ok, true);

console.log("Composition Contract v2 tests passed");
