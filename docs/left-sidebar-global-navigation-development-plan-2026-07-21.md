# 전역 상단 내비게이션 좌측 사이드바 이전 개발계획서

- 작성일: 2026-07-21
- 대상 프로젝트: `promo_web_builder`
- 상태: 개발 반영 및 로컬 QA 완료
- 기준 브랜치: `codex/source-cleanup-consolidation`
- 선행 문서: `docs/css-design-token-unification-development-plan-2026-07-21.md`
- 연계 문서:
  - `docs/source-code-cleanup-and-consolidation-development-plan-2026-07-21.md`
  - `docs/information-architecture-as-is-2026-07-21.md`
  - `docs/information-architecture-to-be-2026-07-21.md`
- 디자인 참고 이미지:
  - `/Users/hojunchoi/Downloads/91c89a2ae272deae667932f0a75f8a88.webp`
  - `/Users/hojunchoi/Downloads/ced3626bc567ad44f3cc0de96bc729e4.webp`

## 1. 계획 요약

현재 Promo Web Builder의 전역 내비게이션은 각 주요 화면의 상단 헤더 안에 가로로 표시된다. 이번 개발의 핵심은 이 전역 내비게이션을 왼쪽 고정 사이드바로 이동하는 것이다.

이번 계획은 전체 정보구조를 다시 설계하거나 화면 내부 패널을 재배치하는 계획이 아니다. 다음 원칙을 고정한다.

1. 현재 `shared-shell.js`의 전역 메뉴 항목, URL, 활성 상태 판정은 유지한다.
2. 상단 `.shell-nav`만 왼쪽 세로형 사이드바로 이동한다.
3. 브랜드 영역과 테마 전환도 사이드바에 배치한다.
4. 페이지 제목, 진행 상태, 페이지별 주요 동작은 오른쪽 작업 영역의 상단 유틸리티 바에 유지한다.
5. Admin 내부 탭, Create Promo 4단계 Stepper, Visual Editor 3열 편집 구조는 변경하지 않는다.
6. 프로모션 콘텐츠 렌더러와 `--promo-*` 토큰은 변경하지 않는다.
7. 기존 URL과 화면 진입 경로는 변경하지 않는다.

목표 구조는 다음과 같다.

```text
┌─────────────────────┬────────────────────────────────────────────┐
│ PROMO WEB BUILDER   │ 페이지 제목 / 상태 / 테마 외 페이지 액션 │
│                     ├────────────────────────────────────────────┤
│ 프로모션 빌더      │                                            │
│ 관리자 페이지      │                                            │
│ Promo Wizard        │              기존 페이지 콘텐츠           │
│ Create Promo        │                                            │
│ Visual Editor       │                                            │
│ 생성된 UI           │                                            │
│                     │                                            │
│ 테마 전환           │                                            │
└─────────────────────┴────────────────────────────────────────────┘
```

## 2. 선행 CSS 토큰 계획 검토 결과

`css-design-token-unification-development-plan-2026-07-21.md`는 작성 당시 소스 미반영 상태를 기준으로 작성됐다. 현재 저장소를 다시 확인한 결과, 해당 계획의 핵심 기반은 이미 상당 부분 반영됐다.

| 선행 계획 항목 | 현재 상태 | 이번 계획에서의 처리 |
|---|---|---|
| `prototype/design-tokens.css` 신규 작성 | 완료 | 기존 `--app-*` 토큰을 그대로 사용하고 사이드바 구조 토큰만 보강 |
| `prototype/app-shell.css` 신규 작성 | 완료 | 상단 헤더 중심 규칙을 App Frame/Sidebar/Utility Bar까지 확장 |
| `--app-*` 접두어 도입 | 완료 | 신규 Shell 토큰도 동일 접두어 사용 |
| light/dark 공통 테마 | 완료 | 사이드바도 두 테마에서 동일 계약 사용 |
| `shared-shell-header.css` 흡수 | 완료, 호환 import만 잔류 | 호환 파일은 유지하고 신규 규칙은 `app-shell.css`에만 작성 |
| 정적 화면 공통 내비 설정 | 완료 | `NAV_ITEMS`, `activeNavKey()` 재사용 |
| Visual Editor 공통 Shell 적용 | 부분 완료 | Vue 템플릿의 수동 상단 nav를 좌측 구조로 변경 |
| Layer A/Layer B 토큰 격리 | 완료 및 테스트 존재 | 좌측 nav는 Layer A만 사용하며 렌더러는 건드리지 않음 |

따라서 이번 개발은 토큰 통합을 다시 수행하는 작업이 아니다. 이미 만들어진 Layer A 토큰과 공통 Shell 위에서 전역 내비의 위치와 App Frame 구조만 변경한다.

## 3. 확정 범위

### 3.1 포함 범위

- 상단 전역 nav를 왼쪽 세로 nav로 이동
- 전역 브랜드 영역을 왼쪽 사이드바 상단으로 이동
- 테마 전환 버튼을 사이드바 하단으로 이동
- 페이지 상태와 화면별 액션을 오른쪽 유틸리티 바에 유지
- 활성 메뉴 표시와 `aria-current="page"` 유지
- 데스크톱 고정 사이드바와 좁은 화면용 Drawer 제공
- standalone/embedded/output mode별 Shell 노출 계약 유지
- 정적 화면과 Vue Visual Editor에서 동일한 메뉴 설정 사용
- 관련 계약 테스트와 브라우저 회귀 테스트 보강

### 3.2 화면별 적용 범위

| 화면 | 적용 여부 | 세부 원칙 |
|---|---|---|
| Promo Builder | 적용 | 기존 Builder 작업 레이아웃 유지 |
| 관리자 페이지 | 적용 | 관리자 탭과 템플릿 편집 그리드 유지 |
| Promo Wizard | 적용 | 기존 4단계 진행 UI 유지 |
| Create Promo | 적용 | Background/CTA/Template/Web Output Stepper 유지 |
| Visual Editor standalone | 적용 | 기존 Sections/Content/Preview 구조 유지 |
| Visual Editor admin-layout | 적용 | 현재 standalone Shell 노출 계약 유지 |
| Visual Editor wizard-layout iframe | 미노출 | iframe 내부에서 전역 nav 중복 금지 |
| Visual Editor output | 미노출 | 최종 Web Output에 편집기 Shell 삽입 금지 |
| 생성된 UI (`generated.html`) | 적용 | 전역 메뉴에서 진입한 뒤 되돌아갈 수 있도록 App Shell 적용 |

### 3.3 명시적 제외 범위

- Promo Builder와 Admin 통합
- Create Promo와 Promo Wizard 통합
- Admin 탭을 경로 세그먼트로 변경
- `/prototype/*` 경로 평탄화
- 화면별 2차 사이드바 신규 도입
- Visual Editor의 Content 패널을 오른쪽으로 재배치
- 관리자 템플릿 목록 및 Section Items 위치 변경
- Create Promo Step 순서나 콘텐츠 변경
- 신규 아이콘 라이브러리 도입
- 프로모션 콘텐츠 디자인 또는 Renderer 변경
- API, DB, 인증·인가 변경

`information-architecture-to-be-2026-07-21.md`의 장기 목표에는 좌측 글로벌 nav, 중앙 workspace, 우측 context panel이 함께 제안되어 있다. 이번 작업에서는 그중 좌측 글로벌 nav만 먼저 수행한다. 우측 context panel과 경로/기능 통합은 후속 계획으로 남긴다.

## 4. 현재 구현 구조

### 4.1 공통 메뉴 설정

`prototype/shared-shell.js`가 다음 전역 메뉴를 단일 배열로 관리한다.

```text
builder       → /prototype/index.html
admin         → /prototype/index.html?view=admin&tab=promo-form
promo-wizard  → /promo-wizard.html
create-promo  → /create-promo.html
visual-editor → /prototype/visual-editor.html
generated     → /prototype/generated.html
```

`activeNavKey()`는 pathname과 Admin query parameter를 사용해 활성 메뉴를 결정한다. 이 로직은 정상 동작하므로 위치 변경 과정에서 재작성하지 않는다.

### 4.2 현재 상단 Shell

현재 `app-shell.css`의 `.shell-header`는 다음 역할을 동시에 담당한다.

- 브랜드/페이지명
- 전역 nav
- 테마 전환
- 페이지 상태

이 구조 때문에 가로 공간이 부족하면 nav가 여러 줄로 접히고, `1080px` 이하에서는 헤더 전체가 세로로 쌓인다. Create Promo와 Visual Editor에서는 상단 헤더 아래에 Stepper 또는 Editor Toolbar가 추가되어 세로 작업 공간도 줄어든다.

### 4.3 페이지별 차이

- `prototype/index.html`: Vue가 테마와 상태를 직접 관리하고, nav만 `data-shell-nav`로 채운다.
- `prototype/create-promo.html`: 정적 Shell DOM과 `data-shell-nav`를 사용한다.
- `prototype/promo-wizard.html`: Create Promo와 유사한 정적 Shell DOM을 사용한다.
- `visual-editor/src/App.vue`: `window.PromoShell.navItems`를 읽지만 nav 마크업은 Vue에서 직접 반복 렌더링한다.
- `prototype/generated.html`: 현재 공통 nav가 없고 관리 화면 복귀 링크만 있다.

위 차이를 인정하고, 전체 페이지를 한 번에 동일 기술 스택으로 바꾸지 않는다. 메뉴 데이터와 시각 계약은 공유하되 정적 DOM과 Vue 렌더링 방식은 각각 유지한다.

## 5. 목표 DOM 및 CSS 계약

### 5.1 공통 App Frame

권장 공통 구조는 다음과 같다.

```html
<div class="shell-frame" data-shell-frame>
  <aside class="shell-sidebar" data-shell-sidebar>
    <div class="shell-sidebar__brand">...</div>
    <nav class="shell-nav shell-nav--vertical" data-shell-nav>...</nav>
    <div class="shell-sidebar__footer">
      <button data-shell-theme-toggle>...</button>
    </div>
  </aside>

  <div class="shell-main">
    <header class="shell-utility-bar">
      <div class="shell-page-identity">...</div>
      <div class="shell-page-actions">...</div>
    </header>
    <div class="shell-content">
      <!-- 기존 화면 콘텐츠 -->
    </div>
  </div>
</div>
```

클래스 명칭은 구현 단계에서 기존 호환성을 고려해 조정할 수 있지만, 책임 분리는 유지한다.

### 5.2 토큰 추가안

구조 관련 값도 기존 Layer A 단일 출처 원칙에 따라 `prototype/design-tokens.css`에 정의한다.

```css
--app-sidebar-width: 208px;
--app-sidebar-width-compact: 176px;
--app-utility-height: 60px;
--app-nav-item-height: 44px;
--app-shell-z-sidebar: 40;
--app-shell-z-overlay: 50;
```

색상, 선, 글꼴, 그림자는 기존 값을 재사용한다.

```css
background: var(--app-panel);
color: var(--app-ink);
border-color: var(--app-line);
box-shadow: var(--app-shadow);
```

### 5.3 데스크톱 동작

- `1440px` 이상: `208px` 고정 사이드바
- `1024px` 이상 `1439px` 이하: `176px` compact 사이드바
- 사이드바는 `100dvh` 높이를 사용한다.
- 사이드바 자체는 고정되고, 오른쪽 `.shell-main`만 페이지 콘텐츠를 스크롤한다.
- 현재 nav 링크는 세로로 정렬한다.
- 활성 메뉴는 배경색, 텍스트 굵기, 왼쪽 강조선으로 구분한다.
- 페이지별 상태 문구는 사이드바에 넣지 않고 오른쪽 유틸리티 바에 유지한다.

### 5.4 태블릿 및 모바일 동작

`1024px` 미만에서는 콘텐츠 폭을 보호하기 위해 사이드바를 화면 밖 Drawer로 전환한다.

- 유틸리티 바 왼쪽에 메뉴 열기 버튼 제공
- Drawer 열림 상태에서 배경 overlay 표시
- `Escape`로 닫기
- overlay 클릭으로 닫기
- 열린 동안 배경 스크롤 잠금
- 현재 메뉴 이동 또는 닫기 버튼 선택 시 Drawer 닫기
- 포커스를 Drawer 안으로 이동하고 닫을 때 호출 버튼으로 복귀

초기 작업에서는 72px 아이콘 전용 rail을 만들지 않는다. 현재 저장소에 공통 아이콘 체계가 없고, 텍스트 nav를 왼쪽으로 옮기는 것이 이번 요구의 핵심이기 때문이다. 아이콘 기반 collapsed rail은 별도 디자인·접근성 검토 후 후속 단계로 다룬다.

## 6. 파일별 변경 계획

### 6.1 `prototype/design-tokens.css`

1. Sidebar/Utility Bar 구조 토큰을 light 공통 영역에 추가한다.
2. dark mode는 색상 토큰만 재정의하고 폭/높이 토큰은 공유한다.
3. `--promo-*` 토큰은 추가하거나 참조하지 않는다.

### 6.2 `prototype/app-shell.css`

1. 신규 `.shell-frame`, `.shell-sidebar`, `.shell-main`, `.shell-utility-bar`, `.shell-content` 규칙을 추가한다.
2. `.shell-nav--vertical`의 링크 크기, 정렬, hover, active, focus-visible 상태를 정의한다.
3. 기존 `.shell-header`는 마이그레이션 기간에 유틸리티 바 호환 alias로 유지한다.
4. 기존 `1080px`, `680px` 헤더 적층 규칙은 Drawer breakpoint 기반 규칙으로 교체한다.
5. `prefers-reduced-motion: reduce`에서 Drawer transition을 제거한다.
6. Layer A 전용 주석과 `--app-*` 토큰 경계를 유지한다.

### 6.3 `prototype/shared-shell.js`

1. 기존 `NAV_ITEMS`와 `activeNavKey()`를 유지한다.
2. `renderNavigation()`이 가로/세로 위치와 무관하게 동작하도록 유지한다.
3. Drawer 열기/닫기 상태 관리 함수를 추가한다.
4. 동일 페이지에서 중복 event listener가 연결되지 않도록 dataset guard를 사용한다.
5. `aria-expanded`, `aria-controls`, overlay, Escape, focus return을 처리한다.
6. 필요하면 sidebar 상태 key를 추가하되 theme storage key와 분리한다.

권장 공개 계약:

```text
PromoShell.init(root)
PromoShell.renderNavigation(root)
PromoShell.openSidebar(root)
PromoShell.closeSidebar(root)
PromoShell.activeNavKey(location)
PromoShell.navItems
```

### 6.4 `prototype/index.html` / `prototype/styles.css`

1. `#app` 내부를 `.shell-frame`으로 감싼다.
2. 현재 상단 헤더의 브랜드와 nav를 왼쪽 sidebar로 이동한다.
3. handoff 문서 선택, 테마 상태, 작업 상태 중 페이지 액션은 utility bar에 재배치한다.
4. Builder의 `abc-layout`, Admin 탭, `form-template-admin-grid`는 구조 변경하지 않는다.
5. 기존 Vue `toggleThemeMode()`와 `PromoShell` 테마 이벤트 중복을 제거하거나 한쪽으로 위임한다.
6. Builder/Admin query 기반 활성 nav가 유지되는지 확인한다.

### 6.5 `prototype/create-promo.html` / `prototype/create-promo.css`

1. 전역 브랜드/nav/theme을 sidebar로 이동한다.
2. `Step 1 / 4` 상태는 utility bar에 유지한다.
3. `.wizard-progress`, `.wizard-panel`, `.wizard-footer`의 순서와 동작은 유지한다.
4. 현재 `wizard-shell`의 max-width/margin이 `.shell-main` 내부에서 이중 여백을 만들지 않도록 조정한다.
5. Live Preview 및 Step 3 iframe 폭이 sidebar 추가로 과도하게 줄지 않는지 확인한다.

### 6.6 `prototype/promo-wizard.html` / `prototype/promo-wizard.css`

1. Create Promo와 동일한 Shell 골격을 적용한다.
2. 기존 Promo Wizard 4단계와 생성 흐름은 수정하지 않는다.
3. `wizard-shell-status` 업데이트 계약을 유지한다.
4. Create Promo와 동일한 breakpoint 동작을 사용한다.

### 6.7 `visual-editor/src/App.vue` / `visual-editor/src/styles.css`

1. `!isWizardLayoutMode` 조건에서 렌더링되는 상단 글로벌 header를 sidebar + utility bar로 변경한다.
2. `shellNavItems = window.PromoShell?.navItems || []` 계약은 유지한다.
3. Visual Editor standalone에서는 `visual-editor` 메뉴를 활성화한다.
4. `admin-layout` mode에서도 현재처럼 Shell을 표시하되 페이지 라벨과 revision 상태를 유지한다.
5. `wizard-layout` mode에서는 sidebar와 utility bar를 모두 렌더링하지 않는다.
6. `output` mode에서는 기존 output toolbar만 유지하고 전역 sidebar를 렌더링하지 않는다.
7. `.editor-workspace`의 3열 너비는 변경하지 않고 `.shell-main` 가용 폭에만 반응하게 한다.
8. Visual Editor 빌드 산출물은 직접 수정하지 않고 빌드 명령으로 갱신한다.

### 6.8 `prototype/generated.html`

1. `design-tokens.css`, `app-shell.css`, `shared-shell.js`를 모두 로드한다.
2. 생성 결과 viewer를 `.shell-main` 안에 배치한다.
3. 기존 “관리 화면으로 돌아가기” 링크는 중복 여부를 검토해 제거하거나 보조 액션으로 낮춘다.
4. 프로모션 결과 영역의 콘텐츠 토큰과 스타일은 변경하지 않는다.

`prototype/visual-output.html`은 최종 산출물 전용이므로 이 작업 대상이 아니다.

### 6.9 테스트 파일

수정 대상:

- `scripts/test-shared-shell-header-contract.js`
- `scripts/test-app-design-tokens-contract.js`
- `scripts/test-create-promo-clone-contract.js`
- `scripts/test-visual-editor-contract.js`

필요하면 `scripts/test-left-sidebar-shell-contract.js`를 추가한다.

기존 테스트 파일명이 `header`를 포함하더라도 즉시 rename하지 않는다. 테스트 내용부터 새 App Shell 계약으로 변경하고 파일명 정리는 별도 기계적 작업으로 분리한다.

## 7. 단계별 개발 순서

### Phase 0 — 기준선 및 계약 테스트

1. 현재 전체 테스트와 Visual Editor 빌드 기준선을 기록한다.
2. 다음 실패 테스트를 먼저 추가한다.
   - 공통 sidebar 클래스 존재
   - 모든 대상 화면에 sidebar/nav mount point 존재
   - 상단 utility bar 내부에 전역 nav가 존재하지 않음
   - 활성 메뉴와 `aria-current` 유지
   - Visual Editor wizard-layout/output mode에서 sidebar 미노출
   - `generated.html`에서 공통 nav 접근 가능
3. 기존 top header 마크업을 강제하는 assertion을 새 계약으로 수정한다.

완료 기준: 구현 전 새 테스트가 의도한 이유로 실패하고 기존 기능 테스트는 통과한다.

### Phase 1 — 공통 토큰과 Shell CSS

1. 구조 토큰을 `design-tokens.css`에 추가한다.
2. `app-shell.css`에 App Frame과 Sidebar 규칙을 구현한다.
3. 기존 header 규칙과의 호환 계층을 유지한다.
4. light/dark, hover, active, focus-visible, reduced-motion 상태를 구현한다.

완료 기준: 임시 fixture에서 데스크톱 sidebar와 모바일 Drawer가 동작하고 Layer A 토큰만 사용한다.

### Phase 2 — 정적 Shell 동작

1. `shared-shell.js`에 Drawer 접근성 동작을 추가한다.
2. Promo Builder/Admin에 적용한다.
3. Create Promo에 적용한다.
4. Promo Wizard에 적용한다.
5. 생성된 UI에 적용한다.

각 화면 적용 후 바로 계약 테스트와 해당 화면 smoke test를 실행한다. 여러 화면을 한 번에 수정한 뒤 검증하지 않는다.

완료 기준: 정적 대상 화면에서 nav가 왼쪽에만 존재하고 링크/활성 상태/테마가 정상 동작한다.

### Phase 3 — Visual Editor 적용

1. `App.vue`의 상단 글로벌 header를 App Frame 구조로 변경한다.
2. standalone/admin-layout/wizard-layout/output 네 mode를 각각 검증한다.
3. Visual Editor 프로덕션 번들을 재빌드한다.
4. Admin의 “레이아웃 편집 열기”와 Create Promo Step 3 iframe을 회귀 검증한다.

완료 기준: standalone/admin-layout에만 sidebar가 표시되고 embedded/output에는 표시되지 않는다.

### Phase 4 — 반응형 및 브라우저 QA

검증 viewport:

- 1440px 데스크톱
- 1280px 노트북
- 1024px 경계
- 768px 태블릿
- 390px 모바일

확인 항목:

- Sidebar와 utility bar 겹침 없음
- Admin 편집 그리드 수평 overflow 없음
- Create Promo Preview 최소 폭 유지
- Visual Editor Preview 조작 가능
- Drawer 열기/닫기와 키보드 포커스 정상
- light/dark 전환 후 sidebar 대비 정상
- 활성 nav가 각 URL에서 정확함

## 8. 접근성 요구사항

1. sidebar에는 `aria-label="전역 내비게이션"`을 제공한다.
2. 현재 메뉴는 시각적 강조와 `aria-current="page"`를 함께 사용한다.
3. 메뉴 항목 높이는 최소 44px로 한다.
4. Drawer 버튼은 `aria-expanded`와 `aria-controls`를 갱신한다.
5. Drawer가 열리면 첫 번째 유효한 컨트롤로 포커스를 이동한다.
6. Drawer가 닫히면 메뉴 열기 버튼으로 포커스를 되돌린다.
7. `Escape`와 overlay 클릭으로 닫을 수 있어야 한다.
8. active 상태를 색상 하나만으로 표현하지 않는다.
9. focus-visible outline은 `--app-focus` 토큰을 사용한다.
10. 모션 감소 설정에서는 Drawer animation을 제거한다.

## 9. 자동 검증 계획

### 9.1 정적 계약 테스트

- `NAV_ITEMS`가 한 곳에만 정의되는지 확인
- 모든 전역 nav 링크가 `NAV_ITEMS`에서 생성되는지 확인
- utility bar 내부에 `.shell-nav`가 남지 않는지 확인
- sidebar가 Layer A `--app-*` 토큰만 참조하는지 확인
- `.promo-renderer`가 sidebar/App Shell 선택자나 토큰을 참조하지 않는지 확인
- Visual Editor mode 분기 계약 확인

### 9.2 명령 기준

```bash
pnpm test
pnpm run check
pnpm run build:visual-editor
```

브라우저 의존 테스트를 포함하므로 새 환경에서는 먼저 lockfile 기준 의존성을 설치하고 Playwright Chromium 준비 여부를 확인한다.

### 9.3 브라우저 회귀 시나리오

1. Promo Builder 진입 → Builder 활성 메뉴 확인
2. 관리자 페이지 이동 → Admin 활성 메뉴와 기존 탭 유지 확인
3. Promo Wizard 이동 → 단계 상태와 이전 입력 유지 확인
4. Create Promo 이동 → Background/CTA 선택 상태 유지 확인
5. Visual Editor 이동 → template 로드와 3열 editor 유지 확인
6. 생성된 UI 이동 → sidebar를 통해 다시 다른 화면으로 이동 가능 확인
7. Create Promo Step 3 embedded editor → sidebar 미노출 확인
8. Visual Output → 편집기 sidebar 미노출 확인
9. 모바일 Drawer를 키보드로 열고 닫은 뒤 포커스 복귀 확인

## 10. 리스크 및 완화책

### 10.1 Visual Editor 가로 공간 축소

위험: 기존 3열 Editor에 sidebar 폭이 추가되면 Preview가 지나치게 좁아질 수 있다.

완화:

- 1024px 미만에서 sidebar를 Drawer로 전환
- 1024~1439px compact 폭 사용
- Editor 내부 column 수나 기능을 이번 작업에서 변경하지 않음
- 1280px 실화면 검증을 필수화

### 10.2 정적 DOM과 Vue Shell 불일치

위험: 정적 화면은 `data-shell-nav`, Visual Editor는 Vue 반복 렌더링을 사용한다.

완화:

- `NAV_ITEMS`와 active 판정은 `PromoShell`만 소유
- 마크업 구현이 달라도 CSS class와 접근성 계약은 동일하게 유지
- 두 렌더러를 동일 계약 테스트에 포함

### 10.3 Theme 상태 이중 관리

위험: `index.html/app.js`의 Vue theme toggle과 `shared-shell.js`의 theme toggle이 동시에 동작한다.

완화:

- 저장 key는 `promoPrototype.themeMode` 하나만 사용
- theme 변경 시 `promo-shell-theme-change` 이벤트를 단일 동기화 경로로 사용
- 페이지별로 중복 click handler가 연결되지 않는지 검사

### 10.4 embedded mode Shell 중복

위험: Create Promo Step 3 iframe 안에 좌측 sidebar가 다시 표시될 수 있다.

완화:

- `isWizardLayoutMode`에서 App Shell 전체 미렌더링
- browser integration test에 sidebar 개수 assertion 추가

### 10.5 생성된 UI 콘텐츠 오염

위험: Layer A sidebar 스타일이 프로모션 결과 콘텐츠에 상속될 수 있다.

완화:

- App Shell과 콘텐츠 DOM 경계를 분리
- 기존 콘텐츠 토큰을 유지
- Layer A/Layer B 교차 참조 정적 검사를 계속 실행

## 11. 커밋 및 롤백 전략

권장 커밋 단위:

1. `test: define left sidebar shell contract`
2. `style: add sidebar layout tokens and frame styles`
3. `feat: move builder and admin navigation to sidebar`
4. `feat: move wizard navigation to sidebar`
5. `feat: move create promo navigation to sidebar`
6. `feat: move visual editor navigation to sidebar`
7. `feat: add app shell to generated UI`
8. `test: verify responsive sidebar and embedded modes`

롤백 원칙:

- 각 화면 변경은 독립 커밋으로 유지한다.
- 특정 화면 회귀 시 해당 화면 DOM/CSS만 기존 `.shell-header` 구조로 되돌린다.
- `NAV_ITEMS`, 테마 저장 key, 콘텐츠 토큰은 롤백 중에도 변경하지 않는다.
- Visual Editor 문제 시 Vue 소스와 빌드 산출물을 동일 커밋 단위로 되돌린다.

## 12. Definition of Done

다음 조건을 모두 만족해야 완료로 판단한다.

1. 전역 nav가 대상 화면의 상단에 더 이상 표시되지 않는다.
2. 전역 nav가 왼쪽 sidebar에 세로로 표시된다.
3. 메뉴 라벨, URL, 순서가 기존 `NAV_ITEMS`와 동일하다.
4. 현재 화면에 맞는 활성 메뉴와 `aria-current="page"`가 정확하다.
5. Promo Builder/Admin 내부 레이아웃이 기존 기능을 유지한다.
6. Promo Wizard와 Create Promo의 단계·입력·Preview 기능이 유지된다.
7. Visual Editor standalone/admin-layout에서 sidebar가 정상 표시된다.
8. Visual Editor wizard-layout/output에서 sidebar가 표시되지 않는다.
9. `generated.html`에서 전역 nav를 통해 다른 화면으로 이동할 수 있다.
10. 1024px 미만에서 sidebar가 접근 가능한 Drawer로 전환된다.
11. light/dark 모드에서 텍스트와 active/focus 상태를 식별할 수 있다.
12. `.promo-renderer`와 `--promo-*` 콘텐츠 토큰 격리가 유지된다.
13. 자동 테스트, 문법 검사, Visual Editor 빌드가 통과한다.
14. 1440/1280/1024/768/390 viewport 브라우저 검증이 완료된다.
15. 구현 결과, 테스트 결과, 잔여 이슈가 당일 handoff 문서에 기록된다.

## 13. 개발 착수 체크리스트

- [x] `.DS_Store` 등 사용자 소유 변경을 작업 범위에서 제외
- [x] 현재 전체 테스트 기준선 확인
- [x] Playwright 설치 상태 확인 — 로컬 패키지 누락 확인, 앱 내 브라우저로 대체 검증
- [x] App Shell 계약 테스트 갱신
- [x] Layer A/Layer B 토큰 경계 재확인
- [x] 정적 화면부터 순차 적용
- [x] Visual Editor mode별 적용
- [x] Visual Editor 번들 재빌드
- [x] viewport별 브라우저 검증
- [x] Handoff 갱신

## 14. 다음 작업자용 핵심 지시

이 계획을 구현하는 개발자는 다음 문장을 최우선 범위 규칙으로 사용한다.

> 현재 상단에 있는 전역 nav를 왼쪽으로 이동한다. 화면 내부의 탭, Stepper, Section/Content/Preview 구조는 이번 작업에서 재설계하지 않는다.

구현 중 화면 내부 구조까지 변경해야 할 필요가 보이더라도 임의로 범위를 넓히지 않는다. 가로 폭 회귀는 breakpoint와 Drawer로 해결하고, 화면별 기능 재배치는 별도 계획으로 분리한다.

## 15. 구현 완료 결과

2026-07-21에 본 계획을 소스에 반영했다.

### 반영 내용

- `design-tokens.css`: 208px/176px sidebar, 60px utility bar, 44px nav 및 z-index 토큰 추가
- `app-shell.css`: desktop/compact/mobile App Frame, vertical nav, sticky utility bar, Drawer, overlay, reduced-motion 구현
- `shared-shell.js`: Drawer open/close, Escape, overlay, scroll lock, focus 이동/복귀 구현
- Builder/Admin, Promo Wizard, Create Promo, Generated UI에 공통 Shell 적용
- Visual Editor standalone/admin-layout에 Shell 적용
- Visual Editor wizard-layout/output은 Shell 미노출 유지
- Visual Editor 배포 번들 재빌드
- 기존 header 계약 테스트를 sidebar App Shell 계약으로 갱신

### 검증 결과

- JavaScript 계약 테스트 27개와 ESM 동작 테스트 2개 통과
- Visual Editor 프로덕션 빌드 통과
- 별도 Playwright 2개 테스트는 로컬 `playwright` 패키지 미설치로 실행하지 못함
- 앱 내 브라우저로 1440/1280/1024/768/390px 검증 완료
- Drawer의 `aria-expanded`, body scroll lock, Escape, focus return 확인
- 디버깅에서 닫힌 Drawer의 접근성 트리 노출을 수정하고 계약 테스트에 재발 방지 항목 추가
- Builder/Admin/Create Promo/Visual Editor/Generated UI 활성 nav 확인
- Visual Editor embedded/output mode sidebar 미노출 확인
- 시각 QA 결과: `design-qa.md`, 최종 판정 `passed`

### 잔여 내용

- 배포 환경 반영 후 Vercel URL에서 동일 breakpoint smoke test
- 로컬 의존성을 lockfile 기준으로 복구한 뒤 Playwright 통합 테스트 2개 재실행
- 아이콘 기반 collapsed rail은 별도 디자인 범위로 유지
