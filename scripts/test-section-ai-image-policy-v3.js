const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const {
  normalizeControlPlanePromptConfig,
  validateControlPlaneConfig,
  validateRequestedImageResolution,
} = require("../api/_section-ai-control-plane");
const defaults = {
  executionSnapshotVersion: 3,
  policySchemaVersion: 1,
  harnessConfig: {},
  runtimeConfig: { timeoutMs: 240000, maxAttempts: 1, retryBaseMs: 0, retryMaxMs: 0 },
  modelCapabilitySnapshot: {},
  safetyContract: {},
  generationPolicy: {
    requestedTier: "2K",
    aspectRatioStrategy: "fixed",
    fixedAspectRatio: "16:9",
    fallbackAspectRatio: "16:9",
    quality: "medium",
    outputMimeType: "image/jpeg",
    backgroundColorStrategy: "section",
    subjectScale: { minimumPercent: 55, maximumPercent: 75 },
  },
  renderPolicy: {},
  validationPolicy: {
    rejectUnreadableMetadata: true,
    rejectMimeMismatch: true,
    rejectLowResolution: true,
    resolutionRules: {
      "1K": { minimumLandscapeWidth: 1024, minimumPortraitHeight: 1024, minimumSquareSide: 1024 },
      "2K": { minimumLandscapeWidth: 2048, minimumPortraitHeight: 2048, minimumSquareSide: 2048 },
      "4K": { minimumLandscapeWidth: 3840, minimumPortraitHeight: 3840, minimumSquareSide: 3840 },
    },
    aspectRatioTolerancePercent: 8,
    minimumByteLength: 1024,
    edgeFrameDetection: { enabled: false },
  },
};
const config = normalizeControlPlanePromptConfig("section_background_image", {
  snapshotVersion: 3,
  modelOptions: defaults,
  effectiveAspectRatio: "16:9",
});

assert.equal(validateControlPlaneConfig("section_background_image", { modelOptions: defaults }), true);
assert.throws(
  () => validateRequestedImageResolution({ width: 1920, height: 1080, mimeType: "image/jpeg" }, config),
  (error) => error.code === "IMAGE_RESOLUTION_BELOW_REQUEST"
);
assert.equal(
  validateRequestedImageResolution({ width: 2048, height: 1152, mimeType: "image/jpeg" }, config),
  true
);
assert.throws(
  () => validateRequestedImageResolution({ width: 2048, height: 2048, mimeType: "image/jpeg" }, config),
  (error) => error.code === "IMAGE_ASPECT_RATIO_MISMATCH"
);

const root = path.resolve(__dirname, "..");
const createPromo = fs.readFileSync(path.join(root, "prototype", "create-promo.js"), "utf8");
const renderer = fs.readFileSync(path.join(root, "visual-editor", "src", "PromoPageRenderer.vue"), "utf8");
const admin = fs.readFileSync(path.join(root, "prototype", "app.js"), "utf8");
assert.match(createPromo, /backgroundFitMode/);
assert.match(createPromo, /targetGeometry/);
assert.doesNotMatch(createPromo, /backgroundSize:\s*"contain"/);
assert.match(renderer, /fitMode === "width-fill"/);
assert.match(renderer, /"100% auto"/);
assert.match(admin, /generationPolicyText/);
assert.match(admin, /validationPolicyText/);

console.log("Section AI image policy V3 tests passed.");
