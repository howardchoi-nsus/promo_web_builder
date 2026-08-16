import assert from "node:assert/strict";
import {
  inspectLayoutSnapshot,
  layoutJsonEnvelope,
  safeJsonFileName,
} from "../admin-app/src/services/layout-json-inspector.mjs";

const validSnapshot = {
  contractVersion: 1,
  layoutMode: "free",
  viewports: {
    desktop: { items: { title: { xPct: 4, yPx: 20, widthPct: 72, heightPx: 80 } } },
    mobile: { items: { title: { xPct: 5, yPx: 16, widthPct: 90, heightPx: 90 } } },
  },
};
assert.deepEqual(inspectLayoutSnapshot(validSnapshot, ["title"]), []);

const incomplete = structuredClone(validSnapshot);
delete incomplete.viewports.mobile.items.title;
const incompleteIssues = inspectLayoutSnapshot(incomplete, ["title"]);
assert(incompleteIssues.some((entry) => entry.code === "LAYOUT_GEOMETRY_INCOMPLETE"));

const invalid = structuredClone(validSnapshot);
invalid.viewports.desktop.items.ghost = { xPct: 0, yPx: 0, widthPct: 120, heightPx: 20 };
const invalidIssues = inspectLayoutSnapshot(invalid, ["title"]);
assert(invalidIssues.some((entry) => entry.code === "LAYOUT_ITEM_KEY_UNKNOWN"));
assert(invalidIssues.some((entry) => entry.code === "LAYOUT_GEOMETRY_OUT_OF_RANGE"));

const envelope = layoutJsonEnvelope({
  id: "layout-id",
  layoutKey: "hero-center",
  layoutSnapshot: validSnapshot,
  selectionMetadata: { alignment: "center" },
}, { id: "section-id" }, true);
assert.equal(envelope.sectionId, "section-id");
assert.equal(envelope.aiSelectable, true);
assert.equal(envelope.layoutSnapshot.viewports.desktop.items.title.widthPct, 72);
assert.equal(safeJsonFileName({ layoutKey: "hero center/one" }), "hero-center-one.json");

console.log("Layout JSON inspector tests passed.");
