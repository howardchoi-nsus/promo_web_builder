update public.wizard_content_sections
set ai_design = coalesce(ai_design, '{}'::jsonb) || jsonb_build_object(
    'allowSectionBackground', true,
    'imageTarget', 'section-background',
    'imageTargetItemKeys', '[]'::jsonb
  ),
  updated_at = now()
where section_key = 'registryHero'
  and version = 1
  and status = 'active';

delete from public.wizard_content_section_component_instances instance
using public.wizard_content_sections section
where instance.section_id = section.id
  and section.section_key = 'registryHero'
  and section.version = 1
  and instance.item_key = 'visual';

update public.wizard_content_section_layouts layout
set name = 'Hero Key Visual',
  description = 'Concise copy over a Section-level Hero key visual.',
  layout_snapshot = jsonb_set(
    layout.layout_snapshot
      #- '{content,visual}'
      #- '{viewports,desktop,items,visual}'
      #- '{viewports,mobile,items,visual}',
    '{viewports,mobile,items,primaryAction,yPx}',
    '300'::jsonb,
    false
  ),
  updated_at = now()
from public.wizard_content_sections section
where layout.section_id = section.id
  and section.section_key = 'registryHero'
  and section.version = 1
  and layout.layout_key = 'hero_centered';
