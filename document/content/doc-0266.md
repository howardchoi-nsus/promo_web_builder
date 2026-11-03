# Next Development Plan: Worker Integration - 2026-07-08

## Purpose

This document defines the next development plan after validating the runId-based generation API foundation.

The API/DB skeleton has been verified through Postman:

```text
run creation
run status lookup
integrated brief queue/ready update
LO-FI draft attempt creation
LO-FI draft retry accumulation
draft confirmation
final design queue/ready update
```

The next goal is to connect actual n8n workers and the Promo page UI flow.

## Current Status

### Completed Foundation

The following foundation is in place:

- generation run state model
- integrated brief stage state
- LO-FI draft attempt state
- draft confirmation state
- final design stage state
- prompt model settings in Prompt Management
- `lofi_draft` prompt type
- prompt render response with provider/model metadata

### Not Yet Connected

The following are not yet connected:

- actual n8n Integrated Brief Worker
- actual n8n LO-FI Draft Worker
- actual n8n Final Design Worker
- Promo page polling UI
- real image generation result persistence
- model provider branching in n8n

## Key Principle

Do not return to the old long synchronous flow.

The correct flow is:

```text
Web creates runId
Web starts one worker stage
Worker updates status/result
Web polls status by runId
User decides the next action
```

## Target End-to-End Flow

```text
1. User clicks Start Generation
2. Web creates generation run
3. Web starts Integrated Brief Worker
4. Promo page polls run status
5. Integrated Brief Worker stores ready/failed result
6. User starts LO-FI Draft
7. LO-FI Draft Worker creates draft attempt
8. User retries or confirms draft
9. User starts Final Design
10. Final Design Worker stores final result
```

## Development Phase 1: Worker Trigger API

### Task 1. Add Worker Trigger URLs

Add environment-based worker URLs:

```text
N8N_INTEGRATED_BRIEF_WORKER_URL
N8N_LOFI_DRAFT_WORKER_URL
N8N_FINAL_DESIGN_WORKER_URL
```

Purpose:

```text
Web API can start each n8n worker without hardcoding URLs.
```

### Task 2. Add Worker Trigger Helper

Create a shared helper for calling n8n workers.

Responsibilities:

- validate worker URL
- apply allowlist rule if needed
- send a consistent worker payload
- return accepted response
- do not wait for full worker completion

Required worker payload:

```json
{
  "runId": "...",
  "runKey": "...",
  "stage": "integrated_brief | lofi_draft | final_design",
  "taskId": "optional stage-specific id"
}
```

Important:

```text
All workers should receive runId, runKey, and stage.
Stage-specific ids such as draftId or finalDesignId should be added, not used as replacements.
```

### Task 3. Extend Stage Queue APIs

Extend these APIs to optionally trigger workers:

```text
POST /api/promo-generation-integrated-brief
POST /api/promo-generation-lofi-drafts
POST /api/promo-generation-final-designs
```

Recommended request option:

```json
{
  "runId": "...",
  "triggerWorker": true
}
```

Behavior:

```text
create queued state
call worker webhook
return accepted
```

## Development Phase 2: Integrated Brief Worker

### Task 4. Build n8n Integrated Brief Worker

Input:

```json
{
  "runId": "...",
  "runKey": "...",
  "stage": "integrated_brief"
}
```

Worker steps:

```text
1. Load run state from Web API
2. Render integrated_brief prompt through /api/prompts-render
3. Read provider/model metadata
4. Call GPT or Gemini
5. Validate/normalize result
6. PATCH /api/promo-generation-integrated-brief
7. Return worker status
```

### Task 5. Integrated Brief Validation

Validation must check:

- integrated brief exists
- B section content is reflected
- visible section order exists
- legal/footer copy exists when provided
- design token/default token context exists
- final image prompt inputs exist

Failure behavior:

```text
PATCH status = failed
store errorMessage
do not continue to LO-FI draft
```

## Development Phase 3: LO-FI Draft Worker

### Task 6. Build n8n LO-FI Draft Worker

Input:

```json
{
  "runId": "...",
  "runKey": "...",
  "draftId": "...",
  "stage": "lofi_draft"
}
```

Worker steps:

```text
1. Load run state
2. Confirm integrated brief is ready
3. Render lofi_draft prompt through /api/prompts-render
4. Call image model
5. Store image or return image URL
6. PATCH /api/promo-generation-lofi-drafts
```

### Task 7. Draft Retry Support

Each retry must:

```text
reuse the same integrated brief
create a new draft attempt
not overwrite previous draft attempts
```

## Development Phase 4: Draft Confirmation and Final Worker

### Task 8. Confirm Draft UI/API Link

Promo page should call:

```text
POST /api/promo-generation-lofi-draft-confirm
```

After confirmation:

```text
run.status = lofi_draft_confirmed
confirmedDraft is visible in status response
```

### Task 9. Build n8n Final Design Worker

Input:

```json
{
  "runId": "...",
  "runKey": "...",
  "finalDesignId": "...",
  "stage": "final_design"
}
```

Worker steps:

```text
1. Load run state
2. Confirm integrated brief is ready
3. Confirm confirmed draft exists
4. Render image_execution prompt through /api/prompts-render
5. Call final image model
6. Store final image or return image URL
7. PATCH /api/promo-generation-final-designs
```

Important:

```text
Integrated brief is source of truth.
Confirmed draft is layout/reference guidance.
Do not ask another LLM to reinterpret the brief.
```

## Development Phase 5: Promo Page UI

### Task 10. Add Run State UI

Promo page should show stage status:

```text
Created
Generating Integrated Brief
Integrated Brief Ready
Generating LO-FI Draft
LO-FI Draft Ready
Draft Confirmed
Generating Final Design
Final Design Ready
Failed
```

### Task 11. Add Polling

After starting a run or worker stage:

```text
poll GET /api/promo-generation-runs?runId=...
```

Recommended interval:

```text
3-5 seconds
```

Stop polling when:

```text
stage ready
stage failed
final design ready
user leaves generation flow
```

### Task 11-1. Add Polling Stale Timeout

Polling must also stop when the worker never updates the status.

Recommended stale rules:

```text
integrated_brief: stale after 6 minutes
lofi_draft: stale after 4 minutes
final_design: stale after 6 minutes
```

When stale:

```text
stop polling
show timeout/stale message
allow retry for the current stage
keep the runId and previous completed stage results
```

The frontend should not keep polling forever.

Recommended UI copy:

```text
This step is taking longer than expected. Please check the worker status or retry this stage.
```

### Task 12. Add LO-FI Draft Review UI

UI should show:

- current draft image
- draft attempt number
- previous draft attempts
- retry button
- confirm button
- confirmed badge

### Task 13. Add Final Design Action

After draft confirmation:

```text
show Generate Final Design button
```

Do not show final design action before draft confirmation unless bypass is explicitly added later.

## Development Phase 6: Result Persistence

### Task 14. Store Real Image Assets

Current test used placeholder URLs.

Next step:

```text
worker receives image output
worker stores image through existing asset API or new stage-specific asset API
worker PATCHes result with final image URL
```

### Task 15. Trace Metadata

Every stage should keep:

```text
promptId
promptType
promptVersion
promptHash
renderedPromptHash
provider
model
modelOptions
stageDuration
errorMessage
```

## Expected Issues

### Issue 1. n8n Worker Completion vs Web API Timeout

Worker trigger API must not wait for the worker to finish.

Expected behavior:

```text
Web API returns accepted after worker trigger
worker updates result later
```

Frontend polling must also have a stale timeout so the user is not left in an infinite loading state.

### Issue 2. Provider Branching

GPT and Gemini response shapes differ.

Mitigation:

```text
n8n branches by provider
validation API normalizes result
```

### Issue 3. Image Storage

Image model may return:

```text
URL
base64
binary data
```

Need one standard worker-to-Web persistence contract.

### Issue 4. User Edits Promo Input Mid-Flow

If input changes after integrated brief generation:

```text
old integrated brief and drafts should be marked outdated
new run or regenerated brief is required
```

### Issue 5. Multiple Draft Attempts

Need UI clarity.

Risk:

```text
user may confirm the wrong draft attempt
```

Mitigation:

```text
show attempt number and thumbnail clearly
```

## Recommended Implementation Order

```text
1. Add worker trigger helper and env URL handling
2. Standardize worker payload: runId, runKey, stage, taskId
3. Add polling stale timeout rules
4. Extend stage queue APIs with triggerWorker option
5. Build Integrated Brief Worker in n8n
6. Test integrated brief async flow
7. Build LO-FI Draft Worker in n8n
8. Test draft retry/confirm flow
9. Build Final Design Worker in n8n
10. Add Promo page polling UI
11. Connect real image storage
12. Run full end-to-end generation test
```

## Acceptance Criteria

This next phase is complete when:

- Web creates `runId` and returns quickly.
- Integrated Brief Worker runs outside the browser request.
- LO-FI Draft Worker creates draft attempts from stored brief.
- Draft retry creates a new attempt.
- Draft confirmation controls final generation eligibility.
- Final Design Worker generates/stores final result.
- Promo page polls status and shows stage progress.
- Prompt Management model settings are used by n8n workers.
