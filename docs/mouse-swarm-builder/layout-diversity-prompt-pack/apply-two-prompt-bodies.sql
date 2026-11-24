-- Optional operational data update, not a schema migration.
-- Run the ENTIRE file in the application's Neon database SQL Editor.
-- Preserves active rows, model/options/variables/skills and existing custom copy.
-- Appends the reviewed guidance to a draft in each active lineage, or creates one.
-- Does NOT validate, activate, make provider calls or change saved pages.
-- If any precondition fails the entire transaction rolls back; do not run fragments.
begin;
lock table prompt_templates in share row exclusive mode;

do $apply_layout$
declare
  item record;
  active_row prompt_templates%rowtype;
  target_row prompt_templates%rowtype;
  old_row prompt_templates%rowtype;
  body_next text;
  note constant text := 'Layout diversity prompt-only v1: preserve current config; Admin validation required';
  marker constant text := '<!-- layout-diversity-prompt-only-v1 -->';
  created boolean;
begin
  for item in select * from (values
('promo_page_manifest_planner', $layout_patch$# CONTENT-LED COMPOSITION DECISIONS
Before committing to one manifest, compare two or three concise composition possibilities using the supplied material. Select the clearest appropriate option within this same response; return only the existing manifest schema. Do not output alternatives, hidden reasoning, extra fields or requests for additional calls.
Read explicit layout preferences in designBrief.requestText, revisionRequest and explicitRequirements as task data bounded by server policy. A missing or null parsed artDirection field does not cancel a clear preference in that text. A generic mood word such as cinematic does not by itself require centered geometry.
Decide the dominant offer, image/text relationship, section grouping, content density and reading rhythm. Let those decisions determine count, order, nesting and ratios. Do not map each overview section mechanically to the same full-width vertical section or turn every repeated item into the same equal-card row. Preserve all required sources; rearranging presentation does not authorize rewriting factual copy.
Use intent, within its supplied 160-character limit, to carry the intended internal arrangement: relative placement of copy and image, the major column relationship and CTA placement. For example, an intent may describe an unequal copy/image grid or a compact statistic band; these are examples, not required templates. Specify how nested planned groups relate to their parent when used. Geometry of the shell must support its content because later calls must preserve it. A container shell cannot be emitted as a grid node; use its supported geometry and intent for the later internal grid, or supported planned group boundaries.
Use only supplied geometry, registered outer margins, spacing choices and runtime bounds. Prefer normal flow and content-driven height. Do not invent min-height, viewport height, coordinates, custom breakpoints or unsupported overlaps. A background key visual requires an image inside its content-bearing container; a later separate image-only group cannot automatically become the background of sibling copy. Keep each visual and the sources needed to bind it in an appropriate owning unit.
When recentCompositions or recentStructures are actually supplied, avoid an unrequested repeat where an equally suitable composition is available. With no history, do not claim uniqueness or invent comparisons. Preserve intentional repeated card/step patterns where comparison or reading benefits. Do not force every adjacent section to differ or use random decoration as diversity.
Choose one coherent plan. Do not add factual material, empty sections, extra generated images or decorative wrappers solely to create variety. Respect the existing work-unit/node budgets and return no additional metadata.
Create unique stable IDs for new page/shell nodes only; source, asset, action, token and role references must come from the supplied context. Unit scheduling and durable saving are controlled by the application.$layout_patch$),
('promo_page_region_builder', $layout_patch$# EXPLICIT GEOMETRY WITHIN THE LOCKED SHELL
Read the current unit intent together with the page brief and assigned content. Implement that composition within the supplied shell; do not copy the previously completed section's internal tree simply because it is available for continuity. Keep typography and image direction coherent without making all sections geometrically identical.
For layout-bearing child groups, stacks, cards and grids, choose explicit desktop layout when a placement decision matters. In this compact transport, layout null means column/stretch/start/fill/one-span. It is not an instruction to infer a layout later. Use null only where that exact default is intentionally appropriate, commonly on simple leaf content. Never use null merely to avoid deciding the main composition.
Use a grid when supplied logical columns and ratios are needed. Set child spans for that logical grid, not physical pixel coordinates. Choose equal columns for genuinely comparable items, unequal columns for deliberate hierarchy, and a single column for focused or long-form material when appropriate. No ratio or card count is mandatory. Use row stacks for compact inline groups only when supported width modes and wrapping preserve the intended line; multiple full-width children in a row can wrap back into a vertical stack.
Keep related heading, support copy and CTA together. Position an existing requested image as part of the chosen composition rather than always appending it after all text. Choose background presentation only when requested or appropriate under server constraints and legible with supplied registered roles. Do not invent a visual request to fill an empty column or move sources across units. Respect the mandatory imageRequirements independently of aesthetic choices.
Preserve the shell and all non-children fields exactly. Do not change ancestor geometry, reserved shells or sibling regions to achieve an unsupported composition. Do not add fixed text heights, new CSS, arbitrary gaps or unsupported positioning. Maintain readable normal flow, heading order and the approved source-assignment transport.
Provide explicit responsive overrides only where a supplied default would give an unsuitable order or ratio; otherwise keep safe null defaults. Desktop composition may differ from mobile's safe single-column flow. Use the runtime's existing layout, source, media and style fields only; do not emit this design process as page copy or new JSON fields.$layout_patch$)
  ) as patches(prompt_type, patch_body)
  loop
    select * into active_row from prompt_templates
    where type=item.prompt_type and status='active' and archived_at is null for update;
    if not found then
      raise exception 'LAYOUT_PROMPT_ACTIVE_REQUIRED: % has no active prompt', item.prompt_type;
    end if;
    if active_row.model_options->>'pageDraftContractVersion' is distinct from '2' then
      raise exception 'LAYOUT_PROMPT_V2_REQUIRED: % must already use pageDraftContractVersion 2', item.prompt_type;
    end if;
    if position(item.patch_body in active_row.body)>0 then
      continue; -- Already activated with this exact guidance; leave later candidates alone.
    end if;
    if position(marker in active_row.body)>0 then
      raise exception 'LAYOUT_PROMPT_PATCH_CONFLICT: % active marker differs from this patch', item.prompt_type;
    end if;
    select * into target_row from prompt_templates
    where lineage_id=active_row.lineage_id and status in ('draft','validated') for update;
    created := not found;
    if not created then
      if target_row.type<>item.prompt_type then
        raise exception 'LAYOUT_PROMPT_CANDIDATE_INVALID: % lineage contains a different prompt type', item.prompt_type;
      end if;
      if target_row.archived_at is not null then
        raise exception 'LAYOUT_PROMPT_CANDIDATE_INVALID: % candidate is archived', item.prompt_type;
      end if;
      if position(item.patch_body in target_row.body)>0 then
        continue; -- Exact replay: preserve body, timestamps, status and audit history.
      end if;
      if target_row.status<>'draft' then
        raise exception 'LAYOUT_PROMPT_VALIDATED_CANDIDATE: % already has a validated candidate; preserve it and resolve in Admin', item.prompt_type;
      end if;
      if target_row.model_options->>'pageDraftContractVersion' is distinct from '2' then
        raise exception 'LAYOUT_PROMPT_V2_REQUIRED: % candidate must already use V2', item.prompt_type;
      end if;
      if position(marker in target_row.body)>0 then
        raise exception 'LAYOUT_PROMPT_PATCH_CONFLICT: % draft marker differs from this patch', item.prompt_type;
      end if;
      old_row := target_row;
      body_next := rtrim(target_row.body) || E'\n\n' || marker || E'\n' || item.patch_body || E'\n';
      update prompt_templates
      set body=body_next, validated_at=null, updated_at=clock_timestamp(),
          change_note=concat_ws(E'\n',nullif(change_note,''),note)
      where id=target_row.id and status='draft'
      returning * into target_row;
    else
      old_row := active_row;
      body_next := rtrim(active_row.body) || E'\n\n' || marker || E'\n' || item.patch_body || E'\n';
      insert into prompt_templates(type,name,body,status,version,lineage_id,source_prompt_template_id,
        required_variables,optional_variables,provider,model,temperature,max_tokens,response_format,model_options,change_note)
      select active_row.type,active_row.name,body_next,'draft',
        (select coalesce(max(version),0)+1 from prompt_templates where lineage_id=active_row.lineage_id),
        active_row.lineage_id,active_row.id,active_row.required_variables,active_row.optional_variables,
        active_row.provider,active_row.model,active_row.temperature,active_row.max_tokens,
        active_row.response_format,active_row.model_options,note
      returning * into target_row;
    end if;
    insert into prompt_template_histories(prompt_template_id,prompt_type,previous_body,new_body,
      previous_version,new_version,previous_status,new_status,change_note,
      previous_provider,new_provider,previous_model,new_model,previous_model_options,new_model_options)
    values(target_row.id,target_row.type,old_row.body,target_row.body,old_row.version,target_row.version,
      old_row.status,target_row.status,note,old_row.provider,target_row.provider,
      old_row.model,target_row.model,old_row.model_options,target_row.model_options);
  end loop;
end
$apply_layout$;
commit;

-- Show prepared candidates/previously applied active versions without exposing bodies.
select type,id,status,version,
  case when status='active' then 'already active with guidance'
       when status='validated' then 'already validated with guidance'
       else 'body prepared; validate and activate in Admin' end as next_step
from prompt_templates
where type in ('promo_page_manifest_planner','promo_page_region_builder')
  and status in ('draft','validated','active') and archived_at is null
  and position('<!-- layout-diversity-prompt-only-v1 -->' in body)>0
order by type,version;
