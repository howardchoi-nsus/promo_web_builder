begin;

alter table promo_integration_configs
  add column if not exists validated_by text,
  add column if not exists activated_by text,
  add column if not exists suspended_by text;

create or replace function activate_promo_integration_config(
  p_config_id uuid,
  p_actor_subject text
) returns uuid
language plpgsql
as $$
declare
  v_config promo_integration_configs%rowtype;
begin
  select * into v_config from promo_integration_configs
  where id = p_config_id for update;
  if not found then return null; end if;
  if v_config.status <> 'draft' or coalesce((v_config.validation_json->>'ok')::boolean, false) = false then
    raise exception 'Directus config must be validated before activation';
  end if;
  if coalesce((
    select connection.status from promo_integration_connection_checks connection
    where connection.config_id = v_config.id
    order by connection.checked_at desc
    limit 1
  ), '') <> 'passed' then
    raise exception 'Directus config must pass a connection check before activation';
  end if;
  update promo_integration_configs
  set status = 'archived', updated_at = now()
  where integration_key = v_config.integration_key
    and environment = v_config.environment
    and status = 'active';
  update promo_integration_configs
  set status = 'active', activated_by = p_actor_subject,
    activated_at = now(), updated_at = now()
  where id = v_config.id;
  return v_config.id;
end $$;

create table if not exists promo_directus_migration_batches (
  id uuid primary key,
  migration_id text not null,
  selected_domains jsonb not null,
  source_commit text not null,
  source_environment text not null check (source_environment in ('development', 'preview', 'production')),
  target_environment text not null check (target_environment in ('development', 'preview', 'production')),
  schema_version text not null,
  status text not null check (status in ('planned', 'running', 'passed', 'failed', 'rolling_back', 'rolled_back')),
  checkpoint_json jsonb not null default '{}'::jsonb,
  counts_json jsonb not null default '{}'::jsonb,
  error_code text not null default '',
  created_by text not null,
  started_at timestamptz not null default now(),
  completed_at timestamptz,
  check (source_environment = target_environment),
  check (jsonb_typeof(selected_domains) = 'array'),
  check (jsonb_typeof(checkpoint_json) = 'object'),
  check (jsonb_typeof(counts_json) = 'object')
);

create table if not exists promo_directus_migration_journal (
  id uuid primary key default gen_random_uuid(),
  batch_id uuid not null references promo_directus_migration_batches(id) on delete restrict,
  domain text not null check (domain in ('components', 'designTokens')),
  source_id text not null,
  action text not null check (action in ('create', 'update', 'soft_delete', 'skip', 'conflict')),
  before_json jsonb,
  after_json jsonb,
  content_hash text not null default '',
  status text not null check (status in ('planned', 'applied', 'failed', 'rolled_back')),
  error_code text not null default '',
  created_at timestamptz not null default now()
);
create index if not exists promo_directus_migration_journal_batch_idx
  on promo_directus_migration_journal(batch_id, domain, status);

create table if not exists promo_directus_shadow_diffs (
  id uuid primary key default gen_random_uuid(),
  domain text not null check (domain in ('components', 'designTokens')),
  query_hash text not null,
  severity text not null check (severity in ('blocking', 'warning')),
  diff_summary jsonb not null default '{}'::jsonb,
  config_id uuid references promo_integration_configs(id) on delete set null,
  observed_at timestamptz not null default now(),
  check (jsonb_typeof(diff_summary) = 'object')
);
create index if not exists promo_directus_shadow_diffs_observed_idx
  on promo_directus_shadow_diffs(domain, severity, observed_at desc);

create table if not exists promo_directus_cutover_snapshots (
  id uuid primary key default gen_random_uuid(),
  environment text not null check (environment in ('development', 'preview', 'production')),
  domain text not null check (domain in ('components', 'designTokens')),
  source text not null check (source in ('internal', 'directus')),
  config_id uuid references promo_integration_configs(id) on delete restrict,
  schema_version text not null,
  migration_batch_id uuid references promo_directus_migration_batches(id) on delete restrict,
  gate_evidence jsonb not null default '{}'::jsonb,
  status text not null check (status in ('draft', 'approved', 'active', 'rolled_back')),
  approved_by text,
  activated_at timestamptz,
  created_at timestamptz not null default now(),
  check (jsonb_typeof(gate_evidence) = 'object')
);
create unique index if not exists promo_directus_cutover_active_uidx
  on promo_directus_cutover_snapshots(environment, domain)
  where status = 'active';

commit;
