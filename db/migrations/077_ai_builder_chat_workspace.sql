create table if not exists promo_builder_chat_sessions (
  id uuid primary key default gen_random_uuid(),
  document_id uuid not null references promo_builder_documents(id) on delete cascade,
  request_id text not null default '',
  owner_subject text not null,
  stage text not null default 'idle' check (stage in (
    'idle', 'requirements_review', 'wireframe_review', 'finalizing', 'completed'
  )),
  latest_requirements_revision integer not null default 0 check (latest_requirements_revision >= 0),
  latest_wireframe_revision integer not null default 0 check (latest_wireframe_revision >= 0),
  confirmed_wireframe_revision integer,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique(document_id, owner_subject)
);

create index if not exists promo_builder_chat_sessions_owner_idx
  on promo_builder_chat_sessions(owner_subject, updated_at desc);

create table if not exists promo_builder_chat_messages (
  id uuid primary key,
  session_id uuid not null references promo_builder_chat_sessions(id) on delete cascade,
  role text not null check (role in ('user', 'assistant', 'system')),
  message_type text not null default 'message',
  text_content text not null default '',
  operation_id text not null default '',
  status text not null default '',
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists promo_builder_chat_messages_session_idx
  on promo_builder_chat_messages(session_id, created_at, id);

create table if not exists promo_builder_chat_actions (
  id uuid primary key default gen_random_uuid(),
  session_id uuid not null references promo_builder_chat_sessions(id) on delete cascade,
  message_id uuid not null references promo_builder_chat_messages(id) on delete cascade,
  action_key text not null,
  label text not null,
  payload jsonb not null default '{}'::jsonb,
  issued_stage text not null,
  status text not null default 'proposed' check (status in ('proposed', 'executed', 'expired')),
  idempotency_key text,
  executed_at timestamptz,
  created_at timestamptz not null default now(),
  unique(message_id, action_key),
  unique(session_id, idempotency_key)
);

create table if not exists promo_builder_requirements_revisions (
  id uuid primary key default gen_random_uuid(),
  session_id uuid not null references promo_builder_chat_sessions(id) on delete cascade,
  revision integer not null check (revision > 0),
  document_revision integer not null check (document_revision >= 0),
  requirements_json jsonb not null,
  requirements_fingerprint text not null,
  created_at timestamptz not null default now(),
  unique(session_id, revision)
);

create table if not exists promo_builder_wireframe_revisions (
  id uuid primary key default gen_random_uuid(),
  session_id uuid not null references promo_builder_chat_sessions(id) on delete cascade,
  document_id uuid not null references promo_builder_documents(id) on delete cascade,
  proposal_id uuid not null references promo_builder_composition_proposals(id) on delete cascade,
  revision integer not null check (revision > 0),
  requirements_revision integer not null check (requirements_revision > 0),
  base_document_revision integer not null check (base_document_revision >= 0),
  structure_json jsonb not null,
  structure_fingerprint text not null,
  snapshot_json jsonb not null,
  status text not null default 'draft' check (status in ('draft', 'confirmed', 'stale')),
  confirmed_at timestamptz,
  created_at timestamptz not null default now(),
  unique(session_id, revision),
  unique(session_id, proposal_id)
);

create index if not exists promo_builder_wireframe_revisions_session_idx
  on promo_builder_wireframe_revisions(session_id, revision desc);
