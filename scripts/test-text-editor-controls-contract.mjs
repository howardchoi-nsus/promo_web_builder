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
const main = read("visual-editor", "src", "main.js");
const apiLayoutStore = read("api", "_wizard-form-template-layout-store.js");
const viteConfig = read("visual-editor", "vite.config.js");

assert.match(previewPanel, /<TextEditorControls/);
assert.match(textControls, /role="toolbar"/);
assert.doesNotMatch(textControls, /text-editor-controls__identity/);
assert.match(main, /@fortawesome\/fontawesome-free\/css\/fontawesome\.min\.css/);
assert.match(main, /@fortawesome\/fontawesome-free\/css\/solid\.min\.css/);
assert.match(viteConfig, /base:\s*"\/prototype\/visual-editor-assets\/"/);
assert.match(textControls, /fa-arrow-rotate-left/);
assert.match(textControls, /fa-arrow-rotate-right/);
assert.match(textControls, /fa-bold/);
assert.match(textControls, /fa-italic/);
assert.match(textControls, /fa-highlighter/);
assert.match(textControls, /fa-list-ul/);
assert.match(textControls, /fa-list-ol/);
assert.match(textControls, /fa-outdent/);
assert.match(textControls, /fa-indent/);
assert.match(textControls, /fontFamilyToken/);
assert.match(textControls, /fontWeightToken/);
assert.match(textControls, /textStyleToken/);
assert.match(textControls, /textGradientToken/);
assert.match(textControls, /textBackgroundToken/);
assert.match(textControls, /listType/);
assert.match(textControls, /changeListIndent/);
assert.match(textControls, /lineSelection/);
assert.match(textControls, /emitLinePatch/);
assert.match(previewPanel, /@select-text-lines="updateSelectedTextLines"/);
assert.match(previewPanel, /@click="clearPreviewSelection"/);
assert.match(previewPanel, /selectedTextLines\.value = null/);
assert.match(app, /@clear-selection="clearEditorSelection"/);
assert.match(previewPanel, /defineExpose\(\{ finishTextEdit,/);
assert.match(app, /previewPanelRef\.value\?\.finishTextEdit\(\)/);
assert.match(app, /function selectedRenderedItemRect\(\)/);
assert.match(app, /renderedRect\?\.height/);
assert.match(app, /고정 영역을 넘는 내용은 미리보기와 출력에서 잘립니다/);
assert.match(textControls, /lineHeightToken/);
assert.match(textControls, /letterSpacingToken/);
assert.match(textControls, /horizontalAnchor/);
assert.match(textControls, /verticalAnchor/);
assert.match(textControls, /자동 크기/);
assert.match(app, /RESPONSIVE_ITEM_STYLE_PATCH/);
assert.match(commands, /RESPONSIVE_ITEM_STYLE_PATCH/);
assert.match(renderer, /positionMode === "anchored"/);
assert.match(renderer, /scaleFont:\s*false/);
assert.match(renderer, /usesAutomaticComponentHeight/);
assert.match(renderer, /textListItems/);
assert.match(renderer, /--item-list-padding/);
assert.match(renderer, /select-text-lines/);
assert.match(renderer, /textLineEntries/);
assert.match(rendererCss, /rendered-text-line\.is-bullet/);
assert.match(renderer, /has-text-gradient/);
assert.match(rendererCss, /--item-text-background/);
assert.match(rendererCss, /background-clip:\s*text/);
assert.match(rendererCss, /\.is-outline-mode \.rendered-item/);
assert.match(apiLayoutStore, /"textGradientToken"/);
assert.match(apiLayoutStore, /"textBackgroundToken"/);
assert.match(apiLayoutStore, /"listType"/);
assert.match(apiLayoutStore, /INVALID_LIST_INDENT/);

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
      textStyleToken: "--promo-font-size-main-title",
      textGradientToken: "--app-theme-toggle-gradient",
      textBackgroundToken: "--app-accent-soft",
      listType: "bullet",
      listIndent: 2,
      lineStyles: {
        $item: {
          0: { fontWeight: 700, listType: "bullet", listIndent: 1 },
          1: { colorToken: "--promo-color-text" },
        },
      },
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

const invalidList = validateLayoutSpec({
  itemStyles: { "hero.title": { listType: "checklist" } },
});
assert.equal(invalidList.ok, false);
assert(invalidList.errors.some((entry) => entry.path.endsWith("listType")));

const invalidListIndent = validateLayoutSpec({
  itemStyles: { "hero.title": { listType: "bullet", listIndent: 7 } },
});
assert.equal(invalidListIndent.ok, false);
assert(invalidListIndent.errors.some((entry) => entry.path.endsWith("listIndent")));

const invalidLineStyle = validateLayoutSpec({
  itemStyles: { "hero.title": { lineStyles: { $item: { 0: { positionMode: "free" } } } } },
});
assert.equal(invalidLineStyle.ok, false);
assert(invalidLineStyle.errors.some((entry) => entry.path.endsWith("positionMode")));

console.log("Text editor controls, outline, auto-size, and section anchor contract tests passed.");
