begin;

create table if not exists promo_builder_publications (
  id uuid primary key default gen_random_uuid(),
  document_id uuid not null references promo_builder_documents(id) on delete cascade,
  document_revision integer not null check (document_revision > 0),
  slug text not null check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  locale text not null default 'ko-KR' check (locale ~ '^[a-z]{2,3}(-[A-Z]{2})?$'),
  status text not null default 'draft' check (status in ('draft', 'published', 'unpublished', 'archived')),
  seo_json jsonb not null default '{}'::jsonb,
  manifest_json jsonb not null default '{}'::jsonb,
  revalidate_seconds integer not null default 300 check (revalidate_seconds between 0 and 86400),
  published_at timestamptz,
  created_by text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (locale, slug),
  foreign key (document_id, document_revision)
    references promo_builder_document_versions(document_id, revision)
    on delete restrict
);

create index if not exists promo_builder_publications_document_idx
  on promo_builder_publications(document_id, updated_at desc);
create index if not exists promo_builder_publications_public_idx
  on promo_builder_publications(locale, slug)
  where status = 'published';

commit;
