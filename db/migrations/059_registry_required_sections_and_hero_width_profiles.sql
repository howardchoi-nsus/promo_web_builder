begin;

-- Additive Layout candidates for the system Registry Hero. Existing Layouts and
-- user-authored Sections are preserved. Width remains administrator-owned JSON.
insert into public.wizard_content_section_layouts (
  section_id, layout_key, name, description, is_default,
  layout_snapshot, selection_metadata, change_note
)
select section.id, seed.layout_key, seed.name, seed.description, false,
  seed.layout_snapshot::jsonb, seed.selection_metadata::jsonb,
  'Migration 059: Registry Hero width profile candidate.'
from public.wizard_content_sections section
cross join (values
  (
    'hero_left_balanced', 'Hero Left Balanced', 'Left-aligned balanced-width copy over a Section visual.',
    '{"contractVersion":1,"layoutMode":"free","sectionStyle":{"minHeight":620,"backgroundColorToken":"--app-bg"},"viewports":{"desktop":{"items":{"title":{"positionMode":"free","xPct":8,"yPx":86,"widthPct":58,"heightMode":"auto","zIndex":2},"description":{"positionMode":"free","xPct":8,"yPx":205,"widthPct":58,"heightMode":"auto","zIndex":2},"primaryAction":{"positionMode":"free","xPct":8,"yPx":350,"widthPct":24,"heightPx":54,"zIndex":2}},"visibility":{"items":{}}},"mobile":{"items":{"title":{"positionMode":"free","xPct":5,"yPx":40,"widthPct":90,"heightMode":"auto","zIndex":2},"description":{"positionMode":"free","xPct":5,"yPx":165,"widthPct":90,"heightMode":"auto","zIndex":2},"primaryAction":{"positionMode":"free","xPct":15,"yPx":320,"widthPct":70,"heightPx":54,"zIndex":2}},"visibility":{"items":{}}}}}',
    '{"alignment":"left","contentRegion":"center-left","visualBalance":"full-background","density":"standard","widthProfile":"balanced","purposeTags":["general","offer"],"selectionWeight":1,"avoidImmediateRepeat":true}'
  ),
  (
    'hero_center_wide', 'Hero Center Wide', 'Centered wide copy for long headlines and brand-led campaigns.',
    '{"contractVersion":1,"layoutMode":"free","sectionStyle":{"minHeight":620,"backgroundColorToken":"--app-bg"},"viewports":{"desktop":{"items":{"title":{"positionMode":"free","xPct":12,"yPx":92,"widthPct":76,"heightMode":"auto","textAlign":"center","zIndex":2},"description":{"positionMode":"free","xPct":18,"yPx":215,"widthPct":64,"heightMode":"auto","textAlign":"center","zIndex":2},"primaryAction":{"positionMode":"free","xPct":38,"yPx":355,"widthPct":24,"heightPx":54,"zIndex":2}},"visibility":{"items":{}}},"mobile":{"items":{"title":{"positionMode":"free","xPct":5,"yPx":40,"widthPct":90,"heightMode":"auto","textAlign":"center","zIndex":2},"description":{"positionMode":"free","xPct":5,"yPx":165,"widthPct":90,"heightMode":"auto","textAlign":"center","zIndex":2},"primaryAction":{"positionMode":"free","xPct":15,"yPx":320,"widthPct":70,"heightPx":54,"zIndex":2}},"visibility":{"items":{}}}}}',
    '{"alignment":"center","contentRegion":"center","visualBalance":"full-background","density":"spacious","widthProfile":"wide","purposeTags":["brand-intro","long-headline"],"selectionWeight":1,"avoidImmediateRepeat":true}'
  ),
  (
    'hero_right_balanced', 'Hero Right Balanced', 'Right-aligned balanced-width copy over a Section visual.',
    '{"contractVersion":1,"layoutMode":"free","sectionStyle":{"minHeight":620,"backgroundColorToken":"--app-bg"},"viewports":{"desktop":{"items":{"title":{"positionMode":"free","xPct":42,"yPx":86,"widthPct":50,"heightMode":"auto","textAlign":"right","zIndex":2},"description":{"positionMode":"free","xPct":42,"yPx":205,"widthPct":50,"heightMode":"auto","textAlign":"right","zIndex":2},"primaryAction":{"positionMode":"free","xPct":68,"yPx":350,"widthPct":24,"heightPx":54,"zIndex":2}},"visibility":{"items":{}}},"mobile":{"items":{"title":{"positionMode":"free","xPct":5,"yPx":40,"widthPct":90,"heightMode":"auto","textAlign":"right","zIndex":2},"description":{"positionMode":"free","xPct":5,"yPx":165,"widthPct":90,"heightMode":"auto","textAlign":"right","zIndex":2},"primaryAction":{"positionMode":"free","xPct":15,"yPx":320,"widthPct":70,"heightPx":54,"zIndex":2}},"visibility":{"items":{}}}}}',
    '{"alignment":"right","contentRegion":"center-right","visualBalance":"full-background","density":"standard","widthProfile":"balanced","purposeTags":["general","offer"],"selectionWeight":1,"avoidImmediateRepeat":true}'
  )
) as seed(layout_key, name, description, layout_snapshot, selection_metadata)
where section.section_key = 'registryHero'
  and section.version = 1
  and section.status = 'active'
on conflict (section_id, layout_key) do nothing;

-- Classify the existing compact default and expose the additive candidates to
-- the v3 Layout policy without changing which Layout remains the default.
update public.wizard_content_section_layouts layout
set selection_metadata = coalesce(layout.selection_metadata, '{}'::jsonb)
    || '{"alignment":"left","contentRegion":"center-left","visualBalance":"full-background","density":"compact","widthProfile":"compact","purposeTags":["short-copy"],"selectionWeight":1,"avoidImmediateRepeat":true}'::jsonb,
  updated_at = now()
from public.wizard_content_sections section
where layout.section_id = section.id
  and section.section_key = 'registryHero'
  and section.version = 1
  and layout.layout_key = 'hero_centered';

update public.wizard_content_sections section
set ai_design = jsonb_set(
      coalesce(section.ai_design, '{}'::jsonb),
      '{allowedLayoutVariants}',
      (
        select jsonb_agg(value order by value)
        from (
          select distinct value
          from jsonb_array_elements_text(
            coalesce(section.ai_design->'allowedLayoutVariants', '[]'::jsonb)
            || '["hero_left_balanced","hero_center_wide","hero_right_balanced"]'::jsonb
          ) entry(value)
        ) allowed
      ),
      true
    ),
    composition_policy = jsonb_set(
      coalesce(section.composition_policy, '{}'::jsonb),
      '{allowedLayoutVariants}',
      (
        select jsonb_agg(value order by value)
        from (
          select distinct value
          from jsonb_array_elements_text(
            coalesce(section.composition_policy->'allowedLayoutVariants', '[]'::jsonb)
            || '["hero_left_balanced","hero_center_wide","hero_right_balanced"]'::jsonb
          ) entry(value)
        ) allowed
      ),
      true
    ),
    change_note = 'Migration 059: Registry Hero width profile candidates added.',
    updated_at = now()
where section.section_key = 'registryHero'
  and section.version = 1
  and section.status = 'active';

-- Create an administrator-reviewable Prompt draft. Runtime code continues to
-- use only the active version selected in LLM & Prompt Management.
with source as (
  select prompt.*, coalesce(prompt.model_options, '{}'::jsonb) as options
  from public.prompt_templates prompt
  where prompt.type = 'promo_page_composer'
    and prompt.status = 'active'
    and not exists (
      select 1 from public.prompt_templates candidate
      where candidate.lineage_id = prompt.lineage_id
        and candidate.status in ('draft', 'validated')
    )
    and not exists (
      select 1 from public.prompt_templates candidate
      where candidate.source_prompt_template_id = prompt.id
        and candidate.change_note = 'Migration 059 candidate: Layout width-profile selection guidance.'
    )
  order by prompt.version desc
  limit 1
), inserted as (
  insert into public.prompt_templates (
    type, name, body, status, version, lineage_id, source_prompt_template_id,
    required_variables, optional_variables, provider, model, temperature,
    max_tokens, response_format, model_options, change_note
  )
  select source.type, source.name, source.body, 'draft',
    (select coalesce(max(version), 0) + 1 from public.prompt_templates versioned where versioned.lineage_id = source.lineage_id),
    source.lineage_id, source.id, source.required_variables, source.optional_variables,
    source.provider, source.model, source.temperature, source.max_tokens,
    source.response_format,
    source.options || jsonb_build_object(
      'promptLayers', coalesce(source.options->'promptLayers', '{}'::jsonb) || jsonb_build_object(
        'additionalInstructions', coalesce(source.options#>'{promptLayers,additionalInstructions}', '[]'::jsonb)
          || jsonb_build_array(
            'Use each Layout Preset selectionMetadata as administrator-approved selection guidance.',
            'Match widthProfile, alignment, contentRegion, visualBalance, density, and purposeTags to the requested copy length and visual intent.',
            'Do not invent raw coordinates or width values. Select an allowed layoutKey whose metadata best fits the content.',
            'Required Sections are server-governed and must never be hidden or removed.'
          )
      )
    ),
    'Migration 059 candidate: Layout width-profile selection guidance.'
  from source
  returning *
)
insert into public.prompt_template_histories (
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
join source on source.id = inserted.source_prompt_template_id;

commit;
