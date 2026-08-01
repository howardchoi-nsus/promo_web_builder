# Visual Editor Live Preview·라인 단위 텍스트 편집 설계서

## 0. 문서 정보

- 작성일: 2026-08-01
- 대상: Promo Web Builder Visual Editor / Live Preview / Layout Snapshot
- 상태: 현행 구현 기준 설계
- 기준 커밋: `f3deaa2`
- 관련 정책: `docs/정책/promo-web-builder-policies-2026-07-23.md`
- 관련 계획:
  - `docs/계획/live-preview-outline-editor-text-alignment-development-plan-2026-07-31.md`
  - `docs/계획/visual-editor-structure-ai-design-transition-development-plan-2026-07-31.md`

이 문서는 2026-07-31 계획 이후 실제 반영된 Live Preview, Selection Box, 직접 텍스트 편집, Toolbar, List/Indent, 라인 단위 서식의 현재 구조를 설명한다. 계획서에서 제외했던 Mixed Rich Text 중 “선택 라인 단위 서식”은 제한된 구조화 메타데이터 방식으로 구현됐으므로 본 문서를 현행 기준으로 사용한다. 문자 일부만 다른 서식을 갖는 arbitrary inline rich text는 여전히 범위 밖이다.

---

## 1. 설계 목표와 비목표

### 1.1 목표

1. Normal, Selection, Outline을 분리해 숨김·겹침·빈 Component를 찾을 수 있게 한다.
2. 텍스트 선택 시 Selection Box가 실제 `.rendered-text` 크기와 일치하게 한다.
3. Preview에서 더블클릭해 텍스트를 직접 입력·수정한다.
4. Font Awesome 기반 Toolbar에서 Design Token과 제한된 텍스트 속성을 편집한다.
5. 선택한 라인에만 Bold, Color, List 등 서식을 적용·해제한다.
6. Plain text 콘텐츠와 서식 메타데이터를 분리해 HTML injection과 계약 확산을 막는다.
7. Client/API Validator, Undo/Redo, Layout Snapshot이 같은 데이터 계약을 보존한다.

### 1.2 비목표

- 문자 범위별 `<span>` 서식
- 자유 HTML 또는 `contenteditable`의 HTML 직렬화
- 임의 CSS 입력
- 중첩 DOM list 편집기와 복잡한 WYSIWYG document model
- 사용자 임의 Font/Color 값 저장
- AI가 라인별 서식을 자유롭게 생성하는 기능

---

## 2. 사용자 동작 모델

```text
Component 선택
  ├─ Preview guide/handle 표시
  ├─ 텍스트 Component이면 Toolbar 표시
  └─ 기존 위치와 크기 유지

텍스트 더블클릭
  ├─ 직접 편집 모드 진입
  ├─ caret/selection으로 라인 범위 계산
  ├─ Toolbar 조작 → 선택 라인 lineStyles patch
  └─ blur 확정 / Escape 취소

Component Drag
  ├─ pointer 이동 임계값 이전: 클릭/더블클릭/텍스트 선택
  └─ 임계값 초과: pointer capture → geometry patch
```

텍스트를 선택하는 행위는 Component를 좌측 상단으로 이동시키거나 `xPct`, `yPx`, anchor를 다시 계산하지 않는다. 위치 변경은 Drag 또는 Section 배치 컨트롤에서만 발생한다.

---

## 3. Preview 표시 상태

### 3.1 상태 소유권

`App.vue`가 `previewGuideMode`를 Editor UI state로 소유한다.

```js
const previewGuideMode = ref("selection");
```

허용값:

| 값 | 동작 |
|---|---|
| `normal` | 출력과 가까운 표시, 편집 guide 최소화 |
| `selection` | 선택 Component guide와 handle 표시 |
| `outline` | 모든 Section·Component 경계와 상태 표시 |

`PreviewPanel.vue`는 이 값을 다음 Renderer prop으로 변환한다.

```text
showGuides = guideMode !== "normal"
outlineMode = guideMode === "outline"
```

이 상태는 Layout Snapshot과 Page Output에 저장하지 않는다.

### 3.2 Outline 표현

`PromoPageRenderer.vue`는 Editor Preview에서만 `is-outline-mode` class와 item label을 출력한다. CSS `outline`과 pointer event를 받지 않는 label을 사용하므로 실제 Box Model은 변하지 않는다.

표시 상태:

- Section boundary
- Component key/type
- selected
- hidden
- locked
- empty

Motion transform은 Outline에서 구조 탐색과 위치 측정을 방해하지 않도록 정지한다.

---

## 4. Selection Box와 Text Geometry

### 4.1 원칙

텍스트 Component는 저장된 임의 `heightPx`가 아니라 렌더링된 콘텐츠 높이를 우선 사용한다. `.rendered-item`의 선택 영역과 내부 `.rendered-text`가 다른 문제를 피하기 위해 Text Item은 content-size를 기준으로 Box를 구성한다.

### 4.2 유형별 기준

| 유형 | Selection 기준 |
|---|---|
| Auto-height Text | 실제 `.rendered-text` DOM rect |
| Fixed-height Text | 명시된 Component box rect |
| Image | image frame rect |
| Hidden Item | Editor proxy rect |
| Section | section rect |

Font load, 줄바꿈, font size, line height, lineStyles 변경 후 DOM rect가 달라질 수 있으므로 guide는 저장된 초기 높이를 정답으로 사용하지 않는다.

### 4.3 Box resize와 Typography

Box resize와 Font Size는 별도 명령이다. Resize handle은 width/height geometry만 변경하며 Font Size는 Toolbar의 token/raw value patch에서만 바꾼다.

---

## 5. 직접 텍스트 편집

### 5.1 진입

Renderer의 article과 text node에 `dblclick` handler가 있다. article capture handler는 하위 field가 이벤트를 소비하거나 drag 처리와 경쟁하는 경우의 fallback이다.

편집 진입 조건:

- Editor `editable` 상태
- Text Item 또는 text field
- locked가 아님
- 유효한 content target 존재

### 5.2 Drag 충돌 해결

기존에는 `pointerdown` 즉시 pointer capture를 수행해 브라우저가 후속 double-click target을 다르게 판단할 수 있었다. 현재 흐름은 다음과 같다.

1. `pointerdown`에서 시작 좌표와 대상만 기록한다.
2. 이동 거리가 drag threshold를 넘을 때 drag를 활성화한다.
3. 활성화 시점에만 `setPointerCapture()`와 `preventDefault()`를 실행한다.
4. threshold 미만이면 click/dblclick/text selection을 그대로 허용한다.
5. `is-editing` 상태에서는 Component drag를 시작하지 않는다.

### 5.3 편집과 저장

- 편집 DOM은 임시 `contenteditable` 역할만 한다.
- 저장 값은 `innerText`를 CRLF/LF 기준으로 정규화한 plain string이다.
- 개행은 보존한다.
- HTML markup은 저장하지 않는다.
- blur는 확정한다.
- `Escape`는 편집 전 값으로 복원하고 종료한다.
- 편집 시작/종료가 Item geometry를 초기화하지 않는다.

---

## 6. 라인 선택 모델

### 6.1 선택 계산

편집 중 `selectionchange`를 관찰해 Selection의 시작/끝이 포함하는 `[data-text-line-index]`를 계산한다. 결과는 Renderer에서 Preview Panel로 전달된다.

```js
emit("select-text-lines", section, item, {
  scopeKey,
  indexes
});
```

선택 모델:

```ts
type TextLineSelection = {
  scopeKey: "$item" | string; // string은 fieldKey
  indexes: number[];           // 0-based, 중복 제거
}
```

단일 caret은 caret이 속한 라인 하나를 선택한 것으로 취급한다. 여러 라인 drag selection은 포함된 모든 라인을 반환한다. Item이 바뀌면 이전 line selection을 즉시 초기화한다.

### 6.2 Toolbar 활성 조건

다음이 모두 참일 때만 라인 서식 컨트롤을 활성화한다.

- Text Item 선택됨
- Item unlocked
- `scopeKey` 존재
- `indexes.length > 0`

Undo/Redo와 Component 배치 컨트롤은 라인 선택과 무관하다.

---

## 7. 저장 계약

### 7.1 콘텐츠

콘텐츠는 기존과 동일한 newline-delimited string이다.

```json
{
  "value": "첫 번째 라인\n두 번째 라인\n세 번째 라인"
}
```

### 7.2 라인 서식

라인 서식은 Item Style 아래에 저장한다.

```json
{
  "itemStyles": {
    "hero.body": {
      "lineStyles": {
        "$item": {
          "0": {
            "fontWeight": 700,
            "listType": "bullet",
            "listIndent": 1
          },
          "1": {
            "colorToken": "--promo-color-accent",
            "fontStyle": "italic"
          }
        }
      }
    }
  }
}
```

다중 필드 Component:

```json
{
  "lineStyles": {
    "fld_title": {
      "0": { "fontWeightToken": "--promo-font-weight-bold" }
    },
    "fld_description": {
      "1": { "listType": "number", "listIndent": 2 }
    }
  }
}
```

### 7.3 허용 property

현재 lineStyles allowlist:

```text
color, colorToken
fontFamily, fontFamilyToken
fontSize, fontSizeToken
fontWeight, fontWeightToken
fontStyle, textDecoration, textStyleToken
textGradientToken
textBackground, textBackgroundToken
lineHeight, lineHeightToken
letterSpacing, letterSpacingToken
listType, listIndent
```

주요 범위:

- `listType`: `bullet | number | null`
- `listIndent`: integer `0..6`
- line index: integer `0..999`
- token: Client/API는 현재 `--promo-*` 또는 `--app-*` pattern을 검증하고, Toolbar option은 로드된 token 목록을 사용
- unknown property: 거부

빈 line style, 빈 scope, 빈 `lineStyles`는 patch 과정에서 제거해 불필요한 Snapshot 차이를 만들지 않는다.

### 7.4 호환성

- `lineStyles`가 없는 기존 문서는 Component-level style로 그대로 렌더링한다.
- 라인 property가 없으면 Component-level property를 상속한다.
- 별도 DB column이나 migration은 필요하지 않다. Layout과 history가 JSONB Snapshot을 보존한다.
- Client `layout-utils.mjs`와 API `_wizard-form-template-layout-store.js`가 동일 범위를 검증한다.
- `_promo-section-design-contract.js`의 AI item style allowlist에는 top-level list 속성만 유지하고 `lineStyles`는 허용하지 않는다.

---

## 8. Toolbar 설계

### 8.1 구성

`TextEditorControls.vue`가 제공하는 주요 컨트롤:

| 그룹 | 컨트롤 | 범위 |
|---|---|---|
| History | Undo, Redo | Document |
| Typography | Text Style, Font, Size, Bold, Italic | 선택 라인 |
| Fill | Font Color/Gradient, Background | 선택 라인 |
| Paragraph | Bullet, Number, Outdent, Indent | 선택 라인 |
| Advanced | Line Height, Letter Spacing 등 | 선택 라인 |
| Placement | Section horizontal/vertical, size | Component |

메뉴 제목은 중복 노출하지 않고 icon/dropdown 중심으로 구성한다. 아이콘 버튼은 Font Awesome을 사용하며 `title`, `aria-label`, toggle에는 `aria-pressed`를 제공한다.

### 8.2 Token resolution

Text Style token은 여러 typography property의 patch로 해석된다. 사용자가 개별 Font, Size, Weight를 변경하면 충돌하는 `textStyleToken` 참조를 해제하고 명시적인 개별 token을 저장한다.

Color 처리:

- 단색 token 선택: `colorToken` 설정, `textGradientToken` 제거
- Gradient token 선택: `textGradientToken` 설정, raw color와 `colorToken` 제거
- Background: 시스템 palette 또는 허용 token만 사용

### 8.3 Toggle semantics

- Bold on: 가장 가까운 활성 bold token, 없으면 `fontWeight: 700`
- Bold off: 가장 가까운 normal token, 없으면 `fontWeight: 400`
- Italic: `normal ↔ italic`
- Bullet/Number: 동일 type이 전체 선택 라인에 적용돼 있으면 제거, 아니면 해당 type 적용
- List 제거: `listType: null`, `listIndent: 0`
- Indent/Outdent: 전체 선택 라인이 list인 경우에만 `±1`, `0..6` clamp

여러 선택 라인의 값이 다르면 비교 함수는 mixed state로 판단한다. 새 값을 선택하면 선택된 모든 라인에 동일 patch를 원자적으로 적용한다.

---

## 9. 렌더링

### 9.1 렌더 경로

Renderer는 세 경로를 갖는다.

1. `lineStyles`가 있는 텍스트: `.rendered-text--lines` 아래 line renderer
2. 전체 Component에 동일 list가 있는 legacy text: `ul` 또는 `ol`
3. 일반 텍스트: `p`

라인 renderer:

```html
<div class="rendered-text rendered-text--lines">
  <div class="rendered-text-line" data-text-line-index="0">
    <span class="rendered-text-line__content">...</span>
  </div>
</div>
```

각 라인은 Component-level style과 line patch를 병합해 CSS variable/allowlisted inline style로 변환한다.

### 9.2 혼합 목록

일반 라인, bullet 라인, number 라인을 하나의 텍스트 안에서 혼합할 수 있다. Line renderer는 marker와 CSS counter를 사용해 라인별 list 상태를 표현한다. `listIndent`는 단계별 padding 계산에 반영한다.

현 제약:

- 혼합 list는 시각적으로는 list지만 DOM이 중첩 `ul/ol/li` 문서 모델은 아니다.
- 접근성용 semantic list grouping은 후속 개선 대상이다.
- lineStyles가 없는 전체 list는 기존 semantic `ul/ol` 경로를 유지한다.

---

## 10. Command·History·Revision

Toolbar patch는 기존 Editor `patch-style` 경로를 사용하며 한 번의 사용자 조작을 한 번의 Undo 단위로 기록한다. 직접 콘텐츠 편집은 content update command로 기록한다.

```text
line selection
  → TextEditorControls.emitLinePatch()
  → lineStyles immutable merge/cleanup
  → PreviewPanel patch-style
  → Editor command/reducer
  → new document revision
```

저장 시 서버 revision과 현재 Builder Document revision이 다르면 `DOCUMENT_REVISION_MISMATCH`를 반환하고 자동 덮어쓰지 않는다. 클라이언트는 최신 문서를 다시 읽어 사용자의 미저장 patch를 재적용하거나 충돌 UI를 제공해야 한다.

Outline mode 변경은 Document history와 revision을 증가시키지 않는다.

---

## 11. 검증과 보안

Client와 API의 공통 검증 원칙:

1. `lineStyles`는 object만 허용한다.
2. scope도 object만 허용한다.
3. line key는 `0..999` 범위의 정수 문자열만 허용한다.
4. line style은 allowlisted property만 허용한다.
5. token key는 `--promo-*` 또는 `--app-*` pattern을 검증한다.
6. `listType`은 `bullet | number | null`만 허용한다.
7. `listIndent`는 `0..6` 정수만 허용한다.
8. 콘텐츠는 plain string으로 저장하고 사용자 HTML을 보존하지 않는다.
9. AI Section Design patch에는 `lineStyles`를 허용하지 않는다.

현재 검증 격차:

- `fontSize`, `fontWeight`, `lineHeight`, `letterSpacing` raw value의 type·범위를 lineStyles 내부에서 별도로 검사하지 않는다.
- `fontStyle`, `textDecoration`의 lineStyles enum을 별도로 제한하지 않는다.
- token key가 pattern에 맞는지는 확인하지만 실제 등록·활성 token인지 API에서 조회하지 않는다.
- Content Layer에서 `--app-*` token을 금지해야 한다는 통합 정책보다 Validator 허용 pattern이 넓다.

Toolbar는 관리된 option만 emit하고 AI는 lineStyles를 생성할 수 없어 정상 UI 경로의 노출은 제한돼 있다. 다만 API 직접 입력까지 정책과 일치시키려면 Validator hardening이 후속으로 필요하다.

---

## 12. 현재 검증 기준

2026-08-01 구현에서 통과한 관련 검증:

```text
node scripts/test-text-editor-controls-contract.mjs
node scripts/test-visual-editor-contract.js
node scripts/test-editor-ui-contract.js
node scripts/test-editor-layout-engine.mjs
node scripts/test-section-ai-design-contract.js
node scripts/test-section-ai-apply-handler.js
pnpm --dir visual-editor build
```

브라우저 확인 항목:

- Preview 직접 더블클릭 편집
- 3개 라인 입력과 재렌더
- 선택한 두 번째 라인만 Bold on/off
- 선택한 두 번째 라인만 Color 적용/복원
- 선택한 두 번째 라인만 Bullet/Number 적용/해제
- Indent `1 → 2 → 1`에 따른 padding 변화
- 다른 라인의 스타일 불변
- 새로고침 후 기준 fixture 복원
- Console error 없음

---

## 13. 알려진 제약과 후속 설계

### 13.1 인덱스 기반 lineStyles

현재 서식 주소는 line index다. 라인 중간에 개행을 삽입하거나 삭제하면 뒤 라인의 의미와 저장된 index가 어긋날 수 있다.

후속 선택지:

1. 콘텐츠 변경 시 line diff로 lineStyles index를 remap
2. 각 라인에 안정적인 `lineId`를 부여하는 document model 도입
3. 단순 정책으로 변경 지점 이후 style을 명시적으로 정리

현재는 1번이 최소 변경 권장안이다.

### 13.2 문자 범위 서식

문자 일부만 Bold/Color를 다르게 하는 기능은 지원하지 않는다. 도입하려면 plain string + lineStyles 확장이 아니라 별도 versioned text document schema, sanitization, clipboard, IME, selection mapping 설계가 필요하다.

### 13.3 Semantic mixed list

혼합 list의 접근성을 높이려면 연속된 동일 listType/indent 라인을 group으로 만들고 semantic `ul/ol/li`로 출력하는 renderer가 필요하다. 편집 중 selection mapping과 출력 renderer를 분리하는 것이 안전하다.

### 13.4 통합 저장 검증

로컬 Preview의 편집·렌더·새로고침 검증은 완료했지만 실제 API를 통한 save/reopen, revision conflict rebase, Desktop/Mobile override의 end-to-end 자동화는 추가해야 한다.

### 13.5 Runtime 버전

프로젝트는 Node 22.x를 요구하지만 현재 Codex 번들 검증 환경은 Node 24.14였다. 빌드와 테스트는 통과했으며 Production과 CI는 Node 22.x 기준으로 재확인한다.

### 13.6 lineStyles Validator 강화

정책과 현재 구현 사이에 다음 차이가 있다.

- Content Layer lineStyles에서는 `--promo-*`만 허용하도록 namespace를 좁힐 필요가 있다.
- token registry 존재·활성 상태를 저장 시 확인할지 결정해야 한다.
- raw typography value의 type/range와 `fontStyle`, `textDecoration` enum을 Client/API 공통 계약으로 추가해야 한다.

이는 문서 검토 중 확인한 보완 항목이며, 이번 문서 작업에서는 소스코드를 변경하지 않았다.

---

## 14. 완료 상태

| 항목 | 상태 |
|---|---|
| Normal/Selection/Outline | 완료 |
| 숨김·잠금·빈 Component Outline | 완료 |
| Text Selection Box 실측 보정 | 완료 |
| Preview 직접 텍스트 편집 | 완료 |
| Drag/dblclick 충돌 해결 | 완료 |
| Font Awesome Toolbar | 완료 |
| Design Token Font/Size/Color/Gradient | 완료 |
| Bullet/Number | 완료 |
| List Indent/Outdent 0..6 | 완료 |
| 선택 라인 단위 Bold/Color/List | 완료 |
| Client/API lineStyles shape/allowlist/list 검증 | 완료 |
| raw value·enum·token registry 검증 강화 | 후속 필요 |
| AI lineStyles 생성 차단 | 완료 |
| 문자 범위 Rich Text | 범위 제외 |
| line insert/delete style remap | 후속 필요 |
| Mixed list semantic grouping | 후속 필요 |
| API save/reopen E2E 자동화 | 후속 필요 |
