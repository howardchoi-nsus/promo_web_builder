import assert from "node:assert/strict";
import { createRequire } from "node:module";
import { readFileSync } from "node:fs";

const require = createRequire(import.meta.url);
const { validateRenderSpec } = require("../api/_component-render-spec-contract");
const {
  componentGenerationReadiness,
  layoutReferenceReadiness,
} = require("../api/_reference-component-readiness");

const migration = readFileSync(new URL("../db/migrations/081_reference_component_publishing.sql", import.meta.url), "utf8");
const activation = readFileSync(new URL("../api/item-component-activate.js", import.meta.url), "utf8");
const usage = readFileSync(new URL("../api/item-component-usage.js", import.meta.url), "utf8");
const resolver = readFileSync(new URL("../api/_promo-registry-composition-candidates.js", import.meta.url), "utf8");

const fieldMap = {
  "ref-pattern-offer-value-breakdown": [
    ["fld_a1000000000000000000000000000001", "text", false],
    ["fld_a1000000000000000000000000000002", "text", true],
    ["fld_a1000000000000000000000000000003", "text", true],
    ["fld_a1000000000000000000000000000004", "text", true],
    ["fld_a1000000000000000000000000000005", "cta", true],
  ],
  "ref-pattern-promotion-steps": [
    ["fld_a2000000000000000000000000000001", "text", true],
    ["fld_a2000000000000000000000000000002", "text", true],
    ["fld_a2000000000000000000000000000003", "text", true],
    ["fld_a2000000000000000000000000000004", "image", false],
  ],
  "ref-pattern-trust-proof-grid": [
    ["fld_a3000000000000000000000000000001", "image", false],
    ["fld_a3000000000000000000000000000002", "text", true],
    ["fld_a3000000000000000000000000000003", "text", true],
    ["fld_a3000000000000000000000000000004", "text", false],
  ],
  "ref-pattern-metric-strip": [
    ["fld_a4000000000000000000000000000001", "text", true],
    ["fld_a4000000000000000000000000000002", "text", true],
    ["fld_a4000000000000000000000000000003", "text", false],
  ],
  "ref-pattern-feature-split": [
    ["fld_a5000000000000000000000000000001", "text", false],
    ["fld_a5000000000000000000000000000002", "text", true],
    ["fld_a5000000000000000000000000000003", "text", true],
    ["fld_a5000000000000000000000000000004", "image", true],
    ["fld_a5000000000000000000000000000005", "cta", false],
  ],
  "ref-pattern-faq-accordion": [
    ["fld_a6000000000000000000000000000001", "text", true],
    ["fld_a6000000000000000000000000000002", "text", true],
  ],
};

const specPattern = /\(\s*'(ref-pattern-[^']+)',\s*'(\{"nodeType"[\s\S]*?\})',\s*'(\{[^']*\})',\s*'([a-f0-9]{64})'\s*\)/g;
const specs = [...migration.matchAll(specPattern)];
assert.equal(specs.length, 6, "Migration must publish six RenderSpecs");
for (const [, seedCode, rootJson, responsiveJson, storedHash] of specs) {
  const fields = fieldMap[seedCode].map(([fieldKey, fieldKind, isRequired]) => ({ fieldKey, fieldKind, isRequired }));
  const result = validateRenderSpec({
    contractVersion: 1,
    root: JSON.parse(rootJson),
    responsive: JSON.parse(responsiveJson),
    accessibility: {},
  }, { fields, tokenCatalog: [] });
  assert.equal(result.ok, true, `${seedCode}: ${JSON.stringify(result.errors)}`);
  assert.equal(storedHash, result.hash, `${seedCode}: migration hash must match server validation`);
}

for (const seedCode of Object.keys(fieldMap)) {
  assert.match(migration, new RegExp(seedCode, "g"), `${seedCode} must be published`);
}
assert.match(migration, /promo_layout_reference_component_links/);
assert.match(migration, /reference_component_publish_operations/);
assert.match(migration, /wizard_content_sections_section_role_chk/);
assert.match(migration, /array\['offer','content','trust','notice'\]/);
assert.match(migration, /activate_promo_composition_shell_version/);
assert.match(migration, /wizard_content_section_component_instances/);
assert.match(migration, /wizard_content_section_layouts/);
assert.match(migration, /render_contract_version, render_tree/);
assert.match(migration, /'hash', spec\.render_hash/);
assert.match(migration, /component\.system_seed_code like 'ref-pattern-%'/);
assert.match(migration, /'allowedPromotionPurposes', '\[\]'::jsonb/);
assert.doesNotMatch(migration, /'allowedPromotionPurposes', seed\.purpose_tags::jsonb/);

const blockedReference = layoutReferenceReadiness({
  status: "draft", copyrightReviewed: false, researchOnly: false,
  qualityScore: 2.6, layoutSpec: {}, designSummary: "",
});
assert.equal(blockedReference.ready, false);
assert.deepEqual(blockedReference.blockerCodes, [
  "REFERENCE_NOT_APPROVED",
  "COPYRIGHT_REVIEW_REQUIRED",
  "REFERENCE_RESEARCH_ONLY_REQUIRED",
  "REFERENCE_QUALITY_BELOW_THRESHOLD",
  "REFERENCE_LAYOUT_SPEC_REQUIRED",
  "REFERENCE_DESIGN_SUMMARY_REQUIRED",
]);
assert.equal(layoutReferenceReadiness({
  status: "approved", copyrightReviewed: true, researchOnly: true, qualityScore: 4.4,
  layoutSpec: { layoutFamily: "feature-split" }, designSummary: "Reusable split layout",
}).ready, true);

const baseComponent = {
  id: "component-1",
  systemSeedCode: "ref-pattern-feature-split",
  status: "active",
  version: {
    id: "version-2", status: "active", capabilities: { referenceDerived: true },
    placementPolicy: { allowedSectionRoles: ["content"] },
    renderContractVersion: 1, renderValidation: { ok: true },
  },
};
const baseSection = {
  id: "section-1", status: "active", compositionScope: "registry", sectionRole: "content",
  isVisibleInWizard: true, instanceVisible: true, componentVersionStatus: "active", layoutCount: 1,
};
assert.equal(componentGenerationReadiness({
  component: baseComponent, sections: [baseSection], shellAllowedRoles: ["content"], shellActive: true,
}).ready, true);
assert.ok(componentGenerationReadiness({
  component: { ...baseComponent, version: { ...baseComponent.version, renderContractVersion: null } },
  sections: [], shellAllowedRoles: [], shellActive: false,
}).blockerCodes.includes("RENDER_SPEC_REQUIRED"));

assert.match(activation, /REFERENCE_COMPONENT_RENDER_SPEC_REQUIRED/);
assert.match(usage, /fetchComponentGenerationReadiness/);
assert.match(resolver, /layout_spec <> '\{\}'::jsonb/);
assert.match(resolver, /btrim\(design_summary\) <> ''/);

console.log("Reference component publishing and readiness contracts passed");
