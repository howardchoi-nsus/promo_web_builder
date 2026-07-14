create extension if not exists pgcrypto;

create table if not exists wizard_form_templates (
  id uuid primary key default gen_random_uuid(),
  template_key text not null,
  name text not null,
  description text not null default '',
  status text not null default 'draft',
  version integer not null default 1,
  is_default boolean not null default false,
  change_note text not null default '',
  archived_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint wizard_form_templates_status_chk
    check (status in ('draft', 'active', 'inactive', 'archived')),
  constraint wizard_form_templates_key_version_uidx unique (template_key, version)
);

create unique index if not exists wizard_form_templates_one_active_per_key_uidx
  on wizard_form_templates (template_key)
  where status = 'active';

create unique index if not exists wizard_form_templates_one_default_active_uidx
  on wizard_form_templates (is_default)
  where status = 'active' and is_default = true;

create index if not exists wizard_form_templates_key_status_idx
  on wizard_form_templates (template_key, status);

create table if not exists wizard_form_template_sections (
  id uuid primary key default gen_random_uuid(),
  form_template_id uuid not null references wizard_form_templates (id) on delete cascade,
  section_key text not null,
  sort_order integer not null default 0,
  is_required boolean not null default false,
  is_visible boolean not null default true,
  order_change_allowed boolean not null default true,
  fixed_position text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint wizard_form_template_sections_fixed_position_chk
    check (fixed_position is null or fixed_position in ('top', 'bottom')),
  constraint wizard_form_template_sections_template_key_uidx
    unique (form_template_id, section_key)
);

create index if not exists wizard_form_template_sections_order_idx
  on wizard_form_template_sections (form_template_id, sort_order);

create table if not exists wizard_form_template_histories (
  id uuid primary key default gen_random_uuid(),
  template_key text not null,
  form_template_id uuid references wizard_form_templates (id) on delete set null,
  previous_version integer not null default 0,
  new_version integer not null default 1,
  previous_status text not null default '',
  new_status text not null default '',
  change_note text not null default '',
  changed_at timestamptz not null default now()
);

create index if not exists wizard_form_template_histories_key_idx
  on wizard_form_template_histories (template_key, changed_at desc);

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
  if exists (
    select 1 from wizard_form_templates
    where template_key = v_source.template_key and status = 'draft'
  ) then
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
    form_template_id, section_key, sort_order, is_required,
    is_visible, order_change_allowed, fixed_position
  )
  select
    v_new_id, section_key, sort_order, is_required,
    is_visible, order_change_allowed, fixed_position
  from wizard_form_template_sections
  where form_template_id = p_source_id;

  insert into wizard_form_template_histories (
    template_key, form_template_id, previous_version, new_version,
    previous_status, new_status, change_note
  ) values (
    v_source.template_key, v_new_id, v_source.version, v_next_version,
    v_source.status, 'draft', p_change_note
  );

  return v_new_id;
end $$;

create or replace function activate_wizard_form_template(
  p_target_id uuid,
  p_change_note text default 'Form template activated.'
) returns uuid
language plpgsql
as $$
declare
  v_target wizard_form_templates%rowtype;
begin
  select * into v_target from wizard_form_templates where id = p_target_id for update;
  if not found then raise exception 'Form template not found'; end if;

  perform pg_advisory_xact_lock(hashtext('wizard_form_template:' || v_target.template_key));
  if v_target.is_default then
    perform pg_advisory_xact_lock(hashtext('wizard_form_template:active_default'));
  end if;
  if v_target.status = 'archived' then raise exception 'Archived form templates cannot be activated'; end if;
  if v_target.status = 'active' then raise exception 'Form template is already active'; end if;

  update wizard_form_templates
  set status = 'inactive', updated_at = now()
  where template_key = v_target.template_key and status = 'active' and id <> p_target_id;

  if v_target.is_default then
    update wizard_form_templates
    set is_default = false, updated_at = now()
    where status = 'active' and id <> p_target_id and is_default = true;
  end if;

  update wizard_form_templates
  set status = 'active', change_note = p_change_note, archived_at = null, updated_at = now()
  where id = p_target_id;

  insert into wizard_form_template_histories (
    template_key, form_template_id, previous_version, new_version,
    previous_status, new_status, change_note
  ) values (
    v_target.template_key, p_target_id, v_target.version, v_target.version,
    v_target.status, 'active', p_change_note
  );

  return p_target_id;
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
    form_template_id, section_key, sort_order, is_required,
    is_visible, order_change_allowed, fixed_position
  )
  select
    v_new_id, section_key, sort_order, is_required,
    is_visible, order_change_allowed, fixed_position
  from wizard_form_template_sections
  where form_template_id = p_source_id;

  insert into wizard_form_template_histories (
    template_key, form_template_id, previous_version, new_version,
    previous_status, new_status, change_note
  ) values (
    p_template_key, v_new_id, v_source.version, 1,
    v_source.status, 'draft', p_change_note
  );

  return v_new_id;
end $$;

do $$
declare
  v_default_id uuid;
begin
  select id into v_default_id
  from wizard_form_templates
  where template_key = 'default' and status = 'active'
  limit 1;

  if v_default_id is null and not exists (
    select 1 from wizard_form_templates where template_key = 'default'
  ) then
    insert into wizard_form_templates (
      template_key, name, description, status, version, is_default, change_note
    ) values (
      'default', 'Default Template',
      'Migrated from the existing single Wizard Step 2 form configuration.',
      'active', 1, true, 'Created by migration 017.'
    ) returning id into v_default_id;
  end if;

  if v_default_id is not null and not exists (
    select 1 from wizard_form_templates where status = 'active' and is_default = true
  ) then
    update wizard_form_templates set is_default = true, updated_at = now()
    where id = v_default_id;
  end if;

  if v_default_id is not null then
    insert into wizard_form_template_sections (
      form_template_id, section_key, sort_order, is_required,
      is_visible, order_change_allowed, fixed_position
    )
    select
      v_default_id, section_key, sort_order, is_required,
      is_visible_in_wizard, order_change_allowed, fixed_position
    from wizard_content_sections
    where status = 'active'
    on conflict (form_template_id, section_key) do nothing;
  end if;
end $$;

comment on table wizard_form_templates is 'Versioned form groups selectable by Promo Wizard Step 2.';
comment on table wizard_form_template_sections is 'Per-template section membership and ordering overrides.';
