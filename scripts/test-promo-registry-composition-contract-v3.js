const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const {
  registryCompositionSchema,
  repairRegistryCompositionBindings,
  materializeRequiredSections,
  validateRegistryCompositionProposal,
  normalizeRegistryCompositionProposal,
} = require("../api/_promo-registry-composition-contract");
const {
  generateValidatedRegistryComposition,
} = require("../api/_promo-page-composition-service");
const {
  plannerRegistryCandidateSnapshot,
} = require("../api/_promo-registry-composition-candidates");

const titleComponent = {
  componentInstanceId: "hero-title-instance",
  componentVersionId: "title-v1",
  itemKey: "title",
  isRequired: true,
  isLocked: false,
  fields: [{ fieldKey: "text", fieldKind: "text", textType: "title" }],
};
const optionalHeroVisualComponent = {
  componentInstanceId: "hero-visual-instance",
  componentVersionId: "hero-visual-v1",
  itemKey: "visual",
  isRequired: false,
  isLocked: false,
  fields: [{ fieldKey: "image", fieldKind: "image" }],
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
  layoutReferences: [{
    layoutReferenceId: "layout-reference-v1",
    title: "Editorial conversion layout",
    pageType: "promotion",
    sectionTypes: ["hero", "content", "terms"],
    qualityScore: 4.7,
    matchScore: 96,
    layoutSpec: { rhythm: "editorial", density: "balanced" },
  }],
  resources: [termsResource],
  sections: [{
    sectionVersionId: "hero-v1",
    sectionKey: "hero",
    sectionRole: "hero",
    sortOrder: 10,
    resolvedRequired: true,
    compositionPolicy: { selectionPolicy: "required", duplicatePolicy: "forbidden", maxInstances: 1 },
    layoutPresets: [{ layoutKey: "hero-default" }],
    components: [titleComponent, optionalHeroVisualComponent],
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
  layoutReferenceId: "layout-reference-v1",
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
      contentItems: [],
    }],
  }, {
    sectionVersionId: "cards-v1",
    visible: true,
    sortOrder: 20,
    layoutKey: "cards-3-column",
    motionPresetVersionId: "",
    repeat: 1,
    components: [{
      componentInstanceId: "card-instance", visible: true, repeat: 3, contentBindings: [],
      contentItems: [
        { repeatIndex: 0, fields: [{ fieldKey: "description", value: "신규 고객 즉시 할인" }] },
        { repeatIndex: 1, fields: [{ fieldKey: "description", value: "무료 배송 혜택" }] },
        { repeatIndex: 2, fields: [{ fieldKey: "description", value: "멤버십 추가 적립" }] },
      ],
    }],
  }, {
    sectionVersionId: "terms-v1",
    visible: true,
    sortOrder: 90,
    layoutKey: "terms-default",
    motionPresetVersionId: "",
    repeat: 1,
    components: [{ componentInstanceId: "terms-content-instance", visible: true, repeat: 1, contentBindings: [], contentItems: [] }],
  }],
  warnings: [],
  summary: "Hero, three cards and pinned common terms",
};

const schema = registryCompositionSchema(candidates);
assert.equal(schema.additionalProperties, false);
assert.deepEqual(schema.properties.contractVersion.enum, [3]);
assert.deepEqual(schema.properties.shellVersionId.enum, ["shell-v1"]);
assert.deepEqual(schema.properties.layoutReferenceId.enum, ["", "layout-reference-v1"]);
assert(schema.properties.sections.items.properties.components.items.required.includes("contentItems"));
const generatedContentFieldKeys = schema.properties.sections.items.properties.components.items
  .properties.contentItems.items.properties.fields.items.properties.fieldKey.enum;
assert.equal(generatedContentFieldKeys.includes("image"), false);
assert.equal(generatedContentFieldKeys.includes("description"), true);
assert.equal(generatedContentFieldKeys.includes("button"), true);
const plannerCandidates = plannerRegistryCandidateSnapshot(candidates);
const plannerCardFields = plannerCandidates.sections
  .find((section) => section.sectionVersionId === "cards-v1")
  .components[0].fields;
assert.equal(plannerCardFields.find((field) => field.fieldKey === "image").aiCopyAllowed, false);
assert.equal(plannerCardFields.find((field) => field.fieldKey === "description").aiCopyAllowed, true);

const validated = validateRegistryCompositionProposal(validResult, candidates);
assert.equal(validated.sections[1].components[0].repeat, 3);
assert.equal(validated.layoutReference.layoutReferenceId, "layout-reference-v1");
assert.throws(() => validateRegistryCompositionProposal({
  ...validResult,
  layoutReferenceId: "unapproved-layout-reference",
}, candidates), (error) => error.code === "LAYOUT_REFERENCE_NOT_ALLOWED");
assert.equal(validated.sections[1].components[0].contentItems[2].fields[0].value, "멤버십 추가 적립");
assert.throws(() => validateRegistryCompositionProposal({
  ...validResult,
  sections: validResult.sections.map((section) => section.sectionVersionId === "cards-v1"
    ? {
      ...section,
      components: [{
        ...section.components[0],
        contentItems: [0, 1, 2].map((repeatIndex) => ({
          repeatIndex,
          fields: [{ fieldKey: "description", value: "동일한 혜택" }],
        })),
      }],
    } : section),
}, candidates), (error) => error.code === "DUPLICATE_COLLECTION_CONTENT");
assert.equal(validated.sections[2].resourceReferences[0].resourceVersionId, "terms-ko-v2");
const requiredMaterialized = materializeRequiredSections({
  ...validResult,
  sections: validResult.sections.filter((section) => section.sectionVersionId === "cards-v1"),
}, candidates);
assert.deepEqual(
  new Set(requiredMaterialized.sections.map((section) => section.sectionVersionId)),
  new Set(["hero-v1", "cards-v1", "terms-v1"]),
);
const materializedHero = requiredMaterialized.sections.find((section) => section.sectionVersionId === "hero-v1");
assert.deepEqual(materializedHero.components.map((component) => component.componentInstanceId), ["hero-title-instance"]);
assert.throws(() => validateRegistryCompositionProposal({
  ...validResult,
  sections: validResult.sections.filter((section) => section.sectionVersionId === "cards-v1"),
}, candidates), (error) => error.code === "COMPONENT_CONTENT_INCOMPLETE");
assert.throws(() => validateRegistryCompositionProposal({
  ...validResult,
  sections: validResult.sections.map((section) => section.sectionVersionId === "hero-v1"
    ? {
      ...section,
      components: section.components.map((component) => ({
        ...component,
        contentBindings: [],
        contentItems: [],
      })),
    }
    : section),
}, candidates), (error) => error.code === "COMPONENT_CONTENT_INCOMPLETE");
const defaultContentCandidates = JSON.parse(JSON.stringify(candidates));
defaultContentCandidates.sections[0].components[0].fields[0].defaultValue = "기본 히어로 제목";
const defaultContentValidated = validateRegistryCompositionProposal({
  ...validResult,
  sections: validResult.sections.map((section) => section.sectionVersionId === "hero-v1"
    ? {
      ...section,
      components: section.components.map((component) => ({
        ...component,
        contentBindings: [],
        contentItems: [],
      })),
    }
    : section),
}, defaultContentCandidates);
assert.equal(defaultContentValidated.sections[0].components[0].itemKey, "title");
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
assert.throws(() => validateRegistryCompositionProposal({
  ...validResult,
  sections: validResult.sections.map((section) => section.sectionVersionId === "cards-v1"
    ? {
      ...section,
      components: [{
        ...section.components[0],
        contentBindings: [{ fieldKey: "image", sourceOverviewPath: "mainOffer" }],
      }],
    } : section),
}, candidates), (error) => error.code === "INVALID_CONTENT_BINDING");
assert.throws(() => validateRegistryCompositionProposal({
  ...validResult,
  sections: validResult.sections.map((section) => section.sectionVersionId === "cards-v1"
    ? {
      ...section,
      components: [{
        ...section.components[0],
        contentItems: [{ repeatIndex: 0, fields: [{ fieldKey: "image", value: "invalid copy" }] }],
      }],
    } : section),
}, candidates), (error) => error.code === "INVALID_GENERATED_CONTENT_FIELD");
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
    ? { ...section, components: [{ componentInstanceId: "card-instance", visible: true, repeat: 1, contentBindings: [], contentItems: [] }] }
    : section),
}, candidates), (error) => error.code === "COMPONENT_NOT_IN_SECTION");

const crossComponentBinding = JSON.parse(JSON.stringify(validResult));
crossComponentBinding.sections[0].components[0].contentBindings = [{
  fieldKey: "fld_8c82abe43a1f4a7a9a160875bdc08ed0",
  sourceOverviewPath: "ctaLabel",
}];
const repairedCrossComponentBinding = repairRegistryCompositionBindings(
  crossComponentBinding,
  candidates,
);
assert.deepEqual(repairedCrossComponentBinding.result.sections[0].components[0].contentBindings, [{
  fieldKey: "text",
  sourceOverviewPath: "title",
}]);
assert.equal(repairedCrossComponentBinding.repairs.length, 1);
assert.match(repairedCrossComponentBinding.result.warnings.at(-1), /Content binding repaired/);
assert.doesNotThrow(() => validateRegistryCompositionProposal(
  repairedCrossComponentBinding.result,
  candidates,
));

const ambiguousCandidates = JSON.parse(JSON.stringify(candidates));
ambiguousCandidates.sections[0].components[0].fields.push({
  fieldKey: "subtitle",
  fieldKind: "text",
  textType: "subtitle",
});
const ambiguousBinding = repairRegistryCompositionBindings(
  crossComponentBinding,
  ambiguousCandidates,
);
assert.equal(ambiguousBinding.repairs.length, 0);
assert.throws(() => validateRegistryCompositionProposal(
  ambiguousBinding.result,
  ambiguousCandidates,
), (error) => error.code === "INVALID_CONTENT_BINDING");

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
assert.equal(snapshot.compositionMeta.layoutReference.layoutReferenceId, "layout-reference-v1");
assert.equal(snapshot.compositionSpec.layoutReference.layoutSpec.rhythm, "editorial");
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

  let invalidJsonAttempts = 0;
  const invalidJsonRepaired = await generateValidatedRegistryComposition({
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
      invalidJsonAttempts += 1;
      if (invalidJsonAttempts === 1) {
        throw Object.assign(new Error("Unexpected token at position 8271"), {
          code: "PLANNER_OUTPUT_JSON_INVALID",
          retryable: true,
        });
      }
      assert.match(promptConfig.renderedPrompt, /PLANNER_OUTPUT_JSON_INVALID/);
      assert.match(promptConfig.renderedPrompt, /Unexpected token at position 8271/);
      return { result: validResult };
    },
  });
  assert.equal(invalidJsonRepaired.repaired, true);
  assert.equal(invalidJsonAttempts, 2);

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

  let crossComponentAttempts = 0;
  const automaticallyRepairedBinding = await generateValidatedRegistryComposition({
    candidates,
    promptConfig: {
      renderedPrompt: "Compose from approved Registry candidates.",
      promptLayers: { repairPrompts: { contractV3: "Repair {{errorCode}} {{errorMessage}}." } },
    },
    generate: async () => {
      crossComponentAttempts += 1;
      return { result: crossComponentBinding };
    },
  });
  assert.equal(automaticallyRepairedBinding.repaired, true);
  assert.equal(crossComponentAttempts, 1);
  assert.deepEqual(automaticallyRepairedBinding.bindingRepairs, [{
    sectionKey: "hero",
    componentKey: "title",
    fromFieldKey: "fld_8c82abe43a1f4a7a9a160875bdc08ed0",
    toFieldKey: "text",
    fromOverviewPath: "ctaLabel",
    toOverviewPath: "title",
  }]);

  const proposalApi = fs.readFileSync(path.resolve(__dirname, "../api/promo-page-composition-proposals.js"), "utf8");
  const applyApi = fs.readFileSync(path.resolve(__dirname, "../api/promo-page-composition-apply.js"), "utf8");
  const previewApi = fs.readFileSync(path.resolve(__dirname, "../api/promo-page-composition-preview.js"), "utf8");
  const runtimeCompiler = fs.readFileSync(path.resolve(__dirname, "../api/_promo-registry-composition-runtime.js"), "utf8");
  const serviceSource = fs.readFileSync(path.resolve(__dirname, "../api/_promo-page-composition-service.js"), "utf8");
  assert.match(proposalApi, /contractVersion: 3/);
  assert.match(proposalApi, /sourceTemplateId: null/);
  assert.match(proposalApi, /plannerRegistryCandidateSnapshot/);
  assert.match(proposalApi, /requireEveryVisibleNonImageComponentContent:\s*true/);
  assert.match(proposalApi, /requireDistinctRepeatedCopy:\s*true/);
  assert.match(proposalApi, /contentBindingFieldMustBelongToSelectedComponent:\s*true/);
  assert.match(proposalApi, /ctaLabelOnlyTargetsCtaFields:\s*true/);
  assert.match(proposalApi, /ctaFieldsAcceptOnlyCtaLabel:\s*true/);
  assert.match(serviceSource, /Number\(row\.contract_version \|\| 2\) === 3/);
  assert.match(serviceSource, /setProposalStage/);
  assert.match(applyApi, /compileCurrentRegistryProposal/);
  assert.match(applyApi, /FINAL_RENDER_MISMATCH/);
  assert.match(previewApi, /compileCurrentRegistryProposal/);
  assert.match(previewApi, /renderFingerprint/);
  assert.match(runtimeCompiler, /POLICY_FINGERPRINT_MISMATCH/);
  assert.match(runtimeCompiler, /RESOURCE_FINGERPRINT_MISMATCH/);
  assert.match(runtimeCompiler, /compileRegistryComposition/);
  assert.doesNotMatch(applyApi, /V3_COMPOSITION_COMPILER_NOT_READY/);
  console.log("Promo Registry Composition Contract v3 and Worker tests passed");
})().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
