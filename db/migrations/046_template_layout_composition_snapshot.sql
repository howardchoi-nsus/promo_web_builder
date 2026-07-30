alter table wizard_form_template_layouts
  add column if not exists composition_snapshot jsonb not null default '[]'::jsonb;

alter table wizard_form_template_layout_histories
  add column if not exists previous_composition jsonb,
  add column if not exists new_composition jsonb;

comment on column wizard_form_template_layouts.composition_snapshot is
  'Editor-authored Page > Section > Component structure for the template layout. Empty arrays retain legacy section membership rendering.';
