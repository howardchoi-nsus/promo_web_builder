# Live Preview Outline·Editor Control·Section 기준 Text Alignment 개발 계획서

## 0. 문서 정보

- 작성일: 2026-07-31
- 대상 프로젝트: `promo_web_builder`
- 대상 화면: Promo Web Builder Visual Editor / Live Preview
- 문서 상태: 개발 전 계획 / 소스코드 미반영
- 우선순위: P0~P5
- 포함 기능:
  - Live Preview Outline 모드
  - 텍스트 컴포넌트 Editor Control Toolbar
  - 섹션 콘텐츠 영역 기준 텍스트 배치
  - 텍스트 자동 높이와 최대 너비 정책
  - Desktop/Mobile 반응형 상태, Undo/Redo, 저장 계약
- 제외 기능:
  - 한 문장 안에서 일부 글자만 다른 서식을 적용하는 Mixed Rich Text
  - 선택 영역 Link, List, Inline Image 삽입
  - 자유 HTML 저장 및 임의 CSS 입력

## 1. 작성 배경

현재 Live Preview에서는 다음 문제가 확인됐다.

1. 배경, 다른 컴포넌트 또는 동일한 `z-index`에 가려진 컴포넌트를 찾기 어렵다.
2. 숨김 컴포넌트가 편집 화면에는 약하게 표시되지만 모든 컴포넌트의 실제 경계를 한 번에 확인할 수 없다.
3. 텍스트 선택 핸들러의 높이가 실제 텍스트보다 크게 표시되는 경우가 있다.
4. 텍스트 컴포넌트의 영역 크기와 글자 크기가 함께 변경돼 사용자가 예상하지 않은 결과가 발생한다.
5. 색상, 크기, 굵기 등의 텍스트 속성이 Property Panel에 분산돼 있어 반복 편집이 느리다.
6. 컴포넌트 박스 내부의 `text-align`을 직접 조정하는 방식은 박스 크기에 따라 결과가 달라지므로 편집 자유도는 높지만 사용성이 떨어질 수 있다.
7. 프로모션 페이지의 일반적인 요구는 텍스트 박스 내부 정렬보다 텍스트 컴포넌트 전체를 Section의 왼쪽·가운데·오른쪽 또는 위·중앙·아래에 안정적으로 배치하는 것이다.

따라서 Outline, Editor Control, Text Alignment를 개별 기능으로 추가하지 않고 동일한 Selection·Geometry·History 계약을 사용하는 하나의 편집 흐름으로 통합한다.

## 2. 실행 결론

세 기능 모두 도입을 권장한다.

핵심 방향은 다음과 같다.

1. Outline은 출력 디자인을 변경하지 않는 Editor 전용 표시 상태로 구현한다.
2. 텍스트 Toolbar는 Component 전체에 적용되는 Design Token 편집부터 지원한다.
3. 기본 정렬은 Component Box 내부가 아니라 Section Content Bounds 기준으로 동작한다.
4. 텍스트 Box는 `height: auto`와 의미별 최대 너비를 기본으로 사용한다.
5. Section 정렬 의도를 `xPct`, `yPx` 계산 결과만으로 저장하지 않고 Anchor 상태로 저장한다.
6. 자유 Drag가 필요할 때만 `positionMode: "free"`로 전환한다.
7. 모든 변경은 Editor Command를 통해 실행해 Undo/Redo와 저장 Snapshot을 유지한다.

권장 최종 편집 모델:

```text
Live Preview
  ├─ Normal
  ├─ Selection Guide
  └─ Outline All

Text Component
  ├─ Content
  ├─ Typography Token
  ├─ Section Anchor
  ├─ Auto Size / Max Width
  └─ Desktop / Mobile Override
```

## 3. 현재 구현 상태

## 3.1 Live Preview Guide

현재 `PromoPageRenderer`에는 다음 기반이 있다.

- `editable`
- `showGuides`
- 선택 컴포넌트 Resize Handle
- Content Width Guide
- 숨김 컴포넌트의 편집용 표시
- 잠금 상태
- 선택 컴포넌트 Key

제한 사항:

- `showGuides`는 Boolean이므로 Selection Guide와 전체 Outline을 구분하지 못한다.
- 선택되지 않은 모든 컴포넌트의 경계를 지속적으로 표시하는 모드가 없다.
- 겹침, 빈 텍스트, 투명 이미지, 작은 컴포넌트를 구조적으로 구분하기 어렵다.
- Page Tree 선택이 정확한 Component Box 위치까지 안내하지 못하는 경우가 있다.

## 3.2 Editor History와 Command

현재 Editor Core에는 다음 기반이 있다.

- Editor Command 실행
- Undo/Redo Stack
- Item Style Patch/Replace
- Content Value 변경
- Layout 교체
- Desktop/Mobile Responsive Layout

따라서 Toolbar의 한 번의 사용자 조작을 하나의 Command로 기록할 수 있다.

## 3.3 Text Style과 Design Token

현재 지원되는 주요 Item Style:

- `colorToken`
- `fontSizeToken`
- `fontWeightToken` 렌더링
- 숫자형 `fontWeight`
- `fontSize`
- `widthPct`
- `heightPx`
- `positionMode`
- `xPct`
- `yPx`

Design Token 저장 계층은 다음 CSS 속성을 허용한다.

- `color`
- `font-family`
- `font-size`
- `font-weight`
- `line-height`
- `letter-spacing`

제한 사항:

- Visual Editor의 Token 선택 UI는 색상과 폰트 크기 중심이다.
- 폰트 굵기 UI는 Token이 아니라 숫자 값 중심이다.
- Font Family, Line Height, Letter Spacing Token UI가 없다.
- Italic과 Underline 상태 계약이 없다.
- 현재 Inline Text 편집 결과는 `innerText` 문자열로 저장되므로 Mixed Rich Text를 유지할 수 없다.

## 3.4 Text Geometry

현재 텍스트 컴포넌트는 고정 `heightPx` 기본값을 사용하며 Resize 시 영역과 글자 크기가 함께 변경될 수 있다.

이로 인해:

- 실제 텍스트보다 Selection Box가 크게 보인다.
- 긴 텍스트의 줄바꿈과 저장된 높이가 불일치할 수 있다.
- Section 세로 중앙·하단 정렬 계산의 기준 높이가 부정확할 수 있다.
- Desktop Typography를 축소된 Preview 너비에서 표시할 때 불필요한 줄바꿈과 Overflow가 발생할 수 있다.

## 3.5 기존 다중 정렬

현재 Multi Layout의 `align-left`, `align-center`, `align-right` 등은 선택된 Component Group의 Bounding Box를 기준으로 한다.

이번 기능의 Section 기준 정렬과는 의미가 다르다.

```text
기존 Multi Align
  → 선택된 여러 Component 사이 정렬

신규 Section Anchor
  → 하나 또는 여러 Component를 Section Content Bounds에 배치
```

동일한 버튼 명칭을 사용하더라도 Command와 기준 좌표를 분리해야 한다.

## 4. 목표 UX

## 4.1 Preview 표시 모드

Preview 상단에 다음 세 상태를 제공한다.

| 모드 | 목적 | 표시 범위 |
|---|---|---|
| Normal | 출력과 유사한 확인 | 선택 상태 최소 표시 |
| Selection | 현재 선택 편집 | 선택 컴포넌트 Guide와 Handle |
| Outline | 숨은 구조 탐색 | 모든 Section·Component 경계와 상태 |

기본값은 `Selection`으로 한다.

Outline은 Editor 상태이며 Page Output, Template Snapshot, AI Prompt에 저장하지 않는다.

## 4.2 Outline 표현 정책

Outline 모드에서 표시할 정보:

- Section 경계
- Component 경계
- Component 이름 또는 짧은 Key
- Text, Image, CTA 등 Component Type
- 숨김 상태
- 잠금 상태
- 빈 콘텐츠 상태
- 선택 상태
- 필요 시 `z-index`

권장 표현:

- 일반 Component: 얇은 실선
- 숨김 Component: 점선과 `Hidden` Badge
- 잠금 Component: 별도 Lock 표시
- 빈 Component: 점선과 `Empty` Badge
- 선택 Component: 강조색 Outline과 Resize Handle
- Hover Component: 선택보다 약한 Highlight

Outline은 `outline`, pseudo-element 또는 별도 overlay layer로 표시한다.

다음은 금지한다.

- 실제 Component의 width, height, padding을 변경하는 Border 사용
- Page Output에 Outline Style 포함
- Outline Label이 Component 클릭을 가로채는 구조
- Outline 상태를 Design Snapshot에 저장

## 4.3 Text Editor Control Toolbar

텍스트 Component를 선택하면 Preview 상단 또는 Selection 근처에 Toolbar를 표시한다.

1차 Toolbar 구성:

### 공통

- Undo
- Redo
- Outline Toggle
- Desktop/Mobile Viewport

### Typography

- Semantic Text Style
- Font Family Token
- Font Size Token
- Font Weight Token
- Bold
- Italic
- Underline
- Text Color Token
- Line Height Token
- Letter Spacing Token

### Section Placement

- 가로: Left / Center / Right
- 세로: Top / Middle / Bottom
- 자유 배치 전환
- X/Y Offset 초기화

메뉴 구성 원칙:

- 자주 사용하는 Color, Weight, Section Align은 1차 Toolbar에 둔다.
- Line Height, Letter Spacing, 최대 너비는 확장 메뉴에 둔다.
- Property Panel은 정확한 값과 상태 확인용으로 유지한다.
- Toolbar와 Property Panel은 동일한 Editor Command를 호출한다.
- Toolbar Button은 실제 Icon Library를 사용하고 텍스트 기호나 Emoji로 대체하지 않는다.

## 4.4 Section 기준 Text Alignment

사용자에게 노출되는 기본 정렬은 다음과 같다.

### Horizontal

- Left: Section Content Bounds의 왼쪽
- Center: Section Content Bounds의 가로 중앙
- Right: Section Content Bounds의 오른쪽

### Vertical

- Top: Section Content Bounds의 위
- Middle: Section Content Bounds의 세로 중앙
- Bottom: Section Content Bounds의 아래

정렬 기준은 배경 이미지 전체가 아니라 Section Padding과 Safe Area를 제외한 Content Bounds로 한다.

여러 줄 텍스트의 내부 정렬은 기본적으로 Horizontal Anchor와 연동한다.

| Section Anchor | 파생 Text Align |
|---|---|
| Left | `left` |
| Center | `center` |
| Right | `right` |

별도 내부 `text-align` 변경은 초기 범위에서 노출하지 않는다. 추후 고급 옵션이 필요한 경우에만 Anchor와 독립시킨다.

## 4.5 Auto Size 정책

텍스트 Component 기본 정책:

```json
{
  "widthMode": "fit-content",
  "heightMode": "auto",
  "maxWidthToken": "--promo-text-max-width"
}
```

세부 규칙:

1. 짧은 텍스트는 내용 너비에 맞춘다.
2. 최대 너비를 초과하면 줄바꿈한다.
3. 높이는 줄 수와 Line Height에 따라 자동 계산한다.
4. Component Resize는 Box 크기만 변경하고 Font Size를 자동 변경하지 않는다.
5. Font Size는 Toolbar 또는 Token 선택으로만 변경한다.
6. 수동 높이는 Image와 명시적인 Fixed Box Component에만 기본 제공한다.

## 4.6 자유 배치

Section Anchor와 Free Position을 명확히 분리한다.

```text
정렬 버튼 선택
  → positionMode: anchored

Component Drag
  → positionMode: free

Anchor 복원 버튼
  → positionMode: anchored
```

Free Position에서는 기존 `xPct`, `yPx`를 사용한다.

Anchored Position에서는 다음 의도를 저장한다.

```json
{
  "positionMode": "anchored",
  "horizontalAnchor": "center",
  "verticalAnchor": "middle",
  "offsetX": 0,
  "offsetY": 0
}
```

단순히 Anchor 선택 시점의 `xPct`, `yPx`만 저장하지 않는다. Text, Font, Width 또는 Viewport가 변경돼도 Section 기준 위치가 유지돼야 하기 때문이다.

## 5. 데이터 계약

## 5.1 Item Style 확장안

```json
{
  "colorToken": "--promo-text-primary",
  "fontFamilyToken": "--promo-font-family-body",
  "fontSizeToken": "--promo-font-size-title",
  "fontWeightToken": "--promo-font-weight-bold",
  "lineHeightToken": "--promo-line-height-title",
  "letterSpacingToken": "--promo-letter-spacing-title",
  "fontStyle": "normal",
  "textDecoration": "none",
  "positionMode": "anchored",
  "horizontalAnchor": "center",
  "verticalAnchor": "middle",
  "offsetX": 0,
  "offsetY": 0,
  "widthMode": "fit-content",
  "heightMode": "auto",
  "maxWidthToken": "--promo-title-max-width"
}
```

허용값:

- `positionMode`: `anchored | free`
- `positionMode` 생략: 기존 Automatic 배치
- `horizontalAnchor`: `left | center | right`
- `verticalAnchor`: `top | middle | bottom`
- `widthMode`: `fit-content | fixed | fill`
- `heightMode`: `auto | fixed`
- `fontStyle`: `normal | italic`
- `textDecoration`: `none | underline`

## 5.2 Responsive Layout

Desktop는 기본 `itemStyles`에 저장한다.

Mobile Override는 기존 계약을 유지한다.

```json
{
  "responsiveLayouts": {
    "mobile": {
      "itemStyles": {
        "hero.title": {
          "horizontalAnchor": "center",
          "verticalAnchor": "top",
          "offsetY": 32,
          "maxWidthToken": "--promo-title-max-width-mobile"
        }
      }
    }
  }
}
```

규칙:

- Viewport를 전환한 상태에서 실행한 편집은 해당 Viewport에 저장한다.
- Mobile Override가 없으면 Desktop Anchor를 상속한다.
- Mobile에서 Drag하면 Mobile만 `free`로 전환한다.
- Desktop 상태를 무조건 Mobile에 복사하지 않는다.

## 5.3 Preview UI State

Outline 상태는 Document가 아닌 Editor UI State로 관리한다.

```json
{
  "previewGuideMode": "selection"
}
```

허용값:

- `normal`
- `selection`
- `outline`

필요한 경우 사용자의 로컬 편집 환경에만 기억할 수 있지만 Template Layout과 Page Output에는 포함하지 않는다.

## 5.4 호환성과 마이그레이션

현재 Layout 데이터는 JSONB이므로 DB Column 추가 없이 Item Style 필드를 확장할 수 있다.

그러나 다음 검증은 필요하다.

- Layout Normalizer가 신규 필드를 제거하지 않는지 확인
- API Validation Allowlist 확장
- 현재 Mobile Layout Validator의 `free` 전용 제한을 `anchored`까지 안전하게 확장
- Composition Snapshot 보존 확인
- Layout History의 Previous/New Composition 보존 확인
- Section Layout Preset Desktop/Mobile 복사 확인
- AI Composition Apply가 수동 Anchor를 덮어쓰지 않는지 확인

기존 데이터 처리:

```text
positionMode: free
  → 기존 위치 그대로 유지

positionMode 없음
  → 기존 automatic 배치 유지

신규 정렬 버튼 사용
  → anchored로 전환
```

기존 Template에 일괄 Anchor Backfill은 하지 않는다.

## 6. Renderer 설계 방향

## 6.1 Anchor Layer

텍스트의 실제 높이를 알기 전에 `yPx`를 계산해 저장하는 방식은 피한다.

권장 구조:

```text
Section Content Canvas
  └─ Anchor Frame
       └─ Rendered Component
```

Anchor Frame은 Section Content Canvas 전체를 기준으로 CSS Grid 또는 동등한 Layout 방식으로 정렬한다.

- `justify-self`: left / center / right
- `align-self`: top / middle / bottom
- `offsetX`, `offsetY`: 시각적 보정

Rendered Component는 실제 콘텐츠 높이를 유지한다.

장점:

- 텍스트 줄 수가 달라져도 중앙 정렬 유지
- Font Size 변경 후 재계산 불필요
- Mobile Max Width 변경에 안정적
- Section Height 변경에 자동 대응

Free Position Component는 기존 Absolute Geometry를 유지한다.

## 6.2 Selection Box

Selection Box는 저장된 기본 높이가 아니라 렌더링된 실제 Component Rect를 기준으로 표시한다.

규칙:

- Auto Height Text: 실제 DOM Rect
- Fixed Height Text: 설정된 Box Rect
- Image: Frame Rect
- Hidden Component: Editor Proxy Rect
- Transform/Scale 적용 시 Preview 좌표를 Design Canvas 좌표로 환산

## 6.3 Preview Scale

Desktop Canvas가 좁은 Preview Panel에 표시될 때 Typography만 Desktop 크기로 남고 Layout 너비만 축소되는 상태를 방지한다.

다음 중 하나를 일관되게 선택한다.

1. Design Canvas 전체를 동일 비율로 Scale
2. 실제 Desktop Width Canvas를 가로 Scroll

텍스트, Handle, Outline, Pointer 좌표가 서로 다른 비율을 사용하면 안 된다.

## 7. Editor Command 설계

신규 또는 확장 Document Command:

```text
ITEM_TYPOGRAPHY_PATCH
ITEM_ANCHOR_SET
ITEM_POSITION_MODE_SET
ITEM_AUTO_SIZE_SET
ITEM_OFFSET_RESET
```

`PREVIEW_GUIDE_MODE_SET`은 Document Command가 아닌 Editor UI Action으로 처리하고 Document History에 포함하지 않는다.

나머지는 Editor Command History에 포함한다.

원자성 규칙:

- Center 정렬 한 번은 Anchor, Text Align 파생 상태, Position Mode 변경을 하나의 Undo 단위로 기록
- Token 선택 한 번은 하나의 Undo 단위
- 연속 Slider 입력은 Pointer 종료 시 하나의 Undo 단위로 병합
- Toolbar와 Property Panel은 동일 Reducer 사용

## 8. 단계별 개발 계획

## P0. 기준선 고정과 계약 테스트

목표:

- 기능 추가 전 기존 문제와 저장 계약을 재현 가능한 테스트로 고정한다.

작업:

1. 긴 제목, 다중 줄 본문, 빈 텍스트, 숨김 Component Fixture 작성
2. Desktop/Mobile Snapshot Fixture 작성
3. Text Selection Rect와 저장 `heightPx` 불일치 재현
4. Preview Scale 상태별 Pointer 좌표 테스트
5. 기존 Layout History와 Undo/Redo 회귀 테스트

완료 기준:

- 현재 문제를 자동 또는 Browser Smoke Test로 재현
- 기존 데이터가 신규 Normalizer에서 손실되지 않는 Contract Test 확보

단계 종료 디버깅:

- Desktop/Mobile 동일 Fixture 비교
- Production Snapshot Sample 역직렬화
- Console Error와 Layout Validation Error 확인

## P1. Outline 모드

목표:

- 숨김, 겹침, 빈 Component를 Live Preview에서 즉시 찾는다.

작업:

1. `previewGuideMode` UI State 도입
2. Preview Controls에 Normal/Selection/Outline 추가
3. Section·Component Outline Overlay 구현
4. Hidden, Locked, Empty 상태 Badge 구현
5. Outline Label의 Pointer Event 분리
6. Outline Component 클릭 시 선택 및 정확한 위치 Scroll
7. Outline이 Output Mode에 포함되지 않는지 보장

완료 기준:

- 모든 Component 경계가 Layout Shift 없이 표시
- 숨김 Component 선택 가능
- Outline On/Off가 저장 Output에 영향 없음
- 모바일 Preview에서도 경계와 Label이 겹치지 않음

단계 종료 디버깅:

- 동일 `z-index` 겹침
- 투명 이미지
- 1px 또는 최소 크기 Component
- Section Overflow
- Hidden/Locked/Selected 조합
- Keyboard Focus와 Screen Reader Label

## P2. Text Editor Control Toolbar

목표:

- Property Panel을 왕복하지 않고 주요 텍스트 속성을 편집한다.

작업:

1. Toolbar 표시 조건과 Positioning 구현
2. Design Token Option Adapter 공통화
3. Font Family, Weight, Line Height, Letter Spacing Token 연결
4. Bold, Italic, Underline Component-level 상태 추가
5. Text Color Token Popover 구현
6. Toolbar와 Property Panel Command 통합
7. Undo/Redo Shortcut와 Toolbar 상태 연결
8. Locked Component의 Disabled 정책 적용

완료 기준:

- Toolbar와 Property Panel 값이 항상 일치
- 선택 변경 시 이전 Component 상태가 남지 않음
- Token이 삭제·비활성화됐을 때 안전한 기본값 표시
- 한 번의 Toolbar 조작이 한 번의 Undo로 복구

단계 종료 디버깅:

- 빠른 Component 선택 전환
- Token 없음/삭제/잘못된 참조
- Desktop/Mobile 전환
- Toolbar Viewport 경계 충돌
- Keyboard Navigation, Focus 복귀, Tooltip
- 최소 44px 수준의 Touch Target 검토

## P3. Text Auto Size와 Resize 분리

목표:

- 실제 텍스트보다 큰 Handler와 Resize 시 Font Size 변경 문제를 해결한다.

작업:

1. `widthMode`, `heightMode`, `maxWidthToken` 계약 추가
2. Text 기본 높이를 `auto`로 변경
3. Selection Rect를 실제 렌더링 Rect와 동기화
4. Text Box Resize와 Font Size 변경 분리
5. Long Text Wrap과 Max Width 적용
6. Preview Scale 좌표 변환 통합
7. Resize 중 임시 Style과 저장 Style 정리

완료 기준:

- 한 줄·여러 줄 Text Handler가 실제 텍스트 영역과 일치
- Box Resize로 Font Size가 변경되지 않음
- Font Size 변경 후 Handler가 즉시 갱신
- 긴 텍스트가 Section 밖으로 벗어나지 않음

단계 종료 디버깅:

- 한글/영문/숫자 혼합
- 강제 줄바꿈
- 매우 긴 단어와 URL
- Font Load 전후
- 200% Zoom
- Desktop 축소 Preview
- Mobile Max Width

## P4. Section 기준 Text Alignment

목표:

- Text Component를 Section Content Bounds 기준으로 배치한다.

작업:

1. Anchor Style 계약과 Validator 추가
2. Renderer Anchor Frame 도입
3. Horizontal/Vertical Anchor Controls 연결
4. Horizontal Anchor에 따른 내부 Text Align 파생
5. Anchor와 Offset 처리
6. Drag 시 Free Position 전환
7. Anchor 복원과 Offset 초기화
8. Desktop/Mobile Override 저장
9. Section Layout Preset과 Anchor 보존
10. AI Layout 적용 시 수동 Anchor 충돌 정책 추가

완료 기준:

- Text 길이 변경 후에도 Section Center 유지
- Section Height 변경 후 Vertical Anchor 유지
- Desktop/Mobile이 독립적으로 저장
- Drag/Undo/Redo 후 Position Mode가 정확히 복원
- Section Preset 저장·불러오기 후 Anchor 유지

단계 종료 디버깅:

- Section Padding 변경
- Background Safe Area
- Header처럼 낮은 Section
- Hero처럼 높은 Section
- 여러 Anchored Component의 겹침
- Auto Height와 Bottom Anchor
- Mobile에서 Center → Top Override

## P5. 통합 회귀 검증과 배포 준비

목표:

- Admin, Promo Builder, AI Document Editor, Output Renderer에서 동일 계약을 보장한다.

작업:

1. Layout Snapshot 직렬화/역직렬화 테스트
2. Layout History Previous/New Composition 테스트
3. Section Preset 저장/활성화/복제 테스트
4. AI Composition 후 수동 편집 보존 테스트
5. Output HTML에 Outline/Editor Control 미포함 확인
6. 성능 측정
7. Feature Flag 또는 점진적 활성화
8. 운영 로그와 오류 코드 정리

완료 기준:

- 자동 테스트 전체 통과
- Browser Smoke Test 통과
- Output Screenshot에 Editor Overlay 없음
- 기존 Template의 위치와 Typography 회귀 없음
- 주요 편집 동작에서 Console Error 없음

단계 종료 디버깅:

- 신규 Template
- 기존 Template
- Section Preset 기반 Section
- AI 생성 Section
- Hidden/Locked Component
- Undo/Redo 20회 이상
- 저장 후 재접속
- Desktop/Mobile 반복 전환

## 9. 테스트 계획

## 9.1 Unit Test

- Preview Guide Mode 상태 전환
- Anchor 허용값 검증
- Responsive Override 병합
- Token Fallback
- Auto Size Normalization
- Free ↔ Anchored 전환
- Offset Reset
- Command Undo/Redo

## 9.2 Contract Test

- `designSpec.itemStyles`
- `designSpec.responsiveLayouts.mobile.itemStyles`
- `composition_snapshot`
- `previous_composition`
- `new_composition`
- Section Layout Preset Snapshot
- AI Composition Apply Patch

## 9.3 Component Test

- Toolbar 표시/숨김
- Disabled/Locked
- Popover Focus
- Token Selection
- Anchor Button `aria-pressed`
- Outline Badge
- Selection 변경

## 9.4 Browser Smoke Test

시나리오:

1. Outline을 켜고 숨김 Text 선택
2. Color와 Weight Token 변경
3. Center/Middle 정렬
4. 긴 Text로 콘텐츠 변경
5. Mobile에서 Top/Center로 Override
6. 자유 Drag로 전환
7. Undo/Redo
8. 저장 후 새로 열기
9. Output Preview에서 Outline과 Toolbar가 없는지 확인

## 9.5 접근성 검증

- Toolbar `role="toolbar"`
- Button의 접근 가능한 이름
- Toggle의 `aria-pressed`
- Popover Keyboard 이동
- Roving Tab Index 또는 동등한 Focus 정책
- Focus Ring
- 색상만으로 상태를 전달하지 않는 Badge
- 200% Zoom과 Reflow
- Screen Reader에서 Hidden/Locked/Selected 상태 전달

## 10. 성능 고려사항

Outline 모드에서 Component마다 불필요한 Observer를 생성하지 않는다.

권장:

- Renderer 상태 기반 Class 전환
- Label은 필요한 경우만 표시
- Selection Rect 측정은 선택, Resize, Viewport 변경 시 수행
- `ResizeObserver`는 공통 관리하거나 선택 Component 중심으로 제한
- Pointer Move는 `requestAnimationFrame`으로 제한
- Outline Overlay가 Paint 비용을 과도하게 증가시키지 않는지 측정

성능 기준:

- 일반 Section 20개, Component 100개 수준에서 Outline Toggle 지연이 체감되지 않을 것
- Drag/Resize가 목표 프레임을 유지할 것
- Toolbar 조작이 전체 Page Re-render를 유발하지 않을 것

## 11. 위험과 대응

| 위험 | 영향 | 대응 |
|---|---|---|
| Anchor Wrapper가 기존 Absolute Layout을 변경 | 기존 Template 위치 회귀 | `free`는 기존 경로 유지, `anchored`만 신규 경로 사용 |
| Auto Height가 기존 Fixed Height 디자인 변경 | 선택 Box 및 출력 변화 | 기존 데이터는 Fixed 유지, 신규 또는 명시적 전환부터 Auto 적용 |
| Font Load 후 Text Rect 변경 | Center/Bottom 위치 흔들림 | CSS Anchor 우선, Font Ready 후 Selection Rect만 갱신 |
| Toolbar와 Property Panel 상태 불일치 | 저장값 혼란 | 동일 Command/Selector 사용 |
| Desktop 편집이 Mobile을 덮어씀 | 반응형 손상 | Viewport별 Patch Target 명시 |
| AI Layout이 수동 Anchor 덮어씀 | 사용자 편집 손실 | Source/Revision 정책과 충돌 확인 |
| Outline이 Output에 노출 | 운영 화면 오염 | Editor 전용 Prop/Class, Output Snapshot Test |
| Rich Text 범위가 확대됨 | 일정·데이터 계약 증가 | Component-level Typography로 범위 고정 |

## 12. 개발 순서와 의존성

```text
P0 기준선/계약
  ↓
P1 Outline
  ↓
P2 Editor Toolbar
  ↓
P3 Text Auto Size
  ↓
P4 Section Anchor
  ↓
P5 통합 회귀/배포
```

의존성:

- P1은 다른 기능과 독립적으로 우선 배포 가능
- P2는 현재 Item Style 계약으로 부분 구현 가능
- P4의 Vertical Middle/Bottom은 P3 Auto Height 완료 후 진행
- Full Rich Text는 본 계획 완료 후 별도 계획으로 분리

## 13. 단계별 배포 권고

1. Outline을 먼저 적용해 기존 Layout 문제의 관찰 가능성을 높인다.
2. Toolbar를 Component-level Token 편집으로 제한해 적용한다.
3. Auto Size와 Resize 분리를 적용하고 기존 Fixed Height는 보존한다.
4. Section Anchor를 신규 또는 사용자가 명시적으로 전환한 Text에 적용한다.
5. 기존 Template에 문제가 없는지 확인한 뒤 기본 생성 정책을 Anchored Text로 변경한다.

## 14. 완료 정의

다음 조건을 모두 충족하면 개발 완료로 판단한다.

1. Outline에서 숨김·잠금·빈·겹친 Component를 찾고 선택할 수 있다.
2. Outline은 Output에 영향을 주지 않는다.
3. Toolbar에서 주요 Typography Token을 변경할 수 있다.
4. Toolbar와 Property Panel의 상태와 History가 일치한다.
5. Text Handler가 실제 Text Rect와 일치한다.
6. Text Resize와 Font Size 변경이 분리된다.
7. Text를 Section 기준 Left/Center/Right, Top/Middle/Bottom에 배치할 수 있다.
8. Text 길이와 Section 크기가 바뀌어도 Anchor가 유지된다.
9. Desktop/Mobile Override가 독립적으로 저장된다.
10. Layout Snapshot, History, Preset, AI Apply 계약 테스트가 통과한다.
11. 각 개발 단계 종료 후 지정된 디버깅 시나리오가 통과한다.

## 15. 현재 진행 상황 및 확인된 이슈

### 진행 상황

- 요구사항 검토 완료
- 첨부 Rich Editor Toolbar 패턴 검토 완료
- 현재 Visual Editor Guide, Token, History, Geometry 구조 확인 완료
- Section 기준 정렬 방향 합의
- 개발 계획 작성 완료
- 소스코드 개발 미착수

### 확인된 이슈

1. `showGuides`가 Boolean이라 Outline 상태 확장이 필요하다.
2. Text Height 기본값과 Property Panel 기본값이 일치하지 않는 경로가 있다.
3. Text Resize가 Font Size를 함께 변경한다.
4. Inline Text 저장이 Plain String이므로 Mixed Rich Text는 별도 계약이 필요하다.
5. 기존 Multi Align은 Section 기준이 아니라 선택 Group 기준이다.
6. Renderer가 `anchored` Position Mode를 아직 지원하지 않는다.
7. 현재 Mobile Layout Validator는 명시적인 Position Mode로 `free`만 허용한다.
8. Preview Scale과 Design Canvas 좌표가 분리될 가능성이 있다.
9. Vertical Anchor는 Auto Height 또는 CSS Anchor Layer가 선행돼야 한다.
10. Font Weight Token은 Renderer 기반이 있으나 현재 Property UI는 숫자 중심이다.
11. 신규 Anchor 필드가 API Normalizer, History, Preset, AI Apply에서 보존되는지 검증이 필요하다.

## 16. 개발 착수 전 최종 확인사항

개발 전 다음 결정을 확정한다.

1. Preview 기본 모드: `selection`
2. Text 기본 Position: 신규 Component부터 `anchored`
3. Text 기본 Size: `fit-content + auto-height + max-width-token`
4. Horizontal Anchor와 내부 Text Align 자동 연동
5. Free Drag 시 `positionMode: free` 전환
6. 기존 Template 자동 Backfill 없음
7. Mixed Rich Text는 이번 범위에서 제외
8. 각 단계 완료 직후 테스트와 디버깅 수행
