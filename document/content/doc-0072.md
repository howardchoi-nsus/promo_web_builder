# Visual Editor 선택 컴포넌트 컨텍스트 속성 팝업 개발계획서

## 0. 문서 정보

- 작성일: 2026-08-10
- 대상: `visual-editor`
- 문서 상태: 개발 전 계획
- 핵심 변경:
  - Preview에서 컴포넌트 선택 시 선택 영역 인접 위치에 속성 팝업 표시
  - 팝업에서 해당 컴포넌트의 콘텐츠·이미지·CTA·스타일·모션 수정
  - 기존 오른쪽 `COMPONENTS` 고정 속성 패널 제거
- 핵심 원칙: 저장·Undo/Redo·Token·Revision 로직은 유지하고 UI 표현과 선택 상태만 재구성한다.

---

## 1. 현행 구조 분석

### 1.1 현재 흐름

```text
StructurePanel
  → Section·Component 선택

PreviewPanel
  → 선택·드래그·크기 조절·직접 텍스트 편집

PropertyPanel
  → 선택 Section의 모든 Component 목록
  → 선택 Component Accordion 확장
  → Content·Image·CTA·Design·Motion 수정
```

현재 속성 UI는 `App.vue`에 대량의 Template으로 직접 작성돼 있으며 `PropertyPanel.vue`는 Shell 역할만 수행한다. 선택·콘텐츠·스타일 업데이트 함수는 이미 `App.vue`의 단일 상태와 Command History에 연결돼 있다.

### 1.2 재사용할 기존 자산

- `selectedSection`, `selectedItem`, `selectedStyleKey`
- `selectRendererItem()`, `clearEditorSelection()`
- `selectedValue`, `selectedItemStyle`, `selectedItemMotion`
- `updateFieldValue()`, `updateFieldObject()`, `updateObjectField()`
- `updateItemStyle()`, `resetItemStyle()`
- `requestSectionAiAction()`, `requestImageRemoval()`
- `ComponentTransitionControls`
- Editor Command History, Undo/Redo, Save, Revision 계약
- `PreviewPanel.getStageElement()`

### 1.3 핵심 기술 위험

1. 속성 Template이 `App.vue`에 밀집해 팝업으로 이동할 때 회귀 범위가 크다.
2. Preview는 스크롤·확대·Desktop/Mobile Viewport를 지원하므로 선택 영역 좌표를 일반 문서 좌표로 사용하면 팝업 위치가 틀어진다.
3. 팝업이 Preview 컴포넌트를 가리거나 화면 밖으로 나갈 수 있다.
4. 텍스트 직접 편집, Resize Handle, Multi-select와 팝업 열기·닫기가 충돌할 수 있다.
5. 키보드 포커스가 Preview와 팝업 사이에서 유실될 수 있다.

---

## 2. UX 목표

### 2.1 주요 사용자 과제

> Preview의 특정 컴포넌트를 선택한 후 시선을 멀리 이동하지 않고 콘텐츠와 스타일을 수정한다.

### 2.2 행동 원칙

1. 팝업은 마우스 커서가 아니라 **선택된 컴포넌트 영역**에 연결한다.
2. 우측 공간을 우선하되 부족하면 좌측, 하단, 상단 순으로 자동 전환한다.
3. 팝업은 선택된 컴포넌트와 Resize Handle을 가리지 않는다.
4. 다른 컴포넌트 선택 시 팝업은 닫히지 않고 내용과 위치를 갱신한다.
5. Preview 빈 공간 클릭, `Esc`, Section 변경 시 팝업을 닫는다.
6. 팝업을 닫아도 컴포넌트 선택 Outline은 정책에 따라 유지할 수 있다.
7. 값은 현재처럼 즉시 Preview에 반영하고 Undo/Redo에 기록한다.

### 2.3 속성 정보 구조

팝업은 최대 360px 내외의 고정 폭을 기본으로 하고 다음 구조를 사용한다.

```text
【Component 이름】  [잠금 상태]  [닫기]

콘텐츠
  - Text / CTA / Image / Multi-field

스타일
  - 크기 모드, 너비·높이, 이미지 맞춤·초점·형태
  - 위치 상태, 자동 배치 복원

모션
  - ComponentTransitionControls

고급 정보
  - Item key, 필수, 고정, 접근성 정보
```

- 단일 필드 Text·CTA는 콘텐츠 영역을 기본 확장한다.
- Image·Multi-field·스타일·모션은 Accordion으로 분리한다.
- 사용 빈도가 낮은 Item key, 필수, 고정 표시는 `고급 정보`로 이동한다.
- 위험 작업인 이미지 삭제·스타일 초기화는 다른 일반 입력과 시각적으로 분리한다.

---

## 3. 목표 구조

### 3.1 추가 컴포넌트

```text
visual-editor/src/platform/editor-ui/
  ComponentInspectorPopover.vue
  ComponentInspectorContent.vue
  useContextualInspector.mjs
```

#### `ComponentInspectorPopover.vue`

- Popover Shell, Header, Close, Placement Arrow
- 포커스·키보드·외부 클릭 관리
- Max height, 내부 스크롤, Viewport 경계 처리
- `role="dialog"`, `aria-modal="false"`, 제목 연결

#### `ComponentInspectorContent.vue`

- 기존 `App.vue` 속성 Template을 추출
- 단일·다중 Field Content 편집
- CTA·Image·Text 분기
- Design Controls
- Motion Controls
- 잠금·필수·접근성 상태
- 기존 업데이트 Event를 상위로 전달

#### `useContextualInspector.mjs`

- Anchor rectangle 정규화
- Preview Stage 기준 좌표 변환
- 우/좌/하/상 Placement 결정
- Viewport clamp
- Preview 스크롤, Window resize, Editor viewport 변경 추적
- `ResizeObserver`, `requestAnimationFrame` 기반 위치 갱신

### 3.2 Anchor 계약

`PromoPageRenderer`가 선택 Event와 함께 선택 DOM 영역을 식별할 수 있는 안정적인 key를 제공한다.

우선 안:

1. `PreviewPanel.getSelectedItemRect(styleKey)` 메서드를 expose한다.
2. `previewStageRef` 안에서 `data-style-key` 또는 Section·Item data attribute로 선택 DOM을 찾는다.
3. `getBoundingClientRect()`를 Preview Panel 좌표로 변환한다.

금지:

- 마우스 `clientX/clientY`만을 Anchor로 사용
- 렌더러 DOM 순서 또는 `nth-child` 의존
- 선택 Event 직후 고정 delay로 좌표 추정

### 3.3 Placement 규칙

- Popover 폭: 340~380px
- 최소 간격: 12px
- Viewport 안전 여백: 12px
- 우측 공간이 Popover 폭 + 여백 이상이면 `right`
- 우측 부족 시 `left`
- 좌·우 모두 부족 시 `bottom`, 그다음 `top`
- 모든 공간이 부족하면 Preview Panel 오른쪽 경계에 clamp
- Popover 높이는 Preview Panel의 80% 이하, 내부 스크롤
- Arrow는 선택 컴포넌트 중심에 가깝게 배치하되 Popover 모서리와 충돌하지 않도록 clamp

---

## 4. 상태·상호작용 계약

### 4.1 열기

- Preview 컴포넌트 단일 클릭 선택 시 열림
- StructurePanel 컴포넌트 선택 시 해당 Preview로 스크롤한 후 열림
- 이미 선택된 컴포넌트를 다시 클릭해도 팝업은 유지
- 잠긴 컴포넌트도 열리되 제어는 disabled로 표시

### 4.2 닫기

- Close 버튼
- `Esc`
- Preview 빈 공간 클릭
- 다른 Section 선택
- 선택 컴포넌트 삭제·숨김
- Editor Mode 변경 또는 Snapshot 재로드

입력 중 Popover 내부 클릭, Select 선택, Range 조작은 외부 클릭으로 판정하지 않는다.

### 4.3 포커스

- 마우스 선택 시 포커스를 강제로 첫 입력으로 옮기지 않는다.
- 키보드 단축키로 Popover를 열 때는 첫 유효 제어로 포커스 이동
- `Esc`로 닫으면 선택된 Preview 컴포넌트 또는 StructurePanel 항목으로 포커스 복귀
- Popover는 modal이 아니므로 Focus Trap을 사용하지 않는다.
- 키보드만으로 닫기·입력·Accordion·버튼 실행 가능해야 한다.

### 4.4 직접 텍스트 편집

- 단일 클릭: Component 선택 + Popover 열기
- 더블 클릭 또는 현행 편집 Gesture: Preview 직접 Text Edit
- Text Edit 시 Popover는 유지하되 키보드 입력을 가로채지 않는다.
- Preview Text Edit과 Popover 필드는 같은 `sectionInputs` Source of Truth를 사용한다.

### 4.5 Multi-select

1차 범위에서 Multi-select는 다음과 같이 처리한다.

- 2개 이상 선택 시 단일 Component Inspector를 닫는다.
- 기존 Multi Layout AI 제어는 Preview Toolbar 또는 StructurePanel에 유지한다.
- 후속 단계에서 다중 선택 공통 속성 Popover를 별도 검토한다.

---

## 5. 기존 오른쪽 패널 처리

### 5.1 제거 범위

- `App.vue` 내 `<PropertyPanel>`과 Component Accordion 목록
- `.property-panel`, `.component-property-list`, `.component-property-accordion` 레이아웃 의존
- Editor Workspace의 `content` Grid Area
- Builder Mode의 고정 오른쪽 Column

### 5.2 유지·이전 범위

PropertyPanel에 함께 있는 다음 기능은 삭제하지 않고 적절한 위치로 이전한다.

- Multi Layout AI → Preview Toolbar 또는 StructurePanel의 선택 작업 영역
- Component Motion → Component Inspector의 `모션` Section
- 노출 Toggle → Component Inspector Header 또는 Content Section
- Component 목록·선택 → 기존 StructurePanel을 단일 권위 UI로 사용

### 5.3 레이아웃 변경

현재 Builder Workspace가 `Structure / Preview / Property` 세 Column을 사용한다면 변경 후에는 `Structure / Preview` 두 Column으로 간소화한다.

```text
변경 전: [Structure] [Preview] [Properties]
변경 후: [Structure] [Preview + Contextual Inspector]
```

- 확보된 폭은 Preview에 할당한다.
- Admin Layout, Section Preset, AI Document, Create Promo Wizard Mode 모두 같은 Layout Engine을 사용한다.
- 작은 화면에서 Popover가 Preview를 과도하게 가리면 화면 하단 Sheet로 변환한다.

---

## 6. 단계별 개발 계획

## P0. 속성 UI 컴포넌트 추출

### 작업

1. `App.vue` 내 속성 Template을 `ComponentInspectorContent.vue`로 이동한다.
2. 기존 Computed·Update 함수는 상위에 유지하고 Props·Events로 연결한다.
3. Text, CTA, Image, Multi-field, Design, Motion 분기를 보존한다.
4. 기존 PropertyPanel에서 추출한 Content를 임시로 동일하게 렌더링하여 기능 회귀를 먼저 차단한다.

### 완료 기준

- 추출 전·후 모든 속성 입력과 상태가 동일하다.
- Save·Undo/Redo·Revision·Output Snapshot 테스트에 변경이 없다.
- `App.vue` 속성 Template 분량이 대폭 감소한다.

## P1. Anchor Rect 계약

### 작업

1. Renderer Item DOM에 안정적인 Section·Item key를 노출한다.
2. `PreviewPanel.getSelectedItemRect()`를 expose한다.
3. Preview Scroll·Resize·Viewport 변경 시 Rect 갱신 Event를 제공한다.
4. 선택 후 DOM이 재렌더링되는 경우 다음 animation frame에 좌표를 재측정한다.

### 완료 기준

- Desktop·Mobile Viewport에서 선택 Outline과 Anchor Rect가 일치한다.
- Preview 스크롤 후에도 Rect가 선택 컴포넌트를 따라간다.
- Free·Anchored·Auto Layout 모드 모두에서 정상 작동한다.

## P2. Contextual Popover Shell

### 작업

1. Placement, Clamp, Arrow 계산을 구현한다.
2. Close·Esc·Outside Click 규칙을 구현한다.
3. Preview Panel 안에 Popover Portal 영역을 추가한다.
4. `ResizeObserver`와 Preview Scroll Listener를 연결한다.
5. Inspector Content를 Popover에 연결한다.

### 완료 기준

- Popover가 Preview 경계 밖으로 나가지 않는다.
- 선택 컴포넌트와 Resize Handle을 가리지 않는 배치를 선택한다.
- 스크롤·Resize·Viewport 변경 시 열린 Popover가 올바르게 재배치된다.

## P3. 기존 PropertyPanel 제거·레이아웃 확장

### 작업

1. `PropertyPanel` 렌더링을 제거한다.
2. Multi Layout AI를 대체 영역으로 이동한다.
3. Workspace Grid에서 Property Column을 제거한다.
4. Preview에 새로 확보된 폭을 할당한다.
5. 사용되지 않는 PropertyPanel CSS와 Component Accordion CSS를 정리한다.
6. `PropertyPanel.vue`는 참조가 0건이 된 후 삭제하거나 후속 호환 범위가 있으면 Deprecated Shell로 남긴다.

### 완료 기준

- 오른쪽 `COMPONENTS` 고정 패널이 더 이상 노출되지 않는다.
- 기존 패널에 있던 필수 기능이 누락되지 않는다.
- Preview 폭이 넓어지며 불필요한 빈 Column이 없다.

## P4. 접근성·반응형 보완

### 작업

1. Popover 제목, Close, 상태, Input Label의 ARIA 계약을 적용한다.
2. `Esc` 닫기와 Focus Return을 구현한다.
3. 키보드로 Component 선택·Popover 열기·편집·닫기를 지원한다.
4. 200% Zoom과 320px 재배치에서 Bottom Sheet 대체 레이아웃을 적용한다.
5. `prefers-reduced-motion`에서 Popover Transition을 최소화한다.

### 완료 기준

- 키보드만으로 주요 편집 흐름을 완료할 수 있다.
- Screen Reader가 선택 Component와 Popover 제목을 연결해 안내한다.
- 작은 화면에서 Inspector가 화면 밖으로 나가지 않는다.

---

## 7. 예상 변경 파일

| 파일 | 예상 변경 |
|---|---|
| `visual-editor/src/App.vue` | PropertyPanel Template 추출, Inspector 상태·Event 연결, 기존 Panel 제거 |
| `visual-editor/src/platform/editor-ui/PreviewPanel.vue` | Popover Host, Anchor Rect expose, Scroll·Resize 연결 |
| `visual-editor/src/PromoPageRenderer.vue` | 선택 DOM 식별 계약 보완 |
| `visual-editor/src/platform/editor-ui/ComponentInspectorPopover.vue` | 신규 Popover Shell |
| `visual-editor/src/platform/editor-ui/ComponentInspectorContent.vue` | 신규 속성 Editor |
| `visual-editor/src/platform/editor-ui/useContextualInspector.mjs` | 신규 Placement·Lifecycle 로직 |
| `visual-editor/src/platform/editor-ui/PropertyPanel.vue` | 참조 제거 후 삭제 검토 |
| `visual-editor/src/styles.css` | Workspace Grid, Popover, Bottom Sheet, Focus, Responsive CSS |
| `scripts/test-visual-editor-contract.js` | 새 Component·이벤트 계약 |
| `scripts/test-visual-editor-behavior.mjs` | 선택·수정·Undo/Redo 회귀 |
| Browser Test | Placement·Scroll·Focus·Responsive E2E |

Backend API, DB Migration, Builder Document Schema의 변경은 예상하지 않는다.

---

## 8. 테스트 전략

### 8.1 Unit

- 우·좌·하·상 Placement 선택
- Viewport Clamp
- 작은 화면 Bottom Sheet 전환
- Anchor 영역이 없을 때 안전한 Close
- Scroll·Resize Event Coalescing
- 선택 key 변경 시 이전 Observer 해제

### 8.2 Component

- Text·CTA·Image·Multi-field 콘텐츠 편집
- Lock·Required·Visibility 상태
- Image AI·삭제·Alt Text
- Design Size·Position·Reset
- Motion 수정·Replay
- Close·Esc·Outside Click
- Focus Return

### 8.3 Browser E2E

1. Preview Component 선택 → 우측 Popover 표시
2. 화면 오른쪽 Component → 좌측으로 Flip
3. 화면 하단 Component → 상단 또는 Clamp
4. Preview Scroll → 선택 Component 추적
5. Desktop↔Mobile 전환 → Popover 재배치
6. Text·CTA·Image 값 수정 → Preview 즉시 반영
7. Undo·Redo → Popover 입력과 Preview 동시 복원
8. 저장·재진입 → 수정 값과 Geometry 보존
9. Esc → Popover Close + Focus Return
10. 빈 Preview 클릭 → Close
11. Multi-select → Single Inspector Close
12. 320px·200% Zoom → Bottom Sheet 재배치

### 8.4 시각 QA

- Popover가 선택 Component, Handle, CTA를 가리지 않는지
- Preview Toolbar·Text Toolbar·Section Outline과 충돌하지 않는지
- 긴 Text, Multi-field, Image Inspector의 내부 Scroll이 자연스러운지
- Desktop·Mobile Viewport 변경 시 순간적인 Jump·Flicker가 없는지
- 잠금·Disabled·Error·Loading 상태가 색상 외 방법으로 구분되는지

---

## 9. 배포 전략

### 9.1 단계적 적용

1. 속성 Editor 컴포넌트 추출만 먼저 배포
2. Feature Flag 하에 Contextual Popover 추가
3. 기존 PropertyPanel과 Popover를 개발·Preview 환경에서 임시 비교
4. Text·CTA·Image Component 검증
5. Admin Layout·Section Preset·AI Document·Create Promo Mode 확장
6. 기존 PropertyPanel 제거
7. 미사용 CSS·Component 정리

### 9.2 Feature Flag 제안

```text
VISUAL_EDITOR_CONTEXTUAL_INSPECTOR_ENABLED
```

- Flag off: 기존 PropertyPanel
- Flag on: Contextual Inspector + PropertyPanel 미노출
- 운영 검증 후 Flag 제거를 별도 정리 Task로 진행

### 9.3 롤백

- 품질 문제 발생 시 Flag off로 기존 PropertyPanel 복귀
- 데이터 계약과 저장 API는 변경하지 않으므로 데이터 롤백은 불필요
- Popover에서 생성된 Editor Command는 기존 Command History와 동일하게 복원

---

## 10. 완료 정의

- [ ] Preview Component 선택 시 선택 영역 인접 Popover가 열린다.
- [ ] Popover는 마우스 위치가 아닌 Component Rect를 Anchor로 사용한다.
- [ ] 공간에 따라 우·좌·하·상으로 자동 배치된다.
- [ ] Popover가 Preview 경계 밖으로 나가거나 선택 Component를 가리지 않는다.
- [ ] Text·CTA·Image·Multi-field·Design·Motion 기능이 기존과 동일하게 작동한다.
- [ ] 수정 결과가 Preview, Undo/Redo, Save, Reload, Web Output에 보존된다.
- [ ] Esc·Close·Outside Click·Section 변경으로 안전하게 닫힌다.
- [ ] Esc Close 후 포커스가 선택 Component로 복귀한다.
- [ ] Multi-select에서 Single Inspector가 잘못된 공통 속성을 수정하지 않는다.
- [ ] 오른쪽 `COMPONENTS` 고정 패널이 더 이상 노출되지 않는다.
- [ ] Preview가 제거된 Property Column의 폭을 사용한다.
- [ ] 320px Reflow·200% Zoom·Desktop·Mobile Viewport 테스트를 통과한다.
- [ ] Visual Editor 계약·동작·Browser 테스트와 Build가 통과한다.

---

## 11. 권장 착수 순서

1. `ComponentInspectorContent.vue` 추출과 기존 PropertyPanel 내 재연결
2. Text·CTA·Image 수정 회귀 테스트
3. `getSelectedItemRect()` Anchor 계약
4. Placement 함수 Unit Test
5. Contextual Popover Shell과 Feature Flag
6. Scroll·Resize·Viewport·Esc·Focus E2E
7. Multi Layout AI·Motion·Visibility 기능 이전
8. PropertyPanel 미노출 및 Workspace 두 Column 전환
9. 반응형 Bottom Sheet·접근성·시각 QA
10. 운영 검증 후 기존 PropertyPanel·CSS·Flag 제거

첫 구현 단위는 **속성 Editor 추출**과 **Anchor Rect 계약**으로 제한한다. 이 두 단계가 검증되기 전에 기존 PropertyPanel을 제거하지 않는다.
