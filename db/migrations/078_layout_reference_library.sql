begin;

create extension if not exists pgcrypto;

create table if not exists promo_layout_references (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  source_site text not null default '',
  source_url text not null,
  preview_image_url text not null default '',
  status text not null default 'draft' check (status in ('draft', 'review', 'approved', 'archived')),
  page_type text not null default '',
  industry text not null default '',
  promotion_goal text not null default '',
  viewport text not null default 'responsive' check (viewport in ('desktop', 'mobile', 'responsive')),
  visual_styles jsonb not null default '[]'::jsonb,
  section_types jsonb not null default '[]'::jsonb,
  tags jsonb not null default '[]'::jsonb,
  design_summary text not null default '',
  strengths text not null default '',
  risks text not null default '',
  layout_spec jsonb not null default '{}'::jsonb,
  analysis_meta jsonb not null default '{}'::jsonb,
  quality_scores jsonb not null default '{}'::jsonb,
  quality_score numeric(4, 2) not null default 0 check (quality_score >= 0 and quality_score <= 5),
  copyright_reviewed boolean not null default false,
  research_only boolean not null default true,
  captured_at timestamptz,
  approved_at timestamptz,
  approved_by text,
  created_by text not null,
  updated_by text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table promo_layout_references
  add column if not exists analysis_meta jsonb not null default '{}'::jsonb;

create unique index if not exists promo_layout_references_source_viewport_idx
  on promo_layout_references(lower(source_url), viewport)
  where status <> 'archived';

create index if not exists promo_layout_references_discovery_idx
  on promo_layout_references(status, page_type, industry, quality_score desc, updated_at desc);

create table if not exists promo_layout_reference_histories (
  id uuid primary key default gen_random_uuid(),
  layout_reference_id uuid references promo_layout_references(id) on delete set null,
  action text not null,
  previous_status text,
  new_status text not null,
  snapshot jsonb not null default '{}'::jsonb,
  change_note text not null default '',
  changed_by text not null,
  changed_at timestamptz not null default now()
);

create index if not exists promo_layout_reference_histories_reference_idx
  on promo_layout_reference_histories(layout_reference_id, changed_at desc);

commit;
