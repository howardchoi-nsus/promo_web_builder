# CSS 공통 컴포넌트 아키텍처 및 페이지 스타일 분리 개발계획서

- 작성일: 2026-07-22
- 대상 프로젝트: `promo_web_builder`
- 기준 브랜치: `codex/source-cleanup-consolidation`
- 기준 커밋: `88f4645 css 수정`
- 문서 상태: 구현 전 개발계획 / 소스코드 미반영
- 선행 문서: `docs/css-design-token-unification-development-plan-2026-07-21.md`
- 관련 문서: `docs/source-code-cleanup-and-consolidation-development-plan-2026-07-21.md`
- 적용 대상: Promo Builder, 관리자 페이지, Create Promo, Promo Wizard, Visual Editor, Generated UI, Web Output
- 공식 공통 컴포넌트 파일명: `app-components.css`

## 0. 문서 목적

이 문서는 현재 관리자 페이지의 UI 디자인을 앱 공통 기준으로 삼아 CSS 책임을 재구성하기 위한 실행 계획이다. 다른 LLM 또는 개발자가 이전 대화 내용을 보지 않아도 다음 사항을 판단하고 구현할 수 있도록 작성한다.

1. 어떤 CSS를 공통 파일로 이동해야 하는가.
2. 어떤 CSS는 페이지 전용으로 유지해야 하는가.
3. 색상·간격·폰트 등의 하드코딩 값을 어떤 기준으로 제거해야 하는가.
4. Create Promo와 Visual Editor에서 렌더링하는 프로모션 템플릿 CSS를 앱 UI CSS와 어떻게 격리해야 하는가.
5. 기존 화면을 깨뜨리지 않고 어떤 순서로 마이그레이션해야 하는가.
6. 각 단계에서 어떤 테스트를 통과해야 완료로 판단하는가.

이 문서는 기존 토큰 통일 계획을 폐기하지 않는다. 기존 문서가 정의한 Layer A 앱 UI 토큰과 Layer B 프로모션 콘텐츠 토큰의 분리를 유지하면서, 공통 컴포넌트 계층과 페이지별 CSS 분리 방법을 구체화한다.

## 1. 최종 결정 요약

### 1.1 채택하는 방향

- 관리자 페이지의 시각 체계를 앱 UI의 기준 디자인으로 채택한다.
- 관리자 `styles.css` 파일 자체를 다른 페이지에 그대로 로드하지 않는다.
- 관리자 CSS에서 재사용 가능한 UI를 `app-components.css`로 추출한다.
- 모든 앱 UI 디자인 값의 단일 출처는 `design-tokens.css`의 `--app-*` 변수로 제한한다.
- 각 페이지 CSS에서는 자체 `:root` 색상·간격 alias를 만들지 않고 `--app-*`를 직접 참조한다.
- Create Promo 및 Visual Editor에서 생성·적용하는 프로모션 템플릿 CSS는 `--promo-*`, `--item-*` 네임스페이스로 별도 유지한다.
- 앱 UI CSS와 프로모션 템플릿 CSS는 선택자, 변수, 저장 경로, 검증 경로를 모두 분리한다.
- Visual Editor 빌드 산출물은 직접 수정하지 않고 `visual-editor/src/` 수정 후 Vite 빌드로 갱신한다.

### 1.2 채택하지 않는 방향

- 관리자 `styles.css` 전체를 모든 화면에 연결하지 않는다.
- 모든 CSS를 물리적으로 하나의 파일로 합치지 않는다.
- `display`, `grid-template-columns`, `overflow` 같은 구조 값까지 무조건 토큰으로 만들지 않는다.
- AI가 반환한 자유 형식 CSS를 검증 없이 `<style>`에 삽입하지 않는다.
- `.promo-renderer` 하위에 `--app-*` 변수를 사용하지 않는다.
- 앱 Sidebar, Panel, Modal 등이 `--promo-*`를 참조하지 않는다.

## 2. 용어와 강제 수준

이 문서에서 다음 용어를 사용한다.

- **MUST**: 구현 시 반드시 지켜야 한다.
- **MUST NOT**: 구현 시 절대 허용하지 않는다.
- **SHOULD**: 특별한 이유가 없으면 따라야 한다.
- **MAY**: 필요에 따라 선택할 수 있다.
- **Layer A**: 관리자, Builder, Wizard, Create Promo, Visual Editor의 제작 도구 UI.
- **Layer B**: 실제 프로모션 템플릿과 Web Output에 표시되는 콘텐츠 UI.
- **디자인 하드코딩**: 색상, 글자 크기, 간격, radius, shadow, 공통 높이처럼 디자인 시스템이 통제해야 하는 리터럴 값.
- **구조 값**: `display: grid`, `width: 100%`, `overflow: auto`처럼 레이아웃 동작을 정의하는 값.
- **인스턴스 값**: 특정 프로모션의 `designSpec`에 따라 런타임에 생성되는 색상, 너비, 글꼴, 이미지 위치 등의 값.

## 3. 현재 상태 기준선

2026-07-22 기준 주요 CSS 현황은 다음과 같다.

| 파일 | 줄 수 | 크기 | 현재 책임 |
|---|---:|---:|---|
| `prototype/design-tokens.css` | 61 | 1.9 KB | 앱 공통 light/dark 토큰 |
| `prototype/app-shell.css` | 521 | 13.2 KB | Sidebar, Utility Bar, Drawer, Shell |
| `prototype/styles.css` | 3,575 | 67.9 KB | Builder, 관리자, 공통 컴포넌트, Generated UI 혼재 |
| `prototype/create-promo.css` | 1,737 | 33.3 KB | Create Promo 전체 스타일 및 로컬 alias |
| `prototype/promo-wizard.css` | 1,222 | 22.6 KB | Promo Wizard 전체 스타일 및 로컬 alias |
| `visual-editor/src/styles.css` | 227 | 17.6 KB | Visual Editor 앱 UI와 `.promo-renderer` 혼재 |

### 3.1 현재 로드 순서

```text
관리자 / Promo Builder
design-tokens.css
→ app-shell.css
→ styles.css

Create Promo
design-tokens.css
→ app-shell.css
→ create-promo.css

Promo Wizard
design-tokens.css
→ app-shell.css
→ promo-wizard.css

Visual Editor
design-tokens.css
→ app-shell.css
→ visual-editor-assets/visual-editor.css

Web Output
design-tokens.css
→ visual-editor-assets/visual-editor.css
```

### 3.2 확인된 문제

1. `styles.css` 하나에 공통 UI와 페이지 전용 UI가 혼재한다.
2. Create Promo와 Promo Wizard가 버튼, Panel, Form, Wizard 스타일을 각각 중복 정의한다.
3. 각 페이지 CSS에 `:root` compatibility alias가 반복된다.
4. `styles.css`의 `.panel`, `.field`, `.workspace`처럼 일반적인 클래스가 페이지마다 다른 의미로 사용될 가능성이 있다.
5. 구형 Topbar 및 Generated Toolbar 선택자가 남아 있다.
6. 사용되지 않는 것으로 보이는 구형 디자인 콘셉트·Draft UI 스타일이 남아 있다.
7. `--mono`가 정의되지 않았지만 `var(--mono)`가 사용된다.
8. 일부 색상과 배경 gradient가 hex/rgba 리터럴로 남아 있다.
9. 반응형 breakpoint가 640, 680, 720, 760, 920, 980, 1023, 1080, 1180px 등으로 분산되어 있다.
10. Visual Editor 앱 UI와 프로모션 렌더러 규칙이 같은 파일에 있어 경계 검증이 어렵다.
11. 기존 테스트는 토큰 존재 여부와 정적 문자열 검사에 치우쳐 있으며 CSS 동작 회귀를 완전히 보장하지 못한다.

## 4. 목표 아키텍처

### 4.1 Layer A 앱 UI 로드 구조

```text
design-tokens.css
        ↓
app-shell.css
        ↓
app-components.css
        ↓
페이지 전용 CSS
```

각 계층의 책임은 다음과 같다.

| 계층 | 파일 | 책임 |
|---|---|---|
| Tokens | `design-tokens.css` | 색상, 타이포그래피, 간격, radius, shadow, 공통 크기, motion, z-index |
| Shell | `app-shell.css` | Sidebar, Utility Bar, Drawer, Shell Frame, Shell Content |
| Components | `app-components.css` | Button, Panel, Field, Form, Tab, Status, Modal, Table, Empty/Loading/Error |
| Page | 페이지별 CSS | 해당 화면에서만 사용하는 배치와 기능 UI |

### 4.2 Layer B 프로모션 템플릿 구조

```text
PromoPageRenderer static structure
        +
designSpec 기반 런타임 인스턴스 값
        +
검증된 section/item layout patch
        ↓
.promo-renderer 범위 안에서만 적용
```

Layer B는 다음 변수만 사용한다.

```text
--promo-*
--item-*
--section-*   필요 시 추가
```

Layer B는 Layer A와 별도의 디자인 시스템이다. 프로모션 색상과 폰트가 앱 관리자 UI의 테마에 영향을 받아서는 안 된다.

### 4.3 최종 파일 구조

```text
prototype/
├── design-tokens.css
├── app-shell.css
├── app-components.css
├── builder.css
├── admin.css
├── create-promo.css
├── promo-wizard.css
├── generated.css
├── shared-shell-header.css       # 전환기 compatibility import 후 제거 검토
├── index.html
├── create-promo.html
├── promo-wizard.html
└── generated.html

visual-editor/src/
├── styles.css                    # Visual Editor Layer A 전용
├── promo-renderer.css            # Layer B 정적 렌더링 규칙
├── App.vue
├── PromoPageRenderer.vue
└── main.js
```

`index.html`은 단일 Vue 앱 안에서 Builder와 관리자 화면을 전환하므로 `builder.css`와 `admin.css`를 모두 로드해도 된다. 두 파일은 네임스페이스를 분명히 하고 서로의 선택자를 재정의하지 않아야 한다.

## 5. 목표 페이지별 로드 순서

### 5.1 관리자 / Promo Builder

```html
<link rel="stylesheet" href="/prototype/design-tokens.css" />
<link rel="stylesheet" href="/prototype/app-shell.css" />
<link rel="stylesheet" href="/prototype/app-components.css" />
<link rel="stylesheet" href="/prototype/builder.css" />
<link rel="stylesheet" href="/prototype/admin.css" />
```

### 5.2 Create Promo

```html
<link rel="stylesheet" href="design-tokens.css" />
<link rel="stylesheet" href="app-shell.css" />
<link rel="stylesheet" href="app-components.css" />
<link rel="stylesheet" href="create-promo.css" />
```

### 5.3 Promo Wizard

```html
<link rel="stylesheet" href="design-tokens.css" />
<link rel="stylesheet" href="app-shell.css" />
<link rel="stylesheet" href="app-components.css" />
<link rel="stylesheet" href="promo-wizard.css" />
```

### 5.4 Visual Editor

```html
<link rel="stylesheet" href="/prototype/design-tokens.css" />
<link rel="stylesheet" href="/prototype/app-shell.css" />
<link rel="stylesheet" href="/prototype/app-components.css" />
<link rel="stylesheet" href="/prototype/visual-editor-assets/visual-editor.css" />
```

Vite 번들 내부에서는 다음 순서를 유지한다.

```js
import "./styles.css";
import "./promo-renderer.css";
```

### 5.5 Web Output

Web Output은 앱 Sidebar와 관리자 컴포넌트가 필요하지 않다. 최종적으로 다음만 로드하는 것을 목표로 한다.

```text
promo-renderer.css
+ designSpec 런타임 값
```

전환기에는 기존 Visual Editor 번들을 사용할 수 있으나, 출력 모드에서 Layer A 규칙이 결과물에 영향을 주지 않는지 테스트해야 한다.

## 6. design-tokens.css 정책

### 6.1 단일 출처 원칙

- 앱 UI 디자인 값은 `design-tokens.css`에서만 정의해야 한다.
- 페이지별 CSS는 `:root`에서 `--bg`, `--panel`, `--accent` 같은 alias를 새로 만들지 않는다.
- 새 컴포넌트는 `--app-*`를 직접 참조해야 한다.
- 기존 alias는 한 번에 제거하지 않고 화면 단위 전환 후 삭제한다.

### 6.2 필수 토큰 보완안

현재 토큰에 다음 항목을 추가 검토한다.

```css
--app-font-mono
--app-content-max-width
--app-content-padding
--app-button-height
--app-button-height-small
--app-motion-fast
--app-motion-normal
--app-overlay
--app-danger-ink
--app-danger-line
--app-warning
--app-warning-soft
```

실제 사용처가 없는 토큰을 미리 대량 추가하지 않는다. 최소 두 개 이상의 화면 또는 공통 컴포넌트에서 사용하는 값만 공통 토큰으로 승격한다.

### 6.3 Light/Dark 규칙

- 구조 토큰은 `:root`에 한 번만 정의한다.
- 색상 토큰만 `[data-theme="dark"]`에서 재정의한다.
- 페이지별 CSS에 Dark 전용 hex 값을 직접 작성하지 않는다.
- Dark 전용 차이가 필요한 경우 의미 기반 토큰을 추가한다.

## 7. 하드코딩 금지 정책

### 7.1 금지 대상

Layer A 페이지 CSS와 공통 컴포넌트 CSS에서 다음 리터럴은 원칙적으로 금지한다.

- hex 색상: `#ffffff`, `#ef4444`
- `rgb()`, `rgba()`, `hsl()` 색상
- 반복되는 공통 spacing 리터럴
- 반복되는 font-size 및 font-weight
- 반복되는 border-radius
- 반복되는 shadow
- 공통 컨트롤 높이
- 공통 transition duration
- 공통 z-index

예외가 필요하면 코드 주석으로 이유를 기록하고 하드코딩 검사 allowlist에 파일/라인 목적을 명시해야 한다.

### 7.2 허용 대상

다음 구조 값은 CSS에 직접 작성할 수 있다.

```text
0
100%
auto
1fr
minmax(0, 1fr)
display: grid/flex/block
position: relative/absolute/sticky/fixed
overflow: auto/hidden/visible
text-overflow: ellipsis
object-fit: cover/contain
```

구조 값까지 토큰화하면 의미 없는 변수와 간접 참조가 증가하므로 금지하지 않는다.

### 7.3 Breakpoint 예외

표준 CSS custom property는 일반적인 `@media` 조건에서 사용할 수 없다.

```css
/* 사용하지 않는다. 브라우저 호환이 보장되지 않는다. */
@media (max-width: var(--app-breakpoint-tablet)) {}
```

초기 구현에서는 다음 breakpoint를 문서상 표준으로 고정하고 리터럴 사용을 허용한다.

```text
Desktop compact: 1080px
Drawer 전환: 1023px
Tablet content: 980px
Mobile: 680px
```

기존 640/720/760/920/1180px 규칙은 기능적 이유를 확인한 후 위 표준으로 합칠 수 있는지 화면별로 검토한다. 무조건 기계적으로 변경하지 않는다.

향후 PostCSS `@custom-media`를 도입하면 breakpoint 단일 정의를 별도 프로젝트로 진행할 수 있다.

## 8. app-components.css 설계

### 8.1 포함 대상

관리자 `styles.css`에서 다음 공통 UI를 추출한다.

| 컴포넌트 | 기존 대표 선택자 | 목표 선택자 예시 |
|---|---|---|
| Workspace | `.workspace` | `.app-workspace` 또는 compatibility `.workspace` |
| Panel/Card | `.panel`, `.summary-box` | `.app-panel`, `.app-card` |
| Heading | `.panel-header`, `.subsection-title` | `.app-panel__header`, `.app-section-heading` |
| Field | `.field` | `.app-field` |
| Validation | `.field-invalid`, `.field-error` | `.app-field.is-invalid`, `.app-field__error` |
| Button | `.primary-action`, `.secondary-action`, `.tiny-button` | `.app-button`, modifier 클래스 |
| Action row | `.action-row`, `.align-right` | `.app-actions`, `.app-actions--end` |
| Status | `.status-pill`, `.status-*` | `.app-status`, 상태 modifier |
| Tab | `.admin-tab`, `.tab` 중 공통 가능한 부분 | `.app-tabs`, `.app-tab` |
| Form grid | `.form-grid`, `.split` | `.app-form-grid` 및 페이지 modifier |
| Empty state | `.empty-state` | `.app-empty-state` |
| Modal | `.modal-header`, dialog 공통 규칙 | `.app-dialog`, `.app-dialog__header` |
| Table | `.data-table` 공통 규칙 | `.app-table` |

### 8.2 네이밍 정책

- 신규 공통 컴포넌트는 `.app-*` 접두어를 권장한다.
- 페이지 전용 클래스는 `.admin-*`, `.builder-*`, `.create-promo-*`, `.wizard-*`, `.editor-*`를 사용한다.
- `.panel`, `.field`, `.workspace`는 전환기 compatibility class로만 유지한다.
- 공통 컴포넌트가 페이지 선택자 내부에서 재정의되지 않도록 modifier를 사용한다.

예:

```html
<main class="app-workspace shell-content create-promo-workspace">
  <section class="app-panel wizard-panel"></section>
</main>
```

```css
.app-workspace {
  flex: 1;
  padding: var(--app-content-padding);
}

.create-promo-workspace {
  display: grid;
  gap: var(--app-panel-gap);
  max-width: var(--app-content-max-width);
  margin: 0 auto;
}
```

### 8.3 app-shell.css와의 경계

`app-shell.css`에는 다음만 남긴다.

- Shell Frame
- Sidebar
- Utility Bar
- Global Navigation
- Drawer/Overlay
- Shell Theme Control
- Shell responsive behavior

Panel, Form, Button, Table, Modal은 `app-components.css`로 이동한다. Sidebar 내부 버튼처럼 Shell 구조에 종속된 컨트롤만 `app-shell.css`에 남길 수 있다.

## 9. styles.css 분해 계획

### 9.1 app-components.css로 이동

초기 검토 대상:

- base box-sizing 및 공통 form font 상속
- 공통 Workspace padding
- Panel/Card
- Panel/Modal header
- Field/Input/Select/Textarea
- Validation
- Form grid 중 범용 규칙
- 공통 Action/Button
- Status/Badge
- Empty state
- Dialog/Table 공통 규칙

### 9.2 builder.css로 이동

- `.abc-*`
- Builder A/B/C 패널
- resize handle
- 디자인 MD 목록과 토큰 상세
- 프로모션 빌더 단계
- Generation console
- 결과 리스트

### 9.3 admin.css로 이동

- `.admin-*`
- `.prompt-*`
- `.form-template-*`
- `.template-*`
- `.section-audit-*`
- 관리자 템플릿 섹션 및 Item 편집기
- 관리자 반응형 레이아웃

### 9.4 generated.css로 이동

- `.generated-shell`
- `.promo-page`
- Generated 결과 화면 전용 header/footer/content

프로모션 콘텐츠 자체에 해당하는 규칙은 `.promo-renderer` 또는 명확한 Generated wrapper 하위로 scope한다.

### 9.5 삭제 후보

다음은 실제 HTML/JS 참조와 브라우저 검증 후 삭제한다.

- 구형 `.topbar`, `.topbar-actions`, `.top-nav`, `.nav-button`
- 사용되지 않는 `.theme-dot`
- 구형 `.generated-toolbar`
- 결과가 같은 `@media (max-width: 1180px)`의 `.repeatable-set-grid`
- 기본 선언과 같은 모바일 `.template-item-expand-button` 배치
- 구형 `.md-card-*`
- 구형 `.style-concept-*`, `.selected-concept-card`
- 구형 `.style-group-card`, `.style-group-header`
- 구형 `.draft-stack`, `.draft-section`, `.step-draft-*`, `.result-card`

다음 클래스는 정적 검색만으로 삭제하면 안 된다.

- Vue transition에서 생성하는 `section-expand-*`
- transition-group에서 생성하는 `*-move`
- `:class="'status-' + value"` 형태의 동적 상태 클래스

## 10. Create Promo 전환 계획

### 10.1 목표

- 관리자 기준 Workspace, Panel, Field, Button 디자인을 사용한다.
- Create Promo에는 Wizard 구조와 기능 UI만 남긴다.
- `create-promo.css`의 `:root` compatibility alias를 제거한다.
- 색상, 간격, font, radius, shadow 하드코딩을 `--app-*`로 전환한다.

### 10.2 현재 작업 트리와 연결

현재 Create Promo의 main class는 다음 구조로 변경된 상태다.

```html
<main class="workspace shell-content">
```

공통 컴포넌트 도입 시 목표 구조는 다음과 같다.

```html
<main class="app-workspace shell-content create-promo-workspace">
```

전환기에는 compatibility를 위해 다음도 허용할 수 있다.

```html
<main class="workspace app-workspace shell-content create-promo-workspace">
```

### 10.3 Create Promo에 남길 스타일

- `.create-promo-workspace`
- `.wizard-progress`
- `.step`
- `.wizard-layout-*`
- `.wizard-template-*`
- `.wizard-content-*`
- `.section-ai-*`
- Item AI 생성 및 적용 UI
- Create Promo 전용 responsive layout

Button, Field, Panel의 기본 appearance는 공통 컴포넌트에 맡긴다.

## 11. Promo Wizard 전환 계획

- Create Promo와 동일한 공통 Button, Field, Panel을 사용한다.
- Wizard 단계 구조 중 Create Promo와 완전히 동일한 부분은 공통 Wizard 컴포넌트 후보로 검토한다.
- 기능 차이가 있는 선택자는 무리하게 하나로 합치지 않는다.
- Create Promo 전환이 안정화된 뒤 진행한다.
- 두 페이지 CSS의 공통 블록을 먼저 비교하고 동일 선언만 이동한다.

## 12. Visual Editor와 프로모션 템플릿 CSS 격리

### 12.1 파일 분리

현재 `visual-editor/src/styles.css`는 Editor chrome과 `.promo-renderer` 규칙을 함께 포함한다. 다음처럼 분리한다.

```text
visual-editor/src/styles.css
  → Layer A Editor UI만 포함

visual-editor/src/promo-renderer.css
  → Layer B 렌더러 정적 구조만 포함
```

### 12.2 런타임 인스턴스 값

`PromoPageRenderer.vue`는 현재 `designSpec`에서 다음 값을 `.promo-renderer` style 변수로 주입한다.

```text
--promo-bg
--promo-ink
--promo-accent
--promo-cta
--promo-cta-bg
--promo-cta-ink
--promo-cta-radius
--promo-font
--promo-width
--promo-min-width
```

이 값들은 Layer A 하드코딩 검사 대상에서 제외한다. 특정 프로모션 인스턴스가 의도적으로 생성한 값이기 때문이다.

단, 런타임 값은 반드시 계약과 allowlist를 거쳐야 한다.

### 12.3 선택자 격리

Layer B 정적 CSS의 모든 최상위 선택자는 다음 중 하나로 시작해야 한다.

```text
.promo-renderer
.promo-renderer .rendered-*
.promo-renderer [data-section-key]
.promo-renderer [data-item-key]
```

`.rendered-*` 단독 전역 선택자는 단계적으로 `.promo-renderer .rendered-*`로 scope한다. Editor guide처럼 앱 전용인 상태는 다음처럼 명시한다.

```css
.promo-renderer.is-editor-preview .rendered-item.is-selected {}
```

### 12.4 AI 생성 CSS 정책

AI는 자유 형식 CSS/HTML을 최종 결과로 직접 반환하지 않는다. 서버는 구조화된 layout/design patch만 받는다.

허용 예:

```json
{
  "layoutVariant": "split-left",
  "backgroundPosition": "right center",
  "imageTarget": {
    "type": "item",
    "itemKey": "image"
  }
}
```

클라이언트 또는 렌더러는 검증된 값만 CSS 변수와 allowlisted style property로 변환한다.

금지 대상:

- `@import`
- `javascript:` URL
- 임의 외부 URL
- 앱 Shell 선택자
- `html`, `body`, `:root` 수정
- 무제한 `position: fixed`
- 과도한 z-index
- 관리자 잠금 속성 우회
- `.promo-renderer` 범위를 벗어나는 선택자

### 12.5 Create Promo와 Visual Editor의 책임

- Create Promo는 콘텐츠와 `designSpec`을 구성한다.
- 서버는 AI 결과를 계약 검증한다.
- Visual Editor는 동일한 `designSpec`과 section/item patch를 렌더링한다.
- Web Output은 Visual Editor와 같은 Layer B 렌더러 규칙을 사용한다.
- Create Promo 화면 자체의 CSS가 프로모션 템플릿 결과를 결정해서는 안 된다.

## 13. 단계별 구현 계획

### Phase 0 — 기준선과 안전망

1. 현재 전체 테스트를 실행하고 결과를 기록한다.
2. Visual Editor production build를 실행하고 번들 크기를 기록한다.
3. 1440, 1280, 1024, 768, 390px 화면 기준 스크린샷을 확보한다.
4. Light/Dark 상태를 각각 캡처한다.
5. Create Promo Item AI와 Background AI의 기존 렌더링을 캡처한다.
6. Web Output이 Visual Editor Preview와 동일한지 기준 결과를 확보한다.

완료 기준:

- 기존 31개 테스트 파일 통과
- `npm run check` 통과
- Visual Editor build 통과
- 기준 스크린샷과 테스트 URL 기록

### Phase 1 — 토큰 보완 및 정적 검사

1. 실제 공통 사용처를 근거로 누락 토큰을 추가한다.
2. `--mono` 사용을 `--app-font-mono`로 교체한다.
3. Layer A 하드코딩 검사 스크립트를 추가한다.
4. Layer A/Layer B 교차 참조 검사 스크립트를 보강한다.
5. breakpoint allowlist를 검사 스크립트에 반영한다.

권장 신규 테스트 파일:

```text
scripts/test-app-css-architecture-contract.js
scripts/test-app-css-hardcoded-values.js
scripts/test-promo-renderer-css-isolation.js
```

완료 기준:

- 새 검사가 의도한 기존 위반을 탐지함
- 허용 예외와 제외 경로가 문서화됨
- `vendor/`, 빌드 산출물, 동적 `--promo-*` 값은 잘못 탐지하지 않음

### Phase 2 — app-components.css 생성

1. 공통 Workspace, Panel, Field, Button, Status, Empty state를 추출한다.
2. 관리자 HTML에 신규 `.app-*` 클래스를 병행 적용한다.
3. 기존 선택자는 compatibility selector로 잠시 유지한다.
4. `app-components.css`를 관리자/Builder에 로드한다.
5. 관리자의 Light/Dark 및 responsive 회귀를 확인한다.

예:

```css
.app-panel,
.panel {
  /* 전환기 공통 선언 */
}
```

완료 기준:

- 관리자 화면의 계산된 스타일이 기준선과 동등함
- 공통 컴포넌트가 페이지 전용 선택자를 참조하지 않음
- `app-components.css`가 `--app-*`만 참조함

### Phase 3 — styles.css 분해

1. Builder 전용 규칙을 `builder.css`로 이동한다.
2. 관리자 전용 규칙을 `admin.css`로 이동한다.
3. Generated 전용 규칙을 `generated.css`로 이동한다.
4. 공통 규칙은 `app-components.css`로 이동한다.
5. 확인된 dead CSS를 작은 단위로 제거한다.
6. `styles.css`는 전환기 compatibility 파일로 축소한 후 최종 제거한다.

한 커밋에서 전체 3,575줄을 재배치하지 않는다. 권장 커밋 단위:

```text
1. common fields/buttons/panels
2. builder rules
3. admin template rules
4. prompt admin rules
5. generated rules
6. dead CSS cleanup
```

완료 기준:

- `index.html` Builder 및 관리자 화면 정상
- `generated.html` 정상
- `styles.css`의 잔여 책임이 명확함
- dead selector 제거 후 전체 테스트 통과

### Phase 4 — Create Promo 공통화

1. `app-components.css`를 로드한다.
2. Workspace, Panel, Field, Button class를 `.app-*`와 연결한다.
3. Create Promo 로컬 `:root` alias를 제거한다.
4. 색상·간격·폰트·radius·shadow 리터럴을 `--app-*`로 교체한다.
5. Create Promo 전용 grid 및 Wizard 구조만 남긴다.
6. AI 디자인 생성/적용/삭제 UI를 회귀 테스트한다.

완료 기준:

- 관리자와 Create Promo의 공통 컴포넌트 appearance 일치
- Wizard 단계 및 레이아웃 기능 변화 없음
- Item AI와 Background AI 결과 변화 없음

### Phase 5 — Promo Wizard 공통화

1. Create Promo에서 검증된 공통 컴포넌트를 적용한다.
2. Create Promo와 완전히 동일한 CSS 블록을 제거한다.
3. Wizard 고유 레이아웃만 유지한다.
4. 단계 전환, 저장, 복원 동작을 검증한다.

완료 기준:

- Create Promo와 공통 버튼/필드/Panel 일치
- 기존 Wizard 데이터와 단계 이동 정상

### Phase 6 — Visual Editor 분리

1. `styles.css`에서 `.promo-renderer` 관련 규칙을 `promo-renderer.css`로 이동한다.
2. Editor chrome을 `--app-*` 및 공통 컴포넌트로 전환한다.
3. `.rendered-*` 전역 선택자를 `.promo-renderer` 하위로 scope한다.
4. Editor-only guide가 output mode에 표시되지 않는지 확인한다.
5. Vite production build를 실행한다.
6. 생성된 `prototype/visual-editor-assets/`를 검증한다.

완료 기준:

- standalone/editor/admin-layout/wizard-layout/output mode 모두 정상
- Preview와 Web Output의 프로모션 스타일 동등
- Layer A/Layer B 토큰 교차 참조 0건

### Phase 7 — 최종 정리

1. compatibility alias와 구형 클래스 제거 여부를 재검토한다.
2. 미사용 CSS 선택자 보고서를 다시 생성한다.
3. `.DS_Store` 등 저장소 비소스 파일을 별도 정리한다.
4. 문서의 파일 크기와 테스트 결과를 갱신한다.
5. 전체 브라우저 회귀 테스트를 수행한다.

## 14. 파일별 변경 매트릭스

| 파일 | 변경 유형 | 구현 지침 |
|---|---|---|
| `prototype/design-tokens.css` | 수정 | 누락된 의미 토큰만 추가, Layer B 토큰 금지 |
| `prototype/app-shell.css` | 축소/정리 | Shell 책임만 유지, 일반 Panel/Form 금지 |
| `prototype/app-components.css` | 신규 | 관리자 기준 공통 UI, `--app-*`만 참조 |
| `prototype/styles.css` | 단계적 축소 | Builder/Admin/Generated/Common을 분리한 뒤 제거 검토 |
| `prototype/builder.css` | 신규 | `.abc-*` 및 Builder 전용 UI |
| `prototype/admin.css` | 신규 | 관리자 Template/Prompt/Audit UI |
| `prototype/generated.css` | 신규 | Generated page shell/content |
| `prototype/create-promo.css` | 수정 | Wizard/Create Promo 고유 구조만 유지 |
| `prototype/promo-wizard.css` | 수정 | Promo Wizard 고유 구조만 유지 |
| `prototype/index.html` | 수정 | 공통/Builder/Admin CSS 로드 및 `.app-*` 적용 |
| `prototype/create-promo.html` | 수정 | `app-components.css` 로드 및 공통 클래스 적용 |
| `prototype/promo-wizard.html` | 수정 | `app-components.css` 로드 및 공통 클래스 적용 |
| `prototype/generated.html` | 수정 | `generated.css` 로드, 구형 Toolbar 제거 상태 유지 |
| `visual-editor/src/styles.css` | 수정 | Layer A Editor UI만 유지 |
| `visual-editor/src/promo-renderer.css` | 신규 | Layer B 정적 렌더러 규칙 |
| `visual-editor/src/main.js` | 수정 | CSS import 순서 명시 |
| `visual-editor/src/PromoPageRenderer.vue` | 제한적 수정 | runtime `--promo-*`와 scope 계약 유지 |
| `scripts/run-tests.js` | 자동 포함 | 새 `test-*.js`가 자동 실행되는지 확인 |

## 15. 자동 테스트 계획

### 15.1 CSS 아키텍처 계약

검증 항목:

- 모든 Layer A 페이지가 `design-tokens.css`, `app-shell.css`, `app-components.css`를 올바른 순서로 로드함
- 페이지 CSS에 신규 `:root` 앱 alias가 없음
- `app-components.css`에서 `.admin-*`, `.builder-*`, `.wizard-*`, `.promo-renderer`를 참조하지 않음
- `app-shell.css`에 일반 `.panel`, `.field` 정의가 없음
- Layer A CSS에서 `--promo-*`, `--item-*` 사용 0건
- Layer B CSS에서 `--app-*`, `--shell-*` 사용 0건

### 15.2 하드코딩 검사

검사 대상:

```text
prototype/app-shell.css
prototype/app-components.css
prototype/admin.css
prototype/builder.css
prototype/create-promo.css
prototype/promo-wizard.css
prototype/generated.css
visual-editor/src/styles.css
```

제외 대상:

```text
prototype/vendor/**
prototype/visual-editor-assets/**
visual-editor/src/promo-renderer.css의 문서화된 fallback
PromoPageRenderer.vue의 검증된 runtime instance 값
```

검사는 단순 hex 정규식만 사용하지 말고 주석, URL, SVG, allowlist를 구분해야 한다. 초기에는 현재 저장소의 Node.js 테스트 스타일을 따르되 오탐이 많으면 PostCSS parser 또는 Stylelint 도입을 별도 결정한다.

### 15.3 브라우저 회귀 테스트

필수 화면:

1. Promo Builder
2. 관리자 Prompt 설정
3. 관리자 Template/Section/Item 설정
4. Create Promo Step 1~4
5. Promo Wizard Step 1~4
6. Visual Editor standalone
7. Visual Editor admin-layout
8. Visual Editor wizard-layout embedded
9. Visual Output
10. Generated UI

필수 viewport:

```text
1440 × 900
1280 × 800
1024 × 768
768 × 1024
390 × 844
```

필수 상태:

- Light/Dark
- Sidebar max/min
- 모바일 Drawer open/close
- Form focus/error/disabled
- Modal open
- 긴 텍스트와 빈 상태
- Item AI 이미지 적용
- Background AI 이미지 적용
- Web Output

### 15.4 기존 테스트

각 Phase 후 최소 다음을 실행한다.

```bash
npm test
npm run check
npm run build:visual-editor
git diff --check
```

Node가 PATH에 없는 Codex Desktop 환경에서는 번들 런타임 경로를 사용한다. Visual Editor build는 산출물을 수정하므로 해당 Phase에서만 실행하고, 리뷰 전용 작업에서는 실행하지 않는다.

## 16. 수동 QA 체크리스트

### 공통 UI

- [ ] 관리자와 Create Promo Button 높이/색/상태 일치
- [ ] Field label/input/error appearance 일치
- [ ] Panel border/radius/shadow 일치
- [ ] Light/Dark 전환 시 대비 유지
- [ ] Sidebar와 페이지 콘텐츠 간 여백 일치
- [ ] focus-visible이 모든 인터랙션에 표시됨

### 관리자

- [ ] Template 기본 설정 정상
- [ ] Template 섹션 구성 정상
- [ ] Section Item 목록, 펼침, Drag 정상
- [ ] AI 정책 저장 정상
- [ ] Prompt 설정 정상

### Create Promo

- [ ] 단계 전환 정상
- [ ] Template/Content 입력 정상
- [ ] Visual Editor iframe 정상
- [ ] Section Background AI 정상
- [ ] Item AI 정상
- [ ] 이미지 삭제 정상

### Layer B

- [ ] 앱 Light/Dark 변경이 프로모션 브랜드 색을 바꾸지 않음
- [ ] `designSpec.theme` 변경은 프로모션에만 반영됨
- [ ] Preview와 Web Output 일치
- [ ] Section background와 Item image target 구분 유지

## 17. 리스크와 완화책

### 17.1 대규모 선택자 이동으로 인한 cascade 변화

위험:

- 파일 로드 순서가 바뀌면서 동일 specificity의 최종 값이 달라질 수 있다.

완화:

- 계산된 스타일 기준선을 캡처한다.
- 공통 → 페이지 순서를 고정한다.
- 한 번에 한 컴포넌트군만 이동한다.
- `!important`로 문제를 숨기지 않는다.

### 17.2 범용 클래스 충돌

위험:

- `.panel`, `.field`, `.workspace`가 서로 다른 페이지에서 다른 의미로 사용된다.

완화:

- 신규 `.app-*` 클래스를 사용한다.
- compatibility selector는 전환기에만 유지한다.
- 페이지 전용 modifier를 추가한다.

### 17.3 토큰 과잉 설계

위험:

- 모든 숫자를 변수화하면 의미 없는 토큰이 증가한다.

완화:

- 디자인 값과 구조 값을 구분한다.
- 두 곳 이상에서 재사용되거나 의미가 명확한 값만 토큰화한다.

### 17.4 프로모션 렌더러 격리 붕괴

위험:

- 앱 토큰이 프로모션 콘텐츠에 상속되거나 프로모션 CSS가 앱 UI를 덮는다.

완화:

- `.promo-renderer` scope를 강제한다.
- 토큰 교차 참조 자동 검사를 추가한다.
- Web Output 비교 테스트를 필수화한다.

### 17.5 빌드 산출물 불일치

위험:

- `visual-editor/src`는 수정됐지만 `prototype/visual-editor-assets`가 갱신되지 않을 수 있다.

완화:

- Visual Editor Phase에서 build를 필수화한다.
- 소스와 번들 변경을 같은 커밋에 포함한다.
- 번들을 직접 편집하지 않는다.

### 17.6 미사용 CSS 오판

위험:

- Vue 동적 class와 transition class를 정적 검색만 보고 삭제할 수 있다.

완화:

- HTML, JS, Vue template, 동적 class 생성 코드를 함께 검색한다.
- 삭제는 별도 커밋으로 진행한다.
- 삭제 후 브라우저 테스트를 실행한다.

## 18. 커밋 및 롤백 전략

권장 커밋 단위:

```text
1. test: add CSS architecture guards
2. feat: complete shared app tokens
3. feat: extract common app components
4. refactor: split builder styles
5. refactor: split admin styles
6. refactor: split generated styles
7. refactor: migrate create promo components
8. refactor: migrate promo wizard components
9. refactor: isolate visual editor renderer CSS
10. chore: remove verified dead CSS
```

롤백 원칙:

- 각 화면 전환은 독립 커밋으로 되돌릴 수 있어야 한다.
- 토큰과 공통 컴포넌트는 이미 전환 완료된 화면이 있으면 유지한다.
- 특정 페이지 문제는 해당 페이지 CSS 커밋만 롤백한다.
- Visual Editor 문제는 source와 bundle을 함께 이전 정상 커밋으로 복원한다.
- Layer B 회귀가 발생하면 렌더러 CSS 분리 커밋을 우선 롤백한다.

## 19. 구현 시 LLM 작업 지침

다른 LLM이 이 계획을 구현할 경우 다음 순서를 지킨다.

1. 작업 전 `git status --short`와 현재 브랜치를 확인한다.
2. 사용자 소유 미커밋 변경을 덮어쓰지 않는다.
3. 선택한 Phase의 관련 파일과 테스트를 먼저 읽는다.
4. 대규모 검색/치환 전에 selector별 실제 참조를 확인한다.
5. 빌드 산출물을 직접 수정하지 않는다.
6. CSS 이동 시 원본 규칙을 복사한 후 테스트하고, 정상 확인 뒤 원본을 제거한다.
7. 새 토큰은 실제 사용 근거와 의미를 문서화한다.
8. `.promo-renderer` 경계를 변경할 때 server contract와 apply 경로를 함께 검토한다.
9. 한 Phase를 완료하기 전 다음 Phase를 시작하지 않는다.
10. 각 Phase 완료 후 테스트 결과, 잔여 이슈, 변경 파일을 handoff에 기록한다.

## 20. Definition of Done

다음 조건을 모두 만족해야 전체 작업 완료로 판단한다.

1. `design-tokens.css`가 Layer A 디자인 값의 단일 출처다.
2. `app-shell.css`는 Shell 책임만 가진다.
3. `app-components.css`가 공통 Workspace/Panel/Field/Button/Status 등을 제공한다.
4. `styles.css`의 혼재 책임이 제거되고 Builder/Admin/Generated CSS가 분리된다.
5. Create Promo와 Promo Wizard가 관리자 기준 공통 컴포넌트를 사용한다.
6. 페이지별 CSS에 신규 `:root` compatibility alias가 없다.
7. Layer A CSS의 비승인 색상·공통 디자인 하드코딩이 0건이다.
8. breakpoint 리터럴은 승인 목록만 사용한다.
9. Visual Editor 앱 UI와 프로모션 렌더러 CSS가 파일 및 토큰 기준으로 분리된다.
10. `.promo-renderer`가 `--app-*`를 참조하지 않는다.
11. Layer A가 `--promo-*`, `--item-*`를 참조하지 않는다.
12. AI 생성 결과는 구조화된 patch와 allowlist를 통해서만 CSS로 변환된다.
13. Preview와 Web Output이 같은 프로모션 디자인을 렌더링한다.
14. 관리자 Light/Dark 변경이 프로모션 브랜드 디자인에 영향을 주지 않는다.
15. 전체 자동 테스트와 문법 검사가 통과한다.
16. Visual Editor production build가 통과한다.
17. 1440/1280/1024/768/390 viewport 브라우저 검증이 완료된다.
18. dead CSS 삭제 목록과 잔여 compatibility 목록이 문서화된다.

## 21. Phase 시작 전 최종 확인 사항

다음 정책은 본 계획에서 확정된 것으로 본다.

- 공통 컴포넌트 파일명: `app-components.css`
- 앱 토큰 접두어: `--app-*`
- 프로모션 토큰 접두어: `--promo-*`, `--item-*`
- 관리자 페이지 디자인을 Layer A 기준으로 사용
- 페이지 CSS는 공통 토큰을 참조하고 디자인 값을 재정의하지 않음
- 프로모션별 생성 값은 Layer B runtime 값으로 별도 허용
- 자유 형식 AI CSS 삽입 금지

다음 항목은 구현 중 실제 코드 근거를 확인해 결정한다.

- `.app-*` 신규 클래스와 기존 클래스 병행 기간
- `styles.css` 최종 제거 시점
- Web Output 전용 CSS bundle 분리 여부
- Stylelint/PostCSS 도입 여부
- 기존 세부 breakpoint를 표준 breakpoint로 합치는 시점

## 22. 권장 첫 구현 작업

첫 개발 작업은 UI CSS 이동이 아니라 안전망 구축이어야 한다.

```text
Phase 0 기준선 확보
→ CSS architecture contract test 추가
→ hardcoded value 검사 추가
→ promo renderer isolation 검사 추가
→ app-components.css 생성
```

이 순서를 지키면 3,575줄 규모의 `styles.css`를 분리하는 과정에서 페이지별 cascade 회귀와 프로모션 렌더러 오염을 조기에 발견할 수 있다.
