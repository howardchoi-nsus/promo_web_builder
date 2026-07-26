-- Add semantic promotion typography sizes without coupling them to Admin UI
-- typography tokens. Existing default-token versions receive the new values so
-- Promotion Builder can use them immediately after deployment.

insert into promo_design_token_definitions (
  token_key, category, category_label, label, value_type, unit,
  semantic_role, css_property, css_properties, required, ai_selectable,
  themeable, cardinality, source_metadata
) values
  (
    '--promo-font-size-main-title', 'typography-size', '글자 크기', '메인 타이틀',
    'length', 'px', 'main-title-size', 'font-size', '["font-size"]'::jsonb,
    false, true, false, 'single', '{"source":"system-migration"}'::jsonb
  ),
  (
    '--promo-font-size-lead-title', 'typography-size', '글자 크기', '리드 타이틀',
    'length', 'px', 'lead-title-size', 'font-size', '["font-size"]'::jsonb,
    false, true, false, 'single', '{"source":"system-migration"}'::jsonb
  ),
  (
    '--promo-font-size-subtitle', 'typography-size', '글자 크기', '서브 타이틀',
    'length', 'px', 'subtitle-size', 'font-size', '["font-size"]'::jsonb,
    false, true, false, 'single', '{"source":"system-migration"}'::jsonb
  )
on conflict (token_key) do update set
  category = excluded.category,
  category_label = excluded.category_label,
  label = excluded.label,
  value_type = excluded.value_type,
  unit = excluded.unit,
  semantic_role = excluded.semantic_role,
  css_property = excluded.css_property,
  css_properties = excluded.css_properties,
  ai_selectable = excluded.ai_selectable;

insert into promo_design_token_values (
  token_set_version_id, token_key, value_index, token_value,
  value_light, value_dark, active_theme, metadata
)
select
  version.id,
  seed.token_key,
  0,
  seed.token_value,
  seed.token_value,
  seed.token_value,
  'dark',
  '{"source":"system-migration"}'::jsonb
from promo_design_token_set_versions version
join promo_design_token_sets token_set on token_set.id = version.token_set_id
cross join (values
  ('--promo-font-size-main-title', '68px'),
  ('--promo-font-size-lead-title', '40px'),
  ('--promo-font-size-subtitle', '23px')
) seed(token_key, token_value)
where token_set.is_default = true
  and version.status in ('active', 'draft')
on conflict (token_set_version_id, token_key, value_index) do update set
  token_value = excluded.token_value,
  value_light = excluded.value_light,
  value_dark = excluded.value_dark,
  active_theme = excluded.active_theme,
  metadata = excluded.metadata;
