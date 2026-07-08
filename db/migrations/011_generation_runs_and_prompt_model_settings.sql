create extension if not exists pgcrypto;

alter table prompt_templates
  add column if not exists provider text not null default '',
  add column if not exists model text not null default '',
  add column if not exists temperature numeric,
  add column if not exists max_tokens integer,
  add column if not exists response_format text not null default '',
  add column if not exists model_options jsonb not null default '{}'::jsonb;

alter table prompt_template_histories
  add column if not exists previous_provider text not null default '',
  add column if not exists new_provider text not null default '',
  add column if not exists previous_model text not null default '',
  add column if not exists new_model text not null default '',
  add column if not exists previous_model_options jsonb not null default '{}'::jsonb,
  add column if not exists new_model_options jsonb not null default '{}'::jsonb;

update prompt_templates
set
  provider = 'openai',
  model = 'gpt-4o-mini',
  temperature = coalesce(temperature, 0.2),
  max_tokens = coalesce(max_tokens, 12000),
  response_format = case when response_format = '' then 'json_object' else response_format end,
  model_options = case when model_options = '{}'::jsonb then '{"provider":"openai","model":"gpt-4o-mini","temperature":0.2,"maxTokens":12000,"responseFormat":"json_object"}'::jsonb else model_options end
where type = 'integrated_brief'
  and (provider = '' or model = '');

update prompt_templates
set
  provider = 'openai',
  model = 'gpt-4o-mini',
  temperature = coalesce(temperature, 0.1),
  max_tokens = coalesce(max_tokens, 4000),
  response_format = case when response_format = '' then 'text' else response_format end,
  model_options = case when model_options = '{}'::jsonb then '{"provider":"openai","model":"gpt-4o-mini","temperature":0.1,"maxTokens":4000,"responseFormat":"text"}'::jsonb else model_options end
where type = 'image_execution'
  and (provider = '' or model = '');

create table if not exists promo_generation_runs (
  id uuid primary key default gen_random_uuid(),
  run_key text not null unique,
  promo_title text not null default '',
  selected_md_id text not null default '',
  selected_md_name text not null default '',
  status text not null default 'created',
  stage text not null default 'created',
  input_hash text not null default '',
  input_snapshot jsonb not null default '{}'::jsonb,
  error_message text not null default '',
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists promo_generation_runs_status_idx
  on promo_generation_runs (status, updated_at desc);

create index if not exists promo_generation_runs_input_hash_idx
  on promo_generation_runs (input_hash);

create table if not exists promo_generation_integrated_briefs (
  id uuid primary key default gen_random_uuid(),
  run_id uuid not null references promo_generation_runs (id) on delete cascade,
  status text not null default 'queued',
  integrated_brief_markdown text not null default '',
  integrated_brief_json jsonb not null default '{}'::jsonb,
  prompt_meta jsonb not null default '{}'::jsonb,
  model_meta jsonb not null default '{}'::jsonb,
  error_message text not null default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint promo_generation_integrated_briefs_run_uidx unique (run_id)
);

create index if not exists promo_generation_integrated_briefs_status_idx
  on promo_generation_integrated_briefs (status, updated_at desc);

create table if not exists promo_generation_lofi_drafts (
  id uuid primary key default gen_random_uuid(),
  run_id uuid not null references promo_generation_runs (id) on delete cascade,
  draft_attempt integer not null,
  status text not null default 'queued',
  draft_image_url text not null default '',
  draft_prompt text not null default '',
  prompt_meta jsonb not null default '{}'::jsonb,
  model_meta jsonb not null default '{}'::jsonb,
  error_message text not null default '',
  confirmed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint promo_generation_lofi_drafts_attempt_uidx unique (run_id, draft_attempt)
);

create index if not exists promo_generation_lofi_drafts_run_idx
  on promo_generation_lofi_drafts (run_id, draft_attempt desc);

create index if not exists promo_generation_lofi_drafts_status_idx
  on promo_generation_lofi_drafts (status, updated_at desc);

create table if not exists promo_generation_final_designs (
  id uuid primary key default gen_random_uuid(),
  run_id uuid not null references promo_generation_runs (id) on delete cascade,
  confirmed_draft_id uuid references promo_generation_lofi_drafts (id) on delete set null,
  status text not null default 'queued',
  final_image_url text not null default '',
  final_prompt text not null default '',
  prompt_meta jsonb not null default '{}'::jsonb,
  model_meta jsonb not null default '{}'::jsonb,
  error_message text not null default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists promo_generation_final_designs_run_idx
  on promo_generation_final_designs (run_id, created_at desc);

create index if not exists promo_generation_final_designs_status_idx
  on promo_generation_final_designs (status, updated_at desc);

comment on table promo_generation_runs is 'RunId based async generation state for promo design generation.';
comment on table promo_generation_integrated_briefs is 'Stored integrated brief results for generation runs.';
comment on table promo_generation_lofi_drafts is 'LO-FI draft attempts generated from stored integrated briefs.';
comment on table promo_generation_final_designs is 'Final design generation results from confirmed LO-FI drafts.';
