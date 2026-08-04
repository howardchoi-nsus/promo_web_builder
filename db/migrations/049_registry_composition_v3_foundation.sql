-- Registry composition foundation for Builder Composition Contract v3.
-- Contract v2 functions remain unchanged for backward compatibility.

create table if not exists promo_composition_shells (
  id uuid primary key default gen_random_uuid(),
  shell_key text not null unique,
  name text not null,
  description text not null default '',
  status text not null default 'active'
    check (status in ('active', 'inactive', 'archived')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists promo_composition_shell_versions (
  id uuid primary key default gen_random_uuid(),
  shell_id uuid not null references promo_composition_shells(id) on delete restrict,
  version integer not null check (version > 0),
  status text not null default 'draft'
    check (status in ('draft', 'active', 'inactive', 'archived')),
  config_json jsonb not null default '{}'::jsonb,
  change_note text not null default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (jsonb_typeof(config_json) = 'object'),
  unique(shell_id, version)
);

create unique index if not exists promo_composition_shell_versions_active_uidx
  on promo_composition_shell_versions(shell_id)
  where status = 'active';

alter table promo_builder_composition_proposals
  add column if not exists stage text,
  add column if not exists shell_version_id uuid
    references promo_composition_shell_versions(id) on delete restrict,
  add column if not exists policy_fingerprint text not null default '',
  add column if not exists resource_fingerprint text not null default '';

alter table promo_builder_composition_proposals
  drop constraint if exists promo_builder_composition_proposals_stage_chk;
alter table promo_builder_composition_proposals
  add constraint promo_builder_composition_proposals_stage_chk
  check (stage is null or stage in ('planning', 'validating', 'repairing', 'applying'));

alter table promo_builder_composition_proposals
  drop constraint if exists promo_builder_composition_proposals_v3_metadata_chk;
alter table promo_builder_composition_proposals
  add constraint promo_builder_composition_proposals_v3_metadata_chk
  check (
    contract_version <> 3 or (
      shell_version_id is not null
      and length(trim(policy_fingerprint)) > 0
      and length(trim(resource_fingerprint)) > 0
    )
  );

create index if not exists promo_builder_composition_proposals_shell_version_idx
  on promo_builder_composition_proposals(shell_version_id)
  where shell_version_id is not null;

create or replace function create_promo_builder_composition_proposal_v3(
  p_document_id uuid,
  p_owner_subject text,
  p_request_id text,
  p_base_document_revision integer,
  p_overview_fingerprint text,
  p_candidate_fingerprint text,
  p_policy_fingerprint text,
  p_resource_fingerprint text,
  p_shell_version_id uuid,
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
  v_existing promo_builder_composition_proposals%rowtype;
  v_proposal_id uuid;
begin
  select * into v_document
  from promo_builder_documents
  where id = p_document_id
  for update;

  if not found then raise exception 'Builder document not found'; end if;
  if v_document.owner_subject <> p_owner_subject then
    raise exception 'Builder document access denied';
  end if;
  if v_document.mode <> 'ai' then
    raise exception 'Contract v3 composition requires an AI Builder document';
  end if;
  if v_document.current_document_revision <> p_base_document_revision then
    raise exception 'Builder document revision conflict';
  end if;
  if length(trim(coalesce(p_overview_fingerprint, ''))) = 0
    or length(trim(coalesce(p_candidate_fingerprint, ''))) = 0
    or length(trim(coalesce(p_policy_fingerprint, ''))) = 0
    or length(trim(coalesce(p_resource_fingerprint, ''))) = 0 then
    raise exception 'Contract v3 composition fingerprints are required';
  end if;
  if jsonb_typeof(p_request_snapshot) <> 'object'
    or jsonb_typeof(p_candidate_snapshot) <> 'object' then
    raise exception 'Contract v3 composition snapshots must be JSON objects';
  end if;
  if (p_source_template_id is null) <> (p_source_template_version is null) then
    raise exception 'Source template id and version must be provided together';
  end if;
  if not exists (
    select 1
    from promo_composition_shell_versions shell_version
    join promo_composition_shells shell on shell.id = shell_version.shell_id
    where shell_version.id = p_shell_version_id
      and shell_version.status = 'active'
      and shell.status = 'active'
  ) then
    raise exception 'Active composition shell version not found';
  end if;

  select * into v_existing
  from promo_builder_composition_proposals
  where document_id = p_document_id and idempotency_key = p_idempotency_key;
  if v_existing.id is not null then
    if v_existing.contract_version <> 3
      or v_existing.overview_fingerprint <> p_overview_fingerprint
      or v_existing.candidate_fingerprint <> p_candidate_fingerprint
      or v_existing.policy_fingerprint <> p_policy_fingerprint
      or v_existing.resource_fingerprint <> p_resource_fingerprint
      or v_existing.shell_version_id is distinct from p_shell_version_id then
      raise exception 'Composition proposal idempotency conflict';
    end if;
    return v_existing.id;
  end if;

  update promo_builder_composition_proposals
  set status = case when status = 'ready' then 'superseded' else 'cancelled' end,
      stage = null,
      lease_token = null,
      lease_expires_at = null,
      updated_at = now()
  where document_id = p_document_id
    and status in ('queued', 'processing', 'ready');

  insert into promo_builder_composition_proposals (
    document_id, request_id, base_document_revision,
    overview_fingerprint, candidate_fingerprint,
    policy_fingerprint, resource_fingerprint, shell_version_id,
    source_template_id, source_template_version,
    contract_version, request_snapshot, candidate_snapshot,
    status, stage, prompt_template_id, idempotency_key
  ) values (
    p_document_id, p_request_id, p_base_document_revision,
    p_overview_fingerprint, p_candidate_fingerprint,
    p_policy_fingerprint, p_resource_fingerprint, p_shell_version_id,
    p_source_template_id, p_source_template_version,
    3, p_request_snapshot, p_candidate_snapshot,
    'queued', null, p_prompt_template_id, p_idempotency_key
  ) returning id into v_proposal_id;

  return v_proposal_id;
end $$;

create or replace function apply_promo_builder_composition_proposal_v3(
  p_document_id uuid,
  p_proposal_id uuid,
  p_owner_subject text,
  p_base_document_revision integer,
  p_overview_fingerprint text,
  p_candidate_fingerprint text,
  p_policy_fingerprint text,
  p_resource_fingerprint text,
  p_shell_version_id uuid,
  p_snapshot_json jsonb,
  p_snapshot_hash text,
  p_change_note text default 'AI composition v3 applied.'
) returns integer
language plpgsql
as $$
declare
  v_document promo_builder_documents%rowtype;
  v_proposal promo_builder_composition_proposals%rowtype;
  v_revision integer;
begin
  select * into v_document
  from promo_builder_documents
  where id = p_document_id
  for update;

  if not found then raise exception 'Builder document not found'; end if;
  if v_document.owner_subject <> p_owner_subject then
    raise exception 'Builder document access denied';
  end if;
  if v_document.mode <> 'ai' then
    raise exception 'Contract v3 composition requires an AI Builder document';
  end if;
  if v_document.current_document_revision <> p_base_document_revision then
    raise exception 'Builder document revision conflict';
  end if;

  select * into v_proposal
  from promo_builder_composition_proposals
  where id = p_proposal_id and document_id = p_document_id
  for update;

  if not found then raise exception 'Composition proposal not found'; end if;
  if v_proposal.contract_version <> 3 then
    raise exception 'Composition proposal contract version mismatch';
  end if;
  if v_proposal.status <> 'ready' then
    raise exception 'Composition proposal is not ready';
  end if;
  if v_proposal.base_document_revision <> p_base_document_revision then
    raise exception 'Composition proposal revision conflict';
  end if;
  if v_proposal.overview_fingerprint <> p_overview_fingerprint
    or v_proposal.candidate_fingerprint <> p_candidate_fingerprint
    or v_proposal.policy_fingerprint <> p_policy_fingerprint
    or v_proposal.resource_fingerprint <> p_resource_fingerprint then
    raise exception 'Composition proposal fingerprint conflict';
  end if;
  if v_proposal.shell_version_id is distinct from p_shell_version_id then
    raise exception 'Composition proposal shell version conflict';
  end if;
  if not exists (
    select 1
    from promo_composition_shell_versions shell_version
    join promo_composition_shells shell on shell.id = shell_version.shell_id
    where shell_version.id = p_shell_version_id
      and shell_version.status = 'active'
      and shell.status = 'active'
  ) then
    raise exception 'Active composition shell version not found';
  end if;
  if jsonb_typeof(p_snapshot_json) <> 'object' then
    raise exception 'Contract v3 document snapshot must be a JSON object';
  end if;
  if length(trim(coalesce(p_snapshot_hash, ''))) = 0 then
    raise exception 'Contract v3 document snapshot hash is required';
  end if;

  update promo_builder_composition_proposals
  set stage = 'applying', updated_at = now()
  where id = p_proposal_id;

  v_revision := p_base_document_revision + 1;
  insert into promo_builder_document_versions (
    document_id, proposal_id, revision, contract_version,
    snapshot_json, snapshot_hash, change_note, source
  ) values (
    p_document_id, p_proposal_id, v_revision, 3,
    p_snapshot_json, p_snapshot_hash, p_change_note, 'ai'
  );

  update promo_builder_documents
  set current_document_revision = v_revision, status = 'ready', updated_at = now()
  where id = p_document_id;

  update promo_builder_composition_proposals
  set status = 'applied', stage = null, updated_at = now()
  where id = p_proposal_id;

  return v_revision;
end $$;

comment on function create_promo_builder_composition_proposal_v3(
  uuid, text, text, integer, text, text, text, text, uuid, uuid, integer,
  jsonb, jsonb, uuid, text
) is 'Creates an additive Contract v3 registry-composition proposal without changing the v2 function.';

comment on function apply_promo_builder_composition_proposal_v3(
  uuid, uuid, text, integer, text, text, text, text, uuid, jsonb, text, text
) is 'Atomically applies a Contract v3 proposal after revision, fingerprint, and shell checks.';
