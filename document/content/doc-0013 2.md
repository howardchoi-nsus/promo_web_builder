# Design QA — AI Full-workspace Progress State

- 검증일: 2026-08-18
- source visual truth: `/var/folders/rm/jsl0_0sn2p3cfkb1m2_vyp7m0000gn/T/codex-clipboard-2313bb42-33fc-4521-b24d-3a4e22102b2a.png`
- implementation screenshot: `/Users/hojunchoi/Documents/GitHub/promo_web_builder/design-qa-implementation.png`
- combined comparison: `/Users/hojunchoi/Documents/GitHub/promo_web_builder/design-qa-comparison.png`
- 구현 상태: AI 모드 → 영문 프로모션 설명 입력 → `AI 개요 분석` 실행 중
- 브라우저: 프로젝트 AI Builder 브라우저 통합 테스트(Chromium), light theme
- 구현 CSS viewport 및 캡처: 1280 × 720 CSS px, deviceScaleFactor 1, full-page 1280 × 756 pixels
- 기준 이미지: 1356 × 721 pixels. 비교 보드는 두 이미지를 원본 비율과 해상도로 세로 배치

## Full-view comparison evidence

기준과 구현 모두 전역 사이드바와 상단 페이지 헤더를 유지한 채, 나머지 빌더 작업영역 전체를 연한 배경의 진행 상태가 차지한다. 이번 요청에 따라 구현은 기준 화면의 `이미지 → 문구 → LLM` 순서를 `점멸 문구 → 이미지 → LLM 배지`로 변경했다. 입력 카드와 분석 버튼 하단의 작은 상태 표시는 나타나지 않는다.

## Focused region comparison evidence

중앙 진행 그룹을 확대 확인했다. 진행 문구의 하단이 Lottie 영역의 상단보다 위에 있고, Lottie 영역의 하단은 LLM 배지 상단보다 위에 있어 요청한 세로 순서가 실제 좌표로 검증됐다. 진행 화면의 LLM 배지는 기존 대비 아이콘 30→45px, 라벨 10→15px, 모델명 12→18px, 가로 padding 12→18px로 각각 정확히 150% 확대됐다. 비교 보드에서 해당 요소가 충분히 읽혀 별도 확대 crop은 필요하지 않았다.

## Required fidelity surfaces

- Fonts and typography: passed. 기존 제품 폰트 스택을 유지하고 진행 문구를 28–42px 반응형 굵은 글꼴로 표시한다. LLM 라벨과 모델명은 각각 15px/18px로 확대됐으며 문구 점멸은 `prefers-reduced-motion`에서 해제된다.
- Spacing and layout rhythm: passed. 진행 화면은 작업영역의 전체 높이를 사용하고 `문구 → 이미지 → LLM 배지` 순서로 중앙 정렬된다. 데스크톱 및 760px 이하 규칙에 별도 padding/min-height가 있다.
- Colors and visual tokens: passed. 배경, 텍스트, surface 색은 기존 앱 토큰을 사용하며 light theme 기준 대비가 충분하다.
- Image quality and asset fidelity: passed. 사용자가 제공한 Lottie 원본을 `prototype/assets/ai-processing.lottie`에 보존해 원격 로드 지연 없이 재생한다. 기준 이미지의 AI 칩 그림 대신 제공된 원본 일러스트를 쓰는 것은 명시적 요청에 따른 의도적 차이다.
- Copy and content: passed. 캡처된 재시도 상태 문구가 이미지 위에서 점멸하며, `OpenAI · gpt-4.1-mini` 및 수행 중인 LLM 라벨이 이미지 아래에 노출된다.

## Findings

조치가 필요한 P0/P1/P2 차이는 없다.

- [P3] 기준 이미지와 현재 앱 셸의 사이드바 폭이 다르다. 이번 기능 변경 전부터 존재하는 전역 셸 사양이며 진행 화면의 배치·가독성·작업영역 사용에는 문제가 없다.
- [P3] 기준 이미지의 LLM 표기는 텍스트 한 줄이지만 구현은 공급자 아이콘이 포함된 배지다. 어떤 AI가 동작하는지 보여 달라는 기존 제품 요구사항을 우선한 의도적 차이다.

## Interaction and accessibility verification

- 분석 버튼 클릭 직후 입력 카드가 사라지고 전체 작업영역 진행 화면이 표시됨
- 진행 영역 `role=status`, `aria-live=polite`, `aria-busy=true` 확인
- 중앙 문구의 `ai-execution-pulse` 애니메이션과 Lottie 상단 배치 확인
- Lottie canvas 생성 및 로컬 `.lottie` 로드 확인
- OpenAI 공급자 및 `gpt-4.1-mini` 모델 표시, 150% 확대 치수 확인
- 브라우저 page error: 0
- 전체 134개 테스트 파일 통과

## Comparison history

### Iteration 1

- Earlier finding: 원격 Lottie 요청이 첫 캡처보다 늦게 끝날 경우 진행 문구만 먼저 보이고 애니메이션 영역이 비어 보일 수 있었다.
- Fix made: 제공된 `.lottie` 원본을 프로젝트 정적 자산으로 포함하고 플레이어 소스를 로컬 경로로 변경했다.
- Post-fix evidence: `design-qa-implementation.png`에서 진행 상태 진입 직후 Lottie canvas와 실제 프레임이 표시되며, `design-qa-comparison.png`에서 기준/구현 중앙 그룹을 함께 확인했다.
- Remaining P0/P1/P2 findings: none.

### Iteration 2

- Earlier finding: 진행 문구가 Lottie 이미지 아래에 있었고, LLM 배지가 현재 요구 크기보다 작았다.
- Fix made: `AiExecutionIndicator`에 visual slot을 추가해 문구와 LLM 배지 사이에 Lottie를 배치하고, 진행 화면에 한정해 LLM 배지 전체 치수를 150% 확대했다.
- Post-fix evidence: `design-qa-implementation.png`에서 문구가 이미지 위에, 확대된 LLM 배지가 이미지 아래에 표시된다. 브라우저 좌표/계산 스타일 단언과 `design-qa-comparison.png`의 시각 비교가 모두 통과했다.
- Remaining P0/P1/P2 findings: none.

## Implementation checklist

- [x] 개요 분석 단계 전체 작업영역 전환
- [x] 구조 생성 단계와 동일 진행 화면 재사용
- [x] 제공 Lottie 원본의 로컬 정적 자산 적용
- [x] 중앙 문구 점멸 및 reduced-motion 처리
- [x] 수행 중인 LLM 공급자/모델 표시
- [x] 진행 문구를 Lottie 이미지 위로 재배치
- [x] 진행 화면 LLM 표기를 기존 대비 150% 확대
- [x] 브라우저·계약·전체 회귀 테스트

final result: passed

---

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
- Sidebar 최대/최소: 208px 전체 메뉴 ↔ 72px Lucide 아이콘 rail 전환 및 화면 간 상태 유지 확인
- 모바일: 최소 상태가 저장되어 있어도 208px 전체 Drawer와 메뉴 라벨 6개 표시

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
