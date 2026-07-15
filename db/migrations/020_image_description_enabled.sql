alter table wizard_content_section_items
  drop constraint if exists wizard_content_section_items_single_image_source_check;

alter table wizard_content_section_items
  add column if not exists image_description_enabled boolean not null default false;

create or replace function clone_wizard_content_section_draft(
  p_source_id uuid,
  p_change_note text default 'Draft created from existing section.'
) returns uuid
language plpgsql
as $$
declare
  v_source wizard_content_sections%rowtype;
  v_new_id uuid;
  v_next_version integer;
begin
  select * into v_source from wizard_content_sections where id = p_source_id for update;
  if not found then raise exception 'Source section not found'; end if;
  perform pg_advisory_xact_lock(hashtext(v_source.section_key));

  if exists (select 1 from wizard_content_sections where section_key = v_source.section_key and status = 'draft') then
    raise exception 'A draft already exists for this section';
  end if;

  select coalesce(max(version), 0) + 1 into v_next_version
  from wizard_content_sections where section_key = v_source.section_key;

  insert into wizard_content_sections (
    section_key, name, description, is_required, order_change_allowed,
    fixed_position, sort_order, is_visible_in_wizard, status, version,
    change_note, owner_form_template_id
  ) values (
    v_source.section_key, v_source.name, v_source.description, v_source.is_required,
    v_source.order_change_allowed, v_source.fixed_position, v_source.sort_order,
    v_source.is_visible_in_wizard, 'draft', v_next_version, p_change_note,
    v_source.owner_form_template_id
  ) returning id into v_new_id;

  insert into wizard_content_section_items (
    section_id, item_key, name, is_visible_in_wizard, is_required, user_reorder_allowed,
    sort_order, field_kind, text_type, image_allowed_sources, image_prompt_text,
    image_description_enabled, image_alt_text_required, image_aspect_ratio, image_max_size_kb,
    cta_utm_source, cta_utm_medium, cta_utm_campaign, cta_utm_content, cta_utm_term,
    is_locked, locked_value
  )
  select
    v_new_id, item_key, name, is_visible_in_wizard, is_required, user_reorder_allowed,
    sort_order, field_kind, text_type, image_allowed_sources, image_prompt_text,
    image_description_enabled, image_alt_text_required, image_aspect_ratio, image_max_size_kb,
    cta_utm_source, cta_utm_medium, cta_utm_campaign, cta_utm_content, cta_utm_term,
    is_locked, locked_value
  from wizard_content_section_items where section_id = p_source_id;

  insert into wizard_content_section_histories (
    section_key, section_id, previous_version, new_version,
    previous_status, new_status, change_note
  ) values (
    v_source.section_key, v_new_id, v_source.version, v_next_version,
    v_source.status, 'draft', p_change_note
  );
  return v_new_id;
end $$;
