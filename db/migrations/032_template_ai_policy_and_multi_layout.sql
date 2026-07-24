begin;

alter table wizard_form_template_sections
  add column if not exists ai_design jsonb;

update wizard_form_template_sections membership
set ai_design = source.ai_design
from wizard_content_sections source
where membership.ai_design is null
  and (
    source.id = membership.section_id
    or (
      membership.section_id is null
      and source.section_key = membership.section_key
      and source.status = 'active'
    )
  );

comment on column wizard_form_template_sections.ai_design is
  'Template-version-specific AI policy override copied from the source section and editable while the template is a draft.';

commit;
