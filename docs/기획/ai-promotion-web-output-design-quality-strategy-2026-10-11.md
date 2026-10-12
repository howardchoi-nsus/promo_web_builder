# AI 프로모션 웹 결과물 디자인 품질 전략

## 문서 정보

- 작성일: 2026-10-11
- 대상: 제품 기획자, 디자이너, 프런트엔드 개발자, AI·백엔드 개발자
- 대상 흐름: 프로모션 Brief 입력부터 레이아웃 후보 생성, 품질 평가, 편집, 게시까지
- 상태: 제품 방향과 구현 우선순위 검토안
- 관련 현행 문서:
  - `docs/설계/ai-promotion-builder-composition-engine-technical-design-2026-07-29.md`
  - `docs/계획/ai-live-preview-design-quality-gate-development-plan-2026-08-20.md`

## 핵심 결론

프로모션 웹 생성기의 핵심 목표는 기능 수가 아니라 **처음 생성된 결과를 사용자가 거의 수정하지 않고 게시할 수 있는 수준으로 만드는 것**이다. 이를 위해 AI가 HTML, CSS, 좌표를 한 번에 자유 생성하는 방식이나 기존 템플릿을 그대로 채우는 방식 모두 피한다.

목표 방식은 다음과 같다.

> 브랜드 표현과 기초 품질 규칙은 디자인 토큰으로 고정하고, 레이아웃 구성은 검증된 문법 안에서 여러 후보를 생성한 뒤 실제 Desktop·Mobile 렌더 결과를 평가해 선택하고 부분 보정한다.

핵심 개발 항목은 다음 세 가지다.

1. 고품질 Section Layout Family와 Composition 후보를 확보한다.
2. 동일 콘텐츠로 서로 다른 레이아웃 후보를 자동 생성하고 상위 후보를 비교한다.
3. 실제 렌더링 화면을 평가해 문제가 있는 섹션만 자동 보정한다.

## 품질 목표

프로모션 웹 결과물의 품질은 다음 여섯 기준으로 판단한다.

1. 첫 화면에서 프로모션의 핵심 메시지와 행동 목표가 즉시 이해된다.
2. 제목, 본문, 가격·혜택, CTA 사이의 시각적 위계가 분명하다.
3. 섹션마다 역할과 표현 방식이 달라 페이지 전체에 리듬이 있다.
4. 이미지, 색상, 타이포그래피가 하나의 Art Direction을 공유한다.
5. 여백, 정렬, 줄바꿈과 이미지 크롭이 정교하다.
6. Desktop뿐 아니라 Mobile에서도 같은 수준의 완성도를 유지한다.

성공 지표는 생성 횟수보다 다음 항목을 우선한다.

- 첫 생성 결과 채택률
- 생성 후 사용자가 수정한 속성 수
- 섹션 재생성 횟수
- 품질 게이트 자동 보정 횟수와 실패율
- Desktop·Mobile Blocking 진단 발생률
- 생성부터 게시까지 걸린 시간
- 레이아웃 후보별 채택률
- 디자이너 평가 점수와 실제 캠페인 전환율

## 유사 서비스에서 확인한 방향

### 디자인 중심 생성

Framer AI는 페이지, 섹션, 카피와 비주얼을 만든 뒤 대화 또는 디자인 캔버스에서 계속 수정하도록 한다. 게시 전 대비, 오탈자, 대체 텍스트, SEO와 스타일 일관성을 검토하는 흐름도 제공한다. 현재 프로젝트는 Framer의 시각적 수정 경험과 게시 전 리뷰 방식을 참고하되, 자유 편집보다 승인된 Component와 정책을 우선한다. [Framer AI](https://www.framer.com/ai/)

Webflow AI는 사이트 설명에서 페이지·섹션 구조를 먼저 제안하고 사용자가 구조와 레이아웃을 검토한 뒤 전체 사이트를 생성한다. 색상과 폰트 같은 입력은 Theme System으로 연결된다. 생성 전에 구조를 승인받는 방식은 페이지 전체 Composition 후보 검토에 참고할 수 있다. [Webflow AI Site Builder](https://help.webflow.com/hc/en-us/articles/38840145286035-Build-a-site-with-Webflow-s-AI-site-builder)

### 구조화된 설계

Relume은 Prompt에서 바로 완성 페이지를 만들지 않고 Sitemap, Wireframe, Style Guide 순서로 결과를 구체화한다. 검증된 컴포넌트 라이브러리에서 구조를 만들고 Figma, Webflow 또는 React로 내보낸다. 현재 프로젝트에 가장 중요한 시사점은 자유 생성보다 **단계별 구조 결정과 검증된 조합**이 평균 품질을 안정시킨다는 점이다. [Relume AI Site Builder](https://www.relume.ai/contra)

### 프로모션과 전환 최적화

Leadpages는 자연어 설명에서 브랜드가 적용된 랜딩페이지, 카피, 이미지, 폼과 전환 경로를 만들고 요소 단위 편집, A/B 테스트와 트래픽 최적화를 연결한다. 프로모션 페이지를 생성한 뒤 성과로 개선하는 제품 방향에서 가장 직접적인 비교 대상이다. [Leadpages AI Page Builder](https://leadpages.com/product/ai-page-builder)

Unbounce는 산업, 사용자와 캠페인 목적에 따라 레이아웃·컴포넌트를 추천하고 복수의 디자인과 카피 후보를 제시한다. A/B 테스트와 방문자별 Variant 라우팅까지 연결한다. 디자인 점수뿐 아니라 전환 목적을 후보 평가에 포함해야 한다는 근거가 된다. [Unbounce 기능](https://unbounce.com/product/features/), [Unbounce Smart Builder](https://documentation.unbounce.com/hc/en-us/articles/4403206662420-Creating-a-Page-With-Smart-Builder)

### 코드와 기업 운영

v0는 Design System Registry, Component, Tailwind와 디자인 토큰을 생성 컨텍스트로 사용한다. 이 방식은 현재 Component Registry를 AI가 안정적으로 사용하도록 만드는 참고 모델이다. [v0 Design Systems](https://v0.dev/docs/design-systems)

10Web은 기획, 디자인, 개발, QA, 콘텐츠, 이미지, DevOps와 SEO를 전문 Agent 역할로 나누어 사이트를 생성한다. 역할을 분리하는 구조는 한 번의 거대한 프롬프트보다 단계별 생성·검증 책임을 명확히 하는 데 참고할 수 있다. [10Web 기능](https://10web.io/features/)

공식 제품 설명은 기능 범위를 확인하는 자료이며 실제 시각 품질의 우열을 증명하지 않는다. 동일한 Brief와 브랜드 자료를 사용한 결과물 벤치마크로 별도 검증한다.

## 제품 차별화 방향

범용 웹사이트·앱 생성기와 정면 경쟁하기보다 다음 영역에 집중한다.

> 기업의 승인된 브랜드 시스템과 콘텐츠 정책을 사용해 고품질 프로모션 페이지를 반복 생성하고 검토, 게시, 이력과 롤백까지 관리하는 플랫폼

핵심 차별화 요소는 다음과 같다.

- 한국어 프로모션 카피와 한글 타이포그래피 최적화
- 승인된 Section, Component, Resource와 Design Token 사용
- 브랜드별 생성 규칙과 금지 규칙
- 자유로운 레이아웃 탐색과 구조적 안전성의 공존
- Desktop·Mobile 실제 렌더 기반 품질 평가
- Revision, 승인, 감사 로그와 Rollback
- PostgreSQL, Directus와 기존 기업 인프라 연동
- 캠페인 Variant 생성과 전환 성과 기반 개선

## 디자인 토큰 적용 원칙

디자인 토큰을 기존 레이아웃까지 고정하는 용도로 사용하면 결과가 안전하지만 반복적이고 템플릿처럼 보일 수 있다. 반대로 톤앤매너만 남기고 간격, 그리드와 반응형 규칙까지 자유 생성하면 일부 결과는 새로워도 평균 품질 편차와 모바일 실패율이 커진다.

토큰과 생성 규칙을 세 계층으로 분리한다.

### Brand Token

브랜드 정체성을 유지하는 강제 조건이다.

```json
{
  "color.primary": "#18584A",
  "color.accent": "#F2B84B",
  "font.display": "Pretendard",
  "font.body": "Pretendard",
  "radius.brand": "12px",
  "shadow.brand": "soft"
}
```

레이아웃 후보가 달라져도 색상 역할, 폰트와 기본 시각 성격은 유지한다.

### Foundation Token

반응형과 레이아웃 품질을 보장하는 강제 조건이다.

```json
{
  "spacing.scale": [4, 8, 12, 16, 24, 32, 48, 64, 96],
  "content.maxWidth": 1280,
  "content.readingWidth": 720,
  "grid.columns": 12,
  "breakpoint.mobile": 720,
  "touchTarget.min": 44
}
```

간격 배수, 콘텐츠 최대 너비, 최소 터치 영역, Breakpoint, 최소 글자 크기와 정렬 기준은 창의적 생성 대상에서 제외한다.

### Composition Rule

레이아웃의 다양성을 만드는 유연한 조건이다.

```json
{
  "allowedFamilies": [
    "split",
    "editorial",
    "full-bleed",
    "bento",
    "asymmetric"
  ],
  "preferredDensity": "low",
  "preferredImageEmphasis": "high",
  "symmetryPreference": "asymmetric"
}
```

Composition Rule은 특정 배치를 강제하지 않고 후보 생성과 점수 계산에 사용하는 Soft Constraint로 둔다.

### 적용 결정

| 영역 | 적용 수준 | 이유 |
|---|---|---|
| 브랜드 색상·폰트·시각 역할 | 강제 | 브랜드 일관성 유지 |
| 간격 배수·그리드·Breakpoint | 강제 | 레이아웃 안정성과 반응형 품질 유지 |
| 최소 글자·터치 크기·대비 | 강제 | 접근성과 사용성 보장 |
| Section Layout Family | 허용 목록 | 검증된 문법 안에서 다양성 확보 |
| 이미지·텍스트 좌우 배치 | 후보별 선택 | 콘텐츠와 시선 흐름에 맞게 변화 |
| 콘텐츠 비율·밀도·CTA 배치 | 후보별 선택 | 프로모션 목적에 맞는 강조 구조 생성 |
| 기존 페이지의 좌표와 배치 | 참조하지 않음 | 복제와 템플릿 인상을 방지 |

## 페이지 단위 Art Direction

페이지를 생성하기 전에 전체 디자인 방향을 구조화한다. 섹션마다 독립적으로 스타일과 이미지를 생성하지 않는다.

```json
{
  "concept": "Premium Editorial",
  "mood": ["calm", "exclusive", "modern"],
  "visualDensity": "low",
  "heroComposition": "copy-left-visual-right",
  "palette": {
    "background": "warm-neutral",
    "accent": "deep-green"
  },
  "typography": {
    "headline": "editorial-display",
    "body": "clean-sans"
  },
  "imagery": {
    "lighting": "soft-directional",
    "textSafeArea": "left",
    "cropStrategy": "subject-right"
  }
}
```

색감, 조명, 배경 복잡도, 피사체 방향과 모바일 크롭 전략을 모든 이미지와 섹션이 상속한다. Hero 이미지 평가는 이미지 자체의 미적 품질뿐 아니라 DOM 텍스트를 배치할 안전 영역까지 포함한다.

## 레이아웃 후보 자동 생성

### 생성 원칙

레이아웃 후보 생성기는 자유 좌표 생성기가 아니다. 검증된 Layout Family와 허용 파라미터를 조합하는 결정론적 탐색기다.

```text
콘텐츠와 프로모션 목적
  → 적합한 Layout Family 선택
  → 허용 파라미터 변형
  → 후보 8개에서 12개 생성
  → 구조와 반응형 제약 검사
  → 디자인 품질 점수 계산
  → 상위 3개 실제 렌더링
  → 사용자 선택 또는 자동 채택
```

### 초기 Layout Family

| Section | 초기 후보 |
|---|---|
| Hero | Split, Centered Statement, Full-bleed, Editorial Asymmetric, Product Showcase, Offer-focused |
| Feature | Three-column Cards, Alternating Rows, Bento Grid, Icon List, Sticky Visual |
| Product | Gallery Split, Detail Stack, Visual Comparison, Product Spotlight |
| Social Proof | Quote Focus, Review Grid, Metric Band, Logo Wall |
| Offer | Price Split, Limited Offer Banner, Benefit Summary, Bundle Comparison |
| FAQ | Accordion, Topic Columns, Highlighted Question |
| CTA | Centered CTA, Visual CTA, Floating Card, Compact Conversion Band |

초기 구현은 Hero, Feature, Offer와 CTA부터 시작한다. 각 Section에서 최소 5개의 검증된 Composition을 확보한 뒤 범위를 넓힌다.

### 후보 파라미터

```json
{
  "layoutFamily": "hero-split",
  "contentAlignment": "left",
  "visualPosition": "right",
  "contentWidthPct": 42,
  "visualWidthPct": 52,
  "verticalAlignment": "center",
  "sectionHeight": "large",
  "backgroundMode": "neutral",
  "headlineScale": "display-xl",
  "ctaArrangement": "inline",
  "imageCrop": "portrait-right",
  "mobileStrategy": "copy-first"
}
```

자유롭게 바꿀 수 있는 값은 콘텐츠·이미지 비율, 좌우 반전, 정렬, 여백 밀도, 제목 Scale, 배경 모드, CTA 배열, 카드 열 수, 이미지 비율과 모바일 적층 순서로 제한한다.

### 후보의 차이

후보는 색상만 다른 복사본이 아니라 정보 위계와 시선 흐름이 달라야 한다.

- 안전한 기본 구성
- 이미지 강조 구성
- 메시지 강조 구성
- 가격·혜택 강조 구성
- 비대칭 Editorial 구성
- 몰입형 Full-bleed 구성
- 사회적 증거가 결합된 구성
- Mobile 우선 구성

## 페이지 전체 Composition

섹션별 최고 점수 후보를 독립적으로 이어 붙이면 페이지 전체가 단조롭거나 불균형해질 수 있다. 두 단계로 평가한다.

1. 각 섹션에서 상위 후보 3개를 선정한다.
2. 후보를 조합해 페이지 Variant를 만들고 페이지 리듬을 다시 평가한다.

기본 페이지 Variant는 다음 세 방향으로 제공한다.

- A안: 안정적이고 전환 중심
- B안: 이미지와 상품 중심
- C안: 브랜드와 Editorial 중심

페이지 점수는 인접 섹션의 배경, 정렬, 밀도, 이미지 방향과 카드 패턴이 반복되는지 평가한다. 모든 섹션이 `제목 → 본문 → 카드 3개`를 반복하거나 전체 페이지가 중앙 정렬만 사용하는 조합은 감점한다.

## 자동 검증과 품질 점수

### 후보 제외 조건

다음 조건을 위반한 후보는 점수 계산 전에 제거한다.

- 컴포넌트 충돌 또는 컨테이너 경계 이탈
- 제목, 본문, 이미지 또는 CTA 잘림
- 필수 콘텐츠나 필수 이미지 누락
- 최소 글자 크기와 터치 영역 위반
- 색상 대비와 브랜드 금지 규칙 위반
- 이미지 종횡비와 Safe Area 위반
- Desktop 또는 Mobile 가로 Overflow
- 고정·잠금 Component 위치 변경
- Mobile에서 과도한 세로 길이 또는 비정상 공백

### 품질 점수

| 평가 항목 | 비중 |
|---|---:|
| 첫 화면 전달력과 프로모션 목표 | 20% |
| 시각적 위계 | 20% |
| 브랜드·Art Direction 일치도 | 15% |
| 여백과 정렬 | 15% |
| 타이포그래피 | 10% |
| 이미지 적합도 | 10% |
| Mobile 완성도 | 10% |

초기 버전은 규칙 기반 점수를 사용한다. 이후 실제 Screenshot에 Vision 평가를 추가하되, 접근성·Overflow·Collision과 같은 결정적 검사는 Vision 판단으로 대체하지 않는다.

### 실제 렌더 기준

- Desktop: 1440px
- Laptop: 1280px
- Tablet: 768px
- Mobile: 390px

Desktop과 Mobile Blocking 진단이 모두 0건인 후보만 사용자에게 완료 후보로 제시한다.

## 한글 타이포그래피 품질

한글 프로모션 페이지는 단순 Font Size 조정만으로 완성도를 확보하기 어렵다. 별도 품질 규칙을 적용한다.

- 의미 단위 제목 줄바꿈
- Desktop 제목 최대 2줄, Mobile 최대 3줄 원칙
- 제목 길이에 따른 역할 Scale 선택
- 본문 최대 읽기 폭 제한
- 한글·영문·숫자 혼합 시 자간과 Baseline 확인
- 조사나 한 글자 단어만 다음 줄로 떨어지는 현상 완화
- CTA 한 줄 유지
- 가격, 혜택과 기간 정보의 숫자 위계 적용
- 이미지의 피사체와 제목 영역 충돌 방지

`fontSize` 중심 토큰보다 `display-hero`, `section-title`, `supporting-copy`, `offer-price`, `legal-copy` 같은 의미 역할을 사용한다.

## 부분 자동 보정

품질 문제가 발견됐을 때 페이지 전체를 다시 생성하지 않는다. 좋은 결과를 보존하면서 문제 범위만 수정한다.

| 문제 | 자동 보정 |
|---|---|
| Hero 전달력 점수 부족 | Hero Layout Family 또는 강조 비율 교체 |
| 제목 잘림 | Width Profile, 역할 Scale 또는 줄바꿈 조정 |
| Mobile Overflow | Mobile Preset과 적층 순서 교체 |
| 섹션 반복 | 해당 Section Composition만 교체 |
| 이미지 초점 충돌 | Crop, Safe Area와 텍스트 방향 조정 |
| 과도한 빈 공간 | Section Height와 내부 간격 재계산 |
| CTA 약함 | CTA 위치와 주변 대비를 허용 범위에서 조정 |

자동 보정은 제한된 Operation으로 기록하고 Undo할 수 있어야 한다. 최대 보정 횟수를 넘긴 후보는 `품질 확인 필요` 상태로 중단한다.

## Visual Editor 사용자 경험

1. 사용자가 `레이아웃 후보 생성`을 실행한다.
2. 현재 Section 또는 페이지의 상위 후보 3개를 비교한다.
3. Desktop과 Mobile Preview를 전환한다.
4. 후보마다 핵심 차이, 품질 점수와 경고를 표시한다.
5. 사용자가 후보를 선택하거나 최고 점수 후보를 자동 적용한다.
6. 콘텐츠와 Brand Token은 유지하고 Layout만 변경한다.
7. 적용 결과는 Editor History에 기록하고 Undo할 수 있다.

점수는 절대적인 미적 판단처럼 표시하지 않는다. `전환 강조`, `이미지 강조`, `브랜드 강조`처럼 후보의 의도와 Blocking 문제 유무를 함께 보여준다.

## 기존 시스템 적용

현재 프로젝트에는 다음 기반이 있으므로 별도의 자유 HTML 생성기를 추가하지 않는다.

- Contract v3 Composition과 Registry Candidate Resolver
- Section·Component·Resource 허용 목록
- Multi-component Layout Planner
- Layout Fit Scoring과 Collision Normalization
- Design Token과 Responsive Layout Contract
- Shared Renderer와 Visual Editor History·Undo
- Desktop·Mobile Quality Gate 설계

확장 구조는 다음과 같다.

```text
Brief와 Overview
  → Art Direction Resolver
  → Layout Family Registry
  → Candidate Generator
  → Constraint Validator
  → Section Quality Scorer
  → Page Rhythm Scorer
  → Desktop·Mobile Renderer
  → Render Quality Gate
  → Candidate Comparison UI
  → Apply Operation과 History
```

LLM은 Section 역할, 콘텐츠 강조점과 허용 후보의 의미 선택을 담당한다. Candidate Generator, Validator, Scorer와 Compiler는 결정론적으로 동작한다. LLM이 Raw CSS, 임의 좌표 또는 승인되지 않은 식별자를 반환하는 방식은 허용하지 않는다.

## 단계별 개발 계획

### 1단계 품질 기준선

- 동일 Brief 비교 Fixture 구축
- 현재 첫 생성 채택률과 수정 횟수 측정
- Hero, Feature, Offer, CTA 실패 유형 분류
- Desktop·Mobile Screenshot 저장과 비교 환경 구성

### 2단계 토큰 역할 분리

- Brand, Foundation, Composition Rule 분리
- 역할 기반 타이포그래피 추가
- 페이지 단위 Art Direction Contract 추가
- 기존 레이아웃 좌표를 생성 입력에서 제외

### 3단계 Layout Family MVP

- Hero, Feature, Offer, CTA Layout Family 정의
- 각 Section 최소 5개 검증 Composition 확보
- 후보별 허용 파라미터와 Mobile Strategy 정의
- 콘텐츠 길이·이미지 비율별 적합 조건 추가

### 4단계 후보 생성과 점수화

- Section 후보 6개 이상 생성
- Hard Constraint 위반 후보 제거
- 규칙 기반 품질 점수 계산
- 상위 후보 3개 선정
- 페이지 Variant A, B, C 생성과 Rhythm 평가

### 5단계 Visual Editor 연결

- 후보 비교 UI
- Desktop·Mobile 전환
- 후보 의도와 진단 표시
- 콘텐츠 유지 Layout 적용
- History와 Undo 연결

### 6단계 실제 렌더 품질 게이트

- 네 가지 Viewport Screenshot 생성
- DOM Geometry와 Screenshot 평가 결합
- Section 단위 자동 보정
- 최대 재시도와 실패 상태 적용

### 7단계 운영 학습

- 후보 선택·수정·재생성 이력 수집
- 브랜드·업종별 채택률 분석
- 저성과 Layout Family 비활성화
- 캠페인 A/B 결과를 후보 추천 점수에 반영

## MVP 범위

첫 번째 릴리스는 다음 범위로 제한한다.

- Hero, Feature, Offer, CTA 지원
- 페이지 단위 Art Direction 3안
- Section별 후보 6개 이상 생성
- 규칙 기반 검증과 점수화
- 상위 후보 3개 비교
- Desktop 1440px와 Mobile 390px 검증
- 후보 적용과 Undo
- 현재 콘텐츠, Brand Token과 Foundation Token 유지
- 문제가 있는 Section만 2회 이내 자동 보정

Vision Model 평가는 MVP 이후에 추가한다. 초기에는 결정론적 Fit, Collision, Overflow, Typography와 Rhythm 점수만으로도 완전 자유 생성보다 안정적인 품질 향상을 기대할 수 있다.

## 검증 실험

동일한 Brief, 콘텐츠와 이미지 자산으로 다음 세 방식을 비교한다.

| 실험군 | 생성 방식 |
|---|---|
| A | 기존 Layout과 좌표까지 강하게 참고 |
| B | 톤앤매너만 사용하고 Layout 완전 자유 생성 |
| C | Brand·Foundation Token을 유지하고 Layout Family를 자유 조합 |

평가 항목은 첫 생성 채택률, 평균 수정 속성 수, Mobile 실패율, 자동 보정 횟수, 디자이너 평가와 생성 시간이다. 기본 제품 방향은 C이며, 실험 결과가 이를 지지하는지 확인한다.

경쟁 제품 벤치마크는 Framer, Relume, Leadpages, Webflow, v0와 현재 Promo Builder에 동일 Brief를 입력해 비교한다. 평가자는 제품명을 가린 Screenshot을 기준으로 첫 화면 전달력, 위계, 타이포그래피, 이미지 조화, 페이지 리듬과 Mobile 완성도를 평가한다.

## 확정할 의사결정

- [ ] 첫 MVP 대상 Section을 Hero, Feature, Offer, CTA로 확정
- [ ] Brand Token과 Foundation Token의 강제 범위 승인
- [ ] Art Direction Contract 필드 승인
- [ ] Layout Family와 후보 파라미터 허용 범위 승인
- [ ] 품질 점수 비중과 Blocking 기준 승인
- [ ] 페이지 Variant 기본 방향 A, B, C 승인
- [ ] Screenshot 평가 Viewport와 재시도 횟수 승인
- [ ] 후보 선택·수정 이력의 수집 범위와 보존 정책 승인

## 참고 링크

- [Framer AI](https://www.framer.com/ai/)
- [Relume AI Site Builder](https://www.relume.ai/contra)
- [Webflow AI Site Builder](https://help.webflow.com/hc/en-us/articles/38840145286035-Build-a-site-with-Webflow-s-AI-site-builder)
- [Leadpages AI Page Builder](https://leadpages.com/product/ai-page-builder)
- [Unbounce Features](https://unbounce.com/product/features/)
- [v0 Design Systems](https://v0.dev/docs/design-systems)
- [10Web Features](https://10web.io/features/)
