-- Read-path indexes for deterministic Registry candidate resolution.

create index if not exists wizard_content_sections_registry_candidates_idx
  on wizard_content_sections(composition_scope, status, section_role, sort_order, section_key)
  where status = 'active' and composition_scope in ('registry', 'shared');

create index if not exists wizard_content_section_instances_candidate_idx
  on wizard_content_section_component_instances(section_id, is_visible_in_wizard, sort_order)
  where is_visible_in_wizard = true;
