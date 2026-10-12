-- Generation Pipeline V2 removes the LO-FI artifact and its worker from the
-- default path. V1 prompt families remain active and unchanged for rollback.

insert into prompt_templates (
  type, name, body, status, version, lineage_id,
  required_variables, optional_variables, change_note,
  provider, model, temperature, max_tokens, response_format, model_options
)
select
  'integrated_brief_v2',
  'Integrated Brief Generation V2',
  source.body,
  'active',
  1,
  md5('integrated_brief_v2' || E'\x1f' || 'Integrated Brief Generation V2')::uuid,
  source.required_variables,
  source.optional_variables,
  'Add the V2 no-LO-FI pipeline and move complex brief reasoning to GPT-6.1 Sol.',
  'openai',
  'gpt-6.1-sol',
  null,
  24000,
  'json_object',
  coalesce(source.model_options, '{}'::jsonb)
    - 'temperature' - 'model' - 'provider' - 'maxTokens' - 'responseFormat'
    || jsonb_build_object(
      'provider', 'openai',
      'model', 'gpt-6.1-sol',
      'maxTokens', 24000,
      'responseFormat', 'json_object',
      'reasoning', jsonb_build_object('effort', 'medium')
    )
from prompt_templates source
where source.type = 'integrated_brief'
  and source.status = 'active'
  and not exists (
    select 1 from prompt_templates existing where existing.type = 'integrated_brief_v2'
  )
order by source.version desc
limit 1;

insert into prompt_templates (
  type, name, body, status, version, lineage_id,
  required_variables, optional_variables, change_note,
  provider, model, temperature, max_tokens, response_format, model_options
)
select
  'final_design_v2',
  'Final Design Generation V2',
  $prompt$Create a production-quality promotional web page design directly from the Integrated Design Brief.
This is a responsive webpage design, not a poster, flyer, presentation slide, editor canvas, or annotated wireframe.

Use the brand tokens and tone-and-manner as constraints, then compose the strongest layout for this promotion. Do not copy or infer a LO-FI layout; no LO-FI artifact exists in this pipeline.
Preserve every required section, exact offer, CTA, terms, and legal content from the section mapping. Establish one strong hero focal point, clear information hierarchy, consistent spacing, legible typography, and a credible conversion path.
Keep the full page inside the canvas. Do not crop the footer or legal area. Do not add unsupported promotional claims, fake navigation, browser chrome, design-tool UI, annotations, or non-English copy unless the source content explicitly requires it.

Integrated Design Brief:
{{integratedDesignBriefMarkdown}}

Required Section Content Mapping:
{{sectionContentMapping}}$prompt$,
  'active',
  1,
  md5('final_design_v2' || E'\x1f' || 'Final Design Generation V2')::uuid,
  '["integratedDesignBriefMarkdown"]'::jsonb,
  '["sectionContentMapping"]'::jsonb,
  'Add direct text-to-image final design generation without a LO-FI reference.',
  'openai',
  'gpt-image-2.5-sunburst',
  null,
  null,
  'image',
  jsonb_build_object(
    'provider', 'openai',
    'model', 'gpt-image-2.5-sunburst',
    'responseFormat', 'image',
    'quality', 'high',
    'size', '1024x1536',
    'outputFormat', 'png',
    'background', 'opaque',
    'referenceMode', 'text_to_image'
  )
where not exists (
  select 1 from prompt_templates existing where existing.type = 'final_design_v2'
);

comment on table promo_generation_final_designs is
  'Final design results for V1 confirmed-LO-FI image edits and V2 direct text-to-image generation.';
