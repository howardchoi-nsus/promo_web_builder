-- Preview/Production operator script. Review the counts before running the
-- DELETE transaction. Generated promo snapshots, LO-FI/final designs, locale
-- messages, user uploads and applied snapshot-referenced assets are excluded.
select
  (select count(*) from wizard_form_templates) as legacy_templates,
  (select count(*) from wizard_content_sections) as legacy_sections,
  (select count(*) from wizard_content_section_items) as legacy_direct_items,
  (select count(*) from promo_section_design_runs) as legacy_section_ai_runs;

begin;
delete from promo_section_design_runs;
delete from wizard_form_templates;
delete from wizard_content_sections;
commit;

-- Run 004_seed_item_components_design_tokens_and_default_template.sql next.
