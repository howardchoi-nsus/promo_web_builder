-- Registry-scoped sections and Blank Composition Shell management.

alter table wizard_content_sections
  drop constraint if exists wizard_content_sections_composition_scope_chk;
alter table wizard_content_sections
  add constraint wizard_content_sections_composition_scope_chk
  check (composition_scope in ('shared', 'template', 'registry'));

alter table wizard_content_sections
  drop constraint if exists wizard_content_sections_registry_owner_chk;
alter table wizard_content_sections
  add constraint wizard_content_sections_registry_owner_chk
  check (composition_scope <> 'registry' or owner_form_template_id is null);

alter table promo_composition_shell_versions
  add column if not exists fallback_template_id uuid
    references wizard_form_templates(id) on delete restrict,
  add column if not exists fallback_template_version integer;

alter table promo_composition_shell_versions
  drop constraint if exists promo_composition_shell_versions_fallback_chk;
alter table promo_composition_shell_versions
  add constraint promo_composition_shell_versions_fallback_chk
  check (
    (fallback_template_id is null and fallback_template_version is null)
    or (fallback_template_id is not null and fallback_template_version > 0)
  );

create or replace function create_promo_composition_shell(
  p_shell_key text,
  p_name text,
  p_description text,
  p_config_json jsonb,
  p_fallback_template_id uuid,
  p_fallback_template_version integer,
  p_change_note text
) returns uuid
language plpgsql
as $$
declare
  v_shell_id uuid;
  v_version_id uuid;
begin
  if trim(coalesce(p_shell_key, '')) !~ '^[a-z][a-z0-9-]{1,79}$' then
    raise exception 'Invalid composition shell key';
  end if;
  if length(trim(coalesce(p_name, ''))) = 0 then
    raise exception 'Composition shell name is required';
  end if;
  if jsonb_typeof(p_config_json) <> 'object' then
    raise exception 'Composition shell config must be a JSON object';
  end if;

  insert into promo_composition_shells (shell_key, name, description, status)
  values (p_shell_key, p_name, coalesce(p_description, ''), 'active')
  returning id into v_shell_id;

  insert into promo_composition_shell_versions (
    shell_id, version, status, config_json,
    fallback_template_id, fallback_template_version, change_note
  ) values (
    v_shell_id, 1, 'draft', p_config_json,
    p_fallback_template_id, p_fallback_template_version, coalesce(p_change_note, '')
  ) returning id into v_version_id;

  return v_version_id;
end $$;

create or replace function clone_promo_composition_shell_version(
  p_source_version_id uuid,
  p_change_note text
) returns uuid
language plpgsql
as $$
declare
  v_source promo_composition_shell_versions%rowtype;
  v_next_version integer;
  v_version_id uuid;
begin
  select * into v_source
  from promo_composition_shell_versions
  where id = p_source_version_id
  for update;
  if not found then raise exception 'Composition shell version not found'; end if;

  perform pg_advisory_xact_lock(hashtext('promo_composition_shell:' || v_source.shell_id::text));
  if exists (
    select 1 from promo_composition_shell_versions
    where shell_id = v_source.shell_id and status = 'draft'
  ) then raise exception 'A composition shell draft already exists'; end if;

  select coalesce(max(version), 0) + 1 into v_next_version
  from promo_composition_shell_versions
  where shell_id = v_source.shell_id;

  insert into promo_composition_shell_versions (
    shell_id, version, status, config_json,
    fallback_template_id, fallback_template_version, change_note
  ) values (
    v_source.shell_id, v_next_version, 'draft', v_source.config_json,
    v_source.fallback_template_id, v_source.fallback_template_version,
    coalesce(p_change_note, 'Composition shell draft created.')
  ) returning id into v_version_id;
  return v_version_id;
end $$;

create or replace function activate_promo_composition_shell_version(
  p_version_id uuid,
  p_change_note text
) returns uuid
language plpgsql
as $$
declare
  v_target promo_composition_shell_versions%rowtype;
  v_shell promo_composition_shells%rowtype;
begin
  select * into v_target
  from promo_composition_shell_versions
  where id = p_version_id
  for update;
  if not found then raise exception 'Composition shell version not found'; end if;

  select * into v_shell
  from promo_composition_shells
  where id = v_target.shell_id
  for update;
  if v_shell.status <> 'active' then raise exception 'Composition shell is not active'; end if;
  if v_target.status = 'archived' then raise exception 'Archived composition shell versions cannot be activated'; end if;
  if jsonb_typeof(v_target.config_json) <> 'object' then
    raise exception 'Composition shell config must be a JSON object';
  end if;
  if v_target.fallback_template_id is not null and not exists (
    select 1 from wizard_form_templates template
    where template.id = v_target.fallback_template_id
      and template.version = v_target.fallback_template_version
      and template.status = 'active'
  ) then raise exception 'Active fallback template version not found'; end if;

  update promo_composition_shell_versions
  set status = 'inactive', updated_at = now()
  where shell_id = v_target.shell_id and status = 'active' and id <> p_version_id;

  update promo_composition_shell_versions
  set status = 'active', change_note = coalesce(p_change_note, ''), updated_at = now()
  where id = p_version_id;

  return p_version_id;
end $$;
