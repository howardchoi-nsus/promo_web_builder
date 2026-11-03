# Visual Editor 3개 모드 통합 개발계획서

## 0. 문서 정보

- 작성일: 2026-07-30
- 대상 프로젝트: `promo_web_builder`
- 문서 상태: 개발 착수 전 검토안
- 우선순위: P0~P5
- 개발 원칙:
  - 세 화면을 비슷하게 만드는 것이 아니라 하나의 편집 엔진과 하나의 Workspace를 사용한다.
  - 모드별 차이는 문서 입출력 Adapter, 권한 Capability, 상단 Action으로 제한한다.
  - UI 통합을 이유로 기존 템플릿, 프로모션 또는 AI Builder 문서를 초기화하지 않는다.
  - 각 단계는 테스트와 디버깅을 통과한 뒤 다음 단계로 진행한다.
- 대상 진입 경로:
  - Template Mode Host: `/prototype/create-promo?mode=template`
  - Admin Layout: `/prototype/visual-editor?mode=admin-layout&templateId={templateId}`
  - AI Document: `/prototype/visual-editor?mode=ai-document&builderDocumentId={documentId}&revision={revision}`
- 관련 기존 문서:
  - `docs/계획/common-editor-platform-and-layout-engine-development-plan-2026-07-24.md`
  - `docs/계획/frontend-platform-unification-and-shared-modules-development-plan-2026-07-24.md`
  - `docs/계획/admin-promo-layout-editor-unification-development-plan-2026-07-24.md`
  - `docs/계획/ai-page-section-composition-engine-development-plan-2026-07-29.md`
  - `docs/설계/ai-promotion-builder-composition-engine-technical-design-2026-07-29.md`

## 1. 목적

현재 세 진입 경로는 일부 Vue 컴포넌트와 Renderer를 공유하지만 사용자에게는 서로 다른 에디터처럼 보이고 동작한다.

이번 개발의 목적은 다음과 같다.

1. 세 모드가 동일한 Editor Core, Layout Engine, Renderer 및 편집 UI를 사용한다.
2. 이동, 크기 조절, 선택, 정렬, 속성 변경, Undo/Redo가 같은 Command로 처리된다.
3. Template, Admin, AI Document의 차이는 저장 위치와 허용 기능에만 남긴다.
4. 디자인 토큰, 이미지 자산, Motion 및 Web Output 결과가 모든 모드에서 동일하게 해석된다.
5. 공통 기능 수정 시 한 모드만 변경되거나 다른 모드가 회귀하는 문제를 방지한다.
6. 관리자는 Component Definition과 선택적인 Preset을 관리하고 실제 페이지 조립은 통합 Editor에서 수행한다.
7. 사용자는 Live Preview에서 Section을 생성하고 Component를 추가하며 Page Tree로 구조와 순서를 관리한다.

## 2. 핵심 결론

세 URL을 하나의 URL로 합치는 것만으로는 통합이 완료되지 않는다.

반드시 다음 네 계층을 통합해야 한다.

```text
Editor Document Contract
  → Editor Core / Command Engine
    → VisualEditorWorkspace
      → PromoPageRenderer
```

모드별 차이는 바깥 계층으로 격리한다.

```text
Template Mode Adapter
Admin Template Adapter
AI Document Adapter
  → 공통 Editor Document로 변환
  → 공통 Editor Core 실행
  → 각 저장소 규격으로 다시 저장
```

## 3. 현재 구조 분석

### 3.1 공통화된 부분

현재 다음 요소는 이미 공통 기반을 가지고 있다.

- Vue 3 + Vite Visual Editor 번들
- `visual-editor/src/App.vue`
- `createEditorStore`
- `SectionPanel`
- `PreviewPanel`
- `PropertyPanel`
- `PromoPageRenderer`
- 공통 Layout Command 일부
- `editor-context.mjs`의 Context 및 Capability

따라서 신규 에디터를 다시 만드는 방식은 권장하지 않는다. 현재 공통 기반을 명확한 계층으로 재구성해야 한다.

### 3.2 모드별 현재 차이

| 구분 | Template Mode | Admin Layout | AI Document |
|---|---|---|---|
| Host | Create Promo Wizard | Visual Editor 직접 진입 | Visual Editor 직접 진입 |
| 편집기 실행 | Step 3에서 iframe | 직접 실행 | 직접 실행 |
| 입력 데이터 | Wizard Snapshot | Template Layout API | Builder Document API |
| 저장 | 부모 Host에 `postMessage` | Template Layout PATCH/활성화 | Builder Document revision PATCH |
| 주요 계약 | 기존 Layout/Design Snapshot | 기존 Template Layout | Composition Contract v2 |
| Shell | Wizard 외부 Shell | Embedded 계열 | 독립 App Shell |
| AI 이미지 | Create Promo Host 경유 | 기본 미지원 | 저장 문서 기준 직접 연동 필요 |

### 3.3 현재 주요 문제

#### 문제 A — 같은 컴포넌트를 사용하지만 모드 분기가 `App.vue`에 집중됨

`isAdminLayoutMode`, `isCreatePromoWizardMode`, `isAiDocumentMode` 조건이 데이터 로드, 저장, Action 및 UI에 함께 사용된다.

결과:

- 기능 추가 시 모든 모드 조건을 점검해야 한다.
- 같은 패널이라도 노출되는 기능과 동작이 달라질 수 있다.
- 특정 모드 수정이 다른 모드에 반영되지 않을 수 있다.

#### 문제 B — 공통 문서 계약이 없음

현재 Editor가 받는 데이터가 다음과 같이 다르다.

- `designSpec`
- `sectionInputs`
- Template Layout Snapshot
- Builder Document Snapshot
- Composition Contract v2

같은 컴포넌트와 레이아웃을 서로 다른 필드명과 병합 규칙으로 처리하면 UI만 같아도 결과는 달라진다.

#### 문제 C — 편집 상태 소유권이 다름

Template Mode는 Create Promo 부모와 iframe이 상태를 함께 보유한다. Admin 및 AI Document는 Visual Editor가 서버 문서를 직접 읽고 저장한다.

결과:

- Template Mode의 변경이 메시지 순서나 Snapshot revision에 영향을 받는다.
- AI 이미지와 자산 변경이 부모 Host 기능에 종속된다.
- 모드별 저장 완료의 의미가 다르다.

#### 문제 D — Shell과 Workspace가 혼합됨

AI Document는 독립 Shell을 표시하고 Admin/Template Mode는 Embedded 방식으로 표시된다. Shell 차이가 Editor Workspace의 크기, 스크롤 및 Toolbar 구성에 영향을 준다.

#### 문제 E — AI Document 기능 동등성이 부족함

Create Promo 전용 AI 기능은 `postMessage`를 통해 부모에게 요청한다. AI Document는 같은 기능을 사용하려면 Builder Document를 대상으로 하는 직접 Command/API 경로가 필요하다.

## 4. 범위

### 4.1 포함 범위

- 세 모드의 Editor Document 입력 규격 통합
- 공통 `VisualEditorWorkspace` 구성
- 공통 Editor Store 및 Command Engine 적용
- 공통 Layout Engine 및 Renderer 적용
- 공통 Toolbar, Section, Preview, Property 패널 적용
- 모드별 Adapter와 Capability 분리
- 디자인 토큰 적용 방식 통합
- 이미지 및 키비주얼 자산 적용 방식 통합
- Motion/Transition 데이터 적용 방식 통합
- Undo/Redo 및 Revision 충돌 처리 통합
- Component Definition을 Editor에서 Section Instance에 조립하는 흐름
- Live Preview에서 빈 섹션 및 Section Preset 기반 섹션 생성
- Page → Section → Component → Field 구조를 표시하는 페이지 구조 트리
- 트리 기반 섹션·컴포넌트 순서 변경 및 컴포넌트의 섹션 간 이동
- 완성된 섹션과 페이지를 선택적으로 Preset으로 저장하는 흐름
- 세 모드 기능 동등성 자동 테스트
- Web Output과 Editor Preview 렌더링 동등성 검증

### 4.2 제외 범위

- Create Promo 전체 Wizard를 한 번에 Vue로 재작성
- Admin 전체 애플리케이션 재작성
- 별도 저장소 또는 별도 Vercel 프로젝트 생성
- AI가 HTML/CSS를 직접 작성하거나 DOM을 직접 수정하는 기능
- 기존 Template/Layout/Builder Document 데이터 초기화
- 자유 형식 CSS 입력 허용
- Component 내부에 다른 Component를 무제한 중첩하는 재귀 구조
- 초기 단계에서 Field를 독립적인 드래그 대상으로 제공하는 기능
- 이번 통합만을 위한 필수 Neon 데이터 초기화

### 4.3 조건부 범위

다음은 P0 조사 결과에 따라 additive DB migration이 필요할 수 있다.

- Builder Document에 공통 Contract version 기록
- Editor 저장 source 허용값 추가
- 문서별 token version 또는 asset revision 누락 보완
- 운영 로그 Event constraint 확장

기존 데이터를 삭제하거나 일괄 치환하는 migration은 허용하지 않는다.

## 5. 목표 아키텍처

### 5.1 전체 구조

```text
Route / Host
  ├─ Create Promo Template Mode
  ├─ Admin Layout
  └─ AI Document
        ↓
EditorContext Resolver
        ↓
Document Adapter
  ├─ load()
  ├─ normalize()
  ├─ save()
  ├─ publish()
  └─ runAction()
        ↓
Composition Contract v2 Editor Document
        ↓
Editor Core / Command Engine
        ↓
VisualEditorWorkspace
  ├─ EditorToolbar
  ├─ StructurePanel
  │  ├─ PageTree
  │  └─ ComponentLibrary
  ├─ PreviewPanel
  └─ PropertyPanel
        ↓
PromoPageRenderer
        ↓
Web Output
```

### 5.2 권장 소스 구조

```text
visual-editor/src/
├─ app/
│  ├─ VisualEditorApp.vue
│  └─ resolve-editor-context.mjs
├─ platform/
│  ├─ editor-core/
│  ├─ layout-engine/
│  ├─ contracts/
│  ├─ adapters/
│  │  ├─ template-mode-adapter.mjs
│  │  ├─ admin-template-adapter.mjs
│  │  └─ ai-document-adapter.mjs
│  ├─ capabilities/
│  └─ editor-ui/
│     ├─ VisualEditorWorkspace.vue
│     ├─ EditorToolbar.vue
│     ├─ StructurePanel.vue
│     ├─ PageTree.vue
│     ├─ ComponentLibraryPanel.vue
│     ├─ SectionPresetPicker.vue
│     ├─ PreviewPanel.vue
│     └─ PropertyPanel.vue
├─ renderer/
│  └─ PromoPageRenderer.vue
└─ App.vue
```

`App.vue`는 Route/Context를 결정하고 Workspace를 조립하는 역할만 담당한다.

## 6. 공통 Editor Document

### 6.1 기준 계약

공통 편집 문서는 `Composition Contract v2`를 기준으로 한다.

신규 경쟁 계약을 만들지 않는다. 기존 Template Layout과 Wizard Snapshot은 Adapter 경계에서 Contract v2로 정규화한다.

### 6.2 최소 구조

```js
{
  contractVersion: 2,
  identity: {
    documentId,
    documentKind,
    templateId,
    templateVersion,
    layoutRevision,
    documentRevision
  },
  sections: [],
  content: {},
  layout: {
    responsive: {},
    sectionStyles: {},
    componentStyles: {},
    fieldStyles: {}
  },
  designTokens: {
    tokenSetId,
    tokenSetVersionId,
    values: {}
  },
  assets: {},
  motion: {},
  visibility: {
    sections: {},
    components: {},
    fields: {}
  },
  metadata: {
    source,
    createdBy,
    updatedAt
  }
}
```

### 6.3 `documentKind`

```text
template-default
promo-instance
ai-document
```

`documentKind`는 저장 대상과 권한을 결정한다. Renderer의 DOM 구조를 결정하는 값으로 사용하지 않는다.

### 6.4 정규화 원칙

1. Adapter가 Legacy 데이터를 읽는다.
2. Normalizer가 누락 기본값과 계약 버전을 보완한다.
3. Validator가 편집 가능한 문서인지 검증한다.
4. Editor Core에는 Contract v2 문서만 전달한다.
5. 저장 시 Adapter가 대상 API 규격으로 직렬화한다.

### 6.5 금지 사항

- `App.vue`에서 모드별로 서로 다른 Snapshot 구조 직접 변경
- Renderer에서 API 응답 원본 직접 참조
- DOM에서 읽은 스타일을 별도 검증 없이 영구 문서에 저장
- AI 결과가 Editor Store를 우회해 DOM 변경
- 디자인 토큰 값을 모드별 CSS 하드코딩으로 보정

## 7. 공통 Editor Core

### 7.1 단일 Source of Truth

편집 중인 상태는 Editor Store 한 곳에서만 소유한다.

```text
Adapter load
  → Editor Store
    → UI/Renderer는 읽기
    → 모든 변경은 Command 실행
    → Adapter save
```

Create Promo 부모는 편집 가능한 복제 상태를 별도로 유지하지 않는다. 전환 기간에는 부모 상태가 필요하더라도 Editor Snapshot을 기준으로 동기화한다.

### 7.2 필수 Command

```text
DOCUMENT_REPLACE
SECTION_SELECT
SECTION_RESIZE
SECTION_STYLE_UPDATE
SECTION_BACKGROUND_UPDATE
COMPONENT_SELECT
COMPONENT_MULTI_SELECT
COMPONENT_MOVE
COMPONENT_RESIZE
COMPONENT_CONTENT_UPDATE
COMPONENT_STYLE_UPDATE
COMPONENT_VISIBILITY_UPDATE
FIELD_CONTENT_UPDATE
FIELD_STYLE_UPDATE
FIELD_VISIBILITY_UPDATE
COMPONENT_ALIGN
COMPONENT_DISTRIBUTE
COMPONENT_STACK
DESIGN_TOKEN_SET_APPLY
ASSET_APPLY
ASSET_REMOVE
MOTION_PRESET_APPLY
LAYOUT_PATCH_APPLY
HISTORY_UNDO
HISTORY_REDO
```

### 7.3 AI 변경 원칙

AI 결과는 다음 흐름을 사용한다.

```text
AI Proposal
  → Contract Validator
  → 허용 Command 목록으로 변환
  → 충돌 검사
  → Editor Core 실행
  → 동일 Renderer로 결과 확인
```

AI가 DOM, HTML 또는 자유 형식 CSS를 직접 수정하지 않는다.

### 7.4 Revision 정책

모든 저장 Adapter는 다음 값을 사용한다.

- 현재 문서 revision
- 저장 기준 base revision
- 변경 source
- change note

서버 revision이 변경되면 자동 덮어쓰지 않는다.

```text
REVISION_CONFLICT
  → 최신 문서 재조회
  → 사용자 변경과 서버 변경 비교
  → 재적용 또는 사용자 확인
```

## 8. 공통 VisualEditorWorkspace

### 8.1 공통 DOM

세 모드 모두 다음 DOM 계층을 사용한다.

```text
visual-editor-app
└─ editor-shell
   ├─ editor-toolbar
   └─ visual-editor-workspace
      ├─ structure-panel
      │  ├─ page-tree
      │  └─ component-library
      ├─ preview-panel
      └─ property-panel
```

`embedded`, `standalone`, `documentKind`에 따라 Workspace DOM을 바꾸지 않는다.

### 8.2 공통 UI

- 왼쪽: 페이지 구조 트리와 컴포넌트 라이브러리
- 중앙: Live Preview, viewport 전환, 가이드, Web Output
- 오른쪽: 선택 컴포넌트 및 필드 콘텐츠·디자인·위치
- 동일한 독립 스크롤
- 동일한 선택 표시
- 동일한 드래그 및 리사이즈 핸들
- 동일한 로딩·저장·오류 표시

### 8.3 Host Shell 원칙

Create Promo Wizard의 Step 표시와 이전/다음 버튼은 Editor 외부에 둔다.

Admin과 AI Document의 전역 메뉴도 Editor 외부 Shell에 둔다.

Editor 내부 Workspace는 Host Shell 유무와 관계없이 동일한 크기 계산 규칙을 사용한다.

### 8.4 CSS 원칙

- Editor 공통 CSS는 한 번만 로드한다.
- Host 페이지 CSS가 Editor 내부 클래스에 직접 개입하지 않는다.
- 모드별 Modifier는 Action 노출 또는 Shell 여백 정도로 제한한다.
- Renderer CSS와 Editor Shell CSS를 분리한다.
- Web Output은 Editor Shell CSS를 로드하지 않는다.

## 9. Adapter 설계

### 9.1 공통 인터페이스

```js
{
  load(context),
  save({ document, baseRevision, changeNote }),
  publish?({ document, baseRevision, changeNote }),
  runAction?({ action, payload, document }),
  subscribe?(listener),
  dispose?()
}
```

모든 Adapter는 공통 형식의 결과를 반환한다.

```js
{
  ok: true,
  document,
  revision,
  warnings: []
}
```

### 9.2 Template Mode Adapter

책임:

- Create Promo의 선택 Template과 Overview를 읽는다.
- Wizard Snapshot을 Contract v2로 변환한다.
- 편집 변경을 Promo Instance Override로 저장한다.
- 전환 기간에는 부모와 `postMessage`로 통신한다.
- AI 이미지 및 섹션 구성 요청을 Promo Instance 식별자로 실행한다.

중기 개선:

- 부모의 로컬 상태를 Source of Truth로 사용하지 않는다.
- 서버 기반 Promo Instance 또는 Builder Document 저장 방식으로 전환한다.

### 9.3 Admin Template Adapter

책임:

- Template Layout 초안 조회
- 기본 Preview 콘텐츠 정규화
- 초안 저장
- Layout revision 검증
- Template 활성화
- 디자인 토큰 기본값 설정

제한:

- 실제 프로모션 사용자 콘텐츠를 저장하지 않는다.
- 프로모션별 AI 자산을 Template 자산으로 오인해 저장하지 않는다.

### 9.4 AI Document Adapter

책임:

- Builder Document와 지정 revision 조회
- Composition Contract v2 검증
- Builder Document revision 저장
- 디자인 토큰 및 자산 revision 보존
- AI 구성 수정과 이미지 생성 결과 저장

추가 요구:

- 유효한 Builder session을 확인한다.
- 세션 오류와 문서 조회 오류를 구분해 표시한다.
- AI 이미지 생성 Command가 Create Promo 부모에 의존하지 않게 한다.

## 10. Capability 정책

### 10.1 원칙

Capability는 UI 구조를 바꾸는 값이 아니라 Action의 허용 여부를 결정한다.

### 10.2 권장 Matrix

| Capability | Template Mode | Admin Layout | AI Document |
|---|---:|---:|---:|
| 콘텐츠 편집 | O | Preview용 제한 | O |
| 빈 섹션 생성 | O | O | O |
| Section Preset 추가 | O | O | O |
| 컴포넌트 추가·삭제 | O | O | O |
| 트리 구조 순서 변경 | O | O | O |
| 컴포넌트의 섹션 간 이동 | O | 정책에 따라 O | O |
| 섹션 레이아웃 편집 | O | O | O |
| 컴포넌트 이동·크기 변경 | O | O | O |
| 디자인 토큰 선택 | O | 기본값 정책에 따라 O | O |
| 섹션 AI 구성 | O | 기본 미지원 | O |
| 키비주얼 생성 | O | 선택적 Template 자산만 | O |
| 컴포넌트 이미지 생성 | O | 선택적 Template 자산만 | O |
| 다중 정렬 AI | O | O | O |
| Promo Override 저장 | O | X | X |
| Template 초안 저장 | X | O | X |
| Template 활성화 | X | O | X |
| AI Document revision 저장 | X | X | O |
| Web Output | O | Preview | O |

### 10.3 Action Registry

Toolbar와 Property Panel이 모드 조건을 직접 검사하지 않도록 한다.

```js
const actions = resolveEditorActions({
  capabilities,
  documentKind,
  adapter
});
```

Action은 다음 상태를 공통 형식으로 제공한다.

```text
hidden
disabled
ready
running
succeeded
failed
```

## 11. 디자인 토큰·자산·Motion 통합

### 11.1 디자인 토큰

- 모든 모드는 같은 Token Resolver를 사용한다.
- 선택된 `tokenSetVersionId`를 Editor Document에 저장한다.
- Renderer는 저장된 token version을 기준으로 CSS Variable을 생성한다.
- Host 또는 모드별 기본 CSS가 token 값을 덮어쓰지 않는다.
- Admin에서 설정하는 기본 token과 Promo Instance에서 선택하는 token의 우선순위를 명시한다.

권장 우선순위:

```text
Promo Instance 선택
  > AI Document 선택
  > Template 기본 Token
  > 시스템 Fallback
```

### 11.2 이미지 및 키비주얼

- 자산은 URL 문자열만 저장하지 않고 asset identity와 metadata를 함께 저장한다.
- 섹션 키비주얼과 컴포넌트 이미지를 구분한다.
- 생성 진행, 실패, 재시도, 삭제 상태를 공통 Asset Command로 처리한다.
- 이미지 생성 완료 시 동일한 `ASSET_APPLY` Command를 사용한다.

### 11.3 Motion

- Motion은 DOM class 직접 변경이 아니라 Motion Preset ID와 안전한 parameter로 저장한다.
- Preview와 Web Output은 같은 Motion Resolver를 사용한다.
- 편집 중에는 Motion 일시정지 또는 재생 기능을 공통 Toolbar에서 제공한다.

## 12. 컴포넌트 중심 캔버스 조립과 페이지 구조 트리

### 12.1 AS-IS와 TO-BE

AS-IS:

```text
설정에서 Template 생성
  → Section을 Template에 연결
  → 각 Section에 Component를 사전 조립
  → 활성화
  → 프로모션 빌더에서 완성 구조 선택
```

TO-BE:

```text
관리자는 Component Definition과 선택적인 Section Preset 관리
  → 사용자가 통합 Editor에서 Section Instance 생성
  → Component Library에서 Component를 드래그 앤 드롭
  → Page Tree에서 구조·순서 관리
  → Live Preview에서 위치·크기·디자인 조정
  → 필요하면 Section 또는 Page를 Preset으로 저장
```

Template은 더 이상 모든 섹션과 컴포넌트를 반드시 사전 조립해야 하는 유일한 시작점이 아니다. 완성된 페이지 구성의 재사용이 필요할 때 사용하는 `Template Preset` 역할로 축소한다.

### 12.2 도메인 용어

| 명칭 | 정의 | 생성 위치 |
|---|---|---|
| Component Definition | 관리자가 등록한 재사용 가능한 컴포넌트 원형과 Field Schema | 설정 > 컴포넌트 관리 |
| Component Instance | 특정 Section에 배치된 Component Definition의 실제 사용 인스턴스 | 통합 Editor |
| Section Instance | 페이지 안에 생성된 실제 레이아웃 컨테이너 | 통합 Editor |
| Section Preset | Header, Footer, T&C처럼 Component가 미리 조립된 재사용 섹션 | 설정 또는 Editor의 Preset 저장 |
| Template Preset | 여러 Section Instance가 조립된 전체 페이지 시작 구성 | 설정 또는 Editor의 Preset 저장 |
| Page Tree | 현재 Editor Document의 Section·Component·Field 계층 표현 | 통합 Editor |

Live Preview에서 `+ 섹션`을 실행할 때 전역 Section Definition을 매번 생성하지 않는다. 현재 문서에 속하는 `Section Instance`를 생성하고 자동 생성된 안정적인 section key를 부여한다.

### 12.3 권장 계층

초기 지원 계층은 다음 4단계로 제한한다.

```text
Page
└─ Section Instance
   └─ Component Instance
      └─ Field
```

정책:

- Section은 Page 바로 아래에만 존재한다.
- Component는 Section 바로 아래에만 존재한다.
- Field는 Component Definition이 제공하며 초기에는 조회·선택만 허용한다.
- Field는 독립적인 구조 드래그 대상이 아니다.
- Component 안에 Component를 넣는 재귀 중첩은 초기 범위에서 금지한다.
- Grid, Row, Group 같은 복합 배치가 필요하면 자유 중첩 대신 검증된 Layout Command 또는 전용 Container Component로 제공한다.

### 12.4 권장 Editor UI

```text
┌──────────────────┬────────────────────────┬───────────────────┐
│ 페이지 구조       │ Live Preview           │ 속성              │
│                  │                        │                   │
│ [구조][컴포넌트]  │ 실제 프로모션 화면      │ 선택 Section 또는  │
│ Page             │                        │ Component 속성     │
│ ├ Header         │                        │                   │
│ │ ├ Logo         │                        │                   │
│ │ └ Navigation   │                        │                   │
│ ├ Hero           │                        │                   │
│ │ ├ Lead Text    │                        │                   │
│ │ ├ Title        │                        │                   │
│ │ └ Visual       │                        │                   │
│ └ T&C            │                        │                   │
└──────────────────┴────────────────────────┴───────────────────┘
```

왼쪽 패널은 다음 두 탭으로 구성한다.

1. `페이지 구조`: 현재 문서의 Section·Component·Field Tree
2. `컴포넌트`: 검색·역할·필드 종류로 필터링할 수 있는 Component Library

Section Preset은 `+ 섹션` 실행 시 Picker로 제공한다.

### 12.5 섹션 생성 흐름

```text
Section 사이의 + 버튼 또는 빈 캔버스 Drop Zone 선택
  → 빈 섹션 / Section Preset / AI 추천 섹션 선택
  → Section Instance 생성
  → section key 자동 생성
  → 기본 Layout·디자인 토큰·높이 적용
  → Component 추가
```

초기 권장 생성 방식:

- 빈 섹션
- Section Preset
- AI 추천 섹션

Component를 빈 Page Drop Zone에 직접 놓는 기능은 다음 정책을 사용한다.

- 드롭 전에 새 Section 생성 여부를 확인한다.
- 확인 시 빈 Section Instance를 생성하고 Component Instance를 추가한다.
- 취소 시 문서를 변경하지 않는다.
- Undo 한 번으로 Section과 Component 생성 전체를 취소한다.

### 12.6 드래그 앤 드롭 책임

#### Page Tree 드래그

구조를 변경한다.

- Section 순서 변경
- 같은 Section 안의 Component 순서 변경
- Component의 다른 Section 이동
- 고정 Header/Footer/T&C 이동 제한

#### Live Preview 드래그

시각적 레이아웃을 변경한다.

- Component X/Y 위치 변경
- 너비·높이 변경
- 정렬·분배·스택 적용
- Section 내부 상대 배치 변경

Page Tree의 드래그와 Live Preview의 드래그가 같은 의미로 처리되어서는 안 된다.

```text
Tree Drop = 구조 Command
Canvas Drop = Layout Command
```

모든 Drop Target은 before, inside, after를 시각적으로 구분한다. 허용되지 않는 대상은 Drop 전에 표시하고 실제 Command 실행도 거부한다.

### 12.7 신규 필수 Command

기존 공통 Command에 다음 항목을 포함한다.

```text
SECTION_INSTANCE_CREATE
SECTION_INSTANCE_CREATE_FROM_PRESET
SECTION_INSTANCE_REMOVE
SECTION_INSTANCE_DUPLICATE
SECTION_INSTANCE_REORDER
COMPONENT_INSTANCE_CREATE
COMPONENT_INSTANCE_REMOVE
COMPONENT_INSTANCE_DUPLICATE
COMPONENT_INSTANCE_REORDER
COMPONENT_INSTANCE_MOVE_SECTION
SECTION_PRESET_SAVE
PAGE_PRESET_SAVE
```

`COMPONENT_INSTANCE_MOVE_SECTION`은 다음 작업을 하나의 트랜잭션으로 처리한다.

1. 원본 Section에서 Instance 제거
2. 대상 Section에 Instance 연결
3. 새 sort order 계산
4. Section role 및 Component compatibility 검증
5. Layout geometry 정규화
6. 실패 시 전체 롤백

### 12.8 편집 정책과 검증

초안 상태에서는 불완전한 Section을 허용할 수 있다.

다음 단계에서는 검증을 통과해야 한다.

| 단계 | 검증 수준 |
|---|---|
| 편집 중 | 경고 중심, 빈 Section 허용 |
| 초안 저장 | Contract 무결성, key·instance 중복 금지 |
| 활성화·Web Output | 빈 필수 Section, 필수 Component/Field, 고정 위치, 호환성 검증 |

필수 정책:

- Header/Footer/T&C 등은 `fixedPosition`, `required`, `locked` 정책 유지
- Section role별 허용 Component role 또는 field requirement 적용
- 삭제 시 하위 Component와 자산 영향 안내
- Section 삭제, Preset 적용 및 섹션 간 Component 이동은 Undo 가능
- 동일 Component Definition은 정책이 허용하면 여러 Instance로 사용할 수 있음

### 12.9 저장 모델

현재의 Template → Section 순서와 Section → Component Instance 순서 모델을 우선 활용한다.

P0에서 다음 항목을 확인한다.

- Template에 속하지 않는 AI Document/Promo Instance의 Section Instance 저장 위치
- Section Instance와 재사용 Section Preset의 식별자 분리
- Component를 다른 Section으로 이동할 때 instance identity 유지 여부
- Section key와 Component item key의 문서 범위 uniqueness
- sort order 일괄 정규화와 revision 충돌 정책
- fixed position과 order change allowed의 적용 위치

초기에는 재귀형 `parent_id`를 추가하지 않는다. Page → Section → Component의 고정 계층으로 충분한지 먼저 검증한다.

### 12.10 접근성과 조작 대안

- Tree 항목은 `tree`, `treeitem`, `aria-level`, `aria-expanded`를 사용한다.
- 드래그만 제공하지 않고 위/아래 이동과 다른 Section으로 이동 메뉴를 함께 제공한다.
- 키보드 이동 결과와 Drop 위치를 `aria-live`로 알린다.
- 잠금·고정·필수 상태는 색상 외 아이콘과 문구로 표시한다.
- Drag Handle과 Row 선택 영역을 분리해 실수로 이동하지 않게 한다.
- Touch 환경에서는 드래그 외 메뉴 기반 이동을 기본 대안으로 제공한다.

### 12.11 기존 관리자 기능의 역할 변경

| 기존 기능 | TO-BE |
|---|---|
| Template에 Section 사전 조립 | 선택적 Template Preset 관리 |
| Section에 Component 사전 조립 | 선택적 Section Preset 관리 |
| Template Layout 편집 | Preset 기본 Layout 편집 |
| 프로모션 페이지 구조 변경 | 통합 Editor에서 수행 |
| Header/Footer/T&C 구성 | 공용 Section Preset으로 유지 |
| 컴포넌트 Definition 관리 | 설정에서 계속 관리 |

기존 기능을 즉시 삭제하지 않는다. 신규 Editor의 Preset 저장·불러오기와 운영 데이터 호환이 검증된 뒤 중복 조립 UI를 단계적으로 축소한다.

## 13. 단계별 개발 계획

### P0 — 기준선·계약·기능 Matrix 확정

#### 목표

현재 세 모드의 입력, 저장, 기능, DOM 및 API 호출 차이를 고정된 기준선으로 기록한다.

#### 작업

1. 세 URL의 DOM Snapshot과 Screenshot을 기록한다.
2. `App.vue`의 모든 모드 조건을 분류한다.
3. 세 Adapter의 load/save/action 흐름을 작성한다.
4. 현재 문서 필드를 Contract v2 항목에 매핑한다.
5. 디자인 토큰, 자산, Motion 데이터의 누락 여부를 확인한다.
6. 공통 Capability Matrix를 테스트 가능한 데이터로 작성한다.
7. 기능별 Source of Truth를 지정한다.
8. Component Definition, Component Instance, Section Instance, Section Preset 및 Template Preset의 현재 저장 모델을 조사한다.
9. Section role과 Component compatibility 정책을 정의한다.
10. 고정 Header/Footer/T&C와 일반 Section의 이동·삭제 정책을 확정한다.
11. 기존 테스트 전체를 기준선으로 실행한다.

#### 산출물

- Mode Difference Inventory
- Document Field Mapping
- Capability Matrix
- API/Message Flow
- Composition Domain Model
- Section/Component Compatibility Matrix
- 회귀 Screenshot

#### 완료 기준

- [ ] 세 모드의 모든 차이가 Adapter, Capability, Shell 중 하나로 분류된다.
- [ ] 공통 Contract로 변환할 수 없는 필드가 목록화된다.
- [ ] Section Instance와 Section Preset의 식별자·저장 위치가 구분된다.
- [ ] 트리 구조에서 허용되는 이동·삭제·복제 규칙이 확정된다.
- [ ] 데이터 초기화 없이 전환 가능한지 확인된다.
- [ ] 현재 전체 테스트 스위트가 통과한다.

### P1 — Contract v2 정규화 계층

#### 목표

세 모드가 Editor Core에 동일한 문서를 전달한다.

#### 작업

1. 공통 `editor-document-normalizer`를 구현한다.
2. 공통 `editor-document-validator`를 구현한다.
3. Template Layout → Contract v2 변환기를 구현한다.
4. Wizard Snapshot → Contract v2 변환기를 구현한다.
5. AI Document Contract v2 로더를 공통 Validator와 연결한다.
6. 저장 전 공통 Contract 검증을 적용한다.
7. Legacy 필드 round-trip 테스트를 추가한다.
8. `sections[]`에 Section Instance identity, role, lock, fixed position 및 sort order를 정규화한다.
9. 각 Section의 Component Instance identity와 sort order를 정규화한다.
10. Section Preset 참조와 실제 Instance Snapshot을 구분한다.
11. 빈 초안 Section과 활성화 가능한 Section의 검증 수준을 분리한다.
12. 필요 시 additive migration을 별도 검토한다.

#### 완료 기준

- [ ] 세 Adapter가 동일한 Contract v2 문서를 반환한다.
- [ ] Legacy 입력을 load/save해도 의미 있는 필드가 손실되지 않는다.
- [ ] 잘못된 token, asset, visibility 및 geometry가 저장 전에 차단된다.
- [ ] Page → Section → Component → Field 고정 계층이 Contract로 표현된다.
- [ ] 빈 Section은 초안에서 유지되지만 활성화·Web Output 단계에서는 정책에 따라 차단된다.
- [ ] 이 단계에서는 사용자 UI가 변경되지 않는다.

### P2 — VisualEditorWorkspace 단일화

#### 목표

세 모드의 Editor DOM, Panel, Toolbar 및 CSS를 하나로 만든다.

#### 작업

1. `VisualEditorWorkspace.vue`를 추출한다.
2. 공통 `EditorToolbar.vue`를 추출한다.
3. 왼쪽 패널을 Page Tree와 Component Library 탭으로 구성한다.
4. `PageTree.vue`, `ComponentLibraryPanel.vue`, `SectionPresetPicker.vue`를 구현한다.
5. Section/Preview/Property 패널의 입력·이벤트 계약을 통일한다.
6. Tree 선택, Preview 선택 및 Property Panel 선택을 동기화한다.
7. 빈 Section과 Section Preset 생성 UI를 추가한다.
8. 모드별 버튼을 Action Registry와 Capability로 전환한다.
9. `App.vue`의 모드별 대규모 Template 분기를 제거한다.
10. Embedded/Standalone에서 동일한 Workspace DOM을 검증한다.
11. 공통 스크롤 및 viewport 계산을 적용한다.
12. Web Output CSS 경계를 검증한다.

#### 완료 기준

- [ ] 세 모드가 동일한 Workspace DOM을 사용한다.
- [ ] Page Tree가 현재 Editor Document 구조와 일치한다.
- [ ] Component Library에서 추가한 Instance가 Tree와 Preview에 동시에 표시된다.
- [ ] 빈 Section과 Section Preset 기반 Section을 Editor에서 생성할 수 있다.
- [ ] 모드별 차이는 Action 노출과 상태 문구뿐이다.
- [ ] 같은 viewport에서 패널 크기와 Preview Stage가 동일하다.
- [ ] Host CSS가 Editor 내부 레이아웃에 개입하지 않는다.

### P3 — Command·Layout Engine 완전 공통화

#### 목표

동일한 입력과 편집 동작이 세 모드에서 동일한 결과를 만든다.

#### 작업

1. 직접 상태 변경 코드를 Command 호출로 전환한다.
2. 이동, 리사이즈, 정렬 및 다중 선택을 공통 Command로 통합한다.
3. Undo/Redo를 공통 History에 연결한다.
4. DOM 기반 geometry 계산을 디자인 좌표 기반으로 전환한다.
5. 컴포넌트·필드 visibility를 공통 Command로 전환한다.
6. 디자인 토큰 변경을 공통 Command로 전환한다.
7. Layout Validator와 collision 검사 결과를 공통화한다.
8. AI Proposal을 Command 목록으로 변환한다.
9. Section 생성·삭제·복제·순서 변경을 공통 Command로 구현한다.
10. Component Instance 생성·삭제·복제·순서 변경을 공통 Command로 구현한다.
11. Component의 Section 간 이동을 원자적 Command로 구현한다.
12. Tree Drop과 Canvas Drop을 각각 구조 Command와 Layout Command로 분리한다.
13. Section과 Component 복합 생성 작업을 Undo 한 번으로 취소할 수 있게 Transaction History를 적용한다.

#### 완료 기준

- [ ] 동일 문서와 동일 Command의 결과 Snapshot이 세 모드에서 같다.
- [ ] 텍스트와 이미지 리사이즈 동작이 모드별로 달라지지 않는다.
- [ ] Undo/Redo 결과가 동일하다.
- [ ] Tree 순서와 Renderer 순서가 항상 일치한다.
- [ ] Component의 Section 간 이동 실패 시 원본 Section 상태가 보존된다.
- [ ] 고정·잠금·필수 정책을 위반하는 Drop이 실행되지 않는다.
- [ ] AI가 Editor Core를 우회하지 않는다.

### P4 — 저장·AI 자산·Revision 통합

#### 목표

공통 편집 결과를 각 저장 대상에 안전하게 반영한다.

#### 작업

1. Adapter 공통 save 결과 계약을 적용한다.
2. Template Mode의 `postMessage` revision을 명시한다.
3. Admin 초안 저장과 활성화를 분리한다.
4. AI Document revision 충돌 처리를 구현한다.
5. AI 이미지 요청을 공통 Asset Action으로 전환한다.
6. AI Document에서도 섹션·컴포넌트 이미지 생성이 동작하게 한다.
7. 자산 삭제 후 재생성 상태를 공통화한다.
8. Section·Component 순서 변경과 Section 간 이동을 revision 기반으로 저장한다.
9. Section Preset 및 Template Preset 저장 Adapter를 분리한다.
10. 저장 실패 시 Editor Store의 미저장 상태를 보존한다.

#### 완료 기준

- [ ] 각 모드가 잘못된 API를 호출하지 않는다.
- [ ] 저장 성공과 활성화 성공이 명확히 구분된다.
- [ ] revision 충돌이 자동 덮어쓰기로 처리되지 않는다.
- [ ] 이미지 생성·삭제·재생성이 Template Mode와 AI Document에서 동일하게 동작한다.
- [ ] Section·Component 구조 변경을 저장하고 재진입해도 Tree와 Preview가 동일하다.
- [ ] Preset 저장이 현재 편집 문서를 자동으로 운영 활성화하지 않는다.

### P5 — 회귀 테스트·점진 배포·레거시 제거

#### 목표

세 모드가 다시 분리되지 않도록 자동 검증하고 안전하게 전환한다.

#### 작업

1. Contract 단위 테스트를 추가한다.
2. Command 결정론 테스트를 추가한다.
3. Adapter API 금지 호출 테스트를 추가한다.
4. 세 URL 브라우저 E2E를 추가한다.
5. Screenshot/DOM 구조 비교 테스트를 추가한다.
6. Preview와 Web Output 동등성 테스트를 추가한다.
7. Page Tree Drag/Drop과 키보드 이동 E2E를 추가한다.
8. 빈 Section·Preset Section·Component 추가·섹션 간 이동 시나리오를 추가한다.
9. 활성화 검증과 초안 불완전 상태 테스트를 추가한다.
10. Feature Flag로 모드별 전환한다.
11. 안정화 후 레거시 분기와 중복 CSS를 제거한다.
12. 기존 관리자 사전 조립 UI는 Preset 관리로 전환한 후 중복 경로를 축소한다.

#### 완료 기준

- [ ] 세 모드 공통 기능 회귀 시 CI가 실패한다.
- [ ] 저장 대상 혼합 시 테스트가 실패한다.
- [ ] Console Error와 예상하지 않은 Network 4xx/5xx가 없다.
- [ ] 기존 운영 Template과 AI Builder 문서가 정상 로드된다.
- [ ] 페이지 구조 Tree와 Live Preview 구조가 다르면 테스트가 실패한다.
- [ ] Drag/Drop 없이도 키보드 또는 메뉴로 동일한 구조 변경을 수행할 수 있다.
- [ ] Feature Flag 롤백 절차가 검증된다.

## 14. 테스트 계획

### 14.1 기존 명령

```text
pnpm test
pnpm run check
pnpm run build:visual-editor
pnpm run test:visual-editor-contract
pnpm run test:visual-editor-behavior
pnpm run test:wizard-layout-behavior
pnpm run test:create-promo-layout-cache
pnpm run test:create-promo-browser-smoke
```

실제 테스트 파일 개수는 문서에 고정하지 않고 실행 로그에 기록한다.

### 14.2 신규 권장 테스트

```text
test:editor-document-contract
test:editor-adapter-roundtrip
test:editor-command-determinism
test:editor-capability-matrix
test:editor-three-mode-browser
test:editor-output-parity
test:editor-page-tree
test:editor-composition-authoring
```

### 14.3 필수 Browser 시나리오

#### 시나리오 A — 공통 UI

1. 세 모드 각각 진입
2. 같은 Section/Preview/Property DOM 구조 확인
3. 동일한 패널 스크롤 확인
4. 동일한 Selection 표시 확인
5. Capability에 맞는 Action만 노출되는지 확인

#### 시나리오 B — 동일 편집 결과

1. 같은 Contract v2 문서를 각 Adapter에 입력
2. 같은 컴포넌트 선택
3. 같은 이동·리사이즈 Command 실행
4. 최종 layout Snapshot 비교

#### 시나리오 C — 저장 격리

1. Admin에서 수정 후 저장
2. Template Layout API만 호출되는지 확인
3. Template Mode에서 수정 후 저장
4. Promo Override 경로만 호출되는지 확인
5. AI Document에서 수정 후 저장
6. Builder Document API만 호출되는지 확인

#### 시나리오 D — 디자인 토큰

1. 동일 token version 선택
2. Preview의 실제 CSS Variable 비교
3. Web Output 결과 비교
4. 저장 후 재진입하여 token version 유지 확인

#### 시나리오 E — AI 이미지

1. 키비주얼 생성
2. 진행 상태 확인
3. 생성 완료 후 자동 적용 확인
4. 삭제 후 재생성 확인
5. 저장 및 재진입 후 자산 유지 확인

#### 시나리오 F — Revision 충돌

1. 같은 문서를 두 세션에서 열기
2. 한 세션에서 먼저 저장
3. 다른 세션 저장 시 충돌 확인
4. 로컬 변경이 손실되지 않는지 확인

#### 시나리오 G — Section·Component 캔버스 조립

1. 빈 Section 생성
2. Component Library에서 Component 추가
3. Page Tree, Live Preview 및 Property Panel 동기화 확인
4. Component를 다른 Section으로 이동
5. Section과 Component 순서 변경
6. Undo/Redo 확인
7. 저장 후 재진입하여 Tree와 Preview 구조 비교
8. 불완전한 초안 저장과 활성화 검증을 각각 확인

#### 시나리오 H — 고정·잠금·접근성

1. 고정 Header/Footer 이동 차단 확인
2. 잠긴 Component 삭제·이동 차단 확인
3. 키보드로 Section과 Component 순서 변경
4. 이동 결과 안내와 Focus 유지 확인
5. 허용되지 않는 Drop Target 표시 확인

## 15. 배포 전략

### 15.1 Feature Flag

권장 Flag:

```text
EDITOR_CONTRACT_V2_NORMALIZER
EDITOR_SHARED_WORKSPACE
EDITOR_SHARED_COMMAND_ENGINE
EDITOR_DIRECT_AI_ASSET_ACTIONS
EDITOR_PAGE_TREE
EDITOR_CANVAS_COMPOSITION
EDITOR_PRESET_AUTHORING
```

Flag는 모드별로 활성화할 수 있어야 한다.

### 15.2 권장 순서

```text
P0 기준선
→ P1 정규화 계층 배포
→ Admin Layout에서 공통 Workspace 활성화
→ Template Mode 활성화
→ AI Document 활성화
→ 공통 Command Engine 활성화
→ 직접 AI Asset Action 활성화
→ 전체 회귀 검증
→ 레거시 분기 제거
```

AI Document를 마지막에 UI 통합하는 이유는 문서 revision, Builder session 및 AI 자산 경로가 추가로 존재하기 때문이다. 단, Contract 정규화와 테스트는 P1부터 세 모드를 모두 포함한다.

### 15.3 롤백

- Feature Flag를 모드별로 비활성화한다.
- 저장 데이터 Contract는 하위 호환 Normalizer를 유지한다.
- additive migration은 즉시 제거하지 않는다.
- 미저장 Editor State는 브라우저 세션 임시 복구 대상으로 보존한다.
- 레거시 분기는 P5 안정화 전까지 삭제하지 않는다.

## 16. 위험요소와 대응

| 위험 | 영향 | 대응 |
|---|---|---|
| UI만 공통화하고 문서 계약은 유지 | 동작 불일치 지속 | P1 Contract 통합을 P2보다 먼저 완료 |
| Template Mode 부모와 iframe 상태 경합 | 변경 유실·되돌림 | Editor Store 단일 Source, message revision 적용 |
| Admin 저장과 Promo 저장 혼합 | 운영 Template 오염 | Adapter 금지 호출 자동 테스트 |
| AI Document 세션 만료 | 편집 화면 진입 실패 | Session 오류 전용 상태와 재진입 경로 제공 |
| 디자인 토큰 미적용 | Preview/Web Output 불일치 | 공통 Token Resolver와 실제 CSS Variable 비교 |
| AI 이미지가 Create Promo에 종속 | AI Document 기능 누락 | 공통 Asset Action과 문서 대상 API 도입 |
| 빈 Section과 불완전한 구성 | 활성화 또는 Web Output 실패 | 편집·초안·활성화 단계별 Validator 분리 |
| Component의 Section 간 이동 실패 | Instance 또는 콘텐츠 손실 | 원자적 Command·서버 트랜잭션·전체 롤백 |
| Tree와 Preview 순서 불일치 | 화면과 저장 결과 불일치 | 공통 Editor Store와 구조 동등성 테스트 |
| Drag 전용 UI | 키보드·Touch 사용자 작업 불가 | 이동 버튼·메뉴·키보드 Command 병행 |
| Component 무제한 중첩 | 반응형·충돌·저장 복잡도 급증 | 초기 계층을 Page→Section→Component→Field로 제한 |
| 자유 조립으로 관리자 통제 약화 | 필수 고지·고정 구조 누락 | role compatibility, required, fixed, locked 정책 강제 |
| 기존 사전 조립 UI 즉시 삭제 | 운영 Preset 관리 경로 소실 | 신규 Preset 흐름 안정화 후 단계적 축소 |
| Contract 변환 중 Legacy 필드 손실 | 기존 레이아웃 손상 | Round-trip fixture와 원본 Snapshot 보존 |
| 모드별 CSS Override 잔존 | 화면 크기·스크롤 차이 | Host CSS 경계 검사와 Screenshot 회귀 |
| 대규모 `App.vue` 동시 리팩터링 | 회귀 원인 추적 어려움 | Adapter → Workspace → Command 순서로 단계 분리 |
| 세 단계 동시 배포 | 롤백 어려움 | 모드별 Feature Flag와 단계별 Smoke Test |

## 17. 예상 변경 파일

개발 시작 시 현재 소스 상태를 다시 확인해 최종 확정한다.

### Visual Editor

- `visual-editor/src/App.vue`
- `visual-editor/src/editor-context.mjs`
- `visual-editor/src/PromoPageRenderer.vue`
- `visual-editor/src/platform/editor-core/*`
- `visual-editor/src/platform/editor-ui/*`
- 신규 `PageTree.vue`
- 신규 `ComponentLibraryPanel.vue`
- 신규 `SectionPresetPicker.vue`
- `visual-editor/src/platform/adapters/admin-template-adapter.mjs`
- `visual-editor/src/platform/adapters/promo-builder-adapter.mjs`
- `visual-editor/src/platform/adapters/ai-document-adapter.mjs`
- `visual-editor/src/shared/composition/composition-contract-v2.mjs`
- `visual-editor/src/styles.css`

### Create Promo

- `prototype/create-promo.js`
- `prototype/create-promo.html`
- Wizard Snapshot/Storage/Layout Cache 관련 모듈

### API

- Template Layout 조회·저장·활성화 API
- Promo Builder Document 조회·저장 API
- Section/Component Asset 생성·조회 API
- Section Instance 생성·삭제·순서 변경 API 또는 Adapter
- Component Instance 추가·삭제·순서 변경·Section 이동 API 또는 Adapter
- Section Preset 및 Template Preset 저장·조회 API
- 필요 시 revision 및 usage event API

### Tests

- Visual Editor contract/behavior 테스트
- Wizard Layout behavior 테스트
- Create Promo browser smoke 테스트
- 신규 Contract/Adapter/Command/3-mode browser 테스트
- 신규 Page Tree/Canvas Composition/Keyboard Reorder 테스트

### Database

- P0 조사 후 필요한 additive migration만 별도 작성
- 데이터 초기화 migration은 작성하지 않음

## 18. 단계별 승인 Gate

각 단계 완료 후 다음 항목을 확인하고 이상이 없을 때만 다음 단계로 이동한다.

### 공통 Gate

- [ ] 해당 단계 단위 테스트 통과
- [ ] 기존 전체 테스트 통과
- [ ] Visual Editor build 성공
- [ ] 세 모드 중 영향 모드 Browser Smoke 통과
- [ ] Console Error 없음
- [ ] 예상하지 않은 Network 4xx/5xx 없음
- [ ] 저장 데이터 손실 없음
- [ ] Tree와 Live Preview 구조 동등성 확인
- [ ] 구조 변경 Undo/Redo 확인
- [ ] 롤백 방법 확인

### 운영 배포 Gate

- [ ] 배포 Commit SHA 확인
- [ ] 실제 Production URL과 Commit 일치
- [ ] 실제 활성 Template 확인
- [ ] 실제 Builder Document revision 확인
- [ ] 디자인 토큰과 이미지 자산 재진입 유지 확인

## 19. 전체 완료 정의

- [ ] 세 진입 경로가 동일한 `VisualEditorWorkspace`를 사용한다.
- [ ] 세 모드의 Editor 내부 DOM과 CSS 계층이 동일하다.
- [ ] 이동, 리사이즈, 정렬, 선택 및 Undo/Redo가 같은 Command로 처리된다.
- [ ] 세 Adapter가 Composition Contract v2 문서를 Editor Core에 전달한다.
- [ ] 모드별 차이는 Capability, Adapter 및 Host Action으로 제한된다.
- [ ] Template, Promo Override, AI Document 저장 경로가 서로 섞이지 않는다.
- [ ] 디자인 토큰이 세 모드 Preview와 Web Output에 동일하게 적용된다.
- [ ] 키비주얼과 컴포넌트 이미지의 생성·삭제·재생성이 동일하게 동작한다.
- [ ] Preview와 Web Output의 Renderer 결과가 동일하다.
- [ ] 동일 문서와 동일 Command가 세 모드에서 동일한 Snapshot을 생성한다.
- [ ] 통합 Editor에서 빈 Section과 Section Preset 기반 Section을 생성할 수 있다.
- [ ] Component Library의 Component를 Section에 추가·삭제·복제할 수 있다.
- [ ] Page Tree에 Page → Section → Component → Field 계층이 표시된다.
- [ ] Tree에서 Section 순서, Component 순서 및 Component의 Section 간 이동이 가능하다.
- [ ] Tree 구조 변경과 Live Preview 구조가 항상 동기화된다.
- [ ] Tree Drag는 구조를, Preview Drag는 시각적 Layout을 변경한다.
- [ ] 고정·필수·잠금·compatibility 정책이 Drag/Drop과 활성화 단계에서 강제된다.
- [ ] Drag를 사용할 수 없는 사용자를 위한 키보드·메뉴 이동 방식이 제공된다.
- [ ] 완성된 Section과 Page를 선택적으로 Preset으로 저장할 수 있다.
- [ ] 세 모드 Browser E2E와 시각 회귀 테스트가 배포 Gate에 포함된다.
- [ ] 기존 Template, Layout 및 Builder Document가 초기화 없이 정상 동작한다.
- [ ] 안정화 후 중복 모드 분기, 중복 CSS 및 레거시 상태 소유 코드가 제거된다.

## 20. 최종 권고

개발은 `App.vue` UI 재배치부터 시작하지 않는다.

권장 시작점은 다음과 같다.

```text
P0 모드 차이 고정
→ P1 Composition Contract v2 정규화
→ P2 공통 Workspace·Page Tree·Component Library
→ P3 공통 Command Engine·Canvas Composition
→ P4 Adapter·Preset·AI 자산·Revision
→ P5 테스트·점진 배포·레거시 제거
```

가장 중요한 성공 기준은 화면 모양이 같은지가 아니다.

```text
동일한 Editor Document
+ 동일한 Command
= 동일한 Layout Snapshot
+ 동일한 Renderer 결과
```

이 계약이 자동 테스트로 보장될 때 세 에디터가 실제로 통합됐다고 판단한다.

## 21. 2026-07-30 개발 반영 기록

### 완료

- 공통 Editor Document를 `layout + content + sections` 구조로 확장
- Section/Component 생성·삭제·순서 변경·Section 간 이동 Command 및 Undo/Redo 구현
- 세 Builder 모드에서 공통 `StructurePanel` 사용
- Page → Section → Component → Field Tree 구현
- 활성 Component Library 조회, 검색, 버튼 추가 및 Live Preview/Tree Drag & Drop 구현
- 빈 Section 및 활성 Section Preset 기반 Section 생성 구현
- Template Mode의 편집 구조를 Create Promo 작업 상태에 보존
- AI Document의 구조 변경을 Builder Document revision에 저장
- Admin Template Layout의 구조 변경을 layout revision에 저장하도록
  `composition_snapshot` additive migration과 API 계약 구현
- 구조 명령, Snapshot bridge, AI Document 및 Admin composition 저장 계약 테스트 추가

### 운영 반영 전 필수

1. `db/migrations/046_template_layout_composition_snapshot.sql`을 대상 Neon DB에 적용한다.
2. migration 적용 후 애플리케이션을 배포한다. 순서를 반대로 하면 Layout API가 새 컬럼을 읽지 못한다.
3. Admin draft에서 구조를 변경하고 저장한 뒤 재진입하여 Tree/Preview가 동일한지 확인한다.
4. Template 활성화 후 Create Promo에서 동일 구조가 로드되는지 확인한다.
5. AI Document 저장 후 revision을 다시 열어 구조가 유지되는지 확인한다.

### 후속 안정화

- 완성 Section을 관리용 Preset으로 등록하는 별도 저장 UI
- 전체 Page를 Template Preset으로 복제하는 흐름
- Canvas 직접 Section 경계 생성 UX
- 세 모드 실제 DB 기반 Browser E2E와 시각 회귀 기준 이미지
- 안정화 이후 기존 `SectionPanel` 및 중복 Host 상태 제거
