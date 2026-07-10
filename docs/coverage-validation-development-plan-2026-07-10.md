# Coverage Validation Development Plan - 2026-07-10

## Purpose

This development plan turns the LO-FI promo content coverage requirement into implementation tasks.

Primary requirement:

```text
When generating a LO-FI draft, all user-entered promo content must be reflected.
```

Related root issue:

```text
Integrated Brief is the compression step and single source of truth for downstream image generation.
If it loses source information, LO-FI and Final Design will also lose that information.
```

This is the same root cause as the 2026-07-04 Design MD token fidelity issue. The implementation should treat both as one broader coverage-validation system:

```text
promo-content coverage
design-token coverage
```

This plan focuses on promo-content coverage first, while leaving hooks for design-token coverage.

## Current System Baseline

Current flow:

```text
B section input
-> promo_generation_runs.input_snapshot
-> /api/promo-generation-prepare
-> Design Prompt MD + Section Input Log MD
-> Integrated Brief
-> LO-FI Draft
```

Current source of truth for LO-FI:

```text
Integrated Brief
```

Current LO-FI prompt variables:

```text
integratedDesignBriefMarkdown
sectionContentMapping
```

Current structural validation:

```text
validateIntegratedBrief-style checks
including 6000+ character markdown minimum
```

Important distinction:

```text
Existing length / structure validation remains.
Coverage validation is additive.
```

The old validation answers:

```text
Is the Integrated Brief structurally plausible?
```

The new validation answers:

```text
Did the Integrated Brief preserve required source content and mappings?
```

## Target Architecture

Authoritative validation must run on the API server, not only in n8n.

Primary target:

```text
api/promo-generation-integrated-brief.js
PATCH completion flow
```

Reason:

```text
The server owns stored run state.
The server can reload run.input_snapshot.
The server decides whether the Integrated Brief is ready enough for LO-FI generation.
```

n8n may still compute debug information, but n8n should not be the only trusted coverage gate.

## Failure Policy

Fatal promo-content coverage failure should mark the Integrated Brief as failed.

Recommended behavior:

```text
PATCH /api/promo-generation-integrated-brief
-> parse worker result
-> run baseline structural validation
-> run coverage validation
-> if fatal coverage missing:
     store integrated brief status = failed
     store run.status = integrated_brief_failed
     store error_message with missing source fields
-> else:
     store integrated brief status = ready
```

This aligns with the existing LO-FI gate:

```text
api/promo-generation-lofi-drafts.js
requires Integrated Brief status ready/completed before queueing LO-FI.
```

Warning coverage issues should not block LO-FI, but should be stored in metadata for UI/debug display.

## Coverage Model

### Promo-Content Coverage

Source:

```text
promo_generation_runs.input_snapshot
Section Input Log MD
```

Target:

```text
integratedBriefMarkdown
integratedBriefJson.sectionContentMapping
integratedBriefJson.finalImagePromptInputs.visibleCopy
integratedBriefJson.finalImagePromptInputs.contentCoverage
```

Critical source fields:

```text
promo.title
promo.leadText
promo.subline
promo.ctaLabel
promo.alphaText
promo.termsText
simpleBrief.mainOffer
simpleBrief.secondaryMessage
simpleBrief.targetAction
sectionInputs.heroBanner
sectionInputs.stepBar
sectionInputs.contentCta
sectionInputs.imageTextRow
sectionInputs.titleDescription
sectionInputs.footer
```

### Design-Token Coverage

Not required for the first implementation, but the validator should be designed so the same result shape can later support:

Source:

```text
Design Prompt MD
selected Design MD token data
```

Target:

```text
MD Compliance Map
Design Token Application
Token-to-Section Application
Visual Direction
```

## Result Shape

Add a reusable coverage result shape:

```json
{
  "ok": true,
  "fatal": [],
  "warnings": [],
  "checks": [
    {
      "category": "promo_content",
      "sourcePath": "promo.title",
      "required": true,
      "status": "pass",
      "targetPath": "finalImagePromptInputs.visibleCopy.hero",
      "message": ""
    }
  ]
}
```

Use the same shape later for design-token coverage:

```json
{
  "category": "design_token",
  "sourcePath": "md.designData.normalizedSchema.tokens.color",
  "required": true,
  "status": "warning",
  "targetPath": "mdComplianceMap",
  "message": "Primary color token is weakly represented."
}
```

## Implementation Tasks

### Task 1. Add Server-Side Coverage Helper

Create a server-side helper module.

Suggested file:

```text
api/_coverage-validation.js
```

Responsibilities:

```text
extract required promo content from run.input_snapshot
extract target coverage surfaces from Integrated Brief markdown/json
compare source fields to target coverage
return fatal/warning/pass result shape
```

Suggested exports:

```text
validateIntegratedBriefCoverage({ inputSnapshot, integratedBriefMarkdown, integratedBriefJson })
extractPromoContentRequirements(inputSnapshot)
```

### Task 2. Wire Coverage Validation Into Integrated Brief PATCH

Update:

```text
api/promo-generation-integrated-brief.js
```

In the PATCH completion path:

```text
1. resolve run
2. parse incoming Integrated Brief markdown/json
3. run existing structural validation
4. reload/use run.input_snapshot
5. run coverage validation
6. store ready or failed based on fatal result
```

Important:

```text
Do not trust n8n-provided source payload for validation.
Use run.input_snapshot from DB.
```

### Task 3. Persist Coverage Metadata

Store coverage result in one of:

```text
prompt_meta.coverageValidation
or model_meta.coverageValidation
```

Recommended:

```text
prompt_meta.coverageValidation
```

Reason:

```text
Coverage validation evaluates prompt/source preservation, not model runtime behavior.
```

If fatal:

```text
integrated_briefs.status = failed
integrated_briefs.error_message = "Integrated Brief content coverage failed: ..."
promo_generation_runs.status = integrated_brief_failed
promo_generation_runs.error_message = same summary
```

If warning only:

```text
integrated_briefs.status = ready
prompt_meta.coverageValidation.warnings = [...]
```

### Task 4. Strengthen Integrated Brief Prompt

Update repository default prompt:

```text
prompts/promo-integrated-design-brief-generation.md
```

Add explicit requirements:

```text
All user-entered visible content must be represented.
Do not summarize away CTA, legal, offer, step, footer, or visible section copy.
Each required visible source item must appear in finalImagePromptInputs.visibleCopy or finalImagePromptInputs.contentCoverage.
```

Operational note:

```text
Prompt templates are DB-managed after first import.
Updating the repository default is not enough for production if an active DB prompt already exists.
The Admin Page active integrated_brief prompt must also be updated or re-activated.
```

### Task 5. Add requiredVisibleCopy To LO-FI Prompt

Update repository default prompt config:

```text
api/_prompt-template-store.js
PROMPT_TYPES.lofi_draft
```

Add optional variable:

```text
requiredVisibleCopy
```

Add prompt block:

```text
Required Exact Visible Copy:
{{requiredVisibleCopy}}
```

Operational note:

```text
Because prompt templates are DB-managed, update the active DB lofi_draft prompt through Admin Page as well.
Do not assume repository default changes will overwrite active admin-edited prompts.
```

### Task 6. Update LO-FI n8n Worker Variables

In LO-FI worker prompt render node:

```text
POST /api/prompts-render
type = lofi_draft
```

Pass:

```json
{
  "integratedDesignBriefMarkdown": "...",
  "sectionContentMapping": "...",
  "requiredVisibleCopy": "..."
}
```

Suggested extraction:

```text
requiredVisibleCopy =
  integratedBrief.integratedBriefJson.finalImagePromptInputs.visibleCopy
  or integratedBrief.integratedBriefJson.requiredVisibleCopy
  or integratedBrief.integratedBriefJson.requiredExactVisibleCopy
```

### Task 7. Add UI / Debug Display

When coverage validation creates warnings or fatal errors, expose them in the generation status area or detail modal.

First-pass display:

```text
Integrated Brief coverage failed
missing promo.ctaLabel
missing promo.termsText
```

Warnings can be shown in debug/detail area:

```text
Market guidance weakly represented.
Long legal text compressed but represented.
```

## Validation Rules

### Fatal Missing Content

Fatal if any of these required fields are present in source but missing from target coverage:

```text
promo.title
promo.ctaLabel
promo.termsText
simpleBrief.mainOffer
visible sectionInputs content for enabled sections
```

### Warning Weak Coverage

Warning if:

```text
marketVisualGuidance is only weakly represented
CTA URL is not visually represented but CTA intent is present
long legal copy is compressed but a legal/terms area is preserved
supporting copy is present only in markdown but absent from structured contentCoverage
```

## Testing Plan

### Unit-Level Checks

Add fixture-style tests or scriptable checks for:

```text
source field extraction
target coverage extraction
fatal missing title
fatal missing CTA
fatal missing terms
warning weak market guidance
pass with all required coverage
```

### API-Level Checks

Use a real B-section payload:

```text
create generation run
prepare prompt inputs
complete Integrated Brief with full coverage
verify status ready
complete Integrated Brief with missing CTA/terms
verify status failed
```

### E2E Checks

Browser flow:

```text
B section input
-> Integrated Brief
-> LO-FI Draft
-> LO-FI preview
```

Expected:

```text
LO-FI contains visible allocation for every enabled section.
Hero reflects the actual offer.
CTA exists.
Legal/footer area exists.
No hidden section appears.
```

## Migration / Deployment Notes

No DB schema change is required for the first pass if coverage result is stored inside:

```text
prompt_meta
```

Deployment steps:

```text
1. Deploy server helper and Integrated Brief PATCH validation.
2. Update repository default prompts.
3. Update active DB prompts in Admin Page.
4. Update LO-FI n8n workflow prompt variables.
5. Run one real-input E2E test.
```

## Open Questions

### 1. Exact Match vs Semantic Match

First pass should avoid full semantic scoring. Use deterministic coverage:

```text
exact / normalized match for short copy
section-key presence for long blocks
structured contentCoverage presence for source paths
```

Semantic validation can be added later.

### 2. Design-Token Coverage Timing

Design-token coverage should use the same result shape, but can be implemented after promo-content coverage.

Suggested later categories:

```text
color token coverage
typography token coverage
spacing/radius/depth coverage
component pattern coverage
layout pattern coverage
```

### 3. Existing Queued Rows

Existing queued test rows from prior n8n workflow issues should not block this work.

They should be treated as historical stale rows unless a separate cleanup/admin action is implemented.

## Acceptance Criteria

This work is complete when:

```text
1. Integrated Brief completion fails when critical promo content is omitted.
2. Existing 6000+ character / structural checks still run.
3. Coverage validation uses DB run.input_snapshot as source.
4. LO-FI prompt receives requiredVisibleCopy.
5. Active DB lofi_draft prompt uses requiredVisibleCopy.
6. LO-FI n8n worker passes requiredVisibleCopy to /api/prompts-render.
7. A real B-section input produces a LO-FI draft that visibly allocates all required promo content.
```

## Recommended Implementation Order

```text
P0. Server-side coverage helper.
P1. Integrated Brief PATCH coverage gate.
P2. Integrated Brief prompt strengthening.
P3. LO-FI prompt requiredVisibleCopy support.
P4. LO-FI n8n variable update.
P5. UI/debug display.
P6. Design-token coverage extension.
```

## Conclusion

The immediate fix is not only a prompt tweak.

The reliable solution is:

```text
server-side coverage validation
+ active prompt updates
+ LO-FI prompt variable expansion
+ n8n variable propagation
```

This ensures that LO-FI generation does not silently proceed from an Integrated Brief that has lost user-entered promo content.
