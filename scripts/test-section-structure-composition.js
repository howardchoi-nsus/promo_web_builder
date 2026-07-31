const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const {
  createStructurePlan,
  normalizeCandidates,
  stableFingerprint,
  validateStructurePlan,
} = require("../api/_promo-section-structure-contract");

const candidates = normalizeCandidates([
  { componentKey: "section_title", componentVersionId: "v-title", name: "Section Title", fieldKind: "text", maxInstances: 1 },
  { componentKey: "benefit_card", componentVersionId: "v-card", name: "Benefit Card", fieldKind: "group", maxInstances: 4 },
  { componentKey: "cta_button", componentVersionId: "v-cta", name: "CTA Button", fieldKind: "cta", maxInstances: 1 },
]);
const plan = createStructurePlan({ purpose: "혜택 카드 3개와 참여 CTA", candidates });
assert.ok(plan.componentSelections.some((selection) => selection.componentKey === "benefit_card" && selection.instanceCount === 3));
assert.ok(plan.componentSelections.some((selection) => selection.componentKey === "cta_button"));
assert.deepEqual(validateStructurePlan({ plan, candidates }).componentSelections, plan.componentSelections);
assert.equal(stableFingerprint(candidates), stableFingerprint([...candidates]));
assert.throws(() => validateStructurePlan({
  plan: { ...plan, componentSelections: [{ componentKey: "invented", componentVersionId: "unknown" }] },
  candidates,
}), /등록되지 않았거나/);

const app = fs.readFileSync(path.join(__dirname, "../visual-editor/src/App.vue"), "utf8");
assert.match(app, /promo-section-structure-plan/);
assert.match(app, /promo-section-structure-validate/);
assert.match(app, /label: "AI 섹션 구조 구성"/);
assert.match(app, /sections: nextSections/);
console.log("AI section structure composition contract tests passed.");
