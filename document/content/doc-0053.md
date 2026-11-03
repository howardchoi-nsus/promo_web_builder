# Live Preview·Visual Editor UX 및 실행 Context 통합 개발계획서

## 0. 문서 정보

- 작성일: 2026-08-14
- 대상 프로젝트: `promo_web_builder`
- 문서 상태: 개발 반영 완료 / 검증 완료
- 기준 화면:
  - `설정 > 섹션 프리셋 관리 > 레이아웃 프리셋`
  - `설정 > 템플릿·레이아웃 관리`
  - `프로모션 빌더 > 템플릿 모드 > Step 3`
  - `프로모션 빌더 > AI 모드`
- 선행 문서:
  - `docs/계획/admin-promo-layout-editor-unification-development-plan-2026-07-24.md`
  - `docs/계획/frontend-platform-unification-and-shared-modules-development-plan-2026-07-24.md`
  - `docs/계획/visual-editor-three-mode-unification-development-plan-2026-07-30.md`
  - `docs/계획/ai-layout-preset-new-legacy-remediation-development-plan-2026-08-14.md`

---

## 1. 검토 결론

4개 Live Preview 진입점은 최종 렌더링에 공통 `PromoPageRenderer`를 사용한다. 설정 2곳, 템플릿 모드 Step 3, AI 문서 편집은 공통 `visual-editor/src/App.vue`와 Editor Core/Layout Engine을 서로 다른 실행 `mode`로 사용한다.

현재 차이는 렌더링 엔진이 아니라 다음 항목에 있다.

1. Visual Editor를 띄우는 Host UX
2. `EditorContext` capability 조합
3. 초기 데이터를 읽는 Adapter
4. 편집 결과를 저장하는 대상
5. 읽기 전용 상태를 강제하는 위치
6. 사용자에게 표시되는 명칭

AI 모드에는 공통 Visual Editor 외에 `CompositionReview.vue`가 직접 `PromoPageRenderer`를 사용하는 읽기 전용 결과 검토 화면도 존재한다. 이 화면과 전체 AI 문서 Visual Editor가 모두 미리보기처럼 인식될 수 있어 명칭과 전환 규칙을 분리해야 한다.

---

## 2. 현재 구조

| 진입점 | URL mode | 공통 App 사용 | 저장 대상 | 현재 Host UX |
|---|---|---:|---|---|
| 섹션 레이아웃 프리셋 | `section-preset` | 예 | `wizard_content_section_layouts.layout_snapshot` | 모달 iframe |
| 템플릿 기본 레이아웃 | `admin-layout` | 예 | `wizard_form_template_layouts` | 설정 화면 인라인 iframe |
| 템플릿 모드 Step 3 | `wizard-layout&source=create-promo` | 예 | 현재 프로모션 인스턴스 상태 | Step 3 인라인 iframe |
| AI 문서 Visual Editor | `ai-document` | 예 | `promo_builder_document_versions` | 전체 페이지 이동 |
| AI 생성 결과 검토 | 해당 없음 | 아니요 | 저장하지 않음 | Builder 내부 읽기 전용 Renderer |

### 2.1 공통 영역

- `visual-editor/src/PromoPageRenderer.vue`
- `visual-editor/src/App.vue`
- `visual-editor/src/platform/editor-core/*`
- `visual-editor/src/platform/layout-engine/*`
- `visual-editor/src/platform/editor-ui/PreviewPanel.vue`
- Desktop/Mobile 전환
- Normal/Selection/Outline 표시 모드
- 선택, 이동, Resize, 텍스트 편집, Undo/Redo

### 2.2 모드별 Adapter

| mode | Adapter | 역할 |
|---|---|---|
| `section-preset` | `section-preset-adapter.mjs` | 섹션과 Layout Preset 조회·저장 |
| `admin-layout` | `admin-template-adapter.mjs` | 템플릿 기본 레이아웃 조회·Revision 저장 |
| `wizard-layout` | `promo-builder-adapter.mjs` | 부모 Step 3과 Snapshot·변경 이벤트 동기화 |
| `ai-document` | `ai-document-adapter.mjs` | AI 문서 조회·Revision 저장·충돌 처리 |

---

## 3. 문제 정의

### 3.1 같은 명칭이 다른 동작을 의미

현재 `Live Preview`라는 명칭이 다음 작업을 모두 의미한다.

- 재사용 가능한 섹션 Layout Preset 저장
- 템플릿 기본 레이아웃 저장
- 현재 프로모션에만 적용되는 인스턴스 편집
- AI 생성 결과의 읽기 전용 확인
- AI 문서 Revision 편집

사용자는 같은 버튼과 제목을 보고도 어디에 저장되는지 예측하기 어렵다.

### 3.2 Host UX 불일치

- 섹션 프리셋은 전용 모달
- 템플릿 기본 레이아웃은 긴 인라인 iframe
- Step 3는 Wizard 문맥상 인라인 iframe
- AI 문서는 전체 화면

설정 화면 2곳은 같은 관리자 편집 업무인데 Host UX가 다르다. 템플릿 기본 레이아웃의 긴 iframe은 설정 화면 스크롤과 편집기 내부 스크롤이 중첩된다.

### 3.3 권한 프리셋이 코드상 분산

`editor-context.mjs`가 주요 capability를 관리하지만 다음 판단은 Host 또는 개별 컴포넌트에도 분산돼 있다.

- iframe `pointer-events: none`
- 읽기 전용 Overlay
- 저장 버튼 비활성화
- Renderer `editable` 계산
- Embedded Shell 표시 여부
- 화면 제목과 상태 문구

따라서 새로운 mode 또는 읽기 전용 상태가 추가되면 UI와 실제 편집 권한이 어긋날 수 있다.

### 3.4 AI 결과 검토와 AI 문서 편집의 경계 불명확

`CompositionReview`는 읽기 전용 결과 확인 화면이고 `mode=ai-document`는 저장 가능한 전체 편집기다. 두 화면이 목적과 저장 효과를 명확히 안내하지 않는다.

### 3.5 Layout Preset과 인스턴스 Snapshot의 용어 혼용

- 섹션 Layout Preset: 실제 복수 재사용 프리셋
- 템플릿 기본 레이아웃: 템플릿 Version당 하나의 기본 Snapshot
- Step 3 Layout: 현재 프로모션의 Override
- AI Layout: 생성된 Builder Document Snapshot

뒤의 세 항목은 섹션 Layout Preset과 같은 의미의 프리셋이 아니다.

---

## 4. 개발 목표

1. 공통 Renderer와 Visual Editor Engine은 유지한다.
2. 설정의 두 Layout 편집 업무는 전용 모달 UX로 통일한다.
3. 템플릿 Step 3는 Wizard 문맥을 유지하기 위해 인라인 편집을 유지한다.
4. AI 문서는 전체 페이지 Visual Editor를 유지한다.
5. `Live Preview`는 편집기 내부 Canvas 명칭으로만 사용한다.
6. 각 진입 버튼과 화면 제목은 작업 목적과 저장 대상을 표시한다.
7. mode별 capability, 제목, 저장 대상, 읽기 전용 정책을 하나의 Context Manifest에서 관리한다.
8. 읽기 전용은 Host Overlay뿐 아니라 Visual Editor Engine에서도 강제한다.
9. 기존 Layout Snapshot과 Builder Document를 Migration 없이 계속 읽을 수 있어야 한다.

---

## 5. 비범위

- `PromoPageRenderer`를 새 렌더러로 교체하지 않는다.
- `App.vue`를 mode별 별도 애플리케이션으로 복제하지 않는다.
- Layout/Document DB Schema를 변경하지 않는다.
- 기존 저장 Snapshot을 일괄 재작성하지 않는다.
- AI Composition v2/v3 후보 선택 정책을 변경하지 않는다.
- LLM Prompt 본문을 변경하지 않는다.
- Web Output의 출력 결과와 CSS 계약을 변경하지 않는다.

---

## 6. 목표 UX 및 명칭

### 6.1 화면별 표시 명칭

| 위치 | 현재 표현 | 변경 표현 | 보조 설명 |
|---|---|---|---|
| 섹션 프리셋 버튼 | `Live Preview 편집` | `레이아웃 프리셋 편집` | 이 섹션의 Desktop/Mobile 프리셋을 저장합니다. |
| 섹션 프리셋 모달 | `Visual Editor` | `레이아웃 프리셋 편집기` | 저장 대상: 선택한 Layout Preset |
| 템플릿 설정 | `Live Preview` | `템플릿 기본 레이아웃 편집` | 새 프로모션의 시작 레이아웃을 저장합니다. |
| 템플릿 Step 3 | `Live Preview` | `프로모션 레이아웃 편집` | 현재 프로모션에만 적용됩니다. |
| AI 결과 검토 | 암묵적 Preview | `AI 생성 결과 미리보기` | 아직 편집 화면이 아닙니다. |
| AI 문서 | `AI Promotion Visual Editor` | `AI 프로모션 편집기` | 저장 시 AI 문서 Revision이 증가합니다. |
| 공통 Canvas | `Live Preview` | `Live Preview` 유지 | 최종 렌더링 결과를 직접 편집하는 영역 |

### 6.2 설정 화면 Modal 정책

설정의 두 편집 업무는 동일한 Modal Host 규칙을 사용한다.

- `showModal()` 기반 접근 가능한 native dialog
- 최대 `96vw × 94vh`
- 모바일 `100vw × 100dvh`
- 배경 스크롤 잠금
- ESC, 배경 클릭, 닫기 버튼 지원
- 모달 제목, 설명, 저장 대상 표시
- 닫은 뒤 진입 버튼으로 Focus 복원
- iframe loading/error/read-only 상태 공통 표시
- 저장 완료 후 모달을 닫지 않고 연속 편집 가능
- 저장되지 않은 변경이 있으면 닫기 확인

### 6.3 템플릿 Step 3 정책

Step 3는 다음 이유로 인라인 iframe을 유지한다.

- Wizard 단계 내 입력 내용과 실시간 동기화
- Step 이동 및 검증 문맥 유지
- 관리자 기본 레이아웃 초기화와 변경 확인 기능 연계
- 부모 `create-promo.js`가 Snapshot Source of Truth 역할 수행

대신 iframe 상단에 다음 정보를 표시한다.

- `프로모션 레이아웃 편집`
- 기준 템플릿과 Layout Revision
- `저장 범위: 현재 프로모션`
- `관리자 기본 레이아웃에는 영향을 주지 않습니다.`

### 6.4 AI 모드 정책

- `CompositionReview`는 `AI 생성 결과 미리보기`로 명시한다.
- 읽기 전용 Badge를 표시한다.
- `Visual Editor에서 편집` CTA를 제공한다.
- 자동 이동 정책을 유지할 경우 이동 직전 목적을 안내한다.
- Asset Warning이 있는 경우 `이미지 없이 편집 계속`과 `이미지 생성 재시도`를 유지한다.
- `mode=ai-document` 화면에서는 저장 대상과 현재 Document Revision을 고정 표시한다.

---

## 7. Editor Context Manifest 통합

### 7.1 목표 계약

`createEditorContext(mode, source, runtimeState)`가 다음 정보를 한 번에 반환하도록 확장한다.

```js
{
  engineKey: "promo-live-preview",
  mode: "admin-layout",
  surface: "template-default",
  presentation: "modal",
  title: "템플릿 기본 레이아웃 편집기",
  canvasTitle: "Live Preview",
  saveTarget: "template-default-layout",
  saveTargetLabel: "템플릿 기본 레이아웃",
  embedded: true,
  readOnly: false,
  capabilities: {
    canMutate: true,
    canEditContent: false,
    canEditStructure: true,
    canEditDesignTokens: true,
    canRunSectionAi: false,
    canSave: true
  }
}
```

### 7.2 원칙

- `canMutate = false`이면 모든 Editor Command를 거부한다.
- 저장 버튼 비활성화만으로 읽기 전용을 구현하지 않는다.
- Host iframe `pointer-events`와 Overlay는 사용자 안내용 2차 방어로만 사용한다.
- `presentation`은 Host 권장값이며 Visual Editor Engine의 기능을 변경하지 않는다.
- 표시 문구는 Locale Key 또는 UI Catalog에서 관리한다.
- mode별 capability를 Vue Template 곳곳에서 다시 계산하지 않는다.

### 7.3 권장 Capability Matrix

| capability | section-preset | admin-layout | create-promo | ai-document |
|---|---:|---:|---:|---:|
| `canMutate` | Draft만 | Draft만 | 예 | 예 |
| `canEditContent` | 예 | 아니요 | 예 | 예 |
| `canEditStructure` | 아니요 | 예 | 예 | 예 |
| `canEditDesignTokens` | 아니요 | 예 | 아니요 | 예 |
| `canRunSectionAi` | 아니요 | 아니요 | 예 | 예 |
| `canRunSectionLayoutAi` | 아니요 | 아니요 | 예 | 아니요 |
| `canManageComponents` | 아니요 | 예 | 예 | 예 |
| `canSaveSectionPreset` | 예 | 아니요 | 아니요 | 아니요 |
| `canSaveTemplateLayout` | 아니요 | 예 | 아니요 | 아니요 |
| `canSyncPromoOverrides` | 아니요 | 아니요 | 예 | 아니요 |
| `canSaveAiDocument` | 아니요 | 아니요 | 아니요 | 예 |

---

## 8. 공통 Host 구성

### 8.1 Vue 관리자 Host

신규 공통 컴포넌트를 추가한다.

```text
VisualEditorDialogHost.vue
├─ dialog lifecycle
├─ focus restoration
├─ body scroll lock
├─ iframe loading/error state
├─ read-only notice
├─ trusted postMessage validation
├─ unsaved change guard
└─ title/save target presentation
```

적용 대상:

- `SectionLayoutVisualEditorFrame.vue`
- `TemplateLayoutManager.vue`

섹션과 템플릿의 Adapter 및 저장 이벤트는 각각 유지하되 dialog lifecycle과 공통 UI만 Host로 추출한다.

### 8.2 Create Promo Host

Create Promo는 Vanilla JavaScript 기반이므로 Vue Host를 직접 사용하지 않는다. 대신 다음 계약을 공유한다.

- Visual Editor URL Builder
- Message Type 상수
- Snapshot revision 규칙
- trusted origin/source 검증
- 화면 제목·저장 대상 UI Catalog

### 8.3 공통 URL Builder

mode 문자열을 여러 파일에서 직접 조립하지 않도록 다음 유틸리티를 도입한다.

```text
visual-editor/src/platform/visual-editor-entry.mjs
```

제공 함수:

- `createSectionPresetEditorUrl()`
- `createAdminLayoutEditorUrl()`
- `createPromoInstanceEditorUrl()`
- `createAiDocumentEditorUrl()`
- `createOutputUrl()`

기존 Service와 Builder는 해당 함수 또는 동일 계약의 Browser-safe 모듈을 사용한다.

---

## 9. 읽기 전용 및 변경 감지

### 9.1 Engine 강제

- Editor Command 실행 전 `context.capabilities.canMutate` 확인
- Drag, Resize, Content Edit, Structure Edit 모두 동일 Gate 사용
- 저장 API 호출 전 Context와 Entity Status 재확인
- 읽기 전용 상태에서 iframe DOM을 직접 조작해도 변경 명령이 적용되지 않도록 처리

### 9.2 변경 감지

- Editor Core의 `dirty` 상태를 Host로 전달
- 공통 Message 추가:
  - `promo-visual-editor-dirty-state`
  - `promo-visual-editor-close-request`
- Modal 닫기 시 dirty이면 확인 Dialog 표시
- 저장 완료 시 dirty를 false로 갱신
- Step 3는 자동 동기화가 완료되면 dirty를 해소한 것으로 처리

### 9.3 Message 보안

- `event.origin === location.origin`
- `event.source === iframe.contentWindow`
- 예상 mode와 Entity ID 일치
- 알 수 없는 Message Type 무시
- Snapshot Revision이 이전 값보다 낮으면 무시

---

## 10. 파일별 개발 범위

### 10.1 Visual Editor 공통

| 파일 | 작업 |
|---|---|
| `visual-editor/src/editor-context.mjs` | Context Manifest, title/saveTarget/readOnly/canMutate 추가 |
| `visual-editor/src/App.vue` | 분산 mode 문구 제거, Context 기반 Shell·상태·저장 Gate 적용 |
| `visual-editor/src/platform/editor-core/create-editor-store.mjs` | read-only Command Gate 추가 |
| `visual-editor/src/platform/editor-ui/PreviewPanel.vue` | 저장 대상 안내 및 Context 기반 editable 적용 |
| `visual-editor/src/platform/editor-ui/EditorPreviewControls.vue` | 공통 Canvas 명칭과 mode별 Host action 정리 |
| `visual-editor/src/platform/visual-editor-entry.mjs` | 공통 URL Builder 신규 추가 |
| `visual-editor/src/platform/adapters/*` | Adapter 결과에 entity status/revision 표준화 |

### 10.2 설정 화면

| 파일 | 작업 |
|---|---|
| `admin-app/src/components/VisualEditorDialogHost.vue` | 공통 Modal Host 신규 추가 |
| `admin-app/src/components/SectionLayoutVisualEditorFrame.vue` | 공통 Host 사용으로 단순화 |
| `admin-app/src/components/SectionLayoutPresetManager.vue` | 버튼·설명 명칭 변경 |
| `admin-app/src/components/TemplateLayoutManager.vue` | 인라인 iframe을 진입 버튼+Modal Host로 전환 |
| `admin-app/src/services/section-layout-preset-service.mjs` | 공통 URL 계약 적용 |
| `admin-app/src/services/template-layout-service.mjs` | 공통 URL 계약 적용 |
| `prototype/index.html` | 설정 설명·저장 범위 문구 보완 |

### 10.3 템플릿 모드

| 파일 | 작업 |
|---|---|
| `prototype/create-promo.js` | Step 3 명칭·저장 범위 안내, URL Builder/Bridge 계약 적용 |
| `prototype/create-promo.css` | 저장 대상 Badge와 좁은 화면 대응 |
| `visual-editor/src/platform/adapters/promo-builder-adapter.mjs` | dirty/sync 완료 Message 계약 추가 |

### 10.4 AI 모드

| 파일 | 작업 |
|---|---|
| `visual-editor/src/builder/CompositionReview.vue` | 읽기 전용 결과 Preview 명칭과 편집 CTA 추가 |
| `visual-editor/src/builder/AiBuilderApp.vue` | AI 결과 검토 → AI 문서 편집 전환 규칙 명확화 |
| `visual-editor/src/platform/adapters/ai-document-adapter.mjs` | Revision/saveTarget 표준 상태 반환 |
| `visual-editor/src/builder/ai-builder.css` | 읽기 전용 Badge와 CTA 배치 |

### 10.5 Locale·UI Catalog

| 파일 | 작업 |
|---|---|
| `locales/ko.json` | 목적별 편집기 명칭·저장 대상 문구 추가 |
| Locale seed migration 또는 관리자 Locale API | 운영 Locale과 동기화 필요 시 별도 Migration |
| `scripts/test-locale-baseline-contract.js` | 신규 Locale Key 계약 추가 |

LLM Prompt 본문 변경은 없으며 `LLM 및 프롬프트 관리` 작업도 필요하지 않다.

---

## 11. 구현 단계

### Phase 0. 기준선 고정

1. 4개 mode URL과 현재 Browser Fixture 기록
2. mode별 capability Snapshot 테스트 작성
3. 동일 Snapshot의 `PromoPageRenderer` 출력 비교
4. 기존 Layout/Document 저장 API 회귀 테스트 확보

완료 기준: 리팩터링 전 동작과 저장 대상을 자동 테스트로 재현할 수 있다.

### Phase 1. Context Manifest

1. `editor-context.mjs`를 Manifest 구조로 확장
2. 기존 capability 이름에 호환 Alias 유지
3. `App.vue`, `PreviewPanel.vue`의 분산 mode 판단을 Context로 이동
4. Context 단위 테스트 추가

완료 기준: mode별 기능·제목·저장 대상·Embedded 여부가 한 파일에서 확인된다.

### Phase 2. Engine 읽기 전용 강제

1. `canMutate` Gate 구현
2. Command, Drag, Resize, Text Edit, Structure Edit에 적용
3. Host Overlay는 안내용으로 유지
4. Draft/Active/Inactive 상태별 테스트 추가

완료 기준: 읽기 전용 URL에서 DOM 이벤트를 직접 발생시켜도 Snapshot이 변경되지 않는다.

### Phase 3. 설정 Modal Host 통합

1. `VisualEditorDialogHost.vue` 작성
2. 기존 섹션 프리셋 모달을 공통 Host로 이전
3. 템플릿 기본 레이아웃을 인라인에서 모달로 전환
4. Focus 복원, ESC, 배경 클릭, 스크롤 잠금 검증
5. dirty 닫기 확인 적용

완료 기준: 설정의 두 편집기가 동일 Modal UX와 loading/error/read-only 규칙을 사용한다.

### Phase 4. 명칭 및 저장 대상 안내

1. 진입 버튼과 화면 제목 변경
2. Context 기반 저장 대상 Badge 추가
3. Step 3에 현재 프로모션 전용 안내 추가
4. AI 결과 검토에 읽기 전용 표시와 편집 CTA 추가
5. Locale Key 및 번역 검증

완료 기준: 모든 화면에서 편집 결과가 어디에 저장되는지 화면만 보고 구분할 수 있다.

### Phase 5. URL·Message 계약 정리

1. 공통 URL Builder 추가
2. 관리자 Service와 AI Builder 진입 URL 교체
3. Create Promo Bridge의 dirty/sync Message 추가
4. origin/source/entity/revision 검증 통합

완료 기준: mode 문자열과 Message Type의 임의 하드코딩이 계약 모듈 밖에 남지 않는다.

### Phase 6. 통합 검증·배포

1. 단위·Contract 테스트
2. 관리자 Browser 테스트
3. Create Promo Template Mode Browser 테스트
4. AI Builder Browser 테스트
5. Live Preview와 Web Output 시각 동등성 검증
6. Admin/Visual Editor Production Build

---

## 12. 테스트 계획

### 12.1 Context 단위 테스트

- 모든 mode의 `engineKey`가 `promo-live-preview`
- mode별 `surface`, `presentation`, `saveTarget` 정확성
- Draft/Active 상태별 `canMutate`
- `section-preset`은 구조 편집 불가
- `admin-layout`은 콘텐츠 입력 제한
- `create-promo`는 부모 Snapshot 동기화
- `ai-document`는 Revision 저장

### 12.2 Renderer 동등성 테스트

같은 `content`, `designSpec`, `assets`, `motionSpec`을 다음 화면에 전달하고 출력 DOM과 주요 계산 스타일을 비교한다.

- Section Preset Visual Editor
- Admin Template Visual Editor
- Create Promo Step 3
- AI Document Visual Editor
- AI CompositionReview
- Web Output

허용 차이:

- 편집 가이드
- 선택 Outline
- Resize Handle
- 읽기 전용 Badge
- Host Toolbar

허용하지 않는 차이:

- 섹션 순서
- 컴포넌트 위치·크기
- 텍스트·이미지 콘텐츠
- 디자인 토큰 결과
- 배경 이미지와 Fade
- Motion Spec

### 12.3 관리자 Browser 테스트

- 두 설정 편집기가 Modal로 열림
- 페이지 스크롤이 증가하지 않음
- ESC·배경 클릭·닫기 버튼 정상
- 닫기 후 Focus 복원
- dirty 상태에서 닫기 확인
- Draft는 편집 가능, Active/Inactive는 읽기 전용
- 섹션 저장은 Layout Preset만 변경
- 템플릿 저장은 Template Layout Revision만 증가

### 12.4 템플릿 Step 3 Browser 테스트

- 인라인 iframe 유지
- 관리자 기본 레이아웃에서 초기화
- 편집 결과가 현재 프로모션 상태에만 반영
- 관리자 Template Layout은 변경되지 않음
- Step 이동 후 상태 복원
- 부모/iframe Snapshot Revision 역전 방지

### 12.5 AI Browser 테스트

- 생성 결과 검토가 읽기 전용으로 표시
- `Visual Editor에서 편집`으로 `mode=ai-document` 이동
- AI 문서 저장 시 Revision 증가
- 충돌 시 Rebase/Reload 안내 유지
- Asset Warning 상태에서 재시도와 편집 계속 가능
- Web Output은 저장된 최신 Revision 사용

---

## 13. 배포 순서

1. Context Manifest와 호환 Alias 배포
2. 읽기 전용 Engine Gate 활성화
3. 공통 Modal Host와 설정 명칭 배포
4. 템플릿 기본 레이아웃 Modal 전환
5. Step 3 저장 범위 안내 배포
6. AI 결과 검토 명칭·CTA 배포
7. URL/Message 계약 정리
8. 전체 Browser/E2E 확인 후 호환 Alias 제거 검토

DB Schema Migration은 필요하지 않다. Locale 메시지를 DB로 운영하는 환경에서는 신규 Locale Key seed만 별도 적용한다.

---

## 14. 롤백

- Context Manifest 문제 시 기존 boolean capability Alias로 즉시 복귀
- 공통 Modal Host 문제 시 기존 섹션 모달과 템플릿 인라인 iframe으로 각각 복귀
- URL Builder 문제 시 기존 URL 생성 함수로 복귀
- AI 결과 검토 변경은 Builder UI만 롤백하고 Document Snapshot은 유지
- 저장 Schema와 기존 Snapshot을 변경하지 않으므로 데이터 롤백은 필요하지 않음
- 빌드 산출물은 Vue 소스와 동일 커밋 단위로 되돌림

---

## 15. 위험 및 대응

| 위험 | 영향 | 대응 |
|---|---|---|
| Context 리팩터링으로 capability 누락 | 편집 기능 비노출 또는 과다 노출 | 기존 이름 호환 Alias와 mode Snapshot 테스트 |
| Modal 내부 iframe Focus 문제 | 키보드 사용 어려움 | native dialog, Focus Trap, 복원 테스트 |
| dirty 판단 오류 | 변경 유실 또는 불필요한 경고 | Editor Core dirty를 Source of Truth로 사용 |
| read-only Gate가 저장만 막고 편집을 허용 | 화면과 데이터 불일치 | Command 계층에서 mutation 거부 |
| Step 3 postMessage 순환 | 반복 렌더·Revision 증가 | applying flag와 revision 비교 유지 |
| AI 결과 Preview와 문서 Snapshot 불일치 | 검토 결과와 편집 결과 차이 | 동일 Snapshot·Renderer 동등성 테스트 |
| 템플릿 Modal 전환으로 작은 화면 iframe 축소 | 편집성 저하 | 모바일 전체 화면과 viewport 테스트 |

---

## 16. 완료 조건

1. 4개 진입점이 동일 `PromoPageRenderer`를 사용한다는 계약 테스트가 존재한다.
2. 설정의 섹션·템플릿 편집기가 동일 Modal Host를 사용한다.
3. 템플릿 Step 3는 인라인 편집을 유지하며 현재 프로모션 전용임을 표시한다.
4. AI 생성 결과 검토와 AI 문서 편집의 명칭·권한이 구분된다.
5. 모든 mode의 capability, 제목, 저장 대상이 Context Manifest에서 관리된다.
6. 읽기 전용 상태에서는 Editor Command가 Snapshot을 변경하지 않는다.
7. 각 화면에 저장 대상과 Revision 또는 Preset 식별자가 표시된다.
8. 기존 Section Layout, Template Layout, Builder Document가 Migration 없이 열린다.
9. Live Preview와 Web Output의 렌더링 결과가 일치한다.
10. 단위·Contract·Browser 테스트와 Admin/Visual Editor Build가 통과한다.

---

## 17. 개발 우선순위

### P0

- Context Manifest
- Engine read-only Gate
- 설정 두 화면 Modal UX 통일
- 목적별 명칭과 저장 대상 표시
- mode별 Contract/Browser 테스트

### P1

- dirty 상태 Message와 닫기 확인
- 공통 URL Builder
- Message Type·검증 계약 정리
- AI 결과 검토 → Visual Editor 전환 CTA

### P2

- Renderer 시각 동등성 자동 비교 범위 확대
- 공통 Host를 다른 Visual Editor 진입점으로 확장
- 운영 Telemetry에 mode/surface/saveTarget 기록

---

## 18. 최종 개발 원칙

이번 개선은 엔진을 새로 만드는 작업이 아니다. 이미 단일화된 Renderer와 Visual Editor Engine을 유지하면서 사용자에게 작업 목적과 저장 범위를 명확히 보여주고, mode별 기능 차이를 선언적인 Context 계약으로 관리하는 작업이다.

`Live Preview`는 공통 Canvas 명칭으로 유지하고, 외부 진입점은 `레이아웃 프리셋 편집`, `템플릿 기본 레이아웃 편집`, `프로모션 레이아웃 편집`, `AI 생성 결과 미리보기`, `AI 프로모션 편집기`처럼 실제 업무를 표현해야 한다.

---

## 19. 개발 반영 결과

반영일: 2026-08-14

- `editor-context.mjs`를 mode별 title, presentation, saveTarget, runtime read-only 상태를 포함하는 Context Manifest로 확장했다.
- Editor Core의 command, undo, redo 계층에 `EDITOR_READ_ONLY` 차단을 추가했다.
- 설정 화면의 섹션 레이아웃 프리셋과 템플릿 기본 레이아웃이 동일한 `VisualEditorDialogHost.vue`를 사용하도록 통합했다.
- 공통 모달에 ESC·배경 클릭·닫기 버튼, 배경 스크롤 잠금, 포커스 복원, iframe loading/read-only, dirty 종료 확인을 반영했다.
- 템플릿 기본 레이아웃의 인라인 iframe을 모달 진입 버튼으로 변경했다.
- 템플릿 Step 3에는 현재 프로모션 전용 저장 범위와 관리자 기본 레이아웃 비영향 안내를 추가했다.
- AI 결과 화면을 `AI 생성 결과 미리보기`로 명명하고 읽기 전용 Badge와 `Visual Editor에서 편집` CTA를 추가했다.
- 공통 Visual Editor URL Builder와 dirty Message Type 계약을 추가했다.
- 저장 성공 또는 Step 3 부모 동기화 완료 시 Editor Core dirty 상태가 해제되도록 연결했다.
- Admin/Visual Editor production build와 관련 unit, contract, browser 테스트를 통과했다.

DB Schema와 LLM Prompt는 변경하지 않았으므로 Migration 및 Prompt seed 작업은 필요하지 않다.
