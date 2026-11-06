begin;

-- Six reusable patterns distilled from the approved reference set. They are
-- intentionally seeded as Drafts: an administrator must review the field
-- contract, author a RenderSpec, and activate a version before page generation
-- can consume it. Foreign keys and required columns fail the migration safely
-- if migrations 029, 031, and 048 have not been applied.

insert into public.wizard_item_components as existing (
  system_seed_code, name, description, status, library_presentation
)
select seed.system_seed_code, seed.name, seed.description, 'active',
  seed.library_presentation::jsonb
from (values
  (
    'ref-pattern-offer-value-breakdown', 'Offer Value Breakdown',
    'Conversion-focused offer summary with value, supporting copy, and one action.',
    '{"category":"promo","iconKey":"layout","keywords":["offer","value","promotion","conversion","cta"],"displayOrder":110,"isFeatured":true}'
  ),
  (
    'ref-pattern-promotion-steps', 'Promotion Steps',
    'Repeatable numbered steps that explain how to join or complete a promotion.',
    '{"category":"layout","iconKey":"layout","keywords":["steps","how-to","onboarding","promotion","sequence"],"displayOrder":120,"isFeatured":true}'
  ),
  (
    'ref-pattern-trust-proof-grid', 'Trust Proof Grid',
    'Repeatable evidence cards for awards, safeguards, partner marks, and trust claims.',
    '{"category":"promo","iconKey":"badge","keywords":["trust","proof","award","security","partner"],"displayOrder":130,"isFeatured":true}'
  ),
  (
    'ref-pattern-metric-strip', 'Metric Strip',
    'Compact repeatable metrics for reach, rewards, participation, or product performance.',
    '{"category":"promo","iconKey":"heading","keywords":["metric","stat","number","proof","kpi"],"displayOrder":140,"isFeatured":true}'
  ),
  (
    'ref-pattern-feature-split', 'Feature Split',
    'Editorial two-column feature story with copy, media, and an optional action.',
    '{"category":"layout","iconKey":"image","keywords":["feature","split","story","media","editorial"],"displayOrder":150,"isFeatured":true}'
  ),
  (
    'ref-pattern-faq-accordion', 'FAQ Accordion',
    'Repeatable question and answer set for promotion rules and customer guidance.',
    '{"category":"layout","iconKey":"text","keywords":["faq","accordion","question","answer","support"],"displayOrder":160,"isFeatured":true}'
  )
) as seed(system_seed_code, name, description, library_presentation)
on conflict (system_seed_code) do update set
  name = excluded.name,
  description = excluded.description,
  status = case when existing.status = 'archived' then existing.status else 'active' end,
  library_presentation = excluded.library_presentation,
  updated_at = now();

insert into public.wizard_item_component_versions (
  component_id, version, status, field_kind, text_type, editor_schema,
  default_value, capabilities, image_policy, cta_policy, style_slots,
  placement_policy, change_note
)
select component.id, 1, 'draft', seed.field_kind, seed.text_type,
  seed.editor_schema::jsonb, seed.default_value::jsonb,
  seed.capabilities::jsonb, '{}'::jsonb, '{}'::jsonb,
  seed.style_slots::jsonb, seed.placement_policy::jsonb,
  'Migration 080: reference-derived component draft for Admin review.'
from (values
  (
    'ref-pattern-offer-value-breakdown', 'text', 'multi',
    '{"description":"Offer summary fields. Review and add a RenderSpec before activation."}',
    '{"fields":{"eyebrow":"한정 프로모션","title":"혜택을 한눈에 확인하세요","description":"참여 조건과 핵심 혜택을 명확하게 안내합니다.","value":"최대 보너스","action":{"label":"지금 참여하기","link":"#","target":"_self"}}}',
    '{"layoutRegions":["offer-summary"],"referenceDerived":true}',
    '[{"slotKey":"surface","semanticRole":"surface-color","aiSelectable":true},{"slotKey":"accent","semanticRole":"accent-color","aiSelectable":true}]',
    '{"allowedSectionRoles":["hero","offer","content","cta"],"deniedSectionRoles":[],"maxInstancesPerSection":1,"requiresParentCapabilities":[],"defaultGeometry":{"desktop":{"widthPct":84,"heightPx":420},"mobile":{"widthPct":90,"heightPx":520}}}'
  ),
  (
    'ref-pattern-promotion-steps', 'text', 'multi',
    '{"description":"Repeatable promotion step fields. Review and add a RenderSpec before activation."}',
    '{"fields":{"number":"01","title":"프로모션 참여","description":"안내에 따라 간단히 참여하세요.","image":{"source":"url","value":"","description":"","alt":"Promotion step visual"}}}',
    '{"collection":{"enabled":true,"minItems":2,"maxItems":6,"layout":"grid","desktopColumns":4,"mobileColumns":1,"gapPx":16},"layoutRegions":["steps"],"referenceDerived":true}',
    '[{"slotKey":"stepSurface","semanticRole":"surface-color","aiSelectable":true},{"slotKey":"stepRadius","semanticRole":"radius","aiSelectable":true}]',
    '{"allowedSectionRoles":["benefit","content","offer"],"deniedSectionRoles":[],"maxInstancesPerSection":1,"requiresParentCapabilities":[],"defaultGeometry":{"desktop":{"widthPct":88,"heightPx":420},"mobile":{"widthPct":90,"heightPx":680}}}'
  ),
  (
    'ref-pattern-trust-proof-grid', 'text', 'multi',
    '{"description":"Repeatable trust proof fields. Review and add a RenderSpec before activation."}',
    '{"fields":{"badge":{"source":"url","value":"","description":"","alt":"Trust badge"},"title":"검증된 신뢰","description":"고객이 안심할 수 있는 근거를 설명합니다.","value":"24/7"}}',
    '{"collection":{"enabled":true,"minItems":2,"maxItems":6,"layout":"grid","desktopColumns":3,"mobileColumns":1,"gapPx":16},"layoutRegions":["trust-grid"],"referenceDerived":true}',
    '[{"slotKey":"proofSurface","semanticRole":"surface-color","aiSelectable":true},{"slotKey":"proofShadow","semanticRole":"shadow","aiSelectable":true}]',
    '{"allowedSectionRoles":["trust","benefit","content"],"deniedSectionRoles":[],"maxInstancesPerSection":1,"requiresParentCapabilities":[],"defaultGeometry":{"desktop":{"widthPct":86,"heightPx":360},"mobile":{"widthPct":90,"heightPx":620}}}'
  ),
  (
    'ref-pattern-metric-strip', 'text', 'title',
    '{"description":"Repeatable metric fields. Review and add a RenderSpec before activation."}',
    '{"fields":{"value":"1M+","label":"참여 고객","context":"전 세계 누적 기준"}}',
    '{"collection":{"enabled":true,"minItems":2,"maxItems":5,"layout":"grid","desktopColumns":4,"mobileColumns":2,"gapPx":12},"layoutRegions":["metric-strip"],"referenceDerived":true}',
    '[{"slotKey":"valueColor","semanticRole":"accent-color","aiSelectable":true},{"slotKey":"labelColor","semanticRole":"muted-color","aiSelectable":true}]',
    '{"allowedSectionRoles":["trust","benefit","content"],"deniedSectionRoles":[],"maxInstancesPerSection":1,"requiresParentCapabilities":[],"defaultGeometry":{"desktop":{"widthPct":90,"heightPx":190},"mobile":{"widthPct":90,"heightPx":300}}}'
  ),
  (
    'ref-pattern-feature-split', 'text', 'multi',
    '{"description":"Feature story fields. Review and add a RenderSpec before activation."}',
    '{"fields":{"eyebrow":"FEATURE","title":"브랜드 경험을 더 깊게","body":"핵심 기능과 차별점을 시각적 스토리로 전달합니다.","image":{"source":"url","value":"","description":"","alt":"Feature visual"},"action":{"label":"자세히 보기","link":"#","target":"_self"}}}',
    '{"layoutRegions":["feature-copy","feature-media"],"referenceDerived":true}',
    '[{"slotKey":"featureSurface","semanticRole":"surface-color","aiSelectable":true},{"slotKey":"mediaRadius","semanticRole":"radius","aiSelectable":true}]',
    '{"allowedSectionRoles":["hero","benefit","content","offer"],"deniedSectionRoles":[],"maxInstancesPerSection":1,"requiresParentCapabilities":[],"defaultGeometry":{"desktop":{"widthPct":90,"heightPx":560},"mobile":{"widthPct":90,"heightPx":720}}}'
  ),
  (
    'ref-pattern-faq-accordion', 'text', 'title',
    '{"description":"Repeatable FAQ fields. Review and add a RenderSpec before activation."}',
    '{"fields":{"question":"프로모션에는 어떻게 참여하나요?","answer":"페이지에 안내된 참여 조건과 기간을 확인해 주세요."}}',
    '{"collection":{"enabled":true,"minItems":2,"maxItems":12,"layout":"stack","desktopColumns":1,"mobileColumns":1,"gapPx":8},"layoutRegions":["faq-list"],"referenceDerived":true}',
    '[{"slotKey":"rowShadow","semanticRole":"shadow","aiSelectable":true},{"slotKey":"questionColor","semanticRole":"text-color","aiSelectable":true}]',
    '{"allowedSectionRoles":["content","notice"],"deniedSectionRoles":[],"maxInstancesPerSection":1,"requiresParentCapabilities":[],"defaultGeometry":{"desktop":{"widthPct":76,"heightPx":540},"mobile":{"widthPct":90,"heightPx":680}}}'
  )
) as seed(
  system_seed_code, field_kind, text_type, editor_schema, default_value,
  capabilities, style_slots, placement_policy
)
join public.wizard_item_components component
  on component.system_seed_code = seed.system_seed_code
where not exists (
  select 1 from public.wizard_item_component_versions version
  where version.component_id = component.id and version.version = 1
);

insert into public.wizard_item_component_version_fields (
  component_version_id, field_key, name, field_kind, text_type, sort_order,
  is_required, is_locked, default_value, editor_schema, capabilities,
  image_policy, cta_policy, style_slots
)
select version.id, seed.field_key, seed.name, seed.field_kind, seed.text_type,
  seed.sort_order, seed.is_required, false, seed.default_value::jsonb,
  seed.editor_schema::jsonb, seed.capabilities::jsonb,
  seed.image_policy::jsonb, seed.cta_policy::jsonb, seed.style_slots::jsonb
from (values
  ('ref-pattern-offer-value-breakdown','fld_a1000000000000000000000000000001','Offer Eyebrow','text','remark',0,false,'"한정 프로모션"','{"multiline":false,"maxLength":60}','{"copy":true}','{}','{}','[{"slotKey":"eyebrowColor","semanticRole":"accent-color","aiSelectable":true}]'),
  ('ref-pattern-offer-value-breakdown','fld_a1000000000000000000000000000002','Offer Title','text','title',10,true,'"혜택을 한눈에 확인하세요"','{"multiline":true,"maxLength":120}','{"copy":true}','{}','{}','[{"slotKey":"titleColor","semanticRole":"text-color","aiSelectable":true}]'),
  ('ref-pattern-offer-value-breakdown','fld_a1000000000000000000000000000003','Offer Description','text','multi',20,true,'"참여 조건과 핵심 혜택을 명확하게 안내합니다."','{"multiline":true,"maxLength":500}','{"copy":true}','{}','{}','[{"slotKey":"bodyColor","semanticRole":"text-color","aiSelectable":true}]'),
  ('ref-pattern-offer-value-breakdown','fld_a1000000000000000000000000000004','Offer Value','text','remark',30,true,'"최대 보너스"','{"multiline":false,"maxLength":80}','{"copy":true}','{}','{}','[{"slotKey":"valueColor","semanticRole":"accent-color","aiSelectable":true}]'),
  ('ref-pattern-offer-value-breakdown','fld_a1000000000000000000000000000005','Offer Action','cta',null,40,true,'{"label":"지금 참여하기","link":"#","target":"_self"}','{"labelRequired":true,"linkRequired":true,"maxLength":30}','{"action":true}','{}','{"utmEnabled":true}','[{"slotKey":"ctaBackground","semanticRole":"accent-color","aiSelectable":true}]'),

  ('ref-pattern-promotion-steps','fld_a2000000000000000000000000000001','Step Number','text','remark',0,true,'"01"','{"multiline":false,"maxLength":8}','{"copy":true}','{}','{}','[{"slotKey":"numberColor","semanticRole":"accent-color","aiSelectable":true}]'),
  ('ref-pattern-promotion-steps','fld_a2000000000000000000000000000002','Step Title','text','title',10,true,'"프로모션 참여"','{"multiline":false,"maxLength":80}','{"copy":true}','{}','{}','[{"slotKey":"titleColor","semanticRole":"text-color","aiSelectable":true}]'),
  ('ref-pattern-promotion-steps','fld_a2000000000000000000000000000003','Step Description','text','multi',20,true,'"안내에 따라 간단히 참여하세요."','{"multiline":true,"maxLength":240}','{"copy":true}','{}','{}','[{"slotKey":"bodyColor","semanticRole":"text-color","aiSelectable":true}]'),
  ('ref-pattern-promotion-steps','fld_a2000000000000000000000000000004','Step Image','image',null,30,false,'{"source":"url","value":"","description":"","alt":"Promotion step visual"}','{"altText":true}','{"aiImage":true}','{"allowedSources":["ai","file","url"],"promptText":"Create a clean promotional step illustration without text or logos.","aspectRatio":"1:1","descriptionEnabled":true,"altTextRequired":true}','{}','[{"slotKey":"imageRadius","semanticRole":"radius","aiSelectable":true}]'),

  ('ref-pattern-trust-proof-grid','fld_a3000000000000000000000000000001','Badge Image','image',null,0,false,'{"source":"url","value":"","description":"","alt":"Trust badge"}','{"altText":true}','{"aiImage":false}','{"allowedSources":["file","url"],"aspectRatio":"1:1","descriptionEnabled":true,"altTextRequired":true}','{}','[{"slotKey":"badgeRadius","semanticRole":"radius","aiSelectable":true}]'),
  ('ref-pattern-trust-proof-grid','fld_a3000000000000000000000000000002','Proof Title','text','title',10,true,'"검증된 신뢰"','{"multiline":false,"maxLength":80}','{"copy":true}','{}','{}','[{"slotKey":"titleColor","semanticRole":"text-color","aiSelectable":true}]'),
  ('ref-pattern-trust-proof-grid','fld_a3000000000000000000000000000003','Proof Description','text','multi',20,true,'"고객이 안심할 수 있는 근거를 설명합니다."','{"multiline":true,"maxLength":260}','{"copy":true}','{}','{}','[{"slotKey":"bodyColor","semanticRole":"text-color","aiSelectable":true}]'),
  ('ref-pattern-trust-proof-grid','fld_a3000000000000000000000000000004','Proof Value','text','remark',30,false,'"24/7"','{"multiline":false,"maxLength":40}','{"copy":true}','{}','{}','[{"slotKey":"valueColor","semanticRole":"accent-color","aiSelectable":true}]'),

  ('ref-pattern-metric-strip','fld_a4000000000000000000000000000001','Metric Value','text','title',0,true,'"1M+"','{"multiline":false,"maxLength":32}','{"copy":true}','{}','{}','[{"slotKey":"valueColor","semanticRole":"accent-color","aiSelectable":true}]'),
  ('ref-pattern-metric-strip','fld_a4000000000000000000000000000002','Metric Label','text','remark',10,true,'"참여 고객"','{"multiline":false,"maxLength":80}','{"copy":true}','{}','{}','[{"slotKey":"labelColor","semanticRole":"text-color","aiSelectable":true}]'),
  ('ref-pattern-metric-strip','fld_a4000000000000000000000000000003','Metric Context','text','multi',20,false,'"전 세계 누적 기준"','{"multiline":true,"maxLength":160}','{"copy":true}','{}','{}','[{"slotKey":"contextColor","semanticRole":"muted-color","aiSelectable":true}]'),

  ('ref-pattern-feature-split','fld_a5000000000000000000000000000001','Feature Eyebrow','text','remark',0,false,'"FEATURE"','{"multiline":false,"maxLength":60}','{"copy":true}','{}','{}','[{"slotKey":"eyebrowColor","semanticRole":"accent-color","aiSelectable":true}]'),
  ('ref-pattern-feature-split','fld_a5000000000000000000000000000002','Feature Title','text','title',10,true,'"브랜드 경험을 더 깊게"','{"multiline":true,"maxLength":120}','{"copy":true}','{}','{}','[{"slotKey":"titleColor","semanticRole":"text-color","aiSelectable":true}]'),
  ('ref-pattern-feature-split','fld_a5000000000000000000000000000003','Feature Body','text','multi',20,true,'"핵심 기능과 차별점을 시각적 스토리로 전달합니다."','{"multiline":true,"maxLength":700}','{"copy":true}','{}','{}','[{"slotKey":"bodyColor","semanticRole":"text-color","aiSelectable":true}]'),
  ('ref-pattern-feature-split','fld_a5000000000000000000000000000004','Feature Image','image',null,30,true,'{"source":"url","value":"","description":"","alt":"Feature visual"}','{"altText":true}','{"aiImage":true}','{"allowedSources":["ai","file","url"],"promptText":"Create a premium editorial campaign image without embedded text, logos, buttons, or UI labels.","aspectRatio":"4:3","descriptionEnabled":true,"altTextRequired":true}','{}','[{"slotKey":"imageRadius","semanticRole":"radius","aiSelectable":true}]'),
  ('ref-pattern-feature-split','fld_a5000000000000000000000000000005','Feature Action','cta',null,40,false,'{"label":"자세히 보기","link":"#","target":"_self"}','{"labelRequired":true,"linkRequired":true,"maxLength":30}','{"action":true}','{}','{"utmEnabled":true}','[{"slotKey":"ctaBackground","semanticRole":"accent-color","aiSelectable":true}]'),

  ('ref-pattern-faq-accordion','fld_a6000000000000000000000000000001','Question','text','title',0,true,'"프로모션에는 어떻게 참여하나요?"','{"multiline":true,"maxLength":180}','{"copy":true}','{}','{}','[{"slotKey":"questionColor","semanticRole":"text-color","aiSelectable":true}]'),
  ('ref-pattern-faq-accordion','fld_a6000000000000000000000000000002','Answer','text','multi',10,true,'"페이지에 안내된 참여 조건과 기간을 확인해 주세요."','{"multiline":true,"maxLength":1200}','{"copy":true}','{}','{}','[{"slotKey":"answerColor","semanticRole":"text-color","aiSelectable":true}]')
) as seed(
  system_seed_code, field_key, name, field_kind, text_type, sort_order,
  is_required, default_value, editor_schema, capabilities,
  image_policy, cta_policy, style_slots
)
join public.wizard_item_components component
  on component.system_seed_code = seed.system_seed_code
join public.wizard_item_component_versions version
  on version.component_id = component.id and version.version = 1
on conflict (component_version_id, field_key) do nothing;

commit;
