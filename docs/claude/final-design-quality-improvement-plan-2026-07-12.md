# 개선 계획: Final Design 퀄리티 저하 / LO-FI 속도 문제

Reviewer: Claude
Date: 2026-07-12
검토 대상: `Promo Lo-Fi Draft Worker`(`rjrA0K4QyNsySTkW`), `Promo Final Design Worker`(`qGi72lZxFCipYGld`), `api/_final-design-prompt-budget.js`, `api/prompts-render.js`

## 결론

**LO-FI가 느리고 Final Design이 빠르면서 퀄리티가 떨어지는 현상은 버그가 아니라 최근 반영된 "LO-FI 이미지를 참조로 한 image edit" 구조의 트레이드오프이며, 여기에 프롬프트 길이 압축 처리가 겹쳐 스타일 디테일이 함께 깎이고 있을 가능성이 높다.** 속도 차이는 손댈 필요가 없는 구조적 차이지만, 퀄리티 저하는 (1) `input_fidelity=high`로 인한 스타일 자유도 제한, (2) 30,000자 초과 시 프롬프트 중간 섹션이 압축되어 스타일/토큰 지시가 손실될 가능성, 이 두 가지가 핵심 원인 후보다. 아래 개선 방안은 우선순위 순으로 정리했다.

## 이슈사항 (원인 분석)

### 1. 속도 차이는 정상 — 수정 대상 아님

- LO-FI: `images/generations`로 매번 완전히 새로 그리는 생성. `quality` 파라미터를 지정하지 않아 OpenAI 기본값에 의존.
- Final Design: 기존 LO-FI 이미지를 `images/edits`로 편집하는 구조라 처음부터 새로 그리는 것보다 빠른 것이 정상.
- 이 차이 자체를 "버그"로 보고 고칠 필요는 없음. 다만 LO-FI 속도를 의도적으로 개선할 여지는 있음(아래 5번).

### 2. `input_fidelity=high`가 스타일 자유도를 제한

- Final Design Worker의 `Generate Final Design Image` 노드는 `input_fidelity=high`를 사용해 LO-FI 원본을 픽셀 수준으로 강하게 보존한다.
- 레이아웃 보존에는 효과적이지만, 그만큼 모델이 "와이어프레임 느낌"에서 벗어나 스타일을 과감히 재해석할 여지가 줄어든다.
- `docs/handoff-2026-07-12.md`도 이 지점을 "브랜드 스타일 fidelity는 별도 트랙 필요"로 미해결 과제로 남겨둠 — 이번에 보고된 퀄리티 저하와 정확히 일치하는 예견된 리스크.

### 3. 30,000자 초과 시 프롬프트 중간 섹션 압축 손실 가능성

- `api/_final-design-prompt-budget.js`의 `fitFinalDesignPromptVariables`는 렌더링된 프롬프트가 30,000자를 넘으면 가장 긴 변수(대개 `integratedDesignBriefMarkdown`)를 앞 72%/뒤 28%만 남기고 중간을 압축한다.
- 실사용에서 이미 39,675자까지 나온 사례가 있었던 것으로 볼 때 이 압축이 자주 발동될 가능성이 있다.
- Integrated Brief 문서 구조(Source Priority Rules → … → Design Token Application → Section Content Mapping → … → Visual Direction → Final Image Prompt Inputs → Negative Prompt → Visual QA Checklist) 상, 압축 지점(72% 이후)에 스타일/토큰 관련 섹션이 걸릴 경우 실제 이미지 퀄리티에 직접 영향을 주는 지시가 손실될 수 있음.
- 참고: n8n `Generate Final Design Image` 노드에는 서버가 이미 압축한 결과 위에 `.slice(0, 30000)`이 한 번 더 걸려 있음. 현재는 대부분 영향 없는 중복 코드이지만, fit 실패(예외 발생) 시 에러 핸들링이 없어 워크플로우가 그대로 중단될 수 있는 리스크가 있음.

### 4. `input_fidelity` Admin 설정이 실제로 조정 불가능한 상태

- `api/_prompt-template-store.js`는 `inputFidelity`(camelCase)로 저장하지만 n8n은 `modelOptions.input_fidelity`(snake_case)를 읽는다.
- 키 불일치로 인해 Admin Page에서 이 값을 바꿔도 n8n은 항상 자체 폴백값(`high`)을 사용한다.
- 지금은 우연히 기본값도 "high"라 무증상이지만, `input_fidelity`를 낮춰 스타일 자유도를 실험하려면 이 키 불일치부터 고쳐야 한다.

### 5. Integrated Brief 프롬프트가 문서를 불필요하게 비대하게 만드는 근본 원인

- `promo-integrated-design-brief-generation.md` 지침이 "선택된 모든 디자인 토큰/섹션 입력값을 명시적으로 재서술"하도록 강제하고 있어, 문서가 필요 이상으로 길어지는 근본 원인이 됨.
- 문서가 길어질수록 30,000자 초과 압축이 더 자주 발동되고, 그만큼 스타일 디테일 손실 위험도 커짐.

## 개선 방안 (우선순위 순)

**1순위 — 데이터로 원인 확인**
최근 Final Design run들의 `promptMeta.lengthGuard`(이미 DB에 저장 중)를 조회해 압축이 실제로 얼마나 자주, 어떤 필드에서 발생하는지 확인한다. 압축이 드물게만 발생한다면 원인 2번(`input_fidelity`) 쪽에 무게를 둬야 하고, 자주 발생한다면 원인 3번(프롬프트 압축) 쪽이 주범일 가능성이 높다.

**2순위 — `input_fidelity` 키 불일치 수정**
저장 키를 `input_fidelity`(snake_case)로 통일하거나 n8n에서 `modelOptions.inputFidelity`를 읽도록 수정. 이후 `input_fidelity=medium` 조합을 실험해 레이아웃 유지와 스타일 자유도 사이의 균형점을 찾는다.

**3순위 — 압축 로직 개선**
"가장 긴 필드를 통째로 자르기"가 아니라, 스타일/토큰 관련 섹션(Design Token Application, Visual Direction, Final Image Prompt Inputs 등)은 보존하고 반복 서술이 많은 부분만 우선 축약하는 섹션 인식형 압축으로 개선한다.

**4순위 — Integrated Brief 프롬프트 간결화**
"모든 값을 명시적으로 재서술"하는 지침을 재검토해 문서 자체의 길이를 줄인다. 이렇게 하면 30,000자 초과 빈도 자체가 줄어들어 압축으로 인한 손실 위험이 근본적으로 줄어든다.

**5순위 — n8n 정리**
- 서버가 이미 안전하게 fit하므로 `Generate Final Design Image` 노드의 중복 `.slice(0, 30000)` 제거.
- `Render Final Design Prompt` 노드(fit 실패 시 422 가능)에 에러 핸들링/재시도 추가.

**6순위 — LO-FI 속도 개선(선택)**
LO-FI는 와이어프레임 수준이라 최고 품질일 필요가 없음. `Generate LO-FI Draft Image` 노드에 `quality` 파라미터를 명시적으로 낮은 값(예: medium/low)으로 지정해 속도를 의도적으로 개선하는 것을 검토한다. 단, 이 값이 LO-FI 이미지 자체의 세부 묘사에 영향을 줄 수 있으니 결과물 비교 후 결정.

## 검증 방법 제안

- 백업 워크플로우 `Promo Final Design Worker backup-2026-07-11`(ID `CXQ3Sg5DLSM5KDJt`)를 활용해 (a) 압축 로직 개선안, (b) `input_fidelity=medium`, (c) 스타일 지시 보강 조합을 운영에 영향 없이 각각 테스트한다.
- 동일 `confirmedDraftId`로 여러 조합을 실행해 결과 이미지를 나란히 비교한다.

## 참고 문서

- `docs/handoff-2026-07-12.md`
- `docs/claude/review-n8n-workflows-2026-07-12.md`
- `docs/claude/comprehensive-review-report-2026-07-12.md`
- `docs/claude/n8n-worker-remediation-plan-2026-07-11.md`

## 주의사항

이 문서는 분석 및 개선 제안이며, 소스코드/n8n 워크플로우는 아직 수정하지 않았다. 실제 적용은 요청 시 진행한다.
