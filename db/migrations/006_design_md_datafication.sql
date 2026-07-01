create extension if not exists pgcrypto;

alter table design_documents
  add column if not exists source_hash text,
  add column if not exists extraction_status text not null default 'uploaded',
  add column if not exists extraction_error text,
  add column if not exists archived_at timestamptz;

create table if not exists design_token_sets (
  id uuid primary key default gen_random_uuid(),
  document_id uuid not null references design_documents (id) on delete cascade,
  version integer not null default 1,
  format text not null default 'dtcg',
  dtcg_json jsonb not null default '{}'::jsonb,
  source_hash text,
  extraction_model text,
  status text not null default 'ready',
  error_message text,
  extracted_at timestamptz not null default now(),
  created_at timestamptz not null default now()
);

create table if not exists design_token_items (
  id uuid primary key default gen_random_uuid(),
  token_set_id uuid not null references design_token_sets (id) on delete cascade,
  document_id uuid not null references design_documents (id) on delete cascade,
  token_path text not null,
  token_name text not null,
  token_type text not null,
  token_value jsonb not null,
  description text,
  extensions jsonb not null default '{}'::jsonb,
  source_excerpt text,
  confidence numeric(4,3),
  created_at timestamptz not null default now()
);

create table if not exists design_metadata_items (
  id uuid primary key default gen_random_uuid(),
  document_id uuid not null references design_documents (id) on delete cascade,
  token_set_id uuid references design_token_sets (id) on delete set null,
  category text not null,
  key text not null,
  value text not null,
  source_excerpt text,
  confidence numeric(4,3),
  created_at timestamptz not null default now()
);

create unique index if not exists design_token_sets_document_version_uidx
  on design_token_sets (document_id, version);

create index if not exists design_token_sets_document_status_idx
  on design_token_sets (document_id, status, extracted_at desc);

create index if not exists design_token_items_document_type_idx
  on design_token_items (document_id, token_type);

create index if not exists design_token_items_token_set_idx
  on design_token_items (token_set_id);

create index if not exists design_metadata_items_document_category_idx
  on design_metadata_items (document_id, category);

create index if not exists design_documents_extraction_status_idx
  on design_documents (extraction_status);

update design_documents
set extraction_status = 'ready',
    status = case when status = 'archived' then status else 'ready' end
where source_type in ('markdown_seed', 'markdown_upload')
  and archived_at is null
  and extraction_status = 'uploaded'
  and exists (
    select 1
    from design_tokens
    where design_tokens.document_id = design_documents.id
  );

comment on table design_token_sets is 'DTCG-oriented extracted token set per Design MD document.';
comment on table design_token_items is 'Queryable flattened token items derived from the DTCG token set.';
comment on table design_metadata_items is 'Qualitative design metadata extracted from Design MD, such as philosophy, layout rules, and generation guidance.';
