alter table design_documents
  add column if not exists design_concept_summary text,
  add column if not exists design_concept_json jsonb,
  add column if not exists design_prompt_context text,
  add column if not exists analyzed_at timestamptz,
  add column if not exists analysis_model text;
