# LO-FI Promo Content Coverage Plan - 2026-07-10

## Purpose

This document defines the plan for the requirement:

```text
When generating a LO-FI draft, all user-entered promo content must be reflected.
```

The goal is not only to pass promo input through the pipeline, but to make content coverage explicit and verifiable before the LO-FI image generation step.

## Current Flow

The current multi-stage generation flow is:

```text
B section input
-> promo_generation_runs.input_snapshot
-> /api/promo-generation-prepare
-> Design Prompt MD + Section Input Log MD
-> Integrated Brief
-> LO-FI Draft
```

LO-FI generation does not directly read the original B-section form values. It uses the generated Integrated Brief as its source of truth.

Current LO-FI prompt inputs:

```text
integratedDesignBriefMarkdown
sectionContentMapping
```

This means all B-section content can be reflected only if the Integrated Brief preserves and maps it correctly.

## Current Strengths

The current payload and markdown assembly already preserve substantial input context.

The stored run snapshot includes:

```text
promo
promotionInput
simpleBrief
marketVisualGuidance
sectionInputs
sectionConfig
template
md / design tokens
```

The Section Input Log MD includes:

```text
Promotion Strategy
Market / Region Context
Promotion Content Contract
Page Composition
Section Content Mapping
Section Visibility / Generation Controls
Raw Payload Snapshot
```

The Integrated Brief prompt already states that Section Input Log MD controls:

```text
visible content
CTA text
legal text
section text
promo metadata
user-composed page structure
selected template input values
```

## Current Risk

The risk is not that the data is unavailable. The risk is that the Integrated Brief LLM can omit, summarize, or under-map some content.

If the Integrated Brief omits content, LO-FI will also omit it because LO-FI uses the Integrated Brief as the only source of truth.

This has the same root cause as the "Design MD token fidelity loss" issue reviewed in `handoff-2026-07-04.md`: the Integrated Brief LLM is the single source-of-truth compression step, so both design tokens and promo text can be lost during summarization. Treat both as one broader coverage-validation problem, with separate check categories for design-token coverage and promo-content coverage.

High-risk content:

```text
promo.title
promo.leadText
promo.subline
promo.ctaLabel
promo.ctaUrl
promo.alphaText
promo.termsText
simpleBrief.mainOffer
simpleBrief.secondaryMessage
simpleBrief.targetAction
simpleBrief.audience
sectionInputs.heroBanner
sectionInputs.stepBar
sectionInputs.contentCta
sectionInputs.imageTextRow
sectionInputs.titleDescription
sectionInputs.footer
```

## Required Product Rule

LO-FI drafts must preserve the user's promo content contract.

The LO-FI image does not need to be polished, but it must show the structure and placement for all required visible promo content.

Rules:

```text
Do not add new promotional copy.
Do not replace specific promo copy with generic text.
Do not omit CTA, legal, footer, steps, offer, or required visible copy.
Do not drop visible sections that are enabled in Page Composition.
Do not render hidden sections.
```

## Recommended Solution

Use a three-part safeguard:

```text
1. Strengthen Integrated Brief content coverage requirements.
2. Pass requiredVisibleCopy into the LO-FI prompt.
3. Add content coverage validation before LO-FI generation is considered safe.
```

## Implementation Plan

### Task 1. Strengthen Integrated Brief Prompt

Update the Integrated Brief generation prompt so that it explicitly requires all user-entered visible promo content to be mapped.

Add or strengthen rules:

```text
All visible content from Section Input Log MD must be carried into Section Content Mapping.
All CTA, legal, footer, step, offer, title, subline, and section copy must be represented.
Do not summarize away user-entered copy.
Do not replace user-entered copy with generic marketing text.
Every required visible content item must appear in finalImagePromptInputs.visibleCopy or finalImagePromptInputs.contentCoverage.
```

Expected output:

```text
integratedBrief.integratedBriefJson.finalImagePromptInputs.visibleCopy
integratedBrief.integratedBriefJson.finalImagePromptInputs.contentCoverage
```

should act as the explicit coverage map for LO-FI and final generation.

### Task 2. Add requiredVisibleCopy To LO-FI Prompt

Current LO-FI prompt variables:

```text
integratedDesignBriefMarkdown
sectionContentMapping
```

Recommended LO-FI prompt variables:

```text
integratedDesignBriefMarkdown
sectionContentMapping
requiredVisibleCopy
```

The LO-FI prompt should include:

```text
Required Exact Visible Copy:
{{requiredVisibleCopy}}
```

Prompt rule:

```text
The wireframe must include placement for every required visible copy item.
If exact text is too small to render fully in the wireframe, preserve the copy intent and visible section placement, but never replace it with unrelated generic text.
```

### Task 3. Update LO-FI n8n Worker Variables

The LO-FI worker should pass these variables when calling:

```text
POST /api/prompts-render
type = lofi_draft
```

Recommended variables:

```text
{
  runKey,
  draftId,
  draftAttempt,
  integratedDesignBriefMarkdown,
  sectionContentMapping,
  requiredVisibleCopy
}
```

Suggested sources:

```text
integratedDesignBriefMarkdown:
  state.integratedBrief.integratedBriefMarkdown

sectionContentMapping:
  state.integratedBrief.integratedBriefJson.sectionContentMapping
  or state.integratedBrief.integratedBriefJson.finalImagePromptInputs.contentCoverage

requiredVisibleCopy:
  state.integratedBrief.integratedBriefJson.finalImagePromptInputs.visibleCopy
  or state.integratedBrief.integratedBriefJson.requiredVisibleCopy
  or state.integratedBrief.integratedBriefJson.requiredExactVisibleCopy
```

### Task 4. Add Coverage Validation

Add a validation step before or during Integrated Brief completion.

Execution location:

```text
API server side, in the Integrated Brief completion path.
Primary target: api/promo-generation-integrated-brief.js PATCH completion flow.
Secondary reusable helper: shared server-side validation helper if the same checks are reused by complete/debug endpoints.
```

Do not place the authoritative validation only inside an n8n Code node. n8n may still compute debug metadata, but the server owns the stored run state and should be the trusted gate for whether an Integrated Brief is complete enough for LO-FI generation.

Relationship to existing validation:

```text
Existing validateIntegratedBrief-style checks, including the 6000+ character markdown minimum, remain baseline structural checks.
Coverage validation is additive and does not replace the length check.
```

The length check answers:

```text
Is the Integrated Brief large and structured enough to be plausible?
```

The new coverage check answers:

```text
Did the Integrated Brief actually preserve the required source content and mappings?
```

The validation should compare important source input strings against:

```text
integratedBriefMarkdown
integratedBriefJson.sectionContentMapping
integratedBriefJson.finalImagePromptInputs.visibleCopy
integratedBriefJson.finalImagePromptInputs.contentCoverage
```

Required check categories:

```text
hero title / offer
CTA label
CTA URL or CTA intent
main offer
secondary message
step content
supporting content sections
terms / legal text
footer content
market / region guidance
```

Validation result should produce:

```text
fatal missing content
warning weak coverage
pass
```

The same validator frame should later support design-token coverage:

```text
promo-content coverage:
  source = Section Input Log / run.input_snapshot
  target = Section Content Mapping / finalImagePromptInputs

design-token coverage:
  source = Design Prompt MD / selected Design MD token data
  target = MD Compliance Map / Design Token Application / Token-to-Section Application
```

### Task 5. Decide Failure Policy

Recommended first-pass policy:

```text
fatal:
  Missing title, CTA label, main offer, legal/terms, or enabled visible section content.

warning:
  Market guidance weakly represented.
  Long legal text compressed but still represented.
  CTA URL not visually rendered but CTA intent preserved.
```

Fatal coverage failure should prevent LO-FI generation or mark Integrated Brief as failed with a clear error message.

Warning should allow generation but be visible in debug/status metadata.

## Proposed Coverage Validator Inputs

Source:

```text
run.input_snapshot
```

Target:

```text
integratedBrief.integratedBriefMarkdown
integratedBrief.integratedBriefJson
```

Important source paths:

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
```

The validator should avoid overly strict exact substring matching for long or translated text. It should support:

```text
exact text match for short labels
normalized text match for punctuation/case
section-level coverage for long blocks
presence of section keys in contentCoverage
```

## Expected UX Behavior

When LO-FI draft is generated successfully:

```text
The draft should visibly allocate space for all enabled sections.
The hero should reflect the actual promotion title / offer.
CTA placement should exist.
Step or participation content should exist if enabled.
Legal / terms / footer content should have a visible area.
Hidden sections should not appear.
```

If coverage validation fails:

```text
Show a clear generation error.
Tell the operator which content was missing.
Do not silently generate a LO-FI draft from incomplete content.
```

Example error:

```text
Integrated Brief content coverage failed:
missing sectionInputs.stepBar[0].title,
missing promo.termsText,
missing promo.ctaLabel
```

## Validation Checklist

Use a real B-section input, not a minimal payload.

Check:

```text
1. inputSnapshot contains all B-section values.
2. Section Input Log MD contains all visible section content.
3. Integrated Brief Markdown includes all required content.
4. integratedBriefJson.finalImagePromptInputs.visibleCopy includes exact/near-exact visible copy.
5. integratedBriefJson.finalImagePromptInputs.contentCoverage maps source fields to output sections.
6. LO-FI prompt receives requiredVisibleCopy.
7. LO-FI image includes section placement for all visible content.
8. Final Design continues to use the confirmed LO-FI structure.
```

## Out Of Scope For First Pass

Do not block first-pass implementation on:

```text
AI Design Recommendation table design
full semantic LLM-based coverage scoring
multi-language legal copy perfection
automatic stale queued cleanup
```

Those can be added later.

## Recommended Priority

Priority order:

```text
P0. Add requiredVisibleCopy to LO-FI prompt and n8n variable payload.
P1. Strengthen Integrated Brief prompt content coverage rules.
P2. Add deterministic coverage validation for critical fields.
P3. Add UI/debug display for missing or weak coverage warnings.
```

## Conclusion

The current pipeline already preserves B-section promo inputs in the run snapshot and Section Input Log MD.

However, LO-FI generation currently depends on the Integrated Brief being complete. To guarantee that all input promo content is reflected in LO-FI drafts, the system needs:

```text
stronger Integrated Brief content mapping
requiredVisibleCopy passed into LO-FI prompt
coverage validation before LO-FI generation
```

This should be treated as a core requirement for the week's milestone because the LO-FI draft is the first visual checkpoint where users can confirm whether their entered promotion content survived the generation pipeline.
