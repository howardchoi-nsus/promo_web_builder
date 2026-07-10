# B Section 4-Step Wizard Development Plan - 2026-07-10

## Purpose

This document defines the development plan for rebuilding the B section around the 4-step wizard flow.

Confirmed direction:

```text
Step 1. Design Concept Selection
Step 2. Promo Content Input
Step 3. LO-FI Draft Selection
Step 4. Final Design Result
```

The B section should no longer behave as a one-click legacy UI design generation screen. It should become the user-facing controller for the run-based multi-stage pipeline:

```text
integrated_brief
-> lofi_draft
-> final_design
```

## Current Development Issue

The current code still treats the B section wizard as a 3-step flow:

```text
Design mode selection
-> Promo input / section config
-> Design generation
```

Relevant current code:

```text
prototype/app.js
- builderSteps()
- generateUiDesign()
- triggerN8n()

prototype/index.html
- B3 generation console
- UI design generation button
```

Current B3 action still calls:

```text
POST /api/generate-ui-design
```

That route belongs to the legacy `promo_ui_design` worker path. Production worker settings currently target the newer staged workers:

```text
integrated_brief: configured / active
lofi_draft: configured / active
final_design: configured / active
promo_ui_design: not configured / inactive
```

Therefore, the current B section failure is expected until B is rewired to the 4-step staged flow.

## Debug Review Notes

The plan was checked against the current API and prototype code on 2026-07-10. The following corrections are required before implementation:

```text
1. A generation run must be created first with POST /api/promo-generation-runs.
2. Integrated Brief cannot be queued until the UI has a runId.
3. LO-FI Draft cannot be queued until Integrated Brief is ready/completed, unless force is explicitly used for debugging.
4. Final Design endpoint is plural: POST /api/promo-generation-final-designs.
5. Final Design requires a confirmed LO-FI draft from the same run.
6. The current modal DOM only has Step 1, Step 2, and Step 3 panels; Step 4 needs a new panel.
```

These are not optional polish items. They are execution blockers if the plan is implemented literally without the corrections above.

## Target UX Contract

### Step 1. Design Concept Selection

User goal:

```text
Choose the design direction before generation starts.
```

The selected concept must be preserved as an input to Integrated Brief, LO-FI Draft, and Final Design.

Initial implementation may reuse the currently selected Design MD / AI mode / advanced mode state, but the UI label and state should be aligned to "design concept" rather than "direct generation mode".

Expected state:

```text
selectedDesignConcept
selectedDocumentId
selectedDocument
designMode
styleSourceLabel
```

### Step 2. Promo Content Input

User goal:

```text
Enter and review all promo content that must appear in the generated design.
```

This step must not be reduced to only title / offer / CTA. LO-FI generation has a hard requirement:

```text
All user-entered promo content must be reflected.
```

Required source groups:

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

Step 2 should run client-side required-field validation before starting the generation run. Server-side coverage validation is handled separately in the Integrated Brief completion path.

Related plan:

```text
docs/coverage-validation-development-plan-2026-07-10.md
```

### Step 3. LO-FI Draft Selection

User goal:

```text
Generate, review, and select a LO-FI draft.
```

This step should start or continue the staged run:

```text
create/prepare generation run
-> trigger integrated_brief
-> wait until integrated_brief is ready/completed
-> trigger lofi_draft
-> poll generation run state
-> display ready LO-FI drafts
-> select one draft
-> confirm selected draft
```

Important UX rule:

```text
Selecting a LO-FI draft should not trigger paid final-generation work by itself.
```

The user must explicitly click a final-generation action after selecting the draft.

Expected UI elements:

```text
LO-FI draft gallery
selected draft preview
draft status label
retry draft action
confirm selected draft action
```

### Step 4. Final Design Result

User goal:

```text
Generate and review the final design based on the selected LO-FI draft.
```

This step should:

```text
require a confirmed selected LO-FI draft
-> trigger final_design worker
-> poll generation run state
-> display final image result
-> allow regeneration for the selected draft
```

Implementation note:

```text
Step 3 should normally complete draft confirmation before the user advances to Step 4.
Step 4 may offer a defensive "confirm selected draft first" action, but final generation must not call the final API with an unconfirmed draft.
```

Final results must be grouped by the selected / confirmed draft:

```text
finalDesign.confirmedDraftId === selectedDraft.draftId
```

The UI should not treat `finalDesigns[0]` as the only current final design without checking draft association.

## Required Code Changes

### Task 1. Replace 3-Step Builder Definition With 4-Step Wizard

Target:

```text
prototype/app.js -> builderSteps()
```

Change from:

```text
1. Design mode selection
2. Promo input / section config
3. Design generation
```

To:

```text
1. Design concept selection
2. Promo content input
3. LO-FI draft selection
4. Final design result
```

Acceptance criteria:

```text
currentBuilderStep ranges from 1 to 4
step titles match the wizard UX
next/previous navigation does not skip required validation
```

### Task 2. Replace B3 Legacy Generation Action

Targets:

```text
prototype/index.html -> B3 generation console/button
prototype/index.html -> add B4 final result panel
prototype/app.js -> generateUiDesign()
prototype/app.js -> triggerN8n()
```

Current problem:

```text
generateUiDesign()
-> triggerN8n()
-> POST /api/generate-ui-design
```

Required direction:

```text
startGenerationRun()
-> POST /api/promo-generation-runs
-> POST /api/promo-generation-integrated-brief
-> poll GET /api/promo-generation-runs?runId=...
-> when integrated brief is ready, POST /api/promo-generation-lofi-drafts
-> poll until LO-FI draft is ready
```

Implementation note:

The existing `generateUiDesign()` function can either be replaced or retained as a compatibility wrapper, but the B wizard must not call the legacy direct-generation route.

### Task 3. Add Wizard State for Run / Draft / Final Selection

Target:

```text
prototype/app.js data/state helpers
```

Suggested state:

```text
activeWizardRunId
activeWizardPageId
selectedLofiDraftId
selectedFinalDesignId
wizardRunState
wizardPollingTimer
```

The generated page row may still store the canonical run result, but the wizard needs its own active selection state so Step 3 and Step 4 can behave predictably.

Acceptance criteria:

```text
Step 3 can select among multiple LO-FI drafts.
Step 3 confirms the selected draft before Step 4 final generation.
Step 4 uses the selected and confirmed draft.
Changing selected draft does not automatically trigger final generation.
```

### Task 4. Move LO-FI Draft Actions Into B Wizard

Current location:

```text
prototype/index.html -> C section generated pages table
```

Required behavior:

```text
Step 3 displays LO-FI draft cards or thumbnails.
Step 3 provides retry / select / confirm actions.
C section may remain as history, but it should not be the only place to complete the flow.
```

Existing helper methods that can be reused:

```text
currentLofiDraft()
canConfirmLofiDraft()
canRetryLofiDraft()
confirmLofiDraft()
retryLofiDraft()
refreshGenerationRunState()
```

New Step 4 markup is also required:

```text
prototype/index.html
-> add a section rendered when currentBuilderStep === 4
-> show selected / confirmed LO-FI draft summary
-> show final design generation status
-> show final image preview when ready
-> show final regeneration action for the selected draft
```

### Task 5. Make Final Design Selection Draft-Aware

Targets:

```text
prototype/app.js -> applyGenerationRunStateToPage()
prototype/app.js -> canGenerateFinalDesign()
prototype/app.js -> finalDesignActionLabel()
prototype/app.js -> generateFinalDesign()
```

Current issue:

```text
currentFinalDesign = finalDesigns[0]
```

This can show or block on a final design that does not belong to the currently selected draft.

Required rule:

```text
currentFinalDesign should be the latest final design for selected/confirmed draft.
Only active final jobs for the selected/confirmed draft should block final generation.
Stale queued jobs from older disconnected n8n executions should not block new generation.
```

Current server state detail:

```text
loadRunState() returns finalDesigns ordered by created_at desc.
The UI should filter that list by confirmedDraftId before choosing the latest final.
```

### Task 6. Add Step 2 Coverage-Focused Validation

Targets:

```text
prototype/app.js -> validatePromoInputs()
prototype/app.js -> buildGeneratedPayload()
api/promo-generation-integrated-brief.js
api/_coverage-validation.js
```

Client-side Step 2 validation should prevent obviously incomplete input before run creation.

Server-side validation should remain authoritative:

```text
Integrated Brief PATCH completion
-> structural validation
-> promo-content coverage validation
-> ready or failed
```

This prevents LO-FI generation from using an Integrated Brief that dropped required promo content.

### Task 7. Update Labels and Status Messages

Replace legacy labels:

```text
UI 디자인 생성
디자인 생성
n8n UI 디자인 생성
```

With staged wizard labels:

```text
LO-FI 초안 생성
초안 선택
선택 초안 확정
최종 디자인 생성
최종 디자인 재생성
```

Button semantics:

```text
Step 3 primary:
LO-FI 초안 생성 / 초안 재생성 / 선택 초안 확정

Step 4 primary:
선택 초안으로 최종 디자인 생성
선택 초안으로 최종 디자인 다시 생성
```

## API Flow

### Start Step 3

```text
User completes Step 2
-> create payload from buildGeneratedPayload()
-> create/prepare generation run
-> trigger Integrated Brief worker
-> poll run state
-> trigger or wait LO-FI Draft
```

Depending on existing API behavior, the first implementation should use the already available run-based endpoints rather than creating a new backend route unless unavoidable.

Candidate endpoints:

```text
POST /api/promo-generation-runs
POST /api/promo-generation-integrated-brief
GET /api/promo-generation-runs?runId=...
POST /api/promo-generation-lofi-drafts
POST /api/promo-generation-lofi-draft-confirm
POST /api/promo-generation-final-designs
```

### Step 3 Confirm Draft

```text
POST /api/promo-generation-lofi-draft-confirm
body: { draftId }
```

### Step 4 Generate Final

```text
POST /api/promo-generation-final-designs
body: { runId, confirmedDraftId, triggerWorker: true }
```

Current API behavior:

```text
confirmedDraftId must be a valid UUID.
confirmedDraftId must belong to the same run.
confirmedDraftId must already be confirmed, unless force is used for debugging.
```

## Testing Plan

### Local Static / UI Check

```text
Open prototype UI
Start B wizard
Confirm 4 steps render correctly
Confirm previous/next navigation
Confirm labels no longer mention legacy UI generation in the wizard
```

### API Integration Test

```text
Step 1 select concept
Step 2 enter complete promo content
Step 3 generate LO-FI draft
Poll until draft is ready
Select and confirm draft
Step 4 generate final design
Poll until final design is ready
```

### Regression Checks

```text
Generated pages table still loads historical rows.
Existing LO-FI/final history remains visible.
Stale queued final rows do not block selected draft final generation.
Missing required promo content blocks before LO-FI.
Integrated Brief coverage failure blocks LO-FI.
```

## Known Risks

### Risk 1. Wizard State and Generated Page State Diverge

The B wizard will have active in-progress state, while C section stores generated history.

Mitigation:

```text
Use runId as the canonical join key.
After every poll, apply the same generation run state to both wizard state and generated page row.
```

### Risk 2. Multiple LO-FI Drafts / Finals Are Flattened

Current UI helpers prefer a single current draft/final. This is not enough for Step 3/4.

Mitigation:

```text
Add selectedLofiDraftId.
Filter finalDesigns by confirmedDraftId.
Only show selected draft's final history in Step 4.
```

### Risk 3. Source Content Loss Before LO-FI

Integrated Brief is the compression point. If it omits promo content, LO-FI cannot recover it.

Mitigation:

```text
Use coverage validation in Integrated Brief PATCH completion.
Pass required visible copy explicitly to LO-FI prompt variables where needed.
```

### Risk 4. Legacy Route Remains Accidentally Reachable

If B wizard still calls `/api/generate-ui-design`, the user will see the same generation failure.

Mitigation:

```text
Search for generateUiDesign / triggerN8n references.
Ensure wizard buttons call staged generation handlers only.
Keep legacy route only as compatibility, not as wizard default.
```

## Milestone Breakdown

### Milestone 1. Wizard Shell Alignment

```text
4-step builder definition
Step labels
Navigation validation
Remove legacy B3 wording
```

### Milestone 2. Step 3 LO-FI Integration

```text
Create / prepare generation run
Trigger Integrated Brief and LO-FI
Poll run state
Render LO-FI drafts in wizard
Confirm selected draft
```

### Milestone 3. Step 4 Final Integration

```text
Generate final design from selected draft
Poll final status
Render final image
Support selected-draft regeneration
Prevent stale queued rows from blocking
```

### Milestone 4. Coverage Guardrail

```text
Client Step 2 required content validation
Server Integrated Brief coverage validation
LO-FI prompt variable update for required visible copy
```

## Definition of Done

The work is complete when:

```text
B section wizard has 4 steps.
Step 3 no longer calls /api/generate-ui-design.
User can generate at least one LO-FI draft from the wizard.
User can select/confirm a LO-FI draft from the wizard.
User can generate a final design from the selected draft.
Final results are grouped by selected/confirmed draft.
All required promo content is covered before LO-FI generation proceeds.
Historical C section rows still display correctly.
```
