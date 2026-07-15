-- Repair section links lost by the legacy template clone function.
update wizard_form_template_sections ts
set section_id = (
  select s.id
  from wizard_content_sections s
  where s.section_key = ts.section_key
  order by case s.status when 'draft' then 0 when 'active' then 1 else 2 end, s.version desc
  limit 1
)
where ts.section_id is null
  and exists (
    select 1 from wizard_content_sections s where s.section_key = ts.section_key
  );

create or replace function clone_wizard_form_template_draft(
  p_source_id uuid,
  p_change_note text default 'Draft created from existing form template.'
) returns uuid
language plpgsql
as $$
declare
  v_source wizard_form_templates%rowtype;
  v_new_id uuid;
  v_next_version integer;
begin
  select * into v_source from wizard_form_templates where id = p_source_id for update;
  if not found then raise exception 'Form template not found'; end if;

  perform pg_advisory_xact_lock(hashtext('wizard_form_template:' || v_source.template_key));
  if exists (
    select 1 from wizard_form_templates
    where template_key = v_source.template_key and status = 'draft'
  ) then
    raise exception 'A draft already exists for this form template';
  end if;

  select coalesce(max(version), 0) + 1 into v_next_version
  from wizard_form_templates where template_key = v_source.template_key;

  insert into wizard_form_templates (
    template_key, name, description, status, version, is_default, change_note
  ) values (
    v_source.template_key, v_source.name, v_source.description,
    'draft', v_next_version, v_source.is_default, p_change_note
  ) returning id into v_new_id;

  insert into wizard_form_template_sections (
    form_template_id, section_id, section_key, sort_order, is_required,
    is_visible, order_change_allowed, user_reorder_allowed, fixed_position
  )
  select
    v_new_id, section_id, section_key, sort_order, is_required,
    is_visible, order_change_allowed, user_reorder_allowed, fixed_position
  from wizard_form_template_sections
  where form_template_id = p_source_id;

  insert into wizard_form_template_histories (
    template_key, form_template_id, previous_version, new_version,
    previous_status, new_status, change_note
  ) values (
    v_source.template_key, v_new_id, v_source.version, v_next_version,
    v_source.status, 'draft', p_change_note
  );

  return v_new_id;
end $$;
