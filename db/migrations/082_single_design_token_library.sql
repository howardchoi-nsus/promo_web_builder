-- One editable library. Existing sets/versions remain for historical snapshots.
alter table promo_design_token_definitions drop constraint if exists promo_design_token_key_chk;
alter table promo_design_token_definitions add constraint promo_design_token_key_chk
  check (token_key ~ '^--[a-z][a-z0-9-]*$');
alter table promo_design_token_definitions drop constraint if exists promo_design_token_definitions_value_type_check;
alter table promo_design_token_definitions add constraint promo_design_token_definitions_value_type_check
  check (value_type in ('color','length','dimension','number','font','fontFamily','fontWeight','typography','shadow','gradient','duration','easing','enum'));

insert into promo_design_token_sets (set_key, name, description, status)
values ('design-system', '공통 디자인 토큰', '단일 Dark 디자인 토큰 라이브러리', 'active')
on conflict (set_key) do nothing;

create or replace function publish_single_design_token_library(
  p_set_id uuid, p_expected_version uuid, p_tokens jsonb, p_note text
) returns uuid language plpgsql as $$
declare
  v_current uuid; v_next uuid; v_number integer; t jsonb;
begin
  perform pg_advisory_xact_lock(hashtext('single-design-token-library'));
  if not exists (select 1 from promo_design_token_sets where id=p_set_id and set_key='design-system') then
    raise exception 'Not the shared design token library';
  end if;
  if p_tokens is null or jsonb_typeof(p_tokens) <> 'array' or jsonb_array_length(p_tokens)=0 then
    raise exception 'Tokens are required';
  end if;
  select id into v_current from promo_design_token_set_versions
    where token_set_id=p_set_id and status='active' for update;
  if v_current is distinct from p_expected_version then
    raise exception 'Design token version changed. Reload before saving.';
  end if;
  select coalesce(max(version),0)+1 into v_number from promo_design_token_set_versions where token_set_id=p_set_id;
  insert into promo_design_token_set_versions(token_set_id,version,status,source_name,change_note)
    values(p_set_id,v_number,'draft','design-token-library',p_note) returning id into v_next;
  for t in select value from jsonb_array_elements(p_tokens) loop
    insert into promo_design_token_definitions(
      token_key,category,value_type,semantic_role,css_property,css_properties,
      label,category_label,required,ai_selectable,editable,themeable,cardinality
    ) values (
      t->>'name',t->>'category',t->>'type',coalesce(nullif(t->>'semanticRole',''),t->>'name'),t->'cssProperties'->>0,t->'cssProperties',
      t->>'name',t->>'category',false,
      (t->>'state'='active' and coalesce(t->>'semanticRole','')<>''),true,false,'single'
    ) on conflict(token_key) do update set
      category=excluded.category,category_label=excluded.category_label,
      value_type=excluded.value_type,semantic_role=excluded.semantic_role,css_property=excluded.css_property,css_properties=excluded.css_properties,
      required=false,ai_selectable=excluded.ai_selectable,editable=true;
    insert into promo_design_token_values(
      token_set_version_id,token_key,token_value,value_index,value_light,value_dark,active_theme,metadata
    ) values(v_next,t->>'name',coalesce(t->>'resolvedValue',''),0,'',coalesce(t->>'resolvedValue',''),'dark',
      jsonb_build_object('libraryToken',t-'resolvedValue'-'cssProperties','state',t->>'state'));
  end loop;
  update promo_design_token_set_versions set status='inactive',updated_at=now()
    where token_set_id=p_set_id and status='active';
  update promo_design_token_set_versions set status='active',updated_at=now() where id=v_next;
  update promo_design_token_sets set is_default=false where is_default and id<>p_set_id;
  update promo_design_token_sets set is_default=true where id=p_set_id;
  insert into promo_design_token_histories(token_set_id,token_set_version_id,action,new_status,change_note,snapshot)
    values(p_set_id,v_next,'activated','active',p_note,jsonb_build_object('version',v_number,'tokenCount',jsonb_array_length(p_tokens)));
  return v_next;
end;
$$;
