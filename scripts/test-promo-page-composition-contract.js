const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const {
  pageCompositionSchema,
  validatePageCompositionProposal,
  normalizePageComposition,
} = require("../api/_promo-page-composition-contract");
const {
  generateValidatedComposition,
} = require("../api/_promo-page-composition-service");

const candidateSource = fs.readFileSync(path.resolve(__dirname, "../api/_promo-page-composition-candidates.js"), "utf8");
assert.match(candidateSource, /policy\.layoutLocked[\s\S]*defaultLayoutKey/);

const candidates = {
  candidateFingerprint: "candidate-hash",
  tokenSets: [{
    tokenSetId: "tokens",
    tokenSetVersionId: "tokens-v1",
    runtimeValues: {
      "--app-bg": "#000000",
      "--app-ink": "#ffffff",
      "--promo-font-size-main-title": "68px",
      "--app-font-weight-title": "950",
    },
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
assert.equal(snapshot.designSpec.theme.backgroundColor, "#000000");
assert.equal(snapshot.designSpec.theme.textColor, "#ffffff");
assert.deepEqual(snapshot.designSpec.itemStyles[`${sectionKey}.${itemKey}`], {
  colorToken: "--app-ink",
  fontSizeToken: "--promo-font-size-main-title",
  fontWeightToken: "--app-font-weight-title",
});

const layoutPreset = {
  layoutKey: "hero-standard",
  name: "Hero Standard",
  isDefault: true,
  layoutSnapshot: {
    contractVersion: 1,
    layoutMode: "free",
    sectionStyle: { minHeight: 480, backgroundColor: "#101820" },
    viewports: {
      desktop: {
        items: {
          title: { positionMode: "free", xPct: 8, yPx: 80, widthPct: 54, heightPx: 110, zIndex: 2 },
        },
        visibility: { items: {} },
      },
      mobile: {
        items: {
          title: { positionMode: "free", xPct: 6, yPx: 48, widthPct: 88, heightPx: 96, zIndex: 2 },
        },
        visibility: { items: {} },
      },
    },
  },
};
const presetCandidates = JSON.parse(JSON.stringify(candidates));
presetCandidates.templates[0].sections[0].allowedLayoutVariants = ["hero-standard"];
presetCandidates.templates[0].sections[0].layoutPresets = [layoutPreset];
presetCandidates.templates[0].sections[0].aiDesign = {
  enabled: true,
  allowedLayoutVariants: ["hero-standard"],
};
const presetValidated = validatePageCompositionProposal({
  ...result,
  sections: [{ ...result.sections[0], layoutVariant: "hero-standard" }],
}, presetCandidates);
const presetSnapshot = normalizePageComposition({
  validated: presetValidated,
  overview: { title: "Preset promotion" },
  documentId: "document-preset",
  proposalId: "proposal-preset",
  overviewFingerprint: "overview-preset",
  candidateFingerprint: "candidate-preset",
});
const presetSectionKey = presetSnapshot.content.sectionOrder[0];
const presetItemKey = presetSnapshot.content.sectionSnapshot[0].items[0].itemKey;
const presetStyleKey = `${presetSectionKey}.${presetItemKey}`;
assert.equal(presetSnapshot.designSpec.sectionStyles[presetSectionKey].minHeight, 480);
assert.equal(presetSnapshot.designSpec.itemStyles[presetStyleKey].xPct, 8);
assert.equal(presetSnapshot.designSpec.itemStyles[presetStyleKey].colorToken, "--app-ink");
assert.equal(presetSnapshot.designSpec.responsiveLayouts.mobile.itemStyles[presetStyleKey].xPct, 6);
assert.equal(presetSnapshot.content.sectionSnapshot[0].selectedLayoutKey, "hero-standard");

assert.throws(() => validatePageCompositionProposal({
  ...result,
  sections: [],
}, candidates), /Required section|at least one section/);

const duplicateValidated = validatePageCompositionProposal({
  ...result,
  sections: [result.sections[0], result.sections[0]],
}, candidates);
assert.equal(duplicateValidated.sections.length, 1);
assert.match(duplicateValidated.warnings[0], /Section instance limit was applied/);

const repeatableCandidates = JSON.parse(JSON.stringify(candidates));
repeatableCandidates.templates[0].sections[0].compositionPolicy = {
  selectionPolicy: "required",
  duplicatePolicy: "limited",
  maxInstances: 2,
};
const repeatableValidated = validatePageCompositionProposal({
  ...result,
  sections: [result.sections[0], result.sections[0], result.sections[0]],
}, repeatableCandidates);
assert.equal(repeatableValidated.sections.length, 2);
assert.match(repeatableValidated.warnings[0], /max 2/);

const lockedCandidates = JSON.parse(JSON.stringify(candidates));
lockedCandidates.templates[0].sections[0].compositionPolicy = {
  selectionPolicy: "required",
  aiEditable: false,
  contentLocked: true,
};
const lockedValidated = validatePageCompositionProposal(result, lockedCandidates);
assert.equal(lockedValidated.sections[0].components[0].contentBindings.length, 0);
assert.match(lockedValidated.warnings[0], /AI content binding was ignored/);
const lockedSnapshot = normalizePageComposition({
  validated: lockedValidated,
  overview: { title: "Must not be bound" },
  documentId: "document-locked",
  proposalId: "proposal-locked",
  overviewFingerprint: "overview-locked",
  candidateFingerprint: "candidate-locked",
});
assert.equal(lockedSnapshot.content.sectionSnapshot[0].items[0].fields[0].isLocked, true);
assert.equal(lockedSnapshot.content.sectionInputs[
  lockedSnapshot.content.sectionOrder[0]
][lockedSnapshot.content.sectionSnapshot[0].items[0].itemKey], "");

const secondComponent = {
  ...candidates.templates[0].sections[0].components[0],
  componentInstanceId: "instance-2",
  itemKey: "description",
  isRequired: false,
};
const scopedCandidates = {
  ...candidates,
  templates: [{
    ...candidates.templates[0],
    sections: [
      {
        ...candidates.templates[0].sections[0],
        components: candidates.templates[0].sections[0].components,
      },
      {
        ...candidates.templates[0].sections[0],
        sectionId: "section-2",
        sectionKey: "details",
        isRequired: false,
        resolvedRequired: false,
        components: [secondComponent],
      },
    ],
  }],
};

assert.throws(() => validatePageCompositionProposal({
  ...result,
  sections: [{
    ...result.sections[0],
    components: [{
      componentInstanceId: "instance-2",
      visible: true,
      contentBindings: [],
    }],
  }],
}, scopedCandidates), (error) => error.code === "COMPONENT_NOT_IN_SECTION");

const ctaCandidates = JSON.parse(JSON.stringify(candidates));
ctaCandidates.templates[0].sections[0].components[0].fields[0].fieldKind = "cta";
ctaCandidates.templates[0].sections[0].components[0].definition.fieldKind = "cta";
assert.throws(
  () => validatePageCompositionProposal(result, ctaCandidates),
  (error) => error.code === "INVALID_CONTENT_BINDING",
);
const ctaResult = {
  ...result,
  sections: [{
    ...result.sections[0],
    components: [{
      ...result.sections[0].components[0],
      contentBindings: [{ fieldKey: "text", sourceOverviewPath: "ctaLabel" }],
    }],
  }],
};
const ctaValidated = validatePageCompositionProposal(ctaResult, ctaCandidates);
const ctaSnapshot = normalizePageComposition({
  validated: ctaValidated,
  overview: { ctaLabel: "지금 참여하기" },
  documentId: "document-cta",
  proposalId: "proposal-cta",
  overviewFingerprint: "overview-cta",
  candidateFingerprint: "candidate-cta",
});
assert.equal(
  ctaSnapshot.content.sectionInputs[ctaSnapshot.content.sectionOrder[0]][ctaSnapshot.content.sectionSnapshot[0].items[0].itemKey].label,
  "지금 참여하기",
);
assert.throws(
  () => normalizePageComposition({
    validated: ctaValidated,
    overview: { ctaLabel: "가".repeat(21) },
    documentId: "document-cta-long",
    proposalId: "proposal-cta-long",
    overviewFingerprint: "overview-cta-long",
    candidateFingerprint: "candidate-cta-long",
  }),
  (error) => error.code === "CTA_LABEL_TOO_LONG",
);
const retryCandidates = {
  ...candidates,
  templates: [
    candidates.templates[0],
    {
      ...candidates.templates[0],
      templateId: "template-2",
      templateKey: "alternate",
      sections: [{
        ...candidates.templates[0].sections[0],
        sectionId: "section-other",
        sectionKey: "other",
      }],
    },
  ],
};
let generationAttempts = 0;
const retryResult = generateValidatedComposition({
  candidates: retryCandidates,
  promptConfig: {
    renderedPrompt: "Build the promotion",
    model: "test-model",
    promptLayers: {
      repairPrompts: {
        candidateScope: "Use only templateId {{templateId}}",
      },
    },
  },
  generate: async ({ schema, promptConfig }) => {
    generationAttempts += 1;
    if (generationAttempts === 1) {
      return {
        result: {
          ...result,
          sections: [{ ...result.sections[0], sectionId: "section-other" }],
        },
      };
    }
    assert.deepEqual(schema.properties.templateId.enum, ["template-1"]);
    assert.match(promptConfig.renderedPrompt, /Use only templateId template-1/);
    assert.match(promptConfig.renderedPromptHash, /^[0-9a-f]{64}$/);
    return { result };
  },
});

retryResult.then(({ validated: retried }) => {
  assert.equal(generationAttempts, 2);
  assert.equal(retried.template.templateId, "template-1");
  console.log("Promo page composition contract tests passed");
}).catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
