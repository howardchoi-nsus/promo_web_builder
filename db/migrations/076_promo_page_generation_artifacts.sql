begin;

create table if not exists public.promo_page_generation_artifacts (
  artifact_key varchar(128) primary key,
  content_hash char(64) not null,
  page_html text not null,
  prompt_meta jsonb not null default '{}'::jsonb,
  quality_snapshot jsonb not null default '{}'::jsonb,
  expires_at timestamptz not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint promo_page_generation_artifacts_key_chk
    check (artifact_key ~ '^[A-Za-z0-9][A-Za-z0-9_-]{0,127}$'),
  constraint promo_page_generation_artifacts_hash_chk
    check (content_hash ~ '^[0-9a-f]{64}$'),
  constraint promo_page_generation_artifacts_html_size_chk
    check (octet_length(page_html) between 1 and 900000),
  constraint promo_page_generation_artifacts_prompt_meta_size_chk
    check (octet_length(prompt_meta::text) <= 65536),
  constraint promo_page_generation_artifacts_quality_size_chk
    check (octet_length(quality_snapshot::text) <= 262144)
);

create index if not exists promo_page_generation_artifacts_expiry_idx
  on public.promo_page_generation_artifacts (expires_at);

comment on table public.promo_page_generation_artifacts is
  'Validated text-first generated pages with bounded retention. Public reads require a signed view token.';

commit;
