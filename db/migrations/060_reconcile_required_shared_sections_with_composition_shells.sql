begin;

-- Keep required Shared Section references and allowed roles in immutable
-- Composition Shell versions. The function is also used by Admin activation so
-- a required Shared Section and its Shell references change atomically.
create or replace function reconcile_required_shared_section_shells(
  p_section_version_id uuid,
  p_change_note text default null
) returns integer
language plpgsql
as $$
declare
  v_section wizard_content_sections%rowtype;
  v_shell_version promo_composition_shell_versions%rowtype;
  v_next_version integer;
  v_new_version_id uuid;
  v_config jsonb;
  v_shared_ids jsonb;
  v_allowed_roles jsonb;
  v_reconciled integer := 0;커b밋egin
  select * into v_section
  from wizard_content_sections
  where id = p_section_version_id;

  if not found then raise exception 'Shared Section version not found'; end if;
  if v_section.composition_scope <> 'shared' then return 0; end if;
  if not (
    v_section.is_required
    or v_section.fixed_position is not null
    or coalesce(v_section.composition_policy->>'selectionPolicy', '') in (
      'required', 'required-by-market', 'required-by-purpose'
    )
  ) then return 0; end if;

  for v_shell_version in
    select version.*
    from promo_composition_shell_versions version
    join promo_composition_shells shell
      on shell.id = version.shell_id and shell.status = 'active'
    where version.status = 'active'
    order by version.shell_id
  loop
    if coalesce(v_shell_version.config_json->'sharedSectionVersionIds', '[]'::jsonb)
         @> jsonb_build_array(v_section.id::text)
       and coalesce(v_shell_version.config_json->'allowedSectionRoles', '[]'::jsonb)
         @> jsonb_build_array(v_section.section_role)
    then
      continue;
    end if;

    perform pg_advisory_xact_lock(
      hashtext('promo_composition_shell:' || v_shell_version.shell_id::text)
    );
    if exists (
      select 1 from promo_composition_shell_versions
      where shell_id = v_shell_version.shell_id and status = 'draft'
    ) then
      raise exception 'Cannot reconcile required Shared Section while a Composition Shell draft exists';
    end if;

    select coalesce(jsonb_agg(value order by value), '[]'::jsonb)
      into v_shared_ids
    from (
      select distinct candidate.value
      from (
        select jsonb_array_elements_text(
          coalesce(v_shell_version.config_json->'sharedSectionVersionIds', '[]'::jsonb)
        ) as value
        union all
        select v_section.id::text
      ) candidate
      where not exists (
        select 1
        from wizard_content_sections previous
        where previous.id::text = candidate.value
          and previous.section_key = v_section.section_key
          and previous.id <> v_section.id
      )
    ) normalized;

    select coalesce(jsonb_agg(value order by value), '[]'::jsonb)
      into v_allowed_roles
    from (
      select distinct candidate.value
      from (
        select jsonb_array_elements_text(
          coalesce(v_shell_version.config_json->'allowedSectionRoles', '[]'::jsonb)
        ) as value
        union all
        select v_section.section_role
      ) candidate
      where trim(coalesce(candidate.value, '')) <> ''
    ) normalized;

    v_config := jsonb_set(
      jsonb_set(
        coalesce(v_shell_version.config_json, '{}'::jsonb),
        '{sharedSectionVersionIds}', v_shared_ids, true
      ),
      '{allowedSectionRoles}', v_allowed_roles, true
    );

    select coalesce(max(version), 0) + 1 into v_next_version
    from promo_composition_shell_versions
    where shell_id = v_shell_version.shell_id;

    insert into promo_composition_shell_versions (
      shell_id, version, status, config_json,
      fallback_template_id, fallback_template_version, change_note
    ) values (
      v_shell_version.shell_id, v_next_version, 'draft', v_config,
      v_shell_version.fallback_template_id, v_shell_version.fallback_template_version,
      coalesce(p_change_note, 'Required Shared Section reference and role reconciled.')
    ) returning id into v_new_version_id;

    perform activate_promo_composition_shell_version(
      v_new_version_id,
      coalesce(p_change_note, 'Required Shared Section reference and role reconciled.')
    );
    v_reconciled := v_reconciled + 1;
  end loop;

  return v_reconciled;
end $$;

create or replace function activate_wizard_content_section_with_shell_reconciliation(
  p_section_version_id uuid,
  p_change_note text
) returns uuid
language plpgsql
as $$
begin
  perform reconcile_required_shared_section_shells(
    p_section_version_id,
    coalesce(p_change_note, 'Section activation') || ' Composition Shell reconciled.'
  );
  perform activate_wizard_content_section(p_section_version_id, p_change_note);
  return p_section_version_id;
end $$;

-- Repair active legacy data, including the Section that surfaced
-- REQUIRED_SHARED_SECTION_NOT_REFERENCED. Each changed Shell receives a new
-- active Version; active config_json rows are never edited in place.
do $$
declare
  v_section record;
begin
  for v_section in
    select section.id
    from wizard_content_sections section
    where section.status = 'active'
      and section.is_visible_in_wizard = true
      and section.composition_scope = 'shared'
      and (
        section.is_required
        or section.fixed_position is not null
        or coalesce(section.composition_policy->>'selectionPolicy', '') in (
          'required', 'required-by-market', 'required-by-purpose'
        )
      )
    order by section.sort_order, section.section_key
  loop
    perform reconcile_required_shared_section_shells(
      v_section.id,
      'Migration 060: required Shared Section reference and role reconciled.'
    );
  end loop;
end $$;

commit;
