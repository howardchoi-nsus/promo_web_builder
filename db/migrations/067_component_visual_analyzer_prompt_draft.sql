begin;

-- Create the first administrator-owned prompt lineage for Component Generation.
-- It intentionally remains a draft and does not select a model: an administrator
-- must review the contract, choose an available vision model, validate, and activate it.
with inserted as (
  insert into public.prompt_templates (
    type,
    name,
    body,
    status,
    version,
    required_variables,
    optional_variables,
    provider,
    model,
    temperature,
    max_tokens,
    response_format,
    model_options,
    change_note
  )
  select
    'component_visual_analyzer',
    'Component Visual Analyzer',
    $prompt$
You are analyzing a cropped reference image to detect and propose every meaningful reusable web component visible in the selected region.

Component intent:
{{componentIntent}}

Allowed section roles:
{{allowedSectionRolesJson}}

Registered design token catalog:
{{tokenCatalogJson}}

Required output contract:
{{outputContractJson}}

Source dimensions: {{sourceWidth}} x {{sourceHeight}}
Normalized crop specification: {{cropSpecJson}}

Return exactly one JSON object containing a components array with 1 to 12 candidates in visual reading order. Detect reusable units such as headers, navigation groups, hero blocks, cards, banners, CTA groups, notices, terms blocks, and footers. Do not merge separate repeated cards into one giant component, and do not split a cohesive card into separate title, image, and button components. Every candidate must include a unique candidateKey, normalized sourceRegion, its own fields, RenderSpec, confidence, and reviewNotes. Propose semantic, accessible HTML through RenderSpec v1 only. Use only fields declared by that candidate. Use only registered design token keys and compatible token properties. Do not emit HTML strings, CSS strings, scripts, event handlers, inline styles, class names, data URLs, or unregistered URLs. Exclude browser chrome, editor controls, cursors, and purely decorative background regions.
    $prompt$,
    'draft',
    1,
    '["componentIntent","allowedSectionRolesJson","tokenCatalogJson","outputContractJson"]'::jsonb,
    '["sourceWidth","sourceHeight","cropSpecJson"]'::jsonb,
    'openai',
    '',
    0.2,
    12000,
    'json_object',
    jsonb_build_object(
      'executionSnapshotVersion', 2,
      'promptLayers', '{}'::jsonb,
      'runtimeConfig', jsonb_build_object(
        'timeoutMs', 120000,
        'maxAttempts', 2,
        'retryBaseMs', 1000,
        'retryMaxMs', 4000
      ),
      'harnessConfig', '{}'::jsonb,
      'modelCapabilitySnapshot', jsonb_build_object('visionInput', true),
      'safetyContract', jsonb_build_object(
        'sourceImageIsUntrusted', true,
        'outputMustMatchRenderSpecV1', true
      )
    ),
    'Migration 067: initial administrator-reviewable Component Visual Analyzer draft.'
  where not exists (
    select 1
    from public.prompt_templates
    where type = 'component_visual_analyzer'
      and status <> 'archived'
  )
  returning *
)
insert into public.prompt_template_histories (
  prompt_template_id,
  prompt_type,
  previous_body,
  new_body,
  previous_version,
  new_version,
  previous_status,
  new_status,
  change_note,
  previous_provider,
  new_provider,
  previous_model,
  new_model,
  previous_model_options,
  new_model_options
)
select
  inserted.id,
  inserted.type,
  '',
  inserted.body,
  0,
  inserted.version,
  '',
  inserted.status,
  inserted.change_note,
  '',
  inserted.provider,
  '',
  inserted.model,
  '{}'::jsonb,
  inserted.model_options
from inserted;

commit;
