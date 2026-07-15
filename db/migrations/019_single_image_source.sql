update wizard_content_section_items
set image_allowed_sources = case
  when jsonb_typeof(image_allowed_sources) = 'array'
    and jsonb_array_length(image_allowed_sources) > 0
    and image_allowed_sources ->> 0 in ('url', 'file', 'ai')
    then jsonb_build_array(image_allowed_sources ->> 0)
  else '["url"]'::jsonb
end,
updated_at = now()
where field_kind = 'image'
  and (
    jsonb_typeof(image_allowed_sources) <> 'array'
    or jsonb_array_length(image_allowed_sources) <> 1
    or image_allowed_sources ->> 0 not in ('url', 'file', 'ai')
  );

do $$
begin
  if not exists (
    select 1 from pg_constraint
    where conname = 'wizard_content_section_items_single_image_source_check'
  ) then
    alter table wizard_content_section_items
      add constraint wizard_content_section_items_single_image_source_check
      check (
        field_kind <> 'image'
        or (
          jsonb_typeof(image_allowed_sources) = 'array'
          and jsonb_array_length(image_allowed_sources) = 1
          and image_allowed_sources ->> 0 in ('url', 'file', 'ai')
        )
      );
  end if;
end $$;
