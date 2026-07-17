const assert = require("assert");
const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");
const read = (...parts) => fs.readFileSync(path.join(root, ...parts), "utf8");

const createHtml = read("prototype", "create-promo.html");
const createCss = read("prototype", "create-promo.css");
const createJs = read("prototype", "create-promo.js");
const wizardJs = read("prototype", "promo-wizard.js");
const rootRedirect = read("create-promo.html");
const builderHtml = read("prototype", "index.html");
const wizardHtml = read("prototype", "promo-wizard.html");
const editorApp = read("visual-editor", "src", "App.vue");

assert.match(createHtml, /<title>Create Promo<\/title>/);
assert.match(createHtml, /aria-current="page">Create Promo<\/a>/);
assert.doesNotMatch(createHtml, /class="active" href="\/promo-wizard\.html"/);
assert.match(createHtml, /create-promo\.css\?v=create-promo-clone-v17/);
assert.match(createHtml, /create-promo\.js\?v=create-promo-clone-v17/);
assert.match(rootRedirect, /\/prototype\/create-promo\.html/);

assert.match(createCss, /\.wizard-shell/);
assert.match(createCss, /\.wizard-progress/);
assert.match(createCss, /\.wizard-layout-frame/);

[
  "loadWizardContent",
  "loadWizardRun",
  "selectWizardFormTemplate",
  "renderContentStep",
  "queueIntegratedBrief",
  "createNewLofiDraft",
  "generateFinalDesign",
  "renderStep",
].forEach((contractName) => {
  assert.match(createJs, new RegExp(`(?:function|async function) ${contractName}\\b`));
  assert.match(wizardJs, new RegExp(`(?:function|async function) ${contractName}\\b`));
});

assert.match(createJs, /promoPrototype\.createPromo\.content\.v1/);
assert.match(createJs, /promoPrototype\.createPromo\.run\.v1/);
assert.match(createJs, /promoPrototype\.createPromo\.sessionId\.v1/);
assert.doesNotMatch(createJs, /"promoPrototype\.wizardContent\.v1"/);
assert.doesNotMatch(createJs, /"promoPrototype\.wizardRun\.v1"/);
assert.match(wizardJs, /"promoPrototype\.wizardContent\.v1"/);
assert.match(wizardJs, /"promoPrototype\.wizardRun\.v1"/);

[builderHtml, wizardHtml, editorApp].forEach((source) => {
  assert.match(source, /href="\/create-promo\.html">Create Promo<\/a>/);
});

console.log("Create Promo clone contract test passed");
