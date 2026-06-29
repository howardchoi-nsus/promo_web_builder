create extension if not exists pgcrypto;

create table if not exists promo_design_runs (
  id uuid primary key default gen_random_uuid(),
  run_key text unique,
  promo_title text,
  market text,
  selected_md_id text,
  selected_md_name text,
  style_source text,
  style_source_label text,
  template_id text,
  template_name text,
  generation_mode text,
  input_mode text,
  status text not null default 'pending',
  result_type text,
  request_payload jsonb not null default '{}'::jsonb,
  simple_brief jsonb,
  section_inputs jsonb,
  design_tokens jsonb,
  source_design_tokens jsonb,
  image_prompt text,
  layout_mapping jsonb,
  md_compliance_map jsonb,
  content_coverage_map jsonb,
  error_message text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists promo_design_assets (
  id uuid primary key default gen_random_uuid(),
  run_id uuid not null references promo_design_runs (id) on delete cascade,
  asset_type text not null default 'generated_image',
  asset_url text not null,
  thumbnail_url text,
  storage_provider text not null default 'vercel_blob',
  storage_bucket text,
  storage_key text,
  source_url text,
  mime_type text,
  file_size integer,
  width integer,
  height integer,
  checksum text,
  metadata jsonb not null default '{}'::jsonb,
  is_primary boolean not null default true,
  created_at timestamptz not null default now()
);

create index if not exists promo_design_runs_created_at_idx
  on promo_design_runs (created_at desc);

create index if not exists promo_design_runs_status_idx
  on promo_design_runs (status);

create index if not exists promo_design_runs_selected_md_id_idx
  on promo_design_runs (selected_md_id);

create index if not exists promo_design_runs_market_idx
  on promo_design_runs (market);

create index if not exists promo_design_assets_run_id_idx
  on promo_design_assets (run_id);

create index if not exists promo_design_assets_asset_type_idx
  on promo_design_assets (asset_type);

create unique index if not exists promo_design_assets_primary_run_uidx
  on promo_design_assets (run_id)
  where is_primary;

comment on table promo_design_runs is 'Promotion design generation request, prompt, selected style, and result status.';
comment on table promo_design_assets is 'Generated promotion image metadata. Binary files are stored in Blob storage, not in Postgres.';
comment on column promo_design_assets.asset_url is 'Permanent Blob URL used by the promo page and generated design list.';
comment on column promo_design_assets.source_url is 'Temporary source URL from the image generation provider, kept only for traceability.';
