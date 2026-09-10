create extension if not exists pgcrypto;

-- Legacy component versions keep every render_* column NULL. Only new DOM
-- RenderSpec drafts opt into the versioned rendering contract.
alter table wizard_item_component_versions
  add column if not exists render_contract_version integer,
  add column if not exists render_tree jsonb,
  add column if not exists render_responsive jsonb,
  add column if not exists render_accessibility jsonb,
  add column if not exists render_validation jsonb;

alter table wizard_item_component_versions
  drop constraint if exists wizard_item_component_versions_render_contract_chk,
  drop constraint if exists wizard_item_component_versions_render_tree_chk,
  drop constraint if exists wizard_item_component_versions_render_responsive_chk,
  drop constraint if exists wizard_item_component_versions_render_accessibility_chk,
  drop constraint if exists wizard_item_component_versions_render_validation_chk,
  drop constraint if exists wizard_item_component_versions_render_payload_chk,
  drop constraint if exists wizard_item_component_versions_active_render_validation_chk,
  add constraint wizard_item_component_versions_render_contract_chk
    check (render_contract_version is null or render_contract_version = 1),
  add constraint wizard_item_component_versions_render_tree_chk
    check (render_tree is null or jsonb_typeof(render_tree) = 'object'),
  add constraint wizard_item_component_versions_render_responsive_chk
    check (render_responsive is null or jsonb_typeof(render_responsive) = 'object'),
  add constraint wizard_item_component_versions_render_accessibility_chk
    check (render_accessibility is null or jsonb_typeof(render_accessibility) = 'object'),
  add constraint wizard_item_component_versions_render_validation_chk
    check (render_validation is null or jsonb_typeof(render_validation) = 'object'),
  add constraint wizard_item_component_versions_render_payload_chk check (
    (
      render_contract_version is null
      and render_tree is null
      and render_responsive is null
      and render_accessibility is null
      and render_validation is null
    )
    or (
      render_contract_version = 1
      and render_tree is not null
      and render_responsive is not null
      and render_accessibility is not null
      and render_validation is not null
    )
  ),
  add constraint wizard_item_component_versions_active_render_validation_chk check (
    status <> 'active'
    or render_contract_version is null
    or render_validation->>'ok' = 'true'
  );

comment on column wizard_item_component_versions.render_contract_version is
  'NULL uses the legacy field renderer; 1 uses Component RenderSpec v1.';
comment on column wizard_item_component_versions.render_tree is
  'Validated single-root declarative DOM tree for this immutable component version.';
comment on column wizard_item_component_versions.render_responsive is
  'Validated semantic-breakpoint overrides for the RenderSpec tree.';
comment on column wizard_item_component_versions.render_accessibility is
  'Accessibility metadata pinned with the RenderSpec version.';
comment on column wizard_item_component_versions.render_validation is
  'Last successful server validation summary, metrics and deterministic SHA-256 hash.';

create table if not exists component_design_sources (
  id uuid primary key default gen_random_uuid(),
  storage_key text not null unique,
  mime_type text not null check (mime_type in ('image/png', 'image/jpeg', 'image/webp')),
  byte_size bigint not null check (byte_size > 0 and byte_size <= 10485760),
  width integer not null check (width > 0 and width <= 8192),
  height integer not null check (height > 0 and height <= 8192),
  content_hash text not null check (content_hash ~ '^[a-f0-9]{64}$'),
  crop_spec jsonb not null default '{}'::jsonb,
  metadata jsonb not null default '{}'::jsonb,
  status text not null default 'ready' check (status in ('uploaded', 'ready', 'expired', 'deleted')),
  created_at timestamptz not null default now(),
  expires_at timestamptz,
  deleted_at timestamptz,
  constraint component_design_sources_crop_spec_chk check (jsonb_typeof(crop_spec) = 'object'),
  constraint component_design_sources_metadata_chk check (jsonb_typeof(metadata) = 'object')
);

create index if not exists component_design_sources_content_hash_idx
  on component_design_sources(content_hash, status);
create index if not exists component_design_sources_expiry_idx
  on component_design_sources(status, expires_at)
  where deleted_at is null;

create table if not exists component_generation_runs (
  id uuid primary key default gen_random_uuid(),
  source_id uuid not null references component_design_sources(id) on delete restrict,
  status text not null default 'queued' check (status in (
    'queued', 'analyzing', 'validating', 'ready', 'failed', 'applied', 'cancelled'
  )),
  component_intent text not null default '',
  allowed_section_roles jsonb not null default '[]'::jsonb,
  target_design_token_set_version_id uuid
    references promo_design_token_set_versions(id) on delete restrict,
  prompt_template_id uuid references prompt_templates(id) on delete set null,
  prompt_snapshot jsonb not null default '{}'::jsonb,
  model_snapshot jsonb not null default '{}'::jsonb,
  input_hash text not null check (input_hash ~ '^[a-f0-9]{64}$'),
  idempotency_key text not null unique,
  attempt_count integer not null default 0 check (attempt_count >= 0),
  error_code text,
  error_message text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  completed_at timestamptz,
  constraint component_generation_runs_roles_chk check (jsonb_typeof(allowed_section_roles) = 'array'),
  constraint component_generation_runs_prompt_snapshot_chk check (jsonb_typeof(prompt_snapshot) = 'object'),
  constraint component_generation_runs_model_snapshot_chk check (jsonb_typeof(model_snapshot) = 'object')
);

create index if not exists component_generation_runs_source_idx
  on component_generation_runs(source_id, created_at desc);
create index if not exists component_generation_runs_status_idx
  on component_generation_runs(status, updated_at);

create table if not exists component_generation_proposals (
  id uuid primary key default gen_random_uuid(),
  run_id uuid not null references component_generation_runs(id) on delete restrict,
  proposal_version integer not null default 1 check (proposal_version > 0),
  component_definition jsonb not null default '{}'::jsonb,
  render_spec jsonb not null default '{}'::jsonb,
  responsive_spec jsonb not null default '{}'::jsonb,
  token_bindings jsonb not null default '{}'::jsonb,
  accessibility jsonb not null default '{}'::jsonb,
  similar_components jsonb not null default '[]'::jsonb,
  confidence numeric(5,4) check (confidence is null or (confidence >= 0 and confidence <= 1)),
  review_notes jsonb not null default '[]'::jsonb,
  validation_result jsonb not null default '{}'::jsonb,
  applied_component_id uuid references wizard_item_components(id) on delete restrict,
  applied_version_id uuid references wizard_item_component_versions(id) on delete restrict,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  applied_at timestamptz,
  unique (run_id, proposal_version),
  constraint component_generation_proposals_definition_chk check (jsonb_typeof(component_definition) = 'object'),
  constraint component_generation_proposals_render_spec_chk check (jsonb_typeof(render_spec) = 'object'),
  constraint component_generation_proposals_responsive_chk check (jsonb_typeof(responsive_spec) = 'object'),
  constraint component_generation_proposals_tokens_chk check (jsonb_typeof(token_bindings) = 'object'),
  constraint component_generation_proposals_accessibility_chk check (jsonb_typeof(accessibility) = 'object'),
  constraint component_generation_proposals_similar_chk check (jsonb_typeof(similar_components) = 'array'),
  constraint component_generation_proposals_review_chk check (jsonb_typeof(review_notes) = 'array'),
  constraint component_generation_proposals_validation_chk check (jsonb_typeof(validation_result) = 'object'),
  constraint component_generation_proposals_apply_pair_chk check (
    (applied_component_id is null and applied_version_id is null and applied_at is null)
    or (applied_component_id is not null and applied_version_id is not null and applied_at is not null)
  )
);

create index if not exists component_generation_proposals_run_idx
  on component_generation_proposals(run_id, proposal_version desc);

comment on table component_design_sources is
  'Private source-image metadata for DOM component generation; binary data remains in object storage.';
comment on table component_generation_runs is
  'Traceable image-analysis runs with pinned prompt, model and token-set metadata.';
comment on table component_generation_proposals is
  'Human-reviewable, validated component proposals before an immutable draft version is applied.';
