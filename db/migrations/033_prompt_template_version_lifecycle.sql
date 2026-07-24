-- Preserve every operational prompt version as an immutable row.
-- Existing rows are retained and become the first member of their own lineage.

alter table prompt_templates
  add column if not exists lineage_id uuid,
  add column if not exists source_prompt_template_id uuid references prompt_templates (id) on delete set null,
  add column if not exists validated_at timestamptz;

update prompt_templates
set lineage_id = md5(type || E'\x1f' || name)::uuid
where lineage_id is null;

alter table prompt_templates
  alter column lineage_id set not null,
  alter column lineage_id set default gen_random_uuid();

alter table prompt_templates
  drop constraint if exists prompt_templates_type_name_uidx;

alter table prompt_templates
  drop constraint if exists prompt_templates_status_chk;

alter table prompt_templates
  add constraint prompt_templates_status_chk
    check (status in ('draft', 'validated', 'active', 'inactive', 'archived'));

create unique index if not exists prompt_templates_lineage_version_uidx
  on prompt_templates (lineage_id, version);

create unique index if not exists prompt_templates_one_candidate_per_lineage_uidx
  on prompt_templates (lineage_id)
  where status in ('draft', 'validated');

create index if not exists prompt_templates_lineage_updated_idx
  on prompt_templates (lineage_id, updated_at desc);

comment on column prompt_templates.lineage_id is
  'Stable prompt family identifier shared by immutable prompt version rows.';
comment on column prompt_templates.source_prompt_template_id is
  'Prompt version used as the source when a new draft was created.';
comment on column prompt_templates.validated_at is
  'Time when the draft variable and model contracts were validated.';
