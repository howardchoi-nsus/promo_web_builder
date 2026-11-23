begin;
select pg_advisory_xact_lock(hashtext('migration:101_generation_reuse_benchmarks'));
create table if not exists promo_overview_generations(
 task_id uuid not null,owner_subject text not null,input_hash text not null,status text not null check(status in('running','completed','failed')),
 claim_token uuid not null,lease_expires_at timestamptz not null,attempts integer not null default 1,result_json jsonb,error_code text,
 created_at timestamptz not null default now(),updated_at timestamptz not null default now(),primary key(task_id,owner_subject)
);
create table if not exists promo_prompt_benchmarks(
 id uuid primary key,owner_subject text not null,prompt_type text not null,baseline_id uuid not null,candidate_id uuid not null,
 input_hash text not null,case_json jsonb not null,claim_token uuid,step_lease_expires_at timestamptz,status text not null check(status in('running','completed','failed')),results_json jsonb not null default '[]',
 lease_expires_at timestamptz not null,error_code text,created_at timestamptz not null default now(),updated_at timestamptz not null default now()
);
create index if not exists promo_prompt_benchmarks_owner_idx on promo_prompt_benchmarks(owner_subject,created_at desc);
create or replace function claim_promo_benchmark_step(p_id uuid,p_owner text,p_claim uuid)
returns boolean language plpgsql as $$
declare active boolean;
begin
 perform pg_advisory_xact_lock(hashtext('promo_page_work_capacity'));
 if to_regclass('public.promo_page_work_units') is not null then
  execute 'select exists(select 1 from promo_page_work_units where state=''running'' and lease_expires_at>now())' into active;
  if active then return false; end if;
 end if;
 if exists(select 1 from promo_page_schema_generation_jobs where status='running' and lease_expires_at>now()) then return false; end if;
 if exists(select 1 from promo_prompt_benchmarks where claim_token is not null and step_lease_expires_at>now() and status='running') then return false; end if;
 update promo_prompt_benchmarks set claim_token=p_claim,step_lease_expires_at=now()+interval '10 minutes' where id=p_id and owner_subject=p_owner and status='running' and (claim_token is null or step_lease_expires_at<now());
 return found;
end $$;

commit;
