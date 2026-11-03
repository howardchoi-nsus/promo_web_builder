# LO-FI Draft Confirmation Development Plan - 2026-07-08

## Purpose

This document defines the development plan for adding a LO-FI draft confirmation flow to the Promo Web Builder design generation pipeline.

The key goal is to let users quickly review whether promotion information is reflected before requesting the final high-quality design image.

## Core Decision

LO-FI draft generation will not run as an automatic extra step inside the existing final design generation request.

Instead, the generation flow should be split into separate stages:

```text
Integrated Brief Generation
-> LO-FI Draft Generation
-> User Confirmation or Draft Retry
-> Final Design Generation
```

This avoids adding more long-running work to the current synchronous n8n Webhook flow.

## Why This Change Is Needed

The existing handoff notes already identified a timeout risk:

```text
Web request waits for n8n Webhook final response.
n8n Webhook waits until the full workflow is complete.
Web/API can fail around 2 minutes 20 seconds.
```

If LO-FI draft generation is added directly before final image generation, the workflow becomes heavier:

```text
Integrated brief LLM call
+ LO-FI image generation
+ final image generation
```

This would increase timeout risk.

Therefore, the flow must be split so each user action triggers only one heavy task at a time.

## Target User Flow

### Step 1. Generate Integrated Brief

User requests design generation from the Promo page.

System action:

```text
Use promotion input + design token + default token fallback
Generate integrated brief
Store integrated brief
Return brief generation status
```

Output:

```text
runId
integratedBriefId
integratedBriefStatus
```

### Step 2. Generate LO-FI Draft

After the integrated brief is ready, the user requests LO-FI draft generation.

System action:

```text
Load stored integrated brief
Render LO-FI draft prompt
Generate LO-FI draft image
Store draft attempt
Return draft result
```

Output:

```text
draftId
draftAttempt
draftImageUrl
draftStatus
```

### Step 3. User Reviews Draft

The user checks whether the LO-FI draft reflects:

- promotion title
- promotion definition
- selected region/market intent
- section order
- section on/off state
- hero copy
- CTA copy
- step/content copy
- legal/footer copy

The user can choose:

```text
Retry draft
or
Confirm this draft
```

### Step 4A. Retry LO-FI Draft

If the user retries, the system must reuse the same integrated brief.

Important:

```text
Do not regenerate the integrated brief.
Only regenerate the LO-FI draft.
```

Each retry should be saved as a separate draft attempt.

Example:

```text
draftAttempt: 1
draftAttempt: 2
draftAttempt: 3
```

### Step 4B. Confirm LO-FI Draft

If the user confirms a draft, the system records which attempt was confirmed.

Example:

```text
confirmedDraftId
confirmedDraftAttempt
confirmedAt
```

### Step 5. Generate Final Design

After confirmation, the user requests final design generation.

System action:

```text
Load integrated brief
Load confirmed LO-FI draft metadata
Render final image execution prompt
Generate final design image
Store final result
Return final result
```

Important:

```text
Integrated brief remains the source of truth.
Confirmed LO-FI draft is layout/reference guidance.
The final prompt must not reinterpret or summarize the brief again.
```

## Recommended API Structure

### 1. Generate Integrated Brief

```text
POST /api/promo-generation-runs
```

Responsibilities:

- create generation run
- normalize promotion input
- load design MD
- load selected design token
- merge default token fallback
- render integrated brief prompt
- call or prepare n8n integrated brief workflow
- store integrated brief result

### 2. Generate LO-FI Draft

```text
POST /api/promo-generation-runs/:runId/lofi-drafts
```

Responsibilities:

- load stored integrated brief
- render active `lofi_draft` prompt
- generate draft image
- store draft attempt
- return draft metadata

### 3. Confirm LO-FI Draft

```text
POST /api/promo-generation-runs/:runId/lofi-drafts/:draftId/confirm
```

Responsibilities:

- mark selected draft as confirmed
- store confirmed draft attempt
- prevent ambiguous final generation

### 4. Generate Final Design

```text
POST /api/promo-generation-runs/:runId/final-designs
```

Responsibilities:

- verify confirmed draft exists
- load integrated brief
- load confirmed draft metadata
- render active `image_execution` prompt
- generate final image
- store final result

### 5. Get Run Status

```text
GET /api/promo-generation-runs/:runId
```

Responsibilities:

- return current run status
- return integrated brief status
- return draft attempts
- return confirmed draft
- return final result if available

## n8n Workflow Direction

The n8n workflow should be split or staged.

Recommended structure:

```text
Workflow A: Integrated Brief Worker
Workflow B: LO-FI Draft Worker
Workflow C: Final Design Worker
```

This is safer than one long workflow.

### Workflow A: Integrated Brief Worker

```text
Receive request
Call Web/API prepare or prompt render
Call GPT/Gemini
Call Web/API validate integrated brief
Persist integrated brief
Return status
```

### Workflow B: LO-FI Draft Worker

```text
Receive runId
Load integrated brief
Render LO-FI draft prompt
Call image model
Persist draft attempt
Return draft result
```

### Workflow C: Final Design Worker

```text
Receive runId and confirmedDraftId
Load integrated brief
Load confirmed draft metadata
Render final image prompt
Call image model
Persist final result
Return final result
```

## Prompt Management Changes

Model selection must be managed in the Prompt Management page, not the Promo page.

Required prompt types:

```text
integrated_brief
lofi_draft
image_execution
```

Each prompt type should support:

```text
provider
model
temperature
maxTokens
responseFormat
active version
history
archive
```

Recommended model usage:

```text
integrated_brief: GPT or Gemini
lofi_draft: image-capable fast model
image_execution: GPT or Gemini only if text prompt rendering needs LLM
final_design: Gemini Image initially
```

## Data Storage Requirements

### Generation Run

Store:

```text
runId
promoId
designStyleId
status
createdAt
updatedAt
```

### Integrated Brief

Store:

```text
integratedBriefId
runId
integratedBriefMarkdown
integratedBriefJson
promptId
promptVersion
promptHash
provider
model
createdAt
```

### LO-FI Draft Attempt

Store every attempt, not only the latest result.

```text
draftId
runId
draftAttempt
draftImageUrl
draftPrompt
promptId
promptVersion
promptHash
provider
model
status
createdAt
```

### Confirmed Draft

Store:

```text
runId
confirmedDraftId
confirmedDraftAttempt
confirmedAt
```

### Final Design Result

Store:

```text
finalDesignId
runId
confirmedDraftId
finalImageUrl
finalPrompt
promptId
promptVersion
promptHash
provider
model
status
createdAt
```

## UI Requirements

### Promo Page

Promo page should not expose model selection.

Promo page should show generation stages:

```text
1. Generate Integrated Brief
2. Generate LO-FI Draft
3. Retry Draft
4. Confirm Draft
5. Generate Final Design
```

### LO-FI Draft Review UI

Required actions:

```text
Retry Draft
Confirm This Draft
Generate Final Design
```

Recommended display:

- current draft image
- draft attempt number
- previous attempts
- confirmed attempt badge
- generation status
- warning if integrated brief is outdated because promo input changed

### Prompt Management Page

Prompt Management page should manage:

- prompt content
- active prompt version
- prompt history
- archive
- provider
- model
- model options

## Important Rules

### Rule 1. Integrated Brief Is Source of Truth

All draft and final design generation must use the stored integrated brief.

### Rule 2. Draft Retry Must Not Regenerate Brief

Draft retry should only regenerate the LO-FI draft.

### Rule 3. Promo Input Change Invalidates Existing Brief

If the user changes promotion input after the integrated brief is generated:

```text
existing integrated brief becomes outdated
drafts from that brief should not be used for final generation
new integrated brief generation is required
```

### Rule 4. Final Design Requires Confirmed Draft

Final design generation should require a confirmed LO-FI draft, unless an explicit bypass option is added later.

### Rule 5. Draft Attempts Must Be Traceable

Draft attempts should not be overwritten.

The system must know:

```text
which draft attempts were generated
which one was confirmed
which final design came from which confirmed draft
```

## Main Risks

### Risk 1. Initial Brief Generation Still Takes Long

Even after splitting the flow, integrated brief generation can still be slow.

Mitigation:

```text
Move to async request/worker structure.
Return accepted/runId first.
Use polling or status refresh from Web.
```

### Risk 2. Draft Generation Adds Cost

Every draft retry creates an additional image generation call.

Mitigation:

```text
Show attempt count.
Store all attempts.
Optionally limit retry count later.
```

### Risk 3. User Confirms Poor Draft

If the user confirms a weak draft, final result may still be weak.

Mitigation:

```text
Show checklist against B section content before confirmation.
Warn when required content appears missing.
```

### Risk 4. Integrated Brief and Promo Input Drift

If promo input changes after brief generation, old draft/final results may become invalid.

Mitigation:

```text
Store input hash with integrated brief.
Compare current input hash before draft/final generation.
```

## Revised Priority

The previous plan should be reordered.

Correct priority:

```text
1. Split generation into run-based stages
2. Add status storage and runId tracking
3. Add integrated brief generation/storage
4. Add LO-FI draft generation from stored brief
5. Add draft retry history
6. Add draft confirmation
7. Add final design generation from confirmed draft
8. Move long-running stages to async request/worker structure
9. Add model settings in Prompt Management page
10. Add detailed trace and review UI
```

If only one foundation task can be done first, choose:

```text
runId-based generation state management
```

Without this, retry, confirmation, polling, trace, and async worker structure will all be difficult.

## 1st Implementation Scope

Recommended first scope:

```text
Generation run model
Integrated brief storage
LO-FI draft attempt storage
Draft confirmation state
Prompt type lofi_draft
Prompt Management model settings design
Basic API contract for each stage
```

Do not immediately add automatic draft + final generation in one n8n call.

## Acceptance Criteria

This plan is valid when:

- Integrated brief can be generated and stored separately.
- LO-FI draft can be generated from an existing integrated brief.
- Draft retry creates a new attempt without regenerating the brief.
- User can confirm one draft attempt.
- Final design generation uses the confirmed draft and integrated brief.
- The Promo page has no model selector.
- Prompt Management page owns model settings.
- The system can trace which prompt/model/draft attempt produced the final design.

