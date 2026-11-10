begin;
create table if not exists promo_token_usage_policy_versions (
 id uuid primary key default gen_random_uuid(),
 version integer not null unique,
 status text not null check (status in ('draft','active','inactive')),
 token_set_version_id uuid not null references promo_design_token_set_versions(id),
 policy_json jsonb not null check (jsonb_typeof(policy_json)='object'),
 change_note text not null default '',
 created_at timestamptz not null default now()
);
create unique index if not exists promo_token_usage_policy_one_active
 on promo_token_usage_policy_versions(status) where status='active';
create or replace function publish_token_usage_policy(
 p_expected_head uuid,p_token_version uuid,p_policy jsonb,p_activate boolean,p_note text
) returns uuid language plpgsql as $$
declare current_head uuid; next_version integer; saved uuid;
begin
 perform pg_advisory_xact_lock(hashtext('promo_token_usage_policy'));
 select id into current_head from promo_token_usage_policy_versions order by version desc limit 1;
 if current_head is distinct from p_expected_head then
  raise exception 'Token usage policy version changed' using errcode='40001';
 end if;
 if not exists(select 1 from promo_design_token_set_versions v join promo_design_token_sets s on s.id=v.token_set_id where v.id=p_token_version and v.status='active' and s.set_key='design-system') then
  raise exception 'Active design token library changed' using errcode='40001';
 end if;
 select coalesce(max(version),0)+1 into next_version from promo_token_usage_policy_versions;
 if p_activate then update promo_token_usage_policy_versions set status='inactive' where status='active'; end if;
 insert into promo_token_usage_policy_versions(version,status,token_set_version_id,policy_json,change_note)
 values(next_version,case when p_activate then 'active' else 'draft' end,p_token_version,p_policy,coalesce(p_note,'')) returning id into saved;
 return saved;
end;
$$;
commit;
