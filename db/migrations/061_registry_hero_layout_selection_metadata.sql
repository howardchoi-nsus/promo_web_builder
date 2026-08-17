begin;

-- Enrich administrator-owned Registry Hero Layout Presets with the semantic
-- description consumed by the AI planner. Descriptions are refreshed with the
-- enriched copy, while existing administrator selection-metadata values win
-- over these defaults so deliberate setting-page choices remain intact.
with registry_hero_layouts as (
  select
    layout.id,
    layout.layout_key,
    layout.name,
    lower(regexp_replace(layout.name, '[^a-zA-Z0-9]+', '', 'g')) as normalized_name
  from public.wizard_content_section_layouts layout
  join public.wizard_content_sections section on section.id = layout.section_id
  where section.section_key = 'registryHero'
    and section.status = 'active'
), metadata_defaults as (
  select *
  from (values
    (
      'hero_compact',
      '짧은 프로모션 제목, 한 문장의 설명, 기본 CTA를 전체 배경 이미지의 왼쪽에 배치하는 간결형 Hero입니다. 이미지 노출 영역을 넓게 유지해야 하는 짧은 카피에 사용합니다. Compact left-side Hero for concise copy; choose this preset when most artwork should remain unobstructed.',
      '{"alignment":"left","contentRegion":"center-left","visualBalance":"full-background","density":"compact","widthProfile":"compact","purposeTags":["hero","short-copy","offer","background-image"],"selectionWeight":0.9,"avoidImmediateRepeat":true}'::jsonb
    ),
    (
      'hero_left_balanced',
      '일반적인 프로모션 제목과 설명을 전체 배경 이미지의 왼쪽에 균형 있게 배치하는 표준형 Hero입니다. 간결형보다 넓은 텍스트 영역이 필요한 일반 혜택에 사용합니다. Balanced left-side Hero; choose this preset for standard offers that need moderate copy space.',
      '{"alignment":"left","contentRegion":"center-left","visualBalance":"full-background","density":"standard","widthProfile":"balanced","purposeTags":["hero","general","offer","background-image"],"selectionWeight":1,"avoidImmediateRepeat":true}'::jsonb
    ),
    (
      'hero_right_wide',
      '긴 제목과 설명을 넓게 사용하고 CTA를 오른쪽에 강조하는 확장형 Hero입니다. 카피가 길거나 이미지의 핵심 피사체를 피해 오른쪽에 행동 요소를 배치해야 할 때 사용합니다. Wide Hero with right-side action emphasis; choose this preset for long copy or right-focused actions.',
      '{"alignment":"right","contentRegion":"center-right","visualBalance":"full-background","density":"standard","widthProfile":"full","purposeTags":["hero","long-copy","right-cta","background-image"],"selectionWeight":1,"avoidImmediateRepeat":true}'::jsonb
    ),
    (
      'hero_center_wide',
      '긴 제목과 브랜드 메시지를 화면 중앙의 넓은 영역에 배치하는 확장형 Hero입니다. 헤드라인 자체가 핵심 비주얼이 되는 브랜드 소개나 메시지 중심 캠페인에 사용합니다. Wide centered Hero; choose this preset when the headline should be the primary visual focus.',
      '{"alignment":"center","contentRegion":"center","visualBalance":"full-background","density":"spacious","widthProfile":"full","purposeTags":["hero","long-headline","brand-intro","background-image"],"selectionWeight":1.1,"avoidImmediateRepeat":true}'::jsonb
    )
  ) defaults(profile_key, description, selection_metadata)
), classified as (
  select
    layout.id,
    case
      when layout.layout_key = 'hero_centered' then 'hero_compact'
      when layout.layout_key = 'hero_left_balanced' then 'hero_left_balanced'
      when layout.layout_key = 'hero_right_balanced'
        or layout.normalized_name in ('heroright', 'herorightbalanced') then 'hero_right_wide'
      when layout.layout_key = 'hero_center_wide'
        or layout.normalized_name in ('herocenter', 'herocenterwide') then 'hero_center_wide'
      else null
    end as profile_key
  from registry_hero_layouts layout
)
update public.wizard_content_section_layouts layout
set
  description = defaults.description,
  selection_metadata = defaults.selection_metadata || coalesce(layout.selection_metadata, '{}'::jsonb),
  change_note = 'Migration 061: Registry Hero Layout JSON selection description enriched.',
  updated_at = now()
from classified
join metadata_defaults defaults on defaults.profile_key = classified.profile_key
where layout.id = classified.id;

commit;
