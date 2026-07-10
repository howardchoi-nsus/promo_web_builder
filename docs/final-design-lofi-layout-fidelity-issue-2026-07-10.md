# Final Design LO-FI Layout Fidelity Issue

Date: 2026-07-10
Status: Issue review / implementation planning
Scope: Standalone Promo Wizard Step 4, final_design n8n worker handoff

## Summary

Step 4에서 생성된 최종 이미지가 Step 3에서 Confirm Draft로 선택한 LO-FI 시안의 레이아웃을 충분히 따르지 않는 문제가 확인되었다.

현재 Step 4 UI는 Confirm Draft ID를 기준으로 `final_design` worker를 호출하지만, worker payload에는 선택된 LO-FI의 실제 레이아웃 근거가 거의 포함되지 않는다. 따라서 final worker가 별도로 DB를 조회해 LO-FI 이미지와 draft prompt를 참조하지 않는 한, 최종 이미지는 Integrated Brief 또는 final worker 내부 prompt만 기준으로 새로 생성될 가능성이 높다.

핵심 원인은 UI 문제가 아니라 **final_design 단계의 입력 계약 부족**이다.

## Current Flow

1. Step 3에서 사용자가 LO-FI 시안 중 하나를 선택한다.
2. `/api/promo-generation-lofi-draft-confirm`가 해당 draft를 `confirmed_at` 상태로 저장한다.
3. Step 4에서 `/api/promo-generation-final-designs`를 호출한다.
4. API는 `promo_generation_final_designs` row를 생성하고 n8n `final_design` worker를 트리거한다.
5. 현재 worker payload에는 주로 다음 값만 포함된다.

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

## Evidence

관련 코드:

- `api/_promo-generation-worker-trigger.js`
  - `buildWorkerPayload()`는 `runId`, `runKey`, `stage`, `taskId`, `extra`만 조립한다.
- `api/promo-generation-final-designs.js`
  - final worker extra에는 `finalDesignId`, `confirmedDraftId`만 들어간다.
  - confirmed draft row 조회도 현재 `id::text`만 가져온다.
- `api/_prompt-template-store.js`
  - 기본 prompt type은 `integrated_brief`, `image_execution`, `lofi_draft`만 있다.
  - `final_design` 전용 prompt type이 없다.
- `n8n/` 로컬 workflow 검색 기준
  - `final_design`, `confirmedDraftId`, `draftImageUrl` 등을 소비하는 workflow 흔적이 확인되지 않았다.

## Root Cause

### 1. Final worker payload가 너무 얇다

`confirmedDraftId`만 전달되면 worker는 "어떤 draft가 선택되었는지"는 알 수 있지만, "그 draft가 어떤 레이아웃인지"는 알 수 없다.

현재 payload에 없는 정보:

- Confirm된 LO-FI 이미지 URL
- Confirm된 LO-FI draft prompt
- draft attempt 번호
- LO-FI 레이아웃을 구조 기준으로 삼으라는 명시 규칙
- 최종 이미지 생성 모델에 reference image로 사용할 수 있는 proxy URL
- Integrated Brief와 Confirm Draft 간의 우선순위 규칙

### 2. final_design 전용 prompt 계약이 없다

`lofi_draft` prompt는 wireframe을 만들도록 지시하지만, final stage에서는 "확정된 LO-FI 레이아웃을 보존하며 polishing하라"는 별도 prompt 계약이 필요하다.

현재 final worker가 `image_execution` 또는 내부 prompt를 사용한다면, 모델은 LO-FI를 구조적 source of truth로 보지 않고 새 레이아웃을 재구성할 수 있다.

### 3. n8n worker가 confirmed draft를 조회/참조하는지 불확실하다

로컬 workflow에는 final worker 분리 구현 흔적이 없다. Cloud n8n에만 반영되어 있을 가능성은 있지만, 현재 repository 기준으로는 final worker가 `confirmedDraftId`를 받아 LO-FI image/prompt를 조회하는지 검증할 수 없다.

## Impact

- 사용자가 Step 3에서 선택한 LO-FI 시안의 의미가 약해진다.
- "Confirm Draft"가 최종 디자인의 구조 승인 단계로 기능하지 못한다.
- 같은 콘텐츠라도 final image가 다른 섹션 순서, CTA 위치, visual hierarchy로 생성될 수 있다.
- 사용자는 LO-FI 승인 후에도 최종 디자인 결과를 신뢰하기 어렵다.

## Recommended Fix

### Task 1. final design API에서 confirmed draft 정보를 확장 조회

`api/promo-generation-final-designs.js`에서 confirmed draft row 조회 시 `id`만 가져오지 말고 아래 필드를 함께 조회한다.

Required fields:

- `id`
- `draft_attempt`
- `draft_image_url`
- `draft_prompt`
- `prompt_meta`
- `model_meta`
- `confirmed_at`

### Task 2. worker payload에 confirmedDraft 객체 포함

`buildWorkerPayload()` extra에 아래 구조를 추가한다.

```json
{
  "confirmedDraft": {
    "draftId": "...",
    "draftAttempt": 2,
    "draftImageUrl": "...",
    "draftImageProxyUrl": "/api/promo-generation-lofi-draft-image?draftId=...",
    "draftPrompt": "...",
    "promptMeta": {},
    "confirmedAt": "..."
  },
  "layoutFidelityPolicy": {
    "sourceOfTruth": "confirmed_lofi_draft",
    "preserveSectionOrder": true,
    "preserveRelativePlacement": true,
    "preserveCtaPosition": true,
    "allowPolishOnly": true
  }
}
```

주의: n8n이 외부에서 접근해야 하므로 `draftImageProxyUrl`은 상대 경로가 아니라 absolute URL이 필요할 수 있다. Vercel 환경에서는 request host 기반 URL 생성 또는 public app URL 환경변수를 사용한다.

### Task 3. final_design prompt type 추가

`api/_prompt-template-store.js`에 `final_design` prompt type을 추가한다.

Prompt 핵심 규칙:

- Confirmed LO-FI draft is the structural source of truth.
- Preserve section order, relative layout, CTA location, content grouping, visual hierarchy.
- Convert low-fidelity wireframe into polished final design.
- Do not invent a new layout.
- Do not move major sections unless required to prevent overlap.
- Integrated Brief supplies design tokens/content constraints, but LO-FI controls layout structure.

### Task 4. n8n final worker에서 LO-FI image를 reference로 사용

final worker는 payload의 `confirmedDraft.draftImageUrl` 또는 `draftImageProxyUrl`을 읽어 image model에 reference image/input image로 전달해야 한다.

필수 동작:

- finalDesignId 기준으로 callback PATCH 대상 유지
- confirmedDraft image를 다운로드 또는 image input으로 연결
- final prompt에 layout fidelity rules 포함
- 생성 완료 후 `/api/promo-generation-final-designs` PATCH 호출

### Task 5. 검증 항목 추가

최소 검증:

- final worker payload에 `confirmedDraft.draftImageUrl`이 포함되는지 확인
- final worker payload에 `layoutFidelityPolicy.sourceOfTruth = confirmed_lofi_draft`가 포함되는지 확인
- final image 생성 후 `confirmedDraftId`가 final design row에 보존되는지 확인
- LO-FI와 final image 간 섹션 순서가 유지되는지 수동 비교

향후 자동화 가능 항목:

- LLM/Vision 기반 layout similarity score
- 섹션 순서 OCR/vision 체크
- CTA 위치 quadrant 비교
- major block count 비교

## Proposed Implementation Order

1. `api/promo-generation-final-designs.js`에서 confirmed draft query 확장
2. final worker payload에 `confirmedDraft`와 `layoutFidelityPolicy` 추가
3. `final_design` prompt type 추가
4. n8n final worker가 confirmed LO-FI image를 reference input으로 사용하도록 수정
5. Step 4에서 payload/debug metadata를 확인할 수 있는 최소 표시 또는 로그 추가
6. 실제 run으로 LO-FI와 final image layout 비교 테스트

## Open Questions

- Cloud n8n에 이미 `final_design` 전용 worker가 존재하는가?
- final worker가 현재 `confirmedDraftId`를 받아 DB/API를 다시 조회하고 있는가?
- 이미지 생성 모델이 reference image input을 지원하는 방식은 무엇인가?
- final worker가 DB prompt template을 사용할 것인가, n8n 내부 prompt를 유지할 것인가?
- final result에서 LO-FI layout fidelity를 어느 정도까지 강제할 것인가?

## Decision Recommendation

최종 디자인은 Integrated Brief만으로 재생성하지 말고, **Confirmed LO-FI Draft를 구조적 source of truth로 승격**해야 한다.

권장 우선순위:

1. Layout structure: Confirmed LO-FI Draft
2. Content coverage: B Section content / Integrated Brief
3. Visual tokens and style: A Section Design MD / Integrated Brief
4. Polish/detail generation: final_design worker

이 우선순위를 명시하지 않으면 final worker는 매번 "새 디자인 생성"으로 동작할 수 있고, Confirm Draft 단계의 제품적 의미가 약해진다.
