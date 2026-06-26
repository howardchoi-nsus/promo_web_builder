alter table design_documents
add column if not exists style_classification_json jsonb;
