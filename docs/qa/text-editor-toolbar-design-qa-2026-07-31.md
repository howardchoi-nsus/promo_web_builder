# Text Editor Toolbar Design QA

- Source visual truth: `docs/qa/text-editor-toolbar-reference-2026-07-31.png`
- Implementation screenshot: `docs/qa/text-editor-toolbar-implementation-2026-07-31.png`
- Focused implementation crop: `docs/qa/text-editor-toolbar-implementation-crop-2026-07-31.png`
- Combined comparison: `docs/qa/text-editor-toolbar-comparison-2026-07-31.png`
- Browser viewport: 1280 × 720 CSS px
- Device pixel ratio: 1
- Source pixels: 772 × 45
- Implementation pixels: 1280 × 720; focused toolbar region: 600 × 83
- State: Admin Layout editor, Hero title text selected, light editor theme
- Density normalization: both captures use 1× pixel density. The reference is a full-width toolbar, while the implementation is intentionally evaluated inside the product's 600 px center editor pane.

## Full-view comparison evidence

The complete editor screenshot confirms that the toolbar sits immediately above Live Preview, remains inside the center pane, and does not cover the preview canvas or the structure/property panels. The requested Font Awesome controls render as real icon-font glyphs with no missing-glyph boxes. The layout uses two compact rows at the constrained editor-pane width so all primary controls remain visible.

## Focused-region comparison evidence

The combined comparison shows the same compact rich-editor hierarchy as the reference: history actions, select controls, emphasis, color tools, and list tools are grouped with separators and icon-only toggles. The implementation intentionally replaces the reference's paragraph selector with a design-token text-style selector and adds the requested section-position controls. No additional focused crop was required because the toolbar and every icon are legible in the 600 × 83 crop.

## Required fidelity surfaces

- Fonts and typography: editor chrome keeps the existing product UI font. Font family, size, weight, line-height, and letter-spacing values come from active design tokens. Text-style selection applies a semantic token bundle, and subsequent atomic changes return it to the custom state.
- Spacing and layout rhythm: 32 px icon targets, 4–6 px group spacing, separators, and a two-row wrap keep all controls visible in the 600 px editor pane. The toolbar remains compact enough for the browser resize workflow.
- Colors and visual tokens: font colors and highlight colors use active token values. Solid and gradient text-fill contracts are supported; the current fixture has no selectable gradient token. Palette states use existing editor surface, line, accent, and focus tokens.
- Image quality and asset fidelity: all toolbar icons use Font Awesome Free solid glyphs. No handwritten SVG, text-symbol substitute, or raster placeholder is used.
- Copy and content: visible field titles were removed. Tooltips and accessible names use the requested Korean terms, including `되돌리기`, `복구하기`, `폰트 컬러`, `폰트 배경`, `불렛 리스트`, and `넘버 리스트`.

## Findings

No actionable P0, P1, or P2 visual differences remain.

- Accepted difference: the 600 px editor pane wraps the toolbar to two rows, while the 772 px reference fits one row. This preserves every requested control without horizontal clipping.
- Accepted difference: underline, link, and image insertion controls from the reference are not included because they were outside the requested menu contract.

## Interaction verification

- Bold toggles on, enables Undo, and returns to normal through Undo.
- Bullet and numbered lists are mutually exclusive and render semantic `ul`/`ol` output.
- The main-title text style resolves to the 68 px active design token.
- Font-color and system highlight palettes open and expose named token swatches.
- Section alignment icons and automatic sizing/placement controls remain available.
- Browser console: no errors or warnings in the verified state.

## Comparison history

1. Initial build: Font Awesome glyphs appeared as missing-character boxes because the generated CSS referenced font files from `/`. Fixed the Vite asset base to `/prototype/visual-editor-assets/`; the follow-up capture shows the actual icons.
2. First responsive pass: three toolbar rows reduced preview height enough to make an existing resize smoke test fail. Integrated section positioning into the wrapping toolbar; the follow-up browser smoke test passed and the final toolbar uses two rows.
3. Final pass: verified token dropdowns, color/highlight palette, Bold/Undo, list switching, Font Awesome rendering, responsive placement, and console state.

## Implementation checklist

- [x] Remove visible menu title block.
- [x] Use Font Awesome for icon controls.
- [x] Connect Undo/Redo to editor history.
- [x] Populate typography controls from active design tokens.
- [x] Add solid/gradient font fill and system highlight token contracts.
- [x] Add semantic bullet and numbered list rendering.
- [x] Preserve section-position controls as a separate visual group.
- [x] Verify build, contracts, browser interactions, and resize regression.

## Follow-up polish

- P3: add a dedicated promotion-content gradient token to the active default token set so the gradient section of the font-color palette is populated without relying on an editor-system gradient.

final result: passed
