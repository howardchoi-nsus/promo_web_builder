import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { validateLayoutSpec } from "../visual-editor/src/layout-utils.mjs";

const root = path.resolve(import.meta.dirname, "..");
const read = (...parts) => fs.readFileSync(path.join(root, ...parts), "utf8");
const app = read("visual-editor", "src", "App.vue");
const renderer = read("visual-editor", "src", "PromoPageRenderer.vue");
const rendererCss = read("visual-editor", "src", "promo-renderer.css");
const previewPanel = read("visual-editor", "src", "platform", "editor-ui", "PreviewPanel.vue");
const textControls = read("visual-editor", "src", "platform", "editor-ui", "TextEditorControls.vue");
const commands = read("visual-editor", "src", "platform", "editor-core", "editor-commands.mjs");

assert.match(previewPanel, /<TextEditorControls/);
assert.match(textControls, /role="toolbar"/);
assert.match(textControls, /fontFamilyToken/);
assert.match(textControls, /fontWeightToken/);
assert.match(textControls, /lineHeightToken/);
assert.match(textControls, /letterSpacingToken/);
assert.match(textControls, /horizontalAnchor/);
assert.match(textControls, /verticalAnchor/);
assert.match(textControls, /자동 크기/);
assert.match(app, /RESPONSIVE_ITEM_STYLE_PATCH/);
assert.match(commands, /RESPONSIVE_ITEM_STYLE_PATCH/);
assert.match(renderer, /positionMode === "anchored"/);
assert.match(renderer, /scaleFont:\s*false/);
assert.match(renderer, /heightMode === "auto"/);
assert.match(rendererCss, /\.is-outline-mode \.rendered-item/);

const valid = validateLayoutSpec({
  itemStyles: {
    "hero.title": {
      positionMode: "anchored",
      horizontalAnchor: "center",
      verticalAnchor: "middle",
      widthMode: "fit-content",
      heightMode: "auto",
      fontFamilyToken: "--promo-font-family-body",
      fontWeightToken: "--promo-font-weight-bold",
      lineHeightToken: "--promo-line-height-title",
      letterSpacingToken: "--promo-letter-spacing-title",
      textAlign: "center",
    },
  },
  responsiveLayouts: {
    mobile: {
      itemStyles: {
        "hero.title": {
          positionMode: "anchored",
          horizontalAnchor: "center",
          verticalAnchor: "top",
          offsetY: 24,
        },
      },
    },
  },
});
assert.equal(valid.ok, true, JSON.stringify(valid.errors));

const invalid = validateLayoutSpec({
  itemStyles: {
    "hero.title": {
      positionMode: "anchored",
      horizontalAnchor: "outside",
      heightMode: "content-magic",
    },
  },
});
assert.equal(invalid.ok, false);
assert(invalid.errors.some((entry) => entry.path.endsWith("horizontalAnchor")));
assert(invalid.errors.some((entry) => entry.path.endsWith("heightMode")));

console.log("Text editor controls, outline, auto-size, and section anchor contract tests passed.");
