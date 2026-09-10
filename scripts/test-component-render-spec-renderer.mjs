import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import {
  createResolvedRenderSpecTree,
  renderSpecStructureSignature,
  resolveRenderSpecBreakpoint,
  resolveRenderSpecFieldValue,
} from "../visual-editor/src/platform/render-spec/render-spec-runtime.mjs";
import { createComponentInstanceFromDefinition } from "../visual-editor/src/platform/editor-core/composition-structure.mjs";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const rendererSource = fs.readFileSync(path.join(root, "visual-editor/src/PromoPageRenderer.vue"), "utf8");
const nodeSource = fs.readFileSync(path.join(root, "visual-editor/src/platform/render-spec/RenderSpecNode.vue"), "utf8");
const sectionStoreSource = fs.readFileSync(path.join(root, "api/_wizard-content-sections-store.js"), "utf8");

const fields = [
  { fieldKey: "fld_image", fieldKind: "image", name: "Product", isRequired: true },
  { fieldKey: "fld_title", fieldKind: "text", textType: "title", name: "Title", isRequired: true },
  { fieldKey: "fld_cta", fieldKind: "cta", name: "Learn more", isRequired: true },
];
const renderSpec = {
  contractVersion: 1,
  root: {
    nodeType: "element",
    tag: "article",
    layout: { display: "grid", columns: 2, gapToken: "--promo-space-4", maxWidth: "960px" },
    tokenBindings: { backgroundColor: "--promo-surface", borderRadius: "--promo-radius" },
    children: [
      { nodeType: "field", tag: "img", fieldKey: "fld_image", attributes: { alt: "" } },
      {
        nodeType: "element",
        tag: "div",
        children: [
          { nodeType: "field", tag: "h2", fieldKey: "fld_title", tokenBindings: { color: "--promo-ink" } },
          { nodeType: "field", tag: "a", fieldKey: "fld_cta", attributes: { target: "_self" } },
        ],
      },
    ],
  },
  responsive: {
    mobile: {
      "root.layout.columns": 1,
      "root.children.1.tokenBindings.backgroundColor": "--promo-surface-muted",
    },
  },
};
const componentValue = {
  fields: {
    fld_image: { value: "https://cdn.example.com/product.webp", alt: "Product preview" },
    fld_title: "Autumn promotion",
    fld_cta: { label: "View offer", link: "/offer", target: "_blank" },
  },
};

assert.equal(resolveRenderSpecBreakpoint({ viewportWidth: 1440 }), "desktop");
assert.equal(resolveRenderSpecBreakpoint({ viewportWidth: 768 }), "tablet");
assert.equal(resolveRenderSpecBreakpoint({ viewportWidth: 375 }), "mobile");
assert.equal(resolveRenderSpecBreakpoint({ viewport: "mobile", viewportWidth: 1440 }), "mobile");
assert.equal(resolveRenderSpecFieldValue(componentValue, fields, "fld_title"), "Autumn promotion");

const desktop = createResolvedRenderSpecTree({ renderSpec, fields, componentValue, breakpoint: "desktop" });
const mobile = createResolvedRenderSpecTree({ renderSpec, fields, componentValue, breakpoint: "mobile" });
assert.equal(desktop.tag, "article");
assert.equal(desktop.style.gridTemplateColumns, "repeat(2, minmax(0, 1fr))");
assert.equal(desktop.style.gap, "var(--promo-space-4)");
assert.equal(desktop.style.backgroundColor, "var(--promo-surface)");
assert.equal(desktop.children[0].attributes.src, "https://cdn.example.com/product.webp");
assert.equal(desktop.children[0].attributes.alt, "Product preview");
assert.equal(desktop.children[1].children[0].text, "Autumn promotion");
assert.equal(desktop.children[1].children[1].text, "View offer");
assert.equal(desktop.children[1].children[1].attributes.href, "/offer");
assert.equal(desktop.children[1].children[1].attributes.target, "_blank");
assert.equal(desktop.children[1].children[1].attributes.rel, "noopener noreferrer");
assert.equal(mobile.style.gridTemplateColumns, "repeat(1, minmax(0, 1fr))");
assert.equal(mobile.children[1].style.backgroundColor, "var(--promo-surface-muted)");
assert.equal(renderSpecStructureSignature(desktop), renderSpecStructureSignature(mobile));

const unsafeRuntimeTree = createResolvedRenderSpecTree({
  renderSpec: { contractVersion: 1, root: { nodeType: "element", tag: "script", attributes: { onclick: "alert(1)" } } },
});
assert.equal(unsafeRuntimeTree.tag, "div", "Runtime must fail closed even if unvalidated input reaches it");
assert.equal(Object.hasOwn(unsafeRuntimeTree.attributes, "onclick"), false);

const instance = createComponentInstanceFromDefinition({
  id: "component-id",
  componentKey: "promo_card",
  name: "Promo card",
  activeVersion: { id: "version-id", version: 2, status: "active", fields, renderSpec },
});
assert.deepEqual(instance.renderSpec, renderSpec);
assert.notEqual(instance.renderSpec, renderSpec, "Component instances must snapshot RenderSpec instead of sharing mutable state");

assert.match(rendererSource, /import RenderSpecTree/);
assert.match(rendererSource, /v-if="componentRenderSpec\(item\)"/);
assert.match(rendererSource, /v-else-if="componentFields\(item\)\.length > 1"/, "Legacy multi-field fallback must remain available");
assert.match(nodeSource, /props\.editable \? \{/);
assert.match(nodeSource, /"data-render-path"/);
assert.match(sectionStoreSource, /version\.render_contract_version/);
assert.match(sectionStoreSource, /const renderSpec = renderSpecFromVersionRow\(row\)/);
assert.match(sectionStoreSource, /renderSpecHash:/);

console.log("Shared Component RenderSpec renderer contract tests passed");
