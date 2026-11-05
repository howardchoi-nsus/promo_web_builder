import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const read = (relativePath) => readFile(path.join(root, relativePath), "utf8");
const [builderCss, renderer, promoCss, collision] = await Promise.all([
  read("visual-editor/src/builder/ai-builder.css"),
  read("visual-editor/src/PromoPageRenderer.vue"),
  read("visual-editor/src/promo-renderer.css"),
  read("api/_promo-layout-text-collision.js"),
]);

assert.match(builderCss, /\.ai-builder-actions\s*\{[\s\S]*?grid-template-columns:\s*repeat\(2, minmax\(0, 1fr\)\)/);
assert.match(builderCss, /\.ai-builder-actions button\s*\{[\s\S]*?word-break:\s*keep-all/);
assert.match(renderer, /clamp\(2rem, 10vw, 3\.25rem\)/);
assert.match(promoCss, /a\.render-spec-node--cta/);
assert.match(collision, /mobileWidth = 390/);

console.log("Mobile result preview responsive contract tests passed.");
