# Shared Header Design QA

- Date: 2026-07-17
- Source visual truth: `/private/tmp/01-admin-header-reference.png`
- Wizard implementation: `/private/tmp/header-impl-wizard.png`
- Visual Editor implementation: `/private/tmp/header-impl-visual-editor-light.png`
- Mobile evidence: `/private/tmp/header-impl-wizard-mobile.png`, `/private/tmp/header-impl-editor-mobile.png`
- Combined comparison: `/private/tmp/header-design-qa-comparison.png`
- Desktop viewport: 1265 × 712 CSS pixels
- Mobile viewport: 390 × 844 CSS pixels (375px document client width in the in-app browser)
- State: light theme, default route, first Wizard step, default Visual Editor template

## Full-view comparison evidence

The Admin/Promo Builder header was used as the reference. The Wizard and Visual Editor implementations use the same white panel, square border treatment, 24px heavy brand typography, 34px navigation controls, blue active state, theme control, and green status treatment. The Wizard retains its dark workflow surface below the shared header. The Visual Editor moves page-background and output actions into a separate toolbar below the shared header.

## Focused region comparison evidence

The comparison image crops the upper 125px of the reference and both implementations. A focused crop was sufficient because the requested design change is bounded to the global header and the Visual Editor toolbar boundary. No image assets, logos, illustrations, or non-standard icons appear in the target header.

## Required fidelity surfaces

- Fonts and typography: passed. All headers use the existing Inter/Pretendard stack, 24px brand size, 12px navigation text, and matching heavy weights.
- Spacing and layout rhythm: passed. Desktop header height, 14px/18px padding, 6px navigation gap, and 34px control height match the reference. At 390px the navigation wraps without horizontal overflow.
- Colors and visual tokens: passed. Shared light/dark shell tokens reproduce the reference panel, line, blue active state, and green status state.
- Image quality and asset fidelity: not applicable. The reference header contains no raster imagery or custom image assets.
- Copy and content: passed. All five service destinations use the same labels and order. Page identity and status remain page-specific.

## Findings

No actionable P0, P1, or P2 visual differences remain.

- [P3] Wizard retains a dark workflow canvas below the light shared header. This is intentional to preserve the established Wizard visual language while making service navigation consistent.
- [P3] Admin keeps its handoff selector in the identity area, while Wizard and Visual Editor use a page label. This is an intentional functional difference within the same header contract.

## Interaction and accessibility verification

- Shared navigation renders on Admin/Builder, Wizard, and Visual Editor.
- Current page exposes `aria-current="page"`.
- Theme control updates its accessible label and persists across Wizard and Visual Editor navigation.
- Wizard step status updates both the page footer and shared header status.
- Visual Editor global navigation is separated from the page-background/output toolbar.
- Wizard iframe editor mode does not render a nested global header.
- Desktop and 390px mobile layouts have no document-level horizontal overflow.
- Browser console errors: 0.

## Comparison history

### Iteration 1

- Earlier findings: Wizard and Visual Editor used unrelated header structures; navigation sets differed; theme state and active page semantics were missing; Visual Editor mixed service navigation with editing tools.
- Fixes made: introduced shared shell CSS and theme controller, aligned navigation and active state, added page/status slots, separated the Visual Editor toolbar, and suppressed the global shell in Wizard iframe mode.
- Post-fix evidence: `/private/tmp/header-design-qa-comparison.png` plus the desktop/mobile implementation captures listed above.
- Remaining P0/P1/P2 findings: none.

## Implementation checklist

- [x] Shared header styles and tokens
- [x] Shared theme storage/controller
- [x] Admin/Builder semantic current-page state
- [x] Wizard shared header and dynamic step status
- [x] Visual Editor shared header and separate tool toolbar
- [x] Embedded Wizard editor header suppression
- [x] Desktop/mobile browser verification
- [x] Contract, behavior, syntax, and production-build verification

final result: passed
