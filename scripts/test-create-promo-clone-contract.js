const assert = require("assert");
const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");
const read = (...parts) => fs.readFileSync(path.join(root, ...parts), "utf8");

const createHtml = read("prototype", "create-promo.html");
const createCss = read("prototype", "create-promo.css");
const createJs = read("prototype", "create-promo.js");
const createLayoutCache = read("prototype", "create-promo-layout-cache.js");
const wizardCore = read("prototype", "wizard", "wizard-core.js");
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
assert.match(createHtml, /create-promo\.css\?v=create-promo-light-v30/);
assert.match(createHtml, /wizard\/wizard-core\.js\?v=wizard-core-v1/);
assert.match(createHtml, /create-promo-layout-cache\.js\?v=create-promo-light-v28/);
assert.match(createHtml, /create-promo\.js\?v=create-promo-light-v32/);
assert.match(createCss, /\[data-theme="light"\]\s*\{[\s\S]*?color-scheme:\s*light;/);
assert.match(createCss, /\[data-theme="dark"\]\s*\{[\s\S]*?color-scheme:\s*dark;/);
assert.match(createHtml, /<strong>Background<\/strong>/);
assert.match(createHtml, /<strong>CTA Style<\/strong>/);
assert.match(createHtml, /<strong>Template &amp; Content<\/strong>/);
assert.match(createHtml, /<strong>Web Output<\/strong>/);
assert.match(rootRedirect, /\/prototype\/create-promo\.html/);

assert.match(createCss, /\.wizard-shell/);
assert.match(createCss, /\.wizard-progress/);
assert.match(createCss, /\.wizard-layout-frame/);
assert.match(createCss, /\.section-ai-design-panel/);

[
  "loadWizardContent",
  "selectWizardFormTemplate",
  "renderContentStep",
  "renderStep",
].forEach((contractName) => {
  assert.match(createJs, new RegExp(`(?:function|async function) ${contractName}\\b`));
  assert.match(wizardJs, new RegExp(`(?:function|async function) ${contractName}\\b`));
});

assert.match(createJs, /promoPrototype\.createPromo\.content\.v1/);
assert.match(createJs, /promoPrototype\.createPromo\.sessionId\.v1/);
assert.match(createJs, /promoPrototype\.createPromo\.appearance\.v1/);
assert.match(createJs, /function renderBackgroundStep\b/);
assert.match(createJs, /function renderCtaStep\b/);
assert.match(createJs, /type:\s*"textarea",\s*\n\s*rows:\s*item\.textType === "multi" \? 4 : 3/);
assert.match(createJs, /const CTA_STYLE_OPTIONS/);
assert.match(createJs, /group:\s*"cta-style"/);
assert.match(createJs, /appearanceState\.ctaShape = option\.shape/);
assert.match(createJs, /appearanceState\.ctaVariant = option\.variant/);
assert.match(createJs, /1\. 프로모션 개요/);
assert.match(createJs, /2\. 프로모션 템플릿 선택/);
assert.match(createJs, /source=create-promo/);
assert.match(createJs, /function autoRegisterPromoOverview\b/);
assert.doesNotMatch(createJs, /layoutPanel\.append\(layoutHeader, createSectionAiDesignPanel\(\)\)/);
assert.match(createJs, /wizardResolvedLayout\.sectionStyles\[section\.sectionKey\]/);
assert.match(createJs, /backgroundSize:\s*"contain"/);
assert.match(createJs, /layoutVariant === "split-left"/);
assert.match(createJs, /layoutVariant === "split-right"/);
assert.match(createJs, /layoutVariant === "centered-hero"/);
assert.match(createJs, /safeArea === "right-copy"/);
assert.match(createJs, /\? "left center"/);
assert.match(createJs, /safeArea === "center-copy" \? "center center" : "right center"/);
assert.match(createJs, /backgroundPosition,/);
assert.doesNotMatch(createJs, /source:\s*"ai"/);
assert.match(createJs, /isLegacySectionAiImage/);
assert.match(createJs, /currentUrl\.startsWith\("\/api\/promo-section-design-image\?"\)/);
assert.match(createJs, /value:\s*""/);
assert.match(createJs, /function removeSectionAiBackground\b/);
assert.match(createJs, /async function generateSectionAiDesign\b/);
assert.match(createJs, /async function applySectionAiDesign\b/);
assert.match(createJs, /const appliedRun = result\.run/);
assert.match(createJs, /const patch = appliedRun\.layoutResult\.layoutPatch/);
assert.doesNotMatch(createJs, /const patch = saved\.layoutResult\.layoutPatch/);
assert.match(createJs, /create-promo-auto-register-request/);
assert.match(createJs, /workspace\.append\(layoutPanel\)/);
assert.doesNotMatch(createJs, /contentColumn\.append\(dynamicSectionsWrapper, coverage\)/);
assert.match(editorApp, /isCreatePromoWizardMode/);
assert.match(editorApp, /v-if="!isCreatePromoWizardMode" class="global-token-menu"/);
assert.doesNotMatch(editorApp, /background-image-control/);
assert.match(editorApp, /create-promo-auto-register-request/);
assert.match(editorApp, /create-promo-section-ai-action/);
assert.match(editorApp, /create-promo-remove-image/);
assert.match(editorApp, /sectionAiPrimaryAction/);
assert.match(editorApp, /class="section-ai-action"/);
assert.match(editorApp, /class="section-ai-remove"/);
assert.match(editorApp, /class="image-remove-action"/);
assert.match(createJs, /sectionDesignRuns:\s*JSON\.parse/);
assert.match(createJs, /event\.source !== wizardLayoutFrame\?\.contentWindow/);
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
assert.match(createJs, /layoutIdentityFromTemplateResult/);
assert.match(createJs, /layoutIdentityEventSummary/);
assert.match(createJs, /resolveLayoutCache/);
assert.match(createJs, /if \(!options\.fromRefresh\) wizardTemplateRefreshRequestId \+= 1/);
assert.match(createJs, /fromRefresh:\s*true/);
assert.match(createJs, /admin_layout_update_detected/);
assert.match(createJs, /새 관리자 레이아웃 적용/);
assert.match(createLayoutCache, /sameLayoutIdentity/);
assert.match(createLayoutCache, /legacy_invalidated/);
assert.match(createLayoutCache, /resolveSectionOrderCache/);
assert.match(createJs, /wizardBaseSectionOrder/);
assert.match(createJs, /admin_layout_reset_with_section_order/);
assert.match(createJs, /const CONTENT_SUBSTEPS = \["overview", "template", "layout"\]/);
assert.match(createJs, /function setContentSubstep\b/);
assert.match(createJs, /function goToWebOutput\b/);
assert.match(createJs, /Template content registration is no longer part of Step 3/);
assert.match(createJs, /function renderWebOutputStep\b/);
assert.match(createJs, /WEB_OUTPUT_SNAPSHOT_STORAGE_KEY/);
assert.match(createJs, /mode=output&source=create-promo/);
assert.match(createCss, /\.content-substep-nav/);
assert.match(createCss, /\.template-layout-workspace/);
assert.match(createCss, /\.web-output-frame/);
assert.match(createJs, /role", "radio/);
assert.match(renderer, /--promo-cta-radius/);
assert.match(rendererCss, /border-radius:\s*var\(--promo-cta-radius/);
assert.doesNotMatch(createJs, /"promoPrototype\.wizardContent\.v1"/);
assert.doesNotMatch(createJs, /"promoPrototype\.wizardRun\.v1"/);
assert.doesNotMatch(createJs, /loadDesignDocuments\(\)|loadWorkerSettings\(\)|syncRunPolling\(\)/);
assert.doesNotMatch(createJs, /\/api\/design-documents|\/api\/promo-generation-worker-settings/);
assert.match(createJs, /globalThis\.PromoWizardCore/);
assert.match(wizardJs, /globalThis\.PromoWizardCore/);
assert.match(wizardHtml, /wizard\/wizard-core\.js\?v=wizard-core-v1/);
["appendTextElement", "valueAtPath", "setValueAtPath", "fetchJson"].forEach((name) => {
  assert.match(wizardCore, new RegExp(`(?:function|async function) ${name}\\b`));
  assert.doesNotMatch(createJs, new RegExp(`(?:function|async function) ${name}\\b`));
  assert.doesNotMatch(wizardJs, new RegExp(`(?:function|async function) ${name}\\b`));
});
assert.match(wizardJs, /"promoPrototype\.wizardContent\.v1"/);
assert.match(wizardJs, /"promoPrototype\.wizardRun\.v1"/);

[builderHtml, wizardHtml, editorApp].forEach((source) => {
  assert.match(source, /href="\/create-promo\.html">Create Promo<\/a>/);
});

console.log("Create Promo clone contract test passed");
