# Standalone Promo Wizard Development Plan - 2026-07-10

## Decision Status

Status:

```text
Final adopted direction for the next implementation pass.
```

This document supersedes the earlier design request:

```text
docs/claude/promo-builder-wizard-design-request-2026-07-10.md
```

Superseded direction:

```text
Keep the wizard inside the same SPA as an A+B integrated 3-step wizard tab,
and move C into a separate generated-history tab.
```

Adopted direction:

```text
Keep the restored promo builder page as-is.
Create a standalone full-page promo wizard.
```

Reason for the decision:

```text
The in-SPA / tab-based wizard still mixes long-running generation workflow state
with the existing A/B/C promo builder surface.

The standalone page keeps the current builder stable and gives the wizard enough
space for concept selection, full content review, polling, draft selection,
final generation, retry, and resume behavior.
```

Related rollback:

```text
c069526 Implement B section 4-step generation wizard
-> reverted by 5057b24 Revert B section 4-step wizard changes
```

## Purpose

This document defines the corrected development plan for the promo generation wizard.

Confirmed direction:

```text
Do not embed the 4-step wizard inside the existing B section modal.
Keep the current promo builder page restored.
Build the 4-step wizard as a standalone page or standalone app view.
```

The previous B-section wizard implementation was reverted by:

```text
5057b24 Revert B section 4-step wizard changes
```

Reason:

```text
The wizard is a long-running generation workflow.
It needs full-page space for concept selection, content review, LO-FI review, final preview, polling, retry, and history.
The existing B section should remain the current promo page / builder surface, not become the wizard container.
```

## Baseline State

Current baseline after rollback:

```text
prototype/index.html
-> Existing A/B/C promo builder page is restored.
-> B section still uses the existing 3-step modal flow.
-> B3 calls generateUiDesign().

prototype/app.js
-> generateUiDesign() still calls triggerN8n().
-> triggerN8n() still posts to /api/generate-ui-design.
-> Existing C section run / LO-FI / final history helpers remain.
```

Known limitation of baseline:

```text
/api/generate-ui-design belongs to the legacy promo_ui_design path.
If promo_ui_design worker is inactive, B3 direct generation can still fail.
```

This limitation should not be solved by re-embedding the staged wizard into B. It should be solved by adding a separate wizard entry path.

## Target Product Structure

### Current Promo Builder Page

Keep:

```text
prototype/index.html
prototype/app.js
prototype/styles.css
```

Responsibilities:

```text
Design MD selection
Promo input / section config
Existing generated result list
History and debugging actions
Navigation entry to standalone wizard
```

Do not:

```text
Do not add the 4-step wizard panels inside the B section modal.
Do not make currentBuilderStep range from 1 to 4 in the existing B modal.
Do not replace the main page layout with wizard-only state.
```

### Standalone Wizard Page

Preferred first implementation:

```text
prototype/promo-wizard.html
prototype/promo-wizard.js
prototype/promo-wizard.css
```

Non-adopted option:

```text
SPA view: currentView === "wizard"
```

Decision:

```text
Do not use this option for the first implementation.
Use a new standalone HTML page.
```

Reason:

```text
The current prototype is already dense and stateful.
A separate page avoids mixing long-running wizard state into the existing A/B/C page.
It also reduces regression risk for the restored promo builder page.
If helper duplication becomes painful later, extract shared helper modules without moving
the wizard back into the main SPA.
```

## Wizard Flow

The standalone wizard has 4 full-page steps:

```text
Step 1. Design Concept Selection
Step 2. Promo Content Input
Step 3. LO-FI Draft Selection
Step 4. Final Design Result
```

### Step 1. Design Concept Selection

Purpose:

```text
Select the visual direction before generation starts.
```

Initial data source:

```text
Existing Design MD documents
Existing selected design detail API / loader
```

Expected state:

```text
selectedDocumentId
selectedDocument
selectedDesignDetail
designMode
styleSourceLabel
```

Acceptance criteria:

```text
User can select a Design MD / concept.
Selected concept is included in the generation payload.
User cannot continue without a valid concept.
```

### Step 2. Promo Content Input

Purpose:

```text
Collect all promo content that must be reflected in the output.
```

Required source coverage:

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
sectionInputs.*
sectionConfig.*
market / template / terms
```

Important rule:

```text
Do not reduce this step to only title / offer / CTA.
```

The LO-FI requirement remains:

```text
All user-entered promo content must be reflected in the LO-FI draft.
```

Acceptance criteria:

```text
Client-side validation blocks missing required promo content.
The payload uses the same input contract as buildGeneratedPayload().
All sectionInputs and sectionConfig are preserved.
```

### Step 3. LO-FI Draft Selection

Purpose:

```text
Create and review LO-FI draft candidates before final generation.
```

Flow:

```text
POST /api/promo-generation-runs
-> POST /api/promo-generation-integrated-brief
-> poll GET /api/promo-generation-runs?runId=...
-> when integratedBrief.status is ready/completed:
     POST /api/promo-generation-lofi-drafts
-> poll until LO-FI draft is ready/completed
-> render draft gallery
-> user selects a draft
-> POST /api/promo-generation-lofi-draft-confirm
```

Important UX rule:

```text
Selecting a draft does not trigger final generation.
Final generation requires an explicit user action.
```

Acceptance criteria:

```text
User can see all drafts for the run.
User can select one ready draft.
User can confirm the selected draft.
Retry creates a new draft attempt instead of overwriting older attempts.
```

### Step 4. Final Design Result

Purpose:

```text
Generate and review the final design from the confirmed LO-FI draft.
```

Flow:

```text
Require confirmedDraft.draftId
-> POST /api/promo-generation-final-designs
-> poll GET /api/promo-generation-runs?runId=...
-> show final image preview
-> allow regeneration for the selected / confirmed draft
```

Final design request:

```json
{
  "runId": "...",
  "confirmedDraftId": "...",
  "triggerWorker": true
}
```

Acceptance criteria:

```text
Final design is grouped by confirmedDraftId.
Only active final jobs for the selected/confirmed draft block regeneration.
Stale queued rows do not block new final generation.
Older final variants remain visible.
```

## Page Entry And Exit

### Entry From Current Promo Builder

Add a lightweight entry point to the existing page:

```text
Open Promo Wizard
```

Implementation options:

```text
<a href="promo-wizard.html">Open Promo Wizard</a>
```

or:

```text
button click -> window.location.href = "promo-wizard.html"
```

Do not:

```text
Do not move the existing B modal contents into the wizard.
Do not depend on the B modal being open.
```

### Resume Existing Run

Support query params:

```text
promo-wizard.html?runId=...
promo-wizard.html?runKey=...
```

Behavior:

```text
Load GET /api/promo-generation-runs?runId=...
Set wizard step based on run state.
```

Suggested state mapping:

```text
no run -> Step 1
run accepted/created -> Step 2 or Step 3
integrated_brief queued/running -> Step 3
lofi_draft queued/running/ready -> Step 3
confirmedDraft exists -> Step 4
finalDesign ready -> Step 4
```

### Exit Back To Current Page

Provide:

```text
Back to Builder
View Results
```

Expected target:

```text
index.html
```

If possible:

```text
index.html?runId=...
```

The first implementation may simply return to `index.html` and let the C section list refresh.

## Code Organization

### Avoid Direct Copy If Possible

The current app has useful logic:

```text
buildGeneratedPayload()
validatePromoInputs()
validateSectionConfig()
generationRunStateToPage()
applyGenerationRunStateToPage()
currentLofiDraft()
confirmLofiDraft()
retryLofiDraft()
generateFinalDesign()
```

But these methods currently live inside `prototype/app.js`.

Recommended incremental approach:

```text
Phase 1: Copy only the minimum needed helpers into promo-wizard.js to prove the page flow.
Phase 2: Extract shared helpers into a common browser module if duplication becomes painful.
```

Avoid a large shared-module refactor in the same pass as the new page.

### Possible Shared Module Later

Future candidate:

```text
prototype/promo-generation-client.js
```

Responsibilities:

```text
fetchJson()
createGenerationRun()
queueIntegratedBrief()
queueLofiDraft()
confirmLofiDraft()
queueFinalDesign()
loadGenerationRunState()
image URL builders
```

Do not block the first wizard page on this extraction.

## API Contract

### Create Run

```text
POST /api/promo-generation-runs
body: { runKey, payload }
```

### Queue Integrated Brief

```text
POST /api/promo-generation-integrated-brief
body: { runId, triggerWorker: true }
```

### Queue LO-FI Draft

```text
POST /api/promo-generation-lofi-drafts
body: { runId, triggerWorker: true }
```

Constraint:

```text
Integrated Brief must be ready/completed unless force is used for debugging.
```

### Confirm LO-FI Draft

```text
POST /api/promo-generation-lofi-draft-confirm
body: { draftId }
```

### Queue Final Design

```text
POST /api/promo-generation-final-designs
body: { runId, confirmedDraftId, triggerWorker: true }
```

Constraint:

```text
confirmedDraftId must belong to the same run.
confirmedDraftId must already be confirmed unless force is used for debugging.
```

### Poll Run State

```text
GET /api/promo-generation-runs?runId=...
```

## UI Requirements

### Layout

Use a full-page wizard layout:

```text
Top: stepper and run status
Main: current step content
Side or bottom: compact run summary / selected concept / selected draft
Footer: previous / next / primary action
```

Do not use a modal for the main wizard.

### Step 3 LO-FI Gallery

Required elements:

```text
Draft thumbnail
Attempt number
Status
Error message if failed
Selected state
Confirmed state
Retry action
```

### Step 4 Final Result

Required elements:

```text
Selected / confirmed LO-FI preview
Latest final image preview
Final status
Final generation / regeneration button
Final variant history for the selected draft
```

### Long-Running States

Show:

```text
queued
running / generating
ready
failed
trigger_failed
stale
```

Stale behavior:

```text
Stale jobs are visible for debugging.
Stale final jobs should not block a new final generation for the selected draft.
```

## Rollback Guardrails

Do not reintroduce these patterns:

```text
dialog.builder-modal as the main 4-step wizard container
currentBuilderStep === 4 inside the existing B modal
activeWizardRunId inside the existing main app unless it is only for navigation
startWizardLofiFlow wired to the existing B3 UI button
```

The existing B3 button may remain legacy for now:

```text
generateUiDesign()
-> triggerN8n()
-> /api/generate-ui-design
```

That legacy path is not the target wizard path.

## Coverage Validation Requirements

This section preserves the requirements from the deleted planning documents:

```text
docs/coverage-validation-development-plan-2026-07-10.md
docs/lofi-promo-content-coverage-plan-2026-07-10.md
```

Those documents were deleted as part of reverting the previous B-section wizard implementation, but the requirement itself is still active.

Primary requirement:

```text
When generating a LO-FI draft, all user-entered promo content must be reflected.
```

Root issue:

```text
Integrated Brief is the compression step and the downstream source of truth.
If Integrated Brief loses promo content, LO-FI and Final Design cannot recover it.
```

This is the same broader class of issue as the earlier Design MD token fidelity loss:

```text
coverage validation
-> promo-content coverage
-> design-token coverage
```

For this wizard implementation, promo-content coverage is required first. Design-token coverage should remain compatible with the same validation shape but does not need to block the first standalone wizard pass.

### Existing Structural Validation Relationship

Existing Integrated Brief validation includes structural checks such as a markdown length threshold.

Rule:

```text
Do not replace existing structural validation.
Add coverage validation after structural validation.
```

Structural validation answers:

```text
Is the Integrated Brief structurally plausible?
```

Coverage validation answers:

```text
Did the Integrated Brief preserve required source content and mappings?
```

### Authoritative Validation Location

Authoritative coverage validation should run server-side:

```text
api/promo-generation-integrated-brief.js
PATCH completion flow
```

Reason:

```text
The API server owns run state.
The API server can reload promo_generation_runs.input_snapshot.
The API server decides whether Integrated Brief is ready enough for LO-FI generation.
```

n8n may produce debug metadata, but n8n should not be the only trusted coverage gate.

### Coverage Source Fields

Required source fields include:

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
promotionInput.purpose
promotionInput.targetCustomer
promotionInput.campaignTone
sectionInputs.heroBanner
sectionInputs.stepBar
sectionInputs.contentCta
sectionInputs.imageTextRow
sectionInputs.titleDescription
sectionInputs.footer
sectionConfig.visibleSections
templateRuntime.orderedSections
marketVisualGuidance
```

### Coverage Target Surfaces

Validation should inspect:

```text
integratedBriefMarkdown
integratedBriefJson.sectionContentMapping
integratedBriefJson.finalImagePromptInputs.visibleCopy
integratedBriefJson.finalImagePromptInputs.contentCoverage
```

### Failure Policy

Fatal coverage failure:

```text
Mark Integrated Brief failed.
Set run status to integrated_brief_failed.
Store missing source fields in error_message / metadata.
Block LO-FI generation through the existing Integrated Brief ready gate.
```

Warning coverage issue:

```text
Do not block LO-FI.
Store warning metadata for UI / debugging.
```

### Suggested Helper

Add later:

```text
api/_coverage-validation.js
```

Suggested exports:

```text
validateIntegratedBriefCoverage({
  inputSnapshot,
  integratedBriefMarkdown,
  integratedBriefJson
})

extractPromoContentRequirements(inputSnapshot)
```

Suggested result shape:

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

### Wizard-Specific Coverage UI

The standalone wizard should surface coverage issues where useful:

```text
Step 2: client-side missing required content
Step 3: Integrated Brief coverage failure before LO-FI
Step 3 / debug panel: coverage warnings, if present
```

Definition of Done addition:

```text
LO-FI draft generation cannot proceed from an Integrated Brief that fatally drops required promo content.
```

## Implementation Tasks

### Task 1. Add Standalone Wizard Files

Create:

```text
prototype/promo-wizard.html
prototype/promo-wizard.js
prototype/promo-wizard.css
```

First pass can reuse the same Vue CDN / app style already used by the prototype.

### Task 2. Add Navigation Entry

Update:

```text
prototype/index.html
```

Add a simple link/button:

```text
Open Promo Wizard
```

This should navigate to:

```text
promo-wizard.html
```

### Task 3. Implement Step 1 Concept Selection

Reuse current Design MD list / selected document loading patterns.

Acceptance:

```text
Selected concept is available to payload builder.
Cannot continue without a ready MD.
```

### Task 4. Implement Step 2 Promo Content Input

Reuse or mirror:

```text
promo
simpleBrief
sectionInputs
sectionConfig
buildGeneratedPayload()
```

Acceptance:

```text
Payload includes full promo content and section content.
```

### Task 5. Implement Staged Run Orchestration

Implement:

```text
create run
queue integrated brief
poll integrated brief
queue LO-FI draft
poll LO-FI draft
```

Acceptance:

```text
One ready LO-FI draft can be created from the wizard page.
```

### Task 6. Implement Draft Selection / Confirmation

Implement:

```text
draft gallery
selected draft state
confirm selected draft
retry draft
```

Acceptance:

```text
Confirmed draft is persisted by /api/promo-generation-lofi-draft-confirm.
```

### Task 7. Implement Final Design Step

Implement:

```text
queue final design
poll final result
render final preview
render final history by confirmedDraftId
```

Acceptance:

```text
Final image is generated and visible from the wizard page.
```

### Task 8. Add Resume / Refresh Behavior

Implement:

```text
promo-wizard.html?runId=...
manual refresh
poll active run
step inference from run state
```

Acceptance:

```text
User can reload the wizard page without losing the run.
```

## Testing Plan

### Static Checks

```text
node --check prototype/promo-wizard.js
node --check prototype/app.js
node --check prototype/generated.js
```

### UI Smoke Test

```text
Open index.html
Confirm existing B page still works as before
Click Open Promo Wizard
Confirm promo-wizard.html loads
Move through Step 1 and Step 2 validation
```

### API E2E Test

```text
Create run
Queue Integrated Brief
Poll until ready
Queue LO-FI Draft
Poll until ready
Confirm draft
Queue Final Design
Poll until ready
View final image
```

### Regression Checks

```text
Existing C section result list still loads.
Existing generated run history still displays.
Existing B modal no longer contains 4-step wizard changes.
Legacy /api/generate-ui-design path remains isolated from standalone wizard.
```

## Risks

### Risk 1. Helper Duplication

The standalone page may duplicate payload-building logic from `prototype/app.js`.

Mitigation:

```text
Allow limited duplication in the first pass.
Extract shared browser helpers only after the standalone flow works.
```

### Risk 2. Payload Drift

If the wizard payload differs from `buildGeneratedPayload()`, Integrated Brief / LO-FI coverage can regress.

Mitigation:

```text
Compare wizard payload with existing buildGeneratedPayload() shape.
Keep sectionInputs and sectionConfig intact.
Add a debug JSON preview during development if needed.
```

### Risk 3. Worker Timing

Integrated Brief and image workers can take time and may become stale.

Mitigation:

```text
Poll run state.
Show stale status.
Allow explicit retry where safe.
Do not hide failed worker trigger states.
```

### Risk 4. Existing Page Regression

Changing `index.html` can accidentally reintroduce the modal-wizard problem.

Mitigation:

```text
Only add navigation to promo-wizard.html in the existing page.
Do not add wizard step panels to the existing B modal.
```

## Definition Of Done

The work is done when:

```text
Existing promo builder page remains restored.
Standalone promo wizard page exists.
Wizard is not rendered inside a modal.
Wizard supports 4 steps.
Wizard creates a generation run.
Wizard generates at least one LO-FI draft.
Wizard confirms a selected LO-FI draft.
Wizard generates a final design from the confirmed draft.
Final variants are grouped by confirmedDraftId.
Existing C section history remains usable.
```
