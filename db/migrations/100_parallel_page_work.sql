begin;
select pg_advisory_xact_lock(hashtext('migration:100_parallel_page_work'));
create table if not exists promo_page_work_units(
 id uuid primary key,document_id uuid not null references promo_builder_documents(id) on delete cascade,
 owner_subject text not null,run_id uuid not null,unit_key text not null,kind text not null check(kind in('region','design','media')),
 input_hash text not null,config_hash text not null,provider text not null,
 state text not null check(state in('pending','running','prepared','completed','failed','cancelled')),
 claim_token uuid not null,lease_expires_at timestamptz not null,attempts integer not null default 1,
 input_json jsonb not null,result_json jsonb,result_revision integer,error_code text,
 created_at timestamptz not null default now(),updated_at timestamptz not null default now(),
 unique(document_id,owner_subject,run_id,kind,unit_key)
);
create index if not exists promo_page_work_units_run_idx on promo_page_work_units(document_id,owner_subject,run_id,state);
create index if not exists promo_page_work_units_capacity_idx on promo_page_work_units(provider,lease_expires_at) where state='running';
create or replace function claim_promo_page_work_unit(p_id uuid,p_doc uuid,p_owner text,p_run uuid,p_key text,p_kind text,p_hash text,p_config text,p_provider text,p_input jsonb,p_limit integer default 2)
returns jsonb language plpgsql as $$
declare unit promo_page_work_units; claim uuid:=gen_random_uuid(); benchmark_active boolean;
begin
 perform pg_advisory_xact_lock(hashtext('promo_page_work_capacity'));

 if not exists(select 1 from promo_builder_documents where id=p_doc and owner_subject=p_owner) then raise exception 'WORK_DOCUMENT_NOT_FOUND'; end if;
 insert into promo_page_work_units(id,document_id,owner_subject,run_id,unit_key,kind,input_hash,config_hash,provider,state,claim_token,lease_expires_at,attempts,input_json)
 values(p_id,p_doc,p_owner,p_run,p_key,p_kind,p_hash,p_config,p_provider,'pending',claim,now(),0,p_input) on conflict(id) do nothing;
 select * into unit from promo_page_work_units where id=p_id;
 if found then
  if unit.owner_subject<>p_owner or unit.document_id<>p_doc or unit.run_id<>p_run or unit.input_hash<>p_hash then raise exception 'WORK_INPUT_CHANGED'; end if;
  if unit.state in('prepared','completed') then return to_jsonb(unit); end if;
  if unit.state='cancelled' then raise exception 'WORK_CANCELLED'; end if;
  if unit.state='running' and unit.lease_expires_at>now() then return jsonb_build_object('pending',true); end if;
  if unit.attempts>=3 then raise exception 'WORK_RETRY_LIMIT_REACHED'; end if;
 end if;
 if to_regclass('public.promo_prompt_benchmarks') is not null then execute 'select exists(select 1 from promo_prompt_benchmarks where status=''running'' and claim_token is not null and step_lease_expires_at>now())' into benchmark_active; if benchmark_active then return jsonb_build_object('pending',true); end if; end if;
 if exists(select 1 from promo_page_work_units where document_id=p_doc and owner_subject=p_owner and run_id=p_run and kind=p_kind and config_hash<>p_config and state<>'cancelled') then raise exception 'WORK_CONFIG_CHANGED'; end if;
 if exists(select 1 from promo_page_schema_generation_jobs where document_id=p_doc and status='running' and lease_expires_at>now()) then return jsonb_build_object('pending',true); end if;
 if (select count(*) from promo_page_work_units where document_id=p_doc and state='running' and lease_expires_at>now())>=least(2,greatest(1,p_limit))
 or (select count(*) from promo_page_work_units where provider=p_provider and state='running' and lease_expires_at>now())>=4
 or (select count(*) from promo_page_work_units where state='running' and lease_expires_at>now())>=8 then return jsonb_build_object('pending',true); end if;
 insert into promo_page_work_units(id,document_id,owner_subject,run_id,unit_key,kind,input_hash,config_hash,provider,state,claim_token,lease_expires_at,input_json)
 values(p_id,p_doc,p_owner,p_run,p_key,p_kind,p_hash,p_config,p_provider,'running',claim,now()+interval '10 minutes',p_input)
 on conflict(id) do update set state='running',claim_token=claim,lease_expires_at=now()+interval '10 minutes',attempts=promo_page_work_units.attempts+1,error_code=null,updated_at=now()
 returning * into unit;
 return to_jsonb(unit);
end $$;
-- Legacy exclusive jobs must not race the new unit workers.
create or replace function guard_exclusive_page_generation() returns trigger language plpgsql as $$
declare benchmark_active boolean;
begin
 if new.status='running' then
  perform pg_advisory_xact_lock(hashtext('promo_page_work_capacity'));
  if to_regclass('public.promo_prompt_benchmarks') is not null then execute 'select exists(select 1 from promo_prompt_benchmarks where status=''running'' and claim_token is not null and step_lease_expires_at>now())' into benchmark_active; if benchmark_active then raise exception 'Benchmark is running' using errcode='23505'; end if; end if;
  if exists(select 1 from promo_page_work_units where document_id=new.document_id and state='running' and lease_expires_at>now()) then raise exception 'Parallel page work is running' using errcode='23505'; end if;
 end if;
 return new;
end $$;
drop trigger if exists promo_page_exclusive_work_guard on promo_page_schema_generation_jobs;
create trigger promo_page_exclusive_work_guard before insert or update of status on promo_page_schema_generation_jobs for each row execute function guard_exclusive_page_generation();
create or replace function merge_promo_draft_unit(p_id uuid,p_owner text,p_sequence integer,p_state jsonb)
returns integer language plpgsql as $$
declare unit promo_page_work_units; draft promo_page_drafts; revision integer;
begin
 select * into unit from promo_page_work_units where id=p_id and owner_subject=p_owner for update;
 if not found then raise exception 'WORK_UNIT_UNKNOWN'; end if;
 if unit.state='completed' then return unit.result_revision; end if;
 if unit.state<>'prepared' then raise exception 'WORK_RESULT_REQUIRED'; end if;
 select * into draft from promo_page_drafts where id=unit.run_id and owner_subject=p_owner for update;
 if not found then raise exception 'WORK_UNIT_UNKNOWN'; end if;
 if draft.status<>'working' or draft.state->'plan'<>p_state->'plan' or draft.state->'context'<>p_state->'context' then raise exception 'WORK_INPUT_CHANGED'; end if;
 if draft.sequence<>p_sequence then raise exception 'WORK_MERGE_CONFLICT'; end if;
 select current_document_revision into revision from promo_builder_documents where id=unit.document_id and owner_subject=p_owner for update;
 if revision<>draft.base_revision then raise exception 'DOCUMENT_REVISION_MISMATCH'; end if;
 if draft.state->'requirements' is not null and draft.state->'requirements'<>'null'::jsonb then
  perform id from promo_builder_chat_sessions where document_id=unit.document_id and owner_subject=p_owner and latest_requirements_revision=(draft.state->'requirements'->>'revision')::integer for update;
  if not found then raise exception 'REQUIREMENTS_REVISION_MISMATCH'; end if;
 end if;
 update promo_page_drafts set state=p_state,sequence=sequence+1,updated_at=now() where id=draft.id returning sequence into revision;
 update promo_page_work_units set state='completed',result_revision=revision,updated_at=now() where id=unit.id;
 return revision;
end $$;
commit;
