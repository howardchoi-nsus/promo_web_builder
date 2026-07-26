-- Full theme token contract:
-- - preserves every source CSV row, including ordered list values
-- - keeps light/dark source values and one resolved runtime value
-- - accepts both legacy --promo-* and imported --app-* namespaces

alter table promo_design_token_definitions
  drop constraint if exists promo_design_token_definitions_value_type_check;
alter table promo_design_token_definitions
  add constraint promo_design_token_definitions_value_type_check
  check (value_type in (
    'color', 'length', 'number', 'font', 'fontFamily', 'shadow', 'gradient',
    'duration', 'easing', 'enum'
  ));

alter table promo_design_token_definitions
  drop constraint if exists promo_design_token_key_chk;
alter table promo_design_token_definitions
  add constraint promo_design_token_key_chk
  check (token_key ~ '^--(promo|app)-[a-z0-9-]+$');

alter table promo_design_token_definitions
  add column if not exists category_label text not null default '',
  add column if not exists label text not null default '',
  add column if not exists unit text not null default '',
  add column if not exists themeable boolean not null default false,
  add column if not exists cardinality text not null default 'single'
    check (cardinality in ('single', 'list')),
  add column if not exists css_properties jsonb not null default '[]'::jsonb,
  add column if not exists source_metadata jsonb not null default '{}'::jsonb;

update promo_design_token_definitions
set css_properties = jsonb_build_array(css_property)
where css_properties = '[]'::jsonb;

alter table promo_design_token_values
  add column if not exists value_index integer not null default 0
    check (value_index >= 0),
  add column if not exists value_light text not null default '',
  add column if not exists value_dark text not null default '',
  add column if not exists active_theme text not null default 'dark'
    check (active_theme in ('light', 'dark'));

update promo_design_token_values
set value_light = case when value_light = '' then token_value else value_light end,
    value_dark = case when value_dark = '' then token_value else value_dark end;

alter table promo_design_token_values
  drop constraint if exists promo_design_token_values_pkey;
alter table promo_design_token_values
  add constraint promo_design_token_values_pkey
  primary key (token_set_version_id, token_key, value_index);

create or replace function create_promo_design_token_draft(
  p_token_set_id uuid,
  p_source_version_id uuid default null,
  p_values jsonb default null,
  p_source_name text default '',
  p_source_hash text default '',
  p_change_note text default 'Design token draft created.',
  p_history_action text default 'draft_created'
) returns uuid
language plpgsql
as $$
declare
  v_set promo_design_token_sets%rowtype;
  v_source promo_design_token_set_versions%rowtype;
  v_version_id uuid;
  v_next_version integer;
begin
  select * into v_set from promo_design_token_sets where id = p_token_set_id for update;
  if not found then raise exception 'Design token set not found'; end if;
  if v_set.status <> 'active' then raise exception 'Archived design token sets cannot create drafts'; end if;
  perform pg_advisory_xact_lock(hashtext('promo_design_token_set:' || p_token_set_id::text));
  if exists (
    select 1 from promo_design_token_set_versions
    where token_set_id = p_token_set_id and status = 'draft'
  ) then raise exception 'A draft already exists for this design token set'; end if;

  if p_source_version_id is not null then
    select * into v_source from promo_design_token_set_versions
    where id = p_source_version_id and token_set_id = p_token_set_id;
    if not found then raise exception 'Source design token version was not found in this set'; end if;
  end if;

  select coalesce(max(version), 0) + 1 into v_next_version
  from promo_design_token_set_versions where token_set_id = p_token_set_id;

  insert into promo_design_token_set_versions (
    token_set_id, version, status, source_name, source_hash, change_note
  ) values (
    p_token_set_id, v_next_version, 'draft',
    coalesce(nullif(p_source_name, ''), v_source.source_name, ''),
    coalesce(nullif(p_source_hash, ''), v_source.source_hash, ''),
    coalesce(nullif(p_change_note, ''), 'Design token draft created.')
  ) returning id into v_version_id;

  if p_values is not null then
    insert into promo_design_token_values (
      token_set_version_id, token_key, value_index, token_value,
      value_light, value_dark, active_theme, metadata
    )
    select
      v_version_id,
      value->>'tokenKey',
      coalesce((value->>'valueIndex')::integer, 0),
      value->>'value',
      coalesce(value->>'valueLight', value->>'value', ''),
      coalesce(value->>'valueDark', ''),
      coalesce(nullif(value->>'activeTheme', ''), 'dark'),
      coalesce(value->'metadata', '{}'::jsonb)
    from jsonb_array_elements(p_values) value;
  elsif p_source_version_id is not null then
    insert into promo_design_token_values (
      token_set_version_id, token_key, value_index, token_value,
      value_light, value_dark, active_theme, metadata
    )
    select v_version_id, token_key, value_index, token_value,
      value_light, value_dark, active_theme, metadata
    from promo_design_token_values
    where token_set_version_id = p_source_version_id;
  end if;

  insert into promo_design_token_histories (
    token_set_id, token_set_version_id, action, new_status, change_note, snapshot
  ) values (
    p_token_set_id, v_version_id,
    case when p_history_action in ('draft_created', 'imported', 'rollback_draft_created')
      then p_history_action else 'draft_created' end,
    'draft', coalesce(p_change_note, ''),
    jsonb_build_object(
      'version', v_next_version,
      'sourceVersionId', p_source_version_id,
      'tokenCount', (select count(*) from promo_design_token_values where token_set_version_id = v_version_id)
    )
  );
  return v_version_id;
end $$;

create or replace function replace_promo_design_token_draft_values(
  p_version_id uuid,
  p_values jsonb,
  p_source_name text default '',
  p_source_hash text default '',
  p_change_note text default 'Design token draft updated.',
  p_history_action text default 'draft_updated'
) returns uuid
language plpgsql
as $$
declare
  v_version promo_design_token_set_versions%rowtype;
begin
  select * into v_version from promo_design_token_set_versions
  where id = p_version_id for update;
  if not found then raise exception 'Design token version not found'; end if;
  if v_version.status <> 'draft' then raise exception 'Only draft design token versions can be edited'; end if;
  perform pg_advisory_xact_lock(hashtext('promo_design_token_set:' || v_version.token_set_id::text));

  delete from promo_design_token_values where token_set_version_id = p_version_id;
  insert into promo_design_token_values (
    token_set_version_id, token_key, value_index, token_value,
    value_light, value_dark, active_theme, metadata
  )
  select
    p_version_id,
    value->>'tokenKey',
    coalesce((value->>'valueIndex')::integer, 0),
    value->>'value',
    coalesce(value->>'valueLight', value->>'value', ''),
    coalesce(value->>'valueDark', ''),
    coalesce(nullif(value->>'activeTheme', ''), 'dark'),
    coalesce(value->'metadata', '{}'::jsonb)
  from jsonb_array_elements(coalesce(p_values, '[]'::jsonb)) value;

  update promo_design_token_set_versions
  set source_name = coalesce(nullif(p_source_name, ''), source_name),
      source_hash = coalesce(nullif(p_source_hash, ''), source_hash),
      change_note = coalesce(nullif(p_change_note, ''), change_note),
      updated_at = now()
  where id = p_version_id;

  insert into promo_design_token_histories (
    token_set_id, token_set_version_id, action,
    previous_status, new_status, change_note, snapshot
  ) values (
    v_version.token_set_id, p_version_id,
    case when p_history_action = 'imported' then 'imported' else 'draft_updated' end,
    'draft', 'draft', coalesce(p_change_note, ''),
    jsonb_build_object(
      'version', v_version.version,
      'tokenCount', (select count(*) from promo_design_token_values where token_set_version_id = p_version_id)
    )
  );
  return p_version_id;
end $$;

create or replace function clone_promo_design_token_set(
  p_source_version_id uuid,
  p_set_key text,
  p_name text,
  p_description text default '',
  p_change_note text default 'Design token set cloned.'
) returns uuid
language plpgsql
as $$
declare
  v_source promo_design_token_set_versions%rowtype;
  v_set_id uuid;
  v_version_id uuid;
begin
  select * into v_source from promo_design_token_set_versions where id = p_source_version_id;
  if not found then raise exception 'Source design token version not found'; end if;
  insert into promo_design_token_sets (set_key, name, description)
  values (p_set_key, p_name, coalesce(p_description, '')) returning id into v_set_id;
  insert into promo_design_token_set_versions (
    token_set_id, version, status, source_name, source_hash, change_note
  ) values (
    v_set_id, 1, 'draft', v_source.source_name, v_source.source_hash, p_change_note
  ) returning id into v_version_id;
  insert into promo_design_token_values (
    token_set_version_id, token_key, value_index, token_value,
    value_light, value_dark, active_theme, metadata
  )
  select v_version_id, token_key, value_index, token_value,
    value_light, value_dark, active_theme, metadata
  from promo_design_token_values where token_set_version_id = p_source_version_id;
  insert into promo_design_token_histories (
    token_set_id, token_set_version_id, action, new_status, change_note, snapshot
  ) values (
    v_set_id, v_version_id, 'set_cloned', 'draft', coalesce(p_change_note, ''),
    jsonb_build_object(
      'setKey', p_set_key, 'name', p_name, 'sourceVersionId', p_source_version_id,
      'tokenCount', (select count(*) from promo_design_token_values where token_set_version_id = v_version_id)
    )
  );
  return v_version_id;
end $$;

comment on column promo_design_token_values.value_index is
  'Zero-based source order for list-valued tokens such as layered backgrounds.';
comment on column promo_design_token_values.token_value is
  'Resolved runtime value for active_theme. Original light and dark values remain preserved.';

with messages(locale, message_key, value) as (
  values
    ('ko', 'admin.designToken.scopeNotice', 'CSV의 --app-* 및 --promo-* 토큰 전체를 보존하고, 프로모션 출력 전용 런타임 변수로 안전하게 매핑합니다.'),
    ('ko', 'admin.designToken.importValidated', 'CSV 전체 토큰을 Dark 기준 초안으로 가져왔습니다.'),
    ('en', 'admin.designToken.scopeNotice', 'Preserve complete --app-* and --promo-* CSV token sets and map them safely to promotion-only runtime variables.'),
    ('en', 'admin.designToken.importValidated', 'Imported the complete CSV as a Dark-theme draft.')
), deactivated as (
  update locale_message_versions current
  set status = 'inactive', updated_at = now()
  from messages
  where current.locale = messages.locale
    and current.message_key = messages.message_key
    and current.status = 'active'
  returning current.locale, current.message_key
), next_versions as (
  select messages.*,
    coalesce((
      select max(version) + 1
      from locale_message_versions existing
      where existing.locale = messages.locale
        and existing.message_key = messages.message_key
    ), 1) as next_version
  from messages
)
insert into locale_message_versions (
  locale, message_key, value, status, version, change_note, changed_by
)
select locale, message_key, value, 'active', next_version,
  'Updated for full Dark theme design token import.', 'migration-038'
from next_versions
where exists (select 1 from locales where code = next_versions.locale);

update locales
set snapshot_revision = snapshot_revision + 1, updated_at = now()
where code in ('ko', 'en');
