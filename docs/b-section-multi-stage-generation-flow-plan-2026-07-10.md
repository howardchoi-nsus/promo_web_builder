# B Section Multi-Stage Generation Flow Plan - 2026-07-10

## Purpose

This document records the recommended direction for this week's milestone:

```text
Design concept selection
-> promo content input
-> generated design result
```

The recommendation is to stop treating the B section's design generation button as a legacy direct UI-image generation action, and instead connect it to the newer multi-stage generation pipeline.

## Current Issue

When the user enters a request in the B section and clicks the current design generation button, the UI eventually shows generation failure.

The observed route is:

```text
B section UI Design Generation
-> POST /api/generate-ui-design
-> promo_ui_design worker
```

Production worker settings currently show:

```text
integrated_brief: configured / active
lofi_draft: configured / active
final_design: configured / active
promo_ui_design: not configured / inactive
```

Therefore, the current failure is expected for the legacy direct-generation path. The B section is calling a worker stage that is not currently configured.

## Recommendation

Use option B:

```text
Switch the B section from legacy promo_ui_design generation
to the new multi-stage generation flow.
```

The flow should be:

```text
Design concept selection
-> Promo content input
-> Integrated Brief generation
-> LO-FI Draft generation
-> LO-FI Draft review / selection
-> Final Design generation
-> Final result review
```

This aligns the B section with the worker chain that has already been validated:

```text
integrated_brief
-> lofi_draft
-> final_design
```

## Why Not Restore promo_ui_design First

The `promo_ui_design` route is a legacy direct generation flow:

```text
/api/generate-ui-design
```

That route remains useful as a compatibility path, but it does not match the current product direction:

- It skips LO-FI draft review.
- It does not support human confirmation before final generation.
- It does not naturally preserve multiple draft/final variants.
- It does not reflect the newer run-based generation state model.

For this week's goal, restoring `promo_ui_design` would spend effort on a path that is not the target user flow.

## Target User Flow

### B1. Design Concept Selection

The user selects a design concept before generation starts.

Initial implementation can use the existing Design MD selection or a simple selected concept state. Later, this can be replaced or extended by the AI Design Recommendation workflow.

Expected state:

```text
selectedDesignConcept
```

### B2. Promo Content Input

The user enters the actual promotion content:

```text
title
offer
CTA
market / region
terms
section-level content
```

This content becomes the input snapshot for the generation run.

### B3. Multi-Stage Design Generation

The B section generation button should start or continue the run-based generation flow:

```text
1. Prepare / create generation run
2. Trigger Integrated Brief worker
3. Trigger LO-FI Draft worker
4. Show LO-FI draft preview
5. Confirm selected LO-FI draft
6. Trigger Final Design worker
7. Show final image result
```

## UI Recommendation

Use a detail modal for review and variant handling.

```text
Results table row
-> Open detail modal
```

Modal layout:

```text
Top: run summary
Left: LO-FI draft gallery
Right: selected LO-FI draft and latest final design comparison
Bottom: final design history for the selected draft
```

This keeps the main results table compact while giving enough space for draft/final comparison.

## Data Behavior

The backend model already supports the needed append-only behavior.

LO-FI drafts are preserved:

```text
promo_generation_lofi_drafts
draft_attempt
draft_image_url
confirmed_at
```

Final designs are preserved:

```text
promo_generation_final_designs
confirmed_draft_id
final_image_url
```

Important rule:

```text
Do not overwrite previous LO-FI drafts.
Do not overwrite previous final designs.
```

The UI should use `confirmedDraftId` to group final images under the LO-FI draft that produced them.

## Button Semantics

Draft selection alone should not trigger paid worker/API work.

Recommended behavior:

```text
User selects a ready LO-FI draft
-> UI updates selected draft preview only
-> User clicks generate button
-> app confirms selected draft
-> app queues final design generation
```

Suggested labels:

```text
No final exists:
선택 초안으로 최종 이미지 생성

Final exists for selected draft:
선택 초안으로 최종 이미지 다시 생성

Different draft selected:
선택 초안 변경 후 최종 이미지 생성
```

## Stale / Queued Rows

During the 2026-07-10 n8n debugging session, several final design rows remained queued because older executions were created while the n8n workflow had disconnected nodes or stale active snapshots.

Known queued rows from the test run:

```text
7ebb6d48-ea38-4370-922c-e93ce397aa03
38d29209-1aae-4d0d-bbab-4bcf54f6b81d
593c8099-626c-4661-9666-4e8dcd9acee7
e1bdec34-5693-45ee-9041-43d841d8e41a
edf10c4c-6103-4716-a916-e6d82b5b333f
```

Known ready final designs:

```text
893061e8-1382-4cf9-b9ed-da858326783c
4dac5537-26ad-4856-987f-e31ce330406b
```

UI rule:

```text
Stale queued rows should remain visible for debugging/history,
but they should not block new final generation for the selected draft.
```

Only an active queued/running final job for the currently selected draft should disable the generate button. Stale queued jobs should not.

## Implementation Tasks

### Task 1. Replace B Section Generation Action

Change the B section design generation action from:

```text
POST /api/generate-ui-design
```

to the run-based multi-stage APIs.

No backend model change should be required for the first pass.

### Task 2. Connect Integrated Brief Generation

Use:

```text
POST /api/promo-generation-integrated-brief
triggerWorker = true
```

The UI should poll:

```text
GET /api/promo-generation-runs?runId=...
```

until the integrated brief is ready or failed/stale.

### Task 3. Connect LO-FI Draft Generation

Use:

```text
POST /api/promo-generation-lofi-drafts
triggerWorker = true
```

Show LO-FI draft previews through:

```text
GET /api/promo-generation-lofi-draft-image?draftId=...
```

### Task 4. Add LO-FI Draft Review / Selection

Show all ready LO-FI drafts for a run.

Default selection:

```text
confirmed draft
else latest ready draft
```

Selection should be client state until the user explicitly generates final design.

### Task 5. Confirm Draft And Queue Final Design

On final generation:

```text
POST /api/promo-generation-lofi-draft-confirm
POST /api/promo-generation-final-designs
triggerWorker = true
```

### Task 6. Add Final Design Preview And History

Show latest ready final design for the selected draft.

Use:

```text
GET /api/promo-generation-final-design-image?finalDesignId=...
```

Also show older final variants for the same `confirmedDraftId`.

### Task 7. Handle Stale Queued Rows

The UI should distinguish:

```text
active queued/running
stale queued
ready
failed
trigger_failed
```

Stale queued rows should not globally block generation.

## Validation Checklist

### Worker Settings

Confirm:

```text
integrated_brief configured / active
lofi_draft configured / active
final_design configured / active
```

The `promo_ui_design` worker is not required for the recommended B-section flow.

### E2E Test

Run one full browser test:

```text
B section input
-> generate integrated brief
-> generate LO-FI draft
-> preview LO-FI image
-> confirm selected LO-FI draft
-> generate final design
-> preview final image
```

### Regression Check

Ensure:

```text
previous drafts remain visible
previous final images remain visible
new final design records correct confirmedDraftId
stale queued rows do not block new generation
```

## Risks

### 1. UI Complexity

The B section will stop being a simple direct-generation form and become an orchestrated workflow UI. Keep the first implementation focused:

```text
one run detail modal
one selected draft
one generate/regenerate action
```

### 2. Old Queued Rows

Old queued rows can confuse users if shown without context. They should be labeled as stale when applicable.

### 3. Design Concept Data Model

The AI Design Recommendation workflow proposes a future `promo_generation_design_concepts` table. That should not block the first B-section flow conversion. Initial implementation can pass the currently selected Design MD / concept context into the existing run input.

### 4. n8n Secret Hygiene

The exported final design worker JSON contained an OpenAI API key in plain text. Move API keys into n8n Credentials and rotate exposed keys before treating the workflow as production-safe.

## Conclusion

The recommended direction is:

```text
Do not invest in restoring promo_ui_design as the primary B-section path.
Convert the B section to the validated multi-stage pipeline:
integrated_brief -> lofi_draft -> final_design.
```

This better supports the week's milestone:

```text
design concept selection
-> generated design result
```

and it preserves the product requirements for review, confirmation, variant history, and append-only generated assets.
