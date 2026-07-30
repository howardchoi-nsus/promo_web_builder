const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const {
  keyVisualTextPromptInstruction,
  normalizeKeyVisualTextPolicy,
} = require("../api/_section-key-visual-contract");
const {
  buildImageHarnessPrompt,
} = require("../api/_section-ai-control-plane");

const registeredContent = {
  title: "여름 신규 고객 충전 이벤트",
  leadText: "신규 고객을 위한 첫 충전 혜택",
  description: "게임에 참가하고 이벤트에 참여하세요",
  primaryAction: { label: "게임 참가" },
};

assert.deepEqual(
  normalizeKeyVisualTextPolicy({}, registeredContent),
  { mode: "none", text: "" },
);
assert.deepEqual(
  normalizeKeyVisualTextPolicy({
    keyVisualTextMode: "explicit",
    keyVisualText: "SUMMER DROP",
  }, registeredContent),
  { mode: "explicit", text: "SUMMER DROP" },
);
assert.throws(
  () => normalizeKeyVisualTextPolicy({
    keyVisualTextMode: "explicit",
    keyVisualText: "여름 신규 고객 충전 이벤트",
  }, registeredContent),
  (error) => error.code === "KEY_VISUAL_TEXT_POLICY_INVALID",
);
assert.throws(
  () => normalizeKeyVisualTextPolicy({
    keyVisualTextMode: "explicit",
    keyVisualText: "게임 참가",
  }, registeredContent),
  /must not reproduce registered/,
);
assert.throws(
  () => normalizeKeyVisualTextPolicy({
    keyVisualTextMode: "explicit",
    keyVisualText: "ONE TWO THREE FOUR FIVE",
  }, registeredContent),
  /4 words or fewer/,
);
assert.deepEqual(
  normalizeKeyVisualTextPolicy({
    keyVisualTextMode: "explicit",
    keyVisualText: "IGNORED",
  }, registeredContent, "item"),
  { mode: "none", text: "" },
);

const noTextInstruction = keyVisualTextPromptInstruction({ mode: "none", text: "" });
assert.match(noTextInstruction, /main title, lead text, description text, CTA label/);
assert.match(noTextInstruction, /Render no visible text/);
const explicitInstruction = keyVisualTextPromptInstruction({ mode: "explicit", text: "SUMMER DROP" });
assert.match(explicitInstruction, /"SUMMER DROP"/);
assert.match(explicitInstruction, /only visible text permitted/);

const harnessPrompt = buildImageHarnessPrompt({
  prompt: "Create a supporting background image.",
  targetType: "section-background",
  keyVisualTextPolicy: { mode: "explicit", text: "SUMMER DROP" },
});
assert.match(harnessPrompt, /PROMOTIONAL SECTION KEY VISUAL/);
assert.match(harnessPrompt, /background placement is an implementation detail/);
assert.ok(
  harnessPrompt.lastIndexOf('"SUMMER DROP"') > harnessPrompt.lastIndexOf("Do not render text"),
  "Approved key visual text exception must appear after generic negative rules",
);

const root = path.resolve(__dirname, "..");
const runs = fs.readFileSync(path.join(root, "api", "promo-section-design-runs.js"), "utf8");
const createPromo = fs.readFileSync(path.join(root, "prototype", "create-promo.js"), "utf8");
const sectionProperties = fs.readFileSync(path.join(root, "visual-editor", "src", "SectionProperties.vue"), "utf8");
const adapter = fs.readFileSync(path.join(root, "visual-editor", "src", "platform", "adapters", "promo-builder-adapter.mjs"), "utf8");
assert.match(runs, /normalizeKeyVisualTextPolicy/);
assert.match(runs, /keyVisualTextPolicy/);
assert.match(createPromo, /keyVisualTextMode/);
assert.match(createPromo, /keyVisualText:\s*requestedKeyVisualTextPolicy\.text/);
assert.match(sectionProperties, /AI 키비주얼/);
assert.match(sectionProperties, /승인 문구 사용/);
assert.match(adapter, /keyVisualTextMode/);

console.log("Section key visual contract tests passed.");
