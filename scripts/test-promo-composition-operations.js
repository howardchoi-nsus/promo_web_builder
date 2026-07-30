const assert = require("node:assert/strict");
const {
  compositionOperationSchema,
  validateCompositionOperations,
  applyCompositionOperations,
} = require("../api/_promo-page-composition-operations");

const snapshot = {
  contractVersion: 2,
  documentRevision: 1,
  content: {
    formTemplate: { designTokens: { values: { "--app-color-accent": "#d30000" } } },
    sectionOrder: ["sec_1"],
    sectionInputs: { sec_1: { cmp_1: "Old title" } },
    sectionSnapshot: [{
      sectionKey: "sec_1",
      pageSectionInstanceId: "sec_1",
      fixedPosition: null,
      isRequired: true,
      compositionPolicy: { allowedLayoutVariants: ["split-left"] },
      items: [{
        id: "cmp_1",
        itemKey: "cmp_1",
        sourceItemKey: "title",
        isRequired: true,
        isLocked: false,
        userReorderAllowed: true,
        fields: [{
          fieldKey: "text",
          fieldKind: "text",
          isRequired: true,
          isLocked: false,
        }],
      }],
    }],
  },
  designSpec: {
    visibility: { items: {}, fields: {} },
    sectionStyles: {},
    itemStyles: {},
  },
  motionSpec: { sections: {}, items: {} },
  assets: { contractVersion: 1, items: {}, requests: [] },
};
const motion = [{ presetKey: "fade-up", presetVersionId: "motion-1" }];
const schema = compositionOperationSchema(snapshot, motion);
assert.equal(schema.additionalProperties, false);
assert.equal(schema.properties.operations.items.additionalProperties, false);

const result = {
  operations: [{
    operationId: "op-1",
    type: "update-field",
    targetInstanceId: "cmp_1",
    fieldKey: "text",
    valueText: "New title",
    visible: true,
    position: 0,
    layoutVariant: "",
    tokenKey: "",
    motionPresetVersionId: "",
    reason: "Update the headline",
  }],
  summary: "Title updated",
  warnings: [],
};
const validated = validateCompositionOperations(result, snapshot, motion);
const next = applyCompositionOperations(snapshot, validated.operations);
assert.equal(next.content.sectionInputs.sec_1.cmp_1, "New title");
assert.equal(snapshot.content.sectionInputs.sec_1.cmp_1, "Old title");

assert.throws(() => validateCompositionOperations({
  ...result,
  operations: [{ ...result.operations[0], type: "set-visibility", visible: false }],
}, snapshot, motion), /visibility cannot change/);

console.log("Promo composition operation tests passed");
