const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const {
  buildImageHarnessPrompt,
  imageMetadata,
  normalizeControlPlanePromptConfig,
  backgroundSizeForFitMode,
  normalizeTargetGeometry,
  resolveEffectiveAspectRatio,
  validateControlPlaneConfig,
  validateRequestedImageResolution,
} = require("../api/_section-ai-control-plane");
const {
  defaultPromptControlPlane,
  promptVariableContract,
} = require("../api/_prompt-template-store");

const root = path.resolve(__dirname, "..");
const read = (...parts) => fs.readFileSync(path.join(root, ...parts), "utf8");
const provider = read("api", "_promo-section-design-provider.js");
const legacyImageHandler = read("api", "promo-section-design-image-process.js");
const assetHandler = read("api", "promo-section-design-asset-process.js");
const admin = read("prototype", "app.js");
const html = read("prototype", "index.html");
const migration = read("db", "migrations", "035_llm_prompt_control_plane_backfill.sql");
const policyMigration = read("db", "migrations", "036_section_ai_image_policy_v3_drafts.sql");

const backgroundDefaults = defaultPromptControlPlane("section_background_image");
assert.equal(backgroundDefaults.executionSnapshotVersion, 3);
assert.equal(backgroundDefaults.generationPolicy.requestedTier, "2K");
assert.equal(backgroundDefaults.renderPolicy.sectionBackground.fitMode, "cover");
assert.equal(backgroundDefaults.validationPolicy.resolutionRules["2K"].minimumLandscapeWidth, 2048);
assert.equal(backgroundDefaults.runtimeConfig.timeoutMs, 240000);
assert.equal(backgroundDefaults.runtimeConfig.maxAttempts, 3);
assert.equal(backgroundDefaults.modelCapabilitySnapshot.minimumLongSideByTier["2K"], 1800);
assert.equal(backgroundSizeForFitMode("width-fill"), "100% auto");
assert.deepEqual(normalizeTargetGeometry({ width: 9999, height: 20 }), {
  width: 3840, height: 120, viewport: "desktop",
});
assert.equal(resolveEffectiveAspectRatio(
  { aspectRatioStrategy: "nearest-supported", fallbackAspectRatio: "16:9" },
  { width: 1280, height: 520 },
  "",
  ["16:9", "4:3"]
), "16:9");
assert.equal(resolveEffectiveAspectRatio(
  { aspectRatioStrategy: "section", fallbackAspectRatio: "16:9" },
  { width: 1280, height: 520 },
  "",
  ["16:9", "4:3"]
), "16:9");

const config = normalizeControlPlanePromptConfig("section_background_image", {
  temperature: 0.35,
  maxTokens: 2500,
  modelOptions: {
    imageSize: "2K",
    executionSnapshotVersion: 2,
    runtimeConfig: {
      timeoutMs: 120000,
      maxAttempts: 2,
      retryBaseMs: 1000,
      retryMaxMs: 3000,
      outputMimeType: "image/jpeg",
    },
    harnessConfig: backgroundDefaults.harnessConfig,
    modelCapabilitySnapshot: backgroundDefaults.modelCapabilitySnapshot,
    safetyContract: backgroundDefaults.safetyContract,
  },
});
assert.equal(config.temperature, 0.35);
assert.equal(config.maxTokens, 2500);
assert.equal(config.runtimeConfig.timeoutMs, 120000);
assert.equal(config.modelOptions.imageSize, "2K");
assert.equal(validateControlPlaneConfig("section_background_image", config), true);
assert.throws(() => validateControlPlaneConfig("section_background_image", {
  modelOptions: {
    ...config.modelOptions,
    runtimeConfig: { ...config.runtimeConfig, timeoutMs: 999999 },
  },
}), /timeoutMs/);

const customPrompt = buildImageHarnessPrompt({
  prompt: "BASE",
  safeArea: "right-copy",
  backgroundColor: "#112233",
  targetType: "section-background",
  aspectRatio: "16:9",
  harnessConfig: {
    version: 1,
    safeAreaInstructions: { "right-copy": "SAFE" },
    sectionBackgroundRules: ["RATIO {{aspectRatio}}"],
    componentImageRules: [],
    negativeRules: ["COLOR {{backgroundColor}}"],
  },
});
assert.equal(customPrompt, "BASE\nSAFE\nRATIO 16:9\nCOLOR #112233");

const png = Buffer.alloc(24);
Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]).copy(png);
png.writeUInt32BE(2048, 16);
png.writeUInt32BE(1152, 20);
assert.deepEqual(imageMetadata(png), { mimeType: "image/png", width: 2048, height: 1152 });
assert.equal(validateRequestedImageResolution(imageMetadata(png), config), true);
assert.throws(() => validateRequestedImageResolution(
  { mimeType: "image/jpeg", width: 1200, height: 675 },
  config
), /below the 2K minimum/);

assert.deepEqual(promptVariableContract("section_background_image").requiredVariables, [
  "sectionName", "contentJson", "backgroundColor",
]);
assert.match(provider, /temperature:\s*config\.temperature/);
assert.match(provider, /max_output_tokens/);
assert.match(provider, /buildImageHarnessPrompt/);
assert.match(provider, /imageMetadata/);
assert.match(provider, /stepImages\.at\(-1\)/);
assert.match(legacyImageHandler, /run\.promptSnapshot\?\.promptConfig/);
assert.match(legacyImageHandler, /promptConfig,/);
assert.match(assetHandler, /promptConfig:\s*request\.promptConfig/);
assert.match(admin, /promptUsesSectionAiControlPlane/);
assert.match(admin, /modelOptions\.harnessConfig/);
assert.match(html, /section_composition_planner/);
assert.match(html, /Harness 지침\(JSON\)/);
assert.match(html, /requiredVariablesText[^>]+readonly/);
assert.match(migration, /executionSnapshotVersion/);
assert.match(migration, /minimumLongSideByTier/);
assert.match(policyMigration, /status = 'active'/);
assert.match(policyMigration, /'draft'/);
assert.match(policyMigration, /minimumLandscapeWidth', 2048/);
assert.doesNotMatch(policyMigration, /update\s+prompt_templates\s+set/i);

console.log("Section AI Control Plane contract tests passed.");
