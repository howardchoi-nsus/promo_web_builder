create extension if not exists pgcrypto;

create table if not exists locales (
  code text primary key,
  label text not null,
  is_default boolean not null default false,
  enabled boolean not null default true,
  snapshot_revision bigint not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create unique index if not exists locales_one_default_uidx
  on locales (is_default)
  where is_default = true;

create table if not exists locale_message_keys (
  message_key text primary key,
  namespace text not null,
  description text not null default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists locale_message_keys_namespace_idx
  on locale_message_keys (namespace, message_key);

create table if not exists locale_message_versions (
  id uuid primary key default gen_random_uuid(),
  locale text not null references locales(code) on delete restrict,
  message_key text not null references locale_message_keys(message_key) on delete restrict,
  value text not null default '',
  status text not null default 'draft',
  version integer not null default 1,
  change_note text not null default '',
  changed_by text not null default 'system',
  archived_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint locale_message_versions_status_chk
    check (status in ('draft', 'active', 'inactive', 'archived')),
  constraint locale_message_versions_uidx
    unique (locale, message_key, version)
);

create unique index if not exists locale_message_versions_one_active_uidx
  on locale_message_versions (locale, message_key)
  where status = 'active';

create unique index if not exists locale_message_versions_one_draft_uidx
  on locale_message_versions (locale, message_key)
  where status = 'draft';

create index if not exists locale_message_versions_locale_status_idx
  on locale_message_versions (locale, status, message_key);

create table if not exists locale_message_audit_logs (
  id uuid primary key default gen_random_uuid(),
  locale_message_version_id uuid references locale_message_versions(id) on delete restrict,
  locale text not null references locales(code) on delete restrict,
  message_key text not null references locale_message_keys(message_key) on delete restrict,
  action text not null,
  from_version integer,
  to_version integer,
  actor text not null default 'system',
  change_note text not null default '',
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  constraint locale_message_audit_action_chk
    check (action in ('create_draft', 'update_draft', 'activate', 'archive', 'rollback'))
);

create index if not exists locale_message_audit_logs_key_idx
  on locale_message_audit_logs (locale, message_key, created_at desc);

comment on table locales is 'Enabled UI languages and their active snapshot revisions.';
comment on table locale_message_keys is 'Framework-independent UI message key metadata.';
comment on table locale_message_versions is 'Versioned translated UI messages; promotional content is excluded.';
comment on table locale_message_audit_logs is 'Immutable locale message governance activity.';
