begin;

-- Expand the v3 Registry from its initial vertical slice into a reusable
-- promotional page vocabulary. All additions are idempotent and preserve
-- administrator-authored Layout snapshots on conflict.

alter table public.wizard_content_sections
  drop constraint if exists wizard_content_sections_section_role_chk;
alter table public.wizard_content_sections
  add constraint wizard_content_sections_section_role_chk
  check (section_role in (
    'header', 'footer', 'terms', 'legal', 'responsible-gaming',
    'hero', 'benefit', 'content', 'cta', 'notice', 'offer', 'trust'
  ));

insert into public.wizard_item_components (
  system_seed_code, name, description, status, library_presentation
) values (
  'registry-stat-card', 'Registry Statistic Card',
  'Repeatable proof point with a value, label, and supporting detail.', 'active',
  '{"category":"content","iconKey":"chart-simple","keywords":["stat","metric","proof","trust"],"displayOrder":40,"isFeatured":true}'::jsonb
)
on conflict (system_seed_code) do update set
  name = excluded.name,
  description = excluded.description,
  status = 'active',
  library_presentation = excluded.library_presentation,
  updated_at = now();

insert into public.wizard_item_component_versions (
  component_id, version, status, field_kind, text_type, editor_schema,
  default_value, capabilities, image_policy, cta_policy, style_slots,
  placement_policy, change_note
)
select component.id, 1, 'active', 'text', 'multi',
  '{"description":"Statistic value, label, and supporting detail."}'::jsonb,
  '{"fields":{"value":"24%","label":"핵심 성과","detail":"프로모션의 주요 수치를 확인하세요."}}'::jsonb,
  '{"collection":{"enabled":true,"minItems":2,"maxItems":4,"layout":"grid","desktopColumns":3,"mobileColumns":1,"gapPct":2,"gapPx":16},"layoutRegions":["proof-grid"]}'::jsonb,
  '{}'::jsonb, '{}'::jsonb,
  '[{"slotKey":"cardSurface","semanticRole":"surface-color","aiSelectable":true},{"slotKey":"cardRadius","semanticRole":"radius","aiSelectable":true},{"slotKey":"cardShadow","semanticRole":"shadow","aiSelectable":true}]'::jsonb,
  '{"allowedSectionRoles":["trust"],"minInstances":2,"maxInstances":4,"desktop":{"widthPct":84,"heightPx":220},"mobile":{"widthPct":90,"heightPx":210}}'::jsonb,
  'Migration 065: Registry section library expansion.'
from public.wizard_item_components component
where component.system_seed_code = 'registry-stat-card'
  and not exists (
    select 1 from public.wizard_item_component_versions version
    where version.component_id = component.id and version.version = 1
  );

insert into public.wizard_item_component_version_fields (
  component_version_id, field_key, name, field_kind, text_type, sort_order,
  is_required, is_locked, default_value, editor_schema, capabilities,
  image_policy, cta_policy, style_slots
)
select version.id, seed.field_key, seed.name, 'text', seed.text_type,
  seed.sort_order, true, false, to_jsonb(seed.default_value),
  seed.editor_schema::jsonb, '{"copy":true}'::jsonb, '{}'::jsonb, '{}'::jsonb,
  seed.style_slots::jsonb
from (values
  ('fld_30000000000000000000000000000001','Value','title',0,'24%',
    '{"multiline":false,"maxLength":32}',
    '[{"slotKey":"valueColor","semanticRole":"accent-color","aiSelectable":true},{"slotKey":"valueSize","semanticRole":"title-size","aiSelectable":true}]'),
  ('fld_30000000000000000000000000000002','Label','remark',10,'핵심 성과',
    '{"multiline":false,"maxLength":80}',
    '[{"slotKey":"labelColor","semanticRole":"text-color","aiSelectable":true}]'),
  ('fld_30000000000000000000000000000003','Detail','multi',20,'프로모션의 주요 수치를 확인하세요.',
    '{"multiline":true,"maxLength":240}',
    '[{"slotKey":"detailColor","semanticRole":"muted-color","aiSelectable":true}]')
) as seed(field_key, name, text_type, sort_order, default_value, editor_schema, style_slots)
join public.wizard_item_components component
  on component.system_seed_code = 'registry-stat-card'
join public.wizard_item_component_versions version
  on version.component_id = component.id and version.version = 1
on conflict (component_version_id, field_key) do nothing;

insert into public.wizard_content_sections (
  section_key, name, description, is_required, order_change_allowed,
  fixed_position, sort_order, is_visible_in_wizard, status, version,
  change_note, owner_form_template_id, ai_design, composition_scope,
  section_role, composition_policy
)
select seed.section_key, seed.name, seed.description, false, true, null,
  seed.sort_order, true, 'active', 1,
  'Migration 065: Registry section library expansion.', null,
  seed.ai_design::jsonb, 'registry', seed.section_role,
  seed.composition_policy::jsonb
from (values
  (
    'registryOfferSpotlight', 'Registry Offer Spotlight',
    'Focused offer explanation with supporting copy and a primary action.', 20, 'offer',
    '{"enabled":true,"allowedLayoutVariants":["offer_left","offer_center"],"allowSectionBackground":false,"imageTarget":"item","imageTargetItemKeys":[]}',
    '{"selectionPolicy":"optional","allowedMarkets":[],"allowedPromotionPurposes":[],"aiEditable":true,"contentLocked":false,"layoutLocked":false,"duplicatePolicy":"forbidden","maxInstances":1,"allowedLayoutVariants":["offer_left","offer_center"],"allowedMotionPresets":[]}'
  ),
  (
    'registryBrandStory', 'Registry Brand Story',
    'Editorial split section for product, brand, or campaign storytelling.', 40, 'content',
    '{"enabled":true,"allowedLayoutVariants":["story_media_left","story_media_right"],"allowSectionBackground":false,"imageTarget":"item","imageTargetItemKeys":["visual"],"imageAspectRatio":"4:3"}',
    '{"selectionPolicy":"optional","allowedMarkets":[],"allowedPromotionPurposes":[],"aiEditable":true,"contentLocked":false,"layoutLocked":false,"duplicatePolicy":"forbidden","maxInstances":2,"allowedLayoutVariants":["story_media_left","story_media_right"],"allowedMotionPresets":[]}'
  ),
  (
    'registrySocialProof', 'Registry Social Proof',
    'Evidence section with repeatable metrics and proof points.', 50, 'trust',
    '{"enabled":true,"allowedLayoutVariants":["stats_grid","stats_band"],"allowSectionBackground":false,"imageTarget":"item","imageTargetItemKeys":[]}',
    '{"selectionPolicy":"optional","allowedMarkets":[],"allowedPromotionPurposes":[],"aiEditable":true,"contentLocked":false,"layoutLocked":false,"duplicatePolicy":"forbidden","maxInstances":1,"allowedLayoutVariants":["stats_grid","stats_band"],"allowedMotionPresets":[]}'
  )
) as seed(section_key, name, description, sort_order, section_role, ai_design, composition_policy)
where not exists (
  select 1 from public.wizard_content_sections section
  where section.section_key = seed.section_key and section.version = 1
);

insert into public.wizard_content_section_component_instances (
  section_id, component_version_id, item_key, display_name,
  is_visible_in_wizard, is_required, user_reorder_allowed,
  sort_order, is_locked, locked_value, instance_config
)
select section.id, version.id, seed.item_key, seed.display_name,
  true, seed.is_required, true, seed.sort_order, false, null,
  seed.instance_config::jsonb
from (values
  ('registryOfferSpotlight','remark-text','eyebrow','Eyebrow',false,0,'{"description":"Short offer context."}'),
  ('registryOfferSpotlight','hero-title','title','Title',true,10,'{"description":"Offer headline."}'),
  ('registryOfferSpotlight','body-text','description','Description',true,20,'{"description":"Offer explanation."}'),
  ('registryOfferSpotlight','primary-cta','primaryAction','Primary Action',false,30,'{"description":"Offer action."}'),
  ('registryBrandStory','hero-title','title','Title',true,10,'{"description":"Story headline."}'),
  ('registryBrandStory','body-text','description','Description',true,20,'{"description":"Story body."}'),
  ('registryBrandStory','content-image','visual','Visual',true,30,'{"description":"Story visual.","assetRole":"story-visual","assetPromptText":"Create a distinctive editorial campaign image that directly represents this section narrative."}'),
  ('registrySocialProof','hero-title','title','Title',true,10,'{"description":"Proof headline."}'),
  ('registrySocialProof','registry-stat-card','stats','Statistics',true,20,'{"description":"Repeatable evidence cards.","collection":{"enabled":true,"minItems":2,"maxItems":4,"layout":"grid","desktopColumns":3,"mobileColumns":1,"gapPct":2,"gapPx":16}}')
) as seed(section_key, system_seed_code, item_key, display_name, is_required, sort_order, instance_config)
join public.wizard_content_sections section
  on section.section_key = seed.section_key and section.version = 1 and section.status = 'active'
join public.wizard_item_components component
  on component.system_seed_code = seed.system_seed_code
join lateral (
  select active_version.id
  from public.wizard_item_component_versions active_version
  where active_version.component_id = component.id and active_version.status = 'active'
  order by active_version.version desc limit 1
) version on true
on conflict (section_id, item_key) do nothing;

insert into public.wizard_content_section_layouts as existing (
  section_id, layout_key, name, description, is_default,
  layout_snapshot, selection_metadata, change_note
)
select section.id, seed.layout_key, seed.name, seed.description,
  seed.is_default, seed.layout_snapshot::jsonb, seed.selection_metadata::jsonb,
  'Migration 065: Registry section library expansion.'
from public.wizard_content_sections section
join (values
  ('registryOfferSpotlight','offer_left','Offer Left','Left-aligned focused offer.',true,
    '{"contractVersion":1,"layoutMode":"free","sectionStyle":{"minHeight":520},"viewports":{"desktop":{"items":{"eyebrow":{"positionMode":"free","xPct":8,"yPx":70,"widthPct":50,"heightMode":"auto"},"title":{"positionMode":"free","xPct":8,"yPx":118,"widthPct":62,"heightMode":"auto"},"description":{"positionMode":"free","xPct":8,"yPx":245,"widthPct":58,"heightMode":"auto"},"primaryAction":{"positionMode":"free","xPct":8,"yPx":380,"widthPct":24,"heightPx":54}}},"mobile":{"items":{"eyebrow":{"positionMode":"free","xPct":5,"yPx":45,"widthPct":90,"heightMode":"auto"},"title":{"positionMode":"free","xPct":5,"yPx":90,"widthPct":90,"heightMode":"auto"},"description":{"positionMode":"free","xPct":5,"yPx":220,"widthPct":90,"heightMode":"auto"},"primaryAction":{"positionMode":"free","xPct":15,"yPx":375,"widthPct":70,"heightPx":54}}}}}',
    '{"alignment":"left","density":"standard","widthProfile":"balanced","archetype":"copy-led","headlineCapacity":"medium","bodyCapacity":"long","ctaProminence":"high","contentComplexity":"high","purposeTags":["offer","conversion","long-copy"]}'),
  ('registryOfferSpotlight','offer_center','Offer Center','Centered concise offer.',false,
    '{"contractVersion":1,"layoutMode":"free","sectionStyle":{"minHeight":480},"viewports":{"desktop":{"items":{"eyebrow":{"positionMode":"free","xPct":25,"yPx":62,"widthPct":50,"heightMode":"auto","textAlign":"center"},"title":{"positionMode":"free","xPct":16,"yPx":110,"widthPct":68,"heightMode":"auto","textAlign":"center"},"description":{"positionMode":"free","xPct":22,"yPx":230,"widthPct":56,"heightMode":"auto","textAlign":"center"},"primaryAction":{"positionMode":"free","xPct":38,"yPx":355,"widthPct":24,"heightPx":54}}},"mobile":{"items":{"eyebrow":{"positionMode":"free","xPct":5,"yPx":45,"widthPct":90,"heightMode":"auto","textAlign":"center"},"title":{"positionMode":"free","xPct":5,"yPx":90,"widthPct":90,"heightMode":"auto","textAlign":"center"},"description":{"positionMode":"free","xPct":5,"yPx":220,"widthPct":90,"heightMode":"auto","textAlign":"center"},"primaryAction":{"positionMode":"free","xPct":15,"yPx":365,"widthPct":70,"heightPx":54}}}}}',
    '{"alignment":"center","density":"spacious","widthProfile":"wide","archetype":"copy-led","headlineCapacity":"long","bodyCapacity":"medium","ctaProminence":"high","contentComplexity":"medium","purposeTags":["offer","conversion","brand-intro"]}'),
  ('registryBrandStory','story_media_left','Story Media Left','Editorial image left and narrative right.',true,
    '{"contractVersion":1,"layoutMode":"free","sectionStyle":{"minHeight":600},"viewports":{"desktop":{"items":{"visual":{"positionMode":"free","xPct":6,"yPx":70,"widthPct":43,"heightPx":460},"title":{"positionMode":"free","xPct":55,"yPx":105,"widthPct":38,"heightMode":"auto"},"description":{"positionMode":"free","xPct":55,"yPx":235,"widthPct":38,"heightMode":"auto"}}},"mobile":{"items":{"title":{"positionMode":"free","xPct":5,"yPx":40,"widthPct":90,"heightMode":"auto"},"description":{"positionMode":"free","xPct":5,"yPx":165,"widthPct":90,"heightMode":"auto"},"visual":{"positionMode":"free","xPct":5,"yPx":350,"widthPct":90,"heightPx":320}}}}}',
    '{"alignment":"left","density":"spacious","widthProfile":"balanced","archetype":"media-led","headlineCapacity":"medium","bodyCapacity":"long","visualEmphasis":"high","mediaSafeSide":"left","mobileStrategy":"media-after-copy","contentComplexity":"high","purposeTags":["story","product","editorial"]}'),
  ('registryBrandStory','story_media_right','Story Media Right','Narrative left and editorial image right.',false,
    '{"contractVersion":1,"layoutMode":"free","sectionStyle":{"minHeight":600},"viewports":{"desktop":{"items":{"title":{"positionMode":"free","xPct":7,"yPx":105,"widthPct":38,"heightMode":"auto"},"description":{"positionMode":"free","xPct":7,"yPx":235,"widthPct":38,"heightMode":"auto"},"visual":{"positionMode":"free","xPct":51,"yPx":70,"widthPct":43,"heightPx":460}}},"mobile":{"items":{"title":{"positionMode":"free","xPct":5,"yPx":40,"widthPct":90,"heightMode":"auto"},"description":{"positionMode":"free","xPct":5,"yPx":165,"widthPct":90,"heightMode":"auto"},"visual":{"positionMode":"free","xPct":5,"yPx":350,"widthPct":90,"heightPx":320}}}}}',
    '{"alignment":"left","density":"spacious","widthProfile":"balanced","archetype":"media-led","headlineCapacity":"medium","bodyCapacity":"long","visualEmphasis":"high","mediaSafeSide":"right","mobileStrategy":"media-after-copy","contentComplexity":"high","purposeTags":["story","product","editorial"]}'),
  ('registrySocialProof','stats_grid','Statistics Grid','Three-column evidence grid.',true,
    '{"contractVersion":1,"layoutMode":"free","sectionStyle":{"minHeight":520},"collectionLayouts":{"stats":{"desktopColumns":3,"mobileColumns":1,"gapPct":2,"gapPx":16}},"viewports":{"desktop":{"items":{"title":{"positionMode":"free","xPct":12,"yPx":60,"widthPct":76,"heightMode":"auto","textAlign":"center"},"stats":{"positionMode":"free","xPct":8,"yPx":190,"widthPct":84,"heightPx":220}}},"mobile":{"items":{"title":{"positionMode":"free","xPct":5,"yPx":40,"widthPct":90,"heightMode":"auto","textAlign":"center"},"stats":{"positionMode":"free","xPct":5,"yPx":165,"widthPct":90,"heightPx":210}}}}}',
    '{"alignment":"center","density":"standard","widthProfile":"wide","archetype":"proof-grid","headlineCapacity":"medium","bodyCapacity":"short","contentComplexity":"medium","purposeTags":["trust","proof","metrics"]}'),
  ('registrySocialProof','stats_band','Statistics Band','Four-column compact proof band.',false,
    '{"contractVersion":1,"layoutMode":"free","sectionStyle":{"minHeight":430},"collectionLayouts":{"stats":{"desktopColumns":4,"mobileColumns":2,"gapPct":1.5,"gapPx":14}},"viewports":{"desktop":{"items":{"title":{"positionMode":"free","xPct":10,"yPx":55,"widthPct":80,"heightMode":"auto","textAlign":"center"},"stats":{"positionMode":"free","xPct":6,"yPx":170,"widthPct":88,"heightPx":190}}},"mobile":{"items":{"title":{"positionMode":"free","xPct":5,"yPx":40,"widthPct":90,"heightMode":"auto","textAlign":"center"},"stats":{"positionMode":"free","xPct":5,"yPx":165,"widthPct":90,"heightPx":190}}}}}',
    '{"alignment":"center","density":"compact","widthProfile":"full","archetype":"proof-band","headlineCapacity":"short","bodyCapacity":"short","contentComplexity":"high","purposeTags":["trust","proof","metrics"]}')
) as seed(section_key, layout_key, name, description, is_default, layout_snapshot, selection_metadata)
  on section.section_key = seed.section_key and section.version = 1 and section.status = 'active'
on conflict (section_id, layout_key) do update set
  description = case when coalesce(existing.description, '') = '' then excluded.description else existing.description end,
  selection_metadata = excluded.selection_metadata || coalesce(existing.selection_metadata, '{}'::jsonb),
  updated_at = now();

-- Add layout-level collection alternatives to the existing benefit section.
insert into public.wizard_content_section_layouts as existing (
  section_id, layout_key, name, description, is_default,
  layout_snapshot, selection_metadata, change_note
)
select section.id, seed.layout_key, seed.name, seed.description, false,
  seed.layout_snapshot::jsonb, seed.selection_metadata::jsonb,
  'Migration 065: Card Grid layout alternatives.'
from public.wizard_content_sections section
cross join (values
  ('card_grid_2','Two Card Grid','Spacious two-column benefit cards.',
    '{"contractVersion":1,"layoutMode":"free","sectionStyle":{"minHeight":560},"collectionLayouts":{"cards":{"desktopColumns":2,"mobileColumns":1,"gapPct":3,"gapPx":18}},"viewports":{"desktop":{"items":{"cards":{"positionMode":"free","xPct":10,"yPx":70,"widthPct":80,"heightPx":390}}},"mobile":{"items":{"cards":{"positionMode":"free","xPct":5,"yPx":40,"widthPct":90,"heightPx":350}}}}}',
    '{"alignment":"center","density":"spacious","widthProfile":"wide","archetype":"card-grid","headlineCapacity":"auto","bodyCapacity":"medium","visualEmphasis":"balanced","contentComplexity":"low","purposeTags":["benefit","comparison","two-up"]}'),
  ('card_grid_compact','Compact Card Grid','Compact four-column benefit cards.',
    '{"contractVersion":1,"layoutMode":"free","sectionStyle":{"minHeight":480},"collectionLayouts":{"cards":{"desktopColumns":4,"mobileColumns":2,"gapPct":1.5,"gapPx":14}},"viewports":{"desktop":{"items":{"cards":{"positionMode":"free","xPct":6,"yPx":60,"widthPct":88,"heightPx":320}}},"mobile":{"items":{"cards":{"positionMode":"free","xPct":5,"yPx":40,"widthPct":90,"heightPx":310}}}}}',
    '{"alignment":"center","density":"compact","widthProfile":"full","archetype":"card-grid","headlineCapacity":"auto","bodyCapacity":"short","visualEmphasis":"high","contentComplexity":"high","purposeTags":["benefit","catalog","four-up"]}')
) as seed(layout_key, name, description, layout_snapshot, selection_metadata)
where section.section_key = 'registryCardGrid' and section.status = 'active'
on conflict (section_id, layout_key) do update set
  description = case when coalesce(existing.description, '') = '' then excluded.description else existing.description end,
  selection_metadata = excluded.selection_metadata || coalesce(existing.selection_metadata, '{}'::jsonb),
  updated_at = now();

update public.wizard_content_sections section
set ai_design = jsonb_set(coalesce(section.ai_design, '{}'::jsonb),
      '{allowedLayoutVariants}', '["card_grid_2","card_grid_3","card_grid_compact"]'::jsonb, true),
    composition_policy = jsonb_set(coalesce(section.composition_policy, '{}'::jsonb),
      '{allowedLayoutVariants}', '["card_grid_2","card_grid_3","card_grid_compact"]'::jsonb, true),
    change_note = 'Migration 065: Card Grid layout alternatives enabled.',
    updated_at = now()
where section.section_key = 'registryCardGrid' and section.status = 'active';

-- Shell versions are immutable. Publish a successor version that permits the
-- new optional roles instead of editing the active version in place.
do $$
declare
  active_version public.promo_composition_shell_versions%rowtype;
  next_version integer;
  new_version_id uuid;
  allowed_roles jsonb;
  next_config jsonb;
begin
  for active_version in
    select version.*
    from public.promo_composition_shell_versions version
    join public.promo_composition_shells shell
      on shell.id = version.shell_id and shell.status = 'active'
    where version.status = 'active'
    order by version.shell_id
  loop
    select coalesce(jsonb_agg(role order by role), '[]'::jsonb)
      into allowed_roles
    from (
      select distinct role
      from (
        select jsonb_array_elements_text(coalesce(active_version.config_json->'allowedSectionRoles', '[]'::jsonb)) role
        union all select unnest(array['offer','content','trust'])
      ) roles
    ) normalized;
    if coalesce(active_version.config_json->'allowedSectionRoles', '[]'::jsonb) @> allowed_roles then
      continue;
    end if;
    if exists (
      select 1 from public.promo_composition_shell_versions
      where shell_id = active_version.shell_id and status = 'draft'
    ) then
      raise exception 'Cannot expand Composition Shell roles while a draft version exists';
    end if;
    perform pg_advisory_xact_lock(hashtext('promo_composition_shell:' || active_version.shell_id::text));
    select coalesce(max(version), 0) + 1 into next_version
    from public.promo_composition_shell_versions
    where shell_id = active_version.shell_id;
    next_config := jsonb_set(active_version.config_json, '{allowedSectionRoles}', allowed_roles, true);
    insert into public.promo_composition_shell_versions (
      shell_id, version, status, config_json, fallback_template_id,
      fallback_template_version, change_note
    ) values (
      active_version.shell_id, next_version, 'draft', next_config,
      active_version.fallback_template_id, active_version.fallback_template_version,
      'Migration 065: expanded Registry section roles.'
    ) returning id into new_version_id;
    perform public.activate_promo_composition_shell_version(
      new_version_id, 'Migration 065: expanded Registry section roles.'
    );
  end loop;
end $$;

commit;
