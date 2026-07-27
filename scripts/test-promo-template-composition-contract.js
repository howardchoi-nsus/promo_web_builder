const assert = require("node:assert/strict");
const {
  compositionSchema,
  validateCompositionProposal,
} = require("../api/_promo-template-composition-contract");

const candidates = [{
  templateId: "template-active",
  templateKey: "active",
  templateVersion: 3,
  templateName: "Active Template",
  sections: [{
    sectionId: "section-header",
    sectionKey: "header",
    sectionName: "Header",
    fixedPosition: "top",
    componentVersionIds: ["component-logo"],
    items: [{ itemKey: "logo", componentVersionId: "component-logo" }],
  }, {
    sectionId: "section-hero",
    sectionKey: "hero",
    sectionName: "Hero",
    fixedPosition: null,
    componentVersionIds: ["component-title", "component-cta"],
    items: [
      { itemKey: "title", componentVersionId: "component-title" },
      { itemKey: "cta", componentVersionId: "component-cta" },
    ],
  }],
}];

const schema = compositionSchema(candidates);
assert.deepEqual(schema.properties.templateId.enum, ["template-active"]);
assert.equal(schema.properties.sections.items.properties.layoutCommands.maxItems, 0);
assert.equal(
  schema.properties.sections.items.properties.layoutCommands.items.additionalProperties,
  false,
  "Strict response schemas must close nested object items"
);

const validated = validateCompositionProposal({
  templateId: "template-active",
  sections: [{
    sectionId: "section-header",
    componentVersionIds: ["component-logo"],
    contentMappings: [],
    layoutCommands: [],
  }, {
    sectionId: "section-hero",
    componentVersionIds: ["component-title", "component-cta"],
    contentMappings: [
      { itemKey: "title", sourceOverviewPath: "title" },
      { itemKey: "cta", sourceOverviewPath: "primaryAction.label" },
    ],
    layoutCommands: [],
  }],
  missingInputs: ["primaryAction.url"],
  warnings: [],
  summary: "Hero 중심 구성",
}, candidates);
assert.equal(validated.templateKey, "active");
assert.deepEqual(validated.sections.map((section) => section.sectionKey), ["header", "hero"]);

assert.throws(() => validateCompositionProposal({
  templateId: "template-active",
  sections: [{
    sectionId: "section-hero",
    componentVersionIds: ["component-title"],
    contentMappings: [],
    layoutCommands: [],
  }],
}, candidates), /Fixed-position section is required/);

assert.throws(() => validateCompositionProposal({
  templateId: "template-active",
  sections: [{
    sectionId: "section-header",
    componentVersionIds: ["component-other"],
    contentMappings: [],
    layoutCommands: [],
  }],
}, candidates), /component outside/);

console.log("promo template composition contract tests passed");
