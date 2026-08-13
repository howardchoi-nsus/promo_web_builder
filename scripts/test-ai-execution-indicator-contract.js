const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..");
const read = (...parts) => fs.readFileSync(path.join(root, ...parts), "utf8");
const endpoint = read("api", "prompt-execution-display.js");
const indicator = read("visual-editor", "src", "builder", "AiExecutionIndicator.vue");
const styles = read("visual-editor", "src", "builder", "ai-builder.css");

assert.match(endpoint, /status = 'active'/);
assert.doesNotMatch(endpoint, /renderedPrompt|body,/);
assert.match(indicator, /providerLabel/);
assert.match(indicator, /modelLabel/);
assert.match(styles, /ai-execution-pulse/);
assert.match(styles, /prefers-reduced-motion/);

console.log("AI execution indicator contract tests passed.");
