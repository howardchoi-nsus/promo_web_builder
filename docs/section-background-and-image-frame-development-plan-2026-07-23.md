# 섹션 배경 및 Image Frame 개발계획서

- 작성일: 2026-07-23
- 대상 저장소: `promo_web_builder`
- 상태: 개발 착수 전 계획
- 우선순위: P0 계약 확정 → P1 구현 → P1 운영 검증
- 주요 화면: Create Promo, Visual Editor, Web Output
- 주요 목적: 프로모션 레이아웃 폭, 섹션 배경 이미지, AI Image 컴포넌트의 렌더링·편집 계약을 하나로 통일한다.

---

## 1. 문서 목적

현재 프로모션 렌더러는 다음 구조를 사용한다.

- 프로모션 전체 렌더러는 `width: 100%`
- 섹션 내부 콘텐츠 폭은 `designSpec.responsive.contentMaxWidth`로 결정
- 섹션 AI 이미지는 섹션의 CSS `background-image`로 적용 가능
- Image Item은 `<figure><img>`로 출력
- Item 위치 이동과 Section 높이 조절은 가능
- Image Item 자체의 너비·높이·비율·모서리 편집은 불가능

이번 작업은 아래 요구사항을 일관된 렌더링 계약으로 정리하고 구현하는 것을 목표로 한다.

1. 프로모션 템플릿과 섹션은 사용 가능한 가로 영역의 100%를 사용한다.
2. 섹션 내부 콘텐츠는 최대 1280px 영역에 배치한다.
3. 섹션 배경 이미지는 기본적으로 중앙 정렬하고 전체 이미지가 보이도록 `contain`을 사용한다.
4. 섹션 배경 이미지의 페이드는 섹션 배경색을 기준으로 CSS에서 처리한다.
5. AI Image 컴포넌트는 `<img>`가 아니라 조절 가능한 Tag의 `background-image`로 렌더링한다.
6. Image 컴포넌트는 크기, 비율, `contain/cover`, 모서리 형태를 수정할 수 있어야 한다.
7. Preview와 Web Output은 동일한 Design Spec과 동일한 렌더러를 사용해야 한다.

이 문서는 구현자와 검토자가 동일한 용어, 데이터 계약, 우선순위, 테스트 기준을 사용하도록 만드는 기술 기준서다.

---

## 2. 확정 요구사항

### 2.1 레이아웃

- 템플릿 폭: 현재 출력 컨테이너 기준 `100%`
- 섹션 폭: 템플릿 기준 `100%`
- 섹션 내부 콘텐츠 최대 폭: `1280px`
- 섹션 내부 콘텐츠 수평 정렬: 중앙
- 섹션 배경 이미지 기본 위치: `center center`
- 섹션 배경 이미지 기본 크기: `contain`
- 섹션 배경 이미지 반복: `no-repeat`
- `<aside class="shell-sidebar">`는 Builder 편집 UI이며 프로모션 출력에 포함하지 않는다.

### 2.2 섹션 배경 이미지

- 섹션 전체를 대상으로 적용한다.
- 이미지 생성 요청에는 실제 섹션의 예상 가로·세로 비율을 전달한다.
- 페이드 색상은 해당 섹션에 적용된 유효 배경색을 기준으로 한다.
- 페이드 방향은 다음 네 가지를 지원한다.
  - `none`
  - `left`
  - `right`
  - `both`
- 사용자는 페이드 없음 또는 페이드 적용을 선택할 수 있다.
- 페이드 적용을 선택하면 왼쪽, 오른쪽, 양끝 중 하나를 선택한다.
- 페이드는 생성 이미지에 영구적으로 합성하지 않고 CSS gradient 레이어로 적용한다.

### 2.3 AI Image 컴포넌트

- `<img>`를 사용하지 않는다.
- `<figure>` 기반 이미지 렌더링 경로를 제거한다.
- `div` 등 편집 가능한 Image Frame의 `background-image`로 출력한다.
- 다음 속성을 편집할 수 있어야 한다.
  - 너비
  - 높이 또는 종횡비
  - `background-size: contain | cover`
  - `background-position`
  - 모서리 반경
  - 사각형, 둥근 사각형, 원형 형태
  - 레이아웃 내 위치
  - 레이어 순서
- 모서리 또는 가장자리 핸들을 드래그해 크기를 조절할 수 있어야 한다.
- 잠긴 Item은 이동, 리사이즈, 스타일 변경을 할 수 없어야 한다.

### 2.4 접근성

AI Image 컴포넌트는 `<img>`와 `alt`를 사용하지 않는다.

- 의미가 있는 이미지:
  - `role="img"`
  - `aria-label`
- 장식용 이미지:
  - `aria-hidden="true"`
  - `role`과 `aria-label`을 사용하지 않음
- 편집용 리사이즈 핸들은 키보드로 접근 가능해야 한다.
- Web Output에는 편집 핸들과 편집 안내를 출력하지 않는다.

---

## 3. 용어 정의

| 용어 | 정의 |
|---|---|
| App Shell | Builder와 관리자 화면의 공통 애플리케이션 외곽 구조 |
| Shell Sidebar | `<aside class="shell-sidebar">`로 표시되는 전역 탐색 영역 |
| Shell Main | Sidebar를 제외한 Builder 작업영역 |
| Promo Renderer | 프로모션 Template, Section, Component를 실제 화면으로 출력하는 렌더러 |
| Template Canvas | 프로모션 전체 출력 영역. 편집 화면에서는 Shell Main 안에 있고 Web Output에서는 페이지 출력 영역 전체를 사용 |
| Section | Template Canvas 가로 100%를 사용하는 프로모션 구획 |
| Content Container | Section 내부의 최대 1280px 콘텐츠 배치 영역 |
| Section Background Image | Section 자체에 적용되는 전체 배경 이미지 |
| Image Component | Section 안에 배치되는 이미지 유형 컴포넌트 |
| Image Frame | Image Component를 렌더링하는 크기 조절 가능한 배경 이미지 Tag |
| Fade Overlay | Section Background Image 위에 배경색 기반 gradient로 적용되는 페이드 레이어 |
| Effective Background Color | Section 배경색과 Template 배경색을 우선순위에 따라 해석한 최종 페이드 기준색 |
| Design Spec | Preview와 Web Output이 공유하는 레이아웃·스타일·이미지 참조 스냅샷 |

---

## 4. 현재 구현 분석

### 4.1 현재 레이아웃

`visual-editor/src/promo-renderer.css`

- `.promo-renderer`는 `width: 100%`
- `.rendered-section`은 별도 고정 폭 없이 부모 폭을 사용
- `.rendered-section__inner`는 `width: min(var(--promo-width), 100%)`
- `--promo-width`는 `designSpec.responsive.contentMaxWidth`에서 생성

현재 구조는 전체적인 방향은 맞지만 1280px 기준이 템플릿 데이터에 따라 달라질 수 있다.

### 4.2 현재 섹션 배경

`visual-editor/src/PromoPageRenderer.vue`

- 섹션 배경 이미지와 gradient를 복수 background layer로 결합
- 기본 `background-size`는 `contain`
- 기본 `background-position`은 `right center`
- `left-copy`, `right-copy`, `center-copy` 기반 페이드만 지원
- 페이드 색상은 `backgroundFadeColor` 또는 Template Theme 배경색 사용

문제:

- 새 기준인 `center center`와 다름
- 양끝 페이드가 없음
- Section 고유 배경색을 우선 해석하는 계약이 없음
- 페이드 방향 이름이 콘텐츠 safe area와 이미지 fade 방향을 혼합하고 있음

### 4.3 현재 Image Item

`visual-editor/src/PromoPageRenderer.vue`

현재 Image Item DOM:

```html
<figure class="rendered-image">
  <img />
</figure>
```

현재 CSS:

- 이미지 고유 크기 사용
- `object-fit: contain`
- Item Frame 너비·높이 계약 없음
- Item 리사이즈 기능 없음
- 원형·둥근 모서리 등 Frame 형태 없음

### 4.4 현재 편집 기능

현재 지원:

- Item 자유 이동
- X 좌표: `%`
- Y 좌표: `px`
- Section 높이 조절
- 배경 이미지 좌·중·우 정렬

현재 미지원:

- Image Frame 리사이즈
- 너비·높이 또는 종횡비 저장
- Image Frame `contain/cover`
- Image Frame 모서리 형태
- 키보드 리사이즈
- 장식 이미지와 의미 있는 이미지 구분

---

## 5. 핵심 설계 결정

### 5.1 Shell과 프로모션 출력 경계

Shell Sidebar는 프로모션 Template의 일부가 아니다.

편집 화면:

```text
App Shell
├─ Shell Sidebar
└─ Shell Main
   └─ Promo Renderer width: 100%
```

Web Output:

```text
Web Page
└─ Promo Renderer width: 100%
```

`width: 100%`의 기준은 다음과 같다.

- Create Promo / Visual Editor: Shell Main의 사용 가능한 너비
- Web Output: 출력 페이지의 사용 가능한 너비
- `100vw`는 사용하지 않는다.

`100vw`는 스크롤바 너비와 Sidebar를 무시해 수평 overflow를 만들 수 있으므로 금지한다.

### 5.2 Content Container

기본 CSS 계약:

```css
.promo-renderer {
  width: 100%;
}

.rendered-section {
  width: 100%;
}

.rendered-section__inner {
  width: min(1280px, 100%);
  margin-inline: auto;
  padding-inline: var(--promo-section-gutter);
}
```

정확한 overflow 방지를 위해 구현 시 다음 방식 중 하나를 사용한다.

```css
width: min(1280px, calc(100% - (var(--promo-section-gutter) * 2)));
padding-inline: 0;
```

또는:

```css
width: 100%;
max-width: 1280px;
padding-inline: var(--promo-section-gutter);
```

두 방식을 혼합하지 않는다. Box Model 테스트 후 한 방식으로 고정한다.

### 5.3 섹션 배경의 `contain`과 가로 100%

`contain`은 이미지 전체 표시를 우선한다. 섹션과 이미지 비율이 다르면 빈 영역이 생길 수 있다.

이를 강제 확대나 왜곡으로 해결하지 않는다.

해결 원칙:

1. AI 생성 요청에 섹션의 기준 가로·세로 비율을 전달한다.
2. 생성 이미지는 해당 비율에 최대한 맞춘다.
3. CSS는 `contain`을 유지한다.
4. 이미지 비율이 다르면 Section 배경색이 빈 영역을 채운다.
5. 향후 사용자 요구가 있을 때에만 Section Background에 `cover` 옵션을 추가한다.

이번 범위에서 Section Background 기본값과 관리자 기본값은 `contain`이다.

### 5.4 페이드 처리 위치

페이드는 AI 이미지 자체에 굽지 않는다.

이유:

- 배경색 변경 시 즉시 다시 계산 가능
- 같은 이미지를 여러 Theme에서 재사용 가능
- 모바일과 데스크톱에서 페이드 범위를 다르게 적용 가능
- 이미지 생성 실패와 렌더링 스타일 실패를 분리 가능
- 재생성 비용이 발생하지 않음

AI Prompt에는 다음 정보만 전달한다.

- 이미지의 핵심 피사체 위치
- 콘텐츠 safe area
- 섹션 비율
- 배경색 계열
- 이미지 가장자리가 지정 배경색과 자연스럽게 연결되어야 한다는 지침

최종 페이드 강도와 방향은 Design Spec과 CSS가 담당한다.

### 5.5 Image Component 렌더링

권장 DOM:

```html
<article
  class="rendered-item rendered-item--image"
  data-item-key="heroVisual"
>
  <div
    class="rendered-image-frame"
    role="img"
    aria-label="프로모션 이미지 설명"
  ></div>
</article>
```

장식 이미지:

```html
<div
  class="rendered-image-frame"
  aria-hidden="true"
></div>
```

금지:

- `<img>`
- `<picture>`
- `<figure>` 안의 `<img>`
- 이미지 URL을 텍스트로 출력
- AI 이미지 실패 시 설명 문자열을 이미지 자리에 출력

### 5.6 원형 이미지

원형 Shape는 다음을 동시에 적용한다.

- `aspect-ratio: 1 / 1`
- `border-radius: 50%`

가로·세로 비율이 1:1이 아닌 상태에서 `circle`을 선택하면 다음 중 하나를 수행한다.

1. 기본안: 짧은 변을 기준으로 정사각형으로 자동 보정
2. 사용자가 비율 고정을 해제하면 `rounded`로 자동 변경

구현 전 한 정책을 선택하고 브라우저 테스트에 고정한다. 권장안은 1번이다.

---

## 6. 데이터 계약

### 6.1 Design Spec Version

현재 Design Spec의 기존 계약을 확장하므로 `contractVersion` 증가를 검토한다.

권장:

- 기존: `contractVersion: 1`
- 신규: `contractVersion: 2`

Version 2는 다음을 의미한다.

- Section Background Fade Mode 정규화
- Image Item을 Background Frame으로 렌더링
- Image Frame 크기·비율·형태 속성 지원

### 6.2 Section Style

권장 구조:

```json
{
  "sectionStyles": {
    "heroBanner": {
      "minHeight": 560,
      "backgroundColor": "#101827",
      "backgroundImage": "/api/promo-section-design-image?runId=...",
      "backgroundSize": "contain",
      "backgroundPosition": "center center",
      "backgroundRepeat": "no-repeat",
      "backgroundFadeMode": "both",
      "backgroundFadeColor": "#101827",
      "backgroundFadeStrength": "medium"
    }
  }
}
```

허용값:

```text
backgroundSize:
- contain

backgroundPosition:
- left center
- center center
- right center

backgroundRepeat:
- no-repeat

backgroundFadeMode:
- none
- left
- right
- both

backgroundFadeStrength:
- soft
- medium
- strong
```

기본값:

```json
{
  "backgroundSize": "contain",
  "backgroundPosition": "center center",
  "backgroundRepeat": "no-repeat",
  "backgroundFadeMode": "none",
  "backgroundFadeStrength": "medium"
}
```

### 6.3 Effective Background Color

페이드 기준색 우선순위:

1. `sectionStyles[sectionKey].backgroundColor`
2. Section에 바인딩된 Design Token의 background 역할 값
3. `designSpec.theme.backgroundColor`
4. 서버·렌더러 공통 fallback

클라이언트와 서버가 서로 다른 색상을 계산하지 않도록 공통 함수 또는 공통 계약 테스트를 사용한다.

### 6.4 Image Item Style

기존 `itemStyles["sectionKey.itemKey"]`를 확장한다.

```json
{
  "itemStyles": {
    "heroBanner.heroVisual": {
      "positionMode": "free",
      "xPct": 58,
      "yPx": 72,
      "zIndex": 2,
      "widthPct": 36,
      "heightPx": 360,
      "aspectRatio": "1/1",
      "aspectRatioLocked": true,
      "imageFit": "cover",
      "imagePosition": "center center",
      "shape": "circle",
      "borderRadiusToken": "radius.full",
      "decorative": false,
      "accessibleLabel": "환영 보너스 프로모션 이미지"
    }
  }
}
```

허용값:

```text
imageFit:
- contain
- cover

imagePosition:
- left top
- center top
- right top
- left center
- center center
- right center
- left bottom
- center bottom
- right bottom

shape:
- square
- rounded
- circle
```

### 6.5 크기 저장 방식

반응형 동작을 위해 다음 기준을 사용한다.

- X 위치: `xPct`
- 너비: `widthPct`
- Y 위치: `yPx`
- 높이: `heightPx` 또는 `aspectRatio`로 계산
- 비율 고정 상태: `aspectRatioLocked`

너비를 `px`로만 저장하지 않는다. 데스크톱에서 만든 이미지가 모바일 너비를 초과할 수 있기 때문이다.

렌더링 시:

```text
effectiveWidth = min(widthPct, available section width)
effectiveHeight = aspectRatioLocked
  ? effectiveWidth / aspectRatio
  : heightPx
```

모바일에서는 Section bounds 안으로 위치와 크기를 clamp한다.

---

## 7. 페이드 렌더링 계약

### 7.1 방향 의미

`left`:

- 이미지의 왼쪽 가장자리가 Section 배경색과 연결
- 왼쪽 콘텐츠 safe area 확보에 적합

`right`:

- 이미지의 오른쪽 가장자리가 Section 배경색과 연결
- 오른쪽 콘텐츠 safe area 확보에 적합

`both`:

- 이미지 양끝이 Section 배경색과 연결
- 중앙 피사체에 적합

`none`:

- gradient layer 없음

### 7.2 CSS 개념

예시이며 실제 stop 비율은 강도 토큰으로 관리한다.

```css
/* left */
linear-gradient(
  to right,
  var(--section-bg) 0%,
  var(--section-bg) 12%,
  transparent 48%
)

/* right */
linear-gradient(
  to left,
  var(--section-bg) 0%,
  var(--section-bg) 12%,
  transparent 48%
)

/* both */
linear-gradient(
  to right,
  var(--section-bg) 0%,
  transparent 24%,
  transparent 76%,
  var(--section-bg) 100%
)
```

### 7.3 강도

강도는 임의 퍼센트 입력보다 토큰형 선택을 우선한다.

```text
soft
medium
strong
```

각 강도는 디자인 토큰 또는 렌더러 상수로 gradient stop을 매핑한다.

### 7.4 기존 safeArea 호환

기존 값:

- `left-copy`
- `right-copy`
- `center-copy`

신규 값으로의 기본 변환:

| 기존 값 | 신규 fadeMode |
|---|---|
| `left-copy` | `left` |
| `right-copy` | `right` |
| `center-copy` | `both` |
| 없음 | `none` |

단, 기존 `backgroundPosition`이 명시돼 있으면 유지한다. 신규 생성과 기본값은 `center center`를 사용한다.

---

## 8. Image Frame 편집 UX

### 8.1 선택

- Image Component를 클릭하면 Content/Style 패널에 Image Frame 설정을 표시한다.
- 선택된 Frame에는 편집 화면에서만 outline과 resize handle을 표시한다.
- Web Output에는 선택 outline과 handle을 출력하지 않는다.

### 8.2 크기 조절

기본 리사이즈 핸들:

- 네 모서리
- 네 변

최소 구현은 네 모서리부터 시작할 수 있다.

동작:

- 모서리 드래그: 너비·높이 동시 변경
- Shift 또는 비율 잠금 활성: 종횡비 유지
- Section 경계 밖으로 이동 또는 확장 불가
- 최소 크기 이하로 축소 불가
- 잠긴 Item은 핸들 미표시

### 8.3 키보드

리사이즈 핸들 또는 속성 패널에서 다음을 지원한다.

- 방향키: 1단위 조절
- Shift + 방향키: 큰 단위 조절
- Escape: 현재 드래그 취소
- 속성 패널 숫자 입력 또는 Range Control 제공
- 변경된 크기를 텍스트로 표시

### 8.4 속성 패널

Image Component 선택 시:

1. 이미지 맞춤
   - 전체 표시 (`contain`)
   - 영역 채우기 (`cover`)
2. 이미지 초점
   - 3×3 위치 선택
3. 형태
   - 사각형
   - 둥근 사각형
   - 원형
4. 크기
   - 너비
   - 높이
   - 비율 고정
5. 접근성
   - 장식 이미지 여부
   - 이미지 설명
6. 초기화
   - 자동 크기로 복원
   - 자동 위치로 복원

### 8.5 삭제

Image Frame 삭제와 이미지 자산 삭제를 구분한다.

- 이미지 제거:
  - Component Instance는 유지
  - URL과 생성 자산 참조만 제거
- Component 제거:
  - Section 조립에서 Component Instance 제거
- 생성 자산 물리 삭제:
  - 참조 여부 검증 후 별도 API에서 수행

---

## 9. AI 이미지 생성 계약

### 9.1 Section Background 요청

요청 예시:

```json
{
  "target": {
    "type": "section-background",
    "sectionKey": "heroBanner"
  },
  "canvas": {
    "width": 1920,
    "height": 720,
    "aspectRatio": "8/3"
  },
  "background": {
    "color": "#101827",
    "position": "center center",
    "size": "contain",
    "fadeMode": "both"
  },
  "contentSafeArea": "center"
}
```

AI가 반환하거나 결정하지 않아야 하는 값:

- 자유 CSS
- HTML
- JavaScript
- 임의 selector
- 허용 목록 밖의 fade mode
- 임의 외부 URL

### 9.2 Image Component 요청

```json
{
  "target": {
    "type": "item",
    "sectionKey": "heroBanner",
    "itemKey": "heroVisual"
  },
  "frame": {
    "width": 720,
    "height": 720,
    "aspectRatio": "1/1",
    "fit": "cover",
    "shape": "circle"
  },
  "backgroundColor": "#101827",
  "content": {
    "title": "Welcome Bonus",
    "description": "..."
  }
}
```

Image Component 생성 결과는 Item Content의 이미지 URL로 저장한다.

Section Background 속성으로 자동 fallback하지 않는다.

잘못된 Item target:

- 서버에서 요청 거부
- 사용자에게 대상 Item이 유효하지 않다는 오류 표시
- Section Background로 자동 전환 금지

### 9.3 Fade와 AI Prompt

`fadeMode`는 이미지 구도 참고 정보로만 AI에 전달한다.

- `left`: 주요 피사체를 중앙 또는 오른쪽에 배치
- `right`: 주요 피사체를 중앙 또는 왼쪽에 배치
- `both`: 주요 피사체를 중앙에 배치
- `none`: 콘텐츠 충돌 방지를 위한 safe area만 적용

실제 시각적 페이드는 CSS가 담당한다.

---

## 10. 서버 검증

서버는 Apply 전에 다음을 재검증한다.

### 10.1 Section Background

- Section이 현재 Template Version에 존재
- AI 디자인 활성 상태
- Section Background 생성 허용
- 이미지 URL이 허용된 Blob 또는 내부 Proxy
- `backgroundSize`가 허용 목록에 포함
- `backgroundPosition`이 허용 목록에 포함
- `backgroundFadeMode`가 허용 목록에 포함
- 배경색이 허용된 색상 또는 Token
- Template revision과 Layout revision 일치

### 10.2 Image Component

- Component Instance가 현재 Section에 존재
- `fieldKind === "image"`
- AI source 허용
- 잠긴 Item이 아님
- 요청 `itemKey`와 결과 target 일치
- 너비·높이·위치가 Section bounds 이내
- shape, fit, position이 허용 목록에 포함
- 접근성 속성 형식 검증

### 10.3 스타일 Allowlist

Image Frame에 허용:

- `widthPct`
- `heightPx`
- `aspectRatio`
- `aspectRatioLocked`
- `imageFit`
- `imagePosition`
- `shape`
- `borderRadiusToken`
- `xPct`
- `yPx`
- `zIndex`
- `decorative`
- `accessibleLabel`

금지:

- raw CSS
- `style` 문자열
- 임의 CSS property
- `url()` 문자열 직접 입력
- JavaScript URL
- 외부 import

---

## 11. 관리자 및 사용자 설정

### 11.1 관리자 기본 설정

관리자는 Image Component Version에 다음 기본값을 설정할 수 있다.

- 기본 종횡비
- 기본 fit
- 기본 shape
- 기본 radius token
- 기본 장식 이미지 여부
- 사용자 리사이즈 허용 여부
- 사용자 형태 변경 허용 여부
- 사용자 fit 변경 허용 여부
- AI 생성 허용 여부

### 11.2 사용자 변경

Create Promo / Visual Editor 사용자는 관리자 허용 범위 안에서만 변경할 수 있다.

- 잠긴 속성은 UI 비활성
- 잠긴 속성은 서버 Apply에서도 다시 검증
- 관리자 설정 변경 후 기존 열린 화면의 revision이 오래됐으면 Apply 차단

---

## 12. 구현 Phase

### Phase 0 — 계약 및 기준선

목표:

- 용어와 렌더링 경계 고정
- Design Spec Version 결정
- 신규 schema와 allowlist 정의
- 기존 값 변환 규칙 확정

작업:

1. Template, Section, Content Container 폭 계약 테스트 추가
2. Section Background Fade schema 정의
3. Image Frame Style schema 정의
4. 접근성 속성 계약 정의
5. 기존 `left-copy/right-copy/center-copy` 변환 테스트 추가
6. 기존 이미지 콘텐츠 fixture 확보

완료 기준:

- 구현 전 계약 테스트가 신규 요구사항을 표현
- 기존 데이터 변환 규칙이 문서와 테스트에 일치

### Phase 1 — 레이아웃 폭

작업:

1. Promo Renderer와 Section을 100%로 고정
2. Content Container 기본 최대 폭을 1280px로 설정
3. Shell Sidebar와 Web Output 출력 경계 테스트
4. 수평 overflow 테스트

완료 기준:

- Sidebar가 있는 화면에서 Promo Renderer가 Shell Main을 초과하지 않음
- Web Output에 Sidebar CSS 또는 DOM이 포함되지 않음
- 1280px 이상에서 콘텐츠가 중앙 정렬됨

### Phase 2 — Section Background와 Fade

작업:

1. 기본 위치를 `center center`로 변경
2. 유효 Section 배경색 해석 함수 추가
3. `backgroundFadeMode` 추가
4. `none/left/right/both` gradient 구현
5. 기존 safeArea 호환 변환
6. Section 속성 패널에 페이드 설정 추가

완료 기준:

- 배경색 변경 시 재생성 없이 페이드 색상이 변경됨
- 네 가지 모드가 Preview와 Web Output에서 동일함

### Phase 3 — Image Frame 렌더러

작업:

1. `<figure><img>` 제거
2. `.rendered-image-frame` 추가
3. Content 이미지 URL을 `background-image`로 연결
4. `contain/cover`, position, shape, radius 적용
5. 의미 있는 이미지와 장식 이미지 접근성 분기
6. 기존 Image Item 콘텐츠 호환

완료 기준:

- Promo Renderer의 Image Component에 `<img>`가 존재하지 않음
- 이미지 URL이 텍스트로 출력되지 않음
- 기존 저장 이미지가 Image Frame에 정상 출력됨

### Phase 4 — 이동·리사이즈·스타일 UI

작업:

1. Image Frame resize handle 구현
2. Section bounds clamp
3. 비율 고정
4. 속성 패널 추가
5. 키보드 조절
6. 잠금 정책 적용
7. 초기화 기능 추가

완료 기준:

- 모서리 드래그로 크기 조절 가능
- 원형 선택 시 실제 원형 유지
- 모바일 Preview에서 Frame이 Section 밖으로 넘치지 않음

### Phase 5 — AI 생성 계약 연결

작업:

1. Section Background 생성 payload 확장
2. Image Component Frame 정보 payload 확장
3. AI Prompt에 섹션 비율·배경색·safe area 전달
4. Item target server validation
5. 잘못된 Item target의 Background fallback 제거
6. 생성·적용·삭제 경로 분리

완료 기준:

- Section Background 생성은 Section에만 적용
- Image Component 생성은 지정 Item Frame에만 적용
- 잘못된 Item target은 명확한 오류로 종료

### Phase 6 — Preview/Web Output 동등성 및 배포 검증

작업:

1. 동일 Design Spec fixture로 Preview/Web Output 비교
2. 데스크톱·태블릿·모바일 viewport 테스트
3. 브라우저 E2E
4. 기존 프로모션 호환 smoke test
5. Vercel Production 로그 확인

완료 기준:

- Preview와 Web Output의 폭, 위치, 크기, fade, shape가 동일
- 콘솔 오류와 4xx/5xx 이미지 요청 없음

---

## 13. 예상 변경 파일

### Renderer

- `visual-editor/src/PromoPageRenderer.vue`
- `visual-editor/src/promo-renderer.css`
- `visual-editor/src/contracts.js`

### Visual Editor

- `visual-editor/src/App.vue`
- `visual-editor/src/styles.css`

### Create Promo

- `prototype/create-promo.js`
- `prototype/create-promo.css`

### API 및 계약

- `api/_promo-section-design-contract.js`
- `api/_promo-section-design-provider.js`
- `api/promo-section-design-runs.js`
- `api/promo-section-design-process.js`
- `api/promo-section-design-apply.js`
- Item Component 또는 Template Public Resolver 관련 Store

### 테스트

- 기존 Section AI 계약 테스트
- 기존 Visual Editor 브라우저 테스트
- 신규 Image Frame 렌더링 계약 테스트
- 신규 Section Background Fade 테스트
- 신규 Resize 브라우저 테스트
- 신규 Preview/Web Output 동등성 테스트

### 빌드 산출물

- 원본 변경과 테스트가 완료된 뒤 공식 Visual Editor build 명령으로 생성
- `prototype/visual-editor-assets/`를 직접 수동 수정하지 않음

---

## 14. 테스트 계획

### 14.1 정적 계약

- Promo Renderer `width: 100%`
- Section `width: 100%`
- Content Container 최대 1280px
- Web Output에 Shell Sidebar 없음
- Section Background 기본 `center center`
- Section Background 기본 `contain`
- Fade enum 검증
- Image Frame style allowlist 검증
- Image Component 렌더링 경로에 `<img>` 없음

### 14.2 렌더러 단위 테스트

- `none`은 gradient 없음
- `left`는 왼쪽 배경색 연결
- `right`는 오른쪽 배경색 연결
- `both`는 양끝 배경색 연결
- Section 배경색 우선
- Theme 배경색 fallback
- `contain/cover` 적용
- 원형 1:1 보정
- 장식 이미지 접근성 속성
- 의미 있는 이미지 접근성 속성

### 14.3 브라우저

필수 viewport:

- 1440
- 1280
- 1024
- 1023
- 981
- 980
- 768
- 681
- 680
- 390

확인:

- 수평 overflow
- Sidebar 최대·최소·Drawer 상태
- Section 100% 폭
- Content Container 중앙 정렬
- Image Frame 드래그
- Image Frame 리사이즈
- 키보드 조절
- 잠금 상태
- 모바일 bounds clamp

### 14.4 API

- 유효한 Section Background target
- 유효한 Image Item target
- 존재하지 않는 Item target
- Text 또는 CTA Item을 이미지 target으로 요청
- 잠긴 Item
- AI source 미허용 Item
- 오래된 Template/Layout revision
- 허용되지 않은 style 값
- 외부 이미지 URL

### 14.5 회귀

- Section Background 이미지 생성·적용·삭제
- Image Component 이미지 생성·적용·삭제
- Section Background 삭제가 Image Component에 영향 없음
- Image Component 삭제가 Section Background에 영향 없음
- 관리자 정책 변경 후 Create Promo 캐시 무효화
- 기존 이미지 Content URL 호환
- 기존 명시적 background alignment 호환

---

## 15. 마이그레이션 및 호환성

### 15.1 기존 Image Item

기존 Content 값의 이미지 URL은 유지한다.

변경:

- 렌더링 Tag만 `<img>`에서 Image Frame background로 전환
- 기존 값에 Frame Style이 없으면 기본값 사용
- 기본 종횡비는 Item Component의 `image.aspectRatio`를 우선 사용
- Component에 종횡비가 없으면 이미지 자산 메타데이터를 사용
- 두 값이 모두 없을 때에만 공통 fallback 비율 사용

예시 기본값:

```json
{
  "widthPct": 32,
  "aspectRatio": "component-or-asset-ratio",
  "aspectRatioLocked": true,
  "imageFit": "contain",
  "imagePosition": "center center",
  "shape": "square",
  "decorative": false
}
```

기본 접근성 설명은 관리자 Component 이름 또는 사용자 입력 설명을 사용한다. 빈 문자열을 허용하지 않는 정책 여부는 관리자 설정에서 결정한다.

### 15.2 기존 Section Background

- 기존 명시적 `backgroundPosition`은 유지
- 신규 생성 기본값은 `center center`
- 기존 safeArea는 fadeMode로 변환
- 기존 이미지 URL은 유지
- 기존 `backgroundFadeColor`는 유지하되 Section 배경색이 변경되면 유효 색상을 재계산

### 15.3 Rollback

코드 rollback 시 기존 이미지 URL이 손실되지 않아야 한다.

- Content 이미지 URL은 삭제하지 않음
- Section Background URL은 삭제하지 않음
- 신규 Style 속성은 구버전 렌더러가 무시할 수 있어야 함
- DB 컬럼을 추가하는 경우 Expand/Contract 방식 사용
- 물리 Blob 삭제는 본 작업에 포함하지 않음

---

## 16. 주요 위험과 대응

| 우선순위 | 위험 | 대응 |
|---|---|---|
| P0 | `contain`과 섹션 비율 차이로 빈 영역 발생 | 생성 요청에 실제 섹션 비율 전달, 배경색으로 빈 영역 연결 |
| P0 | Image Component가 다시 Section Background로 fallback | target type과 itemKey 서버 검증, fallback 금지 |
| P0 | `<img>` 제거 후 접근성 정보 손실 | `role="img"`/`aria-label` 또는 `aria-hidden` 계약 강제 |
| P0 | Preview와 Web Output의 Frame 크기 차이 | 동일 Renderer와 Design Spec 사용 |
| P0 | 리사이즈 결과가 Section 밖으로 이동 | 서버·클라이언트 bounds clamp |
| P1 | 원형이 타원으로 출력 | 1:1 비율 자동 보정 |
| P1 | 모바일에서 고정 px 크기 초과 | widthPct와 aspect ratio 사용 |
| P1 | 기존 background alignment 회귀 | 기존 명시값 보존, 신규 기본만 중앙 |
| P1 | 페이드 색상과 Section 배경색 불일치 | Effective Background Color 공통 함수 |
| P1 | AI가 이미지 자체에 강한 페이드를 생성 | Prompt는 구도만 지시, CSS가 최종 페이드 담당 |
| P1 | 편집 핸들이 Web Output에 노출 | `editable` 조건과 출력 계약 테스트 |

---

## 17. Definition of Done

다음 조건을 모두 만족해야 완료다.

1. Template Canvas와 Section이 부모 출력 영역의 100%를 사용한다.
2. Shell Sidebar는 Web Output에 포함되지 않는다.
3. Section 내부 콘텐츠는 최대 1280px로 중앙 정렬된다.
4. 신규 Section Background는 `center center`, `contain`, `no-repeat`을 기본값으로 사용한다.
5. 페이드 기준색은 Section 유효 배경색을 사용한다.
6. `none`, `left`, `right`, `both` 페이드가 동작한다.
7. 페이드는 이미지 픽셀이 아니라 CSS gradient로 적용된다.
8. Image Component 렌더링에 `<img>`와 `<figure>`를 사용하지 않는다.
9. Image Component는 Image Frame의 `background-image`로 출력된다.
10. Image Frame에서 `contain/cover`를 선택할 수 있다.
11. Image Frame의 크기와 위치를 조절할 수 있다.
12. 둥근 모서리와 원형을 선택할 수 있다.
13. 원형은 항상 1:1로 출력된다.
14. 의미 있는 이미지와 장식 이미지의 접근성 속성이 구분된다.
15. 잠긴 Item은 이동·리사이즈·스타일 변경이 불가능하다.
16. AI Item 생성 결과가 지정한 Image Component에만 적용된다.
17. 잘못된 Item target이 Section Background로 fallback하지 않는다.
18. Section Background와 Image Component 삭제 경로가 독립적이다.
19. Preview와 Web Output이 동일한 결과를 출력한다.
20. 전체 테스트, 브라우저 회귀 테스트, Production smoke test가 통과한다.

---

## 18. 권장 착수 순서

실제 개발은 다음 순서로 진행한다.

1. Phase 0 계약 테스트와 Version 결정
2. 레이아웃 100%·1280px 기준 적용
3. Section Background Fade Mode 구현
4. Image Frame 렌더링 전환
5. Image Frame 속성 패널과 리사이즈 구현
6. AI payload와 서버 검증 연결
7. 기존 데이터 호환 검증
8. Preview/Web Output 동등성 검증
9. Production 배포 및 로그 확인

P1 이미지 대상 분리 회귀 검증은 이번 계획의 Phase 3~6이 반영된 이후 다시 수행한다. 기존 `<figure><img>` 구조를 유지한 상태에서 P1 검증을 먼저 완료 처리하지 않는다.
