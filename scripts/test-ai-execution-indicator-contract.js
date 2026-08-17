const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..");
const read = (...parts) => fs.readFileSync(path.join(root, ...parts), "utf8");
const endpoint = read("api", "prompt-execution-display.js");
const indicator = read("visual-editor", "src", "builder", "AiExecutionIndicator.vue");
const briefPanel = read("visual-editor", "src", "builder", "AiBriefPanel.vue");
const builderApp = read("visual-editor", "src", "builder", "AiBuilderApp.vue");
const progress = read("visual-editor", "src", "builder", "CompositionProgress.vue");
const styles = read("visual-editor", "src", "builder", "ai-builder.css");

assert.match(endpoint, /status = 'active'/);
assert.doesNotMatch(endpoint, /renderedPrompt|body,/);
assert.match(indicator, /providerLabel/);
assert.match(indicator, /modelLabel/);
assert.match(styles, /ai-execution-pulse/);
assert.match(styles, /prefers-reduced-motion/);
assert.doesNotMatch(briefPanel, /AiExecutionIndicator/);
assert.match(builderApp, /store\.stage === "analyzing_overview"/);
assert.match(builderApp, /builder\.progress\.analyzingOverview/);
assert.match(builderApp, /builder\.progress\.composingStructure/);
assert.match(builderApp, /builder\.progress\.generatingStructure/);
assert.match(builderApp, /builder\.progress\.preparingPreview/);
assert.match(builderApp, /loadPromptExecutionDisplay\("section_background_image"\)/);
assert.match(builderApp, /loadPromptExecutionDisplay\("component_image"\)/);
assert.match(progress, /@lottiefiles\/dotlottie-vue/);
assert.match(progress, /2fa87e8f-301c-4e0e-b553-c68da36dd4a3\/Xkxf2s4TQI\.lottie/);
assert.match(progress, /\/prototype\/assets\/ai-processing\.lottie/);
assert.match(progress, /autoplay/);
assert.match(progress, /loop/);
assert.match(styles, /min-height: calc\(100vh - 88px\)/);
assert.match(styles, /\.ai-composition-progress \.ai-execution-indicator__message/);

console.log("AI execution indicator contract tests passed.");
