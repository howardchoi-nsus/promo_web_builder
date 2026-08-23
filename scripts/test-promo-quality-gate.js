const assert = require("node:assert/strict");
const {
  assertPassedQualityGate,
  normalizePassedQualityGate,
  pendingQualityGate,
} = require("../api/_promo-quality-gate");

const passed = normalizePassedQualityGate({
  state: "passed",
  blockingCount: 0,
  results: {
    desktop: { blockingCount: 0, warningCount: 1, diagnostics: [] },
    mobile: { blockingCount: 0, warningCount: 0, diagnostics: [] },
  },
}, { sourceDocumentRevision: 4, documentRevision: 5 });

assert.equal(passed.state, "passed");
assert.equal(passed.sourceDocumentRevision, 4);
assert.equal(passed.documentRevision, 5);
assert.equal(passed.warningCount, 1);
assert.equal(assertPassedQualityGate({ contractVersion: 3, documentRevision: 5, qualityGate: passed }, 5), true);
assert.equal(assertPassedQualityGate({ contractVersion: 2 }, 1), true);

assert.throws(
  () => normalizePassedQualityGate({ state: "failed", blockingCount: 1 }, {
    sourceDocumentRevision: 4,
    documentRevision: 5,
  }),
  (error) => error.code === "QUALITY_GATE_NOT_PASSED",
);
assert.throws(
  () => normalizePassedQualityGate({
    state: "passed",
    blockingCount: 0,
    results: { desktop: { blockingCount: 0 } },
  }, { sourceDocumentRevision: 4, documentRevision: 5 }),
  (error) => error.code === "QUALITY_GATE_VIEWPORT_MISSING",
);
assert.throws(
  () => assertPassedQualityGate({
    contractVersion: 3,
    documentRevision: 6,
    qualityGate: passed,
  }, 6),
  (error) => error.code === "QUALITY_GATE_REQUIRED",
);

assert.deepEqual(pendingQualityGate(7, "operations_applied"), {
  contractVersion: 1,
  state: "pending",
  documentRevision: 7,
  reason: "operations_applied",
});

console.log("Promo quality gate persistence tests passed");
