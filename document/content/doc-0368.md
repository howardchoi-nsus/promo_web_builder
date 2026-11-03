# Live Preview 선택·편집·이동 상호작용 진단 리포트

## 1. 개요

- 점검일: 2026-08-01
- 기준 브랜치/커밋: `main` / `9ffb22f`
- 대상: Visual Editor Live Preview의 Component 선택·선택 해제·텍스트 직접 편집·라인 선택·Drag
- 조사 범위: 진단과 리포팅만 수행했으며 제품 소스는 수정하지 않았다.
- 브라우저 기준: 저장소의 `scripts/serve-visual-editor-preview.js` fixture 모드
- Production 배포와 실제 운영 DB 저장은 이번 조사 범위에서 확인하지 않았다.

## 1.1 수정 반영 결과

- 반영일: 2026-08-01
- P0/P1 7건의 제품 소스 수정 완료
- Preview background click에서 Component·line selection 동시 해제
- 실제 더블클릭의 단일 edit session 보장 및 중복 Undo 제거
- selection 변경 전 활성 편집기를 동기적으로 확정
- Escape 원문 복원, Undo history 불변, line Toolbar 비활성화
- Drag의 capture 전·후 `pointerup`, `pointercancel`, `lostpointercapture`, window blur, visibility change cleanup 통합
- 직접 편집의 전체 `.trim()` 제거로 개행·선행·후행 공백 보존
- `ResizeObserver` 실측 높이를 기본 Component stack과 Section 높이에 반영
- Desktop/Mobile fixture 브라우저에서 Component 순차 배치와 Section bounds 수용 확인
- 관련 정적·계약 테스트 7종과 Visual Editor production build 통과

브라우저 실측 회귀 결과:

```text
Preview 빈 영역 클릭 후 selected: []
Escape 후 text: Limited-time welcome bonus
Escape 후 editing: 0, Bold disabled: true, Undo disabled: true
편집 확정 후 Undo 1회: Limited-time welcome bonus
capture 전 외부 pointer 종료 후 dragging: false, 위치 변경 없음, console error 없음
Desktop Hero: Title → Description → CTA 비겹침 순차 배치
Mobile Hero: Title → Description → CTA 비겹침 순차 배치, Section 높이 1299px로 확장
```

## 2. 결론

사용자가 보고한 "선택이 해제되지 않음"과 "텍스트가 마우스를 따라다님"은 하나의 단일 오류가 아니라 다음 상태 수명주기 문제들이 겹쳐 나타나는 것으로 판단한다.

1. Preview 빈 영역에 Component/라인 선택을 해제하는 명령이 없다.
2. 텍스트 편집 종료 후에도 `selectedTextLines`가 남아 Toolbar가 활성 상태를 유지한다.
3. 실제 브라우저의 더블클릭 한 번이 편집 진입을 중복 실행해 저장 명령과 Undo 이력을 두 번 만든다.
4. Drag 활성화 전 pointer가 대상 밖에서 종료되면 종료 이벤트를 놓칠 수 있고, 이전 pointer listener가 남을 수 있다.
5. Auto-height 텍스트의 실측 높이가 Section 높이를 크게 넘어도 Section과 hit area가 조정되지 않아 다른 Component의 클릭 영역을 침범한다.

P0 3건, P1 4건을 확인했다. 이 중 P0-1, P0-2, P1-1, P1-2, P1-3은 fixture 브라우저에서 재현했고, P0-3은 사용자 증상과 코드 이벤트 흐름이 직접 일치하는 고신뢰 원인이다.

## 3. 발견 이슈

### P0-1. Preview 빈 영역에서 Component 선택이 해제되지 않음

상태: 브라우저 재현 완료

재현:

1. `heroBanner.title`이 선택된 상태로 Live Preview를 연다.
2. Section 안에서 Component가 없는 오른쪽 빈 영역을 클릭한다.
3. `heroBanner.title`의 `.is-selected`가 그대로 남는다.

실측 결과:

```text
클릭 전 selected: ["heroBanner.title"]
빈 영역 클릭 후 selected: ["heroBanner.title"]
activeElement: BODY
```

원인:

- `PreviewPanel.vue`의 `.preview-stage`에는 dragover/drop만 있고 background click을 selection clear로 전달하는 경로가 없다.
- Renderer의 Component click은 모두 propagation을 중단한다.
- 이미 선택된 Component를 다시 클릭하면 `selectRendererItem()`이 즉시 반환하므로 toggle-off도 발생하지 않는다.
- App의 `clearMultiSelection()`은 다중 선택을 현재 단일 선택으로 줄일 뿐, Component 선택 자체를 비우는 명령이 아니다.

영향:

- 사용자는 선택을 해제할 방법을 직관적으로 찾을 수 없다.
- Selection Box와 Property Panel이 계속 남아 "선택 해제 실패"로 인식된다.
- 다음 편집 동작의 기준 Component가 사용자의 인식과 달라질 수 있다.

관련 코드:

- `visual-editor/src/platform/editor-ui/PreviewPanel.vue:236`
- `visual-editor/src/PromoPageRenderer.vue:617`
- `visual-editor/src/PromoPageRenderer.vue:1149`

### P0-2. 실제 더블클릭이 편집 진입과 저장 명령을 중복 실행함

상태: 브라우저 재현 완료

재현:

1. 텍스트를 실제 브라우저 더블클릭으로 편집한다.
2. 전체 선택된 텍스트를 `DUPLICATE-CHECK`로 교체한다.
3. 다른 Component를 클릭해 편집을 확정한다.
4. Undo를 한 번 누르면 텍스트가 그대로다.
5. Undo를 두 번째 눌러야 원문으로 돌아온다.

실측 결과:

```text
편집 확정: DUPLICATE-CHECK
Undo 1회: DUPLICATE-CHECK
Undo 2회: Limited-time welcome bonus
```

원인:

- 두 번째 click의 `event.detail >= 2` 경로가 `startTextEdit()`를 호출한다.
- 이어지는 article의 capture `dblclick`도 `startArticleTextEdit()`을 통해 같은 `startTextEdit()`를 호출한다.
- text node 자체에도 `dblclick` handler가 중복 선언되어 있다.
- `startTextEdit()`에는 이미 `.is-editing`인지 확인하는 재진입 방지 장치가 없다.
- 각 진입이 별도의 `selectionchange`, `blur`, `keydown` listener를 등록해 blur 시 동일 content update가 중복 실행된다.

영향:

- Undo 한 번으로 직전 사용자 조작이 취소되지 않는다.
- listener와 command가 중복되어 간헐적인 선택·저장·Toolbar 상태 이상을 만든다.
- 빠른 반복 더블클릭에서 중복 listener가 누적될 가능성이 있다.

관련 코드:

- `visual-editor/src/PromoPageRenderer.vue:930`
- `visual-editor/src/PromoPageRenderer.vue:994`
- `visual-editor/src/PromoPageRenderer.vue:1006`
- `visual-editor/src/PromoPageRenderer.vue:1009`
- `visual-editor/src/PromoPageRenderer.vue:1150`
- `visual-editor/src/PromoPageRenderer.vue:1317`

### P0-3. Drag 활성화 전 pointer 종료를 놓치면 listener가 남을 수 있음

상태: 코드상 고신뢰 원인, 자동 브라우저에서 동일 증상의 결정적 재현은 미완료

사용자 증상과 일치하는 경로:

1. Component에서 pointerdown한다.
2. Drag threshold를 넘기 전에 pointer가 Component 밖 또는 브라우저 경계로 이동한다.
3. 대상이 pointer capture를 아직 획득하지 않은 상태에서 pointerup된다.
4. `pointerup`이 원래 target에 전달되지 않아 `end()`가 실행되지 않는다.
5. target에 `pointermove/up/cancel` listener가 남는다.
6. 이후 mouse가 target에 다시 들어오면 과거 시작 좌표를 기준으로 move가 재실행될 수 있다.

원인:

- pointer listener를 target에만 등록한다.
- pointer capture는 threshold를 넘은 뒤에만 설정한다.
- threshold 이전 종료를 보장할 window/document-level pointerup 경로가 없다.
- `lostpointercapture`, window blur, document visibility change에 대한 cleanup이 없다.
- 새 pointerdown 전에 이전 drag session을 정리하는 단일 session guard가 없다.

이 구조는 click/double-click 보호를 위해 capture를 늦춘 설계 자체보다, capture 전 구간의 종료 보장이 빠져 있는 것이 문제다.

영향:

- 버튼을 놓았는데도 Component가 pointer 이동에 반응하는 "마우스를 따라다님" 증상이 가능하다.
- stale listener가 중첩되면 위치 patch나 임시 inline style 정리가 예측 불가능해질 수 있다.

관련 코드:

- `visual-editor/src/PromoPageRenderer.vue:627`
- `visual-editor/src/PromoPageRenderer.vue:647`
- `visual-editor/src/PromoPageRenderer.vue:681`
- `visual-editor/src/PromoPageRenderer.vue:698`

### P1-1. 편집 종료 후 라인 선택과 Toolbar 상태가 남음

상태: 브라우저 재현 완료

재현:

1. 텍스트를 더블클릭해 전체 라인을 선택한다.
2. `Escape` 또는 blur로 편집을 종료한다.
3. `.is-editing`은 사라지지만 Bold/List 등 라인 Toolbar가 계속 활성 상태다.
4. Preview 빈 영역을 클릭해도 활성 상태가 유지된다.

실측 결과:

```text
editing: 0
selected: ["heroBanner.title"]
Bold disabled: false
```

원인:

- `selectedTextLines`는 `selectedStyleKey`가 바뀔 때만 초기화된다.
- blur/finish 또는 selection이 Renderer 밖으로 이동한 경우 clear selection event를 emit하지 않는다.
- `emitLineSelection()`은 line index가 없으면 단순 return한다.

영향:

- caret/selection이 없는 상태에서도 이전 라인에 서식 patch를 적용할 수 있다.
- 통합 정책의 "라인 선택 또는 caret 위치가 확인되지 않으면 컨트롤 비활성화" 규칙과 불일치한다.

관련 코드:

- `visual-editor/src/platform/editor-ui/PreviewPanel.vue:68`
- `visual-editor/src/PromoPageRenderer.vue:957`
- `visual-editor/src/PromoPageRenderer.vue:968`

### P1-2. `Escape`가 취소가 아니라 변경 내용을 저장함

상태: 브라우저 재현 완료

재현:

1. 원문 `Limited-time welcome bonus`를 편집한다.
2. `ESCAPE-CANCEL-CHECK`로 교체한다.
3. `Escape`를 누른다.
4. 편집 모드는 끝나지만 변경된 문자열이 저장된다.

실측 결과:

```text
Escape 후 text: ESCAPE-CANCEL-CHECK
editing: 0
```

원인:

- Escape handler가 취소 상태를 기록하거나 원문을 복원하지 않고 `textNode.blur()`만 호출한다.
- blur의 `finish()`는 항상 `update-item-content`를 emit한다.

영향:

- 정책서와 설계서에 명시된 Escape 취소 계약을 위반한다.
- 사용자가 변경을 폐기했다고 생각하지만 실제 문서와 Undo history가 변경된다.

관련 코드:

- `visual-editor/src/PromoPageRenderer.vue:968`
- `visual-editor/src/PromoPageRenderer.vue:984`

### P1-3. Auto-height Text가 Section 밖으로 넘쳐 hit area가 겹침

상태: fixture 브라우저에서 재현 완료

Desktop 실측:

```text
Hero Section: 463 x 288 px
Title Item/Text: 141.75 x 649.58 px
Description: 141.75 x 191.34 px
```

Mobile 실측:

```text
Hero Section: 375 x 288 px
Title Item/Text: 113.59 x 927.97 px
Description: 113.59 x 255.13 px
```

원인:

- Text Selection Box는 실제 text DOM height를 따르도록 바뀌었다.
- Component는 absolute positioning이고 Section height는 기존 값에 머문다.
- 좁은 width와 큰 title font로 줄바꿈이 증가해 실제 Item 높이가 Section을 크게 초과한다.
- 초과한 `.rendered-item`은 pointer event를 계속 받으므로 아래 Component/Section과 hit area가 겹친다.

영향:

- 사용자가 보이는 텍스트를 클릭해도 다른 Component가 선택될 수 있다.
- 빈 영역처럼 보이는 곳이 상위 Text Item의 drag hit area가 될 수 있다.
- Mobile에서 증상이 크게 악화된다.
- Selection Box 실측 자체는 맞더라도 편집 가능 영역 전체의 상호작용은 불안정해진다.

관련 코드:

- `visual-editor/src/promo-renderer.css:8`
- `visual-editor/src/promo-renderer.css:9`
- `visual-editor/src/promo-renderer.css:36`
- `visual-editor/src/promo-renderer.css:52`

### P1-4. 직접 편집 저장 시 선행·후행 공백과 빈 줄이 제거됨

상태: 코드 확인

원인:

- `finish()`가 정규화된 `innerText` 전체에 `.trim()`을 적용한다.

영향:

- 첫 줄 앞/마지막 줄 뒤 공백 및 의도한 처음·마지막 빈 줄을 보존하지 못한다.
- 설계서의 "개행을 보존한 plain string" 계약보다 실제 저장이 더 파괴적이다.

관련 코드:

- `visual-editor/src/PromoPageRenderer.vue:969`

## 4. 기존 자동 테스트가 놓치는 이유

관련 정적 계약·동작 테스트는 모두 통과했다.

```text
test-text-editor-controls-contract.mjs  PASS
test-visual-editor-contract.js          PASS
test-visual-editor-behavior.mjs         PASS
test-editor-ui-contract.js              PASS
test-editor-layout-engine.mjs           PASS
```

하지만 현재 테스트는 다음 실제 브라우저 경로를 확인하지 않는다.

1. `dispatchEvent("dblclick")`만 사용해 실제 `click(detail=2) → dblclick` 이벤트 조합을 재현하지 않는다.
2. Escape 테스트는 빈 placeholder가 저장되지 않는지만 확인하고, 기존 텍스트 변경이 원문으로 복원되는지 확인하지 않는다.
3. minor jitter 테스트는 target 안에서 pointerup하므로 capture 전 target 이탈/외부 종료를 확인하지 않는다.
4. 빈 Preview 영역 클릭에 의한 Component selection clear를 테스트하지 않는다.
5. blur 이후 라인 Toolbar disabled 상태를 테스트하지 않는다.
6. 한 번의 직접 편집이 정확히 하나의 Undo 단위인지 테스트하지 않는다.
7. Auto-height Item이 Section bounds를 침범하는지 Desktop/Mobile에서 hit testing하지 않는다.

관련 테스트:

- `scripts/test-create-promo-browser-smoke.mjs:561`
- `scripts/test-create-promo-browser-smoke.mjs:594`
- `scripts/test-create-promo-browser-smoke.mjs:604`

공식 브라우저 smoke test 자체는 현재 로컬 `node_modules`에 `playwright` package가 없어 실행되지 않았다. 대신 in-app browser와 공식 fixture server로 실제 상호작용을 검증했다.

## 5. 빌드·환경 확인

- 현재 정적/계약 테스트 5종은 번들 Node 24.14에서 통과했다.
- Visual Editor build는 로컬 의존성 상태에서 `@fortawesome/fontawesome-free`를 resolve하지 못해 실패했다.
- 이는 이번 상호작용 결함의 직접 원인으로 판단하지 않으며, Production/CI의 Node 22 환경에서 별도 확인해야 한다.
- 조사 중 build가 건드린 생성 자산은 원래 Git 상태로 복구했다.
- 최종 Git 작업 폴더에는 본 리포트 외 제품 소스 변경이 없다.

## 6. 권장 수정 순서

### 1차 P0 안정화

1. 편집 session을 하나만 허용하고 `startTextEdit()` 재진입을 차단한다.
2. 편집 진입 trigger를 한 경로로 통합한다. 실제 더블클릭 이벤트 조합을 기준으로 테스트한다.
3. Drag session controller를 도입해 capture 전/후 종료를 모두 보장한다.
4. `pointerup`, `pointercancel`, `lostpointercapture`, window blur, unmount에서 동일 cleanup을 호출한다.
5. Preview background click과 `Escape`의 선택 해제 의미를 명확히 하고 Component/line selection을 함께 초기화한다.

### 2차 편집 계약 복원

1. 편집 시작 원문을 보관하고 Escape에서 DOM과 문서 값을 원문으로 복원한다.
2. commit과 cancel 경로를 분리한다.
3. blur/finish 시 `select-text-lines` clear event를 전달한다.
4. caret 또는 DOM Selection이 실제 편집 node 안에 있을 때만 라인 Toolbar를 활성화한다.
5. plain string 개행 정규화는 유지하되 전체 `.trim()`은 제거하거나 명시적 정책으로 제한한다.

### 3차 Geometry·Hit Test 안정화

1. Auto-height Item 변경 시 Section minimum height 또는 다음 Component 배치를 재계산한다.
2. Section 밖으로 넘친 Item의 hit area와 overflow 정책을 명시한다.
3. Desktop/Mobile 각각에서 Component bounds 교차 검사를 추가한다.
4. `elementFromPoint` 기반으로 보이는 Component와 실제 click target이 같은지 E2E 검증한다.

## 7. 필수 회귀 시나리오

```text
Selection
- Component 선택 → Preview 빈 영역 클릭 → Component/line selection 모두 해제
- 같은 Component 재클릭 정책 확인
- 다른 Component 클릭 시 정확한 대상 선택

Direct Edit
- 실제 더블클릭 1회 → 편집 session 1개
- 입력 후 blur → content command 1개, Undo 1회로 원문 복원
- 입력 후 Escape → 원문 유지, Undo history 변화 없음
- 편집 종료 → 라인 Toolbar disabled

Drag
- threshold 미만 이동 후 target 내부 pointerup
- threshold 미만 이동 후 target 외부 pointerup
- threshold 초과 후 target 외부 pointerup
- pointercancel / lostpointercapture / window blur
- 종료 후 mouse move에 Component가 반응하지 않음

Geometry
- 긴 title, 좁은 width, 큰 font, lineStyles 적용
- Desktop/Mobile 전환
- 모든 auto-height Item이 Section bounds 또는 명시된 overflow 정책 충족
- visible target과 pointer hit target 일치
```

## 8. 판정

현재 Live Preview는 기본 선택·직접 편집·라인 서식 기능은 동작하지만, selection/edit/drag session의 종료 계약이 완전하지 않다. 특히 실제 더블클릭 중복 진입과 capture 전 drag cleanup 누락은 간헐적으로 보이는 현상을 설명하는 핵심 결함이다. Production 확대 전에 P0 안정화와 실제 pointer sequence 기반 E2E 추가가 필요하다.
