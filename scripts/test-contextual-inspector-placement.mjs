import assert from "node:assert/strict";
import { resolveContextualInspectorPlacement } from "../visual-editor/src/platform/editor-ui/contextual-inspector-placement.mjs";

const viewportRect = { width: 1200, height: 800 };
const popoverRect = { width: 360, height: 480 };

assert.equal(resolveContextualInspectorPlacement({
  anchorRect: { left: 100, right: 300, top: 100, bottom: 200, width: 200 }, viewportRect, popoverRect,
}).placement, "right");

assert.equal(resolveContextualInspectorPlacement({
  anchorRect: { left: 900, right: 1100, top: 100, bottom: 200, width: 200 }, viewportRect, popoverRect,
}).placement, "left");

assert.equal(resolveContextualInspectorPlacement({
  anchorRect: { left: 350, right: 850, top: 80, bottom: 180, width: 500 }, viewportRect, popoverRect,
}).placement, "bottom");

assert.equal(resolveContextualInspectorPlacement({
  anchorRect: { left: 100, right: 300, top: 70, bottom: 700, width: 200 },
  viewportRect: { width: 390, height: 760 }, popoverRect,
}).placement, "sheet");

console.log("Contextual inspector placement tests passed.");
