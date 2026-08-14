alter table public.wizard_content_section_layouts
  add column if not exists selection_metadata jsonb not null default '{}'::jsonb;

alter table public.wizard_content_section_layouts
  drop constraint if exists wizard_content_section_layouts_selection_metadata_chk;

alter table public.wizard_content_section_layouts
  add constraint wizard_content_section_layouts_selection_metadata_chk
  check (jsonb_typeof(selection_metadata) = 'object');

comment on column public.wizard_content_section_layouts.selection_metadata is
  'Version-owned deterministic hints used to choose among administrator-approved Layout Presets.';

-- Component versions are immutable. Create draft candidates instead of
-- modifying the active Hero Title and Primary CTA versions in place.
do $$
declare
  component_row record;
  source_version public.wizard_item_component_versions%rowtype;
  draft_id uuid;
begin
  for component_row in
    select id, component_key
    from public.wizard_item_components
    where component_key in ('hero-title', 'primary-cta')
  loop
    draft_id := null;

    if exists (
      select 1
      from public.wizard_item_component_versions
      where component_id = component_row.id
        and change_note = 'Migration 058 candidate: explicit Style Slot targetProperty.'
    ) then
      continue;
    end if;

    select id into draft_id
    from public.wizard_item_component_versions
    where component_id = component_row.id and status = 'draft'
    order by version desc
    limit 1;

    if draft_id is null then
      select * into source_version
      from public.wizard_item_component_versions
      where component_id = component_row.id and status = 'active'
      order by version desc
      limit 1;

      if source_version.id is null then
        continue;
      end if;

      insert into public.wizard_item_component_versions (
        component_id, version, status, field_kind, text_type, editor_schema, default_value,
        capabilities, image_policy, cta_policy, style_slots, placement_policy, change_note
      ) values (
        source_version.component_id,
        (select coalesce(max(version), 0) + 1 from public.wizard_item_component_versions where component_id = component_row.id),
        'draft', source_version.field_kind, source_version.text_type, source_version.editor_schema,
        source_version.default_value, source_version.capabilities, source_version.image_policy,
        source_version.cta_policy, source_version.style_slots, source_version.placement_policy,
        'Migration 058 candidate: explicit Style Slot targetProperty.'
      ) returning id into draft_id;

      insert into public.wizard_item_component_version_fields (
        component_version_id, field_key, name, field_kind, text_type, sort_order,
        is_required, is_locked, default_value, editor_schema, capabilities,
        image_policy, cta_policy, style_slots
      )
      select draft_id, field_key, name, field_kind, text_type, sort_order,
        is_required, is_locked, default_value, editor_schema, capabilities,
        image_policy, cta_policy, style_slots
      from public.wizard_item_component_version_fields
      where component_version_id = source_version.id;
    end if;

    update public.wizard_item_component_versions version
    set style_slots = coalesce((
      select jsonb_agg(
        case
          when component_row.component_key = 'hero-title' and slot->>'slotKey' = 'titleColor'
            then slot || '{"targetProperty":"colorToken"}'::jsonb
          when component_row.component_key = 'primary-cta' and slot->>'slotKey' = 'ctaBackground'
            then slot || '{"targetProperty":"backgroundColorToken"}'::jsonb
          else slot
        end
      )
      from jsonb_array_elements(version.style_slots) slot
    ), '[]'::jsonb), updated_at = now()
    where version.id = draft_id;

    update public.wizard_item_component_version_fields field
    set style_slots = coalesce((
      select jsonb_agg(
        case
          when component_row.component_key = 'hero-title' and slot->>'slotKey' = 'titleColor'
            then slot || '{"targetProperty":"colorToken"}'::jsonb
          when component_row.component_key = 'primary-cta' and slot->>'slotKey' = 'ctaBackground'
            then slot || '{"targetProperty":"backgroundColorToken"}'::jsonb
          else slot
        end
      )
      from jsonb_array_elements(field.style_slots) slot
    ), '[]'::jsonb), updated_at = now()
    where field.component_version_id = draft_id;
  end loop;
end
$$;
