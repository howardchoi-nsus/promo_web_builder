-- Additive operation audit log; no prompt/model activation or historical backfill.
begin;
select pg_advisory_xact_lock(hashtext('migration:099_admin_work_logs'));
create table if not exists promo_work_logs (
 id uuid primary key,
 sequence bigserial unique not null,
 created_at timestamptz not null default clock_timestamp(),
 task_id uuid not null,
 request_id uuid not null,
 document_id uuid,
 session_id uuid,
 stage text not null,
 operation text not null,
 event text not null check(event in ('request_started','request_finished','model_started','model_finished','checkpoint','client_error')),
 status text not null check(status in ('running','succeeded','failed','pending','cancelled')),
 duration_ms integer,
 http_status integer,
 error_code text,
 message text not null default '',
 metadata jsonb not null default '{}'::jsonb
);
create index if not exists promo_work_logs_created_idx on promo_work_logs(sequence desc);
create index if not exists promo_work_logs_task_idx on promo_work_logs(task_id,sequence desc);
create index if not exists promo_work_logs_document_idx on promo_work_logs(document_id,sequence desc);
create index if not exists promo_work_logs_failed_idx on promo_work_logs(sequence desc) where status='failed';
create index if not exists promo_work_logs_request_idx on promo_work_logs(request_id,event,sequence);
create index if not exists promo_work_logs_session_idx on promo_work_logs(session_id,sequence desc);
commit;
