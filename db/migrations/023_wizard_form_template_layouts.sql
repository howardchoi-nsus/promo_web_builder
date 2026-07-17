create table if not exists wizard_form_template_layouts (
  id uuid primary key default gen_random_uuid(),
  form_template_id uuid not null references wizard_form_templates(id) on delete cascade,
  renderer_key text not null default 'default-promo-renderer',
  renderer_version integer not null default 1 check (renderer_version > 0),
  contract_version integer not null default 1 check (contract_version > 0),
  layout_revision integer not null default 1 check (layout_revision > 0),
  layout_spec jsonb not null default '{}'::jsonb,
  validation_result jsonb not null default '{}'::jsonb,
  change_note text not null default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint wizard_form_template_layouts_template_uidx unique(form_template_id)
);

create index if not exists wizard_form_template_layouts_updated_idx
  on wizard_form_template_layouts(updated_at desc);

create table if not exists wizard_form_template_layout_histories (
  id uuid primary key default gen_random_uuid(),
  form_template_id uuid references wizard_form_templates(id) on delete set null,
  template_key text not null default '',
  template_version integer,
  layout_id uuid,
  previous_revision integer,
  new_revision integer,
  action text not null check (action in ('create', 'clone', 'update', 'activate')),
  previous_spec jsonb,
  new_spec jsonb,
  validation_result jsonb not null default '{}'::jsonb,
  change_note text not null default '',
  created_at timestamptz not null default now()
);

create index if not exists wizard_form_template_layout_histories_template_idx
  on wizard_form_template_layout_histories(form_template_id, created_at desc);

create table if not exists wizard_layout_usage_events (
  id uuid primary key default gen_random_uuid(),
  client_event_id text,
  event_name text not null check (event_name in (
    'layout_loaded', 'layout_load_failed', 'layout_edit_started',
    'item_moved', 'item_style_changed', 'section_resized',
    'item_reset', 'layout_reset', 'layout_completed', 'run_snapshot_created'
  )),
  session_id text not null,
  run_id uuid references promo_generation_runs(id) on delete set null,
  form_template_id uuid references wizard_form_templates(id) on delete set null,
  template_key text not null default '',
  template_version integer,
  config_revision text not null default '',
  layout_revision integer,
  target_key text not null default '',
  change_summary jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create unique index if not exists wizard_layout_usage_events_client_uidx
  on wizard_layout_usage_events(client_event_id)
  where client_event_id is not null and client_event_id <> '';

create index if not exists wizard_layout_usage_events_template_idx
  on wizard_layout_usage_events(form_template_id, created_at desc);

insert into wizard_form_template_layouts (
  form_template_id, renderer_key, renderer_version, contract_version,
  layout_revision, layout_spec, validation_result, change_note
)
select
  id, 'default-promo-renderer', 1, 1, 1,
  '{
    "contractVersion": 1,
    "specKey": "admin-default",
    "theme": {
      "backgroundColor": "#f5f7fb",
      "backgroundImage": "",
      "backgroundImageName": "",
      "textColor": "#172033",
      "accentColor": "#156b5b",
      "fontFamily": "Inter, Pretendard, sans-serif"
    },
    "responsive": {
      "contentMaxWidth": 1440,
      "contentMinWidth": 1140,
      "mobileBreakpoint": 720
    },
    "itemStyles": {},
    "sectionStyles": {}
  }'::jsonb,
  '{"ok":true,"errors":[],"warnings":[]}'::jsonb,
  'Default layout backfilled by migration 023.'
from wizard_form_templates
on conflict (form_template_id) do nothing;

comment on table wizard_form_template_layouts is
  'Admin-managed default layout for each versioned Wizard form template.';
comment on table wizard_layout_usage_events is
  'Wizard run-level layout interaction events. Never writes back to Admin templates.';
