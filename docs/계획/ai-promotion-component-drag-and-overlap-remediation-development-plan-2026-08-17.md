# AI 프로모션 컴포넌트 이동·중첩 보정 개발계획서

## 0. 문서 정보

- 작성일: 2026-08-17
- 대상 프로젝트: `promo_web_builder`
- 대상 화면: `AI 프로모션 편집기 > LIVE PREVIEW`
- 문서 상태: 개발 완료 / 검증 완료
- 권장 개발 단계: 5개 Phase
- 우선순위: P0
- 관련 문서:
  - `docs/계획/ai-promotion-editor-layout-and-json-inspector-development-plan-2026-08-16.md`
  - `docs/계획/live-preview-component-interaction-resize-debugging-plan-2026-08-01.md`
  - `docs/계획/live-preview-outline-editor-text-alignment-development-plan-2026-07-31.md`

### 구현 결과

- 5개 Phase 개발 완료
- 선택 컴포넌트 전용 이동 핸들 및 키보드 이동 지원
- 텍스트 편집 상태에서 이동 시작 시 편집 Commit 후 이동 전환
- 이미지 비율·텍스트·CTA·필드 간격을 포함한 서버 높이 계산 적용
- AI 문서 Live Preview에 `겹침 확인`, `겹침 보정` 기능 추가
- 보정 결과를 단일 Editor Command로 저장하여 Undo 및 AI 문서 Revision 저장 지원
- Visual Editor 빌드 성공
- 전체 131개 테스트 파일 통과
- 프롬프트 변경 없음
- DB 마이그레이션 없음

---

## 1. 목적

AI 프로모션 생성 및 편집 과정에서 발생하는 다음 결함을 해결한다.

1. 이미지·텍스트·버튼으로 구성된 복합 컴포넌트를 Live Preview에서 이동할 수 없다.
2. 텍스트 편집 상태에서는 컴포넌트 이동을 시작할 수 없지만 이를 해제하거나 전환할 명확한 UX가 없다.
3. 자동 높이로 렌더링되는 복합 컴포넌트의 실제 높이와 초기 Layout Preset의 `heightPx`가 달라 다음 컴포넌트와 겹친다.
4. 서버 중첩 계산이 복합 컴포넌트의 이미지와 CTA 높이를 제외해 실제 충돌을 감지하지 못한다.
5. 기존 AI 문서 Snapshot에는 새 중첩 보정이 적용되지 않는다.
6. 현재 자동 테스트가 순수 텍스트 중심이라 실제 Promotion Card 결함을 검출하지 못한다.

최종 목표는 다음과 같다.

- 모든 이동 가능한 컴포넌트에 일관된 이동 진입점을 제공한다.
- 필드 선택, 텍스트 편집, 컴포넌트 이동을 명확히 구분한다.
- AI 초기 생성 시 복합 컴포넌트의 실제 렌더 높이를 기준으로 중첩을 제거한다.
- 기존 문서는 사용자 요청 없이 자동 변경하지 않고 명시적인 보정 기능을 제공한다.
- Desktop/Mobile, 단일/복합/반복 컴포넌트를 동일한 계약으로 검증한다.

---

## 2. 검토 결론

| 문제 | 직접 원인 | 해결 방향 | 우선순위 |
|---|---|---|---:|
| 복합 컴포넌트 이동 불가 | `startDrag()`가 `[data-field-style-key]` 내부 Pointer를 전부 제외 | 선택 프레임 전용 이동 핸들 추가 | P0 |
| 편집 상태에서 이동 불가 | `.is-editing`이면 Drag 시작을 차단하며 전환 UI가 없음 | 이동 핸들 Pointer Down 시 편집 Commit 후 Drag 전환 | P0 |
| 카드 간 중첩 | 상위 Item은 `text`지만 내부는 `image + text + CTA` 구성 | 전체 필드의 렌더 높이 측정 | P0 |
| 서버 보정 오판 | 중첩 계산이 Text Field만 높이에 포함 | 이미지 비율·CTA·Field Gap 포함 또는 DOM 측정값 사용 | P0 |
| 기존 문서 미보정 | 보정기가 V3 신규 컴파일에서만 실행 | 명시적 `겹침 보정` Command 및 Revision 저장 | P1 |
| 테스트 통과 후 실화면 실패 | 복합 카드 Drag 및 실제 DOM Collision 테스트 부재 | Registry Card 기반 Browser E2E 추가 | P0 |

LLM 프롬프트는 이번 결함의 원인이 아니다. Layout Preset 선택 이후 좌표 적용, Pointer Interaction, DOM 높이 측정 및 Snapshot 저장의 문제이므로 Prompt 추가·수정은 하지 않는다.

DB Schema 변경도 필요하지 않다. 기존 `designSpec.itemStyles`, `responsiveLayouts.mobile.itemStyles`, `sectionStyles`, AI 문서 Revision 저장 구조를 그대로 사용한다.

---

## 3. 확인된 현행 동작

### 3.1 컴포넌트 이동 차단

`PromoPageRenderer.startDrag()`는 다음 조건에서 이동을 시작하지 않는다.

```text
item.isLocked
Modifier Key 입력
Resize Handle 선택
data-field-style-key 내부 선택
is-editing 상태
```

복합 컴포넌트의 이미지·텍스트·CTA는 모두 `data-field-style-key`를 가진다. 내부 필드가 컴포넌트 면적을 모두 차지하면 사용자가 Drag를 시작할 빈 영역이 없다.

### 3.2 자동 높이와 Preset Geometry 불일치

현재 자동 높이 Text Item은 저장된 `heightPx`를 CSS Height로 적용하지 않는다. 단일 텍스트에서는 올바른 정책이지만, 상위 `fieldKind = text`인 복합 카드에도 동일하게 적용된다.

복합 카드의 실제 높이:

```text
Image Frame Height
+ Text Field Height
+ CTA Height
+ Field Gap
+ Component Padding/Border
```

현재 서버 추정 높이:

```text
Text Field Height만 계산
```

따라서 Layout Preset이 다음 카드 위치를 `heightPx = 320` 기준으로 저장했더라도 실제 첫 카드가 500~600px이면 다음 카드가 첫 카드 내부에 배치된다.

### 3.3 중첩 보정 적용 시점

현재 중첩 보정은 다음 경로에서만 실행된다.

```text
promo_page_composer
  → Registry Composition v3
  → compileRegistryComposition()
  → avoidTextComponentOverlaps()
```

다음 경로에서는 실행되지 않는다.

- 기존 AI 문서 GET
- Visual Editor Snapshot Load
- AI 문서 PATCH Save
- 사용자 Content 변경 후 Reflow
- 이미지 생성 완료 후 실제 Asset 비율 확정

### 3.4 테스트 공백

현재 테스트는 다음을 충분히 검증하지 않는다.

- 복합 컴포넌트 내부 Field Pointer에서 전체 컴포넌트 이동
- 텍스트 편집 상태에서 이동 핸들 전환
- 실제 4:3 이미지가 포함된 반복 카드의 DOM Height
- 세 개 카드의 Mobile 세로 배치
- 생성 후 이미지가 로드되면서 높이가 변경되는 경우
- 기존 AI 문서의 명시적 겹침 보정 및 Revision 저장

---

## 4. 목표 상호작용 모델

### 4.1 선택과 이동 분리

필드 클릭과 컴포넌트 이동을 동일 Pointer 영역에서 경쟁시키지 않는다.

```text
필드 클릭
  → Field 선택
  → Field Inspector 표시

필드 더블클릭
  → Text 편집 시작

컴포넌트 이동 핸들 Pointer Down
  → 활성 Text 편집 Commit
  → Component Drag 시작
  → Field 선택은 유지하거나 Item 선택으로 승격
```

### 4.2 이동 핸들

선택된 이동 가능 컴포넌트의 좌측 상단 또는 선택 프레임 상단에 전용 이동 핸들을 표시한다.

요구사항:

- 아이콘은 기존 Font Awesome 이동 아이콘 사용
- `button` 또는 접근 가능한 Pointer Target 사용
- 최소 Hit Area 28×28px
- `aria-label="컴포넌트 이동"`
- Pointer Capture 지원
- Keyboard 이동 지원
- 잠금 컴포넌트에는 표시하지 않음
- Output 및 Normal Preview에는 포함하지 않음
- Resize Handle과 영역이 겹치지 않음

권장 Keyboard:

- 방향키: 1px 또는 1% 단위 이동
- `Shift + 방향키`: 8px 또는 4% 단위 이동
- `Escape`: 이동 취소 및 이전 좌표 복원

### 4.3 편집 상태 전환

이동 핸들을 누르면 현재 `contenteditable` 값을 먼저 확정한다.

```text
Text Edit Active
  → finishTextEdit(commit = true)
  → nextTick
  → Component Drag Start
```

필드 내용이 비어 있거나 검증 오류가 발생하면 이동 자체를 막지 않고 현재 편집 값을 Editor Command에 먼저 기록한다.

---

## 5. 중첩 방지 설계

### 5.1 2단계 보정

중첩 방지는 서버 추정과 클라이언트 실제 측정을 결합한다.

#### 1단계: 서버 사전 배치

Registry Composition Compiler가 초기 좌표를 안전하게 생성한다.

- Layout Preset Geometry를 초기 의도로 사용
- 단일 Text, Composite Text, Image, CTA 높이 추정
- 이미지 `aspectRatio`로 Frame Height 계산
- CTA 최소 높이 포함
- Composite Field Gap 포함
- 수평 영역이 겹치는 Component만 세로 충돌 검사
- Desktop/Mobile 독립 계산
- Section `minHeight` 확장

서버 계산은 첫 화면의 큰 충돌을 줄이는 역할이며 최종 보장이 아니다.

#### 2단계: 클라이언트 실제 높이 보정

Renderer가 다음 조건이 충족된 후 실제 DOM Rect를 측정한다.

- Vue Render 완료
- Font Ready 또는 안정화 Timeout 완료
- Image Load/Decode 완료
- ResizeObserver 최초 안정화 완료

측정 대상:

- `.rendered-item[data-style-key]`
- 현재 Viewport에서 Visible한 Component
- `positionMode = free`
- 자동 높이 Component

실제 Bounding Box가 겹치면 아래 Component의 `yPx`를 이동한다.

### 5.2 Reflow 적용 범위

자동 보정이 사용자 수동 배치를 계속 덮어쓰지 않도록 Reflow 범위를 제한한다.

자동 실행:

- 신규 AI Composition 최초 Render
- 신규 Layout Preset 적용 직후
- Asset 생성 완료로 초기 Component 높이가 확정된 시점

자동 실행 금지:

- 사용자가 Drag를 완료한 이후
- 기존 문서 Load
- 일반 Content 편집 중
- 명시적으로 `heightMode = fixed`인 Component

기존 문서는 `겹침 보정` 버튼을 사용한다.

### 5.3 충돌 정책

충돌 판정:

```text
horizontalOverlap = leftA < rightB && rightA > leftB
verticalOverlap   = topA < bottomB && bottomA > topB
```

보정 순서:

1. 원래 `yPx`
2. Section Item 순서
3. `zIndex`
4. Stable Item Key

보정 규칙:

- 먼저 배치된 Component는 유지
- 다음 Component를 `previous.bottom + gap`으로 이동
- Gap은 기존 Design Space Token을 우선 사용
- 적절한 Token이 없을 때만 안전한 기본값 사용
- Section 경계를 초과하면 `minHeight` 확장
- 최대 Section Height를 초과하면 자동 축소하지 않고 경고 반환

### 5.4 복합 컴포넌트 높이

복합 컴포넌트는 상위 `fieldKind`만으로 높이를 판단하지 않는다.

| Field 종류 | 추정 또는 측정 기준 |
|---|---|
| Text | Font Size, Line Height, Width, 실제 문자열 |
| Image | Component Width × Aspect Ratio |
| CTA | 실제 DOM Height 또는 Button Height Token |
| Composite Gap | `--component-field-gap` 계산값 |
| Border/Padding | `getBoundingClientRect()` 결과에 포함 |

서버 추정기와 클라이언트 측정기는 동일한 `Component Geometry Descriptor` 계약을 사용하되, 최종 저장값은 클라이언트 실제 측정을 우선한다.

---

## 6. 기존 문서 보정 UX

### 6.1 진입점

AI 프로모션 편집기 Preview Toolbar 또는 Section Inspector에 다음 기능을 추가한다.

```text
[겹침 확인] [겹침 보정]
```

`겹침 확인`:

- 현재 Viewport의 충돌 Component 수 표시
- Outline 모드에서 충돌 Component 강조
- 문서 데이터 변경 없음

`겹침 보정`:

- 변경 전/후 좌표 Preview
- 사용자 확인 후 하나의 Editor Command로 적용
- Undo/Redo 가능
- AI 문서 Revision 저장 전 Dirty 상태 표시

### 6.2 저장 계약

기존 `ITEM_STYLE_PATCH`, `RESPONSIVE_ITEM_STYLE_PATCH`, `SECTION_STYLE_PATCH`를 묶는 Batch Layout Command를 추가한다.

권장 Command:

```text
LAYOUT_COLLISION_REFLOW
```

Payload:

```json
{
  "viewport": "desktop",
  "itemStylePatches": {},
  "sectionStylePatches": {},
  "diagnostics": [],
  "reason": "user-requested-overlap-remediation"
}
```

DB Migration 없이 기존 AI 문서 Snapshot Revision으로 저장한다.

---

## 7. 구현 대상 파일

| 파일 | 변경 내용 |
|---|---|
| `visual-editor/src/PromoPageRenderer.vue` | 이동 핸들, Drag 상태 전환, 실제 DOM Height/Collision 측정 |
| `visual-editor/src/promo-renderer.css` | 이동 핸들 및 Collision Guide 스타일 |
| `visual-editor/src/platform/editor-ui/PreviewPanel.vue` | Reflow 실행·상태 Event 연결 |
| `visual-editor/src/App.vue` | Reflow Command 실행, Dirty/Undo/Redo/저장 연결 |
| `visual-editor/src/platform/editor-core/editor-commands.mjs` | Batch Reflow Command 정의 |
| `visual-editor/src/platform/editor-core/command-reducer.mjs` | Desktop/Mobile Item·Section Patch 원자 적용 |
| `visual-editor/src/platform/layout-engine/geometry.mjs` | 공통 Box·Collision Geometry 함수 |
| `api/_promo-layout-text-collision.js` | 전체 Composite Field 추정으로 확대 |
| `api/_promo-registry-composition-compiler.js` | 서버 사전 보정 및 진단 기록 |
| `api/promo-builder-documents.js` | 기존 문서 자동 변경 없이 Reflow 결과 검증·저장 |
| `scripts/test-promo-layout-text-collision.js` | 단위 테스트 확대 |
| `scripts/test-promo-registry-composition-compiler.js` | 실제 Registry Card 반복 배치 테스트 |
| 신규 Browser Test | 복합 컴포넌트 이동 및 실제 DOM Collision E2E |

---

## 8. 개발 단계

### Phase 1. Interaction 계약 및 이동 핸들 — P0

개발:

1. 선택 컴포넌트 전용 이동 핸들 추가
2. Field Click과 Component Drag 분리
3. Text Edit → Drag 전환 구현
4. Pointer Cancel, Lost Capture, Escape 복원 처리
5. Desktop/Mobile 좌표 저장 분리 확인

완료 조건:

- 이미지·텍스트·CTA 내부를 가진 카드도 이동 가능
- 필드 선택과 이동이 서로 오작동하지 않음
- 이동 후 `positionMode`, `xPct`, `yPx`가 Editor Core에 기록됨
- Undo/Redo 및 AI 문서 저장 후 재로드 좌표 유지

### Phase 2. 복합 컴포넌트 서버 높이 계산 — P0

개발:

1. Text 전용 추정기를 Component Field 추정기로 변경
2. Image Aspect Ratio와 Width 기반 높이 계산
3. CTA Height 및 Field Gap 포함
4. 반복 Collection Geometry에 계산 높이 적용
5. Desktop/Mobile 독립 보정

완료 조건:

- `registry-promo-card` 3개가 모바일에서 겹치지 않음
- 순수 텍스트, 카드, 약관, CTA 레이아웃 모두 계약 통과
- 서버 진단에 변경된 Component Key와 전/후 좌표 기록

### Phase 3. 실제 DOM 측정 및 초기 Reflow — P0

개발:

1. ResizeObserver 기반 Component Rect 수집
2. Font/Image 안정화 후 최초 Collision 계산
3. 신규 AI Snapshot에 한정한 자동 Reflow Gate 추가
4. Section Height 확장
5. Reflow 반복·진동 방지

완료 조건:

- 실제 브라우저 Bounding Box 간 중첩 0px
- Image Load 전후 Layout Shift 이후에도 최종 중첩 없음
- 자동 Reflow가 최대 1회 또는 명시된 안정화 횟수 내 종료
- 수동 Drag 좌표를 자동 Reflow가 덮어쓰지 않음

### Phase 4. 기존 문서 겹침 확인·보정 — P1

개발:

1. 현재 Viewport Collision Audit
2. Outline Collision 표시
3. 사용자 실행형 `겹침 보정` 제공
4. Batch Command 및 Undo/Redo
5. AI 문서 Revision 저장·Conflict 처리

완료 조건:

- 기존 문서는 Load만으로 변경되지 않음
- 사용자가 보정 적용 전 변경 좌표를 확인 가능
- 저장 후 새 Revision에서 동일 좌표 재현
- Revision Conflict 발생 시 기존 충돌 해결 결과를 잃지 않음

### Phase 5. 회귀 테스트·배포 검증 — P0

개발:

1. 실제 Registry Promotion Card Fixture 사용
2. Composite Field 내부 선택 후 이동 핸들 Drag
3. Text Edit 상태에서 Drag 전환
4. Desktop 3열 및 Mobile 1열 Collision 검증
5. 기존 문서 Reflow·저장·Reload 검증
6. 전체 Test Suite 및 Production Build

완료 조건:

- 모든 자동 테스트 통과
- Browser에서 각 Component DOM Rect 간 충돌 없음
- 이동 후 저장 API Payload의 좌표 확인
- 배포된 Commit SHA와 테스트 환경 Commit SHA 일치
- 신규 로그·진단에서 무한 Reflow 또는 저장 반복 없음

---

## 9. 테스트 계획

### 9.1 단위 테스트

- 순수 Text 3개 세로 충돌
- 좌우 Column으로 분리된 Text는 이동하지 않음
- Composite `image + text + CTA` 높이 계산
- 1:1, 4:3, 16:9 이미지 비율
- Fixed Height Component 제외
- Hidden/Locked Component 처리
- Section Height 확장과 최대값 경고
- Desktop/Mobile 결과 독립성

### 9.2 Editor Core 테스트

- Drag 결과 Item Style Patch
- Mobile Drag 결과 Responsive Patch
- Batch Reflow Command 원자 적용
- Undo/Redo
- Dirty State
- Save 후 Mark Saved
- Revision Conflict

### 9.3 Browser E2E

필수 시나리오:

1. Promotion Card 내부 Description 클릭
2. Field Inspector가 표시되는지 확인
3. 이동 핸들로 카드 전체 이동
4. `xPct`, `yPx` 변경 확인
5. 저장 후 Reload
6. 동일 위치 확인
7. 카드 3개 AI 생성
8. 이미지 로드 완료 대기
9. 모든 카드 Rect 쌍의 교집합이 0인지 확인
10. Mobile 전환 후 동일 검증

### 9.4 실패 재현 Fixture

실제 Seed와 동일한 구조를 사용한다.

```text
registry-promo-card
  ├─ Card Image (4:3)
  ├─ Card Description (multi text)
  └─ Card Action (CTA)
```

단순 Text Fixture로 대체하지 않는다.

---

## 10. 관측성과 진단

개발 및 운영에서 다음 진단 정보를 남긴다.

- `viewport`
- `sectionKey`
- `itemKey`
- `componentType`
- `beforeRect`
- `afterRect`
- `collisionWith`
- `reflowReason`
- `reflowPass`
- `documentId`
- `documentRevision`

사용자 데이터 전체 문장은 로그에 남기지 않는다. 길이, Line Count, Field Type만 기록한다.

권장 코드:

- `TEXT_LAYOUT_OVERLAP_DETECTED`
- `TEXT_LAYOUT_OVERLAP_ADJUSTED`
- `COMPOSITE_LAYOUT_OVERLAP_DETECTED`
- `COMPOSITE_LAYOUT_REFLOW_APPLIED`
- `COMPOSITE_DRAG_BLOCKED`
- `LAYOUT_REFLOW_SECTION_LIMIT`

---

## 11. 호환성 및 배포

### 신규 AI 문서

- 서버 사전 보정 적용
- 최초 실제 DOM Reflow 적용
- 보정된 좌표를 생성 Snapshot에 저장

### 기존 AI 문서

- 자동 변경 없음
- `겹침 확인`만 자동 수행 가능
- `겹침 보정`은 사용자 확인 후 새 Revision으로 저장

### Layout Preset

- 원본 Preset JSON은 자동 수정하지 않음
- 반복적으로 보정되는 Preset은 설정의 Live Preview에서 별도 수정 권고
- 저장 JSON에 Geometry와 진단 결과를 함께 확인할 수 있도록 후속 연계 가능

### 배포 순서

1. 단위·계약 테스트 반영
2. 이동 핸들 및 Browser E2E 반영
3. 서버 Composite Height 계산 배포
4. 클라이언트 Initial Reflow Feature Gate 배포
5. 기존 문서 수동 Reflow 기능 배포
6. 로그 확인 후 Feature Gate 기본 활성화

Rollback 시 기존 Snapshot Schema는 변경하지 않으므로 코드 Rollback만으로 복구 가능하다.

---

## 12. 프롬프트·설정·마이그레이션 판단

### LLM 프롬프트

- 추가 또는 수정하지 않음
- `promo_page_composer` Prompt는 Section/Layout 선택까지만 담당
- 좌표 충돌 해소는 결정적 Layout Engine이 담당

향후 AI에게 Layout 의도를 추가해야 하는 경우에도 소스코드에 Prompt를 하드코딩하지 않고 `설정 > LLM Prompt`에서 관리한다.

### 설정 페이지

이번 P0 수정에 필수인 신규 설정값은 없다.

선택 기능:

- 기본 Reflow Gap Token
- Initial Reflow Feature Gate
- 최대 Reflow Pass
- Collision 진단 JSON 표시

운영에서 조절이 필요하다고 판단될 때 구조화된 Runtime 설정으로 추가하며 LLM Prompt와 혼합하지 않는다.

### DB Migration

- 1차 개발: 불필요
- 이유: 기존 Layout Snapshot과 AI Document Revision에 좌표 저장 가능
- Reflow 감사 이력을 별도 Table로 장기 보관할 경우에만 후속 Migration 검토

---

## 13. 완료 기준

다음 조건을 모두 만족하면 개발 완료로 판단한다.

1. 복합 컴포넌트를 전용 이동 핸들로 이동할 수 있다.
2. Field 선택과 Component 이동이 충돌하지 않는다.
3. Text 편집 상태에서 이동 핸들 사용 시 안전하게 이동 모드로 전환된다.
4. 이미지·텍스트·CTA가 포함된 반복 카드가 Desktop/Mobile에서 겹치지 않는다.
5. 실제 DOM Rect 기반 Collision 결과가 0이다.
6. 이동 및 Reflow 결과가 Undo/Redo와 AI 문서 Revision에 저장된다.
7. 기존 AI 문서는 사용자 동의 없이 변경되지 않는다.
8. 실제 Registry Card Browser E2E가 추가된다.
9. 전체 테스트와 Production Build가 통과한다.
10. 배포 Commit과 검증 Commit이 동일하다.
11. Prompt 하드코딩이 추가되지 않는다.
12. DB Migration 없이 적용된다.

---

## 14. 권장 실행 순서

```text
Phase 1: 이동 핸들 및 Interaction State
  → Phase 2: Composite 서버 높이 계산
  → Phase 3: 실제 DOM Initial Reflow
  → Phase 4: 기존 문서 수동 보정
  → Phase 5: 실제 Registry Browser E2E 및 배포 검증
```

P0 최소 배포 범위는 Phase 1~3과 Phase 5이다. Phase 4는 기존 문서 복구를 위해 같은 Release에 포함하는 것을 권장한다.
