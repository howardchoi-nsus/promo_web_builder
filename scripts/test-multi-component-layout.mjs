import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { createRequire } from "node:module";
import {
  executeMultiLayoutOperation,
  geometryToItemStylePatches,
  resolveSafeMultiLayoutOperation,
} from "../visual-editor/src/multi-layout.mjs";

const require = createRequire(import.meta.url);
const endpoint = require("../api/promo-multi-component-layout-plan");
const root = path.resolve(import.meta.dirname, "..");
const read = (...parts) => fs.readFileSync(path.join(root, ...parts), "utf8");

const geometry = [
  { itemKey: "title", xPct: 10, yPx: 80, widthPct: 25, heightPx: 100 },
  { itemKey: "image", xPct: 55, yPx: 260, widthPct: 30, heightPx: 180 },
];

const aligned = executeMultiLayoutOperation(geometry, {
  operation: "align-left",
  targetItemKeys: ["title", "image"],
  axis: null,
  gapToken: "space-4",
}, { canvasWidthPx: 1280, canvasHeightPx: 700 });
assert.deepEqual(aligned.map((entry) => entry.xPct), [10, 10]);
assert.deepEqual(
  executeMultiLayoutOperation(geometry, {
    operation: "align-left",
    targetItemKeys: ["title", "image"],
    axis: null,
    gapToken: "space-4",
  }, { canvasWidthPx: 1280, canvasHeightPx: 700 }),
  aligned,
  "same geometry and operation must be deterministic",
);

const stacked = executeMultiLayoutOperation(geometry, {
  operation: "group-stack-vertical",
  targetItemKeys: ["title", "image"],
  axis: "vertical",
  gapToken: "space-4",
}, { canvasWidthPx: 1280, canvasHeightPx: 700 });
assert.equal(stacked[1].yPx, stacked[0].yPx + stacked[0].heightPx + 16);
assert.equal(geometry[1].yPx, 260, "executor must not mutate source geometry");

const patches = geometryToItemStylePatches(stacked);
assert.equal(patches.title.positionMode, "free");
assert.equal(patches.image.widthPct, stacked[1].widthPct);

assert.throws(() => executeMultiLayoutOperation(geometry, {
  operation: "position:absolute",
  targetItemKeys: ["title", "image"],
  gapToken: "space-4",
}), /허용되지 않은/);
assert.throws(() => executeMultiLayoutOperation(geometry, {
  operation: "align-left",
  targetItemKeys: ["title", "invented"],
  gapToken: "space-4",
}), /대상이 현재 선택과 일치/);
assert.throws(() => executeMultiLayoutOperation([
  { itemKey: "a", xPct: 80, yPx: 0, widthPct: 20, heightPx: 100 },
  { itemKey: "b", xPct: 0, yPx: 0, widthPct: 30, heightPx: 100 },
], {
  operation: "align-right",
  targetItemKeys: ["a", "b"],
  gapToken: "space-4",
}, { canvasHeightPx: 500 }), /새 충돌|경계/);

const threeItems = [
  { itemKey: "title", xPct: 0, yPx: 0, widthPct: 38, heightPx: 100 },
  { itemKey: "description", xPct: 42, yPx: 0, widthPct: 38, heightPx: 100 },
  { itemKey: "cta", xPct: 0, yPx: 180, widthPct: 20, heightPx: 80 },
];
const adjusted = resolveSafeMultiLayoutOperation(threeItems, {
  operation: "align-left",
  targetItemKeys: ["title", "description", "cta"],
  axis: null,
  gapToken: "space-4",
}, { canvasWidthPx: 1280, canvasHeightPx: 700 });
assert.equal(adjusted.adjusted, true);
assert.equal(adjusted.plan.operation, "group-stack-vertical");
assert.equal(adjusted.geometry[1].yPx, 116);
assert.equal(adjusted.geometry[2].yPx, 232);

assert.deepEqual(endpoint.normalizeGeometry(geometry, ["title", "image"]), geometry);
assert.equal(endpoint.normalizeGeometry([
  { itemKey: "tiny", xPct: 0, yPx: 0, widthPct: 0.1, heightPx: 1 },
], ["tiny"])[0].widthPct, 0.1);
assert.throws(() => endpoint.normalizeGeometry([geometry[0]], ["title", "image"]), /every selected component/);
assert(endpoint.ALLOWED_OPERATIONS.includes("distribute-horizontal"));
assert(endpoint.GAP_TOKENS.includes("space-4"));

const provider = read("api", "_promo-section-design-provider.js");
const promptStore = read("api", "_prompt-template-store.js");
const app = read("visual-editor", "src", "App.vue");
const renderer = read("visual-editor", "src", "PromoPageRenderer.vue");
const migration = read("db", "migrations", "032_template_ai_policy_and_multi_layout.sql");
assert.match(provider, /MULTI_COMPONENT_LAYOUT_PLAN_SCHEMA/);
assert.match(provider, /Never return CSS|json_schema/);
assert.match(promptStore, /multi_component_layout_planner/);
assert.match(app, /AI 다중 정렬/);
assert.match(app, /requestMultiLayoutSuggestion/);
assert.match(app, /undoMultiLayout/);
assert.match(renderer, /selectedItemKeys/);
assert.match(migration, /add column if not exists ai_design jsonb/);

console.log("Multi-component layout planner and deterministic executor tests passed");
