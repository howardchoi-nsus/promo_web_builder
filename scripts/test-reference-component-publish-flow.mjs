import assert from "node:assert/strict";
import { createRequire } from "node:module";
import { readFileSync } from "node:fs";

const require = createRequire(import.meta.url);
const {
  evaluatePublishPlanData,
  normalizePublishInput,
  validatePublishInput,
} = require("../api/_reference-component-publishing");

const publishPlanRoute = readFileSync(new URL("../api/reference-component-publish-plan.js", import.meta.url), "utf8");
const publishRoute = readFileSync(new URL("../api/reference-component-publish.js", import.meta.url), "utf8");
const optionsRoute = readFileSync(new URL("../api/reference-component-publish-options.js", import.meta.url), "utf8");
const migration = readFileSync(new URL("../db/migrations/081_reference_component_publishing.sql", import.meta.url), "utf8");

const input = normalizePublishInput({
  componentVersionId: "11111111-1111-4111-8111-111111111111",
  sectionId: "22222222-2222-4222-8222-222222222222",
  layoutPresetIds: ["33333333-3333-4333-8333-333333333333"],
  referenceIds: ["44444444-4444-4444-8444-444444444444"],
  itemKey: "feature",
});
assert.deepEqual(validatePublishInput(input), []);
assert.ok(validatePublishInput({ ...input, sectionId: "not-a-uuid" }).length);

const component = {
  id: "component-1",
  systemSeedCode: "ref-pattern-feature-split",
  status: "active",
  version: {
    id: input.componentVersionId,
    status: "draft",
    capabilities: { referenceDerived: true },
    placementPolicy: { allowedSectionRoles: ["content"] },
    renderContractVersion: 1,
    renderTree: { nodeType: "element", tag: "article" },
    renderValidation: { ok: true, hash: "a".repeat(64) },
  },
};
const section = {
  id: input.sectionId,
  status: "active",
  compositionScope: "registry",
  sectionRole: "content",
  isVisibleInWizard: true,
};
const geometry = { positionMode: "free", xPct: 5, yPx: 40, widthPct: 90, heightPx: 500 };
const layouts = [{
  id: input.layoutPresetIds[0],
  layoutSnapshot: {
    contractVersion: 1,
    layoutMode: "free",
    viewports: {
      desktop: { items: { feature: geometry } },
      mobile: { items: { feature: geometry } },
    },
  },
}];
const references = [{
  id: input.referenceIds[0],
  status: "approved",
  copyrightReviewed: true,
  researchOnly: true,
  qualityScore: 4.6,
  layoutSpec: { family: "feature-split" },
  designSummary: "Reviewed reusable split composition.",
}];

const ready = evaluatePublishPlanData({
  input, component, section, layouts, references, instances: [],
  shellActive: true, shellAllowedRoles: ["content"],
  requestedLayoutCount: 1, requestedReferenceCount: 1,
});
assert.equal(ready.ready, true, JSON.stringify(ready.blockers));
assert.equal(ready.expectedPlannerCandidate, true);

const blocked = evaluatePublishPlanData({
  input,
  component: { ...component, version: { ...component.version, renderValidation: { ok: false } } },
  section: { ...section, sectionRole: "hero" },
  layouts: [{ ...layouts[0], layoutSnapshot: { ...layouts[0].layoutSnapshot, viewports: { desktop: layouts[0].layoutSnapshot.viewports.desktop } } }],
  references: [],
  instances: [{ itemKey: "feature", componentId: "another-component" }],
  shellActive: false,
  requestedLayoutCount: 1,
  requestedReferenceCount: 1,
});
for (const code of [
  "RENDER_SPEC_INVALID",
  "SECTION_ROLE_NOT_ALLOWED",
  "SECTION_ITEM_KEY_CONFLICT",
  "RESPONSIVE_LAYOUT_INVALID",
  "REFERENCE_NOT_FOUND",
  "REFERENCE_EVIDENCE_REQUIRED",
  "COMPOSITION_SHELL_NOT_ACTIVE",
]) assert.ok(blocked.blockerCodes.includes(code), `${code}: ${JSON.stringify(blocked.blockers)}`);

assert.match(publishPlanRoute, /buildReferenceComponentPublishPlan/);
assert.match(publishPlanRoute, /referenceComponentPublishing/);
assert.match(publishRoute, /Idempotency-Key is required/);
assert.match(publishRoute, /sql\.transaction\(queries\)/);
assert.match(publishRoute, /on conflict \(section_id, item_key\) do update/);
assert.match(publishRoute, /promo_layout_reference_component_links/);
assert.match(optionsRoute, /plannerReadiness: layoutReferenceReadiness/);
assert.match(optionsRoute, /composition_scope in \('registry', 'shared'\)/);
assert.match(migration, /create table if not exists public\.reference_component_publish_operations/);
assert.match(migration, /idempotency_key text not null unique/);

console.log("Reference component publish plan and transactional publish contracts passed");
