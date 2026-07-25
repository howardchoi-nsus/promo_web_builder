create extension if not exists pgcrypto;

create table if not exists promo_design_token_histories (
  id uuid primary key default gen_random_uuid(),
  token_set_id uuid not null references promo_design_token_sets(id) on delete restrict,
  token_set_version_id uuid references promo_design_token_set_versions(id) on delete set null,
  action text not null check (action in (
    'set_created', 'set_updated', 'set_cloned', 'set_archived',
    'draft_created', 'draft_updated', 'imported', 'validated',
    'activated', 'rollback_draft_created'
  )),
  previous_status text,
  new_status text,
  change_note text not null default '',
  snapshot jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists promo_design_token_histories_set_idx
  on promo_design_token_histories(token_set_id, created_at desc);

comment on table promo_design_token_histories is
  'Immutable lifecycle history for managed promotion design token sets and versions.';

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
  select * into v_set
  from promo_design_token_sets
  where id = p_token_set_id
  for update;

  if not found then raise exception 'Design token set not found'; end if;
  if v_set.status <> 'active' then raise exception 'Archived design token sets cannot create drafts'; end if;

  perform pg_advisory_xact_lock(hashtext('promo_design_token_set:' || p_token_set_id::text));

  if exists (
    select 1 from promo_design_token_set_versions
    where token_set_id = p_token_set_id and status = 'draft'
  ) then
    raise exception 'A draft already exists for this design token set';
  end if;

  if p_source_version_id is not null then
    select * into v_source
    from promo_design_token_set_versions
    where id = p_source_version_id and token_set_id = p_token_set_id;
    if not found then raise exception 'Source design token version was not found in this set'; end if;
  end if;

  select coalesce(max(version), 0) + 1 into v_next_version
  from promo_design_token_set_versions
  where token_set_id = p_token_set_id;

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
      token_set_version_id, token_key, token_value, metadata
    )
    select
      v_version_id,
      value->>'tokenKey',
      value->>'value',
      coalesce(value->'metadata', '{}'::jsonb)
    from jsonb_array_elements(p_values) value;
  elsif p_source_version_id is not null then
    insert into promo_design_token_values (
      token_set_version_id, token_key, token_value, metadata
    )
    select v_version_id, token_key, token_value, metadata
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
  select * into v_version
  from promo_design_token_set_versions
  where id = p_version_id
  for update;

  if not found then raise exception 'Design token version not found'; end if;
  if v_version.status <> 'draft' then raise exception 'Only draft design token versions can be edited'; end if;

  perform pg_advisory_xact_lock(hashtext('promo_design_token_set:' || v_version.token_set_id::text));

  delete from promo_design_token_values
  where token_set_version_id = p_version_id;

  insert into promo_design_token_values (
    token_set_version_id, token_key, token_value, metadata
  )
  select
    p_version_id,
    value->>'tokenKey',
    value->>'value',
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

create or replace function activate_promo_design_token_version(
  p_version_id uuid,
  p_change_note text default 'Design token version activated.'
) returns uuid
language plpgsql
as $$
declare
  v_target promo_design_token_set_versions%rowtype;
  v_missing text[];
begin
  select * into v_target
  from promo_design_token_set_versions
  where id = p_version_id
  for update;

  if not found then raise exception 'Design token version not found'; end if;
  if v_target.status = 'active' then return p_version_id; end if;
  if v_target.status <> 'draft' then raise exception 'Only draft design token versions can be activated'; end if;

  perform pg_advisory_xact_lock(hashtext('promo_design_token_set:' || v_target.token_set_id::text));

  if not exists (
    select 1 from promo_design_token_sets
    where id = v_target.token_set_id and status = 'active'
  ) then
    raise exception 'Archived design token sets cannot activate versions';
  end if;

  select array_agg(definition.token_key order by definition.token_key)
  into v_missing
  from promo_design_token_definitions definition
  where definition.required = true
    and not exists (
      select 1 from promo_design_token_values value
      where value.token_set_version_id = p_version_id
        and value.token_key = definition.token_key
    );

  if coalesce(array_length(v_missing, 1), 0) > 0 then
    raise exception 'Required design tokens are missing: %', array_to_string(v_missing, ', ');
  end if;

  update promo_design_token_set_versions
  set status = 'inactive', updated_at = now()
  where token_set_id = v_target.token_set_id
    and status = 'active'
    and id <> p_version_id;

  update promo_design_token_set_versions
  set status = 'active',
    change_note = coalesce(nullif(p_change_note, ''), change_note),
    updated_at = now()
  where id = p_version_id and status = 'draft';

  if not found then raise exception 'Design token activation state changed concurrently'; end if;

  insert into promo_design_token_histories (
    token_set_id, token_set_version_id, action,
    previous_status, new_status, change_note, snapshot
  ) values (
    v_target.token_set_id, p_version_id, 'activated',
    'draft', 'active', coalesce(p_change_note, ''),
    jsonb_build_object('version', v_target.version)
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
  select * into v_source
  from promo_design_token_set_versions
  where id = p_source_version_id;

  if not found then raise exception 'Source design token version not found'; end if;

  insert into promo_design_token_sets (set_key, name, description)
  values (p_set_key, p_name, coalesce(p_description, ''))
  returning id into v_set_id;

  insert into promo_design_token_set_versions (
    token_set_id, version, status, source_name, source_hash, change_note
  ) values (
    v_set_id, 1, 'draft', v_source.source_name, v_source.source_hash, p_change_note
  ) returning id into v_version_id;

  insert into promo_design_token_values (
    token_set_version_id, token_key, token_value, metadata
  )
  select v_version_id, token_key, token_value, metadata
  from promo_design_token_values
  where token_set_version_id = p_source_version_id;

  insert into promo_design_token_histories (
    token_set_id, token_set_version_id, action, new_status, change_note, snapshot
  ) values (
    v_set_id, v_version_id, 'set_cloned', 'draft', coalesce(p_change_note, ''),
    jsonb_build_object(
      'setKey', p_set_key,
      'name', p_name,
      'sourceVersionId', p_source_version_id,
      'tokenCount', (select count(*) from promo_design_token_values where token_set_version_id = v_version_id)
    )
  );

  return v_version_id;
end $$;
