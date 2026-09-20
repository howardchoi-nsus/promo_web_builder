import assert from "node:assert/strict";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { createSSRApp, h } from "vue";
import { renderToString } from "vue/server-renderer";
import vue from "@vitejs/plugin-vue";
import { createServer } from "vite";
import {
  normalizeReadonlyRendererProps,
  readonlyRendererDefaults,
} from "../visual-editor/src/runtime/readonly-renderer-contract.mjs";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const defaults = readonlyRendererDefaults();
assert.deepEqual(defaults.content.sectionSnapshot, []);
assert.equal(defaults.designSpec.responsive.contentMaxWidth, 1280);

const snapshot = {
  contractVersion: 3,
  content: {
    contractVersion: 3,
    formTemplate: { designTokens: { values: { "--promo-background": "#fff" } } },
    sectionSnapshot: [{
      sectionKey: "hero",
      name: "Hero",
      sectionRole: "hero",
      items: [{
        itemKey: "title",
        name: "Title",
        fieldKind: "text",
        textType: "title",
        isRequired: true,
      }],
    }],
    sectionInputs: { hero: { title: "Server rendered promotion" } },
    sectionOrder: ["hero"],
  },
  designSpec: {
    contractVersion: 1,
    theme: { backgroundColor: "#fff", textColor: "#111", fontFamily: "sans-serif" },
    responsive: { contentMaxWidth: 1280, contentMinWidth: 0, mobileBreakpoint: 720 },
    itemStyles: {},
    sectionStyles: {},
    visibility: { items: {}, fields: {} },
    responsiveLayouts: { mobile: { itemStyles: {}, visibility: { items: {} } } },
  },
  assets: { contractVersion: 1, items: {} },
  motionSpec: { contractVersion: 2, sections: {}, items: {} },
};

assert.equal(normalizeReadonlyRendererProps({ snapshot }).content.contractVersion, 3);

const vite = await createServer({
  root,
  appType: "custom",
  plugins: [vue()],
  server: { middlewareMode: true },
  logLevel: "silent",
});

try {
  const module = await vite.ssrLoadModule("/visual-editor/src/runtime/PromoReadonlyRenderer.vue");
  const app = createSSRApp({ render: () => h(module.default, { snapshot, viewportOverride: "desktop" }) });
  const html = await renderToString(app);
  assert.match(html, /promo-readonly-renderer/);
  assert.match(html, /data-section-key="hero"/);
  assert.match(html, /Server rendered promotion/);
  assert.doesNotMatch(html, /content-width-guide|item-resize-handle|component-action-handle/);
} finally {
  await vite.close();
}

console.log("Promo read-only renderer SSR test passed");
