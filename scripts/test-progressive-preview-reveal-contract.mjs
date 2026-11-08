import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const app = readFileSync(new URL("../visual-editor/src/builder/AiBuilderApp.vue", import.meta.url), "utf8");
const css = readFileSync(new URL("../visual-editor/src/builder/ai-builder.css", import.meta.url), "utf8");
const flags = readFileSync(new URL("../api/_promo-builder-flags.js", import.meta.url), "utf8");

assert.match(flags, /progressivePreviewReveal: "PROGRESSIVE_PREVIEW_REVEAL_V1_ENABLED"/);
assert.match(app, /async function startWireframeReveal/);
assert.match(app, /Math\.min\(sectionCount, 8\)/);
assert.match(app, /index \* 110/);
assert.match(app, /await startWireframeReveal\(\)/);
assert.match(app, /watch\(activeResultTab/);
assert.match(app, /:aria-busy="wireframeRevealState !== 'complete'"/);
assert.match(app, /is-reveal-pending/);
assert.match(app, /is-reveal-visible/);
assert.match(css, /translateY\(12px\)/);
assert.match(css, /@media \(prefers-reduced-motion: reduce\)/);
assert.match(css, /@media print/);

console.log("Progressive page-preview reveal contract passed");
