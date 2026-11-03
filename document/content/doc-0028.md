# AI 프로모션 편집기 Layout·속성 편집·저장 JSON 확인 개발계획서

## 0. 문서 정보

- 작성일: 2026-08-16
- 대상 프로젝트: `promo_web_builder`
- 문서 상태: 6개 Phase 개발 및 자동 검증 완료
- 완료일: 2026-08-16
- 기준 화면:
  - `설정 > Section Preset 관리 > Layout Preset`
  - `AI 프로모션 편집기 > STRUCTURE / LIVE PREVIEW`
- 관련 문서:
  - `docs/계획/ai-layout-preset-new-legacy-remediation-development-plan-2026-08-14.md`
  - `docs/계획/visual-editor-contextual-component-inspector-development-plan-2026-08-10.md`
  - `docs/계획/promo-builder-ai-asset-and-section-layout-preset-remediation-development-plan-2026-07-30.md`

---

## 1. 목적

AI 프로모션 편집기의 작업 공간과 컴포넌트 속성 편집 구조를 개선하고, 관리자가 Layout Preset에 실제로 저장된 값을 설정 화면에서 JSON으로 확인할 수 있게 한다.

이번 개발의 목표는 다음과 같다.

1. `STRUCTURE`와 `LIVE PREVIEW` 영역의 너비를 드래그로 조절한다.
2. AI 생성 Title이 과도하게 좁아지는 공통 `32%` fallback을 제거한다.
3. Preview 상단의 텍스트 속성을 선택 컴포넌트의 속성창으로 이동한다.
4. 이미지·텍스트·버튼으로 구성된 복합 컴포넌트를 필드별로 선택하고 스타일을 변경한다.
5. Layout Preset에 저장된 `layout_snapshot`과 `selection_metadata`를 설정 화면에서 읽기 전용 JSON으로 확인한다.
6. 기존 Layout Preset, 기존 AI 문서, Template Mode 및 Web Output의 호환성을 유지한다.

---

## 2. 검토 결론

| 요청 | 현행 원인 | 해결 범위 | 우선순위 |
|---|---|---|---:|
| STRUCTURE / LIVE PREVIEW 너비 조절 | 고정 CSS Grid이며 splitter와 사용자 너비 상태가 없음 | Visual Editor 공통 UI | P1 |
| AI Title 너비가 좁음 | Layout geometry가 없거나 매핑되지 않으면 모든 컴포넌트에 `widthPct = 32` 적용 | Layout 검증·Resolver·Renderer | P0 |
| 텍스트 속성을 선택 속성창에 표시 | `TextEditorControls`가 Preview 상단에 고정 배치됨 | PreviewPanel·Inspector 상태 이동 | P1 |
| 복합 컴포넌트 필드별 스타일 변경 | Renderer는 필드 스타일을 지원하지만 편집기는 Item까지만 선택함 | 선택 계약·Inspector·Command | P0 |
| 설정에서 저장 JSON 확인 | API는 Snapshot을 반환하지만 관리자 UI에 원본 확인 기능이 없음 | 관리자 UI·공통 JSON Viewer | P1 |

LLM 프롬프트는 이번 결함의 원인이 아니다. AI는 허용된 Layout Preset을 선택하고, 실제 좌표와 크기는 결정적 코드가 적용한다. 따라서 이번 개발에서는 Prompt 추가·수정을 하지 않는다.

---

## 3. 현행 저장·적용 구조

### 3.1 Layout Preset 원본

Layout Preset은 `wizard_content_section_layouts`의 다음 값으로 관리된다.

| 저장 값 | 형식 | 역할 |
|---|---|---|
| `selection_metadata` | JSONB | AI 선택 의미, 정렬, 콘텐츠 영역, 밀도, 가중치 |
| `layout_snapshot` | JSONB | Section과 Desktop/Mobile 컴포넌트 geometry·visibility |
| `layout_key` | scalar | Section Version 내부의 안정적인 Layout 식별자 |
| `is_default` | scalar | 기본 Layout 여부 |
| `change_note` | scalar | 변경 사유 |

### 3.2 AI 문서 적용

```text
관리자 Layout Preset 원본
  → AI가 허용된 layoutKey 선택
  → sourceItemKey 기준으로 Runtime Component ID에 매핑
  → AI 문서 designSpec.itemStyles에 적용값 복사
  → AI 문서 Snapshot 저장
```

기존 AI 문서는 원본 Layout Preset에 대한 동적 포인터가 아니다. 생성 시점의 적용값을 자체 Snapshot으로 보존한다. 관리자가 Layout Preset을 수정해도 기존 문서를 자동 변경하지 않는다.

### 3.3 편집기 UI 환경설정

STRUCTURE 패널 너비는 Layout Preset이나 AI 문서 데이터가 아니다. 사용자·브라우저별 편집 환경설정으로 분리한다.

```text
localStorage
  key: promo-visual-editor:workspace-split:<mode>
  value: { structureWidthPx, updatedAt }
```

서버 저장이나 DB Migration은 적용하지 않는다.

---

## 4. 설정 화면 저장 JSON 확인 기능

### 4.1 진입 위치

`설정 > Section Preset 관리 > Layout Preset`의 각 Preset 행에 다음 버튼을 추가한다.

```text
[Live Preview] [저장 JSON] [기본 지정] [AI 후보 지정/해제] [삭제]
```

`저장 JSON`은 화면 하단 확장이 아니라 모달로 연다. 기존 Live Preview 모달 정책과 동일하게 현재 확인 업무에 집중할 수 있도록 한다.

### 4.2 모달 정보 구조

```text
Layout Preset 저장 JSON                          [닫기]

Preset: Hero Center / hero_center
상태: Draft · 기본 · AI 선택 후보
저장 시각: 2026-08-16 14:30

[Layout Snapshot] [AI 선택 기준] [전체 보기]

JSON Tree / Code View

[경로 검색] [모두 펼치기] [모두 접기]
[JSON 복사] [JSON 다운로드]

검증 결과: 정상 / 오류 N건 / 경고 N건
```

### 4.3 표시 데이터

#### Layout Snapshot 탭

DB `layout_snapshot` JSONB와 API `layout.layoutSnapshot`의 정규화된 값을 그대로 표시한다.

- `contractVersion`
- `layoutMode`
- `sectionStyle`
- `viewports.desktop.items`
- `viewports.desktop.visibility`
- `viewports.mobile.items`
- `viewports.mobile.visibility`
- 계약에 포함된 경우 `content`

#### AI 선택 기준 탭

DB `selection_metadata` JSONB와 API `layout.selectionMetadata`를 표시한다.

- `alignment`
- `contentRegion`
- `visualBalance`
- `density`
- `purposeTags`
- `selectionWeight`
- `avoidImmediateRepeat`

#### 전체 보기 탭

실제 JSONB 두 개와 식별·감사 정보를 하나의 읽기용 Envelope로 구성한다.

```json
{
  "id": "layout-row-id",
  "sectionId": "section-version-id",
  "layoutKey": "hero_center",
  "name": "Hero Center",
  "description": "중앙 정렬 Hero",
  "isDefault": true,
  "aiSelectable": true,
  "selectionMetadata": {},
  "layoutSnapshot": {},
  "changeNote": "Layout Preset updated.",
  "createdAt": "2026-08-16T00:00:00.000Z",
  "updatedAt": "2026-08-16T00:00:00.000Z"
}
```

`aiSelectable`은 Layout Row의 JSONB 저장값이 아니라 Section의 `aiDesign.allowedLayoutVariants`와 `layoutKey`를 비교한 표시용 계산값임을 UI에 명시한다.

### 4.4 편집 정책

1차 출시에서는 JSON을 읽기 전용으로 제공한다.

- 허용: 검색, 경로 복사, JSON 복사, `.json` 다운로드
- 금지: JSON 직접 수정 및 저장
- Layout 변경: Live Preview 사용
- AI 선택 기준 변경: 기존 구조화 입력 사용

직접 JSON 편집을 금지하는 이유:

- `normalizeLayoutSnapshot()` 검증 우회 방지
- 존재하지 않는 `itemKey` 입력 방지
- Desktop/Mobile 계약 파손 방지
- 변경 이력과 `change_note` 누락 방지
- 임의 스타일·CSS 주입 방지

### 4.5 검증 표시

저장 JSON 모달은 서버 저장 계약과 동일한 Validator 결과를 읽기 전용으로 보여준다.

검증 항목:

- 지원하는 `contractVersion`과 `layoutMode`
- Desktop/Mobile viewport 존재 여부
- Snapshot itemKey와 현재 Section Component itemKey 일치 여부
- `widthPct`, `xPct`, `yPx`, `heightPx` 범위
- 필수·잠금 컴포넌트의 visibility
- 기본 Header Logo geometry 등 Section 정책
- AI 선택 후보인데 geometry가 없는 Layout

권장 오류 코드:

- `LAYOUT_GEOMETRY_INCOMPLETE`
- `LAYOUT_ITEM_KEY_UNKNOWN`
- `LAYOUT_VIEWPORT_REQUIRED`
- `LAYOUT_GEOMETRY_OUT_OF_RANGE`
- `REQUIRED_COMPONENT_GEOMETRY_MISSING`

### 4.6 API 및 DB 판단

현재 Layout 목록 API는 `layoutSnapshot`, `selectionMetadata`, 감사 정보를 이미 반환한다. 기본 JSON 확인 기능을 위해 신규 DB Column이나 Migration은 필요하지 않다.

1차 개발:

- 기존 `GET /api/wizard-content-section-layouts?sectionId=...` 재사용
- 필요 시 클라이언트에서 기존 Validator의 read-only 진단 함수 재사용

2차 선택 개발:

- 저장 이력의 `previous_snapshot`, `new_snapshot`까지 비교하려면 History 조회 API를 추가한다.
- 기존 History Table을 사용하므로 단순 조회 API에는 Migration이 필요하지 않다.

---

## 5. STRUCTURE / LIVE PREVIEW Splitter

### 5.1 목표

- Desktop/Tablet builder workspace에서 두 패널 사이를 드래그해 너비 변경
- STRUCTURE 권장 범위: `240px ~ 520px`
- Preview 최소 작업 폭 보장
- 모드별 마지막 너비 복원

### 5.2 구현

`App.vue`의 `StructurePanel`과 `PreviewPanel` 사이에 `WorkspaceSplitter`를 추가한다.

```text
StructurePanel | WorkspaceSplitter | PreviewPanel
```

CSS:

```text
grid-template-columns:
  minmax(240px, var(--structure-pane-width))
  8px
  minmax(0, 1fr)
```

상호작용:

- Pointer capture 기반 드래그
- `role="separator"`, `aria-orientation="vertical"`
- 좌우 방향키로 16px씩 조절
- `Home`/`End`로 최소·최대
- 더블클릭으로 기본값 복원
- 모바일 breakpoint에서는 저장값을 적용하지 않고 기존 compact 정책 사용

내부 패널 Resize는 Window resize 이벤트가 아니므로 Preview Stage에 `ResizeObserver`를 연결해 선택 Inspector 위치를 다시 계산한다.

### 5.3 저장

- `localStorage`만 사용
- Layout Preset·AI 문서 Snapshot에는 포함하지 않음
- 저장값이 범위를 벗어나면 clamp 후 적용
- Storage 사용 불가 시 기본 너비로 정상 동작

---

## 6. AI Title 32% 너비 보완

### 6.1 원인

현재 Renderer는 Item Style에 `widthPct`가 없으면 종류와 관계없이 `32%`를 적용한다. Layout Preset geometry가 누락되거나 `sourceItemKey` 매핑에 실패하면 Title도 32%가 되어 불필요하게 여러 줄로 줄바꿈된다.

### 6.2 개선 원칙

1. Layout Preset이 존재하면 Preset geometry를 최우선 적용한다.
2. AI 선택 가능 Layout은 Desktop/Mobile의 필수 Item geometry를 갖춰야 한다.
3. 매핑 실패를 조용한 fallback으로 숨기지 않는다.
4. Legacy 문서는 기존 Snapshot을 그대로 렌더링한다.
5. 신규 생성·새 Layout 적용부터 강화된 검증을 사용한다.

### 6.3 의미 기반 fallback

Preset geometry가 없는 레거시·신규 빈 Section을 위한 fallback을 컴포넌트 종류별로 분리한다.

| 대상 | 권장 fallback |
|---|---|
| Title / Headline | `72%` 또는 Layout 계산 폭 |
| Lead / Body | `60%` |
| CTA | `fit-content` |
| Image | 기존 Image 정책 또는 `44%` |
| Composite Card | 부모 Frame 기준 `100%` |

정확한 운영값은 하드코딩된 프롬프트가 아니라 공통 Layout Default Contract로 관리한다. 관리자가 만든 Layout Preset 값이 항상 이 fallback보다 우선한다.

### 6.4 진단

- Resolver가 `sourceItemKey → runtime itemKey` 매핑 실패 목록을 반환
- Compiler가 필수 geometry 누락 시 `LAYOUT_GEOMETRY_INCOMPLETE` 처리
- 저장 JSON 모달에서 누락 viewport와 itemKey를 경로로 표시
- 예: `$.layoutSnapshot.viewports.desktop.items.title`

---

## 7. 텍스트 속성의 컨텍스트 Inspector 이동

### 7.1 목표 구조

Preview 상단:

- Viewport
- Guide
- Undo/Redo
- 저장·Web Output

선택 컴포넌트 Inspector:

- Content
- Typography
- Component Layout
- Motion
- Advanced

### 7.2 Typography 범위

- Font family
- Font size / weight
- Color / gradient
- Line height / letter spacing
- Text align
- Text background
- List style / indent
- 자동·고정 영역 크기

전체 텍스트와 선택한 줄의 적용 범위를 UI에서 분명히 표시한다.

```text
적용 대상: [전체 텍스트] [선택한 줄 2개]
```

PreviewPanel에 있는 `selectedTextLines`를 App 또는 공통 Editor Selection 상태로 올리고, Inspector에 전달한다. 스타일 저장과 Undo/Redo Command 계약은 기존 `ITEM_STYLE_PATCH` 계열을 재사용한다.

---

## 8. 복합 컴포넌트 필드별 스타일 편집

### 8.1 선택 계약

기존:

```text
selectedStyleKey = section.item
```

개선:

```text
selectedItemStyleKey  = section.item
selectedFieldStyleKey = section.item.field
selectedStyleTarget   = item | field
```

Renderer가 이미지·텍스트·CTA 필드를 클릭했을 때 `fieldKey`를 선택 Event에 포함한다.

### 8.2 속성 책임 분리

| 선택 대상 | 편집 속성 |
|---|---|
| Card/Component Frame | 위치, 너비, 높이, 배경, radius, shadow, 전체 padding |
| Image Field | fit, focus, aspect ratio, shape, radius, 접근성 설명 |
| Text Field | Typography, 컬러, 배경, 정렬, 간격 |
| CTA Field | Label typography, 배경, 글자색, radius, padding |

Field별로 등록된 `styleSlots`와 `targetProperty` allowlist 안의 속성만 노출한다. 임의 CSS 입력은 허용하지 않는다.

### 8.3 Command와 초기화

- Field 스타일 변경도 기존 Item Style Map의 `section.item.field` key를 사용
- Desktop/Mobile responsive override 지원
- `필드 스타일 초기화`와 `컴포넌트 Frame 초기화`를 분리
- Undo/Redo label에 대상 필드명 포함
- Item 삭제 시 하위 Field Style도 함께 제거되는 기존 reducer 동작 검증

---

## 9. 신규·레거시 적용 범위

| 항목 | 신규 Registry v3 | 레거시 Template v2 | 기존 저장 AI 문서 |
|---|---:|---:|---:|
| Workspace Splitter | 적용 | 공통 Editor 사용 시 적용 | 적용 |
| JSON 확인 | Layout Preset 공통 | Layout Preset 공통 | 원본 Preset만 표시 |
| Title 의미 기반 fallback | 적용 | 무 geometry 경로만 적용 | 기존 명시 Snapshot 우선 |
| Geometry 완전성 검증 | 엄격 적용 | 경고 우선 | 재저장 강제 안 함 |
| Typography Inspector 이동 | 적용 | 공통 Editor 사용 시 적용 | 적용 |
| 복합 Field 스타일 편집 | 적용 | Field 계약이 있는 Component에 적용 | Field Style이 있는 문서에 적용 |
| 기존 Snapshot 자동 변환 | 금지 | 금지 | 금지 |

---

## 10. 단계별 개발 계획

### Phase 1 — 저장 JSON 확인

1. 공통 읽기 전용 `JsonSnapshotDialog.vue` 구현
2. Layout Preset 행에 `저장 JSON` 버튼 추가
3. Snapshot·선택 기준·전체 보기 탭 구현
4. 검색·복사·다운로드·접기/펼치기 구현
5. Validator 진단 결과와 JSON Path 표시
6. Draft/Active/Inactive 상태 모두 읽기 허용

### Phase 2 — Field 선택 모델

1. `selectedFieldKey`, `selectedStyleTarget` 추가
2. Renderer의 Text/Image/CTA Field 선택 Event 확장
3. Item/Field style key 계산 함수 통합
4. Field Style Patch·Reset Command 연결
5. 선택 Outline과 Inspector 제목에 Field 이름 표시

### Phase 3 — Inspector 재구성

1. 상단 `TextEditorControls` 제거
2. Inspector에 Typography 그룹 이동
3. 줄 선택 상태를 공통 Selection 상태로 이동
4. 복합 Field별 Design Controls 구현
5. Item Frame과 Field 스타일 UI 분리

### Phase 4 — Splitter

1. `WorkspaceSplitter.vue` 구현
2. CSS Grid variable 적용
3. Pointer·Keyboard·Reset 동작 구현
4. 모드별 localStorage 저장·복원
5. Preview Stage와 Inspector ResizeObserver 연결
6. 좁은 Preview toolbar responsive 보완

### Phase 5 — Geometry 검증과 fallback

1. `32%` 공통 fallback을 의미 기반 fallback으로 교체
2. Layout Preset geometry 완전성 Validator 추가
3. Resolver 매핑 누락 진단 추가
4. 신규 v3 fail-closed 정책 적용
5. 레거시 경고·호환 정책 적용
6. 설정 JSON 모달에 오류 경로 표시

### Phase 6 — 통합 검증

1. Desktop/Mobile Layout 저장·재진입
2. AI 문서 생성·저장·재진입
3. Web Output 렌더링 동일성
4. 기존 문서 무회귀
5. Template Mode 무회귀
6. Undo/Redo와 revision conflict
7. Draft Clone과 Layout history

---

## 11. 테스트 계획

### 11.1 단위 테스트

- Splitter clamp·복원·잘못된 storage 값 처리
- Item/Field style key 계산
- Field Style Patch·Remove
- 의미 기반 width fallback
- Layout geometry 누락·알 수 없는 itemKey 검증
- JSON download 파일명과 직렬화 결과

### 11.2 API 테스트

- Layout 목록에 Snapshot 포함
- Draft/Active/Inactive 읽기 권한
- 저장 JSON에 Prompt·Secret 등 비대상 데이터가 포함되지 않음
- Layout PATCH의 기존 정규화와 history 유지

### 11.3 브라우저 테스트

- Splitter mouse/pointer/keyboard 조절
- 새로고침 후 너비 복원
- Title이 Preset 너비로 렌더링됨
- 복합 Card의 Image/Text/CTA 선택 전환
- Field별 스타일 저장 후 재접속
- 상단 Typography 제거 및 Inspector 노출
- JSON 모달 열기·탭·복사·다운로드·닫기
- 작은 화면에서 모달과 Preview toolbar overflow 없음

### 11.4 접근성

- Splitter separator ARIA 값
- JSON Tree keyboard 탐색
- 모달 focus trap·Esc·focus restore
- 선택 Field와 Inspector 제목 연결
- 컬러 입력은 토큰 이름과 실제 색상을 함께 표시

---

## 12. Migration·Prompt·배포 판단

### Migration

- 기본 범위: 필요 없음
- 이유: `layout_snapshot`, `selection_metadata`, history JSONB가 이미 존재함
- 신규 History 조회 API도 기존 Table을 사용할 경우 Migration 불필요

### Prompt

- 변경 없음
- Layout geometry, Field 선택, Splitter, JSON 확인은 결정적 코드와 관리자 데이터 책임
- 향후 AI가 Field Style Slot을 선택하도록 확장할 경우에만 관리자 `LLM 및 프롬프트 관리`에서 Version으로 관리
- 소스코드에 자연어 Prompt 하드코딩 금지

### 배포

1. JSON Viewer와 Field 선택을 Feature Flag로 우선 배포
2. 기존 문서 회귀 확인 후 Inspector 이동 활성화
3. Splitter 공통 활성화
4. Geometry 엄격 검증은 신규 Draft·신규 AI 생성부터 활성화
5. 기존 활성 Layout은 경고만 표시하고 즉시 차단하지 않음

---

## 13. 완료 기준

- [x] 설정의 모든 Layout Preset에서 저장 Snapshot과 AI 선택 기준 JSON을 확인할 수 있다.
- [x] JSON은 읽기 전용이며 트리/코드 전환, 펼치기/접기, 경로 검색·복사, JSON 복사·다운로드가 가능하다.
- [x] JSON 검증 오류가 정확한 경로와 코드로 표시된다.
- [x] STRUCTURE / LIVE PREVIEW 너비를 드래그·키보드로 조절하고 재접속 시 복원한다.
- [x] Title geometry가 정상 매핑되며 누락 시 모든 텍스트가 32%로 축소되지 않는다.
- [x] 텍스트 속성은 상단이 아니라 선택 Inspector에 표시된다.
- [x] 복합 Card의 Image·Text·CTA를 각각 선택하고 스타일을 변경할 수 있다.
- [x] Field 스타일이 Desktop/Mobile, 저장·재진입, Undo/Redo, Web Output에서 유지된다.
- [x] 기존 AI 문서와 Template Mode Snapshot을 자동 재작성하지 않는다.
- [x] 신규 DB Migration과 LLM Prompt 변경 없이 배포할 수 있다.

### 13.1 구현 및 검증 결과

- Phase 1~6 구현 완료
- 관리자 앱과 Visual Editor production build 완료
- 전체 자동 테스트 `130/130` 통과
- 관리자 JSON 모달 및 Splitter 저장·복원 브라우저 테스트 통과
- 복합 컴포넌트 Image/Text/CTA 필드 전환·스타일 적용 브라우저 테스트 통과
- Runtime Prompt 하드코딩 방지 테스트 통과
- DB Migration 없음
- LLM Prompt 추가·변경 없음

### 13.2 디버깅 보정

- 복합 필드 스타일의 Mobile/Desktop 병합 과정에서 존재하지 않는 viewport 변수를 참조하던 Runtime 오류 수정
- 부모 컴포넌트 Drag 이벤트가 하위 Field 클릭을 가로채던 이벤트 충돌 수정
- 같은 컴포넌트 안에서 Image/Text/CTA Field 선택 전환이 조기 종료되던 선택 조건 수정
- 인라인 텍스트 편집 저장 후 선택 Field가 해제되던 상태 유지 문제 수정
- Field 선택 시 텍스트 정렬까지 숨겨지던 Inspector 조건을 분리하고, Frame 배치 도구만 숨기도록 수정

---

## 14. 최종 권고

우선순위는 다음 순서가 적절하다.

1. P0 — 복합 컴포넌트 Field 선택·스타일 편집
2. P0 — Title `32%` fallback과 geometry 누락 진단
3. P1 — 설정의 저장 JSON 읽기 전용 확인
4. P1 — 텍스트 속성의 컨텍스트 Inspector 이동
5. P1 — STRUCTURE / LIVE PREVIEW Splitter

JSON 확인 기능을 먼저 일부 개발하면 Title geometry와 Field Style 저장 문제를 운영자가 직접 진단할 수 있다. 따라서 전체 구현 순서는 `JSON Viewer 최소 기능 → Field 선택 모델 → Inspector → Splitter → 엄격 검증`을 권장한다.
