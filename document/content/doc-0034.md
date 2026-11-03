# 복합 컴포넌트 자식 필드 개별 속성·레이아웃 제어 개발계획서

## 0. 문서 정보

- 작성일: 2026-08-17
- 대상 프로젝트: `promo_web_builder`
- 대상 화면: AI 프로모션 편집기, Template/Layout 편집기, Section Preset 편집기 Live Preview
- 문서 상태: 개발 반영 및 전체 회귀 검증 완료
- 권장 개발 단계: 5개 Phase
- 우선순위: P0
- 관련 문서:
  - `docs/계획/ai-promotion-editor-layout-and-json-inspector-development-plan-2026-08-16.md`
  - `docs/계획/ai-promotion-component-drag-and-overlap-remediation-development-plan-2026-08-17.md`
  - `docs/계획/visual-editor-contextual-component-inspector-development-plan-2026-08-10.md`

---

## 1. 요청 목적

이미지·텍스트·CTA가 조합된 Promotion Card를 현재처럼 하나의 상위 프레임으로만 제어하지 않고, 내부 요소를 각각 선택하여 속성과 레이아웃을 변경할 수 있게 한다.

최종 편집 단위는 다음과 같이 구분한다.

```text
Promotion Card                         ← 부모 Component
├─ Card Image                          ← 자식 Field Component
├─ Card Description                    ← 자식 Field Component
└─ Card Action                         ← 자식 Field Component
```

부모는 카드 전체 구조를, 자식은 각 요소의 콘텐츠·디자인·배치를 담당한다.

---

## 2. 현행 구조 검토 결과

### 2.1 이미 구현된 범위

복합 컴포넌트의 Field는 다음 키로 개별 식별되고 있다.

```text
{sectionKey}.{itemKey}.{fieldKey}
```

예시:

```text
registryCardGrid.cardOne.image
registryCardGrid.cardOne.description
registryCardGrid.cardOne.action
```

현재 지원되는 Field별 기능:

- 콘텐츠 값 편집
- Field 노출 여부
- 텍스트 글꼴·크기·색상·정렬
- 이미지 맞춤·초점·비율·모서리
- CTA 글자색·배경색·문구·URL
- Desktop/Mobile Field Style 저장
- Field Style 초기화

### 2.2 부족한 범위

현재 Field는 `.rendered-component-fields` Grid 내부에 순차 렌더링되며, 직접 조작 핸들은 부모 `.rendered-item`에만 존재한다.

따라서 다음 기능이 없다.

- 이미지·텍스트·CTA별 독립 선택 프레임
- 자식 Field별 속성 아이콘
- 자식 Field 너비·최소 높이 제어
- 자식 Field 정렬과 여백 제어
- 자식 Field 순서 변경
- 자식 Field 직접 Resize
- 부모 카드와 자식 Field의 선택 계층 표시
- 자식 크기 변경 후 부모 자동 높이 및 다음 카드 위치 재계산

특히 `TextEditorControls`는 Field 선택 시 `show-layout-controls="false"`로 동작하여 Field 레이아웃 제어를 의도적으로 숨기고 있다.

### 2.3 문제 정의

| 문제 | 직접 원인 | 결과 |
|---|---|---|
| 카드 전체만 점선 표시 | 선택 프레임이 부모 Item에만 존재 | 어떤 내부 요소가 편집 대상인지 불명확 |
| Field별 이동·크기 변경 불가 | Resize·Drag가 Item 단위로만 구현 | 이미지·텍스트·CTA 구성을 개별 조정할 수 없음 |
| 속성창 진입점이 부모에만 존재 | `f1de` 아이콘이 부모 프레임에만 연결 | Field 클릭 후에도 한 덩어리로 보임 |
| 레이아웃 속성 미노출 | Field 선택 시 Layout Controls 숨김 | 저장 키는 있지만 조정 UI가 없음 |
| 자유 이동 시 재중첩 위험 | 부모 높이 계산과 자식 좌표 계약 부재 | 카드 내부 및 카드 간 중첩 가능 |

---

## 3. 개발 원칙

### 3.1 부모·자식 계층 유지

복합 카드를 세 개의 독립 Section Item으로 해체하지 않는다.

이유:

- 카드 복제·반복 Collection 계약 유지
- 이미지·설명·CTA Content Binding 유지
- 카드 단위 이동·삭제·복제 유지
- 부모 Surface, Radius, Shadow, Padding 유지
- AI Composition의 Component Instance 식별자 유지

### 3.2 기본 배치는 Stack/Grid

P0에서는 자식 Field를 절대 좌표로 자유 이동시키지 않는다.

기본 제공 속성:

```text
order
widthPct
minHeightPx
horizontalAlign
alignSelf
marginTopPx
marginBottomPx
```

부모 제공 속성:

```text
fieldLayoutMode: stack | grid
fieldGapPx
contentPaddingPx
horizontalAlign
```

자유 좌표는 P2 고급 기능으로 분리한다.

```text
positionMode: flow | free
xPct
yPx
```

### 3.3 기존 저장 구조 재사용

Field Style은 기존 `designSpec.itemStyles`를 사용한다.

```json
{
  "itemStyles": {
    "registryCardGrid.cardOne": {
      "widthPct": 42,
      "fieldGapPx": 14,
      "contentPaddingPx": 12
    },
    "registryCardGrid.cardOne.image": {
      "order": 0,
      "widthPct": 100,
      "minHeightPx": 260,
      "horizontalAlign": "stretch",
      "aspectRatio": "4:3"
    },
    "registryCardGrid.cardOne.description": {
      "order": 10,
      "widthPct": 100,
      "horizontalAlign": "left",
      "marginTopPx": 4
    },
    "registryCardGrid.cardOne.action": {
      "order": 20,
      "widthPct": 100,
      "horizontalAlign": "center",
      "minHeightPx": 48
    }
  }
}
```

Mobile Override도 기존 구조를 사용한다.

```text
designSpec.responsiveLayouts.mobile.itemStyles[section.item.field]
```

### 3.4 Prompt·DB 정책

- LLM Prompt 추가·수정: 필요 없음
- DB Schema Migration: 필요 없음
- Seed 수정: 기본 Field Layout을 Registry에 영구 기본값으로 제공할 경우에만 별도 검토
- 기존 AI 문서 데이터 보정 SQL: 필요 없음

기존 문서에 Field Layout 값이 없으면 현재 Grid/Stack 렌더링을 기본값으로 사용한다.

---

## 4. 목표 UX

### 4.1 부모 선택

카드의 빈 영역 또는 바깥 프레임을 클릭하면 부모 Component가 선택된다.

표시:

- 카드 전체 선택 프레임
- `f0b2` 부모 이동 아이콘
- `f1de` 부모 속성 아이콘
- 부모 Resize Handle

부모 속성:

- 카드 전체 너비·위치
- Surface·Radius·Shadow
- Padding·Field Gap
- Stack/Grid Layout Mode
- 전체 노출·잠금

### 4.2 자식 Field 선택

이미지·텍스트·CTA를 클릭하면 해당 Field만 선택한다.

표시:

- 선택 Field 실제 DOM 영역에 내부 선택 프레임
- Field 전용 `f1de` 속성 아이콘
- Resize 가능한 Field에만 Resize Handle
- 부모 프레임은 계층 확인용 약한 가이드로 유지

속성창 제목:

```text
Promotion Card > Card Image
Promotion Card > Card Description
Promotion Card > Card Action
```

### 4.3 속성창 활성화

컴포넌트 또는 Field 클릭은 선택만 수행한다.

```text
Field 클릭
  → Field 선택
  → 속성창 미노출

선택된 Field의 f1de 클릭
  → Field Inspector 활성화
```

부모 `f1de`는 부모 Inspector, 자식 `f1de`는 Field Inspector를 연다.

### 4.4 Field별 제어 범위

| Field 유형 | 콘텐츠 | 디자인 | 레이아웃 |
|---|---|---|---|
| Image | URL·AI 이미지·Alt | Fit·Focus·Radius·Aspect Ratio | Width·Min Height·Align·Margin·Order |
| Text | 본문 | Font·Size·Weight·Color·Line Height·Text Align | Width·Align·Margin·Order·Auto Height |
| CTA | Label·URL·Target | Text Color·Background·Radius·Typography | Width·Height·Align·Margin·Order |

### 4.5 키보드·접근성

- 모든 속성 아이콘은 `button` 사용
- `aria-label="Card Image 속성 열기"` 형식 적용
- Field 선택 상태는 `aria-selected` 또는 `aria-pressed`로 표현
- `Enter` 또는 `Space`: Field 속성 열기
- `Escape`: Inspector 닫기 → Field 선택 유지
- 두 번째 `Escape`: Field 선택을 부모 선택으로 승격
- 키보드 Resize는 방향키, 큰 단위는 `Shift + 방향키`
- Pointer Handle 최소 Hit Area 28×28px 유지

---

## 5. 데이터·렌더링 계약

### 5.1 Field Layout Style 정규화

신규 Layout Engine Helper를 추가한다.

```text
normalizeComponentFieldLayoutStyle(style, field, parentStyle)
```

입력:

- Field 정의
- Desktop/Mobile 병합 Style
- 부모 Layout Mode
- Field Kind별 기본값

출력:

```js
{
  order,
  width,
  minHeight,
  alignSelf,
  justifySelf,
  marginTop,
  marginBottom
}
```

Renderer에서 저장 값 `widthPct`, `minHeightPx`를 CSS `width`, `minHeight`로 명시적으로 변환한다. 현재처럼 Field Style 객체를 그대로 DOM Style에 확장하여 의미가 다른 속성이 섞이지 않게 한다.

### 5.2 선택 계약

현재 선택 키를 유지한다.

```text
selectedStyleKey      = section.item
selectedFieldStyleKey = section.item.field
selectedTargetStyleKey = selectedFieldStyleKey || selectedStyleKey
```

추가 상태:

```text
selectedTargetType = component | component-field
componentInspectorOpen
```

Renderer Event:

```text
select-item
select-field
open-item-inspector
open-field-inspector
resize-field
reorder-field
```

이벤트 대상에는 항상 `section`, `item`, `field`를 명시적으로 전달한다. 현재 선택 상태에 의존해 저장 키를 추론하지 않는다.

### 5.3 Command 계약

권장 신규 Command:

```text
COMPONENT_FIELD_STYLE_PATCH
COMPONENT_FIELD_STYLE_REMOVE
COMPONENT_FIELD_LAYOUT_REORDER
```

실제 저장은 기존 `itemStyles[section.item.field]`를 사용하되, Command 이름을 Item과 분리하여 History Label과 검증을 명확하게 한다.

모든 Command 요구사항:

- Desktop/Mobile 명시
- Undo/Redo 한 단계
- Locked Field 거부
- 존재하지 않는 Field Key 거부
- `undefined` 속성 제거
- AI 문서 Dirty State 반영
- AI 문서 Revision Save 포함

### 5.4 부모 자동 높이

Field Style 변경 후 부모 높이를 다시 측정한다.

```text
Field Width/Height/Margin/Order 변경
  → Field DOM Reflow
  → Parent Composite 실제 높이 측정
  → Parent Auto Height 갱신
  → Section Required Height 확인
  → 다음 Component Collision 확인
```

부모가 `heightMode = auto`이면 Field 높이를 합산한다.

부모가 `heightMode = fixed`이면 Overflow 경고를 표시하고 자동으로 잘라내지 않는다.

---

## 6. 개발 범위

### 6.1 주요 수정 파일

| 파일 | 변경 내용 |
|---|---|
| `visual-editor/src/PromoPageRenderer.vue` | Field 선택 프레임, Field 속성 아이콘, Field Resize·Reorder 이벤트, 부모/자식 선택 계층 |
| `visual-editor/src/promo-renderer.css` | Field 선택 가이드, Field Handle, 부모 비활성 가이드, Field Layout CSS |
| `visual-editor/src/App.vue` | Field Inspector 활성화 상태, Field Layout Controls, Command 실행, 저장·Undo 연계 |
| `visual-editor/src/platform/editor-ui/PreviewPanel.vue` | Field 선택·속성·Resize 이벤트 전달 |
| `visual-editor/src/platform/editor-ui/ComponentInspectorPopover.vue` | 부모/자식 Breadcrumb, Field 유형별 Inspector 구분 |
| `visual-editor/src/platform/editor-ui/TextEditorControls.vue` | Field Layout Controls 분리 및 노출 |
| `visual-editor/src/platform/layout-engine/geometry.mjs` | Field Geometry 정규화·제한값·부모 높이 계산 |
| `visual-editor/src/platform/editor-core/editor-commands.mjs` | Field Command Type 추가 |
| `visual-editor/src/platform/editor-core/command-reducer.mjs` | Field Style Patch·Remove·Reorder 처리 |
| `visual-editor/src/layout-utils.mjs` | Field Layout 정규화 및 기존 Snapshot 호환 |
| `api/_promo-layout-text-collision.js` | Field Layout 적용 후 복합 부모 높이 추정 보강 |

### 6.2 적용 화면

공통 Visual Editor Engine을 사용하는 다음 화면에 적용한다.

- 설정 > Section Preset 관리 > Layout Preset > Live Preview
- 설정 > 템플릿·레이아웃 관리 > Live Preview
- 프로모션 빌더 > 템플릿 모드 Step 3 Live Preview
- 프로모션 빌더 > AI 모드 Live Preview
- AI 프로모션 편집기

### 6.3 신규·레거시 적용 범위

| 대상 | 적용 정책 |
|---|---|
| 신규 Registry Composite Component | 전체 적용 |
| 기존 `fields.length > 1` Component | 자동 적용 |
| 단일 Field Component | 기존 동작 유지 |
| 기존 AI 문서 | Field Layout 미지정 시 현재 기본 배치 유지 |
| Legacy HTML 기반 비계약 컴포넌트 | 적용 제외, 변환 후 지원 |
| Web Output | 편집 Handle 제외, 저장된 Field Layout만 렌더링 |

---

## 7. 단계별 개발 계획

### Phase 1. Field 선택·속성 진입점 — P0

목표: 이미지·텍스트·CTA를 독립 편집 대상으로 명확하게 선택한다.

작업:

1. Field 실제 DOM 영역 선택 프레임 구현
2. 부모 선택 프레임과 Field 선택 프레임 시각 계층 분리
3. Field 전용 `f1de` 속성 아이콘 추가
4. Field 클릭은 선택만, 아이콘 클릭 시 Inspector 활성화
5. `open-field-inspector(section, item, field)` 이벤트 추가
6. Breadcrumb 제목 적용
7. 잠금·비노출 Field 상태 처리
8. Keyboard Focus 및 Escape 계층 처리

완료 조건:

- Image/Text/CTA 각각 선택 프레임이 실제 영역과 일치한다.
- Field 클릭만으로 Inspector가 열리지 않는다.
- 선택 Field의 `f1de` 아이콘으로 해당 Field Inspector가 열린다.

### Phase 2. Field별 Layout Controls — P0

목표: Field의 안전한 Flow Layout 속성을 개별 제어한다.

작업:

1. `normalizeComponentFieldLayoutStyle()` 추가
2. Width·Min Height·Align·Margin·Order Controls 추가
3. Image/Text/CTA별 허용 속성 분기
4. Desktop/Mobile Override 처리
5. Field Style Reset 시 Content 값 보존
6. Layout JSON Inspector에 Field Layout 키 표시
7. 값 범위 검증 및 Clamp 적용

권장 제한:

```text
widthPct: 5 ~ 100
minHeightPx: 28 ~ 1200
marginTopPx: 0 ~ 240
marginBottomPx: 0 ~ 240
order: -100 ~ 1000
```

완료 조건:

- Image/Text/CTA의 크기·정렬·여백을 각각 변경할 수 있다.
- Desktop 변경이 Mobile에 잘못 덮어써지지 않는다.
- JSON Inspector에서 저장 키와 값을 확인할 수 있다.

### Phase 3. Direct Resize·순서 변경 — P0

목표: Live Preview에서 Field를 직접 조작한다.

작업:

1. Image Field 수평·수직 Resize Handle
2. Text Field 수평 Resize 및 Auto Height 유지
3. CTA Width·Height Resize
4. Stack 내 Field Drag Reorder 또는 위/아래 이동 버튼
5. Pointer Capture·Cancel·Escape 처리
6. Keyboard Resize·Reorder 처리
7. Direct Manipulation 결과를 Field Command로 저장
8. Field Resize 중 부모 이동 차단

완료 조건:

- Field 직접 Resize가 부모 Card Resize로 오인되지 않는다.
- Text 편집, Field Resize, 부모 Drag가 충돌하지 않는다.
- Undo 한 번으로 한 번의 Field 조작을 취소한다.

### Phase 4. 부모 자동 높이·충돌 보정 — P0

목표: 자식 변경 후 카드 및 다음 컴포넌트가 겹치지 않게 한다.

작업:

1. Field 변경 후 부모 실제 DOM 높이 재측정
2. Image Load·Font Load 완료 후 재측정
3. 부모 Auto Height Snapshot 반영
4. Section Min Height 확장
5. 다음 Card/Component Collision 재검사
6. Fixed Height 부모 Overflow 진단 표시
7. 기존 `겹침 확인`·`겹침 보정`과 통합
8. Web Output 동일 Geometry 확인

완료 조건:

- Field 크기나 순서를 바꿔도 카드 내부가 잘리지 않는다.
- 다음 카드와 중첩되지 않는다.
- 저장·새로고침·Web Output 이후 높이가 동일하다.

### Phase 5. 호환·브라우저·전체 회귀 검증 — P0

목표: 다섯 편집 화면과 기존 문서에서 동일하게 동작함을 증명한다.

작업:

1. Registry Promotion Card 실제 Fixture 확장
2. Parent → Image → Text → CTA 선택 전환 테스트
3. Field `f1de` Inspector 진입 테스트
4. Field Width·Margin·Order 저장·복원 테스트
5. Desktop/Mobile 분리 저장 테스트
6. Field Resize·Reorder Undo/Redo 테스트
7. 부모 자동 높이·카드 간 Collision 테스트
8. AI 문서 Revision Save·Reload 테스트
9. Template Mode·AI Mode·Section Preset 브라우저 테스트
10. Visual Editor Build 및 전체 테스트 실행

완료 조건:

- 전체 자동 테스트 통과
- 브라우저 Console `ReferenceError`, `TypeError`, Unhandled Rejection 없음
- 기존 단일 컴포넌트 편집 회귀 없음
- 기존 AI 문서의 미지정 Field Layout이 변경되지 않음

---

## 8. 테스트 계획

### 8.1 Unit Test

- Field Layout Style 정규화
- Width·Height·Margin Clamp
- Desktop/Mobile 병합
- Field Command Patch·Remove·Reorder
- Locked Field 거부
- Undo/Redo 원자성
- 부모 합산 높이 계산

### 8.2 Contract Test

- `section.item.field` Style Key 유지
- Field Inspector Event에 명시적 대상 포함
- Field 선택 시 Layout Controls 노출
- Output에 편집 Handle 미포함
- Prompt 하드코딩 추가 없음
- DB Migration 추가 없음

### 8.3 Browser Test

```text
Card 선택
  → 부모 프레임 표시
Image 선택
  → Image Field 프레임 표시
Image f1de 클릭
  → Image Inspector 표시
Image Width 변경
  → Image 영역 변경
Text 선택 및 Width 변경
  → Text 줄바꿈과 부모 높이 갱신
CTA 선택 및 Width·Align 변경
  → CTA 레이아웃 변경
Mobile 전환
  → Mobile Override 적용
저장·Reload
  → 동일 Layout 복원
Web Output
  → 편집 Handle 없이 동일 결과
```

### 8.4 실제 결함 재현 Fixture

- 4:3 Image
- 300자 이상 Description
- Full Width CTA
- Card 3개 반복
- Desktop 3열
- Mobile 1열
- Field별 서로 다른 Width·Margin

---

## 9. 위험 요소와 대응

| 위험 | 영향 | 대응 |
|---|---|---|
| 부모와 Field Handle Pointer 충돌 | 잘못된 대상 이동·Resize | Field Handle에서 Event Stop, 명시적 대상 Event |
| Field 자유 이동으로 내부 중첩 | 카드 깨짐 | P0는 Flow Layout만 제공, Free는 P2 분리 |
| Text Width 변경 후 높이 급증 | 다음 카드 중첩 | DOM 측정 후 부모·Section Reflow |
| Mobile Override 누락 | 모바일에서 Desktop 값 강제 | Viewport 명시 Command 및 병합 테스트 |
| Field Style 초기화가 부모 Style 삭제 | 데이터 손실 | 정확한 `section.item.field` 키만 Remove |
| Inspector 대상과 선택 프레임 불일치 | 다른 Field 수정 | Event payload의 Field Key 검증 |
| 기존 문서 시각 변화 | 회귀 | 값이 없으면 기존 기본 렌더 유지 |
| Collection 카드마다 다른 구조 | 일관성 저하 | Definition Field Key 기반으로 제어, Instance 값은 독립 저장 |

---

## 10. 개발 순서 및 예상 작업 단위

권장 순서는 다음과 같다.

```text
Phase 1 Field 선택·Inspector
  → Phase 2 Field Layout Controls
  → Phase 3 Direct Resize·Reorder
  → Phase 4 Parent Reflow·Collision
  → Phase 5 전체 검증
```

단계별 Merge 가능 조건:

- Phase 1은 선택·속성 진입만으로 독립 배포 가능
- Phase 2는 직접 Drag 없이 Inspector Control로 독립 배포 가능
- Phase 3과 Phase 4는 같은 릴리스에서 배포 권장
- Phase 5 통과 전 기본 Field Free Position 기능은 활성화하지 않음

---

## 11. 완료 기준

다음 조건을 모두 만족하면 개발 완료로 판단한다.

1. 복합 카드의 Image·Text·CTA를 각각 선택할 수 있다.
2. 각 Field의 실제 DOM 영역과 선택 프레임이 일치한다.
3. 각 Field의 `f1de` 아이콘으로 Field Inspector를 열 수 있다.
4. Field 클릭만으로 Inspector가 자동으로 열리지 않는다.
5. Image·Text·CTA의 Width·Height·Align·Margin·Order를 허용 범위 내에서 변경할 수 있다.
6. 부모 카드의 이동·크기·Surface 제어가 유지된다.
7. Field 조작과 부모 조작이 서로 오인되지 않는다.
8. Desktop/Mobile 값이 각각 저장·복원된다.
9. Field 변경 후 부모 높이와 Section 높이가 재계산된다.
10. 반복 카드와 다음 컴포넌트가 겹치지 않는다.
11. AI 문서 저장·Revision·Undo/Redo가 정상 동작한다.
12. Template Mode, AI Mode, Section Preset, Web Output에서 동일하게 반영된다.
13. 기존 단일 컴포넌트와 기존 AI 문서에 회귀가 없다.
14. Visual Editor Build와 전체 자동 테스트가 통과한다.
15. Prompt 변경과 DB Migration 없이 완료한다.

---

## 12. 최종 권고

이번 개발의 P0 범위는 `Field 선택 + Field Inspector + Flow Layout Controls + Direct Resize + 부모 Auto Reflow`로 제한한다.

자식 Field를 Canvas처럼 자유 이동시키는 기능은 카드 내부 중첩, 부모 높이, 모바일 반응형 문제를 다시 만들 수 있으므로 P2 고급 옵션으로 분리한다. 먼저 Stack/Grid 기반의 Width·Align·Margin·Order 제어를 완성하면 사용자가 원하는 개별 제어를 제공하면서도 생성 결과의 안정성을 유지할 수 있다.

---

## 13. 개발 반영 결과

- Phase 1: Image·Text·CTA 실제 DOM Field Shell 선택 프레임, 부모·자식 선택 계층, 자식 `f1de` Inspector 진입점 및 Breadcrumb 반영
- Phase 2: Field별 Width·Min Height·가로/세로 Align·상하 Margin·Order와 부모 Field Gap·Content Padding 제어 반영
- Phase 3: Field 종류별 Pointer·Keyboard Resize, Pointer Cancel 안전 처리, 원자적 Reorder Command와 Undo/Redo 반영
- Phase 4: ResizeObserver 실측 부모 높이, 명시적 Y 위치 하단값, Section 최소 높이를 함께 계산하여 자식 변경 후 Section이 축소되지 않도록 반영
- Phase 5: 공통 Renderer·PreviewPanel·App 저장 경로와 Desktop/Mobile Override를 유지하고 브라우저·계약·전체 회귀 테스트 완료

검증 결과:

- `pnpm run build:visual-editor`: 통과
- `scripts/test-composite-field-editor-browser.mjs`: 통과
- `scripts/test-composite-field-style-editor-contract.mjs`: 통과
- `scripts/test-editor-core.mjs`: 통과
- `pnpm test`: 전체 131개 테스트 파일 통과
- Prompt 변경: 없음
- DB Migration: 없음
