import assert from "node:assert/strict";
import {
  DEFAULT_COMPONENT_WIDTH_PCT,
  MAXIMUM_COMPONENT_HEIGHT_PX,
  MAXIMUM_SECTION_HEIGHT_PX,
  MINIMUM_COMPONENT_HEIGHT_PX,
  MINIMUM_COMPONENT_WIDTH_PCT,
  defaultComponentHeight,
  geometryToLayoutStyle,
  normalizeComponentGeometry,
  usesAutomaticComponentHeight,
} from "../visual-editor/src/platform/layout-engine/geometry.mjs";
import { resizeComponentGeometry } from "../visual-editor/src/platform/layout-engine/resize.mjs";

const textItem = { itemKey: "title", fieldKind: "text" };
assert.equal(MINIMUM_COMPONENT_WIDTH_PCT, 4);
assert.equal(MINIMUM_COMPONENT_HEIGHT_PX, 24);
assert.equal(MAXIMUM_COMPONENT_HEIGHT_PX, 900);
assert.equal(MAXIMUM_SECTION_HEIGHT_PX, 1200);
assert.equal(usesAutomaticComponentHeight(textItem, {}), true);
assert.equal(usesAutomaticComponentHeight(textItem, { heightMode: "auto" }), true);
assert.equal(usesAutomaticComponentHeight(textItem, { heightMode: "fixed" }), false);
assert.equal(usesAutomaticComponentHeight({ fieldKind: "cta" }, {}), false);
assert.equal(usesAutomaticComponentHeight({ fieldKind: "image" }, { heightMode: "auto" }), false);
const shortContentGeometry = normalizeComponentGeometry({
  item: textItem,
  style: {},
  canvasWidth: 800,
});
const longContentGeometry = normalizeComponentGeometry({
  item: { ...textItem, previewText: "This text length must not affect geometry." },
  style: {},
  canvasWidth: 800,
});

assert.deepEqual(shortContentGeometry, longContentGeometry);
assert.equal(shortContentGeometry.widthPct, DEFAULT_COMPONENT_WIDTH_PCT);
assert.equal(shortContentGeometry.height, defaultComponentHeight(textItem));

const tinyImageGeometry = normalizeComponentGeometry({
  item: { itemKey: "visual", fieldKind: "image" },
  style: { widthPct: 0.01, heightPx: 1 },
  canvasWidth: 1280,
});
assert.equal(tinyImageGeometry.widthPct, MINIMUM_COMPONENT_WIDTH_PCT);
assert.equal(tinyImageGeometry.height, MINIMUM_COMPONENT_HEIGHT_PX);

const start = normalizeComponentGeometry({
  item: textItem,
  style: { xPct: 10, yPx: 40, widthPct: 32, heightPx: 100, fontSize: 20 },
  canvasWidth: 1280,
});
const resized = resizeComponentGeometry({
  geometry: start,
  deltaX: 128,
  direction: "e",
  maximumWidth: 1152,
});
const layoutStyle = geometryToLayoutStyle(resized, 1280);

assert.equal(layoutStyle.xPct, 10);
assert.equal(layoutStyle.widthPct, 42);
assert.equal(layoutStyle.heightPx, 100);
assert.equal(layoutStyle.fontSize, 26.25);

const westResized = resizeComponentGeometry({
  geometry: start,
  deltaX: -64,
  direction: "w",
  maximumWidth: 1280,
});
assert.equal(westResized.x, 64);
assert.equal(westResized.width, 473.6);

const cornerResized = resizeComponentGeometry({
  geometry: start,
  deltaX: 128,
  deltaY: 50,
  direction: "se",
  maximumWidth: 1280,
});
assert.ok(cornerResized.fontSize > start.fontSize);

const lockedImage = resizeComponentGeometry({
  geometry: { x: 0, y: 0, width: 320, height: 180, fontSize: 18 },
  deltaX: 160,
  direction: "se",
  minimumWidth: 80,
  minimumHeight: 80,
  maximumWidth: 1280,
  aspectRatioLocked: true,
  aspectRatio: 16 / 9,
  scaleFont: false,
});
assert.equal(Math.round((lockedImage.width / lockedImage.height) * 100), 178);
assert.equal(lockedImage.fontSize, 18);

const zeroFontExpanded = resizeComponentGeometry({
  geometry: { x: 0, y: 0, width: 100, height: 20, fontSize: 0 },
  deltaX: 40,
  direction: "e",
  maximumWidth: 1280,
});
assert.equal(zeroFontExpanded.fontSize, 10);

console.log("Editor layout engine tests passed.");
