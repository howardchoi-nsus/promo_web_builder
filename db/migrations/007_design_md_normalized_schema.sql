create extension if not exists pgcrypto;

alter table design_token_sets
  add column if not exists normalized_schema_json jsonb not null default '{}'::jsonb;

alter table design_token_items
  add column if not exists alias_of text,
  add column if not exists reference_path text;

create table if not exists design_component_patterns (
  id uuid primary key default gen_random_uuid(),
  document_id uuid not null references design_documents (id) on delete cascade,
  token_set_id uuid references design_token_sets (id) on delete cascade,
  component_type text not null,
  pattern_key text not null,
  value_json jsonb not null default '{}'::jsonb,
  token_references jsonb not null default '[]'::jsonb,
  source_excerpt text,
  confidence numeric(4,3),
  created_at timestamptz not null default now()
);

create table if not exists design_layout_patterns (
  id uuid primary key default gen_random_uuid(),
  document_id uuid not null references design_documents (id) on delete cascade,
  token_set_id uuid references design_token_sets (id) on delete cascade,
  layout_type text not null,
  pattern_key text not null,
  value_json jsonb not null default '{}'::jsonb,
  token_references jsonb not null default '[]'::jsonb,
  source_excerpt text,
  confidence numeric(4,3),
  created_at timestamptz not null default now()
);

create table if not exists design_guideline_items (
  id uuid primary key default gen_random_uuid(),
  document_id uuid not null references design_documents (id) on delete cascade,
  token_set_id uuid references design_token_sets (id) on delete cascade,
  guideline_type text not null,
  key text not null,
  value text not null,
  severity text not null default 'recommended',
  applies_to text,
  source_excerpt text,
  confidence numeric(4,3),
  created_at timestamptz not null default now()
);

create index if not exists design_component_patterns_document_type_idx
  on design_component_patterns (document_id, component_type);

create index if not exists design_component_patterns_token_set_idx
  on design_component_patterns (token_set_id);

create index if not exists design_layout_patterns_document_type_idx
  on design_layout_patterns (document_id, layout_type);

create index if not exists design_layout_patterns_token_set_idx
  on design_layout_patterns (token_set_id);

create index if not exists design_guideline_items_document_type_idx
  on design_guideline_items (document_id, guideline_type);

create index if not exists design_guideline_items_token_set_idx
  on design_guideline_items (token_set_id);

comment on column design_token_sets.normalized_schema_json is 'Canonical Design MD data schema with unknown defaults and extracted overrides.';
comment on table design_component_patterns is 'Component-level design patterns extracted from Design MD documents.';
comment on table design_layout_patterns is 'Layout and composition patterns extracted from Design MD documents.';
comment on table design_guideline_items is 'Do, dont, avoid, must, and generation guidance extracted from Design MD documents.';
