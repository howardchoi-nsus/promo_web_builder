begin;

create or replace function apply_promo_builder_operations(
  p_document_id uuid,
  p_owner_subject text,
  p_base_document_revision integer,
  p_snapshot_json jsonb,
  p_snapshot_hash text,
  p_operations jsonb,
  p_change_note text
) returns integer
language plpgsql
as $$
declare
  v_document promo_builder_documents%rowtype;
  v_revision integer;
  v_contract_version integer;
begin
  select * into v_document from promo_builder_documents
  where id = p_document_id for update;
  if not found then raise exception 'Builder document not found'; end if;
  if v_document.owner_subject <> p_owner_subject then raise exception 'Builder document access denied'; end if;
  if v_document.current_document_revision <> p_base_document_revision then
    raise exception 'Builder document revision conflict';
  end if;
  if jsonb_typeof(p_operations) <> 'array' or jsonb_array_length(p_operations) = 0 then
    raise exception 'Builder document operations are required';
  end if;
  v_contract_version := coalesce(nullif(p_snapshot_json->>'contractVersion', '')::integer, 2);
  if v_contract_version not in (2, 3) then
    raise exception 'Unsupported Builder document contract version';
  end if;
  v_revision := p_base_document_revision + 1;
  insert into promo_builder_document_versions (
    document_id, revision, contract_version, snapshot_json,
    snapshot_hash, change_note, source
  ) values (
    p_document_id, v_revision, v_contract_version, p_snapshot_json,
    p_snapshot_hash, p_change_note, 'manual'
  );
  insert into promo_builder_document_operations (
    document_id, operation_id, base_document_revision, applied_revision,
    operation_type, target_instance_id, operation_json, source
  )
  select
    p_document_id,
    operation->>'operationId',
    p_base_document_revision,
    v_revision,
    operation->>'type',
    coalesce(operation->>'targetInstanceId', ''),
    operation,
    coalesce(nullif(operation->>'source', ''), 'ai')
  from jsonb_array_elements(p_operations) operation;
  update promo_builder_documents
  set current_document_revision = v_revision, status = 'ready', updated_at = now()
  where id = p_document_id;
  return v_revision;
end $$;

commit;
