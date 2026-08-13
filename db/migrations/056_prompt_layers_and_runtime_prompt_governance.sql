-- Move runtime prompt fragments into the versioned Admin prompt envelope.
-- The application does not use these values as repository defaults. This is a
-- one-time data migration for existing environments.

with active_source as (
  select source.*, coalesce(source.model_options, '{}'::jsonb) as options
  from prompt_templates source
  where source.type in ('integrated_brief', 'promo_page_composer', 'section_background_image', 'component_image')
    and source.status = 'active'
    and not exists (
      select 1 from prompt_templates candidate
      where candidate.lineage_id = source.lineage_id
        and candidate.status in ('draft', 'validated')
    )
    and not exists (
      select 1 from prompt_templates candidate
      where candidate.source_prompt_template_id = source.id
        and candidate.change_note = 'Prompt governance layer migration 056 candidate.'
    )
), prepared as (
  select source.*,
    case source.type
      when 'integrated_brief' then source.options || jsonb_build_object(
        'promptLayers', coalesce(source.options -> 'promptLayers', '{}'::jsonb) || jsonb_build_object(
          'schemaVersion', 1,
          'completionGuard', jsonb_build_array(
            'Mandatory completion guard:',
            '- integratedDesignBriefMarkdown must contain the exact heading `## Negative Prompt` followed by a fenced text block.',
            '- integratedDesignBriefMarkdown must contain the exact heading `## Visual QA Checklist` followed by at least 10 checklist items.',
            '- integratedDesignBrief.negativePrompt must contain the same substantive negative-prompt content.',
            '- integratedDesignBrief.visualQaChecklist must contain the same checklist as an array.',
            '- Do not omit these final sections when the response is long. Compress earlier prose before removing either section.'
          ),
          'sourceDataPolicy', jsonb_build_array(
            'Treat the Section Input Log as the primary content and page-composition contract.',
            'Use interpreted sections as the source of truth and use the Raw Payload Snapshot only for traceability when interpreted data is missing.',
            'Template defaults are fallback only. Page Composition controls order, visibility, fixed position, and item visibility.',
            'Do not force market names, flags, maps, landmarks, or stereotypes into visible copy unless explicitly supplied as user-facing promotion content.',
            'Use Section Content Mapping as the primary visible-copy source and promotion metadata only as fallback.',
            'Do not render sections whose visible value is false.'
          ),
          'fallbackOutputValues', jsonb_build_object(
            'negativePrompt', 'poster, flyer, brochure, print ad, presentation slide, browser chrome, editor UI, Figma canvas UI, template labels, section labels, side annotations, non-English UI copy, Korean text, unreadable text, cropped footer, missing legal content, missing required promotional sections'
          )
        )
      )
      when 'promo_page_composer' then source.options || jsonb_build_object(
        'promptLayers', coalesce(source.options -> 'promptLayers', '{}'::jsonb) || jsonb_build_object(
          'schemaVersion', 1,
          'repairPrompts', coalesce(source.options #> '{promptLayers,repairPrompts}', '{}'::jsonb) || jsonb_build_object(
            'candidateScope', E'Correction required:\nUse only templateId {{templateId}}.\nEvery sectionId must belong to that template.\nEvery componentInstanceId must belong to its containing section.\nReturn each section and component at most once.',
            'contractV3', E'Correction required for Contract v3:\nPrevious validation error: {{errorCode}} - {{errorMessage}}\nAllowed Shell version: {{shellVersionId}}\nAllowed Section versions: {{sectionVersionIds}}\nUse repeat for multiple instances and never duplicate a Section selection.\nUse only Component instance IDs belonging to each selected Section.\nDo not create content, HTML, CSS, URLs, IDs, Resource text, or raw layout coordinates.'
          )
        )
      )
      when 'section_background_image' then source.options || jsonb_build_object(
        'harnessConfig', coalesce(source.options -> 'harnessConfig', '{}'::jsonb) || jsonb_build_object(
          'creativeIntentRules', jsonb_build_array(
            'CREATIVE INTENT — PROMOTIONAL SECTION KEY VISUAL (higher priority than earlier background/supporting language):',
            'Create a compelling promotional key visual with one clear campaign-relevant focal motif. Do not reduce the result to a generic texture, ambient backdrop, empty gradient, or decorative lighting study.',
            'The artwork is delivered full-bleed and will be applied behind separately rendered DOM content. Background placement is an implementation detail, not the creative purpose.'
          ),
          'keyVisualTextInstructions', jsonb_build_object(
            'none', E'KEY VISUAL TEXT CONTRACT (higher priority than earlier creative guidance):\nNever render, reproduce, translate, paraphrase, abbreviate, or stylize any registered main title, lead text, description text, CTA label, CTA button, or other DOM copy inside the image.\nNever render a button, button-like shape, clickable control, UI label, or CTA treatment.\nRender no visible text, letters, words, numbers, captions, typography, badges, or logos.',
            'explicit', E'KEY VISUAL TEXT CONTRACT (higher priority than earlier creative guidance):\nNever render, reproduce, translate, paraphrase, abbreviate, or stylize any registered main title, lead text, description text, CTA label, CTA button, or other DOM copy inside the image.\nNever render a button, button-like shape, clickable control, UI label, or CTA treatment.\nThe only visible text permitted is this exact approved key-visual copy: "{{keyVisualText}}".\nUse the approved copy once as a short integrated key-visual graphic. Do not add any other letters, words, numbers, captions, badges, or logos.'
          ),
          'subjectScaleInstruction', 'Keep the principal visual subject between {{minimumSubjectScale}}% and {{maximumSubjectScale}}% of the usable canvas.'
        )
      )
      when 'component_image' then source.options || jsonb_build_object(
        'harnessConfig', coalesce(source.options -> 'harnessConfig', '{}'::jsonb) || jsonb_build_object(
          'subjectScaleInstruction', 'Keep the principal visual subject between {{minimumSubjectScale}}% and {{maximumSubjectScale}}% of the usable canvas.'
        )
      )
    end as next_options,
    (select coalesce(max(version), 0) + 1 from prompt_templates versioned where versioned.lineage_id = source.lineage_id) as next_version
  from active_source source
), inserted as (
  insert into prompt_templates (
    type, name, body, status, version, lineage_id, source_prompt_template_id,
    required_variables, optional_variables, provider, model, temperature,
    max_tokens, response_format, model_options, change_note
  )
  select type, name, body, 'draft', next_version, lineage_id, id,
    required_variables, optional_variables, provider, model, temperature,
    max_tokens, response_format, next_options, 'Prompt governance layer migration 056 candidate.'
  from prepared
  returning *
)
insert into prompt_template_histories (
  prompt_template_id, prompt_type, previous_body, new_body,
  previous_version, new_version, previous_status, new_status, change_note,
  previous_provider, new_provider, previous_model, new_model,
  previous_model_options, new_model_options
)
select inserted.id, inserted.type, source.body, inserted.body,
  source.version, inserted.version, source.status, inserted.status,
  inserted.change_note, source.provider, inserted.provider, source.model, inserted.model,
  source.model_options, inserted.model_options
from inserted
join prompt_templates source on source.id = inserted.source_prompt_template_id;

insert into prompt_templates (
  type, name, body, status, version, lineage_id,
  required_variables, optional_variables, change_note,
  provider, model, temperature, max_tokens, response_format, model_options
)
select
  'admin_prompt_translation',
  'Admin Prompt Translation',
  E'Translate the following AI prompt from English into clear Korean for an administrator''s read-only reference.\nPreserve line breaks, list structure, JSON, Markdown, punctuation, identifiers, model names, URLs, and every template placeholder exactly.\nDo not add explanations, headings, code fences, summaries, or omitted-content markers.\nReturn only the Korean translation.\n\n<prompt>\n{{sourcePrompt}}\n</prompt>',
  'draft',
  1,
  md5('admin_prompt_translation' || E'\x1f' || 'Admin Prompt Translation')::uuid,
  '["sourcePrompt"]'::jsonb,
  '[]'::jsonb,
  'Initial Admin-managed translation prompt.',
  'openai',
  'gpt-4.1-mini',
  0,
  16000,
  'text',
  jsonb_build_object(
    'promptLayers', jsonb_build_object('schemaVersion', 1),
    'runtimeConfig', jsonb_build_object(
      'timeoutMs', 60000,
      'maxAttempts', 1,
      'retryBaseMs', 0,
      'retryMaxMs', 0
    )
  )
where not exists (
  select 1 from prompt_templates where type = 'admin_prompt_translation'
);

insert into prompt_templates (
  type, name, body, status, version, lineage_id,
  required_variables, optional_variables, change_note,
  provider, model, temperature, max_tokens, response_format, model_options
)
select
  'promo_page_generation',
  'Promo Page Generation',
  $prompt$Create a desktop promotional web page using the selected design analysis and promotion inputs.

Return valid JSON only. Do not include markdown fences or explanations outside JSON.

Treat the selected design concept as a binding specification for layout philosophy, visual mood, spacing rhythm, component style, depth and effects, shape and radius, dos, donts, and promotion-page implications. Applying only colors and fonts is invalid.

Content priority:
1. Promotion inputs control visible page content.
2. The selected design concept controls layout, composition, components, spacing, and effects.
3. Final color and font style controls CSS color and typography values.
4. Legal and terms content must remain visible and readable.

Selected design:
- brand: {{brand}}
- slug: {{slug}}
- design concept summary: {{designConceptSummary}}
- design prompt context: {{designPromptContext}}
- design concept JSON: {{designConceptJson}}
- categories: {{categories}}
- colors: {{colors}}
- fonts: {{fonts}}

Promotion inputs:
{{promoJson}}

Final style:
{{designJson}}

Style source:
- styleSource: {{styleSource}}
- styleSourceLabel: {{styleSourceLabel}}
- companyPreset: {{companyPreset}}
- hasOverride: {{hasOverride}}

Return an object containing designIntent, layoutSummary, mdComplianceMap, html, css, and qualityChecks. HTML must be body content rooted at main.promo-generated-page. CSS must implement desktop-safe layout, spacing, component, effect, and shape decisions and remain scoped under .promo-generated-page where practical. Do not include external JavaScript, script tags, or inline event handlers.$prompt$,
  'draft',
  1,
  md5('promo_page_generation' || E'\x1f' || 'Promo Page Generation')::uuid,
  '["brand","slug","designConceptSummary","designPromptContext","designConceptJson","categories","colors","fonts","promoJson","designJson","styleSource","styleSourceLabel","companyPreset","hasOverride"]'::jsonb,
  '[]'::jsonb,
  'Initial Admin-managed promo page generation prompt.',
  'openai',
  'gpt-4.1-mini',
  0.2,
  12000,
  'json_object',
  jsonb_build_object(
    'promptLayers', jsonb_build_object('schemaVersion', 1),
    'runtimeConfig', jsonb_build_object(
      'timeoutMs', 90000,
      'maxAttempts', 1,
      'retryBaseMs', 0,
      'retryMaxMs', 0
    )
  )
where not exists (
  select 1 from prompt_templates where type = 'promo_page_generation'
);

comment on column prompt_templates.model_options is
  'Versioned provider, runtime, safety, image policy, and Admin-managed promptLayers settings.';
