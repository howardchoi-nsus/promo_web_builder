# Design QA — Left Sidebar Global Navigation

- 검증일: 2026-07-21
- 기준 이미지: `/Users/hojunchoi/Downloads/91c89a2ae272deae667932f0a75f8a88.webp`
- 구현 화면: `http://127.0.0.1:4174/prototype/index.html`
- 비교 이미지: `/private/tmp/promo-shell-design-qa-comparison.png`
- 적용 범위: 기존 상단 전역 nav를 좌측 전역 sidebar로 이동

## Scope interpretation

사용자가 명시한 핵심은 참고 화면의 업무 도메인·색상·아이콘을 복제하는 것이 아니라, 현재 상단 nav를 왼쪽으로 이동하는 것이다. 따라서 기존 Promo Builder/Admin/Wizard/Editor 내부 정보구조와 앱 디자인 토큰은 유지하고 Shell 배치만 비교했다.

## Rubric

| 항목 | 점수 | 확인 결과 |
|---|---:|---|
| Layout | 18/20 | 좌측 고정 sidebar, 우측 utility/content 구조가 기준 이미지의 핵심 골격과 일치 |
| Hierarchy | 19/20 | 브랜드 → 전역 nav → 테마의 세로 위계와 페이지 제목/상태의 우측 분리가 명확 |
| Typography | 9/10 | 기존 제품 타이포그래피를 유지하며 sidebar에서 크기·굵기 단계가 안정적 |
| Color | 8/10 | 기존 light/dark 앱 토큰을 유지한 의도적 차이. active/hover 대비는 충분 |
| Components | 18/20 | 44px nav, active marker, sticky utility bar, Drawer와 overlay가 일관된 계약 사용 |
| Craft | 9/10 | 208/176px 폭, 60px utility, 여백과 정렬이 토큰화되고 수평 overflow 없음 |
| Content | 5/5 | 기존 메뉴 라벨·순서·URL 유지 |
| UX states | 5/5 | active, hover, theme, Drawer, Escape, focus return, overlay 상태 구현 |

총점: **91/100**

## Browser evidence

- 1440px: sidebar 208px, 고정 노출, 수평 overflow 없음
- 1280px: Builder/Create Promo/Visual Editor에서 sidebar 208px 및 기존 내부 레이아웃 유지
- 1024px: compact sidebar 176px, 수평 overflow 없음
- 768px/390px: off-canvas Drawer와 메뉴 버튼 노출
- Drawer: `aria-expanded` 갱신, body scroll lock, 닫기 버튼 focus, Escape 후 trigger focus 복귀 확인
- URL active state: Builder, Admin, Create Promo, Visual Editor, Generated UI 확인
- Visual Editor `wizard-layout`와 `output`: 전역 sidebar 0개 확인

## Defect triage

- P0: 없음
- P1: 없음
- P2: 없음. 초기 비교에서 비활성 nav의 legacy border 상속과 닫힌 모바일 Drawer의 접근성 트리 노출을 발견해 수정 완료

## Intentional differences

- 참고 이미지의 검정 sidebar, 노란 accent, 아이콘 체계는 복제하지 않았다.
- 기존 Promo Web Builder의 light/dark 토큰과 텍스트 nav를 유지했다.
- 화면 내부 패널, Stepper, Visual Editor 3열 구조는 변경하지 않았다.

final result: passed

---

# Shared Header Design QA — Archived 2026-07-17

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
