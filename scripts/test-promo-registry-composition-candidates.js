const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const {
  fingerprint,
  evaluateSectionCandidate,
  rankCandidates,
  resolveAllowedLayoutPresets,
} = require("../api/_promo-registry-composition-candidates");

const resolverSource = fs.readFileSync(
  path.resolve(__dirname, "../api/_promo-registry-composition-candidates.js"),
  "utf8",
);
const apiSource = fs.readFileSync(
  path.resolve(__dirname, "../api/promo-registry-composition-candidates.js"),
  "utf8",
);
const migration = fs.readFileSync(
  path.resolve(__dirname, "../db/migrations/051_registry_candidate_resolver_indexes.sql"),
  "utf8",
);

const baseSection = {
  id: "registry-hero-v1",
  sectionKey: "hero",
  sectionRole: "hero",
  compositionScope: "registry",
  sortOrder: 10,
  fixedPosition: null,
  isRequired: false,
  aiDesign: { enabled: true, allowedLayoutVariants: ["hero-default"] },
  compositionPolicy: {
    selectionPolicy: "required-by-purpose",
    allowedMarkets: ["KR"],
    allowedPromotionPurposes: ["이벤트"],
    maxInstances: 1,
  },
};
const components = [{
  componentKey: "title",
  fieldKind: "text",
  textType: "title",
  capabilities: { richText: true },
  fields: [],
}];
const criteria = {
  market: "KR",
  locale: "ko-KR",
  promotionPurpose: "이벤트",
  capabilities: ["text", "title"],
};
const evaluation = evaluateSectionCandidate({
  section: baseSection,
  components,
  layouts: [{ layoutKey: "hero-default" }],
  criteria,
  shellConfig: { requiredSectionRoles: ["hero"] },
});
assert.equal(evaluation.eligible, true);
assert.equal(evaluation.resolvedRequired, true);
assert.deepEqual(evaluation.matchedCapabilities, ["text", "title"]);
assert.equal(evaluation.missingCapabilities.length, 0);

const savedLayouts = [
  { layoutKey: "hero-left", isDefault: true },
  { layoutKey: "hero-center", isDefault: false },
  { layoutKey: "hero-right", isDefault: false },
];
const selectableLayouts = resolveAllowedLayoutPresets({
  aiDesign: { allowedLayoutVariants: ["hero-left", "hero-right", "missing"] },
  compositionPolicy: { layoutLocked: false },
}, savedLayouts);
assert.deepEqual(selectableLayouts.allowedLayoutKeys, ["hero-left", "hero-right"]);
assert.deepEqual(selectableLayouts.layoutPresets.map((layout) => layout.layoutKey), ["hero-left", "hero-right"]);
const lockedLayouts = resolveAllowedLayoutPresets({
  aiDesign: { allowedLayoutVariants: ["hero-right"] },
  compositionPolicy: { layoutLocked: true },
}, savedLayouts);
assert.deepEqual(lockedLayouts.allowedLayoutKeys, ["hero-left"]);
assert.equal(lockedLayouts.layoutSelectionLocked, true);
const failClosedLayouts = resolveAllowedLayoutPresets({
  aiDesign: { allowedLayoutVariants: ["missing"] },
  compositionPolicy: { layoutLocked: false },
}, savedLayouts);
assert.deepEqual(failClosedLayouts.allowedLayoutKeys, []);
assert.deepEqual(failClosedLayouts.layoutPresets, []);
const noAllowedEvaluation = evaluateSectionCandidate({
  section: baseSection,
  components,
  layouts: [],
  layoutPolicy: failClosedLayouts,
  criteria,
  shellConfig: {},
});
assert.ok(noAllowedEvaluation.reasons.includes("AI_LAYOUT_PRESET_REQUIRED"));

const partialCapabilityMatch = evaluateSectionCandidate({
  section: { ...baseSection, isRequired: false, compositionPolicy: { selectionPolicy: "optional" } },
  components,
  layouts: [{ layoutKey: "hero-default" }],
  criteria: { ...criteria, capabilities: ["title", "image", "cta"] },
  shellConfig: {},
});
assert.equal(partialCapabilityMatch.eligible, true);
assert.deepEqual(partialCapabilityMatch.matchedCapabilities, ["title"]);
assert.deepEqual(partialCapabilityMatch.missingCapabilities, ["image", "cta"]);

const marketExcluded = evaluateSectionCandidate({
  section: baseSection,
  components,
  layouts: [{ layoutKey: "hero-default" }],
  criteria: { ...criteria, market: "GB" },
  shellConfig: {},
});
assert.equal(marketExcluded.eligible, false);
assert.ok(marketExcluded.reasons.includes("MARKET_NOT_ALLOWED"));

const sharedExcluded = evaluateSectionCandidate({
  section: { ...baseSection, compositionScope: "shared" },
  components,
  layouts: [{ layoutKey: "hero-default" }],
  criteria,
  shellConfig: { sharedSectionVersionIds: [] },
});
assert.ok(sharedExcluded.reasons.includes("SHARED_SECTION_NOT_REFERENCED"));

const capabilityExcluded = evaluateSectionCandidate({
  section: { ...baseSection, compositionPolicy: { selectionPolicy: "optional" } },
  components,
  layouts: [{ layoutKey: "hero-default" }],
  criteria: { ...criteria, capabilities: ["video"] },
  shellConfig: {},
});
assert.deepEqual(capabilityExcluded.missingCapabilities, ["video"]);
assert.ok(capabilityExcluded.reasons.includes("CAPABILITY_NOT_AVAILABLE"));

const ranked = rankCandidates([
  { sectionKey: "z", sectionVersionId: "2", rankScore: 10, sortOrder: 20 },
  { sectionKey: "b", sectionVersionId: "1", rankScore: 20, sortOrder: 20 },
  { sectionKey: "a", sectionVersionId: "3", rankScore: 20, sortOrder: 10 },
], 2);
assert.deepEqual(ranked.map((item) => item.sectionKey), ["a", "b"]);
const largeCandidateSet = Array.from({ length: 10_000 }, (_, index) => ({
  sectionKey: `section-${String(index).padStart(5, "0")}`,
  sectionVersionId: String(index),
  rankScore: index % 100,
  sortOrder: index % 50,
}));
const rankedLargeSet = rankCandidates(largeCandidateSet, 40);
assert.equal(rankedLargeSet.length, 40);
assert.equal(rankedLargeSet[0].rankScore, 99);
assert.equal(
  fingerprint({ b: 2, a: [1, 3] }),
  fingerprint({ a: [1, 3], b: 2 }),
  "fingerprint must be independent of object key insertion order",
);

assert.match(resolverSource, /componentVersionStatus === "active"/);
assert.match(resolverSource, /fetchItemsForSections/);
assert.match(resolverSource, /fetchLayoutsForSections/);
assert.match(resolverSource, /composition_scope in \('registry', 'shared'\)/);
assert.match(resolverSource, /candidateFingerprint: fingerprint\(snapshot\)/);
assert.match(resolverSource, /policyFingerprint/);
assert.match(resolverSource, /resourceFingerprint/);
assert.match(apiSource, /requireBuilderFlag\("compositionV3"\)/);
assert.match(apiSource, /COMPOSITION_CANDIDATES_EMPTY/);
assert.match(migration, /wizard_content_sections_registry_candidates_idx/);

console.log("Promo Registry composition candidate resolver tests passed");
