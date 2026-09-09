const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const {
  CONTRACT_VERSION,
  MAX_DEPTH,
  MAX_NODES,
  normalizeRenderSpec,
  validateRenderSpec,
  assertValidRenderSpec,
} = require("../api/_component-render-spec-contract");

const fields = [
  { fieldKey: "fld_product_image", fieldKind: "image", isRequired: true },
  { fieldKey: "fld_title", fieldKind: "text", isRequired: true },
  { fieldKey: "fld_primary_cta", fieldKind: "cta", isRequired: true },
];
const tokenCatalog = [
  { tokenKey: "--app-surface", cssProperty: "background-color" },
  { tokenKey: "--app-radius", cssProperties: ["border-radius"] },
  { tokenKey: "--app-shadow", cssProperty: "box-shadow" },
  { tokenKey: "--app-space-md", cssProperties: ["gap", "padding", "padding-top", "padding-right", "padding-bottom", "padding-left"] },
  { tokenKey: "--app-ink", cssProperty: "color" },
  { tokenKey: "--app-font-heading", cssProperty: "font-family" },
  { tokenKey: "--app-title-size", cssProperty: "font-size" },
  { tokenKey: "--app-content-width", cssProperty: "max-width" },
];

function validSpec() {
  return {
    contractVersion: CONTRACT_VERSION,
    root: {
      nodeType: "element",
      tag: "article",
      semanticRole: "surface",
      layout: {
        display: "grid",
        columns: 2,
        gapToken: "--app-space-md",
        paddingToken: "--app-space-md",
        maxWidth: "--app-content-width",
        positionMode: "flow",
      },
      tokenBindings: {
        backgroundColor: "--app-surface",
        borderRadius: "--app-radius",
        boxShadow: "--app-shadow",
      },
      children: [
        { nodeType: "field", tag: "img", fieldKey: "fld_product_image", attributes: { alt: "" } },
        {
          nodeType: "element",
          tag: "div",
          children: [
            {
              nodeType: "field",
              tag: "h2",
              fieldKey: "fld_title",
              tokenBindings: {
                color: "--app-ink",
                fontFamily: "--app-font-heading",
                fontSize: "--app-title-size",
              },
            },
            { nodeType: "field", tag: "a", fieldKey: "fld_primary_cta", attributes: { target: "_self" } },
          ],
        },
      ],
    },
    responsive: {
      mobile: {
        "root.layout.columns": 1,
        "root.layout.paddingToken": "--app-space-md",
      },
    },
  };
}

function codes(result) {
  return new Set(result.errors.map((error) => error.code));
}

function mutate(mutator) {
  const spec = structuredClone(validSpec());
  mutator(spec);
  return validateRenderSpec(spec, { fields, tokenCatalog });
}

const schema = JSON.parse(fs.readFileSync(path.resolve("contracts/component-render-spec-v1.schema.json"), "utf8"));
assert.equal(schema.properties.contractVersion.const, CONTRACT_VERSION);
assert.equal(schema.additionalProperties, false);

const valid = validateRenderSpec(validSpec(), { fields, tokenCatalog });
assert.equal(valid.ok, true, JSON.stringify(valid.errors));
assert.equal(valid.hash.length, 64);
assert.deepEqual(valid.metrics, { nodeCount: 5, fieldNodeCount: 3, ctaNodeCount: 1, maxDepth: 3 });
assert.deepEqual(assertValidRenderSpec(validSpec(), { fields, tokenCatalog }).normalizedSpec, normalizeRenderSpec(validSpec()));

const reordered = validSpec();
reordered.root.layout = {
  positionMode: "flow",
  maxWidth: "--app-content-width",
  paddingToken: "--app-space-md",
  gapToken: "--app-space-md",
  columns: 2,
  display: "grid",
};
assert.equal(validateRenderSpec(reordered, { fields, tokenCatalog }).hash, valid.hash, "Equivalent specs must have a stable hash");

assert.ok(codes(mutate((spec) => { spec.root.tag = "script"; })).has("TAG_NOT_ALLOWED"));
assert.ok(codes(mutate((spec) => { spec.root.attributes = { onclick: "alert(1)" }; })).has("UNSAFE_ATTRIBUTE"));
assert.ok(codes(mutate((spec) => { spec.root.attributes = { style: "color:red" }; })).has("UNSAFE_ATTRIBUTE"));
assert.ok(codes(mutate((spec) => { spec.root.attributes = { class: "arbitrary" }; })).has("UNSAFE_ATTRIBUTE"));
assert.ok(codes(mutate((spec) => { spec.root.attributes = { href: "javascript:alert(1)" }; })).has("UNSAFE_URL"));
assert.ok(codes(mutate((spec) => { spec.root.rawHtml = "<img onerror=alert(1)>"; })).has("NODE_PROPERTY_NOT_ALLOWED"));
assert.ok(codes(mutate((spec) => { spec.root.tokenBindings.color = "#ff0000"; })).has("INVALID_TOKEN_KEY"));
assert.ok(codes(mutate((spec) => { spec.root.tokenBindings.color = "--app-missing"; })).has("UNKNOWN_TOKEN"));
assert.ok(codes(mutate((spec) => { spec.root.tokenBindings.color = "--app-radius"; })).has("TOKEN_TYPE_MISMATCH"));
assert.ok(codes(mutate((spec) => { spec.root.children[0].tag = "h2"; })).has("FIELD_TAG_MISMATCH"));
assert.ok(codes(mutate((spec) => { spec.root.children[0].fieldKey = "fld_missing"; })).has("UNKNOWN_FIELD"));
assert.ok(codes(mutate((spec) => { spec.root.children.splice(0, 1); })).has("REQUIRED_FIELD_NOT_RENDERED"));
assert.ok(codes(mutate((spec) => {
  spec.root.children[1].children[1].children = [{ nodeType: "element", tag: "button" }];
})).has("NESTED_INTERACTIVE"));
assert.ok(codes(mutate((spec) => { spec.responsive.wide = {}; })).has("BREAKPOINT_NOT_ALLOWED"));
assert.ok(codes(mutate((spec) => { spec.responsive.mobile["root.children.99.layout.columns"] = 1; })).has("INVALID_RESPONSIVE_PATH"));
assert.ok(codes(mutate((spec) => { spec.root.layout.positionMode = "absolute"; })).has("INVALID_LAYOUT_VALUE"));
assert.ok(codes(mutate((spec) => { spec.contractVersion = "1"; })).has("UNSUPPORTED_CONTRACT_VERSION"));

const tooDeep = validSpec();
let cursor = tooDeep.root;
for (let depth = 0; depth < MAX_DEPTH; depth += 1) {
  const child = { nodeType: "element", tag: "div", children: [] };
  cursor.children = [child];
  cursor = child;
}
assert.ok(codes(validateRenderSpec(tooDeep, { fields: [], tokenCatalog })).has("DEPTH_LIMIT_EXCEEDED"));

const extremelyDeep = { contractVersion: 1, root: { nodeType: "element", tag: "div" } };
cursor = extremelyDeep.root;
for (let depth = 0; depth < 2000; depth += 1) {
  const child = { nodeType: "element", tag: "div" };
  cursor.children = [child];
  cursor = child;
}
const extremelyDeepResult = validateRenderSpec(extremelyDeep, { fields: [], tokenCatalog: [] });
assert.equal(extremelyDeepResult.ok, false);
assert.equal(extremelyDeepResult.normalizedSpec, null, "Invalid deeply nested specs must not be normalized recursively");

const tooMany = validSpec();
tooMany.root.children = Array.from({ length: MAX_NODES }, () => ({ nodeType: "element", tag: "div" }));
assert.ok(codes(validateRenderSpec(tooMany, { fields: [], tokenCatalog })).has("NODE_LIMIT_EXCEEDED"));

const polluted = JSON.parse('{"contractVersion":1,"root":{"nodeType":"element","tag":"div","__proto__":{"polluted":true}}}');
assert.ok(codes(validateRenderSpec(polluted, { fields: [], tokenCatalog })).has("DANGEROUS_OBJECT_KEY"));
assert.equal({}.polluted, undefined);

assert.throws(
  () => assertValidRenderSpec({ contractVersion: 1, root: { nodeType: "element", tag: "iframe" } }, { fields: [], tokenCatalog }),
  (error) => error.code === "INVALID_COMPONENT_RENDER_SPEC" && error.statusCode === 422,
);

console.log("Component RenderSpec v1 contract and security tests passed");
