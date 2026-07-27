begin;

alter table wizard_form_templates
  add column if not exists recommendation_profile jsonb not null default '{}'::jsonb;

comment on column wizard_form_templates.recommendation_profile is
  'Version-scoped template recommendation metadata used by the Create Promo planner.';

update wizard_form_templates
set recommendation_profile = jsonb_strip_nulls(jsonb_build_object(
  'promotionTypes', '[]'::jsonb,
  'markets', '[]'::jsonb,
  'audiences', '[]'::jsonb,
  'tones', '[]'::jsonb,
  'supportedComponentRoles', '[]'::jsonb,
  'requiredInputs', '[]'::jsonb,
  'requiredNotices', '[]'::jsonb,
  'tags', to_jsonb(array_remove(regexp_split_to_array(lower(coalesce(name, '') || ' ' || coalesce(description, '')), '[^[:alnum:]가-힣]+'), ''))
))
where recommendation_profile = '{}'::jsonb;

commit;
