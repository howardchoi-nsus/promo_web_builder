const assert = require("node:assert/strict");
const applyModule = require("../api/promo-section-design-apply");
const { defaultConstraints, inputHash, layoutPatchFromResult, resolveImageTarget } = require("../api/_promo-section-design-contract");

const section = {
  sectionKey: "heroBanner",
  name: "Hero",
  isVisible: true,
  items: [
    { itemKey: "title", fieldKind: "text", isLocked: false, isVisibleInWizard: true },
  ],
};
const layout = { layoutRevision: 8, layoutSpec: { sectionStyles: {}, itemStyles: {} } };
const constraints = defaultConstraints(section, layout.layoutSpec);
const layoutResult = layoutPatchFromResult(section, {
  layoutVariant: "split-right",
  minHeight: 520,
  imagePrompt: "Premium promotion visual",
  rationale: "Copy remains readable.",
}, constraints);
const run = {
  id: "run-id",
  formTemplateId: "template-id",
  templateVersion: 2,
  layoutRevision: 8,
  sectionKey: "heroBanner",
  status: "ready",
  inputSnapshot: {
    design: { backgroundColor: "#f5f7fb" },
    section: { sectionInputs: { title: "Welcome" } },
  },
  constraintsSnapshot: constraints,
  layoutResult,
};

function responseRecorder() {
  return {
    statusCode: 200,
    headers: {},
    body: null,
    setHeader(key, value) { this.headers[key] = value; },
    status(code) { this.statusCode = code; return this; },
    json(body) { this.body = body; return this; },
  };
}

function handlerFor(overrides = {}) {
  return applyModule.createHandler({
    getSql: () => ({ test: true }),
    parseBody: (body) => body || {},
    fetchRun: async () => structuredClone(run),
    fetchTemplateWithItems: async () => ({
      template: { id: "template-id", status: "active", version: 2 },
      sections: [structuredClone(section)],
    }),
    fetchLayoutRow: async () => structuredClone(layout),
    toLayout: (value) => value,
    toFormTemplate: (value) => value,
    transitionRun: async (_sql, _id, _from, status) => ({ ...run, status }),
    ...overrides,
  });
}

async function execute(handler, body = {
  runId: "run-id",
  sectionInputs: { title: "Welcome" },
  backgroundColor: "#f5f7fb",
}) {
  const res = responseRecorder();
  await handler({ method: "POST", body }, res);
  return res;
}

(async () => {
  let res = await execute(handlerFor());
  assert.equal(res.statusCode, 200);
  assert.equal(res.body.run.status, "applying");

  const itemSection = {
    ...section,
    aiDesign: {
      enabled: true,
      allowedLayoutVariants: ["split-right"],
      imageTarget: "item",
      imageTargetItemKeys: ["heroImage", "secondaryImage"],
      imageAspectRatio: "16:9",
    },
    items: [
      ...section.items,
      { itemKey: "heroImage", fieldKind: "image", isLocked: false, isVisibleInWizard: true, image: { allowedSources: ["ai"] } },
      { itemKey: "secondaryImage", fieldKind: "image", isLocked: false, isVisibleInWizard: true, image: { allowedSources: ["ai"] } },
    ],
  };
  const selectedConstraints = resolveImageTarget(
    defaultConstraints(itemSection, layout.layoutSpec),
    itemSection.sectionKey,
    "secondaryImage"
  ).constraints;
  const selectedRun = {
    ...run,
    constraintsSnapshot: selectedConstraints,
    layoutResult: layoutPatchFromResult(itemSection, {
      layoutVariant: "split-right",
      minHeight: 520,
      imagePrompt: "Secondary supporting image",
      rationale: "Apply to the requested Item.",
    }, selectedConstraints),
  };
  res = await execute(handlerFor({
    fetchRun: async () => structuredClone(selectedRun),
    fetchTemplateWithItems: async () => ({
      template: { id: "template-id", status: "active", version: 2 },
      sections: [structuredClone(itemSection)],
    }),
  }));
  assert.equal(res.statusCode, 200);

  res = await execute(handlerFor({
    fetchTemplateWithItems: async () => ({ template: { status: "active", version: 3 }, sections: [section] }),
  }));
  assert.equal(res.statusCode, 409);
  assert.equal(res.body.code, "TEMPLATE_VERSION_MISMATCH");

  res = await execute(handlerFor({
    fetchTemplateWithItems: async () => ({ template: { status: "inactive", version: 2 }, sections: [section] }),
  }));
  assert.equal(res.statusCode, 409);
  assert.equal(res.body.code, "TEMPLATE_NOT_ACTIVE");

  res = await execute(handlerFor({ fetchLayoutRow: async () => ({ ...layout, layoutRevision: 9 }) }));
  assert.equal(res.statusCode, 409);
  assert.equal(res.body.code, "LAYOUT_REVISION_MISMATCH");

  res = await execute(handlerFor(), { runId: "run-id", sectionInputs: { title: "Changed" } });
  assert.equal(res.statusCode, 409);
  assert.equal(res.body.code, "INPUT_HASH_MISMATCH");

  res = await execute(handlerFor(), {
    runId: "run-id",
    sectionInputs: { title: "Welcome" },
    backgroundColor: "#ffffff",
  });
  assert.equal(res.statusCode, 409);
  assert.equal(res.body.code, "BACKGROUND_COLOR_MISMATCH");

  res = await execute(handlerFor({
    fetchLayoutRow: async () => ({
      ...layout,
      layoutSpec: { sectionStyles: { heroBanner: { minHeight: 600 } }, itemStyles: {} },
    }),
  }));
  assert.equal(res.statusCode, 409);
  assert.equal(res.body.code, "CONSTRAINTS_MISMATCH");

  res = await execute(handlerFor({
    fetchTemplateWithItems: async () => ({ template: { status: "active", version: 2 }, sections: [] }),
  }));
  assert.equal(res.statusCode, 409);
  assert.equal(res.body.code, "SECTION_DEFINITION_MISMATCH");

  const invalidRun = { ...run, layoutResult: { ...layoutResult, layoutPatch: { sectionStyles: { other: {} }, itemStyles: {} } } };
  res = await execute(handlerFor({ fetchRun: async () => invalidRun }));
  assert.equal(res.statusCode, 409);
  assert.equal(res.body.code, "APPLY_VALIDATION_FAILED");

  res = await execute(handlerFor({ transitionRun: async () => null }));
  assert.equal(res.statusCode, 409);
  assert.equal(res.body.code, "APPLY_STATE_CONFLICT");

  assert.equal(inputHash(constraints), inputHash(run.constraintsSnapshot));
  console.log("Section AI apply handler tests passed.");
})().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
