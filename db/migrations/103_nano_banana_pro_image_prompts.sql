-- DATA update only: prepare two model-switch Drafts, then use Admin validation/activation.
-- No active prompt, registry model, document, completed image or runtime flag is changed.
begin;
lock table prompt_templates in share row exclusive mode;
lock table llm_models in share mode;

do $nano_pro$
declare
  target_model llm_models%rowtype;
  active_row prompt_templates%rowtype;
  candidate prompt_templates%rowtype;
  before_row prompt_templates%rowtype;
  prompt_type text;
  options_next jsonb;
  tier text;
  created boolean;
  note constant text := 'Migration 103: Nano Banana Pro image model Draft; validate and activate in Admin';
begin
  select * into target_model from llm_models
    where provider='google' and model_id='gemini-3-pro-image' and status='active'
    for share;
  if not found then raise exception 'NANO_PRO_MODEL_REQUIRED: register and activate google/gemini-3-pro-image first'; end if;
  if target_model.modality<>'image' or target_model.default_response_format<>'image'
    or jsonb_typeof(target_model.supported_image_sizes) is distinct from 'array' then
    raise exception 'NANO_PRO_MODEL_INVALID: image modality, image response format and supported image tiers are required';
  end if;

  foreach prompt_type in array array['section_background_image','component_image'] loop
    select * into active_row from prompt_templates
      where type=prompt_type and status='active' and archived_at is null for update;
    if not found then raise exception 'NANO_PRO_ACTIVE_REQUIRED: %',prompt_type; end if;
    if coalesce(active_row.model_options->>'executionSnapshotVersion','') not in ('2','3') then
      raise exception 'NANO_PRO_CONTROL_PLANE_REQUIRED: % requires existing Snapshot V2 or V3 settings',prompt_type;
    end if;
    if active_row.provider='google' and active_row.model='gemini-3-pro-image' and active_row.response_format='image' then
      continue; -- Already selected: do not overwrite an administrator's Pro settings or future Draft.
    end if;

    select * into candidate from prompt_templates
      where lineage_id=active_row.lineage_id and status in ('draft','validated') for update;
    created := not found;
    if not created and (candidate.type<>prompt_type or candidate.archived_at is not null) then
      raise exception 'NANO_PRO_CANDIDATE_INVALID: %',prompt_type;
    end if;
    before_row := case when created then active_row else candidate end;
    if coalesce(before_row.model_options->>'executionSnapshotVersion','') not in ('2','3') then
      raise exception 'NANO_PRO_CONTROL_PLANE_REQUIRED: % candidate requires Snapshot V2 or V3',prompt_type;
    end if;
    -- Preserve an explicitly configured image policy/tier. Use Pro's 2K catalog
    -- default only when the current prompt has no supported tier selected.
    tier := coalesce(nullif(before_row.model_options#>>'{generationPolicy,requestedTier}',''),
      nullif(before_row.model_options->>'imageSize',''),
      nullif(before_row.model_options->>'image_size',''),
      target_model.model_options->>'imageSize','2K');
    if tier not in ('1K','2K','4K') or not (target_model.supported_image_sizes ? tier) then
      raise exception 'NANO_PRO_TIER_UNSUPPORTED: % / %',prompt_type,tier;
    end if;
    options_next := (before_row.model_options
      - 'size' - 'quality' - 'outputFormat' - 'output_format' - 'background' - 'reasoning' - 'image_size')
      || jsonb_build_object('provider','google','model','gemini-3-pro-image','responseFormat','image',
        'modelCapabilitySnapshot',jsonb_build_object(
          'provider','google','model','gemini-3-pro-image','modality','image',
          'legacy',target_model.is_legacy,'supportsStructuredOutput',false,
          'supportsImageGeneration',true,'supportedImageSizes',target_model.supported_image_sizes));
    if before_row.model_options->>'executionSnapshotVersion'='2' then
      options_next := options_next || jsonb_build_object('imageSize',tier);
    else
      -- V3 already owns resolution/MIME/crop/validation in its image policies.
      options_next := jsonb_set(options_next - 'imageSize','{generationPolicy,requestedTier}',to_jsonb(tier),true);
    end if;

    if not created and candidate.provider='google' and candidate.model='gemini-3-pro-image'
      and candidate.response_format='image'
      and candidate.temperature is not distinct from target_model.default_temperature
      and candidate.max_tokens is not distinct from target_model.default_max_tokens
      and candidate.model_options=options_next then
      continue; -- Exact replay, including an already validated matching candidate.
    end if;
    if not created and candidate.status<>'draft' then
      raise exception 'NANO_PRO_VALIDATED_CANDIDATE: resolve the existing validated candidate for % in Admin',prompt_type;
    end if;

    if created then
      insert into prompt_templates(type,name,body,status,version,lineage_id,source_prompt_template_id,
        required_variables,optional_variables,provider,model,temperature,max_tokens,response_format,model_options,change_note)
      values(active_row.type,active_row.name,active_row.body,'draft',
        (select coalesce(max(version),0)+1 from prompt_templates where lineage_id=active_row.lineage_id),
        active_row.lineage_id,active_row.id,active_row.required_variables,active_row.optional_variables,
        'google','gemini-3-pro-image',target_model.default_temperature,target_model.default_max_tokens,'image',options_next,note)
      returning * into candidate;
    else
      update prompt_templates set provider='google',model='gemini-3-pro-image',
        temperature=target_model.default_temperature,max_tokens=target_model.default_max_tokens,
        response_format='image',model_options=options_next,validated_at=null,updated_at=clock_timestamp(),
        change_note=concat_ws(E'\n',nullif(change_note,''),note)
        where id=candidate.id returning * into candidate;
    end if;
    insert into prompt_template_histories(prompt_template_id,prompt_type,previous_body,new_body,
      previous_version,new_version,previous_status,new_status,change_note,
      previous_provider,new_provider,previous_model,new_model,previous_model_options,new_model_options)
    values(candidate.id,candidate.type,before_row.body,candidate.body,before_row.version,candidate.version,
      before_row.status,candidate.status,note,before_row.provider,candidate.provider,
      before_row.model,candidate.model,before_row.model_options,candidate.model_options);
  end loop;
end
$nano_pro$;
commit;

select p.type,p.id,p.status,p.version,p.provider,p.model,
  case when p.status='active' then 'Pro already active; existing settings preserved'
    when p.status='validated' then 'Pro candidate already validated; activate in Admin'
    else 'Pro Draft prepared; validate and activate in Admin' end as next_step
from prompt_templates p
where p.type in ('section_background_image','component_image')
  and p.status in ('active','validated','draft') and p.archived_at is null
  and p.provider='google' and p.model='gemini-3-pro-image' and p.response_format='image'
  and exists(select 1 from prompt_templates a where a.type=p.type and a.lineage_id=p.lineage_id
    and a.status='active' and a.archived_at is null)
order by p.type,p.version;
