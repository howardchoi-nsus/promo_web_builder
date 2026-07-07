alter table design_documents
  add column if not exists design_style_name text,
  add column if not exists design_token_filename text,
  add column if not exists design_token_json jsonb not null default '{}'::jsonb;

update design_documents d
set design_style_name = b.name
from brands b
where d.brand_id = b.id
  and coalesce(d.design_style_name, '') = '';

comment on column design_documents.design_style_name is 'Human-readable design style name shown in A section.';
comment on column design_documents.design_token_filename is 'Original uploaded design token JSON filename.';
comment on column design_documents.design_token_json is 'Raw uploaded design token JSON used by n8n integrated brief generation.';
