create extension if not exists pgcrypto;

create table if not exists prompt_templates (
  id uuid primary key default gen_random_uuid(),
  type text not null,
  name text not null,
  body text not null default '',
  status text not null default 'draft',
  version integer not null default 1,
  required_variables jsonb not null default '[]'::jsonb,
  optional_variables jsonb not null default '[]'::jsonb,
  change_note text not null default '',
  archived_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint prompt_templates_status_chk
    check (status in ('draft', 'active', 'inactive', 'archived')),
  constraint prompt_templates_type_name_uidx unique (type, name)
);

create unique index if not exists prompt_templates_one_active_per_type_uidx
  on prompt_templates (type)
  where status = 'active';

create index if not exists prompt_templates_type_status_idx
  on prompt_templates (type, status);

create index if not exists prompt_templates_updated_at_idx
  on prompt_templates (updated_at desc);

create table if not exists prompt_template_histories (
  id uuid primary key default gen_random_uuid(),
  prompt_template_id uuid not null references prompt_templates (id) on delete cascade,
  prompt_type text not null,
  previous_body text not null default '',
  new_body text not null default '',
  previous_version integer not null default 0,
  new_version integer not null default 1,
  previous_status text not null default '',
  new_status text not null default '',
  change_note text not null default '',
  changed_at timestamptz not null default now()
);

create index if not exists prompt_template_histories_template_idx
  on prompt_template_histories (prompt_template_id, changed_at desc);

comment on table prompt_templates is 'Managed LLM prompt templates used by promo generation workflows.';
comment on table prompt_template_histories is 'Prompt template update, activation, and archive history snapshots.';
