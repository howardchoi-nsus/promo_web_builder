-- Full-theme CSV files use --app-* tokens, while legacy promotion token
-- sets use --promo-* tokens. Accept either token family for the shared
-- semantic roles during activation.

update promo_design_token_definitions
set required = false
where token_key = '--promo-title-size';

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
    )
    and not exists (
      select 1
      from promo_design_token_values value
      where value.token_set_version_id = p_version_id
        and value.token_key = case definition.token_key
          when '--promo-surface' then '--app-surface'
          when '--promo-text' then '--app-ink'
          when '--promo-muted' then '--app-muted'
          when '--promo-accent' then '--app-accent'
          when '--promo-radius' then '--app-radius'
          when '--promo-shadow' then '--app-shadow'
          else ''
        end
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
