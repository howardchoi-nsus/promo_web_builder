select
  (select count(*) from brands where category = 'design-reference') as seeded_brands,
  (select count(*) from design_documents where source_type = 'markdown_seed') as seeded_documents,
  (select count(*) from design_sections) as total_sections,
  (select count(*) from design_tokens) as total_tokens;
