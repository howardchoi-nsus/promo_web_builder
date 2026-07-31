-- Component Library presentation and placement policy (Contract v1)

alter table wizard_item_components
  add column if not exists library_presentation jsonb not null default '{}'::jsonb;

alter table wizard_item_component_versions
  add column if not exists placement_policy jsonb not null default '{}'::jsonb;

alter table wizard_item_components
  drop constraint if exists wizard_item_components_library_presentation_chk;
alter table wizard_item_components
  add constraint wizard_item_components_library_presentation_chk
  check (jsonb_typeof(library_presentation) = 'object');

alter table wizard_item_component_versions
  drop constraint if exists wizard_item_component_versions_placement_policy_chk;
alter table wizard_item_component_versions
  add constraint wizard_item_component_versions_placement_policy_chk
  check (jsonb_typeof(placement_policy) = 'object');

comment on column wizard_item_components.library_presentation is
  'Safe Component Library metadata: category, iconKey, keywords, displayOrder and isFeatured.';
comment on column wizard_item_component_versions.placement_policy is
  'Version-owned Section role limits, instance limits and desktop/mobile default geometry.';
