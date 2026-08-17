const fs = require("node:fs");
const path = require("node:path");
const assert = require("node:assert/strict");

const root = path.resolve(__dirname, "..");
const html = fs.readFileSync(path.join(root, "prototype/create-promo.html"), "utf8");
const bootstrap = fs.readFileSync(path.join(root, "prototype/builder-bootstrap.js"), "utf8");
const vite = fs.readFileSync(path.join(root, "visual-editor/vite.config.js"), "utf8");
const app = fs.readFileSync(path.join(root, "visual-editor/src/builder/AiBuilderApp.vue"), "utf8");
const client = fs.readFileSync(path.join(root, "visual-editor/src/builder/services/composition-client.mjs"), "utf8");
const store = fs.readFileSync(path.join(root, "visual-editor/src/builder/state/ai-builder-store.mjs"), "utf8");

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
assert.match(app, /v-if="store\.error"/);
assert.match(app, /role="alert"/);
assert.match(app, /store\.error\.code/);
assert.match(app, /store\.error\.message/);
assert.match(app, /store\.error\.details/);
assert.match(client, /payload\.errors/);
assert.match(store, /error\?\.details/);
assert.match(app, /if \(response\.proposal\.status === "ready"\) return response\.proposal;/);
assert.match(app, /if \(\["queued", "processing"\]\.includes\(response\.proposal\.status\)\) \{[\s\S]*?store\.stage = response\.proposal\.status;[\s\S]*?\}/);
assert.match(app, /proposal\.contractVersion === 3[\s\S]*store\.stage = "review_required"/);

console.log("AI Builder entry contract test passed");
