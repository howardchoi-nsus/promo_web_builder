import assert from "node:assert/strict";
import {
  DEFAULT_COMPONENT_WIDTH_PCT,
  MAXIMUM_COMPONENT_HEIGHT_PX,
  MAXIMUM_SECTION_HEIGHT_PX,
  MINIMUM_COMPONENT_HEIGHT_PX,
  MINIMUM_COMPONENT_WIDTH_PCT,
  defaultComponentHeight,
  defaultComponentWidthPct,
  geometryToLayoutStyle,
  normalizeComponentGeometry,
  resolveRenderedComponentHeight,
  resolveSectionHeight,
  usesAutomaticComponentHeight,
} from "../visual-editor/src/platform/layout-engine/geometry.mjs";
import { resizeComponentGeometry } from "../visual-editor/src/platform/layout-engine/resize.mjs";

const textItem = { itemKey: "title", fieldKind: "text" };
assert.equal(MINIMUM_COMPONENT_WIDTH_PCT, 4);
assert.equal(MINIMUM_COMPONENT_HEIGHT_PX, 24);
assert.equal(MAXIMUM_COMPONENT_HEIGHT_PX, 900);
assert.equal(MAXIMUM_SECTION_HEIGHT_PX, 24000);
assert.equal(resolveSectionHeight(undefined, 460), 460);
assert.equal(resolveSectionHeight(240, 460), 240);
assert.equal(resolveSectionHeight(20, 460), 50);
assert.equal(resolveSectionHeight(30000, 460), MAXIMUM_SECTION_HEIGHT_PX);
assert.equal(usesAutomaticComponentHeight(textItem, {}), true);
assert.equal(usesAutomaticComponentHeight(textItem, { heightMode: "auto" }), true);
assert.equal(usesAutomaticComponentHeight(textItem, { heightMode: "fixed" }), false);
assert.equal(usesAutomaticComponentHeight({ fieldKind: "cta" }, {}), false);
assert.equal(usesAutomaticComponentHeight({ fieldKind: "image" }, { heightMode: "auto" }), false);
assert.equal(resolveRenderedComponentHeight(textItem, { heightPx: 180 }), undefined);
assert.equal(resolveRenderedComponentHeight(textItem, { heightMode: "auto", heightPx: 180 }), undefined);
assert.equal(resolveRenderedComponentHeight(textItem, { heightMode: "fixed", heightPx: 180 }), 180);
assert.equal(
  resolveRenderedComponentHeight(textItem, { heightMode: "fixed", heightPx: 1200 }),
  MAXIMUM_COMPONENT_HEIGHT_PX,
);
assert.equal(resolveRenderedComponentHeight({ fieldKind: "image" }, { heightPx: 180 }), 180);
assert.equal(
  resolveRenderedComponentHeight({ fieldKind: "image" }, {}),
  defaultComponentHeight({ fieldKind: "image" }),
);
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
assert.equal(defaultComponentWidthPct({ fieldKind: "text", textType: "title" }), 72);
assert.equal(defaultComponentWidthPct({ fieldKind: "image" }), 44);
assert.equal(defaultComponentWidthPct({ fieldKind: "cta" }), 24);
assert.equal(defaultComponentWidthPct({ fields: [{ fieldKind: "image" }, { fieldKind: "text" }] }), 100);
assert.equal(normalizeComponentGeometry({
  item: { fieldKind: "text", textType: "title" },
  style: {},
  canvasWidth: 1000,
}).widthPct, 72);
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
