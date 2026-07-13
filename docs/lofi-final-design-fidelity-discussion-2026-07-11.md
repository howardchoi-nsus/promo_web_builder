# LO-FI와 최종 디자인 간 레이아웃 일관성 개선 논의

Date: 2026-07-11  
Status: Discussion  
Scope: Promo Wizard Step 3 LO-FI 확인 및 Step 4 최종 디자인 생성

## 1. 논의 목적

현재 사용자가 승인한 LO-FI 시안과 최종 디자인 결과물 사이에 섹션 순서, 콘텐츠 배치, CTA 위치, 시각적 위계 차이가 크게 발생한다.

이 문서는 문제를 모델 품질 문제가 아닌 생성 파이프라인과 입력 계약 관점에서 정리하고, 해결 방향 및 팀 결정이 필요한 항목을 논의하기 위해 작성한다.

## 2. 현재 확인된 현상

- 사용자가 Step 3에서 LO-FI 시안을 선택하고 Confirm Draft를 실행한다.
- Step 4에서 최종 디자인을 생성하면 선택한 LO-FI와 다른 레이아웃이 만들어질 수 있다.
- 콘텐츠가 같더라도 섹션 순서, CTA 위치, 콘텐츠 그룹, 이미지 비중이 달라진다.
- 결과적으로 Confirm Draft가 실질적인 레이아웃 승인 단계로 기능하지 못한다.

## 3. 현재 생성 흐름

현재 소스코드 기준 생성 흐름은 다음과 같다.

```text
Integrated Brief ──> LO-FI 이미지 생성

Integrated Brief ──> 최종 디자인 이미지 생성
```

LO-FI와 최종 디자인이 같은 Integrated Brief를 사용할 수는 있지만, 최종 이미지 생성 모델이 Confirm된 LO-FI 이미지를 직접 참조하는 연결은 확인되지 않는다.

사용자가 기대하는 흐름은 다음과 같다.

```text
Integrated Brief ──> LO-FI 이미지 생성
                         │
                         └─ 사용자 Confirm
                                  │
Confirmed LO-FI 이미지 + Integrated Brief
                                  │
                                  └─> 레이아웃을 유지한 최종 디자인 생성
```

## 4. 코드 기준 확인 사항

### 4.1 Confirm Draft는 선택 상태만 저장한다

관련 파일:

- `api/promo-generation-lofi-draft-confirm.js`

Confirm Draft API는 선택된 draft의 `confirmed_at`을 갱신하고 같은 run의 다른 draft 선택을 해제한다.

이 단계에서는 LO-FI 이미지를 최종 이미지 모델의 reference input으로 연결하지 않는다.

### 4.2 Final Design API는 draft ID만 조회한다

관련 파일:

- `api/promo-generation-final-designs.js`

Final Design API의 confirmed draft 조회 결과에는 현재 `id`만 포함된다.

조회하지 않는 주요 필드:

- `draft_attempt`
- `draft_image_url`
- `draft_prompt`
- `prompt_meta`
- `model_meta`
- `confirmed_at`

### 4.3 Final worker payload가 레이아웃 근거를 포함하지 않는다

현재 final worker payload의 핵심 구조는 다음과 같다.

```json
{
  "runId": "...",
  "runKey": "...",
  "stage": "final_design",
  "taskId": "...",
  "finalDesignId": "...",
  "confirmedDraftId": "..."
}
```

현재 payload에 없는 정보:

- Confirm된 LO-FI 이미지 URL
- n8n이 접근할 수 있는 LO-FI image proxy URL
- LO-FI 생성 프롬프트
- 섹션 순서 및 상대 배치 보존 규칙
- CTA 위치 보존 규칙
- Integrated Brief와 LO-FI 사이의 우선순위
- 최종 디자인 전용 prompt

`confirmedDraftId`는 DB 식별자이므로 이미지 모델이 LO-FI의 실제 레이아웃을 이해할 수 없다.

### 4.4 Step 4 요청에 final prompt가 없다

관련 파일:

- `prototype/promo-wizard.js`

Step 4 요청은 `runId`, `confirmedDraftId`, worker 실행 여부, timeout, 일부 `promptMeta`를 전송한다.

`finalPrompt`는 전송하지 않으므로 생성된 final design row의 `final_prompt`는 빈 값으로 시작한다. `promptMeta`도 DB에는 저장되지만 현재 final worker payload에는 포함되지 않는다.

### 4.5 final_design 전용 prompt type이 없다

관련 파일:

- `api/_prompt-template-store.js`

현재 기본 prompt type:

- `integrated_brief`
- `image_execution`
- `lofi_draft`

`image_execution`은 Integrated Brief를 기준으로 UI를 렌더링하도록 지시하지만, Confirm된 LO-FI 레이아웃을 유지하며 시각적 완성도만 높이라는 계약은 없다.

### 4.6 저장소에서 final worker workflow를 확인할 수 없다

현재 `n8n/` 폴더에서 다음 값을 소비하는 final worker workflow를 확인하지 못했다.

- `final_design`
- `confirmedDraftId`
- `draftImageUrl`
- reference/input image

Cloud n8n에 별도 workflow가 존재할 수 있으므로 실제 운영 workflow 확인이 추가로 필요하다.

## 5. 근본 원인

### 원인 1. Confirm된 LO-FI 이미지가 최종 모델에 전달되지 않는다

가장 큰 원인이다. 현재 Confirm은 선택 기록으로만 작동하며 최종 생성의 시각적 입력으로 연결되지 않는다.

### 원인 2. 최종 단계가 polishing이 아닌 재생성으로 정의되어 있다

최종 단계에 레이아웃 보존 규칙이 없으므로 모델은 Integrated Brief를 바탕으로 새로운 디자인을 만들 수 있다.

### 원인 3. final worker 입력 계약이 부족하다

worker는 선택된 draft의 ID는 알지만 해당 draft의 이미지, 프롬프트, 레이아웃 의미는 알 수 없다.

### 원인 4. 전용 workflow와 prompt의 책임이 불명확하다

`image_execution`을 최종 디자인에 계속 사용할지, `final_design` 전용 prompt와 workflow를 분리할지 결정되지 않았다.

### 원인 5. 이미지 생성 모델의 변동성

현재 Gemini 이미지 설정의 temperature는 `0.4`다. 생성 변동성은 차이를 키울 수 있지만 reference image와 레이아웃 계약이 없는 상태에서는 부차적인 원인이다.

## 6. 사용자 및 제품 영향

- 사용자가 승인한 LO-FI가 최종 결과에 반영된다는 신뢰가 낮아진다.
- Confirm Draft 단계의 제품적 의미가 약해진다.
- 최종 결과 생성 후 레이아웃을 다시 검토해야 하므로 반복 작업이 증가한다.
- 같은 입력에서도 결과 편차가 커져 품질 기준을 정의하기 어렵다.
- 승인 이력은 남지만 무엇을 승인했는지가 최종 생성 과정에 강제되지 않는다.

## 7. 해결 선택지

### 선택지 A. Prompt만 강화

Integrated Brief 또는 `image_execution` prompt에 레이아웃 보존 지시를 추가한다.

장점:

- 구현 범위가 작다.
- 빠르게 적용할 수 있다.

단점:

- 모델이 LO-FI 이미지를 보지 못하는 문제는 해결되지 않는다.
- 텍스트만으로 실제 LO-FI 배치를 복원하기 어렵다.
- 레이아웃 일관성 개선 폭이 제한적이다.

평가: 임시 대응으로만 적합하다.

### 선택지 B. Confirmed draft 상세를 payload에 추가

Final Design API가 draft 이미지 URL, prompt, metadata를 조회해 worker payload로 전달한다.

장점:

- worker가 선택된 LO-FI의 실제 정보를 사용할 수 있다.
- 기존 Step 3/4 구조를 크게 변경하지 않아도 된다.

단점:

- n8n이 URL만 받고 이미지 모델의 reference input으로 연결하지 않으면 효과가 없다.
- private Blob 접근을 위한 proxy 또는 인증 처리가 필요하다.

평가: 반드시 필요한 기반 작업이다.

### 선택지 C. final_design 전용 prompt와 n8n workflow 분리

최종 디자인을 신규 생성이 아니라 Confirm된 LO-FI를 polish하는 단계로 명확히 정의한다.

장점:

- 단계별 책임이 명확해진다.
- LO-FI 구조 보존 정책을 독립적으로 관리할 수 있다.
- Admin Page에서 최종 디자인 모델과 prompt를 별도 운영할 수 있다.

단점:

- prompt type, migration, Admin UI, n8n workflow 작업이 필요하다.
- 운영 설정과 callback 계약을 함께 검증해야 한다.

평가: 중장기적으로 가장 명확한 구조다.

### 선택지 D. LO-FI를 실제 reference image로 전달하고 fidelity를 검증

Confirmed LO-FI 이미지를 Gemini의 reference/input image로 전달하고 결과물의 레이아웃 유사도를 검증한다.

장점:

- 실제 레이아웃 보존 가능성이 가장 높다.
- Confirm Draft가 구조 승인 단계로 기능한다.

단점:

- 사용하는 이미지 모델과 API의 reference image 지원 방식을 확인해야 한다.
- private Blob 이미지 접근과 이미지 입력 형식 처리가 필요하다.
- 레이아웃 보존 수준에 대한 검증 기준이 필요하다.

평가: 목표 품질을 달성하기 위한 핵심 해결책이다.

## 8. 권장 방향

선택지 B, C, D를 순서대로 결합하는 방안을 권장한다.

우선순위:

1. Confirmed LO-FI: 레이아웃 구조의 source of truth
2. Integrated Brief: 콘텐츠와 필수 섹션의 source of truth
3. Design MD 및 design tokens: 시각 스타일의 source of truth
4. Final worker: 구조를 변경하지 않고 polish와 detail을 적용

권장 worker payload 예시:

```json
{
  "runId": "...",
  "runKey": "...",
  "stage": "final_design",
  "finalDesignId": "...",
  "confirmedDraftId": "...",
  "confirmedDraft": {
    "draftId": "...",
    "draftAttempt": 2,
    "draftImageUrl": "...",
    "draftImageProxyUrl": "https://.../api/promo-generation-lofi-draft-image?draftId=...",
    "draftPrompt": "...",
    "promptMeta": {},
    "confirmedAt": "..."
  },
  "layoutFidelityPolicy": {
    "sourceOfTruth": "confirmed_lofi_draft",
    "preserveSectionOrder": true,
    "preserveRelativePlacement": true,
    "preserveContentGrouping": true,
    "preserveCtaPosition": true,
    "allowPolishOnly": true
  }
}
```

## 9. 제안 구현 순서

### Phase 1. 입력 계약 보강

1. `promo-generation-final-designs.js`에서 confirmed draft 상세 필드를 조회한다.
2. n8n에서 접근 가능한 absolute image proxy URL을 생성한다.
3. worker payload에 `confirmedDraft`와 `layoutFidelityPolicy`를 추가한다.
4. payload와 trigger metadata를 DB에 기록해 추적 가능하게 한다.

### Phase 2. final_design 책임 분리

1. `final_design` prompt type을 추가한다.
2. Admin Page에 Final Design Prompt 관리 항목을 추가한다.
3. 기존 DB를 위한 migration과 기본 model settings를 추가한다.
4. `image_execution`과 `final_design`의 책임을 문서화한다.

### Phase 3. n8n reference image 연결

1. final worker가 LO-FI 이미지를 다운로드한다.
2. 이미지를 Gemini reference/input image로 전달한다.
3. final prompt에 레이아웃 보존 규칙을 포함한다.
4. 결과를 기존 final design PATCH API로 저장한다.

### Phase 4. 품질 검증

1. 동일한 LO-FI로 최종 디자인을 여러 번 생성한다.
2. 섹션 순서, CTA 위치, 주요 블록 수, 콘텐츠 그룹을 비교한다.
3. 허용 가능한 변경과 금지할 변경을 정의한다.
4. 필요하면 Vision 기반 layout similarity 평가를 추가한다.

## 10. 완료 기준 제안

- final worker payload에서 Confirmed LO-FI 이미지 접근이 가능하다.
- 최종 모델 요청에 LO-FI가 실제 image input으로 포함된다.
- 최종 결과가 LO-FI의 섹션 순서를 유지한다.
- 주요 CTA의 위치 영역이 유지된다.
- 필수 콘텐츠 그룹이 임의로 분리되거나 합쳐지지 않는다.
- final design row에 사용한 `confirmedDraftId`, prompt, model metadata가 남는다.
- 동일 입력 반복 생성 시 구조 편차가 합의된 기준 안에 들어온다.

## 11. 논의 및 결정 필요 사항

1. Cloud n8n에 별도의 `final_design` worker가 현재 존재하는가?
2. 해당 worker가 `confirmedDraftId`로 DB/API를 다시 조회하고 있는가?
3. 현재 Gemini 호출 방식이 reference/input image를 지원하는가?
4. private Blob 이미지를 n8n에 전달할 때 proxy URL과 직접 다운로드 중 어느 방식을 사용할 것인가?
5. `image_execution`을 유지할 것인가, `final_design` prompt type을 분리할 것인가?
6. LO-FI에서 최종 디자인으로 변경해도 되는 범위를 어디까지 허용할 것인가?
7. 레이아웃 유사도를 수동 검수할 것인가, 자동 평가를 추가할 것인가?
8. final generation의 temperature를 별도로 낮출 필요가 있는가?

## 12. 제안 결론

현재 문제는 이미지 모델 자체보다 생성 파이프라인의 입력 계약 부족이 주원인이다.

Confirm Draft를 단순 선택 기록이 아니라 최종 디자인의 구조 승인 단계로 만들려면 Confirm된 LO-FI 이미지를 최종 모델의 실제 reference input으로 전달해야 한다. 동시에 `final_design` 단계를 신규 디자인 생성이 아닌 layout-preserving polish 단계로 정의해야 한다.

Prompt 문구만 보강하는 방식으로는 충분하지 않으며, API payload, final 전용 prompt, n8n image input 연결, 결과 검증 기준을 함께 수정하는 방향이 필요하다.
