begin;

create schema if not exists user_service;
create schema if not exists llm_runtime;
create schema if not exists cms;
create schema if not exists web_output;

create table if not exists user_service.promo_requests (
  id uuid primary key default gen_random_uuid(),
  owner_subject text not null,
  idempotency_key text not null,
  channel text not null check (channel in ('nuxt-portal', 'slack', 'ai-builder', 'api')),
  status text not null default 'requested' check (status in (
    'requested', 'validating', 'analyzing', 'queued', 'generating',
    'review_required', 'approved', 'rejected', 'publishing', 'published',
    'failed', 'cancelled'
  )),
  brief_json jsonb not null default '{}'::jsonb,
  references_json jsonb not null default '{}'::jsonb,
  document_id uuid,
  generation_job_id uuid,
  publication_id uuid,
  last_event_id uuid,
  last_event_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (owner_subject, idempotency_key)
);

create index if not exists promo_requests_owner_updated_idx
  on user_service.promo_requests(owner_subject, updated_at desc);

create table if not exists user_service.promo_request_feedback (
  id uuid primary key default gen_random_uuid(),
  request_id uuid not null references user_service.promo_requests(id) on delete cascade,
  submitted_by text not null,
  feedback_text text not null,
  base_document_revision integer,
  created_at timestamptz not null default now()
);

create index if not exists promo_request_feedback_request_idx
  on user_service.promo_request_feedback(request_id, created_at desc);

create table if not exists llm_runtime.generation_jobs (
  id uuid primary key default gen_random_uuid(),
  request_id uuid not null,
  idempotency_key text not null,
  pipeline text not null check (pipeline in ('composition', 'final-design', 'text-first')),
  status text not null default 'accepted' check (status in (
    'accepted', 'queued', 'running', 'quality_checking', 'ready', 'failed', 'cancelled'
  )),
  attempt integer not null default 0 check (attempt >= 0),
  input_hash text not null,
  input_snapshot jsonb not null default '{}'::jsonb,
  legacy_run_id text,
  result_reference jsonb,
  error_json jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (request_id, idempotency_key)
);

create index if not exists generation_jobs_request_updated_idx
  on llm_runtime.generation_jobs(request_id, updated_at desc);

create table if not exists cms.promotion_approvals (
  id uuid primary key default gen_random_uuid(),
  request_id uuid not null,
  promotion_id uuid not null,
  document_id uuid not null,
  document_revision integer not null check (document_revision > 0),
  decision text not null check (decision in ('approved', 'rejected')),
  decided_by text not null,
  comment text not null default '',
  snapshot_hash text not null default '',
  decided_at timestamptz not null default now(),
  created_at timestamptz not null default now()
);

create unique index if not exists promotion_approvals_approved_revision_idx
  on cms.promotion_approvals(document_id, document_revision)
  where decision = 'approved';
create index if not exists promotion_approvals_request_idx
  on cms.promotion_approvals(request_id, decided_at desc);

create table if not exists web_output.publication_snapshots (
  id uuid primary key default gen_random_uuid(),
  approval_id uuid not null,
  promotion_id uuid not null,
  document_id uuid not null,
  document_revision integer not null check (document_revision > 0),
  locale text not null,
  slug text not null,
  status text not null default 'pending' check (status in ('pending', 'publishing', 'published', 'failed', 'unpublished')),
  snapshot_json jsonb not null,
  snapshot_hash text not null,
  production_url text,
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (locale, slug, snapshot_hash)
);

do $$
declare
  schema_name text;
begin
  foreach schema_name in array array['user_service', 'llm_runtime', 'cms', 'web_output']
  loop
    execute format($sql$
      create table if not exists %I.domain_outbox (
        event_id uuid primary key default gen_random_uuid(),
        event_version integer not null default 3 check (event_version = 3),
        event_type text not null,
        producer text not null,
        correlation_id text not null,
        aggregate_type text not null,
        aggregate_id text not null,
        aggregate_version integer not null default 1 check (aggregate_version >= 0),
        payload jsonb not null default '{}'::jsonb,
        occurred_at timestamptz not null default now(),
        published_at timestamptz,
        attempts integer not null default 0,
        last_error text
      )
    $sql$, schema_name);
    execute format(
      'create index if not exists %I on %I.domain_outbox(occurred_at) where published_at is null',
      schema_name || '_domain_outbox_pending_idx', schema_name
    );
  end loop;
end $$;

comment on schema user_service is 'V3 user request, feedback, projection, and notification domain.';
comment on schema llm_runtime is 'V3 LLM job, attempt, snapshot, and quality execution domain.';
comment on schema cms is 'V3 CMS draft, version, and approval ownership boundary.';
comment on schema web_output is 'V3 immutable publication snapshot and runtime ownership boundary.';

commit;
