# UI Design Generation 보완 작업 메모

작성일: 2026-06-28

## 배경

Promo Builder에서 B섹션에 입력한 프로모션 내용이 생성된 UI 디자인 이미지에 충분히 반영되지 않는 문제가 확인됨.

특히 아래 문제가 있었음.

- B2 입력 내용이 결과물에서 대부분 누락됨
- 선택한 Design MD의 톤앤매너, 레이아웃 철학, 컴포넌트 스타일이 약하게 반영됨
- 선택한 스타일/입력값이 실제 n8n 이미지 생성 prompt까지 강하게 전달되는지 확인하기 어려움

## 확인된 원인

### 1. B2 입력값과 B3 section draft 동기화 문제

기존 구조에서는 B2 값을 수정한 뒤 B3 `AI 섹션 초안`을 다시 생성하지 않으면, 이전 `sectionInputs`가 n8n payload에 우선 전달될 수 있었음.

n8n workflow에서는 `sectionInputs`를 primary content contract로 사용하고 있어서, B2 화면에는 최신 값이 있어도 생성 prompt에는 오래된 draft가 들어갈 수 있었음.

현재 조치:

- Simple Mode에서는 Generate 시점에 B2 최신 입력값으로 B3 draft를 자동 갱신하도록 수정함.
- 수정 위치: `prototype/app.js`
- 관련 메서드:
  - `refreshSectionDraft(options = {})`
  - `sectionInputsForPayload()`

### 2. n8n prompt의 content 강제력이 약함

현재 n8n prompt는 B섹션 내용을 포함하도록 안내하지만, 이미지 생성 모델이 이를 축약하거나 생략할 여지가 큼.

특히 아래 필드들이 결과에서 누락될 수 있음.

- `simpleBrief.targetAction`
- `simpleBrief.audience`
- `simpleBrief.secondaryMessage`
- `sectionInputs.stepBar`
- `sectionInputs.contentCta`
- `sectionInputs.imageTextRow`
- `promo.termsText`

현재 final prompt의 hard requirements는 `promo title`, `lead text`, `CTA`, `subline`, `legal/terms` 중심이라 Temp.4 전체 구조를 정확히 강제하기에는 부족함.

### 3. Design MD 적용 강도 부족

선택한 MD가 색상/폰트 정도로만 반영되고, 실제 레이아웃/구성/효과/컴포넌트 언어까지 반영되지 않는 문제가 있음.

가능 원인:

- seeded MD의 `designConcept.summary`, `designConcept.json`, `promptContext`가 비어 있을 수 있음
- n8n prompt에서 MD의 `layoutPhilosophy`, `composition`, `depthAndEffects`, `shapeAndRadius`, `dos/donts`가 hard requirement로 충분히 승격되지 않음
- B4가 `회사 기본값`인 경우 색상/폰트는 회사 프리셋을 쓰고, MD는 컨셉 참고로만 보일 수 있음

### 4. 이미지 생성 방식 자체의 한계

현재 단계는 HTML/CSS 생성이 아니라 UI 디자인 이미지 생성임.

이미지 생성 모델은 긴 텍스트, 약관, 세부 CTA 문구를 정확히 렌더링하는 데 한계가 있음. 따라서 정확한 문구 반영은 이후 `UI 이미지 승인 -> HTML/CSS/Vue 코드 생성` 단계에서 보장하는 구조가 필요함.

## 수정 필요 항목

### 1. n8n visibleContentChecklist 추가

n8n의 `Build UI Design Prompt` 단계에서 B섹션 입력값을 `visibleContentChecklist`로 명시해야 함.

포함 대상:

- Header
  - logoText
  - badgeText
- Hero Banner
  - leaderText
  - title
  - sublineText
  - CTA label
  - alpha/legal text
- Step Bar
  - step 1 title/description
  - step 2 title/description
  - step 3 title/description
- Content CTA
  - longText
  - CTA label
- Image Text Row
  - headerTitle
  - headerDescription
  - title
  - description
- Terms/Footer
  - terms title
  - terms contents
  - footer logo
  - license badges

Prompt에는 아래 성격의 규칙을 추가해야 함.

- Do not omit, replace, or invent the visible promo content.
- Use the provided sectionInputs as the exact text source for each section.
- If a text is too long for the mockup, show a faithful shortened version and preserve the core meaning.
- Terms may be condensed visually, but the legal block must be visible.

### 2. n8n 결과에 contentCoverageMap 추가

생성 결과가 어떤 입력값을 어디에 반영했는지 확인할 수 있도록 `contentCoverageMap`을 추가해야 함.

예시 구조:

```json
{
  "contentCoverageMap": {
    "heroBanner.title": "Hero headline area",
    "heroBanner.sublineText": "Hero supporting copy",
    "heroBanner.cta.label": "Primary CTA button",
    "stepBar[0].description": "Step bar item 1",
    "contentCta.longText": "Middle CTA content block",
    "titleDescription.contents": "Footer legal block"
  }
}
```

검증 조건:

- `contentCoverageMap`이 없으면 n8n workflow에서 실패 처리
- 주요 필드가 비어 있으면 실패 처리
- C섹션에서 확인 가능하게 노출

### 3. C섹션 디버그/검토 UI 추가

C섹션에서 생성 결과를 단순 이미지 URL만 보는 구조로는 원인 추적이 어려움.

추가 필요:

- `imagePrompt` 보기
- `layoutMapping` 보기
- `mdComplianceMap` 보기
- `contentCoverageMap` 보기
- 실패 시 `errorMessage` 보기

목적:

- B섹션 입력값이 n8n까지 전달됐는지 확인
- n8n이 어떤 prompt로 이미지를 만들었는지 확인
- MD 준수 여부를 눈으로 검토

### 4. MD 적용 강도 개선

n8n prompt에서 MD를 단순 참고가 아니라 디자인 스펙으로 고정해야 함.

강화 대상:

- `layoutPhilosophy`
- `visualMood`
- `spacingRhythm`
- `composition`
- `componentStyle`
- `depthAndEffects`
- `shapeAndRadius`
- `promoPageImplications`
- `dosApplied`
- `dontsAvoided`

추가 규칙:

- A result that only changes color/font is invalid.
- The selected MD controls layout, composition, component language, spacing, effects, and section rhythm.
- Company default style may control colors/fonts, but it must not override the selected MD layout concept.

### 5. MD 분석값 없는 경우 경고 또는 자동 분석

선택한 MD에 `designConcept` 분석값이 없으면 결과 품질이 낮아질 가능성이 높음.

보완 방향:

- Generate 전에 `designConcept.summary` 또는 `promptContext`가 비어 있으면 경고 표시
- 가능하면 자동으로 MD 분석 실행 후 Generate 진행
- 최소한 n8n prompt에 raw markdown을 fallback으로 강하게 포함

### 6. 이미지 생성과 코드 생성 단계 분리

현재 단계는 UI 디자인 이미지 생성임.

운영 흐름에서는 아래처럼 분리하는 것이 적절함.

1. B섹션 입력
2. Design MD 선택
3. UI 디자인 이미지 생성
4. 이미지 검토 및 승인
5. HTML/CSS/Vue 코드 생성
6. 퍼블리싱

정확한 텍스트 반영은 5번 코드 생성 단계에서 보장해야 함.

## 작업 우선순위

1. n8n `visibleContentChecklist` 추가
2. n8n `contentCoverageMap` 추가 및 필수 검증
3. C섹션에 `imagePrompt`, `contentCoverageMap`, `mdComplianceMap` 확인 UI 추가
4. MD 분석값 없는 경우 경고 또는 자동 분석 유도
5. n8n prompt에서 MD hard requirement 강화
6. UI 이미지 승인 후 코드 생성 workflow 별도 설계

## 내일 확인할 포인트

- 자동등록 후 Generate 시 B2 입력값이 payload의 `simpleBrief`, `promo`, `sectionInputs`에 모두 들어가는지 확인
- n8n 실행 결과의 `imagePrompt`에 Temp.4 섹션별 텍스트가 모두 포함되는지 확인
- 이미지 결과에서 Hero, Step Bar, CTA, Image Text Row, Terms/Footer가 모두 보이는지 확인
- 선택한 MD가 레이아웃/컴포넌트/효과까지 반영되는지 확인
- `styleSource = company_default`와 `styleSource = design_md` 결과 차이가 의도대로 나는지 확인
