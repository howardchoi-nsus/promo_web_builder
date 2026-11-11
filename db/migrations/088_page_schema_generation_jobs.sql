begin;
select pg_advisory_xact_lock(hashtext('migration:088_page_schema_generation_jobs'));
create table if not exists promo_page_schema_generation_jobs (
 document_id uuid not null references promo_builder_documents(id) on delete cascade,
 request_id uuid not null,
 owner_subject text not null,
 input_hash text not null,
 claim_token uuid not null,
 status text not null check(status in ('running','completed','failed')),
 result_revision integer,
 lease_expires_at timestamptz not null,
 error_code text,
 attempts integer not null default 1,
 created_at timestamptz not null default now(),
 updated_at timestamptz not null default now(),
 primary key(document_id,request_id)
);
create index if not exists promo_page_schema_generation_jobs_owner_idx on promo_page_schema_generation_jobs(owner_subject,updated_at desc);
create unique index if not exists promo_page_schema_generation_jobs_one_running_idx on promo_page_schema_generation_jobs(document_id) where status='running';
commit;
