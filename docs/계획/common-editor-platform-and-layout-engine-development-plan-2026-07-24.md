# 공통 편집 플랫폼 및 레이아웃 엔진 단일화 개발계획서

## 0. 문서 정보

- 작성일: 2026-07-24
- 대상 프로젝트: `promo_web_builder`
- 문서 상태: 개발 착수 전 검토안
- 우선순위: P0~P4
- 핵심 대상:
  - 설정 > 템플릿·레이아웃 관리 > 레이아웃 편집기
  - 프로모션 빌더 > Live Preview
  - Web Output
- 선행 문서:
  - `docs/계획/admin-promo-layout-editor-unification-development-plan-2026-07-24.md`
  - `docs/계획/source-code-cleanup-and-consolidation-development-plan-2026-07-21.md`
  - `docs/자료/legacy-route-reference-audit-2026-07-24.md`
- 문서 목적:
  - 모양이 비슷한 두 편집기를 만드는 것이 아니라 기능과 동작이 동일한 하나의 편집 플랫폼을 구축한다.
  - 공통 동작을 단일 모듈에서 관리하고 설정과 프로모션 빌더는 저장·권한·외부 연동만 다르게 구성한다.
  - 향후 편집 기능을 한 번 수정하면 모든 사용 화면에 동일하게 반영되는 구조를 만든다.

## 1. 배경

설정의 레이아웃 편집기와 프로모션 빌더 Live Preview는 현재 동일한 Vue Visual Editor 번들을 사용한다. 최근 작업으로 두 화면은 동일한 3단 편집 UI와 임베디드 Shell을 사용하게 됐다.

그러나 텍스트 컴포넌트를 드래그하여 크기를 조절했을 때 두 화면의 동작과 결과가 다르다. 직접 원인은 리사이즈 계산이 공통 디자인 좌표가 아니라 현재 브라우저에 렌더링된 DOM 크기와 문구 길이에 의존하기 때문이다.

더 큰 원인은 다음과 같다.

1. 설정 편집기와 프로모션 빌더가 편집 상태를 서로 다른 방식으로 생성한다.
2. 프로모션 빌더와 iframe 편집기가 같은 레이아웃 상태를 각각 보유한다.
3. 저장, Snapshot, Layout Identity 관련 계약이 여러 파일에 분산돼 있다.
4. Visual Editor의 `App.vue`가 공통 편집 기능과 Host별 기능을 모두 담당한다.
5. 관리자, 프로모션 빌더, Visual Editor의 프런트엔드 구성 방식이 서로 다르다.

따라서 단순 CSS 수정이나 mode 분기 추가로는 장기 유지보수 문제를 해결할 수 없다.

## 2. 기존 통합 계획과의 관계

`admin-promo-layout-editor-unification-development-plan-2026-07-24.md`는 다음 문제를 해결하는 계획이다.

- 관리자 Layout 저장·활성화와 프로모션 빌더 반영
- 동일한 3단 편집 UI
- Capability 기반 기능 노출
- 섹션 속성과 컴포넌트 속성의 UI 배치
- 관리자 → 프로모션 빌더 반영 브라우저 테스트

해당 계획은 UI와 데이터 반영 경로 안정화를 목적으로 유지한다.

이번 계획은 그 다음 단계다.

- 같은 마크업을 사용하는 수준에서 끝내지 않는다.
- 편집 상태, 편집 명령, 좌표 계산, Undo/Redo, 검증을 공통 엔진으로 이동한다.
- 관리자와 프로모션 빌더의 차이는 Host Adapter로 제한한다.
- 프런트엔드 개발 플랫폼을 Vue 3 + Vite 기준으로 점진 통일한다.

즉 기존 계획을 폐기하는 것이 아니라, 기존 계획에서 완료된 UI 통합 결과를 공통 편집 플랫폼으로 재구성한다.

## 3. 현재 소스 구조 분석

### 3.1 기술 스택

| 화면 | 현재 기술 | 주요 소스 | 상태 |
|---|---|---|---|
| 설정 | CDN Vue 3 | `prototype/app.js`, `prototype/index.html` | 대형 단일 Vue 인스턴스 |
| 프로모션 빌더 | Vanilla JavaScript | `prototype/create-promo.js` | DOM 조립 및 상태 관리 혼합 |
| 구 Promo Wizard | Vanilla JavaScript | `prototype/promo-wizard.js` | 호환 경로로 잔존 |
| Visual Editor | Vue 3 + Vite | `visual-editor/src/` | 관리자·빌더 공통 번들 |
| Web Output | Visual Editor 번들 | `visual-editor/src/PromoPageRenderer.vue` | 읽기 전용 출력 |

2026-07-24 기준 주요 파일 규모:

| 파일 | 대략적인 줄 수 | 주요 책임 |
|---|---:|---|
| `prototype/app.js` | 5,933 | 설정 전체 기능 |
| `prototype/create-promo.js` | 2,130 | 프로모션 작성, 템플릿, Preview Host, AI |
| `prototype/promo-wizard.js` | 2,269 | 구 Wizard 흐름 |
| `visual-editor/src/App.vue` | 1,541 | 편집 상태, UI, Host 연동, 저장, AI |
| `visual-editor/src/PromoPageRenderer.vue` | 861 | 렌더링, 선택, 이동, 리사이즈, 인라인 편집 |

### 3.2 현재 편집기 진입 방식

설정:

```text
/prototype/visual-editor.html
  ?mode=admin-layout
  &templateId={templateId}
```

프로모션 빌더:

```text
/prototype/visual-editor.html
  ?mode=wizard-layout
  &source=create-promo
```

두 화면 모두 같은 번들을 사용하지만 `App.vue`에서 mode와 capability를 기준으로 초기 데이터 로드, 저장, 기능 노출을 다르게 처리한다.

### 3.3 관리자 데이터 흐름

```text
Admin Layout Editor
  → GET /api/wizard-form-template-layout
  → App.vue 내부 상태 생성
  → 사용자가 편집
  → PATCH /api/wizard-form-template-layout
  → 필요 시 Template 활성화
```

### 3.4 프로모션 빌더 데이터 흐름

```text
Create Promo
  → wizardResolvedLayout / sectionInputs 보유
  → iframe으로 Snapshot postMessage
  → App.vue가 별도 designSpec / sectionInputs 상태 생성
  → 사용자가 편집
  → watch()가 변경 Snapshot을 부모로 postMessage
  → Create Promo가 다시 wizardResolvedLayout에 병합
  → localStorage 저장
```

이 구조에서는 부모와 iframe이 편집 상태를 중복 소유한다.

### 3.5 현재 리사이즈 계산 문제

`PromoPageRenderer.vue`는 리사이즈 시작 시 다음 값을 실제 DOM에서 읽는다.

- 컴포넌트의 현재 `getBoundingClientRect()`
- Preview 컨테이너의 현재 너비
- 현재 계산된 `font-size`
- 현재 문구의 줄바꿈 결과

텍스트 박스의 기본 너비는 `fit-content`이므로 같은 컴포넌트라도 문구 길이에 따라 시작 너비가 달라진다.

현재 폰트 확대·축소 비율:

```text
widthScale  = nextWidth / startWidth
heightScale = nextHeight / startHeight
fontScale   = widthScale 또는 heightScale
```

따라서 다음 조건이 결과에 영향을 준다.

- 관리자 기본 문구와 사용자가 등록한 실제 문구
- 새 창과 iframe의 Preview 너비
- 브라우저 확대 비율
- 패널 너비와 반응형 breakpoint
- 줄바꿈으로 계산된 초기 높이

동일한 마우스 이동 거리라도 서로 다른 결과가 발생하는 것이 현재 구조에서는 정상적인 결과다.

### 3.6 분산된 레이아웃 계약

레이아웃과 Snapshot 관련 책임이 다음 파일에 분산돼 있다.

- `visual-editor/src/layout-utils.mjs`
  - Layout normalize
  - Layout validate
  - Snapshot 생성
- `prototype/wizard/wizard-storage.js`
  - Wizard Snapshot 생성
  - localStorage 저장
- `prototype/create-promo-layout-cache.js`
  - Layout Identity 비교
  - Layout cache 복원
  - Section order cache 복원
- `prototype/create-promo.js`
  - base/resolved layout 상태
  - appearance override 병합
  - 부모·iframe 동기화
- `visual-editor/src/App.vue`
  - designSpec 변경 및 Host별 저장

같은 개념이 `layoutSpec`, `designSpec`, `baseLayout`, `resolvedLayout`, `userLayout` 등으로 표현된다.

### 3.7 기존 공통화 수준

공통화가 완료된 부분:

- 동일한 Vue `PromoPageRenderer`
- 동일한 Visual Editor 번들
- 동일한 3단 Workspace Shell
- Editor Context와 Capability
- 공통 디자인 토큰 및 공통 앱 CSS
- 일부 Wizard Core, Storage, Content 모듈

공통화가 부족한 부분:

- 편집 상태 소유권
- 편집 Command
- Layout geometry 계산
- 기본 geometry 결정
- Undo/Redo
- Host별 저장 Adapter
- Snapshot 계약
- Host와 iframe 동기화
- 기능 동등성 테스트

## 4. 문제 정의

### 4.1 같은 엔진이라는 명칭과 실제 구조가 일치하지 않음

`engineKey`가 같고 렌더러 컴포넌트가 같아도 상태와 명령 처리 경로가 다르면 하나의 편집 엔진이라고 보기 어렵다.

### 4.2 DOM이 편집 데이터의 기준이 됨

DOM은 편집 결과를 보여주는 View여야 한다. 현재는 DOM 크기가 다음 편집 상태를 계산하는 기준이 된다. Viewport나 콘텐츠가 달라지면 편집 결과도 달라진다.

### 4.3 편집 상태의 중복 소유

Create Promo 부모와 Visual Editor iframe이 모두 수정 가능한 레이아웃 상태를 보유한다. 어느 상태가 Source of Truth인지 불명확하다.

### 4.4 Host 조건문이 공통 앱에 누적됨

`App.vue`에서 관리자, Wizard, Create Promo, Output mode를 직접 분기한다. 기능 추가 시 모든 조건을 점검해야 한다.

### 4.5 기능 동등성을 보장하는 테스트 계약이 없음

현재 브라우저 테스트는 관리자 반영과 Create Promo 기본 동작을 확인하지만 다음 핵심 계약을 직접 검증하지 않는다.

```text
동일한 초기 문서
+ 동일한 편집 Command
= 관리자와 프로모션 빌더에서 동일한 Layout 결과
```

## 5. 목표

### 5.1 기능 목표

1. 설정 편집기와 프로모션 빌더가 동일한 Editor Core를 사용한다.
2. 이동, 크기 조절, 정렬, 다중 선택, Undo/Redo가 동일한 Command로 실행된다.
3. Preview 크기와 콘텐츠 문구가 달라도 동일한 Command는 동일한 Layout 결과를 만든다.
4. Web Output은 편집기와 동일한 Renderer를 읽기 전용으로 사용한다.
5. Host별 차이는 권한, 저장, AI 실행, 외부 이벤트에만 존재한다.
6. 공통 기능 수정 시 Core 또는 공통 UI 한 곳만 수정한다.

### 5.2 구조 목표

1. 프런트엔드 공통 플랫폼은 Vue 3 + Vite + ESM을 기준으로 한다.
2. Editor Core는 UI와 네트워크에 의존하지 않는 모듈로 구성한다.
3. Layout Engine은 DOM에 의존하지 않는 순수 함수로 구성한다.
4. Admin, Promo Builder, Output은 명시적인 Host Adapter를 사용한다.
5. Snapshot 및 Layout 계약을 하나의 모듈로 통합한다.
6. 기존 저장 데이터와 활성 템플릿은 마이그레이션 기간 동안 호환한다.

### 5.3 비기능 목표

- 동일한 입력과 Command에 대해 결정론적 결과를 반환한다.
- 공통 모듈은 Node 기반 단위 테스트가 가능해야 한다.
- 모든 편집 Command는 Undo 가능한 역변경 정보를 생성해야 한다.
- Host Adapter 장애가 편집 중인 로컬 상태를 손상시키지 않아야 한다.
- Visual Editor 프로덕션 빌드 산출물은 소스와 항상 일치해야 한다.

## 6. 제외 범위

이번 P0~P4에 포함하지 않는다.

- 별도 저장소 또는 별도 Vercel 프로젝트 생성
- 관리자 전체 화면의 일괄 Vue 재작성
- 프로모션 빌더 전체 Step의 일괄 Vue 재작성
- 템플릿·컴포넌트 DB 모델의 전면 재설계
- 자유 형식 CSS/HTML을 편집 Command로 허용
- AI가 Editor Core를 우회하여 DOM을 직접 변경
- 기존 활성 템플릿 및 사용자 콘텐츠 초기화
- iframe을 첫 단계에서 즉시 제거

## 7. 핵심 설계 원칙

### 7.1 하나의 Source of Truth

편집 중인 문서 상태는 Editor Store 한 곳에서만 소유한다.

```text
Host
  → 초기 문서 전달
Editor Store
  → 모든 변경 상태 소유
Renderer
  → 상태를 읽어서 렌더링
Host Adapter
  → 저장 또는 외부 전달
```

### 7.2 모든 변경은 Command로 처리

UI가 `designSpec`을 직접 변경하지 않는다.

금지:

```js
designSpec.itemStyles[key].widthPct = nextWidth;
```

권장:

```js
editor.execute({
  type: "COMPONENT_RESIZE",
  componentKey,
  geometry: nextGeometry,
});
```

### 7.3 DOM은 결과를 표시하는 View

- DOM의 크기를 영구 Layout 상태의 기준으로 사용하지 않는다.
- Pointer 좌표만 Viewport → Design Coordinate로 변환한다.
- Layout 계산은 변환된 공통 좌표와 기존 Layout 상태를 사용한다.

### 7.4 Host 차이는 Adapter로 제한

관리자와 프로모션 빌더가 달라야 하는 항목:

- 초기 데이터 조회
- 저장 위치
- 저장·활성화 권한
- AI 작업 실행 가능 여부
- Host 알림과 외부 이벤트

달라서는 안 되는 항목:

- 선택
- 이동
- 리사이즈
- 폰트 스케일
- 정렬
- 다중 선택
- 충돌 검사
- Undo/Redo
- Layout 검증
- Renderer 결과

### 7.5 기존 경로를 유지하며 내부만 교체

초기 전환 동안 다음 URL을 유지한다.

```text
/prototype/visual-editor.html?mode=admin-layout
/prototype/visual-editor.html?mode=wizard-layout&source=create-promo
/prototype/visual-output.html
```

URL과 iframe 구조를 먼저 바꾸지 않고 내부 상태와 Command 엔진부터 교체한다.

## 8. 목표 아키텍처

### 8.1 전체 구조

```text
visual-editor/src/
├─ platform/
│  ├─ editor-core/
│  │  ├─ create-editor-store.mjs
│  │  ├─ editor-state.mjs
│  │  ├─ editor-commands.mjs
│  │  ├─ command-reducer.mjs
│  │  ├─ history.mjs
│  │  └─ selection.mjs
│  ├─ layout-engine/
│  │  ├─ coordinate-system.mjs
│  │  ├─ geometry.mjs
│  │  ├─ resize.mjs
│  │  ├─ move.mjs
│  │  ├─ align.mjs
│  │  ├─ collision.mjs
│  │  └─ responsive.mjs
│  ├─ contracts/
│  │  ├─ editor-document.mjs
│  │  ├─ layout-spec.mjs
│  │  ├─ layout-identity.mjs
│  │  ├─ snapshot.mjs
│  │  └─ validation.mjs
│  └─ adapters/
│     ├─ admin-template-adapter.mjs
│     ├─ promo-builder-adapter.mjs
│     ├─ output-adapter.mjs
│     └─ post-message-transport.mjs
├─ components/
│  ├─ EditorWorkspace.vue
│  ├─ SectionPanel.vue
│  ├─ PreviewPanel.vue
│  ├─ PropertyPanel.vue
│  └─ PromoPageRenderer.vue
├─ composables/
│  ├─ use-editor.mjs
│  ├─ use-pointer-transform.mjs
│  └─ use-host-adapter.mjs
└─ App.vue
```

실제 파일명은 구현 시 조정할 수 있지만 책임 경계는 유지해야 한다.

### 8.2 Editor Document

Editor Core가 사용하는 단일 입력 계약:

```js
{
  contractVersion: 3,
  identity: {
    templateId,
    templateKey,
    templateVersion,
    layoutId,
    layoutRevision,
    configRevision,
    rendererKey,
    rendererVersion
  },
  sections: [],
  content: {},
  layout: {
    theme: {},
    sectionStyles: {},
    componentStyles: {}
  },
  assets: {},
  metadata: {
    surface: "template-default" | "promo-instance" | "output"
  }
}
```

`designSpec`, `layoutSpec`, `resolvedLayout`은 각 계층의 임의 명칭으로 사용하지 않는다.

권장 명칭:

- `baseLayout`: 활성 템플릿이 제공하는 기준 Layout
- `layoutOverrides`: 프로모션 또는 사용자 변경분
- `effectiveLayout`: 렌더링 시 계산된 결과
- `editorDocument.layout`: 현재 편집 대상

Editor Core 내부에서는 현재 편집 대상인 `editorDocument.layout`만 변경한다.

### 8.3 Editor State

```js
{
  document,
  selection: {
    sectionKey,
    componentKeys: [],
    primaryComponentKey
  },
  viewport: {
    mode: "desktop" | "mobile",
    scale,
    stageWidth,
    stageHeight
  },
  history: {
    undo: [],
    redo: []
  },
  transaction: {
    activeCommandId,
    dirty,
    saving,
    error
  }
}
```

### 8.4 Command 계약

필수 Command:

```text
SECTION_SELECT
SECTION_RESIZE
SECTION_STYLE_UPDATE
SECTION_BACKGROUND_UPDATE
COMPONENT_SELECT
COMPONENT_MULTI_SELECT
COMPONENT_MOVE
COMPONENT_RESIZE
COMPONENT_STYLE_UPDATE
COMPONENT_CONTENT_UPDATE
COMPONENT_ALIGN
COMPONENT_DISTRIBUTE
COMPONENT_STACK
LAYOUT_PATCH_APPLY
LAYOUT_RESET
HISTORY_UNDO
HISTORY_REDO
```

Command 형식:

```js
{
  id: "uuid-or-monotonic-id",
  type: "COMPONENT_RESIZE",
  target: {
    sectionKey: "hero",
    componentKey: "title"
  },
  payload: {
    geometry: {
      x: 120,
      y: 80,
      width: 480,
      height: 160
    },
    fontSize: 36
  },
  source: "pointer" | "keyboard" | "property-panel" | "ai",
  timestamp: 0
}
```

AI 결과도 자유 형식 DOM 수정이 아니라 동일 Command 또는 검증된 Command 목록으로 변환한다.

### 8.5 Command 결과

```js
{
  ok: true,
  nextState,
  inverseCommand,
  changeSet: {
    sectionKeys: [],
    componentKeys: []
  },
  warnings: []
}
```

Undo는 DOM 복원이 아니라 `inverseCommand` 또는 이전 Editor State Patch를 사용한다.

## 9. 공통 디자인 좌표계

### 9.1 기준 좌표

Desktop 기준:

```text
Design canvas width: 1280
Section width: 1280
X, Y, Width, Height: 디자인 픽셀 좌표
```

Section 외부 전체 배경은 100%로 렌더링하되 컴포넌트 배치 영역은 1280 기준 좌표를 사용한다.

### 9.2 화면 좌표 변환

```text
scale = renderedCanvasWidth / 1280

designX = screenX / scale
designY = screenY / scale

screenX = designX * scale
screenY = designY * scale
```

브라우저 너비와 iframe 너비는 `scale`에만 영향을 주고 저장되는 Layout 값에는 영향을 주지 않는다.

### 9.3 기본 Component Geometry

모든 편집 가능한 컴포넌트는 명시적인 기본 geometry를 가져야 한다.

```js
{
  x: 0,
  y: 0,
  width: 360,
  height: 96
}
```

기본 geometry가 없는 Legacy 데이터는 공통 함수가 한 번만 계산하여 Editor Document에 정규화한다.

금지:

- 콘텐츠 길이로 기본 width 결정
- `fit-content` 값을 Layout 기본값으로 저장
- 관리자 placeholder 문구로 geometry 결정
- `getBoundingClientRect()` 결과를 별도 정규화 없이 저장

### 9.4 텍스트 크기 조절 정책

요구사항:

- 텍스트 박스 크기를 조절하면 폰트 크기도 비율에 따라 변경한다.
- 관리자와 프로모션 빌더의 결과가 같아야 한다.
- 콘텐츠 문구 길이와 줄바꿈은 폰트 스케일 계산에 영향을 주지 않아야 한다.

권장 계산:

```text
widthScale  = nextDesignWidth / startDesignWidth
heightScale = nextDesignHeight / startDesignHeight

corner handle:
  fontScale = sqrt(widthScale × heightScale)

horizontal edge:
  fontScale = widthScale

vertical edge:
  fontScale = heightScale

nextFontSize = startFontSize × fontScale
```

계산에 사용하는 값은 모두 Editor Document의 디자인 좌표다.

### 9.5 최소값 정책

제품 정책상 별도의 시각적 최소 폰트 크기를 강제하지 않는다. 다만 데이터 무결성을 위한 기술적 범위는 계약에 명시한다.

기존 계약과의 호환 범위:

- `fontSize`: 0~80
- `width`: 0보다 큰 값
- `height`: 0보다 큰 값

장기적으로 단위를 디자인 픽셀로 변경할 경우 구 `widthPct`, `heightPx` 데이터를 변환하는 migration normalizer를 제공한다.

## 10. Host Adapter 설계

### 10.1 공통 인터페이스

```js
export interface EditorHostAdapter {
  getCapabilities(): EditorCapabilities;
  loadDocument(): Promise<EditorDocument>;
  saveDocument(document, context): Promise<SaveResult>;
  publishDocument?(document, context): Promise<PublishResult>;
  runAction?(action, payload): Promise<ActionResult>;
  subscribe?(listener): () => void;
  dispose?(): void;
}
```

### 10.2 Admin Template Adapter

책임:

- `templateId`로 초안 Layout 조회
- Layout revision 충돌 검증
- 초안 저장
- 템플릿 활성화
- 저장된 Layout Identity 반환

사용 API:

```text
GET   /api/wizard-form-template-layout
PATCH /api/wizard-form-template-layout
POST  /api/wizard-form-template-activate
```

Editor Core가 API URL이나 템플릿 활성화 절차를 알지 않게 한다.

### 10.3 Promo Builder Adapter

1차 전환 책임:

- 부모 페이지에서 초기 Editor Document 수신
- Editor 변경 결과를 부모로 전달
- AI Section/Image action을 부모 Host에 요청
- 최신 snapshot revision 검증

2차 전환 책임:

- 프로모션 빌더가 Vue Host로 전환되면 `postMessage` 대신 직접 Store 또는 명시적 props/event Adapter 사용

### 10.4 Output Adapter

책임:

- 저장된 Editor Document를 읽기 전용으로 로드
- 편집 Command 비활성화
- Editor와 동일한 `effectiveLayout` 및 Renderer 사용

### 10.5 Capability

Capability는 UI 모양을 바꾸는 mode 분기가 아니라 명령 실행 권한으로 사용한다.

```js
{
  editContent: true,
  editLayout: true,
  editTemplateDefaults: false,
  saveTemplate: false,
  savePromoOverrides: true,
  publishTemplate: false,
  runSectionAi: true,
  runComponentImageAi: true,
  runMultiLayoutAi: true,
  openWebOutput: true
}
```

Command 실행 전에도 Capability를 검사해야 한다. 버튼 숨김만으로 권한을 처리하지 않는다.

## 11. UI 컴포넌트 구조

### 11.1 `App.vue` 목표 책임

최종 `App.vue`는 다음만 담당한다.

```text
1. Host Adapter 선택
2. Editor Store 생성
3. 공통 EditorWorkspace 렌더링
4. 전역 오류 Boundary
```

관리자 저장, postMessage, AI 요청, geometry 계산을 직접 담당하지 않는다.

### 11.2 `PromoPageRenderer.vue` 목표 책임

- Editor Document 렌더링
- Pointer/Keyboard 입력을 디자인 좌표로 변환
- Command dispatch
- 선택 및 가이드 표현

다음 책임은 제거한다.

- Layout 상태 직접 변경
- Host별 동작 판단
- API 또는 postMessage
- DOM 크기를 기준으로 폰트 크기 계산
- 저장 계약 처리

### 11.3 공통 속성 패널

섹션과 컴포넌트의 속성 변경은 모두 Command를 실행한다.

```text
Property input
  → command creator
  → Editor Core
  → validation
  → next state
  → Renderer
```

Preview 드래그와 속성 패널 숫자 입력이 같은 Command를 사용해야 한다.

## 12. Snapshot 및 저장 계약

### 12.1 단일 Snapshot 생성기

다음 구현을 하나의 공통 계약 모듈로 통합한다.

- `visual-editor/src/layout-utils.mjs`의 Snapshot
- `prototype/wizard/wizard-storage.js`의 Snapshot
- `prototype/create-promo-layout-cache.js`의 Identity normalizer

### 12.2 Snapshot 계약

```js
{
  contractVersion: 3,
  snapshotRevision: 1,
  identity: {},
  document: {},
  dirtyFields: [],
  createdAt: "ISO-8601"
}
```

### 12.3 저장 정책

관리자:

```text
Editor Document
  → Layout 계약 검증
  → Admin Adapter
  → revision 조건부 저장
  → 서버 응답으로 Editor State 확정
```

프로모션 빌더:

```text
Editor Document
  → Layout 계약 검증
  → Promo Adapter
  → 프로모션별 override 저장
  → 부모 Host에 latest revision 통지
```

### 12.4 base와 override

프로모션 빌더에서 저장할 때 `effectiveLayout` 전체를 무조건 저장하지 않는다.

```text
effectiveLayout =
  activeTemplate.baseLayout
  + promoAppearanceOverrides
  + promoUserOverrides
  + approvedAiPatch
```

Editor Core는 현재 편집 문서를 다루고, Host Adapter가 저장 목적에 따라 base 또는 override diff를 생성한다.

## 13. 개발 단계

### 13.1 P0 — 기능 동등성 기준선 및 공통 좌표 엔진

### 목표

텍스트·이미지·일반 컴포넌트의 이동과 리사이즈를 공통 디자인 좌표로 계산한다. 관리자와 프로모션 빌더에서 동일한 조작 결과를 보장한다.

### 작업

1. 현재 편집 Command 결과 fixture 작성
2. 1280 기준 Coordinate System 모듈 추가
3. Pointer 좌표 ↔ Design 좌표 변환 함수 추가
4. Component 기본 geometry normalizer 추가
5. move/resize/font scale 순수 함수 추출
6. `PromoPageRenderer.vue`의 DOM 비율 계산을 Layout Engine 호출로 교체
7. Preview는 계산 결과를 임시 style로 표시하고 pointer end 시 동일 Command 확정
8. 키보드 리사이즈도 같은 resize 함수 사용
9. `fit-content`를 Layout 기본값으로 사용하는 경로 제거
10. 관리자와 프로모션 빌더 기능 동등성 브라우저 테스트 추가

### 필수 단위 테스트

- 같은 시작 geometry와 delta는 Viewport 크기와 관계없이 같은 결과
- 관리자 placeholder와 실제 긴 문구가 같은 geometry 결과
- 새 창, iframe, Desktop Preview에서 같은 결과
- 동쪽, 서쪽, 남쪽, 북쪽, 모서리 핸들별 계산
- fontSize가 0인 상태에서 확대
- 기술적 최소 width/height 근처 축소
- 이미지 비율 잠금과 자유 크기 조절
- Section 최대 높이 자동 확장

### P0 완료 기준

- 동일 fixture + 동일 Command 결과가 관리자와 프로모션 빌더에서 깊은 비교로 일치한다.
- 리사이즈 계산 모듈에 DOM 접근 코드가 없다.
- `getBoundingClientRect()`는 화면 좌표 변환 외 Layout 계산에 사용하지 않는다.
- 기존 Create Promo 브라우저 smoke test가 통과한다.
- Admin → Promo 브라우저 통합 테스트가 통과한다.

### 예상 영향 파일

- `visual-editor/src/PromoPageRenderer.vue`
- `visual-editor/src/promo-renderer.css`
- `visual-editor/src/layout-utils.mjs`
- 신규 `visual-editor/src/platform/layout-engine/*`
- `scripts/test-visual-editor-behavior.mjs`
- `scripts/test-admin-create-promo-browser-integration.mjs`
- `scripts/test-create-promo-browser-smoke.mjs`

### 13.2 P1 — Editor Core와 Command Store 분리

### 목표

`App.vue`와 Renderer가 직접 `designSpec`을 수정하지 않도록 하고 모든 편집 변경을 하나의 Store와 Command 처리기로 통합한다.

### 작업

1. Editor Document normalizer 정의
2. Editor State factory 작성
3. Command type과 command creator 정의
4. 순수 command reducer 작성
5. selection state를 Core로 이동
6. history state와 Undo/Redo 구현
7. section style 변경을 Command로 전환
8. component style 변경을 Command로 전환
9. content 변경을 Command로 전환
10. 다중 정렬 결과를 Command 목록으로 전환
11. AI Layout Patch를 검증된 Command 목록으로 변환
12. 기존 직접 변경 함수 제거

### 전환 순서

```text
Selection
  → Component Move
  → Component Resize
  → Component Style
  → Section Style
  → Content
  → Multi Layout
  → AI Patch
```

한 번에 모두 교체하지 않고 Command 단위로 교체 후 테스트한다.

### P1 완료 기준

- `App.vue`와 속성 패널에서 `designSpec.value = ...` 직접 변경이 제거된다.
- Preview 드래그와 속성 패널 변경이 같은 Command를 사용한다.
- 최소 20단계 Undo/Redo가 가능하다.
- AI Patch도 history에 기록된다.
- Core 단위 테스트가 브라우저 없이 실행된다.

### 13.3 P2 — Host Adapter 분리 및 상태 소유권 정리

### 목표

관리자 API 저장과 프로모션 빌더 postMessage를 Editor App에서 분리한다.

### 작업

1. Adapter 인터페이스 정의
2. Admin Template Adapter 구현
3. Promo Builder Adapter 구현
4. Output Adapter 구현
5. postMessage transport 분리
6. Snapshot revision 처리를 Adapter로 이동
7. `loadAdminLayout()`과 `saveAdminLayout()`을 `App.vue`에서 제거
8. `handleParentMessage()`와 `watch(postMessage)`를 `App.vue`에서 제거
9. Host 초기화 실패와 저장 실패의 공통 오류 모델 정의
10. Adapter mock을 이용한 Editor 통합 테스트 작성

### 상태 소유권

1차:

- iframe이 열린 동안 Editor Store가 편집 상태의 Source of Truth
- 부모는 초기 문서를 전달하고 확정된 변경 Snapshot을 저장
- 부모는 같은 상태를 독립적으로 수정하지 않음

2차:

- Create Promo Vue 전환 후 부모와 편집기가 같은 Store 또는 직접 Adapter를 사용
- postMessage 제거 여부 검토

### P2 완료 기준

- `App.vue`에 API endpoint 문자열이 없다.
- `App.vue`에 Host별 postMessage type 문자열이 없다.
- Admin과 Promo Adapter 테스트가 동일한 Editor Document 계약을 사용한다.
- 오래된 snapshot revision이 최신 상태를 덮어쓰지 못한다.
- 저장 실패 후 편집 상태와 Undo history가 유지된다.

### 13.4 P3 — 공통 UI 컴포넌트와 mode 분기 제거

### 목표

공통 Editor Workspace를 작은 Vue 컴포넌트로 분리하고 mode 조건문 대신 Capability와 Adapter를 사용한다.

### 작업

1. `EditorWorkspace.vue` 추출
2. `SectionPanel.vue` 추출
3. `PreviewPanel.vue` 추출
4. `PropertyPanel.vue` 추출
5. Template 상태 표시와 저장 Action을 Host Slot 또는 Adapter Action으로 분리
6. Capability 기반 Command 활성화 처리
7. `isAdminLayoutMode`, `isWizardLayoutMode`, `isCreatePromoWizardMode` 분기 축소
8. 공통 텍스트와 i18n key 정리
9. Editor UI CSS를 공통 컴포넌트 단위로 정리
10. Web Output이 Editor UI CSS 없이 Renderer CSS만 사용하는지 재검증

### P3 완료 기준

- `App.vue`는 Host 초기화와 Workspace mount 중심의 작은 진입점이 된다.
- 관리자·프로모션 빌더가 동일한 `EditorWorkspace` 마크업을 사용한다.
- Host 차이는 Adapter Action과 Capability로만 표현된다.
- 공통 기능을 추가할 때 Host별 Vue template을 수정하지 않는다.
- Web Output 렌더링이 편집 Preview와 동일하다.

### 13.5 P4 — 개발 플랫폼 점진 통일 및 Legacy 정리

### 목표

새로운 프런트엔드 개발 기준을 Vue 3 + Vite + ESM으로 통일하고 기존 CDN Vue·Vanilla JS 화면을 기능 단위로 점진 전환한다.

### 작업 1: 빌드 경계 정리

- 루트 `package.json`을 단일 빌드 기준으로 유지
- `visual-editor`를 별도 프로젝트가 아닌 동일 저장소의 workspace 영역으로 유지
- 생성 Bundle 직접 수정 금지
- build manifest 또는 해시 기반 asset 정책 검토
- 수동 `?v=...` 버전 증가 의존 축소

### 작업 2: Create Promo 점진 전환

권장 순서:

```text
Template Service
  → Wizard Store
  → Step Navigation
  → Template Selection
  → Editor Host
  → Content Form
```

편집기 Core 전환이 완료되기 전에 Create Promo 전체를 재작성하지 않는다.

### 작업 3: 관리자 점진 전환

권장 순서:

```text
TemplateLayoutManager
  → Component Manager
  → Section Manager
  → Prompt Manager
  → Audit Log
```

대형 `prototype/app.js`에 신규 기능을 계속 추가하지 않고 기능 단위 Vue 컴포넌트와 service로 이동한다.

### 작업 4: Legacy 경로 정리

- `promo-wizard.js`와 Create Promo의 중복 함수 재감사
- 구 Promo Wizard 진입 참조 제거 후 파일 제거 여부 결정
- standalone Visual Editor 메뉴 노출 정책 재확인
- Legacy URL은 redirect 또는 명시적 호환 경로로 관리
- 제거는 별도 커밋으로 진행

### P4 완료 기준

- 신규·변경되는 인터랙티브 프런트엔드 코드는 Vue 3 + Vite + ESM을 사용한다.
- 공통 Editor 기능은 Vanilla JS Host에 복제하지 않는다.
- 관리자와 Create Promo가 공통 API service 및 계약 모듈을 사용한다.
- 사용되지 않는 구 Wizard 경로의 참조 감사 결과가 문서화된다.
- 삭제 대상은 별도 승인과 별도 커밋으로 처리된다.

## 14. 구현 순서와 커밋 전략

권장 커밋 단위:

1. 테스트 fixture 및 동등성 실패 재현
2. 공통 Coordinate System
3. 공통 Resize Engine
4. Renderer의 Resize Engine 적용
5. Editor Document 계약
6. Editor Store와 Selection Command
7. Move/Resize Command 전환
8. Style/Content Command 전환
9. Undo/Redo
10. Admin Adapter
11. Promo Adapter
12. Output Adapter
13. Workspace 컴포넌트 분리
14. mode 분기 축소
15. 플랫폼 빌드 경계 정리
16. Legacy 참조 감사

각 커밋은 다음 조건을 만족해야 한다.

- 한 종류의 책임만 변경
- 전체 테스트 통과
- Visual Editor 소스 변경 시 프로덕션 Bundle 재생성
- `git diff --check` 통과
- 브라우저 동작 변경 시 관련 browser test 포함

## 15. 테스트 전략

### 15.1 단위 테스트

대상:

- coordinate transform
- geometry normalize
- resize
- move
- font scale
- align/distribute
- collision
- command reducer
- inverse command
- snapshot normalize
- layout identity

동일성 핵심 테스트:

```js
deepEqual(
  executeCommand(adminInitialDocument, resizeCommand),
  executeCommand(promoInitialDocument, resizeCommand)
);
```

Host metadata를 제외한 Layout 결과는 동일해야 한다.

### 15.2 컴포넌트 동작 테스트

- Preview drag가 올바른 Command를 dispatch
- 속성 패널 입력이 같은 Command를 dispatch
- locked component는 Command 거부
- Capability가 없는 Action은 실행 거부
- Undo/Redo 후 Renderer 복원

### 15.3 브라우저 통합 테스트

필수 시나리오:

1. 관리자에서 텍스트 컴포넌트 크기 변경
2. 저장 및 활성화
3. 신규 프로모션 빌더에서 같은 기본 Layout 로드
4. 동일한 drag delta 수행
5. 최종 width, height, fontSize 일치 확인
6. Web Output에서 동일 결과 확인

Viewport Matrix:

- 1440
- 1280
- 1024
- 980
- 768
- 680
- 375

Breakpoint 경계값은 인접한 두 값도 포함한다.

### 15.4 회귀 테스트

- Section 배경 이미지
- 배경 정렬
- Fade
- 이미지 contain/cover
- 이미지 비율 잠금/자유 크기 조절
- 다중 선택 AI 정렬
- Section 자동 높이 확장
- 텍스트 인라인 편집과 줄바꿈
- 관리자 초안 저장
- 템플릿 활성화
- Create Promo cache 복원
- 오래된 Layout Identity 무효화
- Web Output 새 창

### 15.5 기본 검증 명령

```bash
npm test
npm run check
npm run build:visual-editor
git diff --check
```

테스트 파일 개수는 문서에 고정하지 않고 실행 로그에 기록한다.

## 16. 데이터 호환 및 Migration

### 16.1 P0~P2 DB Migration

원칙적으로 필요하지 않다.

다음 기존 값을 Editor Document로 정규화한다.

- `widthPct`
- `heightPx`
- `xPct`
- `yPx`
- `fontSize`
- `sectionStyles`

### 16.2 Geometry 계약 전환

권장 단계:

1. 기존 percent/pixel 계약을 읽는다.
2. Editor 진입 시 1280 Design Geometry로 변환한다.
3. 내부에서는 Design Geometry만 사용한다.
4. 저장 시 기존 API 계약으로 역변환한다.
5. 서버 계약 전환이 필요해질 때 별도 migration을 작성한다.

초기 단계에서 DB 값을 일괄 변경하지 않는다.

### 16.3 Snapshot Version

- 기존 Snapshot: 읽기 지원
- 신규 Snapshot: `contractVersion: 3`
- 신규 Editor가 저장하면 version 3으로 승격
- 역변환 불가능한 필드가 생기면 저장 전에 사용자에게 명시
- 원본 Snapshot backup 정책 유지

## 17. 위험 요소와 대응

| 위험 | 영향 | 대응 |
|---|---|---|
| Coordinate 전환 시 기존 Layout 위치 변경 | 기존 템플릿 회귀 | Legacy 변환 fixture와 pixel diff 검증 |
| 상태 Store 전환 중 이중 업데이트 | 변경 중복 또는 Undo 오류 | Command 단위 점진 전환, 직접 수정 탐지 테스트 |
| postMessage 순서 문제 | 최신 변경 유실 | revision/token 강제, Adapter에서 stale message 차단 |
| 관리자 저장 계약 손상 | 활성 템플릿 반영 실패 | Admin Adapter API 통합 테스트 |
| Create Promo cache 계약 손상 | 사용자 작업 복원 실패 | 기존 Snapshot migration fixture 유지 |
| AI Patch가 Core를 우회 | Layout 충돌 및 history 누락 | AI 결과를 Command로만 적용 |
| `App.vue` 분리 중 UI 회귀 | 패널·스크롤·선택 오류 | 컴포넌트 추출 전후 브라우저 screenshot/behavior 검증 |
| 대규모 Vue 전환 | 장기 브랜치와 병합 충돌 | P4 점진 전환, 화면 단위 커밋 |
| Bundle 미재생성 | 배포 코드와 소스 불일치 | build를 완료 Gate로 강제 |

## 18. 롤백 전략

### P0

- Layout Engine 호출만 기존 DOM 계산으로 되돌릴 수 있도록 Adapter 함수를 유지한다.
- 기존 Layout 저장 형식은 변경하지 않는다.

### P1

- Command별 feature flag 또는 전환 상태를 둔다.
- 한 Command에 문제가 생기면 해당 Command만 기존 업데이트 함수로 복원한다.

### P2

- 기존 `loadAdminLayout`, `saveAdminLayout`, postMessage handler를 Adapter 전환 완료 전까지 삭제하지 않는다.
- Adapter가 동일 계약을 통과한 후 기존 경로를 제거한다.

### P3

- Vue 컴포넌트 추출은 마크업 변경과 분리한다.
- 컴포넌트 분리 커밋에서 기능과 CSS를 동시에 재설계하지 않는다.

### P4

- Legacy 파일 제거는 참조 감사와 배포 확인 후 별도 커밋으로 진행한다.
- 관리자 전체 및 Create Promo 전체를 한 번에 교체하지 않는다.

## 19. 관측성과 진단

개발 및 검증 환경에서 다음 정보를 확인할 수 있어야 한다.

```js
{
  engineVersion,
  contractVersion,
  hostAdapter,
  surface,
  templateIdentity,
  layoutRevision,
  commandRevision,
  lastCommandType,
  dirty,
  viewportScale
}
```

운영 사용자에게는 필요한 상태만 표시하고 전체 정보는 진단 로그 또는 개발 패널에서 확인한다.

권장 Editor 이벤트:

```text
editor_loaded
command_executed
command_rejected
history_undo
history_redo
adapter_save_started
adapter_save_completed
adapter_save_failed
snapshot_stale_rejected
layout_validation_failed
```

민감한 사용자 콘텐츠와 이미지 프롬프트 원문은 진단 로그에 그대로 기록하지 않는다.

## 20. 개발 규칙

1. 공통 편집 기능에 Host 이름이 포함된 조건문을 추가하지 않는다.
2. Host 차이는 Adapter 또는 Capability로 표현한다.
3. Renderer에서 API를 호출하지 않는다.
4. Renderer에서 저장소를 직접 접근하지 않는다.
5. DOM 측정값을 영구 Layout 값으로 직접 저장하지 않는다.
6. Layout 변경은 Command를 거친다.
7. AI 결과도 Command와 계약 검증을 거친다.
8. 공통 계약 복제본을 만들지 않는다.
9. 생성된 `visual-editor-assets`를 직접 수정하지 않는다.
10. 구조 변경과 디자인 변경을 같은 커밋에서 진행하지 않는다.

## 21. Definition of Done

### 기능

- [ ] 관리자와 프로모션 빌더에서 같은 텍스트 리사이즈 동작을 한다.
- [ ] 같은 초기 Editor Document와 같은 Command가 같은 Layout 결과를 만든다.
- [ ] Preview 크기와 문구 길이가 결과를 변경하지 않는다.
- [ ] Preview drag와 속성 패널 입력이 같은 Command를 사용한다.
- [ ] Undo/Redo가 관리자와 프로모션 빌더에서 동일하게 동작한다.
- [ ] Web Output이 동일한 Editor Document를 동일 Renderer로 출력한다.

### 구조

- [ ] Editor Store가 편집 상태의 단일 Source of Truth다.
- [ ] Layout Engine은 DOM에 의존하지 않는 순수 모듈이다.
- [ ] Admin, Promo, Output Adapter가 분리돼 있다.
- [ ] `App.vue`에 Host API와 postMessage 상세 구현이 없다.
- [ ] Snapshot 및 Layout 계약이 하나의 공통 모듈에서 관리된다.
- [ ] Host별 mode 분기는 진입점과 Capability 구성으로 제한된다.

### 품질

- [ ] 전체 자동 테스트가 통과한다.
- [ ] 관리자·프로모션 빌더 기능 동등성 브라우저 테스트가 통과한다.
- [ ] Visual Editor 프로덕션 빌드가 성공한다.
- [ ] 소스와 빌드 산출물이 일치한다.
- [ ] `git diff --check`가 통과한다.
- [ ] DB 및 기존 Snapshot 호환 검증이 완료된다.

### 유지보수

- [ ] 공통 기능 변경 시 수정 위치가 Core 또는 공통 UI 한 곳으로 제한된다.
- [ ] 신규 Host를 추가할 때 Editor Core를 수정하지 않고 Adapter를 구현할 수 있다.
- [ ] 관리자 전체 또는 Create Promo 전체의 일괄 재작성 없이 단계별 전환이 가능하다.
- [ ] Legacy 제거 대상과 유지 대상이 문서화돼 있다.

## 22. 착수 전 확인 항목

1. Desktop 디자인 기준 폭을 `1280`으로 확정한다.
2. 내부 Layout geometry를 디자인 픽셀로 사용할지 기존 percent 계약을 Core 내부에서도 유지할지 최종 결정한다.
   - 본 계획은 디자인 픽셀을 권장한다.
3. 텍스트 박스 리사이즈 시 폰트 스케일 공식을 확정한다.
   - 본 계획은 핸들 방향별 비율 적용을 권장한다.
4. 프로모션 편집 상태의 Source of Truth를 iframe Editor Store로 두는 1차 전환안을 승인한다.
5. 기존 Layout 저장 형식은 P0~P2 동안 유지한다.
6. 구 Promo Wizard 파일 제거는 P4 참조 감사 후 별도 승인한다.

## 23. 최종 권고

이 작업은 편집기 UI를 다시 꾸미는 작업이 아니다. 편집 기능의 계산 기준과 상태 소유권을 하나로 만드는 구조 개선이다.

우선 P0에서 텍스트 리사이즈 차이를 공통 좌표 엔진으로 해결하고 기능 동등성 테스트를 고정해야 한다. 그 다음 P1에서 Editor Core와 Command Store를 분리하고, P2에서 관리자와 프로모션 빌더의 저장 방식을 Host Adapter로 이동한다. P3에서 UI 컴포넌트를 정리한 뒤 P4에서 관리자와 프로모션 빌더의 개발 플랫폼을 Vue 3 + Vite 기준으로 점진 통일한다.

핵심 완료 조건은 다음 한 문장으로 요약한다.

> 동일한 Editor Document에 동일한 Command를 실행하면 실행 화면, Host, Viewport와 관계없이 동일한 Layout 결과가 생성되어야 한다.
