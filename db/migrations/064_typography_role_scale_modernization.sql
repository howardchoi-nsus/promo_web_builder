begin;

-- Add missing semantic promotion roles and move the default promotion type
-- ramp to responsive values. Existing Builder Documents remain pinned to
-- their snapshots; new compositions use these values from the active set.
insert into promo_design_token_definitions (
  token_key, category, category_label, label, value_type, unit,
  semantic_role, css_property, css_properties, required, ai_selectable,
  themeable, cardinality, source_metadata
) values
  ('--promo-font-size-body', 'typography-size', '글자 크기', '프로모션 본문',
    'length', 'rem', 'body-size', 'font-size', '["font-size"]'::jsonb,
    false, true, false, 'single', '{"source":"system-migration-064"}'::jsonb),
  ('--promo-font-size-caption', 'typography-size', '글자 크기', '프로모션 보조 문구',
    'length', 'rem', 'caption-size', 'font-size', '["font-size"]'::jsonb,
    false, true, false, 'single', '{"source":"system-migration-064"}'::jsonb),
  ('--promo-font-size-micro', 'typography-size', '글자 크기', '프로모션 진단 라벨',
    'length', 'rem', 'micro-size', 'font-size', '["font-size"]'::jsonb,
    false, false, false, 'single', '{"source":"system-migration-064"}'::jsonb),
  ('--promo-font-size-eyebrow', 'typography-size', '글자 크기', '프로모션 오버라인',
    'length', 'rem', 'eyebrow-size', 'font-size', '["font-size"]'::jsonb,
    false, true, false, 'single', '{"source":"system-migration-064"}'::jsonb),
  ('--promo-font-size-button', 'typography-size', '글자 크기', '프로모션 버튼',
    'length', 'rem', 'button-size', 'font-size', '["font-size"]'::jsonb,
    false, true, false, 'single', '{"source":"system-migration-064"}'::jsonb)
on conflict (token_key) do update set
  category = excluded.category,
  category_label = excluded.category_label,
  label = excluded.label,
  value_type = excluded.value_type,
  unit = excluded.unit,
  semantic_role = excluded.semantic_role,
  css_property = excluded.css_property,
  css_properties = excluded.css_properties,
  ai_selectable = excluded.ai_selectable,
  source_metadata = excluded.source_metadata;

insert into promo_design_token_values (
  token_set_version_id, token_key, value_index, token_value,
  value_light, value_dark, active_theme, metadata
)
select version.id, seed.token_key, 0, seed.token_value,
  seed.token_value, seed.token_value, 'dark',
  '{"source":"system-migration-064","responsive":true}'::jsonb
from promo_design_token_set_versions version
join promo_design_token_sets token_set on token_set.id = version.token_set_id
cross join (values
  ('--app-font-size-xs', '12px'),
  ('--app-font-size-control', '14px'),
  ('--promo-font-size-main-title', 'clamp(2.5rem, calc(2rem + 3vw), 4.25rem)'),
  ('--promo-font-size-lead-title', 'clamp(1.75rem, calc(1.5rem + 1.5vw), 2.5rem)'),
  ('--promo-font-size-subtitle', 'clamp(1.125rem, calc(1rem + 0.5vw), 1.4375rem)'),
  ('--promo-font-size-body', '1rem'),
  ('--promo-font-size-caption', '0.875rem'),
  ('--promo-font-size-micro', '0.625rem'),
  ('--promo-font-size-eyebrow', 'clamp(0.75rem, calc(0.7rem + 0.2vw), 0.875rem)'),
  ('--promo-font-size-button', 'clamp(0.875rem, calc(0.8rem + 0.2vw), 1rem)')
) seed(token_key, token_value)
where token_set.is_default = true
  and version.status in ('active', 'draft')
on conflict (token_set_version_id, token_key, value_index) do update set
  token_value = excluded.token_value,
  value_light = excluded.value_light,
  value_dark = excluded.value_dark,
  active_theme = excluded.active_theme,
  metadata = excluded.metadata;

commit;
