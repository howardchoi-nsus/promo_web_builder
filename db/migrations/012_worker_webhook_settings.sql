create extension if not exists pgcrypto;

create table if not exists worker_webhook_settings (
  id uuid primary key default gen_random_uuid(),
  stage text not null unique,
  webhook_url text not null default '',
  is_active boolean not null default false,
  timeout_ms integer,
  description text not null default '',
  change_note text not null default '',
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists worker_webhook_setting_histories (
  id uuid primary key default gen_random_uuid(),
  setting_id uuid references worker_webhook_settings (id) on delete set null,
  stage text not null,
  previous_webhook_url text not null default '',
  new_webhook_url text not null default '',
  previous_is_active boolean not null default false,
  new_is_active boolean not null default false,
  previous_timeout_ms integer,
  new_timeout_ms integer,
  previous_description text not null default '',
  new_description text not null default '',
  change_note text not null default '',
  changed_at timestamptz not null default now()
);

insert into worker_webhook_settings (stage, description, metadata)
values
  ('integrated_brief', 'Integrated Brief', '{"envName":"N8N_INTEGRATED_BRIEF_WORKER_URL"}'::jsonb),
  ('lofi_draft', 'LO-FI Draft', '{"envName":"N8N_LOFI_DRAFT_WORKER_URL"}'::jsonb),
  ('final_design', 'Final Design', '{"envName":"N8N_FINAL_DESIGN_WORKER_URL"}'::jsonb),
  ('promo_ui_design', 'Promo UI Design', '{"envName":"N8N_PROMO_UI_DESIGN_WEBHOOK_URL"}'::jsonb)
on conflict (stage) do nothing;

create index if not exists worker_webhook_settings_active_idx
  on worker_webhook_settings (stage, is_active, updated_at desc);

comment on table worker_webhook_settings is 'Managed n8n worker webhook URLs used by server-side generation triggers.';
comment on table worker_webhook_setting_histories is 'Change history for managed n8n worker webhook URLs.';
