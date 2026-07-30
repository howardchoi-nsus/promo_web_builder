-- AI Promotion Builder Composition Engine (Contract v2)
-- Additive migration. Existing template-mode rows and APIs remain valid.

alter table wizard_content_sections
  add column if not exists composition_scope text not null default 'template',
  add column if not exists section_role text not null default 'content',
  add column if not exists composition_policy jsonb not null default '{
    "selectionPolicy":"optional",
    "allowedMarkets":[],
    "allowedPromotionPurposes":[],
    "aiEditable":true,
    "contentLocked":false,
    "layoutLocked":false,
    "duplicatePolicy":"forbidden",
    "maxInstances":1,
    "allowedLayoutVariants":[],
    "allowedMotionPresets":[]
  }'::jsonb;

alter table wizard_content_sections
  drop constraint if exists wizard_content_sections_composition_scope_chk;
alter table wizard_content_sections
  add constraint wizard_content_sections_composition_scope_chk
  check (composition_scope in ('shared', 'template'));

alter table wizard_content_sections
  drop constraint if exists wizard_content_sections_section_role_chk;
alter table wizard_content_sections
  add constraint wizard_content_sections_section_role_chk
  check (section_role in (
    'header', 'footer', 'terms', 'legal', 'responsible-gaming',
    'hero', 'benefit', 'content', 'cta', 'notice'
  ));

update wizard_content_sections
set
  composition_scope = case
    when fixed_position is not null
      or lower(section_key) ~ '(header|footer|terms|legal|responsible)'
      then 'shared'
    else composition_scope
  end,
  section_role = case
    when fixed_position = 'top' or lower(section_key) like '%header%' then 'header'
    when fixed_position = 'bottom' or lower(section_key) like '%footer%' then 'footer'
    when lower(section_key) ~ '(terms|tnc)' then 'terms'
    when lower(section_key) like '%legal%' then 'legal'
    when lower(section_key) ~ '(responsible|rg)' then 'responsible-gaming'
    when lower(section_key) like '%hero%' then 'hero'
    when lower(section_key) like '%cta%' then 'cta'
    when lower(section_key) like '%notice%' then 'notice'
    when lower(section_key) ~ '(benefit|offer)' then 'benefit'
    else section_role
  end,
  composition_policy = jsonb_build_object(
    'selectionPolicy', case
      when fixed_position is not null or is_required then 'required'
      when lower(section_key) ~ '(terms|tnc|legal|responsible)' then 'required-by-market'
      else coalesce(nullif(composition_policy->>'selectionPolicy', ''), 'optional')
    end,
    'allowedMarkets', coalesce(composition_policy->'allowedMarkets', '[]'::jsonb),
    'allowedPromotionPurposes', coalesce(composition_policy->'allowedPromotionPurposes', '[]'::jsonb),
    'aiEditable', case when lower(section_key) ~ '(terms|tnc|legal|responsible)' then false else true end,
    'contentLocked', case when lower(section_key) ~ '(terms|tnc|legal|responsible)' then true else false end,
    'layoutLocked', fixed_position is not null,
    'duplicatePolicy', 'forbidden',
    'maxInstances', 1,
    'allowedLayoutVariants', coalesce(ai_design->'allowedLayoutVariants', '[]'::jsonb),
    'allowedMotionPresets', coalesce(composition_policy->'allowedMotionPresets', '[]'::jsonb)
  );

create or replace function clone_wizard_content_section_draft(
  p_source_id uuid,
  p_change_note text default 'Draft created from existing section.'
) returns uuid
language plpgsql
as $$
declare
  v_source wizard_content_sections%rowtype;
  v_new_id uuid;
  v_next_version integer;
begin
  select * into v_source from wizard_content_sections where id = p_source_id for update;
  if not found then raise exception 'Source section not found'; end if;
  perform pg_advisory_xact_lock(hashtext('wizard_content_section:' || v_source.section_key));
  if exists (
    select 1 from wizard_content_sections
    where section_key = v_source.section_key and status = 'draft'
  ) then
    raise exception 'A draft already exists for this section';
  end if;
  select coalesce(max(version), 0) + 1 into v_next_version
  from wizard_content_sections where section_key = v_source.section_key;

  insert into wizard_content_sections (
    section_key, name, description, is_required, order_change_allowed, fixed_position,
    sort_order, is_visible_in_wizard, status, version, change_note,
    owner_form_template_id, ai_design,
    composition_scope, section_role, composition_policy
  ) values (
    v_source.section_key, v_source.name, v_source.description, v_source.is_required,
    v_source.order_change_allowed, v_source.fixed_position, v_source.sort_order,
    v_source.is_visible_in_wizard, 'draft', v_next_version, p_change_note,
    null, v_source.ai_design,
    v_source.composition_scope, v_source.section_role, v_source.composition_policy
  ) returning id into v_new_id;

  insert into wizard_content_section_component_instances (
    section_id, component_version_id, item_key, display_name, is_visible_in_wizard,
    is_required, user_reorder_allowed, sort_order, is_locked, locked_value, instance_config
  )
  select v_new_id, component_version_id, item_key, display_name, is_visible_in_wizard,
    is_required, user_reorder_allowed, sort_order, is_locked, locked_value, instance_config
  from wizard_content_section_component_instances where section_id = p_source_id;

  insert into wizard_content_section_histories (
    section_key, section_id, previous_version, new_version,
    previous_status, new_status, change_note, previous_state, new_state
  ) values (
    v_source.section_key, v_new_id, v_source.version, v_next_version,
    v_source.status, 'draft', p_change_note,
    jsonb_build_object(
      'compositionScope', v_source.composition_scope,
      'sectionRole', v_source.section_role,
      'compositionPolicy', v_source.composition_policy
    ),
    jsonb_build_object(
      'compositionScope', v_source.composition_scope,
      'sectionRole', v_source.section_role,
      'compositionPolicy', v_source.composition_policy
    )
  );
  return v_new_id;
end $$;

create or replace function activate_wizard_content_section(
  p_target_id uuid,
  p_change_note text default 'Section activated.'
) returns uuid
language plpgsql
as $$
declare
  v_target wizard_content_sections%rowtype;
  v_selection_policy text;
  v_max_instances integer;
begin
  select * into v_target from wizard_content_sections where id = p_target_id for update;
  if not found then raise exception 'Section not found'; end if;
  perform pg_advisory_xact_lock(hashtext('wizard_content_section:' || v_target.section_key));
  if v_target.status = 'archived' then raise exception 'Archived sections cannot be activated'; end if;
  if v_target.status = 'active' then raise exception 'Section is already active'; end if;
  if jsonb_typeof(v_target.composition_policy) <> 'object' then
    raise exception 'Section composition policy must be an object';
  end if;
  v_selection_policy := coalesce(v_target.composition_policy->>'selectionPolicy', '');
  if v_selection_policy not in (
    'required', 'required-by-market', 'required-by-purpose', 'recommended', 'optional'
  ) then raise exception 'Invalid section selection policy'; end if;
  v_max_instances := coalesce((v_target.composition_policy->>'maxInstances')::integer, 1);
  if v_max_instances < 1 or v_max_instances > 20 then
    raise exception 'Section maxInstances must be between 1 and 20';
  end if;
  if v_target.fixed_position is not null
    and v_selection_policy <> 'required' then
    raise exception 'Fixed-position sections must use required selection policy';
  end if;
  if v_target.composition_scope = 'shared'
    and v_target.owner_form_template_id is not null then
    raise exception 'Shared sections cannot be owned by a form template';
  end if;
  if not exists (
    select 1 from wizard_content_section_component_instances instance
    join wizard_item_component_versions version on version.id = instance.component_version_id
    where instance.section_id = p_target_id and instance.is_visible_in_wizard = true
      and version.status in ('active', 'inactive')
  ) then raise exception 'Section requires at least one visible component instance'; end if;

  update wizard_content_sections set status = 'inactive', updated_at = now()
  where section_key = v_target.section_key and status = 'active' and id <> p_target_id;
  update wizard_content_sections set status = 'active', change_note = p_change_note,
    archived_at = null, updated_at = now() where id = p_target_id;
  insert into wizard_content_section_histories (
    section_key, section_id, previous_version, new_version,
    previous_status, new_status, change_note, previous_state, new_state
  ) values (
    v_target.section_key, p_target_id, v_target.version, v_target.version,
    v_target.status, 'active', p_change_note,
    jsonb_build_object(
      'compositionScope', v_target.composition_scope,
      'sectionRole', v_target.section_role,
      'compositionPolicy', v_target.composition_policy
    ),
    jsonb_build_object(
      'compositionScope', v_target.composition_scope,
      'sectionRole', v_target.section_role,
      'compositionPolicy', v_target.composition_policy
    )
  );
  return p_target_id;
end $$;

create table if not exists promo_builder_documents (
  id uuid primary key default gen_random_uuid(),
  document_key text not null unique,
  mode text not null check (mode in ('template', 'ai')),
  status text not null default 'draft'
    check (status in ('draft', 'ready', 'published', 'archived')),
  owner_subject text not null,
  current_document_revision integer not null default 0
    check (current_document_revision >= 0),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists promo_builder_documents_owner_idx
  on promo_builder_documents(owner_subject, updated_at desc);

create table if not exists promo_builder_composition_proposals (
  id uuid primary key default gen_random_uuid(),
  document_id uuid not null references promo_builder_documents(id) on delete cascade,
  request_id text not null,
  base_document_revision integer not null,
  overview_fingerprint text not null,
  candidate_fingerprint text not null,
  source_template_id uuid references wizard_form_templates(id) on delete set null,
  source_template_version integer,
  contract_version integer not null default 2,
  request_snapshot jsonb not null,
  candidate_snapshot jsonb not null,
  proposal_snapshot jsonb,
  validation_json jsonb not null default '{}'::jsonb,
  status text not null default 'queued' check (status in (
    'queued', 'processing', 'ready', 'failed',
    'applied', 'superseded', 'cancelled'
  )),
  prompt_template_id uuid references prompt_templates(id) on delete set null,
  idempotency_key text not null,
  current_attempt integer not null default 0,
  max_attempts integer not null default 3,
  lease_token text,
  lease_expires_at timestamptz,
  next_retry_at timestamptz,
  error_code text not null default '',
  error_message text not null default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (status not in ('ready', 'applied') or proposal_snapshot is not null),
  unique(document_id, idempotency_key)
);

create unique index if not exists promo_builder_composition_proposals_active_uidx
  on promo_builder_composition_proposals(document_id)
  where status in ('queued', 'processing');
create index if not exists promo_builder_composition_proposals_work_idx
  on promo_builder_composition_proposals(status, next_retry_at, lease_expires_at);

create table if not exists promo_builder_document_versions (
  id uuid primary key default gen_random_uuid(),
  document_id uuid not null references promo_builder_documents(id) on delete cascade,
  proposal_id uuid references promo_builder_composition_proposals(id) on delete set null,
  revision integer not null check (revision > 0),
  contract_version integer not null default 2,
  snapshot_json jsonb not null,
  snapshot_hash text not null,
  change_note text not null default '',
  source text not null check (source in ('template', 'ai', 'manual', 'rollback')),
  applied_at timestamptz not null default now(),
  created_at timestamptz not null default now(),
  unique(document_id, revision)
);

create table if not exists promo_builder_document_operations (
  id uuid primary key default gen_random_uuid(),
  document_id uuid not null references promo_builder_documents(id) on delete cascade,
  operation_id text not null,
  base_document_revision integer not null,
  applied_revision integer,
  operation_type text not null,
  target_instance_id text not null,
  operation_json jsonb not null,
  source text not null check (source in ('ai', 'manual', 'system')),
  created_at timestamptz not null default now(),
  unique(document_id, operation_id)
);

create table if not exists promo_builder_events (
  id uuid primary key default gen_random_uuid(),
  document_id uuid references promo_builder_documents(id) on delete set null,
  owner_subject_hash text not null,
  event_name text not null check (event_name in (
    'builder_mode_selected', 'ai_overview_requested', 'ai_overview_reviewed',
    'shared_sections_confirmed', 'composition_requested', 'composition_validated',
    'composition_auto_applied', 'composition_review_required', 'composition_applied',
    'composition_apply_failed', 'composition_operation_proposed',
    'composition_operation_applied', 'composition_revision_conflict',
    'asset_job_started', 'asset_job_ready', 'asset_job_failed',
    'web_output_opened'
  )),
  document_revision integer,
  request_id text not null default '',
  duration_ms integer,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists promo_builder_events_document_idx
  on promo_builder_events(document_id, created_at desc);
create index if not exists promo_builder_events_name_idx
  on promo_builder_events(event_name, created_at desc);

create table if not exists promo_motion_presets (
  id uuid primary key default gen_random_uuid(),
  preset_key text not null unique,
  name text not null,
  status text not null default 'active' check (status in ('active', 'archived')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists promo_motion_preset_versions (
  id uuid primary key default gen_random_uuid(),
  preset_id uuid not null references promo_motion_presets(id) on delete restrict,
  version integer not null,
  status text not null check (status in ('draft', 'active', 'inactive', 'archived')),
  config_json jsonb not null,
  change_note text not null default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique(preset_id, version)
);

create unique index if not exists promo_motion_preset_versions_active_uidx
  on promo_motion_preset_versions(preset_id)
  where status = 'active';

insert into promo_motion_presets (preset_key, name)
values
  ('none', 'None'),
  ('fade-up', 'Fade Up'),
  ('fade-in', 'Fade In'),
  ('scale-in', 'Scale In')
on conflict (preset_key) do nothing;

insert into promo_motion_preset_versions (
  preset_id, version, status, config_json, change_note
)
select id, 1, 'active',
  case preset_key
    when 'none' then '{"className":"","durationToken":"0ms","easingToken":"linear","delayToken":"0ms"}'::jsonb
    when 'fade-up' then '{"className":"motion-fade-up","durationToken":"480ms","easingToken":"ease-out","delayToken":"0ms"}'::jsonb
    when 'fade-in' then '{"className":"motion-fade-in","durationToken":"360ms","easingToken":"ease-out","delayToken":"0ms"}'::jsonb
    else '{"className":"motion-scale-in","durationToken":"420ms","easingToken":"ease-out","delayToken":"0ms"}'::jsonb
  end,
  'Initial controlled motion preset.'
from promo_motion_presets preset
where not exists (
  select 1 from promo_motion_preset_versions version
  where version.preset_id = preset.id
);

alter table promo_section_design_runs
  add column if not exists builder_document_id uuid
    references promo_builder_documents(id) on delete set null,
  add column if not exists builder_document_revision integer,
  add column if not exists page_section_instance_id text,
  add column if not exists page_component_instance_id text,
  add column if not exists builder_asset_request_id text;

create unique index if not exists promo_section_design_runs_builder_asset_uidx
  on promo_section_design_runs(builder_document_id, builder_asset_request_id)
  where builder_document_id is not null
    and builder_asset_request_id is not null;

alter table promo_section_design_runs
  drop constraint if exists promo_section_design_runs_builder_ref_chk;
alter table promo_section_design_runs
  add constraint promo_section_design_runs_builder_ref_chk
  check (
    builder_document_id is null
    or (
      builder_document_revision is not null
      and nullif(builder_asset_request_id, '') is not null
    )
  );

create or replace function create_promo_builder_composition_proposal(
  p_document_id uuid,
  p_owner_subject text,
  p_request_id text,
  p_base_document_revision integer,
  p_overview_fingerprint text,
  p_candidate_fingerprint text,
  p_source_template_id uuid,
  p_source_template_version integer,
  p_request_snapshot jsonb,
  p_candidate_snapshot jsonb,
  p_prompt_template_id uuid,
  p_idempotency_key text
) returns uuid
language plpgsql
as $$
declare
  v_document promo_builder_documents%rowtype;
  v_existing_id uuid;
  v_proposal_id uuid;
begin
  select * into v_document
  from promo_builder_documents
  where id = p_document_id
  for update;
  if not found then raise exception 'Builder document not found'; end if;
  if v_document.owner_subject <> p_owner_subject then raise exception 'Builder document access denied'; end if;
  if v_document.current_document_revision <> p_base_document_revision then
    raise exception 'Builder document revision conflict';
  end if;

  select id into v_existing_id
  from promo_builder_composition_proposals
  where document_id = p_document_id and idempotency_key = p_idempotency_key;
  if v_existing_id is not null then return v_existing_id; end if;

  update promo_builder_composition_proposals
  set status = case when status = 'ready' then 'superseded' else 'cancelled' end,
      lease_token = null,
      lease_expires_at = null,
      updated_at = now()
  where document_id = p_document_id
    and status in ('queued', 'processing', 'ready');

  insert into promo_builder_composition_proposals (
    document_id, request_id, base_document_revision,
    overview_fingerprint, candidate_fingerprint,
    source_template_id, source_template_version,
    contract_version, request_snapshot, candidate_snapshot,
    status, prompt_template_id, idempotency_key
  ) values (
    p_document_id, p_request_id, p_base_document_revision,
    p_overview_fingerprint, p_candidate_fingerprint,
    p_source_template_id, p_source_template_version,
    2, p_request_snapshot, p_candidate_snapshot,
    'queued', p_prompt_template_id, p_idempotency_key
  ) returning id into v_proposal_id;
  return v_proposal_id;
end $$;

create or replace function apply_promo_builder_composition_proposal(
  p_document_id uuid,
  p_proposal_id uuid,
  p_owner_subject text,
  p_base_document_revision integer,
  p_snapshot_json jsonb,
  p_snapshot_hash text,
  p_change_note text default 'AI composition applied.'
) returns integer
language plpgsql
as $$
declare
  v_document promo_builder_documents%rowtype;
  v_proposal promo_builder_composition_proposals%rowtype;
  v_revision integer;
begin
  select * into v_document from promo_builder_documents
  where id = p_document_id for update;
  if not found then raise exception 'Builder document not found'; end if;
  if v_document.owner_subject <> p_owner_subject then raise exception 'Builder document access denied'; end if;
  if v_document.current_document_revision <> p_base_document_revision then
    raise exception 'Builder document revision conflict';
  end if;
  select * into v_proposal from promo_builder_composition_proposals
  where id = p_proposal_id and document_id = p_document_id for update;
  if not found then raise exception 'Composition proposal not found'; end if;
  if v_proposal.status <> 'ready' then raise exception 'Composition proposal is not ready'; end if;
  if v_proposal.base_document_revision <> p_base_document_revision then
    raise exception 'Composition proposal revision conflict';
  end if;
  v_revision := p_base_document_revision + 1;
  insert into promo_builder_document_versions (
    document_id, proposal_id, revision, contract_version,
    snapshot_json, snapshot_hash, change_note, source
  ) values (
    p_document_id, p_proposal_id, v_revision, 2,
    p_snapshot_json, p_snapshot_hash, p_change_note, 'ai'
  );
  update promo_builder_documents
  set current_document_revision = v_revision, status = 'ready', updated_at = now()
  where id = p_document_id;
  update promo_builder_composition_proposals
  set status = 'applied', updated_at = now()
  where id = p_proposal_id;
  return v_revision;
end $$;

create or replace function create_promo_builder_document_revision(
  p_document_id uuid,
  p_owner_subject text,
  p_base_document_revision integer,
  p_snapshot_json jsonb,
  p_snapshot_hash text,
  p_source text,
  p_change_note text
) returns integer
language plpgsql
as $$
declare
  v_document promo_builder_documents%rowtype;
  v_revision integer;
begin
  select * into v_document from promo_builder_documents
  where id = p_document_id for update;
  if not found then raise exception 'Builder document not found'; end if;
  if v_document.owner_subject <> p_owner_subject then raise exception 'Builder document access denied'; end if;
  if v_document.current_document_revision <> p_base_document_revision then
    raise exception 'Builder document revision conflict';
  end if;
  if p_source not in ('template', 'ai', 'manual', 'rollback') then
    raise exception 'Invalid Builder document revision source';
  end if;
  v_revision := p_base_document_revision + 1;
  insert into promo_builder_document_versions (
    document_id, revision, contract_version, snapshot_json,
    snapshot_hash, change_note, source
  ) values (
    p_document_id, v_revision, 2, p_snapshot_json,
    p_snapshot_hash, p_change_note, p_source
  );
  update promo_builder_documents
  set current_document_revision = v_revision, status = 'ready', updated_at = now()
  where id = p_document_id;
  return v_revision;
end $$;

create or replace function apply_promo_builder_operations(
  p_document_id uuid,
  p_owner_subject text,
  p_base_document_revision integer,
  p_snapshot_json jsonb,
  p_snapshot_hash text,
  p_operations jsonb,
  p_change_note text
) returns integer
language plpgsql
as $$
declare
  v_document promo_builder_documents%rowtype;
  v_revision integer;
begin
  select * into v_document from promo_builder_documents
  where id = p_document_id for update;
  if not found then raise exception 'Builder document not found'; end if;
  if v_document.owner_subject <> p_owner_subject then raise exception 'Builder document access denied'; end if;
  if v_document.current_document_revision <> p_base_document_revision then
    raise exception 'Builder document revision conflict';
  end if;
  v_revision := p_base_document_revision + 1;
  insert into promo_builder_document_versions (
    document_id, revision, contract_version, snapshot_json,
    snapshot_hash, change_note, source
  ) values (
    p_document_id, v_revision, 2, p_snapshot_json,
    p_snapshot_hash, p_change_note, 'manual'
  );
  insert into promo_builder_document_operations (
    document_id, operation_id, base_document_revision, applied_revision,
    operation_type, target_instance_id, operation_json, source
  )
  select
    p_document_id,
    operation->>'operationId',
    p_base_document_revision,
    v_revision,
    operation->>'type',
    operation->>'targetInstanceId',
    operation,
    coalesce(nullif(operation->>'source', ''), 'ai')
  from jsonb_array_elements(p_operations) operation;
  update promo_builder_documents
  set current_document_revision = v_revision, status = 'ready', updated_at = now()
  where id = p_document_id;
  return v_revision;
end $$;
