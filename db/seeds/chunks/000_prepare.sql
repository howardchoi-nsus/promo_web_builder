-- Run this once before the chunk files.
create extension if not exists pgcrypto;

alter table design_documents
  add column if not exists raw_markdown text;

create unique index if not exists design_documents_brand_filename_uidx
  on design_documents (brand_id, original_filename);
