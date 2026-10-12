begin;

create extension if not exists pgcrypto;

create table if not exists llm_models (
  id uuid primary key default gen_random_uuid(),
  provider text not null check (provider in ('openai', 'google')),
  model_id text not null,
  display_name text not null,
  description text not null default '',
  modality text not null check (modality in ('text', 'image')),
  status text not null default 'draft' check (status in ('draft', 'active', 'inactive')),
  is_recommended boolean not null default false,
  is_legacy boolean not null default false,
  default_temperature numeric,
  default_max_tokens integer check (default_max_tokens is null or default_max_tokens > 0),
  default_response_format text not null default 'text',
  supported_image_sizes jsonb not null default '[]'::jsonb,
  model_options jsonb not null default '{}'::jsonb,
  change_note text not null default '',
  created_by text not null default 'system',
  updated_by text not null default 'system',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (provider, model_id)
);

create index if not exists llm_models_status_modality_idx
  on llm_models(status, modality, provider);

create table if not exists llm_model_histories (
  id uuid primary key default gen_random_uuid(),
  llm_model_id uuid references llm_models(id) on delete set null,
  provider text not null,
  model_id text not null,
  previous_status text,
  new_status text not null,
  snapshot jsonb not null default '{}'::jsonb,
  change_note text not null default '',
  changed_by text not null,
  changed_at timestamptz not null default now()
);

create index if not exists llm_model_histories_model_idx
  on llm_model_histories(llm_model_id, changed_at desc);

commit;
