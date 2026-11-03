# Daily Plan - 2026-07-01

## 오늘의 핵심 목표

`Integrated Design Brief MD`를 사용자 요구 기준으로 재정의하고, `Design Prompt MD + Section Input Log MD -> Integrated Design Brief MD -> UI image generation` 흐름이 실제 n8n/workflow/API 구조에 맞게 동작하도록 설계와 검증 기준을 확정한다.

오늘의 중심은 단순 UI 표시 개선이 아니라, 이미지 생성 LLM이 최종적으로 `Integrated Design Brief MD` 하나만 읽고도 full-page Web UI mockup을 만들 수 있게 만드는 것이다. 이 문서는 내부 n8n 전용 산출물이 아니라, 다른 LLM이나 디자인 에이전트도 그대로 받아 웹 UI 디자인을 생성할 수 있는 독립 실행 브리프여야 한다.

## 어제 handoff에서 이어받은 핵심 맥락

- `Integrated Design Brief MD`는 요약문이나 세 번째 참고 문서가 아니다.
- 사용자가 원하는 정의는 `Design Prompt MD + Section Input Log MD = Integrated Design Brief MD`이다.
- 최종 문서는 선택된 Design MD의 디자인 철학, B섹션 입력값, 섹션별 visible copy, Template 4 매핑, 충돌 해결 결과, 최종 이미지 생성 지시를 모두 포함해야 한다.
- 이미지 생성 단계는 `Design Prompt MD`, `Section Input Log MD`, `designBrief JSON`, `layoutMapping JSON`을 다시 읽으면 안 된다.
- 문서 안에 "refer to Design Prompt MD", "see Section Input Log" 같은 참조형 표현이 있으면 실패로 봐야 한다.
- 통합문서는 특정 n8n 노드나 내부 JSON 구조를 모르는 외부 LLM/디자인 에이전트도 사용할 수 있어야 한다.
- production에서는 기존 runKey fallback, integrated markdown 조회, 이미지 직접 보기 링크는 확인되었다.
- 남은 큰 리스크는 Cloud n8n에 최신 workflow가 반영되지 않았거나, 신규 runKey에서 별도 `integrated_design_brief_markdown` asset이 실제 저장되지 않을 수 있다는 점이다.

## 오늘 우선순위

### P0. Integrated Design Brief MD 정의 확정

- `Integrated Design Brief MD`의 역할을 독립 실행 문서로 고정한다.
- 필수 포함 항목을 체크리스트로 확정한다.
- 현재 11개 섹션 구조를 유지할지, 통합문서 목적에 맞게 재구성할지 결정한다.
- 참조형 문구 금지 규칙을 검증 조건으로 명문화한다.

완료 기준:

- 문서 구조와 필수 검증 항목이 명확하다.
- downstream 이미지 생성 단계가 읽어야 하는 입력이 `Integrated Design Brief MD` 하나로 고정된다.
- 외부 LLM/디자인 에이전트 관점에서도 추가 설명 없이 실행 가능한 브리프 형식이다.

### P1. n8n 통합문서 생성 흐름 재설계

- `Build Integrated Design Brief Request` 입력을 `designBrief/layoutMapping JSON` 중심에서 `Design Prompt MD full text + Section Input Log MD full text` 중심으로 바꿀 설계를 정리한다.
- `designBrief JSON`, `layoutMapping JSON`은 보조 입력으로 둘지, 두 MD 안에 포함된 정보로 제한할지 결정한다.
- `Parse Validate Integrated Design Brief`에서 아래 검증을 추가할 기준을 잡는다.
  - YAML frontmatter 존재
  - `type: integrated_design_brief`
  - `sourceDocuments` 3종
  - `pageWidth: 1440px`
  - `heightPolicy`
  - `cropPolicy`
  - 섹션별 visible copy 포함
- 참조형 문구 금지
- 내부 전용 필드명이나 구현 세부사항에 의존하지 않는 독립 실행성

완료 기준:

- workflow 수정 범위가 노드 단위로 정리된다.
- n8n에서 어느 단계가 두 MD 전문을 만들고 넘기는지 결정된다.

### P1. 통합문서 생성 프롬프트 강화

- `prompts/promo-integrated-design-brief-generation.md`를 독립 실행 문서 생성용으로 보강한다.
- "Do not summarize"를 명시한다.
- "Do not refer to the source documents"를 명시한다.
- 두 입력 문서의 최종 디자인/콘텐츠 결정을 integrated brief 안에 복사, 해석, 충돌 해결, 재서술하도록 지시한다.
- 웹 UI mockup과 인쇄물/포스터 디자인의 차이를 명시한다.
- `1024x1536`은 bitmap export size일 뿐이고, 실제 웹 페이지 비율이나 포스터 아트보드가 아니라는 점을 명시한다.

완료 기준:

- 프롬프트가 참조형 요약문이 아니라 self-contained execution document를 만들도록 강제한다.
- 프롬프트가 n8n 내부뿐 아니라 범용 LLM/디자인 에이전트에 전달 가능한 산출물을 만들도록 강제한다.
- API prompt wrapper와 markdown 원문이 같은 기준을 가진다.

### P1. Print-like Output 원인 진단 기준 추가

현재 생성 이미지가 웹 UI 디자인보다 인쇄물 디자인처럼 보이는 문제가 있다. 원인을 추적하기 위해 integrated brief와 image prompt에 아래 진단 기준을 넣는다.

가능한 원인:

- `1024x1536 tall canvas` 표현이 웹 페이지가 아니라 세로형 포스터 아트보드처럼 해석된다.
- "모든 섹션을 한 이미지에 보여라"가 스크롤 가능한 웹 페이지 축소본이 아니라 한 장짜리 편집물/브로슈어 구도로 해석된다.
- `browser chrome`, `Figma canvas UI`를 금지하면서도 웹 UI임을 보여주는 대체 신호가 부족하다.
- 검증 기준이 `footer 누락`, `crop 방지`, `MD compliance` 위주라서 웹 UI 컴포넌트성, 네비게이션성, 클릭 가능한 CTA, 섹션 컨테이너, 그리드 리듬을 충분히 확인하지 않는다.
- Design MD의 editorial/high-impact/promo 성향이 강할 경우, 이를 웹 UI 컴포넌트 언어로 번역하지 않고 그대로 키비주얼/포스터 구도로 가져갈 수 있다.

추가해야 할 웹 UI 신호:

- header/navigation 구조
- 클릭 가능한 CTA 버튼/링크 형태
- section container, card, panel, list, form-like component 등 웹 컴포넌트 문법
- 1440px desktop page width 기준의 grid rhythm
- footer/legal hierarchy
- 실제 스크롤 가능한 웹 페이지를 축소한 느낌

금지해야 할 인쇄물 신호:

- poster, flyer, brochure, print ad, presentation slide, magazine cover
- single centered key visual
- decorative poster typography
- paper margin / editorial cover layout
- full-canvas image with text pasted over it

완료 기준:

- image prompt와 integrated brief에 `webUiFidelityProof` 또는 동등한 설명이 포함된다.
- negative prompt에 print/poster 계열 금지어가 포함된다.
- 생성 결과를 볼 때 "왜 웹 UI가 아니라 인쇄물처럼 보였는지"를 프롬프트/통합문서 단계에서 역추적할 수 있다.

### P2. 신규 runKey 저장/조회 검증

- 신규 runKey 생성 후 `/api/promo-design-assets?runKey={runKey}`에서 3개 markdown asset이 모두 보이는지 확인한다.
  - `design_prompt_markdown`
  - `promo_input_markdown`
  - `integrated_design_brief_markdown`
- C섹션 `MD 보기` 모달에서 세 문서가 각각 표시되는지 확인한다.
- `/api/promo-design-view?id={runKey}`에서 이미지와 `Open image` 링크가 정상 동작하는지 확인한다.

완료 기준:

- 신규 생성분에서 fallback이 아니라 별도 integrated brief asset이 저장된다.
- C섹션 UI와 API 조회 결과가 같은 상태를 보여준다.

### P2. Cloud n8n 반영 확인

- Cloud n8n에 로컬 workflow JSON이 반영되었는지 확인한다.
- 아래 노드/필드가 운영 workflow에 있는지 확인한다.
  - `Load Integrated Design Brief Prompt`
  - `LLM Generate Integrated Design Brief`
  - `Parse Validate Integrated Design Brief`
  - `Persist UI Design Asset`의 `integratedDesignBriefMarkdown`
  - `Merge Persisted UI Design Result`의 `integratedBriefStorageKey`

완료 기준:

- 로컬 변경과 Cloud n8n 실행 흐름의 차이가 확인된다.
- 차이가 있으면 import/반영 작업 목록을 만든다.

## 권장 작업 순서

1. `Integrated Design Brief MD` 필수 구조와 실패 조건을 문서로 확정한다.
2. `prompts/promo-integrated-design-brief-generation.md`를 먼저 강화한다.
3. n8n workflow에서 두 MD 전문을 integrated generation 단계로 넘기는 방식을 설계한다.
4. workflow JSON을 수정한다.
5. 신규 runKey로 generated image + 세 MD 저장/조회 + 이미지 보기까지 end-to-end 검증한다.
6. 검증 결과를 handoff 또는 daily plan에 업데이트한다.

## 오늘 산출물

- 확정된 `Integrated Design Brief MD` 정의와 필수 구조
- 강화된 integrated brief generation prompt
- 수정된 n8n workflow 설계 또는 JSON
- 외부 LLM/디자인 에이전트에서도 실행 가능한지 판단할 수 있는 검증 기준
- 신규 runKey 기준 검증 결과
- Cloud n8n 반영 필요 여부 체크 결과

## 보류해도 되는 일

- C섹션 타일 그리드 UI 고도화
- 썸네일/상태/생성일 표시 방식 개선
- Design MD 목록 로딩 속도 개선

위 작업들은 중요하지만, 오늘은 integrated brief가 최종 이미지 생성의 단일 기준이 되도록 만드는 것이 더 상위 의존성이다.

## 오늘 시작 질문

1. 두 MD 전문은 n8n 내부에서 먼저 markdown 문자열로 만들 것인가, 아니면 API에 markdown preview/generate endpoint를 추가해 n8n이 호출할 것인가?
2. `Integrated Design Brief MD`는 기존 11개 섹션을 유지할 것인가, 아니면 통합문서 목적에 맞춘 새 섹션 구조로 재구성할 것인가?
3. `designBrief JSON`과 `layoutMapping JSON`은 integrated brief 생성의 보조 입력으로 계속 둘 것인가, 아니면 두 MD 문서 안에 포함된 정보로만 제한할 것인가?

## 후추의 추천 결정안

- 두 MD 전문 생성은 API 함수로 공통화하고, n8n에서는 그 결과 markdown text를 받아 integrated brief generation에 넣는 방향이 좋다.
- `Integrated Design Brief MD` 구조는 기존 11개 섹션을 억지로 유지하기보다, 독립 실행 문서 목적에 맞게 재구성하는 편이 낫다.
- `designBrief JSON`과 `layoutMapping JSON`은 transition 기간에는 보조 입력으로 유지하되, 이미지 생성 단계에는 절대 전달하지 않는 선을 지킨다.
