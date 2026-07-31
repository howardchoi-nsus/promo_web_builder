-- Section Layout Presets (Contract v1)
-- Layouts are version-owned children of wizard_content_sections.

create table if not exists wizard_content_section_layouts (
  id uuid primary key default gen_random_uuid(),
  section_id uuid not null references wizard_content_sections(id) on delete cascade,
  layout_key text not null,
  name text not null,
  description text not null default '',
  is_default boolean not null default false,
  layout_snapshot jsonb not null,
  change_note text not null default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint wizard_content_section_layouts_key_chk
    check (layout_key ~ '^[a-zA-Z][a-zA-Z0-9_]*$'),
  constraint wizard_content_section_layouts_snapshot_chk
    check (
      jsonb_typeof(layout_snapshot) = 'object'
      and layout_snapshot->>'contractVersion' = '1'
      and layout_snapshot->>'layoutMode' = 'free'
      and jsonb_typeof(layout_snapshot->'viewports') = 'object'
      and jsonb_typeof(layout_snapshot->'viewports'->'desktop') = 'object'
      and jsonb_typeof(layout_snapshot->'viewports'->'mobile') = 'object'
    ),
  unique (section_id, layout_key)
);

create unique index if not exists wizard_content_section_layouts_one_default_idx
  on wizard_content_section_layouts (section_id)
  where is_default = true;

create index if not exists wizard_content_section_layouts_section_idx
  on wizard_content_section_layouts (section_id, created_at asc);

create table if not exists wizard_content_section_layout_histories (
  id uuid primary key default gen_random_uuid(),
  layout_id uuid,
  section_id uuid not null,
  layout_key text not null,
  action text not null,
  change_note text not null default '',
  previous_snapshot jsonb,
  new_snapshot jsonb,
  changed_at timestamptz not null default now(),
  constraint wizard_content_section_layout_histories_action_chk
    check (action in ('create', 'update', 'delete', 'set-default', 'clone'))
);

create index if not exists wizard_content_section_layout_histories_section_idx
  on wizard_content_section_layout_histories (section_id, changed_at desc);

comment on table wizard_content_section_layouts is
  'Desktop/mobile component geometry presets owned by one wizard content section version.';
comment on table wizard_content_section_layout_histories is
  'Immutable change history for section layout preset create/update/delete/default/clone actions.';

create or replace function set_wizard_content_section_default_layout(
  p_section_id uuid,
  p_layout_id uuid
) returns void
language plpgsql
as $$
begin
  perform pg_advisory_xact_lock(hashtext('wizard_content_section_layout:' || p_section_id::text));
  if not exists (
    select 1 from wizard_content_section_layouts
    where id = p_layout_id and section_id = p_section_id
  ) then
    raise exception 'Section layout not found';
  end if;
  update wizard_content_section_layouts
  set is_default = false, updated_at = now()
  where section_id = p_section_id and is_default = true and id <> p_layout_id;
  update wizard_content_section_layouts
  set is_default = true, updated_at = now()
  where id = p_layout_id and section_id = p_section_id;
end $$;

create or replace function clone_wizard_content_section_draft(
  p_source_id uuid,
  p_change_note text default 'Draft created from existing section.'
) returns uuid
language plpgsql
as $$
declare
  v_source wizard_content_sections%rowtype;
  v_new_id uuid;
  v_next_version integer;
begin
  select * into v_source from wizard_content_sections where id = p_source_id for update;
  if not found then raise exception 'Source section not found'; end if;
  perform pg_advisory_xact_lock(hashtext('wizard_content_section:' || v_source.section_key));
  if exists (
    select 1 from wizard_content_sections
    where section_key = v_source.section_key and status = 'draft'
  ) then
    raise exception 'A draft already exists for this section';
  end if;
  select coalesce(max(version), 0) + 1 into v_next_version
  from wizard_content_sections where section_key = v_source.section_key;

  insert into wizard_content_sections (
    section_key, name, description, is_required, order_change_allowed, fixed_position,
    sort_order, is_visible_in_wizard, status, version, change_note,
    owner_form_template_id, ai_design,
    composition_scope, section_role, composition_policy
  ) values (
    v_source.section_key, v_source.name, v_source.description, v_source.is_required,
    v_source.order_change_allowed, v_source.fixed_position, v_source.sort_order,
    v_source.is_visible_in_wizard, 'draft', v_next_version, p_change_note,
    null, v_source.ai_design,
    v_source.composition_scope, v_source.section_role, v_source.composition_policy
  ) returning id into v_new_id;

  insert into wizard_content_section_component_instances (
    section_id, component_version_id, item_key, display_name, is_visible_in_wizard,
    is_required, user_reorder_allowed, sort_order, is_locked, locked_value, instance_config
  )
  select v_new_id, component_version_id, item_key, display_name, is_visible_in_wizard,
    is_required, user_reorder_allowed, sort_order, is_locked, locked_value, instance_config
  from wizard_content_section_component_instances where section_id = p_source_id;

  insert into wizard_content_section_layouts (
    section_id, layout_key, name, description, is_default,
    layout_snapshot, change_note
  )
  select
    v_new_id, layout_key, name, description, is_default,
    layout_snapshot, p_change_note
  from wizard_content_section_layouts
  where section_id = p_source_id;

  insert into wizard_content_section_layout_histories (
    layout_id, section_id, layout_key, action, change_note,
    previous_snapshot, new_snapshot
  )
  select
    cloned.id, v_new_id, cloned.layout_key, 'clone', p_change_note,
    source.layout_snapshot, cloned.layout_snapshot
  from wizard_content_section_layouts cloned
  join wizard_content_section_layouts source
    on source.section_id = p_source_id
    and source.layout_key = cloned.layout_key
  where cloned.section_id = v_new_id;

  insert into wizard_content_section_histories (
    section_key, section_id, previous_version, new_version,
    previous_status, new_status, change_note, previous_state, new_state
  ) values (
    v_source.section_key, v_new_id, v_source.version, v_next_version,
    v_source.status, 'draft', p_change_note,
    jsonb_build_object(
      'compositionScope', v_source.composition_scope,
      'sectionRole', v_source.section_role,
      'compositionPolicy', v_source.composition_policy
    ),
    jsonb_build_object(
      'compositionScope', v_source.composition_scope,
      'sectionRole', v_source.section_role,
      'compositionPolicy', v_source.composition_policy
    )
  );
  return v_new_id;
end $$;

-- Existing Header versions receive a deterministic baseline so cloning an
-- active Header immediately carries Logo/Badges geometry into its draft.
insert into wizard_content_section_layouts (
  section_id, layout_key, name, description, is_default,
  layout_snapshot, change_note
)
select
  section.id,
  'standard_header',
  'Standard Header',
  'Logo on the left and optional badges on the right.',
  true,
  jsonb_build_object(
    'contractVersion', 1,
    'layoutMode', 'free',
    'sectionStyle', jsonb_build_object(
      'minHeight', 88,
      'backgroundColor', '#0B0D12'
    ),
    'viewports', jsonb_build_object(
      'desktop', jsonb_build_object(
        'items', jsonb_strip_nulls(jsonb_build_object(
          'logo', case when exists (
            select 1 from wizard_content_section_component_instances
            where section_id = section.id and item_key = 'logo'
          ) then '{"positionMode":"free","xPct":3,"yPx":18,"widthPct":22,"heightPx":44,"zIndex":2}'::jsonb end,
          'badges', case when exists (
            select 1 from wizard_content_section_component_instances
            where section_id = section.id and item_key = 'badges'
          ) then '{"positionMode":"free","xPct":73,"yPx":22,"widthPct":24,"heightPx":36,"zIndex":2}'::jsonb end
        )),
        'visibility', jsonb_build_object('items', '{}'::jsonb)
      ),
      'mobile', jsonb_build_object(
        'items', jsonb_strip_nulls(jsonb_build_object(
          'logo', case when exists (
            select 1 from wizard_content_section_component_instances
            where section_id = section.id and item_key = 'logo'
          ) then '{"positionMode":"free","xPct":5,"yPx":14,"widthPct":42,"heightPx":36,"zIndex":2}'::jsonb end,
          'badges', case when exists (
            select 1 from wizard_content_section_component_instances
            where section_id = section.id and item_key = 'badges'
          ) then '{"positionMode":"free","xPct":67,"yPx":18,"widthPct":28,"heightPx":28,"zIndex":2}'::jsonb end
        )),
        'visibility', jsonb_build_object('items', jsonb_build_object('badges', false))
      )
    )
  ),
  'Migration 047 default Header layout.'
from wizard_content_sections section
where section.section_role = 'header'
  and not exists (
    select 1 from wizard_content_section_layouts layout
    where layout.section_id = section.id
  )
  and exists (
    select 1 from wizard_content_section_component_instances
    where section_id = section.id and item_key = 'logo'
  );

update wizard_content_sections section
set
  ai_design = jsonb_set(
    coalesce(section.ai_design, '{}'::jsonb),
    '{allowedLayoutVariants}',
    '["standard_header"]'::jsonb,
    true
  ),
  composition_policy = jsonb_set(
    coalesce(section.composition_policy, '{}'::jsonb),
    '{allowedLayoutVariants}',
    '["standard_header"]'::jsonb,
    true
  ),
  updated_at = now()
where section.section_role = 'header'
  and exists (
    select 1 from wizard_content_section_layouts layout
    where layout.section_id = section.id and layout.layout_key = 'standard_header'
  );
