create table if not exists promo_section_design_runs (
  id uuid primary key default gen_random_uuid(),
  promo_run_id uuid references promo_generation_runs(id) on delete set null,
  form_template_id uuid not null references wizard_form_templates(id) on delete cascade,
  template_version integer not null check (template_version > 0),
  layout_revision integer not null check (layout_revision > 0),
  section_key text not null,
  status text not null default 'queued' check (status in (
    'queued', 'analyzing_content', 'generating_layout', 'validating_layout',
    'generating_assets', 'validating_assets', 'ready', 'applied', 'failed', 'cancelled'
  )),
  input_snapshot jsonb not null default '{}'::jsonb,
  input_hash text not null,
  constraints_snapshot jsonb not null default '{}'::jsonb,
  layout_result jsonb,
  image_result jsonb,
  provider_snapshot jsonb not null default '{}'::jsonb,
  usage_snapshot jsonb not null default '{}'::jsonb,
  current_attempt integer not null default 0,
  error_code text,
  error_message text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  completed_at timestamptz,
  applied_at timestamptz
);

create index if not exists promo_section_design_runs_template_idx
  on promo_section_design_runs(form_template_id, section_key, created_at desc);

create index if not exists promo_section_design_runs_status_idx
  on promo_section_design_runs(status, updated_at asc);

create unique index if not exists promo_section_design_runs_active_input_uidx
  on promo_section_design_runs(form_template_id, section_key, input_hash, template_version, layout_revision)
  where status in ('queued', 'analyzing_content', 'generating_layout', 'validating_layout',
    'generating_assets', 'validating_assets', 'ready');

comment on table promo_section_design_runs is
  'Backend-controlled section layout and image generation runs. No n8n dependency.';
