const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..");
const layoutHandler = fs.readFileSync(path.join(root, "api/promo-section-design-process.js"), "utf8");
const imageHandler = fs.readFileSync(path.join(root, "api/promo-section-design-image-process.js"), "utf8");
const runsHandler = fs.readFileSync(path.join(root, "api/promo-section-design-runs.js"), "utf8");
const createPromo = fs.readFileSync(path.join(root, "prototype/create-promo.js"), "utf8");
const visualEditor = fs.readFileSync(path.join(root, "visual-editor/src/App.vue"), "utf8");

assert.doesNotMatch(layoutHandler, /generateSectionImage/);
assert.match(layoutHandler, /nextStage:\s*"image"/);
assert.match(layoutHandler, /"generating_assets"/);
assert.match(imageHandler, /generateSectionImage/);
assert.match(imageHandler, /run\.status === "failed"/);
assert.match(imageHandler, /clearCompletedAt:\s*true/);
assert.match(createPromo, /promo-section-design-image-process/);
assert.match(createPromo, /canRetryImage/);
assert.match(createPromo, /imageTarget\?\.type === "item"/);
assert.match(createPromo, /source: "ai"/);
assert.match(createPromo, /targetItemKey/);
assert.match(runsHandler, /resolveImageTarget/);
assert.match(runsHandler, /Requested AI image Item is not allowed/);
assert.match(visualEditor, /item-ai-generation-action/);
assert.match(visualEditor, /sectionAiItemAllowed/);

console.log("Section AI stage split contract tests passed.");
