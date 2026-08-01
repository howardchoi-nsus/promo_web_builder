# Live Preview 컴포넌트 선택·이동·Resize 안정화 디버깅 계획서

## 0. 문서 정보

- 작성일: 2026-08-01
- 대상 프로젝트: `promo_web_builder`
- 대상 화면: Visual Editor / Live Preview / Component Property Panel
- 대상 컴포넌트: Text, Image, CTA, 복합 Component
- 문서 상태: P0~P4 개발 반영 / 핵심 브라우저 회귀 통과 / 운영 저장 E2E 잔여
- 우선순위: P0
- 관련 문서:
  - `docs/qa/live-preview-component-resize-audit-2026-08-01.md`
  - `docs/계획/live-preview-outline-editor-text-alignment-development-plan-2026-07-31.md`
  - `docs/설계/visual-editor-live-preview-rich-text-design-2026-08-01.md`
  - `docs/handoff/handoff-2026-08-01.md`

## 1. 작성 배경

Live Preview의 컴포넌트 선택·이동·크기 변경 기능에 다음 문제가 반복적으로 확인됐다.

1. 모서리 handle을 천천히 drag하면 컴포넌트가 줄었다 늘어나는 것처럼 번쩍인다.
2. 최종 저장 크기는 대체로 맞지만 drag 중간 상태가 불안정해 오류처럼 보인다.
3. 확대와 축소에서 같은 flicker와 snap 현상이 발생한다.
4. CTA는 선택되더라도 이동 drag가 시작되지 않거나 native link drag가 개입한다.
5. CTA를 위쪽으로 확대하면 소속 Section의 높이 또는 Section 경계가 함께 움직인다.
6. Text는 단일 선택, 다중 선택 해제, 텍스트 범위 선택, 편집 진입이 충돌한다.
7. Text width/height 변경 중 줄바꿈 측정과 renderer 재렌더가 경쟁한다.
8. Live Preview와 Component Property Panel의 일반 클릭·다중 선택 규칙이 서로 다르다.
9. 빠른 자동 테스트에서는 최종 geometry만 확인돼 중간 프레임 오류를 놓쳤다.

현재 문제는 개별 CSS 보정으로 해결할 수 있는 수준이 아니다. Selection, Drag, Resize, Text Editing, Measurement가 같은 DOM과 이벤트 수명주기를 공유하면서도 단일 상태 계약을 사용하지 않는 것이 공통 원인이다.

## 2. 분석 결론

### 2.1 확정 원인 A — ResizeObserver feedback loop

현재 `PromoPageRenderer`는 모든 `.rendered-item`을 `ResizeObserver`로 관찰한다.

```text
pointermove
  → DOM에 임시 px width/height 적용
  → ResizeObserver 실행
  → measuredItemHeights 갱신
  → Vue renderer 재렌더
  → 저장된 widthPct/heightPx 재적용
  → 다음 pointermove에서 다시 임시 px 적용
```

이 feedback loop가 drag 중 flicker, snap, handle 이동, Section 경계 흔들림을 만든다.

최종 pointerup에서는 마지막 geometry를 저장하므로 최종 결과만 보면 정상처럼 보일 수 있다.

### 2.2 확정 원인 B — 측정 대상이 과도함

자동 Section 높이 계산에 실제 측정값이 필요한 대상은 원칙적으로 `heightMode: auto`인 Text다.

현재는 Image, CTA, 고정 높이 Text까지 observer 대상이다. 이로 인해 사용자가 Component frame만 변경해도 Section 계산과 renderer 전체가 반응한다.

### 2.3 확정 원인 C — 선택 경로 불일치

Live Preview canvas의 일반 클릭과 Component Property Panel의 일반 클릭이 서로 다른 선택 규칙을 사용한다.

- Canvas: 일반 클릭 시 단일 선택으로 축소하도록 일부 보정됨
- Property Panel: 이미 다중 선택에 포함된 항목이면 `preserveMulti` 유지
- Property Panel: 선택과 accordion 열기/닫기를 한 click handler에서 동시에 처리

따라서 같은 Component를 클릭해도 위치에 따라 선택 결과가 달라진다.

### 2.4 확정 원인 D — CTA native interaction

CTA는 실제 `<a>` 요소다.

편집 모드에서 링크 이동은 차단했지만 브라우저의 native anchor drag와 이미지/링크 drag 가능성은 별도 차단되지 않았다. Component 이동 gesture보다 native drag가 먼저 시작되면 CTA가 이동되지 않는다.

### 2.5 확정 원인 E — Text gesture 경쟁

Text Component는 다음 입력을 같은 DOM 영역에서 처리한다.

- 단일 click 선택
- Ctrl/Meta/Shift click 다중 선택
- pointer drag 이동
- double click 편집 시작
- contenteditable 내부 범위 선택
- line selection과 toolbar 상태 갱신

명시적 interaction mode 없이 `pointerdown`, `click`, `dblclick`, `selectionchange`를 조합해 처리하므로 이벤트 순서에 따라 선택이 풀리거나 drag가 먼저 시작될 수 있다.

## 3. 목표

### 3.1 기능 목표

1. Text, Image, CTA 모두 resize 중 시각적으로 안정적이어야 한다.
2. resize 중 Component와 handle은 pointer를 연속적으로 따라야 하며 역방향 snap이 없어야 한다.
3. Component resize는 Section 높이를 자동 변경하지 않아야 한다.
4. Section 높이는 Section 전용 handle 또는 명시적 Property 입력으로만 변경한다.
5. CTA도 Text/Image와 동일한 규칙으로 선택·이동·resize할 수 있어야 한다.
6. 일반 클릭은 모든 UI surface에서 단일 선택으로 전환해야 한다.
7. 다중 선택은 명시적인 modifier 또는 checkbox에서만 유지해야 한다.
8. Text 편집 중에는 Component 이동이 시작되지 않아야 한다.
9. Text 편집이 아닌 상태에서는 문자 범위 선택이 Component 선택을 방해하지 않아야 한다.

### 3.2 품질 목표

- resize 중 renderer reactive update: frame당 최대 1회
- resize 중 layout 저장 command: 0회
- pointerup 시 layout 저장 command: 정확히 1회
- resize 중 Section height 변화: 0px
- 종료 후 `.is-resizing`, `.is-dragging`: 0개
- 브라우저 console error/warning: 0개
- Desktop/Mobile 선택 상태와 geometry 저장 위치가 분리돼야 한다.

## 4. 범위

### 포함

- `PromoPageRenderer.vue` interaction session
- Component Property Panel 선택 계약
- Text/Image/CTA 이동과 resize
- ResizeObserver 측정 정책
- Section height와 Component height 분리
- Pointer, keyboard, blur, pointercancel, lostpointercapture
- Desktop/Mobile responsive style patch
- Undo/Redo command 경계
- 브라우저 중간 프레임 테스트

### 제외

- 새로운 Component 유형 추가
- Rich Text 데이터 모델 전면 교체
- Section 레이아웃 AI 알고리즘 변경
- Web Output 디자인 변경
- 운영 데이터 마이그레이션
- Section 자체 resize UX 재설계

## 5. 수정 원칙

### 5.1 단일 interaction owner

한 시점에 다음 중 하나만 활성화한다.

```text
idle
  ├─ selecting
  ├─ dragging-component
  ├─ resizing-component
  ├─ resizing-section
  └─ editing-text
```

새 interaction이 시작되면 기존 session을 먼저 종료 또는 취소한다.

### 5.2 DOM은 preview, state는 commit

pointermove 중에는 transient geometry만 갱신한다.

- 저장 layout 변경 금지
- Editor Command 실행 금지
- Section style 변경 금지
- ResizeObserver 기반 geometry 반영 금지

pointerup에서만 최종 geometry를 하나의 Command로 저장한다.

### 5.3 측정과 편집 분리

ResizeObserver는 자동 높이 Text 측정 전용으로 제한한다.

관찰 허용:

- `fieldKind === "text"`
- `heightMode === "auto"`
- interaction session이 `idle`

관찰 제외:

- Image
- CTA
- 고정 높이 Text
- resize/drag 중인 Component
- Section resize 중 모든 Component

### 5.4 Component와 Section geometry 분리

Component resize는 현재 Section canvas bounds 안에서 clamp한다.

Section 확장이 필요한 경우:

- Component resize에서 자동 확장하지 않는다.
- 사용자에게 Section handle 사용을 안내한다.
- 필요하면 별도 `Section에 맞추기` command를 후속 기능으로 제공한다.

## 6. 목표 Interaction 설계

### 6.1 Resize session

권장 session 데이터:

```js
{
  kind: "component-resize",
  pointerId,
  sectionKey,
  itemKey,
  direction,
  startPointer: { x, y },
  startGeometry: { x, y, width, height },
  currentGeometry: { x, y, width, height },
  containerBounds,
  aspectRatio,
  moved,
  cancelled
}
```

동작 순서:

1. pointerdown에서 기존 session 종료
2. 실제 DOM geometry를 한 번만 측정
3. observer의 편집 대상 측정 일시 중단
4. pointer capture 획득
5. pointermove에서 geometry 계산
6. `requestAnimationFrame`에서 overlay 또는 transient style 갱신
7. pointerup에서 한 번만 Command 실행
8. transient style과 class 제거
9. nextTick 후 자동 높이 Text만 재측정

### 6.2 Drag session

- 활성화 거리: 현재 7px 유지
- 활성화 이전에는 선택만 처리
- 활성화 이후 text selection과 native drag 차단
- CTA anchor에는 `draggable="false"` 적용
- `dragstart` 기본 동작 차단
- 이동 결과는 pointerup에서 한 번만 저장

### 6.3 Text editing session

편집 진입:

- double click 또는 명시적 Edit action
- `editing-text` 상태 전환 후 drag/resize 비활성화
- contenteditable focus 후 selection 생성

편집 종료:

- blur: 저장
- Escape: 취소
- 다른 Component 선택: 현재 편집 먼저 종료
- line selection state 정리

금지 사항:

- 편집 중 article `pointerdown`으로 Component drag 시작
- 첫 click에서 selection reset 후 두 번째 click에서 편집 진입
- selectionchange가 다른 Component의 toolbar 상태를 갱신

### 6.4 Selection 계약

| 입력 | 결과 |
|---|---|
| Component 일반 클릭 | 해당 Component 단일 선택 |
| 이미 선택된 Component 일반 클릭 | 단일 선택 유지, 해제하지 않음 |
| Ctrl/Meta click | 다중 선택 toggle |
| Shift click | 제품 정책 확정 전 Ctrl/Meta와 동일 toggle |
| 빈 Preview 클릭 | 전체 선택 해제 |
| Resize handle pointerdown | 대상 Component 선택 유지 후 resize 시작 |
| Property Panel header 클릭 | 단일 선택 + panel 열기 |
| Property Panel chevron 클릭 | 선택 변경 없이 panel 열기/닫기 |
| Multi checkbox | 다중 선택만 변경 |

선택과 accordion toggle을 분리해야 한다.

## 7. 컴포넌트별 정책

### 7.1 Image

- locked ratio: corner handle만 표시
- free ratio: edge와 corner handle 표시
- resize 중 aspect ratio와 geometry는 session에서 관리
- observer 대상 제외
- Section height 자동 변경 금지
- circle은 1:1 유지

### 7.2 CTA

- `<a>`의 `draggable` 비활성화
- 편집 모드 link navigation 차단
- Component frame과 실제 CTA box 크기 일치
- observer 대상 제외
- 이동·resize 시 Section height 자동 변경 금지
- 최소 pointer target 정책과 Component 최소 크기를 별도로 관리

### 7.3 Text auto height

- 기본적으로 좌우 handle만 제공
- width 변경 중 임시 줄바꿈 결과는 transient preview로 표시
- drag session 중 observer 결과 저장 금지
- pointerup 이후 한 번 재측정
- 재측정 결과가 Section auto layout에 반영되는 시점을 한 프레임 뒤로 고정

### 7.4 Text fixed height

- 8방향 handle 허용
- observer 대상 제외
- overflow 정책은 현재 `hidden` 유지
- 잘림 경고 유지
- Section height 자동 변경 금지

### 7.5 복합 Component

- 개별 field가 아니라 외부 Component frame을 이동·resize
- 내부 Text auto height 측정이 외부 resize session을 방해하지 않도록 중단
- CTA field native drag 차단

## 8. 단계별 디버깅·개발 계획

## P0. 재현 기준선과 계측 추가

목표: 중간 프레임 오류를 자동으로 관측할 수 있게 한다.

작업:

1. fixture에 긴 Text, Image, CTA, 복합 Component 추가
2. 각 Component에 stable `data-testid` 또는 interaction 식별자 추가
3. 개발 모드에서 session kind, pointerId, geometry, commit count를 조회할 수 있는 최소 계측 제공
4. Section/Component rect history를 브라우저 테스트에서 수집
5. 300~800ms의 느린 drag 시나리오 추가

합격 기준:

- 현재 flicker를 테스트에서 실패로 재현
- Property Panel 일반 클릭 후 다중 선택 유지 문제 재현
- CTA native drag 개입 재현
- Text selection/drag 충돌 재현

## P1. ResizeObserver 측정 정책 분리

목표: resize feedback loop 제거

작업:

1. 모든 item을 관찰하는 query 제거
2. 자동 높이 Text만 observer 등록
3. active interaction 중 callback 무시
4. session 종료 후 `nextTick + requestAnimationFrame`에서 1회 재측정
5. 측정값 변화 tolerance와 동일값 갱신 방지 유지

합격 기준:

- Image/CTA/fixed Text resize 중 observer callback에 의한 reactive write 0회
- 느린 drag에서 width/height 역방향 frame 0회
- Section height 변화 0px

## P2. 선택·Accordion 계약 통일

목표: 모든 surface에서 같은 클릭 결과 제공

작업:

1. `selectItem`과 `toggleComponent` 역할 분리
2. Property header 일반 클릭은 단일 선택
3. accordion toggle은 chevron 전용 action으로 분리
4. Canvas/Structure/Property 선택을 동일 command/helper로 통합
5. modifier와 checkbox에서만 다중 선택 유지

합격 기준:

- Canvas, Page Tree, Property Panel에서 같은 일반 클릭 결과
- 다중 선택 항목 일반 클릭 시 1개로 축소
- 열린 Property Panel 내부 클릭으로 accordion이 닫히지 않음

## P3. CTA·Text gesture 분리

목표: Component 유형별 native interaction 충돌 제거

작업:

1. CTA `draggable="false"`
2. 편집 모드 `dragstart` 차단
3. Text editing 상태에서 Component drag 금지
4. double click 편집 진입과 single click 선택 순서 고정
5. line selection listener의 owner Component 검증
6. blur/cancel/selection change cleanup 통합

합격 기준:

- CTA 이동 drag 성공률 100%
- CTA 클릭 시 URL·scroll 변화 없음
- Text 편집 중 Component 위치 변화 없음
- Text 편집 종료 후 drag 즉시 가능

## P4. Component·Section geometry 완전 분리

목표: Component resize가 Section을 변경하지 않게 한다.

작업:

1. Component resize 경로의 `update-section-style` 호출 금지 계약 추가
2. 현재 canvas bounds 기준 min/max 계산 통일
3. CTA와 fixed Text 측정값을 Section auto height에서 제외
4. auto Text 재측정만 Section auto layout 후보로 사용
5. Section handle interaction과 Component interaction session 상호 배타 처리

합격 기준:

- Image/CTA/fixed Text를 모든 방향으로 resize해도 Section rect 불변
- Section handle을 사용할 때만 Section rect 변경
- Component가 Section bounds를 초과하지 않음

## P5. 통합 회귀·배포 검증

목표: 최종 프레임뿐 아니라 전체 interaction sequence 검증

작업:

1. Unit/contract/component/browser test 실행
2. Desktop/Mobile 각각 검증
3. Production build 생성
4. 배포 chunk hash와 main bundle 참조 확인
5. 운영 데이터 save/reopen 검증
6. QA 문서와 handoff 갱신

합격 기준:

- 전체 테스트 통과
- production console warning/error 0개
- resize 결과 저장 후 reload 동일
- Undo 1회로 resize 전체가 복구
- redo 1회로 최종 geometry 복원

## 9. 테스트 계획

### 9.1 Unit Test

- direction별 resize geometry
- aspect ratio locked/free
- Section bounds clamp
- anchored/free position
- min/max size
- pointer cancel 시 원상 복구
- selection reducer 일반/additive 입력

### 9.2 Contract Test

- Image/CTA/fixed Text observer 등록 금지
- Component resize에서 Section style emit 금지
- CTA `draggable=false`
- Property Panel selection과 accordion handler 분리
- interaction session cleanup 등록

정규식 존재 여부만 확인하는 테스트는 보조 수단으로 사용한다. 동작 검증을 대체하지 않는다.

### 9.3 Browser Interaction Test

필수 시나리오:

1. Image corner slow grow
2. Image corner slow shrink
3. Image free-ratio edge resize
4. CTA drag move
5. CTA north resize
6. CTA south resize
7. Text auto width resize
8. Text fixed corner resize
9. Text double click edit 후 범위 선택
10. 다중 선택 후 Canvas 일반 클릭
11. 다중 선택 후 Property Panel 일반 클릭
12. pointercancel, lostpointercapture, blur
13. Desktop/Mobile 각각 resize 후 viewport 전환

각 시나리오에서 수집할 값:

- Component rect frame history
- Section rect frame history
- active session kind
- `.is-resizing`, `.is-dragging` 개수
- Editor Command 실행 횟수
- observer reactive write 횟수
- selected item keys
- console logs

### 9.4 Flicker 판정 기준

한 방향으로 확대하는 drag에서 다음이 발생하면 실패다.

- width 또는 height가 직전 프레임보다 1px 이상 역방향 변화
- handle 좌표가 pointer 반대 방향으로 이동
- Section height가 0.5px 이상 변화
- Component가 저장 widthPct로 순간 복귀
- 한 session에서 layout command가 2회 이상 실행

## 10. 수정 대상 파일

주요 대상:

- `visual-editor/src/PromoPageRenderer.vue`
- `visual-editor/src/App.vue`
- `visual-editor/src/platform/editor-ui/PreviewPanel.vue`
- `visual-editor/src/platform/layout-engine/geometry.mjs`
- `visual-editor/src/platform/layout-engine/resize.mjs`
- `visual-editor/src/promo-renderer.css`

테스트:

- `scripts/test-visual-editor-contract.js`
- `scripts/test-visual-editor-behavior.mjs`
- `scripts/test-editor-layout-engine.mjs`
- `scripts/test-create-promo-browser-smoke.mjs`
- 신규 slow interaction browser test

문서:

- `docs/qa/live-preview-component-resize-audit-2026-08-01.md`
- `docs/handoff/handoff-2026-08-01.md`

## 11. 위험과 대응

| 위험 | 영향 | 대응 |
|---|---|---|
| Observer 축소 후 auto Text 높이 미반영 | Text overflow | auto Text만 명시적 관찰 및 session 종료 후 재측정 |
| CTA native drag 차단이 Web Output에 영향 | 실제 CTA 사용 불가 | `editable` 모드에서만 차단 |
| Section 자동 확장 제거로 Component가 잘림 | 편집 혼란 | canvas clamp와 Section handle 안내 |
| Selection helper 통합 중 다중 정렬 회귀 | Multi Layout 오류 | selection reducer unit test 추가 |
| transient geometry와 저장 geometry 오차 | pointerup 시 jump | 동일 geometry 함수와 동일 bounds 사용 |
| Mobile override가 Desktop을 덮음 | 반응형 레이아웃 오염 | viewport별 command test와 reload 검증 |

## 12. 실행 순서와 커밋 권고

```text
Commit 1 — 재현 fixture·slow drag 실패 테스트
Commit 2 — ResizeObserver 측정 대상과 session 분리
Commit 3 — Selection·Property accordion 계약 통일
Commit 4 — CTA·Text gesture 충돌 제거
Commit 5 — Component·Section geometry 분리 회귀
Commit 6 — Production build·QA·handoff
```

각 commit은 독립적으로 테스트 가능해야 한다. 테스트가 실패하는 상태로 다음 단계에 진입하지 않는다.

## 13. 중단 조건

다음 조건에서는 구현을 중단하고 원인을 다시 분석한다.

1. observer를 중단해도 slow drag flicker가 재현됨
2. Section rect는 고정인데 사용자가 Section 이동을 계속 인지함
3. CTA native drag 차단 후에도 이동이 시작되지 않음
4. Text editing과 drag를 상태로 분리해도 selection이 풀림
5. Desktop에서는 통과하지만 Mobile에서 geometry가 달라짐

이 경우 CSS transform, Preview scale, scroll container, pointer coordinate 변환을 별도 계측한다.

## 14. 완료 정의

다음 조건을 모두 만족해야 완료로 판정한다.

- [x] Image 확대·축소 slow drag에서 flicker 없음
- [x] CTA 이동 가능
- [x] CTA 위쪽 resize 안정적
- [x] Text 단일·다중 선택 및 Property Panel 일반 클릭 정상
- [x] Text 편집 진입·범위 선택·Escape 해제 정상
- [x] Text auto width resize 안정적
- [x] Image/CTA resize 시 Section 높이 불변
- [ ] Section handle에서만 Section 높이 변경
- [ ] pointercancel/blur/capture 상실 후 stale session 없음
- [x] Desktop/Mobile image geometry 격리
- [ ] Undo/Redo 1회 단위 정상
- [ ] save/reopen geometry 동일
- [x] 중간 프레임 browser test 통과
- [x] production build 통과

최종 완료 보고에는 단순히 “최종 크기가 맞음”을 사용하지 않는다. 느린 drag 전체 프레임, 선택 상태, Section rect, command 횟수, 종료 cleanup을 함께 증거로 제시해야 한다.

## 15. 2026-08-01 개발 반영 결과

### 15.1 반영 내용

1. `ResizeObserver` 대상을 모든 Component에서 자동 높이 Text로 축소했다.
2. drag, resize, text edit, section resize에 명시적 interaction session을 두고 session 중 측정값 reactive write를 중단했다.
3. session 종료 후 Vue DOM 반영 다음 frame에서 자동 높이 Text를 다시 측정한다.
4. Image, CTA, 고정 높이 Text는 자동 Section 높이 계산에서 실측값을 사용하지 않는다.
5. drag/resize 중 Component의 CSS transition을 비활성화해 anchored transform 전환 애니메이션을 제거했다.
6. Property Panel의 Component 선택 버튼과 accordion toggle 버튼을 분리했다. 일반 선택은 다중 선택을 단일 선택으로 축소한다.
7. 편집 모드 CTA에 `draggable=false`와 `dragstart` 차단을 추가하고 실제 링크 이동만 막았다.
8. Text 편집 중 Component resize를 시작하지 않으며 편집 종료 시 session과 selection listener를 정리한다.

### 15.2 브라우저 실측

- Image slow grow 중간 frame: `143.75 → 162.75 → 180.75 → 199.75px`
- Image slow shrink 중간 frame: `195.72 → 184.72 → 163.72px`
- 위 두 동작의 Feature Content Section 높이: 전 frame `461.453125px`
- CTA 이동: `(780, 327.92) → (815, 337.92)`로 35px/10px 이동 성공, URL 유지
- CTA north resize: 높이 `64 → 94px`, Section 높이 `956.921875px` 유지
- Text auto width resize: drag 중 width `142.75 → 161.75 → 185.75px`로 단조 증가
- Property Panel: 다중 선택 2개 상태에서 일반 클릭 후 선택 1개, toggle 클릭 후에도 선택 1개 유지
- Text: double click 후 `contenteditable=true`, 범위 선택 시 toolbar 활성, Escape 후 `contenteditable=false`
- Mobile image resize: `129.61 → 149.59px`, Section 높이 `589.015625px` 유지
- Desktop 복귀 후 image width `161.734375px` 유지

### 15.3 자동 검증

- Visual Editor contract test 통과
- layout engine, behavior, context, multi-component layout, motion, preset, component contract 관련 11개 테스트 통과
- Vite production build 통과
- `git diff --check` 통과

전체 테스트 runner는 별도 기존 이슈로 완주하지 못했다. 로컬 Playwright Chromium binary가 설치되지 않았고, `test-app-css-hardcoded-values.js`는 이번 변경과 무관한 기존 `rgba()` 1건 때문에 실패한다. 인앱 브라우저 핵심 interaction 회귀는 별도로 통과했다.
