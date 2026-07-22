create table if not exists wizard_section_components (
  id uuid primary key default gen_random_uuid(),
  component_key text not null unique,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint wizard_section_components_key_chk
    check (component_key ~ '^[a-zA-Z][a-zA-Z0-9_]*$')
);

comment on table wizard_section_components is
  'Stable logical identities for reusable, versioned Wizard section components.';

insert into wizard_section_components (component_key)
select distinct section_key
from wizard_content_sections
where nullif(trim(section_key), '') is not null
on conflict (component_key) do nothing;

alter table wizard_content_sections
  add column if not exists component_id uuid references wizard_section_components(id) on delete restrict;

update wizard_content_sections section
set component_id = component.id
from wizard_section_components component
where section.component_id is null
  and component.component_key = section.section_key;

alter table wizard_form_template_sections
  add column if not exists component_id uuid references wizard_section_components(id) on delete restrict;

update wizard_form_template_sections membership
set component_id = component.id
from wizard_section_components component
where membership.component_id is null
  and component.component_key = membership.section_key;

create index if not exists wizard_content_sections_component_status_idx
  on wizard_content_sections(component_id, status, version desc);

create unique index if not exists wizard_content_sections_one_active_per_component_uidx
  on wizard_content_sections(component_id)
  where status = 'active' and component_id is not null;

create unique index if not exists wizard_form_template_sections_template_component_uidx
  on wizard_form_template_sections(form_template_id, component_id)
  where component_id is not null;

create index if not exists wizard_form_template_sections_component_idx
  on wizard_form_template_sections(component_id, form_template_id);

create or replace view wizard_section_component_usage as
select
  component.id as component_id,
  component.component_key,
  count(distinct template.id) filter (
    where template.status in ('active', 'draft')
  )::integer as template_count,
  coalesce(
    jsonb_agg(distinct jsonb_build_object(
      'id', template.id,
      'templateKey', template.template_key,
      'name', template.name,
      'version', template.version,
      'status', template.status
    )) filter (where template.id is not null and template.status in ('active', 'draft')),
    '[]'::jsonb
  ) as templates
from wizard_section_components component
left join wizard_form_template_sections membership
  on membership.component_id = component.id
left join wizard_form_templates template
  on template.id = membership.form_template_id
group by component.id, component.component_key;

alter table promo_section_design_runs
  add column if not exists template_key_snapshot text;

update promo_section_design_runs run
set template_key_snapshot = template.template_key
from wizard_form_templates template
where run.form_template_id = template.id
  and nullif(trim(run.template_key_snapshot), '') is null;

alter table promo_section_design_runs
  alter column form_template_id drop not null;

alter table promo_section_design_runs
  drop constraint if exists promo_section_design_runs_form_template_id_fkey;

alter table promo_section_design_runs
  add constraint promo_section_design_runs_form_template_id_fkey
  foreign key (form_template_id) references wizard_form_templates(id) on delete set null;

comment on column promo_section_design_runs.template_key_snapshot is
  'Immutable template key captured when the section AI design run is created.';

create or replace function prevent_wizard_template_delete_with_active_section_runs()
returns trigger
language plpgsql
as $$
begin
  if exists (
    select 1
    from promo_section_design_runs run
    where run.form_template_id = old.id
      and run.status in (
        'queued', 'analyzing_content', 'generating_layout', 'validating_layout',
        'generating_assets', 'validating_assets', 'ready'
      )
  ) then
    raise exception 'Template % has active section AI design runs and cannot be deleted', old.id;
  end if;
  return old;
end $$;

drop trigger if exists wizard_template_active_section_run_delete_guard on wizard_form_templates;
create trigger wizard_template_active_section_run_delete_guard
before delete on wizard_form_templates
for each row execute function prevent_wizard_template_delete_with_active_section_runs();

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
  if v_source.component_id is null then raise exception 'Section component identity is missing'; end if;
  perform pg_advisory_xact_lock(hashtext('wizard_section_component:' || v_source.component_id::text));

  if exists (
    select 1 from wizard_content_sections
    where component_id = v_source.component_id and status = 'draft'
  ) then
    raise exception 'A draft already exists for this component';
  end if;

  select coalesce(max(version), 0) + 1 into v_next_version
  from wizard_content_sections where component_id = v_source.component_id;

  insert into wizard_content_sections (
    component_id, section_key, name, description, is_required, order_change_allowed,
    fixed_position, sort_order, is_visible_in_wizard, status, version,
    change_note, owner_form_template_id, ai_design
  ) values (
    v_source.component_id, v_source.section_key, v_source.name, v_source.description,
    v_source.is_required, v_source.order_change_allowed, v_source.fixed_position,
    v_source.sort_order, v_source.is_visible_in_wizard, 'draft', v_next_version,
    p_change_note, null, v_source.ai_design
  ) returning id into v_new_id;

  insert into wizard_content_section_items (
    section_id, item_key, name, is_visible_in_wizard, is_required, user_reorder_allowed,
    sort_order, field_kind, text_type, image_allowed_sources, image_prompt_text,
    image_description_enabled, image_alt_text_required, image_aspect_ratio, image_max_size_kb,
    cta_utm_source, cta_utm_medium, cta_utm_campaign, cta_utm_content, cta_utm_term,
    is_locked, locked_value
  )
  select
    v_new_id, item_key, name, is_visible_in_wizard, is_required, user_reorder_allowed,
    sort_order, field_kind, text_type, image_allowed_sources, image_prompt_text,
    image_description_enabled, image_alt_text_required, image_aspect_ratio, image_max_size_kb,
    cta_utm_source, cta_utm_medium, cta_utm_campaign, cta_utm_content, cta_utm_term,
    is_locked, locked_value
  from wizard_content_section_items where section_id = p_source_id;

  insert into wizard_content_section_histories (
    section_key, section_id, previous_version, new_version,
    previous_status, new_status, change_note
  ) values (
    v_source.section_key, v_new_id, v_source.version, v_next_version,
    v_source.status, 'draft', p_change_note
  );
  return v_new_id;
end $$;

create or replace function activate_wizard_content_section(
  p_target_id uuid,
  p_change_note text default 'Section component activated.'
) returns uuid
language plpgsql
as $$
declare
  v_target wizard_content_sections%rowtype;
begin
  select * into v_target from wizard_content_sections where id = p_target_id for update;
  if not found then raise exception 'Section component not found'; end if;
  if v_target.component_id is null then raise exception 'Section component identity is missing'; end if;
  perform pg_advisory_xact_lock(hashtext('wizard_section_component:' || v_target.component_id::text));
  if v_target.status = 'archived' then raise exception 'Archived component versions cannot be activated'; end if;
  if v_target.status = 'active' then raise exception 'Component version is already active'; end if;

  insert into wizard_content_section_histories (
    section_key, section_id, previous_version, new_version,
    previous_status, new_status, change_note
  )
  select section_key, id, version, version, status, 'inactive',
    'Superseded by component version ' || v_target.version || '.'
  from wizard_content_sections
  where component_id = v_target.component_id and status = 'active' and id <> p_target_id;

  update wizard_content_sections
  set status = 'inactive', updated_at = now()
  where component_id = v_target.component_id and status = 'active' and id <> p_target_id;

  update wizard_content_sections
  set status = 'active', change_note = p_change_note, archived_at = null, updated_at = now()
  where id = p_target_id;

  insert into wizard_content_section_histories (
    section_key, section_id, previous_version, new_version,
    previous_status, new_status, change_note
  ) values (
    v_target.section_key, p_target_id, v_target.version, v_target.version,
    v_target.status, 'active', p_change_note
  );
  return p_target_id;
end $$;

create or replace function clone_wizard_form_template_draft(
  p_source_id uuid,
  p_change_note text default 'Draft created from existing form template.'
) returns uuid
language plpgsql
as $$
declare
  v_source wizard_form_templates%rowtype;
  v_new_id uuid;
  v_next_version integer;
begin
  select * into v_source from wizard_form_templates where id = p_source_id for update;
  if not found then raise exception 'Form template not found'; end if;
  perform pg_advisory_xact_lock(hashtext('wizard_form_template:' || v_source.template_key));
  if exists (select 1 from wizard_form_templates where template_key = v_source.template_key and status = 'draft') then
    raise exception 'A draft already exists for this form template';
  end if;
  select coalesce(max(version), 0) + 1 into v_next_version
  from wizard_form_templates where template_key = v_source.template_key;

  insert into wizard_form_templates (
    template_key, name, description, status, version, is_default, change_note
  ) values (
    v_source.template_key, v_source.name, v_source.description,
    'draft', v_next_version, v_source.is_default, p_change_note
  ) returning id into v_new_id;

  insert into wizard_form_template_sections (
    form_template_id, component_id, section_id, section_key, sort_order, is_required,
    is_visible, order_change_allowed, user_reorder_allowed, fixed_position
  )
  select v_new_id, component_id, null, section_key, sort_order, is_required,
    is_visible, order_change_allowed, user_reorder_allowed, fixed_position
  from wizard_form_template_sections where form_template_id = p_source_id;

  insert into wizard_form_template_histories (
    template_key, form_template_id, previous_version, new_version,
    previous_status, new_status, change_note
  ) values (
    v_source.template_key, v_new_id, v_source.version, v_next_version,
    v_source.status, 'draft', p_change_note
  );
  return v_new_id;
end $$;

create or replace function duplicate_wizard_form_template(
  p_source_id uuid,
  p_template_key text,
  p_name text,
  p_description text default '',
  p_change_note text default 'Form template duplicated.'
) returns uuid
language plpgsql
as $$
declare
  v_source wizard_form_templates%rowtype;
  v_new_id uuid;
begin
  select * into v_source from wizard_form_templates where id = p_source_id;
  if not found then raise exception 'Source form template not found'; end if;
  perform pg_advisory_xact_lock(hashtext('wizard_form_template:' || p_template_key));
  if exists (select 1 from wizard_form_templates where template_key = p_template_key) then
    raise exception 'Form template key already exists';
  end if;

  insert into wizard_form_templates (
    template_key, name, description, status, version, is_default, change_note
  ) values (
    p_template_key, p_name, p_description, 'draft', 1, false, p_change_note
  ) returning id into v_new_id;

  insert into wizard_form_template_sections (
    form_template_id, component_id, section_id, section_key, sort_order, is_required,
    is_visible, order_change_allowed, user_reorder_allowed, fixed_position
  )
  select v_new_id, component_id, null, section_key, sort_order, is_required,
    is_visible, order_change_allowed, user_reorder_allowed, fixed_position
  from wizard_form_template_sections where form_template_id = p_source_id;

  insert into wizard_form_template_histories (
    template_key, form_template_id, previous_version, new_version,
    previous_status, new_status, change_note
  ) values (
    p_template_key, v_new_id, v_source.version, 1,
    v_source.status, 'draft', p_change_note
  );
  return v_new_id;
end $$;
