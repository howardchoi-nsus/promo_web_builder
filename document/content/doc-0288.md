# LO-FI Draft And Final Design Variant Review - 2026-07-09

## Purpose

This document captures review items for tomorrow's discussion.

The requested product direction is:

```text
Keep generated LO-FI draft images.
When a final image is generated, show the selected draft and the final image together.
If multiple LO-FI drafts exist, allow the user to select a different draft and generate a new final image from that draft.
Do not overwrite previous drafts or previous final images.
```

No source implementation was performed for this review. This document is only a discussion handoff.

## Current Technical Baseline

The current backend direction already supports most of the requested behavior.

LO-FI drafts are attempt-based and append-only:

```text
promo_generation_lofi_drafts
draft_attempt
draft_image_url
confirmed_at
```

Final designs are also append-only:

```text
promo_generation_final_designs
confirmed_draft_id
final_image_url
```

This means the system can already answer:

```text
Which LO-FI draft was used to generate this final image?
```

The main gap is in the UI/UX layer:

```text
The prototype currently favors the confirmed draft or latest ready draft.
It does not yet provide a clear draft gallery, draft-by-draft final result grouping, or a clean alternate-draft regeneration flow.
```

## Product Behavior To Discuss

### 1. LO-FI Draft Gallery

Show all generated LO-FI drafts for a run.

Each draft should show:

```text
draftAttempt
status
thumbnail through /api/promo-generation-lofi-draft-image
confirmed/current selection state
createdAt/updatedAt if useful
```

Open question:

```text
Should the gallery appear in the results table row, a detail modal, or a dedicated generation detail screen?
```

Recommendation:

```text
Use a detail view/modal for the full comparison.
Keep the table row compact and show only the current preview/status.
```

### 2. Selected Draft And Final Image Pairing

When a user selects a draft, the UI should show:

```text
Left: selected LO-FI draft image
Right: final image generated from that selected draft
```

If more than one final image exists for the selected draft, show a small history/list.

Open question:

```text
Should the latest ready final image for that draft be the default preview?
```

Recommendation:

```text
Yes. Default to latest ready final image for the selected draft, but keep older final variants visible.
```

### 3. Alternate Draft Selection After Final Generation

The user should be allowed to select another ready LO-FI draft even after a final image already exists.

Expected behavior:

```text
User selects another ready draft.
System confirms that draft.
System creates a new final design row using that draftId.
Existing final design rows remain untouched.
```

Important rule:

```text
Changing the selected LO-FI draft must not delete or overwrite any previous final images.
```

### 4. Final Regeneration Semantics

There are two different actions that should not be confused:

```text
Regenerate final from the same selected draft.
Generate final from a newly selected draft.
```

UI copy should make the difference clear.

Possible labels:

```text
이 초안으로 최종 이미지 생성
이 초안으로 최종 이미지 다시 생성
선택 초안 변경 후 최종 이미지 생성
```

Open question:

```text
Should confirming a different draft automatically trigger final generation, or should it only enable a separate generate button?
```

Recommendation:

```text
Use a separate generate button.
Changing draft selection should be reversible and should not spend worker/API cost until the user explicitly requests final generation.
```

## Data Model Review

### Existing Fields That Help

```text
promo_generation_lofi_drafts.id
promo_generation_lofi_drafts.draft_attempt
promo_generation_lofi_drafts.confirmed_at
promo_generation_final_designs.confirmed_draft_id
```

These are enough for a first implementation.

### Avoid Adding

Avoid adding a separate selected draft column to the run table for now.

Reason:

```text
The current confirmation model already keeps at most one confirmed LO-FI draft per run by setting confirmed_at.
Adding another selectedDraftId-style run column could create conflicting sources of truth.
```

### Possible Future Field

If the UI later needs non-committal draft preview selection, consider client-only state first:

```text
selectedLofiDraftId
```

Only persist selection when the user confirms or requests final generation.

## API Review

Existing APIs are mostly sufficient:

```text
POST /api/promo-generation-lofi-draft-confirm
POST /api/promo-generation-final-designs
GET /api/promo-generation-runs
GET /api/promo-generation-lofi-draft-image?draftId=...
GET /api/promo-generation-final-design-image?finalDesignId=...
```

Potential API behavior to verify:

```text
POST /api/promo-generation-final-designs currently requires the draft to be confirmed unless force is used.
```

Recommended user flow:

```text
1. Confirm selected ready draft.
2. Queue final design with confirmedDraftId.
```

This keeps server behavior explicit and prevents generating final images from an accidental unconfirmed draft.

## UI Review

The current prototype chooses preview images roughly in this order:

```text
Final design preview if available.
Otherwise LO-FI draft preview.
```

That is good for a compact result table, but not enough for variant review.

Recommended additions:

```text
Draft gallery/list
Selected draft detail panel
Final designs filtered by selected draft
Status labels per draft and per final design
Clear action buttons for confirm/generate/regenerate
```

Suggested detail layout:

```text
Top: generation run summary
Middle left: LO-FI draft gallery
Middle right: selected draft + final design comparison
Bottom: final design history for selected draft
```

## Edge Cases To Discuss

### Queued Final Jobs

Recent production testing left some final design rows queued while an older row eventually became ready.

The UI should handle:

```text
One selected draft with an active queued final job.
Another selected draft with no final job.
Older final images that are ready.
Stale queued jobs.
```

Recommendation:

```text
Disable final generation only when the selected draft has an active queued/running final job.
Do not globally disable final generation just because another draft has a stale or queued final row.
```

### Stale Jobs

If a final design job is stale:

```text
Show stale status.
Allow retry/regenerate from the same selected draft.
Keep stale row visible for debugging/history.
```

### Multiple Ready Final Images For One Draft

The UI should avoid hiding older variants.

Recommendation:

```text
Default preview: latest ready final image.
History: show previous ready final images for that same confirmedDraftId.
```

## Decision Items For Tomorrow

1. Where should the draft/final comparison UI live?

```text
Inline in results table
Detail modal
Dedicated generation detail screen
```

2. Should draft selection be persisted before final generation?

```text
Option A: Persist only when user confirms/generates.
Option B: Persist selection immediately.
```

Recommendation:

```text
Option A.
```

3. Should changing the selected draft automatically confirm it?

Recommendation:

```text
No. Use explicit confirm/generate action.
```

4. Should final regeneration from the same draft and final generation from another draft use the same button?

Recommendation:

```text
Same backend API, different UI labels based on context.
```

5. Should stale queued final rows block new generation?

Recommendation:

```text
No, not after stale timeout.
```

## Recommended Next Step

For tomorrow, decide the UX shape first:

```text
Detail modal vs dedicated generation detail screen.
```

After that, implementation can focus on UI state and display logic because the backend model already preserves drafts and final designs in the needed append-only shape.
