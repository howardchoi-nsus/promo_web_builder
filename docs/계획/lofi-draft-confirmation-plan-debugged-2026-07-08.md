# LO-FI Draft Confirmation Plan - Debugged Version - 2026-07-08

> This document supersedes the earlier architecture planning documents created on 2026-07-08:
> `n8n-web-harness-refactor-plan-2026-07-08.md`,
> `development-plan-debug-review-2026-07-08.md`, and
> `lofi-draft-confirmation-development-plan-2026-07-08.md`.
> Use this document as the latest direction unless a newer handoff or plan explicitly replaces it.

## Purpose

This document is the debugged version of the LO-FI draft confirmation development plan.

It reflects the key correction:

```text
Async request/worker structure must come before LO-FI draft expansion.
```

The previous LO-FI direction was valid, but the execution order needed to be corrected because the existing n8n Webhook flow already has a timeout risk.

## Main Conclusion

LO-FI draft confirmation is a good product flow.

However, it should not be added into the current synchronous Webhook flow.

The correct foundation is:

```text
runId-based generation state
accepted response
worker execution
status polling
then LO-FI draft generation
```

## Problem Found During Debugging

The earlier plan placed async request/worker conversion too late.

Previous priority:

```text
1. Split generation into run-based stages
2. Add status storage and runId tracking
3. Add integrated brief generation/storage
4. Add LO-FI draft generation from stored brief
5. Add draft retry history
6. Add draft confirmation
7. Add final design generation from confirmed draft
8. Move long-running stages to async request/worker structure
```

Issue:

```text
Async conversion is listed after LO-FI draft and final design generation.
```

This is risky because integrated brief generation and image generation are already long-running tasks.

## Timeout Context

The previous handoff identified this structure:

```text
Web calls API.
API waits for n8n Webhook final response.
n8n waits until the whole workflow finishes.
Web/API can fail around 2 minutes 20 seconds.
```

If LO-FI draft is added before solving this:

```text
integrated brief LLM call
+ LO-FI image generation
+ final image generation
```

the timeout risk increases.

## Corrected Principle

Each user action should trigger only one heavy task.

Recommended split:

```text
Action 1: Start run
Action 2: Generate integrated brief
Action 3: Generate LO-FI draft
Action 4: Retry or confirm draft
Action 5: Generate final design
```

Each long-running task should be tracked by status, not by keeping the browser request open until completion.

## Corrected Target Flow

### Step 1. Create Generation Run

User starts generation from Promo page.

System should:

```text
create runId
store initial input snapshot/hash
return accepted immediately
```

Output:

```text
runId
status: created or accepted
```

This step should not wait for LLM or image generation.

### Step 2. Generate Integrated Brief

System starts an integrated brief worker.

Worker should:

```text
load run input
load design MD
load selected design token
merge default token fallback
render integrated_brief prompt
call selected GPT/Gemini model
validate integrated brief
store integrated brief
update run status
```

The browser should poll status by runId.

### Step 3. Generate LO-FI Draft

After integrated brief is ready, the user or system requests LO-FI draft generation.

Worker should:

```text
load stored integrated brief
render lofi_draft prompt
call image model
store draft attempt
update draft status
```

Important:

```text
LO-FI draft generation should also be treated as a worker task.
```

It should not block the browser request until image generation is complete.

### Step 4. Retry or Confirm Draft

User reviews the draft.

Actions:

```text
Retry Draft
Confirm This Draft
```

Retry rule:

```text
reuse existing integrated brief
create a new draft attempt
do not regenerate integrated brief
```

Confirm rule:

```text
store confirmedDraftId
store confirmedDraftAttempt
```

### Step 5. Generate Final Design

After draft confirmation, user requests final design generation.

Worker should:

```text
verify confirmed draft exists
load integrated brief
load confirmed draft metadata
render image_execution prompt
call final image model
store final result
update run status
```

Important:

```text
Integrated brief remains the source of truth.
Confirmed LO-FI draft is layout/reference guidance.
Final prompt should not reinterpret the brief.
```

## Corrected API Direction

The previous API plan allowed `POST /api/promo-generation-runs` to do too much.

Corrected direction:

```text
POST /api/promo-generation-runs
```

Should only:

```text
create runId
store input snapshot
return accepted
```

It should not:

```text
wait for integrated brief generation
wait for n8n final response
wait for image generation
```

## Recommended API Contracts

### 1. Create Run

```text
POST /api/promo-generation-runs
```

Responsibility:

```text
create run
store input snapshot/hash
return runId immediately
```

### 2. Start Integrated Brief Worker

```text
POST /api/promo-generation-runs/{runId}/integrated-brief
```

Responsibility:

```text
start integrated brief generation
return accepted
```

Implementation note:

In Vercel serverless API structure, actual endpoint naming may need to use flat routes or request body parameters.

Example:

```text
POST /api/promo-integrated-brief-worker
body: { runId }
```

### 3. Get Run Status

```text
GET /api/promo-generation-runs/{runId}
```

Responsibility:

```text
return run status
return integrated brief status
return draft attempts
return confirmed draft
return final result status
```

### 4. Start LO-FI Draft Worker

```text
POST /api/promo-generation-runs/{runId}/lofi-drafts
```

Responsibility:

```text
start draft attempt
return draftId and accepted status
```

Important:

```text
do not wait for the draft image to complete inside this API response
```

### 5. Confirm LO-FI Draft

```text
POST /api/promo-generation-runs/{runId}/lofi-drafts/{draftId}/confirm
```

Responsibility:

```text
mark draft as confirmed
store confirmed attempt
```

### 6. Start Final Design Worker

```text
POST /api/promo-generation-runs/{runId}/final-designs
```

Responsibility:

```text
verify confirmed draft
start final image generation
return accepted
```

## n8n Workflow Direction

n8n should be split into worker-style workflows.

Recommended:

```text
Workflow A: Integrated Brief Worker
Workflow B: LO-FI Draft Worker
Workflow C: Final Design Worker
```

Each worker should:

```text
receive runId or taskId
load required data from Web/API
call model
call Web/API to persist result
return worker status
```

n8n should not:

```text
hold one Webhook response open until all stages finish
build complex business logic inside Code nodes
decide final prompt structure internally
```

## Prompt Management Requirement

Model selection belongs in the Prompt Management page, not the Promo page.

Required prompt types:

```text
integrated_brief
lofi_draft
image_execution
```

Each active prompt should include:

```text
provider
model
temperature
maxTokens
responseFormat
promptVersion
promptHash
```

The prompt render API should return this metadata so n8n can call the correct model.

## Corrected Priority

The corrected priority is:

```text
1. runId-based generation state model
2. accepted response + status polling structure
3. async request/worker structure
4. Prompt Management model settings
5. integrated brief generation/storage
6. integrated brief validation
7. LO-FI draft generation from stored brief
8. draft retry attempt history
9. draft confirmation
10. final design generation from confirmed draft
11. result trace and review UI
```

Key correction:

```text
Async structure is not step 8.
It is step 2 or 3.
```

## UI Flow

Promo page should remain simple.

Recommended states:

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

Recommended buttons:

```text
Start Generation
Generate LO-FI Draft
Retry Draft
Confirm This Draft
Generate Final Design
```

Model selector should not appear on the Promo page.

## Data Tracking

### Generation Run

Required:

```text
runId
inputHash
status
createdAt
updatedAt
```

### Integrated Brief

Required:

```text
integratedBriefId
runId
inputHash
integratedBriefMarkdown
integratedBriefJson
promptMeta
modelMeta
status
createdAt
```

### LO-FI Draft Attempt

Required:

```text
draftId
runId
draftAttempt
draftImageUrl
draftPrompt
promptMeta
modelMeta
status
createdAt
```

Draft attempts must not be overwritten.

### Confirmed Draft

Required:

```text
runId
confirmedDraftId
confirmedDraftAttempt
confirmedAt
```

### Final Design

Required:

```text
finalDesignId
runId
confirmedDraftId
finalImageUrl
finalPrompt
promptMeta
modelMeta
status
createdAt
```

## Remaining Risks

### 1. Worker Trigger Method

Need to decide how Web/API starts n8n workers.

Options:

```text
Web API calls n8n worker Webhook
n8n request workflow triggers worker workflow
database queue/polling worker
```

Recommended initial approach:

```text
Web API calls stage-specific n8n worker Webhook and immediately returns accepted to browser.
```

### 2. Vercel Serverless Limits

Vercel API should not wait for long-running model calls.

Mitigation:

```text
Use Vercel API for request creation/status/persistence.
Use n8n workers for long-running model calls.
```

### 3. Promo Input Changes

If promotion input changes after integrated brief is created, existing draft/final stages may become invalid.

Mitigation:

```text
store inputHash
compare inputHash before draft/final generation
require new integrated brief if input changed
```

### 4. Draft Retry Cost

Every retry calls the image model again.

Mitigation:

```text
show attempt count
store all attempts
optionally add retry limit later
```

## 1st Implementation Scope

Recommended first implementation scope:

```text
1. generation run table/status model
2. input snapshot/hash storage
3. create-run API returning runId immediately
4. run status API
5. Prompt Management model setting schema/design
6. integrated brief worker contract
7. LO-FI draft worker contract
8. final design worker contract
```

Do not implement automatic draft + final generation in a single n8n request.

## Acceptance Criteria

This corrected plan is acceptable when:

- Browser request does not wait for all generation stages to finish.
- `runId` is created before long-running work starts.
- Integrated brief generation can be tracked by status.
- LO-FI draft generation can be retried without regenerating the brief.
- Draft attempts are stored as history.
- User can confirm one draft attempt.
- Final design generation requires a confirmed draft.
- Prompt Management page owns model settings.
- Promo page has no model selector.
- n8n acts as worker/harness, not as a large logic container.
