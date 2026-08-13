-- Keep immutable Composition Shell versions aligned when a new version of an
-- already-pinned Design Token Set becomes active.

create or replace function repin_active_composition_shells_to_design_token_version(
  p_token_version_id uuid
) returns integer
language plpgsql
as $$
declare
  v_token_version promo_design_token_set_versions%rowtype;
  v_shell_version promo_composition_shell_versions%rowtype;
  v_next_version integer;
  v_new_version_id uuid;
  v_config jsonb;
  v_repin_count integer := 0;
begin
  select * into v_token_version
  from promo_design_token_set_versions
  where id = p_token_version_id;

  if not found or v_token_version.status <> 'active' then
    raise exception 'Active design token version not found';
  end if;

  for v_shell_version in
    select shell_version.*
    from promo_composition_shell_versions shell_version
    join promo_composition_shells shell
      on shell.id = shell_version.shell_id and shell.status = 'active'
    where shell_version.status = 'active'
      and (
        exists (
          select 1
          from jsonb_array_elements_text(
            coalesce(shell_version.config_json->'allowedTokenSetVersionIds', '[]'::jsonb)
          ) pinned(version_id)
          join promo_design_token_set_versions pinned_version
            on pinned_version.id::text = pinned.version_id
          where pinned_version.token_set_id = v_token_version.token_set_id
            and pinned_version.id <> p_token_version_id
        )
        or exists (
          select 1
          from promo_design_token_set_versions pinned_default
          where pinned_default.id::text = shell_version.config_json->>'defaultTokenSetVersionId'
            and pinned_default.token_set_id = v_token_version.token_set_id
            and pinned_default.id <> p_token_version_id
        )
      )
    for update
  loop
    perform pg_advisory_xact_lock(
      hashtext('promo_composition_shell:' || v_shell_version.shell_id::text)
    );

    if exists (
      select 1 from promo_composition_shell_versions
      where shell_id = v_shell_version.shell_id and status = 'draft'
    ) then
      raise exception 'Cannot re-pin Composition Shell while a draft version exists';
    end if;

    select coalesce(max(version), 0) + 1 into v_next_version
    from promo_composition_shell_versions
    where shell_id = v_shell_version.shell_id;

    v_config := v_shell_version.config_json;

    if exists (
      select 1 from promo_design_token_set_versions pinned_default
      where pinned_default.id::text = v_config->>'defaultTokenSetVersionId'
        and pinned_default.token_set_id = v_token_version.token_set_id
    ) then
      v_config := jsonb_set(
        v_config,
        '{defaultTokenSetVersionId}',
        to_jsonb(p_token_version_id::text),
        true
      );
    end if;

    v_config := jsonb_set(
      v_config,
      '{allowedTokenSetVersionIds}',
      coalesce((
        select jsonb_agg(mapped.version_id order by mapped.first_position)
        from (
          select mapped_version_id as version_id, min(position) as first_position
          from (
            select
              case
                when pinned_version.token_set_id = v_token_version.token_set_id
                  then p_token_version_id::text
                else pinned.version_id
              end as mapped_version_id,
              pinned.position
            from jsonb_array_elements_text(
              coalesce(v_config->'allowedTokenSetVersionIds', '[]'::jsonb)
            ) with ordinality pinned(version_id, position)
            left join promo_design_token_set_versions pinned_version
              on pinned_version.id::text = pinned.version_id
          ) replacements
          group by mapped_version_id
        ) mapped
      ), jsonb_build_array(p_token_version_id::text)),
      true
    );

    insert into promo_composition_shell_versions (
      shell_id, version, status, config_json,
      fallback_template_id, fallback_template_version, change_note
    ) values (
      v_shell_version.shell_id, v_next_version, 'draft', v_config,
      v_shell_version.fallback_template_id, v_shell_version.fallback_template_version,
      'Automatically re-pinned to active Design Token Set version.'
    ) returning id into v_new_version_id;

    update promo_composition_shell_versions
    set status = 'inactive', updated_at = now()
    where id = v_shell_version.id;

    update promo_composition_shell_versions
    set status = 'active', updated_at = now()
    where id = v_new_version_id;

    v_repin_count := v_repin_count + 1;
  end loop;

  return v_repin_count;
end $$;

create or replace function repin_composition_shells_after_token_activation()
returns trigger
language plpgsql
as $$
begin
  perform repin_active_composition_shells_to_design_token_version(new.id);
  return new;
end $$;

drop trigger if exists promo_design_token_version_repin_shells_trg
  on promo_design_token_set_versions;
create trigger promo_design_token_version_repin_shells_trg
after update of status on promo_design_token_set_versions
for each row
when (new.status = 'active' and old.status is distinct from new.status)
execute function repin_composition_shells_after_token_activation();

-- Repair any stale pins that existed before this trigger was installed.
do $$
declare
  v_active promo_design_token_set_versions%rowtype;
begin
  for v_active in
    select * from promo_design_token_set_versions where status = 'active'
  loop
    perform repin_active_composition_shells_to_design_token_version(v_active.id);
  end loop;
end $$;
