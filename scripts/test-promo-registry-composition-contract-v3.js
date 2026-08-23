const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const {
  registryCompositionSchema,
  materializeRequiredSections,
  validateRegistryCompositionProposal,
  normalizeRegistryCompositionProposal,
} = require("../api/_promo-registry-composition-contract");
const {
  generateValidatedRegistryComposition,
} = require("../api/_promo-page-composition-service");

const titleComponent = {
  componentInstanceId: "hero-title-instance",
  componentVersionId: "title-v1",
  itemKey: "title",
  isRequired: true,
  isLocked: false,
  fields: [{ fieldKey: "text", fieldKind: "text", textType: "title" }],
};
const cardComponent = {
  componentInstanceId: "card-instance",
  componentVersionId: "card-v1",
  itemKey: "card",
  isRequired: true,
  isLocked: false,
  collection: { enabled: true, minItems: 1, maxItems: 3, layout: "grid", desktopColumns: 3, mobileColumns: 1 },
  fields: [
    { fieldKey: "image", fieldKind: "image" },
    { fieldKey: "description", fieldKind: "text", textType: "remark" },
    { fieldKey: "button", fieldKind: "cta" },
  ],
};
const termsResource = {
  resourceId: "terms-resource",
  resourceKey: "common-terms",
  resourceType: "terms",
  resourceVersionId: "terms-ko-v2",
  version: 2,
  locale: "ko-KR",
  contentHash: "terms-hash",
  marketRuleId: "terms-rule-kr",
  sectionRole: "terms",
  required: true,
};
const candidates = {
  contractVersion: 3,
  shell: { shellVersionId: "shell-v1", shellKey: "default-shell", version: 1 },
  candidateFingerprint: "candidate-hash",
  policyFingerprint: "policy-hash",
  resourceFingerprint: "resource-hash",
  tokenSets: [{ tokenSetVersionId: "tokens-v1", setKey: "default" }],
  motionPresets: [{ presetVersionId: "motion-v1", presetKey: "fade-up" }],
  resources: [termsResource],
  sections: [{
    sectionVersionId: "hero-v1",
    sectionKey: "hero",
    sectionRole: "hero",
    sortOrder: 10,
    resolvedRequired: true,
    compositionPolicy: { selectionPolicy: "required", duplicatePolicy: "forbidden", maxInstances: 1 },
    layoutPresets: [{ layoutKey: "hero-default" }],
    components: [titleComponent],
  }, {
    sectionVersionId: "cards-v1",
    sectionKey: "cards",
    sectionRole: "content",
    sortOrder: 20,
    resolvedRequired: false,
    compositionPolicy: { selectionPolicy: "optional", duplicatePolicy: "limited", maxInstances: 3 },
    layoutPresets: [{ layoutKey: "cards-3-column" }],
    components: [cardComponent],
  }, {
    sectionVersionId: "terms-v1",
    sectionKey: "terms",
    sectionRole: "terms",
    sortOrder: 90,
    fixedPosition: "bottom",
    resolvedRequired: true,
    compositionPolicy: { selectionPolicy: "required", contentLocked: true, aiEditable: false, duplicatePolicy: "forbidden" },
    layoutPresets: [{ layoutKey: "terms-default" }],
    components: [{
      componentInstanceId: "terms-content-instance",
      componentVersionId: "terms-content-v1",
      itemKey: "content",
      isRequired: true,
      isLocked: true,
      fields: [{ fieldKey: "content", fieldKind: "text", textType: "multi" }],
    }],
    resourceReferences: [termsResource],
  }],
};

const validResult = {
  contractVersion: 3,
  shellVersionId: "shell-v1",
  designTokenSetVersionId: "tokens-v1",
  sections: [{
    sectionVersionId: "hero-v1",
    visible: true,
    sortOrder: 10,
    layoutKey: "hero-default",
    motionPresetVersionId: "motion-v1",
    repeat: 1,
    components: [{
      componentInstanceId: "hero-title-instance",
      visible: true,
      repeat: 1,
      contentBindings: [{ fieldKey: "text", sourceOverviewPath: "title" }],
    }],
  }, {
    sectionVersionId: "cards-v1",
    visible: true,
    sortOrder: 20,
    layoutKey: "cards-3-column",
    motionPresetVersionId: "",
    repeat: 1,
    components: [{ componentInstanceId: "card-instance", visible: true, repeat: 3, contentBindings: [] }],
  }, {
    sectionVersionId: "terms-v1",
    visible: true,
    sortOrder: 90,
    layoutKey: "terms-default",
    motionPresetVersionId: "",
    repeat: 1,
    components: [{ componentInstanceId: "terms-content-instance", visible: true, repeat: 1, contentBindings: [] }],
  }],
  warnings: [],
  summary: "Hero, three cards and pinned common terms",
};

const schema = registryCompositionSchema(candidates);
assert.equal(schema.additionalProperties, false);
assert.deepEqual(schema.properties.contractVersion.enum, [3]);
assert.deepEqual(schema.properties.shellVersionId.enum, ["shell-v1"]);

const validated = validateRegistryCompositionProposal(validResult, candidates);
assert.equal(validated.sections[1].components[0].repeat, 3);
assert.equal(validated.sections[2].resourceReferences[0].resourceVersionId, "terms-ko-v2");
const requiredMaterialized = materializeRequiredSections({
  ...validResult,
  sections: validResult.sections.filter((section) => section.sectionVersionId === "cards-v1"),
}, candidates);
assert.deepEqual(
  new Set(requiredMaterialized.sections.map((section) => section.sectionVersionId)),
  new Set(["hero-v1", "cards-v1", "terms-v1"]),
);
const validatedMaterialized = validateRegistryCompositionProposal({
  ...validResult,
  sections: validResult.sections.filter((section) => section.sectionVersionId === "cards-v1"),
}, candidates);
assert.deepEqual(validatedMaterialized.sections.map((section) => section.sectionVersionId), ["hero-v1", "cards-v1", "terms-v1"]);
assert.throws(() => validateRegistryCompositionProposal({
  ...validResult,
  sections: validResult.sections.map((section) => section.sectionVersionId === "cards-v1"
    ? {
      ...section,
      components: [{
        ...section.components[0],
        contentBindings: [{ fieldKey: "button", sourceOverviewPath: "mainOffer" }],
      }],
    } : section),
}, candidates), (error) => error.code === "INVALID_CONTENT_BINDING");
const ctaBound = validateRegistryCompositionProposal({
  ...validResult,
  sections: validResult.sections.map((section) => section.sectionVersionId === "cards-v1"
    ? {
      ...section,
      components: [{
        ...section.components[0],
        contentBindings: [{ fieldKey: "button", sourceOverviewPath: "ctaLabel" }],
      }],
    } : section),
}, candidates);
assert.equal(ctaBound.sections[1].components[0].contentBindings[0].sourceOverviewPath, "ctaLabel");
assert.throws(() => validateRegistryCompositionProposal({
  ...validResult,
  sections: validResult.sections.map((section) => (
    section.sectionVersionId === "cards-v1" ? {
      ...section,
      components: section.components.map((component) => ({ ...component, repeat: 4 })),
    } : section
  )),
}, candidates), (error) => error.code === "COMPONENT_COLLECTION_LIMIT_EXCEEDED");
assert.throws(() => validateRegistryCompositionProposal({
  ...validResult,
  sections: [...validResult.sections, validResult.sections[1]],
}, candidates), (error) => error.code === "DUPLICATE_SECTION_SELECTION");
assert.throws(() => validateRegistryCompositionProposal({
  ...validResult,
  sections: validResult.sections.map((section) => section.sectionVersionId === "hero-v1"
    ? { ...section, components: [{ componentInstanceId: "card-instance", visible: true, repeat: 1, contentBindings: [] }] }
    : section),
}, candidates), (error) => error.code === "COMPONENT_NOT_IN_SECTION");

const snapshot = normalizeRegistryCompositionProposal({
  validated,
  documentId: "document-v3",
  documentRevision: 0,
  proposalId: "proposal-v3",
  overviewFingerprint: "overview-hash",
  candidateFingerprint: candidates.candidateFingerprint,
  policyFingerprint: candidates.policyFingerprint,
  resourceFingerprint: candidates.resourceFingerprint,
  layoutFitRepairs: [{
    sectionVersionId: "hero-v1",
    fromLayoutKey: "hero-default",
    toLayoutKey: "hero-center-wide",
    scoreDelta: 42,
  }],
  promptExecutionSnapshot: { promptId: "prompt-v2", model: "gpt-4.1-mini" },
});
assert.equal(snapshot.contractVersion, 3);
assert.equal(snapshot.snapshotType, "registry-composition-proposal");
assert.equal(snapshot.compositionMeta.mode, "ai-composition");
assert.equal(Object.hasOwn(snapshot.compositionMeta, "sourceTemplateId"), false);
assert.deepEqual(snapshot.compositionMeta.layoutFitRepairs, [{
  sectionVersionId: "hero-v1",
  fromLayoutKey: "hero-default",
  toLayoutKey: "hero-center-wide",
  scoreDelta: 42,
}]);
assert.equal(snapshot.compositionSpec.resourceReferences[0].contentHash, "terms-hash");
assert.equal(Object.hasOwn(snapshot.compositionSpec.resourceReferences[0], "content"), false);
assert.equal(snapshot.compositionSpec.sections[1].components[0].repeat, 3);
assert.equal(snapshot.preview.sections[1].componentRepeats.card, 3);
assert.deepEqual(snapshot.preview.sections[2].resourceKeys, ["common-terms"]);
assert.equal(snapshot.preview.sections[0].required, true);
assert.equal(snapshot.preview.sections[2].fixedPosition, "bottom");
assert.equal(snapshot.preview.sections[2].sequence, 3);
assert.equal(snapshot.preview.resources[0].locale, "ko-KR");

(async () => {
  const stages = [];
  let attempts = 0;
  const generated = await generateValidatedRegistryComposition({
    candidates,
    promptConfig: {
      renderedPrompt: "Compose from approved Registry candidates.",
      promptLayers: {
        repairPrompts: {
          contractV3: "Repair {{errorCode}} {{errorMessage}} using {{shellVersionId}} and {{sectionVersionIds}}.",
        },
      },
    },
    onStage: async (stage) => stages.push(stage),
    generate: async () => {
      attempts += 1;
      return { result: attempts === 1 ? { ...validResult, shellVersionId: "invalid-shell" } : validResult };
    },
  });
  assert.equal(generated.repaired, true);
  assert.equal(attempts, 2);
  assert.deepEqual(stages, ["validating", "repairing"]);

  const fitCandidates = JSON.parse(JSON.stringify(candidates));
  const fitHero = fitCandidates.sections.find((section) => section.sectionVersionId === "hero-v1");
  fitHero.defaultLayoutKey = "hero-default";
  fitHero.layoutSelectionLocked = false;
  fitHero.layoutPresets.push({ layoutKey: "hero-center-wide" });
  fitHero.layoutFit = {
    recommendedLayoutKey: "hero-center-wide",
    scores: [
      { layoutKey: "hero-default", score: 10, reasons: ["default"] },
      { layoutKey: "hero-center-wide", score: 54, reasons: ["long-headline-fit"] },
    ],
  };
  const fitRepaired = await generateValidatedRegistryComposition({
    candidates: fitCandidates,
    promptConfig: {
      renderedPrompt: "Compose from approved Registry candidates.",
      promptLayers: { repairPrompts: { contractV3: "Repair {{errorCode}} {{errorMessage}}." } },
    },
    generate: async () => ({ result: validResult }),
  });
  assert.equal(fitRepaired.repaired, true);
  assert.equal(fitRepaired.validated.sections[0].layoutKey, "hero-center-wide");
  assert.deepEqual(fitRepaired.layoutFitRepairs, [{
    sectionVersionId: "hero-v1",
    fromLayoutKey: "hero-default",
    toLayoutKey: "hero-center-wide",
    scoreDelta: 44,
  }]);

  let bindingAttempts = 0;
  const repairedBinding = await generateValidatedRegistryComposition({
    candidates,
    promptConfig: {
      renderedPrompt: "Compose from approved Registry candidates.",
      promptLayers: {
        repairPrompts: {
          contractV3: "Repair {{errorCode}} {{errorMessage}} using {{shellVersionId}} and {{sectionVersionIds}}.",
        },
      },
    },
    generate: async ({ promptConfig }) => {
      bindingAttempts += 1;
      if (bindingAttempts === 1) {
        return {
          result: {
            ...validResult,
            sections: validResult.sections.map((section) => section.sectionVersionId === "cards-v1"
              ? {
                ...section,
                components: [{
                  ...section.components[0],
                  contentBindings: [{ fieldKey: "button", sourceOverviewPath: "mainOffer" }],
                }],
              }
              : section),
          },
        };
      }
      assert.match(promptConfig.renderedPrompt, /INVALID_CONTENT_BINDING/);
      assert.match(promptConfig.renderedPrompt, /CTA fields accept only ctaLabel/);
      return { result: validResult };
    },
  });
  assert.equal(repairedBinding.repaired, true);
  assert.equal(bindingAttempts, 2);

  const proposalApi = fs.readFileSync(path.resolve(__dirname, "../api/promo-page-composition-proposals.js"), "utf8");
  const applyApi = fs.readFileSync(path.resolve(__dirname, "../api/promo-page-composition-apply.js"), "utf8");
  const serviceSource = fs.readFileSync(path.resolve(__dirname, "../api/_promo-page-composition-service.js"), "utf8");
  assert.match(proposalApi, /contractVersion: 3/);
  assert.match(proposalApi, /sourceTemplateId: null/);
  assert.match(proposalApi, /plannerRegistryCandidateSnapshot/);
  assert.match(serviceSource, /Number\(row\.contract_version \|\| 2\) === 3/);
  assert.match(serviceSource, /setProposalStage/);
  assert.match(applyApi, /POLICY_FINGERPRINT_MISMATCH/);
  assert.match(applyApi, /RESOURCE_FINGERPRINT_MISMATCH/);
  assert.match(applyApi, /compileRegistryComposition/);
  assert.doesNotMatch(applyApi, /V3_COMPOSITION_COMPILER_NOT_READY/);
  console.log("Promo Registry Composition Contract v3 and Worker tests passed");
})().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
