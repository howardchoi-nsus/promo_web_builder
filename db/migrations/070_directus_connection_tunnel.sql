begin;

create table if not exists promo_integration_configs (
  id uuid primary key default gen_random_uuid(),
  integration_key text not null check (integration_key in ('directus')),
  environment text not null check (environment in ('development', 'preview', 'production')),
  version integer not null check (version > 0),
  status text not null default 'draft' check (status in ('draft', 'active', 'suspended', 'archived')),
  config_json jsonb not null default '{}'::jsonb,
  validation_json jsonb not null default '{}'::jsonb,
  created_by text not null,
  activated_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (integration_key, environment, version)
);

create unique index if not exists promo_integration_configs_active_uidx
  on promo_integration_configs(integration_key, environment)
  where status = 'active';

create table if not exists promo_integration_connection_checks (
  id uuid primary key default gen_random_uuid(),
  config_id uuid not null references promo_integration_configs(id) on delete cascade,
  status text not null check (status in ('passed', 'failed')),
  health_status text not null default '',
  auth_verified boolean not null default false,
  duration_ms integer not null default 0,
  error_code text not null default '',
  error_message text not null default '',
  checked_by text not null,
  checked_at timestamptz not null default now()
);

create index if not exists promo_integration_connection_checks_config_idx
  on promo_integration_connection_checks(config_id, checked_at desc);

create or replace function activate_promo_integration_config(
  p_config_id uuid,
  p_created_by text
) returns uuid
language plpgsql
as $$
declare
  v_config promo_integration_configs%rowtype;
begin
  select * into v_config from promo_integration_configs
  where id = p_config_id and created_by = p_created_by for update;
  if not found then return null; end if;
  if v_config.status <> 'draft' or coalesce((v_config.validation_json->>'ok')::boolean, false) = false then
    raise exception 'Directus config must be validated before activation';
  end if;
  update promo_integration_configs
  set status = 'archived', updated_at = now()
  where integration_key = v_config.integration_key
    and environment = v_config.environment
    and status = 'active';
  update promo_integration_configs
  set status = 'active', activated_at = now(), updated_at = now()
  where id = v_config.id;
  return v_config.id;
end $$;

commit;
