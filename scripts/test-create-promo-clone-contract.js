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
const renderer = read("visual-editor", "src", "PromoPageRenderer.vue");
const rendererCss = read("visual-editor", "src", "styles.css");

assert.match(createHtml, /<title>Create Promo<\/title>/);
assert.match(createHtml, /aria-current="page">Create Promo<\/a>/);
assert.doesNotMatch(createHtml, /class="active" href="\/promo-wizard\.html"/);
assert.match(createHtml, /create-promo\.css\?v=create-promo-step3-v22/);
assert.match(createHtml, /create-promo\.js\?v=create-promo-step3-v22/);
assert.match(createHtml, /<strong>Background<\/strong>/);
assert.match(createHtml, /<strong>CTA Style<\/strong>/);
assert.match(createHtml, /<strong>Template &amp; Content<\/strong>/);
assert.match(createHtml, /<strong>Web Output<\/strong>/);
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
assert.match(createJs, /promoPrototype\.createPromo\.appearance\.v1/);
assert.match(createJs, /function renderBackgroundStep\b/);
assert.match(createJs, /function renderCtaStep\b/);
assert.match(createJs, /const CTA_STYLE_OPTIONS/);
assert.match(createJs, /group:\s*"cta-style"/);
assert.match(createJs, /appearanceState\.ctaShape = option\.shape/);
assert.match(createJs, /appearanceState\.ctaVariant = option\.variant/);
assert.match(createJs, /1\. 프로모션 개요/);
assert.match(createJs, /2\. 프로모션 템플릿 선택/);
assert.match(createJs, /source=create-promo/);
assert.match(createJs, /function autoRegisterPromoOverview\b/);
assert.match(createJs, /create-promo-auto-register-request/);
assert.match(createJs, /placeholders\.append\(\s*overview,\s*templateSection,\s*layoutPanel\s*\)/);
assert.match(editorApp, /isCreatePromoWizardMode/);
assert.match(editorApp, /create-promo-auto-register-request/);
assert.match(editorApp, /sectionInputs:\s*JSON\.parse\(JSON\.stringify\(sectionInputs\.value\)\)/);
assert.match(createJs, /contentState\.sectionInputs = mergeSectionInputs\(event\.data\.sectionInputs\)/);
assert.match(editorApp, /section-registration-icon/);
assert.match(rendererCss, /\.section-registration-icon\.is-complete circle/);
assert.match(rendererCss, /\.section-registration-icon\.is-incomplete circle/);
assert.match(createCss, /\.appearance-choice__cta-sample\.is-round/);
assert.match(createCss, /\.appearance-choice__cta-sample\.is-square/);
assert.match(createJs, /function applyCreatePromoAppearance\b/);
assert.match(createJs, /if \(currentStep === 2\) \{\s*renderContentStep\(\)/);
assert.match(createJs, /designSpec: applyCreatePromoAppearance\(wizardResolvedLayout\)/);
assert.match(createJs, /role", "radio/);
assert.match(renderer, /--promo-cta-radius/);
assert.match(rendererCss, /border-radius:\s*var\(--promo-cta-radius/);
assert.doesNotMatch(createJs, /"promoPrototype\.wizardContent\.v1"/);
assert.doesNotMatch(createJs, /"promoPrototype\.wizardRun\.v1"/);
assert.match(wizardJs, /"promoPrototype\.wizardContent\.v1"/);
assert.match(wizardJs, /"promoPrototype\.wizardRun\.v1"/);

[builderHtml, wizardHtml, editorApp].forEach((source) => {
  assert.match(source, /href="\/create-promo\.html">Create Promo<\/a>/);
});

console.log("Create Promo clone contract test passed");
