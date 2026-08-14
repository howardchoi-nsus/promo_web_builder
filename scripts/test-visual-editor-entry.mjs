import assert from "node:assert/strict";
import { createVisualEditorUrl, visualEditorEntry } from "../visual-editor/src/platform/visual-editor-entry.mjs";

const origin = "https://promo.example";
assert.equal(new URL(createVisualEditorUrl("admin-layout", { templateId: "t 1" }, origin)).searchParams.get("templateId"), "t 1");
assert.equal(new URL(visualEditorEntry.sectionPreset("s1", "hero-center", origin)).searchParams.get("mode"), "section-preset");
assert.equal(new URL(visualEditorEntry.aiDocument("d1", 4, origin)).searchParams.get("revision"), "4");
assert.equal(new URL(visualEditorEntry.output("d1", 4, "https://promo.example/builder", origin)).searchParams.get("returnUrl"), "https://promo.example/builder");
assert.throws(() => createVisualEditorUrl("", {}, origin), /mode is required/);
console.log("Visual Editor entry URL test passed");
