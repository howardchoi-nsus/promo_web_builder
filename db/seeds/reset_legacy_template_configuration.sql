-- Operator-only reset for the legacy template/section configuration.
--
-- Run the preflight query first and confirm that a Neon backup branch or an
-- equivalent restore point exists.  Generated promotions, LO-FI/final design
-- results, user uploads, locale messages, item components and design token
-- sets are intentionally outside this reset.
select
  (select count(*) from wizard_form_templates) as legacy_templates,
  (select count(*) from wizard_content_sections) as legacy_sections,
  (select count(*) from wizard_content_section_items) as legacy_direct_items,
  (select count(*) from promo_section_design_runs) as legacy_section_ai_runs;

begin;

-- Active run rows must be removed before the template deletion guard runs.
delete from promo_section_design_runs;

-- Delete audited child rows while their referenced template and section rows
-- still exist.  Deleting templates first makes the audit triggers attempt to
-- insert foreign keys that no longer exist.
delete from wizard_form_template_sections;
delete from wizard_content_section_items;
delete from wizard_content_sections;
delete from wizard_form_templates;

commit;

select
  (select count(*) from wizard_form_templates) as remaining_templates,
  (select count(*) from wizard_content_sections) as remaining_sections,
  (select count(*) from wizard_content_section_items) as remaining_direct_items,
  (select count(*) from promo_section_design_runs) as remaining_section_ai_runs;

-- Run 004_seed_item_components_design_tokens_and_default_template.sql next.
