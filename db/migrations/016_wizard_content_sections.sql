create extension if not exists pgcrypto;

-- Wizard Content Sections: admin-managed definition of the sections and
-- section items shown in Promo Wizard Step 2 (Content Input). Mirrors the
-- draft/active versioning pattern used by prompt_templates (010_prompt_templates.sql).
create table if not exists wizard_content_sections (
  id uuid primary key default gen_random_uuid(),
  section_key text not null,
  name text not null,
  description text not null default '',
  is_required boolean not null default false,
  order_change_allowed boolean not null default true,
  fixed_position text,
  sort_order integer not null default 0,
  is_visible_in_wizard boolean not null default true,
  status text not null default 'draft',
  version integer not null default 1,
  change_note text not null default '',
  archived_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint wizard_content_sections_status_chk
    check (status in ('draft', 'active', 'inactive', 'archived')),
  constraint wizard_content_sections_fixed_position_chk
    check (fixed_position is null or fixed_position in ('top', 'bottom')),
  constraint wizard_content_sections_key_version_uidx unique (section_key, version)
);

-- Only one active version per section_key at a time (same rule as prompt_templates).
create unique index if not exists wizard_content_sections_one_active_per_key_uidx
  on wizard_content_sections (section_key)
  where status = 'active';

create index if not exists wizard_content_sections_key_status_idx
  on wizard_content_sections (section_key, status);

create index if not exists wizard_content_sections_public_idx
  on wizard_content_sections (status, is_visible_in_wizard, sort_order)
  where status = 'active';

create table if not exists wizard_content_section_items (
  id uuid primary key default gen_random_uuid(),
  section_id uuid not null references wizard_content_sections (id) on delete cascade,
  item_key text not null,
  name text not null,
  is_visible_in_wizard boolean not null default true,
  is_required boolean not null default false,
  sort_order integer not null default 0,
  field_kind text not null,
  text_type text,
  image_allowed_sources jsonb not null default '[]'::jsonb,
  image_prompt_text text not null default '',
  image_alt_text_required boolean not null default false,
  image_aspect_ratio text,
  image_max_size_kb integer,
  cta_utm_source text,
  cta_utm_medium text,
  cta_utm_campaign text,
  cta_utm_content text,
  cta_utm_term text,
  is_locked boolean not null default false,
  locked_value jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint wizard_content_section_items_field_kind_chk
    check (field_kind in ('text', 'image', 'cta')),
  constraint wizard_content_section_items_text_type_chk
    check (text_type is null or text_type in ('title', 'remark', 'multi')),
  constraint wizard_content_section_items_max_size_chk
    check (image_max_size_kb is null or image_max_size_kb > 0),
  constraint wizard_content_section_items_section_key_uidx unique (section_id, item_key)
);

create index if not exists wizard_content_section_items_section_idx
  on wizard_content_section_items (section_id, sort_order);

create table if not exists wizard_content_section_histories (
  id uuid primary key default gen_random_uuid(),
  section_key text not null,
  section_id uuid references wizard_content_sections (id) on delete set null,
  previous_version integer not null default 0,
  new_version integer not null default 1,
  previous_status text not null default '',
  new_status text not null default '',
  change_note text not null default '',
  previous_state jsonb,
  new_state jsonb,
  changed_at timestamptz not null default now()
);

create index if not exists wizard_content_section_histories_key_idx
  on wizard_content_section_histories (section_key, changed_at desc);

comment on table wizard_content_sections is 'Admin-managed Wizard Step 2 content section definitions (draft/active versioned).';
comment on table wizard_content_section_items is 'Section items (fields) belonging to a specific wizard_content_sections version row.';
comment on table wizard_content_section_histories is 'Change history for wizard content section draft/activate/archive actions.';

-- Atomic lifecycle helpers. Keeping the multi-statement version transition in
-- PostgreSQL prevents a serverless request failure from leaving no active row
-- or a partially-cloned draft.
create or replace function clone_wizard_content_section_draft(
  p_source_id uuid,
  p_change_note text default 'Draft created from existing version.'
) returns uuid
language plpgsql
as $$
declare
  v_source wizard_content_sections%rowtype;
  v_new_id uuid;
  v_next_version integer;
begin
  select * into v_source
  from wizard_content_sections
  where id = p_source_id
  for update;

  if not found then raise exception 'Source section not found'; end if;
  perform pg_advisory_xact_lock(hashtext(v_source.section_key));

  if exists (
    select 1 from wizard_content_sections
    where section_key = v_source.section_key and status = 'draft'
  ) then
    raise exception 'A draft already exists for this section';
  end if;

  select coalesce(max(version), 0) + 1 into v_next_version
  from wizard_content_sections
  where section_key = v_source.section_key;

  insert into wizard_content_sections (
    section_key, name, description, is_required, order_change_allowed,
    fixed_position, sort_order, is_visible_in_wizard, status, version, change_note
  ) values (
    v_source.section_key, v_source.name, v_source.description, v_source.is_required,
    v_source.order_change_allowed, v_source.fixed_position, v_source.sort_order,
    v_source.is_visible_in_wizard, 'draft', v_next_version, p_change_note
  ) returning id into v_new_id;

  insert into wizard_content_section_items (
    section_id, item_key, name, is_visible_in_wizard, is_required, sort_order,
    field_kind, text_type, image_allowed_sources, image_prompt_text,
    image_alt_text_required, image_aspect_ratio, image_max_size_kb,
    cta_utm_source, cta_utm_medium, cta_utm_campaign, cta_utm_content, cta_utm_term,
    is_locked, locked_value
  )
  select
    v_new_id, item_key, name, is_visible_in_wizard, is_required, sort_order,
    field_kind, text_type, image_allowed_sources, image_prompt_text,
    image_alt_text_required, image_aspect_ratio, image_max_size_kb,
    cta_utm_source, cta_utm_medium, cta_utm_campaign, cta_utm_content, cta_utm_term,
    is_locked, locked_value
  from wizard_content_section_items
  where section_id = p_source_id;

  insert into wizard_content_section_histories (
    section_key, section_id, previous_version, new_version,
    previous_status, new_status, change_note
  ) values (
    v_source.section_key, v_new_id, v_source.version, v_next_version,
    v_source.status, 'draft', p_change_note
  );

  return v_new_id;
end $$;

create or replace function activate_wizard_content_section(
  p_target_id uuid,
  p_change_note text default 'Section activated.'
) returns uuid
language plpgsql
as $$
declare
  v_target wizard_content_sections%rowtype;
begin
  select * into v_target
  from wizard_content_sections
  where id = p_target_id
  for update;

  if not found then raise exception 'Section not found'; end if;
  perform pg_advisory_xact_lock(hashtext(v_target.section_key));
  if v_target.status = 'archived' then raise exception 'Archived sections cannot be activated'; end if;
  if v_target.status = 'active' then raise exception 'Section is already active'; end if;

  insert into wizard_content_section_histories (
    section_key, section_id, previous_version, new_version,
    previous_status, new_status, change_note
  )
  select
    section_key, id, version, version, status, 'inactive',
    'Superseded by section version ' || v_target.version || '.'
  from wizard_content_sections
  where section_key = v_target.section_key and status = 'active' and id <> p_target_id;

  update wizard_content_sections
  set status = 'inactive', updated_at = now()
  where section_key = v_target.section_key and status = 'active' and id <> p_target_id;

  update wizard_content_sections
  set status = 'active', change_note = p_change_note, archived_at = null, updated_at = now()
  where id = p_target_id;

  insert into wizard_content_section_histories (
    section_key, section_id, previous_version, new_version,
    previous_status, new_status, change_note
  ) values (
    v_target.section_key, p_target_id, v_target.version, v_target.version,
    v_target.status, 'active', p_change_note
  );

  return p_target_id;
end $$;

-- Seed: migrate the existing Template 4 hardcoded structure
-- (see prototype/promo-wizard.js defaultSectionInputs(), docs/default-temp-b-section-schema.json)
-- as version 1 / status active, so Wizard behavior is unchanged until an admin
-- publishes a new draft.
do $$
declare
  v_header uuid;
  v_hero uuid;
  v_step uuid;
  v_content uuid;
  v_image_row uuid;
  v_title_desc uuid;
  v_footer uuid;
begin
  if exists (select 1 from wizard_content_sections where section_key = 'header') then
    return;
  end if;

  insert into wizard_content_sections
    (section_key, name, description, is_required, order_change_allowed, fixed_position, sort_order, is_visible_in_wizard, status, version)
  values
    ('header', 'Header', '상단 로고와 배지 영역. 브랜드 식별과 신뢰 요소를 제공한다.', false, false, 'top', 0, true, 'active', 1)
  returning id into v_header;

  -- Kept as text (not image) to match the wizard's existing logoText/badgeText
  -- behavior; contentCta/imageTextRow below use real "image" fields since those
  -- are actual promo photo content, not short brand labels.
  insert into wizard_content_section_items
    (section_id, item_key, name, is_required, sort_order, field_kind, text_type)
  values
    (v_header, 'logo', 'Logo', true, 0, 'text', 'remark'),
    (v_header, 'badges', 'Badges', true, 10, 'text', 'remark');

  insert into wizard_content_sections
    (section_key, name, description, is_required, order_change_allowed, fixed_position, sort_order, is_visible_in_wizard, status, version)
  values
    ('heroBanner', 'Hero Banner', '프로모션 메인 배너 영역. 핵심 제목, 부제목, CTA, 보조 안내문을 구성한다.', true, true, null, 10, true, 'active', 1)
  returning id into v_hero;

  insert into wizard_content_section_items
    (section_id, item_key, name, is_required, sort_order, field_kind, text_type)
  values
    (v_hero, 'leadText', 'Lead Text', false, 0, 'text', 'remark'),
    (v_hero, 'title', 'Title', true, 10, 'text', 'title'),
    (v_hero, 'sublineText', 'Subline Text', false, 20, 'text', 'remark'),
    (v_hero, 'alphaText', 'Alpha Text', false, 40, 'text', 'remark');
  insert into wizard_content_section_items
    (section_id, item_key, name, is_required, sort_order, field_kind)
  values
    (v_hero, 'button', 'Button', false, 30, 'cta');

  insert into wizard_content_sections
    (section_key, name, description, is_required, order_change_allowed, fixed_position, sort_order, is_visible_in_wizard, status, version)
  values
    ('stepBar', 'Step Bar', '기본 3단계 또는 N개 단계로 구성할 수 있는 참여 흐름 영역.', false, true, null, 20, true, 'active', 1)
  returning id into v_step;

  insert into wizard_content_section_items
    (section_id, item_key, name, is_required, sort_order, field_kind, text_type)
  values
    (v_step, 'title', 'Title', false, 0, 'text', 'title'),
    (v_step, 'description', 'Description', false, 10, 'text', 'multi');
  insert into wizard_content_section_items
    (section_id, item_key, name, is_required, sort_order, field_kind)
  values
    (v_step, 'ctaButton', 'CTA Button', false, 20, 'cta');

  insert into wizard_content_sections
    (section_key, name, description, is_required, order_change_allowed, fixed_position, sort_order, is_visible_in_wizard, status, version)
  values
    ('contentCta', 'Content CTA', '프로모션에 필요한 콘텐츠를 이미지, 텍스트, CTA 버튼으로 자유롭게 구성하는 영역.', false, true, null, 30, true, 'active', 1)
  returning id into v_content;

  insert into wizard_content_section_items
    (section_id, item_key, name, is_required, sort_order, field_kind, text_type)
  values
    (v_content, 'title', 'Title', false, 0, 'text', 'title'),
    (v_content, 'description', 'Description', false, 10, 'text', 'multi');
  insert into wizard_content_section_items
    (section_id, item_key, name, is_required, sort_order, field_kind, image_allowed_sources, image_prompt_text)
  values
    (v_content, 'image', 'Image', false, 20, 'image', '["url","ai"]'::jsonb, 'Generate a clean promotional content image without text, buttons, logos, or UI labels.');
  insert into wizard_content_section_items
    (section_id, item_key, name, is_required, sort_order, field_kind)
  values
    (v_content, 'button', 'Button', false, 30, 'cta');

  insert into wizard_content_sections
    (section_key, name, description, is_required, order_change_allowed, fixed_position, sort_order, is_visible_in_wizard, status, version)
  values
    ('imageTextRow', 'Image Text Row', '이미지, 제목, 설명으로 구성된 카드형 반복 콘텐츠 영역.', false, true, null, 40, true, 'active', 1)
  returning id into v_image_row;

  insert into wizard_content_section_items
    (section_id, item_key, name, is_required, sort_order, field_kind, image_allowed_sources, image_prompt_text)
  values
    (v_image_row, 'image', 'Image', false, 0, 'image', '["url","ai"]'::jsonb, 'Generate a clean supporting promotional image without text, buttons, logos, or UI labels.');
  insert into wizard_content_section_items
    (section_id, item_key, name, is_required, sort_order, field_kind, text_type)
  values
    (v_image_row, 'title', 'Title', false, 10, 'text', 'title'),
    (v_image_row, 'description', 'Description', false, 20, 'text', 'multi');

  insert into wizard_content_sections
    (section_key, name, description, is_required, order_change_allowed, fixed_position, sort_order, is_visible_in_wizard, status, version)
  values
    ('titleDescription', 'Title and Description', '약관, 주의사항, 추가 텍스트 콘텐츠 영역.', false, true, null, 50, true, 'active', 1)
  returning id into v_title_desc;

  insert into wizard_content_section_items
    (section_id, item_key, name, is_required, sort_order, field_kind, text_type)
  values
    (v_title_desc, 'title', 'Title', false, 0, 'text', 'title'),
    (v_title_desc, 'contents', 'Contents', false, 10, 'text', 'multi');

  insert into wizard_content_sections
    (section_key, name, description, is_required, order_change_allowed, fixed_position, sort_order, is_visible_in_wizard, status, version)
  values
    ('footer', 'Footer', '하단 로고, 라이선스 배지, 법적 고지 영역.', false, false, 'bottom', 60, true, 'active', 1)
  returning id into v_footer;

  insert into wizard_content_section_items
    (section_id, item_key, name, is_required, sort_order, field_kind, text_type)
  values
    (v_footer, 'logo', 'Logo', true, 0, 'text', 'remark'),
    (v_footer, 'licenseBadges', 'License Badges', true, 10, 'text', 'remark'),
    (v_footer, 'content', 'Content', true, 20, 'text', 'multi');
end $$;
