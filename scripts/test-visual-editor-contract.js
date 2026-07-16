const assert = require("assert");
const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");
const read = (...parts) => fs.readFileSync(path.join(root, ...parts), "utf8");

const packageJson = JSON.parse(read("package.json"));
const editorHtml = read("prototype", "visual-editor.html");
const outputHtml = read("prototype", "visual-output.html");
const app = read("visual-editor", "src", "App.vue");
const renderer = read("visual-editor", "src", "PromoPageRenderer.vue");
const contracts = read("visual-editor", "src", "contracts.js");
const wizard = read("prototype", "promo-wizard.js");

assert.ok(packageJson.scripts["build:visual-editor"]);
assert.match(editorHtml, /data-mode="editor"/);
assert.match(outputHtml, /data-mode="output"/);
assert.match(editorHtml, /visual-editor-assets\/visual-editor\.js/);
assert.match(outputHtml, /visual-editor-assets\/visual-editor\.js/);
assert.match(app, /wizard-form-templates-public/);
assert.match(app, /candidate\.isDefault/);
assert.match(app, /wizard-form-template-public\?id=/);
assert.match(app, /PromoPageRenderer/);
assert.match(app, /SNAPSHOT_STORAGE_KEY/);
assert.match(app, /mode === "output"/);
assert.match(renderer, /data-section-key/);
assert.match(renderer, /data-item-key/);
assert.match(renderer, /Generic|rendered-item/);
assert.match(renderer, /noopener noreferrer/);
assert.doesNotMatch(renderer, /<main\s/);
assert.match(contracts, /default-promo-renderer/);
assert.match(contracts, /sectionInputs/);
assert.match(contracts, /sectionSnapshot/);
assert.doesNotMatch(wizard, /Visual Editor/);

console.log("Visual Editor contract test passed");
