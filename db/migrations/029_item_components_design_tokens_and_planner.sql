create extension if not exists pgcrypto;

-- A component is a reusable section item definition.  It is intentionally
-- separate from wizard_content_sections (the previous 028 implementation
-- incorrectly used "component" for a whole section).
create table if not exists wizard_item_components (
  id uuid primary key default gen_random_uuid(),
  component_key text not null unique
    default ('cmp_' || replace(gen_random_uuid()::text, '-', '')),
  system_seed_code text unique,
  name text not null,
  description text not null default '',
  status text not null default 'active'
    check (status in ('active', 'archived')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint wizard_item_components_key_chk
    check (component_key ~ '^cmp_[a-f0-9]{32}$')
);

create table if not exists wizard_item_component_versions (
  id uuid primary key default gen_random_uuid(),
  component_id uuid not null references wizard_item_components(id) on delete restrict,
  version integer not null check (version > 0),
  status text not null default 'draft'
    check (status in ('draft', 'active', 'inactive', 'archived')),
  field_kind text not null check (field_kind in ('text', 'image', 'cta')),
  text_type text check (text_type is null or text_type in ('title', 'remark', 'multi')),
  editor_schema jsonb not null default '{}'::jsonb,
  default_value jsonb,
  capabilities jsonb not null default '{}'::jsonb,
  image_policy jsonb not null default '{}'::jsonb,
  cta_policy jsonb not null default '{}'::jsonb,
  style_slots jsonb not null default '[]'::jsonb,
  change_note text not null default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (component_id, version)
);

create unique index if not exists wizard_item_component_versions_one_active_uidx
  on wizard_item_component_versions(component_id) where status = 'active';
create index if not exists wizard_item_component_versions_status_idx
  on wizard_item_component_versions(status, component_id, version desc);

create table if not exists wizard_content_section_component_instances (
  id uuid primary key default gen_random_uuid(),
  section_id uuid not null references wizard_content_sections(id) on delete cascade,
  component_version_id uuid not null references wizard_item_component_versions(id) on delete restrict,
  item_key text not null,
  display_name text,
  is_visible_in_wizard boolean not null default true,
  is_required boolean not null default false,
  user_reorder_allowed boolean not null default true,
  sort_order integer not null default 0,
  is_locked boolean not null default false,
  locked_value jsonb,
  instance_config jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (section_id, item_key),
  constraint wizard_section_component_instance_key_chk
    check (item_key ~ '^[a-zA-Z][a-zA-Z0-9_]*$')
);
create index if not exists wizard_section_component_instances_section_idx
  on wizard_content_section_component_instances(section_id, sort_order, created_at);

-- Promo design tokens are isolated from the admin --app-* token namespace.
create table if not exists promo_design_token_definitions (
  token_key text primary key,
  category text not null,
  value_type text not null check (value_type in ('color', 'length', 'number', 'font', 'shadow', 'enum')),
  semantic_role text not null,
  css_property text not null,
  allowed_values jsonb not null default '[]'::jsonb,
  required boolean not null default false,
  ai_selectable boolean not null default false,
  editable boolean not null default true,
  constraint promo_design_token_key_chk check (token_key ~ '^--promo-[a-z0-9-]+$')
);

create table if not exists promo_design_token_sets (
  id uuid primary key default gen_random_uuid(),
  set_key text not null unique,
  name text not null,
  description text not null default '',
  status text not null default 'active' check (status in ('active', 'archived')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists promo_design_token_set_versions (
  id uuid primary key default gen_random_uuid(),
  token_set_id uuid not null references promo_design_token_sets(id) on delete restrict,
  version integer not null check (version > 0),
  status text not null default 'draft' check (status in ('draft', 'active', 'inactive', 'archived')),
  source_name text not null default '',
  source_hash text not null default '',
  change_note text not null default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (token_set_id, version)
);
create unique index if not exists promo_design_token_set_versions_one_active_uidx
  on promo_design_token_set_versions(token_set_id) where status = 'active';

create table if not exists promo_design_token_values (
  token_set_version_id uuid not null references promo_design_token_set_versions(id) on delete cascade,
  token_key text not null references promo_design_token_definitions(token_key) on delete restrict,
  token_value text not null,
  metadata jsonb not null default '{}'::jsonb,
  primary key (token_set_version_id, token_key)
);

alter table wizard_form_templates
  add column if not exists design_token_set_version_id uuid
    references promo_design_token_set_versions(id) on delete restrict;

-- Migration 028 originally introduced this snapshot and changed the template
-- foreign key to preserve completed AI run history.  Keep 029 independently
-- applicable because some environments intentionally skipped the incorrect
-- section-as-component migration.
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

-- New planner metadata is additive so old generated promo snapshots remain readable.
alter table promo_section_design_runs
  add column if not exists request_mode text not null default 'full'
    check (request_mode in ('full', 'layout-style', 'assets')),
  add column if not exists component_versions_snapshot jsonb not null default '[]'::jsonb,
  add column if not exists token_set_version_id uuid
    references promo_design_token_set_versions(id) on delete restrict,
  add column if not exists base_revision jsonb not null default '{}'::jsonb,
  add column if not exists design_plan jsonb,
  add column if not exists effective_patch jsonb;

create table if not exists promo_section_design_asset_jobs (
  id uuid primary key default gen_random_uuid(),
  run_id uuid not null references promo_section_design_runs(id) on delete cascade,
  target_type text not null check (target_type in ('section-background', 'item')),
  target_item_key text,
  status text not null default 'queued'
    check (status in ('queued', 'processing', 'ready', 'failed', 'cancelled')),
  request_snapshot jsonb not null default '{}'::jsonb,
  result_snapshot jsonb,
  current_attempt integer not null default 0,
  error_code text,
  error_message text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  completed_at timestamptz,
  unique (run_id, target_type, target_item_key)
);
create unique index if not exists promo_section_design_asset_jobs_background_uidx
  on promo_section_design_asset_jobs(run_id, target_type)
  where target_type = 'section-background';
create unique index if not exists promo_section_design_asset_jobs_item_uidx
  on promo_section_design_asset_jobs(run_id, target_item_key)
  where target_type = 'item';

-- Draft cloning pins the same immutable component versions.  A later admin
-- action may explicitly replace a version in the new section draft.
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
  if exists (select 1 from wizard_content_sections where section_key = v_source.section_key and status = 'draft') then
    raise exception 'A draft already exists for this section';
  end if;
  select coalesce(max(version), 0) + 1 into v_next_version
  from wizard_content_sections where section_key = v_source.section_key;

  insert into wizard_content_sections (
    section_key, name, description, is_required, order_change_allowed, fixed_position,
    sort_order, is_visible_in_wizard, status, version, change_note, owner_form_template_id, ai_design
  ) values (
    v_source.section_key, v_source.name, v_source.description, v_source.is_required,
    v_source.order_change_allowed, v_source.fixed_position, v_source.sort_order,
    v_source.is_visible_in_wizard, 'draft', v_next_version, p_change_note, null, v_source.ai_design
  ) returning id into v_new_id;

  insert into wizard_content_section_component_instances (
    section_id, component_version_id, item_key, display_name, is_visible_in_wizard,
    is_required, user_reorder_allowed, sort_order, is_locked, locked_value, instance_config
  )
  select v_new_id, component_version_id, item_key, display_name, is_visible_in_wizard,
    is_required, user_reorder_allowed, sort_order, is_locked, locked_value, instance_config
  from wizard_content_section_component_instances where section_id = p_source_id;

  insert into wizard_content_section_histories (
    section_key, section_id, previous_version, new_version, previous_status, new_status, change_note
  ) values (v_source.section_key, v_new_id, v_source.version, v_next_version, v_source.status, 'draft', p_change_note);
  return v_new_id;
end $$;

-- Contract 028 used the word component for a whole section.  Remove that
-- compatibility model after the item-component resolver is available.
drop view if exists wizard_section_component_usage;
drop index if exists wizard_form_template_sections_template_component_uidx;
drop index if exists wizard_form_template_sections_component_idx;
drop index if exists wizard_content_sections_one_active_per_component_uidx;
drop index if exists wizard_content_sections_component_status_idx;
alter table wizard_form_template_sections drop column if exists component_id;
alter table wizard_content_sections drop column if exists component_id;
drop table if exists wizard_section_components;

create or replace function activate_wizard_content_section(
  p_target_id uuid,
  p_change_note text default 'Section activated.'
) returns uuid
language plpgsql
as $$
declare v_target wizard_content_sections%rowtype;
begin
  select * into v_target from wizard_content_sections where id = p_target_id for update;
  if not found then raise exception 'Section not found'; end if;
  perform pg_advisory_xact_lock(hashtext('wizard_content_section:' || v_target.section_key));
  if v_target.status = 'archived' then raise exception 'Archived sections cannot be activated'; end if;
  if v_target.status = 'active' then raise exception 'Section is already active'; end if;
  if not exists (
    select 1 from wizard_content_section_component_instances instance
    join wizard_item_component_versions version on version.id = instance.component_version_id
    where instance.section_id = p_target_id and instance.is_visible_in_wizard = true
      and version.status in ('active', 'inactive')
  ) then raise exception 'Section requires at least one visible component instance'; end if;
  update wizard_content_sections set status = 'inactive', updated_at = now()
  where section_key = v_target.section_key and status = 'active' and id <> p_target_id;
  update wizard_content_sections set status = 'active', change_note = p_change_note,
    archived_at = null, updated_at = now() where id = p_target_id;
  insert into wizard_content_section_histories (
    section_key, section_id, previous_version, new_version, previous_status, new_status, change_note
  ) values (v_target.section_key, p_target_id, v_target.version, v_target.version, v_target.status, 'active', p_change_note);
  return p_target_id;
end $$;

create or replace function clone_wizard_form_template_draft(
  p_source_id uuid,
  p_change_note text default 'Draft created from existing form template.'
) returns uuid
language plpgsql
as $$
declare v_source wizard_form_templates%rowtype; v_new_id uuid; v_next_version integer;
begin
  select * into v_source from wizard_form_templates where id = p_source_id for update;
  if not found then raise exception 'Form template not found'; end if;
  perform pg_advisory_xact_lock(hashtext('wizard_form_template:' || v_source.template_key));
  if exists (select 1 from wizard_form_templates where template_key = v_source.template_key and status = 'draft') then
    raise exception 'A draft already exists for this form template';
  end if;
  select coalesce(max(version), 0) + 1 into v_next_version from wizard_form_templates where template_key = v_source.template_key;
  insert into wizard_form_templates (
    template_key, name, description, status, version, is_default, change_note, design_token_set_version_id
  ) values (
    v_source.template_key, v_source.name, v_source.description, 'draft', v_next_version,
    v_source.is_default, p_change_note, v_source.design_token_set_version_id
  ) returning id into v_new_id;
  insert into wizard_form_template_sections (
    form_template_id, section_id, section_key, sort_order, is_required, is_visible,
    order_change_allowed, user_reorder_allowed, fixed_position
  ) select v_new_id, section_id, section_key, sort_order, is_required, is_visible,
    order_change_allowed, user_reorder_allowed, fixed_position
  from wizard_form_template_sections where form_template_id = p_source_id;
  insert into wizard_form_template_histories (
    template_key, form_template_id, previous_version, new_version, previous_status, new_status, change_note
  ) values (v_source.template_key, v_new_id, v_source.version, v_next_version, v_source.status, 'draft', p_change_note);
  return v_new_id;
end $$;

create or replace function duplicate_wizard_form_template(
  p_source_id uuid, p_template_key text, p_name text, p_description text default '',
  p_change_note text default 'Form template duplicated.'
) returns uuid
language plpgsql
as $$
declare v_source wizard_form_templates%rowtype; v_new_id uuid;
begin
  select * into v_source from wizard_form_templates where id = p_source_id;
  if not found then raise exception 'Source form template not found'; end if;
  if exists (select 1 from wizard_form_templates where template_key = p_template_key) then raise exception 'Form template key already exists'; end if;
  insert into wizard_form_templates (
    template_key, name, description, status, version, is_default, change_note, design_token_set_version_id
  ) values (p_template_key, p_name, p_description, 'draft', 1, false, p_change_note, v_source.design_token_set_version_id)
  returning id into v_new_id;
  insert into wizard_form_template_sections (
    form_template_id, section_id, section_key, sort_order, is_required, is_visible,
    order_change_allowed, user_reorder_allowed, fixed_position
  ) select v_new_id, section_id, section_key, sort_order, is_required, is_visible,
    order_change_allowed, user_reorder_allowed, fixed_position
  from wizard_form_template_sections where form_template_id = p_source_id;
  return v_new_id;
end $$;
