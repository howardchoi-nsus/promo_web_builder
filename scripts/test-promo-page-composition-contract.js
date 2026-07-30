const assert = require("node:assert/strict");
const {
  pageCompositionSchema,
  validatePageCompositionProposal,
  normalizePageComposition,
} = require("../api/_promo-page-composition-contract");

const candidates = {
  candidateFingerprint: "candidate-hash",
  tokenSets: [{
    tokenSetId: "tokens",
    tokenSetVersionId: "tokens-v1",
    runtimeValues: { "--app-background": "#000000", "--app-text": "#ffffff" },
  }],
  motionPresets: [{
    presetKey: "fade-up",
    presetVersionId: "motion-v1",
    config: { durationToken: "480ms", easingToken: "ease-out", delayToken: "0ms" },
  }],
  templates: [{
    templateId: "template-1",
    templateKey: "default",
    templateVersion: 1,
    sections: [{
      sectionId: "section-1",
      sectionKey: "hero",
      name: "Hero",
      version: 1,
      sortOrder: 10,
      fixedPosition: null,
      isRequired: true,
      resolvedRequired: true,
      sectionRole: "hero",
      compositionPolicy: { selectionPolicy: "required" },
      allowedLayoutVariants: ["split-left"],
      components: [{
        componentInstanceId: "instance-1",
        itemKey: "title",
        componentVersionId: "component-v1",
        isRequired: true,
        isLocked: false,
        fields: [{
          fieldKey: "text",
          name: "Title",
          fieldKind: "text",
          textType: "title",
          isRequired: true,
          isLocked: false,
          defaultValue: "",
        }],
        definition: {
          id: "instance-1",
          itemKey: "title",
          name: "Title",
          fieldKind: "text",
          textType: "title",
          isRequired: true,
          fields: [],
        },
      }],
    }],
  }],
};

const schema = pageCompositionSchema(candidates);
assert.equal(schema.additionalProperties, false);
assert.equal(schema.properties.sections.items.additionalProperties, false);

const result = {
  templateId: "template-1",
  designTokenSetVersionId: "tokens-v1",
  sections: [{
    sectionId: "section-1",
    visible: true,
    sortOrder: 10,
    layoutVariant: "split-left",
    motionPresetKey: "fade-up",
    components: [{
      componentInstanceId: "instance-1",
      visible: true,
      contentBindings: [{ fieldKey: "text", sourceOverviewPath: "title" }],
    }],
  }],
  warnings: [],
  summary: "Hero composition",
};

const validated = validatePageCompositionProposal(result, candidates);
const snapshot = normalizePageComposition({
  validated,
  overview: { title: "Summer promotion" },
  documentId: "document-1",
  documentRevision: 0,
  proposalId: "proposal-1",
  overviewFingerprint: "overview-hash",
  candidateFingerprint: candidates.candidateFingerprint,
  promptExecutionSnapshot: { promptId: "prompt-1", model: "gpt-4.1-mini" },
});
assert.equal(snapshot.contractVersion, 2);
assert.equal(snapshot.content.sectionSnapshot.length, 1);
assert.equal(snapshot.content.sectionSnapshot[0].sourceSectionKey, "hero");
const sectionKey = snapshot.content.sectionOrder[0];
const itemKey = snapshot.content.sectionSnapshot[0].items[0].itemKey;
assert.equal(snapshot.content.sectionInputs[sectionKey][itemKey], "Summer promotion");
assert.equal(snapshot.motionSpec.sections[sectionKey].presetVersionId, "motion-v1");

assert.throws(() => validatePageCompositionProposal({
  ...result,
  sections: [],
}, candidates), /Required section|at least one section/);

console.log("Promo page composition contract tests passed");
