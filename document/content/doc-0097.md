# B섹션 사용 가이드

## 목적

B섹션은 최종 프로모션 Web UI 이미지에 들어갈 실제 콘텐츠를 입력하는 영역이다.

Design MD가 색상, 폰트, 간격, 라운드, 레이아웃 분위기, 컴포넌트 스타일 같은 시각 기준을 담당한다면, B섹션은 사용자가 화면에서 보게 될 제목, 혜택 문구, CTA, 단계 안내, 약관, 법적 문구, 푸터 정보를 담당한다.

생성 흐름에서는 B섹션을 visible copy와 프로모션 의도의 1차 기준으로 사용한다. `Header`, `Hero Banner`, `Step Bar`, `Content CTA`, `Image Text Row`, `Title and Description`, `Footer` 같은 Template 4 섹션명은 내부 구조명이다. 최종 이미지에 그대로 표시되는 텍스트가 아니다.

## 작성 흐름

1. 프로모션 기본 정보를 입력한다.
   - 브랜드명 또는 프로모션명을 정한다.
   - 메인 타이틀을 작성한다.
   - 핵심 혜택을 짧게 정리한다.

2. Template 4 섹션별 내용을 입력한다.
   - 각 섹션의 필드에 실제 화면에 들어갈 내용을 작성한다.
   - 내부 설명이나 작업 메모가 아니라 사용자에게 보여도 되는 문구를 우선한다.
   - 프로모션 랜딩 페이지에 어울리는 문장으로 작성한다.

3. CTA와 링크 의도를 확인한다.
   - CTA는 짧고 행동 중심으로 작성한다.
   - 실제 URL이 없더라도 목적지는 명확히 설명한다.

4. 약관과 법적 문구를 입력한다.
   - 나이 제한, 지역 규정, 책임 이용, 참여 조건 등 필요한 내용을 포함한다.
   - 너무 길면 이미지에서 읽히기 어렵기 때문에 핵심 문구를 우선한다.

5. 이미지 생성 의도를 점검한다.
   - 최종 이미지는 실제 웹페이지처럼 보여야 한다.
   - 체크리스트, 와이어프레임, 섹션 다이어그램처럼 보이면 안 된다.
   - 이미지 모델에게 섹션명을 화면에 보여주라고 지시하지 않는다.

## Template 4 섹션 구성

### Header

상단 브랜드/내비게이션 영역이다. 프로모션 페이지의 첫 인상을 만들고, 브랜드 신뢰 요소를 보여준다.

하위 기능:
- `LOGO`: 로고 이미지 또는 브랜드명. 필수값으로 보는 것이 안전하다.
- `Badges`: 수상 이력, 파트너 배지, 신뢰 배지. 예: `world series poker official partner`, `world's biggest poker room`.
- Navigation labels: 필요한 경우 짧은 메뉴명. 예: `Rewards`, `How It Works`, `Terms`.

작성 기준:
- 로고와 배지는 실제 화면에 보이는 요소로 작성한다.
- `Header`라는 단어 자체를 화면 문구로 쓰지 않는다.
- 배지가 많으면 대표 배지만 우선 노출하고 나머지는 푸터나 상세 영역으로 보낸다.

### Hero Banner

프로모션의 메인 배너 영역이다. 사용자가 가장 먼저 보는 핵심 메시지와 CTA를 담당한다.

하위 기능:
- `Lead Text`: 타이틀 위에 들어가는 짧은 리드 문구. 선택.
- `Title`: 메인 제목. 필수.
- `Subline Text`: 제목을 보조하는 부제목 또는 혜택 설명. 선택.
- `Button`: 메인 CTA 버튼 문구. 선택이지만 가능하면 입력한다.
- `Alpha Text`: 추가 안내, 책임 이용, 조건 요약 등 작은 보조 문구. 선택.

작성 기준:
- `Title`은 제안의 핵심을 바로 알 수 있어야 한다.
- CTA는 `Qualify on GGPoker`, `Claim Bonus`, `Join Now`처럼 행동 중심으로 쓴다.
- `Alpha Text`에는 18+, T&Cs, 책임 이용 등 작지만 중요한 안내를 넣을 수 있다.
- `Hero Banner`라는 내부 섹션명은 화면에 노출하지 않는다.

### Step Bar

사용자가 어떤 순서로 참여하거나 혜택을 받는지 설명하는 단계 영역이다.

하위 기능:
- `A Title`: 첫 번째 단계 제목.
- `A Desc`: 첫 번째 단계 설명.
- `B Title`: 두 번째 단계 제목.
- `B Desc`: 두 번째 단계 설명.
- `C Title`: 세 번째 단계 제목.
- `C Desc`: 세 번째 단계 설명.
- `Button`: 단계 흐름 뒤에 반복되는 CTA 문구.

작성 기준:
- 기본은 3단계 구성이며, 각 단계는 짧고 명확해야 한다.
- 좋은 단계 문구 예: `QUALIFY OR BUY-IN ONLINE`, `TAKE YOUR SEAT`, `DON'T MISS OUT`.
- 단계명은 사용자 행동이나 혜택 흐름이어야 한다.
- `Step Bar`라는 단어를 화면에 표시하지 않는다.

### Content CTA

긴 설명형 콘텐츠와 CTA를 함께 제공하는 영역이다. CSV 초안에서는 `Contents`로 표시되어 있으나, 자동화 기준에서는 `Content CTA`로 매핑하는 것을 권장한다.

하위 기능:
- `Editing`: 굵게, 불릿 등 텍스트 편집 가능 여부 또는 리치 텍스트 입력 영역.
- `Body Text`: 본문 설명. CSV에서 Section Item이 비어 있는 긴 텍스트 행은 이 필드로 정리하는 것이 좋다.
- `Image`: 이미지 콘텐츠 설명 또는 이미지 에셋.
- `Button`: CTA 버튼 문구.

작성 기준:
- 이 영역은 혜택을 자세히 설명하고 CTA로 연결하는 역할을 한다.
- 긴 문장은 여러 문단이나 불릿으로 정리한다.
- 이미지 설명과 실제 화면 문구를 구분한다.
- `Contents`처럼 넓은 이름만 두면 파서가 의미를 놓칠 수 있으므로 `Body Text`, `Image`, `Button`처럼 명시한다.

### Image Text Row

이미지와 텍스트 카드가 반복되는 상세 혜택/기능 소개 영역이다.

하위 기능:
- `Card 1 IMG`: 첫 번째 카드 이미지.
- `Card 1 Title`: 첫 번째 카드 제목.
- `Card 1 Desc`: 첫 번째 카드 설명.
- `Card 2 IMG`: 두 번째 카드 이미지.
- `Card 2 Title`: 두 번째 카드 제목.
- `Card 2 Desc`: 두 번째 카드 설명.
- `Card 3 IMG`: 세 번째 카드 이미지.
- `Card 3 Title`: 세 번째 카드 제목.
- `Card 3 Desc`: 세 번째 카드 설명.

작성 기준:
- CSV처럼 `IMG`, `Title`, `Desc`가 반복될 경우 카드 번호를 붙이는 것이 안전하다.
- 각 카드는 하나의 혜택이나 기능을 담당해야 한다.
- 좋은 예: `Your Safety Comes First`, `All Your Favourite Games`, `30-Day Honeymoon Offer`.
- `Image Text Row`라는 내부 섹션명은 화면에 표시하지 않는다.

### Title and Description

약관, 주의사항, 상세 설명 등 텍스트 기반 콘텐츠를 등록하는 영역이다.

하위 기능:
- `Title`: 영역 제목. 예: `Terms and Conditions`.
- `Contents`: 약관, 주의사항, 참여 조건, 책임 이용 문구.
- Rich text options: 굵게, 불릿 등 텍스트 편집 가능 옵션.

작성 기준:
- CSV의 `Title and Descrition`은 오타이므로 `Title and Description`으로 정리한다.
- `선텍`은 `선택`으로 정리한다.
- 약관이 너무 길면 이미지에서는 요약을 우선하고, 전체 약관은 별도 링크나 상세 영역으로 처리한다.
- 법적 문구는 누락하지 않되, 시각적으로 읽을 수 있는 길이를 고려한다.

### Footer

하단 브랜드, 라이선스, 결제/신뢰 배지, 법적 고지를 제공하는 영역이다.

하위 기능:
- `Logo`: 푸터 로고 또는 브랜드명.
- `License Badges`: 라이선스, 결제수단, 18+, 인증, 책임 이용 배지.
- `Content`: 푸터 법적 고지, 회사 정보, 저작권, 책임 이용 문구.

작성 기준:
- `Logo`, `License Badges`, `Content`의 필수/선택 여부를 명시하는 것이 좋다.
- `content`처럼 소문자로 섞지 말고 `Content`로 통일한다.
- 푸터는 실제 웹사이트 하단처럼 보여야 한다.
- 책임 이용, 18+, 지역 규정 등 필요한 신뢰/법적 신호를 포함한다.

## CSV 정리 권장사항

현재 Template 4 CSV는 초안으로 사용할 수 있지만, 자동화 입력 스키마로 쓰려면 아래 정리가 필요하다.

- `Title and Descrition`을 `Title and Description`으로 수정한다.
- `필수 상항`을 `필수 사항`으로 수정한다.
- `선텍`을 `선택`으로 수정한다.
- ` Button`처럼 앞 공백이 있는 필드는 `Button`으로 정리한다.
- `button`, `Button`, `content`, `Content`처럼 대소문자가 섞인 필드는 하나로 통일한다.
- `Contents`는 자동화 기준에서 `Content CTA`로 매핑한다.
- Section Item이 비어 있는 행은 `Body Text`, `Image`, `Additional Terms`처럼 명확한 필드명으로 채운다.
- 반복되는 `IMG`, `Title`, `Desc`는 `Card 1`, `Card 2`, `Card 3` 번호를 붙인다.
- Footer의 속성 값은 필수/선택 여부를 채운다.

## 좋은 입력 예시

아래처럼 실제 화면에 들어갈 수 있는 문구를 입력한다.

```md
title: GGPoker Welcome Bonus
sublineText: Give new players a first deposit bonus and tournament tickets.
button: Claim Bonus
steps:
  - Sign Up
  - Make First Deposit
  - Claim Rewards
terms: This promotion is subject to GGPoker terms and applicable local regulations.
```

## 나쁜 입력 예시

아래처럼 내부 구조명이나 이미지 모델이 다이어그램으로 해석할 수 있는 지시를 넣지 않는다.

```md
title: Hero Banner
sectionOrder:
  - Header
  - Hero Banner
  - Step Bar
mustShow: All Template 4 sections with labels.
```

이런 입력은 최종 이미지가 실제 프로모션 웹페이지가 아니라 섹션명이 붙은 템플릿 다이어그램처럼 생성될 수 있다.

## QA 체크리스트

- 화면에 보이는 문구는 기본적으로 영어인가?
- 내부 섹션명이 visible UI text로 사용되지 않았는가?
- CTA는 짧고 행동 중심인가?
- 약관, 책임 이용, 푸터 정보가 필요한 만큼 포함되었는가?
- 반복 카드나 반복 단계에 번호가 있어 파서가 구분할 수 있는가?
- `Section Order`, `Header`, `Hero Banner` 같은 내부 구조명이 이미지 프롬프트에 visible copy처럼 전달되지 않는가?
- 최종 이미지 방향이 섹션 순서표가 아니라 자연스러운 웹페이지 흐름으로 설명되어 있는가?
