# Development Plan Debug Review - 2026-07-08

## Purpose

This document reviews and debugs the current development plan for the Promo Web Builder / n8n workflow refactor.

The goal is to prevent the same issue from recurring: promotion input from section B is only partially reflected in the generated design image.

The direction is:

```text
Web/API = prompt management, model setting, validation, rendering, trace
n8n = AX Agent Harness, workflow execution, model calls, stage gates, result routing
LLM = integrated brief generation and controlled execution only
Image Model = LO-FI draft and final design image generation
```

## Updated Requirement

Model selection should not be added to the Promo generation page.

Model selection must be managed inside the Prompt Management page.

This means:

- Promo page remains simple.
- User inputs promotion information and requests generation.
- Prompt Management page controls which provider/model is used by each prompt type.
- n8n reads the active prompt and model configuration indirectly through Web/API.

## Debug Summary

The previous plan was mostly valid, but several points needed correction.

### 1. Model Selection Location Was Wrong

Previous direction:

```text
Promo page may include model selection.
```

Corrected direction:

```text
Prompt Management page manages model selection per prompt type.
```

Reason:

- Promo page should be used by operators who generate designs.
- Model/provider settings are operational configuration, not promotion input.
- Changing models affects quality, cost, and reproducibility, so it should be managed with prompt history.

Required adjustment:

```text
prompt_templates or related config must store provider/model settings.
Prompt render API must return provider/model metadata.
n8n must use returned provider/model metadata for LLM calls.
```

### 2. n8n Still Has Too Much Logic

Current risk:

```text
n8n Code nodes still perform normalization, prompt assembly, parsing, validation, and image prompt construction.
```

This conflicts with the target architecture.

Corrected direction:

```text
n8n should not decide how to construct prompts or validate business rules.
n8n should call Web/API for preparation, prompt rendering, validation, and persistence.
```

Recommended n8n role:

```text
receive request
call prepare API
call LLM
call validate API
call prompt render API
call image model
call persist API
return result
```

### 3. Image Execution Prompt Is Still a Core Risk

The final image generation stage should not create new interpretation-heavy instructions inside n8n.

Current risk:

```text
Integrated brief is generated correctly,
but final image prompt may reinterpret or reduce the content.
```

Corrected direction:

```text
Final image prompt should be rendered from the integrated brief using a managed prompt template.
It should instruct the image model to follow the integrated brief, not summarize it again.
```

Important principle:

```text
Integrated brief is the source of truth.
Image execution prompt is only an execution instruction.
```

### 4. LO-FI Draft Stage Is Valid, But Must Be Clearly Separated

The LO-FI draft stage is useful before final image generation.

Purpose:

```text
Quickly check whether promotion text, section order, and content hierarchy are reflected.
```

It must not be treated as the final visual design.

Recommended structure:

```text
Integrated Brief
-> LO-FI Draft Prompt Render
-> LO-FI Draft Image Generation
-> Draft Result Save
-> Final Image Prompt Render
-> Final Design Image Generation
```

LO-FI draft should focus on:

- actual promotion text
- section order
- content grouping
- CTA placement
- legal/footer placement
- rough layout hierarchy

LO-FI draft should avoid:

- high-detail visual styling
- decorative illustration
- complex effects
- final brand polish

### 5. B Section Reflection Needs Explicit Validation

The main product issue is not only prompt quality.

The workflow needs explicit checks for whether B section input is carried through each stage.

Required validation points:

```text
B section input
-> promotion input log
-> integrated brief
-> LO-FI draft prompt
-> final image prompt
-> generated result review metadata
```

Minimum required fields to track:

- promotion title
- promotion definition
- selected market/region
- market visual guidance
- visible section list
- section order
- section on/off status
- hero text
- step/bar content
- CTA copy
- content body copy
- legal/terms/footer copy

### 6. Design Token Handling Needs Default Token Merge

Current state:

```text
Selected design token can reference default token through $extends.
```

Known issue:

```text
B section can display inherited token information as a reference,
but full default token merge still needs to be finalized.
```

Required direction:

```text
Selected design token = top priority
Default token = fallback/background
Integrated brief should receive the resolved token context.
```

This prevents missing typography, spacing, radius, or general rule values when the selected token file is partial.

## Corrected Development Plan

## Phase 1: Prompt Management and Model Settings

### Task 1. Add Model Settings to Prompt Management

Add model settings to each prompt type in the Prompt Management page.

Target prompt types:

```text
integrated_brief
image_execution
lofi_draft
```

Recommended fields:

```text
provider
model
temperature
maxTokens
responseFormat
```

Model settings should be saved with prompt update history.

### Task 2. Extend Prompt Render API Response

Prompt render API should return:

```text
renderedPrompt
promptId
promptType
promptVersion
promptHash
provider
model
modelOptions
```

n8n should not hardcode the model when possible.

### Task 3. Keep Promo Page Simple

Do not add model selection to the Promo page.

Promo page should remain focused on:

```text
promotion information input
design style selection
section configuration
generate request
result review
```

## Phase 2: Web/API Logic Separation

### Task 4. Add Generation Prepare API

Recommended API:

```text
POST /api/promo-design-generation-prepare
```

Responsibilities:

- normalize incoming generation request
- load design MD
- load selected design token
- merge default token if needed
- build promotion input log
- build source markdown preview
- render integrated brief prompt
- return LLM request metadata

### Task 5. Add Integrated Brief Validate API

Recommended API:

```text
POST /api/promo-integrated-brief-validate
```

Responsibilities:

- parse GPT/Gemini response
- normalize integrated brief result
- verify required headings/fields
- verify B section content coverage
- verify visible section order
- separate fatal errors and warnings
- return validated integrated brief

### Task 6. Add Image Execution Prompt Render API

Recommended API:

```text
POST /api/promo-image-prompt-render
```

Responsibilities:

- render active `image_execution` prompt
- insert validated integrated brief
- insert required visible copy
- insert negative constraints
- return final image prompt and model metadata

### Task 7. Add LO-FI Draft Prompt Render API

Recommended API:

```text
POST /api/promo-lofi-draft-prompt-render
```

Alternative:

```text
Use /api/prompts-render with promptType = lofi_draft
```

Responsibilities:

- render LO-FI draft prompt
- prioritize text placement and section structure
- avoid final visual polish
- return draft prompt and model metadata

## Phase 3: n8n Harness Refactor

### Task 8. Simplify n8n Workflow

Recommended n8n sequence:

```text
1. Webhook Receive
2. Prepare Generation Request API
3. LLM Generate Integrated Brief
4. Validate Integrated Brief API
5. Render LO-FI Draft Prompt API
6. Generate LO-FI Draft Image
7. Persist LO-FI Draft Result
8. Render Final Image Prompt API
9. Generate Final Design Image
10. Persist Final Result
11. Return Result
```

### Task 9. Add Provider Branching

n8n should branch by provider returned from Web/API.

Example:

```text
provider = openai -> OpenAI request
provider = google -> Gemini request
```

Do not let the Promo page decide the provider.

### Task 10. Add Stage Gates

Each stage should check `ok: true` before moving forward.

Examples:

```text
prepare failed -> stop
integrated brief validation failed -> stop
lofi draft generation failed -> return draft error
final image generation failed -> return final error
persist failed -> return persistence error
```

## Phase 4: Result Trace and Review

### Task 11. Store Prompt and Model Metadata

Each generated result should store:

```text
promptId
promptType
promptVersion
promptHash
provider
model
modelOptions
renderedPromptHash
requestHash
stageDuration
```

### Task 12. Store LO-FI Draft Separately

LO-FI draft result should be stored separately from final design result.

Recommended fields:

```text
draftImageUrl
draftPrompt
draftPromptMeta
draftModelMeta
draftCreatedAt
```

### Task 13. Expand Review UI Later

Result review UI should eventually show:

- integrated brief
- LO-FI draft
- final image
- prompt metadata
- model metadata
- content coverage
- warnings

This can be done after n8n/API refactor is stable.

## Expected Issues

### Issue 1. More API Calls May Add Small Latency

Externalizing logic adds API calls.

Expected impact:

```text
small compared to LLM and image generation time
```

Expected benefit:

```text
faster debugging
better reuse
less n8n maintenance
more stable prompt control
```

### Issue 2. LO-FI Draft Adds One Image Generation Call

If always enabled, total generation time will increase.

Options:

```text
Option A: always generate LO-FI draft
Option B: user selects draft mode
Option C: generate draft first, final only after approval
Option D: generate draft and final automatically in sequence
```

Recommended initial choice:

```text
Option B or D
```

### Issue 3. GPT/Gemini Response Differences

GPT and Gemini may return different JSON structures or markdown wrapping.

Mitigation:

```text
Validate API should normalize provider responses.
n8n should not parse provider-specific response deeply.
```

### Issue 4. Prompt Changes Can Break Reproducibility

If active prompt changes, generation output may change.

Mitigation:

```text
Store promptId, promptVersion, promptHash, model, and renderedPromptHash with each run.
```

### Issue 5. Design Token Merge Can Change Style Results

Default token merge may change output if not controlled.

Mitigation:

```text
selected token has priority
default token fills missing values only
resolved token context should be saved in the generation trace
```

## Decisions Already Reflected

- Model selection belongs in Prompt Management page.
- Promo page should not expose model selection.
- Prompt update creates history.
- Prompt delete means archive.
- n8n should become a harness, not a logic container.
- Integrated brief is the source of truth for image generation.
- Design token is the top-level style input.
- Default token acts as fallback/background.
- LO-FI draft stage is useful before final image generation.

## Decisions Still Needed

### 1. LO-FI Draft Flow

Need to choose:

```text
Always generate draft
or
Generate draft only when requested
or
Generate draft first and wait for approval before final
```

### 2. Initial Model Defaults

Need to choose default model settings:

```text
integrated_brief: GPT or Gemini
image_execution: GPT or Gemini
lofi_draft: Gemini Image or another fast image model
final_design: Gemini Image
```

### 3. n8n Migration Strategy

Need to choose:

```text
replace current workflow directly
or
create a new v2 workflow and test in parallel
```

Recommended:

```text
create a new v2 workflow and test in parallel
```

## Recommended Execution Order

```text
1. Add model settings to Prompt Management page
2. Extend prompt render API response with model metadata
3. Add lofi_draft prompt type
4. Add Integrated Brief Validate API
5. Add Image Execution Prompt Render API
6. Add LO-FI Draft Prompt Render API
7. Refactor n8n to call Web/API instead of local Code logic
8. Add GPT/Gemini provider branching
9. Add result trace metadata
10. Test B section content reflection from input to final result
```

## 1st Development Scope Recommendation

The first development scope should be limited to:

```text
Prompt Management model settings
image_execution prompt externalization
lofi_draft prompt type
LO-FI draft stage design
Integrated Brief validation API design
```

Do not refactor the entire n8n workflow in one pass unless a new v2 workflow is created and tested separately.

## Acceptance Criteria

The plan can be considered valid when:

- Promo page has no model selector.
- Prompt Management page can manage prompt and model settings together.
- n8n receives provider/model metadata from Web/API.
- Integrated brief validation checks B section content.
- LO-FI draft can show section structure and actual promotion text.
- Final image prompt follows the integrated brief as source of truth.
- Result logs include prompt/model metadata for reproducibility.

