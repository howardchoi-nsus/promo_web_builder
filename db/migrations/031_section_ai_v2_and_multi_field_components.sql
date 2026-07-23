create extension if not exists pgcrypto;

-- Section AI V2 keeps legacy rows readable while giving new runs an
-- execution contract that includes mode, target and pinned prompt metadata.
alter table promo_section_design_runs
  add column if not exists execution_key text,
  add column if not exists hash_contract_version integer not null default 1,
  add column if not exists prompt_snapshot jsonb not null default '{}'::jsonb,
  add column if not exists token_values_hash text not null default '',
  add column if not exists applying_expires_at timestamptz;

alter table promo_section_design_runs
  drop constraint if exists promo_section_design_runs_status_check;

alter table promo_section_design_runs
  add constraint promo_section_design_runs_status_check check (status in (
    'queued', 'analyzing_content', 'generating_layout', 'validating_layout',
    'generating_assets', 'validating_assets', 'ready', 'applying',
    'applied', 'failed', 'cancelled'
  ));

create unique index if not exists promo_section_design_runs_active_execution_uidx
  on promo_section_design_runs(execution_key)
  where execution_key is not null
    and status in (
      'queued', 'analyzing_content', 'generating_layout', 'validating_layout',
      'generating_assets', 'validating_assets', 'ready', 'applying'
    );

alter table promo_section_design_asset_jobs
  add column if not exists lease_token uuid,
  add column if not exists lease_expires_at timestamptz,
  add column if not exists heartbeat_at timestamptz,
  add column if not exists next_retry_at timestamptz,
  add column if not exists max_attempts integer not null default 3,
  add column if not exists failure_stage text,
  add column if not exists provider_request_id text,
  add column if not exists storage_key text,
  add column if not exists applied_at timestamptz,
  add column if not exists superseded_at timestamptz,
  add column if not exists component_instance_id uuid
    references wizard_content_section_component_instances(id) on delete restrict,
  add column if not exists target_field_key text;

create index if not exists promo_section_design_asset_jobs_lease_idx
  on promo_section_design_asset_jobs(status, lease_expires_at, next_retry_at);

create unique index if not exists promo_section_design_asset_jobs_component_field_uidx
  on promo_section_design_asset_jobs(run_id, component_instance_id, target_field_key)
  where target_type = 'item'
    and component_instance_id is not null
    and target_field_key is not null;

-- A reusable component version can own multiple typed fields.  Legacy
-- field_kind columns remain during the compatibility window.
create table if not exists wizard_item_component_version_fields (
  id uuid primary key default gen_random_uuid(),
  component_version_id uuid not null
    references wizard_item_component_versions(id) on delete cascade,
  field_key text not null
    default ('fld_' || replace(gen_random_uuid()::text, '-', '')),
  name text not null,
  field_kind text not null check (field_kind in ('text', 'image', 'cta')),
  text_type text check (text_type is null or text_type in ('title', 'remark', 'multi')),
  sort_order integer not null default 0,
  is_required boolean not null default false,
  is_locked boolean not null default false,
  default_value jsonb,
  editor_schema jsonb not null default '{}'::jsonb,
  capabilities jsonb not null default '{}'::jsonb,
  image_policy jsonb not null default '{}'::jsonb,
  cta_policy jsonb not null default '{}'::jsonb,
  style_slots jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (component_version_id, field_key),
  constraint wizard_item_component_field_key_chk
    check (field_key ~ '^fld_[a-f0-9]{32}$')
);

create index if not exists wizard_item_component_version_fields_order_idx
  on wizard_item_component_version_fields(component_version_id, sort_order, created_at);

-- Backfill one compatibility field for every existing component version.
insert into wizard_item_component_version_fields (
  component_version_id, name, field_kind, text_type, sort_order,
  default_value, editor_schema, capabilities, image_policy, cta_policy, style_slots
)
select
  version.id,
  coalesce(nullif(component.name, ''), 'Component field'),
  version.field_kind,
  version.text_type,
  0,
  version.default_value,
  version.editor_schema,
  version.capabilities,
  version.image_policy,
  version.cta_policy,
  version.style_slots
from wizard_item_component_versions version
join wizard_item_components component on component.id = version.component_id
where not exists (
  select 1
  from wizard_item_component_version_fields field
  where field.component_version_id = version.id
);

-- New section keys are immutable server-generated identifiers.
alter table wizard_content_sections
  alter column section_key set default
    ('sec_' || replace(gen_random_uuid()::text, '-', ''));

comment on table wizard_item_component_version_fields is
  'Typed fields owned by an immutable reusable component version.';
comment on column promo_section_design_runs.execution_key is
  'V2 canonical hash including request mode, target, revisions and pinned prompt/token metadata.';
