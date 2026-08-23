begin;

-- Keep the three system Hero alternatives available on every active Registry
-- Hero version. Existing administrator-authored geometry is never overwritten.
insert into public.wizard_content_section_layouts as existing (
  section_id, layout_key, name, description, is_default,
  layout_snapshot, selection_metadata, change_note
)
select section.id, seed.layout_key, seed.name, seed.description, false,
  seed.layout_snapshot::jsonb, seed.selection_metadata::jsonb,
  'Migration 063: active Registry Hero layout candidate synchronized.'
from public.wizard_content_sections section
cross join (values
  (
    'hero_left_balanced', 'Hero Left Balanced',
    'Balanced left-side Hero for standard offers with moderate copy space.',
    '{"contractVersion":1,"layoutMode":"free","sectionStyle":{"minHeight":620,"backgroundColorToken":"--app-bg"},"viewports":{"desktop":{"items":{"title":{"positionMode":"free","xPct":8,"yPx":86,"widthPct":58,"heightMode":"auto","zIndex":2},"description":{"positionMode":"free","xPct":8,"yPx":205,"widthPct":58,"heightMode":"auto","zIndex":2},"primaryAction":{"positionMode":"free","xPct":8,"yPx":350,"widthPct":24,"heightPx":54,"zIndex":2}},"visibility":{"items":{}}},"mobile":{"items":{"title":{"positionMode":"free","xPct":5,"yPx":40,"widthPct":90,"heightMode":"auto","zIndex":2},"description":{"positionMode":"free","xPct":5,"yPx":165,"widthPct":90,"heightMode":"auto","zIndex":2},"primaryAction":{"positionMode":"free","xPct":15,"yPx":320,"widthPct":70,"heightPx":54,"zIndex":2}},"visibility":{"items":{}}}}}',
    '{"alignment":"left","contentRegion":"center-left","visualBalance":"full-background","density":"standard","widthProfile":"balanced","archetype":"media-led","headlineCapacity":"medium","bodyCapacity":"medium","visualEmphasis":"balanced","mediaSafeSide":"left","mobileStrategy":"copy-first","ctaProminence":"high","contentComplexity":"medium","purposeTags":["hero","general","offer","background-image"],"selectionWeight":1,"avoidImmediateRepeat":true}'
  ),
  (
    'hero_center_wide', 'Hero Center Wide',
    'Wide centered Hero for long headlines and brand-led campaign messages.',
    '{"contractVersion":1,"layoutMode":"free","sectionStyle":{"minHeight":620,"backgroundColorToken":"--app-bg"},"viewports":{"desktop":{"items":{"title":{"positionMode":"free","xPct":12,"yPx":92,"widthPct":76,"heightMode":"auto","textAlign":"center","zIndex":2},"description":{"positionMode":"free","xPct":18,"yPx":215,"widthPct":64,"heightMode":"auto","textAlign":"center","zIndex":2},"primaryAction":{"positionMode":"free","xPct":38,"yPx":355,"widthPct":24,"heightPx":54,"zIndex":2}},"visibility":{"items":{}}},"mobile":{"items":{"title":{"positionMode":"free","xPct":5,"yPx":40,"widthPct":90,"heightMode":"auto","textAlign":"center","zIndex":2},"description":{"positionMode":"free","xPct":5,"yPx":165,"widthPct":90,"heightMode":"auto","textAlign":"center","zIndex":2},"primaryAction":{"positionMode":"free","xPct":15,"yPx":320,"widthPct":70,"heightPx":54,"zIndex":2}},"visibility":{"items":{}}}}}',
    '{"alignment":"center","contentRegion":"center","visualBalance":"full-background","density":"spacious","widthProfile":"wide","archetype":"full-bleed","headlineCapacity":"long","bodyCapacity":"medium","visualEmphasis":"copy-led","mediaSafeSide":"either","mobileStrategy":"stack","ctaProminence":"high","contentComplexity":"medium","purposeTags":["hero","brand-intro","long-headline","background-image"],"selectionWeight":1.1,"avoidImmediateRepeat":true}'
  ),
  (
    'hero_right_balanced', 'Hero Right Balanced',
    'Right-side Hero for long supporting copy or right-focused action emphasis.',
    '{"contractVersion":1,"layoutMode":"free","sectionStyle":{"minHeight":620,"backgroundColorToken":"--app-bg"},"viewports":{"desktop":{"items":{"title":{"positionMode":"free","xPct":42,"yPx":86,"widthPct":50,"heightMode":"auto","textAlign":"right","zIndex":2},"description":{"positionMode":"free","xPct":42,"yPx":205,"widthPct":50,"heightMode":"auto","textAlign":"right","zIndex":2},"primaryAction":{"positionMode":"free","xPct":68,"yPx":350,"widthPct":24,"heightPx":54,"zIndex":2}},"visibility":{"items":{}}},"mobile":{"items":{"title":{"positionMode":"free","xPct":5,"yPx":40,"widthPct":90,"heightMode":"auto","textAlign":"right","zIndex":2},"description":{"positionMode":"free","xPct":5,"yPx":165,"widthPct":90,"heightMode":"auto","textAlign":"right","zIndex":2},"primaryAction":{"positionMode":"free","xPct":15,"yPx":320,"widthPct":70,"heightPx":54,"zIndex":2}},"visibility":{"items":{}}}}}',
    '{"alignment":"right","contentRegion":"center-right","visualBalance":"full-background","density":"standard","widthProfile":"balanced","archetype":"media-led","headlineCapacity":"medium","bodyCapacity":"long","visualEmphasis":"balanced","mediaSafeSide":"right","mobileStrategy":"media-after-copy","ctaProminence":"high","contentComplexity":"high","purposeTags":["hero","long-copy","right-cta","background-image"],"selectionWeight":1,"avoidImmediateRepeat":true}'
  )
) as seed(layout_key, name, description, layout_snapshot, selection_metadata)
where section.section_key = 'registryHero'
  and section.status = 'active'
  and section.composition_scope in ('registry', 'shared')
on conflict (section_id, layout_key) do update
set
  description = case
    when coalesce(existing.description, '') = '' then excluded.description
    else existing.description
  end,
  selection_metadata = excluded.selection_metadata || coalesce(existing.selection_metadata, '{}'::jsonb),
  layout_snapshot = coalesce(existing.layout_snapshot, excluded.layout_snapshot),
  updated_at = now();

-- The known system alternatives are explicit AI candidates. Preserve unrelated
-- administrator choices and do not change layoutLocked.
update public.wizard_content_sections section
set
  ai_design = jsonb_set(
    coalesce(section.ai_design, '{}'::jsonb),
    '{allowedLayoutVariants}',
    (
      select jsonb_agg(layout_key order by layout_key)
      from (
        select distinct layout_key
        from (
          select jsonb_array_elements_text(
            case when jsonb_typeof(section.ai_design->'allowedLayoutVariants') = 'array'
              then section.ai_design->'allowedLayoutVariants' else '[]'::jsonb end
          ) as layout_key
          union all select 'hero_left_balanced'
          union all select 'hero_center_wide'
          union all select 'hero_right_balanced'
        ) allowed
      ) normalized
    ),
    true
  ),
  composition_policy = jsonb_set(
    coalesce(section.composition_policy, '{}'::jsonb),
    '{allowedLayoutVariants}',
    (
      select jsonb_agg(layout_key order by layout_key)
      from (
        select distinct layout_key
        from (
          select jsonb_array_elements_text(
            case when jsonb_typeof(section.composition_policy->'allowedLayoutVariants') = 'array'
              then section.composition_policy->'allowedLayoutVariants' else '[]'::jsonb end
          ) as layout_key
          union all select 'hero_left_balanced'
          union all select 'hero_center_wide'
          union all select 'hero_right_balanced'
        ) allowed
      ) normalized
    ),
    true
  ),
  change_note = 'Migration 063: active Registry Hero AI layout candidates synchronized.',
  updated_at = now()
where section.section_key = 'registryHero'
  and section.status = 'active'
  and section.composition_scope in ('registry', 'shared');

commit;
