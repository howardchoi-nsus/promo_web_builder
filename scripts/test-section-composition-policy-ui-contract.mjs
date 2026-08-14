import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const html = fs.readFileSync(path.join(root, "prototype", "index.html"), "utf8");
const app = fs.readFileSync(path.join(root, "prototype", "app.js"), "utf8");
const styles = fs.readFileSync(path.join(root, "prototype", "styles.css"), "utf8");

assert.match(html, /AI PAGE COMPOSITION/);
assert.match(html, /현재 적용 결과/);
assert.match(html, /wizardSectionSelectionPolicyOptions\(\)/);
assert.match(html, /selectionPolicy === 'required-by-market'/);
assert.match(html, /selectionPolicy === 'required-by-purpose'/);
assert.match(html, /wizardSectionContentModeOptions\(\)/);
assert.match(html, /AI가 레이아웃 프리셋 선택/);
assert.doesNotMatch(html, />선택 정책<\/span>[\s\S]{0,120}<select v-model="wizardSectionFieldsEditor\.compositionPolicy\.selectionPolicy"/);
assert.match(app, /wizardSectionCompositionSummary\(\)/);
assert.match(app, /value: "manual-only"/);
assert.match(app, /policy\.contentLocked = mode === "locked"/);
assert.match(styles, /\.section-policy-choice\.selected/);
assert.match(styles, /\.section-policy-condition/);
assert.match(styles, /@media \(max-width: 760px\)/);

console.log("Section composition policy UI contract test passed");
