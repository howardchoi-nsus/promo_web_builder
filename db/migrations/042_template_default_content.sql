alter table wizard_form_template_layouts
  add column if not exists default_content jsonb not null default '{}'::jsonb;

alter table wizard_form_template_layout_histories
  add column if not exists previous_content jsonb;

alter table wizard_form_template_layout_histories
  add column if not exists new_content jsonb;

comment on column wizard_form_template_layouts.default_content is
  'Template-level default section inputs edited with the Admin layout editor.';
