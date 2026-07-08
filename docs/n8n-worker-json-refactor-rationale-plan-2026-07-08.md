# n8n Worker JSON Refactor Rationale and Development Plan - 2026-07-08

## Purpose

This document explains why the n8n workflow JSON must be refactored before meaningful worker testing can continue.

The Web/API foundation for runId-based async generation is already prepared, but the existing n8n workflow is still likely based on the old full synchronous generation flow.

Therefore, testing the current production webhook does not fully validate the new architecture.

## Current Problem

The current Web/API direction is:

```text
Web creates runId
Web queues one stage
Web triggers one worker
n8n worker executes only that stage
worker PATCHes result back to Web/API
Web polls run status
```

However, the existing n8n workflow is still closer to:

```text
Webhook
-> normalize payload
-> build markdown
-> generate integrated brief
-> build image prompt
-> generate final image
-> store result
-> return final response
```

This means the current production webhook may still try to complete the full design generation flow before responding.

That conflicts with the new worker architecture.

## Why Current Webhook Testing Is Limited

Testing the current production webhook can only confirm:

```text
Webhook URL is registered
Webhook can receive a request
Respond to Webhook can return a simple response if configured
```

It cannot confirm:

```text
Integrated Brief Worker is correctly isolated
LO-FI Draft Worker is correctly isolated
Final Design Worker is correctly isolated
runId/runKey/stage payload is handled correctly
worker updates Web/API through PATCH
status polling works end-to-end
```

If the old full workflow is used for worker testing, it may:

- wait too long before responding
- fail inside unrelated downstream image generation nodes
- return no response if a later node fails
- hide whether the new worker payload contract is correct
- recreate the previous 2m20s timeout risk

## Main Reason to Refactor n8n JSON

The n8n workflow must be refactored because the old workflow and the new API architecture have different responsibilities.

### Old Responsibility

```text
n8n does everything in one long request.
```

### New Responsibility

```text
n8n acts as stage-specific workers.
Each worker does one job and reports back.
```

The n8n JSON must match the new worker contract before production webhook testing is meaningful.

## Target n8n Architecture

The old monolithic workflow should be split into three worker workflows:

```text
Worker A: Integrated Brief Worker
Worker B: LO-FI Draft Worker
Worker C: Final Design Worker
```

Each worker should receive the same base payload:

```json
{
  "runId": "...",
  "runKey": "...",
  "stage": "...",
  "taskId": "..."
}
```

Stage-specific fields may be added:

```json
{
  "integratedBriefId": "...",
  "draftId": "...",
  "draftAttempt": 1,
  "finalDesignId": "...",
  "confirmedDraftId": "..."
}
```

## Recommended Refactor Order

Do not refactor all workers at once.

Start with:

```text
Integrated Brief Worker
```

Reason:

- it is the first real generation stage
- LO-FI draft depends on stored integrated brief
- final design depends on confirmed draft
- debugging is simpler when one worker is isolated first

## Integrated Brief Worker Goal

The Integrated Brief Worker should only do this:

```text
Receive worker payload
Load run state from Web/API
Render integrated_brief prompt
Call selected GPT/Gemini model
Parse and validate result
PATCH integrated brief result back to Web/API
Return worker execution status
```

It should not:

```text
Generate LO-FI draft
Generate final image
Store final image
Build final image prompt
Wait for unrelated downstream nodes
```

## Integrated Brief Worker Proposed Flow

```text
1. Webhook: Receive Worker Payload
2. Validate Worker Payload
3. GET Run State
4. POST Prompt Render: integrated_brief
5. IF provider = openai
6. IF provider = google
7. Normalize LLM Response
8. Validate Integrated Brief
9. PATCH Integrated Brief Result
10. Respond to Webhook
```

## Node-Level Plan

### Node 1. Webhook

Receives:

```json
{
  "runId": "...",
  "runKey": "...",
  "stage": "integrated_brief",
  "taskId": "...",
  "integratedBriefId": "..."
}
```

### Node 2. Validate Worker Payload

Checks:

```text
runId exists
runKey exists
stage = integrated_brief
taskId exists
```

If invalid:

```text
PATCH status failed
Respond error
```

### Node 3. GET Run State

Calls:

```text
GET /api/promo-generation-runs?runId={{runId}}
```

Purpose:

```text
Load inputSnapshot
Load run metadata
Confirm run exists
```

### Node 4. Render Integrated Brief Prompt

Calls:

```text
POST /api/prompts-render
```

Required:

```json
{
  "type": "integrated_brief",
  "variables": {
    "runKey": "...",
    "designPromptMarkdown": "...",
    "sectionInputLogMarkdown": "..."
  }
}
```

Note:

If `designPromptMarkdown` and `sectionInputLogMarkdown` are not yet available from run state, a Web/API prepare endpoint may be needed.

This is a key open issue.

### Node 5. Model Branch

Use prompt render response:

```text
provider
model
modelOptions
renderedPrompt
```

Branch:

```text
provider = openai -> OpenAI request
provider = google -> Gemini request
```

### Node 6. Normalize LLM Response

Normalize provider-specific response into:

```json
{
  "integratedDesignBriefMarkdown": "...",
  "integratedDesignBrief": {}
}
```

### Node 7. Validate Integrated Brief

Validation should check:

- markdown exists
- required headings exist
- B section content is reflected
- visible section order exists
- legal/footer copy exists when provided
- final image prompt inputs exist
- no forbidden "refer to source document" phrasing

Recommended direction:

```text
Move this validation into Web/API in the next iteration.
```

For the first worker test, n8n can do minimal validation.

### Node 8. PATCH Integrated Brief Result

Calls:

```text
PATCH /api/promo-generation-integrated-brief
```

Success body:

```json
{
  "runId": "...",
  "status": "ready",
  "integratedBriefMarkdown": "...",
  "integratedBrief": {},
  "promptMeta": {},
  "modelMeta": {}
}
```

Failure body:

```json
{
  "runId": "...",
  "status": "failed",
  "errorMessage": "..."
}
```

### Node 9. Respond to Webhook

Responds:

```json
{
  "ok": true,
  "accepted": true,
  "stage": "integrated_brief",
  "runId": "...",
  "runKey": "..."
}
```

Important:

For long-running work, the response strategy should be decided carefully:

- immediate accepted response is safest
- response after patch completion is easier to debug but may still be slow

For first implementation, use:

```text
Respond after PATCH completion
```

Then move to immediate response + async continuation if the stage is too slow.

Important Web/API trigger rule:

```text
Even if the n8n worker responds after PATCH completion, Web/API must not wait for that long-running worker response.
```

The worker trigger from Web/API should be treated as fire-and-forget:

```text
Web/API creates queued state
Web/API sends worker payload
Web/API waits only for a short trigger acknowledgement or trigger timeout
Web/API returns accepted/error to the browser
Worker later PATCHes ready/failed status
Browser polls run status by runId
```

If Web/API waits for the full n8n worker response while the worker performs LLM generation, the original timeout problem can reappear at the Vercel/API layer.

Therefore, the worker webhook response timing and the Web/API trigger waiting time are separate concerns:

```text
n8n worker may finish after LLM + PATCH for first debugging convenience.
Web/API trigger must not wait for LLM completion.
```

Implementation rule:

```text
Worker trigger helper should wait only for short webhook acceptance, not for the full generation stage.
If n8n cannot acknowledge quickly, refactor n8n to respond immediately and continue execution asynchronously.
```

Implemented trigger acknowledgement timeout:

```text
default: 2 seconds
minimum: 0.5 seconds
maximum: 5 seconds
env override: N8N_WORKER_TRIGGER_ACK_TIMEOUT_MS
request override: triggerTimeoutMs or trigger_timeout_ms
```

If the worker does not acknowledge within this window, Web/API should mark the stage as `trigger_failed`.

## Key Open Issue

The worker needs source markdown:

```text
designPromptMarkdown
sectionInputLogMarkdown
```

Currently, the run state stores `inputSnapshot`, but it may not already store prebuilt markdown.

Therefore one of these is needed:

### Option A. Add Prepare API

Create:

```text
POST /api/promo-generation-prepare
```

Responsibilities:

```text
Load run inputSnapshot
Build Design Prompt MD
Build Section Input Log MD
Return prompt variables for integrated_brief
```

### Option B. Build Markdown in n8n

Use n8n Code nodes to build markdown.

Not recommended long-term because it puts logic back into n8n.

### Recommendation

Use Option A.

The worker should call Web/API to prepare prompt variables instead of rebuilding markdown in n8n.

## Recommended Development Plan

### Phase 1. Prepare API

Add:

```text
POST /api/promo-generation-prepare
```

Input:

```json
{
  "runId": "..."
}
```

Output:

```json
{
  "ok": true,
  "runId": "...",
  "runKey": "...",
  "variables": {
    "runKey": "...",
    "designPromptMarkdown": "...",
    "sectionInputLogMarkdown": "..."
  }
}
```

### Phase 2. Integrated Brief Worker JSON

Create a new n8n workflow JSON:

```text
Promo Integrated Brief Worker
```

Do not modify the old full workflow yet.

### Phase 3. Worker Trigger Test

Test:

```text
POST /api/promo-generation-integrated-brief
triggerWorker: true
```

Expected:

```text
workerTrigger.ok = true
integratedBrief eventually status = ready or failed
run polling shows state change
```

### Phase 4. LO-FI Draft Worker

Only after Integrated Brief Worker is stable, build LO-FI Draft Worker.

### Phase 5. Final Design Worker

Only after draft retry/confirm is stable, build Final Design Worker.

## Why This Solves the Problem

This approach avoids:

- reusing the old monolithic webhook
- waiting for final image generation during integrated brief testing
- debugging unrelated downstream node failures
- reintroducing long synchronous timeout behavior
- confusing worker-stage testing with full workflow testing

It creates a clean boundary:

```text
Web/API owns state, prompt management, preparation, and validation.
n8n owns worker execution and model calls.
```

## Acceptance Criteria

The n8n JSON refactor is ready when:

- Integrated Brief Worker has its own Webhook URL.
- Worker receives `runId`, `runKey`, `stage`, and `taskId`.
- Worker does not call final image generation nodes.
- Worker PATCHes integrated brief result to Web/API.
- Web/API status changes from queued to ready or failed.
- Production webhook test no longer depends on the old full workflow.
