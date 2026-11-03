# 프런트엔드 플랫폼 단일화·공통 모듈화 개발계획서

## 0. 문서 정보

- 작성일: 2026-07-24
- 개정일: 2026-07-24
- 대상 프로젝트: `promo_web_builder`
- 문서 상태: 구현 전 개발계획 / 소스코드 미반영
- 문서 역할: 프런트엔드 플랫폼 전환 Master Plan
- 표준 플랫폼: Vue 3 + Vite + ESM
- 관련 문서:
  - `docs/계획/common-editor-platform-and-layout-engine-development-plan-2026-07-24.md`
  - `docs/계획/admin-promo-layout-editor-unification-development-plan-2026-07-24.md`
  - `docs/계획/css-component-architecture-and-page-style-separation-development-plan-2026-07-22.md`
  - `docs/계획/source-code-cleanup-and-consolidation-development-plan-2026-07-21.md`
  - `docs/자료/information-architecture-as-is-2026-07-21.md`
  - `docs/자료/legacy-route-reference-audit-2026-07-24.md`
  - `docs/기획/promo-web-builder-product-plan-2026-07-23.md`
  - `docs/정책/promo-web-builder-policies-2026-07-23.md`
  - `docs/정책/source/collaboration-protocol-2026-07-21.md`

### 0.1 이번 개정의 핵심

기존 계획의 장점은 유지한다.

- Vue 3 + Vite 표준화
- 빅뱅 전환 금지
- 공통 UI 컴포넌트 제공
- Create Promo와 Promo Wizard 중복 제거
- 공통 API Client와 계약 모듈
- 시각 회귀 및 Playwright 검증
- Legacy 제거 전 참조 감사

다음 문제는 보완했다.

1. 현재 핵심 이슈인 관리자 편집기와 프로모션 빌더의 기능·동작 불일치를 최우선 단계로 이동했다.
2. Editor Core, Command Store, 공통 Layout Engine, Host Adapter를 목표 아키텍처에 포함했다.
3. 현재 이미 단일화된 프로모션 Renderer 상태를 정확히 반영했다.
4. 신규 `frontend/` 빌드 루트를 즉시 추가하지 않고 기존 `visual-editor` Vite 환경을 전환의 출발점으로 확정했다.
5. `shared-shell.js`의 전환기 역할과 최종 Vue App Shell의 역할을 분리했다.
6. Create Promo “재작성”을 기능 단위 점진 전환으로 변경했다.
7. TypeScript 도입을 이번 구조개선의 필수조건에서 제외하고 별도 승인 항목으로 이동했다.
8. DB 기반 i18n Runtime을 유지하도록 공통 i18n 모듈의 책임을 명확히 했다.
9. Phase별 완료 기준, 데이터 호환, 롤백, 관측성 기준을 추가했다.

## 1. 목적과 배경

현재 프런트엔드는 여러 사용자 화면과 관리 화면이 서로 다른 기술 방식으로 구현돼 있다.

- 설정: CDN Vue 3 기반 대형 단일 애플리케이션
- 프로모션 빌더: Vanilla JavaScript
- 구 Promo Wizard: Vanilla JavaScript
- Visual Editor / Web Output: Vue 3 + Vite
- 랜딩 및 일부 호환 화면: 정적 HTML

CSS 토큰, 공통 Shell, 일부 Wizard 모듈과 Renderer는 공유되고 있지만 상태 관리, 편집 명령, 폼 렌더링, API 호출, 저장·복원 로직은 화면별로 분산돼 있다.

그 결과 다음 문제가 발생한다.

1. 같은 기능을 여러 파일에서 수정해야 한다.
2. 같은 UI라도 화면마다 동작이 달라진다.
3. 관리자와 프로모션 빌더가 같은 Visual Editor 번들을 사용해도 리사이즈 결과가 다르다.
4. Create Promo와 Promo Wizard의 콘텐츠·섹션·필드 로직이 중복된다.
5. 관리자 기능이 하나의 대형 Vue 인스턴스에 계속 누적된다.
6. 테스트가 화면별 동작 동일성을 직접 보장하지 못한다.

이 계획의 목적은 단순히 프레임워크 이름을 Vue로 맞추는 것이 아니다.

> 공통 기능을 하나의 상태 모델, 하나의 Command, 하나의 Layout Engine, 하나의 UI 컴포넌트에서 관리하고 화면별 차이는 Host Adapter와 Capability로 제한한다.

## 2. 핵심 성공 기준

### 2.1 편집 기능

```text
동일한 Editor Document
+ 동일한 Command
= Host, Viewport, 문구 길이와 관계없이 동일한 Layout 결과
```

### 2.2 공통 UI

```text
동일한 Button/Panel/Field/Modal
+ 동일한 props·slot·event 계약
= 화면별 마크업과 동작 재작성 제거
```

### 2.3 도메인 로직

```text
Template/Section/Component/Wizard 계약
+ 공통 API Client
+ 공통 Validation
= Create, Admin, Editor의 계약 Drift 방지
```

### 2.4 플랫폼

```text
Vue 3 + Vite + ESM
+ 기능 단위 점진 전환
+ 단계별 회귀 Gate
= 운영을 중단하지 않는 단일 플랫폼 수렴
```

## 3. 범위

### 3.1 구현 대상

- 프런트엔드 표준 플랫폼을 Vue 3 + Vite + ESM으로 확정한다.
- 관리자 레이아웃 편집기와 프로모션 빌더 Live Preview의 Editor Core를 단일화한다.
- 이동·리사이즈·정렬·다중 선택·Undo/Redo를 공통 Command로 처리한다.
- Layout 계산을 1280 기준 공통 디자인 좌표계로 통일한다.
- Admin, Promo Builder, Output의 저장·외부 연동을 Host Adapter로 분리한다.
- 공통 UI를 CSS 클래스뿐 아니라 Vue 컴포넌트로 제공한다.
- 프로모션 Preview와 Web Output은 현재의 `PromoPageRenderer.vue`를 계속 단일 Renderer로 사용한다.
- Create Promo와 Promo Wizard의 콘텐츠·섹션·필드·저장·복원 중복을 공통 도메인 모듈로 흡수한다.
- Create Promo, 관리자 순서로 기능 단위 Vue 전환을 진행한다.
- 최종 Vue App Shell을 구축하고 전환기 `shared-shell.js`를 단계적으로 대체한다.
- 화면별 직접 `fetch()` 호출을 공통 API Client와 Service로 이동한다.
- DB 기반 i18n Snapshot Runtime을 공통 모듈로 이관한다.
- 각 단계에서 계약·동작·시각·브라우저 회귀를 검증한다.

### 3.2 제외 범위

- 한 커밋 또는 한 릴리스로 전체 화면을 재작성하지 않는다.
- 별도 저장소 또는 별도 Vercel 프로젝트를 생성하지 않는다.
- 신규 `frontend/` 빌드 루트를 초기 단계에 추가하지 않는다.
- 관리자 전체를 한 번에 Vue SFC로 다시 작성하지 않는다.
- Create Promo 전체를 한 번에 다시 작성하지 않는다.
- 기존 활성 템플릿과 프로모션 데이터를 초기화하지 않는다.
- 백엔드 API 계약을 프런트엔드 편의를 위해 임의로 변경하지 않는다.
- AI가 Editor Core를 우회하여 DOM, 자유 CSS 또는 자유 HTML을 직접 수정하지 않는다.
- TypeScript를 별도 검토 없이 필수 도구로 도입하지 않는다.
- Legacy URL과 파일을 참조 감사 없이 삭제하지 않는다.

## 4. 현재 구현 인벤토리

### 4.1 화면별 기술 스택

| 화면 | 주요 파일 | 현재 기술 | 대략적 규모 |
|---|---|---|---:|
| 랜딩 | `index.html` | 정적 HTML | 별도 |
| 설정 | `prototype/index.html`, `prototype/app.js` | CDN Vue 3 | `app.js` 약 255KB / 5,900줄 |
| 프로모션 빌더 | `prototype/create-promo.html`, `prototype/create-promo.js` | Vanilla JS | 약 93KB / 2,100줄 |
| 구 Promo Wizard | `prototype/promo-wizard.html`, `prototype/promo-wizard.js` | Vanilla JS | 약 95KB / 2,200줄 |
| Visual Editor | `visual-editor/src/*` | Vue 3 + Vite | `App.vue` 약 1,500줄 |
| Web Output | Visual Editor 번들 | Vue 3 + Vite | 동일 Renderer |

정확한 줄 수와 테스트 파일 수는 Phase 0 실행 로그에 기록하며 문서의 고정 완료 기준으로 사용하지 않는다.

### 4.2 현재 공유된 자산

- 내비게이션과 호환 Shell: `prototype/shared-shell.js`
- 디자인 토큰: `prototype/design-tokens.css`
- 공통 Shell CSS: `prototype/app-shell.css`
- 공통 컴포넌트 CSS: `prototype/app-components.css`
- i18n Runtime: `prototype/i18n-runtime.js`
- Wizard 순수 Helper: `prototype/wizard/wizard-core.js`
- Wizard Content Helper: `prototype/wizard/wizard-content.js`
- Wizard Storage Helper: `prototype/wizard/wizard-storage.js`
- 프로모션 Renderer: `visual-editor/src/PromoPageRenderer.vue`
- Layout normalize/validate: `visual-editor/src/layout-utils.mjs`
- 공통 Snapshot 계약 일부: `visual-editor/src/contracts.js`

### 4.3 Create Promo와 Promo Wizard 중복

동일한 이름으로 중복된 함수가 다수 존재한다.

- `createField`
- `createContentSection`
- `createSectionField`
- `renderContentStep`
- `saveWizardContent`
- `loadWizardContent`
- `loadWizardSectionDefinitions`
- `validateContentStep`
- `wizardLayoutSnapshot`
- `reorderTemplateSection`
- Section Drag/Drop
- Template 선택 및 복원

일부 순수 함수는 이미 `prototype/wizard/`로 추출됐지만 DOM 조립, 폼 상태, 서비스 호출, 화면 흐름은 두 파일에 남아 있다.

### 4.4 Renderer 현황

프로모션 Preview와 Web Output의 실제 프로모션 Renderer는 현재 `PromoPageRenderer.vue` 한 벌이다.

- Create Promo는 `visual-editor.html?mode=wizard-layout&source=create-promo` iframe을 사용한다.
- Promo Wizard는 `visual-editor.html?mode=wizard-layout` iframe을 사용한다.
- Web Output은 같은 Visual Editor 번들과 Renderer를 읽기 전용으로 사용한다.

따라서 이 계획에서는 “Renderer 3벌을 1벌로 줄인다”가 아니라 다음을 목표로 한다.

1. 이미 단일화된 Renderer를 유지한다.
2. Renderer 내부의 편집 계산과 Host 의존성을 Editor Core와 Layout Engine으로 분리한다.
3. Create Promo와 Promo Wizard에 남아 있는 콘텐츠 입력 폼 렌더링 중복을 공통 UI·도메인 모듈로 흡수한다.

### 4.5 편집기 동작 Drift

관리자와 프로모션 빌더는 같은 Visual Editor 번들을 사용하지만 서로 다른 방식으로 초기 상태를 만든다.

관리자:

```text
API 조회
→ App.vue가 Editor 상태 생성
→ API 저장·활성화
```

프로모션 빌더:

```text
부모 Create Promo 상태
→ postMessage Snapshot
→ App.vue가 별도 Editor 상태 생성
→ 변경 결과를 postMessage
→ 부모 상태에 다시 병합
```

텍스트 리사이즈는 현재 실제 DOM 너비, 높이, 계산된 폰트 크기와 문구 줄바꿈 결과를 기준으로 계산한다. 따라서 새 창과 iframe, 관리자 placeholder와 실제 프로모션 문구에서 동일한 드래그가 다른 결과를 만든다.

이 문제는 프레임워크 통일만으로 해결되지 않으며 공통 Editor Core와 디자인 좌표 엔진이 필요하다.

## 5. 계획 문서 계층

이 문서는 전체 프런트엔드 전환의 Master Plan이다.

```text
프런트엔드 플랫폼 단일화 Master Plan
├─ 공통 편집 플랫폼 및 Layout Engine 단일화
│  ├─ Editor Core
│  ├─ Command Store
│  ├─ Design Coordinate System
│  └─ Host Adapter
├─ 공통 UI 컴포넌트 전환
├─ Create Promo Vue 점진 전환
├─ Promo Wizard 통합
├─ 관리자 Vue 점진 전환
├─ CSS·App Shell 전환
└─ Legacy 참조 감사 및 제거
```

편집기 내부 설계와 세부 Command 계약은 다음 하위 계획을 따른다.

`docs/계획/common-editor-platform-and-layout-engine-development-plan-2026-07-24.md`

기존 관리자 Layout 저장·활성화·프로모션 반영 정책은 다음 계획을 유지한다.

`docs/계획/admin-promo-layout-editor-unification-development-plan-2026-07-24.md`

계획 간 충돌이 발생하면 우선순위는 다음과 같다.

1. 정책 문서와 실제 운영 계약
2. 본 Master Plan의 단계와 책임 경계
3. 기능별 하위 계획의 상세 구현
4. 과거 구현 계획의 완료 기록

## 6. 목표 아키텍처

### 6.1 전체 구조

```text
[Vue App Shell]
  ├─ Global Navigation
  ├─ Route/Workspace
  ├─ Locale/Theme
  └─ Error Boundary
          │
          ▼
[Screen Hosts]
  ├─ Create Promo
  ├─ Admin
  ├─ Editor
  └─ Output
          │
          ├─────────────────────────────────┐
          ▼                                 ▼
[Shared UI Components]              [Shared Domain]
  Button / Panel / Field               API Client
  Card / Modal / Table                 Template Service
  Wizard Step / Status                 Section Service
                                      Validation / i18n
          │                                 │
          └──────────────┬──────────────────┘
                         ▼
                [Common Editor Platform]
                  Editor Core
                  Command Store
                  Layout Engine
                  Host Adapters
                         │
                         ▼
                [PromoPageRenderer]
                  Preview / Output
```

### 6.2 플랫폼 기준

- Vue 3 Composition API
- Vite
- ESM
- JavaScript `.js` / `.mjs`를 초기 표준으로 사용
- CSS Custom Properties와 기존 디자인 토큰 유지
- Playwright 기반 브라우저 검증
- Node 기반 순수 모듈 단위 테스트

TypeScript는 다음 조건이 충족될 때 별도 결정한다.

- 타입 검사 명령과 CI Gate 정의
- `tsconfig` 경계 확정
- 기존 CommonJS API와의 계약 공유 방식 확정
- 점진 도입 대상과 완료 기준 합의

이번 구조개선의 선행조건으로 TypeScript를 강제하지 않는다.

### 6.3 전환 출발점

기존 `visual-editor` Vite 환경을 공통 플랫폼의 출발점으로 사용한다.

초기 목표 구조:

```text
visual-editor/src/
├─ platform/
│  ├─ editor-core/
│  ├─ layout-engine/
│  ├─ contracts/
│  └─ adapters/
├─ components/
│  ├─ editor/
│  └─ ui/
├─ services/
├─ composables/
├─ PromoPageRenderer.vue
└─ App.vue
```

Create Promo와 관리자 전환이 진행돼 Visual Editor 외 화면도 Vite 번들로 운영할 수 있게 된 후 다음 중 하나를 결정한다.

1. `visual-editor`를 `frontend`로 승격·이동
2. 루트 Vite 멀티 엔트리로 전환
3. 현재 디렉터리를 유지하고 화면 Entry만 추가

Phase 0에 빈 `frontend/` 프로젝트를 추가하지 않는다.

### 6.4 단일 App Shell 정책

전환기:

- 기존 정적/CDN/Vanilla 화면은 `shared-shell.js`를 사용한다.
- 신규 Vite 화면은 Vue `AppShell.vue`를 사용한다.
- 내비게이션 정의는 공통 데이터 모듈 또는 동일 JSON 계약을 사용한다.

최종:

- 모든 주요 화면이 Vue App Shell을 사용한다.
- `shared-shell.js`는 Legacy 호환 참조가 없을 때 제거한다.

`shared-shell.js`를 최종 Vue App Shell로 계속 확장하지 않는다.

## 7. 공통 편집 플랫폼

### 7.1 Editor Document

관리자, 프로모션 빌더, Output은 같은 Editor Document 계약을 사용한다.

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

### 7.2 Editor Core

Editor Core가 소유하는 상태:

- 현재 Editor Document
- Section/Component 선택
- 다중 선택
- Viewport와 디자인 Scale
- Undo/Redo History
- Dirty/Saving/Error 상태
- Command revision

### 7.3 Command

모든 편집 변경은 공통 Command로 처리한다.

- Section 선택·리사이즈·스타일
- Component 선택·이동·리사이즈·스타일
- Content 변경
- 다중 정렬·분배·Stack
- AI Layout Patch 적용
- Undo/Redo

Preview 드래그와 속성 패널 입력은 같은 Command를 사용한다.

### 7.4 공통 디자인 좌표계

- Desktop 기준 콘텐츠 폭: 1280
- 이동과 크기: 디자인 좌표
- 현재 Preview 폭은 표시 Scale 계산에만 사용
- DOM 측정값은 Pointer 좌표 변환에만 사용
- 문구 길이와 줄바꿈 결과는 폰트 Scale 계산 기준으로 사용하지 않음

```text
scale = renderedCanvasWidth / 1280
designDelta = screenDelta / scale
```

동일한 초기 geometry와 drag delta는 관리자, 프로모션 빌더, 테스트 환경에서 같은 Layout 결과를 생성해야 한다.

### 7.5 Host Adapter

```text
Admin Template Adapter
  → Layout 조회
  → 초안 저장
  → 템플릿 활성화

Promo Builder Adapter
  → 초기 Snapshot 수신
  → Promo Override 저장
  → AI Action 요청

Output Adapter
  → Editor Document 읽기 전용 로드
```

Host별 차이는 저장, 권한, AI 실행, 외부 이벤트로 제한한다.

## 8. 공통 UI 컴포넌트

### 8.1 목표

`app-components.css`의 시각 클래스만 공유하는 수준에서 다음 단계로 전환한다.

```text
공통 Vue Component
  + props
  + slots
  + emits
  + accessibility
  + token-based style
```

### 8.2 우선 컴포넌트

- `AppButton`
- `AppIconButton`
- `AppPanel`
- `AppField`
- `AppSelect`
- `AppTextarea`
- `AppCard`
- `AppAccordion`
- `AppModal`
- `AppTable`
- `AppStatus`
- `AppToggle`
- `WizardStep`
- `WizardProgress`

### 8.3 스타일 정책

금지:

- 페이지 CSS에서 컴포넌트 내부 selector 덮어쓰기
- 색상·간격·Radius의 임의 리터럴 추가
- 동일 컴포넌트 마크업 화면별 복제

허용:

- 공식 `variant` props
- slot
- 컴포넌트가 제공하는 CSS Custom Property
- 페이지 Layout의 grid placement, width, height
- 접근성 또는 반응형 배치를 위한 명시적 Wrapper

필요한 변형은 페이지 override가 아니라 공통 컴포넌트 API로 승격한다.

### 8.4 파일럿 적용

Editor Core 안정화 후 다음 순서로 파일럿 적용한다.

1. Visual Editor 내부 Button/Panel/Status
2. 관리자 `TemplateLayoutManager`
3. Create Promo Step Navigation

공통 UI 컴포넌트 구축을 Editor Core보다 먼저 진행하지 않는다.

## 9. 공통 도메인 모듈

### 9.1 Wizard Domain

공통화 대상:

- Template 목록·선택
- Section Definition 조회·정규화
- Content 기본값
- Field 값 읽기·쓰기
- 필수값 검증
- Section 순서
- Layout Snapshot
- localStorage migration
- 작업 복원

DOM 생성 함수와 도메인 함수를 분리한다.

```text
Domain
  → 데이터와 검증

Vue Component
  → 마크업과 사용자 입력

Host
  → 저장 위치와 화면 흐름
```

### 9.2 API Client

화면별 직접 `fetch()`를 다음 구조로 이동한다.

```text
api-client
├─ request()
├─ response/error normalize
├─ cache policy
└─ abort/timeout

services
├─ template-service
├─ section-service
├─ component-service
├─ layout-service
├─ locale-service
└─ prompt-service
```

공통 API Client는 백엔드 계약을 임의로 변경하거나 숨기지 않는다. HTTP status, error code, message를 표준 오류 객체로 변환한다.

### 9.3 계약 모듈

공통화 대상:

- Layout Spec
- Layout Identity
- Editor Document
- Snapshot
- Template/Section/Component DTO
- Locale Snapshot

브라우저와 Node 테스트가 같은 normalize/validate 모듈을 사용해야 한다.

백엔드 CommonJS 계약을 프런트엔드 ESM 파일로 단순 복사하지 않는다. 공통 스키마를 공유할 수 없는 경우 계약 fixture와 상호 테스트로 Drift를 차단한다.

### 9.4 i18n

i18n 공통 모듈의 책임:

- DB Locale Snapshot 로드
- locale 선택
- 메시지 조회와 format
- fallback
- Snapshot 갱신과 구독
- 로드 실패 처리

관리자 문구 원본을 정적 키 파일로 되돌리지 않는다. DB 기반 활성 메시지가 Source of Truth라는 현재 정책을 유지한다.

## 10. 화면별 전환 전략

### 10.1 Visual Editor / Web Output

현재:

- Vue 3 + Vite
- 단일 Renderer
- 관리자와 Create Promo mode 분기
- App.vue에 편집·저장·AI·Host 책임 혼재

목표:

- 공통 Editor Core의 기준 구현
- Layout Engine 분리
- Host Adapter 분리
- 작은 Vue 컴포넌트로 UI 분리
- Web Output은 Renderer와 Output Adapter만 사용

### 10.2 Create Promo

현재:

- Vanilla JavaScript
- Template, Content, Storage, AI, iframe Host 책임 혼재

점진 전환 순서:

1. 공통 Template/Layout Service 사용
2. Wizard Store 사용
3. Step Navigation Vue 전환
4. Template Selection Vue 전환
5. Editor Host Vue 전환
6. Content Form Vue 전환
7. 기존 DOM 조립 함수 제거

각 단계는 기존 URL과 저장 데이터를 유지한다.

### 10.3 Promo Wizard

현재 제품 IA에서 독립 사용 필요성이 낮고 Create Promo와 중복이 크다.

정책:

1. 먼저 URL, 테스트, 문서, 메뉴, 복구 경로 참조를 감사한다.
2. Create Promo로 대체 가능한 기능과 독립 기능을 분류한다.
3. 독립 기능은 Create Promo 또는 공통 Domain으로 이동한다.
4. 구 URL에는 redirect 또는 호환 안내를 제공한다.
5. 운영 참조가 없을 때 별도 승인·별도 커밋으로 파일을 제거한다.

### 10.4 관리자

현재:

- CDN Vue
- 대형 단일 `app.js`
- 일부 기능만 별도 컴포넌트·service 분리

점진 전환 순서:

1. `TemplateLayoutManager`
2. Component Manager
3. Section Manager
4. Prompt Manager
5. Locale Manager
6. Audit Log
7. 나머지 관리 화면

한 기능을 Vue SFC + Service로 전환하고 검증한 후 다음 기능으로 이동한다.

### 10.5 랜딩

초기에는 정적 HTML을 유지할 수 있다.

최종 Vue App Shell과 라우팅이 안정된 후 다음을 결정한다.

- Vue App의 Home route로 흡수
- 정적 redirect로 축소
- 별도 진입 허브 유지

랜딩 전환은 핵심 편집 기능보다 우선하지 않는다.

## 11. 단계별 개발 계획

### Phase 0 — 기능 동등성 기준선과 공통 좌표 엔진

목표:

- 현재 텍스트 리사이즈 차이를 재현하고 동일 결과 계약을 고정한다.
- 공통 디자인 좌표와 Resize/Move 순수 함수를 도입한다.

작업:

1. 관리자·Create Promo 동일 fixture 작성
2. 현재 동작 차이를 재현하는 실패 테스트 작성
3. 1280 디자인 좌표 변환 함수 구현
4. Component 기본 geometry 정규화
5. Move/Resize/Font Scale 순수 함수 구현
6. Pointer와 Keyboard 리사이즈를 공통 함수로 전환
7. DOM과 `fit-content`를 계산 기준에서 제거
8. 관리자·Create Promo 동등성 브라우저 테스트 추가

완료 기준:

- 같은 시작 geometry와 Command는 Viewport와 문구에 관계없이 같은 결과를 생성한다.
- Layout 계산 순수 함수에 DOM 접근이 없다.
- 기존 Editor, Create Promo, Admin 통합 테스트가 통과한다.

상세 기준:

`docs/계획/common-editor-platform-and-layout-engine-development-plan-2026-07-24.md`

### Phase 1 — Editor Core와 Command Store

목표:

- 편집 상태의 단일 Source of Truth를 구축한다.

작업:

1. Editor Document 계약
2. Editor State factory
3. Command type과 reducer
4. Selection과 Multi-selection
5. Move/Resize/Style/Content Command
6. Undo/Redo
7. AI Layout Patch의 Command 변환
8. App.vue와 Renderer의 직접 상태 변경 제거

완료 기준:

- Preview와 Property Panel이 같은 Command를 사용한다.
- 모든 Layout 변경이 History에 기록된다.
- Editor Core를 브라우저 없이 단위 테스트할 수 있다.

### Phase 2 — Host Adapter와 Snapshot 계약

목표:

- 관리자와 프로모션 빌더의 차이를 저장·권한·외부 연동으로 제한한다.

작업:

1. Admin Template Adapter
2. Promo Builder Adapter
3. Output Adapter
4. postMessage Transport
5. Snapshot revision 보호
6. Layout/Snapshot/Identity 계약 통합
7. 저장 실패와 충돌 오류 모델 통합

완료 기준:

- App.vue에 Host API endpoint와 postMessage 상세 구현이 없다.
- 오래된 Snapshot이 최신 상태를 덮어쓰지 못한다.
- 저장 실패 후 Editor State와 History가 유지된다.

### Phase 3 — 공통 UI 컴포넌트와 Editor UI 분리

목표:

- CSS 모양 공유를 Vue 컴포넌트·동작 계약 공유로 확장한다.

작업:

1. 기본 UI 컴포넌트 구축
2. 접근성·Keyboard 계약
3. EditorWorkspace 분리
4. SectionPanel 분리
5. PreviewPanel 분리
6. PropertyPanel 분리
7. Visual Editor 파일럿 적용
8. 관리자 TemplateLayoutManager 파일럿 적용

완료 기준:

- 공통 컴포넌트가 props/slots/emits 문서를 가진다.
- 페이지 내부 CSS override 없이 필요한 변형을 표현한다.
- App.vue가 Host 초기화와 Workspace 조립 중심으로 축소된다.

### Phase 4 — 공통 도메인과 Create Promo 점진 Vue 전환

목표:

- Create Promo와 Promo Wizard의 중복 도메인을 흡수하고 Create Promo를 기능 단위로 Vue 전환한다.

작업:

1. Wizard Domain 순수 함수 추출
2. 공통 API Client·Service
3. Storage/Snapshot Migration 통합
4. Create Promo Step Navigation 전환
5. Template Selection 전환
6. Editor Host 전환
7. Content Form 전환
8. 전환 완료 기능의 Vanilla DOM 조립 제거

완료 기준:

- 전환된 기능에는 Vanilla 구현 복제본이 없다.
- 기존 localStorage와 작업 복원이 유지된다.
- Create Promo 전체 브라우저 smoke가 통과한다.

### Phase 5 — Promo Wizard 통합

목표:

- 중복 제품 흐름을 Create Promo로 수렴한다.

작업:

1. Legacy 참조 감사 갱신
2. 독립 기능 분류
3. 필요한 기능 이전
4. redirect와 호환 기간 적용
5. 운영 참조 제거 확인
6. 별도 승인 후 Legacy 파일 제거

완료 기준:

- 기존 사용자 진입 경로가 끊기지 않는다.
- Create Promo가 필요한 기능을 모두 제공한다.
- 제거 파일과 복구 방법이 Handoff에 기록된다.

### Phase 6 — 관리자 Vite 전환과 App Shell·CSS 정리

목표:

- 관리자 CDN Vue를 기능 단위 Vue 3 + Vite 구조로 흡수한다.

작업:

1. 관리 기능별 Vue SFC·Service 전환
2. Vue App Shell 적용
3. 공통 Navigation 정의 사용
4. 관리자 `styles.css` 기능별 분해
5. 공통 UI 컴포넌트 적용
6. DB i18n Runtime 통합
7. CDN Vue 제거
8. `shared-shell.js` 최종 참조 감사

완료 기준:

- 관리자 핵심 기능이 Vite 번들에서 실행된다.
- CDN Vue 의존이 없다.
- 공통 App Shell을 사용한다.
- 페이지 CSS가 공통 컴포넌트 내부를 덮어쓰지 않는다.

### Phase 7 — 최종 플랫폼 정리

목표:

- 전환기 구조와 생성물 관리 정책을 정리한다.

작업:

1. Vite 최종 Entry와 디렉터리 구조 확정
2. `visual-editor` 디렉터리 승격·유지 여부 결정
3. Bundle manifest와 cache busting 정책
4. 구 HTML/JS/CSS 참조 제거
5. 문서와 Handoff 경로 갱신
6. 운영 배포·rollback runbook 확정

완료 기준:

- 주요 인터랙티브 화면이 Vue 3 + Vite + ESM으로 수렴한다.
- 전환기 전역 Script와 중복 번들이 제거된다.
- 소스와 배포 Bundle의 생성 경로가 명확하다.

## 12. 데이터·계약 호환

### 12.1 원칙

- Phase 0~2에서 DB Migration을 기본 전제로 두지 않는다.
- 기존 Layout, Template, Section, Component 데이터를 유지한다.
- 기존 Snapshot을 읽을 수 있어야 한다.
- 신규 저장부터 새 contract version으로 승격할 수 있다.
- 서버 계약 변경이 필요하면 별도 계획·승인·Migration으로 분리한다.

### 12.2 Layout

기존:

- `xPct`
- `yPx`
- `widthPct`
- `heightPx`
- `fontSize`

전환:

1. 기존 값을 Editor Document로 normalize
2. 내부 Design Coordinate로 계산
3. 기존 API 저장 계약으로 serialize
4. 서버 계약 전환은 별도 승인

### 12.3 i18n

- DB 활성 메시지가 Source of Truth
- 기존 Snapshot API 유지
- 전환된 Vue 화면도 같은 Locale Snapshot 사용
- 정적 fallback은 장애 대응에만 사용

### 12.4 Legacy Storage

- Create Promo localStorage key 유지
- Schema version 검사
- Migration 전 원본 backup
- 변환 실패 시 콘텐츠 보존, Layout만 안전한 기본값으로 복원

## 13. 테스트 전략

### 13.1 테스트 계층

| 계층 | 대상 |
|---|---|
| Pure Unit | Coordinate, Geometry, Command, Validation, Snapshot |
| Component | UI props/slots/emits, 접근성, Command dispatch |
| Contract | API DTO, Layout Identity, Locale Snapshot |
| Browser Integration | Admin → Activate → Create → Editor → Output |
| Visual Regression | 공통 UI, Preview, Output, 반응형 |
| Build | Vite Bundle, 정적 asset, source/build 일치 |

### 13.2 편집 동등성

필수 검증:

```text
같은 fixture
+ 같은 resize/move/align Command
= 관리자와 Create Promo의 같은 Layout 결과
```

비교 값:

- x/y
- width/height
- fontSize
- Section height
- zIndex
- background style
- History revision

### 13.3 주요 브라우저 흐름

1. 관리자 초안 Layout 수정
2. 저장 및 활성화
3. 프로모션 빌더에서 활성 Layout 로드
4. 텍스트·이미지 이동과 리사이즈
5. 다중 선택 정렬
6. Section AI 및 Component 이미지 AI
7. 작업 저장·새로고침·복원
8. Web Output 새 창
9. Preview와 Output 비교

### 13.4 Viewport

- 1440
- 1280
- 1024
- 1023
- 980
- 768
- 680
- 375

정규 Viewport와 breakpoint 경계값을 함께 검증한다.

### 13.5 기본 검증 명령

```bash
npm test
npm run check
npm run build:visual-editor
git diff --check
```

최종 멀티 엔트리 Vite 구조가 확정되면 build 명령을 갱신한다.

## 14. 리스크와 완화

| 리스크 | 영향 | 완화 |
|---|---|---|
| 프레임워크만 통일하고 동작 Drift 유지 | 유지보수 문제 지속 | Phase 0~2 Editor Core 우선 |
| 신규 `frontend/`와 기존 Vite 병존 | 빌드·의존성 중복 | 기존 `visual-editor`를 출발점으로 사용 |
| 좌표계 전환으로 기존 Layout 변화 | 활성 템플릿 회귀 | Legacy fixture·동등성 테스트·기존 serialize 유지 |
| 부모와 iframe 상태 중복 | 최신 변경 유실 | Editor Store Source of Truth, revision 보호 |
| App Shell 이중 구현 장기화 | 메뉴·권한 Drift | 전환기/최종 Shell 역할 구분, 공통 Nav 데이터 |
| Create Promo 일괄 재작성 | 장기 브랜치·회귀 | 기능 단위 Strangler 전환 |
| 관리자 일괄 전환 | 운영 설정 기능 장애 | Manager 단위 전환 |
| API Client가 서버 오류를 숨김 | 진단 어려움 | status/code/message 보존 |
| i18n 정적 파일 회귀 | DB 문구 미반영 | DB Snapshot Source of Truth 유지 |
| UI 컴포넌트가 지나치게 경직됨 | 페이지별 우회 CSS 증가 | variant/slot/custom property 제공 |
| Legacy 조기 삭제 | 복구·내부 경로 단절 | 참조 감사와 별도 승인 |
| Bundle 미생성 | 소스와 배포 불일치 | build를 Phase Gate로 강제 |

## 15. 롤백 전략

### Phase 0~2

- 기존 저장 형식을 유지한다.
- Layout Engine과 Adapter는 교체 지점을 명시해 기존 구현으로 복원할 수 있게 한다.
- Command 단위로 전환하여 문제가 있는 Command만 복구한다.

### Phase 3

- 컴포넌트 추출과 디자인 변경을 분리한다.
- 기존 마크업을 삭제하기 전에 새 컴포넌트 동등성 테스트를 통과한다.

### Phase 4

- Create Promo 기능별로 Legacy와 신규 구현의 활성 경계를 분리한다.
- 저장 key와 URL은 유지한다.
- 전환 완료 기능만 Legacy 코드를 제거한다.

### Phase 5~7

- redirect 기간을 유지한다.
- 파일 삭제는 별도 커밋으로 진행한다.
- 삭제 전 커밋과 복구 경로를 Handoff에 기록한다.

## 16. 관측성과 진단

공통 프런트엔드 진단 정보:

```js
{
  appVersion,
  buildVersion,
  screen,
  hostAdapter,
  editorEngineVersion,
  contractVersion,
  templateIdentity,
  commandRevision,
  dirty,
  locale,
  viewport
}
```

권장 이벤트:

- `app_loaded`
- `route_changed`
- `editor_loaded`
- `command_executed`
- `command_rejected`
- `snapshot_stale_rejected`
- `save_started`
- `save_completed`
- `save_failed`
- `locale_snapshot_failed`
- `legacy_fallback_used`

사용자 콘텐츠, 인증값, DB 연결 문자열, 이미지 프롬프트 원문은 진단 로그에 기록하지 않는다.

## 17. 협업 및 구현 규칙

1. 작업 전 `git status`, 현재 브랜치, 미커밋 변경을 확인한다.
2. 기존 사용자 변경과 관련 없는 파일을 수정하지 않는다.
3. 공유 계약 변경은 정책에 따른 승인 후 진행한다.
4. 공통 편집 기능에 Host 이름 기반 조건문을 추가하지 않는다.
5. Host 차이는 Adapter와 Capability로 표현한다.
6. Renderer에서 API, storage, postMessage를 직접 처리하지 않는다.
7. Layout 변경은 Command를 거친다.
8. 화면별 `fetch()` 복제 대신 Service를 사용한다.
9. 디자인 리터럴 대신 토큰과 공통 컴포넌트 API를 사용한다.
10. 생성된 Visual Editor Bundle을 직접 수정하지 않는다.
11. 구조 변경과 시각 디자인 변경을 같은 커밋에 혼합하지 않는다.
12. 한 Phase의 검증을 완료하기 전에 다음 Phase를 대규모로 시작하지 않는다.
13. Phase 완료 후 변경 파일, 테스트 결과, 미완료 이슈, 롤백 방법을 Handoff에 기록한다.

## 18. 커밋 전략

권장 단위:

1. 실패 재현 테스트
2. Coordinate System
3. Resize/Move Engine
4. Editor Command 한 종류
5. Editor Store 한 책임
6. Host Adapter 한 종류
7. UI Component 한 종류
8. Domain Module 한 책임
9. 화면 기능 한 영역
10. Legacy 제거

각 커밋은 다음을 충족한다.

- 한 가지 책임
- 관련 테스트 포함
- 전체 회귀 통과
- 소스 변경 시 Bundle 재생성
- `git diff --check` 통과

## 19. Phase별 Definition of Done

### Phase 0

- 관리자와 Create Promo의 텍스트 리사이즈 결과가 같다.
- Viewport와 문구 길이가 Layout 결과를 바꾸지 않는다.

### Phase 1

- 모든 편집 변경이 Editor Command를 사용한다.
- Undo/Redo가 공통 동작한다.

### Phase 2

- Admin, Promo, Output Adapter가 분리된다.
- App.vue에서 Host 상세 구현이 제거된다.

### Phase 3

- 공통 UI 컴포넌트가 Visual Editor와 관리자 파일럿에 적용된다.
- 접근성·스타일 동등성이 검증된다.

### Phase 4

- Create Promo 핵심 기능이 Vue와 공통 Domain을 사용한다.
- 기존 저장·복원·AI 흐름이 유지된다.

### Phase 5

- Promo Wizard 기능이 Create Promo로 수렴한다.
- Legacy 경로 처리와 제거 근거가 기록된다.

### Phase 6

- 관리자 핵심 기능이 Vue 3 + Vite로 전환된다.
- CDN Vue가 제거된다.

### Phase 7

- 주요 인터랙티브 화면의 단일 빌드 정책이 확정된다.
- 전환기 Script와 중복 자산이 정리된다.

## 20. 최종 Definition of Done

1. 주요 인터랙티브 프런트엔드가 Vue 3 + Vite + ESM으로 수렴한다.
2. 관리자와 프로모션 빌더가 동일한 Editor Core, Command, Layout Engine을 사용한다.
3. 같은 Editor Document와 Command는 동일한 Layout 결과를 생성한다.
4. Preview와 Web Output이 동일한 `PromoPageRenderer`와 동일한 출력 계약을 사용한다.
5. 공통 UI가 Vue 컴포넌트로 제공되고 화면별 마크업·동작 복제가 없다.
6. Create Promo와 Promo Wizard의 중복 도메인 로직이 제거된다.
7. Promo Wizard의 독립 Legacy 흐름이 Create Promo로 안전하게 수렴한다.
8. 관리자 대형 CDN Vue 구조가 기능 단위 Vite 구조로 전환된다.
9. DB 기반 i18n Snapshot 정책이 모든 전환 화면에서 유지된다.
10. App Shell과 Navigation의 단일 Source of Truth가 존재한다.
11. 계약·동작·시각·브라우저·빌드 테스트가 모두 통과한다.
12. Legacy 파일과 URL의 유지·redirect·제거 정책이 문서화된다.

## 21. 착수 전 결정 항목

### 필수 결정

- [ ] Desktop 디자인 좌표 기준 폭을 1280으로 확정
- [ ] Editor Core의 1차 Source of Truth를 iframe Editor Store로 확정
- [ ] P0~P2 동안 기존 Layout 저장 계약 유지
- [ ] JavaScript `.mjs` 우선 사용
- [ ] 기존 `visual-editor` Vite 환경을 전환 출발점으로 사용
- [ ] Promo Wizard 제거는 참조 감사 후 별도 승인

### 후속 결정

- [ ] TypeScript 점진 도입 여부
- [ ] 최종 Vite 멀티 엔트리 구조
- [ ] `visual-editor`를 `frontend`로 승격할지 여부
- [ ] 최종 라우팅 방식
- [ ] 랜딩 화면의 Vue App Shell 흡수 여부
- [ ] Legacy redirect 유지 기간

## 22. 최종 권고

개발 플랫폼 단일화는 필요하다. 그러나 Vue로 옮기는 작업부터 시작하면 현재의 상태 중복과 동작 Drift를 Vue 컴포넌트 안으로 그대로 옮길 위험이 있다.

따라서 다음 순서를 고정한다.

```text
동작 동일성
→ Editor Core
→ Host Adapter
→ 공통 UI
→ Create Promo
→ Promo Wizard 통합
→ 관리자
→ Legacy·빌드 정리
```

이 계획의 최종 판단 기준은 프레임워크 파일 개수가 아니다.

> 공통 기능을 한 곳에서 수정하면 관리자, 프로모션 빌더, Preview, Output에 동일한 규칙과 동일한 결과로 반영되어야 한다.
