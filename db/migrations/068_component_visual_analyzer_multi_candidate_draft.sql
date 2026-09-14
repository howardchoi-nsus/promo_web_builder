begin;

with source as (
  select prompt.*, coalesce(prompt.model_options, '{}'::jsonb) as options
  from public.prompt_templates prompt
  where prompt.type = 'component_visual_analyzer'
    and prompt.status in ('active', 'inactive')
    and not exists (
      select 1 from public.prompt_templates candidate
      where candidate.lineage_id = prompt.lineage_id
        and candidate.status in ('draft', 'validated')
    )
  order by case prompt.status when 'active' then 0 else 1 end, prompt.version desc
  limit 1
), inserted as (
  insert into public.prompt_templates (
    type, name, body, status, version, lineage_id, source_prompt_template_id,
    required_variables, optional_variables, provider, model, temperature,
    max_tokens, response_format, model_options, change_note
  )
  select
    source.type,
    source.name,
    replace(
      source.body,
      'to propose one reusable web component.',
      'to detect and propose every meaningful reusable web component visible in the selected region.'
    ) || $prompt$

MULTI-COMPONENT DETECTION CONTRACT:
- Treat the selected region as a complete page or large design canvas unless the image clearly contains only one component.
- Detect independent reusable units such as headers, navigation groups, hero content blocks, promotional cards, feature cards, banners, CTA groups, notices, terms blocks, and footers.
- Do not merge visually separate repeated cards into one giant component. Return each reusable card variant as a separate component candidate.
- Do not split a cohesive card into separate title, image, and button components; those belong together as fields and DOM nodes of the card.
- Return a top-level components array with 1 to 12 candidates in visual reading order.
- Every candidate must include a unique candidateKey and a normalized sourceRegion relative to the supplied cropped image. x, y, width, and height must each be between 0 and 1.
- Every candidate must have its own fields, RenderSpec, confidence, and reviewNotes. No fieldKey may reference another candidate.
- Prefer reusable semantic boundaries over pixel-perfect fragments. Exclude browser chrome, editor controls, cursors, selection handles, and purely decorative background regions.
    $prompt$,
    'draft',
    (select coalesce(max(version), 0) + 1 from public.prompt_templates versioned where versioned.lineage_id = source.lineage_id),
    source.lineage_id,
    source.id,
    source.required_variables,
    source.optional_variables,
    source.provider,
    source.model,
    source.temperature,
    greatest(coalesce(source.max_tokens, 6000), 12000),
    source.response_format,
    source.options,
    'Migration 068: multi-component detection candidate.'
  from source
  where not exists (
    select 1 from public.prompt_templates prior
    where prior.source_prompt_template_id = source.id
      and prior.change_note = 'Migration 068: multi-component detection candidate.'
  )
  returning *
)
insert into public.prompt_template_histories (
  prompt_template_id, prompt_type, previous_body, new_body,
  previous_version, new_version, previous_status, new_status, change_note,
  previous_provider, new_provider, previous_model, new_model,
  previous_model_options, new_model_options
)
select
  inserted.id, inserted.type, source.body, inserted.body,
  source.version, inserted.version, source.status, inserted.status, inserted.change_note,
  source.provider, inserted.provider, source.model, inserted.model,
  source.model_options, inserted.model_options
from inserted
join source on source.id = inserted.source_prompt_template_id;

commit;
