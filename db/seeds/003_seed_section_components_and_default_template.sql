-- Manual seed for the shared section-component model introduced by migration 028.
-- This script intentionally refuses to run while legacy configuration rows exist.
-- Run it only after the separately reviewed configuration reset transaction.

do $$
declare
  v_template_id uuid;
begin
  if exists (select 1 from wizard_content_sections)
    or exists (select 1 from wizard_form_templates) then
    raise exception 'Wizard configuration is not empty. Back up and reset configuration before applying seed 003.';
  end if;

  insert into wizard_section_components (component_key)
  values
    ('header'), ('heroBanner'), ('stepBar'), ('contentCta'),
    ('imageTextRow'), ('titleDescription'), ('footer')
  on conflict (component_key) do nothing;

  insert into wizard_content_sections (
    component_id, section_key, name, description, is_required, order_change_allowed,
    fixed_position, sort_order, is_visible_in_wizard, status, version, change_note,
    owner_form_template_id, ai_design
  )
  select
    component.id, seed.component_key, seed.name, seed.description,
    seed.is_required, seed.order_change_allowed, seed.fixed_position, seed.sort_order,
    true, 'active', 1, 'Created by shared component seed 003.', null, seed.ai_design
  from jsonb_to_recordset(
    '[
      {"component_key":"header","name":"Header","description":"Brand identity and trust elements shown at the top.","is_required":false,"order_change_allowed":false,"fixed_position":"top","sort_order":0,"ai_design":{"enabled":false,"allowedLayoutVariants":[],"imageTarget":"section-background","imageTargetItemKeys":[],"imageAspectRatio":"16:9"}},
      {"component_key":"heroBanner","name":"Hero Banner","description":"Primary promotion headline, supporting copy and CTA.","is_required":true,"order_change_allowed":true,"sort_order":10,"ai_design":{"enabled":true,"allowedLayoutVariants":["split-left","split-right","centered-hero"],"imageTarget":"section-background","imageTargetItemKeys":[],"imageAspectRatio":"16:9"}},
      {"component_key":"stepBar","name":"Step Bar","description":"A repeatable participation-flow section.","is_required":false,"order_change_allowed":true,"sort_order":20,"ai_design":{"enabled":true,"allowedLayoutVariants":["split-left","split-right","centered-hero"],"imageTarget":"section-background","imageTargetItemKeys":[],"imageAspectRatio":"16:9"}},
      {"component_key":"contentCta","name":"Content CTA","description":"A content section with text, image and CTA.","is_required":false,"order_change_allowed":true,"sort_order":30,"ai_design":{"enabled":true,"allowedLayoutVariants":["split-left","split-right","centered-hero"],"imageTarget":"item","imageTargetItemKeys":["image"],"imageAspectRatio":"16:9"}},
      {"component_key":"imageTextRow","name":"Image Text Row","description":"A repeatable image and text content row.","is_required":false,"order_change_allowed":true,"sort_order":40,"ai_design":{"enabled":true,"allowedLayoutVariants":["split-left","split-right"],"imageTarget":"item","imageTargetItemKeys":["image"],"imageAspectRatio":"16:9"}},
      {"component_key":"titleDescription","name":"Title and Description","description":"Terms, notices and supplemental text.","is_required":false,"order_change_allowed":true,"sort_order":50,"ai_design":{"enabled":true,"allowedLayoutVariants":["centered-hero"],"imageTarget":"section-background","imageTargetItemKeys":[],"imageAspectRatio":"16:9"}},
      {"component_key":"footer","name":"Footer","description":"Footer branding, licenses and legal content.","is_required":false,"order_change_allowed":false,"fixed_position":"bottom","sort_order":60,"ai_design":{"enabled":false,"allowedLayoutVariants":[],"imageTarget":"section-background","imageTargetItemKeys":[],"imageAspectRatio":"16:9"}}
    ]'::jsonb
  ) as seed(
    component_key text, name text, description text, is_required boolean,
    order_change_allowed boolean, fixed_position text, sort_order integer, ai_design jsonb
  )
  join wizard_section_components component on component.component_key = seed.component_key;

  insert into wizard_content_section_items (
    section_id, item_key, name, is_visible_in_wizard, is_required,
    user_reorder_allowed, sort_order, field_kind, text_type,
    image_allowed_sources, image_prompt_text
  )
  select
    section.id, seed.item_key, seed.name, true, seed.is_required,
    seed.user_reorder_allowed, seed.sort_order, seed.field_kind, seed.text_type,
    coalesce(seed.image_allowed_sources, '[]'::jsonb), coalesce(seed.image_prompt_text, '')
  from jsonb_to_recordset(
    '[
      {"component_key":"header","item_key":"logo","name":"Logo","is_required":true,"user_reorder_allowed":false,"sort_order":0,"field_kind":"image","image_allowed_sources":["file","url"]},
      {"component_key":"header","item_key":"badges","name":"Badges","is_required":false,"user_reorder_allowed":false,"sort_order":10,"field_kind":"image","image_allowed_sources":["file","url"]},
      {"component_key":"heroBanner","item_key":"leadText","name":"Lead Text","is_required":false,"user_reorder_allowed":true,"sort_order":0,"field_kind":"text","text_type":"remark"},
      {"component_key":"heroBanner","item_key":"title","name":"Title","is_required":true,"user_reorder_allowed":true,"sort_order":10,"field_kind":"text","text_type":"title"},
      {"component_key":"heroBanner","item_key":"sublineText","name":"Subline Text","is_required":false,"user_reorder_allowed":true,"sort_order":20,"field_kind":"text","text_type":"multi"},
      {"component_key":"heroBanner","item_key":"button","name":"Button","is_required":false,"user_reorder_allowed":true,"sort_order":30,"field_kind":"cta"},
      {"component_key":"heroBanner","item_key":"alphaText","name":"Alpha Text","is_required":false,"user_reorder_allowed":true,"sort_order":40,"field_kind":"text","text_type":"remark"},
      {"component_key":"stepBar","item_key":"title","name":"Title","is_required":false,"user_reorder_allowed":true,"sort_order":0,"field_kind":"text","text_type":"title"},
      {"component_key":"stepBar","item_key":"description","name":"Description","is_required":false,"user_reorder_allowed":true,"sort_order":10,"field_kind":"text","text_type":"multi"},
      {"component_key":"stepBar","item_key":"ctaButton","name":"CTA Button","is_required":false,"user_reorder_allowed":true,"sort_order":20,"field_kind":"cta"},
      {"component_key":"contentCta","item_key":"title","name":"Title","is_required":false,"user_reorder_allowed":true,"sort_order":0,"field_kind":"text","text_type":"title"},
      {"component_key":"contentCta","item_key":"description","name":"Description","is_required":false,"user_reorder_allowed":true,"sort_order":10,"field_kind":"text","text_type":"multi"},
      {"component_key":"contentCta","item_key":"image","name":"Image","is_required":false,"user_reorder_allowed":true,"sort_order":20,"field_kind":"image","image_allowed_sources":["url","file","ai"],"image_prompt_text":"Generate a clean promotional content image without text, buttons, logos, or UI labels."},
      {"component_key":"contentCta","item_key":"button","name":"Button","is_required":false,"user_reorder_allowed":true,"sort_order":30,"field_kind":"cta"},
      {"component_key":"imageTextRow","item_key":"image","name":"Image","is_required":false,"user_reorder_allowed":true,"sort_order":0,"field_kind":"image","image_allowed_sources":["url","file","ai"],"image_prompt_text":"Generate a clean supporting promotional image without text, buttons, logos, or UI labels."},
      {"component_key":"imageTextRow","item_key":"title","name":"Title","is_required":false,"user_reorder_allowed":true,"sort_order":10,"field_kind":"text","text_type":"title"},
      {"component_key":"imageTextRow","item_key":"description","name":"Description","is_required":false,"user_reorder_allowed":true,"sort_order":20,"field_kind":"text","text_type":"multi"},
      {"component_key":"titleDescription","item_key":"title","name":"Title","is_required":false,"user_reorder_allowed":true,"sort_order":0,"field_kind":"text","text_type":"title"},
      {"component_key":"titleDescription","item_key":"contents","name":"Contents","is_required":false,"user_reorder_allowed":true,"sort_order":10,"field_kind":"text","text_type":"multi"},
      {"component_key":"footer","item_key":"logo","name":"Logo","is_required":true,"user_reorder_allowed":false,"sort_order":0,"field_kind":"image","image_allowed_sources":["file","url"]},
      {"component_key":"footer","item_key":"licenseBadges","name":"License Badges","is_required":false,"user_reorder_allowed":false,"sort_order":10,"field_kind":"image","image_allowed_sources":["file","url"]},
      {"component_key":"footer","item_key":"content","name":"Content","is_required":true,"user_reorder_allowed":false,"sort_order":20,"field_kind":"text","text_type":"multi"}
    ]'::jsonb
  ) as seed(
    component_key text, item_key text, name text, is_required boolean,
    user_reorder_allowed boolean, sort_order integer, field_kind text,
    text_type text, image_allowed_sources jsonb, image_prompt_text text
  )
  join wizard_section_components component on component.component_key = seed.component_key
  join wizard_content_sections section
    on section.component_id = component.id and section.status = 'active';

  insert into wizard_form_templates (
    template_key, name, description, status, version, is_default, change_note
  ) values (
    'default-v2', 'Default Promotion Template',
    'Default template composed from shared section components.',
    'active', 1, true, 'Created by shared component seed 003.'
  ) returning id into v_template_id;

  insert into wizard_form_template_sections (
    form_template_id, component_id, section_id, section_key, sort_order,
    is_required, is_visible, order_change_allowed, user_reorder_allowed, fixed_position
  )
  select
    v_template_id, component.id, null, seed.component_key, seed.sort_order,
    seed.is_required, true, true, seed.user_reorder_allowed, seed.fixed_position
  from jsonb_to_recordset(
    '[
      {"component_key":"header","sort_order":0,"is_required":false,"user_reorder_allowed":false,"fixed_position":"top"},
      {"component_key":"heroBanner","sort_order":10,"is_required":true,"user_reorder_allowed":true},
      {"component_key":"stepBar","sort_order":20,"is_required":false,"user_reorder_allowed":true},
      {"component_key":"contentCta","sort_order":30,"is_required":false,"user_reorder_allowed":true},
      {"component_key":"imageTextRow","sort_order":40,"is_required":false,"user_reorder_allowed":true},
      {"component_key":"titleDescription","sort_order":50,"is_required":false,"user_reorder_allowed":true},
      {"component_key":"footer","sort_order":60,"is_required":false,"user_reorder_allowed":false,"fixed_position":"bottom"}
    ]'::jsonb
  ) as seed(
    component_key text, sort_order integer, is_required boolean,
    user_reorder_allowed boolean, fixed_position text
  )
  join wizard_section_components component on component.component_key = seed.component_key;

  insert into wizard_form_template_layouts (
    form_template_id, renderer_key, renderer_version, contract_version,
    layout_revision, layout_spec, validation_result, change_note
  ) values (
    v_template_id, 'default-promo-renderer', 1, 1, 1,
    '{
      "contractVersion":1,
      "specKey":"shared-component-default",
      "theme":{"backgroundColor":"#f5f7fb","backgroundImage":"","backgroundImageName":"","textColor":"#172033","accentColor":"#156b5b","fontFamily":"Inter, Pretendard, sans-serif"},
      "responsive":{"contentMaxWidth":1440,"contentMinWidth":1140,"mobileBreakpoint":720},
      "itemStyles":{},
      "sectionStyles":{}
    }'::jsonb,
    '{"ok":true,"errors":[],"warnings":[]}'::jsonb,
    'Default shared-component layout created by seed 003.'
  );
end $$;
