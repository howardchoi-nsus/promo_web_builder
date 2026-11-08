begin;

create table if not exists public.promo_layout_reference_component_links (
  id uuid primary key default gen_random_uuid(),
  layout_reference_id uuid not null references public.promo_layout_references(id) on delete restrict,
  component_id uuid not null references public.wizard_item_components(id) on delete restrict,
  component_version_id uuid references public.wizard_item_component_versions(id) on delete restrict,
  relationship text not null check (relationship in ('derived', 'inspired', 'validated')),
  evidence jsonb not null default '{}'::jsonb,
  created_by text not null,
  created_at timestamptz not null default now(),
  constraint promo_layout_reference_component_links_evidence_chk
    check (jsonb_typeof(evidence) = 'object'),
  unique (layout_reference_id, component_id, relationship)
);

create index if not exists promo_layout_reference_component_links_component_idx
  on public.promo_layout_reference_component_links(component_id, created_at desc);

create index if not exists promo_layout_reference_component_links_reference_idx
  on public.promo_layout_reference_component_links(layout_reference_id, created_at desc);

create table if not exists public.reference_component_publish_operations (
  id uuid primary key default gen_random_uuid(),
  idempotency_key text not null unique,
  request_hash text not null check (request_hash ~ '^[a-f0-9]{64}$'),
  status text not null check (status in ('completed', 'failed')),
  plan_snapshot jsonb not null,
  result_snapshot jsonb not null,
  change_note text not null,
  created_by text not null,
  created_at timestamptz not null default now(),
  completed_at timestamptz,
  constraint reference_component_publish_operations_plan_chk
    check (jsonb_typeof(plan_snapshot) = 'object'),
  constraint reference_component_publish_operations_result_chk
    check (jsonb_typeof(result_snapshot) = 'object')
);

create index if not exists reference_component_publish_operations_created_idx
  on public.reference_component_publish_operations(created_at desc);

-- Some installations received the reference component drafts before the
-- Registry role expansion. Keep this migration self-contained so the new
-- Sections cannot fail halfway on the older role constraint.
alter table public.wizard_content_sections
  drop constraint if exists wizard_content_sections_section_role_chk;
alter table public.wizard_content_sections
  add constraint wizard_content_sections_section_role_chk
  check (section_role in (
    'header', 'footer', 'terms', 'legal', 'responsible-gaming',
    'hero', 'benefit', 'content', 'cta', 'notice', 'offer', 'trust'
  ));

-- Composition Shell versions are immutable. Publish a successor only when an
-- active Shell does not yet allow every role used by the reference Sections.
with active_versions as (
  select version.*,
    (
      select coalesce(jsonb_agg(role order by role), '[]'::jsonb)
      from (
        select distinct role
        from (
          select jsonb_array_elements_text(
            coalesce(version.config_json->'allowedSectionRoles', '[]'::jsonb)
          ) role
          union all select unnest(array['offer','content','trust','notice'])
        ) role_candidates
      ) normalized_roles
    ) as allowed_roles,
    (
      select coalesce(max(candidate.version), 0) + 1
      from public.promo_composition_shell_versions candidate
      where candidate.shell_id = version.shell_id
    ) as next_version
  from public.promo_composition_shell_versions version
  join public.promo_composition_shells shell
    on shell.id = version.shell_id and shell.status = 'active'
  where version.status = 'active'
), inserted_versions as (
  insert into public.promo_composition_shell_versions (
    shell_id, version, status, config_json, fallback_template_id,
    fallback_template_version, change_note
  )
  select active.shell_id, active.next_version, 'draft',
    jsonb_set(active.config_json, '{allowedSectionRoles}', active.allowed_roles, true),
    active.fallback_template_id, active.fallback_template_version,
    'Migration 081: reference component Section roles enabled.'
  from active_versions active
  where not coalesce(active.config_json->'allowedSectionRoles', '[]'::jsonb) @> active.allowed_roles
    and not exists (
      select 1 from public.promo_composition_shell_versions draft
      where draft.shell_id = active.shell_id and draft.status = 'draft'
    )
  returning id
)
select public.activate_promo_composition_shell_version(
  inserted.id,
  'Migration 081: reference component Section roles enabled.'
)
from inserted_versions inserted;

-- Publish immutable version 2 RenderSpecs. Version 1 remains available for
-- rollback but is not mutated, so previously stored snapshots stay valid.
insert into public.wizard_item_component_versions (
  component_id, version, status, field_kind, text_type, editor_schema,
  default_value, capabilities, image_policy, cta_policy, style_slots,
  placement_policy, change_note, render_contract_version, render_tree,
  render_responsive, render_accessibility, render_validation
)
select component.id, 2, 'draft', source.field_kind, source.text_type,
  source.editor_schema, source.default_value, source.capabilities,
  source.image_policy, source.cta_policy, source.style_slots,
  source.placement_policy,
  'Migration 081: validated RenderSpec and Registry publishing preparation.',
  1, spec.render_tree::jsonb, spec.render_responsive::jsonb, '{}'::jsonb,
  jsonb_build_object(
    'ok', true,
    'contractVersion', 1,
    'hash', spec.render_hash,
    'source', 'migration-081',
    'reviewed', true
  )
from public.wizard_item_components component
join public.wizard_item_component_versions source
  on source.component_id = component.id and source.version = 1
join (values
  (
    'ref-pattern-offer-value-breakdown',
    '{"nodeType":"element","tag":"article","semanticRole":"offer-summary","layout":{"display":"grid","columns":1,"width":"100%","positionMode":"flow"},"children":[{"nodeType":"field","tag":"small","fieldKey":"fld_a1000000000000000000000000000001"},{"nodeType":"field","tag":"h2","fieldKey":"fld_a1000000000000000000000000000002"},{"nodeType":"field","tag":"p","fieldKey":"fld_a1000000000000000000000000000003"},{"nodeType":"field","tag":"strong","fieldKey":"fld_a1000000000000000000000000000004"},{"nodeType":"field","tag":"a","fieldKey":"fld_a1000000000000000000000000000005","attributes":{"target":"_self"}}]}',
    '{}',
    '14aaf80704ef4846bfabc54f821138bde7147c23cf3ba99e949993142dc7a8c3'
  ),
  (
    'ref-pattern-promotion-steps',
    '{"nodeType":"element","tag":"article","semanticRole":"promotion-step","layout":{"display":"grid","columns":1,"width":"100%","positionMode":"flow"},"children":[{"nodeType":"field","tag":"strong","fieldKey":"fld_a2000000000000000000000000000001"},{"nodeType":"field","tag":"h3","fieldKey":"fld_a2000000000000000000000000000002"},{"nodeType":"field","tag":"p","fieldKey":"fld_a2000000000000000000000000000003"},{"nodeType":"field","tag":"img","fieldKey":"fld_a2000000000000000000000000000004","attributes":{"alt":""}}]}',
    '{}',
    '5448cec1159efc3b129f46a4a0983dbe395456b38cb5324c8f49b41b7d3f4906'
  ),
  (
    'ref-pattern-trust-proof-grid',
    '{"nodeType":"element","tag":"article","semanticRole":"trust-proof","layout":{"display":"grid","columns":1,"width":"100%","positionMode":"flow"},"children":[{"nodeType":"field","tag":"img","fieldKey":"fld_a3000000000000000000000000000001","attributes":{"alt":""}},{"nodeType":"field","tag":"h3","fieldKey":"fld_a3000000000000000000000000000002"},{"nodeType":"field","tag":"p","fieldKey":"fld_a3000000000000000000000000000003"},{"nodeType":"field","tag":"strong","fieldKey":"fld_a3000000000000000000000000000004"}]}',
    '{}',
    '261513a6174141edbc599c6c62c9bfb13b3bd175e01f28c6c36a896a57f5af56'
  ),
  (
    'ref-pattern-metric-strip',
    '{"nodeType":"element","tag":"article","semanticRole":"metric","layout":{"display":"grid","columns":1,"width":"100%","positionMode":"flow"},"children":[{"nodeType":"field","tag":"strong","fieldKey":"fld_a4000000000000000000000000000001"},{"nodeType":"field","tag":"p","fieldKey":"fld_a4000000000000000000000000000002"},{"nodeType":"field","tag":"small","fieldKey":"fld_a4000000000000000000000000000003"}]}',
    '{}',
    '9bb66f6cca17aed4f7822ab46c36ce19977887aeb5c1061ca97007dfcc5ac0eb'
  ),
  (
    'ref-pattern-feature-split',
    '{"nodeType":"element","tag":"article","semanticRole":"feature-split","layout":{"display":"grid","columns":2,"width":"100%","positionMode":"flow"},"children":[{"nodeType":"element","tag":"div","children":[{"nodeType":"field","tag":"small","fieldKey":"fld_a5000000000000000000000000000001"},{"nodeType":"field","tag":"h2","fieldKey":"fld_a5000000000000000000000000000002"},{"nodeType":"field","tag":"p","fieldKey":"fld_a5000000000000000000000000000003"},{"nodeType":"field","tag":"a","fieldKey":"fld_a5000000000000000000000000000005","attributes":{"target":"_self"}}]},{"nodeType":"field","tag":"img","fieldKey":"fld_a5000000000000000000000000000004","attributes":{"alt":""}}]}',
    '{"mobile":{"root.layout.columns":1}}',
    '9d950cd9171fed61e6fe2258d7ebbc0c27bc94654e1a46678a3e24436233ab5c'
  ),
  (
    'ref-pattern-faq-accordion',
    '{"nodeType":"element","tag":"article","semanticRole":"faq-item","layout":{"display":"grid","columns":1,"width":"100%","positionMode":"flow"},"children":[{"nodeType":"field","tag":"h3","fieldKey":"fld_a6000000000000000000000000000001"},{"nodeType":"field","tag":"p","fieldKey":"fld_a6000000000000000000000000000002"}]}',
    '{}',
    'a2d46924cac2a8191ae221c80be92260cb69dcde4c6d172a0b009582e674cee4'
  )
) as spec(system_seed_code, render_tree, render_responsive, render_hash)
  on spec.system_seed_code = component.system_seed_code
where not exists (
  select 1 from public.wizard_item_component_versions existing
  where existing.component_id = component.id and existing.version = 2
);

insert into public.wizard_item_component_version_fields (
  component_version_id, field_key, name, field_kind, text_type, sort_order,
  is_required, is_locked, default_value, editor_schema, capabilities,
  image_policy, cta_policy, style_slots
)
select target.id, source.field_key, source.name, source.field_kind,
  source.text_type, source.sort_order, source.is_required, source.is_locked,
  source.default_value, source.editor_schema, source.capabilities,
  source.image_policy, source.cta_policy, source.style_slots
from public.wizard_item_components component
join public.wizard_item_component_versions original
  on original.component_id = component.id and original.version = 1
join public.wizard_item_component_versions target
  on target.component_id = component.id and target.version = 2
join public.wizard_item_component_version_fields source
  on source.component_version_id = original.id
where component.system_seed_code like 'ref-pattern-%'
on conflict (component_version_id, field_key) do nothing;

update public.wizard_item_component_versions version
set status = 'inactive', updated_at = now()
from public.wizard_item_components component
where version.component_id = component.id
  and component.system_seed_code like 'ref-pattern-%'
  and version.version <> 2
  and version.status = 'active';

update public.wizard_item_component_versions version
set status = 'active', updated_at = now()
from public.wizard_item_components component
where version.component_id = component.id
  and component.system_seed_code like 'ref-pattern-%'
  and version.version = 2
  and version.status <> 'active';

insert into public.wizard_content_sections (
  section_key, name, description, is_required, order_change_allowed,
  fixed_position, sort_order, is_visible_in_wizard, status, version,
  change_note, owner_form_template_id, ai_design, composition_scope,
  section_role, composition_policy
)
select seed.section_key, seed.name, seed.description, false, true, null,
  seed.sort_order, true, 'active', 1,
  'Migration 081: reference component Registry publishing.', null,
  jsonb_build_object(
    'enabled', true,
    'allowedLayoutVariants', jsonb_build_array(seed.layout_key),
    'allowSectionBackground', true,
    'imageTarget', 'item',
    'imageTargetItemKeys', seed.image_item_keys::jsonb
  ),
  'registry', seed.section_role,
  jsonb_build_object(
    'selectionPolicy', 'optional',
    'allowedMarkets', '[]'::jsonb,
    -- Purpose tags belong to layout ranking metadata. Restricting the Section
    -- here would compare internal taxonomy labels with free-form user input and
    -- make otherwise valid reference Sections disappear from the candidate set.
    'allowedPromotionPurposes', '[]'::jsonb,
    'aiEditable', true,
    'contentLocked', false,
    'layoutLocked', false,
    'duplicatePolicy', 'forbidden',
    'maxInstances', 1,
    'allowedLayoutVariants', jsonb_build_array(seed.layout_key),
    'allowedMotionPresets', '[]'::jsonb
  )
from (values
  ('registryReferenceOfferValue','Reference Offer Value','Conversion-focused offer value summary.',25,'offer','offer_value_default','[]','["offer","conversion"]'),
  ('registryReferencePromotionSteps','Reference Promotion Steps','Numbered promotion participation steps.',35,'content','promotion_steps_grid','["steps"]','["participation","onboarding"]'),
  ('registryReferenceTrustProof','Reference Trust Proof','Evidence and trust proof card grid.',52,'trust','trust_proof_grid','["proofs"]','["trust","proof"]'),
  ('registryReferenceMetricStrip','Reference Metric Strip','Compact campaign metric band.',54,'trust','metric_strip_default','[]','["trust","metrics"]'),
  ('registryReferenceFeatureSplit','Reference Feature Split','Editorial copy and media feature split.',42,'content','feature_split_default','["feature"]','["story","feature","product"]'),
  ('registryReferenceFaq','Reference FAQ','Promotion question and answer list.',82,'notice','faq_stack_default','[]','["faq","support","rules"]')
) as seed(section_key, name, description, sort_order, section_role, layout_key, image_item_keys, purpose_tags)
where not exists (
  select 1 from public.wizard_content_sections existing
  where existing.section_key = seed.section_key and existing.version = 1
);

insert into public.wizard_content_section_component_instances (
  section_id, component_version_id, item_key, display_name,
  is_visible_in_wizard, is_required, user_reorder_allowed,
  sort_order, is_locked, locked_value, instance_config
)
select section.id, version.id, seed.item_key, seed.display_name,
  true, true, true, 10, false, null, seed.instance_config::jsonb
from (values
  ('registryReferenceOfferValue','ref-pattern-offer-value-breakdown','offer','Offer Value','{"description":"Offer summary with value and action."}'),
  ('registryReferencePromotionSteps','ref-pattern-promotion-steps','steps','Promotion Steps','{"description":"Repeatable participation steps.","collection":{"enabled":true,"minItems":2,"maxItems":6,"layout":"grid","desktopColumns":4,"mobileColumns":1,"gapPx":16}}'),
  ('registryReferenceTrustProof','ref-pattern-trust-proof-grid','proofs','Trust Proofs','{"description":"Repeatable trust evidence cards.","collection":{"enabled":true,"minItems":2,"maxItems":6,"layout":"grid","desktopColumns":3,"mobileColumns":1,"gapPx":16}}'),
  ('registryReferenceMetricStrip','ref-pattern-metric-strip','metrics','Metrics','{"description":"Repeatable campaign metrics.","collection":{"enabled":true,"minItems":2,"maxItems":5,"layout":"grid","desktopColumns":4,"mobileColumns":2,"gapPx":12}}'),
  ('registryReferenceFeatureSplit','ref-pattern-feature-split','feature','Feature Story','{"description":"Editorial feature story with media."}'),
  ('registryReferenceFaq','ref-pattern-faq-accordion','faq','FAQ','{"description":"Repeatable promotion questions.","collection":{"enabled":true,"minItems":2,"maxItems":12,"layout":"stack","desktopColumns":1,"mobileColumns":1,"gapPx":8}}')
) as seed(section_key, system_seed_code, item_key, display_name, instance_config)
join public.wizard_content_sections section
  on section.section_key = seed.section_key and section.version = 1 and section.status = 'active'
join public.wizard_item_components component
  on component.system_seed_code = seed.system_seed_code
join public.wizard_item_component_versions version
  on version.component_id = component.id and version.version = 2 and version.status = 'active'
on conflict (section_id, item_key) do update set
  component_version_id = excluded.component_version_id,
  display_name = excluded.display_name,
  is_visible_in_wizard = true,
  instance_config = excluded.instance_config,
  updated_at = now();

insert into public.wizard_content_section_layouts as existing (
  section_id, layout_key, name, description, is_default,
  layout_snapshot, selection_metadata, change_note
)
select section.id, seed.layout_key, seed.name, seed.description, true,
  seed.layout_snapshot::jsonb, seed.selection_metadata::jsonb,
  'Migration 081: reference component Registry publishing.'
from public.wizard_content_sections section
join (values
  ('registryReferenceOfferValue','offer_value_default','Offer Value Default','Centered conversion offer.',
    '{"contractVersion":1,"layoutMode":"free","sectionStyle":{"minHeight":520},"viewports":{"desktop":{"items":{"offer":{"positionMode":"free","xPct":8,"yPx":64,"widthPct":84,"heightPx":392,"textAlign":"center"}}},"mobile":{"items":{"offer":{"positionMode":"free","xPct":5,"yPx":42,"widthPct":90,"heightPx":430,"textAlign":"center"}}}}}',
    '{"alignment":"center","density":"spacious","widthProfile":"wide","archetype":"conversion-offer","ctaProminence":"high","contentComplexity":"medium","purposeTags":["offer","conversion"]}'),
  ('registryReferencePromotionSteps','promotion_steps_grid','Promotion Steps Grid','Responsive participation step grid.',
    '{"contractVersion":1,"layoutMode":"free","sectionStyle":{"minHeight":560},"collectionLayouts":{"steps":{"desktopColumns":4,"mobileColumns":1,"gapPx":16}},"viewports":{"desktop":{"items":{"steps":{"positionMode":"free","xPct":6,"yPx":70,"widthPct":88,"heightPx":420}}},"mobile":{"items":{"steps":{"positionMode":"free","xPct":5,"yPx":42,"widthPct":90,"heightPx":650}}}}}',
    '{"alignment":"left","density":"standard","widthProfile":"full","archetype":"steps-grid","contentComplexity":"high","purposeTags":["participation","onboarding"]}'),
  ('registryReferenceTrustProof','trust_proof_grid','Trust Proof Grid','Three-column trust proof grid.',
    '{"contractVersion":1,"layoutMode":"free","sectionStyle":{"minHeight":520},"collectionLayouts":{"proofs":{"desktopColumns":3,"mobileColumns":1,"gapPx":16}},"viewports":{"desktop":{"items":{"proofs":{"positionMode":"free","xPct":7,"yPx":70,"widthPct":86,"heightPx":380}}},"mobile":{"items":{"proofs":{"positionMode":"free","xPct":5,"yPx":42,"widthPct":90,"heightPx":620}}}}}',
    '{"alignment":"center","density":"standard","widthProfile":"wide","archetype":"proof-grid","contentComplexity":"high","purposeTags":["trust","proof"]}'),
  ('registryReferenceMetricStrip','metric_strip_default','Metric Strip','Compact multi-column metric band.',
    '{"contractVersion":1,"layoutMode":"free","sectionStyle":{"minHeight":300},"collectionLayouts":{"metrics":{"desktopColumns":4,"mobileColumns":2,"gapPx":12}},"viewports":{"desktop":{"items":{"metrics":{"positionMode":"free","xPct":5,"yPx":55,"widthPct":90,"heightPx":190}}},"mobile":{"items":{"metrics":{"positionMode":"free","xPct":5,"yPx":36,"widthPct":90,"heightPx":230}}}}}',
    '{"alignment":"center","density":"compact","widthProfile":"full","archetype":"metric-band","contentComplexity":"medium","purposeTags":["trust","metrics"]}'),
  ('registryReferenceFeatureSplit','feature_split_default','Feature Split','Editorial copy and media split.',
    '{"contractVersion":1,"layoutMode":"free","sectionStyle":{"minHeight":640},"viewports":{"desktop":{"items":{"feature":{"positionMode":"free","xPct":5,"yPx":58,"widthPct":90,"heightPx":524}}},"mobile":{"items":{"feature":{"positionMode":"free","xPct":5,"yPx":38,"widthPct":90,"heightPx":690}}}}}',
    '{"alignment":"left","density":"spacious","widthProfile":"wide","archetype":"media-led","visualEmphasis":"high","mobileStrategy":"media-after-copy","contentComplexity":"high","purposeTags":["story","feature","product"]}'),
  ('registryReferenceFaq','faq_stack_default','FAQ Stack','Single-column promotion FAQ.',
    '{"contractVersion":1,"layoutMode":"free","sectionStyle":{"minHeight":620},"collectionLayouts":{"faq":{"desktopColumns":1,"mobileColumns":1,"gapPx":8}},"viewports":{"desktop":{"items":{"faq":{"positionMode":"free","xPct":12,"yPx":62,"widthPct":76,"heightPx":500}}},"mobile":{"items":{"faq":{"positionMode":"free","xPct":5,"yPx":38,"widthPct":90,"heightPx":540}}}}}',
    '{"alignment":"left","density":"standard","widthProfile":"balanced","archetype":"faq-stack","contentComplexity":"high","purposeTags":["faq","support","rules"]}')
) as seed(section_key, layout_key, name, description, layout_snapshot, selection_metadata)
  on section.section_key = seed.section_key and section.version = 1 and section.status = 'active'
on conflict (section_id, layout_key) do update set
  description = excluded.description,
  layout_snapshot = excluded.layout_snapshot,
  selection_metadata = excluded.selection_metadata,
  updated_at = now();

commit;
