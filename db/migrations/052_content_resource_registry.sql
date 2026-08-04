-- Versioned common content resources for legal, terms, footer and shared CTA references.

create table if not exists promo_content_resources (
  id uuid primary key default gen_random_uuid(),
  resource_key text not null unique,
  resource_type text not null check (resource_type in (
    'terms', 'privacy', 'legal', 'responsible-gaming',
    'footer', 'cta', 'customer-support'
  )),
  name text not null,
  description text not null default '',
  status text not null default 'active'
    check (status in ('active', 'inactive', 'archived')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists promo_content_resource_versions (
  id uuid primary key default gen_random_uuid(),
  resource_id uuid not null references promo_content_resources(id) on delete restrict,
  locale text not null,
  version integer not null check (version > 0),
  status text not null default 'draft'
    check (status in ('draft', 'active', 'inactive', 'archived')),
  content_json jsonb not null default '{}'::jsonb,
  content_hash text not null,
  effective_from timestamptz not null default now(),
  effective_to timestamptz,
  change_note text not null default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (jsonb_typeof(content_json) = 'object'),
  check (effective_to is null or effective_to > effective_from),
  unique(resource_id, locale, version)
);

create table if not exists promo_content_resource_market_rules (
  id uuid primary key default gen_random_uuid(),
  resource_id uuid not null references promo_content_resources(id) on delete cascade,
  market_code text not null default '*',
  locale text not null default '*',
  promotion_purpose text not null default '*',
  section_role text not null check (section_role in (
    'footer', 'terms', 'legal', 'responsible-gaming', 'cta', 'notice'
  )),
  is_required boolean not null default true,
  priority integer not null default 0,
  status text not null default 'active'
    check (status in ('active', 'inactive', 'archived')),
  effective_from timestamptz not null default now(),
  effective_to timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (effective_to is null or effective_to > effective_from)
);

create table if not exists promo_content_resource_histories (
  id uuid primary key default gen_random_uuid(),
  resource_id uuid not null references promo_content_resources(id) on delete cascade,
  resource_version_id uuid references promo_content_resource_versions(id) on delete set null,
  market_rule_id uuid references promo_content_resource_market_rules(id) on delete set null,
  action text not null,
  change_note text not null default '',
  previous_state jsonb,
  new_state jsonb,
  changed_at timestamptz not null default now()
);

create index if not exists promo_content_resource_versions_resolver_idx
  on promo_content_resource_versions(resource_id, status, locale, effective_from, effective_to);
create index if not exists promo_content_resource_rules_resolver_idx
  on promo_content_resource_market_rules(status, market_code, locale, promotion_purpose, priority desc);
create index if not exists promo_content_resource_histories_resource_idx
  on promo_content_resource_histories(resource_id, changed_at desc);

create or replace function create_promo_content_resource_version(
  p_resource_id uuid,
  p_locale text,
  p_content_json jsonb,
  p_content_hash text,
  p_effective_from timestamptz,
  p_effective_to timestamptz,
  p_change_note text
) returns uuid
language plpgsql
as $$
declare
  v_version integer;
  v_version_id uuid;
begin
  if not exists (select 1 from promo_content_resources where id = p_resource_id) then
    raise exception 'Content resource not found';
  end if;
  if trim(coalesce(p_locale, '')) = '' then raise exception 'Content resource locale is required'; end if;
  if jsonb_typeof(p_content_json) <> 'object' then raise exception 'Content resource content must be a JSON object'; end if;
  if trim(coalesce(p_content_hash, '')) = '' then raise exception 'Content resource hash is required'; end if;
  if p_effective_to is not null and p_effective_to <= p_effective_from then
    raise exception 'Content resource effective range is invalid';
  end if;

  perform pg_advisory_xact_lock(hashtext('promo_content_resource:' || p_resource_id::text || ':' || lower(p_locale)));
  select coalesce(max(version), 0) + 1 into v_version
  from promo_content_resource_versions
  where resource_id = p_resource_id and lower(locale) = lower(p_locale);

  insert into promo_content_resource_versions (
    resource_id, locale, version, status, content_json, content_hash,
    effective_from, effective_to, change_note
  ) values (
    p_resource_id, p_locale, v_version, 'draft', p_content_json, p_content_hash,
    p_effective_from, p_effective_to, coalesce(p_change_note, '')
  ) returning id into v_version_id;

  insert into promo_content_resource_histories (
    resource_id, resource_version_id, action, change_note, new_state
  ) values (
    p_resource_id, v_version_id, 'version-created', coalesce(p_change_note, ''),
    jsonb_build_object('locale', p_locale, 'version', v_version, 'status', 'draft', 'contentHash', p_content_hash)
  );
  return v_version_id;
end $$;

create or replace function activate_promo_content_resource_version(
  p_version_id uuid,
  p_change_note text
) returns uuid
language plpgsql
as $$
declare
  v_target promo_content_resource_versions%rowtype;
begin
  select * into v_target from promo_content_resource_versions
  where id = p_version_id for update;
  if not found then raise exception 'Content resource version not found'; end if;
  if v_target.status = 'archived' then raise exception 'Archived content resource versions cannot be activated'; end if;
  if not exists (
    select 1 from promo_content_resources
    where id = v_target.resource_id and status = 'active'
  ) then raise exception 'Content resource is not active'; end if;

  insert into promo_content_resource_histories (
    resource_id, resource_version_id, action, change_note, previous_state, new_state
  )
  select candidate.resource_id, candidate.id, 'version-effective-range-closed',
    coalesce(p_change_note, ''),
    jsonb_build_object('effectiveTo', candidate.effective_to),
    jsonb_build_object('effectiveTo', v_target.effective_from)
  from promo_content_resource_versions candidate
  where candidate.resource_id = v_target.resource_id
    and lower(candidate.locale) = lower(v_target.locale)
    and candidate.status = 'active'
    and candidate.id <> v_target.id
    and candidate.effective_from < v_target.effective_from
    and (candidate.effective_to is null or candidate.effective_to > v_target.effective_from);

  update promo_content_resource_versions candidate
  set effective_to = v_target.effective_from, updated_at = now()
  where candidate.resource_id = v_target.resource_id
    and lower(candidate.locale) = lower(v_target.locale)
    and candidate.status = 'active'
    and candidate.id <> v_target.id
    and candidate.effective_from < v_target.effective_from
    and (candidate.effective_to is null or candidate.effective_to > v_target.effective_from);

  if exists (
    select 1 from promo_content_resource_versions candidate
    where candidate.resource_id = v_target.resource_id
      and lower(candidate.locale) = lower(v_target.locale)
      and candidate.status = 'active'
      and candidate.id <> v_target.id
      and tstzrange(candidate.effective_from, candidate.effective_to, '[)')
        && tstzrange(v_target.effective_from, v_target.effective_to, '[)')
  ) then raise exception 'Active content resource effective range overlaps'; end if;

  update promo_content_resource_versions
  set status = 'active', change_note = coalesce(p_change_note, ''), updated_at = now()
  where id = p_version_id;
  insert into promo_content_resource_histories (
    resource_id, resource_version_id, action, change_note, previous_state, new_state
  ) values (
    v_target.resource_id, p_version_id, 'version-activated', coalesce(p_change_note, ''),
    jsonb_build_object('status', v_target.status), jsonb_build_object('status', 'active')
  );
  return p_version_id;
end $$;
