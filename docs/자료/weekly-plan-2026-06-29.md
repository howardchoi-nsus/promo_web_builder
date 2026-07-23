# 금주 작업 계획 - 2026-06-29

## 작업 목표

금주는 `UI Design Generation 보완 작업 메모`를 기준으로, B섹션 입력값과 선택한 Design MD가 실제 UI 디자인 이미지 생성 결과에 더 명확하게 반영되도록 개선한다.

핵심 목표는 아래와 같다.

- B2 프로모션 입력값이 n8n prompt까지 누락 없이 전달되도록 보강함.
- Temp.4 섹션별 콘텐츠 반영 여부를 검증할 수 있는 구조를 추가함.
- Design MD가 색상/폰트뿐 아니라 레이아웃, 구성, 컴포넌트 스타일, 효과까지 제어하도록 prompt 강도를 높임.
- C섹션에서 생성 결과의 prompt, 매핑, MD 준수 여부를 검토할 수 있도록 디버그 UI를 확장함.

## 주요 작업 항목

### 1. n8n visibleContentChecklist 추가

- `Build UI Design Prompt` 단계에 Temp.4 섹션별 필수 노출 콘텐츠 목록을 추가함.
- Header, Hero Banner, Step Bar, Content CTA, Image Text Row, Terms/Footer 기준으로 입력값을 정리함.
- 긴 문구는 축약 가능하지만 핵심 의미와 legal block은 유지하도록 prompt 규칙을 강화함.

### 2. contentCoverageMap 추가 및 검증

- n8n 결과에 `contentCoverageMap`을 추가함.
- 각 입력값이 결과 디자인의 어느 영역에 반영됐는지 설명하도록 요구함.
- 주요 필드가 비어 있거나 `contentCoverageMap`이 없으면 workflow에서 실패 처리하도록 검토함.

### 3. C섹션 검토 UI 확장

- 생성 결과 상세에서 아래 항목을 확인할 수 있도록 UI를 추가함.
  - `imagePrompt`
  - `layoutMapping`
  - `contentCoverageMap`
  - `mdComplianceMap`
  - `errorMessage`
- 목적은 B섹션 입력값 전달 여부, n8n prompt 품질, MD 준수 여부를 운영자가 빠르게 확인하는 것이다.

### 4. Design MD 적용 강도 개선

- n8n prompt에서 Design MD를 참고 자료가 아니라 생성 스펙으로 명시함.
- `layoutPhilosophy`, `visualMood`, `spacingRhythm`, `composition`, `componentStyle`, `depthAndEffects`, `shapeAndRadius`, `dos/donts`를 hard requirement로 강화함.
- 회사 기본 스타일은 색상/폰트 기준으로만 쓰고, MD의 레이아웃 콘셉트를 덮어쓰지 않도록 정리함.

### 5. MD 분석값 없는 경우 대응

- Generate 전에 선택한 MD의 `designConcept.summary` 또는 `promptContext`가 비어 있는지 확인함.
- 분석값이 없는 경우 경고 표시 또는 자동 분석 유도 흐름을 검토함.
- n8n prompt에는 raw markdown fallback이 충분히 전달되도록 보강함.

## 검증 계획

- 자동등록 후 Generate 시 `promo`, `simpleBrief`, `sectionInputs`에 B2 입력값이 모두 들어가는지 확인함.
- n8n 실행 결과의 `imagePrompt`에 Temp.4 섹션별 텍스트가 포함되는지 확인함.
- 결과 이미지에서 Hero, Step Bar, Content CTA, Image Text Row, Terms/Footer가 모두 보이는지 확인함.
- `contentCoverageMap`과 `mdComplianceMap`이 실제 검토 가능한 수준으로 반환되는지 확인함.
- `styleSource = company_default`와 `styleSource = design_md` 결과 차이가 의도대로 나타나는지 비교함.

## 예상 산출물

- 수정된 `n8n/promo-ui-design-image-generator.workflow.json`
- 확장된 C섹션 결과 검토 UI
- `contentCoverageMap` 포함 생성 결과 payload
- MD 적용 강도 개선된 image prompt
- 금주 작업 결과 및 남은 이슈 정리 문서

