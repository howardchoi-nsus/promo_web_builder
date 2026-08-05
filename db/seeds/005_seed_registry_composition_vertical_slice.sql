begin;

-- Registry Composition v3 vertical slice:
-- Hero + repeatable image/description/CTA cards + pinned common Terms.
-- Requires migrations 029, 031, 044, and 047 through 053.

do $$
begin
  if to_regclass('public.promo_composition_shell_versions') is null
    or to_regclass('public.promo_content_resource_versions') is null
    or to_regclass('public.wizard_content_section_layouts') is null
    or to_regclass('public.wizard_content_section_component_instances') is null
  then
    raise exception 'Registry Composition migrations 029, 031, 044, and 047-053 are required before seed 005';
  end if;
end $$;

-- Seed 004 supplies the primitive Hero components and a default Token/Template.
do $$
begin
  if (
    select count(distinct component.system_seed_code)
    from wizard_item_components component
    join wizard_item_component_versions version
      on version.component_id = component.id and version.status = 'active'
    where component.status = 'active'
      and component.system_seed_code in (
        'hero-title', 'body-text', 'content-image', 'primary-cta'
      )
  ) <> 4 then
    raise exception 'Seed 004 active primitive components are required before seed 005';
  end if;
end $$;
-- Reuse the existing primitive components and add two composite components.
insert into wizard_item_components (
  system_seed_code, name, description, status, library_presentation
) values
  (
    'registry-promo-card', 'Registry Promotion Card',
    'Repeatable image, description, and CTA promotion card.', 'active',
    '{"category":"content","iconKey":"table-cells-large","keywords":["card","image","description","cta","collection"],"displayOrder":30,"isFeatured":true}'::jsonb
  ),
  (
    'registry-terms-content', 'Registry Terms Content',
    'Pinned common terms content rendered from the Content Resource Registry.', 'active',
    '{"category":"legal","iconKey":"file-contract","keywords":["terms","legal","resource"],"displayOrder":90,"isFeatured":true}'::jsonb
  )
on conflict (system_seed_code) do update set
  name = excluded.name,
  description = excluded.description,
  status = 'active',
  library_presentation = excluded.library_presentation,
  updated_at = now();

insert into wizard_item_component_versions (
  component_id, version, status, field_kind, text_type, editor_schema,
  default_value, capabilities, image_policy, cta_policy, style_slots,
  placement_policy, change_note
)
select component.id, 1, 'active', seed.field_kind, seed.text_type,
  seed.editor_schema::jsonb, seed.default_value::jsonb, seed.capabilities::jsonb,
  '{}'::jsonb, '{}'::jsonb, seed.style_slots::jsonb,
  seed.placement_policy::jsonb, 'Registry Composition vertical slice seed.'
from (values
  (
    'registry-promo-card', 'text', 'multi',
    '{"description":"Repeatable promotion card fields."}',
    '{"fields":{"image":{"source":"url","value":"","description":"","alt":"Promotion card image"},"description":"프로모션 혜택을 확인하세요.","action":{"label":"자세히 보기","link":"#","target":"_self"}}}',
    '{"collection":{"enabled":true,"minItems":1,"maxItems":3,"layout":"grid","desktopColumns":3,"mobileColumns":1,"gapPct":2,"gapPx":16},"layoutRegions":["content-grid"],"aiImage":true}',
    '[{"slotKey":"cardSurface","semanticRole":"surface-color","aiSelectable":true},{"slotKey":"cardRadius","semanticRole":"radius","aiSelectable":true},{"slotKey":"cardShadow","semanticRole":"shadow","aiSelectable":true}]',
    '{"allowedSectionRoles":["benefit","content"],"minInstances":1,"maxInstances":3,"desktop":{"widthPct":84,"heightPx":360},"mobile":{"widthPct":90,"heightPx":340}}'
  ),
  (
    'registry-terms-content', 'text', 'multi',
    '{"description":"Content is supplied by a pinned Resource version."}',
    '"공통 약관"',
    '{"layoutRegions":["legal"],"resourceBound":true}',
    '[{"slotKey":"termsColor","semanticRole":"muted-color","aiSelectable":true}]',
    '{"allowedSectionRoles":["terms","legal"],"minInstances":1,"maxInstances":1,"desktop":{"widthPct":88,"heightPx":180},"mobile":{"widthPct":90,"heightPx":220}}'
  )
) as seed(
  system_seed_code, field_kind, text_type, editor_schema, default_value,
  capabilities, style_slots, placement_policy
)
join wizard_item_components component
  on component.system_seed_code = seed.system_seed_code
where not exists (
  select 1 from wizard_item_component_versions version
  where version.component_id = component.id and version.version = 1
);

-- Keep the idempotent seed authoritative when an earlier Seed 005 revision
-- already created version 1.
update wizard_item_component_versions version
set style_slots = '[{"slotKey":"cardSurface","semanticRole":"surface-color","aiSelectable":true},{"slotKey":"cardRadius","semanticRole":"radius","aiSelectable":true},{"slotKey":"cardShadow","semanticRole":"shadow","aiSelectable":true}]'::jsonb,
  updated_at = now()
from wizard_item_components component
where version.component_id = component.id
  and version.version = 1
  and component.system_seed_code = 'registry-promo-card';

update wizard_item_component_versions version
set editor_schema = coalesce(version.editor_schema, '{}'::jsonb)
    || '{"labelRequired":true,"linkRequired":true,"maxLength":20}'::jsonb,
  updated_at = now()
from wizard_item_components component
where version.component_id = component.id
  and version.status = 'active'
  and component.system_seed_code = 'primary-cta';

-- Stable field keys make CompositionSpec bindings reproducible.
insert into wizard_item_component_version_fields (
  component_version_id, field_key, name, field_kind, text_type, sort_order,
  is_required, is_locked, default_value, editor_schema, capabilities,
  image_policy, cta_policy, style_slots
)
select version.id, seed.field_key, seed.name, seed.field_kind, seed.text_type,
  seed.sort_order, seed.is_required, seed.is_locked, seed.default_value::jsonb,
  seed.editor_schema::jsonb, seed.capabilities::jsonb, seed.image_policy::jsonb,
  seed.cta_policy::jsonb, seed.style_slots::jsonb
from (values
  ('registry-promo-card','fld_10000000000000000000000000000001','Card Image','image',null,0,true,false,
    '{"source":"url","value":"","description":"","alt":"Promotion card image"}',
    '{"altText":true}','{"aiImage":true}',
    '{"allowedSources":["ai","file","url"],"promptText":"Create a promotional benefit image without text, logos, buttons, or UI labels.","aspectRatio":"4:3","descriptionEnabled":true,"altTextRequired":true}',
    '{}','[{"slotKey":"imageRadius","semanticRole":"radius","aiSelectable":true}]'),
  ('registry-promo-card','fld_10000000000000000000000000000002','Card Description','text','multi',10,true,false,
    '"프로모션 혜택을 확인하세요."','{"multiline":true,"maxLength":500}','{"copy":true}',
    '{}','{}','[{"slotKey":"bodyColor","semanticRole":"text-color","aiSelectable":true}]'),
  ('registry-promo-card','fld_10000000000000000000000000000003','Card Action','cta',null,20,true,false,
    '{"label":"자세히 보기","link":"#","target":"_self"}','{"labelRequired":true,"linkRequired":true,"maxLength":20}','{"action":true}',
    '{}','{"utmEnabled":true}','[{"slotKey":"ctaBackground","semanticRole":"accent-color","aiSelectable":true}]'),
  ('registry-terms-content','fld_20000000000000000000000000000001','Terms Content','text','multi',0,true,true,
    '"공통 약관"','{"multiline":true,"maxLength":20000}','{"resourceBound":true}',
    '{}','{}','[{"slotKey":"termsColor","semanticRole":"muted-color","aiSelectable":true}]')
) as seed(
  system_seed_code, field_key, name, field_kind, text_type, sort_order,
  is_required, is_locked, default_value, editor_schema, capabilities,
  image_policy, cta_policy, style_slots
)
join wizard_item_components component
  on component.system_seed_code = seed.system_seed_code
join wizard_item_component_versions version
  on version.component_id = component.id and version.version = 1
on conflict (component_version_id, field_key) do update set
  name = excluded.name,
  sort_order = excluded.sort_order,
  is_required = excluded.is_required,
  is_locked = excluded.is_locked,
  default_value = excluded.default_value,
  editor_schema = excluded.editor_schema,
  capabilities = excluded.capabilities,
  image_policy = excluded.image_policy,
  cta_policy = excluded.cta_policy,
  style_slots = excluded.style_slots,
  updated_at = now();


insert into wizard_content_sections (
  section_key, name, description, is_required,
  order_change_allowed, fixed_position, sort_order, is_visible_in_wizard,
  status, version, change_note, owner_form_template_id, ai_design,
  composition_scope, section_role, composition_policy
)
select seed.section_key, seed.name, seed.description,
  seed.is_required, seed.order_change_allowed, seed.fixed_position,
  seed.sort_order, true, 'active', 1,
  'Registry Composition vertical slice seed.', null,
  seed.ai_design::jsonb, seed.composition_scope, seed.section_role,
  seed.composition_policy::jsonb
from (values
  (
    'registryHero','Registry Hero','Required Hero with title, description, image, and CTA.',
    true,true,null,10,'registry','hero',
    '{"enabled":true,"allowedLayoutVariants":["hero_centered"],"allowSectionBackground":false,"imageTarget":"item","imageTargetItemKeys":["visual"],"imageAspectRatio":"4:3"}',
    '{"selectionPolicy":"required","allowedMarkets":[],"allowedPromotionPurposes":[],"aiEditable":true,"contentLocked":false,"layoutLocked":false,"duplicatePolicy":"forbidden","maxInstances":1,"allowedLayoutVariants":["hero_centered"],"allowedMotionPresets":[]}'
  ),
  (
    'registryCardGrid','Registry Card Grid','Repeatable image, description, and CTA cards.',
    false,true,null,30,'registry','benefit',
    '{"enabled":true,"allowedLayoutVariants":["card_grid_3"],"allowSectionBackground":false,"imageTarget":"item","imageTargetItemKeys":["cards"],"imageAspectRatio":"4:3"}',
    '{"selectionPolicy":"optional","allowedMarkets":[],"allowedPromotionPurposes":[],"aiEditable":true,"contentLocked":false,"layoutLocked":false,"duplicatePolicy":"forbidden","maxInstances":1,"allowedLayoutVariants":["card_grid_3"],"allowedMotionPresets":[]}'
  ),
  (
    'sharedTerms','Shared Terms','Required pinned common Terms Resource.',
    true,false,'bottom',90,'shared','terms',
    '{"enabled":true,"allowedLayoutVariants":["terms_default"],"allowSectionBackground":false,"imageTarget":"section-background","imageTargetItemKeys":[],"imageAspectRatio":"16:9"}',
    '{"selectionPolicy":"required-by-market","allowedMarkets":[],"allowedPromotionPurposes":[],"aiEditable":false,"contentLocked":true,"layoutLocked":true,"duplicatePolicy":"forbidden","maxInstances":1,"allowedLayoutVariants":["terms_default"],"allowedMotionPresets":[]}'
  )
) as seed(
  section_key, name, description, is_required, order_change_allowed,
  fixed_position, sort_order, composition_scope, section_role,
  ai_design, composition_policy
)
where not exists (
  select 1 from wizard_content_sections section
  where section.section_key = seed.section_key and section.version = 1
);

-- Re-running the Seed refreshes only an active v1; it never revives an archived version.
update wizard_content_sections section
set name = seed.name,
  description = seed.description,
  is_required = seed.is_required,
  order_change_allowed = seed.order_change_allowed,
  fixed_position = seed.fixed_position,
  sort_order = seed.sort_order,
  is_visible_in_wizard = true,
  owner_form_template_id = null,
  composition_scope = seed.composition_scope,
  section_role = seed.section_role,
  ai_design = seed.ai_design::jsonb,
  composition_policy = seed.composition_policy::jsonb,
  updated_at = now()
from (values
  ('registryHero','Registry Hero','Required Hero with title, description, image, and CTA.',true,true,null,10,'registry','hero',
    '{"enabled":true,"allowedLayoutVariants":["hero_centered"],"allowSectionBackground":false,"imageTarget":"item","imageTargetItemKeys":["visual"],"imageAspectRatio":"4:3"}',
    '{"selectionPolicy":"required","allowedMarkets":[],"allowedPromotionPurposes":[],"aiEditable":true,"contentLocked":false,"layoutLocked":false,"duplicatePolicy":"forbidden","maxInstances":1,"allowedLayoutVariants":["hero_centered"],"allowedMotionPresets":[]}'),
  ('registryCardGrid','Registry Card Grid','Repeatable image, description, and CTA cards.',false,true,null,30,'registry','benefit',
    '{"enabled":true,"allowedLayoutVariants":["card_grid_3"],"allowSectionBackground":false,"imageTarget":"item","imageTargetItemKeys":["cards"],"imageAspectRatio":"4:3"}',
    '{"selectionPolicy":"optional","allowedMarkets":[],"allowedPromotionPurposes":[],"aiEditable":true,"contentLocked":false,"layoutLocked":false,"duplicatePolicy":"forbidden","maxInstances":1,"allowedLayoutVariants":["card_grid_3"],"allowedMotionPresets":[]}'),
  ('sharedTerms','Shared Terms','Required pinned common Terms Resource.',true,false,'bottom',90,'shared','terms',
    '{"enabled":true,"allowedLayoutVariants":["terms_default"],"allowSectionBackground":false,"imageTarget":"section-background","imageTargetItemKeys":[],"imageAspectRatio":"16:9"}',
    '{"selectionPolicy":"required-by-market","allowedMarkets":[],"allowedPromotionPurposes":[],"aiEditable":false,"contentLocked":true,"layoutLocked":true,"duplicatePolicy":"forbidden","maxInstances":1,"allowedLayoutVariants":["terms_default"],"allowedMotionPresets":[]}')
) as seed(
  section_key, name, description, is_required, order_change_allowed,
  fixed_position, sort_order, composition_scope, section_role,
  ai_design, composition_policy
)
where section.section_key = seed.section_key
  and section.version = 1
  and section.status = 'active';

-- Section Component instances.
insert into wizard_content_section_component_instances (
  section_id, component_version_id, item_key, display_name,
  is_visible_in_wizard, is_required, user_reorder_allowed,
  sort_order, is_locked, locked_value, instance_config
)
select section.id, version.id, seed.item_key, seed.display_name,
  true, seed.is_required, seed.user_reorder_allowed, seed.sort_order,
  seed.is_locked, seed.locked_value::jsonb, seed.instance_config::jsonb
from (values
  ('registryHero','hero-title','title','Title',true,false,10,false,null,'{"description":"Primary promotion title."}'),
  ('registryHero','body-text','description','Description',true,false,20,false,null,'{"description":"Primary promotion description."}'),
  ('registryHero','content-image','visual','Visual',false,true,30,false,null,'{"description":"Primary promotion key visual.","assetRole":"hero-key-visual","assetPromptText":"Create one distinctive campaign focal motif with strong visual identity. Do not generate a generic stock photograph, texture, empty gradient, or UI mockup. This artwork is placed inside a bounded Hero media component, never as a full-bleed section background. Keep the complete focal subject inside the canvas with intentional breathing room. Do not render titles, descriptions, CTA labels, buttons, badges, logos, or interface text inside the image."}'),
  ('registryHero','primary-cta','primaryAction','Primary Action',false,true,40,false,null,'{"description":"Primary promotion action."}'),
  ('registryCardGrid','registry-promo-card','cards','Promotion Cards',true,true,10,false,null,
    '{"description":"Repeatable benefit cards.","collection":{"enabled":true,"minItems":1,"maxItems":3,"layout":"grid","desktopColumns":3,"mobileColumns":1,"gapPct":2,"gapPx":16}}'),
  ('sharedTerms','registry-terms-content','termsContent','Terms Content',true,false,10,true,'"공통 약관"',
    '{"description":"Pinned common Terms Resource content."}')
) as seed(
  section_key, system_seed_code, item_key, display_name, is_required,
  user_reorder_allowed, sort_order, is_locked, locked_value, instance_config
)
join wizard_content_sections section
  on section.section_key = seed.section_key
  and section.version = 1 and section.status = 'active'
join wizard_item_components component
  on component.system_seed_code = seed.system_seed_code
join lateral (
  select active_version.id
  from wizard_item_component_versions active_version
  where active_version.component_id = component.id
    and active_version.status = 'active'
  order by active_version.version desc
  limit 1
) version on true
on conflict (section_id, item_key) do update set
  component_version_id = excluded.component_version_id,
  display_name = excluded.display_name,
  is_visible_in_wizard = excluded.is_visible_in_wizard,
  is_required = excluded.is_required,
  user_reorder_allowed = excluded.user_reorder_allowed,
  sort_order = excluded.sort_order,
  is_locked = excluded.is_locked,
  locked_value = excluded.locked_value,
  instance_config = excluded.instance_config,
  updated_at = now();

-- Desktop/Mobile Layout Presets. Collection geometry uses the first card as its base.
insert into wizard_content_section_layouts (
  section_id, layout_key, name, description, is_default,
  layout_snapshot, change_note
)
select section.id, seed.layout_key, seed.name, seed.description, true,
  seed.layout_snapshot::jsonb, 'Registry Composition vertical slice layout.'
from (values
  ('registryHero','hero_centered','Split Hero','Concise copy with a bounded Hero key visual.',
    '{"contractVersion":1,"layoutMode":"free","sectionStyle":{"minHeight":620,"backgroundColorToken":"--app-bg"},"content":{"title":"여름 프로모션","description":"신규 고객을 위한 특별한 혜택을 확인하세요.","visual":{"source":"url","value":"","description":"","alt":"Promotion visual"},"primaryAction":{"label":"혜택 확인하기","link":"#","target":"_self"}},"viewports":{"desktop":{"items":{"title":{"positionMode":"free","xPct":8,"yPx":90,"widthPct":40,"heightPx":90,"zIndex":2},"description":{"positionMode":"free","xPct":8,"yPx":200,"widthPct":40,"heightPx":90,"zIndex":2},"visual":{"positionMode":"free","xPct":53,"yPx":70,"widthPct":39,"heightPx":420,"zIndex":1},"primaryAction":{"positionMode":"free","xPct":8,"yPx":330,"widthPct":22,"heightPx":54,"zIndex":2}},"visibility":{"items":{}}},"mobile":{"items":{"title":{"positionMode":"free","xPct":5,"yPx":40,"widthPct":90,"heightPx":105,"zIndex":2},"description":{"positionMode":"free","xPct":5,"yPx":160,"widthPct":90,"heightPx":100,"zIndex":2},"visual":{"positionMode":"free","xPct":10,"yPx":270,"widthPct":80,"heightPx":230,"zIndex":1},"primaryAction":{"positionMode":"free","xPct":15,"yPx":520,"widthPct":70,"heightPx":54,"zIndex":2}},"visibility":{"items":{}}}}}'),
  ('registryCardGrid','card_grid_3','Three Card Grid','Three columns on desktop and one column on mobile.',
    '{"contractVersion":1,"layoutMode":"free","sectionStyle":{"minHeight":460,"backgroundColorToken":"--app-surface"},"content":{"cards":{"fields":{"image":{"source":"url","value":"","description":"","alt":"Promotion benefit"},"description":"프로모션 혜택을 확인하세요.","action":{"label":"자세히 보기","link":"#","target":"_self"}}}},"viewports":{"desktop":{"items":{"cards":{"positionMode":"free","xPct":8,"yPx":50,"widthPct":84,"heightPx":330,"zIndex":1}},"visibility":{"items":{}}},"mobile":{"items":{"cards":{"positionMode":"free","xPct":5,"yPx":40,"widthPct":90,"heightPx":320,"zIndex":1}},"visibility":{"items":{}}}}}'),
  ('sharedTerms','terms_default','Terms Default','Pinned terms content at the bottom of the page.',
    '{"contractVersion":1,"layoutMode":"free","sectionStyle":{"minHeight":260,"backgroundColorToken":"--app-surface"},"content":{"termsContent":"공통 약관"},"viewports":{"desktop":{"items":{"termsContent":{"positionMode":"free","xPct":6,"yPx":36,"widthPct":88,"heightPx":180,"zIndex":1}},"visibility":{"items":{}}},"mobile":{"items":{"termsContent":{"positionMode":"free","xPct":5,"yPx":28,"widthPct":90,"heightPx":200,"zIndex":1}},"visibility":{"items":{}}}}}')
) as seed(section_key, layout_key, name, description, layout_snapshot)
join wizard_content_sections section
  on section.section_key = seed.section_key
  and section.version = 1 and section.status = 'active'
on conflict (section_id, layout_key) do update set
  name = excluded.name,
  description = excluded.description,
  is_default = true,
  layout_snapshot = excluded.layout_snapshot,
  change_note = excluded.change_note,
  updated_at = now();

-- Versioned common Terms Resource. Existing v1 content is never rewritten.
insert into promo_content_resources (
  resource_key, resource_type, name, description, status
) values (
  'common-promotion-terms', 'terms', 'Common Promotion Terms',
  'Default pinned terms for the Registry Composition vertical slice.', 'active'
)
on conflict (resource_key) do update set
  name = excluded.name,
  description = excluded.description,
  status = 'active',
  updated_at = now();

do $$
declare
  v_resource_id uuid;
  v_resource_version_id uuid;
  v_content jsonb := '{"components":{"termsContent":{"fields":{"fld_20000000000000000000000000000001":"본 프로모션은 대상 고객과 운영 기간에 따라 혜택이 달라질 수 있으며, 세부 조건은 공지된 이용약관을 따릅니다."}}}}'::jsonb;
  v_canonical text := '{"components":{"termsContent":{"fields":{"fld_20000000000000000000000000000001":"본 프로모션은 대상 고객과 운영 기간에 따라 혜택이 달라질 수 있으며, 세부 조건은 공지된 이용약관을 따릅니다."}}}}';
begin
  select id into v_resource_id
  from promo_content_resources
  where resource_key = 'common-promotion-terms';

  select id into v_resource_version_id
  from promo_content_resource_versions
  where resource_id = v_resource_id and lower(locale) = 'ko-kr' and version = 1;

  if v_resource_version_id is null then
    insert into promo_content_resource_versions (
      resource_id, locale, version, status, content_json, content_hash,
      effective_from, effective_to, change_note
    ) values (
      v_resource_id, 'ko-KR', 1, 'active', v_content,
      encode(digest(v_canonical, 'sha256'), 'hex'),
      '2026-01-01T00:00:00Z'::timestamptz, null,
      'Registry Composition vertical slice resource.'
    ) returning id into v_resource_version_id;

    insert into promo_content_resource_histories (
      resource_id, resource_version_id, action, change_note, new_state
    ) values (
      v_resource_id, v_resource_version_id, 'version-created',
      'Registry Composition vertical slice resource.',
      jsonb_build_object('locale','ko-KR','version',1,'status','active')
    );
  end if;

  if not exists (
    select 1 from promo_content_resource_market_rules
    where resource_id = v_resource_id
      and market_code = '*' and locale = 'ko-KR'
      and promotion_purpose = '*' and section_role = 'terms'
      and status = 'active'
  ) then
    insert into promo_content_resource_market_rules (
      resource_id, market_code, locale, promotion_purpose, section_role,
      is_required, priority, status, effective_from, effective_to
    ) values (
      v_resource_id, '*', 'ko-KR', '*', 'terms',
      true, 100, 'active', '2026-01-01T00:00:00Z'::timestamptz, null
    );
  end if;
end $$;

-- Default active Shell pins the shared Terms Section and allowed Token version.
do $$
declare
  v_shell_id uuid;
  v_shell_version_id uuid;
  v_terms_section_id uuid;
  v_token_version_id uuid;
  v_fallback_template_id uuid;
  v_fallback_template_version integer;
  v_config jsonb;
begin
  select id into v_terms_section_id
  from wizard_content_sections
  where section_key = 'sharedTerms' and version = 1 and status = 'active';

  select version.id into v_token_version_id
  from promo_design_token_sets token_set
  join promo_design_token_set_versions version
    on version.token_set_id = token_set.id and version.status = 'active'
  where token_set.status = 'active'
  order by (token_set.set_key = 'rounded-style') desc,
    token_set.is_default desc, token_set.set_key
  limit 1;

  select id, version into v_fallback_template_id, v_fallback_template_version
  from wizard_form_templates
  where status = 'active'
  order by is_default desc, template_key, version desc
  limit 1;

  if v_terms_section_id is null then
    raise exception 'Active shared Terms Section v1 is required before Shell activation';
  end if;
  if v_token_version_id is null then
    raise exception 'An active Design Token Set version is required before Shell activation';
  end if;
  if v_fallback_template_id is null or v_fallback_template_version is null then
    raise exception 'An active fallback Form Template is required before Shell activation';
  end if;

  v_config := jsonb_build_object(
    'isDefault', true,
    'allowedLocales', jsonb_build_array('ko-KR'),
    'requiredSectionRoles', jsonb_build_array('hero','terms'),
    'allowedSectionRoles', jsonb_build_array('hero','benefit','terms'),
    'sharedSectionVersionIds', jsonb_build_array(v_terms_section_id::text),
    'allowedTokenSetVersionIds', jsonb_build_array(v_token_version_id::text),
    'defaultTokenSetVersionId', v_token_version_id::text,
    'allowedMotionPresetVersionIds', '[]'::jsonb,
    'maxCandidateSections', 20
  );

  insert into promo_composition_shells (
    shell_key, name, description, status
  ) values (
    'default-registry', 'Default Registry Composition',
    'Hero, repeatable promotion cards, and pinned common Terms.', 'active'
  )
  on conflict (shell_key) do update set
    name = excluded.name,
    description = excluded.description,
    status = 'active',
    updated_at = now()
  returning id into v_shell_id;

  insert into promo_composition_shell_versions (
    shell_id, version, status, config_json,
    fallback_template_id, fallback_template_version, change_note
  ) values (
    v_shell_id, 1, 'draft', v_config,
    v_fallback_template_id, v_fallback_template_version,
    'Registry Composition vertical slice seed.'
  )
  on conflict (shell_id, version) do update set
    config_json = excluded.config_json,
    fallback_template_id = excluded.fallback_template_id,
    fallback_template_version = excluded.fallback_template_version,
    change_note = excluded.change_note,
    updated_at = now()
  returning id into v_shell_version_id;

  perform activate_promo_composition_shell_version(
    v_shell_version_id,
    'Registry Composition vertical slice activated.'
  );
end $$;

-- Fail the transaction if the vertical slice is incomplete.
do $$
begin
  if (select count(*) from wizard_content_sections
      where section_key in ('registryHero','registryCardGrid','sharedTerms')
        and version = 1 and status = 'active') <> 3 then
    raise exception 'Registry Composition Section seed is incomplete';
  end if;
  if (
    select count(*)
    from wizard_content_section_component_instances instance
    join wizard_content_sections section on section.id = instance.section_id
    where section.section_key in ('registryHero','registryCardGrid','sharedTerms')
      and section.version = 1 and section.status = 'active'
  ) <> 6 then
    raise exception 'Registry Composition component instance seed is incomplete';
  end if;
  if (
    select count(*)
    from wizard_content_section_layouts layout
    join wizard_content_sections section on section.id = layout.section_id
    where section.section_key in ('registryHero','registryCardGrid','sharedTerms')
      and section.version = 1 and section.status = 'active'
      and layout.is_default = true
  ) <> 3 then
    raise exception 'Registry Composition Layout seed is incomplete';
  end if;
  if not exists (
    select 1 from promo_composition_shell_versions version
    join promo_composition_shells shell on shell.id = version.shell_id
    where shell.shell_key = 'default-registry'
      and shell.status = 'active' and version.status = 'active'
  ) then raise exception 'Default Registry Composition Shell is not active'; end if;
  if not exists (
    select 1 from promo_content_resource_versions version
    join promo_content_resources resource on resource.id = version.resource_id
    where resource.resource_key = 'common-promotion-terms'
      and resource.status = 'active' and version.status = 'active'
  ) then raise exception 'Common Terms Resource version is not active'; end if;
end $$;

commit;
