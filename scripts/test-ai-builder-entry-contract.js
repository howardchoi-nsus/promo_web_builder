const fs = require("node:fs");
const path = require("node:path");
const assert = require("node:assert/strict");

const root = path.resolve(__dirname, "..");
const html = fs.readFileSync(path.join(root, "prototype/create-promo.html"), "utf8");
const bootstrap = fs.readFileSync(path.join(root, "prototype/builder-bootstrap.js"), "utf8");
const vite = fs.readFileSync(path.join(root, "visual-editor/vite.config.js"), "utf8");
const app = fs.readFileSync(path.join(root, "visual-editor/src/builder/AiBuilderApp.vue"), "utf8");

assert.match(html, /id="ai-builder-app"/);
assert.match(html, /data-template-builder-root/);
assert.match(html, /builder-bootstrap\.js/);
assert.doesNotMatch(html, /<script src="create-promo\.js/);
assert.match(bootstrap, /mode === "template"/);
assert.match(bootstrap, /function loadStylesheet/);
assert.match(bootstrap, /visual-editor-assets\/ai-builder\.css/);
assert.match(bootstrap, /visual-editor-assets\/ai-builder\.js/);
assert.match(vite, /"ai-builder": resolve/);
assert.match(app, /BuilderModeSelector/);
assert.match(app, /PromoPageRenderer|CompositionReview/);

console.log("AI Builder entry contract test passed");
